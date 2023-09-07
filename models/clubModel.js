const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: String,
  members: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  codes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Code'
  }
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
