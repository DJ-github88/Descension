import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Creature, Ability, creatureTypes, abilityTypes } from "../game/creatures";

const initialState = {
    creatures: [],
    tokens: [],
    inCombat: false,
    currentTurn: null,
    turnOrder: [],
    selectedCreature: null,
    targetedCreature: null,

    // Global GM/Player mode for controlling access to features
    isGMMode: true, // GM can see all features, Player mode restricts access

    // Multiplayer state
    isInMultiplayer: false,
    multiplayerRoom: null,
    onLeaveMultiplayer: null, // Function to call when leaving multiplayer
    multiplayerSocket: null, // Socket connection for real-time sync

    // Enhanced background system - support for multiple layers
    backgrounds: [], // [{ id, url, position: {x, y}, scale, opacity, zIndex, name, sticksToGrid }]
    activeBackgroundId: null,

    // Legacy background support (for backwards compatibility)
    backgroundImage: null,
    backgroundImageUrl: '',

    // Unified grid and camera system
    gridSize: 50,
    gridOffsetX: 0,
    gridOffsetY: 0,
    gridLineColor: 'rgba(212, 175, 55, 0.8)', // D&D gold color, much more visible
    gridLineThickness: 2, // Thicker lines for better visibility
    gridLineOpacity: 0.8, // Separate opacity control for grid lines
    gridMovesWithBackground: false, // Whether grid moves with background or stays on top

    // Camera and zoom (moved from level editor store)
    cameraX: 0,
    cameraY: 0,
    zoomLevel: 1.0, // GM-controlled base zoom level
    minZoom: 0.3, // Further increased to prevent grid combining
    maxZoom: 5.0,

    // Player navigation zoom (separate from GM zoom)
    playerZoom: 1.0,
    minPlayerZoom: 0.6, // Further increased to prevent grid combining
    maxPlayerZoom: 4.0,

    // Grid rendering settings
    showGrid: true,
    gridExtent: 10000, // Performance optimization - not used for infinite grid bounds

    // Grid alignment mode for direct grid interaction
    isGridAlignmentMode: false,
    gridAlignmentStep: 0, // 0: not active, 1: first rectangle, 2: second rectangle, 3: apply
    gridAlignmentRectangles: [], // Store drawn rectangles for multi-step alignment

    // Background manipulation mode for resizing and moving backgrounds
    isBackgroundManipulationMode: false,

    // Window scaling system
    windowScale: 1.0,
    minWindowScale: 0.5,
    maxWindowScale: 1.5,

    // Movement and distance settings
    feetPerTile: 5, // How many feet each grid tile represents

    // Movement visualization settings
    showMovementVisualization: true,
    movementLineColor: '#FFD700', // Gold color for movement lines
    movementLineWidth: 3,
    movementLineDashArray: '8,4', // Dotted line pattern
};

// Handle storage quota exceeded for game store
const handleGameStoreQuotaExceeded = (name, value) => {
    try {
        console.log('Attempting to handle game store quota exceeded...');

        // Try to clean up other stores first
        const keysToClean = [];
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key !== name) {
                if (key.includes('temp-') || key.includes('cache-') || key.includes('backup-')) {
                    keysToClean.push(key);
                }
            }
        }

        keysToClean.forEach(key => {
            localStorage.removeItem(key);
            console.log(`Removed temporary storage key: ${key}`);
        });

        // Try to optimize the game store data
        try {
            // Remove large background image data if present
            const optimizedValue = {
                ...value,
                backgroundImage: null, // Remove large background image data
                backgroundImageUrl: value.backgroundImageUrl || '', // Keep URL reference
                // Keep other essential data
                creatures: (value.creatures || []).slice(0, 50), // Limit creatures
                tokens: (value.tokens || []).slice(0, 50), // Limit tokens
                items: (value.items || []).slice(0, 100), // Limit items
                containers: (value.containers || []).slice(0, 20) // Limit containers
            };

            const optimizedJson = JSON.stringify(optimizedValue);
            localStorage.setItem(name, optimizedJson);
            console.log('Successfully saved optimized game store data');

            if (window.alert) {
                alert('Storage space was running low. Background image data has been optimized. You may need to re-set your background image.');
            }
            return;
        } catch (optimizeError) {
            console.error('Error optimizing game store data:', optimizeError);
        }

        // Last resort: save minimal game store data
        try {
            const minimalValue = {
                // Keep only essential game state
                cameraX: value.cameraX || 0,
                cameraY: value.cameraY || 0,
                zoomLevel: value.zoomLevel || 1.0,
                playerZoom: value.playerZoom || 1.0,
                gridSize: value.gridSize || 50,
                gridOffsetX: value.gridOffsetX || 0,
                gridOffsetY: value.gridOffsetY || 0,
                gridLineColor: value.gridLineColor || 'rgba(212, 175, 55, 0.8)',
                gridLineThickness: value.gridLineThickness || 2,
                windowScale: value.windowScale || 1.0,
                // Remove all large data
                backgroundImage: null,
                backgroundImageUrl: '',
                creatures: [],
                tokens: [],
                items: [],
                containers: [],
                backgrounds: []
            };

            const minimalJson = JSON.stringify(minimalValue);
            localStorage.setItem(name, minimalJson);

            if (window.alert) {
                alert('Storage space was critically low. Only essential game settings have been preserved. You will need to re-add background images and game entities.');
            }
        } catch (minimalError) {
            if (window.alert) {
                alert('Critical storage error in game store. Please refresh the page and consider clearing browser data.');
            }
        }
    } catch (error) {
        // Error in handleGameStoreQuotaExceeded
    }
};

const useGameStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // Initialize store
            initializeStore: () => {
                set({
                    creatures: [],
                    tokens: []
                });
            },

            // REMOVED: updateTokenPosition - deprecated function removed
            // All token position updates should go through creatureStore

            // Remove token
            removeToken: (creatureId) => {
                set(state => ({
                    tokens: state.tokens.filter(token => token.creatureId !== creatureId)
                }));
            },

            // Add new creature with optional abilities
            addCreature: (name, type, abilities = []) => {
                const creature = new Creature(name, type);
                abilities.forEach(ability => creature.addAbility(ability));

                set(state => {
                    // Check if creature already exists
                    if (state.creatures.some(c => c.id === creature.id)) {
                        return state;
                    }

                    return {
                        creatures: [...state.creatures, creature],
                        tokens: [
                            ...state.tokens,
                            {
                                creatureId: creature.id,
                                position: { x: 100, y: 100 }
                            }
                        ]
                    };
                });
            },

            // Update creature stats
            updateCreature: (id, updates) => {
                set(state => ({
                    creatures: state.creatures.map(c =>
                        c.id === id ? { ...c, ...updates } : c
                    )
                }));
            },

            // Add ability to creature
            addAbilityToCreature: (creatureId, ability) => {
                const state = get();
                const creature = state.creatures.find(c => c.id === creatureId);
                if (creature && !creature.abilities.some(a => a.id === ability.id)) {
                    creature.addAbility(ability);
                    set({
                        creatures: state.creatures.map(c =>
                            c.id === creatureId ? creature : c
                        )
                    });
                }
            },

            // Use ability
            useAbility: (creatureId, abilityId, targetId) => {
                const state = get();
                const creature = state.creatures.find(c => c.id === creatureId);
                const target = state.creatures.find(c => c.id === targetId);
                const ability = creature?.abilities.find(a => a.id === abilityId);

                if (!creature || !target || !ability || !ability.canUse(creature)) {
                    return;
                }

                const damage = ability.calculateDamage(creature, target);
                const healing = ability.calculateHealing(creature);

                set(state => ({
                    creatures: state.creatures.map(c => {
                        if (c.id === targetId) {
                            c.takeDamage(damage);
                        }
                        if (c.id === creatureId && healing > 0) {
                            c.heal(healing);
                        }
                        return c;
                    })
                }));
            },

            // Start combat
            startCombat: (combatantIds) => {
                const state = get();
                const combatants = state.creatures.filter(c =>
                    combatantIds.includes(c.id)
                );

                if (combatants.length === 0) return;

                const turnOrder = combatants
                    .map(c => ({
                        id: c.id,
                        initiative: c.rollInitiative()
                    }))
                    .sort((a, b) => b.initiative - a.initiative);

                set({
                    inCombat: true,
                    turnOrder,
                    currentTurn: turnOrder[0]?.id
                });
            },

            // End current turn
            endTurn: () => {
                const state = get();
                if (!state.inCombat || state.turnOrder.length === 0) return;

                const currentIndex = state.turnOrder.findIndex(
                    c => c.id === state.currentTurn
                );
                const nextIndex = (currentIndex + 1) % state.turnOrder.length;
                const nextCreature = state.creatures.find(
                    c => c.id === state.turnOrder[nextIndex].id
                );

                if (nextCreature) {
                    nextCreature.resetActionPoints();
                    set({ currentTurn: state.turnOrder[nextIndex].id });
                }
            },

            // End combat
            endCombat: () => {
                set({
                    inCombat: false,
                    turnOrder: [],
                    currentTurn: null
                });
            },

            // Legacy background image management (for backwards compatibility)
            setBackgroundImage: (imageData) => {
                set({ backgroundImage: imageData });
            },

            setBackgroundImageUrl: (url) => {
                set({ backgroundImageUrl: url });
            },

            // Enhanced background management
            addBackground: (backgroundData) => {
                const state = get();
                const newBackground = {
                    id: Date.now().toString(),
                    position: { x: 0, y: 0 },
                    scale: 1.0,
                    opacity: 1.0,
                    rotation: 0, // Default rotation
                    zIndex: state.backgrounds.length,
                    name: `Background ${state.backgrounds.length + 1}`,
                    sticksToGrid: false, // Default to static background
                    ...backgroundData
                };
                set({
                    backgrounds: [...state.backgrounds, newBackground],
                    activeBackgroundId: newBackground.id
                });
                return newBackground.id;
            },

            removeBackground: (backgroundId) => {
                const state = get();
                const newBackgrounds = state.backgrounds.filter(bg => bg.id !== backgroundId);
                set({
                    backgrounds: newBackgrounds,
                    activeBackgroundId: state.activeBackgroundId === backgroundId
                        ? (newBackgrounds.length > 0 ? newBackgrounds[0].id : null)
                        : state.activeBackgroundId
                });
            },

            updateBackground: (backgroundId, updates) => {
                const state = get();
                set({
                    backgrounds: state.backgrounds.map(bg =>
                        bg.id === backgroundId ? { ...bg, ...updates } : bg
                    )
                });
            },

            setActiveBackground: (backgroundId) => {
                set({ activeBackgroundId: backgroundId });
            },

            reorderBackground: (backgroundId, newZIndex) => {
                const state = get();
                set({
                    backgrounds: state.backgrounds.map(bg =>
                        bg.id === backgroundId ? { ...bg, zIndex: newZIndex } : bg
                    )
                });
            },

            // Grid size management
            setGridSize: (size) => {
                set({ gridSize: size });
            },

            // Grid offset management
            setGridOffset: (offsetX, offsetY) => {
                set({
                    gridOffsetX: offsetX,
                    gridOffsetY: offsetY
                });
            },

            resetGridOffset: () => {
                set({
                    gridOffsetX: 0,
                    gridOffsetY: 0
                });
            },

            // Grid line color management
            setGridLineColor: (color) => {
                set({ gridLineColor: color });
            },

            // Grid line thickness management
            setGridLineThickness: (thickness) => {
                set({ gridLineThickness: thickness });
            },

            // Grid line opacity management
            setGridLineOpacity: (opacity) => {
                set({ gridLineOpacity: opacity });
            },

            // Grid positioning management
            setGridMovesWithBackground: (movesWithBackground) => {
                set({ gridMovesWithBackground: movesWithBackground });
            },



            // Camera and zoom management
            setCameraPosition: (x, y) => {
                set({ cameraX: x, cameraY: y });
            },

            moveCameraBy: (deltaX, deltaY) => {
                const state = get();
                set({
                    cameraX: state.cameraX + deltaX,
                    cameraY: state.cameraY + deltaY
                });
            },

            setZoomLevel: (zoom) => {
                const state = get();
                const clampedZoom = Math.max(state.minZoom, Math.min(state.maxZoom, zoom));
                set({ zoomLevel: clampedZoom });
            },

            zoomIn: () => {
                const state = get();
                const newZoom = state.zoomLevel * 1.25;
                const clampedZoom = Math.min(state.maxZoom, newZoom);
                set({ zoomLevel: clampedZoom });
            },

            zoomOut: () => {
                const state = get();
                const newZoom = state.zoomLevel / 1.25;
                const clampedZoom = Math.max(state.minZoom, newZoom);
                set({ zoomLevel: clampedZoom });
            },

            resetZoom: () => {
                set({ zoomLevel: 1.0 });
            },

            resetCamera: () => {
                set({ cameraX: 0, cameraY: 0, zoomLevel: 1.0, playerZoom: 1.0 });
            },

            // Player zoom management (separate from GM zoom)
            setPlayerZoom: (zoom) => {
                const state = get();
                const clampedZoom = Math.max(state.minPlayerZoom, Math.min(state.maxPlayerZoom, zoom));
                set({ playerZoom: clampedZoom });
            },

            playerZoomIn: () => {
                const state = get();
                const newZoom = state.playerZoom * 1.25;
                const clampedZoom = Math.min(state.maxPlayerZoom, newZoom);
                set({ playerZoom: clampedZoom });
            },

            playerZoomOut: () => {
                const state = get();
                const newZoom = state.playerZoom / 1.25;
                const clampedZoom = Math.max(state.minPlayerZoom, newZoom);
                set({ playerZoom: clampedZoom });
            },

            resetPlayerZoom: () => {
                set({ playerZoom: 1.0 });
            },

            // Get effective zoom (GM zoom * player zoom)
            getEffectiveZoom: () => {
                const state = get();
                return state.zoomLevel * state.playerZoom;
            },

            // Grid display management
            setShowGrid: (show) => {
                set({ showGrid: show });
            },

            setGridExtent: (extent) => {
                set({ gridExtent: extent });
            },

            // Short Rest - Recover some resources
            takeShortRest: () => {
                set(state => ({
                    creatures: state.creatures.map(creature => {
                        // Recover some health (1/4 of max)
                        const healthRecovery = Math.floor(creature.maxHealth / 4);
                        const newHealth = Math.min(creature.health + healthRecovery, creature.maxHealth);

                        // Recover some mana/resources (1/2 of max)
                        const manaRecovery = Math.floor(creature.maxMana / 2);
                        const newMana = Math.min(creature.mana + manaRecovery, creature.maxMana);

                        // Reset action points
                        const newActionPoints = creature.maxActionPoints;

                        return {
                            ...creature,
                            health: newHealth,
                            mana: newMana,
                            actionPoints: newActionPoints
                        };
                    })
                }));
            },

            // Long Rest - Fully recover all resources
            takeLongRest: () => {
                set(state => ({
                    creatures: state.creatures.map(creature => {
                        return {
                            ...creature,
                            health: creature.maxHealth,
                            mana: creature.maxMana,
                            actionPoints: creature.maxActionPoints,
                            // Reset any other resources or conditions as needed
                            exhaustion: Math.max(0, (creature.exhaustion || 0) - 1) // Reduce exhaustion by 1 level
                        };
                    })
                }));
            },

            // GM/Player mode toggle
            setGMMode: (isGMMode) => {
                set({ isGMMode });
            },

            toggleGMMode: () => {
                const state = get();
                set({ isGMMode: !state.isGMMode });
            },

            // Grid alignment mode toggle
            setGridAlignmentMode: (isGridAlignmentMode) => {
                set({
                    isGridAlignmentMode,
                    gridAlignmentStep: isGridAlignmentMode ? 1 : 0,
                    gridAlignmentRectangles: isGridAlignmentMode ? [] : []
                });
            },

            // Grid alignment step management
            setGridAlignmentStep: (step) => {
                set({ gridAlignmentStep: step });
            },

            addGridAlignmentRectangle: (rectangle) => {
                const state = get();
                set({
                    gridAlignmentRectangles: [...state.gridAlignmentRectangles, rectangle]
                });
            },

            clearGridAlignmentRectangles: () => {
                set({ gridAlignmentRectangles: [] });
            },

            // Background manipulation mode toggle
            setBackgroundManipulationMode: (isBackgroundManipulationMode) => {
                set({ isBackgroundManipulationMode });
            },

            // Bulk setters for map switching
            setBackgrounds: (backgrounds) => {
                set({ backgrounds: backgrounds || [] });
            },

            setCreatures: (creatures) => {
                set({ creatures: creatures || [] });
            },

            setTokens: (tokens) => {
                set({ tokens: tokens || [] });
            },

            // Camera and view state setters
            setCameraAndZoom: (cameraX, cameraY, zoomLevel) => {
                set({
                    cameraX: cameraX || 0,
                    cameraY: cameraY || 0,
                    zoomLevel: zoomLevel || 1.0
                });
            },

            // Grid state setters
            setGridState: (gridSize, gridOffsetX, gridOffsetY, gridLineColor, gridLineThickness) => {
                set({
                    gridSize: gridSize || 50,
                    gridOffsetX: gridOffsetX || 0,
                    gridOffsetY: gridOffsetY || 0,
                    gridLineColor: gridLineColor || 'rgba(212, 175, 55, 0.8)',
                    gridLineThickness: gridLineThickness || 2
                });
            },

            // Legacy background setters
            setLegacyBackground: (backgroundImage, backgroundImageUrl) => {
                set({
                    backgroundImage: backgroundImage || null,
                    backgroundImageUrl: backgroundImageUrl || ''
                });
            },

            // Window scale management
            setWindowScale: (scale) => {
                const state = get();
                const clampedScale = Math.max(state.minWindowScale, Math.min(state.maxWindowScale, scale));
                console.log('GameStore: Setting window scale from', state.windowScale, 'to', clampedScale);
                set({ windowScale: clampedScale });

                // Dispatch custom events to notify windows of scale changes
                setTimeout(() => {
                    console.log('GameStore: Dispatching windowScaleChanged event with scale', clampedScale);
                    window.dispatchEvent(new Event('resize'));
                    window.dispatchEvent(new CustomEvent('windowScaleChanged', {
                        detail: { scale: clampedScale }
                    }));
                }, 50);
            },

            windowScaleUp: () => {
                const state = get();
                const newScale = state.windowScale * 1.1;
                const clampedScale = Math.min(state.maxWindowScale, newScale);
                set({ windowScale: clampedScale });

                // Dispatch custom events to notify windows of scale changes
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                    window.dispatchEvent(new CustomEvent('windowScaleChanged', {
                        detail: { scale: clampedScale }
                    }));
                }, 50);
            },

            windowScaleDown: () => {
                const state = get();
                const newScale = state.windowScale / 1.1;
                const clampedScale = Math.max(state.minWindowScale, newScale);
                set({ windowScale: clampedScale });

                // Dispatch custom events to notify windows of scale changes
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                    window.dispatchEvent(new CustomEvent('windowScaleChanged', {
                        detail: { scale: clampedScale }
                    }));
                }, 50);
            },

            resetWindowScale: () => {
                set({ windowScale: 1.0 });

                // Dispatch custom events to notify windows of scale changes
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                    window.dispatchEvent(new CustomEvent('windowScaleChanged', {
                        detail: { scale: 1.0 }
                    }));
                }, 50);
            },

            // Movement and distance settings
            setFeetPerTile: (feet) => {
                const clampedFeet = Math.max(1, Math.min(50, feet)); // Reasonable range
                set({ feetPerTile: clampedFeet });
            },

            // Movement visualization settings
            setShowMovementVisualization: (show) => set({ showMovementVisualization: show }),
            setMovementLineColor: (color) => set({ movementLineColor: color }),
            setMovementLineWidth: (width) => set({ movementLineWidth: width }),

            // Multiplayer management
            setMultiplayerState: (isInMultiplayer, room, onLeaveCallback, socket = null) => {
                set({
                    isInMultiplayer,
                    multiplayerRoom: room,
                    onLeaveMultiplayer: onLeaveCallback,
                    multiplayerSocket: socket
                });
            },

            leaveMultiplayer: () => {
                const state = get();
                if (state.onLeaveMultiplayer) {
                    state.onLeaveMultiplayer();
                }
                set({
                    isInMultiplayer: false,
                    multiplayerRoom: null,
                    onLeaveMultiplayer: null,
                    multiplayerSocket: null
                });
            },

            // Multiplayer token movement (deprecated - use creatureStore instead)
            updateTokenPositionMultiplayer: (creatureId, position) => {
                // This method is deprecated to avoid dual store conflicts
                console.warn('🎯 gameStore.updateTokenPositionMultiplayer is deprecated - use creatureStore instead');
            }
        }),
        {
            name: 'game-store',
            storage: {
                getItem: (name) => {
                    try {
                        const str = localStorage.getItem(name);
                        if (!str) return null;
                        return JSON.parse(str);
                    } catch (error) {
                        console.error('Error reading from localStorage:', error);
                        return null;
                    }
                },
                setItem: (name, value) => {
                    try {
                        // Comprehensive exclusion of non-serializable objects
                        const cleanValue = JSON.parse(JSON.stringify(value, (key, val) => {
                            // Exclude socket objects, functions, and other non-serializable types
                            if (key === 'multiplayerSocket' ||
                                key === 'onLeaveMultiplayer' ||
                                key === 'sendMultiplayerMessage' ||
                                typeof val === 'function' ||
                                (val && typeof val === 'object' && val.constructor &&
                                 (val.constructor.name === 'Socket' || val.constructor.name.includes('Socket')))) {
                                return undefined;
                            }
                            return val;
                        }));

                        localStorage.setItem(name, JSON.stringify(cleanValue));
                    } catch (error) {
                        if (error.name === 'QuotaExceededError') {
                            console.error('localStorage quota exceeded in game store. Attempting to clean up...');
                            handleGameStoreQuotaExceeded(name, value);
                        } else {
                            console.error('Error writing to localStorage:', error);
                            // Don't throw error to prevent app crashes
                        }
                    }
                },
                removeItem: (name) => {
                    try {
                        localStorage.removeItem(name);
                    } catch (error) {
                        console.error('Error removing from localStorage:', error);
                    }
                }
            }
        }
    )
);

const initializeStore = () => {
    useGameStore.getState().initializeStore();
};

initializeStore();

export default useGameStore;
