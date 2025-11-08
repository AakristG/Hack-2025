const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'database', 'database.sqlite');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Database file deleted. It will be recreated on next server start.');
} else {
  console.log('Database file does not exist.');
}

