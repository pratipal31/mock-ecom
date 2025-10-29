// db/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'ecom.db');

let db;

function initDb() {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Failed to open DB', err);
      process.exit(1);
    }
    console.log('Connected to SQLite DB at', DB_PATH);
    createTablesAndSeed();
  });
}

function createTablesAndSeed() {
  const createProducts = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL
    );
  `;
  const createCart = `
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.serialize(() => {
    db.run(createProducts);
    db.run(createCart);

    // Seed products if table empty
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        const products = [
          { id: 1, name: 'Blue T-Shirt', price: 12.99 },
          { id: 2, name: 'Sneakers', price: 49.99 },
          { id: 3, name: 'Coffee Mug', price: 8.5 },
          { id: 4, name: 'Headphones', price: 79.9 },
          { id: 5, name: 'Backpack', price: 39.0 }
        ];
        const stmt = db.prepare('INSERT INTO products (id, name, price) VALUES (?, ?, ?)');
        for (const p of products) stmt.run(p.id, p.name, p.price);
        stmt.finalize();
        console.log('Seeded products');
      }
    });
  });
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

module.exports = { initDb, getDb };
