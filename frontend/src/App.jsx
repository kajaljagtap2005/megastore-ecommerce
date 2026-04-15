import { useState, useEffect } from 'react';
import './index.css';

function App() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('home'); 
  const [authMode, setAuthMode] = useState('login'); 
  const [adminTab, setAdminTab] = useState('dashboard'); 
  
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [likedItems, setLikedItems] = useState([]); // NEW: Wishlist State!
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
    { id: 3, name: 'Admin Boss', email: 'admin@megastore.com', role: 'admin' }
  ]);

  const API_URL = "https://megastore-ecommerce.onrender.com";

  // --- LIFECYCLE ---
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error("Backend issue");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setIsLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setIsLoading(false);
      });
  }, []);

  // --- ACTIONS ---
  const addToCart = (product) => setCart([...cart, product]);
  
  // NEW: Toggle Like Function
  const toggleLike = (productId) => {
    if (likedItems.includes(productId)) {
      setLikedItems(likedItems.filter(id => id !== productId));
    } else {
      setLikedItems([...likedItems, productId]);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if(cart.length === 0) return alert("Cart is empty!");
    alert("🎉 Order placed successfully!");
    setCart([]);
    setView('home');
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (email === 'admin@megastore.com' && password === 'admin123') {
      setCurrentUser({ name: 'Admin', email, role: 'admin' });
      setView('admin');
      return;
    }
    setCurrentUser({ name: email.split('@')[0], email, role: 'customer' });
    setView('home');
  };

  // --- SHARED STYLES ---
  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', marginBottom: '15px', background: isDarkMode ? '#222' : '#fff', color: isDarkMode ? '#fff' : '#000' };
  const cardStyle = { background: isDarkMode ? '#1a1a2e' : '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', minWidth: '600px', textAlign: 'left' };
  const navBtnStyle = { background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px', padding: '8px' };

  return (
    <div style={{ width: '100%' }}> {/* REMOVED the rigid 1000px lock here! */}
      
      {/* 1. RESPONSIVE NAVBAR */}
      <nav className="navbar">
        <div onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
          <span style={{fontSize: '28px', color: '#e94560', fontWeight: 'bold'}}>MEGA</span><span style={{fontWeight: 300, fontSize: '28px'}}>STORE</span>
        </div>
        
        <div className="nav-links">
          <button style={navBtnStyle} onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button style={navBtnStyle} onClick={() => setView('home')}>Shop</button>
          
          {/* NEW: Wishlist Indicator in Navbar */}
          <button style={navBtnStyle}>❤️ Likes ({likedItems.length})</button>
          
          <button style={{...navBtnStyle, position: 'relative'}} onClick={() => setView('cart')}>
            🛒 Cart
            {cart.length > 0 && <span style={{ position: 'absolute', top: '0', right: '-5px', background: '#e94560', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' }}>{cart.length}</span>}
          </button>
          
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: isDarkMode ? '#222' : '#f0f0f0', padding: '5px 15px', borderRadius: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Hi, {currentUser.name}</span>
              {currentUser.role === 'admin' && <button style={{...navBtnStyle, color: '#e94560', fontWeight: 'bold'}} onClick={() => setView('admin')}>Admin</button>}
              <button style={navBtnStyle} onClick={() => { setCurrentUser(null); setView('home'); }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setView('login')} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Sign In</button>
          )}
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 5%', minHeight: '70vh' }}>
        
        {/* 2. AUTHENTICATION */}
        {view === 'login' && (
          <div style={{ maxWidth: '450px', margin: '0 auto', ...cardStyle }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '28px' }}>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <form onSubmit={handleAuth}>
              {authMode === 'signup' && <input name="name" type="text" placeholder="Full Name" required style={inputStyle} />}
              <input name="email" type="email" placeholder="Email Address" required style={inputStyle} defaultValue="admin@megastore.com" />
              <input name="password" type="password" placeholder="Password" required style={inputStyle} defaultValue="admin123" />
              <button type="submit" style={{ width: '100%', padding: '14px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                {authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
              <span onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{ color: '#e94560', cursor: 'pointer', fontWeight: 'bold' }}>
                {authMode === 'login' ? 'Switch to Sign Up' : 'Switch to Log In'}
              </span>
            </p>
          </div>
        )}

        {/* 3. HOME PAGE (RESPONSIVE PRODUCTS WITH LIKES) */}
        {view === 'home' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '10px' }}>New Arrivals</h1>
              <p style={{ opacity: 0.7, fontSize: '1.2rem' }}>Discover our premium collection.</p>
            </div>
            {isLoading ? <h3 style={{textAlign: 'center'}}>Loading catalog...</h3> : (
              
              // NEW: Using the exact CSS grid class we made for responsiveness
              <div className="product-grid">
                {products.length === 0 ? <p style={{textAlign:'center', gridColumn: '1 / -1'}}>No products found. Is the backend asleep?</p> : null}
                {products.map(product => {
                  const isLiked = likedItems.includes(product.id);
                  return (
                    <div key={product.id} className="product-card" style={cardStyle}>
                      
                      {/* NEW: The Like Button! */}
                      <button 
                        onClick={() => toggleLike(product.id)} 
                        style={{ position: 'absolute', top: '15px', right: '15px', background: isDarkMode ? '#111' : '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isLiked ? '❤️' : '🤍'}
                      </button>

                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
                      <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>{product.name}</h3>
                      <p style={{ color: '#e94560', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '15px' }}>${product.price ? product.price.toFixed(2) : '0.00'}</p>
                      <button onClick={() => addToCart(product)} style={{ marginTop: 'auto', padding: '12px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Add to Cart</button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* 4. CART & CHECKOUT */}
        {view === 'cart' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', ...cardStyle }}>
            <h2 style={{ borderBottom: '2px solid #e94560', paddingBottom: '15px', marginBottom: '20px' }}>Your Shopping Cart</h2>
            {cart.length === 0 ? <p>Your cart is empty.</p> : (
              <>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #444' }}>
                    <span>{item.name}</span>
                    <span style={{ fontWeight: 'bold' }}>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <h3 style={{ textAlign: 'right', marginTop: '20px' }}>Total: <span style={{ color: '#e94560' }}>${cart.reduce((s, i) => s + i.price, 0).toFixed(2)}</span></h3>
                <form onSubmit={handleCheckout} style={{ marginTop: '40px' }}>
                  <h3>Shipping Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                    <input type="text" placeholder="Full Name" required style={inputStyle} />
                    <input type="email" placeholder="Email" required style={inputStyle} />
                    <textarea placeholder="Full Shipping Address" required style={{ height: '100px', ...inputStyle }}></textarea>
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>Place Secure Order</button>
                </form>
              </>
            )}
          </div>
        )}

        {/* 5. RESPONSIVE ADMIN PANEL */}
        {view === 'admin' && currentUser?.role === 'admin' && (
          <div className="admin-layout">
            <div style={{ width: '100%', maxWidth: '250px', ...cardStyle, padding: '20px', height: 'fit-content' }}>
              <h3 style={{ marginBottom: '20px', color: '#e94560' }}>Admin Menu</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><button onClick={() => setAdminTab('dashboard')} style={{ width: '100%', padding: '10px', textAlign: 'left', background: adminTab === 'dashboard' ? '#e94560' : 'transparent', color: adminTab === 'dashboard' ? '#fff' : 'inherit', border: 'none', borderRadius: '6px' }}>📊 Dashboard</button></li>
                <li><button onClick={() => setAdminTab('orders')} style={{ width: '100%', padding: '10px', textAlign: 'left', background: adminTab === 'orders' ? '#e94560' : 'transparent', color: adminTab === 'orders' ? '#fff' : 'inherit', border: 'none', borderRadius: '6px' }}>📦 Order Table</button></li>
              </ul>
            </div>

            <div style={{ flex: 1, ...cardStyle, overflow: 'hidden' }}>
              {adminTab === 'dashboard' && <h2>Executive Overview: {products.length} Products Live</h2>}
              {adminTab === 'orders' && (
                <div className="table-responsive">
                  <h2>Order Management</h2>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={{padding: '12px', borderBottom: '2px solid #e94560', color: '#e94560'}}>Order ID</th>
                        <th style={{padding: '12px', borderBottom: '2px solid #e94560', color: '#e94560'}}>Customer</th>
                        <th style={{padding: '12px', borderBottom: '2px solid #e94560', color: '#e94560'}}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map(o => (
                        <tr key={o.id}>
                          <td style={{padding: '12px', borderBottom: '1px solid #444'}}>{o.id}</td>
                          <td style={{padding: '12px', borderBottom: '1px solid #444'}}>{o.user}</td>
                          <td style={{padding: '12px', borderBottom: '1px solid #444'}}>${o.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* 6. FOOTER */}
      <footer style={{ textAlign: 'center', padding: '40px', marginTop: '60px', borderTop: isDarkMode ? '1px solid #333' : '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '10px' }}>MEGASTORE</h2>
        <p style={{ opacity: 0.7 }}>Premium products delivered worldwide.</p>
      </footer>
    </div>
  );
}

export default App;