import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

function Login({ setUser }) {
  const [view, setView] = useState('login') 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  // 1. REAL SIGNUP: Sends data to database!
  const handleCustomerSignup = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await response.json()

      if (response.ok) {
        setUser(data.user) // Set the global user state
        alert(`🎉 Account created for ${data.user.name}!`)
        navigate('/')
      } else {
        alert(`❌ ${data.error}`) // Shows "Email already in use", etc.
      }
    } catch (error) {
      alert("Database connection failed.")
    }
  }

  // 2. REAL LOGIN: Checks database for a match!
  const handleCustomerLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        alert(`🛍️ Welcome back, ${data.user.name}!`)
        navigate('/')
      } else {
        alert(`❌ ${data.error}`) // Shows "Invalid password"
      }
    } catch (error) {
      alert("Database connection failed.")
    }
  }

  // 3. ADMIN LOGIN (We keep this hardcoded as a master key for you!)
  const handleAdminLogin = (e) => {
    e.preventDefault()
    if (email === 'admin@megastore.com' && password === 'admin123') {
      setUser({ name: 'Store Owner', role: 'admin' }) 
      alert('🔓 Welcome back, Boss!')
      navigate('/admin') 
    } else {
      alert('❌ Access Denied.')
    }
  }

  // --- UI Elements ---
  const GoogleButton = () => (
    <button type="button" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', color: '#333', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', marginBottom: '15px' }}>
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      Continue with Google
    </button>
  )

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fff', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '420px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
        
        {/* Toggle Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#f5f5f5', padding: '5px', borderRadius: '12px' }}>
          <button onClick={() => setView('login')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', background: view === 'login' ? '#fff' : 'transparent', color: view === 'login' ? '#000' : '#888', boxShadow: view === 'login' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none' }}>Sign In</button>
          <button onClick={() => setView('signup')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', background: view === 'signup' ? '#fff' : 'transparent', color: view === 'signup' ? '#000' : '#888', boxShadow: view === 'signup' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none' }}>Sign Up</button>
        </div>

        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleCustomerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Welcome back.</h2>
              <GoogleButton />
              <input type="email" placeholder="Email Address" required onChange={(e) => setEmail(e.target.value)} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }} />
              <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }} />
              <button type="submit" style={{ padding: '15px', borderRadius: '10px', border: 'none', background: '#007bff', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Sign In</button>
              <p style={{ textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: '#888', textDecoration: 'underline' }} onClick={() => setView('admin')}>Are you the store owner?</p>
            </motion.form>
          )}

          {view === 'signup' && (
            <motion.form key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleCustomerSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Create an account.</h2>
              <GoogleButton />
              <input type="text" placeholder="Full Name" required onChange={(e) => setName(e.target.value)} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }} />
              <input type="email" placeholder="Email Address" required onChange={(e) => setEmail(e.target.value)} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }} />
              <input type="password" placeholder="Create Password" required onChange={(e) => setPassword(e.target.value)} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }} />
              <button type="submit" style={{ padding: '15px', borderRadius: '10px', border: 'none', background: '#000', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Create Account</button>
            </motion.form>
          )}

          {view === 'admin' && (
            <motion.form key="admin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h2 style={{ margin: '0 0 5px 0', color: '#d32f2f' }}>Admin Portal</h2>
              <p style={{ color: '#888', margin: '0 0 15px 0', fontSize: '0.9rem' }}>Authorized personnel only.</p>
              <input type="email" placeholder="Admin Email" required onChange={(e) => setEmail(e.target.value)} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ffcdd2', background: '#fff5f5', fontSize: '1rem', outline: 'none' }} />
              <input type="password" placeholder="Admin Password" required onChange={(e) => setPassword(e.target.value)} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ffcdd2', background: '#fff5f5', fontSize: '1rem', outline: 'none' }} />
              <button type="submit" style={{ padding: '15px', borderRadius: '10px', border: 'none', background: '#d32f2f', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Access Dashboard</button>
              <p style={{ textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: '#007bff' }} onClick={() => setView('login')}>← Back to Customer Login</p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Login