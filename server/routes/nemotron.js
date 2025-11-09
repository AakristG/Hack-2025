const express = require('express');
const { authenticateToken } = require('./auth');
const { chatCompletion, generateText } = require('../services/nemotron');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * POST /api/nemotron/chat
 * Send a chat completion request
 * Body: { messages: [{ role: 'user', content: '...' }], options: {...} }
 */
router.post('/chat', async (req, res) => {
  try {
    const { messages, options } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Messages array is required and must not be empty' 
      });
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return res.status(400).json({ 
          error: 'Each message must have "role" and "content" fields' 
        });
      }
    }

    const response = await chatCompletion(messages, options || {});
    res.json(response);
  } catch (error) {
    console.error('Nemotron chat error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get response from Nemotron' 
    });
  }
});

/**
 * POST /api/nemotron/generate
 * Generate text from a simple prompt
 * Body: { prompt: '...', options: {...} }
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, options } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: 'Prompt is required and must be a string' 
      });
    }

    const generatedText = await generateText(prompt, options || {});
    res.json({ 
      text: generatedText,
      prompt: prompt
    });
  } catch (error) {
    console.error('Nemotron generate error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate text from Nemotron' 
    });
  }
});

module.exports = router;

