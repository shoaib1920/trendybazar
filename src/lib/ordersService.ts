import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { PlacedOrder } from '../types';

const COLLECTION = 'orders';

// Short, customer-friendly but hard-to-guess order IDs (no 0/O/1/I mix-ups).
// Tracking reads an order by its exact ID, so IDs must not be sequential.
const ID_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
export const generateOrderId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  return 'TB-' + Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join('');
};

// Firestore rejects `undefined` only when not ignored; strip it anyway so
// documents stay clean.
const clean = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

// Orders allowed per phone number in any 24 hours (also enforced by firestore.rules).
export const MAX_ORDERS_PER_PHONE_PER_DAY = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export class OrderLimitError extends Error {
  constructor() {
    super(`This number has already placed ${MAX_ORDERS_PER_PHONE_PER_DAY} orders today. Please message us on WhatsApp to order more.`);
    this.name = 'OrderLimitError';
  }
}

// Saves the order together with that phone number's daily order counter in one
// batch; the security rules reject the order if the counter is not updated.
export const createOrderRemote = async (order: PlacedOrder) => {
  if (!isFirebaseConfigured || !db) return;
  if (!order.phoneKey) throw new Error('A valid Pakistani mobile number is required.');

  const limitRef = doc(db, 'phoneLimits', order.phoneKey);
  const limitSnap = await getDoc(limitRef);
  const batch = writeBatch(db);
  batch.set(doc(db, COLLECTION, order.orderId), clean(order));

  if (!limitSnap.exists()) {
    batch.set(limitRef, { count: 1, windowStart: serverTimestamp(), lastOrderId: order.orderId });
  } else {
    const data = limitSnap.data() as { count: number; windowStart: Timestamp };
    const windowOpen = Date.now() - data.windowStart.toMillis() < DAY_MS;
    if (windowOpen && data.count >= MAX_ORDERS_PER_PHONE_PER_DAY) throw new OrderLimitError();
    batch.update(
      limitRef,
      windowOpen
        ? { count: data.count + 1, lastOrderId: order.orderId }
        : { count: 1, windowStart: serverTimestamp(), lastOrderId: order.orderId }
    );
  }
  await batch.commit();
};

export const getOrderRemote = async (orderId: string): Promise<PlacedOrder | null> => {
  if (!isFirebaseConfigured || !db) return null;
  const snapshot = await getDoc(doc(db, COLLECTION, orderId));
  return snapshot.exists() ? (snapshot.data() as PlacedOrder) : null;
};

// Admin only (Firestore rules require a signed-in user to list orders).
export const subscribeToOrders = (
  onChange: (orders: PlacedOrder[]) => void,
  onError?: (error: Error) => void
) => {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
    (snapshot) => onChange(snapshot.docs.map((d) => d.data() as PlacedOrder)),
    (error) => onError?.(error)
  );
};

export const updateOrderRemote = async (orderId: string, patch: Partial<PlacedOrder>) => {
  if (!isFirebaseConfigured || !db) return;
  await updateDoc(doc(db, COLLECTION, orderId), clean(patch) as Record<string, unknown>);
};
