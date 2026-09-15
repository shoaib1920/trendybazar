import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  SlidersHorizontal,
  X,
  Sparkles,
  RotateCcw,
  Scissors,
  Check,
  Search,
  Filter,
  Shirt,
  Baby,
  Zap,
  Ribbon,
  Layers,
  Watch,
  Footprints,
  Glasses,
  Link2,
  SprayCan,
  Gem,
  ShoppingBag as BagIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductGender, StitchType } from '../types';

const SUB_CATEGORY_META: Record<string, { label: string; icon: any }> = {
  watches: { label: 'Watches', icon: Watch },
  shoes: { label: 'Shoes', icon: Footprints },
  sandals: { label: 'Sandals', icon: Footprints },
  sunglasses: { label: 'Sunglasses', icon: Glasses },
  cufflinks: { label: 'Cufflinks', icon: Link2 },
  cologne: { label: 'Fragrance', icon: SprayCan },
  jewelry: { label: 'Jewelry', icon: Gem },
  bags: { label: 'Bags', icon: BagIcon }
};

export const ShopPage: React.FC = () => {
  const {
    products,
    shopCategoryFilter,
    setShopCategoryFilter,
    shopGenderFilter,
    setShopGenderFilter,
    shopStitchFilter,
    setShopStitchFilter,
    shopSubCategoryFilter,
    setShopSubCategoryFilter,
    searchQuery,
    setSearchQuery
  } = useShop();

  const [selectedSort, setSelectedSort] = useState<'popularity' | 'newest' | 'price-asc' | 'price-desc'>('popularity');
  const [maxPrice, setMaxPrice] = useState<number>(13000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available Sizes in Pakistani clothing & accessories catalog
  const ALL_SIZES = ['all', 'XS', 'S', 'M', 'L', 'XL', 'Free Size'];

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Gender filter
        if (shopGenderFilter !== 'all') {
          if (product.gender !== shopGenderFilter && product.gender !== 'unisex') {
            return false;
          }
        }
        // Stitch filter
        if (shopStitchFilter !== 'all') {
          if (product.stitchType !== shopStitchFilter) {
            return false;
          }
        }
        // Category filter
        if (shopCategoryFilter !== 'all' && product.category !== shopCategoryFilter) {
          return false;
        }
        // Sub-category filter (e.g. watches, shoes, sunglasses within Accessories)
        if (shopSubCategoryFilter !== 'all') {
          if (product.subCategory !== shopSubCategoryFilter) {
            return false;
          }
        } else if (shopCategoryFilter === 'all' && !searchQuery.trim()) {
          // Default browse mode: keep Accessories out of the main clothing grid —
          // they're surfaced as suggestion chips below instead.
          if (product.category === 'accessories') {
            return false;
          }
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchTag = product.tagline.toLowerCase().includes(q);
          const matchCat = product.category.toLowerCase().includes(q);
          const matchFabric = product.fabric?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchTag && !matchCat && !matchFabric) return false;
        }
        // Price filter
        if (product.price > maxPrice) {
          return false;
        }
        // In stock
        if (inStockOnly && !product.inStock) {
          return false;
        }
        // Size filter
        if (selectedSize !== 'all') {
          if (!product.sizes || !product.sizes.includes(selectedSize)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'price-asc') return a.price - b.price;
        if (selectedSort === 'price-desc') return b.price - a.price;
        if (selectedSort === 'newest') return (b.isNewDrop ? 1 : 0) - (a.isNewDrop ? 1 : 0);
        // popularity
        return b.reviewCount * b.rating - a.reviewCount * a.rating;
      });
  }, [products, shopGenderFilter, shopStitchFilter, shopCategoryFilter, shopSubCategoryFilter, searchQuery, maxPrice, inStockOnly, selectedSize, selectedSort]);

  // Accessory sub-categories available for the current gender, shown as suggestion
  // chips below the main grid when browsing without an explicit category/sub-category.
  const accessorySuggestions = useMemo(() => {
    const seen = new Map<string, number>();
    products.forEach((product) => {
      if (product.category !== 'accessories' || !product.subCategory) return;
      if (shopGenderFilter !== 'all' && product.gender !== shopGenderFilter && product.gender !== 'unisex') return;
      seen.set(product.subCategory, (seen.get(product.subCategory) || 0) + 1);
    });
    return Array.from(seen.entries()).map(([key, count]) => ({ key, count }));
  }, [products, shopGenderFilter]);

  const showAccessorySuggestions =
    shopCategoryFilter === 'all' && shopSubCategoryFilter === 'all' && !searchQuery.trim() && accessorySuggestions.length > 0;

  const handleAccessorySuggestionClick = (subCategory: string) => {
    setShopCategoryFilter('accessories');
    setShopSubCategoryFilter(subCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setShopCategoryFilter('all');
    setShopSubCategoryFilter('all');
    setShopGenderFilter('all');
    setShopStitchFilter('all');
    setSearchQuery('');
    setMaxPrice(13000);
    setInStockOnly(false);
    setSelectedSize('all');
    setSelectedSort('popularity');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8" id="shop-catalog-page">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#F7F3EC] via-[#FAF6F0] to-[#F7F3EC] rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-6 border border-amber-200/60 shadow-xs"
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#1A1A1A] bg-[#F2B705] px-2.5 py-0.5 rounded-full">
              Trandy Libas Collection
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold hidden sm:inline">
              • COD Nationwide Available
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-[#1A1A1A] mt-1 mb-2">
            {shopSubCategoryFilter !== 'all'
              ? `${shopGenderFilter === 'ladies' ? "Women's" : shopGenderFilter === 'mens' ? "Men's" : ''} ${SUB_CATEGORY_META[shopSubCategoryFilter]?.label || ''}`.trim()
              : shopCategoryFilter === 'accessories'
              ? `${shopGenderFilter === 'ladies' ? "Women's" : shopGenderFilter === 'mens' ? "Men's" : ''} Accessories`.trim()
              : shopGenderFilter === 'ladies'
              ? 'Ladies Pakistani Punjabi Collection'
              : shopGenderFilter === 'mens'
              ? "Men's Kurta & Shalwar Kameez"
              : shopGenderFilter === 'kids'
              ? 'Kids Festive Punjabi Wear'
              : shopStitchFilter === 'stitched'
              ? 'Ready-to-Wear Stitched Pret'
              : shopStitchFilter === 'unstitched'
              ? 'Unstitched Suits & Premium Fabrics'
              : 'Pakistani Fashion & Lifestyle Collection'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            {shopSubCategoryFilter !== 'all'
              ? `Showing only ${SUB_CATEGORY_META[shopSubCategoryFilter]?.label.toLowerCase() || 'items'} — nothing else.`
              : 'Discover authentic Lawn, Boski Silk, Chiffon, Latha and Chikankari. Choose stitched ready-to-wear or get unstitched suits custom tailored by Lahore master darzis!'}
          </p>
        </div>
      </motion.div>

      {/* Gender & Category Quick Pill Navigation */}
      <div className="space-y-3 mb-6">
        {/* Gender Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-400 mr-1 hidden sm:inline">Explore:</span>
          {[
            { id: 'all', label: 'All Catalog', icon: null },
            { id: 'ladies', label: 'Ladies Collection', icon: Shirt },
            { id: 'mens', label: "Men's Wear", icon: Shirt },
            { id: 'kids', label: 'Kids Punjabi', icon: Baby }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setShopGenderFilter(tab.id as any);
                setShopCategoryFilter('all');
                setShopSubCategoryFilter('all');
              }}
              className={`flex items-center gap-1.5 py-2 px-3.5 sm:px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                shopGenderFilter === tab.id
                  ? 'bg-[#1A1A1A] text-white shadow-sm ring-2 ring-[#1A1A1A]'
                  : 'bg-[#F7F3EC] text-gray-700 hover:text-black hover:bg-gray-200'
              }`}
            >
              {tab.icon && <tab.icon className={`w-3.5 h-3.5 ${shopGenderFilter === tab.id ? 'text-[#F2B705]' : 'text-[#8A6D1F]'}`} />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Stitched vs. Unstitched Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#F7F3EC]/70 rounded-2xl border border-amber-100/80">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 px-1">
              <Scissors className="w-3.5 h-3.5 text-[#F2B705]" />
              <span>Tailoring:</span>
            </span>
            {[
              { id: 'all', label: 'All Types', icon: null },
              { id: 'stitched', label: 'Stitched Pret', icon: Ribbon },
              { id: 'unstitched', label: 'Unstitched Fabric', icon: Layers }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setShopStitchFilter(st.id as any)}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  shopStitchFilter === st.id
                    ? 'bg-[#F2B705] text-[#1A1A1A] shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-amber-100/60'
                }`}
              >
                {st.icon && <st.icon className="w-3.5 h-3.5" />}
                <span>{st.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Filter Sheet Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 py-1.5 px-3 bg-[#1A1A1A] text-white text-xs font-bold rounded-full shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F2B705]" />
              <span>Filters & Budget</span>
            </button>

            {/* Sort Select */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="bg-white border border-gray-200 text-xs font-semibold rounded-full py-1.5 px-3 outline-none cursor-pointer focus:border-[#F2B705]"
            >
              <option value="popularity">Popularity</option>
              <option value="newest">Newest Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
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

          {/* Price Range Slider */}
          <div>
            <label className="block font-bold text-xs text-[#1A1A1A] mb-2 flex justify-between">
              <span>Budget (PKR)</span>
              <span className="text-[#1A1A1A] font-black">Under Rs. {maxPrice.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="1000"
              max="13000"
              step="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#F2B705] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Rs. 1,000</span>
              <span>Rs. 13,000</span>
            </div>
          </div>

          {/* Apparel Sizes */}
          <div>
            <label className="block font-bold text-xs text-[#1A1A1A] mb-2">
              Size
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold border transition-colors ${
                    selectedSize === sz
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-black'
                  }`}
                >
                  {sz === 'all' ? 'All Sizes' : sz}
                </button>
              ))}
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
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200/70 text-xs">
            <div className="font-bold text-[#1A1A1A] flex items-center gap-1 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F2B705]" />
              <span>Promo Code Active</span>
            </div>
            <p className="text-[11px] text-gray-600">
              Use voucher <strong>TREND10</strong> at checkout for 10% off cart totals above Rs. 2,500!
            </p>
          </div>
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

                  {/* Gender Filter */}
                  <div>
                    <label className="block font-bold text-xs text-[#1A1A1A] mb-2">Category / Department</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'ladies', label: 'Ladies' },
                        { id: 'mens', label: 'Mens' },
                        { id: 'kids', label: 'Kids' }
                      ].map((g) => (
                        <button
                          key={g.id}
                          onClick={() => {
                            setShopGenderFilter(g.id as any);
                            setShopCategoryFilter('all');
                            setShopSubCategoryFilter('all');
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border text-center ${
                            shopGenderFilter === g.id
                              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stitch Type */}
                  <div>
                    <label className="block font-bold text-xs text-[#1A1A1A] mb-2">Stitching Option</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { id: 'all', label: 'All Stitched & Unstitched', icon: null },
                        { id: 'stitched', label: 'Stitched Ready-to-Wear', icon: Ribbon },
                        { id: 'unstitched', label: 'Unstitched Fabric', icon: Layers }
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setShopStitchFilter(s.id as any)}
                          className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border text-left ${
                            shopStitchFilter === s.id
                              ? 'bg-[#F2B705] text-[#1A1A1A] border-[#F2B705]'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {s.icon && <s.icon className="w-3.5 h-3.5" />}
                          <span>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block font-bold text-xs text-[#1A1A1A] mb-2 flex justify-between">
                      <span>Max Budget</span>
                      <span className="text-[#1A1A1A] font-black">Rs. {maxPrice.toLocaleString()}</span>
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="13000"
                      step="200"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#F2B705]"
                    />
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block font-bold text-xs text-[#1A1A1A] mb-2">Size</label>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_SIZES.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold border ${
                            selectedSize === sz ? 'bg-[#1A1A1A] text-white' : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
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

        {/* Product Grid Area (3 Cols Desktop, 2 Cols Mobile) */}
        <div className="lg:col-span-3">
          {/* Active Filter Badges */}
          {(shopGenderFilter !== 'all' || shopStitchFilter !== 'all' || shopCategoryFilter !== 'all' || shopSubCategoryFilter !== 'all' || searchQuery || maxPrice < 13000 || inStockOnly || selectedSize !== 'all') && (
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="text-xs text-gray-500">Active:</span>
              {shopGenderFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#F7F3EC] text-[#1A1A1A] text-xs px-2.5 py-1 rounded-full font-semibold">
                  {shopGenderFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setShopGenderFilter('all')} />
                </span>
              )}
              {shopSubCategoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#1A1A1A] text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                  {SUB_CATEGORY_META[shopSubCategoryFilter]?.label || shopSubCategoryFilter}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => {
                      setShopSubCategoryFilter('all');
                      setShopCategoryFilter('all');
                    }}
                  />
                </span>
              )}
              {shopCategoryFilter !== 'all' && shopSubCategoryFilter === 'all' && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-[#1A1A1A] text-xs px-2.5 py-1 rounded-full font-semibold">
                  {shopCategoryFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setShopCategoryFilter('all')} />
                </span>
              )}
              {shopStitchFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-[#1A1A1A] text-xs px-2.5 py-1 rounded-full font-semibold">
                  {shopStitchFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setShopStitchFilter('all')} />
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-[#F7F3EC] text-[#1A1A1A] text-xs px-2.5 py-1 rounded-full font-semibold">
                  "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
              {maxPrice < 13000 && (
                <span className="inline-flex items-center gap-1 bg-[#F7F3EC] text-[#1A1A1A] text-xs px-2.5 py-1 rounded-full font-semibold">
                  Under Rs. {maxPrice.toLocaleString()}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(13000)} />
                </span>
              )}
              {selectedSize !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#F7F3EC] text-[#1A1A1A] text-xs px-2.5 py-1 rounded-full font-semibold">
                  Size: {selectedSize}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSize('all')} />
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

          {/* Results Count */}
          <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
            <span>Showing <strong className="text-[#1A1A1A]">{filteredProducts.length}</strong> items</span>
            <span className="text-emerald-700 font-medium hidden sm:inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-emerald-700" />
              <span>2-4 Days Fast Delivery across Pakistan</span>
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-[#F7F3EC]/50 rounded-3xl p-12 text-center border border-gray-200/80">
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-2">
                No matching items found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                Try widening your price range or switching your gender/stitching filter.
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

          {/* Accessories Suggestions — shown below clothing, each chip opens ONLY that category */}
          {showAccessorySuggestions && (
            <div className="mt-10 pt-6 border-t border-gray-200/80">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#F2B705]" />
                <h3 className="font-heading font-bold text-sm text-[#1A1A1A]">
                  Complete the Look: Accessories
                </h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Finish the outfit — tap a category to see only those items.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {accessorySuggestions.map(({ key, count }) => {
                  const meta = SUB_CATEGORY_META[key];
                  if (!meta) return null;
                  const Icon = meta.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => handleAccessorySuggestionClick(key)}
                      className="flex items-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-[#1A1A1A] hover:border-[#F2B705] hover:bg-[#F7F3EC] transition-all shadow-xs"
                    >
                      <Icon className="w-4 h-4 text-[#8A6D1F]" />
                      <span>{meta.label}</span>
                      <span className="text-gray-400 font-semibold">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
