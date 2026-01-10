// Subscription service for managing user tiers and room limits
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';

// Subscription tiers with room and character limits
export const SUBSCRIPTION_TIERS = {
  GUEST: {
    id: 'guest',
    name: 'Guest',
    roomLimit: 1,
    characterLimit: 1,
    features: ['1 temporary character', 'Create multiplayer rooms', 'Join multiplayer rooms', 'No cloud save', 'Data cleared on logout'],
    price: 0,
    description: 'Try out Mythrill without an account - create characters and multiplayer rooms'
  },
  FREE: {
    id: 'free',
    name: 'Free Adventurer',
    roomLimit: 1,
    characterLimit: 50,
    features: [
      'Cloud character save',
      '50 character slots',
      '1 persistent room',
      'Unlimited local play',
      'Basic multiplayer features'
    ],
    price: 0,
    description: 'Perfect for getting started with online campaigns'
  },
  DEV_PREVIEW: {
    id: 'dev_preview',
    name: 'Dev Preview',
    roomLimit: 3,
    characterLimit: 50,
    features: [
      'Cloud character save',
      '50 character slots',
      '3 persistent rooms',
      'Unlimited local play',
      'Dev Preview access'
    ],
    price: 0,
    description: 'Development preview account'
  },
  SUBSCRIBER: {
    id: 'subscriber',
    name: 'Campaign Master',
    roomLimit: 3,
    characterLimit: 6,
    features: [
      'Cloud character save',
      '6 character slots',
      '3 persistent rooms',
      'Unlimited local play',
      'Advanced multiplayer features',
      'Priority support',
      'Early access to new features'
    ],
    price: 9.99,
    description: 'For serious Game Masters running multiple campaigns'
  },
  PREMIUM: {
    id: 'premium',
    name: 'Guild Leader',
    roomLimit: 10,
    characterLimit: 24,
    features: [
      'Cloud character save',
      '24 character slots',
      '10 persistent rooms',
      'Unlimited local play',
      'All multiplayer features',
      'Priority support',
      'Early access to new features',
      'Custom room themes',
      'Advanced analytics'
    ],
    price: 19.99,
    description: 'For communities and professional Game Masters'
  }
};

class SubscriptionService {
  constructor() {
    this.isConfigured = isFirebaseConfigured;
  }

  /**
   * Get user's current subscription tier
   * @param {string} userId - User ID (optional, uses current user if not provided)
   * @returns {Object} - Subscription tier object
   */
  async getUserTier(userId = null) {
    const checkUserId = userId || auth.currentUser?.uid;

    // CRITICAL FIX: Check for guest users FIRST (before demo mode)
    // This ensures guest users always get 1 character even in demo mode

    // Check if the userId indicates a guest user (check userId FIRST)
    if (checkUserId && checkUserId.startsWith('guest-')) {
      return SUBSCRIPTION_TIERS.GUEST;
    }

    // Check if user is a guest in localStorage
    const guestUser = localStorage.getItem('mythrill-guest-user');
    if (guestUser) {
      try {
        const parsedGuestUser = JSON.parse(guestUser);
        if (parsedGuestUser.isGuest) {
          return SUBSCRIPTION_TIERS.GUEST;
        }
      } catch (error) {
        console.warn('Could not parse guest user:', error);
      }
    }

    // CRITICAL FIX: Check for dev/demo mode AFTER guest check
    // This ensures dev users get the correct tier (50 characters) but guests still get 1

    // Check for development bypass (dev mode)
    try {
      const { default: useAuthStore } = await import('../store/authStore');
      const authState = useAuthStore.getState();
      if (authState.isDevelopmentBypass || checkUserId === 'dev-user-123' || checkUserId?.startsWith('dev-user-')) {
        return SUBSCRIPTION_TIERS.DEV_PREVIEW;
      }
    } catch (error) {
      console.warn('Could not check dev bypass:', error);
    }

    // Check for demo mode (only for authenticated users, not guests)
    try {
      const { isDemoMode } = await import('../config/firebase');
      if (isDemoMode) {
        // Only return demo tier if user is authenticated (not guest)
        if (auth.currentUser || (checkUserId && !checkUserId.startsWith('guest-'))) {
          // In demo mode, give Dev Preview tier instead of unlimited
          return SUBSCRIPTION_TIERS.DEV_PREVIEW;
        }
      }
    } catch (error) {
      console.warn('Could not check demo mode:', error);
    }

    // If not logged in, return guest tier
    if (!auth.currentUser && !userId) {
      return SUBSCRIPTION_TIERS.GUEST;
    }

    // If Firebase not configured, return appropriate tier
    if (!this.isConfigured) {
      return auth.currentUser ? SUBSCRIPTION_TIERS.FREE : SUBSCRIPTION_TIERS.GUEST;
    }

    try {
      const uid = userId || auth.currentUser.uid;
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Check if user is marked as guest in Firestore
        if (userData.isGuest) {
          return SUBSCRIPTION_TIERS.GUEST;
        }

        const tierKey = userData.subscriptionTier || 'free';

        // Validate tier exists
        const tier = Object.values(SUBSCRIPTION_TIERS).find(t => t.id === tierKey);
        return tier || SUBSCRIPTION_TIERS.FREE;
      } else {
        // New user, default to free tier
        return SUBSCRIPTION_TIERS.FREE;
      }
    } catch (error) {
      console.error('Error fetching user tier:', error);
      return SUBSCRIPTION_TIERS.FREE; // Fallback to free tier
    }
  }

  /**
   * Check if user can create more rooms
   * @param {number} currentRoomCount - Current number of rooms user has
   * @param {string} userId - User ID (optional)
   * @returns {Promise<Object>} - { canCreate: boolean, tier: Object, limit: number, remaining: number }
   */
  async canCreateRoom(currentRoomCount, userId = null) {
    const tier = await this.getUserTier(userId);
    const remaining = Math.max(0, tier.roomLimit - currentRoomCount);

    return {
      canCreate: currentRoomCount < tier.roomLimit,
      tier: tier,
      limit: tier.roomLimit,
      remaining: remaining,
      isAtLimit: currentRoomCount >= tier.roomLimit
    };
  }

  /**
   * Get room limit for current user
   * @param {string} userId - User ID (optional)
   * @returns {Promise<number>} - Room limit
   */
  async getRoomLimit(userId = null) {
    const tier = await this.getUserTier(userId);
    return tier.roomLimit;
  }

  /**
   * Update user's subscription tier
   * @param {string} tierId - New tier ID
   * @param {string} userId - User ID (optional)
   * @returns {Promise<boolean>} - Success status
   */
  async updateUserTier(tierId, userId = null) {
    if (!this.isConfigured) {
      console.warn('Firebase not configured, cannot update subscription tier');
      return false;
    }

    try {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) {
        throw new Error('No user ID provided and no current user');
      }

      // Validate tier exists
      const tier = Object.values(SUBSCRIPTION_TIERS).find(t => t.id === tierId);
      if (!tier) {
        throw new Error(`Invalid tier ID: ${tierId}`);
      }

      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        subscriptionTier: tierId,
        subscriptionUpdatedAt: new Date(),
        lastModified: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error updating user tier:', error);
      return false;
    }
  }

  /**
   * Get all available subscription tiers
   * @returns {Array} - Array of tier objects
   */
  getAllTiers() {
    return Object.values(SUBSCRIPTION_TIERS);
  }

  /**
   * Get tier by ID
   * @param {string} tierId - Tier ID
   * @returns {Object|null} - Tier object or null if not found
   */
  getTierById(tierId) {
    return Object.values(SUBSCRIPTION_TIERS).find(t => t.id === tierId) || null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return !!auth.currentUser;
  }

  /**
   * Get subscription status for display
   * @param {string} userId - User ID (optional)
   * @returns {Promise<Object>} - Status object with tier info and limits
   */
  async getSubscriptionStatus(userId = null) {
    const tier = await this.getUserTier(userId);
    const isAuthenticated = this.isAuthenticated();

    return {
      tier: tier,
      isAuthenticated: isAuthenticated,
      roomLimit: tier.roomLimit,
      characterLimit: tier.characterLimit,
      canCreateRooms: tier.roomLimit > 0,
      canCreateCharacters: tier.characterLimit > 0,
      features: tier.features,
      displayName: tier.name,
      description: tier.description
    };
  }

  /**
   * Check if user can create more characters
   * @param {number} currentCharacterCount - Current number of characters
   * @param {string} userId - User ID (optional)
   * @returns {Promise<Object>} - Object with canCreate boolean and limit info
   */
  async canCreateCharacter(currentCharacterCount, userId = null) {
    // CRITICAL FIX: Use getUserTier which now checks dev/demo mode FIRST
    // This ensures dev users get 50 characters, guest users get 1 character
    const tier = await this.getUserTier(userId);

    const characterLimit = tier.characterLimit;
    const remaining = Math.max(0, characterLimit - currentCharacterCount);

    return {
      canCreate: currentCharacterCount < characterLimit,
      currentCount: currentCharacterCount,
      limit: characterLimit,
      remaining: remaining,
      tierName: tier.name,
      isUnlimited: characterLimit >= 999
    };
  }

  /**
   * Get character limit for user's current tier
   * @param {string} userId - User ID (optional)
   * @returns {Promise<number>} - Character limit
   */
  async getCharacterLimit(userId = null) {
    const tier = await this.getUserTier(userId);
    return tier.characterLimit;
  }
}

// Create singleton instance
const subscriptionService = new SubscriptionService();

export default subscriptionService;
