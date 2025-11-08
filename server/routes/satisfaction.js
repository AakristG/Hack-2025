const express = require('express');
const { getDb } = require('../database/init');
const { authenticateToken } = require('./auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all satisfaction data
router.get('/', (req, res) => {
  const db = getDb();
  
  db.all('SELECT * FROM satisfaction_data ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get statistics
router.get('/stats', (req, res) => {
  const db = getDb();
  
  const queries = {
    total: 'SELECT COUNT(*) as count FROM satisfaction_data',
    average: 'SELECT AVG(rating) as avg FROM satisfaction_data',
    byRating: 'SELECT rating, COUNT(*) as count FROM satisfaction_data GROUP BY rating ORDER BY rating',
    byProduct: 'SELECT product_name, AVG(rating) as avg_rating, COUNT(*) as count FROM satisfaction_data GROUP BY product_name',
    recent: 'SELECT * FROM satisfaction_data ORDER BY created_at DESC LIMIT 10'
  };

  const results = {};
  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    db.all(queries[key], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      results[key] = rows;
      completed++;
      
      if (completed === totalQueries) {
        res.json(results);
      }
    });
  });
});

// Add new satisfaction entry
router.post('/', (req, res) => {
  const { customer_name, product_name, rating, comment } = req.body;

  if (!customer_name || !product_name || !rating) {
    return res.status(400).json({ error: 'Customer name, product name, and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const db = getDb();
  
  db.run(
    'INSERT INTO satisfaction_data (customer_name, product_name, rating, comment, user_id) VALUES (?, ?, ?, ?, ?)',
    [customer_name, product_name, rating, comment || null, null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error adding satisfaction data' });
      }
      res.json({ id: this.lastID, customer_name, product_name, rating, comment });
    }
  );
});

// Delete satisfaction entry
router.delete('/:id', (req, res) => {
  const db = getDb();
  
  db.run('DELETE FROM satisfaction_data WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted successfully' });
  });
});

module.exports = router;

