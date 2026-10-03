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
  subCategory?: string;
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
  // 'fixed' = flat rupee amount off; older saved discounts have no type and are percent.
  type?: 'percent' | 'fixed';
  percentage: number;
  amount?: number;
  minSpend: number;
  discountAmount: number;
  description: string;
}

// Stored in Firestore `discounts/{code}` (code in upper case is the document id).
export interface DiscountCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number; // percent (1-90) or rupees
  minSpend: number;
  description: string;
  active: boolean;
  // The one code advertised across the site (top banner, promo popup, cart…).
  featured: boolean;
  expiresAt?: string; // ISO date (end of that day)
  usageLimit?: number;
  usedCount: number;
  createdAt: string;
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

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

// The normal forward path an order moves through (Cancelled/Returned are side exits).
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number; // unit price at the time of purchase
  quantity: number;
  color?: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  at: string; // ISO timestamp
  note?: string;
}

// Stored in Firestore `orders/{orderId}` (and mirrored on the buyer's device).
export interface PlacedOrder {
  orderId: string;
  createdAt: string; // ISO timestamp
  source: 'website' | 'ai-chat';
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    nearestLandmark?: string;
    orderNotes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  giftWrapFee: number;
  giftNote?: string;
  pointsDiscount: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  courier?: string;
  trackingNumber?: string;
  adminNotes?: string;
  stockDeducted?: boolean;
}

export interface BackInStockRequest {
  id: string;
  productId: string;
  productName: string;
  phoneOrEmail: string;
  requestedAt: string;
}
