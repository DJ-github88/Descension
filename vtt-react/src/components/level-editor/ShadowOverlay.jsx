import React, { useEffect, useRef, useCallback } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { calculateShadows } from '../../utils/LightingCalculations';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import './styles/ShadowOverlay.css';

/**
 * ShadowOverlay - Renders dynamic shadows cast by walls and objects
 * Creates realistic shadow effects for the lighting system
 */
const ShadowOverlay = () => {
    const canvasRef = useRef(null);
    const shadowDataRef = useRef({});
    
    // Level editor store
    const lightSources = useLevelEditorStore(state => state.lightSources);
    const lightingEnabled = useLevelEditorStore(state => state.lightingEnabled);
    const wallData = useLevelEditorStore(state => state.wallData);
    const performanceMode = useLevelEditorStore(state => state.performanceMode);
    const sunSettings = useLevelEditorStore(state => state.sunSettings);
    const wallShadowsEnabled = useLevelEditorStore(state => state.wallShadowsEnabled);

    // Game store for positioning
    const gridSize = useGameStore(state => state.gridSize);
    const gridType = useGameStore(state => state.gridType);
    const gridOffsetX = useGameStore(state => state.gridOffsetX);
    const gridOffsetY = useGameStore(state => state.gridOffsetY);
    const cameraX = useGameStore(state => state.cameraX);
    const cameraY = useGameStore(state => state.cameraY);
    const zoomLevel = useGameStore(state => state.zoomLevel);
    const playerZoom = useGameStore(state => state.playerZoom);
    const isGMMode = useGameStore(state => state.isGMMode);
    const viewMode = useGameStore(state => state.viewMode);
    const viewRotation = useGameStore(state => state.viewRotation);
    const viewTilt = useGameStore(state => state.viewTilt);

    const effectiveZoom = zoomLevel * playerZoom;
    const tileSize = gridSize || 50;

    // Calculate shadows for all light sources
    const calculateAllShadows = useCallback(() => {
        if (!lightingEnabled) {
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
    }, [lightSources, lightingEnabled, wallData]);

    // Render shadows on canvas
    const renderShadows = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sun = sunSettings || { azimuth: 135, elevation: 45, intensity: 1.0, ambient: 0.2 };
        const sunActive = sun.intensity > 0.05;
        const hasLightShadows = Object.keys(shadowDataRef.current).length > 0;

        if (!lightingEnabled || (!hasLightShadows && !sunActive)) {
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
            if (!performanceMode) {
                const gradient = ctx.createRadialGradient(
                    screenX + screenSize / 2, screenY + screenSize / 2, 0,
                    screenX + screenSize / 2, screenY + screenSize / 2, screenSize * 1.5
                );
                gradient.addColorStop(0, `rgba(0, 0, 0, ${shadowIntensity})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    screenX - screenSize * 0.25,
                    screenY - screenSize * 0.25,
                    screenSize * 1.5,
                    screenSize * 1.5
                );
            } else {
                // Hard shadow
                ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity})`;
                ctx.fillRect(screenX, screenY, screenSize, screenSize);
            }
        });

        // === Directional sun shadows: walls projected along azimuth/elevation ===
        if (sunActive && wallShadowsEnabled !== false) {
            const gridSystem = getGridSystem();
            const elevationRad = Math.max(5, Math.min(90, sun.elevation ?? 45)) * (Math.PI / 180);
            const azimuthRad = ((sun.azimuth ?? 135) * Math.PI) / 180;
            const shadowAlpha = Math.min(0.45, 0.4 * sun.intensity * (1 - (sun.ambient ?? 0.2)));
            const wallHeightWorld = tileSize * 1.8;
            const maxShadowWorld = tileSize * 6;
            const projectionScale = 1 / Math.tan(elevationRad);
            const dirX = Math.sin(azimuthRad);
            const dirY = Math.cos(azimuthRad);

            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;

            let renderedShadows = 0;
            for (const [wallKey, wall] of Object.entries(wallData || {})) {
                if (renderedShadows >= 400) break;
                if (wall?.state === 'open') continue;
                const typeId = wall?.type;
                if (typeof typeId === 'string' && (
                    typeId.includes('window') ||
                    typeId === 'magical_barrier' ||
                    typeId === 'force_wall'
                )) {
                    continue;
                }

                const [wx1, wy1, wx2, wy2] = wallKey.split(',').map(Number);
                if (![wx1, wy1, wx2, wy2].every(Number.isFinite)) continue;

                let world1;
                let world2;
                if (gridType === 'hex') {
                    const edge = gridSystem.getHexEdge(wx1, wy1, wx2, wy2);
                    if (!edge) continue;
                    world1 = edge.start;
                    world2 = edge.end;
                } else {
                    world1 = gridSystem.gridToWorldCorner(wx1, wy1);
                    world2 = gridSystem.gridToWorldCorner(wx2, wy2);
                }

                const height = Number.isFinite(wall?.height) ? wall.height : wallHeightWorld;
                const shadowLength = Math.min(maxShadowWorld, height * projectionScale);
                const offX = dirX * shadowLength;
                const offY = dirY * shadowLength;

                const b1 = gridSystem.worldToScreen(world1.x, world1.y, viewportWidth, viewportHeight);
                const b2 = gridSystem.worldToScreen(world2.x, world2.y, viewportWidth, viewportHeight);
                const t1 = gridSystem.worldToScreen(world1.x + offX, world1.y + offY, viewportWidth, viewportHeight);
                const t2 = gridSystem.worldToScreen(world2.x + offX, world2.y + offY, viewportWidth, viewportHeight);

                const maxX = Math.max(b1.x, b2.x, t1.x, t2.x);
                const minX = Math.min(b1.x, b2.x, t1.x, t2.x);
                const maxY = Math.max(b1.y, b2.y, t1.y, t2.y);
                const minY = Math.min(b1.y, b2.y, t1.y, t2.y);
                if (maxX < 0 || minX > viewportWidth || maxY < 0 || minY > viewportHeight) continue;

                ctx.beginPath();
                ctx.moveTo(b1.x, b1.y);
                ctx.lineTo(b2.x, b2.y);
                ctx.lineTo(t2.x, t2.y);
                ctx.lineTo(t1.x, t1.y);
                ctx.closePath();
                ctx.fill();
                renderedShadows++;
            }

            ctx.restore();
        }
    }, [
        lightingEnabled,
        performanceMode,
        cameraX,
        cameraY,
        effectiveZoom,
        tileSize,
        gridOffsetX,
        gridOffsetY,
        sunSettings,
        wallData,
        gridType,
        viewMode,
        viewRotation,
        viewTilt,
        wallShadowsEnabled
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

    // Don't render if shadows are disabled
    if (!lightingEnabled) {
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
                zIndex: 7, // Ground shadows: above terrain (2), below walls (8/9) and tokens
                opacity: isGMMode ? 1 : 0.8 // Slightly more visible for GM
            }}
        />
    );
};

export default ShadowOverlay;
