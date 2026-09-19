import * as THREE from 'three';
import modelCache from '../../../services/ModelCacheService';
import { WALL_TYPES } from '../../../store/levelEditorStore';
import {
  parseWallKey,
  getWallWorldEndpoints,
  getWallBodyHeightWorld
} from '../../../utils/WallGeometry';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';
import { getTileElevation } from '../../../utils/ElevationUtils';
import useLevelEditorStore from '../../../store/levelEditorStore';
import {
  PROP_EXPLORED_OPACITY,
  createTileKeyResolver,
  fogProbeOffset,
  fogSamplesAlongSegment,
  fogSamplesAroundPoint,
  resolveSampleFogVisibility
} from './fogVisibility';
import {
  setPropWorldBoundsResolver,
  clearPropWorldBoundsResolver
} from './propWorldBounds';

const WALL_MODEL_UNIT = 4;

// 3D stand-in models for placed light sources (the kit has no dedicated
// lantern/campfire pieces, so the nearest light fixture is reused).
export const LIGHT_SOURCE_MODELS = {
  torch: { url: '/assets/models/dungeon/torch_standing.glb', scale: 0.9 },
  lantern: { url: '/assets/models/dungeon/candelabra.glb', scale: 0.75 },
  candle: { url: '/assets/models/dungeon/candle.glb', scale: 1.0 },
  magical: { url: '/assets/models/dungeon/candelabra.glb', scale: 0.85 },
  campfire: { url: '/assets/models/dungeon/torch_standing.glb', scale: 0.8 },
  sunlight: null // ambient light source, no placed fixture
};

// Registry of 3D Models mapped to object types
export const MODEL_REGISTRY = {
  // Chests & Containers
  chest: {
    url: '/assets/models/dungeon/chest.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'chest'
  },
  chest_gold: {
    url: '/assets/models/dungeon/chest_gold.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'chest'
  },
  trunk_large: {
    url: '/assets/models/dungeon/trunk_large.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'chest'
  },
  misc_box: {
    url: '/assets/models/dungeon/chest.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'chest'
  },
  crates: {
    url: '/assets/models/dungeon/crates.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  crates_tall: {
    url: '/assets/models/dungeon/crates_tall.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  barrel: {
    url: '/assets/models/dungeon/barrel.glb',
    scale: 0.8,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  barrel_large: {
    url: '/assets/models/dungeon/barrel_large.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  barrel_stack: {
    url: '/assets/models/dungeon/barrel_stack.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },

  // 3D Modular Walls & Architecture
  wall_doorway: {
    url: '/assets/models/dungeon/wall_doorway.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'door'
  },
  wooden_door: {
    url: '/assets/models/dungeon/wall_doorway.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'door'
  },
  wall_stone: {
    url: '/assets/models/dungeon/wall_stone.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_stone_straight: {
    url: '/assets/models/dungeon/wall_stone_straight.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_corner: {
    url: '/assets/models/dungeon/wall_corner.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_tsplit: {
    url: '/assets/models/dungeon/wall_tsplit.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_crossing: {
    url: '/assets/models/dungeon/wall_crossing.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_broken: {
    url: '/assets/models/dungeon/wall_broken.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_arched: {
    url: '/assets/models/dungeon/wall_arched.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_window_open: {
    url: '/assets/models/dungeon/wall_window_open.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_window_gated: {
    url: '/assets/models/dungeon/wall_window_gated.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_window_closed: {
    url: '/assets/models/dungeon/wall_window_closed.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_half: {
    url: '/assets/models/dungeon/wall_half.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_shelves: {
    url: '/assets/models/dungeon/wall_shelves.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_cracked: {
    url: '/assets/models/dungeon/wall_cracked.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_gated: {
    url: '/assets/models/dungeon/wall_gated.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_pillar: {
    url: '/assets/models/dungeon/wall_pillar.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_endcap: {
    url: '/assets/models/dungeon/wall_endcap.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  pillar_stone: {
    url: '/assets/models/dungeon/pillar_stone.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  column_stone: {
    url: '/assets/models/dungeon/column_stone.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  spikes_floor: {
    url: '/assets/models/dungeon/spikes_floor.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  grate_closed: {
    url: '/assets/models/dungeon/grate_closed.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  grate_open: {
    url: '/assets/models/dungeon/grate_open.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  potion_bottle_green: {
    url: '/assets/models/dungeon/potion_bottle_green.glb',
    scale: 0.5,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  potion_bottle_brown: {
    url: '/assets/models/dungeon/potion_bottle_brown.glb',
    scale: 0.5,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  barrier_wood: {
    url: '/assets/models/dungeon/barrier_wood.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  barrier_corner: {
    url: '/assets/models/dungeon/barrier_corner.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  barrier_column: {
    url: '/assets/models/dungeon/barrier_column.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  barrier_half: {
    url: '/assets/models/dungeon/barrier_half.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  barrier_post_half: {
    url: '/assets/models/dungeon/barrier_post_half.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  pillar_decorated: {
    url: '/assets/models/dungeon/pillar_decorated.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_sloped: {
    url: '/assets/models/dungeon/wall_sloped.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_half_endcap: {
    url: '/assets/models/dungeon/wall_half_endcap.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  wall_doorway_sides: {
    url: '/assets/models/dungeon/wall_doorway_sides.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'door'
  },
  stairs_stone: {
    url: '/assets/models/dungeon/stairs_stone.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  stairs_narrow: {
    url: '/assets/models/dungeon/stairs_narrow.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  stairs_wide: {
    url: '/assets/models/dungeon/stairs_wide.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  stairs_wood: {
    url: '/assets/models/dungeon/stairs_wood.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  stairs_walled: {
    url: '/assets/models/dungeon/stairs_walled.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },

  // Furniture
  table_long: {
    url: '/assets/models/dungeon/table_long.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  table_long_broken: {
    url: '/assets/models/dungeon/table_long_broken.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  table_long_tablecloth: {
    url: '/assets/models/dungeon/table_long_tablecloth.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  table_medium: {
    url: '/assets/models/dungeon/table_medium.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  table_medium_tablecloth: {
    url: '/assets/models/dungeon/table_medium_tablecloth.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  table_small: {
    url: '/assets/models/dungeon/table_small.glb',
    scale: 0.8,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  table_small_decorated: {
    url: '/assets/models/dungeon/table_small_decorated.glb',
    scale: 0.8,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  table_feast: {
    url: '/assets/models/dungeon/table_feast.glb',
    scale: 1.05,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  chair: {
    url: '/assets/models/dungeon/chair.glb',
    scale: 0.7,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  stool: {
    url: '/assets/models/dungeon/stool.glb',
    scale: 0.65,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  bed_frame: {
    url: '/assets/models/dungeon/bed_frame.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  bed_decorated: {
    url: '/assets/models/dungeon/bed_decorated.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  bed_floor: {
    url: '/assets/models/dungeon/bed_floor.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  bookshelf_large: {
    url: '/assets/models/dungeon/bookshelf_large.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  shelves: {
    url: '/assets/models/dungeon/shelves.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  shelf_candles: {
    url: '/assets/models/dungeon/shelf_candles.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },

  // Dungeon Props, Lighting & Treasure
  torch_wall: {
    url: '/assets/models/dungeon/torch_wall.glb',
    scale: 0.75,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  torch_standing: {
    url: '/assets/models/dungeon/torch_standing.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  candle: {
    url: '/assets/models/dungeon/candle.glb',
    scale: 0.5,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  candle_melted: {
    url: '/assets/models/dungeon/candle_melted.glb',
    scale: 0.5,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  candle_thin: {
    url: '/assets/models/dungeon/candle_thin.glb',
    scale: 0.5,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  candelabra: {
    url: '/assets/models/dungeon/candelabra.glb',
    scale: 0.7,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  keg: {
    url: '/assets/models/dungeon/keg.glb',
    scale: 0.8,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  keg_decorated: {
    url: '/assets/models/dungeon/keg_decorated.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  weapons_rack: {
    url: '/assets/models/dungeon/weapons_rack.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  royal_weapons: {
    url: '/assets/models/dungeon/royal_weapons.glb',
    scale: 0.95,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  weapons_broken: {
    url: '/assets/models/dungeon/weapons_broken.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  treasure_coins: {
    url: '/assets/models/dungeon/treasure_coins.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  coin_stack_medium: {
    url: '/assets/models/dungeon/coin_stack_medium.glb',
    scale: 0.8,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  trunk_medium: {
    url: '/assets/models/dungeon/trunk_medium.glb',
    scale: 0.8,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'chest'
  },
  trunk_small: {
    url: '/assets/models/dungeon/trunk_small.glb',
    scale: 0.7,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'chest'
  },
  rubble_pile: {
    url: '/assets/models/dungeon/rubble_pile.glb',
    scale: 0.95,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  rubble_half: {
    url: '/assets/models/dungeon/rubble_half.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  barrel_decorated: {
    url: '/assets/models/dungeon/barrel_decorated.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  barrel_small: {
    url: '/assets/models/dungeon/barrel_small.glb',
    scale: 0.7,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  box_large: {
    url: '/assets/models/dungeon/box_large.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  box_small: {
    url: '/assets/models/dungeon/box_small.glb',
    scale: 0.75,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  banner_red: {
    url: '/assets/models/dungeon/banner_red.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  banner_blue: {
    url: '/assets/models/dungeon/banner_blue.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  banner_green: {
    url: '/assets/models/dungeon/banner_green.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  banner_yellow: {
    url: '/assets/models/dungeon/banner_yellow.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  banner_crest: {
    url: '/assets/models/dungeon/banner_crest.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },

  // Crypt & Graveyard
  gravestone: {
    url: '/assets/models/crypt/gravestone.glb',
    scale: 0.85,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  coffin: {
    url: '/assets/models/crypt/coffin.glb',
    scale: 0.95,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'chest'
  },
  crypt: {
    url: '/assets/models/crypt/crypt.glb',
    scale: 1.1,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  skull: {
    url: '/assets/models/crypt/skull.glb',
    scale: 0.5,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  skull_candle: {
    url: '/assets/models/crypt/skull_candle.glb',
    scale: 0.55,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  ribcage: {
    url: '/assets/models/crypt/ribcage.glb',
    scale: 0.7,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  bone_pile: {
    url: '/assets/models/crypt/bone_A.glb',
    scale: 0.6,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  tree_dead_large: {
    url: '/assets/models/crypt/tree_dead_large.glb',
    scale: 1.3,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  tree_dead_medium: {
    url: '/assets/models/crypt/tree_dead_medium.glb',
    scale: 1.1,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  fence_iron: {
    url: '/assets/models/crypt/fence.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  fence_gate_iron: {
    url: '/assets/models/crypt/fence_gate.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: true,
    type: 'door'
  },
  arch_iron: {
    url: '/assets/models/crypt/arch.glb',
    scale: 1.0,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },

  // Nature
  tree_pine: {
    url: '/assets/models/nature/tree_pine.glb',
    scale: 1.4,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  tree_oak: {
    url: '/assets/models/nature/tree_oak.glb',
    scale: 1.3,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  rock_boulder: {
    url: '/assets/models/nature/rock_boulder.glb',
    scale: 0.9,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  rock_single_B: {
    url: '/assets/models/nature/rock_single_B.glb',
    scale: 0.8,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  rock_single_C: {
    url: '/assets/models/nature/rock_single_C.glb',
    scale: 0.75,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  },
  trees_small_cluster: {
    url: '/assets/models/nature/trees_A_small.glb',
    scale: 1.2,
    baseRotation: 0,
    offsetZ: 0,
    interactive: false
  }
};

export class ThreeDPropManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'ThreeDPropsGroup';
    this.scene.add(this.group);

    // Map: objectId -> entry
    this.propInstances = new Map();
    this.wallDoorInstances = new Map();
    this.lightPropInstances = new Map();
    this.interactiveMeshes = []; // For Raycasting

    // Expose rendered-model bounds to the 2D overlays so selection chrome can
    // hug the 3D figure instead of the tile footprint.
    setPropWorldBoundsResolver(this, (objectId) => this.getWorldBoundsCorners(objectId));

    // Preload registered models
    Object.values(MODEL_REGISTRY).forEach(reg => {
      modelCache.loadModel(reg.url).catch(() => {});
    });
    Object.values(LIGHT_SOURCE_MODELS).forEach(reg => {
      if (reg?.url) modelCache.loadModel(reg.url).catch(() => {});
    });
  }

  updateObjects(objects = [], gridState = {}, fogState = {}, wallData = {}, elevationData = {}) {
    const { gridSize = 50, gridOffsetX = 0, gridOffsetY = 0 } = gridState;
    const currentIds = new Set();

    // The wall pass feeds the manager its own wall data (used for wall-mounted
    // fixtures); direct calls fall back to the store so callers stay unchanged.
    // Wall-mounted fixtures only need re-evaluation when walls actually exist.
    let walls = wallData;
    if (!walls || Object.keys(walls).length === 0) {
      walls = useLevelEditorStore.getState().wallData || {};
    }
    const hasWallAttachments = objects.some(obj => obj && obj.wallAttached && obj.wallKey);
    if (!hasWallAttachments) {
      walls = {};
    }

    let gridSystem = null;
    try {
      gridSystem = getGridSystem();
    } catch (e) {
      gridSystem = null;
    }
    const tileKeyAt = createTileKeyResolver(gridSystem, gridSize, gridOffsetX, gridOffsetY);
    const probeOffset = fogProbeOffset(gridSize);

    objects.forEach(obj => {
      const def = MODEL_REGISTRY[obj.type];
      if (!def) return; // Not a registered 3D model

      currentIds.add(obj.id);
      let entry = this.propInstances.get(obj.id);

      // World coordinates calculation: must respect gridOffsetX/Y for grid-aligned objects
      let worldX, worldY;
      if (obj.worldX !== undefined && obj.worldY !== undefined) {
        worldX = obj.worldX;
        worldY = obj.worldY;
      } else if (obj.x !== undefined && obj.y !== undefined) {
        worldX = obj.x;
        worldY = obj.y;
      } else if (obj.gridX !== undefined && obj.gridY !== undefined) {
        worldX = obj.gridX * gridSize + gridOffsetX + gridSize / 2;
        worldY = obj.gridY * gridSize + gridOffsetY + gridSize / 2;
      } else {
        return;
      }

      // Sample underlying terrain elevation if not explicitly defined on object
      let gx = obj.gridX;
      let gy = obj.gridY;
      if (gx === undefined || gy === undefined) {
        gx = Math.floor((worldX - gridOffsetX) / gridSize);
        gy = Math.floor((worldY - gridOffsetY) / gridSize);
      }
      const tileElev = getTileElevation(elevationData, gx, gy) || 0;
      const effectiveElevation = obj.elevation !== undefined ? obj.elevation : tileElev;
      let worldZ = (effectiveElevation + (obj.z || 0)) * (gridSize * 0.5);

      // Wall-attached fixtures (torches, banners, shelves) are stored with a
      // wall elevation; their rendered height follows the wall run they were
      // mounted on so a later wall height/elevation edit keeps them attached.
      if (obj.wallAttached && obj.wallKey) {
        const wall = walls[obj.wallKey];
        const wallTypeData = WALL_TYPES[wall && typeof wall === 'object' ? wall.type : wall];
        const isDoorOrWindow = !!(wallTypeData && (wallTypeData.interactive || wallTypeData.isWindow));
        if (wall && !isDoorOrWindow) {
          let wallElevation = wall && typeof wall === 'object' ? wall.elevation : undefined;
          if (!Number.isFinite(wallElevation)) {
            const parsed = parseWallKey(obj.wallKey);
            if (parsed) {
              const midGridX = Math.floor((parsed.x1 + parsed.x2) / 2);
              const midGridY = Math.floor((parsed.y1 + parsed.y2) / 2);
              wallElevation = getTileElevation(elevationData, midGridX, midGridY) || 0;
            }
          }
          if (Number.isFinite(wallElevation)) {
            const mountOffset = (obj.elevation || 0) - (Number.isFinite(obj.wallElevation) ? obj.wallElevation : (obj.elevation || 0));
            worldZ = (wallElevation + mountOffset) * (gridSize * 0.5);
          }
        }
      }

      // Objects placed on top of another object (smart surface stacking) rest
      // on the parent's rendered top surface. The elevation level alone would
      // leave them floating, because furniture models are only a fraction of a
      // 5 ft level tall.
      if (obj.parentObjectId) {
        const parentEntry = this.propInstances.get(obj.parentObjectId);
        if (parentEntry && parentEntry.baseBox) {
          const parentScale = parentEntry.innerModel.scale.x || 1;
          const parentTopZ = parentEntry.mesh.position.z +
            parentEntry.innerModel.position.z +
            parentEntry.baseBox.max.z * parentScale;
          if (Number.isFinite(parentTopZ)) worldZ = parentTopZ;
        }
      }

      if (!entry) {
        // Create new prop instance
        const modelScene = modelCache.createInstance(def.url);
        if (!modelScene) return; // Still loading

        // glTF models have +Y as UP. In our scene, +Z is UP.
        // We rotate modelScene by +90 deg around X so the model stands upright!
        modelScene.rotation.x = Math.PI / 2;

        // Compute horizontal footprint to fit nicely into 1 grid cell
        const bbox = new THREE.Box3().setFromObject(modelScene);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxFootprint = Math.max(size.x, size.y) || 1;
        const unitScale = (gridSize / maxFootprint) * (def.scale || 1.0);

        // Kit models are not all authored with a base-centred origin: wall
        // shelves/banners hang off a wall plane, rubble/endcap pieces start at
        // one end, and a few props dip below the floor. Store the offset that
        // recentres the figure on its tile and rests its base on the ground so
        // free-placed props stop floating, sinking or sitting half a tile off.
        const normalize = {
          x: -(bbox.min.x + bbox.max.x) / 2,
          y: -(bbox.min.y + bbox.max.y) / 2,
          z: -bbox.min.z
        };

        // Wrapper group for scene positioning & ground-plane yaw rotation
        const wrapperGroup = new THREE.Group();
        wrapperGroup.name = `prop_${obj.id}`;
        wrapperGroup.add(modelScene);

        // Tag user data for raycaster interaction and enable shadows
        modelScene.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.userData = {
              objectId: obj.id,
              objectType: obj.type,
              interactive: def.interactive,
              defType: def.type
            };
          }
        });

        // Find animated parts (hinges)
        let lidNode = null;
        let doorNode = null;
        modelScene.traverse(child => {
          const lower = (child.name || '').toLowerCase();
          if (lower === 'chest_lid' || lower === 'chest_gold_lid' || lower.includes('lid')) lidNode = child;
          if (lower === 'wall_doorway_door' || (lower.includes('door') && !lower.includes('doorway'))) doorNode = child;
        });

        entry = {
          id: obj.id,
          mesh: wrapperGroup,
          innerModel: modelScene,
          unitScale,
          baseBox: bbox,
          normalize,
          def,
          lidNode,
          doorNode,
          isOpen: !!obj.isOpen,
          currentLidAngle: obj.isOpen ? -1.3 : 0,
          targetLidAngle: obj.isOpen ? -1.3 : 0,
          currentDoorAngle: obj.isOpen ? 1.57 : 0,
          targetDoorAngle: obj.isOpen ? 1.57 : 0
        };

        if (lidNode) lidNode.rotation.x = entry.currentLidAngle;
        if (doorNode) doorNode.rotation.y = entry.currentDoorAngle;

        this.group.add(wrapperGroup);
        this.propInstances.set(obj.id, entry);
      }

      // 1. Position in Three.js scene (Three.js Y is inverted relative to VTT screen-down worldY)
      entry.mesh.position.set(worldX, -worldY, worldZ + (def.offsetZ || 0));

      // 2. Rotation: yaw on the ground plane first, then pitch (X) and roll (Y)
      // tilts. Euler order 'XYZ' applies Z first, so tilts lean the prop on
      // fixed world axes instead of being re-aimed by the yaw.
      const rotDeg = (obj.rotation || 0) + (def.baseRotation || 0);
      entry.mesh.rotation.set(
        ((obj.rotationX || 0) * Math.PI) / 180,
        ((obj.rotationY || 0) * Math.PI) / 180,
        -(rotDeg * Math.PI) / 180
      );

      // 3. Dynamic scaling: updates immediately when resized on canvas or via settings!
      const currentScale = entry.unitScale * (obj.scale || 1.0);
      entry.innerModel.scale.set(currentScale, currentScale, currentScale);

      // Wall-mounted fixtures keep their authored mount origin; everything
      // else is recentred on the tile and rested on the ground plane.
      this.applyPlacementOffset(entry, currentScale, !obj.wallAttached);

      // 4. Sync open/closed state
      if (obj.isOpen !== undefined && obj.isOpen !== entry.isOpen) {
        entry.isOpen = obj.isOpen;
        if (entry.def.type === 'chest') {
          entry.targetLidAngle = entry.isOpen ? -1.3 : 0;
        } else if (entry.def.type === 'door') {
          entry.targetDoorAngle = entry.isOpen ? 1.57 : 0;
        }
      }

      // 5. Fog of War & Memory/Explored visibility
      const isFogActive = fogState.fogOfWarEnabled && !fogState.isEditorMode && (!fogState.isGMMode || fogState.viewingFromToken);
      const fog = resolveSampleFogVisibility(
        fogSamplesAroundPoint(worldX, worldY, probeOffset),
        {
          isFogActive,
          isPlayerPositionExplored: fogState.isPlayerPositionExplored,
          visibleAreaSet: fogState.visibleAreaSet,
          tileKeyAt,
          dimmedOpacity: PROP_EXPLORED_OPACITY,
          activeVisionWhenUnset: !fogState.viewingFromToken
        }
      );
      const isVisible = fog.isVisible;
      const targetOpacity = fog.targetOpacity;
      const canCastShadow = fog.canCastShadow;

      entry.mesh.visible = isVisible;
      if (isVisible) {
        entry.innerModel.traverse(child => {
          if (child.isMesh) {
            child.castShadow = canCastShadow;
            child.receiveShadow = true;
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach(m => {
                if (m.opacity !== targetOpacity) {
                  m.transparent = targetOpacity < 1.0;
                  m.opacity = targetOpacity;
                  m.needsUpdate = true;
                }
              });
            }
          }
        });
      }
    });

    // Remove deleted objects
    for (const [id, entry] of this.propInstances.entries()) {
      if (!currentIds.has(id)) {
        this.group.remove(entry.mesh);
        this.propInstances.delete(id);
      }
    }

    // Update raycastable list: only meshes that are currently visible can be clicked!
    this.refreshInteractiveMeshes();
  }

  /**
   * Placed light sources render as real 3D props so the world layer shows what
   * is producing the light instead of only a floating 2D gizmo. Types without
   * a dedicated model reuse the nearest kit piece (sunlight is ambient only).
   */
  updateLightProps(lightSources = {}, gridState = {}, fogState = {}, elevationData = {}) {
    const { gridSize = 50, gridOffsetX = 0, gridOffsetY = 0 } = gridState;
    const currentIds = new Set();

    const {
      fogOfWarEnabled = false,
      isEditorMode = false,
      isGMMode = false,
      viewingFromToken = false,
      isPlayerPositionExplored = null,
      visibleAreaSet = null
    } = fogState;
    const isFogActive = fogOfWarEnabled && (!isGMMode || viewingFromToken) && !isEditorMode;

    Object.entries(lightSources || {}).forEach(([id, source]) => {
      if (!source) return;
      const def = LIGHT_SOURCE_MODELS[source.type];
      if (!def || !def.url) return;
      if (source.enabled === false) return;

      const gx = Number.isFinite(source.x) ? source.x : source.gridX;
      const gy = Number.isFinite(source.y) ? source.y : source.gridY;
      if (!Number.isFinite(gx) || !Number.isFinite(gy)) return;

      currentIds.add(id);
      let entry = this.lightPropInstances.get(id);
      if (entry && entry.modelUrl !== def.url) {
        this.group.remove(entry.mesh);
        this.lightPropInstances.delete(id);
        entry = null;
      }

      const worldX = gx * gridSize + gridOffsetX + gridSize / 2;
      const worldY = gy * gridSize + gridOffsetY + gridSize / 2;
      const elevation = getTileElevation(elevationData, gx, gy) || 0;
      const worldZ = elevation * (gridSize * 0.5);

      if (!entry) {
        const modelScene = modelCache.createInstance(def.url);
        if (!modelScene) return; // Still loading

        modelScene.rotation.x = Math.PI / 2;

        const bbox = new THREE.Box3().setFromObject(modelScene);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxFootprint = Math.max(size.x, size.y) || 1;
        const unitScale = (gridSize / maxFootprint) * (def.scale || 1.0);

        const wrapperGroup = new THREE.Group();
        wrapperGroup.name = `lightProp_${id}`;
        wrapperGroup.add(modelScene);

        modelScene.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        entry = {
          id,
          modelUrl: def.url,
          mesh: wrapperGroup,
          innerModel: modelScene,
          unitScale,
          normalize: {
            x: -(bbox.min.x + bbox.max.x) / 2,
            y: -(bbox.min.y + bbox.max.y) / 2,
            z: -bbox.min.z
          }
        };
        this.lightPropInstances.set(id, entry);
        this.group.add(wrapperGroup);
      }

      entry.mesh.position.set(worldX, -worldY, worldZ);
      entry.mesh.rotation.z = 0;
      entry.innerModel.scale.set(entry.unitScale, entry.unitScale, entry.unitScale);
      this.applyPlacementOffset(entry, entry.unitScale, true);

      // Fog of War & Memory/Explored visibility
      let isVisible = true;
      let inActiveVision = true;
      if (isFogActive && isPlayerPositionExplored) {
        const isExplored = isPlayerPositionExplored(worldX, worldY);
        if (!isExplored) {
          isVisible = false;
        } else {
          const tileGx = Math.floor((worldX - gridOffsetX) / gridSize);
          const tileGy = Math.floor((worldY - gridOffsetY) / gridSize);
          inActiveVision = visibleAreaSet ? visibleAreaSet.has(`${tileGx},${tileGy}`) : true;
        }
      }

      entry.mesh.visible = isVisible;
      if (isVisible) {
        const targetOpacity = (isFogActive && !inActiveVision) ? 0.45 : 1.0;
        const canCastShadow = !isFogActive || inActiveVision;
        entry.innerModel.traverse(child => {
          if (child.isMesh) {
            child.castShadow = canCastShadow;
            child.receiveShadow = true;
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach(m => {
                if (m.opacity !== targetOpacity) {
                  m.transparent = targetOpacity < 1.0;
                  m.opacity = targetOpacity;
                  m.needsUpdate = true;
                }
              });
            }
          }
        });
      }
    });

    for (const [id, entry] of this.lightPropInstances.entries()) {
      if (!currentIds.has(id)) {
        this.group.remove(entry.mesh);
        this.lightPropInstances.delete(id);
      }
    }
  }

  updateWallDoors(wallData = {}, gridState = {}, fogState = {}, elevationData = {}) {
    const { gridSize = 50, gridOffsetX = 0, gridOffsetY = 0 } = gridState;
    const currentDoorKeys = new Set();
    const doorwayDef = MODEL_REGISTRY.wall_doorway;
    const doorwayUrl = doorwayDef?.url || '/assets/models/dungeon/wall_doorway.glb';

    let gridSystem = null;
    try {
      gridSystem = getGridSystem();
    } catch (e) {
      gridSystem = null;
    }
    const { gridType = 'square' } = gridSystem ? gridSystem.getGridState() : {};
    const tileKeyAt = createTileKeyResolver(gridSystem, gridSize, gridOffsetX, gridOffsetY);
    const probeOffset = fogProbeOffset(gridSize);

    const {
      fogOfWarEnabled = false,
      isEditorMode = false,
      isGMMode = false,
      viewingFromToken = false,
      isPlayerPositionExplored = null,
      visibleAreaSet = null
    } = fogState;

    const isFogActive = fogOfWarEnabled && (!isGMMode || viewingFromToken) && !isEditorMode;

    Object.entries(wallData).forEach(([key, wall]) => {
      const type = typeof wall === 'string' ? wall : wall?.type;
      if (!type || (!type.includes('door') && type !== 'wall_doorway')) return;

      const parsed = parseWallKey(key);
      if (!parsed) return;

      const ends = gridSystem
        ? getWallWorldEndpoints(parsed, gridSystem, gridType, wall)
        : {
            start: { x: parsed.x1 * gridSize + gridOffsetX, y: parsed.y1 * gridSize + gridOffsetY },
            end: { x: parsed.x2 * gridSize + gridOffsetX, y: parsed.y2 * gridSize + gridOffsetY }
          };
      if (!ends || !ends.start || !ends.end) return;

      currentDoorKeys.add(key);
      let entry = this.wallDoorInstances.get(key);

      const worldX = (ends.start.x + ends.end.x) / 2;
      const worldY = (ends.start.y + ends.end.y) / 2;

      let elevation = wall && typeof wall === 'object' ? wall.elevation : undefined;
      if (!Number.isFinite(elevation)) {
        const midGridX = Math.floor((parsed.x1 + parsed.x2) / 2);
        const midGridY = Math.floor((parsed.y1 + parsed.y2) / 2);
        elevation = getTileElevation(elevationData, midGridX, midGridY) || 0;
      }
      const worldZ = elevation * (gridSize * 0.5);

      const dx = ends.end.x - ends.start.x;
      const dy = ends.end.y - ends.start.y;
      // In Three.js: +Y is North, so screen dy is inverted (-dy)
      const angleRad = Math.atan2(-dy, dx);
      // Doors wrap masonry to the full host wall height, so they scale with the
      // same wall-body height as the modular wall segments.
      const heightWorld = getWallBodyHeightWorld(wall, gridSize);

      if (!entry) {
        const modelScene = modelCache.createInstance(doorwayUrl);
        if (!modelScene) return; // Still loading

        // Upright orientation
        modelScene.rotation.x = Math.PI / 2;

        const wrapperGroup = new THREE.Group();
        wrapperGroup.name = `walldoor_${key}`;
        wrapperGroup.add(modelScene);

        // Tag user data for raycasting and enable shadows
        modelScene.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.userData = {
              wallKey: key,
              isWallDoor: true,
              ...parsed,
              interactive: true,
              defType: 'door'
            };
          }
        });

        let doorNode = null;
        modelScene.traverse(child => {
          if (child.name === 'wall_doorway_door') doorNode = child;
        });

        const isDoorOpen = wall?.state === 'open';

        entry = {
          key,
          ...parsed,
          mesh: wrapperGroup,
          innerModel: modelScene,
          doorNode,
          isOpen: isDoorOpen,
          currentDoorAngle: isDoorOpen ? 1.57 : 0,
          targetDoorAngle: isDoorOpen ? 1.57 : 0
        };

        if (doorNode) doorNode.rotation.y = entry.currentDoorAngle;

        this.group.add(wrapperGroup);
        this.wallDoorInstances.set(key, entry);
      }

      entry.mesh.position.set(worldX, -worldY, worldZ);
      entry.mesh.rotation.z = angleRad;
      entry.innerModel.scale.set(
        gridSize / WALL_MODEL_UNIT,
        heightWorld / WALL_MODEL_UNIT,
        gridSize / WALL_MODEL_UNIT
      );

      const isDoorOpen = wall?.state === 'open';
      if (isDoorOpen !== entry.isOpen) {
        entry.isOpen = isDoorOpen;
        entry.targetDoorAngle = entry.isOpen ? 1.57 : 0;
      }

      // Fog of War check
      const doorLength = Math.max(1e-4, Math.hypot(dx, dy));
      const fog = resolveSampleFogVisibility(
        fogSamplesAlongSegment({
          centerX: worldX,
          centerY: worldY,
          ux: dx / doorLength,
          uy: dy / doorLength,
          halfLength: doorLength / 2,
          offset: probeOffset
        }),
        {
          isFogActive,
          isPlayerPositionExplored,
          visibleAreaSet,
          tileKeyAt,
          dimmedOpacity: PROP_EXPLORED_OPACITY,
          activeVisionWhenUnset: !viewingFromToken
        }
      );
      const isVisible = fog.isVisible;
      const targetOpacity = fog.targetOpacity;
      const canCastShadow = fog.canCastShadow;

      entry.mesh.visible = isVisible;
      if (isVisible) {
        entry.innerModel.traverse(child => {
          if (child.isMesh) {
            child.castShadow = canCastShadow;
            child.receiveShadow = true;
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach(m => {
                if (m.opacity !== targetOpacity) {
                  m.transparent = targetOpacity < 1.0;
                  m.opacity = targetOpacity;
                  m.needsUpdate = true;
                }
              });
            }
          }
        });
      }
    });

    // Remove deleted wall doors
    for (const [key, entry] of this.wallDoorInstances.entries()) {
      if (!currentDoorKeys.has(key)) {
        this.group.remove(entry.mesh);
        this.wallDoorInstances.delete(key);
      }
    }

    this.refreshInteractiveMeshes();
  }

  refreshInteractiveMeshes() {
    this.interactiveMeshes = [];
    this.propInstances.forEach(entry => {
      if (entry.mesh.visible && entry.def.interactive) {
        entry.mesh.traverse(child => {
          if (child.isMesh) this.interactiveMeshes.push(child);
        });
      }
    });
    this.wallDoorInstances.forEach(entry => {
      if (entry.mesh.visible) {
        entry.mesh.traverse(child => {
          if (child.isMesh) this.interactiveMeshes.push(child);
        });
      }
    });
  }

  /**
   * Animate opening/closing lids and doors smoothly
   * Returns true if animations are actively playing
   */
  updateAnimations(delta = 0.016) {
    let hasActiveAnimations = false;
    const speed = 6.0; // Lerp speed

    // Prop animations (chests/standalone doors)
    this.propInstances.forEach(entry => {
      // Chest lid animation
      if (entry.lidNode && Math.abs(entry.currentLidAngle - entry.targetLidAngle) > 0.005) {
        entry.currentLidAngle += (entry.targetLidAngle - entry.currentLidAngle) * Math.min(1, delta * speed);
        entry.lidNode.rotation.x = entry.currentLidAngle;
        hasActiveAnimations = true;
      }

      // Door swing animation
      if (entry.doorNode && Math.abs(entry.currentDoorAngle - entry.targetDoorAngle) > 0.005) {
        entry.currentDoorAngle += (entry.targetDoorAngle - entry.currentDoorAngle) * Math.min(1, delta * speed);
        entry.doorNode.rotation.y = entry.currentDoorAngle;
        hasActiveAnimations = true;
      }
    });

    // Wall door animations
    this.wallDoorInstances.forEach(entry => {
      if (entry.doorNode && Math.abs(entry.currentDoorAngle - entry.targetDoorAngle) > 0.005) {
        entry.currentDoorAngle += (entry.targetDoorAngle - entry.currentDoorAngle) * Math.min(1, delta * speed);
        entry.doorNode.rotation.y = entry.currentDoorAngle;
        hasActiveAnimations = true;
      }
    });

    return hasActiveAnimations;
  }

  toggleObject(objectId) {
    // Check if it's a regular prop
    const propEntry = this.propInstances.get(objectId);
    if (propEntry && propEntry.def.interactive) {
      propEntry.isOpen = !propEntry.isOpen;
      if (propEntry.def.type === 'chest') {
        propEntry.targetLidAngle = propEntry.isOpen ? -1.3 : 0;
      } else if (propEntry.def.type === 'door') {
        propEntry.targetDoorAngle = propEntry.isOpen ? 1.57 : 0;
      }
      return { id: objectId, isOpen: propEntry.isOpen, type: propEntry.def.type };
    }

    // Check if it's a wall door
    const wallDoorEntry = this.wallDoorInstances.get(objectId);
    if (wallDoorEntry) {
      wallDoorEntry.isOpen = !wallDoorEntry.isOpen;
      wallDoorEntry.targetDoorAngle = wallDoorEntry.isOpen ? 1.57 : 0;
      return {
        id: objectId,
        isOpen: wallDoorEntry.isOpen,
        isWallDoor: true,
        x1: wallDoorEntry.x1,
        y1: wallDoorEntry.y1,
        x2: wallDoorEntry.x2,
        y2: wallDoorEntry.y2,
        type: 'door'
      };
    }

    return null;
  }

  getInteractiveMeshes() {
    return this.interactiveMeshes;
  }

  /**
   * Offset the inner model so its footprint is centred on the wrapper origin
   * and its base sits on the ground. The offset lives on the inner model, so
   * it must be re-applied (scaled) whenever the prop's scale changes.
   */
  applyPlacementOffset(entry, scale, grounded) {
    if (!entry || !entry.normalize || !entry.innerModel) return;
    if (!grounded) {
      entry.innerModel.position.set(0, 0, 0);
      return;
    }
    const { x, y, z } = entry.normalize;
    entry.innerModel.position.set(x * scale, y * scale, z * scale);
  }

  /**
   * World-space corners of a rendered prop model, used by the 2D selection
   * chrome to tightly wrap the 3D figure.
   *
   * `baseBox` is the model AABB captured at instance creation (unit scale, in
   * wrapper-local space), so current scale/yaw/elevation can be applied without
   * re-traversing the model graph on every call.
   */
  getWorldBoundsCorners(objectId) {
    const entry = this.propInstances.get(objectId);
    if (!entry || !entry.baseBox || entry.baseBox.isEmpty()) return null;

    const scale = entry.innerModel.scale.x || 1;
    entry.mesh.updateWorldMatrix(true, false);

    const box = entry.baseBox.clone();
    box.min.multiplyScalar(scale);
    box.max.multiplyScalar(scale);
    // The placement offset is applied to the inner model in wrapper space.
    box.min.add(entry.innerModel.position);
    box.max.add(entry.innerModel.position);
    box.applyMatrix4(entry.mesh.matrixWorld);

    const corners = [];
    for (const x of [box.min.x, box.max.x]) {
      for (const y of [box.min.y, box.max.y]) {
        for (const z of [box.min.z, box.max.z]) {
          // Convert Three.js space (y up) back to VTT world space (y down).
          corners.push({ x, y: -y, z });
        }
      }
    }
    return corners;
  }

  dispose() {
    clearPropWorldBoundsResolver(this);
    this.scene.remove(this.group);
    this.propInstances.clear();
    this.wallDoorInstances.clear();
    this.lightPropInstances.clear();
    this.interactiveMeshes = [];
  }
}
