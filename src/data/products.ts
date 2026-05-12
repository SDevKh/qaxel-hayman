export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Linen Shirt',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1594932224010-75f1077f7243?w=800&q=80',
    category: 'Mens',
    description: 'Breathable, high-quality linen shirt for effortless summer style.',
    badge: 'Sustainable',
  },
  {
    id: 2,
    name: 'Silk Slip Dress',
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    category: 'Womens',
    description: 'Elegant mulberry silk dress with a delicate sheen and fluid drape.',
    badge: 'Premium',
  },
  {
    id: 3,
    name: 'Cashmere Crewneck',
    price: 195.00,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    category: 'Unisex',
    description: 'Ultra-soft grade A cashmere sweater, a timeless wardrobe essential.',
    badge: 'Best Seller',
  },
  {
    id: 4,
    name: 'Tailored Wool Blazer',
    price: 280.00,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    category: 'Mens',
    description: 'Structured wool blazer with a modern silhouette and premium finish.',
  },
  {
    id: 5,
    name: 'Cotton Poplin Shirt',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    category: 'Womens',
    description: 'Crisp organic cotton poplin shirt with oversized cuffs.',
    badge: 'New',
  },
  {
    id: 6,
    name: 'Minimalist Tote Bag',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    category: 'Accessories',
    description: 'Handcrafted leather tote with clean lines and spacious interior.',
  },
  {
    id: 7,
    name: 'Relaxed Trousers',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
    category: 'Unisex',
    description: 'Comfortable wide-leg trousers made from a recycled polyester blend.',
    badge: 'New',
  },
  {
    id: 8,
    name: 'Leather Sandals',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&q=80',
    category: 'Accessories',
    description: 'Fine Italian leather sandals with a cushioned footbed for all-day comfort.',
  },
];

export const categories = ['All', 'Mens', 'Womens', 'Unisex', 'Accessories'];
