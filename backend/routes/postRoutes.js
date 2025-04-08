const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Post = require('../models/Post');

// Generate tweet from prompt (no saving to DB)
router.post('/', async (req, res) => {
  try {
    const { clerkId, topic, tone, targetAudience, prompt } = req.body;

    // Find user and check for Groq API key
    const user = await User.findOne({ clerkId });
    if (!user || !user.groqApiKey) {
      return res.status(400).json({ message: 'Groq API key not found for this user.' });
    }

    // Construct tweet generation prompt
    const basePrompt = 
      "You are a professional tweet generator. Please create a short, punchy, and engaging tweet. " +
      "Use the following details:\n" +
      `Topic: ${topic}\n` +
      `Tone: ${tone}\n` +
      `Target Audience: ${targetAudience}\n` +
      `Prompt/Idea: ${prompt}`;

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: basePrompt
        }
      ]
    };

    // Send request to Groq API
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.groqApiKey}`
        }
      }
    );

    // Extract and return tweet without saving
    const tweet = groqResponse.data.choices?.[0]?.message?.content || 'No tweet generated';
    res.status(200).json({ generatedTweet: tweet });

  } catch (error) {
    console.error("Tweet generation error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Get all posts by user
router.get('/user/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bookmark (save) a post manually
router.post('/bookmark', async (req, res) => {
  try {
    const {
      clerkId,
      topic,
      tone,
      targetAudience,
      prompt,
      generatedTweet
    } = req.body;

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Save new post entry using provided data
    const bookmarkedPost = await Post.create({
      user: user._id,
      topic,
      tone,
      targetAudience,
      prompt,
      generatedTweet
    });

    res.status(201).json({ message: 'Post bookmarked successfully', bookmarkedPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post
router.delete('/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    
    // Find and delete the post
    const deletedPost = await Post.findByIdAndDelete(postId);
    
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;