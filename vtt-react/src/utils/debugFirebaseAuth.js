/**
 * Firebase Authentication Debug Utility
 * 
 * This utility helps debug Firebase authentication issues and provides
 * development bypass functionality for testing.
 */

import { auth, db, isFirebaseConfigured } from '../config/firebase';
import useAuthStore from '../store/authStore';
import localStorageManager from './localStorageManager';

class FirebaseAuthDebugger {
  constructor() {
    this.debugMode = process.env.NODE_ENV === 'development';
  }

  /**
   * Get comprehensive authentication debug information
   */
  getAuthDebugInfo() {
    const authStore = useAuthStore.getState();
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      firebase: {
        configured: isFirebaseConfigured,
        authInitialized: !!auth,
        dbInitialized: !!db,
        currentUser: auth?.currentUser ? {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          emailVerified: auth.currentUser.emailVerified,
          displayName: auth.currentUser.displayName
        } : null
      },
      authStore: {
        isAuthenticated: authStore.isAuthenticated,
        hasUser: !!authStore.user,
        userId: authStore.user?.uid || null,
        userEmail: authStore.user?.email || null,
        isDevelopmentBypass: authStore.isDevelopmentBypass,
        hasUserData: !!authStore.userData
      },
      localStorage: {
        stats: localStorageManager.getStorageStats(),
        hasCharacters: !!localStorage.getItem('mythrill-characters'),
        hasAuthData: !!localStorage.getItem('mythrill-auth')
      }
    };

    if (this.debugMode) {
      console.log('🔍 Firebase Auth Debug Info:', debugInfo);
    }

    return debugInfo;
  }

  /**
   * Test Firebase connection and permissions
   */
  async testFirebaseConnection() {
    if (!isFirebaseConfigured || !auth || !db) {
      return {
        success: false,
        error: 'Firebase not configured properly',
        details: {
          configured: isFirebaseConfigured,
          auth: !!auth,
          db: !!db
        }
      };
    }

    try {
      // Test if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          success: false,
          error: 'No authenticated user',
          suggestion: 'Please sign in first'
        };
      }

      // Test basic Firestore read permission
      const { doc, getDoc } = await import('firebase/firestore');
      const userRef = doc(db, 'users', user.uid);
      
      try {
        await getDoc(userRef);
        return {
          success: true,
          message: 'Firebase connection and permissions working',
          userId: user.uid
        };
      } catch (permissionError) {
        return {
          success: false,
          error: 'Permission denied',
          details: permissionError.message,
          suggestion: 'Check Firestore security rules'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: 'Firebase connection test failed',
        details: error.message
      };
    }
  }

  /**
   * Enable development bypass for testing
   */
  enableDevelopmentBypass() {
    if (!this.debugMode) {
      console.warn('Development bypass only available in development mode');
      return false;
    }

    const authStore = useAuthStore.getState();
    authStore.enableDevelopmentBypass();
    
    console.log('🔧 Development bypass enabled');
    return true;
  }

  /**
   * Disable development bypass
   */
  disableDevelopmentBypass() {
    const authStore = useAuthStore.getState();
    authStore.disableDevelopmentBypass();
    
    console.log('🔧 Development bypass disabled');
    return true;
  }

  /**
   * Clean up localStorage and reset auth state
   */
  async resetAuthState() {
    try {
      // Clean up localStorage
      localStorageManager.performCleanup();
      
      // Clear auth-related localStorage
      localStorage.removeItem('mythrill-auth');
      localStorage.removeItem('mythrill-active-character');
      
      // Sign out if authenticated
      if (auth?.currentUser) {
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
      }

      // Reset auth store
      const authStore = useAuthStore.getState();
      authStore.disableDevelopmentBypass();

      console.log('🔄 Auth state reset complete');
      return { success: true };
    } catch (error) {
      console.error('❌ Error resetting auth state:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get storage usage report
   */
  getStorageReport() {
    const stats = localStorageManager.getStorageStats();
    
    console.log('📊 Storage Usage Report:', {
      usage: `${stats.usagePercentage.toFixed(1)}%`,
      totalSize: `${(stats.totalUsage / 1024).toFixed(1)} KB`,
      characterData: stats.characterData,
      backups: stats.backups,
      tempData: stats.tempData,
      approachingQuota: stats.isApproachingQuota
    });

    return stats;
  }
}

// Create singleton instance
const firebaseAuthDebugger = new FirebaseAuthDebugger();

// Expose to window for development debugging
if (process.env.NODE_ENV === 'development') {
  window.firebaseDebug = firebaseAuthDebugger;
  console.log('🔧 Firebase debug tools available at window.firebaseDebug');
}

export default firebaseAuthDebugger;
