import { getTileElevation } from './ElevationUtils';
import { WALL_TYPES } from '../store/levelEditorStore';
import {
  MIN_PROJECTED_TILT_COS,
  getWallBaseWorldZ,
  getWallHeightWorld,
  getWallThickness,
  getWallWorldEndpoints,
  parseWallKey
} from './WallGeometry';

const structureCache = {
  wallData: null,
  elevationData: null,
  gridSystem: null,
  gridType: null,
  gridSize: null,
  structures: []
};

const terrainCache = {
  elevationData: null,
  gridSystem: null,
  gridType: null,
  gridSize: null,
  hasTerrain: false,
  maxZ: 0
};

function buildStructureSnapshot(wallData, elevationData, gridSystem, gridType, gridSize) {
  const structures = [];

  for (const [key, wall] of Object.entries(wallData || {})) {
    if (!wall) continue;
    if (wall.state === 'open') continue;
    const typeId = typeof wall === 'string' ? wall : wall.type;
    const typeData = WALL_TYPES[typeId] || {};
    if (typeData.isWindow) continue;
    if (typeData.blocksLineOfSight === false) continue;

    const parsed = parseWallKey(key);
    if (!parsed) continue;
    const ends = getWallWorldEndpoints(parsed, gridSystem, gridType);
    if (!ends) continue;

    const dx = ends.end.x - ends.start.x;
    const dy = ends.end.y - ends.start.y;
    const length = Math.max(1e-6, Math.hypot(dx, dy));
    const ux = dx / length;
    const uy = dy / length;
    const base = getWallBaseWorldZ({ parsed, wall, gridType, gridSystem, elevationData });
    const heightWorld = getWallHeightWorld(wall, typeData, gridSize);
    const thickness = getWallThickness(gridSize);

    structures.push({
      key,
      start: ends.start,
      ux,
      uy,
      nx: -uy,
      ny: ux,
      length,
      half: thickness / 2,
      baseZ: base.z,
      topZ: base.z + heightWorld
    });
  }

  structureCache.wallData = wallData;
  structureCache.elevationData = elevationData;
  structureCache.gridSystem = gridSystem;
  structureCache.gridType = gridType;
  structureCache.gridSize = gridSize;
  structureCache.structures = structures;
  return structureCache;
}

function getStructureSnapshot(wallData, elevationData, gridSystem, gridType, gridSize) {
  if (
    structureCache.wallData === wallData &&
    structureCache.elevationData === elevationData &&
    structureCache.gridSystem === gridSystem &&
    structureCache.gridType === gridType &&
    structureCache.gridSize === gridSize
  ) {
    return structureCache;
  }
  return buildStructureSnapshot(wallData, elevationData, gridSystem, gridType, gridSize);
}

function buildTerrainSnapshot(elevationData, gridSystem, gridType, gridSize) {
  let hasTerrain = false;
  let maxZ = 0;
  for (const raw of Object.values(elevationData || {})) {
    const level = typeof raw === 'object' && raw !== null ? Number(raw.level || 0) : Number(raw);
    if (!Number.isFinite(level) || level === 0) continue;
    hasTerrain = true;
    const z = level * gridSize;
    if (z > maxZ) maxZ = z;
  }
  terrainCache.elevationData = elevationData;
  terrainCache.gridSystem = gridSystem;
  terrainCache.gridType = gridType;
  terrainCache.gridSize = gridSize;
  terrainCache.hasTerrain = hasTerrain;
  terrainCache.maxZ = maxZ;
  return terrainCache;
}

function getTerrainSnapshot(elevationData, gridSystem, gridType, gridSize) {
  if (
    terrainCache.elevationData === elevationData &&
    terrainCache.gridSystem === gridSystem &&
    terrainCache.gridType === gridType &&
    terrainCache.gridSize === gridSize
  ) {
    return terrainCache;
  }
  return buildTerrainSnapshot(elevationData, gridSystem, gridType, gridSize);
}

function getRay(gridSystem) {
  const transform = gridSystem.getProjectionTransform(0, 0);
  if (transform.cosTilt < MIN_PROJECTED_TILT_COS) return null;
  const cot = transform.cosTilt / transform.sinTilt;
  return {
    dirX: -transform.sinYaw * cot,
    dirY: transform.cosYaw * cot
  };
}

function resolvePointZ(worldX, worldY, worldZ, elevationData, gridSystem) {
  if (Number.isFinite(worldZ)) return worldZ;
  if (!elevationData || !gridSystem) return 0;
  const tile = gridSystem.worldToGrid(worldX, worldY);
  const { gridSize = 50 } = gridSystem.getGridState();
  return getTileElevation(elevationData, tile.x, tile.y) * gridSize;
}

function zRangeForLocalAxis(origin, delta, min, max) {
  if (Math.abs(delta) < 1e-9) {
    return origin >= min && origin <= max ? [-Infinity, Infinity] : null;
  }
  const z1 = (min - origin) / delta;
  const z2 = (max - origin) / delta;
  return [Math.min(z1, z2), Math.max(z1, z2)];
}

function rayHitsWall(px, py, pz, dirX, dirY, wall) {
  if (wall.topZ <= pz + 0.01) return false;
  const relX = px - wall.start.x;
  const relY = py - wall.start.y;
  const u0 = relX * wall.ux + relY * wall.uy;
  const v0 = relX * wall.nx + relY * wall.ny;
  const du = dirX * wall.ux + dirY * wall.uy;
  const dv = dirX * wall.nx + dirY * wall.ny;

  const zLow = Math.max(pz, wall.baseZ);
  const zHigh = wall.topZ;
  if (zHigh <= zLow) return false;

  const uRange = zRangeForLocalAxis(u0, du, 0, wall.length);
  if (!uRange) return false;
  const vRange = zRangeForLocalAxis(v0, dv, -wall.half - 0.01, wall.half + 0.01);
  if (!vRange) return false;

  const lo = Math.max(zLow, uRange[0], vRange[0]);
  const hi = Math.min(zHigh, uRange[1], vRange[1]);
  return lo <= hi;
}

function wallContainsPoint(px, py, wall, tolerance = 0.5) {
  const relX = px - wall.start.x;
  const relY = py - wall.start.y;
  const u = relX * wall.ux + relY * wall.uy;
  if (u < -tolerance || u > wall.length + tolerance) return false;
  const v = relX * wall.nx + relY * wall.ny;
  return Math.abs(v) <= wall.half + tolerance;
}

function rayHitsTerrain(px, py, pz, dirX, dirY, elevationData, gridSystem, maxZ) {
  const { gridSize = 50 } = gridSystem.getGridState();
  if (Math.abs(dirX) < 1e-9 && Math.abs(dirY) < 1e-9) return false;
  if (maxZ <= pz + 0.01) return false;

  let cell = gridSystem.worldToGrid(px, py);
  let x = px;
  let y = py;
  let z = pz;
  const zCap = Math.max(maxZ, pz) + 1;

  for (let step = 0; step < 64 && z < zCap; step++) {
    const corner = gridSystem.gridToWorldCorner(cell.x, cell.y);
    const minX = corner.x;
    const maxX = corner.x + gridSize;
    const minY = corner.y;
    const maxY = corner.y + gridSize;

    const tx = dirX > 1e-9 ? (maxX - x) / dirX : dirX < -1e-9 ? (minX - x) / dirX : Infinity;
    const ty = dirY > 1e-9 ? (maxY - y) / dirY : dirY < -1e-9 ? (minY - y) / dirY : Infinity;
    const advance = Math.min(tx, ty);
    if (!Number.isFinite(advance)) break;

    x += dirX * advance;
    y += dirY * advance;
    z += advance;

    if (advance === tx) cell = { x: cell.x + (dirX > 0 ? 1 : -1), y: cell.y };
    if (advance === ty) cell = { x: cell.x, y: cell.y + (dirY > 0 ? 1 : -1) };

    const level = getTileElevation(elevationData, cell.x, cell.y);
    const topZ = level * gridSize;
    if (topZ >= z - 0.01) return true;
  }

  return false;
}

export function isWorldPointBehindWalls({
  worldX,
  worldY,
  worldZ,
  wallData,
  elevationData,
  gridSystem,
  ignoreEmbeddedWalls = false
}) {
  if (!wallData || !gridSystem) return false;
  if (!Number.isFinite(worldX) || !Number.isFinite(worldY)) return false;

  const ray = getRay(gridSystem);
  if (!ray) return false;

  const { gridSize = 50, gridType = 'square' } = gridSystem.getGridState();
  const pz = resolvePointZ(worldX, worldY, worldZ, elevationData, gridSystem);
  const snapshot = getStructureSnapshot(wallData, elevationData, gridSystem, gridType, gridSize);

  for (const structure of snapshot.structures) {
    // A point inside a wall footprint sits *on* the wall (e.g. a mounted
    // torch); that wall must not occlude it. Other walls still apply.
    if (ignoreEmbeddedWalls && wallContainsPoint(worldX, worldY, structure)) continue;
    if (rayHitsWall(worldX, worldY, pz, ray.dirX, ray.dirY, structure)) return true;
  }
  return false;
}

export function isWorldPointBehindElevatedTerrain({
  worldX,
  worldY,
  worldZ,
  elevationData,
  gridSystem
}) {
  if (!elevationData || !gridSystem) return false;
  if (!Number.isFinite(worldX) || !Number.isFinite(worldY)) return false;

  const ray = getRay(gridSystem);
  if (!ray) return false;

  const { gridSize = 50, gridType = 'square' } = gridSystem.getGridState();
  const snapshot = getTerrainSnapshot(elevationData, gridSystem, gridType, gridSize);
  if (!snapshot.hasTerrain) return false;

  const pz = resolvePointZ(worldX, worldY, worldZ, elevationData, gridSystem);
  return rayHitsTerrain(worldX, worldY, pz, ray.dirX, ray.dirY, elevationData, gridSystem, snapshot.maxZ);
}

export function isWorldPointOccluded({
  worldX,
  worldY,
  worldZ,
  wallData,
  elevationData,
  gridSystem,
  ignoreEmbeddedWalls = false
}) {
  if (isWorldPointBehindWalls({ worldX, worldY, worldZ, wallData, elevationData, gridSystem, ignoreEmbeddedWalls })) {
    return true;
  }
  return isWorldPointBehindElevatedTerrain({ worldX, worldY, worldZ, elevationData, gridSystem });
}

export function isWorldAreaPartiallyOccluded({
  worldX,
  worldY,
  worldZ,
  radiusWorld = 20,
  wallData,
  elevationData,
  gridSystem,
  samples = 8
}) {
  if (!gridSystem) return false;
  const pz = resolvePointZ(worldX, worldY, worldZ, elevationData, gridSystem);

  if (isWorldPointOccluded({ worldX, worldY, worldZ: pz, wallData, elevationData, gridSystem })) {
    return true;
  }

  for (let i = 0; i < samples; i++) {
    const angle = (i / samples) * Math.PI * 2;
    const sampleX = worldX + Math.cos(angle) * radiusWorld;
    const sampleY = worldY + Math.sin(angle) * radiusWorld;
    if (isWorldPointOccluded({ worldX: sampleX, worldY: sampleY, worldZ: pz, wallData, elevationData, gridSystem })) {
      return true;
    }
  }

  return false;
}
