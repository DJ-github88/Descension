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
     */
    worldToGrid(worldX, worldY) {
        const { gridSize, gridOffsetX, gridOffsetY } = this.getGridState();
        return {
            x: Math.floor((worldX - gridOffsetX) / gridSize),
            y: Math.floor((worldY - gridOffsetY) / gridSize)
        };
    }

    /**
     * Convert grid coordinates to world coordinates (tile center)
     */
    gridToWorld(gridX, gridY) {
        const { gridSize, gridOffsetX, gridOffsetY } = this.getGridState();
        return {
            x: (gridX * gridSize) + gridOffsetX + (gridSize / 2),
            y: (gridY * gridSize) + gridOffsetY + (gridSize / 2)
        };
    }

    /**
     * Convert grid coordinates to world coordinates (tile top-left corner)
     */
    gridToWorldCorner(gridX, gridY) {
        const { gridSize, gridOffsetX, gridOffsetY } = this.getGridState();
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

        // Debug logging removed for cleaner console output

        return tiles;
    }

    /**
     * Get grid lines for rendering
     */
    generateGridLines(viewportWidth, viewportHeight) {
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
