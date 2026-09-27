import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const { products, setActiveView, openWhatsAppGeneral, t } = useShop();

  const heroProduct = products.find((p) => p.slug === 'buds-pro-3-true-wireless-earbuds') || products[0];

  const handleShopNow = () => {
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
            <video
              src="/hero-earbuds.mp4"
              poster={heroProduct.images[0]}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* TRUST STRIP — icons only */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-[#F9F6F0] border border-gold-hairline rounded-3xl p-5 sm:p-6 text-center">
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
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif font-black text-xl sm:text-2xl text-[#141414] mb-5">
          All Products
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
