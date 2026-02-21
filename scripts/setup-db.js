const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

console.log('Setting up SQLite database...');

// Read migration SQL
const migrationSQL = fs.readFileSync(
  path.join(process.cwd(), 'prisma', 'migrations', 'init', 'migration.sql'),
  'utf8'
);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }

  console.log('Connected to SQLite database');

  // Split SQL statements and execute them
  const statements = migrationSQL
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'));

  let completed = 0;

  statements.forEach((statement, index) => {
    db.run(statement + ';', (err) => {
      if (err) {
        console.error(`Error executing statement ${index + 1}:`, err.message);
      } else {
        completed++;
        if (completed === statements.length) {
          console.log('Database schema created successfully!');
          db.close();
          process.exit(0);
        }
      }
    });
  });
});
