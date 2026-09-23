/**
 * Elevation indicator helpers - pure geometry/labels for the in-world
 * elevation markers (level badges, cliff rims, ramp arrows) drawn by the
 * ElevationIndicators overlay.
 *
 * Elevation model: 1 level = 1 tile of height, see ElevationUtils.
 */

export const ORTHOGONAL_DIRECTIONS = ['n', 'e', 's', 'w'];

export const DIRECTION_STEPS = {
  n: { x: 0, y: -1 },
  e: { x: 1, y: 0 },
  s: { x: 0, y: 1 },
  w: { x: -1, y: 0 }
};

/**
 * Rim edges of a square tile: one entry per orthogonal neighbour whose level
 * differs. `lower` marks a drop on that side (the badge side); otherwise the
 * neighbour rises above this tile.
 */
export function getRimEdges(getLevel, x, y) {
  const level = getLevel(x, y);
  const edges = [];
  for (const dir of ORTHOGONAL_DIRECTIONS) {
    const step = DIRECTION_STEPS[dir];
    const neighborLevel = getLevel(x + step.x, y + step.y);
    if (neighborLevel !== level) {
      edges.push({ dir, level, neighborLevel, lower: neighborLevel < level });
    }
  }
  return edges;
}

/**
 * Badge label for a level: `+2` on plateaus, `-1` in pits, null at ground.
 * Plain signed numbers (no arrows): the 3D stair/slope geometry is the
 * direction cue, the badge only states the height.
 */
export function formatElevationBadge(level) {
  const numeric = Number(level) || 0;
  if (numeric === 0) return null;
  return `${numeric > 0 ? '+' : ''}${numeric}`;
}

/**
 * Whether a tile should show a level badge. True for rim tiles (any neighbour
 * differs) whose level is non-zero. Straight rim runs are thinned to one badge
 * every `spacing` tiles (west/north scan), so a long cliff shows a readable
 * marker every few cells instead of a carpet of pills.
 */
export function shouldBadgeTile(getLevel, x, y, spacing = 3) {
  const level = getLevel(x, y);
  if (level === 0) return false;
  if (getRimEdges(getLevel, x, y).length === 0) return false;

  const gap = Math.max(1, Math.floor(spacing) || 1);
  for (let step = 1; step < gap; step++) {
    if (getLevel(x - step, y) === level &&
        getRimEdges(getLevel, x - step, y).length > 0 &&
        shouldBadgeTile(getLevel, x - step, y, spacing)) {
      return false;
    }
    if (getLevel(x, y - step) === level &&
        getRimEdges(getLevel, x, y - step).length > 0 &&
        shouldBadgeTile(getLevel, x, y - step, spacing)) {
      return false;
    }
  }

  return true;
}

/** Unit-space edge segments for each square-tile side (0..1 of the tile). */
export const RIM_EDGE_SEGMENTS = {
  n: [[0, 0], [1, 0]],
  e: [[1, 0], [1, 1]],
  s: [[0, 1], [1, 1]],
  w: [[0, 0], [0, 1]]
};
