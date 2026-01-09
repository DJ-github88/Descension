import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import WowWindow from './WowWindow';
import '../../styles/campaign-manager.css';
import LibraryBrowserModal, { LIBRARY_TYPES } from '../account/LibraryBrowserModal';
import ItemTooltip from '../item-generation/ItemTooltip';
import SimpleCreatureTooltip from '../creature-wizard/components/common/SimpleCreatureTooltip';
import SpellTooltip from '../spellcrafting-wizard/components/common/SpellTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import useCreatureStore from '../../store/creatureStore';
import useShareableStore from '../../store/shareableStore';
import campaignService from '../../services/campaignService';

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

    // Tooltip state
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredCreature, setHoveredCreature] = useState(null);
    const [hoveredSpell, setHoveredSpell] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Shareables state
    const { shareables, addShareable, updateShareable, removeShareable, showToPlayers } = useShareableStore();
    const [newShareableType, setNewShareableType] = useState('text');
    const [newShareableContent, setNewShareableContent] = useState('');
    const [newShareableTitle, setNewShareableTitle] = useState('');
    const [newShareableBackground, setNewShareableBackground] = useState('parchment');
    const [editingShareable, setEditingShareable] = useState(null);
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

    // Tab definitions
    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'fas fa-home' },
        { id: 'sessions', label: 'Sessions', icon: 'fas fa-calendar-alt' },
        { id: 'npcs', label: 'NPCs', icon: 'fas fa-users' },
        { id: 'locations', label: 'Locations', icon: 'fas fa-map-marker-alt' },
        { id: 'plots', label: 'Plot Threads', icon: 'fas fa-project-diagram' },
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
                updateCampaignData({
                    plotThreads: (campaignData.plotThreads || []).filter(plotThread => plotThread.id !== plotThreadId)
                });
            }
        });
        setIsConfirmModalOpen(true);
    };

    // Homebrew Management Functions
    const [homebrewSubTab, setHomebrewSubTab] = useState('items');

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
                        school: 'evocation',
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
                                <div className="campaign-field" style={{ marginBottom: '16px' }}>
                                    <label style={{ marginBottom: '6px' }}>Campaign</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                                            className="campaign-input"
                                            style={{ minWidth: '150px', flex: '1 1 0%' }}
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
                                            className="campaign-input"
                                            style={{
                                                padding: '10px 12px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                width: 'auto',
                                                minWidth: '80px',
                                                height: '42px',
                                                boxSizing: 'border-box'
                                            }}
                                        >
                                            + New
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (currentCampaignId) {
                                                    // Convert to string for comparison to handle type mismatches
                                                    const idStr = String(currentCampaignId);
                                                    const campaignToDelete = campaigns.find(c => String(c.id) === idStr);
                                                    showConfirmModal(
                                                        'Delete Campaign',
                                                        `Are you sure you want to delete the campaign "${campaignToDelete?.name || 'this campaign'}"? This action cannot be undone.`,
                                                        () => {
                                                            // Delete the campaign
                                                            campaignService.deleteCampaign(currentCampaignId);

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
                                                    );
                                                }
                                            }}
                                            className="campaign-input"
                                            style={{
                                                padding: '10px 12px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                backgroundColor: campaigns.length <= 1 ? '#666' : '#dc3545',
                                                color: 'white',
                                                border: '1px solid #dc3545',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                width: 'auto',
                                                minWidth: '80px',
                                                height: '42px',
                                                boxSizing: 'border-box'
                                            }}
                                            disabled={campaigns.length <= 1}
                                            title={campaigns.length <= 1 ? "Cannot delete the only campaign" : "Delete this campaign"}
                                        >
                                            <i className="fas fa-trash" style={{ fontSize: '12px', lineHeight: '1' }}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="campaign-field" style={{ marginBottom: '16px' }}>
                                    <label style={{ marginBottom: '6px' }}>Campaign Name</label>
                                    <input
                                        type="text"
                                        value={campaignData.name}
                                        onChange={(e) => {
                                            const newName = e.target.value;
                                            updateCampaignData({ name: newName });
                                            // Update campaign name in the service and dropdown
                                            if (currentCampaignId) {
                                                campaignService.updateCampaign(currentCampaignId, {
                                                    name: newName,
                                                    campaignData: { ...campaignData, name: newName }
                                                });
                                                // Update local campaigns state to refresh dropdown
                                                const idStr = String(currentCampaignId);
                                                setCampaigns(prev => prev.map(c =>
                                                    String(c.id) === idStr ? { ...c, name: newName } : c
                                                ));
                                            }
                                        }}
                                        className="campaign-input"
                                        placeholder="Enter campaign name..."
                                        style={{ width: '100%', backgroundColor: 'white' }}
                                    />
                                </div>
                                <div className="campaign-field">
                                    <label>Description</label>
                                    <textarea
                                        value={campaignData.description}
                                        onChange={(e) => updateCampaignData({ description: e.target.value })}
                                        className="campaign-textarea"
                                        placeholder="Describe your campaign setting, themes, and goals..."
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="campaign-stats-grid">
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-calendar-day"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Current Session</div>
                                        <div className="stat-value">{campaignData.currentSession}</div>
                                    </div>
                                </div>
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Active Players</div>
                                        <div className="stat-value">{campaignData.players.length}</div>
                                    </div>
                                </div>
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Locations</div>
                                        <div className="stat-value">{campaignData.locations.length}</div>
                                    </div>
                                </div>
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-scroll"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Plot Threads</div>
                                        <div className="stat-value">{campaignData.plotThreads.length}</div>
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
                                    {campaignData.players.length > 0 ? (
                                        campaignData.players.map(player => (
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
                            {campaignData.sessions.length > 0 ? (
                                campaignData.sessions.map(session => (
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
                            {campaignData.npcs.length > 0 ? (
                                campaignData.npcs.map(npc => (
                                    <div key={npc.id} className="npc-card">
                                        <div className="npc-header">
                                            <input
                                                type="text"
                                                value={npc.name}
                                                onChange={(e) => updateNPC(npc.id, { name: e.target.value })}
                                                className="npc-name-input"
                                            />
                                            <button
                                                className="npc-remove-btn"
                                                onClick={() => removeNPC(npc.id)}
                                                title="Remove NPC"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                        <div className="npc-content">
                                            <div className="npc-field">
                                                <label>Description</label>
                                                <textarea
                                                    value={npc.description}
                                                    onChange={(e) => updateNPC(npc.id, { description: e.target.value })}
                                                    className="npc-textarea"
                                                    placeholder="Physical description, personality..."
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="npc-meta">
                                                <div className="npc-field">
                                                    <label>Location</label>
                                                    <input
                                                        type="text"
                                                        value={npc.location}
                                                        onChange={(e) => updateNPC(npc.id, { location: e.target.value })}
                                                        className="npc-input"
                                                        placeholder="Where they're found..."
                                                    />
                                                </div>
                                                <div className="npc-field">
                                                    <label>Relationship</label>
                                                    <select
                                                        value={npc.relationship}
                                                        onChange={(e) => updateNPC(npc.id, { relationship: e.target.value })}
                                                        className="npc-select"
                                                    >
                                                        <option value="ally">Ally</option>
                                                        <option value="neutral">Neutral</option>
                                                        <option value="enemy">Enemy</option>
                                                        <option value="unknown">Unknown</option>
                                                    </select>
                                                </div>
                                                <div className="npc-field">
                                                    <label>Plot Relevance</label>
                                                    <select
                                                        value={npc.plotRelevance}
                                                        onChange={(e) => updateNPC(npc.id, { plotRelevance: e.target.value })}
                                                        className="npc-select"
                                                    >
                                                        <option value="major">Major</option>
                                                        <option value="moderate">Moderate</option>
                                                        <option value="minor">Minor</option>
                                                        <option value="background">Background</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="npc-field">
                                                <label>Notes</label>
                                                <textarea
                                                    value={npc.notes}
                                                    onChange={(e) => updateNPC(npc.id, { notes: e.target.value })}
                                                    className="npc-textarea"
                                                    placeholder="Plot hooks, secrets, relationships..."
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
                            {campaignData.locations.length > 0 ? (
                                campaignData.locations.map(location => (
                                    <div key={location.id} className="location-card" style={{
                                        backgroundColor: '#f9f6f0',
                                        border: '2px solid #8b7355',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        marginBottom: '15px'
                                    }}>
                                        <div className="location-header" style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '12px'
                                        }}>
                                            <input
                                                type="text"
                                                value={location.name}
                                                onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                                                className="location-name-input"
                                                style={{
                                                    flex: 1,
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    padding: '6px',
                                                    border: '2px solid #8b7355',
                                                    borderRadius: '4px',
                                                    fontFamily: 'inherit',
                                                    marginRight: '10px'
                                                }}
                                            />
                                            <button
                                                className="location-remove-btn"
                                                onClick={() => removeLocation(location.id)}
                                                title="Remove location"
                                                style={{
                                                    backgroundColor: '#8b0000',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '6px 10px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                        <div className="location-content">
                                            <div className="location-field" style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Description</label>
                                                <textarea
                                                    value={location.description}
                                                    onChange={(e) => updateLocation(location.id, { description: e.target.value })}
                                                    className="location-textarea"
                                                    placeholder="Describe the location..."
                                                    rows={2}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                            <div className="location-meta" style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '10px',
                                                marginBottom: '10px'
                                            }}>
                                                <div className="location-field">
                                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Type</label>
                                                    <select
                                                        value={location.type}
                                                        onChange={(e) => updateLocation(location.id, { type: e.target.value })}
                                                        className="location-select"
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '2px solid #8b7355',
                                                            borderRadius: '4px',
                                                            fontFamily: 'inherit'
                                                        }}
                                                    >
                                                        <option value="city">City</option>
                                                        <option value="town">Town</option>
                                                        <option value="village">Village</option>
                                                        <option value="dungeon">Dungeon</option>
                                                        <option value="landmark">Landmark</option>
                                                        <option value="wilderness">Wilderness</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="location-field">
                                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Region</label>
                                                    <input
                                                        type="text"
                                                        value={location.region}
                                                        onChange={(e) => updateLocation(location.id, { region: e.target.value })}
                                                        className="location-input"
                                                        placeholder="Region..."
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '2px solid #8b7355',
                                                            borderRadius: '4px',
                                                            fontFamily: 'inherit',
                                                            boxSizing: 'border-box'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="location-field" style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Notable Features</label>
                                                <textarea
                                                    value={location.notableFeatures}
                                                    onChange={(e) => updateLocation(location.id, { notableFeatures: e.target.value })}
                                                    className="location-textarea"
                                                    placeholder="Key features, landmarks, points of interest..."
                                                    rows={2}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                            <div className="location-field">
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Notes</label>
                                                <textarea
                                                    value={location.notes}
                                                    onChange={(e) => updateLocation(location.id, { notes: e.target.value })}
                                                    className="location-textarea"
                                                    placeholder="Plot hooks, secrets, connections to other locations..."
                                                    rows={2}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
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
                            {campaignData.plotThreads.length > 0 ? (
                                campaignData.plotThreads.map(plotThread => (
                                    <div key={plotThread.id} className="plot-card" style={{
                                        backgroundColor: '#f9f6f0',
                                        border: '2px solid #8b7355',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        marginBottom: '15px'
                                    }}>
                                        <div className="plot-header" style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '12px'
                                        }}>
                                            <input
                                                type="text"
                                                value={plotThread.title}
                                                onChange={(e) => updatePlotThread(plotThread.id, { title: e.target.value })}
                                                className="plot-title-input"
                                                style={{
                                                    flex: 1,
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    padding: '6px',
                                                    border: '2px solid #8b7355',
                                                    borderRadius: '4px',
                                                    fontFamily: 'inherit',
                                                    marginRight: '10px'
                                                }}
                                            />
                                            <button
                                                className="plot-remove-btn"
                                                onClick={() => removePlotThread(plotThread.id)}
                                                title="Remove plot thread"
                                                style={{
                                                    backgroundColor: '#8b0000',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '6px 10px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                        <div className="plot-content">
                                            <div className="plot-field" style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Description</label>
                                                <textarea
                                                    value={plotThread.description}
                                                    onChange={(e) => updatePlotThread(plotThread.id, { description: e.target.value })}
                                                    className="plot-textarea"
                                                    placeholder="Describe the plot thread..."
                                                    rows={3}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                            <div className="plot-meta" style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '10px',
                                                marginBottom: '10px'
                                            }}>
                                                <div className="plot-field">
                                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Status</label>
                                                    <select
                                                        value={plotThread.status}
                                                        onChange={(e) => updatePlotThread(plotThread.id, { status: e.target.value })}
                                                        className="plot-select"
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '2px solid #8b7355',
                                                            borderRadius: '4px',
                                                            fontFamily: 'inherit'
                                                        }}
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="on-hold">On Hold</option>
                                                        <option value="resolved">Resolved</option>
                                                        <option value="abandoned">Abandoned</option>
                                                    </select>
                                                </div>
                                                <div className="plot-field">
                                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Priority</label>
                                                    <select
                                                        value={plotThread.priority}
                                                        onChange={(e) => updatePlotThread(plotThread.id, { priority: e.target.value })}
                                                        className="plot-select"
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '2px solid #8b7355',
                                                            borderRadius: '4px',
                                                            fontFamily: 'inherit'
                                                        }}
                                                    >
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                        <option value="critical">Critical</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="plot-field" style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Related NPCs</label>
                                                <input
                                                    type="text"
                                                    value={Array.isArray(plotThread.relatedNPCs) ? plotThread.relatedNPCs.join(', ') : (plotThread.relatedNPCs || '')}
                                                    onChange={(e) => updatePlotThread(plotThread.id, {
                                                        relatedNPCs: e.target.value ? e.target.value.split(',').map(n => n.trim()).filter(n => n) : []
                                                    })}
                                                    className="plot-input"
                                                    placeholder="NPC names (comma-separated)..."
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                            <div className="plot-field" style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Related Locations</label>
                                                <input
                                                    type="text"
                                                    value={Array.isArray(plotThread.relatedLocations) ? plotThread.relatedLocations.join(', ') : (plotThread.relatedLocations || '')}
                                                    onChange={(e) => updatePlotThread(plotThread.id, {
                                                        relatedLocations: e.target.value ? e.target.value.split(',').map(l => l.trim()).filter(l => l) : []
                                                    })}
                                                    className="plot-input"
                                                    placeholder="Location names (comma-separated)..."
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                            <div className="plot-field">
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Notes</label>
                                                <textarea
                                                    value={plotThread.notes}
                                                    onChange={(e) => updatePlotThread(plotThread.id, { notes: e.target.value })}
                                                    className="plot-textarea"
                                                    placeholder="Progress, key events, connections to other plot threads..."
                                                    rows={3}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
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
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (event) => {
                                                                setNewShareableContent(event.target.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
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
                                            <div className="library-section">
                                                <h4 className="library-section-title">
                                                    <i className="fas fa-book"></i> From Library
                                                </h4>
                                                <div className="homebrew-grid">
                                                    {(campaignData.selectedItems || []).map(item => (
                                                        <div
                                                            key={item.id}
                                                            className="homebrew-card library-card"
                                                            onMouseEnter={(e) => handleMouseEnter(e, item, null, null)}
                                                            onMouseMove={handleMouseMove}
                                                            onMouseLeave={handleMouseLeave}
                                                        >
                                                            <div className="homebrew-card-header">
                                                                <span className="library-badge"><i className="fas fa-link"></i></span>
                                                                <span className="homebrew-name-display">{item.name}</span>
                                                                <span className={`rarity-badge rarity-${item.quality}`}>{item.quality}</span>
                                                                <button className="homebrew-remove-btn" onClick={() => removeLibraryItem(item.id)}>
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </div>
                                                            <div className="homebrew-card-body">
                                                                <div className="library-item-tags">
                                                                    <span className="library-tag">{formatTag(item.type)}</span>
                                                                    {item.subtype && <span className="library-tag">{formatTag(item.subtype)}</span>}
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
                                                                    className="homebrew-textarea"
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
                                            <h4 className="library-section-title">
                                                <i className="fas fa-hammer"></i> Custom Homebrew
                                            </h4>
                                        )}
                                        <div className="homebrew-grid">
                                            {(campaignData.homebrew?.items || []).length > 0 ? (
                                                (campaignData.homebrew?.items || []).map(item => (
                                                    <div key={item.id} className="homebrew-card">
                                                        <div className="homebrew-card-header">
                                                            <input
                                                                type="text"
                                                                value={item.name}
                                                                onChange={(e) => updateHomebrewItem(item.id, { name: e.target.value })}
                                                                className="homebrew-name-input"
                                                            />
                                                            <span className={`rarity-badge rarity-${item.rarity}`}>{item.rarity}</span>
                                                            <button className="homebrew-remove-btn" onClick={() => removeHomebrewItem(item.id)}>
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                        <div className="homebrew-card-body">
                                                            <div className="homebrew-field-row">
                                                                <select
                                                                    value={item.type}
                                                                    onChange={(e) => updateHomebrewItem(item.id, { type: e.target.value })}
                                                                    className="homebrew-select"
                                                                >
                                                                    <option value="weapon">Weapon</option>
                                                                    <option value="armor">Armor</option>
                                                                    <option value="consumable">Consumable</option>
                                                                    <option value="accessory">Accessory</option>
                                                                    <option value="tool">Tool</option>
                                                                    <option value="wondrous">Wondrous Item</option>
                                                                </select>
                                                                <select
                                                                    value={item.rarity}
                                                                    onChange={(e) => updateHomebrewItem(item.id, { rarity: e.target.value })}
                                                                    className="homebrew-select"
                                                                >
                                                                    <option value="common">Common</option>
                                                                    <option value="uncommon">Uncommon</option>
                                                                    <option value="rare">Rare</option>
                                                                    <option value="epic">Epic</option>
                                                                    <option value="legendary">Legendary</option>
                                                                </select>
                                                            </div>
                                                            <textarea
                                                                value={item.description}
                                                                onChange={(e) => updateHomebrewItem(item.id, { description: e.target.value })}
                                                                placeholder="Item description and effects..."
                                                                className="homebrew-textarea"
                                                                rows={3}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="homebrew-placeholder">
                                                    <i className="fas fa-treasure-chest"></i>
                                                    <p>No custom items yet. Create homebrew items for your campaign!</p>
                                                </div>
                                            )}
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
                                            <div className="library-section">
                                                <h4 className="library-section-title">
                                                    <i className="fas fa-book"></i> From Library
                                                </h4>
                                                <div className="homebrew-grid">
                                                    {(campaignData.selectedCreatures || []).map(creature => (
                                                        <div
                                                            key={creature.id}
                                                            className="homebrew-card monster-card library-card"
                                                            onMouseEnter={(e) => handleMouseEnter(e, null, creature, null)}
                                                            onMouseMove={handleMouseMove}
                                                            onMouseLeave={handleMouseLeave}
                                                        >
                                                            <div className="homebrew-card-header">
                                                                <span className="library-badge"><i className="fas fa-link"></i></span>
                                                                <span className="homebrew-name-display">{creature.name}</span>
                                                                <button className="homebrew-remove-btn" onClick={() => removeLibraryCreature(creature.id)}>
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </div>
                                                            <div className="homebrew-card-body">
                                                                <div className="library-item-tags">
                                                                    <span className="library-tag">{formatTag(creature.type)}</span>
                                                                    <span className="library-tag">{formatTag(creature.size)}</span>
                                                                    {creature.hp > 0 && <span className="library-tag">HP {creature.hp}</span>}
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
                                                                    className="homebrew-textarea"
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Custom Homebrew Monsters */}
                                        {(campaignData.homebrew?.monsters || []).length > 0 && (
                                            <h4 className="library-section-title">
                                                <i className="fas fa-hammer"></i> Custom Homebrew
                                            </h4>
                                        )}
                                        <div className="homebrew-grid">
                                            {(campaignData.homebrew?.monsters || []).length > 0 ? (
                                                (campaignData.homebrew?.monsters || []).map(monster => (
                                                    <div key={monster.id} className="homebrew-card monster-card">
                                                        <div className="homebrew-card-header">
                                                            <input
                                                                type="text"
                                                                value={monster.name}
                                                                onChange={(e) => updateHomebrewMonster(monster.id, { name: e.target.value })}
                                                                className="homebrew-name-input"
                                                            />
                                                            <button className="homebrew-remove-btn" onClick={() => removeHomebrewMonster(monster.id)}>
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                        <div className="homebrew-card-body">
                                                            <div className="homebrew-field-row">
                                                                <select
                                                                    value={monster.size}
                                                                    onChange={(e) => updateHomebrewMonster(monster.id, { size: e.target.value })}
                                                                    className="homebrew-select"
                                                                >
                                                                    <option value="tiny">Tiny</option>
                                                                    <option value="small">Small</option>
                                                                    <option value="medium">Medium</option>
                                                                    <option value="large">Large</option>
                                                                    <option value="huge">Huge</option>
                                                                    <option value="gargantuan">Gargantuan</option>
                                                                </select>
                                                                <select
                                                                    value={monster.type}
                                                                    onChange={(e) => updateHomebrewMonster(monster.id, { type: e.target.value })}
                                                                    className="homebrew-select"
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
                                                            </div>
                                                            <div className="homebrew-field-row">
                                                                <input
                                                                    type="text"
                                                                    value={monster.hp || ''}
                                                                    onChange={(e) => updateHomebrewMonster(monster.id, { hp: e.target.value })}
                                                                    placeholder="HP (e.g., 45 or 6d10+12)"
                                                                    className="homebrew-input"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={monster.ac || ''}
                                                                    onChange={(e) => updateHomebrewMonster(monster.id, { ac: e.target.value })}
                                                                    placeholder="AC"
                                                                    className="homebrew-input-small"
                                                                />
                                                            </div>
                                                            <textarea
                                                                value={monster.description}
                                                                onChange={(e) => updateHomebrewMonster(monster.id, { description: e.target.value })}
                                                                placeholder="Description, abilities, tactics..."
                                                                className="homebrew-textarea"
                                                                rows={3}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="homebrew-placeholder">
                                                    <i className="fas fa-skull"></i>
                                                    <p>No custom monsters yet. Create fearsome foes for your party!</p>
                                                </div>
                                            )}
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
                                            <div className="library-section">
                                                <h4 className="library-section-title">
                                                    <i className="fas fa-book"></i> From Library
                                                </h4>
                                                <div className="homebrew-grid">
                                                    {(campaignData.selectedSpells || []).map(spell => (
                                                        <div
                                                            key={spell.id}
                                                            className="homebrew-card spell-card library-card"
                                                            onMouseEnter={(e) => handleMouseEnter(e, null, null, spell)}
                                                            onMouseMove={handleMouseMove}
                                                            onMouseLeave={handleMouseLeave}
                                                        >
                                                            <div className="homebrew-card-header">
                                                                <span className="library-badge"><i className="fas fa-link"></i></span>
                                                                <span className="homebrew-name-display">{spell.name}</span>
                                                                <span className="spell-level-badge">
                                                                    {spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`}
                                                                </span>
                                                                <button className="homebrew-remove-btn" onClick={() => removeLibrarySpell(spell.id)}>
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </div>
                                                            <div className="homebrew-card-body">
                                                                <div className="library-item-tags">
                                                                    <span className="library-tag">{formatTag(spell.school || 'Spell')}</span>
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
                                                                    className="homebrew-textarea"
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
                                            <h4 className="library-section-title">
                                                <i className="fas fa-hammer"></i> Custom Homebrew
                                            </h4>
                                        )}
                                        <div className="homebrew-grid">
                                            {(campaignData.homebrew?.spells || []).length > 0 ? (
                                                (campaignData.homebrew?.spells || []).map(spell => (
                                                    <div key={spell.id} className="homebrew-card spell-card">
                                                        <div className="homebrew-card-header">
                                                            <input
                                                                type="text"
                                                                value={spell.name}
                                                                onChange={(e) => updateHomebrewSpell(spell.id, { name: e.target.value })}
                                                                className="homebrew-name-input"
                                                            />
                                                            <span className="spell-level-badge">Lvl {spell.level}</span>
                                                            <button className="homebrew-remove-btn" onClick={() => removeHomebrewSpell(spell.id)}>
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                        <div className="homebrew-card-body">
                                                            <div className="homebrew-field-row">
                                                                <select
                                                                    value={spell.level}
                                                                    onChange={(e) => updateHomebrewSpell(spell.id, { level: parseInt(e.target.value) })}
                                                                    className="homebrew-select"
                                                                >
                                                                    <option value="0">Cantrip</option>
                                                                    <option value="1">1st Level</option>
                                                                    <option value="2">2nd Level</option>
                                                                    <option value="3">3rd Level</option>
                                                                    <option value="4">4th Level</option>
                                                                    <option value="5">5th Level</option>
                                                                    <option value="6">6th Level</option>
                                                                    <option value="7">7th Level</option>
                                                                    <option value="8">8th Level</option>
                                                                    <option value="9">9th Level</option>
                                                                </select>
                                                                <select
                                                                    value={spell.school}
                                                                    onChange={(e) => updateHomebrewSpell(spell.id, { school: e.target.value })}
                                                                    className="homebrew-select"
                                                                >
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
                                                            <div className="homebrew-field-row">
                                                                <input
                                                                    type="text"
                                                                    value={spell.castingTime}
                                                                    onChange={(e) => updateHomebrewSpell(spell.id, { castingTime: e.target.value })}
                                                                    placeholder="Casting Time"
                                                                    className="homebrew-input"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={spell.range}
                                                                    onChange={(e) => updateHomebrewSpell(spell.id, { range: e.target.value })}
                                                                    placeholder="Range"
                                                                    className="homebrew-input"
                                                                />
                                                            </div>
                                                            <textarea
                                                                value={spell.description}
                                                                onChange={(e) => updateHomebrewSpell(spell.id, { description: e.target.value })}
                                                                placeholder="Spell effect description..."
                                                                className="homebrew-textarea"
                                                                rows={3}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="homebrew-placeholder">
                                                    <i className="fas fa-magic"></i>
                                                    <p>No custom spells yet. Craft unique magical abilities!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {homebrewSubTab === 'lore' && (
                                    <div className="homebrew-section">
                                        <div className="campaign-section-header">
                                            <h3>World Lore & History</h3>
                                            <button className="campaign-add-btn" onClick={addLoreArticle}>
                                                <i className="fas fa-plus"></i>
                                                New Article
                                            </button>
                                        </div>
                                        <div className="lore-articles-list">
                                            {(campaignData.homebrew?.lore || []).length > 0 ? (
                                                (campaignData.homebrew?.lore || []).map(article => (
                                                    <div key={article.id} className="lore-article-card">
                                                        <div className="lore-article-header">
                                                            <input
                                                                type="text"
                                                                value={article.title}
                                                                onChange={(e) => updateLoreArticle(article.id, { title: e.target.value })}
                                                                className="lore-title-input"
                                                            />
                                                            <div className="lore-meta">
                                                                <select
                                                                    value={article.category}
                                                                    onChange={(e) => updateLoreArticle(article.id, { category: e.target.value })}
                                                                    className="lore-category-select"
                                                                >
                                                                    <option value="history">History</option>
                                                                    <option value="religion">Religion</option>
                                                                    <option value="faction">Faction</option>
                                                                    <option value="legend">Legend/Myth</option>
                                                                    <option value="culture">Culture</option>
                                                                    <option value="geography">Geography</option>
                                                                    <option value="magic">Magic System</option>
                                                                    <option value="other">Other</option>
                                                                </select>
                                                                <label className="secret-toggle">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={article.isSecret || false}
                                                                        onChange={(e) => updateLoreArticle(article.id, { isSecret: e.target.checked })}
                                                                    />
                                                                    <i className="fas fa-eye-slash"></i>
                                                                    Secret
                                                                </label>
                                                            </div>
                                                            <button className="lore-remove-btn" onClick={() => removeLoreArticle(article.id)}>
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                        <div className="lore-article-body">
                                                            <textarea
                                                                value={article.content}
                                                                onChange={(e) => updateLoreArticle(article.id, { content: e.target.value })}
                                                                placeholder="Write your lore article here... You can include details about history, legends, important events, cultural practices, etc."
                                                                className="lore-content-textarea"
                                                                rows={6}
                                                            />
                                                            <div className="lore-field">
                                                                <label>Tags (comma-separated)</label>
                                                                <input
                                                                    type="text"
                                                                    value={Array.isArray(article.tags) ? article.tags.join(', ') : ''}
                                                                    onChange={(e) => updateLoreArticle(article.id, {
                                                                        tags: e.target.value ? e.target.value.split(',').map(t => t.trim()).filter(t => t) : []
                                                                    })}
                                                                    placeholder="e.g., kingdom, war, ancient, forbidden..."
                                                                    className="lore-tags-input"
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


    return (
        <>
            <WowWindow
                isOpen={isOpen}
                onClose={onClose}
                title="Campaign Manager"
                defaultSize={{ width: 1000, height: 700 }}
                defaultPosition={{ x: 100, y: 100 }}
                customHeader={
                    <div className="spellbook-tab-container">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`spellbook-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                }
            >
                <div className="campaign-manager-content">
                    {renderTabContent()}
                </div>
            </WowWindow>

            {/* Input Modal */}
            {showInputModal && (
                <div
                    className="modal-overlay"
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
                        zIndex: 100000
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
                    className="modal-overlay"
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
                        zIndex: 100000
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
        </>
    );
}

export default CampaignManagerWindow;
