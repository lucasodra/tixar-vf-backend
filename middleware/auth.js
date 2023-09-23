require('dotenv').config('../');
const jwt = require('jsonwebtoken');
const Fan = require('../models/fanModel');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer header

        if (!token) {
            return res.status(401).json({message: "unauthorized"});
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData;

        var fan = await Fan.findOne({rtId: req.user.id});

        if (!fan) {
            const newFan = new Fan({rtId: req.user.id});
            await newFan.save();
            fan = newFan;
        }
        req.fan = fan;
        
        next();
    } catch(err) {
        res.status(500).json({error: err.message});
    }
    
};
