// db/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to SQLite database file inside /data folder
const DB_PATH = path.join(__dirname, '..', 'data', 'ecom.db');

let db;

function initDb() {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('❌ Failed to connect to database:', err);
      process.exit(1);
    }
    console.log('✅ Connected to SQLite database at', DB_PATH);
    createTablesAndSeed();
  });
}

function createTablesAndSeed() {
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products2 (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      rating REAL,
      reviews INTEGER,
      category TEXT
    );
  `;
   const createCart = `
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER,
      qty INTEGER DEFAULT 1,
      FOREIGN KEY(productId) REFERENCES products2(id)
    );
  `;

  db.serialize(() => {
    db.run(createProductsTable, (err) => {
      if (err) console.error('Error creating products2 table:', err);
    });
    db.run(createCart, (err) => {
      if (err) console.error('Error creating cart table:', err);
    });

    // Check if table is empty before inserting
    db.get('SELECT COUNT(*) AS count FROM products2', (err, row) => {
      if (err) return console.error('Error checking product count:', err);

      if (row.count === 0) {
        console.log('🌱 Seeding product data...');

        const products = [
          {
            id: 1,
            name: 'Wireless Headphones',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            rating: 4.5,
            reviews: 128,
            category: 'Electronics'
          },
          {
            id: 2,
            name: 'Smart Watch',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
            rating: 4.8,
            reviews: 256,
            category: 'Electronics'
          },
          {
            id: 3,
            name: 'Running Shoes',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
            rating: 4.6,
            reviews: 189,
            category: 'Fashion'
          },
          {
            id: 4,
            name: 'Coffee Maker',
            price: 129.99,
            image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop',
            rating: 4.4,
            reviews: 94,
            category: 'Home'
          },
          {
            id: 5,
            name: 'Laptop Backpack',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
            rating: 4.7,
            reviews: 312,
            category: 'Accessories'
          },
          {
            id: 6,
            name: 'Desk Lamp',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
            rating: 4.3,
            reviews: 76,
            category: 'Home'
          }
        ];

        const stmt = db.prepare(`
          INSERT INTO products2 (id, name, price, image, rating, reviews, category)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        for (const p of products) {
          stmt.run(p.id, p.name, p.price, p.image, p.rating, p.reviews, p.category);
        }

        stmt.finalize(() => {
          console.log('✅ Seeded products2 successfully');
        });
      } else {
        console.log('📦 products2 already has data — skipping seed.');
      }
    });
  });
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

module.exports = { initDb, getDb };
