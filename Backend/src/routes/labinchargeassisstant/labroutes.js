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
            case 'active': return '1';
            case 'maintenance': return '2';
            case 'damaged': return '0';
            default: return '1';
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
                    case '1': return 'active';
                    case '2': return 'maintenance';
                    case '0': return 'damaged';
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
                case '1': return 'active';
                case '2': return 'maintenance'; 
                case '0': return 'damaged';
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

router.put('/equipment/:equipmentId', updateEquipmentHandler);

module.exports = router;