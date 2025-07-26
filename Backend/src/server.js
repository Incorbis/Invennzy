const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
require('./models/db'); 
const contactusRoute = require('./routes/contactusRoute');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', contactusRoute);


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');});