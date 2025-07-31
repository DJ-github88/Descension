/**
 * Visibility and Line-of-Sight Calculations for Dynamic Fog of War
 * Professional VTT implementation with Bresenham's line algorithm and wall detection
 */

/**
 * Calculate line of sight between two points using Bresenham's line algorithm
 * @param {number} x0 - Starting x coordinate
 * @param {number} y0 - Starting y coordinate  
 * @param {number} x1 - Ending x coordinate
 * @param {number} y1 - Ending y coordinate
 * @returns {Array} Array of {x, y} coordinates along the line
 */
export function getLineOfSight(x0, y0, x1, y1) {
    const points = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    while (true) {
        points.push({ x, y });

        if (x === x1 && y === y1) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }

    return points;
}

/**
 * Check if there's a wall blocking line of sight between two adjacent tiles
 * @param {number} x1 - First tile x
 * @param {number} y1 - First tile y
 * @param {number} x2 - Second tile x
 * @param {number} y2 - Second tile y
 * @param {Object} wallData - Wall data from level editor store
 * @returns {boolean} True if wall blocks line of sight
 */
export function isWallBlocking(x1, y1, x2, y2, wallData) {
    // Generate wall key based on the edge between tiles
    const wallKey = `${Math.min(x1, x2)},${Math.min(y1, y2)},${Math.max(x1, x2)},${Math.max(y1, y2)}`;
    const wall = wallData[wallKey];
    
    if (!wall) return false;
    
    // Check if wall blocks vision (closed doors and solid walls block vision)
    return wall.state === 'closed' || wall.type.blocksVision !== false;
}

/**
 * Calculate visible tiles from a token position considering walls and vision range
 * @param {number} tokenX - Token x position (in grid coordinates)
 * @param {number} tokenY - Token y position (in grid coordinates)
 * @param {number} visionRange - Vision range in tiles
 * @param {string} visionType - Type of vision ('normal', 'darkvision', 'blindsight')
 * @param {Object} wallData - Wall data from level editor store
 * @param {Object} lightSources - Light sources data (for future lighting integration)
 * @returns {Set} Set of visible tile keys "x,y"
 */
export function calculateVisibleTiles(tokenX, tokenY, visionRange, visionType = 'normal', wallData = {}, lightSources = {}) {
    const visibleTiles = new Set();
    const tokenTileX = Math.floor(tokenX);
    const tokenTileY = Math.floor(tokenY);
    
    // Always include the token's current tile
    visibleTiles.add(`${tokenTileX},${tokenTileY}`);
    
    // Calculate vision range based on type
    let effectiveRange = visionRange;
    if (visionType === 'blindsight') {
        // Blindsight ignores walls and lighting
        effectiveRange = Math.min(visionRange, 6); // Usually limited range
    }
    
    // Check all tiles within vision range
    for (let dx = -effectiveRange; dx <= effectiveRange; dx++) {
        for (let dy = -effectiveRange; dy <= effectiveRange; dy++) {
            const targetX = tokenTileX + dx;
            const targetY = tokenTileY + dy;
            
            // Skip if outside range (circular vision)
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > effectiveRange) continue;
            
            // For blindsight, add all tiles within range regardless of walls
            if (visionType === 'blindsight') {
                visibleTiles.add(`${targetX},${targetY}`);
                continue;
            }
            
            // Check line of sight to target tile
            if (hasLineOfSight(tokenTileX, tokenTileY, targetX, targetY, wallData)) {
                visibleTiles.add(`${targetX},${targetY}`);
            }
        }
    }
    
    return visibleTiles;
}

/**
 * Check if there's unobstructed line of sight between two tiles
 * @param {number} x1 - Starting tile x
 * @param {number} y1 - Starting tile y
 * @param {number} x2 - Target tile x
 * @param {number} y2 - Target tile y
 * @param {Object} wallData - Wall data from level editor store
 * @returns {boolean} True if line of sight exists
 */
export function hasLineOfSight(x1, y1, x2, y2, wallData) {
    const linePoints = getLineOfSight(x1, y1, x2, y2);
    
    // Check each step along the line for wall obstructions
    for (let i = 0; i < linePoints.length - 1; i++) {
        const current = linePoints[i];
        const next = linePoints[i + 1];
        
        if (isWallBlocking(current.x, current.y, next.x, next.y, wallData)) {
            return false;
        }
    }
    
    return true;
}

/**
 * Update revealed areas based on all token positions
 * @param {Array} tokens - Array of token objects with position and vision data
 * @param {Object} wallData - Wall data from level editor store
 * @param {Object} fogSettings - Fog settings (dynamicFogEnabled, respectLineOfSight, etc.)
 * @returns {Object} Updated revealed areas data
 */
export function updateRevealedAreas(tokens, wallData, fogSettings) {
    const revealedAreas = {};
    
    if (!fogSettings.dynamicFogEnabled) {
        return revealedAreas;
    }
    
    tokens.forEach(token => {
        if (!token.position || !token.visionRange) return;
        
        const tokenX = token.position.x;
        const tokenY = token.position.y;
        const visionRange = token.visionRange || 6; // Default 30ft vision (6 tiles at 5ft per tile)
        const visionType = token.visionType || 'normal';
        
        // Calculate visible tiles for this token
        const visibleTiles = calculateVisibleTiles(
            tokenX, 
            tokenY, 
            visionRange, 
            visionType, 
            fogSettings.respectLineOfSight ? wallData : {}
        );
        
        // Add visible tiles to revealed areas
        visibleTiles.forEach(tileKey => {
            revealedAreas[tileKey] = true;
        });
    });
    
    return revealedAreas;
}

/**
 * Check if a tile should be visible to players (considering fog, revealed areas, and lighting)
 * @param {number} x - Tile x coordinate
 * @param {number} y - Tile y coordinate
 * @param {Object} fogOfWarData - Static fog data
 * @param {Object} revealedAreas - Dynamically revealed areas
 * @param {boolean} isGMMode - Whether in GM mode
 * @param {Object} lightingData - Optional lighting data for light-based visibility
 * @param {boolean} lightInteractsWithFog - Whether lighting affects fog visibility
 * @returns {boolean} True if tile should be visible
 */
export function isTileVisible(x, y, fogOfWarData, revealedAreas, isGMMode, lightingData = null, lightInteractsWithFog = false) {
    const tileKey = `${x},${y}`;

    // GM can always see everything
    if (isGMMode) return true;

    // Check if tile has static fog
    const hasStaticFog = fogOfWarData[tileKey];

    // Check if tile is dynamically revealed
    const isDynamicallyRevealed = revealedAreas[tileKey];

    // Check if tile is illuminated by lighting (if lighting system is enabled)
    let isIlluminated = false;
    if (lightingData && lightInteractsWithFog) {
        const lighting = lightingData[tileKey];
        isIlluminated = lighting && lighting.intensity > 0.1; // Minimum light threshold
    }

    // Tile is visible if:
    // 1. It doesn't have static fog, OR
    // 2. It's dynamically revealed by token vision, OR
    // 3. It's illuminated by lighting (if lighting interacts with fog)
    return !hasStaticFog || isDynamicallyRevealed || isIlluminated;
}

/**
 * Get vision range in tiles based on feet and grid settings
 * @param {number} feetRange - Vision range in feet
 * @param {number} feetPerTile - Feet per tile (from grid settings)
 * @returns {number} Vision range in tiles
 */
export function feetToTiles(feetRange, feetPerTile = 5) {
    return Math.ceil(feetRange / feetPerTile);
}

/**
 * Standard D&D vision ranges in feet
 */
export const VISION_RANGES = {
    BLIND: 0,
    DIM_LIGHT: 30,
    NORMAL: 60,
    DARKVISION_60: 60,
    DARKVISION_120: 120,
    BLINDSIGHT_10: 10,
    BLINDSIGHT_30: 30,
    BLINDSIGHT_60: 60
};

/**
 * Vision types with their characteristics
 */
export const VISION_TYPES = {
    normal: {
        name: 'Normal Vision',
        ignoresWalls: false,
        ignoresLighting: false,
        description: 'Standard vision affected by walls and lighting'
    },
    darkvision: {
        name: 'Darkvision',
        ignoresWalls: false,
        ignoresLighting: true,
        description: 'Can see in darkness but blocked by walls'
    },
    blindsight: {
        name: 'Blindsight',
        ignoresWalls: true,
        ignoresLighting: true,
        description: 'Can sense surroundings regardless of walls or lighting'
    }
};
