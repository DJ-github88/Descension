// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration using environment variables only (no hardcoded fallbacks for security)
// All values must be provided via environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Build-time validation: Ensure all required Firebase config values are present
const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0 && process.env.NODE_ENV === 'production') {
  throw new Error(
    `Missing required Firebase configuration: ${missingKeys.join(', ')}. ` +
    `Please set REACT_APP_FIREBASE_${missingKeys.map(k => k.toUpperCase()).join(', REACT_APP_FIREBASE_')} environment variables.`
  );
}

// Check if Firebase is configured with real credentials
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'demo-api-key'
);

// Demo mode for development - use demo auth when Firebase is not properly configured
const isDemoMode = process.env.NODE_ENV === 'development' || !isFirebaseConfigured;

// Firebase configuration tracking (debug logs removed for production)

// Initialize Firebase only if configured
let app = null;
if (isFirebaseConfigured && firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
} else if (isDemoMode) {
} else {
  console.warn('⚠️ Firebase not configured - authentication features will be disabled');
}

// Initialize Firebase services only if app is available
export let auth = null;
export let db = null;
export let realtimeDb = null;
export let storage = null;
export let analytics = null;
export let googleProvider = null;

if (app) {
  try {
    
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);

    // Set auth persistence to LOCAL (persists across browser sessions)
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
      })
      .catch((error) => {
        console.error('❌ Failed to set auth persistence:', error);
      });

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);

    // Initialize Cloud Storage and get a reference to the service
    storage = getStorage(app);

    // Initialize Realtime Database for presence tracking
    realtimeDb = getDatabase(app);

    // Initialize Analytics (optional)
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
      } catch (analyticsError) {
        console.warn('⚠️ Firebase Analytics initialization failed:', analyticsError);
      }
    }

    // Google Auth Provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Add additional scopes for better user info
    googleProvider.addScope('email');
    googleProvider.addScope('profile');


    // Development emulator setup (uncomment for local development)
    // if (process.env.NODE_ENV === 'development') {
    //   connectAuthEmulator(auth, 'http://localhost:9099');
    //   connectFirestoreEmulator(db, 'localhost', 8080);
    // }
  } catch (error) {
    console.error('❌ Firebase services initialization failed:', error);
  }
}

// Make Firebase services available globally for debugging and setup
if (typeof window !== 'undefined' && app) {
  window.firebaseApp = app;
  if (db) {
    window.firebaseDB = db;
  }
  if (auth) {
    window.firebaseAuth = auth;
  }
  if (storage) {
    window.firebaseStorage = storage;
  }
}

export { isFirebaseConfigured, isDemoMode };
export default app;
