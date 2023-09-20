const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    fanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fan'
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    },
    points: {
        type: Number,
        default: 0
    },
    redemption: [{
        txType: String,
        txCode: String,
        txValue: Number,
        txDate: Date        
    }]
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
