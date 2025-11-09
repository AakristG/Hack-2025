/**
 * Gemini API Service
 * Handles interactions with Google's Gemini API
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Helper to strip quotes from env variables
const stripQuotes = (str) => {
  if (!str) return str;
  const trimmed = str.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const GEMINI_API_KEY = stripQuotes(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = stripQuotes(process.env.GEMINI_MODEL) || 'gemini-1.5-flash';

if (!GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not configured');
} else {
  console.log(`[Gemini] API Key configured, Model: ${GEMINI_MODEL}`);
}

let genAI = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

/**
 * Send a chat completion request to Gemini
 * @param {Array} messages - Array of message objects with 'role' and 'content'
 * @param {Object} options - Additional options (temperature, maxOutputTokens, etc.)
 * @returns {Promise<Object>} - API response in OpenAI-compatible format
 */
async function chatCompletion(messages, options = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: options.model || GEMINI_MODEL,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.max_tokens || options.maxOutputTokens || 1024,
        topP: options.top_p || 0.95,
        topK: options.top_k || 40,
      }
    });

    // Convert messages to Gemini format
    // Gemini expects alternating user/assistant messages
    const chatHistory = [];
    let systemPrompt = '';
    
    // First, collect system messages
    for (const msg of messages) {
      if (msg.role === 'system') {
        systemPrompt += (systemPrompt ? '\n\n' : '') + msg.content;
      }
    }
    
    // Build chat history from user/assistant messages
    for (const msg of messages) {
      if (msg.role === 'user') {
        let content = msg.content;
        // Prepend system prompt to first user message if exists
        if (systemPrompt && chatHistory.length === 0) {
          content = systemPrompt + '\n\n' + content;
        }
        chatHistory.push({ role: 'user', parts: [{ text: content }] });
      } else if (msg.role === 'assistant') {
        chatHistory.push({ role: 'model', parts: [{ text: msg.content }] });
      }
      // Skip system messages as they're already handled
    }

    // Ensure the last message is from the user
    if (chatHistory.length === 0 || chatHistory[chatHistory.length - 1].role !== 'user') {
      throw new Error('Last message must be from the user');
    }

    // Start chat with history (all but the last message)
    const history = chatHistory.slice(0, -1);
    const lastMessage = chatHistory[chatHistory.length - 1];
    
    const chat = history.length > 0 
      ? model.startChat({ history })
      : model.startChat();

    // Send the last message
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = await result.response;
    const text = response.text();

    // Return in OpenAI-compatible format
    return {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: options.model || GEMINI_MODEL,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: text,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 0, // Gemini doesn't provide token counts in the same way
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
  } catch (error) {
    // Check for API key errors specifically
    if (error.message && (error.message.includes('API_KEY_INVALID') || error.message.includes('API key expired'))) {
      throw new Error('GEMINI_API_KEY is invalid or expired. Please update your API key in your environment file.');
    }
    throw new Error(`Failed to connect to Gemini API: ${error.message}`);
  }
}

/**
 * Generate a simple text completion
 * @param {string} prompt - The prompt text
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Generated text
 */
async function generateText(prompt, options = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: options.model || GEMINI_MODEL,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.max_tokens || options.maxOutputTokens || 1024,
        topP: options.top_p || 0.95,
        topK: options.top_k || 40,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // Check for API key errors specifically
    if (error.message && (error.message.includes('API_KEY_INVALID') || error.message.includes('API key expired'))) {
      throw new Error('GEMINI_API_KEY is invalid or expired. Please update your API key in your environment file.');
    }
    throw new Error(`Failed to generate text from Gemini API: ${error.message}`);
  }
}

/**
 * Analyze sentiment of a text using Gemini
 * @param {string} text - The text to analyze
 * @param {Object} options - Additional options
 * @returns {Promise<'positive' | 'neutral' | 'negative'>} - Sentiment classification
 */
async function analyzeSentiment(text, options = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  try {
    const modelName = options.model || GEMINI_MODEL;
    console.log(`[Gemini] Using model: ${modelName}`);
    
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent sentiment analysis
        maxOutputTokens: 10, // We only need a single word response
        topP: 0.8,
        topK: 20,
      }
    });

    const prompt = `Analyze the sentiment of the following text and respond with ONLY one word: "positive", "neutral", or "negative". Do not include any explanation or additional text.

Text: "${text}"

Sentiment:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sentimentText = response.text().trim().toLowerCase();

    // Parse the response to ensure we get a valid sentiment
    if (sentimentText.includes('positive')) {
      return 'positive';
    } else if (sentimentText.includes('negative')) {
      return 'negative';
    } else {
      return 'neutral';
    }
  } catch (error) {
    console.error('Gemini sentiment analysis error:', error);
    // Check for API key errors specifically
    if (error.message && (error.message.includes('API_KEY_INVALID') || error.message.includes('API key expired'))) {
      console.error('❌ GEMINI_API_KEY is invalid or expired. Please update your API key.');
    }
    // Fallback to neutral if analysis fails
    return 'neutral';
  }
}

/**
 * Analyze and assign category/tag to a text using Gemini
 * @param {string} text - The text to analyze
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Category/tag classification
 */
async function analyzeCategory(text, options = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  try {
    const modelName = options.model || GEMINI_MODEL;
    console.log(`[Gemini] Analyzing category using model: ${modelName}`);
    
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent categorization
        maxOutputTokens: 50, // Short category name
        topP: 0.8,
        topK: 20,
      }
    });

    const prompt = `Analyze the following customer feedback text and assign it to ONE of these categories:
- Network Speed
- Customer Service
- Coverage
- Mobile App
- Network Reliability
- Promotions
- Roaming
- Billing
- Plans
- Retail Experience
- General

Respond with ONLY the category name (e.g., "Network Speed" or "Customer Service"). Do not include any explanation or additional text.

Text: "${text}"

Category:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const categoryText = response.text().trim();
    
    // Clean up the response - remove quotes if present, take first line
    let category = categoryText.split('\n')[0].trim();
    if ((category.startsWith('"') && category.endsWith('"')) || 
        (category.startsWith("'") && category.endsWith("'"))) {
      category = category.slice(1, -1);
    }
    
    // Validate category is from our list
    const validCategories = [
      'Network Speed', 'Customer Service', 'Coverage', 'Mobile App',
      'Network Reliability', 'Promotions', 'Roaming', 'Billing',
      'Plans', 'Retail Experience', 'General'
    ];
    
    // Check if the response matches any valid category (case-insensitive)
    const matchedCategory = validCategories.find(cat => 
      category.toLowerCase() === cat.toLowerCase()
    );
    
    return matchedCategory || 'General';
  } catch (error) {
    console.error('Gemini category analysis error:', error);
    // Check for API key errors specifically
    if (error.message && (error.message.includes('API_KEY_INVALID') || error.message.includes('API key expired'))) {
      console.error('❌ GEMINI_API_KEY is invalid or expired. Please update your API key.');
    }
    // Fallback to General if analysis fails
    return 'General';
  }
}

module.exports = {
  chatCompletion,
  generateText,
  analyzeSentiment,
  analyzeCategory
};

