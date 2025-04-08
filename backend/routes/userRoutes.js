const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Create a user with only clerkId
router.post('/', async (req, res) => {
  try {
    const { clerkId } = req.body;

    if (!clerkId) {
      return res.status(400).json({ error: 'clerkId is required' });
    }

    // Create the user if it doesn't exist, ignoring groqApiKey if provided
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({ clerkId });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by Clerk ID
router.get('/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update (or add) Groq API Key for a user
router.put('/:clerkId', async (req, res) => {
  try {
    const { groqApiKey } = req.body;
    if (!groqApiKey) {
      return res.status(400).json({ error: 'groqApiKey is required for update' });
    }

    // Update the user's groqApiKey (adds it if missing, or replaces the existing key)
    const user = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      { groqApiKey },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;