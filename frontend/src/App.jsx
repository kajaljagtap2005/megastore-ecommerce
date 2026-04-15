import { useState, useEffect } from 'react';
import './index.css';

function App() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('home'); // Controls what page we are looking at (home, login, cart, admin)
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminStats, setAdminStats] = useState({ products: 0, orders: 0, revenue: 0 });

  const API_URL = "https://megastore-ecommerce.onrender.com";

  // --- FETCH DATA FROM RENDER ---
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // Fetch Admin Stats automatically if the admin logs in
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && view === 'admin') {
      fetch(`${API_URL}/api/admin/stats`)
        .then(res => res.json())
        .then(data => setAdminStats(data))
        .catch(err => console.error("Error fetching stats:", err));
    }
  }, [currentUser, view]);

  // --- ACTIONS ---
  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setView(data.user.role === 'admin' ? 'admin' : 'home'); // Send Admins to dashboard, users to home
        alert(`Welcome, ${data.user.name}!`);
      } else {
        alert("Login failed. Please check your email and password.");
      }
    } catch (error) {
      alert("Error logging in to the server.");
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if(cart.length === 0) return alert("Your cart is empty!");

    const orderData = {
      customerName: e.target.name.value,
      customerEmail: e.target.email.value,
      address: e.target.address.value,
      phone: e.target.phone.value,
      totalAmount: cart.reduce((sum, item) => sum + item.price, 0),
      items: cart
    };

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      alert(data.message || "Order Placed Successfully!");
      setCart([]); // Empty the cart after successful order
      setView('home'); // Send user back to homepage
    } catch(err) {
      alert("Order failed. Please try again.");
    }
  };

  // --- THE WEBSITE VISUALS ---
  return (
    <div>
      {/* 1. NAVIGATION BAR */}
      <nav style={{ padding: '20px', background: '#222', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setView('home')}>🛍️ MEGASTORE</h2>
        <div>
          <button onClick={() => setView('home')} style={navButtonStyle}>Home</button>
          <button onClick={() => setView('cart')} style={navButtonStyle}>Cart ({cart.length})</button>
          
          {/* Show Login button OR User profile/logout */}
          {currentUser ? (
            <>
              {currentUser.role === 'admin' && (
                <button onClick={() => setView('admin')} style={adminButtonStyle}>Admin Panel</button>
              )}
              <button onClick={() => { setCurrentUser(null); setView('home'); }} style={navButtonStyle}>Logout</button>
            </>
          ) : (
            <button onClick={() => setView('login')} style={navButtonStyle}>Login</button>
          )}
        </div>
      </nav>

      <div style={{ padding: '20px', minHeight: '75vh' }}>
        
        {/* 2. HOME PAGE (PRODUCT GALLERY) */}
        {view === 'home' && (
          <div>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Welcome to Megastore</h1>
            <div className="product-container">
              {products.length === 0 ? <p style={{textAlign: 'center'}}>Loading products...</p> : null}
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <h3>{product.name}</h3>
                  <p style={{ fontWeight: 'bold', color: '#555' }}>${product.price.toFixed(2)}</p>
                  <button onClick={() => addToCart(product)} style={primaryButtonStyle}>Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SHOPPING CART & CHECKOUT PAGE */}
        {view === 'cart' && (
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#f9f9f9', padding: '30px', borderRadius: '10px' }}>
            <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Your Shopping Cart</h2>
            
            {cart.length === 0 ? <p>Your cart is totally empty. Go add some products!</p> : (
              <>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {cart.map((item, index) => (
                    <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.name}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <h3 style={{ textAlign: 'right' }}>Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</h3>

                <h3 style={{ marginTop: '40px' }}>Shipping & Checkout</h3>
                <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input name="name" type="text" placeholder="Full Name" required style={inputStyle} />
                  <input name="email" type="email" placeholder="Email Address" required style={inputStyle} />
                  <input name="address" type="text" placeholder="Full Shipping Address" required style={inputStyle} />
                  <input name="phone" type="text" placeholder="Phone Number" required style={inputStyle} />
                  <button type="submit" style={successButtonStyle}>Place Secure Order</button>
                </form>
              </>
            )}
          </div>
        )}

        {/* 4. LOGIN / SIGNUP PAGE */}
        {view === 'login' && (
          <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', background: '#f9f9f9', padding: '40px', borderRadius: '10px' }}>
            <h2>Account Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <input name="email" type="email" placeholder="Email Address" required style={inputStyle} />
              <input name="password" type="password" placeholder="Password" required style={inputStyle} />
              <button type="submit" style={primaryButtonStyle}>Login Securely</button>
            </form>
            <div style={{ marginTop: '30px', padding: '15px', background: '#e9ecef', borderRadius: '8px', fontSize: '14px' }}>
              <p style={{ margin: 0 }}><strong>🔑 Admin Access Credentials:</strong></p>
              <p style={{ margin: '5px 0 0 0' }}>Email: admin@megastore.com</p>
              <p style={{ margin: 0 }}>Password: admin123</p>
            </div>
          </div>
        )}

        {/* 5. ADMIN DASHBOARD */}
        {view === 'admin' && currentUser?.role === 'admin' && (
          <div style={{ textAlign: 'center' }}>
            <h2>⚙️ Store Management Dashboard</h2>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '40px' }}>
              
              <div style={statBoxStyle}>
                <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Products</h3>
                <h1 style={{ margin: 0, fontSize: '3rem', color: '#007bff' }}>{adminStats.products}</h1>
              </div>
              
              <div style={statBoxStyle}>
                <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Orders</h3>
                <h1 style={{ margin: 0, fontSize: '3rem', color: '#28a745' }}>{adminStats.orders}</h1>
              </div>
              
              <div style={statBoxStyle}>
                <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Revenue</h3>
                <h1 style={{ margin: 0, fontSize: '3rem', color: '#ffc107' }}>${adminStats.revenue ? adminStats.revenue.toFixed(2) : '0.00'}</h1>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* 6. FOOTER */}
      <footer style={{ textAlign: 'center', padding: '30px', background: '#222', color: '#aaa', marginTop: '40px' }}>
        <h2>MEGASTORE</h2>
        <p>Premium products delivered right to your door.</p>
        <p style={{ fontSize: '12px' }}>© 2026 Megastore Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

// --- BASIC BUTTON & INPUT STYLES TO KEEP CODE CLEAN ---
const navButtonStyle = { background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', marginLeft: '15px' };
const adminButtonStyle = { ...navButtonStyle, color: '#ffc107', fontWeight: 'bold' };
const primaryButtonStyle = { padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', width: '100%' };
const successButtonStyle = { ...primaryButtonStyle, background: '#28a745' };
const inputStyle = { padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' };
const statBoxStyle = { padding: '30px', background: 'white', border: '1px solid #eaeaea', borderRadius: '10px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };

export default App;