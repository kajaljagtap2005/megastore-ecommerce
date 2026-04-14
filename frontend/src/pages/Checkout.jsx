import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function Checkout({ cart, finalizeSale }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Form Data State to hold the customer's typing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  // Calculate the total money amount of the cart
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  // Update form state when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. The Magic function that sends the Order to the Database
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty! Add some products first.");
      return;
    }

    setIsSubmitting(true);

    // Combine the address pieces into one long string for the database
    const fullShippingAddress = `${formData.address}, ${formData.city}, ${formData.zipCode}`;

    // Bundle the data exactly as our Order Blueprint in server.js expects it!
    const orderPayload = {
      customerName: formData.name,
      customerEmail: formData.email,
      phone: formData.phone,
      address: fullShippingAddress,
      totalAmount: totalAmount,
      items: cart // We send the whole cart array directly to the database!
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        alert("🎉 Order Placed Successfully! Your items are on the way.");
        
        // This tells App.jsx to empty the cart and add the money to your local stats
        finalizeSale(totalAmount); 
        
        // Send the user back to the home page
        navigate('/');
      } else {
        alert("❌ Something went wrong placing the order.");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("❌ Could not connect to the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}
    >
      
      {/* LEFT COLUMN: SHIPPING FORM */}
      <div style={{ flex: 2, minWidth: '300px' }}>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '30px' }}>Checkout Details</h2>
        
        <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Full Name</label>
              <input type="text" name="name" required onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email Address</label>
              <input type="email" name="email" required onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Phone Number</label>
            <input type="tel" name="phone" required onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Street Address</label>
            <input type="text" name="address" required onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>City</label>
              <input type="text" name="city" required onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Zip Code</label>
              <input type="text" name="zipCode" required onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div style={{ marginTop: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '10px', border: '1px solid #eee' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Payment Information</h3>
            <p style={{ color: '#888', margin: 0 }}>This is a test environment. No real card is required.</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || cart.length === 0}
            style={{ padding: '18px', background: cart.length === 0 ? '#ccc' : '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: cart.length === 0 ? 'not-allowed' : 'pointer', marginTop: '10px' }}
          >
            {isSubmitting ? 'Processing Order...' : `Pay $${totalAmount.toFixed(2)}`}
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: ORDER SUMMARY */}
      <div style={{ flex: 1, minWidth: '300px', background: '#fafafa', padding: '30px', borderRadius: '20px', border: '1px solid #eee', height: 'fit-content' }}>
        <h3 style={{ margin: '0 0 20px 0', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Order Summary</h3>
        
        {cart.length === 0 ? (
          <p style={{ color: '#888' }}>Your cart is empty.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {cart.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</p>
                    <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>Qty: 1</p>
                  </div>
                </div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ borderTop: '2px solid #ddd', marginTop: '20px', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '1.5rem', fontWeight: '900' }}>
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

    </motion.div>
  )
}

export default Checkout