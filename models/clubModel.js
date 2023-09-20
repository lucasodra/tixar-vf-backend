const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: String,
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    unique: true
  }],
  codes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Code',
    unique: true
  }]
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
