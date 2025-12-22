import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { rafThrottle } from '../../utils/performanceUtils';

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
            const hexHeight = gridSize * sqrt3 / 2; // Height (point to point)
            
            // Calculate visible hex bounds by converting viewport corners to hex coordinates
            const topLeftHex = gridSystem.worldToHex(viewportBounds.left, viewportBounds.top);
            const topRightHex = gridSystem.worldToHex(viewportBounds.right, viewportBounds.top);
            const bottomLeftHex = gridSystem.worldToHex(viewportBounds.left, viewportBounds.bottom);
            const bottomRightHex = gridSystem.worldToHex(viewportBounds.right, viewportBounds.bottom);
            
            // Find min/max q and r values with generous padding to ensure full coverage
            const hexStartQ = Math.min(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q) - 3;
            const hexEndQ = Math.max(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q) + 3;
            const hexStartR = Math.min(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r) - 3;
            const hexEndR = Math.max(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r) + 3;
            
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
                        
                        // Draw hexagon outline
                        const corners = gridSystem.getHexCorners(screenPos.x, screenPos.y, hexRadiusScreen);
                        
                        ctx.beginPath();
                        ctx.moveTo(corners[0].x, corners[0].y);
                        for (let i = 1; i < corners.length; i++) {
                            ctx.lineTo(corners[i].x, corners[i].y);
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
            }
        } else {
            // Square grid rendering (original behavior)
            // Calculate grid bounds
            const gridLeft = Math.floor((viewportBounds.left - gridOffsetX) / gridSize) * gridSize + gridOffsetX;
            const gridRight = Math.ceil((viewportBounds.right - gridOffsetX) / gridSize) * gridSize + gridOffsetX;
            const gridTop = Math.floor((viewportBounds.top - gridOffsetY) / gridSize) * gridSize + gridOffsetY;
            const gridBottom = Math.ceil((viewportBounds.bottom - gridOffsetY) / gridSize) * gridSize + gridOffsetY;

            // Render fine grid (if enabled)
            if (gridProps.showFineGrid) {
                ctx.strokeStyle = finalGridLineColor;
                ctx.lineWidth = finalGridLineThickness * 0.25;
                ctx.globalAlpha = gridProps.fineGridOpacity * finalGridLineOpacity;
                ctx.beginPath();

                const fineStep = gridSize / 4;
                for (let x = gridLeft; x <= gridRight; x += fineStep) {
                    // Use InfiniteGridSystem coordinate transformation for consistency with viewport centering
                    const screenPos = gridSystem.worldToScreen(x, 0, width, height);
                    const screenX = screenPos.x;
                    if (screenX >= -1 && screenX <= width + 1) {
                        ctx.moveTo(Math.round(screenX) + 0.5, 0);
                        ctx.lineTo(Math.round(screenX) + 0.5, height);
                    }
                }

                for (let y = gridTop; y <= gridBottom; y += fineStep) {
                    // Use InfiniteGridSystem coordinate transformation for consistency with viewport centering
                    const screenPos = gridSystem.worldToScreen(0, y, width, height);
                    const screenY = screenPos.y;
                    if (screenY >= -1 && screenY <= height + 1) {
                        ctx.moveTo(0, Math.round(screenY) + 0.5);
                        ctx.lineTo(width, Math.round(screenY) + 0.5);
                    }
                }
                ctx.stroke();
            }

            // Render sub-grid (if enabled)
            if (gridProps.showSubGrid) {
                ctx.strokeStyle = finalGridLineColor;
                ctx.lineWidth = finalGridLineThickness * 0.5;
                ctx.globalAlpha = gridProps.subGridOpacity * finalGridLineOpacity;
                ctx.beginPath();

                const subStep = gridSize / 2;
                for (let x = gridLeft; x <= gridRight; x += subStep) {
                    // Use InfiniteGridSystem coordinate transformation for consistency with viewport centering
                    const screenPos = gridSystem.worldToScreen(x, 0, width, height);
                    const screenX = screenPos.x;
                    if (screenX >= -1 && screenX <= width + 1) {
                        ctx.moveTo(Math.round(screenX) + 0.5, 0);
                        ctx.lineTo(Math.round(screenX) + 0.5, height);
                    }
                }

                for (let y = gridTop; y <= gridBottom; y += subStep) {
                    // Use InfiniteGridSystem coordinate transformation for consistency with viewport centering
                    const screenPos = gridSystem.worldToScreen(0, y, width, height);
                    const screenY = screenPos.y;
                    if (screenY >= -1 && screenY <= height + 1) {
                        ctx.moveTo(0, Math.round(screenY) + 0.5);
                        ctx.lineTo(width, Math.round(screenY) + 0.5);
                    }
                }
                ctx.stroke();
            }

            // Render main grid
            ctx.strokeStyle = finalGridLineColor;
            ctx.lineWidth = Math.max(gridProps.lineWidth, finalGridLineThickness);
            ctx.globalAlpha = gridProps.opacity * finalGridLineOpacity;
            ctx.beginPath();

            // Draw vertical lines using the same coordinate system as terrain and tokens
            for (let x = gridLeft; x <= gridRight; x += gridSize * gridProps.skipFactor) {
                // Use InfiniteGridSystem coordinate transformation for consistency with viewport centering
                const screenPos = gridSystem.worldToScreen(x, 0, width, height);
                const screenX = screenPos.x;
                if (screenX >= -1 && screenX <= width + 1) {
                    ctx.moveTo(Math.round(screenX) + 0.5, 0);
                    ctx.lineTo(Math.round(screenX) + 0.5, height);
                }
            }

            // Draw horizontal lines using the same coordinate system as terrain and tokens
            for (let y = gridTop; y <= gridBottom; y += gridSize * gridProps.skipFactor) {
                // Use InfiniteGridSystem coordinate transformation for consistency with viewport centering
                const screenPos = gridSystem.worldToScreen(0, y, width, height);
                const screenY = screenPos.y;
                if (screenY >= -1 && screenY <= height + 1) {
                    ctx.moveTo(0, Math.round(screenY) + 0.5);
                    ctx.lineTo(width, Math.round(screenY) + 0.5);
                }
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
    useEffect(() => {
        isDraggingCameraRef.current = isDraggingCamera;
    }, [isDraggingCamera]);
    
    // Continuous animation loop during drag for smooth rendering
    const startDragRenderLoop = useCallback(() => {
        if (renderRafRef.current !== null) return; // Already running
        
        const renderLoop = () => {
            renderGrid();
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
            requestAnimationFrame(renderGrid);
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
            console.log('Canvas: ignoring event on grid item');
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
            console.log('Canvas: interactive element found at mouse position, ignoring event');
            return;
        }

        // Additional safety check: if any token is currently being dragged, ignore canvas events
        if (window.multiplayerDragState && window.multiplayerDragState.size > 0) {
            console.log('Canvas: token is being dragged, ignoring canvas interaction');
            return;
        }

        // For click events, add extra validation to prevent unwanted actions
        if (event.type === 'click' || event.type === 'mousedown') {
            // CRITICAL FIX: Completely disable left-click handling when not in special modes
            if (event.button === 0 && !isDraggingItem && !isDraggingCharacterToken) {
                console.log('Canvas: Left-click ignored - only drag and drop should move tokens');
                return; // Don't process left-clicks when not in special modes
            }

            // Check if we're in any special mode that should handle clicks differently
            if (!isDraggingItem && !isDraggingCharacterToken) {
                // Not in any dragging mode, so this is a regular grid click
                // Only proceed if we're sure this isn't interfering with token interactions
                console.log('Canvas: processing grid click event');
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
