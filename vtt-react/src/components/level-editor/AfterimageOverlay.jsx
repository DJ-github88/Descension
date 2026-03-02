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
    // UPDATED: Now uses per-player memory system
    const afterimageEnabled = useLevelEditorStore(state => state.afterimageEnabled);
    const dynamicFogEnabled = useLevelEditorStore(state => state.dynamicFogEnabled);
    const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
    const visibleArea = useLevelEditorStore(state => state.visibleArea);
    const wallData = useLevelEditorStore(state => state.wallData);
    const terrainData = useLevelEditorStore(state => state.terrainData);
    const environmentalObjects = useLevelEditorStore(state => state.environmentalObjects);
    const dndElements = useLevelEditorStore(state => state.dndElements);

    // Per-player memory subscriptions
    const currentPlayerId = useLevelEditorStore(state => state.currentPlayerId);
    const playerMemories = useLevelEditorStore(state => state.playerMemories);
    const isPlayerPositionExplored = useLevelEditorStore(state => state.isPlayerPositionExplored);
    const getPlayerTokenAfterimages = useLevelEditorStore(state => state.getPlayerTokenAfterimages);
    const getPlayerMemorySnapshots = useLevelEditorStore(state => state.getPlayerMemorySnapshots);

    // Legacy subscriptions for backward compatibility
    const exploredAreas = useLevelEditorStore(state => state.exploredAreas);
    const memorySnapshots = useLevelEditorStore(state => state.memorySnapshots);
    const tokenAfterimages = useLevelEditorStore(state => state.tokenAfterimages);

    const { characterTokens } = useCharacterTokenStore();
    const { creatureTokens } = useCreatureStore();
    const { gridItems } = useGridItemStore();

    // Get current player's memories (with fallback to legacy)
    const currentPlayerMemories = useMemo(() => {
        if (!currentPlayerId || !playerMemories) return null;
        return playerMemories[currentPlayerId] || null;
    }, [currentPlayerId, playerMemories]);

    // Get current player's token afterimages (with fallback to legacy)
    const currentTokenAfterimages = useMemo(() => {
        return currentPlayerMemories?.tokenAfterimages || tokenAfterimages || {};
    }, [currentPlayerMemories, tokenAfterimages]);

    // Get current player's memory snapshots (with fallback to legacy)
    const currentMemorySnapshots = useMemo(() => {
        if (currentPlayerMemories?.memorySnapshots) {
            return currentPlayerMemories.memorySnapshots;
        }
        return memorySnapshots || {};
    }, [currentPlayerMemories, memorySnapshots]);

    const effectiveZoom = zoomLevel * playerZoom;

    // Cache for processed (grayscale) images to avoid reprocessing every frame
    const processedImageCacheRef = useRef(new Map());

    // Throttle debug logging
    const lastLogTimeRef = useRef(0);

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

    // Render afterimages on canvas - FULL IMPLEMENTATION with terrain/walls/loot/tokens
    const renderAfterimages = useCallback(() => {
        const canvas = canvasRef.current;

        if (!canvas || !afterimageEnabled || isGMMode || !dynamicFogEnabled || !viewingFromToken) {
            // Only log if there might be afterimages to show but conditions aren't met
            if (Object.keys(currentTokenAfterimages).length > 0) {
                console.log('🖼️ [AfterimageOverlay] Not rendering - conditions:', {
                    hasCanvas: !!canvas,
                    afterimageEnabled,
                    isGMMode,
                    dynamicFogEnabled,
                    viewingFromToken: !!viewingFromToken,
                    afterimageCount: Object.keys(currentTokenAfterimages).length
                });
            }
            return;
        }

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        // Resize canvas if needed
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get viewport bounds for culling
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        const padding = 100;
        const minScreenX = -padding;
        const maxScreenX = viewport.width + padding;
        const minScreenY = -padding;
        const maxScreenY = viewport.height + padding;

        const tileSize = gridSize * effectiveZoom;
        const levelEditorStore = useLevelEditorStore.getState();

        // DEBUG: Log player memory state (throttled to every 2 seconds)
        const now = Date.now();
        if (now - lastLogTimeRef.current > 2000) {
            lastLogTimeRef.current = now;
            const playerMemoryState = levelEditorStore.playerMemories?.[levelEditorStore.currentPlayerId];
            const tokenAfterimagesKeys = Object.keys(playerMemoryState?.tokenAfterimages || {});
            const currentTokenAfterimagesKeys = Object.keys(currentTokenAfterimages || {});
            console.log('🖼️ [AfterimageOverlay] State:',
                'currentPlayerId=', levelEditorStore.currentPlayerId,
                'exploredPolygons=', (playerMemoryState?.exploredPolygons || []).length,
                'tokenAfterimages=', tokenAfterimagesKeys.length,
                'keys=', tokenAfterimagesKeys,
                'currentTokenAfterimages=', currentTokenAfterimagesKeys.length,
                'afterimageEnabled=', afterimageEnabled,
                'dynamicFogEnabled=', dynamicFogEnabled,
                'viewingFromToken=', viewingFromToken?.id,
                'visibleAreaSize=', visibleAreaSet?.size
            );
        }

        // Helper: Check if tile is currently visible
        const isTileVisible = (worldX, worldY) => {
            if (!visibleAreaSet || visibleAreaSet.size === 0) return false;
            const gridCoords = gridSystem.worldToGrid(worldX, worldY);
            const tileKey = `${gridCoords.x},${gridCoords.y}`;
            return visibleAreaSet.has(tileKey);
        };

        // Helper: Check if position has been explored by the player
        const isExploredPos = (worldX, worldY) => {
            return isPlayerPositionExplored(worldX, worldY);
        };

        // =====================================================
        // 1. RENDER TERRAIN TILE AFTERIMAGES
        // =====================================================
        const snapshotEntries = Object.entries(currentMemorySnapshots);
        const maxTerrainToRender = 100; // Limit for performance

        let terrainRendered = 0;
        for (const [tileKey, snapshot] of snapshotEntries) {
            if (terrainRendered >= maxTerrainToRender) break;
            if (!snapshot?.terrain) continue;

            // Parse tile coordinates
            const [coordX, coordY] = tileKey.split(',').map(Number);
            const worldPos = gridSystem.gridToWorld(coordX, coordY);

            // Skip if currently visible
            if (isTileVisible(worldPos.x, worldPos.y)) continue;

            // Skip if not explored
            if (!isExploredPos(worldPos.x, worldPos.y)) continue;

            const screenPos = worldToScreen(worldPos.x, worldPos.y);

            // Viewport culling
            if (screenPos.x < minScreenX - tileSize || screenPos.x > maxScreenX + tileSize ||
                screenPos.y < minScreenY - tileSize || screenPos.y > maxScreenY + tileSize) {
                continue;
            }

            // Get terrain type and variation
            let terrainType, variationIndex;
            if (typeof snapshot.terrain === 'string') {
                terrainType = snapshot.terrain;
                variationIndex = 0;
            } else if (snapshot.terrain && typeof snapshot.terrain === 'object') {
                terrainType = snapshot.terrain.type;
                variationIndex = snapshot.terrain.variation || 0;
            } else {
                continue;
            }

            const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];
            if (!terrain) continue;

            // Determine image path: prefer tileVariations, fall back to terrain.texture
            const tileVariationPath = terrain.tileVariations?.length
                ? (terrain.tileVariations[variationIndex] || terrain.tileVariations[0])
                : (terrain.texture || null);

            if (tileVariationPath) {
                // Image-based terrain tile
                const cachedEntry = imageCacheRef.current.get(tileVariationPath);
                const img = cachedEntry?.loaded ? cachedEntry.image : null;

                if (img && img.complete && img.naturalWidth > 0) {
                    const grayCanvas = getGrayscaleCanvas(img, tileSize, tileVariationPath);
                    if (grayCanvas) {
                        ctx.save();
                        ctx.globalAlpha = 0.6;
                        ctx.drawImage(grayCanvas, screenPos.x - tileSize / 2, screenPos.y - tileSize / 2);
                        ctx.restore();
                        terrainRendered++;
                    }
                } else if (!cachedEntry || !cachedEntry.loaded) {
                    loadImage(tileVariationPath);
                }
            } else if (terrain.color) {
                // Color-based terrain tile (procedural) — draw as greyscale rectangle
                // Convert hex color to greyscale value
                const hexColor = terrain.color.replace('#', '');
                const r = parseInt(hexColor.substring(0, 2), 16);
                const g = parseInt(hexColor.substring(2, 4), 16);
                const b = parseInt(hexColor.substring(4, 6), 16);
                const gray = Math.floor(r * 0.299 + g * 0.587 + b * 0.114);
                // Darken slightly for a "memory" look, slight blue tint
                const dr = Math.floor(gray * 0.85);
                const dg = Math.floor(gray * 0.88);
                const db = Math.floor(gray * 1.05);

                ctx.save();
                ctx.globalAlpha = 0.55;
                ctx.fillStyle = `rgb(${dr},${dg},${db})`;
                ctx.fillRect(screenPos.x - tileSize / 2, screenPos.y - tileSize / 2, tileSize, tileSize);
                // Subtle border so tiles are distinguishable
                ctx.globalAlpha = 0.2;
                ctx.strokeStyle = `rgb(${Math.floor(dr * 0.7)},${Math.floor(dg * 0.7)},${Math.floor(db * 0.7)})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(screenPos.x - tileSize / 2, screenPos.y - tileSize / 2, tileSize, tileSize);
                ctx.restore();
                terrainRendered++;
            }
        }

        // =====================================================
        // 2. RENDER WALL AFTERIMAGES
        // =====================================================
        const wallEntries = Object.entries(wallData || {});
        const maxWallsToRender = 50;

        let wallsRendered = 0;
        for (const [wallKey, wall] of wallEntries) {
            if (wallsRendered >= maxWallsToRender) break;

            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

            // Get world positions for wall endpoints
            const worldPos1 = gridSystem.gridToWorldCorner(x1, y1);
            const worldPos2 = gridSystem.gridToWorldCorner(x2, y2);
            const midX = (worldPos1.x + worldPos2.x) / 2;
            const midY = (worldPos1.y + worldPos2.y) / 2;

            // Skip if currently visible
            if (isTileVisible(midX, midY)) continue;

            // Skip if not explored
            if (!isExploredPos(midX, midY)) continue;

            const screenPos1 = worldToScreen(worldPos1.x, worldPos1.y);
            const screenPos2 = worldToScreen(worldPos2.x, worldPos2.y);

            // Viewport culling
            const minX = Math.min(screenPos1.x, screenPos2.x);
            const maxX = Math.max(screenPos1.x, screenPos2.x);
            const minY = Math.min(screenPos1.y, screenPos2.y);
            const maxY = Math.max(screenPos1.y, screenPos2.y);

            if (maxX < minScreenX || minX > maxScreenX || maxY < minScreenY || minY > maxScreenY) {
                continue;
            }

            // Draw ghostly wall
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = '#667788';
            ctx.lineWidth = 3 * effectiveZoom;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(screenPos1.x, screenPos1.y);
            ctx.lineTo(screenPos2.x, screenPos2.y);
            ctx.stroke();

            ctx.restore();
            wallsRendered++;
        }

        // =====================================================
        // 3. RENDER LOOT ORB AFTERIMAGES (from grid items)
        // =====================================================
        const maxLootToRender = 30;
        let lootRendered = 0;

        for (const [tileKey, snapshot] of snapshotEntries) {
            if (lootRendered >= maxLootToRender) break;
            if (!snapshot?.gridItems?.length) continue;

            const [coordX, coordY] = tileKey.split(',').map(Number);
            const worldPos = gridSystem.gridToWorld(coordX, coordY);

            // Skip if currently visible
            if (isTileVisible(worldPos.x, worldPos.y)) continue;

            // Skip if not explored
            if (!isExploredPos(worldPos.x, worldPos.y)) continue;

            const screenPos = worldToScreen(worldPos.x, worldPos.y);

            // Viewport culling
            if (screenPos.x < minScreenX - tileSize || screenPos.x > maxScreenX + tileSize ||
                screenPos.y < minScreenY - tileSize || screenPos.y > maxScreenY + tileSize) {
                continue;
            }

            for (const item of snapshot.gridItems) {
                if (lootRendered >= maxLootToRender) break;

                const itemIdToLookup = item.itemId || item.originalItemStoreId;
                if (!itemIdToLookup) continue;

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

                const iconId = item.iconId || (originalItem && originalItem.iconId) ||
                    getItemIcon(item.type, item.subtype);
                const iconUrl = getIconUrl(iconId, 'items');

                const orbSize = tileSize * 0.5;

                // Draw ghostly loot orb
                ctx.save();
                ctx.globalAlpha = 1.0;

                // Draw orb background
                const rarity = item.rarity || 'common';
                const rarityColor = RARITY_COLORS[rarity] || '#888888';
                // Safety check: ensure rarityColor is a valid hex string
                const safeColor = (typeof rarityColor === 'string' && rarityColor.startsWith('#'))
                    ? rarityColor
                    : '#888888';
                ctx.fillStyle = `rgba(${parseInt(safeColor.slice(1, 3), 16)}, ${parseInt(safeColor.slice(3, 5), 16)}, ${parseInt(safeColor.slice(5, 7), 16)}, 0.3)`;
                ctx.beginPath();
                ctx.arc(screenPos.x, screenPos.y, orbSize / 2, 0, Math.PI * 2);
                ctx.fill();

                // Draw orb border
                ctx.strokeStyle = '#667788';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(screenPos.x, screenPos.y, orbSize / 2, 0, Math.PI * 2);
                ctx.stroke();

                // Load and draw icon
                const cachedEntry = imageCacheRef.current.get(iconUrl);
                const img = cachedEntry?.loaded ? cachedEntry.image : null;

                if (img && img.complete && img.naturalWidth > 0) {
                    const grayCanvas = getGrayscaleCanvas(img, orbSize, iconUrl);
                    if (grayCanvas) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(screenPos.x, screenPos.y, orbSize / 2 - 2, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(grayCanvas, screenPos.x - orbSize / 2 + 2, screenPos.y - orbSize / 2 + 2);
                        ctx.restore();
                    }
                } else if (!cachedEntry || !cachedEntry.loaded) {
                    loadImage(iconUrl);
                }

                ctx.restore();
                lootRendered++;
            }
        }

        // =====================================================
        // 4. RENDER TOKEN AFTERIMAGES (existing logic)
        // =====================================================
        const afterimageEntries = Object.entries(currentTokenAfterimages);
        const maxTokensToRender = 20;
        const afterimagesToRender = afterimageEntries.slice(0, maxTokensToRender);

        if (afterimageEntries.length > 0) {
            console.log('🖼️ [AfterimageOverlay] Rendering token afterimages:', afterimageEntries.length, 'tokens');
        }

        let afterimagesActuallyRendered = 0;

        afterimageEntries.forEach(([tokenId, afterimage]) => {
            if (afterimagesActuallyRendered >= maxTokensToRender) return;

            const { position, data } = afterimage;

            // ALWAYS LOG for debugging creature afterimage issues
            console.log('🖼️ [AfterimageOverlay] Processing afterimage:', {
                tokenId,
                hasPosition: !!position,
                hasWorldPosition: !!position?.worldPosition,
                positionData: position,
                hasData: !!data,
                dataType: data?.type,
                dataCreatureId: data?.creatureId,
                dataIcon: data?.icon,
                dataTokenIcon: data?.tokenIcon,
                dataCustomIcon: data?.customIcon,
                dataStateCustomIcon: data?.state?.customIcon
            });

            if (!position) {
                console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} SKIPPED - no position in afterimage`);
                return;
            }

            let tokenWorldPos;
            if (position.worldPosition) {
                tokenWorldPos = position.worldPosition;
            } else if (position.x !== undefined && position.y !== undefined) {
                tokenWorldPos = gridToWorld(position.x, position.y);
            } else {
                console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} SKIPPED - no valid position format`);
                return;
            }

            console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} worldPos:`, tokenWorldPos);

            // Skip if not explored - ALWAYS LOG THIS CHECK
            const isExplored = isExploredPos(tokenWorldPos.x, tokenWorldPos.y);
            console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} isExplored:`, isExplored);
            if (!isExplored) {
                console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} SKIPPED - NOT EXPLORED. Pos:`, tokenWorldPos);
                return;
            }

            // NOTE: We intentionally do NOT skip if the last-seen tile is currently visible.
            // Tokens are mobile — the creature may have moved OUT of view even though the player
            // can still see the tile where they last spotted it. The afterimage is a memory of
            // where the token WAS, and it must remain visible at that spot until the player sees
            // the token again at its new location.

            const screenPos = worldToScreen(tokenWorldPos.x, tokenWorldPos.y);
            console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} screenPos:`, screenPos);

            // Viewport culling
            if (screenPos.x < minScreenX || screenPos.x > maxScreenX ||
                screenPos.y < minScreenY || screenPos.y > maxScreenY) {
                console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} SKIPPED - OUTSIDE VIEWPORT. ScreenPos:`, screenPos, 'bounds:', { minScreenX, maxScreenX, minScreenY, maxScreenY });
                return;
            }

            const tokenSize = gridSize * effectiveZoom * 0.8;

            // Get image URL - ALWAYS LOG THIS
            let imageUrl = null;
            if (data) {
                console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} checking image URL. dataType:`, data.type, 'creatureId:', data.creatureId, 'tokenIcon:', data.tokenIcon, 'icon:', data.icon);
                if (data.type === 'creature' || data.creatureId || data.tokenIcon) {
                    const customIcon = data.state?.customIcon || data.customTokenImage || data.customIcon;
                    const tokenIcon = data.tokenIcon || data.icon;
                    console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} creature path - customIcon:`, customIcon, 'tokenIcon:', tokenIcon);
                    if (customIcon) {
                        imageUrl = customIcon;
                    } else if (tokenIcon) {
                        imageUrl = getCreatureTokenIconUrl(tokenIcon, data.type || data.creatureType);
                    }
                } else if (data.type === 'character' || data.characterId) {
                    imageUrl = data.characterImage || data.lore?.characterImage || data.characterIcon;
                    console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} character path - imageUrl:`, imageUrl);
                }
            }

            console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} final imageUrl:`, imageUrl);

            if (!imageUrl) {
                console.log(`🖼️ [AfterimageOverlay] Token ${tokenId} SKIPPED - NO IMAGE URL. Full data:`, JSON.stringify(data, null, 2));
                return;
            }

            console.log(`🖼️ [AfterimageOverlay] ✅ RENDERING afterimage for ${tokenId} with imageUrl:`, imageUrl);
            afterimagesActuallyRendered++;

            // Draw ghostly token
            ctx.save();
            ctx.globalAlpha = 1.0;

            // Background
            ctx.fillStyle = 'rgba(80, 70, 100, 0.5)';
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, tokenSize / 2, 0, Math.PI * 2);
            ctx.fill();

            // Border
            ctx.strokeStyle = data?.tokenBorder || '#8888aa';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, tokenSize / 2, 0, Math.PI * 2);
            ctx.stroke();

            // Load and draw image
            const cachedEntry = imageCacheRef.current.get(imageUrl);
            const img = cachedEntry?.loaded ? cachedEntry.image : null;

            if (img && img.complete && img.naturalWidth > 0) {
                const grayCanvas = getGrayscaleCanvas(img, tokenSize, imageUrl);
                if (grayCanvas) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(screenPos.x, screenPos.y, tokenSize / 2, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.drawImage(grayCanvas, screenPos.x - tokenSize / 2, screenPos.y - tokenSize / 2);
                    ctx.restore();
                }
            } else if (!cachedEntry || !cachedEntry.loaded) {
                loadImage(imageUrl);
            }

            ctx.restore();
        });

        if (afterimagesActuallyRendered > 0) {
            console.log('🖼️ [AfterimageOverlay] Total afterimages rendered:', afterimagesActuallyRendered);
        }
    }, [
        afterimageEnabled,
        isGMMode,
        dynamicFogEnabled,
        viewingFromToken,
        currentTokenAfterimages,
        currentMemorySnapshots,
        currentPlayerId,
        visibleAreaSet,
        effectiveZoom,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        wallData,
        gridToWorld,
        worldToScreen,
        getGrayscaleCanvas,
        loadImage,
        isPlayerPositionExplored,
        currentPlayerMemories
    ]);

    // Throttle rendering for performance
    const throttledRenderRef = useRef(null);

    useEffect(() => {
        throttledRenderRef.current = rafThrottle(renderAfterimages);
    }, [renderAfterimages]);

    // Preload images for all afterimages (tokens, terrain, items)
    useEffect(() => {
        if (!afterimageEnabled || isGMMode || !dynamicFogEnabled || !viewingFromToken) return;

        const gridSystem = getGridSystem();
        const cameraX = useGameStore.getState().cameraX;
        const cameraY = useGameStore.getState().cameraY;

        // Calculate viewport bounds in world coordinates
        const viewportWorldWidth = canvasRef.current?.width / effectiveZoom || 1000;
        const viewportWorldHeight = canvasRef.current?.height / effectiveZoom || 1000;

        const viewportLeft = cameraX - viewportWorldWidth / 2;
        const viewportRight = cameraX + viewportWorldWidth / 2;
        const viewportTop = cameraY - viewportWorldHeight / 2;
        const viewportBottom = cameraY + viewportWorldHeight / 2;

        // PERFORMANCE FIX: Helper to check if position is in viewport
        const isInViewport = (x, y) => {
            const buffer = 100;
            return x >= viewportLeft - buffer &&
                x <= viewportRight + buffer &&
                y >= viewportTop - buffer &&
                y <= viewportBottom + buffer;
        };

        let hasNewImages = false;

        // Load images for terrain tiles from memory snapshots
        Object.values(currentMemorySnapshots).forEach(snapshot => {
            // PERFORMANCE FIX: Only load terrain images that are in viewport
            if (snapshot.position && !isInViewport(snapshot.position.x, snapshot.position.y)) {
                return;
            }

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
                    // PERFORMANCE FIX: Only load item images that are in viewport
                    if (item.position && !isInViewport(item.position.x, item.position.y)) {
                        return;
                    }
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
        // UPDATED: Use per-player token afterimages with fallback to legacy
        Object.entries(currentTokenAfterimages).forEach(([tokenId, afterimage]) => {
            const { data } = afterimage;

            // PERFORMANCE FIX: Only load token images that are in viewport
            if (data.position && !isInViewport(data.position.x, data.position.y)) {
                return;
            }

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
    }, [currentTokenAfterimages, currentMemorySnapshots, afterimageEnabled, isGMMode, dynamicFogEnabled, viewingFromToken, loadImage]);

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
        imageLoadTrigger, // Trigger re-render when images load
        currentPlayerMemories
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

    // Afterimages render ABOVE the fog layer (z-index: 41) so they are visible in explored areas
    // Memories should be visible to help players remember what they've seen
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
                zIndex: 41, // ABOVE fog (40) so afterimages are visible in explored areas
                mixBlendMode: 'normal' // Normal blend so afterimages are clearly visible
            }}
        />
    );
};

export default AfterimageOverlay;

