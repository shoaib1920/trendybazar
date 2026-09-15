import React from 'react';
import { useShop } from '../context/ShopContext';
import { Home, Sparkles, Heart, ShoppingBag, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    cartCount, 
    setIsCartOpen, 
    wishlist,
    setShopGenderFilter,
    setShopCategoryFilter,
    t
  } = useShop();

  const handleShopClick = () => {
    setShopCategoryFilter('all');
    setShopGenderFilter('all');
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gold-hairline shadow-[0_-4px_20px_rgba(0,0,0,0.04)] px-2 py-1.5"
      id="mobile-bottom-navigation"
    >
      <div className="grid grid-cols-5 items-center justify-around">
        {/* 1. Home */}
        <button
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-colors relative ${
            activeView === 'home' ? 'text-[#141414] font-serif font-bold' : 'text-gray-500'
          }`}
          aria-label="Home"
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {activeView === 'home' && (
              <motion.span 
                layoutId="bottom-nav-active"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#8A6D1F]"
              />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-sans">{t('home')}</span>
        </button>

        {/* 2. Shop / Catalog */}
        <button
          onClick={handleShopClick}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-colors relative ${
            activeView === 'shop' ? 'text-[#141414] font-serif font-bold' : 'text-gray-500'
          }`}
          aria-label="Shop Catalog"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            {activeView === 'shop' && (
              <motion.span 
                layoutId="bottom-nav-active"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#8A6D1F]"
              />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-sans">{t('shop')}</span>
        </button>

        {/* 3. WhatsApp Direct Order Channel */}
        <a
          href="https://wa.me/923364300592?text=Assalam-o-Alaikum%20Trandy%20Libas!%20I%20would%20like%20to%20place%20an%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-1 text-emerald-600 transition-transform active:scale-95"
          aria-label="Order on WhatsApp"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md -mt-3 ring-2 ring-white">
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5 text-emerald-700">WhatsApp</span>
        </a>

        {/* 4. Wishlist */}
        <button
          onClick={() => {
            setActiveView('wishlist');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-colors relative ${
            activeView === 'wishlist' ? 'text-[#141414] font-serif font-bold' : 'text-gray-500'
          }`}
          aria-label="Wishlist"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#8A6D1F] text-[#8A6D1F]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#141414] text-[#F2B705] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
            {activeView === 'wishlist' && (
              <motion.span 
                layoutId="bottom-nav-active"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#8A6D1F]"
              />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-sans">{t('wishlist')}</span>
        </button>

        {/* 5. Cart Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-1 text-gray-700 transition-colors relative"
          aria-label="View Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#141414]" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-2 bg-[#F2B705] text-[#141414] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
              >
                {cartCount}
              </motion.span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-sans">{t('cart')}</span>
        </button>
      </div>
    </div>
  );
};
