'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './newordernow.module.css';

import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment, FaShoppingCart, FaMobile, FaTag,FaTrash, FaCalendarAlt, FaDollarSign, FaUpload, FaMobileAlt, FaEye, FaLock, FaShare, FaArrowRight, FaPlane, FaUndo, FaMapMarkerAlt, FaEnvelope, FaInstagram, FaTiktok, FaPinterest } from 'react-icons/fa';

interface CartItem {
  id: number;
  name?: string;
  image: string;
  price: number | string;
  type: string;
  modell: string;
  quantity: number;
}

const getCart = () => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

const setCart = (cart: any[]) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export default function CheckoutPage() {
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    country: '',
  });
  const router = useRouter();

  useEffect(() => {
    // Only allow items with required fields
    const rawCart = getCart();
    const cleanedCart = rawCart.filter((item: any) =>
      item && typeof item.id !== 'undefined' && item.image && item.price && item.type && item.quantity
    );
    if (cleanedCart.length !== rawCart.length) {
      setCart(cleanedCart);
    }
    setCartState(cleanedCart);
  }, []);

  const updateQuantity = (id: number, quantity: number) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartState(newCart);
    setCart(newCart);
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCartState(newCart);
    setCart(newCart);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validCart = cart.filter((item: any) =>
    item && typeof item.id !== 'undefined' && item.image && item.price && item.type && item.quantity
  );
  const total = validCart.reduce((sum: number, item: any) => sum + Number(item.price) * item.quantity, 0);

  const handleSubmit = async () => {
    setError(null);
    if (!form.first_name || !form.last_name || !form.email || !form.phone_number || !form.address || !form.city || !form.country) {
      setError('Please fill in all required fields.');
      return;
    }
    if (validCart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    try {
      // Send the flat cart format to the backend as items
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout_order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          items: validCart.map((item: any) => ({
            id: item.id,
            image: item.image,
            price: Number(item.price),
            type: item.type,
            modell: item.modell,
            quantity: item.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to place order.');
        setLoading(false);
        return;
      }
      // Save last order to localStorage
      let orderData;
      try {
        orderData = await res.json();
      } catch {
        orderData = null;
      }
      
      // Handle order data differently for logged-in vs anonymous users
      if (token) {
        // Logged-in user: order is saved in backend, trigger refresh
        const lastOrder = {
          ...(orderData?.order || orderData || {}),
          ...form,
          items: validCart,
          created_at: (orderData?.order?.created_at || orderData?.created_at) || new Date().toISOString(),
          status: (orderData?.order?.status || orderData?.status) || 'pending',
        };
        localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
        
        // Dispatch a custom event to notify the layout to refresh order history
        window.dispatchEvent(new CustomEvent('orderPlaced', { detail: { isLoggedIn: true } }));
      } else {
        // Anonymous user: save to localStorage
        const lastOrder = {
          ...(orderData?.order || orderData || {}),
          ...form,
          items: validCart,
          created_at: (orderData?.order?.created_at || orderData?.created_at) || new Date().toISOString(),
          status: (orderData?.order?.status || orderData?.status) || 'pending',
        };
        localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
        // Save to orderHistory array for anonymous users
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        orderHistory.push(lastOrder);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      }
      
      setSuccess(true);
      setCart([]);
      setCartState([]);
      setLoading(false);
      setTimeout(() => router.push('/newexplore'), 2000);
    } catch (e) {
      setError('An error occurred.');
      setLoading(false);
    }
  };

  console.log(cart)

  if (success) return <div className={styles.successMessage}>Order placed! Redirecting...</div>;

  return (
    <div className={styles.checkoutContainer}>
      <h2 className={styles.checkoutTitle}>Checkout</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {validCart.length === 0 ? (
        <div className={styles.emptyCartMessage}>Your cart is empty.</div>
      ) : (
        <div className={styles.checkoutLayout}>
          {/* Left Side - Cart Items */}
          <div className={styles.leftSide}>
            <h3 className={styles.sectionTitle}>Your Items</h3>
            <div className={styles.cartList}>
              {validCart.map((item) => (
                <div key={item.id} className={styles.cartCard}>
                  <div className={styles.cartCardImage}>
                    <img src={item.image} alt={item.name || 'Product'} />
                    <span
                      className={styles.cartCardBadge}
                      data-type={item.type === 'customed clear case' ? 'clear' : 'rubber'}
                    >
                      {item.type === 'customed clear case' ? 'clear' : 'rubber'}
                    </span>
                  </div>
                  <div className={styles.cartCardDetails}>
                    <div className={styles.cartCardTitleRow}>
                      <div className={styles.cartCardModel}>{item.modell}</div>
                    </div>
                    <div className={styles.cartCardMetaRow}>
                      <div className={styles.cartCardType}>{item.type}</div>
                      <div className={styles.cartCardPrice}>${Number(item.price).toFixed(2)}</div>
                    </div>
                    <div className={styles.cartCardActions}>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => updateQuantity(item.id, Math.min(9, item.quantity + 1))}
                          disabled={item.quantity >= 9}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeItem(item.id)}
                        title="Remove"
                      >
                       <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Checkout Form */}
          <div className={styles.rightSide}>
            <h3 className={styles.sectionTitle}>Shipping Information</h3>
            <form className={styles.checkoutForm} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>First Name</label>
                  <input className={styles.formInput} name="first_name" value={form.first_name} onChange={handleInput} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Last Name</label>
                  <input className={styles.formInput} name="last_name" value={form.last_name} onChange={handleInput} required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input className={styles.formInput} name="email" type="email" value={form.email} onChange={handleInput} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input className={styles.formInput} name="phone_number" value={form.phone_number} onChange={handleInput} required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Address</label>
                  <input className={styles.formInput} name="address" value={form.address} onChange={handleInput} required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>City</label>
                  <input className={styles.formInput} name="city" value={form.city} onChange={handleInput} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Country</label>
                  <input className={styles.formInput} name="country" value={form.country} onChange={handleInput} required />
                </div>
              </div>
              <div className={styles.checkoutSummary}>
                <div className={styles.summaryTotal}>Total: ${total.toFixed(2)}</div>
                <button type="submit" className={styles.checkoutButton} disabled={loading}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
