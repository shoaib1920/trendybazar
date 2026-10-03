import React, { useState } from 'react';
import { AbandonedCart, PlacedOrder } from '../../types';
import { formatOrderDate } from '../OrderReceipt';
import { formatRs, toWhatsAppNumber } from './adminUtils';
import { CheckCircle2, MessageCircle, ShoppingCart, Trash2 } from 'lucide-react';

interface AdminAbandonedCartsProps {
  carts: AbandonedCart[];
  orders: PlacedOrder[];
  isCloud: boolean;
  updateCart: (phoneKey: string, patch: Partial<AbandonedCart>) => Promise<void>;
  deleteCart: (phoneKey: string) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

// Give customers a little time to finish before showing their cart here.
const MINUTES_BEFORE_ABANDONED = 30;

const nudgeMessage = (cart: AbandonedCart) => {
  const name = cart.name.split(' ')[0] || cart.name;
  const items = cart.items.map((i) => `${i.name} × ${i.quantity}`).join(', ');
  return `Assalam-o-Alaikum ${name}! 👋 Trendy Bazaar here. Aap ka order complete nahi hua — ${items} (${formatRs(cart.total)}) abhi bhi aap ke liye available hai.

Kya hum aap ka order confirm kar dein? Bas *YES* likh kar reply karein, Cash on Delivery ke saath. Shukriya!`;
};

export const AdminAbandonedCarts: React.FC<AdminAbandonedCartsProps> = ({ carts, orders, isCloud, updateCart, deleteCart, showToast }) => {
  const [showContacted, setShowContacted] = useState(false);

  // Also hide carts whose phone number placed an order afterwards.
  const orderedAfter = (cart: AbandonedCart) =>
    orders.some(
      (o) => toWhatsAppNumber(o.customer.phone) === cart.phoneKey && new Date(o.createdAt).getTime() >= new Date(cart.updatedAt).getTime() - 60e3
    );

  const cutoff = Date.now() - MINUTES_BEFORE_ABANDONED * 60e3;
  const abandoned = carts.filter(
    (c) => !c.converted && !orderedAfter(c) && new Date(c.updatedAt).getTime() < cutoff && (showContacted || !c.contacted)
  );
  const potential = abandoned.reduce((s, c) => s + c.total, 0);

  if (!isCloud) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-xs text-gray-500">
        Abandoned carts need Firebase (they are collected from every visitor&apos;s checkout).
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-[#F7F3EC] rounded-xl px-3 py-2">
          <strong>{abandoned.length}</strong> carts not completed • <strong>{formatRs(potential)}</strong> in possible sales
        </div>
        <label className="ml-auto flex items-center gap-1.5 text-gray-600">
          <input type="checkbox" checked={showContacted} onChange={(e) => setShowContacted(e.target.checked)} className="accent-[#8A6D1F]" />
          Show already contacted
        </label>
      </div>
      <p className="text-gray-500">
        Customers who entered their name and number at checkout but didn&apos;t place the order (after {MINUTES_BEFORE_ABANDONED} minutes). Send them a friendly reminder.
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {abandoned.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No abandoned carts right now. 🎉
          </div>
        )}
        {abandoned.map((cart) => (
          <div key={cart.phoneKey} className="p-3.5 flex flex-wrap items-start gap-3">
            <div className="flex-1 min-w-[180px]">
              <p className="font-bold text-[#1A1A1A]">
                {cart.name}
                {cart.contacted && <span className="ml-1.5 text-[10px] font-semibold text-emerald-700">• contacted</span>}
              </p>
              <p className="text-gray-500">
                {cart.phone} • {cart.city} • {formatOrderDate(cart.updatedAt)}
              </p>
              <p className="text-gray-600 mt-1">{cart.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}</p>
            </div>
            <p className="font-bold">{formatRs(cart.total)}</p>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <a
                href={`https://wa.me/${cart.phoneKey}?text=${encodeURIComponent(nudgeMessage(cart))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => void updateCart(cart.phoneKey, { contacted: true })}
                className="py-2 px-3 rounded-xl bg-[#25D366] text-white font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Send reminder
              </a>
              {!cart.contacted && (
                <button
                  onClick={() => void updateCart(cart.phoneKey, { contacted: true }).then(() => showToast('Marked as contacted', 'success'))}
                  className="p-2 rounded-xl bg-[#F7F3EC] text-gray-600 hover:text-black"
                  title="Mark as contacted"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm(`Remove ${cart.name}'s cart?`)) void deleteCart(cart.phoneKey);
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-red-600"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
