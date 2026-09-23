import {
  parseWallKey,
  getWallWorldEndpoints,
  getWallThickness
} from '../../../utils/WallGeometry';
import { getTileElevation } from '../../../utils/ElevationUtils';
import { WALL_TYPES } from '../../../store/levelEditorStore';

// Click-distance (world units) within which an object snaps to the
// nearest wall face. 1.2 tiles (60 units on 50px grid) ensures clicks on 3D wall faces
// or anywhere in the adjacent tile snap smoothly to the wall.
export const WALL_MOUNT_MAX_DISTANCE_RATIO = 1.2;
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
 * Find the nearest mountable wall face for a world-space or screen-space placement point.
 *
 * The returned mount sits on the wall face on the side the cursor is on, and
 * `rotation` aims the fixture outward. KayKit wall fixtures mount at their
 * origin and protrude toward VTT +Y (south) at yaw 0, so the yaw that points
 * the fixture along the outward normal n is atan2(-n.x, n.y).
 *
 * @returns {object|null} { wallKey, wallType, wallSide, wallElevation,
 *   pointX, pointY, mountX, mountY, worldX, worldY, rotation, distance }
 */
export function findWallMount({
  worldX,
  worldY,
  screenX = null,
  screenY = null,
  wallData = {},
  gridSize = 50,
  gridOffsetX = 0,
  gridOffsetY = 0,
  elevationData = {},
  gridSystem = null,
  maxDistance = null,
  objectDepth = 0
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

    let wallElevation = wall && typeof wall === 'object' ? wall.elevation : undefined;
    if (!Number.isFinite(wallElevation)) {
      const midGridX = Math.floor((parsed.x1 + parsed.x2) / 2);
      const midGridY = Math.floor((parsed.y1 + parsed.y2) / 2);
      wallElevation = getTileElevation(elevationData, midGridX, midGridY) || 0;
    }

    // Determine sampling coordinates: test 3D mid-height projection if screen coordinates are available
    let sampleX = worldX;
    let sampleY = worldY;

    if (
      Number.isFinite(screenX) &&
      Number.isFinite(screenY) &&
      gridSystem &&
      typeof gridSystem.screenToWorld3D === 'function'
    ) {
      try {
        const vp = typeof gridSystem.getViewportDimensions === 'function'
          ? gridSystem.getViewportDimensions()
          : { width: 1600, height: 1000 };
        // Mid-height of wall in worldZ units: elevation * 25 + 25 (half of 50-unit wall)
        const midWallZ = (wallElevation * gridSize) + (gridSize * 0.5);
        const p3d = gridSystem.screenToWorld3D(screenX, screenY, midWallZ, vp.width, vp.height);
        if (p3d && Number.isFinite(p3d.x) && Number.isFinite(p3d.y)) {
          const t3d = Math.max(0, Math.min(1, ((p3d.x - start.x) * dx + (p3d.y - start.y) * dy) / lengthSq));
          const dist3d = Math.hypot(p3d.x - (start.x + dx * t3d), p3d.y - (start.y + dy * t3d));
          const tGround = Math.max(0, Math.min(1, ((worldX - start.x) * dx + (worldY - start.y) * dy) / lengthSq));
          const distGround = Math.hypot(worldX - (start.x + dx * tGround), worldY - (start.y + dy * tGround));
          if (dist3d < distGround) {
            sampleX = p3d.x;
            sampleY = p3d.y;
          }
        }
      } catch (err) {
        // Fallback to ground coordinates
      }
    }

    const t = Math.max(0, Math.min(1, ((sampleX - start.x) * dx + (sampleY - start.y) * dy) / lengthSq));
    const pointX = start.x + dx * t;
    const pointY = start.y + dy * t;
    const dist = Math.hypot(sampleX - pointX, sampleY - pointY);
    if (dist > limit) continue;
    if (best && dist >= best.distance) continue;

    const length = Math.sqrt(lengthSq);
    const ux = dx / length;
    const uy = dy / length;
    // Left-hand normal of the run; the opposite normal is its negation.
    const n1x = uy;
    const n1y = -ux;
    const relX = sampleX - pointX;
    const relY = sampleY - pointY;
    // Near the segment ends the perpendicular offset is tiny, so the side is
    // decided by which side of the infinite wall line the cursor is on.
    const cross = ux * relY - uy * relX;
    const side = Math.abs(cross) < 1e-6 ? 1 : Math.sign(cross);
    const nx = side >= 0 ? -n1x : n1x;
    const ny = side >= 0 ? -n1y : n1y;

    const depthOffset = (Number.isFinite(objectDepth) && objectDepth > 0) ? objectDepth / 2 : 0;
    const mountX = pointX + nx * (thickness / 2 + depthOffset + WALL_MOUNT_SURFACE_GAP);
    const mountY = pointY + ny * (thickness / 2 + depthOffset + WALL_MOUNT_SURFACE_GAP);

    let rotation = (Math.atan2(-nx, ny) * 180) / Math.PI;
    rotation = ((rotation % 360) + 360) % 360;

    best = {
      wallKey: key,
      wallType: typeof wall === 'string' ? wall : wall.type,
      wallSide: side,
      wallElevation,
      pointX,
      pointY,
      mountX,
      mountY,
      worldX: mountX,
      worldY: mountY,
      rotation: Math.round(rotation),
      distance: dist
    };
  }

  return best;
}

/**
 * Resolve the full placement patch for a wall-mountable or wall-side object definition.
 * Returns null when the type does not mount on walls or no wall is in range.
 */
export function resolveWallMountPlacement({
  objectDef,
  worldX,
  worldY,
  screenX = null,
  screenY = null,
  wallData,
  gridSize,
  gridOffsetX,
  gridOffsetY,
  elevationData,
  gridSystem,
  maxDistance,
  snapToWall = true
} = {}) {
  if (!objectDef) return null;
  if (snapToWall === false) return null;
  const isWallMountable = !!objectDef.wallMountable;
  const isWallSideSnap = !!(objectDef.wallSideSnap && snapToWall);
  if (!isWallMountable && !isWallSideSnap) return null;

  const objDepth = isWallSideSnap && !isWallMountable
    ? (objectDef.size?.height || 1) * (gridSize || 50) * 0.5
    : 0;

  const mount = findWallMount({
    worldX,
    worldY,
    screenX,
    screenY,
    wallData,
    gridSize,
    gridOffsetX,
    gridOffsetY,
    elevationData,
    gridSystem,
    maxDistance,
    objectDepth: objDepth
  });
  if (!mount) return null;

  const mountElevation = isWallMountable
    ? (objectDef.wallMountElevation ?? 1.2)
    : 0;

  return {
    ...mount,
    elevation: mount.wallElevation + mountElevation,
    isWallFixture: isWallMountable
  };
}

/**
 * Patch for a wall-mountable or wall-side object being dragged to a new world position.
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
  screenX = null,
  screenY = null,
  wallData,
  gridSize,
  gridOffsetX,
  gridOffsetY,
  elevationData,
  gridSystem,
  snapToWall = true
} = {}) {
  if (!objectDef || !object || object.parentObjectId) return null;
  const isWallMountable = !!objectDef.wallMountable;
  const isWallSideSnap = !!(objectDef.wallSideSnap && snapToWall);
  if (!isWallMountable && !isWallSideSnap) return null;

  if (snapToWall === false) {
    if (!object.wallAttached) return null;
    return {
      wallAttached: false,
      wallKey: undefined,
      wallSide: undefined,
      wallElevation: undefined
    };
  }

  const objDepth = isWallSideSnap && !isWallMountable
    ? (objectDef.size?.height || 1) * (gridSize || 50) * 0.5
    : 0;

  const mount = findWallMount({
    worldX,
    worldY,
    screenX,
    screenY,
    wallData,
    gridSize,
    gridOffsetX,
    gridOffsetY,
    elevationData,
    gridSystem,
    objectDepth: objDepth
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

  const mountElevation = isWallMountable
    ? (objectDef.wallMountElevation ?? 1.2)
    : 0;

  return {
    worldX: mount.mountX,
    worldY: mount.mountY,
    rotation: mount.rotation,
    elevation: mount.wallElevation + mountElevation,
    wallAttached: true,
    wallKey: mount.wallKey,
    wallSide: mount.wallSide,
    wallElevation: mount.wallElevation,
    isWallFixture: isWallMountable
  };
}
