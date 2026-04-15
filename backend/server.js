const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json()); // Allows server to read JSON from React

// --- 1. INITIALIZE THE DATABASE (This fixes the 'db not found' error!) ---
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("✅ Connected to the SQLite database.");
    
    // --- 2. CREATE TABLES ---
    
    // Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL
    )`);

    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
      // Secretly create the Admin account if it doesn't exist yet
      db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES ('Admin', 'admin@megastore.com', 'admin123', 'admin')`);
    });

    // Orders Table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      totalAmount REAL NOT NULL,
      items TEXT NOT NULL,
      status TEXT DEFAULT 'Processing',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});


// --- 3. PUBLIC API ROUTES ---

// Get all products
app.get('/api/products', (req, res) => {
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// User Signup
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, password], function(err) {
    if (err) return res.status(400).json({ error: "Email already exists" });
    res.status(201).json({ message: "User created", user: { id: this.lastID, name, email, role: 'customer' } });
  });
});

// User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT id, name, email, role FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Invalid email or password" });
    res.json({ message: "Login successful", user });
  });
});

// Place an Order
app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, address, phone, totalAmount, items } = req.body;
  const itemsString = JSON.stringify(items); // Convert cart array to string

  const sql = `INSERT INTO orders (customerName, customerEmail, address, phone, totalAmount, items) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [customerName, customerEmail, address, phone, totalAmount, itemsString], function(err) {
    if (err) return res.status(500).json({ error: "Failed to save order" });
    res.status(201).json({ message: "Order placed successfully!", orderId: this.lastID });
  });
});


// --- 4. ADMIN API ROUTES ---

// Get all Users
app.get('/api/admin/users', (req, res) => {
  db.all(`SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users" });
    res.json(rows);
  });
});

// Get all Orders
app.get('/api/admin/orders', (req, res) => {
  db.all(`SELECT * FROM orders ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch orders" });
    res.json(rows);
  });
});


// --- 5. THE MAGIC SEED ROUTE (To wake up the database) ---
app.get('/seed', (req, res) => {
  const starterProducts = [
    { name: "Sony Noise Cancelling Headphones", price: 299.99, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80" },
    { name: "Apple Watch Series 9", price: 399.00, image: "https://images.unsplash.com/photo-1434493789847-2902a52dda8c?w=500&q=80" },
    { name: "RGB Mechanical Keyboard", price: 149.50, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
    { name: "4K Ultra-Wide Monitor", price: 450.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80" },
    { name: "iPhone 15 Pro Max", price: 1199.00, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80" },
    { name: "MacBook Pro M3", price: 1999.00, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80" },
    { name: "Canon Mirrorless Camera", price: 899.99, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80" },
    { name: "DJI Mini Drone", price: 549.00, image: "https://images.unsplash.com/photo-1507580461448-fdfa493b22e1?w=500&q=80" },
    { name: "Amazon Echo Studio", price: 199.99, image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80" },
    { name: "iPad Air 5th Gen", price: 599.00, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80" }
  ];

  db.serialize(() => {
    db.run("DELETE FROM products"); // Clear old broken ones
    const stmt = db.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)");
    starterProducts.forEach(p => stmt.run(p.name, p.price, p.image));
    stmt.finalize();
  });

  res.send("<h1>✅ SUCCESS! 10 Products Loaded. Refresh your website!</h1>");
});

// --- 6. START THE ENGINE ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running perfectly on port ${PORT}`);
});