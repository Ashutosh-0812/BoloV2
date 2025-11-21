const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/request-otp', authCtrl.requestOTP);
router.post('/verify-otp', authCtrl.verifyOTP);
router.post('/logout', authCtrl.logout);

module.exports = router;
