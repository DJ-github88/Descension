import React, { useEffect, useState } from 'react';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';

const StaticFogOverlay = () => {
    const [forceUpdate, setForceUpdate] = useState(0);

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
        fogOfWarData,
        fogOfWarEnabled,
        drawingLayers
    } = useLevelEditorStore();

    const effectiveZoom = zoomLevel * playerZoom;

    // Convert grid coordinates to screen coordinates using InfiniteGridSystem for consistency
    const gridToScreen = (gridX, gridY) => {
        try {
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            // Always pass viewport dimensions for proper coordinate conversion
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, window.innerWidth, window.innerHeight);
        } catch (error) {
            // Fallback to manual calculation if grid system fails
            const worldX = (gridX * gridSize) + gridOffsetX;
            const worldY = (gridY * gridSize) + gridOffsetY;

            const screenX = (worldX - cameraX) * effectiveZoom + window.innerWidth / 2;
            const screenY = (worldY - cameraY) * effectiveZoom + window.innerHeight / 2;

            return { x: screenX, y: screenY };
        }
    };

    const tileSize = gridSize * effectiveZoom;

    // Check if fog should be visible
    const fogLayer = drawingLayers.find(layer => layer.id === 'fog');
    const isFogLayerVisible = fogLayer ? fogLayer.visible : true;

    // Force re-render when fog data or visibility settings change
    useEffect(() => {
        setForceUpdate(prev => prev + 1);
    }, [fogOfWarData, fogOfWarEnabled, isFogLayerVisible]);

    // Don't render if fog is disabled or layer is hidden
    if (!fogOfWarEnabled || !isFogLayerVisible) {
        return null;
    }

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 55 // Below animated fog - provides base fog layer
        }}>
            {Object.keys(fogOfWarData).map(tileKey => {
                const [gridX, gridY] = tileKey.split(',').map(Number);
                const screenPos = gridToScreen(gridX, gridY);
                
                return (
                    <div
                        key={tileKey}
                        style={{
                            position: 'absolute',
                            left: screenPos.x,
                            top: screenPos.y,
                            width: tileSize,
                            height: tileSize,
                            backgroundColor: isGMMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 1)',
                            border: isGMMode ? '1px solid rgba(100, 100, 150, 0.3)' : 'none',
                            boxSizing: 'border-box',
                            background: isGMMode ? `
                                radial-gradient(circle at 30% 30%, rgba(60, 60, 80, 0.9) 0%, rgba(20, 20, 40, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%),
                                linear-gradient(45deg, rgba(40, 40, 60, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)
                            ` : 'rgba(0, 0, 0, 1)'
                        }}
                    />
                );
            })}
        </div>
    );
};

export default StaticFogOverlay;
