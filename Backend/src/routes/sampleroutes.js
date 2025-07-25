const express = require('express');
const router = express.Router();
const db = require('../db');

// POST - Save contact message
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO contactus (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.status(200).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Fetch all messages
router.get('/contact', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contactus');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;