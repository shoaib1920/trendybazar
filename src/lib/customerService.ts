import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { AbandonedCart, BackInStockRequest } from '../types';

const clean = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const tsToIso = (value: any) => (value?.toDate ? value.toDate().toISOString() : value || new Date(0).toISOString());

// ---------- Loyalty points (customers/{phoneKey}) ----------

// 1 point = Rs. 1. Customers earn 5% of the item subtotal when an order is delivered.
export const POINTS_EARN_RATE = 0.05;
// Points can cover at most 20% of an order.
export const POINTS_MAX_SHARE = 0.2;

export const getPointsRemote = async (phoneKey: string): Promise<number> => {
  if (!isFirebaseConfigured || !db) return 0;
  const snapshot = await getDoc(doc(db, 'customers', phoneKey));
  return snapshot.exists() ? Math.max(0, Number(snapshot.data().points) || 0) : 0;
};

// Admin only. Positive delta adds points, negative removes them.
export const adjustPointsRemote = async (phoneKey: string, delta: number) => {
  if (!isFirebaseConfigured || !db || !delta) return;
  await setDoc(
    doc(db, 'customers', phoneKey),
    { phoneKey, points: increment(delta), updatedAt: serverTimestamp() },
    { merge: true }
  );
};

// ---------- Back-in-stock requests (backInStock/{id}) ----------

export const createBackInStockRemote = async (request: BackInStockRequest) => {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(doc(db, 'backInStock', request.id), clean(request));
};

export const subscribeBackInStock = (onChange: (list: BackInStockRequest[]) => void, onError?: (e: Error) => void) => {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    collection(db, 'backInStock'),
    (snap) =>
      onChange(
        snap.docs.map((d) => d.data() as BackInStockRequest).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      ),
    (e) => onError?.(e)
  );
};

export const updateBackInStockRemote = async (id: string, patch: Partial<BackInStockRequest>) => {
  if (!isFirebaseConfigured || !db) return;
  await updateDoc(doc(db, 'backInStock', id), clean(patch) as Record<string, unknown>);
};

export const deleteBackInStockRemote = async (id: string) => {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, 'backInStock', id));
};

// ---------- Abandoned carts (abandonedCarts/{phoneKey}) ----------

export const saveAbandonedCartRemote = async (cart: Omit<AbandonedCart, 'updatedAt'>) => {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(doc(db, 'abandonedCarts', cart.phoneKey), { ...clean(cart), updatedAt: serverTimestamp() });
};

export const markCartConvertedRemote = async (cart: Omit<AbandonedCart, 'updatedAt'>, orderId: string) => {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(doc(db, 'abandonedCarts', cart.phoneKey), {
    ...clean(cart),
    converted: true,
    orderId,
    updatedAt: serverTimestamp()
  });
};

export const subscribeAbandonedCarts = (onChange: (list: AbandonedCart[]) => void, onError?: (e: Error) => void) => {
  if (!isFirebaseConfigured || !db) return () => {};
  return onSnapshot(
    collection(db, 'abandonedCarts'),
    (snap) =>
      onChange(
        snap.docs
          .map((d) => ({ ...(d.data() as AbandonedCart), updatedAt: tsToIso(d.data().updatedAt) }))
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      ),
    (e) => onError?.(e)
  );
};

export const updateAbandonedCartRemote = async (phoneKey: string, patch: Partial<AbandonedCart>) => {
  if (!isFirebaseConfigured || !db) return;
  await updateDoc(doc(db, 'abandonedCarts', phoneKey), clean(patch) as Record<string, unknown>);
};

export const deleteAbandonedCartRemote = async (phoneKey: string) => {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, 'abandonedCarts', phoneKey));
};
