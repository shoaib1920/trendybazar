import React from 'react';
import { useShop } from '../context/ShopContext';
import { discountLabel } from '../lib/discountsService';
import { MessageCircle, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView, openWhatsAppGeneral, featuredDiscount } = useShop();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12" id="about-us-page">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#141414] leading-tight">
          Genuine Gear, Fair Prices.
        </h1>
        <p className="text-sm text-gray-600">
          Every unit tested before it ships. Cash on Delivery nationwide.
        </p>
      </div>

      {/* Brand Stat Highlights */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 bg-[#141414] text-white p-6 sm:p-8 rounded-3xl border border-gold-hairline">
        <div className="text-center">
          <span className="font-serif font-black text-2xl sm:text-3xl text-[#F2B705] block">Rs. 150</span>
          <span className="text-xs text-gray-400">Flat Delivery</span>
        </div>
        <div className="text-center">
          <span className="font-serif font-black text-2xl sm:text-3xl text-[#F2B705] block">2-4</span>
          <span className="text-xs text-gray-400">Days Nationwide</span>
        </div>
        <div className="text-center">
          <span className="font-serif font-black text-2xl sm:text-3xl text-[#F2B705] block">7-Day</span>
          <span className="text-xs text-gray-400">Easy Exchange</span>
        </div>
      </div>

      {/* Pillars of Trust */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#F9F6F0] p-5 rounded-2xl space-y-1.5 border border-gold-hairline">
          <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
            <span>Quality Checked Before Dispatch</span>
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Every unit is tested before it leaves our Lahore hub.
          </p>
        </div>

        <div className="bg-[#F9F6F0] p-5 rounded-2xl space-y-1.5 border border-gold-hairline">
          <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
            <span>Direct WhatsApp Support</span>
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Message us anytime at +92 336 4300592.
          </p>
        </div>

        <div className="bg-[#F9F6F0] p-5 rounded-2xl space-y-1.5 border border-gold-hairline">
          <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
            <span>7-Day Easy Exchange</span>
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Faulty unit? We replace it, no back-and-forth.
          </p>
        </div>

        <div className="bg-[#F9F6F0] p-5 rounded-2xl space-y-1.5 border border-gold-hairline">
          <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
            <span>No Hidden Fees</span>
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Flat Rs. 150 delivery.
            {featuredDiscount && (
              <>
                {' '}Use code <strong>{featuredDiscount.code}</strong> for {discountLabel(featuredDiscount)}.
              </>
            )}
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#141414] text-white p-8 sm:p-10 rounded-3xl text-center space-y-3 border border-gold-hairline">
        <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
          Ready to Order?
        </h3>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <button
            onClick={() => setActiveView('shop')}
            className="py-3 px-6 bg-white hover:bg-gray-100 text-[#141414] font-serif font-bold text-xs rounded-full shadow-md transition-all active:scale-95"
          >
            Shop Now
          </button>
          <button
            onClick={() => openWhatsAppGeneral('Assalam-o-Alaikum Trendy Bazar!')}
            className="py-3 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
