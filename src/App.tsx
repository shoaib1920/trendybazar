import React, { lazy, Suspense } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OrderTrackModal } from './components/OrderTrackModal';
// The admin panel is loaded only when /admin is opened, keeping the store fast for customers.
const AdminManagerModal = lazy(() => import('./components/AdminManagerModal').then((m) => ({ default: m.AdminManagerModal })));
import { AiChatAssistant } from './components/AiChatAssistant';
import { GuidedTour } from './components/GuidedTour';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ExitIntentPromo } from './components/ExitIntentPromo';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  CheckCircle, 
  AlertCircle, 
  Info
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeView,
    toasts,
    removeToast
  } = useShop();

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'earbuds':
        return <ShopPage lockedCategory="electronics" />;
      case 'watches':
        return <ShopPage lockedCategory="accessories" />;
      case 'product':
        return <ProductDetailPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'track':
        return <OrderTrackModal />;
      case 'admin':
        return (
          <Suspense fallback={<div className="py-24 text-center text-xs text-gray-400">Loading admin…</div>}>
            <AdminManagerModal />
          </Suspense>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#141414]">
      {/* Toast Notification Stack */}
      {toasts.length > 0 && (
        <div className="fixed top-20 right-4 sm:right-6 z-[100] flex flex-col gap-2 max-w-sm">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              className="flex items-center gap-2.5 px-4 py-3 bg-[#141414] text-white rounded-2xl shadow-2xl border border-gold-hairline text-xs font-medium animate-in fade-in slide-in-from-top-4 duration-200 cursor-pointer"
            >
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#F2B705] shrink-0" />}
              <span className="flex-1 leading-tight">{toast.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar />

      {/* Main Dynamic View Content */}
      <main className="flex-1 pb-16 sm:pb-0">
        {renderActiveView()}
      </main>

      {/* Mobile Sticky Bottom Conversion Bar (Essential for Pakistani Mobile Traffic) */}
      <MobileBottomNav />

      {/* Footer */}
      <Footer />

      {/* Global Interactive Overlays */}
      <QuickViewModal />
      <CartDrawer />
      <CheckoutModal />
      {activeView !== 'admin' && <FloatingWhatsApp />}
      {activeView !== 'admin' && <AiChatAssistant />}
      <GuidedTour />
      <ExitIntentPromo />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
