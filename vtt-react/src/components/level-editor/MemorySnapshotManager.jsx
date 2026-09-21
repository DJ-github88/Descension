import React, { useEffect, useCallback, useRef, useState } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useItemStore from '../../store/gridItemStore';
import useMapStore from '../../store/mapStore';
import { isPointInPolygon } from '../../utils/VisibilityCalculations';

/**
 * Cheap identity comparison between a stored memory snapshot and a freshly
 * built one. Store slices keep stable references for terrain, wall entries,
 * objects, elements and items, so per-tile equality never needs a deep/JSON
 * comparison.
 */
const snapshotMatches = (existing, next) => {
    if (!existing || !next) return false;
    if (existing.terrain !== next.terrain) return false;
    const fields = ['walls', 'objects', 'dndElements', 'gridItems'];
    for (const field of fields) {
        const a = existing[field] || [];
        const b = next[field] || [];
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (field === 'walls') {
                if (a[i]?.key !== b[i]?.key || a[i]?.data !== b[i]?.data) return false;
            } else if (a[i] !== b[i]) {
                return false;
            }
        }
    }
    return true;
};

/**
 * MemorySnapshotManager - Handles memory snapshots and afterimages for previously explored areas
 * This component tracks what was visible when areas were explored and creates afterimages
 * 
 * UPDATED: Now uses per-player memory system - each player has individual exploration memories
 */
const MemorySnapshotManager = ({ isGMMode, gridSize, gridOffsetX, gridOffsetY }) => {
    // Level editor store - per-player memory system
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
        // Legacy actions (kept for backward compatibility)
        setExploredArea,
        updateTokenAfterimage,
        removeTokenAfterimage,
        getExploredArea,
        getMemorySnapshot,
        addExploredPolygon,
        addExploredCircle,
        // Per-player memory actions
        currentPlayerId,
        setCurrentPlayerId,
        setPlayerExploredArea,
        addPlayerExploredPolygon,
        addPlayerExploredCircle,
        updatePlayerTokenAfterimage,
        removePlayerTokenAfterimage,
        getPlayerTokenAfterimages
    } = useLevelEditorStore();

    // Token stores
    // CRITICAL FIX: Use creatureTokens, not tokens (tokens is always empty - alias bug in creatureStore)
    const { creatureTokens, creatures } = useCreatureStore();
    const { characterTokens } = useCharacterTokenStore();
    const { gridItems } = useItemStore();
    const { currentMapId } = useMapStore();

    // Track where the player LAST SAW each token (for afterimage placement)
    // Key: tokenId, Value: { gridPosition: {x, y}, worldPosition: {x, y}, tokenData: {...}, timestamp }
    const lastSeenPositionsRef = useRef(new Map());

    // Track tokens that are becoming invisible to prevent flickering
    const becomingInvisibleRef = useRef(new Map());

    // Track current visibility state to detect transitions
    // Key: tokenId, Value: { visible: boolean, lastChangeTime: number }
    const currentVisibilityRef = useRef(new Map());

    // Throttle debug logging
    const lastLogTimeRef = useRef(0);

    // Minimum time a token must be visible before we consider it "seen" (prevents flicker)
    // REDUCED: Lower debounce for faster token appearance
    const VISIBILITY_DEBOUNCE_MS = 50;

    // Get visibility data (same as CharacterToken uses)
    const { visibilityPolygon } = useLevelEditorStore();
    const visibleArea = useLevelEditorStore(state => state.visibleArea);
    const controlledVisibleTiles = useLevelEditorStore(state => state.controlledVisibleTiles);
    const additionalVisibilityPolygons = useLevelEditorStore(state => state.additionalVisibilityPolygons);
    const visibleAreaSet = React.useMemo(() => {
        if (!visibleArea) return null;
        return visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
    }, [visibleArea]);
    const controlledVisibleTileSet = React.useMemo(() => {
        if (!controlledVisibleTiles || controlledVisibleTiles.length === 0) return null;
        return new Set(controlledVisibleTiles);
    }, [controlledVisibleTiles]);
    // Expanded set includes controlled creature visions (for token afterimage tracking)
    const expandedVisibleAreaSet = React.useMemo(() => {
        if (!visibleAreaSet) return null;
        const expanded = new Set(visibleAreaSet);
        if (controlledVisibleTiles) controlledVisibleTiles.forEach(t => expanded.add(t));
        return expanded;
    }, [visibleAreaSet, controlledVisibleTiles]);

    // Unified visibility check: tests a point against BOTH primary and secondary vision
    // Primary: visibleAreaSet (tiles) + visibilityPolygon (wall-occlusion)
    // Secondary: controlledVisibleTileSet (tiles) + additionalVisibilityPolygons (wall-occlusion)
    const isPointVisibleViaAnyVision = useCallback((worldX, worldY, tileKey) => {
        const inPrimaryTile = visibleAreaSet ? visibleAreaSet.has(tileKey) : false;
        if (inPrimaryTile) {
            if (visibilityPolygon && visibilityPolygon.length >= 3) {
                if (isPointInPolygon(worldX, worldY, visibilityPolygon)) return true;
            } else {
                return true;
            }
        }

        const inSecondaryTile = controlledVisibleTileSet ? controlledVisibleTileSet.has(tileKey) : false;
        if (inSecondaryTile) {
            if (additionalVisibilityPolygons && additionalVisibilityPolygons.length > 0) {
                for (const poly of additionalVisibilityPolygons) {
                    if (poly && poly.length >= 3 && isPointInPolygon(worldX, worldY, poly)) return true;
                }
            } else {
                return true;
            }
        }

        return false;
    }, [visibleAreaSet, visibilityPolygon, controlledVisibleTileSet, additionalVisibilityPolygons]);

    // Create memory snapshots for newly explored areas
    // UPDATED: Uses per-player memory system - each player has individual explored areas
    const updateMemorySnapshots = useCallback(() => {
        // CRITICAL FIX: Memory system runs when viewingFromToken is set, regardless of GM mode
        // This allows GM to test player experience and creates explored areas for players
        if (!afterimageEnabled || !dynamicFogEnabled || !viewingFromToken) {
            return;
        }

        // CRITICAL FIX: DUAL-WRITE instead of hard-requiring currentPlayerId.
        // The old guard (`if (!currentPlayerId) return`) silently killed ALL token
        // afterimages and loot-orb memory snapshots whenever currentPlayerId was
        // null or mismatched (while wall ghosts kept working because they render
        // straight from wallData). Now: write per-player when available AND always
        // write the legacy stores so readers can fall back.

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

        // UPDATED: DUAL-WRITE — per-player memory actions when currentPlayerId is
        // available, plus the legacy stores as a guaranteed fallback.
        const visibilityPolygon = levelEditorStore.visibilityPolygon;
        if (visibilityPolygon && Array.isArray(visibilityPolygon) && visibilityPolygon.length >= 3) {
            // Use the exact vision polygon shape for explored area (wall-clipped)
            if (currentPlayerId) addPlayerExploredPolygon(visibilityPolygon);
            addExploredPolygon(visibilityPolygon);
        }
        // NOTE: The old circle fallback was removed on purpose. When the polygon was
        // momentarily unavailable it stamped a full vision-radius circle that ignored
        // walls, permanently marking terrain behind walls as "explored" (dim vision
        // leaked through walls). Missing a frame is far better than leaking.

        // PERF: build per-tile indexes once per pass instead of filtering every
        // entity list for every visible tile, and commit the whole pass to the
        // store with ONE write instead of four writes per tile. Snapshot payload
        // building is only skipped when the stored snapshot is already identical
        // (stable store references make that an identity comparison).
        const wallsByX = new Map();
        const wallsByY = new Map();
        const objectsByTile = new Map();
        const elementsByTile = new Map();
        const gridItemsByTile = new Map();

        Object.entries(wallData).forEach(([wallKey, wallItem]) => {
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);
            const record = { key: wallKey, data: wallItem };
            for (const x of [x1, x2]) {
                if (!wallsByX.has(x)) wallsByX.set(x, []);
                wallsByX.get(x).push(record);
            }
            for (const y of [y1, y2]) {
                if (!wallsByY.has(y)) wallsByY.set(y, []);
                wallsByY.get(y).push(record);
            }
        });

        const indexByTile = (list, map) => {
            for (const entry of list) {
                if (!entry.position) continue;
                const coords = gridSystem.worldToGrid(entry.position.x, entry.position.y);
                const key = `${coords.x},${coords.y}`;
                if (!map.has(key)) map.set(key, []);
                map.get(key).push(entry);
            }
        };
        indexByTile(environmentalObjects, objectsByTile);
        indexByTile(dndElements, elementsByTile);
        indexByTile(gridItems, gridItemsByTile);

        const tileEntries = [];
        currentVisibleAreas.forEach(tileKey => {
            const [coord1, coord2] = tileKey.split(',').map(Number);

            const wallMatches = new Map();
            (wallsByX.get(coord1) || []).forEach(wall => wallMatches.set(wall.key, wall));
            (wallsByY.get(coord2) || []).forEach(wall => wallMatches.set(wall.key, wall));

            const snapshotData = {
                terrain: terrainData[tileKey] || null,
                walls: Array.from(wallMatches.values()),
                objects: objectsByTile.get(tileKey) || [],
                dndElements: elementsByTile.get(tileKey) || [],
                gridItems: gridItemsByTile.get(tileKey) || []
            };

            const existingLegacy = levelEditorStore.memorySnapshots?.[tileKey];
            const existingPlayer = currentPlayerId
                ? levelEditorStore.playerMemories?.[currentPlayerId]?.memorySnapshots?.[tileKey]
                : null;
            const legacyUpToDate = !!levelEditorStore.exploredAreas?.[tileKey]
                && snapshotMatches(existingLegacy, snapshotData);
            const playerUpToDate = !currentPlayerId || (
                !!levelEditorStore.playerMemories?.[currentPlayerId]?.exploredAreas?.[tileKey]
                && snapshotMatches(existingPlayer, snapshotData)
            );
            if (legacyUpToDate && playerUpToDate) return;

            tileEntries.push({ key: tileKey, snapshot: snapshotData });
        });

        if (tileEntries.length > 0) {
            levelEditorStore.commitTileMemories(tileEntries, { playerId: currentPlayerId });
        }

        // Note: Explored circles are now stored separately and rendered as soft circles
    }, [
        afterimageEnabled,
        dynamicFogEnabled,
        viewingFromToken,
        currentPlayerId,
        visibleArea,
        terrainData,
        wallData,
        environmentalObjects,
        dndElements,
        gridItems,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        setPlayerExploredArea,
        addPlayerExploredPolygon,
        addPlayerExploredCircle,
        setExploredArea,
        addExploredPolygon,
        addExploredCircle
    ]);

    // Update token afterimages when tokens move out of view
    // CRITICAL: Afterimages persist until the player sees the SAME TOKEN ID again
    // CRITICAL FIX: Works when viewingFromToken is set, regardless of GM mode (allows GM to test)
    // UPDATED: Uses per-player memory system - each player has individual afterimages
    const updateTokenAfterimages = useCallback(() => {
        if (!afterimageEnabled || !dynamicFogEnabled || !viewingFromToken) {
            return;
        }

        // CRITICAL FIX: DUAL-WRITE instead of hard-requiring currentPlayerId
        // (see updateMemorySnapshots above). Afterimages now land in the legacy
        // store too, so they render even if the per-player id is missing/mismatched.

        const lastSeenPositions = lastSeenPositionsRef.current;
        const currentVisibility = currentVisibilityRef.current;
        const becomingInvisible = becomingInvisibleRef.current;

        // Merged view: per-player afterimages + legacy afterimages
        const currentPlayerAfterimages = {
            ...(useLevelEditorStore.getState().tokenAfterimages || {}),
            ...getPlayerTokenAfterimages()
        };

        // Track all tokens (creatures and characters)
        // Merge creature data with token data for complete information
        // CRITICAL FIX: Use creatureTokens (the actual array), not tokens (always empty alias)

        const allTokens = [
            ...(creatureTokens || []).map(t => {
                const creature = creatures.find(c => c.id === t.creatureId);
                return {
                    ...t,
                    ...creature,
                    type: 'creature',
                    id: t.id,
                    creatureId: t.creatureId
                };
            }),
            ...(characterTokens || []).map(t => ({ ...t, type: 'character', id: t.id, characterId: t.characterId }))
        ];

        // Throttled summary logging
        const debugNow = Date.now();
        if (!lastLogTimeRef.current || debugNow - lastLogTimeRef.current > 5000) {
            lastLogTimeRef.current = debugNow;
            console.log('👻 [Afterimage] Token tracking:', {
                creatureTokens: creatureTokens?.length || 0,
                characterTokens: characterTokens?.length || 0,
                totalTracked: allTokens.length,
                visibleAreaSize: visibleAreaSet?.size || 0,
                currentPlayerId,
                viewingFromTokenId: viewingFromToken?.id
            });
        }

        allTokens.forEach(token => {
            if (!token.position) return;

            // Get grid coordinates
            const tokenGridX = Math.floor((token.position.x - gridOffsetX) / gridSize);
            const tokenGridY = Math.floor((token.position.y - gridOffsetY) / gridSize);
            const tokenTileKey = `${tokenGridX},${tokenGridY}`;

            // Check if token is currently visible using ALL vision sources
            // (primary character vision + secondary controlled creature vision)
            let isCurrentlyVisible = false;

            if (viewingFromToken && viewingFromToken.position) {
                if (expandedVisibleAreaSet && expandedVisibleAreaSet.size > 0) {
                    // Use unified visibility check that considers both primary and secondary vision,
                    // including wall-occlusion via polygons from both sources
                    isCurrentlyVisible = isPointVisibleViaAnyVision(
                        token.position.x,
                        token.position.y,
                        tokenTileKey
                    );
                } else {
                    // Visibility not calculated yet - assume visible to prevent premature afterimage creation
                    isCurrentlyVisible = true;
                }
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
                // DUAL-WRITE removal: per-player + legacy
                if (currentPlayerAfterimages[token.id]) {
                    removePlayerTokenAfterimage(token.id);
                    removeTokenAfterimage(token.id);
                }

                // Update visibility state:
                // CRITICAL: Only update lastChangeTime on the transition (invisible → visible).
                // If we overwrite lastChangeTime every cycle while visible, wasStableVisible
                // is ALWAYS false (now - lastChangeTime is always < debounce), and no afterimage
                // is ever created.
                if (!prevState.visible) {
                    // Just became visible: record when it first appeared
                    currentVisibility.set(token.id, { visible: true, lastChangeTime: now });
                }
                // If already visible, do NOT touch lastChangeTime: we need it stable so we can
                // measure how long the token has been in view.

            } else {
                // Token is NOT visible

                // Check if this is a transition from visible to invisible
                const wasStableVisible = prevState.visible && (now - prevState.lastChangeTime) > VISIBILITY_DEBOUNCE_MS;

                if (wasStableVisible && !becomingInvisible.has(token.id)) {
                    // Token JUST became invisible after being stably visible
                    // Create afterimage at LAST SEEN position
                    const lastSeen = lastSeenPositions.get(token.id);

                    console.log('👻 [Afterimage] Token became invisible, checking lastSeen:', {
                        tokenId: token.id,
                        tokenType: token.type,
                        hasLastSeen: !!lastSeen,
                        hasWorldPosition: !!lastSeen?.worldPosition,
                        position: lastSeen?.worldPosition
                    });

                    if (lastSeen && lastSeen.worldPosition) {
                        const timerId = setTimeout(() => {
                            let stillInvisible = true;
                            const currentStore = useLevelEditorStore.getState();
                            const currentPrimarySet = currentStore.visibleArea
                                ? (currentStore.visibleArea instanceof Set ? currentStore.visibleArea : new Set(currentStore.visibleArea))
                                : null;
                            const currentSecondaryTiles = currentStore.controlledVisibleTiles || null;
                            const currentSecondaryPolygons = currentStore.additionalVisibilityPolygons || [];
                            const currentPrimaryPolygon = currentStore.visibilityPolygon;

                            if (currentPrimarySet || currentSecondaryTiles) {
                                const currentTokens = [...(useCreatureStore.getState().creatureTokens || []), ...(useCharacterTokenStore.getState().characterTokens || [])];
                                const currentToken = currentTokens.find(t => t.id === token.id);

                                if (currentToken && currentToken.position) {
                                    const currentGridX = Math.floor((currentToken.position.x - gridOffsetX) / gridSize);
                                    const currentGridY = Math.floor((currentToken.position.y - gridOffsetY) / gridSize);
                                    const currentTileKey = `${currentGridX},${currentGridY}`;

                                    let isVisibleViaPrimary = false;
                                    if (currentPrimarySet && currentPrimarySet.has(currentTileKey)) {
                                        if (currentPrimaryPolygon && currentPrimaryPolygon.length >= 3) {
                                            isVisibleViaPrimary = isPointInPolygon(
                                                currentToken.position.x,
                                                currentToken.position.y,
                                                currentPrimaryPolygon
                                            );
                                        } else {
                                            isVisibleViaPrimary = true;
                                        }
                                    }

                                    let isVisibleViaSecondary = false;
                                    if (!isVisibleViaPrimary && currentSecondaryTiles) {
                                        const secondarySet = new Set(currentSecondaryTiles);
                                        if (secondarySet.has(currentTileKey)) {
                                            if (currentSecondaryPolygons.length > 0) {
                                                for (const poly of currentSecondaryPolygons) {
                                                    if (poly && poly.length >= 3 && isPointInPolygon(
                                                        currentToken.position.x,
                                                        currentToken.position.y,
                                                        poly
                                                    )) {
                                                        isVisibleViaSecondary = true;
                                                        break;
                                                    }
                                                }
                                            } else {
                                                isVisibleViaSecondary = true;
                                            }
                                        }
                                    }

                                    stillInvisible = !(isVisibleViaPrimary || isVisibleViaSecondary);
                                }
                            }

                            if (stillInvisible) {
                                // DUAL-WRITE creation: per-player + legacy stores
                                const storeNow = useLevelEditorStore.getState();
                                const latestPerPlayer = storeNow.getPlayerTokenAfterimages
                                    ? storeNow.getPlayerTokenAfterimages() : {};
                                const latestLegacy = storeNow.tokenAfterimages || {};
                                if (!latestPerPlayer[token.id] && !latestLegacy[token.id]) {
                                    const afterimagePosition = {
                                        ...lastSeen.gridPosition,
                                        worldPosition: lastSeen.worldPosition
                                    };
                                    if (currentPlayerId) {
                                        updatePlayerTokenAfterimage(token.id, lastSeen.tokenData, afterimagePosition);
                                    }
                                    updateTokenAfterimage(token.id, lastSeen.tokenData, afterimagePosition);

                                    if (currentPlayerId) {
                                        setPlayerExploredArea(lastSeen.gridPosition.x, lastSeen.gridPosition.y, true);
                                    }
                                    setExploredArea(lastSeen.gridPosition.x, lastSeen.gridPosition.y, true);
                                }
                            }

                            becomingInvisible.delete(token.id);
                        }, 150);

                        becomingInvisible.set(token.id, timerId);
                    }
                }

                // Update visibility state (don't clear lastSeenPositions - that's our memory!)
                if (prevState.visible) {
                    currentVisibility.set(token.id, { visible: false, lastChangeTime: now });
                }
            }
        });

        // CORRECT LOGIC: Afterimages are MEMORIES - only remove when:
        // 1. Token no longer exists in the game (destroyed)
        // 2. Player sees the SAME token at a NEW location (memory updates with new info)
        // Seeing "nothing" at the old location does NOT remove the memory!
        // DUAL-STORE cleanup: iterate the merged per-player + legacy sets.
        const storeState = useLevelEditorStore.getState();
        const latestAfterimages = {
            ...(storeState.tokenAfterimages || {}),
            ...(storeState.getPlayerTokenAfterimages ? storeState.getPlayerTokenAfterimages() : {})
        };
        Object.entries(latestAfterimages).forEach(([tokenId, afterimage]) => {
            if (!afterimage?.position?.worldPosition) return;

            // Find the current token in the game
            const currentToken = allTokens.find(t => t.id === tokenId);

            // Case 1: Token no longer exists in the game - remove memory (creature was destroyed/removed)
            if (!currentToken) {
                if (currentPlayerId) removePlayerTokenAfterimage(tokenId);
                removeTokenAfterimage(tokenId);
                lastSeenPositions.delete(tokenId);
                return;
            }

            // Case 2: Token exists - only remove if player CURRENTLY sees it at its NEW location
            // This is when the player gets new information that updates their memory
            // Uses unified check against BOTH primary and secondary vision (including wall-occlusion)
            if (currentToken.position) {
                const newGridX = Math.floor((currentToken.position.x - gridOffsetX) / gridSize);
                const newGridY = Math.floor((currentToken.position.y - gridOffsetY) / gridSize);
                const newTileKey = `${newGridX},${newGridY}`;

                const canSeeNewLocation = isPointVisibleViaAnyVision(
                    currentToken.position.x,
                    currentToken.position.y,
                    newTileKey
                );

                if (canSeeNewLocation) {
                    if (currentPlayerId) removePlayerTokenAfterimage(tokenId);
                    removeTokenAfterimage(tokenId);
                    // lastSeenPositions will be updated by the visibility tracking above
                }
                // Otherwise KEEP the afterimage - player hasn't seen where the token moved!
                // The memory persists until they have new information
            }
        });

        // Remove afterimages for tokens that no longer exist in the game
        // DUAL-STORE cleanup: per-player + legacy
        Object.keys(latestAfterimages).forEach(tokenId => {
            const tokenExists = allTokens.some(t => t.id === tokenId);
            if (!tokenExists && latestAfterimages[tokenId]) {
                if (currentPlayerId) removePlayerTokenAfterimage(tokenId);
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
        currentPlayerId,
        creatureTokens,
        creatures,
        characterTokens,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        visibleAreaSet,
        visibilityPolygon,
        controlledVisibleTileSet,
        additionalVisibilityPolygons,
        isPointVisibleViaAnyVision,
        updatePlayerTokenAfterimage,
        removePlayerTokenAfterimage,
        updateTokenAfterimage,
        removeTokenAfterimage,
        setPlayerExploredArea,
        setExploredArea,
        getPlayerTokenAfterimages
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

        // PERFORMANCE FIX: Defer expensive memory snapshot updates to idle periods
        // This prevents blocking when tokens are placed
        if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(() => {
                updateMemorySnapshots();
            }, { timeout: 100 });
        } else {
            setTimeout(() => {
                updateMemorySnapshots();
            }, 0);
        }
    }, [afterimageEnabled, dynamicFogEnabled, viewingFromToken, visibleArea, updateMemorySnapshots, isModeSwitching]);

    // Update token afterimages when tokens move or visibility changes
    // CRITICAL FIX: Works when viewingFromToken is set, regardless of GM mode (allows GM to test)
    useEffect(() => {
        if (!afterimageEnabled || !dynamicFogEnabled || !viewingFromToken || isModeSwitching) return;

        // PERFORMANCE FIX: Defer expensive afterimage updates to idle periods
        // This prevents blocking when first token is placed
        if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(() => {
                updateTokenAfterimages();
            }, { timeout: 100 });
        } else {
            setTimeout(() => {
                updateTokenAfterimages();
            }, 0);
        }
    }, [
        afterimageEnabled,
        dynamicFogEnabled,
        viewingFromToken,
        visibleArea,
        creatureTokens,
        characterTokens,
        updateTokenAfterimages,
        isModeSwitching
    ]);

    // Clear tracking refs on map change to prevent cross-map afterimage bleed
    useEffect(() => {
        if (!currentMapId) return;

        console.log('🧹 [MemorySnapshotManager] Map changed, clearing tracking refs:', currentMapId);

        // Clear tracking refs
        lastSeenPositionsRef.current.clear();
        currentVisibilityRef.current.clear();

        // Clear any pending invisible timers
        const becomingInvisible = becomingInvisibleRef.current;
        becomingInvisible.forEach((timerId) => {
            clearTimeout(timerId);
        });
        becomingInvisible.clear();
    }, [currentMapId]);

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

