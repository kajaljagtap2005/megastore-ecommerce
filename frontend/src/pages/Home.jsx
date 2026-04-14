import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 1. NEW: We added `products` to the props being passed in from App.jsx!
function Home({ products = [], addToCart, wishlist, toggleWishlist, isDarkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Sports'];

  // 2. DELETED: The massive hardcoded 'products' array is completely gone! 
  // We are now using the live data from your SQLite database.

  // 3. UPDATED FILTER: We added a tiny safety check just in case a database product doesn't have a category yet.
  const filteredProducts = products.filter((p) => {
    const prodCategory = p.category || 'Uncategorized';
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || prodCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
      
      {/* HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ 
          textAlign: 'center', padding: '100px 20px', 
          background: isDarkMode ? 'linear-gradient(135deg, #333 0%, #000 100%)' : 'linear-gradient(135deg, #1a1a1a 0%, #444 100%)', 
          color: 'white', borderRadius: '40px', marginTop: '30px', marginBottom: '50px'
        }}
      >
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: 0 }}>The Future of Shopping.</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>Experience the next level of e-commerce.</p>
      </motion.div>

      {/* FILTERS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {categories.map((cat) => (
            <button 
              key={cat} onClick={() => setSelectedCategory(cat)} 
              style={{ 
                padding: '12px 25px', borderRadius: '50px', border: 'none', cursor: 'pointer',
                backgroundColor: selectedCategory === cat ? '#007bff' : (isDarkMode ? '#333' : '#f0f0f0'),
                color: selectedCategory === cat ? 'white' : (isDarkMode ? '#fff' : '#000'),
                fontWeight: '700'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <input 
          type="text" placeholder="Search collection..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '15px 30px', width: '300px', borderRadius: '50px', border: isDarkMode ? '1px solid #444' : '1px solid #eee', background: isDarkMode ? '#222' : '#fff', color: 'inherit', outline: 'none' }}
        />
      </div>

      {/* GRID */}
      <motion.div layout style={{ display: 'flex', gap: '35px', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: '100px' }}>
        
        {/* NEW: A quick message if the database is empty or still loading */}
        {products.length === 0 && (
           <h3 style={{ color: isDarkMode ? '#aaa' : '#555' }}>Loading store inventory...</h3>
        )}

        <AnimatePresence>
          {filteredProducts.map((product) => {
            const isSaved = wishlist.find(item => item.id === product.id);
            return (
              <motion.div 
                key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="product-card" 
                style={{ 
                  padding: '12px', borderRadius: '35px', width: '280px', position: 'relative', 
                  background: isDarkMode ? '#1e1e1e' : '#fff', 
                  border: isDarkMode ? '1px solid #333' : '1px solid #f9f9f9',
                  color: 'inherit'
                }}
              >
                <button 
                  onClick={() => toggleWishlist(product)}
                  style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', zIndex: 5 }}
                >
                  {isSaved ? '💖' : '🤍'} 
                </button>
                
                {/* NEW: Fallback image just in case you add a product without a photo */}
                <img src={product.image || 'https://via.placeholder.com/300?text=No+Image'} alt={product.name} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '28px' }} />
                
                <div style={{ padding: '20px 10px' }}>
                  {/* NEW: Displays 'New Arrival' if we didn't give it a category in the database */}
                  <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category || 'New Arrival'}</p>
                  <h3 style={{ margin: '5px 0', fontSize: '1.2rem', fontWeight: '700' }}>{product.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <span style={{ fontWeight: '800', fontSize: '1.5rem' }}>${product.price}</span>
                    <button 
                      onClick={() => addToCart(product)} 
                      style={{ padding: '10px 20px', backgroundColor: isDarkMode ? '#fff' : '#000', color: isDarkMode ? '#000' : '#fff', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Home