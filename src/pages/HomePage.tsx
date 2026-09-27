import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CityDeliveryChecker } from '../components/CityDeliveryChecker';
import {
  ShoppingBag,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Copy,
  CheckCircle2,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Bluetooth,
  BatteryCharging,
  Droplets,
  Hand,
  PartyPopper
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const {
    products,
    setActiveView,
    setShopCategoryFilter,
    openWhatsAppGeneral,
    showToast,
    navigateToProduct,
    addToCart,
    t
  } = useShop();

  const [newsletterPhone, setNewsletterPhone] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const heroProduct = products.find((p) => p.slug === 'buds-pro-3-true-wireless-earbuds') || products[0];

  const handleShopCategory = (category?: string) => {
    setShopCategoryFilter(category || 'all');
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WELCOME5');
    showToast('Promo code WELCOME5 copied! 5% off your order', 'success');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterPhone.trim()) {
      setNewsletterSuccess(true);
      showToast('🎉 Welcome to Trendy Bazar! Use code WELCOME5 at checkout', 'success');
    }
  };

  const FEATURES = [
    {
      icon: Bluetooth,
      title: 'Bluetooth 5.3',
      desc: 'Stable connection up to 10 meters, auto-pairs on case open'
    },
    {
      icon: BatteryCharging,
      title: '24+ Hours Battery',
      desc: '6 hours per charge, 24+ hours total with the charging case'
    },
    {
      icon: Droplets,
      title: 'IPX4 Splash Resistant',
      desc: 'Safe for workouts, commutes, and light rain'
    },
    {
      icon: Hand,
      title: 'Touch Controls',
      desc: 'Play, skip, answer calls & summon your voice assistant'
    }
  ];

  const otherProducts = products.filter((p) => p.id !== heroProduct.id).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 md:pb-16" id="home-page-container">
      {/* 1. HERO: SINGLE PRODUCT SPOTLIGHT */}
      <section className="relative overflow-hidden bg-[#F9F6F0] pt-6 sm:pt-12 pb-12 sm:pb-20 border-b border-gold-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left z-10"
            >
              {/* Promo Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white border border-gold-hairline px-4 py-1.5 rounded-full mx-auto lg:mx-0 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#8A6D1F] animate-pulse"></span>
                <span className="text-xs font-serif font-bold text-[#141414]">
                  In Stock Now
                </span>
                <span className="text-gray-300">•</span>
                <button
                  onClick={handleCopyCode}
                  className="text-[11px] font-bold text-[#8A6D1F] hover:text-[#141414] flex items-center gap-1 transition-colors"
                >
                  <span>CODE: WELCOME5</span>
                  <Copy className="w-3 h-3" />
                </button>
              </div>

              <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#141414] leading-[1.12] tracking-tight">
                {heroProduct.name},{' '}
                <span className="italic font-normal text-[#8A6D1F]">
                  Now Rs. {heroProduct.price.toLocaleString()}.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                {heroProduct.tagline}. Nationwide Cash on Delivery with a flat Rs. 150 delivery charge — pay when your parcel arrives.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => addToCart(heroProduct)}
                  id="hero-shop-now-btn"
                  className="w-full sm:w-auto px-8 py-4 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs rounded-full flex items-center justify-center gap-2.5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-[#F2B705]" />
                  <span>Add to Bag • Rs. {heroProduct.price.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => openWhatsAppGeneral('Assalam-o-Alaikum Trendy Bazar! I would like to order the Buds Pro 3.')}
                  id="hero-whatsapp-btn"
                  className="w-full sm:w-auto px-7 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>{t('orderOnWhatsApp')}</span>
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
                  <span>Rs. 150 Flat Delivery</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>7-Day Easy Exchange</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md">
                <div
                  onClick={() => navigateToProduct(heroProduct.slug)}
                  className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white cursor-pointer"
                >
                  <img
                    src={heroProduct.images[0]}
                    alt={heroProduct.name}
                    className="w-full h-[360px] sm:h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#F2B705] bg-[#141414]/90 px-2.5 py-0.5 rounded-full w-fit mb-2">
                      Bestseller
                    </span>
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
                      {heroProduct.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                      <span className="text-sm font-serif font-bold text-[#F2B705]">
                        Rs. {heroProduct.price.toLocaleString()} PKR
                      </span>
                      <span className="py-2 px-4 bg-white hover:bg-gray-100 text-[#141414] font-serif font-bold text-xs rounded-full shadow-sm transition-all">
                        Inspect Details
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge: Rating */}
                <div className="absolute -top-3 -left-3 sm:-left-6 bg-white p-3 rounded-2xl shadow-xl border border-gold-hairline flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F2B705] shrink-0">
                    <Star className="w-5 h-5 fill-[#F2B705]" />
                  </div>
                  <div>
                    <div className="text-xs font-serif font-bold text-[#141414]">{heroProduct.rating} / 5.0</div>
                    <div className="text-[10px] text-gray-500">{heroProduct.reviewCount} reviews</div>
                  </div>
                </div>

                {/* Floating Badge: Battery */}
                <div className="absolute -bottom-3 -right-2 sm:-right-4 bg-[#141414] text-white p-3 rounded-2xl shadow-xl border border-gold-hairline flex items-center gap-3">
                  <BatteryCharging className="w-8 h-8 text-[#F2B705]" />
                  <div>
                    <div className="text-xs font-serif font-bold text-white">24+ Hours</div>
                    <div className="text-[10px] text-gray-400">With Charging Case</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8A6D1F] uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#F2B705]" />
            <span>Why Buds Pro 3</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#141414] mt-1">
            Built for All-Day Listening
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-3xl border border-gold-hairline p-5 sm:p-6 text-center space-y-2 shadow-xs"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F9F6F0] flex items-center justify-center text-[#8A6D1F]">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#141414]">{f.title}</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRUST + DELIVERY CHECKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141414] text-white rounded-3xl p-6 sm:p-10 border border-gold-hairline relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#8A6D1F]/30 border border-gold-hairline text-[#F2B705] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Trendy Bazar Promise</span>
                </span>
              </div>

              <h3 className="font-serif font-black text-2xl sm:text-4xl text-white leading-tight">
                Genuine Stock, Tested Before Dispatch.
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl font-sans">
                Every pair of Buds Pro 3 is quality-checked before it leaves our Lahore hub. Pay nothing upfront — Cash on Delivery available in every major Pakistani city with a flat Rs. 150 delivery charge.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2 text-xs">
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-gray-200">
                  <Truck className="w-3.5 h-3.5 text-[#F2B705]" />
                  <span>2-4 Days Nationwide Delivery</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-gray-200">
                  <RotateCcw className="w-3.5 h-3.5 text-[#F2B705]" />
                  <span>7-Day Easy Exchange</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-gray-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F2B705]" />
                  <span>Cash on Delivery Nationwide</span>
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

      {/* 4. REVIEWS SNAPSHOT */}
      {heroProduct.reviews && heroProduct.reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8A6D1F] uppercase tracking-widest">
                <Star className="w-3 h-3 text-[#F2B705] fill-[#F2B705]" />
                <span>{heroProduct.rating} / 5.0 Rating</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#141414] mt-1">
                What Buyers Are Saying
              </h2>
            </div>
            <button
              onClick={() => navigateToProduct(heroProduct.slug)}
              className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#8A6D1F] hover:text-[#141414] transition-colors self-start sm:self-auto"
            >
              <span>Read All Reviews ({heroProduct.reviewCount})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {heroProduct.reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-3xl border border-gold-hairline shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#141414]">{rev.userName}</span>
                  <div className="flex gap-0.5 text-[#F2B705]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#F2B705]" />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-[#8A6D1F] font-semibold block">{rev.userCity}</span>
                <p className="text-xs text-gray-600 leading-relaxed">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. MORE PRODUCTS (only shows once the catalog has more than one item) */}
      {otherProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#141414] mb-6">
            More from Trendy Bazar
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {otherProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. WELCOME OFFER BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" id="discount-newsletter-banner">
        <div className="relative rounded-3xl bg-[#141414] text-white p-7 sm:p-12 overflow-hidden shadow-2xl border border-gold-hairline">
          <div className="relative z-10 max-w-xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-[#8A6D1F]/30 border border-gold-hairline text-[#F2B705] text-xs font-serif font-bold px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRENDY BAZAR WELCOME OFFER</span>
            </span>

            <h2 className="font-serif font-black text-2xl sm:text-4xl leading-tight text-white">
              Enjoy <span className="text-[#F2B705]">5% Off</span> Your First Order
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
              Enter your WhatsApp number to get restock alerts and have coupon <strong>WELCOME5</strong> saved to your chat!
            </p>

            {newsletterSuccess ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-2xl text-xs text-emerald-200 flex items-center justify-center gap-2">
                <PartyPopper className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Shukriya! Code <strong>WELCOME5</strong> is active. Enter at checkout for 5% off.</span>
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
              No spam, ever. Only genuine restock and discount updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
