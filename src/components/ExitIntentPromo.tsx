import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { discountAmountText, discountLabel } from '../lib/discountsService';
import { X, Sparkles, Copy, Check, Gift, ShoppingBag, ArrowRight } from 'lucide-react';

export const ExitIntentPromo: React.FC = () => {
  const { applyPromoCode, setActiveView, featuredDiscount } = useShop();
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Show once per session, ~10 seconds in — but never on top of the
    // "How to order" guide, the bag or checkout; wait until the customer is free.
    if (sessionStorage.getItem('tb_seen_promo_popup')) return;
    const isBusy = () =>
      document.body.classList.contains('driver-active') ||
      Boolean(document.querySelector('[aria-label="Shopping guide"], #cart-drawer-panel, #checkout-modal-card'));
    let timer: number;
    const tryShow = () => {
      if (isBusy()) {
        timer = window.setTimeout(tryShow, 5000);
        return;
      }
      setIsVisible(true);
      sessionStorage.setItem('tb_seen_promo_popup', 'true');
    };
    timer = window.setTimeout(tryShow, 10000);
    return () => window.clearTimeout(timer);
  }, []);

  // Nothing to advertise (no featured code set in admin) -> no popup.
  if (!isVisible || !featuredDiscount) return null;
  const offer = featuredDiscount;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCopyAndClaim = () => {
    navigator.clipboard.writeText(offer.code).catch(() => {});
    setIsCopied(true);
    void applyPromoCode(offer.code);
    setTimeout(() => {
      setIsVisible(false);
      setActiveView('shop');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-300">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-[#F2B705]/40 p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="exit-promo-card"
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge & Icon */}
        <div className="w-16 h-16 bg-amber-100 text-[#F2B705] rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50">
          <Gift className="w-8 h-8 text-[#1A1A1A]" />
        </div>

        <div className="inline-flex items-center gap-1.5 bg-[#F2B705]/20 text-[#1A1A1A] text-xs font-black px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F2B705]" />
          <span>EXCLUSIVE WELCOME OFFER</span>
        </div>

        <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A] leading-tight mb-2">
          Take <span className="text-[#F2B705]">{discountAmountText(offer)} OFF</span> Your Order
        </h2>

        <p className="text-xs text-gray-600 max-w-xs mx-auto mb-6 leading-relaxed">
          Get {discountLabel(offer)}. Valid across Pakistan!
        </p>

        {/* Promo Code Box */}
        <div className="bg-[#F7F3EC] p-3.5 rounded-2xl border border-dashed border-amber-300 mb-5 flex items-center justify-between gap-2">
          <div className="text-left">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">Coupon Code</span>
            <span className="font-heading font-black text-lg text-[#1A1A1A] tracking-wider">{offer.code}</span>
          </div>
          <button
            onClick={handleCopyAndClaim}
            id="claim-welcome5-popup-btn"
            className="bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-transform active:scale-95"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>APPLIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>COPY & SHOP</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleCopyAndClaim}
          className="w-full py-3.5 px-4 bg-[#F2B705] hover:bg-[#e0a700] text-[#1A1A1A] font-black text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
        >
          <span>Claim Discount & Browse Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-gray-400 mt-3">
          Cash on Delivery (COD) available • Fast delivery in 2-4 days
        </p>
      </div>
    </div>
  );
};
