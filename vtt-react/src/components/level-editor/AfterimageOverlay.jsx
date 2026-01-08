import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore, { WALL_TYPES } from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useGridItemStore from '../../store/gridItemStore';
import useItemStore from '../../store/itemStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { rafThrottle } from '../../utils/performanceUtils';
import { getIconUrl, getCreatureTokenIconUrl } from '../../utils/assetManager';
import { PROFESSIONAL_TERRAIN_TYPES } from './terrain/TerrainSystem';
import { RARITY_COLORS } from '../../constants/itemConstants';

/**
 * AfterimageOverlay - Renders afterimages of previously explored areas and tokens
 * This component shows "memories" of what was visible when areas were last explored
 */
const AfterimageOverlay = () => {
    const canvasRef = useRef(null);
    // Cache for loaded images to avoid reloading
    const imageCacheRef = useRef(new Map());

    // PERFORMANCE FIX: Use selective subscriptions to prevent re-renders during camera drag
    // Camera position changes are handled in the RAF-based render loop, NOT via React subscriptions
    const gridSize = useGameStore(state => state.gridSize);
    const gridOffsetX = useGameStore(state => state.gridOffsetX);
    const gridOffsetY = useGameStore(state => state.gridOffsetY);
    const zoomLevel = useGameStore(state => state.zoomLevel);
    const playerZoom = useGameStore(state => state.playerZoom);
    const isGMMode = useGameStore(state => state.isGMMode);
    // NOTE: cameraX/cameraY are read directly in render callback to avoid re-renders

    // PERFORMANCE FIX: Use selective subscriptions
    const afterimageEnabled = useLevelEditorStore(state => state.afterimageEnabled);
    const dynamicFogEnabled = useLevelEditorStore(state => state.dynamicFogEnabled);
    const exploredAreas = useLevelEditorStore(state => state.exploredAreas);
    const memorySnapshots = useLevelEditorStore(state => state.memorySnapshots);
    const tokenAfterimages = useLevelEditorStore(state => state.tokenAfterimages);
    const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
    const visibleArea = useLevelEditorStore(state => state.visibleArea);
    const wallData = useLevelEditorStore(state => state.wallData);
    const terrainData = useLevelEditorStore(state => state.terrainData);
    const environmentalObjects = useLevelEditorStore(state => state.environmentalObjects);
    const dndElements = useLevelEditorStore(state => state.dndElements);

    const { tokens } = useCreatureStore();
    const { characterTokens } = useCharacterTokenStore();
    const { tokens: creatureTokens } = useCreatureStore();
    const { gridItems } = useGridItemStore();

    const effectiveZoom = zoomLevel * playerZoom;
    
    // Cache for processed (grayscale) images to avoid reprocessing every frame
    const processedImageCacheRef = useRef(new Map());
    
    // State for triggering re-renders when images load
    const [imageLoadTrigger, setImageLoadTrigger] = useState(0);
    
    // PERFORMANCE FIX: Helper function to get or create cached grayscale image
    // This prevents re-processing every tile on every frame
    const getGrayscaleCanvas = useCallback((img, tileSize, url) => {
        if (!img || !img.complete || img.naturalWidth === 0) return null;
        
        // Cache key includes tile size since we need different cached versions for different zoom levels
        const cacheKey = `${url}_${tileSize}`;
        
        // Check if already cached
        if (processedImageCacheRef.current.has(cacheKey)) {
            return processedImageCacheRef.current.get(cacheKey);
        }
        
        // Create grayscale version and cache it
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = tileSize;
        tempCanvas.height = tileSize;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, 0, 0, tileSize, tileSize);
        
        const imageData = tempCtx.getImageData(0, 0, tileSize, tileSize);
        const data_array = imageData.data;
        for (let i = 0; i < data_array.length; i += 4) {
            const gray = data_array[i] * 0.299 + data_array[i + 1] * 0.587 + data_array[i + 2] * 0.114;
            data_array[i] = gray * 0.85;
            data_array[i + 1] = gray * 0.9;
            data_array[i + 2] = gray * 1.1;
        }
        tempCtx.putImageData(imageData, 0, 0);
        
        // Cache the processed canvas
        processedImageCacheRef.current.set(cacheKey, tempCanvas);
        
        // Limit cache size to prevent memory bloat
        if (processedImageCacheRef.current.size > 500) {
            // Remove oldest entries
            const keys = Array.from(processedImageCacheRef.current.keys());
            for (let i = 0; i < 100 && i < keys.length; i++) {
                processedImageCacheRef.current.delete(keys[i]);
            }
        }
        
        return tempCanvas;
    }, []);
    
    // Helper function to load and cache images
    const loadImage = useCallback((url) => {
        if (!url) return null;
        
        // Check cache first
        if (imageCacheRef.current.has(url)) {
            const cached = imageCacheRef.current.get(url);
            if (cached.loaded && cached.image) {
                return cached.image;
            }
        }
        
        // Create new image entry
        const entry = { loaded: false, image: null, promise: null };
        imageCacheRef.current.set(url, entry);
        
        // Load image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        entry.promise = new Promise((resolve, reject) => {
            img.onload = () => {
                entry.loaded = true;
                entry.image = img;
                // Trigger re-render when image loads
                setImageLoadTrigger(prev => prev + 1);
                resolve(img);
            };
            img.onerror = () => {
                entry.loaded = false;
                entry.image = null;
                // Trigger re-render even on error
                setImageLoadTrigger(prev => prev + 1);
                resolve(null);
            };
            img.src = url;
        });
        
        return null; // Return null for async loading
    }, []);

    // PERFORMANCE FIX: These callbacks read camera state from grid system directly
    // This avoids creating dependencies on cameraX/cameraY which would cause re-renders
    // Convert world coordinates to screen coordinates
    const worldToScreen = useCallback((worldX, worldY) => {
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        return gridSystem.worldToScreen(worldX, worldY, viewport.width, viewport.height);
    }, []); // No dependencies - reads current state from grid system

    // Convert grid coordinates to world coordinates using grid system for proper alignment
    const gridToWorld = useCallback((gridX, gridY) => {
        const gridSystem = getGridSystem();
        // Use grid system's gridToWorld to get centered position (matches token positioning)
        return gridSystem.gridToWorld(gridX, gridY);
    }, []);

    // Convert grid coordinates to screen coordinates for walls (uses corners, not centers)
    const gridToScreenForWalls = useCallback((gridX, gridY) => {
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        // For walls, use gridToWorldCorner to get corner position (matches CanvasWallSystem)
        const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
        return gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);
    }, []); // No dependencies - reads current state from grid system

    // Get visible area as a Set for fast lookup
    const visibleAreaSet = useMemo(() => {
        if (!visibleArea) return new Set();
        return visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
    }, [visibleArea]);

    // Render afterimages on canvas
    const renderAfterimages = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !afterimageEnabled || isGMMode || !dynamicFogEnabled || !viewingFromToken) {
            return;
        }

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get viewport bounds for culling (calculate once, reuse for both memory snapshots and token afterimages)
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        const padding = 200; // Extra padding for culling
        const minScreenX = -padding;
        const maxScreenX = viewport.width + padding;
        const minScreenY = -padding;
        const maxScreenY = viewport.height + padding;

        // PERFORMANCE: Limit snapshots processed per frame and pre-filter by viewport
        const snapshotEntries = Object.entries(memorySnapshots);
        const maxSnapshotsPerFrame = 300; // Limit to prevent performance issues
        
        // Pre-filter snapshots by viewport before processing
        const snapshotsToProcess = snapshotEntries.filter(([tileKey, snapshot]) => {
            const [gridX, gridY] = tileKey.split(',').map(Number);
            const tileWorldPos = gridToWorld(gridX, gridY);
            const screenPos = worldToScreen(tileWorldPos.x, tileWorldPos.y);
            const tileSize = gridSize * effectiveZoom;
            
            // Early viewport culling
            if (screenPos.x < minScreenX - tileSize * 2 || screenPos.x > maxScreenX + tileSize * 2 ||
                screenPos.y < minScreenY - tileSize * 2 || screenPos.y > maxScreenY + tileSize * 2) {
                return false; // Outside viewport
            }
            
            // Skip if currently visible (early exit for performance)
            // FIXED: Only skip if the tile itself is visible, not adjacent tiles
            // This prevents gaps between visible and memory tiles
            if (visibleAreaSet.has(tileKey)) {
                return false; // Currently visible - show real-time view instead
            }
            
            return true;
        }).slice(0, maxSnapshotsPerFrame);
        
        // Render memory snapshots for previously explored areas
        snapshotsToProcess.forEach(([tileKey, snapshot]) => {
            const [gridX, gridY] = tileKey.split(',').map(Number);
            const tileWorldPos = gridToWorld(gridX, gridY);
            const screenPos = worldToScreen(tileWorldPos.x, tileWorldPos.y);
            const tileSize = gridSize * effectiveZoom;

            // Check if this position is in an explored circle (not tile-based)
            const levelEditorStore = useLevelEditorStore.getState();
            const isExplored = levelEditorStore.isPositionExplored 
                ? levelEditorStore.isPositionExplored(tileWorldPos.x, tileWorldPos.y)
                : (exploredAreas[tileKey] || false);
            
            if (!isExplored) {
                return; // Not explored - don't show afterimage
            }

            // Render shadowy afterimage with reduced opacity
            // FIXED: No square rendering - afterimages are shown within explored circles
            ctx.save();
            ctx.globalAlpha = 0.5; // Ghostly appearance

            // Render terrain afterimage if available
            if (snapshot.terrain) {
                // Check if real terrain is currently visible
                // FIXED: Only check if the tile itself is visible, not adjacent tiles
                // This prevents gaps between visible and memory tiles
                const currentTerrain = terrainData[tileKey];
                const isTileVisible = visibleAreaSet.has(tileKey);
                
                if (!currentTerrain || !isTileVisible) {
                    let terrainType, variationIndex;
                    if (typeof snapshot.terrain === 'string') {
                        terrainType = snapshot.terrain;
                        variationIndex = 0;
                    } else if (snapshot.terrain && typeof snapshot.terrain === 'object') {
                        terrainType = snapshot.terrain.type;
                        variationIndex = snapshot.terrain.variation || 0;
                    } else {
                        terrainType = snapshot.terrain;
                        variationIndex = 0;
                    }

                    const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];
                    if (terrain) {
                        ctx.globalAlpha = 0.4;
                        
                        // Try to render terrain tile variation if available
                        if (terrain.tileVariations && terrain.tileVariations.length > 0) {
                            const tileVariationPath = terrain.tileVariations[variationIndex] || terrain.tileVariations[0];
                            const cachedEntry = imageCacheRef.current.get(tileVariationPath);
                            const img = cachedEntry?.loaded ? cachedEntry.image : null;
                            
                            if (img && img.complete && img.naturalWidth > 0) {
                                // PERFORMANCE FIX: Use cached grayscale image instead of processing every frame
                                const grayscaleCanvas = getGrayscaleCanvas(img, tileSize, tileVariationPath);
                                if (grayscaleCanvas) {
                                    ctx.drawImage(grayscaleCanvas, screenPos.x - tileSize / 2, screenPos.y - tileSize / 2);
                                }
                            } else {
                                // Fallback: render colored rectangle
                                if (!cachedEntry || !cachedEntry.loaded) {
                                    loadImage(tileVariationPath);
                                }
                                ctx.fillStyle = terrain.color + '80';
                                ctx.fillRect(screenPos.x - tileSize / 2, screenPos.y - tileSize / 2, tileSize, tileSize);
                            }
                        } else {
                            // Fallback: render colored rectangle
                            ctx.fillStyle = terrain.color + '80';
                            ctx.fillRect(screenPos.x - tileSize / 2, screenPos.y - tileSize / 2, tileSize, tileSize);
                        }
                    }
                }
            }

            // Render wall afterimages
            if (snapshot.walls && snapshot.walls.length > 0) {
                snapshot.walls.forEach(({ key: wallKey, data: wallData_item }) => {
                    // Parse wall coordinates
                    const [x1, y1, x2, y2] = wallKey.split(',').map(Number);
                    
                    // Check if real wall is currently visible
                    // If ANY tile the wall passes through OR adjacent tiles are visible, don't show afterimage
                    const currentWall = wallData[wallKey];
                    let isWallCurrentlyVisible = false;
                    
                    if (currentWall && visibleAreaSet && visibleAreaSet.size > 0) {
                        // Check endpoint tiles and their adjacent tiles
                        const tile1Key = `${x1},${y1}`;
                        const tile2Key = `${x2},${y2}`;
                        
                        // Check if endpoint tiles or adjacent tiles are visible
                        const checkTileAndAdjacent = (tx, ty) => {
                            return visibleAreaSet.has(`${tx},${ty}`) ||
                                visibleAreaSet.has(`${tx - 1},${ty}`) ||
                                visibleAreaSet.has(`${tx + 1},${ty}`) ||
                                visibleAreaSet.has(`${tx},${ty - 1}`) ||
                                visibleAreaSet.has(`${tx},${ty + 1}`) ||
                                visibleAreaSet.has(`${tx - 1},${ty - 1}`) ||
                                visibleAreaSet.has(`${tx + 1},${ty - 1}`) ||
                                visibleAreaSet.has(`${tx - 1},${ty + 1}`) ||
                                visibleAreaSet.has(`${tx + 1},${ty + 1}`);
                        };
                        
                        if (checkTileAndAdjacent(x1, y1) || checkTileAndAdjacent(x2, y2)) {
                            isWallCurrentlyVisible = true;
                        } else {
                            // Check intermediate tiles along the wall
                            if (x1 === x2) {
                                // Vertical wall
                                for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                                    if (checkTileAndAdjacent(x1, y)) {
                                        isWallCurrentlyVisible = true;
                                        break;
                                    }
                                }
                            } else if (y1 === y2) {
                                // Horizontal wall
                                for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                                    if (checkTileAndAdjacent(x, y1)) {
                                        isWallCurrentlyVisible = true;
                                        break;
                                    }
                                }
                            } else {
                                // Diagonal wall - check both endpoint tiles and adjacent
                                if (checkTileAndAdjacent(x1, y1) || checkTileAndAdjacent(x2, y2)) {
                                    isWallCurrentlyVisible = true;
                                }
                            }
                        }
                    }
                    
                    if (isWallCurrentlyVisible) {
                        return; // Real wall is visible, skip afterimage
                    }
                    
                    const wallType = typeof wallData_item === 'string' ? wallData_item : wallData_item.type;
                    const wallTypeData = WALL_TYPES[wallType];
                    if (!wallTypeData) return;
                    
                    // Convert wall endpoints to screen coordinates (use corners, not centers)
                    const gridSystem = getGridSystem();
                    const { gridType } = gridSystem.getGridState();
                    
                    let startScreen, endScreen;
                    
                    if (gridType === 'hex') {
                        // For hex grids, get the edge between the two hex coordinates
                        const edge = gridSystem.getHexEdge(x1, y1, x2, y2);
                        if (edge) {
                            const viewport = gridSystem.getViewportDimensions();
                            startScreen = gridSystem.worldToScreen(edge.start.x, edge.start.y, viewport.width, viewport.height);
                            endScreen = gridSystem.worldToScreen(edge.end.x, edge.end.y, viewport.width, viewport.height);
                        } else {
                            // Fallback to corner positions
                            startScreen = gridToScreenForWalls(x1, y1);
                            endScreen = gridToScreenForWalls(x2, y2);
                        }
                    } else {
                        // Square grid: use corner positions (matches CanvasWallSystem)
                        startScreen = gridToScreenForWalls(x1, y1);
                        endScreen = gridToScreenForWalls(x2, y2);
                    }
                    
                    // Viewport culling for walls
                    const wallPadding = 50;
                    if ((startScreen.x < minScreenX - wallPadding && endScreen.x < minScreenX - wallPadding) ||
                        (startScreen.x > maxScreenX + wallPadding && endScreen.x > maxScreenX + wallPadding) ||
                        (startScreen.y < minScreenY - wallPadding && endScreen.y < minScreenY - wallPadding) ||
                        (startScreen.y > maxScreenY + wallPadding && endScreen.y > maxScreenY + wallPadding)) {
                        return; // Wall is completely outside viewport
                    }
                    
                    // Render wall afterimage with ghostly appearance
                    ctx.save();
                    ctx.globalAlpha = 0.5;
                    ctx.strokeStyle = wallTypeData.color + 'CC';
                    ctx.lineWidth = 4;
                    ctx.shadowColor = 'rgba(150, 140, 180, 0.6)';
                    ctx.shadowBlur = 4;
                    ctx.beginPath();
                    ctx.moveTo(startScreen.x, startScreen.y);
                    ctx.lineTo(endScreen.x, endScreen.y);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    ctx.restore();
                });
            }

            // Render objects afterimages
            if (snapshot.objects && snapshot.objects.length > 0) {
                snapshot.objects.forEach(obj => {
                    ctx.globalAlpha = 0.3;
                    // Render object afterimage (simplified representation)
                    ctx.fillStyle = 'rgba(150, 150, 150, 0.3)';
                    ctx.fillRect(
                        screenPos.x - tileSize / 4,
                        screenPos.y - tileSize / 4,
                        tileSize / 2,
                        tileSize / 2
                    );
                });
            }

            // Render grid item afterimages (loot orbs)
            if (snapshot.gridItems && snapshot.gridItems.length > 0) {
                snapshot.gridItems.forEach(item => {
                    // Check if real item is currently visible
                    const currentGridSystem = getGridSystem();
                    const itemWorldPos = item.position ? 
                        { x: item.position.x, y: item.position.y } :
                        currentGridSystem.gridToWorld(item.gridPosition?.col || 0, item.gridPosition?.row || 0);
                    const itemGridCoords = currentGridSystem.worldToGrid(itemWorldPos.x, itemWorldPos.y);
                    const itemTileKey = `${itemGridCoords.x},${itemGridCoords.y}`;
                    // Check if item tile is visible
                    // FIXED: Only check if the tile itself is visible, not adjacent tiles
                    // This prevents gaps between visible and memory tiles
                    const isItemTileVisible = visibleAreaSet.has(itemTileKey);
                    const isRealItemVisible = isItemTileVisible && 
                        gridItems.some(gi => gi.id === item.id);
                    
                    // Check if item has itemId (either itemId or originalItemStoreId)
                    const itemIdToLookup = item.itemId || item.originalItemStoreId;
                    if (!isRealItemVisible && itemIdToLookup) {
                        // Viewport culling
                        const orbSize = gridSize * effectiveZoom * 0.6;
                        const orbScreenPos = worldToScreen(itemWorldPos.x, itemWorldPos.y);
                        
                        if (orbScreenPos.x < minScreenX - orbSize || orbScreenPos.x > maxScreenX + orbSize ||
                            orbScreenPos.y < minScreenY - orbSize || orbScreenPos.y > maxScreenY + orbSize) {
                            return; // Outside viewport
                        }
                        
                        ctx.save();
                        
                        // Get item icon/image
                        const itemStore = useItemStore.getState();
                        const originalItem = itemStore.items.find(i => 
                            i.id === item.itemId || i.id === item.originalItemStoreId
                        );
                        
                        // Helper to get icon ID (matches GridItem.jsx logic)
                        const getItemIcon = (type, subtype) => {
                            const typeIcons = {
                                weapon: 'inv_sword_04',
                                armor: 'inv_chest_cloth_01',
                                accessory: 'inv_jewelry_ring_01',
                                consumable: 'inv_potion_51',
                                miscellaneous: 'inv_misc_questionmark',
                                material: 'inv_fabric_wool_01',
                                quest: 'inv_misc_note_01',
                                container: 'inv_box_01'
                            };
                            return typeIcons[type] || 'inv_misc_questionmark';
                        };
                        
                        const itemForTooltip = originalItem ? {
                            ...originalItem,
                            quantity: item.quantity || originalItem.quantity || 1
                        } : {
                            ...item,
                            id: itemIdToLookup,
                            name: item.customName || item.name || 'Unknown Item',
                            quality: item.quality || item.rarity || 'common',
                            rarity: item.rarity || item.quality || 'common',
                            type: item.type || 'misc',
                            iconId: item.iconId || null
                        };
                        
                        const iconId = itemForTooltip.iconId || 
                                     (originalItem && originalItem.iconId) ||
                                     getItemIcon(itemForTooltip.type, itemForTooltip.subtype);
                        const iconUrl = getIconUrl(iconId, 'items');
                        
                        const quality = itemForTooltip.quality || itemForTooltip.rarity || 'common';
                        const borderColor = RARITY_COLORS[quality]?.border || '#8B4513';
                        
                        // Draw circular orb background
                        ctx.globalAlpha = 0.5;
                        ctx.fillStyle = 'rgba(80, 70, 100, 0.4)';
                        ctx.beginPath();
                        ctx.arc(orbScreenPos.x, orbScreenPos.y, orbSize / 2, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Draw border
                        ctx.strokeStyle = borderColor + 'CC';
                        ctx.lineWidth = 2;
                        ctx.shadowColor = 'rgba(150, 140, 180, 0.6)';
                        ctx.shadowBlur = 4;
                        ctx.beginPath();
                        ctx.arc(orbScreenPos.x, orbScreenPos.y, orbSize / 2, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                        
                        // Try to load and render item icon
                        const cachedEntry = imageCacheRef.current.get(iconUrl);
                        const img = cachedEntry?.loaded ? cachedEntry.image : null;
                        
                        if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                            // Use cached processed image if available
                            const processedCacheKey = `${iconUrl}_${Math.floor(orbSize)}`;
                            let processedCanvas = processedImageCacheRef.current.get(processedCacheKey);
                            
                            if (!processedCanvas) {
                                // Create and cache processed image
                                processedCanvas = document.createElement('canvas');
                                processedCanvas.width = orbSize;
                                processedCanvas.height = orbSize;
                                const tempCtx = processedCanvas.getContext('2d');
                                
                                tempCtx.save();
                                tempCtx.beginPath();
                                tempCtx.arc(orbSize / 2, orbSize / 2, orbSize / 2, 0, Math.PI * 2);
                                tempCtx.clip();
                                tempCtx.drawImage(img, 0, 0, orbSize, orbSize);
                                tempCtx.restore();
                                
                                // Apply grayscale filter
                                const imageData = tempCtx.getImageData(0, 0, orbSize, orbSize);
                                const data_array = imageData.data;
                                for (let i = 0; i < data_array.length; i += 4) {
                                    const gray = data_array[i] * 0.299 + data_array[i + 1] * 0.587 + data_array[i + 2] * 0.114;
                                    data_array[i] = gray * 0.85;
                                    data_array[i + 1] = gray * 0.9;
                                    data_array[i + 2] = gray * 1.1;
                                    data_array[i + 3] = data_array[i + 3] * 0.7;
                                }
                                tempCtx.putImageData(imageData, 0, 0);
                                
                                processedImageCacheRef.current.set(processedCacheKey, processedCanvas);
                            }
                            
                            // Draw the cached processed circular icon
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(orbScreenPos.x, orbScreenPos.y, orbSize / 2, 0, Math.PI * 2);
                            ctx.clip();
                            ctx.globalAlpha = 0.6;
                            ctx.drawImage(processedCanvas, orbScreenPos.x - orbSize / 2, orbScreenPos.y - orbSize / 2);
                            ctx.restore();
                        } else {
                            // Image not loaded yet - trigger loading
                            if (!cachedEntry || !cachedEntry.loaded) {
                                loadImage(iconUrl);
                            }
                            // Don't show placeholder - wait for image to load
                        }
                        
                        ctx.restore();
                    }
                });
            }

            ctx.restore();
        });

        // Render token afterimages (reuse viewport bounds from above)
        Object.entries(tokenAfterimages).forEach(([tokenId, afterimage]) => {
            const { position, data } = afterimage;
            
            // FIXED: Position can be in world coordinates (from lastSeenPositions) or grid coordinates
            // Check if position has worldPosition (preferred) or use grid coordinates
            let tokenWorldPos;
            if (position.worldPosition) {
                // Use world position directly (more accurate)
                tokenWorldPos = position.worldPosition;
            } else if (position.x !== undefined && position.y !== undefined) {
                // Fallback: assume grid coordinates and convert
                tokenWorldPos = gridToWorld(position.x, position.y);
            } else {
                return; // Invalid position
            }
            
            const screenPos = worldToScreen(tokenWorldPos.x, tokenWorldPos.y);
            
            // Viewport culling - skip if outside viewport
            if (screenPos.x < minScreenX || screenPos.x > maxScreenX ||
                screenPos.y < minScreenY || screenPos.y > maxScreenY) {
                return; // Outside viewport
            }
            
            const tokenSize = gridSize * effectiveZoom * 0.8; // Slightly smaller than real token

            // Check if this position is in an explored area - afterimages should show in fog
            // FIXED: Use isPositionExplored to check circles instead of tile-based
            const levelEditorStore = useLevelEditorStore.getState();
            const isExplored = levelEditorStore.isPositionExplored 
                ? levelEditorStore.isPositionExplored(tokenWorldPos.x, tokenWorldPos.y)
                : (exploredAreas[`${Math.floor(position.x)},${Math.floor(position.y)}`] || false);

            if (!isExplored) {
                // Not explored yet - don't show afterimage
                return;
            }

            // Check if the real token corresponding to this afterimage is currently visible
            // If the real token is visible (in the visibleAreaSet), don't show its afterimage
            const allTokens = [...creatureTokens, ...(characterTokens || [])];
            const realToken = allTokens.find(t => {
                // Match by ID, creatureId, or characterId
                return t.id === tokenId || 
                       t.creatureId === tokenId || 
                       t.characterId === tokenId ||
                       (data && ((t.creatureId === data.creatureId) || (t.characterId === data.characterId)));
            });

            if (realToken && realToken.position) {
                // Calculate the real token's grid position using grid system (supports both square and hex)
                const gridSystem = getGridSystem();
                const realTokenGridCoords = gridSystem.worldToGrid(realToken.position.x, realToken.position.y);
                const realTokenTileKey = `${realTokenGridCoords.x},${realTokenGridCoords.y}`;
                
                // Check if the real token is in the visible area (accounts for walls/LOS)
                if (visibleAreaSet.has(realTokenTileKey)) {
                    return; // Don't show afterimage if the real token is currently visible
                }
            }

            // Afterimages are managed by MemorySnapshotManager - only render if the area is explored but not currently visible
            
            // Show afterimage in fog (explored area) where token was last seen
            // This works even if the area is currently visible but token moved away

            // Get token image/icon from afterimage data first
            // Only render afterimage if we have an image - no empty circles
            let imageUrl = null;
            let imageTransformations = null;
            
            if (data) {
                // Check if it's a creature token
                if (data.type === 'creature' || data.creatureId || data.tokenIcon) {
                    // Use custom icon if available, otherwise use token icon
                    // Check multiple possible locations for the icon - match CreatureToken logic exactly
                    const customIcon = data.state?.customIcon || 
                                     data.customTokenImage || 
                                     data.customIcon ||
                                     (data.state && data.state.customIcon);
                    // Get token icon - creature data should be merged in, so tokenIcon should be available
                    const tokenIcon = data.tokenIcon || data.icon;
                    
                    if (customIcon) {
                        imageUrl = customIcon;
                    } else if (tokenIcon) {
                        // Use the same getCreatureTokenIconUrl logic as CreatureToken
                        const creatureType = data.type || data.creatureType;
                        imageUrl = getCreatureTokenIconUrl(tokenIcon, creatureType);
                    }
                    
                    // Get image transformations from token state - match CreatureToken logic
                    if (data.state?.iconScale) {
                        imageTransformations = {
                            scale: data.state.iconScale / 100,
                            positionX: data.state.iconPosition?.x || 50,
                            positionY: data.state.iconPosition?.y || 50
                        };
                    } else if (data.imageTransformations) {
                        imageTransformations = data.imageTransformations;
                    }
                } 
                // Check if it's a character token
                else if (data.type === 'character' || data.characterId || data.characterImage || data.lore?.characterImage) {
                    // Check multiple possible locations for character image
                    imageUrl = data.characterImage || 
                              data.lore?.characterImage || 
                              data.lore?.characterIcon ||
                              data.characterIcon;
                    imageTransformations = data.lore?.imageTransformations;
                }
            }
            
            // Only render afterimage if we have an image URL - no empty circles
            if (!imageUrl) {
                ctx.restore();
                return; // Skip rendering if no image available
            }
            
            // Render token afterimage with ghostly appearance
            ctx.save();
            ctx.globalAlpha = 0.85; // More visible afterimage - ghostly but clear
            
            // Draw ghostly background fill for the token
            ctx.fillStyle = 'rgba(80, 70, 100, 0.6)'; // Ghostly purple-gray background
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, tokenSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw token border/circle with ghostly glow
            const borderColor = data?.tokenBorder || '#8888aa';
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 3;
            ctx.shadowColor = 'rgba(150, 140, 180, 0.8)';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, tokenSize / 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Try to get cached image or load it
            const cachedEntry = imageCacheRef.current.get(imageUrl);
            const img = cachedEntry?.loaded ? cachedEntry.image : null;
            
            if (img && img.complete && img.naturalWidth > 0) {
                // Image is loaded and valid - draw it synchronously
                // Create a temporary canvas to apply grayscale filter
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = tokenSize;
                tempCanvas.height = tokenSize;
                const tempCtx = tempCanvas.getContext('2d');
                
                // Draw image to temp canvas
                tempCtx.save();
                tempCtx.beginPath();
                tempCtx.arc(tokenSize / 2, tokenSize / 2, tokenSize / 2, 0, Math.PI * 2);
                tempCtx.clip();
                
                // Apply image transformations if available - match CreatureToken logic
                const scale = imageTransformations?.scale || (data?.state?.iconScale ? data.state.iconScale / 100 : 1);
                const posX = imageTransformations?.positionX || (data?.state?.iconPosition?.x || 50);
                const posY = imageTransformations?.positionY || (data?.state?.iconPosition?.y || 50);
                const rotation = imageTransformations?.rotation || 0;
                
                // Match CreatureToken rendering logic
                tempCtx.translate(tokenSize / 2, tokenSize / 2);
                if (rotation) {
                    tempCtx.rotate((rotation * Math.PI) / 180);
                }
                tempCtx.scale(scale, scale);
                tempCtx.translate(-tokenSize / 2, -tokenSize / 2);
                
                // Calculate image position - match CreatureToken backgroundPosition logic
                const imgX = (tokenSize / 2) - (tokenSize * scale / 2) + ((posX - 50) * tokenSize * scale / 100);
                const imgY = (tokenSize / 2) - (tokenSize * scale / 2) - ((posY - 50) * tokenSize * scale / 100);
                
                // Draw image centered and scaled
                tempCtx.drawImage(img, imgX, imgY, tokenSize * scale, tokenSize * scale);
                tempCtx.restore();
                
                // Apply grayscale + slight blue tint for ghostly memory effect
                const imageData = tempCtx.getImageData(0, 0, tokenSize, tokenSize);
                const data_array = imageData.data;
                for (let i = 0; i < data_array.length; i += 4) {
                    const gray = data_array[i] * 0.299 + data_array[i + 1] * 0.587 + data_array[i + 2] * 0.114;
                    // Add slight blue tint for ghostly effect
                    data_array[i] = gray * 0.85;           // Red - slightly reduced
                    data_array[i + 1] = gray * 0.9;        // Green - slightly reduced
                    data_array[i + 2] = gray * 1.1;        // Blue - slightly boosted
                }
                tempCtx.putImageData(imageData, 0, 0);
                
                // Draw the processed image to the main canvas
                ctx.save();
                ctx.beginPath();
                ctx.arc(screenPos.x, screenPos.y, tokenSize / 2, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(tempCanvas, screenPos.x - tokenSize / 2, screenPos.y - tokenSize / 2);
                ctx.restore();
            } else {
                // Image not loaded yet - render placeholder ghost circle while loading
                if (!cachedEntry || !cachedEntry.loaded) {
                    loadImage(imageUrl);
                }
                // Draw a "?" or silhouette placeholder
                ctx.fillStyle = 'rgba(120, 110, 140, 0.7)';
                ctx.font = `bold ${tokenSize * 0.5}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', screenPos.x, screenPos.y);
            }

            ctx.restore();
        });
    }, [
        afterimageEnabled,
        isGMMode,
        dynamicFogEnabled,
        viewingFromToken,
        exploredAreas,
        memorySnapshots,
        tokenAfterimages,
        visibleAreaSet,
        effectiveZoom,
        gridSize,
        gridToWorld,
        worldToScreen,
        gridToScreenForWalls,
        terrainData,
        wallData,
        gridItems
    ]);

    // Throttle rendering for performance
    const throttledRenderRef = useRef(null);

    useEffect(() => {
        throttledRenderRef.current = rafThrottle(renderAfterimages);
    }, [renderAfterimages]);

    // Preload images for all afterimages (tokens, terrain, items)
    useEffect(() => {
        if (!afterimageEnabled || isGMMode || !dynamicFogEnabled || !viewingFromToken) return;
        
        let hasNewImages = false;
        
        // Load images for terrain tiles from memory snapshots
        Object.values(memorySnapshots).forEach(snapshot => {
            if (snapshot.terrain) {
                let terrainType, variationIndex;
                if (typeof snapshot.terrain === 'string') {
                    terrainType = snapshot.terrain;
                    variationIndex = 0;
                } else if (snapshot.terrain && typeof snapshot.terrain === 'object') {
                    terrainType = snapshot.terrain.type;
                    variationIndex = snapshot.terrain.variation || 0;
                } else {
                    return;
                }
                
                const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];
                if (terrain && terrain.tileVariations && terrain.tileVariations.length > 0) {
                    const tileVariationPath = terrain.tileVariations[variationIndex] || terrain.tileVariations[0];
                    const cachedEntry = imageCacheRef.current.get(tileVariationPath);
                    if (!cachedEntry || !cachedEntry.loaded) {
                        hasNewImages = true;
                        loadImage(tileVariationPath);
                    }
                }
            }
            
            // Load images for grid items (loot orbs)
            if (snapshot.gridItems && snapshot.gridItems.length > 0) {
                snapshot.gridItems.forEach(item => {
                    const itemIdToLookup = item.itemId || item.originalItemStoreId;
                    if (itemIdToLookup) {
                        const itemStore = useItemStore.getState();
                        const originalItem = itemStore.items.find(i => 
                            i.id === item.itemId || i.id === item.originalItemStoreId
                        );
                        
                        const getItemIcon = (type, subtype) => {
                            const typeIcons = {
                                weapon: 'inv_sword_04',
                                armor: 'inv_chest_cloth_01',
                                accessory: 'inv_jewelry_ring_01',
                                consumable: 'inv_potion_51',
                                miscellaneous: 'inv_misc_questionmark',
                                material: 'inv_fabric_wool_01',
                                quest: 'inv_misc_note_01',
                                container: 'inv_box_01'
                            };
                            return typeIcons[type] || 'inv_misc_questionmark';
                        };
                        
                        const itemForTooltip = originalItem ? {
                            ...originalItem,
                            quantity: item.quantity || 1
                        } : {
                            ...item,
                            id: itemIdToLookup,
                            type: item.type || 'misc'
                        };
                        
                        const iconId = itemForTooltip.iconId || 
                                     (originalItem && originalItem.iconId) ||
                                     getItemIcon(itemForTooltip.type, itemForTooltip.subtype);
                        const iconUrl = getIconUrl(iconId, 'items');
                        
                        const cachedEntry = imageCacheRef.current.get(iconUrl);
                        if (!cachedEntry || !cachedEntry.loaded) {
                            hasNewImages = true;
                            loadImage(iconUrl);
                        }
                    }
                });
            }
        });
        
        // Load images for all token afterimages
        Object.entries(tokenAfterimages).forEach(([tokenId, afterimage]) => {
            const { data } = afterimage;
            let imageUrl = null;
            
            if (data) {
                // Use the same logic as the render function to extract image URL
                if (data.type === 'creature' || data.creatureId || data.tokenIcon) {
                    // Check multiple possible locations for the icon
                    const customIcon = data.state?.customIcon || 
                                     data.customTokenImage || 
                                     data.customIcon ||
                                     (data.state && data.state.customIcon);
                    const tokenIcon = data.tokenIcon || data.icon;
                    
                    if (customIcon) {
                        imageUrl = customIcon;
                    } else if (tokenIcon) {
                        imageUrl = getCreatureTokenIconUrl(tokenIcon, data.type);
                    }
                } else if (data.type === 'character' || data.characterId || data.characterImage || data.lore?.characterImage) {
                    imageUrl = data.characterImage || 
                              data.lore?.characterImage || 
                              data.lore?.characterIcon ||
                              data.characterIcon;
                }
            }
            
            if (imageUrl) {
                const cachedEntry = imageCacheRef.current.get(imageUrl);
                if (!cachedEntry || !cachedEntry.loaded) {
                    hasNewImages = true;
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    
                    const entry = { loaded: false, image: null };
                    imageCacheRef.current.set(imageUrl, entry);
                    
                    img.onload = () => {
                        entry.loaded = true;
                        entry.image = img;
                        // Trigger re-render when image loads
                        setImageLoadTrigger(prev => prev + 1);
                    };
                    
                    img.onerror = () => {
                        entry.loaded = false;
                        entry.image = null;
                        // Still trigger re-render even on error to show fallback
                        setImageLoadTrigger(prev => prev + 1);
                    };
                    
                    img.src = imageUrl;
                }
            }
        });
        
        // If we started loading new images, trigger a render after a short delay
        // This ensures the canvas re-renders once images are loaded
        if (hasNewImages) {
            const timeoutId = setTimeout(() => {
                if (throttledRenderRef.current) {
                    throttledRenderRef.current();
                }
            }, 100);
            
            return () => clearTimeout(timeoutId);
        }
    }, [tokenAfterimages, memorySnapshots, afterimageEnabled, isGMMode, dynamicFogEnabled, viewingFromToken, loadImage]);

    // Trigger render when non-camera dependencies change
    useEffect(() => {
        if (throttledRenderRef.current) {
            throttledRenderRef.current();
        }
    }, [
        afterimageEnabled,
        isGMMode,
        dynamicFogEnabled,
        viewingFromToken,
        exploredAreas,
        memorySnapshots,
        tokenAfterimages,
        visibleArea,
        // PERFORMANCE FIX: Removed cameraX/cameraY - camera changes handled by subscription below
        effectiveZoom,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        imageLoadTrigger // Trigger re-render when images load
    ]);
    
    // Subscribe to camera changes and trigger re-renders via RAF throttling
    useEffect(() => {
        const unsubscribe = useGameStore.subscribe((state, prevState) => {
            // Trigger re-render on camera/zoom changes
            if (
                state.cameraX !== prevState.cameraX ||
                state.cameraY !== prevState.cameraY ||
                state.zoomLevel !== prevState.zoomLevel ||
                state.playerZoom !== prevState.playerZoom
            ) {
                // Use RAF-throttled render for smooth updates during drag
                if (throttledRenderRef.current) {
                    throttledRenderRef.current();
                }
            }
        });
        
        return () => unsubscribe();
    }, []);

    // Don't render if afterimages are disabled or in GM mode
    if (!afterimageEnabled || isGMMode || !dynamicFogEnabled || !viewingFromToken) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 20001, // ABOVE fog (20000) so afterimages are visible on top of explored fog
                mixBlendMode: 'normal' // Normal blend so afterimages are clearly visible
            }}
        />
    );
};

export default AfterimageOverlay;

