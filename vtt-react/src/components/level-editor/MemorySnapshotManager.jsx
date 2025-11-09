import React, { useEffect, useCallback, useRef, useState } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useGameStore from '../../store/gameStore';
import useItemStore from '../../store/gridItemStore';

/**
 * MemorySnapshotManager - Handles memory snapshots and afterimages for previously explored areas
 * This component tracks what was visible when areas were explored and creates afterimages
 */
const MemorySnapshotManager = () => {
    // Level editor store
    const {
        afterimageEnabled,
        dynamicFogEnabled,
        revealedAreas,
        exploredAreas,
        memorySnapshots,
        tokenAfterimages,
        viewingFromToken,
        visibleArea,
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
    
    // Game settings
    const { isGMMode, gridSize, gridOffsetX, gridOffsetY } = useGameStore();

    // Track token positions for afterimage management
    const previousTokenPositionsRef = useRef(new Map());

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

        const currentVisibleAreas = new Set(visibleArea || []);
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

            const tokenGridX = Math.floor((token.position.x - gridOffsetX) / gridSize);
            const tokenGridY = Math.floor((token.position.y - gridOffsetY) / gridSize);
            const tokenTileKey = `${tokenGridX},${tokenGridY}`;

            // Check if token is currently visible to the viewing token
            const isCurrentlyVisible = currentVisibleAreas.has(tokenTileKey);

            // Get previous position data
            const previousPosition = previousTokenPositions.get(token.id);

            // If token was previously visible but is now out of view, create afterimage
            if (previousPosition && previousPosition.wasVisible && !isCurrentlyVisible) {
                // Token moved out of view - create afterimage at its LAST visible position
                // This ensures the player remembers where they last saw the token
                // Include full token data with state and creature/character data merged
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
                // Use the position where the token was last visible to the player
                const afterimagePosition = previousPosition.position;
                // Check if afterimage already exists at this position - if so, don't create duplicate
                const levelEditorStore = useLevelEditorStore.getState();
                const existingAfterimage = levelEditorStore.tokenAfterimages[token.id];
                if (!existingAfterimage || existingAfterimage.position.x !== afterimagePosition.x || existingAfterimage.position.y !== afterimagePosition.y) {
                    updateTokenAfterimage(token.id, fullTokenData, afterimagePosition);
                }

                // Keep tracking the last visible position
                previousTokenPositions.set(token.id, {
                    position: previousPosition.position,
                    lastVisiblePosition: previousPosition.position,
                    tileKey: previousPosition.tileKey,
                    wasVisible: false
                });
            } else if (isCurrentlyVisible) {
                // Token is currently visible
                // Check if there's an afterimage and if the token is at the afterimage position
                const levelEditorStore = useLevelEditorStore.getState();
                const existingAfterimage = levelEditorStore.tokenAfterimages[token.id];
                
                if (existingAfterimage) {
                    // Check if token is at the afterimage position AND the afterimage position is currently visible
                    // This ensures that when a GM moves a token, players still see the afterimage at the old position
                    // until they actually revisit that location and see it's gone or moved
                    const afterimagePos = existingAfterimage.position;
                    const afterimageTileKey = `${afterimagePos.x},${afterimagePos.y}`;
                    const isAfterimagePositionVisible = currentVisibleAreas.has(afterimageTileKey);
                    
                    if (afterimagePos.x === tokenGridX && afterimagePos.y === tokenGridY && isAfterimagePositionVisible) {
                        // Token is at the afterimage position AND the position is visible - remove afterimage (show real token)
                        // This means the player has revisited the location and can see the token is actually there
                        removeTokenAfterimage(token.id);
                    }
                    // If token is NOT at afterimage position, OR the afterimage position is not visible, keep the afterimage
                    // This ensures that when a GM moves a token, players still see the afterimage until they revisit that location
                }
                
                // Track the current visible position of the token
                // This allows us to create afterimages at the last position where the token was visible
                previousTokenPositions.set(token.id, {
                    position: { x: tokenGridX, y: tokenGridY },
                    tileKey: tokenTileKey,
                    wasVisible: true
                });
            } else if (previousPosition?.wasVisible) {
                // Token was previously visible but is now out of view
                // Create afterimage at the position where it was last visible
                const levelEditorStore = useLevelEditorStore.getState();
                const existingAfterimage = levelEditorStore.tokenAfterimages[token.id];

                if (!existingAfterimage) {
                    // Create afterimage if it doesn't exist yet
                    // Include full token data with state and creature/character data merged
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
                    // Use the position where the token was last visible to the player
                    const afterimagePosition = previousPosition.position;
                    updateTokenAfterimage(token.id, fullTokenData, afterimagePosition);
                }
                // If afterimage already exists, keep it at its current position
                // The afterimage represents where the player last saw this token

                // Keep tracking the last visible position
                previousTokenPositions.set(token.id, {
                    position: previousPosition.position,
                    lastVisiblePosition: previousPosition.position,
                    tileKey: previousPosition.tileKey,
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
        visibleArea,
        tokens,
        characterTokens,
        // Removed tokenAfterimages from dependencies to prevent infinite loops
        // We check tokenAfterimages inside the callback, so we don't need it as a dependency
        gridSize,
        gridOffsetX,
        gridOffsetY,
        updateTokenAfterimage,
        removeTokenAfterimage
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

