import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';

interface CompleteTheLookProps {
  currentProduct: Product;
}

export const CompleteTheLook: React.FC<CompleteTheLookProps> = ({ currentProduct }) => {
  const { products, addToCart, navigateToProduct, showToast } = useShop();

  // Pick 2 complementary items: one accessory and another distinct item
  const bundleCandidates = products.filter((p) => p.id !== currentProduct.id);
  const accessory = bundleCandidates.find((p) => p.category === 'accessories') || bundleCandidates[0];
  const secondary = bundleCandidates.find((p) => p.id !== accessory?.id) || bundleCandidates[1];

  const bundleItems = [currentProduct, accessory, secondary].filter((p): p is Product => Boolean(p));

  const [selectedItems, setSelectedItems] = useState<string[]>(bundleItems.map((b) => b.id));

  const toggleItem = (id: string) => {
    if (id === currentProduct.id) return; // Keep current product
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeBundleProducts = bundleItems.filter((item) => selectedItems.includes(item.id));
  const rawTotal = activeBundleProducts.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscount = activeBundleProducts.length >= 2 ? Math.round(rawTotal * 0.12) : 0; // 12% bundle savings
  const bundleTotal = rawTotal - bundleDiscount;

  const handleAddBundleToBag = () => {
    activeBundleProducts.forEach((p) => {
      addToCart(p, 1, p.colors ? p.colors[0].name : undefined);
    });
    showToast(`Added ${activeBundleProducts.length} items to bag with bundle discount!`, 'success');
  };

  if (bundleItems.length < 2) return null;

  return (
    <div className="bg-[#F9F6F0] rounded-3xl p-6 sm:p-8 border border-gold-hairline space-y-6" id="complete-the-look-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-hairline/60 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8A6D1F] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B705]" />
            <span>Bundle & Save</span>
          </div>
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#141414]">
            Complete Your Setup
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Frequently bought together. Bundle and save 12% instantly.
          </p>
        </div>

        {bundleDiscount > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#8A6D1F]/15 text-[#8A6D1F] px-3 py-1 rounded-full border border-[#8A6D1F]/20">
            Bundle Savings: Rs. {bundleDiscount.toLocaleString()}
          </span>
        )}
      </div>

      {/* Items Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Product Cards Row (8 cols) */}
        <div className="md:col-span-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          {bundleItems.map((item, idx) => {
            const isSelected = selectedItems.includes(item.id);
            const isMain = item.id === currentProduct.id;

            return (
              <React.Fragment key={item.id}>
                <div
                  onClick={() => !isMain && toggleItem(item.id)}
                  className={`flex-1 w-full bg-white rounded-2xl p-3 border transition-all cursor-pointer relative ${
                    isSelected ? 'border-[#9C7A28] shadow-xs' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-gray-50 mb-2">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isMain) toggleItem(item.id);
                      }}
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isSelected ? 'bg-[#141414] text-white' : 'bg-white/80 text-gray-400'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 text-[#F2B705]" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>

                    {isMain && (
                      <span className="absolute bottom-1.5 left-1.5 bg-[#141414]/90 text-[9px] text-[#F2B705] font-bold px-2 py-0.5 rounded-md">
                        This Item
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-xs text-[#141414] line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xs font-bold text-[#8A6D1F]">
                      Rs. {item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && (
                      <span className="text-[10px] text-gray-400 line-through">
                        Rs. {item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {idx < bundleItems.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-[#141414]/5 text-gray-400 text-xs shrink-0 font-bold">
                    +
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Pricing Summary & Bundle Add (4 cols) */}
        <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-gold-hairline space-y-3">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Selected ({activeBundleProducts.length} items):</span>
              <span>Rs. {rawTotal.toLocaleString()}</span>
            </div>
            {bundleDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Bundle Saving (12%):</span>
                <span>-Rs. {bundleDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-serif font-black text-base text-[#141414] pt-2 border-t border-gray-100">
              <span>Set Total:</span>
              <span>Rs. {bundleTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleAddBundleToBag}
            className="w-full py-3.5 px-4 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#F2B705]" />
            <span>Add Complete Set to Bag</span>
          </button>

          <span className="text-[10px] text-gray-400 text-center block">
            Nationwide Free Delivery & 7-Day Exchange included
          </span>
        </div>
      </div>
    </div>
  );
};
