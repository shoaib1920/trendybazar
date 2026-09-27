export type ProductCategory = 'all' | 'electronics' | 'accessories';

export interface ProductReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  avatarUrl?: string;
  photoUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: 'electronics' | 'accessories';
  subCategory?: 'earbuds' | 'cables' | 'cases' | 'chargers' | 'speakers' | 'watches';
  price: number; // in PKR
  originalPrice?: number;
  discountPercentage?: number;
  images: string[];
  description: string;
  details: string[];
  colors?: { name: string; hex: string }[];
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewDrop?: boolean;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface AppliedDiscount {
  code: string;
  percentage: number;
  minSpend: number;
  discountAmount: number;
  description: string;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string; // WhatsApp active
  email?: string;
  city: string;
  address: string;
  nearestLandmark?: string;
  paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'card';
  orderNotes?: string;
  giftWrapping?: boolean;
  giftNote?: string;
  pointsToRedeem?: number;
}

export interface PlacedOrder {
  orderId: string;
  date: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  giftWrapFee?: number;
  pointsDiscount?: number;
  total: number;
  status: 'Confirmed' | 'Packing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  courier: 'Trax Logistics' | 'Leopards Courier' | 'PostEx';
  paymentMethod: string;
}

export interface BackInStockRequest {
  id: string;
  productId: string;
  productName: string;
  phoneOrEmail: string;
  requestedAt: string;
}
