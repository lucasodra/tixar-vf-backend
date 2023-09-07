const express = require('express');
const router = express.Router();
const serverController = require('./serverController');

// Routes for Club
router.post('/clubs', serverController.createClub);
router.put('/clubs/:clubId', serverController.updateClubName);

// Routes for Code
router.post('/codes', serverController.createCode);
router.put('/codes/:codeId/description', serverController.updateCodeDescription);
router.put('/codes/:codeId/expiry', serverController.updateCodeExpiry);
router.put('/codes/:codeId/status', serverController.updateCodeStatus);

// Routes for Fan
router.post('/fans', serverController.createFan);
router.put('/fans/:fanId/mobile', serverController.updateFanMobile);
router.put('/fans/:fanId/email', serverController.updateFanEmail);
router.put('/fans/:fanId/rtid', serverController.setFanRtId);

// Routes for Profile
router.post('/profiles', serverController.createProfile);

// Route for activating a code with an identifier
router.post('/activate-code', serverController.activateCode);

module.exports = router;
