const express = require('express');
const cors = require('cors');

// create de server
const app = express();

// enable cors
app.use(cors());

// enable express.json
app.use(express.json({ extended: true }));

module.exports = app;