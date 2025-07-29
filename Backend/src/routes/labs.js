const express = require('express');
const router = express.Router();
const Lab = require('../models/Labs');

// GET /api/labs - Get all labs
router.get('/', async (req, res) => {
  try {
    const labs = await Lab.findAll();
    res.json(labs);
  } catch (error) {
    console.error('Error fetching labs:', error);
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
});

// GET /api/labs/:id - Get a specific lab
router.get('/:id', async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    res.json(lab);
  } catch (error) {
    console.error('Error fetching lab:', error);
    res.status(500).json({ error: 'Failed to fetch lab' });
  }
});

// GET /api/labs - Get all labs
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all labs...'); // Add this
    const labs = await Lab.findAll();
    console.log('Labs fetched successfully:', labs.length); // Add this
    res.json(labs);
  } catch (error) {
    console.error('Error fetching labs:', error.message); // Enhanced logging
    console.error('Stack trace:', error.stack); // Add stack trace
    res.status(500).json({ error: 'Failed to fetch labs', details: error.message });
  }
});


// POST /api/labs - Create a new lab
router.post('/', async (req, res) => {
  try {
    const {
      labNo, labName, building, floor, capacity, monitors, projectors,
      switchBoards, fans, wifi, inchargeName, inchargeEmail, inchargePhone,
      assistantName, assistantEmail, assistantPhone, status
    } = req.body;

    // Validation
    if (!labNo || !labName || !building || !floor) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newLab = await Lab.create({
      labNo, labName, building, floor, capacity, monitors, projectors,
      switchBoards, fans, wifi, inchargeName, inchargeEmail, inchargePhone,
      assistantName, assistantEmail, assistantPhone, status
    });

    res.status(201).json(newLab);
  } catch (error) {
    console.error('Error creating lab:', error);
    res.status(500).json({ error: 'Failed to create lab' });
  }
});

// PUT /api/labs/:id - Update a lab
router.put('/:id', async (req, res) => {
  try {
    const {
      labNo, labName, building, floor, capacity, monitors, projectors,
      switchBoards, fans, wifi, inchargeName, inchargeEmail, inchargePhone,
      assistantName, assistantEmail, assistantPhone, status
    } = req.body;

    await Lab.update(req.params.id, {
      labNo, labName, building, floor, capacity, monitors, projectors,
      switchBoards, fans, wifi, inchargeName, inchargeEmail, inchargePhone,
      assistantName, assistantEmail, assistantPhone, status
    });

    res.json({ message: 'Lab updated successfully' });
  } catch (error) {
    console.error('Error updating lab:', error);
    res.status(500).json({ error: 'Failed to update lab' });
  }
});

// DELETE /api/labs/:id - Delete a lab
router.delete('/:id', async (req, res) => {
  try {
    await Lab.delete(req.params.id);
    res.json({ message: 'Lab deleted successfully' });
  } catch (error) {
    console.error('Error deleting lab:', error);
    res.status(500).json({ error: 'Failed to delete lab' });
  }
});

module.exports = router;
