import { getGridSystem } from './InfiniteGridSystem';
import { getPropWorldBoundsCorners } from '../components/level-editor/three/propWorldBounds';

const HANDLE_MARGIN = 28;
const MIN_HANDLE_OFFSET = 36;
export const LOCK_BADGE_RADIUS = 11;
const LOCK_BADGE_MARGIN = 12;

/**
 * Screen-space bounds used to draw selection chrome around an object.
 *
 * - 2D sprite objects: the grid footprint box, optionally rotated to match
 *   the snapped sprite rotation.
 * - 3D props: the projected AABB of the actual rendered model (via
 *   ThreeDPropManager), so the selection frame hugs the 3D figure instead of
 *   the much larger tile footprint.
 *
 * Returns { centerX, centerY, width, height, rotation, tight3D } or null.
 */
export function getObjectScreenBounds(obj, objectDef, screenPos, options = {}) {
  if (!obj || !objectDef) return null;
  const { gridSize = 50, effectiveZoom = 1, rotationRad = 0, viewport } = options;

  if (objectDef.is3D) {
    const corners = getPropWorldBoundsCorners(obj.id);
    if (corners && corners.length === 8) {
      try {
        const gridSystem = getGridSystem();
        const vp = viewport || gridSystem.getViewportDimensions();
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const corner of corners) {
          const p = gridSystem.worldToScreen3D(corner.x, corner.y, corner.z, vp.width, vp.height);
          if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        }
        if (Number.isFinite(minX) && Number.isFinite(minY) && maxX - minX > 0.5 && maxY - minY > 0.5) {
          return {
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2,
            width: maxX - minX,
            height: maxY - minY,
            rotation: 0,
            tight3D: true
          };
        }
      } catch (error) {
        // Fall through to the footprint box below.
      }
    }
  }

  const tileSize = gridSize * effectiveZoom;
  const scale = obj.scale || 1;
  return {
    centerX: screenPos.x,
    centerY: screenPos.y,
    width: (objectDef.size?.width ?? 1) * tileSize * scale,
    height: (objectDef.size?.height ?? 1) * tileSize * scale,
    rotation: rotationRad,
    tight3D: false
  };
}

/**
 * Delete/rotate handle placement in screen space, derived from the same bounds
 * used to draw the chrome. `*Offset` values are local to the (rotated) object
 * frame for canvas drawing; `*Position` values are absolute for hit-testing.
 */
export function getObjectSelectionHandles(bounds) {
  const { centerX, centerY, width, height, rotation = 0 } = bounds;
  const rotOffset = Math.max(height / 2 + HANDLE_MARGIN, MIN_HANDLE_OFFSET);
  const delOffset = Math.max(height / 2 + HANDLE_MARGIN, MIN_HANDLE_OFFSET);
  const delLocalX = width / 2 + 10;
  const delLocalY = -height / 2 - 10;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  return {
    delOffset,
    rotOffset,
    deleteOffset: { x: delLocalX, y: delLocalY },
    rotateOffset: { x: 0, y: -rotOffset },
    deletePosition: {
      x: centerX + delLocalX * cos - delLocalY * sin,
      y: centerY + delLocalX * sin + delLocalY * cos
    },
    rotatePosition: {
      x: centerX + rotOffset * sin,
      y: centerY - rotOffset * cos
    }
  };
}

/**
 * Screen position of the lock/unlock padlock badge. It sits on the top-left
 * corner in the object's local frame so it never collides with the delete
 * badge (top-right) or the rotate handle (top-center). Both the canvas drawing
 * and the click hit-test must use this helper to stay in sync.
 */
export function getObjectLockBadgePosition(bounds) {
  const { centerX, centerY, width, height, rotation = 0 } = bounds;
  const localX = -width / 2 - LOCK_BADGE_MARGIN;
  const localY = -height / 2 - LOCK_BADGE_MARGIN;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  return {
    x: centerX + localX * cos - localY * sin,
    y: centerY + localX * sin + localY * cos
  };
}
