export interface Product {
  id: number;
  name: string;
  price: number;
  image: string | string[];
  category: string;
  description: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Goku Anime Tshirt',
    price: 890.00,
    image: [
      '/goku1.jpg',
      '/goku2.jpg',
      '/goku3.jpg',
      '/Goku.jpg',
      '/goku (2).jpg'
    ],
    category: 'Mens',
    description: 'Breathable, high-quality linen shirt for effortless summer style.',
    badge: 'Sustainable',
  },
  {
    id: 2,
    name: 'Anime Girls overszied T-shirt',
    price: 590.00,
    image: [
      '/Anime Girls overszied.jpg'
    ],
    category: 'Womens',
    description: 'Elegant mulberry silk dress with a delicate sheen and fluid drape.',
    badge: 'Premium',
  },
  {
    id: 3,
    name: 'Demon Slayer Jacket',
    price: 1499.00,
    image: [
      '/Demon Slayer Jacket.jpg'
    ],
    category: 'Unisex',
    description: 'Ultra-soft grade A cashmere sweater, a timeless wardrobe essential.',
    badge: 'Best Seller',
  },
  {
    id: 4,
    name: 'Girl Oversized Tshirt',
    price: 599.00,
    image: [
      '/Girl Oversized Tshirt.jpg'
    ],
    category: 'Womens',
    description: 'Breathable, high-quality cotton shirt for effortless summer style.',
    badge: 'Sustainable',
  },
  {
    id: 5,
    name: 'Girls Ovewrsized Tshirt',
    price: 699.00,
    image: '/Girls Oversized tshirt.jpg',
    category: 'Womens',
    description: 'Crisp organic cotton poplin shirt with oversized cuffs.',
    badge: 'New',
  },
  {
    id: 6,
    name: 'Lufy Anime Oversized Tshirt',
    price: 699.00,
    image: '/Lufy Anime Oversized Tshirt.jpg',
    category: 'Unisex',
    description: 'Breathable, high-quality cotton shirt for effortless summer style.',
    badge: 'Sustainable',
  },
  {
    id: 7,
    name: 'One Piece Oversized Tshirt',
    price: 699.00,
    image: [
      '/one piece oversized tshirt.jpg',
      '/One Piece Ovesized Tshirt.jpg'
    ],
    category: 'Unisex',
    description: 'Comfortable wide-leg trousers made from a recycled polyester blend.',
    badge: 'New',
  },
  {
    id: 8,
    name: 'Pirated One Piece Oversized Tshirt',
    price: 899.00,
    image: [
      '/Pirated One Piece Oversized Tshirt.jpg',
      '/frontlufi.png'
    ],
    category: 'Unisex',
    description: 'Comfortable wide-leg trousers made from a recycled polyester blend.',
  },
  {
    id: 9,
    name: 'Pirated One Piece Oversized Tshirt',
    price: 799.00,
    image: [
      '/Pirated One Piece Oversized Tshirt (2).jpg'
    ],
    category: 'Unisex',
    description: 'Comfortable wide-leg trousers made from a recycled polyester blend.',
  },
  {
    id: 10,
    name: 'Oversized Tshirt',
    price: 899.00,
    image: [
      '/Pirated One Piece Oversized Tshirt (1).jpg'
    ],
    category: 'Unisex',
    description: 'Comfortable wide-leg trousers made from a recycled polyester blend.',
  },
  {
    id: 11,
    name: 'One piece oversized Tshirt',
    price: 699.00,
    image: [
      '/One piece oversized Tshirt (1).jpg'
    ],
    category: 'Unisex',
    description: 'Comfortable wide-leg trousers made from a recycled polyester blend.',
  },
];

export const categories = ['All', 'Mens', 'Womens', 'Unisex', 'Accessories'];
