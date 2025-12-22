import React, { useEffect, useCallback, useRef, useState } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useItemStore from '../../store/gridItemStore';

/**
 * MemorySnapshotManager - Handles memory snapshots and afterimages for previously explored areas
 * This component tracks what was visible when areas were explored and creates afterimages
 */
const MemorySnapshotManager = ({ isGMMode, gridSize, gridOffsetX, gridOffsetY }) => {
    // Level editor store
    const {
        afterimageEnabled,
        dynamicFogEnabled,
        revealedAreas,
        exploredAreas,
        memorySnapshots,
        tokenAfterimages,
        viewingFromToken,
        wallData,
        terrainData,
        environmentalObjects,
        dndElements,
        createMemorySnapshot,
        setExploredArea,
        updateTokenAfterimage,
        removeTokenAfterimage,
        getExploredArea,
        getMemorySnapshot
    } = useLevelEditorStore();

    // Token stores
    const { tokens, creatures } = useCreatureStore();
    const { characterTokens } = useCharacterTokenStore();
    const { gridItems } = useItemStore();

    // Track where the player LAST SAW each token (for afterimage placement)
    // Key: tokenId, Value: { gridPosition: {x, y}, worldPosition: {x, y}, tokenData: {...}, timestamp }
    const lastSeenPositionsRef = useRef(new Map());

    // Track tokens that are becoming invisible to prevent flickering
    const becomingInvisibleRef = useRef(new Map());

    // Track current visibility state to detect transitions
    // Key: tokenId, Value: { visible: boolean, lastChangeTime: number }
    const currentVisibilityRef = useRef(new Map());
    
    // Minimum time a token must be visible before we consider it "seen" (prevents flicker)
    // REDUCED: Lower debounce for faster token appearance
    const VISIBILITY_DEBOUNCE_MS = 50;

    // Get visibility data (same as CharacterToken uses)
    const { visibilityPolygon } = useLevelEditorStore();
    const visibleArea = useLevelEditorStore(state => state.visibleArea);
    const visibleAreaSet = React.useMemo(() => {
        if (!visibleArea) return null;
        return visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
    }, [visibleArea]);

    // Create memory snapshots for newly explored areas
    const updateMemorySnapshots = useCallback(() => {
        // CRITICAL FIX: Memory system runs when viewingFromToken is set, regardless of GM mode
        // This allows GM to test player experience and creates explored areas for players
        if (!afterimageEnabled || !dynamicFogEnabled || !viewingFromToken) {
            return;
        }

        const currentVisibleAreas = new Set(visibleArea || []);

        // Get grid system for proper coordinate conversion (supports both square and hex)
        const { getGridSystem } = require('../../utils/InfiniteGridSystem');
        const gridSystem = getGridSystem();
        const { gridType } = gridSystem.getGridState();

        // Get viewing token's position and vision range to create explored circle
        const viewingToken = viewingFromToken;
        if (!viewingToken || !viewingToken.position) {
            return;
        }

        // Get vision range and polygon for the viewing token
        const tokenId = viewingToken.type === 'creature'
            ? (viewingToken.creatureId || viewingToken.id)
            : (viewingToken.characterId || viewingToken.id || viewingToken.playerId);
        const levelEditorStore = useLevelEditorStore.getState();
        const tokenVision = levelEditorStore.tokenVisionRanges[tokenId] || {};
        const visionRange = tokenVision.range || 6; // Default 6 tiles
        const visionRadiusInWorld = visionRange * gridSize; // Convert to world units

        // CRITICAL FIX: Use visibility polygon to mark explored area (matches exact vision shape)
        // This creates explored areas that match the round view the character sees
        const visibilityPolygon = levelEditorStore.visibilityPolygon;
        if (visibilityPolygon && Array.isArray(visibilityPolygon) && visibilityPolygon.length >= 3) {
            // Use the exact vision polygon shape for explored area
            if (levelEditorStore.addExploredPolygon) {
                levelEditorStore.addExploredPolygon(visibilityPolygon);
            }
        } else {
            // Fallback to circle if no polygon available
            if (levelEditorStore.addExploredCircle) {
                levelEditorStore.addExploredCircle(
                    viewingToken.position.x,
                    viewingToken.position.y,
                    visionRadiusInWorld
                );
            }
        }

        // Still create memory snapshots for individual tiles (for remembering what was seen)
        // But explored area rendering will use circles
        currentVisibleAreas.forEach(tileKey => {
            const [coord1, coord2] = tileKey.split(',').map(Number);

            // Get current state of this tile for memory snapshot
            const snapshotData = {
                terrain: terrainData[tileKey] || null,
                // Get walls that touch this tile
                walls: Object.entries(wallData).filter(([wallKey]) => {
                    const [x1, y1, x2, y2] = wallKey.split(',').map(Number);
                    // Check if wall touches this tile (works for both square and hex)
                    return (x1 === coord1 || x2 === coord1 || y1 === coord2 || y2 === coord2);
                }).map(([wallKey, wallData_item]) => ({ key: wallKey, data: wallData_item })),
                // Get objects at this tile - FIXED: now uses grid system for hex grids
                objects: environmentalObjects.filter(obj => {
                    if (!obj.position) return false;
                    const objGridCoords = gridSystem.worldToGrid(obj.position.x, obj.position.y);
                    return objGridCoords.x === coord1 && objGridCoords.y === coord2;
                }),
                // Get D&D elements at this tile - FIXED: now uses grid system for hex grids
                dndElements: dndElements.filter(elem => {
                    if (!elem.position) return false;
                    const elemGridCoords = gridSystem.worldToGrid(elem.position.x, elem.position.y);
                    return elemGridCoords.x === coord1 && elemGridCoords.y === coord2;
                }),
                // Get grid items at this tile - FIXED: now uses grid system for hex grids
                gridItems: gridItems.filter(item => {
                    if (!item.position) return false;
                    const itemGridCoords = gridSystem.worldToGrid(item.position.x, item.position.y);
                    return itemGridCoords.x === coord1 && itemGridCoords.y === coord2;
                })
            };

            createMemorySnapshot(coord1, coord2, snapshotData);
            // Keep tile-based explored areas for backward compatibility and memory snapshots
            setExploredArea(coord1, coord2, true);
        });

        // Note: Explored circles are now stored separately and rendered as soft circles
    }, [
        afterimageEnabled,
        dynamicFogEnabled,
        viewingFromToken,
        visibleArea,
        terrainData,
        wallData,
        environmentalObjects,
        dndElements,
        gridItems,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        createMemorySnapshot,
        setExploredArea
    ]);

    // Update token afterimages when tokens move out of view
    // CRITICAL: Afterimages persist until the player sees the SAME TOKEN ID again
    // CRITICAL FIX: Works when viewingFromToken is set, regardless of GM mode (allows GM to test)
    const updateTokenAfterimages = useCallback(() => {
        if (!afterimageEnabled || !dynamicFogEnabled || !viewingFromToken) {
            return;
        }

        const lastSeenPositions = lastSeenPositionsRef.current;
        const currentVisibility = currentVisibilityRef.current;
        const becomingInvisible = becomingInvisibleRef.current;

        // Track all tokens (creatures and characters)
        // Merge creature data with token data for complete information
        const allTokens = [
            ...(tokens || []).map(t => {
                const creature = creatures.find(c => c.id === t.creatureId);
                return {
                    ...t,
                    ...creature, // Merge creature data
                    type: 'creature',
                    id: t.id,
                    creatureId: t.creatureId
                };
            }),
            ...(characterTokens || []).map(t => ({ ...t, type: 'character', id: t.id, characterId: t.characterId }))
        ];

        allTokens.forEach(token => {
            if (!token.position) return;

            // Get grid coordinates
            const tokenGridX = Math.floor((token.position.x - gridOffsetX) / gridSize);
            const tokenGridY = Math.floor((token.position.y - gridOffsetY) / gridSize);
            const tokenTileKey = `${tokenGridX},${tokenGridY}`;

            // Check if token is currently visible using visibleAreaSet (accounts for walls/LOS)
            let isCurrentlyVisible = false;

            if (viewingFromToken && viewingFromToken.position && visibleAreaSet) {
                // Use the visibleAreaSet which already accounts for walls and line of sight
                isCurrentlyVisible = visibleAreaSet.has(tokenTileKey);
            } else if (!viewingFromToken) {
                // Not viewing from a token - all tokens are visible
                isCurrentlyVisible = true;
            }

            // Get previous visibility state with debouncing
            const prevState = currentVisibility.get(token.id) || { visible: false, lastChangeTime: 0 };
            const now = Date.now();

            if (isCurrentlyVisible) {
                // Token is NOW visible
                
                // Cancel any pending afterimage creation
                if (becomingInvisible.has(token.id)) {
                    clearTimeout(becomingInvisible.get(token.id));
                    becomingInvisible.delete(token.id);
                }

                // CRITICAL FIX: Immediately update last seen position when token becomes visible
                // Don't wait for debounce - tokens should appear immediately when in view
                const timeSinceChange = now - prevState.lastChangeTime;
                const isStableVisible = prevState.visible && timeSinceChange > VISIBILITY_DEBOUNCE_MS;
                
                // Update "last seen" position immediately (don't wait for debounce)
                // This ensures tokens appear as soon as they enter view
                const fullTokenData = {
                    ...token,
                    state: token.state || {},
                    creatureId: token.creatureId,
                    characterId: token.characterId,
                    customTokenImage: token.customTokenImage,
                    tokenBorder: token.tokenBorder,
                    tokenIcon: token.tokenIcon,
                    icon: token.icon,
                    ...(token.creatureId ? { creature: token } : {}),
                    ...(token.characterId ? { character: token } : {})
                };
                
                lastSeenPositions.set(token.id, {
                    gridPosition: { x: tokenGridX, y: tokenGridY },
                    worldPosition: { x: token.position.x, y: token.position.y },
                    tokenData: fullTokenData,
                    timestamp: now
                });

                // CRITICAL FIX: Remove afterimage immediately when token becomes visible
                // Don't wait for stability - tokens should appear instantly when in view
                const levelEditorStore = useLevelEditorStore.getState();
                if (levelEditorStore.tokenAfterimages[token.id]) {
                    removeTokenAfterimage(token.id);
                }

                // Update visibility state immediately (no debounce for becoming visible)
                if (!prevState.visible) {
                    currentVisibility.set(token.id, { visible: true, lastChangeTime: now });
                } else {
                    // Update timestamp even if already visible (for smooth transitions)
                    currentVisibility.set(token.id, { visible: true, lastChangeTime: now });
                }

            } else {
                // Token is NOT visible
                
                // Check if this is a transition from visible to invisible
                const wasStableVisible = prevState.visible && (now - prevState.lastChangeTime) > VISIBILITY_DEBOUNCE_MS;
                
                if (wasStableVisible && !becomingInvisible.has(token.id)) {
                    // Token JUST became invisible after being stably visible
                    // Create afterimage at LAST SEEN position
                    const lastSeen = lastSeenPositions.get(token.id);
                    
                    if (lastSeen && lastSeen.worldPosition) {
                        // REDUCED DELAY: Faster afterimage creation for better responsiveness
                        // Use a shorter delay to prevent flickering during rapid visibility changes
                        const timerId = setTimeout(() => {
                            // Re-check that token is still invisible using visibleArea
                            let stillInvisible = true;
                            const currentStore = useLevelEditorStore.getState();
                            const currentVisibleArea = currentStore.visibleArea;
                            const currentVisibleSet = currentVisibleArea ? 
                                (currentVisibleArea instanceof Set ? currentVisibleArea : new Set(currentVisibleArea)) :
                                null;
                            
                            if (currentVisibleSet) {
                                const currentTokens = [...(useCreatureStore.getState().tokens || []), ...(useCharacterTokenStore.getState().characterTokens || [])];
                                const currentToken = currentTokens.find(t => t.id === token.id);
                                
                                if (currentToken && currentToken.position) {
                                    const currentGridX = Math.floor((currentToken.position.x - gridOffsetX) / gridSize);
                                    const currentGridY = Math.floor((currentToken.position.y - gridOffsetY) / gridSize);
                                    const currentTileKey = `${currentGridX},${currentGridY}`;
                                    stillInvisible = !currentVisibleSet.has(currentTileKey);
                                }
                            }

                            if (stillInvisible) {
                                if (!currentStore.tokenAfterimages[token.id]) {
                                    // Create afterimage at the LAST SEEN world position (more accurate than grid position)
                                    // Store both grid and world position for compatibility
                                    const afterimagePosition = {
                                        ...lastSeen.gridPosition,
                                        worldPosition: lastSeen.worldPosition
                                    };
                                    updateTokenAfterimage(token.id, lastSeen.tokenData, afterimagePosition);
                                    // Keep tile-based explored area for backward compatibility
                                    setExploredArea(lastSeen.gridPosition.x, lastSeen.gridPosition.y, true);
                                }
                            }
                            
                            becomingInvisible.delete(token.id);
                        }, 150); // Reduced delay for faster afterimage creation

                        becomingInvisible.set(token.id, timerId);
                    }
                }
                
                // Update visibility state (don't clear lastSeenPositions - that's our memory!)
                if (prevState.visible) {
                    currentVisibility.set(token.id, { visible: false, lastChangeTime: now });
                }
            }
        });

        // Remove afterimages for tokens that no longer exist in the game
        const levelEditorStore = useLevelEditorStore.getState();
        Object.keys(levelEditorStore.tokenAfterimages).forEach(tokenId => {
            const tokenExists = allTokens.some(t => t.id === tokenId);
            if (!tokenExists && levelEditorStore.tokenAfterimages[tokenId]) {
                removeTokenAfterimage(tokenId);
                lastSeenPositions.delete(tokenId);
                currentVisibility.delete(tokenId);
                if (becomingInvisible.has(tokenId)) {
                    clearTimeout(becomingInvisible.get(tokenId));
                    becomingInvisible.delete(tokenId);
                }
            }
        });

    }, [
        afterimageEnabled,
        dynamicFogEnabled,
        viewingFromToken,
        tokens,
        creatures,
        characterTokens,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        updateTokenAfterimage,
        removeTokenAfterimage,
        setExploredArea
    ]);

    // Track mode switch to defer expensive calculations
    const modeSwitchTimeoutRef = useRef(null);
    const [isModeSwitching, setIsModeSwitching] = useState(false);
    
    
    // Detect mode switch and defer calculations
    useEffect(() => {
        // Clear any pending timeout
        if (modeSwitchTimeoutRef.current) {
            clearTimeout(modeSwitchTimeoutRef.current);
        }
        
        // When switching from GM to player, defer calculations to prevent performance spike
        if (!isGMMode && viewingFromToken) {
            setIsModeSwitching(true);
            modeSwitchTimeoutRef.current = setTimeout(() => {
                setIsModeSwitching(false);
                modeSwitchTimeoutRef.current = null;
            }, 300); // 300ms delay to let UI settle
        } else {
            setIsModeSwitching(false);
        }
        
        return () => {
            if (modeSwitchTimeoutRef.current) {
                clearTimeout(modeSwitchTimeoutRef.current);
            }
        };
    }, [isGMMode, viewingFromToken]);

    // Update memory snapshots when visibility changes
    // CRITICAL FIX: Memory system now works when viewingFromToken is set, even in GM mode
    // This allows GM to test/preview player experience, and explored areas are saved for players
    useEffect(() => {
        // Memory system runs whenever:
        // 1. afterimageEnabled is true
        // 2. dynamicFogEnabled is true
        // 3. viewingFromToken is set (regardless of GM mode - GM can test player view)
        // 4. not switching modes
        if (!afterimageEnabled || !dynamicFogEnabled || !viewingFromToken || isModeSwitching) {
            return;
        }
        updateMemorySnapshots();
    }, [afterimageEnabled, dynamicFogEnabled, viewingFromToken, visibleArea, updateMemorySnapshots, isModeSwitching]);

    // Update token afterimages when tokens move or visibility changes
    // CRITICAL FIX: Works when viewingFromToken is set, regardless of GM mode (allows GM to test)
    useEffect(() => {
        if (!afterimageEnabled || !dynamicFogEnabled || !viewingFromToken || isModeSwitching) return;
        updateTokenAfterimages();
    }, [
        afterimageEnabled,
        dynamicFogEnabled,
        viewingFromToken,
        visibleArea,
        tokens,
        characterTokens,
        updateTokenAfterimages,
        isModeSwitching
    ]);

    // Cleanup all timers on unmount
    useEffect(() => {
        return () => {
            const becomingInvisible = becomingInvisibleRef.current;

            becomingInvisible.forEach((timerId) => {
                clearTimeout(timerId);
            });
            becomingInvisible.clear();
            
            // Clear tracking refs
            lastSeenPositionsRef.current.clear();
            currentVisibilityRef.current.clear();
        };
    }, []);

    // This component doesn't render anything - it just manages memory state
    return null;
};

export default MemorySnapshotManager;

