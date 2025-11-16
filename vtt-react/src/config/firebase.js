// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration using environment variables with fallback to hardcoded values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDs9SSWy1J_aSX3LvHUBbI9fwi68cuaX7A",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mythrill-ff7c6.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://mythrill-ff7c6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mythrill-ff7c6",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mythrill-ff7c6.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "715658408409",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:715658408409:web:3a926eba858e529d66a9c8",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-WL4DX5LRYX"
};

// Check if Firebase is configured with real credentials
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'demo-api-key'
);

// Demo mode for development - use demo auth when Firebase is not properly configured
const isDemoMode = process.env.NODE_ENV === 'development' || !isFirebaseConfigured;

// CRITICAL FIX: Enhanced debug logging for Firebase configuration tracking
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- isFirebaseConfigured:', isFirebaseConfigured);
console.log('- isDemoMode:', isDemoMode);
console.log('- Using env vars:', {
  apiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
  authDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
});

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
export let analytics = null;
export let googleProvider = null;

if (app) {
  try {
    
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);
    console.log('✅ Firebase Auth initialized', { 
      appName: app.name,
      authDomain: firebaseConfig.authDomain 
    });

    // Set auth persistence to LOCAL (persists across browser sessions)
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
      })
      .catch((error) => {
        console.error('❌ Failed to set auth persistence:', error);
      });

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);
    console.log('✅ Firestore initialized', { 
      projectId: firebaseConfig.projectId,
      databaseURL: firebaseConfig.databaseURL 
    });

    // Initialize Realtime Database for presence tracking
    realtimeDb = getDatabase(app);
    console.log('✅ Realtime Database initialized', { 
      databaseURL: firebaseConfig.databaseURL 
    });

    // Initialize Analytics (optional)
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
        console.log('✅ Firebase Analytics initialized', { 
          measurementId: firebaseConfig.measurementId 
        });
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

    
    // CRITICAL FIX: Log final Firebase status for debugging
    console.log('🔥 Firebase Services Status:', {
      app: !!app,
      auth: !!auth,
      db: !!db,
      realtimeDb: !!realtimeDb,
      analytics: !!analytics,
      googleProvider: !!googleProvider,
      isConfigured: isFirebaseConfigured,
      isDemoMode: isDemoMode,
      canUseFirebase: isFirebaseConfigured && !isDemoMode
    });

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
}

export { isFirebaseConfigured, isDemoMode };
export default app;
