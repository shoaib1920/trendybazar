import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, Eye, ShoppingBag, MessageCircle, Star, Bell } from 'lucide-react';
import { BackInStockModal } from './BackInStockModal';

// Shown in place of a product image that fails to load (e.g. a bad URL
// pasted in the admin panel), so a 404 never collapses the card layout.
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23F9F6F0'/%3E%3Cg fill='none' stroke='%23D8CCA8' stroke-width='8'%3E%3Crect x='90' y='170' width='220' height='160' rx='10'/%3E%3Ccircle cx='150' cy='215' r='16'/%3E%3Cpath d='M90 300l55-55 40 40 60-60 65 65'/%3E%3C/g%3E%3C/svg%3E";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    navigateToProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct,
    getWhatsAppProductLink,
    t
  } = useShop();

  const [isBackInStockOpen, setIsBackInStockOpen] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleCardClick = () => {
    navigateToProduct(product.slug);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.colors ? product.colors[0].name : undefined);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getWhatsAppProductLink(product), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div 
        className="group relative bg-white rounded-2xl sm:rounded-3xl border border-gold-hairline hover:border-gold-subtle shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
        id={`product-card-${product.id}`}
      >
        {/* 1. Image Container (4:5 Editorial Aspect Ratio) */}
        <div 
          onClick={handleCardClick}
          className="relative aspect-4/5 w-full bg-[#F9F6F0] overflow-hidden cursor-pointer"
        >
          {/* Main Product Image */}
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Hover Secondary Image */}
          {product.images[1] && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
              className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out"
            />
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none z-10">
            {product.discountPercentage && (
              <span className="bg-red-700 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                -{product.discountPercentage}%
              </span>
            )}
            {product.isNewDrop && (
              <span className="bg-[#8A6D1F] text-white text-[9px] sm:text-[10px] font-serif font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                New Drop
              </span>
            )}
          </div>

          {/* Wishlist Heart Icon */}
          <button
            onClick={handleWishlist}
            id={`wishlist-toggle-${product.id}`}
            className={`absolute top-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 z-10 ${
              isFavorited 
                ? 'bg-white text-red-600 shadow-md scale-105' 
                : 'bg-white/85 text-gray-700 hover:bg-white hover:text-black shadow-xs'
            }`}
            title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-600 text-red-600' : ''}`} />
          </button>

          {/* Low Stock or Restock Notice */}
          {product.inStock && product.stockCount <= 4 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBackInStockOpen(true);
              }}
              className="absolute bottom-2 left-2 right-2 bg-[#141414]/90 backdrop-blur-xs text-[#F2B705] text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-lg text-center flex items-center justify-center gap-1 hover:bg-black transition-colors"
            >
              <Bell className="w-3 h-3" />
              <span>Only {product.stockCount} left • Get alert</span>
            </button>
          )}

          {/* Quick View Button (Desktop Hover) */}
          <div className="absolute inset-x-3 bottom-3 hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={handleQuickView}
              className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-[#141414] font-serif text-xs font-bold rounded-full shadow-md flex items-center justify-center gap-1.5 backdrop-blur-sm transition-all hover:scale-[1.02]"
            >
              <Eye className="w-3.5 h-3.5 text-[#8A6D1F]" />
              <span>{t('quickView')}</span>
            </button>
          </div>
        </div>

        {/* 2. Content Details */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs text-gray-500 mb-1">
              <span className="capitalize font-serif font-bold text-[#8A6D1F] tracking-tight truncate">
                {product.category}
              </span>
              <div className="flex items-center gap-0.5 text-[10px] sm:text-[11px] text-gray-600 shrink-0">
                <Star className="w-3 h-3 fill-[#F2B705] text-[#F2B705]" />
                <span className="font-semibold">{product.rating}</span>
              </div>
            </div>

            {/* Product Name */}
            <h3 
              onClick={handleCardClick}
              className="font-serif font-bold text-xs sm:text-[14px] text-[#141414] line-clamp-2 leading-snug cursor-pointer hover:text-[#8A6D1F] transition-colors mb-1 min-h-[32px] sm:min-h-[38px]"
              title={product.name}
            >
              {product.name}
            </h3>

            {/* Micro specs */}
            <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1 mb-2 font-sans">
              {product.tagline}
            </p>
          </div>

          <div>
            {/* Pricing */}
            <div className="flex items-baseline gap-1.5 mb-2.5">
              <span className="font-serif font-bold text-xs sm:text-base text-[#141414]">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Action CTAs */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
              <button
                onClick={handleQuickAdd}
                id={`quick-add-btn-${product.id}`}
                className="col-span-3 sm:col-span-4 bg-[#141414] hover:bg-black text-white text-[11px] sm:text-xs font-serif font-bold py-2.5 px-2 rounded-xl sm:rounded-full flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
              >
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F2B705]" />
                <span className="truncate">{t('addToBag')}</span>
              </button>

              <button
                onClick={handleWhatsApp}
                id={`whatsapp-order-btn-${product.id}`}
                className="col-span-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl sm:rounded-full flex items-center justify-center transition-colors py-2"
                title="Order on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-emerald-600 text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <BackInStockModal
        product={product}
        isOpen={isBackInStockOpen}
        onClose={() => setIsBackInStockOpen(false)}
      />
    </>
  );
};
