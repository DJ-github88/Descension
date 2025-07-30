import React, { useState, useRef } from 'react';
import WowWindow from './WowWindow';
import useMapStore from '../../store/mapStore';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import MapSwitchConfirmDialog from '../dialogs/MapSwitchConfirmDialog';
import './styles/MapLibraryWindow.css';

const MapLibraryWindow = ({ isOpen, onClose }) => {
    const [selectedMapId, setSelectedMapId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
    const [pendingMapSwitch, setPendingMapSwitch] = useState(null);
    const [showBackgroundAssignment, setShowBackgroundAssignment] = useState(null);
    const [activeTab, setActiveTab] = useState('library');
    const fileInputRef = useRef(null);
    const backgroundFileInputRef = useRef(null);

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
                saveCurrentMapState(gameStore, levelEditorStore);
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
                    fogOfWarData: {}
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

                // Set other game state
                if (gameStoreState.setCreatures) {
                    gameStoreState.setCreatures(mapState.creatures || []);
                }
                if (gameStoreState.setTokens) {
                    gameStoreState.setTokens(mapState.tokens || []);
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
                if (levelEditorState.setFogOfWarData) {
                    levelEditorState.setFogOfWarData(mapState.fogOfWarData || {});
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
    const handleImageUpload = (event) => {
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
        reader.readAsDataURL(file);
    };

    // Handle map deletion
    const handleDeleteMap = (mapId) => {
        if (maps.length <= 1) {
            alert('Cannot delete the last remaining map');
            return;
        }

        const mapToDelete = maps.find(m => m.id === mapId);
        if (window.confirm(`Are you sure you want to delete "${mapToDelete?.name}"? This action cannot be undone.`)) {
            deleteMap(mapId);
            setShowDeleteConfirm(null);
        }
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

    // Handle background assignment to existing maps
    const handleAssignBackground = (mapId) => {
        setShowBackgroundAssignment(mapId);
        // Trigger file input
        if (backgroundFileInputRef.current) {
            backgroundFileInputRef.current.click();
        }
    };

    const handleBackgroundUpload = (event) => {
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

        const reader = new FileReader();
        reader.onload = (e) => {
            const backgroundUrl = e.target.result;

            // Create background ID
            const backgroundId = Date.now().toString();

            // Update the map with the new background (replace all existing backgrounds)
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

            // If this is the current map, immediately apply the background
            if (showBackgroundAssignment === currentMapId) {
                // Clear existing backgrounds first
                useGameStore.setState({
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
                    backgroundImage: null,
                    backgroundImageUrl: ''
                });
            }

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
        reader.readAsDataURL(file);
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
                customHeader={
                    <div className="spellbook-tab-headers">
                        <button
                            className={`spellbook-tab ${activeTab === 'current' ? 'active' : ''}`}
                            onClick={() => setActiveTab('current')}
                        >
                            <span>Current Map: {maps.find(m => m.id === currentMapId)?.name || 'None'}</span>
                        </button>
                        <button
                            className={`spellbook-tab ${activeTab === 'library' ? 'active' : ''}`}
                            onClick={() => setActiveTab('library')}
                        >
                            <span>Map Library</span>
                        </button>
                        <button
                            className="spellbook-tab create-map-tab"
                            onClick={openMapCreationWizard}
                        >
                            <span>+ Create New Map</span>
                        </button>
                    </div>
                }
            >
                <div className="map-library-window">
                    {/* Render content based on active tab */}
                    {activeTab === 'current' && (
                        <div className="current-map-view">
                            <div className="current-map-details">
                                <h2>Current Map: {maps.find(m => m.id === currentMapId)?.name || 'None'}</h2>
                                <p>This is where current map details and controls would go.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'library' && (
                        <div className="map-grid">
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
                                        <span className="map-date">
                                            Modified: {formatDate(map.lastModified)}
                                        </span>
                                        <div className="map-stats">
                                            <span title="Terrain tiles">Terrain: {Object.keys(map.terrainData || {}).length}</span>
                                            <span title="Objects">Objects: {(map.environmentalObjects || []).length}</span>
                                            <span title="Portals">Portals: {(map.portals || []).length}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Map actions */}
                                <div className="map-actions">
                                    {map.id === currentMapId && (
                                        <span className="current-indicator">Current</span>
                                    )}
                                    <button
                                        className="wow-button small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMapSwitchRequest(map.id);
                                        }}
                                        disabled={map.id === currentMapId}
                                    >
                                        {map.id === currentMapId ? 'Active' : 'Switch'}
                                    </button>
                                    <button
                                        className="wow-button small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAssignBackground(map.id);
                                        }}
                                        title="Assign Background"
                                    >
                                        Image
                                    </button>
                                    <button
                                        className="wow-button small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            duplicateMap(map.id);
                                        }}
                                    >
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
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
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

                            <label className="wizard-label">
                                Background Image (Optional):
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    className="wow-button"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Choose Image
                                </button>
                                {mapCreationWizard.backgroundImage && (
                                    <div className="image-preview">
                                        <img
                                            src={mapCreationWizard.backgroundImage}
                                            alt="Preview"
                                            style={{ maxWidth: '200px', maxHeight: '150px' }}
                                        />
                                    </div>
                                )}
                            </label>
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
        </>
    );
};

export default MapLibraryWindow;
