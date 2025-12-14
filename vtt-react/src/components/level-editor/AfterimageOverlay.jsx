import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { rafThrottle } from '../../utils/performanceUtils';

/**
 * AfterimageOverlay - Renders afterimages of previously explored areas and tokens
 * This component shows "memories" of what was visible when areas were last explored
 */
const AfterimageOverlay = () => {
    const canvasRef = useRef(null);
    // Cache for loaded images to avoid reloading
    const imageCacheRef = useRef(new Map());

    const {
        gridSize,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom,
        isGMMode
    } = useGameStore();

    const {
        afterimageEnabled,
        dynamicFogEnabled,
        exploredAreas,
        memorySnapshots,
        tokenAfterimages,
        viewingFromToken,
        visibleArea,
        wallData,
        terrainData,
        environmentalObjects,
        dndElements
    } = useLevelEditorStore();

    const { tokens } = useCreatureStore();
    const { characterTokens } = useCharacterTokenStore();
    const { tokens: creatureTokens } = useCreatureStore();

    const effectiveZoom = zoomLevel * playerZoom;
    
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
                resolve(img);
            };
            img.onerror = () => {
                entry.loaded = false;
                entry.image = null;
                // Instead of rejecting with an error, resolve with null to handle gracefully
                resolve(null);
            };
            img.src = url;
        });
        
        return null; // Return null for async loading
    }, []);

    // Convert world coordinates to screen coordinates
    const worldToScreen = useCallback((worldX, worldY) => {
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        return gridSystem.worldToScreen(worldX, worldY, viewport.width, viewport.height);
    }, [cameraX, cameraY, effectiveZoom]);

    // Convert grid coordinates to world coordinates using grid system for proper alignment
    const gridToWorld = useCallback((gridX, gridY) => {
        const gridSystem = getGridSystem();
        // Use grid system's gridToWorld to get centered position (matches token positioning)
        return gridSystem.gridToWorld(gridX, gridY);
    }, []);

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

        // Render memory snapshots for previously explored areas
        // Process all snapshots but use viewport culling for performance
        Object.entries(memorySnapshots).forEach(([tileKey, snapshot]) => {
            const [gridX, gridY] = tileKey.split(',').map(Number);
            const tileWorldPos = gridToWorld(gridX, gridY);
            const screenPos = worldToScreen(tileWorldPos.x, tileWorldPos.y);
            const tileSize = gridSize * effectiveZoom;

            // Viewport culling - skip if outside viewport (early exit for performance)
            if (screenPos.x < minScreenX - tileSize || screenPos.x > maxScreenX + tileSize ||
                screenPos.y < minScreenY - tileSize || screenPos.y > maxScreenY + tileSize) {
                return; // Outside viewport
            }

            // Check if this tile is currently visible (if so, don't show afterimage)
            if (visibleAreaSet.has(tileKey)) {
                return; // Currently visible - show real-time view instead
            }

            // Check if this tile was explored
            if (!exploredAreas[tileKey]) {
                return; // Not explored - don't show afterimage
            }

            // Render shadowy afterimage with reduced opacity
            ctx.save();
            ctx.globalAlpha = 0.4; // Shadowy appearance
            ctx.fillStyle = 'rgba(100, 100, 100, 0.3)'; // Slightly lit up background
            
            // Draw a subtle background for explored areas
            ctx.fillRect(
                screenPos.x - tileSize / 2,
                screenPos.y - tileSize / 2,
                tileSize,
                tileSize
            );

            // Render terrain afterimage if available
            if (snapshot.terrain) {
                ctx.globalAlpha = 0.3;
                // You can add terrain rendering here if needed
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

            ctx.restore();
        });

        // Render token afterimages (reuse viewport bounds from above)
        Object.entries(tokenAfterimages).forEach(([tokenId, afterimage]) => {
            const { position, data } = afterimage;
            // Position is already in grid coordinates (x, y)
            const tokenWorldPos = gridToWorld(position.x, position.y);
            const screenPos = worldToScreen(tokenWorldPos.x, tokenWorldPos.y);
            
            // Viewport culling - skip if outside viewport
            if (screenPos.x < minScreenX || screenPos.x > maxScreenX ||
                screenPos.y < minScreenY || screenPos.y > maxScreenY) {
                return; // Outside viewport
            }
            
            const tokenSize = gridSize * effectiveZoom * 0.8; // Slightly smaller than real token

            // Check if this position is in an explored area - afterimages should show in fog
            const exploredTileKey = `${position.x},${position.y}`;
            const isExplored = exploredAreas[exploredTileKey];

            if (!isExplored) {
                // Not explored yet - don't show afterimage
                return;
            }

            // Check if the real token corresponding to this afterimage is currently visible
            // If the real token is visible (in the visibleAreaSet), don't show its afterimage
            const allTokens = [...creatureTokens, ...(characterTokens || [])];
            const realToken = allTokens.find(t => t.id === tokenId);

            if (realToken && realToken.position) {
                // Calculate the real token's grid position
                const realTokenGridX = Math.floor((realToken.position.x - gridOffsetX) / gridSize);
                const realTokenGridY = Math.floor((realToken.position.y - gridOffsetY) / gridSize);
                const realTokenTileKey = `${realTokenGridX},${realTokenGridY}`;
                
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
                        // Use the same getIconUrl logic as CreatureToken
                        imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${tokenIcon}.jpg`;
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
        worldToScreen
    ]);

    // Throttle rendering for performance
    const throttledRenderRef = useRef(null);
    const [imageLoadTrigger, setImageLoadTrigger] = useState(0);

    useEffect(() => {
        throttledRenderRef.current = rafThrottle(renderAfterimages);
    }, [renderAfterimages]);

    // Preload images for all token afterimages
    useEffect(() => {
        if (!afterimageEnabled || isGMMode || !dynamicFogEnabled || !viewingFromToken) return;
        
        let hasNewImages = false;
        
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
                        imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${tokenIcon}.jpg`;
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
    }, [tokenAfterimages, afterimageEnabled, isGMMode, dynamicFogEnabled, viewingFromToken]);

    // Trigger render when dependencies change
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
        cameraX,
        cameraY,
        effectiveZoom,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        imageLoadTrigger // Trigger re-render when images load
    ]);

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

