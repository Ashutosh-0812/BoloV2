const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const auth = require('../middleware/authMiddleware');

router.get('/me', auth, userCtrl.getMe);
router.put('/me', auth, userCtrl.updateMe);
router.get('/', auth, userCtrl.listUsers);

module.exports = router;
