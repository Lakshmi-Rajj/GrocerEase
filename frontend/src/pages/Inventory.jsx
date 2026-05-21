import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'https://grocerease-hoo0.onrender.com/api/products';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const load = () => axios.get(API).then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

const submit = async () => {
  if (!form.name || !form.price || !form.quantity) {
    return toast.error('Fill all required fields');
  }

  try {
    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      toast.success('Product updated');
      setEditingId(null);
    } else {
      await axios.post(API, form);
      toast.success('Product added');
    }

    setForm({
      name: '',
      price: '',
      quantity: '',
      category: ''
    });

    load();

  } catch (err) {
    console.log(err);
    toast.error('Something went wrong');
  }
};

const editProduct = (product) => {
  setForm({
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    category: product.category || ''
  });

  setEditingId(product._id);
};

const del = async (id) => {
  if (!window.confirm('Delete this product?')) return;

  try {
    await axios.delete(`${API}/${id}`);
    toast.success('Product deleted');
    load();
  } catch (err) {
    console.log(err);
    toast.error('Delete failed');
  }
};

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    background: '#1a1d27', border: '1px solid #2d3148', borderRadius: '10px',
    padding: '10px 14px', color: '#e2e8f0', fontSize: '14px', outline: 'none', width: '100%'
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9' }}>📦 Inventory</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Manage your product catalog and stock levels.</p>
      </div>

      {/* Add Product */}
      <div style={{ background: '#13151f', border: '1px solid #1e2130', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Add New Product
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
          {[
            { key: 'name', placeholder: 'Product name *' },
            { key: 'price', placeholder: 'Price (₹) *' },
            { key: 'quantity', placeholder: 'Stock qty *' },
            { key: 'category', placeholder: 'Category' },
          ].map(({ key, placeholder }) => (
            <input key={key} style={inputStyle} placeholder={placeholder}
              value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          ))}
          <button onClick={submit} style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', border: 'none', borderRadius: '10px',
            padding: '10px 20px', fontWeight: '600', cursor: 'pointer',
            fontSize: '14px', whiteSpace: 'nowrap'
          }}> {editingId ? 'Update' : '+ Add'}</button>
        </div>
      </div>

      {/* Search & Table */}
      <div style={{ background: '#13151f', border: '1px solid #1e2130', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>{filtered.length} products</div>
          <input style={{ ...inputStyle, width: '220px' }} placeholder="🔍  Search products..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e2130' }}>
              {['Product Name', 'Category', 'Price', 'Stock', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #1a1d27' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a1d27'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '14px', color: '#f1f5f9', fontWeight: '500' }}>{p.name}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    {p.category || 'General'}
                  </span>
                </td>
                <td style={{ padding: '14px', color: '#f59e0b', fontWeight: '600' }}>₹{p.price}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{
                    background: p.quantity < 5 ? 'rgba(248,113,113,0.15)' : 'rgba(52,211,153,0.15)',
                    color: p.quantity < 5 ? '#f87171' : '#34d399',
                    padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700'
                  }}>{p.quantity}</span>
                </td>
                <td style={{ padding: '14px', display: 'flex', gap: '10px' }}>
  <button
    onClick={() => editProduct(p)}
    style={{
      background: 'rgba(99,102,241,0.1)',
      color: '#818cf8',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: '8px',
      padding: '6px 14px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500'
    }}
  >
    Edit
  </button>

  <button
    onClick={() => del(p._id)}
    style={{
      background: 'rgba(248,113,113,0.1)',
      color: '#f87171',
      border: '1px solid rgba(248,113,113,0.2)',
      borderRadius: '8px',
      padding: '6px 14px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500'
    }}
  >
    Delete
  </button>
</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}