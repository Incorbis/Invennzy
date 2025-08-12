const express = require('express');
const router = express.Router();
const db = require('../../db'); // must support promise-based queries (mysql2/promise or similar)

/**
 * GET /labs/equipment/:labId
 * Returns: { counts, items, grouped }
 */
router.get('/labs/equipment/:labId', async (req, res) => {
  try {
    const { labId } = req.params;
    if (!labId) return res.status(400).json({ error: 'labId required' });

    const query = `
      SELECT
        equipment_id AS id,
        equipment_name,
        equipment_code,
        equipment_type AS type,
        equipment_status AS status,
        equipment_password AS password,
        equipment_description AS description,
        lab_id
      FROM equipment_details
      WHERE lab_id = ?
      ORDER BY equipment_type, equipment_id
    `;
    const [rows] = await db.query(query, [labId]);

    const grouped = {
      monitor: [],
      projector: [],
      switch_board: [],
      fan: [],
      wifi: [],
    };

    rows.forEach(r => {
      if (!grouped[r.type]) grouped[r.type] = [];
      grouped[r.type].push(r);
    });

    const counts = {};
    Object.keys(grouped).forEach(k => (counts[k] = grouped[k].length));

    res.json({ counts, items: rows, grouped });
  } catch (err) {
    console.error('GET /labs/equipment error:', err);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Helper: map plural to DB enum type
const typeMap = {
  monitors: 'monitor',
  monitor: 'monitor',
  projectors: 'projector',
  projector: 'projector',
  switch_boards: 'switch_board',
  switchboard: 'switch_board',
  fans: 'fan',
  fan: 'fan',
  wifi: 'wifi'
};

// Helper: get lab_id from staff table
const getLabIdFromStaff = async (staffId) => {
  const [rows] = await db.query(`SELECT lab_id FROM staff WHERE staff_id = ? LIMIT 1`, [staffId]);
  return rows.length ? rows[0].lab_id : null;
};

router.put('/equipment/:equipmentId', async (req, res) => {
  const rawId = req.params.equipmentId;
  const {
    equipment_name,
    equipment_code,
    equipment_status,
    equipment_password,
    equipment_description
  } = req.body;

  // Get staffId from header
  const staffId = req.headers['x-staff-id'];

  // Validate required fields
  if (!equipment_name || !equipment_code || !equipment_status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Map status text to DB enum
  const statusMap = {
    active: '0',
    maintenance: '1',
    damaged: '2'
  };
  const statusValue = statusMap[equipment_status.toLowerCase()];
  if (statusValue === undefined) {
    return res.status(400).json({ error: 'Invalid equipment_status' });
  }

  let equipmentId = null;

  // If numeric, use directly
  if (/^\d+$/.test(rawId)) {
    equipmentId = parseInt(rawId, 10);
  } 
  // Else if placeholder like monitors_1
  else if (rawId.includes('_') && staffId) {
    const labId = await getLabIdFromStaff(staffId);
    if (!labId) return res.status(404).json({ error: 'Lab not found for staff' });

    const [typeKey, indexStr] = rawId.split('_');
    const type = typeMap[typeKey];
    const index = parseInt(indexStr, 10) - 1;

    if (!type || index < 0) return res.status(400).json({ error: 'Invalid placeholder ID' });

    const [rows] = await db.query(
      `SELECT equipment_id FROM equipment_details 
       WHERE lab_id = ? AND equipment_type = ? 
       ORDER BY equipment_id ASC LIMIT 1 OFFSET ?`,
      [labId, type, index]
    );
    if (!rows.length) return res.status(404).json({ error: 'Equipment not found' });

    equipmentId = rows[0].equipment_id;
  }

  if (!equipmentId) {
    return res.status(404).json({ error: 'Could not resolve equipment ID' });
  }

  // Update query
  await db.query(
    `UPDATE equipment_details 
     SET equipment_name = ?, equipment_code = ?, equipment_status = ?, 
         equipment_password = ?, equipment_description = ? 
     WHERE equipment_id = ?`,
    [
      equipment_name,
      equipment_code,
      statusValue,
      equipment_password || null,
      equipment_description || null,
      equipmentId
    ]
  );

  res.json({ message: 'Equipment updated successfully', id: equipmentId });
});

module.exports = router;