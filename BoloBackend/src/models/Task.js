const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String },
  text: { type: String }, // news/article text
  textImage: { type: String },
  imageURLs: [{ type: String }],
  source: { type: String },
  date: { type: Date },
  language: { type: String },
  district: { type: String },
  state: { type: String },
  domain: { type: String },
  topic: { type: String },
  type: { type: String }, // newsReaction, read, spontaneous, conversation, imageDescription
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Task', TaskSchema);
