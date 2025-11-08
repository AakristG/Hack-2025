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
require('dotenv').config();

const satisfactionRoutes = require('./routes/satisfaction');
const authRoutes = require('./routes/auth');
const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start server
initDatabase()
  .then(() => {
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/satisfaction', satisfactionRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

