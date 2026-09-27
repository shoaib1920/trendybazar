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
    description: 'The Buds Pro 3 pack punchy bass, clear call quality, and a battery that keeps up with a full day out — all in a pocket-sized case with a satisfying magnetic snap. Pair instantly with any Bluetooth 5.3 phone and control everything with a simple tap.',
    details: [
      'Bluetooth 5.3 — stable connection up to 10 meters',
      'Up to 6 hours playback per charge, 24+ hours with the charging case',
      'Touch controls: play/pause, skip track, answer calls, summon voice assistant',
      'Built-in mic with noise-reduction for clear calls',
      'IPX4 splash & sweat resistant — safe for workouts and light rain',
      'USB-C fast charging: 10 minutes charge for 1 hour of playback',
      'Auto-pairs the moment you open the case'
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
        comment: 'Sound quality is way better than I expected for the price. Battery easily lasts my whole work day. COD delivery took 2 days.',
        verified: true
      },
      {
        id: 'rev-b2',
        userName: 'Areeba Shahid',
        userCity: 'Karachi',
        rating: 5,
        date: '5 days ago',
        comment: 'Bought the white pair, looks premium and fits snug during runs. Touch controls took a day to get used to but work great now.',
        verified: true
      },
      {
        id: 'rev-b3',
        userName: 'Usman Ali',
        userCity: 'Islamabad',
        rating: 4,
        date: '1 week ago',
        comment: 'Good bass and call quality. Wish the case was a bit smaller but overall solid buy at Rs. 1999.',
        verified: true
      }
    ]
  }
];
