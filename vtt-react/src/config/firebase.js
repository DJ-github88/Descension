// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Check if Firebase is configured
const isFirebaseConfigured = !!(
  process.env.REACT_APP_FIREBASE_API_KEY &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID
);

// Firebase configuration
const firebaseConfig = isFirebaseConfigured ? {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
} : null;

// Initialize Firebase only if configured
let app = null;
if (isFirebaseConfigured && firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase not configured - authentication features will be disabled');
}

// Initialize Firebase services only if app is available
export let auth = null;
export let db = null;
export let analytics = null;
export let googleProvider = null;

if (app) {
  try {
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);

    // Initialize Analytics (optional)
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }

    // Google Auth Provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Development emulator setup (uncomment for local development)
    // if (process.env.NODE_ENV === 'development') {
    //   connectAuthEmulator(auth, 'http://localhost:9099');
    //   connectFirestoreEmulator(db, 'localhost', 8080);
    // }
  } catch (error) {
    console.warn('Firebase services initialization failed:', error);
  }
}

export { isFirebaseConfigured };
export default app;
