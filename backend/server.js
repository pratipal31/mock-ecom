// server.js
const express = require('express');
const cors = require('cors');
const { initDb, getDb } = require('./db/database');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize and connect to SQLite DB
initDb();

// ✅ GET: Fetch all products2
app.get('/api/products2', (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM products2', (err, rows) => {
    if (err) {
      console.error('Error fetching products2:', err.message);
      return res.status(500).json({ error: 'Failed to fetch products2' });
    }
    res.json(rows);
  });
});

// ✅ POST: Add a new product to products2
app.post('/api/products2', (req, res) => {
  const { name, price, image, rating, reviews, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const db = getDb();
  const query = `
    INSERT INTO products2 (name, price, image, rating, reviews, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [name, price, image || null, rating || null, reviews || null, category],
    function (err) {
      if (err) {
        console.error('Error inserting product into products2:', err.message);
        return res.status(500).json({ error: 'Failed to add product' });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        price,
        image,
        rating,
        reviews,
        category,
      });
    }
  );
});

// ✅ Default route (health check)
app.get('/', (req, res) => {
  res.send('✅ Backend is running and connected to SQLite (products2 table)!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
