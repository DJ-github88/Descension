// Authentication service for Firebase Auth
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured, isDemoMode } from '../config/firebase';
import demoAuthService from './demoAuthService';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    this.isConfigured = isFirebaseConfigured;
    this.isDemoMode = false; // This will only be used for Firebase auth

    // Listen for auth state changes only if Firebase is configured
    if (auth && isFirebaseConfigured) {
      onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        this.authStateListeners.forEach(listener => listener(user));
      });
    } else {
      console.warn('Firebase Auth not configured - authentication disabled');
    }
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.authStateListeners = this.authStateListeners.filter(
        listener => listener !== callback
      );
    };
  }

  // Sign up with email and password
  async signUp(email, password, displayName, friendId = null) {
    if (!this.isConfigured || !auth) {
      return { error: 'Authentication not configured', success: false };
    }

    try {
      // Validate friendId if provided
      if (friendId) {
        const isAvailable = await this.checkFriendIdAvailable(friendId);
        if (!isAvailable) {
          return { error: 'Friend ID is already taken', success: false };
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName });

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore with friendId
      await this.createUserDocument(user, friendId);

      return { user, success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error.message, success: false };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    if (!this.isConfigured || !auth) {
      return { error: 'Authentication not configured', success: false };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error.message, success: false };
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    console.log('🔍 Google sign-in debug info:');
    console.log('- isConfigured:', this.isConfigured);
    console.log('- auth:', !!auth);
    console.log('- googleProvider:', !!googleProvider);

    if (!this.isConfigured || !auth || !googleProvider) {
      const errorMsg = 'Authentication not configured. Please check Firebase setup.';
      console.error('❌', errorMsg);
      return { error: errorMsg, success: false };
    }

    try {
      console.log('🚀 Starting Google sign-in popup...');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('✅ Google sign-in successful:', user.email);

      // Create or update user document in Firestore
      await this.createUserDocument(user);

      return { user, success: true };
    } catch (error) {
      console.error('❌ Google sign in error:', error);
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);

      // Handle specific popup-related errors
      if (error.code === 'auth/popup-closed-by-user') {
        return { error: 'Sign-in was cancelled. Please try again.', success: false };
      }

      if (error.code === 'auth/popup-blocked') {
        return { error: 'Popup was blocked by browser. Please allow popups and try again.', success: false };
      }

      if (error.code === 'auth/cancelled-popup-request') {
        return { error: 'Sign-in request was cancelled. Please try again.', success: false };
      }

      // Provide more specific error messages
      let userFriendlyMessage = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        userFriendlyMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        userFriendlyMessage = 'Popup was blocked. Please allow popups and try again.';
      } else if (error.code === 'auth/operation-not-allowed') {
        userFriendlyMessage = 'Google sign-in is not enabled. Please contact support.';
      }

      return { error: userFriendlyMessage, success: false };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error.message, success: false };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: error.message, success: false };
    }
  }

  // Generate a unique Friend ID
  generateFriendId(displayName) {
    // Remove special characters and spaces from display name
    const cleanName = (displayName || 'User').replace(/[^a-zA-Z0-9]/g, '');
    // Generate random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${cleanName}${randomNum}`;
  }

  // Check if Friend ID is available
  async checkFriendIdAvailable(friendId) {
    if (!db) return false;

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('friendId', '==', friendId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // Returns true if no user has this friendId
    } catch (error) {
      console.error('Error checking friendId availability:', error);
      return false;
    }
  }

  // Find user by Friend ID
  async findUserByFriendId(friendId) {
    if (!db) return null;

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('friendId', '==', friendId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error finding user by friendId:', error);
      return null;
    }
  }

  // Create user document in Firestore
  async createUserDocument(user, friendId = null) {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      // Generate friendId if not provided
      let finalFriendId = friendId;
      if (!finalFriendId) {
        // Auto-generate a unique friendId
        let attempts = 0;
        do {
          finalFriendId = this.generateFriendId(displayName || email.split('@')[0]);
          attempts++;
        } while (!(await this.checkFriendIdAvailable(finalFriendId)) && attempts < 10);
      }

      try {
        await setDoc(userRef, {
          displayName: displayName || email.split('@')[0],
          email,
          photoURL: photoURL || null,
          friendId: finalFriendId,
          createdAt,
          lastLoginAt: createdAt,
          // Default character data
          characters: [],
          preferences: {
            theme: 'pathfinder',
            notifications: true,
            autoSave: true
          },
          // Game progress
          gameData: {
            unlockedSkills: [],
            achievements: [],
            totalPlayTime: 0
          }
        });
        console.log(`✅ User document created with Friend ID: ${finalFriendId}`);
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    } else {
      // Update last login time
      try {
        await updateDoc(userRef, {
          lastLoginAt: new Date()
        });
      } catch (error) {
        console.error('Error updating last login:', error);
      }
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Get user data from Firestore
  async getUserData(uid = null) {
    const userId = uid || this.currentUser?.uid;
    if (!userId) return null;
    
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Update user data in Firestore
  async updateUserData(data) {
    if (!this.currentUser) return { error: 'No authenticated user', success: false };
    
    try {
      const userRef = doc(db, 'users', this.currentUser.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user data:', error);
      return { error: error.message, success: false };
    }
  }
}

// Factory function to create the appropriate auth service
function createAuthService() {
  if (isDemoMode) {
    console.log('AuthService: Using demo authentication');
    return demoAuthService;
  } else {
    console.log('AuthService: Using Firebase authentication');
    return new AuthService();
  }
}

// Create and export singleton instance
const authService = createAuthService();
export default authService;
