import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [view, setView] = useState('home');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRenderAsleep, setIsRenderAsleep] = useState(false);

  const API_URL = "https://megastore-ecommerce.onrender.com";

  // Handles Dark Mode
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  // INDESTRUCTIBLE FETCH LOGIC
  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        // SHIELD 1: Check if the data is actually a list (array)
        if (Array.isArray(data)) {
          if (data.length === 0) {
            setIsRenderAsleep(true); // Wiped database
            setProducts([]);
          } else {
            setProducts(data); // Healthy database
            setIsRenderAsleep(false);
          }
        } else {
          // Backend sent a weird error object
          setIsRenderAsleep(true);
          setProducts([]); 
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Backend connection failed:", err);
        setIsRenderAsleep(true); // If the fetch totally fails, assume it's asleep
        setProducts([]);
        setIsLoading(false);
      });
  }, [view]);

  const addToCart = (product) => setCart([...cart, product]);
  
  const toggleLike = (productId) => {
    if (likedItems.includes(productId)) {
      setLikedItems(likedItems.filter(id => id !== productId));
    } else {
      setLikedItems([...likedItems, productId]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setView('home')}>
          <span>MEGA</span>STORE
        </div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button className="nav-btn" onClick={() => setView('home')}>Shop</button>
          <button className="nav-btn">❤️ Likes ({likedItems.length})</button>
          <button className="nav-btn" onClick={() => setView('cart')}>🛒 Cart ({cart.length})</button>
          
          {currentUser ? (
            <>
              {currentUser.role === 'admin' && <button className="nav-btn" style={{color: '#e94560'}} onClick={() => setView('admin')}>Admin</button>}
              <button className="nav-btn" onClick={handleLogout}>Logout ({currentUser.name})</button>
            </>
          ) : (
            <button className="nav-btn" onClick={() => setView('login')}>Login / Sign Up</button>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-container">
        
        {isRenderAsleep && view === 'home' && (
          <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', color: '#856404' }}>
            <h3>⚠️ Products Sleeping?</h3>
            <p style={{marginBottom: '10px'}}>The free Render backend is asleep or returned an error.</p>
            <a href={`${API_URL}/seed`} target="_blank" rel="noreferrer" style={{ background: '#ffc107', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', color: '#000', textDecoration: 'none', display: 'inline-block' }}>
              Click here to wake up the database!
            </a>
          </div>
        )}

        {view === 'home' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '0.5rem' }}>Premium Collection</h2>
              <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Discover our highly curated selection.</p>
            </div>

            {isLoading ? <h3 style={{ textAlign: 'center' }}>Loading stunning products...</h3> : (
              <div className="product-grid">
                {/* SHIELD 2: Ensure products is mapped safely */}
                {(Array.isArray(products) ? products : []).map(product => {
                  const isLiked = likedItems.includes(product.id);
                  return (
                    <div key={product.id} className="product-card">
                      <button 
                        onClick={() => toggleLike(product.id)} 
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', zIndex: 2 }}>
                        {isLiked ? '❤️' : '🤍'}
                      </button>
                      <img src={product.image} alt={product.name} className="product-image" />
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-price">${product.price ? product.price.toFixed(2) : '0.00'}</p>
                      <button className="btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {view === 'cart' && <h2 style={{ textAlign: 'center' }}>Your Cart ({cart.length} items)</h2>}
        {view === 'login' && <h2 style={{ textAlign: 'center' }}>Login / Sign Up System</h2>}
        {view === 'admin' && <h2 style={{ textAlign: 'center', color: '#e94560' }}>Admin Dashboard</h2>}
        
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <h2 style={{ marginBottom: '1rem' }}>MEGASTORE</h2>
        <p style={{ marginBottom: '1rem', opacity: 0.8 }}>Premium products delivered worldwide.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.9rem', opacity: 0.6 }}>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
          <p>© 2026 Megastore Inc.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;