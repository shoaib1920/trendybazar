import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { discountAmountText, discountLabel } from '../lib/discountsService';
import { Logo } from './Logo';
import { WATCH_STYLES } from '../data/categories';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Truck,
  MessageCircle,
  Copy,
  Check,
  PartyPopper,
  Headphones,
  ChevronDown,
  Watch
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    cartCount,
    setIsCartOpen,
    wishlist,
    shopCategoryFilter,
    setShopCategoryFilter,
    setShopSubCategoryFilter,
    searchQuery,
    setSearchQuery,
    showToast,
    setActiveView,
    t,
    featuredDiscount
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isWatchesMenuOpen, setIsWatchesMenuOpen] = useState(false);
  const [isMobileWatchesOpen, setIsMobileWatchesOpen] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!featuredDiscount) return;
    navigator.clipboard.writeText(featuredDiscount.code);
    setCodeCopied(true);
    showToast(`Promo code ${featuredDiscount.code} copied! Use it in your bag for ${discountLabel(featuredDiscount)}`, 'success');
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const handleNavClick = (view: 'home' | 'shop' | 'earbuds' | 'watches' | 'about' | 'contact' | 'track', category?: string, subCategory?: string) => {
    if (category) setShopCategoryFilter(category);
    else setShopCategoryFilter('all');
    setShopSubCategoryFilter(subCategory || 'all');

    setActiveView(view as any);
    setIsMobileMenuOpen(false);
    setIsWatchesMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('shop');
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)]" id="main-header">
      {/* 1. TOP STICKY ANNOUNCEMENT BANNER */}
      <div
        className="bg-[#141414] text-white text-xs py-1.5 sm:py-2 px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-gold-hairline"
        id="top-promo-banner"
      >
        <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 font-medium text-gray-200">
            <span className="w-2 h-2 rounded-full bg-[#8A6D1F] animate-pulse shrink-0"></span>
            <span>Rs. 150 Flat Delivery Nationwide</span>
          </span>
          {featuredDiscount && (
            <>
          <span className="hidden sm:inline text-gray-500">•</span>
          <button
            onClick={handleCopyCode}
            id="copy-welcome5-btn"
            className="inline-flex items-center gap-1 bg-[#8A6D1F] hover:bg-[#9C7A28] text-white font-serif font-bold px-2.5 py-0.5 rounded-full text-[11px] transition-all active:scale-95 shadow-xs"
            title="Click to copy promo code"
          >
            {codeCopied ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <span>CODE: {featuredDiscount.code}</span>
                <Copy className="w-2.5 h-2.5" />
              </>
            )}
          </button>
            </>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-5 text-gray-300 text-[11px]">
          <button
            onClick={() => handleNavClick('track')}
            data-tour="track"
            className="hover:text-[#F2B705] transition-colors underline underline-offset-2"
          >
            Track Parcel
          </button>

        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-btn"
              className="p-2 -ml-2 text-[#141414] hover:bg-[#F9F6F0] rounded-xl lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div
              onClick={() => handleNavClick('home')}
              className="cursor-pointer"
            >
              <Logo size="md" variant="dark" />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav data-tour="categories" className="hidden lg:flex items-center gap-6 text-xs font-serif font-bold text-[#141414]">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-[#8A6D1F] py-2 border-b-2 ${
                activeView === 'home' ? 'border-[#8A6D1F] text-[#141414]' : 'border-transparent text-gray-700'
              }`}
            >
              {t('home')}
            </button>
            <button
              onClick={() => handleNavClick('earbuds', 'electronics')}
              className={`transition-colors hover:text-[#8A6D1F] py-2 border-b-2 flex items-center gap-1.5 ${
                activeView === 'earbuds' ? 'border-[#8A6D1F] text-[#141414]' : 'border-transparent text-gray-700'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-[#8A6D1F]" />
              <span>Earbuds</span>
            </button>
            <div
              className="relative"
              onMouseEnter={() => setIsWatchesMenuOpen(true)}
              onMouseLeave={() => setIsWatchesMenuOpen(false)}
            >
              <button
                onClick={() => handleNavClick('watches', 'accessories')}
                className={`transition-colors hover:text-[#8A6D1F] py-2 border-b-2 flex items-center gap-1 ${
                  activeView === 'watches'
                    ? 'border-[#8A6D1F] text-[#141414]'
                    : 'border-transparent text-gray-700'
                }`}
              >
                <Watch className="w-3.5 h-3.5 text-[#8A6D1F]" />
                <span>Watches</span>
                <ChevronDown className="w-3 h-3 transition-transform" style={{ transform: isWatchesMenuOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              <AnimatePresence>
                {isWatchesMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 pt-2 w-56 z-30"
                  >
                    <div className="bg-white rounded-2xl border border-gold-hairline shadow-xl p-2">
                      <button
                        onClick={() => handleNavClick('watches', 'accessories')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] font-serif font-bold text-xs text-[#141414]"
                      >
                        Shop All Watches
                      </button>
                      <div className="my-1 border-t border-gold-hairline/60" />
                      {WATCH_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => handleNavClick('watches', 'accessories', style.id)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] font-sans text-xs text-gray-700 hover:text-[#141414]"
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors hover:text-[#8A6D1F] py-2 border-b-2 ${
                activeView === 'about' ? 'border-[#8A6D1F] text-[#141414]' : 'border-transparent text-gray-700'
              }`}
            >
              Our Story
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors hover:text-[#8A6D1F] py-2 border-b-2 ${
                activeView === 'contact' ? 'border-[#8A6D1F] text-[#141414]' : 'border-transparent text-gray-700'
              }`}
            >
              Help & FAQs
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} data-tour="search" className="relative hidden md:block w-48 lg:w-56">
              <input
                type="text"
                placeholder="Search earbuds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-gold-hairline focus:border-[#9C7A28] focus:bg-white text-xs rounded-full py-2 pl-9 pr-3 outline-none transition-all placeholder:text-gray-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>

            {/* Mobile Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              data-tour="search"
              className="p-2 text-[#141414] hover:bg-[#F9F6F0] rounded-full md:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => handleNavClick('wishlist' as any)}
              id="wishlist-nav-btn"
              className="relative p-2 text-[#141414] hover:bg-[#F9F6F0] rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#8A6D1F] text-[#8A6D1F]' : 'text-[#141414]'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#141414] text-white text-[10px] font-serif font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              id="cart-nav-btn"
              data-tour="cart"
              className="relative flex items-center gap-2 bg-[#141414] hover:bg-black text-white px-3 sm:px-4 py-2 rounded-full transition-all active:scale-95 shadow-xs"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#F2B705]" />
              <span className="text-xs font-serif font-bold hidden sm:inline">{t('cart')}</span>
              <span className="bg-[#F2B705] text-[#141414] font-serif font-bold text-xs px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="py-2.5 px-1 border-t border-gold-hairline md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search earbuds, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#F9F6F0] border border-gold-hairline focus:border-[#9C7A28] text-xs rounded-full py-2.5 pl-10 pr-4 outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </form>
          </div>
        )}
      </div>

      {/* 3. MOBILE SLIDE-OUT DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="p-4 border-b border-gold-hairline flex items-center justify-between bg-[#F9F6F0]">
                  <Logo size="sm" variant="dark" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-gray-500 hover:text-black rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Promo Strip */}
                {featuredDiscount && (
                  <div className="p-3 bg-amber-50 border-b border-gold-hairline flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#141414] flex items-center gap-1.5">
                      <PartyPopper className="w-3.5 h-3.5 text-[#8A6D1F]" />
                      <span>{discountAmountText(featuredDiscount)} Off Your Order</span>
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="text-[10px] font-serif font-bold bg-[#8A6D1F] text-white px-2 py-0.5 rounded-full"
                    >
                      {featuredDiscount.code}
                    </button>
                  </div>
                )}

                {/* Main Navigation Links */}
                <div className="p-4 space-y-1">
                  <button
                    onClick={() => handleNavClick('home')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F9F6F0] font-serif font-bold text-sm text-[#141414]"
                  >
                    {t('home')}
                  </button>
                  <button
                    onClick={() => handleNavClick('earbuds', 'electronics')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F9F6F0] font-serif font-bold text-sm text-[#141414] flex items-center gap-2"
                  >
                    <Headphones className="w-4 h-4 text-[#8A6D1F]" />
                    <span>Earbuds</span>
                  </button>
                  <button
                    onClick={() => setIsMobileWatchesOpen(!isMobileWatchesOpen)}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F9F6F0] font-serif font-bold text-sm text-[#141414] flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Watch className="w-4 h-4 text-[#8A6D1F]" />
                      <span>Watches</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isMobileWatchesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isMobileWatchesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 space-y-0.5"
                      >
                        <button
                          onClick={() => handleNavClick('watches', 'accessories')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] font-sans text-xs font-bold text-gray-700"
                        >
                          Shop All Watches
                        </button>
                        {WATCH_STYLES.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => handleNavClick('watches', 'accessories', style.id)}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] font-sans text-xs text-gray-700"
                          >
                            {style.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-2 border-t border-gold-hairline space-y-1">
                    <button
                      onClick={() => handleNavClick('track')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs font-serif font-bold text-gray-700 flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4 text-[#8A6D1F]" />
                      <span>Track Delivery</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('about')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs font-serif font-bold text-gray-700"
                    >
                      Our Story
                    </button>
                    <button
                      onClick={() => handleNavClick('contact')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs font-serif font-bold text-gray-700"
                    >
                      Help & FAQs
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom WhatsApp Help Button */}
              <div className="p-4 border-t border-gold-hairline bg-[#F9F6F0] space-y-2">
                <a
                  href="https://wa.me/923364300592?text=Assalam-o-Alaikum%20Trendy%20Bazar!%20Need%20help%20with%20an%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Chat on WhatsApp (+92 336 4300592)</span>
                </a>
                <p className="text-[10px] text-center text-gray-500">
                  Cash on Delivery (COD) Nationwide • Rs. 150 Delivery
                </p>
              </div>
            </motion.div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
