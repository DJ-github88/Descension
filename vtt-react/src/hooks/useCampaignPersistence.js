/**
 * Campaign Persistence Hook
 *
 * Automatically saves and loads GM campaign data to/from Firebase.
 * Handles sessions, NPCs, locations, quests, homebrew, etc.
 * Integrates with the CampaignManager component.
 */

import { useEffect, useCallback, useRef } from 'react';
import useAuthStore from '../store/authStore';
import persistenceService from '../services/firebase/persistenceService';
import campaignService from '../services/campaignService';

export const useCampaignPersistence = (campaignId) => {
  const { user } = useAuthStore();

  // Auto-save timer refs
  const campaignTimerRef = useRef(null);
  const lastSavedStateRef = useRef(null);

  // Debounced auto-save delay (3 seconds for campaign data)
  const AUTO_SAVE_DELAY = 3000;

  /**
   * Collect current campaign state for persistence
   */
  const collectCampaignState = useCallback(() => {
    if (!campaignId) {
      return null;
    }

    // Get campaign data from localStorage service (fallback for guests)
    const campaign = campaignService.getCampaign(campaignId);
    if (!campaign) {
      return null;
    }

    // Extract campaignData from the campaign object
    const campaignData = campaign.campaignData || {
      name: campaign.name || 'New Campaign',
      description: campaign.description || '',
      currentSession: 1,
      players: [],
      sessions: [],
      npcs: [],
      locations: [],
      plotThreads: [],
      quests: [],
      homebrew: { items: [], monsters: [], spells: [], lore: [] },
      selectedCreatures: [],
      selectedItems: [],
      selectedSpells: []
    };

    return campaignData;
  }, [campaignId]);

  /**
   * Save campaign data to Firebase (for authenticated users)
   */
  const saveCampaign = useCallback(async (campaignData = null) => {
    if (!user || user.isGuest || !campaignId) {
      return { success: false, reason: 'No authenticated user or campaign' };
    }

    const dataToSave = campaignData || collectCampaignState();
    if (!dataToSave) {
      return { success: false, reason: 'No data to save' };
    }

    try {
      const result = await persistenceService.saveCampaign(user.uid, campaignId, dataToSave);

      if (result.success) {
        lastSavedStateRef.current = JSON.stringify(dataToSave);
        console.log(`💾 Campaign saved to Firebase: ${campaignId}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to save campaign:', error);
      return { success: false, error: error.message };
    }
  }, [user, campaignId, collectCampaignState]);

  /**
   * Load campaign data from Firebase (for authenticated users)
   */
  const loadCampaign = useCallback(async () => {
    if (!user || user.isGuest || !campaignId) {
      return { success: false, reason: 'No authenticated user or campaign' };
    }

    try {
      const result = await persistenceService.loadCampaign(user.uid, campaignId);

      if (result) {
        // Update the localStorage campaign with Firebase data
        const existingCampaign = campaignService.getCampaign(campaignId);
        if (existingCampaign) {
          campaignService.updateCampaign(campaignId, {
            campaignData: result
          });
        }

        lastSavedStateRef.current = JSON.stringify(result);
        console.log(`📂 Campaign loaded from Firebase: ${campaignId}`);
        return { success: true, data: result };
      } else {
        console.log(`📂 No saved campaign found in Firebase: ${campaignId}, using localStorage`);
        return { success: false, reason: 'No saved data found' };
      }
    } catch (error) {
      console.error('Failed to load campaign:', error);
      return { success: false, error: error.message };
    }
  }, [user, campaignId]);

  /**
   * Auto-save campaign when it changes
   */
  const scheduleAutoSave = useCallback(() => {
    // Clear existing timer
    if (campaignTimerRef.current) {
      clearTimeout(campaignTimerRef.current);
    }

    // Set new auto-save timer
    campaignTimerRef.current = setTimeout(async () => {
      const currentState = collectCampaignState();
      if (currentState) {
        const currentStateStr = JSON.stringify(currentState);

        // Only save if state has actually changed
        if (currentStateStr !== lastSavedStateRef.current) {
          await saveCampaign(currentState);
        }
      }
    }, AUTO_SAVE_DELAY);
  }, [collectCampaignState, saveCampaign]);

  /**
   * Force immediate save
   */
  const forceSave = useCallback(async () => {
    if (campaignTimerRef.current) {
      clearTimeout(campaignTimerRef.current);
      campaignTimerRef.current = null;
    }

    return await saveCampaign();
  }, [saveCampaign]);

  // Load campaign when user becomes authenticated and campaign changes
  useEffect(() => {
    if (user && !user.isGuest && campaignId) {
      loadCampaign();
    }
  }, [user, campaignId, loadCampaign]);

  // Auto-save when campaign state changes (simplified - would need more specific watchers)
  useEffect(() => {
    if (user && !user.isGuest && campaignId) {
      scheduleAutoSave();
    }

    // Cleanup timer on unmount
    return () => {
      if (campaignTimerRef.current) {
        clearTimeout(campaignTimerRef.current);
      }
    };
  }, [scheduleAutoSave, user, campaignId]);

  /**
   * Delete campaign from Firebase
   */
  const deleteCampaign = useCallback(async (campaignIdToDelete) => {
    if (!user || user.isGuest) {
      return { success: false, reason: 'No authenticated user' };
    }

    if (!campaignIdToDelete) {
      return { success: false, reason: 'No campaign ID provided' };
    }

    try {
      const result = await persistenceService.deleteCampaign(user.uid, campaignIdToDelete);
      if (result) {
        console.log(`✅ Campaign deleted from Firebase: ${campaignIdToDelete}`);
        return { success: true };
      } else {
        return { success: false, reason: 'Delete operation failed' };
      }
    } catch (error) {
      console.error('Failed to delete campaign from Firebase:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  return {
    // State
    isGuestUser: user?.isGuest || false,
    isAuthenticated: !!user && !user.isGuest,

    // Actions
    saveCampaign,
    loadCampaign,
    forceSave,
    deleteCampaign,

    // Utilities
    collectCampaignState
  };
};
