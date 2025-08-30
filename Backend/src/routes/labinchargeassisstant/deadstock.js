const express = require('express');
const router = express.Router();
const db = require('../../db');

// Fetch ALL deadstock rows, grouped by deadstock_id
router.get("/fetch/deadstock", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM deadstock ORDER BY deadstock_id");

    // Grouping logic
    const grouped = rows.reduce((acc, row) => {
      const id = row.deadstock_id;
      if (!acc[id]) {
        acc[id] = [];
      }
      acc[id].push(row);
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    console.error("Error fetching deadstock:", error);
    res.status(500).json({ error: "Failed to fetch deadstock" });
  }
});

router.post("/deadstock", async (req, res) => {
  try {
    const {
      deadstock_id,  // ✅ new field
      po_no,
      purchase_year,
      equipment_name,
      ds_number,
      quantity,
      unit_rate,
      cost,
      remark,
    } = req.body;

    // Validation
    if (!deadstock_id || !purchase_year || !equipment_name || !ds_number || !quantity || !unit_rate || !cost) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      INSERT INTO dead_stock_requirements 
        (deadstock_id, po_no, purchase_year, equipment_name, ds_number, quantity, unit_rate, cost, remark)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      deadstock_id,  // ✅ store it
      po_no || null,
      purchase_year,
      equipment_name,
      ds_number,
      quantity,
      unit_rate,
      cost,
      remark || null,
    ]);

    res.status(201).json({ message: "Dead stock record added", id: result.insertId });
  } catch (error) {
    console.error("Error inserting dead stock record:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;