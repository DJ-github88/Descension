import React, { useRef, useEffect, useCallback, useState } from 'react';
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
        movementCost: 1,
        description: 'Natural grassland'
    },
    dirt: {
        id: 'dirt',
        name: 'Dirt',
        category: 'natural',
        color: '#8b6914',
        movementCost: 1,
        description: 'Bare earth and soil'
    },
    stone: {
        id: 'stone',
        name: 'Stone',
        category: 'natural',
        color: '#6b6b6b',
        movementCost: 1,
        description: 'Natural stone surface'
    },
    sand: {
        id: 'sand',
        name: 'Sand',
        category: 'natural',
        color: '#c2b280',
        movementCost: 2,
        description: 'Sandy terrain'
    },
    water: {
        id: 'water',
        name: 'Water',
        category: 'natural',
        color: '#4682b4',
        movementCost: 4,
        description: 'Water terrain'
    },
    cobblestone: {
        id: 'cobblestone',
        name: 'Cobblestone',
        category: 'natural',
        color: '#8a8a8a',
        movementCost: 1,
        description: 'Cobblestone path or road'
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
    snow: {
        id: 'snow',
        name: 'Snow',
        category: 'natural',
        color: '#ffffff',
        texture: '/assets/terrain/snow.png',
        movementCost: 2,
        description: 'Fresh, powdery snow'
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
    fungal_growth: {
        id: 'fungal_growth',
        name: 'Fungal Growth',
        category: 'difficult',
        color: '#7b68ee',
        texture: '/assets/terrain/fungal.png',
        movementCost: 2,
        description: 'Spongy, glowing fungal matter'
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
    },
    abyss: {
        id: 'abyss',
        name: 'The Abyss',
        category: 'hazard',
        color: '#000000',
        texture: '/assets/terrain/abyss.png',
        movementCost: 99,
        description: 'Infinite dark void'
    },
    crystal_floor: {
        id: 'crystal_floor',
        name: 'Crystal Floor',
        category: 'dungeon',
        color: '#e0ffff',
        texture: '/assets/terrain/crystal.png',
        movementCost: 1,
        description: 'Resonant crystalline surface'
    },
    gold_floor: {
        id: 'gold_floor',
        name: 'Gold Floor',
        category: 'dungeon',
        color: '#ffd700',
        texture: '/assets/terrain/gold.png',
        movementCost: 1,
        description: 'Opulent solid gold flooring'
    }
};

const TerrainSystem = () => {
    const canvasRef = useRef(null);
    const bufferCanvasRef = useRef(null);
    const bufferCtxRef = useRef(null);
    const lastBufferResetRef = useRef({
        cameraX: 0,
        cameraY: 0,
        zoom: 0,
        gridType: '',
        gridSize: 0,
        gridOffsetX: 0,
        gridOffsetY: 0,
        dataVersion: 0
    });
    const bufferPadding = 500; // Extra pixels to render around the viewport
    const [terrainDataVersion, setTerrainDataVersion] = useState(0);

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

    // Track terrain data changes with a version counter to trigger buffer refreshes
    useEffect(() => {
        setTerrainDataVersion(v => v + 1);
    }, [terrainData]);

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

    // Render terrain to an offscreen buffer
    // Helper to render terrain to a specific context
    const performFullRender = useCallback((targetCtx, targetWidth, targetHeight, viewCameraX, viewCameraY, viewZoom) => {
        // Clear target context
        targetCtx.clearRect(0, 0, targetWidth, targetHeight);

        const currentGridType = gridType || 'square';
        const gridSystem = getGridSystem();

        // Check if terrain layer is visible
        const terrainLayer = drawingLayers.find(layer => layer.id === 'terrain');
        if (!terrainLayer || !terrainLayer.visible) return;
        if (!terrainData || Object.keys(terrainData).length === 0) return;

        // Calculate visible grid bounds for performance
        const VIEWPORT_PADDING = 3; // Extra padding for buffer
        let startX, endX, startY, endY;

        try {
            const worldLeft = viewCameraX - (targetWidth / 2) / viewZoom;
            const worldRight = viewCameraX + (targetWidth / 2) / viewZoom;
            const worldTop = viewCameraY - (targetHeight / 2) / viewZoom;
            const worldBottom = viewCameraY + (targetHeight / 2) / viewZoom;

            startX = Math.floor((worldLeft - gridOffsetX) / gridSize) - VIEWPORT_PADDING;
            endX = Math.ceil((worldRight - gridOffsetX) / gridSize) + VIEWPORT_PADDING;
            startY = Math.floor((worldTop - gridOffsetY) / gridSize) - VIEWPORT_PADDING;
            endY = Math.ceil((worldBottom - gridOffsetY) / gridSize) + VIEWPORT_PADDING;
        } catch (error) {
            startX = Math.floor((viewCameraX - gridOffsetX) / gridSize) - 10;
            endX = Math.ceil((viewCameraX + targetWidth / viewZoom - gridOffsetX) / gridSize) + 10;
            startY = Math.floor((viewCameraY - gridOffsetY) / gridSize) - 10;
            endY = Math.ceil((viewCameraY + targetHeight / viewZoom - gridOffsetY) / gridSize) + 10;
        }

        // Render terrain tiles
        if (currentGridType === 'hex') {
            const worldLeft = viewCameraX - (targetWidth / 2) / viewZoom;
            const worldRight = viewCameraX + (targetWidth / 2) / viewZoom;
            const worldTop = viewCameraY - (targetHeight / 2) / viewZoom;
            const worldBottom = viewCameraY + (targetHeight / 2) / viewZoom;

            const topLeftHex = gridSystem.worldToHex(worldLeft, worldTop);
            const topRightHex = gridSystem.worldToHex(worldRight, worldTop);
            const bottomLeftHex = gridSystem.worldToHex(worldLeft, worldBottom);
            const bottomRightHex = gridSystem.worldToHex(worldRight, worldBottom);

            const hexStartQ = Math.min(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q) - VIEWPORT_PADDING;
            const hexEndQ = Math.max(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q) + VIEWPORT_PADDING;
            const hexStartR = Math.min(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r) - VIEWPORT_PADDING;
            const hexEndR = Math.max(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r) + VIEWPORT_PADDING;

            for (let q = hexStartQ; q <= hexEndQ; q++) {
                for (let r = hexStartR; r <= hexEndR; r++) {
                    const tileKey = `${q},${r}`;
                    const terrainData_tile = terrainData[tileKey];
                    if (!terrainData_tile) continue;

                    let terrainType, variationIndex;
                    if (typeof terrainData_tile === 'string') {
                        terrainType = terrainData_tile;
                        variationIndex = 0;
                    } else {
                        terrainType = terrainData_tile.type;
                        variationIndex = terrainData_tile.variation || 0;
                    }

                    const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];
                    if (!terrain) continue;

                    const worldPos = gridSystem.hexToWorld(q, r);

                    // Visibility check (if GM mode is off)
                    if (!isGMMode && viewingFromToken && visibleArea) {
                        const visibleAreaSet = visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
                        if (!visibleAreaSet.has(tileKey)) {
                            const levelEditorStore = useLevelEditorStore.getState();
                            let isExplored = levelEditorStore.isPositionExplored?.(worldPos.x, worldPos.y) || levelEditorStore.exploredAreas[tileKey];
                            if (!isExplored) continue;
                        }
                    }

                    const screenX = (worldPos.x - viewCameraX) * viewZoom + targetWidth / 2;
                    const screenY = (worldPos.y - viewCameraY) * viewZoom + targetHeight / 2;
                    const hexRadiusScreen = (gridSize / Math.sqrt(3)) * viewZoom;
                    const corners = gridSystem.getHexCorners(screenX, screenY, hexRadiusScreen);

                    targetCtx.save();
                    targetCtx.beginPath();
                    targetCtx.moveTo(corners[0].x, corners[0].y);
                    for (let i = 1; i < corners.length; i++) targetCtx.lineTo(corners[i].x, corners[i].y);
                    targetCtx.closePath();
                    targetCtx.clip();

                    if (terrain.tileVariations && terrain.tileVariations.length > 0) {
                        const tileVariationPath = terrain.tileVariations[variationIndex] || terrain.tileVariations[0];
                        if (!imageCache[tileVariationPath]) {
                            const img = new Image();
                            img.onload = () => setTerrainDataVersion(v => v + 1);
                            img.src = tileVariationPath;
                            imageCache[tileVariationPath] = img;
                        }
                        const img = imageCache[tileVariationPath];
                        if (img.complete && img.naturalWidth > 0) {
                            const hexBounds = {
                                minX: Math.min(...corners.map(c => c.x)),
                                maxX: Math.max(...corners.map(c => c.x)),
                                minY: Math.min(...corners.map(c => c.y)),
                                maxY: Math.max(...corners.map(c => c.y))
                            };
                            targetCtx.drawImage(img, hexBounds.minX, hexBounds.minY, hexBounds.maxX - hexBounds.minX, hexBounds.maxY - hexBounds.minY);
                        }
                    } else {
                        const hexBounds = {
                            minX: Math.min(...corners.map(c => c.x)),
                            maxX: Math.max(...corners.map(c => c.x)),
                            minY: Math.min(...corners.map(c => c.y)),
                            maxY: Math.max(...corners.map(c => c.y))
                        };
                        drawTerrainTexture(targetCtx, terrain, hexBounds.minX, hexBounds.minY, hexBounds.maxX - hexBounds.minX, hexBounds.maxY - hexBounds.minY, q, r);
                    }
                    targetCtx.restore();
                }
            }
        } else {
            const tileSize = gridSize * viewZoom;
            for (let gridX = startX; gridX <= endX; gridX++) {
                for (let gridY = startY; gridY <= endY; gridY++) {
                    const tileKey = `${gridX},${gridY}`;
                    const terrainData_tile = terrainData[tileKey];
                    if (!terrainData_tile) continue;

                    let terrainType, variationIndex;
                    if (typeof terrainData_tile === 'string') {
                        terrainType = terrainData_tile;
                        variationIndex = 0;
                    } else {
                        terrainType = terrainData_tile.type;
                        variationIndex = terrainData_tile.variation || 0;
                    }

                    const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];
                    if (!terrain) continue;

                    const worldX = (gridX * gridSize) + gridOffsetX;
                    const worldY = (gridY * gridSize) + gridOffsetY;

                    if (!isGMMode && viewingFromToken && visibleArea) {
                        const visibleAreaSet = visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
                        if (!visibleAreaSet.has(tileKey)) {
                            const levelEditorStore = useLevelEditorStore.getState();
                            let isExplored = levelEditorStore.isPositionExplored?.(worldX + gridSize / 2, worldY + gridSize / 2) || levelEditorStore.exploredAreas[tileKey];
                            if (!isExplored) continue;
                        }
                    }

                    const tileX = (worldX - viewCameraX) * viewZoom + targetWidth / 2;
                    const tileY = (worldY - viewCameraY) * viewZoom + targetHeight / 2;

                    if (terrain.tileVariations && terrain.tileVariations.length > 0) {
                        const tileVariationPath = terrain.tileVariations[variationIndex] || terrain.tileVariations[0];
                        if (!imageCache[tileVariationPath]) {
                            const img = new Image();
                            img.onload = () => setTerrainDataVersion(v => v + 1);
                            img.src = tileVariationPath;
                            imageCache[tileVariationPath] = img;
                        }
                        const img = imageCache[tileVariationPath];
                        if (img.complete && img.naturalWidth > 0) {
                            targetCtx.drawImage(img, tileX, tileY, tileSize, tileSize);
                        }
                    } else {
                        drawTerrainTexture(targetCtx, terrain, tileX, tileY, tileSize, tileSize, gridX, gridY);
                    }
                }
            }
        }
    }, [terrainData, drawingLayers, gridSize, gridType, gridOffsetX, gridOffsetY, isGMMode, viewingFromToken, visibleArea]);

    // Render terrain to an offscreen buffer
    const renderToBuffer = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = canvas.width;
        const height = canvas.height;

        if (!bufferCanvasRef.current) {
            bufferCanvasRef.current = document.createElement('canvas');
            bufferCtxRef.current = bufferCanvasRef.current.getContext('2d', { alpha: true });
        }

        const bufferCanvas = bufferCanvasRef.current;
        const bufferCtx = bufferCtxRef.current;

        const bufferWidth = width + bufferPadding * 2;
        const bufferHeight = height + bufferPadding * 2;

        if (bufferCanvas.width !== bufferWidth || bufferCanvas.height !== bufferHeight) {
            bufferCanvas.width = bufferWidth;
            bufferCanvas.height = bufferHeight;
        }

        lastBufferResetRef.current = {
            cameraX,
            cameraY,
            zoom: effectiveZoom,
            gridType,
            gridSize,
            gridOffsetX,
            gridOffsetY,
            dataVersion: terrainDataVersion
        };

        performFullRender(bufferCtx, bufferWidth, bufferHeight, cameraX, cameraY, effectiveZoom);
    }, [cameraX, cameraY, effectiveZoom, gridSize, gridType, gridOffsetX, gridOffsetY, terrainDataVersion, performFullRender]);

    // Main render function that uses the buffer when possible
    const renderTerrain = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const width = rect.width > 0 ? rect.width : (window.innerWidth || 1920);
        const height = rect.height > 0 ? rect.height : (window.innerHeight || 1080);

        if (width <= 0 || height <= 0) return;

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        ctx.clearRect(0, 0, width, height);

        const lastReset = lastBufferResetRef.current;
        const needsRefresh =
            !bufferCanvasRef.current ||
            lastReset.zoom !== effectiveZoom ||
            lastReset.gridType !== gridType ||
            lastReset.gridSize !== gridSize ||
            lastReset.gridOffsetX !== gridOffsetX ||
            lastReset.gridOffsetY !== gridOffsetY ||
            lastReset.dataVersion !== terrainDataVersion ||
            Math.abs(cameraX - lastReset.cameraX) * effectiveZoom > bufferPadding ||
            Math.abs(cameraY - lastReset.cameraY) * effectiveZoom > bufferPadding;

        if (needsRefresh) {
            renderToBuffer();
        }

        const bufferCanvas = bufferCanvasRef.current;
        if (bufferCanvas) {
            const offsetX = (lastReset.cameraX - cameraX) * effectiveZoom - bufferPadding;
            const offsetY = (lastReset.cameraY - cameraY) * effectiveZoom - bufferPadding;
            ctx.drawImage(bufferCanvas, offsetX, offsetY);
        }
    }, [cameraX, cameraY, effectiveZoom, gridSize, gridType, gridOffsetX, gridOffsetY, terrainDataVersion, renderToBuffer]);

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
                drawSandTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase, gridX, gridY);
                break;
            case 'water':
                drawWaterTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase, gridX, gridY);
                break;
            case 'cobblestone':
                drawCobblestoneTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase, gridX, gridY);
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
            case 'snow':
                drawSnowTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'crystal_floor':
                drawCrystalTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'abyss':
                drawAbyssTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'fungal_growth':
                drawFungalTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
                break;
            case 'gold_floor':
                drawGoldTexture(textureCtx, baseColor, 0, 0, tileSize, tileSize, seedBase);
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

        // Derive virtual grid coordinates if not provided (for seamlessness fallback)
        const effectiveGridX = gridX !== null ? gridX : Math.floor(x / width);
        const effectiveGridY = gridY !== null ? gridY : Math.floor(y / height);

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
                drawSandTexture(ctx, baseColor, x, y, width, height, seedBase, effectiveGridX, effectiveGridY);
                break;
            case 'water':
                drawWaterTexture(ctx, baseColor, x, y, width, height, seedBase, effectiveGridX, effectiveGridY);
                break;
            case 'cobblestone':
                drawCobblestoneTexture(ctx, baseColor, x, y, width, height, seedBase, effectiveGridX, effectiveGridY);
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

    // Sand texture - fine, grainy with seamless dunes across tiles
    const drawSandTexture = (ctx, baseColor, x, y, w, h, seed = 0, gridX = 0, gridY = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);

        // Add dune / ripple effects with global coordinate mapping
        const worldX = gridX * 100; // Use a virtual world scale for math 
        const worldY = gridY * 100;

        const rippleCount = 3;
        for (let i = 0; i < rippleCount; i++) {
            // Use deterministic values based on ripple index, not tile seed
            const phase = i * 0.8;
            // Calculate a vertical offset that flows across tiles
            const ry = y + (((worldY + phase * 50) % 100) / 100) * h;

            const grad = ctx.createLinearGradient(x, ry - h * 0.2, x, ry + h * 0.2);
            const dark = adjustRgbBrightness(baseColor, -0.08);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.5, `rgba(${dark.r}, ${dark.g}, ${dark.b}, 0.15)`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = grad;
            ctx.fillRect(x, ry - h, w, h * 2);
        }

        // Add fine sand grains - use tile-specific seed is okay for static noise bits
        const grainCount = Math.min(250, Math.max(50, Math.floor(w * h / 4)));
        for (let i = 0; i < grainCount; i++) {
            const r1 = seededRandom(seed + i * 0.1);
            const r2 = seededRandom(seed + i * 0.1 + 0.01);
            const r3 = seededRandom(seed + i * 0.1 + 0.02);
            const r4 = seededRandom(seed + i * 0.1 + 0.03);

            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 0.2 + r3 * 0.8;
            const variation = adjustRgbBrightness(baseColor, -0.12 + r4 * 0.25);

            ctx.fillStyle = `rgba(${variation.r}, ${variation.g}, ${variation.b}, ${0.5 + r1 * 0.4})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add sparkle spots - global mapping for consistency
        for (let i = 0; i < 3; i++) {
            const sx = ((gridX * 7 + i * 13) % 10) / 10;
            const sy = ((gridY * 3 + i * 17) % 10) / 10;
            ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
            ctx.beginPath();
            ctx.arc(x + sx * w, y + sy * h, 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    // Water texture - vibrant, fluid blue with shimmering caustics and surface ripples
    const drawWaterTexture = (ctx, baseColor, x, y, w, h, seed = 0, gridX = 0, gridY = 0) => {
        // 1. Rich Vibrant Base
        const deepColor = adjustRgbBrightness(baseColor, -0.25); // Significantly brighter
        const midColor = adjustRgbBrightness(baseColor, 0.05);

        ctx.fillStyle = `rgb(${deepColor.r}, ${deepColor.g}, ${deepColor.b})`;
        ctx.fillRect(x, y, w, h);

        // 2. Global fluid caustic network
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();

        const worldX = gridX * w;
        const worldY = gridY * h;

        // Use 'screen' for vibrant additive light
        ctx.globalCompositeOperation = 'screen';

        const causticColor = adjustRgbBrightness(baseColor, 0.6);
        const rimColor = { r: 210, g: 245, b: 255 };

        // Grid setup for global caustics
        const step = w * 0.8;
        const startGX = Math.floor(worldX / step) - 1;
        const endGX = Math.ceil((worldX + w) / step) + 1;
        const startGY = Math.floor(worldY / step) - 1;
        const endGY = Math.ceil((worldY + h) / step) + 1;

        // Layer 1: Soft Caustic Blooms
        for (let gx = startGX; gx <= endGX; gx++) {
            for (let gy = startGY; gy <= endGY; gy++) {
                const sSeed = (gx * 31337) ^ (gy * 12347);
                const bx = gx * step + (seededRandom(sSeed) - 0.5) * step * 0.4;
                const by = gy * step + (seededRandom(sSeed + 1) - 0.5) * step * 0.4;

                const sx = x + (bx - worldX);
                const sy = y + (by - worldY);
                const r = step * (0.4 + seededRandom(sSeed + 2) * 0.4);

                const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
                grad.addColorStop(0, `rgba(${causticColor.r}, ${causticColor.g}, ${causticColor.b}, 0.35)`);
                grad.addColorStop(0.7, `rgba(${causticColor.r}, ${causticColor.g}, ${causticColor.b}, 0.05)`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(sx, sy, r, 0, Math.PI * 2);
                ctx.fill();

                // Layer 2: Interconnected Light Webs (Ribs)
                const neighbors = [[1, 0], [0, 1], [1, 1]];
                neighbors.forEach(([dx, dy]) => {
                    const nSeed = ((gx + dx) * 31337) ^ ((gy + dy) * 12347);
                    const nbx = (gx + dx) * step + (seededRandom(nSeed) - 0.5) * step * 0.4;
                    const nby = (gy + dy) * step + (seededRandom(nSeed + 1) - 0.5) * step * 0.4;
                    const nsx = x + (nbx - worldX);
                    const nsy = y + (nby - worldY);

                    ctx.beginPath();
                    ctx.moveTo(sx, sy);

                    const midX = (sx + nsx) / 2;
                    const midY = (sy + nsy) / 2;
                    const cpX = midX + (seededRandom(sSeed + nSeed) - 0.5) * step * 0.3;
                    const cpY = midY + (seededRandom(sSeed + nSeed + 1) - 0.5) * step * 0.3;

                    ctx.strokeStyle = `rgba(${rimColor.r}, ${rimColor.g}, ${rimColor.b}, 0.15)`;
                    ctx.lineWidth = 1.6;
                    ctx.quadraticCurveTo(cpX, cpY, nsx, nsy);
                    ctx.stroke();
                });
            }
        }

        // Layer 3: Surface Water Ripples (Specular highlights)
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 3; i++) {
            const rSeed = (gridX * 13) ^ (gridY * 17) ^ i;
            const rx = x + seededRandom(rSeed) * w;
            const ry = y + seededRandom(rSeed + 3) * h;
            const rLen = w * (0.25 + seededRandom(rSeed + 7) * 0.35);
            const rAngle = seededRandom(rSeed + 9) * Math.PI;

            ctx.beginPath();
            ctx.moveTo(rx - Math.cos(rAngle) * rLen / 2, ry - Math.sin(rAngle) * rLen / 2);
            ctx.quadraticCurveTo(rx + (seededRandom(rSeed + 1) - 0.5) * 10, ry + (seededRandom(rSeed + 2) - 0.5) * 10, rx + Math.cos(rAngle) * rLen / 2, ry + Math.sin(rAngle) * rLen / 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + seededRandom(rSeed + 4) * 0.15})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
        }

        ctx.restore();
    };



    // Cobblestone texture - SEAMLESS organic natural stones
    const drawCobblestoneTexture = (ctx, baseColor, x, y, w, h, seed = 0, gridX = 0, gridY = 0) => {
        // 1. Mortar Base (Deep Earthy Tone)
        const mortar = adjustRgbBrightness(baseColor, -0.55);
        ctx.fillStyle = `rgb(${mortar.r}, ${mortar.g}, ${mortar.b})`;
        ctx.fillRect(x, y, w, h);

        // 2. High-density stones (5x5 grid)
        const stoneSize = w / 5;

        for (let localX = -1; localX <= 5; localX++) {
            for (let localY = -1; localY <= 5; localY++) {
                const globalIdxX = gridX * 5 + localX;
                const globalIdxY = gridY * 5 + localY;

                const stoneSeed = (globalIdxX * 17385) ^ (globalIdxY * 19349);

                // Jitter within its slot
                const jX = (seededRandom(stoneSeed) - 0.5) * (stoneSize * 0.6);
                const jY = (seededRandom(stoneSeed + 1) - 0.5) * (stoneSize * 0.6);

                const sx = x + (localX * stoneSize) + stoneSize / 2 + jX;
                const sy = y + (localY * stoneSize) + stoneSize / 2 + jY;

                const buffer = stoneSize;
                if (sx < x - buffer || sx > x + w + buffer || sy < y - buffer || sy > y + h + buffer) continue;

                // Varied stone dimensions and rotations
                const sW = stoneSize * (0.8 + seededRandom(stoneSeed + 2) * 0.4);
                const sH = stoneSize * (0.8 + seededRandom(stoneSeed + 3) * 0.4);
                const rotation = seededRandom(stoneSeed + 4) * Math.PI;
                const stoneBaseColor = adjustRgbBrightness(baseColor, (seededRandom(stoneSeed + 5) - 0.5) * 0.4);

                ctx.save();
                ctx.translate(sx, sy);
                ctx.rotate(rotation);

                // Irregular polygonal stone shape
                ctx.beginPath();
                const points = 5 + (stoneSeed % 3);
                for (let p = 0; p < points; p++) {
                    const angle = (p / points) * Math.PI * 2;
                    const rDist = 0.8 + seededRandom(stoneSeed + 10 + p) * 0.4;
                    const px = Math.cos(angle) * (sW / 2) * rDist;
                    const py = Math.sin(angle) * (sH / 2) * rDist;
                    if (p === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();

                // Depth & Lighting
                ctx.shadowColor = 'rgba(0,0,0,0.6)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetY = 2;
                ctx.fillStyle = `rgb(${stoneBaseColor.r}, ${stoneBaseColor.g}, ${stoneBaseColor.b})`;
                ctx.fill();

                // Reset shadow for highlights
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;

                // Top-left highlight for chiseled look
                const highlight = adjustRgbBrightness(stoneBaseColor, 0.25);
                ctx.strokeStyle = `rgba(${highlight.r}, ${highlight.g}, ${highlight.b}, 0.35)`;
                ctx.lineWidth = 1.0;
                ctx.stroke();

                // Surface weathering (tiny spots)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                for (let k = 0; k < 2; k++) {
                    const kr1 = (seededRandom(stoneSeed + k * 5) - 0.5) * sW * 0.4;
                    const kr2 = (seededRandom(stoneSeed + k * 5 + 1) - 0.5) * sH * 0.4;
                    ctx.beginPath();
                    ctx.arc(kr1, kr2, 1, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }
    };

    // Dungeon floor texture - refined flagstone with varied tiles and worn edges
    const drawDungeonFloorTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);

        const dark = adjustRgbBrightness(baseColor, -0.2);
        const light = adjustRgbBrightness(baseColor, 0.1);
        const grout = adjustRgbBrightness(baseColor, -0.4);

        // Draw stones with varied sizes
        const stoneSizeX = w / 2;
        const stoneSizeY = h / 2;

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                const sX = x + col * stoneSizeX;
                const sY = y + row * stoneSizeY;
                const sSeed = seed + row * 2 + col;
                const r1 = seededRandom(sSeed);
                const r2 = seededRandom(sSeed + 0.1);

                // Varied stone color
                const colorVariation = adjustRgbBrightness(baseColor, (r1 - 0.5) * 0.15);
                ctx.fillStyle = `rgb(${colorVariation.r}, ${colorVariation.g}, ${colorVariation.b})`;
                ctx.fillRect(sX + 1, sY + 1, stoneSizeX - 2, stoneSizeY - 2);

                // Worn stone texture
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                for (let k = 0; k < 5; k++) {
                    const kr1 = seededRandom(sSeed + k * 0.2);
                    const kr2 = seededRandom(sSeed + k * 0.2 + 0.01);
                    ctx.beginPath();
                    ctx.arc(sX + kr1 * stoneSizeX, sY + kr2 * stoneSizeY, 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Edge highlight
                ctx.strokeStyle = `rgba(${light.r}, ${light.g}, ${light.b}, 0.2)`;
                ctx.strokeRect(sX + 1.5, sY + 1.5, stoneSizeX - 3, stoneSizeY - 3);
            }
        }

        // Mortar / grout lines
        ctx.strokeStyle = `rgb(${grout.r}, ${grout.g}, ${grout.b})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Cross lines
        ctx.moveTo(x + stoneSizeX, y); ctx.lineTo(x + stoneSizeX, y + h);
        ctx.moveTo(x, y + stoneSizeY); ctx.lineTo(x + w, y + stoneSizeY);
        ctx.stroke();
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

    // Acid texture - toxic, shimmering caustic fluid (Total Overhaul)
    const drawAcidTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill - deep toxic green
        const deepToxic = { r: 0, g: 51, b: 0 };
        ctx.fillStyle = `rgb(${deepToxic.r}, ${deepToxic.g}, ${deepToxic.b})`;
        ctx.fillRect(x, y, w, h);

        // Liquid surface sheen/glow
        const neonGreen = { r: 57, g: 255, b: 20 };
        const grad = ctx.createRadialGradient(x + w * 0.5, y + h * 0.5, 0, x + w * 0.5, y + h * 0.5, w * 0.7);
        grad.addColorStop(0, `rgba(${neonGreen.r}, ${neonGreen.g}, ${neonGreen.b}, 0.3)`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Caustic network simulation (fractal-like lines)
        ctx.strokeStyle = `rgba(${neonGreen.r}, ${neonGreen.g}, ${neonGreen.b}, 0.15)`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const r1 = seededRandom(seed + i * 0.33);
            ctx.beginPath();
            ctx.moveTo(x + r1 * w, y);
            for (let j = 0; j < 10; j++) {
                const r2 = seededRandom(seed + i * 0.33 + j * 0.1);
                ctx.lineTo(x + r1 * w + (r2 - 0.5) * 20, y + (j / 10) * h);
            }
            ctx.stroke();
        }

        // Sub-surface bubbles (out of focus)
        for (let i = 0; i < 5; i++) {
            const r1 = seededRandom(seed + i * 0.2 + 50);
            const r2 = seededRandom(seed + i * 0.2 + 50.01);
            const r3 = seededRandom(seed + i * 0.2 + 50.02);

            ctx.fillStyle = `rgba(${neonGreen.r}, ${neonGreen.g}, ${neonGreen.b}, 0.1)`;
            ctx.beginPath();
            ctx.arc(x + r1 * w, y + r2 * h, 5 + r3 * 10, 0, Math.PI * 2);
            ctx.fill();
        }

        // Surface bubbles (sharp)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 8; i++) {
            const r1 = seededRandom(seed + i * 0.15 + 100);
            const r2 = seededRandom(seed + i * 0.15 + 100.01);
            const r3 = seededRandom(seed + i * 0.15 + 100.02);

            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 1 + r3 * 3;

            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();

            // Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(px - size * 0.3, py - size * 0.3, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        }
    };

    // Pit texture - multi-layered chasm with clamped rim alignment
    const drawPitTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill - very dark grey
        const pitch = { r: 5, g: 5, b: 5 };
        ctx.fillStyle = `rgb(${pitch.r}, ${pitch.b}, ${pitch.b})`;
        ctx.fillRect(x, y, w, h);

        // Add refined rim highlight (simulating broken edge without "weird upper edge")
        const rimColor = adjustRgbBrightness(baseColor, -0.05); // Subtle dark rim
        ctx.strokeStyle = `rgba(${rimColor.r}, ${rimColor.g}, ${rimColor.b}, 0.6)`;
        ctx.lineWidth = 2;

        // Draw centered depth pockets rather than rim paths
        for (let i = 0; i < 4; i++) {
            const r1 = seededRandom(seed + i * 0.25);
            const r2 = seededRandom(seed + i * 0.25 + 0.01);
            const r3 = seededRandom(seed + i * 0.25 + 0.02);

            const px = x + w * 0.5 + (r1 - 0.5) * w * 0.3;
            const py = y + h * 0.5 + (r2 - 0.5) * h * 0.3;

            const grad = ctx.createRadialGradient(px, py, 0, px, py, w * 0.5);
            grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
            grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.8)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, w * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add soft rim glow to Suggest hole
        const rimGrad = ctx.createRadialGradient(x + w / 2, y + h / 2, w * 0.35, x + w / 2, y + h / 2, w * 0.5);
        rimGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        rimGrad.addColorStop(1, 'rgba(40, 40, 40, 0.4)');
        ctx.fillStyle = rimGrad;
        ctx.fillRect(x, y, w, h);
    };

    // Snow texture - soft, powdery with sparkles and crusty detail
    const drawSnowTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill - bright white/off-white
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);

        // Add soft mounds/shading
        const shadow = adjustRgbBrightness(baseColor, -0.08);
        for (let i = 0; i < 7; i++) {
            const r1 = seededRandom(seed + i * 0.1);
            const r2 = seededRandom(seed + i * 0.1 + 0.01);
            const r3 = seededRandom(seed + i * 0.1 + 0.02);

            const px = x + r1 * w;
            const py = y + r2 * h;
            const rw = w * (0.4 + r3 * 0.5);
            const rh = h * (0.3 + r2 * 0.4);

            const grad = ctx.createRadialGradient(px, py, 0, px, py, rw);
            grad.addColorStop(0, `rgba(${shadow.r}, ${shadow.g}, ${shadow.b}, 0.25)`);
            grad.addColorStop(0.7, `rgba(${shadow.r}, ${shadow.g}, ${shadow.b}, 0.05)`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(px, py, rw, rh, r1 * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add "crusty" detail (small sharp flecks)
        ctx.fillStyle = `rgba(${shadow.r}, ${shadow.g}, ${shadow.b}, 0.15)`;
        for (let i = 0; i < 40; i++) {
            const r1 = seededRandom(seed + i * 0.12 + 200);
            const r2 = seededRandom(seed + i * 0.12 + 200.01);
            const r3 = seededRandom(seed + i * 0.12 + 200.02);

            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 0.5 + r3 * 1.5;

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + size, py - size * 0.5);
            ctx.lineTo(px + size * 0.5, py + size);
            ctx.closePath();
            ctx.fill();
        }

        // Add sparkles (ice crystals)
        for (let i = 0; i < 25; i++) {
            const r1 = seededRandom(seed + i * 0.15 + 100);
            const r2 = seededRandom(seed + i * 0.15 + 100.01);
            const r3 = seededRandom(seed + i * 0.15 + 100.02);

            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 0.5 + r3 * 2;

            ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + r3 * 0.2})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();

            // Cross sparkle if large enough
            if (size > 1.3) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + r3 * 0.5})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(px - size * 2.5, py);
                ctx.lineTo(px + size * 2.5, py);
                ctx.moveTo(px, py - size * 2.5);
                ctx.lineTo(px, py + size * 2.5);
                ctx.stroke();
            }
        }
    };

    // Crystal texture - sharp prismatic facets and internal refraction
    const drawCrystalTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);

        const bright = adjustRgbBrightness(baseColor, 0.4);
        const dark = adjustRgbBrightness(baseColor, -0.25);
        const glow = adjustRgbBrightness(baseColor, 0.2);

        // Central refraction glow
        const grad = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, w * 0.7);
        grad.addColorStop(0, `rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.5)`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Draw crystal facets with improved logic
        for (let i = 0; i < 15; i++) {
            const r1 = seededRandom(seed + i * 0.13);
            const r2 = seededRandom(seed + i * 0.13 + 0.01);
            const r3 = seededRandom(seed + i * 0.13 + 0.02);
            const r4 = seededRandom(seed + i * 0.13 + 0.03);

            const px = x + r1 * w;
            const py = y + r2 * h;
            const sizeX = 5 + r3 * 25;
            const sizeY = 10 + r4 * 30;

            ctx.fillStyle = i % 3 === 0
                ? `rgba(${bright.r}, ${bright.g}, ${bright.b}, 0.35)`
                : (i % 3 === 1 ? `rgba(${dark.r}, ${dark.g}, ${dark.b}, 0.25)` : `rgba(255,255,255, 0.15)`);

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + Math.cos(r1 * 6) * sizeX, py + Math.sin(r1 * 6) * sizeY);
            ctx.lineTo(px + Math.cos(r2 * 6) * sizeY, py + Math.sin(r2 * 6) * sizeX);
            ctx.closePath();
            ctx.fill();

            // Sharp internal edge highlights
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + r3 * 0.3})`;
            ctx.lineWidth = 0.5 + r4 * 1;
            ctx.stroke();
        }

        // Add some prismatic "flecks"
        for (let i = 0; i < 10; i++) {
            const r1 = seededRandom(seed + i * 0.2 + 300);
            const r2 = seededRandom(seed + i * 0.2 + 300.01);

            ctx.fillStyle = `rgba(255, 255, 255, 0.6)`;
            ctx.fillRect(x + r1 * w, y + r2 * h, 2, 2);
        }
    };

    // Abyss texture - deep void with distant stars and cosmic wisps
    const drawAbyssTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Flat black base
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, w, h);

        const wispColor = { r: 50, g: 20, b: 80 }; // Deep purple/void wisps

        // Void wisps
        for (let i = 0; i < 5; i++) {
            const r1 = seededRandom(seed + i * 0.3);
            const r2 = seededRandom(seed + i * 0.3 + 0.01);
            const r3 = seededRandom(seed + i * 0.3 + 0.02);

            const px = x + r1 * w;
            const py = y + r2 * h;

            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.shadowBlur = 20;
            ctx.shadowColor = `rgb(${wispColor.r}, ${wispColor.g}, ${wispColor.b})`;

            ctx.beginPath();
            ctx.ellipse(px, py, w * 0.5, h * 0.15, r3 * Math.PI, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${wispColor.r}, ${wispColor.g}, ${wispColor.b}, 0.25)`;
            ctx.fill();
            ctx.restore();
        }

        // Distant stars/specks - increased visibility
        for (let i = 0; i < 30; i++) {
            const r1 = seededRandom(seed + i * 0.1 + 50);
            const r2 = seededRandom(seed + i * 0.1 + 50.01);
            const r3 = seededRandom(seed + i * 0.1 + 50.02);
            const r4 = seededRandom(seed + i * 0.1 + 50.03);

            // Varying star sizes and brightness
            const starSize = r4 > 0.8 ? 1.5 : 1;
            ctx.fillStyle = `rgba(220, 220, 255, ${0.3 + r3 * 0.6})`;
            ctx.fillRect(x + r1 * w, y + r2 * h, starSize, starSize);

            // Tiny glow for larger stars
            if (starSize > 1) {
                ctx.fillStyle = `rgba(180, 180, 255, 0.2)`;
                ctx.beginPath();
                ctx.arc(x + r1 * w + 0.5, y + r2 * h + 0.5, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    };

    // Fungal texture - spongy with glowing spots and organic vein patterns
    const drawFungalTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);

        const dark = adjustRgbBrightness(baseColor, -0.4);
        const glow = { r: 200, g: 120, b: 255 }; // Purple/Pink glow

        // Fungal veins / filaments
        ctx.strokeStyle = `rgba(${dark.r}, ${dark.g}, ${dark.b}, 0.3)`;
        ctx.lineWidth = 0.8;
        for (let i = 0; i < 4; i++) {
            const r1 = seededRandom(seed + i * 0.4);
            ctx.beginPath();
            ctx.moveTo(x + r1 * w, y);
            for (let j = 0; j < 10; j++) {
                const r2 = seededRandom(seed + i * 0.4 + j * 0.1);
                ctx.lineTo(x + r1 * w + (r2 - 0.5) * 20, y + (j / 10) * h);
            }
            ctx.stroke();
        }

        // Spongy fungal heads
        for (let i = 0; i < 20; i++) {
            const r1 = seededRandom(seed + i * 0.15);
            const r2 = seededRandom(seed + i * 0.15 + 0.01);
            const r3 = seededRandom(seed + i * 0.15 + 0.02);

            ctx.fillStyle = `rgba(${dark.r}, ${dark.g}, ${dark.b}, 0.25)`;
            ctx.beginPath();
            ctx.arc(x + r1 * w, y + r2 * h, 3 + r3 * 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Glowing fungal spots
        for (let i = 0; i < 8; i++) {
            const r1 = seededRandom(seed + i * 0.22 + 80);
            const r2 = seededRandom(seed + i * 0.22 + 80.01);
            const r3 = seededRandom(seed + i * 0.22 + 80.02);

            const px = x + r1 * w;
            const py = y + r2 * h;
            const size = 3 + r3 * 5;

            const grad = ctx.createRadialGradient(px, py, 0, px, py, size * 2.5);
            grad.addColorStop(0, `rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.5)`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, size * 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(px, py, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    // Gold texture - metallic, reflective and bumpy
    const drawGoldTexture = (ctx, baseColor, x, y, w, h, seed = 0) => {
        // Base fill
        ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        ctx.fillRect(x, y, w, h);

        const dark = adjustRgbBrightness(baseColor, -0.2);
        const highlight = adjustRgbBrightness(baseColor, 0.4);

        // Metallic bumps/sheen
        for (let i = 0; i < 15; i++) {
            const r1 = seededRandom(seed + i * 0.12);
            const r2 = seededRandom(seed + i * 0.12 + 0.01);
            const r3 = seededRandom(seed + i * 0.12 + 0.02);

            const px = x + r1 * w;
            const py = y + r2 * h;
            const sw = 5 + r3 * 15;

            const grad = ctx.createLinearGradient(px - sw, py - sw, px + sw, py + sw);
            grad.addColorStop(0, `rgba(${dark.r}, ${dark.g}, ${dark.b}, 0.5)`);
            grad.addColorStop(0.5, `rgba(${highlight.r}, ${highlight.g}, ${highlight.b}, 0.6)`);
            grad.addColorStop(1, `rgba(${dark.r}, ${dark.g}, ${dark.b}, 0.5)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, sw, 0, Math.PI * 2);
            ctx.fill();
        }

        // Sharp glitter specks
        for (let i = 0; i < 25; i++) {
            const r1 = seededRandom(seed + i * 0.08 + 150);
            const r2 = seededRandom(seed + i * 0.08 + 150.01);
            const r3 = seededRandom(seed + i * 0.08 + 150.02);

            ctx.fillStyle = `rgba(255, 255, 240, ${0.4 + r3 * 0.5})`;
            ctx.fillRect(x + r1 * w, y + r2 * h, 1.5, 1.5);
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
