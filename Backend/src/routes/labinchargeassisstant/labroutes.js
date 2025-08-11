const express = require('express');
const router = express.Router();
const db = require('../../db'); // Add DB connection here

// Get equipment for a specific lab
router.get('/labs/equipment/:${labId}', (req, res) => {
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

        // Group data by type for frontend
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

        // Also return counts for each type
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

// Update equipment details
router.put('/equipment/:equipmentId', (req, res) => {
    const { equipmentId } = req.params;
    const { 
        equipment_name, 
        equipment_code, 
        equipment_status, 
        equipment_password, 
        equipment_description 
    } = req.body;

    if (!equipment_name || !equipment_code || !equipment_status) {
        return res.status(400).json({ 
            error: 'Missing required fields: equipment_name, equipment_code, equipment_status' 
        });
    }

    const validStatuses = ['active', 'maintenance', 'damaged'];
    if (!validStatuses.includes(equipment_status)) {
        return res.status(400).json({ 
            error: 'Invalid status. Must be one of: active, maintenance, damaged' 
        });
    }

    const query = `
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
        equipment_status,
        equipment_password || null,
        equipment_description || null,
        equipmentId
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating equipment:', err);
            return res.status(500).json({ error: 'Database error while updating equipment' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const selectQuery = `
            SELECT 
                equipment_id as id,
                equipment_name,
                equipment_code,
                equipment_type as type,
                equipment_status as status,
                equipment_password as password,
                equipment_description as description
            FROM equipment_details
            WHERE equipment_id = ?
        `;

        db.query(selectQuery, [equipmentId], (err, updatedResults) => {
            if (err) {
                console.error('Error fetching updated equipment:', err);
                return res.status(500).json({ error: 'Equipment updated but failed to fetch updated data' });
            }

            if (updatedResults.length === 0) {
                return res.status(404).json({ error: 'Equipment updated but not found' });
            }

            return res.json({
                message: 'Equipment updated successfully',
                equipment: updatedResults[0]
            });
        });
    });
});


module.exports = router;