import React, { useState, useEffect, useLayoutEffect, useCallback, lazy, Suspense, Fragment, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import useGameStore from '../store/gameStore';
import useLevelEditorStore from '../store/levelEditorStore';
import usePartyStore from '../store/partyStore';
import useWindowManagerStore from '../store/windowManagerStore';
import usePresenceStore from '../store/presenceStore';
import MythrillWindow from './windows/MythrillWindow';
import { getWowIconUrl } from '../utils/assetManager';
import useCombatStore from '../store/combatStore';
import useInventoryStore from '../store/inventoryStore';
import { SKILL_CATEGORIES, SKILL_DEFINITIONS } from '../constants/skillDefinitions';
import ErrorBoundary from './common/ErrorBoundary';
import '../styles/resizable-nav.css';
import { useWindowIntros } from '../hooks/useWindowIntros';
import { useNavAssets } from '../hooks/useNavAssets';

const SettingsWindow = lazy(() => import('./windows/SettingsWindow'));
const ExitGameConfirmDialog = lazy(() => import('./dialogs/ExitGameConfirmDialog'));

const CharacterPanel = lazy(() => import('./character-sheet/CharacterPanel'));
const CharacterStats = lazy(() => import('./character-sheet/CharacterStats'));
const Skills = lazy(() => import('./character-sheet/Skills'));
const Lore = lazy(() => import('./character-sheet/Lore'));
const InventoryWindow = lazy(() => import('./windows/InventoryWindow'));
const LibraryWindow = lazy(() => import('./windows/LibraryWindow'));
const Toolkit = lazy(() => import('./windows/Toolkit'));
const SpellbookWindow = lazy(() => import('./windows/SpellbookWindow'));
const CampaignManagerWindow = lazy(() => import('./windows/CampaignManagerWindow'));
const PlayerJournalWindow = lazy(() => import('./windows/PlayerJournalWindow'));
const PlayerDisplayOverlay = lazy(() => import('./dialogs/PlayerDisplayOverlay'));
const TalentTreeWindow = lazy(() =>
    import('./windows/TalentTreeWindow').catch(err => {
        console.error('Failed to load TalentTreeWindow:', err);
        return { default: () => <div>Error loading Talent Tree</div> };
    })
);
const QuestLogWindow = lazy(() =>
    import('./windows/QuestLogWindow').catch(err => {
        console.error('Failed to load QuestLogWindow:', err);
        return { default: () => <div>Error loading Quest Log</div> };
    })
);
const GlobalChatWindowWrapper = lazy(() =>
    import('./social/GlobalChatWindowWrapper').catch(err => {
        console.error('Failed to load GlobalChatWindowWrapper:', err);
        return {
            default: () => (
                <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
                    <h3>🚫 Community Window Unavailable</h3>
                    <p>The community features are temporarily unavailable.</p>
                    <p>Please try refreshing the page.</p>
                </div>
            )
        };
    })
);
const CraftingWindow = lazy(() =>
    import('./windows/CraftingWindow').catch(err => {
        console.error('Failed to load CraftingWindow:', err);
        return {
            default: () => (
                <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
                    <h3>🔨 Crafting Window Unavailable</h3>
                    <p>The crafting system is temporarily unavailable.</p>
                    <p>Please try refreshing the page.</p>
                </div>
            )
        };
    })
);

const PlayerTravelDashboard = lazy(() =>
    import('./windows/PlayerTravelDashboard').catch(err => {
        console.error('Failed to load PlayerTravelDashboard:', err);
        return {
            default: () => (
                <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
                    <h3>Travel Dashboard Unavailable</h3>
                    <p>The travel system is temporarily unavailable.</p>
                    <p>Please try refreshing the page.</p>
                </div>
            )
        };
    })
);

// Quest Log Window Wrapper - simplified to prevent double window loading
function QuestLogWindowWrapper({ isOpen, onClose }) {
    // Use the QuestLogWindow directly without nesting it in another MythrillWindow
    // This prevents the double window loading issue
    return (
        <QuestLogWindow
            isOpen={isOpen}
            onClose={onClose}
        // Remove contentOnly to let QuestLogWindow handle its own window
        />
    );
}

// Settings Window Wrapper with spellbook-style tabs
function SettingsWindowWrapper({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('interface');
    const isGMMode = useGameStore(state => state.isGMMode);
    const { getWindowPosition, getWindowSize, setWindowPosition, setWindowSize } = useWindowManagerStore();

    const SETTINGS_ID = 'settings';
    const savedPos = getWindowPosition(SETTINGS_ID, { x: 100, y: 100 });
    const savedSize = getWindowSize(SETTINGS_ID, { width: 800, height: 600 });

    const handleDrag = useCallback((pos) => {
        setWindowPosition(SETTINGS_ID, { x: pos.x, y: pos.y });
    }, [setWindowPosition]);

    const handleResize = useCallback((size) => {
        setWindowSize(SETTINGS_ID, size);
    }, [setWindowSize]);

    // Tab definitions - filter based on GM/Player mode
    const getAllTabs = () => [
        {
            id: 'interface',
            label: 'Interface',
            icon: getWowIconUrl('inv_gizmo_02')
        },
        {
            id: 'gameplay',
            label: 'Gameplay',
            icon: getWowIconUrl('inv_misc_gear_01')
        }
    ];

    const getVisibleTabs = () => {
        const allTabs = getAllTabs();
        if (isGMMode) {
            // GM sees all tabs
            return allTabs;
        } else {
            // Player mode - only show Interface tab
            return allTabs.filter(tab => tab.id === 'interface');
        }
    };

    const tabs = getVisibleTabs();

    // Reset to interface tab when switching to player mode
    useEffect(() => {
        if (!isGMMode && activeTab !== 'interface') {
            setActiveTab('interface');
        }
    }, [isGMMode, activeTab]);

    return (
        <MythrillWindow
            isOpen={isOpen}
            onClose={onClose}
            title="Settings"
            defaultSize={savedSize}
            defaultPosition={savedPos}
            onDrag={handleDrag}
            onResize={handleResize}
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
            <Suspense fallback={
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#8b6f47', fontFamily: 'Bookman Old Style, serif' }}>
                    Loading Settings...
                </div>
            }>
                <SettingsWindow activeTab={activeTab} />
            </Suspense>
        </MythrillWindow>
    );
}




// Define buttons array outside component to avoid any temporal dead zone issues
const NAVIGATION_BUTTONS = [
    {
        id: 'character',
        title: 'Character Sheet',
        shortcut: 'C',
        svg: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    },
    {
        id: 'inventory',
        title: 'Inventory',
        shortcut: 'B',
        svg: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    },
    {
        id: 'crafting',
        title: 'Crafting',
        shortcut: 'R',
        svg: <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 22 12 18.77 5.82 22 7 13.87 2 9l6.91-.74L12 2z" />
    },
    {
        id: 'spellbook',
        title: 'Spellbook',
        shortcut: 'S',
        svg: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    },
    {
        id: 'talents',
        title: 'Talent Tree',
        shortcut: 'T',
        svg: <>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            <circle cx="12" cy="7" r="1.5" />
            <circle cx="7" cy="12" r="1.5" />
            <circle cx="17" cy="12" r="1.5" />
            <circle cx="12" cy="17" r="1.5" />
        </>
    },
    {
        id: 'library',
        title: 'Library',
        shortcut: 'L',
        svg: <>
            <path d="M4 6h16M4 12h16M4 18h16" />
            <path d="M8 6v12M16 6v12" />
            <circle cx="12" cy="6" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="18" r="1" />
        </>,
    },
    {
        id: 'quests',
        title: 'Quest Log',
        shortcut: 'Q',
        svg: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    },
    {
        id: 'campaign',
        title: 'Campaign Manager',
        shortcut: 'P',
        svg: <>
            <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 22 12 18.77 5.82 22 7 13.87 2 9l6.91-.74L12 2z" />
            <path d="M8 14l2 2 4-4" />
            <circle cx="12" cy="8" r="2" />
        </>,
        premium: true
    },
    {
        id: 'community',
        title: 'Community',
        shortcut: 'H',
        svg: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    },

    {
        id: 'combat',
        title: 'Combat Initiator',
        shortcut: 'X',
        svg: <>
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
            <path d="M9 12l2 2 4-4" />
        </>,
    },

    {
        id: 'settings',
        title: 'Settings',
        shortcut: 'G',
        window: SettingsWindow,
        svg: <>
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        </>
    },



    {
        id: 'travel',
        title: 'Travel',
        shortcut: 'W',
        playerOnly: true,
        svg: <>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            <path d="M12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
        </>
    },

    {
        id: 'leveleditor',
        title: 'Level Editor',
        shortcut: 'E',
        svg: <>
            <path d="M3 21h18M3 10h18M3 7l9-4 9 4M6 10v11M10 10v11M14 10v11M18 10v11" />
            <path d="M12 3v4M8 7h8" />
        </>
    },
    {
        id: 'journal',
        title: 'Player Journal',
        shortcut: 'J',
        playerOnly: true,
        svg: <>
            <path d="M4 4a2 2 0 012-2h8.586A2 2 0 0116 2.586L19.414 6A2 2 0 0120 7.414V20a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            <path d="M14 2v4a2 2 0 002 2h4M8 12h8M8 16h8M8 8h2" />
        </>
    },
    {
        id: 'toolkit',
        title: 'Toolkit',
        shortcut: 'K',
        gmOnly: true,
        svg: <>
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <polygon points="12,2 13.5,10 12,8 10.5,10" fill="currentColor" opacity="0.6"/>
            <polygon points="12,22 10.5,14 12,16 13.5,14" fill="currentColor" opacity="0.6"/>
            <polygon points="2,12 10,10.5 8,12 10,13.5" fill="currentColor" opacity="0.4"/>
            <polygon points="22,12 14,13.5 16,12 14,10.5" fill="currentColor" opacity="0.4"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </>
    },
];

const BUTTON_CATEGORY = {
    character: 'character', inventory: 'character', spellbook: 'character', talents: 'character', journal: 'character',
    quests: 'adventure', combat: 'adventure', travel: 'adventure', campaign: 'adventure',
    crafting: 'tools', library: 'tools', leveleditor: 'tools', toolkit: 'tools', community: 'tools',
    settings: 'system',
};

const NAV_CATEGORIES = [
    { id: 'character', label: 'Character', svg: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    { id: 'adventure', label: 'Adventure', svg: <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 22 12 18.77 5.82 22 7 13.87 2 9l6.91-.74L12 2z" /> },
    { id: 'tools', label: 'Tools', svg: <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2-2 2.5-2.5z" /> },
];

function CharacterSheetWindow({ isOpen, onClose, title }) {
    const [activeTab, setActiveTab] = useState('lore');
    const [activeLoreSection, setActiveLoreSection] = useState('identity');
    const [activeInfoSection, setActiveInfoSection] = useState('equipment');
    const [activeStatGroup, setActiveStatGroup] = useState('summary');
    const [activeSkillCategory, setActiveSkillCategory] = useState('combat');
    const [selectedSkillId, setSelectedSkillId] = useState(null);
    const [hoveredSkillCategory, setHoveredSkillCategory] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dropdownPos, setDropdownPos] = useState(null);
    const closeTimerRef = useRef(null);
    const { getWindowPosition, getWindowSize, setWindowPosition, setWindowSize } = useWindowManagerStore();

    const WINDOW_ID = 'character-sheet';
    const savedPos = getWindowPosition(WINDOW_ID, { x: 100, y: 100 });
    const savedSize = getWindowSize(WINDOW_ID, { width: 850, height: 640 });

    const handleDrag = useCallback((pos) => {
        setWindowPosition(WINDOW_ID, { x: pos.x, y: pos.y });
    }, [setWindowPosition]);

    const handleResize = useCallback((size) => {
        setWindowSize(WINDOW_ID, size);
    }, [setWindowSize]);

    // The tab dropdown menus are portaled to <body> so they are not clipped by
    // the header's scroll container (.window-header .spellbook-tab-container uses
    // overflow-x:auto to let tabs scroll, which would otherwise hide the menus).
    const openTabDropdown = useCallback((key, el) => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        setOpenDropdown(key);
        if (el) {
            const r = el.getBoundingClientRect();
            setDropdownPos({ left: r.left, top: r.bottom, width: r.width });
        }
    }, []);

    const scheduleCloseTabDropdown = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }
        closeTimerRef.current = setTimeout(() => {
            setOpenDropdown(null);
        }, 150);
    }, []);

    const cancelCloseTabDropdown = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    // Cleanup the close timer on unmount
    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
        };
    }, []);

    // Ensure title is always defined with fallback
    const safeTitle = title || 'Character Sheet';

    // Define character sheet sections with dropdown sub-sections matching the exact component tabs
    const characterSections = {
        lore: {
            title: 'Lore',
            icon: 'fas fa-book-open',
            subSections: [
                { id: 'identity', label: 'Identity & Origin', icon: 'fas fa-user' },
                { id: 'personality', label: 'Demeanor & Conviction', icon: 'fas fa-smile' },
                { id: 'appearance', label: 'Bearing & Aspect', icon: 'fas fa-user-circle' },
                { id: 'relationships', label: 'Bonds & Adversaries', icon: 'fas fa-users' },
                { id: 'goals', label: 'Purpose & Dread', icon: 'fas fa-bullseye' },
                { id: 'heritage', label: 'Ancestry & Heritage', icon: 'fas fa-dna' },
                { id: 'notes', label: 'Marginalia & Notes', icon: 'fas fa-sticky-note' }
            ]
        },
        character: {
            title: 'Info',
            icon: 'fas fa-info-circle',
            subSections: [
                { id: 'equipment', label: 'Equipment & Vitals', icon: 'fas fa-shield-alt' },
                { id: 'passives', label: 'Passives', icon: 'fas fa-star' },
                { id: 'languages', label: 'Languages', icon: 'fas fa-globe' }
            ]
        },
        stats: {
            title: 'Stats',
            icon: 'fas fa-chart-bar',
            subSections: [
                { id: 'summary', label: 'Character Summary', icon: 'fas fa-id-card' },
                { id: 'base', label: 'Core Attributes', icon: 'fas fa-dumbbell' },
                { id: 'combat', label: 'Combat Statistics', icon: 'fas fa-fist-raised' },
                { id: 'spellpower', label: 'Spell Power', icon: 'fas fa-hat-wizard' },
                { id: 'regeneration', label: 'Regeneration & Healing', icon: 'fas fa-heartbeat' },
                { id: 'resistances', label: 'Damage Resistances', icon: 'fas fa-shield-alt' },
                { id: 'movement', label: 'Movement & Mobility', icon: 'fas fa-running' },
                { id: 'utility', label: 'Utility & Senses', icon: 'fas fa-eye' },
                { id: 'savingThrows', label: 'Saving Throws', icon: 'fas fa-roll' }
            ]
        },
        skills: {
            title: 'Skills',
            icon: 'fas fa-graduation-cap',
            subSections: [
                { id: 'combat', label: 'Combat Mastery', icon: 'fas fa-fist-raised' },
                { id: 'exploration', label: 'Exploration & Survival', icon: 'fas fa-compass' },
                { id: 'social', label: 'Social & Influence', icon: 'fas fa-users' },
                { id: 'arcane', label: 'Arcane Studies', icon: 'fas fa-hat-wizard' }
            ],
            skillItems: {
                combat: Object.entries(SKILL_DEFINITIONS)
                    .filter(([_, skill]) => skill.category === SKILL_CATEGORIES.COMBAT.name)
                    .map(([id, skill]) => ({ id, label: skill.name, icon: 'fas fa-fist-raised' })),
                exploration: Object.entries(SKILL_DEFINITIONS)
                    .filter(([_, skill]) => skill.category === SKILL_CATEGORIES.EXPLORATION.name)
                    .map(([id, skill]) => ({ id, label: skill.name, icon: 'fas fa-compass' })),
                social: Object.entries(SKILL_DEFINITIONS)
                    .filter(([_, skill]) => skill.category === SKILL_CATEGORIES.SOCIAL.name)
                    .map(([id, skill]) => ({ id, label: skill.name, icon: 'fas fa-users' })),
                arcane: Object.entries(SKILL_DEFINITIONS)
                    .filter(([_, skill]) => skill.category === SKILL_CATEGORIES.ARCANE.name)
                    .map(([id, skill]) => ({ id, label: skill.name, icon: 'fas fa-hat-wizard' }))
            }
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'character':
                return <CharacterPanel activeSubSection={activeInfoSection} setActiveSubSection={setActiveInfoSection} />;
            case 'stats':
                return <CharacterStats selectedStatGroup={activeStatGroup} setSelectedStatGroup={setActiveStatGroup} />;
            case 'skills':
                return <Skills selectedCategory={activeSkillCategory} selectedSkill={selectedSkillId} setSelectedSkill={setSelectedSkillId} />;
            case 'lore':
                return <Lore initialSection={activeLoreSection} key={activeLoreSection} />;
            default:
                return <Lore initialSection={activeLoreSection} key={activeLoreSection} />;
        }
    };

    return (
        <MythrillWindow
            isOpen={isOpen}
            onClose={onClose}
            title={safeTitle}
            defaultSize={savedSize}
            defaultPosition={savedPos}
            onDrag={handleDrag}
            onResize={handleResize}
            customHeader={
                <div className="spellbook-tab-container">
                    {Object.entries(characterSections).map(([key, section]) => {
                        const isActive = activeTab === key;
                        const isDropdownOpen = openDropdown === key;
                        return (
                            <div 
                                key={key} 
                                className="tab-dropdown-wrapper" 
                                style={{ position: 'relative' }}
                                onMouseLeave={scheduleCloseTabDropdown}
                            >
                                <button
                                    className={`spellbook-tab-button ${isActive ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTab(key);
                                        if (openDropdown === key) {
                                            setOpenDropdown(null);
                                        } else {
                                            openTabDropdown(key, e.currentTarget);
                                        }
                                    }}
                                    onMouseEnter={(e) => openTabDropdown(key, e.currentTarget)}
                                >
                                    <span>{section.title}</span>
                                    {section.subSections && (
                                        <i 
                                            className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} tab-chevron`} 
                                            style={{ marginLeft: '6px', fontSize: '9px', opacity: 0.8 }} 
                                        />
                                    )}
                                </button>

                                {isDropdownOpen && section.subSections && dropdownPos && ReactDOM.createPortal(
                                    <div
                                        className="tab-dropdown-menu"
                                        style={{ position: 'fixed', left: dropdownPos.left, top: dropdownPos.top, minWidth: Math.max(210, dropdownPos.width), marginTop: 4 }}
                                        onMouseEnter={cancelCloseTabDropdown}
                                        onMouseLeave={scheduleCloseTabDropdown}
                                    >
                                        {section.subSections.map(sub => {
                                            const hasNestedSkills = key === 'skills' && section.skillItems?.[sub.id];
                                            const isCategoryHovered = hoveredSkillCategory === sub.id;
                                            return (
                                                <div
                                                    key={sub.id}
                                                    className="tab-dropdown-item-wrapper"
                                                    style={{ position: 'relative' }}
                                                    onMouseEnter={() => hasNestedSkills && setHoveredSkillCategory(sub.id)}
                                                    onMouseLeave={() => hasNestedSkills && setHoveredSkillCategory(null)}
                                                >
                                                    <button
                                                        type="button"
                                                        className={`tab-dropdown-item ${
                                                            (activeTab === key && (
                                                                (key === 'lore' && activeLoreSection === sub.id) ||
                                                                (key === 'character' && activeInfoSection === sub.id) ||
                                                                (key === 'stats' && activeStatGroup === sub.id) ||
                                                                (key === 'skills' && activeSkillCategory === sub.id)
                                                            )) ? 'active' : ''
                                                        }`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveTab(key);
                                                            if (key === 'lore') {
                                                                setActiveLoreSection(sub.id);
                                                            } else if (key === 'character') {
                                                                setActiveInfoSection(sub.id);
                                                            } else if (key === 'stats') {
                                                                setActiveStatGroup(sub.id);
                                                            } else if (key === 'skills') {
                                                                setActiveSkillCategory(sub.id);
                                                            }
                                                            setOpenDropdown(null);
                                                        }}
                                                    >
                                                        <i className={sub.icon} style={{ width: '16px', textAlign: 'center', marginRight: '8px' }}></i>
                                                        <span>{sub.label}</span>
                                                        {hasNestedSkills && (
                                                            <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', fontSize: '9px', opacity: 0.6 }}></i>
                                                        )}
                                                    </button>
                                                    {hasNestedSkills && isCategoryHovered && (
                                                        <div className="tab-dropdown-submenu">
                                                            {section.skillItems[sub.id].map(skill => (
                                                                <button
                                                                    key={skill.id}
                                                                    type="button"
                                                                    className={`tab-dropdown-item tab-dropdown-skill-item ${
                                                                        (activeTab === 'skills' && activeSkillCategory === sub.id && selectedSkillId === skill.id) ? 'active' : ''
                                                                    }`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActiveTab('skills');
                                                                        setActiveSkillCategory(sub.id);
                                                                        setSelectedSkillId(skill.id);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                >
                                                                    <i className={skill.icon} style={{ width: '14px', textAlign: 'center', marginRight: '6px', fontSize: '10px' }}></i>
                                                                    <span>{skill.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>,
                                    document.body
                                )}
                            </div>
                        );
                    })}
                </div>
            }
        >
            <div className="character-sheet">
                <div className="character-sheet-content">
                    {renderContent()}
                </div>
            </div>
        </MythrillWindow>
    );
}

// Inventory Header Button Component
const InventoryHeaderButton = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const { clearInventory } = useInventoryStore();

    const handleClearClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowConfirm(true);
    };

    const confirmClear = (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearInventory();
        setShowConfirm(false);
    };

    return (
        <div className="inventory-header-actions">
            <button
                className="inventory-clear-btn"
                onClick={handleClearClick}
                title="Clear all items from inventory"
            >
                <i className="fas fa-trash"></i>
            </button>

            {showConfirm && ReactDOM.createPortal(
                <div
                    className="wow-modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000000,
                        backdropFilter: 'blur(3px)'
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowConfirm(false);
                    }}
                >
                    <div
                        className="wow-confirm-dialog"
                        style={{
                            background: 'linear-gradient(135deg, #2c1810 0%, #1a1008 100%)',
                            border: '2px solid #8b6f47',
                            borderRadius: '8px',
                            padding: '24px',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
                            color: '#f0e6d2',
                            fontFamily: 'Bookman Old Style, Garamond, serif',
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{
                            color: '#cc2a1d',
                            marginBottom: '16px',
                            fontSize: '20px',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Empty All Bags?
                        </h3>
                        <p style={{
                            marginBottom: '24px',
                            lineHeight: '1.5',
                            fontSize: '15px'
                        }}>
                            Are you sure you want to clear your entire inventory? This action cannot be undone.
                        </p>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '16px'
                        }}>
                            <button
                                className="wow-button secondary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowConfirm(false);
                                }}
                                style={{ minWidth: '100px' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="wow-button primary danger"
                                onClick={confirmClear}
                                style={{
                                    minWidth: '100px',
                                    backgroundColor: '#cc1a1d',
                                    borderColor: '#ff4d4d'
                                }}
                            >
                                Clear Bags
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};


export default function Navigation({ onReturnToLanding }) {
    const [openWindows, setOpenWindows] = useState(new Set());
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(() => {
        try { return localStorage.getItem('mythrill-nav-collapsed') === 'true'; } catch { return false; }
    });
    const [isNavHovered, setIsNavHovered] = useState(false);
    const [orbPosition, setOrbPosition] = useState(() => {
        try {
            const saved = localStorage.getItem('mythrill-nav-orb');
            if (saved) return JSON.parse(saved);
        } catch {}
        return { x: window.innerWidth / 2 - 20, y: 80 };
    });
    const orbRef = useRef(null);
    const orbPositionRef = useRef(orbPosition);
    orbPositionRef.current = orbPosition;
    const orbDragRef = useRef(false);

    // Level editor store
    const { isEditorMode, setEditorMode } = useLevelEditorStore();

    // Window manager store to check for open windows/modals.
    // Subscribe to a derived boolean (not the whole `windows` Map) so we only
    // re-render when a window is actually added/removed, not on every
    // z-index bump (bringToFront) which would cause excessive re-renders.
    const hasRegisteredWindows = useWindowManagerStore(state => state.windows.size > 0);

    // Game store for GM mode and camera position - granular selectors to prevent excessive re-renders
    const isGMMode = useGameStore(state => state.isGMMode);
    const cameraX = useGameStore(state => state.cameraX);
    const cameraY = useGameStore(state => state.cameraY);
    const gridSize = useGameStore(state => state.gridSize);
    const gridOffsetX = useGameStore(state => state.gridOffsetX);
    const gridOffsetY = useGameStore(state => state.gridOffsetY);
    const gridBackgroundColor = useGameStore(state => state.gridBackgroundColor);
    const setCameraPosition = useGameStore(state => state.setCameraPosition);

    // State for coordinate input popup
    const [showCoordinatePopup, setShowCoordinatePopup] = useState(false);
    const [inputX, setInputX] = useState('');
    const [inputY, setInputY] = useState('');

    // Combat store for selection mode - granular selectors to prevent excessive re-renders
    const isSelectionMode = useCombatStore(state => state.isSelectionMode);
    const isInCombat = useCombatStore(state => state.isInCombat);
    const startSelectionMode = useCombatStore(state => state.startSelectionMode);
    const cancelSelectionMode = useCombatStore(state => state.cancelSelectionMode);
    const endCombat = useCombatStore(state => state.endCombat);
    const forceResetCombat = useCombatStore(state => state.forceResetCombat);
    const clearCombatStorage = useCombatStore(state => state.clearCombatStorage);

    // Presence store for community window state and unread notifications
    const isCommunityWindowOpen = usePresenceStore(state => state.isCommunityWindowOpen);
    const setCommunityWindowOpen = usePresenceStore(state => state.setCommunityWindowOpen);
    const whisperTabs = usePresenceStore(state => state.whisperTabs);
    const partyChatUnreadCount = usePresenceStore(state => state.partyChatUnreadCount);

    // Per-window first-open introductions (typewriter) via the dialogue system
    const { triggerIfFirstOpen: triggerWindowIntro } = useWindowIntros();

    // Navigation sprite assets (parchment background, button images)
    const { assets: navAssets } = useNavAssets();

    // Recalculate nav bar size when sprite assets load (changes height)
    useEffect(() => {
        if (navAssets) {
            setSize(getInitialSize());
        }
    }, [navAssets]);

    // Calculate total unread count for community badge
    const totalCommunityUnread = React.useMemo(() => {
        let total = partyChatUnreadCount || 0;
        whisperTabs?.forEach(tab => {
            total += tab.unreadCount || 0;
        });
        return total;
    }, [whisperTabs, partyChatUnreadCount]);

    // Sync community window state with openWindows Set
    useEffect(() => {
        setOpenWindows(prev => {
            const newSet = new Set(prev);
            if (isCommunityWindowOpen) {
                newSet.add('community');
            } else {
                newSet.delete('community');
            }
            return newSet;
        });
    }, [isCommunityWindowOpen]);

    // Player restricted buttons set - memoized to avoid recreation every render
    const playerRestrictedButtonsSet = useMemo(() => new Set([
        'leveleditor',
        'library',
        'campaign',
        'combat',
        'encounters'
    ]), []);

    // Filter buttons based on GM/Player mode
    const getVisibleButtons = () => {
        // Ensure NAVIGATION_BUTTONS is valid
        if (!NAVIGATION_BUTTONS || !Array.isArray(NAVIGATION_BUTTONS)) {
            console.error('🚨 NAVIGATION_BUTTONS is not properly defined');
            return [];
        }

        const validButtons = NAVIGATION_BUTTONS.filter(button =>
            button && button.id && button.shortcut
        );

        if (isGMMode) {
            // GM sees all buttons except player-only buttons
            return validButtons.filter(button => !button.playerOnly);
        } else {
            // Player mode - filter out restricted buttons and GM-only buttons
            return validButtons.filter(button =>
                !playerRestrictedButtonsSet.has(button.id) && !button.gmOnly
            );
        }
    };

    // Calculate initial size based on screen width and number of visible buttons
    const getInitialSize = () => {
        const vis = getVisibleButtons();
        const visibleCats = NAV_CATEGORIES.filter(c => vis.some(b => b && b.id && (BUTTON_CATEGORY[b.id] || 'system') === c.id));
        const standaloneCount = vis.filter(b => b && b.id && (BUTTON_CATEGORY[b.id] || 'system') === 'system').length;
        const utilCount = standaloneCount + 2;
        const isCompact = window.innerWidth <= 1024 && window.innerWidth > 768;

        const buttonWidth = isCompact ? 34 : 44;
        const gap = isCompact ? 2 : 4;
        const padding = isCompact ? 8 : 16;
        const headerBase = isCompact ? 50 : 64;
        const headerCharWidth = isCompact ? 6.5 : 7.6;
        const dividerAllowance = 14;

        const headersWidth = visibleCats.reduce((s, c) => s + headerBase + c.label.length * headerCharWidth, 0);
        const utilWidth = utilCount * buttonWidth;
        const totalElements = visibleCats.length + utilCount;
        const gapsWidth = Math.max(0, totalElements - 1) * gap;

        const calculatedWidth = headersWidth + utilWidth + gapsWidth + padding + dividerAllowance;

        return {
            width: Math.min(calculatedWidth, window.innerWidth - 40),
            height: isCompact ? 60 : 72
        };
    };

    const [size, setSize] = useState(getInitialSize());
    const [position, setPosition] = useState(() => {
        const initialSize = getInitialSize();
        return {
            x: (window.innerWidth - initialSize.width) / 2, // Center horizontally
            y: 20 // Position at top with 20px margin
        };
    });
    const nodeRef = useRef(null);

    const handleToggleCollapse = useCallback(() => {
        setIsNavCollapsed(prev => {
            const next = !prev;
            try { localStorage.setItem('mythrill-nav-collapsed', String(next)); } catch {}
            if (next) {
                setPosition(cur => {
                    const orbPos = { x: cur.x + size.width / 2 - 20, y: cur.y + size.height + 10 };
                    setOrbPosition(orbPos);
                    orbPositionRef.current = orbPos;
                    try { localStorage.setItem('mythrill-nav-orb', JSON.stringify(orbPos)); } catch {}
                    return cur;
                });
            } else {
                const op = orbPositionRef.current;
                setPosition({
                    x: Math.max(0, op.x - size.width / 2),
                    y: Math.max(0, op.y - size.height - 40)
                });
            }
            return next;
        });
    }, [size.width, size.height]);

    // Memoize buttons to prevent unnecessary re-renders
    const buttons = useMemo(() => getVisibleButtons(), [isGMMode]);

    const gridRef = useRef(null);
    useLayoutEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;
        const fit = () => {
            const children = [...grid.children];
            if (!children.length) return;
            const gcs = getComputedStyle(grid);
            const gap = parseFloat(gcs.columnGap) || 0;
            const gridPad = (parseFloat(gcs.paddingLeft) || 0) + (parseFloat(gcs.paddingRight) || 0);
            let content = 0;
            children.forEach(el => {
                const ecs = getComputedStyle(el);
                content += el.getBoundingClientRect().width
                    + (parseFloat(ecs.marginLeft) || 0) + (parseFloat(ecs.marginRight) || 0);
            });
            content += (children.length - 1) * gap;
            const needed = Math.ceil(content + gridPad) + 8;
            setSize(prev => {
                if (Math.abs(prev.width - needed) <= 6) return prev;
                return { ...prev, width: Math.min(Math.max(needed, 200), window.innerWidth - 40) };
            });
        };
        fit();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    }, [buttons]);

    const [openCategory, setOpenCategory] = useState(null);
    const toggleCategoryMenu = useCallback((catId) => {
        setOpenCategory(prev => (prev === catId ? null : catId));
    }, []);
    useEffect(() => {
        if (openCategory === null) return;
        const close = () => setOpenCategory(null);
        window.addEventListener('click', close);
        window.addEventListener('resize', close);
        return () => {
            window.removeEventListener('click', close);
            window.removeEventListener('resize', close);
        };
    }, [openCategory]);

    const renderWowNavButton = (button) => {
        const isActive = button.id === 'leveleditor'
            ? isEditorMode
            : button.id === 'combat'
                ? (isSelectionMode || isInCombat)
                : openWindows.has(button.id);
        return (
            <button
                key={button.id}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleButtonClick(button.id); }}
                onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleButtonClick(button.id); }}
                className={`wow-nav-button ${isActive ? 'active' : ''} ${button.premium ? 'premium' : ''} ${navAssets && button.id === 'settings' ? 'nav-sprite-btn-wrapper' : ''}`}
                title={`${button.title || button.id || 'Button'} (${button.shortcut || ''})${button.premium ? ' - Premium Feature' : ''}`}
                style={{ pointerEvents: 'auto', cursor: 'pointer', touchAction: 'manipulation' }}
            >
                {navAssets && button.id === 'settings' ? (
                    <img
                        src={navAssets.settings}
                        alt="Settings"
                        className="nav-sprite-btn-img"
                        draggable={false}
                    />
                ) : (
                    <svg viewBox="0 0 24 24" className="wow-nav-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {button.svg}
                    </svg>
                )}
                {button.id === 'community' && totalCommunityUnread > 0 && (
                    <span className="nav-notification-badge">
                        {totalCommunityUnread > 99 ? '99+' : totalCommunityUnread}
                    </span>
                )}
                {!navAssets && (
                    <div className="shortcut">
                        {button.shortcut}
                    </div>
                )}
            </button>
        );
    };

    const handleButtonClick = useCallback((windowId) => {
        if (isGMMode) triggerWindowIntro(windowId);

        // Special handling for level editor
        if (windowId === 'leveleditor') {
            setEditorMode(!isEditorMode);
            return;
        }

        // Special handling for combat initiator
        if (windowId === 'combat') {
            if (isSelectionMode) {
                // Cancel selection mode if currently selecting
                cancelSelectionMode();
            } else if (isInCombat) {
                // End combat if currently in combat
                endCombat();
            } else {
                // Start selection mode if not in combat
                startSelectionMode();
            }
            return;
        }

        // Special handling for community window (use presence store state)
        if (windowId === 'community') {
            setCommunityWindowOpen(!isCommunityWindowOpen);
            return;
        }

        const newOpenWindows = new Set(openWindows);
        if (openWindows.has(windowId)) {
            newOpenWindows.delete(windowId);
        } else {
            newOpenWindows.add(windowId);
        }
        setOpenWindows(newOpenWindows);
    }, [openWindows, isEditorMode, setEditorMode, isGMMode, isSelectionMode, isInCombat, startSelectionMode, cancelSelectionMode, isCommunityWindowOpen, setCommunityWindowOpen, triggerWindowIntro]);

    const handleKeyPress = useCallback((e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            handleToggleCollapse();
            return;
        }

        const key = e.key.toUpperCase();
        const button = buttons.find(b => b.shortcut.toUpperCase() === key);



        // Emergency combat reset (Ctrl+Shift+C)
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'C') {
            e.preventDefault();
            forceResetCombat();
            console.log('Emergency combat reset triggered');
            return;
        }

        // Clear combat storage (Ctrl+Shift+X)
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'X') {
            e.preventDefault();
            clearCombatStorage();
            forceResetCombat();
            console.log('Combat storage cleared and reset');
            return;
        }

        if (e.code === 'Space' && !e.target.classList.contains('wow-nav-button')) {
            e.preventDefault();
            const chatButton = buttons.find(b => b.id === 'chat');
            if (chatButton) handleButtonClick('chat');
            return;
        }

        // ESC key handling: close windows first, then show exit confirmation
        if (e.key === 'Escape' && onReturnToLanding) {
            // Check if any Navigation windows are open
            const hasOpenWindows = openWindows.size > 0;

            if (hasOpenWindows) {
                // Close all Navigation windows
                e.preventDefault();
                setOpenWindows(new Set());

                // Dispatch custom event to close all registered windows/modals
                // Modals/wizards can listen to this event and close themselves
                const closeAllWindowsEvent = new CustomEvent('closeAllWindows', {
                    bubbles: true,
                    cancelable: true
                });
                window.dispatchEvent(closeAllWindowsEvent);

                return;
            }

            if (hasRegisteredWindows) {
                // Let registered windows (modals/wizards) handle their own escape
                // They have their own escape handlers that will close them
                // Don't preventDefault so their handlers can run
                // After they close, user can press escape again to show confirmation
                return;
            }

            // No windows open - show exit confirmation
            e.preventDefault();
            setShowExitConfirm(true);
            return;
        }

        if (button) {
            e.preventDefault();
            handleButtonClick(button.id);
        }
    }, [handleButtonClick, onReturnToLanding, handleToggleCollapse]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    // Handle window resize and GM mode changes to adjust navigation bar position
    useEffect(() => {
        const handleResize = () => {
            const newSize = getInitialSize();
            if (newSize.width !== size.width || newSize.height !== size.height) {
                setSize(newSize);
                setPosition(prev => ({
                    x: Math.max(20, Math.min(prev.x, window.innerWidth - newSize.width - 20)),
                    y: Math.max(20, Math.min(prev.y, 100))
                }));
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [size.width, size.height]);

    // Update navigation bar size when GM mode changes
    useEffect(() => {
        const newSize = getInitialSize();
        if (newSize.width !== size.width) {
            setSize(newSize);
            // Keep navigation bar centered
            setPosition(prev => ({
                x: (window.innerWidth - newSize.width) / 2,
                y: prev.y
            }));
        }
    }, [isGMMode]);

    const getWindowContent = (button) => {
        // Safety check to ensure button object is valid
        if (!button || !button.id) {
            console.warn('🚨 Invalid button object passed to getWindowContent:', button);
            return null;
        }

        // Ensure title is always defined with fallback
        const safeTitle = button.title || button.id || 'Window';

        const shouldRender = openWindows.has(button.id);

        switch (button.id) {
            case 'character':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={null}>
                            <CharacterSheetWindow
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                                title={safeTitle}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'inventory':
                return shouldRender && (() => {
                    const ws = useWindowManagerStore.getState();
                    const invId = 'inventory';
                    const invPos = ws.getWindowPosition(invId, { x: 150, y: 150 });
                    const invSize = ws.getWindowSize(invId, { width: 900, height: 550 });
                    return (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={null}>
                            <MythrillWindow
                                key={button.id}
                                title={safeTitle}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                                defaultSize={invSize}
                                defaultPosition={invPos}
                                onDrag={(pos) => useWindowManagerStore.getState().setWindowPosition(invId, { x: pos.x, y: pos.y })}
                                onResize={(size) => useWindowManagerStore.getState().setWindowSize(invId, size)}
                                customHeader={
                                    <div className="spellbook-tab-container" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        <button className="spellbook-tab-button active">
                                            <i className="fas fa-backpack" style={{ marginRight: '8px' }}></i>
                                            <span>INVENTORY</span>
                                        </button>
                                        <div style={{ flex: 1 }}></div>
                                        <div style={{ marginRight: '48px' }}>
                                            <InventoryHeaderButton />
                                        </div>
                                    </div>
                                }
                            >
                                <InventoryWindow />
                            </MythrillWindow>
                        </Suspense>
                    </ErrorBoundary>
                )})();
            case 'crafting':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <CraftingWindow
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'spellbook':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <SpellbookWindow
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'talents':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <TalentTreeWindow
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'quests':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <QuestLogWindowWrapper
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'campaign':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <CampaignManagerWindow
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'community':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <GlobalChatWindowWrapper
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );

            case 'combat':
                // Combat is handled as a toggle mode, not a window
                return null;

            case 'library':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={null}>
                            <LibraryWindow
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'leveleditor':
                // Level editor is handled directly in the Grid component, not as a window
                return null;

            case 'travel':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <PlayerTravelDashboard
                                key={`${button.id}-player`}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );

            case 'toolkit':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={null}>
                            <Toolkit
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'settings':
                return shouldRender && (
                    <SettingsWindowWrapper
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );

            case 'journal':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={null}>
                            <PlayerJournalWindow
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );

            default:
                if (button.window) {
                    const Window = button.window;
                    return shouldRender && (
                        <MythrillWindow
                            key={button.id}
                            title={safeTitle}
                            isOpen={true}
                            onClose={() => handleButtonClick(button.id)}
                            defaultSize={{ width: 800, height: 600 }}
                            defaultPosition={{ x: 100, y: 100 }}
                        >
                            <Window />
                        </MythrillWindow>
                    );
                }
                return shouldRender && (
                    <MythrillWindow
                        key={button.id}
                        title={safeTitle}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                        defaultSize={{ width: 800, height: 600 }}
                        defaultPosition={{ x: 100, y: 100 }}
                    >
                        <div style={{ padding: '20px' }}>
                            <h2 style={{ color: '#89dceb', marginBottom: '16px' }}>{safeTitle}</h2>
                            <p>Content for {safeTitle} window coming soon...</p>
                        </div>
                    </MythrillWindow>
                );
        }
    };

    // Detect mobile device
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    });

    // Update mobile detection on resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mobile navigation popout state
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [mobileNavPage, setMobileNavPage] = useState(0);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(buttons.filter(b => b && b.id).length / itemsPerPage);

    // On mobile, position at bottom center
    
    // Get buttons for current page (mobile pagination)
    const getMobileVisibleButtons = () => {
        const allButtons = buttons.filter(button => button && button.id);
        const start = mobileNavPage * itemsPerPage;
        return allButtons.slice(start, start + itemsPerPage);
    };

    // Close popout when clicking outside
    useEffect(() => {
        if (!isMobileNavOpen || !isMobile) return;

        const handleClickOutside = (e) => {
            if (!e.target.closest('.mobile-nav-popout') && !e.target.closest('.mobile-nav-trigger')) {
                setIsMobileNavOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMobileNavOpen, isMobile]);

    const handleMobileNavPrev = () => {
        setMobileNavPage(prev => Math.max(0, prev - 1));
    };

    const handleMobileNavNext = () => {
        setMobileNavPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    return (
        <Fragment>
                {/* Mobile Navigation Button */}
                {isMobile && (
                    <button
                        className="mobile-nav-trigger"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMobileNavOpen(!isMobileNavOpen);
                        }}
                        title="Navigation Menu"
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                )}

                {/* Mobile Navigation Popout */}
                {isMobile && isMobileNavOpen && (
                    <div className="mobile-nav-backdrop" onClick={() => setIsMobileNavOpen(false)}>
                    <div className="mobile-nav-popout" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-nav-popout-header">
                            <span>Navigation</span>
                            <button
                                className="mobile-nav-close"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMobileNavOpen(false);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="mobile-nav-popout-content">
                            <button
                                className="mobile-nav-arrow mobile-nav-arrow-prev"
                                onClick={handleMobileNavPrev}
                                disabled={mobileNavPage === 0}
                                aria-label="Previous"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <div className="mobile-nav-buttons">
                                {getMobileVisibleButtons().map(button => {
                                    const isActive = button.id === 'leveleditor'
                                        ? isEditorMode
                                        : button.id === 'combat'
                                            ? isSelectionMode || isInCombat
                                            : openWindows.has(button.id);

                                    return (
                                        <button
                                            key={button.id}
                                            className={`mobile-nav-item ${isActive ? 'active' : ''} ${button.premium ? 'premium' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleButtonClick(button.id);
                                                setIsMobileNavOpen(false);
                                            }}
                                            title={button.title || button.id}
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="mobile-nav-icon"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                {button.svg}
                                            </svg>
                                            <span className="mobile-nav-label">{button.title || button.id}</span>
                                        </button>
                                    );
                                })}
                                {/* Dialogue Controls shortcut (GM-only) */}
                                {isGMMode && (
                                    <button
                                        className="mobile-nav-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.dispatchEvent(new Event('toggleDialogueControls'));
                                            setIsMobileNavOpen(false);
                                        }}
                                        title="Dialogue"
                                    >
                                        <i className="fas fa-comment-dots" style={{ width: 24, textAlign: 'center' }}></i>
                                        <span className="mobile-nav-label">Dialogue</span>
                                    </button>
                                )}

                                {/* Regain Leadership Button (GM-only when in Player Preview) */}
                                {(() => {
                                    const partyState = usePartyStore.getState();
                                    const currentMember = partyState.partyMembers.find(m => m.id === 'current-player');
                                    const isActualGM = currentMember?.isGM;
                                    const isLeader = partyState.leaderId === 'current-player';

                                    if (isActualGM && !isLeader) {
                                        return (
                                            <button
                                                onClick={() => partyState.setLeader('current-player')}
                                                className="wow-nav-button leadership-regain"
                                                title="Regain Leadership & Restore GM Tools"
                                                style={{
                                                    pointerEvents: 'auto',
                                                    cursor: 'pointer',
                                                    touchAction: 'manipulation',
                                                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                                    borderColor: '#d4af37'
                                                }}
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="wow-nav-icon"
                                                    fill="none"
                                                    stroke="#d4af37"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M2 20h20M2 19V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14M8 19v-4M16 19v-4M4 8l3 3 5-5 5 5 3-3" />
                                                </svg>
                                                <div className="shortcut" style={{ color: '#d4af37' }}>
                                                    GM
                                                </div>
                                            </button>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                            <button
                                className="mobile-nav-arrow mobile-nav-arrow-next"
                                onClick={handleMobileNavNext}
                                disabled={mobileNavPage >= totalPages - 1}
                                aria-label="Next"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <div className="mobile-nav-page-indicator">
                            {mobileNavPage + 1} / {totalPages}
                        </div>
                        {/* Back to Landing Button */}
                        {onReturnToLanding && (
                            <button
                                className="mobile-nav-back-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReturnToLanding();
                                    setIsMobileNavOpen(false);
                                }}
                            >
                                <i className="fas fa-arrow-left"></i>
                                <span>Return to Menu</span>
                            </button>
                        )}
                    </div>
                    </div>
                )}

                {/* Desktop Navigation */}
                {!isMobile && (
                    <>
                        {/* Navigation Orb - shown when nav is collapsed */}
                        {isNavCollapsed && (
                            <Draggable
                                position={orbPosition}
                                onStart={() => { orbDragRef.current = false; }}
                                onDrag={() => { orbDragRef.current = true; }}
                                onStop={(e, data) => {
                                    const newPos = { x: data.x, y: data.y };
                                    setOrbPosition(newPos);
                                    orbPositionRef.current = newPos;
                                    try { localStorage.setItem('mythrill-nav-orb', JSON.stringify(newPos)); } catch {}
                                    if (!orbDragRef.current) {
                                        setIsNavCollapsed(false);
                                        try { localStorage.setItem('mythrill-nav-collapsed', 'false'); } catch {}
                                        setPosition({
                                            x: Math.max(0, newPos.x - size.width / 2),
                                            y: Math.max(0, newPos.y - size.height - 40)
                                        });
                                    }
                                }}
                                nodeRef={orbRef}
                            >
                                <div
                                    ref={orbRef}
                                    className="nav-orb nav-quill-collapsed"
                                    title="Expand Navigation (~)"
                                >
                                    <img src={navAssets?.quill || '/assets/ui/Quill.PNG'} alt="Expand Navigation" className="nav-quill-img" draggable={false} />
                                    <div className="nav-orb-pulse" />
                                </div>
                            </Draggable>
                        )}
                        <Draggable
                            handle=".wow-nav-grid"
                            position={position}
                            onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
                            nodeRef={nodeRef}
                        >
                            <div
                                ref={nodeRef}
                                className={`nav-wrapper ${isNavCollapsed ? 'nav-wrapper--collapsed' : ''}`}
                                onMouseEnter={() => setIsNavHovered(true)}
                                onMouseLeave={() => setIsNavHovered(false)}
                            >
                            <div className="wow-nav-container nav-sprite-mode" style={{
                                    width: size.width,
                                    height: size.height,
                                    ...(navAssets ? {
                                        backgroundImage: `url(${navAssets.background})`,
                                        backgroundSize: '100% 100%',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                    } : {}),
                                }}>
                                    <div className="wow-nav-grid" ref={gridRef}>
                                        {NAV_CATEGORIES.map(cat => {
                                            const members = buttons.filter(b => b && b.id && (BUTTON_CATEGORY[b.id] || 'system') === cat.id);
                                            if (!members.length) return null;
                                            const isOpen = openCategory === cat.id;
                                            return (
                                                <div className="wow-nav-category" key={cat.id}>
                                                    <button
                                                        className={`wow-nav-category-header ${isOpen ? 'open' : ''} ${navAssets ? 'nav-sprite-category' : ''}`}
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCategoryMenu(cat.id); }}
                                                        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); toggleCategoryMenu(cat.id); }}
                                                        title={`${cat.label} (${members.length})`}
                                                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                                                    >
                                                        {navAssets ? (
                                                            <img
                                                                src={navAssets[cat.id]}
                                                                alt={cat.label}
                                                                className="nav-sprite-category-img"
                                                                draggable={false}
                                                            />
                                                        ) : (
                                                            <>
                                                                <svg viewBox="0 0 24 24" className="wow-nav-category-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    {cat.svg}
                                                                </svg>
                                                                <span className="wow-nav-category-label">{cat.label}</span>
                                                            </>
                                                        )}
                                                    </button>
                                                    {isOpen && (
                                                        <div className="wow-nav-flyout" onClick={(e) => e.stopPropagation()}>
                                                            <div className="wow-nav-flyout-title">{cat.label}</div>
                                                            {members.map(b => {
                                                                const bActive = b.id === 'leveleditor'
                                                                    ? isEditorMode
                                                                    : b.id === 'combat'
                                                                        ? (isSelectionMode || isInCombat)
                                                                        : openWindows.has(b.id);
                                                                return (
                                                                    <button
                                                                        key={b.id}
                                                                        className={`wow-nav-flyout-item ${bActive ? 'active' : ''} ${b.premium ? 'premium' : ''}`}
                                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleButtonClick(b.id); setOpenCategory(null); }}
                                                                        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleButtonClick(b.id); setOpenCategory(null); }}
                                                                        title={`${b.title || b.id}${b.shortcut ? ' (' + b.shortcut + ')' : ''}${b.premium ? ' - Premium' : ''}`}
                                                                    >
                                                                        <svg viewBox="0 0 24 24" className="wow-nav-flyout-item-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            {b.svg}
                                                                        </svg>
                                                                        <span className="wow-nav-flyout-item-label">{b.title || b.id}</span>
                                                                        {b.shortcut && <em className="wow-nav-flyout-item-shortcut">{b.shortcut}</em>}
                                                                        {b.id === 'community' && totalCommunityUnread > 0 && (
                                                                            <span className="nav-notification-badge">{totalCommunityUnread > 99 ? '99+' : totalCommunityUnread}</span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <span className={`wow-nav-divider ${navAssets ? 'nav-sprite-divider' : ''}`} aria-hidden="true" />
                                        {buttons.filter(b => b && b.id && (BUTTON_CATEGORY[b.id] || 'system') === 'system').map(renderWowNavButton)}

                                        {/* Back to Landing Page Button */}
                                        {onReturnToLanding && (
                                            <button
                                                onClick={onReturnToLanding}
                                                onTouchStart={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onTouchEnd={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onReturnToLanding();
                                                }}
                                                className={`wow-nav-button back-button ${navAssets ? 'nav-sprite-btn-wrapper' : ''}`}
                                                title="Return to Main Menu (ESC)"
                                                style={{ pointerEvents: 'auto', cursor: 'pointer', touchAction: 'manipulation' }}
                                            >
                                                {navAssets ? (
                                                    <img
                                                        src={navAssets.esc}
                                                        alt="ESC"
                                                        className="nav-sprite-btn-img"
                                                        draggable={false}
                                                    />
                                                ) : (
                                                    <>
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            className="wow-nav-icon"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M19 12H5M12 19l-7-7 7-7" />
                                                        </svg>
                                                        <div className="shortcut">
                                                            ESC
                                                        </div>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleCollapse(); }}
                                            onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleCollapse(); }}
                                            className="wow-nav-button wow-nav-minimize nav-quill-btn"
                                            title="Minimize Navigation (~)"
                                            style={{ pointerEvents: 'auto', cursor: 'pointer', touchAction: 'manipulation' }}
                                        />

                                    </div>
                                </div>
                        </div>
                    </Draggable>
                    </>
                )}

                {/* Grid Coordinates Display */}
                {(() => {
                    // Calculate grid coordinates with decimal precision
                    // Note: Negative sign accounts for coordinate system inversion
                    const gridX = -(cameraX || 0) / (gridSize || 50);
                    const gridY = -(cameraY || 0) / (gridSize || 50);

                    // Calculate a contrasting color based on background
                    const getContrastColor = (bgColor) => {
                        if (!bgColor) return '#5a3b2e'; // Default dark brown

                        // Parse hex color
                        const hex = bgColor.replace('#', '');
                        const r = parseInt(hex.substr(0, 2), 16);
                        const g = parseInt(hex.substr(2, 2), 16);
                        const b = parseInt(hex.substr(4, 2), 16);

                        // Calculate luminance
                        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

                        // Return dark color for light backgrounds, light color for dark backgrounds
                        // But make it a nice color, not pure black/white
                        if (luminance > 0.6) {
                            // Light background - use dark brown/rust color
                            return '#5a3b2e';
                        } else if (luminance > 0.4) {
                            // Medium background - use medium brown
                            return '#8b6f47';
                        } else {
                            // Dark background - use light beige
                            return '#d4c5b9';
                        }
                    };

                    const textColor = getContrastColor(gridBackgroundColor || '#d4c5b9');

                    return (
                        <div
                            className="grid-coordinates-display"
                            title="Click to center on origin (0, 0)"
                            onClick={() => setCameraPosition(0, 0)}
                            style={{
                                color: textColor,
                                visibility: 'visible',
                                opacity: 1
                            }}
                        >
                            <i className="fas fa-crosshairs" style={{ marginRight: '6px', color: textColor, fontSize: '12px', opacity: 0.8 }}></i>
                            <span style={{ color: textColor }}>X: {gridX.toFixed(1)}</span>
                            <span className="coord-separator" style={{ color: textColor }}>|</span>
                            <span style={{ color: textColor }}>Y: {gridY.toFixed(1)}</span>
                            <i
                                className="fas fa-map-marker-alt coord-jump-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setInputX(gridX.toFixed(1));
                                    setInputY(gridY.toFixed(1));
                                    setShowCoordinatePopup(true);
                                }}
                                style={{
                                    color: textColor,
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = '1'}
                                onMouseLeave={(e) => e.target.style.opacity = '0.8'}
                                title="Jump to coordinates"
                            ></i>
                        </div>
                    );
                })()}



                {/* Coordinate Input Popup */}
                {showCoordinatePopup && (
                    <div
                        className="coord-popup"
                        style={{
                            fontFamily: 'Bookman Old Style, Garamond, serif'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="coord-jump-title" style={{ color: '#d4c5b9', fontWeight: '600' }}>
                            Jump to Coordinates
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ color: '#d4c5b9', minWidth: '30px', fontFamily: 'Courier New, Monaco, monospace' }}>X:</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={inputX}
                                    onChange={(e) => setInputX(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const x = parseFloat(inputX) || 0;
                                            const y = parseFloat(inputY) || 0;
                                            // Convert grid coordinates to camera position
                                            // Reverse of: gridX = -(cameraX || 0) / (gridSize || 50)
                                            const cameraXPos = -(x * (gridSize || 50));
                                            const cameraYPos = -(y * (gridSize || 50));
                                            setCameraPosition(cameraXPos, cameraYPos);
                                            setShowCoordinatePopup(false);
                                        } else if (e.key === 'Escape') {
                                            setShowCoordinatePopup(false);
                                        }
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        backgroundColor: '#1a1008',
                                        border: '1px solid #8b6f47',
                                        borderRadius: '4px',
                                        color: '#d4c5b9',
                                        fontFamily: 'Courier New, Monaco, monospace',
                                        fontSize: '14px'
                                    }}
                                    autoFocus
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ color: '#d4c5b9', minWidth: '30px', fontFamily: 'Courier New, Monaco, monospace' }}>Y:</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={inputY}
                                    onChange={(e) => setInputY(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const x = parseFloat(inputX) || 0;
                                            const y = parseFloat(inputY) || 0;
                                            // Convert grid coordinates to camera position
                                            const cameraXPos = -(x * (gridSize || 50));
                                            const cameraYPos = -(y * (gridSize || 50));
                                            setCameraPosition(cameraXPos, cameraYPos);
                                            setShowCoordinatePopup(false);
                                        } else if (e.key === 'Escape') {
                                            setShowCoordinatePopup(false);
                                        }
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        backgroundColor: '#1a1008',
                                        border: '1px solid #8b6f47',
                                        borderRadius: '4px',
                                        color: '#d4c5b9',
                                        fontFamily: 'Courier New, Monaco, monospace',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button
                                    onClick={() => {
                                        const x = parseFloat(inputX) || 0;
                                        const y = parseFloat(inputY) || 0;
                                        // Convert grid coordinates to camera position
                                        const cameraXPos = -(x * (gridSize || 50));
                                        const cameraYPos = -(y * (gridSize || 50));
                                        setCameraPosition(cameraXPos, cameraYPos);
                                        setShowCoordinatePopup(false);
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        backgroundColor: '#8b6f47',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: '#f0e6d2',
                                        fontFamily: 'Bookman Old Style, Garamond, serif',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#a08c70'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#8b6f47'}
                                >
                                    Jump
                                </button>
                                <button
                                    onClick={() => setShowCoordinatePopup(false)}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        backgroundColor: '#5a3b2e',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: '#d4c5b9',
                                        fontFamily: 'Bookman Old Style, Garamond, serif',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#6b4a3a'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#5a3b2e'}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Backdrop to close popup when clicking outside */}
                {showCoordinatePopup && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 99999
                        }}
                        onClick={() => setShowCoordinatePopup(false)}
                    />
                )}

                {buttons.filter(button => button && button.id).map(button => (
                    <React.Fragment key={`window-${button.id}`}>
                        {getWindowContent(button)}
                    </React.Fragment>
                ))}
                {/* Exit Game Confirmation Dialog */}
                {showExitConfirm && (
                    <Suspense fallback={null}>
                        <ExitGameConfirmDialog
                            gameName="Mythrill"
                            onConfirm={() => {
                                setShowExitConfirm(false);
                                if (onReturnToLanding) {
                                    onReturnToLanding();
                                }
                            }}
                            onCancel={() => setShowExitConfirm(false)}
                        />
                    </Suspense>
                )}

                {/* Player Display Overlay - Shows GM-shared content */}
                <PlayerDisplayOverlay />
            </Fragment>
    );
}