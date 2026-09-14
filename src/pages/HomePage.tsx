import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CityDeliveryChecker } from '../components/CityDeliveryChecker';
import { UgcWall } from '../components/UgcWall';
import { SizeFitQuizModal } from '../components/SizeFitQuizModal';
import { SOCIAL_POSTS } from '../data/socialFeed';
import { 
  ShoppingBag, 
  MessageCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Copy, 
  Play, 
  Instagram, 
  Scissors,
  Ruler,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Eye,
  PartyPopper
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const { 
    products, 
    setActiveView, 
    setShopCategoryFilter, 
    setShopGenderFilter,
    setShopStitchFilter,
    openWhatsAppGeneral,
    showToast,
    navigateToProduct,
    navigateToArticle,
    lookbookArticles,
    setIsSizeQuizOpen,
    t
  } = useShop();

  const [activeGenderTab, setActiveGenderTab] = useState<'all' | 'ladies' | 'mens' | 'kids'>('all');
  const [newsletterPhone, setNewsletterPhone] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Filter products for the trending grid based on gender tab
  const trendingProducts = products.filter((p) => {
    if (activeGenderTab === 'all') return p.isTrending || p.isBestSeller;
    return p.gender === activeGenderTab || (activeGenderTab === 'ladies' && p.category === 'clothing' && !p.gender);
  }).slice(0, 8);

  const heroSpotlightProduct = products.find((p) => p.slug === 'festive-stitched-3-piece-organza-lawn-suit-ruby-crimson') || products[0];

  const handleShopCategory = (gender?: string, stitch?: string, category?: string) => {
    if (gender) setShopGenderFilter(gender as any);
    else setShopGenderFilter('all');

    if (stitch) setShopStitchFilter(stitch as any);
    else setShopStitchFilter('all');

    if (category) setShopCategoryFilter(category);
    else setShopCategoryFilter('all');

    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('TREND10');
    showToast('Promo code TREND10 copied! 10% off orders above Rs. 2,500', 'success');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterPhone.trim()) {
      setNewsletterSuccess(true);
      showToast('🎉 Welcome to Trendy Bazaar Club! Use code TREND10 at checkout', 'success');
    }
  };

  // Story Highlights Data (Pakistani Mobile Shoppers favorite pattern)
  const STORY_CIRCLES = [
    {
      id: 'ladies-pret',
      title: 'Ladies Pret',
      image: 'https://images.unsplash.com/photo-1721324807072-784ab8ddf166?w=300&auto=format&fit=crop&q=80',
      action: () => handleShopCategory('ladies', 'stitched')
    },
    {
      id: 'ladies-unstitched',
      title: 'Swiss Lawn 3-Pc',
      image: 'https://images.unsplash.com/photo-1733470324488-d0e10d014d80?w=300&auto=format&fit=crop&q=80',
      action: () => handleShopCategory('ladies', 'unstitched')
    },
    {
      id: 'mens-boski',
      title: '6-Pound Boski',
      image: 'https://images.unsplash.com/photo-1619043518800-7f14be467dca?w=300&auto=format&fit=crop&q=80',
      action: () => handleShopCategory('mens', 'unstitched')
    },
    {
      id: 'mens-kurta',
      title: "Men's Kurta",
      image: 'https://images.unsplash.com/photo-1723051948247-01e16b6a1481?w=300&auto=format&fit=crop&q=80',
      action: () => handleShopCategory('mens', 'stitched')
    },
    {
      id: 'kids-punjabi',
      title: 'Kids Punjabi',
      image: 'https://images.unsplash.com/photo-1639563853019-779fb4e41844?w=300&auto=format&fit=crop&q=80',
      action: () => handleShopCategory('kids')
    },
    {
      id: 'anti-tarnish',
      title: '18K Jewelry',
      image: 'https://images.unsplash.com/photo-1655707063513-a08dad26440e?w=300&auto=format&fit=crop&q=80',
      action: () => handleShopCategory(undefined, undefined, 'accessories')
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 md:pb-16" id="home-page-container">
      {/* 0. INSTAGRAM STORIES-STYLE CATEGORY ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center gap-3.5 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {STORY_CIRCLES.map((story) => (
            <button
              key={story.id}
              onClick={story.action}
              className="flex flex-col items-center shrink-0 group focus:outline-none"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#9C7A28] via-[#D4AF37] to-[#141414] group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full p-0.5 bg-white">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#141414] mt-1.5 whitespace-nowrap group-hover:text-[#9C7A28] transition-colors">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F9F6F0] pt-6 sm:pt-12 pb-12 sm:pb-20 border-b border-gold-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Refined Editorial Copy */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left z-10"
            >
              {/* Promo Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white border border-gold-hairline px-4 py-1.5 rounded-full mx-auto lg:mx-0 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#8A6D1F] animate-pulse"></span>
                <span className="text-xs font-serif font-bold text-[#141414]">
                  Spring/Summer Sartorial '26
                </span>
                <span className="text-gray-300">•</span>
                <button
                  onClick={handleCopyCode}
                  className="text-[11px] font-bold text-[#8A6D1F] hover:text-[#141414] flex items-center gap-1 transition-colors"
                >
                  <span>CODE: TREND10</span>
                  <Copy className="w-3 h-3" />
                </button>
              </div>

              {/* Headline with Serif Authority */}
              <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#141414] leading-[1.12] tracking-tight">
                Authentic Pakistani Craft,{' '}
                <span className="italic font-normal text-[#8A6D1F]">
                  Tailored to Perfection.
                </span>
              </h1>

              {/* Specific, Non-Generic Brand Narrative */}
              <p className="text-sm sm:text-base text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Curated 3-piece Swiss Lawn, pure 6-pound heavy Boski silk from Chiniot, and anti-tarnish PVD jewelry. Each unstitched piece can be custom-stitched by our Lahore master darzis and delivered with nationwide Cash on Delivery.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => handleShopCategory()}
                  id="hero-shop-now-btn"
                  className="w-full sm:w-auto px-8 py-4 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs rounded-full flex items-center justify-center gap-2.5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-[#F2B705]" />
                  <span>{t('shopNow')}</span>
                </button>

                <button
                  onClick={() => openWhatsAppGeneral('Assalam-o-Alaikum Trendy Bazaar! I would like to see the current lawn & boski stock.')}
                  id="hero-whatsapp-btn"
                  className="w-full sm:w-auto px-7 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>{t('orderOnWhatsApp')}</span>
                </button>

                <button
                  onClick={() => setIsSizeQuizOpen(true)}
                  className="w-full sm:w-auto px-5 py-4 bg-white hover:bg-[#F9F6F0] text-[#141414] border border-gold-hairline font-serif font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Ruler className="w-3.5 h-3.5 text-[#8A6D1F]" />
                  <span>{t('sizeFinder')}</span>
                </button>
              </div>

              {/* Real Operational Guarantees */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Cash on Delivery (COD) Nationwide</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Doorstep 7-Day Size Swap</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#8A6D1F]" />
                  <span>Optional Custom Tailoring (+Rs. 1,450)</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Visual Masterpiece */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Main Visual */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1721324807072-784ab8ddf166?w=900&auto=format&fit=crop&q=80"
                    alt="Pakistani Lawn Pret by Trendy Bazaar"
                    className="w-full h-[400px] sm:h-[480px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#F2B705] bg-[#141414]/90 px-2.5 py-0.5 rounded-full w-fit mb-2">
                      Masterpiece Collection
                    </span>
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
                      Ruby Crimson 3-Pc Lawn
                    </h3>
                    <p className="text-xs text-gray-200 mt-0.5">
                      With Organza Scalloped Dupatta & Hand-Set Sequins
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                      <span className="text-sm font-serif font-bold text-[#F2B705]">
                        Rs. 4,950 PKR
                      </span>
                      <button
                        onClick={() => navigateToProduct(heroSpotlightProduct.slug)}
                        className="py-2 px-4 bg-white hover:bg-gray-100 text-[#141414] font-serif font-bold text-xs rounded-full shadow-sm transition-all"
                      >
                        Inspect Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Badge: Boski Silk */}
                <div 
                  onClick={() => navigateToProduct('mens-pure-royal-boski-silk-unstitched-suit')}
                  className="absolute -top-3 -left-3 sm:-left-6 bg-white p-3 rounded-2xl shadow-xl border border-gold-hairline flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                >
                  <img
                    src="https://images.unsplash.com/photo-1619043518800-7f14be467dca?w=200&auto=format&fit=crop&q=80"
                    alt="Royal Boski Silk"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-[9px] font-bold text-[#8A6D1F] uppercase tracking-wider">Chiniot Weave</div>
                    <div className="text-xs font-serif font-bold text-[#141414]">6-Pound Boski Silk</div>
                    <div className="text-[11px] font-bold text-gray-700">Rs. 4,850</div>
                  </div>
                </div>

                {/* Floating Badge: Social Proof */}
                <div className="absolute -bottom-3 -right-2 sm:-right-4 bg-[#141414] text-white p-3 rounded-2xl shadow-xl border border-gold-hairline flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#8A6D1F]/30 border border-gold-hairline text-[#F2B705] flex items-center justify-center font-serif font-bold text-xs">
                    50k+
                  </div>
                  <div>
                    <div className="text-xs font-serif font-bold text-white">Patrons Nationwide</div>
                    <div className="text-[10px] text-gray-400">@trendybazaar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ASYMMETRICAL BENTO BOX: CATEGORIES & CURATED DEPARTMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="category-bento-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8A6D1F] uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-[#F2B705]" />
              <span>Curation by Fabric & Occasion</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#141414] mt-1">
              Explore Our Design Guilds
            </h2>
          </div>
          <button
            onClick={() => handleShopCategory()}
            className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#8A6D1F] hover:text-[#141414] transition-colors self-start sm:self-auto"
          >
            <span>Browse Complete Catalog ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Main Feature: Ladies Pret & Unstitched (Span 7 cols) */}
          <div
            onClick={() => handleShopCategory('ladies')}
            className="md:col-span-7 group relative rounded-3xl overflow-hidden min-h-[340px] sm:min-h-[440px] bg-[#141414] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gold-hairline"
          >
            <img
              src="https://images.unsplash.com/photo-1721324807072-784ab8ddf166?w=1000&auto=format&fit=crop&q=80"
              alt="Ladies Pakistani Lawn & Pret"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-85 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2B705] mb-1">
                Swiss Lawn • Chikankari • Pret & Unstitched
              </span>
              <h3 className="font-serif font-black text-2xl sm:text-3xl text-white mb-2">
                Ladies Festive & Daily Pret
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-md mb-4 leading-relaxed font-sans">
                Hand-embroidered organza dupattas, breathable Swiss Lawn, and ready-to-wear kurtis designed for warm Pakistani weather.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-serif font-bold text-[#F2B705] group-hover:underline">
                <span>View Ladies Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

          {/* Right Column Stack (Span 5 cols) */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6">
            {/* Tile 2: Men's Pure Boski & Kurta */}
            <div
              onClick={() => handleShopCategory('mens')}
              className="group relative rounded-3xl overflow-hidden min-h-[200px] sm:min-h-[210px] bg-[#141414] cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border border-gold-hairline"
            >
              <img
                src="https://images.unsplash.com/photo-1723051948247-01e16b6a1481?w=700&auto=format&fit=crop&q=80"
                alt="Men's Boski Silk & Kurtas"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-85 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2B705] mb-0.5">
                  6-Pound Silk & Egyptian Latha
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                  Men's Kurta & Boski Suits
                </h3>
                <span className="text-xs text-gray-300 mt-0.5 inline-flex items-center gap-1 group-hover:text-white">
                  <span>Explore Men's Wear</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Tile 3: Kids Punjabi & Accessories Split Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Kids Punjabi */}
              <div
                onClick={() => handleShopCategory('kids')}
                className="group relative rounded-3xl overflow-hidden min-h-[190px] bg-[#141414] cursor-pointer shadow-sm hover:shadow-lg transition-all border border-gold-hairline"
              >
                <img
                  src="https://images.unsplash.com/photo-1639563853019-779fb4e41844?w=500&auto=format&fit=crop&q=80"
                  alt="Kids Punjabi Outfits"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[9px] font-bold text-[#F2B705] uppercase">Festive</span>
                  <h4 className="font-serif font-bold text-sm text-white leading-tight mt-0.5">
                    Kids Punjabi
                  </h4>
                  <span className="text-[10px] text-gray-300 mt-1">Ghararas & Kurtas</span>
                </div>
              </div>

              {/* 18K Anti-Tarnish Jewelry */}
              <div
                onClick={() => handleShopCategory(undefined, undefined, 'accessories')}
                className="group relative rounded-3xl overflow-hidden min-h-[190px] bg-[#141414] cursor-pointer shadow-sm hover:shadow-lg transition-all border border-gold-hairline"
              >
                <img
                  src="https://images.unsplash.com/photo-1655707063513-a08dad26440e?w=500&auto=format&fit=crop&q=80"
                  alt="Anti-Tarnish Jewelry"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[9px] font-bold text-[#F2B705] uppercase">PVD Gold</span>
                  <h4 className="font-serif font-bold text-sm text-white leading-tight mt-0.5">
                    18K Jewelry
                  </h4>
                  <span className="text-[10px] text-gray-300 mt-1">Anti-Tarnish Wear</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BESTSELLERS & TRENDING WITH DEPARTMENT TOGGLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="bestsellers-section">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8A6D1F]">
                Trending Across Pakistan
              </span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#141414] mt-1">
              Curated Bestsellers
            </h2>
          </div>

          {/* Department Tabs */}
          <div className="flex flex-wrap gap-1 bg-[#F9F6F0] p-1 rounded-full border border-gold-hairline">
            {[
              { id: 'all', label: 'All Catalog' },
              { id: 'ladies', label: 'Ladies Pret' },
              { id: 'mens', label: "Men's Wear" },
              { id: 'kids', label: 'Kids Punjabi' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGenderTab(tab.id as any)}
                className={`py-1.5 px-4 text-xs font-serif font-bold rounded-full transition-all ${
                  activeGenderTab === tab.id
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => handleShopCategory()}
            className="inline-flex items-center gap-2 py-3.5 px-8 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs rounded-full shadow-md transition-all active:scale-95"
          >
            <span>Explore Entire Collection</span>
            <ArrowRight className="w-4 h-4 text-[#F2B705]" />
          </button>
        </div>
      </section>

      {/* 4. BESPOKE DARZI CONCIERGE & TIMELINE ESTIMATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141414] text-white rounded-3xl p-6 sm:p-10 border border-gold-hairline relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#8A6D1F]/30 border border-gold-hairline text-[#F2B705] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Lahore Darzi Guild</span>
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  Bespoke Stitching Service
                </span>
              </div>

              <h3 className="font-serif font-black text-2xl sm:text-4xl text-white leading-tight">
                Order Unstitched Fabric, We'll Stitch It to Your Measurements.
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl font-sans">
                Skip crowded tailor markets in Anarkali or Tariq Road. Choose any 3-piece unstitched lawn or Boski silk, select <strong>"Custom Stitching (+Rs. 1,450)"</strong>, and our seasoned Lahore ustaads will craft it with overlocking, organza finishing, and trouser lace insets.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2 text-xs">
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-gray-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F2B705]" />
                  <span>Overlock & Edge Piping Included</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-gray-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F2B705]" />
                  <span>Standard Sizes (XS–XL) or Custom Inches</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-gray-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F2B705]" />
                  <span>3-4 Days Fast Tailoring Dispatch</span>
                </span>
              </div>
            </div>

            {/* City Delivery Checker Box */}
            <div className="lg:col-span-4 bg-white text-[#141414] p-5 rounded-2xl shadow-xl border border-gold-hairline">
              <h4 className="font-serif font-bold text-sm text-[#141414] mb-2">
                Check Delivery Timeline to Your City
              </h4>
              <CityDeliveryChecker />
            </div>
          </div>
        </div>
      </section>

      {/* 5. USER-GENERATED CONTENT (UGC) WALL */}
      <UgcWall />

      {/* 6. STYLE JOURNAL & LOOKBOOK PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="lookbook-teaser-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8A6D1F] uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5 text-[#F2B705]" />
              <span>Sartorial Journals</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#141414] mt-1">
              Style Notes & Fabric Guides
            </h2>
          </div>
          <button
            onClick={() => {
              navigateToArticle('');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#8A6D1F] hover:text-[#141414] transition-colors self-start sm:self-auto"
          >
            <span>Read All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lookbookArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigateToArticle(article.slug)}
              className="group bg-white rounded-3xl overflow-hidden border border-gold-hairline hover:border-gold-subtle shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#141414]/90 text-[#F2B705] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {article.readTime}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    {article.publishedDate}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#141414] group-hover:text-[#8A6D1F] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs font-serif font-bold text-[#8A6D1F]">
                <span>Read Full Journal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AS SEEN ON TIKTOK & REELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="social-proof-feed">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 bg-[#F9F6F0] px-3.5 py-1.5 rounded-full text-xs font-serif font-bold text-[#8A6D1F] border border-gold-hairline mb-2">
            <Instagram className="w-3.5 h-3.5 text-[#8A6D1F]" />
            <span>@trendybazaar Community</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#141414]">
            Unboxings on TikTok & Reels
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-sans">
            Real customer parcels arriving across Lahore, Karachi & Islamabad.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {SOCIAL_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                if (post.taggedProductSlug) {
                  navigateToProduct(post.taggedProductSlug);
                }
              }}
              className="group relative rounded-2xl overflow-hidden aspect-9/14 bg-[#141414] cursor-pointer shadow-xs hover:shadow-lg transition-all border border-gold-hairline"
            >
              <img
                src={post.thumbnailUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-3 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[#F2B705]">
                    {post.platform}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                    <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-white line-clamp-2 leading-snug mb-1.5">
                    {post.caption}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-gray-300">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. VIP CLUB & FIRST-ORDER SAVINGS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" id="discount-newsletter-banner">
        <div className="relative rounded-3xl bg-[#141414] text-white p-7 sm:p-12 overflow-hidden shadow-2xl border border-gold-hairline">
          <div className="relative z-10 max-w-xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-[#8A6D1F]/30 border border-gold-hairline text-[#F2B705] text-xs font-serif font-bold px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRENDY BAZAAR PATRON PRIVILEGES</span>
            </span>

            <h2 className="font-serif font-black text-2xl sm:text-4xl leading-tight text-white">
              Enjoy <span className="text-[#F2B705]">10% Off</span> Your Welcome Order
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
              Enter your WhatsApp number to receive private flash access, restock alerts, and have coupon <strong>TREND10</strong> saved to your chat!
            </p>

            {newsletterSuccess ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-2xl text-xs text-emerald-200 flex items-center justify-center gap-2">
                <PartyPopper className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Shukriya! Code <strong>TREND10</strong> is active. Enter at checkout for 10% off orders above Rs. 2,500.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  required
                  placeholder="Enter WhatsApp # (03XX-XXXXXXX)"
                  value={newsletterPhone}
                  onChange={(e) => setNewsletterPhone(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 focus:border-[#F2B705] focus:bg-white focus:text-black rounded-full py-3.5 px-5 text-xs sm:text-sm outline-none transition-all placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="py-3.5 px-7 bg-[#F2B705] hover:bg-[#D9A404] text-[#141414] font-serif font-bold text-xs sm:text-sm rounded-full transition-transform active:scale-95 shadow-md shrink-0"
                >
                  Claim Code
                </button>
              </form>
            )}

            <p className="text-[10px] text-gray-400">
              No spam, ever. Only authentic Pakistani fashion updates and genuine discounts.
            </p>
          </div>
        </div>
      </section>

      {/* Size Quiz Modal */}
      <SizeFitQuizModal />
    </div>
  );
};
