const mongoose = require('mongoose');
const app = require('./app'); // Import the Express app from app.js

// Connect to MongoDB
mongoose.connect('mongodb://localhost/tixvf', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Handle database connection errors
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Handle successful database connection
db.once('open', () => {
  console.log('Connected to MongoDB');
  
  // Start the Express server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
