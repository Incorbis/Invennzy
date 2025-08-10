const express = require('express');
const router = express.Router();
const db = require('../../db'); // Add DB connection here

router.get('/labs/equipment/:staffId', (req, res) => {
    const { staffId } = req.params;

    const query = `
        SELECT id, equipment_name, equipment_code, type, status, password, description
        FROM lab_equipment_details
        WHERE lab_id = ?
    `;

    db.query(query, [lab_id], (err, results) => {
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
            if (grouped[equip.type]) {
                grouped[equip.type].push(equip);
            }
        });

        res.json(grouped);
    });
});

module.exports = router;