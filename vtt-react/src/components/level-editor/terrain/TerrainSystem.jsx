import React, { useRef, useEffect, useCallback } from 'react';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useGameStore from '../../../store/gameStore';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';

// Image cache for tile variations
const imageCache = {};

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
        drawingLayers
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

    // Render terrain on canvas
    const renderTerrain = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // Set canvas size to match container
        canvas.width = rect.width;
        canvas.height = rect.height;
        
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
        let startX, endX, startY, endY;
        try {
            const gridSystem = getGridSystem();
            // Use consistent viewport dimensions that account for editor panel
            const viewport = gridSystem.getViewportDimensions();
            const bounds = gridSystem.getVisibleGridBounds(viewport.width, viewport.height);
            startX = bounds.minX;
            endX = bounds.maxX;
            startY = bounds.minY;
            endY = bounds.maxY;
        } catch (error) {
            // Fallback calculation
            startX = Math.floor((cameraX - gridOffsetX) / gridSize) - 2;
            endX = Math.ceil((cameraX + canvas.width / effectiveZoom - gridOffsetX) / gridSize) + 2;
            startY = Math.floor((cameraY - gridOffsetY) / gridSize) - 2;
            endY = Math.ceil((cameraY + canvas.height / effectiveZoom - gridOffsetY) / gridSize) + 2;
        }

        // Render terrain tiles
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

                // Use the same viewport dimensions as the grid system for consistent positioning
                const gridSystem = getGridSystem();
                const viewport = gridSystem.getViewportDimensions();
                const screenPos = gridToScreen(gridX, gridY, viewport.width, viewport.height);
                const tileSize = gridSize * effectiveZoom;

                // Use corner position directly (no centering needed since gridToScreen now uses corner)
                const tileX = screenPos.x;
                const tileY = screenPos.y;



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

                        // Then draw the actual tile image on top
                        ctx.globalAlpha = 1.0;
                        ctx.drawImage(
                            img,
                            tileX,
                            tileY,
                            tileSize,
                            tileSize
                        );

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
    }, [terrainData, drawingLayers, activeLayer, isEditorMode, gridToScreen, effectiveZoom, gridSize, cameraX, cameraY, gridOffsetX, gridOffsetY]);

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

    // Update canvas when dependencies change
    useEffect(() => {
        renderTerrain();
    }, [renderTerrain]);

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
