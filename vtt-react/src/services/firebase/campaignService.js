/**
 * Campaign Persistence Service
 *
 * Handles persistence of GM campaign data:
 * - Campaign settings and metadata
 * - Player characters and progress
 * - Session planning and notes
 * - NPC details and relationships
 * - Location descriptions and maps
 * - Plot threads and story arcs
 * - Quest definitions and progress
 * - Homebrew content (custom items, monsters, spells)
 * - Selected library content
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';

/**
 * Campaign Persistence Service
 */
class CampaignService {

  /**
   * Save campaign data
   */
  async saveCampaign(userId, campaignId, campaignData) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);

      const firestoreData = {
        // Campaign metadata
        id: campaignId,
        name: campaignData.name || 'New Campaign',
        description: campaignData.description || '',

        // Campaign settings
        currentSession: campaignData.currentSession || 1,
        settings: campaignData.settings || {
          fogOfWarEnabled: true,
          dynamicFog: true,
          respectLineOfSight: true
        },

        // Player management
        players: campaignData.players || [],

        // Session planning
        sessions: campaignData.sessions || [],

        // World building
        npcs: campaignData.npcs || [],
        locations: campaignData.locations || [],
        plotThreads: campaignData.plotThreads || [],
        quests: campaignData.quests || [],

        // Homebrew content
        homebrew: campaignData.homebrew || {
          items: [],
          monsters: [],
          spells: [],
          lore: []
        },

        // Selected library content
        selectedCreatures: campaignData.selectedCreatures || [],
        selectedItems: campaignData.selectedItems || [],
        selectedSpells: campaignData.selectedSpells || [],

        // Metadata
        lastUpdated: serverTimestamp(),
        version: campaignData.version || 1
      };

      await setDoc(docRef, firestoreData, { merge: true });

      return {
        success: true,
        campaignId,
        size: new Blob([JSON.stringify(firestoreData)]).size
      };

    } catch (error) {
      console.error('Error saving campaign:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load campaign data
   */
  async loadCampaign(userId, campaignId) {
    if (!userId || !campaignId) {
      return null;
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      return {
        // Campaign metadata
        id: data.id,
        name: data.name || 'New Campaign',
        description: data.description || '',

        // Campaign settings
        currentSession: data.currentSession || 1,
        settings: data.settings || {
          fogOfWarEnabled: true,
          dynamicFog: true,
          respectLineOfSight: true
        },

        // Player management
        players: data.players || [],

        // Session planning
        sessions: data.sessions || [],

        // World building
        npcs: data.npcs || [],
        locations: data.locations || [],
        plotThreads: data.plotThreads || [],
        quests: data.quests || [],

        // Homebrew content
        homebrew: data.homebrew || {
          items: [],
          monsters: [],
          spells: [],
          lore: []
        },

        // Selected library content
        selectedCreatures: data.selectedCreatures || [],
        selectedItems: data.selectedItems || [],
        selectedSpells: data.selectedSpells || [],

        // Metadata
        lastUpdated: data.lastUpdated?.toDate?.() || new Date(data.lastUpdated),
        version: data.version || 1
      };

    } catch (error) {
      console.error('Error loading campaign:', error);
      return null;
    }
  }

  /**
   * Update campaign metadata (name, description, settings)
   */
  async updateCampaignMetadata(userId, campaignId, metadata) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);

      const updateData = {
        ...metadata,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return { success: true };

    } catch (error) {
      console.error('Error updating campaign metadata:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update players in campaign
   */
  async updateCampaignPlayers(userId, campaignId, players) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);

      await updateDoc(docRef, {
        players,
        lastUpdated: serverTimestamp()
      });

      return {
        success: true,
        size: new Blob([JSON.stringify(players)]).size
      };

    } catch (error) {
      console.error('Error updating campaign players:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update sessions in campaign
   */
  async updateCampaignSessions(userId, campaignId, sessions) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);

      await updateDoc(docRef, {
        sessions,
        lastUpdated: serverTimestamp()
      });

      return {
        success: true,
        size: new Blob([JSON.stringify(sessions)]).size
      };

    } catch (error) {
      console.error('Error updating campaign sessions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update NPCs in campaign
   */
  async updateCampaignNPCs(userId, campaignId, npcs) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);

      await updateDoc(docRef, {
        npcs,
        lastUpdated: serverTimestamp()
      });

      return {
        success: true,
        size: new Blob([JSON.stringify(npcs)]).size
      };

    } catch (error) {
      console.error('Error updating campaign NPCs:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update locations in campaign
   */
  async updateCampaignLocations(userId, campaignId, locations) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);

      await updateDoc(docRef, {
        locations,
        lastUpdated: serverTimestamp()
      });

      return {
        success: true,
        size: new Blob([JSON.stringify(locations)]).size
      };

    } catch (error) {
      console.error('Error updating campaign locations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update plot threads in campaign
   */
  async updateCampaignPlotThreads(userId, campaignId, plotThreads) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);

      await updateDoc(docRef, {
        plotThreads,
        lastUpdated: serverTimestamp()
      });

      return {
        success: true,
        size: new Blob([JSON.stringify(plotThreads)]).size
      };

    } catch (error) {
      console.error('Error updating campaign plot threads:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update quests in campaign
   */
  async updateCampaignQuests(userId, campaignId, quests) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);

      await updateDoc(docRef, {
        quests,
        lastUpdated: serverTimestamp()
      });

      return {
        success: true,
        size: new Blob([JSON.stringify(quests)]).size
      };

    } catch (error) {
      console.error('Error updating campaign quests:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update homebrew content in campaign
   */
  async updateCampaignHomebrew(userId, campaignId, homebrew) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);

      await updateDoc(docRef, {
        homebrew,
        lastUpdated: serverTimestamp()
      });

      return {
        success: true,
        size: new Blob([JSON.stringify(homebrew)]).size
      };

    } catch (error) {
      console.error('Error updating campaign homebrew:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update selected library content
   */
  async updateCampaignLibrarySelections(userId, campaignId, selections) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);

      const updateData = {
        selectedCreatures: selections.selectedCreatures || [],
        selectedItems: selections.selectedItems || [],
        selectedSpells: selections.selectedSpells || [],
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return {
        success: true,
        size: new Blob([JSON.stringify(selections)]).size
      };

    } catch (error) {
      console.error('Error updating campaign library selections:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add item to homebrew
   */
  async addHomebrewItem(userId, campaignId, item, category) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      // First get current campaign
      const currentCampaign = await this.loadCampaign(userId, campaignId);
      if (!currentCampaign) {
        throw new Error('Campaign not found');
      }

      // Add item to appropriate category
      const updatedHomebrew = { ...currentCampaign.homebrew };
      if (!updatedHomebrew[category]) {
        updatedHomebrew[category] = [];
      }
      updatedHomebrew[category].push(item);

      return await this.updateCampaignHomebrew(userId, campaignId, updatedHomebrew);

    } catch (error) {
      console.error('Error adding homebrew item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove item from homebrew
   */
  async removeHomebrewItem(userId, campaignId, itemId, category) {
    if (!userId || !campaignId) {
      throw new Error('User ID and Campaign ID are required');
    }

    try {
      // First get current campaign
      const currentCampaign = await this.loadCampaign(userId, campaignId);
      if (!currentCampaign) {
        throw new Error('Campaign not found');
      }

      // Remove item from category
      const updatedHomebrew = { ...currentCampaign.homebrew };
      if (updatedHomebrew[category]) {
        updatedHomebrew[category] = updatedHomebrew[category].filter(item => item.id !== itemId);
      }

      return await this.updateCampaignHomebrew(userId, campaignId, updatedHomebrew);

    } catch (error) {
      console.error('Error removing homebrew item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all campaigns for a user
   */
  async getAllCampaigns(userId) {
    if (!userId) return {};

    try {
      const collectionRef = collection(db, 'users', userId, 'campaigns');
      const querySnapshot = await getDocs(collectionRef);

      const campaigns = {};
      querySnapshot.forEach((doc) => {
        campaigns[doc.id] = doc.data();
      });

      return campaigns;

    } catch (error) {
      console.error('Error getting all campaigns:', error);
      return {};
    }
  }

  /**
   * Delete campaign data
   */
  async deleteCampaign(userId, campaignId) {
    if (!userId || !campaignId) return;

    try {
      const docRef = doc(db, 'users', userId, 'campaigns', campaignId);
      await deleteDoc(docRef);
      return { success: true };

    } catch (error) {
      console.error('Error deleting campaign:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete all campaign data for a user
   */
  async deleteAllCampaigns(userId) {
    if (!userId) return;

    try {
      const campaigns = await this.getAllCampaigns(userId);
      const batch = writeBatch(db);

      Object.keys(campaigns).forEach(campaignId => {
        const docRef = doc(db, 'users', userId, 'campaigns', campaignId);
        batch.delete(docRef);
      });

      await batch.commit();
      return { success: true };

    } catch (error) {
      console.error('Error deleting all campaigns:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a specific campaign's data from Firestore.
   * @param {string} userId - The ID of the GM who owns the campaign.
   * @param {string} campaignId - The ID of the campaign to delete.
   * @returns {Promise<boolean>} - True if successful, false otherwise.
   */
  async deleteCampaignData(userId, campaignId) {
    if (!db) {
      console.warn('Firestore not initialized, cannot delete campaign data.');
      return false;
    }
    if (!userId || !campaignId) {
      console.error('User ID and Campaign ID are required to delete campaign data.');
      return false;
    }

    try {
      const campaignRef = doc(db, COLLECTIONS.USER_CAMPAIGNS, userId, 'campaigns', campaignId);
      await deleteDoc(campaignRef);
      console.log(`✅ Campaign data deleted for ${campaignId} by user ${userId}.`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting campaign data for ${campaignId} by user ${userId}:`, error);
      return false;
    }
  }
}

const campaignService = new CampaignService();
export default campaignService;
