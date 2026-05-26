import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA0CYlJwwtsR5rPoFypdn5NdRUJXTPbYfE",
  authDomain: "roomops-70aa7.firebaseapp.com",
  projectId: "roomops-70aa7",
  storageBucket: "roomops-70aa7.firebasestorage.app",
  messagingSenderId: "436701067891",
  appId: "1:436701067891:web:09179dd446aa934cf84806",
  measurementId: "G-81CR31QKYL"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with offline persistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

// Initialize Analytics (optional but requested in original snippet)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
