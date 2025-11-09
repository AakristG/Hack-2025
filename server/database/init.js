const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');

let db;

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
    });

    // Create users table
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }
      });

      db.run(`CREATE TABLE IF NOT EXISTS satisfaction_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        product_name TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`, (err) => {
        if (err) {
          console.error('Error creating satisfaction_data table:', err);
          reject(err);
          return;
        }
      });

      // Create default admin user (username: admin, password: admin123)
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) {
          console.error('Error checking users:', err);
          reject(err);
          return;
        }
        if (row.count === 0) {
          const hashedPassword = bcrypt.hashSync('admin123', 10);
          db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            ['admin', 'admin@example.com', hashedPassword],
            (err) => {
              if (err) {
                console.error('Error creating default user:', err);
                reject(err);
                return;
              } else {
                console.log('Default admin user created (username: admin, password: admin123)');
              }
              
              // Insert sample satisfaction data
              db.get('SELECT COUNT(*) as count FROM satisfaction_data', (err, row) => {
                if (err) {
                  console.error('Error checking satisfaction data:', err);
                  reject(err);
                  return;
                }
                if (row.count === 0) {
                  const sampleData = [
                    ['John Doe', 'Product A', 5, 'Excellent product, very satisfied!'],
                    ['Jane Smith', 'Product A', 4, 'Good quality, minor improvements needed'],
                    ['Bob Johnson', 'Product B', 3, 'Average product, could be better'],
                    ['Alice Williams', 'Product A', 5, 'Love it! Highly recommend'],
                    ['Charlie Brown', 'Product B', 2, 'Not what I expected'],
                    ['Diana Prince', 'Product A', 4, 'Good value for money'],
                    ['Edward Norton', 'Product B', 5, 'Exceeded expectations'],
                    ['Fiona Apple', 'Product A', 3, 'It\'s okay, nothing special'],
                    ['George Clooney', 'Product B', 4, 'Solid product, would buy again'],
                    ['Helen Mirren', 'Product A', 5, 'Perfect! Exactly what I needed']
                  ];

                  const stmt = db.prepare('INSERT INTO satisfaction_data (customer_name, product_name, rating, comment) VALUES (?, ?, ?, ?)');
                  sampleData.forEach(data => {
                    stmt.run(data);
                  });
                  stmt.finalize((err) => {
                    if (err) {
                      console.error('Error inserting sample data:', err);
                      reject(err);
                      return;
                    }
                    console.log('Sample satisfaction data inserted');
                    resolve();
                  });
                } else {
                  resolve();
                }
              });
            }
          );
        } else {
          // User already exists, just check satisfaction data
          db.get('SELECT COUNT(*) as count FROM satisfaction_data', (err, row) => {
            if (err) {
              console.error('Error checking satisfaction data:', err);
              reject(err);
              return;
            }
            if (row.count === 0) {
              const sampleData = [
                ['John Doe', 'Product A', 5, 'Excellent product, very satisfied!'],
                ['Jane Smith', 'Product A', 4, 'Good quality, minor improvements needed'],
                ['Bob Johnson', 'Product B', 3, 'Average product, could be better'],
                ['Alice Williams', 'Product A', 5, 'Love it! Highly recommend'],
                ['Charlie Brown', 'Product B', 2, 'Not what I expected'],
                ['Diana Prince', 'Product A', 4, 'Good value for money'],
                ['Edward Norton', 'Product B', 5, 'Exceeded expectations'],
                ['Fiona Apple', 'Product A', 3, 'It\'s okay, nothing special'],
                ['George Clooney', 'Product B', 4, 'Solid product, would buy again'],
                ['Helen Mirren', 'Product A', 5, 'Perfect! Exactly what I needed']
              ];

              const stmt = db.prepare('INSERT INTO satisfaction_data (customer_name, product_name, rating, comment) VALUES (?, ?, ?, ?)');
              sampleData.forEach(data => {
                stmt.run(data);
              });
              stmt.finalize((err) => {
                if (err) {
                  console.error('Error inserting sample data:', err);
                  reject(err);
                  return;
                }
                console.log('Sample satisfaction data inserted');
                resolve();
              });
            } else {
              resolve();
            }
          });
        }
      });
    });
  });
};

const getDb = () => {
  if (!db) {
    db = new sqlite3.Database(DB_PATH);
  }
  return db;
};

module.exports = { initDatabase, getDb };

