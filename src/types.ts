export type ProductCategory = 'all' | 'clothing' | 'accessories' | 'gifting' | 'trending';
export type ProductGender = 'all' | 'ladies' | 'mens' | 'kids' | 'unisex';
export type StitchType = 'all' | 'stitched' | 'unstitched';

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
  category: 'clothing' | 'accessories' | 'gifting';
  gender?: 'ladies' | 'mens' | 'kids' | 'unisex';
  stitchType?: 'stitched' | 'unstitched';
  suitPieces?: '1-piece' | '2-piece' | '3-piece' | 'fabric-meters';
  fabric?: string;
  customStitchingAvailable?: boolean;
  stitchingPrice?: number;
  price: number; // in PKR
  originalPrice?: number;
  discountPercentage?: number;
  images: string[];
  description: string;
  details: string[];
  fabricCare?: string[];
  sizes?: string[];
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
  selectedSize?: string;
  selectedColor?: string;
  customStitchingSelected?: boolean;
  stitchingPrice?: number;
  stitchingMeasurements?: string;
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

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok';
  thumbnailUrl: string;
  caption: string;
  likes: string;
  comments: string;
  taggedProductSlug?: string;
  views?: string;
}

export interface CustomerLook {
  id: string;
  authorName: string;
  city: string;
  imageUrl: string;
  productSlug: string;
  productName: string;
  caption: string;
  verifiedPurchase: boolean;
  date: string;
}

export interface LookbookArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  readTime: string;
  coverImage: string;
  publishedDate: string;
  summary: string;
  content: string[];
  featuredProductSlugs: string[];
}

export interface BackInStockRequest {
  id: string;
  productId: string;
  productName: string;
  phoneOrEmail: string;
  requestedAt: string;
}
