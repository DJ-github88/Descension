// Authentication store using Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

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
      rememberMe: false, // Remember me setting
      
      // Actions
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

          // Create a temporary guest user
          const guestUser = {
            uid: `guest-${Date.now()}`,
            email: `guest-${Date.now()}@mythrill.local`,
            displayName: `Guest${Math.floor(Math.random() * 10000)}`,
            photoURL: null,
            emailVerified: false,
            isGuest: true
          };

          const guestUserData = {
            displayName: guestUser.displayName,
            email: guestUser.email,
            photoURL: null,
            friendId: null, // Guests don't have Friend IDs
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
          const { user, isDevelopmentBypass } = get();

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
              isDevelopmentUser: true
            };

            set({
              user: {
                uid: firebaseUser.uid,
                email: `dev-${firebaseUser.uid}@mythrill.local`,
                displayName: 'Development User',
                photoURL: null,
                emailVerified: false,
                isAnonymous: true,
                isDevelopmentUser: true
              },
              userData: devUserData,
              isAuthenticated: true,
              isDevelopmentBypass: true,
              error: null
            });
            
            console.log('✅ Development bypass enabled with Firebase Anonymous Auth:', firebaseUser.uid);
            return { success: true };
          } else {
            // Fallback to mock user if anonymous auth fails
            console.warn('⚠️ Anonymous auth failed, using mock user (Firebase operations will fail)');
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
          console.error('❌ Development bypass error:', error);
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

      // Initialize auth state listener
      initializeAuth: () => {
        // CRITICAL FIX: Don't auto-restore guest users on page load
        // Only restore authenticated users from Firebase
        // Guest users should only be restored when explicitly clicking "Continue as Guest"

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
          console.log('🔄 Auth initialization timeout - marking as initialized');
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
              console.log('🔄 Firebase not configured - automatically signing in as guest...');
              await get().signInAsGuest();
              console.log('✅ Guest sign-in completed successfully');
              // Mark auth as initialized after successful guest sign-in
              set({ isAuthInitialized: true });
            } catch (error) {
              console.error('❌ Guest sign-in failed:', error);
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
