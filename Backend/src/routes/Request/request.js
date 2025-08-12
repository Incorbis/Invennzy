const express = require("express");
const router = express.Router();
const db = require("../../db");

// =======================
// LAB IN-CHARGE ROUTES
// =======================

// Create a request
router.post("/create", async (req, res) => {
  try {
    const { form, staff_id } = req.body;

    const [result] = await db.query(`
      INSERT INTO requests (
        type_of_problem, date, department, location,
        complaint_details, recurring_complaint, recurring_times,
        lab_assistant, lab_assistant_date, hod, hod_date,
        current_step, completed_steps, staff_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)
    `, [
      form.typeOfProblem,
      form.date,
      form.department,
      form.location,
      form.complaintDetails,
      form.recurringComplaint,
      form.recurringTimes,
      form.labAssistant,
      form.labAssistantDate,
      form.hod,
      form.hodDate,
      staff_id
    ]);

    const requestId = result.insertId;

    // Add notification
    await db.query(`
      INSERT INTO notifications (user_role, type, title, message, request_id, staff_id)
      VALUES ('labassistant', 'info', 'Request Created', 'You have created a maintenance request.', ?, ?)
    `, [requestId, staff_id]);

    res.json({ success: true, requestId });
  } catch (err) {
    console.error("LIC Create Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch all requests created by a LIC (based on staff_id)
router.get("/lic/:staff_id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM requests WHERE staff_id = ?", [req.params.staff_id]);
    res.json(rows);
  } catch (err) {
    console.error("LIC Fetch Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single request by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM requests WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Request Fetch Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// =======================
// LAB ASSISTANT ROUTES
// =======================

// Fetch all requests assigned to assistant by staff_id
router.get("/assistant/:staff_id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM requests WHERE staff_id = ?", [req.params.staff_id]);
    res.json(rows);
  } catch (err) {
    console.error("Assistant Fetch Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update steps (verification, action, closure)
router.put("/assistant/:id/step", async (req, res) => {
  try {
    const { currentStep, completedSteps, message } = req.body;
    const requestId = req.params.id;

    // Update the request
    await db.query(`
      UPDATE requests SET current_step = ?, completed_steps = ? WHERE id = ?
    `, [currentStep, completedSteps, requestId]);

    // Get staff_id for this request
    const [request] = await db.query("SELECT staff_id FROM requests WHERE id = ?", [requestId]);
    const staff_id = request[0].staff_id;

    // Notify Lab In-charge
    await db.query(`
      INSERT INTO notifications (user_role, type, title, message, request_id, staff_id)
      VALUES ('labincharge', 'maintenance', 'Request Progressed', ?, ?, ?)
    `, [message, requestId, staff_id]);

    res.json({ success: true });
  } catch (err) {
    console.error("Assistant Step Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
