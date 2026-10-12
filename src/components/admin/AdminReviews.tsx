import React, { useMemo } from 'react';
import { CustomerReview, PlacedOrder, Product } from '../../types';
import { productUrl, productKeyFor } from '../../context/ShopContext';
import { formatOrderDate } from '../OrderReceipt';
import { CheckCircle2, EyeOff, MessageCircle, Star, Trash2 } from 'lucide-react';

interface AdminReviewsProps {
  reviews: CustomerReview[];
  orders: PlacedOrder[];
  products: Product[];
  updateReview: (id: string, patch: Partial<CustomerReview>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  onOpenOrder: (orderId: string) => void;
}

export const AdminReviews: React.FC<AdminReviewsProps> = ({ reviews, orders, products, updateReview, deleteReview, onOpenOrder }) => {
  const pending = reviews.filter((r) => !r.approved);
  const published = reviews.filter((r) => r.approved);

  // Recent delivered orders that have not reviewed anything yet.
  const toAsk = useMemo(() => {
    const reviewedOrders = new Set(reviews.map((r) => r.orderId));
    return orders.filter((o) => o.status === 'Delivered' && o.phoneKey && !reviewedOrders.has(o.orderId)).slice(0, 30);
  }, [orders, reviews]);

  const messageFor = (order: PlacedOrder) => {
    const links = order.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? `${item.name}: ${productUrl(productKeyFor(product, products))}?review=${order.orderId}` : '';
      })
      .filter(Boolean)
      .join('\n');
    return `Assalam-o-Alaikum ${order.customer.fullName}! Shukriya for shopping at Trendy Bazaar. We hope you are enjoying your order ${order.orderId}.\n\nWould you take a minute to share your honest review? It really helps other customers.\n\n${links}`;
  };

  const renderReview = (r: CustomerReview) => (
    <div key={r.id} className="flex flex-wrap items-start gap-2 py-3">
      <div className="flex-1 min-w-[200px] space-y-1">
        <p>
          <strong>{r.userName}</strong>
          <span className="text-gray-400"> • {r.userCity} • {formatOrderDate(r.createdAt)}</span>
        </p>
        <p className="text-gray-500">
          {r.productName} •{' '}
          <button onClick={() => onOpenOrder(r.orderId)} className="underline hover:text-black">{r.orderId}</button>
        </p>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-[#F2B705] text-[#F2B705]' : 'text-gray-300'}`} />
          ))}
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{r.comment}</p>
      </div>
      <button
        onClick={() => void updateReview(r.id, { approved: !r.approved })}
        className={`py-1.5 px-2.5 rounded-lg font-bold flex items-center gap-1 ${r.approved ? 'bg-[#F7F3EC] text-gray-600 hover:text-black' : 'bg-emerald-600 text-white'}`}
      >
        {r.approved ? <EyeOff className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        {r.approved ? 'Hide' : 'Approve'}
      </button>
      <button
        onClick={() => {
          if (window.confirm('Delete this review permanently?')) void deleteReview(r.id);
        }}
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 text-xs">
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <p className="font-bold text-[#1A1A1A]">Waiting for approval ({pending.length})</p>
        {pending.length === 0 ? (
          <p className="text-gray-500 pt-2">No new reviews. Reviews from customers show up here before they go live.</p>
        ) : (
          <div className="divide-y divide-gray-100">{pending.map(renderReview)}</div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <p className="font-bold text-[#1A1A1A]">Ask for a review ({toAsk.length})</p>
        <p className="text-gray-500 pt-1">Delivered orders that have not left a review yet. The message links straight to the review form.</p>
        <div className="divide-y divide-gray-100">
          {toAsk.map((order) => (
            <div key={order.orderId} className="flex flex-wrap items-center gap-2 py-2">
              <span className="flex-1 min-w-[160px]">
                <strong>{order.customer.fullName}</strong>
                <span className="text-gray-400"> • {order.orderId} • {order.items.map((i) => i.name).join(', ')}</span>
              </span>
              <a
                href={`https://wa.me/${order.phoneKey}?text=${encodeURIComponent(messageFor(order))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2.5 rounded-lg bg-[#25D366] text-white font-bold flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <p className="font-bold text-[#1A1A1A]">Published ({published.length})</p>
        <div className="divide-y divide-gray-100">{published.map(renderReview)}</div>
      </div>
    </div>
  );
};
