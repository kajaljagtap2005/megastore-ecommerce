import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Login from './pages/Login' 
import Admin from './pages/Admin'
import Navbar from './components/Navbar'
import Footer from './components/Footer' // 👈 NEW: We imported your Footer!

function App() {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [user, setUser] = useState(null)
  const [salesStats, setSalesStats] = useState({ orders: 0, revenue: 0 })
  const [storeProducts, setStoreProducts] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => setStoreProducts(data))
      .catch(error => console.log("Failed to fetch database:", error));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product])
    alert(product.name + " added to cart!")
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const toggleWishlist = (product) => {
    if (wishlist.find(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id))
    } else {
      setWishlist([...wishlist, product])
    }
  }

  const finalizeSale = (amount) => {
    setSalesStats(prev => ({
      orders: prev.orders + 1,
      revenue: prev.revenue + amount
    }))
    setCart([]) 
  }

  return (
    // We added display: 'flex' and flex-direction: 'column' to push the footer to the bottom
    <div className="app-container" style={{ backgroundColor: isDarkMode ? '#121212' : '#fff', color: isDarkMode ? '#fff' : '#000', minHeight: '100vh', transition: '0.3s', display: 'flex', flexDirection: 'column' }}>
      <BrowserRouter>
        <Navbar 
          cartCount={cart.length} 
          wishlistCount={wishlist.length} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          user={user} 
          handleLogout={() => setUser(null)}
        />
        
        {/* The main content takes up all available space, pushing the footer down */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home products={storeProducts} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} isDarkMode={isDarkMode} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
            <Route path="/wishlist" element={<Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} finalizeSale={finalizeSale} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route 
              path="/admin" 
              element={
                user && user.role === 'admin' ? (
                  <Admin orders={salesStats.orders} totalRevenue={salesStats.revenue} productCount={storeProducts.length} />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
          </Routes>
        </div>

        {/* 👈 NEW: The Footer sits at the bottom of the App! */}
        <Footer />
        
      </BrowserRouter>
    </div>
  )
}

export default App