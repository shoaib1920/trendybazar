import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Logo } from './Logo';
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
  Settings2,
  Sparkles,
  Scissors,
  Globe,
  BookOpen,
  Ruler,
  Award,
  Shirt,
  Baby,
  Gem,
  PartyPopper,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    setShopCategoryFilter,
    setShopGenderFilter,
    setShopStitchFilter,
    searchQuery,
    setSearchQuery,
    showToast,
    language,
    toggleLanguage,
    loyaltyPoints,
    setIsSizeQuizOpen,
    t
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Flash-sale countdown: resets daily at midnight local time
  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = Math.max(0, midnight.getTime() - now.getTime());
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  const [saleCountdown, setSaleCountdown] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setSaleCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('TREND10');
    setCodeCopied(true);
    showToast('Promo code TREND10 copied! Use at checkout on orders above Rs. 2,500', 'success');
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const handleNavClick = (view: 'home' | 'shop' | 'about' | 'contact' | 'track' | 'admin' | 'lookbook', gender?: string, stitch?: string, category?: string) => {
    if (gender) setShopGenderFilter(gender as any);
    else setShopGenderFilter('all');

    if (stitch) setShopStitchFilter(stitch as any);
    else setShopStitchFilter('all');

    if (category) setShopCategoryFilter(category);
    else setShopCategoryFilter('all');

    setActiveView(view as any);
    setIsMobileMenuOpen(false);
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
            <span>Get <strong>10% OFF</strong> your first order</span>
          </span>
          <span className="hidden sm:inline text-gray-500">•</span>
          <span className="hidden md:inline text-gray-300">Min. order Rs. 2,500</span>
          <button
            onClick={handleCopyCode}
            id="copy-trend10-btn"
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
                <span>CODE: TREND10</span>
                <Copy className="w-2.5 h-2.5" />
              </>
            )}
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-5 text-gray-300 text-[11px]">
          {/* Flash Sale Countdown */}
          <span className="flex items-center gap-1.5 text-[#F2B705] font-serif font-bold tabular-nums" title="Today's promo pricing resets at midnight">
            <Timer className="w-3.5 h-3.5" />
            <span>Sale ends in {saleCountdown}</span>
          </span>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded-full text-[11px]"
            title="Switch Language / زبان تبدیل کریں"
          >
            <Globe className="w-3 h-3 text-[#F2B705]" />
            <span className="font-semibold">{language === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Loyalty Balance */}
          <div className="flex items-center gap-1 text-[#F2B705] font-serif font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{loyaltyPoints} Rewards Pts</span>
          </div>

          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#F2B705]" />
            Free delivery over Rs. 3,500 nationwide
          </span>

          <button
            onClick={() => handleNavClick('track')}
            className="hover:text-[#F2B705] transition-colors underline underline-offset-2"
          >
            Track Parcel
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            title="Store Admin Panel"
          >
            <Settings2 className="w-3 h-3" />
            <span>Admin</span>
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
          <nav className="hidden lg:flex items-center gap-6 text-xs font-serif font-bold text-[#141414]">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-[#8A6D1F] py-2 border-b-2 ${
                activeView === 'home' ? 'border-[#8A6D1F] text-[#141414]' : 'border-transparent text-gray-700'
              }`}
            >
              {t('home')}
            </button>
            <button
              onClick={() => handleNavClick('shop', 'ladies')}
              className="transition-colors hover:text-[#8A6D1F] py-2 border-b-2 border-transparent text-gray-700 flex items-center gap-1"
            >
              <span>{t('ladiesPret')}</span>
              <span className="text-[9px] bg-amber-100 text-[#8A6D1F] px-1.5 py-0.2 rounded font-sans font-bold">New</span>
            </button>
            <button
              onClick={() => handleNavClick('shop', 'mens')}
              className="transition-colors hover:text-[#8A6D1F] py-2 border-b-2 border-transparent text-gray-700"
            >
              {t('mensKurta')}
            </button>
            <button
              onClick={() => handleNavClick('shop', 'kids')}
              className="transition-colors hover:text-[#8A6D1F] py-2 border-b-2 border-transparent text-gray-700"
            >
              {t('kidsPunjabi')}
            </button>
            <button
              onClick={() => handleNavClick('shop', undefined, undefined, 'accessories')}
              className="transition-colors hover:text-[#8A6D1F] py-2 border-b-2 border-transparent text-gray-700"
            >
              Jewelry & Bags
            </button>
            <button
              onClick={() => handleNavClick('lookbook')}
              className={`transition-colors hover:text-[#8A6D1F] py-2 border-b-2 ${
                activeView === 'lookbook' ? 'border-[#8A6D1F] text-[#141414]' : 'border-transparent text-gray-700'
              } flex items-center gap-1`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#8A6D1F]" />
              <span>{t('lookbook')}</span>
            </button>
            <button
              onClick={() => setIsSizeQuizOpen(true)}
              className="text-[#8A6D1F] hover:text-[#141414] py-2 flex items-center gap-1"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{t('sizeFinder')}</span>
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-56">
              <input
                type="text"
                placeholder={language === 'ur' ? 'تلاش کریں...' : 'Search lawn, boski...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-gold-hairline focus:border-[#9C7A28] focus:bg-white text-xs rounded-full py-2 pl-9 pr-3 outline-none transition-all placeholder:text-gray-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>

            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-1.5 text-xs font-serif font-bold text-[#8A6D1F] border border-gold-hairline rounded-full lg:hidden"
              title="Language"
            >
              {language === 'en' ? 'اردو' : 'EN'}
            </button>

            {/* Mobile Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
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
                placeholder="Search lawn suits, kurtas, jewelry, kids..."
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
                <div className="p-3 bg-amber-50 border-b border-gold-hairline flex items-center justify-between text-xs">
                  <span className="font-serif font-bold text-[#141414] flex items-center gap-1.5">
                    <PartyPopper className="w-3.5 h-3.5 text-[#8A6D1F]" />
                    <span>10% Off Orders &gt; Rs. 2,500</span>
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="text-[10px] font-serif font-bold bg-[#8A6D1F] text-white px-2 py-0.5 rounded-full"
                  >
                    TREND10
                  </button>
                </div>

                {/* Main Navigation Links */}
                <div className="p-4 space-y-1">
                  <button
                    onClick={() => handleNavClick('home')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F9F6F0] font-serif font-bold text-sm text-[#141414]"
                  >
                    {t('home')}
                  </button>
                  <button
                    onClick={() => handleNavClick('shop')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F9F6F0] font-serif font-bold text-sm text-[#141414] flex items-center justify-between"
                  >
                    <span>{t('shop')}</span>
                    <span className="text-[10px] bg-[#141414] text-white px-2 py-0.5 rounded-full font-sans">Full Catalog</span>
                  </button>

                  {/* Dedicated Pakistani Clothing Sections */}
                  <div className="pt-2 pb-1 border-t border-gold-hairline space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 px-3 uppercase tracking-wider">
                      Clothing Departments
                    </span>
                    <button
                      onClick={() => handleNavClick('shop', 'ladies')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs font-serif font-bold text-gray-800 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Shirt className="w-3.5 h-3.5 text-[#8A6D1F]" />
                        <span>{t('ladiesPret')}</span>
                      </span>
                      <span className="text-[10px] text-[#8A6D1F] font-bold">Popular</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('shop', 'ladies', 'unstitched')}
                      className="w-full text-left px-6 py-1.5 rounded-xl hover:bg-[#F9F6F0] text-xs text-gray-600 flex items-center gap-1.5"
                    >
                      <Scissors className="w-3 h-3 text-[#8A6D1F]" />
                      <span>Unstitched 3-Pc Lawn</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('shop', 'mens')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs font-serif font-bold text-gray-800 flex items-center gap-2"
                    >
                      <Shirt className="w-3.5 h-3.5 text-[#8A6D1F]" />
                      <span>{t('mensKurta')}</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('shop', 'kids')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs font-serif font-bold text-gray-800 flex items-center gap-2"
                    >
                      <Baby className="w-3.5 h-3.5 text-[#8A6D1F]" />
                      <span>{t('kidsPunjabi')}</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('shop', undefined, undefined, 'accessories')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs font-serif font-bold text-gray-800 flex items-center gap-2"
                    >
                      <Gem className="w-3.5 h-3.5 text-[#8A6D1F]" />
                      <span>Jewellery & Accessories</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('lookbook')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs font-serif font-bold text-[#8A6D1F] flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{t('lookbook')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSizeQuizOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs font-serif font-bold text-[#8A6D1F] flex items-center gap-2"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{t('sizeFinder')}</span>
                    </button>
                  </div>

                  {/* Brand & Support */}
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
                      Our Brand Story
                    </button>
                    <button
                      onClick={() => handleNavClick('contact')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs font-serif font-bold text-gray-700"
                    >
                      Help & FAQs
                    </button>
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] text-xs text-gray-500 flex items-center gap-2"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      <span>Store Admin Panel</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom WhatsApp Help Button */}
              <div className="p-4 border-t border-gold-hairline bg-[#F9F6F0] space-y-2">
                <a
                  href="https://wa.me/923364300592?text=Assalam-o-Alaikum%20Trendy%20Bazaar!%20Need%20help%20with%20an%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Chat on WhatsApp (+92 336 4300592)</span>
                </a>
                <p className="text-[10px] text-center text-gray-500">
                  Cash on Delivery (COD) Nationwide • 2-4 Days Delivery
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
