const express = require('express');
const router = express.Router();
const recordingCtrl = require('../controllers/recording.controller');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', auth, upload.single('file'), recordingCtrl.uploadRecording);
router.get('/:id', auth, recordingCtrl.getRecording);
router.get('/', auth, recordingCtrl.listRecordings);

module.exports = router;
