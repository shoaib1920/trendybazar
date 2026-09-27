import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  MessageCircle,
  CheckCircle2,
  Headphones
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView, openWhatsAppGeneral } = useShop();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16" id="about-us-page">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#F9F6F0] px-4 py-1.5 rounded-full text-xs font-serif font-bold text-[#8A6D1F] border border-gold-hairline">
          <Headphones className="w-3.5 h-3.5 text-[#F2B705]" />
          <span>Audio Gear, Priced Fairly</span>
        </div>

        <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#141414] leading-tight">
          Genuine Wireless Earbuds, <span className="italic font-normal text-[#8A6D1F]">Delivered Anywhere in Pakistan</span>.
        </h1>

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans">
          Trendy Bazar started with a simple idea: everyday shoppers across Pakistan deserve genuine, well-tested audio gear at honest prices — without inflated markups from big electronics retailers.
        </p>
      </div>

      {/* Brand Stat Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-[#141414] text-white p-6 sm:p-8 rounded-3xl border border-gold-hairline">
        <div className="text-center">
          <span className="font-serif font-black text-3xl sm:text-4xl text-[#F2B705] block">Rs. 1,999</span>
          <span className="text-xs text-gray-400">Buds Pro 3 Price</span>
        </div>
        <div className="text-center">
          <span className="font-serif font-black text-3xl sm:text-4xl text-[#F2B705] block">Rs. 150</span>
          <span className="text-xs text-gray-400">Flat Delivery</span>
        </div>
        <div className="text-center">
          <span className="font-serif font-black text-3xl sm:text-4xl text-[#F2B705] block">2-4</span>
          <span className="text-xs text-gray-400">Days Nationwide</span>
        </div>
        <div className="text-center">
          <span className="font-serif font-black text-3xl sm:text-4xl text-[#F2B705] block">4.7/5</span>
          <span className="text-xs text-gray-400">Customer Rating</span>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
          <span className="text-[11px] font-bold text-[#8A6D1F] uppercase tracking-wider">
            Quality Checked
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#141414]">
            Every Unit Tested Before It Ships
          </h2>
          <p>
            Too many online electronics sellers ship untested stock and leave you dealing with a dead unit on arrival. At Trendy Bazar, every pair of Buds Pro 3 is paired, charged, and sound-tested before it's packed for dispatch from our Lahore hub.
          </p>
          <p>
            No credit card required — order with Cash on Delivery and pay the courier only once your parcel is in hand.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 border border-gold-hairline">
          <img
            src="https://images.unsplash.com/photo-1746645297670-80e76130ceca?w=900&auto=format&fit=crop&q=80"
            alt="Buds Pro 3 wireless earbuds"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
            <span className="text-xs text-white font-serif italic">
              Buds Pro 3 — quality checked before dispatch
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Trust */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#141414]">
            Our Promises to You
          </h3>
          <p className="text-xs text-gray-500 font-sans mt-1">Honest standards, no hidden costs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#F9F6F0] p-6 rounded-2xl space-y-2 border border-gold-hairline">
            <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
              <span>Genuine Stock, Not Refurbished</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Every unit is brand new and quality-checked before it leaves our warehouse — what you see in the photos is what you receive.
            </p>
          </div>

          <div className="bg-[#F9F6F0] p-6 rounded-2xl space-y-2 border border-gold-hairline">
            <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
              <span>Direct WhatsApp Support</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              No generic ticket queues. Message us directly on WhatsApp (+92 336 4300592) for stock checks and order tracking.
            </p>
          </div>

          <div className="bg-[#F9F6F0] p-6 rounded-2xl space-y-2 border border-gold-hairline">
            <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
              <span>7-Day Easy Exchange</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              If your unit arrives faulty, message us within 7 days and we'll arrange a replacement — no long back-and-forth.
            </p>
          </div>

          <div className="bg-[#F9F6F0] p-6 rounded-2xl space-y-2 border border-gold-hairline">
            <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
              <span>Fair, Transparent Pricing</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              One flat Rs. 150 delivery charge nationwide, no surprise fees at checkout. Use code <strong>WELCOME5</strong> on your first order.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#141414] text-white p-8 sm:p-12 rounded-3xl text-center space-y-4 border border-gold-hairline">
        <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">
          Ready to Upgrade Your Audio?
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed font-sans">
          Order the Buds Pro 3 with nationwide Cash on Delivery — pay only when it arrives.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveView('shop')}
            className="py-3 px-6 bg-white hover:bg-gray-100 text-[#141414] font-serif font-bold text-xs rounded-full shadow-md transition-all active:scale-95"
          >
            Shop Now
          </button>
          <button
            onClick={() => openWhatsAppGeneral('Assalam-o-Alaikum Trendy Bazar! I would like to know more about the Buds Pro 3.')}
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
