/**
 * ElevationUtils - verticality math for the 2.5D tactical grid.
 *
 * Elevation model:
 *  - `elevationData["x,y"]` (square) or `["q,r"]` (hex) holds an integer level.
 *  - 1 level = 5 ft. 0 = ground, negative = pits/sunken terrain.
 *  - `rampData["x,y"] = { dir: 'n'|'e'|'s'|'w', type: 'ramp'|'stairs' }` marks
 *    a tile that connects to a neighbor one step in `dir`.
 *
 * Movement rule (locked design): |delta| <= 1 is a free step; larger deltas are
 * blocked unless a ramp/stairs tile connects the two tiles.
 *
 * Vision/shadow rule: eye height = ground level * 5ft + creature eye height.
 * Terrain occludes a sight line when a tile's top (elevation, optionally plus a
 * structure height) rises above the straight line between both eye heights.
 */

export const FEET_PER_ELEVATION_LEVEL = 5;
export const DEFAULT_EYE_HEIGHT_FEET = 5;
export const MIN_ELEVATION_LEVEL = -10;
export const MAX_ELEVATION_LEVEL = 20;

const DIRECTION_DELTAS = {
  n: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  e: { x: 1, y: 0 },
  w: { x: -1, y: 0 }
};

export function tileKey(x, y) {
  return `${x},${y}`;
}

export function clampElevationLevel(level) {
  const numeric = Number(level);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(MIN_ELEVATION_LEVEL, Math.min(MAX_ELEVATION_LEVEL, Math.round(numeric)));
}

/**
 * Raw elevation level for a tile (0 when unset).
 * Accepts plain numbers or `{ level }` objects for forward compatibility.
 */
export function getTileElevation(elevationData, x, y) {
  if (!elevationData) return 0;
  const raw = elevationData[tileKey(x, y)];
  if (raw === undefined || raw === null) return 0;
  if (typeof raw === 'object') {
    return Number.isFinite(raw.level) ? raw.level : 0;
  }
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function getElevationAtWorld(elevationData, gridSystem, worldX, worldY) {
  if (!elevationData || !gridSystem) return 0;
  const grid = gridSystem.worldToGrid(worldX, worldY);
  return getTileElevation(elevationData, grid.x, grid.y);
}

/**
 * Elevation level (possibly fractional) at a world position, ramp-aware.
 *
 * On a normal tile this is the tile's integer level. On a ramp/stairs tile the
 * level interpolates linearly along the ramp axis: the tile's own level at the
 * far edge (opposite `dir`) up/down to the connected neighbour's level at the
 * near edge (toward `dir`) — matching RampGeometry's wedge. Props, lights and
 * tokens use this to sit on the visible slope instead of the flat tile level.
 */
export function getElevationLevelAtWorld({ elevationData, rampData, gridSystem, worldX, worldY }) {
  if (!gridSystem) return 0;

  const tile = gridSystem.worldToGrid(worldX, worldY);
  const level = getTileElevation(elevationData, tile.x, tile.y);
  const ramp = getRampAt(rampData, tile.x, tile.y);
  if (!ramp) return level;

  // Auto-aligned: the slope follows whichever neighbour currently differs most.
  const dir = resolveRampDirection({ elevationData, rampData, x: tile.x, y: tile.y });
  const delta = DIRECTION_DELTAS[dir];
  if (!delta) return level;

  const targetLevel = getTileElevation(elevationData, tile.x + delta.x, tile.y + delta.y);
  if (targetLevel === level) return level;

  const tileCenter = gridSystem.gridToWorld(tile.x, tile.y);
  const targetCenter = gridSystem.gridToWorld(tile.x + delta.x, tile.y + delta.y);
  const axisX = targetCenter.x - tileCenter.x;
  const axisY = targetCenter.y - tileCenter.y;
  const axisLenSq = axisX * axisX + axisY * axisY;
  if (axisLenSq <= 0) return level;

  const projection = ((worldX - tileCenter.x) * axisX + (worldY - tileCenter.y) * axisY) / axisLenSq;
  const t = Math.max(0, Math.min(1, projection + 0.5));
  return level + (targetLevel - level) * t;
}

/** Ground height in world units (same units as gridSize/world px). */
export function levelToWorldHeight(level, gridSize = 50) {
  return (level || 0) * gridSize;
}

/** Feet to world units using the map's feet-per-tile scale. */
export function feetToWorldHeight(feet, gridSize = 50, feetPerTile = 5) {
  const safeFeetPerTile = feetPerTile > 0 ? feetPerTile : 5;
  return (feet / safeFeetPerTile) * gridSize;
}

export function levelToFeet(level) {
  return (level || 0) * FEET_PER_ELEVATION_LEVEL;
}

export function feetToLevel(feet) {
  return (feet || 0) / FEET_PER_ELEVATION_LEVEL;
}

/** Eye height in feet for a creature standing on `groundLevel`. */
export function getEyeHeightFeet(groundLevel, eyeHeightFeet = DEFAULT_EYE_HEIGHT_FEET) {
  return levelToFeet(groundLevel) + eyeHeightFeet;
}

export function getRampAt(rampData, x, y) {
  if (!rampData) return null;
  const ramp = rampData[tileKey(x, y)];
  if (!ramp) return null;
  if (typeof ramp === 'string') return { dir: ramp, type: 'ramp' };
  return ramp;
}

/**
 * Auto-align a ramp/stairs tile with the terrain around it.
 *
 * Ramps carry no required direction: they connect toward the adjacent neighbour
 * that needs them most — the largest absolute level difference, preferring the
 * higher (ascending) side on a tie. Returns the stored dir as a fallback for
 * legacy data or callers without elevation data, and null when nothing differs
 * (flat ramp).
 */
export function resolveRampDirection({ elevationData, rampData, x, y }) {
  const ramp = getRampAt(rampData, x, y);
  if (!ramp) return null;
  if (!elevationData) return ramp.dir || null;

  const selfLevel = getTileElevation(elevationData, x, y);
  let bestDir = null;
  let bestScore = 0;
  let bestDiff = 0;

  for (const dir of Object.keys(DIRECTION_DELTAS)) {
    const delta = DIRECTION_DELTAS[dir];
    const diff = getTileElevation(elevationData, x + delta.x, y + delta.y) - selfLevel;
    const score = Math.abs(diff);
    if (score === 0) continue;
    if (score > bestScore || (score === bestScore && diff > bestDiff)) {
      bestDir = dir;
      bestScore = score;
      bestDiff = diff;
    }
  }

  return bestDir || ramp.dir || null;
}

/**
 * True when a ramp/stairs tile on either end connects to the other tile.
 *
 * With elevation data, auto-aligned ramps bridge any big step (|delta| > 1)
 * adjacent to them — the rendered slope points at the steepest one, but the
 * tile is walkable from every side it can actually serve. Without elevation
 * data, legacy stored directions are used.
 */
export function rampAllowsStep(rampData, from, to, elevationData = null) {
  if (!rampData || !from || !to) return false;

  const rampConnects = (rampTile, target) => {
    const ramp = getRampAt(rampData, rampTile.x, rampTile.y);
    if (!ramp) return false;
    if (elevationData) {
      const fromLevel = getTileElevation(elevationData, rampTile.x, rampTile.y);
      const toLevel = getTileElevation(elevationData, target.x, target.y);
      return Math.abs(toLevel - fromLevel) > 1;
    }
    const delta = DIRECTION_DELTAS[ramp.dir];
    if (!delta) return false;
    return rampTile.x + delta.x === target.x && rampTile.y + delta.y === target.y;
  };

  return rampConnects(from, to) || rampConnects(to, from);
}

/**
 * Movement rule between two adjacent tiles.
 * @returns {{ allowed: boolean, cost: number, blockedReason: string|null, fromLevel: number, toLevel: number, delta: number }}
 */
export function canStepElevation({ elevationData, rampData, from, to }) {
  const fromLevel = getTileElevation(elevationData, from.x, from.y);
  const toLevel = getTileElevation(elevationData, to.x, to.y);
  const delta = toLevel - fromLevel;

  if (Math.abs(delta) <= 1) {
    return { allowed: true, cost: 1, blockedReason: null, fromLevel, toLevel, delta };
  }

  if (rampAllowsStep(rampData, from, to, elevationData)) {
    return { allowed: true, cost: 1, blockedReason: null, fromLevel, toLevel, delta };
  }

  return { allowed: false, cost: Infinity, blockedReason: 'elevation', fromLevel, toLevel, delta };
}

/**
 * Terrain occlusion test for a sight line in world coordinates.
 *
 * Samples the straight line between the two eye points. For every grid tile the
 * line passes through (endpoint tiles excluded), the tile top is computed from
 * `elevationData` (plus optional `structureHeights`, in feet) and compared to
 * the interpolated line height. A tile above the line occludes.
 *
 * @param {Object} params
 * @param {{x:number,y:number}} params.fromWorld
 * @param {{x:number,y:number}} params.toWorld
 * @param {number} params.fromEyeFeet Eye height (ft) at the viewer's position
 * @param {number} params.toEyeFeet Eye height (ft) at the target's position
 * @param {Object} params.elevationData
 * @param {Object} params.gridSystem worldToGrid(worldX, worldY) -> {x, y}
 * @param {Object} [params.structureHeights] `"x,y"` -> additional height in FEET (walls etc.)
 * @param {number} [params.toleranceFeet] ignore differences below this (default 0.25ft)
 * @returns {{ occluded: boolean, tile: {x:number,y:number}|null, topFeet: number, lineFeet: number }}
 */
export function isSegmentOccludedByTerrain({
  fromWorld,
  toWorld,
  fromEyeFeet,
  toEyeFeet,
  elevationData,
  gridSystem,
  structureHeights = null,
  toleranceFeet = 0.25
}) {
  const result = { occluded: false, tile: null, topFeet: 0, lineFeet: 0 };

  if (!elevationData || !gridSystem || !fromWorld || !toWorld) return result;

  const fromTile = gridSystem.worldToGrid(fromWorld.x, fromWorld.y);
  const toTile = gridSystem.worldToGrid(toWorld.x, toWorld.y);

  const tileSpan = Math.max(
    Math.abs(toTile.x - fromTile.x),
    Math.abs(toTile.y - fromTile.y)
  );
  if (tileSpan < 1) return result;

  const samples = Math.max(4, Math.ceil(tileSpan * 3));

  for (let i = 1; i < samples; i++) {
    const t = i / samples;
    const worldX = fromWorld.x + (toWorld.x - fromWorld.x) * t;
    const worldY = fromWorld.y + (toWorld.y - fromWorld.y) * t;

    const tile = gridSystem.worldToGrid(worldX, worldY);

    // Skip tiles we're standing on / targeting
    if ((tile.x === fromTile.x && tile.y === fromTile.y) ||
        (tile.x === toTile.x && tile.y === toTile.y)) {
      continue;
    }

    const level = getTileElevation(elevationData, tile.x, tile.y);
    const structureFeet = structureHeights ? (structureHeights[tileKey(tile.x, tile.y)] || 0) : 0;
    const topFeet = levelToFeet(level) + structureFeet;
    const lineFeet = fromEyeFeet + (toEyeFeet - fromEyeFeet) * t;

    if (topFeet > lineFeet + toleranceFeet) {
      result.occluded = true;
      result.tile = { x: tile.x, y: tile.y };
      result.topFeet = topFeet;
      result.lineFeet = lineFeet;
      return result;
    }
  }

  return result;
}

/**
 * Filter visible tile keys by elevation-aware terrain occlusion.
 * Tiles whose center is hidden behind raised terrain, cliffs or pit rims are
 * removed even when the 2D raycast reached them. Returns an array of keys.
 */
export function filterVisibleTilesByElevation({
  tileKeys,
  fromWorld,
  fromGroundLevel = 0,
  eyeHeightFeet = DEFAULT_EYE_HEIGHT_FEET,
  elevationData,
  gridSystem,
  structureHeights = null
}) {
  if (!elevationData || !gridSystem || !tileKeys) return tileKeys;

  const fromEyeFeet = getEyeHeightFeet(fromGroundLevel, eyeHeightFeet);
  const kept = [];

  for (const key of tileKeys) {
    const [tileX, tileY] = String(key).split(',').map(Number);
    if (!Number.isFinite(tileX) || !Number.isFinite(tileY)) {
      kept.push(key);
      continue;
    }

    const targetWorld = gridSystem.gridToWorld(tileX, tileY);
    const targetLevel = getTileElevation(elevationData, tileX, tileY);
    const targetEyeFeet = getEyeHeightFeet(targetLevel, 1);

    const { occluded } = isSegmentOccludedByTerrain({
      fromWorld,
      toWorld: targetWorld,
      fromEyeFeet,
      toEyeFeet: targetEyeFeet,
      elevationData,
      gridSystem,
      structureHeights
    });

    if (!occluded) {
      kept.push(key);
    }
  }

  return kept;
}

/**
 * Screen point -> world point that resolves the ELEVATED plane under the cursor.
 *
 * A ground-first inverse projection would land BEHIND a raised area (the ray at
 * z=0 passes the hill and hits the ground behind it), making clicks/drags target
 * the wrong tile. Instead we test every candidate level: project the screen point
 * onto that height and keep the highest level that is self-consistent (the tile
 * under the candidate point actually has that level). That makes the cursor
 * resolve to the raised top it is visually over.
 */
export function screenToWorldElevated({
  screenX,
  screenY,
  gridSystem,
  elevationData,
  minLevel = -10,
  maxLevel = 20,
  viewportWidth,
  viewportHeight
}) {
  if (!gridSystem) return null;

  const resolvedViewportWidth = Number.isFinite(viewportWidth)
    ? viewportWidth
    : (typeof window !== 'undefined' ? window.innerWidth : 0);
  const resolvedViewportHeight = Number.isFinite(viewportHeight)
    ? viewportHeight
    : (typeof window !== 'undefined' ? window.innerHeight : 0);
  const { gridSize = 50 } = gridSystem.getGridState();

  const groundWorld = gridSystem.screenToWorld3D
    ? gridSystem.screenToWorld3D(screenX, screenY, 0, resolvedViewportWidth, resolvedViewportHeight)
    : gridSystem.screenToWorld(screenX, screenY, resolvedViewportWidth, resolvedViewportHeight);

  if (!elevationData || !gridSystem.screenToWorld3D) {
    return groundWorld;
  }

  let bestWorld = null;
  let bestLevel = -Infinity;

  for (let trialLevel = minLevel; trialLevel <= maxLevel; trialLevel++) {
    const candidate = gridSystem.screenToWorld3D(
      screenX,
      screenY,
      trialLevel * gridSize,
      resolvedViewportWidth,
      resolvedViewportHeight
    );
    const tile = gridSystem.worldToGrid(candidate.x, candidate.y);
    const tileLevel = getTileElevation(elevationData, tile.x, tile.y);
    if (tileLevel === trialLevel && trialLevel > bestLevel) {
      bestLevel = trialLevel;
      bestWorld = candidate;
    }
  }

  return bestWorld || groundWorld;
}
