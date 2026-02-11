import React, { useState, useMemo } from 'react';
import useMapStore from '../../store/mapStore';
import useGameStore from '../../store/gameStore';
import useSettingsStore from '../../store/settingsStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import { MAP_TRANSITION_TIMINGS } from '../multiplayer/MapTransitionOverlay';
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
    const showMapTransitions = useSettingsStore(state => state.showMapTransitions);

    // Get real-time data from stores for reactive updates
    const { dndElements } = useLevelEditorStore();
    const { tokens } = useCreatureStore(); // Use tokens to count creatures on the map

    const currentMap = maps.find(m => m.id === currentMapId);

    // Handle map switching with state preservation
    const handleMapSwitch = async (mapId) => {
        if (mapId === currentMapId) return;

        // CRITICAL FIX: Set map switching lock to prevent data bleeding
        window._isMapSwitching = true;
        console.log('🔒 [MapSwitcher] Lock set - preventing updates during transition');

        try {
            const targetMapMeta = maps.find(m => m.id === mapId);

            // Transition-first sequencing for multiplayer GM quick map switches.
            // Ensure overlay is active before any heavy map swap operations.
            if (showMapTransitions && gameStore.isInMultiplayer && gameStore.isGMMode) {
                window.dispatchEvent(new CustomEvent('manual_map_transition_requested', {
                    detail: {
                        mapName: targetMapMeta?.name || 'Unknown Realm',
                        transferredByGM: false
                    }
                }));

                await new Promise(resolve => setTimeout(resolve, MAP_TRANSITION_TIMINGS.SAFE_SWAP_MS));
            }

            // Save current map state before switching
            await saveCurrentMapState(gameStore, levelEditorStore);

            // Switch to new map
            const success = switchToMap(mapId);
            if (!success) {
                console.error('Failed to switch to map:', mapId);
                return;
            }

            // Load new map state
            const mapState = await loadMapState();
            if (mapState) {
                // Payload-aware hydration: avoid destructive clears when payload is partial/missing
                const { default: useCreatureStore } = await import('../../store/creatureStore');
                const { default: useCharacterTokenStore } = await import('../../store/characterTokenStore');

                const tokensPayload = mapState.tokens;
                const characterTokensPayload = mapState.characterTokens;
                const hasTokensPayload = tokensPayload !== undefined;
                const hasCharacterTokensPayload = characterTokensPayload !== undefined;

                if (hasTokensPayload) {
                    if (useCreatureStore.getState().clearTokens) {
                        useCreatureStore.getState().clearTokens();
                    } else {
                        useCreatureStore.setState({ tokens: [] });
                    }
                } else {
                    console.warn('[MapSwitcher] Missing creature token payload - preserving existing creature tokens');
                }

                if (hasCharacterTokensPayload) {
                    if (useCharacterTokenStore.getState().clearCharacterTokens) {
                        useCharacterTokenStore.getState().clearCharacterTokens();
                    } else {
                        useCharacterTokenStore.setState({ characterTokens: [] });
                    }
                } else {
                    console.warn('[MapSwitcher] Missing character token payload - preserving existing character tokens');
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
                const normalizedTokens = Array.isArray(tokensPayload)
                    ? tokensPayload
                    : (tokensPayload ? Object.values(tokensPayload) : []);

                if (hasTokensPayload && normalizedTokens.length > 0) {
                    const creatureStore = useCreatureStore.getState();
                    normalizedTokens.forEach(token => {
                        if (creatureStore.loadToken) {
                            creatureStore.loadToken(token);
                        }
                    });
                }

                // Load character tokens for the new map
                const normalizedCharacterTokens = Array.isArray(characterTokensPayload)
                    ? characterTokensPayload
                    : (characterTokensPayload ? Object.values(characterTokensPayload) : []);

                if (hasCharacterTokensPayload && normalizedCharacterTokens.length > 0) {
                    const characterTokenStore = useCharacterTokenStore.getState();
                    normalizedCharacterTokens.forEach(token => {
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
                const gridItemsPayload = mapState.gridItems;
                const hasGridItemsPayload = gridItemsPayload !== undefined;
                if (!hasGridItemsPayload) {
                    console.warn('[MapSwitcher] Missing gridItems payload - preserving existing grid items');
                } else if (useGridItemStore) {
                    const normalizedGridItems = Array.isArray(gridItemsPayload)
                        ? gridItemsPayload
                        : Object.values(gridItemsPayload || {});
                    useGridItemStore.setState({ gridItems: normalizedGridItems });
                }
            }

            console.log(`Switched to map: ${maps.find(m => m.id === mapId)?.name}`);
            setIsExpanded(false); // Collapse after switching
        } catch (error) {
            console.error('Error switching maps:', error);
        } finally {
            // CRITICAL FIX: Always release lock, even on error
            setTimeout(() => {
                window._isMapSwitching = false;
                console.log('🔓 [MapSwitcher] Lock released - updates allowed');
            }, 200);
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
