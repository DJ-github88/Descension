/**
 * Fog-of-war visibility helpers shared by the 3D world managers.
 *
 * Walls (and free-positioned props) are anchored exactly on tile boundaries,
 * so probing a single point with Math.floor() always resolves to the tile on
 * the +x/+y side regardless of which side the viewer is on. A frontier wall
 * whose far side is unexplored was therefore hidden entirely, and walls
 * probed on their far side dimmed incorrectly.
 *
 * These helpers probe multiple points on both sides of a surface and treat it
 * as visible/lit when ANY probe is explored/in active vision, mirroring the
 * both-side tile probes the 2.5D SVG wall layer (isWallDimmedByFov) already
 * uses.
 */

export const WALL_EXPLORED_OPACITY = 0.7;
export const PROP_EXPLORED_OPACITY = 0.45;

export function fogProbeOffset(gridSize = 50) {
  return Math.max(4, (gridSize || 50) * 0.3);
}

/**
 * Resolve a tile key for a world point. Prefers the grid system (hex-aware)
 * and falls back to the square-grid arithmetic used by visited-tile stores.
 */
export function createTileKeyResolver(gridSystem, gridSize = 50, gridOffsetX = 0, gridOffsetY = 0) {
  return (worldX, worldY) => {
    if (gridSystem && typeof gridSystem.worldToGrid === 'function') {
      const tile = gridSystem.worldToGrid(worldX, worldY);
      return `${tile.x},${tile.y}`;
    }
    return `${Math.floor((worldX - gridOffsetX) / gridSize)},${Math.floor((worldY - gridOffsetY) / gridSize)}`;
  };
}

/**
 * Probe points straddling a segment: near both ends and the middle, offset to
 * each side so at least one point lands in the tile the viewer actually
 * stands in.
 */
export function fogSamplesAlongSegment({ centerX, centerY, ux, uy, halfLength, offset }) {
  const nx = -uy;
  const ny = ux;
  const along = Math.min(halfLength, offset);
  const points = [];
  for (const step of [-1, 0, 1]) {
    const px = centerX + ux * along * step;
    const py = centerY + uy * along * step;
    points.push({ x: px + nx * offset, y: py + ny * offset });
    points.push({ x: px - nx * offset, y: py - ny * offset });
  }
  return points;
}

/**
 * Probe points around a point anchor (junction vertices, prop anchors):
 * all four surrounding cells plus the anchor itself.
 */
export function fogSamplesAroundPoint(worldX, worldY, offset) {
  return [
    { x: worldX + offset, y: worldY + offset },
    { x: worldX - offset, y: worldY + offset },
    { x: worldX + offset, y: worldY - offset },
    { x: worldX - offset, y: worldY - offset },
    { x: worldX, y: worldY }
  ];
}

export function resolveSampleFogVisibility(samples, {
  isFogActive,
  isPlayerPositionExplored,
  visibleAreaSet,
  tileKeyAt,
  dimmedOpacity = WALL_EXPLORED_OPACITY,
  activeVisionWhenUnset = true
}) {
  if (!isFogActive || !isPlayerPositionExplored) {
    return { isVisible: true, targetOpacity: 1, canCastShadow: true };
  }
  if (!Array.isArray(samples) || samples.length === 0) {
    return { isVisible: true, targetOpacity: 1, canCastShadow: true };
  }

  let explored = false;
  for (const sample of samples) {
    // Active vision wins outright: a tile the token currently sees must never
    // be hidden by a stale/ambiguous exploration lookup.
    const inActiveVision = visibleAreaSet
      ? visibleAreaSet.has(tileKeyAt(sample.x, sample.y))
      : activeVisionWhenUnset;
    if (inActiveVision) {
      return { isVisible: true, targetOpacity: 1, canCastShadow: true };
    }
    if (!explored) explored = !!isPlayerPositionExplored(sample.x, sample.y);
  }

  if (!explored) {
    return { isVisible: false, targetOpacity: 1, canCastShadow: false };
  }
  return {
    isVisible: true,
    targetOpacity: dimmedOpacity,
    canCastShadow: false
  };
}
