const express = require('express');
const router = express.Router();
const db = require('../../db');
const PDFDocument = require("pdfkit");
const path = require("path");


// Example usage
const filePath = path.join(__dirname, "uploads", "report.pdf");
// ✅ Fetch ALL deadstock rows, grouped by deadstock_id
router.get("/fetch/deadstock", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT d.id, d.deadstock_id, d.po_no, d.date_submitted, d.status, d.quantity, d.remark, d.equipment_name, d.purchase_year, d.ds_number, d.cost, d.staff_id, l.name FROM dead_stock_requirements d JOIN labassistant l ON d.staff_id = l.staff_id");

    // Grouping logic
    // const grouped = rows.reduce((acc, row) => {
    //   const id = row.deadstock_id;
    //   if (!acc[id]) {
    //     acc[id] = [];
    //   }
    //   acc[id].push(row);
    //   return acc;
    // }, {});

    res.json(rows);
  } catch (error) {
    console.error("Error fetching deadstock:", error);
    res.status(500).json({ error: "Failed to fetch deadstock" });
  }
});


// ✅ Add a new deadstock record with GST handling
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
      gst_rate,
      remark,
    } = req.body;

    // Validation
    if (
      !deadstock_id ||
      !purchase_year ||
      !equipment_name ||
      !ds_number ||
      !quantity ||
      !unit_rate ||
      gst_rate == null // must explicitly check since 0 is valid
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Cost & GST calculations
    const subtotal_excl_gst = quantity * unit_rate;
    const gst_amount = (subtotal_excl_gst * gst_rate) / 100;
    const total_incl_gst = subtotal_excl_gst + gst_amount;

    const query = `
      INSERT INTO dead_stock_requirements 
        (deadstock_id, po_no, purchase_year, equipment_name, ds_number, quantity, unit_rate, gst_rate, cost, remark, date_submitted, subtotal_excl_gst, gst_amount, total_incl_gst)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      deadstock_id,
      po_no || null,
      purchase_year,
      equipment_name,
      ds_number,
      quantity,
      unit_rate,
      gst_rate,
      subtotal_excl_gst, // 🔹 cost = same as subtotal_excl_gst for backward compatibility
      remark || null,
      subtotal_excl_gst,
      gst_amount,
      total_incl_gst,
    ]);

    res.status(201).json({
      message: "Dead stock record added",
      id: result.insertId,
      data: {
        deadstock_id,
        po_no,
        purchase_year,
        equipment_name,
        ds_number,
        quantity,
        unit_rate,
        gst_rate,
        subtotal_excl_gst,
        gst_amount,
        total_incl_gst,
        remark
      }
    });
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
    const doc = new PDFDocument({ 
      margin: 40, 
      size: "A4" 
    });
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition", 
      `attachment; filename=deadstock_report_${id}.pdf`
    );
    doc.pipe(res);

    // =====================================================
    // HEADER SECTION WITH ALIGNED TEXT BETWEEN LOGOS
    // =====================================================
    const leftLogoPath = path.join(__dirname, "../../uploads/left_logo.jpg");
    const rightLogoPath = path.join(__dirname, "../../uploads/right_logo.png");
    
    // Calculate positions
    const pageWidth = doc.page.width;
    const leftLogoX = 60;  // Left logo position
    const rightLogoX = pageWidth - 130;  // Right logo position (60 margin + 70 width)
    const logoTopY = 30;
    const logoWidth = 70;
    const logoHeight = 70;
    
    // Left Logo
    doc.image(leftLogoPath, leftLogoX, logoTopY, { 
      width: logoWidth, 
      height: logoHeight 
    });
    
    // Right Logo
    doc.image(rightLogoPath, rightLogoX, logoTopY, { 
      width: logoWidth, 
      height: logoHeight 
    });
    
    // Header text - positioned to align with logos (between them vertically)
    // Calculate the center area between logos
    const textStartX = leftLogoX + logoWidth + 10; // 10px padding from left logo
    const textEndX = rightLogoX - 10; // 10px padding from right logo
    const textWidth = textEndX - textStartX;
    const textCenterY = logoTopY + (logoHeight / 2) - 30; // Center vertically with logos
    
    // Set Y position for header text to align with logos
    doc.y = textCenterY;
    
    doc.font("Helvetica-Bold")
       .fontSize(14)
       .text("Pimpri Chinchwad Education Trust's", textStartX, doc.y, {
         width: textWidth,
         align: "center"
       });
    
    doc.fontSize(13)
       .text("Pimpri Chinchwad College of Engineering & Research Ravet, Pune", textStartX, doc.y + 2, {
         width: textWidth,
         align: "center"
       });
    
    doc.fontSize(10)
       .text("An Autonomous Institute | NBA Accredited (4 UG Programs) | NAAC A++ Accredited | ISO 21001:2018 Certified", textStartX, doc.y + 2, {
         width: textWidth,
         align: "center"
       });
    
    doc.font("Helvetica-Bold")
       .fontSize(11)
       .text("IQAC PCCOER", textStartX, doc.y + 3, {
         width: textWidth,
         align: "center"
       });

    // Move Y position below the logos for next content
    doc.y = logoTopY + logoHeight + 20;
    doc.moveDown(1);

    // =====================================================
    // DEADSTOCK ID SECTION - CENTERED
    // =====================================================
    doc.moveDown(2);
    doc.font("Helvetica-Bold")
       .fontSize(12)
       .text(`Deadstock ID: ${id}`, 0, doc.y, {
         width: pageWidth,
         align: "center"
       });
    doc.moveDown(1.5);

    // =====================================================
    // TABLE HEADER - SIMPLIFIED WITHOUT EXTRA COLUMNS
    // =====================================================
    const headers = [
      "Sr.No", 
      "PO No", 
      "Purchase Year", 
      "Equipment Name", 
      "DS No", 
      "Qty", 
      "Unit Rate (Rs)", 
      "GST (%)", 
      "Cost (Rs)", 
      "Remark"
    ];
    
    // Adjusted column widths and position - better spacing for DS No
    const colWidths = [30, 55, 50, 90, 80, 30, 60, 40, 60, 75];
    const startX = 15; // Shifted even more to the left
    let currentY = doc.y;

    // Draw table header with border
    doc.rect(startX, currentY - 5, colWidths.reduce((a, b) => a + b, 0), 25)
       .stroke();

    headers.forEach((header, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.font("Helvetica-Bold")
         .fontSize(9)
         .text(header, x + 2, currentY, {
           width: colWidths[i] - 4,
           align: "center"
         });
    });

    currentY += 25;

    // =====================================================
    // TABLE ROWS WITH CALCULATIONS
    // =====================================================
    let grandSubtotal = 0;
    let grandGSTAmount = 0;
    let grandTotal = 0;

    rows.forEach((row, index) => {
      // Calculate values
      const unitRate = parseFloat(row.unit_rate) || 0;
      const quantity = parseInt(row.quantity) || 0;
      const gstRate = parseFloat(row.gst_rate) || 0;
      
      const subtotal = unitRate * quantity;
      const gstAmount = (subtotal * gstRate) / 100;
      const total = subtotal + gstAmount;
      
      // Add to grand totals
      grandSubtotal += subtotal;
      grandGSTAmount += gstAmount;
      grandTotal += total;

      const rowData = [
        (index + 1).toString(),
        row.po_no || "N/A",
        row.purchase_year || "N/A", 
        row.equipment_name || "N/A",
        row.ds_number || "N/A", // This should now be visible
        quantity.toString(),
        unitRate.toFixed(2),
        gstRate.toFixed(2),
        total.toFixed(2),
        row.remark
      ];

      // Draw row border
      doc.rect(startX, currentY - 5, colWidths.reduce((a, b) => a + b, 0), 20)
         .stroke();

      rowData.forEach((data, i) => {
        const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.font("Helvetica")
           .fontSize(8)
           .text(data, x + 2, currentY, {
             width: colWidths[i] - 4,
             align: "center"
           });
      });

      currentY += 20;
      
      // Check if we need a new page
      if (currentY > doc.page.height - 150) {
        doc.addPage();
        currentY = 50;
      }
    });

    doc.moveDown(2);
    currentY = doc.y;

    // =====================================================
    // TOTALS SECTION - adjusted position
    // =====================================================
    const totalsStartX = pageWidth - 280; // Moved slightly left
    
    doc.font("Helvetica-Bold")
       .fontSize(10);
    
    // Subtotal
    doc.text("Subtotal (Excl. GST):", totalsStartX, currentY);
    doc.text(`Rs ${grandSubtotal.toFixed(2)}`, totalsStartX + 150, currentY);
    currentY += 20;
    
    // GST Amount  
    doc.text("GST Amount:", totalsStartX, currentY);
    doc.text(`Rs ${grandGSTAmount.toFixed(2)}`, totalsStartX + 150, currentY);
    currentY += 20;
    
    // Total
    doc.fontSize(12);
    doc.text("Total Cost:", totalsStartX, currentY);
    doc.text(`Rs ${grandTotal.toFixed(2)}`, totalsStartX + 150, currentY);
    
    doc.moveDown(4);

    // =====================================================
    // SIGNATURE SECTION - PROPERLY POSITIONED WITHOUT LINES
    // =====================================================
    const signatureY = doc.y + 60;
    
    doc.font("Helvetica-Bold")
       .fontSize(11);
    
    // Lab Assistant signature (left side)
    doc.text("Lab Assistant", 80, signatureY);
    
    // Head of Department signature (right side)  
    doc.text("Head of Department", pageWidth - 200, signatureY);

    // =====================================================
    doc.end();
    
  } catch (err) {
    console.error("PDF generation error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error generating report" });
    }
  }
});

module.exports = router;