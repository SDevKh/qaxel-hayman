import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { getUserOrders } from '../lib/firestore/orders';
import type { OrderDoc } from '../lib/firestore/types';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
  
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<(OrderDoc & { id: string })[]>([]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated && user?.email) {
      fetchOrders(user.email);
    }
  }, [isInitialized, isAuthenticated, user, navigate]);

  const fetchOrders = async (email: string) => {
    try {
      const userOrders = await getUserOrders(email);
      setOrders(userOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(logout());
      navigate('/login');
    }, 600);
  };

  if (!user) return null;

  return (
    <div className="auth-page">
      <div className="max-w-6xl w-full mx-auto px-6 py-16">
        <div className="auth-header" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem' }}>
          <div>
            <h1 className="auth-title serif" style={{ fontSize: '3.5rem' }}>My Account</h1>
            <p className="auth-subtitle">WELCOME BACK, {user.fullName?.toUpperCase() || 'USER'}</p>
          </div>
          <button 
            onClick={handleLogout} 
            disabled={isLoading}
            className="account-signout" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}
          >
            {isLoading ? 'SIGNING OUT...' : 'SIGN OUT'}
          </button>
        </div>

        <div className="account-grid">
          {/* Profile Info */}
          <section>
            <h3 className="serif account-section-title">Profile Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="auth-field">
                <label className="auth-label">FULL NAME</label>
                <p style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: 500 }}>{user.fullName || 'Guest User'}</p>
              </div>
              <div className="auth-field">
                <label className="auth-label">EMAIL ADDRESS</label>
                <p style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: 500 }}>{user.email}</p>
              </div>
              <button className="auth-submit" style={{ width: 'auto', padding: '0.8rem 2rem', fontSize: '0.7rem' }}>
                EDIT PROFILE
              </button>
            </div>
          </section>

          {/* Order History */}
          <section>
            <h3 className="serif account-section-title">Order History</h3>
            {orders.length === 0 ? (
              <div style={{ border: '1px solid var(--border)', padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', background: '#fafafa' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>You haven't placed any orders yet.</p>
                <Link to="/" className="auth-link" style={{ display: 'inline-block', marginTop: '1.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                  START SHOPPING
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <p className="order-id">ORDER #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className="order-total">Rs.{order.subtotal.toFixed(2)}</p>
                        <span className="order-status" style={{ 
                          color: order.status === 'paid' ? '#166534' : '#991b1b',
                          background: order.status === 'paid' ? '#f0fdf4' : '#fef2f2'
                        }}>{order.status}</span>
                      </div>
                    </div>
                    <div className="order-items-preview">
                      {order.items.map((item, idx) => (
                        <img key={idx} src={item.image} alt={item.name} className="order-item-thumb" title={item.name} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Account;