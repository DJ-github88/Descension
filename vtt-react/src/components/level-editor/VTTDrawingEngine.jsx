import React, { useRef, useEffect, useCallback } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';

const VTTDrawingEngine = () => {
    const canvasRef = useRef(null);
    const overlayCanvasRef = useRef(null);

    // Store connections
    const {
        drawingPaths,
        drawingLayers,
        activeLayer,
        isEditorMode,
        activeTool,
        toolSettings,
        setTerrain,
        setFogOfWar,
        addLightSource,
        currentDrawingPath,
        isCurrentlyDrawing,
        currentDrawingTool
    } = useLevelEditorStore();

    const {
        gridSize,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom
    } = useGameStore();

    // Calculate effective zoom and transformations
    const effectiveZoom = zoomLevel * playerZoom;

    // Convert grid coordinates to screen coordinates using the same system as InfiniteGridSystem
    const gridToScreen = useCallback((gridX, gridY) => {
        try {
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            // Use consistent viewport dimensions that account for editor panel
            const viewport = gridSystem.getViewportDimensions();
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            const worldX = (gridX * gridSize) + gridOffsetX;
            const worldY = (gridY * gridSize) + gridOffsetY;

            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            return gridSystem.worldToScreen(worldX, worldY, viewport.width, viewport.height);
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, effectiveZoom]);

    // Render drawing paths on canvas
    const renderDrawings = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set canvas size to match viewport
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Render each visible layer
        drawingLayers.forEach(layer => {
            if (!layer.visible) return;

            // Filter paths for this layer - only render drawing tools on drawings layer
            const layerPaths = drawingPaths.filter(path => {
                if (layer.id === 'drawings') {
                    // Only show drawing tools (freehand, line, rectangle, circle, polygon, text) on drawings layer
                    return path.layer === 'drawings' ||
                           ['freehand', 'line', 'rectangle', 'circle', 'polygon', 'text'].includes(path.tool);
                }
                return path.layer === layer.id;
            });

            layerPaths.forEach(path => {
                if (!path.points || path.points.length === 0) return;

                ctx.save();

                // Apply path style
                ctx.strokeStyle = path.style.strokeColor || '#000000';
                ctx.fillStyle = path.style.fillColor || 'transparent';
                ctx.lineWidth = (path.style.strokeWidth || 2) * effectiveZoom;
                ctx.globalAlpha = path.style.opacity || 1;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Render based on tool type
                switch (path.tool) {
                    case 'freehand':
                        renderFreehandPath(ctx, path.points);
                        break;
                    case 'line':
                        renderLinePath(ctx, path.points);
                        break;
                    case 'rectangle':
                        renderRectanglePath(ctx, path.points);
                        break;
                    case 'circle':
                        renderCirclePath(ctx, path.points);
                        break;
                    case 'polygon':
                        renderPolygonPath(ctx, path.points);
                        break;
                    case 'text':
                        renderTextPath(ctx, path);
                        break;
                    case 'terrain_brush':
                        renderTerrainBrush(ctx, path.points);
                        break;
                    case 'wall_draw':
                        renderWallPath(ctx, path.points);
                        break;
                    case 'fog_brush':
                        renderFogBrush(ctx, path.points);
                        break;
                    default:
                        renderFreehandPath(ctx, path.points);
                        break;
                }

                ctx.restore();
            });
        });

        // Render current drawing path in real-time on main canvas
        if (isCurrentlyDrawing && currentDrawingPath && Array.isArray(currentDrawingPath) && currentDrawingPath.length > 0) {

            ctx.save();

            // Apply current tool style
            ctx.strokeStyle = toolSettings.strokeColor || '#4a8eff';
            ctx.fillStyle = toolSettings.fillColor || 'transparent';
            ctx.lineWidth = (toolSettings.strokeWidth || 2) * effectiveZoom;
            ctx.globalAlpha = 1; // Full opacity for real-time drawing
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Render based on current tool type
            switch (currentDrawingTool) {
                case 'freehand':

                    renderFreehandPath(ctx, currentDrawingPath);
                    break;
                case 'line':
                    renderLinePath(ctx, currentDrawingPath);
                    break;
                case 'rectangle':
                    renderRectanglePath(ctx, currentDrawingPath);
                    break;
                case 'circle':
                    renderCirclePath(ctx, currentDrawingPath);
                    break;
                case 'polygon':
                    renderPolygonPath(ctx, currentDrawingPath);
                    break;
                case 'wall_draw':
                    // Don't render walls on main canvas - they're handled by wall system
                    break;
                default:
                    renderFreehandPath(ctx, currentDrawingPath);
                    break;
            }

            ctx.restore();
        }
    }, [drawingPaths, drawingLayers, effectiveZoom, gridToScreen, isCurrentlyDrawing, currentDrawingPath, currentDrawingTool, toolSettings, cameraX, cameraY]);

    // Render freehand drawing
    const renderFreehandPath = (ctx, points) => {
        if (!points || points.length === 0) return;

        ctx.beginPath();

        // Check if this is a freehand path with world coordinates (new system)
        if (points[0] && points[0].isWorldCoords) {
            // Convert world coordinates to screen coordinates for rendering
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();

            if (points.length === 1) {
                // Draw a small dot for single point
                const screenPos = gridSystem.worldToScreen(points[0].worldX, points[0].worldY, viewport.width, viewport.height);
                ctx.arc(screenPos.x, screenPos.y, ctx.lineWidth / 2, 0, 2 * Math.PI);
                ctx.fill();
            } else {
                // Draw connected lines for multiple points
                const startPos = gridSystem.worldToScreen(points[0].worldX, points[0].worldY, viewport.width, viewport.height);
                ctx.moveTo(startPos.x, startPos.y);
                for (let i = 1; i < points.length; i++) {
                    const screenPos = gridSystem.worldToScreen(points[i].worldX, points[i].worldY, viewport.width, viewport.height);
                    ctx.lineTo(screenPos.x, screenPos.y);
                }
                ctx.stroke();
            }
        } else if (points[0] && points[0].isFreehand) {
            // Legacy: Use screen coordinates directly (old freehand drawings)
            if (points.length === 1) {
                // Draw a small dot for single point
                ctx.arc(points[0].x, points[0].y, ctx.lineWidth / 2, 0, 2 * Math.PI);
                ctx.fill();
            } else {
                // Draw connected lines for multiple points
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.stroke();
            }
        } else {
            // Use grid coordinates for grid-snapped drawing
            const startPoint = gridToScreen(points[0].gridX, points[0].gridY);
            if (points.length === 1) {
                // Draw a small dot for single point
                ctx.arc(startPoint.x, startPoint.y, ctx.lineWidth / 2, 0, 2 * Math.PI);
                ctx.fill();
            } else {
                // Draw connected lines for multiple points
                ctx.moveTo(startPoint.x, startPoint.y);
                for (let i = 1; i < points.length; i++) {
                    const point = gridToScreen(points[i].gridX, points[i].gridY);
                    ctx.lineTo(point.x, point.y);
                }
                ctx.stroke();
            }
        }
    };

    // Render straight line
    const renderLinePath = (ctx, points) => {
        if (points.length < 2) return;

        const start = gridToScreen(points[0].gridX, points[0].gridY);
        const end = gridToScreen(points[points.length - 1].gridX, points[points.length - 1].gridY);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    };

    // Render rectangle
    const renderRectanglePath = (ctx, points) => {
        if (points.length < 2) return;

        const gridSystem = getGridSystem();
        const { gridType } = gridSystem.getGridState();
        
        if (gridType === 'hex') {
            // For hex grids, render a hex boundary shape
            const minX = Math.min(points[0].gridX, points[points.length - 1].gridX);
            const maxX = Math.max(points[0].gridX, points[points.length - 1].gridX);
            const minY = Math.min(points[0].gridY, points[points.length - 1].gridY);
            const maxY = Math.max(points[0].gridY, points[points.length - 1].gridY);
            
            // Get boundary points
            const boundaryPoints = gridSystem.getHexBoundary(minX, maxX, minY, maxY);
            
            if (boundaryPoints.length > 0) {
                ctx.beginPath();
                const viewport = gridSystem.getViewportDimensions();
                const firstPoint = gridSystem.worldToScreen(boundaryPoints[0].x, boundaryPoints[0].y, viewport.width, viewport.height);
                ctx.moveTo(firstPoint.x, firstPoint.y);
                
                for (let i = 1; i < boundaryPoints.length; i++) {
                    const screenPoint = gridSystem.worldToScreen(boundaryPoints[i].x, boundaryPoints[i].y, viewport.width, viewport.height);
                    ctx.lineTo(screenPoint.x, screenPoint.y);
                }
                ctx.closePath();
                
                if (ctx.fillStyle !== 'transparent') {
                    ctx.fill();
                }
                ctx.stroke();
            }
        } else {
            // Square grid: render normal rectangle
            const start = gridToScreen(points[0].gridX, points[0].gridY);
            const end = gridToScreen(points[points.length - 1].gridX, points[points.length - 1].gridY);

            const width = end.x - start.x;
            const height = end.y - start.y;

            ctx.beginPath();
            ctx.rect(start.x, start.y, width, height);
            
            if (ctx.fillStyle !== 'transparent') {
                ctx.fill();
            }
            ctx.stroke();
        }
    };

    // Render circle
    const renderCirclePath = (ctx, points) => {
        if (points.length < 2) return;

        const center = gridToScreen(points[0].gridX, points[0].gridY);
        const edge = gridToScreen(points[points.length - 1].gridX, points[points.length - 1].gridY);

        const radius = Math.sqrt(
            Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2)
        );

        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);

        if (ctx.fillStyle !== 'transparent') {
            ctx.fill();
        }
        ctx.stroke();
    };

    // Render polygon
    const renderPolygonPath = (ctx, points) => {
        if (points.length < 2) return; // Need at least 2 points

        ctx.beginPath();

        // Start with the first point
        const startPoint = gridToScreen(points[0].gridX, points[0].gridY);
        ctx.moveTo(startPoint.x, startPoint.y);

        // Draw lines to each subsequent point
        for (let i = 1; i < points.length; i++) {
            const point = gridToScreen(points[i].gridX, points[i].gridY);
            ctx.lineTo(point.x, point.y);
        }

        // For polygons with 3+ points, close the shape
        if (points.length >= 3) {
            ctx.closePath();

            if (ctx.fillStyle !== 'transparent') {
                ctx.fill();
            }
        }

        ctx.stroke();
    };



    // Render text with enhanced styling
    const renderTextPath = (ctx, path) => {
        if (!path.points || path.points.length === 0 || !path.text) return;

        const point = path.points[0];
        const screenPos = gridToScreen(point.gridX, point.gridY);

        // Extract text style properties
        const baseFontSize = path.style.fontSize || 16;
        const fontFamily = path.style.fontFamily || 'Arial';
        const textColor = path.style.textColor || '#000000';
        const backgroundColor = path.style.backgroundColor || '#ffffff';
        const backgroundStyle = path.style.backgroundStyle || 'solid';
        const bold = path.style.bold || false;
        const italic = path.style.italic || false;
        const underline = path.style.underline || false;

        // Scale font size by zoom level
        const fontSize = baseFontSize * effectiveZoom;

        // Build font string
        let fontString = '';
        if (italic) fontString += 'italic ';
        if (bold) fontString += 'bold ';
        fontString += `${fontSize}px ${fontFamily}`;

        ctx.font = fontString;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Measure text for box sizing
        const textMetrics = ctx.measureText(path.text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize * 1.2; // Account for line height
        const padding = 6 * effectiveZoom; // Scale padding by zoom

        // Draw background based on style
        if (backgroundStyle !== 'none') {
            drawTextBackground(ctx, screenPos, textWidth, textHeight, padding, backgroundStyle, backgroundColor);
        }

        // Draw text
        ctx.fillStyle = textColor;
        ctx.fillText(path.text, screenPos.x, screenPos.y);

        // Draw underline if specified
        if (underline) {
            ctx.strokeStyle = textColor;
            ctx.lineWidth = Math.max(1, fontSize / 16);
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y + textHeight);
            ctx.lineTo(screenPos.x + textWidth, screenPos.y + textHeight);
            ctx.stroke();
        }
    };

    // Helper function to draw different background styles
    const drawTextBackground = (ctx, screenPos, textWidth, textHeight, padding, backgroundStyle, backgroundColor) => {
        const left = screenPos.x - padding;
        const top = screenPos.y - padding;
        const width = textWidth + (padding * 2);
        const height = textHeight + (padding * 2);

        switch (backgroundStyle) {
            case 'solid':
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(left, top, width, height);
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 1;
                ctx.strokeRect(left, top, width, height);
                break;

            case 'parchment':
                // Parchment-like background
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(left, top, width, height);
                // Add subtle border
                ctx.strokeStyle = '#d4af37';
                ctx.lineWidth = 2;
                ctx.strokeRect(left, top, width, height);
                // Add inner shadow effect
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(left + 1, top + 1, width - 2, 2);
                break;

            case 'scroll':
                // Scroll-like background with rounded edges
                ctx.fillStyle = backgroundColor;
                ctx.beginPath();
                ctx.roundRect(left, top, width, height, 8);
                ctx.fill();
                ctx.strokeStyle = '#8b7355';
                ctx.lineWidth = 2;
                ctx.stroke();
                break;

            case 'stone':
                // Stone tablet effect
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(left, top, width, height);
                ctx.strokeStyle = '#696969';
                ctx.lineWidth = 3;
                ctx.strokeRect(left, top, width, height);
                // Add chiseled effect
                ctx.strokeStyle = '#a9a9a9';
                ctx.lineWidth = 1;
                ctx.strokeRect(left + 1, top + 1, width - 2, height - 2);
                break;

            case 'wood':
                // Wooden sign effect
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(left, top, width, height);
                ctx.strokeStyle = '#8b4513';
                ctx.lineWidth = 4;
                ctx.strokeRect(left, top, width, height);
                // Add wood grain lines
                ctx.strokeStyle = '#a0522d';
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    const y = top + (height / 4) * (i + 1);
                    ctx.beginPath();
                    ctx.moveTo(left + 2, y);
                    ctx.lineTo(left + width - 2, y);
                    ctx.stroke();
                }
                break;

            default:
                // Default solid background
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillRect(left, top, width, height);
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 1;
                ctx.strokeRect(left, top, width, height);
                break;
        }
    };

    // Render terrain brush (special styling) - removed to prevent double rendering
    const renderTerrainBrush = (ctx, points) => {
        // Terrain brush rendering is now handled by the terrain system
        // This prevents double colorization issues
        return;
    };

    // Render wall (thick lines on grid edges or rectangle for rectangle mode)
    const renderWallPath = (ctx, points, wallMode = 'continuous') => {
        if (points.length < 2) return;

        const gridSystem = getGridSystem();
        const { gridType } = gridSystem.getGridState();

        ctx.lineWidth = Math.max(4, 8 * effectiveZoom);
        ctx.strokeStyle = '#8B4513';
        ctx.lineCap = 'square';

        if (wallMode === 'rectangle') {
            // Render rectangle preview for rectangle wall mode
            if (gridType === 'hex') {
                // For hex grids, render hex boundary
                const minX = Math.min(points[0].gridX, points[points.length - 1].gridX);
                const maxX = Math.max(points[0].gridX, points[points.length - 1].gridX);
                const minY = Math.min(points[0].gridY, points[points.length - 1].gridY);
                const maxY = Math.max(points[0].gridY, points[points.length - 1].gridY);
                
                const boundaryPoints = gridSystem.getHexBoundary(minX, maxX, minY, maxY);
                if (boundaryPoints.length > 0) {
                    ctx.beginPath();
                    const viewport = gridSystem.getViewportDimensions();
                    const firstPoint = gridSystem.worldToScreen(boundaryPoints[0].x, boundaryPoints[0].y, viewport.width, viewport.height);
                    ctx.moveTo(firstPoint.x, firstPoint.y);
                    
                    for (let i = 1; i < boundaryPoints.length; i++) {
                        const screenPoint = gridSystem.worldToScreen(boundaryPoints[i].x, boundaryPoints[i].y, viewport.width, viewport.height);
                        ctx.lineTo(screenPoint.x, screenPoint.y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            } else {
                // Square grid: render normal rectangle
                const start = gridToScreen(points[0].gridX, points[0].gridY);
                const end = gridToScreen(points[points.length - 1].gridX, points[points.length - 1].gridY);

                const width = end.x - start.x;
                const height = end.y - start.y;

                ctx.beginPath();
                ctx.rect(start.x, start.y, width, height);
                ctx.stroke();
            }
        } else {
            // Render continuous line for continuous wall mode
            ctx.beginPath();
            
            if (gridType === 'hex' && points.length === 2) {
                // For hex grids with 2 points, draw along hex edge
                const edge = gridSystem.getHexEdge(points[0].gridX, points[0].gridY, points[1].gridX, points[1].gridY);
                if (edge) {
                    const viewport = gridSystem.getViewportDimensions();
                    const startPoint = gridSystem.worldToScreen(edge.start.x, edge.start.y, viewport.width, viewport.height);
                    const endPoint = gridSystem.worldToScreen(edge.end.x, edge.end.y, viewport.width, viewport.height);
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.lineTo(endPoint.x, endPoint.y);
                } else {
                    // Fallback
                    const startPoint = gridToScreen(points[0].gridX, points[0].gridY);
                    ctx.moveTo(startPoint.x, startPoint.y);
                    const endPoint = gridToScreen(points[1].gridX, points[1].gridY);
                    ctx.lineTo(endPoint.x, endPoint.y);
                }
            } else {
                // Square grid or multi-point path
                const startPoint = gridToScreen(points[0].gridX, points[0].gridY);
                ctx.moveTo(startPoint.x, startPoint.y);

                for (let i = 1; i < points.length; i++) {
                    const point = gridToScreen(points[i].gridX, points[i].gridY);
                    ctx.lineTo(point.x, point.y);
                }
            }

            ctx.stroke();
        }
    };

    // Render fog of war (dark overlay)
    const renderFogBrush = (ctx, points) => {
        points.forEach(point => {
            const screenPos = gridToScreen(point.gridX, point.gridY);
            const tileSize = gridSize * effectiveZoom;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Dark fog
            ctx.fillRect(
                screenPos.x,
                screenPos.y,
                tileSize,
                tileSize
            );
        });
    };

    // Render current drawing path on overlay canvas (for wall previews only)
    const renderCurrentPath = useCallback(() => {
        const canvas = overlayCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Set canvas size to match viewport
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Clear previous drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Only render wall previews on overlay (since walls aren't drawn on main canvas)
        if (isCurrentlyDrawing && currentDrawingPath && currentDrawingPath.length > 0 && currentDrawingTool === 'wall_draw') {
            ctx.save();
            ctx.strokeStyle = toolSettings.strokeColor || '#4a8eff';
            ctx.lineWidth = Math.max(4, 8 * effectiveZoom);
            ctx.globalAlpha = 0.7; // Semi-transparent preview
            ctx.lineCap = 'square';
            ctx.lineJoin = 'round';

            // Pass wall mode to renderWallPath for proper rectangle preview
            const wallMode = toolSettings.wallMode || 'continuous';
            renderWallPath(ctx, currentDrawingPath, wallMode);

            ctx.restore();
        }
    }, [currentDrawingPath, currentDrawingTool, isCurrentlyDrawing, toolSettings, effectiveZoom]);

    // Update canvas when dependencies change
    useEffect(() => {
        renderDrawings();
    }, [renderDrawings]);

    // Update overlay canvas when current path changes
    useEffect(() => {
        renderCurrentPath();
    }, [renderCurrentPath]);

    // Force immediate re-render when currentDrawingPath changes for real-time drawing
    useEffect(() => {
        if (isCurrentlyDrawing && currentDrawingPath && Array.isArray(currentDrawingPath) && currentDrawingPath.length > 0) {

            // Immediate render for real-time feedback
            renderDrawings();
        }
    }, [currentDrawingPath, isCurrentlyDrawing, renderDrawings]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            renderDrawings();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [renderDrawings]);

    // Always render drawings (visible even when editor is closed)

    return (
        <>
            {/* Main drawing canvas */}
            <canvas
                ref={canvasRef}
                className="vtt-drawing-canvas"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 50,
                    pointerEvents: 'none'
                }}
            />
            
            {/* Overlay canvas for current drawing */}
            <canvas
                ref={overlayCanvasRef}
                className="vtt-drawing-overlay-canvas"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 51,
                    pointerEvents: 'none'
                }}
            />
        </>
    );
};

export default VTTDrawingEngine;
