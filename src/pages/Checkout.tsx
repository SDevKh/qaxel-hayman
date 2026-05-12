import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { createOrder } from '../lib/firestore/orders';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const { user, isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isInitialized, isAuthenticated, navigate]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2 className="serif">Your bag is empty</h2>
        <Link to="/" className="checkout-link">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left Column: Form */}
        <section className="checkout-form-section">
          <div className="checkout-header">
            <h1 className="serif">Checkout</h1>
            <p className="checkout-subtitle">SHIPPING DETAILS AND ORDER SUMMARY.</p>
          </div>

          <div className="checkout-form-group">
            <h3 className="serif">Contact & Shipping</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <div className="auth-field">
                <label className="auth-label">EMAIL</label>
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">FULL NAME</label>
                <input
                  type="text"
                  className="auth-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field" style={{ marginTop: '1.5rem' }}>
              <label className="auth-label">ADDRESS</label>
              <input
                type="text"
                className="auth-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, apartment, etc."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <div className="auth-field">
                <label className="auth-label">CITY</label>
                <input
                  type="text"
                  className="auth-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">COUNTRY</label>
                <input
                  type="text"
                  className="auth-input"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="checkout-form-actions">
            <Link to="/shipping" className="checkout-link">Shipping & Returns</Link>

            <button
              className="checkout-pay-btn"
              disabled={isLoading}
              onClick={async () => {
                if (!email || !fullName || !address || !city || !country) {
                  alert('Please fill in all shipping details.');
                  return;
                }

                setIsLoading(true);
                try {
                  const orderId = await createOrder({
                    userEmail: email,
                    userFullName: fullName,
                    items: items,
                    subtotal: subtotal,
                    shippingAddress: { email, fullName, address, city, country },
                    status: 'paid',
                    createdAt: Date.now(),
                  });

                  dispatch(clearCart());
                  alert(`Order #${orderId} placed successfully!`);
                  navigate('/account');
                } catch (err: any) {
                  console.error('Order creation failed:', err);
                  alert('Failed to place order. Check your console for details.');
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </section>

        {/* Right Column: Summary */}
        <section className="checkout-summary-section">
          <h3 className="serif">Order Summary</h3>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={item.id} className="checkout-item">
                <img src={item.image} alt={item.name} className="checkout-item-img" />
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.name}</p>
                  <p className="checkout-item-qty">QTY: {item.quantity}</p>
                  <p className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout-total-row">
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <div className="checkout-total-row grand-total">
              <span>Total</span>
              <span>${subtotal.toFixed(2)} USD</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
