import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import type { RootState } from './store/store';
import { login, logout, setInitialized } from './store/authSlice';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Shipping from './pages/Shipping';
import Terms from './pages/Terms';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import { Analytics } from "@vercel/analytics/react"

function AppLayout() {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state: RootState) => state.auth);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(login({
          email: user.email!,
          fullName: user.displayName || 'User'
        }));
      } else {
        dispatch(logout());
      }
      dispatch(setInitialized());
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="serif" style={{ fontSize: '1.5rem', letterSpacing: '0.2em' }}>STYLEDORA</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <span className="footer-logo">STYLEDORA</span>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8' }}>
              Crafting timeless essentials for the modern wardrobe. Quality, sustainability, and minimalist design at the core of everything we do.
            </p>
          </div>

          <div className="footer-section">
            <h4>Shop</h4>
            <div className="footer-nav footer-links">
              <Link to="/">All Collection</Link>
              <Link to="/about">Our Story</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <div className="footer-nav footer-links">
              <Link to="/shipping">Shipping & Returns</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <div className="footer-nav footer-links">
              <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Pinterest</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Journal</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© 2026 STYLEDORA — All Rights Reserved.</p>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Analytics />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <AppLayout />
      </BrowserRouter>
    </Provider>
  );
}
