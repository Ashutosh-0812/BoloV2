const express = require('express');
const router = express.Router();
const recordingCtrl = require('../controllers/recording.controller');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// API to check scoring system directly
router.post('/score/check', recordingCtrl.checkScore);

router.post('/upload', upload.single('file'), recordingCtrl.uploadRecording); // Temporarily removed auth for testing
router.get('/:id', auth, recordingCtrl.getRecording);
router.get('/', auth, recordingCtrl.listRecordings);

module.exports = router;
