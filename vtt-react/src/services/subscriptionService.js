// Subscription service for managing user tiers and room limits
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';

const TIER_FEATURE_FLAGS = {
  dynamicFog: { SUBSCRIBER: true, PREMIUM: true },
  dynamicLighting: { SUBSCRIBER: true, PREMIUM: true },
  atmosphericEffects: { SUBSCRIBER: true, PREMIUM: true },
  campaignManager: { SUBSCRIBER: true, PREMIUM: true },
  memorySnapshots: { SUBSCRIBER: true, PREMIUM: true },
  portalSystem: { SUBSCRIBER: true, PREMIUM: true },
  autoBackups: { SUBSCRIBER: true, PREMIUM: true },
  travelSystem: { SUBSCRIBER: true, PREMIUM: true },
  questSharing: { SUBSCRIBER: true, PREMIUM: true },
  communitySharing: { SUBSCRIBER: true, PREMIUM: true },
  friendsList: { FREE: true, SUBSCRIBER: true, PREMIUM: true },
  journal: { FREE: true, SUBSCRIBER: true, PREMIUM: true },
  contentPacks: { PREMIUM: true },
  guildManagement: { PREMIUM: true },
  analytics: { PREMIUM: true },
  customRoomThemes: { PREMIUM: true },
  earlyAccess: { SUBSCRIBER: true, PREMIUM: true },
  bulkImportExport: { PREMIUM: true },
  rollableTables: { PREMIUM: true },
  roomCreation: { FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  gmTools: { FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  spellCrafting: { FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  creatureCreation: { FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  itemGeneration: { FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  combatSystem: { GUEST: true, FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  diceRolling: { GUEST: true, FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  basicMapEditor: { FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  staticFog: { FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  cloudSave: { FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  globalChat: { FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  localRooms: { FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  joinRooms: { GUEST: true, FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true },
  roomChat: { GUEST: true, FREE: true, DEV_PREVIEW: true, SUBSCRIBER: true, PREMIUM: true }
};

export function canUseFeature(featureName, tierKey) {
  const flags = TIER_FEATURE_FLAGS[featureName];
  if (!flags) return true;
  return !!flags[tierKey];
}

export function getRequiredTierForFeature(featureName) {
  const flags = TIER_FEATURE_FLAGS[featureName];
  if (!flags) return null;
  const tiers = Object.keys(flags);
  if (tiers.includes('FREE')) return 'FREE';
  if (tiers.includes('SUBSCRIBER')) return 'SUBSCRIBER';
  if (tiers.includes('PREMIUM')) return 'PREMIUM';
  return tiers[0] || null;
}

// Subscription tiers with room, character, and player limits
export const SUBSCRIPTION_TIERS = {
  GUEST: {
    id: 'guest',
    name: 'Guest',
    roomLimit: 0,
    characterLimit: 1,
    maxPlayersPerRoom: 0,
    storageLimit: 0,
    features: [
      'Join multiplayer rooms as a player',
      '1 temporary character',
      'Full combat & dice rolling',
      'Room chat',
      'No cloud save — data cleared on disconnect'
    ],
    featureFlags: {
      dynamicFog: false, dynamicLighting: false, atmosphericEffects: false,
      campaignManager: false, memorySnapshots: false, portalSystem: false,
      autoBackups: false, travelSystem: false, questSharing: false,
      communitySharing: false, friendsList: false, journal: false,
      contentPacks: false, guildManagement: false, analytics: false,
      customRoomThemes: false, earlyAccess: false, bulkImportExport: false,
      rollableTables: false, roomCreation: false, gmTools: false,
      spellCrafting: false, creatureCreation: false, itemGeneration: false,
      combatSystem: true, diceRolling: true, basicMapEditor: false,
      staticFog: false, cloudSave: false, globalChat: false,
      localRooms: false, joinRooms: true, roomChat: true
    },
    price: 0,
    description: 'Try Mythrill by joining a friend\'s game — no account needed',
    icon: 'fa-user-secret',
    color: '#888'
  },
  FREE: {
    id: 'free',
    name: 'Free Adventurer',
    roomLimit: 1,
    characterLimit: 3,
    maxPlayersPerRoom: 4,
    storageLimit: 25 * 1024 * 1024,
    features: [
      '3 character slots with cloud save',
      '1 permanent room (up to 4 players)',
      '25 MB cloud storage',
      'Full character creation (27 classes, 12 races)',
      'Spell crafting, creature & item creation',
      'Full map editor with static fog of war',
      'Combat system & 3D physics dice',
      'Unlimited local rooms (offline)',
      'Global chat & basic friends list',
      'Cloud-synced journal'
    ],
    featureFlags: {
      dynamicFog: false, dynamicLighting: false, atmosphericEffects: false,
      campaignManager: false, memorySnapshots: false, portalSystem: false,
      autoBackups: false, travelSystem: false, questSharing: false,
      communitySharing: false, friendsList: true, journal: true,
      contentPacks: false, guildManagement: false, analytics: false,
      customRoomThemes: false, earlyAccess: false, bulkImportExport: false,
      rollableTables: false, roomCreation: true, gmTools: true,
      spellCrafting: true, creatureCreation: true, itemGeneration: true,
      combatSystem: true, diceRolling: true, basicMapEditor: true,
      staticFog: true, cloudSave: true, globalChat: true,
      localRooms: true, joinRooms: true, roomChat: true
    },
    price: 0,
    description: 'Everything you need to start playing and GMing',
    icon: 'fa-shield-halved',
    color: '#4a9eff'
  },
  DEV_PREVIEW: {
    id: 'dev_preview',
    name: 'Dev Preview',
    roomLimit: 5,
    characterLimit: 50,
    maxPlayersPerRoom: 12,
    storageLimit: 1 * 1024 * 1024 * 1024,
    features: [
      'All features unlocked (dev access)',
      '50 character slots with cloud save',
      '5 permanent rooms',
      'Full access to all tools'
    ],
    featureFlags: {
      dynamicFog: true, dynamicLighting: true, atmosphericEffects: true,
      campaignManager: true, memorySnapshots: true, portalSystem: true,
      autoBackups: true, travelSystem: true, questSharing: true,
      communitySharing: true, friendsList: true, journal: true,
      contentPacks: true, guildManagement: true, analytics: true,
      customRoomThemes: true, earlyAccess: true, bulkImportExport: true,
      rollableTables: true, roomCreation: true, gmTools: true,
      spellCrafting: true, creatureCreation: true, itemGeneration: true,
      combatSystem: true, diceRolling: true, basicMapEditor: true,
      staticFog: true, cloudSave: true, globalChat: true,
      localRooms: true, joinRooms: true, roomChat: true
    },
    price: 0,
    description: 'Development preview account — full access',
    icon: 'fa-code',
    color: '#ff9800'
  },
  SUBSCRIBER: {
    id: 'subscriber',
    name: 'Campaign Master',
    roomLimit: 5,
    characterLimit: 15,
    maxPlayersPerRoom: 6,
    storageLimit: 500 * 1024 * 1024,
    features: [
      '15 character slots with cloud save',
      '5 permanent rooms (up to 6 players each)',
      '500 MB cloud storage',
      'Dynamic fog of war & line-of-sight',
      'Dynamic lighting with shadows & colors',
      'Atmospheric effects (rain, snow, fog, embers)',
      'Campaign manager with session tracking',
      'Portal system — connect multiple maps',
      'Memory snapshots & afterimages',
      'Full GM notes (scroll, NPC, encounter, trap…)',
      'Automatic daily character backups',
      'Travel system with biomes & weather',
      'Quest creation & sharing',
      'Community content sharing',
      'Priority support & early access'
    ],
    featureFlags: {
      dynamicFog: true, dynamicLighting: true, atmosphericEffects: true,
      campaignManager: true, memorySnapshots: true, portalSystem: true,
      autoBackups: true, travelSystem: true, questSharing: true,
      communitySharing: true, friendsList: true, journal: true,
      contentPacks: false, guildManagement: false, analytics: false,
      customRoomThemes: false, earlyAccess: true, bulkImportExport: false,
      rollableTables: false, roomCreation: true, gmTools: true,
      spellCrafting: true, creatureCreation: true, itemGeneration: true,
      combatSystem: true, diceRolling: true, basicMapEditor: true,
      staticFog: true, cloudSave: true, globalChat: true,
      localRooms: true, joinRooms: true, roomChat: true
    },
    price: 9.99,
    description: 'For serious Game Masters running campaigns',
    icon: 'fa-crown',
    color: '#9b59b6',
    highlight: true
  },
  PREMIUM: {
    id: 'premium',
    name: 'Guild Leader',
    roomLimit: 25,
    characterLimit: -1,
    maxPlayersPerRoom: 12,
    storageLimit: 5 * 1024 * 1024 * 1024,
    features: [
      'Unlimited character slots with cloud save',
      '25 permanent rooms (up to 12 players each)',
      'Everything in Campaign Master +',
      'Content packs — create & share bundles',
      'Custom rollable tables',
      'Guild & persistent group management',
      'Campaign analytics dashboard',
      'Custom room themes',
      'Priority support & early access',
      'Bulk import/export tools',
      '5 GB cloud storage'
    ],
    featureFlags: {
      dynamicFog: true, dynamicLighting: true, atmosphericEffects: true,
      campaignManager: true, memorySnapshots: true, portalSystem: true,
      autoBackups: true, travelSystem: true, questSharing: true,
      communitySharing: true, friendsList: true, journal: true,
      contentPacks: true, guildManagement: true, analytics: true,
      customRoomThemes: true, earlyAccess: true, bulkImportExport: true,
      rollableTables: true, roomCreation: true, gmTools: true,
      spellCrafting: true, creatureCreation: true, itemGeneration: true,
      combatSystem: true, diceRolling: true, basicMapEditor: true,
      staticFog: true, cloudSave: true, globalChat: true,
      localRooms: true, joinRooms: true, roomChat: true
    },
    price: 19.99,
    description: 'For communities and professional Game Masters',
    icon: 'fa-chess-king',
    color: '#f1c40f'
  }
};

export const TIER_ORDER = ['GUEST', 'FREE', 'SUBSCRIBER', 'PREMIUM'];

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
      canCreate: tier.roomLimit > 0 && currentRoomCount < tier.roomLimit,
      tier: tier,
      limit: tier.roomLimit,
      remaining: remaining,
      isAtLimit: tier.roomLimit === 0 || currentRoomCount >= tier.roomLimit,
      maxPlayersPerRoom: tier.maxPlayersPerRoom || 0,
      canCreateRooms: tier.roomLimit > 0
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
    const tierKey = this.getTierKey(tier.id);

    return {
      tier: tier,
      tierKey: tierKey,
      isAuthenticated: isAuthenticated,
      roomLimit: tier.roomLimit,
      characterLimit: tier.characterLimit,
      maxPlayersPerRoom: tier.maxPlayersPerRoom || 0,
      storageLimit: tier.storageLimit || 0,
      canCreateRooms: tier.roomLimit > 0,
      canCreateCharacters: tier.characterLimit === -1 || tier.characterLimit > 0,
      isUnlimitedCharacters: tier.characterLimit === -1,
      features: tier.features,
      featureFlags: tier.featureFlags,
      displayName: tier.name,
      description: tier.description,
      price: tier.price,
      icon: tier.icon,
      color: tier.color
    };
  }

  /**
   * Check if current user can use a specific feature
   * @param {string} featureName - Feature flag name
   * @param {string} userId - User ID (optional)
   * @returns {Promise<boolean>}
   */
  async canUseFeature(featureName, userId = null) {
    const tier = await this.getUserTier(userId);
    if (tier.featureFlags && tier.featureFlags[featureName] !== undefined) {
      return tier.featureFlags[featureName];
    }
    return canUseFeature(featureName, this.getTierKey(tier.id));
  }

  /**
   * Get the tier key (GUEST, FREE, etc.) from a tier ID
   * @param {string} tierId - Tier ID like 'guest', 'free', 'subscriber', 'premium'
   * @returns {string} - Tier key like 'GUEST', 'FREE', 'SUBSCRIBER', 'PREMIUM'
   */
  getTierKey(tierId) {
    const mapping = {
      'guest': 'GUEST',
      'free': 'FREE',
      'dev_preview': 'DEV_PREVIEW',
      'subscriber': 'SUBSCRIBER',
      'premium': 'PREMIUM'
    };
    return mapping[tierId] || 'FREE';
  }

  /**
   * Get tier objects for display (excludes DEV_PREVIEW)
   * @returns {Array}
   */
  getDisplayTiers() {
    return TIER_ORDER.map(key => ({
      ...SUBSCRIPTION_TIERS[key],
      key
    }));
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
    const isUnlimited = characterLimit === -1;

    return {
      canCreate: isUnlimited || currentCharacterCount < characterLimit,
      currentCount: currentCharacterCount,
      limit: isUnlimited ? -1 : characterLimit,
      remaining: isUnlimited ? -1 : Math.max(0, characterLimit - currentCharacterCount),
      tierName: tier.name,
      isUnlimited: isUnlimited
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
