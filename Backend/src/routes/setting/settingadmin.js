const express = require('express');
require('dotenv').config();
const db = require('../../db');

const verifyToken = require('../../middlewares/verifytoken');
const router = express.Router();

// GET /api/settings/admin/profile
router.get('/admin/profile', verifyToken, async (req, res) => {
  try {
    const { email } = req.user; // ✅ This email comes from the decoded JWT in verifyToken

    const [rows] = await db.query(
  `SELECT 
    full_name AS name, 
    adminemail AS email, 
    phone_number AS phone,      
    Department AS department
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
  phone: rows[0].phone_number || '',
  department: rows[0].department || ''
};

    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ message: 'Failed to fetch profile settings', error: error.message });
  }
});

module.exports = router;
