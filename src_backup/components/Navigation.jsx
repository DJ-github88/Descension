<<<<<<< HEAD:src/components/Navigation.jsx
import React, { useState, useEffect, useCallback, lazy, Suspense, Fragment, useRef } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import useGameStore from '../store/gameStore';
import useLevelEditorStore from '../store/levelEditorStore';
=======
import React, { useState, useEffect, useCallback, lazy, Suspense, Fragment } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import useGameStore from '../store/gameStore';
import useChatStore from '../store/chatStore';
>>>>>>> Spell:src_backup/components/Navigation.jsx
import WowWindow from './windows/WowWindow';
import CreatureWindow from './windows/CreatureWindow';
import SettingsWindow from './windows/SettingsWindow';
import CharacterPanel from './character-sheet/Equipment';
import CharacterStats from './character-sheet/CharacterStats';
import Skills from './character-sheet/Skills';
import Lore from './character-sheet/Lore';
import InventoryWindow from './windows/InventoryWindow';
import ItemLibrary from './item-generation/ItemLibrary';
<<<<<<< HEAD:src/components/Navigation.jsx
import MapLibraryWindow from './windows/MapLibraryWindow';
import useCombatStore from '../store/combatStore';
import useChatStore from '../store/chatStore';
import ErrorBoundary from './ErrorBoundary';

import { SpellLibraryProvider } from './spellcrafting-wizard/context/SpellLibraryContext';
import { SpellWizardProvider } from './spellcrafting-wizard/context/spellWizardContext';
import ExternalLivePreview from './spellcrafting-wizard/ExternalLivePreview';
import 'react-resizable/css/styles.css';

const SpellbookWindow = lazy(() =>
    import('./windows/SpellbookWindow').catch(err => {
        console.error('Failed to load SpellbookWindow:', err);
        return { default: () => <div>Error loading Spellbook</div> };
    })
);
const QuestLogWindow = lazy(() =>
    import('./windows/QuestLogWindow').catch(err => {
        console.error('Failed to load QuestLogWindow:', err);
        return { default: () => <div>Error loading Quest Log</div> };
    })
);
const SocialWindow = lazy(() =>
    import('./windows/SocialWindow').catch(err => {
        console.error('Failed to load SocialWindow:', err);
        return { default: () => <div>Error loading Social Window</div> };
    })
);
const CraftingWindow = lazy(() =>
    import('./windows/CraftingWindow').catch(err => {
        console.error('Failed to load CraftingWindow:', err);
        return { default: () => <div>Error loading Crafting Window</div> };
    })
);

// Creature Window Wrapper with spellbook-style tabs
function CreatureWindowWrapper({ isOpen, onClose }) {
    const [activeView, setActiveView] = useState('library');
    const [editingCreatureId, setEditingCreatureId] = useState(null);

    const tabs = [
        { id: 'library', label: 'Library' },
        { id: 'wizard', label: 'Create New' }
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

    return (
        <WowWindow
            isOpen={isOpen}
            onClose={onClose}
            title="Creature Library"
            defaultSize={{ width: 1200, height: 800 }}
            defaultPosition={{ x: 100, y: 100 }}
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
                    {activeView === 'wizard' && (
                        <button
                            className="spellbook-tab back-button"
                            onClick={handleBackToLibrary}
                            style={{ marginLeft: 'auto' }}
                        >
                            <span>← Back to Library</span>
                        </button>
                    )}
                </div>
            }
        >
            <CreatureWindow
                activeView={activeView}
                editingCreatureId={editingCreatureId}
                onEditCreature={handleEditCreature}
                onBackToLibrary={handleBackToLibrary}
            />
        </WowWindow>
    );
}

// Social Window Wrapper with spellbook-style tabs
function SocialWindowWrapper({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('friends');

    const tabs = [
        { id: 'friends', label: 'Friends' },
        { id: 'ignored', label: 'Ignore' },
        { id: 'who', label: 'Who' }
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
        { id: 'interface', label: 'Interface' },
        { id: 'gameplay', label: 'Gameplay' }
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
        return { default: () => <div>Error loading Chat Window</div> };
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
        window: CreatureWindow,
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
=======
import '../styles/wow-ui.css';
import '../styles/navigation-badge.css';
import 'react-resizable/css/styles.css';

const SpellbookWindow = lazy(() => import('./windows/SpellbookWindow'));
const ChatWindow = lazy(() => import('./windows/ChatWindow'));
>>>>>>> Spell:src_backup/components/Navigation.jsx

function CharacterSheetWindow({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('character');

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
            defaultSize={{ width: 800, height: 600 }}
            defaultPosition={{ x: 100, y: 100 }}
            customHeader={
<<<<<<< HEAD:src/components/Navigation.jsx
                <div className="spellbook-tab-headers">
                    <button
                        className={`spellbook-tab ${activeTab === 'character' ? 'active' : ''}`}
=======
                <div className="tab-container">
                    <button
                        className={`tab-button ${activeTab === 'character' ? 'active' : ''}`}
>>>>>>> Spell:src_backup/components/Navigation.jsx
                        onClick={() => setActiveTab('character')}
                    >
                        <span>Character Sheet</span>
                    </button>
                    <button
<<<<<<< HEAD:src/components/Navigation.jsx
                        className={`spellbook-tab ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        <span>Stats</span>
                    </button>
                    <button
                        className={`spellbook-tab ${activeTab === 'skills' ? 'active' : ''}`}
=======
                        className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
>>>>>>> Spell:src_backup/components/Navigation.jsx
                        onClick={() => setActiveTab('skills')}
                    >
                        <span>Skills</span>
                    </button>
                    <button
<<<<<<< HEAD:src/components/Navigation.jsx
                        className={`spellbook-tab ${activeTab === 'lore' ? 'active' : ''}`}
=======
                        className={`tab-button ${activeTab === 'lore' ? 'active' : ''}`}
>>>>>>> Spell:src_backup/components/Navigation.jsx
                        onClick={() => setActiveTab('lore')}
                    >
                        <span>Lore</span>
                    </button>
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

export default function Navigation() {
    const [openWindows, setOpenWindows] = useState(new Set());

<<<<<<< HEAD:src/components/Navigation.jsx
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
        if (isGMMode) {
            // GM sees all buttons
            return NAVIGATION_BUTTONS;
        } else {
            // Player mode - hide GM-only features but keep settings
            const playerRestrictedButtons = [
                'leveleditor',    // Level Editor
                'creatures',      // Creature Library
                'maplibrary'      // Map Library
                // Note: settings is now allowed in player mode
            ];

            return NAVIGATION_BUTTONS.filter(button =>
                !playerRestrictedButtons.includes(button.id)
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



    const buttons = getVisibleButtons();

    const handleButtonClick = useCallback((windowId) => {
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

        if (button) {
            e.preventDefault();
            handleButtonClick(button.id);
        }
    }, [handleButtonClick]);

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

=======
    // Get unread counts from chat store
    const { unreadCounts, setIsOpen, setActiveTab } = useChatStore();

    // Define buttons array first to avoid temporal dead zone issues
    const buttons = [
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
            id: 'spellbook',
            title: 'Spellbook',
            shortcut: 'S',
            svg: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        },
        {
            id: 'talents',
            title: 'Talents',
            shortcut: 'T',
            svg: <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
        },
        {
            id: 'quests',
            title: 'Quest Log',
            shortcut: 'Q',
            svg: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        },
        {
            id: 'chat',
            title: 'Chat Window',
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
            id: 'itemgen',
            title: 'Item Library',
            shortcut: 'I',
            svg: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        }
    ];

    const handleButtonClick = useCallback((windowId) => {
        const newOpenWindows = new Set(openWindows);
        if (openWindows.has(windowId)) {
            newOpenWindows.delete(windowId);

            // If closing the chat window, update the chat store
            if (windowId === 'chat') {
                setIsOpen(false);
            }
        } else {
            newOpenWindows.add(windowId);

            // If opening the chat window, update the chat store
            if (windowId === 'chat') {
                setIsOpen(true);
            }
        }
        setOpenWindows(newOpenWindows);
    }, [openWindows, setIsOpen]);

    const handleKeyPress = useCallback((e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const key = e.key.toUpperCase();
        const button = buttons.find(b => b.shortcut.toUpperCase() === key);

        // Debug logging
        console.log('Key pressed:', key);
        console.log('Buttons:', buttons);
        console.log('Matching button:', button);

        if (e.code === 'Space' && !e.target.classList.contains('wow-nav-button')) {
            e.preventDefault();
            const chatButton = buttons.find(b => b.id === 'chat');
            console.log('Space pressed, chat button:', chatButton);
            if (chatButton) handleButtonClick('chat');
            return;
        }

        if (button) {
            e.preventDefault();
            console.log('Button found, clicking:', button.id);
            handleButtonClick(button.id);
        }
    }, [handleButtonClick, buttons]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const handleResize = (e, { size }) => {
        e.stopPropagation();
        setSize(size);
    };

>>>>>>> Spell:src_backup/components/Navigation.jsx
    const getWindowContent = (button) => {
        switch (button.id) {
            case 'character':
                return openWindows.has(button.id) && (
                    <CharacterSheetWindow
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );
            case 'inventory':
                return openWindows.has(button.id) && (
                    <WowWindow
                        key={button.id}
                        title={button.title}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                        defaultSize={{ width: 845, height: 490 }}
                        defaultPosition={{ x: 150, y: 150 }}
                    >
                        <InventoryWindow />
                    </WowWindow>
                );
<<<<<<< HEAD:src/components/Navigation.jsx
            case 'crafting':
                return openWindows.has(button.id) && (
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
                return openWindows.has(button.id) && (
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
                return openWindows.has(button.id) && (
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
            case 'chat':
                return openWindows.has(button.id) && (
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
                return openWindows.has(button.id) && (
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

=======
            case 'spellbook':
                return openWindows.has(button.id) && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <SpellbookWindow
                            key={button.id}
                            isOpen={true}
                            onClose={() => handleButtonClick(button.id)}
                        />
                    </Suspense>
                );
            case 'chat':
                return openWindows.has(button.id) && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <WowWindow
                            key={button.id}
                            title={button.title}
                            isOpen={true}
                            onClose={() => handleButtonClick(button.id)}
                            defaultSize={{ width: 500, height: 600 }}
                            defaultPosition={{ x: 200, y: 150 }}
                        >
                            <ChatWindow />
                        </WowWindow>
                    </Suspense>
                );
>>>>>>> Spell:src_backup/components/Navigation.jsx
            case 'itemgen':
                return openWindows.has(button.id) && (
                    <ItemLibrary
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );
<<<<<<< HEAD:src/components/Navigation.jsx
            case 'leveleditor':
                // Level editor is handled directly in the Grid component, not as a window
                return null;

            case 'maplibrary':
                return openWindows.has(button.id) && (
                    <MapLibraryWindow
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );

            case 'creatures':
                return openWindows.has(button.id) && (
                    <CreatureWindowWrapper
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
                );
            case 'settings':
                return openWindows.has(button.id) && (
                    <SettingsWindowWrapper
                        key={button.id}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                    />
=======
            case 'creatures':
                return openWindows.has(button.id) && (
                    <WowWindow
                        key={button.id}
                        title={button.title}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                        defaultSize={{ width: 900, height: 700 }}
                        defaultPosition={{ x: 100, y: 100 }}
                    >
                        <CreatureWindow />
                    </WowWindow>
>>>>>>> Spell:src_backup/components/Navigation.jsx
                );
            default:
                if (button.window) {
                    const Window = button.window;
                    return openWindows.has(button.id) && (
                        <WowWindow
                            key={button.id}
                            title={button.title}
                            isOpen={true}
                            onClose={() => handleButtonClick(button.id)}
                            defaultSize={{ width: 800, height: 600 }}
                            defaultPosition={{ x: 100, y: 100 }}
                        >
                            <Window />
                        </WowWindow>
                    );
                }
                return openWindows.has(button.id) && (
                    <WowWindow
                        key={button.id}
                        title={button.title}
                        isOpen={true}
                        onClose={() => handleButtonClick(button.id)}
                        defaultSize={{ width: 800, height: 600 }}
                        defaultPosition={{ x: 100, y: 100 }}
                    >
                        <div style={{ padding: '20px' }}>
                            <h2 style={{ color: '#89dceb', marginBottom: '16px' }}>{button.title}</h2>
                            <p>Content for {button.title} window coming soon...</p>
                        </div>
                    </WowWindow>
                );
        }
    };

    return (
<<<<<<< HEAD:src/components/Navigation.jsx
        <SpellWizardProvider>
            <Fragment>
=======
        <Fragment>
>>>>>>> Spell:src_backup/components/Navigation.jsx
            <Draggable
                handle=".wow-nav-grid"
                position={position}
                onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
<<<<<<< HEAD:src/components/Navigation.jsx
                nodeRef={nodeRef}
            >
                <div ref={nodeRef}>
=======
            >
                <div>
>>>>>>> Spell:src_backup/components/Navigation.jsx
                    <Resizable
                        width={size.width}
                        height={size.height}
                        onResize={handleResize}
                        draggableOpts={{ grid: [10, 10] }}
<<<<<<< HEAD:src/components/Navigation.jsx
                        minConstraints={[200, 50]}
                        maxConstraints={[800, 50]}
=======
                        minConstraints={[400, 70]}
                        maxConstraints={[800, 70]}
>>>>>>> Spell:src_backup/components/Navigation.jsx
                        resizeHandles={['e']}
                        handle={<div className="custom-resize-handle" />}
                    >
                        <div className="wow-nav-container" style={{
                            width: size.width,
                            height: size.height,
                        }}>
                            <div className="wow-nav-grid">
                                {buttons.map(button => {
<<<<<<< HEAD:src/components/Navigation.jsx
                                    // Special handling for level editor and combat active states
                                    const isActive = button.id === 'leveleditor'
                                        ? isEditorMode
                                        : button.id === 'combat'
                                        ? isSelectionMode || isInCombat  // Active during selection mode OR combat
                                        : openWindows.has(button.id);
=======
                                    // Calculate total unread count for chat button
                                    const totalUnread = button.id === 'chat'
                                        ? Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)
                                        : 0;
>>>>>>> Spell:src_backup/components/Navigation.jsx

                                    return (
                                        <button
                                            key={button.id}
                                            onClick={() => handleButtonClick(button.id)}
<<<<<<< HEAD:src/components/Navigation.jsx
                                            className={`wow-nav-button ${isActive ? 'active' : ''}`}
                                            title={`${button.title} (${button.shortcut})`}
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


=======
                                            className={`wow-nav-button ${openWindows.has(button.id) ? 'active' : ''}`}
                                            title={`${button.title} (${button.shortcut})`}
                                            data-unread={totalUnread}
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
                                            {button.id === 'chat' && totalUnread > 0 && (
                                                <div className="unread-badge">{totalUnread > 99 ? '99+' : totalUnread}</div>
                                            )}
                                        </button>
                                    );
                                })}
>>>>>>> Spell:src_backup/components/Navigation.jsx
                            </div>
                        </div>
                    </Resizable>
                </div>
            </Draggable>
<<<<<<< HEAD:src/components/Navigation.jsx
            {buttons.map(button => (
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
=======
            {buttons.map(button => getWindowContent(button))}
        </Fragment>
>>>>>>> Spell:src_backup/components/Navigation.jsx
    );
}