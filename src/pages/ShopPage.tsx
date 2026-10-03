import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { discountLabel } from '../lib/discountsService';
import { ProductCard } from '../components/ProductCard';
import { WATCH_STYLES } from '../data/categories';
import {
  SlidersHorizontal,
  X,
  Sparkles,
  RotateCcw,
  Zap,
  Headphones,
  ShoppingBag as BagIcon,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShopPageProps {
  // When set, this page is dedicated to a single category (a separate
  // "page" from the user's point of view): the cross-category switcher
  // is hidden and the category can't be changed away from here.
  lockedCategory?: 'electronics' | 'accessories';
}

export const ShopPage: React.FC<ShopPageProps> = ({ lockedCategory }) => {
  const {
    products,
    shopCategoryFilter,
    setShopCategoryFilter,
    shopSubCategoryFilter,
    setShopSubCategoryFilter,
    searchQuery,
    setSearchQuery,
    featuredDiscount
  } = useShop();

  const [selectedSort, setSelectedSort] = useState<'popularity' | 'newest' | 'price-asc' | 'price-desc'>('popularity');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (lockedCategory) setShopCategoryFilter(lockedCategory);
  }, [lockedCategory]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (shopCategoryFilter !== 'all' && product.category !== shopCategoryFilter) {
          return false;
        }
        if (shopSubCategoryFilter !== 'all' && product.subCategory !== shopSubCategoryFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchTag = product.tagline.toLowerCase().includes(q);
          const matchCat = product.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchTag && !matchCat) return false;
        }
        if (product.price > maxPrice) {
          return false;
        }
        if (inStockOnly && !product.inStock) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'price-asc') return a.price - b.price;
        if (selectedSort === 'price-desc') return b.price - a.price;
        if (selectedSort === 'newest') return (b.isNewDrop ? 1 : 0) - (a.isNewDrop ? 1 : 0);
        return b.reviewCount * b.rating - a.reviewCount * a.rating;
      });
  }, [products, shopCategoryFilter, shopSubCategoryFilter, searchQuery, maxPrice, inStockOnly, selectedSort]);

  const handleResetFilters = () => {
    setShopCategoryFilter(lockedCategory || 'all');
    setShopSubCategoryFilter('all');
    setSearchQuery('');
    setMaxPrice(5000);
    setInStockOnly(false);
    setSelectedSort('popularity');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8" id="shop-catalog-page">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A]">
          {shopSubCategoryFilter !== 'all'
            ? WATCH_STYLES.find((s) => s.id === shopSubCategoryFilter)?.label + ' Watches'
            : lockedCategory === 'electronics' || shopCategoryFilter === 'electronics'
            ? 'Earbuds'
            : lockedCategory === 'accessories' || shopCategoryFilter === 'accessories'
            ? 'Watches & Accessories'
            : 'All Products'}
        </h1>
      </motion.div>

      {/* Category Quick Pill Navigation (hidden on a dedicated Earbuds/Watches page) */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {!lockedCategory && <span className="text-xs font-bold text-gray-400 mr-1 hidden sm:inline">Explore:</span>}
          {!lockedCategory &&
            [
              { id: 'all', label: 'All Products', icon: null },
              { id: 'electronics', label: 'Earbuds', icon: Headphones },
              { id: 'accessories', label: 'Watches', icon: BagIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setShopCategoryFilter(tab.id);
                  setShopSubCategoryFilter('all');
                }}
                className={`flex items-center gap-1.5 py-2 px-3.5 sm:px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  shopCategoryFilter === tab.id
                    ? 'bg-[#1A1A1A] text-white shadow-sm ring-2 ring-[#1A1A1A]'
                    : 'bg-[#F7F3EC] text-gray-700 hover:text-black hover:bg-gray-200'
                }`}
              >
                {tab.icon && <tab.icon className={`w-3.5 h-3.5 ${shopCategoryFilter === tab.id ? 'text-[#F2B705]' : 'text-[#8A6D1F]'}`} />}
                <span>{tab.label}</span>
              </button>
            ))}

          {/* Mobile Filter Sheet Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden ml-auto flex items-center gap-1.5 py-2 px-3 bg-[#1A1A1A] text-white text-xs font-bold rounded-full shadow-xs shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#F2B705]" />
            <span>Filters</span>
          </button>
        </div>

        {/* Watch Style Sub-Pills (shown when browsing Watches) */}
        {shopCategoryFilter === 'accessories' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-gray-400 mr-0.5 hidden sm:inline">Style:</span>
            <button
              onClick={() => setShopSubCategoryFilter('all')}
              className={`py-1.5 px-3 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all ${
                shopSubCategoryFilter === 'all'
                  ? 'bg-[#8A6D1F] text-white border-[#8A6D1F]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#8A6D1F]'
              }`}
            >
              All Styles
            </button>
            {WATCH_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setShopSubCategoryFilter(style.id)}
                className={`py-1.5 px-3 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all ${
                  shopSubCategoryFilter === style.id
                    ? 'bg-[#8A6D1F] text-white border-[#8A6D1F]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#8A6D1F]'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs self-start sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="font-heading font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#F2B705]" />
              <span>Filter Catalog</span>
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-gray-500 hover:text-red-600 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Watch Style / Product Type Filter */}
          {shopCategoryFilter === 'accessories' && (
            <div className="pt-2">
              <label className="block font-bold text-xs text-[#1A1A1A] mb-2">Watch Style</label>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => setShopSubCategoryFilter('all')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border text-left ${
                    shopSubCategoryFilter === 'all'
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  All Styles
                </button>
                {WATCH_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setShopSubCategoryFilter(style.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-left ${
                      shopSubCategoryFilter === style.id
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Slider */}
          <div>
            <label className="block font-bold text-xs text-[#1A1A1A] mb-2 flex justify-between">
              <span>Budget (PKR)</span>
              <span className="text-[#1A1A1A] font-black">Under Rs. {maxPrice.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#F2B705] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Rs. 500</span>
              <span>Rs. 5,000</span>
            </div>
          </div>

          {/* Stock Availability */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#F2B705] accent-[#F2B705]"
              />
              <span>In Stock Only (Ready for COD)</span>
            </label>
          </div>

          {/* Promo Offer */}
          {featuredDiscount && (
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200/70 text-xs">
              <div className="font-bold text-[#1A1A1A] flex items-center gap-1 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>Promo Code Active</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Use voucher <strong>{featuredDiscount.code}</strong> in your bag for {discountLabel(featuredDiscount)}!
              </p>
            </div>
          )}
        </aside>

        {/* Mobile Filter Sheet */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex lg:hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-[85%] max-w-xs bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="font-heading font-black text-base text-[#1A1A1A]">Filters</span>
                    <button onClick={() => setIsMobileFilterOpen(false)} className="p-1">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Category Filter (hidden on a dedicated Earbuds/Watches page) */}
                  {!lockedCategory && (
                    <div>
                      <label className="block font-bold text-xs text-[#1A1A1A] mb-2">Category</label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          { id: 'all', label: 'All Products' },
                          { id: 'electronics', label: 'Earbuds' },
                          { id: 'accessories', label: 'Watches' }
                        ].map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setShopCategoryFilter(c.id);
                              setShopSubCategoryFilter('all');
                            }}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border text-left ${
                              shopCategoryFilter === c.id
                                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Watch Style Filter */}
                  {shopCategoryFilter === 'accessories' && (
                    <div>
                      <label className="block font-bold text-xs text-[#1A1A1A] mb-2">Watch Style</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => setShopSubCategoryFilter('all')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border text-left ${
                            shopSubCategoryFilter === 'all'
                              ? 'bg-[#8A6D1F] text-white border-[#8A6D1F]'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          All Styles
                        </button>
                        {WATCH_STYLES.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setShopSubCategoryFilter(style.id)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border text-left ${
                              shopSubCategoryFilter === style.id
                                ? 'bg-[#8A6D1F] text-white border-[#8A6D1F]'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {style.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sort */}
                  <div>
                    <label className="block font-bold text-xs text-[#1A1A1A] mb-2">Sort By</label>
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value as typeof selectedSort)}
                      className="w-full text-xs font-semibold text-[#1A1A1A] bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 outline-none"
                    >
                      <option value="popularity">Featured</option>
                      <option value="newest">Newest</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block font-bold text-xs text-[#1A1A1A] mb-2 flex justify-between">
                      <span>Max Budget</span>
                      <span className="text-[#1A1A1A] font-black">Rs. {maxPrice.toLocaleString()}</span>
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#F2B705]"
                    />
                  </div>

                  {/* In Stock */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 accent-[#F2B705]"
                      />
                      <span>In Stock Only</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 space-y-2">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 bg-[#1A1A1A] text-white font-bold text-xs rounded-full shadow-md"
                  >
                    View Products ({filteredProducts.length})
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="w-full py-2 bg-gray-100 text-gray-700 font-semibold text-xs rounded-full"
                  >
                    Reset All
                  </button>
                </div>
              </motion.div>
              <div className="flex-1" onClick={() => setIsMobileFilterOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {/* Active Filter Badges */}
          {((!lockedCategory && shopCategoryFilter !== 'all') || shopSubCategoryFilter !== 'all' || searchQuery || maxPrice < 5000 || inStockOnly) && (
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="text-xs text-gray-500">Active:</span>
              {!lockedCategory && shopCategoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-[#1A1A1A] text-xs px-2.5 py-1 rounded-full font-semibold">
                  {shopCategoryFilter === 'accessories' ? 'watches' : shopCategoryFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => { setShopCategoryFilter('all'); setShopSubCategoryFilter('all'); }} />
                </span>
              )}
              {shopSubCategoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-[#1A1A1A] text-xs px-2.5 py-1 rounded-full font-semibold">
                  {WATCH_STYLES.find((s) => s.id === shopSubCategoryFilter)?.label}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setShopSubCategoryFilter('all')} />
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-[#F7F3EC] text-[#1A1A1A] text-xs px-2.5 py-1 rounded-full font-semibold">
                  "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
              {maxPrice < 5000 && (
                <span className="inline-flex items-center gap-1 bg-[#F7F3EC] text-[#1A1A1A] text-xs px-2.5 py-1 rounded-full font-semibold">
                  Under Rs. {maxPrice.toLocaleString()}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(5000)} />
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count + Sort */}
          <div className="text-xs text-gray-500 mb-3 flex items-center justify-between gap-3">
            <span className="shrink-0">Showing <strong className="text-[#1A1A1A]">{filteredProducts.length}</strong> items</span>
            <span className="text-emerald-700 font-medium hidden lg:inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-emerald-700" />
              <span>2-4 Days Fast Delivery across Pakistan</span>
            </span>
            <label className="flex items-center gap-1.5 shrink-0 bg-white border border-gray-200 rounded-full pl-3 pr-2 py-1.5">
              <ArrowUpDown className="w-3 h-3 text-[#8A6D1F]" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as typeof selectedSort)}
                className="text-xs font-semibold text-[#1A1A1A] bg-transparent outline-none cursor-pointer"
              >
                <option value="popularity">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-[#F7F3EC]/50 rounded-3xl p-12 text-center border border-gray-200/80">
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-2">
                No matching items found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                Try widening your price range or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="py-2.5 px-6 bg-[#1A1A1A] text-white text-xs font-bold rounded-full"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
