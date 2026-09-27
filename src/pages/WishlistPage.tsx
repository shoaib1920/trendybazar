import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setActiveView } = useShop();

  const favoritedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="wishlist-page">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 mb-1">
            <Heart className="w-4 h-4 fill-red-500" />
            <span>Saved Favorites</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A]">
            My Wishlist ({favoritedProducts.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Keep track of items you love. Ready to buy with Cash on Delivery or order on WhatsApp!
          </p>
        </div>

        <button
          onClick={() => setActiveView('shop')}
          className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1.5 py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {favoritedProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#F7F3EC]/50 rounded-3xl border border-gray-200/80 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Tap the heart icon on any piece in our collection to save your favorite streetwear or jewelry for later.
          </p>
          <button
            onClick={() => setActiveView('shop')}
            className="py-3 px-8 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs rounded-full shadow-md transition-all"
          >
            Explore Catalog Drops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {favoritedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
