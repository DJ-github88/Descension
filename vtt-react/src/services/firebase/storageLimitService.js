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

// Storage limits by subscription tier (in bytes)
export const STORAGE_LIMITS = {
  GUEST: { total: 0 }, // No persistence
  FREE: {
    total: 50 * 1024 * 1024, // 50MB
    characters: 50,
    campaigns: 1,
    rooms: 1
  },
  SUBSCRIBER: {
    total: 500 * 1024 * 1024, // 500MB
    characters: 6,
    campaigns: 5,
    rooms: 5
  },
  PREMIUM: {
    total: 2 * 1024 * 1024 * 1024, // 2GB
    characters: 24,
    campaigns: 20,
    rooms: 20
  }
};

// Size limits for individual items (to prevent abuse)
export const ITEM_SIZE_LIMITS = {
  MAX_CHARACTER_SIZE: 1024 * 1024, // 1MB per character
  MAX_ROOM_SIZE: 5 * 1024 * 1024, // 5MB per room
  MAX_JOURNAL_SIZE: 10 * 1024 * 1024, // 10MB per journal
  MAX_CAMPAIGN_SIZE: 20 * 1024 * 1024, // 20MB per campaign
  MAX_MESSAGE_SIZE: 10 * 1024, // 10KB per chat message
  MAX_IMAGE_SIZE: 5 * 1024 * 1024 // 5MB per image
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

    // Check for guest users (they have no persistence)
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
      const tier = userData.subscriptionTier || 'free';
      const tierKey = tier.toUpperCase();

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
        campaigns: usage.campaigns || 0
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
