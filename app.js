const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./serverRoutes');
const rateLimit = require('express-rate-limit');
const { blockIPs } = require('./middleware/ipFilter');

app.use(blockIPs);
// Define the rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 50,                  // Limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply the rate limiter to all routes
app.use(apiLimiter);


app.use(bodyParser.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app; 
