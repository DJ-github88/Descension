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
    const VISIBILITY_DEBOUNCE_MS = 100;

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

        // Mark ALL currently visible areas as explored
        // This ensures that wherever the player has vision, it stays explored
        currentVisibleAreas.forEach(tileKey => {
            const [x, y] = tileKey.split(',').map(Number);

            // Get current state of this tile for memory snapshot
            const snapshotData = {
                terrain: terrainData[tileKey] || null,
                // Get walls that touch this tile
                walls: Object.entries(wallData).filter(([wallKey]) => {
                    const [x1, y1, x2, y2] = wallKey.split(',').map(Number);
                    // Check if wall touches this tile
                    return (x1 === x || x2 === x || y1 === y || y2 === y);
                }).map(([wallKey, wallData_item]) => ({ key: wallKey, data: wallData_item })),
                // Get objects at this tile
                objects: environmentalObjects.filter(obj => {
                    if (!obj.position) return false;
                    const objGridX = Math.floor((obj.position.x - gridOffsetX) / gridSize);
                    const objGridY = Math.floor((obj.position.y - gridOffsetY) / gridSize);
                    return objGridX === x && objGridY === y;
                }),
                // Get D&D elements at this tile
                dndElements: dndElements.filter(elem => {
                    if (!elem.position) return false;
                    const elemGridX = Math.floor((elem.position.x - gridOffsetX) / gridSize);
                    const elemGridY = Math.floor((elem.position.y - gridOffsetY) / gridSize);
                    return elemGridX === x && elemGridY === y;
                }),
                // Get grid items at this tile
                gridItems: gridItems.filter(item => {
                    if (!item.position) return false;
                    const itemGridX = Math.floor((item.position.x - gridOffsetX) / gridSize);
                    const itemGridY = Math.floor((item.position.y - gridOffsetY) / gridSize);
                    return itemGridX === x && itemGridY === y;
                })
            };

            createMemorySnapshot(x, y, snapshotData);
            setExploredArea(x, y, true);
        });

        // Note: No need to track previous visible areas since we mark all visible areas as explored
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

                // Only process visibility change if debounce time has passed
                // This prevents flickering when visibility rapidly changes
                const timeSinceChange = now - prevState.lastChangeTime;
                const isStableVisible = prevState.visible && timeSinceChange > VISIBILITY_DEBOUNCE_MS;
                
                // Update "last seen" position - this is where the player saw the token
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

                // Only remove afterimage if visibility is STABLE (not flickering)
                // This prevents afterimage from being cleared during brief visibility flickers
                if (isStableVisible || timeSinceChange > VISIBILITY_DEBOUNCE_MS * 2) {
                    const levelEditorStore = useLevelEditorStore.getState();
                    if (levelEditorStore.tokenAfterimages[token.id]) {
                        removeTokenAfterimage(token.id);
                    }
                }

                // Update visibility state
                if (!prevState.visible) {
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
                    
                    if (lastSeen) {
                        // Use a delay to prevent flickering during rapid visibility changes
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
                                    // Create afterimage at the LAST SEEN position (not current position!)
                                    updateTokenAfterimage(token.id, lastSeen.tokenData, lastSeen.gridPosition);
                                    setExploredArea(lastSeen.gridPosition.x, lastSeen.gridPosition.y, true);
                                }
                            }
                            
                            becomingInvisible.delete(token.id);
                        }, 300); // Longer delay to ensure stability

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

