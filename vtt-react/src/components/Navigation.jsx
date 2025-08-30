import React, { useState, useEffect, useCallback, lazy, Suspense, Fragment, useRef, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import useGameStore from '../store/gameStore';
import useLevelEditorStore from '../store/levelEditorStore';
import WowWindow from './windows/WowWindow';
import SettingsWindow from './windows/SettingsWindow';

import CharacterPanel from './character-sheet/Equipment';
import { CreatureLibraryProvider } from './creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from './creature-wizard/context/CreatureWizardContext';
import CreatureLibrary from './creature-wizard/components/library/CreatureLibrary';

// Pre-load the wizard components for better development experience
import CreatureWizardApp from './creature-wizard/CreatureWizardApp';

import CharacterStats from './character-sheet/CharacterStats';
import Skills from './character-sheet/Skills';
import Lore from './character-sheet/Lore';
import InventoryWindow from './windows/InventoryWindow';
import ItemLibraryWindow from './windows/ItemLibraryWindow';
import MapLibraryWindow from './windows/MapLibraryWindow';
import useCombatStore from '../store/combatStore';
import useChatStore from '../store/chatStore';
import useCreatureStore from '../store/creatureStore';
import ErrorBoundary from './ErrorBoundary';
// REMOVED: import './creature-wizard/styles/CreatureWindow.css'; // CAUSES CSS POLLUTION
// REMOVED: import 'react-resizable/css/styles.css'; // CAUSES CSS POLLUTION

import { SpellLibraryProvider } from './spellcrafting-wizard/context/SpellLibraryContext';
import { SpellWizardProvider } from './spellcrafting-wizard/context/spellWizardContext';
import ExternalLivePreview from './spellcrafting-wizard/ExternalLivePreview';

// Pre-load these components instead of lazy loading for better development experience
import SpellbookWindow from './windows/SpellbookWindow';
import CampaignManagerWindow from './windows/CampaignManagerWindow';
const QuestLogWindow = lazy(() =>
    import('./windows/QuestLogWindow').catch(err => {
        console.error('Failed to load QuestLogWindow:', err);
        return { default: () => <div>Error loading Quest Log</div> };
    })
);
const SocialWindow = lazy(() =>
    import('./windows/SocialWindow').catch(err => {
        console.error('Failed to load SocialWindow:', err);
        // Return a more user-friendly error component
        return {
            default: () => (
                <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
                    <h3>🚫 Social Window Unavailable</h3>
                    <p>The social features are temporarily unavailable.</p>
                    <p>Please try refreshing the page.</p>
                </div>
            )
        };
    })
);
const CraftingWindow = lazy(() =>
    import('./windows/CraftingWindow').catch(err => {
        console.error('Failed to load CraftingWindow:', err);
        // Return a more user-friendly error component
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

// Creature Window Wrapper with spellbook-style tabs
function CreatureWindowWrapper({ isOpen, onClose }) {
    const [activeView, setActiveView] = useState('library');
    const [editingCreatureId, setEditingCreatureId] = useState(null);
    const { setWindowPosition, setWindowSize } = useCreatureStore();

    const tabs = [
        {
            id: 'library',
            label: 'Library'
        },
        {
            id: 'wizard',
            label: 'Create New'
        }
    ];

    const handleCreateNewCreature = () => {
        setEditingCreatureId(null);
        setActiveView('wizard');
    };

    const handleBackToLibrary = () => {
        setActiveView('library');
        setEditingCreatureId(null);
    };

    const handleEditCreature = (creatureId) => {
        setEditingCreatureId(creatureId);
        setActiveView('wizard');
    };

    // Handle window drag to update position in store
    const handleWindowDrag = useCallback((position) => {
        // Only save x and y coordinates to avoid circular references
        setWindowPosition({ x: position.x, y: position.y });
    }, [setWindowPosition]);

    // Handle window resize to update size in store
    const handleWindowResize = useCallback((size) => {
        setWindowSize(size);
    }, [setWindowSize]);

    // Calculate proper default position (centered)
    const getDefaultPosition = useCallback(() => {
        const { windowPosition } = useCreatureStore.getState();
        if (windowPosition) {
            return windowPosition;
        }
        // Center the window on screen
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const windowWidth = 1200;
        const windowHeight = 800;

        return {
            x: Math.max(0, (screenWidth - windowWidth) / 2),
            y: Math.max(0, (screenHeight - windowHeight) / 2)
        };
    }, []);

    return (
        <WowWindow
            isOpen={isOpen}
            onClose={onClose}
            title="Creature Library"
            defaultSize={{ width: 1200, height: 800 }}
            defaultPosition={getDefaultPosition()}
            centered={false}
            onDrag={handleWindowDrag}
            onResize={handleWindowResize}
            customHeader={
                <div className="spellbook-tab-headers">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`spellbook-tab ${activeView === tab.id ? 'active' : ''}`}
                            onClick={() => tab.id === 'wizard' ? handleCreateNewCreature() : setActiveView(tab.id)}
                        >
                            <span>{tab.label}</span>
                        </button>
                    ))}

                </div>
            }
        >
            <div className="creature-window">
                <CreatureLibraryProvider>
                    <CreatureWizardProvider>
                        {/* Main content area - always render both components for pre-loading */}
                        <div className="creature-window-content">
                            <div style={{ display: activeView === 'library' ? 'block' : 'none' }}>
                                <CreatureLibrary onEdit={handleEditCreature} />
                            </div>
                            <div style={{ display: activeView === 'wizard' ? 'block' : 'none' }}>
                                <CreatureWizardApp
                                    editMode={!!editingCreatureId}
                                    creatureId={editingCreatureId}
                                    onSave={handleBackToLibrary}
                                    onCancel={handleBackToLibrary}
                                    activeView={activeView}
                                />
                            </div>
                        </div>
                    </CreatureWizardProvider>
                </CreatureLibraryProvider>
            </div>
        </WowWindow>
    );
}

// Social Window Wrapper with spellbook-style tabs
function SocialWindowWrapper({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('friends');

    const tabs = [
        {
            id: 'friends',
            label: 'Friends',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_guildperk_everyonesfriend.jpg'
        },
        {
            id: 'ignored',
            label: 'Ignore',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_charm.jpg'
        },
        {
            id: 'who',
            label: 'Who',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg'
        }
    ];

    return (
        <WowWindow
            isOpen={isOpen}
            onClose={onClose}
            title="Social"
            defaultSize={{ width: 400, height: 600 }}
            defaultPosition={{ x: 200, y: 150 }}
            customHeader={
                <div className="spellbook-tab-headers">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`spellbook-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            }
        >
            <SocialWindow activeTab={activeTab} contentOnly={true} />
        </WowWindow>
    );
}

// Quest Log Window Wrapper - simplified to prevent double window loading
function QuestLogWindowWrapper({ isOpen, onClose }) {
    // Use the QuestLogWindow directly without nesting it in another WowWindow
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

    // Tab definitions - filter based on GM/Player mode
    const getAllTabs = () => [
        {
            id: 'interface',
            label: 'Interface',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_gizmo_02.jpg'
        },
        {
            id: 'gameplay',
            label: 'Gameplay',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gear_01.jpg'
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
        <WowWindow
            isOpen={isOpen}
            onClose={onClose}
            title="Settings"
            defaultSize={{ width: 800, height: 600 }}
            defaultPosition={{ x: 100, y: 100 }}
            customHeader={
                <div className="spellbook-tab-headers">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`spellbook-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            }
        >
            <SettingsWindow activeTab={activeTab} />
        </WowWindow>
    );
}
const ChatWindow = lazy(() =>
    import('./windows/ChatWindow').catch(err => {
        console.error('Failed to load ChatWindow:', err);
        // Return a more user-friendly error component
        return {
            default: () => (
                <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
                    <h3>💬 Chat Window Unavailable</h3>
                    <p>The chat system is temporarily unavailable.</p>
                    <p>Please try refreshing the page.</p>
                </div>
            )
        };
    })
);

// Chat Window Wrapper with tabs in header
function ChatWindowWrapper({ isOpen, onClose }) {
    const { activeTab, setActiveTab, unreadCounts } = useChatStore(state => ({
        activeTab: state.activeTab,
        setActiveTab: state.setActiveTab,
        unreadCounts: state.unreadCounts
    }));

    return (
        <WowWindow
            isOpen={isOpen}
            onClose={onClose}
            title="Chat"
            defaultSize={{ width: 500, height: 600 }}
            defaultPosition={{ x: 200, y: 150 }}
            customHeader={
                <div className="spellbook-tab-headers">
                    <button
                        className={`spellbook-tab ${activeTab === 'social' ? 'active' : ''}`}
                        onClick={() => setActiveTab('social')}
                        data-unread={unreadCounts.social}
                    >
                        <span>Social</span>
                    </button>
                    <button
                        className={`spellbook-tab ${activeTab === 'combat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('combat')}
                        data-unread={unreadCounts.combat}
                    >
                        <span>Combat</span>
                    </button>
                    <button
                        className={`spellbook-tab ${activeTab === 'loot' ? 'active' : ''}`}
                        onClick={() => setActiveTab('loot')}
                        data-unread={unreadCounts.loot}
                    >
                        <span>Loot</span>
                    </button>
                </div>
            }
        >
            <ChatWindow />
        </WowWindow>
    );
}

// Define buttons array outside component to avoid any temporal dead zone issues
const NAVIGATION_BUTTONS = [
    {
        id: 'character',
        title: 'Character Sheet',
        shortcut: 'C',
        svg: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    },
    {
        id: 'inventory',
        title: 'Inventory',
        shortcut: 'B',
        svg: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
    },
    {
        id: 'crafting',
        title: 'Crafting',
        shortcut: 'R',
        svg: <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 22 12 18.77 5.82 22 7 13.87 2 9l6.91-.74L12 2z"/>
    },
    {
        id: 'spellbook',
        title: 'Spellbook',
        shortcut: 'S',
        svg: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    },
    {
        id: 'itemgen',
        title: 'Item Library',
        shortcut: 'I',
        svg: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    },
    {
        id: 'quests',
        title: 'Quest Log',
        shortcut: 'Q',
        svg: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
    },
    {
        id: 'campaign',
        title: 'Campaign Manager',
        shortcut: 'P',
        svg: <>
            <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 22 12 18.77 5.82 22 7 13.87 2 9l6.91-.74L12 2z"/>
            <path d="M8 14l2 2 4-4"/>
            <circle cx="12" cy="8" r="2"/>
        </>,
        premium: true
    },
    {
        id: 'chat',
        title: 'Chat',
        shortcut: 'H',
        svg: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
    },
    {
        id: 'social',
        title: 'Social',
        shortcut: 'O',
        svg: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 100-6 3 3 0 000 6z"/>
    },

    {
        id: 'combat',
        title: 'Combat Initiator',
        shortcut: 'X',
        svg: <>
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M9 12l2 2 4-4"/>
        </>,
    },

    {
        id: 'creatures',
        title: 'Creature Library',
        shortcut: 'L',
        svg: <>
            <path d="M7 7h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z M12 11c-2.5 0-3.5 1.5-3.5 3s1 3 3.5 3m6 0c2.5 0 3.5 1.5 3.5 3s-1 3-3.5 3"/>
            <path d="M9 17c-2.5 0-3.5-1.5-3.5-3s1-3 3.5-3m6 0c2.5 0 3.5 1.5 3.5 3s-1 3-3.5 3"/>
        </>
    },
    {
        id: 'settings',
        title: 'Settings',
        shortcut: 'G',
        window: SettingsWindow,
        svg: <>
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
        </>
    },



    {
        id: 'leveleditor',
        title: 'Level Editor',
        shortcut: 'E',
        svg: <>
            <path d="M3 21h18M3 10h18M3 7l9-4 9 4M6 10v11M10 10v11M14 10v11M18 10v11"/>
            <path d="M12 3v4M8 7h8"/>
        </>
    },
    {
        id: 'maplibrary',
        title: 'Map Library',
        shortcut: 'M',
        svg: <>
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z"/>
            <path d="M9 2v18M15 5v18"/>
        </>
    },
];

function CharacterSheetWindow({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('character');

    // Define character sheet sections with icons
    const characterSections = {
        character: {
            title: 'Character Sheet',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg'
        },
        stats: {
            title: 'Stats',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_innerrage.jpg'
        },
        skills: {
            title: 'Skills',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engineering.jpg'
        },
        lore: {
            title: 'Lore',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_note_05.jpg'
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'character':
                return <CharacterPanel />;
            case 'stats':
                return <CharacterStats />;
            case 'skills':
                return <Skills />;
            case 'lore':
                return <Lore />;
            default:
                return <CharacterPanel />;
        }
    };

    return (
        <WowWindow
            isOpen={isOpen}
            onClose={onClose}
            title="Character Sheet"
            defaultSize={{ width: 800, height: 600 }}
            defaultPosition={{ x: 100, y: 100 }}
            customHeader={
                <div className="spellbook-tab-headers">
                    {Object.entries(characterSections).map(([key, section]) => (
                        <button
                            key={key}
                            className={`spellbook-tab ${activeTab === key ? 'active' : ''}`}
                            onClick={() => setActiveTab(key)}
                        >
                            <span>{section.title}</span>
                        </button>
                    ))}
                </div>
            }
        >
            <div className="character-sheet">
                <div className="character-sheet-content">
                    {renderContent()}
                </div>
            </div>
        </WowWindow>
    );
}

export default function Navigation({ onReturnToLanding }) {
    const [openWindows, setOpenWindows] = useState(new Set());

    // Level editor store
    const { isEditorMode, setEditorMode } = useLevelEditorStore();

    // Game store for GM mode
    const { isGMMode } = useGameStore();

    // Combat store for selection mode
    const {
        isSelectionMode,
        isInCombat,
        startSelectionMode,
        cancelSelectionMode,
        endCombat,
        forceResetCombat,

        clearCombatStorage
    } = useCombatStore();

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
            // GM sees all buttons
            return validButtons;
        } else {
            // Player mode - use pre-filtered buttons for better performance
            // Cache the restricted button set to avoid recreating on every render
            if (!this.playerRestrictedButtonsSet) {
                this.playerRestrictedButtonsSet = new Set([
                    'leveleditor',    // Level Editor
                    'creatures',      // Creature Library
                    'maplibrary',     // Map Library
                    'campaign'        // Campaign Manager (Premium GM Feature)
                    // Note: settings is now allowed in player mode
                ]);
            }

            return validButtons.filter(button =>
                !this.playerRestrictedButtonsSet.has(button.id)
            );
        }
    };

    // Calculate initial size based on screen width and number of visible buttons
    const getInitialSize = () => {
        const buttonCount = getVisibleButtons().length;

        // Use consistent sizing - 36px buttons with 3px gaps and 8px padding (4px on each side)
        const buttonWidth = 36;
        const gap = 3;
        const padding = 8; // 4px on each side

        // Calculate exact width needed for buttons
        const calculatedWidth = (buttonCount * buttonWidth) + ((buttonCount - 1) * gap) + padding;

        return {
            width: calculatedWidth,
            height: 50
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



    // Memoize buttons to prevent unnecessary re-renders
    const buttons = useMemo(() => getVisibleButtons(), [isGMMode]);

    const handleButtonClick = useCallback((windowId) => {
        console.log('🎯 Navigation button clicked:', windowId, 'Current openWindows:', Array.from(openWindows));

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

        const newOpenWindows = new Set(openWindows);
        if (openWindows.has(windowId)) {
            newOpenWindows.delete(windowId);
        } else {
            newOpenWindows.add(windowId);
        }
        setOpenWindows(newOpenWindows);
    }, [openWindows, isEditorMode, setEditorMode, isGMMode, isSelectionMode, isInCombat, startSelectionMode, cancelSelectionMode]);

    const handleKeyPress = useCallback((e) => {
        // Don't handle shortcuts if user is typing in an input field or content editable element
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

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

        // ESC key to return to landing page
        if (e.key === 'Escape' && onReturnToLanding) {
            e.preventDefault();
            onReturnToLanding();
            return;
        }

        if (button) {
            e.preventDefault();
            handleButtonClick(button.id);
        }
    }, [handleButtonClick, onReturnToLanding]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    // Handle window resize and GM mode changes to adjust navigation bar position
    useEffect(() => {
        const handleResize = () => {
            const newSize = getInitialSize();
            if (newSize.width !== size.width) {
                setSize(newSize);
                // Keep navigation bar centered at top
                setPosition(prev => ({
                    x: Math.max(20, Math.min(prev.x, window.innerWidth - newSize.width - 20)),
                    y: Math.max(20, Math.min(prev.y, 100)) // Keep it near the top
                }));
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [size.width]);

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

    const handleResize = (e, { size }) => {
        e.stopPropagation();
        setSize(size);
    };

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
                    <CharacterSheetWindow
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                        title={safeTitle}
                    />
                );
            case 'inventory':
                return shouldRender && (
                    <WowWindow
                        key={button.id}
                        title={safeTitle}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                        defaultSize={{ width: 900, height: 550 }}
                        defaultPosition={{ x: 150, y: 150 }}
                    >
                        <InventoryWindow />
                    </WowWindow>
                );
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
                            <SpellLibraryProvider>
                                <SpellbookWindow
                                    key={button.id}
                                    isOpen={true}
                                    onClose={() => handleButtonClick(button.id)}
                                />
                            </SpellLibraryProvider>
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
            case 'chat':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <ChatWindowWrapper
                                key={button.id}
                                isOpen={true}
                                onClose={() => handleButtonClick(button.id)}
                            />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'social':
                return shouldRender && (
                    <ErrorBoundary key={`${button.id}-error-boundary`}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <SocialWindowWrapper
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

            case 'itemgen':
                return shouldRender && (
                    <ItemLibraryWindow
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );
            case 'leveleditor':
                // Level editor is handled directly in the Grid component, not as a window
                return null;

            case 'maplibrary':
                return shouldRender && (
                    <MapLibraryWindow
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );

            case 'creatures':
                return shouldRender && (
                    <CreatureWindowWrapper
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );
            case 'settings':
                return shouldRender && (
                    <SettingsWindowWrapper
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );

            default:
                if (button.window) {
                    const Window = button.window;
                    return shouldRender && (
                        <WowWindow
                            key={button.id}
                            title={safeTitle}
                            isOpen={true}
                            onClose={() => handleButtonClick(button.id)}
                            defaultSize={{ width: 800, height: 600 }}
                            defaultPosition={{ x: 100, y: 100 }}
                        >
                            <Window />
                        </WowWindow>
                    );
                }
                return shouldRender && (
                    <WowWindow
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
                    </WowWindow>
                );
        }
    };

    return (
        <SpellWizardProvider>
            <Fragment>
            <Draggable
                handle=".wow-nav-grid"
                position={position}
                onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
                nodeRef={nodeRef}
            >
                <div ref={nodeRef}>
                    <Resizable
                        width={size.width}
                        height={size.height}
                        onResize={handleResize}
                        draggableOpts={{ grid: [10, 10] }}
                        minConstraints={[200, 50]}
                        maxConstraints={[800, 50]}
                        resizeHandles={['e']}
                        handle={<div className="custom-resize-handle" />}
                    >
                        <div className="wow-nav-container" style={{
                            width: size.width,
                            height: size.height,
                        }}>
                            <div className="wow-nav-grid">
                                {buttons.filter(button => button && button.id).map(button => {
                                    // Special handling for level editor and combat active states
                                    const isActive = button.id === 'leveleditor'
                                        ? isEditorMode
                                        : button.id === 'combat'
                                        ? isSelectionMode || isInCombat  // Active during selection mode OR combat
                                        : openWindows.has(button.id);

                                    return (
                                        <button
                                            key={button.id}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleButtonClick(button.id);
                                            }}
                                            className={`wow-nav-button ${isActive ? 'active' : ''} ${button.premium ? 'premium' : ''}`}
                                            title={`${button.title || button.id || 'Button'} (${button.shortcut || ''})${button.premium ? ' - Premium Feature' : ''}`}
                                            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                                        >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="wow-nav-icon"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            {button.svg}
                                        </svg>
                                        <div className="shortcut">
                                            {button.shortcut}
                                        </div>
                                    </button>
                                    );
                                })}

                                {/* Back to Landing Page Button */}
                                {onReturnToLanding && (
                                    <button
                                        onClick={onReturnToLanding}
                                        className="wow-nav-button back-button"
                                        title="Return to Main Menu (ESC)"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="wow-nav-icon"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                                        </svg>
                                        <div className="shortcut">
                                            ESC
                                        </div>
                                    </button>
                                )}

                            </div>
                        </div>
                    </Resizable>
                </div>
            </Draggable>
            {buttons.filter(button => button && button.id).map(button => (
                <React.Fragment key={`window-${button.id}`}>
                    {getWindowContent(button)}
                </React.Fragment>
            ))}
            {/* External Live Preview - only shows when spellbook is open and wizard tab is active */}
            {openWindows.has('spellbook') && (
                <ExternalLivePreview />
            )}
            </Fragment>
        </SpellWizardProvider>
    );
}