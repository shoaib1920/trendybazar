import { initializeApp, type FirebaseApp } from 'firebase/app';
import { initializeFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// True once the required .env.local keys are present. Everything that
// touches Firebase checks this first so the site keeps working in plain
// localStorage mode until Firebase is actually wired up.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  // Product objects carry optional fields (subCategory, originalPrice, etc.)
  // as `undefined` rather than omitted — Firestore rejects that by default.
  db = initializeFirestore(app, { ignoreUndefinedProperties: true });
  auth = getAuth(app);
}

export { app, db, auth };
