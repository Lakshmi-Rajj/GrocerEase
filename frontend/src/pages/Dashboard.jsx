import { useEffect, useState } from 'react';
import axios from 'axios';

const StatCard = ({ label, value, color, icon, sub }) => (
  <div style={{
    background: '#13151f', border: '1px solid #1e2130',
    borderRadius: '16px', padding: '24px',
    borderTop: `3px solid ${color}`,
    display: 'flex', flexDirection: 'column', gap: '8px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{label}</span>
      <span style={{ fontSize: '22px' }}>{icon}</span>
    </div>
    <div style={{ fontSize: '32px', fontWeight: '700', color }}>{value}</div>
    {sub && <div style={{ fontSize: '12px', color: '#475569' }}>{sub}</div>}
  </div>
);

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get('https://grocerease-hoo0.onrender.com/api/products').then(r => setProducts(r.data));
    axios.get('https://grocerease-hoo0.onrender.com/api/sales').then(r => setSales(r.data));
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const lowStock = products.filter(p => p.quantity < 5);
  const todaySales = sales.filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString());

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9' }}>Dashboard</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Products" value={products.length} color="#818cf8" icon="📦" sub="In inventory" />
        <StatCard label="Total Sales" value={sales.length} color="#34d399" icon="🧾" sub="All time" />
        <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="#f59e0b" icon="💰" sub="Total earned" />
        <StatCard label="Low Stock" value={lowStock.length} color="#f87171" icon="⚠️" sub="Need restock" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Low Stock Alert */}
        <div style={{ background: '#13151f', border: '1px solid #1e2130', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9' }}>Low Stock Alert</h3>
            {lowStock.length > 0 && (
              <span style={{ marginLeft: 'auto', background: 'rgba(248,113,113,0.15)', color: '#f87171', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                {lowStock.length} items
              </span>
            )}
          </div>
          {lowStock.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#34d399' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <div style={{ fontSize: '14px' }}>All items well stocked!</div>
            </div>
          ) : lowStock.map(p => (
            <div key={p._id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', background: 'rgba(248,113,113,0.05)',
              border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', marginBottom: '8px'
            }}>
              <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{p.name}</span>
              <span style={{ color: '#f87171', fontWeight: '700', fontSize: '14px' }}>{p.quantity} left</span>
            </div>
          ))}
        </div>

        {/* Recent Sales */}
        <div style={{ background: '#13151f', border: '1px solid #1e2130', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '18px' }}>🕐</span>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9' }}>Recent Sales</h3>
          </div>
          {sales.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '14px' }}>No sales yet</div>
          ) : sales.slice(0, 5).map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #1e2130'
            }}>
              <div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  {new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString()}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{s.items?.length} item(s)</div>
              </div>
              <span style={{ color: '#34d399', fontWeight: '700', fontSize: '16px' }}>₹{s.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}