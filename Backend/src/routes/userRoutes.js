const express = require('express');
const { createUser, getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.post('/create', createUser); // POST /api/users/create
router.get('/all', getAllUsers);   // GET /api/users/all (optional, to list all users)

module.exports = router;
