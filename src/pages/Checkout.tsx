import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { createOrder, updateOrderStatus } from '../lib/firestore/orders';

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayCheckoutResponse {
  razorpay_payment_id: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  handler: (response: RazorpayCheckoutResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
  notes: {
    orderId: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

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
  const shipping = subtotal < 500 ? 70 : 0;
  const total = subtotal + shipping;

  const handlePayment = async () => {
    console.log('handlePayment triggered');
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
        shippingFee: shipping,
        total: total,
        shippingAddress: { email, fullName, address, city, country },
        status: 'created',
        createdAt: Date.now(),
      });

      if (!window.Razorpay) {
        alert(`Order #${orderId} was saved, but Razorpay failed to load. Please contact support to complete payment.`);
        setIsLoading(false);
        navigate('/account');
        return;
      }

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'STYLEDORA',
        description: 'Order Payment',
        image: '/favicon.png',
        handler: async (response) => {
          console.log('Razorpay payment successful, response:', response);
          try {
            await updateOrderStatus(orderId, {
              status: 'paid',
              paymentId: response.razorpay_payment_id,
            });

            console.log('Order marked paid successfully, ID:', orderId);
            dispatch(clearCart());
            alert(`Payment Successful! Order #${orderId} placed.`);
            navigate('/account');
          } catch (err) {
            console.error('CRITICAL: Order creation failed after payment:', err);
            alert('Payment was successful but order creation failed. Please contact support with your Payment ID: ' + response.razorpay_payment_id);
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: fullName,
          email: email,
        },
        notes: {
          orderId,
        },
        theme: {
          color: '#1a1a1a',
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal dismissed');
            alert(`Order #${orderId} was saved. You can retry payment from support.`);
            setIsLoading(false);
          }
        }
      };

      console.log('Opening Razorpay modal for saved order:', orderId);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Failed to initialize Razorpay:', err);
      alert('Failed to initialize payment. Please try again.');
      setIsLoading(false);
    }
  };

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              <button
                className="checkout-pay-btn"
                disabled={isLoading}
                onClick={handlePayment}
              >
                {isLoading ? 'Processing...' : 'Pay Now'}
              </button>

              
            </div>
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
                  <p className="checkout-item-price">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout-total-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `Rs.${shipping.toFixed(2)}`}</span>
            </div>
            <div className="checkout-total-row grand-total">
              <span>Total</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
