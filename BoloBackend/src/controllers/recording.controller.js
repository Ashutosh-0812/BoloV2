const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const { transcribeFromFile } = require('../services/transcription.service');
const { scoreTranscript } = require('../services/scoring.service');
const Recording = require('../models/Recording');
const response = require('../utils/response');

// Upload local file, push to Cloudinary and create Recording entry, transcribe & score
exports.uploadRecording = async (req, res) => {
  try {
    if (!req.file) return response.error(res, 'No file uploaded', 400);
    const localPath = req.file.path;

    // upload to cloudinary (audio as resource_type raw)
    let uploaded;
    if (cloudinary.config().api_key) {
      uploaded = await cloudinary.uploader.upload(localPath, { resource_type: 'auto' });
    } else {
      // If cloudinary not configured, fallback to local file path (not ideal for production)
      uploaded = { secure_url: `file://${localPath}` };
    }

    // Create recording metadata
    const recData = {
      userID: req.user._id,
      taskID: req.body.taskID || null,
      audioURL: uploaded.secure_url,
      duration: req.body.duration || null,
      samples: req.body.samples || null,
      status: 'pending'
    };

    const recording = await Recording.create(recData);

    // Transcribe (stub)
    let transcript = '';
    try {
      transcript = await transcribeFromFile(localPath);
      recording.transcript = transcript;
    } catch (err) {
      console.warn('Transcription failed:', err.message || err);
    }

    // score
    const scoring = scoreTranscript(transcript);
    recording.score = scoring.score;
    recording.emotion = scoring.emotion;
    recording.points = scoring.points;
    recording.accent = scoring.accent;
    recording.dialect = scoring.dialect;
    recording.status = 'verified';

    await recording.save();

    // remove local file
    try { fs.unlinkSync(localPath); } catch (e) {}

    response.success(res, recording, 201);
  } catch (err) {
    console.error(err);
    response.error(res, 'Failed to upload recording');
  }
};

exports.getRecording = async (req, res) => {
  const rec = await Recording.findById(req.params.id).populate('userID taskID');
  if (!rec) return response.error(res, 'Recording not found', 404);
  response.success(res, rec);
};

exports.listRecordings = async (req, res) => {
  const recs = await Recording.find().sort({ createdAt: -1 }).limit(200);
  response.success(res, recs);
};
