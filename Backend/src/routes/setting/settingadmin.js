const express = require('express');
require('dotenv').config();
const db = require('../../db');

const verifyToken = require('../../middlewares/verifytoken');
const router = express.Router();

// GET /api/settings/admin/profile
router.get('/admin/profile', verifyToken, async (req, res) => {
  try {
    const { email, role } = req.user;

    const [rows] = await db.query(
      `SELECT 
        full_name AS name, 
        adminemail AS email, 
        phone_number AS phone,      
        Department AS department,
        role
       FROM settingsadmin
       WHERE adminemail = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Profile settings not found' });
    }

    const profile = {
      name: rows[0].name || '',
      email: rows[0].email || '',
      phone: rows[0].phone || '',
      department: rows[0].department || '',
      role: rows[0].role || '' // ✅ include role
    };

    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ message: 'Failed to fetch profile settings', error: error.message });
  }
});


router.post('/admin/update-profile', verifyToken, async (req, res) => {
  const { name, phone, department, newPassword } = req.body;
  const { email: userEmail } = req.user; // from JWT

  if (!name || !phone || !department) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // ✅ Check role from DB for security
    const [rows] = await db.query(
      `SELECT * FROM settingsadmin WHERE adminemail = ?`,
      [userEmail]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    // ✅ Optional: add a check to ensure this user is actually an admin
    // You can do this if you have a `role` column in the DB
    // if (rows[0].role !== 'admin') {
    //   return res.status(403).json({ message: 'Unauthorized access' });
    // }

    // ✅ Update profile
    await db.query(
      `UPDATE settingsadmin 
       SET full_name = ?, phone_number = ?, Department = ? 
       WHERE adminemail = ?`,
      [name, phone, department, userEmail]
    );

    // ✅ Update password if provided
    if (newPassword && newPassword.trim() !== "") {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.query(
        `UPDATE settingsadmin SET password = ? WHERE adminemail = ?`,
        [hashedPassword, userEmail]
      );
    }

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

module.exports = router;
