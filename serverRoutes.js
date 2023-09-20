const express = require('express');
const router = express.Router();

const isAuthenticated = require('./middleware/auth');
const serverController = require('./serverController');

router.use(isAuthenticated);

// Club Routes
router.post('/club', serverController.createClub);
router.get('/clubs', serverController.getAllClubs);
router.get('/club/:id', serverController.getClubById);
router.put('/club/:id', serverController.updateClub);
router.delete('/club/:id', serverController.deleteClub);
router.post('/club/:clubId/join', serverController.joinClub);

// Profile Routes
router.get('/profiles', serverController.getProfilesByUser);
router.post('/profile/redeem', serverController.redeemCode);
router.delete('/profile/:id', serverController.deleteProfile);

// Code Routes
router.post('/code', serverController.createCode);
router.get('/codes', serverController.getAllCodes);
router.put('/code/:id', serverController.updateCode);
router.delete('/code/:id', serverController.deleteCode);

// Fan Routes
router.get('/fans', serverController.getAllFans);
router.get('/fan/:id', serverController.getFanById);
router.get('/fan/me', serverController.getMyself);

module.exports = router;
