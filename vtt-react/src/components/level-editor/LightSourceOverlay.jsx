import React, { useMemo, useRef } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { LIGHT_PRESETS } from '../../utils/LightingCalculations';
import { getTileElevation, screenToWorldElevated } from '../../utils/ElevationUtils';
import { getIconUrl } from '../../utils/assetManager';
import './styles/LightSourceOverlay.css';
import { showConfirm } from '../../utils/dialogService';

/**
 * SVG sector path for a directional light cone, centered on the local +x axis.
 * The parent <g> rotates by (direction - 90) so compass 0 = north points -y.
 */
const buildConePath = (radius, coneAngleDeg) => {
    const half = ((coneAngleDeg * Math.PI) / 180) / 2;
    const x1 = radius * Math.cos(-half);
    const y1 = radius * Math.sin(-half);
    const x2 = radius * Math.cos(half);
    const y2 = radius * Math.sin(half);
    const largeArc = coneAngleDeg > 180 ? 1 : 0;
    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
};

/**
 * LightSourceOverlay - Renders light sources on the map
 * Shows light source icons and their illumination areas
 */
const LightSourceOverlay = () => {
    // Level editor store
    const {
        lightSources,
        lightingEnabled,
        isEditorMode,
        removeLightSource,
        updateLightSource,
        elevationData,
        selectedLightId,
        setSelectedLightId
    } = useLevelEditorStore();

    // Game store for positioning and GM mode
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
    const gridSystem = getGridSystem();

    // Calculate which light sources are visible
    const visibleLights = useMemo(() => {
        if (!lightingEnabled) return [];

        // Use consistent viewport dimensions that account for editor panel
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();

        // Calculate visible world bounds
        const worldWidth = viewport.width / effectiveZoom;
        const worldHeight = viewport.height / effectiveZoom;
        const worldLeft = cameraX - worldWidth / 2;
        const worldRight = cameraX + worldWidth / 2;
        const worldTop = cameraY - worldHeight / 2;
        const worldBottom = cameraY + worldHeight / 2;

        return Object.values(lightSources).filter(light => {
            const lightWorldX = light.x * tileSize + gridOffsetX;
            const lightWorldY = light.y * tileSize + gridOffsetY;
            
            // Add light radius for visibility check
            const lightRadius = light.radius * tileSize;
            
            return lightWorldX + lightRadius >= worldLeft &&
                   lightWorldX - lightRadius <= worldRight &&
                   lightWorldY + lightRadius >= worldTop &&
                   lightWorldY - lightRadius <= worldBottom;
        });
    }, [
        lightSources,
        lightingEnabled,
        cameraX,
        cameraY,
        effectiveZoom,
        tileSize,
        gridOffsetX,
        gridOffsetY,
        isEditorMode
    ]);

    // Handle light source click (for editing)
    const handleLightClick = (light, event) => {
        if (!isGMMode) return;
        
        event.preventDefault();
        event.stopPropagation();
        
        // Toggle light on/off with left click
        updateLightSource(light.id, { enabled: !light.enabled });
    };

    // Handle light source right-click (for context menu)
    const handleLightRightClick = async (light, event) => {
        if (!isGMMode) return;
        
        event.preventDefault();
        event.stopPropagation();
        
        // Show context menu or remove light
        const lightName = LIGHT_PRESETS[light.type]?.name || light.type;
        const confirmed = await showConfirm({
            title: 'Remove Light Source',
            message: `Remove ${lightName} light?`,
            confirmText: 'Remove',
            isDestructive: true
        });
        if (confirmed) {
            removeLightSource(light.id);
        }
    };

    // Convert world coordinates to screen coordinates (projection-aware, lifted by elevation)
    const worldToScreen = (worldX, worldY, worldZ = 0) =>
        gridSystem.worldToScreen3D(worldX, worldY, worldZ, window.innerWidth, window.innerHeight);

    const lightSinTilt = gridSystem
        .getProjectionTransform(window.innerWidth, window.innerHeight)
        .sinTilt;

    // Light drag (left mouse drags; selection lives in the store so the
    // Lighting tab can edit the selected light's properties)
    const dragLightRef = useRef(null);

    const handleLightPointerDown = (light, event) => {
        if (!isGMMode || event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        setSelectedLightId(light.id);
        dragLightRef.current = { id: light.id };

        const handleMove = (moveEvent) => {
            if (!dragLightRef.current) return;
            const gs = getGridSystem();
            const world = screenToWorldElevated({
                screenX: moveEvent.clientX,
                screenY: moveEvent.clientY,
                gridSystem: gs,
                elevationData
            }) || gs.screenToWorld(moveEvent.clientX, moveEvent.clientY, window.innerWidth, window.innerHeight);
            const gridCoords = gs.worldToGrid(world.x, world.y);
            updateLightSource(light.id, {
                x: gridCoords.x,
                y: gridCoords.y,
                gridX: gridCoords.x,
                gridY: gridCoords.y
            });
        };

        const handleUp = () => {
            dragLightRef.current = null;
            document.removeEventListener('pointermove', handleMove);
            document.removeEventListener('pointerup', handleUp);
            document.removeEventListener('pointercancel', handleUp);
        };

        document.addEventListener('pointermove', handleMove);
        document.addEventListener('pointerup', handleUp);
        document.addEventListener('pointercancel', handleUp);
    };

    // Ability icon mapping for light types
    const lightIconMap = {
        torch: 'Fire/Fiery Skull',
        lantern: 'Utility/Glowing Orb',
        candle: 'Fire/Fiery Skull',
        magical: 'Arcane/Orb Manipulation',
        campfire: 'Fire/Fiery Skull',
        sunlight: 'Radiant/Radiant Sunburst'
    };

    // Get light icon based on type
    const getLightIcon = (lightType) => {
        return lightIconMap[lightType] || 'Utility/Utility';
    };

    if (!lightingEnabled || visibleLights.length === 0) {
        return null;
    }

    return (
        <div className="light-source-overlay">
            {visibleLights.map(light => {
                const lightWorldX = light.x * tileSize + gridOffsetX;
                const lightWorldY = light.y * tileSize + gridOffsetY;
                const lightElevationLevel = getTileElevation(elevationData, light.x, light.y);
                const screenPos = worldToScreen(lightWorldX, lightWorldY, lightElevationLevel * tileSize);
                
                // Calculate light radius in screen pixels (elliptical under tilt)
                const radiusInPixels = light.radius * tileSize * effectiveZoom;
                const radiusYInPixels = Math.max(2, radiusInPixels * lightSinTilt);
                
                return (
                    <div key={light.id} className="light-source-container">
                        {/* Light illumination area (only visible to GM or when enabled) */}
                        {(isGMMode || light.enabled) && (
                            <div
                                className={`light-illumination ${light.flickering ? 'flickering' : ''}`}
                                style={{
                                    left: screenPos.x - radiusInPixels,
                                    top: screenPos.y - radiusYInPixels,
                                    width: radiusInPixels * 2,
                                    height: radiusYInPixels * 2,
                                    background: `radial-gradient(circle, ${light.color}${Math.round(light.intensity * 0.3 * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                                    opacity: light.enabled ? 1 : 0.3,
                                    pointerEvents: 'none'
                                }}
                            />
                        )}
                        
                        {/* Directional cone overlay */}
                        {light.direction && light.coneAngle && light.coneAngle < 360 && (
                            <svg
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width: '100%',
                                    height: '100%',
                                    pointerEvents: 'none',
                                    overflow: 'visible'
                                }}
                            >
                                <g
                                    transform={`translate(${screenPos.x} ${screenPos.y}) scale(1 ${lightSinTilt}) rotate(${light.direction - 90})`}
                                >
                                    <path
                                        d={buildConePath(radiusInPixels, light.coneAngle)}
                                        fill={light.color || '#ffaa00'}
                                        opacity={Math.min(0.35, 0.18 * (light.intensity ?? 1))}
                                    />
                                </g>
                            </svg>
                        )}

                        {/* Light source icon */}
                        <div
                            className={`light-source-icon ${!light.enabled ? 'disabled' : ''} ${isGMMode ? 'interactive' : ''}`}
                            style={{
                                left: screenPos.x - 12,
                                top: screenPos.y - 12,
                                fontSize: `${Math.max(12, Math.min(24, 16 * effectiveZoom))}px`,
                                filter: light.enabled ? 'none' : 'grayscale(100%)',
                                opacity: light.enabled ? 1 : 0.5,
                                boxShadow: selectedLightId === light.id ? '0 0 0 2px #d4af37' : 'none',
                                cursor: isGMMode ? 'grab' : 'default'
                            }}
                            onPointerDown={(event) => handleLightPointerDown(light, event)}
                            onDoubleClick={(event) => handleLightClick(light, event)}
                            onContextMenu={(event) => handleLightRightClick(light, event)}
                            title={`${LIGHT_PRESETS[light.type]?.name || light.type} - ${light.enabled ? 'Enabled' : 'Disabled'} (${light.radius * 5}ft radius)`}
                        >
                            <img
                                src={getIconUrl(getLightIcon(light.type), 'abilities')}
                                alt={LIGHT_PRESETS[light.type]?.name || light.type}
                                className="light-source-icon-img"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                }}
                            />
                        </div>
                        
                        {/* Light source label (GM only) */}
                        {isGMMode && (
                            <div
                                className="light-source-label"
                                style={{
                                    left: screenPos.x - 30,
                                    top: screenPos.y + 16,
                                    fontSize: `${Math.max(8, Math.min(12, 10 * effectiveZoom))}px`
                                }}
                            >
                                {LIGHT_PRESETS[light.type]?.name || light.type}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default LightSourceOverlay;
