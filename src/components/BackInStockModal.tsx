import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { Bell, X, CheckCircle2, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface BackInStockModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BackInStockModal: React.FC<BackInStockModalProps> = ({ product, isOpen, onClose }) => {
  const { registerBackInStock } = useShop();
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    registerBackInStock(product.id, product.name, contact.trim());
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setContact('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gold-hairline overflow-hidden"
      >
        <div className="bg-[#141414] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#8A6D1F]/30 flex items-center justify-center text-[#F2B705]">
              <Bell className="w-4 h-4" />
            </span>
            <h3 className="font-serif font-bold text-base text-white">
              Restock Priority Alert
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center space-y-3 py-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#141414]">Alert Registered!</h4>
              <p className="text-xs text-gray-600">
                You're in line. We will ping <strong>{contact}</strong> via WhatsApp as soon as our Lahore workshop finishes the next batch of <strong>{product.name}</strong>.
              </p>
              <button
                onClick={handleClose}
                className="py-2.5 px-6 bg-[#141414] text-white text-xs font-bold rounded-full mt-2"
              >
                Back to Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-[#F9F6F0] rounded-2xl border border-gray-100">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-14 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#141414] line-clamp-1">{product.name}</h4>
                  <span className="text-[11px] font-bold text-[#8A6D1F]">Rs. {product.price.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">High demand • Crafting next batch</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Your WhatsApp Number or Email:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="03XX-XXXXXXX or your@email.com"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl p-3 outline-none focus:border-[#9C7A28] focus:bg-white text-xs"
                  />
                  <MessageCircle className="w-4 h-4 text-emerald-600 absolute right-3 top-3 pointer-events-none" />
                </div>
                <span className="text-[10px] text-gray-400 block mt-1">
                  We only send one notification when your size/item is ready. No spam.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#141414] hover:bg-black text-white font-serif font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-md"
              >
                <Bell className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>Notify Me First on Restock</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
