import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import type { Product } from '../data/products';
import { getProductSlug } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const images = Array.isArray(product.image) ? product.image : [product.image];
  const mainImage = images[0];
  const slug = getProductSlug(product);

  return (
    <div className="product-card">
      <Link to={`/product/${slug}`}>
        <div className="product-img-wrap">
          {product.badge && <span className="product-badge">{product.badge}</span>}
          <img className="product-img" src={mainImage} alt={product.name} />
          <div className="product-actions">
            <button
              className="quick-add-btn"
              onClick={(e) => {
                e.preventDefault();
                dispatch(addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: mainImage,
                  size: product.size?.[0] || '',
                  color: product.color?.[0] || '',
                }));
              }}
            >
              Quick Add
            </button>
          </div>
        </div>
      </Link>
      <Link to={`/product/${slug}`} className="product-info">
        <span className="product-category">{product.category}</span>
        <span className="product-name">{product.name}</span>
        <span className="product-price">Rs.{product.price.toFixed(2)}</span>
      </Link>
    </div>
  );
}
