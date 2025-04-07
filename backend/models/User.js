// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    groqApiKey: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
