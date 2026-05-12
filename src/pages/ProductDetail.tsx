import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { products } from '../data/products';
import { addToCart } from '../store/cartSlice';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="not-found">
        <h2 className="serif">Piece not found</h2>
        <Link to="/" className="hero-btn">Return to Collection</Link>
      </div>
    );
  }

  const related = products
    .filter(p => (p.category === product.category || p.category === 'Unisex') && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail">
      <div className="detail-grid">
        <div className="detail-img-wrap">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info">
          <div className="detail-header">
            <span className="product-category">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="detail-price">${product.price.toFixed(2)}</p>
          </div>
          
          <p className="detail-desc">{product.description}</p>
          
          <button
            className="add-to-cart-large"
            onClick={() => dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }))}
          >
            Add to Bag
          </button>
          
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
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
