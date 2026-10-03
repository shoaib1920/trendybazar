import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { DiscountCode } from '../types';

const COLLECTION = 'discounts';

export const normalizeCode = (code: string) => code.trim().toUpperCase().replace(/\s+/g, '');

// The starter code the store has always advertised.
export const DEFAULT_DISCOUNT: DiscountCode = {
  code: 'WELCOME5',
  type: 'percent',
  value: 5,
  minSpend: 0,
  description: 'Welcome offer for new customers',
  active: true,
  featured: true,
  usedCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z'
};

// "5%" / "Rs. 200"
export const discountAmountText = (d: Pick<DiscountCode, 'type' | 'value'>) =>
  d.type === 'percent' ? `${d.value}%` : `Rs. ${d.value.toLocaleString()}`;

// "5% off" / "Rs. 200 off" (+ minimum spend when there is one)
export const discountLabel = (d: Pick<DiscountCode, 'type' | 'value' | 'minSpend'>, withMinSpend = true) => {
  const off = d.type === 'percent' ? `${d.value}% off` : `Rs. ${d.value.toLocaleString()} off`;
  return withMinSpend && d.minSpend > 0 ? `${off} on orders over Rs. ${d.minSpend.toLocaleString()}` : off;
};

// Why a code can't be used right now (null = usable).
export const discountProblem = (d: DiscountCode | null): string | null => {
  if (!d || !d.active) return 'Invalid discount code.';
  if (d.expiresAt && new Date(d.expiresAt).getTime() < Date.now()) return 'This code has expired.';
  if (d.usageLimit && d.usedCount >= d.usageLimit) return 'This code has reached its usage limit.';
  return null;
};

const clean = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

// Customers can only read a code they type in (exact id), never the full list.
export const getDiscountRemote = async (code: string): Promise<DiscountCode | null> => {
  if (!isFirebaseConfigured || !db) return null;
  const snapshot = await getDoc(doc(db, COLLECTION, normalizeCode(code)));
  return snapshot.exists() ? (snapshot.data() as DiscountCode) : null;
};

// The advertised code (rules allow listing only documents with featured == true).
export const subscribeFeaturedDiscount = (onChange: (d: DiscountCode | null) => void) => {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    query(collection(db, COLLECTION), where('featured', '==', true)),
    (snapshot) => {
      const usable = snapshot.docs.map((d) => d.data() as DiscountCode).find((d) => !discountProblem(d));
      onChange(usable || null);
    },
    () => onChange(null)
  );
};

// Admin only.
export const subscribeAllDiscounts = (onChange: (list: DiscountCode[]) => void, onError?: (e: Error) => void) => {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    collection(db, COLLECTION),
    (snapshot) => onChange(snapshot.docs.map((d) => d.data() as DiscountCode)),
    (e) => onError?.(e)
  );
};

export const saveDiscountRemote = async (d: DiscountCode) => {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(doc(db, COLLECTION, normalizeCode(d.code)), clean(d));
};

export const deleteDiscountRemote = async (code: string) => {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, COLLECTION, normalizeCode(code)));
};

// Called after an order uses a code (rules only allow +1 on usedCount).
export const incrementDiscountUsage = async (code: string) => {
  if (!isFirebaseConfigured || !db) return;
  await updateDoc(doc(db, COLLECTION, normalizeCode(code)), { usedCount: increment(1) });
};
