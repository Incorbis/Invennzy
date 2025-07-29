const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors'); 
require('./db'); 
const contactusRoute = require('./routes/Contactus/contactusRoute');
const app = express();
const authRoutes = require('./routes/auth/authRoutes');



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

app.use('/api', contactusRoute);
app.use('/api/auth', authRoutes);
app.use('/api/labs', require('./routes/labs'));



app.listen(3000, () => console.log('Server running on http://localhost:3000'));
