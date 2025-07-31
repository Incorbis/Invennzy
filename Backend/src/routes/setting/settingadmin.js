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

const bcrypt = require('bcryptjs');

router.post('/admin/update-profile', verifyToken, async (req, res) => {
  const { name, phone, department, newPassword } = req.body;
  const { email: userEmail } = req.user; // from JWT

  console.log('[🔐 Incoming Update]', { userEmail, name, phone, department, newPassword });

  if (!name || !phone || !department) {
    console.log('[⚠️ Validation Failed] Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // 1. Check if user exists
    const [rows] = await db.query(
      `SELECT * FROM settingsadmin WHERE adminemail = ?`,
      [userEmail]
    );

    if (rows.length === 0) {
      console.log('[❌ User Not Found]', userEmail);
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    // 2. Update profile fields in settingsadmin
    await db.query(
      `UPDATE settingsadmin 
       SET full_name = ?, phone_number = ?, Department = ? 
       WHERE adminemail = ?`,
      [name, phone, department, userEmail]
    );

    console.log('[✅ Profile Info Updated]');

    // 3. Update password if provided
    if (newPassword && newPassword.trim() !== "") {
      console.log('[🔁 Password Update Attempt]');
      const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

      // ✅ Update in settingsadmin
      await db.query(
        `UPDATE settingsadmin SET password = ? WHERE adminemail = ?`,
        [hashedPassword, userEmail]
      );

      // ✅ Also update in admin table (used for login)
      await db.query(
        `UPDATE admin SET password = ? WHERE email = ?`,
        [hashedPassword, userEmail]
      );

      console.log('[✅ Password Updated in Both Tables]');
    } else {
      console.log('[ℹ️ No New Password Provided or Empty]');
    }

    return res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('[💥 Profile update error]:', error);
    return res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

module.exports = router;
