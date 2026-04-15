const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite', logging: false });

// --- BLUEPRINTS ---
const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, defaultValue: 'Uncategorized' }
});

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true }, 
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'customer' } 
});

const Order = sequelize.define('Order', {
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerEmail: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  items: { type: DataTypes.JSON, allowNull: false } 
});

sequelize.authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => console.log("✅ Database Upgraded with Address & Phone support!"))
  .catch(err => console.log("❌ Error:", err.message));

// --- THE MISSING SEED ROUTE ---
app.get('/seed', async (req, res) => {
  try {
    // 1. Clear old products to prevent duplicates
    await Product.destroy({ where: {} });

    // 2. Add Starter Products
    await Product.bulkCreate([
      { name: "Sony Wireless Headphones", price: 299.99, category: "Electronics", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500" },
      { name: "MacBook Pro M3", price: 1999.00, category: "Electronics", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500" },
      { name: "Minimalist Watch", price: 120.00, category: "Fashion", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
      { name: "Nike Air Max", price: 150.00, category: "Fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
      { name: "Smart Coffee Maker", price: 89.99, category: "Home", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500" },
      { name: "Mechanical Keyboard", price: 145.00, category: "Electronics", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500" }
    ]);

    // Creates the Orders table if it doesn't exist yet
db.run(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerName TEXT NOT NULL,
  customerEmail TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  totalAmount REAL NOT NULL,
  items TEXT NOT NULL, -- We will save the cart items as a JSON string
  status TEXT DEFAULT 'Processing',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.error("Error creating orders table:", err.message);
  } else {
    console.log("📦 Orders table is ready!");
  }
});
// --- DATABASE: CREATE USERS TABLE ---
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (!err) {
    console.log("👥 Users table is ready!");
    // Secretly create your permanent Admin account if it doesn't exist
    db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES ('Admin', 'admin@megastore.com', 'admin123', 'admin')`);
  }
});

// --- API: SIGNUP ROUTE ---
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  
  db.run(sql, [name, email, password], function(err) {
    if (err) return res.status(400).json({ error: "Email already exists or invalid data" });
    res.status(201).json({ message: "User created", user: { id: this.lastID, name, email, role: 'customer' } });
  });
});

// --- API: LOGIN ROUTE ---
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT id, name, email, role FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Invalid email or password" });
    res.json({ message: "Login successful", user });
  });
});

// --- API: ADMIN GET ALL USERS ---
app.get('/api/admin/users', (req, res) => {
  db.all(`SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users" });
    res.json(rows);
  });
});

    // 3. Create Default Admin Account
    await User.findOrCreate({
      where: { email: 'admin@megastore.com' },
      defaults: { name: 'Store Owner', password: 'admin123', role: 'admin' }
    });

    res.send("<h1>✅ SUCCESS! Database seeded with products and Admin user!</h1><p>You can close this tab now.</p>");
  } catch (error) {
    res.status(500).send("❌ Error: " + error.message);
  }
});

// --- ROUTES ---
app.get('/api/products', async (req, res) => res.json(await Product.findAll()));
app.post('/api/products', async (req, res) => res.json(await Product.create(req.body)));

app.post('/api/signup', async (req, res) => {
  try { res.json(await User.create(req.body)); }
  catch (error) { res.status(400).json({ error: "Email exists!" }); }
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email, password: req.body.password } });
  user ? res.json({ user }) : res.status(401).json({ error: "Failed" });
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.json({ message: "Order Successful!", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  const products = await Product.count();
  const orders = await Order.count();
  const revenue = await Order.sum('totalAmount') || 0;
  res.json({ products, orders, revenue });
});

app.get('/api/users', async (req, res) => res.json(await User.findAll()));
app.get('/api/orders', async (req, res) => res.json(await Order.findAll()));

app.listen(5000, () => console.log("Server awake on 5000"));

// --- PLACE A NEW ORDER ---
app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, address, phone, totalAmount, items } = req.body;

  // Convert the array of cart items into a string so SQLite can save it
  const itemsString = JSON.stringify(items);

  const sql = `INSERT INTO orders (customerName, customerEmail, address, phone, totalAmount, items) 
               VALUES (?, ?, ?, ?, ?, ?)`;
               
  const params = [customerName, customerEmail, address, phone, totalAmount, itemsString];

  db.run(sql, params, function(err) {
    if (err) {
      console.error("Failed to save order:", err);
      return res.status(500).json({ error: "Failed to process order" });
    }
    // Respond back to React with success!
    res.status(201).json({ 
      message: "Order placed successfully!", 
      orderId: this.lastID 
    });
  });
});

// --- FETCH ALL ORDERS FOR ADMIN PANEL ---
app.get('/api/admin/orders', (req, res) => {
  const sql = `SELECT * FROM orders ORDER BY createdAt DESC`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Failed to fetch orders:", err);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }
    res.json(rows);
  });
});