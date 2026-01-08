// Campaign Manager component for Account Dashboard
// Syncs with in-game CampaignManagerWindow using campaign service
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './styles/CampaignManager.css';
import LibraryBrowserModal, { LIBRARY_TYPES } from './LibraryBrowserModal';
import ItemTooltip from '../item-generation/ItemTooltip';
import SimpleCreatureTooltip from '../creature-wizard/components/common/SimpleCreatureTooltip';
import SpellTooltip from '../spellcrafting-wizard/components/common/SpellTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import useCreatureStore from '../../store/creatureStore';
import campaignService from '../../services/campaignService';
import { useCampaignPersistence } from '../../hooks/useCampaignPersistence';

// Access control configuration - can be modified to restrict access by subscription tier
export const CAMPAIGN_ACCESS_CONFIG = {
  allowedTiers: ['GUEST', 'FREE', 'SUBSCRIBER', 'PREMIUM'], // All tiers for now
  featureName: 'Campaign Manager'
};

export const canAccessCampaignManager = (subscriptionTier) => {
  if (!subscriptionTier) return true;
  const tierName = typeof subscriptionTier === 'object' ? subscriptionTier.id?.toUpperCase() : subscriptionTier?.toUpperCase();
  return CAMPAIGN_ACCESS_CONFIG.allowedTiers.includes(tierName);
};

// Simple Input Modal Component - Uses Portal to render at document root for proper z-index
const InputModal = ({ isOpen, title, placeholder, onConfirm, onCancel }) => {
  const [value, setValue] = useState('');
  
  useEffect(() => {
    if (isOpen) setValue('');
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
      setValue('');
    }
  };
  
  return ReactDOM.createPortal(
    <div className="campaign-modal-overlay" onClick={onCancel}>
      <div className="campaign-modal-content input-modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
          <div className="campaign-modal-actions">
            <button type="button" className="campaign-modal-btn cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="campaign-modal-btn confirm">Add</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// Simple Confirm Modal Component - Uses Portal to render at document root for proper z-index
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    <div className="campaign-modal-overlay" onClick={onCancel}>
      <div className="campaign-modal-content confirm-modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="campaign-modal-actions">
          <button className="campaign-modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="campaign-modal-btn confirm danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const CampaignManager = ({ user }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [homebrewSubTab, setHomebrewSubTab] = useState('items');
  
  // Modal state
  const [inputModal, setInputModal] = useState({ isOpen: false, title: '', placeholder: '', callback: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', callback: null });
  
  // Library browser state
  const [libraryBrowser, setLibraryBrowser] = useState({ 
    isOpen: false, 
    libraryType: LIBRARY_TYPES.CREATURES, 
    title: '',
    onSelect: null 
  });

  // Tooltip state
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredCreature, setHoveredCreature] = useState(null);
  const [hoveredSpell, setHoveredSpell] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipDelayRef = useRef(null);
  const tooltipRef = useRef(null);

  // Helper function to format text (capitalize first letter, lowercase rest)
  const formatTag = (text) => {
    if (!text || typeof text !== 'string') return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Tooltip handlers
  const handleMouseEnter = (e, item = null, creature = null, spell = null) => {
    if (tooltipDelayRef.current) {
      clearTimeout(tooltipDelayRef.current);
    }
    tooltipDelayRef.current = setTimeout(() => {
      setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 });
      if (item) setHoveredItem(item);
      if (creature) {
        // If creature is missing stats, try to fetch full data from store
        let fullCreature = creature;
        if (!creature.stats && creature.libraryId) {
          const creatureStore = useCreatureStore.getState();
          const fullData = creatureStore.getCreature(creature.libraryId);
          if (fullData) {
            // Merge stored data with campaign-specific data (like notes)
            fullCreature = {
              ...fullData,
              id: creature.id, // Keep campaign-specific ID
              notes: creature.notes || fullData.notes,
              isFromLibrary: true
            };
          }
        }
        setHoveredCreature(fullCreature);
      }
      if (spell) setHoveredSpell(spell);
    }, 150);
  };

  const handleMouseMove = (e) => {
    if (hoveredItem || hoveredCreature || hoveredSpell) {
      setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 });
    }
  };

  const handleMouseLeave = () => {
    if (tooltipDelayRef.current) {
      clearTimeout(tooltipDelayRef.current);
    }
    setHoveredItem(null);
    setHoveredCreature(null);
    setHoveredSpell(null);
  };

  // Prevent background scrolling when creature tooltip is visible and enable tooltip scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      if (hoveredCreature) {
        // Check if mouse is over the tooltip
        const tooltipElement = document.querySelector('.campaign-creature-tooltip-portal');
        if (tooltipElement && tooltipElement.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();

          // Find the scrollable tooltip content and scroll it directly
          const scrollableContent = document.querySelector('.campaign-creature-tooltip-portal .creature-tooltip-scrollable');
          if (scrollableContent) {
            scrollableContent.scrollTop += e.deltaY;
          }
        } else {
          // If hovering over campaign manager content, also scroll tooltip
          e.preventDefault();
          e.stopPropagation();
          const scrollableContent = document.querySelector('.campaign-creature-tooltip-portal .creature-tooltip-scrollable');
          if (scrollableContent) {
            scrollableContent.scrollTop += e.deltaY;
          }
        }
      }
    };

    if (hoveredCreature) {
      document.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [hoveredCreature]);
  
  // Campaign management state
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaignId, setCurrentCampaignId] = useState(null);
  const [campaignData, setCampaignData] = useState({
    name: 'New Campaign',
    description: '',
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
    // Selected items from libraries (linked, not homebrew)
    selectedCreatures: [],
    selectedItems: [],
    selectedSpells: []
  });

  // Track if initial load is complete
  const [isInitialized, setIsInitialized] = useState(false);

  // Campaign persistence hook for Firebase sync
  const { isAuthenticated, forceSave, deleteCampaign } = useCampaignPersistence(currentCampaignId);

  // Load campaigns and current campaign
  useEffect(() => {
    const loadedCampaigns = campaignService.getCampaigns();
    
    // Get current campaign or create default
    let currentId = campaignService.getCurrentCampaignId();
    let finalCampaigns = loadedCampaigns;
    
    if (!currentId && loadedCampaigns.length > 0) {
      currentId = loadedCampaigns[0].id;
      campaignService.setCurrentCampaign(currentId);
    } else if (!currentId || loadedCampaigns.length === 0) {
      // Create default campaign if none exist or no valid current ID
      const defaultCampaign = campaignService.createCampaign({ name: 'New Campaign' });
      currentId = defaultCampaign.id;
      campaignService.setCurrentCampaign(currentId);
      finalCampaigns = campaignService.getCampaigns();
    }
    
    setCampaigns(finalCampaigns);
    setCurrentCampaignId(currentId);
    
    // Load current campaign data with defaults
    if (currentId) {
      const campaign = campaignService.getCampaign(currentId);
      const defaultData = {
        name: campaign?.name || 'New Campaign',
        description: campaign?.description || '',
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
      setCampaignData(campaign?.campaignData ? { ...defaultData, ...campaign.campaignData } : defaultData);
    }
    
    // Mark as initialized after first load
    setIsInitialized(true);
  }, []);

  // Save campaign data when it changes (only after initialization)
  useEffect(() => {
    // Don't save during initial load
    if (!isInitialized || !currentCampaignId) return;
    
    // Debounce saves to prevent loops
    const timeoutId = setTimeout(() => {
      campaignService.updateCampaign(currentCampaignId, {
        campaignData: campaignData
      });

      // Save to Firebase if authenticated
      if (isAuthenticated) {
        forceSave();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [campaignData, currentCampaignId, isInitialized]);

  const updateCampaignData = (updates) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  // Modal helpers
  const showInputModal = (title, placeholder, callback) => {
    setInputModal({ isOpen: true, title, placeholder, callback });
  };
  
  const hideInputModal = () => {
    setInputModal({ isOpen: false, title: '', placeholder: '', callback: null });
  };
  
  const handleInputConfirm = (value) => {
    if (inputModal.callback) {
      inputModal.callback(value);
    }
    hideInputModal();
  };
  
  const showConfirmModal = (title, message, callback) => {
    setConfirmModal({ isOpen: true, title, message, callback });
  };
  
  const hideConfirmModal = () => {
    setConfirmModal({ isOpen: false, title: '', message: '', callback: null });
  };
  
  const handleConfirm = () => {
    if (confirmModal.callback) {
      confirmModal.callback();
    }
    hideConfirmModal();
  };
  
  // Library browser helpers
  const openLibraryBrowser = (libraryType, title, onSelectCallback) => {
    setLibraryBrowser({
      isOpen: true,
      libraryType,
      title,
      onSelect: onSelectCallback
    });
  };
  
  const closeLibraryBrowser = () => {
    setLibraryBrowser({
      isOpen: false,
      libraryType: LIBRARY_TYPES.CREATURES,
      title: '',
      onSelect: null
    });
  };
  
  // Add creature from library
  const addCreatureFromLibrary = () => {
    openLibraryBrowser(LIBRARY_TYPES.CREATURES, 'Add Creature to Campaign', (selectedItems) => {
      const items = Array.isArray(selectedItems) ? selectedItems : [selectedItems];
      const newCreatures = items.map(creature => ({
        id: `lib-${creature.id}-${Date.now()}`,
        libraryId: creature.id,
        // Store full creature data for tooltip display (like items do)
        ...creature,
        notes: '',
        isFromLibrary: true
      }));
      updateCampaignData({
        selectedCreatures: [...(campaignData.selectedCreatures || []), ...newCreatures]
      });
    });
  };
  
  // Add item from library
  const addItemFromLibrary = () => {
    openLibraryBrowser(LIBRARY_TYPES.ITEMS, 'Add Item to Campaign', (selectedItems) => {
      const items = Array.isArray(selectedItems) ? selectedItems : [selectedItems];
      const newItems = items.map(item => ({
        id: `lib-${item.id}-${Date.now()}`,
        libraryId: item.id,
        // Store full item data for tooltip display
        ...item,
        iconId: item.iconId || item.icon,
        icon: item.icon || item.iconId,
        notes: '',
        isFromLibrary: true
      }));
      updateCampaignData({
        selectedItems: [...(campaignData.selectedItems || []), ...newItems]
      });
    });
  };
  
  // Add spell from library
  const addSpellFromLibrary = () => {
    openLibraryBrowser(LIBRARY_TYPES.SPELLS, 'Add Spell to Campaign', (selectedItems) => {
      const items = Array.isArray(selectedItems) ? selectedItems : [selectedItems];
      const newSpells = items.map(spell => ({
        id: `lib-${spell.id}-${Date.now()}`,
        libraryId: spell.id,
        name: spell.name,
        school: spell.school,
        level: spell.level,
        icon: spell.icon,
        notes: '',
        isFromLibrary: true
      }));
      updateCampaignData({
        selectedSpells: [...(campaignData.selectedSpells || []), ...newSpells]
      });
    });
  };
  
  // Remove library item
  const removeLibraryCreature = (itemId) => {
    // Clear hover state if this creature is being hovered
    if (hoveredCreature && hoveredCreature.id === itemId) {
      handleMouseLeave();
    }
    updateCampaignData({
      selectedCreatures: (campaignData.selectedCreatures || []).filter(c => c.id !== itemId)
    });
  };
  
  const removeLibraryItem = (itemId) => {
    // Clear hover state if this item is being hovered
    if (hoveredItem && hoveredItem.id === itemId) {
      handleMouseLeave();
    }
    updateCampaignData({
      selectedItems: (campaignData.selectedItems || []).filter(i => i.id !== itemId)
    });
  };
  
  const removeLibrarySpell = (itemId) => {
    // Clear hover state if this spell is being hovered
    if (hoveredSpell && hoveredSpell.id === itemId) {
      handleMouseLeave();
    }
    updateCampaignData({
      selectedSpells: (campaignData.selectedSpells || []).filter(s => s.id !== itemId)
    });
  };

  // ============ PLAYER MANAGEMENT ============
  const addPlayer = () => {
    showInputModal('Add Player', 'Enter player name...', (playerName) => {
      const newPlayer = {
        id: Date.now(),
        name: playerName,
        characterName: '',
        class: '',
        level: 1,
        status: 'active',
        notes: '',
        background: '',
        goals: ''
      };
      updateCampaignData({ players: [...campaignData.players, newPlayer] });
    });
  };

  const updatePlayer = (playerId, updates) => {
    updateCampaignData({
      players: campaignData.players.map(p => p.id === playerId ? { ...p, ...updates } : p)
    });
  };

  const removePlayer = (playerId) => {
    showConfirmModal('Remove Player', 'Are you sure you want to remove this player?', () => {
      updateCampaignData({ players: campaignData.players.filter(p => p.id !== playerId) });
    });
  };

  // ============ SESSION MANAGEMENT ============
  const addSession = () => {
    const sessionNumber = campaignData.sessions.length + 1;
    const newSession = {
      id: Date.now(),
      number: sessionNumber,
      title: `Session ${sessionNumber}`,
      date: new Date().toISOString().split('T')[0],
      status: 'planned',
      notes: '',
      summary: ''
    };
    updateCampaignData({
      sessions: [...campaignData.sessions, newSession],
      currentSession: sessionNumber
    });
  };

  const updateSession = (sessionId, updates) => {
    updateCampaignData({
      sessions: campaignData.sessions.map(s => s.id === sessionId ? { ...s, ...updates } : s)
    });
  };

  const removeSession = (sessionId) => {
    showConfirmModal('Delete Session', 'Are you sure you want to delete this session?', () => {
      updateCampaignData({ sessions: campaignData.sessions.filter(s => s.id !== sessionId) });
    });
  };

  // ============ NPC MANAGEMENT ============
  const addNPC = () => {
    showInputModal('Add NPC', 'Enter NPC name...', (npcName) => {
      const newNPC = {
        id: Date.now(),
        name: npcName,
        description: '',
        location: '',
        relationship: 'neutral',
        plotRelevance: 'minor',
        notes: '',
        status: 'alive'
      };
      updateCampaignData({ npcs: [...campaignData.npcs, newNPC] });
    });
  };

  const updateNPC = (npcId, updates) => {
    updateCampaignData({
      npcs: campaignData.npcs.map(npc => npc.id === npcId ? { ...npc, ...updates } : npc)
    });
  };

  const removeNPC = (npcId) => {
    showConfirmModal('Remove NPC', 'Are you sure you want to remove this NPC?', () => {
      updateCampaignData({ npcs: campaignData.npcs.filter(npc => npc.id !== npcId) });
    });
  };

  // ============ LOCATION MANAGEMENT ============
  const addLocation = () => {
    showInputModal('Add Location', 'Enter location name...', (locationName) => {
      const newLocation = {
        id: Date.now(),
        name: locationName,
        description: '',
        type: 'city',
        region: '',
        notableFeatures: '',
        notes: ''
      };
      updateCampaignData({ locations: [...campaignData.locations, newLocation] });
    });
  };

  const updateLocation = (locationId, updates) => {
    updateCampaignData({
      locations: campaignData.locations.map(loc => loc.id === locationId ? { ...loc, ...updates } : loc)
    });
  };

  const removeLocation = (locationId) => {
    showConfirmModal('Remove Location', 'Are you sure you want to remove this location?', () => {
      updateCampaignData({ locations: campaignData.locations.filter(loc => loc.id !== locationId) });
    });
  };

  // ============ PLOT THREAD MANAGEMENT ============
  const addPlotThread = () => {
    showInputModal('New Plot Thread', 'Enter plot thread title...', (plotTitle) => {
      const newPlot = {
        id: Date.now(),
        title: plotTitle,
        description: '',
        status: 'active',
        priority: 'medium',
        relatedNPCs: [],
        relatedLocations: [],
        notes: ''
      };
      updateCampaignData({ plotThreads: [...campaignData.plotThreads, newPlot] });
    });
  };

  const updatePlotThread = (plotId, updates) => {
    updateCampaignData({
      plotThreads: campaignData.plotThreads.map(p => p.id === plotId ? { ...p, ...updates } : p)
    });
  };

  const removePlotThread = (plotId) => {
    showConfirmModal('Remove Plot Thread', 'Are you sure you want to remove this plot thread?', () => {
      updateCampaignData({ plotThreads: campaignData.plotThreads.filter(p => p.id !== plotId) });
    });
  };

  // ============ QUEST MANAGEMENT ============
  const addQuest = () => {
    showInputModal('New Quest', 'Enter quest title...', (questTitle) => {
      const newQuest = {
        id: Date.now(),
        title: questTitle,
        description: '',
        type: 'side', // main, side, bounty
        status: 'not-started', // not-started, in-progress, completed, failed
        priority: 'medium',
        giver: '',
        location: '',
        objectives: [],
        rewards: '',
        notes: '',
        relatedNPCs: [],
        relatedLocations: []
      };
      updateCampaignData({ quests: [...(campaignData.quests || []), newQuest] });
    });
  };

  const updateQuest = (questId, updates) => {
    updateCampaignData({
      quests: (campaignData.quests || []).map(q => q.id === questId ? { ...q, ...updates } : q)
    });
  };

  const removeQuest = (questId) => {
    showConfirmModal('Remove Quest', 'Are you sure you want to remove this quest?', () => {
      updateCampaignData({ quests: (campaignData.quests || []).filter(q => q.id !== questId) });
    });
  };

  const addQuestObjective = (questId) => {
    const quest = (campaignData.quests || []).find(q => q.id === questId);
    if (quest) {
      const newObjective = {
        id: Date.now(),
        text: '',
        completed: false
      };
      updateQuest(questId, { objectives: [...(quest.objectives || []), newObjective] });
    }
  };

  const updateQuestObjective = (questId, objectiveId, updates) => {
    const quest = (campaignData.quests || []).find(q => q.id === questId);
    if (quest) {
      const updatedObjectives = (quest.objectives || []).map(obj => 
        obj.id === objectiveId ? { ...obj, ...updates } : obj
      );
      updateQuest(questId, { objectives: updatedObjectives });
    }
  };

  const removeQuestObjective = (questId, objectiveId) => {
    const quest = (campaignData.quests || []).find(q => q.id === questId);
    if (quest) {
      updateQuest(questId, { objectives: (quest.objectives || []).filter(obj => obj.id !== objectiveId) });
    }
  };

  // ============ HOMEBREW MANAGEMENT ============
  const addHomebrewItem = () => {
    showInputModal('Add Custom Item', 'Enter item name...', (itemName) => {
      const newItem = {
        id: Date.now(),
        name: itemName,
        type: 'weapon',
        rarity: 'common',
        description: '',
        properties: '',
        effects: '',
        notes: ''
      };
      updateCampaignData({
        homebrew: { ...campaignData.homebrew, items: [...(campaignData.homebrew?.items || []), newItem] }
      });
    });
  };

  const updateHomebrewItem = (itemId, updates) => {
    updateCampaignData({
      homebrew: {
        ...campaignData.homebrew,
        items: (campaignData.homebrew?.items || []).map(i => i.id === itemId ? { ...i, ...updates } : i)
      }
    });
  };

  const removeHomebrewItem = (itemId) => {
    showConfirmModal('Remove Item', 'Are you sure you want to remove this item?', () => {
      updateCampaignData({
        homebrew: { ...campaignData.homebrew, items: (campaignData.homebrew?.items || []).filter(i => i.id !== itemId) }
      });
    });
  };

  const addHomebrewMonster = () => {
    showInputModal('Add Custom Monster', 'Enter monster name...', (monsterName) => {
      const newMonster = {
        id: Date.now(),
        name: monsterName,
        type: 'beast',
        size: 'medium',
        challengeRating: '1',
        description: '',
        hp: '',
        ac: '',
        notes: ''
      };
      updateCampaignData({
        homebrew: { ...campaignData.homebrew, monsters: [...(campaignData.homebrew?.monsters || []), newMonster] }
      });
    });
  };

  const updateHomebrewMonster = (monsterId, updates) => {
    updateCampaignData({
      homebrew: {
        ...campaignData.homebrew,
        monsters: (campaignData.homebrew?.monsters || []).map(m => m.id === monsterId ? { ...m, ...updates } : m)
      }
    });
  };

  const removeHomebrewMonster = (monsterId) => {
    showConfirmModal('Remove Monster', 'Are you sure you want to remove this monster?', () => {
      updateCampaignData({
        homebrew: { ...campaignData.homebrew, monsters: (campaignData.homebrew?.monsters || []).filter(m => m.id !== monsterId) }
      });
    });
  };

  const addHomebrewSpell = () => {
    showInputModal('Add Custom Spell', 'Enter spell name...', (spellName) => {
      const newSpell = {
        id: Date.now(),
        name: spellName,
        level: 1,
        school: 'evocation',
        castingTime: '1 action',
        range: '60 feet',
        description: '',
        notes: ''
      };
      updateCampaignData({
        homebrew: { ...campaignData.homebrew, spells: [...(campaignData.homebrew?.spells || []), newSpell] }
      });
    });
  };

  const updateHomebrewSpell = (spellId, updates) => {
    updateCampaignData({
      homebrew: {
        ...campaignData.homebrew,
        spells: (campaignData.homebrew?.spells || []).map(s => s.id === spellId ? { ...s, ...updates } : s)
      }
    });
  };

  const removeHomebrewSpell = (spellId) => {
    showConfirmModal('Remove Spell', 'Are you sure you want to remove this spell?', () => {
      updateCampaignData({
        homebrew: { ...campaignData.homebrew, spells: (campaignData.homebrew?.spells || []).filter(s => s.id !== spellId) }
      });
    });
  };

  const addLoreArticle = () => {
    showInputModal('New Lore Article', 'Enter article title...', (articleTitle) => {
      const newArticle = {
        id: Date.now(),
        title: articleTitle,
        category: 'history',
        content: '',
        tags: [],
        isSecret: false,
        notes: ''
      };
      updateCampaignData({
        homebrew: { ...campaignData.homebrew, lore: [...(campaignData.homebrew?.lore || []), newArticle] }
      });
    });
  };

  const updateLoreArticle = (articleId, updates) => {
    updateCampaignData({
      homebrew: {
        ...campaignData.homebrew,
        lore: (campaignData.homebrew?.lore || []).map(a => a.id === articleId ? { ...a, ...updates } : a)
      }
    });
  };

  const removeLoreArticle = (articleId) => {
    showConfirmModal('Remove Article', 'Are you sure you want to remove this lore article?', () => {
      updateCampaignData({
        homebrew: { ...campaignData.homebrew, lore: (campaignData.homebrew?.lore || []).filter(a => a.id !== articleId) }
      });
    });
  };

  // Navigation sections - matching in-game CampaignManagerWindow
  const sections = [
    { id: 'overview', label: 'Overview', icon: 'fa-home' },
    { id: 'sessions', label: 'Sessions', icon: 'fa-calendar-alt' },
    { id: 'npcs', label: 'NPCs', icon: 'fa-users' },
    { id: 'locations', label: 'Locations', icon: 'fa-map-marker-alt' },
    { id: 'quests', label: 'Quests', icon: 'fa-scroll' },
    { id: 'plots', label: 'Plot Threads', icon: 'fa-project-diagram' },
    { id: 'homebrew', label: 'Homebrew', icon: 'fa-flask' }
  ];

  return (
    <div className="campaign-manager-dashboard">
      {/* Input Modal */}
      <InputModal
        isOpen={inputModal.isOpen}
        title={inputModal.title}
        placeholder={inputModal.placeholder}
        onConfirm={handleInputConfirm}
        onCancel={hideInputModal}
      />
      
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirm}
        onCancel={hideConfirmModal}
      />
      
      {/* Library Browser Modal */}
      <LibraryBrowserModal
        isOpen={libraryBrowser.isOpen}
        onClose={closeLibraryBrowser}
        libraryType={libraryBrowser.libraryType}
        title={libraryBrowser.title}
        onSelect={libraryBrowser.onSelect}
        multiSelect={true}
      />

      {/* Campaign Header */}
      <div className="campaign-detail-header">
        <div className="campaign-title-section">
          <div className="campaign-header-controls">
            <i className="fas fa-scroll campaign-icon"></i>
            {/* Campaign Selector */}
            <select
              value={currentCampaignId || ''}
              onChange={(e) => {
                const newCampaignId = e.target.value;
                campaignService.setCurrentCampaign(newCampaignId);
                setCurrentCampaignId(newCampaignId);
                const campaign = campaignService.getCampaign(newCampaignId);
                // Load the campaign data or reset to defaults
                const defaultData = {
                  name: campaign?.name || 'New Campaign',
                  description: campaign?.description || '',
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
                setCampaignData(campaign?.campaignData ? { ...defaultData, ...campaign.campaignData } : defaultData);
              }}
              className="campaign-selector"
            >
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
              ))}
            </select>
            <button
              onClick={() => {
                const newCampaign = campaignService.createCampaign({ name: 'New Campaign' });
                setCampaigns(campaignService.getCampaigns());
                campaignService.setCurrentCampaign(newCampaign.id);
                setCurrentCampaignId(newCampaign.id);

                // Save to Firebase if authenticated
                if (isAuthenticated) {
                  forceSave();
                }

                // Reset to fresh campaign data
                const freshData = {
                  name: 'New Campaign',
                  description: '',
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
                setCampaignData(newCampaign.campaignData || freshData);
              }}
              className="btn btn-primary campaign-new-btn"
            >
              + New
            </button>
            <button
              onClick={() => {
                if (currentCampaignId) {
                  showConfirmModal(
                    'Delete Campaign',
                    `Are you sure you want to delete the campaign "${campaigns.find(c => c.id === currentCampaignId)?.name || 'this campaign'}"? This action cannot be undone.`,
                    () => {
                      const campaignToDelete = campaigns.find(c => c.id === currentCampaignId);
                      if (campaignToDelete) {
                        // Delete the campaign
                        campaignService.deleteCampaign(currentCampaignId);

                        // Delete from Firebase if authenticated
                        if (isAuthenticated) {
                          deleteCampaign(currentCampaignId);
                        }

                        // Get updated campaigns list
                        const updatedCampaigns = campaignService.getCampaigns();

                        // If there are other campaigns, switch to the first one
                        // Otherwise, create a default campaign
                        let newCurrentId;
                        let newCampaignData;

                        if (updatedCampaigns.length > 0) {
                          newCurrentId = updatedCampaigns[0].id;
                          const campaign = campaignService.getCampaign(newCurrentId);
                          campaignService.setCurrentCampaign(newCurrentId);
                          const defaultData = {
                            name: campaign?.name || 'New Campaign',
                            description: campaign?.description || '',
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
                          newCampaignData = campaign?.campaignData ? { ...defaultData, ...campaign.campaignData } : defaultData;
                        } else {
                          // No campaigns left, create a default one
                          const defaultCampaign = campaignService.createCampaign({ name: 'New Campaign' });
                          newCurrentId = defaultCampaign.id;
                          campaignService.setCurrentCampaign(newCurrentId);
                          updatedCampaigns.push(defaultCampaign);
                          newCampaignData = defaultCampaign.campaignData || {
                            name: 'New Campaign',
                            description: '',
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
                        }

                        // Update state
                        setCampaigns(updatedCampaigns);
                        setCurrentCampaignId(newCurrentId);
                        setCampaignData(newCampaignData);
                      }
                    }
                  );
                }
              }}
              className="btn btn-danger campaign-delete-btn"
              disabled={campaigns.length <= 1}
              title={campaigns.length <= 1 ? "Cannot delete the only campaign" : "Delete this campaign"}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
          <input
            type="text"
            value={campaignData.name}
            onChange={(e) => {
              const newName = e.target.value;
              updateCampaignData({ name: newName });
              // Update campaign name in the service and dropdown immediately
              if (currentCampaignId) {
                campaignService.updateCampaign(currentCampaignId, {
                  name: newName,
                  campaignData: { ...campaignData, name: newName }
                });
                // Update local campaigns state to refresh dropdown
                setCampaigns(prev => prev.map(c =>
                  c.id === currentCampaignId ? { ...c, name: newName } : c
                ));
              }
            }}
            className="campaign-title-input"
            placeholder="Campaign Name..."
          />
        </div>
        <div className="campaign-sync-notice">
          <i className="fas fa-sync-alt"></i>
          <span>Synced with in-game Campaign Manager</span>
        </div>
      </div>

      {/* Section Navigation */}
      <nav className="campaign-section-nav">
        {sections.map(section => (
          <button
            key={section.id}
            className={`section-nav-btn ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <i className={`fas ${section.icon}`}></i>
            <span>{section.label}</span>
          </button>
        ))}
      </nav>

      {/* Section Content */}
      <div className="campaign-section-content">
        
        {/* ============ OVERVIEW ============ */}
        {activeSection === 'overview' && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="overview-card description-card">
                <h3>Campaign Description</h3>
                <textarea
                  value={campaignData.description}
                  onChange={(e) => updateCampaignData({ description: e.target.value })}
                  placeholder="Describe your campaign's setting, themes, and goals..."
                  rows={4}
                />
              </div>

              <div className="overview-card stats-card">
                <h3>Campaign Stats</h3>
                <div className="quick-stats">
                  <div className="stat-item">
                    <span className="stat-value">{campaignData.currentSession}</span>
                    <span className="stat-label">Session</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{campaignData.players.length}</span>
                    <span className="stat-label">Players</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{campaignData.npcs.length}</span>
                    <span className="stat-label">NPCs</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{campaignData.locations.length}</span>
                    <span className="stat-label">Locations</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{campaignData.plotThreads.length}</span>
                    <span className="stat-label">Plots</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {(campaignData.homebrew?.items?.length || 0) + 
                       (campaignData.homebrew?.monsters?.length || 0) + 
                       (campaignData.homebrew?.spells?.length || 0) + 
                       (campaignData.homebrew?.lore?.length || 0)}
                    </span>
                    <span className="stat-label">Homebrew</span>
                  </div>
                </div>
              </div>

              {/* Player Roster Quick View */}
              <div className="overview-card players-overview-card">
                <div className="card-header-row">
                  <h3>Player Roster</h3>
                  <button className="mini-add-btn" onClick={addPlayer}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div className="players-quick-list">
                  {campaignData.players.length > 0 ? (
                    campaignData.players.map(player => (
                      <div key={player.id} className="player-quick-item">
                        <div className="player-avatar-small">{player.name.charAt(0)}</div>
                        <div className="player-quick-info">
                          <span className="player-name">{player.name}</span>
                          <span className="player-char">{player.characterName || 'No character'} {player.class && `• ${player.class}`}</span>
                        </div>
                        <span className={`status-dot ${player.status}`}></span>
                        <button
                          className="player-remove-btn-small"
                          onClick={() => removePlayer(player.id)}
                          title="Remove player"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="empty-text">No players yet</p>
                  )}
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="overview-card recent-card">
                <h3>Recent Sessions</h3>
                <div className="recent-list">
                  {campaignData.sessions.slice(-3).reverse().map(session => (
                    <div key={session.id} className="recent-item">
                      <span className="session-num">#{session.number}</span>
                      <span className="session-title">{session.title}</span>
                      <span className={`session-status ${session.status}`}>{session.status}</span>
                    </div>
                  ))}
                  {campaignData.sessions.length === 0 && <p className="empty-text">No sessions yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ SESSIONS ============ */}
        {activeSection === 'sessions' && (
          <div className="list-section">
            <div className="section-header">
              <h3>Session Management</h3>
              <button className="add-btn" onClick={addSession}>
                <i className="fas fa-plus"></i> New Session
              </button>
            </div>
            <div className="cards-list">
              {campaignData.sessions.length > 0 ? (
                campaignData.sessions.map(session => (
                  <div key={session.id} className="content-card session-card">
                    <div className="card-header">
                      <input
                        type="text"
                        value={session.title}
                        onChange={(e) => updateSession(session.id, { title: e.target.value })}
                        className="card-title-input"
                      />
                      <input
                        type="date"
                        value={session.date}
                        onChange={(e) => updateSession(session.id, { date: e.target.value })}
                        className="date-input"
                      />
                      <select
                        value={session.status}
                        onChange={(e) => updateSession(session.id, { status: e.target.value })}
                        className="status-select"
                      >
                        <option value="planned">Planned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button className="remove-btn" onClick={() => removeSession(session.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <div className="card-body">
                      <div className="field">
                        <label>Session Notes</label>
                        <textarea
                          value={session.notes}
                          onChange={(e) => updateSession(session.id, { notes: e.target.value })}
                          placeholder="Plan objectives, encounters, plot points..."
                          rows={3}
                        />
                      </div>
                      {session.status === 'completed' && (
                        <div className="field">
                          <label>Session Summary</label>
                          <textarea
                            value={session.summary || ''}
                            onChange={(e) => updateSession(session.id, { summary: e.target.value })}
                            placeholder="What happened this session..."
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-calendar-plus"></i>
                  <p>No sessions planned yet. Create your first session!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ NPCs ============ */}
        {activeSection === 'npcs' && (
          <div className="list-section">
            <div className="section-header">
              <h3>NPC Management</h3>
              <button className="add-btn" onClick={addNPC}>
                <i className="fas fa-plus"></i> Add NPC
              </button>
            </div>
            <div className="cards-grid">
              {campaignData.npcs.length > 0 ? (
                campaignData.npcs.map(npc => (
                  <div key={npc.id} className="content-card npc-card">
                    <div className="card-header">
                      <input
                        type="text"
                        value={npc.name}
                        onChange={(e) => updateNPC(npc.id, { name: e.target.value })}
                        className="card-title-input"
                      />
                      <button className="remove-btn" onClick={() => removeNPC(npc.id)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="card-body">
                      <textarea
                        value={npc.description}
                        onChange={(e) => updateNPC(npc.id, { description: e.target.value })}
                        placeholder="Physical description, personality..."
                        rows={2}
                      />
                      <div className="field-row">
                        <input
                          type="text"
                          value={npc.location}
                          onChange={(e) => updateNPC(npc.id, { location: e.target.value })}
                          placeholder="Location..."
                          className="small-input"
                        />
                        <select
                          value={npc.relationship}
                          onChange={(e) => updateNPC(npc.id, { relationship: e.target.value })}
                          className="small-select"
                        >
                          <option value="ally">Ally</option>
                          <option value="neutral">Neutral</option>
                          <option value="enemy">Enemy</option>
                        </select>
                        <select
                          value={npc.plotRelevance}
                          onChange={(e) => updateNPC(npc.id, { plotRelevance: e.target.value })}
                          className="small-select"
                        >
                          <option value="major">Major</option>
                          <option value="moderate">Moderate</option>
                          <option value="minor">Minor</option>
                        </select>
                      </div>
                      <textarea
                        value={npc.notes}
                        onChange={(e) => updateNPC(npc.id, { notes: e.target.value })}
                        placeholder="Plot hooks, secrets..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-user-plus"></i>
                  <p>No NPCs created yet. Add NPCs to track relationships!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ LOCATIONS ============ */}
        {activeSection === 'locations' && (
          <div className="list-section">
            <div className="section-header">
              <h3>Location Management</h3>
              <button className="add-btn" onClick={addLocation}>
                <i className="fas fa-plus"></i> Add Location
              </button>
            </div>
            <div className="cards-grid">
              {campaignData.locations.length > 0 ? (
                campaignData.locations.map(location => (
                  <div key={location.id} className="content-card location-card">
                    <div className="card-header">
                      <input
                        type="text"
                        value={location.name}
                        onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                        className="card-title-input"
                      />
                      <button className="remove-btn" onClick={() => removeLocation(location.id)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="card-body">
                      <textarea
                        value={location.description}
                        onChange={(e) => updateLocation(location.id, { description: e.target.value })}
                        placeholder="Describe the location..."
                        rows={2}
                      />
                      <div className="field-row">
                        <select
                          value={location.type}
                          onChange={(e) => updateLocation(location.id, { type: e.target.value })}
                          className="small-select"
                        >
                          <option value="city">City</option>
                          <option value="town">Town</option>
                          <option value="village">Village</option>
                          <option value="dungeon">Dungeon</option>
                          <option value="landmark">Landmark</option>
                          <option value="wilderness">Wilderness</option>
                        </select>
                        <input
                          type="text"
                          value={location.region}
                          onChange={(e) => updateLocation(location.id, { region: e.target.value })}
                          placeholder="Region..."
                          className="small-input"
                        />
                      </div>
                      <textarea
                        value={location.notableFeatures}
                        onChange={(e) => updateLocation(location.id, { notableFeatures: e.target.value })}
                        placeholder="Notable features..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-map-marked-alt"></i>
                  <p>No locations created yet. Build your world!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ QUESTS ============ */}
        {activeSection === 'quests' && (
          <div className="list-section">
            <div className="section-header">
              <h3>Quest Management</h3>
              <button className="add-btn" onClick={addQuest}>
                <i className="fas fa-plus"></i> New Quest
              </button>
            </div>
            <div className="cards-list">
              {(campaignData.quests || []).length > 0 ? (
                (campaignData.quests || []).map(quest => (
                  <div key={quest.id} className="content-card quest-card">
                    <div className="card-header">
                      <span className={`quest-type-badge ${quest.type}`}>{quest.type}</span>
                      <input
                        type="text"
                        value={quest.title}
                        onChange={(e) => updateQuest(quest.id, { title: e.target.value })}
                        className="card-title-input"
                        style={{ maxWidth: '250px' }}
                      />
                      <select
                        value={quest.status}
                        onChange={(e) => updateQuest(quest.id, { status: e.target.value })}
                        className="status-select"
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                      <select
                        value={quest.priority}
                        onChange={(e) => updateQuest(quest.id, { priority: e.target.value })}
                        className={`priority-select priority-${quest.priority}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                      <button className="remove-btn" onClick={() => removeQuest(quest.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <div className="card-body">
                      <div className="field-row">
                        <div className="field" style={{ flex: 1 }}>
                          <label>Quest Type</label>
                          <select
                            value={quest.type}
                            onChange={(e) => updateQuest(quest.id, { type: e.target.value })}
                            className="small-select"
                          >
                            <option value="main">Main Quest</option>
                            <option value="side">Side Quest</option>
                            <option value="bounty">Bounty</option>
                          </select>
                        </div>
                        <div className="field" style={{ flex: 1 }}>
                          <label>Quest Giver</label>
                          <input
                            type="text"
                            value={quest.giver || ''}
                            onChange={(e) => updateQuest(quest.id, { giver: e.target.value })}
                            placeholder="NPC name..."
                            className="small-input"
                          />
                        </div>
                        <div className="field" style={{ flex: 1 }}>
                          <label>Location</label>
                          <input
                            type="text"
                            value={quest.location || ''}
                            onChange={(e) => updateQuest(quest.id, { location: e.target.value })}
                            placeholder="Quest location..."
                            className="small-input"
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label>Description</label>
                        <textarea
                          value={quest.description}
                          onChange={(e) => updateQuest(quest.id, { description: e.target.value })}
                          placeholder="Describe the quest, its background, and what needs to be done..."
                          rows={3}
                        />
                      </div>
                      <div className="field">
                        <label>
                          Objectives 
                          <button 
                            className="mini-add-btn" 
                            onClick={() => addQuestObjective(quest.id)}
                            style={{ marginLeft: '10px', width: '24px', height: '24px', fontSize: '0.7rem' }}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </label>
                        <div className="quest-objectives">
                          {(quest.objectives || []).length > 0 ? (
                            quest.objectives.map(obj => (
                              <div key={obj.id} className="quest-objective">
                                <input
                                  type="checkbox"
                                  checked={obj.completed}
                                  onChange={(e) => updateQuestObjective(quest.id, obj.id, { completed: e.target.checked })}
                                  className="quest-objective-checkbox"
                                />
                                <input
                                  type="text"
                                  value={obj.text}
                                  onChange={(e) => updateQuestObjective(quest.id, obj.id, { text: e.target.value })}
                                  placeholder="Objective description..."
                                  className={`small-input ${obj.completed ? 'completed' : ''}`}
                                  style={{ flex: 1, textDecoration: obj.completed ? 'line-through' : 'none', opacity: obj.completed ? 0.6 : 1 }}
                                />
                                <button 
                                  className="remove-btn" 
                                  onClick={() => removeQuestObjective(quest.id, obj.id)}
                                  style={{ width: '24px', height: '24px' }}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="empty-text" style={{ padding: '10px' }}>No objectives yet. Add some!</p>
                          )}
                        </div>
                      </div>
                      <div className="field">
                        <label>Rewards</label>
                        <textarea
                          value={quest.rewards || ''}
                          onChange={(e) => updateQuest(quest.id, { rewards: e.target.value })}
                          placeholder="Gold, items, experience, reputation..."
                          rows={2}
                        />
                      </div>
                      <div className="field">
                        <label>DM Notes</label>
                        <textarea
                          value={quest.notes || ''}
                          onChange={(e) => updateQuest(quest.id, { notes: e.target.value })}
                          placeholder="Private notes, hints, consequences..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-scroll"></i>
                  <p>No quests created yet. Start your adventure!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ PLOT THREADS ============ */}
        {activeSection === 'plots' && (
          <div className="list-section">
            <div className="section-header">
              <h3>Plot Thread Management</h3>
              <button className="add-btn" onClick={addPlotThread}>
                <i className="fas fa-plus"></i> New Plot Thread
              </button>
            </div>
            <div className="cards-list">
              {campaignData.plotThreads.length > 0 ? (
                campaignData.plotThreads.map(plot => (
                  <div key={plot.id} className="content-card plot-card">
                    <div className="card-header">
                      <input
                        type="text"
                        value={plot.title}
                        onChange={(e) => updatePlotThread(plot.id, { title: e.target.value })}
                        className="card-title-input"
                      />
                      <select
                        value={plot.status}
                        onChange={(e) => updatePlotThread(plot.id, { status: e.target.value })}
                        className="status-select"
                      >
                        <option value="active">Active</option>
                        <option value="on-hold">On Hold</option>
                        <option value="resolved">Resolved</option>
                        <option value="abandoned">Abandoned</option>
                      </select>
                      <select
                        value={plot.priority}
                        onChange={(e) => updatePlotThread(plot.id, { priority: e.target.value })}
                        className={`priority-select priority-${plot.priority}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                      <button className="remove-btn" onClick={() => removePlotThread(plot.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <div className="card-body">
                      <textarea
                        value={plot.description}
                        onChange={(e) => updatePlotThread(plot.id, { description: e.target.value })}
                        placeholder="Describe the plot thread..."
                        rows={3}
                      />
                      <div className="field">
                        <label>Related NPCs</label>
                        <input
                          type="text"
                          value={Array.isArray(plot.relatedNPCs) ? plot.relatedNPCs.join(', ') : ''}
                          onChange={(e) => updatePlotThread(plot.id, { 
                            relatedNPCs: e.target.value ? e.target.value.split(',').map(n => n.trim()).filter(n => n) : []
                          })}
                          placeholder="NPC names (comma-separated)..."
                        />
                      </div>
                      <div className="field">
                        <label>Notes</label>
                        <textarea
                          value={plot.notes}
                          onChange={(e) => updatePlotThread(plot.id, { notes: e.target.value })}
                          placeholder="Progress, key events..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-project-diagram"></i>
                  <p>No plot threads yet. Create storylines to organize your campaign!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ HOMEBREW ============ */}
        {activeSection === 'homebrew' && (
          <div className="homebrew-section">
            <div className="homebrew-subtabs">
              <button className={`homebrew-subtab ${homebrewSubTab === 'items' ? 'active' : ''}`} onClick={() => setHomebrewSubTab('items')}>
                <i className="fas fa-gem"></i> Items ({((campaignData.selectedItems || []).length) + (Array.isArray(campaignData.homebrew?.items) ? campaignData.homebrew.items.length : (campaignData.homebrew?.items ? Object.keys(campaignData.homebrew.items).length : 0))})
              </button>
              <button className={`homebrew-subtab ${homebrewSubTab === 'monsters' ? 'active' : ''}`} onClick={() => setHomebrewSubTab('monsters')}>
                <i className="fas fa-dragon"></i> Monsters ({((campaignData.selectedCreatures || []).length) + (Array.isArray(campaignData.homebrew?.monsters) ? campaignData.homebrew.monsters.length : (campaignData.homebrew?.monsters ? Object.keys(campaignData.homebrew.monsters).length : 0))})
              </button>
              <button className={`homebrew-subtab ${homebrewSubTab === 'spells' ? 'active' : ''}`} onClick={() => setHomebrewSubTab('spells')}>
                <i className="fas fa-hat-wizard"></i> Spells ({((campaignData.selectedSpells || []).length) + (Array.isArray(campaignData.homebrew?.spells) ? campaignData.homebrew.spells.length : (campaignData.homebrew?.spells ? Object.keys(campaignData.homebrew.spells).length : 0))})
              </button>
              <button className={`homebrew-subtab ${homebrewSubTab === 'lore' ? 'active' : ''}`} onClick={() => setHomebrewSubTab('lore')}>
                <i className="fas fa-book-open"></i> Lore ({Array.isArray(campaignData.homebrew?.lore) ? campaignData.homebrew.lore.length : (campaignData.homebrew?.lore ? Object.keys(campaignData.homebrew.lore).length : 0)})
              </button>
            </div>

            <div className="homebrew-content">
              {/* Items */}
              {homebrewSubTab === 'items' && (
                <div className="list-section">
                  <div className="section-header">
                    <h3>Campaign Items</h3>
                    <div className="section-header-actions">
                      <button className="add-btn secondary" onClick={addItemFromLibrary}>
                        <i className="fas fa-book"></i> Browse Library
                      </button>
                      <button className="add-btn" onClick={addHomebrewItem}>
                        <i className="fas fa-plus"></i> Create Custom
                      </button>
                    </div>
                  </div>
                  
                  {/* Library Items */}
                  {(campaignData.selectedItems || []).length > 0 && (
                    <div className="library-items-section">
                      <h4 className="subsection-title"><i className="fas fa-book"></i> From Library</h4>
                      <div className="cards-grid">
                        {(campaignData.selectedItems || []).map(item => (
                          <div
                            key={item.id}
                            className="content-card item-card library-card"
                            onMouseEnter={(e) => handleMouseEnter(e, item, null, null)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className="card-body">
                              <div className="integrated-header">
                                <span className={`library-badge`}><i className="fas fa-link"></i></span>
                                <span className="card-title-display">{item.name}</span>
                                <span className={`rarity-badge rarity-${item.quality}`}>{item.quality}</span>
                                <button className="remove-btn" onClick={() => removeLibraryItem(item.id)}><i className="fas fa-times"></i></button>
                              </div>
                              <div className="library-item-info">
                                <span className="library-item-tag">{formatTag(item.type)}</span>
                                {item.subtype && <span className="library-item-tag">{formatTag(item.subtype)}</span>}
                              </div>
                              <textarea
                                value={item.notes || ''}
                                onChange={(e) => {
                                  const updated = (campaignData.selectedItems || []).map(i =>
                                    i.id === item.id ? { ...i, notes: e.target.value } : i
                                  );
                                  updateCampaignData({ selectedItems: updated });
                                }}
                                placeholder="Campaign notes for this item..."
                                rows={2}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Custom Homebrew Items */}
                  {(campaignData.homebrew?.items || []).length > 0 && (
                    <div className="homebrew-items-section">
                      <h4 className="subsection-title"><i className="fas fa-hammer"></i> Custom Homebrew</h4>
                    </div>
                  )}
                  <div className="cards-grid">
                    {(campaignData.homebrew?.items || []).length > 0 ? (
                      (campaignData.homebrew?.items || []).map(item => (
                        item.type === 'weapon' ? (
                          // Enhanced Weapon Tooltip Display
                          <div key={item.id} className="content-card weapon-tooltip-card">
                            {/* Weapon Header */}
                            <div className="weapon-tooltip-header">
                              <div className="weapon-icon-section">
                                <div className="weapon-icon">
                                  <i className="fas fa-gavel"></i>
                                </div>
                              </div>
                              <div className="weapon-info-section">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => updateHomebrewItem(item.id, { name: e.target.value })}
                                  className="weapon-name-input"
                                  placeholder="Weapon name..."
                                />
                                <div className="weapon-meta">
                                  <span className={`rarity-badge rarity-${item.rarity}`}>{item.rarity}</span>
                                  <span className="weapon-type-label">Weapon</span>
                                </div>
                              </div>
                              <button className="remove-btn" onClick={() => removeHomebrewItem(item.id)}>
                                <i className="fas fa-times"></i>
                              </button>
                            </div>

                            {/* Weapon Stats */}
                            <div className="weapon-stats-section">
                              <div className="weapon-stat-row">
                                <div className="weapon-stat">
                                  <label>Damage</label>
                                  <input
                                    type="text"
                                    value={item.damage || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { damage: e.target.value })}
                                    placeholder="1d6 piercing"
                                    className="weapon-stat-input"
                                  />
                                </div>
                                <div className="weapon-stat">
                                  <label>Range</label>
                                  <input
                                    type="text"
                                    value={item.range || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { range: e.target.value })}
                                    placeholder="5 ft."
                                    className="weapon-stat-input"
                                  />
                                </div>
                              </div>
                              <div className="weapon-properties">
                                <label>Properties</label>
                                <textarea
                                  value={item.properties || ''}
                                  onChange={(e) => updateHomebrewItem(item.id, { properties: e.target.value })}
                                  placeholder="Versatile (1d8), Finesse, Light, Thrown (20/60)..."
                                  rows={1}
                                  className="weapon-properties-input"
                                />
                              </div>
                            </div>

                            {/* Weapon Effects */}
                            {item.effects && (
                              <div className="weapon-effects-section">
                                <h6 className="weapon-section-title">
                                  <i className="fas fa-magic"></i> Magical Effects
                                </h6>
                                <textarea
                                  value={item.effects}
                                  onChange={(e) => updateHomebrewItem(item.id, { effects: e.target.value })}
                                  placeholder="Magical properties, abilities, or special powers..."
                                  rows={2}
                                  className="weapon-effects-input"
                                />
                              </div>
                            )}

                            {/* Weapon Description */}
                            {item.description && (
                              <div className="weapon-description-section">
                                <h6 className="weapon-section-title">
                                  <i className="fas fa-scroll"></i> Description
                                </h6>
                                <textarea
                                  value={item.description}
                                  onChange={(e) => updateHomebrewItem(item.id, { description: e.target.value })}
                                  placeholder="Physical description, lore, or flavor text..."
                                  rows={2}
                                  className="weapon-description-input"
                                />
                              </div>
                            )}

                            {/* Campaign Notes - Collapsible */}
                            <details className="weapon-notes-section">
                              <summary className="weapon-notes-toggle">
                                <i className="fas fa-sticky-note"></i> Campaign Notes
                              </summary>
                              <textarea
                                value={item.notes || ''}
                                onChange={(e) => updateHomebrewItem(item.id, { notes: e.target.value })}
                                placeholder="Private campaign notes..."
                                rows={2}
                                className="weapon-notes-input"
                              />
                            </details>
                          </div>
                        ) : (
                          // Enhanced Tooltip Display for all other items
                          <div key={item.id} className="content-card item-tooltip-card">
                            {/* Item Header */}
                            <div className="item-tooltip-header">
                              <div className="item-icon-section">
                                <div className={`item-icon ${item.type}`}>
                                  {item.type === 'armor' && <i className="fas fa-shield-alt"></i>}
                                  {item.type === 'consumable' && <i className="fas fa-flask"></i>}
                                  {item.type === 'accessory' && <i className="fas fa-gem"></i>}
                                  {item.type === 'wondrous' && <i className="fas fa-hat-wizard"></i>}
                                </div>
                              </div>
                              <div className="item-info-section">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => updateHomebrewItem(item.id, { name: e.target.value })}
                                  className="item-name-input"
                                  placeholder="Item name..."
                                />
                                <div className="item-meta">
                                  <span className={`rarity-badge rarity-${item.rarity}`}>{item.rarity}</span>
                                  <span className="item-type-label">{item.type}</span>
                                </div>
                              </div>
                              <button className="remove-btn" onClick={() => removeHomebrewItem(item.id)}>
                                <i className="fas fa-times"></i>
                              </button>
                            </div>

                            {/* Item Properties */}
                            {item.properties && (
                              <div className="item-properties-section">
                                <h6 className="item-section-title">
                                  <i className="fas fa-cogs"></i> Properties
                                </h6>
                                <textarea
                                  value={item.properties}
                                  onChange={(e) => updateHomebrewItem(item.id, { properties: e.target.value })}
                                  placeholder="Special properties, requirements, etc..."
                                  rows={1}
                                  className="item-properties-input"
                                />
                              </div>
                            )}

                            {/* Item Effects */}
                            {item.effects && (
                              <div className="item-effects-section">
                                <h6 className="item-section-title">
                                  <i className="fas fa-magic"></i> Effects
                                </h6>
                                <textarea
                                  value={item.effects}
                                  onChange={(e) => updateHomebrewItem(item.id, { effects: e.target.value })}
                                  placeholder="Magical effects, abilities, or special powers..."
                                  rows={2}
                                  className="item-effects-input"
                                />
                              </div>
                            )}

                            {/* Item Description */}
                            {item.description && (
                              <div className="item-description-section">
                                <h6 className="item-section-title">
                                  <i className="fas fa-scroll"></i> Description
                                </h6>
                                <textarea
                                  value={item.description}
                                  onChange={(e) => updateHomebrewItem(item.id, { description: e.target.value })}
                                  placeholder="Physical description, lore, or flavor text..."
                                  rows={2}
                                  className="item-description-input"
                                />
                              </div>
                            )}

                            {/* Campaign Notes - Collapsible */}
                            <details className="item-notes-section">
                              <summary className="item-notes-toggle">
                                <i className="fas fa-sticky-note"></i> Campaign Notes
                              </summary>
                              <textarea
                                value={item.notes || ''}
                                onChange={(e) => updateHomebrewItem(item.id, { notes: e.target.value })}
                                placeholder="DM notes, modifications, or campaign-specific details..."
                                rows={2}
                                className="item-notes-input"
                              />
                            </details>
                          </div>
                        )
                      ))
                    ) : (
                      <div className="empty-state"><i className="fas fa-gem"></i><p>No custom items yet.</p></div>
                    )}
                  </div>
                </div>
              )}

              {/* Monsters */}
              {homebrewSubTab === 'monsters' && (
                <div className="list-section">
                  <div className="section-header">
                    <h3>Campaign Creatures</h3>
                    <div className="section-header-actions">
                      <button className="add-btn secondary" onClick={addCreatureFromLibrary}>
                        <i className="fas fa-book"></i> Browse Library
                      </button>
                      <button className="add-btn" onClick={addHomebrewMonster}>
                        <i className="fas fa-plus"></i> Create Custom
                      </button>
                    </div>
                  </div>
                  
                  {/* Library Creatures */}
                  {(campaignData.selectedCreatures || []).length > 0 && (
                    <div className="library-items-section">
                      <h4 className="subsection-title"><i className="fas fa-book"></i> From Library</h4>
                      <div className="cards-grid">
                        {(campaignData.selectedCreatures || []).map(creature => (
                          <div
                            key={creature.id}
                            className="content-card monster-card library-card"
                            onMouseEnter={(e) => handleMouseEnter(e, null, creature, null)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className="card-body">
                              <div className="integrated-header">
                                <span className={`library-badge`}><i className="fas fa-link"></i></span>
                                <span className="card-title-display">{creature.name}</span>
                                <button className="remove-btn" onClick={() => removeLibraryCreature(creature.id)}><i className="fas fa-times"></i></button>
                              </div>
                              <div className="library-item-info">
                                <span className="library-item-tag">{formatTag(creature.type)}</span>
                                <span className="library-item-tag">{formatTag(creature.size)}</span>
                                {creature.hp > 0 && <span className="library-item-tag">HP {creature.hp}</span>}
                              </div>
                              <textarea
                                value={creature.notes || ''}
                                onChange={(e) => {
                                  const updated = (campaignData.selectedCreatures || []).map(c =>
                                    c.id === creature.id ? { ...c, notes: e.target.value } : c
                                  );
                                  updateCampaignData({ selectedCreatures: updated });
                                }}
                                placeholder="Campaign notes for this creature..."
                                rows={2}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Custom Homebrew Creatures */}
                  {(campaignData.homebrew?.monsters || []).length > 0 && (
                    <h4 className="subsection-title"><i className="fas fa-hammer"></i> Custom Homebrew</h4>
                  )}
                  <div className="cards-grid">
                    {(campaignData.homebrew?.monsters || []).length > 0 ? (
                      (campaignData.homebrew?.monsters || []).map(monster => (
                        <div key={monster.id} className="content-card monster-card">
                          <div className="card-body">
                            <div className="integrated-header">
                              <input type="text" value={monster.name} onChange={(e) => updateHomebrewMonster(monster.id, { name: e.target.value })} className="card-title-input" />
                              <button className="remove-btn" onClick={() => removeHomebrewMonster(monster.id)}><i className="fas fa-times"></i></button>
                            </div>
                            <div className="field-row">
                              <select value={monster.size} onChange={(e) => updateHomebrewMonster(monster.id, { size: e.target.value })} className="small-select">
                                <option value="tiny">Tiny</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                                <option value="huge">Huge</option>
                              </select>
                              <select value={monster.type} onChange={(e) => updateHomebrewMonster(monster.id, { type: e.target.value })} className="small-select">
                                <option value="beast">Beast</option>
                                <option value="humanoid">Humanoid</option>
                                <option value="undead">Undead</option>
                                <option value="fiend">Fiend</option>
                                <option value="dragon">Dragon</option>
                                <option value="aberration">Aberration</option>
                              </select>
                            </div>
                            <div className="field-row">
                              <input type="text" value={monster.hp || ''} onChange={(e) => updateHomebrewMonster(monster.id, { hp: e.target.value })} placeholder="HP" className="small-input" />
                              <input type="text" value={monster.ac || ''} onChange={(e) => updateHomebrewMonster(monster.id, { ac: e.target.value })} placeholder="AC" className="tiny-input" />
                            </div>
                            <textarea value={monster.description} onChange={(e) => updateHomebrewMonster(monster.id, { description: e.target.value })} placeholder="Description, abilities..." rows={3} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state"><i className="fas fa-dragon"></i><p>No custom monsters yet.</p></div>
                    )}
                  </div>
                </div>
              )}

              {/* Spells */}
              {homebrewSubTab === 'spells' && (
                <div className="list-section">
                  <div className="section-header">
                    <h3>Campaign Spells</h3>
                    <div className="section-header-actions">
                      <button className="add-btn secondary" onClick={addSpellFromLibrary}>
                        <i className="fas fa-book"></i> Browse Library
                      </button>
                      <button className="add-btn" onClick={addHomebrewSpell}>
                        <i className="fas fa-plus"></i> Create Custom
                      </button>
                    </div>
                  </div>
                  
                  {/* Library Spells */}
                  {(campaignData.selectedSpells || []).length > 0 && (
                    <div className="library-items-section">
                      <h4 className="subsection-title"><i className="fas fa-book"></i> From Library</h4>
                      <div className="cards-grid">
                        {(campaignData.selectedSpells || []).map(spell => (
                          <div
                            key={spell.id}
                            className="content-card spell-card library-card"
                            onMouseEnter={(e) => handleMouseEnter(e, null, null, spell)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className="card-body">
                              <div className="integrated-header">
                                <span className={`library-badge`}><i className="fas fa-link"></i></span>
                                <span className="card-title-display">{spell.name}</span>
                                <span className="spell-level-badge">
                                  {spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`}
                                </span>
                                <button className="remove-btn" onClick={() => removeLibrarySpell(spell.id)}><i className="fas fa-times"></i></button>
                              </div>
                              <div className="library-item-info">
                                <span className="library-item-tag">{formatTag(spell.school || 'Spell')}</span>
                              </div>
                              <textarea
                                value={spell.notes || ''}
                                onChange={(e) => {
                                  const updated = (campaignData.selectedSpells || []).map(s =>
                                    s.id === spell.id ? { ...s, notes: e.target.value } : s
                                  );
                                  updateCampaignData({ selectedSpells: updated });
                                }}
                                placeholder="Campaign notes for this spell..."
                                rows={2}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Custom Homebrew Spells */}
                  {(campaignData.homebrew?.spells || []).length > 0 && (
                    <h4 className="subsection-title"><i className="fas fa-hammer"></i> Custom Homebrew</h4>
                  )}
                  <div className="cards-grid">
                    {(campaignData.homebrew?.spells || []).length > 0 ? (
                      (campaignData.homebrew?.spells || []).map(spell => (
                        <div key={spell.id} className="content-card spell-card">
                          <div className="card-body">
                            <div className="integrated-header">
                              <input type="text" value={spell.name} onChange={(e) => updateHomebrewSpell(spell.id, { name: e.target.value })} className="card-title-input" />
                              <span className="spell-level-badge">Lvl {spell.level}</span>
                              <button className="remove-btn" onClick={() => removeHomebrewSpell(spell.id)}><i className="fas fa-times"></i></button>
                            </div>
                            <div className="field-row">
                              <select value={spell.level} onChange={(e) => updateHomebrewSpell(spell.id, { level: parseInt(e.target.value) })} className="small-select">
                                {[0,1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>{l === 0 ? 'Cantrip' : `Level ${l}`}</option>)}
                              </select>
                              <select value={spell.school} onChange={(e) => updateHomebrewSpell(spell.id, { school: e.target.value })} className="small-select">
                                <option value="abjuration">Abjuration</option>
                                <option value="conjuration">Conjuration</option>
                                <option value="divination">Divination</option>
                                <option value="enchantment">Enchantment</option>
                                <option value="evocation">Evocation</option>
                                <option value="illusion">Illusion</option>
                                <option value="necromancy">Necromancy</option>
                                <option value="transmutation">Transmutation</option>
                              </select>
                            </div>
                            <div className="field-row">
                              <input type="text" value={spell.castingTime} onChange={(e) => updateHomebrewSpell(spell.id, { castingTime: e.target.value })} placeholder="Casting Time" className="small-input" />
                              <input type="text" value={spell.range} onChange={(e) => updateHomebrewSpell(spell.id, { range: e.target.value })} placeholder="Range" className="small-input" />
                            </div>
                            <textarea value={spell.description} onChange={(e) => updateHomebrewSpell(spell.id, { description: e.target.value })} placeholder="Spell effect description..." rows={3} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state"><i className="fas fa-hat-wizard"></i><p>No custom spells yet.</p></div>
                    )}
                  </div>
                </div>
              )}

              {/* Lore */}
              {homebrewSubTab === 'lore' && (
                <div className="list-section">
                  <div className="section-header">
                    <h3>World Lore</h3>
                    <button className="add-btn" onClick={addLoreArticle}>
                      <i className="fas fa-plus"></i> New Article
                    </button>
                  </div>
                  <div className="cards-list">
                    {(campaignData.homebrew?.lore || []).length > 0 ? (
                      (campaignData.homebrew?.lore || []).map(article => (
                        <div key={article.id} className="content-card lore-card">
                          <div className="card-body">
                            <div className="integrated-header">
                              <input type="text" value={article.title} onChange={(e) => updateLoreArticle(article.id, { title: e.target.value })} className="card-title-input" />
                              <select value={article.category} onChange={(e) => updateLoreArticle(article.id, { category: e.target.value })} className="small-select">
                              <option value="history">History</option>
                              <option value="religion">Religion</option>
                              <option value="faction">Faction</option>
                              <option value="legend">Legend</option>
                              <option value="culture">Culture</option>
                              <option value="geography">Geography</option>
                              <option value="magic">Magic</option>
                            </select>
                            <label className="secret-toggle">
                              <input type="checkbox" checked={article.isSecret || false} onChange={(e) => updateLoreArticle(article.id, { isSecret: e.target.checked })} />
                              <i className="fas fa-eye-slash"></i>
                            </label>
                            <button className="remove-btn" onClick={() => removeLoreArticle(article.id)}><i className="fas fa-times"></i></button>
                            </div>
                            <textarea value={article.content} onChange={(e) => updateLoreArticle(article.id, { content: e.target.value })} placeholder="Write your lore article here..." rows={6} />
                            <div className="field">
                              <label>Tags</label>
                              <input
                                type="text"
                                value={Array.isArray(article.tags) ? article.tags.join(', ') : ''}
                                onChange={(e) => updateLoreArticle(article.id, { tags: e.target.value ? e.target.value.split(',').map(t => t.trim()).filter(t => t) : [] })}
                                placeholder="Tags (comma-separated)..."
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state"><i className="fas fa-scroll"></i><p>No lore articles yet. Start building your world's history!</p></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tooltips */}
      {hoveredItem && (
        <TooltipPortal>
          <div
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              pointerEvents: 'none',
              zIndex: 999999999
            }}
          >
            <ItemTooltip item={hoveredItem} />
          </div>
        </TooltipPortal>
      )}
      {hoveredCreature && (
        <TooltipPortal>
          <div
            className="campaign-creature-tooltip-portal"
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              zIndex: 999999999,
              width: '280px'
            }}
          >
            <div
              ref={tooltipRef}
              className="campaign-creature-tooltip-interactive"
              onWheel={(e) => {
                // Stop propagation to prevent background scrolling when scrolling tooltip
                e.stopPropagation();
              }}
              onMouseEnter={() => {
                // Keep tooltip visible when hovering over it
                setHoveredCreature(hoveredCreature);
              }}
              onMouseLeave={() => {
                // Hide tooltip when leaving it
                setHoveredCreature(null);
              }}
            >
              <SimpleCreatureTooltip creature={hoveredCreature} />
            </div>
          </div>
        </TooltipPortal>
      )}
      {hoveredSpell && (
        <SpellTooltip 
          spell={hoveredSpell} 
          position={tooltipPosition}
        />
      )}
    </div>
  );
};

export default CampaignManager;
