import React, { useRef, useEffect, useCallback } from 'react';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useGameStore from '../../../store/gameStore';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';
import { isPositionVisible } from '../../../utils/VisibilityCalculations';

// Image cache for tile variations
const imageCache = {};

// Grayscale image cache to avoid expensive recalculations
const grayscaleCache = {};

// Texture cache for procedurally generated terrain textures
// Key format: `${terrainId}_${gridX}_${gridY}_${tileSize}`
const textureCache = {};
const MAX_TEXTURE_CACHE_SIZE = 2000; // Limit cache to prevent memory issues

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

    // Helper to convert hex to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 107, g: 107, b: 107 };
    };
    
    // Helper to adjust RGB brightness
    const adjustRgbBrightness = (rgb, amount) => {
        return {
            r: Math.max(0, Math.min(255, rgb.r + amount * 255)),
            g: Math.max(0, Math.min(255, rgb.g + amount * 255)),
            b: Math.max(0, Math.min(255, rgb.b + amount * 255))
        };
    };

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
                            // Fallback to textured color
                            ctx.save();
                            ctx.globalAlpha = 0.7;
                            ctx.beginPath();
                            ctx.moveTo(corners[0].x, corners[0].y);
                            for (let i = 1; i < corners.length; i++) {
                                ctx.lineTo(corners[i].x, corners[i].y);
                            }
                            ctx.closePath();
                            ctx.clip();
                            const hexBounds = {
                                minX: Math.min(...corners.map(c => c.x)),
                                maxX: Math.max(...corners.map(c => c.x)),
                                minY: Math.min(...corners.map(c => c.y)),
                                maxY: Math.max(...corners.map(c => c.y))
                            };
                            drawTerrainTexture(ctx, terrain, hexBounds.minX, hexBounds.minY, 
                                hexBounds.maxX - hexBounds.minX, hexBounds.maxY - hexBounds.minY, q, r);
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
                        }
                    } else {
                        // Standard terrain rendering for hex with texture
                        ctx.save();
                        // Pit needs full opacity to show all its depth effects properly
                        ctx.globalAlpha = terrainType === 'pit' ? 1.0 : 0.7;
                        ctx.beginPath();
                        ctx.moveTo(corners[0].x, corners[0].y);
                        for (let i = 1; i < corners.length; i++) {
                            ctx.lineTo(corners[i].x, corners[i].y);
                        }
                        ctx.closePath();
                        ctx.clip();
                        const hexBounds = {
                            minX: Math.min(...corners.map(c => c.x)),
                            maxX: Math.max(...corners.map(c => c.x)),
                            minY: Math.min(...corners.map(c => c.y)),
                            maxY: Math.max(...corners.map(c => c.y))
                        };
                        drawTerrainTexture(ctx, terrain, hexBounds.minX, hexBounds.minY, 
                            hexBounds.maxX - hexBounds.minX, hexBounds.maxY - hexBounds.minY);
                        ctx.restore();

                        // Add border
                        // Pit needs a more visible border to show depth
                        if (terrainType === 'pit') {
                            ctx.globalAlpha = 0.8;
                            const edgeColor = adjustRgbBrightness(terrain.color, 0.1);
                            ctx.strokeStyle = `rgb(${edgeColor.r}, ${edgeColor.g}, ${edgeColor.b})`;
                            ctx.lineWidth = 1.5;
                        } else {
                            ctx.globalAlpha = 0.6;
                            ctx.strokeStyle = terrain.color;
                            ctx.lineWidth = 1;
                        }
                        ctx.beginPath();
                        ctx.moveTo(corners[0].x, corners[0].y);
                        for (let i = 1; i < corners.length; i++) {
                            ctx.lineTo(corners[i].x, corners[i].y);
                        }
                        ctx.closePath();
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
                        // Fallback to textured color while image loads
                        ctx.globalAlpha = 0.7;
                        drawTerrainTexture(ctx, terrain, tileX, tileY, tileSize, tileSize, gridX, gridY);
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
                        
                        // Step 2: Draw textured version only in the visible area (inside polygon)
                        tileCtx.save();
                        tileCtx.beginPath();
                        tileCtx.moveTo(tilePolygon[0].x, tilePolygon[0].y);
                        for (let i = 1; i < tilePolygon.length; i++) {
                            tileCtx.lineTo(tilePolygon[i].x, tilePolygon[i].y);
                        }
                        tileCtx.closePath();
                        tileCtx.clip(); // Clip to visible area
                        // Pit needs full opacity to show all its depth effects properly
                        tileCtx.globalAlpha = terrainType === 'pit' ? 1.0 : 0.7;
                        drawTerrainTexture(tileCtx, terrain, 0, 0, tileSize, tileSize, gridX, gridY);
                        tileCtx.restore();
                        
                        // Draw the composited tile to the main canvas
                        ctx.globalAlpha = 1.0;
                        ctx.drawImage(tileCanvas, tileX, tileY);
                    } else {
                        // Normal rendering with texture
                        // Pit needs full opacity to show all its depth effects properly
                        if (terrainType === 'pit') {
                            ctx.globalAlpha = 1.0;
                        } else {
                            ctx.globalAlpha = 0.7; // Slightly reduced opacity to prevent over-saturation
                        }
                        drawTerrainTexture(ctx, terrain, tileX, tileY, tileSize, tileSize, gridX, gridY);
                    }

                    // Add border for better visibility
                    // Pit needs a more visible border to show depth
                    if (terrainType === 'pit') {
                        ctx.globalAlpha = 0.8;
                        // Use a slightly lighter edge color for pit to show the rim
                        const edgeColor = adjustRgbBrightness(terrain.color, 0.1);
                        ctx.strokeStyle = `rgb(${edgeColor.r}, ${edgeColor.g}, ${edgeColor.b})`;
                        ctx.lineWidth = 1.5;
                    } else {
                        ctx.globalAlpha = 0.6;
                        ctx.strokeStyle = terrain.color;
                        ctx.lineWidth = 1;
                    }
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

    // Seeded random number generator for deterministic textures
    const seededRandom = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };
    
    // Get or create cached texture for a tile
    const getCachedTexture = (terrainId, gridX, gridY, tileSize) => {
        // Create cache key
        const cacheKey = `${terrainId}_${gridX}_${gridY}_${Math.round(tileSize)}`;
        
        // Return cached texture if available
        if (textureCache[cacheKey]) {
            return textureCache[cacheKey];
        }
        
        // Clean cache if it's too large (FIFO - remove oldest entries)
        const cacheKeys = Object.keys(textureCache);
        if (cacheKeys.length >= MAX_TEXTURE_CACHE_SIZE) {
            // Remove oldest 20% of cache
            const toRemove = cacheKeys.slice(0, Math.floor(cacheKeys.length * 0.2));
            toRemove.forEach(key => delete textureCache[key]);
        }
        
        // Generate new texture on offscreen canvas
        const terrainData = PROFESSIONAL_TERRAIN_TYPES[terrainId];
        if (!terrainData) return null;
        
        const color = terrainData.color;
        const baseColor = hexToRgb(color);
        const seedBase = (gridX * 73856093) ^ (gridY * 19349663);
        
        // Create offscreen canvas for texture
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = tileSize;
        textureCanvas.height = tileSize;
        const textureCtx = textureCanvas.getContext('2d');
        
        // Generate texture based on terrain type
        switch (terrainId) {
            case 'stone':
                drawStoneTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'grass':
                drawGrassTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'dirt':
                drawDirtTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'sand':
                drawSandTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'water':
                drawWaterTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'cobblestone':
                drawCobblestoneTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'dungeon_floor':
                drawDungeonFloorTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'marble_floor':
                drawMarbleTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'wooden_floor':
                drawWoodTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'mud':
                drawMudTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'swamp':
                drawSwampTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'ice':
                drawIceTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'lava':
                drawLavaTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'acid':
                drawAcidTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'pit':
                drawPitTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            default:
                // Fallback to simple fill
                textureCtx.fillStyle = color;
                textureCtx.fillRect(0, 0, tileSize, tileSize);
        }
        
        // Cache and return
        textureCache[cacheKey] = textureCanvas;
        return textureCanvas;
    };
    
    // Draw detailed terrain texture on canvas (uses cache for performance)
    const drawTerrainTexture = (ctx, terrain, x, y, width, height, gridX = null, gridY = null) => {
        const terrainId = terrain.id || terrain;
        const terrainData = typeof terrain === 'string' ? PROFESSIONAL_TERRAIN_TYPES[terrain] : terrain;
        if (!terrainData) return;
        
        // If we have grid coordinates, use cached texture (much faster)
        if (gridX !== null && gridY !== null) {
            const cachedTexture = getCachedTexture(terrainId, gridX, gridY, width);
            if (cachedTexture) {
                ctx.drawImage(cachedTexture, x, y, width, height);
                return;
            }
        }
        
        // Fallback: generate texture on-the-fly (slower, but works for edge cases)
        const color = terrainData.color;
        const baseColor = hexToRgb(color);
        
        // Use grid coordinates for seed, or fallback to screen coordinates
        const seedBase = gridX !== null && gridY !== null 
            ? (gridX * 73856093) ^ (gridY * 19349663)
            : (Math.floor(x / width) * 73856093) ^ (Math.floor(y / height) * 19349663);
        
        ctx.save();
        
        switch (terrainId) {
            case 'stone':
                drawStoneTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'grass':
                drawGrassTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'dirt':
                drawDirtTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'sand':
                drawSandTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'water':
                drawWaterTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'cobblestone':
                drawCobblestoneTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'dungeon_floor':
                drawDungeonFloorTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'marble_floor':
                drawMarbleTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'wooden_floor':
                drawWoodTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'mud':
                drawMudTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'swamp':
                drawSwampTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'ice':
                drawIceTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'lava':
                drawLavaTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'acid':
                drawAcidTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            case 'pit':
                drawPitTexture(ctx, baseColor, x, y, width, height, seedBase);
                break;
            default:
                // Fallback to simple fill
                ctx.fillStyle = color;
                ctx.fillRect(x, y, width, height);
        }
        
        ctx.restore();
    };
    
    // Stone texture - natural stone surface with subtle texture
    const drawStoneTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add subtle color variation across the surface
        const variationCount = Math.min(15, Math.max(5, Math.floor(w * h / 150)));
        for (let i = 0; i < variationCount; i++) {
            const rand1 = seededRandom(seed + i * 0.2);
            const rand2 = seededRandom(seed + i * 0.2 + 0.01);
            const rand3 = seededRandom(seed + i * 0.2 + 0.02);
            const rand4 = seededRandom(seed + i * 0.2 + 0.03);
            
            const px = x + rand1 * w;
            const py = y + rand2 * h;
            const size = 4 + rand3 * 8;
            const variation = adjustRgbBrightness(baseColor, -0.08 + rand4 * 0.12);
            
            ctx.fillStyle = `rgba(${variation.r}, ${variation.g}, ${variation.b}, ${0.35 + rand1 * 0.25})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add subtle rocky texture with small irregular spots
        const spotCount = Math.min(30, Math.max(10, Math.floor(w * h / 80)));
        for (let i = 0; i < spotCount; i++) {
            const rand1 = seededRandom(seed + i * 0.15);
            const rand2 = seededRandom(seed + i * 0.15 + 0.01);
            const rand3 = seededRandom(seed + i * 0.15 + 0.02);
            const rand4 = seededRandom(seed + i * 0.15 + 0.03);
            const rand5 = seededRandom(seed + i * 0.15 + 0.04);
            
            const px = x + rand1 * w;
            const py = y + rand2 * h;
            const size = 1.5 + rand3 * 3;
            const dark = adjustRgbBrightness(baseColor, -0.15 - rand4 * 0.1);
            const light = adjustRgbBrightness(baseColor, 0.08 + rand5 * 0.08);
            
            // Draw subtle stone spot
            ctx.fillStyle = `rgba(${dark.r}, ${dark.g}, ${dark.b}, ${0.4 + rand1 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Subtle highlight
            ctx.fillStyle = `rgba(${light.r}, ${light.g}, ${light.b}, ${0.2 + rand2 * 0.2})`;
            ctx.beginPath();
            ctx.arc(px - size * 0.3, py - size * 0.3, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add fine grain texture
        const grainCount = Math.min(50, Math.max(15, Math.floor(w * h / 40)));
        for (let i = 0; i < grainCount; i++) {
            const rand1 = seededRandom(seed + i * 0.18 + 100);
            const rand2 = seededRandom(seed + i * 0.18 + 100.01);
            const rand3 = seededRandom(seed + i * 0.18 + 100.02);
            const rand4 = seededRandom(seed + i * 0.18 + 100.03);
            
            const px = x + rand1 * w;
            const py = y + rand2 * h;
            const size = 0.5 + rand3 * 1.2;
            const grain = adjustRgbBrightness(baseColor, -0.1 + rand4 * 0.12);
            
            ctx.fillStyle = `rgba(${grain.r}, ${grain.g}, ${grain.b}, ${0.35 + rand1 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Grass texture - organic, varied
    const drawGrassTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add grass blades and organic variation with seeded randomness - cap for performance
        const bladeCount = Math.min(50, Math.max(5, Math.floor(w * h / 100)));
        for (let i = 0; i < bladeCount; i++) {
            const r1 = seededRandom(seed + i * 0.1);
            const r2 = seededRandom(seed + i * 0.1 + 0.01);
            const r3 = seededRandom(seed + i * 0.1 + 0.02);
            const r4 = seededRandom(seed + i * 0.1 + 0.03);
            const r5 = seededRandom(seed + i * 0.1 + 0.04);
            const r6 = seededRandom(seed + i * 0.1 + 0.05);
            const r7 = seededRandom(seed + i * 0.1 + 0.06);
            const r8 = seededRandom(seed + i * 0.1 + 0.07);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const length = 2 + r3 * 4;
            const angle = r4 * Math.PI * 2;
            const dark = adjustRgbBrightness(baseColor, -0.1 - r5 * 0.1);
            const light = adjustRgbBrightness(baseColor, 0.15 + r6 * 0.1);
            
            ctx.strokeStyle = `rgba(${dark.r}, ${dark.g}, ${dark.b}, ${0.5 + r7 * 0.3})`;
            ctx.lineWidth = 0.5 + r8 * 0.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + Math.cos(angle) * length, py + Math.sin(angle) * length);
            ctx.stroke();
            
            // Add highlights
            if (r1 > 0.7) {
                const r9 = seededRandom(seed + i * 0.1 + 0.08);
                const r10 = seededRandom(seed + i * 0.1 + 0.09);
                ctx.fillStyle = `rgba(${light.r}, ${light.g}, ${light.b}, ${0.3 + r9 * 0.2})`;
                ctx.beginPath();
                ctx.arc(px, py, 1 + r10 * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    };
    
    // Dirt texture - earthy, granular
    const drawDirtTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add granular dirt particles with seeded randomness - cap for performance
        const particleCount = Math.min(100, Math.max(10, Math.floor(w * h / 15)));
        for (let i = 0; i < particleCount; i++) {
            const r1 = seededRandom(seed + i * 0.1);
            const r2 = seededRandom(seed + i * 0.1 + 0.01);
            const r3 = seededRandom(seed + i * 0.1 + 0.02);
            const r4 = seededRandom(seed + i * 0.1 + 0.03);
            const r5 = seededRandom(seed + i * 0.1 + 0.04);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 0.5 + r3 * 1.5;
            const variation = adjustRgbBrightness(baseColor, -0.2 + r4 * 0.3);
            
            ctx.fillStyle = `rgba(${variation.r}, ${variation.g}, ${variation.b}, ${0.6 + r5 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Sand texture - fine, grainy
    const drawSandTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add fine sand grains with seeded randomness - cap for performance
        const grainCount = Math.min(150, Math.max(15, Math.floor(w * h / 8)));
        for (let i = 0; i < grainCount; i++) {
            const r1 = seededRandom(seed + i * 0.1);
            const r2 = seededRandom(seed + i * 0.1 + 0.01);
            const r3 = seededRandom(seed + i * 0.1 + 0.02);
            const r4 = seededRandom(seed + i * 0.1 + 0.03);
            const r5 = seededRandom(seed + i * 0.1 + 0.04);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 0.3 + r3 * 0.7;
            const variation = adjustRgbBrightness(baseColor, -0.15 + r4 * 0.2);
            
            ctx.fillStyle = `rgba(${variation.r}, ${variation.g}, ${variation.b}, ${0.7 + r5 * 0.2})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Water texture - wavy, fluid
    const drawWaterTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add wave patterns with seeded randomness
        const waveCount = Math.floor(w / 8);
        for (let i = 0; i < waveCount; i++) {
            const waveY = y + (i / waveCount) * h;
            const light = adjustRgbBrightness(baseColor, 0.2);
            const dark = adjustRgbBrightness(baseColor, -0.15);
            const r1 = seededRandom(seed + i * 0.1);
            
            ctx.strokeStyle = `rgba(${light.r}, ${light.g}, ${light.b}, ${0.3 + r1 * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let j = 0; j < w; j += 2) {
                const waveOffset = Math.sin((j / w) * Math.PI * 4 + i) * 2;
                if (j === 0) ctx.moveTo(x + j, waveY + waveOffset);
                else ctx.lineTo(x + j, waveY + waveOffset);
            }
            ctx.stroke();
        }
        
        // Add highlights with seeded randomness
        for (let i = 0; i < 5; i++) {
            const r1 = seededRandom(seed + i * 0.2);
            const r2 = seededRandom(seed + i * 0.2 + 0.01);
            const r3 = seededRandom(seed + i * 0.2 + 0.02);
            const r4 = seededRandom(seed + i * 0.2 + 0.03);
            const r5 = seededRandom(seed + i * 0.2 + 0.04);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const light = adjustRgbBrightness(baseColor, 0.3);
            ctx.fillStyle = `rgba(${light.r}, ${light.g}, ${light.b}, ${0.2 + r3 * 0.2})`;
            ctx.beginPath();
            ctx.ellipse(px, py, 3 + r4 * 2, 1 + r5, r1 * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Cobblestone texture - block pattern
    const drawCobblestoneTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Draw cobblestone blocks
        const blockSize = Math.max(4, w / 6);
        const dark = adjustRgbBrightness(baseColor, -0.25);
        const light = adjustRgbBrightness(baseColor, 0.15);
        
        for (let by = y; by < y + h; by += blockSize * 0.8) {
            for (let bx = x; bx < x + w; bx += blockSize) {
                const offset = (by % (blockSize * 1.6) < blockSize * 0.8) ? 0 : blockSize * 0.5;
                const blockX = bx + offset;
                const blockY = by;
                
                // Block shadow
                ctx.fillStyle = `rgba(${dark.r}, ${dark.g}, ${dark.b}, 0.6)`;
                ctx.fillRect(blockX, blockY, blockSize * 0.9, blockSize * 0.9);
                
                // Block highlight
                ctx.fillStyle = `rgba(${light.r}, ${light.g}, ${light.b}, 0.3)`;
                ctx.fillRect(blockX + blockSize * 0.1, blockY + blockSize * 0.1, blockSize * 0.3, blockSize * 0.3);
            }
        }
    };
    
    // Dungeon floor texture - cut/man-made stone, more regular than natural stone
    const drawDungeonFloorTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill - slightly darker than natural stone
        const baseVariation = adjustRgbBrightness(baseColor, -0.08);
        ctx.fillStyle = `rgb(${baseVariation.r}, ${baseVariation.g}, ${baseVariation.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Draw cut stone blocks with mortar lines - more regular pattern
        const blockSize = Math.max(6, w / 4);
        const dark = adjustRgbBrightness(baseColor, -0.25);
        const light = adjustRgbBrightness(baseColor, 0.12);
        const mortar = adjustRgbBrightness(baseColor, -0.35);
        
        // Draw mortar lines (grid pattern)
        ctx.strokeStyle = `rgba(${mortar.r}, ${mortar.g}, ${mortar.b}, 0.6)`;
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let bx = x; bx < x + w; bx += blockSize) {
            ctx.beginPath();
            ctx.moveTo(bx, y);
            ctx.lineTo(bx, y + h);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let by = y; by < y + h; by += blockSize) {
            ctx.beginPath();
            ctx.moveTo(x, by);
            ctx.lineTo(x + w, by);
            ctx.stroke();
        }
        
        // Add subtle variation to each block
        const blocksX = Math.ceil(w / blockSize);
        const blocksY = Math.ceil(h / blockSize);
        
        for (let by = 0; by < blocksY; by++) {
            for (let bx = 0; bx < blocksX; bx++) {
                const blockSeed = seed + (by * blocksX + bx) * 0.1;
                const r1 = seededRandom(blockSeed);
                const r2 = seededRandom(blockSeed + 0.01);
                
                const blockX = x + bx * blockSize;
                const blockY = y + by * blockSize;
                
                // Subtle block variation (much less than natural stone)
                const blockVariation = adjustRgbBrightness(baseVariation, -0.05 + (r1 - 0.5) * 0.1);
                ctx.fillStyle = `rgba(${blockVariation.r}, ${blockVariation.g}, ${blockVariation.b}, ${0.3 + r2 * 0.2})`;
                ctx.fillRect(blockX + 1, blockY + 1, blockSize - 2, blockSize - 2);
            }
        }
    };
    
    // Marble texture - veined pattern
    const drawMarbleTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add marble veins with seeded randomness
        const dark = adjustRgbBrightness(baseColor, -0.2);
        const light = adjustRgbBrightness(baseColor, 0.1);
        
        for (let i = 0; i < 3; i++) {
            const r1 = seededRandom(seed + i * 0.3);
            const r2 = seededRandom(seed + i * 0.3 + 0.01);
            const r3 = seededRandom(seed + i * 0.3 + 0.02);
            const r4 = seededRandom(seed + i * 0.3 + 0.03);
            const r5 = seededRandom(seed + i * 0.3 + 0.04);
            
            const startX = x + r1 * w;
            const startY = y + r2 * h;
            const endX = x + r3 * w;
            const endY = y + r4 * h;
            
            ctx.strokeStyle = `rgba(${dark.r}, ${dark.g}, ${dark.b}, ${0.3 + r5 * 0.2})`;
            ctx.lineWidth = 1 + r1 * 2;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            for (let j = 0; j <= 10; j++) {
                const t = j / 10;
                const r6 = seededRandom(seed + i * 0.3 + j * 0.01);
                const r7 = seededRandom(seed + i * 0.3 + j * 0.01 + 0.001);
                const px = startX + (endX - startX) * t + (r6 - 0.5) * 5;
                const py = startY + (endY - startY) * t + (r7 - 0.5) * 5;
                ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
        
        // Add highlights with seeded randomness
        for (let i = 0; i < 5; i++) {
            const r1 = seededRandom(seed + i * 0.2);
            const r2 = seededRandom(seed + i * 0.2 + 0.01);
            const r3 = seededRandom(seed + i * 0.2 + 0.02);
            const r4 = seededRandom(seed + i * 0.2 + 0.03);
            const r5 = seededRandom(seed + i * 0.2 + 0.04);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            ctx.fillStyle = `rgba(${light.r}, ${light.g}, ${light.b}, ${0.2 + r3 * 0.2})`;
            ctx.beginPath();
            ctx.ellipse(px, py, 4 + r4 * 3, 2 + r5, r1 * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Wood texture - plank pattern (horizontal planks)
    const drawWoodTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Draw horizontal planks with seeded randomness
        const dark = adjustRgbBrightness(baseColor, -0.15);
        const light = adjustRgbBrightness(baseColor, 0.1);
        const darker = adjustRgbBrightness(baseColor, -0.25);
        const plankHeight = Math.max(3, h / 6); // Each plank is about 1/6 of height
        
        let plankIndex = 0;
        for (let plankY = y; plankY < y + h; plankY += plankHeight) {
            const currentPlankHeight = Math.min(plankHeight, (y + h) - plankY);
            const r1 = seededRandom(seed + plankIndex * 0.1);
            const plankVariation = adjustRgbBrightness(baseColor, -0.05 + (r1 - 0.5) * 0.1);
            
            // Plank base color with slight variation
            ctx.fillStyle = `rgb(${plankVariation.r}, ${plankVariation.g}, ${plankVariation.b})`;
            ctx.fillRect(x, plankY, w, currentPlankHeight);
            
            // Plank shadow (bottom edge)
            ctx.fillStyle = `rgba(${darker.r}, ${darker.g}, ${darker.b}, 0.4)`;
            ctx.fillRect(x, plankY + currentPlankHeight - 1, w, 1);
            
            // Plank highlight (top edge)
            ctx.fillStyle = `rgba(${light.r}, ${light.g}, ${light.b}, 0.3)`;
            ctx.fillRect(x, plankY, w, 1);
            
            // Subtle wood grain lines within each plank (horizontal, slightly wavy)
            const r2 = seededRandom(seed + plankIndex * 0.1 + 0.01);
            ctx.strokeStyle = `rgba(${dark.r}, ${dark.g}, ${dark.b}, ${0.2 + r2 * 0.15})`;
            ctx.lineWidth = 0.3;
            let grainY = plankY + 2;
            let grainIndex = 0;
            while (grainY < plankY + currentPlankHeight - 2) {
                const r3 = seededRandom(seed + plankIndex * 0.1 + grainIndex * 0.01);
                ctx.beginPath();
                ctx.moveTo(x, grainY);
                for (let grainX = x; grainX < x + w; grainX += 4) {
                    const waveOffset = Math.sin((grainX / w) * Math.PI * 4) * 0.3;
                    ctx.lineTo(grainX, grainY + waveOffset);
                }
                ctx.stroke();
                grainY += 2 + r3 * 2;
                grainIndex++;
            }
            plankIndex++;
        }
    };
    
    // Mud texture - earthy, dirt-like with stones and mud blobs
    const drawMudTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill - darker, more saturated
        const baseVariation = adjustRgbBrightness(baseColor, -0.1);
        ctx.fillStyle = `rgb(${baseVariation.r}, ${baseVariation.g}, ${baseVariation.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add embedded stones/rocks (similar to dirt texture but larger)
        const stoneCount = Math.min(30, Math.max(8, Math.floor(w * h / 80)));
        for (let i = 0; i < stoneCount; i++) {
            const r1 = seededRandom(seed + i * 0.1);
            const r2 = seededRandom(seed + i * 0.1 + 0.01);
            const r3 = seededRandom(seed + i * 0.1 + 0.02);
            const r4 = seededRandom(seed + i * 0.1 + 0.03);
            const r5 = seededRandom(seed + i * 0.1 + 0.04);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 1.5 + r3 * 3;
            // Stones in mud are darker
            const stoneColor = adjustRgbBrightness(baseColor, -0.3 + r4 * 0.15);
            
            ctx.fillStyle = `rgba(${stoneColor.r}, ${stoneColor.g}, ${stoneColor.b}, ${0.6 + r5 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add thick, sticky mud blobs with seeded randomness
        const blobCount = Math.min(35, Math.max(8, Math.floor(w * h / 60)));
        for (let i = 0; i < blobCount; i++) {
            const r1 = seededRandom(seed + i * 0.12 + 50);
            const r2 = seededRandom(seed + i * 0.12 + 50.01);
            const r3 = seededRandom(seed + i * 0.12 + 50.02);
            const r4 = seededRandom(seed + i * 0.12 + 50.03);
            const r5 = seededRandom(seed + i * 0.12 + 50.04);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 2 + r3 * 4;
            // Mud blobs are slightly lighter/darker variations
            const variation = adjustRgbBrightness(baseColor, -0.15 + r4 * 0.2);
            
            ctx.fillStyle = `rgba(${variation.r}, ${variation.g}, ${variation.b}, ${0.65 + r5 * 0.25})`;
            ctx.beginPath();
            // Slightly irregular shape
            ctx.ellipse(px, py, size, size * (0.8 + r1 * 0.2), r2 * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add fine granular dirt particles
        const particleCount = Math.min(60, Math.max(15, Math.floor(w * h / 25)));
        for (let i = 0; i < particleCount; i++) {
            const r1 = seededRandom(seed + i * 0.15 + 200);
            const r2 = seededRandom(seed + i * 0.15 + 200.01);
            const r3 = seededRandom(seed + i * 0.15 + 200.02);
            const r4 = seededRandom(seed + i * 0.15 + 200.03);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 0.4 + r3 * 1.2;
            const variation = adjustRgbBrightness(baseColor, -0.12 + r4 * 0.18);
            
            ctx.fillStyle = `rgba(${variation.r}, ${variation.g}, ${variation.b}, ${0.5 + r1 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Swamp texture
    const drawSwampTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add murky, organic patterns with seeded randomness - cap for performance
        const patternCount = Math.min(50, Math.max(5, Math.floor(w * h / 40)));
        for (let i = 0; i < patternCount; i++) {
            const r1 = seededRandom(seed + i * 0.1);
            const r2 = seededRandom(seed + i * 0.1 + 0.01);
            const r3 = seededRandom(seed + i * 0.1 + 0.02);
            const r4 = seededRandom(seed + i * 0.1 + 0.03);
            const r5 = seededRandom(seed + i * 0.1 + 0.04);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 3 + r3 * 5;
            const variation = adjustRgbBrightness(baseColor, -0.15 + r4 * 0.15);
            
            ctx.fillStyle = `rgba(${variation.r}, ${variation.g}, ${variation.b}, ${0.5 + r5 * 0.3})`;
            ctx.beginPath();
            ctx.ellipse(px, py, size, size * 0.7, r1 * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Ice texture - smooth, reflective
    const drawIceTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add smooth highlights and cracks with seeded randomness
        const light = adjustRgbBrightness(baseColor, 0.25);
        for (let i = 0; i < 8; i++) {
            const r1 = seededRandom(seed + i * 0.2);
            const r2 = seededRandom(seed + i * 0.2 + 0.01);
            const r3 = seededRandom(seed + i * 0.2 + 0.02);
            const r4 = seededRandom(seed + i * 0.2 + 0.03);
            const r5 = seededRandom(seed + i * 0.2 + 0.04);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            ctx.fillStyle = `rgba(${light.r}, ${light.g}, ${light.b}, ${0.2 + r3 * 0.2})`;
            ctx.beginPath();
            ctx.ellipse(px, py, 3 + r4 * 4, 1 + r5 * 2, r1 * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add subtle cracks with seeded randomness
        const dark = adjustRgbBrightness(baseColor, -0.1);
        for (let i = 0; i < 3; i++) {
            const r1 = seededRandom(seed + i * 0.3);
            const r2 = seededRandom(seed + i * 0.3 + 0.01);
            const r3 = seededRandom(seed + i * 0.3 + 0.02);
            const r4 = seededRandom(seed + i * 0.3 + 0.03);
            const r5 = seededRandom(seed + i * 0.3 + 0.04);
            
            ctx.strokeStyle = `rgba(${dark.r}, ${dark.g}, ${dark.b}, ${0.3 + r1 * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x + r2 * w, y + r3 * h);
            ctx.lineTo(x + r4 * w, y + r5 * h);
            ctx.stroke();
        }
    };
    
    // Lava texture - molten, glowing with better visual effects
    const drawLavaTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill with slight variation
        const baseVariation = adjustRgbBrightness(baseColor, -0.05);
        ctx.fillStyle = `rgb(${baseVariation.r}, ${baseVariation.g}, ${baseVariation.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add flowing lava patterns (wavy lines)
        const bright = adjustRgbBrightness(baseColor, 0.25);
        const darker = adjustRgbBrightness(baseColor, -0.15);
        
        // Create flowing patterns
        for (let i = 0; i < 4; i++) {
            const r1 = seededRandom(seed + i * 0.2);
            const r2 = seededRandom(seed + i * 0.2 + 0.01);
            const waveY = y + r1 * h;
            
            ctx.strokeStyle = `rgba(${bright.r}, ${bright.g}, ${bright.b}, ${0.4 + r2 * 0.3})`;
            ctx.lineWidth = 2 + r1 * 3;
            ctx.beginPath();
            for (let j = 0; j < w; j += 3) {
                const waveOffset = Math.sin((j / w) * Math.PI * 6 + i * 2) * 3;
                if (j === 0) ctx.moveTo(x + j, waveY + waveOffset);
                else ctx.lineTo(x + j, waveY + waveOffset);
            }
            ctx.stroke();
        }
        
        // Add glowing embers and hot spots with seeded randomness
        const veryBright = adjustRgbBrightness(baseColor, 0.4);
        const emberCount = Math.min(20, Math.max(8, Math.floor(w * h / 100)));
        for (let i = 0; i < emberCount; i++) {
            const r1 = seededRandom(seed + i * 0.1);
            const r2 = seededRandom(seed + i * 0.1 + 0.01);
            const r3 = seededRandom(seed + i * 0.1 + 0.02);
            const r4 = seededRandom(seed + i * 0.1 + 0.03);
            const r5 = seededRandom(seed + i * 0.1 + 0.04);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 2 + r3 * 5;
            
            // Outer glow (largest)
            ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${0.3 + r4 * 0.2})`;
            ctx.beginPath();
            ctx.arc(px, py, size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Middle glow
            ctx.fillStyle = `rgba(${bright.r}, ${bright.g}, ${bright.b}, ${0.5 + r5 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, size * 1.2, 0, Math.PI * 2);
            ctx.fill();
            
            // Bright center
            ctx.fillStyle = `rgba(${veryBright.r}, ${veryBright.g}, ${veryBright.b}, ${0.9 + r1 * 0.1})`;
            ctx.beginPath();
            ctx.arc(px, py, size * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add darker cooling areas
        for (let i = 0; i < 8; i++) {
            const r1 = seededRandom(seed + i * 0.15 + 100);
            const r2 = seededRandom(seed + i * 0.15 + 100.01);
            const r3 = seededRandom(seed + i * 0.15 + 100.02);
            const r4 = seededRandom(seed + i * 0.15 + 100.03);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 3 + r3 * 6;
            
            ctx.fillStyle = `rgba(${darker.r}, ${darker.g}, ${darker.b}, ${0.4 + r4 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Acid texture - bubbling, corrosive with better visual effects
    const drawAcidTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill with slight variation
        const baseVariation = adjustRgbBrightness(baseColor, -0.05);
        ctx.fillStyle = `rgb(${baseVariation.r}, ${baseVariation.g}, ${baseVariation.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add swirling patterns (acid movement)
        const bright = adjustRgbBrightness(baseColor, 0.2);
        const dark = adjustRgbBrightness(baseColor, -0.15);
        
        // Create swirling patterns
        for (let i = 0; i < 3; i++) {
            const r1 = seededRandom(seed + i * 0.3);
            const r2 = seededRandom(seed + i * 0.3 + 0.01);
            const centerX = x + r1 * w;
            const centerY = y + r2 * h;
            
            ctx.strokeStyle = `rgba(${bright.r}, ${bright.g}, ${bright.b}, ${0.3 + r2 * 0.2})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let angle = 0; angle < Math.PI * 4; angle += 0.2) {
                const radius = 5 + angle * 2;
                const px = centerX + Math.cos(angle) * radius;
                const py = centerY + Math.sin(angle) * radius;
                if (angle === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
        
        // Add bubbles of various sizes with seeded randomness
        const bubbleCount = Math.min(30, Math.max(12, Math.floor(w * h / 80)));
        for (let i = 0; i < bubbleCount; i++) {
            const r1 = seededRandom(seed + i * 0.1);
            const r2 = seededRandom(seed + i * 0.1 + 0.01);
            const r3 = seededRandom(seed + i * 0.1 + 0.02);
            const r4 = seededRandom(seed + i * 0.1 + 0.03);
            const r5 = seededRandom(seed + i * 0.1 + 0.04);
            const r6 = seededRandom(seed + i * 0.1 + 0.05);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 1.5 + r3 * 4;
            
            // Bubble outer ring (if larger bubble)
            if (size > 2.5) {
                ctx.strokeStyle = `rgba(${bright.r}, ${bright.g}, ${bright.b}, ${0.4 + r4 * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Bubble body
            ctx.fillStyle = `rgba(${bright.r}, ${bright.g}, ${bright.b}, ${0.5 + r4 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, size * 0.8, 0, Math.PI * 2);
            ctx.fill();
            
            // Bubble highlight (top-left)
            ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + r5 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px - size * 0.25, py - size * 0.25, size * 0.35, 0, Math.PI * 2);
            ctx.fill();
            
            // Small inner highlight
            ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + r6 * 0.2})`;
            ctx.beginPath();
            ctx.arc(px - size * 0.2, py - size * 0.2, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add darker corrosive areas
        for (let i = 0; i < 6; i++) {
            const r1 = seededRandom(seed + i * 0.2 + 200);
            const r2 = seededRandom(seed + i * 0.2 + 200.01);
            const r3 = seededRandom(seed + i * 0.2 + 200.02);
            const r4 = seededRandom(seed + i * 0.2 + 200.03);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 2 + r3 * 4;
            
            ctx.fillStyle = `rgba(${dark.r}, ${dark.g}, ${dark.b}, ${0.35 + r4 * 0.25})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Pit texture - deep, dark void with better depth perception
    const drawPitTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill - start with base color (not too dark)
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);
        
        // Add depth with radial gradient (darker in center, lighter at edges for contrast)
        const centerX = x + w/2;
        const centerY = y + h/2;
        const maxRadius = Math.max(w, h) / 2;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        
        // Create more contrast - very dark center, but lighter edges
        const darkest = adjustRgbBrightness(baseColor, -0.4);
        const veryDark = adjustRgbBrightness(baseColor, -0.25);
        const dark = adjustRgbBrightness(baseColor, -0.1);
        const edgeColor = adjustRgbBrightness(baseColor, 0.05); // Slightly lighter at edges
        
        gradient.addColorStop(0, `rgba(${darkest.r}, ${darkest.g}, ${darkest.b}, 1.0)`);
        gradient.addColorStop(0.4, `rgba(${veryDark.r}, ${veryDark.g}, ${veryDark.b}, 0.95)`);
        gradient.addColorStop(0.7, `rgba(${dark.r}, ${dark.g}, ${dark.b}, 0.85)`);
        gradient.addColorStop(0.9, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.75)`);
        gradient.addColorStop(1, `rgba(${edgeColor.r}, ${edgeColor.g}, ${edgeColor.b}, 0.7)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
        
        // Add depth variation with darker spots (void pockets)
        for (let i = 0; i < 12; i++) {
            const r1 = seededRandom(seed + i * 0.1);
            const r2 = seededRandom(seed + i * 0.1 + 0.01);
            const r3 = seededRandom(seed + i * 0.1 + 0.02);
            const r4 = seededRandom(seed + i * 0.1 + 0.03);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 1.5 + r3 * 3;
            const voidDark = adjustRgbBrightness(baseColor, -0.45);
            ctx.fillStyle = `rgba(${voidDark.r}, ${voidDark.g}, ${voidDark.b}, ${0.6 + r4 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add visible edge highlights to suggest depth (rim lighting)
        const edgeLight = adjustRgbBrightness(baseColor, 0.15);
        ctx.strokeStyle = `rgba(${edgeLight.r}, ${edgeLight.g}, ${edgeLight.b}, 0.6)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        
        // Add inner edge highlight for more depth
        const innerEdge = adjustRgbBrightness(baseColor, 0.05);
        ctx.strokeStyle = `rgba(${innerEdge.r}, ${innerEdge.g}, ${innerEdge.b}, 0.4)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
        
        // Add shadowy wisps
        for (let i = 0; i < 6; i++) {
            const r1 = seededRandom(seed + i * 0.2 + 100);
            const r2 = seededRandom(seed + i * 0.2 + 100.01);
            const r3 = seededRandom(seed + i * 0.2 + 100.02);
            const r4 = seededRandom(seed + i * 0.2 + 100.03);
            const r5 = seededRandom(seed + i * 0.2 + 100.04);
            
            const startX = x + r1 * w;
            const startY = y + r2 * h;
            const endX = x + r3 * w;
            const endY = y + r4 * h;
            
            const wispDark = adjustRgbBrightness(baseColor, -0.2);
            ctx.strokeStyle = `rgba(${wispDark.r}, ${wispDark.g}, ${wispDark.b}, ${0.4 + r5 * 0.3})`;
            ctx.lineWidth = 1 + r1 * 1.5;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        
        // Add some texture variation spots
        for (let i = 0; i < 8; i++) {
            const r1 = seededRandom(seed + i * 0.15 + 200);
            const r2 = seededRandom(seed + i * 0.15 + 200.01);
            const r3 = seededRandom(seed + i * 0.15 + 200.02);
            const r4 = seededRandom(seed + i * 0.15 + 200.03);
            
            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 2 + r3 * 4;
            const textureDark = adjustRgbBrightness(baseColor, -0.3);
            ctx.fillStyle = `rgba(${textureDark.r}, ${textureDark.g}, ${textureDark.b}, ${0.35 + r4 * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Legacy pattern function for compatibility
    const createTerrainPattern = (ctx, terrain) => {
        // Return a pattern that will be used with drawTerrainTexture
        return terrain.color;
    };

    // Utility function to adjust color brightness
    const adjustBrightness = (color, amount) => {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount * 255));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount * 255));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount * 255));
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    };

    // FIXED: Use RAF for smooth terrain rendering with debounce to prevent excessive redraws
    const scheduledRenderRef = useRef(null);
    const terrainDebounceRef = useRef(null);
    const lastZoomRef = useRef(effectiveZoom);
    
    // Separate effect for terrain data changes - debounced to prevent redraws during active drawing
    useEffect(() => {
        // Clear any existing debounce timer
        if (terrainDebounceRef.current) {
            clearTimeout(terrainDebounceRef.current);
        }
        
        // Debounce terrain redraws - only redraw after 150ms of no terrain changes
        // This prevents redrawing on every single tile paint during brush strokes
        terrainDebounceRef.current = setTimeout(() => {
            // Cancel any pending render
            if (scheduledRenderRef.current) {
                cancelAnimationFrame(scheduledRenderRef.current);
            }
            
            // Schedule render for next frame
            scheduledRenderRef.current = requestAnimationFrame(() => {
                renderTerrain();
                scheduledRenderRef.current = null;
            });
        }, 150); // 150ms debounce - balances responsiveness with performance
        
        return () => {
            if (terrainDebounceRef.current) {
                clearTimeout(terrainDebounceRef.current);
            }
        };
    }, [terrainData, renderTerrain]);
    
    // Update canvas when camera/view changes (immediate, no debounce needed)
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
    }, [cameraX, cameraY, effectiveZoom, gridOffsetX, gridOffsetY, renderTerrain]);
    
    // Clear texture cache when zoom changes significantly (to regenerate at new size)
    useEffect(() => {
        const zoomChange = Math.abs(effectiveZoom - lastZoomRef.current) / lastZoomRef.current;
        // If zoom changed by more than 20%, clear texture cache
        if (zoomChange > 0.2) {
            Object.keys(textureCache).forEach(key => delete textureCache[key]);
            lastZoomRef.current = effectiveZoom;
        }
    }, [effectiveZoom]);

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
