import { useState } from 'react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-img-container">
          <img src="/hero.png" alt="STYLEDORA Collection" />
        </div>
        <div className="hero-content">
          <p className="hero-sub">The New Standard</p>
          <h1 className="hero-title">Timeless Essentials</h1>
          <a href="#shop" className="hero-btn">Discover Collection</a>
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="shop-section">
        <div className="section-header">
          <p>Explore</p>
          <h2>Our Collection</h2>
        </div>

        <div className="shop-controls">
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            className="search-input"
            type="text"
            placeholder="Search our pieces..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="no-results">We couldn't find any pieces matching your selection.</p>
        ) : (
          <div className="product-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
