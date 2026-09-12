import React, { useRef, useEffect, useCallback } from 'react';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';

/**
 * High-performance canvas-based grid renderer
 * Replaces DOM-based grid tiles with canvas rendering for massive performance improvements
 */
const CanvasGridRenderer = ({
    viewportSize,
    onGridInteraction,
    showGrid = true,
    gridLineColor = 'rgba(77, 155, 230, 0.3)', // Increased opacity for better visibility
    gridLineThickness = 1,
    isDraggingItem = false,
    isDraggingCharacterToken = false,
    isDraggingCamera = false
}) => {
    const canvasRef = useRef(null);
    const interactionCanvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const lastRenderParams = useRef(null);
    const renderRafRef = useRef(null);
    const isRenderingRef = useRef(false);
    // PERFORMANCE FIX: Throttle zoom renders to prevent excessive re-renders
    const zoomRenderRafRef = useRef(null);
    const lastZoomRenderRef = useRef(0);
    

    
    // Game store state
    const {
        gridSize,
        gridType,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom,
        gridOffsetX,
        gridOffsetY,
        showGrid: globalShowGrid,
        gridLineThickness: storeGridLineThickness,
        gridLineOpacity: storeGridLineOpacity,
        gridLineColor: storeGridLineColor
    } = useGameStore();
    
    const effectiveZoom = zoomLevel * playerZoom;
    const gridSystem = getGridSystem();

    // Use store values with fallbacks to props
    const finalGridLineColor = storeGridLineColor || gridLineColor;
    const finalGridLineThickness = storeGridLineThickness || gridLineThickness;
    const finalGridLineOpacity = storeGridLineOpacity || 0.8;
    
    // Simplified LOD system - no grid combining, only opacity changes
    const getLODLevel = useCallback((zoom) => {
        if (zoom < 0.6) return 0; // No grid - too zoomed out (much higher threshold)
        return 1; // Always show normal grid without combining boxes
    }, []);

    // Simplified grid properties - no grid combining, only opacity scaling
    const getGridProperties = useCallback((lodLevel, baseSpacing, zoom) => {
        switch (lodLevel) {
            case 0:
                return { spacing: 0, opacity: 0, lineWidth: 0, skipFactor: 1 }; // No grid
            case 1:
                return {
                    spacing: baseSpacing,
                    opacity: Math.min(0.8, Math.max(0.3, zoom * 1.2)), // Scale opacity with zoom
                    lineWidth: Math.max(0.5, Math.min(2.0, zoom * 1.5)), // Scale line width with zoom
                    skipFactor: 1 // NEVER combine grid boxes
                }; // Always normal grid
            default:
                return { spacing: baseSpacing, opacity: 0.7, lineWidth: 1, skipFactor: 1 };
        }
    }, []);
    
    // Optimized grid rendering function - reads camera position directly from store for real-time updates
    const renderGrid = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !showGrid || !globalShowGrid) return;
        
        // Read current camera position directly from store to avoid stale values during drag
        const currentState = useGameStore.getState();
        const currentCameraX = currentState.cameraX;
        const currentCameraY = currentState.cameraY;
        const currentEffectiveZoom = currentState.zoomLevel * currentState.playerZoom;
        
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        
        // Decide whether we will draw BEFORE clearing to avoid blinking to blank
        const lodLevel = getLODLevel(currentEffectiveZoom);
        const gridProps = getGridProperties(lodLevel, gridSize * currentEffectiveZoom, currentEffectiveZoom);

        if (lodLevel === 0 || gridProps.spacing < 1) {
            // Keep previous frame visible instead of clearing to prevent invisibility during drag
            return; // Skip drawing at very low zoom or tiny spacing
        }

        // Clear canvas only when we're about to draw
        ctx.clearRect(0, 0, width, height);
        
        // Calculate viewport bounds in world coordinates using current camera position
        const viewportBounds = {
            left: currentCameraX - (width / 2) / currentEffectiveZoom,
            right: currentCameraX + (width / 2) / currentEffectiveZoom,
            top: currentCameraY - (height / 2) / currentEffectiveZoom,
            bottom: currentCameraY + (height / 2) / currentEffectiveZoom
        };

        // Projection-aware visible bounds (correct under camera yaw/tilt)
        const visibleBounds = gridSystem.getVisibleGridBounds(width, height);
        const worldBounds = {
            left: visibleBounds.minX * gridSize + gridOffsetX,
            right: (visibleBounds.maxX + 1) * gridSize + gridOffsetX,
            top: visibleBounds.minY * gridSize + gridOffsetY,
            bottom: (visibleBounds.maxY + 1) * gridSize + gridOffsetY
        };

        // Check grid type
        const currentGridType = currentState.gridType || 'square';
        
        if (currentGridType === 'hex') {
            // Render hex grid
            ctx.strokeStyle = finalGridLineColor;
            ctx.lineWidth = Math.max(gridProps.lineWidth, finalGridLineThickness);
            ctx.globalAlpha = gridProps.opacity * finalGridLineOpacity;
            
            // Calculate hex dimensions
            // For flat-top hexagons: if gridSize is the width (flat side to flat side),
            // then the radius (center to corner) is gridSize / sqrt(3)
            const sqrt3 = Math.sqrt(3);
            const hexRadius = gridSize / sqrt3; // Radius for proper tiling (no gaps)
             // Height (point to point)
            
            // Calculate visible hex bounds by converting viewport corners to hex coordinates
            const topLeftHex = gridSystem.worldToHex(viewportBounds.left, viewportBounds.top);
            const topRightHex = gridSystem.worldToHex(viewportBounds.right, viewportBounds.top);
            const bottomLeftHex = gridSystem.worldToHex(viewportBounds.left, viewportBounds.bottom);
            const bottomRightHex = gridSystem.worldToHex(viewportBounds.right, viewportBounds.bottom);
            
            // Find min/max q and r values with generous padding to ensure full coverage
            const hexStartQ = Math.min(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q, visibleBounds.minX) - 3;
            const hexEndQ = Math.max(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q, visibleBounds.maxX) + 3;
            const hexStartR = Math.min(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r, visibleBounds.minY) - 3;
            const hexEndR = Math.max(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r, visibleBounds.maxY) + 3;
            
            // Render each visible hex
            for (let q = hexStartQ; q <= hexEndQ; q++) {
                for (let r = hexStartR; r <= hexEndR; r++) {
                    const worldPos = gridSystem.hexToWorld(q, r);
                    const screenPos = gridSystem.worldToScreen(worldPos.x, worldPos.y, width, height);
                    
                    // Check if hex is visible (with generous padding to ensure edge hexes are drawn)
                    const hexRadiusScreen = hexRadius * currentEffectiveZoom;
                    const padding = hexRadiusScreen * 2; // Large padding to ensure edge hexes are included
                    if (screenPos.x >= -padding && screenPos.x <= width + padding &&
                        screenPos.y >= -padding && screenPos.y <= height + padding) {
                        
                        // Draw the hexagon by projecting its world corners (correct under yaw/tilt)
                        const worldCorners = gridSystem.getHexCorners(worldPos.x, worldPos.y, hexRadius);
                        
                        ctx.beginPath();
                        const first = gridSystem.worldToScreen(worldCorners[0].x, worldCorners[0].y, width, height);
                        ctx.moveTo(first.x, first.y);
                        for (let i = 1; i < worldCorners.length; i++) {
                            const projected = gridSystem.worldToScreen(worldCorners[i].x, worldCorners[i].y, width, height);
                            ctx.lineTo(projected.x, projected.y);
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
            }
        } else {
            // Square grid rendering (projection-aware: every grid line is drawn
            // between two projected world endpoints so it follows camera yaw/tilt)
            ctx.strokeStyle = finalGridLineColor;
            ctx.lineWidth = Math.max(gridProps.lineWidth, finalGridLineThickness);
            ctx.globalAlpha = gridProps.opacity * finalGridLineOpacity;
            ctx.beginPath();

            // Vertical world lines (x = const)
            const startXWorld = Math.floor((worldBounds.left - gridOffsetX) / gridSize) * gridSize + gridOffsetX;
            const endXWorld = Math.ceil((worldBounds.right - gridOffsetX) / gridSize) * gridSize + gridOffsetX;
            for (let x = startXWorld; x <= endXWorld; x += gridSize * gridProps.skipFactor) {
                const p1 = gridSystem.worldToScreen(x, worldBounds.top, width, height);
                const p2 = gridSystem.worldToScreen(x, worldBounds.bottom, width, height);
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            }

            // Horizontal world lines (y = const)
            const startYWorld = Math.floor((worldBounds.top - gridOffsetY) / gridSize) * gridSize + gridOffsetY;
            const endYWorld = Math.ceil((worldBounds.bottom - gridOffsetY) / gridSize) * gridSize + gridOffsetY;
            for (let y = startYWorld; y <= endYWorld; y += gridSize * gridProps.skipFactor) {
                const p1 = gridSystem.worldToScreen(worldBounds.left, y, width, height);
                const p2 = gridSystem.worldToScreen(worldBounds.right, y, width, height);
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            }

            ctx.stroke();
        }
        
    }, [
        showGrid,
        globalShowGrid,
        gridSize,
        gridType,
        gridOffsetX,
        gridOffsetY,
        finalGridLineColor,
        finalGridLineThickness,
        finalGridLineOpacity,
        viewportSize.width,
        viewportSize.height,
        getLODLevel,
        getGridProperties,
        gridSystem
    ]);
    
    // Track drag state in ref for use in render loop
    const isDraggingCameraRef = useRef(false);
    const lastCamRenderKeyRef = useRef(null);
    useEffect(() => {
        isDraggingCameraRef.current = isDraggingCamera;
    }, [isDraggingCamera]);
    
    // Continuous animation loop during drag for smooth rendering
    const startDragRenderLoop = useCallback(() => {
        if (renderRafRef.current !== null) return; // Already running
        
        const renderLoop = () => {
            const s = useGameStore.getState();
            const camKey = `${s.cameraX}|${s.cameraY}|${s.zoomLevel * s.playerZoom}|${s.viewMode}|${s.viewRotation}|${s.viewTilt}`;
            if (camKey !== lastCamRenderKeyRef.current) {
                lastCamRenderKeyRef.current = camKey;
                renderGrid();
            }
            // Check current drag state from ref
            if (isDraggingCameraRef.current) {
                renderRafRef.current = requestAnimationFrame(renderLoop);
            } else {
                renderRafRef.current = null;
            }
        };
        
        renderRafRef.current = requestAnimationFrame(renderLoop);
    }, [renderGrid]);
    
    // Real-time render function for smooth grid movement
    const realtimeRender = useCallback(() => {
        // During camera drag, use continuous animation loop
        if (isDraggingCamera) {
            startDragRenderLoop();
        } else {
            // Normal rendering when not dragging - cancel loop if running
            if (renderRafRef.current !== null) {
                cancelAnimationFrame(renderRafRef.current);
                renderRafRef.current = null;
            }
            // Throttle renders to ~60fps when not dragging to reduce desync with React
            if (zoomRenderRafRef.current === null) {
                zoomRenderRafRef.current = requestAnimationFrame(() => {
                    renderGrid();
                    zoomRenderRafRef.current = null;
                });
            }
        }
    }, [renderGrid, isDraggingCamera, startDragRenderLoop]);
    
    // Setup canvas and handle resize
    useEffect(() => {
        const canvas = canvasRef.current;
        const interactionCanvas = interactionCanvasRef.current;
        
        if (!canvas || !interactionCanvas) return;
        
        // Set canvas size to match viewport
        const { width, height } = viewportSize;
        
        // Set actual canvas size
        canvas.width = width;
        canvas.height = height;
        interactionCanvas.width = width;
        interactionCanvas.height = height;
        
        // Set CSS size to prevent scaling
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        interactionCanvas.style.width = `${width}px`;
        interactionCanvas.style.height = `${height}px`;
        
        // Trigger render
        realtimeRender();

    }, [viewportSize, realtimeRender]);

    // Start/stop continuous render loop when drag state changes
    useEffect(() => {
        if (isDraggingCamera) {
            startDragRenderLoop();
        } else {
            // Stop the loop when drag ends
            if (renderRafRef.current !== null) {
                cancelAnimationFrame(renderRafRef.current);
                renderRafRef.current = null;
            }
            // Final render to ensure grid is up to date
            requestAnimationFrame(renderGrid);
        }
        
        return () => {
            // Cleanup on unmount
            if (renderRafRef.current !== null) {
                cancelAnimationFrame(renderRafRef.current);
                renderRafRef.current = null;
            }
        };
    }, [isDraggingCamera, startDragRenderLoop, renderGrid]);
    
    // Render when grid parameters change (only when not dragging - drag loop handles updates)
    useEffect(() => {
        if (!isDraggingCamera) {
            // Throttle zoom renders to max 60fps (16ms between renders)
            const now = performance.now();
            const timeSinceLastRender = now - lastZoomRenderRef.current;
            
            if (timeSinceLastRender >= 16) {
                // Render immediately if enough time has passed
                lastZoomRenderRef.current = now;
                realtimeRender();
            } else {
                // Schedule render for next frame if too soon
                if (zoomRenderRafRef.current === null) {
                    zoomRenderRafRef.current = requestAnimationFrame(() => {
                        lastZoomRenderRef.current = performance.now();
                        realtimeRender();
                        zoomRenderRafRef.current = null;
                    });
                }
            }
        }
        
        return () => {
            if (zoomRenderRafRef.current !== null) {
                cancelAnimationFrame(zoomRenderRafRef.current);
                zoomRenderRafRef.current = null;
            }
        };
    }, [realtimeRender, isDraggingCamera, cameraX, cameraY, effectiveZoom, gridSize, gridOffsetX, gridOffsetY, showGrid, globalShowGrid]);
    
    // Handle mouse interactions on the interaction canvas
    const handleCanvasInteraction = useCallback((event) => {
        // CRITICAL FIX: Enhanced checks to prevent unwanted token movement

        // Check if the event target is a grid item - if so, don't handle it here
        if (event.target && event.target.classList.contains('grid-item-orb')) {
            return;
        }

        // Check if there's a grid item or token element at this position
        const elementAtPoint = document.elementFromPoint(event.clientX, event.clientY);
        if (elementAtPoint && (
            elementAtPoint.classList.contains('grid-item-orb') ||
            elementAtPoint.classList.contains('creature-token') ||
            elementAtPoint.classList.contains('character-token') ||
            elementAtPoint.closest('.creature-token') ||
            elementAtPoint.closest('.character-token') ||
            elementAtPoint.closest('.grid-item-orb')
        )) {
            return;
        }

        // Additional safety check: if any token is currently being dragged, ignore canvas events
        if (window.multiplayerDragState && window.multiplayerDragState.size > 0) {
            return;
        }

        // For click events, add extra validation to prevent unwanted actions
        if (event.type === 'click' || event.type === 'mousedown') {
            // CRITICAL FIX: Completely disable left-click handling when not in special modes
            if (event.button === 0 && !isDraggingItem && !isDraggingCharacterToken) {
                return; // Don't process left-clicks when not in special modes
            }
        }

        // Prevent default for drag events to allow dropping
        if (event.type.includes('drag') || event.type === 'drop') {
            event.preventDefault();
        }

        if (!onGridInteraction) return;

        const canvas = interactionCanvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Convert screen coordinates to grid coordinates using viewport-centered coordinate system
        const worldPos = gridSystem.screenToWorld(x, y, canvas.width, canvas.height);
        const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);

        // Create a tile-like object for compatibility
        const tileData = {
            gridX: gridCoords.x,
            gridY: gridCoords.y,
            worldX: worldPos.x,
            worldY: worldPos.y,
            screenX: x,
            screenY: y,
            key: `${gridCoords.x},${gridCoords.y}`
        };

        onGridInteraction(event, tileData);
    }, [onGridInteraction, gridSystem, isDraggingItem, isDraggingCharacterToken]);

    // Repaint immediately when the camera projection changes (orbit/tilt/mode),
    // instead of waiting for the next pan/drag to trigger a render.
    useEffect(() => {
        const unsubscribe = useGameStore.subscribe((state, prevState) => {
            if (
                state.viewMode !== prevState.viewMode ||
                state.viewRotation !== prevState.viewRotation ||
                state.viewTilt !== prevState.viewTilt
            ) {
                if (zoomRenderRafRef.current === null) {
                    zoomRenderRafRef.current = requestAnimationFrame(() => {
                        renderGrid();
                        zoomRenderRafRef.current = null;
                    });
                }
            }
        });
        return unsubscribe;
    }, [renderGrid]);

    return (
        <>
            {/* Grid rendering canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 1,
                    imageRendering: 'pixelated' // Crisp lines at all zoom levels
                }}
            />
            
            {/* Invisible interaction canvas for mouse events */}
            <canvas
                ref={interactionCanvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: (isDraggingItem || isDraggingCharacterToken) ? 'all' : 'none', // Capture events when dragging items or placing character tokens
                    zIndex: (isDraggingItem || isDraggingCharacterToken) ? 50 : 1, // Lower z-index than tokens (100) to allow token interactions
                    opacity: 0, // Invisible but captures events
                    touchAction: 'none'
                }}
                onClick={handleCanvasInteraction}
                onContextMenu={handleCanvasInteraction}
                onMouseMove={handleCanvasInteraction}
                onMouseDown={handleCanvasInteraction}
                onMouseUp={handleCanvasInteraction}
                onPointerDown={handleCanvasInteraction}
                onPointerMove={handleCanvasInteraction}
                onPointerUp={handleCanvasInteraction}
                onPointerCancel={handleCanvasInteraction}
                onDragEnter={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                    handleCanvasInteraction(e);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                    handleCanvasInteraction(e);
                }}
                onDragLeave={handleCanvasInteraction}
                onDrop={(e) => {
                    e.preventDefault();
                    console.log('🎯 Canvas drop event captured');
                    handleCanvasInteraction(e);
                }}
            />
        </>
    );
};

export default CanvasGridRenderer;
