const express = require("express");
const router = express.Router();
const db = require("../../db");

// Fetch all requests with corrective action details for admin
router.get("/admin/notifications", async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        type_of_problem,
        date,
        department,
        location,
        complaint_details,
        lab_assistant,
        hod,
        staff_id,
        assigned_person,
        verification_remarks,
        materials_used,
        resolved_inhouse,
        resolved_remark,
        consumables_needed,
        consumable_details,
        external_agency_needed,
        agency_name,
        approx_expenditure,
        admin_approval_status AS adminApprovalStatus
      FROM requests
      ORDER BY id DESC;
    `;

    const [results] = await db.query(query);

    // ✅ keep enum values as-is
    const normalized = results.map(r => ({
      ...r,
      adminApprovalStatus: r.adminApprovalStatus || "pending", // default
    }));

    res.json(normalized);

  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/assistant/details/:id/approval", async (req, res) => {
  const { id } = req.params;
  let { adminApprovalStatus } = req.body;

  // Only allow approved/rejected/pending
  const validStatuses = ["approved", "rejected", "pending"];
  if (!validStatuses.includes(adminApprovalStatus)) {
    return res.status(400).json({ error: "Invalid approval status" });
  }

  try {
    const query = `
      UPDATE requests
      SET admin_approval_status = ?
      WHERE id = ?;
    `;

    const [result] = await db.query(query, [adminApprovalStatus, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({
      message: "Approval status updated successfully",
      requestId: id,
      adminApprovalStatus,
    });
  } catch (error) {
    console.error("Error updating approval status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
