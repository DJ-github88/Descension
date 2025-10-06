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
      error: null,
      isDevelopmentBypass: false, // Development bypass flag
      
      // Actions
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          error: null 
        });
        
        // Load user data from Firestore if user exists
        if (user) {
          get().loadUserData();
        } else {
          set({ userData: null });
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
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await authService.signIn(email, password);
          
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

      // Sign in with Google
      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });

        try {
          const result = await authService.signInWithGoogle();

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

      // Sign in as Guest
      signInAsGuest: async () => {
        set({ isLoading: true, error: null });

        try {
          // Clear any existing local rooms and characters from previous sessions
          // This ensures guests always start fresh with 0 rooms and 0 characters
          console.log('🧹 Clearing existing local rooms and characters for fresh guest session');

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

          console.log('✅ Guest login successful - starting with 0 rooms and 0 characters');
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
          const { user } = get();

          // If guest user, just clear localStorage
          if (user?.isGuest) {
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

            console.log('✅ Guest logged out - all guest data, local rooms, and joined rooms cleared');
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

      // Development bypass functions
      enableDevelopmentBypass: () => {
        const mockUser = {
          uid: 'dev-user-123',
          email: 'dev@mythrill.com',
          displayName: 'Development User',
          photoURL: null,
          emailVerified: true
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
          }
        };

        set({
          user: mockUser,
          userData: mockUserData,
          isAuthenticated: true,
          isDevelopmentBypass: true,
          error: null
        });
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
        // Check if there's a guest user in localStorage on app initialization
        const guestUser = localStorage.getItem('mythrill-guest-user');
        if (guestUser) {
          try {
            const parsedGuestUser = JSON.parse(guestUser);
            if (parsedGuestUser.isGuest) {
              // Check if this is a fresh guest session (no initialization flag)
              const guestInitialized = localStorage.getItem('mythrill-guest-initialized');

              if (!guestInitialized) {
                // First time loading this guest session - clear all rooms and characters
                console.log('🧹 Initializing fresh guest session - clearing all rooms and characters');

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

                // Mark guest as initialized
                localStorage.setItem('mythrill-guest-initialized', 'true');
                console.log('✅ Guest session initialized with 0 rooms and 0 characters');
              }
            }
          } catch (error) {
            console.error('Error checking guest user on init:', error);
          }
        }

        return authService.onAuthStateChange((user) => {
          get().setUser(user);
        });
      }
    }),
    {
      name: 'mythrill-auth',
      partialize: (state) => ({
        // Only persist non-sensitive data
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
