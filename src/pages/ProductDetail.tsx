import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { products } from '../data/products';
import { addToCart } from '../store/cartSlice';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = products.find(p => p.id === Number(id));

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.size?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.color?.[0] || '');

  if (!product) {
    return (
      <div className="not-found">
        <h2 className="serif">Piece not found</h2>
        <Link to="/" className="hero-btn">Return to Collection</Link>
      </div>
    );
  }

  const images = Array.isArray(product.image) ? product.image : [product.image];
  const activeImage = images[activeImageIndex];

  const related = products
    .filter(p => (p.category === product.category || p.category === 'Unisex') && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail">
      <div className="detail-grid">
        <div className="detail-gallery">
          <div className="detail-img-main" style={{ position: 'relative' }}>
            <img src={activeImage} alt={product.name} />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-nav-btn prev"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="gallery-nav-btn next"
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="detail-img-thumbs">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`detail-img-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <div className="detail-header">
            <span className="product-category">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="detail-price">Rs.{product.price.toFixed(2)}</p>
          </div>
          {product.size && product.size.length > 0 && (
            <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="size-selector-label">SELECT SIZE</span>
              <div className="size-selector-options">
                {product.size.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`size-selector-btn ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.color && product.color.length > 0 && (
            <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="color-selector-label">SELECT COLOR</span>
              <div className="color-selector-options">
                {product.color.map((clr) => (
                  <button
                    key={clr}
                    type="button"
                    className={`color-selector-btn ${selectedColor === clr ? 'active' : ''}`}
                    style={{ backgroundColor: clr.toLowerCase() }}
                    onClick={() => setSelectedColor(clr)}
                    aria-label={clr}
                  >

                  </button>
                ))}
              </div>
            </div>
          )}


          <p className="detail-desc">{product.description}</p>

          <button
            className="add-to-cart-large"
            onClick={() => dispatch(addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: images[0],
              size: selectedSize,
              color: selectedColor
            }))}
          >
            Add to Bag
          </button>

          <div className="detail-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Fabric</span>
              <span className="metadata-value">Premium Cotton Blend</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Fit</span>
              <span className="metadata-value">Relaxed / Contemporary</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Care</span>
              <span className="metadata-value">Machine Wash Cold</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <Link to="/" className="back-link" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>← Back to Collection</Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="related-section" style={{ marginTop: '8rem' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '3rem' }}>
            <p>Complete the Look</p>
            <h2 style={{ fontSize: '2.5rem' }}>Related Pieces</h2>
          </div>
          <div className="product-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
