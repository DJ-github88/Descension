/**
 * Visibility and Line-of-Sight Calculations for Dynamic Fog of War
 * Professional VTT implementation with Bresenham's line algorithm and wall detection
 */

// Import WALL_TYPES to check wall properties
import { WALL_TYPES } from '../store/levelEditorStore';

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
 * @param {Object} windowOverlays - Window overlay data (optional)
 * @returns {boolean} True if wall blocks line of sight
 */
export function isWallBlocking(x1, y1, x2, y2, wallData, windowOverlays = {}) {
    if (!wallData || Object.keys(wallData).length === 0) return false;
    
    // Ensure we're working with integers (grid coordinates)
    const gx1 = Math.floor(x1);
    const gy1 = Math.floor(y1);
    const gx2 = Math.floor(x2);
    const gy2 = Math.floor(y2);
    
    // Check if moving between adjacent tiles (only adjacent tiles can have a wall between them)
    const dx = Math.abs(gx2 - gx1);
    const dy = Math.abs(gy2 - gy1);
    
    // Only check for walls if tiles are adjacent (horizontally, vertically, or diagonally)
    if (dx > 1 || dy > 1 || (dx === 0 && dy === 0)) {
        return false; // Not adjacent tiles, no wall can block
    }
    
    // Check all walls to see if any cross the edge between these two tiles
    // Walls are stored as edge segments: "x1,y1,x2,y2" where coordinates are grid corner positions
    // Based on Grid.jsx logic:
    // - Vertical wall at x=x1 separates tiles (x1-1, y) (left) and (x1, y) (right)
    // - Horizontal wall at y=y1 separates tiles (x, y1-1) (top) and (x, y1) (bottom)
    
    for (const [wallKey, wall] of Object.entries(wallData)) {
        const [wx1, wy1, wx2, wy2] = wallKey.split(',').map(Number);
        const isVertical = wx1 === wx2;
        const isHorizontal = wy1 === wy2;
        
        // Check if this wall blocks movement between the two tiles
        if (isVertical) {
            // Vertical wall at x=wx1: separates tiles at x=wx1-1 (left) and x=wx1 (right)
            // Wall spans from min(wy1,wy2) to max(wy1,wy2)
            const wallMinY = Math.min(wy1, wy2);
            const wallMaxY = Math.max(wy1, wy2);
            const wallX = wx1;
            const leftTileX = wallX - 1;
            const rightTileX = wallX;
            
            // Moving horizontally between tiles
            if (gx1 !== gx2 && gy1 === gy2) {
                // Check if these tiles are the ones separated by this wall
                const tileY = gy1;
                if (tileY >= wallMinY && tileY <= wallMaxY) {
                    // Wall blocks if these tiles are separated by it
                    if ((gx1 === leftTileX && gx2 === rightTileX) || (gx1 === rightTileX && gx2 === leftTileX)) {
                        if (checkIfWallBlocks(wall, wallKey, windowOverlays)) {
                            // Wall blocking detected (logging removed for performance)
                            return true;
                        }
                    }
                }
            }
        } else if (isHorizontal) {
            // Horizontal wall at y=wy1: separates tiles at y=wy1-1 (top) and y=wy1 (bottom)
            // Wall spans from min(wx1,wx2) to max(wx1,wx2)
            const wallMinX = Math.min(wx1, wx2);
            const wallMaxX = Math.max(wx1, wx2);
            const wallY = wy1;
            const topTileY = wallY - 1;
            const bottomTileY = wallY;
            
            // Moving vertically between tiles
            if (gx1 === gx2 && gy1 !== gy2) {
                // Check if these tiles are the ones separated by this wall
                const tileX = gx1;
                if (tileX >= wallMinX && tileX <= wallMaxX) {
                    // Wall blocks if these tiles are separated by it
                    if ((gy1 === topTileY && gy2 === bottomTileY) || (gy1 === bottomTileY && gy2 === topTileY)) {
                        if (checkIfWallBlocks(wall, wallKey, windowOverlays)) {
                            // Wall blocking detected (logging removed for performance)
                            return true;
                        }
                    }
                }
            }
        }
        
        // For diagonal movement, check if either a horizontal or vertical wall blocks
        if (dx === 1 && dy === 1) {
            if (isVertical) {
                const wallMinY = Math.min(wy1, wy2);
                const wallMaxY = Math.max(wy1, wy2);
                const wallX = wx1;
                const leftTileX = wallX - 1;
                const rightTileX = wallX;
                
                // Check if wall blocks horizontal component of diagonal movement
                // Check both Y coordinates in case diagonal crosses the wall
                const tileY1 = gy1;
                const tileY2 = gy2;
                if ((tileY1 >= wallMinY && tileY1 <= wallMaxY) || (tileY2 >= wallMinY && tileY2 <= wallMaxY)) {
                    if ((gx1 === leftTileX && gx2 === rightTileX) || (gx1 === rightTileX && gx2 === leftTileX)) {
                        if (checkIfWallBlocks(wall, wallKey, windowOverlays)) {
                            // Wall blocking diagonal detected (logging removed for performance)
                            return true;
                        }
                    }
                }
            } else if (isHorizontal) {
                const wallMinX = Math.min(wx1, wx2);
                const wallMaxX = Math.max(wx1, wx2);
                const wallY = wy1;
                const topTileY = wallY - 1;
                const bottomTileY = wallY;
                
                // Check if wall blocks vertical component of diagonal movement
                // Check both X coordinates in case diagonal crosses the wall
                const tileX1 = gx1;
                const tileX2 = gx2;
                if ((tileX1 >= wallMinX && tileX1 <= wallMaxX) || (tileX2 >= wallMinX && tileX2 <= wallMaxX)) {
                    if ((gy1 === topTileY && gy2 === bottomTileY) || (gy1 === bottomTileY && gy2 === topTileY)) {
                        if (checkIfWallBlocks(wall, wallKey, windowOverlays)) {
                            // Wall blocking diagonal detected (logging removed for performance)
                            return true;
                        }
                    }
                }
            }
        }
    }
    
    return false;
}

function checkIfWallBlocks(wall, wallKey = null, windowOverlays = {}) {
    // Handle both old format (wall is a string) and new format (wall is an object)
    if (typeof wall === 'string') {
        // Old format: wall is just the type string
        // Check for window overlays at this wall's position
        if (wallKey && windowOverlays && Object.keys(windowOverlays).length > 0) {
            const [wx1, wy1, wx2, wy2] = wallKey.split(',').map(Number);
            // Check if there's a window at any point along this wall
            const minX = Math.min(wx1, wx2);
            const maxX = Math.max(wx1, wx2);
            const minY = Math.min(wy1, wy2);
            const maxY = Math.max(wy1, wy2);
            
            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    const windowKey = `${x},${y}`;
                    if (windowOverlays[windowKey]) {
                        // Window found - allows vision through
                        return false;
                    }
                }
            }
        }
        // Default: assume all walls block vision
        return true;
    }
    
    // New format: wall is an object with { type, state, id }
    const wallTypeId = wall.type;
    
    // Check wall state first (closed/locked doors block vision, open doors don't)
    if (wall.state === 'closed') return true;
    if (wall.state === 'locked') return true; // Locked doors also block vision
    if (wall.state === 'open') return false; // Open doors don't block
    
    // Check for window overlays at this wall's position
    if (wallKey && windowOverlays && Object.keys(windowOverlays).length > 0) {
        const [wx1, wy1, wx2, wy2] = wallKey.split(',').map(Number);
        // Check if there's a window at any point along this wall
        const minX = Math.min(wx1, wx2);
        const maxX = Math.max(wx1, wx2);
        const minY = Math.min(wy1, wy2);
        const maxY = Math.max(wy1, wy2);
        
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                const windowKey = `${x},${y}`;
                if (windowOverlays[windowKey]) {
                    // Window found - allows vision through
                    return false;
                }
            }
        }
    }
    
    // Check if this wall type blocks line of sight
    if (WALL_TYPES && WALL_TYPES[wallTypeId]) {
        const wallType = WALL_TYPES[wallTypeId];
        const blocksVision = wallType.blocksLineOfSight !== false;
        return blocksVision;
    }
    
    // If we can't find the wall type, default to blocking (safer assumption)
    // This ensures walls always block unless explicitly marked otherwise
    return true;
}

/**
 * Cast a ray from origin and return the first wall intersection point
 * @param {number} originX - Origin x (world coordinates)
 * @param {number} originY - Origin y (world coordinates)
 * @param {number} angle - Ray angle in radians
 * @param {number} maxRange - Maximum ray range
 * @param {Object} wallData - Wall data
 * @param {number} gridSize - Grid size for coordinate conversion
 * @param {number} gridOffsetX - Grid X offset
 * @param {number} gridOffsetY - Grid Y offset
 * @returns {{x: number, y: number, distance: number}} Ray end point
 */
function castRay(originX, originY, angle, maxRange, wallData, gridSize, gridOffsetX, gridOffsetY) {
    const endX = originX + Math.cos(angle) * maxRange;
    const endY = originY + Math.sin(angle) * maxRange;
    
    let closestHit = null;
    let closestDistance = maxRange;
    
    // Check all walls for intersections
    for (const [wallKey, wall] of Object.entries(wallData)) {
        if (!checkIfWallBlocks(wall, wallKey, {})) continue;
        
        const [wx1, wy1, wx2, wy2] = wallKey.split(',').map(Number);
        // Convert grid corner coordinates to world coordinates
        // Walls are stored at grid corners, so multiply by gridSize and add offset
        const worldX1 = (wx1 * gridSize) + gridOffsetX;
        const worldY1 = (wy1 * gridSize) + gridOffsetY;
        const worldX2 = (wx2 * gridSize) + gridOffsetX;
        const worldY2 = (wy2 * gridSize) + gridOffsetY;
        
        // Line-line intersection between ray and wall segment
        const hit = lineIntersection(
            originX, originY, endX, endY,
            worldX1, worldY1, worldX2, worldY2
        );
        
        if (hit) {
            const distance = Math.sqrt(
                Math.pow(hit.x - originX, 2) + Math.pow(hit.y - originY, 2)
            );
            if (distance < closestDistance) {
                closestDistance = distance;
                closestHit = hit;
            }
        }
    }
    
    if (closestHit) {
        return { ...closestHit, distance: closestDistance };
    }
    
    // No wall hit - return max range point
    return { x: endX, y: endY, distance: maxRange };
}

/**
 * Line-line intersection helper
 */
function lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.0001) return null; // Parallel lines
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };
    }
    return null;
}

/**
 * Calculate a smooth visibility polygon using raycasting
 * This creates a fluid FOV that can peek around corners
 * @param {number} originX - Origin x (world coordinates)
 * @param {number} originY - Origin y (world coordinates)
 * @param {number} visionRange - Vision range (in tiles)
 * @param {Object} wallData - Wall data
 * @param {number} gridSize - Grid size
 * @param {number} gridOffsetX - Grid X offset
 * @param {number} gridOffsetY - Grid Y offset
 * @param {number} fovAngle - FOV angle in degrees (360 = full view, default 360)
 * @param {number} facingAngle - Direction token is facing in radians (null = 360 view)
 * @returns {Array} Array of {x, y} points forming the visibility polygon
 */
export function calculateVisibilityPolygon(originX, originY, visionRange, wallData, gridSize, gridOffsetX, gridOffsetY, fovAngle = 360, facingAngle = null) {
    const maxRange = visionRange * gridSize;
    const numRays = Math.max(180, visionRange * 20); // More rays for smoother polygon
    const polygon = [];
    
    // Determine angle range based on FOV
    let startAngle, endAngle, angleStep;
    
    if (fovAngle >= 360) {
        // Full 360-degree sweep
        startAngle = 0;
        endAngle = Math.PI * 2;
        angleStep = (endAngle - startAngle) / numRays;
    } else {
        // Limited FOV cone
        const halfFovRadians = (fovAngle * Math.PI / 180) / 2;
        if (facingAngle === null || facingAngle === undefined) {
            // Default to facing up (0 radians = pointing right, but -PI/2 = up in screen coords)
            facingAngle = -Math.PI / 2; // Up by default
        }
        startAngle = facingAngle - halfFovRadians;
        endAngle = facingAngle + halfFovRadians;
        angleStep = (endAngle - startAngle) / numRays;
    }
    
    // Cast rays within the FOV cone
    for (let i = 0; i < numRays; i++) {
        const angle = startAngle + (i * angleStep);
        const rayEnd = castRay(originX, originY, angle, maxRange, wallData, gridSize, gridOffsetX, gridOffsetY);
        polygon.push({ x: rayEnd.x, y: rayEnd.y });
    }
    
    // For limited FOV, add the token position as a point to close the polygon
    if (fovAngle < 360) {
        polygon.push({ x: originX, y: originY });
    }
    
    return polygon;
}

/**
 * Check if a point is within the FOV cone
 * @param {number} tokenX - Token x position
 * @param {number} tokenY - Token y position
 * @param {number} targetX - Target x position
 * @param {number} targetY - Target y position
 * @param {number} fovAngle - FOV angle in degrees (360 = full view)
 * @param {number} facingAngle - Direction token is facing in radians (null = use direction to target)
 * @returns {boolean} True if target is within FOV cone
 */
function isWithinFovCone(tokenX, tokenY, targetX, targetY, fovAngle, facingAngle) {
    // If full 360 view, always return true
    if (fovAngle >= 360) {
        return true;
    }
    
    // If no facing angle provided, cannot determine cone (default to full view)
    if (facingAngle === null || facingAngle === undefined) {
        return true; // For backward compatibility, allow if no facing angle
    }
    
    // Calculate angle from token to target
    const angleToTarget = Math.atan2(targetY - tokenY, targetX - tokenX);
    
    // Calculate angle difference (normalize to -PI to PI)
    let angleDiff = angleToTarget - facingAngle;
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    
    // Check if within FOV cone (half angle on each side)
    const halfFovRadians = (fovAngle * Math.PI / 180) / 2;
    return Math.abs(angleDiff) <= halfFovRadians;
}

/**
 * Calculate visible tiles from a token position considering walls and vision range
 * @param {number} tokenX - Token x position (in grid coordinates)
 * @param {number} tokenY - Token y position (in grid coordinates)
 * @param {number} visionRange - Vision range in tiles
 * @param {string} visionType - Type of vision ('normal', 'darkvision', 'blindsight')
 * @param {Object} wallData - Wall data from level editor store
 * @param {Object} lightSources - Light sources data (for future lighting integration)
 * @param {number} fovAngle - FOV angle in degrees (360 = full view, default 360)
 * @param {number} facingAngle - Direction token is facing in radians (null = 360 view)
 * @param {string} gridType - Grid type ('square' or 'hex')
 * @param {Object} gridSystem - Grid system instance for hex calculations
 * @returns {Set} Set of visible tile keys "x,y" or "q,r" for hex
 */
export function calculateVisibleTiles(tokenX, tokenY, visionRange, visionType = 'normal', wallData = {}, lightSources = {}, fovAngle = 360, facingAngle = null, gridType = 'square', gridSystem = null) {
    const visibleTiles = new Set();
    const tokenTileX = Math.floor(tokenX);
    const tokenTileY = Math.floor(tokenY);
    
    // Always include the token's current tile
    visibleTiles.add(`${tokenTileX},${tokenTileY}`);
    
    // Validate vision range
    if (!visionRange || visionRange <= 0 || isNaN(visionRange)) {
        // If invalid range, return only the token's tile
        return visibleTiles;
    }
    
    // Calculate vision range based on type
    let effectiveRange = Math.max(1, Math.floor(visionRange)); // Ensure at least 1 tile
    if (visionType === 'blindsight') {
        // Blindsight ignores walls and lighting
        effectiveRange = Math.min(effectiveRange, 6); // Usually limited range
    }
    
    if (gridType === 'hex' && gridSystem) {
        // Hex grid visibility calculation
        const tokenQ = tokenTileX; // In hex, tokenX is q
        const tokenR = tokenTileY; // In hex, tokenY is r
        
        // Check all hexes within vision range using hex distance
        for (let q = tokenQ - effectiveRange; q <= tokenQ + effectiveRange; q++) {
            for (let r = tokenR - effectiveRange; r <= tokenR + effectiveRange; r++) {
                // Calculate hex distance
                const hexDist = gridSystem.hexDistance(q, r, tokenQ, tokenR);
                if (hexDist > effectiveRange) continue;
                
                const targetKey = `${q},${r}`;
                
                // For blindsight, add all hexes within range regardless of walls
                if (visionType === 'blindsight') {
                    visibleTiles.add(targetKey);
                    continue;
                }
                
                // Check if target is within FOV cone (if limited FOV is enabled)
                // For hex, we need to convert to world coords for FOV check
                const tokenWorld = gridSystem.hexToWorld(tokenQ, tokenR);
                const targetWorld = gridSystem.hexToWorld(q, r);
                if (!isWithinFovCone(tokenWorld.x, tokenWorld.y, targetWorld.x, targetWorld.y, fovAngle, facingAngle)) {
                    continue;
                }
                
                // Check line of sight to target hex (simplified for hex - could be improved)
                const hasLOS = hasLineOfSight(tokenQ, tokenR, q, r, wallData, gridType);
                if (hasLOS) {
                    visibleTiles.add(targetKey);
                }
            }
        }
    } else {
        // Square grid visibility calculation (original behavior)
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
                
                // Check if target is within FOV cone (if limited FOV is enabled)
                if (!isWithinFovCone(tokenTileX, tokenTileY, targetX, targetY, fovAngle, facingAngle)) {
                    continue; // Skip tiles outside FOV cone
                }
                
                // Check line of sight to target tile
                const hasLOS = hasLineOfSight(tokenTileX, tokenTileY, targetX, targetY, wallData, gridType);
                if (hasLOS) {
                    visibleTiles.add(`${targetX},${targetY}`);
                }
                // Line of sight check complete (logging removed for performance)
            }
        }
    }
    
    return visibleTiles;
}

/**
 * Check if there's unobstructed line of sight between two tiles
 * @param {number} x1 - Starting tile x (or q for hex)
 * @param {number} y1 - Starting tile y (or r for hex)
 * @param {number} x2 - Target tile x (or q for hex)
 * @param {number} y2 - Target tile y (or r for hex)
 * @param {Object} wallData - Wall data from level editor store
 * @param {string} gridType - Grid type ('square' or 'hex')
 * @returns {boolean} True if line of sight exists
 */
export function hasLineOfSight(x1, y1, x2, y2, wallData, gridType = 'square') {
    if (!wallData || Object.keys(wallData).length === 0) {
        // No walls to check - line of sight is clear
        return true;
    }
    
    const linePoints = getLineOfSight(x1, y1, x2, y2);
    
    // Check each step along the line for wall obstructions
    for (let i = 0; i < linePoints.length - 1; i++) {
        const current = linePoints[i];
        const next = linePoints[i + 1];
        
        // Check if a wall blocks movement between these two adjacent tiles
        // Walls can be stored on edges between tiles, so we need to check multiple potential wall keys
        if (isWallBlocking(current.x, current.y, next.x, next.y, wallData)) {
            // Wall detected blocking line of sight
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
 * Check if a point is inside a polygon using ray casting algorithm
 * @param {number} x - Point x coordinate
 * @param {number} y - Point y coordinate
 * @param {Array} polygon - Array of {x, y} points forming the polygon
 * @returns {boolean} True if point is inside polygon
 */
function isPointInPolygon(x, y, polygon) {
    if (!polygon || polygon.length < 3) return false;
    
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
 * Check if a world position is within the visible area (for FOV-based visibility)
 * Now supports both tile-based and polygon-based visibility checking
 * @param {number} worldX - World x coordinate
 * @param {number} worldY - World y coordinate
 * @param {Set|Array} visibleArea - Set of visible tile keys "x,y" OR visibility polygon array
 * @param {number} gridSize - Grid size
 * @param {number} gridOffsetX - Grid X offset
 * @param {number} gridOffsetY - Grid Y offset
 * @returns {boolean} True if position is visible
 */
export function isPositionVisible(worldX, worldY, visibleArea, gridSize, gridOffsetX, gridOffsetY) {
    // If visibleArea is null or empty, caller should decide visibility based on context
    if (!visibleArea || (visibleArea instanceof Set && visibleArea.size === 0) || (Array.isArray(visibleArea) && visibleArea.length === 0)) {
        return false;
    }
    
    // Check if visibleArea is a polygon (array of {x, y} points)
    if (Array.isArray(visibleArea) && visibleArea.length > 0 && typeof visibleArea[0] === 'object' && 'x' in visibleArea[0]) {
        // It's a polygon - use point-in-polygon test for accurate visibility
        return isPointInPolygon(worldX, worldY, visibleArea);
    }
    
    // Otherwise, it's a tile-based Set - use grid-based checking
    // Convert world coordinates to grid coordinates
    const gridX = Math.floor((worldX - gridOffsetX) / gridSize);
    const gridY = Math.floor((worldY - gridOffsetY) / gridSize);
    
    // Check if this tile is in the visible area
    const tileKey = `${gridX},${gridY}`;
    const visibleAreaSet = visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
    return visibleAreaSet.has(tileKey);
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
