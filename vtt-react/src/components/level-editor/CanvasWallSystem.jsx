import React, { useRef, useEffect, useCallback } from 'react';
import useLevelEditorStore, { WALL_TYPES } from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { rafThrottle } from '../../utils/performanceUtils';

const CanvasWallSystem = () => {
    const canvasRef = useRef(null);
    
    // Get state from stores
    const { 
        cameraX, 
        cameraY, 
        zoomLevel, 
        playerZoom, 
        gridSize, 
        gridOffsetX, 
        gridOffsetY 
    } = useGameStore();
    
    const {
        wallData,
        drawingLayers,
        showWallLayer,
        isEditorMode,
        viewingFromToken,
        visibleArea
    } = useLevelEditorStore();

    // Calculate effective zoom
    const effectiveZoom = zoomLevel * playerZoom;

    // Convert grid coordinates to screen coordinates using the same system as terrain
    const gridToScreen = useCallback((gridX, gridY, canvasWidth, canvasHeight) => {
        try {
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            // Always pass viewport dimensions for proper coordinate conversion
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, canvasWidth || window.innerWidth, canvasHeight || window.innerHeight);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            const worldX = (gridX * gridSize) + gridOffsetX;
            const worldY = (gridY * gridSize) + gridOffsetY;

            // Use viewport-centered coordinate system for consistency
            const screenX = (worldX - cameraX) * effectiveZoom + (canvasWidth || window.innerWidth) / 2;
            const screenY = (worldY - cameraY) * effectiveZoom + (canvasHeight || window.innerHeight) / 2;

            return { x: screenX, y: screenY };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, effectiveZoom]);

    // Get wall material style
    const getWallMaterialStyle = (wallTypeId) => {
        const wallType = WALL_TYPES[wallTypeId];
        if (!wallType) return { color: '#8B4513' };
        
        switch (wallTypeId) {
            case 'stone_wall':
                return { color: '#696969' };
            case 'wooden_wall':
                return { color: '#8B4513' };
            case 'metal_wall':
                return { color: '#C0C0C0' };
            case 'brick_wall':
                return { color: '#B22222' };
            default:
                return { color: '#8B4513' };
        }
    };

    // Render walls on canvas
    const renderWalls = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // Set canvas size to match container
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Check if wall layer is visible (support both new layer system and legacy showWallLayer)
        const wallLayer = drawingLayers.find(layer => layer.id === 'walls');
        const isWallLayerVisible = (wallLayer && wallLayer.visible) || showWallLayer;

        if (!isWallLayerVisible || !wallData || Object.keys(wallData).length === 0) {
            return;
        }

        // Render walls (logging removed for performance)

        // Calculate visible bounds for performance
        let startX, endX, startY, endY;
        try {
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            const bounds = gridSystem.getVisibleGridBounds(viewport.width, viewport.height);
            startX = bounds.minX - 2;
            endX = bounds.maxX + 2;
            startY = bounds.minY - 2;
            endY = bounds.maxY + 2;
        } catch (error) {
            // Fallback calculation
            startX = Math.floor((cameraX - gridOffsetX) / gridSize) - 5;
            endX = Math.ceil((cameraX + canvas.width / effectiveZoom - gridOffsetX) / gridSize) + 5;
            startY = Math.floor((cameraY - gridOffsetY) / gridSize) - 5;
            endY = Math.ceil((cameraY + canvas.height / effectiveZoom - gridOffsetY) / gridSize) + 5;
        }

        // Get visibility data for FOV-based rendering
        const levelEditorStore = useLevelEditorStore.getState();
        const { isGMMode } = levelEditorStore;
        
        // Convert visibleArea array back to Set for efficient lookup (if it's an array)
        // Use subscribed values for better reactivity
        const visibleAreaSet = visibleArea ? (visibleArea instanceof Set ? visibleArea : new Set(visibleArea)) : null;
        
        // Only apply FOV filtering if:
        // 1. We're viewing from a token (not just editing)
        // 2. We have a visible area set
        // 3. We're NOT in GM mode
        // 4. We're NOT in editor mode (walls should always be visible when editing)
        const shouldFilterByFOV = viewingFromToken && visibleAreaSet && !isGMMode && !isEditorMode;
        
        // Render walls
        Object.entries(wallData).forEach(([wallKey, wallData_item]) => {
            // Handle both old format (string) and new format (object)
            const wallType = typeof wallData_item === 'string' ? wallData_item : wallData_item.type;
            const wallTypeData = WALL_TYPES[wallType];
            if (!wallTypeData) return;

            // Parse wall coordinates from key: "x1,y1,x2,y2"
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

            // Check if wall is in visible bounds
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);

            if (maxX < startX || minX > endX || maxY < startY || minY > endY) {
                return; // Skip walls outside visible area
            }
            
            // Check FOV visibility: only apply when actually viewing from a token (not during editing)
            // A wall is visible if:
            // 1. At least one of its endpoint tiles or tiles it crosses are in visibleArea, OR
            // 2. The wall blocks line of sight to any visible tile (walls obstructing vision should be visible)
            // Note: In GM mode or editor mode, walls should always be visible regardless of FOV
            if (shouldFilterByFOV) {
                // Check if any tile the wall passes through is in the visible area
                let isWallVisible = false;
                
                // Check endpoint tiles
                const tile1Key = `${x1},${y1}`;
                const tile2Key = `${x2},${y2}`;
                if (visibleAreaSet.has(tile1Key) || visibleAreaSet.has(tile2Key)) {
                    isWallVisible = true;
                } else {
                    // Check intermediate tiles along the wall
                    // For horizontal walls, check tiles between x1 and x2
                    // For vertical walls, check tiles between y1 and y2
                    if (x1 === x2) {
                        // Vertical wall
                        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                            const tileKey = `${x1},${y}`;
                            if (visibleAreaSet.has(tileKey)) {
                                isWallVisible = true;
                                break;
                            }
                        }
                    } else if (y1 === y2) {
                        // Horizontal wall
                        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                            const tileKey = `${x},${y1}`;
                            if (visibleAreaSet.has(tileKey)) {
                                isWallVisible = true;
                                break;
                            }
                        }
                    } else {
                        // Diagonal wall - check all tiles along the line
                        const dx = x2 > x1 ? 1 : -1;
                        const dy = y2 > y1 ? 1 : -1;
                        let x = x1;
                        let y = y1;
                        while (x !== x2 || y !== y2) {
                            const tileKey = `${x},${y}`;
                            if (visibleAreaSet.has(tileKey)) {
                                isWallVisible = true;
                                break;
                            }
                            if (x !== x2) x += dx;
                            if (y !== y2) y += dy;
                        }
                    }
                }
                
                // If wall is not directly in visible area, check if it's adjacent to visible tiles
                // Walls that are adjacent to visible tiles are likely blocking line of sight and should be visible
                // This ensures walls obstructing vision are shown even if they're outside the visible area
                if (!isWallVisible) {
                    const wallMinX = Math.min(x1, x2);
                    const wallMaxX = Math.max(x1, x2);
                    const wallMinY = Math.min(y1, y2);
                    const wallMaxY = Math.max(y1, y2);
                    
                    // Check tiles adjacent to the wall - these are tiles that the wall borders
                    const tilesAdjacentToWall = [];
                    
                    if (x1 === x2) {
                        // Vertical wall - check tiles on both sides (left and right)
                        for (let y = wallMinY; y <= wallMaxY; y++) {
                            tilesAdjacentToWall.push(`${x1 - 1},${y}`); // Left side
                            tilesAdjacentToWall.push(`${x1},${y}`);     // Right side
                        }
                    } else if (y1 === y2) {
                        // Horizontal wall - check tiles on both sides (top and bottom)
                        for (let x = wallMinX; x <= wallMaxX; x++) {
                            tilesAdjacentToWall.push(`${x},${y1 - 1}`); // Top side
                            tilesAdjacentToWall.push(`${x},${y1}`);     // Bottom side
                        }
                    } else {
                        // Diagonal wall - check tiles around it
                        const dx = x2 > x1 ? 1 : -1;
                        const dy = y2 > y1 ? 1 : -1;
                        for (let i = 0; i <= Math.abs(x2 - x1); i++) {
                            const x = x1 + (i * dx);
                            const y = y1 + (i * dy);
                            // Check all 8 surrounding tiles
                            for (let dx2 = -1; dx2 <= 1; dx2++) {
                                for (let dy2 = -1; dy2 <= 1; dy2++) {
                                    tilesAdjacentToWall.push(`${x + dx2},${y + dy2}`);
                                }
                            }
                        }
                    }
                    
                    // If wall is adjacent to any visible tile, show it (it's blocking or bordering vision)
                    for (const adjacentTileKey of tilesAdjacentToWall) {
                        if (visibleAreaSet.has(adjacentTileKey)) {
                            isWallVisible = true;
                            break;
                        }
                    }
                }
                
                if (!isWallVisible) {
                    return; // Skip wall - not in visible area and not blocking visible tiles
                }
            }

            // Get screen positions for wall endpoints
            const screenPos1 = gridToScreen(x1, y1, canvas.width, canvas.height);
            const screenPos2 = gridToScreen(x2, y2, canvas.width, canvas.height);

            // Calculate wall thickness based on zoom
            const wallThickness = Math.max(4, gridSize * effectiveZoom * 0.15);
            
            // Get wall material style
            const materialStyle = getWallMaterialStyle(wallType);

            // Set drawing style
            ctx.strokeStyle = materialStyle.color;
            ctx.lineWidth = wallThickness;
            ctx.lineCap = 'square';
            ctx.lineJoin = 'miter';

            // Draw the wall
            ctx.beginPath();
            ctx.moveTo(screenPos1.x, screenPos1.y);
            ctx.lineTo(screenPos2.x, screenPos2.y);
            ctx.stroke();

            // Wall rendered (logging removed for performance)
        });

    }, [wallData, drawingLayers, gridToScreen, effectiveZoom, gridSize, cameraX, cameraY, gridOffsetX, gridOffsetY, showWallLayer, viewingFromToken, visibleArea, isEditorMode]);

    // Throttle wall rendering with RAF for smooth performance during camera movement
    const throttledRenderWallsRef = useRef(null);
    
    // Update throttled function when renderWalls changes
    useEffect(() => {
        throttledRenderWallsRef.current = rafThrottle(renderWalls);
    }, [renderWalls]);
    
    // Trigger render when dependencies change (throttled)
    useEffect(() => {
        if (throttledRenderWallsRef.current) {
            throttledRenderWallsRef.current();
        }
    }, [wallData, drawingLayers, effectiveZoom, gridSize, cameraX, cameraY, gridOffsetX, gridOffsetY, showWallLayer, viewingFromToken, visibleArea, isEditorMode]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (throttledRenderWallsRef.current) {
                throttledRenderWallsRef.current();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="canvas-wall-system"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 8, // Above terrain tiles but below UI elements
                pointerEvents: 'none'
            }}
        />
    );
};

export default CanvasWallSystem;
