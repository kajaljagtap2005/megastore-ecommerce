import { useState, useEffect } from 'react';
import './index.css';

function App() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('home'); 
  const [authMode, setAuthMode] = useState('login'); 
  const [adminTab, setAdminTab] = useState('dashboard'); 
  
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock Data for Admin Tables
  const [mockOrders] = useState([
    { id: 'ORD-101', user: 'john@example.com', total: 299.99, status: 'Shipped', date: '2026-04-14' },
    { id: 'ORD-102', user: 'sarah@example.com', total: 89.50, status: 'Processing', date: '2026-04-15' }
  ]);
  const [mockUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'customer' },
    { id: 3, name: 'Admin Boss', email: 'admin@megastore.com', role: 'admin' }
  ]);

  const API_URL = "https://megastore-ecommerce.onrender.com";

  // --- LIFECYCLE & FETCHING ---
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error("Backend not responding cleanly");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error caught safely:", err);
        setProducts([]);
        setIsLoading(false);
      });
  }, []);

  // --- ACTIONS ---
  const addToCart = (product) => setCart([...cart, product]);
  
  const handleCheckout = (e) => {
    e.preventDefault();
    if(cart.length === 0) return alert("Cart is empty!");
    alert("🎉 Order placed successfully! We are processing it now.");
    setCart([]);
    setView('home');
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // Admin Bypass for testing
    if (email === 'admin@megastore.com' && password === 'admin123') {
      setCurrentUser({ name: 'Admin', email, role: 'admin' });
      setView('admin');
      return;
    }
    
    // Normal User Simulation
    setCurrentUser({ name: email.split('@')[0], email, role: 'customer' });
    setView('home');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    alert("Product Upload UI triggered! (Requires backend endpoint to save permanently)");
    e.target.reset();
  };

  // --- SHARED STYLES ---
  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', marginBottom: '15px', background: isDarkMode ? '#222' : '#fff', color: isDarkMode ? '#fff' : '#000' };
  const cardStyle = { background: isDarkMode ? '#1a1a2e' : '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' };
  const thStyle = { padding: '12px', borderBottom: '2px solid #e94560', color: '#e94560' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #444' };

  return (
    <div style={{ minWidth: '1000px' }}>
      {/* 1. PREMIUM NAVBAR */}
      <nav className="navbar" style={{ padding: '15px 5%', display: 'flex', alignItems: 'center', gap: '20px', background: isDarkMode ? '#111' : '#fff', borderBottom: isDarkMode ? '1px solid #333' : '1px solid #eee' }}>
        <div className="nav-brand" onClick={() => setView('home')} style={{ flexGrow: 1, cursor: 'pointer' }}>
          <span style={{fontSize: '28px', color: '#e94560', fontWeight: 'bold'}}>MEGA</span><span style={{fontWeight: 300, fontSize: '28px'}}>STORE</span>
        </div>
        
        <div className="nav-links" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button className="nav-btn" onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button className="nav-btn" onClick={() => setView('home')} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}>Shop</button>
          
          <button className="nav-btn" onClick={() => setView('cart')} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px', position: 'relative' }}>
            🛒 Cart
            {cart.length > 0 && <span style={{ position: 'absolute', top: '-10px', right: '-15px', background: '#e94560', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' }}>{cart.length}</span>}
          </button>
          
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: isDarkMode ? '#222' : '#f0f0f0', padding: '8px 15px', borderRadius: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Hi, {currentUser.name}</span>
              {currentUser.role === 'admin' && <button style={{ background: 'transparent', border: 'none', color: '#e94560', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setView('admin')}>Admin Panel</button>}
              <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => { setCurrentUser(null); setView('home'); }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setView('login')} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Sign In</button>
          )}
        </div>
      </nav>

      <main className="main-container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '70vh' }}>
        
        {/* 2. AUTHENTICATION (LOGIN / SIGNUP) */}
        {view === 'login' && (
          <div style={{ maxWidth: '450px', margin: '0 auto', ...cardStyle }}>
            <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '28px' }}>
              {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px' }}>
              {authMode === 'login' ? 'Enter your details to access your account.' : 'Join Megastore today.'}
            </p>

            <button onClick={() => alert("Google Auth requires backend integration. Proceed with Email for testing!")} style={{ width: '100%', padding: '12px', background: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
              🌐 Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#888' }}>
              <div style={{ flex: 1, height: '1px', background: '#ccc' }}></div>
              <span style={{ padding: '0 10px', fontSize: '14px' }}>or continue with email</span>
              <div style={{ flex: 1, height: '1px', background: '#ccc' }}></div>
            </div>

            <form onSubmit={handleAuth}>
              {authMode === 'signup' && <input name="name" type="text" placeholder="Full Name" required style={inputStyle} />}
              <input name="email" type="email" placeholder="Email Address" required style={inputStyle} defaultValue="admin@megastore.com" />
              <input name="password" type="password" placeholder="Password" required style={inputStyle} defaultValue="admin123" />
              
              <button type="submit" style={{ width: '100%', padding: '14px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                {authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{ color: '#e94560', cursor: 'pointer', fontWeight: 'bold' }}>
                {authMode === 'login' ? 'Sign Up' : 'Log In'}
              </span>
            </p>
          </div>
        )}

        {/* 3. HOME PAGE (PRODUCTS) */}
        {view === 'home' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>New Arrivals</h1>
              <p style={{ opacity: 0.7, fontSize: '1.2rem' }}>Discover our premium collection.</p>
            </div>
            {isLoading ? <h3 style={{textAlign: 'center'}}>Loading catalog...</h3> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
                {products.length === 0 ? <p style={{textAlign:'center', gridColumn: '1 / -1'}}>No products found. Is the backend asleep?</p> : null}
                {products.map(product => (
                  <div key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column', ...cardStyle }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
                    <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>{product.name}</h3>
                    <p style={{ color: '#e94560', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '15px' }}>${product.price ? product.price.toFixed(2) : '0.00'}</p>
                    <button onClick={() => addToCart(product)} style={{ marginTop: 'auto', padding: '12px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Add to Cart</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 4. CART & CHECKOUT */}
        {view === 'cart' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', ...cardStyle }}>
            <h2 style={{ borderBottom: '2px solid #e94560', paddingBottom: '15px', marginBottom: '20px' }}>Your Shopping Cart</h2>
            {cart.length === 0 ? <p>Your cart is empty. Let's go shopping!</p> : (
              <>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #444' }}>
                    <span style={{ fontSize: '18px' }}>{item.name}</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <h3 style={{ textAlign: 'right', marginTop: '20px', fontSize: '24px' }}>
                  Total: <span style={{ color: '#e94560' }}>${cart.reduce((s, i) => s + i.price, 0).toFixed(2)}</span>
                </h3>
                
                <form onSubmit={handleCheckout} style={{ marginTop: '40px' }}>
                  <h3>Shipping Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                    <input type="text" placeholder="First Name" required style={inputStyle} />
                    <input type="text" placeholder="Last Name" required style={inputStyle} />
                    {/* Fixed the duplicate style prop below! */}
                    <input type="email" placeholder="Email" required style={{ gridColumn: '1 / -1', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', marginBottom: '15px', background: isDarkMode ? '#222' : '#fff', color: isDarkMode ? '#fff' : '#000' }} />
                    <textarea placeholder="Full Shipping Address" required style={{ gridColumn: '1 / -1', height: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', marginBottom: '15px', background: isDarkMode ? '#222' : '#fff', color: isDarkMode ? '#fff' : '#000' }}></textarea>
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Place Secure Order
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* 5. ADMIN PANEL (TABLES & UPLOAD) */}
        {view === 'admin' && currentUser?.role === 'admin' && (
          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ width: '250px', ...cardStyle, height: 'fit-content', padding: '20px' }}>
              <h3 style={{ marginBottom: '20px', color: '#e94560' }}>Admin Menu</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><button onClick={() => setAdminTab('dashboard')} style={{ width: '100%', padding: '10px', textAlign: 'left', background: adminTab === 'dashboard' ? '#e94560' : 'transparent', color: adminTab === 'dashboard' ? '#fff' : 'inherit', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>📊 Dashboard</button></li>
                <li><button onClick={() => setAdminTab('orders')} style={{ width: '100%', padding: '10px', textAlign: 'left', background: adminTab === 'orders' ? '#e94560' : 'transparent', color: adminTab === 'orders' ? '#fff' : 'inherit', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>📦 Order Table</button></li>
                <li><button onClick={() => setAdminTab('users')} style={{ width: '100%', padding: '10px', textAlign: 'left', background: adminTab === 'users' ? '#e94560' : 'transparent', color: adminTab === 'users' ? '#fff' : 'inherit', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>👥 Registered Users</button></li>
                <li><button onClick={() => setAdminTab('add-product')} style={{ width: '100%', padding: '10px', textAlign: 'left', background: adminTab === 'add-product' ? '#e94560' : 'transparent', color: adminTab === 'add-product' ? '#fff' : 'inherit', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>➕ Upload Product</button></li>
              </ul>
            </div>

            <div style={{ flex: 1, ...cardStyle }}>
              {adminTab === 'dashboard' && (
                <div>
                  <h2>Executive Overview</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
                    <div style={{ padding: '20px', background: 'rgba(233, 69, 96, 0.1)', borderRadius: '8px', borderLeft: '4px solid #e94560' }}>
                      <p style={{ margin: 0, opacity: 0.8 }}>Total Revenue</p>
                      <h2 style={{ margin: '10px 0 0 0', fontSize: '2rem' }}>$14,592</h2>
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(40, 167, 69, 0.1)', borderRadius: '8px', borderLeft: '4px solid #28a745' }}>
                      <p style={{ margin: 0, opacity: 0.8 }}>Total Users</p>
                      <h2 style={{ margin: '10px 0 0 0', fontSize: '2rem' }}>{mockUsers.length}</h2>
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(0, 123, 255, 0.1)', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
                      <p style={{ margin: 0, opacity: 0.8 }}>Products Live</p>
                      <h2 style={{ margin: '10px 0 0 0', fontSize: '2rem' }}>{products.length}</h2>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'orders' && (
                <div>
                  <h2>Order Management Table</h2>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Order ID</th>
                        <th style={thStyle}>Customer</th>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Total</th>
                        <th style={thStyle}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map(order => (
                        <tr key={order.id}>
                          <td style={tdStyle}>{order.id}</td>
                          <td style={tdStyle}>{order.user}</td>
                          <td style={tdStyle}>{order.date}</td>
                          <td style={tdStyle}>${order.total.toFixed(2)}</td>
                          <td style={tdStyle}><span style={{ padding: '4px 8px', background: order.status === 'Shipped' ? '#28a745' : '#ffc107', color: '#fff', borderRadius: '12px', fontSize: '12px' }}>{order.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {adminTab === 'users' && (
                <div>
                  <h2>Registered Users Table</h2>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map(user => (
                        <tr key={user.id}>
                          <td style={tdStyle}>{user.id}</td>
                          <td style={tdStyle}>{user.name}</td>
                          <td style={tdStyle}>{user.email}</td>
                          <td style={tdStyle}>{user.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {adminTab === 'add-product' && (
                <div>
                  <h2>Upload New Product</h2>
                  <form onSubmit={handleAddProduct} style={{ marginTop: '20px', maxWidth: '500px' }}>
                    <label>Product Name</label>
                    <input type="text" placeholder="e.g. Wireless Headphones" required style={inputStyle} />
                    
                    <label>Price ($)</label>
                    <input type="number" step="0.01" placeholder="99.99" required style={inputStyle} />
                    
                    <label>Image URL</label>
                    <input type="url" placeholder="https://unsplash.com/..." required style={inputStyle} />
                    
                    <label>Description</label>
                    <textarea placeholder="Enter product details..." style={{...inputStyle, height: '100px'}} required></textarea>
                    
                    <button type="submit" style={{ padding: '12px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Publish Product
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* 6. FOOTER */}
      <footer className="footer" style={{ textAlign: 'center', padding: '40px', marginTop: '60px', borderTop: isDarkMode ? '1px solid #333' : '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '10px' }}>MEGASTORE</h2>
        <p style={{ opacity: 0.7 }}>Premium products delivered worldwide.</p>
      </footer>
    </div>
  );
}

export default App;