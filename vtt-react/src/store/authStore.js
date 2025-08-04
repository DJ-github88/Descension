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
      signUp: async (email, password, displayName) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await authService.signUp(email, password, displayName);
          
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

      // Sign out
      signOut: async () => {
        set({ isLoading: true, error: null });
        
        try {
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

      // Initialize auth state listener
      initializeAuth: () => {
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
