// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    groqApiKey: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
