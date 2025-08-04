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
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from '../config/firebase';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    this.isConfigured = isFirebaseConfigured;

    // Listen for auth state changes only if Firebase is configured
    if (auth && this.isConfigured) {
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
  async signUp(email, password, displayName) {
    if (!this.isConfigured || !auth) {
      return { error: 'Authentication not configured', success: false };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName });

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      await this.createUserDocument(user);

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
    if (!this.isConfigured || !auth || !googleProvider) {
      return { error: 'Authentication not configured', success: false };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create or update user document in Firestore
      await this.createUserDocument(user);

      return { user, success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error: error.message, success: false };
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

  // Create user document in Firestore
  async createUserDocument(user) {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();
      
      try {
        await setDoc(userRef, {
          displayName: displayName || email.split('@')[0],
          email,
          photoURL: photoURL || null,
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

// Create and export singleton instance
const authService = new AuthService();
export default authService;
