import React, { useEffect, useMemo, useState } from 'react';
import { CustomerReview, FeedbackScreenshot, PlacedOrder, Product } from '../../types';
import { productUrl, productKeyFor } from '../../context/ShopContext';
import { formatOrderDate } from '../OrderReceipt';
import { isCloudinaryConfigured, uploadImageToCloudinary } from '../../lib/cloudinary';
import { deleteFeedbackScreenshotRemote, saveFeedbackScreenshotRemote, subscribeFeedbackScreenshots } from '../../lib/reviewsService';
import { CheckCircle2, EyeOff, Loader2, MessageCircle, Plus, Star, Trash2, UploadCloud } from 'lucide-react';

interface AdminReviewsProps {
  reviews: CustomerReview[];
  orders: PlacedOrder[];
  products: Product[];
  createReview: (review: CustomerReview) => Promise<void>;
  updateReview: (id: string, patch: Partial<CustomerReview>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  onOpenOrder: (orderId: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const REVIEW_SOURCES = ['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Phone call'];
const emptyForm = { productId: '', userName: '', userCity: '', rating: 5, source: REVIEW_SOURCES[0], comment: '' };

export const AdminReviews: React.FC<AdminReviewsProps> = ({ reviews, orders, products, createReview, updateReview, deleteReview, onOpenOrder, showToast }) => {
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
          {r.orderId ? (
            <button onClick={() => onOpenOrder(r.orderId)} className="underline hover:text-black">{r.orderId}</button>
          ) : (
            <span>added by you{r.source ? ` (via ${r.source})` : ''}</span>
          )}
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

  // --- Add feedback a customer sent on WhatsApp, Instagram, etc. ---
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === form.productId);
    if (!product || !form.userName.trim() || !form.comment.trim()) {
      showToast('Choose the product and fill in the customer name and their message.', 'warning');
      return;
    }
    setIsSaving(true);
    try {
      const id = `manual_${Date.now()}`;
      await createReview({
        id,
        productId: product.id,
        productName: product.name,
        orderId: '',
        userName: form.userName.trim(),
        userCity: form.userCity.trim(),
        rating: form.rating,
        comment: form.comment.trim(),
        createdAt: new Date().toISOString(),
        approved: true,
        source: form.source
      });
      setForm({ ...emptyForm, productId: form.productId, source: form.source });
      showToast('Review added to the product page.', 'success');
    } catch (err: any) {
      showToast(`Review could not be saved: ${err?.message || err}`, 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Screenshots of customer messages for the home page ---
  const [screenshots, setScreenshots] = useState<FeedbackScreenshot[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => subscribeFeedbackScreenshots(setScreenshots), []);

  const handleScreenshotFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      for (const [index, file] of files.entries()) {
        const imageUrl = await uploadImageToCloudinary(file);
        await saveFeedbackScreenshotRemote({ id: `shot_${Date.now()}_${index}`, imageUrl, createdAt: new Date().toISOString() });
      }
      showToast('Screenshot added to the home page.', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Screenshot could not be uploaded.', 'warning');
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass = 'w-full p-2.5 rounded-xl border border-gray-200';

  return (
    <div className="space-y-4 text-xs">
      <form onSubmit={handleAddReview} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
        <div>
          <p className="font-bold text-[#1A1A1A]">Add a review a customer sent you</p>
          <p className="text-gray-500 pt-1">
            For feedback received on WhatsApp, Instagram, Facebook or a call. Enter it in the customer&apos;s own words; it goes live straight away.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className={`${inputClass} lg:col-span-2`}>
            <option value="">Choose product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Customer name"
            maxLength={60}
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="City"
            maxLength={60}
            value={form.userCity}
            onChange={(e) => setForm({ ...form, userCity: e.target.value })}
            className={inputClass}
          />
          <div className="flex gap-2">
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={inputClass} title="Rating">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} ★</option>
              ))}
            </select>
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className={inputClass} title="Where the customer sent it">
              {REVIEW_SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          rows={2}
          maxLength={1000}
          placeholder="Paste the customer's message here"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className={inputClass}
        />
        <button type="submit" disabled={isSaving} className="py-2 px-4 rounded-xl bg-[#1A1A1A] text-white font-bold flex items-center gap-1.5 disabled:opacity-60">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Add review
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
        <div>
          <p className="font-bold text-[#1A1A1A]">Customer message screenshots ({screenshots.length})</p>
          <p className="text-gray-500 pt-1">
            Shown on the home page under &quot;What our customers say&quot;. Crop or blur phone numbers and anything private before uploading.
          </p>
        </div>
        {isCloudinaryConfigured ? (
          <label className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#F7F3EC] text-gray-700 hover:text-black font-bold cursor-pointer">
            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
            {isUploading ? 'Uploading…' : 'Upload screenshots'}
            <input type="file" accept="image/*" multiple disabled={isUploading} onChange={handleScreenshotFiles} className="hidden" />
          </label>
        ) : (
          <p className="text-amber-700">Image uploads are not set up (Cloudinary keys missing).</p>
        )}
        {screenshots.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {screenshots.map((s) => (
              <div key={s.id} className="relative">
                <img src={s.imageUrl} alt="" className="w-24 h-40 object-cover rounded-xl border border-gray-200" />
                <button
                  onClick={() => {
                    if (window.confirm('Remove this screenshot from the home page?')) void deleteFeedbackScreenshotRemote(s.id);
                  }}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-600"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
