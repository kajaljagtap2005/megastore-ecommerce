import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
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

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) setIsRenderAsleep(true);
        else { setProducts(data); setIsRenderAsleep(false); }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
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

  // Main UI Wrapper adjusting for Dark/Light mode
  const appStyle = { 
    background: isDarkMode ? '#0a0a0a' : '#f4f7f6', 
    color: isDarkMode ? '#f4f7f6' : '#333', 
    minHeight: '100vh', 
    transition: 'all 0.3s ease' 
  };

  return (
    <div style={appStyle}>
      <Navbar 
        setView={setView} cartCount={cart.length} likeCount={likedItems.length} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode}
        currentUser={currentUser} handleLogout={handleLogout}
      />

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '65vh' }}>
        {view === 'home' && (
          <Home 
            products={products} isLoading={isLoading} isRenderAsleep={isRenderAsleep} 
            addToCart={addToCart} toggleLike={toggleLike} likedItems={likedItems} isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'cart' && <h2 style={{ textAlign: 'center' }}>Your Cart ({cart.length} items)</h2>}
        {view === 'login' && <h2 style={{ textAlign: 'center' }}>Login / Sign Up System</h2>}
        {view === 'admin' && <h2 style={{ textAlign: 'center', color: '#e94560' }}>Admin Dashboard</h2>}
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;