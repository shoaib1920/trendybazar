import { collection, deleteDoc, doc, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { CustomerReview, FeedbackScreenshot } from '../types';

const COLLECTION = 'reviews';

const newestFirst = (list: CustomerReview[]) => list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

// One review per product per order (also enforced by firestore.rules, which
// only accept a review for an order that has been delivered).
export const reviewIdFor = (orderId: string, productId: string) => `${orderId}_${productId}`;

export const createReviewRemote = async (review: CustomerReview) => {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(doc(db, COLLECTION, review.id), review);
};

// Approved reviews of one product (what shoppers see).
export const subscribeProductReviews = (productId: string, onChange: (list: CustomerReview[]) => void) => {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    query(collection(db, COLLECTION), where('productId', '==', productId), where('approved', '==', true)),
    (snap) => onChange(newestFirst(snap.docs.map((d) => d.data() as CustomerReview))),
    (e) => console.error('Could not load reviews:', e)
  );
};

// Admin only: every review, including those waiting for approval.
export const subscribeAllReviews = (onChange: (list: CustomerReview[]) => void, onError?: (e: Error) => void) => {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    collection(db, COLLECTION),
    (snap) => onChange(newestFirst(snap.docs.map((d) => d.data() as CustomerReview))),
    (e) => onError?.(e)
  );
};

export const updateReviewRemote = async (id: string, patch: Partial<CustomerReview>) => {
  if (!isFirebaseConfigured || !db) return;
  await updateDoc(doc(db, COLLECTION, id), patch as Record<string, unknown>);
};

export const deleteReviewRemote = async (id: string) => {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, COLLECTION, id));
};

// ---------- Customer message screenshots (feedbackScreenshots/{id}) ----------

export const subscribeFeedbackScreenshots = (onChange: (list: FeedbackScreenshot[]) => void) => {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    collection(db, 'feedbackScreenshots'),
    (snap) => onChange(snap.docs.map((d) => d.data() as FeedbackScreenshot).sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
    (e) => console.error('Could not load customer screenshots:', e)
  );
};

// Admin only.
export const saveFeedbackScreenshotRemote = async (screenshot: FeedbackScreenshot) => {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(doc(db, 'feedbackScreenshots', screenshot.id), screenshot);
};

export const deleteFeedbackScreenshotRemote = async (id: string) => {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, 'feedbackScreenshots', id));
};
