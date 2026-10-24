import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
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

import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

// Initialize Firebase Messaging safely
let messagingPromise: Promise<Messaging | null> | null = null;

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined') return null;
  if (!messagingPromise) {
    messagingPromise = isSupported().then((supported) => {
      if (supported && 'Notification' in window) {
        return getMessaging(app);
      }
      return null;
    }).catch(() => null);
  }
  return messagingPromise;
};

export { signInWithPopup, signOut };
