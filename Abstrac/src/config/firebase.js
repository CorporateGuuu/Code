// Firebase config - environment variables with fallbacks
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDwilKNK-FmUqYcgEeXpoilq6KKdw_TLT4",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "abstrac-8e36e.firebaseapp.com",
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || "https://abstrac-8e36e-rtdb.firebaseio.com/",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "abstrac-8e36e",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "abstrac-8e36e.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "630430127671",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:630430127671:web:6159fcfd806118b15e51b2",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5RFNQZ7XCQ"
};

// Initialize Firebase synchronously - this is the standard approach for React Native
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const functions = getFunctions(app);

// Analytics can be added later if needed
export const analytics = null;

// Firebase utility functions
export async function ensureSignedIn() {
  return auth.currentUser;
}

export function callAcceptDare(payload) {
  return functions.httpsCallable("acceptDare")(payload);
}

export function callSubmitProof(payload) {
  return functions.httpsCallable("submitProof")(payload);
}

export function callCompleteDare(payload) {
  return functions.httpsCallable("completeDare")(payload);
}

export function callGetBet(payload) {
  return functions.httpsCallable("getBet")(payload);
}
