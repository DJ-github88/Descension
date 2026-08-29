import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/CampaignManager.css';
import LibraryBrowserModal, { LIBRARY_TYPES as IMPORTED_LIBRARY_TYPES } from './LibraryBrowserModal';

const LIBRARY_TYPES = IMPORTED_LIBRARY_TYPES || {
  CREATURES: 'creatures',
  ITEMS: 'items',
  SPELLS: 'spells'
};
import ItemTooltip from '../item-generation/ItemTooltip';
import SimpleCreatureTooltip from '../creature-wizard/components/common/SimpleCreatureTooltip';
import SpellTooltip from '../spellcrafting-wizard/components/common/SpellTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { useTooltipPosition } from '../../components/common/useTooltipPosition';
import useCreatureStore from '../../store/creatureStore';
import useShareableStore from '../../store/shareableStore';
import useChatStore from '../../store/chatStore';
import campaignService from '../../services/campaignService';
import { showConfirm } from '../../utils/dialogService';
import { useCampaignPersistence } from '../../hooks/useCampaignPersistence';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { SPELL_DAMAGE_TYPES, getDamageType } from '../../data/damageTypes';
import RichLoreText from '../common/RichLoreText';
import CodexLoreEditor from '../common/CodexLoreEditor';
import RichCampaignEditor from '../common/RichCampaignEditor';
import ErrorBoundary from '../common/ErrorBoundary';
import CustomLineageWizard from '../world/CustomLineageWizard';
import useCustomLineageStore from '../../store/customLineageStore';
import { RACE_DATA } from '../../data/raceData';
import useWorldStore from '../../store/worldStore';
import useFactionStore from '../../store/factionStore';
import FamilyTreeStudio from '../world/FamilyTreeStudio';
import useFamilyTreeStore from '../../store/familyTreeStore';
import InteractiveMapStudio from '../world-map/InteractiveMapStudio';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import PlotConspiracyBoard from './PlotConspiracyBoard';
import { getIconUrl, getCreatureTokenIconUrl, getCustomIconUrl, getWowIconUrl } from '../../utils/assetManager';

// Access control configuration - can be modified to restrict access by subscription tier
export const CAMPAIGN_ACCESS_CONFIG = {
  allowedTiers: ['PRO', 'ULTIMATE', 'MYTHIC'],
  featureName: 'Campaign Manager'
};

export function canAccessCampaignManager(subscriptionTier) {
  if (!subscriptionTier) return false;
  const tierName = typeof subscriptionTier === 'object' ? subscriptionTier.id?.toUpperCase() : subscriptionTier?.toUpperCase();
  if (tierName === 'DEV_PREVIEW') return true;
  const legacyMap = { 'SUBSCRIBER': 'PRO', 'PREMIUM': 'ULTIMATE', 'DEMIURGE': 'MYTHIC', 'SOVEREIGN': 'MYTHIC' };
  const resolved = legacyMap[tierName] || tierName;
  return CAMPAIGN_ACCESS_CONFIG.allowedTiers.includes(resolved);
}

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

// Universal Entity Linker Picker Modal
const EntityLinkerModal = ({ isOpen, title, items = [], selectedIds = [], onToggle, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = (items || []).filter(item => {
    const name = item?.name || item?.title || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return ReactDOM.createPortal(
    <div className="campaign-modal-overlay" onClick={onClose}>
      <div className="campaign-modal-content entity-linker-modal-content" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter available entries..."
          className="entity-picker-search"
          autoFocus
        />
        <div className="entity-picker-grid">
          {filtered.length > 0 ? (
            filtered.map(item => {
              const isSelected = selectedIds.some(id => String(id) === String(item.id));
              return (
                <div
                  key={item.id}
                  className={`entity-picker-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onToggle(item.id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    style={{ pointerEvents: 'none' }}
                  />
                  {item.icon ? (
                    <img src={item.icon} alt="" className="entity-picker-thumb" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <i className={`fas ${item.faIcon || 'fa-tag'}`} style={{ color: '#d4af37', fontSize: '14px', width: '20px' }}></i>
                  )}
                  <div className="entity-picker-meta">
                    <span className="entity-picker-title">{item.name || item.title}</span>
                    <span className="entity-picker-subtitle">{item.type || item.category || item.rarity || item.threat || 'Entity'}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ gridColumn: '1 / -1', color: '#8b5a1a', fontStyle: 'italic', padding: '10px 0', fontSize: '0.9rem' }}>
              No entities found. Create or select custom entries in the Campaign or World tab first!
            </p>
          )}
        </div>
        <div className="campaign-modal-actions">
          <button type="button" className="campaign-modal-btn confirm" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const CampaignManager = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const secParam = sp.get('section');
      const validSections = ['overview', 'sessions', 'npcs', 'locations', 'quests', 'plots', 'homebrew'];
      if (secParam && validSections.includes(secParam)) {
        return secParam;
      }
    }
    return 'overview';
  });

  // Sync activeSection when URL search parameters change (Back/Forward navigation)
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const secParam = sp.get('section');
    const validSections = ['overview', 'sessions', 'npcs', 'locations', 'quests', 'plots', 'homebrew'];
    if (secParam && validSections.includes(secParam)) {
      setActiveSection(secParam);
    }
  }, [location.search]);

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
    const sp = new URLSearchParams(window.location.search);
    sp.set('tab', 'campaigns');
    sp.set('section', sectionId);
    navigate(`/account?${sp.toString()}`, { replace: false });
  }, [navigate]);
  const [homebrewSubTab, setHomebrewSubTab] = useState('items');
  const [lineageViewMode, setLineageViewMode] = useState('species'); // 'species' | 'family_trees'
  const [locationViewMode, setLocationViewMode] = useState('cards');
  const [locationCardTabs, setLocationCardTabs] = useState({});
  const [selectedAtlasLocationId, setSelectedAtlasLocationId] = useState(null); // 'cards' | 'graph'
  const [atlasSearch, setAtlasSearch] = useState('');
  const [atlasTypeFilter, setAtlasTypeFilter] = useState('all');

  // Plot Thread state
  const [plotViewMode, setPlotViewMode] = useState('timeline'); // 'timeline' | 'cards' | 'matrix'
  const [plotCardTabs, setPlotCardTabs] = useState({});
  const [plotFilterType, setPlotFilterType] = useState('all');
  const [plotFilterStatus, setPlotFilterStatus] = useState('all');
  const [plotSearchQuery, setPlotSearchQuery] = useState('');
  const [selectedTimelinePlotId, setSelectedTimelinePlotId] = useState('all');

  // Quest state & filtering
  const [questFilterType, setQuestFilterType] = useState('all');
  const [questFilterStatus, setQuestFilterStatus] = useState('all');
  const [questFilterNPC, setQuestFilterNPC] = useState('all');
  const [questFilterLocation, setQuestFilterLocation] = useState('all');
  const [questSearchQuery, setQuestSearchQuery] = useState('');

  // Modal state
  const [inputModal, setInputModal] = useState({ isOpen: false, title: '', placeholder: '', callback: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', callback: null });
  const [linkerModal, setLinkerModal] = useState({ isOpen: false, title: '', items: [], selectedIds: [], onSelect: null });

  // Library browser state
  const [libraryBrowser, setLibraryBrowser] = useState({
    isOpen: false,
    libraryType: LIBRARY_TYPES.CREATURES,
    title: '',
    onSelect: null
  });

  // Tooltip & Notes state
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredCreature, setHoveredCreature] = useState(null);
  const [hoveredSpell, setHoveredSpell] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { adjustedPosition, tooltipRef: positionTooltipRef } = useTooltipPosition(mousePosition, !!(hoveredItem || hoveredCreature || hoveredSpell));
  const tooltipDelayRef = useRef(null);
  const tooltipRef = useRef(null);

  const toggleNote = (id) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper functions for compendium library icons & formatting
  const resolveLibraryItemIcon = (item) => {
    if (!item) return getIconUrl('inv_misc_questionmark', 'items');
    const iconId = item.icon || item.iconId;
    if (iconId && (iconId.includes('/') || iconId.includes('\\'))) {
      return getCustomIconUrl(iconId, 'items');
    }
    return getIconUrl(iconId || 'inv_misc_questionmark', 'items');
  };

  const resolveLibraryCreatureIcon = (creature) => {
    if (!creature) return getCreatureTokenIconUrl('inv_misc_questionmark', 'beast');
    return getCreatureTokenIconUrl(
      creature.tokenIcon || creature.icon || creature.image || 'inv_misc_questionmark',
      creature.type || 'beast'
    );
  };

  const resolveLibrarySpellIcon = (spell) => {
    if (!spell) return getCustomIconUrl('Utility/Utility', 'abilities');
    const iconId = spell?.typeConfig?.icon || spell?.icon || spell?.iconId || spell?.damageConfig?.icon || spell?.healingConfig?.icon;
    if (!iconId) return getCustomIconUrl('Utility/Utility', 'abilities');
    if (typeof iconId === 'string' && iconId.startsWith('/assets/')) return iconId;
    if (iconId.includes('/') && !iconId.startsWith('http')) {
      return getCustomIconUrl(iconId, 'abilities');
    }
    if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
      return getAbilityIconUrl(iconId);
    }
    return getIconUrl(iconId, 'abilities');
  };

  const getSpellBadgeType = (spell) => {
    const raw = (spell?.type || spell?.spellType || '').toUpperCase();
    if (raw === 'REACTION') return 'REACTION';
    if (raw === 'PASSIVE') return 'PASSIVE';
    if (raw === 'FREE_ACTION' || raw === 'FREE ACTION') return 'FREE ACTION';
    const desc = (spell?.description || '').toLowerCase();
    if (/^(as a )?reaction/i.test(desc) || /reaction\s*\(/i.test(desc)) return 'REACTION';
    if (/^passive/i.test(desc)) return 'PASSIVE';
    return 'ACTION';
  };

  const getItemQualityClass = (quality) => {
    const q = (quality || 'common').toLowerCase();
    const valid = ['poor', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact'];
    return valid.includes(q) ? `quality-${q}` : 'quality-common';
  };

  const getItemTypeIcon = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'weapon': return 'fa-gavel';
      case 'armor': return 'fa-shield-halved';
      case 'consumable': return 'fa-flask';
      case 'accessory': return 'fa-gem';
      case 'tool': return 'fa-wrench';
      case 'wondrous': return 'fa-hat-wizard';
      default: return 'fa-box-open';
    }
  };

  const getCreatureFamilyIcon = (family) => {
    switch ((family || '').toLowerCase()) {
      case 'dragon': return 'fa-dragon';
      case 'undead': return 'fa-skull';
      case 'fiend': return 'fa-fire';
      case 'humanoid': return 'fa-user-shield';
      case 'aberration': return 'fa-eye';
      case 'construct': return 'fa-robot';
      case 'elemental': return 'fa-wind';
      case 'plant': return 'fa-seedling';
      case 'fey': return 'fa-leaf';
      case 'giant': return 'fa-mountain';
      case 'celestial': return 'fa-sun';
      case 'beast':
      default: return 'fa-paw';
    }
  };

  const getSpellSchoolIcon = (school) => {
    switch ((school || '').toLowerCase()) {
      case 'ember':
      case 'fire': return 'fa-fire';
      case 'rime':
      case 'frost':
      case 'ice': return 'fa-snowflake';
      case 'shock':
      case 'lightning': return 'fa-bolt';
      case 'void':
      case 'shadow': return 'fa-moon';
      case 'radiant':
      case 'holy': return 'fa-sun';
      case 'nature':
      case 'poison':
      case 'acid': return 'fa-leaf';
      case 'arcane':
      default: return 'fa-wand-magic-sparkles';
    }
  };

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
      setMousePosition({ x: e.clientX, y: e.clientY });
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
      setMousePosition({ x: e.clientX, y: e.clientY });
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

  // Media uploads (banners, portraits, maps) → Firebase Storage for auth users
  const { uploadImage, removeImage } = useMediaUpload();

  const handleMediaUpload = async (file, category, apply) => {
    if (!file) return;
    try {
      const url = await uploadImage(file, category);
      if (url) apply(url);
    } catch (err) {
      console.error('Media upload failed:', err);
      alert(err.message || 'Image upload failed. Please try a smaller file.');
    }
  };

  const handleMediaRemove = (existingUrl, apply) => {
    if (existingUrl) removeImage(existingUrl).catch((err) => console.warn('Failed to remove cloud media:', err));
    apply();
  };

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

  // Universal entity accessors with source tagging
  const getAllCampaignItems = () => [
    ...(campaignData.selectedItems || []).map(i => ({ ...i, icon: resolveLibraryItemIcon(i), _source: 'Library', _badgeColor: '#c59b3f' })),
    ...(campaignData.homebrew?.items || []).map(i => ({ ...i, faIcon: getItemTypeIcon(i.type), _source: 'Homebrew', _badgeColor: '#9b59b6' }))
  ];

  const getAllCampaignCreatures = () => [
    ...(campaignData.selectedCreatures || []).map(c => ({ ...c, icon: resolveLibraryCreatureIcon(c), _source: 'Library', _badgeColor: '#c59b3f' })),
    ...(campaignData.homebrew?.monsters || []).map(m => ({ ...m, faIcon: getCreatureFamilyIcon(m.type), _source: 'Homebrew', _badgeColor: '#9b59b6' }))
  ];

  const getAllCampaignSpells = () => [
    ...(campaignData.selectedSpells || []).map(s => ({ ...s, icon: resolveLibrarySpellIcon(s), _source: 'Library', _badgeColor: '#c59b3f' })),
    ...(campaignData.homebrew?.spells || []).map(s => ({ ...s, faIcon: getSpellSchoolIcon(s.school), _source: 'Homebrew', _badgeColor: '#9b59b6' }))
  ];

  const getAllCampaignLore = () => [
    ...(campaignData.homebrew?.lore || []).map(l => ({ ...l, faIcon: 'fa-scroll', _source: 'Homebrew', _badgeColor: '#3498db' }))
  ];

  const getAllCampaignNPCs = () => [
    ...(campaignData.npcs || []).map(n => ({ ...n, icon: n.image, faIcon: 'fa-user', _source: 'NPC', _badgeColor: '#2ecc71' }))
  ];

  const getAllCampaignLocations = () => [
    ...(campaignData.locations || []).map(loc => ({ ...loc, icon: loc.image, faIcon: 'fa-map-marker-alt', _source: 'Location', _badgeColor: '#e67e22' }))
  ];

  const getAllCampaignQuests = () => [
    ...(campaignData.quests || []).map(q => ({ ...q, faIcon: 'fa-scroll', _source: q.priority ? `${q.priority.toUpperCase()} Priority` : 'Quest', _badgeColor: '#f39c12' }))
  ];

  const getAllCampaignPlotThreads = () => [
    ...(campaignData.plotThreads || []).map(p => ({
      ...p,
      icon: p.image,
      faIcon: p.type === 'character' ? 'fa-user-ninja' : p.type === 'faction' ? 'fa-shield-halved' : p.type === 'world' ? 'fa-meteor' : p.type === 'side' ? 'fa-magnifying-glass' : 'fa-crown',
      _source: p.type ? `${p.type.toUpperCase()} Thread` : 'Plot Thread',
      _badgeColor: '#8e44ad'
    }))
  ];

  const getLinkedItems = (ids = []) => {
    const all = getAllCampaignItems();
    return (ids || []).map(id => all.find(i => String(i.id) === String(id))).filter(Boolean);
  };

  const getLinkedCreatures = (ids = []) => {
    const all = getAllCampaignCreatures();
    return (ids || []).map(id => all.find(c => String(c.id) === String(id))).filter(Boolean);
  };

  const getLinkedSpells = (ids = []) => {
    const all = getAllCampaignSpells();
    return (ids || []).map(id => all.find(s => String(s.id) === String(id))).filter(Boolean);
  };

  const getLinkedLore = (ids = []) => {
    const all = getAllCampaignLore();
    return (ids || []).map(id => all.find(l => String(l.id) === String(id))).filter(Boolean);
  };

  const getLinkedNPCs = (ids = []) => {
    const all = getAllCampaignNPCs();
    return (ids || []).map(id => all.find(n => String(n.id) === String(id))).filter(Boolean);
  };

  const getLinkedLocations = (ids = []) => {
    const all = getAllCampaignLocations();
    return (ids || []).map(id => all.find(l => String(l.id) === String(id))).filter(Boolean);
  };

  const getLinkedQuests = (ids = []) => {
    const all = getAllCampaignQuests();
    return (ids || []).map(id => all.find(q => String(q.id) === String(id))).filter(Boolean);
  };

  const getLinkedQuestsForNPC = (npc) => {
    if (!npc) return [];
    const directIds = npc.questIds || [];
    const allQuests = getAllCampaignQuests();
    return allQuests.filter(q =>
      directIds.some(id => String(id) === String(q.id)) ||
      (q.npcIds || []).some(id => String(id) === String(npc.id)) ||
      String(q.giverNpcId) === String(npc.id)
    );
  };

  const getLinkedQuestsForLocation = (location) => {
    if (!location) return [];
    const directIds = location.questIds || [];
    const allQuests = getAllCampaignQuests();
    return allQuests.filter(q =>
      directIds.some(id => String(id) === String(q.id)) ||
      (q.locationIds || []).some(id => String(id) === String(location.id)) ||
      String(q.primaryLocationId) === String(location.id)
    );
  };

  const getLinkedPlotThreads = (ids = []) => {
    const all = getAllCampaignPlotThreads();
    return (ids || []).map(id => all.find(p => String(p.id) === String(id))).filter(Boolean);
  };

  const openLinkerModal = (title, items, currentIds = [], onSave, onBrowseLibrary = null, onCreateHomebrew = null) => {
    setLinkerModal({
      isOpen: true,
      title,
      items,
      selectedIds: [...(currentIds || [])],
      onBrowseLibrary,
      onCreateHomebrew,
      onToggle: (id) => {
        setLinkerModal(prev => {
          const exists = prev.selectedIds.some(existingId => String(existingId) === String(id));
          const updated = exists ? prev.selectedIds.filter(existingId => String(existingId) !== String(id)) : [...prev.selectedIds, id];
          if (onSave) onSave(updated);
          return { ...prev, selectedIds: updated };
        });
      }
    });
  };

  // Location direct add & link handlers (Library / Homebrew / Quests / Lore / NPCs)
  const addCreatureToLocationFromLibrary = (locationId) => {
    openLibraryBrowser(LIBRARY_TYPES.CREATURES, 'Add Creature to Location', (selected) => {
      const items = Array.isArray(selected) ? selected : [selected];
      const newCreatures = items.map(creature => ({
        id: `lib-${creature.id}-${Date.now()}`,
        libraryId: creature.id,
        ...creature,
        notes: '',
        isFromLibrary: true
      }));
      const newIds = newCreatures.map(c => c.id);
      const loc = (campaignData.locations || []).find(l => l.id === locationId);
      const updatedLocMonsterIds = Array.from(new Set([...(loc?.monsterIds || []), ...newIds]));

      updateCampaignData({
        selectedCreatures: [...(campaignData.selectedCreatures || []), ...newCreatures],
        locations: (campaignData.locations || []).map(l => l.id === locationId ? { ...l, monsterIds: updatedLocMonsterIds } : l)
      });
    });
  };

  const addCustomCreatureToLocation = (locationId) => {
    showInputModal('Create Inhabitant / Monster', 'Monster name (e.g. Frost Crypt Guardian)...', (monsterName) => {
      if (!monsterName || !monsterName.trim()) return;
      const newMonster = {
        id: Date.now(),
        name: monsterName.trim(),
        type: 'humanoid',
        threat: 'Standard',
        cr: '1',
        hp: 30,
        mana: 10,
        ap: 3,
        speed: '30 ft.',
        description: '',
        notes: '',
        isCustom: true
      };
      const loc = (campaignData.locations || []).find(l => l.id === locationId);
      const updatedLocMonsterIds = [...(loc?.monsterIds || []), newMonster.id];

      updateCampaignData({
        homebrew: { ...campaignData.homebrew, monsters: [...(campaignData.homebrew?.monsters || []), newMonster] },
        locations: (campaignData.locations || []).map(l => l.id === locationId ? { ...l, monsterIds: updatedLocMonsterIds } : l)
      });
    });
  };

  const addItemToLocationFromLibrary = (locationId) => {
    openLibraryBrowser(LIBRARY_TYPES.ITEMS, 'Add Loot to Location', (selected) => {
      const items = Array.isArray(selected) ? selected : [selected];
      const newItems = items.map(item => ({
        id: `lib-${item.id}-${Date.now()}`,
        libraryId: item.id,
        ...item,
        iconId: item.iconId || item.icon,
        icon: item.icon || item.iconId,
        notes: '',
        isFromLibrary: true
      }));
      const newIds = newItems.map(i => i.id);
      const loc = (campaignData.locations || []).find(l => l.id === locationId);
      const updatedLocLootIds = Array.from(new Set([...(loc?.lootIds || []), ...newIds]));

      updateCampaignData({
        selectedItems: [...(campaignData.selectedItems || []), ...newItems],
        locations: (campaignData.locations || []).map(l => l.id === locationId ? { ...l, lootIds: updatedLocLootIds } : l)
      });
    });
  };

  const addCustomItemToLocation = (locationId) => {
    showInputModal('Create Chamber Loot / Relic', 'Item name (e.g. Sunforged Key)...', (itemName) => {
      if (!itemName || !itemName.trim()) return;
      const newItem = {
        id: Date.now(),
        name: itemName.trim(),
        type: 'wondrous',
        rarity: 'rare',
        quality: 'rare',
        description: '',
        properties: '',
        effects: '',
        notes: '',
        isCustom: true
      };
      const loc = (campaignData.locations || []).find(l => l.id === locationId);
      const updatedLocLootIds = [...(loc?.lootIds || []), newItem.id];

      updateCampaignData({
        homebrew: { ...campaignData.homebrew, items: [...(campaignData.homebrew?.items || []), newItem] },
        locations: (campaignData.locations || []).map(l => l.id === locationId ? { ...l, lootIds: updatedLocLootIds } : l)
      });
    });
  };

  const addQuestToLocation = (locationId) => {
    const loc = (campaignData.locations || []).find(l => l.id === locationId);
    showInputModal(`New Quest at ${loc?.name || 'Location'}`, 'Quest title...', (questTitle) => {
      if (!questTitle || !questTitle.trim()) return;
      const newQuest = {
        id: Date.now(),
        title: questTitle.trim(),
        type: 'side',
        status: 'not-started',
        priority: 'medium',
        location: loc?.name || '',
        giver: '',
        description: `Quest taking place in or around ${loc?.name || 'this location'}.`,
        objectives: [{ id: Date.now() + 1, text: 'Investigate the area', completed: false }],
        rewards: '',
        notes: ''
      };
      const updatedLocQuestIds = [...(loc?.questIds || []), newQuest.id];

      updateCampaignData({
        quests: [...(campaignData.quests || []), newQuest],
        locations: (campaignData.locations || []).map(l => l.id === locationId ? { ...l, questIds: updatedLocQuestIds } : l)
      });
    });
  };

  const addLoreToLocation = (locationId) => {
    const loc = (campaignData.locations || []).find(l => l.id === locationId);
    showInputModal(`New Inscription / Lore for ${loc?.name || 'Location'}`, 'Article / Inscription title...', (artTitle) => {
      if (!artTitle || !artTitle.trim()) return;
      const newArticle = {
        id: Date.now(),
        title: artTitle.trim(),
        category: 'locations',
        content: `Historical records and discoveries regarding ${loc?.name || 'this location'}.`,
        tags: [loc?.name || 'location'],
        isSecret: false,
        notes: ''
      };
      const updatedLocLoreIds = [...(loc?.loreIds || []), newArticle.id];

      updateCampaignData({
        homebrew: { ...campaignData.homebrew, lore: [...(campaignData.homebrew?.lore || []), newArticle] },
        locations: (campaignData.locations || []).map(l => l.id === locationId ? { ...l, loreIds: updatedLocLoreIds } : l)
      });
    });
  };

  const addSubLocationToLocation = (parentLocationId) => {
    const parent = (campaignData.locations || []).find(l => l.id === parentLocationId);
    showInputModal(`Add Sub-Location to ${parent?.name || 'Location'}`, 'Sub-location name (e.g. The Drunken Dragon Tavern, Crypt of Shadows)...', (subLocName) => {
      if (!subLocName || !subLocName.trim()) return;
      const newSubLoc = {
        id: Date.now(),
        name: subLocName.trim(),
        type: 'landmark',
        parentId: parentLocationId,
        region: parent?.region || parent?.name || '',
        description: `Sub-location located inside or belonging to ${parent?.name || 'parent location'}.`,
        notableFeatures: '',
        lootIds: [],
        monsterIds: [],
        questIds: [],
        loreIds: [],
        npcIds: [],
        connectedLocationIds: []
      };
      const updatedParentSubIds = [...(parent?.subLocationIds || []), newSubLoc.id];

      updateCampaignData({
        locations: [
          ...(campaignData.locations || []).map(l => l.id === parentLocationId ? { ...l, subLocationIds: updatedParentSubIds } : l),
          newSubLoc
        ]
      });
    });
  };

  const addNPCToLocation = (locationId) => {
    const loc = (campaignData.locations || []).find(l => l.id === locationId);
    showInputModal(`New NPC at ${loc?.name || 'Location'}`, 'NPC name...', (npcName) => {
      if (!npcName || !npcName.trim()) return;
      const newNPC = {
        id: Date.now(),
        name: npcName.trim(),
        location: loc?.name || '',
        relationship: 'neutral',
        plotRelevance: 'minor',
        description: '',
        notes: '',
        status: 'alive'
      };
      const updatedLocNPCIds = [...(loc?.npcIds || []), newNPC.id];

      updateCampaignData({
        npcs: [...(campaignData.npcs || []), newNPC],
        locations: (campaignData.locations || []).map(l => l.id === locationId ? { ...l, npcIds: updatedLocNPCIds } : l)
      });
    });
  };

  const closeLinkerModal = () => {
    setLinkerModal(prev => ({ ...prev, isOpen: false }));
  };

  // Live in-game / account actions for Session Dossier
  const handleSpawnSessionEncounters = (session) => {
    const creatures = getLinkedCreatures(session.monsterIds);
    if (creatures.length === 0) {
      alert('No encounter monsters linked to this session.');
      return;
    }

    const creatureStore = useCreatureStore.getState();
    if (creatureStore?.addToken) {
      creatures.forEach((c, idx) => {
        creatureStore.addToken({
          id: `token_${Date.now()}_${idx}`,
          name: c.name,
          type: c.type || 'beast',
          threat: c.threat || 'Standard',
          hp: c.hp || 30,
          maxHp: c.hp || 30,
          mana: c.mana || 10,
          maxMana: c.mana || 10,
          ap: c.ap ?? 3,
          x: 10 + (idx % 3) * 2,
          y: 10 + Math.floor(idx / 3) * 2,
          tokenIcon: c.tokenIcon || c.icon || 'inv_misc_questionmark'
        });
      });
      alert(`Successfully spawned ${creatures.length} encounter tokens directly onto the active VTT Canvas!`);
    } else {
      alert(`${creatures.length} encounter creature(s) prepped and ready for live game!`);
    }
  };

  const handleDropSessionLoot = (session) => {
    const items = getLinkedItems(session.lootIds);
    if (items.length === 0) {
      alert('No loot items linked to this session.');
      return;
    }

    const chatStore = useChatStore.getState();
    const itemListText = items.map(i => `${i.name} (${i.rarity || i.quality || 'Common'})`).join(', ');
    if (chatStore?.addNotification) {
      chatStore.addNotification({
        type: 'loot',
        sender: 'Campaign Director',
        text: `Party Loot Uncovered: ${itemListText}`,
        timestamp: Date.now()
      });
      alert(`Broadcasted ${items.length} loot item(s) to party chat!`);
    } else {
      alert(`Loot: ${itemListText}`);
    }
  };

  const handleRevealSessionHandouts = (session) => {
    const loreArticles = getLinkedLore(session.loreIds);
    if (loreArticles.length === 0) {
      alert('No lore articles or handouts linked to this session.');
      return;
    }

    const shareableStore = useShareableStore.getState();
    loreArticles.forEach(art => {
      if (shareableStore?.showToPlayers) {
        shareableStore.showToPlayers({
          id: art.id,
          title: art.title,
          content: art.content || art.description || '',
          category: art.category || 'lore'
        });
      }
    });
    alert(`Revealed ${loreArticles.length} handout(s) to the party display!`);
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
        ...spell,
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
      const removedNPC = campaignData.npcs.find(npc => npc.id === npcId);
      if (removedNPC?.image) {
        removeImage(removedNPC.image).catch((err) => console.warn('Failed to remove NPC media:', err));
      }
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
      const removedLocation = campaignData.locations.find(location => location.id === locationId);
      if (removedLocation?.image) {
        removeImage(removedLocation.image).catch((err) => console.warn('Failed to remove location media:', err));
      }
      updateCampaignData({ locations: campaignData.locations.filter(loc => loc.id !== locationId) });
    });
  };

  // ============ PLOT THREAD MANAGEMENT ============
  const addPlotThread = (defaultType = 'main') => {
    showInputModal('New Plot Thread', 'Enter plot thread title...', (plotTitle) => {
      const typeStr = typeof defaultType === 'string' ? defaultType : 'main';
      const newPlot = {
        id: Date.now(),
        title: plotTitle,
        type: typeStr, // main, character, faction, world, side
        description: '',
        status: 'active', // active, on-hold, resolved, abandoned
        priority: 'medium', // low, medium, high, critical
        stage: 'Act 1: Inciting Incident',
        gmSecrets: '',
        questIds: [],
        npcIds: [],
        locationIds: [],
        loreIds: [],
        itemIds: [],
        monsterIds: [],
        relatedNPCs: [],
        relatedLocations: [],
        beats: [
          {
            id: `beat-${Date.now()}-1`,
            title: 'Inciting Incident / Hook',
            description: 'The party discovers the initial clue or encounter that initiates this thread.',
            type: 'hook', // hook, clue, encounter, revelation, decision, climax, resolution
            status: 'completed', // completed, active, pending, failed
            questId: '',
            locationId: '',
            npcId: ''
          },
          {
            id: `beat-${Date.now()}-2`,
            title: 'Investigation & Rising Stakes',
            description: 'Exploring leads, uncovering conspiracies, and confronting escalating opposition.',
            type: 'clue',
            status: 'active',
            questId: '',
            locationId: '',
            npcId: ''
          },
          {
            id: `beat-${Date.now()}-3`,
            title: 'Climax & Confrontation',
            description: 'Final battle, revelation, or high-stakes choice deciding the outcome.',
            type: 'climax',
            status: 'pending',
            questId: '',
            locationId: '',
            npcId: ''
          }
        ],
        notes: ''
      };
      updateCampaignData({ plotThreads: [...(campaignData.plotThreads || []), newPlot] });
    });
  };

  const updatePlotThread = (plotId, updates) => {
    updateCampaignData({
      plotThreads: (campaignData.plotThreads || []).map(p => p.id === plotId ? { ...p, ...updates } : p)
    });
  };

  const removePlotThread = (plotId) => {
    showConfirmModal('Remove Plot Thread', 'Are you sure you want to remove this plot thread?', () => {
      const removedPlot = (campaignData.plotThreads || []).find(plot => plot.id === plotId);
      if (removedPlot?.image) {
        removeImage(removedPlot.image).catch((err) => console.warn('Failed to remove plot media:', err));
      }
      updateCampaignData({ plotThreads: (campaignData.plotThreads || []).filter(p => p.id !== plotId) });
    });
  };

  const addPlotBeat = (plotId, type = 'clue') => {
    const plot = (campaignData.plotThreads || []).find(p => p.id === plotId);
    if (!plot) return;
    const currentBeats = plot.beats || [];
    const newBeat = {
      id: `beat-${Date.now()}`,
      title: `Story Beat ${currentBeats.length + 1}`,
      description: '',
      type, // hook, clue, encounter, revelation, decision, climax, resolution
      status: 'pending',
      questId: '',
      locationId: '',
      npcId: ''
    };
    updatePlotThread(plotId, { beats: [...currentBeats, newBeat] });
  };

  const updatePlotBeat = (plotId, beatId, updates) => {
    const plot = (campaignData.plotThreads || []).find(p => p.id === plotId);
    if (!plot) return;
    const updatedBeats = (plot.beats || []).map(b => b.id === beatId ? { ...b, ...updates } : b);
    updatePlotThread(plotId, { beats: updatedBeats });
  };

  const removePlotBeat = (plotId, beatId) => {
    const plot = (campaignData.plotThreads || []).find(p => p.id === plotId);
    if (!plot) return;
    const updatedBeats = (plot.beats || []).filter(b => b.id !== beatId);
    updatePlotThread(plotId, { beats: updatedBeats });
  };

  const movePlotBeat = (plotId, beatId, direction) => {
    const plot = (campaignData.plotThreads || []).find(p => p.id === plotId);
    if (!plot || !plot.beats) return;
    const index = plot.beats.findIndex(b => b.id === beatId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= plot.beats.length) return;
    const newBeats = [...plot.beats];
    const temp = newBeats[index];
    newBeats[index] = newBeats[targetIndex];
    newBeats[targetIndex] = temp;
    updatePlotThread(plotId, { beats: newBeats });
  };

  // ============ QUEST MANAGEMENT ============
  const addQuest = () => {
    showInputModal('New Quest', 'Enter quest title...', (questTitle) => {
      const newQuest = {
        id: Date.now(),
        title: questTitle,
        description: '',
        type: 'side', // main, side, bounty, personal
        status: 'not-started', // not-started, in-progress, completed, failed
        priority: 'medium',
        giver: '',
        giverNpcId: '',
        location: '',
        primaryLocationId: '',
        npcIds: [],
        locationIds: [],
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
      updateCampaignData({
        quests: (campaignData.quests || []).filter(q => q.id !== questId),
        npcs: (campaignData.npcs || []).map(n => ({
          ...n,
          questIds: (n.questIds || []).filter(id => String(id) !== String(questId))
        })),
        locations: (campaignData.locations || []).map(l => ({
          ...l,
          questIds: (l.questIds || []).filter(id => String(id) !== String(questId))
        })),
        plotThreads: (campaignData.plotThreads || []).map(p => ({
          ...p,
          questIds: (p.questIds || []).filter(id => String(id) !== String(questId))
        }))
      });
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
        threat: 'Standard',
        description: '',
        hp: 30,
        mana: 10,
        ap: 3,
        speed: '30 ft.',
        resistances: '',
        weaknesses: '',
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
        school: 'ember',
        apCost: 2,
        manaCost: 15,
        castingTime: '1 Action',
        range: '30 ft.',
        damage: '2d6 Ember',
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
    { id: 'dynasties', label: 'Dynasty Trees', icon: 'fa-crown' },
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

      {/* Entity Linker Picker Modal */}
      <EntityLinkerModal
        isOpen={linkerModal.isOpen}
        title={linkerModal.title}
        items={linkerModal.items}
        selectedIds={linkerModal.selectedIds}
        onToggle={linkerModal.onToggle}
        onClose={closeLinkerModal}
        onBrowseLibrary={linkerModal.onBrowseLibrary}
        onCreateHomebrew={linkerModal.onCreateHomebrew}
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
            onClick={() => handleSectionChange(section.id)}
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

              <div className="overview-card stats-card campaign-stats-card">
                <h3>Campaign Stats</h3>
                <div className="quick-stats campaign-quick-stats">
                  <div className="stat-item campaign-stat-item">
                    <span className="stat-value campaign-stat-val">{campaignData.currentSession}</span>
                    <span className="stat-label campaign-stat-lbl">Session</span>
                  </div>
                  <div className="stat-item campaign-stat-item">
                    <span className="stat-value campaign-stat-val">{campaignData.players.length}</span>
                    <span className="stat-label campaign-stat-lbl">Players</span>
                  </div>
                  <div className="stat-item campaign-stat-item">
                    <span className="stat-value campaign-stat-val">{campaignData.npcs.length}</span>
                    <span className="stat-label campaign-stat-lbl">NPCs</span>
                  </div>
                  <div className="stat-item campaign-stat-item">
                    <span className="stat-value campaign-stat-val">{campaignData.locations.length}</span>
                    <span className="stat-label campaign-stat-lbl">Locations</span>
                  </div>
                  <div className="stat-item campaign-stat-item">
                    <span className="stat-value campaign-stat-val">{campaignData.plotThreads.length}</span>
                    <span className="stat-label campaign-stat-lbl">Plots</span>
                  </div>
                  <div className="stat-item campaign-stat-item">
                    <span className="stat-value campaign-stat-val">
                      {(campaignData.homebrew?.items?.length || 0) +
                        (campaignData.homebrew?.monsters?.length || 0) +
                        (campaignData.homebrew?.spells?.length || 0) +
                        (campaignData.homebrew?.lore?.length || 0)}
                    </span>
                    <span className="stat-label campaign-stat-lbl">Homebrew</span>
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
                  {(campaignData.players || []).length > 0 ? (
                    (campaignData.players || []).map(player => (
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

        {/* ============ SESSIONS & SCENARIO DIRECTOR ============ */}
        {activeSection === 'sessions' && (
          <div className="list-section">
            <div className="section-header">
              <div>
                <h3>Session & Scenario Director</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8b5a1a' }}>
                  Assemble locations, encounters, loot caches, and handouts for active gameplay.
                </p>
              </div>
              <button className="add-btn" onClick={addSession}>
                <i className="fas fa-plus"></i> New Session Plan
              </button>
            </div>
            <div className="cards-list">
              {(campaignData.sessions || []).length > 0 ? (
                (campaignData.sessions || []).map(session => (
                  <div key={session.id} className="content-card session-dossier-card">
                    {/* Header */}
                    <div className="session-dossier-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <span className="session-dossier-badge">Session #{session.number}</span>
                        <input
                          type="text"
                          value={session.title}
                          onChange={(e) => updateSession(session.id, { title: e.target.value })}
                          className="card-title-input"
                          style={{ flex: 1 }}
                          placeholder="Session Title..."
                        />
                      </div>
                      <div className="session-dossier-header-actions">
                        <input
                          type="date"
                          value={session.date}
                          onChange={(e) => updateSession(session.id, { date: e.target.value })}
                          className="session-date-input"
                        />
                        <select
                          value={session.status || 'planned'}
                          onChange={(e) => updateSession(session.id, { status: e.target.value })}
                          className={`session-status-select ${session.status || 'planned'}`}
                        >
                          <option value="planned">Planned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button className="remove-card-btn" onClick={() => removeSession(session.id)} title="Delete Session">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>

                    {/* Command Strip: Location & Quests */}
                    <div className="session-dossier-command-strip">
                      <div className="dossier-command-field">
                        <label><i className="fas fa-map-location-dot"></i> Primary Target Location</label>
                        <div className="dossier-select-wrapper">
                          <select
                            value={session.primaryLocationId || ''}
                            onChange={(e) => updateSession(session.id, { primaryLocationId: e.target.value })}
                            className="card-field-select"
                            style={{ flex: 1 }}
                          >
                            <option value="">-- Select Target Location --</option>
                            {(campaignData.locations || []).map(loc => (
                              <option key={loc.id} value={loc.id}>{loc.name} {loc.region ? `(${loc.region})` : ''}</option>
                            ))}
                          </select>
                          {session.primaryLocationId && (
                            <button
                              type="button"
                              className="dossier-trigger-action-btn"
                              style={{ padding: '6px 10px', background: '#3498db' }}
                              onClick={() => {
                                const loc = (campaignData.locations || []).find(l => String(l.id) === String(session.primaryLocationId));
                                const pins = useInteractiveMapStore.getState().pins;
                                const matchingPin = pins.find(p => p.title.toLowerCase().includes((loc?.name || '').toLowerCase()));
                                useInteractiveMapStore.getState().openStudio(matchingPin?.mapId, matchingPin?.id);
                              }}
                              title="View on Map"
                            >
                              <i className="fas fa-compass"></i>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="dossier-command-field">
                        <label><i className="fas fa-scroll"></i> Active Quests & Plot Objectives</label>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="entity-chip-add-btn"
                            style={{ width: 'fit-content', padding: '5px 10px' }}
                            onClick={() => openLinkerModal('Link Quests for this Session', getAllCampaignQuests(), session.questIds || [], (newIds) => updateSession(session.id, { questIds: newIds }))}
                          >
                            <i className="fas fa-scroll"></i> Quests ({getLinkedQuests(session.questIds).length})
                          </button>
                          <button
                            type="button"
                            className="entity-chip-add-btn"
                            style={{ width: 'fit-content', padding: '5px 10px', background: '#fdfbf7', borderColor: '#8e44ad', color: '#7d3c98' }}
                            onClick={() => openLinkerModal('Link Plot Threads Advanced in this Session', getAllCampaignPlotThreads(), session.plotThreadIds || [], (newIds) => updateSession(session.id, { plotThreadIds: newIds }))}
                          >
                            <i className="fas fa-project-diagram"></i> Plot Threads ({getLinkedPlotThreads(session.plotThreadIds).length})
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dossier Pillars Grid */}
                    <div className="dossier-grid-sections">
                      {/* Encounters & Inhabitants */}
                      <div className="dossier-pillar-box">
                        <div className="dossier-pillar-header">
                          <span className="dossier-pillar-title">
                            <i className="fas fa-skull-crossbones" style={{ color: '#c0392b' }}></i> Planned Encounters
                          </span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="entity-chip-add-btn"
                              onClick={() => openLinkerModal('Add Monsters / NPCs to Session', getAllCampaignCreatures(), session.monsterIds || [], (newIds) => updateSession(session.id, { monsterIds: newIds }))}
                            >
                              <i className="fas fa-plus"></i> Add
                            </button>
                            {getLinkedCreatures(session.monsterIds).length > 0 && (
                              <button
                                type="button"
                                className="dossier-trigger-action-btn btn-spawn"
                                onClick={() => handleSpawnSessionEncounters(session)}
                                title="Spawn all planned monsters onto the active VTT Canvas"
                              >
                                <i className="fas fa-bolt"></i> Spawn on Canvas
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="entity-chips-list">
                          {getLinkedCreatures(session.monsterIds).map(c => (
                            <span
                              key={c.id}
                              className="entity-chip-pill monster-chip"
                              onMouseEnter={(e) => handleMouseEnter(e, null, c, null)}
                              onMouseMove={handleMouseMove}
                              onMouseLeave={handleMouseLeave}
                            >
                              <img src={resolveLibraryCreatureIcon(c)} alt="" className="entity-chip-pill-icon" />
                              <span className="entity-chip-pill-name">{c.name}</span>
                              <button
                                type="button"
                                className="entity-chip-remove"
                                onClick={() => updateSession(session.id, { monsterIds: (session.monsterIds || []).filter(id => String(id) !== String(c.id)) })}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </span>
                          ))}
                          {(!session.monsterIds || session.monsterIds.length === 0) && (
                            <span style={{ fontSize: '0.72rem', color: '#a08c70', fontStyle: 'italic' }}>No encounters prepped for this session</span>
                          )}
                        </div>
                      </div>

                      {/* Loot & Treasure Caches */}
                      <div className="dossier-pillar-box">
                        <div className="dossier-pillar-header">
                          <span className="dossier-pillar-title">
                            <i className="fas fa-coins" style={{ color: '#d4af37' }}></i> Session Loot & Caches
                          </span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="entity-chip-add-btn"
                              onClick={() => openLinkerModal('Add Loot Items to Session', getAllCampaignItems(), session.lootIds || [], (newIds) => updateSession(session.id, { lootIds: newIds }))}
                            >
                              <i className="fas fa-plus"></i> Add
                            </button>
                            {getLinkedItems(session.lootIds).length > 0 && (
                              <button
                                type="button"
                                className="dossier-trigger-action-btn btn-loot"
                                onClick={() => handleDropSessionLoot(session)}
                                title="Broadcast loot cards to party chat"
                              >
                                <i className="fas fa-gem"></i> Drop Loot to Chat
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="entity-chips-list">
                          {getLinkedItems(session.lootIds).map(item => (
                            <span
                              key={item.id}
                              className="entity-chip-pill item-chip"
                              onMouseEnter={(e) => handleMouseEnter(e, item, null, null)}
                              onMouseMove={handleMouseMove}
                              onMouseLeave={handleMouseLeave}
                            >
                              <img src={resolveLibraryItemIcon(item)} alt="" className="entity-chip-pill-icon" />
                              <span className="entity-chip-pill-name">{item.name}</span>
                              <button
                                type="button"
                                className="entity-chip-remove"
                                onClick={() => updateSession(session.id, { lootIds: (session.lootIds || []).filter(id => String(id) !== String(item.id)) })}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </span>
                          ))}
                          {(!session.lootIds || session.lootIds.length === 0) && (
                            <span style={{ fontSize: '0.72rem', color: '#a08c70', fontStyle: 'italic' }}>No treasure prepped for this session</span>
                          )}
                        </div>
                      </div>

                      {/* Clues & Handouts */}
                      <div className="dossier-pillar-box" style={{ gridColumn: '1 / -1' }}>
                        <div className="dossier-pillar-header">
                          <span className="dossier-pillar-title">
                            <i className="fas fa-scroll" style={{ color: '#3498db' }}></i> Clues, Inscriptions & Player Handouts
                          </span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="entity-chip-add-btn"
                              onClick={() => openLinkerModal('Add Lore / Handouts to Session', getAllCampaignLore(), session.loreIds || [], (newIds) => updateSession(session.id, { loreIds: newIds }))}
                            >
                              <i className="fas fa-plus"></i> Add
                            </button>
                            {getLinkedLore(session.loreIds).length > 0 && (
                              <button
                                type="button"
                                className="dossier-trigger-action-btn btn-reveal"
                                onClick={() => handleRevealSessionHandouts(session)}
                                title="Reveal selected handouts to the party journal / display"
                              >
                                <i className="fas fa-eye"></i> Reveal Handouts
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="entity-chips-list">
                          {getLinkedLore(session.loreIds).map(art => (
                            <span key={art.id} className="entity-chip-pill lore-chip">
                              <i className="fas fa-scroll" style={{ color: '#3498db', fontSize: '11px' }}></i>
                              <span className="entity-chip-pill-name">{art.title}</span>
                              <button
                                type="button"
                                className="entity-chip-remove"
                                onClick={() => updateSession(session.id, { loreIds: (session.loreIds || []).filter(id => String(id) !== String(art.id)) })}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </span>
                          ))}
                          {(!session.loreIds || session.loreIds.length === 0) && (
                            <span style={{ fontSize: '0.72rem', color: '#a08c70', fontStyle: 'italic' }}>No clues or handouts assigned</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Scene Breakdown & GM Notes */}
                    <div className="field-group">
                      <label className="field-label"><i className="fas fa-feather-pointed"></i> Scene Breakdown & Tactical GM Notes</label>
                      <textarea
                        value={session.notes}
                        onChange={(e) => updateSession(session.id, { notes: e.target.value })}
                        placeholder="Scene 1: Journey through the blizzard...&#10;Scene 2: Infiltration of the gatehouse (Encounter 1)...&#10;Scene 3: Crypt altar discovery & boss combat..."
                        rows={3}
                        className="card-field-textarea"
                      />
                    </div>

                    {/* Session Summary (if in-progress or completed) */}
                    {(session.status === 'in-progress' || session.status === 'completed') && (
                      <div className="field-group">
                        <label className="field-label"><i className="fas fa-bookmark"></i> Session Summary & Campaign Chronicle</label>
                        <textarea
                          value={session.summary || ''}
                          onChange={(e) => updateSession(session.id, { summary: e.target.value })}
                          placeholder="What the party decided, unexpected twists, XP awarded, and cliffhangers..."
                          rows={3}
                          className="card-field-textarea"
                        />
                      </div>
                    )}
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
              <div>
                <h3>NPC Management & Bloodlines</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8b5a1a' }}>
                  Track campaign characters, allies, villains, and noble dynasties.
                </p>
              </div>
              <div className="section-header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="add-btn secondary"
                  style={{ background: 'linear-gradient(135deg, #d4af37 0%, #aa8014 100%)', color: '#1a0f05', borderColor: '#8b6508', fontWeight: 700 }}
                  onClick={() => useFamilyTreeStore.getState().openStudio()}
                  title="Open Family Tree & Dynasties Studio to create and edit noble bloodlines & ancestry"
                >
                  <i className="fas fa-sitemap"></i> Family Trees
                </button>
                <button className="add-btn" onClick={addNPC}>
                  <i className="fas fa-plus"></i> Add NPC
                </button>
              </div>
            </div>
            <div className="cards-grid">
              {(campaignData.npcs || []).length > 0 ? (
                (campaignData.npcs || []).map(npc => (
                  <div key={npc.id} className="content-card npc-card">
                    <div className="card-hero-row">
                      <div className="card-media-hero portrait-hero">
                        {npc.image ? (
                          <div className="media-hero-preview portrait">
                            <img src={npc.image} alt={npc.name} />
                            <div className="media-hover-overlay">
                              <label className="media-change-btn" title="Change portrait">
                                <i className="fas fa-camera"></i> Change
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleMediaUpload(file, 'portraits', (url) => updateNPC(npc.id, { image: url }), npc.image);
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                className="media-clear-btn-pill"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMediaRemove(npc.image, () => updateNPC(npc.id, { image: null }));
                                }}
                                title="Remove portrait"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="media-hero-placeholder portrait" title="Upload portrait image">
                            <i className="fas fa-user-plus"></i>
                            <span>Add Portrait</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleMediaUpload(file, 'portraits', (url) => updateNPC(npc.id, { image: url }), npc.image);
                                }}
                            />
                          </label>
                        )}
                      </div>

                      <div className="card-header-fields">
                        <div className="card-field-header-top">
                          <div className="field-group flex-1">
                            <label className="field-label"><i className="fas fa-user-tag"></i> Character Name</label>
                            <input
                              type="text"
                              value={npc.name}
                              onChange={(e) => updateNPC(npc.id, { name: e.target.value })}
                              className="card-title-input full-width"
                              placeholder="Name / Alias..."
                            />
                          </div>
                          <button className="remove-card-btn" onClick={() => removeNPC(npc.id)} title="Delete NPC">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>

                        <div className="card-meta-grid-2col">
                          <div className="field-group">
                            <label className="field-label"><i className="fas fa-map-marker-alt"></i> Location</label>
                            <input
                              type="text"
                              value={npc.location || ''}
                              onChange={(e) => updateNPC(npc.id, { location: e.target.value })}
                              placeholder="e.g. Greymark Keep..."
                              className="card-field-input"
                            />
                          </div>

                          <div className="field-group">
                            <label className="field-label"><i className="fas fa-dna"></i> Lineage / Race</label>
                            <select
                              value={npc.race || ''}
                              onChange={(e) => updateNPC(npc.id, { race: e.target.value, subrace: '' })}
                              className="card-field-select"
                            >
                              <option value="">-- Choose Lineage --</option>
                              <optgroup label="Canon Lineages">
                                {Object.values(RACE_DATA).map(r => (
                                  <option key={r.id} value={r.id}>
                                    {r.name} ({r.essence || 'Canon'})
                                  </option>
                                ))}
                              </optgroup>
                              {useCustomLineageStore.getState().getAllLineages().length > 0 && (
                                <optgroup label="Custom Species">
                                  {useCustomLineageStore.getState().getAllLineages().map(cl => (
                                    <option key={cl.id} value={cl.id}>
                                      {cl.name} (Custom)
                                    </option>
                                  ))}
                                </optgroup>
                              )}
                              {npc.race && !RACE_DATA[npc.race] && !useCustomLineageStore.getState().getLineage(npc.race) && (
                                <option value={npc.race}>{npc.race}</option>
                              )}
                            </select>
                          </div>
                        </div>

                        {/* Subrace / Bloodline selector if available */}
                        {(() => {
                          const selectedRaceObj = RACE_DATA[npc.race] || useCustomLineageStore.getState().getLineage(npc.race);
                          const subraces = selectedRaceObj?.subraces 
                            ? (Array.isArray(selectedRaceObj.subraces) ? selectedRaceObj.subraces : Object.values(selectedRaceObj.subraces))
                            : [];
                          if (subraces.length === 0) return null;
                          return (
                            <div className="field-group" style={{ marginTop: '6px' }}>
                              <label className="field-label"><i className="fas fa-code-branch"></i> Subrace / Bloodline Heritage</label>
                              <select
                                value={npc.subrace || ''}
                                onChange={(e) => updateNPC(npc.id, { subrace: e.target.value })}
                                className="card-field-select"
                              >
                                <option value="">-- Choose Subrace / Bloodline --</option>
                                {subraces.map((sr, idx) => (
                                  <option key={sr.id || idx} value={sr.id || sr.name}>
                                    {sr.name} {sr.description ? `— ${sr.description.slice(0, 45)}...` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })()}

                        <div className="card-meta-grid-2col" style={{ marginTop: '6px' }}>
                          <div className="field-group">
                            <label className="field-label"><i className="fas fa-shield-halved"></i> Attitude</label>
                            <select
                              value={npc.relationship || 'neutral'}
                              onChange={(e) => updateNPC(npc.id, { relationship: e.target.value })}
                              className="card-field-select"
                            >
                              <option value="ally">Ally</option>
                              <option value="neutral">Neutral</option>
                              <option value="enemy">Enemy</option>
                              <option value="unknown">Unknown</option>
                            </select>
                          </div>
                          <div className="field-group">
                            <label className="field-label"><i className="fas fa-star"></i> Importance</label>
                            <select
                              value={npc.plotRelevance || 'moderate'}
                              onChange={(e) => updateNPC(npc.id, { plotRelevance: e.target.value })}
                              className="card-field-select"
                            >
                              <option value="major">Major</option>
                              <option value="moderate">Moderate</option>
                              <option value="minor">Minor</option>
                              <option value="background">Background</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-body-fields">
                      <div className="field-group">
                        <RichCampaignEditor
                          label="Physical Description & Persona"
                          icon="fa-feather-pointed"
                          value={npc.description || ''}
                          onChange={(val) => updateNPC(npc.id, { description: val })}
                          placeholder="Physical description, personality, tone of voice, quirks..."
                          rows={3}
                          compact={true}
                        />
                      </div>
                      <div className="field-group">
                        <RichCampaignEditor
                          label="GM Secrets, Plot Hooks & Notes"
                          icon="fa-key"
                          value={npc.notes || ''}
                          onChange={(val) => updateNPC(npc.id, { notes: val })}
                          placeholder="Plot hooks, secrets, quest connections, inventory..."
                          rows={3}
                          compact={true}
                        />
                      </div>

                      {/* NPC Entity Weaver: Equipped Items, Spells, Secrets */}
                      <div className="entity-weaver-block">
                        <div className="entity-chips-rack">
                          <div className="entity-rack-header">
                            <span><i className="fas fa-shield-halved"></i> Equipped Gear ({getLinkedItems(npc.inventoryItemIds).length})</span>
                            <button
                              type="button"
                              className="entity-chip-add-btn"
                              onClick={() => openLinkerModal(`Equip Items on ${npc.name || 'NPC'}`, getAllCampaignItems(), npc.inventoryItemIds || [], (newIds) => updateNPC(npc.id, { inventoryItemIds: newIds }))}
                            >
                              <i className="fas fa-plus"></i> Equip Item
                            </button>
                          </div>
                          <div className="entity-chips-list">
                            {getLinkedItems(npc.inventoryItemIds).map(item => (
                              <span
                                key={item.id}
                                className="entity-chip-pill item-chip"
                                onMouseEnter={(e) => handleMouseEnter(e, item, null, null)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                              >
                                <img src={resolveLibraryItemIcon(item)} alt="" className="entity-chip-pill-icon" />
                                <span className="entity-chip-pill-name">{item.name}</span>
                                <button
                                  type="button"
                                  className="entity-chip-remove"
                                  onClick={() => updateNPC(npc.id, { inventoryItemIds: (npc.inventoryItemIds || []).filter(id => String(id) !== String(item.id)) })}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </span>
                            ))}
                            {(!npc.inventoryItemIds || npc.inventoryItemIds.length === 0) && (
                              <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No equipment assigned</span>
                            )}
                          </div>
                        </div>

                        <div className="entity-chips-rack">
                          <div className="entity-rack-header">
                            <span><i className="fas fa-hat-wizard"></i> Known Spells ({getLinkedSpells(npc.spellIds).length})</span>
                            <button
                              type="button"
                              className="entity-chip-add-btn"
                              onClick={() => openLinkerModal(`Assign Spells to ${npc.name || 'NPC'}`, getAllCampaignSpells(), npc.spellIds || [], (newIds) => updateNPC(npc.id, { spellIds: newIds }))}
                            >
                              <i className="fas fa-plus"></i> Add Spell
                            </button>
                          </div>
                          <div className="entity-chips-list">
                            {getLinkedSpells(npc.spellIds).map(spell => (
                              <span
                                key={spell.id}
                                className="entity-chip-pill spell-chip"
                                onMouseEnter={(e) => handleMouseEnter(e, null, null, spell)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                              >
                                <img src={resolveLibrarySpellIcon(spell)} alt="" className="entity-chip-pill-icon" />
                                <span className="entity-chip-pill-name">{spell.name}</span>
                                <button
                                  type="button"
                                  className="entity-chip-remove"
                                  onClick={() => updateNPC(npc.id, { spellIds: (npc.spellIds || []).filter(id => String(id) !== String(spell.id)) })}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </span>
                            ))}
                            {(!npc.spellIds || npc.spellIds.length === 0) && (
                              <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No spells assigned</span>
                            )}
                          </div>
                        </div>

                        <div className="entity-chips-rack">
                          <div className="entity-rack-header">
                            <span><i className="fas fa-book-open"></i> Attached Secrets & Lore ({getLinkedLore(npc.loreIds).length})</span>
                            <button
                              type="button"
                              className="entity-chip-add-btn"
                              onClick={() => openLinkerModal(`Attach Lore to ${npc.name || 'NPC'}`, getAllCampaignLore(), npc.loreIds || [], (newIds) => updateNPC(npc.id, { loreIds: newIds }))}
                            >
                              <i className="fas fa-plus"></i> Link Lore
                            </button>
                          </div>
                          <div className="entity-chips-list">
                            {getLinkedLore(npc.loreIds).map(art => (
                              <span key={art.id} className="entity-chip-pill lore-chip">
                                <i className="fas fa-scroll" style={{ color: '#3498db', fontSize: '11px' }}></i>
                                <span className="entity-chip-pill-name">{art.title}</span>
                                <button
                                  type="button"
                                  className="entity-chip-remove"
                                  onClick={() => updateNPC(npc.id, { loreIds: (npc.loreIds || []).filter(id => String(id) !== String(art.id)) })}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </span>
                            ))}
                            {(!npc.loreIds || npc.loreIds.length === 0) && (
                              <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No lore attached</span>
                            )}
                          </div>
                        </div>

                        <div className="entity-chips-rack">
                          <div className="entity-rack-header">
                            <span><i className="fas fa-project-diagram" style={{ color: '#8e44ad' }}></i> Plot Threads ({getLinkedPlotThreads(npc.plotThreadIds).length})</span>
                            <button
                              type="button"
                              className="entity-chip-add-btn"
                              style={{ borderColor: '#8e44ad', color: '#7d3c98' }}
                              onClick={() => openLinkerModal(
                                `Entangle ${npc.name || 'NPC'} in Plot Threads`,
                                getAllCampaignPlotThreads(),
                                npc.plotThreadIds || [],
                                (newIds) => updateNPC(npc.id, { plotThreadIds: newIds })
                              )}
                            >
                              <i className="fas fa-link"></i> Link Threads
                            </button>
                          </div>
                          <div className="entity-chips-list">
                            {getLinkedPlotThreads(npc.plotThreadIds).map(p => (
                              <span key={p.id} className="entity-chip-pill" style={{ borderLeft: '3px solid #8e44ad' }}>
                                <i className="fas fa-project-diagram" style={{ color: '#8e44ad', fontSize: '11px' }}></i>
                                <span className="entity-chip-pill-name">{p.title}</span>
                                <button
                                  type="button"
                                  className="entity-chip-remove"
                                  onClick={() => updateNPC(npc.id, { plotThreadIds: (npc.plotThreadIds || []).filter(id => String(id) !== String(p.id)) })}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </span>
                            ))}
                            {(!npc.plotThreadIds || npc.plotThreadIds.length === 0) && (
                              <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No plot threads connected</span>
                            )}
                          </div>
                        </div>

                        <div className="entity-chips-rack">
                          <div className="entity-rack-header">
                            <span><i className="fas fa-scroll" style={{ color: '#f39c12' }}></i> Tied Quests ({getLinkedQuestsForNPC(npc).length})</span>
                            <button
                              type="button"
                              className="entity-chip-add-btn quest-btn"
                              onClick={() => openLinkerModal(
                                `Tie Quests to ${npc.name || 'NPC'}`,
                                getAllCampaignQuests(),
                                (getLinkedQuestsForNPC(npc) || []).map(q => q.id),
                                (newIds) => {
                                  updateNPC(npc.id, { questIds: newIds });
                                  (campaignData.quests || []).forEach(q => {
                                    const currentNpcIds = q.npcIds || [];
                                    const isLinked = newIds.some(id => String(id) === String(q.id));
                                    const hasNpc = currentNpcIds.some(id => String(id) === String(npc.id));
                                    if (isLinked && !hasNpc) {
                                      updateQuest(q.id, { npcIds: [...currentNpcIds, npc.id] });
                                    } else if (!isLinked && hasNpc) {
                                      const updates = { npcIds: currentNpcIds.filter(id => String(id) !== String(npc.id)) };
                                      if (String(q.giverNpcId) === String(npc.id)) updates.giverNpcId = '';
                                      updateQuest(q.id, updates);
                                    }
                                  });
                                }
                              )}
                            >
                              <i className="fas fa-link"></i> Link Quests
                            </button>
                          </div>
                          <div className="entity-chips-list">
                            {getLinkedQuestsForNPC(npc).map(q => (
                              <span key={q.id} className="entity-chip-pill quest-chip">
                                <i className="fas fa-scroll" style={{ color: '#f39c12', fontSize: '11px' }}></i>
                                <span className="entity-chip-pill-name">{q.title}</span>
                                <span className="entity-picker-source-badge" style={{ fontSize: '0.6rem', padding: '0 4px', background: 'rgba(243, 156, 18, 0.15)', borderColor: '#f39c12', color: '#d35400' }}>
                                  {q.status || 'Active'}
                                </span>
                                {String(q.giverNpcId) === String(npc.id) && (
                                  <span className="entity-picker-source-badge" style={{ fontSize: '0.58rem', padding: '0 3px', background: 'rgba(212, 175, 55, 0.2)', borderColor: '#d4af37', color: '#8b5a1a' }}>
                                    Giver
                                  </span>
                                )}
                                <button
                                  type="button"
                                  className="entity-chip-remove"
                                  onClick={() => {
                                    const updatedIds = (npc.questIds || []).filter(id => String(id) !== String(q.id));
                                    updateNPC(npc.id, { questIds: updatedIds });
                                    const qNpcIds = (q.npcIds || []).filter(id => String(id) !== String(npc.id));
                                    const qUpdates = { npcIds: qNpcIds };
                                    if (String(q.giverNpcId) === String(npc.id)) qUpdates.giverNpcId = '';
                                    updateQuest(q.id, qUpdates);
                                  }}
                                  title="Untie quest from NPC"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </span>
                            ))}
                            {getLinkedQuestsForNPC(npc).length === 0 && (
                              <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No quests tied to this NPC</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="card-footer-actions" style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(139, 69, 19, 0.15)' }}>
                        <button
                          type="button"
                          className="btn-card-footer-act"
                          style={{ background: '#fdfbf7', border: '1px solid #c59b3f', color: '#8b5a1a', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          onClick={() => {
                            const trees = useFamilyTreeStore.getState().trees;
                            const matchingTree = trees.find(t => t.nodes.some(n => n.name.toLowerCase() === (npc.name || '').toLowerCase() || n.npcId === npc.id)) || trees[0];
                            const matchingNode = matchingTree?.nodes.find(n => n.name.toLowerCase() === (npc.name || '').toLowerCase() || n.npcId === npc.id);
                            useFamilyTreeStore.getState().openStudio(matchingTree?.id, matchingNode?.id);
                          }}
                          title="Open this NPC's family tree and bloodlines"
                        >
                          <i className="fas fa-sitemap"></i> Family Tree
                        </button>
                        
                        {npc.location && (
                          <button
                            type="button"
                            className="btn-card-footer-act"
                            style={{ background: '#fdfbf7', border: '1px solid #3498db', color: '#2980b9', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                            onClick={() => {
                              const pins = useInteractiveMapStore.getState().pins;
                              const matchingPin = pins.find(p => p.title.toLowerCase().includes(npc.location.toLowerCase()) || npc.location.toLowerCase().includes(p.title.toLowerCase()));
                              useInteractiveMapStore.getState().openStudio(matchingPin?.mapId, matchingPin?.id);
                            }}
                            title="View this location on Interactive Map"
                          >
                            <i className="fas fa-map-location-dot"></i> View on Map
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-user-plus"></i>
                  <p>No NPCs created yet. Add NPCs to track relationships and portraits!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ LOCATIONS ============ */}
        {activeSection === 'locations' && (
          <div className="list-section">
            <div className="section-header">
              <div>
                <h3>Location Management & World Atlas</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8b5a1a' }}>
                  Establish realms, cities, dungeons, and taverns. Connect sub-locations and visualize world hierarchy.
                </p>
              </div>
              <div className="section-header-actions">
                <div className="location-view-toggle-bar">
                  <button
                    type="button"
                    className={`location-view-toggle-btn ${locationViewMode === 'cards' ? 'active' : ''}`}
                    onClick={() => setLocationViewMode('cards')}
                  >
                    <i className="fas fa-grip-vertical"></i> Cards
                  </button>
                  <button
                    type="button"
                    className={`location-view-toggle-btn ${locationViewMode === 'graph' ? 'active' : ''}`}
                    onClick={() => setLocationViewMode('graph')}
                  >
                    <i className="fas fa-sitemap"></i> Visual Atlas & Tree
                  </button>
                </div>

                <button
                  type="button"
                  className="add-btn secondary"
                  style={{ background: 'linear-gradient(135deg, #2980b9 0%, #1a5276 100%)', color: '#ffffff', borderColor: '#154360' }}
                  onClick={() => useInteractiveMapStore.getState().openStudio()}
                  title="Open Interactive Map Maker, Pins & Multi-Tier Atlas"
                >
                  <i className="fas fa-map-location-dot"></i> Interactive Map Studio
                </button>
                <button className="add-btn" onClick={addLocation}>
                  <i className="fas fa-plus"></i> Add Location
                </button>
              </div>
            </div>

            {locationViewMode === 'graph' ? (
              <div className="location-atlas-workspace">
                <div className="atlas-main-view">
                  <div className="location-atlas-toolbar">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        value={atlasSearch}
                        onChange={(e) => setAtlasSearch(e.target.value)}
                        placeholder="Search world hierarchy..."
                        className="card-field-input"
                        style={{ maxWidth: '240px', background: '#ffffff' }}
                      />
                      <select
                        value={atlasTypeFilter}
                        onChange={(e) => setAtlasTypeFilter(e.target.value)}
                        className="card-field-select"
                        style={{ maxWidth: '160px', background: '#ffffff' }}
                      >
                        <option value="all">All Types</option>
                        <option value="city">Cities & Settlements</option>
                        <option value="dungeon">Dungeons & Crypts</option>
                        <option value="fortress">Fortresses</option>
                        <option value="landmark">Landmarks & POIs</option>
                        <option value="wilderness">Wilderness</option>
                      </select>
                    </div>
                    <div className="location-atlas-stats">
                      <span className="atlas-stat-pill">
                        <i className="fas fa-map-location-dot" style={{ color: '#8b5a1a' }}></i> {(campaignData.locations || []).length} Total
                      </span>
                      <span className="atlas-stat-pill">
                        <i className="fas fa-city" style={{ color: '#2980b9' }}></i> {(campaignData.locations || []).filter(l => l.type === 'city' || l.type === 'town').length} Settlements
                      </span>
                      <span className="atlas-stat-pill">
                        <i className="fas fa-dungeon" style={{ color: '#c0392b' }}></i> {(campaignData.locations || []).filter(l => l.type === 'dungeon').length} Dungeons
                      </span>
                    </div>
                  </div>

                  {/* Interactive Tree & Mindmap Canvas */}
                  <div className="atlas-mindmap-canvas">
                    {(() => {
                      const allLocs = campaignData.locations || [];
                      const filteredLocs = allLocs.filter(l => {
                        const matchesSearch = (l.name || '').toLowerCase().includes(atlasSearch.toLowerCase()) || (l.region || '').toLowerCase().includes(atlasSearch.toLowerCase());
                        const matchesType = atlasTypeFilter === 'all' || l.type === atlasTypeFilter;
                        return matchesSearch && matchesType;
                      });

                      if (allLocs.length === 0) {
                        return (
                          <div className="empty-state" style={{ padding: '60px 0', textAlign: 'center' }}>
                            <i className="fas fa-map-marked-alt empty-state-icon" style={{ fontSize: '2.5rem', color: '#c59b3f', marginBottom: '12px' }}></i>
                            <p style={{ color: '#6b3a10', fontWeight: 600 }}>No locations created yet.</p>
                            <button type="button" className="add-btn" onClick={addLocation} style={{ margin: '12px auto 0 auto' }}>
                              <i className="fas fa-plus"></i> Add First Location
                            </button>
                          </div>
                        );
                      }

                      const topLevelLocs = allLocs.filter(l => !l.parentId || !allLocs.some(p => String(p.id) === String(l.parentId)));

                      const renderAtlasNode = (loc, depth = 0) => {
                        const children = allLocs.filter(child => String(child.parentId) === String(loc.id) || (loc.subLocationIds || []).some(id => String(id) === String(child.id)));
                        const isTop = depth === 0;
                        const isSelected = selectedAtlasLocationId === loc.id;

                        return (
                          <div key={loc.id} className="atlas-tree-node-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div
                              className={`atlas-node-card-interactive ${isTop ? 'is-top-realm' : ''} is-${loc.type || 'landmark'} ${isSelected ? 'is-selected' : ''}`}
                              onClick={() => setSelectedAtlasLocationId(loc.id === selectedAtlasLocationId ? null : loc.id)}
                            >
                              <div className="node-header-row">
                                <span className="node-title">
                                  <i className={`fas ${loc.type === 'dungeon' ? 'fa-dungeon' : loc.type === 'city' ? 'fa-city' : loc.type === 'town' ? 'fa-house' : loc.type === 'fortress' ? 'fa-chess-rook' : 'fa-map-marker-alt'}`} style={{ color: loc.type === 'dungeon' ? '#c0392b' : '#c59b3f' }}></i>
                                  {loc.name}
                                </span>
                                <span className="node-type-badge">{loc.type || 'Location'}</span>
                              </div>

                              {loc.region && (
                                <div style={{ fontSize: '0.72rem', color: '#8b5a1a', marginBottom: '4px' }}>
                                  <i className="fas fa-compass" style={{ marginRight: '4px' }}></i> {loc.region}
                                </div>
                              )}

                              {/* Mini counters */}
                              <div className="node-counters-row">
                                <span className="node-counter-pill" title="Inhabitants">
                                  <i className="fas fa-dragon" style={{ color: '#e74c3c' }}></i> {(loc.monsterIds || []).length}
                                </span>
                                <span className="node-counter-pill" title="Loot">
                                  <i className="fas fa-gem" style={{ color: '#d4af37' }}></i> {(loc.lootIds || []).length}
                                </span>
                                <span className="node-counter-pill" title="Quests">
                                  <i className="fas fa-scroll" style={{ color: '#f39c12' }}></i> {(loc.questIds || []).length}
                                </span>
                                <span className="node-counter-pill" title="Sub-locations">
                                  <i className="fas fa-sitemap" style={{ color: '#8e44ad' }}></i> {children.length}
                                </span>
                              </div>

                              {/* Action buttons */}
                              <div className="node-actions-row" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="node-action-btn"
                                  onClick={() => setSelectedAtlasLocationId(loc.id)}
                                  title="Open Inspector Panel"
                                >
                                  <i className="fas fa-sliders"></i> Details
                                </button>
                                <button
                                  type="button"
                                  className="node-action-btn"
                                  onClick={() => addSubLocationToLocation(loc.id)}
                                  title="Add Sub-Location inside"
                                >
                                  <i className="fas fa-plus"></i> Sub-Place
                                </button>
                                <button
                                  type="button"
                                  className="node-action-btn"
                                  onClick={() => {
                                    const { maps, pins, openStudio, addPin } = useInteractiveMapStore.getState();
                                    let matchingPin = pins.find(p => p.title.toLowerCase().includes((loc.name || '').toLowerCase()) || (loc.name || '').toLowerCase().includes(p.title.toLowerCase()));
                                    let matchingMap = maps.find(m => m.name.toLowerCase().includes((loc.region || loc.name || '').toLowerCase()));
                                    if (!matchingPin && loc.name) {
                                      matchingPin = addPin({
                                        title: loc.name,
                                        description: loc.description || '',
                                        type: loc.type === 'dungeon' ? 'dungeon' : loc.type === 'city' ? 'city' : 'poi',
                                        icon: loc.type === 'dungeon' ? 'fa-dungeon' : loc.type === 'city' ? 'fa-city' : 'fa-location-dot',
                                        mapId: matchingMap?.id || 'map-mythril-world',
                                        x: 50,
                                        y: 50
                                      });
                                    }
                                    openStudio(matchingPin?.mapId || matchingMap?.id, matchingPin?.id);
                                  }}
                                  title="View on Map"
                                >
                                  <i className="fas fa-map-location-dot"></i> Map
                                </button>
                              </div>
                            </div>

                            {/* Nested children */}
                            {children.length > 0 && (
                              <div className="atlas-children-branches">
                                {children.map(child => renderAtlasNode(child, depth + 1))}
                              </div>
                            )}
                          </div>
                        );
                      };

                      return topLevelLocs.map(rootLoc => (
                        <div key={rootLoc.id} className="atlas-realm-tree">
                          {renderAtlasNode(rootLoc, 0)}
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Slide-Over Inspector Drawer */}
                {selectedAtlasLocationId && (() => {
                  const selLoc = (campaignData.locations || []).find(l => l.id === selectedAtlasLocationId);
                  if (!selLoc) return null;

                  return (
                    <div className="atlas-inspector-drawer">
                      <div className="atlas-drawer-header">
                        <span className="atlas-drawer-title">
                          <i className="fas fa-sliders" style={{ color: '#8b5a1a' }}></i> {selLoc.name || 'Location Inspector'}
                        </span>
                        <button
                          type="button"
                          className="atlas-drawer-close"
                          onClick={() => setSelectedAtlasLocationId(null)}
                          title="Close Inspector"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <div className="atlas-drawer-body">
                        <div className="field-group">
                          <label className="field-label"><i className="fas fa-landmark"></i> Location Name</label>
                          <input
                            type="text"
                            value={selLoc.name}
                            onChange={(e) => updateLocation(selLoc.id, { name: e.target.value })}
                            className="card-field-input"
                          />
                        </div>

                        <div className="card-meta-grid-2col">
                          <div className="field-group">
                            <label className="field-label"><i className="fas fa-shapes"></i> Type</label>
                            <select
                              value={selLoc.type || 'city'}
                              onChange={(e) => updateLocation(selLoc.id, { type: e.target.value })}
                              className="card-field-select"
                            >
                              <option value="city">City</option>
                              <option value="town">Town</option>
                              <option value="village">Village</option>
                              <option value="dungeon">Dungeon</option>
                              <option value="fortress">Fortress</option>
                              <option value="landmark">Landmark</option>
                              <option value="wilderness">Wilderness</option>
                            </select>
                          </div>
                          <div className="field-group">
                            <label className="field-label"><i className="fas fa-map-location-dot"></i> Region</label>
                            <input
                              type="text"
                              value={selLoc.region}
                              onChange={(e) => updateLocation(selLoc.id, { region: e.target.value })}
                              className="card-field-input"
                            />
                          </div>
                        </div>

                        <div className="field-group">
                          <label className="field-label"><i className="fas fa-sitemap"></i> Parent Location / Realm</label>
                          <select
                            value={selLoc.parentId || ''}
                            onChange={(e) => {
                              const pId = e.target.value ? (Number(e.target.value) || e.target.value) : null;
                              updateLocation(selLoc.id, { parentId: pId });
                            }}
                            className="card-field-select"
                          >
                            <option value="">-- None (Top-Level Realm) --</option>
                            {(campaignData.locations || [])
                              .filter(l => String(l.id) !== String(selLoc.id))
                              .map(l => (
                                <option key={l.id} value={l.id}>
                                  {l.name} {l.type ? `[${l.type}]` : ''}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="field-group">
                          <label className="field-label"><i className="fas fa-align-left"></i> Description</label>
                          <textarea
                            value={selLoc.description}
                            onChange={(e) => updateLocation(selLoc.id, { description: e.target.value })}
                            rows={3}
                            className="card-field-textarea"
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button
                            type="button"
                            className="add-btn secondary"
                            style={{ flex: 1, justifyContent: 'center' }}
                            onClick={() => {
                              setLocationViewMode('cards');
                              setLocationCardTabs(prev => ({ ...prev, [selLoc.id]: 'overview' }));
                            }}
                          >
                            <i className="fas fa-edit"></i> Full Card
                          </button>
                          <button
                            type="button"
                            className="add-btn"
                            style={{ flex: 1, justifyContent: 'center' }}
                            onClick={() => addSubLocationToLocation(selLoc.id)}
                          >
                            <i className="fas fa-plus"></i> Sub-Place
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="cards-grid">
                {(campaignData.locations || []).length > 0 ? (
                  (campaignData.locations || []).map(location => (
                    <div key={location.id} className="content-card location-card">
                      {/* Top Hero Banner */}
                      <div className="card-media-banner-container">
                        {location.image ? (
                          <div className="media-banner-preview">
                            <img src={location.image} alt={location.name} />
                            <div className="media-hover-overlay">
                              <label className="media-change-btn" title="Change artwork">
                                <i className="fas fa-camera"></i> Change Artwork
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleMediaUpload(file, 'maps', (url) => updateLocation(location.id, { image: url }), location.image);
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                className="media-clear-btn-pill"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMediaRemove(location.image, () => updateLocation(location.id, { image: null }));
                                }}
                                title="Remove artwork"
                              >
                                <i className="fas fa-trash-alt"></i> Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="media-banner-placeholder" title="Upload location artwork or map">
                            <i className="fas fa-mountain-sun"></i>
                            <span>Upload Location Artwork or Regional Map</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleMediaUpload(file, 'maps', (url) => updateLocation(location.id, { image: url }), location.image);
                              }}
                            />
                          </label>
                        )}
                      </div>

                      <div className="card-header-fields">
                        <div className="card-field-header-top">
                          <div className="field-group flex-1">
                            <label className="field-label"><i className="fas fa-landmark"></i> Location Name</label>
                            <input
                              type="text"
                              value={location.name}
                              onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                              className="card-title-input full-width"
                              placeholder="Location name..."
                            />
                          </div>
                          <button className="remove-card-btn" onClick={() => removeLocation(location.id)} title="Delete Location">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>

                        <div className="card-meta-grid-2col">
                          <div className="field-group">
                            <label className="field-label"><i className="fas fa-shapes"></i> Type</label>
                            <select
                              value={location.type || 'city'}
                              onChange={(e) => updateLocation(location.id, { type: e.target.value })}
                              className="card-field-select"
                            >
                              <option value="city">City</option>
                              <option value="town">Town</option>
                              <option value="village">Village</option>
                              <option value="dungeon">Dungeon</option>
                              <option value="fortress">Fortress</option>
                              <option value="landmark">Landmark</option>
                              <option value="wilderness">Wilderness</option>
                            </select>
                          </div>
                          <div className="field-group">
                            <label className="field-label"><i className="fas fa-map-location-dot"></i> Region / Realm</label>
                            <input
                              type="text"
                              value={location.region}
                              onChange={(e) => updateLocation(location.id, { region: e.target.value })}
                              placeholder="e.g. Nordhalla..."
                              className="card-field-input"
                            />
                          </div>
                        </div>

                        {/* Parent Location Selector */}
                        <div className="field-group" style={{ marginTop: '6px' }}>
                          <label className="field-label"><i className="fas fa-sitemap"></i> Parent Location / Realm</label>
                          <select
                            value={location.parentId || ''}
                            onChange={(e) => {
                              const pId = e.target.value ? (Number(e.target.value) || e.target.value) : null;
                              updateLocation(location.id, { parentId: pId });
                            }}
                            className="card-field-select"
                          >
                            <option value="">-- None (Top-Level Realm / World) --</option>
                            {(campaignData.locations || [])
                              .filter(l => String(l.id) !== String(location.id))
                              .map(l => (
                                <option key={l.id} value={l.id}>
                                  {l.name} {l.type ? `[${l.type}]` : ''} {l.region ? `(${l.region})` : ''}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      {/* Sub-Tabs Strip */}
                      <div className="location-card-subtabs-strip">
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'overview' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'overview' }))}
                        >
                          <i className="fas fa-align-left"></i>
                          <span>Overview</span>
                        </button>
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'inhabitants' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'inhabitants' }))}
                        >
                          <i className="fas fa-dragon"></i>
                          <span>Lair ({getLinkedCreatures(location.monsterIds).length})</span>
                        </button>
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'loot' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'loot' }))}
                        >
                          <i className="fas fa-gem"></i>
                          <span>Loot ({getLinkedItems(location.lootIds).length})</span>
                        </button>
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'quests' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'quests' }))}
                        >
                          <i className="fas fa-scroll"></i>
                          <span>Quests ({getLinkedQuests(location.questIds).length})</span>
                        </button>
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'sublocations' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'sublocations' }))}
                        >
                          <i className="fas fa-sitemap"></i>
                          <span>Sub-Places ({getLinkedLocations(location.connectedLocationIds || location.subLocationIds).length})</span>
                        </button>
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'npcs' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'npcs' }))}
                        >
                          <i className="fas fa-users"></i>
                          <span>NPCs ({getLinkedNPCs(location.npcIds).length})</span>
                        </button>
                      </div>

                      {/* Sub-Tab Content */}
                      <div className="card-body-fields">
                        {(locationCardTabs[location.id] || 'overview') === 'overview' && (
                          <>
                            <div className="field-group">
                              <RichCampaignEditor
                                label="Description & Atmosphere"
                                icon="fa-align-left"
                                value={location.description || ''}
                                onChange={(val) => updateLocation(location.id, { description: val })}
                                placeholder="Describe the atmosphere, environment, smells, architecture..."
                                rows={3}
                                compact={true}
                              />
                            </div>
                            <div className="field-group">
                              <RichCampaignEditor
                                label="Notable Landmarks & Features"
                                icon="fa-compass"
                                value={location.notableFeatures || ''}
                                onChange={(val) => updateLocation(location.id, { notableFeatures: val })}
                                placeholder="Taverns, guilds, districts, monuments, dungeon entrances..."
                                rows={2}
                                compact={true}
                              />
                            </div>

                            {/* Quick Summary Entity Pills */}
                            <div className="loc-quick-entity-bar">
                              <span className="loc-quick-pill" onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'inhabitants' }))}>
                                <i className="fas fa-dragon" style={{ color: '#e74c3c' }}></i> {getLinkedCreatures(location.monsterIds).length} Inhabitants
                              </span>
                              <span className="loc-quick-pill" onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'loot' }))}>
                                <i className="fas fa-gem" style={{ color: '#d4af37' }}></i> {getLinkedItems(location.lootIds).length} Loot
                              </span>
                              <span className="loc-quick-pill" onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'quests' }))}>
                                <i className="fas fa-scroll" style={{ color: '#f39c12' }}></i> {getLinkedQuests(location.questIds).length} Quests
                              </span>
                              <span className="loc-quick-pill" onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'sublocations' }))}>
                                <i className="fas fa-sitemap" style={{ color: '#8e44ad' }}></i> {getLinkedLocations(location.connectedLocationIds || location.subLocationIds).length} Sub-Places
                              </span>
                              <span className="loc-quick-pill" onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'npcs' }))}>
                                <i className="fas fa-users" style={{ color: '#2ecc71' }}></i> {getLinkedNPCs(location.npcIds).length} NPCs & Lore
                              </span>
                            </div>
                          </>
                        )}

                        {(locationCardTabs[location.id] || 'overview') === 'sublocations' && (
                          <div className="entity-chips-rack">
                            <div className="entity-rack-header">
                              <span><i className="fas fa-sitemap"></i> Connected Locations & Sub-Regions ({getLinkedLocations(location.connectedLocationIds || location.subLocationIds).length})</span>
                              <div className="entity-rack-actions">
                                <button
                                  type="button"
                                  className="entity-chip-add-btn"
                                  onClick={() => openLinkerModal(
                                    `Connect Locations to ${location.name || 'Location'}`,
                                    getAllCampaignLocations().filter(l => String(l.id) !== String(location.id)),
                                    location.connectedLocationIds || [],
                                    (newIds) => updateLocation(location.id, { connectedLocationIds: newIds })
                                  )}
                                  title="Connect to other realms, towns, or landmarks"
                                >
                                  <i className="fas fa-link"></i> Link
                                </button>
                                <button
                                  type="button"
                                  className="entity-chip-add-btn location-btn"
                                  onClick={() => addSubLocationToLocation(location.id)}
                                  title="Create a new sub-location (tavern, dungeon, district) inside this location"
                                >
                                  <i className="fas fa-plus"></i> Sub-Location
                                </button>
                              </div>
                            </div>
                            <div className="entity-chips-list">
                              {getLinkedLocations(location.connectedLocationIds || location.subLocationIds).map(loc => (
                                <span key={loc.id} className="entity-chip-pill loc-chip">
                                  <i className={`fas ${loc.type === 'dungeon' ? 'fa-dungeon' : loc.type === 'city' ? 'fa-city' : loc.type === 'town' ? 'fa-house' : loc.type === 'fortress' ? 'fa-chess-rook' : 'fa-map-marker-alt'}`} style={{ color: '#e67e22', fontSize: '11px' }}></i>
                                  <span className="entity-chip-pill-name">{loc.name}</span>
                                  <span className="entity-picker-source-badge" style={{ fontSize: '0.6rem', padding: '0 4px', background: 'rgba(230, 126, 34, 0.15)', borderColor: '#e67e22', color: '#d35400' }}>
                                    {loc.type || 'Location'}
                                  </span>
                                  <button
                                    type="button"
                                    className="entity-chip-remove"
                                    onClick={() => updateLocation(location.id, {
                                      connectedLocationIds: (location.connectedLocationIds || []).filter(id => String(id) !== String(loc.id)),
                                      subLocationIds: (location.subLocationIds || []).filter(id => String(id) !== String(loc.id))
                                    })}
                                    title="Disconnect location"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </span>
                              ))}
                              {(!location.connectedLocationIds || location.connectedLocationIds.length === 0) && (!location.subLocationIds || location.subLocationIds.length === 0) && (
                                <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No sub-locations or connections</span>
                              )}
                            </div>
                          </div>
                        )}

                        {(locationCardTabs[location.id] || 'overview') === 'inhabitants' && (
                          <div className="entity-chips-rack">
                            <div className="entity-rack-header">
                              <span><i className="fas fa-dragon"></i> Inhabitants & Lairs ({getLinkedCreatures(location.monsterIds).length})</span>
                              <div className="entity-rack-actions">
                                <button
                                  type="button"
                                  className="entity-chip-add-btn"
                                  onClick={() => openLinkerModal(
                                    `Link Inhabitants for ${location.name || 'Location'}`,
                                    getAllCampaignCreatures(),
                                    location.monsterIds || [],
                                    (newIds) => updateLocation(location.id, { monsterIds: newIds }),
                                    () => addCreatureToLocationFromLibrary(location.id),
                                    () => addCustomCreatureToLocation(location.id)
                                  )}
                                >
                                  <i className="fas fa-link"></i> Link
                                </button>
                                <button
                                  type="button"
                                  className="entity-chip-add-btn library-btn"
                                  onClick={() => addCreatureToLocationFromLibrary(location.id)}
                                >
                                  <i className="fas fa-book-open"></i> Library
                                </button>
                                <button
                                  type="button"
                                  className="entity-chip-add-btn homebrew-btn"
                                  onClick={() => addCustomCreatureToLocation(location.id)}
                                >
                                  <i className="fas fa-plus"></i> Homebrew
                                </button>
                              </div>
                            </div>
                            <div className="entity-chips-list">
                              {getLinkedCreatures(location.monsterIds).map(creature => (
                                <span
                                  key={creature.id}
                                  className="entity-chip-pill monster-chip"
                                  onMouseEnter={(e) => handleMouseEnter(e, null, creature, null)}
                                  onMouseMove={handleMouseMove}
                                  onMouseLeave={handleMouseLeave}
                                >
                                  <img src={resolveLibraryCreatureIcon(creature)} alt="" className="entity-chip-pill-icon" />
                                  <span className="entity-chip-pill-name">{creature.name}</span>
                                  {creature._source && (
                                    <span className="entity-picker-source-badge" style={{ fontSize: '0.6rem', padding: '0 4px', background: creature._source === 'Library' ? 'rgba(197, 155, 63, 0.15)' : 'rgba(155, 89, 182, 0.15)', borderColor: creature._source === 'Library' ? '#c59b3f' : '#9b59b6', color: creature._source === 'Library' ? '#8b5a1a' : '#8e44ad' }}>
                                      {creature._source}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    className="entity-chip-remove"
                                    onClick={() => updateLocation(location.id, { monsterIds: (location.monsterIds || []).filter(id => String(id) !== String(creature.id)) })}
                                    title="Unlink from location"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </span>
                              ))}
                              {(!location.monsterIds || location.monsterIds.length === 0) && (
                                <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No inhabitants assigned</span>
                              )}
                            </div>
                          </div>
                        )}

                        {(locationCardTabs[location.id] || 'overview') === 'loot' && (
                          <div className="entity-chips-rack">
                            <div className="entity-rack-header">
                              <span><i className="fas fa-gem"></i> Chamber Loot & Caches ({getLinkedItems(location.lootIds).length})</span>
                              <div className="entity-rack-actions">
                                <button
                                  type="button"
                                  className="entity-chip-add-btn"
                                  onClick={() => openLinkerModal(
                                    `Link Loot for ${location.name || 'Location'}`,
                                    getAllCampaignItems(),
                                    location.lootIds || [],
                                    (newIds) => updateLocation(location.id, { lootIds: newIds }),
                                    () => addItemToLocationFromLibrary(location.id),
                                    () => addCustomItemToLocation(location.id)
                                  )}
                                >
                                  <i className="fas fa-link"></i> Link
                                </button>
                                <button
                                  type="button"
                                  className="entity-chip-add-btn library-btn"
                                  onClick={() => addItemToLocationFromLibrary(location.id)}
                                >
                                  <i className="fas fa-book-open"></i> Library
                                </button>
                                <button
                                  type="button"
                                  className="entity-chip-add-btn homebrew-btn"
                                  onClick={() => addCustomItemToLocation(location.id)}
                                >
                                  <i className="fas fa-plus"></i> Homebrew
                                </button>
                              </div>
                            </div>
                            <div className="entity-chips-list">
                              {getLinkedItems(location.lootIds).map(item => (
                                <span
                                  key={item.id}
                                  className="entity-chip-pill item-chip"
                                  onMouseEnter={(e) => handleMouseEnter(e, item, null, null)}
                                  onMouseMove={handleMouseMove}
                                  onMouseLeave={handleMouseLeave}
                                >
                                  <img src={resolveLibraryItemIcon(item)} alt="" className="entity-chip-pill-icon" />
                                  <span className="entity-chip-pill-name">{item.name}</span>
                                  {item._source && (
                                    <span className="entity-picker-source-badge" style={{ fontSize: '0.6rem', padding: '0 4px', background: item._source === 'Library' ? 'rgba(197, 155, 63, 0.15)' : 'rgba(155, 89, 182, 0.15)', borderColor: item._source === 'Library' ? '#c59b3f' : '#9b59b6', color: item._source === 'Library' ? '#8b5a1a' : '#8e44ad' }}>
                                      {item._source}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    className="entity-chip-remove"
                                    onClick={() => updateLocation(location.id, { lootIds: (location.lootIds || []).filter(id => String(id) !== String(item.id)) })}
                                    title="Unlink from location"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </span>
                              ))}
                              {(!location.lootIds || location.lootIds.length === 0) && (
                                <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No loot placed in this location</span>
                              )}
                            </div>
                          </div>
                        )}

                        {(locationCardTabs[location.id] || 'overview') === 'quests' && (
                          <div className="entity-chips-rack">
                            <div className="entity-rack-header">
                              <span><i className="fas fa-scroll"></i> Quests & Objectives Here ({getLinkedQuestsForLocation(location).length})</span>
                              <div className="entity-rack-actions">
                                <button
                                  type="button"
                                  className="entity-chip-add-btn"
                                  onClick={() => openLinkerModal(
                                    `Link Quests for ${location.name || 'Location'}`,
                                    getAllCampaignQuests(),
                                    (getLinkedQuestsForLocation(location) || []).map(q => q.id),
                                    (newIds) => {
                                      updateLocation(location.id, { questIds: newIds });
                                      (campaignData.quests || []).forEach(q => {
                                        const currentLocIds = q.locationIds || [];
                                        const isLinked = newIds.some(id => String(id) === String(q.id));
                                        const hasLoc = currentLocIds.some(id => String(id) === String(location.id));
                                        if (isLinked && !hasLoc) {
                                          updateQuest(q.id, { locationIds: [...currentLocIds, location.id] });
                                        } else if (!isLinked && hasLoc) {
                                          const updates = { locationIds: currentLocIds.filter(id => String(id) !== String(location.id)) };
                                          if (String(q.primaryLocationId) === String(location.id)) updates.primaryLocationId = '';
                                          updateQuest(q.id, updates);
                                        }
                                      });
                                    },
                                    null,
                                    () => addQuestToLocation(location.id)
                                  )}
                                >
                                  <i className="fas fa-link"></i> Link
                                </button>
                                <button
                                  type="button"
                                  className="entity-chip-add-btn quest-btn"
                                  onClick={() => addQuestToLocation(location.id)}
                                >
                                  <i className="fas fa-plus"></i> New Quest
                                </button>
                              </div>
                            </div>
                            <div className="entity-chips-list">
                              {getLinkedQuestsForLocation(location).map(q => (
                                <span key={q.id} className="entity-chip-pill quest-chip">
                                  <i className="fas fa-scroll" style={{ color: '#f39c12', fontSize: '11px' }}></i>
                                  <span className="entity-chip-pill-name">{q.title}</span>
                                  <span className="entity-picker-source-badge" style={{ fontSize: '0.6rem', padding: '0 4px', background: 'rgba(243, 156, 18, 0.15)', borderColor: '#f39c12', color: '#d35400' }}>
                                    {q.status || 'Active'}
                                  </span>
                                  {String(q.primaryLocationId) === String(location.id) && (
                                    <span className="entity-picker-source-badge" style={{ fontSize: '0.58rem', padding: '0 3px', background: 'rgba(212, 175, 55, 0.2)', borderColor: '#d4af37', color: '#8b5a1a' }}>
                                      Primary
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    className="entity-chip-remove"
                                    onClick={() => {
                                      const updatedIds = (location.questIds || []).filter(id => String(id) !== String(q.id));
                                      updateLocation(location.id, { questIds: updatedIds });
                                      const qLocIds = (q.locationIds || []).filter(id => String(id) !== String(location.id));
                                      const qUpdates = { locationIds: qLocIds };
                                      if (String(q.primaryLocationId) === String(location.id)) qUpdates.primaryLocationId = '';
                                      updateQuest(q.id, qUpdates);
                                    }}
                                    title="Unlink quest from location"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </span>
                              ))}
                              {getLinkedQuestsForLocation(location).length === 0 && (
                                <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No quests tied to this location</span>
                              )}
                            </div>
                          </div>
                        )}

                        {(locationCardTabs[location.id] || 'overview') === 'npcs' && (
                          <>
                            <div className="entity-chips-rack">
                              <div className="entity-rack-header">
                                <span><i className="fas fa-users"></i> NPCs Present ({getLinkedNPCs(location.npcIds).length})</span>
                                <div className="entity-rack-actions">
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn"
                                    onClick={() => openLinkerModal(
                                      `Link NPCs for ${location.name || 'Location'}`,
                                      getAllCampaignNPCs(),
                                      location.npcIds || [],
                                      (newIds) => updateLocation(location.id, { npcIds: newIds }),
                                      null,
                                      () => addNPCToLocation(location.id)
                                    )}
                                  >
                                    <i className="fas fa-link"></i> Link
                                  </button>
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn npc-btn"
                                    onClick={() => addNPCToLocation(location.id)}
                                  >
                                    <i className="fas fa-plus"></i> New NPC
                                  </button>
                                </div>
                              </div>
                              <div className="entity-chips-list">
                                {getLinkedNPCs(location.npcIds).map(n => (
                                  <span key={n.id} className="entity-chip-pill npc-chip">
                                    <i className="fas fa-user-tag" style={{ color: '#2ecc71', fontSize: '11px' }}></i>
                                    <span className="entity-chip-pill-name">{n.name}</span>
                                    <button
                                      type="button"
                                      className="entity-chip-remove"
                                      onClick={() => updateLocation(location.id, { npcIds: (location.npcIds || []).filter(id => String(id) !== String(n.id)) })}
                                      title="Unlink NPC"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </span>
                                ))}
                                {(!location.npcIds || location.npcIds.length === 0) && (
                                  <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No NPCs assigned</span>
                                )}
                              </div>
                            </div>

                            <div className="entity-chips-rack" style={{ marginTop: '8px' }}>
                              <div className="entity-rack-header">
                                <span><i className="fas fa-book-open"></i> Lore & Inscriptions ({getLinkedLore(location.loreIds).length})</span>
                                <div className="entity-rack-actions">
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn"
                                    onClick={() => openLinkerModal(
                                      `Attach Lore for ${location.name || 'Location'}`,
                                      getAllCampaignLore(),
                                      location.loreIds || [],
                                      (newIds) => updateLocation(location.id, { loreIds: newIds }),
                                      null,
                                      () => addLoreToLocation(location.id)
                                    )}
                                  >
                                    <i className="fas fa-link"></i> Link
                                  </button>
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn lore-btn"
                                    onClick={() => addLoreToLocation(location.id)}
                                  >
                                    <i className="fas fa-plus"></i> New Lore
                                  </button>
                                </div>
                              </div>
                              <div className="entity-chips-list">
                                {getLinkedLore(location.loreIds).map(art => (
                                  <span key={art.id} className="entity-chip-pill lore-chip">
                                    <i className="fas fa-scroll" style={{ color: '#3498db', fontSize: '11px' }}></i>
                                    <span className="entity-chip-pill-name">{art.title}</span>
                                    <button
                                      type="button"
                                      className="entity-chip-remove"
                                      onClick={() => updateLocation(location.id, { loreIds: (location.loreIds || []).filter(id => String(id) !== String(art.id)) })}
                                      title="Unlink lore"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </span>
                                ))}
                                {(!location.loreIds || location.loreIds.length === 0) && (
                                  <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No lore attached</span>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="card-footer-actions" style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(139, 69, 19, 0.15)' }}>
                        <button
                          type="button"
                          className="btn-card-footer-act"
                          style={{ background: '#fdfbf7', border: '1px solid #3498db', color: '#2980b9', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          onClick={() => {
                            const { maps, pins, openStudio, addPin } = useInteractiveMapStore.getState();
                            let matchingPin = pins.find(p => p.title.toLowerCase().includes((location.name || '').toLowerCase()) || (location.name || '').toLowerCase().includes(p.title.toLowerCase()));
                            let matchingMap = maps.find(m => m.name.toLowerCase().includes((location.region || location.name || '').toLowerCase()));
                            
                            if (!matchingPin && location.name) {
                              matchingPin = addPin({
                                title: location.name,
                                description: location.description || location.notableFeatures || '',
                                type: location.type === 'dungeon' ? 'dungeon' : location.type === 'city' ? 'city' : 'poi',
                                icon: location.type === 'dungeon' ? 'fa-dungeon' : location.type === 'city' ? 'fa-city' : 'fa-location-dot',
                                mapId: matchingMap?.id || 'map-mythril-world',
                                x: Math.floor(Math.random() * 40) + 30,
                                y: Math.floor(Math.random() * 40) + 30
                              });
                            }
                            openStudio(matchingPin?.mapId || matchingMap?.id, matchingPin?.id);
                          }}
                          title="Open this location in the Interactive Map Maker & Multi-Tier Atlas"
                        >
                          <i className="fas fa-map-location-dot"></i> View on Interactive Map
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-map-plus"></i>
                    <p>No locations created yet. Build your world by adding important places!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeSection === 'quests' && (() => {
          const filteredQuests = (campaignData.quests || []).filter(quest => {
            if (questFilterType !== 'all' && (quest.type || 'side') !== questFilterType) return false;
            if (questFilterStatus !== 'all' && (quest.status || 'not-started') !== questFilterStatus) return false;
            if (questFilterNPC !== 'all') {
              const hasNpc = (quest.npcIds || []).some(id => String(id) === String(questFilterNPC)) ||
                String(quest.giverNpcId) === String(questFilterNPC) ||
                (quest.giver && (campaignData.npcs || []).find(n => String(n.id) === String(questFilterNPC))?.name?.toLowerCase() === quest.giver.toLowerCase()) ||
                (campaignData.npcs || []).find(n => String(n.id) === String(questFilterNPC))?.questIds?.some(id => String(id) === String(quest.id));
              if (!hasNpc) return false;
            }
            if (questFilterLocation !== 'all') {
              const hasLoc = (quest.locationIds || []).some(id => String(id) === String(questFilterLocation)) ||
                String(quest.primaryLocationId) === String(questFilterLocation) ||
                (quest.location && (campaignData.locations || []).find(l => String(l.id) === String(questFilterLocation))?.name?.toLowerCase() === quest.location.toLowerCase()) ||
                (campaignData.locations || []).find(l => String(l.id) === String(questFilterLocation))?.questIds?.some(id => String(id) === String(quest.id));
              if (!hasLoc) return false;
            }
            if (questSearchQuery.trim()) {
              const q = questSearchQuery.toLowerCase();
              const matchTitle = (quest.title || '').toLowerCase().includes(q);
              const matchDesc = (quest.description || '').toLowerCase().includes(q);
              const matchGiver = (quest.giver || '').toLowerCase().includes(q);
              const matchLoc = (quest.location || '').toLowerCase().includes(q);
              const matchRewards = (quest.rewards || '').toLowerCase().includes(q);
              if (!matchTitle && !matchDesc && !matchGiver && !matchLoc && !matchRewards) return false;
            }
            return true;
          });

          return (
            <div className="list-section">
              <div className="section-header">
                <div>
                  <h3>Quest & Objective Log</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#8b5a1a' }}>
                    Track active quests, main story arcs, bounties, and checklist objectives. Tie quests to NPCs and locations.
                  </p>
                </div>
                <div className="section-header-actions">
                  <button className="add-btn" onClick={addQuest}>
                    <i className="fas fa-plus"></i> New Quest
                  </button>
                </div>
              </div>

              {/* Quest Filter & Search Toolbar */}
              <div className="plot-toolbar-container" style={{ marginBottom: '16px' }}>
                <div className="plot-filter-group" style={{ flex: 1, display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Search quests by title, giver, location, summary..."
                    value={questSearchQuery}
                    onChange={(e) => setQuestSearchQuery(e.target.value)}
                    className="card-field-input"
                    style={{ minWidth: '180px', flex: '1 1 200px' }}
                  />
                  <select
                    value={questFilterType}
                    onChange={(e) => setQuestFilterType(e.target.value)}
                    className="card-field-select"
                    style={{ width: 'auto', minWidth: '120px' }}
                  >
                    <option value="all">All Types</option>
                    <option value="main">Main Quests</option>
                    <option value="side">Side Quests</option>
                    <option value="bounty">Bounties / Contracts</option>
                    <option value="personal">Personal / Backstory</option>
                  </select>
                  <select
                    value={questFilterStatus}
                    onChange={(e) => setQuestFilterStatus(e.target.value)}
                    className="card-field-select"
                    style={{ width: 'auto', minWidth: '120px' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  <select
                    value={questFilterNPC}
                    onChange={(e) => setQuestFilterNPC(e.target.value)}
                    className="card-field-select"
                    style={{ width: 'auto', minWidth: '140px' }}
                  >
                    <option value="all">All NPCs</option>
                    {(campaignData.npcs || []).map(npc => (
                      <option key={npc.id} value={npc.id}>{npc.name || 'Unnamed NPC'}</option>
                    ))}
                  </select>
                  <select
                    value={questFilterLocation}
                    onChange={(e) => setQuestFilterLocation(e.target.value)}
                    className="card-field-select"
                    style={{ width: 'auto', minWidth: '140px' }}
                  >
                    <option value="all">All Locations</option>
                    {(campaignData.locations || []).map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name || 'Unnamed Location'}</option>
                    ))}
                  </select>
                  {(questFilterType !== 'all' || questFilterStatus !== 'all' || questFilterNPC !== 'all' || questFilterLocation !== 'all' || questSearchQuery.trim()) && (
                    <button
                      type="button"
                      className="entity-chip-add-btn"
                      onClick={() => {
                        setQuestFilterType('all');
                        setQuestFilterStatus('all');
                        setQuestFilterNPC('all');
                        setQuestFilterLocation('all');
                        setQuestSearchQuery('');
                      }}
                      title="Reset all quest filters"
                    >
                      <i className="fas fa-undo"></i> Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="cards-grid">
                {filteredQuests.length > 0 ? (
                  filteredQuests.map(quest => {
                    const linkedNPCs = getLinkedNPCs(quest.npcIds);
                    const linkedLocations = getLinkedLocations(quest.locationIds);

                    return (
                      <div key={quest.id} className="content-card quest-card">
                        {/* Top Hero Banner */}
                        <div className="card-media-banner-container">
                          {quest.image ? (
                            <div className="media-banner-preview">
                              <img src={quest.image} alt={quest.title} />
                              <div className="media-hover-overlay">
                                <label className="media-change-btn" title="Change quest artwork">
                                  <i className="fas fa-camera"></i> Change Artwork
                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleMediaUpload(file, 'quests', (url) => updateQuest(quest.id, { image: url }), quest.image);
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  className="media-clear-btn-pill"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMediaRemove(quest.image, () => updateQuest(quest.id, { image: null }));
                                  }}
                                  title="Remove artwork"
                                >
                                  <i className="fas fa-trash-alt"></i> Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="media-banner-placeholder" title="Upload quest artwork or map">
                              <i className="fas fa-scroll"></i>
                              <span>Upload Quest Artwork or Handout</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleMediaUpload(file, 'quests', (url) => updateQuest(quest.id, { image: url }), quest.image);
                                }}
                              />
                            </label>
                          )}
                        </div>

                        <div className="card-header-fields">
                          <div className="card-field-header-top">
                            <div className="field-group flex-1">
                              <label className="field-label"><i className="fas fa-scroll"></i> Quest Title</label>
                              <input
                                type="text"
                                value={quest.title}
                                onChange={(e) => updateQuest(quest.id, { title: e.target.value })}
                                className="card-title-input full-width"
                                placeholder="Quest title..."
                              />
                            </div>
                            <button className="remove-card-btn" onClick={() => removeQuest(quest.id)} title="Delete Quest">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>

                          <div className="card-meta-grid-2col">
                            <div className="field-group">
                              <label className="field-label"><i className="fas fa-tag"></i> Type</label>
                              <select
                                value={quest.type || 'side'}
                                onChange={(e) => updateQuest(quest.id, { type: e.target.value })}
                                className="card-field-select"
                              >
                                <option value="main">Main Quest</option>
                                <option value="side">Side Quest</option>
                                <option value="bounty">Bounty / Contract</option>
                                <option value="personal">Personal / Backstory</option>
                              </select>
                            </div>
                            <div className="field-group">
                              <label className="field-label"><i className="fas fa-tasks"></i> Status</label>
                              <select
                                value={quest.status || 'not-started'}
                                onChange={(e) => updateQuest(quest.id, { status: e.target.value })}
                                className="card-field-select"
                              >
                                <option value="not-started">Not Started</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                              </select>
                            </div>
                          </div>

                          {/* Quest Giver & Primary Location Pickers */}
                          <div className="card-meta-grid-2col" style={{ marginTop: '6px' }}>
                            <div className="field-group">
                              <label className="field-label"><i className="fas fa-user"></i> Quest Giver / Contact</label>
                              <select
                                value={
                                  quest.giverNpcId ||
                                  (campaignData.npcs || []).find(n => n.name === quest.giver)?.id ||
                                  (quest.giver ? '__custom__' : '')
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '__custom__') {
                                    updateQuest(quest.id, { giverNpcId: '', giver: quest.giver || '' });
                                  } else if (!val) {
                                    const prevGiverId = quest.giverNpcId;
                                    updateQuest(quest.id, { giverNpcId: '', giver: '' });
                                    if (prevGiverId) {
                                      const targetNpc = (campaignData.npcs || []).find(n => String(n.id) === String(prevGiverId));
                                      if (targetNpc) {
                                        updateNPC(targetNpc.id, { questIds: (targetNpc.questIds || []).filter(id => String(id) !== String(quest.id)) });
                                      }
                                    }
                                  } else {
                                    const selectedNpc = (campaignData.npcs || []).find(n => String(n.id) === String(val));
                                    if (selectedNpc) {
                                      const curNpcIds = quest.npcIds || [];
                                      const updatedNpcIds = curNpcIds.some(id => String(id) === String(selectedNpc.id))
                                        ? curNpcIds
                                        : [...curNpcIds, selectedNpc.id];
                                      updateQuest(quest.id, {
                                        giver: selectedNpc.name,
                                        giverNpcId: selectedNpc.id,
                                        npcIds: updatedNpcIds
                                      });
                                      const curQuestIds = selectedNpc.questIds || [];
                                      if (!curQuestIds.some(id => String(id) === String(quest.id))) {
                                        updateNPC(selectedNpc.id, { questIds: [...curQuestIds, quest.id] });
                                      }
                                    }
                                  }
                                }}
                                className="card-field-select"
                              >
                                <option value="">-- Select Campaign NPC --</option>
                                {(campaignData.npcs || []).map(npc => (
                                  <option key={npc.id} value={npc.id}>
                                    {npc.name} ({npc.relationship ? formatTag(npc.relationship) : 'NPC'})
                                  </option>
                                ))}
                                <option value="__custom__">Custom / Other Giver...</option>
                              </select>
                              {(!quest.giverNpcId && (quest.giver || (campaignData.npcs || []).length === 0)) ||
                               (!quest.giverNpcId && !(campaignData.npcs || []).some(n => n.name === quest.giver) && quest.giver) ? (
                                <input
                                  type="text"
                                  value={quest.giver || ''}
                                  onChange={(e) => updateQuest(quest.id, { giver: e.target.value })}
                                  placeholder="Enter custom giver name..."
                                  className="card-field-input"
                                  style={{ marginTop: '4px' }}
                                />
                              ) : null}
                            </div>

                            <div className="field-group">
                              <label className="field-label"><i className="fas fa-map-pin"></i> Target / Primary Location</label>
                              <select
                                value={
                                  quest.primaryLocationId ||
                                  (campaignData.locations || []).find(l => l.name === quest.location)?.id ||
                                  (quest.location ? '__custom__' : '')
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '__custom__') {
                                    updateQuest(quest.id, { primaryLocationId: '', location: quest.location || '' });
                                  } else if (!val) {
                                    const prevLocId = quest.primaryLocationId;
                                    updateQuest(quest.id, { primaryLocationId: '', location: '' });
                                    if (prevLocId) {
                                      const targetLoc = (campaignData.locations || []).find(l => String(l.id) === String(prevLocId));
                                      if (targetLoc) {
                                        updateLocation(targetLoc.id, { questIds: (targetLoc.questIds || []).filter(id => String(id) !== String(quest.id)) });
                                      }
                                    }
                                  } else {
                                    const selectedLoc = (campaignData.locations || []).find(l => String(l.id) === String(val));
                                    if (selectedLoc) {
                                      const curLocIds = quest.locationIds || [];
                                      const updatedLocIds = curLocIds.some(id => String(id) === String(selectedLoc.id))
                                        ? curLocIds
                                        : [...curLocIds, selectedLoc.id];
                                      updateQuest(quest.id, {
                                        location: selectedLoc.name,
                                        primaryLocationId: selectedLoc.id,
                                        locationIds: updatedLocIds
                                      });
                                      const curQuestIds = selectedLoc.questIds || [];
                                      if (!curQuestIds.some(id => String(id) === String(quest.id))) {
                                        updateLocation(selectedLoc.id, { questIds: [...curQuestIds, quest.id] });
                                      }
                                    }
                                  }
                                }}
                                className="card-field-select"
                              >
                                <option value="">-- Select Campaign Location --</option>
                                {(campaignData.locations || []).map(loc => (
                                  <option key={loc.id} value={loc.id}>
                                    {loc.name} ({loc.type ? formatTag(loc.type) : 'Location'})
                                  </option>
                                ))}
                                <option value="__custom__">Custom / Other Location...</option>
                              </select>
                              {(!quest.primaryLocationId && (quest.location || (campaignData.locations || []).length === 0)) ||
                               (!quest.primaryLocationId && !(campaignData.locations || []).some(l => l.name === quest.location) && quest.location) ? (
                                <input
                                  type="text"
                                  value={quest.location || ''}
                                  onChange={(e) => updateQuest(quest.id, { location: e.target.value })}
                                  placeholder="Enter custom location name..."
                                  className="card-field-input"
                                  style={{ marginTop: '4px' }}
                                />
                              ) : null}
                            </div>
                          </div>

                          <div className="field-group" style={{ marginTop: '6px' }}>
                            <label className="field-label"><i className="fas fa-project-diagram"></i> Assigned Plot Thread</label>
                            <select
                              value={quest.plotThreadId || ''}
                              onChange={(e) => {
                                const selectedPlotId = e.target.value;
                                updateQuest(quest.id, { plotThreadId: selectedPlotId });
                                (campaignData.plotThreads || []).forEach(plot => {
                                  const currentQuestIds = plot.questIds || [];
                                  if (String(plot.id) === String(selectedPlotId)) {
                                    if (!currentQuestIds.some(id => String(id) === String(quest.id))) {
                                      updatePlotThread(plot.id, { questIds: [...currentQuestIds, quest.id] });
                                    }
                                  } else if (currentQuestIds.some(id => String(id) === String(quest.id))) {
                                    updatePlotThread(plot.id, { questIds: currentQuestIds.filter(id => String(id) !== String(quest.id)) });
                                  }
                                });
                              }}
                              className="card-field-select"
                            >
                              <option value="">-- No Plot Thread Assigned --</option>
                              {(campaignData.plotThreads || []).map(p => (
                                <option key={p.id} value={p.id}>{p.title} ({p.type ? p.type.toUpperCase() : 'MAIN'})</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="card-body-fields">
                          <div className="field-group">
                            <RichCampaignEditor
                              label="Summary & Objectives Brief"
                              icon="fa-align-left"
                              value={quest.description || ''}
                              onChange={(val) => updateQuest(quest.id, { description: val })}
                              placeholder="Describe the quest premise, stakes, and player briefings..."
                              rows={3}
                              compact={true}
                            />
                          </div>

                          {/* Quest Checklist Objectives */}
                          <div className="field-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <label className="field-label" style={{ margin: 0 }}><i className="fas fa-check-square"></i> Objectives ({(quest.objectives || []).filter(o => o.completed).length}/{(quest.objectives || []).length})</label>
                              <button
                                type="button"
                                className="entity-chip-add-btn quest-btn"
                                onClick={() => addQuestObjective(quest.id)}
                              >
                                <i className="fas fa-plus"></i> Add Step
                              </button>
                            </div>
                            <div className="quest-objectives-checklist" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {(quest.objectives || []).map(obj => (
                                <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fdfbf7', border: '1px solid rgba(139,69,19,0.15)', borderRadius: '4px', padding: '3px 6px' }}>
                                  <input
                                    type="checkbox"
                                    checked={obj.completed || false}
                                    onChange={(e) => updateQuestObjective(quest.id, obj.id, { completed: e.target.checked })}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <input
                                    type="text"
                                    value={obj.text}
                                    onChange={(e) => updateQuestObjective(quest.id, obj.id, { text: e.target.value })}
                                    placeholder="Objective description..."
                                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.75rem', textDecoration: obj.completed ? 'line-through' : 'none', color: obj.completed ? '#888' : '#2d1810' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeQuestObjective(quest.id, obj.id)}
                                    style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '0.7rem' }}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              ))}
                              {(!quest.objectives || quest.objectives.length === 0) && (
                                <div style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No objective checklist steps added yet</div>
                              )}
                            </div>
                          </div>

                          {/* Rewards */}
                          <div className="field-group">
                            <label className="field-label"><i className="fas fa-gift"></i> Rewards & Bounty</label>
                            <input
                              type="text"
                              value={quest.rewards || ''}
                              onChange={(e) => updateQuest(quest.id, { rewards: e.target.value })}
                              placeholder="e.g. 500 Gold, Obsidian Dagger, Clan Favors..."
                              className="card-field-input"
                            />
                          </div>

                          {/* Entity Weaver Block: Tied NPCs & Tied Locations */}
                          <div className="entity-weaver-block">
                            {/* Tied NPCs Rack */}
                            <div className="entity-chips-rack">
                              <div className="entity-rack-header">
                                <span><i className="fas fa-users" style={{ color: '#2ecc71' }}></i> Tied NPCs ({linkedNPCs.length})</span>
                                <button
                                  type="button"
                                  className="entity-chip-add-btn"
                                  style={{ borderColor: '#2ecc71', color: '#27ae60' }}
                                  onClick={() => openLinkerModal(
                                    `Tie NPCs to ${quest.title || 'Quest'}`,
                                    getAllCampaignNPCs(),
                                    quest.npcIds || [],
                                    (newIds) => {
                                      updateQuest(quest.id, { npcIds: newIds });
                                      (campaignData.npcs || []).forEach(n => {
                                        const currentQuestIds = n.questIds || [];
                                        const isLinked = newIds.some(id => String(id) === String(n.id));
                                        const hasQuest = currentQuestIds.some(id => String(id) === String(quest.id));
                                        if (isLinked && !hasQuest) {
                                          updateNPC(n.id, { questIds: [...currentQuestIds, quest.id] });
                                        } else if (!isLinked && hasQuest) {
                                          updateNPC(n.id, { questIds: currentQuestIds.filter(id => String(id) !== String(quest.id)) });
                                        }
                                      });
                                    }
                                  )}
                                >
                                  <i className="fas fa-plus"></i> Tie NPC
                                </button>
                              </div>
                              <div className="entity-chips-list">
                                {linkedNPCs.map(npc => (
                                  <span key={npc.id} className="entity-chip-pill" style={{ borderLeft: '3px solid #2ecc71' }}>
                                    {npc.icon ? (
                                      <img src={npc.icon} alt="" className="entity-chip-pill-icon" />
                                    ) : (
                                      <i className="fas fa-user" style={{ color: '#2ecc71', fontSize: '11px' }}></i>
                                    )}
                                    <span className="entity-chip-pill-name">{npc.name}</span>
                                    {npc.relationship && (
                                      <span className="entity-picker-source-badge" style={{ fontSize: '0.6rem', padding: '0 4px', background: 'rgba(46, 204, 113, 0.15)', borderColor: '#2ecc71', color: '#27ae60' }}>
                                        {formatTag(npc.relationship)}
                                      </span>
                                    )}
                                    {String(quest.giverNpcId) === String(npc.id) && (
                                      <span className="entity-picker-source-badge" style={{ fontSize: '0.58rem', padding: '0 3px', background: 'rgba(212, 175, 55, 0.2)', borderColor: '#d4af37', color: '#8b5a1a' }}>
                                        Giver
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      className="entity-chip-remove"
                                      onClick={() => {
                                        const updatedIds = (quest.npcIds || []).filter(id => String(id) !== String(npc.id));
                                        const updates = { npcIds: updatedIds };
                                        if (String(quest.giverNpcId) === String(npc.id)) {
                                          updates.giverNpcId = '';
                                        }
                                        updateQuest(quest.id, updates);
                                        updateNPC(npc.id, { questIds: (npc.questIds || []).filter(id => String(id) !== String(quest.id)) });
                                      }}
                                      title="Untie NPC"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </span>
                                ))}
                                {linkedNPCs.length === 0 && (
                                  <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No NPCs tied to this quest</span>
                                )}
                              </div>
                            </div>

                            {/* Tied Locations Rack */}
                            <div className="entity-chips-rack">
                              <div className="entity-rack-header">
                                <span><i className="fas fa-map-marker-alt" style={{ color: '#e67e22' }}></i> Tied Locations ({linkedLocations.length})</span>
                                <button
                                  type="button"
                                  className="entity-chip-add-btn"
                                  style={{ borderColor: '#e67e22', color: '#d35400' }}
                                  onClick={() => openLinkerModal(
                                    `Tie Locations to ${quest.title || 'Quest'}`,
                                    getAllCampaignLocations(),
                                    quest.locationIds || [],
                                    (newIds) => {
                                      updateQuest(quest.id, { locationIds: newIds });
                                      (campaignData.locations || []).forEach(l => {
                                        const currentQuestIds = l.questIds || [];
                                        const isLinked = newIds.some(id => String(id) === String(l.id));
                                        const hasQuest = currentQuestIds.some(id => String(id) === String(quest.id));
                                        if (isLinked && !hasQuest) {
                                          updateLocation(l.id, { questIds: [...currentQuestIds, quest.id] });
                                        } else if (!isLinked && hasQuest) {
                                          updateLocation(l.id, { questIds: currentQuestIds.filter(id => String(id) !== String(quest.id)) });
                                        }
                                      });
                                    }
                                  )}
                                >
                                  <i className="fas fa-plus"></i> Tie Location
                                </button>
                              </div>
                              <div className="entity-chips-list">
                                {linkedLocations.map(loc => (
                                  <span key={loc.id} className="entity-chip-pill" style={{ borderLeft: '3px solid #e67e22' }}>
                                    {loc.icon ? (
                                      <img src={loc.icon} alt="" className="entity-chip-pill-icon" />
                                    ) : (
                                      <i className="fas fa-map-marker-alt" style={{ color: '#e67e22', fontSize: '11px' }}></i>
                                    )}
                                    <span className="entity-chip-pill-name">{loc.name}</span>
                                    {loc.type && (
                                      <span className="entity-picker-source-badge" style={{ fontSize: '0.6rem', padding: '0 4px', background: 'rgba(230, 126, 34, 0.15)', borderColor: '#e67e22', color: '#d35400' }}>
                                        {formatTag(loc.type)}
                                      </span>
                                    )}
                                    {String(quest.primaryLocationId) === String(loc.id) && (
                                      <span className="entity-picker-source-badge" style={{ fontSize: '0.58rem', padding: '0 3px', background: 'rgba(212, 175, 55, 0.2)', borderColor: '#d4af37', color: '#8b5a1a' }}>
                                        Primary
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      className="entity-chip-remove"
                                      onClick={() => {
                                        const updatedIds = (quest.locationIds || []).filter(id => String(id) !== String(loc.id));
                                        const updates = { locationIds: updatedIds };
                                        if (String(quest.primaryLocationId) === String(loc.id)) {
                                          updates.primaryLocationId = '';
                                        }
                                        updateQuest(quest.id, updates);
                                        updateLocation(loc.id, { questIds: (loc.questIds || []).filter(id => String(id) !== String(quest.id)) });
                                      }}
                                      title="Untie Location"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </span>
                                ))}
                                {linkedLocations.length === 0 && (
                                  <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No locations tied to this quest</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-scroll"></i>
                    <p>
                      {(campaignData.quests || []).length === 0
                        ? 'No quests recorded yet. Click + New Quest to add story missions and contracts!'
                        : 'No quests match your active filter / search query.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ============ PLOT THREADS ============ */}
        {activeSection === 'plots' && (() => {
          const filteredPlots = (campaignData.plotThreads || []).filter(plot => {
            if (plotFilterType !== 'all' && (plot.type || 'main') !== plotFilterType) return false;
            if (plotFilterStatus !== 'all' && (plot.status || 'active') !== plotFilterStatus) return false;
            if (plotSearchQuery.trim()) {
              const q = plotSearchQuery.toLowerCase();
              const matchTitle = (plot.title || '').toLowerCase().includes(q);
              const matchDesc = (plot.description || '').toLowerCase().includes(q);
              const matchStage = (plot.stage || '').toLowerCase().includes(q);
              if (!matchTitle && !matchDesc && !matchStage) return false;
            }
            if (selectedTimelinePlotId !== 'all' && String(plot.id) !== String(selectedTimelinePlotId)) return false;
            return true;
          });

          const calculatePlotProgress = (plot) => {
            const beats = plot.beats || [];
            if (beats.length === 0) return 0;
            const completedBeats = beats.filter(b => b.status === 'completed').length;
            return Math.round((completedBeats / beats.length) * 100);
          };

          return (
            <div className="list-section">
              <div className="section-header">
                <div>
                  <h3>Plot Thread Management & Story Loom</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#8b5a1a' }}>
                    Weave campaign storylines, track narrative arcs, connect quests, NPCs & locations, and chart sequential story beats.
                  </p>
                </div>
                <div className="section-header-actions" style={{ display: 'flex', gap: '8px' }}>
                  <button className="add-btn" onClick={() => addPlotThread('main')}>
                    <i className="fas fa-crown"></i> + Main Arc
                  </button>
                  <button className="add-btn" style={{ background: '#6b350e' }} onClick={() => addPlotThread('side')}>
                    <i className="fas fa-plus"></i> + Subplot
                  </button>
                </div>
              </div>

              {/* View Modes & Filter Toolbar */}
              <div className="plot-toolbar-container">
                <div className="plot-view-modes">
                  <button
                    type="button"
                    className={`plot-view-btn ${plotViewMode === 'timeline' ? 'active' : ''}`}
                    onClick={() => setPlotViewMode('timeline')}
                    title="Interactive Thread Flow & Storyline Progression"
                  >
                    <i className="fas fa-timeline"></i> Thread Flow
                  </button>
                  <button
                    type="button"
                    className={`plot-view-btn ${plotViewMode === 'corkboard' ? 'active' : ''}`}
                    onClick={() => setPlotViewMode('corkboard')}
                    title="Story Web & Investigation Pinboard"
                  >
                    <i className="fas fa-network-wired"></i> Story Web
                  </button>
                  <button
                    type="button"
                    className={`plot-view-btn ${plotViewMode === 'cards' ? 'active' : ''}`}
                    onClick={() => setPlotViewMode('cards')}
                    title="Dossier Cards & Entity Breakdown"
                  >
                    <i className="fas fa-address-card"></i> Dossier Cards
                  </button>
                  <button
                    type="button"
                    className={`plot-view-btn ${plotViewMode === 'matrix' ? 'active' : ''}`}
                    onClick={() => setPlotViewMode('matrix')}
                    title="High-level Matrix Overview"
                  >
                    <i className="fas fa-table-cells"></i> Matrix Overview
                  </button>
                </div>

                <div className="plot-filter-group">
                  <div className="plot-search-box">
                    <i className="fas fa-search plot-search-icon"></i>
                    <input
                      type="text"
                      placeholder="Search plot threads..."
                      value={plotSearchQuery}
                      onChange={(e) => setPlotSearchQuery(e.target.value)}
                      className="plot-search-input"
                    />
                    {plotSearchQuery && (
                      <button
                        type="button"
                        className="plot-search-clear"
                        onClick={() => setPlotSearchQuery('')}
                        title="Clear search"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                  <select
                    value={plotFilterType}
                    onChange={(e) => setPlotFilterType(e.target.value)}
                    className="plot-filter-select"
                  >
                    <option value="all">All Thread Types</option>
                    <option value="main">Main Story Arcs</option>
                    <option value="character">Character Arcs</option>
                    <option value="faction">Faction Intrigues</option>
                    <option value="world">World Events / Threats</option>
                    <option value="side">Side Mysteries</option>
                  </select>
                  <select
                    value={plotFilterStatus}
                    onChange={(e) => setPlotFilterStatus(e.target.value)}
                    className="plot-filter-select"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="resolved">Resolved</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                  {plotViewMode === 'timeline' && (campaignData.plotThreads || []).length > 1 && (
                    <select
                      value={selectedTimelinePlotId}
                      onChange={(e) => setSelectedTimelinePlotId(e.target.value)}
                      className="plot-filter-select focus-thread-select"
                    >
                      <option value="all">View All Threads</option>
                      {(campaignData.plotThreads || []).map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  )}
                  {(plotSearchQuery || plotFilterType !== 'all' || plotFilterStatus !== 'all' || (selectedTimelinePlotId && selectedTimelinePlotId !== 'all')) && (
                    <button
                      type="button"
                      className="plot-filter-reset-btn"
                      onClick={() => {
                        setPlotSearchQuery('');
                        setPlotFilterType('all');
                        setPlotFilterStatus('all');
                        setSelectedTimelinePlotId('all');
                      }}
                      title="Reset all filters"
                    >
                      <i className="fas fa-undo"></i> Reset
                    </button>
                  )}
                </div>
              </div>

              {/* ============ VIEW 1: THREAD FLOW (STORY LOOM / TIMELINE) ============ */}
              {plotViewMode === 'timeline' && (
                <div className="plot-thread-flow-layout">
                  {filteredPlots.length > 0 ? (
                    filteredPlots.map(plot => {
                      const beats = plot.beats || [];
                      const progressPct = calculatePlotProgress(plot);
                      const linkedQuests = getLinkedQuests(plot.questIds);
                      const linkedLocs = getLinkedLocations(plot.locationIds);
                      const linkedNPCs = getLinkedNPCs(plot.npcIds);
                      const linkedLore = getLinkedLore(plot.loreIds);
                      const plotType = plot.type || 'main';

                      return (
                        <div key={plot.id} className="plot-thread-lane">
                          {/* Thread Hero Header */}
                          <div className="plot-thread-hero">
                            <div className="plot-thread-hero-top">
                              <div className="plot-thread-title-area">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span className={`plot-thread-type-pill type-${plotType}`}>
                                    <i className={`fas ${plotType === 'character' ? 'fa-user-ninja' : plotType === 'faction' ? 'fa-shield-halved' : plotType === 'world' ? 'fa-meteor' : plotType === 'side' ? 'fa-magnifying-glass' : 'fa-crown'}`}></i>
                                    {plotType === 'character' ? 'Character Arc' : plotType === 'faction' ? 'Faction Intrigue' : plotType === 'world' ? 'World Event' : plotType === 'side' ? 'Side Mystery' : 'Main Arc'}
                                  </span>
                                  <select
                                    value={plot.type || 'main'}
                                    onChange={(e) => updatePlotThread(plot.id, { type: e.target.value })}
                                    className="plot-filter-select"
                                    style={{ fontSize: '0.75rem', padding: '2px 6px', height: '24px' }}
                                  >
                                    <option value="main">Main Arc</option>
                                    <option value="character">Character Arc</option>
                                    <option value="faction">Faction Intrigue</option>
                                    <option value="world">World Event</option>
                                    <option value="side">Side Mystery</option>
                                  </select>
                                  <select
                                    value={plot.status || 'active'}
                                    onChange={(e) => updatePlotThread(plot.id, { status: e.target.value })}
                                    className="plot-filter-select"
                                    style={{ fontSize: '0.75rem', padding: '2px 6px', height: '24px' }}
                                  >
                                    <option value="active">Active</option>
                                    <option value="on-hold">On Hold</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="abandoned">Abandoned</option>
                                  </select>
                                  <select
                                    value={plot.priority || 'medium'}
                                    onChange={(e) => updatePlotThread(plot.id, { priority: e.target.value })}
                                    className={`plot-filter-select priority-${plot.priority}`}
                                    style={{ fontSize: '0.75rem', padding: '2px 6px', height: '24px' }}
                                  >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                    <option value="critical">Critical Priority</option>
                                  </select>
                                </div>
                                <input
                                  type="text"
                                  value={plot.title}
                                  onChange={(e) => updatePlotThread(plot.id, { title: e.target.value })}
                                  placeholder="Plot thread title..."
                                  className="plot-thread-title-input"
                                />
                                <textarea
                                  value={plot.description || ''}
                                  onChange={(e) => updatePlotThread(plot.id, { description: e.target.value })}
                                  placeholder="Describe the storyline premise, stakes, conspiracies, and narrative arc..."
                                  rows={1}
                                  className="plot-thread-summary-input"
                                />
                              </div>

                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  className="entity-chip-add-btn"
                                  onClick={() => addPlotBeat(plot.id, 'clue')}
                                  title="Add new story milestone beat"
                                >
                                  <i className="fas fa-plus"></i> Add Beat
                                </button>
                                <button
                                  type="button"
                                  className="remove-card-btn"
                                  onClick={() => removePlotThread(plot.id)}
                                  title="Delete this plot thread"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            </div>

                            {/* Progress Bar & Quick Stats */}
                            <div className="plot-thread-progress-wrapper">
                              <span className="plot-thread-progress-text">
                                <i className="fas fa-spinner" style={{ color: '#d4af37' }}></i> {beats.filter(b => b.status === 'completed').length}/{beats.length} Beats ({progressPct}%)
                              </span>
                              <div className="plot-thread-progress-bar-bg">
                                <div className="plot-thread-progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
                              </div>
                              <div className="plot-thread-stats-ribbon">
                                <span
                                  className="plot-thread-stat-badge"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => openLinkerModal(`Link Quests for ${plot.title}`, getAllCampaignQuests(), plot.questIds || [], (newIds) => updatePlotThread(plot.id, { questIds: newIds }))}
                                  title="Click to manage linked Quests"
                                >
                                  <i className="fas fa-scroll" style={{ color: '#f39c12' }}></i> {linkedQuests.length} Quests
                                </span>
                                <span
                                  className="plot-thread-stat-badge"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => openLinkerModal(`Link NPCs for ${plot.title}`, getAllCampaignNPCs(), plot.npcIds || [], (newIds) => updatePlotThread(plot.id, { npcIds: newIds }))}
                                  title="Click to manage linked Key NPCs"
                                >
                                  <i className="fas fa-users" style={{ color: '#2ecc71' }}></i> {linkedNPCs.length} NPCs
                                </span>
                                <span
                                  className="plot-thread-stat-badge"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => openLinkerModal(`Link Locations for ${plot.title}`, getAllCampaignLocations(), plot.locationIds || [], (newIds) => updatePlotThread(plot.id, { locationIds: newIds }))}
                                  title="Click to manage linked Locations & Stages"
                                >
                                  <i className="fas fa-map-marker-alt" style={{ color: '#e67e22' }}></i> {linkedLocs.length} Locations
                                </span>
                                <span
                                  className="plot-thread-stat-badge"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => openLinkerModal(`Link Clues & Lore for ${plot.title}`, getAllCampaignLore(), plot.loreIds || [], (newIds) => updatePlotThread(plot.id, { loreIds: newIds }))}
                                  title="Click to manage linked Lore & Clues"
                                >
                                  <i className="fas fa-book-open" style={{ color: '#3498db' }}></i> {linkedLore.length} Clues
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* The Narrative Loom Spine (Visual Sequential Beats) */}
                          <div className="plot-thread-spine-container">
                            <div className="plot-thread-spine-line"></div>

                            {beats.map((beat, index) => {
                              const beatStatus = beat.status || 'pending';
                              const beatType = beat.type || 'clue';

                              return (
                                <div key={beat.id} className="plot-beat-row">
                                  {/* Milestone Marker */}
                                  <div
                                    className={`plot-beat-marker status-${beatStatus}`}
                                    onClick={() => {
                                      const nextStatus = beatStatus === 'pending' ? 'active' : beatStatus === 'active' ? 'completed' : beatStatus === 'completed' ? 'failed' : 'pending';
                                      updatePlotBeat(plot.id, beat.id, { status: nextStatus });
                                    }}
                                    title={`Step ${index + 1}: ${beatStatus.toUpperCase()} (Click to cycle status)`}
                                  >
                                    {beatStatus === 'completed' ? (
                                      <i className="fas fa-check"></i>
                                    ) : beatStatus === 'active' ? (
                                      <i className="fas fa-play" style={{ fontSize: '0.7rem' }}></i>
                                    ) : beatStatus === 'failed' ? (
                                      <i className="fas fa-times"></i>
                                    ) : (
                                      <span>{index + 1}</span>
                                    )}
                                  </div>

                                  {/* Beat Card */}
                                  <div className="plot-beat-card">
                                    <div className="plot-beat-card-header">
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                                        <select
                                          value={beat.type || 'clue'}
                                          onChange={(e) => updatePlotBeat(plot.id, beat.id, { type: e.target.value })}
                                          className={`plot-beat-type-tag type-${beatType}`}
                                          style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                                        >
                                          <option value="hook">Clue / Hook</option>
                                          <option value="clue">Investigation</option>
                                          <option value="encounter">Encounter</option>
                                          <option value="revelation">Revelation</option>
                                          <option value="decision">Major Decision</option>
                                          <option value="climax">Climax</option>
                                          <option value="resolution">Resolution</option>
                                        </select>
                                        <input
                                          type="text"
                                          value={beat.title}
                                          onChange={(e) => updatePlotBeat(plot.id, beat.id, { title: e.target.value })}
                                          placeholder="Story Beat Title..."
                                          className="plot-beat-title-input"
                                        />
                                      </div>

                                      <div className="plot-beat-actions">
                                        <select
                                          value={beat.status || 'pending'}
                                          onChange={(e) => updatePlotBeat(plot.id, beat.id, { status: e.target.value })}
                                          className="plot-filter-select"
                                          style={{ fontSize: '0.72rem', padding: '2px 5px', height: '22px' }}
                                        >
                                          <option value="pending">Pending</option>
                                          <option value="active">Active</option>
                                          <option value="completed">Completed</option>
                                          <option value="failed">Diverged / Failed</option>
                                        </select>
                                        <button
                                          type="button"
                                          className="plot-beat-btn-icon"
                                          onClick={() => movePlotBeat(plot.id, beat.id, 'up')}
                                          disabled={index === 0}
                                          title="Move Beat Up"
                                        >
                                          <i className="fas fa-arrow-up"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="plot-beat-btn-icon"
                                          onClick={() => movePlotBeat(plot.id, beat.id, 'down')}
                                          disabled={index === beats.length - 1}
                                          title="Move Beat Down"
                                        >
                                          <i className="fas fa-arrow-down"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="plot-beat-btn-icon danger"
                                          onClick={() => removePlotBeat(plot.id, beat.id)}
                                          title="Delete Beat"
                                        >
                                          <i className="fas fa-trash-alt"></i>
                                        </button>
                                      </div>
                                    </div>

                                    <textarea
                                      value={beat.description || ''}
                                      onChange={(e) => updatePlotBeat(plot.id, beat.id, { description: e.target.value })}
                                      placeholder="Describe what happens in this story beat, clues revealed, challenges faced, and branching outcomes..."
                                      className="plot-beat-desc-input"
                                    />

                                    {/* Direct Entity Attachments for this Beat */}
                                    <div className="plot-beat-entity-row">
                                      <span style={{ fontSize: '0.72rem', color: '#8b5a1a', fontWeight: 600 }}>
                                        <i className="fas fa-link"></i> Beat Links:
                                      </span>
                                      {/* Quest Link */}
                                      <select
                                        value={beat.questId || ''}
                                        onChange={(e) => {
                                          const qId = e.target.value;
                                          updatePlotBeat(plot.id, beat.id, { questId: qId });
                                          if (qId && !(plot.questIds || []).includes(qId)) {
                                            updatePlotThread(plot.id, { questIds: [...(plot.questIds || []), qId] });
                                          }
                                        }}
                                        className="plot-beat-entity-select"
                                      >
                                        <option value="">-- Attach Quest --</option>
                                        {(campaignData.quests || []).map(q => (
                                          <option key={q.id} value={q.id}>{q.title}</option>
                                        ))}
                                      </select>

                                      {/* Location Link */}
                                      <select
                                        value={beat.locationId || ''}
                                        onChange={(e) => {
                                          const locId = e.target.value;
                                          updatePlotBeat(plot.id, beat.id, { locationId: locId });
                                          if (locId && !(plot.locationIds || []).includes(locId)) {
                                            updatePlotThread(plot.id, { locationIds: [...(plot.locationIds || []), locId] });
                                          }
                                        }}
                                        className="plot-beat-entity-select"
                                      >
                                        <option value="">-- Attach Location --</option>
                                        {(campaignData.locations || []).map(loc => (
                                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                      </select>

                                      {/* NPC Link */}
                                      <select
                                        value={beat.npcId || ''}
                                        onChange={(e) => {
                                          const npcId = e.target.value;
                                          updatePlotBeat(plot.id, beat.id, { npcId: npcId });
                                          if (npcId && !(plot.npcIds || []).includes(npcId)) {
                                            updatePlotThread(plot.id, { npcIds: [...(plot.npcIds || []), npcId] });
                                          }
                                        }}
                                        className="plot-beat-entity-select"
                                      >
                                        <option value="">-- Attach NPC --</option>
                                        {(campaignData.npcs || []).map(n => (
                                          <option key={n.id} value={n.id}>{n.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Append Next Beat Button */}
                            <div className="plot-add-beat-row">
                              <div className="plot-add-beat-marker">
                                <i className="fas fa-plus"></i>
                              </div>
                              <button
                                type="button"
                                className="plot-add-beat-btn"
                                onClick={() => addPlotBeat(plot.id, 'clue')}
                              >
                                <i className="fas fa-plus-circle"></i> Add Next Story Beat
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-project-diagram"></i>
                      <p>No plot threads matching your filters. Create your first storyline or adjust filters above!</p>
                    </div>
                  )}
                </div>
              )}

              {/* ============ VIEW 2: CHRONICLE CARDS VIEW ============ */}
              {plotViewMode === 'cards' && (
                <div className="cards-grid">
                  {filteredPlots.length > 0 ? (
                    filteredPlots.map(plot => {
                      const currentTab = plotCardTabs[plot.id] || 'overview';
                      const setCardTab = (tab) => setPlotCardTabs(prev => ({ ...prev, [plot.id]: tab }));
                      const plotType = plot.type || 'main';

                      const linkedQuests = getLinkedQuests(plot.questIds);
                      const linkedNPCs = getLinkedNPCs(plot.npcIds);
                      const linkedLocs = getLinkedLocations(plot.locationIds);
                      const linkedLore = getLinkedLore(plot.loreIds);
                      const linkedItems = getLinkedItems(plot.itemIds);
                      const linkedCreatures = getLinkedCreatures(plot.monsterIds);

                      return (
                        <div key={plot.id} className="content-card plot-card">
                          {/* Top Hero Banner */}
                          <div className="card-media-banner-container">
                            {plot.image ? (
                              <div className="media-banner-preview">
                                <img src={plot.image} alt={plot.title} />
                                <div className="media-hover-overlay">
                                  <label className="media-change-btn" title="Change banner">
                                    <i className="fas fa-camera"></i> Change Banner
                                    <input
                                      type="file"
                                      accept="image/*"
                                      style={{ display: 'none' }}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleMediaUpload(file, 'banners', (url) => updatePlotThread(plot.id, { image: url }), plot.image);
                                      }}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    className="media-clear-btn-pill"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMediaRemove(plot.image, () => updatePlotThread(plot.id, { image: null }));
                                    }}
                                    title="Remove banner"
                                  >
                                    <i className="fas fa-trash-alt"></i> Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="media-banner-placeholder" title="Upload quest/plot artwork">
                                <i className="fas fa-scroll"></i>
                                <span>Upload Plot Banner</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleMediaUpload(file, 'banners', (url) => updatePlotThread(plot.id, { image: url }), plot.image);
                                  }}
                                />
                              </label>
                            )}
                          </div>

                          <div className="card-header-fields">
                            <div className="card-field-header-top">
                              <div className="field-group flex-1">
                                <label className="field-label"><i className="fas fa-feather"></i> Plot Title</label>
                                <input
                                  type="text"
                                  value={plot.title}
                                  onChange={(e) => updatePlotThread(plot.id, { title: e.target.value })}
                                  className="card-title-input full-width"
                                  placeholder="Plot thread title..."
                                />
                              </div>
                              <button className="remove-card-btn" onClick={() => removePlotThread(plot.id)} title="Delete Thread">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>

                            <div className="card-meta-grid-2col">
                              <div className="field-group">
                                <label className="field-label"><i className="fas fa-tag"></i> Arc Type</label>
                                <select
                                  value={plot.type || 'main'}
                                  onChange={(e) => updatePlotThread(plot.id, { type: e.target.value })}
                                  className="card-field-select"
                                >
                                  <option value="main">Main Story Arc</option>
                                  <option value="character">Character Arc</option>
                                  <option value="faction">Faction Intrigue</option>
                                  <option value="world">World Threat</option>
                                  <option value="side">Side Mystery</option>
                                </select>
                              </div>
                              <div className="field-group">
                                <label className="field-label"><i className="fas fa-bars-progress"></i> Status</label>
                                <select
                                  value={plot.status || 'active'}
                                  onChange={(e) => updatePlotThread(plot.id, { status: e.target.value })}
                                  className="card-field-select"
                                >
                                  <option value="active">Active</option>
                                  <option value="on-hold">On Hold</option>
                                  <option value="resolved">Resolved</option>
                                  <option value="abandoned">Abandoned</option>
                                </select>
                              </div>
                            </div>

                            <div className="card-meta-grid-2col" style={{ marginTop: '6px' }}>
                              <div className="field-group">
                                <label className="field-label"><i className="fas fa-circle-exclamation"></i> Priority</label>
                                <select
                                  value={plot.priority || 'medium'}
                                  onChange={(e) => updatePlotThread(plot.id, { priority: e.target.value })}
                                  className={`card-field-select priority-${plot.priority}`}
                                >
                                  <option value="low">Low Priority</option>
                                  <option value="medium">Medium Priority</option>
                                  <option value="high">High Priority</option>
                                  <option value="critical">Critical Priority</option>
                                </select>
                              </div>
                              <div className="field-group">
                                <label className="field-label"><i className="fas fa-stairs"></i> Stage / Act</label>
                                <input
                                  type="text"
                                  value={plot.stage || ''}
                                  onChange={(e) => updatePlotThread(plot.id, { stage: e.target.value })}
                                  placeholder="e.g. Act 1: The Whispering Plague"
                                  className="card-field-input"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Card Subtabs */}
                          <div className="plot-card-subtabs">
                            <button
                              type="button"
                              className={`plot-card-subtab-btn ${currentTab === 'overview' ? 'active' : ''}`}
                              onClick={() => setCardTab('overview')}
                            >
                              <i className="fas fa-book-open"></i> Overview
                            </button>
                            <button
                              type="button"
                              className={`plot-card-subtab-btn ${currentTab === 'beats' ? 'active' : ''}`}
                              onClick={() => setCardTab('beats')}
                            >
                              <i className="fas fa-timeline"></i> Beats ({(plot.beats || []).length})
                            </button>
                            <button
                              type="button"
                              className={`plot-card-subtab-btn ${currentTab === 'quests' ? 'active' : ''}`}
                              onClick={() => setCardTab('quests')}
                            >
                              <i className="fas fa-scroll"></i> Quests ({linkedQuests.length})
                            </button>
                            <button
                              type="button"
                              className={`plot-card-subtab-btn ${currentTab === 'npcs' ? 'active' : ''}`}
                              onClick={() => setCardTab('npcs')}
                            >
                              <i className="fas fa-users"></i> Cast ({linkedNPCs.length})
                            </button>
                            <button
                              type="button"
                              className={`plot-card-subtab-btn ${currentTab === 'stages' ? 'active' : ''}`}
                              onClick={() => setCardTab('stages')}
                            >
                              <i className="fas fa-map-marker-alt"></i> Places ({linkedLocs.length})
                            </button>
                            <button
                              type="button"
                              className={`plot-card-subtab-btn ${currentTab === 'clues' ? 'active' : ''}`}
                              onClick={() => setCardTab('clues')}
                            >
                              <i className="fas fa-key"></i> Clues & Lore ({linkedLore.length + linkedItems.length})
                            </button>
                          </div>

                          <div className="card-body-fields">
                            {currentTab === 'overview' && (
                              <>
                                <div className="field-group">
                                  <RichCampaignEditor
                                    label="Story Arc & Narrative Premise"
                                    icon="fa-book-open"
                                    value={plot.description || ''}
                                    onChange={(val) => updatePlotThread(plot.id, { description: val })}
                                    placeholder="Describe the storyline, underlying conspiracy, stakes..."
                                    rows={3}
                                    compact={true}
                                  />
                                </div>
                                <div className="field-group">
                                  <RichCampaignEditor
                                    label="GM Secrets, Branching Stakes & Notes"
                                    icon="fa-user-secret"
                                    value={plot.gmSecrets || plot.notes || ''}
                                    onChange={(val) => updatePlotThread(plot.id, { gmSecrets: val, notes: val })}
                                    placeholder="Hidden truths, villain motivations, timeline triggers, failure consequences..."
                                    rows={2}
                                    compact={true}
                                  />
                                </div>

                                {/* Quick Entity Summary Bar */}
                                <div className="loc-quick-entity-bar">
                                  <span className="loc-quick-pill" onClick={() => setCardTab('beats')}>
                                    <i className="fas fa-timeline" style={{ color: '#d4af37' }}></i> {(plot.beats || []).length} Story Beats
                                  </span>
                                  <span className="loc-quick-pill" onClick={() => setCardTab('quests')}>
                                    <i className="fas fa-scroll" style={{ color: '#f39c12' }}></i> {linkedQuests.length} Quests
                                  </span>
                                  <span className="loc-quick-pill" onClick={() => setCardTab('npcs')}>
                                    <i className="fas fa-users" style={{ color: '#2ecc71' }}></i> {linkedNPCs.length} Cast & NPCs
                                  </span>
                                  <span className="loc-quick-pill" onClick={() => setCardTab('stages')}>
                                    <i className="fas fa-map-marker-alt" style={{ color: '#e67e22' }}></i> {linkedLocs.length} Locations
                                  </span>
                                  <span className="loc-quick-pill" onClick={() => setCardTab('clues')}>
                                    <i className="fas fa-book-open" style={{ color: '#3498db' }}></i> {linkedLore.length} Clues
                                  </span>
                                </div>
                              </>
                            )}

                            {currentTab === 'beats' && (
                              <div className="entity-chips-rack">
                                <div className="entity-rack-header">
                                  <span><i className="fas fa-timeline"></i> Storyline Beats & Milestones ({(plot.beats || []).length})</span>
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn"
                                    onClick={() => addPlotBeat(plot.id, 'clue')}
                                  >
                                    <i className="fas fa-plus"></i> Add Beat
                                  </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {(plot.beats || []).map((b, idx) => (
                                    <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fdfbf7', border: '1px solid rgba(139,69,19,0.15)', borderRadius: '4px', padding: '4px 8px' }}>
                                      <input
                                        type="checkbox"
                                        checked={b.status === 'completed'}
                                        onChange={(e) => updatePlotBeat(plot.id, b.id, { status: e.target.checked ? 'completed' : 'pending' })}
                                        style={{ cursor: 'pointer' }}
                                      />
                                      <input
                                        type="text"
                                        value={b.title}
                                        onChange={(e) => updatePlotBeat(plot.id, b.id, { title: e.target.value })}
                                        placeholder="Beat title..."
                                        style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.8rem', textDecoration: b.status === 'completed' ? 'line-through' : 'none', color: b.status === 'completed' ? '#888' : '#2d1810', fontWeight: 600 }}
                                      />
                                      <select
                                        value={b.type || 'clue'}
                                        onChange={(e) => updatePlotBeat(plot.id, b.id, { type: e.target.value })}
                                        className={`plot-beat-type-tag type-${b.type || 'clue'}`}
                                        style={{ border: 'none', cursor: 'pointer', padding: '1px 5px' }}
                                      >
                                        <option value="hook">Hook</option>
                                        <option value="clue">Investigation</option>
                                        <option value="encounter">Encounter</option>
                                        <option value="revelation">Revelation</option>
                                        <option value="decision">Decision</option>
                                        <option value="climax">Climax</option>
                                        <option value="resolution">Resolution</option>
                                      </select>
                                      <button
                                        type="button"
                                        onClick={() => removePlotBeat(plot.id, b.id)}
                                        style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '0.7rem' }}
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </div>
                                  ))}
                                  {(!plot.beats || plot.beats.length === 0) && (
                                    <span style={{ fontSize: '0.75rem', color: '#a08c70', fontStyle: 'italic' }}>No story beats charted yet</span>
                                  )}
                                </div>
                              </div>
                            )}

                            {currentTab === 'quests' && (
                              <div className="entity-chips-rack">
                                <div className="entity-rack-header">
                                  <span><i className="fas fa-scroll"></i> Connected Quests ({linkedQuests.length})</span>
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn quest-btn"
                                    onClick={() => openLinkerModal(
                                      `Link Quests to ${plot.title}`,
                                      getAllCampaignQuests(),
                                      plot.questIds || [],
                                      (newIds) => updatePlotThread(plot.id, { questIds: newIds })
                                    )}
                                  >
                                    <i className="fas fa-link"></i> Link Quests
                                  </button>
                                </div>
                                <div className="entity-chips-list">
                                  {linkedQuests.map(q => (
                                    <span key={q.id} className="entity-chip-pill" style={{ borderLeft: '3px solid #f39c12' }}>
                                      <i className="fas fa-scroll" style={{ color: '#f39c12', fontSize: '11px' }}></i>
                                      <span className="entity-chip-pill-name">{q.title}</span>
                                      <span className="entity-picker-source-badge" style={{ fontSize: '0.6rem', padding: '0 4px', background: 'rgba(243, 156, 18, 0.15)', color: '#b95c00' }}>
                                        {q.status || 'Active'}
                                      </span>
                                      <button
                                        type="button"
                                        className="entity-chip-remove"
                                        onClick={() => updatePlotThread(plot.id, { questIds: (plot.questIds || []).filter(id => String(id) !== String(q.id)) })}
                                        title="Unlink Quest"
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </span>
                                  ))}
                                  {linkedQuests.length === 0 && (
                                    <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No quests linked to this thread</span>
                                  )}
                                </div>
                              </div>
                            )}

                            {currentTab === 'npcs' && (
                              <div className="entity-chips-rack">
                                <div className="entity-rack-header">
                                  <span><i className="fas fa-users"></i> Key Characters & Cast ({linkedNPCs.length})</span>
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn npc-btn"
                                    onClick={() => openLinkerModal(
                                      `Link NPCs to ${plot.title}`,
                                      getAllCampaignNPCs(),
                                      plot.npcIds || [],
                                      (newIds) => updatePlotThread(plot.id, { npcIds: newIds })
                                    )}
                                  >
                                    <i className="fas fa-link"></i> Link NPCs
                                  </button>
                                </div>
                                <div className="entity-chips-list">
                                  {linkedNPCs.map(n => (
                                    <span key={n.id} className="entity-chip-pill npc-chip">
                                      <i className="fas fa-user" style={{ color: '#2ecc71', fontSize: '11px' }}></i>
                                      <span className="entity-chip-pill-name">{n.name}</span>
                                      {n.role && (
                                        <span className="entity-picker-source-badge" style={{ fontSize: '0.6rem', padding: '0 4px', background: 'rgba(46, 204, 113, 0.15)', color: '#27ae60' }}>
                                          {n.role}
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        className="entity-chip-remove"
                                        onClick={() => updatePlotThread(plot.id, { npcIds: (plot.npcIds || []).filter(id => String(id) !== String(n.id)) })}
                                        title="Unlink NPC"
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </span>
                                  ))}
                                  {linkedNPCs.length === 0 && (
                                    <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No key characters linked</span>
                                  )}
                                </div>
                              </div>
                            )}

                            {currentTab === 'stages' && (
                              <div className="entity-chips-rack">
                                <div className="entity-rack-header">
                                  <span><i className="fas fa-map-marker-alt"></i> Key Stages & Locations ({linkedLocs.length})</span>
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn location-btn"
                                    onClick={() => openLinkerModal(
                                      `Link Locations to ${plot.title}`,
                                      getAllCampaignLocations(),
                                      plot.locationIds || [],
                                      (newIds) => updatePlotThread(plot.id, { locationIds: newIds })
                                    )}
                                  >
                                    <i className="fas fa-link"></i> Link Locations
                                  </button>
                                </div>
                                <div className="entity-chips-list">
                                  {linkedLocs.map(loc => (
                                    <span key={loc.id} className="entity-chip-pill loc-chip">
                                      <i className="fas fa-map-marker-alt" style={{ color: '#e67e22', fontSize: '11px' }}></i>
                                      <span className="entity-chip-pill-name">{loc.name}</span>
                                      <button
                                        type="button"
                                        className="entity-chip-remove"
                                        onClick={() => updatePlotThread(plot.id, { locationIds: (plot.locationIds || []).filter(id => String(id) !== String(loc.id)) })}
                                        title="Unlink Location"
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </span>
                                  ))}
                                  {linkedLocs.length === 0 && (
                                    <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No stages or locations linked</span>
                                  )}
                                </div>
                              </div>
                            )}

                            {currentTab === 'clues' && (
                              <div className="entity-chips-rack">
                                <div className="entity-rack-header">
                                  <span><i className="fas fa-book-open"></i> Clues, Relics & Codex ({linkedLore.length + linkedItems.length})</span>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                      type="button"
                                      className="entity-chip-add-btn lore-btn"
                                      onClick={() => openLinkerModal(
                                        `Link Lore & Handouts to ${plot.title}`,
                                        getAllCampaignLore(),
                                        plot.loreIds || [],
                                        (newIds) => updatePlotThread(plot.id, { loreIds: newIds })
                                      )}
                                    >
                                      <i className="fas fa-scroll"></i> Lore
                                    </button>
                                    <button
                                      type="button"
                                      className="entity-chip-add-btn"
                                      onClick={() => openLinkerModal(
                                        `Link Key Artifacts to ${plot.title}`,
                                        getAllCampaignItems(),
                                        plot.itemIds || [],
                                        (newIds) => updatePlotThread(plot.id, { itemIds: newIds })
                                      )}
                                    >
                                      <i className="fas fa-gem"></i> Artifacts
                                    </button>
                                  </div>
                                </div>
                                <div className="entity-chips-list">
                                  {linkedLore.map(l => (
                                    <span key={l.id} className="entity-chip-pill lore-chip">
                                      <i className="fas fa-scroll" style={{ color: '#3498db', fontSize: '11px' }}></i>
                                      <span className="entity-chip-pill-name">{l.title}</span>
                                      <button
                                        type="button"
                                        className="entity-chip-remove"
                                        onClick={() => updatePlotThread(plot.id, { loreIds: (plot.loreIds || []).filter(id => String(id) !== String(l.id)) })}
                                        title="Unlink Lore"
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </span>
                                  ))}
                                  {linkedItems.map(i => (
                                    <span key={i.id} className="entity-chip-pill item-chip">
                                      <i className="fas fa-gem" style={{ color: '#d4af37', fontSize: '11px' }}></i>
                                      <span className="entity-chip-pill-name">{i.name}</span>
                                      <button
                                        type="button"
                                        className="entity-chip-remove"
                                        onClick={() => updatePlotThread(plot.id, { itemIds: (plot.itemIds || []).filter(id => String(id) !== String(i.id)) })}
                                        title="Unlink Item"
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </span>
                                  ))}
                                  {linkedLore.length === 0 && linkedItems.length === 0 && (
                                    <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No clues or relics attached</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-project-diagram"></i>
                      <p>No plot threads match your search or filters.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ============ VIEW 3: STORY MATRIX VIEW ============ */}
              {plotViewMode === 'matrix' && (
                <div className="plot-matrix-container">
                  <table className="plot-matrix-table">
                    <thead>
                      <tr>
                        <th>Plot Thread</th>
                        <th>Type & Priority</th>
                        <th>Status & Progress</th>
                        <th>Connected Quests</th>
                        <th>Key NPCs</th>
                        <th>Key Locations</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlots.length > 0 ? (
                        filteredPlots.map(plot => {
                          const progressPct = calculatePlotProgress(plot);
                          const linkedQuests = getLinkedQuests(plot.questIds);
                          const linkedNPCs = getLinkedNPCs(plot.npcIds);
                          const linkedLocs = getLinkedLocations(plot.locationIds);
                          const plotType = plot.type || 'main';

                          return (
                            <tr key={plot.id}>
                              <td>
                                <div style={{ fontWeight: 700, color: '#2d1810', fontSize: '0.95rem' }}>{plot.title}</div>
                                <div style={{ fontSize: '0.75rem', color: '#8b5a1a', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {plot.description || 'No description'}
                                </div>
                              </td>
                              <td>
                                <span className={`plot-thread-type-pill type-${plotType}`} style={{ fontSize: '0.65rem' }}>
                                  {plotType.toUpperCase()}
                                </span>
                                <div style={{ fontSize: '0.75rem', color: '#5a3010', marginTop: '2px', textTransform: 'capitalize' }}>
                                  {plot.priority || 'medium'} Priority
                                </div>
                              </td>
                              <td>
                                <div style={{ fontWeight: 600, color: '#2d1810', textTransform: 'capitalize', fontSize: '0.8rem' }}>
                                  {plot.status || 'active'}
                                </div>
                                <div style={{ width: '90px', height: '6px', background: '#e0d5c1', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
                                  <div style={{ height: '100%', width: `${progressPct}%`, background: '#27ae60' }}></div>
                                </div>
                                <span style={{ fontSize: '0.68rem', color: '#7a583e' }}>{progressPct}% Done</span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', maxWidth: '180px' }}>
                                  {linkedQuests.map(q => (
                                    <span key={q.id} className="plot-thread-stat-badge" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                                      {q.title}
                                    </span>
                                  ))}
                                  {linkedQuests.length === 0 && <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>None</span>}
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', maxWidth: '180px' }}>
                                  {linkedNPCs.map(n => (
                                    <span key={n.id} className="plot-thread-stat-badge" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                                      {n.name}
                                    </span>
                                  ))}
                                  {linkedNPCs.length === 0 && <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>None</span>}
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', maxWidth: '180px' }}>
                                  {linkedLocs.map(l => (
                                    <span key={l.id} className="plot-thread-stat-badge" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                                      {l.name}
                                    </span>
                                  ))}
                                  {linkedLocs.length === 0 && <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>None</span>}
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn"
                                    onClick={() => {
                                      setSelectedTimelinePlotId(plot.id);
                                      setPlotViewMode('timeline');
                                    }}
                                    title="Open in Thread Flow Timeline"
                                  >
                                    <i className="fas fa-timeline"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="plot-beat-btn-icon danger"
                                    onClick={() => removePlotThread(plot.id)}
                                    title="Delete Thread"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: '#8b5a1a', fontStyle: 'italic' }}>
                            No plot threads match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ============ VIEW 4: CONSPIRACY CORKBOARD (PEPE SILVIA RED YARN WEB) ============ */}
              {plotViewMode === 'corkboard' && (
                <PlotConspiracyBoard
                  campaignData={campaignData}
                  updateCampaignData={updateCampaignData}
                  onOpenEntity={(entityNode) => {
                    if (entityNode.entityType === 'plot') {
                      setSelectedTimelinePlotId(entityNode.entityId);
                      setPlotViewMode('timeline');
                    } else if (entityNode.entityType === 'npc') {
                      setActiveSection('npcs');
                    } else if (entityNode.entityType === 'quest') {
                      setActiveSection('quests');
                    } else if (entityNode.entityType === 'location') {
                      setActiveSection('locations');
                    }
                  }}
                />
              )}
            </div>
          );
        })()}

        {/* ============ DYNASTY TREES ============ */}
        {activeSection === 'dynasties' && (
          <div className="dynasty-trees-campaign-container" style={{ height: 'calc(100vh - 200px)', minHeight: '620px', width: '100%', position: 'relative' }}>
            <ErrorBoundary name="DynastyTreesStudio">
              <FamilyTreeStudio inline={true} />
            </ErrorBoundary>
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
              <button className={`homebrew-subtab ${homebrewSubTab === 'lineages' ? 'active' : ''}`} onClick={() => setHomebrewSubTab('lineages')}>
                <i className="fas fa-dna"></i> Lineages & Species ({useCustomLineageStore.getState().getAllLineages().length})
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
                    <div className="campaign-library-section">
                      <div className="campaign-library-section-header">
                        <h4 className="subsection-title">
                          <i className="fas fa-book"></i> From Library ({campaignData.selectedItems.length})
                        </h4>
                        <span className="campaign-library-hint">Hover for item compendium details</span>
                      </div>
                      <div className="campaign-inventory-grid">
                        {(campaignData.selectedItems || []).map(item => {
                          const hasNotes = !!(item.notes && item.notes.trim());
                          const isNoteOpen = !!expandedNotes[item.id];
                          const qualityClass = getItemQualityClass(item.quality);
                          return (
                            <div
                              key={item.id}
                              className={`campaign-library-slot-card ${isNoteOpen ? 'note-expanded' : ''}`}
                              onMouseEnter={(e) => handleMouseEnter(e, item, null, null)}
                              onMouseMove={handleMouseMove}
                              onMouseLeave={handleMouseLeave}
                            >
                              <div className="campaign-slot-main-row">
                                <div className={`campaign-slot-icon-frame ${qualityClass}`}>
                                  <img
                                    src={resolveLibraryItemIcon(item)}
                                    alt={item.name}
                                    onError={(e) => {
                                      e.target.src = getIconUrl('inv_misc_questionmark', 'items');
                                    }}
                                  />
                                  <span className={`quality-glow ${qualityClass}`}></span>
                                </div>
                                <div className="campaign-slot-info">
                                  <span className={`campaign-slot-name ${qualityClass}`}>
                                    {item.name}
                                  </span>
                                  <div className="campaign-slot-tags">
                                    <span className={`rarity-badge rarity-${(item.quality || 'common').toLowerCase()}`}>{item.quality || 'Common'}</span>
                                    <span className="campaign-slot-tag">{formatTag(item.type)}</span>
                                    {item.subtype && <span className="campaign-slot-tag">{formatTag(item.subtype)}</span>}
                                  </div>
                                </div>
                                <div className="campaign-slot-actions">
                                  <button
                                    type="button"
                                    className={`campaign-slot-action-btn note-btn ${hasNotes ? 'has-notes' : ''} ${isNoteOpen ? 'active' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleNote(item.id);
                                    }}
                                    title={hasNotes ? 'View/Edit Campaign Notes' : 'Add Campaign Note'}
                                  >
                                    <i className="fas fa-feather-alt"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="campaign-slot-action-btn remove-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeLibraryItem(item.id);
                                    }}
                                    title="Remove from Campaign"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              </div>

                              {isNoteOpen && (
                                <div className="campaign-slot-note-drawer" onClick={(e) => e.stopPropagation()}>
                                  <textarea
                                    value={item.notes || ''}
                                    onChange={(e) => {
                                      const updated = (campaignData.selectedItems || []).map(i =>
                                        i.id === item.id ? { ...i, notes: e.target.value } : i
                                      );
                                      updateCampaignData({ selectedItems: updated });
                                    }}
                                    placeholder="Private campaign / DM notes for this item..."
                                    rows={2}
                                    className="campaign-slot-note-input"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom Homebrew Items */}
                  <div className="homebrew-items-section">
                    {(campaignData.homebrew?.items || []).length > 0 && (
                      <h4 className="subsection-title">
                        <i className="fas fa-hammer"></i> Custom Homebrew Items ({campaignData.homebrew.items.length})
                      </h4>
                    )}
                    <div className="cards-grid">
                      {(campaignData.homebrew?.items || []).length > 0 ? (
                        (campaignData.homebrew?.items || []).map(item => (
                          <div key={item.id} className="content-card homebrew-craft-card campaign-parchment-card">
                            {/* Header Row */}
                            <div className="homebrew-craft-header">
                              <div className={`homebrew-craft-icon-frame type-${item.type || 'weapon'}`}>
                                <i className={`fas ${getItemTypeIcon(item.type)}`}></i>
                              </div>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateHomebrewItem(item.id, { name: e.target.value })}
                                className="homebrew-craft-title"
                                placeholder="Custom Item Name..."
                              />
                              <div className="homebrew-craft-meta">
                                <select
                                  value={item.type || 'weapon'}
                                  onChange={(e) => updateHomebrewItem(item.id, { type: e.target.value })}
                                  className="homebrew-select-chip type-select"
                                >
                                  <option value="weapon">Weapon</option>
                                  <option value="armor">Armor</option>
                                  <option value="consumable">Consumable</option>
                                  <option value="accessory">Accessory</option>
                                  <option value="tool">Tool</option>
                                  <option value="wondrous">Wondrous Item</option>
                                </select>
                                <select
                                  value={item.rarity || 'common'}
                                  onChange={(e) => updateHomebrewItem(item.id, { rarity: e.target.value })}
                                  className={`homebrew-select-chip rarity-select rarity-${item.rarity || 'common'}`}
                                >
                                  <option value="common">Common</option>
                                  <option value="uncommon">Uncommon</option>
                                  <option value="rare">Rare</option>
                                  <option value="epic">Epic</option>
                                  <option value="legendary">Legendary</option>
                                </select>
                              </div>
                              <button
                                type="button"
                                className="homebrew-craft-remove-btn"
                                onClick={() => removeHomebrewItem(item.id)}
                                title="Delete Custom Item"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>

                            {/* Dynamic Stats Row depending on item type */}
                            {item.type === 'weapon' ? (
                              <div className="homebrew-craft-stats-grid">
                                <div className="homebrew-craft-stat-field">
                                  <label><i className="fas fa-dice-d20"></i> Damage</label>
                                  <input
                                    type="text"
                                    value={item.damage || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { damage: e.target.value })}
                                    placeholder="1d8 Slashing"
                                    className="homebrew-craft-input"
                                  />
                                </div>
                                <div className="homebrew-craft-stat-field">
                                  <label><i className="fas fa-bullseye"></i> Range</label>
                                  <input
                                    type="text"
                                    value={item.range || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { range: e.target.value })}
                                    placeholder="5 ft. (or 20/60 ft.)"
                                    className="homebrew-craft-input"
                                  />
                                </div>
                                <div className="homebrew-craft-stat-field full-span">
                                  <label><i className="fas fa-tags"></i> Weapon Properties</label>
                                  <input
                                    type="text"
                                    value={item.properties || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { properties: e.target.value })}
                                    placeholder="Versatile (1d10), Finesse, Light, Thrown..."
                                    className="homebrew-craft-input"
                                  />
                                </div>
                              </div>
                            ) : item.type === 'armor' ? (
                              <div className="homebrew-craft-stats-grid">
                                <div className="homebrew-craft-stat-field">
                                  <label><i className="fas fa-shield-halved"></i> Damage Reduction (DR)</label>
                                  <input
                                    type="text"
                                    value={item.damageReduction || item.damage || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { damageReduction: e.target.value, damage: e.target.value })}
                                    placeholder="d6 DR (or flat DR 3)"
                                    className="homebrew-craft-input"
                                  />
                                </div>
                                <div className="homebrew-craft-stat-field">
                                  <label><i className="fas fa-dice-d6"></i> Durability Die / Tier</label>
                                  <input
                                    type="text"
                                    value={item.durabilityDie || item.range || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { durabilityDie: e.target.value, range: e.target.value })}
                                    placeholder="d6 (Tier 1) / 4 Slots"
                                    className="homebrew-craft-input"
                                  />
                                </div>
                                <div className="homebrew-craft-stat-field">
                                  <label><i className="fas fa-vest"></i> Armor Category</label>
                                  <input
                                    type="text"
                                    value={item.armorType || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { armorType: e.target.value })}
                                    placeholder="Medium Armor, Shield..."
                                    className="homebrew-craft-input"
                                  />
                                </div>
                                <div className="homebrew-craft-stat-field">
                                  <label><i className="fas fa-scale-unbalanced"></i> Requirements & Penalties</label>
                                  <input
                                    type="text"
                                    value={item.properties || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { properties: e.target.value })}
                                    placeholder="Str 12, Stealth Disadvantage..."
                                    className="homebrew-craft-input"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="homebrew-craft-stats-grid">
                                <div className="homebrew-craft-stat-field">
                                  <label><i className="fas fa-hourglass-half"></i> Charges / Uses</label>
                                  <input
                                    type="text"
                                    value={item.damage || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { damage: e.target.value })}
                                    placeholder="3 Charges / 1 Use"
                                    className="homebrew-craft-input"
                                  />
                                </div>
                                <div className="homebrew-craft-stat-field">
                                  <label><i className="fas fa-coins"></i> Value & Weight</label>
                                  <input
                                    type="text"
                                    value={item.range || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { range: e.target.value })}
                                    placeholder="100 gp • 1 lb"
                                    className="homebrew-craft-input"
                                  />
                                </div>
                                <div className="homebrew-craft-stat-field full-span">
                                  <label><i className="fas fa-magic"></i> Special Properties</label>
                                  <input
                                    type="text"
                                    value={item.properties || ''}
                                    onChange={(e) => updateHomebrewItem(item.id, { properties: e.target.value })}
                                    placeholder="Attunement required, Consumable on use..."
                                    className="homebrew-craft-input"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Magical Effects */}
                            <div className="homebrew-craft-textarea-group">
                              <label><i className="fas fa-sparkles"></i> Magical Effects & Powers</label>
                              <textarea
                                value={item.effects || ''}
                                onChange={(e) => updateHomebrewItem(item.id, { effects: e.target.value })}
                                placeholder="Special active powers, passive enchantments, damage bonuses..."
                                rows={2}
                                className="homebrew-craft-textarea"
                              />
                            </div>

                            {/* Lore & Flavor Description */}
                            <div className="homebrew-craft-textarea-group">
                              <label><i className="fas fa-scroll"></i> Lore & Physical Description</label>
                              <textarea
                                value={item.description || ''}
                                onChange={(e) => updateHomebrewItem(item.id, { description: e.target.value })}
                                placeholder="Physical appearance, craftwork details, lore background..."
                                rows={2}
                                className="homebrew-craft-textarea"
                              />
                            </div>

                            {/* Collapsible DM Notes */}
                            <details className="homebrew-notes-accordion">
                              <summary className="homebrew-notes-summary">
                                <i className="fas fa-sticky-note"></i> Campaign Notes & Secrets {item.notes && <span className="notes-pill">Active</span>}
                              </summary>
                              <textarea
                                value={item.notes || ''}
                                onChange={(e) => updateHomebrewItem(item.id, { notes: e.target.value })}
                                placeholder="Private DM notes, location found, plot hooks, or curse details..."
                                rows={2}
                                className="homebrew-craft-textarea"
                              />
                            </details>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <i className="fas fa-gem"></i>
                          <p>No custom items yet. Click <strong>Create Custom</strong> or <strong>Browse Library</strong> to equip your campaign!</p>
                        </div>
                      )}
                    </div>
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
                        <i className="fas fa-plus"></i> Create Custom Creature
                      </button>
                    </div>
                  </div>

                  {/* Library Creatures */}
                  {(campaignData.selectedCreatures || []).length > 0 && (
                    <div className="campaign-library-section">
                      <div className="campaign-library-section-header">
                        <h4 className="subsection-title">
                          <i className="fas fa-book"></i> From Library ({campaignData.selectedCreatures.length})
                        </h4>
                        <span className="campaign-library-hint">Hover for creature bestiary statblock</span>
                      </div>
                      <div className="campaign-inventory-grid">
                        {(campaignData.selectedCreatures || []).map(creature => {
                          const hasNotes = !!(creature.notes && creature.notes.trim());
                          const isNoteOpen = !!expandedNotes[creature.id];
                          return (
                            <div
                              key={creature.id}
                              className={`campaign-library-slot-card creature-slot ${isNoteOpen ? 'note-expanded' : ''}`}
                              onMouseEnter={(e) => handleMouseEnter(e, null, creature, null)}
                              onMouseMove={handleMouseMove}
                              onMouseLeave={handleMouseLeave}
                            >
                              <div className="campaign-slot-main-row">
                                <div className="campaign-token-portrait-frame">
                                  <img
                                    src={resolveLibraryCreatureIcon(creature)}
                                    alt={creature.name}
                                    onError={(e) => {
                                      e.target.src = getIconUrl('inv_misc_questionmark', 'items');
                                    }}
                                  />
                                </div>
                                <div className="campaign-slot-info">
                                  <span className="campaign-slot-name creature-name">
                                    {creature.name}
                                  </span>
                                  <div className="campaign-slot-tags">
                                    <span className="campaign-threat-badge">{creature.threat || 'Standard'}</span>
                                    <span className="campaign-slot-tag">{formatTag(creature.type)}</span>
                                    <span className="campaign-slot-tag">{formatTag(creature.size)}</span>
                                    {creature.hp > 0 && <span className="campaign-slot-tag hp-tag">HP {creature.hp}</span>}
                                  </div>
                                </div>
                                <div className="campaign-slot-actions">
                                  <button
                                    type="button"
                                    className={`campaign-slot-action-btn note-btn ${hasNotes ? 'has-notes' : ''} ${isNoteOpen ? 'active' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleNote(creature.id);
                                    }}
                                    title={hasNotes ? 'View/Edit Campaign Notes' : 'Add Campaign Note'}
                                  >
                                    <i className="fas fa-feather-alt"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="campaign-slot-action-btn remove-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeLibraryCreature(creature.id);
                                    }}
                                    title="Remove from Campaign"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              </div>

                              {isNoteOpen && (
                                <div className="campaign-slot-note-drawer" onClick={(e) => e.stopPropagation()}>
                                  <textarea
                                    value={creature.notes || ''}
                                    onChange={(e) => {
                                      const updated = (campaignData.selectedCreatures || []).map(c =>
                                        c.id === creature.id ? { ...c, notes: e.target.value } : c
                                      );
                                      updateCampaignData({ selectedCreatures: updated });
                                    }}
                                    placeholder="Private campaign / encounter notes for this creature..."
                                    rows={2}
                                    className="campaign-slot-note-input"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom Homebrew Creatures */}
                  <div className="homebrew-monsters-section">
                    {(campaignData.homebrew?.monsters || []).length > 0 && (
                      <h4 className="subsection-title">
                        <i className="fas fa-hammer"></i> Custom Homebrew Creatures ({campaignData.homebrew.monsters.length})
                      </h4>
                    )}
                    <div className="cards-grid">
                      {(campaignData.homebrew?.monsters || []).length > 0 ? (
                        (campaignData.homebrew?.monsters || []).map(monster => (
                          <div key={monster.id} className="content-card homebrew-craft-card campaign-parchment-card">
                            {/* Header Row */}
                            <div className="homebrew-craft-header">
                              <div className={`homebrew-craft-icon-frame creature-family-${monster.type || 'beast'}`}>
                                <i className={`fas ${getCreatureFamilyIcon(monster.type)}`}></i>
                              </div>
                              <input
                                type="text"
                                value={monster.name}
                                onChange={(e) => updateHomebrewMonster(monster.id, { name: e.target.value })}
                                className="homebrew-craft-title"
                                placeholder="Creature Name..."
                              />
                              <div className="homebrew-craft-meta">
                                <select
                                  value={monster.type || 'beast'}
                                  onChange={(e) => updateHomebrewMonster(monster.id, { type: e.target.value })}
                                  className="homebrew-select-chip"
                                >
                                  <option value="beast">Beast</option>
                                  <option value="humanoid">Humanoid</option>
                                  <option value="undead">Undead</option>
                                  <option value="fiend">Fiend</option>
                                  <option value="dragon">Dragon</option>
                                  <option value="aberration">Aberration</option>
                                  <option value="construct">Construct</option>
                                  <option value="elemental">Elemental</option>
                                  <option value="fey">Fey</option>
                                  <option value="giant">Giant</option>
                                  <option value="monstrosity">Monstrosity</option>
                                  <option value="ooze">Ooze</option>
                                  <option value="plant">Plant</option>
                                  <option value="celestial">Celestial</option>
                                </select>
                                <select
                                  value={monster.size || 'medium'}
                                  onChange={(e) => updateHomebrewMonster(monster.id, { size: e.target.value })}
                                  className="homebrew-select-chip"
                                >
                                  <option value="tiny">Tiny</option>
                                  <option value="small">Small</option>
                                  <option value="medium">Medium</option>
                                  <option value="large">Large</option>
                                  <option value="huge">Huge</option>
                                  <option value="gargantuan">Gargantuan</option>
                                </select>
                                <select
                                  value={monster.threat || 'Standard'}
                                  onChange={(e) => updateHomebrewMonster(monster.id, { threat: e.target.value })}
                                  className={`homebrew-select-chip threat-${(monster.threat || 'Standard').toLowerCase()}`}
                                >
                                  <option value="Minion">Minion</option>
                                  <option value="Standard">Standard</option>
                                  <option value="Elite">Elite</option>
                                  <option value="Boss">Boss</option>
                                </select>
                              </div>
                              <button
                                type="button"
                                className="homebrew-craft-remove-btn"
                                onClick={() => removeHomebrewMonster(monster.id)}
                                title="Delete Creature"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>

                            {/* Vitals Strip */}
                            <div className="homebrew-vitals-strip">
                              <div className="vital-badge-box vital-hp">
                                <label><i className="fas fa-heart"></i> HP</label>
                                <input
                                  type="number"
                                  value={monster.hp || ''}
                                  onChange={(e) => updateHomebrewMonster(monster.id, { hp: parseInt(e.target.value, 10) || '' })}
                                  placeholder="30"
                                />
                              </div>
                              <div className="vital-badge-box vital-mana">
                                <label><i className="fas fa-droplet"></i> MANA</label>
                                <input
                                  type="number"
                                  value={monster.mana || ''}
                                  onChange={(e) => updateHomebrewMonster(monster.id, { mana: parseInt(e.target.value, 10) || '' })}
                                  placeholder="10"
                                />
                              </div>
                              <div className="vital-badge-box vital-ap">
                                <label><i className="fas fa-bolt"></i> AP</label>
                                <input
                                  type="number"
                                  value={monster.ap ?? 3}
                                  onChange={(e) => updateHomebrewMonster(monster.id, { ap: parseInt(e.target.value, 10) || 1 })}
                                  placeholder="3"
                                />
                              </div>
                              <div className="vital-badge-box vital-speed">
                                <label><i className="fas fa-person-running"></i> SPEED</label>
                                <input
                                  type="text"
                                  value={monster.speed || '30 ft.'}
                                  onChange={(e) => updateHomebrewMonster(monster.id, { speed: e.target.value })}
                                  placeholder="30 ft."
                                />
                              </div>
                            </div>

                            {/* Combat Defenses */}
                            <div className="homebrew-craft-stats-grid">
                              <div className="homebrew-craft-stat-field">
                                <label><i className="fas fa-shield-halved"></i> Damage Reduction (DR)</label>
                                <input
                                  type="text"
                                  value={monster.damageReduction || monster.ac || ''}
                                  onChange={(e) => updateHomebrewMonster(monster.id, { damageReduction: e.target.value, ac: e.target.value })}
                                  placeholder="d6 DR / Flat DR 2"
                                  className="homebrew-craft-input"
                                />
                              </div>
                              <div className="homebrew-craft-stat-field">
                                <label><i className="fas fa-shield-virus"></i> Resistances</label>
                                <input
                                  type="text"
                                  value={monster.resistances || ''}
                                  onChange={(e) => updateHomebrewMonster(monster.id, { resistances: e.target.value })}
                                  placeholder="Rime 50%, Physical 20%..."
                                  className="homebrew-craft-input"
                                />
                              </div>
                              <div className="homebrew-craft-stat-field">
                                <label><i className="fas fa-heart-crack"></i> Weaknesses</label>
                                <input
                                  type="text"
                                  value={monster.weaknesses || ''}
                                  onChange={(e) => updateHomebrewMonster(monster.id, { weaknesses: e.target.value })}
                                  placeholder="Ember 150%..."
                                  className="homebrew-craft-input"
                                />
                              </div>
                            </div>

                            {/* Actions & Traits */}
                            <div className="homebrew-craft-textarea-group">
                              <label><i className="fas fa-swords"></i> Actions, Attacks, Reactions & Traits</label>
                              <textarea
                                value={monster.description || ''}
                                onChange={(e) => updateHomebrewMonster(monster.id, { description: e.target.value })}
                                placeholder="Action (2 AP) - Rime Cleave: 2d8 + 3 slashing damage&#10;Bonus Action (1 AP) - War Cry: Allies gain +1 AP..."
                                rows={3}
                                className="homebrew-craft-textarea"
                              />
                            </div>

                            {/* Collapsible DM Notes */}
                            <details className="homebrew-notes-accordion">
                              <summary className="homebrew-notes-summary">
                                <i className="fas fa-sticky-note"></i> Campaign Notes & Tactics {monster.notes && <span className="notes-pill">Active</span>}
                              </summary>
                              <textarea
                                value={monster.notes || ''}
                                onChange={(e) => updateHomebrewMonster(monster.id, { notes: e.target.value })}
                                placeholder="Private DM notes, lair information, behavioral triggers, or custom loot..."
                                rows={2}
                                className="homebrew-craft-textarea"
                              />
                            </details>

                            {/* Monster Entity Weaver: Harvestable / Droppable Loot & Bestiary Lore */}
                            <div className="entity-weaver-block">
                              <div className="entity-chips-rack">
                                <div className="entity-rack-header">
                                  <span><i className="fas fa-coins"></i> Droppable Loot & Harvest ({getLinkedItems(monster.dropLootIds).length})</span>
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn"
                                    onClick={() => openLinkerModal(`Loot Drops for ${monster.name || 'Monster'}`, getAllCampaignItems(), monster.dropLootIds || [], (newIds) => updateHomebrewMonster(monster.id, { dropLootIds: newIds }))}
                                  >
                                    <i className="fas fa-plus"></i> Add Loot Drop
                                  </button>
                                </div>
                                <div className="entity-chips-list">
                                  {getLinkedItems(monster.dropLootIds).map(item => (
                                    <span
                                      key={item.id}
                                      className="entity-chip-pill item-chip"
                                      onMouseEnter={(e) => handleMouseEnter(e, item, null, null)}
                                      onMouseMove={handleMouseMove}
                                      onMouseLeave={handleMouseLeave}
                                    >
                                      <img src={resolveLibraryItemIcon(item)} alt="" className="entity-chip-pill-icon" />
                                      <span className="entity-chip-pill-name">{item.name}</span>
                                      <button
                                        type="button"
                                        className="entity-chip-remove"
                                        onClick={() => updateHomebrewMonster(monster.id, { dropLootIds: (monster.dropLootIds || []).filter(id => String(id) !== String(item.id)) })}
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </span>
                                  ))}
                                  {(!monster.dropLootIds || monster.dropLootIds.length === 0) && (
                                    <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No harvest/loot drops linked</span>
                                  )}
                                </div>
                              </div>

                              <div className="entity-chips-rack">
                                <div className="entity-rack-header">
                                  <span><i className="fas fa-book-open"></i> Bestiary Lore & DC Checks ({getLinkedLore(monster.loreIds).length})</span>
                                  <button
                                    type="button"
                                    className="entity-chip-add-btn"
                                    onClick={() => openLinkerModal(`Attach Lore to ${monster.name || 'Monster'}`, getAllCampaignLore(), monster.loreIds || [], (newIds) => updateHomebrewMonster(monster.id, { loreIds: newIds }))}
                                  >
                                    <i className="fas fa-plus"></i> Attach Lore
                                  </button>
                                </div>
                                <div className="entity-chips-list">
                                  {getLinkedLore(monster.loreIds).map(art => (
                                    <span key={art.id} className="entity-chip-pill lore-chip">
                                      <i className="fas fa-scroll" style={{ color: '#3498db', fontSize: '11px' }}></i>
                                      <span className="entity-chip-pill-name">{art.title}</span>
                                      <button
                                        type="button"
                                        className="entity-chip-remove"
                                        onClick={() => updateHomebrewMonster(monster.id, { loreIds: (monster.loreIds || []).filter(id => String(id) !== String(art.id)) })}
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </span>
                                  ))}
                                  {(!monster.loreIds || monster.loreIds.length === 0) && (
                                    <span style={{ fontSize: '0.7rem', color: '#a08c70', fontStyle: 'italic' }}>No lore attached</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <i className="fas fa-dragon"></i>
                          <p>No custom creatures yet. Click <strong>Create Custom Creature</strong> or <strong>Browse Library</strong> to add monsters to your campaign!</p>
                        </div>
                      )}
                    </div>
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
                        <i className="fas fa-plus"></i> Create Custom Spell
                      </button>
                    </div>
                  </div>

                  {/* Library Spells */}
                  {(campaignData.selectedSpells || []).length > 0 && (
                    <div className="campaign-library-section">
                      <div className="campaign-library-section-header">
                        <h4 className="subsection-title">
                          <i className="fas fa-book"></i> From Library ({campaignData.selectedSpells.length})
                        </h4>
                        <span className="campaign-library-hint">Hover for spell grimoire details</span>
                      </div>
                      <div className="campaign-inventory-grid campaign-spells-grid">
                        {(campaignData.selectedSpells || []).map(spell => {
                          const hasNotes = !!(spell.notes && spell.notes.trim());
                          const isNoteOpen = !!expandedNotes[spell.id];
                          const schoolClass = `school-${(spell.school || 'arcane').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
                          const badgeType = getSpellBadgeType(spell);
                          return (
                            <div
                              key={spell.id}
                              className={`campaign-library-slot-card spell-slot campaign-spell-grimoire-card ${isNoteOpen ? 'note-expanded' : ''}`}
                              onMouseEnter={(e) => handleMouseEnter(e, null, null, spell)}
                              onMouseMove={handleMouseMove}
                              onMouseLeave={handleMouseLeave}
                            >
                              <div className="campaign-slot-main-row">
                                <div className={`campaign-spell-rune-frame ${schoolClass}`}>
                                  <img
                                    src={resolveLibrarySpellIcon(spell)}
                                    alt={spell.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                                    }}
                                  />
                                </div>
                                <div className="campaign-slot-info">
                                  <div className="campaign-spell-title-line">
                                    <span className="campaign-slot-name spell-name">
                                      {spell.name}
                                    </span>
                                    <span className={`wow-spell-type ${badgeType.toLowerCase().replace(/\s+/g, '-')}`}>
                                      {badgeType}
                                    </span>
                                  </div>
                                  <p className="campaign-spell-desc-snippet" title={spell.description}>
                                    {spell.description || `${spell.className || spell.school || 'Universal'} ability`}
                                  </p>
                                </div>
                                <div className="campaign-slot-actions">
                                  <button
                                    type="button"
                                    className={`campaign-slot-action-btn note-btn ${hasNotes ? 'has-notes' : ''} ${isNoteOpen ? 'active' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleNote(spell.id);
                                    }}
                                    title={hasNotes ? 'View/Edit Campaign Notes' : 'Add Campaign Note'}
                                  >
                                    <i className="fas fa-feather-alt"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="campaign-slot-action-btn remove-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeLibrarySpell(spell.id);
                                    }}
                                    title="Remove from Campaign"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              </div>

                              {isNoteOpen && (
                                <div className="campaign-slot-note-drawer" onClick={(e) => e.stopPropagation()}>
                                  <textarea
                                    value={spell.notes || ''}
                                    onChange={(e) => {
                                      const updated = (campaignData.selectedSpells || []).map(s =>
                                        s.id === spell.id ? { ...s, notes: e.target.value } : s
                                      );
                                      updateCampaignData({ selectedSpells: updated });
                                    }}
                                    placeholder="Private campaign notes for this spell..."
                                    rows={2}
                                    className="campaign-slot-note-input"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom Homebrew Spells */}
                  <div className="homebrew-spells-section">
                    {(campaignData.homebrew?.spells || []).length > 0 && (
                      <h4 className="subsection-title">
                        <i className="fas fa-hammer"></i> Custom Homebrew Spells ({campaignData.homebrew.spells.length})
                      </h4>
                    )}
                    <div className="cards-grid">
                      {(campaignData.homebrew?.spells || []).length > 0 ? (
                        (campaignData.homebrew?.spells || []).map(spell => (
                          <div key={spell.id} className="content-card homebrew-craft-card campaign-parchment-card">
                            {/* Header Row */}
                            <div className="homebrew-craft-header">
                              <div className={`homebrew-craft-icon-frame spell-school-${spell.school || 'ember'}`}>
                                <i className={`fas ${getSpellSchoolIcon(spell.school)}`}></i>
                              </div>
                              <input
                                type="text"
                                value={spell.name}
                                onChange={(e) => updateHomebrewSpell(spell.id, { name: e.target.value })}
                                className="homebrew-craft-title"
                                placeholder="Spell Name..."
                              />
                              <div className="homebrew-craft-meta">
                                <select
                                  value={spell.level ?? 1}
                                  onChange={(e) => updateHomebrewSpell(spell.id, { level: parseInt(e.target.value, 10) })}
                                  className="homebrew-select-chip level-select"
                                >
                                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(l => (
                                    <option key={l} value={l}>{l === 0 ? 'Cantrip' : `Level ${l}`}</option>
                                  ))}
                                </select>
                                <select
                                  value={spell.school || 'ember'}
                                  onChange={(e) => updateHomebrewSpell(spell.id, { school: e.target.value })}
                                  className="homebrew-select-chip school-select"
                                >
                                  {SPELL_DAMAGE_TYPES.map(t => (
                                    <option key={t} value={t}>{getDamageType(t)?.name || t}</option>
                                  ))}
                                </select>
                              </div>
                              <button
                                type="button"
                                className="homebrew-craft-remove-btn"
                                onClick={() => removeHomebrewSpell(spell.id)}
                                title="Delete Spell"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>

                            {/* Spell Cost & Cast Strip */}
                            <div className="homebrew-vitals-strip spell-costs-strip">
                              <div className="vital-badge-box vital-ap">
                                <label><i className="fas fa-bolt"></i> AP COST</label>
                                <input
                                  type="number"
                                  value={spell.apCost ?? 2}
                                  onChange={(e) => updateHomebrewSpell(spell.id, { apCost: parseInt(e.target.value, 10) || 1 })}
                                  placeholder="2"
                                />
                              </div>
                              <div className="vital-badge-box vital-mana">
                                <label><i className="fas fa-droplet"></i> MANA</label>
                                <input
                                  type="number"
                                  value={spell.manaCost ?? 15}
                                  onChange={(e) => updateHomebrewSpell(spell.id, { manaCost: parseInt(e.target.value, 10) || 0 })}
                                  placeholder="15"
                                />
                              </div>
                              <div className="vital-badge-box vital-range">
                                <label><i className="fas fa-arrows-left-right"></i> RANGE</label>
                                <input
                                  type="text"
                                  value={spell.range || '30 ft.'}
                                  onChange={(e) => updateHomebrewSpell(spell.id, { range: e.target.value })}
                                  placeholder="30 ft."
                                />
                              </div>
                              <div className="vital-badge-box vital-speed">
                                <label><i className="fas fa-clock"></i> CAST TIME</label>
                                <input
                                  type="text"
                                  value={spell.castingTime || '1 Action'}
                                  onChange={(e) => updateHomebrewSpell(spell.id, { castingTime: e.target.value })}
                                  placeholder="1 Action"
                                />
                              </div>
                            </div>

                            {/* Spell Effect & Formula */}
                            <div className="homebrew-craft-textarea-group">
                              <label><i className="fas fa-wand-magic-sparkles"></i> Spell Formula, Damage & Effects</label>
                              <textarea
                                value={spell.description || ''}
                                onChange={(e) => updateHomebrewSpell(spell.id, { description: e.target.value })}
                                placeholder="Spell effect description, damage formula (e.g. 2d6 Ember), saving throw DC, and conditions applied..."
                                rows={3}
                                className="homebrew-craft-textarea"
                              />
                            </div>

                            {/* Collapsible DM Notes */}
                            <details className="homebrew-notes-accordion">
                              <summary className="homebrew-notes-summary">
                                <i className="fas fa-sticky-note"></i> Campaign Notes & Lore {spell.notes && <span className="notes-pill">Active</span>}
                              </summary>
                              <textarea
                                value={spell.notes || ''}
                                onChange={(e) => updateHomebrewSpell(spell.id, { notes: e.target.value })}
                                placeholder="Private DM notes, arcane research notes, scroll availability..."
                                rows={2}
                                className="homebrew-craft-textarea"
                              />
                            </details>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <i className="fas fa-hat-wizard"></i>
                          <p>No custom spells yet. Click <strong>Create Custom Spell</strong> or <strong>Browse Library</strong> to enrich your campaign grimoire!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Lore */}
              {homebrewSubTab === 'lore' && (
                <div className="list-section">
                  <div className="section-header">
                    <h3>World Lore & Chronicles</h3>
                    <button className="add-btn" onClick={addLoreArticle}>
                      <i className="fas fa-plus"></i> New Article
                    </button>
                  </div>
                  <div className="cards-list">
                    {(campaignData.homebrew?.lore || []).length > 0 ? (
                      (campaignData.homebrew?.lore || []).map((article) => (
                        <CodexLoreEditor
                          key={article.id}
                          article={article}
                          onUpdate={(updates) => updateLoreArticle(article.id, updates)}
                          onDelete={() => removeLoreArticle(article.id)}
                        />
                      ))
                    ) : (
                      <div className="empty-state"><i className="fas fa-scroll"></i><p>No lore articles yet. Start building your world's history and codex!</p></div>
                    )}
                  </div>
                </div>
              )}

              {/* Lineages, Species & Family Trees */}
              {homebrewSubTab === 'lineages' && (
                <div className="list-section">
                  <div className="section-header">
                    <div className="lineage-view-toggle-bar">
                      <button
                        type="button"
                        className={`lineage-toggle-btn ${lineageViewMode === 'species' ? 'active' : ''}`}
                        onClick={() => setLineageViewMode('species')}
                      >
                        <i className="fas fa-dna"></i> Cultural Lineages & Species
                      </button>
                      <button
                        type="button"
                        className={`lineage-toggle-btn ${lineageViewMode === 'family_trees' ? 'active dynasty' : ''}`}
                        onClick={() => setLineageViewMode('family_trees')}
                      >
                        <i className="fas fa-sitemap"></i> Dynasties & Family Trees
                      </button>
                    </div>

                    <div className="section-header-actions">
                      {lineageViewMode === 'species' ? (
                        <button className="add-btn" onClick={() => useCustomLineageStore.getState().openWizard()}>
                          <i className="fas fa-plus"></i> Forge Custom Lineage
                        </button>
                      ) : (
                        <button
                          className="add-btn"
                          style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', color: '#1a0f05', borderColor: '#8b6508' }}
                          onClick={() => useFamilyTreeStore.getState().openStudio()}
                        >
                          <i className="fas fa-wand-magic-sparkles"></i> Open Family Tree Studio
                        </button>
                      )}
                    </div>
                  </div>

                  {lineageViewMode === 'species' ? (
                    <div className="cards-list">
                      {useCustomLineageStore.getState().getAllLineages().map((lineage) => (
                        <div key={lineage.id} className="campaign-lineage-card">
                          <div className="campaign-lineage-header">
                            <span className={`campaign-lineage-badge ${lineage.isCustom ? 'custom' : 'canon'}`}>
                              {lineage.isCustom ? 'Custom Species' : 'Canon Lineage'}
                            </span>
                            <h4 className="campaign-lineage-title">{lineage.name}</h4>
                            <span className="campaign-lineage-essence">{lineage.essence || 'The Unbound'}</span>
                            {lineage.isCustom && (
                              <div className="campaign-lineage-actions">
                                <button
                                  type="button"
                                  className="campaign-lineage-edit-btn"
                                  onClick={() => useCustomLineageStore.getState().openWizard(lineage)}
                                  title="Edit Lineage"
                                >
                                  <i className="fas fa-edit"></i> Edit
                                </button>
                                <button
                                  type="button"
                                  className="campaign-lineage-delete-btn"
                                  onClick={() => {
                                    showConfirmModal(
                                      'Delete Custom Lineage',
                                      `Are you sure you want to delete "${lineage.name}"? This cannot be undone.`,
                                      () => {
                                        useCustomLineageStore.getState().deleteLineage(lineage.id);
                                      }
                                    );
                                  }}
                                  title="Delete Custom Lineage"
                                >
                                  <i className="fas fa-trash-alt"></i> Delete
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="campaign-lineage-body">
                            <p className="campaign-lineage-desc">
                              {lineage.cardFlavor || lineage.description}
                            </p>
                            {lineage.subraces && (
                              <div className="campaign-lineage-subraces">
                                {(Array.isArray(lineage.subraces) ? lineage.subraces : Object.values(lineage.subraces)).map((sr, idx) => (
                                  <span key={idx} className="campaign-subrace-pill">
                                    <i className="fas fa-dna" style={{ marginRight: '4px', fontSize: '9px', opacity: 0.7 }}></i>
                                    {sr.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="cards-list">
                      {useFamilyTreeStore.getState().trees.map((tree) => (
                        <div key={tree.id} className="campaign-lineage-card" style={{ borderLeft: '3px solid #d4af37' }}>
                          <div className="campaign-lineage-header">
                            <span className="campaign-lineage-badge canon" style={{ background: 'rgba(212, 175, 55, 0.15)', borderColor: '#d4af37', color: '#8b5a1a' }}>
                              <i className="fas fa-crown"></i> Dynasty Tree
                            </span>
                            <h4 className="campaign-lineage-title">{tree.name}</h4>
                            <span className="campaign-lineage-essence">{tree.nodes.length} Members • {tree.relationships.length} Lineage Links</span>
                            <div className="campaign-lineage-actions">
                              <button
                                type="button"
                                className="campaign-lineage-edit-btn"
                                style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', color: '#1a0f05' }}
                                onClick={() => useFamilyTreeStore.getState().openStudio(tree.id)}
                                title="Open Interactive Family Tree Canvas"
                              >
                                <i className="fas fa-sitemap"></i> Explore Tree ↗
                              </button>
                              <button
                                type="button"
                                className="campaign-lineage-delete-btn"
                                onClick={() => {
                                  showConfirmModal(
                                    'Delete Dynasty Family Tree',
                                    `Are you sure you want to delete the dynasty tree "${tree.name}"? All members and lineage connections will be removed.`,
                                    () => {
                                      useFamilyTreeStore.getState().deleteTree(tree.id);
                                      useFamilyTreeStore.getState().syncToCloud(user?.uid);
                                    }
                                  );
                                }}
                                title="Delete Dynasty Family Tree"
                              >
                                <i className="fas fa-trash-alt"></i> Delete
                              </button>
                            </div>
                          </div>
                          <div className="campaign-lineage-body">
                            <p className="campaign-lineage-desc">
                              {tree.description || 'Ancient ruling dynasty and bloodlines.'}
                            </p>
                            <div className="campaign-subrace-pill" style={{ display: 'inline-flex', gap: '8px', background: '#fdfbf7', border: '1px solid rgba(139, 69, 19, 0.25)', color: '#4a2711' }}>
                              <span><i className="fas fa-users" style={{ color: '#d4af37' }}></i> Key Figures: {tree.nodes.slice(0, 4).map(n => n.name).join(', ')}{tree.nodes.length > 4 ? '...' : ''}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CustomLineageWizard />
      <FamilyTreeStudio />
      <InteractiveMapStudio />

      {/* Tooltips */}
      {hoveredItem && (
        <TooltipPortal>
          <div
            ref={positionTooltipRef}
            style={{
              position: 'fixed',
              left: adjustedPosition.x,
              top: adjustedPosition.y,
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
            ref={positionTooltipRef}
            className="campaign-creature-tooltip-portal"
            style={{
              position: 'fixed',
              left: adjustedPosition.x,
              top: adjustedPosition.y,
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
          position={adjustedPosition}
        />
      )}
    </div>
  );
};

export default CampaignManager;
