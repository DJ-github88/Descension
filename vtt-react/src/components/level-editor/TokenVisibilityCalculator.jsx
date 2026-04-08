import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useSettingsStore from '../../store/settingsStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { calculateVisibleTiles, calculateVisibilityPolygon, feetToTiles } from '../../utils/VisibilityCalculations';

// PERFORMANCE: Minimum time between visibility recalculations (ms)
const MIN_RECALCULATION_INTERVAL = 50;
// PERFORMANCE: Minimum movement distance to trigger recalculation
const MIN_MOVEMENT_THRESHOLD = 5;

/**
 * TokenVisibilityCalculator - Reactively calculates visibility for the viewing token
 * 
 * This component is the MISSING LINK in the fog system. It:
 * 1. Watches viewingFromToken and its live position
 * 2. Calculates visibleArea (Set of tile keys) using calculateVisibleTiles
 * 3. Calculates visibilityPolygon (array of world points) using calculateVisibilityPolygon
 * 4. Updates the store so other components can use this data
 * 
 * This component renders nothing - it's purely for side effects (store updates).
 */
const TokenVisibilityCalculator = () => {
    const lastCalculationRef = useRef({
        positionKey: null,
        wallDataKey: null,
        visionKey: null,
        controlledCreaturePositionKey: null,
        lastCalcTime: 0,
        lastPosition: null
    });

    // PERFORMANCE: Track pending calculation to avoid duplicate RAFs
    const pendingCalculationRef = useRef(null);

    // Game store subscriptions
    const gridSize = useGameStore(state => state.gridSize) || 50;
    const gridOffsetX = useGameStore(state => state.gridOffsetX) || 0;
    const gridOffsetY = useGameStore(state => state.gridOffsetY) || 0;
    const gridType = useGameStore(state => state.gridType) || 'square';

    // Level editor store subscriptions
    const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
    const dynamicFogEnabled = useLevelEditorStore(state => state.dynamicFogEnabled);
    const isGMMode = useGameStore(state => state.isGMMode);
    const wallData = useLevelEditorStore(state => state.wallData) || {};
    const tokenVisionRanges = useLevelEditorStore(state => state.tokenVisionRanges) || {};
    const fovAngle = useLevelEditorStore(state => state.fovAngle) || 360;
    const tokenFacingDirections = useLevelEditorStore(state => state.tokenFacingDirections) || {};
    const respectLineOfSight = useLevelEditorStore(state => state.respectLineOfSight);
    const windowOverlays = useLevelEditorStore(state => state.windowOverlays) || {};
    const setVisibleArea = useLevelEditorStore(state => state.setVisibleArea);
    const setVisibilityPolygon = useLevelEditorStore(state => state.setVisibilityPolygon);
    const addExploredPolygon = useLevelEditorStore(state => state.addExploredPolygon);
    const addPlayerExploredPolygon = useLevelEditorStore(state => state.addPlayerExploredPolygon);
    const currentPlayerId = useLevelEditorStore(state => state.currentPlayerId);
    const setControlledVisibleData = useLevelEditorStore(state => state.setControlledVisibleData);

    // Vision update timing setting
    const viewUpdateOnPlacement = useSettingsStore(state => state.viewUpdateOnPlacement ?? true);

    // Token store subscriptions - for getting LIVE token positions
    // CRITICAL: Must use creatureTokens (state.tokens is always empty - broken alias in creatureStore)
    const creatureTokens = useCreatureStore(state => state.creatureTokens) || [];
    const characterTokens = useCharacterTokenStore(state => state.characterTokens) || [];

    // Get the LIVE viewing token (with current position, not stale)
    // This is the same pattern used in StaticFogOverlay.jsx
    const currentViewingToken = useMemo(() => {
        if (!viewingFromToken) return null;
        const allTokens = [...creatureTokens, ...characterTokens];
        return allTokens.find(t =>
            t.id === viewingFromToken.id ||
            t.creatureId === viewingFromToken.id ||
            t.characterId === viewingFromToken.id ||
            t.id === viewingFromToken.characterId ||
            t.id === viewingFromToken.creatureId
        );
    }, [viewingFromToken, creatureTokens, characterTokens]);

    // Get token ID for looking up vision range and facing direction
    const viewingTokenId = useMemo(() => {
        if (!viewingFromToken) return null;
        return viewingFromToken.type === 'creature'
            ? (viewingFromToken.creatureId || viewingFromToken.id)
            : (viewingFromToken.characterId || viewingFromToken.id);
    }, [viewingFromToken]);

    // Get vision settings for this token
    const visionSettings = useMemo(() => {
        if (!viewingTokenId) return { range: 6, type: 'normal' };
        const vision = tokenVisionRanges[viewingTokenId] || {};
        return {
            range: vision.range || 6,
            type: vision.type || 'normal'
        };
    }, [viewingTokenId, tokenVisionRanges]);

    // Get facing direction for this token
    const facingAngle = useMemo(() => {
        if (!viewingTokenId) return null;
        return tokenFacingDirections[viewingTokenId] || null;
    }, [viewingTokenId, tokenFacingDirections]);

    // Create cache keys to prevent unnecessary recalculations
    const positionKey = useMemo(() => {
        if (!currentViewingToken?.position) return null;
        return `${currentViewingToken.position.x.toFixed(2)},${currentViewingToken.position.y.toFixed(2)}`;
    }, [currentViewingToken?.position]);

    const wallDataKey = useMemo(() => {
        if (!wallData || Object.keys(wallData).length === 0) return 'empty';
        return Object.keys(wallData).length + '_' +
            Object.entries(wallData).slice(0, 5).map(([k, v]) => `${k}:${v}`).join('|');
    }, [wallData]);

    const visionKey = useMemo(() => {
        const windowCount = Object.keys(windowOverlays).length;
        return `${visionSettings.range}_${visionSettings.type}_${fovAngle}_${facingAngle}_${respectLineOfSight}_${windowCount}`;
    }, [visionSettings, fovAngle, facingAngle, respectLineOfSight, windowOverlays]);

    // Track controlled creature positions to trigger recalculation when they move
    const controlledCreaturePositionKey = useMemo(() => {
        if (isGMMode || !currentPlayerId || !creatureTokens) return '';
        try {
            const gs = require('../../store/gameStore').default.getState();
            const myUserId = require('../../store/authStore').default.getState().user?.uid;
            const myId = gs.currentPlayer?.id;
            const myName = gs.currentPlayer?.name;
            const controlled = creatureTokens.filter(t => {
                if (!t.position || t.state?.hiddenFromPlayers) return false;
                const oid = t.state?.ownerId || t.state?.playerId;
                if (!oid) return false;
                return oid === myId || oid === myUserId || oid === myName;
            });
            if (controlled.length === 0) return '';
            return controlled
                .map(t => `${t.id}:${Math.round(t.position.x)},${Math.round(t.position.y)}`)
                .sort()
                .join('|');
        } catch {
            return '';
        }
    }, [creatureTokens, isGMMode, currentPlayerId]);

    // PERFORMANCE: Separate throttle for controlled creature vision (less critical, ~200ms)
    const lastCreatureCalcRef = useRef({ key: null, time: 0 });
    const CREATURE_RECALC_INTERVAL = 200;

    // Main visibility calculation function
    const calculateVisibility = useCallback(() => {
        // Skip if not in player mode or dynamic fog is disabled
        if (isGMMode && !viewingFromToken) {
            // In GM mode without viewing from token, clear visibility
            setVisibleArea(null);
            setVisibilityPolygon(null);
            return;
        }

        // Skip if no viewing token or no position
        if (!currentViewingToken?.position) {
            setVisibleArea(null);
            setVisibilityPolygon(null);
            return;
        }

        // Skip if dynamic fog is disabled
        if (!dynamicFogEnabled) {
            setVisibleArea(null);
            setVisibilityPolygon(null);
            return;
        }

        const gridSystem = getGridSystem();
        const { range: visionRange, type: visionType } = visionSettings;

        // Convert world position to grid coordinates
        const gridCoords = gridSystem.worldToGrid(
            currentViewingToken.position.x,
            currentViewingToken.position.y
        );

        // Calculate visible tiles (for tile-based visibility checks)
        const visibleTiles = calculateVisibleTiles(
            gridCoords.x,
            gridCoords.y,
            visionRange,
            visionType,
            respectLineOfSight ? wallData : {},
            {},
            fovAngle,
            facingAngle,
            gridType,
            gridSystem,
            respectLineOfSight ? windowOverlays : {}
        );

        // Calculate visibility polygon (for smooth fog rendering)
        const visibilityPolygon = calculateVisibilityPolygon(
            currentViewingToken.position.x,
            currentViewingToken.position.y,
            visionRange,
            respectLineOfSight ? wallData : {},
            gridSize,
            gridOffsetX,
            gridOffsetY,
            fovAngle,
            facingAngle,
            respectLineOfSight ? windowOverlays : {}
        );

        // Update store - PRIMARY vision only (stable for afterimage system)
        setVisibleArea(visibleTiles);
        setVisibilityPolygon(visibilityPolygon);

        // PERFORMANCE: Throttle controlled creature vision to ~200ms
        // Primary vision is always immediate; creature vision is less critical
        const creatureCalcKey = controlledCreaturePositionKey || '';
        const now = Date.now();
        const lastCreature = lastCreatureCalcRef.current;
        const creatureShouldCalc = (now - lastCreature.time >= CREATURE_RECALC_INTERVAL) ||
            lastCreature.key !== creatureCalcKey;

        // ADDITIVE VISION: Compute secondary vision for controlled creatures
        // Secondary tiles go into controlledVisibleTiles (NOT merged into visibleArea)
        // to keep visibleArea stable for the afterimage system
        if (!isGMMode && currentPlayerId && creatureTokens) {
            if (creatureShouldCalc) {
                lastCreatureCalcRef.current = { key: creatureCalcKey, time: now };

                const gs = require('../../store/gameStore').default.getState();
                let myUserId = null;
                try { myUserId = require('../../store/authStore').default.getState().user?.uid; } catch {}
                const myId = gs.currentPlayer?.id;
                const myName = gs.currentPlayer?.name;

                const controlledCreatures = creatureTokens.filter(t => {
                    if (!t.position || t.state?.hiddenFromPlayers) return false;
                    const oid = t.state?.ownerId || t.state?.playerId;
                    if (!oid) return false;
                    return oid === myId || oid === myUserId || oid === myName;
                });

                if (controlledCreatures.length > 0) {
                    const allSecondaryTiles = new Set();
                    const allSecondaryPolygons = [];
                    const allSecondaryDetails = [];
                    const creatures = require('../../store/creatureStore').default.getState().creatures || [];
                    const feetPerTile = require('../../store/gameStore').default.getState().feetPerTile || 5;
                    const tvr = require('../../store/levelEditorStore').default.getState().tokenVisionRanges || {};
                    const tfdd = require('../../store/levelEditorStore').default.getState().tokenFacingDirections || {};

                    controlledCreatures.forEach(ct => {
                        const tokenId = ct.creatureId || ct.id;
                        const creature = creatures.find(c => c.id === ct.creatureId);
                        const vd = tvr[tokenId] || {};
                        let range = feetToTiles(30, feetPerTile, 'diameter');
                        let type = 'normal';
                        if (vd.manuallySet) {
                            range = vd.range || range;
                            type = vd.type || 'normal';
                        } else if (creature) {
                            if (creature.stats?.darkvision) {
                                range = feetToTiles(creature.stats.darkvision, feetPerTile, 'diameter');
                                type = 'darkvision';
                            } else if (creature.stats?.sightRange) {
                                range = feetToTiles(creature.stats.sightRange, feetPerTile, 'diameter');
                            }
                        }
                        const fa = tfdd[tokenId] || null;
                        const gc = gridSystem.worldToGrid(ct.position.x, ct.position.y);
                        const tiles = calculateVisibleTiles(gc.x, gc.y, range, type,
                            respectLineOfSight ? wallData : {}, {}, fovAngle, fa, gridType, gridSystem,
                            respectLineOfSight ? windowOverlays : {});
                        tiles.forEach(t => allSecondaryTiles.add(t));

                        const poly = calculateVisibilityPolygon(ct.position.x, ct.position.y, range,
                            respectLineOfSight ? wallData : {}, gridSize, gridOffsetX, gridOffsetY,
                            fovAngle, fa, respectLineOfSight ? windowOverlays : {});
                        
                        if (poly && poly.length >= 3) {
                            allSecondaryPolygons.push(poly);
                            // Store detailed metadata for each creature's vision
                            allSecondaryDetails.push({
                                tokenId,
                                position: { x: ct.position.x, y: ct.position.y },
                                visionRange: range,
                                polygon: poly
                            });
                        }

                        if (poly && poly.length >= 3 && currentPlayerId && addPlayerExploredPolygon) {
                            addPlayerExploredPolygon(poly);
                        }
                    });

                    setControlledVisibleData(allSecondaryTiles, allSecondaryPolygons, allSecondaryDetails);
                } else {
                    setControlledVisibleData(null, []);
                }
            }
            // else: skip controlled creature recalc this cycle, keep previous data
        } else {
            setControlledVisibleData(null, []);
        }

        // Also add to explored areas (for memory system)
        // CRITICAL FIX: Use per-player explored polygon when currentPlayerId is set
        if (visibilityPolygon && visibilityPolygon.length >= 3) {
            if (currentPlayerId && addPlayerExploredPolygon) {
                addPlayerExploredPolygon(visibilityPolygon);
            } else if (addExploredPolygon) {
                addExploredPolygon(visibilityPolygon);
            }
        }

    }, [
        isGMMode,
        viewingFromToken,
        currentViewingToken,
        dynamicFogEnabled,
        visionSettings,
        respectLineOfSight,
        wallData,
        windowOverlays,
        fovAngle,
        facingAngle,
        gridType,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        setVisibleArea,
        setVisibilityPolygon,
        addExploredPolygon,
        addPlayerExploredPolygon,
        currentPlayerId,
        viewUpdateOnPlacement,
        creatureTokens,
        setControlledVisibleData,
        controlledCreaturePositionKey
    ]);

    // Recalculate visibility when dependencies change - WITH THROTTLING
    useEffect(() => {
        // Check if anything actually changed
        const lastCalc = lastCalculationRef.current;
        const positionChanged = lastCalc.positionKey !== positionKey;
        const wallDataChanged = lastCalc.wallDataKey !== wallDataKey;
        const visionChanged = lastCalc.visionKey !== visionKey;
        const creaturePositionChanged = lastCalc.controlledCreaturePositionKey !== controlledCreaturePositionKey;

        if (!positionChanged && !wallDataChanged && !visionChanged && !creaturePositionChanged) {
            return;
        }

        // PERFORMANCE: Check if movement is significant enough to warrant recalculation
        if (positionChanged && currentViewingToken?.position && lastCalc.lastPosition) {
            const dx = currentViewingToken.position.x - lastCalc.lastPosition.x;
            const dy = currentViewingToken.position.y - lastCalc.lastPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Skip if movement is too small (reduces calculations during slow movement)
            if (distance < MIN_MOVEMENT_THRESHOLD && !wallDataChanged && !visionChanged) {
                return;
            }
        }

        // PERFORMANCE: Throttle calculations to prevent excessive recalculations
        const now = Date.now();
        const timeSinceLastCalc = now - lastCalc.lastCalcTime;

        if (timeSinceLastCalc < MIN_RECALCULATION_INTERVAL) {
            // Cancel any pending calculation
            if (pendingCalculationRef.current) {
                cancelAnimationFrame(pendingCalculationRef.current);
            }

            // Schedule for later
            pendingCalculationRef.current = requestAnimationFrame(() => {
                const currentTime = Date.now();
                if (currentTime - lastCalculationRef.current.lastCalcTime >= MIN_RECALCULATION_INTERVAL) {
                    lastCalculationRef.current = {
                        ...lastCalculationRef.current,
                        positionKey,
                        wallDataKey,
                        visionKey,
                        controlledCreaturePositionKey,
                        lastCalcTime: currentTime,
                        lastPosition: currentViewingToken?.position
                            ? { ...currentViewingToken.position }
                            : null
                    };
                    calculateVisibility();
                    pendingCalculationRef.current = null;
                }
            });
            return;
        }

        // Update cache and calculate
        lastCalculationRef.current = {
            ...lastCalculationRef.current,
            positionKey,
            wallDataKey,
            visionKey,
            controlledCreaturePositionKey,
            lastCalcTime: now,
            lastPosition: currentViewingToken?.position
                ? { ...currentViewingToken.position }
                : null
        };

        // Use requestAnimationFrame to avoid blocking UI
        requestAnimationFrame(() => {
            calculateVisibility();
        });

        // Cleanup pending calculation on unmount
        return () => {
            if (pendingCalculationRef.current) {
                cancelAnimationFrame(pendingCalculationRef.current);
            }
        };
    }, [positionKey, wallDataKey, visionKey, controlledCreaturePositionKey, calculateVisibility, currentViewingToken?.position]);

    // Also recalculate when viewingFromToken changes (new token selected)
    useEffect(() => {
        if (viewingFromToken) {
            // Reset all cache and timing when switching viewing token
            lastCalculationRef.current = {
                positionKey: null,
                wallDataKey: null,
                visionKey: null,
                controlledCreaturePositionKey: null,
                lastCalcTime: 0,
                lastPosition: null
            };
            calculateVisibility();
        } else {
            // Clear visibility when no viewing token
            setVisibleArea(null);
            setVisibilityPolygon(null);
            setControlledVisibleData(null, []);
        }
    }, [viewingFromToken, calculateVisibility, setVisibleArea, setVisibilityPolygon, setControlledVisibleData]);

    // This component renders nothing
    return null;
};

export default TokenVisibilityCalculator;
