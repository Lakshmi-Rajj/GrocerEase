import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://grocerease-hoo0.onrender.com/api';

const CATEGORY_ICONS = {
  fruits: '🍎', vegetables: '🥦', dairy: '🥛', bakery: '🍞',
  meat: '🥩', beverages: '🧃', snacks: '🍪', grains: '🌾',
  oil: '🫙', cleaning: '🧴', personal: '🧼', frozen: '🧊',
  general: '🛒', sweets: '🍮', spices: '🌶️' , chocolates : '🍫' 
};

const getCategoryIcon = (cat) => {
  if (!cat) return '🛒';
  const lower = cat.toLowerCase();
  for (const key of Object.keys(CATEGORY_ICONS)) {
    if (lower.includes(key)) return CATEGORY_ICONS[key];
  }
  return '🛒';
};

const getImageUrl = (name, category) => {
  const query = encodeURIComponent((name + ' ' + (category || 'grocery food')).toLowerCase());
  return `https://source.unsplash.com/300x200/?${query}`;
};

const CATEGORY_COLORS = [
  { bg: '#1a1f3a', border: '#3b4fd8', tag: '#818cf8' },
  { bg: '#1a2e1a', border: '#2d6a2d', tag: '#34d399' },
  { bg: '#2e1a1a', border: '#8b2020', tag: '#f87171' },
  { bg: '#2e2a1a', border: '#8b6820', tag: '#f59e0b' },
  { bg: '#1a2a2e', border: '#1a6b7a', tag: '#22d3ee' },
  { bg: '#2a1a2e', border: '#6b1a8b', tag: '#c084fc' },
];

const getCatColor = (cat) => {
  if (!cat) return CATEGORY_COLORS[0];
  let hash = 0;
  for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};

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

const ProductCard = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const color = getCatColor(product.category);
  const icon = getCategoryIcon(product.category);

  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      cursor: 'default'
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Image */}
      <div style={{ width: '100%', height: '150px', overflow: 'hidden', position: 'relative', background: '#0d0f1a' }}>
        {!imgError ? (
          <img
            src={getImageUrl(product.name, product.category)}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px' }}>
            {icon}
          </div>
        )}
        {/* Stock badge */}
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          background: product.quantity < 5 ? 'rgba(248,113,113,0.9)' : 'rgba(52,211,153,0.9)',
          color: 'white', fontSize: '11px', fontWeight: '700',
          padding: '3px 8px', borderRadius: '20px'
        }}>
          {product.quantity < 5 ? `Only ${product.quantity} left!` : `${product.quantity} in stock`}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.07)',
          color: color.tag,
          fontSize: '11px', fontWeight: '600',
          padding: '3px 10px', borderRadius: '20px',
          marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          {icon} {product.category || 'General'}
        </div>
        <div style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name}
        </div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: color.tag }}>
          ₹{product.price}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    axios.get(`${API}/products`).then(r => setProducts(r.data));
    axios.get(`${API}/sales`).then(r => setSales(r.data));
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const lowStock = products.filter(p => p.quantity < 5);

  const categories = ['All', ...new Set(products.map(p => p.category || 'General'))];

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'All' || (p.category || 'General') === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = {};
  filtered.forEach(p => {
    const cat = p.category || 'General';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9' }}>🛒 GrocerEase Store</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Live product catalog — all items in your supermarket</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Products" value={products.length} color="#818cf8" icon="" sub="In inventory" />
        <StatCard label="Total Sales" value={sales.length} color="#34d399" icon="" sub="All time" />
        <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="#f59e0b" icon="" sub="Total earned" />
        <StatCard label="Low Stock" value={lowStock.length} color="#f87171" icon="" sub="Need restock" />
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="🔍  Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: '200px', padding: '10px 16px',
            background: '#13151f', border: '1px solid #1e2130',
            borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none'
          }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
              padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
              border: '1px solid',
              cursor: 'pointer',
              background: selectedCategory === cat ? '#818cf8' : '#13151f',
              color: selectedCategory === cat ? 'white' : '#94a3b8',
              borderColor: selectedCategory === cat ? '#818cf8' : '#1e2130',
              transition: 'all 0.15s'
            }}>
              {getCategoryIcon(cat)} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products — grouped by category */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '16px' }}>
          No products found. Add products in Inventory first.
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '22px' }}>{getCategoryIcon(cat)}</span>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9' }}>{cat}</h2>
              <span style={{
                background: '#1e2130', color: '#64748b',
                fontSize: '12px', padding: '2px 10px', borderRadius: '20px'
              }}>{items.length} items</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              {items.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
