import React, { useState } from 'react';
import { X, Ruler, CheckCircle2, Shirt, Baby, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'ladies' | 'mens' | 'kids';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'ladies'
}) => {
  const [activeTab, setActiveTab] = useState<'ladies' | 'mens' | 'kids'>(defaultCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-[#F2B705] flex items-center justify-center">
              <Ruler className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base sm:text-lg text-[#1A1A1A]">
                Pakistani Size & Measurement Guide
              </h3>
              <p className="text-[11px] text-gray-500">All measurements in inches (standard Pakistani cuts)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 my-4 bg-[#F7F3EC] p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('ladies')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ladies' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Ladies Pret</span>
          </button>
          <button
            onClick={() => setActiveTab('mens')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'mens' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Men's Kurta</span>
          </button>
          <button
            onClick={() => setActiveTab('kids')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'kids' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>Kids Punjabi</span>
          </button>
        </div>

        {/* Tab 1: Ladies Pret */}
        {activeTab === 'ladies' && (
          <div className="space-y-4 text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-gray-100 text-[#1A1A1A] font-bold text-[11px]">
                    <th className="p-2 rounded-l-lg">Size</th>
                    <th className="p-2">Chest</th>
                    <th className="p-2">Waist</th>
                    <th className="p-2">Hip</th>
                    <th className="p-2">Length</th>
                    <th className="p-2 rounded-r-lg">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-2 font-bold text-black">XS</td>
                    <td className="p-2">18.5"</td>
                    <td className="p-2">16.5"</td>
                    <td className="p-2">20.0"</td>
                    <td className="p-2">38.0"</td>
                    <td className="p-2">14.0"</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-2 font-bold text-black">S</td>
                    <td className="p-2">19.5"</td>
                    <td className="p-2">17.5"</td>
                    <td className="p-2">21.5"</td>
                    <td className="p-2">39.0"</td>
                    <td className="p-2">14.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-black">M</td>
                    <td className="p-2">21.0"</td>
                    <td className="p-2">19.0"</td>
                    <td className="p-2">23.0"</td>
                    <td className="p-2">40.0"</td>
                    <td className="p-2">15.0"</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-2 font-bold text-black">L</td>
                    <td className="p-2">23.0"</td>
                    <td className="p-2">21.0"</td>
                    <td className="p-2">25.0"</td>
                    <td className="p-2">41.0"</td>
                    <td className="p-2">15.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-black">XL</td>
                    <td className="p-2">25.0"</td>
                    <td className="p-2">23.0"</td>
                    <td className="p-2">27.0"</td>
                    <td className="p-2">42.0"</td>
                    <td className="p-2">16.0"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-500 flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#F2B705] shrink-0 mt-0.5" />
              <em>Note: Our stitched pret shirts have 1.5 inches of margin inside for easy loosening if needed.</em>
            </p>
          </div>
        )}

        {/* Tab 2: Men's Kurta & Shalwar Kameez */}
        {activeTab === 'mens' && (
          <div className="space-y-4 text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-gray-100 text-[#1A1A1A] font-bold text-[11px]">
                    <th className="p-2 rounded-l-lg">Size</th>
                    <th className="p-2">Collar</th>
                    <th className="p-2">Chest</th>
                    <th className="p-2">Kameez Length</th>
                    <th className="p-2">Sleeve</th>
                    <th className="p-2 rounded-r-lg">Shalwar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-2 font-bold text-black">Small</td>
                    <td className="p-2">14.5"</td>
                    <td className="p-2">21.0"</td>
                    <td className="p-2">39.0"</td>
                    <td className="p-2">23.5"</td>
                    <td className="p-2">38.0"</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-2 font-bold text-black">Medium</td>
                    <td className="p-2">15.5"</td>
                    <td className="p-2">22.5"</td>
                    <td className="p-2">41.0"</td>
                    <td className="p-2">24.5"</td>
                    <td className="p-2">40.0"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-black">Large</td>
                    <td className="p-2">16.5"</td>
                    <td className="p-2">24.0"</td>
                    <td className="p-2">43.0"</td>
                    <td className="p-2">25.5"</td>
                    <td className="p-2">42.0"</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-2 font-bold text-black">X-Large</td>
                    <td className="p-2">17.5"</td>
                    <td className="p-2">25.5"</td>
                    <td className="p-2">44.0"</td>
                    <td className="p-2">26.0"</td>
                    <td className="p-2">43.0"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-500 flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#F2B705] shrink-0 mt-0.5" />
              <em>Traditional Punjabi cuts feature relaxed shoulders and comfortable room around the chest.</em>
            </p>
          </div>
        )}

        {/* Tab 3: Kids Punjabi */}
        {activeTab === 'kids' && (
          <div className="space-y-4 text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-gray-100 text-[#1A1A1A] font-bold text-[11px]">
                    <th className="p-2 rounded-l-lg">Age Group</th>
                    <th className="p-2">Approx. Height</th>
                    <th className="p-2">Chest</th>
                    <th className="p-2">Kurti/Kameez Length</th>
                    <th className="p-2 rounded-r-lg">Waistband</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-2 font-bold text-black">2 - 3 Years</td>
                    <td className="p-2">36 - 38"</td>
                    <td className="p-2">13.0"</td>
                    <td className="p-2">20.0"</td>
                    <td className="p-2">Elastic stretch</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-2 font-bold text-black">4 - 5 Years</td>
                    <td className="p-2">40 - 43"</td>
                    <td className="p-2">14.0"</td>
                    <td className="p-2">23.0"</td>
                    <td className="p-2">Elastic stretch</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-black">6 - 7 Years</td>
                    <td className="p-2">45 - 48"</td>
                    <td className="p-2">15.5"</td>
                    <td className="p-2">26.0"</td>
                    <td className="p-2">Elastic stretch</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-2 font-bold text-black">8 - 9 Years</td>
                    <td className="p-2">50 - 53"</td>
                    <td className="p-2">16.5"</td>
                    <td className="p-2">29.0"</td>
                    <td className="p-2">Elastic stretch</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-black">10 - 12 Years</td>
                    <td className="p-2">55 - 58"</td>
                    <td className="p-2">18.0"</td>
                    <td className="p-2">32.0"</td>
                    <td className="p-2">Elastic stretch</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-500 flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#F2B705] shrink-0 mt-0.5" />
              <em>All kids ghararas and shalwars come with soft cotton inner lining to prevent itching.</em>
            </p>
          </div>
        )}

        {/* Measurement Tips */}
        <div className="mt-5 p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-[11px] space-y-1.5 text-gray-700">
          <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#F2B705]" />
            <span>Unsure about your exact fit?</span>
          </div>
          <p>
            Send your height and chest measurements directly to our WhatsApp stylist at <strong>+92 336 4300592</strong>. We will recommend the exact size before dispatching!
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-3 bg-[#1A1A1A] text-white font-bold text-xs rounded-full hover:bg-black transition-colors"
        >
          Got it, Close Size Guide
        </button>
      </motion.div>
    </div>
  );
};
