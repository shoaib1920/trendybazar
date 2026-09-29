import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  AppliedDiscount,
  PlacedOrder,
  CheckoutFormData,
  BackInStockRequest
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { isFirebaseConfigured } from '../lib/firebase';
import { subscribeToProducts, saveProductRemote, deleteProductRemote, seedProductsIfEmpty } from '../lib/productsService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
}

export type AppLanguage = 'en' | 'ur';

interface ShopContextType {
  // Language Toggle
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;

  // Navigation
  activeView: 'home' | 'shop' | 'product' | 'wishlist' | 'about' | 'contact' | 'track' | 'admin';
  setActiveView: (view: 'home' | 'shop' | 'product' | 'wishlist' | 'about' | 'contact' | 'track' | 'admin') => void;
  selectedProductSlug: string | null;
  navigateToProduct: (slug: string) => void;
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
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Checkout Modal
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  placeOrder: (formData: CheckoutFormData) => PlacedOrder;
  orders: PlacedOrder[];

  // Loyalty Rewards
  loyaltyPoints: number;
  earnPoints: (pts: number) => void;

  // Recently Viewed & Back In Stock
  recentlyViewedSlugs: string[];
  addRecentlyViewed: (slug: string) => void;
  backInStockRequests: BackInStockRequest[];
  registerBackInStock: (productId: string, productName: string, contact: string) => void;

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

const WHATSAPP_NUMBER = '923364300592';
const FREE_SHIPPING_THRESHOLD = 3500;
const STANDARD_SHIPPING_FEE = 150;

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

  // Navigation
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'product' | 'wishlist' | 'about' | 'contact' | 'track' | 'admin'>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>('all');
  const [shopSubCategoryFilter, setShopSubCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tb_products_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCTS.length) {
          return parsed;
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

  // Loyalty Points (default 180 points for welcoming back loyal shopper)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    const saved = localStorage.getItem('tb_loyalty_points');
    return saved !== null ? parseInt(saved, 10) : 180;
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

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Orders
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    const saved = localStorage.getItem('tb_orders');
    return saved ? JSON.parse(saved) : [];
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
    localStorage.setItem('tb_orders', JSON.stringify(orders));
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
    localStorage.setItem('tb_loyalty_points', loyaltyPoints.toString());
  }, [loyaltyPoints]);

  useEffect(() => {
    localStorage.setItem('tb_recently_viewed', JSON.stringify(recentlyViewedSlugs));
  }, [recentlyViewedSlugs]);

  useEffect(() => {
    localStorage.setItem('tb_back_in_stock', JSON.stringify(backInStockRequests));
  }, [backInStockRequests]);

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

  const earnPoints = (pts: number) => {
    setLoyaltyPoints((prev) => prev + pts);
  };

  const addRecentlyViewed = (slug: string) => {
    setRecentlyViewedSlugs((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 8);
    });
  };

  const registerBackInStock = (productId: string, productName: string, contact: string) => {
    const newReq: BackInStockRequest = {
      id: `bis-${Date.now()}`,
      productId,
      productName,
      phoneOrEmail: contact,
      requestedAt: new Date().toISOString()
    };
    setBackInStockRequests((prev) => [newReq, ...prev]);
    showToast(`✓ We'll notify ${contact} as soon as restocked!`, 'success');
  };

  // Cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Validate discount against subtotal
  const isDiscountValid = appliedDiscount ? cartSubtotal >= appliedDiscount.minSpend : false;
  const cartDiscount = isDiscountValid && appliedDiscount
    ? Math.round((cartSubtotal * appliedDiscount.percentage) / 100)
    : 0;

  const cartShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartCount === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  const navigateToProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    addRecentlyViewed(slug);
    setActiveView('product');
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

  // Promo code
  const applyPromoCode = (inputCode: string): boolean => {
    const code = inputCode.trim().toUpperCase();
    setDiscountError(null);

    if (code === 'WELCOME5') {
      setAppliedDiscount({
        code: 'WELCOME5',
        percentage: 5,
        minSpend: 0,
        discountAmount: Math.round(cartSubtotal * 0.05),
        description: '5% Welcome Offer'
      });
      showToast('🎉 WELCOME5 applied! Saved 5%', 'success');
      return true;
    }

    setDiscountError('Invalid discount code.');
    showToast('Invalid promo code', 'warning');
    return false;
  };

  const removePromoCode = () => {
    setAppliedDiscount(null);
    setDiscountError(null);
    showToast('Promo code removed', 'info');
  };

  // WhatsApp Helpers
  const getWhatsAppProductLink = (product: Product, color?: string) => {
    const details = color ? `Color: ${color}` : '';
    const msg = `Assalam-o-Alaikum Trendy Bazar! 👋
I would like to order:
🛍️ *${product.name}*
💰 Price: Rs. ${product.price}
${details ? `✨ Details: ${details}\n` : ''}🔗 Link: https://trendybazar.pk/product/${product.slug}

Please confirm availability and delivery time for Cash on Delivery!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppCartLink = (customNote?: string) => {
    if (cart.length === 0) {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Assalam-o-Alaikum Trendy Bazar! I have a question about your products.')}`;
    }

    let itemsList = cart
      .map((item, idx) => {
        const details = item.selectedColor ? ` [${item.selectedColor}]` : '';
        const itemTotal = item.product.price * item.quantity;
        return `${idx + 1}. *${item.product.name}* (Qty: ${item.quantity}) - Rs. ${itemTotal}${details}`;
      })
      .join('\n');

    const msg = `Assalam-o-Alaikum Trendy Bazar! 🛍️
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
    const defaultMsg = msg || 'Assalam-o-Alaikum Trendy Bazar! Need assistance with an order.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMsg)}`, '_blank', 'noopener,noreferrer');
  };

  // Place Order
  const placeOrder = (formData: CheckoutFormData): PlacedOrder => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `TB-${randomNum}`;
    const couriers: ('Trax Logistics' | 'Leopards Courier' | 'PostEx')[] = ['Trax Logistics', 'Leopards Courier', 'PostEx'];
    const chosenCourier = couriers[Math.floor(Math.random() * couriers.length)];

    const paymentLabels: Record<string, string> = {
      cod: 'Cash on Delivery (COD)',
      jazzcash: 'JazzCash Mobile Account',
      easypaisa: 'Easypaisa Wallet',
      card: 'Debit / Credit Card'
    };

    const giftFee = formData.giftWrapping ? 150 : 0;
    const pointsDiscount = formData.pointsToRedeem ? Math.min(formData.pointsToRedeem, cartTotal) : 0;
    const finalTotal = Math.max(0, cartTotal + giftFee - pointsDiscount);

    const newOrder: PlacedOrder = {
      orderId,
      date: new Date().toISOString().split('T')[0],
      customer: formData,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shipping: cartShipping,
      giftWrapFee: giftFee,
      pointsDiscount: pointsDiscount,
      total: finalTotal,
      status: 'Confirmed',
      trackingNumber: `TRX-${Math.floor(1000000 + Math.random() * 9000000)}`,
      courier: chosenCourier,
      paymentMethod: paymentLabels[formData.paymentMethod] || 'Cash on Delivery'
    };

    const earnedPoints = Math.round(cartSubtotal * 0.05);
    setLoyaltyPoints((prev) => Math.max(0, prev - (formData.pointsToRedeem || 0)) + earnedPoints);

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedDiscount(null);
    showToast(`🎉 Order #${orderId} placed! You earned ${earnedPoints} rewards points.`, 'success');
    return newOrder;
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
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        placeOrder,
        orders,
        loyaltyPoints,
        earnPoints,
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
