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

    const {
        gridSize,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom,
        isGMMode
    } = useGameStore();

    const {
        fogOfWarPaths,
        fogErasePaths,
        fogOfWarData, // Legacy support
        fogOfWarEnabled,
        drawingLayers,
        wallData,
        dynamicFogEnabled,
        respectLineOfSight,
        revealedAreas,
        tokenVisionRanges,
        viewingFromToken: storeViewingFromToken,
        setViewingFromToken,
        setVisibleArea,
        fovAngle,
        tokenFacingDirections,
        getTokenFacingDirection
    } = useLevelEditorStore();

    // Get tokens for vision calculation
    const { tokens: creatureTokens } = useCreatureStore();
    const { characterTokens } = useCharacterTokenStore();
    
    // Get currently viewed token (if viewing from token perspective)
    // Use store's explicitly set token as source of truth - don't auto-detect
    const viewingFromToken = storeViewingFromToken;
    
    // Track the current token with updated position when it moves (for vision calculation)
    const [currentViewingToken, setCurrentViewingToken] = React.useState(null);
    
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

    const effectiveZoom = zoomLevel * playerZoom;

    // Track if camera is being dragged for performance optimizations
    const [isDraggingCamera, setIsDraggingCamera] = React.useState(false);
    const dragStartRef = useRef(null);

    // Detect camera dragging state - optimize for drag operations
    useEffect(() => {
        let rafId = null;
        let lastCameraX = cameraX;
        let lastCameraY = cameraY;
        let dragTimeout = null;
        let currentIsDragging = false;

        const checkCameraMovement = () => {
            const currentCameraX = cameraX;
            const currentCameraY = cameraY;
            
            // Detect significant camera movement (likely dragging)
            const deltaX = Math.abs(currentCameraX - lastCameraX);
            const deltaY = Math.abs(currentCameraY - lastCameraY);
            const threshold = 0.1; // Small threshold to detect movement
            
            if (deltaX > threshold || deltaY > threshold) {
                if (!currentIsDragging) {
                    currentIsDragging = true;
                    setIsDraggingCamera(true);
                }
                lastCameraX = currentCameraX;
                lastCameraY = currentCameraY;
                
                // Clear existing timeout
                if (dragTimeout) {
                    clearTimeout(dragTimeout);
                }
                
                // Set timeout to detect when dragging stops
                dragTimeout = setTimeout(() => {
                    currentIsDragging = false;
                    setIsDraggingCamera(false);
                }, 150); // Wait 150ms after last movement to consider drag stopped
            }
            
            rafId = requestAnimationFrame(checkCameraMovement);
        };
        
        rafId = requestAnimationFrame(checkCameraMovement);
        
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (dragTimeout) clearTimeout(dragTimeout);
        };
    }, [cameraX, cameraY]);

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
    }, [cameraX, cameraY, effectiveZoom, window.innerWidth, window.innerHeight]);

    // Cached viewport bounds in world coordinates - only recalculate when viewport changes
    const viewportWorldBounds = useMemo(() => {
        // Use fast fallback calculation to avoid expensive gridSystem calls during drag
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        const padding = 200;
        
        // Convert screen bounds to world coordinates using direct calculation
        const minWorldX = ((viewportBounds.minX - screenCenterX) / effectiveZoom) + cameraX;
        const minWorldY = ((viewportBounds.minY - screenCenterY) / effectiveZoom) + cameraY;
        const maxWorldX = ((viewportBounds.maxX - screenCenterX) / effectiveZoom) + cameraX;
        const maxWorldY = ((viewportBounds.maxY - screenCenterY) / effectiveZoom) + cameraY;
        
        return { minX: minWorldX, minY: minWorldY, maxX: maxWorldX, maxY: maxWorldY };
    }, [viewportBounds, cameraX, cameraY, effectiveZoom]);

    // Convert world coordinates to screen coordinates - optimized
    const worldToScreen = useCallback((worldX, worldY) => {
        // Use direct calculation for better performance (faster than gridSystem calls)
        const screenX = (worldX - cameraX) * effectiveZoom + window.innerWidth / 2;
        const screenY = (worldY - cameraY) * effectiveZoom + window.innerHeight / 2;
        return { x: screenX, y: screenY };
    }, [cameraX, cameraY, effectiveZoom]);

    // Convert screen coordinates to world coordinates - optimized
    const screenToWorld = useCallback((screenX, screenY) => {
        // Use direct calculation for better performance
        const worldX = (screenX - window.innerWidth / 2) / effectiveZoom + cameraX;
        const worldY = (screenY - window.innerHeight / 2) / effectiveZoom + cameraY;
        return { x: worldX, y: worldY };
    }, [cameraX, cameraY, effectiveZoom]);

    // Optimized path visibility check - uses cached world bounds
    const isPathVisible = useCallback((path) => {
        if (!path.points || path.points.length === 0) return false;
        
        // Get bounding box of path points
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        for (const point of path.points) {
            const worldX = point.worldX;
            const worldY = point.worldY;
            const radius = point.brushRadius || 0;
            
            minX = Math.min(minX, worldX - radius);
            minY = Math.min(minY, worldY - radius);
            maxX = Math.max(maxX, worldX + radius);
            maxY = Math.max(maxY, worldY + radius);
        }
        
        // Use cached viewport world bounds for fast AABB intersection check
        return !(
            maxX < viewportWorldBounds.minX ||
            minX > viewportWorldBounds.maxX ||
            maxY < viewportWorldBounds.minY ||
            minY > viewportWorldBounds.maxY
        );
    }, [viewportWorldBounds]);

    // Memoize sorted fog paths with visibility culling
    // During drag, skip expensive filtering - render all paths but let canvas culling handle it
    const visibleFogPaths = useMemo(() => {
        const sorted = [...fogOfWarPaths].sort((a, b) => {
            const aTime = a.timestamp || 0;
            const bTime = b.timestamp || 0;
            return aTime - bTime;
        });
        
        // Skip visibility filtering during drag for better performance
        // The render function will still cull off-screen paths, but we avoid filtering large arrays
        if (isDraggingCamera && sorted.length > 100) {
            return sorted; // Return all paths during drag if many paths exist
        }
        
        // Normal filtering when not dragging
        return sorted.filter(path => isPathVisible(path));
    }, [fogOfWarPaths, isPathVisible, isDraggingCamera]);

    // Memoize sorted erase paths with visibility culling
    const visibleErasePaths = useMemo(() => {
        const sorted = [...fogErasePaths].sort((a, b) => {
            return (a.timestamp || 0) - (b.timestamp || 0);
        });
        
        // Skip visibility filtering during drag for better performance
        if (isDraggingCamera && sorted.length > 100) {
            return sorted;
        }
        
        return sorted.filter(path => isPathVisible(path));
    }, [fogErasePaths, isPathVisible, isDraggingCamera]);

    // Memoize visible legacy fog tiles with viewport culling
    const visibleFogTiles = useMemo(() => {
        // Use cached viewport world bounds for faster calculation
        const { minX, minY, maxX, maxY } = viewportWorldBounds;
        
        // During drag, limit tile processing for performance
        const tileKeys = Object.keys(fogOfWarData);
        if (isDraggingCamera && tileKeys.length > 1000) {
            // Skip filtering during drag if too many tiles - just render visible ones
            const visible = [];
            // Process only a sample or use simpler check
            for (const tileKey of tileKeys) {
                const [gridX, gridY] = tileKey.split(',').map(Number);
                const worldX = (gridX * gridSize) + gridOffsetX + (gridSize / 2);
                const worldY = (gridY * gridSize) + gridOffsetY + (gridSize / 2);
                
                // Quick bounds check
                if (worldX >= minX && worldX <= maxX && worldY >= minY && worldY <= maxY) {
                    visible.push({ tileKey, gridX, gridY, worldX, worldY });
                }
            }
            return visible;
        }
        
        const visible = [];
        tileKeys.forEach(tileKey => {
            const [gridX, gridY] = tileKey.split(',').map(Number);
            const worldX = (gridX * gridSize) + gridOffsetX + (gridSize / 2);
            const worldY = (gridY * gridSize) + gridOffsetY + (gridSize / 2);
            
            if (worldX >= minX && worldX <= maxX && worldY >= minY && worldY <= maxY) {
                visible.push({ tileKey, gridX, gridY, worldX, worldY });
            }
        });
        return visible;
    }, [fogOfWarData, viewportWorldBounds, gridSize, gridOffsetX, gridOffsetY, isDraggingCamera]);

    // Check if fog should be visible
    const fogLayer = drawingLayers.find(layer => layer.id === 'fog');
    const isFogLayerVisible = fogLayer ? fogLayer.visible : true;
    
    // Calculate visible area if viewing from token
    const visibleArea = React.useMemo(() => {
        // Always calculate vision if we have a viewing token
        // This allows showing what the token can see even in GM mode
        if (!currentViewingToken || !dynamicFogEnabled) {
            return null;
        }
        
        const tokenPosition = currentViewingToken.position;
        if (!tokenPosition || tokenPosition.x === undefined || tokenPosition.y === undefined) {
            return null;
        }
        
        // Convert world coordinates to grid coordinates
        // calculateVisibleTiles expects grid coordinates, not world coordinates
        const gridX = Math.floor((tokenPosition.x - gridOffsetX) / gridSize);
        const gridY = Math.floor((tokenPosition.y - gridOffsetY) / gridSize);
        
        // Get vision data for this token
        let visionRange = 6; // Default 30ft (6 tiles at 5ft per tile)
        let visionType = 'normal';
        
        // Check if token has vision data in store
        // Character tokens might have different IDs than creature tokens
        const tokenId = currentViewingToken.type === 'creature'
            ? (currentViewingToken.creatureId || currentViewingToken.id)
            : (currentViewingToken.characterId || currentViewingToken.id || currentViewingToken.playerId);
            
        if (tokenVisionRanges[tokenId]) {
            visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
            visionType = tokenVisionRanges[tokenId].type || visionType;
        }
        
        // Ensure vision range is valid (at least 1 tile)
        if (!visionRange || visionRange <= 0 || isNaN(visionRange)) {
            visionRange = 6; // Default fallback
        }
        
        // Get facing direction for this token (for directional FOV)
        // Subscribe to tokenFacingDirections to trigger recalculation when facing changes
        const facingAngle = tokenFacingDirections[tokenId] || null;
        
        // Calculate visible tiles from token position
        const visibleTiles = calculateVisibleTiles(
            gridX,
            gridY,
            visionRange,
            visionType,
            respectLineOfSight ? wallData : {},
            {}, // lightSources
            fovAngle,
            facingAngle
        );
        
        // Visible area calculated (logging removed for performance)
        return visibleTiles;
    }, [currentViewingToken, dynamicFogEnabled, gridSize, gridOffsetX, gridOffsetY, wallData, respectLineOfSight, tokenVisionRanges, fovAngle, tokenFacingDirections]);

    // Calculate visibility polygon for accurate token visibility (separate from tile-based visibleArea)
    const visibilityPolygon = React.useMemo(() => {
        if (!currentViewingToken || !dynamicFogEnabled || !currentViewingToken.position) {
            return null;
        }
        
        const tokenPosition = currentViewingToken.position;
        let visionRange = 6; // Default
        const tokenId = currentViewingToken.type === 'creature'
            ? (currentViewingToken.creatureId || currentViewingToken.id)
            : (currentViewingToken.characterId || currentViewingToken.id || currentViewingToken.playerId);
            
        if (tokenVisionRanges[tokenId]) {
            visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
        }
        
        // Get facing direction for this token (for directional FOV)
        // Subscribe to tokenFacingDirections to trigger recalculation when facing changes
        const facingAngle = tokenFacingDirections[tokenId] || null;
        
        // Calculate smooth visibility polygon using raycasting
        return calculateVisibilityPolygon(
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
    }, [currentViewingToken, dynamicFogEnabled, gridSize, gridOffsetX, gridOffsetY, wallData, respectLineOfSight, tokenVisionRanges, fovAngle, tokenFacingDirections]);

    // Update visible area in store - store both tile-based and polygon for compatibility
    useEffect(() => {
        // Store tile-based visibleArea for backwards compatibility
        setVisibleArea(visibleArea);
        
        // Also store the polygon for accurate point-in-polygon checks
        const levelEditorStore = useLevelEditorStore.getState();
        if (levelEditorStore.setVisibilityPolygon) {
            levelEditorStore.setVisibilityPolygon(visibilityPolygon);
        }
        
        // Visible area updated in store (logging removed for performance)
    }, [visibleArea, visibilityPolygon, setVisibleArea, currentViewingToken, tokenVisionRanges, gridSize, gridOffsetX, gridOffsetY]);

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

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const fogOpacity = isGMMode ? 0.65 : 0.75;
        const fogColor = isGMMode ? `rgba(120, 120, 120, ${fogOpacity})` : `rgba(100, 100, 100, ${fogOpacity})`;
        
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = fogColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = fogColor;

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
        
        // Process fog and erase paths chronologically to ensure correct order
        // Combine and sort all paths by timestamp
        const allItems = [
            ...visibleFogPaths.map(path => ({ type: 'fog', ...path })),
            ...visibleErasePaths.map(path => ({ type: 'erase', ...path }))
        ].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        
        // Process items chronologically: render fog, then apply erase, then render next fog, etc.
        allItems.forEach(item => {
            if (item.type === 'fog') {
                // Switch to fog painting mode
                ctx.globalCompositeOperation = 'source-over';
                const path = item;
                if (path.points.length === 0) return;
            
            // During drag, use simple bounds check before rendering
            if (isDraggingCamera && path.points.length > 0) {
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
            
            // For large paths (full map coverage), only render points visible in viewport
            const isLargePath = path.points.length > 500;
            let pointsToRender = path.points;
            
            if (isLargePath) {
                // Filter points to only those visible in viewport (with padding for brush radius)
                const viewportPadding = 300; // Extra padding for large brushes
                const minScreenX = -viewportPadding;
                const maxScreenX = canvas.width + viewportPadding;
                const minScreenY = -viewportPadding;
                const maxScreenY = canvas.height + viewportPadding;
                
                pointsToRender = path.points.filter(point => {
                    const screenPos = worldToScreen(point.worldX, point.worldY);
                    const brushRadius = (point.brushRadius || 0) * effectiveZoom;
                    const padding = brushRadius;
                    
                    return screenPos.x + padding >= minScreenX &&
                           screenPos.x - padding <= maxScreenX &&
                           screenPos.y + padding >= minScreenY &&
                           screenPos.y - padding <= maxScreenY;
                });
                
                // If no points visible, skip this path entirely
                if (pointsToRender.length === 0) {
                    return;
                }
            }
            
            if (pointsToRender.length === 1) {
                const point = pointsToRender[0];
                const screenPos = worldToScreen(point.worldX, point.worldY);
                const brushRadius = point.brushRadius * effectiveZoom;
                
                // Canvas-based culling for single point
                if (isDraggingCamera) {
                    const padding = brushRadius;
                    if (screenPos.x + padding < 0 || screenPos.x - padding > canvas.width ||
                        screenPos.y + padding < 0 || screenPos.y - padding > canvas.height) {
                        return; // Skip if outside viewport
                    }
                }
                
                ctx.beginPath();
                ctx.arc(screenPos.x, screenPos.y, brushRadius, 0, Math.PI * 2);
                ctx.fill();
                return;
            }
            
            // Draw continuous strokes between visible points only
            for (let i = 0; i < pointsToRender.length - 1; i++) {
                const point = pointsToRender[i];
                const nextPoint = pointsToRender[i + 1];
                const screenPos = worldToScreen(point.worldX, point.worldY);
                const nextScreenPos = worldToScreen(nextPoint.worldX, nextPoint.worldY);
                const brushRadius = point.brushRadius * effectiveZoom;
                const nextBrushRadius = nextPoint.brushRadius * effectiveZoom;
                
                ctx.lineWidth = Math.max(brushRadius, nextBrushRadius) * 2;
                ctx.beginPath();
                ctx.moveTo(screenPos.x, screenPos.y);
                ctx.lineTo(nextScreenPos.x, nextScreenPos.y);
                ctx.stroke();
            }
            } else if (item.type === 'erase') {
                // Switch to erase mode
                ctx.globalCompositeOperation = 'destination-out';
                
                const path = item;
                if (path.points.length === 0) return;
            
            // During drag, use simple bounds check before rendering
            if (isDraggingCamera && path.points.length > 0) {
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
            
                // For large erase paths, only render points visible in viewport
                const isLargeErasePath = path.points.length > 500;
                let erasePointsToRender = path.points;
                
                if (isLargeErasePath) {
                    // Filter points to only those visible in viewport (with padding for brush radius)
                    const viewportPadding = 300; // Extra padding for large brushes
                    const minScreenX = -viewportPadding;
                    const maxScreenX = canvas.width + viewportPadding;
                    const minScreenY = -viewportPadding;
                    const maxScreenY = canvas.height + viewportPadding;
                    
                    erasePointsToRender = path.points.filter(point => {
                        const screenPos = worldToScreen(point.worldX, point.worldY);
                        const brushRadius = (point.brushRadius || 0) * effectiveZoom;
                        const padding = brushRadius;
                        
                        return screenPos.x + padding >= minScreenX &&
                               screenPos.x - padding <= maxScreenX &&
                               screenPos.y + padding >= minScreenY &&
                               screenPos.y - padding <= maxScreenY;
                    });
                    
                    // If no points visible, skip this path entirely
                    if (erasePointsToRender.length === 0) {
                        return;
                    }
                }
                
                // Draw erase circles with canvas-based culling during drag
                erasePointsToRender.forEach(point => {
                    const screenPos = worldToScreen(point.worldX, point.worldY);
                    const brushRadius = (point.brushRadius || 0) * effectiveZoom;
                    
                    // Validate all values are finite before creating gradient
                    if (!Number.isFinite(screenPos.x) || !Number.isFinite(screenPos.y) || 
                        !Number.isFinite(brushRadius) || brushRadius <= 0) {
                        return; // Skip if any value is invalid
                    }
                    
                    // Canvas-based culling for erase points
                    if (isDraggingCamera) {
                        const padding = brushRadius;
                        if (screenPos.x + padding < 0 || screenPos.x - padding > canvas.width ||
                            screenPos.y + padding < 0 || screenPos.y - padding > canvas.height) {
                            return; // Skip if outside viewport
                        }
                    }
                    
                    const gradient = createEraseGradient(ctx, screenPos.x, screenPos.y, brushRadius);
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(screenPos.x, screenPos.y, brushRadius, 0, Math.PI * 2);
                    ctx.fill();
                });
                
                // Draw connecting strokes with fade (use filtered points for large paths)
                if (erasePointsToRender.length > 1) {
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
                        
                        // Draw smooth gradient strokes between points
                        const distance = Math.sqrt(
                            Math.pow(nextScreenPos.x - screenPos.x, 2) +
                            Math.pow(nextScreenPos.y - screenPos.y, 2)
                        );
                        
                        if (distance > 0) {
                            // Draw multiple circles along the stroke path for smooth fade
                            const steps = Math.max(3, Math.ceil(distance / Math.min(brushRadius, nextBrushRadius) * 0.5));
                            for (let t = 0; t <= 1; t += 1 / steps) {
                                const x = screenPos.x + (nextScreenPos.x - screenPos.x) * t;
                                const y = screenPos.y + (nextScreenPos.y - screenPos.y) * t;
                                const currentRadius = brushRadius + (nextBrushRadius - brushRadius) * t;
                                
                                if (currentRadius > 0) {
                                    const strokeGradient = createEraseGradient(ctx, x, y, currentRadius);
                                    ctx.fillStyle = strokeGradient;
                                    ctx.beginPath();
                                    ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }
                        }
                    }
                }
            }
        });
        
        // Restore composite operation after processing all items
        ctx.globalCompositeOperation = 'source-over';
        
        ctx.restore();

        // Create and cache visibility mask (shared between path-based and legacy fog)
        let visibilityMask = null;
        if (currentViewingToken && visibleArea && visibilityPolygon && visibilityPolygon.length > 0) {
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
                
                maskCtx.beginPath();
                const firstPoint = worldToScreen(visibilityPolygon[0].x, visibilityPolygon[0].y);
                maskCtx.moveTo(firstPoint.x, firstPoint.y);
                
                for (let i = 1; i < visibilityPolygon.length; i++) {
                    const point = worldToScreen(visibilityPolygon[i].x, visibilityPolygon[i].y);
                    maskCtx.lineTo(point.x, point.y);
                }
                
                maskCtx.closePath();
                maskCtx.clip();
                
                const gradient = maskCtx.createRadialGradient(
                    tokenScreenPos.x, tokenScreenPos.y, 0,
                    tokenScreenPos.x, tokenScreenPos.y, visionRangeInPixels
                );
                
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.65, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.7)');
                gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                maskCtx.fillStyle = gradient;
                maskCtx.fillRect(0, 0, visibilityMask.width, visibilityMask.height);
                
                // Apply visibility mask to path-based fog
                ctx.globalCompositeOperation = 'destination-out';
                ctx.globalAlpha = 1;
                ctx.drawImage(visibilityMask, 0, 0);
            }
        }

        ctx.restore();

        // Render visible legacy fog tiles (already filtered by viewport)
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = isGMMode ? 'rgba(120, 120, 120, 0.65)' : 'rgba(100, 100, 100, 0.75)';
        
        visibleFogTiles.forEach(({ worldX, worldY }) => {
            const screenPos = worldToScreen(worldX, worldY);
            const tileSize = gridSize * effectiveZoom;
            
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
        }, [visibleFogPaths, visibleErasePaths, visibleFogTiles, fogOfWarEnabled, isFogLayerVisible, effectiveZoom, gridSize, gridOffsetX, gridOffsetY, isGMMode, worldToScreen, currentViewingToken, visibleArea, visibilityPolygon, tokenVisionRanges, isDraggingCamera]);
    
    // Throttle fog rendering with RAF for smooth performance during camera movement
    const throttledRenderFogRef = useRef(null);
    
    // Update throttled function when renderFog changes
    useEffect(() => {
        throttledRenderFogRef.current = rafThrottle(renderFog);
    }, [renderFog]);
    
    // Trigger render when dependencies change
    useEffect(() => {
        if (throttledRenderFogRef.current) {
            throttledRenderFogRef.current();
        }
    }, [fogOfWarPaths, fogErasePaths, fogOfWarData, fogOfWarEnabled, isFogLayerVisible, effectiveZoom, cameraX, cameraY, gridSize, gridOffsetX, gridOffsetY, currentViewingToken, visibleArea, tokenVisionRanges]);

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
                zIndex: 0 // Below grid lines (grid is z-index 1), above background (-1 or 0)
            }}
        />
    );
};

export default StaticFogOverlay;
