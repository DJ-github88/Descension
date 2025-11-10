import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { calculateVisibleTiles, calculateVisibilityPolygon } from '../../utils/VisibilityCalculations';
import { rafThrottle, isRectInViewport } from '../../utils/performanceUtils';

const StaticFogOverlay = () => {
    const canvasRef = useRef(null);

    // CRITICAL PERFORMANCE FIX: Don't subscribe to camera, zoom, or entire stores!
    // StaticFogOverlay is expensive - only subscribe to what actually needs to trigger re-renders
    const gridSize = useGameStore(state => state.gridSize);
    const gridOffsetX = useGameStore(state => state.gridOffsetX);
    const gridOffsetY = useGameStore(state => state.gridOffsetY);
    // NOTE: NO zoomLevel, playerZoom subscription - causes re-renders during zoom/drag
    // NOTE: cameraX, cameraY needed for fog positioning when grid moves
    const cameraX = useGameStore(state => state.cameraX);
    const cameraY = useGameStore(state => state.cameraY);
    const isGMMode = useGameStore(state => state.isGMMode);

    // CRITICAL: Subscribe selectively, not to entire levelEditorStore
    const fogOfWarPaths = useLevelEditorStore(state => state.fogOfWarPaths);
    const fogErasePaths = useLevelEditorStore(state => state.fogErasePaths);
    const fogOfWarData = useLevelEditorStore(state => state.fogOfWarData);
    const fogOfWarEnabled = useLevelEditorStore(state => state.fogOfWarEnabled);
    const drawingLayers = useLevelEditorStore(state => state.drawingLayers);
    const wallData = useLevelEditorStore(state => state.wallData);
    const dynamicFogEnabled = useLevelEditorStore(state => state.dynamicFogEnabled);
    const respectLineOfSight = useLevelEditorStore(state => state.respectLineOfSight);
    // PERFORMANCE FIX: Don't subscribe to revealedAreas/exploredAreas - they change constantly!
    // Read them directly in render callback when needed (like camera/zoom)
    // const revealedAreas = useLevelEditorStore(state => state.revealedAreas);
    // const exploredAreas = useLevelEditorStore(state => state.exploredAreas);
    const tokenVisionRanges = useLevelEditorStore(state => state.tokenVisionRanges);
    const storeViewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
    const setViewingFromToken = useLevelEditorStore(state => state.setViewingFromToken);
    const setVisibleArea = useLevelEditorStore(state => state.setVisibleArea);
    const fovAngle = useLevelEditorStore(state => state.fovAngle);
    const tokenFacingDirections = useLevelEditorStore(state => state.tokenFacingDirections);
    const getTokenFacingDirection = useLevelEditorStore(state => state.getTokenFacingDirection);

    // Get tokens for vision calculation
    const { tokens: creatureTokens } = useCreatureStore();
    const { characterTokens } = useCharacterTokenStore();
    
    // Get currently viewed token (if viewing from token perspective)
    // Use store's explicitly set token as source of truth - don't auto-detect
    const viewingFromToken = storeViewingFromToken;
    
    // Track the current token with updated position when it moves (for vision calculation)
    const [currentViewingToken, setCurrentViewingToken] = React.useState(null);
    
    // PERFORMANCE FIX: Track mode transitions to skip expensive calculations during switch
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const previousGMModeRef = useRef(isGMMode);
    
    // Detect mode changes and set transitioning state
    useEffect(() => {
        if (previousGMModeRef.current !== isGMMode) {
            setIsTransitioning(true);
            // Clear transitioning flag after UI has settled
            const timeoutId = setTimeout(() => {
                setIsTransitioning(false);
            }, 300); // Wait for mode transition to complete
            
            previousGMModeRef.current = isGMMode;
            return () => clearTimeout(timeoutId);
        }
    }, [isGMMode]);
    
    // Update the viewing token's position when the token moves (for vision calculation)
    useEffect(() => {
        if (!viewingFromToken) {
            setCurrentViewingToken(null);
            return;
        }
        
        // Find the actual token with current position from all tokens
        const allTokens = [...creatureTokens.map(t => ({ ...t, type: 'creature' })), ...characterTokens.map(t => ({ ...t, type: 'character' }))];
        
        // Get the token ID
        const tokenId = viewingFromToken.type === 'creature' 
            ? (viewingFromToken.creatureId || viewingFromToken.id)
            : (viewingFromToken.characterId || viewingFromToken.id || viewingFromToken.playerId);
        
        // Find the current token with updated position
        const currentToken = allTokens.find(token => {
            const currentTokenId = token.type === 'creature'
                ? (token.creatureId || token.id)
                : (token.characterId || token.id || token.playerId);
            return currentTokenId === tokenId;
        });
        
        if (currentToken && currentToken.position) {
            // Update state with current token position (for vision calculation)
            const updatedToken = {
                ...viewingFromToken,
                position: currentToken.position
            };
            setCurrentViewingToken(updatedToken);
        } else if (viewingFromToken.position) {
            // Use stored position if token not found (token might have been removed)
            setCurrentViewingToken(viewingFromToken);
        } else {
            setCurrentViewingToken(null);
        }
    }, [viewingFromToken, creatureTokens, characterTokens]);

    // PERFORMANCE FIX: Don't compute effectiveZoom reactively - read from store in callbacks
    // This prevents re-renders when user scrolls mouse wheel
    // Callbacks will read zoom directly when they execute

    // DEBUG: Removed render tracking - issue was in CreatureToken/GridItem camera subscriptions

    // CRITICAL PERFORMANCE FIX: Use ref to read isDraggingCamera from window flag
    // This prevents re-renders and useMemo recalculations when drag state changes
    // Grid sets window._isDraggingCamera directly
    const isDraggingCameraRef = useRef(false);
    const dragStartRef = useRef(null);
    
    // CRITICAL FIX: Track if we're actively scrolling/zooming to throttle expensive calculations
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);
    const lastVisibleAreaUpdateRef = useRef(0);
    
    // PERFORMANCE FIX: Poll window._isDraggingCamera flag set by Grid
    // Using ref instead of state prevents re-renders and useMemo recalculations
    React.useEffect(() => {
        const interval = setInterval(() => {
            isDraggingCameraRef.current = window._isDraggingCamera || false;
        }, 16); // Poll at 60fps
        
        return () => clearInterval(interval);
    }, []);
    
    // CRITICAL FIX: Update scrolling state globally whenever it changes
    React.useEffect(() => {
        const updateScrollingState = () => {
            if (typeof window !== 'undefined') {
                window._isScrolling = isScrollingRef.current;
            }
        };
        
        // Update immediately
        updateScrollingState();
        
        // Also update periodically to catch changes
        const interval = setInterval(updateScrollingState, 100);
        
        return () => clearInterval(interval);
    }, []);

    // REMOVED: Flaky drag detection logic - now reading isDraggingCamera from gameStore
    // Grid component manages this state reliably

    // Optimized viewport bounds calculation - cache world coordinates
    const viewportBounds = useMemo(() => {
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        const padding = 200; // pixels
        return {
            minX: viewport.x - padding,
            minY: viewport.y - padding,
            maxX: viewport.x + viewport.width + padding,
            maxY: viewport.y + viewport.height + padding
        };
    }, [window.innerWidth, window.innerHeight]); // PERFORMANCE FIX: Removed effectiveZoom - read from store when needed

    // PERFORMANCE FIX: Cache viewport bounds during drag/zoom to avoid expensive recalculations
    const cachedViewportWorldBoundsRef = useRef(null);
    const lastViewportBoundsParamsRef = useRef({ effectiveZoom: 0 });
    
    // Cached viewport bounds in world coordinates - only recalculate when viewport changes
    // PERFORMANCE FIX: Read zoom from store when needed, don't subscribe
    const viewportWorldBounds = useMemo(() => {
        // 🛑 PERFORMANCE: Return cached value during drag
        if (window._isDraggingCamera && cachedViewportWorldBoundsRef.current) {
            return cachedViewportWorldBoundsRef.current;
        }
        
        // Use grid system for consistency
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        const padding = 200;
        
        // Read camera and zoom directly from store
        const state = useGameStore.getState();
        const cameraX = state.cameraX;
        const cameraY = state.cameraY;
        const effectiveZoom = state.zoomLevel * state.playerZoom;
        
        // Convert screen bounds to world coordinates using grid system
        const minWorldX = ((viewportBounds.minX - viewport.width / 2) / effectiveZoom) + cameraX;
        const minWorldY = ((viewportBounds.minY - viewport.height / 2) / effectiveZoom) + cameraY;
        const maxWorldX = ((viewportBounds.maxX - viewport.width / 2) / effectiveZoom) + cameraX;
        const maxWorldY = ((viewportBounds.maxY - viewport.height / 2) / effectiveZoom) + cameraY;
        
        return { minX: minWorldX, minY: minWorldY, maxX: maxWorldX, maxY: maxWorldY };
    }, [viewportBounds]); // PERFORMANCE FIX: Removed effectiveZoom and isDraggingCamera - read zoom from store when this runs

    // Convert world coordinates to screen coordinates - optimized
    // Use grid system for consistency with other elements (tiles, tokens, etc.)
    const worldToScreen = useCallback((worldX, worldY) => {
        // Use grid system's worldToScreen for consistency with tiles, tokens, and other elements
        // This ensures fog moves correctly with the grid
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        return gridSystem.worldToScreen(worldX, worldY, viewport.width, viewport.height);
    }, [cameraX, cameraY]); // Depend on camera values so fog positions update when grid moves

    // Convert screen coordinates to world coordinates - optimized
    const screenToWorld = useCallback((screenX, screenY) => {
        // Read camera and zoom directly from store
        const state = useGameStore.getState();
        const effectiveZoom = state.zoomLevel * state.playerZoom;
        const cameraX = state.cameraX;
        const cameraY = state.cameraY;
        // Use direct calculation for better performance
        const worldX = (screenX - window.innerWidth / 2) / effectiveZoom + cameraX;
        const worldY = (screenY - window.innerHeight / 2) / effectiveZoom + cameraY;
        return { x: worldX, y: worldY };
    }, []); // PERFORMANCE FIX: No dependencies - read camera/zoom from store when called

    // PERFORMANCE FIX: Optimized path visibility check with aggressive viewport culling
    const isPathVisible = useCallback((path) => {
        if (!path.points || path.points.length === 0) return false;
        
        // PERFORMANCE FIX: Full-coverage paths (cover entire map) are always visible
        // These paths are meant to cover the entire map, so they should always be rendered
        if (path.points.length > 5000) {
            return true; // Always visible - these are full-coverage paths
        }
        
        // PERFORMANCE FIX: For very large paths, use sample-based visibility check
        // Only check a subset of points to determine if path intersects viewport
        const isVeryLargePath = path.points.length > 1000;
        let pointsToCheck = path.points;
        
        if (isVeryLargePath) {
            // Sample points: first, last, and evenly spaced middle points
            const sampleSize = Math.min(50, Math.floor(path.points.length / 20)); // Check ~50 points max
            const step = Math.floor(path.points.length / sampleSize);
            pointsToCheck = [];
            for (let i = 0; i < path.points.length; i += step) {
                pointsToCheck.push(path.points[i]);
            }
            // Always include first and last points
            if (path.points.length > 0) {
                pointsToCheck.push(path.points[0]);
                pointsToCheck.push(path.points[path.points.length - 1]);
            }
        }
        
        // Get bounding box of sampled path points
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        let maxRadius = 0;
        
        for (const point of pointsToCheck) {
            const worldX = point.worldX;
            const worldY = point.worldY;
            const radius = point.brushRadius || 0;
            maxRadius = Math.max(maxRadius, radius);
            
            minX = Math.min(minX, worldX - radius);
            minY = Math.min(minY, worldY - radius);
            maxX = Math.max(maxX, worldX + radius);
            maxY = Math.max(maxY, worldY + radius);
        }
        
        // PERFORMANCE FIX: Add extra padding for large paths to account for sampling
        const padding = isVeryLargePath ? maxRadius * 2 : 0;
        
        // Use cached viewport world bounds for fast AABB intersection check
        const intersects = !(
            maxX + padding < viewportWorldBounds.minX ||
            minX - padding > viewportWorldBounds.maxX ||
            maxY + padding < viewportWorldBounds.minY ||
            minY - padding > viewportWorldBounds.maxY
        );
        
        return intersects;
    }, [viewportWorldBounds]);

    // PERFORMANCE FIX: Cache visible paths during drag
    const cachedVisibleFogPathsRef = useRef([]);
    
    // PERFORMANCE FIX: Memoize sorted fog paths with visibility culling
    // During drag, skip expensive filtering - render all paths but let canvas culling handle it
    const visibleFogPaths = useMemo(() => {
        // 🛑 PERFORMANCE: Return cached value during drag
        if (window._isDraggingCamera && cachedVisibleFogPathsRef.current) {
            return cachedVisibleFogPathsRef.current;
        }
        
        const sorted = [...fogOfWarPaths].sort((a, b) => {
            const aTime = a.timestamp || 0;
            const bTime = b.timestamp || 0;
            return aTime - bTime;
        });
        
        // Normal filtering when not dragging
        const filtered = sorted.filter(path => isPathVisible(path));
        // Cache the result for use during drag
        cachedVisibleFogPathsRef.current = filtered;
        return filtered;
    }, [fogOfWarPaths, isPathVisible]); // PERFORMANCE FIX: Removed isDraggingCamera - now uses ref

    // PERFORMANCE FIX: Cache visible erase paths during drag
    const cachedVisibleErasePathsRef = useRef([]);
    
    // PERFORMANCE FIX: Memoize sorted erase paths with visibility culling
    const visibleErasePaths = useMemo(() => {
        // 🛑 PERFORMANCE: Return cached value during drag
        if (window._isDraggingCamera && cachedVisibleErasePathsRef.current) {
            return cachedVisibleErasePathsRef.current;
        }
        
        const sorted = [...fogErasePaths].sort((a, b) => {
            return (a.timestamp || 0) - (b.timestamp || 0);
        });
        
        const filtered = sorted.filter(path => isPathVisible(path));
        // Cache the result for use during drag
        cachedVisibleErasePathsRef.current = filtered;
        return filtered;
    }, [fogErasePaths, isPathVisible]); // PERFORMANCE FIX: Removed isDraggingCamera - now uses ref

    // PERFORMANCE FIX: Cache visible fog tiles during drag
    const cachedVisibleFogTilesRef = useRef([]);
    
    // PERFORMANCE FIX: Memoize visible legacy fog tiles with viewport culling
    const visibleFogTiles = useMemo(() => {
        // 🛑 PERFORMANCE: Return cached value during drag
        if (window._isDraggingCamera && cachedVisibleFogTilesRef.current) {
            return cachedVisibleFogTilesRef.current;
        }
        
        // Use cached viewport world bounds for faster calculation
        const { minX, minY, maxX, maxY } = viewportWorldBounds;
        
        const tileKeys = Object.keys(fogOfWarData);
        const visible = [];
        
        tileKeys.forEach(tileKey => {
            const [gridX, gridY] = tileKey.split(',').map(Number);
            const worldX = (gridX * gridSize) + gridOffsetX + (gridSize / 2);
            const worldY = (gridY * gridSize) + gridOffsetY + (gridSize / 2);
            
            if (worldX >= minX && worldX <= maxX && worldY >= minY && worldY <= maxY) {
                visible.push({ tileKey, gridX, gridY, worldX, worldY });
            }
        });
        
        // Cache the result for use during drag
        cachedVisibleFogTilesRef.current = visible;
        return visible;
    }, [fogOfWarData, viewportWorldBounds, gridSize, gridOffsetX, gridOffsetY]); // PERFORMANCE FIX: Removed isDraggingCamera - now uses ref

    // Check if fog should be visible
    const fogLayer = drawingLayers.find(layer => layer.id === 'fog');
    const isFogLayerVisible = fogLayer ? fogLayer.visible : true;
    
    // Calculate visible area for ALL tokens (not just viewing token) - for GM mode only
    // Skip this expensive calculation in player mode for better performance
    // Keep calculations during drag to maintain fog position updates
    const cachedAllTokensVisibleAreaRef = useRef(null);
    const allTokensVisibleArea = React.useMemo(() => {
        // 🛑 PERFORMANCE: FIRST CHECK - Return cached value during drag before any processing
        if (window._isDraggingCamera && cachedAllTokensVisibleAreaRef.current) {
            return cachedAllTokensVisibleAreaRef.current;
        }
        
        // PERFORMANCE FIX: Skip expensive calculations during mode transitions
        if (isTransitioning) return null;
        
        // Only calculate in GM mode - skip in player mode for performance
        // This is a very expensive calculation, so we skip it entirely in player mode
        if (!isGMMode || !dynamicFogEnabled) return null;
        
        // Combine visible areas from all tokens
        const allVisibleTiles = new Set();
        
        // Process all creature tokens
        creatureTokens.forEach(token => {
            if (!token.position) return;
            
            const gridX = Math.floor((token.position.x - gridOffsetX) / gridSize);
            const gridY = Math.floor((token.position.y - gridOffsetY) / gridSize);
            
            let visionRange = 6;
            let visionType = 'normal';
            const tokenId = token.creatureId || token.id;
            
            if (tokenVisionRanges[tokenId]) {
                visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
                visionType = tokenVisionRanges[tokenId].type || visionType;
            }
            
            if (!visionRange || visionRange <= 0 || isNaN(visionRange)) {
                visionRange = 6;
            }
            
            const facingAngle = tokenFacingDirections[tokenId] || null;
            const visibleTiles = calculateVisibleTiles(
                gridX,
                gridY,
                visionRange,
                visionType,
                respectLineOfSight ? wallData : {},
                {},
                fovAngle,
                facingAngle
            );
            
            visibleTiles.forEach(tileKey => allVisibleTiles.add(tileKey));
        });
        
        // Process all character tokens
        characterTokens.forEach(token => {
            if (!token.position) return;
            
            const gridX = Math.floor((token.position.x - gridOffsetX) / gridSize);
            const gridY = Math.floor((token.position.y - gridOffsetY) / gridSize);
            
            let visionRange = 6;
            let visionType = 'normal';
            const tokenId = token.characterId || token.id || token.playerId;
            
            if (tokenVisionRanges[tokenId]) {
                visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
                visionType = tokenVisionRanges[tokenId].type || visionType;
            }
            
            if (!visionRange || visionRange <= 0 || isNaN(visionRange)) {
                visionRange = 6;
            }
            
            const facingAngle = tokenFacingDirections[tokenId] || null;
            const visibleTiles = calculateVisibleTiles(
                gridX,
                gridY,
                visionRange,
                visionType,
                respectLineOfSight ? wallData : {},
                {},
                fovAngle,
                facingAngle
            );
            
            visibleTiles.forEach(tileKey => allVisibleTiles.add(tileKey));
        });
        
        const result = allVisibleTiles.size > 0 ? Array.from(allVisibleTiles) : null;
        // Cache the result for use during drag
        cachedAllTokensVisibleAreaRef.current = result;
        return result;
    }, [isTransitioning, isGMMode, creatureTokens, characterTokens, dynamicFogEnabled, gridSize, gridOffsetX, gridOffsetY, wallData, respectLineOfSight, tokenVisionRanges, fovAngle, tokenFacingDirections]);

    // Calculate visible area if viewing from token (for player mode)
    // CRITICAL PERFORMANCE FIX: Cache visible area during drag to prevent freezing
    const cachedVisibleAreaRef = useRef(null);
    const lastTokenPositionRef = useRef(null);
    
    // Extract position key for dependency tracking
    const tokenPositionKey = currentViewingToken?.position 
        ? `${Math.floor(currentViewingToken.position.x)},${Math.floor(currentViewingToken.position.y)}`
        : null;
    
    // Clear cache when token position changes (outside useMemo to ensure it runs)
    React.useEffect(() => {
        if (!window._isDraggingCamera && lastTokenPositionRef.current !== tokenPositionKey) {
            cachedVisibleAreaRef.current = null;
            lastTokenPositionRef.current = tokenPositionKey;
        }
    }, [tokenPositionKey]);
    
    const visibleArea = React.useMemo(() => {
        // 🛑 PERFORMANCE: Return cached value during camera drag only
        if (window._isDraggingCamera && cachedVisibleAreaRef.current) {
            return cachedVisibleAreaRef.current;
        }
        
        // PERFORMANCE FIX: Skip expensive calculations during mode transitions
        if (isTransitioning) {
            return cachedVisibleAreaRef.current;
        }
        
        // In GM mode, use all tokens' visible areas UNLESS viewing from a token
        // When viewing from a token, only show that token's vision (not all tokens' radii)
        if (isGMMode && !viewingFromToken) {
            return allTokensVisibleArea || null;
        }
        
        // In player mode, use viewing token's visible area
        if (!currentViewingToken || !dynamicFogEnabled) {
            return null;
        }
        
        const tokenPosition = currentViewingToken.position;
        if (!tokenPosition || tokenPosition.x === undefined || tokenPosition.y === undefined) {
            return null;
        }
        
        // Convert world coordinates to grid coordinates
        const gridX = Math.floor((tokenPosition.x - gridOffsetX) / gridSize);
        const gridY = Math.floor((tokenPosition.y - gridOffsetY) / gridSize);
        
        // Get vision data for this token
        let visionRange = 6;
        let visionType = 'normal';
        const tokenId = currentViewingToken.type === 'creature'
            ? (currentViewingToken.creatureId || currentViewingToken.id)
            : (currentViewingToken.characterId || currentViewingToken.id || currentViewingToken.playerId);
            
        if (tokenVisionRanges[tokenId]) {
            visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
            visionType = tokenVisionRanges[tokenId].type || visionType;
        }
        
        if (!visionRange || visionRange <= 0 || isNaN(visionRange)) {
            visionRange = 6;
        }
        
        const facingAngle = tokenFacingDirections[tokenId] || null;
        
        // EXPENSIVE CALCULATION - only run when not dragging
        const visibleTiles = calculateVisibleTiles(
            gridX,
            gridY,
            visionRange,
            visionType,
            respectLineOfSight ? wallData : {},
            {},
            fovAngle,
            facingAngle
        );


        // Cache the result for use during drag
        cachedVisibleAreaRef.current = visibleTiles;
        return visibleTiles;
    }, [isTransitioning, isGMMode, allTokensVisibleArea, currentViewingToken, tokenPositionKey, dynamicFogEnabled, gridSize, gridOffsetX, gridOffsetY, wallData, respectLineOfSight, tokenVisionRanges, fovAngle, tokenFacingDirections]); // Added tokenPositionKey to force recalculation

    // Calculate visibility polygon for accurate token visibility (separate from tile-based visibleArea)
    // CRITICAL PERFORMANCE FIX: Cache polygon during drag to prevent freezing
    const cachedVisibilityPolygonRef = useRef(null);
    const lastPolygonTokenPositionRef = useRef(null);
    
    // Determine which token to use for polygon calculation
    const tokenToUse = currentViewingToken;
    const polygonTokenPositionKey = tokenToUse?.position 
        ? `${Math.floor(tokenToUse.position.x)},${Math.floor(tokenToUse.position.y)}`
        : null;
    
    // Clear cache when token position changes (outside useMemo to ensure it runs)
    React.useEffect(() => {
        if (!window._isDraggingCamera && lastPolygonTokenPositionRef.current !== polygonTokenPositionKey) {
            cachedVisibilityPolygonRef.current = null;
            lastPolygonTokenPositionRef.current = polygonTokenPositionKey;
        }
    }, [polygonTokenPositionKey]);
    
    const visibilityPolygon = React.useMemo(() => {
        // 🛑 PERFORMANCE: Return cached value during camera drag only
        if (window._isDraggingCamera && cachedVisibilityPolygonRef.current) {
            return cachedVisibilityPolygonRef.current;
        }
        
        // PERFORMANCE FIX: Skip expensive calculations during mode transitions
        if (isTransitioning) return cachedVisibilityPolygonRef.current;
        
        if (!dynamicFogEnabled) return null;
        
        // In GM mode, we'll create a combined mask from all tokens (handled in render function)
        // But we still need a polygon for the viewing token if set
        if (isGMMode && !viewingFromToken) {
            // In GM mode without viewing from token, return null - we'll use allTokensVisibleArea
            return null;
        }
        
        // For player mode or GM mode viewing from token, use the viewing token
        if (!tokenToUse || !tokenToUse.position) {
            return null;
        }
        
        const tokenPosition = tokenToUse.position;
        let visionRange = 6; // Default
        const tokenId = tokenToUse.type === 'creature'
            ? (tokenToUse.creatureId || tokenToUse.id)
            : (tokenToUse.characterId || tokenToUse.id || tokenToUse.playerId);
            
        if (tokenVisionRanges[tokenId]) {
            visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
        }
        
        // Get facing direction for this token (for directional FOV)
        const facingAngle = tokenFacingDirections[tokenId] || null;
        
        // EXPENSIVE CALCULATION - only run when not dragging
        const polygon = calculateVisibilityPolygon(
            tokenPosition.x,
            tokenPosition.y,
            visionRange,
            respectLineOfSight ? wallData : {},
            gridSize,
            gridOffsetX,
            gridOffsetY,
            fovAngle,
            facingAngle
        );
        
        // Cache the result for use during drag
        cachedVisibilityPolygonRef.current = polygon;
        return polygon;
    }, [isTransitioning, isGMMode, viewingFromToken, currentViewingToken, tokenToUse, polygonTokenPositionKey, dynamicFogEnabled, gridSize, gridOffsetX, gridOffsetY, wallData, respectLineOfSight, tokenVisionRanges, fovAngle, tokenFacingDirections]); // Added polygonTokenPositionKey to force recalculation
    
    // Calculate visibility polygons for ALL tokens in GM mode (for combined mask)
    // CRITICAL PERFORMANCE FIX: Cache polygons during drag to prevent freezing
    const cachedAllTokensPolygonsRef = useRef([]);
    const allTokensVisibilityPolygons = React.useMemo(() => {
        // 🛑 PERFORMANCE: FIRST CHECK - Return cached value during drag before any processing
        if (window._isDraggingCamera && cachedAllTokensPolygonsRef.current.length > 0) {
            return cachedAllTokensPolygonsRef.current;
        }
        
        // PERFORMANCE FIX: Skip expensive calculations during mode transitions
        if (isTransitioning) return cachedAllTokensPolygonsRef.current;
        
        if (!isGMMode || !dynamicFogEnabled) {
            return [];
        }
        
        const polygons = [];
        
        // Process all creature tokens
        creatureTokens.forEach(token => {
            if (!token.position) return;
            
            let visionRange = 6;
            const tokenId = token.creatureId || token.id;
            
            if (tokenVisionRanges[tokenId]) {
                visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
            }
            
            if (!visionRange || visionRange <= 0 || isNaN(visionRange)) {
                visionRange = 6;
            }
            
            const facingAngle = tokenFacingDirections[tokenId] || null;
            
            const polygon = calculateVisibilityPolygon(
                token.position.x,
                token.position.y,
                visionRange,
                respectLineOfSight ? wallData : {},
                gridSize,
                gridOffsetX,
                gridOffsetY,
                fovAngle,
                facingAngle
            );
            
            if (polygon && polygon.length > 0) {
                polygons.push({ token, polygon, visionRange });
            }
        });
        
        // Process all character tokens
        characterTokens.forEach(token => {
            if (!token.position) return;
            
            let visionRange = 6;
            const tokenId = token.characterId || token.id || token.playerId;
            
            if (tokenVisionRanges[tokenId]) {
                visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
            }
            
            if (!visionRange || visionRange <= 0 || isNaN(visionRange)) {
                visionRange = 6;
            }
            
            const facingAngle = tokenFacingDirections[tokenId] || null;
            
            const polygon = calculateVisibilityPolygon(
                token.position.x,
                token.position.y,
                visionRange,
                respectLineOfSight ? wallData : {},
                gridSize,
                gridOffsetX,
                gridOffsetY,
                fovAngle,
                facingAngle
            );
            
            if (polygon && polygon.length > 0) {
                polygons.push({ token, polygon, visionRange });
            }
        });
        
        // Cache the result for use during drag
        cachedAllTokensPolygonsRef.current = polygons;
        return polygons;
    }, [isTransitioning, isGMMode, dynamicFogEnabled, creatureTokens, characterTokens, gridSize, gridOffsetX, gridOffsetY, wallData, respectLineOfSight, tokenVisionRanges, fovAngle, tokenFacingDirections]); // PERFORMANCE FIX: Removed isDraggingCamera - now uses ref

    // CRITICAL FIX: Update visible area in store with throttling during scrolling/dragging
    // This prevents expensive fog of war calculations from running on every camera/zoom change
    useEffect(() => {
        // CRITICAL PERFORMANCE FIX: SKIP ALL UPDATES DURING DRAG!
        // Even calling setVisibleArea triggers all token subscriptions causing re-renders
        // Using ref to check drag state prevents this useEffect from re-running when drag state changes
        if (isDraggingCameraRef.current || isScrollingRef.current) {
            // During drag, just schedule an update for when it stops
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            isScrollingRef.current = true;
            scrollTimeoutRef.current = setTimeout(() => {
                setVisibleArea(visibleArea);
                lastVisibleAreaUpdateRef.current = Date.now();
                
                const levelEditorStore = useLevelEditorStore.getState();
                if (levelEditorStore.setVisibilityPolygon) {
                    levelEditorStore.setVisibilityPolygon(visibilityPolygon);
                }
                
                isScrollingRef.current = false;
            }, 300); // Update 300ms after scrolling/dragging stops
            return; // SKIP update during drag
        }
        
        // Not dragging - update immediately
        setVisibleArea(visibleArea);
        lastVisibleAreaUpdateRef.current = Date.now();
        
        // Also store the polygon for accurate point-in-polygon checks
        const levelEditorStore = useLevelEditorStore.getState();
        if (levelEditorStore.setVisibilityPolygon) {
            levelEditorStore.setVisibilityPolygon(visibilityPolygon);
        }
        
        // Cleanup timeout on unmount
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [visibleArea, visibilityPolygon, setVisibleArea, currentViewingToken, tokenVisionRanges, gridSize, gridOffsetX, gridOffsetY]); // PERFORMANCE FIX: Removed isDraggingCamera - now uses ref

    // Get visible area as a Set for fast lookup
    const visibleAreaSet = useMemo(() => {
        if (!visibleArea) return new Set();
        return visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
    }, [visibleArea]);

    // NOTE: When viewing from a token, we DON'T update exploredAreas
    // This prevents creating a hard boundary at the initial position
    // The visibility mask handles revealing areas dynamically as the token moves

    // Helper function to determine fog state for a world position
    // In player mode, check explored areas; in GM mode, check all states
    const getFogState = useCallback((worldX, worldY) => {
        // Convert world coordinates to grid coordinates
        const gridX = Math.floor((worldX - gridOffsetX) / gridSize);
        const gridY = Math.floor((worldY - gridOffsetY) / gridSize);
        const tileKey = `${gridX},${gridY}`;
        
        // PERFORMANCE FIX: Read revealedAreas/exploredAreas from store when called
        const levelEditorState = useLevelEditorStore.getState();
        const revealedAreas = levelEditorState.revealedAreas || {};
        const exploredAreas = levelEditorState.exploredAreas || {};
        
        // CRITICAL FIX: When viewing from a token, show both current vision AND explored areas
        // This creates proper fog of war where players see explored areas plus current vision
        if (viewingFromToken && dynamicFogEnabled && visibleAreaSet && visibleAreaSet.size > 0) {
            // If tile is in current visible area, it's viewable
            if (visibleAreaSet.has(tileKey)) {
                return 'viewable'; // Currently visible - visibility mask will erase fog
            }
            // Show explored areas even when viewing from token - this is what the player has discovered
            if (exploredAreas[tileKey]) {
                return 'explored'; // Previously explored - dimmed but visible
            }
            // In GM mode, still show explored areas even when viewing from token
            // This allows GM to see what's been explored while still restricting to token vision
            if (isGMMode && exploredAreas[tileKey]) {
                return 'explored'; // Previously explored - dimmed but visible to GM
            }
            return 'covered'; // Not explored - fully covered fog
        }
        
        // Normal mode (not viewing from token): use explored/revealed areas
        // Check if currently visible (only if dynamic fog is enabled)
        if (dynamicFogEnabled && visibleAreaSet && visibleAreaSet.size > 0) {
            // If tile is in current visible area, it's viewable
            if (visibleAreaSet.has(tileKey)) {
                return 'viewable'; // Currently visible - very light fog so GM can see through it
            }
            // Also check revealedAreas for areas that were visible but token moved away
            if (revealedAreas[tileKey]) {
                return 'viewable'; // Previously revealed and still in revealed areas
            }
        }
        
        // Check if previously explored (works in both GM and player mode)
        if (exploredAreas[tileKey]) {
            return 'explored'; // Previously explored but currently fogged
        }
        
        return 'covered'; // Never explored - fully covered fog
    }, [visibleAreaSet, dynamicFogEnabled, viewingFromToken, isGMMode, gridSize, gridOffsetX, gridOffsetY]); // Added viewingFromToken and isGMMode to dependency

    // Convert grid coordinates to world coordinates
    const gridToWorld = useCallback((gridX, gridY) => {
        return {
            x: (gridX * gridSize) + gridOffsetX + (gridSize / 2),
            y: (gridY * gridSize) + gridOffsetY + (gridSize / 2)
        };
    }, [gridSize, gridOffsetX, gridOffsetY]);

    // Removed per-circle checking - we now use canvas compositing for smooth reveal
    // This is much faster and produces a smooth circular vision area instead of fragments

    // Render fog on canvas - optimized with viewport culling and caching
    const renderFog = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !fogOfWarEnabled || !isFogLayerVisible) return;

        // PERFORMANCE FIX: Allow throttled rendering during drag for real-time fog updates
        // The fog needs to follow the grid properly, so we render during drag but with throttling

        // PERFORMANCE FIX: Read zoom from store when rendering, not from closure
        const state = useGameStore.getState();
        const effectiveZoom = state.zoomLevel * state.playerZoom;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // PERFORMANCE: Only resize canvas if dimensions changed
        const needsResize = canvas.width !== rect.width || canvas.height !== rect.height;
        if (needsResize) {
            canvas.width = rect.width;
            canvas.height = rect.height;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Star flickering animation time (for performance, update every 500ms)
        const starTime = Math.floor(Date.now() / 500) % 1000;
        
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // CRITICAL FIX: Consistent fog appearance between GM and players
        // Get fog color based on state (solid midnight blue - no gradient)
        // Works in both GM and player mode to show explored areas
        const getFogColor = (fogState = 'covered') => {
            switch (fogState) {
                case 'viewable':
                    // Currently visible - very light fog so GM can see through it
                    // CRITICAL FIX: Same opacity for both GM and players
                    return 'rgba(25, 25, 50, 0.1)'; // Very light midnight blue
                case 'explored':
                    // Previously explored - slightly see-through dark blue
                    // CRITICAL FIX: Same opacity for both GM and players for consistency
                    return 'rgba(25, 25, 50, 0.5)'; // Slightly see-through dark blue (consistent)
                case 'covered':
                default:
                    // Never explored - solid dark blue
                    // CRITICAL FIX: Same opacity for both GM and players for consistency
                    return 'rgba(15, 15, 40, 0.95)'; // Solid dark blue (consistent)
            }
        };
        
        // Draw stars on fog (optimized for performance)
        const drawStars = (ctx, canvasWidth, canvasHeight) => {
            // Reduced star count for better performance
            const maxStars = 100; // Reduced from 200 to 100
            const starsToDraw = maxStars;
            
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            
            // Batch star rendering - only check fog state for a sample of stars
            const starsPerCheck = 5; // Only check fog state every 5 stars
            let checkCounter = 0;
            
            for (let i = 0; i < starsToDraw; i++) {
                // Use deterministic pseudo-random based on position
                const seed = (i * 7919) % 10000; // Prime number for better distribution
                const x = (seed * 137) % canvasWidth;
                const y = (seed * 271) % canvasHeight;
                
                // Flickering effect based on time and position (smooth animation)
                const flicker = Math.sin(starTime * 0.01 + seed) * 0.3 + 0.7;
                const starOpacity = Math.max(0.4, Math.min(1.0, flicker));
                
                // Only check fog state occasionally for performance
                // Most stars will be in fogged areas anyway
                checkCounter++;
                if (checkCounter >= starsPerCheck) {
                    checkCounter = 0;
                    const worldPos = screenToWorld(x, y);
                    const fogState = getFogState(worldPos.x, worldPos.y);
                    if (fogState !== 'covered' && fogState !== 'explored') {
                        continue; // Skip this star if not in fog
                    }
                }
                
                ctx.globalAlpha = starOpacity;
                ctx.fillRect(x, y, 1, 1); // 1x1 pixel stars
            }
            
            ctx.restore();
        };
        
        // Reuse a single gradient pattern for better performance
        // Match token vision fade - smooth inner to outer transition
        const createEraseGradient = (ctx, x, y, radius) => {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(0.65, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.7)');
            gradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            return gradient;
        };
        
        // Create fog gradient similar to erase gradient but using fog color
        // This gives paint fog the same smooth shadow-like gradient as the cover entire map
        // Made softer and more transparent to reduce thickness and texture
        const createFogGradient = (ctx, x, y, radius, fogColor) => {
            // Parse the fog color to extract RGB values
            // fogColor is in format 'rgba(r, g, b, a)'
            const rgbaMatch = fogColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (!rgbaMatch) {
                // Fallback to solid color if parsing fails
                return fogColor;
            }
            
            const r = parseInt(rgbaMatch[1]);
            const g = parseInt(rgbaMatch[2]);
            const b = parseInt(rgbaMatch[3]);
            const baseAlpha = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1.0;
            
            // Create radial gradient with softer, more gradual fade to reduce thickness
            // Start fading earlier and more gradually for smoother appearance
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            // Reduce center opacity slightly and fade more gradually
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.8})`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.6})`);
            gradient.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.3})`);
            gradient.addColorStop(0.9, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.1})`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            return gradient;
        };
        
        // PERFORMANCE FIX: Process fog and erase paths chronologically with limits
        // Combine and sort all paths by timestamp
        // PERFORMANCE FIX: Limit total paths processed to prevent performance issues
        // BUT: Always include full-coverage paths (cover entire map)
        const maxPathsToProcess = 50; // Reduced from 100 to 50 for better performance
        
        // Separate full-coverage paths from regular paths
        const fullCoverageFogPaths = visibleFogPaths.filter(path => path.points && path.points.length > 5000);
        const regularFogPaths = visibleFogPaths.filter(path => !path.points || path.points.length <= 5000);
        const fullCoverageErasePaths = visibleErasePaths.filter(path => path.points && path.points.length > 5000);
        const regularErasePaths = visibleErasePaths.filter(path => !path.points || path.points.length <= 5000);
        
        // Always include full-coverage paths, limit regular paths
        const allItems = [
            ...fullCoverageFogPaths.map(path => ({ type: 'fog', ...path })),
            ...regularFogPaths.slice(0, maxPathsToProcess).map(path => ({ type: 'fog', ...path })),
            ...fullCoverageErasePaths.map(path => ({ type: 'erase', ...path })),
            ...regularErasePaths.slice(0, maxPathsToProcess).map(path => ({ type: 'erase', ...path }))
        ].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        
        // PERFORMANCE FIX: Further limit regular paths if still too many (but keep full-coverage)
        const fullCoverageCount = fullCoverageFogPaths.length + fullCoverageErasePaths.length;
        const regularPathsLimit = Math.max(50, maxPathsToProcess - fullCoverageCount);
        
        if (allItems.length > maxPathsToProcess + fullCoverageCount) {
            // Keep full-coverage paths and most recent regular paths
            const regularItems = allItems.filter(item => {
                const path = item.type === 'fog' ? 
                    (regularFogPaths.find(p => p.id === item.id) || fullCoverageFogPaths.find(p => p.id === item.id)) :
                    (regularErasePaths.find(p => p.id === item.id) || fullCoverageErasePaths.find(p => p.id === item.id));
                return path && path.points && path.points.length <= 5000;
            });
            
            const fullCoverageItems = allItems.filter(item => {
                const path = item.type === 'fog' ? 
                    fullCoverageFogPaths.find(p => p.id === item.id) :
                    fullCoverageErasePaths.find(p => p.id === item.id);
                return path && path.points && path.points.length > 5000;
            });
            
            // Sort regular items by timestamp (most recent first)
            regularItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            regularItems.splice(regularPathsLimit);
            
            // Combine: full-coverage first, then regular paths
            allItems.length = 0;
            allItems.push(...fullCoverageItems, ...regularItems);
            // Re-sort chronologically for rendering
            allItems.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        }
        
        // Process items chronologically: render fog, then apply erase, then render next fog, etc.
        allItems.forEach(item => {
            if (item.type === 'fog') {
                // Switch to fog painting mode
                ctx.globalCompositeOperation = 'source-over';
                const path = item;
                if (path.points.length === 0) return;
            
            // PERFORMANCE FIX: Detect full-coverage paths (cover entire map)
            // These should be rendered as full-screen fills, not point-by-point
            const isFullCoveragePath = path.points && path.points.length > 5000; // Very large paths are likely full coverage
            
            if (isFullCoveragePath) {
                // Render as full-screen fill for performance
                // Get fog color for covered state
                const fogColor = getFogColor('covered');
                ctx.fillStyle = fogColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                return; // Skip point-by-point rendering
            }
            
            // During drag, use simple bounds check before rendering
            // Using ref to check drag state doesn't trigger re-renders
            if (isDraggingCameraRef.current && path.points.length > 0) {
                // Quick viewport cull check - only check first and last points for performance
                const firstPoint = path.points[0];
                const lastPoint = path.points[path.points.length - 1];
                const maxRadius = Math.max(firstPoint.brushRadius || 0, lastPoint.brushRadius || 0);
                
                // Check if path bounding box is outside viewport (with padding)
                const padding = maxRadius * effectiveZoom;
                const firstScreen = worldToScreen(firstPoint.worldX, firstPoint.worldY);
                const lastScreen = worldToScreen(lastPoint.worldX, lastPoint.worldY);
                
                // Skip if both endpoints are clearly outside viewport
                if ((firstScreen.x + padding < 0 && lastScreen.x + padding < 0) ||
                    (firstScreen.x - padding > canvas.width && lastScreen.x - padding > canvas.width) ||
                    (firstScreen.y + padding < 0 && lastScreen.y + padding < 0) ||
                    (firstScreen.y - padding > canvas.height && lastScreen.y - padding > canvas.height)) {
                    return; // Skip this path
                }
            }
            
            // PERFORMANCE FIX: Aggressive viewport culling for all paths
            // For large paths, only render points visible in viewport
            const isLargePath = path.points.length > 200; // Lowered threshold for better performance
            let pointsToRender = path.points;
            
            // PERFORMANCE FIX: Always do viewport culling for paths with many points
            if (isLargePath || path.points.length > 100) {
                // Calculate viewport bounds in screen space with padding
                const viewportPadding = 200; // Reduced padding for better performance
                const minScreenX = -viewportPadding;
                const maxScreenX = canvas.width + viewportPadding;
                const minScreenY = -viewportPadding;
                const maxScreenY = canvas.height + viewportPadding;
                
                // PERFORMANCE FIX: Use early exit for very large paths
                if (path.points.length > 2000) {
                    // For extremely large paths, sample points instead of checking all
                    const sampleRate = Math.max(1, Math.floor(path.points.length / 500)); // Sample ~500 points max
                    const sampledPoints = [];
                    for (let i = 0; i < path.points.length; i += sampleRate) {
                        sampledPoints.push(path.points[i]);
                    }
                    // Always include first and last
                    if (path.points.length > 0) {
                        sampledPoints.push(path.points[0]);
                        sampledPoints.push(path.points[path.points.length - 1]);
                    }
                    pointsToRender = sampledPoints;
                }
                
                // Filter points to only those visible in viewport (with padding for brush radius)
                pointsToRender = pointsToRender.filter(point => {
                    const screenPos = worldToScreen(point.worldX, point.worldY);
                    const brushRadius = (point.brushRadius || 0) * effectiveZoom;
                    const padding = brushRadius;
                    
                    return screenPos.x + padding >= minScreenX &&
                           screenPos.x - padding <= maxScreenX &&
                           screenPos.y + padding >= minScreenY &&
                           screenPos.y - padding <= maxScreenY;
                });
                
                // PERFORMANCE FIX: If no points visible, skip this path entirely
                if (pointsToRender.length === 0) {
                    return;
                }
                
                // PERFORMANCE FIX: Limit maximum points to render per path
                const maxPointsPerPath = 1000; // Cap at 1000 points per path
                if (pointsToRender.length > maxPointsPerPath) {
                    // Sample evenly spaced points
                    const step = Math.floor(pointsToRender.length / maxPointsPerPath);
                    const sampled = [];
                    for (let i = 0; i < pointsToRender.length; i += step) {
                        sampled.push(pointsToRender[i]);
                    }
                    // Always include first and last
                    if (pointsToRender.length > 0) {
                        sampled.push(pointsToRender[0]);
                        sampled.push(pointsToRender[pointsToRender.length - 1]);
                    }
                    pointsToRender = sampled;
                }
            }
            
            // Render fog with gradient edges for smooth appearance
            if (pointsToRender.length === 1) {
                const point = pointsToRender[0];
                const screenPos = worldToScreen(point.worldX, point.worldY);
                const brushRadius = point.brushRadius * effectiveZoom;
                
                // Canvas-based culling for single point
                // Using ref to check drag state doesn't trigger re-renders
                if (isDraggingCameraRef.current) {
                    const padding = brushRadius;
                    if (screenPos.x + padding < 0 || screenPos.x - padding > canvas.width ||
                        screenPos.y + padding < 0 || screenPos.y - padding > canvas.height) {
                        return; // Skip if outside viewport
                    }
                }
                
                // Determine fog state for this point (works in both GM and player mode)
                const fogState = getFogState(point.worldX, point.worldY);
                
                // Render fog with gradient edges for smooth shadow-like appearance
                // Use the same gradient structure as the cover entire map shadow
                const fogColor = getFogColor(fogState);
                const fogGradient = createFogGradient(ctx, screenPos.x, screenPos.y, brushRadius, fogColor);
                ctx.fillStyle = fogGradient;
                ctx.beginPath();
                ctx.arc(screenPos.x, screenPos.y, brushRadius, 0, Math.PI * 2);
                ctx.fill();
                return;
            }
            
            // Draw continuous strokes with gradient edges between visible points
            // Use multiple overlapping circles for smooth gradient transitions
            for (let i = 0; i < pointsToRender.length - 1; i++) {
                const point = pointsToRender[i];
                const nextPoint = pointsToRender[i + 1];
                const screenPos = worldToScreen(point.worldX, point.worldY);
                const nextScreenPos = worldToScreen(nextPoint.worldX, nextPoint.worldY);
                const brushRadius = point.brushRadius * effectiveZoom;
                const nextBrushRadius = nextPoint.brushRadius * effectiveZoom;
                
                // Calculate distance between points
                const dx = nextScreenPos.x - screenPos.x;
                const dy = nextScreenPos.y - screenPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    // Draw overlapping circles along the path for smooth gradient
                    // Reduced overlap to prevent thick texture - use larger step size
                    // Step size of 0.5-0.6 of radius gives smoother, less textured appearance
                    const stepSize = Math.min(brushRadius * 0.6, nextBrushRadius * 0.6);
                    const maxSteps = isGMMode ? Infinity : 50; // Limit steps in player mode for performance
                    const steps = Math.max(2, Math.min(maxSteps, Math.ceil(distance / stepSize)));
                    
                    // Cache fog states to reduce expensive calculations
                    // Only check fog state every few steps for performance
                    const fogStateCheckInterval = Math.max(1, Math.floor(steps / 5)); // Check every 5th step or less
                    let cachedFogState = null;
                    
                    for (let step = 0; step <= steps; step++) {
                        const t = step / steps;
                        const x = screenPos.x + dx * t;
                        const y = screenPos.y + dy * t;
                        const currentRadius = brushRadius + (nextBrushRadius - brushRadius) * t;
                        
                        // Only check fog state periodically to improve performance
                        if (step % fogStateCheckInterval === 0 || cachedFogState === null) {
                            const worldX = point.worldX + (nextPoint.worldX - point.worldX) * t;
                            const worldY = point.worldY + (nextPoint.worldY - point.worldY) * t;
                            cachedFogState = getFogState(worldX, worldY);
                        }
                        
                        // Render fog with gradient edges for smooth shadow-like appearance
                        // Use the same gradient structure as the cover entire map shadow
                        const fogColor = getFogColor(cachedFogState);
                        const fogGradient = createFogGradient(ctx, x, y, currentRadius, fogColor);
                        ctx.fillStyle = fogGradient;
                        ctx.beginPath();
                        ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else {
                    // Same position - just draw one circle
                    const fogState = getFogState(point.worldX, point.worldY);
                    
                    // Render fog with gradient edges for smooth shadow-like appearance
                    // Use the same gradient structure as the cover entire map shadow
                    const fogColor = getFogColor(fogState);
                    const fogGradient = createFogGradient(ctx, screenPos.x, screenPos.y, brushRadius, fogColor);
                    ctx.fillStyle = fogGradient;
                    ctx.beginPath();
                    ctx.arc(screenPos.x, screenPos.y, brushRadius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            } else if (item.type === 'erase') {
                // Switch to erase mode
                ctx.globalCompositeOperation = 'destination-out';
                
                const path = item;
                if (path.points.length === 0) return;
            
            // During drag, use simple bounds check before rendering
            // Using ref to check drag state doesn't trigger re-renders
            if (isDraggingCameraRef.current && path.points.length > 0) {
                // Quick viewport cull check - only check first and last points
                const firstPoint = path.points[0];
                const lastPoint = path.points[path.points.length - 1];
                const maxRadius = Math.max(firstPoint.brushRadius || 0, lastPoint.brushRadius || 0);
                
                const padding = maxRadius * effectiveZoom;
                const firstScreen = worldToScreen(firstPoint.worldX, firstPoint.worldY);
                const lastScreen = worldToScreen(lastPoint.worldX, lastPoint.worldY);
                
                // Skip if both endpoints are clearly outside viewport
                if ((firstScreen.x + padding < 0 && lastScreen.x + padding < 0) ||
                    (firstScreen.x - padding > canvas.width && lastScreen.x - padding > canvas.width) ||
                    (firstScreen.y + padding < 0 && lastScreen.y + padding < 0) ||
                    (firstScreen.y - padding > canvas.height && lastScreen.y - padding > canvas.height)) {
                    return; // Skip this path
                }
            }
            
                // PERFORMANCE FIX: Aggressive viewport culling for erase paths
                const isLargeErasePath = path.points.length > 200; // Lowered threshold
                let erasePointsToRender = path.points;
                
                // PERFORMANCE FIX: Always do viewport culling for paths with many points
                if (isLargeErasePath || path.points.length > 100) {
                    // Calculate viewport bounds in screen space with padding
                    const viewportPadding = 200; // Reduced padding for better performance
                    const minScreenX = -viewportPadding;
                    const maxScreenX = canvas.width + viewportPadding;
                    const minScreenY = -viewportPadding;
                    const maxScreenY = canvas.height + viewportPadding;
                    
                    // PERFORMANCE FIX: Use early exit for very large paths
                    if (path.points.length > 2000) {
                        // For extremely large paths, sample points instead of checking all
                        const sampleRate = Math.max(1, Math.floor(path.points.length / 500)); // Sample ~500 points max
                        const sampledPoints = [];
                        for (let i = 0; i < path.points.length; i += sampleRate) {
                            sampledPoints.push(path.points[i]);
                        }
                        // Always include first and last
                        if (path.points.length > 0) {
                            sampledPoints.push(path.points[0]);
                            sampledPoints.push(path.points[path.points.length - 1]);
                        }
                        erasePointsToRender = sampledPoints;
                    }
                    
                    // Filter points to only those visible in viewport (with padding for brush radius)
                    erasePointsToRender = erasePointsToRender.filter(point => {
                        const screenPos = worldToScreen(point.worldX, point.worldY);
                        const brushRadius = (point.brushRadius || 0) * effectiveZoom;
                        const padding = brushRadius;
                        
                        return screenPos.x + padding >= minScreenX &&
                               screenPos.x - padding <= maxScreenX &&
                               screenPos.y + padding >= minScreenY &&
                               screenPos.y - padding <= maxScreenY;
                    });
                    
                    // PERFORMANCE FIX: If no points visible, skip this path entirely
                    if (erasePointsToRender.length === 0) {
                        return;
                    }
                    
                    // PERFORMANCE FIX: Limit maximum points to render per path
                    const maxPointsPerPath = 1000; // Cap at 1000 points per path
                    if (erasePointsToRender.length > maxPointsPerPath) {
                        // Sample evenly spaced points
                        const step = Math.floor(erasePointsToRender.length / maxPointsPerPath);
                        const sampled = [];
                        for (let i = 0; i < erasePointsToRender.length; i += step) {
                            sampled.push(erasePointsToRender[i]);
                        }
                        // Always include first and last
                        if (erasePointsToRender.length > 0) {
                            sampled.push(erasePointsToRender[0]);
                            sampled.push(erasePointsToRender[erasePointsToRender.length - 1]);
                        }
                        erasePointsToRender = sampled;
                    }
                }
                
                // Render erase with gradient edges for smooth appearance
                if (erasePointsToRender.length === 1) {
                    const point = erasePointsToRender[0];
                    const screenPos = worldToScreen(point.worldX, point.worldY);
                    const brushRadius = (point.brushRadius || 0) * effectiveZoom;
                    
                    // Validate all values are finite before creating gradient
                    if (!Number.isFinite(screenPos.x) || !Number.isFinite(screenPos.y) || 
                        !Number.isFinite(brushRadius) || brushRadius <= 0) {
                        return; // Skip if any value is invalid
                    }
                    
                    // Canvas-based culling for erase points
                    // Using ref to check drag state doesn't trigger re-renders
                    if (isDraggingCameraRef.current) {
                        const padding = brushRadius;
                        if (screenPos.x + padding < 0 || screenPos.x - padding > canvas.width ||
                            screenPos.y + padding < 0 || screenPos.y - padding > canvas.height) {
                            return; // Skip if outside viewport
                        }
                    }
                    
                    // Use gradient for smooth edges
                    const gradient = createEraseGradient(ctx, screenPos.x, screenPos.y, brushRadius);
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(screenPos.x, screenPos.y, brushRadius, 0, Math.PI * 2);
                    ctx.fill();
                } else if (erasePointsToRender.length > 1) {
                    // Draw continuous erase strokes with gradient edges between points
                    // Use overlapping circles for smooth gradient transitions
                    for (let i = 0; i < erasePointsToRender.length - 1; i++) {
                        const point = erasePointsToRender[i];
                        const nextPoint = erasePointsToRender[i + 1];
                        const screenPos = worldToScreen(point.worldX, point.worldY);
                        const nextScreenPos = worldToScreen(nextPoint.worldX, nextPoint.worldY);
                        const brushRadius = (point.brushRadius || 0) * effectiveZoom;
                        const nextBrushRadius = (nextPoint.brushRadius || 0) * effectiveZoom;
                        
                        // Validate values
                        if (!Number.isFinite(screenPos.x) || !Number.isFinite(screenPos.y) ||
                            !Number.isFinite(nextScreenPos.x) || !Number.isFinite(nextScreenPos.y) ||
                            !Number.isFinite(brushRadius) || !Number.isFinite(nextBrushRadius) ||
                            brushRadius <= 0 || nextBrushRadius <= 0) {
                            continue;
                        }
                        
                        // Calculate distance between points
                        const dx = nextScreenPos.x - screenPos.x;
                        const dy = nextScreenPos.y - screenPos.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance > 0) {
                            // Draw overlapping circles along the path for smooth gradient
                            const stepSize = Math.min(brushRadius * 0.3, nextBrushRadius * 0.3); // Smaller steps for smoother gradient
                            const steps = Math.max(2, Math.ceil(distance / stepSize));
                            
                            for (let step = 0; step <= steps; step++) {
                                const t = step / steps;
                                const x = screenPos.x + dx * t;
                                const y = screenPos.y + dy * t;
                                const currentRadius = brushRadius + (nextBrushRadius - brushRadius) * t;
                                
                                if (currentRadius > 0) {
                                    // Use gradient for smooth edges
                                    const strokeGradient = createEraseGradient(ctx, x, y, currentRadius);
                                    ctx.fillStyle = strokeGradient;
                                    ctx.beginPath();
                                    ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }
                        } else {
                            // Same position - just draw one circle
                            const gradient = createEraseGradient(ctx, screenPos.x, screenPos.y, brushRadius);
                            ctx.fillStyle = gradient;
                            ctx.beginPath();
                            ctx.arc(screenPos.x, screenPos.y, brushRadius, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }
        });
        
        // Restore composite operation after processing all items
        ctx.globalCompositeOperation = 'source-over';
        
        ctx.restore();

        // Create and cache visibility mask (shared between path-based and legacy fog)
        // In GM mode, create combined mask from all tokens; in player mode, use viewing token
        let visibilityMask = null;
        
        // In GM mode, create combined mask from all tokens' vision polygons
        // BUT: If viewing from a token, only show that token's vision (not all tokens' radii)
        // Update mask during drag to keep fog position synchronized
        if (isGMMode && !viewingFromToken && allTokensVisibilityPolygons.length > 0) {
            // Create combined visibility mask from all tokens
            visibilityMask = document.createElement('canvas');
            visibilityMask.width = canvas.width;
            visibilityMask.height = canvas.height;
            const maskCtx = visibilityMask.getContext('2d');
            
            // Start with transparent (no fog erased)
            maskCtx.clearRect(0, 0, visibilityMask.width, visibilityMask.height);
            
            // For each token, add its vision area to the mask (white = erase fog)
            allTokensVisibilityPolygons.forEach(({ token, polygon, visionRange }) => {
                if (!polygon || polygon.length === 0) return;
                
                const tokenPosition = token.position;
                const tokenScreenPos = worldToScreen(tokenPosition.x, tokenPosition.y);
                const visionRangeInPixels = visionRange * gridSize * effectiveZoom;
                
                // Validate values
                if (!Number.isFinite(tokenScreenPos.x) || !Number.isFinite(tokenScreenPos.y) || 
                    !Number.isFinite(visionRangeInPixels) || visionRangeInPixels <= 0) {
                    return;
                }
                
                // Use source-over to combine multiple vision areas (white areas will erase fog)
                maskCtx.globalCompositeOperation = 'source-over';
                
                // Draw polygon with gradient fade
                maskCtx.beginPath();
                const firstPoint = worldToScreen(polygon[0].x, polygon[0].y);
                maskCtx.moveTo(firstPoint.x, firstPoint.y);
                
                for (let i = 1; i < polygon.length; i++) {
                    const point = worldToScreen(polygon[i].x, polygon[i].y);
                    maskCtx.lineTo(point.x, point.y);
                }
                
                maskCtx.closePath();
                
                // Create gradient for smooth fade at edges
                const gradient = maskCtx.createRadialGradient(
                    tokenScreenPos.x, tokenScreenPos.y, 0,
                    tokenScreenPos.x, tokenScreenPos.y, visionRangeInPixels
                );
                
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.65, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.7)');
                gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                // Clip to polygon and fill with gradient
                maskCtx.save();
                maskCtx.clip();
                maskCtx.fillStyle = gradient;
                maskCtx.fillRect(0, 0, visibilityMask.width, visibilityMask.height);
                maskCtx.restore();
            });
            
            // Apply combined visibility mask to path-based fog (white areas erase fog)
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = 1;
            ctx.drawImage(visibilityMask, 0, 0);
        }
        // In player mode or GM mode viewing from token, use single token's polygon
        // PERFORMANCE: Only create mask if visibility polygon is available and not too large
        else if ((!isGMMode || viewingFromToken) && currentViewingToken && visibleArea && visibilityPolygon && visibilityPolygon.length > 0) {
            // PERFORMANCE: Skip mask creation if polygon is too large (expensive operation)
            // Limit polygon size for performance in player view
            if (visibilityPolygon.length > 200) {
                // Skip mask creation for very large polygons - use simpler rendering
                visibilityMask = null;
            } else {
                const tokenPosition = currentViewingToken.position;
                const tokenScreenPos = worldToScreen(tokenPosition.x, tokenPosition.y);
                
                let visionRange = 6;
                const tokenId = currentViewingToken.type === 'creature'
                    ? (currentViewingToken.creatureId || currentViewingToken.id)
                    : (currentViewingToken.characterId || currentViewingToken.id || currentViewingToken.playerId);
                    
                if (tokenVisionRanges[tokenId]) {
                    visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
                }
                
                const visionRangeInPixels = visionRange * gridSize * effectiveZoom;
                
                // Validate all values are finite before creating gradient
                if (!Number.isFinite(tokenScreenPos.x) || !Number.isFinite(tokenScreenPos.y) || 
                    !Number.isFinite(visionRangeInPixels) || visionRangeInPixels <= 0) {
                    // Skip visibility mask creation if values are invalid
                    visibilityMask = null;
                } else {
                    // Create gradient mask for visibility (reusable for both render passes)
                    visibilityMask = document.createElement('canvas');
                    visibilityMask.width = canvas.width;
                    visibilityMask.height = canvas.height;
                    const maskCtx = visibilityMask.getContext('2d');
                    
                    // CRITICAL FIX: Fill the entire polygon with white (fully erase fog)
                    // Fill the whole polygon to ensure all visible areas are revealed as the token moves
                    maskCtx.beginPath();
                    const firstPoint = worldToScreen(visibilityPolygon[0].x, visibilityPolygon[0].y);
                    maskCtx.moveTo(firstPoint.x, firstPoint.y);
                    
                    for (let i = 1; i < visibilityPolygon.length; i++) {
                        const point = worldToScreen(visibilityPolygon[i].x, visibilityPolygon[i].y);
                        maskCtx.lineTo(point.x, point.y);
                    }
                    
                    maskCtx.closePath();
                    
                    // Use gradient fill to create soft-edged visibility (the one that moves with the token)
                    // Clip to polygon to respect walls and line of sight, but use gradient for soft edges
                    maskCtx.save();
                    maskCtx.clip(); // Clip to polygon for gradient
                    const gradient = maskCtx.createRadialGradient(
                        tokenScreenPos.x, tokenScreenPos.y, 0,
                        tokenScreenPos.x, tokenScreenPos.y, visionRangeInPixels
                    );

                    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 1)'); // Keep full opacity longer
                    gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.8)');
                    gradient.addColorStop(0.95, 'rgba(255, 255, 255, 0.4)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                    maskCtx.fillStyle = gradient;
                    maskCtx.fillRect(0, 0, visibilityMask.width, visibilityMask.height);
                    maskCtx.restore();
                    
                    // Apply visibility mask to path-based fog
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.globalAlpha = 1;
                    ctx.drawImage(visibilityMask, 0, 0);
                }
            }
        }

        ctx.restore();

        // Render visible legacy fog tiles (already filtered by viewport)
        ctx.globalCompositeOperation = 'source-over';
        
        visibleFogTiles.forEach(({ worldX, worldY }) => {
            const screenPos = worldToScreen(worldX, worldY);
            const tileSize = gridSize * effectiveZoom;
            
            // Determine fog state for this tile (works in both GM and player mode)
            const fogState = getFogState(worldX, worldY);
            
            // CRITICAL FIX: Consistent fog appearance between GM and players
            // Render fog with different opacity based on state
            let fillColor;
            switch (fogState) {
                case 'viewable':
                    // Currently visible - very light fog so GM can see through it
                    // CRITICAL FIX: Same opacity for both GM and players
                    fillColor = 'rgba(25, 25, 50, 0.1)'; // Very light midnight blue (consistent)
                    break;
                case 'explored':
                    // Previously explored - slightly see-through dark blue
                    // CRITICAL FIX: Same opacity for both GM and players for consistency
                    fillColor = 'rgba(25, 25, 50, 0.5)'; // Slightly see-through dark blue (consistent)
                    break;
                case 'covered':
                default:
                    // Never explored - solid dark blue
                    // CRITICAL FIX: Same opacity for both GM and players for consistency
                    fillColor = 'rgba(15, 15, 40, 0.95)'; // Solid dark blue (consistent)
                    break;
            }
            ctx.fillStyle = fillColor;
            
            ctx.fillRect(
                screenPos.x - tileSize / 2,
                screenPos.y - tileSize / 2,
                tileSize,
                tileSize
            );
        });
        
        // Apply cached visibility mask to legacy fog (reuse if available)
        if (visibilityMask) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = 1;
            ctx.drawImage(visibilityMask, 0, 0);
        }
        
        // Draw stars on fog (player mode only, optimized for performance)
        // Only draw stars if not dragging camera for better performance
        // Using ref to check drag state doesn't trigger re-renders
        if (!isGMMode && !isDraggingCameraRef.current) {
            drawStars(ctx, canvas.width, canvas.height);
        }
        }, [visibleFogPaths, visibleErasePaths, visibleFogTiles, fogOfWarEnabled, isFogLayerVisible, gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, isGMMode, worldToScreen, currentViewingToken, visibleArea, visibilityPolygon, allTokensVisibilityPolygons, viewingFromToken, tokenVisionRanges, getFogState, visibleAreaSet, screenToWorld]); // PERFORMANCE FIX: Removed effectiveZoom, isDraggingCamera, revealedAreas, exploredAreas
    // NOTE: Added cameraX, cameraY back for real-time fog updates during drag with throttling
    
    // Throttle fog rendering with RAF for smooth performance during camera movement
    const throttledRenderFogRef = useRef(null);
    const debounceTimeoutRef = useRef(null);
    
    // Update throttled function when renderFog changes
    useEffect(() => {
        throttledRenderFogRef.current = rafThrottle(renderFog);
    }, [renderFog]);
    
    // Track if we're actively painting fog (for immediate rendering)
    const isPaintingFogRef = useRef(false);
    const paintingTimeoutRef = useRef(null);
    
    // PERFORMANCE OPTIMIZATION: Immediate rendering during active painting, debounced otherwise
    const debouncedRenderFog = useCallback(() => {
        // Clear existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        
        // If actively painting, render immediately for smooth experience
        if (isPaintingFogRef.current) {
            if (throttledRenderFogRef.current) {
                throttledRenderFogRef.current();
            }
            // Reset painting flag after a short delay
            if (paintingTimeoutRef.current) {
                clearTimeout(paintingTimeoutRef.current);
            }
            paintingTimeoutRef.current = setTimeout(() => {
                isPaintingFogRef.current = false;
            }, 100);
        } else {
            // Debounce fog rendering updates when not actively painting (wait 30ms for responsiveness)
            // During drag, render more frequently for smooth updates
            // Using ref to check drag state doesn't trigger re-renders
            const debounceTime = isDraggingCameraRef.current ? 16 : 30; // 60fps during drag, 33fps otherwise
            debounceTimeoutRef.current = setTimeout(() => {
                if (throttledRenderFogRef.current) {
                    throttledRenderFogRef.current();
                }
            }, debounceTime);
        }
    }, []); // PERFORMANCE FIX: Removed isDraggingCamera - now uses ref, no dependencies needed
    
    // Star flickering animation timer (update every 1000ms for better performance)
    useEffect(() => {
        if (isGMMode || !fogOfWarEnabled) return; // No stars in GM mode or when fog is disabled
        
        const interval = setInterval(() => {
            // Trigger re-render for star flickering (skip during drag for performance)
            // Using ref to check drag state doesn't trigger re-renders
            if (throttledRenderFogRef.current && !isDraggingCameraRef.current) {
                throttledRenderFogRef.current();
            }
        }, 1000); // Update every 1000ms (reduced from 500ms) for better performance
        
        return () => clearInterval(interval);
    }, [isGMMode, fogOfWarEnabled]); // PERFORMANCE FIX: Removed isDraggingCamera - now uses ref

    // PERFORMANCE FIX: Trigger render when dependencies change with better throttling
    const lastRenderTimeRef = useRef(0);
    const pendingRenderRef = useRef(false);
    
    // REMOVED: Duplicate isDraggingCameraRef - already defined at top of component
    // The ref is now populated by polling window._isDraggingCamera flag
    
    // Continuous render loop during drag for smooth fog updates
    const fogRenderRafRef = useRef(null);
    const startDragRenderLoop = useCallback(() => {
        if (fogRenderRafRef.current !== null) return; // Already running
        
        const renderLoop = () => {
            if (throttledRenderFogRef.current) {
                throttledRenderFogRef.current();
            }
            // Check current drag state from ref
            if (isDraggingCameraRef.current) {
                fogRenderRafRef.current = requestAnimationFrame(renderLoop);
            } else {
                fogRenderRafRef.current = null;
            }
        };
        
        fogRenderRafRef.current = requestAnimationFrame(renderLoop);
    }, []);
    
    // Start/stop render loop based on drag state
    // REMOVED: This useEffect tracked isDraggingCamera but it's now a ref
    // The polling interval already keeps the ref updated
    // Fog rendering is handled by the main useEffect below
    
    // PERFORMANCE FIX: Allow throttled rendering during drag for real-time fog updates
    // The fog needs to follow the grid properly, so we render during drag but throttle aggressively
    
    useEffect(() => {
        // PERFORMANCE FIX: During camera drag, allow throttled rendering for real-time fog updates
        // The fog needs to follow the grid in real time, but we throttle to maintain performance
        
        // PERFORMANCE FIX: Throttle renders based on drag state
        // During drag: max 30fps (33ms) for real-time fog updates with performance
        // During static: max 60fps (16ms) for responsiveness
        const targetFrameTime = isDraggingCameraRef.current ? 33 : 16;
        const now = performance.now();
        const timeSinceLastRender = now - lastRenderTimeRef.current;

        if (timeSinceLastRender < targetFrameTime) {
            // Too soon since last render, schedule for next frame
            if (!pendingRenderRef.current) {
                pendingRenderRef.current = true;
                requestAnimationFrame(() => {
                    if (pendingRenderRef.current) {
                        pendingRenderRef.current = false;
                        lastRenderTimeRef.current = performance.now();
                        
                        // For fog path changes (drawing/erasing), use optimized rendering
                        const hasLargePath = fogOfWarPaths.some(path => path.points && path.points.length > 1000);
                        const hasActiveDrawingPath = fogOfWarPaths.some(path => path.isDrawing) || fogErasePaths.some(path => path.isDrawing);
                        
                        if (fogOfWarPaths.length > 0 || fogErasePaths.length > 0) {
                            if (hasLargePath || hasActiveDrawingPath) {
                                // Large paths or actively drawing - render immediately
                                if (hasActiveDrawingPath) {
                                    isPaintingFogRef.current = true;
                                }
                                if (throttledRenderFogRef.current) {
                                    throttledRenderFogRef.current();
                                }
                            } else {
                                // Not actively drawing - use debounced rendering
                                debouncedRenderFog();
                            }
                        } else {
                            // For other changes (camera, zoom, etc.), use throttled rendering
                            if (throttledRenderFogRef.current) {
                                throttledRenderFogRef.current();
                            }
                        }
                    }
                });
            }
            return;
        }
        
        // Enough time has passed, render immediately
        lastRenderTimeRef.current = now;
        pendingRenderRef.current = false;
        
        // For fog path changes (drawing/erasing), use optimized rendering
        const hasLargePath = fogOfWarPaths.some(path => path.points && path.points.length > 1000);
        const hasActiveDrawingPath = fogOfWarPaths.some(path => path.isDrawing) || fogErasePaths.some(path => path.isDrawing);
        
        if (fogOfWarPaths.length > 0 || fogErasePaths.length > 0) {
            if (hasLargePath || hasActiveDrawingPath) {
                // Large paths or actively drawing - render immediately
                if (hasActiveDrawingPath) {
                    isPaintingFogRef.current = true;
                }
                if (throttledRenderFogRef.current) {
                    throttledRenderFogRef.current();
                }
            } else {
                // Not actively drawing - use debounced rendering
                debouncedRenderFog();
            }
        } else {
            // For other changes (camera, zoom, etc.), use throttled rendering
            if (throttledRenderFogRef.current) {
                throttledRenderFogRef.current();
            }
        }
        }, [fogOfWarPaths, fogErasePaths, fogOfWarData, fogOfWarEnabled, isFogLayerVisible, gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, currentViewingToken, visibleArea, tokenVisionRanges, debouncedRenderFog]); // PERFORMANCE FIX: Removed effectiveZoom and isDraggingCamera - read from store
    
    // REMOVED: This useEffect tracked isDraggingCamera to trigger renders when drag stops
    // But now isDraggingCamera is a ref, so it doesn't trigger effects
    // Fog will be updated by the main render effect when dependencies change
    
    // Cleanup debounce timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            if (paintingTimeoutRef.current) {
                clearTimeout(paintingTimeoutRef.current);
            }
        };
    }, []);

    // Don't render if fog is disabled or layer is hidden
    if (!fogOfWarEnabled || !isFogLayerVisible) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 20000, // Above all other elements (tiles, tokens, items, walls) - fog should always be on top
                mixBlendMode: isGMMode ? 'normal' : 'normal' // Use normal blend mode so grid is always visible
            }}
        />
    );
};

// NUCLEAR PERFORMANCE FIX: Use React.memo with AGGRESSIVE prop comparison
// StaticFogOverlay receives NO props, so we can block ALL parent-forced re-renders
// Zustand subscriptions will still trigger re-renders when store values change (which is what we want)
// But parent (Grid) re-renders won't force unnecessary re-renders
export default React.memo(StaticFogOverlay, (prevProps, nextProps) => {
    // StaticFogOverlay has NO props, so prevProps and nextProps are always {}
    // Always block parent-forced re-renders (component has no props)
    // Zustand subscriptions will still trigger re-renders when store values actually change
    return true; // "Props are equal" - block parent-forced re-renders
});
