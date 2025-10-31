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

/* -------------------- CHECKOUT ROUTE -------------------- */

// ✅ POST: Process checkout and generate receipt
app.post('/api/checkout', (req, res) => {
  const db = getDb();
  
  // Fetch current cart items with product details
  const query = `
    SELECT cart.id, cart.productId, cart.qty,
           p.name, p.price, p.image, p.category
    FROM cart
    JOIN products2 p ON cart.productId = p.id;
  `;
  
  db.all(query, (err, cartItems) => {
    if (err) {
      console.error('Error fetching cart for checkout:', err.message);
      return res.status(500).json({ error: 'Failed to process checkout' });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Generate receipt
    const receipt = {
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString(),
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.qty,
        itemTotal: item.price * item.qty
      })),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount: cartItems.reduce((sum, item) => sum + item.qty, 0),
      status: 'completed'
    };

    // Clear cart after successful checkout
    db.run('DELETE FROM cart', (clearErr) => {
      if (clearErr) {
        console.error('Error clearing cart after checkout:', clearErr.message);
        // Still return receipt even if cart clear fails
      }
      
      console.log('✅ Checkout processed:', receipt.orderId);
      res.status(200).json(receipt);
    });
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