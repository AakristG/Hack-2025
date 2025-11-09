// Suppress DEP0060 deprecation warning from sqlite3 dependency
const originalEmitWarning = process.emitWarning;
process.emitWarning = function(warning, ...args) {
  if (warning && typeof warning === 'object' && warning.name === 'DeprecationWarning') {
    if (warning.message && warning.message.includes('util._extend')) {
      return; // Suppress this specific warning
    }
  } else if (typeof warning === 'string' && warning.includes('util._extend')) {
    return; // Suppress this specific warning
  }
  return originalEmitWarning.apply(process, [warning, ...args]);
};

const express = require('express');
const cors = require('cors');
const path = require('path');
const { loadEnv } = require('./utils/env-loader');

// Load environment variables
loadEnv();

const satisfactionRoutes = require('./routes/satisfaction');
const authRoutes = require('./routes/auth');
const geminiRoutes = require('./routes/gemini');
const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start server
initDatabase()
  .then(() => {
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/satisfaction', satisfactionRoutes);
    app.use('/api/gemini', geminiRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use.`);
        console.error(`\nTo fix this, you can:`);
        console.error(`1. Kill the process using port ${PORT}:`);
        console.error(`   lsof -ti:${PORT} | xargs kill -9`);
        console.error(`2. Or change the PORT in your .env file\n`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

