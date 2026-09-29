import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { Product } from '../types';

const COLLECTION = 'products';

// Live-syncs the Firestore `products` collection into local state.
// Returns an unsubscribe function.
export const subscribeToProducts = (onChange: (products: Product[]) => void) => {
  if (!isFirebaseConfigured || !db) return () => {};

  return onSnapshot(collection(db, COLLECTION), (snapshot) => {
    const items = snapshot.docs.map((d) => d.data() as Product);
    onChange(items);
  });
};

// Add or update a single product (id doubles as the Firestore document id).
export const saveProductRemote = async (product: Product) => {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(doc(db, COLLECTION, product.id), product);
};

export const deleteProductRemote = async (productId: string) => {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, COLLECTION, productId));
};

// One-time seed: if the Firestore collection is empty (fresh project),
// populate it with the site's built-in starter catalog so the store
// isn't blank the first time Firebase is switched on.
export const seedProductsIfEmpty = async (initialProducts: Product[]) => {
  if (!isFirebaseConfigured || !db) return;

  const snapshot = await getDocs(collection(db, COLLECTION));
  if (!snapshot.empty) return;

  const batch = writeBatch(db);
  initialProducts.forEach((product) => {
    batch.set(doc(db, COLLECTION, product.id), product);
  });
  await batch.commit();
};
