const mongoose = require('mongoose');

// Define the Fan schema
const fanSchema = new mongoose.Schema({
  rtId: {
    type: String,
    unique: true,
    required: true
  },
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }]
});

// Create the Fan model
const Fan = mongoose.model('Fan', fanSchema);

module.exports = Fan;
