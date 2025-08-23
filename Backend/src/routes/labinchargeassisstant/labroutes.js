const express = require('express');
const router = express.Router();
const db = require('../../db'); // mysql2 pool.promise()

/** Helper: map DB row to clean payload */
function mapRow(r) {
  const status_raw = String(r.equipment_status);
  const status_text =
    status_raw === '0' ? 'active' :
    status_raw === '1' ? 'maintenance' :
    'damaged';

  return {
    equipment_id: r.equipment_id,
    equipment_name: r.equipment_name,
    equipment_code: r.equipment_code,
    equipment_type: r.equipment_type,
    equipment_status: status_raw,
    status_text,
    equipment_password: r.equipment_password,
    equipment_description: r.equipment_description,
    lab_id: r.lab_id,
    updated_at: r.updated_at || null,
  };
}

/** ------------------------------
 * Helper: get lab_id for a staff
 * ------------------------------ */
async function getLabIdForStaff(staffId) {
  const [rows] = await db.query(`SELECT lab_id FROM staff WHERE id = ? LIMIT 1`, [staffId]);
  if (rows.length === 0) return null;
  return rows[0].lab_id || null;
}

/** ------------------------------
 * GET: all equipment for staff → lab → equipment
 * ------------------------------ */
router.get('/labs/equipment/by-staff/:staffId', async (req, res) => {
  try {
    const staffId = parseInt(req.params.staffId, 10);
    if (Number.isNaN(staffId)) return res.status(400).json({ error: 'Invalid staff ID' });

    const labId = await getLabIdForStaff(staffId);
    if (!labId) return res.status(404).json({ error: 'No lab assigned to this staff' });

    const [equipRows] = await db.query(
      `SELECT equipment_id, lab_id, equipment_name, equipment_code, equipment_type,
              equipment_status, equipment_password, equipment_description, updated_at
       FROM equipment_details
       WHERE lab_id = ?
       ORDER BY equipment_type, equipment_code`,
      [labId]
    );

    const items = equipRows.map(mapRow);

    const grouped = { monitors: [], projectors: [], switch_boards: [], fans: [], wifi: [] };
    for (const item of items) {
      const key =
        item.equipment_type === 'monitor' ? 'monitors' :
        item.equipment_type === 'projector' ? 'projectors' :
        item.equipment_type === 'switch_board' ? 'switch_boards' :
        item.equipment_type === 'wifi' ? 'wifi' : 'fans';
      grouped[key].push(item);
    }

    const counts = Object.fromEntries(Object.entries(grouped).map(([k, v]) => [k, v.length]));
    res.json({ counts, items, grouped });
  } catch (err) {
    console.error('Error fetching equipment by staff:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/** ------------------------------
 * GET: single equipment by ID (with staff check)
 * ------------------------------ */
router.get('/labs/equipment/:staffId/:equipmentId', async (req, res) => {
  try {
    const staffId = parseInt(req.params.staffId, 10);
    const id = parseInt(req.params.equipmentId, 10);
    if (Number.isNaN(staffId) || Number.isNaN(id))
      return res.status(400).json({ error: 'Invalid ID' });

    const labId = await getLabIdForStaff(staffId);
    if (!labId) return res.status(404).json({ error: 'No lab assigned to this staff' });

    const [rows] = await db.query(
      `SELECT equipment_id, lab_id, equipment_name, equipment_code, equipment_type,
              equipment_status, equipment_password, equipment_description, updated_at
       FROM equipment_details
       WHERE equipment_id = ? AND lab_id = ? LIMIT 1`,
      [id, labId]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

    res.json({ equipment: mapRow(rows[0]) });
  } catch (err) {
    console.error('Error fetching equipment:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/** ------------------------------
 * PUT: update equipment (staff restricted)
 * ------------------------------ */
router.put('/labs/equipment/:staffId/:equipmentId', async (req, res) => {
  try {
    const staffId = parseInt(req.params.staffId, 10);
    const id = parseInt(req.params.equipmentId, 10);
    if (Number.isNaN(staffId) || Number.isNaN(id))
      return res.status(400).json({ error: 'Invalid ID' });

    const labId = await getLabIdForStaff(staffId);
    if (!labId) return res.status(404).json({ error: 'No lab assigned to this staff' });

    const {
      equipment_name,
      equipment_code,
      equipment_status,
      equipment_password,
      equipment_description,
    } = req.body || {};

    // check ownership
    const [checkRows] = await db.query(
      `SELECT equipment_id FROM equipment_details WHERE equipment_id = ? AND lab_id = ?`,
      [id, labId]
    );
    if (checkRows.length === 0) return res.status(404).json({ error: 'Equipment not found' });

    try {
      await db.query(
        `UPDATE equipment_details
         SET equipment_name = ?,
             equipment_code = ?,
             equipment_status = ?,
             equipment_password = ?,
             equipment_description = ?,
             updated_at = NOW()
         WHERE equipment_id = ? AND lab_id = ?`,
        [
          equipment_name || null,
          equipment_code || null,
          equipment_status ?? '0',
          equipment_password || null,
          equipment_description || null,
          id,
          labId,
        ]
      );
    } catch (updErr) {
      if (updErr.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'equipment_code must be unique' });
      }
      throw updErr;
    }

    const [rows2] = await db.query(
      `SELECT equipment_id, lab_id, equipment_name, equipment_code, equipment_type,
              equipment_status, equipment_password, equipment_description, updated_at
       FROM equipment_details
       WHERE equipment_id = ? AND lab_id = ?`,
      [id, labId]
    );

    return res.json({
      success: true,
      message: 'Equipment updated successfully',
      equipment: mapRow(rows2[0]),
    });
  } catch (err) {
    console.error('Update equipment error:', err);
    res.status(500).json({ error: 'Database error while updating' });
  }
});

/** ------------------------------
 * DELETE: remove equipment (staff restricted)
 * ------------------------------ */
router.delete('/labs/equipment/:staffId/:equipmentId', async (req, res) => {
  try {
    const staffId = parseInt(req.params.staffId, 10);
    const id = parseInt(req.params.equipmentId, 10);
    if (Number.isNaN(staffId) || Number.isNaN(id))
      return res.status(400).json({ error: 'Invalid ID' });

    const labId = await getLabIdForStaff(staffId);
    if (!labId) return res.status(404).json({ error: 'No lab assigned to this staff' });

    const [result] = await db.query(
      `DELETE FROM equipment_details WHERE equipment_id = ? AND lab_id = ?`,
      [id, labId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Equipment not found' });

    return res.json({ success: true, message: 'Equipment deleted' });
  } catch (err) {
    console.error('Delete equipment error:', err);
    res.status(500).json({ error: 'Database error while deleting' });
  }
});

module.exports = router;
