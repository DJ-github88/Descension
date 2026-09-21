import * as THREE from 'three';
import modelCache from '../../../services/ModelCacheService';
import useLevelEditorStore, { WALL_TYPES } from '../../../store/levelEditorStore';
import {
  parseWallKey,
  getWallWorldEndpoints,
  getWallBodyHeightWorld,
  WALL_HEIGHT_MULTIPLIERS
} from '../../../utils/WallGeometry';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';
import { getTileElevation } from '../../../utils/ElevationUtils';
import { applyWallMaterial, applyWallTexture, getEnergyWallTexture } from './wallMaterialTextures';
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
  endcap: '/assets/models/dungeon/wall_endcap.glb',

  // Dedicated CC0 3D Wall Models
  brick: '/assets/models/walls/brick_wall.glb',
  brick_corner: '/assets/models/walls/brick_wall_corner.glb',
  wood: '/assets/models/walls/wooden_wall.glb',
  wood_corner: '/assets/models/walls/wooden_wall_corner.glb',
  wood_door: '/assets/models/walls/wooden_wall_door.glb',
  wood_half: '/assets/models/walls/wooden_wall_half.glb',
  wood_window: '/assets/models/walls/wooden_wall_window.glb',
  hedge: '/assets/models/walls/hedge.glb',
  hedge_corner: '/assets/models/walls/hedge_corner.glb',
  hedge_gate: '/assets/models/walls/hedge_gate.glb',
  metal: '/assets/models/walls/metal_wall.glb',
  metal_border: '/assets/models/walls/metal_wall_border.glb',
  metal_gate: '/assets/models/walls/metal_wall_gate.glb',
  wooden_fence: '/assets/models/walls/wooden_fence.glb',
  wooden_fence_broken: '/assets/models/walls/wooden_fence_broken.glb',
  wooden_fence_gate: '/assets/models/walls/wooden_fence_gate.glb',
  town_wall: '/assets/models/walls/town_wall.glb',
  town_wall_arch: '/assets/models/walls/town_wall_arch.glb',
  town_wall_broken: '/assets/models/walls/town_wall_broken.glb',
  town_wall_corner: '/assets/models/walls/town_wall_corner.glb',
  town_wall_curved: '/assets/models/walls/town_wall_curved.glb',
  town_wall_door: '/assets/models/walls/town_wall_door.glb',
  town_wall_half: '/assets/models/walls/town_wall_half.glb',
  town_wall_window: '/assets/models/walls/town_wall_window.glb',
  gothic_stone: '/assets/models/walls/gothic_stone_wall.glb',
  gothic_stone_curve: '/assets/models/walls/gothic_stone_wall_curve.glb',
  gothic_stone_damaged: '/assets/models/walls/gothic_stone_wall_damaged.glb',
  gothic_stone_column: '/assets/models/walls/gothic_stone_wall_column.glb',
  iron_fence_curve: '/assets/models/walls/iron_fence_curve.glb',
  iron_fence_damaged: '/assets/models/walls/iron_fence_damaged.glb',
  pillar_stone: '/assets/models/walls/pillar_stone.glb',
  pillar_wood: '/assets/models/walls/pillar_wood.glb',
  column_large: '/assets/models/walls/column_large.glb',
  town_wall_diagonal: '/assets/models/walls/town_wall_diagonal.glb',
  wooden_wall_curved: '/assets/models/walls/wooden_wall_curved.glb',
  wooden_wall_diagonal: '/assets/models/walls/wooden_wall_diagonal.glb',
  wooden_fence_curved: '/assets/models/walls/wooden_fence_curved.glb',
  hedge_curved: '/assets/models/walls/hedge_curved.glb',
  brick_wall_curve: '/assets/models/walls/brick_wall_curve.glb',
  quaternius_wood: '/assets/models/walls/quaternius_wood_wall.glb'
};

// Every wall/junction model in the modular kit is authored 4 units long, 4 units
// tall and 1 unit thick (pillar: 1.5). Scale is derived from that unit size.
export const WALL_MODEL_UNIT = 4;

// Explored-but-not-visible walls stay fully opaque and are dimmed by tinting
// their material instead. The previous alpha dim (0.7) made solid masonry read
// as see-through and revealed the fogged ground behind it; genuinely
// translucent pieces (energy panes, windows) keep their own opacity.
export const WALL_EXPLORED_DIM = 0.6;

// Energy panes are authored procedurally (1 long, 1 tall, 0.12 thick, base at
// y=0) so the regular piece scaling lands them on the wall line.
export const ENERGY_PANE_METRICS = { length: 1, height: 1, centerX: 0, centerZ: 0 };

const JUNCTION_MODEL_BY_TYPE = {
  corner: WALL_MODELS.corner,
  tsplit: WALL_MODELS.tsplit,
  crossing: WALL_MODELS.crossing,
  endcap: WALL_MODELS.endcap
};

/**
 * Optional "curved corner" build style. Only models that verify as true cell
 * corners are listed: their arms run a full cell along the two incident runs,
 * so the corner piece replaces the last tile of each run. `yaw`/`offset` map
 * the model's authored bend and arms onto the canonical vertex frame (bend at
 * the origin, arms toward -X and -Y).
 *
 * The other pack corner/curve files are NOT corners: `brick_wall_corner` is a
 * centred S-connector and `*_curved`/`*_curve` pieces connect opposite cell
 * corners (diagonal segments), so they are intentionally not offered here.
 */
export const WALL_CORNER_STYLES = {
  wooden_wall: {
    url: WALL_MODELS.wood_corner,
    yaw: -Math.PI / 2,
    offset: [-0.45, -0.45]
  },
  hedge: {
    url: WALL_MODELS.hedge_corner,
    yaw: Math.PI,
    offset: [0, 0]
  },
  barrier_wood: {
    url: WALL_MODELS.barrier_corner,
    yaw: 0,
    offset: [0, 0]
  }
};

export const hasCurvedCornerStyle = (typeId) => !!WALL_CORNER_STYLES[String(typeId || '').toLowerCase()];

// Authored dimensions for kit models that are not the standard 4 x 4 x 1 wall.
// `length` maps the model onto the wall piece length, `height` maps it onto the
// wall body height (the palisade is only 1.1 units tall and must stretch).
//
// The dedicated CC0 wall models (`walls/*.glb`) are authored with their outer
// thickness face flush with the cell boundary, so their origin is NOT centred
// on the wall line. `centerZ` is the model-space centre of the thickness axis
// (local Z when rotateY is 0, local X when rotateY is PI/2) and pieces are
// shifted onto the wall line by it. Without this the wooden fence (and every
// other dedicated model) renders half a tile off the grid edge while the
// centred stone junctions stay on it - the "fence in front of the hedge with
// stone poles behind it" artifact.
const DEFAULT_WALL_METRICS = { length: WALL_MODEL_UNIT, height: WALL_MODEL_UNIT, centerX: 0, centerZ: 0 };
export const WALL_MODEL_METRICS = {
  [WALL_MODELS.barrier]: { length: 4, height: 1.1, centerX: 0 },
  [WALL_MODELS.barrier_corner]: { length: 4, height: 1.4, centerX: 0 },
  [WALL_MODELS.brick]: { length: 1, height: 0.702, centerX: 0, centerZ: 0.41 },
  [WALL_MODELS.brick_corner]: { length: 1, height: 0.702, centerX: 0 },
  [WALL_MODELS.wood]: { length: 1, height: 1.0, centerX: 0, centerZ: -0.45, rotateY: Math.PI / 2 },
  [WALL_MODELS.wood_corner]: { length: 1, height: 1.0, centerX: 0 },
  [WALL_MODELS.wood_door]: { length: 1, height: 1.0, centerX: 0, centerZ: -0.45, rotateY: Math.PI / 2 },
  [WALL_MODELS.wood_half]: { length: 1, height: 0.5, centerX: 0, centerZ: -0.45, rotateY: Math.PI / 2 },
  [WALL_MODELS.wood_window]: { length: 1, height: 1.0, centerX: 0, centerZ: -0.45, rotateY: Math.PI / 2 },
  [WALL_MODELS.hedge]: { length: 1, height: 0.25, centerX: 0, centerZ: -0.375, rotateY: Math.PI / 2 },
  [WALL_MODELS.hedge_corner]: { length: 1, height: 0.20, centerX: 0 },
  [WALL_MODELS.hedge_gate]: { length: 1, height: 0.25, centerX: 0, centerZ: -0.375, rotateY: Math.PI / 2 },
  [WALL_MODELS.metal]: { length: 1, height: 0.824, centerX: 0, centerZ: 0.4495 },
  [WALL_MODELS.metal_border]: { length: 1, height: 0.824, centerX: 0, centerZ: 0.45 },
  [WALL_MODELS.metal_gate]: { length: 1, height: 0.824, centerX: -0.05, centerZ: 0.43 },
  [WALL_MODELS.wooden_fence]: { length: 1, height: 0.38, centerX: 0, centerZ: -0.4625, rotateY: Math.PI / 2 },
  [WALL_MODELS.wooden_fence_broken]: { length: 1, height: 0.38, centerX: 0, centerZ: -0.3725, rotateY: Math.PI / 2 },
  [WALL_MODELS.wooden_fence_gate]: { length: 1, height: 0.38, centerX: 0, centerZ: -0.4625, rotateY: Math.PI / 2 },
  [WALL_MODELS.town_wall]: { length: 1, height: 1.0, centerX: 0, centerZ: -0.45, rotateY: Math.PI / 2 },
  [WALL_MODELS.town_wall_arch]: { length: 1, height: 1.0, centerX: 0, centerZ: -0.45, rotateY: Math.PI / 2 },
  [WALL_MODELS.town_wall_broken]: { length: 1, height: 1.0, centerX: 0, centerZ: -0.456, rotateY: Math.PI / 2 },
  [WALL_MODELS.town_wall_corner]: { length: 1, height: 1.0, centerX: 0 },
  [WALL_MODELS.town_wall_curved]: { length: 1, height: 1.0, centerX: 0 },
  [WALL_MODELS.town_wall_door]: { length: 1, height: 1.0, centerX: 0, centerZ: -0.45, rotateY: Math.PI / 2 },
  [WALL_MODELS.town_wall_half]: { length: 1, height: 0.5, centerX: 0, centerZ: -0.45, rotateY: Math.PI / 2 },
  [WALL_MODELS.town_wall_window]: { length: 1, height: 1.0, centerX: 0, centerZ: -0.45, rotateY: Math.PI / 2 },
  [WALL_MODELS.gothic_stone]: { length: 1, height: 0.65, centerX: 0, centerZ: 0.45 },
  [WALL_MODELS.gothic_stone_curve]: { length: 1, height: 0.65, centerX: 0 },
  [WALL_MODELS.gothic_stone_damaged]: { length: 1, height: 0.65, centerX: 0, centerZ: 0.45 },
  [WALL_MODELS.gothic_stone_column]: { length: 1, height: 0.65, centerX: 0, centerZ: 0.45 },
  [WALL_MODELS.iron_fence_curve]: { length: 1, height: 0.824, centerX: 0 },
  [WALL_MODELS.iron_fence_damaged]: { length: 1, height: 0.824, centerX: 0, centerZ: 0.4495 },
  [WALL_MODELS.pillar_stone]: { length: 1, height: 1.0, centerX: 0 },
  [WALL_MODELS.pillar_wood]: { length: 1, height: 1.0, centerX: 0 },
  [WALL_MODELS.column_large]: { length: 1, height: 1.1, centerX: 0 },
  [WALL_MODELS.town_wall_diagonal]: { length: 1, height: 1.0, centerX: 0, rotateY: Math.PI / 2 },
  [WALL_MODELS.wooden_wall_curved]: { length: 1, height: 1.0, centerX: 0 },
  [WALL_MODELS.wooden_wall_diagonal]: { length: 1, height: 1.0, centerX: 0, rotateY: Math.PI / 2 },
  [WALL_MODELS.wooden_fence_curved]: { length: 1, height: 0.38, centerX: 0, rotateY: Math.PI / 2 },
  [WALL_MODELS.hedge_curved]: { length: 1, height: 0.25, centerX: 0, rotateY: Math.PI / 2 },
  [WALL_MODELS.brick_wall_curve]: { length: 1, height: 0.702, centerX: 0 }
};
export const wallModelMetrics = (url) => WALL_MODEL_METRICS[url] || DEFAULT_WALL_METRICS;

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

/**
 * Wall types whose resolved model is one of the dedicated KayKit-style
 * `walls/*.glb` pieces. Those models ship flat prototype colours (no texture),
 * so the type's seamless 2.5D texture is applied to them. They are also
 * authored as full-cell pieces (their corner arms replace whole cell edges),
 * which makes them incompatible with the per-edge junction kit: they render
 * their own ends and meet at the vertex instead of receiving stone caps.
 */
export const DEDICATED_WALL_TEXTURE_TYPES = {
  wooden_wall: 'wooden_wall',
  brick_wall: 'brick_wall',
  metal_wall: 'metal_wall',
  hedge: 'hedge',
  iron_fence: 'iron_fence',
  wooden_fence: 'wooden_fence',
  town_wall: 'town_wall',
  gothic_stone: 'gothic_stone',
  stone_column: 'stone_column',
  wooden_column: 'wooden_column',
  wall_diagonal: 'wall_diagonal',
  wall_curved: 'wall_curved'
};

/**
 * Resolve the 3D model for a wall type id. Pure module-level helper so UI
 * (palette thumbnails) can preview the exact model a type renders.
 */
export function resolveWallModelUrlForType(type) {
  const typeId = (typeof type === 'string' ? type : type?.type) || 'stone_wall';
  const typeLower = String(typeId).toLowerCase();

  // Dedicated models for fences and special architectural walls
  if (typeLower === 'hedge') {
    return WALL_MODELS.hedge;
  }
  if (typeLower === 'iron_fence' || typeLower === 'metal_wall') {
    return WALL_MODELS.metal;
  }
  if (typeLower === 'wooden_fence' || typeLower.includes('picket')) {
    return WALL_MODELS.wooden_fence;
  }
  if (typeLower === 'town_wall') {
    return WALL_MODELS.town_wall;
  }
  if (typeLower === 'gothic_stone') {
    return WALL_MODELS.gothic_stone;
  }
  if (typeLower === 'wooden_wall' || typeLower === 'wood_wall') {
    return WALL_MODELS.wood;
  }
  if (typeLower === 'brick_wall') {
    return WALL_MODELS.brick;
  }
  if (typeLower === 'stone_column') {
    return WALL_MODELS.pillar_stone;
  }
  if (typeLower === 'wooden_column') {
    return WALL_MODELS.pillar_wood;
  }
  if (typeLower === 'wall_diagonal' || typeLower === 'town_wall_diagonal') {
    return WALL_MODELS.town_wall_diagonal;
  }
  if (typeLower === 'wall_curved' || typeLower === 'town_wall_curved') {
    return WALL_MODELS.town_wall_curved;
  }
  if (typeLower === 'quaternius_wood' || typeLower === 'palisade_wood' || typeLower === 'wood_palisade') {
    return WALL_MODELS.quaternius_wood;
  }

  // The kit's `wall_half` piece is a half-LENGTH wall segment, not a low
  // parapet. The half_wall type is a low wall, so it reuses the straight
  // masonry model at the type's heightScale instead (see WALL_TYPES).
  if (typeLower.includes('arch')) {
    return WALL_MODELS.arched;
  }
  if (typeLower.includes('shel')) {
    return WALL_MODELS.shelves;
  }
  // Palette `magical_barrier`/`force_wall` are energy walls, not wooden
  // palisades: they must fall through to the straight masonry model below.
  if (typeLower.includes('palisade') || typeLower === 'barrier_wood') {
    return WALL_MODELS.barrier;
  }
  // Arrow slits are openings in masonry, not full walls: they share the
  // barred-window model so they do not fall through to a plain wall segment.
  // Window features always use the host-agnostic kit windows so they fit any
  // wall run (the 2.5D SVG builder does the same by cutting the host wall).
  if (typeLower.includes('window') || typeLower.includes('slit')) {
    if (typeLower.includes('bar') || typeLower.includes('gate') || typeLower.includes('slit')) {
      return WALL_MODELS.window_gated;
    }
    if (typeLower.includes('close') || typeLower.includes('glass') || typeLower.includes('town')) {
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

  // Default straight stone wall (also used by the low half-wall parapet and material variants).
  return WALL_MODELS.straight;
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
    return resolveWallModelUrlForType(wall);
  }

  isDoorWall(wall) {
    const typeId = (typeof wall === 'string' ? wall : wall?.type) || '';
    if (wall && typeof wall === 'object' && wall.isWallDoor) return true;
    const typeData = WALL_TYPES[typeId] || {};
    return !!typeData.interactive || String(typeId).toLowerCase().includes('door');
  }

  /**
   * Resolve the 3D appearance of a wall type.
   *
   * Dedicated `walls/*.glb` models ship flat prototype colours, so they get the
   * type's seamless 2.5D texture. Those models are full-cell pieces whose
   * corners/ends are incompatible with the per-edge stone junction kit, so they
   * declare an empty junction map and meet at the vertex instead of growing
   * stone caps ("stone pillars on the garden hedge / picket fence" artifact).
   * Energy barriers render as emissive translucent panes, not tinted masonry.
   */
  resolveWallAppearance(wall) {
    const typeId = (typeof wall === 'string' ? wall : wall?.type) || 'stone_wall';
    const typeData = WALL_TYPES[typeId] || {};
    if (typeData.isWindow || typeData.interactive) return null;
    const typeLower = String(typeId).toLowerCase();

    const textureKey = DEDICATED_WALL_TEXTURE_TYPES[typeLower];
    if (textureKey) {
      return {
        tint: null,
        baseOpacity: 1,
        emissive: null,
        texture: textureKey,
        // Full-cell dedicated models own their ends and corners.
        junctionModels: {},
        key: `${typeId}:texture`
      };
    }

    if (typeLower === 'quaternius_wood') {
      return null;
    }

    // Magical barriers / force walls: translucent emissive energy panes.
    if (typeLower === 'magical_barrier' || typeLower === 'force_wall') {
      return {
        tint: null,
        baseOpacity: 0.72,
        emissive: new THREE.Color(typeData.color || '#8A2BE2'),
        energy: true,
        energyTexture: typeId,
        junctionModels: {},
        key: `${typeId}:energy`
      };
    }

    // The wooden palisade is a kit model, but the kit's own barrier corner piece
    // matches it: allow the corner, skip stone caps/T-splits.
    if (typeLower === 'barrier_wood' || typeLower.includes('palisade')) {
      return {
        tint: null,
        baseOpacity: 1,
        emissive: null,
        junctionModels: { corner: WALL_MODELS.barrier_corner },
        key: `${typeId}:palisade`
      };
    }

    // Structural variations (half wall, arches, ruins, shelves) already ship
    // their own kit model and material; palette colours exist for the 2.5D
    // pattern layer, not for tinting pristine stone into dark slabs.
    if (typeData.category === 'variations' || typeData.category === 'fences') return null;
    if (!typeData.color || typeId === 'stone_wall') return null;

    const tint = new THREE.Color(typeData.color).lerp(WHITE, 0.15);
    return {
      tint,
      baseOpacity: 1,
      emissive: null,
      material: null,
      key: `${typeId}:${Math.round(tint.r * 255)},${Math.round(tint.g * 255)},${Math.round(tint.b * 255)}`
    };
  }

  /**
   * Apply an appearance to a freshly cloned material. Seamless type textures
   * replace the flat prototype colour, generated material families replace the
   * kit atlas map, energy panes get their emissive texture; everything else
   * keeps the tint path.
   */
  applyAppearanceToMaterial(material, appearance) {
    if (!appearance || !material) return;
    if (appearance.texture && applyWallTexture(material, appearance.texture)) {
      return;
    }
    if (appearance.material && applyWallMaterial(material, appearance.material)) {
      return;
    }
    if (appearance.tint) {
      // Lerp gracefully rather than multiply to preserve texture crack and highlight definition
      material.color.lerp(appearance.tint, 0.45);
    }
    if (appearance.emissive) {
      material.emissive.copy(appearance.emissive);
      material.emissiveIntensity = 0.6;
    }
  }

  /**
   * Build a translucent emissive pane for magical barriers / force walls. The
   * box is authored like a dedicated wall model (1 long, 1 tall, 0.12 thick)
   * so the regular piece scaling puts it on the wall line.
   */
  createEnergyPane(appearance) {
    const texture = getEnergyWallTexture(appearance.energyTexture);
    // Authored like the kit wall models (1 long, 1 tall, 0.12 thick, base at
    // y=0) and tipped upright so the regular piece scaling lands the pane on
    // the wall line with its height along the world up axis.
    const geometry = new THREE.BoxGeometry(1, 1, 0.12);
    geometry.translate(0, 0.5, 0);
    const build = (map) => {
      const material = new THREE.MeshStandardMaterial({
        map: map || null,
        transparent: true,
        opacity: appearance.baseOpacity ?? 0.72,
        emissive: appearance.emissive ? appearance.emissive.clone() : new THREE.Color(0x8a2be2),
        emissiveMap: map || null,
        emissiveIntensity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
        roughness: 0.35,
        metalness: 0
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.set(Math.PI / 2, 0, 0, 'XYZ');
      mesh.userData.energyPane = true;
      return mesh;
    };
    if (texture && texture.clone) {
      // Per-type repeat so the square energy texture keeps its aspect on a
      // 1.8-cell-tall wall body.
      const map = texture.clone();
      map.needsUpdate = true;
      map.repeat.set(1, 1.8);
      return build(map);
    }
    return build(null);
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
  computeWallPieces({ start, end, gridSize, heightWorld, baseZ, gridType, metrics = DEFAULT_WALL_METRICS }) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length < 1e-4) return [];

    const scalePlan = gridSize / metrics.length;
    const scaleY = heightWorld / metrics.height;
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
    const pieceScaleX = pieceLength / metrics.length;
    const ux = dx / length;
    const uy = dy / length;
    const probeOffset = fogProbeOffset(gridSize);
    // Dedicated models are authored with their outer face on the cell boundary,
    // so their bounding-box centre sits off the wall line. Shift the model back
    // onto the line: local +Z maps to the wall normal for rotateY=0 models and
    // local +X does for rotateY=PI/2 models.
    const thicknessCenter = metrics.centerZ || 0;
    const thicknessScale = metrics.rotateY ? pieceScaleX : scalePlan;
    const offsetY = (metrics.rotateY ? -thicknessCenter : thicknessCenter) * thicknessScale;
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
        scaleX: pieceScaleX,
        scaleY,
        scaleZ: scalePlan,
        // Models authored with an off-centre origin sit on the piece centre.
        offsetX: -(metrics.centerX || 0) * pieceScaleX,
        offsetY,
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
    const cornerStylePrefs = (() => {
      try {
        return useLevelEditorStore.getState().wallCornerStyles || {};
      } catch (e) {
        return {};
      }
    })();

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
      const appearance = isDoor ? null : this.resolveWallAppearance(wall);
      const typeData = WALL_TYPES[wall && typeof wall === 'object' ? wall.type : wall] || {};
      const heightWorld = getWallBodyHeightWorld(wall, gridSize, typeData);
      wallRecords.push({ key, wall, parsed, ends, isDoor, appearance, heightWorld });

      // Junction analysis includes doors: their doorway model occupies the tile,
      // so neighbouring walls must not cap themselves against the opening.
      for (const [here, there] of [[ends.start, ends.end], [ends.end, ends.start]]) {
        const vertexKey = `${Math.round(here.x)},${Math.round(here.y)}`;
        let vertex = dirsByVertex.get(vertexKey);
        if (!vertex) {
          vertex = { x: here.x, y: here.y, dirs: [], hasDoor: false, appearance: null, mixed: false, incident: [] };
          dirsByVertex.set(vertexKey, vertex);
        }
        if (isDoor) vertex.hasDoor = true;
        const dir = quantizeDirection(there.x - here.x, there.y - here.y);
        if (dir) vertex.dirs.push(dir);

        // Junction pieces should carry the same material and height as the
        // runs meeting there. A vertex joining different wall types falls back
        // to the default stone look and full wall body height.
        if (!isDoor) {
          const appearanceKey = appearance?.key || null;
          const wallTypeId = wall && typeof wall === 'object' ? wall.type : wall;
          vertex.incident.push({
            key,
            isStart: here === ends.start,
            typeId: wallTypeId,
            // Recorded on the wall when drawn; older walls fall back to the
            // current per-type preference.
            cornerStyle: (wall && typeof wall === 'object' && wall.cornerStyle)
              || cornerStylePrefs[wallTypeId]
              || 'square'
          });
          if (!vertex.appearanceSeen) {
            vertex.appearanceSeen = true;
            vertex.appearance = appearance;
            vertex.appearanceKey = appearanceKey;
            vertex.heightWorld = heightWorld;
          } else {
            if (vertex.appearanceKey !== appearanceKey) {
              vertex.appearance = null;
              vertex.mixed = true;
            }
            if (!Number.isFinite(vertex.heightWorld) ||
              Math.abs(vertex.heightWorld - heightWorld) > 0.5) {
              vertex.heightWorld = null;
            }
          }
        }
      }
    }

    // Curved-corner build style: when every run meeting at a corner is the same
    // type and that type opts into curved corners, the last tile of each run is
    // replaced by one full-cell corner piece (matching how the asset pack is
    // authored) so the bend is seamless.
    const curvedCornerVertices = new Set();
    const skippedEnds = new Set();
    for (const [vertexKey, vertex] of dirsByVertex.entries()) {
      if (vertex.mixed || !vertex.incident || vertex.incident.length !== 2) continue;
      const junction = this.resolveJunction(vertex.dirs, vertex.hasDoor);
      if (!junction || junction.kind !== 'corner') continue;
      const typeIds = new Set(vertex.incident.map((i) => i.typeId));
      if (typeIds.size !== 1) continue;
      const typeId = vertex.incident[0].typeId;
      if (!hasCurvedCornerStyle(typeId)) continue;
      if (!vertex.incident.every((i) => i.cornerStyle === 'curved')) continue;
      curvedCornerVertices.add(vertexKey);
      vertex.incident.forEach((i) => skippedEnds.add(`${i.key}:${i.isStart ? 'start' : 'end'}`));
    }

    // 1. Wall segments (one model per tile when the run is axis-aligned/tile-exact)
    for (const { key, wall, parsed, ends, isDoor, appearance, heightWorld } of wallRecords) {
      // Doors are rendered by ThreeDPropManager with interactive swing hinges
      if (isDoor) continue;

      currentWallKeys.add(key);
      const modelUrl = this.resolveWallModelUrl(wall);
      const baseZ = this.resolveElevationZ(wall, parsed, elevationData, gridSize);
      const pieces = this.computeWallPieces({
        start: ends.start,
        end: ends.end,
        gridSize,
        heightWorld,
        baseZ,
        gridType,
        metrics: appearance?.energy ? ENERGY_PANE_METRICS : wallModelMetrics(modelUrl)
      });
      // Curved corners replace the tile each run ends on at the vertex.
      if (skippedEnds.has(`${key}:start`)) pieces.shift();
      if (skippedEnds.has(`${key}:end`)) pieces.pop();
      if (pieces.length === 0) {
        const existing = this.wallInstances.get(key);
        if (existing) {
          this.group.remove(existing.group);
          this.wallInstances.delete(key);
        }
        continue;
      }

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

      const appearance = vertex.mixed ? null : vertex.appearance;
      const appearanceKey = appearance?.key || null;
      const curvedCorner = curvedCornerVertices.has(vertexKey) && !vertex.mixed
        ? WALL_CORNER_STYLES[String(vertex.incident[0].typeId).toLowerCase()]
        : null;
      // Types with a dedicated model declare their own (usually empty) junction
      // map; only the stone kit types fall back to the masonry junction kit.
      const junctionMap = (appearance && appearance.junctionModels) || JUNCTION_MODEL_BY_TYPE;
      const modelUrl = curvedCorner ? curvedCorner.url : junctionMap[junction.kind];
      if (!modelUrl) continue;

      let entry = this.junctionInstances.get(vertexKey);
      if (entry && (entry.modelUrl !== modelUrl || entry.appearanceKey !== appearanceKey)) {
        this.group.remove(entry.group);
        this.junctionInstances.delete(vertexKey);
        entry = null;
      }
      if (!entry) {
        const innerModel = modelCache.createInstance(modelUrl);
        if (!innerModel) continue; // Still loading in background
        const junctionMetrics = wallModelMetrics(modelUrl);
        innerModel.rotation.set(Math.PI / 2, (junctionMetrics.rotateY || 0) + (curvedCorner?.yaw || 0), 0, 'XYZ');
        if (curvedCorner && curvedCorner.offset) {
          const alignmentScale = gridSize / (junctionMetrics.length || WALL_MODEL_UNIT);
          innerModel.position.set(
            curvedCorner.offset[0] * alignmentScale,
            curvedCorner.offset[1] * alignmentScale,
            0
          );
        }

        const junctionGroup = new THREE.Group();
        junctionGroup.name = `3djunction_${junction.kind}_${vertexKey}`;
        junctionGroup.add(innerModel);
        innerModel.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              this.applyAppearanceToMaterial(child.material, appearance);
            }
          }
        });

        entry = {
          key: vertexKey,
          kind: junction.kind,
          modelUrl,
          appearanceKey,
          baseOpacity: appearance?.baseOpacity ?? 1,
          group: junctionGroup,
          innerModel
        };
        this.junctionInstances.set(vertexKey, entry);
        this.group.add(junctionGroup);
      }

      // Low runs (half-wall parapets) should not tower over themselves at
      // their end caps/corners; mixed-height joins keep the full body height.
      const heightWorld = Number.isFinite(vertex.heightWorld)
        ? vertex.heightWorld
        : WALL_HEIGHT_MULTIPLIERS.wall * gridSize;
      entry.group.position.set(
        vertex.x,
        -vertex.y,
        this.resolveJunctionBaseZ(vertex, elevationData, gridSize, gridOffsetX, gridOffsetY)
      );
      entry.group.rotation.z = junction.rotation;
      const junctionMetrics = wallModelMetrics(modelUrl);
      const junctionScalePlan = gridSize / (junctionMetrics.length || WALL_MODEL_UNIT);
      entry.innerModel.scale.set(junctionScalePlan, heightWorld / junctionMetrics.height, junctionScalePlan);

      const fog = this.resolveFogVisibility(fogSamplesAroundPoint(vertex.x, vertex.y, probeOffset), {
        isFogActive,
        isPlayerPositionExplored,
        visibleAreaSet,
        tileKeyAt
      });
      this.applyPieceState({ mesh: entry.group, innerModel: entry.innerModel, baseOpacity: entry.baseOpacity }, fog);
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
    const createInnerModel = () => {
      if (appearance?.energy) return this.createEnergyPane(appearance);
      const instance = modelCache.createInstance(modelUrl);
      if (!instance) return null;
      const metrics = wallModelMetrics(modelUrl);
      instance.rotation.set(Math.PI / 2, metrics.rotateY || 0, 0, 'XYZ');
      instance.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.userData = { ...userData, is3DWall: true };
          if (child.material) {
            this.applyAppearanceToMaterial(child.material, appearance);
          }
        }
      });
      return instance;
    };

    if (entry.pieces.length !== pieces.length) {
      entry.group.clear();
      entry.pieces = [];
      for (let i = 0; i < pieces.length; i += 1) {
        const innerModel = createInnerModel();
        if (!innerModel) continue;
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
      piece.innerModel.position.x = target.offsetX || 0;
      piece.innerModel.position.y = target.offsetY || 0;
    });
  }

  applyPieceState(piece, { isVisible, targetOpacity, canCastShadow }) {
    piece.mesh.visible = isVisible;
    if (!isVisible) return;
    const baseOpacity = piece.baseOpacity ?? 1;
    const opacity = targetOpacity * baseOpacity;
    const dimmed = targetOpacity < 0.999;

    piece.innerModel.traverse(child => {
      if (!child.isMesh) return;
      // Energy panes are translucent: a solid shadow would read as masonry.
      child.castShadow = canCastShadow && !child.userData.energyPane;
      child.receiveShadow = true;
      if (!child.material) return;

      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach(m => {
        if (!m.userData.baseColor) m.userData.baseColor = m.color.clone();
        // Solid walls must not turn see-through in explored areas: keep full
        // opacity and dim the colour instead. Translucent pieces (energy
        // panes) keep their authored alpha and multiply by the fog factor.
        const solid = baseOpacity >= 0.999 && !child.userData.energyPane;
        const nextOpacity = solid ? 1 : opacity;
        if (m.opacity !== nextOpacity) {
          m.transparent = nextOpacity < 0.999;
          m.opacity = nextOpacity;
          m.needsUpdate = true;
        }
        if (solid) {
          const factor = dimmed ? WALL_EXPLORED_DIM : 1;
          if (m.userData.dimFactor !== factor) {
            m.userData.dimFactor = factor;
            m.color.copy(m.userData.baseColor).multiplyScalar(factor);
          }
        }
      });
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
