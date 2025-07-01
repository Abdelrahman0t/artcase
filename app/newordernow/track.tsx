import { useState } from 'react';

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  type: string;
  quantity: number;
}

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  created_at: string;
  address: string;
  city: string;
  country: string;
  items: OrderItem[];
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order_lookup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Order not found.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch (e) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
      <h2>Track Your Order</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Order Number"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: 12, fontSize: 16, background: '#222', color: '#fff', border: 'none', borderRadius: 6 }} disabled={loading}>
          {loading ? 'Searching...' : 'Find Order'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {order && (
        <div style={{ background: '#f8f8f8', padding: 16, borderRadius: 6 }}>
          <h3>Order #{order.id}</h3>
          <p><b>Name:</b> {order.first_name} {order.last_name}</p>
          <p><b>Email:</b> {order.email}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Placed:</b> {new Date(order.created_at).toLocaleString()}</p>
          <p><b>Shipping:</b> {order.address}, {order.city}, {order.country}</p>
          <h4>Items:</h4>
          <ul>
            {order.items.map((item) => (
              <li key={item.id} style={{ marginBottom: 8 }}>
                <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginRight: 8, verticalAlign: 'middle' }} />
                <b>{item.name}</b> ({item.type}) x {item.quantity} - ${item.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 