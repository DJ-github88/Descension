import React, { useState } from 'react';
import useMapStore from '../../store/mapStore';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
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

    const currentMap = maps.find(m => m.id === currentMapId);

    // Handle map switching with state preservation
    const handleMapSwitch = async (mapId) => {
        if (mapId === currentMapId) return;

        try {
            // Save current map state before switching
            saveCurrentMapState(gameStore, levelEditorStore);

            // Switch to new map
            const success = switchToMap(mapId);
            if (!success) {
                console.error('Failed to switch to map:', mapId);
                return;
            }

            // Load new map state
            const mapState = loadMapState();
            if (mapState) {
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
                if (gameStore.setTokens) {
                    gameStore.setTokens(mapState.tokens);
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
                    levelEditorStore.setTerrainData(mapState.terrainData);
                }
                if (levelEditorStore.setEnvironmentalObjects) {
                    levelEditorStore.setEnvironmentalObjects(mapState.environmentalObjects);
                }
                if (levelEditorStore.setDndElements) {
                    levelEditorStore.setDndElements(mapState.dndElements);
                }
                if (levelEditorStore.setFogOfWarData) {
                    levelEditorStore.setFogOfWarData(mapState.fogOfWarData);
                }
            }

            console.log(`Switched to map: ${maps.find(m => m.id === mapId)?.name}`);
            setIsExpanded(false); // Collapse after switching
        } catch (error) {
            console.error('Error switching maps:', error);
        }
    };

    const formatMapStats = (map) => {
        const terrainCount = Object.keys(map.terrainData || {}).length;
        const objectCount = (map.environmentalObjects || []).length;
        const portalCount = (map.portals || []).length;

        return { terrainCount, objectCount, portalCount };
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
                                        <span title="Terrain tiles">🌍 {stats.terrainCount}</span>
                                        <span title="Objects">🌳 {stats.objectCount}</span>
                                        <span title="Portals">🌀 {stats.portalCount}</span>
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
                                            <span>🌍 {stats.terrainCount}</span>
                                            <span>🌳 {stats.objectCount}</span>
                                            <span>🌀 {stats.portalCount}</span>
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
