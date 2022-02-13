const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const market = require('./routes/market');

const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');

// create de server
const app = express();

// enable cors
app.use(cors());

// connect to database
connectDB();

// enable express.json
app.use(express.json({ extended: true }));

// import routes
app.use('/markets', market);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

module.exports = app;