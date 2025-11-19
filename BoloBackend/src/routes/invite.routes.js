const express = require('express');
const router = express.Router();
const inviteCtrl = require('../controllers/invite.controller');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, inviteCtrl.sendInvite);
router.post('/:inviteId/respond', auth, inviteCtrl.respondInvite);

module.exports = router;
