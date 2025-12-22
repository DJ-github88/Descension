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

    const effectiveZoom = zoomLevel * playerZoom;

    // For fog tools, update preview immediately without throttling for instant feedback
    // Use useMemo to optimize calculations but keep updates immediate
    const previewPos = useMemo(() => {
        if (isFog && screenX !== undefined && screenY !== undefined) {
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
            const worldX = (gx * gridSize) + gridOffsetX;
            const worldY = (gy * gridSize) + gridOffsetY;

            const screenX = (worldX - cameraX) * effectiveZoom + window.innerWidth / 2;
            const screenY = (worldY - cameraY) * effectiveZoom + window.innerHeight / 2;

            return { x: screenX, y: screenY };
        }
    };

    // For fog tools, show smooth circle brush preview instead of grid squares
    if (isFog && previewPos.screenX !== undefined && previewPos.screenY !== undefined) {
        // Calculate brush radius in screen pixels
        const brushRadius = brushSize * gridSize * effectiveZoom * 0.5;
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
        // For hex grids, use hex distance to find all hexes within brush range
        // gridX is q, gridY is r for hex grids
        const centerQ = gridX;
        const centerR = gridY;
        const brushRadius = Math.floor(brushSize / 2);
        
        // Get all hexes within hex distance
        for (let q = centerQ - brushRadius; q <= centerQ + brushRadius; q++) {
            for (let r = centerR - brushRadius; r <= centerR + brushRadius; r++) {
                const hexDist = gridSystem.hexDistance(q, r, centerQ, centerR);
                if (hexDist <= brushRadius) {
                    tiles.push({ q, r, isHex: true });
                }
            }
        }
    } else {
        // Square grid: calculate brush pattern
        const startOffset = Math.floor(brushSize / 2);
        for (let dx = 0; dx < brushSize; dx++) {
            for (let dy = 0; dy < brushSize; dy++) {
                const tileX = gridX - startOffset + dx;
                const tileY = gridY - startOffset + dy;
                tiles.push({ x: tileX, y: tileY, isHex: false });
            }
        }
    }

    const tileSize = gridSize * effectiveZoom;
    const borderColor = isEraser ? '#ff4444' : isFog ? '#8844ff' : '#44ff44';
    const bgColor = isEraser ? 'rgba(255, 68, 68, 0.2)' : isFog ? 'rgba(136, 68, 255, 0.3)' : 'rgba(68, 255, 68, 0.2)';

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99 }}>
            {tiles.map((tile, index) => {
                let screenPos;
                
                if (tile.isHex) {
                    // Hex grid: get center position and hex corners
                    const worldPos = gridSystem.hexToWorld(tile.q, tile.r);
                    screenPos = gridSystem.worldToScreen(worldPos.x, worldPos.y, window.innerWidth, window.innerHeight);
                    
                    const sqrt3 = Math.sqrt(3);
                    const hexRadius = gridSize / sqrt3;
                    const hexRadiusScreen = hexRadius * effectiveZoom;
                    
                    // Get hex corners relative to center (0,0)
                    const corners = gridSystem.getHexCorners(0, 0, hexRadiusScreen);
                    
                    // Create SVG path for hex shape (coordinates relative to SVG center)
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
                    // Square grid: use rectangle
                    screenPos = gridToScreen(tile.x, tile.y);
                    
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
