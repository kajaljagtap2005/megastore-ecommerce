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