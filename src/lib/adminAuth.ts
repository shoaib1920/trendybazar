import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

// The only account allowed to manage the store (must match firestore.rules).
export const ADMIN_EMAIL = 'trendybazar@gmail.com';

export const isAdminUser = (user: User | null) => Boolean(user?.email && user.email.toLowerCase() === ADMIN_EMAIL);

export const signInAdmin = async (email: string, password: string) => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured yet.');
  }
  await signInWithEmailAndPassword(auth, email, password);
};

export const signOutAdmin = async () => {
  if (!isFirebaseConfigured || !auth) return;
  await signOut(auth);
};

// Returns an unsubscribe function.
export const subscribeToAdminAuth = (onChange: (user: User | null) => void) => {
  if (!isFirebaseConfigured || !auth) {
    onChange(null);
    return () => {};
  }
  return onAuthStateChanged(auth, onChange);
};
