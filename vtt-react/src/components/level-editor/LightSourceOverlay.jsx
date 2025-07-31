import React, { useMemo } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { LIGHT_PRESETS } from '../../utils/LightingCalculations';
import { WOW_ICON_BASE_URL } from '../item-generation/wowIcons';
import './styles/LightSourceOverlay.css';

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
        updateLightSource
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
    const handleLightRightClick = (light, event) => {
        if (!isGMMode) return;
        
        event.preventDefault();
        event.stopPropagation();
        
        // Show context menu or remove light
        if (window.confirm(`Remove ${LIGHT_PRESETS[light.type]?.name || light.type} light?`)) {
            removeLightSource(light.id);
        }
    };

    // Convert world coordinates to screen coordinates
    const worldToScreen = (worldX, worldY) => {
        const screenX = (worldX - cameraX) * effectiveZoom + window.innerWidth / 2;
        const screenY = (worldY - cameraY) * effectiveZoom + window.innerHeight / 2;
        return { x: screenX, y: screenY };
    };

    // WoW icon mapping for light types
    const lightIconMap = {
        torch: 'inv_torch_lit',
        lantern: 'inv_misc_lantern_01',
        candle: 'inv_misc_candle_01',
        magical: 'spell_arcane_arcane01',
        campfire: 'spell_fire_fire',
        sunlight: 'spell_holy_holylight'
    };

    // Get light icon based on type
    const getLightIcon = (lightType) => {
        return lightIconMap[lightType] || 'inv_misc_questionmark';
    };

    if (!lightingEnabled || visibleLights.length === 0) {
        return null;
    }

    return (
        <div className="light-source-overlay">
            {visibleLights.map(light => {
                const lightWorldX = light.x * tileSize + gridOffsetX;
                const lightWorldY = light.y * tileSize + gridOffsetY;
                const screenPos = worldToScreen(lightWorldX, lightWorldY);
                
                // Calculate light radius in screen pixels
                const radiusInPixels = light.radius * tileSize * effectiveZoom;
                
                return (
                    <div key={light.id} className="light-source-container">
                        {/* Light illumination area (only visible to GM or when enabled) */}
                        {(isGMMode || light.enabled) && (
                            <div
                                className={`light-illumination ${light.flickering ? 'flickering' : ''}`}
                                style={{
                                    left: screenPos.x - radiusInPixels,
                                    top: screenPos.y - radiusInPixels,
                                    width: radiusInPixels * 2,
                                    height: radiusInPixels * 2,
                                    background: `radial-gradient(circle, ${light.color}${Math.round(light.intensity * 0.3 * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                                    opacity: light.enabled ? 1 : 0.3,
                                    pointerEvents: 'none'
                                }}
                            />
                        )}
                        
                        {/* Light source icon */}
                        <div
                            className={`light-source-icon ${!light.enabled ? 'disabled' : ''} ${isGMMode ? 'interactive' : ''}`}
                            style={{
                                left: screenPos.x - 12,
                                top: screenPos.y - 12,
                                fontSize: `${Math.max(12, Math.min(24, 16 * effectiveZoom))}px`,
                                filter: light.enabled ? 'none' : 'grayscale(100%)',
                                opacity: light.enabled ? 1 : 0.5
                            }}
                            onClick={(e) => handleLightClick(light, e)}
                            onContextMenu={(e) => handleLightRightClick(light, e)}
                            title={`${LIGHT_PRESETS[light.type]?.name || light.type} - ${light.enabled ? 'Enabled' : 'Disabled'} (${light.radius * 5}ft radius)`}
                        >
                            <img
                                src={`${WOW_ICON_BASE_URL}${getLightIcon(light.type)}.jpg`}
                                alt={LIGHT_PRESETS[light.type]?.name || light.type}
                                className="light-source-icon-img"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `${WOW_ICON_BASE_URL}inv_misc_questionmark.jpg`;
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
