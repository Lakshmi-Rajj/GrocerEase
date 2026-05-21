import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Dashboard from './pages/Dashboard';
import SalesHistory from './pages/SalesHistory';

const navItems = [
  { to: '/', icon: '▦', label: 'Dashboard' },
  { to: '/inventory', icon: '⊞', label: 'Inventory' },
  { to: '/billing', icon: '▤', label: 'Billing' },
  { to: '/sales', icon: '▧', label: 'Sales History' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Sidebar */}
        <aside style={{
          width: '240px', background: '#13151f',
          borderRight: '1px solid #1e2130',
          padding: '28px 16px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          position: 'fixed', height: '100vh', top: 0, left: 0
        }}>
          {/* Logo */}
          <div style={{ padding: '0 12px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px'
              }}>🛒</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#f1f5f9' }}>GrocerEase</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Supermarket System</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#475569', fontWeight: '600', padding: '0 12px', marginBottom: '4px', letterSpacing: '0.08em' }}>
            MAIN MENU
          </div>

          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px',
              textDecoration: 'none', fontSize: '14px', fontWeight: '500',
              transition: 'all 0.15s',
              background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: isActive ? '#818cf8' : '#94a3b8',
              border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
            })}>
              <span style={{ fontSize: '16px' }}>{icon}</span>
              {label}
            </NavLink>
          ))}

          <div style={{ marginTop: 'auto', padding: '12px', background: '#1a1d27', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>System Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
              <span style={{ fontSize: '13px', color: '#86efac' }}>All systems online</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ marginLeft: '240px', flex: 1, padding: '32px', minHeight: '100vh', background: '#0f1117' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/sales" element={<SalesHistory />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}