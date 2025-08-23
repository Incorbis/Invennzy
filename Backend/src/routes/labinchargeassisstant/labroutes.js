const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get equipment for a specific lab
router.get('/labs/equipment/:labId', (req, res) => {
    const { labId } = req.params;

    const query = `
        SELECT 
            equipment_id as id,
            equipment_name,
            equipment_code,
            equipment_type as type,
            equipment_status as status,
            equipment_password as password,
            equipment_description as description
        FROM equipment_details
        WHERE lab_id = ?
        ORDER BY equipment_type, equipment_code
    `;

    db.query(query, [labId], (err, results) => {
        if (err) {
            console.error('Error fetching equipment:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const grouped = {
            monitors: [],
            projectors: [],
            switch_boards: [],
            fans: [],
            wifi: []
        };

        results.forEach(equip => {
            const equipmentType = equip.type;
            if (grouped[equipmentType]) {
                grouped[equipmentType].push({
                    equipment_id: equip.id,
                    equipment_name: equip.equipment_name,
                    equipment_code: equip.equipment_code,
                    equipment_type: equipmentType,
                    equipment_status: equip.status,
                    equipment_password: equip.password,
                    equipment_description: equip.description
                });
            }
        });

        const counts = {};
        Object.keys(grouped).forEach(type => {
            counts[type] = grouped[type].length;
        });

        res.json({
            counts: counts,
            items: results,
            grouped: grouped
        });
    });
});

// Get labs assigned to a staff (incharge or assistant)
// routes/labs.js
router.get("/staff/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;

    // Step 1: Get staff info (with role fields + lab id)
    const [staffRows] = await db.query(
      `SELECT id, lab_id, incharge_name, incharge_email, assistant_name, assistant_email
       FROM staff WHERE id = ?`,
      [staffId]
    );

    if (staffRows.length === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    const staff = staffRows[0];

    // Step 2: Fetch lab details
    const [labRows] = await db.query(
      `SELECT * FROM labs WHERE id = ?`,
      [staff.lab_id]
    );

    if (labRows.length === 0) {
      return res.status(404).json({ error: "Lab not found" });
    }

    // Step 3: Attach role info from staff table
    const response = {
      staffId: staff.id,
      lab: labRows[0],
      incharge_name: staff.incharge_name,
      incharge_email: staff.incharge_email,
      assistant_name: staff.assistant_name,
      assistant_email: staff.assistant_email,
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching assigned lab for staff:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Handler for updating equipment details
const updateEquipmentHandler = (req, res) => {
    console.log(`API hit: PUT ${req.originalUrl}`);
    const { equipmentId } = req.params;
    const { 
        equipment_name, 
        equipment_code, 
        equipment_status, 
        equipment_password, 
        equipment_description 
    } = req.body;

    console.log('PUT equipment endpoint called');
    console.log('equipmentId:', equipmentId);
    console.log('Request body:', req.body);

    const numericId = parseInt(equipmentId.toString().replace(/[^\d]/g, ''), 10);
    if (isNaN(numericId)) {
        console.log('Invalid equipment ID format:', equipmentId);
        return res.status(400).json({ error: 'Invalid equipment ID format' });
    }

    console.log('Extracted numeric ID:', numericId);

    const mapStatusToDb = (frontendStatus) => {
        switch(frontendStatus) {
            case 'active': return '0';
            case 'maintenance': return '2';
            case 'damaged': return '1';
            default: return '0';
        }
    };

    const dbStatus = mapStatusToDb(equipment_status);
    console.log('Mapped status from', equipment_status, 'to', dbStatus);

    // Update the equipment details
    const updateQuery = `
        UPDATE equipment_details 
        SET 
            equipment_name = ?,
            equipment_code = ?,
            equipment_status = ?,
            equipment_password = ?,
            equipment_description = ?
        WHERE equipment_id = ?
    `;

    const values = [
        equipment_name,
        equipment_code,
        dbStatus,
        equipment_password || null,
        equipment_description || null,
        numericId
    ];

    console.log('Update query:', updateQuery);
    console.log('Update values:', values);

        db.query(updateQuery, values, (updateErr, updateResult) => {
        console.log('Callback for UPDATE query has been called.');
        if (updateErr) {
            console.error('Error updating equipment:', updateErr);
            return res.status(500).json({ error: 'Database error while updating equipment' });
        }

        console.log('Update result:', updateResult);

        if (updateResult.affectedRows === 0) {
            console.log('No rows affected during update. Equipment ID may not exist:', numericId);
            return res.status(404).json({ error: 'Equipment not found or no changes made' });
        }

        console.log('Equipment updated successfully, affected rows:', updateResult.affectedRows);

        // Fetch the updated equipment details to send back to the client
        const selectQuery = `
            SELECT 
                equipment_id as id,
                equipment_name,
                equipment_code,
                equipment_type as type,
                equipment_status as status,
                equipment_password as password,
                equipment_description as description,
                lab_id
            FROM equipment_details
            WHERE equipment_id = ?
        `;

        db.query(selectQuery, [numericId], (selectErr, updatedResults) => {
            if (selectErr) {
                console.error('Error fetching updated equipment:', selectErr);
                return res.status(500).json({ 
                    error: 'Equipment updated but failed to fetch updated data',
                    success: true
                });
            }

            if (updatedResults.length === 0) {
                console.log('Equipment updated but not found in fetch');
                return res.status(404).json({ 
                    error: 'Equipment updated but not found in fetch',
                    success: true
                });
            }

            const updatedEquipment = updatedResults[0];
            
            const mapStatusFromDb = (dbStatus) => {
                switch(String(dbStatus)) {
                    case '0': return 'active';
                    case '2': return 'maintenance';
                    case '1': return 'damaged';
                    default: return 'active';
                }
            };

            const responseData = {
                success: true,
                message: 'Equipment updated successfully',
                equipment: {
                    equipment_id: updatedEquipment.id,
                    equipment_name: updatedEquipment.equipment_name,
                    equipment_code: updatedEquipment.equipment_code,
                    equipment_type: updatedEquipment.type,
                    status: mapStatusFromDb(updatedEquipment.status),
                    password: updatedEquipment.password,
                    description: updatedEquipment.description, // Corrected: Include description
                    lab_id: updatedEquipment.lab_id
                }
            };
            const updated = db.query("SELECT * FROM equipment WHERE id = ?", [id]);
                res.json({ success: true, equipment: updated[0] });
            
            return res.json(responseData);
        });
    });
};

router.get('/equipment/:equipmentId', (req, res) => {
    const { equipmentId } = req.params;
    
    console.log('GET equipment endpoint called for ID:', equipmentId);
    
    const numericId = parseInt(equipmentId.toString().replace(/[^\d]/g, ''), 10);
    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid equipment ID format' });
    }
    
    const query = `
        SELECT 
            equipment_id as id,
            equipment_name,
            equipment_code,
            equipment_type as type,
            equipment_status as status,
            equipment_password as password,
            equipment_description as description,
            lab_id
        FROM equipment_details
        WHERE equipment_id = ?
    `;

    db.query(query, [numericId], (err, results) => {
        if (err) {
            console.error('Error fetching equipment:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const equipment = results[0];
        
        const mapStatusFromDb = (dbStatus) => {
            switch(String(dbStatus)) {
                case '0': return 'active';
                case '2': return 'maintenance'; 
                case '1': return 'damaged';
                default: return 'active';
            }
        };
        
        res.json({
            success: true,
            equipment: {
                equipment_id: equipment.id,
                equipment_name: equipment.equipment_name,
                equipment_code: equipment.equipment_code,
                equipment_type: equipment.type,
                status: mapStatusFromDb(equipment.status),
                password: equipment.password,
                description: equipment.description,
                lab_id: equipment.lab_id
            }
        });
    });
});

router.get("/equipment", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM equipment_details");
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("Error fetching equipment details:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch equipment details",
            error: err.message
        });
    }
});
async function getLabIdForStaff(staffId) {
  const [rows] = await db.query('SELECT lab_id FROM staff WHERE id = ? LIMIT 1', [staffId]);
  if (rows.length === 0) return null;
  return rows[0].lab_id || null;
}
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
    updated_at: r.updated_at||null,
};
}
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
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/equipment/:equipmentId', updateEquipmentHandler);

module.exports = router;
