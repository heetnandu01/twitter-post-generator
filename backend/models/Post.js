const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: String,
  tone: String,
  targetAudience: String,
  prompt: String,
  generatedTweet: String,
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
