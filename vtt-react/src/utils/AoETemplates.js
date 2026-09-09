import polygonClipping from 'polygon-clipping';
import { isPointInPolygon } from './VisibilityCalculations';

/**
 * AoETemplates - Spell Area of Effect geometric generators and wall clipping
 * Uses polygon-clipping for boolean geometry and wall occlusion
 */

/**
 * Creates a cone polygon (standard 5e 53.13 degree or custom angle)
 * In 5e, cone width equals distance from origin
 * @param {number} originX - World x of caster
 * @param {number} originY - World y of caster
 * @param {number} length - Length of cone in pixels
 * @param {number} directionAngle - Center angle in radians
 * @param {number} arcAngleDegrees - Cone opening angle (default 53.13 for 5e)
 * @returns {Array<{x: number, y: number}>} Array of points forming the cone
 */
export function createConePolygon(originX, originY, length, directionAngle, arcAngleDegrees = 53.13) {
  const halfAngle = (arcAngleDegrees * Math.PI / 180) / 2;
  const numArcPoints = 16;
  const points = [{ x: originX, y: originY }];

  const startAngle = directionAngle - halfAngle;
  const endAngle = directionAngle + halfAngle;
  const step = (endAngle - startAngle) / numArcPoints;

  for (let i = 0; i <= numArcPoints; i++) {
    const a = startAngle + i * step;
    points.push({
      x: originX + length * Math.cos(a),
      y: originY + length * Math.sin(a)
    });
  }

  return points;
}

/**
 * Creates a circular / spherical AoE polygon
 * @param {number} centerX - Center x in world coordinates
 * @param {number} centerY - Center y in world coordinates
 * @param {number} radius - Radius in pixels
 * @param {number} numSegments - Segments approximating the circle (default 32)
 * @returns {Array<{x: number, y: number}>}
 */
export function createCirclePolygon(centerX, centerY, radius, numSegments = 32) {
  const points = [];
  for (let i = 0; i < numSegments; i++) {
    const a = (i * 2 * Math.PI) / numSegments;
    points.push({
      x: centerX + radius * Math.cos(a),
      y: centerY + radius * Math.sin(a)
    });
  }
  return points;
}

/**
 * Creates a line spell polygon (e.g. Lightning Bolt, 100ft long, 5ft wide)
 * @param {number} originX - Origin x
 * @param {number} originY - Origin y
 * @param {number} length - Length in pixels
 * @param {number} width - Width in pixels (typically 1 tile)
 * @param {number} directionAngle - Direction in radians
 * @returns {Array<{x: number, y: number}>}
 */
export function createLinePolygon(originX, originY, length, width, directionAngle) {
  const halfWidth = width / 2;
  const perpAngle = directionAngle + Math.PI / 2;

  const dxPerp = halfWidth * Math.cos(perpAngle);
  const dyPerp = halfWidth * Math.sin(perpAngle);

  const dxForward = length * Math.cos(directionAngle);
  const dyForward = length * Math.sin(directionAngle);

  return [
    { x: originX - dxPerp, y: originY - dyPerp },
    { x: originX + dxPerp, y: originY + dyPerp },
    { x: originX + dxForward + dxPerp, y: originY + dyForward + dyPerp },
    { x: originX + dxForward - dxPerp, y: originY + dyForward - dyPerp }
  ];
}

/**
 * Creates a box / cube AoE polygon
 * @param {number} originX - Corner or center x
 * @param {number} originY - Corner or center y
 * @param {number} size - Side length in pixels
 * @param {number} rotationAngle - Rotation in radians
 * @param {boolean} centered - Whether origin is center (true) or corner (false)
 * @returns {Array<{x: number, y: number}>}
 */
export function createCubePolygon(originX, originY, size, rotationAngle = 0, centered = true) {
  const half = centered ? size / 2 : 0;
  const baseCorners = centered
    ? [[-half, -half], [half, -half], [half, half], [-half, half]]
    : [[0, 0], [size, 0], [size, size], [0, size]];

  const cos = Math.cos(rotationAngle);
  const sin = Math.sin(rotationAngle);

  return baseCorners.map(([bx, by]) => ({
    x: originX + (bx * cos - by * sin),
    y: originY + (bx * sin + by * cos)
  }));
}

/**
 * Clips a spell AoE polygon against a room or visibility polygon
 * Prevents blast effects from penetrating solid dungeon walls
 * @param {Array<{x: number, y: number}>} spellPolygon - Spell template polygon
 * @param {Array<{x: number, y: number}>} visibilityPolygon - Visibility / wall polygon
 * @returns {Array<Array<{x: number, y: number}>>} Array of clipped polygon rings
 */
export function clipAoEAgainstWalls(spellPolygon, visibilityPolygon) {
  if (!spellPolygon || spellPolygon.length < 3) return [];
  if (!visibilityPolygon || visibilityPolygon.length < 3) return [spellPolygon];

  try {
    // Format for polygon-clipping: [[ [x, y], [x, y], ... ]]
    const sRing = spellPolygon.map(p => [p.x, p.y]);
    // Ensure ring is closed
    if (sRing[0][0] !== sRing[sRing.length - 1][0] || sRing[0][1] !== sRing[sRing.length - 1][1]) {
      sRing.push([sRing[0][0], sRing[0][1]]);
    }
    const spellGeom = [[sRing]];

    const vRing = visibilityPolygon.map(p => [p.x, p.y]);
    if (vRing[0][0] !== vRing[vRing.length - 1][0] || vRing[0][1] !== vRing[vRing.length - 1][1]) {
      vRing.push([vRing[0][0], vRing[0][1]]);
    }
    const visGeom = [[vRing]];

    const clipped = polygonClipping.intersection(spellGeom, visGeom);
    if (!clipped || clipped.length === 0) return [];

    // Convert back to Array<{x, y}> rings
    const resultRings = [];
    for (const poly of clipped) {
      for (const ring of poly) {
        if (ring && ring.length >= 3) {
          resultRings.push(ring.map(([x, y]) => ({ x, y })));
        }
      }
    }
    return resultRings;
  } catch (err) {
    console.warn('[AoETemplates] Error clipping against walls, returning unclipped template:', err);
    return [spellPolygon];
  }
}

/**
 * Builds a spell AoE polygon from a placement tool configuration.
 * Single entry point for cone/circle/line/cube template generation.
 * @param {string} shape - 'cone' | 'circle' | 'line' | 'cube'
 * @param {Object} params
 * @param {{x: number, y: number}} params.anchor - Caster origin in world px
 * @param {{x: number, y: number}} params.target - Aim point (cursor) in world px
 * @param {number} params.sizeFeet - Size in feet: cone length, circle radius, line length, cube side
 * @param {number} [params.feetPerTile=5] - Feet per grid tile
 * @param {number} [params.gridSize=50] - World pixels per grid tile
 * @returns {Array<{x: number, y: number}>|null}
 */
export function buildAoEPolygon(shape, { anchor, target, sizeFeet, feetPerTile = 5, gridSize = 50 }) {
  if (!anchor || !target || !sizeFeet || sizeFeet <= 0) return null;

  const pxPerFoot = gridSize / feetPerTile;
  const sizePx = sizeFeet * pxPerFoot;

  switch (shape) {
    case 'cone': {
      const angle = Math.atan2(target.y - anchor.y, target.x - anchor.x);
      return createConePolygon(anchor.x, anchor.y, sizePx, angle);
    }
    case 'circle': {
      return createCirclePolygon(target.x, target.y, sizePx);
    }
    case 'line': {
      const angle = Math.atan2(target.y - anchor.y, target.x - anchor.x);
      return createLinePolygon(anchor.x, anchor.y, sizePx, 5 * pxPerFoot, angle);
    }
    case 'cube': {
      return createCubePolygon(target.x, target.y, sizePx, 0, true);
    }
    default:
      return null;
  }
}

/**
 * Determines which tokens are caught in the AoE blast
 * @param {Array<Object>} tokens - Array of tokens with { position: {x, y} }
 * @param {Array<Array<{x: number, y: number}>>|Array<{x: number, y: number}>} aoePolygons - Clipped polygon ring(s)
 * @returns {Array<Object>} Array of tokens hit by the AoE
 */
export function getTokensInAoE(tokens, aoePolygons) {
  if (!tokens || !aoePolygons) return [];

  const rings = Array.isArray(aoePolygons[0]) && typeof aoePolygons[0][0] === 'object' && 'x' in aoePolygons[0][0]
    ? aoePolygons
    : [aoePolygons];

  const affectedTokens = [];

  for (const token of tokens) {
    if (!token.position) continue;
    const { x, y } = token.position;

    // Check if token center point is inside any ring
    let hit = false;
    for (const ring of rings) {
      if (isPointInPolygon(x, y, ring)) {
        hit = true;
        break;
      }
    }

    if (hit) {
      affectedTokens.push(token);
    }
  }

  return affectedTokens;
}
