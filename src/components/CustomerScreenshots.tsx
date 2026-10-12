import React, { useEffect, useState } from 'react';
import { FeedbackScreenshot } from '../types';
import { subscribeFeedbackScreenshots } from '../lib/reviewsService';
import { optimizeImage } from '../lib/images';
import { ImageZoomViewer } from './ImageZoomViewer';

// "What our customers say": screenshots of real customer messages uploaded
// from the admin panel. Renders nothing until at least one is uploaded.
export const CustomerScreenshots: React.FC = () => {
  const [screenshots, setScreenshots] = useState<FeedbackScreenshot[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => subscribeFeedbackScreenshots(setScreenshots), []);

  if (screenshots.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="font-serif font-black text-xl sm:text-2xl text-[#141414]">What Our Customers Say</h2>
      <p className="text-xs text-gray-500 mt-1 mb-5">Messages our customers sent us after receiving their orders</p>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {screenshots.map((shot, index) => (
          <button
            key={shot.id}
            onClick={() => setOpenIndex(index)}
            className="w-44 sm:w-52 aspect-9/16 shrink-0 rounded-2xl overflow-hidden border border-gold-hairline bg-[#F9F6F0] cursor-zoom-in"
          >
            <img src={optimizeImage(shot.imageUrl, 500)} alt="Customer message" loading="lazy" className="w-full h-full object-cover object-top" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <ImageZoomViewer
          images={screenshots.map((s) => s.imageUrl)}
          startIndex={openIndex}
          alt="Customer message"
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
};
