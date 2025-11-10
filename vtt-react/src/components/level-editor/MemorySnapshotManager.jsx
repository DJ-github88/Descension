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

    // Track token positions for afterimage management
    const previousTokenPositionsRef = useRef(new Map());

    // Get visibility data (same as CharacterToken uses)
    const { visibilityPolygon } = useLevelEditorStore();
    const visibleArea = useLevelEditorStore(state => state.visibleArea);
    const visibleAreaSet = React.useMemo(() => {
        if (!visibleArea) return null;
        return visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
    }, [visibleArea]);

    // Create memory snapshots for newly explored areas
    const updateMemorySnapshots = useCallback(() => {
        // Only run for players (not GM) and when viewing from a token
        if (!afterimageEnabled || isGMMode || !dynamicFogEnabled || !viewingFromToken) {
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
        isGMMode,
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
    const updateTokenAfterimages = useCallback(() => {
        if (!afterimageEnabled || isGMMode || !dynamicFogEnabled || !viewingFromToken) return;

        const previousTokenPositions = previousTokenPositionsRef.current;
        const currentTokenPositions = new Map();

        // Track all tokens (creatures and characters)
        // Merge creature data with token data for complete information
        const allTokens = [
            ...tokens.map(t => {
                const creature = creatures.find(c => c.id === t.creatureId);
                return { 
                    ...t, 
                    ...creature, // Merge creature data
                    type: 'creature', 
                    id: t.id, 
                    creatureId: t.creatureId 
                };
            }),
            ...characterTokens.map(t => ({ ...t, type: 'character', id: t.id, characterId: t.characterId }))
        ];

        allTokens.forEach(token => {
            if (!token.position) return;

            // Check if token is currently visible using the same logic as CharacterToken
            // This ensures consistency between when tokens are hidden and when memories are shown
            let isCurrentlyVisible = false;

            // Simplified visibility check - check if token is close to viewing token
            if (viewingFromToken && viewingFromToken.position) {
                const dx = token.position.x - viewingFromToken.position.x;
                const dy = token.position.y - viewingFromToken.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const visionRange = 6; // Default vision range in tiles
                const maxDistance = visionRange * gridSize;

                isCurrentlyVisible = distance <= maxDistance;
                console.log(`👁️ Token ${token.id} visibility check: distance=${distance.toFixed(1)}, max=${maxDistance}, visible=${isCurrentlyVisible}, viewingPos=${viewingFromToken.position.x.toFixed(1)},${viewingFromToken.position.y.toFixed(1)}, tokenPos=${token.position.x.toFixed(1)},${token.position.y.toFixed(1)}`);
            } else {
                // If not viewing from a token, consider all tokens visible
                isCurrentlyVisible = true;
            }

            // Also store grid coordinates for position tracking
            const tokenGridX = Math.floor((token.position.x - gridOffsetX) / gridSize);
            const tokenGridY = Math.floor((token.position.y - gridOffsetY) / gridSize);
            const tokenTileKey = `${tokenGridX},${tokenGridY}`;

            // Get previous position data
            const previousPosition = previousTokenPositions.get(token.id);


            // Handle token visibility changes for afterimage management
            if (isCurrentlyVisible) {
                // Token is currently visible - update last seen position and remove afterimage
                // The player can see this token right now, so no need for a memory
                const levelEditorStore = useLevelEditorStore.getState();
                const existingAfterimage = levelEditorStore.tokenAfterimages[token.id];

                if (existingAfterimage) {
                    removeTokenAfterimage(token.id);
                }

                // Track the current visible position for future afterimage creation
                previousTokenPositions.set(token.id, {
                    position: { x: tokenGridX, y: tokenGridY },
                    tileKey: tokenTileKey,
                    wasVisible: true
                });
            } else {
                // Token is not currently visible
                const levelEditorStore = useLevelEditorStore.getState();
                const existingAfterimage = levelEditorStore.tokenAfterimages[token.id];

                if (!existingAfterimage && previousPosition?.wasVisible) {
                    // Token was previously visible but is now out of view
                    // Create afterimage at the position where it was last visible
                    console.log(`🧠 Creating afterimage for token ${token.id} that moved out of view at position ${previousPosition.position.x},${previousPosition.position.y}`);
                    const fullTokenData = {
                        ...token, // This already includes merged creature data with tokenIcon
                        state: token.state || {},
                        // Ensure we have the creature/character data for image extraction
                        creatureId: token.creatureId,
                        characterId: token.characterId,
                        // tokenIcon is already included from merged creature data via ...token
                        customTokenImage: token.customTokenImage,
                        tokenBorder: token.tokenBorder,
                        // Include creature/character data if available
                        ...(token.creatureId ? { creature: token } : {}),
                        ...(token.characterId ? { character: token } : {})
                    };

                    updateTokenAfterimage(token.id, fullTokenData, previousPosition.position);
                } else if (!existingAfterimage && !previousPosition?.wasVisible) {
                    // Token was never visible but we're moving it into fog
                    // This shouldn't create an afterimage since the player never saw it
                    console.log(`🚫 Token ${token.id} moved into fog but was never visible - no afterimage created`);
                }

                // Keep tracking the position (update it even if not visible, in case it moves)
                previousTokenPositions.set(token.id, {
                    position: { x: tokenGridX, y: tokenGridY },
                    tileKey: tokenTileKey,
                    wasVisible: false
                });
            }
        });

        // Remove afterimages for tokens that no longer exist
        // Only remove if the afterimage actually exists to prevent infinite loops
        // Access from store directly to get current value
        const levelEditorStore = useLevelEditorStore.getState();
        Object.keys(levelEditorStore.tokenAfterimages).forEach(tokenId => {
            const tokenExists = allTokens.some(t => t.id === tokenId);
            if (!tokenExists && levelEditorStore.tokenAfterimages[tokenId]) {
                removeTokenAfterimage(tokenId);
            }
        });

        previousTokenPositionsRef.current = previousTokenPositions;
    }, [
        afterimageEnabled,
        isGMMode,
        dynamicFogEnabled,
        viewingFromToken,
        tokens,
        characterTokens,
        // Removed tokenAfterimages from dependencies to prevent infinite loops
        // We check tokenAfterimages inside the callback, so we don't need it as a dependency
        gridSize,
        gridOffsetX,
        gridOffsetY,
        updateTokenAfterimage,
        removeTokenAfterimage,
        visibilityPolygon,
        visibleAreaSet
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
    useEffect(() => {
        if (!afterimageEnabled || isGMMode || !dynamicFogEnabled || !viewingFromToken || isModeSwitching) return;
        updateMemorySnapshots();
    }, [afterimageEnabled, isGMMode, dynamicFogEnabled, viewingFromToken, visibleArea, updateMemorySnapshots, isModeSwitching]);

    // Update token afterimages when tokens move or visibility changes
    useEffect(() => {
        if (!afterimageEnabled || isGMMode || !dynamicFogEnabled || !viewingFromToken || isModeSwitching) return;
        updateTokenAfterimages();
    }, [
        afterimageEnabled,
        isGMMode,
        dynamicFogEnabled,
        viewingFromToken,
        visibleArea,
        tokens,
        characterTokens,
        updateTokenAfterimages,
        isModeSwitching
    ]);

    // This component doesn't render anything - it just manages memory state
    return null;
};

export default MemorySnapshotManager;

