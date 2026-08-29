// Campaign Service - Manages multiple campaigns with room and player state persistence
import { v4 as uuidv4 } from 'uuid';
import { validateCampaignName } from '../utils/validationUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../config/firebase';

const CAMPAIGNS_KEY = 'mythrill-campaigns';
const CURRENT_CAMPAIGN_KEY = 'mythrill-current-campaign-id';

/**
 * Campaign Service for managing multiple campaigns
 * Supports fast local storage caching, auto-migration, and Firestore cloud synchronization
 */
class CampaignService {
  constructor() {
    this.campaigns = this.loadCampaigns();
    this.lastCloudSyncAt = null;
  }

  /**
   * Load all campaigns from localStorage
   */
  loadCampaigns() {
    try {
      const stored = localStorage.getItem(CAMPAIGNS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading campaigns:', error);
      return [];
    }
  }

  /**
   * Save campaigns to localStorage
   */
  saveCampaigns() {
    try {
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(this.campaigns));
    } catch (error) {
      console.error('Error saving campaigns:', error);
    }
  }

  /**
   * Get default campaign data structure
   */
  getDefaultCampaignData(name = 'New Campaign', description = '') {
    return {
      name,
      description,
      currentSession: 1,
      players: [],
      sessions: [],
      npcs: [],
      locations: [],
      plotThreads: [],
      quests: [],
      homebrew: {
        items: [],
        monsters: [],
        spells: [],
        lore: []
      },
      selectedCreatures: [],
      selectedItems: [],
      selectedSpells: []
    };
  }

  /**
   * Create a new campaign
   */
  createCampaign(campaignData) {
    // Validate campaign name
    const nameValidation = validateCampaignName(campaignData.name || 'New Campaign');
    if (!nameValidation.isValid) {
      throw new Error(`Invalid campaign name: ${nameValidation.errors.join(', ')}`);
    }

    const campaignId = `campaign_${uuidv4()}`;
    const name = nameValidation.sanitized;
    const description = campaignData.description || '';
    
    const campaign = {
      id: campaignId,
      name,
      description,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      rooms: [], // Array of room IDs associated with this campaign
      settings: {
        fogOfWarEnabled: true,
        dynamicFog: true,
        respectLineOfSight: true
      },
      // Campaign-specific data (synced with CampaignManager)
      campaignData: this.getDefaultCampaignData(name, description)
    };

    this.campaigns.push(campaign);
    this.saveCampaigns();
    this.triggerAutoSync();
    return campaign;
  }

  /**
   * Get all campaigns
   */
  getCampaigns() {
    return this.campaigns;
  }

  /**
   * Get a specific campaign
   */
  getCampaign(campaignId) {
    if (!campaignId) return null;
    // Convert to string for comparison to handle type mismatches
    const idStr = String(campaignId);
    return this.campaigns.find(c => String(c.id) === idStr);
  }

  /**
   * Update campaign data
   */
  updateCampaign(campaignId, updates) {
    if (!campaignId) {
      console.warn('Attempted to update campaign with no ID');
      return null;
    }
    
    // Reload campaigns to ensure we have the latest data
    this.campaigns = this.loadCampaigns();
    
    // Convert to string for comparison to handle type mismatches
    const idStr = String(campaignId);
    const campaignIndex = this.campaigns.findIndex(c => String(c.id) === idStr);
    if (campaignIndex !== -1) {
      this.campaigns[campaignIndex] = {
        ...this.campaigns[campaignIndex],
        ...updates,
        lastModified: new Date().toISOString()
      };
      this.saveCampaigns();
      this.triggerAutoSync();
      return this.campaigns[campaignIndex];
    }
    
    console.warn(`Campaign not found: ${campaignId}. Available campaigns:`, this.campaigns.map(c => c.id));
    return null;
  }

  /**
   * Delete a campaign
   */
  deleteCampaign(campaignId) {
    if (!campaignId) {
      console.warn('Attempted to delete campaign with no ID');
      return;
    }
    const idStr = String(campaignId);
    this.campaigns = this.campaigns.filter(c => String(c.id) !== idStr);
    this.saveCampaigns();
    this.triggerAutoSync();
  }

  /**
   * Set current campaign
   */
  setCurrentCampaign(campaignId) {
    localStorage.setItem(CURRENT_CAMPAIGN_KEY, String(campaignId));
  }

  /**
   * Get current campaign ID
   */
  getCurrentCampaignId() {
    const id = localStorage.getItem(CURRENT_CAMPAIGN_KEY);
    return id ? String(id) : null;
  }

  /**
   * Get current campaign
   */
  getCurrentCampaign() {
    const campaignId = this.getCurrentCampaignId();
    return campaignId ? this.getCampaign(campaignId) : null;
  }

  /**
   * Associate a room with a campaign
   */
  addRoomToCampaign(campaignId, roomId) {
    const campaign = this.getCampaign(campaignId);
    if (campaign) {
      if (!campaign.rooms || !Array.isArray(campaign.rooms)) {
        campaign.rooms = [];
      }
      if (!campaign.rooms.includes(roomId)) {
        campaign.rooms.push(roomId);
        campaign.lastModified = new Date().toISOString();
        this.saveCampaigns();
        this.triggerAutoSync();
      }
    }
  }

  /**
   * Remove a room from a campaign
   */
  removeRoomFromCampaign(campaignId, roomId) {
    const campaign = this.getCampaign(campaignId);
    if (campaign) {
      if (!campaign.rooms || !Array.isArray(campaign.rooms)) {
        campaign.rooms = [];
      } else {
        campaign.rooms = campaign.rooms.filter(id => id !== roomId);
        campaign.lastModified = new Date().toISOString();
        this.saveCampaigns();
        this.triggerAutoSync();
      }
    }
  }

  // --- Cloud Synchronization & Hydration ---

  triggerAutoSync() {
    const currentUid = auth?.currentUser?.uid;
    if (currentUid && currentUid !== 'admin-dev-user' && currentUid !== 'dev-user-123' && !currentUid.startsWith('guest-')) {
      if (this.syncTimeout) clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
        this.syncToCloud(currentUid);
      }, 1200);
    }
  }

  async syncToCloud(userId) {
    if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
    try {
      const docRef = doc(db, 'users', userId, 'worldbuilding', 'campaigns');
      await setDoc(docRef, {
        campaigns: this.campaigns,
        currentCampaignId: this.getCurrentCampaignId(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      this.lastCloudSyncAt = new Date().toISOString();
      return true;
    } catch (err) {
      console.debug('Campaigns cloud sync skipped/failed:', err?.message || err);
      return false;
    }
  }

  async hydrateFromCloud(userId) {
    if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
    try {
      const docRef = doc(db, 'users', userId, 'worldbuilding', 'campaigns');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data?.campaigns) && data.campaigns.length > 0) {
          this.campaigns = data.campaigns;
          this.saveCampaigns();
          if (data.currentCampaignId) {
            this.setCurrentCampaign(data.currentCampaignId);
          }
          return true;
        } else if (this.campaigns.length > 0) {
          // Cloud doc exists but empty: auto-upload existing local campaigns to cloud
          await this.syncToCloud(userId);
          return true;
        }
      } else if (this.campaigns.length > 0) {
        // Initial cloud migration for existing local campaigns
        await this.syncToCloud(userId);
        return true;
      }
    } catch (err) {
      console.debug('Campaigns cloud hydration skipped/failed:', err?.message || err);
    }
    return false;
  }
}

// Create singleton instance
const campaignService = new CampaignService();

export default campaignService;

