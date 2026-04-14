import { Link } from 'react-router-dom' 

function Cart({ cart, removeFromCart }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Shopping Cart 🛒</h2>
      
      {cart.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index} style={{ borderBottom: '1px solid lightgray', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {/* Displaying a small version of the real image in the cart */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                <h3>{item.name}</h3>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h3 style={{ margin: 0 }}>${item.price}</h3>
                <button 
                  onClick={() => removeFromCart(index)} 
                  style={{ padding: '8px 12px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Remove
                </button>
              </div>

            </div>
          ))}
          
          <h2 style={{ marginTop: '30px', textAlign: 'right' }}>Total: ${totalPrice}</h2>
          
          <div style={{ textAlign: 'right' }}>
            <Link to="/checkout">
              <button style={{ padding: '15px 30px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', marginTop: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
          
        </div>
      )}
    </div>
  )
}

export default Cart