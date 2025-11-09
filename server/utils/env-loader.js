/**
 * Environment Variable Loader
 * Loads environment variables from main.env (priority) or .env file
 */

const path = require('path');
const fs = require('fs');

/**
 * Load environment variables from main.env or .env file
 * Priority: main.env > .env > system environment variables
 */
function loadEnv() {
  const rootDir = path.join(__dirname, '..', '..');
  const mainEnvPath = path.join(rootDir, 'main.env');
  const dotEnvPath = path.join(rootDir, '.env');

  if (fs.existsSync(mainEnvPath)) {
    const result = require('dotenv').config({ path: mainEnvPath });
    if (result.error) {
      console.error('❌ Error loading main.env:', result.error);
    } else {
      console.log('✅ Loaded environment variables from main.env');
      // Log key variables for debugging
      if (process.env.GEMINI_API_KEY) {
        console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
      }
      if (process.env.GEMINI_MODEL) {
        console.log(`   GEMINI_MODEL: ${process.env.GEMINI_MODEL}`);
      }
    }
    return mainEnvPath;
  } else if (fs.existsSync(dotEnvPath)) {
    require('dotenv').config({ path: dotEnvPath });
    console.log('✅ Loaded environment variables from .env');
    return dotEnvPath;
  } else {
    require('dotenv').config();
    console.log('⚠️  No main.env or .env file found, using system environment variables');
    return null;
  }
}

module.exports = { loadEnv };

