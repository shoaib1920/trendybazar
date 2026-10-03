import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
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

export const createOrderRemote = async (order: PlacedOrder) => {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(doc(db, COLLECTION, order.orderId), clean(order));
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
