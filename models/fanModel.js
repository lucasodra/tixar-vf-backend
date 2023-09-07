const mongoose = require('mongoose');

// Define the Fan schema
const fanSchema = new mongoose.Schema({
  fanMobile: {
    countryCode: {
      type: String
    },
    number: {
      type: String
    },
  },
  fanEmail: {
    type: String,
    unique: true,
    required: true
  },
  rtId: {
    type: String,
    unique: true
  },
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }]
});

// Create the Fan model
const Fan = mongoose.model('Fan', fanSchema);

module.exports = Fan;
