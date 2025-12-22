/**
 * Unified Infinite Grid System
 *
 * This utility provides a single source of truth for all grid calculations,
 * camera transformations, and coordinate conversions across the application.
 * It ensures perfect alignment between the main grid, level editor, and all
 * interactive elements.
 */

export class InfiniteGridSystem {
    constructor(gameStore) {
        this.gameStore = gameStore;
    }

    /**
     * Get current grid state from the game store
     */
    getGridState() {
        const state = this.gameStore.getState();
        return {
            gridSize: state.gridSize,
            gridType: state.gridType || 'square', // 'square' or 'hex'
            cameraX: state.cameraX,
            cameraY: state.cameraY,
            zoomLevel: state.zoomLevel,
            playerZoom: state.playerZoom,
            effectiveZoom: state.zoomLevel * state.playerZoom, // Combined zoom
            gridOffsetX: state.gridOffsetX,
            gridOffsetY: state.gridOffsetY,
            gridMovesWithBackground: state.gridMovesWithBackground,
            gridExtent: state.gridExtent,
            showGrid: state.showGrid,
            gridLineColor: state.gridLineColor,
            gridLineThickness: state.gridLineThickness,
            minZoom: state.minZoom,
            maxZoom: state.maxZoom
        };
    }

    /**
     * Hex coordinate conversion utilities
     * Using axial coordinates (q, r) for hex grids
     */
    
    /**
     * Convert world coordinates to hex axial coordinates (q, r)
     * Flat-top hexagon orientation
     */
    worldToHex(worldX, worldY) {
        const { gridSize, gridOffsetX, gridOffsetY } = this.getGridState();
        const sqrt3 = Math.sqrt(3);
        const radius = gridSize / sqrt3;
        
        // Adjust for offset
        const x = worldX - gridOffsetX;
        const y = worldY - gridOffsetY;
        
        // Convert to hex coordinates (flat-top)
        // Inverse of hexToWorld transformation
        const q = (sqrt3/3 * x - 1/3 * y) / radius;
        const r = (2/3 * y) / radius;
        
        // Round to nearest hex
        return this.hexRound(q, r);
    }

    /**
     * Convert hex axial coordinates (q, r) to world coordinates (center of hex)
     * Flat-top hexagon orientation
     * For flat-top hexes: gridSize is the width (distance between opposite flat sides)
     * The radius (center to corner) is gridSize / sqrt(3)
     */
    hexToWorld(q, r) {
        const { gridSize, gridOffsetX, gridOffsetY } = this.getGridState();
        // For flat-top hexagons with width = gridSize:
        // - radius (center to corner) = gridSize / sqrt(3)
        // - Use radius as the base unit for coordinate conversion
        const sqrt3 = Math.sqrt(3);
        const radius = gridSize / sqrt3;
        
        // Standard axial to pixel conversion for flat-top hexes
        const x = radius * (sqrt3 * q + sqrt3 / 2 * r);
        const y = radius * (3/2 * r);
        
        return {
            x: x + gridOffsetX,
            y: y + gridOffsetY
        };
    }

    /**
     * Round fractional hex coordinates to nearest hex
     */
    hexRound(q, r) {
        // Convert to cube coordinates for rounding
        const s = -q - r;
        let rq = Math.round(q);
        let rr = Math.round(r);
        const rs = Math.round(s);
        
        const qDiff = Math.abs(rq - q);
        const rDiff = Math.abs(rr - r);
        const sDiff = Math.abs(rs - s);
        
        if (qDiff > rDiff && qDiff > sDiff) {
            rq = -rr - rs;
        } else if (rDiff > sDiff) {
            rr = -rq - rs;
        }
        
        return { q: rq, r: rr };
    }

    /**
     * Get hex neighbors (6 adjacent hexes)
     */
    getHexNeighbors(q, r) {
        return [
            { q: q + 1, r: r },
            { q: q - 1, r: r },
            { q: q + 1, r: r - 1 },
            { q: q - 1, r: r + 1 },
            { q: q, r: r + 1 },
            { q: q, r: r - 1 }
        ];
    }

    /**
     * Calculate hex distance between two hex coordinates
     */
    hexDistance(q1, r1, q2, r2) {
        const s1 = -q1 - r1;
        const s2 = -q2 - r2;
        return (Math.abs(q1 - q2) + Math.abs(r1 - r2) + Math.abs(s1 - s2)) / 2;
    }

    /**
     * Get hex corner positions for rendering (flat-top)
     * For flat-top hexagons, the first point is at the top
     */
    getHexCorners(centerX, centerY, size) {
        const corners = [];
        // For flat-top hexagons, start at top (angle = -PI/2)
        // Then rotate 60 degrees (PI/3) for each corner
        for (let i = 0; i < 6; i++) {
            const angle = -Math.PI / 2 + (Math.PI / 3) * i;
            corners.push({
                x: centerX + size * Math.cos(angle),
                y: centerY + size * Math.sin(angle)
            });
        }
        return corners;
    }

    /**
     * Get the edge between two hex coordinates
     * Returns the two corner points that form the shared edge
     */
    getHexEdge(q1, r1, q2, r2) {
        const { gridSize } = this.getGridState();
        const sqrt3 = Math.sqrt(3);
        const hexRadius = gridSize / sqrt3;
        
        // Get world positions of both hexes
        const world1 = this.hexToWorld(q1, r1);
        const world2 = this.hexToWorld(q2, r2);
        
        // Calculate the direction from hex1 to hex2
        const dq = q2 - q1;
        const dr = r2 - r1;
        
        // Get corners for hex1
        const corners1 = this.getHexCorners(world1.x, world1.y, hexRadius);
        
        // Determine which edge based on neighbor direction
        // For flat-top hexes, neighbors are:
        // 0: (1, 0) - right
        // 1: (-1, 0) - left
        // 2: (1, -1) - top-right
        // 3: (-1, 1) - bottom-left
        // 4: (0, 1) - bottom
        // 5: (0, -1) - top
        
        let edgeIndex1, edgeIndex2;
        if (dq === 1 && dr === 0) {
            // Right neighbor - edge is between corners 1 and 2 (right side)
            edgeIndex1 = 1;
            edgeIndex2 = 2;
        } else if (dq === -1 && dr === 0) {
            // Left neighbor - edge is between corners 4 and 5 (left side)
            edgeIndex1 = 4;
            edgeIndex2 = 5;
        } else if (dq === 1 && dr === -1) {
            // Top-right neighbor - edge is between corners 0 and 1 (top-right)
            edgeIndex1 = 0;
            edgeIndex2 = 1;
        } else if (dq === -1 && dr === 1) {
            // Bottom-left neighbor - edge is between corners 3 and 4 (bottom-left)
            edgeIndex1 = 3;
            edgeIndex2 = 4;
        } else if (dq === 0 && dr === 1) {
            // Bottom neighbor - edge is between corners 2 and 3 (bottom)
            edgeIndex1 = 2;
            edgeIndex2 = 3;
        } else if (dq === 0 && dr === -1) {
            // Top neighbor - edge is between corners 5 and 0 (top)
            edgeIndex1 = 5;
            edgeIndex2 = 0;
        } else {
            // Not adjacent hexes, find closest edge
            const corners2 = this.getHexCorners(world2.x, world2.y, hexRadius);
            let minDist = Infinity;
            let bestEdge1 = null;
            let bestEdge2 = null;
            
            for (let i = 0; i < 6; i++) {
                const nextI = (i + 1) % 6;
                const edgeMid1 = {
                    x: (corners1[i].x + corners1[nextI].x) / 2,
                    y: (corners1[i].y + corners1[nextI].y) / 2
                };
                
                // Find closest point on hex2
                for (let j = 0; j < 6; j++) {
                    const nextJ = (j + 1) % 6;
                    const edgeMid2 = {
                        x: (corners2[j].x + corners2[nextJ].x) / 2,
                        y: (corners2[j].y + corners2[nextJ].y) / 2
                    };
                    
                    const dx = edgeMid1.x - edgeMid2.x;
                    const dy = edgeMid1.y - edgeMid2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < minDist) {
                        minDist = dist;
                        bestEdge1 = { start: corners1[i], end: corners1[nextI] };
                        bestEdge2 = { start: corners2[j], end: corners2[nextJ] };
                    }
                }
            }
            
            if (bestEdge1 && bestEdge2) {
                // Use the edge from hex1
                return {
                    start: bestEdge1.start,
                    end: bestEdge1.end,
                    mid: {
                        x: (bestEdge1.start.x + bestEdge1.end.x) / 2,
                        y: (bestEdge1.start.y + bestEdge1.end.y) / 2
                    }
                };
            }
            return null;
        }
        
        // Return the shared edge
        return {
            start: corners1[edgeIndex1],
            end: corners1[edgeIndex2],
            mid: {
                x: (corners1[edgeIndex1].x + corners1[edgeIndex2].x) / 2,
                y: (corners1[edgeIndex1].y + corners1[edgeIndex2].y) / 2
            }
        };
    }

    /**
     * Get hex boundary shape for a rectangle area
     * Returns an array of world coordinate points that form a hex boundary around the rectangle
     */
    getHexBoundary(minQ, maxQ, minR, maxR) {
        const { gridSize } = this.getGridState();
        const sqrt3 = Math.sqrt(3);
        const hexRadius = gridSize / sqrt3;
        
        // Create a set of hexes in the rectangle for fast lookup
        const hexSet = new Set();
        for (let q = minQ; q <= maxQ; q++) {
            for (let r = minR; r <= maxR; r++) {
                hexSet.add(`${q},${r}`);
            }
        }
        
        // Find all boundary edges (edges between a hex in the rectangle and a hex outside)
        const boundaryEdges = [];
        
        for (let q = minQ; q <= maxQ; q++) {
            for (let r = minR; r <= maxR; r++) {
                const neighbors = this.getHexNeighbors(q, r);
                neighbors.forEach(n => {
                    const neighborKey = `${n.q},${n.r}`;
                    if (!hexSet.has(neighborKey)) {
                        // This is a boundary edge
                        const edge = this.getHexEdge(q, r, n.q, n.r);
                        if (edge) {
                            boundaryEdges.push({
                                start: edge.start,
                                end: edge.end,
                                q1: q,
                                r1: r,
                                q2: n.q,
                                r2: n.r
                            });
                        }
                    }
                });
            }
        }
        
        if (boundaryEdges.length === 0) {
            return [];
        }
        
        // For preview purposes, collect all unique vertices from boundary edges
        // This creates a simplified boundary shape
        const vertexMap = new Map(); // key: "x,y" -> point
        
        boundaryEdges.forEach(edge => {
            const key1 = `${edge.start.x.toFixed(3)},${edge.start.y.toFixed(3)}`;
            const key2 = `${edge.end.x.toFixed(3)},${edge.end.y.toFixed(3)}`;
            
            if (!vertexMap.has(key1)) {
                vertexMap.set(key1, edge.start);
            }
            if (!vertexMap.has(key2)) {
                vertexMap.set(key2, edge.end);
            }
        });
        
        // Convert to array and sort by angle from center for proper ordering
        const centerX = (minQ + maxQ) / 2;
        const centerY = (minR + maxR) / 2;
        const centerWorld = this.hexToWorld(centerX, centerY);
        
        const boundaryPoints = Array.from(vertexMap.values()).sort((a, b) => {
            const angleA = Math.atan2(a.y - centerWorld.y, a.x - centerWorld.x);
            const angleB = Math.atan2(b.y - centerWorld.y, b.x - centerWorld.x);
            return angleA - angleB;
        });
        
        // Close the boundary
        if (boundaryPoints.length > 0) {
            boundaryPoints.push(boundaryPoints[0]);
        }
        
        return boundaryPoints;
    }

    /**
     * Get viewport dimensions - always return full window size
     * The grid should always cover the entire window regardless of editor state
     */
    getViewportDimensions() {
        // Always use full window dimensions for grid generation
        // This ensures the grid covers the entire window and doesn't shift when editor opens
        const width = window.innerWidth;
        const height = window.innerHeight;

        // For debugging purposes, still track editor state but don't use it for calculations
        let isEditorMode = false;
        let editorWidth = 0;

        try {
            const levelEditorStore = window.useLevelEditorStore?.getState?.();
            isEditorMode = levelEditorStore?.isEditorMode || false;
            if (isEditorMode) {
                editorWidth = 530; // For debugging only
            }
        } catch (error) {
            // Ignore errors - we don't need editor state for grid calculations
        }

        const result = { width, height, isEditorMode, editorWidth };


        this._lastViewport = result;

        return result;
    }

    /**
     * Convert world coordinates to screen coordinates
     * Note: This method assumes the camera is at the center of the viewport
     */
    worldToScreen(worldX, worldY, viewportWidth, viewportHeight) {
        const { cameraX, cameraY, effectiveZoom } = this.getGridState();

        // If viewport dimensions are provided, center the coordinate system
        if (viewportWidth !== undefined && viewportHeight !== undefined) {
            return {
                x: (worldX - cameraX) * effectiveZoom + viewportWidth / 2,
                y: (worldY - cameraY) * effectiveZoom + viewportHeight / 2
            };
        }

        // Fallback to original behavior for backward compatibility
        return {
            x: (worldX - cameraX) * effectiveZoom,
            y: (worldY - cameraY) * effectiveZoom
        };
    }

    /**
     * Convert world coordinates to screen coordinates for grid positioning
     * Takes into account the gridMovesWithBackground setting
     */
    gridWorldToScreen(worldX, worldY, viewportWidth, viewportHeight) {
        const { cameraX, cameraY, effectiveZoom, gridMovesWithBackground } = this.getGridState();

        if (gridMovesWithBackground) {
            // Grid moves with background - don't apply camera offset
            if (viewportWidth !== undefined && viewportHeight !== undefined) {
                return {
                    x: worldX * effectiveZoom + viewportWidth / 2,
                    y: worldY * effectiveZoom + viewportHeight / 2
                };
            }
            return {
                x: worldX * effectiveZoom,
                y: worldY * effectiveZoom
            };
        } else {
            // Grid stays on top - apply camera offset (default behavior)
            return this.worldToScreen(worldX, worldY, viewportWidth, viewportHeight);
        }
    }

    /**
     * Convert screen coordinates to world coordinates
     * Note: This method assumes the camera is at the center of the viewport
     */
    screenToWorld(screenX, screenY, viewportWidth, viewportHeight) {
        const { cameraX, cameraY, effectiveZoom } = this.getGridState();

        // If viewport dimensions are provided, account for centered coordinate system
        if (viewportWidth !== undefined && viewportHeight !== undefined) {
            return {
                x: ((screenX - viewportWidth / 2) / effectiveZoom) + cameraX,
                y: ((screenY - viewportHeight / 2) / effectiveZoom) + cameraY
            };
        }

        // Fallback to original behavior for backward compatibility
        return {
            x: (screenX / effectiveZoom) + cameraX,
            y: (screenY / effectiveZoom) + cameraY
        };
    }

    /**
     * Convert world coordinates to grid coordinates (tile indices)
     * Supports both square and hex grids
     */
    worldToGrid(worldX, worldY) {
        const { gridType } = this.getGridState();
        
        if (gridType === 'hex') {
            const hex = this.worldToHex(worldX, worldY);
            // Return as {x, y} for compatibility, using q as x and r as y
            return { x: hex.q, y: hex.r };
        }
        
        // Square grid (original behavior)
        const { gridSize, gridOffsetX, gridOffsetY } = this.getGridState();
        return {
            x: Math.floor((worldX - gridOffsetX) / gridSize),
            y: Math.floor((worldY - gridOffsetY) / gridSize)
        };
    }

    /**
     * Convert grid coordinates to world coordinates (tile center)
     * Supports both square and hex grids
     */
    gridToWorld(gridX, gridY) {
        const { gridType } = this.getGridState();
        
        if (gridType === 'hex') {
            // gridX is q, gridY is r for hex
            return this.hexToWorld(gridX, gridY);
        }
        
        // Square grid (original behavior)
        const { gridSize, gridOffsetX, gridOffsetY } = this.getGridState();
        return {
            x: (gridX * gridSize) + gridOffsetX + (gridSize / 2),
            y: (gridY * gridSize) + gridOffsetY + (gridSize / 2)
        };
    }

    /**
     * Convert grid coordinates to world coordinates (tile top-left corner)
     * For hex grids, returns the top-left bounding box corner
     * Supports both square and hex grids
     */
    gridToWorldCorner(gridX, gridY) {
        const { gridType, gridSize } = this.getGridState();
        
        if (gridType === 'hex') {
            // For hex, get center then calculate top-left of bounding box
            const center = this.hexToWorld(gridX, gridY);
            const hexHeight = gridSize * Math.sqrt(3) / 2;
            return {
                x: center.x - gridSize / 2,
                y: center.y - hexHeight / 2
            };
        }
        
        // Square grid (original behavior)
        const { gridOffsetX, gridOffsetY } = this.getGridState();
        return {
            x: (gridX * gridSize) + gridOffsetX,
            y: (gridY * gridSize) + gridOffsetY
        };
    }

    /**
     * Snap world coordinates to the nearest grid intersection
     */
    snapToGrid(worldX, worldY) {
        const gridCoords = this.worldToGrid(worldX, worldY);
        return this.gridToWorldCorner(gridCoords.x, gridCoords.y);
    }

    /**
     * Get the visible grid bounds for rendering optimization
     */
    getVisibleGridBounds(viewportWidth, viewportHeight) {
        const { cameraX, cameraY, effectiveZoom, gridSize, gridOffsetX, gridOffsetY } = this.getGridState();

        // Calculate visible world area with extra padding using effective zoom
        const visibleWorldWidth = viewportWidth / effectiveZoom;
        const visibleWorldHeight = viewportHeight / effectiveZoom;

        // Get world bounds of visible area (camera is at center of view)
        const worldLeft = cameraX - (visibleWorldWidth / 2);
        const worldTop = cameraY - (visibleWorldHeight / 2);
        const worldRight = cameraX + (visibleWorldWidth / 2);
        const worldBottom = cameraY + (visibleWorldHeight / 2);

        // Convert to grid coordinates
        const gridLeft = this.worldToGrid(worldLeft, worldTop);
        const gridRight = this.worldToGrid(worldRight, worldBottom);

        // Add generous padding to ensure full coverage - especially important for grid lines
        const padding = 20; // Much larger padding to ensure grid lines extend beyond viewport
        return {
            minX: gridLeft.x - padding,
            maxX: gridRight.x + padding,
            minY: gridLeft.y - padding,
            maxY: gridRight.y + padding
        };
    }

    /**
     * Generate grid tiles for rendering with full viewport coverage
     */
    generateGridTiles(viewportWidth, viewportHeight) {
        const { gridSize, cameraX, cameraY, effectiveZoom, gridOffsetX, gridOffsetY, gridMovesWithBackground } = this.getGridState();

        // Add null checks and default values
        const safeGridSize = gridSize || 50;
        const safeCameraX = cameraX != null ? cameraX : 0;
        const safeCameraY = cameraY != null ? cameraY : 0;
        const safeZoomLevel = effectiveZoom != null ? effectiveZoom : 1;
        const safeGridOffsetX = gridOffsetX != null ? gridOffsetX : 0;
        const safeGridOffsetY = gridOffsetY != null ? gridOffsetY : 0;

        // Calculate the effective tile size on screen
        const effectiveTileSize = safeGridSize * safeZoomLevel;

        // Enhanced viewport culling with adaptive thresholds
        const minTileSize = safeZoomLevel < 0.1 ? 8 : safeZoomLevel < 0.2 ? 4 : safeZoomLevel < 0.3 ? 2 : 1;
        if (effectiveTileSize < minTileSize) {
            return []; // Don't render tiles that are too small to see
        }

        // More aggressive culling at very low zoom levels
        if (safeZoomLevel < 0.03) {
            return []; // Don't render at extremely low zoom
        }

        // Keep tile skip factor at 1 to prevent the "4 tiles in 1" visual issue
        // Performance will be handled through other optimizations
        let tileSkipFactor = 1;

        // Calculate visible world area with dynamic padding for performance
        const visibleWorldWidth = viewportWidth / safeZoomLevel;
        const visibleWorldHeight = viewportHeight / safeZoomLevel;

        // Optimized padding factor for better performance at low zoom levels
        // Reduce padding at low zoom to limit the number of tiles generated
        let paddingFactor;
        if (safeZoomLevel < 0.1) {
            paddingFactor = 1.5; // Minimal padding for extremely low zoom
        } else if (safeZoomLevel < 0.3) {
            paddingFactor = 2.0; // Reduced padding for very low zoom
        } else if (safeZoomLevel < 0.5) {
            paddingFactor = 2.5; // Moderate padding for low zoom
        } else if (safeZoomLevel < 1.0) {
            paddingFactor = 3.0; // Good padding for medium zoom
        } else {
            paddingFactor = 3.5; // Generous padding for high zoom
        }

        const paddedWorldWidth = visibleWorldWidth * paddingFactor;
        const paddedWorldHeight = visibleWorldHeight * paddingFactor;

        // Get world bounds of visible area (camera is at center of view)
        const worldLeft = safeCameraX - (paddedWorldWidth / 2);
        const worldTop = safeCameraY - (paddedWorldHeight / 2);
        const worldRight = safeCameraX + (paddedWorldWidth / 2);
        const worldBottom = safeCameraY + (paddedWorldHeight / 2);

        // Convert to grid coordinates with proper floor/ceil for full coverage
        const startGridX = Math.floor((worldLeft - safeGridOffsetX) / safeGridSize);
        const startGridY = Math.floor((worldTop - safeGridOffsetY) / safeGridSize);
        const endGridX = Math.ceil((worldRight - safeGridOffsetX) / safeGridSize);
        const endGridY = Math.ceil((worldBottom - safeGridOffsetY) / safeGridSize);

        // Performance safeguard: More aggressive limits for low zoom levels to reduce lag
        let baseTileLimit;
        if (safeZoomLevel < 0.1) {
            baseTileLimit = 50; // Very aggressive limit for extremely low zoom
        } else if (safeZoomLevel < 0.3) {
            baseTileLimit = 100; // Aggressive limit for very low zoom
        } else if (safeZoomLevel < 0.5) {
            baseTileLimit = 200; // Moderate limit for low zoom
        } else if (safeZoomLevel < 1.0) {
            baseTileLimit = 300; // Normal limit for medium zoom
        } else {
            baseTileLimit = 400; // Higher limit for high zoom
        }

        const maxTilesX = Math.min(endGridX - startGridX + 1, baseTileLimit);
        const maxTilesY = Math.min(endGridY - startGridY + 1, baseTileLimit);
        const actualEndGridX = startGridX + maxTilesX - 1;
        const actualEndGridY = startGridY + maxTilesY - 1;

        const tiles = [];
        const maxTotalTiles = safeZoomLevel < 0.1 ? 1000 : safeZoomLevel < 0.3 ? 2000 : safeZoomLevel < 0.5 ? 4000 : 8000;

        // Check grid type
        const { gridType } = this.getGridState();
        
        if (gridType === 'hex') {
            // Generate hex tiles
            // Calculate hex bounds by converting world bounds to hex coordinates
            const topLeftHex = this.worldToHex(worldLeft, worldTop);
            const topRightHex = this.worldToHex(worldRight, worldTop);
            const bottomLeftHex = this.worldToHex(worldLeft, worldBottom);
            const bottomRightHex = this.worldToHex(worldRight, worldBottom);
            
            // Find min/max q and r values with generous padding to ensure full coverage
            const hexStartQ = Math.min(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q) - 3;
            const hexEndQ = Math.max(topLeftHex.q, topRightHex.q, bottomLeftHex.q, bottomRightHex.q) + 3;
            const hexStartR = Math.min(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r) - 3;
            const hexEndR = Math.max(topLeftHex.r, topRightHex.r, bottomLeftHex.r, bottomRightHex.r) + 3;
            
            for (let q = hexStartQ; q <= hexEndQ && tiles.length < maxTotalTiles; q++) {
                for (let r = hexStartR; r <= hexEndR && tiles.length < maxTotalTiles; r++) {
                    const worldPos = this.hexToWorld(q, r);
                    const screenPos = this.gridWorldToScreen(worldPos.x, worldPos.y, viewportWidth, viewportHeight);
                    
                    const baseMargin = effectiveTileSize * 1.5;
                    const adaptiveMargin = safeZoomLevel < 0.1 ? baseMargin * 0.5 :
                                         safeZoomLevel < 0.3 ? baseMargin * 1.0 :
                                         safeZoomLevel < 0.5 ? baseMargin * 1.2 :
                                         safeZoomLevel < 1.0 ? baseMargin * 1.5 :
                                         baseMargin * 2.0;
                    
                    if (screenPos.x >= -adaptiveMargin && screenPos.x <= viewportWidth + adaptiveMargin &&
                        screenPos.y >= -adaptiveMargin && screenPos.y <= viewportHeight + adaptiveMargin) {
                        
                        tiles.push({
                            gridX: q,
                            gridY: r,
                            worldX: worldPos.x,
                            worldY: worldPos.y,
                            screenX: screenPos.x,
                            screenY: screenPos.y,
                            key: `${q},${r}`,
                            skipFactor: tileSkipFactor
                        });
                    }
                }
            }
        } else {
            // Square grid (original behavior)
            // Generate tiles with optimized loop, skip factor, and early exit for performance
            for (let x = startGridX; x <= actualEndGridX && tiles.length < maxTotalTiles; x += tileSkipFactor) {
                for (let y = startGridY; y <= actualEndGridY && tiles.length < maxTotalTiles; y += tileSkipFactor) {
                    const worldPos = this.gridToWorldCorner(x, y);
                    const screenPos = this.gridWorldToScreen(worldPos.x, worldPos.y, viewportWidth, viewportHeight);

                    // Optimized viewport margin for better performance at low zoom
                    const baseMargin = effectiveTileSize * 1.5; // Reduced base margin
                    const adaptiveMargin = safeZoomLevel < 0.1 ? baseMargin * 0.5 :
                                         safeZoomLevel < 0.3 ? baseMargin * 1.0 :
                                         safeZoomLevel < 0.5 ? baseMargin * 1.2 :
                                         safeZoomLevel < 1.0 ? baseMargin * 1.5 :
                                         baseMargin * 2.0; // More conservative margins

                    // Generous viewport culling to ensure tiles extend beyond visible area
                    if (screenPos.x >= -adaptiveMargin && screenPos.x <= viewportWidth + adaptiveMargin &&
                        screenPos.y >= -adaptiveMargin && screenPos.y <= viewportHeight + adaptiveMargin) {

                        tiles.push({
                            gridX: x,
                            gridY: y,
                            worldX: worldPos.x,
                            worldY: worldPos.y,
                            screenX: screenPos.x,
                            screenY: screenPos.y,
                            key: `${x},${y}`,
                            skipFactor: tileSkipFactor // Include skip factor for debugging
                        });
                    }
                }
            }
        }

        // Debug logging removed for cleaner console output

        return tiles;
    }

    /**
     * Get grid lines for rendering
     * Supports both square and hex grids
     */
    generateGridLines(viewportWidth, viewportHeight) {
        const { gridType } = this.getGridState();
        
        if (gridType === 'hex') {
            // For hex grids, we'll render hex outlines directly in the renderer
            // Return empty array as hex rendering is handled differently
            return [];
        }
        
        // Square grid (original behavior)
        const { gridSize, zoomLevel } = this.getGridState();
        const bounds = this.getVisibleGridBounds(viewportWidth, viewportHeight);
        const lines = [];

        // Vertical lines
        for (let x = bounds.minX; x <= bounds.maxX + 1; x++) {
            const worldX = this.gridToWorldCorner(x, 0).x;
            const screenPos = this.gridWorldToScreen(worldX, 0, viewportWidth, viewportHeight);

            lines.push({
                type: 'vertical',
                x: screenPos.x,
                y1: 0,
                y2: viewportHeight,
                key: `v-${x}`
            });
        }

        // Horizontal lines
        for (let y = bounds.minY; y <= bounds.maxY + 1; y++) {
            const worldY = this.gridToWorldCorner(0, y).y;
            const screenPos = this.gridWorldToScreen(0, worldY, viewportWidth, viewportHeight);

            lines.push({
                type: 'horizontal',
                x1: 0,
                x2: viewportWidth,
                y: screenPos.y,
                key: `h-${y}`
            });
        }

        return lines;
    }

    /**
     * Check if a point is within the grid bounds (always true for infinite grid)
     */
    isWithinGridBounds(gridX, gridY) {
        // For infinite grid, all coordinates are valid
        return true;
    }

    /**
     * Get the grid coordinate from a mouse event
     */
    getGridCoordinateFromEvent(event, element) {
        const rect = element.getBoundingClientRect();
        const screenX = event.clientX - rect.left;
        const screenY = event.clientY - rect.top;

        // Use viewport dimensions for proper coordinate conversion
        const worldPos = this.screenToWorld(screenX, screenY, rect.width, rect.height);
        return this.worldToGrid(worldPos.x, worldPos.y);
    }

    /**
     * Calculate zoom level that fits the entire content
     */
    calculateFitZoom(contentBounds, viewportWidth, viewportHeight) {
        const { minZoom, maxZoom } = this.getGridState();

        const scaleX = viewportWidth / contentBounds.width;
        const scaleY = viewportHeight / contentBounds.height;
        const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to add some padding

        return Math.max(minZoom, Math.min(maxZoom, scale));
    }

    /**
     * Center camera on specific grid coordinates
     */
    centerCameraOnGrid(gridX, gridY) {
        const worldPos = this.gridToWorld(gridX, gridY);
        this.gameStore.getState().setCameraPosition(worldPos.x, worldPos.y);
    }

    /**
     * Center camera on world coordinates
     */
    centerCameraOnWorld(worldX, worldY) {
        this.gameStore.getState().setCameraPosition(worldX, worldY);
    }

    /**
     * Preserve grid position during viewport changes
     * This method helps maintain visual grid stability when the editor opens/closes
     */
    preserveGridPositionDuringViewportChange(callback) {
        // Store current state before viewport change
        const state = this.getGridState();
        const oldViewport = this.getViewportDimensions();

        // Store a reference point in world coordinates (center of current view)
        const centerWorldX = state.cameraX;
        const centerWorldY = state.cameraY;

        // Execute the callback that changes the viewport
        if (callback) {
            callback();
        }

        // Get new viewport dimensions
        const newViewport = this.getViewportDimensions();

        // If viewport width changed significantly, adjust camera to maintain visual position
        const widthChange = newViewport.width - oldViewport.width;
        if (Math.abs(widthChange) > 50) { // Only adjust for significant changes
            // The grid should appear to stay in the same visual position
            // No camera adjustment needed since we're using centered coordinate system

        }

        // Ensure camera position is exactly preserved
        this.gameStore.getState().setCameraPosition(centerWorldX, centerWorldY);

        return {
            oldViewport,
            newViewport,
            widthChange
        };
    }

    /**
     * Test grid coverage by checking if tiles cover the entire viewport
     */
    testGridCoverage(viewportWidth, viewportHeight) {
        const tiles = this.generateGridTiles(viewportWidth, viewportHeight);
        const { gridSize, zoomLevel } = this.getGridState();
        const safeGridSize = gridSize || 50;
        const safeZoomLevel = zoomLevel != null ? zoomLevel : 1;
        const effectiveTileSize = safeGridSize * safeZoomLevel;

        // Check if we have tiles covering the entire viewport
        if (tiles.length === 0) {
            return { tilesGenerated: 0, fullyCovered: false };
        }

        const minX = Math.min(...tiles.map(t => t.screenX));
        const maxX = Math.max(...tiles.map(t => t.screenX + effectiveTileSize));
        const minY = Math.min(...tiles.map(t => t.screenY));
        const maxY = Math.max(...tiles.map(t => t.screenY + effectiveTileSize));

        const coverage = {
            tilesGenerated: tiles.length,
            coverageX: { min: minX, max: maxX, viewport: viewportWidth },
            coverageY: { min: minY, max: maxY, viewport: viewportHeight },
            fullyCovered: minX <= 0 && maxX >= viewportWidth && minY <= 0 && maxY >= viewportHeight
        };


        return coverage;
    }
}

// Create a singleton instance that can be imported
let gridSystemInstance = null;

export const createGridSystem = (gameStore) => {
    if (!gridSystemInstance) {
        gridSystemInstance = new InfiniteGridSystem(gameStore);
    }
    return gridSystemInstance;
};

export const getGridSystem = () => {
    if (!gridSystemInstance) {
        throw new Error('Grid system not initialized. Call createGridSystem first.');
    }
    return gridSystemInstance;
};
