import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CustomerReview, Product } from '../types';
import { getOrderRemote } from '../lib/ordersService';
import { createReviewRemote, reviewIdFor } from '../lib/reviewsService';
import { Loader2, Star } from 'lucide-react';

export const averageRating = (reviews: { rating: number }[]) =>
  Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;

interface ProductReviewsProps {
  product: Product;
  reviews: Pick<CustomerReview, 'id' | 'userName' | 'userCity' | 'rating' | 'comment'>[];
  // Order ID from a "review your order" link (/product/<slug>?review=<order id>).
  initialOrderId?: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product, reviews, initialOrderId }) => {
  const { orders, isCloudBackendConfigured, showToast } = useShop();

  // Pre-fill with this device's own order of this product, if there is one.
  const deviceOrder = orders.find((o) => o.items.some((i) => i.productId === product.id));
  const [isFormOpen, setIsFormOpen] = useState(Boolean(initialOrderId));
  const [orderId, setOrderId] = useState(initialOrderId || deviceOrder?.orderId || '');
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const id = orderId.trim().toUpperCase();
    if (!id) return setError('Please enter your order ID.');
    if (!rating) return setError('Please tap a star to rate the product.');
    if (!userName.trim()) return setError('Please enter your name.');
    if (comment.trim().length < 10) return setError('Please write a few words about the product.');

    setIsSubmitting(true);
    try {
      const order = await getOrderRemote(id);
      if (!order) return setError('We could not find that order ID. It is on your order confirmation, e.g. TB-ABC2345.');
      if (!order.items.some((i) => i.productId === product.id)) return setError('That order does not include this product.');
      if (order.status !== 'Delivered') return setError('You can review this product once your order has been delivered.');

      await createReviewRemote({
        id: reviewIdFor(order.orderId, product.id),
        productId: product.id,
        productName: product.name,
        orderId: order.orderId,
        userName: userName.trim(),
        userCity: order.customer.city.slice(0, 60),
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        approved: false
      });
      setSubmitted(true);
      showToast('Thank you! Your review has been submitted.', 'success');
    } catch (err: any) {
      setError(
        err?.code === 'permission-denied'
          ? 'This order has already been used to review this product.'
          : 'Your review could not be sent. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h4 className="font-serif font-bold text-sm text-[#141414]">Customer Reviews</h4>
          <p className="text-xs text-gray-500">Only customers with a delivered order can leave a review</p>
        </div>
        {reviews.length > 0 && (
          <div className="text-right">
            <span className="font-serif font-black text-xl text-[#141414]">{averageRating(reviews)}</span>
            <div className="flex text-[#F2B705]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.round(averageRating(reviews)) ? 'fill-[#F2B705]' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-[#F9F6F0] rounded-2xl space-y-1.5 border border-gold-hairline">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-[#141414] text-xs">{rev.userName}</span>
                  <span className="text-[10px] text-[#8A6D1F] font-semibold">{rev.userCity}</span>
                </div>
                <div className="flex gap-0.5 text-[#F2B705]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#F2B705]" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600">"{rev.comment}"</p>
            </div>
          ))
        ) : (
          <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 text-center">
            No reviews yet. Bought this product? Be the first to review it.
          </div>
        )}
      </div>

      {isCloudBackendConfigured && !isFormOpen && (
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="py-2.5 px-5 rounded-full bg-[#141414] hover:bg-black text-white text-xs font-serif font-bold"
        >
          Write a review
        </button>
      )}

      {isCloudBackendConfigured && isFormOpen && submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold">
          Thank you! Your review has been received and will appear here once it is approved.
        </div>
      )}

      {isCloudBackendConfigured && isFormOpen && !submitted && (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-2xl border border-gold-hairline space-y-3 text-xs">
          <h4 className="font-serif font-bold text-sm text-[#141414]">Write a review</h4>

          <div>
            <span className="block font-semibold text-gray-700 mb-1">Your rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star${value > 1 ? 's' : ''}`}>
                  <Star className={`w-6 h-6 ${value <= rating ? 'fill-[#F2B705] text-[#F2B705]' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="TB-ABC2345"
                className="w-full p-2.5 rounded-xl border border-gray-200 uppercase"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Your name (shown publicly)</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={60}
                className="w-full p-2.5 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Your review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="How is the product? Sound, battery, build quality, delivery…"
              className="w-full p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2.5 px-5 rounded-full bg-[#141414] hover:bg-black text-white font-serif font-bold flex items-center gap-2 disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Submit review</span>
          </button>
        </form>
      )}
    </div>
  );
};
