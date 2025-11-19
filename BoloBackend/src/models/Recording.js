const mongoose = require('mongoose');

const RecordingSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taskID: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  audioURL: { type: String },
  duration: { type: Number },
  samples: { type: Number },
  transcript: { type: String },
  emotion: { type: String },
  accent: { type: String },
  dialect: { type: String },
  status: { type: String, default: 'pending' }, // verified, pending, rejected
  score: { type: Number },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recording', RecordingSchema);
