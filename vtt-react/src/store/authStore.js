import { getStore } from './storeRegistry';
// Authentication store using Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';
import { isProduction } from '../config/env';

const getSocialStore = () => {
  return getStore('socialStore');
};

const getPresenceStore = () => {
  return getStore('presenceStore');
};

/**
 * Admin dev login master switch.
 * Flip to `false` to disable admin/admin login at any time without a redeploy.
 * Also auto-disabled in production builds (see isAdminLoginEnabled below).
 */
const ADMIN_DEV_LOGIN_ENABLED = true;

/**
 * Returns true only when admin dev login is both enabled in code AND
 * we are not in a production build.
 */
export const isAdminLoginEnabled = () => ADMIN_DEV_LOGIN_ENABLED && !isProduction();

const ADMIN_EMAIL = 'admin';
const ADMIN_PASSWORD = 'admin';
const ADMIN_LOCALSTORAGE_KEY = 'mythrill-admin-user';
const ADMIN_LOCALSTORAGE_DATA_KEY = 'mythrill-admin-user-data';
const ADMIN_LOCALSTORAGE_FLAG = 'mythrill-admin-active';

export const isAdminBypassUser = (user) => !!user?.isAdmin;

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      userData: null,
      isLoading: false,
      isAuthenticated: false,
      isAuthInitialized: false, // Track if auth state has been initialized
      error: null,
      isDevelopmentBypass: false, // Development bypass flag
      isAdminBypass: false, // Admin dev-login bypass flag (gates all subscription features)
      rememberMe: false, // Remember me setting

      // Actions
      setIsAuthInitialized: (isInitialized) => {
        set({ isAuthInitialized: isInitialized });
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isAuthInitialized: true, // Mark auth as initialized
          error: null
        });

        // Load user data from Firestore if user exists
        if (user) {
          get().loadUserData();
        } else {
          set({ userData: null });

          // Clean up presence when user logs out or session expires
          try {
            const presenceStore = getStore('presenceStore');
            if (presenceStore.getState().currentUserPresence) {
              console.log('ðŸ§¹ AuthStore clearing presence data for logged-out user');
              presenceStore.getState().cleanup();
            }
          } catch (error) {
            console.warn('âš ï¸ Could not clean up presence data on logout:', error);
          }
        }
      },

      // Force refresh authentication state to ensure consistency
      refreshAuthState: async () => {
        if (!authService.isConfigured) return;

        try {
          // Force a re-evaluation of the current auth state
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            // User is authenticated, ensure state is consistent
            set({
              user: currentUser,
              isAuthenticated: true,
              error: null
            });
            // Reload user data to ensure it's current
            get().loadUserData();
          } else {
            // No authenticated user, clear state
            set({
              user: null,
              userData: null,
              isAuthenticated: false,
              error: null
            });
          }
        } catch (error) {
          console.error('Error refreshing auth state:', error);
          // On error, clear authentication state to be safe
          set({
            user: null,
            userData: null,
            isAuthenticated: false,
            error: 'Authentication state refresh failed'
          });
        }
      },

      setUserData: (userData) => set({ userData }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Load user data from Firestore
      loadUserData: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const userData = await authService.getUserData(user.uid);
          set({ userData });
        } catch (error) {
          console.error('Error loading user data:', error);
          set({ error: 'Failed to load user data' });
        }
      },

      // Sign up with email and password
      signUp: async (email, password, displayName, friendId = null) => {
        set({ isLoading: true, error: null });

        try {
          const result = await authService.signUp(email, password, displayName, friendId);

          if (result.success) {
            // User will be set via auth state listener
            return { success: true };
          } else {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Sign in with email and password
      signIn: async (email, password, rememberMe = false) => {
        set({ isLoading: true, error: null, rememberMe });

        try {
          const result = await authService.signIn(email, password);

          if (result.success) {
            // Store remember me preference
            set({ rememberMe });
            // User will be set via auth state listener
            return { success: true };
          } else {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Sign in with Google
      signInWithGoogle: async (displayName = null, friendId = null, rememberMe = false) => {
        set({ isLoading: true, error: null, rememberMe });

        try {
          const result = await authService.signInWithGoogle(displayName, friendId);

          if (result.success) {
            // Store remember me preference
            set({ rememberMe });
            // User will be set via auth state listener
            return { success: true };
          } else {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Sign in as Guest
      signInAsGuest: async () => {
        set({ isLoading: true, error: null });

        try {
          // Clear any existing local rooms and characters from previous sessions
          // This ensures guests always start fresh with 0 rooms and 0 characters

          // Clear local rooms
          localStorage.removeItem('mythrill_local_rooms');

          // Clear room state data
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('mythrill_local_room_state_')) {
              localStorage.removeItem(key);
            }
          });

          // Clear guest characters
          localStorage.removeItem('mythrill-guest-characters');

          // Clear any previously joined multiplayer rooms
          localStorage.removeItem('mythrill-guest-joined-room');

          // Sign in to Firebase Anonymously to get a real UID for proper presence tracking
          const authResult = await authService.signInAsAnonymous();
          if (!authResult.success) throw new Error(authResult.error);

          const firebaseUser = authResult.user;
          const guestDisplayName = `Guest${Math.floor(Math.random() * 10000)}`;

          // Create a temporary guest user with the Firebase UID
          const guestUser = {
            uid: firebaseUser.uid,
            email: `guest-${firebaseUser.uid}@mythrill.local`,
            displayName: guestDisplayName,
            photoURL: null,
            emailVerified: false,
            isGuest: true,
            friendId: authService.generateFriendId()
          };

          const guestUserData = {
            displayName: guestUser.displayName,
            email: guestUser.email,
            photoURL: null,
            friendId: guestUser.friendId, // Sync with guestUser
            createdAt: new Date(),
            lastLoginAt: new Date(),
            characters: [],
            preferences: {
              theme: 'pathfinder',
              notifications: true,
              autoSave: false // Guests don't auto-save
            },
            gameData: {
              unlockedSkills: [],
              achievements: [],
              totalPlayTime: 0
            },
            isGuest: true
          };

          // Store guest data in localStorage (not Firebase)
          localStorage.setItem('mythrill-guest-user', JSON.stringify(guestUser));
          localStorage.setItem('mythrill-guest-user-data', JSON.stringify(guestUserData));

          // Mark guest as initialized so we don't clear again on page refresh
          localStorage.setItem('mythrill-guest-initialized', 'true');

          set({
            user: guestUser,
            userData: guestUserData,
            isAuthenticated: true,
            error: null
          });

          return { success: true };
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true, error: null });

        try {
          const { user, isDevelopmentBypass, isAdminBypass } = get();

          // Admin dev-login: just clear admin session
          if (isAdminBypass) {
            get().disableAdminBypass();
            return { success: true };
          }

          // If development bypass user, just disable development bypass
          if (isDevelopmentBypass) {
            set({
              user: null,
              userData: null,
              isAuthenticated: false,
              isDevelopmentBypass: false,
              error: null
            });
            return { success: true };
          }

          // If guest user, just clear localStorage
          if (user?.isGuest) {
            // CRITICAL FIX: Clear all guest data when signing out
            // Clear guest user data
            localStorage.removeItem('mythrill-guest-user');
            localStorage.removeItem('mythrill-guest-user-data');
            localStorage.removeItem('mythrill-guest-character');
            localStorage.removeItem('mythrill-guest-characters');
            localStorage.removeItem('mythrill-active-character');
            localStorage.removeItem('mythrill-guest-initialized'); // Clear initialization flag

            // Clear local rooms (guest rooms should not persist)
            localStorage.removeItem('mythrill_local_rooms');

            // Clear any local room state data
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('mythrill_local_room_state_')) {
                localStorage.removeItem(key);
              }
            });

            // Clear joined multiplayer rooms
            localStorage.removeItem('mythrill-guest-joined-room');

            set({
              user: null,
              userData: null,
              isAuthenticated: false,
              error: null
            });

            return { success: true };
          }

          // Regular user sign out
          // CRITICAL: Clean up Firestore subscriptions BEFORE signOut to prevent permission errors
          // The subscriptions will fail with "Missing or insufficient permissions" if auth is cleared first
          try {
            const socialStore = getSocialStore();
            const { cleanup: socialCleanup } = socialStore.getState();
            if (socialCleanup) {
              console.log('ðŸ§¹ Cleaning up social subscriptions before signOut...');
              socialCleanup();
            }
          } catch (e) {
            console.warn('Non-fatal: Could not cleanup social subscriptions:', e.message);
          }

          try {
            const presenceStore = getPresenceStore();
            const { cleanup: presenceCleanup } = presenceStore.getState();
            if (presenceCleanup) {
              console.log('ðŸ§¹ Cleaning up presence subscriptions before signOut...');
              presenceCleanup();
            }
          } catch (e) {
            console.warn('Non-fatal: Could not cleanup presence subscriptions:', e.message);
          }

          const result = await authService.signOut();

          if (result.success) {
            // User will be cleared via auth state listener
            return { success: true };
          } else {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Reset password
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });

        try {
          const result = await authService.resetPassword(email);

          if (result.success) {
            return { success: true };
          } else {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Update user data
      updateUserData: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const result = await authService.updateUserData(data);

          if (result.success) {
            // Reload user data
            await get().loadUserData();
            return { success: true };
          } else {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Development bypass functions - now uses Firebase Anonymous Auth for proper permissions
      enableDevelopmentBypass: async () => {
        try {
          // Use Firebase Anonymous Auth to get a real Firebase user
          // This ensures Firebase security rules will work properly
          const result = await authService.signInAsAnonymous();

          if (result.success && result.user) {
            const firebaseUser = result.user;

            const devUserData = {
              displayName: 'Development User',
              email: `dev-${firebaseUser.uid}@mythrill.local`,
              photoURL: null,
              createdAt: new Date(),
              lastLoginAt: new Date(),
              characters: [],
              preferences: {
                theme: 'pathfinder',
                notifications: true,
                autoSave: true
              },
              gameData: {
                unlockedSkills: [],
                achievements: [],
                totalPlayTime: 0
              },
              isDevelopmentUser: true,
              friendId: authService.generateFriendId()
            };

            set({
              user: {
                uid: firebaseUser.uid,
                email: `dev-${firebaseUser.uid}@mythrill.local`,
                displayName: 'Development User',
                photoURL: null,
                emailVerified: false,
                isAnonymous: true,
                isDevelopmentUser: true,
                friendId: devUserData.friendId
              },
              userData: devUserData,
              isAuthenticated: true,
              isDevelopmentBypass: true,
              error: null
            });

            console.log('âœ… Development bypass enabled with Firebase Anonymous Auth:', firebaseUser.uid);
            return { success: true };
          } else {
            // Fallback to mock user if anonymous auth fails
            console.warn('âš ï¸ Anonymous auth failed, using mock user (Firebase operations will fail)');
            const mockUser = {
              uid: 'dev-user-123',
              email: 'dev@mythrill.com',
              displayName: 'Development User',
              photoURL: null,
              emailVerified: true,
              isDevelopmentUser: true
            };

            const mockUserData = {
              displayName: 'Development User',
              email: 'dev@mythrill.com',
              photoURL: null,
              createdAt: new Date(),
              lastLoginAt: new Date(),
              characters: [],
              preferences: {
                theme: 'pathfinder',
                notifications: true,
                autoSave: true
              },
              gameData: {
                unlockedSkills: [],
                achievements: [],
                totalPlayTime: 0
              },
              isDevelopmentUser: true
            };

            set({
              user: mockUser,
              userData: mockUserData,
              isAuthenticated: true,
              isDevelopmentBypass: true,
              error: null
            });

            return { success: true, warning: 'Using mock user - Firebase operations may fail' };
          }
        } catch (error) {
          console.error('âŒ Development bypass error:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      disableDevelopmentBypass: () => {
        set({
          user: null,
          userData: null,
          isAuthenticated: false,
          isDevelopmentBypass: false,
          error: null
        });
      },

      /**
       * Returns true if the supplied credentials should trigger admin dev login.
       * Respects both the code toggle and the production guard.
       */
      isAdminLoginCredentials: (email, password) => {
        if (!isAdminLoginEnabled()) return false;
        return (
          String(email ?? '').trim().toLowerCase() === ADMIN_EMAIL &&
          String(password ?? '') === ADMIN_PASSWORD
        );
      },

      /**
       * Sign in as Admin. Bypasses Firebase entirely and grants ULTIMATE tier
       * (all subscription-gated features unlocked). Only available in non-prod
       * builds while ADMIN_DEV_LOGIN_ENABLED is true.
       */
      signInAsAdmin: async () => {
        if (!isAdminLoginEnabled()) {
          set({ error: 'Admin login is disabled.' });
          return { success: false, error: 'Admin login is disabled.' };
        }

        set({ isLoading: true, error: null });

        try {
          const adminUser = {
            uid: 'admin-dev-user',
            email: 'admin',
            displayName: 'Admin',
            photoURL: null,
            emailVerified: true,
            isAdmin: true,
            isAnonymous: false,
            friendId: 'ADMIN'
          };

          const adminUserData = {
            displayName: 'Admin',
            email: 'admin',
            photoURL: null,
            friendId: 'ADMIN',
            friendId_lowercase: 'admin',
            subscriptionTier: 'ultimate',
            createdAt: new Date(),
            lastLoginAt: new Date(),
            characters: [],
            preferences: {
              theme: 'pathfinder',
              notifications: true,
              autoSave: true
            },
            gameData: {
              unlockedSkills: [],
              achievements: [],
              totalPlayTime: 0
            },
            isAdmin: true
          };

          // Persist to localStorage so the admin session survives refresh
          localStorage.setItem(ADMIN_LOCALSTORAGE_KEY, JSON.stringify(adminUser));
          localStorage.setItem(ADMIN_LOCALSTORAGE_DATA_KEY, JSON.stringify(adminUserData));
          localStorage.setItem(ADMIN_LOCALSTORAGE_FLAG, 'true');

          set({
            user: adminUser,
            userData: adminUserData,
            isAuthenticated: true,
            isAdminBypass: true,
            isDevelopmentBypass: false,
            error: null
          });

          console.log('\u2705 Admin dev-login enabled \u2014 ULTIMATE tier active');
          return { success: true };
        } catch (error) {
          console.error('\u274C Admin dev-login error:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Disable admin bypass and clear all admin session data.
       * Used by signOut and by anyone wanting to revoke admin access at runtime.
       */
      disableAdminBypass: () => {
        localStorage.removeItem(ADMIN_LOCALSTORAGE_KEY);
        localStorage.removeItem(ADMIN_LOCALSTORAGE_DATA_KEY);
        localStorage.removeItem(ADMIN_LOCALSTORAGE_FLAG);

        set({
          user: null,
          userData: null,
          isAuthenticated: false,
          isAdminBypass: false,
          error: null
        });
      },

      // Initialize auth state listener
      initializeAuth: () => {
        // CRITICAL FIX: Don't auto-restore guest users on page load
        // Only restore authenticated users from Firebase
        // Guest users should only be restored when explicitly clicking "Continue as Guest"

        // Restore admin dev-login session first if active and still enabled
        const adminActive = localStorage.getItem(ADMIN_LOCALSTORAGE_FLAG) === 'true';
        if (adminActive && isAdminLoginEnabled()) {
          try {
            const adminUserRaw = localStorage.getItem(ADMIN_LOCALSTORAGE_KEY);
            const adminDataRaw = localStorage.getItem(ADMIN_LOCALSTORAGE_DATA_KEY);
            if (adminUserRaw && adminDataRaw) {
              const adminUser = JSON.parse(adminUserRaw);
              const adminUserData = JSON.parse(adminDataRaw);
              set({
                user: adminUser,
                userData: adminUserData,
                isAuthenticated: true,
                isAdminBypass: true,
                isAuthInitialized: true,
                error: null
              });
              console.log('\u2705 Restored admin dev-login session');
              // Still register Firebase listener for safety, but admin user is already restored
            }
          } catch (error) {
            console.error('Error restoring admin session:', error);
            // Corrupt admin state \u2014 clear it
            localStorage.removeItem(ADMIN_LOCALSTORAGE_KEY);
            localStorage.removeItem(ADMIN_LOCALSTORAGE_DATA_KEY);
            localStorage.removeItem(ADMIN_LOCALSTORAGE_FLAG);
          }
        } else if (adminActive && !isAdminLoginEnabled()) {
          // Admin login was active but is now disabled (e.g. production build) \u2014 purge it
          localStorage.removeItem(ADMIN_LOCALSTORAGE_KEY);
          localStorage.removeItem(ADMIN_LOCALSTORAGE_DATA_KEY);
          localStorage.removeItem(ADMIN_LOCALSTORAGE_FLAG);
        }

        // Check if there's a guest user with explicit login flag
        const guestUser = localStorage.getItem('mythrill-guest-user');
        const explicitLogin = localStorage.getItem('mythrill-guest-explicit-login');

        if (guestUser && explicitLogin === 'true') {
          try {
            const parsedGuestUser = JSON.parse(guestUser);
            if (parsedGuestUser.isGuest) {
              // Only restore if explicitly logged in (not on page load)
              const guestUserData = localStorage.getItem('mythrill-guest-user-data');
              if (guestUserData) {
                try {
                  const parsedUserData = JSON.parse(guestUserData);
                  get().setUser(parsedGuestUser);
                  get().setUserData(parsedUserData);
                  get().setIsAuthenticated(true);
                } catch (error) {
                  console.error('Error parsing guest user data:', error);
                }
              }
            }
          } catch (error) {
            console.error('Error checking guest user on init:', error);
          }
        } else if (guestUser) {
          // Guest user exists but no explicit login flag - clear it (prevent auto-login)
          localStorage.removeItem('mythrill-guest-user');
          localStorage.removeItem('mythrill-guest-user-data');
          localStorage.removeItem('mythrill-guest-initialized');
          localStorage.removeItem('mythrill-guest-explicit-login');
          localStorage.removeItem('mythrill-guest-characters');
          localStorage.removeItem('mythrill-guest-joined-room');

          // Clear local rooms
          localStorage.removeItem('mythrill_local_rooms');

          // Clear room state data
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('mythrill_local_room_state_')) {
              localStorage.removeItem(key);
            }
          });
        }

        // CRITICAL FIX: Always mark auth as initialized, even if Firebase fails
        // This prevents the app from getting stuck on "Initializing authentication..."
        setTimeout(() => {
          console.log('ðŸ”„ Auth initialization timeout - marking as initialized');
          set({ isAuthInitialized: true });
        }, 2000); // Give more time for Firebase to initialize if configured

        // Restore authenticated users from Firebase only if service is configured
        if (authService.isConfigured) {
          try {
            return authService.onAuthStateChange((user) => {
              // CRITICAL FIX: Only restore authenticated Firebase users
              // Guest users are handled above with explicit login flag
              if (user && !user.isGuest) {
                get().setUser(user);
              } else if (!user) {
                // Don't clobber an active admin dev-login session when
                // Firebase reports no current user.
                if (get().isAdminBypass) return;
                // No authenticated user - clear state
                get().setUser(null);
              }
            });
          } catch (error) {
            console.warn('Firebase auth initialization failed, continuing without authentication:', error);
            return null;
          }
        } else {
          console.warn('Firebase not configured - authentication disabled, allowing guest access');
          // CRITICAL FIX: When Firebase is not configured, automatically sign in as guest
          // This allows users to access the app immediately without getting stuck
          setTimeout(async () => {
            try {
              console.log('ðŸ”„ Firebase not configured - automatically signing in as guest...');
              await get().signInAsGuest();
              console.log('âœ… Guest sign-in completed successfully');
              // Mark auth as initialized after successful guest sign-in
              set({ isAuthInitialized: true });
            } catch (error) {
              console.error('âŒ Guest sign-in failed:', error);
              // Even if guest sign-in fails, mark auth as initialized
              set({ isAuthInitialized: true });
            }
          }, 100); // Very short delay to ensure immediate access
          return null;
        }
      }
    }),
    {
      name: 'mythrill-auth',
      partialize: (state) => ({
        // Only persist authentication state if there's an actual user
        // This prevents stale authentication state when Firebase session expires
        ...(state.user ? {
          isAuthenticated: state.isAuthenticated,
          isAuthInitialized: state.isAuthInitialized
        } : {
          isAuthInitialized: state.isAuthInitialized
        })
      })
    }
  )
);

export default useAuthStore;
