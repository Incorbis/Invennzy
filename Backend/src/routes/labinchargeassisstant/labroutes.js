const express = require('express');
const router = express.Router();
const db = require('../../db'); // Add DB connection here

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

// Update equipment details - IMPROVED VERSION
router.put('/equipment/:equipmentId', (req, res) => {
    console.log(`API hit: PUT /equipment/${req.params.equipmentId}`);
    const { equipmentId } = req.params;
    const { 
        equipment_name, 
        equipment_code, 
        equipment_status, 
        equipment_password, 
        equipment_description 
    } = req.body;

    // Debug logging
    console.log('PUT /equipment/:equipmentId called');
    console.log('equipmentId:', equipmentId);
    console.log('Request body:', req.body);

    // Validate equipmentId is numeric
    const numericId = parseInt(equipmentId);
    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid equipment ID format' });
    }

    // First, check if the equipment exists
    const checkQuery = `
        SELECT equipment_id, equipment_type
        FROM equipment_details 
        WHERE equipment_id = ?
    `;

    db.query(checkQuery, [numericId], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Error checking equipment existence:', checkErr);
            return res.status(500).json({ error: 'Database error while checking equipment' });
        }

        if (checkResults.length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const existingEquipment = checkResults[0];
        
        // Update the equipment
        const updateQuery = `
            UPDATE equipment_details 
            SET 
                equipment_name = ?,
                equipment_code = ?,
                equipment_status = ?,
                equipment_password = ?,
                equipment_description = ?,
                updated_at = NOW()
            WHERE equipment_id = ?
        `;

        const values = [
            equipment_name,
            equipment_code,
            equipment_status,
            equipment_password || null,
            equipment_description || null,
            numericId
        ];

        db.query(updateQuery, values, (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Error updating equipment:', updateErr);
                return res.status(500).json({ error: 'Database error while updating equipment' });
            }

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ error: 'Equipment not found or no changes made' });
            }

            // Fetch the updated equipment details
            const selectQuery = `
                SELECT 
                    equipment_id as id,
                    equipment_name,
                    equipment_code,
                    equipment_type as type,
                    equipment_status as status,
                    equipment_password as password,
                    equipment_description as description,
                    lab_id,
                    updated_at
                FROM equipment_details
                WHERE equipment_id = ?
            `;

            db.query(selectQuery, [numericId], (selectErr, updatedResults) => {
                if (selectErr) {
                    console.error('Error fetching updated equipment:', selectErr);
                    return res.status(500).json({ 
                        error: 'Equipment updated but failed to fetch updated data',
                        success: true // Still indicate success since update worked
                    });
                }

                if (updatedResults.length === 0) {
                    return res.status(404).json({ 
                        error: 'Equipment updated but not found in fetch',
                        success: true // Still indicate success since update worked
                    });
                }

                const updatedEquipment = updatedResults[0];
                
                console.log('Equipment updated successfully:', updatedEquipment);
                
                return res.json({
                    success: true,
                    message: 'Equipment updated successfully',
                    equipment: {
                        equipment_id: updatedEquipment.id,
                        equipment_name: updatedEquipment.equipment_name,
                        equipment_code: updatedEquipment.equipment_code,
                        equipment_type: updatedEquipment.type,
                        status: updatedEquipment.status,
                        password: updatedEquipment.password,
                        description: updatedEquipment.description,
                        updated_at: updatedEquipment.updated_at
                    }
                });
            });
        });
    });
});

// Alternative endpoint for lab in-charge assistant (if needed)
router.put('/labinchargeassistant/equipment/:equipmentId', (req, res) => {
    // Redirect to the main equipment update endpoint
    req.url = `/equipment/${req.params.equipmentId}`;
    return router.handle(req, res);
});

module.exports = router;