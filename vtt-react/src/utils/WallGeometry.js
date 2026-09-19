import { getTileElevation } from './ElevationUtils';

export const WALL_BASE_SINK_WORLD = 3;
export const WALL_HEIGHT_MULTIPLIERS = { door: 1.25, window: 1.6, wall: 1.8 };
export const WALL_JOIN_EXTENSION_FACTOR = 0.5;
export const SUN_WORLD = { x: -0.62, y: -0.78, z: 0.74 };
export const DOOR_OPEN_ANGLE = (78 * Math.PI) / 180;
export const ANGLE_BUCKET_DEGREES = 15;
export const MIN_PROJECTED_TILT_COS = 0.05;

export function parseWallKey(key) {
  const parts = String(key).split(',').map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  return { x1: parts[0], y1: parts[1], x2: parts[2], y2: parts[3] };
}

export function pointInPolygon(x, y, poly) {
  if (!poly || poly.length < 3) return false;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersects = (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function polygonBBox(poly) {
  if (!poly || poly.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of poly) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

export function getWallThickness(gridSize) {
  return Math.max(6, (gridSize || 50) * 0.15);
}

export function getWallHeightWorld(wall, typeData, gridSize) {
  if (Number.isFinite(wall?.height) && wall.height > 0) return wall.height;
  const multiplier = typeData?.interactive
    ? WALL_HEIGHT_MULTIPLIERS.door
    : typeData?.isWindow
      ? WALL_HEIGHT_MULTIPLIERS.window
      : WALL_HEIGHT_MULTIPLIERS.wall;
  return multiplier * (gridSize || 50);
}

/**
 * Height of the wall body (the masonry run) rather than the opening.
 * Doors/windows keep their own opening proportions but their surrounding
 * masonry wraps up to the host wall height so runs stay level. 3D feature
 * models must therefore be scaled to this height too.
 */
export function getWallBodyHeightWorld(wall, gridSize) {
  if (Number.isFinite(wall?.height) && wall.height > 0) return wall.height;
  return WALL_HEIGHT_MULTIPLIERS.wall * (gridSize || 50);
}

/**
 * Free-form hex walls store their world-space endpoints on the wall record
 * (`hexEndpoints: [{x,y}, {x,y}]`). They may connect any two hex corners,
 * including straight chords that cross several cells, so the cell-pair key
 * alone cannot describe them.
 */
export function hexSegmentEndpoints(wall) {
  const endpoints = wall && typeof wall === 'object' ? wall.hexEndpoints : null;
  if (!Array.isArray(endpoints) || endpoints.length !== 2) return null;
  const [first, second] = endpoints;
  if (!first || !second) return null;
  if (![first.x, first.y, second.x, second.y].every(Number.isFinite)) return null;
  return [{ x: first.x, y: first.y }, { x: second.x, y: second.y }];
}

export function getWallWorldEndpoints(parsed, gridSystem, gridType, wall = null) {
  if (gridType === 'hex') {
    const stored = hexSegmentEndpoints(wall);
    if (stored) return { start: stored[0], end: stored[1] };
    const edge = gridSystem.getHexEdge(parsed.x1, parsed.y1, parsed.x2, parsed.y2);
    if (!edge || !edge.start || !edge.end) return null;
    return { start: edge.start, end: edge.end };
  }
  return {
    start: gridSystem.gridToWorldCorner(parsed.x1, parsed.y1),
    end: gridSystem.gridToWorldCorner(parsed.x2, parsed.y2)
  };
}

function adjacentTileCoords(parsed, gridType, gridSystem = null, wall = null) {
  const { x1, y1, x2, y2 } = parsed;
  if (gridType === 'hex') {
    const stored = hexSegmentEndpoints(wall);
    if (stored) {
      const cellsAt = (point) => {
        if (gridSystem && typeof gridSystem.hexCellsAtVertex === 'function') {
          return gridSystem.hexCellsAtVertex(point).map((cell) => [cell.q, cell.r]);
        }
        if (gridSystem) {
          const cell = gridSystem.worldToGrid(point.x, point.y);
          return [[cell.x, cell.y]];
        }
        return [];
      };
      return { start: cellsAt(stored[0]), end: cellsAt(stored[1]) };
    }
    return { start: [[x1, y1]], end: [[x2, y2]] };
  }
  if (x1 === x2) {
    return {
      start: [[x1 - 1, y1], [x1, y1]],
      end: [[x2 - 1, y2], [x2, y2]]
    };
  }
  return {
    start: [[x1, y1], [x1, y1 - 1]],
    end: [[x2, y2], [x2, y2 - 1]]
  };
}

export function getWallBaseWorldZ({ parsed, wall, gridType, gridSystem, elevationData }) {
  const { gridSize = 50 } = gridSystem.getGridState();
  if (Number.isFinite(wall?.baseElevation)) {
    const z = wall.baseElevation * gridSize;
    return { start: z, end: z, z, lowStart: z, lowEnd: z };
  }
  const coords = adjacentTileCoords(parsed, gridType, gridSystem, wall);
  const sample = (list) => {
    let highest = -Infinity;
    let lowest = Infinity;
    for (const [tx, ty] of list) {
      const level = getTileElevation(elevationData, tx, ty);
      if (level > highest) highest = level;
      if (level < lowest) lowest = level;
    }
    return {
      high: Number.isFinite(highest) ? highest * gridSize : 0,
      low: Number.isFinite(lowest) ? lowest * gridSize : 0
    };
  };
  const startZ = sample(coords.start);
  const endZ = sample(coords.end);
  return {
    start: startZ.high,
    end: endZ.high,
    z: Math.max(startZ.high, endZ.high),
    // Lowest adjacent ground per end: the wall face must reach down to it so
    // elevation steps read as retaining walls instead of floating slabs.
    lowStart: startZ.low,
    lowEnd: endZ.low
  };
}

export function nodeKeyForWorld(worldX, worldY) {
  return `${Math.round(worldX)},${Math.round(worldY)}`;
}

export function collectWallNodes({ wallData, wallTypes, gridSystem, gridType, elevationData }) {
  const nodes = new Map();
  if (!wallData) return nodes;

  for (const [key, wall] of Object.entries(wallData)) {
    if (!wall) continue;
    const parsed = parseWallKey(key);
    if (!parsed) continue;
    const ends = getWallWorldEndpoints(parsed, gridSystem, gridType, wall);
    if (!ends) continue;

    const typeId = typeof wall === 'string' ? wall : wall.type;
    const typeData = wallTypes?.[typeId] || {};
    const isSolid = !typeData.interactive && !typeData.isWindow;
    const { gridSize = 50 } = gridSystem.getGridState();
    const base = getWallBaseWorldZ({ parsed, wall, gridType, gridSystem, elevationData });
    const heightWorld = getWallHeightWorld(wall, typeData, gridSize);

    for (const which of ['start', 'end']) {
      const here = which === 'start' ? ends.start : ends.end;
      const there = which === 'start' ? ends.end : ends.start;
      const nodeKey = nodeKeyForWorld(here.x, here.y);
      const localBase = which === 'start' ? base.start : base.end;
      const localTop = localBase + heightWorld;

      let entry = nodes.get(nodeKey);
      if (!entry) {
        entry = {
          nodeKey,
          worldX: here.x,
          worldY: here.y,
          directions: new Set(),
          unitVectors: [],
          solidCount: 0,
          solidTopWorld: 0,
          baseWorldZ: -Infinity,
          hasSolid: false,
          color: typeData.color || '#7d746a',
          patternType: typeData.isWindow || typeData.interactive ? null : typeId,
          incident: []
        };
        nodes.set(nodeKey, entry);
      }

      const dxWorld = there.x - here.x;
      const dyWorld = there.y - here.y;
      const runLength = Math.max(1e-6, Math.hypot(dxWorld, dyWorld));
      const dirX = Math.sign(Math.round(dxWorld));
      const dirY = Math.sign(Math.round(dyWorld));
      entry.directions.add(`${dirX},${dirY}`);
      entry.unitVectors.push({ x: dxWorld / runLength, y: dyWorld / runLength, key, isSolid });
      entry.incident.push({ key, typeId, isSolid, isWindow: !!typeData.isWindow, isDoor: !!typeData.interactive });

      if (localBase > entry.baseWorldZ) entry.baseWorldZ = localBase;
      if (isSolid) {
        entry.solidCount += 1;
        entry.hasSolid = true;
        entry.color = typeData.color || entry.color;
        if (localTop > entry.solidTopWorld) entry.solidTopWorld = localTop;
      }
    }
  }

  for (const node of nodes.values()) {
    if (!Number.isFinite(node.baseWorldZ)) node.baseWorldZ = 0;
    if (node.solidTopWorld < node.baseWorldZ) node.solidTopWorld = node.baseWorldZ;
  }

  return nodes;
}

export function nodeConnectedSolidCount(node, excludeKey) {
  if (!node) return 0;
  let count = 0;
  for (const incident of node.incident) {
    if (!incident.isSolid) continue;
    if (excludeKey && incident.key === excludeKey) continue;
    count += 1;
  }
  return count;
}

export const WALL_MITER_LIMIT = 4;

export function wallSideNormal(dirX, dirY) {
  return { x: -dirY, y: dirX };
}

function intersectLines(p, d, q, e) {
  const den = d.x * e.y - d.y * e.x;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((q.x - p.x) * e.y - (q.y - p.y) * e.x) / den;
  return { x: p.x + d.x * t, y: p.y + d.y * t };
}

function gapCorners(V, dirA, dirB, half) {
  const nA = wallSideNormal(dirA.x, dirA.y);
  const nB = wallSideNormal(dirB.x, dirB.y);
  const fallbackA = { x: V.x + nA.x * half, y: V.y + nA.y * half };
  const fallbackB = { x: V.x - nB.x * half, y: V.y - nB.y * half };
  const hit = intersectLines(fallbackA, dirA, fallbackB, dirB);
  if (!hit) return { a: fallbackA, b: fallbackB };
  const dx = hit.x - V.x;
  const dy = hit.y - V.y;
  const dist = Math.hypot(dx, dy);
  const maxDist = WALL_MITER_LIMIT * half;
  if (dist > maxDist) {
    // Shallow joins produce enormous mitre spikes. Clamp the corner to a
    // shared bevel point instead of falling back to square ends: both arms
    // compute the same intersection, so both still get the identical bevelled
    // edge and their footprints keep unioning into one seamless run.
    const scale = maxDist / dist;
    const clamped = { x: V.x + dx * scale, y: V.y + dy * scale };
    return { a: clamped, b: clamped };
  }
  return { a: hit, b: hit };
}

export function wallJoinCorners({ node, excludeKey, dirX, dirY, half, partnerKeys = null }) {
  if (!node || !Number.isFinite(node.worldX) || !Number.isFinite(node.worldY)) return null;
  const partners = (node.unitVectors || []).filter((v) => {
    if (!v.isSolid || v.key === excludeKey) return false;
    // Only walls that actually union together (same material/height run) may
    // shape each other's footprint; otherwise a crossing wall of another
    // material mitre-cuts the run into pieces with stray internal faces.
    if (partnerKeys && !partnerKeys.has(v.key)) return false;
    return true;
  });
  if (partners.length === 0) return null;
  const selfAngle = Math.atan2(dirY, dirX);
  const entries = partners
    .map((v) => ({ x: v.x, y: v.y, angle: Math.atan2(v.y, v.x) }))
    .concat([{ x: dirX, y: dirY, angle: selfAngle, self: true }])
    .sort((a, b) => a.angle - b.angle);
  const selfIndex = entries.findIndex((entry) => entry.self);
  const next = entries[(selfIndex + 1) % entries.length];
  const prev = entries[(selfIndex + entries.length - 1) % entries.length];
  const V = { x: node.worldX, y: node.worldY };
  const after = gapCorners(V, entries[selfIndex], next, half);
  const before = gapCorners(V, prev, entries[selfIndex], half);
  return { plus: after.a, minus: before.b };
}

function projectOnAxis(corner, V, dirX, dirY) {
  return (corner.x - V.x) * dirX + (corner.y - V.y) * dirY;
}

export function wallJoinExtension({ node, excludeKey, dirX, dirY, half }) {
  const corners = wallJoinCorners({ node, excludeKey, dirX, dirY, half });
  if (!corners) return null;
  const V = { x: node.worldX, y: node.worldY };
  const projections = [
    projectOnAxis(corners.plus, V, dirX, dirY),
    projectOnAxis(corners.minus, V, dirX, dirY)
  ].filter((value) => value > 1e-6);
  if (projections.length === 0) return 0;
  return Math.min(...projections);
}

export function computeWallFootprint({ item, startNode, endNode, half, partnerKeys = null }) {
  if (!item || !Number.isFinite(half) || half <= 0) return null;
  const start = item.worldStart;
  const end = item.worldEnd;
  if (!start || !end) return null;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.max(1e-6, Math.hypot(dx, dy));
  const ux = dx / length;
  const uy = dy / length;
  const n = wallSideNormal(ux, uy);
  const startCorners = wallJoinCorners({ node: startNode, excludeKey: item.key, dirX: ux, dirY: uy, half, partnerKeys });
  const endCorners = wallJoinCorners({ node: endNode, excludeKey: item.key, dirX: -ux, dirY: -uy, half, partnerKeys });
  const startPlus = startCorners ? startCorners.plus : { x: start.x + n.x * half, y: start.y + n.y * half };
  const startMinus = startCorners ? startCorners.minus : { x: start.x - n.x * half, y: start.y - n.y * half };
  const endPlus = endCorners ? endCorners.plus : { x: end.x - n.x * half, y: end.y - n.y * half };
  const endMinus = endCorners ? endCorners.minus : { x: end.x + n.x * half, y: end.y + n.y * half };
  return [
    [startPlus.x, startPlus.y],
    [endMinus.x, endMinus.y],
    [endPlus.x, endPlus.y],
    [startMinus.x, startMinus.y]
  ];
}

function projectWallPoint(transform, wx, wy, wz) {
  const dx = wx - transform.cameraX;
  const dy = wy - transform.cameraY;
  const xr = dx * transform.cosYaw + dy * transform.sinYaw;
  const yr = -dx * transform.sinYaw + dy * transform.cosYaw;
  const eff = transform.effectiveZoom;
  return {
    x: transform.centerX + xr * eff,
    y: transform.centerY + yr * transform.sinTilt * eff - (wz || 0) * transform.cosTilt * eff
  };
}

export function projectWorldPoint(transform, wx, wy, wz) {
  return projectWallPoint(transform, wx, wy, wz);
}

// A wall face seen almost edge-on projects its length to a sliver. The pattern
// matrix built from that sliver is near-singular (its two basis vectors become
// parallel), which makes browsers drop or smear the texture: flat untextured
// wall sections at certain camera angles. Clamp the wall-direction basis to a
// minimum perpendicular component against the other basis vector so grazing
// faces keep legible texture instead.
export const WALL_PATTERN_MIN_PROJECTED = 0.22;

function clampProjectedBasis(vector, axis, reference) {
  const axisLength = Math.hypot(axis.x, axis.y);
  if (axisLength < 1e-6) return vector;
  const ax = axis.x / axisLength;
  const ay = axis.y / axisLength;
  const along = vector.x * ax + vector.y * ay;
  let perp = { x: vector.x - ax * along, y: vector.y - ay * along };
  const minLength = reference * WALL_PATTERN_MIN_PROJECTED;
  let perpLength = Math.hypot(perp.x, perp.y);
  if (perpLength >= minLength || minLength <= 0) return vector;
  if (perpLength < 1e-6) {
    perp = { x: -ay, y: ax };
    perpLength = 1;
  }
  return { x: (perp.x / perpLength) * minLength, y: (perp.y / perpLength) * minLength };
}

/**
 * World-anchored texture mapping for wall surfaces.
 *
 * The wall pattern must not slide when the camera pans/zooms: we build a
 * `patternTransform` matrix from the actual projection so one pattern tile
 * equals one world grid cell on the wall plane.
 *  - `side` maps tile X along the wall direction and tile Y down world Z
 *    (vertical faces).
 *  - `top`  maps tile X along the wall direction and tile Y along the wall's
 *    ground normal (horizontal top faces).
 * Direction is canonicalised (flipped 180° when needed) so every face with the
 * same orientation shares one pattern id/matrix pair.
 */
export function wallPatternDescriptor({ typeId, ux, uy, gridSize, transform, color }) {
  const unit = Math.max(16, gridSize || 50);
  let cx = ux;
  let cy = uy;
  const len = Math.hypot(cx, cy);
  if (len < 1e-9) return null;
  cx /= len;
  cy /= len;
  if (cx < -1e-9 || (Math.abs(cx) <= 1e-9 && cy < 0)) {
    cx = -cx;
    cy = -cy;
  }

  const p0 = projectWallPoint(transform, 0, 0, 0);
  const px = projectWallPoint(transform, 1, 0, 0);
  const py = projectWallPoint(transform, 0, 1, 0);
  const pz = projectWallPoint(transform, 0, 0, 1);
  const ex = { x: px.x - p0.x, y: px.y - p0.y };
  const ey = { x: py.x - p0.x, y: py.y - p0.y };
  const ez = { x: pz.x - p0.x, y: pz.y - p0.y };

  const gu = { x: ex.x * cx + ey.x * cy, y: ex.y * cx + ey.y * cy };
  const gn = { x: ex.x * -cy + ey.x * cx, y: ex.y * -cy + ey.y * cx };
  let gv = { x: -ez.x, y: -ez.y };
  if (Math.hypot(gv.x, gv.y) < 1e-6) {
    gv = gn.y >= 0 ? gn : { x: -gn.x, y: -gn.y };
  }

  const reference = Math.max(Math.hypot(ex.x, ex.y), Math.hypot(ey.x, ey.y), 1e-6);
  const sideGu = clampProjectedBasis(gu, gv, reference);
  const topGu = clampProjectedBasis(gu, gn, reference);
  const clamped = sideGu !== gu || topGu !== gu;

  const dirKey = Math.round((Math.atan2(cy, cx) * 180) / Math.PI);
  // One pattern tile spans exactly one world grid cell; pattern space uses
  // `unit` local units per tile, so the matrix scales per-local-unit.
  const scale = (gridSize || unit) / unit;
  const sideSuffix = clamped ? '-c' : '';
  const matrixFor = (by, bx = gu) => ({
    a: bx.x * scale,
    b: bx.y * scale,
    c: by.x * scale,
    d: by.y * scale,
    e: p0.x,
    f: p0.y
  });

  return {
    type: typeId,
    color,
    unit,
    side: {
      id: `svgWallPat-${typeId}-${dirKey}${sideSuffix}-s`,
      matrix: matrixFor(gv, sideGu)
    },
    top: { id: `svgWallPat-${typeId}-${dirKey}-t`, matrix: matrixFor(gn, topGu) }
  };
}

export function registerWallPattern(patternsById, descriptor) {
  if (!patternsById || !descriptor) return;
  patternsById.set(descriptor.side.id, {
    id: descriptor.side.id,
    type: descriptor.type,
    color: descriptor.color,
    unit: descriptor.unit,
    matrix: descriptor.side.matrix
  });
  patternsById.set(descriptor.top.id, {
    id: descriptor.top.id,
    type: descriptor.type,
    color: descriptor.color,
    unit: descriptor.unit,
    matrix: descriptor.top.matrix
  });
}

function shrinkPolygon(poly, amount) {
  if (!poly || poly.length < 3) return poly;
  let cx = 0;
  let cy = 0;
  for (const p of poly) {
    cx += p.x;
    cy += p.y;
  }
  cx /= poly.length;
  cy /= poly.length;
  return poly.map((p) => ({
    x: p.x + (cx - p.x) * amount,
    y: p.y + (cy - p.y) * amount
  }));
}

function screenLine(a, b) {
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}

export function computePrism({
  start,
  end,
  baseZStart,
  baseZEnd,
  topZ,
  thickness,
  transform,
  connectedStart = false,
  connectedEnd = false
}) {
  const dxw = end.x - start.x;
  const dyw = end.y - start.y;
  const runLength = Math.max(1e-6, Math.hypot(dxw, dyw));
  const ux = dxw / runLength;
  const uy = dyw / runLength;
  const nwx = -uy;
  const nwy = ux;
  const half = thickness / 2;

  const project = (wx, wy, wz) => projectWallPoint(transform, wx, wy, wz);
  const worldAt = (t, v) => ({
    x: start.x + dxw * t + nwx * v,
    y: start.y + dyw * t + nwy * v
  });
  const at = (t, v, z) => {
    const w = worldAt(t, v);
    return project(w.x, w.y, z);
  };
  const localBaseZ = (t) => baseZStart + (baseZEnd - baseZStart) * t;

  const viewX = -transform.sinYaw;
  const viewY = transform.cosYaw;
  const nearSide = nwx * viewX + nwy * viewY > 0 ? 1 : -1;
  const farSide = -nearSide;
  const nearV = nearSide * half;
  const farV = farSide * half;

  const base1 = project(start.x, start.y, baseZStart);
  const base2 = project(end.x, end.y, baseZEnd);
  const top1 = project(start.x, start.y, topZ);
  const top2 = project(end.x, end.y, topZ);

  const nearFace = [
    at(0, nearV, baseZStart),
    at(1, nearV, baseZEnd),
    at(1, nearV, topZ),
    at(0, nearV, topZ)
  ];
  const farFace = [
    at(0, farV, baseZStart),
    at(1, farV, baseZEnd),
    at(1, farV, topZ),
    at(0, farV, topZ)
  ];
  const topFace = [
    at(0, half, topZ),
    at(1, half, topZ),
    at(1, -half, topZ),
    at(0, -half, topZ)
  ];

  const endQuad = (which) => {
    const t = which === 'start' ? 0 : 1;
    const z = which === 'start' ? baseZStart : baseZEnd;
    return [at(t, half, z), at(t, -half, z), at(t, -half, topZ), at(t, half, topZ)];
  };

  const startVisible = -ux * viewX - uy * viewY > 0;
  const endVisible = ux * viewX + uy * viewY > 0;

  const nearNormal = { x: nwx * nearSide, y: nwy * nearSide };
  const farNormal = { x: -nearNormal.x, y: -nearNormal.y };

  const midWorldX = (start.x + end.x) / 2;
  const midWorldY = (start.y + end.y) / 2;
  const depth = -((midWorldX - transform.cameraX) * transform.sinYaw) +
    (midWorldY - transform.cameraY) * transform.cosYaw;

  return {
    start,
    end,
    ux,
    uy,
    nwx,
    nwy,
    runLength,
    half,
    thickness,
    nearSide,
    nearV,
    farV,
    nearWorld: [worldAt(0, nearV), worldAt(1, nearV)],
    viewX,
    viewY,
    project,
    worldAt,
    at,
    localBaseZ,
    screen: { base1, base2, top1, top2 },
    faces: {
      near: nearFace,
      far: farFace,
      top: topFace,
      endStart: endQuad('start'),
      endEnd: endQuad('end')
    },
    showEndStart: startVisible && !connectedStart,
    showEndEnd: endVisible && !connectedEnd,
    connectedStart,
    connectedEnd,
    light: {
      near: nearNormal.x * SUN_WORLD.x + nearNormal.y * SUN_WORLD.y,
      far: farNormal.x * SUN_WORLD.x + farNormal.y * SUN_WORLD.y,
      endStart: -ux * SUN_WORLD.x - uy * SUN_WORLD.y,
      endEnd: ux * SUN_WORLD.x + uy * SUN_WORLD.y,
      top: SUN_WORLD.z,
      // Screen-space lateral term used for stylized key-light shading so
      // features (doors/windows) match their host wall run.
      lateralNear: nearNormal.x * transform.cosYaw + nearNormal.y * transform.sinYaw
    },
    capPoints: shrinkPolygon(topFace, 0.14),
    depth
  };
}

export function buildWallRenderItem({
  key,
  wall,
  typeData,
  gridSystem,
  gridType,
  transform,
  elevationData,
  connectedStart = false,
  connectedEnd = false,
  startNode = null,
  endNode = null,
  patternType = null,
  hostHeightWorld = null,
  hostColor = null
}) {
  const parsed = parseWallKey(key);
  if (!parsed) return null;
  const ends = getWallWorldEndpoints(parsed, gridSystem, gridType, wall);
  if (!ends) return null;

  const { start, end } = ends;
  const { gridSize = 50 } = gridSystem.getGridState();
  const thickness = getWallThickness(gridSize, transform);
  const base = getWallBaseWorldZ({ parsed, wall, gridType, gridSystem, elevationData });

  const typeId = typeof wall === 'string' ? wall : wall.type;
  const isDoor = !!typeData?.interactive;
  const isWindow = !!typeData?.isWindow;
  const isOpen = wall.state === 'open';
  const isMagic = !isDoor && !isWindow && typeData?.blocksLineOfSight === false;
  const color = typeData?.color || '#8a827a';

  // Doors/windows keep their own opening proportions but the surrounding
  // masonry wraps up to the host wall's height so runs stay level.
  const openingHeightWorld = getWallHeightWorld(wall, typeData, gridSize);
  const isFeature = isDoor || isWindow;
  const heightWorld = isFeature
    ? (hostHeightWorld != null ? hostHeightWorld : WALL_HEIGHT_MULTIPLIERS.wall * gridSize)
    : openingHeightWorld;
  const baseZStart = base.start - WALL_BASE_SINK_WORLD;
  const baseZEnd = base.end - WALL_BASE_SINK_WORLD;
  // Lowest adjacent ground at each end. The wall body only starts at the
  // highest adjacent ground, but its rendered run descends to this bottom so a
  // wall along an elevation step reads as a retaining wall rather than a slab
  // floating above the lower floor.
  const baseZLowStart = base.lowStart - WALL_BASE_SINK_WORLD;
  const baseZLowEnd = base.lowEnd - WALL_BASE_SINK_WORLD;
  const topZ = base.z + heightWorld;

  const rawDx = end.x - start.x;
  const rawDy = end.y - start.y;
  const rawLength = Math.max(1e-6, Math.hypot(rawDx, rawDy));
  const rawUx = rawDx / rawLength;
  const rawUy = rawDy / rawLength;
  const half = thickness / 2;
  const joinExtension = thickness * WALL_JOIN_EXTENSION_FACTOR;
  const miterStart = wallJoinExtension({ node: startNode, excludeKey: key, dirX: rawUx, dirY: rawUy, half });
  const miterEnd = wallJoinExtension({ node: endNode, excludeKey: key, dirX: -rawUx, dirY: -rawUy, half });
  const extendStart = miterStart != null ? miterStart : (connectedStart ? joinExtension : 0);
  const extendEnd = miterEnd != null ? miterEnd : (connectedEnd ? joinExtension : 0);
  const prismStart = extendStart > 0
    ? { x: start.x - rawUx * extendStart, y: start.y - rawUy * extendStart }
    : start;
  const prismEnd = extendEnd > 0
    ? { x: end.x + rawUx * extendEnd, y: end.y + rawUy * extendEnd }
    : end;

  const core = computePrism({
    start: prismStart,
    end: prismEnd,
    baseZStart,
    baseZEnd,
    topZ,
    thickness,
    transform,
    connectedStart,
    connectedEnd
  });

  // Masonry texture must survive an open door: the swing leaf owns its own
  // material, so the lintel/stubs still borrow the host wall pattern.
  const pattern = !isMagic
    ? wallPatternDescriptor({
        typeId: patternType || typeId || 'stone_wall',
        ux: rawUx,
        uy: rawUy,
        gridSize,
        transform,
        color
      })
    : null;
  const patternId = pattern ? pattern.side.id : null;

  const item = {
    kind: 'wall',
    key,
    parsed,
    typeId,
    isDoor,
    isWindow,
    isOpen,
    isMagic,
    state: wall.state || 'closed',
    color,
    // Doors/windows keep their own material (wood, glass) for the frame/leaf,
    // but the masonry that wraps the opening must match the host wall.
    masonryColor: isFeature && hostColor ? hostColor : color,
    heightWorld,
    openingHeightWorld,
    topZ,
    baseZStart,
    baseZEnd,
    baseZLowStart,
    baseZLowEnd,
    worldStart: start,
    worldEnd: end,
    ...core,
    patternId,
    pattern,
    window: null,
    door: null
  };

  if (isWindow) {
    item.window = buildWindowParts(item, typeId, base.z);
  } else if (isDoor) {
    item.door = buildDoorParts(item, wall);
  }

  return item;
}

function buildWindowParts(item, typeId, groundZ) {
  const kind = typeId === 'barred_window'
    ? 'barred'
    : typeId === 'arrow_slit'
      ? 'slit'
      : typeId === 'open_window'
        ? 'open'
        : 'glass';

  const spec = kind === 'slit'
    ? { t0: 0.42, t1: 0.58, sill: 0.42, head: 0.84 }
    : kind === 'open'
      ? { t0: 0.12, t1: 0.88, sill: 0.28, head: 0.86 }
      : { t0: 0.14, t1: 0.86, sill: 0.3, head: 0.82 };

  const { at, nearSide, half, heightWorld, topZ, localBaseZ } = item;
  const nearV = nearSide * half;
  const farV = -nearV;
  const t0 = spec.t0;
  const t1 = spec.t1;
  const openingHeight = Math.min(item.openingHeightWorld || heightWorld, heightWorld);
  const sillZ = groundZ + openingHeight * spec.sill;
  const headZ = groundZ + openingHeight * spec.head;
  const baseZ = (t) => localBaseZ(t);
  const frameT = 0.035;
  const frameZ = Math.max(2, heightWorld * 0.025);

  const block = (tA, tB) => ({
    near: [
      at(tA, nearV, baseZ(tA)),
      at(tB, nearV, baseZ(tB)),
      at(tB, nearV, topZ),
      at(tA, nearV, topZ)
    ],
    far: [
      at(tA, farV, baseZ(tA)),
      at(tB, farV, baseZ(tB)),
      at(tB, farV, topZ),
      at(tA, farV, topZ)
    ]
  });
  const sideStart = block(0, t0);
  const sideEnd = block(t1, 1);
  const jambStart = [
    at(t0, half, baseZ(t0)),
    at(t0, -half, baseZ(t0)),
    at(t0, -half, headZ),
    at(t0, half, headZ)
  ];
  const jambEnd = [
    at(t1, half, baseZ(t1)),
    at(t1, -half, baseZ(t1)),
    at(t1, -half, headZ),
    at(t1, half, headZ)
  ];
  const breastNear = [
    at(0, nearV, baseZ(0)),
    at(1, nearV, baseZ(1)),
    at(1, nearV, sillZ),
    at(0, nearV, sillZ)
  ];
  const breastFar = [
    at(0, farV, baseZ(0)),
    at(1, farV, baseZ(1)),
    at(1, farV, sillZ),
    at(0, farV, sillZ)
  ];
  // The sill is a real ledge: it overhangs the wall face so it catches light
  // and casts a small contact shadow under itself.
  const sillProtrude = Math.max(1.5, item.thickness * 0.18);
  const sillLedgeZ = Math.max(2, item.thickness * 0.28);
  const sillNearV = nearV + nearSide * sillProtrude;
  const sillFarV = farV - nearSide * sillProtrude;
  const sillTop = [
    at(-0.02, sillNearV, sillZ),
    at(1.02, sillNearV, sillZ),
    at(1.02, sillFarV, sillZ),
    at(-0.02, sillFarV, sillZ)
  ];
  const sillFront = [
    at(-0.02, sillNearV, sillZ - sillLedgeZ),
    at(1.02, sillNearV, sillZ - sillLedgeZ),
    at(1.02, sillNearV, sillZ),
    at(-0.02, sillNearV, sillZ)
  ];
  const sillShadowHeight = Math.max(2.5, item.thickness * 0.45);
  const sillShadow = [
    at(-0.07, nearV + nearSide * 0.3, sillZ - sillLedgeZ),
    at(1.07, nearV + nearSide * 0.3, sillZ - sillLedgeZ),
    at(1.07, nearV + nearSide * 0.3, sillZ - sillLedgeZ - sillShadowHeight),
    at(-0.07, nearV + nearSide * 0.3, sillZ - sillLedgeZ - sillShadowHeight)
  ];
  const lintelNear = [
    at(0, nearV, headZ),
    at(1, nearV, headZ),
    at(1, nearV, topZ),
    at(0, nearV, topZ)
  ];
  const lintelFar = [
    at(0, farV, headZ),
    at(1, farV, headZ),
    at(1, farV, topZ),
    at(0, farV, topZ)
  ];
  // Contact/ambient occlusion strips hugging the jamb edges on the near face:
  // without them the frame reads pasted onto the wall instead of set into it.
  const aoT = Math.max(0.03, (item.thickness * 0.22) / Math.max(1e-6, item.runLength));
  const aoV = nearV + nearSide * 0.3;
  const aoStart = [
    at(t0 - aoT, aoV, sillZ),
    at(t0, aoV, sillZ),
    at(t0, aoV, headZ),
    at(t0 - aoT, aoV, headZ)
  ];
  const aoEnd = [
    at(t1, aoV, sillZ),
    at(t1 + aoT, aoV, sillZ),
    at(t1 + aoT, aoV, headZ),
    at(t1, aoV, headZ)
  ];
  const soffit = [
    at(0, nearV, headZ),
    at(1, nearV, headZ),
    at(1, farV, headZ),
    at(0, farV, headZ)
  ];
  const revealStart = [
    at(t0, half, sillZ),
    at(t0, -half, sillZ),
    at(t0, -half, headZ),
    at(t0, half, headZ)
  ];
  const revealEnd = [
    at(t1, half, sillZ),
    at(t1, -half, sillZ),
    at(t1, -half, headZ),
    at(t1, half, headZ)
  ];

  const isGlass = kind === 'glass';
  const isOpenWindow = kind === 'open';
  const pane = (isGlass || kind === 'barred')
    ? [
        at(t0 + 0.01, 0, sillZ + 1.5),
        at(t1 - 0.01, 0, sillZ + 1.5),
        at(t1 - 0.01, 0, headZ - 1.5),
        at(t0 + 0.01, 0, headZ - 1.5)
      ]
    : null;

  const interior = (kind === 'barred' || kind === 'slit' || isOpenWindow)
    ? [
        at(t0, 0, sillZ),
        at(t1, 0, sillZ),
        at(t1, 0, headZ),
        at(t0, 0, headZ)
      ]
    : null;

  const framePost = (t, faceV) => [
    at(t, faceV, sillZ),
    at(t + frameT, faceV, sillZ),
    at(t + frameT, faceV, headZ),
    at(t, faceV, headZ)
  ];
  const frameBand = (z0, z1, faceV) => [
    at(t0, faceV, z0),
    at(t1, faceV, z0),
    at(t1, faceV, z1),
    at(t0, faceV, z1)
  ];
  const frameOutNear = nearV + nearSide * sillProtrude * 0.32;
  const frameOutFar = farV - nearSide * sillProtrude * 0.32;
  const frameNear = {
    left: framePost(t0, frameOutNear),
    right: framePost(t1 - frameT, frameOutNear),
    top: frameBand(headZ - frameZ, headZ, frameOutNear),
    bottom: frameBand(sillZ, sillZ + frameZ, frameOutNear)
  };
  const frameFar = {
    left: framePost(t0, frameOutFar),
    right: framePost(t1 - frameT, frameOutFar),
    top: frameBand(headZ - frameZ, headZ, frameOutFar),
    bottom: frameBand(sillZ, sillZ + frameZ, frameOutFar)
  };

  const mullions = [];
  const bars = [];
  if (isGlass) {
    const midT = (t0 + t1) / 2;
    mullions.push(screenLine(at(midT, 0, sillZ + 1.5), at(midT, 0, headZ - 1.5)));
    const midZ = (sillZ + headZ) / 2;
    mullions.push(screenLine(at(t0 + 0.01, 0, midZ), at(t1 - 0.01, 0, midZ)));
  }
  if (kind === 'barred') {
    const count = 5;
    for (let i = 1; i < count; i++) {
      const t = t0 + ((t1 - t0) * i) / count;
      bars.push(screenLine(at(t, 0, sillZ + 1.5), at(t, 0, headZ - 1.5)));
    }
    const crossZ = (sillZ + headZ) / 2;
    bars.push(screenLine(at(t0 + 0.01, 0, crossZ), at(t1 - 0.01, 0, crossZ)));
  }

  return {
    kind,
    boundaries: { t0, t1, sillZ, headZ },
    breastNear,
    breastFar,
    sillTop,
    sillFront,
    sillShadow,
    aoStart,
    aoEnd,
    lintelNear,
    lintelFar,
    sideStart,
    sideEnd,
    jambStart,
    jambEnd,
    soffit,
    revealStart,
    revealEnd,
    frameNear,
    frameFar,
    pane,
    interior,
    mullions,
    bars,
    sillEdge: screenLine(at(-0.02, sillNearV, sillZ), at(1.02, sillNearV, sillZ)),
    headEdge: screenLine(at(0, nearV, headZ), at(1, nearV, headZ))
  };
}

function buildDoorParts(item, wall) {
  const {
    at,
    nearSide,
    half,
    heightWorld,
    topZ,
    localBaseZ,
    worldStart,
    ux,
    uy,
    nwx,
    nwy,
    runLength,
    project,
    thickness,
    viewX,
    viewY
  } = item;
  const nearV = nearSide * half;
  const farV = -nearV;
  const groundZ = localBaseZ(0);
  const openingHeight = Math.min(item.openingHeightWorld || heightWorld * 0.88, heightWorld * 0.97);
  const doorHeight = openingHeight;
  const doorTopZ = groundZ + doorHeight;
  const t0 = 0.09;
  const t1 = 0.91;
  const frameT = 0.05;
  const frameZ = Math.max(2, doorHeight * 0.05);
  const baseZ = (t) => localBaseZ(t);

  const block = (tA, tB) => ({
    near: [
      at(tA, nearV, baseZ(tA)),
      at(tB, nearV, baseZ(tB)),
      at(tB, nearV, topZ),
      at(tA, nearV, topZ)
    ],
    far: [
      at(tA, farV, baseZ(tA)),
      at(tB, farV, baseZ(tB)),
      at(tB, farV, topZ),
      at(tA, farV, topZ)
    ]
  });
  const stubStart = block(0, t0);
  const stubEnd = block(t1, 1);
  const jambStart = [
    at(t0, half, baseZ(t0)),
    at(t0, -half, baseZ(t0)),
    at(t0, -half, doorTopZ),
    at(t0, half, doorTopZ)
  ];
  const jambEnd = [
    at(t1, half, baseZ(t1)),
    at(t1, -half, baseZ(t1)),
    at(t1, -half, doorTopZ),
    at(t1, half, doorTopZ)
  ];
  const aoT = Math.max(0.03, (thickness * 0.22) / Math.max(1e-6, runLength));
  const aoV = nearV + nearSide * 0.3;
  const aoStart = [
    at(t0 - aoT, aoV, baseZ(t0 - aoT)),
    at(t0, aoV, baseZ(t0)),
    at(t0, aoV, doorTopZ),
    at(t0 - aoT, aoV, doorTopZ)
  ];
  const aoEnd = [
    at(t1, aoV, baseZ(t1)),
    at(t1 + aoT, aoV, baseZ(t1 + aoT)),
    at(t1 + aoT, aoV, doorTopZ),
    at(t1, aoV, doorTopZ)
  ];
  const lintelNear = [
    at(0, nearV, doorTopZ),
    at(1, nearV, doorTopZ),
    at(1, nearV, topZ),
    at(0, nearV, topZ)
  ];
  const lintelFar = [
    at(0, farV, doorTopZ),
    at(1, farV, doorTopZ),
    at(1, farV, topZ),
    at(0, farV, topZ)
  ];
  const soffit = [
    at(t0, nearV, doorTopZ),
    at(t1, nearV, doorTopZ),
    at(t1, farV, doorTopZ),
    at(t0, farV, doorTopZ)
  ];
  const floor = [
    at(t0, nearV, groundZ),
    at(t1, nearV, groundZ),
    at(t1, farV, groundZ),
    at(t0, farV, groundZ)
  ];

  const framePost = (t, faceV) => [
    at(t, faceV, baseZ(t)),
    at(t + frameT, faceV, baseZ(t + frameT)),
    at(t + frameT, faceV, doorTopZ),
    at(t, faceV, doorTopZ)
  ];
  const frameHead = (faceV) => [
    at(t0, faceV, doorTopZ - frameZ),
    at(t1, faceV, doorTopZ - frameZ),
    at(t1, faceV, doorTopZ),
    at(t0, faceV, doorTopZ)
  ];
  const frameNear = {
    left: framePost(t0, nearV * 0.92),
    right: framePost(t1 - frameT, nearV * 0.92),
    head: frameHead(nearV * 0.92)
  };
  const frameFar = {
    left: framePost(t0, farV * 0.92),
    right: framePost(t1 - frameT, farV * 0.92),
    head: frameHead(farV * 0.92)
  };

  const leafV = 0;
  const leafT0 = t0 + frameT * 0.7;
  const leafT1 = t1 - frameT * 0.7;
  const leafTopZ = doorTopZ - frameZ * 0.55;
  const isOpen = wall.state === 'open';
  let leaf = null;
  let swing = null;

  if (!isOpen) {
    const face = [
      at(leafT0, leafV, baseZ(leafT0)),
      at(leafT1, leafV, baseZ(leafT1)),
      at(leafT1, leafV, leafTopZ),
      at(leafT0, leafV, leafTopZ)
    ];
    const planks = [0.2, 0.4, 0.6, 0.8].map((f) => {
      const t = leafT0 + (leafT1 - leafT0) * f;
      return screenLine(at(t, leafV, baseZ(t)), at(t, leafV, leafTopZ));
    });
    const bands = [0.2, 0.76].map((f) => {
      const z = groundZ + doorHeight * f;
      return screenLine(at(leafT0 + 0.01, leafV, z), at(leafT1 - 0.01, leafV, z));
    });
    const midT = (leafT0 + leafT1) / 2;
    const handle = at(midT + 0.05, leafV, groundZ + doorHeight * 0.46);
    const lock = at(midT + 0.05, leafV, groundZ + doorHeight * 0.34);
    const hinges = [0.2, 0.78].map((f) => at(leafT0 + 0.02, leafV, groundZ + doorHeight * f));
    leaf = { face, planks, bands, handle, lock, hinges };
  } else {
    // The open leaf is a real slab: hinge at the frame, rotated into the room
    // toward the camera. It carries proper near/far/top/edge faces so it reads
    // as a 3D door instead of a flat card, plus a soft projected floor shadow
    // and a thin swing arc.
    const hingeT = leafT0;
    const hingeWorld = {
      x: worldStart.x + ux * runLength * hingeT,
      y: worldStart.y + uy * runLength * hingeT
    };
    const hingeScreen = project(hingeWorld.x, hingeWorld.y, groundZ);
    const rot = (a) => ({
      x: ux * Math.cos(a) - uy * Math.sin(a),
      y: ux * Math.sin(a) + uy * Math.cos(a)
    });
    let dir = rot(DOOR_OPEN_ANGLE);
    if ((dir.x * nwx + dir.y * nwy) * nearSide < 0) dir = rot(-DOOR_OPEN_ANGLE);
    const leafLen = runLength * (leafT1 - leafT0);
    const leafEnd = {
      x: hingeWorld.x + dir.x * leafLen,
      y: hingeWorld.y + dir.y * leafLen
    };
    const rawPerp = { x: -dir.y, y: dir.x };
    const toward = rawPerp.x * viewX + rawPerp.y * viewY >= 0 ? 1 : -1;
    const nearPerp = { x: rawPerp.x * toward, y: rawPerp.y * toward };
    const farPerp = { x: -nearPerp.x, y: -nearPerp.y };
    const leafHalf = Math.max(1.1, thickness * 0.18);

    const offset = (p, perp, s) => ({ x: p.x + perp.x * s, y: p.y + perp.y * s });
    const nearA = offset(hingeWorld, nearPerp, leafHalf);
    const nearB = offset(leafEnd, nearPerp, leafHalf);
    const farB = offset(leafEnd, farPerp, leafHalf);
    const farA = offset(hingeWorld, farPerp, leafHalf);

    const face = (a, b) => [
      project(a.x, a.y, groundZ),
      project(b.x, b.y, groundZ),
      project(b.x, b.y, leafTopZ),
      project(a.x, a.y, leafTopZ)
    ];

    const leafNear = face(nearA, nearB);
    const leafFarShape = face(farA, farB);
    const leafEdgeFree = face(nearB, farB);
    const leafEdgeHinge = face(farA, nearA);
    const leafTop = [
      project(nearA.x, nearA.y, leafTopZ),
      project(nearB.x, nearB.y, leafTopZ),
      project(farB.x, farB.y, leafTopZ),
      project(farA.x, farA.y, leafTopZ)
    ];

    const planks = [0.22, 0.44, 0.66, 0.88].map((f) => {
      const wx = hingeWorld.x + dir.x * leafLen * f;
      const wy = hingeWorld.y + dir.y * leafLen * f;
      return screenLine(
        project(wx + nearPerp.x * leafHalf, wy + nearPerp.y * leafHalf, groundZ + doorHeight * 0.03),
        project(wx + nearPerp.x * leafHalf, wy + nearPerp.y * leafHalf, leafTopZ)
      );
    });
    const bands = [0.24, 0.74].map((f) => {
      const z = groundZ + doorHeight * f;
      return screenLine(
        project(hingeWorld.x + nearPerp.x * leafHalf, hingeWorld.y + nearPerp.y * leafHalf, z),
        project(leafEnd.x + nearPerp.x * leafHalf, leafEnd.y + nearPerp.y * leafHalf, z)
      );
    });
    const hinges = [0.22, 0.78].map((f) => {
      const z = groundZ + doorHeight * f;
      return project(hingeWorld.x + nearPerp.x * leafHalf, hingeWorld.y + nearPerp.y * leafHalf, z);
    });
    const handle = project(
      leafEnd.x + nearPerp.x * leafHalf - dir.x * leafLen * 0.12,
      leafEnd.y + nearPerp.y * leafHalf - dir.y * leafLen * 0.12,
      groundZ + doorHeight * 0.46
    );

    const sunLength = Math.max(1e-6, Math.hypot(SUN_WORLD.x, SUN_WORLD.y));
    const sunUnitWorld = { x: SUN_WORLD.x / sunLength, y: SUN_WORLD.y / sunLength };
    const shadowLength = Math.min(doorHeight * 0.55, leafLen * 0.6);
    const shadow = [
      project(hingeWorld.x, hingeWorld.y, groundZ),
      project(leafEnd.x, leafEnd.y, groundZ),
      project(leafEnd.x - sunUnitWorld.x * shadowLength, leafEnd.y - sunUnitWorld.y * shadowLength, groundZ),
      project(hingeWorld.x - sunUnitWorld.x * shadowLength, hingeWorld.y - sunUnitWorld.y * shadowLength, groundZ)
    ];

    const steps = 12;
    const arc = [];
    const sign = dir.x * nwx + dir.y * nwy >= 0 ? 1 : -1;
    for (let i = 0; i <= steps; i++) {
      const a = (sign * (DOOR_OPEN_ANGLE * i)) / steps;
      const d = rot(a);
      arc.push(project(
        hingeWorld.x + d.x * leafLen,
        hingeWorld.y + d.y * leafLen,
        groundZ
      ));
    }

    swing = {
      near: leafNear,
      far: leafFarShape,
      top: leafTop,
      edgeFree: leafEdgeFree,
      edgeHinge: leafEdgeHinge,
      arc,
      shadow,
      hinge: hingeScreen,
      planks,
      bands,
      hinges,
      handle,
      worldHinge: hingeWorld,
      worldEnd: leafEnd
    };
  }

  const threshold = screenLine(at(t0, nearV, groundZ), at(t1, nearV, groundZ));

  return {
    t0,
    t1,
    doorTopZ,
    frameT,
    frameZ,
    stubStart,
    stubEnd,
    jambStart,
    jambEnd,
    lintelNear,
    lintelFar,
    soffit,
    floor,
    frameNear,
    frameFar,
    aoStart,
    aoEnd,
    leaf,
    swing,
    threshold
  };
}
