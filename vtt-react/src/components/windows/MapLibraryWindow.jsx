import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { FaImage, FaCopy, FaTrash, FaExchangeAlt } from 'react-icons/fa';
import WowWindow from './WowWindow';
import useMapStore from '../../store/mapStore';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
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

    // Get real-time data from stores for reactive updates
    const { dndElements } = useLevelEditorStore();
    const { tokens } = useCreatureStore(); // Use tokens to count creatures on the map

    // Background management from game store
    const addBackground = useGameStore(state => state.addBackground);
    const setActiveBackground = useGameStore(state => state.setActiveBackground);
    const setBackgroundImage = useGameStore(state => state.setBackgroundImage);
    const setBackgroundImageUrl = useGameStore(state => state.setBackgroundImageUrl);



    // Handle map switching request (shows confirmation dialog)
    const handleMapSwitchRequest = (mapId) => {
        if (mapId === currentMapId) return;

        const targetMap = maps.find(m => m.id === mapId);
        const currentMap = maps.find(m => m.id === currentMapId);

        // Show confirmation dialog for map switching
        setPendingMapSwitch({
            newMapId: mapId,
            newMapName: targetMap?.name || 'Unknown Map',
            currentMapName: currentMap?.name || 'Current Map'
        });
        setShowSwitchConfirm(true);
    };

    // Actual map switching with state preservation
    const handleMapSwitch = async (mapId, skipSaveCurrentState = false) => {
        if (mapId === currentMapId) return;

        try {
            console.log('Starting map switch to:', mapId);

            // Save current map state before switching (unless explicitly skipped)
            if (!skipSaveCurrentState) {
                // Get the actual state data from the stores
                const gameStoreState = useGameStore.getState();
                const levelEditorStoreState = useLevelEditorStore.getState();

                // Debug: Log what we're saving
                console.log('Saving map state:', {
                    mapId: currentMapId,
                    drawingPaths: levelEditorStoreState.drawingPaths?.length || 0,
                    fogOfWarPaths: levelEditorStoreState.fogOfWarPaths?.length || 0,
                    fogErasePaths: levelEditorStoreState.fogErasePaths?.length || 0,
                    fogOfWarData: Object.keys(levelEditorStoreState.fogOfWarData || {}).length
                });

                await saveCurrentMapState(gameStoreState, levelEditorStoreState);
            }

            // Switch to new map
            const success = switchToMap(mapId);
            if (!success) {
                console.error('Failed to switch to map:', mapId);
                return;
            }

            // Get the target map data directly from the maps array
            const targetMap = maps.find(m => m.id === mapId);
            console.log('Target map data:', targetMap);

            // Load new map state (fallback to map data if state not found)
            let mapState = loadMapState();

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

            console.log('Final map state to load:', mapState);

            if (mapState) {
                console.log('Loading map state for map:', mapId);
                console.log('Map state backgrounds:', mapState.backgrounds);
                console.log('Map state activeBackgroundId:', mapState.activeBackgroundId);

                // Clear and set backgrounds in a single operation to prevent conflicts
                console.log('Setting backgrounds to game store:', mapState.backgrounds);
                useGameStore.setState({
                    backgrounds: mapState.backgrounds || [],
                    activeBackgroundId: mapState.activeBackgroundId,
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

                // Update grid items store
                const { default: useGridItemStore } = await import('../../store/gridItemStore');
                if (useGridItemStore && mapState.gridItems) {
                    useGridItemStore.setState({ gridItems: mapState.gridItems || [] });
                }

                console.log('Map switch completed. Current game store state:');
                const finalGameState = useGameStore.getState();
                console.log('- Backgrounds:', finalGameState.backgrounds);
                console.log('- Active background:', finalGameState.activeBackgroundId);
                console.log('- Legacy background:', finalGameState.backgroundImage);
            } else {
                console.log('No map state found for map:', mapId);
            }

            console.log(`Successfully switched to map: ${maps.find(m => m.id === mapId)?.name}`);
        } catch (error) {
            console.error('Error switching maps:', error);
        }
    };

    // Handle map creation
    const handleCreateMap = () => {
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

        console.log('Creating map with data:', mapData);
        const newMapId = createMapWithoutSwitching(mapData);
        console.log('Created map with ID:', newMapId);

        // Ensure the map data is properly saved by updating it immediately
        if (newMapId && updateMap) {
            console.log('Updating newly created map with background data');
            updateMap(newMapId, mapData);
        }

        closeMapCreationWizard();

        // Get updated maps list after creation
        const updatedMaps = useMapStore.getState().maps;
        const newMap = updatedMaps.find(m => m.id === newMapId);
        const currentMap = updatedMaps.find(m => m.id === currentMapId);

        console.log('New map found:', newMap);
        console.log('New map backgrounds:', newMap?.backgrounds);

        // Show confirmation dialog for map switching
        setPendingMapSwitch({
            newMapId: newMapId,
            newMapName: newMap?.name || 'New Map',
            currentMapName: currentMap?.name || 'Current Map',
            isNewlyCreated: true // Mark this as a newly created map to preserve its background
        });
        setShowSwitchConfirm(true);
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
                        onWheel={(e) => {
                            // Ensure wheel events are handled by the grid container
                            // Stop propagation to prevent parent window-content from trying to scroll
                            if (mapGridRef.current) {
                                e.stopPropagation();
                            }
                        }}
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
                        {maps.map(map => (
                            <div
                                key={map.id}
                                className={`map-card ${map.id === currentMapId ? 'current' : ''} ${selectedMapId === map.id ? 'selected' : ''}`}
                                onClick={() => setSelectedMapId(map.id)}
                                onDoubleClick={() => handleMapSwitchRequest(map.id)}
                            >
                                {/* Map thumbnail */}
                                <div className="map-thumbnail">

                                    {map.backgrounds && map.backgrounds.length > 0 ? (
                                        <img
                                            src={map.backgrounds[0].url}
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
                                        <div className="map-icon">⚔</div>
                                        <div className="map-placeholder-text">No Background</div>
                                    </div>
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
                                        {map.id === currentMapId ? 'Active' : 'Switch'}
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
                            </div>
                        ))}
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
