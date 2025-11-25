// API to check scoring system directly
exports.checkScore = (req, res) => {
  const { transcript = '', article = '', duration = 0 } = req.body;
  const scoring = scoreTranscript(transcript, article, Number(duration));
  response.success(res, scoring);
};
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const { processAudioForASR } = require('../services/asr.service');
const { scoreTranscript } = require('../services/scoring.service');
const Task = require('../models/Task');
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
      userID: req.user ? req.user._id : '507f1f77bcf86cd799439011', // Dummy userID for testing without auth
      taskID: req.body.taskID || null,
      audioURL: uploaded.secure_url,
      duration: req.body.duration || null,
      samples: req.body.samples || null,
      status: 'pending'
    };

    const recording = await Recording.create(recData);

    // Fetch article text from Task
    let articleText = '';
    if (recData.taskID) {
      const task = await Task.findById(recData.taskID);
      if (task && task.text) articleText = task.text;
    }

    // ASR: Transcribe audio, chunked with timestamps
    let transcriptJson = [];
    let transcript = '';
    try {
      transcriptJson = await processAudioForASR(localPath);
      // If transcriptJson is an array of segments, join their text
      if (Array.isArray(transcriptJson)) {
        transcript = transcriptJson.map(seg => seg.text || '').join(' ');
      } else if (typeof transcriptJson === 'string') {
        transcript = transcriptJson;
      } else {
        transcript = '';
      }
      recording.transcript = transcript;
    } catch (err) {
      console.warn('ASR transcription failed:', err.message || err);
      recording.transcript = '';
      transcript = '';
    }

    // score
    const audioDuration = Number(recData.duration) || 0;
    const scoring = scoreTranscript(transcript, articleText, audioDuration);
    recording.score = scoring.score;
    recording.emotion = scoring.emotion;
    recording.points = scoring.points;
    recording.accent = scoring.accent;
    recording.dialect = scoring.dialect;
    recording.status = 'verified';
    // Store new metrics
    recording.totalWords = scoring.totalWords;
    recording.uniqueWords = scoring.uniqueWords;
    recording.newWords = scoring.newWords;
    recording.audioDuration = scoring.audioDuration;

    await recording.save();

    // remove local file
    try { fs.unlinkSync(localPath); } catch (e) {}

    // Return all metrics in response
    response.success(res, {
      ...recording.toObject(),
      scoring
    }, 201);
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
