import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'tb-buds-pro-3',
    name: 'Buds Pro 3 True Wireless Earbuds',
    slug: 'buds-pro-3-true-wireless-earbuds',
    tagline: 'Crisp bass, touch controls & all-day battery in a pocket-sized charging case',
    category: 'electronics',
    subCategory: 'earbuds',
    price: 1999,
    images: [
      'https://images.unsplash.com/photo-1746645297670-80e76130ceca?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1678953847562-ac509f09515b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1677086776790-d62757265efe?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Punchy bass, clear calls, and a battery that lasts all day.',
    details: [
      'Bluetooth 5.3, up to 10m range',
      '6h playback, 24h+ with case',
      'Touch controls & voice assistant',
      'IPX4 splash resistant',
      'USB-C fast charging'
    ],
    colors: [
      { name: 'Jet Black', hex: '#141414' },
      { name: 'Pearl White', hex: '#F5F5F0' },
      { name: 'Navy Blue', hex: '#1F3A5F' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: true,
    inStock: true,
    stockCount: 40,
    rating: 4.7,
    reviewCount: 23,
    reviews: [
      {
        id: 'rev-b1',
        userName: 'Hamza Tariq',
        userCity: 'Lahore',
        rating: 5,
        date: '2 days ago',
        comment: 'Great sound for the price. Battery lasts my whole day.',
        verified: true
      },
      {
        id: 'rev-b2',
        userName: 'Areeba Shahid',
        userCity: 'Karachi',
        rating: 5,
        date: '5 days ago',
        comment: 'Fits snug during runs, looks premium.',
        verified: true
      }
    ]
  },
  {
    id: 'tb-watch-01',
    name: 'Classic Steel Chronograph',
    slug: 'classic-steel-chronograph-watch',
    tagline: 'Stainless steel case with a black chronograph dial',
    category: 'accessories',
    subCategory: 'watches',
    price: 4299,
    images: [
      'https://images.unsplash.com/photo-1661030418545-fd307b4c6f16?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Stainless steel build, quartz movement, everyday water resistance.',
    details: [
      'Stainless steel case & strap',
      'Quartz movement',
      'Water resistant (splash safe)',
      '1-year warranty'
    ],
    colors: [{ name: 'Steel / Black', hex: '#2B2B2B' }],
    isNewDrop: true,
    inStock: true,
    stockCount: 25,
    rating: 4.6,
    reviewCount: 11
  },
  {
    id: 'tb-watch-02',
    name: 'Elite Gold-Dial Dress Watch',
    slug: 'elite-gold-dial-dress-watch',
    tagline: 'Steel case, gold-tone dial, minimalist face',
    category: 'accessories',
    subCategory: 'watches',
    price: 4599,
    images: [
      'https://images.unsplash.com/photo-1767009951305-5ed35f62e3c3?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'A dressier build with a warm gold-tone dial for formal wear.',
    details: [
      'Stainless steel case',
      'Gold-tone dial',
      'Quartz movement',
      '1-year warranty'
    ],
    colors: [{ name: 'Steel / Gold', hex: '#B8860B' }],
    isNewDrop: true,
    inStock: true,
    stockCount: 18,
    rating: 4.5,
    reviewCount: 8
  },
  {
    id: 'tb-watch-03',
    name: 'Classic Leather Strap Watch',
    slug: 'classic-leather-strap-watch',
    tagline: 'Round steel case with a genuine leather strap',
    category: 'accessories',
    subCategory: 'watches',
    price: 4499,
    images: [
      'https://images.unsplash.com/photo-1612817159623-0399784fd0ce?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Everyday analog watch with a soft leather strap.',
    details: [
      'Genuine leather strap',
      'Quartz movement',
      'Steel case',
      '1-year warranty'
    ],
    colors: [{ name: 'Brown / Silver', hex: '#6B4A2F' }],
    inStock: true,
    stockCount: 22,
    rating: 4.4,
    reviewCount: 6
  },
  {
    id: 'tb-watch-04',
    name: 'Minimalist Analog Watch',
    slug: 'minimalist-analog-watch',
    tagline: 'Slim gold and black minimalist face',
    category: 'accessories',
    subCategory: 'watches',
    price: 4750,
    images: [
      'https://images.unsplash.com/photo-1773414753637-2738750cfbb6?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'A slim, minimalist watch that pairs with anything.',
    details: [
      'Slim steel case',
      'Quartz movement',
      'Minimalist dial',
      '1-year warranty'
    ],
    colors: [{ name: 'Black / Gold', hex: '#1A1A1A' }],
    isTrending: true,
    inStock: true,
    stockCount: 16,
    rating: 4.7,
    reviewCount: 9
  }
];
