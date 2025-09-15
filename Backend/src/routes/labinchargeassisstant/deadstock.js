const express = require('express');
const router = express.Router();
const db = require('../../db');
const PDFDocument = require("pdfkit");
const path = require("path");


// Example usage
const filePath = path.join(__dirname, "uploads", "report.pdf");
// Fetch ALL deadstock rows, grouped by deadstock_id
router.get("/fetch/deadstock", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM dead_stock_requirements ORDER BY deadstock_id");

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
      deadstock_id,
      po_no,
      purchase_year,
      equipment_name,
      ds_number,
      quantity,
      unit_rate,
      cost,
      remark,
      staff_id   // ✅ receive staff_id
    } = req.body;

    // Validation
    if (!deadstock_id || !purchase_year || !equipment_name || !ds_number || !quantity || !unit_rate || !cost || !staff_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      INSERT INTO dead_stock_requirements 
        (deadstock_id, po_no, purchase_year, equipment_name, ds_number, quantity, unit_rate, cost, remark, staff_id, date_submitted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db.query(query, [
      deadstock_id,
      po_no || null,
      purchase_year,
      equipment_name,
      ds_number,
      quantity,
      unit_rate,
      cost,
      remark || null,
      staff_id   // ✅ store in DB
    ]);

    res.status(201).json({ message: "Dead stock record added", id: result.insertId });
  } catch (error) {
    console.error("Error inserting dead stock record:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/download/deadstock-report/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // ✅ Fetch data first
    const [rows] = await db.query(
      "SELECT * FROM dead_stock_requirements WHERE deadstock_id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "No records found for this deadstockId" });
    }

    // ✅ Start PDF generation
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=deadstock_report_${id}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // ✅ Logo
    const logoPath = path.join(__dirname, "../../uploads/image.png");
    doc.image(logoPath, 260, 30, { width: 70, height: 70 });
    doc.moveDown(5);

    // Header
    doc.font("Helvetica-Bold").fontSize(14).text(
      "Pimpri Chinchwad Education Trust's",
      { align: "center" }
    );
    doc.fontSize(13).text(
      "Pimpri Chinchwad College of Engineering & Research, Ravet.",
      { align: "center" }
    );
    doc.moveDown(0.3);
    doc.fontSize(12).text("Department of Computer Engineering", { align: "center" });
    doc.moveDown(2);

    // Table Header
    const headers = [
      "Sr.No",
      "P.O. No With date",
      "Purchase Year",
      "Name of Equipment",
      "Dead Stock Number",
      "Qty",
      "Unit Rate (₹)",
      "Cost (₹)",
      "Remark",
    ];
    const colWidths = [40, 60, 50, 120, 100, 50, 50, 70, 70];
    const startX = doc.x;
    let startY = doc.y;

    headers.forEach((header, i) => {
      doc.font("Helvetica-Bold").fontSize(9).text(
        header,
        startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
        startY,
        { width: colWidths[i], align: "center" }
      );
    });

    doc.moveDown(1.5);
    startY = doc.y;

    // Table Rows
    rows.forEach((row, index) => {
      const rowData = [
        index + 1,
        row.po_no || "N/A",
        row.purchase_year || "N/A",
        row.equipment_name || "N/A",
        row.ds_number || "N/A",
        row.quantity || "N/A",
        row.unit_rate || "N/A",
        row.cost || "N/A",
        row.remark || "N/A",
      ];

      rowData.forEach((data, i) => {
        doc.font("Helvetica").fontSize(9).text(
          data.toString(),
          startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
          startY,
          { width: colWidths[i], align: "center" }
        );
      });

      startY += 20;
    });

    doc.end(); // ✅ End PDF properly

  } catch (err) {
    console.error("PDF generation error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error generating report" });
    }
  }
});

router.put("/update/deadstock-status/:deadstockId", async (req, res) => {
  const { deadstockId } = req.params;
  const { status } = req.body;

  // ✅ Only allow enum values
  const allowedStatuses = ["approved", "rejected"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const [result] = await db.execute(
      "UPDATE dead_stock_requirements SET status = ? WHERE deadstock_id = ?",
      [status, deadstockId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Deadstock item not found" });
    }

    res.json({ message: "Status updated successfully", deadstockId, status });
  } catch (err) {
    console.error("DB update error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


module.exports = router;