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

/* -------------------- CART ROUTES -------------------- */

// ✅ GET: Fetch cart with product details
app.get('/api/cart', (req, res) => {
  const db = getDb();
  const query = `
    SELECT cart.id, cart.productId, cart.qty,
           p.name, p.price, p.image, p.category
    FROM cart
    JOIN products2 p ON cart.productId = p.id;
  `;
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching cart:', err.message);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }
    res.json(rows);
  });
});

// ✅ POST: Add or update a product in cart
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  const db = getDb();

  if (!productId || qty <= 0) {
    return res.status(400).json({ error: 'Invalid productId or qty' });
  }

  // Check if product already in cart
  db.get('SELECT * FROM cart WHERE productId = ?', [productId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      // Update quantity if product exists
      db.run('UPDATE cart SET qty = ? WHERE productId = ?', [qty, productId], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: 'Cart updated successfully' });
      });
    } else {
      // Insert new product
      db.run('INSERT INTO cart (productId, qty) VALUES (?, ?)', [productId, qty], function (err3) {
        if (err3) return res.status(500).json({ error: err3.message });
        res.status(201).json({ id: this.lastID, productId, qty });
      });
    }
  });
});

// ✅ DELETE: Remove a product from cart
app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.run('DELETE FROM cart WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item removed successfully' });
  });
});

// ✅ DELETE: Clear cart
app.delete('/api/cart', (req, res) => {
  const db = getDb();
  db.run('DELETE FROM cart', (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cart cleared successfully' });
  });
});
// ✅ Default route (health check)
app.get('/', (req, res) => {
  res.send('✅ Backend is running and connected to SQLite (products2 table)!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
