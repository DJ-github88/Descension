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

export function getWallThickness(gridSize, transform) {
  const zoom = transform?.effectiveZoom || 1;
  return Math.max(6, (gridSize || 50) * zoom * 0.15);
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

export function getWallWorldEndpoints(parsed, gridSystem, gridType) {
  if (gridType === 'hex') {
    const edge = gridSystem.getHexEdge(parsed.x1, parsed.y1, parsed.x2, parsed.y2);
    if (!edge || !edge.start || !edge.end) return null;
    return { start: edge.start, end: edge.end };
  }
  return {
    start: gridSystem.gridToWorldCorner(parsed.x1, parsed.y1),
    end: gridSystem.gridToWorldCorner(parsed.x2, parsed.y2)
  };
}

function adjacentTileCoords(parsed, gridType) {
  const { x1, y1, x2, y2 } = parsed;
  if (gridType === 'hex') {
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
    return { start: z, end: z, z };
  }
  const coords = adjacentTileCoords(parsed, gridType);
  const sample = (list) => {
    let highest = -Infinity;
    for (const [tx, ty] of list) {
      const level = getTileElevation(elevationData, tx, ty);
      if (level > highest) highest = level;
    }
    return Number.isFinite(highest) ? highest * gridSize : 0;
  };
  const startZ = sample(coords.start);
  const endZ = sample(coords.end);
  return { start: startZ, end: endZ, z: Math.max(startZ, endZ) };
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
    const ends = getWallWorldEndpoints(parsed, gridSystem, gridType);
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
      entry.unitVectors.push({ x: dxWorld / runLength, y: dyWorld / runLength });
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
      top: SUN_WORLD.z
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
  connectedEnd = false
}) {
  const parsed = parseWallKey(key);
  if (!parsed) return null;
  const ends = getWallWorldEndpoints(parsed, gridSystem, gridType);
  if (!ends) return null;

  const { start, end } = ends;
  const { gridSize = 50 } = gridSystem.getGridState();
  const thickness = getWallThickness(gridSize, transform);
  const base = getWallBaseWorldZ({ parsed, wall, gridType, gridSystem, elevationData });
  const heightWorld = getWallHeightWorld(wall, typeData, gridSize);
  const baseZStart = base.start - WALL_BASE_SINK_WORLD;
  const baseZEnd = base.end - WALL_BASE_SINK_WORLD;
  const topZ = base.z + heightWorld;

  const typeId = typeof wall === 'string' ? wall : wall.type;
  const isDoor = !!typeData?.interactive;
  const isWindow = !!typeData?.isWindow;
  const isOpen = wall.state === 'open';
  const isMagic = !isDoor && !isWindow && typeData?.blocksLineOfSight === false;
  const color = typeData?.color || '#8a827a';

  const rawDx = end.x - start.x;
  const rawDy = end.y - start.y;
  const rawLength = Math.max(1e-6, Math.hypot(rawDx, rawDy));
  const rawUx = rawDx / rawLength;
  const rawUy = rawDy / rawLength;
  const joinExtension = thickness * WALL_JOIN_EXTENSION_FACTOR;
  const prismStart = connectedStart
    ? { x: start.x - rawUx * joinExtension, y: start.y - rawUy * joinExtension }
    : start;
  const prismEnd = connectedEnd
    ? { x: end.x + rawUx * joinExtension, y: end.y + rawUy * joinExtension }
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

  const patternId = (!isDoor && !isWindow && !isOpen && !isMagic)
    ? `svgWallPat-${typeId || 'stone_wall'}`
    : null;

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
    heightWorld,
    topZ,
    baseZStart,
    baseZEnd,
    worldStart: start,
    worldEnd: end,
    ...core,
    patternId,
    pattern: patternId
      ? {
          id: patternId,
          angle: 0,
          type: typeId,
          color,
          size: Math.max(48, Math.min(160, Math.round(gridSize * transform.effectiveZoom * 0.9)))
        }
      : null,
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
    ? { t0: 0.42, t1: 0.58, sill: 0.34, head: 0.86 }
    : { t0: 0.16, t1: 0.84, sill: 0.24, head: 0.84 };

  const { at, nearSide, half, heightWorld, topZ, localBaseZ } = item;
  const nearV = nearSide * half;
  const farV = -nearV;
  const t0 = spec.t0;
  const t1 = spec.t1;
  const sillZ = groundZ + heightWorld * spec.sill;
  const headZ = groundZ + heightWorld * spec.head;

  const breastNear = [
    at(0, nearV, localBaseZ(0)),
    at(1, nearV, localBaseZ(1)),
    at(1, nearV, sillZ),
    at(0, nearV, sillZ)
  ];
  const breastFar = [
    at(0, farV, localBaseZ(0)),
    at(1, farV, localBaseZ(1)),
    at(1, farV, sillZ),
    at(0, farV, sillZ)
  ];
  const sillTop = [
    at(0, half, sillZ),
    at(1, half, sillZ),
    at(1, -half, sillZ),
    at(0, -half, sillZ)
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
  const jambStart = [
    at(t0, half, sillZ),
    at(t0, -half, sillZ),
    at(t0, -half, headZ),
    at(t0, half, headZ)
  ];
  const jambEnd = [
    at(t1, half, sillZ),
    at(t1, -half, sillZ),
    at(t1, -half, headZ),
    at(t1, half, headZ)
  ];

  const isGlass = kind === 'glass';
  const isOpenWindow = kind === 'open';
  const pane = isGlass
    ? [
        at(t0 + 0.015, nearV * 0.25, sillZ + 2),
        at(t1 - 0.015, nearV * 0.25, sillZ + 2),
        at(t1 - 0.015, nearV * 0.25, headZ - 2),
        at(t0 + 0.015, nearV * 0.25, headZ - 2)
      ]
    : null;

  const interior = (kind === 'barred' || kind === 'slit' || isOpenWindow)
    ? [
        at(t0, farV * 0.45, sillZ),
        at(t1, farV * 0.45, sillZ),
        at(t1, farV * 0.45, headZ),
        at(t0, farV * 0.45, headZ)
      ]
    : null;

  const mullions = [];
  const bars = [];
  if (isGlass) {
    const midT = (t0 + t1) / 2;
    mullions.push(screenLine(at(midT, nearV * 0.3, sillZ), at(midT, nearV * 0.3, headZ)));
    const midZ = (sillZ + headZ) / 2;
    mullions.push(screenLine(at(t0, nearV * 0.3, midZ), at(t1, nearV * 0.3, midZ)));
  }
  if (kind === 'barred') {
    const count = 5;
    for (let i = 1; i < count; i++) {
      const t = t0 + ((t1 - t0) * i) / count;
      bars.push(screenLine(at(t, nearV * 0.15, sillZ), at(t, nearV * 0.15, headZ)));
    }
    const crossZ = (sillZ + headZ) / 2;
    bars.push(screenLine(at(t0, nearV * 0.15, crossZ), at(t1, nearV * 0.15, crossZ)));
  }

  return {
    kind,
    boundaries: { t0, t1, sillZ, headZ },
    breastNear,
    breastFar,
    sillTop,
    lintelNear,
    lintelFar,
    jambStart,
    jambEnd,
    pane,
    interior,
    mullions,
    bars,
    sillEdge: screenLine(at(0, nearV, sillZ), at(1, nearV, sillZ)),
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
  const doorHeight = heightWorld * 0.88;
  const doorTopZ = groundZ + doorHeight;
  const t0 = 0.1;
  const t1 = 0.9;

  const jambStart = [
    at(t0, half, localBaseZ(t0)),
    at(t0, -half, localBaseZ(t0)),
    at(t0, -half, topZ),
    at(t0, half, topZ)
  ];
  const jambEnd = [
    at(t1, half, localBaseZ(t1)),
    at(t1, -half, localBaseZ(t1)),
    at(t1, -half, topZ),
    at(t1, half, topZ)
  ];
  const lintelNear = [
    at(t0, nearV, doorTopZ),
    at(t1, nearV, doorTopZ),
    at(t1, nearV, topZ),
    at(t0, nearV, topZ)
  ];
  const lintelFar = [
    at(t0, farV, doorTopZ),
    at(t1, farV, doorTopZ),
    at(t1, farV, topZ),
    at(t0, farV, topZ)
  ];

  const isOpen = wall.state === 'open';
  let leaf = null;
  let swing = null;

  if (!isOpen) {
    const leafV = nearV * 0.45;
    const leafFace = [
      at(t0, leafV, localBaseZ(t0)),
      at(t1, leafV, localBaseZ(t1)),
      at(t1, leafV, doorTopZ),
      at(t0, leafV, doorTopZ)
    ];
    const planks = [0.3, 0.5, 0.7].map((f) => {
      const t = t0 + (t1 - t0) * f;
      return screenLine(at(t, leafV, localBaseZ(t)), at(t, leafV, doorTopZ));
    });
    const bands = [0.28, 0.74].map((f) => {
      const z = groundZ + doorHeight * f;
      return screenLine(at(t0 + 0.01, leafV, z), at(t1 - 0.01, leafV, z));
    });
    const midT = (t0 + t1) / 2;
    const handle = at(midT + 0.06, leafV * 1.2, groundZ + doorHeight * 0.5);
    const lock = at(midT - 0.07, leafV * 1.2, groundZ + doorHeight * 0.52);
    leaf = { face: leafFace, planks, bands, handle, lock };
  } else {
    const hingeT = 0.08;
    const hingeWorld = {
      x: worldStart.x + ux * runLength * hingeT + nwx * half * 0.45,
      y: worldStart.y + uy * runLength * hingeT + nwy * half * 0.45
    };
    const hingeScreen = project(hingeWorld.x, hingeWorld.y, groundZ);
    const rot = (a) => ({
      x: ux * Math.cos(a) - uy * Math.sin(a),
      y: ux * Math.sin(a) + uy * Math.cos(a)
    });
    let dir = rot(DOOR_OPEN_ANGLE);
    if ((dir.x * nwx + dir.y * nwy) * nearSide < 0) dir = rot(-DOOR_OPEN_ANGLE);
    const leafLen = runLength * 0.78;
    const leafEnd = {
      x: hingeWorld.x + dir.x * leafLen,
      y: hingeWorld.y + dir.y * leafLen
    };
    const rawPerp = { x: -dir.y, y: dir.x };
    const toward = rawPerp.x * viewX + rawPerp.y * viewY >= 0 ? 1 : -1;
    const nearPerp = { x: rawPerp.x * toward, y: rawPerp.y * toward };
    const farPerp = { x: -nearPerp.x, y: -nearPerp.y };
    const leafHalf = thickness * 0.16;

    const nearA = { x: hingeWorld.x + nearPerp.x * leafHalf, y: hingeWorld.y + nearPerp.y * leafHalf };
    const nearB = { x: leafEnd.x + nearPerp.x * leafHalf, y: leafEnd.y + nearPerp.y * leafHalf };
    const farB = { x: leafEnd.x + farPerp.x * leafHalf, y: leafEnd.y + farPerp.y * leafHalf };
    const farA = { x: hingeWorld.x + farPerp.x * leafHalf, y: hingeWorld.y + farPerp.y * leafHalf };

    const leafNear = [
      project(nearA.x, nearA.y, groundZ),
      project(nearB.x, nearB.y, groundZ),
      project(nearB.x, nearB.y, doorTopZ),
      project(nearA.x, nearA.y, doorTopZ)
    ];
    const leafFar = [
      project(farA.x, farA.y, groundZ),
      project(farB.x, farB.y, groundZ),
      project(farB.x, farB.y, doorTopZ),
      project(farA.x, farA.y, doorTopZ)
    ];
    const leafTop = [
      project(nearA.x, nearA.y, doorTopZ),
      project(nearB.x, nearB.y, doorTopZ),
      project(farB.x, farB.y, doorTopZ),
      project(farA.x, farA.y, doorTopZ)
    ];

    const planks = [0.25, 0.5, 0.75].map((f) => {
      const wx = hingeWorld.x + dir.x * leafLen * f + nearPerp.x * leafHalf;
      const wy = hingeWorld.y + dir.y * leafLen * f + nearPerp.y * leafHalf;
      return screenLine(project(wx, wy, groundZ), project(wx, wy, doorTopZ));
    });
    const bands = [0.28, 0.72].map((f) => {
      const z = groundZ + doorHeight * f;
      const a = project(
        hingeWorld.x + nearPerp.x * leafHalf,
        hingeWorld.y + nearPerp.y * leafHalf,
        z
      );
      const b = project(
        leafEnd.x + nearPerp.x * leafHalf,
        leafEnd.y + nearPerp.y * leafHalf,
        z
      );
      return screenLine(a, b);
    });

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

    swing = { near: leafNear, far: leafFar, top: leafTop, arc, hinge: hingeScreen, planks, bands };
  }

  const threshold = screenLine(at(t0, nearV, localBaseZ(t0)), at(t1, nearV, localBaseZ(t1)));

  return {
    t0,
    t1,
    doorTopZ,
    jambStart,
    jambEnd,
    lintelNear,
    lintelFar,
    leaf,
    swing,
    threshold
  };
}
