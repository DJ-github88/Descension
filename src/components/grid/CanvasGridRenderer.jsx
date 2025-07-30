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
    
    // Enhanced Level-of-Detail (LOD) system
    const getLODLevel = useCallback((zoom) => {
        if (zoom < 0.05) return 0; // No grid - too zoomed out
        if (zoom < 0.15) return 1; // Major grid lines only (every 10th)
        if (zoom < 0.3) return 2; // Sparse grid (every 5th line)
        if (zoom < 0.6) return 3; // Medium grid (every 2nd line)
        if (zoom < 1.2) return 4; // Normal grid (every line)
        if (zoom < 2.0) return 5; // Detailed grid with sub-divisions
        return 6; // Ultra-detailed grid with fine sub-divisions
    }, []);

    // Calculate grid line spacing and styling based on LOD
    const getGridProperties = useCallback((lodLevel, baseSpacing, zoom) => {
        switch (lodLevel) {
            case 0:
                return { spacing: 0, opacity: 0, lineWidth: 0 }; // No grid
            case 1:
                return {
                    spacing: baseSpacing * 10,
                    opacity: Math.min(0.8, zoom * 8),
                    lineWidth: Math.max(1, zoom * 2),
                    skipFactor: 10
                }; // Major grid lines only
            case 2:
                return {
                    spacing: baseSpacing * 5,
                    opacity: Math.min(0.7, zoom * 4),
                    lineWidth: Math.max(0.8, zoom * 1.5),
                    skipFactor: 5
                }; // Sparse grid
            case 3:
                return {
                    spacing: baseSpacing * 2,
                    opacity: Math.min(0.6, zoom * 2),
                    lineWidth: Math.max(0.6, zoom),
                    skipFactor: 2
                }; // Medium grid
            case 4:
                return {
                    spacing: baseSpacing,
                    opacity: Math.min(0.7, zoom * 1.2), // Increased opacity for better visibility
                    lineWidth: Math.max(0.8, zoom * 1.0), // Increased line width
                    skipFactor: 1
                }; // Normal grid
            case 5:
                return {
                    spacing: baseSpacing,
                    opacity: 0.4,
                    lineWidth: 0.5,
                    skipFactor: 1,
                    showSubGrid: true,
                    subGridOpacity: 0.2
                }; // Detailed with sub-divisions
            case 6:
                return {
                    spacing: baseSpacing,
                    opacity: 0.3,
                    lineWidth: 0.4,
                    skipFactor: 1,
                    showSubGrid: true,
                    subGridOpacity: 0.15,
                    showFineGrid: true,
                    fineGridOpacity: 0.1
                }; // Ultra-detailed
            default:
                return { spacing: baseSpacing, opacity: 0.5, lineWidth: 1, skipFactor: 1 };
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
            elementAtPoint.closest('.character-token')
        )) {
            console.log('Canvas: interactive element found at mouse position, ignoring event');
            return;
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
    }, [onGridInteraction, gridSystem]);
    
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
