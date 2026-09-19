import {
  parseWallKey,
  getWallWorldEndpoints,
  getWallThickness
} from '../../../utils/WallGeometry';
import { getTileElevation } from '../../../utils/ElevationUtils';
import { WALL_TYPES } from '../../../store/levelEditorStore';

// Click-distance (world units) within which a wall-mountable prop snaps to the
// nearest wall face. 0.6 tiles matches the old hand-written torch_wall rule.
export const WALL_MOUNT_MAX_DISTANCE_RATIO = 0.6;
// Extra world-space gap between the wall face and the prop origin so mounted
// models do not z-fight with the masonry.
export const WALL_MOUNT_SURFACE_GAP = 1;

const isMountedWall = (wall) => {
  if (!wall) return false;
  if (typeof wall === 'object' && wall.isWallDoor) return false;
  const typeId = typeof wall === 'string' ? wall : wall.type;
  const typeData = WALL_TYPES[typeId];
  return !(typeData && (typeData.interactive || typeData.isWindow));
};

const isFinitePoint = (p) => !!p && Number.isFinite(p.x) && Number.isFinite(p.y);

const resolveEndpoints = (parsed, gridSystem, gridType, wall, gridSize, gridOffsetX, gridOffsetY) => {
  if (gridSystem && typeof gridSystem.gridToWorldCorner === 'function') {
    const ends = getWallWorldEndpoints(parsed, gridSystem, gridType, wall);
    if (ends && isFinitePoint(ends.start) && isFinitePoint(ends.end)) return ends;
  }
  // Fallback only for axis-aligned keys; diagonals/hex chords need the grid system.
  if (parsed.x1 !== parsed.x2 && parsed.y1 !== parsed.y2) return null;
  return {
    start: { x: parsed.x1 * gridSize + gridOffsetX, y: parsed.y1 * gridSize + gridOffsetY },
    end: { x: parsed.x2 * gridSize + gridOffsetX, y: parsed.y2 * gridSize + gridOffsetY }
  };
};

/**
 * Find the nearest mountable wall face for a world-space placement point.
 *
 * The returned mount sits on the wall face on the side the cursor is on, and
 * `rotation` aims the fixture outward. KayKit wall fixtures mount at their
 * origin and protrude toward VTT +Y (south) at yaw 0, so the yaw that points
 * the fixture along the outward normal n is atan2(-n.x, n.y).
 *
 * @returns {object|null} { wallKey, wallType, wallSide, wallElevation,
 *   pointX, pointY, mountX, mountY, rotation, distance }
 */
export function findWallMount({
  worldX,
  worldY,
  wallData = {},
  gridSize = 50,
  gridOffsetX = 0,
  gridOffsetY = 0,
  elevationData = {},
  gridSystem = null,
  maxDistance = null
} = {}) {
  if (!Number.isFinite(worldX) || !Number.isFinite(worldY)) return null;

  const gridType = gridSystem && typeof gridSystem.getGridState === 'function'
    ? gridSystem.getGridState().gridType || 'square'
    : 'square';
  const limit = Number.isFinite(maxDistance) ? maxDistance : gridSize * WALL_MOUNT_MAX_DISTANCE_RATIO;
  const thickness = getWallThickness(gridSize);

  let best = null;

  for (const [key, wall] of Object.entries(wallData || {})) {
    if (!isMountedWall(wall)) continue;
    const parsed = parseWallKey(key);
    if (!parsed) continue;

    const ends = resolveEndpoints(
      parsed, gridSystem, gridType, wall, gridSize, gridOffsetX, gridOffsetY
    );
    if (!ends || !ends.start || !ends.end) continue;
    const { start, end } = ends;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq < 1e-6) continue;

    const t = Math.max(0, Math.min(1, ((worldX - start.x) * dx + (worldY - start.y) * dy) / lengthSq));
    const pointX = start.x + dx * t;
    const pointY = start.y + dy * t;
    const dist = Math.hypot(worldX - pointX, worldY - pointY);
    if (dist > limit) continue;
    if (best && dist >= best.distance) continue;

    const length = Math.sqrt(lengthSq);
    const ux = dx / length;
    const uy = dy / length;
    // Left-hand normal of the run; the opposite normal is its negation.
    const n1x = uy;
    const n1y = -ux;
    const relX = worldX - pointX;
    const relY = worldY - pointY;
    // Near the segment ends the perpendicular offset is tiny, so the side is
    // decided by which side of the infinite wall line the cursor is on.
    const cross = ux * relY - uy * relX;
    const side = Math.abs(cross) < 1e-6 ? 1 : Math.sign(cross);
    const nx = side >= 0 ? -n1x : n1x;
    const ny = side >= 0 ? -n1y : n1y;

    const mountX = pointX + nx * (thickness / 2 + WALL_MOUNT_SURFACE_GAP);
    const mountY = pointY + ny * (thickness / 2 + WALL_MOUNT_SURFACE_GAP);

    let rotation = (Math.atan2(-nx, ny) * 180) / Math.PI;
    rotation = ((rotation % 360) + 360) % 360;

    let wallElevation = wall && typeof wall === 'object' ? wall.elevation : undefined;
    if (!Number.isFinite(wallElevation)) {
      const midGridX = Math.floor((parsed.x1 + parsed.x2) / 2);
      const midGridY = Math.floor((parsed.y1 + parsed.y2) / 2);
      wallElevation = getTileElevation(elevationData, midGridX, midGridY) || 0;
    }

    best = {
      wallKey: key,
      wallType: typeof wall === 'string' ? wall : wall.type,
      wallSide: side,
      wallElevation,
      pointX,
      pointY,
      mountX,
      mountY,
      rotation: Math.round(rotation),
      distance: dist
    };
  }

  return best;
}

/**
 * Resolve the full placement patch for a wall-mountable object definition.
 * Returns null when the type does not mount on walls or no wall is in range.
 */
export function resolveWallMountPlacement({
  objectDef,
  worldX,
  worldY,
  wallData,
  gridSize,
  gridOffsetX,
  gridOffsetY,
  elevationData,
  gridSystem,
  maxDistance
} = {}) {
  if (!objectDef || !objectDef.wallMountable) return null;

  const mount = findWallMount({
    worldX,
    worldY,
    wallData,
    gridSize,
    gridOffsetX,
    gridOffsetY,
    elevationData,
    gridSystem,
    maxDistance
  });
  if (!mount) return null;

  return {
    ...mount,
    elevation: mount.wallElevation + (objectDef.wallMountElevation ?? 1.2)
  };
}

/**
 * Patch for a wall-mountable object being dragged to a new world position.
 *
 * - Near a wall: snaps to the face and re-aims the fixture.
 * - Away from any wall: detaches (keeps the current height so the prop simply
 *   floats where the GM dropped it instead of following a stale wall).
 *
 * Returns null when the object is not wall-mountable or is stacked on another
 * object (parent attachments own its transform).
 */
export function resolveWallMountDragPatch({
  objectDef,
  object,
  worldX,
  worldY,
  wallData,
  gridSize,
  gridOffsetX,
  gridOffsetY,
  elevationData,
  gridSystem
} = {}) {
  if (!objectDef || !objectDef.wallMountable || !object) return null;
  if (object.parentObjectId) return null;

  const mount = findWallMount({
    worldX,
    worldY,
    wallData,
    gridSize,
    gridOffsetX,
    gridOffsetY,
    elevationData,
    gridSystem
  });

  if (!mount) {
    if (!object.wallAttached) return null;
    return {
      wallAttached: false,
      wallKey: undefined,
      wallSide: undefined,
      wallElevation: undefined
    };
  }

  return {
    worldX: mount.mountX,
    worldY: mount.mountY,
    rotation: mount.rotation,
    elevation: mount.wallElevation + (objectDef.wallMountElevation ?? 1.2),
    wallAttached: true,
    wallKey: mount.wallKey,
    wallSide: mount.wallSide,
    wallElevation: mount.wallElevation
  };
}
