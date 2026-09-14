import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { History, Sparkles } from 'lucide-react';

export const RecentlyViewed: React.FC<{ currentProductId?: string }> = ({ currentProductId }) => {
  const { recentlyViewedSlugs, products } = useShop();

  const viewedProducts = recentlyViewedSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && p.id !== currentProductId)
    .slice(0, 4);

  if (viewedProducts.length === 0) return null;

  return (
    <section className="pt-12 pb-6 border-t border-gold-hairline" id="recently-viewed-section">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#8A6D1F]/15 flex items-center justify-center text-[#8A6D1F]">
            <History className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-serif font-bold text-xl text-[#141414]">
              Recently Viewed
            </h3>
            <span className="text-xs text-gray-500">Pick up where you left off</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {viewedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
