import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import MythrillWindow from './MythrillWindow';
import LibraryBrowserModal, { LIBRARY_TYPES as IMPORTED_LIBRARY_TYPES } from '../account/LibraryBrowserModal';

const LIBRARY_TYPES = IMPORTED_LIBRARY_TYPES || {
  CREATURES: 'creatures',
  ITEMS: 'items',
  SPELLS: 'spells'
};
import ItemTooltip from '../item-generation/ItemTooltip';
import SimpleCreatureTooltip from '../creature-wizard/components/common/SimpleCreatureTooltip';
import SpellTooltip from '../spellcrafting-wizard/components/common/SpellTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { useTooltipPosition } from '../common/useTooltipPosition';
import useCreatureStore from '../../store/creatureStore';
import useShareableStore from '../../store/shareableStore';
import useChatStore from '../../store/chatStore';
import campaignService from '../../services/campaignService';
import useFeatureFlag from '../../hooks/useFeatureFlag';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { SPELL_DAMAGE_TYPES, getDamageType } from '../../data/damageTypes';
import CustomLineageWizard from '../world/CustomLineageWizard';
import useCustomLineageStore from '../../store/customLineageStore';
import FamilyTreeStudio from '../world/FamilyTreeStudio';
import useFamilyTreeStore from '../../store/familyTreeStore';
import InteractiveMapStudio from '../world-map/InteractiveMapStudio';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import { getIconUrl, getCreatureTokenIconUrl, getCustomIconUrl, getWowIconUrl } from '../../utils/assetManager';
import '../../styles/campaign-manager.css';

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

// Campaign Management Window with tabbed interface
function CampaignManagerWindow({ isOpen, onClose }) {
    const { allowed: campaignManagerFullAllowed, loading: campaignManagerFullLoading } = useFeatureFlag('campaignManagerFull');
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
    const [activeTab, setActiveTab] = useState('overview');
    const [locationViewMode, setLocationViewMode] = useState('cards');
    const [locationCardTabs, setLocationCardTabs] = useState({});
    const [selectedAtlasLocationId, setSelectedAtlasLocationId] = useState(null);
    const [atlasSearch, setAtlasSearch] = useState('');
    const [atlasTypeFilter, setAtlasTypeFilter] = useState('all');

    // Modal state
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', callback: null });
    const [linkerModal, setLinkerModal] = useState({ isOpen: false, title: '', items: [], selectedIds: [], onSelect: null });

    const [campaignData, setCampaignData] = useState({
        name: 'New Campaign',
        description: '',
        currentSession: 1,
        players: [],
        sessions: [],
        npcs: [],
        locations: [],
        plotThreads: [],
        // Homebrew content
        homebrew: {
            items: [],
            monsters: [],
            spells: [],
            lore: []
        },
        // Library selections
        selectedItems: [],
        selectedCreatures: [],
        selectedSpells: []
    });

    // Modal state
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputModalConfig, setInputModalConfig] = useState({ title: '', placeholder: '', onSubmit: null });
    const [inputValue, setInputValue] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalConfig, setConfirmModalConfig] = useState({ message: '', onConfirm: null });

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

    // Shareables state
    const {
        shareables,
        addShareable,
        removeShareable,
        showToPlayers
    } = useShareableStore();
    const [newShareableType, setNewShareableType] = useState('text');
    const [newShareableContent, setNewShareableContent] = useState('');
    const [newShareableTitle, setNewShareableTitle] = useState('');
    const [newShareableBackground, setNewShareableBackground] = useState('parchment');
    const [newShareableFile, setNewShareableFile] = useState(null);
    const shareableFileInputRef = useRef(null);
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

    // Tab definitions
    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'fas fa-home' },
        { id: 'sessions', label: 'Sessions', icon: 'fas fa-calendar-alt' },
        { id: 'npcs', label: 'NPCs', icon: 'fas fa-users' },
        { id: 'locations', label: 'Locations', icon: 'fas fa-map-marker-alt' },
        { id: 'plots', label: 'Plots', icon: 'fas fa-project-diagram' },
        { id: 'shareables', label: 'Shareables', icon: 'fas fa-share-alt' },
        { id: 'homebrew', label: 'Homebrew', icon: 'fas fa-flask' }
    ];

    // Campaign management state
    const [campaigns, setCampaigns] = useState([]);
    const [currentCampaignId, setCurrentCampaignId] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

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
            // Create default campaign if none exist
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

        setIsInitialized(true);
    }, []);

    // Save campaign data when it changes (only after initialization)
    useEffect(() => {
        if (!isInitialized || !currentCampaignId) return;

        const timeoutId = setTimeout(() => {
            campaignService.updateCampaign(currentCampaignId, {
                campaignData: campaignData
            });
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
        setInputModalConfig({
            title: 'Create Inhabitant / Monster',
            placeholder: 'Monster name (e.g. Frost Crypt Guardian)...',
            onSubmit: (monsterName) => {
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
            }
        });
        setInputValue('');
        setShowInputModal(true);
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
        setInputModalConfig({
            title: 'Create Chamber Loot / Relic',
            placeholder: 'Item name (e.g. Sunforged Key)...',
            onSubmit: (itemName) => {
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
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const addQuestToLocation = (locationId) => {
        const loc = (campaignData.locations || []).find(l => l.id === locationId);
        setInputModalConfig({
            title: `New Quest at ${loc?.name || 'Location'}`,
            placeholder: 'Quest title...',
            onSubmit: (questTitle) => {
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
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const addLoreToLocation = (locationId) => {
        const loc = (campaignData.locations || []).find(l => l.id === locationId);
        setInputModalConfig({
            title: `New Inscription / Lore for ${loc?.name || 'Location'}`,
            placeholder: 'Article / Inscription title...',
            onSubmit: (artTitle) => {
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
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const addSubLocationToLocation = (parentLocationId) => {
        const parent = (campaignData.locations || []).find(l => l.id === parentLocationId);
        setInputModalConfig({
            title: `Add Sub-Location to ${parent?.name || 'Location'}`,
            placeholder: 'Sub-location name (e.g. The Drunken Dragon Tavern, Crypt of Shadows)...',
            onSubmit: (subLocName) => {
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
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const addNPCToLocation = (locationId) => {
        const loc = (campaignData.locations || []).find(l => l.id === locationId);
        setInputModalConfig({
            title: `New NPC at ${loc?.name || 'Location'}`,
            placeholder: 'NPC name...',
            onSubmit: (npcName) => {
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
            }
        });
        setInputValue('');
        setShowInputModal(true);
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
            alert(`⚔️ Successfully spawned ${creatures.length} encounter tokens directly onto the active VTT Canvas!`);
        } else {
            alert(`⚔️ ${creatures.length} encounter creature(s) prepped and ready for live game!`);
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
                text: `💎 Party Loot Uncovered: ${itemListText}`,
                timestamp: Date.now()
            });
            alert(`💎 Broadcasted ${items.length} loot item(s) to party chat!`);
        } else {
            alert(`💎 Loot: ${itemListText}`);
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
        alert(`📜 Revealed ${loreArticles.length} handout(s) to the party display!`);
    };

    // Modal helpers
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

    const addPlayer = () => {
        setInputModalConfig({
            title: 'Enter Player Name',
            placeholder: 'Character name...',
            onSubmit: (playerName) => {
                if (playerName && playerName.trim()) {
                    const newPlayer = {
                        id: Date.now(),
                        name: playerName.trim(),
                        class: '',
                        level: 1,
                        status: 'active',
                        notes: '',
                        attendance: [],
                        background: '',
                        goals: ''
                    };
                    updateCampaignData({
                        players: [...campaignData.players, newPlayer]
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const removePlayer = (playerId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this player?',
            onConfirm: () => {
                updateCampaignData({
                    players: (campaignData.players || []).filter(p => p.id !== playerId)
                });
            }
        });
        setIsConfirmModalOpen(true);
    };

    const updatePlayer = (playerId, updates) => {
        updateCampaignData({
            players: (campaignData.players || []).map(p =>
                p.id === playerId ? { ...p, ...updates } : p
            )
        });
    };

    const addSession = () => {
        const sessionNumber = campaignData.sessions.length + 1;
        const newSession = {
            id: Date.now(),
            number: sessionNumber,
            title: `Session ${sessionNumber}`,
            date: new Date().toISOString().split('T')[0],
            status: 'planned',
            objectives: [],
            notes: '',
            encounters: [],
            xpAwarded: 0,
            summary: ''
        };
        updateCampaignData({
            sessions: [...campaignData.sessions, newSession],
            currentSession: sessionNumber
        });
    };

    const updateSession = (sessionId, updates) => {
        updateCampaignData({
            sessions: (campaignData.sessions || []).map(s =>
                s.id === sessionId ? { ...s, ...updates } : s
            )
        });
    };

    const removeSession = (sessionId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to delete this session?',
            onConfirm: () => {
                updateCampaignData({
                    sessions: (campaignData.sessions || []).filter(s => s.id !== sessionId)
                });
            }
        });
        setIsConfirmModalOpen(true);
    };

    const addNPC = () => {
        setInputModalConfig({
            title: 'Enter NPC Name',
            placeholder: 'NPC name...',
            onSubmit: (npcName) => {
                if (npcName && npcName.trim()) {
                    const newNPC = {
                        id: Date.now(),
                        name: npcName.trim(),
                        description: '',
                        location: '',
                        relationship: 'neutral',
                        plotRelevance: 'minor',
                        notes: '',
                        status: 'alive'
                    };
                    updateCampaignData({
                        npcs: [...campaignData.npcs, newNPC]
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updateNPC = (npcId, updates) => {
        updateCampaignData({
            npcs: (campaignData.npcs || []).map(npc =>
                npc.id === npcId ? { ...npc, ...updates } : npc
            )
        });
    };

    const removeNPC = (npcId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this NPC?',
            onConfirm: () => {
                const removedNPC = (campaignData.npcs || []).find(npc => npc.id === npcId);
                if (removedNPC?.image) {
                    removeImage(removedNPC.image).catch((err) => console.warn('Failed to remove NPC media:', err));
                }
                updateCampaignData({
                    npcs: (campaignData.npcs || []).filter(npc => npc.id !== npcId)
                });
            }
        });
        setIsConfirmModalOpen(true);
    };

    const addLocation = () => {
        setInputModalConfig({
            title: 'Enter Location Name',
            placeholder: 'Location name...',
            onSubmit: (locationName) => {
                if (locationName && locationName.trim()) {
                    const newLocation = {
                        id: Date.now(),
                        name: locationName.trim(),
                        description: '',
                        type: 'city',
                        region: '',
                        notableFeatures: '',
                        notes: ''
                    };
                    updateCampaignData({
                        locations: [...campaignData.locations, newLocation]
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updateLocation = (locationId, updates) => {
        updateCampaignData({
            locations: (campaignData.locations || []).map(location =>
                location.id === locationId ? { ...location, ...updates } : location
            )
        });
    };

    const removeLocation = (locationId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this location?',
            onConfirm: () => {
                const removedLocation = (campaignData.locations || []).find(location => location.id === locationId);
                if (removedLocation?.image) {
                    removeImage(removedLocation.image).catch((err) => console.warn('Failed to remove location media:', err));
                }
                updateCampaignData({
                    locations: (campaignData.locations || []).filter(location => location.id !== locationId)
                });
            }
        });
        setIsConfirmModalOpen(true);
    };

    const addQuest = () => {
        setInputModalConfig({
            title: 'Enter Quest Title',
            placeholder: 'Quest title...',
            onSubmit: (questTitle) => {
                if (questTitle && questTitle.trim()) {
                    const newQuest = {
                        id: Date.now(),
                        title: questTitle.trim(),
                        description: '',
                        type: 'side',
                        status: 'not-started',
                        priority: 'medium',
                        giver: '',
                        location: '',
                        objectives: [],
                        rewards: '',
                        notes: ''
                    };
                    updateCampaignData({
                        quests: [...(campaignData.quests || []), newQuest]
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updateQuest = (questId, updates) => {
        updateCampaignData({
            quests: (campaignData.quests || []).map(quest =>
                quest.id === questId ? { ...quest, ...updates } : quest
            )
        });
    };

    const removeQuest = (questId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this quest?',
            onConfirm: () => {
                const removedQuest = (campaignData.quests || []).find(q => q.id === questId);
                if (removedQuest?.image) {
                    removeImage(removedQuest.image).catch((err) => console.warn('Failed to remove quest media:', err));
                }
                updateCampaignData({
                    quests: (campaignData.quests || []).filter(q => q.id !== questId)
                });
            }
        });
        setIsConfirmModalOpen(true);
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

    const addPlotThread = () => {
        setInputModalConfig({
            title: 'Enter Plot Thread Title',
            placeholder: 'Plot thread title...',
            onSubmit: (plotTitle) => {
                if (plotTitle && plotTitle.trim()) {
                    const newPlotThread = {
                        id: Date.now(),
                        title: plotTitle.trim(),
                        description: '',
                        status: 'active',
                        priority: 'medium',
                        relatedNPCs: [],
                        relatedLocations: [],
                        notes: ''
                    };
                    updateCampaignData({
                        plotThreads: [...campaignData.plotThreads, newPlotThread]
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updatePlotThread = (plotThreadId, updates) => {
        updateCampaignData({
            plotThreads: (campaignData.plotThreads || []).map(plotThread =>
                plotThread.id === plotThreadId ? { ...plotThread, ...updates } : plotThread
            )
        });
    };

    const removePlotThread = (plotThreadId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this plot thread?',
            onConfirm: () => {
                const removedPlotThread = (campaignData.plotThreads || []).find(plotThread => plotThread.id === plotThreadId);
                if (removedPlotThread?.image) {
                    removeImage(removedPlotThread.image).catch((err) => console.warn('Failed to remove plot media:', err));
                }
                updateCampaignData({
                    plotThreads: (campaignData.plotThreads || []).filter(plotThread => plotThread.id !== plotThreadId)
                });
            }
        });
        setIsConfirmModalOpen(true);
    };

    // Homebrew Management Functions
    const [homebrewSubTab, setHomebrewSubTab] = useState('items');
    const [lineageViewMode, setLineageViewMode] = useState('species'); // 'species' | 'family_trees'

    const addHomebrewItem = () => {
        setInputModalConfig({
            title: 'Enter Item Name',
            placeholder: 'Item name...',
            onSubmit: (itemName) => {
                if (itemName && itemName.trim()) {
                    const newItem = {
                        id: Date.now(),
                        name: itemName.trim(),
                        type: 'weapon',
                        rarity: 'common',
                        description: '',
                        properties: '',
                        effects: '',
                        cost: '',
                        weight: '',
                        notes: ''
                    };
                    updateCampaignData({
                        homebrew: {
                            ...campaignData.homebrew,
                            items: [...(campaignData.homebrew?.items || []), newItem]
                        }
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updateHomebrewItem = (itemId, updates) => {
        updateCampaignData({
            homebrew: {
                ...campaignData.homebrew,
                items: (campaignData.homebrew?.items || []).map(item =>
                    item.id === itemId ? { ...item, ...updates } : item
                )
            }
        });
    };

    const removeHomebrewItem = (itemId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this item?',
            onConfirm: () => {
                updateCampaignData({
                    homebrew: {
                        ...campaignData.homebrew,
                        items: (campaignData.homebrew?.items || []).filter(item => item.id !== itemId)
                    }
                });
            }
        });
        setIsConfirmModalOpen(true);
    };

    const addHomebrewMonster = () => {
        setInputModalConfig({
            title: 'Enter Monster Name',
            placeholder: 'Monster name...',
            onSubmit: (monsterName) => {
                if (monsterName && monsterName.trim()) {
                    const newMonster = {
                        id: Date.now(),
                        name: monsterName.trim(),
                        type: 'beast',
                        size: 'medium',
                        challengeRating: '1',
                        description: '',
                        abilities: '',
                        actions: '',
                        hp: '',
                        ac: '',
                        speed: '',
                        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
                        notes: ''
                    };
                    updateCampaignData({
                        homebrew: {
                            ...campaignData.homebrew,
                            monsters: [...(campaignData.homebrew?.monsters || []), newMonster]
                        }
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updateHomebrewMonster = (monsterId, updates) => {
        updateCampaignData({
            homebrew: {
                ...campaignData.homebrew,
                monsters: (campaignData.homebrew?.monsters || []).map(monster =>
                    monster.id === monsterId ? { ...monster, ...updates } : monster
                )
            }
        });
    };

    const removeHomebrewMonster = (monsterId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this monster?',
            onConfirm: () => {
                updateCampaignData({
                    homebrew: {
                        ...campaignData.homebrew,
                        monsters: (campaignData.homebrew?.monsters || []).filter(monster => monster.id !== monsterId)
                    }
                });
            }
        });
        setIsConfirmModalOpen(true);
    };

    const addHomebrewSpell = () => {
        setInputModalConfig({
            title: 'Enter Spell Name',
            placeholder: 'Spell name...',
            onSubmit: (spellName) => {
                if (spellName && spellName.trim()) {
                    const newSpell = {
                        id: Date.now(),
                        name: spellName.trim(),
                        level: 1,
                        school: 'arcane',
                        castingTime: '1 action',
                        range: '60 feet',
                        components: 'V, S',
                        duration: 'Instantaneous',
                        description: '',
                        higherLevels: '',
                        classes: '',
                        notes: ''
                    };
                    updateCampaignData({
                        homebrew: {
                            ...campaignData.homebrew,
                            spells: [...(campaignData.homebrew?.spells || []), newSpell]
                        }
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updateHomebrewSpell = (spellId, updates) => {
        updateCampaignData({
            homebrew: {
                ...campaignData.homebrew,
                spells: (campaignData.homebrew?.spells || []).map(spell =>
                    spell.id === spellId ? { ...spell, ...updates } : spell
                )
            }
        });
    };

    const removeHomebrewSpell = (spellId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this spell?',
            onConfirm: () => {
                updateCampaignData({
                    homebrew: {
                        ...campaignData.homebrew,
                        spells: (campaignData.homebrew?.spells || []).filter(spell => spell.id !== spellId)
                    }
                });
            }
        });
        setIsConfirmModalOpen(true);
    };

    const addLoreArticle = () => {
        setInputModalConfig({
            title: 'Enter Article Title',
            placeholder: 'Article title...',
            onSubmit: (articleTitle) => {
                if (articleTitle && articleTitle.trim()) {
                    const newArticle = {
                        id: Date.now(),
                        title: articleTitle.trim(),
                        category: 'history',
                        content: '',
                        linkedNPCs: [],
                        linkedLocations: [],
                        tags: [],
                        isSecret: false,
                        notes: ''
                    };
                    updateCampaignData({
                        homebrew: {
                            ...campaignData.homebrew,
                            lore: [...(campaignData.homebrew?.lore || []), newArticle]
                        }
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updateLoreArticle = (articleId, updates) => {
        updateCampaignData({
            homebrew: {
                ...campaignData.homebrew,
                lore: (campaignData.homebrew?.lore || []).map(article =>
                    article.id === articleId ? { ...article, ...updates } : article
                )
            }
        });
    };

    const removeLoreArticle = (articleId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this lore article?',
            onConfirm: () => {
                updateCampaignData({
                    homebrew: {
                        ...campaignData.homebrew,
                        lore: (campaignData.homebrew?.lore || []).filter(article => article.id !== articleId)
                    }
                });
            }
        });
        setIsConfirmModalOpen(true);
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

    // Remove library items
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

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-overview">
                            <div className="campaign-header-section">
                                <div className="campaign-field">
                                    <label><i className="fas fa-book-bookmark"></i> Select Active Campaign</label>
                                    <div className="campaign-select-action-row">
                                        <select
                                            value={currentCampaignId || ''}
                                            onChange={(e) => {
                                                const newCampaignId = e.target.value;
                                                campaignService.setCurrentCampaign(newCampaignId);
                                                setCurrentCampaignId(newCampaignId);
                                                const campaign = campaignService.getCampaign(newCampaignId);
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
                                            className="campaign-select-main"
                                        >
                                            {campaigns.map(campaign => (
                                                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newCampaign = campaignService.createCampaign({ name: 'New Campaign' });
                                                setCampaigns(campaignService.getCampaigns());
                                                campaignService.setCurrentCampaign(newCampaign.id);
                                                setCurrentCampaignId(newCampaign.id);
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
                                            className="btn-campaign-new"
                                            title="Create a new campaign codex"
                                        >
                                            <i className="fas fa-plus"></i>
                                            <span>New Campaign</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (currentCampaignId) {
                                                    const idStr = String(currentCampaignId);
                                                    const campaignToDelete = campaigns.find(c => String(c.id) === idStr);
                                                    showConfirmModal(
                                                        'Delete Campaign',
                                                        `Are you sure you want to delete the campaign "${campaignToDelete?.name || 'this campaign'}"? This action cannot be undone.`,
                                                        () => {
                                                            campaignService.deleteCampaign(currentCampaignId);
                                                            const updatedCampaigns = campaignService.getCampaigns();
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
                                                            setCampaigns(updatedCampaigns);
                                                            setCurrentCampaignId(newCurrentId);
                                                            setCampaignData(newCampaignData);
                                                        }
                                                    );
                                                }
                                            }}
                                            className="btn-campaign-delete"
                                            disabled={campaigns.length <= 1}
                                            title={campaigns.length <= 1 ? "Cannot delete the only campaign" : "Delete this campaign"}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="campaign-field">
                                    <label><i className="fas fa-feather-pointed"></i> Campaign Title</label>
                                    <input
                                        type="text"
                                        value={campaignData.name}
                                        onChange={(e) => {
                                            const newName = e.target.value;
                                            updateCampaignData({ name: newName });
                                            if (currentCampaignId) {
                                                campaignService.updateCampaign(currentCampaignId, {
                                                    name: newName,
                                                    campaignData: { ...campaignData, name: newName }
                                                });
                                                const idStr = String(currentCampaignId);
                                                setCampaigns(prev => prev.map(c =>
                                                    String(c.id) === idStr ? { ...c, name: newName } : c
                                                ));
                                            }
                                        }}
                                        className="campaign-input"
                                        placeholder="Enter campaign title..."
                                    />
                                </div>
                                <div className="campaign-field">
                                    <label><i className="fas fa-scroll"></i> Setting Description & Narrative Arc</label>
                                    <textarea
                                        value={campaignData.description}
                                        onChange={(e) => updateCampaignData({ description: e.target.value })}
                                        className="campaign-textarea"
                                        placeholder="Describe your campaign setting, themes, key conflicts, and party goals..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="campaign-stats-grid">
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-calendar-days"></i>
                                    </div>
                                    <div className="stat-content">
                                        <span className="campaign-stat-label">Current Session</span>
                                        <div className="campaign-stat-value-row">
                                            <button
                                                type="button"
                                                className="btn-stat-stepper"
                                                onClick={() => updateCampaignData({ currentSession: Math.max(1, (campaignData.currentSession || 1) - 1) })}
                                                title="Previous session"
                                            >-</button>
                                            <span className="campaign-stat-number">{campaignData.currentSession || 1}</span>
                                            <button
                                                type="button"
                                                className="btn-stat-stepper"
                                                onClick={() => updateCampaignData({ currentSession: (campaignData.currentSession || 1) + 1 })}
                                                title="Next session"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <div className="stat-content">
                                        <span className="campaign-stat-label">Active Players</span>
                                        <span className="campaign-stat-number">{(campaignData.players || []).length}</span>
                                    </div>
                                </div>
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-map-location-dot"></i>
                                    </div>
                                    <div className="stat-content">
                                        <span className="campaign-stat-label">Locations</span>
                                        <span className="campaign-stat-number">{(campaignData.locations || []).length}</span>
                                    </div>
                                </div>
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-diagram-project"></i>
                                    </div>
                                    <div className="stat-content">
                                        <span className="campaign-stat-label">Plot Threads</span>
                                        <span className="campaign-stat-number">{(campaignData.plotThreads || []).length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="campaign-players-section">
                                <div className="campaign-section-header">
                                    <h3>Player Roster</h3>
                                    <button className="campaign-add-btn" onClick={addPlayer}>
                                        <i className="fas fa-plus"></i>
                                        Add Player
                                    </button>
                                </div>
                                <div className="players-list">
                                    {(campaignData.players || []).length > 0 ? (
                                        (campaignData.players || []).map(player => (
                                            <div key={player.id} className="player-card-expanded">
                                                <div className="player-card-header">
                                                    <div className="player-avatar">
                                                        {(player.name || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="player-info">
                                                        <div className="player-header-row">
                                                            <input
                                                                type="text"
                                                                placeholder="Character name..."
                                                                value={player.name || ''}
                                                                onChange={(e) => updatePlayer(player.id, { name: e.target.value })}
                                                                className="player-name-input"
                                                            />
                                                            <button
                                                                className="player-remove-btn"
                                                                onClick={() => removePlayer(player.id)}
                                                                title="Remove player"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                        <div className="player-details-row">
                                                            <input
                                                                type="text"
                                                                placeholder="Class..."
                                                                value={player.class || ''}
                                                                onChange={(e) => updatePlayer(player.id, { class: e.target.value })}
                                                                className="player-class-input"
                                                            />
                                                            <div className="player-level-group">
                                                                <span className="player-level-label">LVL</span>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="20"
                                                                    value={player.level || 1}
                                                                    onChange={(e) => updatePlayer(player.id, { level: parseInt(e.target.value) || 1 })}
                                                                    className="player-level-input"
                                                                />
                                                            </div>
                                                            <select
                                                                value={player.status || 'active'}
                                                                onChange={(e) => updatePlayer(player.id, { status: e.target.value })}
                                                                className="player-status-select"
                                                            >
                                                                <option value="active">Active</option>
                                                                <option value="inactive">Inactive</option>
                                                                <option value="absent">Absent</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="player-card-body">
                                                    <div className="player-fields-grid">
                                                        <div className="player-field">
                                                            <label>CHARACTER BACKGROUND</label>
                                                            <textarea
                                                                placeholder="Brief backstory, motivations..."
                                                                value={player.background || ''}
                                                                onChange={(e) => updatePlayer(player.id, { background: e.target.value })}
                                                                className="player-textarea"
                                                                rows={3}
                                                            />
                                                        </div>
                                                        <div className="player-field">
                                                            <label>PLAYER GOALS</label>
                                                            <textarea
                                                                placeholder="What the player wants to achieve..."
                                                                value={player.goals || ''}
                                                                onChange={(e) => updatePlayer(player.id, { goals: e.target.value })}
                                                                className="player-textarea"
                                                                rows={3}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="player-field player-notes-field">
                                                        <label>GM NOTES (PRIVATE)</label>
                                                        <textarea
                                                            placeholder="Private notes about this player/character..."
                                                            value={player.notes || ''}
                                                            onChange={(e) => updatePlayer(player.id, { notes: e.target.value })}
                                                            className="player-textarea player-notes"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="players-placeholder">
                                            <i className="fas fa-users"></i>
                                            <p>No players added yet. Click "Add Player" to get started!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                );

            case 'sessions':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-section-header">
                            <div>
                                <h3>Session & Scenario Director</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8b5a1a' }}>
                                    Assemble locations, encounters, loot caches, and handouts for active gameplay.
                                </p>
                            </div>
                            <button className="campaign-add-btn" onClick={addSession}>
                                <i className="fas fa-plus"></i>
                                New Session Plan
                            </button>
                        </div>
                        <div className="sessions-list">
                            {(campaignData.sessions || []).length > 0 ? (
                                (campaignData.sessions || []).map(session => (
                                    <div key={session.id} className="session-card session-dossier-card">
                                        {/* Header */}
                                        <div className="session-dossier-header">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                                <span className="session-dossier-badge">Session #{session.number}</span>
                                                <input
                                                    type="text"
                                                    value={session.title}
                                                    onChange={(e) => updateSession(session.id, { title: e.target.value })}
                                                    className="session-title-input"
                                                    style={{ flex: 1 }}
                                                    placeholder="Session Title..."
                                                />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="date"
                                                    value={session.date}
                                                    onChange={(e) => updateSession(session.id, { date: e.target.value })}
                                                    className="session-date-input"
                                                />
                                                <select
                                                    value={session.status}
                                                    onChange={(e) => updateSession(session.id, { status: e.target.value })}
                                                    className="session-status-select"
                                                >
                                                    <option value="planned">Planned</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                <button
                                                    className="session-remove-btn"
                                                    onClick={() => removeSession(session.id)}
                                                    title="Delete session"
                                                >
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
                                                <button
                                                    type="button"
                                                    className="entity-chip-add-btn"
                                                    style={{ width: 'fit-content', padding: '5px 10px' }}
                                                    onClick={() => openLinkerModal('Link Quests for this Session', getAllCampaignQuests(), session.questIds || [], (newIds) => updateSession(session.id, { questIds: newIds }))}
                                                >
                                                    <i className="fas fa-plus"></i> Select Active Quests ({getLinkedQuests(session.questIds).length})
                                                </button>
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
                                        <div className="field-group" style={{ padding: '0 15px 12px 15px' }}>
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
                                            <div className="field-group" style={{ padding: '0 15px 12px 15px' }}>
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
                                <div className="session-placeholder">
                                    <i className="fas fa-calendar-plus"></i>
                                    <p>No sessions planned yet. Create your first session to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'npcs':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-section-header">
                            <h3>NPC Management</h3>
                            <button className="campaign-add-btn" onClick={addNPC}>
                                <i className="fas fa-plus"></i>
                                Add NPC
                            </button>
                        </div>
<div className="npcs-grid">
                            {(campaignData.npcs || []).length > 0 ? (
                                (campaignData.npcs || []).map(npc => (
                                    <div key={npc.id} className="npc-card">
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

                                                <div className="field-group">
                                                    <label className="field-label"><i className="fas fa-map-marker-alt"></i> Location</label>
                                                    <input
                                                        type="text"
                                                        value={npc.location}
                                                        onChange={(e) => updateNPC(npc.id, { location: e.target.value })}
                                                        placeholder="e.g. Ironforge Tavern..."
                                                        className="card-field-input"
                                                    />
                                                </div>

                                                <div className="card-meta-grid-2col">
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
                                                <label className="field-label"><i className="fas fa-feather-pointed"></i> Physical Description & Persona</label>
                                                <textarea
                                                    value={npc.description}
                                                    onChange={(e) => updateNPC(npc.id, { description: e.target.value })}
                                                    className="card-field-textarea"
                                                    placeholder="Physical traits, quirks, demeanor, background..."
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="field-group">
                                                <label className="field-label"><i className="fas fa-key"></i> GM Secrets, Plot Hooks & Notes</label>
                                                <textarea
                                                    value={npc.notes}
                                                    onChange={(e) => updateNPC(npc.id, { notes: e.target.value })}
                                                    className="card-field-textarea"
                                                    placeholder="Plot hooks, secrets, quest connections, inventory..."
                                                    rows={2}
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
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="npc-placeholder">
                                    <i className="fas fa-user-plus"></i>
                                    <p>No NPCs created yet. Add NPCs to track relationships and story involvement!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'locations':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-section-header">
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
                                    className="campaign-add-btn"
                                    style={{ background: 'linear-gradient(135deg, #2980b9 0%, #1a5276 100%)', color: '#ffffff', borderColor: '#154360' }}
                                    onClick={() => useInteractiveMapStore.getState().openStudio()}
                                    title="Open Interactive Map Maker, Pins & Multi-Tier Atlas"
                                >
                                    <i className="fas fa-map-location-dot"></i> Map Studio
                                </button>
                                <button className="campaign-add-btn" onClick={addLocation}>
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
                            <i className="fas fa-map-plus" style={{ fontSize: '2.5rem', color: '#c59b3f', marginBottom: '12px' }}></i>
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
                            <div className="locations-list">
                                {(campaignData.locations || []).length > 0 ? (
                                    (campaignData.locations || []).map(location => (
                    <div key={location.id} className="location-card">
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
                          <i className="fas fa-align-left"></i> Overview
                        </button>
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'inhabitants' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'inhabitants' }))}
                        >
                          <i className="fas fa-dragon"></i> Lair ({getLinkedCreatures(location.monsterIds).length})
                        </button>
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'loot' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'loot' }))}
                        >
                          <i className="fas fa-gem"></i> Loot ({getLinkedItems(location.lootIds).length})
                        </button>
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'quests' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'quests' }))}
                        >
                          <i className="fas fa-scroll"></i> Quests ({getLinkedQuests(location.questIds).length})
                        </button>
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'sublocations' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'sublocations' }))}
                        >
                          <i className="fas fa-sitemap"></i> Sub-Places ({getLinkedLocations(location.connectedLocationIds || location.subLocationIds).length})
                        </button>
                        <button
                          type="button"
                          className={`loc-subtab-btn ${(locationCardTabs[location.id] || 'overview') === 'npcs' ? 'active' : ''}`}
                          onClick={() => setLocationCardTabs(prev => ({ ...prev, [location.id]: 'npcs' }))}
                        >
                          <i className="fas fa-users"></i> NPCs ({getLinkedNPCs(location.npcIds).length})
                        </button>
                      </div>

                      {/* Sub-Tab Content */}
                      <div className="card-body-fields">
                        {(locationCardTabs[location.id] || 'overview') === 'overview' && (
                          <>
                            <div className="field-group">
                              <label className="field-label"><i className="fas fa-align-left"></i> Description & Atmosphere</label>
                              <textarea
                                value={location.description}
                                onChange={(e) => updateLocation(location.id, { description: e.target.value })}
                                placeholder="Describe the atmosphere, environment, smells, architecture..."
                                rows={2}
                                className="card-field-textarea"
                              />
                            </div>
                            <div className="field-group">
                              <label className="field-label"><i className="fas fa-compass"></i> Notable Landmarks & Features</label>
                              <textarea
                                value={location.notableFeatures}
                                onChange={(e) => updateLocation(location.id, { notableFeatures: e.target.value })}
                                placeholder="Taverns, guilds, districts, monuments, dungeon entrances..."
                                rows={2}
                                className="card-field-textarea"
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
                              <span><i className="fas fa-scroll"></i> Quests & Objectives Here ({getLinkedQuests(location.questIds).length})</span>
                              <div className="entity-rack-actions">
                                <button
                                  type="button"
                                  className="entity-chip-add-btn"
                                  onClick={() => openLinkerModal(
                                    `Link Quests for ${location.name || 'Location'}`,
                                    getAllCampaignQuests(),
                                    location.questIds || [],
                                    (newIds) => updateLocation(location.id, { questIds: newIds }),
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
                              {getLinkedQuests(location.questIds).map(q => (
                                <span key={q.id} className="entity-chip-pill quest-chip">
                                  <i className="fas fa-scroll" style={{ color: '#f39c12', fontSize: '11px' }}></i>
                                  <span className="entity-chip-pill-name">{q.title}</span>
                                  <span className="entity-picker-source-badge" style={{ fontSize: '0.6rem', padding: '0 4px', background: 'rgba(243, 156, 18, 0.15)', borderColor: '#f39c12', color: '#d35400' }}>
                                    {q.status || 'Active'}
                                  </span>
                                  <button
                                    type="button"
                                    className="entity-chip-remove"
                                    onClick={() => updateLocation(location.id, { questIds: (location.questIds || []).filter(id => String(id) !== String(q.id)) })}
                                    title="Unlink quest from location"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </span>
                              ))}
                              {(!location.questIds || location.questIds.length === 0) && (
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
                                    <div className="location-placeholder">
                                        <i className="fas fa-map-plus"></i>
                                        <p>No locations created yet. Build your world by adding important places!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case 'quests':
                return (
                    <div className="campaign-tab-content">
            <div className="campaign-section-header">
              <div>
                <h3>Quest & Objective Log</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8b5a1a' }}>
                  Track active quests, main story arcs, bounties, and checklist objectives.
                </p>
              </div>
              <div className="section-header-actions">
                <button className="campaign-add-btn" onClick={addQuest}>
                  <i className="fas fa-plus"></i> New Quest
                </button>
              </div>
            </div>

            <div className="locations-list">
              {(campaignData.quests || []).length > 0 ? (
                (campaignData.quests || []).map(quest => (
                  <div key={quest.id} className="location-card quest-card">
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

                      <div className="card-meta-grid-2col" style={{ marginTop: '6px' }}>
                        <div className="field-group">
                          <label className="field-label"><i className="fas fa-user"></i> Quest Giver</label>
                          <input
                            type="text"
                            value={quest.giver || ''}
                            onChange={(e) => updateQuest(quest.id, { giver: e.target.value })}
                            placeholder="e.g. Captain Vane..."
                            className="card-field-input"
                          />
                        </div>
                        <div className="field-group">
                          <label className="field-label"><i className="fas fa-map-pin"></i> Target Location</label>
                          <input
                            type="text"
                            value={quest.location || ''}
                            onChange={(e) => updateQuest(quest.id, { location: e.target.value })}
                            placeholder="e.g. Sunken Ruins..."
                            className="card-field-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="card-body-fields">
                      <div className="field-group">
                        <label className="field-label"><i className="fas fa-align-left"></i> Summary & Objectives Brief</label>
                        <textarea
                          value={quest.description || ''}
                          onChange={(e) => updateQuest(quest.id, { description: e.target.value })}
                          placeholder="Describe the quest premise, stakes, and player briefings..."
                          rows={2}
                          className="card-field-textarea"
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="location-placeholder">
                  <i className="fas fa-scroll"></i>
                  <p>No quests recorded yet. Click <strong>+ New Quest</strong> to add story missions and contracts!</p>
                </div>
              )}
            </div>
                    </div>
                );

            case 'plots':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-section-header">
                            <h3>Plot Thread Management</h3>
                            <button className="campaign-add-btn" onClick={addPlotThread}>
                                <i className="fas fa-plus"></i>
                                New Plot Thread
                            </button>
                        </div>
                        <div className="plots-list">
                            {(campaignData.plotThreads || []).length > 0 ? (
                                (campaignData.plotThreads || []).map(plotThread => (
                                    <div key={plotThread.id} className="plot-card">
                                        <div className="card-media-banner-container">
                                            {plotThread.image ? (
                                                <div className="media-banner-preview">
                                                    <img src={plotThread.image} alt={plotThread.title} />
                                                    <div className="media-hover-overlay">
                                                        <label className="media-change-btn" title="Change banner">
                                                            <i className="fas fa-camera"></i> Change Banner
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                             if (file) handleMediaUpload(file, 'banners', (url) => updatePlotThread(plotThread.id, { image: url }), plotThread.image);
                                                                        }}
                                                            />
                                                        </label>
                                                        <button
                                                            type="button"
                                                            className="media-clear-btn-pill"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMediaRemove(plotThread.image, () => updatePlotThread(plotThread.id, { image: null }));
                                                            }}
                                                            title="Remove banner"
                                                        >
                                                            <i className="fas fa-trash-alt"></i> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className="media-banner-placeholder" title="Upload quest artwork">
                                                    <i className="fas fa-scroll"></i>
                                                    <span>Upload Plot Banner</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                         if (file) handleMediaUpload(file, 'banners', (url) => updatePlotThread(plotThread.id, { image: url }), plotThread.image);
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
                                                        value={plotThread.title}
                                                        onChange={(e) => updatePlotThread(plotThread.id, { title: e.target.value })}
                                                        className="card-title-input full-width"
                                                        placeholder="Plot thread title..."
                                                    />
                                                </div>
                                                <button className="remove-card-btn" onClick={() => removePlotThread(plotThread.id)} title="Delete Thread">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>

                                            <div className="card-meta-grid-2col">
                                                <div className="field-group">
                                                    <label className="field-label"><i className="fas fa-bars-progress"></i> Status</label>
                                                    <select
                                                        value={plotThread.status || 'active'}
                                                        onChange={(e) => updatePlotThread(plotThread.id, { status: e.target.value })}
                                                        className="card-field-select"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="on-hold">On Hold</option>
                                                        <option value="resolved">Resolved</option>
                                                        <option value="abandoned">Abandoned</option>
                                                    </select>
                                                </div>
                                                <div className="field-group">
                                                    <label className="field-label"><i className="fas fa-circle-exclamation"></i> Priority</label>
                                                    <select
                                                        value={plotThread.priority || 'medium'}
                                                        onChange={(e) => updatePlotThread(plotThread.id, { priority: e.target.value })}
                                                        className={`card-field-select priority-${plotThread.priority}`}
                                                    >
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                        <option value="critical">Critical</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-body-fields">
                                            <div className="field-group">
                                                <label className="field-label"><i className="fas fa-book-open"></i> Story Arc & Narrative</label>
                                                <textarea
                                                    value={plotThread.description}
                                                    onChange={(e) => updatePlotThread(plotThread.id, { description: e.target.value })}
                                                    className="card-field-textarea"
                                                    placeholder="Describe the storyline, underlying conspiracy, stakes..."
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="field-group">
                                                <label className="field-label"><i className="fas fa-users"></i> Key Characters & Related NPCs</label>
                                                <input
                                                    type="text"
                                                    value={Array.isArray(plotThread.relatedNPCs) ? plotThread.relatedNPCs.join(', ') : (plotThread.relatedNPCs || '')}
                                                    onChange={(e) => updatePlotThread(plotThread.id, {
                                                        relatedNPCs: e.target.value ? e.target.value.split(',').map(n => n.trim()).filter(n => n) : []
                                                    })}
                                                    className="card-field-input"
                                                    placeholder="e.g. Lord Boros, Captain Valen..."
                                                />
                                            </div>
                                            <div className="field-group">
                                                <label className="field-label"><i className="fas fa-clock-rotate-left"></i> Timeline, Clues & Progression</label>
                                                <textarea
                                                    value={plotThread.notes}
                                                    onChange={(e) => updatePlotThread(plotThread.id, { notes: e.target.value })}
                                                    className="card-field-textarea"
                                                    placeholder="Key milestones, discovered clues, branching decisions..."
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="plot-placeholder">
                                    <i className="fas fa-project-diagram"></i>
                                    <p>No plot threads tracked yet. Create storylines to keep your campaign organized!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'shareables':
                return (
                    <div className="campaign-tab-content">
                        <div className="shareables-workspace">
                            {/* Create New Shareable */}
                            <div className="shareables-creator">
                                <h3 className="section-title">
                                    <i className="fas fa-plus-circle"></i>
                                    Create Shareable Content
                                </h3>

                                <div className="shareable-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Type</label>
                                            <select
                                                value={newShareableType}
                                                onChange={(e) => setNewShareableType(e.target.value)}
                                                className="shareable-select"
                                            >
                                                <option value="text">Text Document</option>
                                                <option value="image">Image</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                value={newShareableTitle}
                                                onChange={(e) => setNewShareableTitle(e.target.value)}
                                                placeholder="Enter title..."
                                                className="shareable-input"
                                            />
                                        </div>

                                        {newShareableType === 'text' && (
                                            <div className="form-group">
                                                <label>Style</label>
                                                <select
                                                    value={newShareableBackground}
                                                    onChange={(e) => setNewShareableBackground(e.target.value)}
                                                    className="shareable-select"
                                                >
                                                    <option value="parchment">Parchment</option>
                                                    <option value="aged">Aged Paper</option>
                                                    <option value="bloodstained">Bloodstained</option>
                                                    <option value="dark">Dark Letter</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {newShareableType === 'text' ? (
                                        <div className="form-group">
                                            <label>Content</label>
                                            <textarea
                                                value={newShareableContent}
                                                onChange={(e) => setNewShareableContent(e.target.value)}
                                                placeholder="Write your document content here..."
                                                className="shareable-textarea"
                                                rows={6}
                                            />
                                        </div>
                                    ) : (
                                        <div className="form-group">
                                            <label>Image</label>
                                            <div className="shareable-image-input">
                                                <input
                                                    ref={shareableFileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                         if (file) handleMediaUpload(file, 'misc', (url) => setNewShareableContent(url), newShareableContent);
                                                    }}
                                                    style={{ display: 'none' }}
                                                />
                                                <button
                                                    className="upload-btn"
                                                    onClick={() => shareableFileInputRef.current?.click()}
                                                >
                                                    <i className="fas fa-upload"></i>
                                                    Choose Image
                                                </button>
                                                {newShareableContent && (
                                                    <img
                                                        src={newShareableContent}
                                                        alt="Preview"
                                                        className="shareable-preview"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        className="shareable-add-btn"
                                        onClick={() => {
                                            if (newShareableTitle && newShareableContent) {
                                                addShareable({
                                                    type: newShareableType,
                                                    title: newShareableTitle,
                                                    content: newShareableContent,
                                                    background: newShareableBackground
                                                });
                                                setNewShareableTitle('');
                                                setNewShareableContent('');
                                            }
                                        }}
                                        disabled={!newShareableTitle || !newShareableContent}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Add to Library
                                    </button>
                                </div>
                            </div>

                            {/* Shareables Library */}
                            <div className="shareables-library">
                                <h3 className="section-title">
                                    <i className="fas fa-folder-open"></i>
                                    Shareable Library ({shareables.length})
                                </h3>

                                {shareables.length === 0 ? (
                                    <div className="shareables-empty">
                                        <i className="fas fa-share-alt"></i>
                                        <p>No shareables created yet</p>
                                        <span>Create documents and images to share with your players</span>
                                    </div>
                                ) : (
                                    <div className="shareables-grid">
                                        {shareables.map(shareable => (
                                            <div key={shareable.id} className={`shareable-card ${shareable.type}`}>
                                                <div className="shareable-preview-thumb">
                                                    {shareable.type === 'image' ? (
                                                        <img src={shareable.content} alt={shareable.title} />
                                                    ) : (
                                                        <div className={`document-preview ${shareable.background}`}>
                                                            <i className="fas fa-file-alt"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="shareable-info">
                                                    <span className="shareable-title">{shareable.title}</span>
                                                    <span className="shareable-type">
                                                        {shareable.type === 'image' ? 'Image' : 'Document'}
                                                    </span>
                                                </div>
                                                <div className="shareable-actions">
                                                    <button
                                                        className="action-btn show"
                                                        onClick={() => showToPlayers({
                                                            type: shareable.type,
                                                            title: shareable.title,
                                                            content: shareable.content,
                                                            background: shareable.background,
                                                            description: ''
                                                        })}
                                                        title="Show to Players"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => removeShareable(shareable.id)}
                                                        title="Delete"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'homebrew':
                return (
                    <div className="campaign-tab-content">
                        <div className="homebrew-workspace">
                            {/* Homebrew Sub-navigation */}
                            <div className="homebrew-subtabs">
                                <button
                                    className={`homebrew-subtab ${homebrewSubTab === 'items' ? 'active' : ''}`}
                                    onClick={() => setHomebrewSubTab('items')}
                                >
                                    <i className="fas fa-sword"></i>
                                    Items ({((campaignData.selectedItems || []).length) + (Array.isArray(campaignData.homebrew?.items) ? campaignData.homebrew.items.length : (campaignData.homebrew?.items ? Object.keys(campaignData.homebrew.items).length : 0))})
                                </button>
                                <button
                                    className={`homebrew-subtab ${homebrewSubTab === 'monsters' ? 'active' : ''}`}
                                    onClick={() => setHomebrewSubTab('monsters')}
                                >
                                    <i className="fas fa-dragon"></i>
                                    Monsters ({((campaignData.selectedCreatures || []).length) + (Array.isArray(campaignData.homebrew?.monsters) ? campaignData.homebrew.monsters.length : (campaignData.homebrew?.monsters ? Object.keys(campaignData.homebrew.monsters).length : 0))})
                                </button>
                                <button
                                    className={`homebrew-subtab ${homebrewSubTab === 'spells' ? 'active' : ''}`}
                                    onClick={() => setHomebrewSubTab('spells')}
                                >
                                    <i className="fas fa-hat-wizard"></i>
                                    Spells ({((campaignData.selectedSpells || []).length) + (Array.isArray(campaignData.homebrew?.spells) ? campaignData.homebrew.spells.length : (campaignData.homebrew?.spells ? Object.keys(campaignData.homebrew.spells).length : 0))})
                                </button>
                                <button
                                    className={`homebrew-subtab ${homebrewSubTab === 'lore' ? 'active' : ''}`}
                                    onClick={() => setHomebrewSubTab('lore')}
                                >
                                    <i className="fas fa-book-open"></i>
                                    Lore ({Array.isArray(campaignData.homebrew?.lore) ? campaignData.homebrew.lore.length : (campaignData.homebrew?.lore ? Object.keys(campaignData.homebrew.lore).length : 0)})
                                </button>
                            </div>

                            {/* Homebrew Content */}
                            <div className="homebrew-content">
                                {homebrewSubTab === 'items' && (
                                    <div className="homebrew-section">
                                        <div className="campaign-section-header">
                                            <h3>Campaign Items</h3>
                                            <div className="homebrew-actions">
                                                <button className="campaign-add-btn library-btn" onClick={addItemFromLibrary}>
                                                    <i className="fas fa-book"></i>
                                                    Browse Library
                                                </button>
                                                <button className="campaign-add-btn homebrew-wizard-btn" onClick={addHomebrewItem}>
                                                    <i className="fas fa-plus"></i>
                                                    Create Custom
                                                </button>
                                            </div>
                                        </div>

                                        {/* Library Items */}
                                        {(campaignData.selectedItems || []).length > 0 && (
                                            <div className="campaign-library-section">
                                                <div className="campaign-library-section-header">
                                                    <h4 className="library-section-title">
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
                                                <h4 className="library-section-title">
                                                    <i className="fas fa-hammer"></i> Custom Homebrew Items ({campaignData.homebrew.items.length})
                                                </h4>
                                            )}
                                            <div className="homebrew-grid">
                                                {(campaignData.homebrew?.items || []).length > 0 ? (
                                                    (campaignData.homebrew?.items || []).map(item => (
                                                        <div key={item.id} className="homebrew-card homebrew-craft-card campaign-parchment-card">
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
                                                    <div className="homebrew-placeholder">
                                                        <i className="fas fa-gem"></i>
                                                        <p>No custom items yet. Create homebrew items for your campaign!</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {homebrewSubTab === 'monsters' && (
                                    <div className="homebrew-section">
                                        <div className="campaign-section-header">
                                            <h3>Campaign Creatures</h3>
                                            <div className="homebrew-actions">
                                                <button className="campaign-add-btn library-btn" onClick={addCreatureFromLibrary}>
                                                    <i className="fas fa-book"></i>
                                                    Browse Library
                                                </button>
                                                <button className="campaign-add-btn homebrew-wizard-btn" onClick={addHomebrewMonster}>
                                                    <i className="fas fa-plus"></i>
                                                    Create Custom
                                                </button>
                                            </div>
                                        </div>

                                        {/* Library Creatures */}
                                        {(campaignData.selectedCreatures || []).length > 0 && (
                                            <div className="campaign-library-section">
                                                <div className="campaign-library-section-header">
                                                    <h4 className="library-section-title">
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

                                        {/* Custom Homebrew Monsters */}
                                        <div className="homebrew-monsters-section">
                                            {(campaignData.homebrew?.monsters || []).length > 0 && (
                                                <h4 className="library-section-title">
                                                    <i className="fas fa-hammer"></i> Custom Homebrew Creatures ({campaignData.homebrew.monsters.length})
                                                </h4>
                                            )}
                                            <div className="homebrew-grid">
                                                {(campaignData.homebrew?.monsters || []).length > 0 ? (
                                                    (campaignData.homebrew?.monsters || []).map(monster => (
                                                        <div key={monster.id} className="homebrew-card homebrew-craft-card campaign-parchment-card">
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
                                                    <div className="homebrew-placeholder">
                                                        <i className="fas fa-dragon"></i>
                                                        <p>No custom monsters yet. Create fearsome foes for your party!</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {homebrewSubTab === 'spells' && (
                                    <div className="homebrew-section">
                                        <div className="campaign-section-header">
                                            <h3>Campaign Spells</h3>
                                            <div className="homebrew-actions">
                                                <button className="campaign-add-btn library-btn" onClick={addSpellFromLibrary}>
                                                    <i className="fas fa-book"></i>
                                                    Browse Library
                                                </button>
                                                <button className="campaign-add-btn homebrew-wizard-btn" onClick={addHomebrewSpell}>
                                                    <i className="fas fa-plus"></i>
                                                    Create Custom
                                                </button>
                                            </div>
                                        </div>

                                        {/* Library Spells */}
                                        {(campaignData.selectedSpells || []).length > 0 && (
                                            <div className="campaign-library-section">
                                                <div className="campaign-library-section-header">
                                                    <h4 className="library-section-title">
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
                                                <h4 className="library-section-title">
                                                    <i className="fas fa-hammer"></i> Custom Homebrew Spells ({campaignData.homebrew.spells.length})
                                                </h4>
                                            )}
                                            <div className="homebrew-grid">
                                                {(campaignData.homebrew?.spells || []).length > 0 ? (
                                                    (campaignData.homebrew?.spells || []).map(spell => (
                                                        <div key={spell.id} className="homebrew-card homebrew-craft-card campaign-parchment-card">
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
                                                    <div className="homebrew-placeholder">
                                                        <i className="fas fa-hat-wizard"></i>
                                                        <p>No custom spells yet. Craft unique magical abilities!</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {homebrewSubTab === 'lore' && (
                                    <div className="homebrew-section">
                                        <div className="campaign-section-header">
                                            <h3>World Lore & Chronicles</h3>
                                            <div className="homebrew-actions">
                                                <button className="campaign-add-btn homebrew-wizard-btn" onClick={addLoreArticle}>
                                                    <i className="fas fa-plus"></i>
                                                    New Lore Article
                                                </button>
                                            </div>
                                        </div>

                                        <div className="lore-articles-list">
                                            {(campaignData.homebrew?.lore || []).length > 0 ? (
                                                (campaignData.homebrew?.lore || []).map(article => (
                                                    <div key={article.id} className="content-card lore-card lore-article-card">
                                                        {/* Top Hero Banner */}
                                                        <div className="card-media-banner-container">
                                                            {article.image ? (
                                                                <div className="media-banner-preview">
                                                                    <img src={article.image} alt={article.title} />
                                                                    <div className="media-hover-overlay">
                                                                        <label className="media-change-btn" title="Change artwork">
                                                                            <i className="fas fa-camera"></i> Change Artwork
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                style={{ display: 'none' }}
                                                                                onChange={(e) => {
                                                                                    const file = e.target.files?.[0];
                                                                                     if (file) handleMediaUpload(file, 'lore', (url) => updateLoreArticle(article.id, { image: url }), article.image);
                                                                                }}
                                                                            />
                                                                        </label>
                                                                        <button
                                                                            type="button"
                                                                            className="media-clear-btn-pill"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleMediaRemove(article.image, () => updateLoreArticle(article.id, { image: null }));
                                                                            }}
                                                                            title="Remove lore artwork"
                                                                        >
                                                                            <i className="fas fa-trash-alt"></i> Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <label className="media-banner-placeholder" title="Upload lore artwork">
                                                                    <i className="fas fa-book-bookmark"></i>
                                                                    <span>Upload Lore Banner / Illustration</span>
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        style={{ display: 'none' }}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                             if (file) handleMediaUpload(file, 'lore', (url) => updateLoreArticle(article.id, { image: url }), article.image);
                                                                        }}
                                                                    />
                                                                </label>
                                                            )}
                                                        </div>

                                                        <div className="card-header-fields">
                                                            <div className="card-field-header-top">
                                                                <div className="field-group flex-1">
                                                                    <label className="field-label"><i className="fas fa-book-open"></i> Article Title</label>
                                                                    <input
                                                                        type="text"
                                                                        value={article.title}
                                                                        onChange={(e) => updateLoreArticle(article.id, { title: e.target.value })}
                                                                        className="card-title-input full-width"
                                                                        placeholder="Lore title..."
                                                                    />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="share-chat-pill"
                                                                    onClick={() => {
                                                                        const { addNotification } = useChatStore.getState();
                                                                        addNotification('social', {
                                                                            type: 'system',
                                                                            sender: 'GM Codex',
                                                                            message: `📜 **World Lore: ${article.title || 'Untitled'}** (${(article.category || 'General').toUpperCase()})\n\n${article.content || '(No content)'}`
                                                                        });
                                                                    }}
                                                                    title="Broadcast lore article to game chat"
                                                                >
                                                                    <i className="fas fa-bullhorn"></i> Share to Chat
                                                                </button>
                                                                <button className="remove-card-btn" onClick={() => removeLoreArticle(article.id)} title="Delete Article">
                                                                    <i className="fas fa-trash-alt"></i>
                                                                </button>
                                                            </div>

                                                            <div className="card-meta-grid-2col">
                                                                <div className="field-group flex-1">
                                                                    <label className="field-label"><i className="fas fa-layer-group"></i> Category</label>
                                                                    <select
                                                                        value={article.category || 'history'}
                                                                        onChange={(e) => updateLoreArticle(article.id, { category: e.target.value })}
                                                                        className="card-field-select"
                                                                    >
                                                                        <option value="history">History & Chronicles</option>
                                                                        <option value="religion">Religion & Deities</option>
                                                                        <option value="faction">Factions & Orders</option>
                                                                        <option value="legend">Myths & Legends</option>
                                                                        <option value="culture">Cultures & Peoples</option>
                                                                        <option value="geography">Geography & Realms</option>
                                                                        <option value="magic">Magic & Arcana</option>
                                                                    </select>
                                                                </div>
                                                                <div className="field-group" style={{ alignSelf: 'flex-end' }}>
                                                                    <label className="secret-toggle-pill" title="Mark as GM Secret">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={article.isSecret || false}
                                                                            onChange={(e) => updateLoreArticle(article.id, { isSecret: e.target.checked })}
                                                                        />
                                                                        <i className={`fas ${article.isSecret ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                                        <span>{article.isSecret ? 'GM Secret' : 'Public Lore'}</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="card-body-fields">
                                                            <div className="field-group">
                                                                <label className="field-label"><i className="fas fa-feather-pointed"></i> Chronicle & Codex Content</label>
                                                                <textarea
                                                                    value={article.content}
                                                                    onChange={(e) => updateLoreArticle(article.id, { content: e.target.value })}
                                                                    placeholder="Write the history, mythology, scriptures, or background lore here..."
                                                                    className="card-field-textarea large"
                                                                />
                                                            </div>
                                                            <div className="field-group">
                                                                <label className="field-label"><i className="fas fa-tags"></i> Related Tags</label>
                                                                <input
                                                                    type="text"
                                                                    value={article.tags?.join(', ') || ''}
                                                                    onChange={(e) => updateLoreArticle(article.id, {
                                                                        tags: e.target.value ? e.target.value.split(',').map(t => t.trim()).filter(t => t) : []
                                                                    })}
                                                                    placeholder="e.g. kingdom, ancient, god wars..."
                                                                    className="card-field-input"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="lore-placeholder">
                                                    <i className="fas fa-scroll"></i>
                                                    <p>No lore articles yet. Start building your world's history and mythology!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {homebrewSubTab === 'lineages' && (
                                    <div className="homebrew-section">
                                        <div className="campaign-section-header">
                                            <div className="lineage-view-toggle-bar" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <button
                                                    type="button"
                                                    className={`campaign-add-btn ${lineageViewMode === 'species' ? '' : 'btn-ghost'}`}
                                                    onClick={() => setLineageViewMode('species')}
                                                    style={lineageViewMode === 'species' ? {} : { background: '#fdfbf7', color: '#5a2e12', border: '1px solid rgba(139,69,19,0.3)' }}
                                                >
                                                    <i className="fas fa-dna"></i> Cultural Lineages & Species
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`campaign-add-btn ${lineageViewMode === 'family_trees' ? '' : 'btn-ghost'}`}
                                                    onClick={() => setLineageViewMode('family_trees')}
                                                    style={lineageViewMode === 'family_trees' ? { background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', color: '#1a0f05' } : { background: '#fdfbf7', color: '#5a2e12', border: '1px solid rgba(139,69,19,0.3)' }}
                                                >
                                                    <i className="fas fa-sitemap"></i> Dynasties & Family Trees
                                                </button>
                                            </div>
                                            <div className="homebrew-actions">
                                                {lineageViewMode === 'species' ? (
                                                    <button className="campaign-add-btn homebrew-wizard-btn" onClick={() => useCustomLineageStore.getState().openWizard()}>
                                                        <i className="fas fa-plus"></i> Forge Custom Lineage
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="campaign-add-btn"
                                                        style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', color: '#1a0f05' }}
                                                        onClick={() => useFamilyTreeStore.getState().openStudio()}
                                                    >
                                                        <i className="fas fa-wand-magic-sparkles"></i> Open Family Tree Studio
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {lineageViewMode === 'species' ? (
                                            <div className="lineages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
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
                                            <div className="family-trees-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
                                                {useFamilyTreeStore.getState().trees.map((tree) => (
                                                    <div key={tree.id} className="campaign-lineage-card" style={{ borderLeft: '3px solid #d4af37' }}>
                                                        <div className="campaign-lineage-header">
                                                            <span className="campaign-lineage-badge canon" style={{ background: 'rgba(212, 175, 55, 0.15)', borderColor: '#d4af37', color: '#8b5a1a' }}>
                                                                <i className="fas fa-crown"></i> Dynasty Tree
                                                            </span>
                                                            <h4 className="campaign-lineage-title">{tree.name}</h4>
                                                            <span className="campaign-lineage-essence">{tree.nodes.length} Members • {tree.relationships.length} Links</span>
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

                                {homebrewSubTab === 'world_maps' && (
                                    <div className="homebrew-section">
                                        <div className="campaign-section-header">
                                            <h3>Interactive World Maps & Fog of War</h3>
                                            <div className="homebrew-actions">
                                                <button
                                                    type="button"
                                                    className="campaign-add-btn"
                                                    style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', color: '#1a0f05' }}
                                                    onClick={() => useInteractiveMapStore.getState().openStudio()}
                                                >
                                                    <i className="fas fa-map-location-dot"></i> Launch World Map Studio
                                                </button>
                                            </div>
                                        </div>

                                        <div className="campaign-lineage-card" style={{ padding: '24px', background: 'linear-gradient(145deg, #fdfbf7 0%, #f4ede0 100%)' }}>
                                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#2c180d', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #d4af37', flexShrink: 0 }}>
                                                    <i className="fas fa-compass" style={{ fontSize: '36px', color: '#d4af37' }}></i>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '20px', color: '#3a1d0b', margin: '0 0 6px 0' }}>Nordhalla Continental & Regional Studio</h4>
                                                    <p style={{ fontFamily: 'Spectral, serif', fontSize: '14.5px', color: '#5a3d28', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                                                        Interactive world canvas featuring real-time Fog of War painting, draggable party camp token with expedition notes & reminders, hierarchical sub-maps, and custom landmark pins.
                                                    </p>
                                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                        <button
                                                            type="button"
                                                            className="campaign-add-btn"
                                                            style={{ background: 'linear-gradient(135deg, #8B4513 0%, #5a1e12 100%)' }}
                                                            onClick={() => useInteractiveMapStore.getState().openStudio('nordhalla-realm')}
                                                        >
                                                            <i className="fas fa-mountain"></i> Enter High Realm of Nordhalla
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Content coming soon...</div>;
        }
    };

    // Handler for input modal
    const handleInputSubmit = () => {
        if (inputModalConfig.onSubmit && inputValue.trim()) {
            inputModalConfig.onSubmit(inputValue);
            setShowInputModal(false);
            setInputValue('');
        }
    };

    const renderCampaignManagerLockedView = () => {
        return (
            <div className="journal-locked-container">
                <div className="journal-locked-card">
                    <div className="journal-locked-icon-wrapper">
                        <i className="fas fa-crown journal-locked-icon"></i>
                    </div>
                    <h2>Campaign Manager</h2>
                    <div className="premium-badge">Dungeon Master & Archmage Feature</div>
                    <p className="journal-locked-subtitle">
                        Organize your campaign lore, plot threads, NPCs, and session logs in one place.
                    </p>
                    <div className="journal-locked-features">
                        <div className="locked-feature-item">
                            <i className="fas fa-check-circle"></i>
                            <span>Track session logs, summaries, and quest progress</span>
                        </div>
                        <div className="locked-feature-item">
                            <i className="fas fa-check-circle"></i>
                            <span>Manage NPCs, locations, and lore encyclopedias</span>
                        </div>
                        <div className="locked-feature-item">
                            <i className="fas fa-check-circle"></i>
                            <span>Manage custom homebrew items, spells, and creatures</span>
                        </div>
                        <div className="locked-feature-item">
                            <i className="fas fa-check-circle"></i>
                            <span>Link maps and prepared shareable player handouts</span>
                        </div>
                    </div>
                    <p className="journal-locked-hint">
                        Upgrade your account to Dungeon Master (Pro) or higher to unlock the Campaign Manager.
                    </p>
                </div>
            </div>
        );
    };

    const defaultWinWidth = Math.min(1160, Math.max(900, typeof window !== 'undefined' ? window.innerWidth - 60 : 1080));
    const defaultWinHeight = Math.min(780, Math.max(620, typeof window !== 'undefined' ? window.innerHeight - 60 : 720));
    const defaultWinX = Math.max(20, Math.floor((typeof window !== 'undefined' ? window.innerWidth - defaultWinWidth : 100) / 2));
    const defaultWinY = Math.max(20, Math.floor((typeof window !== 'undefined' ? window.innerHeight - defaultWinHeight : 100) / 2));

    if (!campaignManagerFullLoading && !campaignManagerFullAllowed) {
        return (
            <MythrillWindow
                isOpen={isOpen}
                onClose={onClose}
                title=""
                className="campaign-manager-locked-window"
                defaultSize={{ width: 620, height: 480 }}
                centered
            >
                {renderCampaignManagerLockedView()}
            </MythrillWindow>
        );
    }

    return (
        <>
            <MythrillWindow
                isOpen={isOpen}
                onClose={onClose}
                title="Campaign Manager"
                defaultSize={{ width: defaultWinWidth, height: defaultWinHeight }}
                defaultPosition={{ x: defaultWinX, y: defaultWinY }}
                minConstraints={[720, 500]}
                customHeader={
                    <div className="spellbook-tab-container campaign-tabs-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`spellbook-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <i className={`fas ${tab.icon}`} style={{ marginRight: '6px', fontSize: '11px' }}></i>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                }
            >
                <div className="campaign-manager-content">
                    {renderTabContent()}
                </div>
            </MythrillWindow>

            {/* Input Modal */}
            {showInputModal && (
                <div
                    className="campaign-modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100000,
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)'
                    }}
                    onClick={() => {
                        setShowInputModal(false);
                        setInputValue('');
                    }}
                >
                    <div
                        className="input-modal"
                        style={{
                            backgroundColor: '#f0e6d2',
                            border: '3px solid #8b7355',
                            borderRadius: '8px',
                            padding: '20px',
                            maxWidth: '400px',
                            width: '90%',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            color: '#3a2f1a',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 15px 0', color: '#8b7355' }}>{inputModalConfig.title}</h3>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleInputSubmit();
                                }
                            }}
                            placeholder={inputModalConfig.placeholder}
                            style={{
                                width: '100%',
                                padding: '8px',
                                fontSize: '14px',
                                border: '2px solid #8b7355',
                                borderRadius: '4px',
                                fontFamily: 'inherit',
                                marginBottom: '15px',
                                boxSizing: 'border-box'
                            }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowInputModal(false);
                                    setInputValue('');
                                }}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#4a5d23',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInputSubmit}
                                disabled={!inputValue.trim()}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: inputValue.trim() ? '#8b7355' : '#cccccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                                    fontFamily: 'inherit'
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {isConfirmModalOpen && (
                <div
                    className="campaign-modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100000,
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)'
                    }}
                    onClick={() => {
                        setIsConfirmModalOpen(false);
                        setConfirmModalConfig({ message: '', onConfirm: null });
                    }}
                >
                    <div
                        className="confirm-modal"
                        style={{
                            backgroundColor: '#f0e6d2',
                            border: '3px solid #8b7355',
                            borderRadius: '8px',
                            padding: '20px',
                            maxWidth: '400px',
                            textAlign: 'center',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            color: '#3a2f1a',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 15px 0', color: '#8b7355' }}>Confirm Action</h3>
                        <p style={{ margin: '0 0 20px 0', lineHeight: '1.4' }}>
                            {confirmModalConfig.message}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                onClick={() => {
                                    setIsConfirmModalOpen(false);
                                    setConfirmModalConfig({ message: '', onConfirm: null });
                                }}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#4a5d23',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmModalConfig.onConfirm) {
                                        confirmModalConfig.onConfirm();
                                    }
                                    setIsConfirmModalOpen(false);
                                    setConfirmModalConfig({ message: '', onConfirm: null });
                                }}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#8b7355',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit'
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* In-Game Integrated Account Studios */}
            <CustomLineageWizard />
            <FamilyTreeStudio />
            <InteractiveMapStudio />
        </>
    );
}

export default CampaignManagerWindow;
