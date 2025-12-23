import React, { useRef, useEffect, useCallback } from 'react';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useGameStore from '../../../store/gameStore';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';
import { isPositionVisible } from '../../../utils/VisibilityCalculations';

// Image cache for tile variations
const imageCache = {};

// Grayscale image cache to avoid expensive recalculations
const grayscaleCache = {};

// Professional terrain types with proper grid integration
export const PROFESSIONAL_TERRAIN_TYPES = {
    // Natural Terrain
    grass: {
        id: 'grass',
        name: 'Grass',
        category: 'natural',
        color: '#4a7c59',
        texture: '/assets/terrain/grass.png',
        movementCost: 1,
        description: 'Natural grassland',
        // Multiple tile variations for randomization
        tileVariations: [
            '/assets/tiles/Grass1.png',
            '/assets/tiles/Grass2.png',
            '/assets/tiles/Grass3.png',
            '/assets/tiles/Grass4.png'
        ]
    },
    dirt: {
        id: 'dirt',
        name: 'Dirt',
        category: 'natural',
        color: '#8b6914',
        texture: '/assets/terrain/dirt.png',
        movementCost: 1,
        description: 'Bare earth and soil',
        // Multiple tile variations for randomization
        tileVariations: [
            '/assets/tiles/Dirt1.png',
            '/assets/tiles/Dirt2.png',
            '/assets/tiles/Dirt3.png',
            '/assets/tiles/Dirt4.png'
        ]
    },
    stone: {
        id: 'stone',
        name: 'Stone',
        category: 'natural',
        color: '#6b6b6b',
        texture: '/assets/terrain/stone.png',
        movementCost: 1,
        description: 'Natural stone surface'
    },
    sand: {
        id: 'sand',
        name: 'Sand',
        category: 'natural',
        color: '#c2b280',
        texture: '/assets/terrain/sand.png',
        movementCost: 2,
        description: 'Sandy terrain',
        // Multiple tile variations for randomization
        tileVariations: [
            '/assets/tiles/Sand1.png',
            '/assets/tiles/Sand2.png',
            '/assets/tiles/Sand3.png',
            '/assets/tiles/Sand4.png'
        ]
    },
    water: {
        id: 'water',
        name: 'Water',
        category: 'natural',
        color: '#4682b4',
        texture: '/assets/terrain/water.png',
        movementCost: 4,
        description: 'Water terrain',
        // Multiple tile variations for randomization
        tileVariations: [
            '/assets/tiles/Water1.png',
            '/assets/tiles/Water2.png',
            '/assets/tiles/Water3.png',
            '/assets/tiles/Water4.png'
        ]
    },
    cobblestone: {
        id: 'cobblestone',
        name: 'Cobblestone',
        category: 'natural',
        color: '#8a8a8a',
        texture: '/assets/terrain/cobblestone.png',
        movementCost: 1,
        description: 'Cobblestone path or road',
        // Multiple tile variations for randomization
        tileVariations: [
            '/assets/tiles/Cobble1.png',
            '/assets/tiles/Cobble2.png',
            '/assets/tiles/Cobble3.png',
            '/assets/tiles/Cobble4.png'
        ]
    },
    
    // Dungeon Terrain
    dungeon_floor: {
        id: 'dungeon_floor',
        name: 'Dungeon Floor',
        category: 'dungeon',
        color: '#5a5a5a',
        texture: '/assets/terrain/dungeon_floor.png',
        movementCost: 1,
        description: 'Stone dungeon flooring'
    },
    marble_floor: {
        id: 'marble_floor',
        name: 'Marble Floor',
        category: 'dungeon',
        color: '#f0f0f0',
        texture: '/assets/terrain/marble.png',
        movementCost: 1,
        description: 'Polished marble flooring'
    },
    wooden_floor: {
        id: 'wooden_floor',
        name: 'Wooden Floor',
        category: 'dungeon',
        color: '#8b4513',
        texture: '/assets/terrain/wood.png',
        movementCost: 1,
        description: 'Wooden planked flooring'
    },
    
    // Difficult Terrain
    mud: {
        id: 'mud',
        name: 'Mud',
        category: 'difficult',
        color: '#654321',
        texture: '/assets/terrain/mud.png',
        movementCost: 2,
        description: 'Muddy, difficult terrain'
    },
    swamp: {
        id: 'swamp',
        name: 'Swamp',
        category: 'difficult',
        color: '#556b2f',
        texture: '/assets/terrain/swamp.png',
        movementCost: 3,
        description: 'Swampy, treacherous ground'
    },
    ice: {
        id: 'ice',
        name: 'Ice',
        category: 'difficult',
        color: '#b0e0e6',
        texture: '/assets/terrain/ice.png',
        movementCost: 2,
        description: 'Slippery ice surface'
    },
    
    // Special Terrain
    lava: {
        id: 'lava',
        name: 'Lava',
        category: 'hazard',
        color: '#ff4500',
        texture: '/assets/terrain/lava.png',
        movementCost: 99,
        damage: '2d6 fire',
        description: 'Molten lava - extremely dangerous'
    },
    acid: {
        id: 'acid',
        name: 'Acid Pool',
        category: 'hazard',
        color: '#32cd32',
        texture: '/assets/terrain/acid.png',
        movementCost: 99,
        damage: '1d6 acid',
        description: 'Corrosive acid pool'
    },
    pit: {
        id: 'pit',
        name: 'Pit',
        category: 'hazard',
        color: '#2f2f2f',
        texture: '/assets/terrain/pit.png',
        movementCost: 99,
        description: 'Deep pit or chasm'
    }
};

const TerrainSystem = () => {
    const canvasRef = useRef(null);
    
    // Store connections
    const {
        terrainData,
        isEditorMode,
        activeTool,
        selectedTool,
        toolSettings,
        activeLayer,
        drawingLayers,
        viewingFromToken,
        visibleArea,
        isGMMode
    } = useLevelEditorStore();

    const {
        gridSize,
        gridType,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom
    } = useGameStore();

    // Calculate effective zoom and grid positioning
    const effectiveZoom = zoomLevel * playerZoom;

    // Convert grid coordinates to screen coordinates using the same system as InfiniteGridSystem
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

    // Helper function to check if a point is inside a polygon
    const isPointInPolygon = useCallback((x, y, polygon) => {
        if (!polygon || polygon.length < 3) return false;
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }, []);

    // Helper function to check if a rectangle intersects with a polygon
    const doesRectIntersectPolygon = useCallback((rectX, rectY, rectWidth, rectHeight, polygon) => {
        if (!polygon || polygon.length < 3) return false;
        
        // Check if any corner of the rectangle is inside the polygon
        const corners = [
            { x: rectX, y: rectY },
            { x: rectX + rectWidth, y: rectY },
            { x: rectX + rectWidth, y: rectY + rectHeight },
            { x: rectX, y: rectY + rectHeight }
        ];
        
        for (const corner of corners) {
            if (isPointInPolygon(corner.x, corner.y, polygon)) {
                return true;
            }
        }
        
        // Check if any edge of the polygon intersects the rectangle
        for (let i = 0; i < polygon.length; i++) {
            const p1 = polygon[i];
            const p2 = polygon[(i + 1) % polygon.length];
            
            // Check if polygon edge intersects rectangle
            if (lineIntersectsRect(p1.x, p1.y, p2.x, p2.y, rectX, rectY, rectWidth, rectHeight)) {
                return true;
            }
        }
        
        return false;
    }, [isPointInPolygon]);

    // Helper function to check if a rectangle is fully contained in a polygon
    const isRectFullyInPolygon = useCallback((rectX, rectY, rectWidth, rectHeight, polygon) => {
        if (!polygon || polygon.length < 3) return false;
        
        // Check if all corners are inside the polygon
        const corners = [
            { x: rectX, y: rectY },
            { x: rectX + rectWidth, y: rectY },
            { x: rectX + rectWidth, y: rectY + rectHeight },
            { x: rectX, y: rectY + rectHeight }
        ];
        
        for (const corner of corners) {
            if (!isPointInPolygon(corner.x, corner.y, polygon)) {
                return false;
            }
        }
        
        return true;
    }, [isPointInPolygon]);

    // Helper function to check if a line segment intersects a rectangle
    const lineIntersectsRect = useCallback((x1, y1, x2, y2, rectX, rectY, rectWidth, rectHeight) => {
        // Check if line segment is completely outside rectangle
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        
        if (maxX < rectX || minX > rectX + rectWidth || maxY < rectY || minY > rectY + rectHeight) {
            return false;
        }
        
        // Check if line segment intersects any edge of the rectangle
        const rectEdges = [
            { x1: rectX, y1: rectY, x2: rectX + rectWidth, y2: rectY },
            { x1: rectX + rectWidth, y1: rectY, x2: rectX + rectWidth, y2: rectY + rectHeight },
            { x1: rectX + rectWidth, y1: rectY + rectHeight, x2: rectX, y2: rectY + rectHeight },
            { x1: rectX, y1: rectY + rectHeight, x2: rectX, y2: rectY }
        ];
        
        for (const edge of rectEdges) {
            if (lineSegmentsIntersect(x1, y1, x2, y2, edge.x1, edge.y1, edge.x2, edge.y2)) {
                return true;
            }
        }
        
        return false;
    }, []);

    // Helper function to check if two line segments intersect
    const lineSegmentsIntersect = useCallback((x1, y1, x2, y2, x3, y3, x4, y4) => {
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denom === 0) return false;
        
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
        
        return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    }, []);

    // Helper function to create a grayscale version of an image (cached for performance)
    const createGrayscaleImage = useCallback((img, width, height, cacheKey) => {
        // Use cache key to avoid recalculating same image
        if (cacheKey && grayscaleCache[cacheKey]) {
            return grayscaleCache[cacheKey];
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Cache the result
        if (cacheKey) {
            grayscaleCache[cacheKey] = canvas;
        }
        
        return canvas;
    }, []);

    // Render terrain on canvas
    const renderTerrain = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // Get valid dimensions - use window size as fallback if rect is invalid
        const width = rect.width > 0 ? rect.width : (window.innerWidth || 1920);
        const height = rect.height > 0 ? rect.height : (window.innerHeight || 1080);
        
        // Don't render if canvas dimensions are still invalid
        if (width <= 0 || height <= 0) {
            return;
        }
        
        // Set canvas size to match container
        canvas.width = width;
        canvas.height = height;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Check if terrain layer is visible
        const terrainLayer = drawingLayers.find(layer => layer.id === 'terrain');
        if (!terrainLayer || !terrainLayer.visible) {
            // Clear the canvas if terrain is hidden
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        // Always render terrain if we have terrain data (visible even when editor is closed)
        if (!terrainData || Object.keys(terrainData).length === 0) return;

        // Calculate visible grid bounds for performance using the grid system
        // FIXED: Add padding to render partial tiles at viewport edges (prevents empty tiles)
        const VIEWPORT_PADDING = 2; // Extra tiles to render at edges
        let startX, endX, startY, endY;
        try {
            const gridSystem = getGridSystem();
            // Use consistent viewport dimensions that account for editor panel
            const viewport = gridSystem.getViewportDimensions();
            const bounds = gridSystem.getVisibleGridBounds(viewport.width, viewport.height);
            // Add padding to show partial tiles at edges
            startX = bounds.minX - VIEWPORT_PADDING;
            endX = bounds.maxX + VIEWPORT_PADDING;
            startY = bounds.minY - VIEWPORT_PADDING;
            endY = bounds.maxY + VIEWPORT_PADDING;
        } catch (error) {
            // Fallback calculation with padding
            startX = Math.floor((cameraX - gridOffsetX) / gridSize) - 2 - VIEWPORT_PADDING;
            endX = Math.ceil((cameraX + canvas.width / effectiveZoom - gridOffsetX) / gridSize) + 2 + VIEWPORT_PADDING;
            startY = Math.floor((cameraY - gridOffsetY) / gridSize) - 2 - VIEWPORT_PADDING;
            endY = Math.ceil((cameraY + canvas.height / effectiveZoom - gridOffsetY) / gridSize) + 2 + VIEWPORT_PADDING;
        }

        // Check grid type
        const currentGridType = gridType || 'square';
        const gridSystem = getGridSystem();
        
        // Render terrain tiles
        if (currentGridType === 'hex') {
            // Hex grid rendering
            const sqrt3 = Math.sqrt(3);
            const hexRadius = gridSize / sqrt3; // Radius for proper tiling (no gaps)
            
            // Calculate hex bounds by converting viewport corners to hex coordinates
            const viewportLeft = cameraX - canvas.width / effectiveZoom / 2;
            const viewportRight = cameraX + canvas.width / effectiveZoom / 2;
            const viewportTop = cameraY - canvas.height / effectiveZoom / 2;
            const viewportBottom = cameraY + canvas.height / effectiveZoom / 2;
            
            const topLeftHex = gridSystem.worldToHex(viewportLeft, viewportTop);
            const topRightHex = gridSystem.worldToHex(viewportRight, viewportTop);
            const bottomLeftHex = gridSystem.worldToHex(viewportLeft, viewportBottom);
            const bottomRightHex = gridSystem.worldToHex(viewportRight, viewportBottom);
            
            // Find min/max q and r values with padding to ensure full coverage
            // FIXED: Add extra padding to show partial hexes at viewport edges (prevents empty tiles)
            const VIEWPORT_PADDING = 2; // Extra hexes to render at edges
            const hexStartQ = Math.min(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q) - 2 - VIEWPORT_PADDING;
            const hexEndQ = Math.max(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q) + 2 + VIEWPORT_PADDING;
            const hexStartR = Math.min(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r) - 2 - VIEWPORT_PADDING;
            const hexEndR = Math.max(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r) + 2 + VIEWPORT_PADDING;
            
            for (let q = hexStartQ; q <= hexEndQ; q++) {
                for (let r = hexStartR; r <= hexEndR; r++) {
                    const tileKey = `${q},${r}`;
                    const terrainData_tile = terrainData[tileKey];

                    // Handle both old format (string) and new format (object with type and variation)
                    let terrainType, variationIndex;
                    if (typeof terrainData_tile === 'string') {
                        terrainType = terrainData_tile;
                        variationIndex = 0;
                    } else if (terrainData_tile && typeof terrainData_tile === 'object') {
                        terrainType = terrainData_tile.type;
                        variationIndex = terrainData_tile.variation || 0;
                    } else {
                        continue; // No terrain data for this hex
                    }

                    const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];
                    if (!terrain) continue;

                    // CRITICAL: In GM mode, always show all terrain regardless of token visibility
                    if (!isGMMode && viewingFromToken && visibleArea) {
                        const visibleAreaSet = visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
                        
                        // Check if this hex is in the visible area OR explored area
                        // FIXED: Always render explored hexes (they'll be dimmed by fog overlay)
                        const isVisible = visibleAreaSet.has(tileKey);
                        
                        if (!isVisible) {
                            // Check if hex is explored - if so, still render it (but it will be dimmed by fog)
                            const levelEditorStore = useLevelEditorStore.getState();
                            const worldPos = gridSystem.hexToWorld(q, r);
                            
                            // FIXED: Check both circle/polygon explored areas AND tile-based explored areas
                            let isExplored = false;
                            if (levelEditorStore.isPositionExplored) {
                                isExplored = levelEditorStore.isPositionExplored(worldPos.x, worldPos.y);
                            }
                            // Also check tile-based explored areas as fallback
                            if (!isExplored) {
                                isExplored = levelEditorStore.exploredAreas[tileKey] || false;
                            }
                            
                            if (!isExplored) {
                                continue; // Skip rendering this hex - not visible and not explored
                            }
                        }
                    }

                    // Get hex center position
                    const worldPos = gridSystem.hexToWorld(q, r);
                    const screenPos = gridSystem.worldToScreen(worldPos.x, worldPos.y, canvas.width, canvas.height);
                    const hexRadiusScreen = hexRadius * effectiveZoom;

                    // Get hex corners for clipping
                    const corners = gridSystem.getHexCorners(screenPos.x, screenPos.y, hexRadiusScreen);

                    // Render terrain on hex
                    if (terrain.tileVariations && terrain.tileVariations.length > 0) {
                        const tileVariationPath = terrain.tileVariations[variationIndex] || terrain.tileVariations[0];
                        
                        if (!imageCache[tileVariationPath]) {
                            const img = new Image();
                            img.onload = () => renderTerrain();
                            img.onerror = (error) => console.error('🎨 Failed to load terrain tile:', tileVariationPath, error);
                            img.src = tileVariationPath;
                            imageCache[tileVariationPath] = img;
                        }

                        const img = imageCache[tileVariationPath];
                        if (img.complete && img.naturalWidth > 0) {
                            // Create hex clipping path
                            ctx.save();
                            ctx.beginPath();
                            ctx.moveTo(corners[0].x, corners[0].y);
                            for (let i = 1; i < corners.length; i++) {
                                ctx.lineTo(corners[i].x, corners[i].y);
                            }
                            ctx.closePath();
                            ctx.clip();

                            // Fill background
                            ctx.globalAlpha = 1.0;
                            if (terrainType === 'cobblestone') {
                                ctx.fillStyle = '#2a2a2a';
                            } else if (terrainType === 'grass') {
                                ctx.fillStyle = '#3a5a3a';
                            } else if (terrainType === 'dirt') {
                                ctx.fillStyle = '#4a3a2a';
                            } else if (terrainType === 'water') {
                                ctx.fillStyle = '#1a2a4a';
                            } else if (terrainType === 'sand') {
                                ctx.fillStyle = '#4a4a2a';
                            } else {
                                ctx.fillStyle = '#2a2a2a';
                            }
                            
                            // Fill hex shape
                            ctx.beginPath();
                            ctx.moveTo(corners[0].x, corners[0].y);
                            for (let i = 1; i < corners.length; i++) {
                                ctx.lineTo(corners[i].x, corners[i].y);
                            }
                            ctx.closePath();
                            ctx.fill();

                            // Draw image stretched to hex bounding box
                            const hexBounds = {
                                minX: Math.min(...corners.map(c => c.x)),
                                maxX: Math.max(...corners.map(c => c.x)),
                                minY: Math.min(...corners.map(c => c.y)),
                                maxY: Math.max(...corners.map(c => c.y))
                            };
                            
                            ctx.globalAlpha = 1.0;
                            ctx.drawImage(
                                img,
                                hexBounds.minX,
                                hexBounds.minY,
                                hexBounds.maxX - hexBounds.minX,
                                hexBounds.maxY - hexBounds.minY
                            );

                            ctx.restore();

                            // Draw hex border
                            ctx.globalAlpha = 0.8;
                            ctx.strokeStyle = '#000000';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(corners[0].x, corners[0].y);
                            for (let i = 1; i < corners.length; i++) {
                                ctx.lineTo(corners[i].x, corners[i].y);
                            }
                            ctx.closePath();
                            ctx.stroke();
                        } else {
                            // Fallback to color
                            ctx.globalAlpha = 0.7;
                            ctx.fillStyle = terrain.color;
                            ctx.beginPath();
                            ctx.moveTo(corners[0].x, corners[0].y);
                            for (let i = 1; i < corners.length; i++) {
                                ctx.lineTo(corners[i].x, corners[i].y);
                            }
                            ctx.closePath();
                            ctx.fill();
                        }
                    } else {
                        // Standard terrain rendering for hex
                        ctx.globalAlpha = 0.7;
                        ctx.fillStyle = terrain.color;
                        ctx.beginPath();
                        ctx.moveTo(corners[0].x, corners[0].y);
                        for (let i = 1; i < corners.length; i++) {
                            ctx.lineTo(corners[i].x, corners[i].y);
                        }
                        ctx.closePath();
                        ctx.fill();

                        // Add border
                        ctx.globalAlpha = 0.6;
                        ctx.strokeStyle = terrain.color;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }

                    ctx.globalAlpha = 1.0;
                }
            }
        } else {
            // Square grid rendering (original behavior)
            for (let gridX = startX; gridX <= endX; gridX++) {
                for (let gridY = startY; gridY <= endY; gridY++) {
                    const tileKey = `${gridX},${gridY}`;
                    const terrainData_tile = terrainData[tileKey];

                    // Handle both old format (string) and new format (object with type and variation)
                    let terrainType, variationIndex;
                    if (typeof terrainData_tile === 'string') {
                        terrainType = terrainData_tile;
                        variationIndex = 0;
                    } else if (terrainData_tile && typeof terrainData_tile === 'object') {
                        terrainType = terrainData_tile.type;
                        variationIndex = terrainData_tile.variation || 0;
                    } else {
                        continue; // No terrain data for this tile
                    }

                    const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];
                    if (!terrain) continue;

                    // Use window dimensions for coordinate conversion to match tokens/items positioning
                    const screenPos = gridToScreen(gridX, gridY, window.innerWidth, window.innerHeight);
                    const tileSize = gridSize * effectiveZoom;

                    // Use corner position directly (no centering needed since gridToScreen now uses corner)
                    const tileX = screenPos.x;
                    const tileY = screenPos.y;

                    // PERFORMANCE: Skip expensive partial visibility checks during camera drag
                    // Check if camera is dragging using window flag (avoids re-renders)
                    const isDraggingCamera = window._isDraggingCamera || false;
                    
                    // Check for partial visibility (only in player mode when viewing from token, and not dragging)
                    let isPartiallyVisible = false;
                    let visibilityPolygon = null;
                    if (!isGMMode && viewingFromToken && !isDraggingCamera) {
                        const levelEditorStore = useLevelEditorStore.getState();
                        visibilityPolygon = levelEditorStore.visibilityPolygon;
                        
                        if (visibilityPolygon && visibilityPolygon.length > 0) {
                            // PERFORMANCE: Quick bounding box check to skip tiles clearly outside visibility
                            // Calculate polygon bounding box in screen coordinates
                            let polyMinX = Infinity, polyMaxX = -Infinity;
                            let polyMinY = Infinity, polyMaxY = -Infinity;
                            for (const p of visibilityPolygon) {
                                const screenX = (p.x - cameraX) * effectiveZoom + width / 2;
                                const screenY = (p.y - cameraY) * effectiveZoom + height / 2;
                                polyMinX = Math.min(polyMinX, screenX);
                                polyMaxX = Math.max(polyMaxX, screenX);
                                polyMinY = Math.min(polyMinY, screenY);
                                polyMaxY = Math.max(polyMaxY, screenY);
                            }
                            
                            // Quick reject: if tile is completely outside polygon bounding box, skip
                            const tileRight = tileX + tileSize;
                            const tileBottom = tileY + tileSize;
                            if (tileRight < polyMinX || tileX > polyMaxX || tileBottom < polyMinY || tileY > polyMaxY) {
                                isPartiallyVisible = false;
                            } else {
                                // PERFORMANCE: Use simplified check - only check tile center and corners
                                // This is much faster than full polygon intersection
                                const tileCenterX = tileX + tileSize / 2;
                                const tileCenterY = tileY + tileSize / 2;
                                
                                // Convert polygon to screen coordinates (only if tile might intersect)
                                const screenPolygon = visibilityPolygon.map(p => {
                                    const screenX = (p.x - cameraX) * effectiveZoom + width / 2;
                                    const screenY = (p.y - cameraY) * effectiveZoom + height / 2;
                                    return { x: screenX, y: screenY };
                                });
                                
                                // Quick check: if center is in polygon, tile is fully visible
                                const centerInPolygon = isPointInPolygon(tileCenterX, tileCenterY, screenPolygon);
                                if (centerInPolygon) {
                                    // Tile is fully visible, skip partial visibility rendering
                                    isPartiallyVisible = false;
                                } else {
                                    // Check if any corner is in polygon (partial visibility)
                                    const corners = [
                                        { x: tileX, y: tileY },
                                        { x: tileX + tileSize, y: tileY },
                                        { x: tileX + tileSize, y: tileY + tileSize },
                                        { x: tileX, y: tileY + tileSize }
                                    ];
                                    let cornersInPolygon = 0;
                                    for (const corner of corners) {
                                        if (isPointInPolygon(corner.x, corner.y, screenPolygon)) {
                                            cornersInPolygon++;
                                        }
                                    }
                                    // Partial visibility if some but not all corners are in polygon
                                    isPartiallyVisible = cornersInPolygon > 0 && cornersInPolygon < 4;
                                }
                            }
                        }
                    }

                    // CRITICAL: In GM mode, always show all terrain regardless of token visibility
                    // Only apply visibility filtering in player mode when viewing from a token
                    if (!isGMMode && viewingFromToken && visibleArea && !isPartiallyVisible) {
                        // Convert visibleArea array to Set for efficient lookup (if needed)
                        const visibleAreaSet = visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
                        
                        // Check if this tile is in the visible area OR explored area
                        // FIXED: Always render explored tiles (they'll be dimmed by fog overlay)
                        const isVisible = visibleAreaSet.has(tileKey);
                        
                        if (!isVisible) {
                            // Check if tile is explored - if so, still render it (but it will be dimmed by fog)
                            const levelEditorStore = useLevelEditorStore.getState();
                            const worldX = (gridX * gridSize) + gridOffsetX + (gridSize / 2);
                            const worldY = (gridY * gridSize) + gridOffsetY + (gridSize / 2);
                            
                            // FIXED: Check both circle/polygon explored areas AND tile-based explored areas
                            let isExplored = false;
                            if (levelEditorStore.isPositionExplored) {
                                isExplored = levelEditorStore.isPositionExplored(worldX, worldY);
                            }
                            // Also check tile-based explored areas as fallback
                            if (!isExplored) {
                                isExplored = levelEditorStore.exploredAreas[tileKey] || false;
                            }
                            
                            if (!isExplored) {
                                continue; // Skip rendering this tile - not visible and not explored
                            }
                        }
                    }
                    // In GM mode or if partially visible, continue rendering all terrain tiles



                // Check if this terrain has tile variations (like cobblestone)
                if (terrain.tileVariations && terrain.tileVariations.length > 0) {
                    // Render actual PNG tile variation
                    const tileVariationPath = terrain.tileVariations[variationIndex] || terrain.tileVariations[0];

                    // Create and cache image if not already loaded
                    if (!imageCache[tileVariationPath]) {
                        const img = new Image();
                        img.onload = () => {
                            // Re-render when image loads
                            renderTerrain();
                        };
                        img.onerror = (error) => {
                            console.error('🎨 Failed to load terrain tile:', tileVariationPath, error);
                        };
                        img.src = tileVariationPath;

                        imageCache[tileVariationPath] = img;
                    }

                    const img = imageCache[tileVariationPath];
                    if (img.complete && img.naturalWidth > 0) {
                        // First draw a background fill to cover transparent areas
                        ctx.globalAlpha = 1.0;

                        // Choose background color based on terrain type
                        if (terrainType === 'cobblestone') {
                            ctx.fillStyle = '#2a2a2a'; // Dark gray background for cobblestone mortar/border color
                        } else if (terrainType === 'grass') {
                            ctx.fillStyle = '#3a5a3a'; // Dark green background for grass
                        } else if (terrainType === 'dirt') {
                            ctx.fillStyle = '#4a3a2a'; // Dark brown background for dirt
                        } else if (terrainType === 'water') {
                            ctx.fillStyle = '#1a2a4a'; // Dark blue background for water
                        } else if (terrainType === 'sand') {
                            ctx.fillStyle = '#4a4a2a'; // Dark tan background for sand
                        } else {
                            ctx.fillStyle = '#2a2a2a'; // Default dark background
                        }

                        ctx.fillRect(
                            tileX,
                            tileY,
                            tileSize,
                            tileSize
                        );

                        // Handle partial visibility: render full tile, then apply grayscale to non-visible portion
                        // PERFORMANCE: Skip expensive partial visibility rendering during camera drag
                        if (isPartiallyVisible && visibilityPolygon && !isDraggingCamera) {
                            // Convert polygon to screen coordinates
                            const screenPolygon = visibilityPolygon.map(p => {
                                const screenX = (p.x - cameraX) * effectiveZoom + width / 2;
                                const screenY = (p.y - cameraY) * effectiveZoom + height / 2;
                                return { x: screenX, y: screenY };
                            });
                            
                            // Translate polygon points to tile-relative coordinates
                            const tilePolygon = screenPolygon.map(p => ({
                                x: p.x - tileX,
                                y: p.y - tileY
                            }));
                            
                            // Create a temporary canvas for compositing
                            const tileCanvas = document.createElement('canvas');
                            tileCanvas.width = tileSize;
                            tileCanvas.height = tileSize;
                            const tileCtx = tileCanvas.getContext('2d');
                            
                            // Step 1: Draw grayscale version of entire tile (this will be the base)
                            // Use cache key based on image source to avoid recalculating
                            const grayscaleCacheKey = `${tileVariationPath}_${tileSize}`;
                            const grayscaleCanvas = createGrayscaleImage(img, tileSize, tileSize, grayscaleCacheKey);
                            tileCtx.drawImage(grayscaleCanvas, 0, 0);
                            
                            // Step 2: Draw colored version only in the visible area (inside polygon)
                            tileCtx.save();
                            tileCtx.beginPath();
                            tileCtx.moveTo(tilePolygon[0].x, tilePolygon[0].y);
                            for (let i = 1; i < tilePolygon.length; i++) {
                                tileCtx.lineTo(tilePolygon[i].x, tilePolygon[i].y);
                            }
                            tileCtx.closePath();
                            tileCtx.clip(); // Clip to visible area
                            tileCtx.drawImage(img, 0, 0, tileSize, tileSize); // Draw colored version
                            tileCtx.restore();
                            
                            // Draw the composited tile to the main canvas
                            ctx.globalAlpha = 1.0;
                            ctx.drawImage(tileCanvas, tileX, tileY);
                        } else {
                            // Normal rendering: draw the actual tile image
                            ctx.globalAlpha = 1.0;
                            ctx.drawImage(
                                img,
                                tileX,
                                tileY,
                                tileSize,
                                tileSize
                            );
                        }

                        // Add slim black border for water, sand, grass, dirt, and cobblestone tiles to improve visual definition
                        if (terrainType === 'water' || terrainType === 'sand' || terrainType === 'grass' || terrainType === 'dirt' || terrainType === 'cobblestone') {
                            ctx.globalAlpha = 0.8;
                            ctx.strokeStyle = '#000000'; // Black border
                            ctx.lineWidth = 1;
                            ctx.strokeRect(
                                tileX,
                                tileY,
                                tileSize,
                                tileSize
                            );
                        }


                    } else {
                        // Fallback to color while image loads
                        ctx.fillStyle = terrain.color;
                        ctx.globalAlpha = 0.7;
                        ctx.fillRect(tileX, tileY, tileSize, tileSize);

                    }
                } else {
                    // Standard terrain rendering (existing logic)
                    // PERFORMANCE: Skip expensive partial visibility for color-only terrain during drag
                    // Color-only terrain is simpler, so partial visibility is less critical
                    if (isPartiallyVisible && visibilityPolygon && !isDraggingCamera) {
                        // Convert polygon to screen coordinates
                        const screenPolygon = visibilityPolygon.map(p => {
                            const screenX = (p.x - cameraX) * effectiveZoom + width / 2;
                            const screenY = (p.y - cameraY) * effectiveZoom + height / 2;
                            return { x: screenX, y: screenY };
                        });
                        
                        // Translate polygon points to tile-relative coordinates
                        const tilePolygon = screenPolygon.map(p => ({
                            x: p.x - tileX,
                            y: p.y - tileY
                        }));
                        
                        // Create a temporary canvas for compositing
                        const tileCanvas = document.createElement('canvas');
                        tileCanvas.width = tileSize;
                        tileCanvas.height = tileSize;
                        const tileCtx = tileCanvas.getContext('2d');
                        
                        // Step 1: Draw grayscale version of entire tile (base)
                        // Convert color to grayscale
                        const colorMatch = terrain.color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
                        if (colorMatch) {
                            const r = parseInt(colorMatch[1], 16);
                            const g = parseInt(colorMatch[2], 16);
                            const b = parseInt(colorMatch[3], 16);
                            const gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
                            const grayColor = `rgb(${gray}, ${gray}, ${gray})`;
                            tileCtx.fillStyle = grayColor;
                            tileCtx.globalAlpha = 0.7;
                            tileCtx.fillRect(0, 0, tileSize, tileSize);
                        } else {
                            tileCtx.fillStyle = terrain.color;
                            tileCtx.globalAlpha = 0.7;
                            tileCtx.fillRect(0, 0, tileSize, tileSize);
                            // Apply grayscale filter
                            const imageData = tileCtx.getImageData(0, 0, tileSize, tileSize);
                            const data = imageData.data;
                            for (let i = 0; i < data.length; i += 4) {
                                const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                                data[i] = gray;
                                data[i + 1] = gray;
                                data[i + 2] = gray;
                            }
                            tileCtx.putImageData(imageData, 0, 0);
                        }
                        
                        // Step 2: Draw colored version only in the visible area (inside polygon)
                        tileCtx.save();
                        tileCtx.beginPath();
                        tileCtx.moveTo(tilePolygon[0].x, tilePolygon[0].y);
                        for (let i = 1; i < tilePolygon.length; i++) {
                            tileCtx.lineTo(tilePolygon[i].x, tilePolygon[i].y);
                        }
                        tileCtx.closePath();
                        tileCtx.clip(); // Clip to visible area
                        tileCtx.fillStyle = terrain.color;
                        tileCtx.globalAlpha = 0.7;
                        tileCtx.fillRect(0, 0, tileSize, tileSize);
                        
                        // Add texture pattern if available
                        if (terrain.texture) {
                            tileCtx.globalAlpha = 0.2;
                            tileCtx.fillStyle = createTerrainPattern(tileCtx, terrain);
                            tileCtx.fillRect(0, 0, tileSize, tileSize);
                        }
                        tileCtx.restore();
                        
                        // Draw the composited tile to the main canvas
                        ctx.globalAlpha = 1.0;
                        ctx.drawImage(tileCanvas, tileX, tileY);
                    } else {
                        // Normal rendering
                        ctx.fillStyle = terrain.color;
                        ctx.globalAlpha = 0.7; // Slightly reduced opacity to prevent over-saturation
                        ctx.fillRect(
                            tileX,
                            tileY,
                            tileSize,
                            tileSize
                        );

                        // Add texture pattern if available (but don't overlap with base color)
                        if (terrain.texture) {
                            // Reset alpha for texture pattern
                            ctx.globalAlpha = 0.2;
                            ctx.fillStyle = createTerrainPattern(ctx, terrain);
                            ctx.fillRect(
                                tileX,
                                tileY,
                                tileSize,
                                tileSize
                            );
                        }
                    }

                    // Add border for better visibility
                    ctx.globalAlpha = 0.6;
                    ctx.strokeStyle = terrain.color;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(
                        tileX,
                        tileY,
                        tileSize,
                        tileSize
                    );
                }

                    // Reset alpha
                    ctx.globalAlpha = 1.0;
                }
            }
        }
    }, [terrainData, drawingLayers, activeLayer, isEditorMode, gridToScreen, effectiveZoom, gridSize, gridType, cameraX, cameraY, gridOffsetX, gridOffsetY, viewingFromToken, visibleArea, isGMMode, isPointInPolygon, doesRectIntersectPolygon, isRectFullyInPolygon, createGrayscaleImage]);

    // Create terrain pattern for visual variety
    const createTerrainPattern = (ctx, terrain) => {
        switch (terrain.category) {
            case 'natural':
                return createNaturalPattern(ctx, terrain);
            case 'dungeon':
                return createDungeonPattern(ctx, terrain);
            case 'difficult':
                return createDifficultPattern(ctx, terrain);
            case 'hazard':
                return createHazardPattern(ctx, terrain);
            default:
                return terrain.color;
        }
    };

    const createNaturalPattern = (ctx, terrain) => {
        // Create subtle natural patterns
        const gradient = ctx.createLinearGradient(0, 0, 10, 10);
        gradient.addColorStop(0, terrain.color);
        gradient.addColorStop(1, adjustBrightness(terrain.color, 0.1));
        return gradient;
    };

    const createDungeonPattern = (ctx, terrain) => {
        // Create stone/brick patterns
        const gradient = ctx.createLinearGradient(0, 0, 20, 20);
        gradient.addColorStop(0, terrain.color);
        gradient.addColorStop(0.5, adjustBrightness(terrain.color, -0.1));
        gradient.addColorStop(1, terrain.color);
        return gradient;
    };

    const createDifficultPattern = (ctx, terrain) => {
        // Create rough, uneven patterns
        const gradient = ctx.createRadialGradient(5, 5, 0, 5, 5, 10);
        gradient.addColorStop(0, adjustBrightness(terrain.color, 0.2));
        gradient.addColorStop(1, adjustBrightness(terrain.color, -0.2));
        return gradient;
    };

    const createHazardPattern = (ctx, terrain) => {
        // Create warning/danger patterns
        const gradient = ctx.createLinearGradient(0, 0, 15, 15);
        gradient.addColorStop(0, terrain.color);
        gradient.addColorStop(0.5, adjustBrightness(terrain.color, 0.3));
        gradient.addColorStop(1, terrain.color);
        return gradient;
    };

    // Utility function to adjust color brightness
    const adjustBrightness = (color, amount) => {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount * 255));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount * 255));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount * 255));
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    };

    // FIXED: Use RAF for smooth terrain rendering - no throttling to prevent floating
    const scheduledRenderRef = useRef(null);
    
    // Update canvas when dependencies change using RAF (no artificial throttling)
    useEffect(() => {
        // Cancel any pending render
        if (scheduledRenderRef.current) {
            cancelAnimationFrame(scheduledRenderRef.current);
        }
        
        // Schedule render for next frame - this naturally caps at 60fps
        scheduledRenderRef.current = requestAnimationFrame(() => {
            renderTerrain();
            scheduledRenderRef.current = null;
        });
        
        return () => {
            if (scheduledRenderRef.current) {
                cancelAnimationFrame(scheduledRenderRef.current);
                scheduledRenderRef.current = null;
            }
        };
    }, [renderTerrain, cameraX, cameraY, effectiveZoom, gridOffsetX, gridOffsetY]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            renderTerrain();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [renderTerrain]);

    return (
        <canvas
            ref={canvasRef}
            className="terrain-system-canvas"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2, // Lower z-index so fog overlay (z-index 300-500) appears above terrain
                pointerEvents: 'none'
            }}
        />
    );
};

export default TerrainSystem;
