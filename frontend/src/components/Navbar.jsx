import React from 'react';

function Navbar({ setView, cartCount, likeCount, toggleDarkMode, isDarkMode, currentUser, handleLogout }) {
  const navStyle = {
    background: isDarkMode ? '#111' : '#fff',
    color: isDarkMode ? '#fff' : '#333',
    padding: '20px 50px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderBottom: isDarkMode ? '1px solid #333' : 'none'
  };

  const btnStyle = { background: 'transparent', color: 'inherit', border: 'none', fontSize: '16px', cursor: 'pointer', marginLeft: '20px', fontWeight: '500' };

  return (
    <nav style={navStyle}>
      <h1 style={{ margin: 0, cursor: 'pointer', fontSize: '28px', letterSpacing: '2px' }} onClick={() => setView('home')}>
        <span style={{color: '#e94560'}}>MEGA</span>STORE
      </h1>
      <div>
        <button onClick={toggleDarkMode} style={btnStyle}>
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button onClick={() => setView('home')} style={btnStyle}>Shop</button>
        <button style={btnStyle}>❤️ Likes ({likeCount})</button>
        <button onClick={() => setView('cart')} style={btnStyle}>🛒 Cart ({cartCount})</button>
        
        {currentUser ? (
          <>
            {currentUser.role === 'admin' && <button onClick={() => setView('admin')} style={{...btnStyle, color: '#e94560'}}>Admin</button>}
            <button onClick={handleLogout} style={btnStyle}>Logout ({currentUser.name})</button>
          </>
        ) : (
          <button onClick={() => setView('login')} style={btnStyle}>Login / Sign Up</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;