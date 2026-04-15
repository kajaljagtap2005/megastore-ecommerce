import { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  // 1. Define 'products' as an empty list to prevent crashes
  const [products, setProducts] = useState([]);

  // 2. Fetch the live data from your Render engine
  useEffect(() => {
    fetch('https://megastore-ecommerce.onrender.com/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  // 3. Draw the website using the responsive mobile CSS
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Welcome to Megastore</h1>
      
      <div className="product-container">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;