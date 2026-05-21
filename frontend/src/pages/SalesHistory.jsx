import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/sales';

export default function SalesHistory() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    const res = await axios.get(API);
    setSales(res.data.reverse());
  };

  return (
    <div style={{
      padding: '24px',
      color: 'white',
      background: '#0f172a',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '28px',
        marginBottom: '24px',
        fontWeight: 'bold'
      }}>
        Sales History
      </h1>

      {sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        sales.map((sale, index) => (
          <div
            key={index}
            style={{
              background: '#1e293b',
              padding: '20px',
              borderRadius: '14px',
              marginBottom: '20px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}>
              <h3>Receipt #{index + 1}</h3>

              <span style={{ color: '#94a3b8' }}>
                {new Date(sale.createdAt).toLocaleString()}
              </span>
            </div>

            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ color: '#94a3b8' }}>
                  <th align="left">Item</th>
                  <th align="left">Qty</th>
                  <th align="left">Price</th>
                </tr>
              </thead>

              <tbody>
                {sale.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ padding: '8px 0' }}>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{
              marginTop: '16px',
              textAlign: 'right',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              Total: ₹{sale.total}
            </div>
          </div>
        ))
      )}
    </div>
  );
}