import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useSettingsStore from '../../store/settingsStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { calculateVisibleTiles, calculateVisibilityPolygon } from '../../utils/VisibilityCalculations';

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

        // PERFORMANCE: Skip recalculation while token is being dragged (placement-only mode)
        // The fog will update correctly on mouseup when the token is dropped
        if (viewUpdateOnPlacement && window._isDraggingToken) {
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

        // Update store
        setVisibleArea(visibleTiles);
        setVisibilityPolygon(visibilityPolygon);

        // Also add to explored areas (for memory system)
        // CRITICAL FIX: Use per-player explored polygon when currentPlayerId is set
        if (visibilityPolygon && visibilityPolygon.length >= 3) {
            if (currentPlayerId && addPlayerExploredPolygon) {
                addPlayerExploredPolygon(visibilityPolygon);
            } else if (addExploredPolygon) {
                // Fallback to global for backward compatibility
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
        viewUpdateOnPlacement
    ]);

    // Recalculate visibility when dependencies change - WITH THROTTLING
    useEffect(() => {
        // Check if anything actually changed
        const lastCalc = lastCalculationRef.current;
        const positionChanged = lastCalc.positionKey !== positionKey;
        const wallDataChanged = lastCalc.wallDataKey !== wallDataKey;
        const visionChanged = lastCalc.visionKey !== visionKey;

        if (!positionChanged && !wallDataChanged && !visionChanged) {
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
    }, [positionKey, wallDataKey, visionKey, calculateVisibility, currentViewingToken?.position]);

    // Also recalculate when viewingFromToken changes (new token selected)
    useEffect(() => {
        if (viewingFromToken) {
            // Reset all cache and timing when switching viewing token
            lastCalculationRef.current = {
                positionKey: null,
                wallDataKey: null,
                visionKey: null,
                lastCalcTime: 0,
                lastPosition: null
            };
            calculateVisibility();
        } else {
            // Clear visibility when no viewing token
            setVisibleArea(null);
            setVisibilityPolygon(null);
        }
    }, [viewingFromToken, calculateVisibility, setVisibleArea, setVisibilityPolygon]);

    // This component renders nothing
    return null;
};

export default TokenVisibilityCalculator;
