import React, { useState } from 'react';
import { optimizeImage } from '../lib/images';
import { useShop, productKeyFor } from '../context/ShopContext';
import { X, ShoppingBag, MessageCircle, Star, Truck, ArrowRight } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    navigateToProduct, 
    getWhatsAppProductLink,
    products
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentColor = selectedColor || (product.colors ? product.colors[0].name : '');

  const handleClose = () => {
    setQuickViewProduct(null);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, currentColor);
    handleClose();
  };

  const handleOrderOnWhatsApp = () => {
    const link = getWhatsAppProductLink(product, currentColor);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleFullDetails = () => {
    handleClose();
    navigateToProduct(productKeyFor(product, products));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
        id="quick-view-modal-content"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Gallery Side */}
          <div className="space-y-3">
            <div className="relative aspect-square sm:aspect-4/5 rounded-2xl overflow-hidden bg-[#F7F3EC] border border-gray-100">
              <img
                src={optimizeImage(product.images[selectedImageIndex] || product.images[0], 900)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPercentage && (
                <span className="absolute top-3 left-3 bg-[#1A1A1A] text-[#F2B705] text-xs font-black px-2.5 py-1 rounded-full">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-[#F2B705] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={optimizeImage(img, 160)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F2B705]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1A1A1A] leading-snug mb-1">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black text-[#1A1A1A]">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                  In Stock (COD Ready)
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-bold text-gray-800">Color:</span>
                    <span className="text-gray-500">{currentColor}</span>
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          currentColor === c.name ? 'border-[#F2B705] scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-gray-800">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#F2B705]" />
                  <span>Add to Bag</span>
                </button>
                <button
                  onClick={handleOrderOnWhatsApp}
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Buy on WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#F2B705]" />
                  <span>2-4 Days Delivery • COD</span>
                </div>
                <button
                  onClick={handleFullDetails}
                  className="text-[#1A1A1A] hover:text-[#e0a700] font-bold inline-flex items-center gap-1 underline underline-offset-2"
                >
                  <span>See Full Details & Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
