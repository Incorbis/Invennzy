const express = require('express');
const router = express.Router();
const Lab = require('../models/Labs');
const db = require('../db'); // Add DB connection here

// ✅ GET labs by adminId
router.get('/admin/:adminId', async (req, res) => {
  try {
    const labs = await Lab.findByAdminId(req.params.adminId);
    res.status(200).json(labs);
  } catch (error) {
    console.error('Error fetching labs for admin:', error);
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
});

// ✅ GET all labs
router.get('/', async (req, res) => {
  try {
    const labs = await Lab.findAll();
    res.status(200).json(labs);
  } catch (error) {
    console.error('Error fetching all labs:', error);
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
});

// ✅ NEW: GET equipment for a specific lab by labId (MOVED BEFORE /:id route)
router.get('/equipment/:labId', async (req, res) => {
  const labId = req.params.labId;

  try {
    const [rows] = await db.query(`
      SELECT monitors, projectors, switch_boards, fans, wifi
      FROM equipment
      WHERE lab_id = ?
    `, [labId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No equipment found for this lab' });
    }

    res.status(200).json(rows[0]); // Return equipment object
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// ✅ GET a single lab by ID
router.get('/:id', async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    res.status(200).json(lab);
  } catch (error) {
    console.error('Error fetching lab:', error);
    res.status(500).json({ error: 'Failed to fetch lab' });
  }
});

// ✅ POST create new lab
router.post('/', async (req, res) => {
  try {
    const {
      labNo, labName, building, floor, capacity,
      monitors, projectors, switchBoards, fans, wifi,
      inchargeName, inchargeEmail, inchargePhone,
      assistantName, assistantEmail, assistantPhone,
      status, adminId
    } = req.body;

    // Basic validation
    if (!labNo || !labName || !building || !floor || !adminId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newLab = await Lab.create({
      labNo, labName, building, floor, capacity,
      monitors, projectors, switchBoards, fans, wifi,
      inchargeName, inchargeEmail, inchargePhone,
      assistantName, assistantEmail, assistantPhone,
      status, adminId
    });

    res.status(201).json(newLab);
  } catch (error) {
    console.error('Error creating lab:', error);
    res.status(500).json({ error: 'Failed to create lab' });
  }
});

// ✅ PUT update lab
router.put('/:id', async (req, res) => {
  try {
    const updated = await Lab.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    const updatedLab = await Lab.findById(req.params.id);
    res.status(200).json(updatedLab);
  } catch (error) {
    console.error('Error updating lab:', error);
    res.status(500).json({ error: 'Failed to update lab' });
  }
});

// ✅ DELETE lab
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Lab.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    res.status(200).json({ message: 'Lab deleted successfully' });
  } catch (error) {
    console.error('Error deleting lab:', error);
    res.status(500).json({ error: 'Failed to delete lab' });
  }
});

module.exports = router;