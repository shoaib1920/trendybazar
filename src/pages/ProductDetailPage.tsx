import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CityDeliveryChecker } from '../components/CityDeliveryChecker';
import { CompleteTheLook } from '../components/CompleteTheLook';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { BackInStockModal } from '../components/BackInStockModal';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
  ChevronRight,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductSlug,
    addToCart,
    toggleWishlist,
    isInWishlist,
    getWhatsAppProductLink,
    setActiveView,
    showToast
  } = useShop();

  const product = products.find((p) => p.slug === selectedProductSlug) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors ? product.colors[0].name : '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'reviews'>('details');
  const [isBackInStockOpen, setIsBackInStockOpen] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const totalPrice = product.price * quantity;

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleWhatsAppOrder = () => {
    const details = selectedColor ? `Color: ${selectedColor}` : '';
    const msg = `Assalam-o-Alaikum Trendy Bazar! 👋
I would like to order:
🛍️ *${product.name}*
💰 Price: Rs. ${product.price}
${details ? `✨ Details: ${details}\n` : ''}🔗 Link: https://trendybazar.pk/product/${product.slug}

Please confirm availability and delivery time for Cash on Delivery!`;
    window.open(`https://wa.me/923364300592?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Trendy Bazar Pakistan!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 pb-24 md:pb-12" id="product-detail-view">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
        <button onClick={() => setActiveView('home')} className="hover:text-black">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <button onClick={() => setActiveView('shop')} className="hover:text-black capitalize">Shop</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-[#141414] font-serif font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <motion.div
            key={activeImageIndex}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-4/5 sm:aspect-square w-full rounded-3xl overflow-hidden bg-[#F9F6F0] border border-gold-hairline shadow-xs"
          >
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              {product.discountPercentage && (
                <span className="bg-red-700 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-sm">
                  Save {product.discountPercentage}%
                </span>
              )}
              {product.isNewDrop && (
                <span className="bg-[#8A6D1F] text-white text-xs font-serif font-bold px-3 py-1 rounded-full shadow-md">
                  New Drop
                </span>
              )}
            </div>

            {/* Floating Heart / Share Button */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 ${
                  isFavorited ? 'bg-white text-red-600' : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-600' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#9C7A28] shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Config & Purchase (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-gold-hairline pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8A6D1F] capitalize">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Star className="w-3.5 h-3.5 fill-[#F2B705] text-[#F2B705]" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#141414] leading-snug">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
              {product.tagline}
            </p>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-serif font-black text-2xl sm:text-3xl text-[#141414]">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm sm:text-base text-gray-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Color Selector if applicable */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-serif font-bold text-[#141414]">Selected Color:</span>
                <span className="text-gray-600 capitalize font-medium">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`group relative p-1 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? 'border-[#9C7A28] scale-110' : 'border-transparent hover:border-gray-300'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="w-7 h-7 rounded-full block border border-gray-200"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity counter */}
              <div className="flex items-center border border-gold-hairline rounded-full bg-[#F9F6F0] p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-xs">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                id="pdp-add-to-cart-btn"
                className="flex-1 py-3.5 px-6 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#F2B705]" />
                <span>Add to Bag • Rs. {totalPrice.toLocaleString()}</span>
              </button>
            </div>

            {/* WhatsApp Direct Order Button */}
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              id="pdp-whatsapp-btn"
              className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>Instant WhatsApp Order</span>
            </button>

            {/* Back In Stock Trigger Button */}
            <button
              type="button"
              onClick={() => setIsBackInStockOpen(true)}
              className="w-full py-2 text-[11px] text-gray-500 hover:text-black font-semibold flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3 h-3 text-[#8A6D1F]" />
              <span>Request restock notification</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-[#F9F6F0] p-5 rounded-2xl border border-gold-hairline space-y-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#8A6D1F] shrink-0" />
              <span><strong>2-4 Days Fast Delivery:</strong> Nationwide via Trax Logistics & Leopards Courier</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#8A6D1F] shrink-0" />
              <span><strong>7-Day Easy Exchange:</strong> Free replacement if a unit is faulty</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#8A6D1F] shrink-0" />
              <span><strong>Cash on Delivery (COD):</strong> Pay cash when your parcel arrives</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete The Look Bundling */}
      <CompleteTheLook currentProduct={product} />

      {/* Product Details Tabs */}
      <div className="pt-8 border-t border-gold-hairline">
        <div className="flex gap-2 border-b border-gold-hairline overflow-x-auto pb-3 scrollbar-none">
          {[
            { id: 'details', label: 'Specifications' },
            { id: 'shipping', label: 'Delivery & Returns' },
            { id: 'reviews', label: `Customer Reviews (${product.reviews?.length || product.reviewCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-5 rounded-full text-xs font-serif font-bold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#141414] text-white'
                  : 'bg-[#F9F6F0] text-gray-700 hover:text-black border border-gold-hairline'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6 max-w-3xl text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p className="leading-relaxed">{product.description}</p>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#141414] mb-2">Key Specs:</h4>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600">
                  {product.details.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#141414]">Nationwide Logistics:</h4>
              <p>
                Parcels are packed in tamper-proof bubble mailers and dispatched directly from our Lahore hub.
              </p>
              <div className="bg-[#F9F6F0] p-4 rounded-2xl space-y-2 border border-gold-hairline text-xs">
                <div>• <strong>Delivery Fee:</strong> Flat Rs. 150 (FREE on cart Rs. 3,500+)</div>
                <div>• <strong>Delivery Timeline:</strong> 2 to 4 working days via Trax Logistics & Leopards Courier with SMS tracking</div>
                <div>• <strong>Payment Methods:</strong> Cash on Delivery (COD), JazzCash, Easypaisa, Card</div>
                <div>• <strong>7-Day Exchange:</strong> Send a WhatsApp message to +92 336 4300592 with your order ID if the unit is faulty.</div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#141414]">
                    Verified Customer Reviews
                  </h4>
                  <p className="text-xs text-gray-500">Orders verified via WhatsApp & Website COD</p>
                </div>
                <div className="text-right">
                  <span className="font-serif font-black text-xl text-[#141414]">{product.rating}</span>
                  <div className="flex text-[#F2B705]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#F2B705]" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-[#F9F6F0] rounded-2xl space-y-1.5 border border-gold-hairline">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-[#141414] text-xs">{rev.userName}</span>
                          <span className="text-[10px] text-[#8A6D1F] font-semibold">{rev.userCity}</span>
                        </div>
                        <div className="flex gap-0.5 text-[#F2B705]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#F2B705]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 text-center">
                    All reviews verified from buyers across Lahore, Karachi & Islamabad.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* City Delivery Checker */}
      <div className="max-w-md">
        <CityDeliveryChecker />
      </div>

      {/* Recently Viewed Tray */}
      <RecentlyViewed currentProductId={product.id} />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-gold-hairline">
          <h3 className="font-serif font-black text-xl sm:text-2xl text-[#141414] mb-6">
            More from Trendy Bazar
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Purchase Bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gold-hairline px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-gray-500 block">Total Price:</span>
          <span className="font-serif font-bold text-sm text-[#141414]">
            Rs. {totalPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleWhatsAppOrder}
            className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm"
            title="Buy on WhatsApp"
          >
            <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
          </button>

          <button
            onClick={handleAddToCart}
            className="py-2.5 px-4 bg-[#141414] text-white text-xs font-serif font-bold rounded-full flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#F2B705]" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Back In Stock Modal */}
      <BackInStockModal
        product={product}
        isOpen={isBackInStockOpen}
        onClose={() => setIsBackInStockOpen(false)}
      />
    </div>
  );
};
