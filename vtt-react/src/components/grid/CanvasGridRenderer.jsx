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
    isDraggingCharacterToken = false
}) => {
    const canvasRef = useRef(null);
    const interactionCanvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const lastRenderParams = useRef(null);
    

    
    // Game store state
    const {
        gridSize,
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
    
    // Optimized grid rendering function
    const renderGrid = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !showGrid || !globalShowGrid) return;
        

        
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const lodLevel = getLODLevel(effectiveZoom);
        const gridProps = getGridProperties(lodLevel, gridSize * effectiveZoom, effectiveZoom);

        if (lodLevel === 0 || gridProps.spacing < 1) {
            return; // Don't render grid at very low zoom or if spacing is too small
        }
        
        // Calculate viewport bounds in world coordinates
        const viewportBounds = {
            left: cameraX - (width / 2) / effectiveZoom,
            right: cameraX + (width / 2) / effectiveZoom,
            top: cameraY - (height / 2) / effectiveZoom,
            bottom: cameraY + (height / 2) / effectiveZoom
        };

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
        
    }, [
        showGrid,
        globalShowGrid,
        effectiveZoom,
        gridSize,
        cameraX,
        cameraY,
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
    
    // Real-time render function for smooth grid movement
    const realtimeRender = useCallback(() => {
        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(renderGrid);
    }, [renderGrid]);
    
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

    // Render when grid parameters change
    useEffect(() => {
        realtimeRender();
    }, [realtimeRender]);
    
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
                    opacity: 0 // Invisible but captures events
                }}
                onClick={handleCanvasInteraction}
                onContextMenu={handleCanvasInteraction}
                onMouseMove={handleCanvasInteraction}
                onMouseDown={handleCanvasInteraction}
                onMouseUp={handleCanvasInteraction}
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
