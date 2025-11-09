/**
 * Nemotron API Service
 * Handles interactions with NVIDIA's Nemotron API
 */

const NEMOTRON_API_URL = process.env.NEMOTRON_API_URL || 'https://integrate.api.nvidia.com/v1';
const NEMOTRON_API_KEY = process.env.NEMOTRON_API_KEY;
const NEMOTRON_MODEL = process.env.NEMOTRON_MODEL || 'nemotron-4-340b-instruct';

/**
 * Send a chat completion request to Nemotron
 * @param {Array} messages - Array of message objects with 'role' and 'content'
 * @param {Object} options - Additional options (temperature, max_tokens, etc.)
 * @returns {Promise<Object>} - API response
 */
async function chatCompletion(messages, options = {}) {
  if (!NEMOTRON_API_KEY) {
    throw new Error('NEMOTRON_API_KEY is not configured');
  }

  const url = `${NEMOTRON_API_URL}/chat/completions`;
  
  const requestBody = {
    model: NEMOTRON_MODEL,
    messages: messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.max_tokens || 1024,
    ...options
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEMOTRON_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Nemotron API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message.includes('Nemotron API error')) {
      throw error;
    }
    throw new Error(`Failed to connect to Nemotron API: ${error.message}`);
  }
}

/**
 * Generate a simple text completion
 * @param {string} prompt - The prompt text
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Generated text
 */
async function generateText(prompt, options = {}) {
  const messages = [
    {
      role: 'user',
      content: prompt
    }
  ];

  const response = await chatCompletion(messages, options);
  
  if (response.choices && response.choices.length > 0) {
    return response.choices[0].message.content;
  }
  
  throw new Error('No response from Nemotron API');
}

module.exports = {
  chatCompletion,
  generateText
};

