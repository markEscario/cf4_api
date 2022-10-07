'use strict';
const express = require('express');
const config = require('./config');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const patientsCf4Routes = require('./routes/PatientsCf4Routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// app.use('/cf4_api', userRoutes.routes);
app.use('/cf4_api', patientsCf4Routes.routes);

app.get("/", (req, res) => {
  res.json({ message: "The server is running" });
});

app.listen(config.port, () => {
  console.log('app listening on url http://localhost:' + config.port )
});