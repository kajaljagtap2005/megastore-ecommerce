import { useState, useEffect } from 'react';
import './index.css';

function App() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('home');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminStats, setAdminStats] = useState({ products: 0, orders: 0, revenue: 0 });
  
  // Custom states for loading and Render sleeping
  const [isLoading, setIsLoading] = useState(true);
  const [isRenderAsleep, setIsRenderAsleep] = useState(false);

  const API_URL = "https://megastore-ecommerce.onrender.com";

  // --- FETCH DATA (With Sleep Detection) ---
  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          setIsRenderAsleep(true); // If array is empty, Render wiped the database
        } else {
          setProducts(data);
          setIsRenderAsleep(false);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setIsLoading(false);
      });
  }, [view]); // Re-fetch when view changes to keep data fresh

  // --- ACTIONS ---
  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`✨ ${product.name} added to your cart!`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // Hardcoded fallback for Admin if the database is asleep
    if (email === 'admin@megastore.com' && password === 'admin123') {
       setCurrentUser({ name: 'Admin', role: 'admin' });
       setView('admin');
       return;
    }

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setView(data.user.role === 'admin' ? 'admin' : 'home');
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      alert("Error logging in.");
    }
  };

  // --- PREMIUM STYLES (Fixed Desktop Layout) ---
  const appStyle = { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#333', background: '#f4f7f6', minHeight: '100vh', minWidth: '1200px' };
  const navStyle = { background: '#1a1a2e', color: 'white', padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
  const containerStyle = { width: '1100px', margin: '40px auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }; // Fixed 4-column layout
  const cardStyle = { border: '1px solid #eee', borderRadius: '10px', padding: '20px', transition: 'transform 0.2s', background: 'white' };
  const btnStyle = { padding: '10px 20px', background: '#e94560', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' };
  const navBtnStyle = { background: 'transparent', color: 'white', border: 'none', fontSize: '16px', cursor: 'pointer', marginLeft: '20px', fontWeight: '500' };

  return (
    <div style={appStyle}>
      {/* NAVIGATION */}
      <nav style={navStyle}>
        <h1 style={{ margin: 0, cursor: 'pointer', fontSize: '28px', letterSpacing: '2px' }} onClick={() => setView('home')}>
          <span style={{color: '#e94560'}}>MEGA</span>STORE
        </h1>
        <div>
          <button onClick={() => setView('home')} style={navBtnStyle}>Shop</button>
          <button onClick={() => setView('cart')} style={navBtnStyle}>Cart ({cart.length})</button>
          {currentUser ? (
            <>
              {currentUser.role === 'admin' && <button onClick={() => setView('admin')} style={{...navBtnStyle, color: '#f9a826'}}>Admin Panel</button>}
              <button onClick={() => { setCurrentUser(null); setView('home'); }} style={navBtnStyle}>Logout</button>
            </>
          ) : (
            <button onClick={() => setView('login')} style={navBtnStyle}>Login</button>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div style={containerStyle}>
        
        {/* DATABASE ASLEEP WARNING */}
        {isRenderAsleep && view === 'home' && (
          <div style={{ background: '#fff3cd', borderLeft: '6px solid #ffc107', padding: '20px', marginBottom: '30px', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ The Database is Sleeping!</h3>
            <p style={{ margin: '0 0 15px 0', color: '#856404' }}>Because you are on a free tier, Render wiped the products while you were away.</p>
            <a href={`${API_URL}/seed`} target="_blank" rel="noreferrer" style={{ background: '#ffc107', color: '#000', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
              Click Here to Wake Up Database
            </a>
            <p style={{ fontSize: '12px', marginTop: '10px' }}>*After clicking, wait for the "Success" message in the new tab, then refresh this page!</p>
          </div>
        )}

        {/* HOME PAGE / PRODUCTS */}
        {view === 'home' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{ fontSize: '36px', color: '#1a1a2e', marginBottom: '10px' }}>Premium Collection</h2>
              <p style={{ color: '#777', fontSize: '18px' }}>Discover our highly curated selection of top-tier products.</p>
            </div>

            {isLoading ? (
              <h3 style={{ textAlign: 'center' }}>Loading products...</h3>
            ) : (
              <div style={gridStyle}>
                {products.map(product => (
                  <div key={product.id} style={cardStyle} className="hover-card">
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', marginBottom: '15px' }} />
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1a1a2e' }}>{product.name}</h3>
                    <p style={{ color: '#e94560', fontWeight: 'bold', fontSize: '20px', margin: '0 0 15px 0' }}>${product.price.toFixed(2)}</p>
                    <button onClick={() => addToCart(product)} style={btnStyle}>Add to Cart</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CART PAGE */}
        {view === 'cart' && (
          <div>
            <h2 style={{ fontSize: '32px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Your Cart</h2>
            {cart.length === 0 ? <p style={{ fontSize: '18px' }}>Your cart is empty.</p> : (
              <div>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee', fontSize: '18px' }}>
                    <span>{item.name}</span>
                    <span style={{ fontWeight: 'bold' }}>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ textAlign: 'right', marginTop: '30px', fontSize: '24px' }}>
                  Total: <span style={{ color: '#e94560', fontWeight: 'bold' }}>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </div>
                <button onClick={() => { alert('Order placed! Thank you!'); setCart([]); setView('home'); }} style={{ ...btnStyle, marginTop: '30px', background: '#1a1a2e', padding: '15px', fontSize: '18px' }}>Proceed to Secure Checkout</button>
              </div>
            )}
          </div>
        )}

        {/* LOGIN PAGE */}
        {view === 'login' && (
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', textAlign: 'center' }}>Welcome Back</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
              <input name="email" type="email" placeholder="Email" required style={{ padding: '15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }} />
              <input name="password" type="password" placeholder="Password" required style={{ padding: '15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }} />
              <button type="submit" style={{ ...btnStyle, padding: '15px', fontSize: '18px' }}>Sign In</button>
            </form>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {view === 'admin' && (
          <div>
            <h2 style={{ fontSize: '32px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Executive Dashboard</h2>
            <div style={{ display: 'flex', gap: '30px', marginTop: '40px' }}>
              <div style={{ flex: 1, padding: '30px', background: '#f4f7f6', borderRadius: '10px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#777' }}>Products Live</h3>
                <h1 style={{ margin: '10px 0 0 0', fontSize: '48px', color: '#1a1a2e' }}>{products.length}</h1>
              </div>
              <div style={{ flex: 1, padding: '30px', background: '#f4f7f6', borderRadius: '10px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#777' }}>Pending Orders</h3>
                <h1 style={{ margin: '10px 0 0 0', fontSize: '48px', color: '#e94560' }}>3</h1>
              </div>
            </div>
          </div>
        )}

      </div>
      
      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '40px', color: '#777', marginTop: '50px' }}>
        <p>© 2026 Megastore Premium. Built with React & Node.js.</p>
      </footer>
    </div>
  );
}

export default App;