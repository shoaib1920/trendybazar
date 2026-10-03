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

// Seed disabled: the app no longer ships a built-in starter catalog.
// Products must be created from the admin panel or added through Firebase.
export const seedProductsIfEmpty = async (_initialProducts: Product[]) => {
  if (!isFirebaseConfigured || !db) return;

  const snapshot = await getDocs(collection(db, COLLECTION));
  if (!snapshot.empty) return;

  // Intentionally left empty to avoid injecting demo products.
};
