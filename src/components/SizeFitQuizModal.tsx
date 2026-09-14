import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Ruler, CheckCircle2, X, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SizeFitQuizModal: React.FC = () => {
  const { isSizeQuizOpen, setIsSizeQuizOpen, setRecommendedSize, showToast } = useShop();

  const [step, setStep] = useState(1);
  const [department, setDepartment] = useState<'ladies' | 'mens'>('ladies');
  const [usualBrand, setUsualBrand] = useState('Khaadi');
  const [usualSize, setUsualSize] = useState('Medium');
  const [fitPreference, setFitPreference] = useState('Classic Tailored');
  const [heightProfile, setHeightProfile] = useState("5'3\" – 5'6\" (Standard)");
  const [calculatedSize, setCalculatedSize] = useState<string | null>(null);

  if (!isSizeQuizOpen) return null;

  const handleCalculate = () => {
    // Determine recommendation based on inputs
    let rec = 'M';
    if (usualSize === 'Small' || usualSize === 'XS') {
      rec = fitPreference === 'Relaxed & Breezy' ? 'M' : 'S';
    } else if (usualSize === 'Large') {
      rec = fitPreference === 'Classic Tailored' ? 'L' : 'XL';
    } else if (usualSize === 'XL') {
      rec = 'XL';
    } else {
      rec = fitPreference === 'Slim Fit' ? 'S' : 'M';
    }

    setCalculatedSize(rec);
    setRecommendedSize(rec);
    setStep(4);
  };

  const handleApplySize = () => {
    if (calculatedSize) {
      setRecommendedSize(calculatedSize);
      showToast(`Applied recommended size "${calculatedSize}" to your session!`, 'success');
      setIsSizeQuizOpen(false);
      setStep(1);
    }
  };

  const handleClose = () => {
    setIsSizeQuizOpen(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gold-hairline overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#141414] text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#9C7A28]/30 border border-gold-hairline flex items-center justify-center text-[#F2B705]">
                <Ruler className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#F2B705] font-semibold">
                  Personal Tailoring Concierge
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  Size & Fit Advisor
                </h3>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-1.5 mt-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  step >= i ? 'bg-[#F2B705]' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-base text-[#141414]">
                1. Which department are you shopping for?
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDepartment('ladies')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    department === 'ladies'
                      ? 'border-[#141414] bg-[#F9F6F0] shadow-xs'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className="font-serif font-bold text-sm block text-[#141414]">Ladies Pret & Suits</span>
                  <span className="text-xs text-gray-500 mt-1 block">Kurtis, 3-Piece Lawn & Silk Pret</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDepartment('mens')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    department === 'mens'
                      ? 'border-[#141414] bg-[#F9F6F0] shadow-xs'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className="font-serif font-bold text-sm block text-[#141414]">Men's Kurta & Boski</span>
                  <span className="text-xs text-gray-500 mt-1 block">Punjabi Kurtas, Boski & Latha</span>
                </button>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-6 bg-[#141414] hover:bg-black text-white text-xs font-bold rounded-full flex items-center gap-2"
                >
                  <span>Next: Brand Reference</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-base text-[#141414]">
                2. What size do you usually wear in Pakistani high-street brands?
              </h4>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Brand Benchmark:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Khaadi', 'Sapphire', 'J. (Junaid Jamshed)', 'Generation', 'Sana Safinaz', 'Limelight'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setUsualBrand(b)}
                      className={`py-2 px-3 text-xs rounded-xl border font-medium truncate ${
                        usualBrand === b
                          ? 'border-[#9C7A28] bg-amber-50 text-[#8A6D1F] font-bold'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Your Size in {usualBrand}:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['XS', 'Small', 'Medium', 'Large', 'XL'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setUsualSize(s)}
                      className={`py-2.5 text-xs rounded-xl border font-bold ${
                        usualSize === s
                          ? 'border-[#141414] bg-[#141414] text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-black font-semibold"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-3 px-6 bg-[#141414] hover:bg-black text-white text-xs font-bold rounded-full flex items-center gap-2"
                >
                  <span>Next: Silhouette & Height</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-base text-[#141414]">
                3. How do you prefer your apparel to sit?
              </h4>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Drape & Cut Preference:
                </label>
                <div className="space-y-2">
                  {[
                    { title: 'Classic Tailored', desc: 'Standard Pakistani fit with comfortable bust and shoulder room' },
                    { title: 'Relaxed & Breezy', desc: 'Slightly loose silhouette, ideal for summer lawn & casual kurtis' },
                    { title: 'Smart Straight Cut', desc: 'Close-to-body profile, popular for structured kurtas and formal pret' }
                  ].map((f) => (
                    <button
                      key={f.title}
                      type="button"
                      onClick={() => setFitPreference(f.title)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-start justify-between ${
                        fitPreference === f.title
                          ? 'border-[#9C7A28] bg-amber-50/60'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-[#141414] block">{f.title}</span>
                        <span className="text-[11px] text-gray-500">{f.desc}</span>
                      </div>
                      {fitPreference === f.title && (
                        <CheckCircle2 className="w-4 h-4 text-[#8A6D1F] shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Height Proportion:
                </label>
                <select
                  value={heightProfile}
                  onChange={(e) => setHeightProfile(e.target.value)}
                  className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 outline-none"
                >
                  <option value="Under 5'2&quot; (Petite / Need 38&quot; Shirt)">Under 5'2" (Petite • Prefer 38" Length)</option>
                  <option value="5'3&quot; – 5'6&quot; (Standard)">5'3" – 5'6" (Standard • 40" - 42" Length)</option>
                  <option value="5'7&quot; and above (Tall / Need 44&quot; Shirt)">5'7" and above (Tall • 44" - 46" Length)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-gray-500 hover:text-black font-semibold"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleCalculate}
                  className="py-3 px-6 bg-[#F2B705] hover:bg-[#D9A404] text-[#141414] font-serif font-bold text-xs rounded-full flex items-center gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reveal My Best Size</span>
                </button>
              </div>
            </div>
          )}

          {step === 4 && calculatedSize && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">
                  Your Personal Match
                </span>
                <h3 className="font-serif font-black text-3xl text-[#141414]">
                  Size {calculatedSize}
                </h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto mt-2 leading-relaxed">
                  Based on your reference from <strong>{usualBrand} ({usualSize})</strong> with a <strong>{fitPreference}</strong> cut, Trendy Bazaar’s <strong>Size {calculatedSize}</strong> will drape flawlessly without pulling at the arms or bust.
                </p>
              </div>

              <div className="bg-[#F9F6F0] p-4 rounded-2xl border border-gold-hairline text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Chest / Bust:</span>
                  <span className="font-bold text-[#141414]">
                    {calculatedSize === 'S' ? '36 inches' : calculatedSize === 'M' ? '39 inches' : calculatedSize === 'L' ? '42 inches' : '45 inches'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Standard Shirt Length:</span>
                  <span className="font-bold text-[#141414]">40 - 42 inches</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Exchange Guarantee:</span>
                  <span className="font-bold text-emerald-700">Doorstep 7-Day Free Swap</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={handleApplySize}
                  className="py-3 px-6 bg-[#141414] hover:bg-black text-white text-xs font-bold rounded-full shadow-md transition-all"
                >
                  Use Size {calculatedSize} For Shopping
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 text-xs text-gray-600 hover:text-black font-semibold flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
