import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const API_P = 'https://grocerease-hoo0.onrender.com/api/products';
const API_S = 'https://grocerease-hoo0.onrender.com/api/sales';

export default function Billing() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [qty, setQty] = useState(1);
  const [lastBill, setLastBill] = useState(null);

  useEffect(() => { axios.get(API_P).then(r => setProducts(r.data)); }, []);

  const addToCart = () => {
    const product = products.find(p => p._id === selectedId);
    if (!product) return alert('Select a product first');
    if (product.quantity < qty) return alert('Not enough stock!');
    const existing = cart.find(c => c.product === product._id);
    if (existing) {
      setCart(cart.map(c => c.product === product._id ? { ...c, quantity: c.quantity + parseInt(qty) } : c));
    } else {
      setCart([...cart, { product: product._id, name: product.name, price: product.price, quantity: parseInt(qty) }]);
    }
    setSelectedId(''); setQty(1);
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const checkout = async () => {
    if (cart.length === 0) return alert('Cart is empty!');
    const sale = await axios.post(API_S, { items: cart, total });
    setLastBill({ ...sale.data, items: cart, total });
    setCart([]);
    axios.get(API_P).then(r => setProducts(r.data));
  };

  const printBill = () => {
    const w = window.open('', '_blank');
    w.document.write(`<html><body style="font-family:monospace;padding:30px;max-width:400px;margin:auto">
      <h2 style="text-align:center">🛒 GrocerEase</h2>
      <p style="text-align:center;color:#666">RECEIPT</p>
      <p style="text-align:center;font-size:12px">${new Date().toLocaleString()}</p>
      <hr style="border:1px dashed #ccc;margin:16px 0"/>
      ${lastBill.items.map(i => `
        <div style="display:flex;justify-content:space-between;margin:8px 0">
          <span>${i.name} x${i.quantity}</span>
          <span>₹${i.price * i.quantity}</span>
        </div>`).join('')}
      <hr style="border:1px dashed #ccc;margin:16px 0"/>
      <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:18px">
        <span>TOTAL</span><span>₹${lastBill.total}</span>
      </div>
      <p style="text-align:center;margin-top:24px;color:#666">Thank you for shopping! 🙏</p>
    </body></html>`);
    w.print();
  };

  const inputStyle = {
    background: '#1a1d27', border: '1px solid #2d3148', borderRadius: '10px',
    padding: '10px 14px', color: '#e2e8f0', fontSize: '14px', outline: 'none'
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9' }}>🧾 Billing</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Create bills and process customer checkouts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

        {/* Left Panel */}
        <div style={{ background: '#13151f', border: '1px solid #1e2130', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Add Items
          </h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}>
              <option value="">-- Select a product --</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name} — ₹{p.price} (Stock: {p.quantity})</option>
              ))}
            </select>
            <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)}
              style={{ ...inputStyle, width: '70px', textAlign: 'center' }} />
            <button onClick={addToCart} style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', border: 'none', borderRadius: '10px',
              padding: '10px 20px', fontWeight: '600', cursor: 'pointer', fontSize: '14px'
            }}>Add</button>
          </div>

          {/* Cart */}
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#475569', border: '2px dashed #1e2130', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛒</div>
              <div>Cart is empty — select a product above</div>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2130' }}>
                    {['Item', 'Qty', 'Price', 'Subtotal', ''].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1a1d27' }}>
                      <td style={{ padding: '12px', color: '#f1f5f9', fontWeight: '500' }}>{item.name}</td>
                      <td style={{ padding: '12px', color: '#94a3b8' }}>{item.quantity}</td>
                      <td style={{ padding: '12px', color: '#94a3b8' }}>₹{item.price}</td>
                      <td style={{ padding: '12px', color: '#f59e0b', fontWeight: '600' }}>₹{item.price * item.quantity}</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => setCart(cart.filter((_, j) => j !== i))}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '18px' }}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '20px', padding: '16px', background: '#1a1d27', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>Total Amount</div>
                  <div style={{ color: '#34d399', fontSize: '28px', fontWeight: '700' }}>₹{total.toFixed(2)}</div>
                </div>
                <button onClick={checkout} style={{
                  background: 'linear-gradient(135deg, #059669, #34d399)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  padding: '14px 28px', fontWeight: '700', cursor: 'pointer', fontSize: '16px'
                }}>✅ Checkout</button>
              </div>
            </>
          )}
        </div>

        {/* Right — Receipt */}
        <div style={{ background: '#13151f', border: '1px solid #1e2130', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Last Receipt
          </h3>
          {!lastBill ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#475569', fontSize: '14px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧾</div>
              Complete a checkout to see receipt
            </div>
          ) : (
            <>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                {new Date(lastBill.createdAt).toLocaleString()}
              </div>
              <div style={{ borderTop: '1px dashed #2d3148', paddingTop: '16px' }}>
                {lastBill.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                    <span style={{ color: '#94a3b8' }}>{item.name} <span style={{ color: '#64748b' }}>×{item.quantity}</span></span>
                    <span style={{ color: '#f1f5f9', fontWeight: '600' }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px dashed #2d3148', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontWeight: '600' }}>TOTAL</span>
                <span style={{ color: '#34d399', fontWeight: '700', fontSize: '20px' }}>₹{lastBill.total}</span>
              </div>
              <button onClick={printBill} style={{
                width: '100%', marginTop: '16px',
                background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px',
                padding: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '14px'
              }}>🖨️ Print Receipt</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}