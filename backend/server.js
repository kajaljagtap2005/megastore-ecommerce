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

// UPGRADED ORDER BLUEPRINT: Now includes Address and Phone!
const Order = sequelize.define('Order', {
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerEmail: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  items: { type: DataTypes.JSON, allowNull: false } 
});

sequelize.authenticate()
  .then(() => sequelize.sync({ alter: true })) // 'alter' adds the new address/phone columns automatically
  .then(() => console.log("✅ Database Upgraded with Address & Phone support!"))
  .catch(err => console.log("❌ Error:", err.message));

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

// PLACE REAL ORDER
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.json({ message: "Order Successful!", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN DATA
app.get('/api/admin/stats', async (req, res) => {
  const products = await Product.count();
  const orders = await Order.count();
  const revenue = await Order.sum('totalAmount') || 0;
  res.json({ products, orders, revenue });
});

app.get('/api/users', async (req, res) => res.json(await User.findAll()));
app.get('/api/orders', async (req, res) => res.json(await Order.findAll()));

app.listen(5000, () => console.log("Server awake on 5000"));