import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Camera, Heart, CheckCircle2, Sparkles, MapPin, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UgcWall: React.FC = () => {
  const { customerLooks, addCustomerLook, navigateToProduct, products } = useShop();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedProductSlug, setSelectedProductSlug] = useState(products[0]?.slug || '');
  const [caption, setCaption] = useState('');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !city || !caption) return;

    const matchedProduct = products.find((p) => p.slug === selectedProductSlug) || products[0];

    addCustomerLook({
      authorName,
      city,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1733470324488-d0e10d014d80?w=800&auto=format&fit=crop&q=80',
      productSlug: matchedProduct.slug,
      productName: matchedProduct.name,
      caption,
      verifiedPurchase: true
    });

    setIsUploadModalOpen(false);
    setAuthorName('');
    setCity('');
    setImageUrl('');
    setCaption('');
  };

  return (
    <section className="py-16 sm:py-24 border-t border-gold-hairline relative" id="community-ugc-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8A6D1F] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#F2B705]" />
              <span>Real Patrons • Real Craft</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#141414] leading-tight">
              Worn by Pakistan, <span className="italic font-normal">Every Day</span>.
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              No foreign stock photography. Real customers across Lahore, Karachi, and Islamabad styled in our unstitched lawn, 6-pound Boski silk, and 18K anti-tarnish jewelry.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="py-3 px-6 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all self-start md:self-auto active:scale-95"
          >
            <Camera className="w-4 h-4 text-[#F2B705]" />
            <span>Submit Your Look (+50 Points)</span>
          </button>
        </div>

        {/* Bento / Asymmetric Customer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {customerLooks.map((look, idx) => (
            <div
              key={look.id}
              className={`group bg-white rounded-3xl overflow-hidden border border-gold-hairline hover:border-gold-subtle shadow-xs hover:shadow-md transition-all duration-300 flex flex-col ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Photo */}
              <div className="relative aspect-4/5 w-full bg-[#F9F6F0] overflow-hidden">
                <img
                  src={look.imageUrl}
                  alt={look.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Location & Verified Badge */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                  <span className="bg-[#141414]/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#F2B705]" />
                    <span>{look.city}</span>
                  </span>
                </div>

                {look.verifiedPurchase && (
                  <span className="absolute top-3 right-3 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                )}
              </div>

              {/* Caption & Tagged Item */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span className="font-serif font-bold text-sm text-[#141414]">{look.authorName}</span>
                    <span className="text-[11px] text-gray-400">{look.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{look.caption}"
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Wearing:</span>
                    <span className="text-xs font-serif font-bold text-[#8A6D1F] truncate block">
                      {look.productName}
                    </span>
                  </div>

                  <button
                    onClick={() => navigateToProduct(look.productSlug)}
                    className="p-2 rounded-full bg-[#F9F6F0] hover:bg-[#141414] text-gray-700 hover:text-white transition-colors shrink-0"
                    title="Shop this look"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gold-hairline overflow-hidden"
            >
              <div className="bg-[#141414] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#8A6D1F]/30 flex items-center justify-center text-[#F2B705]">
                    <Camera className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">
                      Share Your Look
                    </h3>
                    <span className="text-[10px] text-[#F2B705] block">
                      Earn 50 Reward Points on your account
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ayesha M."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#9C7A28] text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">City / Area *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gulberg, Lahore"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#9C7A28] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Which product are you wearing?</label>
                  <select
                    value={selectedProductSlug}
                    onChange={(e) => setSelectedProductSlug(e.target.value)}
                    className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#9C7A28] text-xs"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name} (Rs. {p.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Image URL or Instagram photo link *</label>
                  <input
                    type="url"
                    placeholder="Paste link to your photo (or leave default for demo upload)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#9C7A28] text-xs"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    Tip: You can also tag @trendy_bazaar_pk on Instagram!
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Styling Notes / Review *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="How did you style this piece? How was the fit and fabric feel?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#9C7A28] text-xs resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="py-2.5 px-4 text-xs text-gray-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs rounded-full shadow-md"
                  >
                    Publish Look & Claim 50 Points
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
