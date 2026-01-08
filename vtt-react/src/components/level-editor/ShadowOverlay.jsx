import React, { useEffect, useRef, useCallback } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { calculateShadows } from '../../utils/LightingCalculations';
import './styles/ShadowOverlay.css';

/**
 * ShadowOverlay - Renders dynamic shadows cast by walls and objects
 * Creates realistic shadow effects for the lighting system
 */
const ShadowOverlay = () => {
    const canvasRef = useRef(null);
    const shadowDataRef = useRef({});
    
    // Level editor store
    const {
        lightSources,
        lightingEnabled,
        shadowCasting,
        shadowSoftness,
        shadowDistance,
        wallData,
        performanceMode
    } = useLevelEditorStore();

    // Game store for positioning
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

    const effectiveZoom = zoomLevel * playerZoom;
    const tileSize = gridSize || 50;

    // Calculate shadows for all light sources
    const calculateAllShadows = useCallback(() => {
        if (!lightingEnabled || !shadowCasting) {
            shadowDataRef.current = {};
            return;
        }

        const shadows = {};
        
        Object.values(lightSources).forEach(light => {
            if (light.enabled) {
                const lightShadows = calculateShadows(
                    light.x,
                    light.y,
                    light.radius,
                    wallData
                );
                
                // Merge shadows with existing data
                lightShadows.forEach(shadowTile => {
                    if (!shadows[shadowTile]) {
                        shadows[shadowTile] = [];
                    }
                    shadows[shadowTile].push({
                        lightId: light.id,
                        lightX: light.x,
                        lightY: light.y,
                        lightRadius: light.radius
                    });
                });
            }
        });
        
        shadowDataRef.current = shadows;
    }, [lightSources, lightingEnabled, shadowCasting, wallData]);

    // Render shadows on canvas
    const renderShadows = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!lightingEnabled || !shadowCasting || Object.keys(shadowDataRef.current).length === 0) {
            return;
        }

        // Calculate visible area
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const worldWidth = viewportWidth / effectiveZoom;
        const worldHeight = viewportHeight / effectiveZoom;
        const worldLeft = cameraX - worldWidth / 2;
        const worldRight = cameraX + worldWidth / 2;
        const worldTop = cameraY - worldHeight / 2;
        const worldBottom = cameraY + worldHeight / 2;

        // Render shadow tiles
        Object.entries(shadowDataRef.current).forEach(([tileKey, shadowSources]) => {
            const [x, y] = tileKey.split(',').map(Number);
            
            // Check if tile is visible
            const tileWorldX = x * tileSize + gridOffsetX;
            const tileWorldY = y * tileSize + gridOffsetY;
            
            if (tileWorldX + tileSize < worldLeft || tileWorldX > worldRight ||
                tileWorldY + tileSize < worldTop || tileWorldY > worldBottom) {
                return; // Skip invisible tiles
            }

            // Convert to screen coordinates
            const screenX = (tileWorldX - cameraX) * effectiveZoom + viewportWidth / 2;
            const screenY = (tileWorldY - cameraY) * effectiveZoom + viewportHeight / 2;
            const screenSize = tileSize * effectiveZoom;

            // Calculate shadow intensity based on number of light sources casting shadows
            const shadowIntensity = Math.min(0.8, shadowSources.length * 0.3);
            
            // Render shadow with soft edges if enabled
            if (shadowSoftness > 0 && !performanceMode) {
                // Soft shadow with gradient
                const gradient = ctx.createRadialGradient(
                    screenX + screenSize / 2, screenY + screenSize / 2, 0,
                    screenX + screenSize / 2, screenY + screenSize / 2, screenSize * (1 + shadowSoftness)
                );
                gradient.addColorStop(0, `rgba(0, 0, 0, ${shadowIntensity})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    screenX - screenSize * shadowSoftness / 2,
                    screenY - screenSize * shadowSoftness / 2,
                    screenSize * (1 + shadowSoftness),
                    screenSize * (1 + shadowSoftness)
                );
            } else {
                // Hard shadow
                ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity})`;
                ctx.fillRect(screenX, screenY, screenSize, screenSize);
            }
        });
    }, [
        lightingEnabled,
        shadowCasting,
        shadowSoftness,
        performanceMode,
        cameraX,
        cameraY,
        effectiveZoom,
        tileSize,
        gridOffsetX,
        gridOffsetY
    ]);

    // Update shadows when dependencies change
    useEffect(() => {
        calculateAllShadows();
    }, [calculateAllShadows]);

    // Render shadows when data or view changes
    useEffect(() => {
        renderShadows();
    }, [renderShadows, shadowDataRef.current]);

    // Update canvas size
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderShadows(); // Re-render after resize
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, [renderShadows]);

    // Animation loop for dynamic shadows
    useEffect(() => {
        if (!lightingEnabled || !shadowCasting) return;

        let animationId;
        
        const animate = () => {
            renderShadows();
            animationId = requestAnimationFrame(animate);
        };

        // Only animate if we have shadows to render
        if (Object.keys(shadowDataRef.current).length > 0) {
            animationId = requestAnimationFrame(animate);
        }

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [lightingEnabled, shadowCasting, renderShadows]);

    // Don't render if shadows are disabled
    if (!lightingEnabled || !shadowCasting) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className="shadow-overlay-canvas"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 160, // Above light sources but below UI
                opacity: isGMMode ? 1 : 0.8 // Slightly more visible for GM
            }}
        />
    );
};

export default ShadowOverlay;
