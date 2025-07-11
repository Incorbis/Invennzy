const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json()); // Parse JSON body
const cors = require('cors');

// Allow cross-origin requests
app.use(cors());
// Base test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// User routes
app.use('/api/user', userRoutes);

module.exports = app;
