import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';

// Tier Feature Flags — gates GM tool CONTROLS only.
// Players always SEE whatever the GM creates/broadcasts regardless of their own tier.
// Tier restrictions only limit: data storage, tool access, and creation capabilities.
const TIER_FEATURE_FLAGS = {
  dynamicFog: { FREE: true, PRO: true, ULTIMATE: true },
  dynamicLighting: { FREE: true, PRO: true, ULTIMATE: true },
  atmosphericEffects: { PRO: true, ULTIMATE: true },
  portalSystem: { PRO: true, ULTIMATE: true },
  travelSystem: { PRO: true, ULTIMATE: true },
  gmNotes: { PRO: true, ULTIMATE: true },
  memorySnapshots: { FREE: true, PRO: true, ULTIMATE: true },
  campaignManagerFull: { PRO: true, ULTIMATE: true },
  questSharing: { PRO: true, ULTIMATE: true },
  journalFull: { PRO: true, ULTIMATE: true },
  customRollableTables: { PRO: true, ULTIMATE: true },
  earlyAccess: { PRO: true, ULTIMATE: true },
  analytics: { ULTIMATE: true },
  customRoomThemes: { ULTIMATE: true },
  communitySharing: { FREE: true, PRO: true, ULTIMATE: true },
  friendsList: { FREE: true, PRO: true, ULTIMATE: true },
  autoBackups: { FREE: true, PRO: true, ULTIMATE: true },
  roomCreation: { FREE: true, PRO: true, ULTIMATE: true },
  gmTools: { FREE: true, PRO: true, ULTIMATE: true },
  spellCrafting: { FREE: true, PRO: true, ULTIMATE: true },
  creatureCreation: { FREE: true, PRO: true, ULTIMATE: true },
  itemGeneration: { FREE: true, PRO: true, ULTIMATE: true },
  combatSystem: { GUEST: true, FREE: true, PRO: true, ULTIMATE: true },
  diceRolling: { GUEST: true, FREE: true, PRO: true, ULTIMATE: true },
  basicMapEditor: { FREE: true, PRO: true, ULTIMATE: true },
  staticFog: { FREE: true, PRO: true, ULTIMATE: true },
  cloudSave: { FREE: true, PRO: true, ULTIMATE: true },
  globalChat: { FREE: true, PRO: true, ULTIMATE: true },
  localRooms: { FREE: true, PRO: true, ULTIMATE: true },
  joinRooms: { GUEST: true, FREE: true, PRO: true, ULTIMATE: true },
  roomChat: { GUEST: true, FREE: true, PRO: true, ULTIMATE: true },
  rollableTablesPreset: { FREE: true, PRO: true, ULTIMATE: true },
  journalBasic: { FREE: true, PRO: true, ULTIMATE: true },
  campaignManagerBasic: { FREE: true, PRO: true, ULTIMATE: true }
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
  if (tiers.includes('PRO')) return 'PRO';
  if (tiers.includes('ULTIMATE')) return 'ULTIMATE';
  return tiers[0] || null;
}

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
      portalSystem: false, travelSystem: false, gmNotes: false,
      memorySnapshots: true, campaignManagerFull: false, questSharing: false,
      journalFull: false, customRollableTables: false, earlyAccess: false,
      analytics: false, customRoomThemes: false,
      communitySharing: false, friendsList: false, autoBackups: false,
      rollableTablesPreset: false, journalBasic: false, campaignManagerBasic: false,
      roomCreation: false, gmTools: false,
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
    name: 'Adventurer',
    roomLimit: 1,
    characterLimit: 3,
    maxPlayersPerRoom: 3,
    storageLimit: 25 * 1024 * 1024,
    features: [
      '3 character slots with cloud save',
      '1 permanent room (up to 3 players)',
      '25 MB cloud storage',
      'Full character creation (27 classes, 12 races)',
      'Spell crafting, creature & item creation',
      'Full map editor with dynamic fog & lighting',
      'Combat system & 3D physics dice',
      'Unlimited local rooms (offline)',
      'Global chat & friends list',
      'Basic journal & auto backups',
      'Community content sharing',
      'Preset rollable tables'
    ],
    featureFlags: {
      dynamicFog: true, dynamicLighting: true, atmosphericEffects: false,
      portalSystem: false, travelSystem: false, gmNotes: false,
      memorySnapshots: true, campaignManagerFull: false, questSharing: false,
      journalFull: false, customRollableTables: false, earlyAccess: false,
      analytics: false, customRoomThemes: false,
      communitySharing: true, friendsList: true, autoBackups: true,
      rollableTablesPreset: true, journalBasic: true, campaignManagerBasic: true,
      roomCreation: true, gmTools: true,
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
    roomLimit: 25,
    characterLimit: -1,
    maxPlayersPerRoom: 12,
    storageLimit: 5 * 1024 * 1024 * 1024,
    features: [
      'All features unlocked (dev access)',
      'Unlimited character slots',
      '25 permanent rooms',
      'Full access to all tools'
    ],
    featureFlags: {
      dynamicFog: true, dynamicLighting: true, atmosphericEffects: true,
      portalSystem: true, travelSystem: true, gmNotes: true,
      memorySnapshots: true, campaignManagerFull: true, questSharing: true,
      journalFull: true, customRollableTables: true, earlyAccess: true,
      analytics: true, customRoomThemes: true,
      communitySharing: true, friendsList: true, autoBackups: true,
      rollableTablesPreset: true, journalBasic: true, campaignManagerBasic: true,
      roomCreation: true, gmTools: true,
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
  PRO: {
    id: 'pro',
    name: 'Dungeon Master',
    roomLimit: 5,
    characterLimit: 15,
    maxPlayersPerRoom: 6,
    storageLimit: 500 * 1024 * 1024,
    features: [
      '15 character slots with cloud save',
      '5 permanent rooms (up to 6 players each)',
      '500 MB cloud storage',
      'Full GM notes (scroll, NPC, encounter, trap, loot)',
      'Portal system — connect multiple maps',
      'Travel system with biomes & weather',
      'Atmospheric effects (rain, snow, fog, embers)',
      'Memory snapshots & afterimages',
      'Full campaign manager with session tracking',
      'Quest creation & sharing',
      'Full journal with categories & sharing',
      'Custom rollable tables',
      'Community content sharing',
      'Priority support & early access'
    ],
    featureFlags: {
      dynamicFog: true, dynamicLighting: true, atmosphericEffects: true,
      portalSystem: true, travelSystem: true, gmNotes: true,
      memorySnapshots: true, campaignManagerFull: true, questSharing: true,
      journalFull: true, customRollableTables: true, earlyAccess: true,
      analytics: false, customRoomThemes: false,
      communitySharing: true, friendsList: true, autoBackups: true,
      rollableTablesPreset: true, journalBasic: true, campaignManagerBasic: true,
      roomCreation: true, gmTools: true,
      spellCrafting: true, creatureCreation: true, itemGeneration: true,
      combatSystem: true, diceRolling: true, basicMapEditor: true,
      staticFog: true, cloudSave: true, globalChat: true,
      localRooms: true, joinRooms: true, roomChat: true
    },
    price: 7.99,
    description: 'For serious Game Masters running campaigns',
    icon: 'fa-crown',
    color: '#9b59b6',
    highlight: true
  },
  ULTIMATE: {
    id: 'ultimate',
    name: 'Archmage',
    roomLimit: 25,
    characterLimit: -1,
    maxPlayersPerRoom: 12,
    storageLimit: 5 * 1024 * 1024 * 1024,
    features: [
      'Unlimited character slots with cloud save',
      '25 permanent rooms (up to 12 players each)',
      '5 GB cloud storage',
      'Everything in Dungeon Master +',
      'Campaign analytics dashboard',
      'Custom room themes',
      'Priority support & early access'
    ],
    featureFlags: {
      dynamicFog: true, dynamicLighting: true, atmosphericEffects: true,
      portalSystem: true, travelSystem: true, gmNotes: true,
      memorySnapshots: true, campaignManagerFull: true, questSharing: true,
      journalFull: true, customRollableTables: true, earlyAccess: true,
      analytics: true, customRoomThemes: true,
      communitySharing: true, friendsList: true, autoBackups: true,
      rollableTablesPreset: true, journalBasic: true, campaignManagerBasic: true,
      roomCreation: true, gmTools: true,
      spellCrafting: true, creatureCreation: true, itemGeneration: true,
      combatSystem: true, diceRolling: true, basicMapEditor: true,
      staticFog: true, cloudSave: true, globalChat: true,
      localRooms: true, joinRooms: true, roomChat: true
    },
    price: 14.99,
    description: 'For communities and professional Game Masters',
    icon: 'fa-chess-king',
    color: '#f1c40f'
  }
};

export const TIER_ORDER = ['FREE', 'PRO', 'ULTIMATE'];

const LEGACY_TIER_MAPPING = {
  'subscriber': 'pro',
  'premium': 'ultimate',
  'SUBSCRIBER': 'pro',
  'PREMIUM': 'ultimate',
  'campaign_master': 'pro',
  'guild_leader': 'ultimate'
};

class SubscriptionService {
  constructor() {
    this.isConfigured = isFirebaseConfigured;
  }

  async getUserTier(userId = null) {
    const checkUserId = userId || auth.currentUser?.uid;

    if (checkUserId && checkUserId.startsWith('guest-')) {
      return SUBSCRIPTION_TIERS.GUEST;
    }

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

    try {
      const { default: useAuthStore } = await import('../store/authStore');
      const authState = useAuthStore.getState();
      if (authState.isDevelopmentBypass || checkUserId === 'dev-user-123' || checkUserId?.startsWith('dev-user-')) {
        return SUBSCRIPTION_TIERS.DEV_PREVIEW;
      }
    } catch (error) {
      console.warn('Could not check dev bypass:', error);
    }

    try {
      const { isDemoMode } = await import('../config/firebase');
      if (isDemoMode) {
        if (auth.currentUser || (checkUserId && !checkUserId.startsWith('guest-'))) {
          return SUBSCRIPTION_TIERS.DEV_PREVIEW;
        }
      }
    } catch (error) {
      console.warn('Could not check demo mode:', error);
    }

    if (!auth.currentUser && !userId) {
      return SUBSCRIPTION_TIERS.GUEST;
    }

    if (!this.isConfigured) {
      return auth.currentUser ? SUBSCRIPTION_TIERS.FREE : SUBSCRIPTION_TIERS.GUEST;
    }

    try {
      const uid = userId || auth.currentUser.uid;
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.isGuest) {
          return SUBSCRIPTION_TIERS.GUEST;
        }

        let tierId = userData.subscriptionTier || 'free';

        if (LEGACY_TIER_MAPPING[tierId]) {
          tierId = LEGACY_TIER_MAPPING[tierId];
        }

        const tier = Object.values(SUBSCRIPTION_TIERS).find(t => t.id === tierId);
        return tier || SUBSCRIPTION_TIERS.FREE;
      } else {
        return SUBSCRIPTION_TIERS.FREE;
      }
    } catch (error) {
      console.error('Error fetching user tier:', error);
      return SUBSCRIPTION_TIERS.FREE;
    }
  }

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

  async getRoomLimit(userId = null) {
    const tier = await this.getUserTier(userId);
    return tier.roomLimit;
  }

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

  getAllTiers() {
    return Object.values(SUBSCRIPTION_TIERS);
  }

  getTierById(tierId) {
    if (LEGACY_TIER_MAPPING[tierId]) {
      tierId = LEGACY_TIER_MAPPING[tierId];
    }
    return Object.values(SUBSCRIPTION_TIERS).find(t => t.id === tierId) || null;
  }

  isAuthenticated() {
    return !!auth.currentUser;
  }

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
      color: tier.color,
      canUpgrade: this.canUpgrade(tierKey)
    };
  }

  canUpgrade(tierKey) {
    const order = ['GUEST', 'FREE', 'PRO', 'ULTIMATE'];
    const idx = order.indexOf(tierKey);
    return idx >= 0 && idx < order.length - 1;
  }

  async canUseFeature(featureName, userId = null) {
    const tier = await this.getUserTier(userId);
    if (tier.featureFlags && tier.featureFlags[featureName] !== undefined) {
      return tier.featureFlags[featureName];
    }
    return canUseFeature(featureName, this.getTierKey(tier.id));
  }

  getTierKey(tierId) {
    if (LEGACY_TIER_MAPPING[tierId]) {
      tierId = LEGACY_TIER_MAPPING[tierId];
    }
    const mapping = {
      'guest': 'GUEST',
      'free': 'FREE',
      'dev_preview': 'DEV_PREVIEW',
      'pro': 'PRO',
      'ultimate': 'ULTIMATE'
    };
    return mapping[tierId] || 'FREE';
  }

  getDisplayTiers() {
    return TIER_ORDER.map(key => ({
      ...SUBSCRIPTION_TIERS[key],
      key
    }));
  }

  async canCreateCharacter(currentCharacterCount, userId = null) {
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

  async getCharacterLimit(userId = null) {
    const tier = await this.getUserTier(userId);
    return tier.characterLimit;
  }

  resolveTierId(rawTierId) {
    if (LEGACY_TIER_MAPPING[rawTierId]) {
      return LEGACY_TIER_MAPPING[rawTierId];
    }
    const tier = Object.values(SUBSCRIPTION_TIERS).find(t => t.id === rawTierId);
    if (tier) return rawTierId;
    return 'free';
  }
}

const subscriptionService = new SubscriptionService();

export default subscriptionService;
