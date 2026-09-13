import React from 'react';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';

/**
 * TerrainHoverPreview - brush footprint preview for terrain/fog tools.
 * Draws with the shared projection so the footprint follows camera yaw/tilt
 * (squares become parallelograms, hexes become projected hexagons, circles
 * become ellipses) instead of staying axis-aligned on screen.
 */
const TerrainHoverPreview = ({ gridX, gridY, brushSize, isEraser, isFog, elevationMode, screenX, screenY }) => {
    const {
        gridSize,
        gridType,
        viewMode,
        viewRotation,
        viewTilt
    } = useGameStore();

    const gs = gridSize || 50;

    if (!Number.isFinite(gridX) || !Number.isFinite(gridY) || !Number.isFinite(brushSize) || !Number.isFinite(gs)) {
        return null;
    }

    const gridSystem = getGridSystem();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const transform = gridSystem.getProjectionTransform(viewportWidth, viewportHeight, {
        viewMode,
        viewRotation,
        viewTilt
    });
    const sinTilt = transform.sinTilt;
    const effectiveZoom = transform.effectiveZoom;

    let borderColor = '#44ff44';
    let bgColor = 'rgba(68, 255, 68, 0.2)';
    if (isEraser) {
        borderColor = '#ff4444';
        bgColor = 'rgba(255, 68, 68, 0.2)';
    } else if (isFog) {
        borderColor = '#8844ff';
        bgColor = 'rgba(136, 68, 255, 0.3)';
    } else if (elevationMode === 'raise') {
        borderColor = '#44aaff';
        bgColor = 'rgba(68, 170, 255, 0.25)';
    } else if (elevationMode === 'lower') {
        borderColor = '#ff9944';
        bgColor = 'rgba(255, 153, 68, 0.25)';
    } else if (elevationMode === 'flatten') {
        borderColor = '#ffd700';
        bgColor = 'rgba(255, 215, 0, 0.22)';
    } else if (elevationMode === 'ramp') {
        borderColor = '#a0ffdd';
        bgColor = 'rgba(160, 255, 221, 0.22)';
    }

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99
    };

    // Fog brush: projected ellipse footprint
    if (isFog) {
        if (!Number.isFinite(screenX) || !Number.isFinite(screenY)) {
            return null;
        }
        const radius = brushSize * gs * effectiveZoom * 0.5;
        return (
            <svg style={overlayStyle}>
                <ellipse
                    cx={screenX}
                    cy={screenY}
                    rx={radius}
                    ry={Math.max(1, radius * sinTilt)}
                    fill={bgColor}
                    stroke={borderColor}
                    strokeWidth="2"
                />
            </svg>
        );
    }

    // Collect the tiles under the brush using the shared footprint helper so
    // the preview always matches what the paint/erase/elevation stamps apply.
    const tiles = gridSystem.getBrushTiles(gridX, gridY, brushSize)
        .map(tile => ({ x: tile.x, y: tile.y, isHex: gridType === 'hex' }));

    return (
        <svg style={overlayStyle}>
            {tiles.map((tile, index) => {
                if (tile.isHex) {
                    const worldCenter = gridSystem.hexToWorld(tile.x, tile.y);
                    const hexRadiusWorld = gs / Math.sqrt(3);
                    const worldCorners = gridSystem.getHexCorners(worldCenter.x, worldCenter.y, hexRadiusWorld);
                    const points = worldCorners
                        .map(corner => {
                            const screen = gridSystem.worldToScreen(corner.x, corner.y, viewportWidth, viewportHeight);
                            return `${screen.x},${screen.y}`;
                        })
                        .join(' ');

                    return (
                        <polygon
                            key={`hex-${index}`}
                            points={points}
                            fill={bgColor}
                            stroke={borderColor}
                            strokeWidth="2"
                        />
                    );
                }

                const corner = gridSystem.gridToWorldCorner(tile.x, tile.y);
                const c1 = gridSystem.worldToScreen(corner.x, corner.y, viewportWidth, viewportHeight);
                const c2 = gridSystem.worldToScreen(corner.x + gs, corner.y, viewportWidth, viewportHeight);
                const c3 = gridSystem.worldToScreen(corner.x + gs, corner.y + gs, viewportWidth, viewportHeight);
                const c4 = gridSystem.worldToScreen(corner.x, corner.y + gs, viewportWidth, viewportHeight);
                const points = [c1, c2, c3, c4].map(p => `${p.x},${p.y}`).join(' ');

                return (
                    <polygon
                        key={`square-${index}`}
                        points={points}
                        fill={bgColor}
                        stroke={borderColor}
                        strokeWidth="2"
                    />
                );
            })}
        </svg>
    );
};

export default TerrainHoverPreview;
