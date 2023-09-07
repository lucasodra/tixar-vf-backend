const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./serverRoutes'); // Import your routes file here

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define routes
app.use('/api', routes); // Use the routes defined in your routes file

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app; // Export the Express app
