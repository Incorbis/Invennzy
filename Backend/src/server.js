const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors'); 
require('./db'); 
const contactusRoute = require('./routes/contactusRoute');
const sampleroutes = require('./routes/sampleroutes');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

app.use('/api', contactusRoute);
app.use('/api', sampleroutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
