import React, { useCallback, useEffect, useRef, useState } from 'react';
import { driver, type DriveStep, type Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { HelpCircle, Sparkles, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

type TourName = 'browse' | 'product' | 'cart' | 'checkout';

interface TourStep {
  selector: string;
  title: string;
  en: string;
  ur: string; // Roman Urdu
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const TOURS: Record<TourName, TourStep[]> = {
  browse: [
    { selector: '[data-tour="search"]', title: 'Search for a product', en: 'Type what you are looking for.', ur: 'Product ka naam likh kar dhoondein.' },
    { selector: '[data-tour="categories"]', title: 'Browse Earbuds & Watches', en: 'Open a category to see all products.', ur: 'Yahan se Earbuds ya Watches dekhein.' },
    { selector: '[data-tour="product-card"]', title: 'Open a product', en: 'Tap a product to see photos, price and details.', ur: 'Product par tap karein — photos aur details dekhein.' },
    { selector: '[data-tour="card-add"]', title: 'Add to Bag', en: 'Put the product in your shopping bag.', ur: 'Is button se product Bag mein daalein.' },
    { selector: '[data-tour="cart"]', title: 'Your Shopping Bag', en: 'Open your bag and tap Checkout to place the order.', ur: 'Bag khol kar Checkout karein aur order confirm karein.' },
    { selector: '[data-tour="ai-chat"]', title: 'Order by chatting', en: 'Our AI assistant can take your order in any language.', ur: 'Roman Urdu ya kisi bhi zubaan mein baat kar ke order karein.', side: 'top' },
    { selector: '[data-tour="whatsapp"]', title: 'Order on WhatsApp', en: 'Prefer WhatsApp? Message us directly.', ur: 'Seedha WhatsApp par bhi order kar sakte hain.', side: 'top' },
    { selector: '[data-tour="track"]', title: 'Track your order', en: 'Use your Order ID to see where your parcel is.', ur: 'Order ID daal kar apna parcel track karein.' },
    { selector: '[data-tour="help"]', title: 'Need help again?', en: 'Tap here anytime to see this guide again.', ur: 'Ye guide dobara dekhne ke liye yahan tap karein.', side: 'top' }
  ],
  product: [
    { selector: '[data-tour="pdp-gallery"]', title: 'See all photos', en: 'Swipe for more photos, or tap 🔍 to zoom in.', ur: 'Swipe karein ya 🔍 daba kar photo zoom karein.' },
    { selector: '[data-tour="pdp-qty"]', title: 'Choose quantity', en: 'Use + and − to pick how many you want.', ur: '+ / − se quantity select karein.' },
    { selector: '#pdp-add-to-cart-btn', title: 'Add to Bag', en: 'Add it to your bag, then go to Checkout.', ur: 'Bag mein daalein, phir Checkout karein.' },
    { selector: '#pdp-whatsapp-btn', title: 'Or order on WhatsApp', en: 'Send this product to us on WhatsApp in one tap.', ur: 'Ek tap mein WhatsApp par order bhejein.' }
  ],
  cart: [
    { selector: '[data-tour="cart-qty"]', title: 'Change quantity', en: 'Increase or decrease the quantity here.', ur: 'Yahan quantity kam ya zyada karein.', side: 'left' },
    { selector: '[data-tour="cart-discount"]', title: 'Have a discount code?', en: 'Type your discount code and tap Apply.', ur: 'Discount code likh kar Apply dabayein.', side: 'left' },
    { selector: '#drawer-checkout-btn', title: 'Checkout', en: 'Enter your address and phone number to confirm.', ur: 'Address aur phone number de kar order confirm karein.', side: 'top' },
    { selector: '#drawer-whatsapp-btn', title: 'Prefer WhatsApp?', en: 'Send your whole bag to us on WhatsApp.', ur: 'Poora Bag WhatsApp par bhej dein.', side: 'top' }
  ],
  checkout: [
    { selector: '[data-tour="co-contact"]', title: 'Name & WhatsApp number', en: 'The rider will call this number before delivery.', ur: 'Apna naam aur WhatsApp number likhein — rider call karega.' },
    { selector: '[data-tour="co-address"]', title: 'Delivery address', en: 'Choose your city and write your full address.', ur: 'Shehar select karein aur poora address likhein.' },
    { selector: '[data-tour="co-payment"]', title: 'Payment', en: 'Cash on Delivery — pay when the parcel arrives.', ur: 'Cash on Delivery — parcel milne par payment karein.' },
    { selector: '#place-order-submit-btn', title: 'Confirm your order', en: 'Tap here and you will get your receipt and Order ID.', ur: 'Ye button dabayein — receipt aur Order ID mil jayegi.', side: 'top' }
  ]
};

const GUIDE_KEY = 'tb_guide'; // 'on' | 'off' (unset = not asked yet)
const seenKey = (name: TourName) => `tb_tour_seen_${name}`;

const storage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // private mode etc. — the guide still works for this visit
    }
  }
};

const isVisible = (el: Element) => {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== 'hidden';
};

const findVisible = (selector: string) => Array.from(document.querySelectorAll(selector)).find(isVisible);

export const GuidedTour: React.FC = () => {
  const { activeView, isCartOpen, isCheckoutOpen, cart } = useShop();
  const [showWelcome, setShowWelcome] = useState(false);
  const activeTour = useRef<Driver | null>(null);

  const startTour = useCallback((name: TourName) => {
    activeTour.current?.destroy();
    const steps: DriveStep[] = TOURS[name]
      .map((step) => ({ step, element: findVisible(step.selector) }))
      .filter((s): s is { step: TourStep; element: Element } => Boolean(s.element))
      .map(({ step, element }) => ({
        element,
        popover: {
          title: step.title,
          description: `${step.en}<span class="tb-tour-ur">${step.ur}</span>`,
          side: step.side,
          align: 'center'
        }
      }));
    storage.set(seenKey(name), '1');
    if (steps.length === 0) return;

    const tour = driver({
      steps,
      showProgress: steps.length > 1,
      progressText: '{{current}} / {{total}}',
      nextBtnText: 'Next →',
      prevBtnText: '←',
      doneBtnText: 'Got it! 👍',
      popoverClass: 'tb-tour',
      overlayColor: '#141414',
      overlayOpacity: 0.55,
      stagePadding: 6,
      stageRadius: 14,
      smoothScroll: true,
      allowClose: true,
      onDestroyed: () => {
        activeTour.current = null;
      }
    });
    activeTour.current = tour;
    tour.drive();
  }, []);

  // Which tour fits what the customer is looking at right now.
  const currentTour = (): TourName =>
    isCheckoutOpen ? 'checkout' : isCartOpen && cart.length > 0 ? 'cart' : activeView === 'product' ? 'product' : 'browse';

  // First visit: offer the guide.
  useEffect(() => {
    if (activeView === 'admin' || storage.get(GUIDE_KEY)) return;
    const timer = window.setTimeout(() => setShowWelcome(true), 2500);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // With the guide on, show each page's tour the first time the customer gets there.
  useEffect(() => {
    if (storage.get(GUIDE_KEY) !== 'on' || activeTour.current) return;
    const name = currentTour();
    if (name === 'browse' || storage.get(seenKey(name))) return;
    const timer = window.setTimeout(() => {
      if (!activeTour.current && findVisible(TOURS[name][0].selector)) startTour(name);
    }, 900);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, isCartOpen, isCheckoutOpen, cart.length]);

  useEffect(() => () => activeTour.current?.destroy(), []);

  const acceptGuide = () => {
    storage.set(GUIDE_KEY, 'on');
    setShowWelcome(false);
    window.setTimeout(() => startTour(currentTour()), 250);
  };

  const declineGuide = () => {
    storage.set(GUIDE_KEY, 'off');
    setShowWelcome(false);
  };

  if (activeView === 'admin') return null;

  const mobileBottom = activeView === 'product' ? 'bottom-[148px]' : 'bottom-[88px]';

  return (
    <>
      {/* "How to order?" — replays the tour for the current screen */}
      <button
        onClick={() => startTour(currentTour())}
        data-tour="help"
        className={`fixed ${mobileBottom} md:bottom-6 left-4 md:left-6 z-40 flex items-center gap-1.5 h-10 pl-2.5 pr-3 md:pr-3.5 rounded-full bg-white text-[#141414] border border-gold-hairline shadow-lg hover:bg-[#F9F6F0] active:scale-95 transition-transform`}
        aria-label="How to order"
      >
        <HelpCircle className="w-5 h-5 text-[#8A6D1F]" />
        <span className="text-xs font-bold hidden sm:inline">How to order?</span>
        <span className="text-xs font-bold sm:hidden">Help</span>
      </button>

      {/* First-visit offer */}
      {showWelcome && (
        <div
          className={`fixed z-[45] left-4 right-4 ${mobileBottom} md:left-6 md:right-auto md:bottom-20 md:w-80 bg-white rounded-3xl border border-gold-hairline shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300`}
          role="dialog"
          aria-label="Shopping guide"
        >
          <button onClick={declineGuide} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-black" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3 pr-5">
            <div className="w-10 h-10 rounded-full bg-[#F2B705] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#141414]" />
            </div>
            <div>
              <p className="font-serif font-black text-sm text-[#141414]">Pehli dafa aaye hain? 👋</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                New here? Let us show you how to order in 30 seconds.
                <span className="block text-[#8A6D1F] font-semibold mt-0.5">Hum aap ko order karna sikhate hain.</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={acceptGuide} className="flex-1 py-2.5 rounded-full bg-[#141414] text-white text-xs font-bold">
              Show me how
            </button>
            <button onClick={declineGuide} className="px-4 py-2.5 rounded-full border border-gold-hairline text-xs font-bold text-gray-600">
              No thanks
            </button>
          </div>
        </div>
      )}
    </>
  );
};
