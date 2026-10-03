import React from 'react';
import { Logo } from './Logo';
import { useShop } from '../context/ShopContext';
import { discountLabel } from '../lib/discountsService';
import {
  MessageCircle,
  Instagram,
  Facebook,
  MapPin,
  Mail,
  Truck,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setShopCategoryFilter, featuredDiscount } = useShop();

  const handleCategoryClick = (cat: string) => {
    setShopCategoryFilter(cat);
    setActiveView(cat === 'electronics' ? 'earbuds' : cat === 'accessories' ? 'watches' : 'shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewClick = (view: 'home' | 'shop' | 'about' | 'contact' | 'track') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#1A1A1A] text-white pt-16 pb-12 overflow-hidden" id="main-footer">
      {/* Signature Gold Wave Accent at Top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F2B705] via-[#FFE279] to-[#F2B705]" />

      {/* Trust Highlights Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pb-10 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <Truck className="w-4 h-4 text-[#F2B705] shrink-0" />
            <span className="text-xs font-semibold text-white">Nationwide COD</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <RotateCcw className="w-4 h-4 text-[#F2B705] shrink-0" />
            <span className="text-xs font-semibold text-white">7-Day Exchange</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <MessageCircle className="w-4 h-4 text-[#F2B705] shrink-0" />
            <span className="text-xs font-semibold text-white">WhatsApp Ordering</span>
          </div>
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <ShieldCheck className="w-4 h-4 text-[#F2B705] shrink-0" />
            <span className="text-xs font-semibold text-white">Quality Checked</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" />

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/trendy.bazaar.pk?stkn=MWdiYmt2N2V5ZmE5ZQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F2B705] hover:text-[#1A1A1A] flex items-center justify-center transition-all"
                title="Follow Trendy Bazar on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@trendybazaar.pk44?_r=1&_t=ZN-99jNYcR9Tb4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F2B705] hover:text-[#1A1A1A] flex items-center justify-center transition-all font-bold text-xs"
                title="Follow Trendy Bazar on TikTok"
              >
                TK
              </a>
              <a
                href="https://www.facebook.com/share/1Brj1hewYh/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F2B705] hover:text-[#1A1A1A] flex items-center justify-center transition-all"
                title="Follow Trendy Bazar on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/923364300592"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                title="Chat with Trendy Bazar on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              </a>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="hover:text-[#F2B705] transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('electronics')}
                  className="hover:text-[#F2B705] transition-colors"
                >
                  Earbuds
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('accessories')}
                  className="hover:text-[#F2B705] transition-colors"
                >
                  Watches & Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care Col */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => handleViewClick('track')}
                  className="hover:text-[#F2B705] transition-colors"
                >
                  Track Courier Dispatch
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleViewClick('contact')}
                  className="hover:text-[#F2B705] transition-colors"
                >
                  Shipping & COD Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleViewClick('contact')}
                  className="hover:text-[#F2B705] transition-colors"
                >
                  Return & Exchange Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleViewClick('about')}
                  className="hover:text-[#F2B705] transition-colors"
                >
                  About Trendy Bazar
                </button>
              </li>
            </ul>
          </div>

          {/* Official Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <a
                href="https://wa.me/923364300592"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>+92 336 4300592</span>
              </a>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F2B705] shrink-0" />
                <span>orders@trendybazar.pk</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F2B705] shrink-0 mt-0.5" />
                <span>Fulfillment Hub: Block D, Gulberg III, Lahore, Pakistan</span>
              </div>
            </div>

            {/* Standing Offer Reminder */}
            {featuredDiscount && (
              <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[11px] font-bold text-[#F2B705] block mb-0.5">Code: {featuredDiscount.code}</span>
                <span className="text-[10px] text-gray-400">{discountLabel(featuredDiscount)} + Rs. 150 delivery nationwide</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright & payment trust */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Trendy Bazar Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded font-mono">Cash on Delivery</span>
            <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded font-mono">JazzCash</span>
            <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded font-mono">Easypaisa</span>
            <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded font-mono">Trax Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
