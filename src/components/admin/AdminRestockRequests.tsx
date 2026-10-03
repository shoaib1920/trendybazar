import React, { useMemo, useState } from 'react';
import { BackInStockRequest, Product } from '../../types';
import { productUrl, productKeyFor } from '../../context/ShopContext';
import { formatOrderDate } from '../OrderReceipt';
import { Bell, CheckCircle2, Mail, MessageCircle, Trash2 } from 'lucide-react';

interface AdminRestockRequestsProps {
  requests: BackInStockRequest[];
  products: Product[];
  updateRequest: (id: string, patch: Partial<BackInStockRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
}

export const AdminRestockRequests: React.FC<AdminRestockRequestsProps> = ({ requests, products, updateRequest, deleteRequest }) => {
  const [showNotified, setShowNotified] = useState(false);

  // Group open requests by product, products back in stock first.
  const groups = useMemo(() => {
    const visible = requests.filter((r) => showNotified || !r.notified);
    const map = new Map<string, { product?: Product; name: string; requests: BackInStockRequest[] }>();
    visible.forEach((r) => {
      const group = map.get(r.productId) || {
        product: products.find((p) => p.id === r.productId),
        name: r.productName,
        requests: []
      };
      group.requests.push(r);
      map.set(r.productId, group);
    });
    return [...map.values()].sort((a, b) => Number(Boolean(b.product?.inStock)) - Number(Boolean(a.product?.inStock)));
  }, [requests, products, showNotified]);

  const messageFor = (group: { product?: Product; name: string }) =>
    `Assalam-o-Alaikum! 🎉 Good news from Trendy Bazaar — *${group.name}* is back in stock${
      group.product ? ` at Rs. ${group.product.price.toLocaleString()}` : ''
    }.${group.product ? `\n\nOrder here: ${productUrl(productKeyFor(group.product, products))}` : ''}\n\nCash on Delivery available. Shukriya!`;

  const openCount = requests.filter((r) => !r.notified).length;

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-[#F7F3EC] rounded-xl px-3 py-2">
          <strong>{openCount}</strong> customers waiting for a restock
        </div>
        <label className="ml-auto flex items-center gap-1.5 text-gray-600">
          <input type="checkbox" checked={showNotified} onChange={(e) => setShowNotified(e.target.checked)} className="accent-[#8A6D1F]" />
          Show already notified
        </label>
      </div>

      {groups.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          No restock requests. When a sold-out product page gets a &quot;Notify me&quot; request, it shows up here.
        </div>
      )}

      {groups.map((group) => (
        <div key={group.name} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {group.product?.images[0] && <img src={group.product.images[0]} alt="" className="w-11 h-11 rounded-lg object-cover border border-gray-100" />}
            <div className="flex-1 min-w-[160px]">
              <p className="font-bold text-[#1A1A1A]">{group.name}</p>
              <p className={group.product?.inStock ? 'text-emerald-700 font-semibold' : 'text-gray-400'}>
                {group.product ? (group.product.inStock ? `Back in stock (${group.product.stockCount}) — notify them!` : 'Still sold out') : 'Product removed'}
              </p>
            </div>
            <span className="text-gray-500">{group.requests.length} waiting</span>
          </div>

          <div className="divide-y divide-gray-100">
            {group.requests.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-2 py-2">
                <span className="flex-1 min-w-[160px]">
                  <strong>{r.contact}</strong>
                  <span className="text-gray-400"> • {formatOrderDate(r.createdAt)}</span>
                  {r.notified && <span className="text-emerald-700 font-semibold"> • notified</span>}
                </span>
                {r.phoneKey ? (
                  <a
                    href={`https://wa.me/${r.phoneKey}?text=${encodeURIComponent(messageFor(group))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => void updateRequest(r.id, { notified: true })}
                    className="py-1.5 px-2.5 rounded-lg bg-[#25D366] text-white font-bold flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                ) : r.contact.includes('@') ? (
                  <a
                    href={`mailto:${r.contact}?subject=${encodeURIComponent(`${group.name} is back in stock`)}&body=${encodeURIComponent(messageFor(group))}`}
                    onClick={() => void updateRequest(r.id, { notified: true })}
                    className="py-1.5 px-2.5 rounded-lg bg-[#1A1A1A] text-white font-bold flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                ) : null}
                {!r.notified && (
                  <button
                    onClick={() => void updateRequest(r.id, { notified: true })}
                    className="p-1.5 rounded-lg bg-[#F7F3EC] text-gray-600 hover:text-black"
                    title="Mark as notified"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => void deleteRequest(r.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600" title="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
