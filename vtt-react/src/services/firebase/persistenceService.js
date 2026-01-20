/**
 * Master Persistence Service
 *
 * Coordinates all Firebase persistence operations for Mythrill D&D app.
 * Manages storage limits, cross-service coordination, and data validation.
 */

import { db } from '../../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { sanitizeForFirestore } from '../../utils/firebaseUtils';

// Import individual persistence services
import characterStateService from './characterStateService';
import roomStateService from './roomStateService';
import journalService from './journalService';
import campaignService from './campaignService';
import storageLimitService from './storageLimitService';

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

/**
 * Master Persistence Service Class
 */
class PersistenceService {
  constructor() {
    this.services = {
      characterState: characterStateService,
      roomState: roomStateService,
      journal: journalService,
      campaign: campaignService,
      storageLimit: storageLimitService
    };
  }

  /**
   * Get user's current subscription tier and limits
   */
  async getUserTier(userId) {
    if (!userId) return { tier: 'GUEST', limits: STORAGE_LIMITS.GUEST };

    try {
      // Check for guest users or demo mode
      const { isDemoMode } = await import('../../config/firebase');
      if (isDemoMode || userId.startsWith('guest-')) {
        return { tier: 'FREE', limits: STORAGE_LIMITS.FREE };
      }

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
      // Suppress permissions errors or offline errors for guest/anonymous users
      if (error?.code !== 'permission-denied' && !error?.message?.includes('offline')) {
        console.error('Error getting user tier:', error);
      }
      return { tier: 'FREE', limits: STORAGE_LIMITS.FREE };
    }
  }

  /**
   * Check if user can store more data
   */
  async canStoreData(userId, dataSizeBytes, dataType = 'general') {
    const { limits } = await this.getUserTier(userId);
    if (limits.total === 0) return false; // Guest users

    const currentUsage = await this.getStorageUsage(userId);
    return (currentUsage.total + dataSizeBytes) <= limits.total;
  }

  /**
   * Get current storage usage for user
   */
  async getStorageUsage(userId) {
    if (!userId || userId.startsWith('guest-')) {
      return { total: 0, breakdown: {} };
    }

    try {
      // Check for demo mode
      const { isDemoMode } = await import('../../config/firebase');
      if (isDemoMode || !userId || userId.startsWith('guest-')) {
        return { total: 0, breakdown: {} };
      }

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
      // Suppress permissions errors or offline errors for guest/anonymous users
      if (error?.code !== 'permission-denied' && !error?.message?.includes('offline')) {
        console.error('Error getting storage usage:', error);
      }
      return { total: 0, breakdown: {} };
    }
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
      // Sanitize usage data
      const sanitizedUsage = sanitizeForFirestore({
        storageUsage: newUsage,
        lastModified: serverTimestamp()
      });

      await setDoc(userRef, sanitizedUsage, { merge: true });

      return newUsage;
    } catch (error) {
      console.error('Error updating storage usage:', error);
      throw error;
    }
  }

  /**
   * Validate data size before saving
   */
  async validateDataSize(userId, data, dataType) {
    const dataSize = new Blob([JSON.stringify(data)]).size;
    const canStore = await this.canStoreData(userId, dataSize, dataType);

    if (!canStore) {
      const { limits } = await this.getUserTier(userId);
      const currentUsage = await this.getStorageUsage(userId);

      throw new Error(
        `Storage limit exceeded. Current usage: ${(currentUsage.total / (1024 * 1024)).toFixed(2)}MB, ` +
        `Limit: ${(limits.total / (1024 * 1024)).toFixed(2)}MB. ` +
        `Please upgrade your subscription or free up space.`
      );
    }

    return dataSize;
  }

  // ===== CHARACTER STATE PERSISTENCE =====

  /**
   * Save character state (HP, mana, AP, inventory, equipment)
   */
  async saveCharacterState(userId, characterId, characterState) {
    const dataSize = await this.validateDataSize(userId, characterState, 'characters');
    const result = await this.services.characterState.saveCharacterState(userId, characterId, characterState);

    if (result.success) {
      await this.updateStorageUsage(userId, 'characters', dataSize);
    }

    return result;
  }

  /**
   * Load character state
   */
  async loadCharacterState(userId, characterId) {
    return await this.services.characterState.loadCharacterState(userId, characterId);
  }

  // ===== ROOM STATE PERSISTENCE =====

  /**
   * Save room state (tokens, grid items, environmental objects)
   */
  async saveRoomState(userId, roomId, roomState) {
    const dataSize = await this.validateDataSize(userId, roomState, 'rooms');
    const result = await this.services.roomState.saveRoomState(userId, roomId, roomState);

    if (result.success) {
      await this.updateStorageUsage(userId, 'rooms', dataSize);
    }

    return result;
  }

  /**
   * Load room state
   */
  async loadRoomState(userId, roomId) {
    return await this.services.roomState.loadRoomState(userId, roomId);
  }

  // ===== MAP/ENVIRONMENT PERSISTENCE =====

  /**
   * Save map data (terrain, walls, fog, lighting)
   */
  async saveMapData(userId, roomId, mapData) {
    const dataSize = await this.validateDataSize(userId, mapData, 'rooms');
    const result = await this.services.roomState.saveMapData(userId, roomId, mapData);

    if (result.success) {
      await this.updateStorageUsage(userId, 'rooms', dataSize);
    }

    return result;
  }

  /**
   * Load map data
   */
  async loadMapData(userId, roomId) {
    return await this.services.roomState.loadMapData(userId, roomId);
  }

  // ===== COMBAT STATE PERSISTENCE =====

  /**
   * Save combat state
   */
  async saveCombatState(userId, roomId, combatState) {
    const dataSize = await this.validateDataSize(userId, combatState, 'rooms');
    const result = await this.services.roomState.saveCombatState(userId, roomId, combatState);

    if (result.success) {
      await this.updateStorageUsage(userId, 'rooms', dataSize);
    }

    return result;
  }

  /**
   * Load combat state
   */
  async loadCombatState(userId, roomId) {
    return await this.services.roomState.loadCombatState(userId, roomId);
  }

  // ===== BUFFS/DEBUFFS PERSISTENCE =====

  /**
   * Save buffs and debuffs for a room
   */
  async saveBuffsAndDebuffs(userId, roomId, buffsData) {
    const dataSize = await this.validateDataSize(userId, buffsData, 'rooms');
    const result = await this.services.roomState.saveBuffsAndDebuffs(userId, roomId, buffsData);

    if (result.success) {
      await this.updateStorageUsage(userId, 'rooms', dataSize);
    }

    return result;
  }

  /**
   * Load buffs and debuffs for a room
   */
  async loadBuffsAndDebuffs(userId, roomId) {
    return await this.services.roomState.loadBuffsAndDebuffs(userId, roomId);
  }

  // ===== QUEST PROGRESS PERSISTENCE =====

  /**
   * Save quest progress for a character
   */
  async saveQuestProgress(userId, characterId, questData) {
    const dataSize = await this.validateDataSize(userId, questData, 'characters');
    const result = await this.services.characterState.saveQuestProgress(userId, characterId, questData);

    if (result.success) {
      await this.updateStorageUsage(userId, 'characters', dataSize);
    }

    return result;
  }

  /**
   * Load quest progress for a character
   */
  async loadQuestProgress(userId, characterId) {
    return await this.services.characterState.loadQuestProgress(userId, characterId);
  }

  // ===== CHAT HISTORY PERSISTENCE =====

  /**
   * Save chat history for a room
   */
  async saveChatHistory(userId, roomId, chatData) {
    const dataSize = await this.validateDataSize(userId, chatData, 'rooms');
    const result = await this.services.roomState.saveChatHistory(userId, roomId, chatData);

    if (result.success) {
      await this.updateStorageUsage(userId, 'rooms', dataSize);
    }

    return result;
  }

  /**
   * Load chat history for a room
   */
  async loadChatHistory(userId, roomId) {
    return await this.services.roomState.loadChatHistory(userId, roomId);
  }

  // ===== JOURNAL PERSISTENCE =====

  /**
   * Save user journal data
   */
  async saveJournal(userId, journalData) {
    const dataSize = await this.validateDataSize(userId, journalData, 'journals');
    const result = await this.services.journal.saveJournal(userId, journalData);

    if (result.success) {
      await this.updateStorageUsage(userId, 'journals', dataSize);
    }

    return result;
  }

  /**
   * Load user journal data
   */
  async loadJournal(userId) {
    return await this.services.journal.loadJournal(userId);
  }

  // ===== CAMPAIGN PERSISTENCE =====

  /**
   * Save campaign data
   */
  async saveCampaign(userId, campaignId, campaignData) {
    const dataSize = await this.validateDataSize(userId, campaignData, 'campaigns');
    const result = await this.services.campaign.saveCampaign(userId, campaignId, campaignData);

    if (result.success) {
      await this.updateStorageUsage(userId, 'campaigns', dataSize);
    }

    return result;
  }

  /**
   * Load campaign data
   */
  async loadCampaign(userId, campaignId) {
    return await this.services.campaign.loadCampaign(userId, campaignId);
  }

  // ===== UTILITY METHODS =====

  /**
   * Get all data for a user (for backup/export)
   */
  async getAllUserData(userId) {
    if (!userId || userId.startsWith('guest-')) {
      return null;
    }

    try {
      const [
        characterStates,
        roomStates,
        journal,
        campaigns
      ] = await Promise.all([
        this.services.characterState.getAllCharacterStates(userId),
        this.services.roomState.getAllRoomStates(userId),
        this.services.journal.loadJournal(userId),
        this.services.campaign.getAllCampaigns(userId)
      ]);

      return {
        characters: characterStates,
        rooms: roomStates,
        journal,
        campaigns,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('Error getting all user data:', error);
      throw error;
    }
  }

  /**
   * Delete all user data (for account deletion)
   */
  async deleteAllUserData(userId) {
    if (!userId || userId.startsWith('guest-')) return;

    try {
      await Promise.all([
        this.services.characterState.deleteAllCharacterData(userId),
        this.services.roomState.deleteAllRoomData(userId),
        this.services.journal.deleteJournal(userId),
        this.services.campaign.deleteAllCampaigns(userId)
      ]);

      // Reset storage usage - use setDoc with merge to handle missing documents
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        storageUsage: {
          total: 0,
          characters: 0,
          rooms: 0,
          journals: 0,
          campaigns: 0,
          lastUpdated: Date.now()
        },
        lastModified: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error deleting all user data:', error);
      throw error;
    }
  }

  /**
   * Delete a campaign from Firebase
   */
  async deleteCampaign(userId, campaignId) {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const campaignRef = doc(db, 'userCampaigns', userId, 'campaigns', campaignId);
      await deleteDoc(campaignRef);

      console.log(`✅ Campaign ${campaignId} deleted from Firebase for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      return false;
    }
  }

  /**
   * Migrate data from localStorage to Firebase (for existing users)
   */
  async migrateLocalData(userId) {
    // This will be implemented to migrate existing localStorage data
    // to Firebase when users upgrade from guest/free to paid tiers
    console.log('Migration not yet implemented');
  }
}

// Create singleton instance
const persistenceService = new PersistenceService();

export default persistenceService;
