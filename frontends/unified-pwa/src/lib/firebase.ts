import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC4gevbnB8eDxk5nskKjf5Nepr_9tVxThE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'trust-hire-6edba.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'trust-hire-6edba',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'trust-hire-6edba.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '824793842854',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:824793842854:web:c892195f74ebb3ae43e067',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-NH3HTZ6XBB',
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export { signInWithPopup, signOut };
