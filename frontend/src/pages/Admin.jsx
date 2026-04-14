import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function Admin() {
  const [dbStats, setDbStats] = useState({ products: 0, orders: 0, revenue: 0 })
  const [usersList, setUsersList] = useState([])
  const [ordersList, setOrdersList] = useState([])

  const fetchData = async () => {
    try {
      const statsRes = await fetch('http://localhost:5000/api/admin/stats');
      setDbStats(await statsRes.json());
      const usersRes = await fetch('http://localhost:5000/api/users');
      setUsersList(await usersRes.json());
      const ordersRes = await fetch('http://localhost:5000/api/orders');
      setOrdersList(await ordersRes.json());
    } catch (error) { console.log("Load failed", error); }
  }

  useEffect(() => { fetchData(); }, [])

  const thStyle = { background: '#f5f5f5', color: '#333', padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' }
  const tdStyle = { padding: '15px', borderBottom: '1px solid #eee' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Owner Dashboard 📈</h2>
      
      {/* REVENUE STATS */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, padding: '25px', borderRadius: '15px', background: '#e3f2fd', textAlign: 'center' }}>
          <h3 style={{ color: '#0d47a1', margin: 0 }}>Total Revenue</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>${dbStats.revenue.toFixed(2)}</p>
        </div>
        <div style={{ flex: 1, padding: '25px', borderRadius: '15px', background: '#f1f8e9', textAlign: 'center' }}>
          <h3 style={{ color: '#1b5e20', margin: 0 }}>Orders</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>{dbStats.orders}</p>
        </div>
      </div>

      {/* ORDERS DATA TABLE WITH ADDRESS */}
      <div style={{ marginTop: '50px' }}>
        <h3>📦 Order Details & Addresses</h3>
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #ddd' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Home Address</th>
                <th style={thStyle}>Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.map(order => (
                <tr key={order.id}>
                  <td style={tdStyle}>#{order.id}</td>
                  <td style={tdStyle}><strong>{order.customerName}</strong></td>
                  <td style={tdStyle}>{order.phone}</td>
                  <td style={{...tdStyle, maxWidth: '250px', fontSize: '0.9rem'}}>{order.address}</td>
                  <td style={tdStyle}><strong>${order.totalAmount.toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* CUSTOMER LIST */}
      <div style={{ marginTop: '50px' }}>
        <h3>👥 Registered Users</h3>
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #ddd' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

export default Admin;