import React from 'react';
import { Scissors, Check, Sparkles } from 'lucide-react';

interface CustomStitchingSelectorProps {
  isStitchingSelected: boolean;
  onToggleStitching: (selected: boolean) => void;
  stitchingPrice: number;
  selectedStitchStyle: string;
  onSelectStitchStyle: (style: string) => void;
  customNotes: string;
  onChangeNotes: (notes: string) => void;
}

const STITCHING_STYLES = [
  { id: 'straight', name: 'Classic Straight Shirt & Trousers', desc: 'Neat pipings, straight cut pants with side slit' },
  { id: 'aline', name: 'A-Line Kurti & Culottes', desc: 'Slight flared hem with wide lace-inset pants' },
  { id: 'salwar', name: 'Traditional Punjabi Salwar Kameez', desc: 'Full-pleat comfortable Punjabi salwar' }
];

export const CustomStitchingSelector: React.FC<CustomStitchingSelectorProps> = ({
  isStitchingSelected,
  onToggleStitching,
  stitchingPrice,
  selectedStitchStyle,
  onSelectStitchStyle,
  customNotes,
  onChangeNotes
}) => {
  return (
    <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/40 border-2 border-amber-200/90 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F2B705] flex items-center justify-center shrink-0">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#1A1A1A]">
              <span>Lahore Master Darzi Stitching</span>
              <span className="text-[10px] bg-[#F2B705] text-[#1A1A1A] px-1.5 py-0.2 rounded font-black">
                POPULAR
              </span>
            </div>
            <p className="text-[11px] text-gray-600">
              Get this unstitched suit tailored to perfection before dispatch
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleStitching(!isStitchingSelected)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
            isStitchingSelected
              ? 'bg-[#1A1A1A] text-white shadow-xs'
              : 'bg-white text-gray-800 border border-gray-300 hover:border-black'
          }`}
        >
          {isStitchingSelected ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#F2B705]" />
              <span>Tailoring Added (+Rs. {stitchingPrice})</span>
            </>
          ) : (
            <span>+ Add Tailoring (Rs. {stitchingPrice})</span>
          )}
        </button>
      </div>

      {isStitchingSelected && (
        <div className="pt-3 border-t border-amber-200/70 space-y-3 text-xs animate-in fade-in">
          <div>
            <label className="block font-bold text-gray-800 mb-1.5">
              Choose Stitching Silhouette:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {STITCHING_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onSelectStitchStyle(style.name)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedStitchStyle === style.name
                      ? 'bg-white border-[#1A1A1A] ring-1 ring-[#1A1A1A] shadow-xs'
                      : 'bg-white/60 border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="font-bold text-[11px] text-[#1A1A1A]">{style.name}</div>
                  <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              Custom Measurements or Length Notes (Optional):
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => onChangeNotes(e.target.value)}
              placeholder="e.g., Shirt Length: 41 inches, Loose sleeves, Cigarette pants"
              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#F2B705]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-100/60 p-2 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-[#e0a700] shrink-0" />
            <span>
              Tailored with neat overlock & premium inner finishing. Adds 3-4 days to delivery.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
