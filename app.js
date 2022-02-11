const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// create de server
const app = express();

// enable cors
app.use(cors());

// connect to database
connectDB();

// enable express.json
app.use(express.json({ extended: true }));

module.exports = app;