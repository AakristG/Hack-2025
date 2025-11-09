const express = require('express');
const { authenticateToken } = require('./auth');
const { chatCompletion, generateText, analyzeSentiment, analyzeCategory } = require('../services/gemini');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * POST /api/gemini/chat
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
    console.error('Gemini chat error:', error);
    const statusCode = error.message && error.message.includes('API key') ? 401 : 500;
    res.status(statusCode).json({ 
      error: error.message || 'Failed to get response from Gemini' 
    });
  }
});

/**
 * POST /api/gemini/generate
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
    console.error('Gemini generate error:', error);
    const statusCode = error.message && error.message.includes('API key') ? 401 : 500;
    res.status(statusCode).json({ 
      error: error.message || 'Failed to generate text from Gemini' 
    });
  }
});

/**
 * POST /api/gemini/sentiment
 * Analyze sentiment of a text
 * Body: { text: '...', options: {...} }
 */
router.post('/sentiment', async (req, res) => {
  try {
    const { text, options } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        error: 'Text is required and must be a string' 
      });
    }

    const sentiment = await analyzeSentiment(text, options || {});
    res.json({ 
      sentiment: sentiment,
      text: text
    });
  } catch (error) {
    console.error('Gemini sentiment analysis error:', error);
    const statusCode = error.message && error.message.includes('API key') ? 401 : 500;
    res.status(statusCode).json({ 
      error: error.message || 'Failed to analyze sentiment with Gemini' 
    });
  }
});

/**
 * POST /api/gemini/category
 * Analyze and assign category/tag to a text
 * Body: { text: '...', options: {...} }
 */
router.post('/category', async (req, res) => {
  try {
    const { text, options } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        error: 'Text is required and must be a string' 
      });
    }

    const category = await analyzeCategory(text, options || {});
    res.json({ 
      category: category,
      text: text
    });
  } catch (error) {
    console.error('Gemini category analysis error:', error);
    const statusCode = error.message && error.message.includes('API key') ? 401 : 500;
    res.status(statusCode).json({ 
      error: error.message || 'Failed to analyze category with Gemini' 
    });
  }
});

module.exports = router;

