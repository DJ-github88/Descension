/**
 * Campaign Persistence Hook
 *
 * Campaigns have ONE persistence path: `campaignService` (a localStorage-backed
 * singleton that syncs a single cloud document at
 * `users/{uid}/worldbuilding/campaigns`). This hook exposes save/load/delete/
 * forceSave for the CampaignManager and delegates to that path.
 *
 * The legacy per-campaign Firestore documents at `users/{uid}/campaigns/{id}`
 * (firebase/campaignService.js + persistenceService.saveCampaign/loadCampaign/
 * deleteCampaign) are no longer written from here.
 */
import { useEffect, useCallback, useRef } from 'react';
import campaignService from '../services/campaignService';

const isMockUser = (user) =>
  !user ||
  user.isGuest ||
  user.uid === 'admin-dev-user' ||
  user.uid === 'dev-user-123' ||
  (typeof user.uid === 'string' && user.uid.startsWith('guest-'));

export const useCampaignPersistence = (campaignId) => {
  const useAuthStore = require('../store/authStore').default;
  const { user } = useAuthStore();

  const campaignTimerRef = useRef(null);
  const lastSavedStateRef = useRef(null);

  const AUTO_SAVE_DELAY = 3000;

  /**
   * Collect current campaign state (from the localStorage service).
   */
  const collectCampaignState = useCallback(() => {
    if (!campaignId) {
      return null;
    }

    const campaign = campaignService.getCampaign(campaignId);
    if (!campaign) {
      return null;
    }

    return campaign.campaignData || {
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
  }, [campaignId]);

  /**
   * Persist all campaigns to the single cloud document.
   */
  const saveCampaign = useCallback(async () => {
    if (isMockUser(user)) {
      return { success: true, localOnly: true };
    }

    try {
      const ok = await campaignService.syncToCloud(user.uid);
      if (ok) {
        lastSavedStateRef.current = JSON.stringify(collectCampaignState());
        console.log(`💾 Campaigns synced to Firebase (${campaignId || 'all'})`);
      }
      return { success: !!ok, localOnly: false };
    } catch (error) {
      console.debug('Campaign cloud save skipped/failed:', error?.message || error);
      return { success: false, error: error.message };
    }
  }, [user, campaignId, collectCampaignState]);

  /**
   * Load campaigns from the cloud. Only hydrates when the campaign is not
   * already present locally, so an in-session edit is never clobbered on mount.
   */
  const loadCampaign = useCallback(async () => {
    if (isMockUser(user) || !campaignId) {
      return { success: false, reason: 'Local storage used' };
    }

    try {
      if (!campaignService.getCampaign(campaignId)) {
        await campaignService.hydrateFromCloud(user.uid);
      }

      const campaign = campaignService.getCampaign(campaignId);
      if (campaign) {
        const data = campaign.campaignData || campaign;
        lastSavedStateRef.current = JSON.stringify(data);
        return { success: true, data };
      }
      return { success: false, reason: 'No saved data found' };
    } catch (error) {
      console.debug('Campaign cloud load failed:', error?.message || error);
      return { success: false, error: error.message };
    }
  }, [user, campaignId]);

  const scheduleAutoSave = useCallback(() => {
    if (campaignTimerRef.current) {
      clearTimeout(campaignTimerRef.current);
    }

    campaignTimerRef.current = setTimeout(async () => {
      const currentState = collectCampaignState();
      if (currentState && JSON.stringify(currentState) !== lastSavedStateRef.current) {
        await saveCampaign();
      }
    }, AUTO_SAVE_DELAY);
  }, [collectCampaignState, saveCampaign]);

  const forceSave = useCallback(async () => {
    if (campaignTimerRef.current) {
      clearTimeout(campaignTimerRef.current);
      campaignTimerRef.current = null;
    }

    return await saveCampaign();
  }, [saveCampaign]);

  useEffect(() => {
    if (user && !user.isGuest && campaignId) {
      loadCampaign();
    }
  }, [user, campaignId, loadCampaign]);

  useEffect(() => {
    if (user && !user.isGuest && campaignId) {
      scheduleAutoSave();
    }

    return () => {
      if (campaignTimerRef.current) {
        clearTimeout(campaignTimerRef.current);
      }
    };
  }, [scheduleAutoSave, user, campaignId]);

  // Safety-net poll. campaignService autosyncs on mutation (triggerAutoSync),
  // but this covers edits that bypass it.
  useEffect(() => {
    if (isMockUser(user) || !campaignId) {
      return;
    }

    const interval = setInterval(() => {
      const currentState = collectCampaignState();
      if (currentState && JSON.stringify(currentState) !== lastSavedStateRef.current) {
        saveCampaign();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [user, campaignId, collectCampaignState, saveCampaign]);

  /**
   * Delete a campaign (local cache + the single cloud document).
   */
  const deleteCampaign = useCallback(async (campaignIdToDelete) => {
    if (isMockUser(user) || !campaignIdToDelete) {
      return { success: true, localOnly: true };
    }

    try {
      campaignService.deleteCampaign(campaignIdToDelete);
      await campaignService.syncToCloud(user.uid);
      console.log(`✅ Campaign deleted: ${campaignIdToDelete}`);
      return { success: true };
    } catch (error) {
      console.debug('Campaign cloud delete failed:', error?.message || error);
      return { success: false, error: error.message };
    }
  }, [user]);

  return {
    isGuestUser: user?.isGuest || false,
    isAuthenticated: !!user && !user.isGuest,

    saveCampaign,
    loadCampaign,
    forceSave,
    deleteCampaign,

    collectCampaignState
  };
};

export default useCampaignPersistence;
