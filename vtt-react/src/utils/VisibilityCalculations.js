/**
 * Visibility and Line-of-Sight Calculations for shifting Fog of War
 * Professional VTT implementation with Bresenham's line algorithm and wall detection
 */

// Import WALL_TYPES to check wall properties
import { WALL_TYPES } from '../store/levelEditorStore';
import { compute as computeVisibilityPolygon, breakIntersections as breakPolygonIntersections } from 'visibility-polygon';
import { getOrBuildWallSpatialIndex } from './WallSpatialIndex';
import {
  parseWallKey,
  getWallWorldEndpoints,
  getWallBaseWorldZ,
  getWallHeightWorld,
  getWallThickness
} from './WallGeometry';

// PERFORMANCE: Wall edge index cache: maps edge keys to wall entries for O(1) lookup
// Edge key format: "h,{minX},{y},{maxX}" for horizontal edges, "v,{x},{minY},{maxY}" for vertical edges
// Indexed by the exact edge between two adjacent tiles: "v,{wallX},{tileY}" or "h,{tileX},{wallY}"
let _wallEdgeIndex = null;
let _wallEdgeIndexKey = null;

function getWallEdgeIndex(wallData, windowOverlays) {
  const dataKey = wallData === _wallEdgeIndex?.__src ? _wallEdgeIndexKey : null;
  if (dataKey && _wallEdgeIndex) return _wallEdgeIndex;

  const index = { __src: wallData };
  const verticalEdges = index._v = new Map(); // "x,y" -> [{wall, wallKey}]
  const horizontalEdges = index._h = new Map(); // "x,y" -> [{wall, wallKey}]
  const diagonalEdges = index._d = new Map(); // "cellX,cellY" -> [{wall, wallKey}] (angled walls bisecting cells)

  for (const [wallKey, wall] of Object.entries(wallData)) {
    const [wx1, wy1, wx2, wy2] = wallKey.split(',').map(Number);
    if (wx1 === wx2) {
      // Vertical wall at x=wx1, spans wy1..wy2. Tolerate fractional endpoints
      // (legacy partial walls) by snapping to the nearest lattice edge and
      // indexing every cell the span touches.
      const keyX = Math.round(wx1);
      const minY = Math.min(wy1, wy2);
      const maxY = Math.max(wy1, wy2);
      for (let y = Math.floor(minY); y < Math.ceil(maxY); y++) {
        const key = `${keyX},${y}`;
        if (!verticalEdges.has(key)) verticalEdges.set(key, []);
        verticalEdges.get(key).push({ wall, wallKey });
      }
    } else if (wy1 === wy2) {
      // Horizontal wall at y=wy1, spans wx1..wx2
      const keyY = Math.round(wy1);
      const minX = Math.min(wx1, wx2);
      const maxX = Math.max(wx1, wx2);
      for (let x = Math.floor(minX); x < Math.ceil(maxX); x++) {
        const key = `${x},${keyY}`;
        if (!horizontalEdges.has(key)) horizontalEdges.set(key, []);
        horizontalEdges.get(key).push({ wall, wallKey });
      }
    } else if (Math.abs(wx2 - wx1) === Math.abs(wy2 - wy1)) {
      // Angled wall (45°): index every cell it bisects. Diagonal movement across
      // such a cell is blocked; previously these walls were ignored entirely.
      const steps = Math.abs(wx2 - wx1);
      const stepX = Math.sign(wx2 - wx1);
      const stepY = Math.sign(wy2 - wy1);
      for (let i = 0; i < steps; i++) {
        const ax = wx1 + stepX * i;
        const bx = wx1 + stepX * (i + 1);
        const ay = wy1 + stepY * i;
        const by = wy1 + stepY * (i + 1);
        const key = `${Math.min(ax, bx)},${Math.min(ay, by)}`;
        if (!diagonalEdges.has(key)) diagonalEdges.set(key, []);
        diagonalEdges.get(key).push({ wall, wallKey });
      }
    }
  }

  _wallEdgeIndex = index;
  _wallEdgeIndexKey = wallData;
  return index;
}

/**
 * Calculate line of sight between two points using Bresenham's line algorithm
 * @param {number} x0 - Starting x coordinate
 * @param {number} y0 - Starting y coordinate 
 * @param {number} x1 - Ending x coordinate
 * @param {number} y1 - Ending y coordinate
 * @returns {Array} Array of {x, y} coordinates along the line
 */
export function getLineOfSight(x0, y0, x1, y1) {
  // Tile-space Bresenham. Callers may hand us fractional sample coordinates
  // (e.g. shadow sampling around a light target); without integer snapping the
  // `x === x1 && y === y1` termination test can never be met and the walk
  // grows until it throws "Invalid array length". Snap to tiles and cap the
  // step count as a safety net.
  const ix0 = Math.floor(Number(x0) || 0);
  const iy0 = Math.floor(Number(y0) || 0);
  const ix1 = Math.floor(Number(x1) || 0);
  const iy1 = Math.floor(Number(y1) || 0);

  const points = [];
  const dx = Math.abs(ix1 - ix0);
  const dy = Math.abs(iy1 - iy0);
  const sx = ix0 < ix1 ? 1 : -1;
  const sy = iy0 < iy1 ? 1 : -1;
  let err = dx - dy;
  const maxSteps = dx + dy + 2;

  let x = ix0;
  let y = iy0;

  for (let step = 0; step <= maxSteps; step += 1) {
    points.push({ x, y });

    if (x === ix1 && y === iy1) break;
    if (step === maxSteps) break;

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
  return isWallBlockingWith(x1, y1, x2, y2, wallData, (wall, wallKey) =>
    checkIfWallBlocks(wall, wallKey, windowOverlays));
}

/**
 * Movement variant of {@link isWallBlocking}. Sight and movement are different
 * questions: windows and magical barriers let vision through but still stop
 * tokens, while open doors stop blocking both. Uses the wall type's
 * `blocksMovement` flag plus door state.
 */
export function isWallBlockingMovement(x1, y1, x2, y2, wallData) {
  return isWallBlockingWith(x1, y1, x2, y2, wallData, checkIfWallBlocksMovement);
}

function isWallBlockingWith(x1, y1, x2, y2, wallData, predicate) {
  if (!wallData || Object.keys(wallData).length === 0) return false;

  const gx1 = Math.floor(x1);
  const gy1 = Math.floor(y1);
  const gx2 = Math.floor(x2);
  const gy2 = Math.floor(y2);

  const dx = Math.abs(gx2 - gx1);
  const dy = Math.abs(gy2 - gy1);

  if (dx > 1 || dy > 1 || (dx === 0 && dy === 0)) {
    return false;
  }

  // PERFORMANCE: Use edge index for O(1) lookup instead of iterating all walls
  const index = getWallEdgeIndex(wallData, {});

  // Check vertical edge between tiles (horizontal movement)
  if (gx1 !== gx2) {
    const wallX = Math.max(gx1, gx2); // Vertical wall at this x
    const edgeKey = `${wallX},${gy1}`;
    const walls = index._v.get(edgeKey);
    if (walls) {
      for (const { wall, wallKey } of walls) {
        if (predicate(wall, wallKey)) {
          return true;
        }
      }
    }
  }

  // Check horizontal edge between tiles (vertical movement)
  if (gy1 !== gy2) {
    const wallY = Math.max(gy1, gy2); // Horizontal wall at this y
    const edgeKey = `${gx1},${wallY}`;
    const walls = index._h.get(edgeKey);
    if (walls) {
      for (const { wall, wallKey } of walls) {
        if (predicate(wall, wallKey)) {
          return true;
        }
      }
    }
  }

  // For diagonal movement, check both edges
  if (dx === 1 && dy === 1) {
    // Angled (45°) wall bisecting the shared cell blocks the diagonal crossing
    const diagonalKey = `${Math.min(gx1, gx2)},${Math.min(gy1, gy2)}`;
    const diagonalWalls = index._d.get(diagonalKey);
    if (diagonalWalls) {
      for (const { wall, wallKey } of diagonalWalls) {
        if (predicate(wall, wallKey)) {
          return true;
        }
      }
    }

    // Check vertical edge for diagonal
    const wallX = Math.max(gx1, gx2);
    for (const checkY of [gy1, gy2]) {
      const edgeKey = `${wallX},${checkY}`;
      const walls = index._v.get(edgeKey);
      if (walls) {
        for (const { wall, wallKey } of walls) {
          if (predicate(wall, wallKey)) {
            return true;
          }
        }
      }
    }

    // Check horizontal edge for diagonal
    const wallY = Math.max(gy1, gy2);
    for (const checkX of [gx1, gx2]) {
      const edgeKey = `${checkX},${wallY}`;
      const walls = index._h.get(edgeKey);
      if (walls) {
        for (const { wall, wallKey } of walls) {
          if (predicate(wall, wallKey)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/** Standard segment intersection test (grid-space). */
function segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
  const orient = (px, py, qx, qy, rx, ry) => {
    const value = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
    if (Math.abs(value) < 1e-9) return 0;
    return value > 0 ? 1 : 2;
  };

  const onSegment = (px, py, qx, qy, rx, ry) =>
    qx <= Math.max(px, rx) + 1e-9 && qx >= Math.min(px, rx) - 1e-9 &&
    qy <= Math.max(py, ry) + 1e-9 && qy >= Math.min(py, ry) - 1e-9;

  const o1 = orient(ax, ay, bx, by, cx, cy);
  const o2 = orient(ax, ay, bx, by, dx, dy);
  const o3 = orient(cx, cy, dx, dy, ax, ay);
  const o4 = orient(cx, cy, dx, dy, bx, by);

  if (o1 !== o2 && o3 !== o4) return true;

  if (o1 === 0 && onSegment(ax, ay, cx, cy, bx, by)) return true;
  if (o2 === 0 && onSegment(ax, ay, dx, dy, bx, by)) return true;
  if (o3 === 0 && onSegment(cx, cy, ax, ay, dx, dy)) return true;
  if (o4 === 0 && onSegment(cx, cy, bx, by, dx, dy)) return true;

  return false;
}

/**
 * Resolve a wall record to its world-space segment. Square walls use the key's
 * grid-corner math; hex walls resolve through hexEndpoints (free-form chords)
 * or the hex edge between the cell pair, exactly like wall rendering does.
 */
function wallWorldSegment(wallKey, wall, gridType, gridSystem, gridSize, gridOffsetX, gridOffsetY) {
  const parsed = parseWallKey(wallKey);
  if (!parsed) return null;
  if (gridType === 'hex') {
    if (!gridSystem || typeof gridSystem.getHexEdge !== 'function') return null;
    const ends = getWallWorldEndpoints(parsed, gridSystem, 'hex', wall);
    if (!ends) return null;
    return { x1: ends.start.x, y1: ends.start.y, x2: ends.end.x, y2: ends.end.y };
  }
  return {
    x1: (parsed.x1 * gridSize) + gridOffsetX,
    y1: (parsed.y1 * gridSize) + gridOffsetY,
    x2: (parsed.x2 * gridSize) + gridOffsetX,
    y2: (parsed.y2 * gridSize) + gridOffsetY
  };
}

function checkIfWallBlocks(wall, wallKey = null, windowOverlays = {}, isHex = false) {
  if (typeof wall === 'string') {
    // Old format: wall is just the type string
    // Check for window overlays at this wall's position
    if (!isHex && wallKey && windowOverlays && Object.keys(windowOverlays).length > 0) {
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
  if (!isHex && wallKey && windowOverlays && Object.keys(windowOverlays).length > 0) {
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
 * Movement-blocking counterpart to {@link checkIfWallBlocks}. Returns true when
 * a wall stops token movement. Open doors pass; every other wall checks its
 * wall type's `blocksMovement` flag (windows/barriers block movement even
 * though they don't block sight).
 */
function checkIfWallBlocksMovement(wall) {
  if (typeof wall === 'string') {
    // Legacy format: value is the wall type id
    return WALL_TYPES?.[wall]?.blocksMovement !== false;
  }

  const wallTypeId = wall.type;

  if (wall.state === 'open') return false;

  if (WALL_TYPES && WALL_TYPES[wallTypeId]) {
    return WALL_TYPES[wallTypeId].blocksMovement !== false;
  }

  // Unknown type: assume solid
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
function castRay(originX, originY, angle, maxRange, wallData, gridSize, gridOffsetX, gridOffsetY, windowOverlays = {}, gridType = 'square', gridSystem = null) {
  const endX = originX + Math.cos(angle) * maxRange;
  const endY = originY + Math.sin(angle) * maxRange;

  let closestHit = null;
  let closestDistance = maxRange;
  const isHex = gridType === 'hex';

  // Check all walls for intersections
  for (const [wallKey, wall] of Object.entries(wallData)) {
    if (!checkIfWallBlocks(wall, wallKey, windowOverlays, isHex)) continue;

    const segment = wallWorldSegment(wallKey, wall, gridType, gridSystem, gridSize, gridOffsetX, gridOffsetY);
    if (!segment) continue;

    // Line-line intersection between ray and wall segment
    const hit = lineIntersection(
      originX, originY, endX, endY,
      segment.x1, segment.y1, segment.x2, segment.y2
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
 * Fallback raymarcher for visibility polygon (legacy raycasting)
 */
function fallbackRaymarchVisibility(originX, originY, visionRange, wallData, gridSize, gridOffsetX, gridOffsetY, fovAngle = 360, facingAngle = null, windowOverlays = {}, gridType = 'square', gridSystem = null) {
  const maxRange = visionRange * gridSize;
  const numRays = Math.max(180, visionRange * 20);
  const polygon = [];

  let startAngle, endAngle, angleStep;

  if (fovAngle >= 360) {
    startAngle = 0;
    endAngle = Math.PI * 2;
    angleStep = (endAngle - startAngle) / numRays;
  } else {
    const halfFovRadians = (fovAngle * Math.PI / 180) / 2;
    if (facingAngle === null || facingAngle === undefined) {
      facingAngle = -Math.PI / 2;
    }
    startAngle = facingAngle - halfFovRadians;
    endAngle = facingAngle + halfFovRadians;
    angleStep = (endAngle - startAngle) / numRays;
  }

  for (let i = 0; i < numRays; i++) {
    const angle = startAngle + (i * angleStep);
    const rayEnd = castRay(originX, originY, angle, maxRange, wallData, gridSize, gridOffsetX, gridOffsetY, windowOverlays, gridType, gridSystem);
    polygon.push({ x: rayEnd.x, y: rayEnd.y });
  }

  if (fovAngle < 360) {
    polygon.push({ x: originX, y: originY });
  }

  return polygon;
}

/**
 * Calculate a smooth, exact visibility polygon using 2D geometry raycasting (visibility-polygon)
 * This creates a fast, exact FOV that wraps dungeon walls and peeks around corners without ray stepping artifacts
 * @param {number} originX - Origin x (world coordinates)
 * @param {number} originY - Origin y (world coordinates)
 * @param {number} visionRange - Vision range (in tiles)
 * @param {Object} wallData - Wall data
 * @param {number} gridSize - Grid size
 * @param {number} gridOffsetX - Grid X offset
 * @param {number} gridOffsetY - Grid Y offset
 * @param {number} fovAngle - FOV angle in degrees (360 = full view, default 360)
 * @param {number} facingAngle - Direction token is facing in radians (null = 360 view)
 * @param {Object} windowOverlays - Window overlays
 * @param {string} gridType - Grid type ('square' or 'hex')
 * @param {Object} gridSystem - Grid system instance (required for hex walls)
 * @returns {Array} Array of {x, y} points forming the visibility polygon
 */
export function calculateVisibilityPolygon(originX, originY, visionRange, wallData, gridSize, gridOffsetX, gridOffsetY, fovAngle = 360, facingAngle = null, windowOverlays = {}, gridType = 'square', gridSystem = null, environmentalObjects = []) {
  const maxRange = (visionRange || 6) * gridSize;
  if (!maxRange || maxRange <= 0) return [];

  try {
    const segments = [];
    const isHex = gridType === 'hex';

    // 1. Create a circular perimeter polygon boundary (32 regular segments)
    const numCircleSegments = 32;
    for (let i = 0; i < numCircleSegments; i++) {
      const a1 = (i * 2 * Math.PI) / numCircleSegments;
      const a2 = ((i + 1) * 2 * Math.PI) / numCircleSegments;
      segments.push([
        [originX + maxRange * Math.cos(a1), originY + maxRange * Math.sin(a1)],
        [originX + maxRange * Math.cos(a2), originY + maxRange * Math.sin(a2)]
      ]);
    }

    // 2. Extract blocking walls within the search bounding box
    const searchRadius = maxRange * 1.1;
    const minX = originX - searchRadius;
    const maxX = originX + searchRadius;
    const minY = originY - searchRadius;
    const maxY = originY + searchRadius;

    if (wallData && Object.keys(wallData).length > 0) {
      let candidateWalls = null;
      try {
        const spatialIndex = getOrBuildWallSpatialIndex(wallData, gridSize, gridOffsetX, gridOffsetY, gridType, gridSystem);
        candidateWalls = spatialIndex.searchBoundingBox(minX, minY, maxX, maxY);
      } catch (e) {
        candidateWalls = null;
      }

      if (candidateWalls) {
        for (let i = 0; i < candidateWalls.length; i++) {
          const item = candidateWalls[i];
          if (!checkIfWallBlocks(item.wall, item.wallKey, windowOverlays, isHex)) continue;
          const [worldX1, worldY1, worldX2, worldY2] = item.worldCoords;
          if (Math.hypot(worldX2 - worldX1, worldY2 - worldY1) < 0.001) continue;
          segments.push([[worldX1, worldY1], [worldX2, worldY2]]);
        }
      } else {
        for (const [wallKey, wall] of Object.entries(wallData)) {
          if (!checkIfWallBlocks(wall, wallKey, windowOverlays, isHex)) continue;

          const worldSegment = wallWorldSegment(wallKey, wall, gridType, gridSystem, gridSize, gridOffsetX, gridOffsetY);
          if (!worldSegment) continue;

          const worldX1 = worldSegment.x1;
          const worldY1 = worldSegment.y1;
          const worldX2 = worldSegment.x2;
          const worldY2 = worldSegment.y2;

          // Bounding box rejection filter
          if (
            Math.max(worldX1, worldX2) < minX ||
            Math.min(worldX1, worldX2) > maxX ||
            Math.max(worldY1, worldY2) < minY ||
            Math.min(worldY1, worldY2) > maxY
          ) {
            continue;
          }

          // Avoid degenerate 0-length segments
          if (Math.hypot(worldX2 - worldX1, worldY2 - worldY1) < 0.001) continue;

          segments.push([[worldX1, worldY1], [worldX2, worldY2]]);
        }
      }
    }

    // 3. Extract vision-blocking environmental objects (boulders, trees, crates, pillars, walls)
    if (environmentalObjects && environmentalObjects.length > 0) {
      for (const obj of environmentalObjects) {
        if (!obj) continue;
        const blocksSight = obj.blocksLineOfSight !== undefined
          ? obj.blocksLineOfSight
          : (obj.type && !['torch_wall', 'torch_standing', 'candle', 'candelabra', 'potion_bottle_green', 'potion_bottle_brown', 'grate_closed', 'grate_open', 'spikes_floor', 'treasure_coins', 'gold_pile'].includes(obj.type));
        if (!blocksSight) continue;

        const objX = obj.worldX !== undefined ? obj.worldX : (obj.gridX * gridSize + gridSize / 2 + gridOffsetX);
        const objY = obj.worldY !== undefined ? obj.worldY : (obj.gridY * gridSize + gridSize / 2 + gridOffsetY);

        // Bounding box filter
        if (Math.hypot(objX - originX, objY - originY) > searchRadius + gridSize) continue;

        const objScale = obj.scale || 1;
        const objW = (obj.width || 1) * gridSize * objScale;
        const objH = (obj.height || 1) * gridSize * objScale;

        // Inset slightly by 15% so a token standing directly beside the object isn't occluded by its own side
        const halfW = (objW / 2) * 0.85;
        const halfH = (objH / 2) * 0.85;
        const rotRad = ((obj.rotation || 0) * Math.PI) / 180;
        const cos = Math.cos(rotRad);
        const sin = Math.sin(rotRad);

        const p1 = [objX + (-halfW) * cos - (-halfH) * sin, objY + (-halfW) * sin + (-halfH) * cos];
        const p2 = [objX + (halfW) * cos - (-halfH) * sin, objY + (halfW) * sin + (-halfH) * cos];
        const p3 = [objX + (halfW) * cos - (halfH) * sin, objY + (halfW) * sin + (halfH) * cos];
        const p4 = [objX + (-halfW) * cos - (halfH) * sin, objY + (-halfW) * sin + (halfH) * cos];

        segments.push([p1, p2], [p2, p3], [p3, p4], [p4, p1]);
      }
    }

    // Safety: ensure origin is not directly touching a wall vertex or segment
    let safeOriginX = originX;
    let safeOriginY = originY;
    for (const seg of segments) {
      const d1 = Math.hypot(seg[0][0] - safeOriginX, seg[0][1] - safeOriginY);
      const d2 = Math.hypot(seg[1][0] - safeOriginX, seg[1][1] - safeOriginY);
      if (d1 < 0.01 || d2 < 0.01) {
        safeOriginX += 0.05;
        safeOriginY += 0.05;
        break;
      }
    }

    // Break intersections between walls
    const cleanSegments = breakPolygonIntersections(segments);
    const computedPoly = computeVisibilityPolygon([safeOriginX, safeOriginY], cleanSegments);

    if (Array.isArray(computedPoly) && computedPoly.length >= 3) {
      let result = computedPoly.map(([x, y]) => ({ x, y }));

      // If limited FOV cone is active (< 360 degrees)
      if (fovAngle < 360) {
        let fAngle = facingAngle;
        if (fAngle === null || fAngle === undefined) {
          fAngle = -Math.PI / 2;
        }
        const halfFov = (fovAngle * Math.PI / 180) / 2;

        if (fovAngle < 180) {
          // EXACT CONE: clip the full visibility polygon by the two cone
          // boundary half-planes. The old vertex-filter approach dropped
          // polygon vertices outside the cone, which cut the far arc
          // chord-style (up to ~11° narrower, jagged edges) and lost wall
          // geometry at the cone sides.
          const clipByBoundary = (poly, boundaryAngle) => {
            const bx = Math.cos(boundaryAngle);
            const by = Math.sin(boundaryAngle);
            const cx = Math.cos(fAngle);
            const cy = Math.sin(fAngle);
            const keepSign = (bx * cy - by * cx) >= 0 ? 1 : -1;
            const eps = 1e-9;
            const crossVal = (p) => (bx * (p.y - originY) - by * (p.x - originX)) * keepSign;
            const out = [];
            const n = poly.length;
            for (let i = 0; i < n; i++) {
              const cur = poly[i];
              const nxt = poly[(i + 1) % n];
              const curIn = crossVal(cur) >= -eps;
              const nxtIn = crossVal(nxt) >= -eps;
              if (curIn) out.push(cur);
              if (curIn !== nxtIn) {
                const c0 = crossVal(cur);
                const c1 = crossVal(nxt);
                const t = c0 / (c0 - c1);
                out.push({ x: cur.x + t * (nxt.x - cur.x), y: cur.y + t * (nxt.y - cur.y) });
              }
            }
            return out;
          };

          const clipped = clipByBoundary(clipByBoundary(result, fAngle - halfFov), fAngle + halfFov);
          if (clipped.length >= 3) {
            result = clipped;
          } else {
            const filtered = [];
            for (const pt of result) {
              const angleToTarget = Math.atan2(pt.y - originY, pt.x - originX);
              let diff = angleToTarget - fAngle;
              while (diff > Math.PI) diff -= 2 * Math.PI;
              while (diff < -Math.PI) diff += 2 * Math.PI;
              if (Math.abs(diff) <= halfFov) {
                filtered.push(pt);
              }
            }
            if (filtered.length >= 2) {
              result = [{ x: originX, y: originY }, ...filtered];
            }
          }
        } else {
          const filtered = [];
          for (const pt of result) {
            const angleToTarget = Math.atan2(pt.y - originY, pt.x - originX);
            let diff = angleToTarget - fAngle;
            while (diff > Math.PI) diff -= 2 * Math.PI;
            while (diff < -Math.PI) diff += 2 * Math.PI;
            if (Math.abs(diff) <= halfFov) {
              filtered.push(pt);
            }
          }
          if (filtered.length >= 2) {
            result = [{ x: originX, y: originY }, ...filtered];
          }
        }
      }

      return result;
    }
  } catch (err) {
    console.warn('[VisibilityCalculations] VisibilityPolygon compute error, falling back to raymarcher:', err);
  }

  // Graceful fallback to legacy raymarching
  return fallbackRaymarchVisibility(originX, originY, visionRange, wallData, gridSize, gridOffsetX, gridOffsetY, fovAngle, facingAngle, windowOverlays, gridType, gridSystem);
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

  // If no facing angle provided, use the same default as the visibility
  // polygon (cone pointing up) so tiles and polygon agree in limited-FOV mode.
  // Returning true here previously made the tile set a FULL circle while the
  // rendered polygon was a cone — tokens/afterimages outside the cone stayed
  // "visible" to the tracker even though the fog showed a wedge.
  if (facingAngle === null || facingAngle === undefined) {
    facingAngle = -Math.PI / 2;
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
export function calculateVisibleTiles(tokenX, tokenY, visionRange, visionType = 'normal', wallData = {}, lightSources = {}, fovAngle = 360, facingAngle = null, gridType = 'square', gridSystem = null, windowOverlays = {}, environmentalObjects = []) {
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
        const hasLOS = hasLineOfSight(tokenQ, tokenR, q, r, wallData, gridType, windowOverlays, gridSystem, environmentalObjects);
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
        const hasLOS = hasLineOfSight(tokenTileX, tokenTileY, targetX, targetY, wallData, gridType, windowOverlays, gridSystem, environmentalObjects);
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
 * @param {Object} windowOverlays - Window overlay data (square grids)
 * @param {Object} gridSystem - Grid system instance (required for hex)
 * @param {Array} environmentalObjects - Environmental objects that can block sight
 * @returns {boolean} True if line of sight exists
 */
export function hasLineOfSight(x1, y1, x2, y2, wallData, gridType = 'square', windowOverlays = {}, gridSystem = null, environmentalObjects = []) {
  if ((!wallData || Object.keys(wallData).length === 0) && (!environmentalObjects || environmentalObjects.length === 0)) {
    // No walls or objects to check - line of sight is clear
    return true;
  }

  if (gridType === 'hex' && gridSystem) {
    return hexHasLineOfSight(x1, y1, x2, y2, wallData, gridSystem, windowOverlays);
  }

  const linePoints = getLineOfSight(x1, y1, x2, y2);

  // Check each step along the line for wall obstructions
  for (let i = 0; i < linePoints.length - 1; i++) {
    const current = linePoints[i];
    const next = linePoints[i + 1];

    // Check if a wall blocks movement between these two adjacent tiles
    // Walls can be stored on edges between tiles, so we need to check multiple potential wall keys
    if (wallData && Object.keys(wallData).length > 0 && isWallBlocking(current.x, current.y, next.x, next.y, wallData, windowOverlays)) {
      // Wall detected blocking line of sight
      return false;
    }

    // Check if intermediate tile (excluding start and target tiles) is blocked by an environmental object
    if (i > 0 && environmentalObjects && environmentalObjects.length > 0) {
      const isBlockedByObj = environmentalObjects.some(obj => {
        if (!obj) return false;
        const blocksSight = obj.blocksLineOfSight !== undefined
          ? obj.blocksLineOfSight
          : (obj.type && !['torch_wall', 'torch_standing', 'candle', 'candelabra', 'potion_bottle_green', 'potion_bottle_brown', 'grate_closed', 'grate_open', 'spikes_floor', 'treasure_coins', 'gold_pile'].includes(obj.type));
        if (!blocksSight) return false;

        const ogx = obj.gridX !== undefined ? obj.gridX : Math.floor(obj.worldX / 50);
        const ogy = obj.gridY !== undefined ? obj.gridY : Math.floor(obj.worldY / 50);
        return ogx === current.x && ogy === current.y;
      });
      if (isBlockedByObj) return false;
    }
  }

  return true;
}

/**
 * Hex line of sight: cast a world-space segment between the two hex centers and
 * test it against every blocking wall segment. Hex walls are stored as free-form
 * corner-to-corner chords (hexEndpoints) or legacy cell-pair edge keys, both of
 * which resolve to world segments, so chords that cross several cells block
 * correctly. Center-to-center is the standard hex LOS model.
 */
function hexHasLineOfSight(q1, r1, q2, r2, wallData, gridSystem, windowOverlays) {
  const start = gridSystem.hexToWorld(q1, r1);
  const end = gridSystem.hexToWorld(q2, r2);
  const state = typeof gridSystem.getGridState === 'function' ? gridSystem.getGridState() : {};
  const gridSize = state.gridSize || 50;
  const gridOffsetX = state.gridOffsetX || 0;
  const gridOffsetY = state.gridOffsetY || 0;

  const index = getOrBuildWallSpatialIndex(wallData, gridSize, gridOffsetX, gridOffsetY, 'hex', gridSystem);
  const candidates = index.searchBoundingBox(
    Math.min(start.x, end.x),
    Math.min(start.y, end.y),
    Math.max(start.x, end.x),
    Math.max(start.y, end.y)
  );

  for (let i = 0; i < candidates.length; i++) {
    const item = candidates[i];
    if (!checkIfWallBlocks(item.wall, item.wallKey, windowOverlays, true)) continue;
    const [wx1, wy1, wx2, wy2] = item.worldCoords;
    if (segmentsIntersect(start.x, start.y, end.x, end.y, wx1, wy1, wx2, wy2)) {
      return false;
    }
  }

  return true;
}

/**
 * Collect the sub-segments of blocking walls that the viewer can actually see.
 * The 2D visibility polygon only covers the ground plane, so in 2.5D the wall
 * prisms project above it and would stay fogged even while in view. Each run is
 * a wall slice whose base is inside the vision polygon; callers extrude it to a
 * screen-space silhouette and union it into the fog mask cut.
 *
 * Wall bases lie exactly on the polygon boundary, where point-in-polygon is
 * ambiguous, so each sample probes a point offset from the wall toward the
 * viewer.
 */
export function collectVisibleWallRuns({
  wallData,
  visibilityPolygon,
  origin,
  gridSystem,
  gridType = 'square',
  gridSize = 50,
  elevationData = null,
  windowOverlays = {},
  sampleStep = null,
  probeDistance = null
}) {
  const runs = [];
  if (!wallData || !gridSystem || !origin) return runs;
  if (!visibilityPolygon || visibilityPolygon.length < 3) return runs;

  const state = typeof gridSystem.getGridState === 'function' ? gridSystem.getGridState() : {};
  const gridSizeSafe = gridSize || state.gridSize || 50;
  const gridOffsetX = state.gridOffsetX || 0;
  const gridOffsetY = state.gridOffsetY || 0;
  const isHex = gridType === 'hex';

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of visibilityPolygon) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  let candidates = null;
  try {
    const index = getOrBuildWallSpatialIndex(wallData, gridSizeSafe, gridOffsetX, gridOffsetY, gridType, gridSystem);
    candidates = index.searchBoundingBox(minX, minY, maxX, maxY);
  } catch (err) {
    candidates = null;
  }
  if (!candidates) {
    candidates = Object.entries(wallData).map(([wallKey, wall]) => ({ wallKey, wall }));
  }

  const step = sampleStep || Math.max(4, gridSizeSafe * 0.2);
  const probe = probeDistance || Math.max(2, gridSizeSafe * 0.06);

  for (const item of candidates) {
    if (!checkIfWallBlocks(item.wall, item.wallKey, windowOverlays, isHex)) continue;

    const segment = wallWorldSegment(item.wallKey, item.wall, gridType, gridSystem, gridSizeSafe, gridOffsetX, gridOffsetY);
    if (!segment) continue;

    const dx = segment.x2 - segment.x1;
    const dy = segment.y2 - segment.y1;
    const length = Math.hypot(dx, dy);
    if (length < 1e-6) continue;
    const ux = dx / length;
    const uy = dy / length;

    const parsed = parseWallKey(item.wallKey);
    const wallRecord = item.wall && typeof item.wall === 'object' ? item.wall : {};
    const typeId = typeof item.wall === 'string' ? item.wall : item.wall?.type;
    const typeData = WALL_TYPES?.[typeId] || {};
    const heightWorld = getWallHeightWorld(wallRecord, typeData, gridSizeSafe);
    const base = parsed
      ? getWallBaseWorldZ({ parsed, wall: wallRecord, gridType, gridSystem, elevationData })
      : { z: 0 };
    const thickness = getWallThickness(gridSizeSafe);

    const steps = Math.max(1, Math.ceil(length / step));
    let runStartIndex = -1;

    const flush = (endIndex) => {
      const startPad = runStartIndex > 0 ? step * 0.5 : 0;
      const endPad = endIndex < steps ? step * 0.5 : 0;
      const startT = runStartIndex / steps;
      const endT = endIndex / steps;
      runs.push({
        start: {
          x: segment.x1 + dx * startT - ux * startPad,
          y: segment.y1 + dy * startT - uy * startPad
        },
        end: {
          x: segment.x1 + dx * endT + ux * endPad,
          y: segment.y1 + dy * endT + uy * endPad
        },
        baseZ: base.z,
        heightWorld,
        thickness,
        wallKey: item.wallKey
      });
      runStartIndex = -1;
    };

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = segment.x1 + dx * t;
      const py = segment.y1 + dy * t;
      const toOriginX = origin.x - px;
      const toOriginY = origin.y - py;
      const distToOrigin = Math.hypot(toOriginX, toOriginY);

      let testX = px;
      let testY = py;
      if (distToOrigin > 1e-6) {
        testX = px + (toOriginX / distToOrigin) * probe;
        testY = py + (toOriginY / distToOrigin) * probe;
      }

      if (isPointInPolygon(testX, testY, visibilityPolygon)) {
        if (runStartIndex < 0) runStartIndex = i;
      } else if (runStartIndex >= 0) {
        flush(i - 1);
      }
    }
    if (runStartIndex >= 0) flush(steps);
  }

  return runs;
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
 * Get bounding box of a polygon for fast rejection tests
 * @param {Array} polygon - Array of {x, y} points
 * @returns {{ minX, maxX, minY, maxY }} Bounding box
 */
export function getPolygonBBox(polygon) {
  if (!polygon || polygon.length < 3) return null;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < polygon.length; i++) {
    const px = polygon[i].x;
    const py = polygon[i].y;
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  }
  return { minX, maxX, minY, maxY };
}

/**
 * Check if a point is inside a polygon using ray casting algorithm
 * Includes bounding box pre-filter for performance
 * @param {number} x - Point x coordinate
 * @param {number} y - Point y coordinate
 * @param {Array} polygon - Array of {x, y} points forming the polygon
 * @returns {boolean} True if point is inside polygon
 */
export function isPointInPolygon(x, y, polygon) {
  if (!polygon || polygon.length < 3) return false;

  // PERFORMANCE: Bounding box pre-filter: reject points clearly outside
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < polygon.length; i++) {
    const px = polygon[i].x;
    const py = polygon[i].y;
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  }
  if (x < minX || x > maxX || y < minY || y > maxY) return false;

  // Ray casting algorithm
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
 * @param {string} mode - 'diameter' (range = full circle width) or 'radius' (range = distance from token)
 * @returns {number} Vision range in tiles (as radius)
 */
export function feetToTiles(feetRange, feetPerTile = 5, mode = 'diameter') {
  const divisor = mode === 'diameter' ? 2 * feetPerTile : feetPerTile;
  return Math.max(1, Math.ceil(feetRange / divisor));
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
    description: 'Can see in darkness regardless of lighting'
  },
  blindsight: {
    name: 'Blindsight',
    ignoresWalls: true,
    ignoresLighting: true,
    description: 'Can sense surroundings regardless of walls or lighting'
  }
};

export function getDefaultVisionRange(mode = 'diameter') {
  return mode === 'diameter' ? 3 : 6;
}
