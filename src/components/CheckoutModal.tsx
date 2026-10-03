import React, { useState } from 'react';
import { useShop, WHATSAPP_NUMBER } from '../context/ShopContext';
import { OrderReceipt, printReceipt, receiptText } from './OrderReceipt';
import { CheckoutFormData, PlacedOrder } from '../types';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  MessageCircle, 
  CreditCard, 
  Banknote, 
  Smartphone,
  Sparkles,
  ArrowRight,
  Gift,
  Award,
  Printer,
  AlertTriangle
} from 'lucide-react';

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Sukkur',
  'Mardan',
  'Gujrat',
  'Other City / Town'
];

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal, 
    appliedDiscount, 
    placeOrder, 
    brandWhatsAppNumber,
    setActiveView,
    loyaltyPoints,
    showToast,
    t
  } = useShop();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    email: '',
    city: 'Lahore',
    address: '',
    nearestLandmark: '',
    paymentMethod: 'cod',
    orderNotes: ''
  });

  const [isGiftWrapSelected, setIsGiftWrapSelected] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<PlacedOrder | null>(null);
  const [orderSynced, setOrderSynced] = useState(true);

  if (!isCheckoutOpen) return null;

  const giftWrapFee = isGiftWrapSelected ? 250 : 0;
  const loyaltyDiscount = redeemPoints ? Math.min(loyaltyPoints, Math.floor(cartTotal * 0.2)) : 0;
  const finalPayableTotal = Math.max(0, cartTotal + giftWrapFee - loyaltyDiscount);

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast('Please fill in your Name, WhatsApp Phone Number, and Delivery Address.', 'warning');
      return;
    }
    if (cart.length === 0) {
      showToast('Your bag is empty.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const { order, synced } = await placeOrder(formData, {
        giftWrapFee,
        giftNote: isGiftWrapSelected ? giftMessage || 'For someone special' : undefined,
        pointsDiscount: loyaltyDiscount
      });
      setCompletedOrder(order);
      setOrderSynced(synced);
      setIsGiftWrapSelected(false);
      setGiftMessage('');
      setRedeemPoints(false);
      showToast(`🎉 Order ${order.orderId} placed!`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotifyWhatsApp = () => {
    if (!completedOrder) return;
    const msg = `Assalam-o-Alaikum Trendy Bazar! 👋 I just placed an order on your website.

${receiptText(completedOrder)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleTrackPlacedOrder = () => {
    handleClose();
    setActiveView('track');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gold-hairline p-5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
        id="checkout-modal-card"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* ORDER CONFIRMATION VIEW */
          <div className="text-center py-6 px-2 sm:px-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8A6D1F]">
              Order Placed Successfully
            </span>

            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#141414]">
              Shukriya, {completedOrder.customer.fullName}!
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Your order is received. Save your Order ID <strong className="font-mono">{completedOrder.orderId}</strong> to track it anytime.
            </p>

            {!orderSynced && (
              <div className="max-w-md mx-auto flex items-start gap-2 text-left text-xs p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  We couldn&apos;t reach our server. Please tap <strong>Send on WhatsApp</strong> below so we receive your order.
                </span>
              </div>
            )}

            {/* Receipt */}
            <div className="max-w-md mx-auto">
              <OrderReceipt order={completedOrder} />
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 max-w-md mx-auto">
              <button
                onClick={printReceipt}
                className="py-3 px-4 bg-white border border-gold-hairline hover:bg-[#F9F6F0] text-[#141414] font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Printer className="w-4 h-4 text-[#8A6D1F]" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={handleNotifyWhatsApp}
                className="py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send on WhatsApp</span>
              </button>

              <button
                onClick={handleTrackPlacedOrder}
                className="py-3 px-4 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Truck className="w-4 h-4 text-[#F2B705]" />
                <span>Track Order</span>
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <div className="space-y-6">
            <div>
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8A6D1F]">
                Quick Checkout
              </span>
              <h2 className="font-serif font-black text-2xl text-[#141414] mt-0.5">
                Shipping & Payment Details
              </h2>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                Nationwide Cash on Delivery (COD) • Direct Dispatch from Lahore Hub
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Customer Contact */}
              <div data-tour="co-contact" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-serif font-bold text-gray-800 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Malik"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#F9F6F0] border border-gold-hairline focus:border-[#8A6D1F] focus:bg-white rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-serif font-bold text-gray-800 mb-1">
                    WhatsApp Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0333 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F9F6F0] border border-gold-hairline focus:border-[#8A6D1F] focus:bg-white rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Our courier will send SMS / WhatsApp before delivery
                  </span>
                </div>
              </div>

              {/* City & Address */}
              <div data-tour="co-address" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-serif font-bold text-gray-800 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#F9F6F0] border border-gold-hairline focus:border-[#8A6D1F] focus:bg-white rounded-xl py-2.5 px-3 text-xs outline-none cursor-pointer"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-serif font-bold text-gray-800 mb-1">
                    Complete Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House/Apartment #, Street, Block, Phase"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#F9F6F0] border border-gold-hairline focus:border-[#8A6D1F] focus:bg-white rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-serif font-bold text-gray-800 mb-1">
                  Nearest Landmark or Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Shell pump, Call before ringing bell"
                  value={formData.nearestLandmark}
                  onChange={(e) => setFormData({ ...formData, nearestLandmark: e.target.value })}
                  className="w-full bg-[#F9F6F0] border border-gold-hairline focus:border-[#8A6D1F] focus:bg-white rounded-xl py-2 px-3 text-xs outline-none transition-all"
                />
              </div>

              {/* Gift Wrapping & Personalized Greeting Option */}
              <div className="p-3.5 rounded-2xl bg-[#F9F6F0] border border-gold-hairline space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGiftWrapSelected}
                    onChange={(e) => setIsGiftWrapSelected(e.target.checked)}
                    className="accent-[#8A6D1F] w-4 h-4 rounded"
                  />
                  <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-[#141414]">
                    <Gift className="w-3.5 h-3.5 text-[#8A6D1F]" />
                    <span>Add Luxury Gift Box & Handwritten Card (+Rs. 250)</span>
                  </div>
                </label>

                {isGiftWrapSelected && (
                  <input
                    type="text"
                    placeholder="Enter personalized note for card (e.g. 'Happy Birthday Aiman!')"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full bg-white border border-gold-hairline rounded-xl py-2 px-3 text-xs outline-none mt-1"
                  />
                )}
              </div>

              {/* Loyalty Points Redemption */}
              {loyaltyPoints > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#8A6D1F]" />
                    <div>
                      <div className="font-serif font-bold text-xs text-[#141414]">
                        Redeem Loyalty Reward Points
                      </div>
                      <div className="text-[10px] text-gray-500">
                        You have {loyaltyPoints} points (Worth up to Rs. {Math.min(loyaltyPoints, Math.floor(cartTotal * 0.2))} discount)
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRedeemPoints(!redeemPoints)}
                    className={`py-1.5 px-3 rounded-full font-serif font-bold text-xs transition-all ${
                      redeemPoints 
                        ? 'bg-[#141414] text-white' 
                        : 'bg-white border border-gold-hairline text-[#8A6D1F] hover:bg-amber-100'
                    }`}
                  >
                    {redeemPoints ? 'Applied (-Rs. ' + loyaltyDiscount + ')' : 'Redeem Points'}
                  </button>
                </div>
              )}

              {/* Payment Methods */}
              <div data-tour="co-payment" className="pt-2">
                <label className="block font-serif font-bold text-gray-800 mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* COD */}
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#8A6D1F] bg-[#F9F6F0]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className="accent-[#8A6D1F]"
                    />
                    <Banknote className="w-5 h-5 text-emerald-700" />
                    <div>
                      <div className="font-serif font-bold text-xs text-[#141414]">Cash on Delivery (COD)</div>
                      <div className="text-[10px] text-gray-500">Pay cash to courier upon arrival</div>
                    </div>
                  </label>

                  {/* JazzCash / Easypaisa */}
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'jazzcash'
                        ? 'border-[#8A6D1F] bg-[#F9F6F0]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'jazzcash'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'jazzcash' })}
                      className="accent-[#8A6D1F]"
                    />
                    <Smartphone className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-serif font-bold text-xs text-[#141414]">JazzCash / Easypaisa</div>
                      <div className="text-[10px] text-gray-500">Mobile wallet payment transfer</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="bg-[#F9F6F0] p-4 rounded-2xl border border-gold-hairline mt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Cart Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span>Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedDiscount?.code})</span>
                    <span>-Rs. {cartDiscount.toLocaleString()}</span>
                  </div>
                )}
                {isGiftWrapSelected && (
                  <div className="flex justify-between text-[#8A6D1F] font-medium">
                    <span>Luxury Gift Wrap & Card</span>
                    <span>+Rs. 250</span>
                  </div>
                )}
                {redeemPoints && loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Loyalty Points Discount</span>
                    <span>-Rs. {loyaltyDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping (Nationwide Pakistan)</span>
                  <span>{cartShipping === 0 ? 'FREE' : `Rs. ${cartShipping}`}</span>
                </div>
                <div className="border-t border-gold-hairline pt-2 flex justify-between font-serif font-bold text-sm text-[#141414]">
                  <span>Total Amount Due</span>
                  <span className="text-base text-[#141414]">Rs. {finalPayableTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="place-order-submit-btn"
                className="w-full py-4 px-4 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Placing your order...</span>
                ) : (
                  <>
                    <span>Confirm Order • Rs. {finalPayableTotal.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4 text-[#F2B705]" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
