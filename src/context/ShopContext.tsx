import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  AppliedDiscount,
  PlacedOrder,
  CheckoutFormData,
  BackInStockRequest,
  DiscountCode
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { isFirebaseConfigured } from '../lib/firebase';
import { subscribeToProducts, saveProductRemote, deleteProductRemote, seedProductsIfEmpty } from '../lib/productsService';
import { createOrderRemote, generateOrderId, OrderLimitError, updateOrderRemote } from '../lib/ordersService';
import { toPhoneKey } from '../lib/phone';
import { applyPageSeo, SITE_URL } from '../lib/seo';
import {
  createBackInStockRemote,
  getPointsRemote,
  markCartConvertedRemote,
  saveAbandonedCartRemote
} from '../lib/customerService';
import {
  DEFAULT_DISCOUNT,
  deleteDiscountRemote,
  discountLabel,
  discountProblem,
  getDiscountRemote,
  incrementDiscountUsage,
  normalizeCode,
  saveDiscountRemote,
  subscribeFeaturedDiscount
} from '../lib/discountsService';

export interface CheckoutExtras {
  giftWrapFee: number;
  giftNote?: string;
  pointsDiscount: number;
}

// `synced` is false when the order could not be saved to the online store
// database (it is still kept on this device and can be sent via WhatsApp).
export interface OrderSubmitResult {
  order: PlacedOrder;
  synced: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
}

export type AppLanguage = 'en' | 'ur';
type ActiveView = 'home' | 'shop' | 'earbuds' | 'watches' | 'product' | 'wishlist' | 'about' | 'contact' | 'track' | 'admin';

// Every page has its own address so links can be shared and the back button works:
// /, /shop, /earbuds, /watches, /product/<slug>, /wishlist, /about, /contact,
// /track, /track/<order id>, /admin
const VIEW_PATHS: Record<Exclude<ActiveView, 'product'>, string> = {
  home: '/',
  shop: '/shop',
  earbuds: '/earbuds',
  watches: '/watches',
  wishlist: '/wishlist',
  about: '/about',
  contact: '/contact',
  track: '/track',
  admin: '/admin'
};

interface Route {
  view: ActiveView;
  slug: string | null;
  orderId: string | null;
}

const parseRoute = (pathname: string): Route => {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const [first, second] = parts;
  if (first === 'product' && second) return { view: 'product', slug: second, orderId: null };
  if (first === 'track') return { view: 'track', slug: null, orderId: second ? second.toUpperCase() : null };
  const view = (Object.keys(VIEW_PATHS) as (keyof typeof VIEW_PATHS)[]).find((v) => VIEW_PATHS[v] === `/${first || ''}`);
  return { view: view || 'home', slug: null, orderId: null };
};

// The part of a product's address after /product/. Products that share a name
// (and so a slug) get a short id suffix so every product has its own link.
export const productKeyFor = (product: Product, all: Product[]) =>
  all.some((p) => p.slug === product.slug && p.id !== product.id) ? `${product.slug}-${product.id.slice(-5).toLowerCase()}` : product.slug;

export const findProductByKey = (key: string | null, all: Product[]) =>
  key ? all.find((p) => productKeyFor(p, all) === key) || all.find((p) => p.slug === key) : undefined;

export const productUrl = (slug: string) => `${window.location.origin}/product/${encodeURIComponent(slug)}`;
export const trackUrl = (orderId: string) => `${window.location.origin}/track/${orderId}`;

interface ShopContextType {
  // Language Toggle
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;

  // Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedProductSlug: string | null;
  navigateToProduct: (slug: string) => void;
  // Order ID from a /track/<id> link.
  trackOrderId: string | null;
  shopCategoryFilter: string;
  setShopCategoryFilter: (cat: string) => void;
  shopSubCategoryFilter: string;
  setShopSubCategoryFilter: (sub: string) => void;

  // Catalog
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  isCloudBackendConfigured: boolean;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Discount
  appliedDiscount: AppliedDiscount | null;
  discountError: string | null;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;
  // The code advertised across the site (null = no promotion running).
  featuredDiscount: DiscountCode | null;
  // Browser-only codes, used when Firebase is not configured.
  localDiscounts: DiscountCode[];
  saveDiscount: (d: DiscountCode) => Promise<void>;
  deleteDiscount: (code: string) => Promise<void>;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Checkout Modal
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  placeOrder: (formData: CheckoutFormData, extras: CheckoutExtras) => Promise<OrderSubmitResult>;
  submitOrder: (order: PlacedOrder) => Promise<OrderSubmitResult>;
  updateOrder: (orderId: string, patch: Partial<PlacedOrder>) => Promise<void>;
  // Orders placed from this device (the full list for admins lives in Firestore).
  orders: PlacedOrder[];

  // Loyalty points are kept per phone number in Firestore.
  getCustomerPoints: (phone: string) => Promise<number>;
  // Saves checkout details so the admin can follow up if the order is not completed.
  saveCheckoutDraft: (draft: { fullName: string; phone: string; city: string }) => void;

  // Recently Viewed & Back In Stock
  recentlyViewedSlugs: string[];
  addRecentlyViewed: (slug: string) => void;
  // Browser-only requests, used when Firebase is not configured.
  backInStockRequests: BackInStockRequest[];
  registerBackInStock: (productId: string, productName: string, contact: string) => Promise<void>;

  // WhatsApp Helpers
  brandWhatsAppNumber: string;
  getWhatsAppProductLink: (product: Product, color?: string) => string;
  getWhatsAppCartLink: (customNote?: string) => string;
  openWhatsAppGeneral: (msg?: string) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const WHATSAPP_NUMBER = '923364300592';
const FREE_SHIPPING_THRESHOLD = 3500;
const STANDARD_SHIPPING_FEE = 150;
const LEGACY_SEEDED_PRODUCT_IDS = [
  'tb-buds-pro-3',
  'tb-watch-01',
  'tb-watch-02',
  'tb-watch-03',
  'tb-watch-04'
];

// Translation dictionary for English <-> Urdu
const DICTIONARY: Record<AppLanguage, Record<string, string>> = {
  en: {
    shopNow: 'Order Now',
    newArrivals: 'New Arrivals',
    bestsellers: 'Bestsellers',
    cashOnDelivery: 'Cash on Delivery Nationwide',
    freeShipping: 'Free Delivery on Rs. 3,500+',
    orderOnWhatsApp: 'Order on WhatsApp',
    addToBag: 'Add to Bag',
    viewDetails: 'View Details',
    quickView: 'Quick View',
    trackOrder: 'Track Order',
    cart: 'Shopping Bag',
    rewards: 'Rewards Points',
    home: 'Home',
    shop: 'Shop',
    wishlist: 'Wishlist'
  },
  ur: {
    shopNow: 'ابھی آرڈر کریں',
    newArrivals: 'نئی آمد',
    bestsellers: 'سب سے مقبول',
    cashOnDelivery: 'پورے پاکستان میں کیش آن ڈیلیوری',
    freeShipping: '۳۵۰۰ روپے پر مفت ڈیلیوری',
    orderOnWhatsApp: 'واٹس ایپ پر آرڈر کریں',
    addToBag: 'بیگ میں شامل کریں',
    viewDetails: 'تفصیلات دیکھیں',
    quickView: 'جھلک دیکھیں',
    trackOrder: 'آرڈر ٹریک کریں',
    cart: 'شاپنگ بیگ',
    rewards: 'انعامی پوائنٹس',
    home: 'ہوم',
    shop: 'شاپ',
    wishlist: 'پسندیدہ اشیاء'
  }
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('tb_lang') as AppLanguage) || 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('tb_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  const t = (key: string): string => {
    return DICTIONARY[language]?.[key] || DICTIONARY.en[key] || key;
  };

  // Navigation (kept in sync with the address bar)
  const initialRoute = parseRoute(window.location.pathname);
  const [activeView, setActiveViewState] = useState<ActiveView>(initialRoute.view);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(initialRoute.slug);
  const [trackOrderId, setTrackOrderId] = useState<string | null>(initialRoute.orderId);

  const pushPath = (path: string) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
  };

  const setActiveView = (view: ActiveView) => {
    setActiveViewState(view);
    if (view === 'product') {
      if (selectedProductSlug) pushPath(`/product/${encodeURIComponent(selectedProductSlug)}`);
    } else {
      if (view === 'track') setTrackOrderId(null);
      pushPath(VIEW_PATHS[view]);
    }
  };

  useEffect(() => {
    const syncWithAddressBar = () => {
      const route = parseRoute(window.location.pathname);
      setActiveViewState(route.view);
      if (route.slug) setSelectedProductSlug(route.slug);
      setTrackOrderId(route.orderId);
    };
    window.addEventListener('popstate', syncWithAddressBar);
    return () => window.removeEventListener('popstate', syncWithAddressBar);
  }, []);
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>('all');
  const [shopSubCategoryFilter, setShopSubCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tb_products_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const hasLegacySeed = parsed.length > 0 && parsed.every((item) =>
            item && typeof item === 'object' && 'id' in item && LEGACY_SEEDED_PRODUCT_IDS.includes(String(item.id))
          );
          if (!hasLegacySeed) {
            return parsed;
          }
          localStorage.removeItem('tb_products_v2');
        }
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tb_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('tb_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Recently Viewed Slugs
  const [recentlyViewedSlugs, setRecentlyViewedSlugs] = useState<string[]>(() => {
    const saved = localStorage.getItem('tb_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  // Back In Stock Requests
  const [backInStockRequests, setBackInStockRequests] = useState<BackInStockRequest[]>(() => {
    const saved = localStorage.getItem('tb_back_in_stock');
    return saved ? JSON.parse(saved) : [];
  });

  // Discount
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(() => {
    const saved = localStorage.getItem('tb_discount');
    return saved ? JSON.parse(saved) : null;
  });
  const [discountError, setDiscountError] = useState<string | null>(null);

  const [localDiscounts, setLocalDiscounts] = useState<DiscountCode[]>(() => {
    try {
      const saved = localStorage.getItem('tb_discounts');
      return saved ? JSON.parse(saved) : [DEFAULT_DISCOUNT];
    } catch {
      return [DEFAULT_DISCOUNT];
    }
  });
  const [remoteFeatured, setRemoteFeatured] = useState<DiscountCode | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) localStorage.setItem('tb_discounts', JSON.stringify(localDiscounts));
  }, [localDiscounts]);

  useEffect(() => subscribeFeaturedDiscount(setRemoteFeatured), []);

  const featuredDiscount = isFirebaseConfigured
    ? remoteFeatured
    : localDiscounts.find((d) => d.featured && !discountProblem(d)) || null;

  const findDiscount = async (code: string): Promise<DiscountCode | null> =>
    isFirebaseConfigured
      ? getDiscountRemote(code)
      : localDiscounts.find((d) => normalizeCode(d.code) === normalizeCode(code)) || null;

  const saveDiscount = async (d: DiscountCode) => {
    const code = normalizeCode(d.code);
    const next = { ...d, code };
    if (isFirebaseConfigured) {
      await saveDiscountRemote(next);
    } else {
      setLocalDiscounts((prev) => {
        // Only one featured code at a time.
        const others = prev.filter((x) => x.code !== code).map((x) => (next.featured ? { ...x, featured: false } : x));
        return [next, ...others];
      });
    }
  };

  const deleteDiscount = async (code: string) => {
    if (isFirebaseConfigured) {
      await deleteDiscountRemote(code);
    } else {
      setLocalDiscounts((prev) => prev.filter((x) => x.code !== normalizeCode(code)));
    }
  };

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Orders
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('tb_orders_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('tb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('tb_discount', JSON.stringify(appliedDiscount));
  }, [appliedDiscount]);

  useEffect(() => {
    localStorage.setItem('tb_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tb_products_v2', JSON.stringify(products));
  }, [products]);

  // When Firebase is configured, the Firestore `products` collection
  // becomes the source of truth: seed it once if empty, then keep local
  // state live-synced to it. Without Firebase, products stay in localStorage
  // only (set up above), exactly as before.
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let unsubscribe = () => {};
    (async () => {
      await seedProductsIfEmpty(INITIAL_PRODUCTS);
      unsubscribe = subscribeToProducts((remoteProducts) => {
        if (remoteProducts.length > 0) setProducts(remoteProducts);
      });
    })();
    return () => unsubscribe();
  }, []);

  const saveProduct = async (product: Product) => {
    if (isFirebaseConfigured) {
      await saveProductRemote(product);
    } else {
      setProducts((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev];
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    if (isFirebaseConfigured) {
      await deleteProductRemote(productId);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  useEffect(() => {
    localStorage.setItem('tb_recently_viewed', JSON.stringify(recentlyViewedSlugs));
  }, [recentlyViewedSlugs]);

  useEffect(() => {
    localStorage.setItem('tb_back_in_stock', JSON.stringify(backInStockRequests));
  }, [backInStockRequests]);

  // SEO tags per page (titles match the server-rendered ones in api/render.ts).
  useEffect(() => {
    // Products still loading: keep the server-rendered tags for now.
    if (activeView === 'product' && products.length === 0) return;
    const product = activeView === 'product' ? findProductByKey(selectedProductSlug, products) : undefined;
    if (product) {
      const key = productKeyFor(product, products);
      const path = `/product/${encodeURIComponent(key)}`;
      applyPageSeo({
        title: `${product.name} Price in Pakistan – Rs. ${product.price.toLocaleString()} | Trendy Bazaar`,
        description: `${product.name} – Rs. ${product.price.toLocaleString()}. ${product.tagline || product.description} Cash on Delivery all over Pakistan from Trendy Bazaar.`.slice(0, 160),
        path,
        image: product.images[0],
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description || product.tagline,
          image: product.images.slice(0, 5),
          sku: product.id,
          brand: { '@type': 'Brand', name: 'Trendy Bazaar' },
          url: `${SITE_URL}${path}`,
          offers: {
            '@type': 'Offer',
            url: `${SITE_URL}${path}`,
            priceCurrency: 'PKR',
            price: product.price,
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition'
          }
        }
      });
      return;
    }

    const pages: Partial<Record<ActiveView, { title: string; description: string; noindex?: boolean }>> = {
      home: {
        title: 'Trendy Bazaar Pakistan – Earbuds & Watches Online | Cash on Delivery',
        description: 'Trendy Bazaar – shop wireless earbuds and stylish watches online in Pakistan at fair prices. Cash on Delivery nationwide, 2–4 day delivery and 7-day easy exchange.'
      },
      shop: {
        title: 'Shop Earbuds & Watches Online in Pakistan | Trendy Bazaar',
        description: 'Browse all wireless earbuds and watches at Trendy Bazaar. Fair prices, Cash on Delivery all over Pakistan and 7-day easy exchange.'
      },
      earbuds: {
        title: 'Wireless Earbuds in Pakistan – Best Prices | Trendy Bazaar',
        description: 'Buy wireless earbuds online in Pakistan at Trendy Bazaar. Great sound and battery life, Cash on Delivery nationwide and fast 2–4 day delivery.'
      },
      watches: {
        title: 'Watches for Men in Pakistan – Stylish & Affordable | Trendy Bazaar',
        description: 'Shop stylish watches online in Pakistan at Trendy Bazaar – chronograph, leather strap, steel and minimalist styles. Cash on Delivery nationwide.'
      },
      about: {
        title: 'About Trendy Bazaar – Earbuds & Watches Store in Pakistan',
        description: 'Trendy Bazaar is a Pakistani online store for wireless earbuds and watches with fair prices, Cash on Delivery and friendly WhatsApp support.'
      },
      contact: {
        title: 'Help & FAQs – Delivery, Exchange & Orders | Trendy Bazaar',
        description: 'Questions about delivery, Cash on Delivery, exchanges or your order? Contact Trendy Bazaar on WhatsApp at +92 336 4300592.'
      },
      wishlist: { title: 'Wishlist | Trendy Bazaar', description: 'Your saved products at Trendy Bazaar.', noindex: true },
      track: { title: 'Track Your Order | Trendy Bazaar', description: 'Track your Trendy Bazaar order with your Order ID.', noindex: true },
      admin: { title: 'Admin | Trendy Bazaar', description: 'Store admin.', noindex: true },
      product: { title: 'Product not found | Trendy Bazaar', description: 'This product is no longer available.', noindex: true }
    };
    const page = pages[activeView] || pages.home!;
    const path = activeView === 'home' || activeView === 'product' ? '/' : VIEW_PATHS[activeView as keyof typeof VIEW_PATHS];
    applyPageSeo({ ...page, path, jsonLd: null });
  }, [activeView, selectedProductSlug, products]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getCustomerPoints = async (phone: string) => {
    const phoneKey = toPhoneKey(phone);
    if (!phoneKey) return 0;
    try {
      return await getPointsRemote(phoneKey);
    } catch {
      return 0;
    }
  };

  const addRecentlyViewed = (slug: string) => {
    setRecentlyViewedSlugs((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 8);
    });
  };

  const registerBackInStock = async (productId: string, productName: string, contact: string) => {
    const newReq: BackInStockRequest = {
      id: `bis-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      productId,
      productName,
      contact: contact.trim(),
      phoneKey: toPhoneKey(contact) || undefined,
      createdAt: new Date().toISOString(),
      notified: false
    };
    if (isFirebaseConfigured) {
      await createBackInStockRemote(newReq);
    } else {
      setBackInStockRequests((prev) => [newReq, ...prev]);
    }
    showToast(`✓ We'll notify ${contact} as soon as it's restocked!`, 'success');
  };

  // Cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Validate discount against subtotal
  const isDiscountValid = appliedDiscount ? cartSubtotal >= appliedDiscount.minSpend : false;
  const cartDiscount = isDiscountValid && appliedDiscount
    ? appliedDiscount.type === 'fixed'
      ? Math.min(cartSubtotal, appliedDiscount.amount || 0)
      : Math.round((cartSubtotal * appliedDiscount.percentage) / 100)
    : 0;

  const cartShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartCount === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  const navigateToProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    addRecentlyViewed(slug);
    setActiveViewState('product');
    pushPath(`/product/${encodeURIComponent(slug)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    const chosenColor = color || (product.colors && product.colors[0].name);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === chosenColor
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedColor: chosenColor
          }
        ];
      }
    });

    showToast(`Added "${product.name.slice(0, 24)}..." to cart!`, 'success');
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from favorites', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Promo code — checked against the codes managed in the admin panel.
  const toApplied = (d: DiscountCode): AppliedDiscount => ({
    code: d.code,
    type: d.type,
    percentage: d.type === 'percent' ? d.value : 0,
    amount: d.type === 'fixed' ? d.value : undefined,
    minSpend: d.minSpend,
    discountAmount: 0,
    description: d.description || discountLabel(d)
  });

  const applyPromoCode = async (inputCode: string): Promise<boolean> => {
    const code = normalizeCode(inputCode);
    setDiscountError(null);
    if (!code) return false;

    let found: DiscountCode | null = null;
    try {
      found = await findDiscount(code);
    } catch {
      setDiscountError('Could not check the code right now. Please try again.');
      return false;
    }
    const problem = discountProblem(found);
    if (problem || !found) {
      setDiscountError(problem || 'Invalid discount code.');
      showToast(problem || 'Invalid promo code', 'warning');
      return false;
    }

    setAppliedDiscount(toApplied(found));
    showToast(
      found.minSpend > cartSubtotal
        ? `${found.code} saved — add Rs. ${(found.minSpend - cartSubtotal).toLocaleString()} more to unlock ${discountLabel(found, false)}`
        : `🎉 ${found.code} applied! ${discountLabel(found, false)}`,
      'success'
    );
    return true;
  };

  // Re-check a code saved from an earlier visit (it may have been edited or switched off).
  useEffect(() => {
    if (!appliedDiscount) return;
    let cancelled = false;
    findDiscount(appliedDiscount.code)
      .then((d) => {
        if (cancelled) return;
        if (discountProblem(d) || !d) setAppliedDiscount(null);
        else setAppliedDiscount(toApplied(d));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removePromoCode = () => {
    setAppliedDiscount(null);
    setDiscountError(null);
    showToast('Promo code removed', 'info');
  };

  // WhatsApp Helpers
  const getWhatsAppProductLink = (product: Product, color?: string) => {
    const details = color ? `Color: ${color}` : '';
    const msg = `Assalam-o-Alaikum Trendy Bazaar! 👋
I would like to order:
🛍️ *${product.name}*
💰 Price: Rs. ${product.price}
${details ? `✨ Details: ${details}\n` : ''}🔗 Link: ${productUrl(productKeyFor(product, products))}

Please confirm availability and delivery time for Cash on Delivery!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppCartLink = (customNote?: string) => {
    if (cart.length === 0) {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Assalam-o-Alaikum Trendy Bazaar! I have a question about your products.')}`;
    }

    let itemsList = cart
      .map((item, idx) => {
        const details = item.selectedColor ? ` [${item.selectedColor}]` : '';
        const itemTotal = item.product.price * item.quantity;
        return `${idx + 1}. *${item.product.name}* (Qty: ${item.quantity}) - Rs. ${itemTotal}${details}`;
      })
      .join('\n');

    const msg = `Assalam-o-Alaikum Trendy Bazaar! 🛍️
I want to place an order directly via WhatsApp:

📦 *ORDER ITEMS:*
${itemsList}

💰 *Subtotal:* Rs. ${cartSubtotal}
${cartDiscount > 0 ? `🎟️ *Discount (${appliedDiscount?.code}):* -Rs. ${cartDiscount}\n` : ''}🚚 *Delivery:* ${cartShipping === 0 ? 'FREE' : `Rs. ${cartShipping}`}
🏷️ *Grand Total:* Rs. ${cartTotal}

${customNote ? `📝 *Note:* ${customNote}\n` : ''}
Please send me the order confirmation and COD dispatch details!`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const openWhatsAppGeneral = (msg?: string) => {
    const defaultMsg = msg || 'Assalam-o-Alaikum Trendy Bazaar! Need assistance with an order.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMsg)}`, '_blank', 'noopener,noreferrer');
  };

  // Saves an order online (Firestore) and on this device. Never throws:
  // if the online save fails the order is still kept locally.
  // Throws OrderLimitError when the phone number has reached its daily order limit.
  const submitOrder = async (order: PlacedOrder): Promise<OrderSubmitResult> => {
    order = { ...order, phoneKey: order.phoneKey || toPhoneKey(order.customer.phone) || undefined };
    let synced = !isFirebaseConfigured;
    if (isFirebaseConfigured) {
      try {
        await createOrderRemote(order);
        synced = true;
      } catch (err) {
        if (err instanceof OrderLimitError) throw err;
        console.error('Failed to save order online:', err);
      }
    }
    setOrders((prev) => [order, ...prev.filter((o) => o.orderId !== order.orderId)]);
    return { order, synced };
  };

  const updateOrder = async (orderId: string, patch: Partial<PlacedOrder>) => {
    if (isFirebaseConfigured) {
      await updateOrderRemote(orderId, patch);
    }
    setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, ...patch } : o)));
  };

  // ---------- Abandoned carts ----------
  const draftFor = (form: { fullName: string; phone: string; city: string }) => {
    const phoneKey = toPhoneKey(form.phone);
    if (!phoneKey || !form.fullName.trim() || cart.length === 0) return null;
    return {
      phoneKey,
      name: form.fullName.trim().slice(0, 100),
      phone: form.phone.trim(),
      city: form.city,
      items: cart.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
      total: cartTotal,
      converted: false
    };
  };

  const saveCheckoutDraft = (form: { fullName: string; phone: string; city: string }) => {
    const draft = draftFor(form);
    if (!draft) return;
    saveAbandonedCartRemote(draft).catch(() => {});
  };

  // Place Order (website checkout)
  const placeOrder = async (formData: CheckoutFormData, extras: CheckoutExtras): Promise<OrderSubmitResult> => {
    const paymentLabels: Record<string, string> = {
      cod: 'Cash on Delivery (COD)',
      jazzcash: 'JazzCash / Easypaisa',
      easypaisa: 'JazzCash / Easypaisa',
      card: 'Debit / Credit Card'
    };
    const now = new Date().toISOString();

    const order: PlacedOrder = {
      orderId: generateOrderId(),
      createdAt: now,
      source: 'website',
      customer: {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || undefined,
        city: formData.city,
        address: formData.address.trim(),
        nearestLandmark: formData.nearestLandmark?.trim() || undefined,
        orderNotes: formData.orderNotes?.trim() || undefined
      },
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        image: item.product.images[0] || '',
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor || undefined
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      discountCode: cartDiscount > 0 ? appliedDiscount?.code : undefined,
      shipping: cartShipping,
      giftWrapFee: extras.giftWrapFee,
      giftNote: extras.giftNote || undefined,
      pointsDiscount: extras.pointsDiscount,
      total: Math.max(0, cartTotal + extras.giftWrapFee - extras.pointsDiscount),
      paymentMethod: paymentLabels[formData.paymentMethod] || 'Cash on Delivery (COD)',
      status: 'Pending',
      statusHistory: [{ status: 'Pending', at: now }]
    };

    const result = await submitOrder(order);

    // The checkout was completed, so it is no longer an abandoned cart.
    const cartDraft = draftFor(formData);
    if (cartDraft && result.synced) {
      markCartConvertedRemote(cartDraft, order.orderId).catch(() => {});
    }

    if (order.discountCode && result.synced) {
      const usedCode = normalizeCode(order.discountCode);
      if (isFirebaseConfigured) {
        incrementDiscountUsage(usedCode).catch((err) => console.error('Could not count discount usage:', err));
      } else {
        setLocalDiscounts((prev) => prev.map((d) => (d.code === usedCode ? { ...d, usedCount: d.usedCount + 1 } : d)));
      }
    }

    clearCart();
    setAppliedDiscount(null);
    return result;
  };

  return (
    <ShopContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        activeView,
        setActiveView,
        selectedProductSlug,
        navigateToProduct,
        trackOrderId,
        shopCategoryFilter,
        setShopCategoryFilter,
        shopSubCategoryFilter,
        setShopSubCategoryFilter,
        products,
        setProducts,
        saveProduct,
        deleteProduct,
        isCloudBackendConfigured: isFirebaseConfigured,
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedDiscount,
        discountError,
        applyPromoCode,
        removePromoCode,
        featuredDiscount,
        localDiscounts,
        saveDiscount,
        deleteDiscount,
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        placeOrder,
        submitOrder,
        updateOrder,
        orders,
        getCustomerPoints,
        saveCheckoutDraft,
        recentlyViewedSlugs,
        addRecentlyViewed,
        backInStockRequests,
        registerBackInStock,
        brandWhatsAppNumber: '+92 336 4300592',
        getWhatsAppProductLink,
        getWhatsAppCartLink,
        openWhatsAppGeneral,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
