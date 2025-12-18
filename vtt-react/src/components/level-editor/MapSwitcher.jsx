import React, { useState, useMemo } from 'react';
import useMapStore from '../../store/mapStore';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import './styles/MapSwitcher.css';

const MapSwitcher = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Map store
    const {
        maps,
        currentMapId,
        switchToMap,
        saveCurrentMapState,
        loadMapState,
        setMapLibraryOpen
    } = useMapStore();

    // Game and level editor stores for state synchronization
    const gameStore = useGameStore();
    const levelEditorStore = useLevelEditorStore();
    
    // Get real-time data from stores for reactive updates
    const { dndElements } = useLevelEditorStore();
    const { tokens } = useCreatureStore(); // Use tokens to count creatures on the map

    const currentMap = maps.find(m => m.id === currentMapId);

    // Handle map switching with state preservation
    const handleMapSwitch = async (mapId) => {
        if (mapId === currentMapId) return;

        try {
            // Save current map state before switching
            await saveCurrentMapState(gameStore, levelEditorStore);

            // Switch to new map
            const success = switchToMap(mapId);
            if (!success) {
                console.error('Failed to switch to map:', mapId);
                return;
            }

            // Load new map state
            const mapState = loadMapState();
            if (mapState) {
                // Clear existing tokens first before loading new map's tokens
                const { default: useCreatureStore } = await import('../../store/creatureStore');
                const { default: useCharacterTokenStore } = await import('../../store/characterTokenStore');
                
                // Clear all tokens
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

                // Update game store with new map data
                if (gameStore.setBackgrounds) {
                    gameStore.setBackgrounds(mapState.backgrounds);
                }
                if (gameStore.setActiveBackground) {
                    gameStore.setActiveBackground(mapState.activeBackgroundId);
                }
                if (gameStore.setCreatures) {
                    gameStore.setCreatures(mapState.creatures);
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
                if (gameStore.setCameraAndZoom) {
                    gameStore.setCameraAndZoom(mapState.cameraX, mapState.cameraY, mapState.zoomLevel);
                }

                // Update grid settings
                if (gameStore.setGridState) {
                    gameStore.setGridState(
                        mapState.gridSize,
                        mapState.gridOffsetX,
                        mapState.gridOffsetY,
                        mapState.gridLineColor,
                        mapState.gridLineThickness
                    );
                }

                // Update legacy background system
                if (gameStore.setLegacyBackground) {
                    gameStore.setLegacyBackground(mapState.backgroundImage, mapState.backgroundImageUrl);
                }

                // Update level editor store with new map data
                if (levelEditorStore.setTerrainData) {
                    levelEditorStore.setTerrainData(mapState.terrainData || {});
                }
                if (levelEditorStore.setEnvironmentalObjects) {
                    levelEditorStore.setEnvironmentalObjects(mapState.environmentalObjects || []);
                }
                if (levelEditorStore.setDndElements) {
                    levelEditorStore.setDndElements(mapState.dndElements || []);
                }
                if (levelEditorStore.setFogOfWarData) {
                    levelEditorStore.setFogOfWarData(mapState.fogOfWarData || {});
                }
                if (levelEditorStore.setWallData) {
                    levelEditorStore.setWallData(mapState.wallData || {});
                }

                // Update grid items store
                const { default: useGridItemStore } = await import('../../store/gridItemStore');
                if (useGridItemStore && mapState.gridItems) {
                    useGridItemStore.setState({ gridItems: mapState.gridItems || [] });
                }
            }

            console.log(`Switched to map: ${maps.find(m => m.id === mapId)?.name}`);
            setIsExpanded(false); // Collapse after switching
        } catch (error) {
            console.error('Error switching maps:', error);
        }
    };

    const formatMapStats = (map) => {
        // For current map, use real-time data from stores for reactive updates
        // For other maps, use stored data from map object
        const isCurrentMap = map.id === currentMapId;
        
        // Count connections (portals) - use real-time data for current map
        const connections = isCurrentMap 
            ? dndElements.filter(el => el.type === 'portal').length
            : (map.dndElements || []).filter(el => el.type === 'portal').length;
        
        // Count creatures (tokens on the map) - use real-time data for current map
        // For other maps, count tokens from stored map data
        const creaturesCount = isCurrentMap
            ? tokens.length // Count tokens on current map
            : (map.tokens || []).length; // Count tokens from stored map data

        return { connections, creaturesCount };
    };

    return (
        <div className="map-switcher">
            <div className="map-switcher-header">
                <div className="current-map-display">
                    <span className="map-icon">🗺️</span>
                    <div className="map-info">
                        <div className="map-name">{currentMap?.name || 'No Map'}</div>
                        <div className="map-stats">
                            {currentMap && (() => {
                                const stats = formatMapStats(currentMap);
                                return (
                                    <>
                                        <span title="Connections">🔗 {stats.connections}</span>
                                        <span title="Creatures">👹 {stats.creaturesCount}</span>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                <div className="map-switcher-controls">
                    <button
                        className="expand-button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        title={isExpanded ? 'Collapse map list' : 'Expand map list'}
                    >
                        {isExpanded ? '▲' : '▼'}
                    </button>
                    <button
                        className="library-button"
                        onClick={() => setMapLibraryOpen(true)}
                        title="Open Map Library"
                    >
                        📚
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="map-list">
                    <div className="map-list-header">
                        <span>Quick Switch</span>
                        <span className="map-count">{maps.length} maps</span>
                    </div>

                    <div className="map-items">
                        {maps.map(map => {
                            const stats = formatMapStats(map);
                            const isCurrent = map.id === currentMapId;

                            return (
                                <div
                                    key={map.id}
                                    className={`map-item ${isCurrent ? 'current' : ''}`}
                                    onClick={() => !isCurrent && handleMapSwitch(map.id)}
                                >
                                    <div className="map-item-info">
                                        <div className="map-item-name">{map.name}</div>
                                        <div className="map-item-stats">
                                            <span>🔗 {stats.connections}</span>
                                            <span>👹 {stats.creaturesCount}</span>
                                        </div>
                                    </div>

                                    {isCurrent && (
                                        <div className="current-indicator">
                                            ✓
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="map-list-footer">
                        <button
                            className="open-library-btn"
                            onClick={() => setMapLibraryOpen(true)}
                        >
                            Open Map Library
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapSwitcher;
