import React, { useMemo, useState, useEffect } from 'react';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { rafThrottle } from '../../utils/performanceUtils';

const TerrainHoverPreview = ({ gridX, gridY, brushSize, isEraser, isFog, screenX, screenY }) => {
    const {
        gridSize,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom,
        gridType
    } = useGameStore();

    const effectiveZoom = (zoomLevel || 1) * (playerZoom || 1);
    const gs = gridSize || 50;
    const gOX = gridOffsetX || 0;
    const gOY = gridOffsetY || 0;
    const camX = cameraX || 0;
    const camY = cameraY || 0;

    // Safety check for valid coordinates and values
    if (!Number.isFinite(gridX) || !Number.isFinite(gridY) || !Number.isFinite(brushSize) || !Number.isFinite(gs)) {
        return null;
    }

    // For fog tools, update preview immediately without throttling for instant feedback
    // Use useMemo to optimize calculations but keep updates immediate
    const previewPos = useMemo(() => {
        if (isFog && Number.isFinite(screenX) && Number.isFinite(screenY)) {
            return { screenX, screenY };
        }
        return { screenX: undefined, screenY: undefined };
    }, [isFog, screenX, screenY]);

    // Convert grid coordinates to screen coordinates using the same system as InfiniteGridSystem
    const gridToScreen = (gx, gy) => {
        try {
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.gridToWorldCorner(gx, gy);
            // Always pass viewport dimensions for proper coordinate conversion
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, window.innerWidth, window.innerHeight);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            const worldX = (gx * gs) + gOX;
            const worldY = (gy * gs) + gOY;

            const sX = (worldX - camX) * effectiveZoom + window.innerWidth / 2;
            const sY = (worldY - camY) * effectiveZoom + window.innerHeight / 2;

            return { x: sX, y: sY };
        }
    };

    // For fog tools, show smooth circle brush preview instead of grid squares
    if (isFog) {
        if (previewPos.screenX === undefined || previewPos.screenY === undefined) {
            return null;
        }

        // Calculate brush radius in screen pixels
        const brushRadius = brushSize * gs * effectiveZoom * 0.5;
        const diameter = brushRadius * 2;

        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99 }}>
                <div
                    style={{
                        position: 'absolute',
                        left: previewPos.screenX - brushRadius,
                        top: previewPos.screenY - brushRadius,
                        width: diameter,
                        height: diameter,
                        border: isEraser ? '2px solid #ff4444' : '2px solid #8844ff',
                        borderRadius: '50%',
                        backgroundColor: isEraser ? 'rgba(255, 68, 68, 0.2)' : 'rgba(136, 68, 255, 0.3)',
                        pointerEvents: 'none',
                        boxSizing: 'border-box'
                    }}
                />
            </div>
        );
    }

    // For terrain tools, keep the grid-based preview
    const gridSystem = getGridSystem();
    const currentGridType = gridType || 'square';

    // Calculate brush pattern based on grid type
    let tiles = [];

    if (currentGridType === 'hex') {
        const centerQ = gridX;
        const centerR = gridY;
        const brushRadius = Math.floor(brushSize / 2);

        for (let q = centerQ - brushRadius; q <= centerQ + brushRadius; q++) {
            for (let r = centerR - brushRadius; r <= centerR + brushRadius; r++) {
                const hexDist = gridSystem.hexDistance(q, r, centerQ, centerR);
                if (hexDist <= brushRadius) {
                    tiles.push({ q, r, isHex: true });
                }
            }
        }
    } else {
        const startOffset = Math.floor(brushSize / 2);
        for (let dx = 0; dx < brushSize; dx++) {
            for (let dy = 0; dy < brushSize; dy++) {
                const tileX = gridX - startOffset + dx;
                const tileY = gridY - startOffset + dy;
                tiles.push({ x: tileX, y: tileY, isHex: false });
            }
        }
    }

    const tileSize = gs * effectiveZoom;
    const borderColor = isEraser ? '#ff4444' : isFog ? '#8844ff' : '#44ff44';
    const bgColor = isEraser ? 'rgba(255, 68, 68, 0.2)' : isFog ? 'rgba(136, 68, 255, 0.3)' : 'rgba(68, 255, 68, 0.2)';

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99 }}>
            {tiles.map((tile, index) => {
                let screenPos;

                if (tile.isHex) {
                    const worldPos = gridSystem.hexToWorld(tile.q, tile.r);
                    screenPos = gridSystem.worldToScreen(worldPos.x, worldPos.y, window.innerWidth, window.innerHeight);

                    const sqrt3 = Math.sqrt(3);
                    const hexRadius = gs / sqrt3;
                    const hexRadiusScreen = hexRadius * effectiveZoom;

                    const corners = gridSystem.getHexCorners(0, 0, hexRadiusScreen);

                    const pathData = corners.map((corner, i) =>
                        `${i === 0 ? 'M' : 'L'} ${corner.x + hexRadiusScreen} ${corner.y + hexRadiusScreen}`
                    ).join(' ') + ' Z';

                    return (
                        <svg
                            key={`hex-${index}`}
                            width={hexRadiusScreen * 2}
                            height={hexRadiusScreen * 2}
                            style={{
                                position: 'absolute',
                                left: screenPos.x - hexRadiusScreen,
                                top: screenPos.y - hexRadiusScreen,
                                pointerEvents: 'none',
                                overflow: 'visible'
                            }}
                        >
                            <path
                                d={pathData}
                                fill={bgColor}
                                stroke={borderColor}
                                strokeWidth="2"
                            />
                        </svg>
                    );
                } else {
                    screenPos = gridToScreen(tile.x, tile.y);
                    if (!screenPos || !Number.isFinite(screenPos.x) || !Number.isFinite(screenPos.y)) return null;

                    return (
                        <div
                            key={`square-${index}`}
                            style={{
                                position: 'absolute',
                                left: screenPos.x,
                                top: screenPos.y,
                                width: tileSize,
                                height: tileSize,
                                border: `2px solid ${borderColor}`,
                                backgroundColor: bgColor,
                                pointerEvents: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    );
                }
            })}
        </div>
    );
};

export default TerrainHoverPreview;
