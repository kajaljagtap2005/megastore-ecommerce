import { Link } from 'react-router-dom'

function Navbar({ cartCount, wishlistCount, isDarkMode, toggleDarkMode, user, handleLogout }) {
  const navBg = isDarkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.8)';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const borderColor = isDarkMode ? '#333333' : '#eeeeee';

  return (
    <nav style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '15px 5%', position: 'sticky', top: 0, zIndex: 1000,
      backgroundColor: navBg, borderBottom: `1px solid ${borderColor}`,
      backdropFilter: 'blur(10px)', color: textColor
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-1px', margin: 0 }}>
        MEGA<span style={{color: '#007bff'}}>STORE</span>
      </h2>
      
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: '600' }}>Home</Link>
        
        <Link to="/wishlist" style={{ textDecoration: 'none', color: 'inherit', position: 'relative' }}>
          <span style={{ fontSize: '1.2rem' }}>💖</span>
          {wishlistCount > 0 && <span style={badgeStyle}>{wishlistCount}</span>}
        </Link>

        <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit', position: 'relative' }}>
          <span style={{ fontSize: '1.2rem' }}>🛒</span>
          {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
        </Link>
        
        <button onClick={toggleDarkMode} style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: '1.2rem', color: 'inherit' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {user ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontWeight: '700' }}>{user.name}</span>
            <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer' }}>Logout</button>
          </div>
        ) : (
          <Link to="/login">
            <button style={{ padding: '10px 20px', backgroundColor: isDarkMode ? '#fff' : '#000', color: isDarkMode ? '#000' : '#fff', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
          </Link>
        )}
      </div>
    </nav>
  )
}

const badgeStyle = {
  position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#ff4d4d', color: 'white',
  fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold'
};

export default Navbar