import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default map structure
const createDefaultMap = (name = 'New Map') => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name,
    description: '',
    createdAt: Date.now(),
    lastModified: Date.now(),

    // Background system data
    backgrounds: [],
    activeBackgroundId: null,

    // Legacy background support
    backgroundImage: null,
    backgroundImageUrl: '',

    // Level editor data
    terrainData: {},
    environmentalObjects: [],
    dndElements: [],
    fogOfWarData: {},
    fogOfWarPaths: [], // Fog paths are map-specific
    fogErasePaths: [], // Fog erase paths are map-specific
    wallData: {}, // Walls are map-specific
    drawingPaths: [], // Drawing paths are map-specific
    drawingLayers: [], // Drawing layers are map-specific

    // Game entities
    creatures: [],
    tokens: [], // Creature tokens (from creatureStore)
    characterTokens: [], // Character tokens (from characterTokenStore)

    // Items and containers
    items: [],
    containers: [],
    gridItems: [], // Grid items (loot orbs) are map-specific

    // Portals for map navigation
    portals: [],

    // Camera and view settings
    cameraX: 0,
    cameraY: 0,
    zoomLevel: 1.0,

    // Grid settings
    gridSize: 50,
    gridOffsetX: 0,
    gridOffsetY: 0,
    gridLineColor: 'rgba(212, 175, 55, 0.8)',
    gridLineThickness: 2,
    gridType: 'square' // 'square' or 'hex' - per-map grid type
});

// Storage quota exceeded handler
const handleStorageQuotaExceeded = (name, value) => {
    try {
        // Calculate current storage usage
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length;
            }
        }

        // Try to clean up other stores first
        const keysToClean = [];
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key !== name) {
                // Clean up old or large entries from other stores
                if (key.includes('temp-') || key.includes('cache-') || key.includes('backup-')) {
                    keysToClean.push(key);
                }
            }
        }

        // Remove temporary/cache entries
        keysToClean.forEach(key => {
            localStorage.removeItem(key);
        });

        // If still not enough space, try to compress the data
        try {
            // Parse the current data to optimize it further
            const data = JSON.parse(value);
            if (data && data.maps) {
                // Further optimize maps by removing non-essential data
                const compressedMaps = (data.maps || []).map(map => ({
                    id: map.id,
                    name: map.name,
                    createdAt: map.createdAt,
                    lastModified: map.lastModified,
                    // Keep only essential level editor data
                    terrainData: map.terrainData || {},
                    environmentalObjects: (map.environmentalObjects || []).slice(0, 100), // Limit objects
                    dndElements: map.dndElements || [],
                    fogOfWarData: map.fogOfWarData || {},
                    // Remove large data that can be recreated
                    creatures: [],
                    tokens: [],
                    items: [],
                    containers: [],
                    portals: map.portals || [],
                    // Keep essential settings
                    cameraX: map.cameraX || 0,
                    cameraY: map.cameraY || 0,
                    zoomLevel: map.zoomLevel || 1.0,
                    gridSize: map.gridSize || 50,
                    gridOffsetX: map.gridOffsetX || 0,
                    gridOffsetY: map.gridOffsetY || 0
                }));

                const compressedData = {
                    ...data,
                    maps: compressedMaps
                };

                const compressedValue = JSON.stringify(compressedData);
                localStorage.setItem(name, compressedValue);

                // Show user notification
                if (window.alert) {
                    alert('Storage space was running low. Some non-essential data has been cleaned up to make room. Your maps and important data have been preserved.');
                }
                return;
            }
        } catch (compressionError) {
            // Error compressing data
        }

        // Last resort: try to save just the current map and essential data
        try {
            const data = JSON.parse(value);
            if (data && data.maps && data.maps.length > 1) {
                // Keep only the current map and one backup
                const currentMapId = data.currentMapId;
                const currentMap = (data.maps || []).find(m => m.id === currentMapId);
                const otherMaps = (data.maps || []).filter(m => m.id !== currentMapId).slice(0, 1);

                const minimalData = {
                    maps: currentMap ? [currentMap, ...otherMaps] : data.maps.slice(0, 2),
                    currentMapId: data.currentMapId,
                    portalTemplates: (data.portalTemplates || []).slice(0, 10) // Limit templates
                };

                const minimalValue = JSON.stringify(minimalData);
                localStorage.setItem(name, minimalValue);

                if (window.alert) {
                    alert('Storage space was critically low. Only the current map and one backup have been preserved. Please consider exporting your maps for backup.');
                }
                return;
            }
        } catch (minimalError) {
            // Error saving minimal data
        }

        // If all else fails, show error to user
        if (window.alert) {
            alert('Unable to save map data due to storage limitations. Please clear browser data or export your maps for backup.');
        }

    } catch (error) {
        if (window.alert) {
            alert('Critical storage error. Please refresh the page and consider clearing browser data.');
        }
    }
};

const initialState = {
    // Map management
    maps: [(() => {
        const m = createDefaultMap('Default Map');
        m.id = 'default';
        return m;
    })()],
    currentMapId: 'default',

    // Portal templates - reusable portal configurations
    portalTemplates: [],

    // UI state
    isMapLibraryOpen: false,
    selectedMapForEdit: null,

    // Map creation/editing
    mapCreationWizard: {
        isOpen: false,
        step: 1,
        name: '',
        backgroundImage: null,
        template: null
    }
};

const useMapStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // Reset store to clean state (for multiplayer room joins)
            resetStore: () => {
                set({
                    maps: [],
                    currentMapId: null,
                    portalTemplates: [],
                    isMapLibraryOpen: false,
                    selectedMapForEdit: null,
                    mapCreationWizard: {
                        isOpen: false,
                        step: 1,
                        name: '',
                        backgroundImage: null,
                        template: null
                    }
                });
            },

            // Initialize current map if none set
            getCurrentMapId: () => {
                const state = get();
                if (!state.currentMapId && state.maps.length > 0) {
                    // Set the first map as current and initialize it
                    set({ currentMapId: state.maps[0].id });
                    return state.maps[0].id;
                }
                return state.currentMapId;
            },

            // Initialize map store with current game state
            initializeWithCurrentState: (gameStoreData, levelEditorData) => {
                const state = get();
                const currentMapId = state.getCurrentMapId();

                if (currentMapId) {
                    // Update the current map with the current game state
                    const mapUpdates = {
                        // Save background system
                        backgrounds: gameStoreData.backgrounds || [],
                        activeBackgroundId: gameStoreData.activeBackgroundId || null,

                        // Save legacy background system
                        backgroundImage: gameStoreData.backgroundImage || null,
                        backgroundImageUrl: gameStoreData.backgroundImageUrl || '',

                        // Save camera and view settings
                        cameraX: gameStoreData.cameraX || 0,
                        cameraY: gameStoreData.cameraY || 0,
                        zoomLevel: gameStoreData.zoomLevel || 1.0,

                        // Save grid settings
                        gridSize: gameStoreData.gridSize || 50,
                        gridOffsetX: gameStoreData.gridOffsetX || 0,
                        gridOffsetY: gameStoreData.gridOffsetY || 0,
                        gridLineColor: gameStoreData.gridLineColor || 'rgba(64, 196, 255, 0.3)',
                        gridLineThickness: gameStoreData.gridLineThickness || 1,

                        // Save level editor data
                        terrainData: levelEditorData.terrainData || {},
                        environmentalObjects: levelEditorData.environmentalObjects || [],
                        dndElements: levelEditorData.dndElements || [],
                        fogOfWarData: levelEditorData.fogOfWarData || {},
                        fogOfWarPaths: levelEditorData.fogOfWarPaths || [],
                        fogErasePaths: levelEditorData.fogErasePaths || [],
                        wallData: levelEditorData.wallData || {},
                        drawingPaths: levelEditorData.drawingPaths || [],
                        drawingLayers: levelEditorData.drawingLayers || [],

                        // Save game entities
                        creatures: gameStoreData.creatures || [],
                        tokens: gameStoreData.tokens || []
                    };

                    state.updateMap(currentMapId, mapUpdates);
                }
            },

            getCurrentMap: () => {
                const state = get();
                const currentId = state.getCurrentMapId();
                return (state.maps || []).find(map => map.id === currentId) || (state.maps || [])[0];
            },

            // Map CRUD operations
            createMap: (mapData = {}) => {
                const newMap = createDefaultMap(mapData.name || 'New Map');
                Object.assign(newMap, mapData);

                set(state => ({
                    maps: [...state.maps, newMap],
                    currentMapId: newMap.id
                }));

                return newMap.id;
            },

            // Create map without switching to it immediately
            createMapWithoutSwitching: (mapData = {}) => {
                const newMap = createDefaultMap(mapData.name || 'New Map');
                Object.assign(newMap, mapData);

                set(state => ({
                    maps: [...state.maps, newMap]
                    // Don't change currentMapId
                }));

                return newMap.id;
            },

            updateMap: (mapId, updates) => {
                set(state => ({
                    maps: (state.maps || []).map(map =>
                        map.id === mapId
                            ? { ...map, ...updates, lastModified: Date.now() }
                            : map
                    )
                }));
            },

            deleteMap: (mapId) => {
                set(state => {
                    const newMaps = (state.maps || []).filter(map => map.id !== mapId);
                    // Ensure we always have at least one map
                    if (newMaps.length === 0) {
                        newMaps.push(createDefaultMap('Default Map'));
                    }

                    const newCurrentId = state.currentMapId === mapId
                        ? newMaps[0].id
                        : state.currentMapId;

                    return {
                        maps: newMaps,
                        currentMapId: newCurrentId
                    };
                });
            },

            duplicateMap: (mapId) => {
                const state = get();
                const originalMap = (state.maps || []).find(map => map.id === mapId);
                if (!originalMap) return null;

                const duplicatedMap = {
                    ...originalMap,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name: `${originalMap.name} (Copy)`,
                    createdAt: Date.now(),
                    lastModified: Date.now()
                };

                set(state => ({
                    maps: [...state.maps, duplicatedMap]
                }));

                return duplicatedMap.id;
            },

            // Map navigation
            switchToMap: (mapId) => {
                const state = get();
                const targetMap = (state.maps || []).find(map => map.id === mapId);
                if (!targetMap) return false;

                set({ currentMapId: mapId });
                return true;
            },

            // Map library UI
            setMapLibraryOpen: (isOpen) => set({ isMapLibraryOpen: isOpen }),

            setSelectedMapForEdit: (mapId) => set({ selectedMapForEdit: mapId }),

            // Map creation wizard
            openMapCreationWizard: () => set({
                mapCreationWizard: {
                    isOpen: true,
                    step: 1,
                    name: '',
                    backgroundImage: null,
                    template: null
                }
            }),

            closeMapCreationWizard: () => set({
                mapCreationWizard: {
                    isOpen: false,
                    step: 1,
                    name: '',
                    backgroundImage: null,
                    template: null
                }
            }),

            updateMapCreationWizard: (updates) => set(state => ({
                mapCreationWizard: { ...state.mapCreationWizard, ...updates }
            })),

            // Portal management
            addPortal: (mapId, portalData) => {
                const portal = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    type: 'portal',
                    position: portalData.position,
                    destinationMapId: portalData.destinationMapId,
                    destinationPosition: portalData.destinationPosition || null,
                    name: portalData.name || 'Portal',
                    description: portalData.description || '',
                    isActive: portalData.isActive !== false,
                    icon: '🌀',
                    color: portalData.color || '#4a90e2',
                    createdAt: Date.now()
                };

                set(state => ({
                    maps: (state.maps || []).map(map =>
                        map.id === mapId
                            ? {
                                ...map,
                                portals: [...(map.portals || []), portal],
                                lastModified: Date.now()
                            }
                            : map
                    )
                }));

                return portal.id;
            },

            updatePortal: (mapId, portalId, updates) => {
                set(state => ({
                    maps: (state.maps || []).map(map =>
                        map.id === mapId
                            ? {
                                ...map,
                                portals: (map.portals || []).map(portal =>
                                    portal.id === portalId
                                        ? { ...portal, ...updates }
                                        : portal
                                ),
                                lastModified: Date.now()
                            }
                            : map
                    )
                }));
            },

            removePortal: (mapId, portalId) => {
                set(state => ({
                    maps: (state.maps || []).map(map =>
                        map.id === mapId
                            ? {
                                ...map,
                                portals: (map.portals || []).filter(portal => portal.id !== portalId),
                                lastModified: Date.now()
                            }
                            : map
                    )
                }));
            },

            // Portal activation
            activatePortal: (portalId) => {
                const state = get();
                const currentMap = state.getCurrentMap();
                const portal = (currentMap?.portals || []).find(p => p.id === portalId);

                if (!portal || !portal.isActive) return false;

                const destinationMap = (state.maps || []).find(map => map.id === portal.destinationMapId);
                if (!destinationMap) return false;

                // Switch to destination map
                set({ currentMapId: portal.destinationMapId });

                return {
                    destinationMapId: portal.destinationMapId,
                    destinationPosition: portal.destinationPosition,
                    portalName: portal.name
                };
            },

            // Map switching functionality
            switchToMap: async (mapId) => {
                const state = get();
                const targetMap = (state.maps || []).find(map => map.id === mapId);

                if (!targetMap) {
                    throw new Error(`Map with ID ${mapId} not found`);
                }

                // Save current map state before switching
                const currentMapId = state.getCurrentMapId();
                if (currentMapId && currentMapId !== mapId) {
                    // Import stores to save current state
                    const gameStore = await import('./gameStore').then(module => module.default.getState());
                    const levelEditorStore = await import('./levelEditorStore').then(module => module.default.getState());

                    await state.saveCurrentMapState(gameStore, levelEditorStore);
                }

                // Switch to the new map
                set({ currentMapId: mapId });

                // Load the new map's state
                const mapState = state.loadMapState();
                if (mapState) {
                    // Import stores to load new state
                    const { default: useGameStore } = await import('./gameStore');
                    const { default: useLevelEditorStore } = await import('./levelEditorStore');

                    // Update game store with new map data
                    useGameStore.setState({
                        backgrounds: mapState.backgrounds || [],
                        activeBackgroundId: mapState.activeBackgroundId || null,
                        backgroundImage: mapState.backgroundImage || null,
                        backgroundImageUrl: mapState.backgroundImageUrl || '',
                        cameraX: mapState.cameraX || 0,
                        cameraY: mapState.cameraY || 0,
                        zoomLevel: mapState.zoomLevel || 1.0,
                        gridSize: mapState.gridSize || 50,
                        gridOffsetX: mapState.gridOffsetX || 0,
                        gridOffsetY: mapState.gridOffsetY || 0,
                        gridLineColor: mapState.gridLineColor || 'rgba(212, 175, 55, 0.8)',
                        gridLineThickness: mapState.gridLineThickness || 2,
                        gridType: mapState.gridType || 'square' // Restore per-map grid type
                    });

                    // Clear and load tokens for the new map
                    const { default: useCreatureStore } = await import('./creatureStore');
                    const { default: useCharacterTokenStore } = await import('./characterTokenStore');

                    // Clear existing tokens first
                    if (useCreatureStore.getState().clearTokens) {
                        useCreatureStore.getState().clearTokens();
                    } else {
                        useCreatureStore.setState({ tokens: [] });
                    }

                    if (useCharacterTokenStore.getState().clearCharacterTokens) {
                        useCharacterTokenStore.getState().clearCharacterTokens();
                    } else {
                        useCharacterTokenStore.setState({ characterTokens: [] });
                    }

                    // CRITICAL FIX: Pause event processing during map switch to prevent race conditions
                    // Events arriving during switch could leak data between maps
                    const wasInMultiplayer = useGameStore.getState().isInMultiplayer;
                    let socket = null;
                    let originalOnevent = null;
                    const pausedEvents = [];

                    if (wasInMultiplayer) {
                        socket = useGameStore.getState().multiplayerSocket;
                        if (socket && socket.connected) {
                            // Store original event handler
                            originalOnevent = socket.onevent;
                            // Pause events by replacing handler
                            socket.onevent = (packet) => {
                                pausedEvents.push(packet);
                            };
                        }
                    }

                    // Load tokens for the new map
                    if (mapState.tokens && mapState.tokens.length > 0) {
                        const creatureStore = useCreatureStore.getState();
                        mapState.tokens.forEach(token => {
                            if (creatureStore.loadToken) {
                                creatureStore.loadToken(token);
                            }
                        });
                    }

                    // Load character tokens for the new map
                    if (mapState.characterTokens && mapState.characterTokens.length > 0) {
                        const characterTokenStore = useCharacterTokenStore.getState();
                        mapState.characterTokens.forEach(token => {
                            if (characterTokenStore.addCharacterTokenFromServer) {
                                characterTokenStore.addCharacterTokenFromServer(token.id, token.position, token.playerId);
                            }
                        });
                    }

                    // Update level editor store with new map data
                    const levelEditorState = useLevelEditorStore.getState();

                    // Use setter methods if available, otherwise use setState directly
                    if (levelEditorState.setTerrainData) {
                        levelEditorState.setTerrainData(mapState.terrainData || {});
                    }
                    if (levelEditorState.setEnvironmentalObjects) {
                        levelEditorState.setEnvironmentalObjects(mapState.environmentalObjects || []);
                    }
                    if (levelEditorState.setDndElements) {
                        levelEditorState.setDndElements(mapState.dndElements || []);
                    }
                    if (levelEditorState.setFogOfWarData) {
                        levelEditorState.setFogOfWarData(mapState.fogOfWarData || {});
                    }
                    if (levelEditorState.setFogOfWarPaths) {
                        levelEditorState.setFogOfWarPaths(mapState.fogOfWarPaths || []);
                    }
                    if (levelEditorState.setFogErasePaths) {
                        levelEditorState.setFogErasePaths(mapState.fogErasePaths || []);
                    }
                    if (levelEditorState.setWallData) {
                        levelEditorState.setWallData(mapState.wallData || {});
                    }
                    if (levelEditorState.setDrawingPaths) {
                        levelEditorState.setDrawingPaths(mapState.drawingPaths || []);
                    }
                    if (levelEditorState.setDrawingLayers) {
                        levelEditorState.setDrawingLayers(mapState.drawingLayers || []);
                    }

                    // Also update grid items
                    const { default: useGridItemStore } = await import('./gridItemStore');
                    if (useGridItemStore && mapState.gridItems) {
                        useGridItemStore.setState({ gridItems: mapState.gridItems || [] });
                    }

                    // CRITICAL FIX: Resume event processing after map switch
                    // Process any events that arrived during the switch
                    if (socket && wasInMultiplayer) {
                        socket.onevent = null; // Remove the pause handler

                        // Small delay to ensure state is fully loaded before processing queued events
                        setTimeout(() => {
                            pausedEvents.forEach(packet => {
                                if (socket._onevent) {
                                    socket._onevent(packet);
                                }
                            });
                        }, 50);
                    }
                }

                return targetMap;
            },

            // Portal template management
            addPortalTemplate: (templateData) => {
                const template = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name: templateData.name || 'Portal Template',
                    description: templateData.description || '',
                    destinationMapId: templateData.destinationMapId || null,
                    destinationPosition: templateData.destinationPosition || null,
                    color: templateData.color || '#4a90e2',
                    isActive: templateData.isActive !== false,
                    icon: '🌀',
                    createdAt: Date.now()
                };

                set(state => ({
                    portalTemplates: [...state.portalTemplates, template]
                }));

                return template.id;
            },

            updatePortalTemplate: (templateId, updates) => {
                set(state => ({
                    portalTemplates: (state.portalTemplates || []).map(template =>
                        template.id === templateId
                            ? { ...template, ...updates }
                            : template
                    )
                }));
            },

            removePortalTemplate: (templateId) => {
                set(state => ({
                    portalTemplates: (state.portalTemplates || []).filter(template => template.id !== templateId)
                }));
            },

            // Create portal from template
            createPortalFromTemplate: (templateId, mapId, position) => {
                const state = get();
                const template = (state.portalTemplates || []).find(t => t.id === templateId);
                if (!template) return null;

                const portalData = {
                    position,
                    name: template.name,
                    description: template.description,
                    destinationMapId: template.destinationMapId,
                    destinationPosition: template.destinationPosition,
                    color: template.color,
                    isActive: template.isActive
                };

                return state.addPortal(mapId, portalData);
            },

            // Map data synchronization helpers
            saveCurrentMapState: async (gameStoreData, levelEditorData, targetMapId = null) => {
                const state = get();
                // Use provided targetMapId if given, otherwise get current
                const mapIdToSave = targetMapId || state.getCurrentMapId();
                if (!mapIdToSave) return;

                // Get grid items from gridItemStore and filter by target map ID
                let gridItems = [];
                try {
                    const { default: useGridItemStore } = await import('./gridItemStore');
                    const gridItemState = useGridItemStore.getState();
                    gridItems = (gridItemState.gridItems || []).filter(item => item.mapId === mapIdToSave);
                } catch (error) {
                    console.warn('Could not load grid items:', error);
                }

                // Get tokens from creatureStore (not gameStore)
                let tokens = [];
                try {
                    const { default: useCreatureStore } = await import('./creatureStore');
                    const creatureStoreState = useCreatureStore.getState();
                    tokens = creatureStoreState.tokens || [];
                } catch (error) {
                    console.warn('Could not load creature tokens:', error);
                }

                // Get character tokens from characterTokenStore
                let characterTokens = [];
                try {
                    const { default: useCharacterTokenStore } = await import('./characterTokenStore');
                    const characterTokenState = useCharacterTokenStore.getState();
                    characterTokens = characterTokenState.characterTokens || [];
                } catch (error) {
                    console.warn('Could not load character tokens:', error);
                }

                const mapUpdates = {
                    // CRITICAL: Use target map ID for update
                    mapId: mapIdToSave,
                    // Save background system
                    backgrounds: gameStoreData.backgrounds || [],
                    activeBackgroundId: gameStoreData.activeBackgroundId || null,

                    // Save legacy background system
                    backgroundImage: gameStoreData.backgroundImage || null,
                    backgroundImageUrl: gameStoreData.backgroundImageUrl || '',

                    // Save camera and view settings
                    cameraX: gameStoreData.cameraX || 0,
                    cameraY: gameStoreData.cameraY || 0,
                    zoomLevel: gameStoreData.zoomLevel || 1.0,

                    // Save grid settings
                    gridSize: gameStoreData.gridSize || 50,
                    gridOffsetX: gameStoreData.gridOffsetX || 0,
                    gridOffsetY: gameStoreData.gridOffsetY || 0,
                    gridLineColor: gameStoreData.gridLineColor || 'rgba(212, 175, 55, 0.8)',
                    gridLineThickness: gameStoreData.gridLineThickness || 2,
                    gridType: gameStoreData.gridType || 'square', // Save per-map grid type

                    // Save level editor data
                    terrainData: levelEditorData.terrainData || {},
                    environmentalObjects: levelEditorData.environmentalObjects || [],
                    dndElements: levelEditorData.dndElements || [],
                    fogOfWarData: levelEditorData.fogOfWarData || {},
                    fogOfWarPaths: levelEditorData.fogOfWarPaths || [],
                    fogErasePaths: levelEditorData.fogErasePaths || [],
                    wallData: levelEditorData.wallData || {},
                    drawingPaths: levelEditorData.drawingPaths || [],
                    drawingLayers: levelEditorData.drawingLayers || [],

                    // Save game entities
                    creatures: gameStoreData.creatures || [],
                    tokens: tokens, // From creatureStore, not gameStore
                    characterTokens: characterTokens, // From characterTokenStore

                    // Save grid items (loot orbs, etc.)
                    gridItems: gridItems
                };

                // CRITICAL: Use mapIdToSave instead of currentMapId
                state.updateMap(mapIdToSave, mapUpdates);
            },

            loadMapState: async () => {
                const state = get();
                const currentMap = state.getCurrentMap();
                if (!currentMap) return null;

                // CRITICAL FIX: Get grid items from gridItemStore, not just from map object
                // This ensures we have the latest items that were just added/modified
                let gridItemsFromStore = [];
                try {
                    const { default: useGridItemStore } = await import('./gridItemStore');
                    const gridItemState = useGridItemStore.getState();
                    const currentMapId = currentMap.id;
                    gridItemsFromStore = (gridItemState.gridItems || []).filter(item => item.mapId === currentMapId);
                } catch (error) {
                    console.warn('Could not load grid items from gridItemStore:', error);
                    gridItemsFromStore = currentMap.gridItems || [];
                }

                return {
                    // Background system data
                    backgrounds: currentMap.backgrounds || [],
                    activeBackgroundId: currentMap.activeBackgroundId || null,

                    // Legacy background system
                    backgroundImage: currentMap.backgroundImage || null,
                    backgroundImageUrl: currentMap.backgroundImageUrl || '',

                    // Camera and view settings
                    cameraX: currentMap.cameraX || 0,
                    cameraY: currentMap.cameraY || 0,
                    zoomLevel: currentMap.zoomLevel || 1.0,

                    // Grid settings
                    gridSize: currentMap.gridSize || 50,
                    gridOffsetX: currentMap.gridOffsetX || 0,
                    gridOffsetY: currentMap.gridOffsetY || 0,
                    gridLineColor: currentMap.gridLineColor || 'rgba(212, 175, 55, 0.8)',
                    gridLineThickness: currentMap.gridLineThickness || 2,
                    gridType: currentMap.gridType || 'square', // Per-map grid type

                    // Level editor data
                    terrainData: currentMap.terrainData || {},
                    environmentalObjects: currentMap.environmentalObjects || [],
                    dndElements: currentMap.dndElements || [],
                    fogOfWarData: currentMap.fogOfWarData || {},
                    fogOfWarPaths: currentMap.fogOfWarPaths || [],
                    fogErasePaths: currentMap.fogErasePaths || [],
                    wallData: currentMap.wallData || {},
                    drawingPaths: currentMap.drawingPaths || [],
                    drawingLayers: currentMap.drawingLayers || [],

                    // Game entities
                    creatures: currentMap.creatures || [],
                    tokens: currentMap.tokens || [],
                    characterTokens: currentMap.characterTokens || [],

                    // CRITICAL FIX: Use items from gridItemStore to get latest data
                    gridItems: gridItemsFromStore,

                    // Portals
                    portals: currentMap.portals || []
                };
            },

            // Storage management utilities
            getStorageInfo: () => {
                try {
                    let totalSize = 0;
                    let mapStoreSize = 0;
                    const storageInfo = {};

                    for (let key in localStorage) {
                        if (localStorage.hasOwnProperty(key)) {
                            const size = localStorage[key].length;
                            totalSize += size;
                            storageInfo[key] = size;

                            if (key === 'map-store') {
                                mapStoreSize = size;
                            }
                        }
                    }

                    return {
                        totalSize: totalSize,
                        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
                        mapStoreSize: mapStoreSize,
                        mapStoreSizeMB: (mapStoreSize / 1024 / 1024).toFixed(2),
                        storageInfo: storageInfo,
                        estimatedQuota: 5 * 1024 * 1024, // 5MB typical quota
                        usagePercentage: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(1)
                    };
                } catch (error) {
                    return null;
                }
            },

            cleanupStorage: () => {
                try {
                    // Remove temporary and cache entries
                    const keysToRemove = [];
                    for (let key in localStorage) {
                        if (localStorage.hasOwnProperty(key)) {
                            if (key.includes('temp-') || key.includes('cache-') || key.includes('backup-')) {
                                keysToRemove.push(key);
                            }
                        }
                    }

                    keysToRemove.forEach(key => {
                        localStorage.removeItem(key);
                    });


                    return keysToRemove.length;
                } catch (error) {
                    return 0;
                }
            }
        }),
        {
            name: 'map-store',
            storage: {
                getItem: (name) => {
                    try {
                        const str = localStorage.getItem(name);
                        if (!str) return null;
                        return JSON.parse(str);
                    } catch (error) {
                        console.error('Error retrieving map-store from localStorage:', error);
                        return null;
                    }
                },
                setItem: (name, value) => {
                    try {
                        const serialized = JSON.stringify(value);
                        // Use the quota exceeded handler if needed
                        try {
                            localStorage.setItem(name, serialized);
                        } catch (quotaError) {
                            if (quotaError.name === 'QuotaExceededError' || quotaError.code === 22) {
                                handleStorageQuotaExceeded(name, serialized);
                            } else {
                                throw quotaError;
                            }
                        }
                    } catch (error) {
                        console.error('Error storing map-store in localStorage:', error);
                    }
                },
                removeItem: (name) => {
                    try {
                        localStorage.removeItem(name);
                    } catch (error) {
                        console.error('Error removing map-store from localStorage:', error);
                    }
                }
            }
        }
    )
);

export default useMapStore;
