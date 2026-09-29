import React, { useMemo, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { WATCH_STYLES } from '../data/categories';
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Watch,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const HERO_SLIDES = [
  { type: 'image' as const },
  { type: 'video' as const, src: '/hero-video-2.mp4' }
];

export const HomePage: React.FC = () => {
  const { products, setActiveView, setShopCategoryFilter, setShopSubCategoryFilter, openWhatsAppGeneral, t } = useShop();

  const heroProduct = products.find((p) => p.slug === 'buds-pro-3-true-wireless-earbuds') || products[0];
  const watchProducts = products.filter((p) => p.category === 'accessories');

  const [heroSlide, setHeroSlide] = useState(0);
  const [isHeroMuted, setIsHeroMuted] = useState(true);

  const goToSlide = (index: number) => {
    setHeroSlide((index + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const [activeTab, setActiveTab] = useState<'all' | 'electronics' | 'accessories'>('all');
  const tabbedProducts = useMemo(
    () => (activeTab === 'all' ? products : products.filter((p) => p.category === activeTab)),
    [products, activeTab]
  );

  const handleShopNow = () => {
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryTile = (category: string, subCategory?: string) => {
    setShopCategoryFilter(category);
    setShopSubCategoryFilter(subCategory || 'all');
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 md:pb-12" id="home-page-container">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center lg:text-left space-y-5"
          >
            <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#141414] leading-tight">
              Earbuds & Watches, <span className="text-[#8A6D1F]">Fair Prices.</span>
            </h1>
            <p className="text-sm text-gray-500">Cash on Delivery • Rs. 150 Nationwide</p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={handleShopNow}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#F2B705]" />
                <span>Shop Now</span>
              </button>
              <button
                onClick={() => openWhatsAppGeneral('Assalam-o-Alaikum Trendy Bazar!')}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>{t('orderOnWhatsApp')}</span>
              </button>
            </div>
          </motion.div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gold-hairline aspect-4/3 lg:aspect-square max-w-md mx-auto w-full bg-black">
            <AnimatePresence mode="wait">
              {heroSlide === 0 ? (
                <motion.img
                  key="hero-image"
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <motion.video
                  key="hero-video"
                  src={HERO_SLIDES[1].src}
                  autoPlay
                  muted={isHeroMuted}
                  loop
                  playsInline
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover"
                />
              )}
            </AnimatePresence>

            {/* Slide Arrows */}
            <button
              onClick={() => goToSlide(heroSlide - 1)}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white backdrop-blur-sm flex items-center justify-center shadow-md transition-all active:scale-90 z-10"
            >
              <ChevronLeft className="w-5 h-5 text-[#141414]" />
            </button>
            <button
              onClick={() => goToSlide(heroSlide + 1)}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white backdrop-blur-sm flex items-center justify-center shadow-md transition-all active:scale-90 z-10"
            >
              <ChevronRight className="w-5 h-5 text-[#141414]" />
            </button>

            {/* Mute Toggle — video slide only */}
            {heroSlide === 1 && (
              <button
                onClick={() => setIsHeroMuted((m) => !m)}
                aria-label={isHeroMuted ? 'Unmute video' : 'Mute video'}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 hover:bg-white backdrop-blur-sm flex items-center justify-center shadow-md transition-all active:scale-90 z-10"
              >
                {isHeroMuted ? (
                  <VolumeX className="w-4 h-4 text-[#141414]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#141414]" />
                )}
              </button>
            )}

            {/* Slide Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    heroSlide === i ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP — icons only */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 bg-[#F9F6F0] border border-gold-hairline rounded-3xl p-5 sm:p-6 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <Truck className="w-5 h-5 text-[#8A6D1F]" />
            <span className="text-[11px] sm:text-xs font-semibold text-[#141414]">COD Nationwide</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RotateCcw className="w-5 h-5 text-[#8A6D1F]" />
            <span className="text-[11px] sm:text-xs font-semibold text-[#141414]">7-Day Exchange</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-[#8A6D1F]" />
            <span className="text-[11px] sm:text-xs font-semibold text-[#141414]">Quality Checked</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Award className="w-5 h-5 text-[#8A6D1F]" />
            <span className="text-[11px] sm:text-xs font-semibold text-[#141414]">1-Year Warranty</span>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif font-black text-xl sm:text-2xl text-[#141414] mb-5">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Earbuds Tile */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => handleCategoryTile('electronics')}
            className="group relative rounded-3xl overflow-hidden border border-gold-hairline cursor-pointer aspect-[16/10] bg-[#141414]"
          >
            <img
              src={heroProduct.images[0]}
              alt="Shop Earbuds"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[#F2B705] text-xs font-bold mb-1">
                  <Headphones className="w-4 h-4" />
                  <span>Audio</span>
                </span>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-white">Earbuds</h3>
              </div>
              <span className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-[#F2B705] transition-colors shrink-0">
                <ArrowRight className="w-4 h-4 text-[#141414]" />
              </span>
            </div>
          </motion.div>

          {/* Watches Tile */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => handleCategoryTile('accessories')}
            className="group relative rounded-3xl overflow-hidden border border-gold-hairline cursor-pointer aspect-[16/10] bg-[#141414]"
          >
            <img
              src={watchProducts[0]?.images[0]}
              alt="Shop Watches"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[#F2B705] text-xs font-bold mb-1">
                  <Watch className="w-4 h-4" />
                  <span>Timepieces</span>
                </span>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-white">Watches</h3>
              </div>
              <span className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-[#F2B705] transition-colors shrink-0">
                <ArrowRight className="w-4 h-4 text-[#141414]" />
              </span>
            </div>
          </motion.div>
        </div>

        {/* Watch Style Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {WATCH_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => handleCategoryTile('accessories', style.id)}
              className="py-2 px-4 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:border-[#8A6D1F] hover:text-[#8A6D1F] transition-colors"
            >
              {style.label} Watches
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS — tabbed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="font-serif font-black text-xl sm:text-2xl text-[#141414]">
            Featured Products
          </h2>
          <div className="flex items-center gap-1.5 bg-[#F7F3EC] rounded-full p-1">
            {[
              { id: 'all' as const, label: 'All' },
              { id: 'electronics' as const, label: 'Earbuds' },
              { id: 'accessories' as const, label: 'Watches' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tabbedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={handleShopNow}
            className="inline-flex items-center gap-2 px-7 py-3 bg-white border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-serif font-bold text-xs rounded-full transition-all active:scale-95"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
