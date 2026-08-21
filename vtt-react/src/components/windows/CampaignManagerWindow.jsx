import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import MythrillWindow from './MythrillWindow';
import LibraryBrowserModal, { LIBRARY_TYPES } from '../account/LibraryBrowserModal';
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

    // Modal state
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', callback: null });

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
    }, [campaignData, currentCampaignId]);

    const updateCampaignData = (updates) => {
        setCampaignData(prev => ({ ...prev, ...updates }));
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
                            <h3>Session Management</h3>
                            <button className="campaign-add-btn" onClick={addSession}>
                                <i className="fas fa-plus"></i>
                                New Session
                            </button>
                        </div>
                        <div className="sessions-list">
                            {(campaignData.sessions || []).length > 0 ? (
                                (campaignData.sessions || []).map(session => (
                                    <div key={session.id} className="session-card">
                                        <div className="session-header">
                                            <div className="session-title-section">
                                                <input
                                                    type="text"
                                                    value={session.title}
                                                    onChange={(e) => updateSession(session.id, { title: e.target.value })}
                                                    className="session-title-input"
                                                />
                                                <div className="session-meta">
                                                    <span className="session-number">#{session.number}</span>
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
                                                </div>
                                            </div>
                                            <button
                                                className="session-remove-btn"
                                                onClick={() => removeSession(session.id)}
                                                title="Delete session"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className="session-content">
                                            <div className="session-field">
                                                <label>Session Notes</label>
                                                <textarea
                                                    value={session.notes}
                                                    onChange={(e) => updateSession(session.id, { notes: e.target.value })}
                                                    className="session-textarea"
                                                    placeholder="Plan objectives, encounters, plot points..."
                                                    rows={3}
                                                />
                                            </div>
                                            {session.status === 'completed' && (
                                                <div className="session-field">
                                                    <label>Session Summary</label>
                                                    <textarea
                                                        value={session.summary}
                                                        onChange={(e) => updateSession(session.id, { summary: e.target.value })}
                                                        className="session-textarea"
                                                        placeholder="What happened this session..."
                                                        rows={3}
                                                    />
                                                </div>
                                            )}
                                        </div>
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
                            <h3>Location Management</h3>
                            <button className="campaign-add-btn" onClick={addLocation}>
                                <i className="fas fa-plus"></i>
                                Add Location
                            </button>
                        </div>
                        <div className="locations-grid">
                            {(campaignData.locations || []).length > 0 ? (
                                (campaignData.locations || []).map(location => (
                                    <div key={location.id} className="location-card">
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
                                        </div>

                                        <div className="card-body-fields">
                                            <div className="field-group">
                                                <label className="field-label"><i className="fas fa-align-left"></i> Description & Atmosphere</label>
                                                <textarea
                                                    value={location.description}
                                                    onChange={(e) => updateLocation(location.id, { description: e.target.value })}
                                                    className="card-field-textarea"
                                                    placeholder="Describe the atmosphere, environment, smells, architecture..."
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="field-group">
                                                <label className="field-label"><i className="fas fa-compass"></i> Notable Landmarks & Features</label>
                                                <textarea
                                                    value={location.notableFeatures}
                                                    onChange={(e) => updateLocation(location.id, { notableFeatures: e.target.value })}
                                                    className="card-field-textarea"
                                                    placeholder="Taverns, guilds, districts, monuments, dungeon entrances..."
                                                    rows={2}
                                                />
                                            </div>
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
