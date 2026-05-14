import React, { useEffect, useState, Suspense } from 'react';
import lazy from './utils/lazyWithRetry';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import GameProvider from "./components/GameProvider";
import { SpellLibraryProvider } from "./components/spellcrafting-wizard/context/SpellLibraryContext";
import { RoomProvider } from "./contexts/RoomContext";
import PersistenceProvider from "./components/providers/PersistenceProvider";
import useAuthStore from "./store/authStore";
import useCharacterStore from "./store/characterStore";
import SocialNotificationLayer from "./components/social/SocialNotificationLayer";
import GlobalSocketManager from "./components/social/GlobalSocketManager";
import usePartyStore from "./store/partyStore";
import useGameStore from "./store/gameStore";
import useBuffStore from "./store/buffStore";
import useDebuffStore from "./store/debuffStore";
import useTargetingStore from "./store/targetingStore";
import useIdleDetection from "./hooks/useIdleDetection";
import useSessionManagement from "./hooks/useSessionManagement";
import { initializeOfflineSupport } from "./services/offlineService";
import { initializePerformanceMonitoring } from "./services/performanceService";
import { initializeAnalytics } from "./services/analyticsService";
import characterBackupService from "./services/firebase/characterBackupService";
import PerformanceDashboard from "./components/common/PerformanceDashboard";

// Core components that are always needed
import LandingPage from "./components/landing/LandingPage";
import AuthModal from "./components/auth/AuthModal";
import UserProfile from "./components/auth/UserProfile";
import DialogueSystem from "./components/dialogue/DialogueSystem";
import DialogueControls from "./components/dialogue/DialogueControls";
import LevelUpChoiceModal from "./components/modals/LevelUpChoiceModal";
import { FloatingCombatTextManager } from "./components/combat/FloatingCombatText";
import ErrorBoundary from "./components/common/ErrorBoundary";
import useLocalRoomAutoSave from "./hooks/useLocalRoomAutoSave";
import initChatStore from './utils/initChatStore';
import initCreatureStore, { removeDuplicateCreatures } from './utils/initCreatureStore';
import { initializePortalSystem } from './utils/portalUtils';
import { initializeCleanSpellLibrary } from './utils/clearSpellCache';
import './services/roomService';
import './styles/player-notification.css';
import './styles/wow-classic-tooltip.css';
import './styles/skill-roll-notification.css';
import './styles/wow-window.css';
import './styles/draggable-window.css';
import './styles/Grid.css';
import './components/auth/styles/LoginTransition.css';
import './styles/character-sheet-isolation.css';
import './styles/character-sheet.css';
import './styles/game-screen.css';
import './styles/grid-item.css';
import './styles/party-hud.css';
import './styles/creature-token.css';
import './styles/chat-bubble.css';
import './components/multiplayer/styles/MultiplayerApp.css';
import './components/multiplayer/styles/RoomLobby.css';
import './components/multiplayer/styles/ChatWindow.css';
import './components/account/styles/RoomManager.css';
import './styles/multiplayer-button.css';
import './components/ui/ActionBar.css';
import './components/account/styles/AccountDashboardIsolation.css';
import './components/character-creation-wizard/styles/CharacterCreationWizard.css';
import './components/hud/styles/ClassResourceBar.css';
import './styles/item-library.css';
import './styles/item-card.css';
import './styles/quick-item-wizard.css';
import './styles/enhanced-quick-item-wizard.css';
import './styles/item-generation.css';
import './styles/community-tabs-shared.css';
import './components/item-generation/CommunityItemsTab.css';
import './styles/step-tooltip.css';
import './styles/item-tooltip.css';
import './styles/container-wizard.css';
import './styles/container.css';
import './styles/container-window.css';
import './styles/category-dialog.css';
import './styles/confirmation-dialog.css';
import './styles/currency-withdraw-modal.css';
import './styles/quick-item-generator-modal.css';
import './styles/lock-settings-modal.css';
import './styles/unlock-container-modal.css';
import './components/item-generation/CategorizeModal.css';
import './styles/recipe-wizard.css';

// Essential Game Mode Styles (Consolidated here to prevent "shredding" on re-entry)
import './components/creature-wizard/styles/CreatureWindow.css';
import './components/combat/FloatingCombatText.css';
import './styles/combat-system.css';
import './styles/item-icon-selector.css';
import './styles/dropdown-fix.css';
import './components/spellcrafting-wizard/styles/IconSelector.css';
import './styles/inventory.css';
import './styles/item-wizard.css';
import './components/spellcrafting-wizard/styles/pathfinder/main.css';
import 'react-resizable/css/styles.css';

// Spell Library & Community styles (consolidated to prevent shredding on game re-entry)
import './components/spellcrafting-wizard/styles/pathfinder/components/wow-spellbook.css';
import './components/spellcrafting-wizard/components/library/CommunitySpellsTab.css';
import './components/creature-wizard/components/library/CommunityCreaturesTab.css';

// Lazy load heavy components to reduce initial bundle size
const Grid = lazy(() => import("./components/Grid"));
const Navigation = lazy(() => import("./components/Navigation"));
const HUDContainer = lazy(() => import("./components/hud/HUDContainer"));
const GridItemsManager = lazy(() => import("./components/grid/GridItemsManager"));
const AchievementNotificationOverlay = lazy(() => import("./components/AchievementNotificationOverlay"));

const DynamicFogManager = lazy(() => import("./components/level-editor/DynamicFogManager"));
const DynamicLightingManager = lazy(() => import("./components/level-editor/DynamicLightingManager"));
const AtmosphericEffectsManager = lazy(() => import("./components/level-editor/AtmosphericEffectsManager"));
const MemorySnapshotManager = lazy(() => import("./components/level-editor/MemorySnapshotManager"));
const ActionBar = lazy(() => import("./components/ui/ActionBar"));
const CombatSelectionWindow = lazy(() => import("./components/combat/CombatSelectionOverlay"));
const CombatTimeline = lazy(() => import("./components/combat/CombatTimeline"));
const DiceRollingSystem = lazy(() => import("./components/dice/DiceRollingSystem"));
const AudioPlayerWidget = lazy(() => import("./components/jukebox/AudioPlayerWidget"));
// Lazy load page components
const MultiplayerApp = lazy(() => import("./components/multiplayer/MultiplayerApp"));
const AccountDashboard = lazy(() => import("./components/account/AccountDashboard"));
const CharacterManagement = lazy(() => import("./components/account/CharacterManagement"));
const CharacterCreationPage = lazy(() => import("./components/account/CharacterCreationPage"));
const CharacterViewPage = lazy(() => import("./components/account/CharacterViewPage"));

// Test components
const TestTriggerDisplay = lazy(() => import("./components/spellcrafting-wizard/test/TestTriggerDisplay"));


// Track dynamically loaded stylesheets for cleanup
let gameStyleObserver = null;

// Lazy load game-specific styles with cleanup tracking
const loadGameStyles = () => {
    // Start observing head for new style injections
    if (typeof window !== 'undefined' && !gameStyleObserver) {
        gameStyleObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'STYLE' || (node.tagName === 'LINK' && node.rel === 'stylesheet')) {
                        node.setAttribute('data-game-style', 'true');
                    }
                });
            });
        });

        gameStyleObserver.observe(document.head, { childList: true });
    }
};

// Clean up game-specific styles when leaving game mode
const cleanupGameStyles = () => {
    // Remove game mode class and add landing mode class
    document.body.classList.remove('game-mode');
    document.body.classList.add('landing-mode');

    // Disconnect observer
    if (gameStyleObserver) {
        gameStyleObserver.disconnect();
        gameStyleObserver = null;
    }

    // IMPORTANT: Do NOT remove Webpack-injected <style> tags.
    // Webpack caches lazy chunks and will NOT re-evaluate modules on re-entry,
    // so any CSS injected via static imports in lazy-loaded components (Navigation,
    // Grid, etc.) will be permanently lost if removed here.
    //
    // The body class switch from 'game-mode' to 'landing-mode' is sufficient to
    // scope game-specific CSS rules (most use .game-mode selectors).
    // CSS that doesn't use body class scoping is harmless to leave in the DOM
    // since it uses specific class selectors that won't match account/landing pages.

    // Reset any inline box-sizing that might have been globally applied
    document.documentElement.style.boxSizing = '';
    document.body.style.boxSizing = '';
};




// Schedule automatic backups for authenticated users
const scheduleAutomaticBackup = async (userId) => {
    try {
        // Import character store to get user's characters
        const { default: useCharacterStore } = await import('./store/characterStore');
        const characters = useCharacterStore.getState().characters || [];

        // Create automatic backups for all characters
        for (const [characterId, characterData] of Object.entries(characters)) {
            try {
                await characterBackupService.autoBackup(characterId, userId, characterData);
            } catch (error) {
                console.error(`Failed to backup character ${characterId}:`, error);
            }
        }

        console.log(`✅ Automatic backup completed for ${Object.keys(characters).length} characters`);
    } catch (error) {
        console.error('❌ Automatic backup failed:', error);
    }
};

// Loading fallback component
const LoadingFallback = ({ message = "Loading..." }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--pf-gradient-parchment)',
        color: 'var(--pf-text-primary)',
        fontFamily: 'Cinzel, serif',
        fontSize: '1.2rem'
    }}>
        {message}
    </div>
);

function GameScreen() {
    const location = useLocation();
    const { isGMMode, gridSize, gridOffsetX, gridOffsetY } = useGameStore();
    
    // Selectors for better performance - avoid re-rendering entire screen on unrelated store changes
    const setActiveCharacter = useCharacterStore(state => state.setActiveCharacter);
    const loadActiveCharacter = useCharacterStore(state => state.loadActiveCharacter);
    const createParty = usePartyStore(state => state.createParty);
    const leaveParty = usePartyStore(state => state.leaveParty);
    const isInParty = usePartyStore(state => state.isInParty);
    const partyMembers = usePartyStore(state => state.partyMembers);

    // Enable auto-save for local rooms
    const { forceSave, setLoading } = useLocalRoomAutoSave();
    const [currentLocalRoomId, setCurrentLocalRoomId] = useState(null);

    const initializePartyForCharacter = async (character, isGM = true) => {
        localStorage.removeItem('party-store');
        await leaveParty();

        await createParty('Single Player Party', true, {
            id: 'current-player',
            userId: 'current-player',
            isGM,
            name: character.name || 'Player',
            characterName: character.name || 'Player',
            characterClass: character.class || 'Unknown',
            characterLevel: character.level || 1
        });

        const { updatePartyMember } = usePartyStore.getState();
        const characterStore = useCharacterStore.getState();
        updatePartyMember('current-player', {
            id: 'current-player',
            name: character.name || 'Player',
            isGM,
            character: {
                class: character.class || characterStore.class || 'Unknown',
                level: character.level || characterStore.level || 1,
                health: character.health || characterStore.health || { current: 45, max: 50 },
                mana: character.mana || characterStore.mana || { current: 45, max: 50 },
                actionPoints: character.actionPoints || characterStore.actionPoints || { current: 1, max: 3 },
                race: character.race || characterStore.race || 'Unknown',
                raceDisplayName: character.raceDisplayName || characterStore.raceDisplayName || 'Unknown',
                background: character.background || characterStore.background || '',
                backgroundDisplayName: character.backgroundDisplayName || characterStore.backgroundDisplayName || '',
                path: character.path || characterStore.path || '',
                pathDisplayName: character.pathDisplayName || characterStore.pathDisplayName || '',
                classResource: character.classResource || characterStore.classResource,
                tokenSettings: character.tokenSettings || characterStore.tokenSettings || {},
                lore: character.lore || characterStore.lore || {}
            }
        }, true);
    };

    // Save when component unmounts (navigating away from game)
    useEffect(() => {
        return () => {
            // Force save when leaving the game screen
            if (forceSave) {
                forceSave();
            }
        };
    }, [forceSave]);

    // Initialize local room
    const initializeLocalRoom = async (roomId) => {
        try {
            // Explicitly reset targeting store when entering a new local room session
            if (useTargetingStore && useTargetingStore.getState) {
                useTargetingStore.getState().resetStore?.();
            }

            // Disable auto-save during loading to prevent race conditions
            setLoading(true);

            // Import services
            const { default: localRoomService } = await import('./services/localRoomService');
            const { default: roomStateService } = await import('./services/roomStateService');
            const { default: campaignService } = await import('./services/campaignService');

            // Load room data
            const room = localRoomService.getLocalRoom(roomId);
            if (!room) {
                console.error('Local room not found:', roomId);
                setLoading(false);
                return;
            }

            // Get campaign ID from room or current campaign
            const campaignId = room.campaignId || campaignService.getCurrentCampaignId();

            // Ensure GM mode is enabled for local rooms (user is always GM in local play)
            setGMMode(true);

            // Clear viewingFromToken so GM sees all tokens' combined vision (not restricted to one)
            const { default: levelEditorStore } = await import('./store/levelEditorStore');
            levelEditorStore.getState().setViewingFromToken(null);

            // Load room state using localRoomService (uses correct key prefix for local rooms)
            // This preserves all room content including tokens, terrain, walls, etc.
            const localGameState = localRoomService.loadRoomState(roomId);

            if (localGameState) {
                console.log('🎮 Loading local room game state:', {
                    hasTokens: !!localGameState.tokens,
                    tokensCount: Array.isArray(localGameState.tokens) ? localGameState.tokens.length : Object.keys(localGameState.tokens || {}).length,
                    hasGridItems: !!localGameState.gridItems,
                    gridItemsCount: localGameState.gridItems?.length || 0,
                    hasBackgrounds: !!localGameState.backgrounds,
                    backgroundsCount: localGameState.backgrounds?.length || 0,
                    hasLevelEditor: !!localGameState.levelEditor,
                    campaignId: campaignId
                });

                // Apply game state using the local room's stored data
                await applyLocalGameState(localGameState, roomId);
            } else {
                // Try roomStateService as fallback (for rooms migrated from older format)
                const roomState = roomStateService.loadRoomState(roomId);
                if (roomState) {
                    console.log('🎮 Loading room state from roomStateService (fallback)');
                    await roomStateService.applyRoomState(roomState);
                } else {
                    console.log('📝 No saved state for this room - starting fresh');
                }
            }

            // Load player-specific state if character is specified
            if (room.characterId) {
                const character = await loadActiveCharacter(room.characterId);
                if (character) {
                    await setActiveCharacter(character);
                    console.log('👤 Character loaded for local room:', character.name);

                    // Load player-specific state for this room
                    const playerState = roomStateService.loadPlayerState(roomId, character.id);
                    if (playerState) {
                        console.log('👤 Loading player state for character:', character.name);
                        await roomStateService.applyPlayerState(playerState, character.id);
                    }

                    // CRITICAL FIX: Create party with full character data for HUD display
                    await initializePartyForCharacter(character, true);
                    console.log('✅ Party created with character data for local room');
                }
            } else {
                // No character specified - create basic party for GM
                await leaveParty();
                await createParty('Single Player Party', true, {
                    isGM: true,
                    name: 'Game Master',
                    characterName: 'Game Master',
                    characterClass: 'Unknown',
                    characterLevel: 1
                });
            }

            // Re-enable auto-save after loading is complete
            setTimeout(() => {
                setLoading(false);
                console.log('✅ Room loading complete - auto-save re-enabled');
            }, 1000); // 1 second delay to ensure all state changes are settled

            // DON'T clear localStorage flags - we need them for saving!
            // The flags will be cleared when leaving the room
            console.log('✅ Local room initialized successfully - keeping room flags for saving');
        } catch (error) {
            console.error('❌ Error initializing local room:', error);
            setLoading(false); // Re-enable auto-save even if there's an error
        }
    };

    // Apply local game state to stores
    const applyLocalGameState = async (gameState, roomId) => {
        try {
            // Import stores
            const { default: useGameStore } = await import('./store/gameStore');
            const { default: useCreatureStore } = await import('./store/creatureStore');
            const { default: useLevelEditorStore } = await import('./store/levelEditorStore');
            const { default: useGridItemStore } = await import('./store/gridItemStore');

            // Apply game state to stores
            if (gameState.backgrounds) {
                useGameStore.getState().setBackgrounds(gameState.backgrounds);
            }

            // FIXED: Don't add creatures to global library - they should already be there
            // Instead, load tokens if they exist using the special loadToken method
            if (gameState.tokens && Array.isArray(gameState.tokens)) {
                gameState.tokens.forEach(token => {
                    // Use loadToken method which bypasses existing token checks
                    useCreatureStore.getState().loadToken(token);
                });
            } else if (gameState.tokens && typeof gameState.tokens === 'object') {
                // Handle legacy object format
                Object.values(gameState.tokens).forEach(token => {
                    useCreatureStore.getState().loadToken(token);
                });
            } else {
            }
            // Load grid items (dropped items on map)
            if (gameState.gridItems && Array.isArray(gameState.gridItems)) {
                gameState.gridItems.forEach(item => {
                    useGridItemStore.getState().loadGridItem(item);
                });
            } else if (gameState.inventory?.droppedItems) {
                // Legacy format fallback
                const droppedItems = Object.values(gameState.inventory.droppedItems);
                droppedItems.forEach(item => {
                    useGridItemStore.getState().loadGridItem(item);
                });
            }
            if (gameState.mapData) {
                const { cameraPosition, zoomLevel } = gameState.mapData;
                if (cameraPosition) {
                    useGameStore.getState().setCameraPosition(cameraPosition.x, cameraPosition.y);
                }
                if (zoomLevel) {
                    useGameStore.getState().setZoomLevel(zoomLevel);
                }
            }

            // Load level editor data if it exists
            const levelEditorStore = useLevelEditorStore.getState();
            let hasLevelEditorData = false;

            if (gameState.levelEditor) {
                const le = gameState.levelEditor;
                const batchData = {};
                if (le.terrainData) { batchData.terrainData = le.terrainData; hasLevelEditorData = true; }
                if (le.environmentalObjects) { batchData.environmentalObjects = le.environmentalObjects; hasLevelEditorData = true; }
                if (le.lightSources) { batchData.lightSources = le.lightSources; hasLevelEditorData = true; }
                if (le.wallData) { batchData.wallData = le.wallData; hasLevelEditorData = true; }
                if (le.dndElements) { batchData.dndElements = le.dndElements; hasLevelEditorData = true; }
                if (le.fogOfWarData) { batchData.fogOfWarData = le.fogOfWarData; hasLevelEditorData = true; }
                if (le.fogOfWarPaths !== undefined) { batchData.fogOfWarPaths = le.fogOfWarPaths; hasLevelEditorData = true; }
                if (le.fogErasePaths !== undefined) { batchData.fogErasePaths = le.fogErasePaths; hasLevelEditorData = true; }
                if (le.drawingPaths) { batchData.drawingPaths = le.drawingPaths; hasLevelEditorData = true; }
                if (le.drawingLayers) { batchData.drawingLayers = le.drawingLayers; hasLevelEditorData = true; }
                
                if (hasLevelEditorData) {
                    levelEditorStore.loadCompleteLevelEditorState(batchData);
                }
            }

            // Only use persistence service as fallback if main game state doesn't have level editor data
            // This prevents overwriting correctly loaded terrain data with potentially stale cache data
            // CRITICAL: Skip persistence service entirely for local rooms - they use localStorage directly
            const isLocalRoom = typeof window !== 'undefined' && localStorage.getItem('isLocalRoom') === 'true';
            if (!hasLevelEditorData && !isLocalRoom) {
                try {
                    const { default: levelEditorPersistenceService } = await import('./services/levelEditorPersistenceService');
                    const levelEditorData = levelEditorPersistenceService.loadLevelEditorState(roomId);
                    if (levelEditorData) {
                        if (Object.keys(levelEditorStore.terrainData || {}).length === 0) {
                            useLevelEditorStore.getState().loadMapState(levelEditorData);
                        } else {
                            const mergedTerrainData = { ...levelEditorStore.terrainData, ...(levelEditorData.terrainData || {}) };
                            levelEditorStore.loadCompleteLevelEditorState({
                                terrainData: mergedTerrainData,
                                environmentalObjects: levelEditorData.environmentalObjects,
                                lightSources: levelEditorData.lightSources,
                                wallData: levelEditorData.wallData,
                                dndElements: levelEditorData.dndElements,
                                fogOfWarData: levelEditorData.fogOfWarData,
                                fogOfWarPaths: levelEditorData.fogOfWarPaths,
                                fogErasePaths: levelEditorData.fogErasePaths,
                                drawingPaths: levelEditorData.drawingPaths,
                                drawingLayers: levelEditorData.drawingLayers
                            });
                        }
                    }
                } catch (error) {
                    console.warn('Could not load level editor persistence data:', error);
                }
            }

            console.log('✅ Local game state applied to stores');

            useLevelEditorStore.getState().applyTierFeatureFlags(
                useAuthStore.getState().user?.uid
            );
        } catch (error) {
            console.error('❌ Error applying local game state:', error);
        }
    };

    // Load game-specific styles when game screen is rendered
    useEffect(() => {
        loadGameStyles();
        initializePortalSystem();

        // Add game-mode class to body for CSS scoping
        document.body.classList.add('game-mode');
        document.body.classList.remove('landing-mode');

        // Cleanup when component unmounts
        return () => {
            cleanupGameStyles();
            // Reset targeting when leaving the game screen
            useTargetingStore.getState().resetStore?.();
        };
    }, []);

    // Handle character loading when entering the game
    useEffect(() => {
        // Don't auto-enable editor mode - let user open it manually if needed
        // Editor mode can be toggled via the Navigation component

        const initializeCharacter = async () => {
            try {
                // Check for local room first
                const isLocalRoom = localStorage.getItem('isLocalRoom') === 'true';
                const selectedLocalRoomId = localStorage.getItem('selectedLocalRoomId');

                if (isLocalRoom && selectedLocalRoomId) {
                    console.log('🏠 Loading local room:', selectedLocalRoomId);
                    // Clear world builder mode flag - local rooms are not world builder mode
                    localStorage.removeItem('isWorldBuilderMode');
                    // Disable editor mode for local rooms
                    const { default: useLevelEditorStore } = await import('./store/levelEditorStore');
                    const levelEditorStore = useLevelEditorStore.getState();
                    if (levelEditorStore.isEditorMode) {
                        levelEditorStore.setEditorMode(false);
                    }
                    setCurrentLocalRoomId(selectedLocalRoomId);
                    await initializeLocalRoom(selectedLocalRoomId);
                    return;
                }

                // Check if a specific character was passed via navigation state
                const characterId = location.state?.characterId;

                if (characterId) {
                    // Set this character as active
                    console.log(`🎮 Loading character from navigation: ${characterId}`);
                    const character = await setActiveCharacter(characterId);
                    if (character) {
                        console.log(`✅ Character loaded: ${character.name}`);
                        // Clear any existing party and create a single-player party with this character
                        localStorage.removeItem('party-store');
                        await leaveParty();

                        // FIXED: Correct argument order - (partyName, isGM, leaderData)
                        await createParty('Single Player Party', true, {
                            id: 'current-player',
                            userId: 'current-player',
                            isGM: true,
                            name: character.name,
                            characterName: character.name,
                            characterClass: character.class || 'Unknown',
                            characterLevel: character.level || 1
                        });

                        // CRITICAL FIX: Update party member with full character data for HUD
                        await initializePartyForCharacter(character, isGMMode);
                    } else {
                        console.error(`❌ Failed to load character: ${characterId}`);
                        // Fall back to loading any active character
                        await loadActiveCharacter();
                    }
                } else {
                    // No specific character passed, load the active character
                    const activeCharacter = await loadActiveCharacter();
                    if (activeCharacter) {
                        console.log(`✅ Active character loaded: ${activeCharacter.name}`);
                        
                        // PERFORMANCE FIX: Check if we are already in the correct party to avoid expensive flapping
                        const currentParty = usePartyStore.getState().currentParty;
                        const isAlreadyInSinglePlayerParty = isInParty && currentParty?.name === 'Single Player Party';
                        const isAlreadyCorrectCharacter = partyMembers.some(m => m.id === 'current-player' && m.characterName === activeCharacter.name);

                        if (!isAlreadyInSinglePlayerParty || !isAlreadyCorrectCharacter) {
                            console.log('🔄 Re-initializing party for new character...');
                            // Clear any existing party and create a single-player party with this character
                            localStorage.removeItem('party-store');
                            await leaveParty();

                            // FIXED: Correct argument order - (partyName, isGM, leaderData)
                            await createParty('Single Player Party', true, {
                                id: 'current-player',
                                userId: 'current-player',
                                isGM: true,
                                name: activeCharacter.name,
                                characterName: activeCharacter.name,
                                characterClass: activeCharacter.class || 'Unknown',
                                characterLevel: activeCharacter.level || 1
                            });

                            // CRITICAL FIX: Update party member with full character data for HUD
                            await initializePartyForCharacter(activeCharacter, isGMMode);
                        } else {
                            console.log('✅ Already in correct party, skipping re-initialization');
                        }
                    } else {
                        console.log('No active character found');
                        // Create a basic single-player party even without a character
                        localStorage.removeItem('party-store');
                        await leaveParty();

                        // FIXED: Correct argument order - (partyName, isGM, leaderData)
                        await createParty('Single Player Party', true, {
                            isGM: true,
                            name: 'Player',
                            characterName: 'Player',
                            characterClass: 'Unknown',
                            characterLevel: 1
                        });

                        // Update with basic GM data
                        const { updatePartyMember } = usePartyStore.getState();
                        updatePartyMember('current-player', {
                            id: 'current-player',
                            name: 'Player',
                            isGM: isGMMode,
                            character: {
                                class: 'Unknown',
                                level: 1,
                                health: { current: 45, max: 50 },
                                mana: { current: 45, max: 50 },
                                actionPoints: { current: 1, max: 3 }
                            }
                        }, true);
                    }
                }
            } catch (error) {
                console.error('Error initializing character:', error);
            }
        };

        initializeCharacter();
    }, [location.state?.characterId, setActiveCharacter, loadActiveCharacter]);

    // Update current player's GM status when GM mode changes
    useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
        const { updatePartyMember, partyMembers } = usePartyStore.getState();
        const currentPlayer = partyMembers.find(m => m.id === 'current-player');
        if (currentPlayer) {
            updatePartyMember('current-player', { isGM: isGMMode });
        }
    }, [isGMMode]);

    return (
        <ErrorBoundary name="GameScreen">
            <div className="game-screen">
                <ErrorBoundary name="CombatSystem">
                    <FloatingCombatTextManager />
                </ErrorBoundary>
                <Suspense fallback={<LoadingFallback message="Loading game..." />}>
                    <ErrorBoundary name="Grid">
                        <Grid />
                    </ErrorBoundary>
                    <ErrorBoundary name="GridItems">
                        <GridItemsManager />
                    </ErrorBoundary>
                    <ErrorBoundary name="Achievements">
                        <AchievementNotificationOverlay />
                    </ErrorBoundary>
                    <ErrorBoundary name="HUD">
                        <HUDContainer />
                    </ErrorBoundary>
                    <ErrorBoundary name="ActionBar">
                        <ActionBar />
                    </ErrorBoundary>
                    <ErrorBoundary name="CombatSelection">
                        <CombatSelectionWindow />
                    </ErrorBoundary>
                    <ErrorBoundary name="CombatTimeline">
                        <CombatTimeline />
                    </ErrorBoundary>
                    {/* Keep all managers mounted but conditionally active to prevent loading flashes */}
                    {isGMMode && (
                        <>
                            <ErrorBoundary name="DynamicFog">
                                <DynamicFogManager disabled={!isGMMode} />
                            </ErrorBoundary>
                            <ErrorBoundary name="DynamicLighting">
                                <DynamicLightingManager disabled={!isGMMode} />
                            </ErrorBoundary>
                            <ErrorBoundary name="AtmosphericEffects">
                                <AtmosphericEffectsManager />
                            </ErrorBoundary>
                        </>
                    )}
                    <ErrorBoundary name="MemorySnapshot">
                        <MemorySnapshotManager isGMMode={isGMMode} gridSize={gridSize} gridOffsetX={gridOffsetX} gridOffsetY={gridOffsetY} />
                    </ErrorBoundary>
                    <ErrorBoundary name="Dialogue">
                        <DialogueSystem />
                        {isGMMode && <DialogueControls />}
                    </ErrorBoundary>
                    <ErrorBoundary name="DiceRolling">
                        <DiceRollingSystem />
                    </ErrorBoundary>
                    <ErrorBoundary name="AudioPlayerWidget">
                        <AudioPlayerWidget />
                    </ErrorBoundary>
                </Suspense>

            </div>
        </ErrorBoundary>
    );
}

// Level-Up Modal Wrapper Component
function LevelUpChoiceModalWrapper() {
    const showLevelUpModal = useCharacterStore(state => state.showLevelUpModal);
    const pendingLevelUpInfo = useCharacterStore(state => state.pendingLevelUpInfo);
    const characterClass = useCharacterStore(state => state.class);
    const knownSpells = useCharacterStore(state => state.class_spells?.known_spells || []);
    const handleLevelUpChoice = useCharacterStore(state => state.handleLevelUpChoice);

    const handleClose = () => {
        useCharacterStore.setState({ showLevelUpModal: false, pendingLevelUpInfo: null });
    };

    if (!showLevelUpModal || !pendingLevelUpInfo) {
        return null;
    }

    return (
        <LevelUpChoiceModal
            isOpen={showLevelUpModal}
            onClose={handleClose}
            characterClass={characterClass}
            currentLevel={pendingLevelUpInfo.newLevel}
            knownSpells={knownSpells}
            onChoiceSelected={handleLevelUpChoice}
        />
    );
}

export default function App() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [loginTransition, setLoginTransition] = useState(null);

    // Authentication store
    const { initializeAuth, refreshAuthState, isAuthenticated, user, isAuthInitialized } = useAuthStore();

    // Initialize authentication and stores
    useEffect(() => {
        // Initialize portals for production
        initializePortalSystem();

        // Initialize offline support (will be set up when user logs in)
        // This will be called in the auth state change handler

        // Initialize performance monitoring
        initializePerformanceMonitoring();

        // Global safety check for undefined variables that might cause ReferenceError
        if (typeof window !== 'undefined') {
            // Add global error handler for ReferenceError
            window.addEventListener('error', (event) => {
                if (event.error && event.error.message && event.error.message.includes('title is not defined')) {
                    console.error('🚨 CAUGHT TITLE REFERENCE ERROR:', {
                        message: event.error.message,
                        filename: event.filename,
                        lineno: event.lineno,
                        colno: event.colno,
                        stack: event.error.stack
                    });
                    // Prevent the error from crashing the app
                    event.preventDefault();
                    return false;
                }
            });
        }

        initChatStore();
        initCreatureStore();

        // Clean up any duplicate creatures that might exist
        // Deferred to 2.5s — after auth and creature store are settled
        setTimeout(() => {
            removeDuplicateCreatures();
        }, 2500);

        // Migrate creature icons — deferred to idle time (non-blocking).
        // Uses requestIdleCallback so the browser picks a quiet moment, with a
        // 5-second hard deadline to ensure it runs even on busy pages.
        // The migration itself is also version-gated and skips if already done.
        const scheduleIconMigration = () => {
            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(() => {
                    import('./utils/migrateCreatureIcons').then(({ runCreatureIconMigration }) => {
                        runCreatureIconMigration();
                    }).catch(error => {
                        console.error('Failed to run creature icon migration:', error);
                    });
                }, { timeout: 5000 });
            } else {
                // Fallback for browsers without requestIdleCallback
                setTimeout(() => {
                    import('./utils/migrateCreatureIcons').then(({ runCreatureIconMigration }) => {
                        runCreatureIconMigration();
                    }).catch(error => {
                        console.error('Failed to run creature icon migration:', error);
                    });
                }, 5000);
            }
        };
        scheduleIconMigration();

        // Clear old hardcoded spells from library (only if old spells exist)
        const wasCleared = initializeCleanSpellLibrary();

        // Only force clear if we detected old hardcoded spells
        if (wasCleared) {
            console.log('🔄 Cleared old hardcoded spells - users will start fresh');
        }

        // Set initial landing mode class
        document.body.classList.add('landing-mode');
        document.body.classList.remove('game-mode');

        // Initialize Firebase auth state listener (only if Firebase is configured)
        let unsubscribe = null;
        try {
            console.log('🔄 Starting authentication initialization...');
            unsubscribe = initializeAuth();

            // Refresh auth state to ensure consistency after initialization.
            // Staggered to 1.5s (separate window from the 2.5s creature cleanup)
            setTimeout(async () => {
                await refreshAuthState();
            }, 1500);
        } catch (error) {
            console.warn('Authentication initialization failed:', error);
            // CRITICAL FIX: Even if Firebase auth fails, mark auth as initialized
            // This prevents the app from getting stuck on the loading screen
            setTimeout(() => {
                console.log('🔄 Fallback: Marking auth as initialized after error');
                useAuthStore.getState().setIsAuthInitialized(true);
            }, 100);
        }

        // EXTRA SAFETY: Always mark auth as initialized after a reasonable timeout
        // This ensures the app never gets stuck, even if all other initialization fails
        setTimeout(() => {
            const authState = useAuthStore.getState();
            if (!authState.isAuthInitialized) {
                console.log('🔄 Safety timeout: Force marking auth as initialized');
                useAuthStore.getState().setIsAuthInitialized(true);
            }
        }, 3000); // 3 second absolute timeout

        // Schedule automatic backups for authenticated users
        const backupInterval = setInterval(async () => {
            try {
                const { user, isAuthenticated } = useAuthStore.getState();
                if (isAuthenticated && user && !user.isGuest) {
                    await scheduleAutomaticBackup(user.uid);
                }
            } catch (error) {
                console.error('Automatic backup failed:', error);
            }
        }, 24 * 60 * 60 * 1000); // Check daily

        // Add keyboard shortcut for performance dashboard (Ctrl+Shift+P)
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'P') {
                // Restricted to Game Masters only
                const { isGMMode } = useGameStore.getState();
                if (!isGMMode) return;

                event.preventDefault();
                setShowPerformanceDashboard(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Prevent default browser context menu globally
        // Custom context menus will still work as they use React's synthetic event system
        const handleContextMenu = (event) => {
            event.preventDefault();
        };
        document.addEventListener('contextmenu', handleContextMenu);

        // Cleanup on unmount
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
            clearInterval(backupInterval);
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    // Global condition cleanup - runs every second to remove expired buffs/debuffs
    // This ensures conditions are cleaned up even when TargetHUD/PartyHUD aren't mounted
    useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
        const { updateBuffTimers } = useBuffStore.getState();
        const { updateDebuffTimers } = useDebuffStore.getState();
        const useCreatureStore = require('./store/creatureStore').default;
        const { cleanupExpiredConditions: cleanupCreatureConditions } = useCreatureStore.getState();
        const useCharacterTokenStore = require('./store/characterTokenStore').default;
        const { cleanupExpiredConditions: cleanupCharacterConditions } = useCharacterTokenStore.getState();

        const cleanupInterval = setInterval(() => {
            updateBuffTimers();
            updateDebuffTimers();
            cleanupCreatureConditions();
            cleanupCharacterConditions();
        }, 1000);

        return () => clearInterval(cleanupInterval);
    }, []);

    // Start real-time effect processing for DOT/HOT that use "Real-Time (Always)" tick setting
    useEffect(() => {
        let stopRealtimeEffectProcessing = null;

        // Import dynamically to avoid circular dependencies
        import('./services/effectProcessingService').then(({ startRealtimeEffectProcessing, stopRealtimeEffectProcessing: stop }) => {
            startRealtimeEffectProcessing();
            stopRealtimeEffectProcessing = stop;
        });

        // Cleanup on unmount
        return () => {
            if (stopRealtimeEffectProcessing) {
                stopRealtimeEffectProcessing();
            }
        };
    }, []);



    const handleReturnToLanding = () => {
        // This will be handled by the navigate function in AppContent
        // since we need access to the navigate hook
    };

    // Authentication handlers
    const handleShowLogin = () => {
        setAuthMode('login');
        setShowAuthModal(true);
    };

    const handleShowRegister = () => {
        setAuthMode('register');
        setShowAuthModal(true);
    };

    const handleShowUserProfile = () => {
        setShowUserProfile(true);
    };

    const handleCloseAuthModal = () => {
        setShowAuthModal(false);
        setAuthMode('login');
    };

    const handleLoginTransition = () => {
        setShowAuthModal(false);
        setLoginTransition('entering');
    };

    const handleCloseUserProfile = () => {
        setShowUserProfile(false);
    };

    // Show loading screen until authentication is initialized
    if (!isAuthInitialized) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'var(--pf-gradient-parchment)',
                color: 'var(--pf-text-primary)',
                fontFamily: 'Cinzel, serif',
                fontSize: '1.2rem'
            }}>
                Initializing authentication...
            </div>
        );
    }

    return (
        <PersistenceProvider>
            <GameProvider>
                <RoomProvider>
                    <SpellLibraryProvider>
                        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                            <AppContent
                                isAuthenticated={isAuthenticated}
                                user={user}
                                showAuthModal={showAuthModal}
                                authMode={authMode}
                                showUserProfile={showUserProfile}
                                showPerformanceDashboard={showPerformanceDashboard}
                                setShowPerformanceDashboard={setShowPerformanceDashboard}
                                handleShowLogin={handleShowLogin}
                                handleShowRegister={handleShowRegister}
                                handleShowUserProfile={handleShowUserProfile}
                                handleCloseAuthModal={handleCloseAuthModal}
                                handleLoginTransition={handleLoginTransition}
                                loginTransition={loginTransition}
                                setLoginTransition={setLoginTransition}
                                handleCloseUserProfile={handleCloseUserProfile}
                                handleReturnToLanding={handleReturnToLanding}
                            />
                        </Router>
                    </SpellLibraryProvider>
                </RoomProvider>
            </GameProvider>
        </PersistenceProvider>
    );
}

function LoginTransitionOverlay({ onComplete }) {
    const [phase, setPhase] = useState('entering');
    const navigate = useNavigate();

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('showing'), 50);
        const t2 = setTimeout(() => setPhase('exiting'), 1400);
        const t3 = setTimeout(() => {
            setPhase('complete');
            onComplete();
            navigate('/account');
        }, 2000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [navigate, onComplete]);

    return (
        <div className={`login-transition-overlay ${phase}`}>
            <div className="login-transition-glow" />
            <div className="login-transition-particles">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="login-transition-particle" />
                ))}
            </div>
            <div className="login-transition-content">
                <div className="login-transition-icon">
                    <i className="fas fa-compass" />
                </div>
                <h1 className="login-transition-title">MYTHRILL</h1>
                <div className="login-transition-line" />
                <p className="login-transition-subtitle">Your adventure awaits</p>
            </div>
        </div>
    );
}

// Component that uses navigate hook - must be inside Router
const AppContent = ({
    isAuthenticated,
    user,
    showAuthModal,
    authMode,
    showUserProfile,
    showPerformanceDashboard,
    setShowPerformanceDashboard,
    handleShowLogin,
    handleShowRegister,
    handleShowUserProfile,
    handleCloseAuthModal,
    handleLoginTransition,
    loginTransition,
    setLoginTransition,
    handleCloseUserProfile,
    handleReturnToLanding
}) => {
    const navigate = useNavigate();

    // Initialize idle detection for automatic status updates
    useIdleDetection();

    // Initialize comprehensive session management
    useSessionManagement();

    // Initialize offline support and analytics when user is authenticated
    React.useEffect(() => {
        if (isAuthenticated && user && !user.isGuest) {
            initializeOfflineSupport(user.uid);
            initializeAnalytics(user.uid);
        }
    }, [isAuthenticated, user]);

    const handleEnterSinglePlayer = async () => {
        // Clear any existing room flags - this is world builder mode (sandbox/testing)
        localStorage.removeItem('isLocalRoom');
        localStorage.removeItem('selectedLocalRoomId');
        localStorage.removeItem('selectedRoomId');
        localStorage.removeItem('isTestRoom');

        // Mark this as world builder mode
        localStorage.setItem('isWorldBuilderMode', 'true');

        // Ensure GM mode for world builder (user is always GM in sandbox mode)
        const { default: gameStore } = await import('./store/gameStore');
        gameStore.getState().setGMMode(true);

        // Don't auto-enable editor mode - let user open it manually if needed
        const { default: useLevelEditorStore } = await import('./store/levelEditorStore');
        useLevelEditorStore.getState().setEditorMode(false);

        // Clear map state for fresh world builder experience
        try {
            const { default: roomStateService } = await import('./services/roomStateService');
            roomStateService.clearRoomStateForWorldBuilder();
        } catch (err) {
            console.warn('Could not clear state for world builder:', err);
        }

        navigate('/game');
    };

    const handleEnterMultiplayer = () => {
        navigate('/multiplayer');
    };

    // Updated handleReturnToLanding to use React Router navigation
    const handleReturnToLandingWithNavigation = () => {
        // Navigate to landing page when escape key is pressed or leave button is clicked
        navigate('/', { replace: true });
    };

    return (
        <>
            <Routes>
                {/* Landing page route - accessible to both authenticated and unauthenticated users */}
                <Route path="/" element={
                    <LandingPage
                        onEnterSinglePlayer={handleEnterSinglePlayer}
                        onEnterMultiplayer={handleEnterMultiplayer}
                        onShowLogin={handleShowLogin}
                        onShowRegister={handleShowRegister}
                        onShowUserProfile={handleShowUserProfile}
                        isAuthenticated={isAuthenticated}
                        user={user}
                    />
                } />

                {/* Account management routes */}
                <Route path="/account" element={
                    (() => {
                        return isAuthenticated ? (
                            <Suspense fallback={<LoadingFallback message="Loading account..." />}>
                                <ErrorBoundary name="AccountDashboard">
                                    <AccountDashboard user={user} />
                                </ErrorBoundary>
                            </Suspense>
                        ) : (
                            <Navigate to="/" replace />
                        );
                    })()
                } />

                <Route path="/account/characters" element={
                    isAuthenticated ? (
                        <Suspense fallback={<LoadingFallback message="Loading characters..." />}>
                            <CharacterManagement user={user} />
                        </Suspense>
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                <Route path="/account/characters/create" element={
                    isAuthenticated ? (
                        <Suspense fallback={<LoadingFallback message="Loading character creation..." />}>
                            <ErrorBoundary name="CharacterCreation">
                                <CharacterCreationPage user={user} />
                            </ErrorBoundary>
                        </Suspense>
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                <Route path="/account/characters/edit/:characterId" element={
                    isAuthenticated ? (
                        <Suspense fallback={<LoadingFallback message="Loading character editor..." />}>
                            <ErrorBoundary name="CharacterEditor">
                                <CharacterCreationPage user={user} isEditing={true} />
                            </ErrorBoundary>
                        </Suspense>
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                <Route path="/account/characters/view/:characterId" element={
                    isAuthenticated ? (
                        <Suspense fallback={<LoadingFallback message="Loading character..." />}>
                            <CharacterViewPage />
                        </Suspense>
                    ) : (
                        <Navigate to="/" replace />
                    )
                } />

                {/* Game routes */}
                <Route path="/game" element={
                    <div className="spell-wizard-container">
                        <GameScreen />
                        <Suspense fallback={<LoadingFallback message="Loading navigation..." />}>
                            <Navigation
                                onReturnToLanding={handleReturnToLandingWithNavigation}
                                onShowLogin={handleShowLogin}
                                onShowUserProfile={handleShowUserProfile}
                                isAuthenticated={isAuthenticated}
                                user={user}
                            />
                        </Suspense>
                    </div>
                } />

                <Route path="/multiplayer/:roomCode?" element={
                    <Suspense fallback={<LoadingFallback message="Loading multiplayer..." />}>
                        <ErrorBoundary name="MultiplayerApp">
                            <MultiplayerApp
                                onReturnToSinglePlayer={handleReturnToLandingWithNavigation}
                                onShowLogin={handleShowLogin}
                                onShowUserProfile={handleShowUserProfile}
                                isAuthenticated={isAuthenticated}
                                user={user}
                            />
                        </ErrorBoundary>
                    </Suspense>
                } />

                {/* Test routes */}
                <Route path="/test/triggers" element={
                    <Suspense fallback={<LoadingFallback message="Loading test..." />}>
                        <TestTriggerDisplay />
                    </Suspense>
                } />


                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Global modals */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={handleCloseAuthModal}
                onLoginTransition={handleLoginTransition}
                initialMode={authMode}
            />

            <UserProfile
                isOpen={showUserProfile}
                onClose={handleCloseUserProfile}
            />

            {/* Level-Up Choice Modal */}
            <LevelUpChoiceModalWrapper />

            {/* Performance Dashboard */}
            <PerformanceDashboard
                isOpen={showPerformanceDashboard}
                onClose={() => setShowPerformanceDashboard(false)}
            />

            {/* Social Notifications (Invitations) */}
            <SocialNotificationLayer />

            {/* Global Socket Management */}
            <GlobalSocketManager />

            {/* Login Transition Overlay */}
            {loginTransition && (
                <LoginTransitionOverlay onComplete={() => setLoginTransition(null)} />
            )}
        </>
    );
};