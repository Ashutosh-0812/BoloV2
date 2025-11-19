const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who sent
  participantID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // invited
  status: { type: String, default: 'pending' }, // pending, accepted, declined
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invite', InviteSchema);
