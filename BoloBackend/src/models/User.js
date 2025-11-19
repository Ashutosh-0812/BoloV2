const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, index: true },
  gender: { type: String },
  area: { type: String },
  occupation: { type: String },
  languages: [{ type: String }],
  accents: [{ type: String }],
  dialects: [{ type: String }],
  college: { type: String },
  city: { type: String },
  district: { type: String },
  state: { type: String },
  ageGroup: { type: String },
  role: { type: String, default: 'participant' }, // student, participant, moderator, admin
  status: { type: String, default: 'active' }, // active, inactive, banned
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);
