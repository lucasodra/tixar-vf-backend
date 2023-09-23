const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./serverRoutes');

app.use(bodyParser.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app; 