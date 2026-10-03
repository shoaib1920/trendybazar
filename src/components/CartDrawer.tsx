import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { discountAmountText } from '../lib/discountsService';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight, 
  Tag, 
  Check, 
  Truck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    appliedDiscount, 
    applyPromoCode, 
    removePromoCode, 
    discountError,
    featuredDiscount,
    setIsCheckoutOpen,
    getWhatsAppCartLink,
    setActiveView
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_GOAL = 3500;
  const progressPercent = Math.min(100, (cartSubtotal / FREE_SHIPPING_GOAL) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_GOAL - cartSubtotal);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
    }
  };

  const handleQuickApplyFeatured = () => {
    if (!featuredDiscount) return;
    setPromoInput(featuredDiscount.code);
    void applyPromoCode(featuredDiscount.code);
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderWhatsApp = () => {
    window.open(getWhatsAppCartLink(), '_blank', 'noopener,noreferrer');
  };

  const handleShopNow = () => {
    setIsCartOpen(false);
    setActiveView('shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
        id="cart-drawer-panel"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#F7F3EC]/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#F2B705]" />
            <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">Your Bag</h2>
            <span className="bg-[#1A1A1A] text-[#F2B705] text-xs font-black px-2 py-0.5 rounded-full">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-amber-50/70 px-4 py-2.5 border-b border-amber-100">
          <div className="flex items-center justify-between text-xs font-medium text-gray-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#F2B705]" />
              {remainingForFreeShipping > 0 ? (
                <>Add <strong className="text-[#1A1A1A]">Rs. {remainingForFreeShipping.toLocaleString()}</strong> more for FREE Shipping!</>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> You unlocked FREE Nationwide Delivery!
                </span>
              )}
            </span>
            <span className="text-[10px] text-gray-500 font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#F2B705] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 bg-[#F7F3EC] rounded-full flex items-center justify-center mb-4 text-[#F2B705]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#1A1A1A] mb-1">Your bag is empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mb-6">
Add earbuds or a watch to get started.
              </p>
              <button
                onClick={handleShopNow}
                className="py-2.5 px-6 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold rounded-full transition-transform active:scale-95"
              >
                Browse Shop Catalog
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div 
                key={`${item.product.id}-${item.selectedColor}-${idx}`}
                className="flex gap-3 bg-gray-50/60 p-2.5 rounded-2xl border border-gray-100"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded-xl bg-gray-200 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-semibold text-xs text-[#1A1A1A] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 mt-1">
                      {item.selectedColor && (
                        <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200">
                          {item.selectedColor}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div data-tour="cart-qty" className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-[#1A1A1A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#1A1A1A]">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary / Actions */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-[#F7F3EC]/30 space-y-3">
            {/* Promo Code Input */}
            <div data-tour="cart-discount">
              {appliedDiscount ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold">{appliedDiscount.code} Applied</span>
                      <p className="text-[10px] text-emerald-600">Saved Rs. {cartDiscount.toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-emerald-700 hover:text-red-600 text-xs font-semibold px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Discount code"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full bg-white border border-gray-200 focus:border-[#F2B705] text-xs uppercase rounded-xl py-2 pl-8 pr-3 outline-none"
                      />
                      <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  {discountError && (
                    <div className="flex items-center gap-1 text-[11px] text-red-600 mt-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{discountError}</span>
                    </div>
                  )}
                  {/* Quick pill for the advertised code */}
                  {featuredDiscount && (
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1.5 px-0.5">
                      <span>
                        Have code <strong>{featuredDiscount.code}</strong>?
                      </span>
                      <button
                        onClick={handleQuickApplyFeatured}
                        className="text-[#F2B705] hover:text-[#d49e00] font-bold underline"
                      >
                        Auto-Apply {discountAmountText(featuredDiscount)} Off
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1A1A1A]">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Discount ({appliedDiscount?.code})</span>
                  <span>- Rs. {cartDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Estimated Shipping (Pakistan)</span>
                <span>
                  {cartShipping === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `Rs. ${cartShipping}`
                  )}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-black text-[#1A1A1A]">
                <span>Total Due</span>
                <span className="text-base text-[#1A1A1A]">Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Dual CTAs: Standard Checkout & WhatsApp Checkout */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleProceedCheckout}
                id="drawer-checkout-btn"
                className="w-full py-3 px-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>Proceed to Checkout (COD & Online)</span>
                <ArrowRight className="w-4 h-4 text-[#F2B705]" />
              </button>

              <button
                onClick={handleOrderWhatsApp}
                id="drawer-whatsapp-btn"
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Order Bag on WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
