function Wishlist({ wishlist, toggleWishlist, addToCart }) {
  return (
    <div style={{ padding: '20px' }}>
      <h2>My Wishlist 💖</h2>
      
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty. Go save some items!</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {wishlist.map((product) => (
            <div key={product.id} style={{ border: '1px solid gray', padding: '15px', borderRadius: '8px', textAlign: 'center', width: '220px' }}>
              
              {/* Added the real image to the wishlist cards */}
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }} 
              />
              
              <h3 style={{ margin: '10px 0' }}>{product.name}</h3>
              <p style={{ fontWeight: 'bold', fontSize: '18px' }}>${product.price}</p>
              
              <button 
                onClick={() => addToCart(product)} 
                style={{ padding: '10px', width: '100%', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '10px', fontWeight: 'bold' }}
              >
                Move to Cart
              </button>

              <button 
                onClick={() => toggleWishlist(product)} 
                style={{ padding: '10px', width: '100%', cursor: 'pointer', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist