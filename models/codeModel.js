const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club'
    },
    expires: Date,
    value: Number,
    status: String
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;
