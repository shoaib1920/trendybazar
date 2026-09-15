import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LookbookPage } from './pages/LookbookPage';
import { OrderTrackModal } from './components/OrderTrackModal';
import { AdminManagerModal } from './components/AdminManagerModal';
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
    toast 
  } = useShop();

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'lookbook':
        return <LookbookPage />;
      case 'track':
        return <OrderTrackModal />;
      case 'admin':
        return <AdminManagerModal />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#141414]">
      {/* Toast Notification Popup */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#141414] text-white rounded-2xl shadow-2xl border border-gold-hairline text-xs font-medium animate-in fade-in slide-in-from-top-4 duration-200 max-w-sm">
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#F2B705] shrink-0" />}
          <span className="flex-1 leading-tight">{toast.message}</span>
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
      <FloatingWhatsApp />
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
