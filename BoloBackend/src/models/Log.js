const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loggedInAt: { type: Date },
  loggedOutAt: { type: Date },
  ip: { type: String },
  os: { type: String },
  deviceToken: { type: String },
  otp: { type: String },
  status: { type: String }, // pending, verified
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Log', LogSchema);
