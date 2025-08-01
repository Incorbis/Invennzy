const express = require('express');
const router = express.Router();
const Lab = require('../models/Labs');

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
