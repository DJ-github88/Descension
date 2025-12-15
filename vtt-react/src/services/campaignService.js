// Campaign Service - Manages multiple campaigns with room and player state persistence
import { v4 as uuidv4 } from 'uuid';

const CAMPAIGNS_KEY = 'mythrill-campaigns';
const CURRENT_CAMPAIGN_KEY = 'mythrill-current-campaign-id';

/**
 * Campaign Service for managing multiple campaigns
 * Each campaign can have multiple rooms, and each room maintains its own state
 * Each player maintains per-room state within each campaign
 */
class CampaignService {
  constructor() {
    this.campaigns = this.loadCampaigns();
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
   * Create a new campaign
   */
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
    const campaignId = `campaign_${uuidv4()}`;
    const name = campaignData.name || 'New Campaign';
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
    return this.campaigns.find(c => c.id === campaignId);
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
    
    const campaignIndex = this.campaigns.findIndex(c => c.id === campaignId);
    if (campaignIndex !== -1) {
      this.campaigns[campaignIndex] = {
        ...this.campaigns[campaignIndex],
        ...updates,
        lastModified: new Date().toISOString()
      };
      this.saveCampaigns();
      return this.campaigns[campaignIndex];
    }
    
    console.warn(`Campaign not found: ${campaignId}. Available campaigns:`, this.campaigns.map(c => c.id));
    // Don't throw error, just return null to prevent crashes
    return null;
  }

  /**
   * Delete a campaign
   */
  deleteCampaign(campaignId) {
    this.campaigns = this.campaigns.filter(c => c.id !== campaignId);
    this.saveCampaigns();
  }

  /**
   * Set current campaign
   */
  setCurrentCampaign(campaignId) {
    localStorage.setItem(CURRENT_CAMPAIGN_KEY, campaignId);
  }

  /**
   * Get current campaign ID
   */
  getCurrentCampaignId() {
    return localStorage.getItem(CURRENT_CAMPAIGN_KEY);
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
      if (!campaign.rooms.includes(roomId)) {
        campaign.rooms.push(roomId);
        campaign.lastModified = new Date().toISOString();
        this.saveCampaigns();
      }
    }
  }

  /**
   * Remove a room from a campaign
   */
  removeRoomFromCampaign(campaignId, roomId) {
    const campaign = this.getCampaign(campaignId);
    if (campaign) {
      campaign.rooms = campaign.rooms.filter(id => id !== roomId);
      campaign.lastModified = new Date().toISOString();
      this.saveCampaigns();
    }
  }
}

// Create singleton instance
const campaignService = new CampaignService();

export default campaignService;

