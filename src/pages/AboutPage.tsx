import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  CheckCircle2,
  ArrowRight,
  Scissors,
  Award
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView, openWhatsAppGeneral, t } = useShop();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16" id="about-us-page">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#F9F6F0] px-4 py-1.5 rounded-full text-xs font-serif font-bold text-[#8A6D1F] border border-gold-hairline">
          <Sparkles className="w-3.5 h-3.5 text-[#F2B705]" />
          <span>The Sartorial Heritage of Lahore</span>
        </div>

        <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#141414] leading-tight">
          Rooted in Lahore’s Guilds, Crafted for <span className="italic font-normal text-[#8A6D1F]">Every Corner of Pakistan</span>.
        </h1>

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans">
          Trendy Bazaar began as an artisan-led initiative connecting heritage Chiniot Boski silk weavers and Lahore master darzis directly with modern shoppers across Karachi, Islamabad, Peshawar, and Quetta.
        </p>
      </div>

      {/* Brand Stat Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-[#141414] text-white p-6 sm:p-8 rounded-3xl border border-gold-hairline">
        <div className="text-center">
          <span className="font-serif font-black text-3xl sm:text-4xl text-[#F2B705] block">50K+</span>
          <span className="text-xs text-gray-400">Patron Community</span>
        </div>
        <div className="text-center">
          <span className="font-serif font-black text-3xl sm:text-4xl text-[#F2B705] block">15,000+</span>
          <span className="text-xs text-gray-400">Suits Delivered</span>
        </div>
        <div className="text-center">
          <span className="font-serif font-black text-3xl sm:text-4xl text-[#F2B705] block">150+</span>
          <span className="text-xs text-gray-400">Pakistani Cities</span>
        </div>
        <div className="text-center">
          <span className="font-serif font-black text-3xl sm:text-4xl text-[#F2B705] block">4.9/5</span>
          <span className="text-xs text-gray-400">Patron Rating</span>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
          <span className="text-[11px] font-bold text-[#8A6D1F] uppercase tracking-wider">
            Material Authenticity
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#141414]">
            Pure 80/80 Lawn & 6-Pound Chiniot Boski
          </h2>
          <p>
            Too many online stores sell mixed-polyester synthetics masquerading as luxury lawn. At Trendy Bazaar, we source 100% long-staple combed cotton spun to high reed-pick density, authentic Chinioti mulberry silk woven on traditional shuttle looms, and hypoallergenic 18K PVD coated jewelry that withstands humid Karachi coastal weather.
          </p>
          <p>
            Whether you choose unstitched cloth or rely on our bespoke Lahore tailoring guild, your garment is handcrafted with fine overlocking, organza finishing, and custom threadwork.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 border border-gold-hairline">
          <img
            src="https://images.unsplash.com/photo-1721324807072-784ab8ddf166?w=900&auto=format&fit=crop&q=80"
            alt="Hand-embroidered Lawn at Trendy Bazaar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
            <span className="text-xs text-white font-serif italic">
              Inspecting hand-set sequins & organza scallops in our Gulberg studio
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Trust */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#141414]">
            Our Four Promises to You
          </h3>
          <p className="text-xs text-gray-500 font-sans mt-1">Honest standards in an era of generic drop-shipping</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#F9F6F0] p-6 rounded-2xl space-y-2 border border-gold-hairline">
            <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
              <span>Real Pieces Exactly Matching Real Photos</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              All unboxings and catalog photos are shot on real Pakistani models in natural studio daylight without deceptive digital recoloring.
            </p>
          </div>

          <div className="bg-[#F9F6F0] p-6 rounded-2xl space-y-2 border border-gold-hairline">
            <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
              <span>Direct WhatsApp Concierge & Stylist</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              No generic ticket queues. Speak with real stylists in Lahore on WhatsApp (+92 336 4300592) for fabric advice, custom inches, and instant order tracking.
            </p>
          </div>

          <div className="bg-[#F9F6F0] p-6 rounded-2xl space-y-2 border border-gold-hairline">
            <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
              <span>Doorstep 7-Day Hassle-Free Swap</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              If a pret kurta fits loosely or snugly, our partner courier delivers the replacement size straight to your doorstep and picks up the previous parcel in one seamless visit.
            </p>
          </div>

          <div className="bg-[#F9F6F0] p-6 rounded-2xl space-y-2 border border-gold-hairline">
            <h4 className="font-serif font-bold text-sm text-[#141414] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8A6D1F]" />
              <span>Fair, Transparent PKR Pricing</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Direct artisan relationships mean no distributor markup. Plus, earn reward points on every order with code <strong>TREND10</strong> for first-time buyers.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#141414] text-white p-8 sm:p-12 rounded-3xl text-center space-y-4 border border-gold-hairline">
        <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">
          Experience Authentic Pakistani Elegance
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed font-sans">
          Explore our seasonal collection with nationwide Cash on Delivery and optional master darzi tailoring.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveView('shop')}
            className="py-3 px-6 bg-white hover:bg-gray-100 text-[#141414] font-serif font-bold text-xs rounded-full shadow-md transition-all active:scale-95"
          >
            Explore Catalog
          </button>
          <button
            onClick={() => openWhatsAppGeneral('Assalam-o-Alaikum Trendy Bazaar! I would like to consult your stylist.')}
            className="py-3 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Consult Stylist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
