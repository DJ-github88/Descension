/**
 * RampGeometry - world-space geometry for ramp/stairs surface rendering.
 *
 * Elevation model (see ElevationUtils): `rampData["x,y"] = { dir, type }` marks
 * a tile whose surface connects to the neighbor one step in `dir`. The near
 * edge (the tile edge shared with that neighbor) sits at the neighbor's
 * elevation; the far edge sits at the ramp tile's own elevation.
 *
 * These helpers are renderer-agnostic: TerrainSystem projects the returned
 * world-space bands/edges with `gridSystem.worldToScreen3D`.
 */

export const RAMP_DIRECTION_DELTAS = Object.freeze({
  n: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  e: { x: 1, y: 0 },
  w: { x: -1, y: 0 }
});

export function getRampDirectionDelta(dir) {
  return RAMP_DIRECTION_DELTAS[dir] || RAMP_DIRECTION_DELTAS.e;
}

/**
 * World-space endpoints of a square ramp tile's near edge (shared with the
 * target neighbor, in the ramp direction) and far edge (opposite side).
 */
export function getSquareRampEdges({ worldX, worldY, gridSize, dir }) {
  const delta = getRampDirectionDelta(dir);

  if (delta.y === -1) {
    return {
      nearA: { x: worldX, y: worldY },
      nearB: { x: worldX + gridSize, y: worldY },
      farA: { x: worldX, y: worldY + gridSize },
      farB: { x: worldX + gridSize, y: worldY + gridSize }
    };
  }
  if (delta.y === 1) {
    return {
      nearA: { x: worldX, y: worldY + gridSize },
      nearB: { x: worldX + gridSize, y: worldY + gridSize },
      farA: { x: worldX, y: worldY },
      farB: { x: worldX + gridSize, y: worldY }
    };
  }
  if (delta.x === 1) {
    return {
      nearA: { x: worldX + gridSize, y: worldY },
      nearB: { x: worldX + gridSize, y: worldY + gridSize },
      farA: { x: worldX, y: worldY },
      farB: { x: worldX, y: worldY + gridSize }
    };
  }
  return {
    nearA: { x: worldX, y: worldY },
    nearB: { x: worldX, y: worldY + gridSize },
    farA: { x: worldX + gridSize, y: worldY },
    farB: { x: worldX + gridSize, y: worldY + gridSize }
  };
}

/** Stair tread count scaled to the height difference (2-8 steps). */
export function getRampStepCount(deltaZ, gridSize) {
  const span = Math.abs(deltaZ) / (gridSize > 0 ? gridSize : 50);
  const steps = Math.round(span * 2) || 3;
  return Math.max(2, Math.min(8, steps));
}

/**
 * Surface bands along the ramp axis (t = 0 at the far edge, 1 at the near edge).
 *
 * - `ramp`: one band whose far edge sits at `selfZ` and near edge at `targetZ`.
 * - `stairs`: N flat treads. Ascending treads step up from the far side so the
 *   last tread reaches `targetZ`; descending treads start at `selfZ` and step
 *   down, with the final drop happening at the near edge.
 *
 * @returns {Array<{t0:number,t1:number,farZ:number,nearZ:number}>}
 */
export function getRampBands({ selfZ, targetZ, type = 'ramp', steps = 4 }) {
  const deltaZ = (targetZ || 0) - (selfZ || 0);

  if (type !== 'stairs') {
    return [{ t0: 0, t1: 1, farZ: selfZ, nearZ: targetZ }];
  }

  const count = Math.max(1, Math.min(8, Math.round(steps) || 4));
  const bands = [];
  for (let k = 0; k < count; k++) {
    const treadZ = selfZ + deltaZ * ((k + (deltaZ >= 0 ? 1 : 0)) / count);
    bands.push({ t0: k / count, t1: (k + 1) / count, farZ: treadZ, nearZ: treadZ });
  }
  return bands;
}
