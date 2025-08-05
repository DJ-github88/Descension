// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration using environment variables with fallback to hardcoded values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDs9SSWy1J_aSX3LvHUBbI9fwi68cuaX7A",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mythrill-ff7c6.firebaseapp.com",
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
const isDemoMode = false; // Disabled for now

// Debug logging
console.log('Firebase Configuration Debug:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- API_KEY:', firebaseConfig.apiKey);
console.log('- PROJECT_ID:', firebaseConfig.projectId);
console.log('- isFirebaseConfigured:', isFirebaseConfigured);
console.log('- isDemoMode:', isDemoMode);

// Initialize Firebase only if configured
let app = null;
if (isFirebaseConfigured && firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.log('Please check your Firebase project configuration:');
    console.log('1. Ensure Firebase project exists');
    console.log('2. Verify API key is correct');
    console.log('3. Check project ID matches your Firebase project');
  }
} else if (isDemoMode) {
  console.log('🔧 Running in demo mode - using mock authentication');
} else {
  console.warn('⚠️ Firebase not configured - authentication features will be disabled');
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
    console.log('✅ Firebase Auth initialized');

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);
    console.log('✅ Firestore initialized');

    // Initialize Analytics (optional)
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
        console.log('✅ Firebase Analytics initialized');
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

    console.log('✅ Google Auth Provider initialized');

    // Development emulator setup (uncomment for local development)
    // if (process.env.NODE_ENV === 'development') {
    //   connectAuthEmulator(auth, 'http://localhost:9099');
    //   connectFirestoreEmulator(db, 'localhost', 8080);
    // }
  } catch (error) {
    console.error('❌ Firebase services initialization failed:', error);
    console.log('Troubleshooting steps:');
    console.log('1. Check if Authentication is enabled in Firebase Console');
    console.log('2. Check if Firestore is enabled in Firebase Console');
    console.log('3. Verify Google Sign-in provider is enabled');
    console.log('4. Check Firebase project permissions');
  }
}

export { isFirebaseConfigured, isDemoMode };
export default app;
