const jwt = require('jsonwebtoken');
const Fan = require('../models/fanModel');

exports.isAuthenticated = async (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer header
    console.log(authHeader);
    if (!token) {
        return res.status(401).json({message: "unauthorized"});
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;

    var fan = Fan.findOne({rtId: req.user._id});
    if (!fan) {
        const newFan = new Fan({rtId: req.user._id});
        await newFan.save();
        fan = newFan;
    }
    req.fan = fan;
    
    next();
};
