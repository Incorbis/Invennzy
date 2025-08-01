const express = require('express');
const router = express.Router();
const Lab = require('../models/Labs');

// ✅ GET /api/labs/admin/:adminId — Get labs by admin
router.get('/admin/:adminId', async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const labs = await Lab.findByAdminId(adminId);
    res.status(200).json(labs);
  } catch (error) {
    console.error('Error fetching labs for admin:', error);
    res.status(500).json({ error: 'Failed to fetch labs for admin' });
  }
});

// ✅ GET /api/labs — Get all labs (not filtered)
router.get('/', async (req, res) => {
  try {
    const labs = await Lab.findAll();
    res.status(200).json(labs);
  } catch (error) {
    console.error('Error fetching all labs:', error);
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
});

// ✅ GET /api/labs/:id — Get a specific lab by ID
router.get('/:id', async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    res.status(200).json(lab);
  } catch (error) {
    console.error('Error fetching lab by ID:', error);
    res.status(500).json({ error: 'Failed to fetch lab' });
  }
});

// ✅ POST /api/labs — Create a new lab
router.post('/', async (req, res) => {
  try {
    const {
      labNo, labName, building, floor, capacity, monitors, projectors,
      switchBoards, fans, wifi, inchargeName, inchargeEmail, inchargePhone,
      assistantName, assistantEmail, assistantPhone, status, adminId
    } = req.body;

    // Validate required fields
    if (!labNo || !labName || !building || !floor || !adminId) {
      return res.status(400).json({ error: 'Missing required fields (lab info or adminId)' });
    }

    const newLab = await Lab.create({
      labNo, labName, building, floor, capacity, monitors, projectors,
      switchBoards, fans, wifi, inchargeName, inchargeEmail, inchargePhone,
      assistantName, assistantEmail, assistantPhone, status, adminId
    });

    res.status(201).json(newLab);
  } catch (error) {
    console.error('Error creating lab:', error);
    res.status(500).json({ error: 'Failed to create lab' });
  }
});

// ✅ PUT /api/labs/:id — Update a lab
router.put('/:id', async (req, res) => {
  try {
    const {
      labNo, labName, building, floor, capacity, monitors, projectors,
      switchBoards, fans, wifi, inchargeName, inchargeEmail, inchargePhone,
      assistantName, assistantEmail, assistantPhone, status
    } = req.body;

    const updated = await Lab.update(req.params.id, {
      labNo, labName, building, floor, capacity, monitors, projectors,
      switchBoards, fans, wifi, inchargeName, inchargeEmail, inchargePhone,
      assistantName, assistantEmail, assistantPhone, status
    });

    if (!updated) {
      return res.status(404).json({ error: 'Lab not found or update failed' });
    }

    // Fetch and return updated lab
    const updatedLab = await Lab.findById(req.params.id);
    res.status(200).json(updatedLab);
  } catch (error) {
    console.error('Error updating lab:', error);
    res.status(500).json({ error: 'Failed to update lab' });
  }
});

// ✅ DELETE /api/labs/:id — Delete a lab
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Lab.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Lab not found or delete failed' });
    }

    res.status(200).json({ message: 'Lab deleted successfully' });
  } catch (error) {
    console.error('Error deleting lab:', error);
    res.status(500).json({ error: 'Failed to delete lab' });
  }
});

module.exports = router;
