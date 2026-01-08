// Campaign Service - Manages multiple campaigns with room and player state persistence
import { v4 as uuidv4 } from 'uuid';
import { validateCampaignName } from '../utils/validationUtils';

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
    if (!campaignId) {
      console.warn('Attempted to delete campaign with no ID');
      return;
    }
    // Convert to string for comparison to handle type mismatches
    const idStr = String(campaignId);
    this.campaigns = this.campaigns.filter(c => String(c.id) !== idStr);
    this.saveCampaigns();
  }

  /**
   * Set current campaign
   */
  setCurrentCampaign(campaignId) {
    // Always store as string to ensure consistency
    localStorage.setItem(CURRENT_CAMPAIGN_KEY, String(campaignId));
  }

  /**
   * Get current campaign ID
   */
  getCurrentCampaignId() {
    const id = localStorage.getItem(CURRENT_CAMPAIGN_KEY);
    // Ensure we return a string or null (never a number)
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
      // Ensure rooms array exists
      if (!campaign.rooms || !Array.isArray(campaign.rooms)) {
        campaign.rooms = [];
      }
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
      // Ensure rooms array exists
      if (!campaign.rooms || !Array.isArray(campaign.rooms)) {
        campaign.rooms = [];
      } else {
        campaign.rooms = campaign.rooms.filter(id => id !== roomId);
        campaign.lastModified = new Date().toISOString();
        this.saveCampaigns();
      }
    }
  }
}

// Create singleton instance
const campaignService = new CampaignService();

export default campaignService;

