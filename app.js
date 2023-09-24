const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./serverRoutes');
const rateLimit = require('express-rate-limit');


app.use(bodyParser.json());
app.use('/api', routes);

// Define the rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                  // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply the rate limiter to all routes
app.use(apiLimiter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app; 
