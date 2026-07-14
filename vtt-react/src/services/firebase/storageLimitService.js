/**
 * Storage Limit Service
 *
 * Manages storage limits and usage monitoring for users.
 * Prevents abuse by enforcing data size limits based on subscription tiers.
 */

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

const LEGACY_TIER_MAP = {
  'subscriber': 'pro',
  'premium': 'ultimate'
};

export const STORAGE_LIMITS = {
  GUEST: {
    total: 0,
    maxItems: 0,
    maxSpells: 0,
    maxCreatures: 0
  },
  FREE: {
    total: 25 * 1024 * 1024,
    characters: 3,
    campaigns: 1,
    rooms: 1,
    maxItems: 100,
    maxSpells: 100,
    maxCreatures: 50
  },
  DEV_PREVIEW: {
    total: 5 * 1024 * 1024 * 1024,
    characters: -1,
    campaigns: 25,
    rooms: 25,
    maxItems: -1,
    maxSpells: -1,
    maxCreatures: -1
  },
  PRO: {
    total: 500 * 1024 * 1024,
    characters: 15,
    campaigns: 5,
    rooms: 5,
    maxItems: 500,
    maxSpells: 500,
    maxCreatures: 250
  },
  ULTIMATE: {
    total: 5 * 1024 * 1024 * 1024,
    characters: -1,
    campaigns: 25,
    rooms: 25,
    maxItems: -1,
    maxSpells: -1,
    maxCreatures: -1
  }
};

function resolveTierKey(rawTier) {
  if (!rawTier) return 'FREE';
  const normalized = rawTier.toLowerCase ? rawTier.toLowerCase() : rawTier;
  if (LEGACY_TIER_MAP[normalized]) return LEGACY_TIER_MAP[normalized].toUpperCase();
  const upper = normalized.toUpperCase();
  if (STORAGE_LIMITS[upper]) return upper;
  return 'FREE';
}

// Size limits for individual items (to prevent abuse)
export const ITEM_SIZE_LIMITS = {
  MAX_CHARACTER_SIZE: 1024 * 1024,
  MAX_ROOM_SIZE: 5 * 1024 * 1024,
  MAX_JOURNAL_SIZE: 10 * 1024 * 1024,
  MAX_CAMPAIGN_SIZE: 20 * 1024 * 1024,
  MAX_MESSAGE_SIZE: 10 * 1024,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  MAX_AUDIO_FILE_SIZE: 20 * 1024 * 1024
};

/**
 * Storage Limit Service
 */
class StorageLimitService {

  /**
   * Get user's current subscription tier and limits
   */
  async getUserTier(userId) {
    if (!userId) return { tier: 'GUEST', limits: STORAGE_LIMITS.GUEST };

    if (userId.startsWith('guest-')) {
      return { tier: 'GUEST', limits: STORAGE_LIMITS.GUEST };
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { tier: 'FREE', limits: STORAGE_LIMITS.FREE };
      }

      const userData = userSnap.data();
      const tierKey = resolveTierKey(userData.subscriptionTier || 'free');

      return {
        tier: tierKey,
        limits: STORAGE_LIMITS[tierKey] || STORAGE_LIMITS.FREE
      };
    } catch (error) {
      console.error('Error getting user tier:', error);
      return { tier: 'FREE', limits: STORAGE_LIMITS.FREE };
    }
  }

  /**
   * Get current storage usage for user
   */
  async getStorageUsage(userId) {
    if (!userId || userId.startsWith('guest-')) {
      return { total: 0, breakdown: {} };
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { total: 0, breakdown: {} };
      }

      const userData = userSnap.data();
      const usage = userData.storageUsage || {
        total: 0,
        characters: 0,
        rooms: 0,
        journals: 0,
        campaigns: 0,
        audioFiles: 0,
        lastUpdated: Date.now()
      };

      return usage;
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return { total: 0, breakdown: {} };
    }
  }

  /**
   * Check if user can store more data
   */
  async canStoreData(userId, dataSizeBytes, dataType = 'general') {
    const { limits } = await this.getUserTier(userId);
    if (limits.total === 0) return false; // Guest users

    const currentUsage = await this.getStorageUsage(userId);

    // Check total limit
    if ((currentUsage.total + dataSizeBytes) > limits.total) {
      return false;
    }

    // Check category-specific limits if applicable
    if (dataType && limits[dataType] !== undefined) {
      const categoryUsage = currentUsage[dataType] || 0;
      if (categoryUsage >= limits[dataType]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if data size exceeds item limits
   */
  validateItemSize(data, itemType) {
    const dataSize = new Blob([JSON.stringify(data)]).size;

    switch (itemType) {
      case 'character':
        if (dataSize > ITEM_SIZE_LIMITS.MAX_CHARACTER_SIZE) {
          throw new Error(`Character data too large: ${(dataSize / 1024 / 1024).toFixed(2)}MB (max: ${(ITEM_SIZE_LIMITS.MAX_CHARACTER_SIZE / 1024 / 1024).toFixed(2)}MB)`);
        }
        break;
      case 'room':
        if (dataSize > ITEM_SIZE_LIMITS.MAX_ROOM_SIZE) {
          throw new Error(`Room data too large: ${(dataSize / 1024 / 1024).toFixed(2)}MB (max: ${(ITEM_SIZE_LIMITS.MAX_ROOM_SIZE / 1024 / 1024).toFixed(2)}MB)`);
        }
        break;
      case 'journal':
        if (dataSize > ITEM_SIZE_LIMITS.MAX_JOURNAL_SIZE) {
          throw new Error(`Journal data too large: ${(dataSize / 1024 / 1024).toFixed(2)}MB (max: ${(ITEM_SIZE_LIMITS.MAX_JOURNAL_SIZE / 1024 / 1024).toFixed(2)}MB)`);
        }
        break;
      case 'campaign':
        if (dataSize > ITEM_SIZE_LIMITS.MAX_CAMPAIGN_SIZE) {
          throw new Error(`Campaign data too large: ${(dataSize / 1024 / 1024).toFixed(2)}MB (max: ${(ITEM_SIZE_LIMITS.MAX_CAMPAIGN_SIZE / 1024 / 1024).toFixed(2)}MB)`);
        }
        break;
      case 'message':
        if (dataSize > ITEM_SIZE_LIMITS.MAX_MESSAGE_SIZE) {
          throw new Error(`Message too large: ${(dataSize / 1024).toFixed(2)}KB (max: ${(ITEM_SIZE_LIMITS.MAX_MESSAGE_SIZE / 1024).toFixed(2)}KB)`);
        }
        break;
      case 'audio':
        if (dataSize > ITEM_SIZE_LIMITS.MAX_AUDIO_FILE_SIZE) {
          throw new Error(`Audio file too large: ${(dataSize / 1024 / 1024).toFixed(2)}MB (max: ${(ITEM_SIZE_LIMITS.MAX_AUDIO_FILE_SIZE / 1024 / 1024).toFixed(2)}MB)`);
        }
        break;
      default:
        break;
    }

    return dataSize;
  }

  /**
   * Update storage usage counters
   * Uses setDoc with merge to handle new users without existing documents
   */
  async updateStorageUsage(userId, dataType, sizeChange) {
    if (!userId || userId.startsWith('guest-')) return;

    try {
      const userRef = doc(db, 'users', userId);
      const currentUsage = await this.getStorageUsage(userId);

      const newUsage = {
        ...currentUsage,
        [dataType]: Math.max(0, (currentUsage[dataType] || 0) + sizeChange),
        total: Math.max(0, currentUsage.total + sizeChange),
        lastUpdated: Date.now()
      };

      // Use setDoc with merge to create document if it doesn't exist
      await setDoc(userRef, {
        storageUsage: newUsage,
        lastModified: serverTimestamp()
      }, { merge: true });

      return newUsage;
    } catch (error) {
      console.error('Error updating storage usage:', error);
      throw error;
    }
  }

  /**
   * Get storage usage summary for UI display
   */
  async getStorageSummary(userId) {
    const { tier, limits } = await this.getUserTier(userId);
    const usage = await this.getStorageUsage(userId);

    if (tier === 'GUEST') {
      return {
        tier: 'Guest',
        totalUsed: 0,
        totalLimit: 0,
        percentage: 0,
        breakdown: {},
        canUpgrade: true,
        message: 'Upgrade to save your progress!'
      };
    }

    const percentage = limits.total > 0 ? (usage.total / limits.total) * 100 : 0;

    let status = 'good';
    let message = 'Storage usage is healthy';

    if (percentage >= 90) {
      status = 'critical';
      message = 'Storage nearly full! Consider upgrading or cleaning up data.';
    } else if (percentage >= 75) {
      status = 'warning';
      message = 'Storage usage is high. Monitor your usage.';
    }

    return {
      tier: tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase(),
      totalUsed: usage.total,
      totalLimit: limits.total,
      percentage: Math.round(percentage),
      breakdown: {
        characters: usage.characters || 0,
        rooms: usage.rooms || 0,
        journals: usage.journals || 0,
        campaigns: usage.campaigns || 0,
        audioFiles: usage.audioFiles || 0
      },
      limits: {
        characters: limits.characters,
        rooms: limits.rooms,
        campaigns: limits.campaigns
      },
      status,
      message,
      canUpgrade: tier !== 'PREMIUM',
      lastUpdated: usage.lastUpdated
    };
  }

  /**
   * Estimate data size before saving
   */
  estimateDataSize(data) {
    return new Blob([JSON.stringify(data)]).size;
  }

  /**
   * Format bytes for display
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if user can store more documents of a specific collection
   */
  async canStoreDocument(userId, collectionName, limitKey) {
    if (!userId || userId.startsWith('guest-')) {
      return { allowed: false, count: 0, limit: 0 };
    }

    const { limits } = await this.getUserTier(userId);
    const limitVal = limits[limitKey] !== undefined ? limits[limitKey] : -1;

    // If unlimited, return allowed: true immediately
    if (limitVal === -1) {
      return { allowed: true, count: -1, limit: -1 };
    }

    try {
      const { getCountFromServer, collection, query, where } = await import('firebase/firestore');
      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId)
      );
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;

      if (count >= limitVal) {
        return { allowed: false, count, limit: limitVal };
      }
      return { allowed: true, count, limit: limitVal };
    } catch (error) {
      console.error('Error counting documents:', error);
      try {
        const { getDocs, collection, query, where } = await import('firebase/firestore');
        const q = query(
          collection(db, collectionName),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        const count = snapshot.size;
        if (count >= limitVal) {
          return { allowed: false, count, limit: limitVal };
        }
        return { allowed: true, count, limit: limitVal };
      } catch (fallbackError) {
        console.error('Fallback counting failed:', fallbackError);
        return { allowed: true, count: 0, limit: limitVal };
      }
    }
  }

  /**
   * Count user documents in a collection
   */
  async countUserDocuments(userId, collectionName) {
    if (!userId || userId.startsWith('guest-')) return 0;
    try {
      const { getCountFromServer, collection, query, where } = await import('firebase/firestore');
      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId)
      );
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error('Error counting documents:', error);
      try {
        const { getDocs, collection, query, where } = await import('firebase/firestore');
        const q = query(
          collection(db, collectionName),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.size;
      } catch (fallbackError) {
        return 0;
      }
    }
  }

  /**
   * Clean up old/unused data (future feature)
   */
  async cleanupOldData(userId, daysOld = 30) {
    // Future implementation: remove old backups, unused data, etc.
    console.log('Cleanup not yet implemented');
  }

  /**
   * Get storage recommendations
   */
  async getStorageRecommendations(userId) {
    const summary = await this.getStorageSummary(userId);

    const recommendations = [];

    if (summary.percentage >= 90) {
      recommendations.push({
        type: 'critical',
        message: 'Upgrade to a higher tier for more storage space',
        action: 'upgrade'
      });
    }

    if (summary.breakdown.characters > summary.limits.characters * 0.8) {
      recommendations.push({
        type: 'warning',
        message: 'Consider removing unused characters',
        action: 'cleanup-characters'
      });
    }

    if (summary.breakdown.rooms > summary.limits.rooms * 0.8) {
      recommendations.push({
        type: 'warning',
        message: 'Consider archiving old room sessions',
        action: 'cleanup-rooms'
      });
    }

    if (summary.breakdown.campaigns > summary.limits.campaigns * 0.8) {
      recommendations.push({
        type: 'warning',
        message: 'Consider removing completed campaigns',
        action: 'cleanup-campaigns'
      });
    }

    return recommendations;
  }
}

const storageLimitService = new StorageLimitService();
export default storageLimitService;
