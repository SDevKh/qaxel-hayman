import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import type { Product } from '../data/products';

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="product-img" />
        </Link>
        <div className="product-actions">
          <button
            className="quick-add-btn"
            onClick={() => dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }))}
          >
            Add to Bag
          </button>
        </div>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <span className="product-price">${product.price.toFixed(2)}</span>
      </div>
    </div>
  );
}
