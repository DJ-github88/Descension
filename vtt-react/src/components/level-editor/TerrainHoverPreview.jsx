import React from 'react';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';

const TerrainHoverPreview = ({ gridX, gridY, brushSize, isEraser, isFog }) => {
    const {
        gridSize,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom
    } = useGameStore();

    const effectiveZoom = zoomLevel * playerZoom;

    // Convert grid coordinates to screen coordinates using the same system as InfiniteGridSystem
    const gridToScreen = (gx, gy) => {
        try {
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.gridToWorldCorner(gx, gy);
            // Always pass viewport dimensions for proper coordinate conversion
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, window.innerWidth, window.innerHeight);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            const worldX = (gx * gridSize) + gridOffsetX;
            const worldY = (gy * gridSize) + gridOffsetY;

            const screenX = (worldX - cameraX) * effectiveZoom + window.innerWidth / 2;
            const screenY = (worldY - cameraY) * effectiveZoom + window.innerHeight / 2;

            return { x: screenX, y: screenY };
        }
    };

    // Calculate brush pattern
    const startOffset = Math.floor(brushSize / 2);
    const tiles = [];

    for (let dx = 0; dx < brushSize; dx++) {
        for (let dy = 0; dy < brushSize; dy++) {
            const tileX = gridX - startOffset + dx;
            const tileY = gridY - startOffset + dy;
            tiles.push({ x: tileX, y: tileY });
        }
    }

    const tileSize = gridSize * effectiveZoom;

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99 }}>
            {tiles.map((tile, index) => {
                const screenPos = gridToScreen(tile.x, tile.y);
                
                return (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            left: screenPos.x,
                            top: screenPos.y,
                            width: tileSize,
                            height: tileSize,
                            border: isEraser ? '2px solid #ff4444' : isFog ? '2px solid #8844ff' : '2px solid #44ff44',
                            backgroundColor: isEraser ? 'rgba(255, 68, 68, 0.2)' : isFog ? 'rgba(136, 68, 255, 0.3)' : 'rgba(68, 255, 68, 0.2)',
                            pointerEvents: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                );
            })}
        </div>
    );
};

export default TerrainHoverPreview;
