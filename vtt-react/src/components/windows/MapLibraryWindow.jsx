import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { FaImage, FaCopy, FaTrash, FaExchangeAlt, FaUsers, FaUserAlt } from 'react-icons/fa';
import WowWindow from './WowWindow';
import useMapStore from '../../store/mapStore';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore, { mapUpdateBatcher } from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import usePartyStore from '../../store/partyStore';
import MapSwitchConfirmDialog from '../dialogs/MapSwitchConfirmDialog';
import MapDeleteConfirmDialog from '../dialogs/MapDeleteConfirmDialog';
import { ALL_BACKGROUND_ASSETS, getBackgroundUrl } from '../../data/backgroundAssets';
import './styles/MapLibraryWindow.css';
import '../character-creation-wizard/styles/CharacterAppearanceModal.css'; // Reuse background grid styles

const MapLibraryWindow = ({ isOpen, onClose }) => {
    const [selectedMapId, setSelectedMapId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [pendingMapDelete, setPendingMapDelete] = useState(null);
    const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
    const [pendingMapSwitch, setPendingMapSwitch] = useState(null);
    const [showBackgroundAssignment, setShowBackgroundAssignment] = useState(null);
    const [editingMapId, setEditingMapId] = useState(null);
    const [editMapName, setEditMapName] = useState('');
    const [editMapDescription, setEditMapDescription] = useState('');
    const fileInputRef = useRef(null);
    const backgroundFileInputRef = useRef(null);
    const mapGridRef = useRef(null);
    const [showAssetSelector, setShowAssetSelector] = useState(false);
    const [assetSelectorType, setAssetSelectorType] = useState(null); // 'wizard' or 'assign'
    const [targetMapForAsset, setTargetMapForAsset] = useState(null);
    const [activeSelectionTab, setActiveSelectionTab] = useState('assets'); // 'assets' or 'upload'

    // GM Player Transfer: Track player drag state
    const [draggingPlayer, setDraggingPlayer] = useState(null);
    const [dropTargetMapId, setDropTargetMapId] = useState(null);

    // Map store
    const {
        maps,
        currentMapId,
        createMap,
        createMapWithoutSwitching,
        updateMap,
        deleteMap,
        duplicateMap,
        switchToMap,
        saveCurrentMapState,
        loadMapState,
        openMapCreationWizard,
        mapCreationWizard,
        closeMapCreationWizard,
        updateMapCreationWizard
    } = useMapStore();

    // Game and level editor stores for state synchronization
    const gameStore = useGameStore();
    const levelEditorStore = useLevelEditorStore();

    // Get multiplayer state and socket
    const { isInMultiplayer, multiplayerSocket, isGMMode } = useGameStore(state => ({
        isInMultiplayer: state.isInMultiplayer,
        multiplayerSocket: state.multiplayerSocket,
        isGMMode: state.isGMMode
    }));

    // Get party members and map assignments from store
    const { partyMembers, playerMapAssignments } = usePartyStore();

    // Get real-time data from stores for reactive updates
    const { dndElements } = useLevelEditorStore();
    const { tokens } = useCreatureStore(); // Use tokens to count creatures on the map

    // Background management from game store
    const addBackground = useGameStore(state => state.addBackground);
    const setActiveBackground = useGameStore(state => state.setActiveBackground);
    const setBackgroundImage = useGameStore(state => state.setBackgroundImage);
    const setBackgroundImageUrl = useGameStore(state => state.setBackgroundImageUrl);

    // EFFECT REMOVED: Synchronization now handled centrally in MultiplayerApp.jsx -> partyStore

        // Get players on a specific map
    const getPlayersOnMap = useCallback((mapId) => {
        if (!isInMultiplayer || !partyMembers) return [];

        return partyMembers.filter(member => {
            const playerMapId = playerMapAssignments[member.id] || 'default';
            return playerMapId === mapId;
        });
    }, [isInMultiplayer, partyMembers, playerMapAssignments]);

    // Helper to get map state (async wrapper)
    const getMapState = useCallback(async (mapId) => {
        return await loadMapState(mapId);
    }, [loadMapState]);

    // Handle player drag start
    const handlePlayerDragStart = (e, player) => {
        if (!isGMMode) return;
        e.dataTransfer.setData('playerId', player.id);
        e.dataTransfer.setData('playerName', player.name || player.characterName || 'Player');
        setDraggingPlayer(player);
    };

    // Handle map drag over
    const handleMapDragOver = (e, mapId) => {
        if (!draggingPlayer) return;
        e.preventDefault();
        setDropTargetMapId(mapId);
    };

    // Handle map drag leave
    const handleMapDragLeave = () => {
        setDropTargetMapId(null);
    };

    // Handle player drop on map
    const handlePlayerDrop = async (e, targetMapId) => {
        e.preventDefault();
        const playerId = e.dataTransfer.getData('playerId');
        const playerName = e.dataTransfer.getData('playerName');

        if (!playerId || !multiplayerSocket || !isGMMode) {
            setDraggingPlayer(null);
            setDropTargetMapId(null);
            return;
        }

        // Clear any pending map updates before transfer to avoid bleeding them to the new map
        if (mapUpdateBatcher && typeof mapUpdateBatcher.clear === 'function') {
            mapUpdateBatcher.clear();
        }

                // Get map name for better display in transition
        const targetMap = maps.find(m => m.id === targetMapId);
        const mapName = targetMap?.name || null;

        // Check if GM is transferring themselves
        const gmPlayerId = usePartyStore.getState().leaderId;
        const isSelfTransfer = playerId === gmPlayerId;

        // CRITICAL FIX: Sync destination map state before transferring player
        // This ensures items placed on map are available when player arrives
        if (targetMapId !== currentMapId) {
            console.log(`💾 Syncing destination map state before transfer: ${targetMapId}`);
            try {
                const gameStoreState = useGameStore.getState();
                const levelEditorStoreState = useLevelEditorStore.getState();

                // CRITICAL: Explicitly save destination map state to sync items to Firebase
                // This ensures items added via drag are in map object before syncing
                await saveCurrentMapState(gameStoreState, levelEditorStoreState, targetMapId);

                // Load the updated state (now async)
                const mapState = await getMapState(targetMapId);
                if (mapState && (mapState.gridItems?.length > 0 || mapState.tokens?.length > 0 || mapState.dndElements?.length > 0)) {
                    gameStoreState.multiplayerSocket.emit('sync_map_state', {
                        mapId: targetMapId,
                        mapName: mapName,
                        gridItems: mapState.gridItems,
                        tokens: mapState.tokens,
                        characterTokens: mapState.characterTokens,
                        terrainData: mapState.terrainData,
                        wallData: mapState.wallData,
                        drawingPaths: mapState.drawingPaths,
                        drawingLayers: mapState.drawingLayers,
                        fogOfWarData: mapState.fogOfWarData,
                        fogOfWarPaths: mapState.fogOfWarPaths,
                        fogErasePaths: mapState.fogErasePaths,
                        dndElements: mapState.dndElements,
                        backgrounds: mapState.backgrounds,
                        activeBackgroundId: mapState.activeBackgroundId,
                        environmentalObjects: mapState.environmentalObjects,
                        lightSources: mapState.lightSources,
                        exploredAreas: mapState.exploredAreas
                    });
                    console.log(`✅ Destination map state synced to server with ${mapState.gridItems?.length || 0} items`);
                }
            } catch (error) {
                console.error('❌ Error syncing destination map before transfer:', error);
            }
        }

        // Emit gm_transfer_player event to server
        console.log(`🎯 GM transferring player ${playerName} to map ${targetMapId}`);
        multiplayerSocket.emit('gm_transfer_player', {
            targetPlayerId: playerId,
            destinationMapId: targetMapId,
            destinationPosition: { x: 0, y: 0 }, // Default to center
            mapName: mapName // Send map name to avoid showing long numbers
        });

        // CRITICAL FIX: If GM is transferring themselves, also emit gm_switch_view
        // This ensures GM's "you are here" tag follows in Map Library
        if (isSelfTransfer) {
            console.log(`🎯 GM transferring themselves - also emitting gm_switch_view`);
            multiplayerSocket.emit('gm_switch_view', {
                newMapId: targetMapId,
                mapName: mapName
            });
            
            // CRITICAL FIX: Update GM's own map assignment so tag follows in Map Library
            // This is needed because playerMapAssignments is used to display GM's location
            const gmPlayerId = usePartyStore.getState().leaderId;
            if (gmPlayerId) {
                usePartyStore.getState().setPlayerMapAssignment(gmPlayerId, targetMapId);
            }
        }

        // Optimistically update partyStore
        usePartyStore.getState().setPlayerMapAssignment(playerId, targetMapId);


        setDraggingPlayer(null);
        setDropTargetMapId(null);
    };



    // Handle map switching request (shows confirmation dialog)
    const handleMapSwitchRequest = (mapId) => {
        if (mapId === currentMapId) return;

        const targetMap = maps.find(m => m.id === mapId);
        const currentMap = maps.find(m => m.id === currentMapId);

        // Show confirmation dialog for map switching
        setPendingMapSwitch({
            newMapId: mapId,
            newMapName: targetMap?.name || 'Unknown Map',
            currentMapName: currentMap?.name || 'Current Map',
            thumbnail: targetMap?.backgrounds?.[0]?.url || null
        });
        setShowSwitchConfirm(true);
    };

    // Actual map switching with state preservation
    const handleMapSwitch = async (mapId, skipSaveCurrentState = false) => {
        if (mapId === currentMapId) return;

        try {
            // CRITICAL FIX: In multiplayer GM mode, sync destination map state before switching
            // This ensures items on the destination map are available when we switch to it
            const gameStoreState = useGameStore.getState();
            if (gameStoreState.isInMultiplayer && gameStoreState.isGMMode) {
                try {
                    const destinationMapState = loadMapState(mapId);
                    if (destinationMapState && (destinationMapState.gridItems?.length > 0 || destinationMapState.tokens?.length > 0)) {
                        console.log(`💾 Syncing destination map ${mapId} before switching`);
                        const targetMap = maps.find(m => m.id === mapId);
                        gameStoreState.multiplayerSocket.emit('sync_map_state', {
                            mapId: mapId,
                            mapName: targetMap?.name,
                            gridItems: destinationMapState.gridItems,
                            tokens: destinationMapState.tokens,
                            characterTokens: destinationMapState.characterTokens,
                            terrainData: destinationMapState.terrainData,
                            wallData: destinationMapState.wallData,
                            drawingPaths: destinationMapState.drawingPaths,
                            drawingLayers: destinationMapState.drawingLayers,
                            fogOfWarData: destinationMapState.fogOfWarData,
                            fogOfWarPaths: destinationMapState.fogOfWarPaths,
                            fogErasePaths: destinationMapState.fogErasePaths,
                            dndElements: destinationMapState.dndElements,
                            backgrounds: destinationMapState.backgrounds,
                            activeBackgroundId: destinationMapState.activeBackgroundId,
                            environmentalObjects: destinationMapState.environmentalObjects,
                            lightSources: destinationMapState.lightSources,
                            exploredAreas: destinationMapState.exploredAreas
                        });
                        // Small delay to allow server to process sync
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                } catch (error) {
                    console.error('❌ Error syncing destination map:', error);
                }
            }

            // Clear any pending map updates before switching to avoid bleeding them to the new map
            if (mapUpdateBatcher && typeof mapUpdateBatcher.clear === 'function') {
                mapUpdateBatcher.clear();
            }

             // MULTIPLAYER: Emit gm_switch_view socket event to server
             // Server will update GM's currentMapId and send back map data
             if (gameStoreState.isInMultiplayer && gameStoreState.multiplayerSocket?.connected && gameStoreState.isGMMode) {
                  gameStoreState.multiplayerSocket.emit('gm_switch_view', {
                      newMapId: mapId,
                      mapName: maps.find(m => m.id === mapId)?.name || 'Untitled Map'
                  });
                 // The server will respond with gm_view_changed event containing / map data
                 // The handler in MultiplayerApp.jsx will apply to map data
                // Note: We still continue with local switch for immediate response
            }

                // Save current map state before switching (unless explicitly skipped)
            if (!skipSaveCurrentState) {
                // Get the actual state data from stores
                 const levelEditorStoreState = useLevelEditorStore.getState();
 
                  // CRITICAL FIX: Save the CURRENT map (the one we're switching FROM), not the target
                  await saveCurrentMapState(gameStoreState, levelEditorStoreState, currentMapId);
  
                  // CRITICAL FIX: Wait for Firebase to sync before switching maps
                  // This prevents the new map from being overwritten with old data
                  await new Promise(resolve => setTimeout(resolve, 100));
                  
                  // CRITICAL FIX: In multiplayer GM mode, sync map state to server
                  // This ensures grid items and other map data are persisted to Firebase
                  if (gameStoreState.isInMultiplayer && gameStoreState.isGMMode) {
                     const mapState = await getMapState();
                     if (mapState) {
                         // Get the map object to get its name
                         const map = maps.find(m => m.id === currentMapId);
                         gameStoreState.multiplayerSocket.emit('sync_map_state', {
                             mapId: currentMapId,
                             mapName: map?.name, // CRITICAL: Send map name to ensure proper display
                             gridItems: mapState.gridItems,
                             tokens: mapState.tokens,
                             characterTokens: mapState.characterTokens,
                             terrainData: mapState.terrainData,
                             wallData: mapState.wallData,
                             drawingPaths: mapState.drawingPaths,
                             drawingLayers: mapState.drawingLayers,
                             fogOfWarData: mapState.fogOfWarData,
                             fogOfWarPaths: mapState.fogOfWarPaths,
                             fogErasePaths: mapState.fogErasePaths,
                             dndElements: mapState.dndElements,
                             backgrounds: mapState.backgrounds,
                             activeBackgroundId: mapState.activeBackgroundId,
                             environmentalObjects: mapState.environmentalObjects,
                             lightSources: mapState.lightSources,
                             exploredAreas: mapState.exploredAreas
                         });
                     }
                  }
            }

            // Switch to new map - but SKIP local switch if in multiplayer (server handles it)
            let success = false;
            if (gameStoreState.isInMultiplayer && gameStoreState.isGMMode) {
                console.log('🗺️ GM in multiplayer mode - skipping local switch, waiting for server data');
                success = true; // Server will handle the switch via gm_view_changed event
            } else {
                // Single player or non-GM mode - use local switch
                success = switchToMap(mapId);
            }
            if (!success) {
                console.error('Failed to switch to map:', mapId);
                // CRITICAL FIX: Force set currentMapId even if switchToMap fails
                // This ensures terrain updates use the correct targetMapId
                console.log('🔧 Force-setting mapStore.currentMapId to:', mapId);
                useMapStore.setState({ currentMapId: mapId });
            } else {
                console.log('✅ Successfully switched to map, currentMapId is now:', mapId);
            }

            // Get the target map data directly from the maps array
            const targetMap = maps.find(m => m.id === mapId);
 
            // CRITICAL: Only load local map data if NOT in multiplayer GM mode
            // In multiplayer GM mode, server sends all map data via gm_view_changed event
            let mapState = null;
            if (!(gameStoreState.isInMultiplayer && gameStoreState.isGMMode)) {
                // Load new map state (fallback to map data if state not found)
                mapState = loadMapState();

                // If no map state found, use the map data directly (for newly created maps)
                if (!mapState && targetMap) {
                    console.log('No map state found, using map data directly');
                    mapState = {
                        backgrounds: targetMap.backgrounds || [],
                        activeBackgroundId: targetMap.activeBackgroundId || null,
                        backgroundImage: targetMap.backgroundImage || null,
                        backgroundImageUrl: targetMap.backgroundImageUrl || '',
                        creatures: [],
                        tokens: [],
                        cameraX: 0,
                        cameraY: 0,
                        zoomLevel: 1.0,
                        gridSize: 50,
                        gridOffsetX: 0,
                        gridOffsetY: 0,
                        gridLineColor: 'rgba(64, 196, 255, 0.3)',
                        gridLineThickness: 1,
                        terrainData: {},
                        environmentalObjects: [],
                        dndElements: [],
                        fogOfWarData: {},
                        fogOfWarPaths: [],
                        fogErasePaths: [],
                        wallData: {},
                        drawingPaths: [],
                        drawingLayers: []
                    };
                }
            } else {
                console.log('🗺️ Multiplayer GM mode - loading local items from mapStore, server will merge via gm_view_changed');
                // CRITICAL FIX: Even in multiplayer mode, load local items from mapStore to avoid losing them
                // The server's gm_view_changed will handle merging with server state
                mapState = loadMapState();
                if (!mapState && targetMap) {
                    mapState = {
                        backgrounds: [],
                        activeBackgroundId: null,
                        gridItems: [] // Important: Load items from local mapStore
                    };
                }
             }

            if (mapState) {
                // Clear and set backgrounds in a single operation to prevent conflicts
                useGameStore.setState({
                    backgrounds: mapState.backgrounds || [],
                    activeBackgroundId: mapState.activeBackgroundId,
                    // Sync grid settings
                    gridSize: mapState.gridSize || 50,
                    gridOffsetX: mapState.gridOffsetX || 0,
                    gridOffsetY: mapState.gridOffsetY || 0,
                    gridLineColor: mapState.gridLineColor || 'rgba(0, 0, 0, 0.5)',
                    gridLineThickness: mapState.gridLineThickness || 1,
                    // Clear legacy backgrounds to prevent conflicts
                    backgroundImage: null,
                    backgroundImageUrl: ''
                });

                // Use the game store directly to ensure functions exist
                const gameStoreState = useGameStore.getState();

                // Clear existing tokens first, then load new ones
                // This ensures tokens don't persist between maps
                const { default: useCreatureStore } = await import('../../store/creatureStore');
                const { default: useCharacterTokenStore } = await import('../../store/characterTokenStore');

                // Clear all tokens before loading new map's tokens
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

                // Set other game state
                if (gameStoreState.setCreatures) {
                    gameStoreState.setCreatures(mapState.creatures || []);
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

                // Update camera and view settings
                if (gameStoreState.setCameraAndZoom) {
                    gameStoreState.setCameraAndZoom(mapState.cameraX, mapState.cameraY, mapState.zoomLevel);
                }

                // Update grid settings
                if (gameStoreState.setGridState) {
                    gameStoreState.setGridState(
                        mapState.gridSize,
                        mapState.gridOffsetX,
                        mapState.gridOffsetY,
                        mapState.gridLineColor,
                        mapState.gridLineThickness
                    );
                }

                // Update level editor store with new map data
                const levelEditorState = useLevelEditorStore.getState();

                if (levelEditorState.setTerrainData) {
                    levelEditorState.setTerrainData(mapState.terrainData || {});
                }
                if (levelEditorState.setEnvironmentalObjects) {
                    levelEditorState.setEnvironmentalObjects(mapState.environmentalObjects || []);
                }
                if (levelEditorState.setDndElements) {
                    levelEditorState.setDndElements(mapState.dndElements || []);
                }
                // Always clear and load fog data for the new map (don't persist between maps)
                if (levelEditorState.setFogOfWarData) {
                    levelEditorState.setFogOfWarData(mapState.fogOfWarData || {});
                }
                // Always clear and load fog paths for the new map (critical: fog should not persist)
                if (levelEditorState.setFogOfWarPaths) {
                    // Clear existing fog paths first, then load new map's fog paths
                    levelEditorState.setFogOfWarPaths(mapState.fogOfWarPaths || []);
                }
                if (levelEditorState.setFogErasePaths) {
                    // Clear existing fog erase paths first, then load new map's fog erase paths
                    levelEditorState.setFogErasePaths(mapState.fogErasePaths || []);
                }
                if (levelEditorState.setWallData) {
                    levelEditorState.setWallData(mapState.wallData || {});
                }
                // Always clear and load drawings for the new map
                if (levelEditorState.setDrawingPaths) {
                    levelEditorState.setDrawingPaths(mapState.drawingPaths || []);
                }
                if (levelEditorState.setDrawingLayers) {
                    // Use default layers if none exist, otherwise use saved layers
                    const defaultLayers = [
                        { id: 'background', name: 'Background', visible: true, locked: false },
                        { id: 'terrain', name: 'Terrain', visible: true, locked: false },
                        { id: 'drawings', name: 'Drawings', visible: true, locked: false },
                        { id: 'walls', name: 'Walls', visible: true, locked: false },
                        { id: 'objects', name: 'Objects', visible: true, locked: false },
                        { id: 'lighting', name: 'Lighting', visible: true, locked: false },
                        { id: 'fog', name: 'Fog of War', visible: true, locked: false },
                        { id: 'grid', name: 'Grid', visible: true, locked: false },
                        { id: 'overlay', name: 'Overlay', visible: true, locked: false }
                    ];
                    levelEditorState.setDrawingLayers(mapState.drawingLayers && mapState.drawingLayers.length > 0
                        ? mapState.drawingLayers
                        : defaultLayers);
                }

                // Update grid items store - merge items, don't replace entire store
                const { default: useGridItemStore } = await import('../../store/gridItemStore');
                if (useGridItemStore) {
                    // CRITICAL FIX: Replace entire gridItems array with map-specific items
                    // This prevents duplicates and ensures clean state when switching maps
                    useGridItemStore.setState({ gridItems: mapState.gridItems || [] });
                }

            } else {
                // No map state found
            }
 
            console.log(`[Map] Switched to: ${maps.find(m => m.id === mapId)?.name}`);
        } catch (error) {
            console.error('Error switching maps:', error);
        }
    };

    // Handle map creation
    const handleCreateMap = () => {
        console.log('[Map Creation] Starting map creation with name:', mapCreationWizard.name.trim());
        if (!mapCreationWizard.name.trim()) {
            alert('Please enter a map name');
            return;
        }

        const backgroundId = Date.now().toString();
        const mapData = {
            name: mapCreationWizard.name.trim(),
            backgrounds: mapCreationWizard.backgroundImage ? [{
                id: backgroundId,
                url: mapCreationWizard.backgroundImage,
                position: { x: 0, y: 0 },
                scale: 1.0,
                opacity: 1.0,
                zIndex: 0,
                name: 'Background'
            }] : [],
            activeBackgroundId: mapCreationWizard.backgroundImage ? backgroundId : null,
            // Clear legacy background fields to prevent conflicts
            backgroundImage: null,
            backgroundImageUrl: ''
        };

        const newMapId = createMapWithoutSwitching(mapData);
        console.log('[Map Creation] Map created with ID:', newMapId, 'name:', mapData.name);

        // Ensure that map data is properly saved by updating it immediately
        if (newMapId && updateMap) {
            console.log('[Map Creation] About to update map:', newMapId, 'with data:', mapData);
            updateMap(newMapId, mapData);
        }

        closeMapCreationWizard();

        // Get updated maps list after creation
        const updatedMaps = useMapStore.getState().maps;
        console.log('[Map Creation] Maps in store:', updatedMaps);
        const newMap = updatedMaps.find(m => m.id === newMapId);
        const currentMap = updatedMaps.find(m => m.id === currentMapId);

        // Success message or feedback could go here if needed
        console.log(`Successfully created map: ${mapData.name}`);

    };

    // File size validation constants
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const MAX_FILE_SIZE_MB = 10;

    // Handle background image upload for map creation
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            alert(`File size too large! Please choose an image smaller than ${MAX_FILE_SIZE_MB}MB.\n\nCurrent file size: ${(file.size / (1024 * 1024)).toFixed(1)}MB\n\nLarge files can cause the application to crash due to browser storage limitations.`);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        try {
            // Import compression utility
            const { compressImage } = await import('../../utils/imageCompression');

            // Compress image before storing (max 1920px width for map backgrounds, quality 0.85)
            console.log('🖼️ Compressing background image for map creation... Original size:', (file.size / 1024).toFixed(1), 'KB');
            const compressedFile = await compressImage(file, 1920, null, 0.85);
            console.log('🗜️ Image compressed to:', (compressedFile.size / 1024).toFixed(1), 'KB');

            const reader = new FileReader();
            reader.onload = (e) => {
                updateMapCreationWizard({ backgroundImage: e.target.result });
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            };
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.error('❌ Image compression failed:', error);
            alert('Failed to compress image. Please try a different image or a smaller file.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Handle map deletion
    const handleDeleteMap = (mapId) => {
        if (maps.length <= 1) {
            alert('Cannot delete the last remaining map');
            return;
        }

        const mapToDelete = maps.find(m => m.id === mapId);
        setPendingMapDelete(mapToDelete);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteMap = () => {
        if (pendingMapDelete) {
            deleteMap(pendingMapDelete.id);
            setPendingMapDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    const cancelDeleteMap = () => {
        setPendingMapDelete(null);
        setShowDeleteConfirm(false);
    };

    // Handle map switch confirmation
    const handleConfirmSwitch = () => {
        if (pendingMapSwitch) {
            // Skip saving current state if this is a newly created map to preserve its background
            const skipSave = pendingMapSwitch.isNewlyCreated || false;
            handleMapSwitch(pendingMapSwitch.newMapId, skipSave);
        }
        setShowSwitchConfirm(false);
        setPendingMapSwitch(null);
    };

    const handleStayOnCurrentMap = () => {
        setShowSwitchConfirm(false);
        setPendingMapSwitch(null);
    };

    // Handle map editing
    const handleEditMap = (mapId) => {
        // Clear any pending map updates before switching to avoid bleeding them to the new map
        if (mapUpdateBatcher && typeof mapUpdateBatcher.clear === 'function') {
            mapUpdateBatcher.clear();
        }

        const map = maps.find(m => m.id === mapId);
        if (map) {
            setEditingMapId(mapId);
            setEditMapName(map.name);
            setEditMapDescription(map.description || '');
        }
    };

    const handleSaveMapEdit = () => {
        if (editingMapId) {
            updateMap(editingMapId, {
                name: editMapName,
                description: editMapDescription
            });
            setEditingMapId(null);
            setEditMapName('');
            setEditMapDescription('');
        }
    };

    const handleCancelMapEdit = () => {
        setEditingMapId(null);
        setEditMapName('');
        setEditMapDescription('');
    };

    // Handle background assignment to existing maps
    const handleAssignBackground = (mapId) => {
        setShowBackgroundAssignment(mapId);
        // Trigger file input
        if (backgroundFileInputRef.current) {
            backgroundFileInputRef.current.click();
        }
    };

    // Handle Asset Selection
    const handleOpenAssetSelector = (type, mapId = null) => {
        setAssetSelectorType(type);
        setTargetMapForAsset(mapId);
        setShowAssetSelector(true);
    };

    const handleSelectAsset = (bgName) => {
        const bgUrl = getBackgroundUrl(bgName);

        if (assetSelectorType === 'wizard') {
            updateMapCreationWizard({ backgroundImage: bgUrl });
        } else if (assetSelectorType === 'assign' && targetMapForAsset) {
            const backgroundId = Date.now().toString();
            updateMap(targetMapForAsset, {
                backgrounds: [{
                    id: backgroundId,
                    url: bgUrl,
                    name: bgName.replace('.png', ''),
                    position: { x: 0, y: 0 },
                    scale: 1.0,
                    opacity: 1.0,
                    zIndex: 0
                }],
                activeBackgroundId: backgroundId,
                backgroundImage: null,
                backgroundImageUrl: ''
            });
        }

        setShowAssetSelector(false);
        setAssetSelectorType(null);
        setTargetMapForAsset(null);
    };

    const handleBackgroundUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !showBackgroundAssignment) return;

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            alert(`File size too large! Please choose an image smaller than ${MAX_FILE_SIZE_MB}MB.\n\nCurrent file size: ${(file.size / (1024 * 1024)).toFixed(1)}MB\n\nLarge files can cause the application to crash due to browser storage limitations.`);
            // Reset file input and state
            if (backgroundFileInputRef.current) {
                backgroundFileInputRef.current.value = '';
            }
            setShowBackgroundAssignment(null);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            if (backgroundFileInputRef.current) {
                backgroundFileInputRef.current.value = '';
            }
            setShowBackgroundAssignment(null);
            return;
        }

        try {
            // Import compression utility
            const { compressImage } = await import('../../utils/imageCompression');

            // Compress image before storing (max 1920px width for map backgrounds, quality 0.85)
            console.log('🖼️ Compressing background image... Original size:', (file.size / 1024).toFixed(1), 'KB');
            const compressedFile = await compressImage(file, 1920, null, 0.85);
            console.log('🗜️ Image compressed to:', (compressedFile.size / 1024).toFixed(1), 'KB');

            const reader = new FileReader();
            reader.onload = (e) => {
                const backgroundUrl = e.target.result;

                // Create background ID
                const backgroundId = Date.now().toString();

                // Update the map with the new background (replace all existing backgrounds)
                // NOTE: This is just for preview in the map library - it won't automatically apply to the grid
                // Users need to use the "Upload Background" button in the editor to actually set it as a grid background
                updateMap(showBackgroundAssignment, {
                    backgrounds: [{
                        id: backgroundId,
                        url: backgroundUrl,
                        name: 'Map Background',
                        position: { x: 0, y: 0 },
                        scale: 1.0,
                        opacity: 1.0,
                        zIndex: 0
                    }],
                    activeBackgroundId: backgroundId,
                    // Clear legacy background fields to prevent conflicts
                    backgroundImage: null,
                    backgroundImageUrl: ''
                });

                // DON'T automatically apply to gameStore - this is just a preview image
                // Users should use the editor's "Upload Background" feature to set grid backgrounds

                setShowBackgroundAssignment(null);

                // Reset file input
                if (backgroundFileInputRef.current) {
                    backgroundFileInputRef.current.value = '';
                }
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
                if (backgroundFileInputRef.current) {
                    backgroundFileInputRef.current.value = '';
                }
                setShowBackgroundAssignment(null);
            };
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.error('❌ Image compression failed:', error);
            alert('Failed to compress image. Please try a different image or a smaller file.');
            if (backgroundFileInputRef.current) {
                backgroundFileInputRef.current.value = '';
            }
            setShowBackgroundAssignment(null);
        }
    };

    // Format date for display
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <WowWindow
                title="Map Library"
                isOpen={isOpen}
                onClose={onClose}
                defaultSize={{ width: 900, height: 700 }}
                defaultPosition={{ x: 100, y: 100 }}
                centerTitle={true}
            >
                <div className="map-library-window">
                    {/* Map Grid with Create Button */}
                    <div
                        className="map-grid"
                        ref={mapGridRef}
                    >
                        {/* Create New Map card at the top of the grid */}
                        <div
                            className="create-map-container"
                            onClick={openMapCreationWizard}
                        >
                            <div className="create-map-content">
                                <div className="create-map-icon">+</div>
                                <div className="create-map-text">Create New Map</div>
                            </div>
                        </div>
                        {maps.map(map => {
                            const playersOnMap = getPlayersOnMap(map.id);
                            const isDropTarget = dropTargetMapId === map.id;

                            return (
                                <div
                                    key={map.id}
                                    className={`map-card ${map.id === currentMapId ? 'current' : ''} ${selectedMapId === map.id ? 'selected' : ''} ${isDropTarget ? 'drop-target' : ''}`}
                                    onClick={() => setSelectedMapId(map.id)}
                                    onDoubleClick={() => handleMapSwitchRequest(map.id)}
                                    onDragOver={(e) => handleMapDragOver(e, map.id)}
                                    onDragLeave={handleMapDragLeave}
                                    onDrop={(e) => handlePlayerDrop(e, map.id)}
                                >
                                    {/* Map thumbnail */}
                                    <div className="map-thumbnail">
                                        {(map.thumbnailUrl || (map.backgrounds && map.backgrounds.length > 0)) ? (
                                            <img
                                                src={map.thumbnailUrl || (map.backgrounds && map.backgrounds[0].url)}
                                                alt={map.name}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="map-placeholder" style={{
                                            display: (map.backgrounds && map.backgrounds.length > 0) ? 'none' : 'flex'
                                        }}>
                                            <div className="map-icon"><FaImage /></div>
                                            <div className="map-placeholder-text">No Background</div>
                                        </div>

                                        {/* Player indicators overlay on thumbnail */}
                                        {isInMultiplayer && playersOnMap.length > 0 && (
                                            <div className="map-players-indicator">
                                                <FaUsers style={{ marginRight: '4px' }} />
                                                <span>{playersOnMap.length}</span>
                                            </div>
                                        )}
                                        {/* Player/GM Indicators */}
                                        {map.id === currentMapId && (
                                            <div className="map-view-indicator">
                                                <FaUserAlt style={{ marginRight: '4px' }} title="You are currently viewing this map" />
                                                <span>YOU ARE HERE</span>
                                            </div>
                                        )}

                                        {/* GM Location Indicator (for Players) */}
                                        {isInMultiplayer && !isGMMode && (() => {
                                            const gmMember = partyMembers.find(m => m.isGM || m.id === usePartyStore.getState().leaderId);
                                            const gmMapId = gmMember ? (playerMapAssignments[gmMember.id] || 'default') : null;
                                            return gmMapId === map.id && map.id !== currentMapId;
                                        })() && (
                                                <div className="map-view-indicator gm-indicator" style={{ backgroundColor: 'rgba(255, 215, 0, 0.8)', border: '1px solid #ffd700' }}>
                                                    <span style={{ color: '#000', fontWeight: 'bold' }}>GM VIEWING</span>
                                                </div>
                                            )}
                                    </div>

                                    {/* Map info */}
                                    <div className="map-info">
                                        <h3 className="map-name">{map.name}</h3>
                                        <div className="map-details">
                                            {map.description && (
                                                <div className="map-description">
                                                    {map.description}
                                                </div>
                                            )}
                                            <span className="map-date">
                                                Modified: {formatDate(map.lastModified)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Map actions */}
                                    <div className="map-actions">
                                        <button
                                            className="wow-button small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMapSwitchRequest(map.id);
                                            }}
                                            disabled={map.id === currentMapId}
                                        >
                                            <FaExchangeAlt style={{ marginRight: '4px' }} />
                                            {map.id === currentMapId ? 'Viewing' : 'Switch'}
                                        </button>
                                        <button
                                            className="wow-button small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditMap(map.id);
                                            }}
                                            title="Edit Map Name & Description"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="wow-button small"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleOpenAssetSelector('assign', map.id);
                                            }}
                                            title="Assign Background"
                                        >
                                            <FaImage style={{ marginRight: '4px' }} />
                                            Image
                                        </button>
                                        <button
                                            className="wow-button small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                duplicateMap(map.id);
                                            }}
                                        >
                                            <FaCopy style={{ marginRight: '4px' }} />
                                            Copy
                                        </button>
                                        <button
                                            className="wow-button small danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteMap(map.id);
                                            }}
                                            disabled={maps.length <= 1}
                                        >
                                            <FaTrash style={{ marginRight: '4px' }} />
                                            Delete
                                        </button>
                                    </div>

                                    {/* Draggable player list (GM only, in multiplayer) */}
                                    {isInMultiplayer && isGMMode && playersOnMap.length > 0 && (
                                        <div className="map-players-list">
                                            {playersOnMap.map(player => (
                                                <div
                                                    key={player.id}
                                                    className="map-player-chip"
                                                    draggable
                                                    onDragStart={(e) => handlePlayerDragStart(e, player)}
                                                    title={`Drag to transfer ${player.name || player.characterName || 'Player'} to another map`}
                                                >
                                                    {player.id === usePartyStore.getState().leaderId ? (
                                                        <span style={{ color: '#ffd700', marginRight: '4px', fontSize: '10px' }}>👑</span>
                                                    ) : (
                                                        <FaUserAlt style={{ marginRight: '4px', fontSize: '10px' }} />
                                                    )}
                                                    <span>{player.name || player.characterName || 'Player'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </WowWindow>

            {/* Map Creation Wizard */}
            {mapCreationWizard.isOpen && (
                <WowWindow
                    title="Create New Map"
                    isOpen={true}
                    onClose={closeMapCreationWizard}
                    defaultSize={{ width: 500, height: 400 }}
                    defaultPosition={{ x: 200, y: 200 }}
                >
                    <div className="map-creation-wizard">
                        <div className="wizard-step">
                            <label className="wizard-label">
                                Map Name:
                                <input
                                    type="text"
                                    className="wow-input"
                                    value={mapCreationWizard.name}
                                    onChange={(e) => updateMapCreationWizard({ name: e.target.value })}
                                    placeholder="Enter map name..."
                                    autoFocus
                                />
                            </label>

                            <div className="wizard-label">
                                Background Image (Optional):
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <div className="wizard-button-group">
                                    <button
                                        className="wow-button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleOpenAssetSelector('wizard');
                                        }}
                                        style={{ width: '100%' }}
                                    >
                                        <FaImage style={{ marginRight: '8px' }} />
                                        Select Image
                                    </button>
                                </div>
                                {mapCreationWizard.backgroundImage && (
                                    <div className="image-preview">
                                        <img
                                            src={mapCreationWizard.backgroundImage}
                                            alt="Preview"
                                            style={{ maxWidth: '200px', maxHeight: '150px' }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="wizard-actions">
                            <button
                                className="wow-button"
                                onClick={closeMapCreationWizard}
                            >
                                Cancel
                            </button>
                            <button
                                className="wow-button primary"
                                onClick={handleCreateMap}
                                disabled={!mapCreationWizard.name.trim()}
                            >
                                Create Map
                            </button>
                        </div>
                    </div>
                </WowWindow>
            )}

            {/* Asset Selector Modal */}
            {showAssetSelector && ReactDOM.createPortal(
                <div
                    className="character-appearance-modal-overlay"
                    style={{ zIndex: 100000 }}
                    onClick={() => setShowAssetSelector(false)}
                >
                    <div
                        className="character-appearance-modal"
                        style={{ maxWidth: '800px', width: '90%' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="character-appearance-modal-header">
                            <h3>Select Background Asset</h3>
                            <button
                                className="character-appearance-modal-close"
                                onClick={() => setShowAssetSelector(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="character-appearance-modal-body">
                            <div className="appearance-tabs" style={{ marginBottom: '20px' }}>
                                <button
                                    className={`appearance-tab ${activeSelectionTab === 'assets' ? 'active' : ''}`}
                                    onClick={() => setActiveSelectionTab('assets')}
                                >
                                    <i className="fas fa-images"></i> Assets Library
                                </button>
                                <button
                                    className={`appearance-tab ${activeSelectionTab === 'upload' ? 'active' : ''}`}
                                    onClick={() => setActiveSelectionTab('upload')}
                                >
                                    <i className="fas fa-upload"></i> Upload Custom
                                </button>
                            </div>

                            {activeSelectionTab === 'assets' ? (
                                <div className="appearance-background-grid" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                    {ALL_BACKGROUND_ASSETS.map(bg => (
                                        <div
                                            key={bg}
                                            className="appearance-background-option"
                                            style={{ backgroundImage: `url(/assets/backgrounds/${bg})`, height: '120px' }}
                                            onClick={() => handleSelectAsset(bg)}
                                            title={bg.replace('.png', '')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="appearance-upload-tab" style={{ padding: '20px', textAlign: 'center' }}>
                                    <label
                                        htmlFor="map-manual-upload"
                                        className="appearance-upload-area"
                                        style={{ border: '2px dashed var(--pf-brown-medium)', padding: '40px', display: 'block', cursor: 'pointer', borderRadius: '12px' }}
                                    >
                                        <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: 'var(--pf-gold)', marginBottom: '15px', display: 'block' }}></i>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--pf-text-primary)' }}>Click to select a file from your device</span>
                                        <small style={{ display: 'block', marginTop: '10px', color: 'var(--pf-text-secondary)' }}>Maximum file size: 10MB</small>
                                    </label>
                                    <input
                                        id="map-manual-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (assetSelectorType === 'wizard') {
                                                handleImageUpload(e);
                                            } else {
                                                setShowBackgroundAssignment(targetMapForAsset);
                                                handleBackgroundUpload(e);
                                            }
                                            setShowAssetSelector(false);
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="character-appearance-modal-footer">
                            <button className="appearance-done-btn" onClick={() => setShowAssetSelector(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Hidden file input for background assignment */}
            <input
                ref={backgroundFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                style={{ display: 'none' }}
            />

            {/* Map Switch Confirmation Dialog */}
            <MapSwitchConfirmDialog
                isOpen={showSwitchConfirm}
                onClose={() => setShowSwitchConfirm(false)}
                onConfirm={handleConfirmSwitch}
                onStay={handleStayOnCurrentMap}
                newMapName={pendingMapSwitch?.newMapName || ''}
                thumbnail={pendingMapSwitch?.thumbnail || null}
                position={{ x: 450, y: 250 }}
            />

            {/* Map Delete Confirmation Dialog */}
            <MapDeleteConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={cancelDeleteMap}
                onConfirm={confirmDeleteMap}
                mapName={pendingMapDelete?.name || ''}
                position={{ x: 450, y: 250 }}
            />

            {/* Map Edit Dialog */}
            {editingMapId && (
                <WowWindow
                    title="Edit Map"
                    isOpen={true}
                    onClose={handleCancelMapEdit}
                    defaultSize={{ width: 500, height: 350 }}
                    defaultPosition={{ x: 400, y: 200 }}
                    isModal={true}
                >
                    <div className="map-edit-dialog">
                        <div className="edit-field">
                            <label className="edit-label">Map Name</label>
                            <input
                                type="text"
                                className="wow-input"
                                value={editMapName}
                                onChange={(e) => setEditMapName(e.target.value)}
                                placeholder="Enter map name..."
                            />
                        </div>

                        <div className="edit-field">
                            <label className="edit-label">Description</label>
                            <textarea
                                className="wow-textarea"
                                value={editMapDescription}
                                onChange={(e) => setEditMapDescription(e.target.value)}
                                placeholder="Enter map description..."
                                rows={6}
                            />
                        </div>

                        <div className="edit-actions">
                            <button
                                className="wow-button secondary"
                                onClick={handleCancelMapEdit}
                            >
                                Cancel
                            </button>
                            <button
                                className="wow-button primary"
                                onClick={handleSaveMapEdit}
                                disabled={!editMapName.trim()}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </WowWindow>
            )}
        </>
    );
};

export default MapLibraryWindow;
