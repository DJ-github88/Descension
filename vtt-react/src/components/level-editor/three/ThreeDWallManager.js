import * as THREE from 'three';
import modelCache from '../../../services/ModelCacheService';
import { WALL_TYPES } from '../../../store/levelEditorStore';
import {
  parseWallKey,
  getWallWorldEndpoints,
  getWallBodyHeightWorld,
  WALL_HEIGHT_MULTIPLIERS
} from '../../../utils/WallGeometry';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';
import { getTileElevation } from '../../../utils/ElevationUtils';
import {
  WALL_EXPLORED_OPACITY,
  createTileKeyResolver,
  fogProbeOffset,
  fogSamplesAlongSegment,
  fogSamplesAroundPoint,
  resolveSampleFogVisibility
} from './fogVisibility';

export const WALL_MODELS = {
  straight: '/assets/models/dungeon/wall_stone_straight.glb',
  window_open: '/assets/models/dungeon/wall_window_open.glb',
  window_gated: '/assets/models/dungeon/wall_window_gated.glb',
  window_closed: '/assets/models/dungeon/wall_window_closed.glb',
  cracked: '/assets/models/dungeon/wall_cracked.glb',
  broken: '/assets/models/dungeon/wall_broken.glb',
  arched: '/assets/models/dungeon/wall_arched.glb',
  half: '/assets/models/dungeon/wall_half.glb',
  shelves: '/assets/models/dungeon/wall_shelves.glb',
  barrier: '/assets/models/dungeon/barrier_wood.glb',
  barrier_corner: '/assets/models/dungeon/barrier_corner.glb',
  gated: '/assets/models/dungeon/wall_gated.glb',
  pillar: '/assets/models/dungeon/wall_pillar.glb',
  corner: '/assets/models/dungeon/wall_corner.glb',
  tsplit: '/assets/models/dungeon/wall_tsplit.glb',
  crossing: '/assets/models/dungeon/wall_crossing.glb',
  endcap: '/assets/models/dungeon/wall_endcap.glb'
};

// Every wall/junction model in the modular kit is authored 4 units long, 4 units
// tall and 1 unit thick (pillar: 1.5). Scale is derived from that unit size.
export const WALL_MODEL_UNIT = 4;

const JUNCTION_MODEL_BY_TYPE = {
  corner: WALL_MODELS.corner,
  tsplit: WALL_MODELS.tsplit,
  crossing: WALL_MODELS.crossing,
  endcap: WALL_MODELS.endcap
};

// Pre-load all wall models into cache
Object.values(WALL_MODELS).forEach(url => modelCache.loadModel(url).catch(() => {}));

const QUANT_EPSILON = 1e-6;

const WHITE = new THREE.Color(0xffffff);

function quantizeDirection(dx, dy) {
  if (Math.abs(dx) < QUANT_EPSILON && Math.abs(dy) < QUANT_EPSILON) return null;
  const x = Math.abs(dx) < QUANT_EPSILON ? 0 : Math.sign(dx);
  const y = Math.abs(dy) < QUANT_EPSILON ? 0 : Math.sign(dy);
  if (x !== 0 && y !== 0) return { x: 0, y: 0, diagonal: true };
  return { x, y, diagonal: false };
}

function opposite(a, b) {
  return a.x === -b.x && a.y === -b.y;
}

export class ThreeDWallManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'ThreeDModularWalls';
    this.scene.add(this.group);

    this.wallInstances = new Map(); // wallKey -> { key, modelUrl, group, pieces: [...] }
    this.junctionInstances = new Map(); // vertexKey -> { key, modelUrl, group, model }
  }

  resolveWallModelUrl(wall) {
    const typeId = (typeof wall === 'string' ? wall : wall?.type) || 'stone_wall';
    const typeLower = String(typeId).toLowerCase();

    if (typeLower.includes('half')) {
      return WALL_MODELS.half;
    }
    if (typeLower.includes('arch')) {
      return WALL_MODELS.arched;
    }
    if (typeLower.includes('shel')) {
      return WALL_MODELS.shelves;
    }
    if (typeLower.includes('barrier') || typeLower.includes('palisade')) {
      return WALL_MODELS.barrier;
    }
    if (typeLower.includes('window')) {
      if (typeLower.includes('bar') || typeLower.includes('gate')) {
        return WALL_MODELS.window_gated;
      }
      if (typeLower.includes('close') || typeLower.includes('glass')) {
        return WALL_MODELS.window_closed;
      }
      return WALL_MODELS.window_open;
    }

    if (typeLower.includes('broken') || typeLower.includes('ruin')) {
      return WALL_MODELS.broken;
    }

    if (typeLower.includes('crack')) {
      return WALL_MODELS.cracked;
    }

    if (typeLower.includes('gate') || typeLower.includes('portcullis')) {
      return WALL_MODELS.gated;
    }

    // Default straight stone wall
    return WALL_MODELS.straight;
  }

  isDoorWall(wall) {
    const typeId = (typeof wall === 'string' ? wall : wall?.type) || '';
    if (wall && typeof wall === 'object' && wall.isWallDoor) return true;
    const typeData = WALL_TYPES[typeId] || {};
    return !!typeData.interactive || String(typeId).toLowerCase().includes('door');
  }

  /**
   * Tint/normalise a wall type onto the shared stone models so wooden, brick
   * and metal walls read as different materials in 3D. Magical/force barriers
   * are translucent and emissive, matching their 2.5D treatment.
   */
  resolveWallAppearance(wall) {
    const typeId = (typeof wall === 'string' ? wall : wall?.type) || 'stone_wall';
    const typeData = WALL_TYPES[typeId] || {};
    if (typeData.isWindow || typeData.interactive) return null;
    if (!typeData.color || typeId === 'stone_wall') return null;
    // Only a light lift toward white keeps the type identifiable: a heavier
    // lerp washed the tints out entirely against the grey masonry texture.
    const tint = new THREE.Color(typeData.color).lerp(WHITE, 0.15);
    const translucent = typeData.blocksLineOfSight === false;
    return {
      tint,
      baseOpacity: translucent ? 0.6 : 1,
      emissive: translucent ? new THREE.Color(typeData.color).multiplyScalar(0.35) : null,
      key: `${typeId}:${Math.round(tint.r * 255)},${Math.round(tint.g * 255)},${Math.round(tint.b * 255)}:${translucent ? 0.6 : 1}`
    };
  }

  resolveElevationZ(wall, parsed, elevationData, gridSize) {
    let elevation = wall && typeof wall === 'object' ? wall.elevation : undefined;
    if (!Number.isFinite(elevation)) {
      const midGridX = Math.floor((parsed.x1 + parsed.x2) / 2);
      const midGridY = Math.floor((parsed.y1 + parsed.y2) / 2);
      elevation = getTileElevation(elevationData, midGridX, midGridY) || 0;
    }
    return elevation * (gridSize * 0.5);
  }

  /**
   * Split one wall record into renderable model pieces.
   *
   * Square-grid axis-aligned walls are emitted as one model per grid tile so a
   * wall key that spans several tiles (or gets re-partitioned when a
   * door/window is placed) renders identically and the masonry never stretches.
   * Everything else (diagonals, hex chords, odd lengths) is subdivided into
   * roughly one-tile-long segments for the same reason: the texture repeats
   * per piece instead of smearing across the whole run.
   */
  computeWallPieces({ start, end, gridSize, heightWorld, baseZ, gridType }) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length < 1e-4) return [];

    const scalePlan = gridSize / WALL_MODEL_UNIT;
    const scaleY = heightWorld / WALL_MODEL_UNIT;
    const rotationZ = Math.atan2(-dy, dx);
    const axisAligned = Math.abs(dx) < QUANT_EPSILON || Math.abs(dy) < QUANT_EPSILON;
    const tileCount = Math.round(length / gridSize);
    const tileExact = Math.abs(length - tileCount * gridSize) <= gridSize * 0.02;

    let segments = 0;
    if (gridType !== 'hex' && axisAligned && tileCount >= 1 && tileExact) {
      segments = tileCount;
    } else {
      // Repeat the model at ~one-tile intervals. `round` keeps ordinary runs
      // within a few percent of the authored scale; only very short diagonals
      // end up with a mildly oversized single piece.
      segments = Math.max(1, Math.round(length / gridSize));
    }

    const pieceLength = length / segments;
    const ux = dx / length;
    const uy = dy / length;
    const probeOffset = fogProbeOffset(gridSize);
    const pieces = [];
    for (let i = 0; i < segments; i += 1) {
      const t = (i + 0.5) / segments;
      const centerX = start.x + dx * t;
      const centerY = start.y + dy * t;
      pieces.push({
        x: centerX,
        y: centerY,
        z: baseZ,
        rotationZ,
        scaleX: pieceLength / WALL_MODEL_UNIT,
        scaleY,
        scaleZ: scalePlan,
        // Probes on both sides of the wall so piece visibility never depends
        // on which side a boundary-sitting Math.floor lands.
        fogSamples: fogSamplesAlongSegment({
          centerX,
          centerY,
          ux,
          uy,
          halfLength: pieceLength / 2,
          offset: probeOffset
        })
      });
    }
    return pieces;
  }

  /**
   * Decide which modular junction piece (if any) belongs at a vertex.
   * Returns null for straight-through joints, which already meet cleanly.
   */
  resolveJunction(dirs, hasDoor) {
    if (dirs.some((d) => d.diagonal)) return null;
    const unique = [];
    for (const d of dirs) {
      if (!unique.some((u) => u.x === d.x && u.y === d.y)) unique.push(d);
    }
    if (unique.length === 4) {
      return { kind: 'crossing', rotation: 0 };
    }
    if (unique.length === 3) {
      const through = unique.find((a) => unique.some((b) => b !== a && opposite(a, b)));
      const stem = through
        ? unique.find((a) => a !== through && !opposite(a, through))
        : null;
      if (!through || !stem) return null;
      return { kind: 'tsplit', rotation: Math.atan2(stem.x, stem.y) };
    }
    if (unique.length === 2) {
      const [a, b] = unique;
      if (opposite(a, b)) return null;
      // Corner model arms are local -X and local +Z. Find the yaw that maps
      // them onto the two incident directions.
      const rotA = Math.atan2(a.y, -a.x);
      const mappedB = { x: a.y, y: -a.x };
      const rotation = mappedB.x === b.x && mappedB.y === b.y
        ? rotA
        : Math.atan2(b.y, -b.x);
      return { kind: 'corner', rotation };
    }
    if (unique.length === 1) {
      if (hasDoor) return null;
      const incident = unique[0];
      // The cap is placed at the free end and extends along local +X INTO the
      // wall (the endcap model spans x in [0, 1.067] from its origin).
      return { kind: 'endcap', rotation: Math.atan2(-incident.y, incident.x) };
    }
    return null;
  }

  updateWalls(wallData = {}, elevationData = {}, gridState = {}, fogState = {}) {
    const { gridSize = 50, gridOffsetX = 0, gridOffsetY = 0 } = gridState;
    const {
      fogOfWarEnabled = false,
      isEditorMode = false,
      isGMMode = false,
      viewingFromToken = false,
      isPlayerPositionExplored = null,
      visibleAreaSet = null
    } = fogState;

    const isFogActive = fogOfWarEnabled && !isEditorMode && (!isGMMode || viewingFromToken);

    let gridSystem = null;
    try {
      gridSystem = getGridSystem();
    } catch (e) {
      gridSystem = null;
    }
    const { gridType = 'square' } = gridSystem ? gridSystem.getGridState() : {};
    const tileKeyAt = createTileKeyResolver(gridSystem, gridSize, gridOffsetX, gridOffsetY);
    const probeOffset = fogProbeOffset(gridSize);

    const currentWallKeys = new Set();
    const dirsByVertex = new Map(); // "x,y" -> { x, y, dirs: [], hasDoor: bool }
    const wallRecords = [];

    for (const [key, wall] of Object.entries(wallData || {})) {
      if (!wall) continue;
      const parsed = parseWallKey(key);
      if (!parsed) continue;

      const ends = gridSystem
        ? getWallWorldEndpoints(parsed, gridSystem, gridType, wall)
        : {
            start: { x: parsed.x1 * gridSize + gridOffsetX, y: parsed.y1 * gridSize + gridOffsetY },
            end: { x: parsed.x2 * gridSize + gridOffsetX, y: parsed.y2 * gridSize + gridOffsetY }
          };
      if (!ends || !ends.start || !ends.end) continue;

      const isDoor = this.isDoorWall(wall);
      wallRecords.push({ key, wall, parsed, ends, isDoor });

      // Junction analysis includes doors: their doorway model occupies the tile,
      // so neighbouring walls must not cap themselves against the opening.
      for (const [here, there] of [[ends.start, ends.end], [ends.end, ends.start]]) {
        const vertexKey = `${Math.round(here.x)},${Math.round(here.y)}`;
        let vertex = dirsByVertex.get(vertexKey);
        if (!vertex) {
          vertex = { x: here.x, y: here.y, dirs: [], hasDoor: false };
          dirsByVertex.set(vertexKey, vertex);
        }
        if (isDoor) vertex.hasDoor = true;
        const dir = quantizeDirection(there.x - here.x, there.y - here.y);
        if (dir) vertex.dirs.push(dir);
      }
    }

    // 1. Wall segments (one model per tile when the run is axis-aligned/tile-exact)
    for (const { key, wall, parsed, ends, isDoor } of wallRecords) {
      // Doors are rendered by ThreeDPropManager with interactive swing hinges
      if (isDoor) continue;

      currentWallKeys.add(key);
      const modelUrl = this.resolveWallModelUrl(wall);
      const appearance = this.resolveWallAppearance(wall);
      const heightWorld = getWallBodyHeightWorld(wall, gridSize);
      const baseZ = this.resolveElevationZ(wall, parsed, elevationData, gridSize);
      const pieces = this.computeWallPieces({
        start: ends.start,
        end: ends.end,
        gridSize,
        heightWorld,
        baseZ,
        gridType
      });
      if (pieces.length === 0) continue;

      let entry = this.wallInstances.get(key);
      if (entry && (entry.modelUrl !== modelUrl || entry.appearanceKey !== (appearance?.key || null))) {
        this.group.remove(entry.group);
        this.wallInstances.delete(key);
        entry = null;
      }
      if (!entry) {
        entry = {
          key,
          modelUrl,
          appearanceKey: appearance?.key || null,
          group: new THREE.Group(),
          pieces: []
        };
        entry.group.name = `3dwall_${key}`;
        this.group.add(entry.group);
        this.wallInstances.set(key, entry);
      }

      this.syncPieces(entry, pieces, modelUrl, appearance, {
        wallKey: key,
        x1: parsed.x1,
        y1: parsed.y1,
        x2: parsed.x2,
        y2: parsed.y2
      });

      for (let i = 0; i < entry.pieces.length; i += 1) {
        const piece = entry.pieces[i];
        const fog = this.resolveFogVisibility(pieces[i]?.fogSamples, {
          isFogActive,
          isPlayerPositionExplored,
          visibleAreaSet,
          tileKeyAt
        });
        this.applyPieceState(piece, fog);
      }
    }

    // Remove deleted wall segments
    for (const [key, entry] of this.wallInstances.entries()) {
      if (!currentWallKeys.has(key)) {
        this.group.remove(entry.group);
        this.wallInstances.delete(key);
      }
    }

    // 2. Junction pieces (corners, T-splits, crossings, end caps)
    const currentJunctionKeys = new Set();
    for (const [vertexKey, vertex] of dirsByVertex.entries()) {
      const junction = this.resolveJunction(vertex.dirs, vertex.hasDoor);
      if (!junction) continue;

      currentJunctionKeys.add(vertexKey);
      const modelUrl = JUNCTION_MODEL_BY_TYPE[junction.kind];
      if (!modelUrl) continue;

      let entry = this.junctionInstances.get(vertexKey);
      if (entry && entry.modelUrl !== modelUrl) {
        this.group.remove(entry.group);
        this.junctionInstances.delete(vertexKey);
        entry = null;
      }
      if (!entry) {
        const innerModel = modelCache.createInstance(modelUrl);
        if (!innerModel) continue; // Still loading in background
        innerModel.rotation.x = Math.PI / 2;

        const junctionGroup = new THREE.Group();
        junctionGroup.name = `3djunction_${junction.kind}_${vertexKey}`;
        junctionGroup.add(innerModel);
        innerModel.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        entry = { key: vertexKey, kind: junction.kind, modelUrl, group: junctionGroup, innerModel };
        this.junctionInstances.set(vertexKey, entry);
        this.group.add(junctionGroup);
      }

      const scalePlan = gridSize / WALL_MODEL_UNIT;
      const heightWorld = WALL_HEIGHT_MULTIPLIERS.wall * gridSize;
      entry.group.position.set(
        vertex.x,
        -vertex.y,
        this.resolveJunctionBaseZ(vertex, elevationData, gridSize, gridOffsetX, gridOffsetY)
      );
      entry.group.rotation.z = junction.rotation;
      entry.innerModel.scale.set(scalePlan, heightWorld / WALL_MODEL_UNIT, scalePlan);

      const fog = this.resolveFogVisibility(fogSamplesAroundPoint(vertex.x, vertex.y, probeOffset), {
        isFogActive,
        isPlayerPositionExplored,
        visibleAreaSet,
        tileKeyAt
      });
      this.applyPieceState({ mesh: entry.group, innerModel: entry.innerModel }, fog);
    }

    // Remove obsolete junction pieces
    for (const [vertexKey, entry] of this.junctionInstances.entries()) {
      if (!currentJunctionKeys.has(vertexKey)) {
        this.group.remove(entry.group);
        this.junctionInstances.delete(vertexKey);
      }
    }
  }

  resolveJunctionBaseZ(vertex, elevationData, gridSize, gridOffsetX = 0, gridOffsetY = 0) {
    const gx = Math.floor((vertex.x - gridOffsetX) / gridSize);
    const gy = Math.floor((vertex.y - gridOffsetY) / gridSize);
    const elevation = getTileElevation(elevationData, gx, gy) || 0;
    return elevation * (gridSize * 0.5);
  }

  resolveFogVisibility(samples, { isFogActive, isPlayerPositionExplored, visibleAreaSet, tileKeyAt }) {
    // Explored-but-not-visible walls stay fairly solid: at 0.45 the 3D run
    // dissolved under the fog tint and read as "walls vanished".
    return resolveSampleFogVisibility(samples, {
      isFogActive,
      isPlayerPositionExplored,
      visibleAreaSet,
      tileKeyAt,
      dimmedOpacity: WALL_EXPLORED_OPACITY
    });
  }

  syncPieces(entry, pieces, modelUrl, appearance, userData) {
    if (entry.pieces.length !== pieces.length) {
      entry.group.clear();
      entry.pieces = [];
      for (let i = 0; i < pieces.length; i += 1) {
        const innerModel = modelCache.createInstance(modelUrl);
        if (!innerModel) continue;
        innerModel.rotation.x = Math.PI / 2;
        innerModel.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.userData = { ...userData, is3DWall: true };
            if (appearance && child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach(m => {
                m.color.multiply(appearance.tint);
                if (appearance.emissive) {
                  m.emissive.copy(appearance.emissive);
                  m.emissiveIntensity = 0.6;
                }
              });
            }
          }
        });
        const mesh = new THREE.Group();
        mesh.name = `${entry.key}#${i}`;
        mesh.add(innerModel);
        entry.group.add(mesh);
        entry.pieces.push({
          mesh,
          innerModel,
          baseOpacity: appearance?.baseOpacity ?? 1
        });
      }
    }

    entry.pieces.forEach((piece, index) => {
      const target = pieces[index];
      if (!target) return;
      piece.mesh.position.set(target.x, -target.y, target.z);
      piece.mesh.rotation.z = target.rotationZ;
      piece.innerModel.scale.set(target.scaleX, target.scaleY, target.scaleZ);
    });
  }

  applyPieceState(piece, { isVisible, targetOpacity, canCastShadow }) {
    piece.mesh.visible = isVisible;
    if (!isVisible) return;
    const baseOpacity = piece.baseOpacity ?? 1;
    const opacity = targetOpacity * baseOpacity;
    piece.innerModel.traverse(child => {
      if (child.isMesh) {
        child.castShadow = canCastShadow;
        child.receiveShadow = true;
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach(m => {
            if (m.opacity !== opacity) {
              m.transparent = opacity < 0.999;
              m.opacity = opacity;
              m.needsUpdate = true;
            }
          });
        }
      }
    });
  }

  dispose() {
    this.wallInstances.forEach(entry => {
      this.group.remove(entry.group);
    });
    this.wallInstances.clear();

    this.junctionInstances.forEach(entry => {
      this.group.remove(entry.group);
    });
    this.junctionInstances.clear();

    if (this.group.parent) {
      this.group.parent.remove(this.group);
    }
  }
}
