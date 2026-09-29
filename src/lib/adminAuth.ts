import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

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
