import * as THREE from 'three';
import modelCache from '../../../services/ModelCacheService';
import { PROFESSIONAL_TERRAIN_TYPES } from '../../../store/levelEditorStore';
import { getTileElevation, resolveRampDirection } from '../../../utils/ElevationUtils';
import { getRampDirectionDelta } from '../../../utils/RampGeometry';
import {
  TERRAIN_UV_PER_CELL,
  getTerrainTileTexture,
  getLiquidSurfaceTextures
} from './terrainMaterialTextures';

// Kenney Nature Kit river tiles (CC0, see models/water/CREDITS.md) draw the
// ground, banks and water as separate primitives. Banks are re-tinted onto the
// level editor's terrain palette so a shoreline sits in the same palette as the
// terrain painted next to it; `dim` keeps the two dirt tones apart.
const WATER_SHORE_BANK_PALETTE = {
  grass: { type: 'grass', dim: 1.12 },
  dirt: { type: 'dirt', dim: 1.04 },
  dirtDark: { type: 'dirt', dim: 0.78 },
  stone: 'stone'
};

// Lily pads keep the kit's flower colour and take the palette's leaves.
const WATER_DECOR_PALETTE = {
  leafsGreen: 'grass',
  leafsDark: { type: 'grass', dim: 0.78 }
};

export const TERRAIN_MODEL_REGISTRY = {
  stone_floor: {
    url: '/assets/models/dungeon/floor_stone.glb',
    scale: 1.0,
    baseZ: 0
  },
  stone_tile_lowpoly: {
    url: '/assets/models/terrain/stone_tile_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    baseZFrac: 0.06,
    mapTintBase: { r: 0.541, g: 0.525, b: 0.502 }
  },
  stone_rocks: {
    url: '/assets/models/dungeon/floor_stone_rocks.glb',
    scale: 1.0,
    baseZ: 0
  },
  dirt: {
    url: '/assets/models/dungeon/floor_dirt.glb',
    scale: 1.0,
    baseZ: 0
  },
  dirt_path_lowpoly: {
    url: '/assets/models/terrain/dirt_path_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.49, g: 0.518, b: 0.275 }
  },
  dirt_path_straight_lowpoly: {
    url: '/assets/models/terrain/dirt_path_straight_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.49, g: 0.518, b: 0.275 }
  },
  dirt_path_corner_lowpoly: {
    url: '/assets/models/terrain/dirt_path_corner_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.49, g: 0.518, b: 0.275 }
  },
  dirt_path_t_lowpoly: {
    url: '/assets/models/terrain/dirt_path_t_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.49, g: 0.518, b: 0.275 }
  },
  dirt_path_cross_lowpoly: {
    url: '/assets/models/terrain/dirt_path_cross_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.49, g: 0.518, b: 0.275 }
  },
  dirt_path_end_lowpoly: {
    url: '/assets/models/terrain/dirt_path_end_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.49, g: 0.518, b: 0.275 }
  },
  lava_v2_lowpoly: {
    url: '/assets/models/terrain/lava_v2_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 1.0, g: 0.271, b: 0.0 },
    variants: ['lava_v2_lowpoly'],
    rotate4: true
  },
  acid_v2_lowpoly: {
    url: '/assets/models/terrain/acid_v2_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.196, g: 0.804, b: 0.196 },
    variants: ['acid_v2_lowpoly'],
    rotate4: true
  },
  ice_v2_lowpoly: {
    url: '/assets/models/terrain/ice_v2_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.69, g: 0.878, b: 0.902 },
    variants: ['ice_v2_lowpoly'],
    rotate4: true
  },
  crystal_v2_lowpoly: {
    url: '/assets/models/terrain/crystal_v2_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.878, g: 1.0, b: 1.0 },
    variants: ['crystal_v2_lowpoly'],
    rotate4: true
  },
  gold_lowpoly: {
    url: '/assets/models/terrain/gold_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 1.0, g: 0.843, b: 0.0 },
    variants: ['gold_lowpoly'],
    rotate4: true
  },
  cobblestone_lowpoly: {
    url: '/assets/models/terrain/cobblestone_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.541, g: 0.541, b: 0.541 },
    variants: ['cobblestone_lowpoly'],
    rotate4: true
  },
  cobble_road_lowpoly: {
    url: '/assets/models/terrain/cobble_road_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.459, g: 0.459, b: 0.459 },
    variants: ['cobble_road_lowpoly'],
    rotate4: true
  },
  cobble_road_straight_lowpoly: {
    url: '/assets/models/terrain/cobble_road_straight_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.459, g: 0.459, b: 0.459 }
  },
  cobble_road_corner_lowpoly: {
    url: '/assets/models/terrain/cobble_road_corner_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.459, g: 0.459, b: 0.459 }
  },
  cobble_road_t_lowpoly: {
    url: '/assets/models/terrain/cobble_road_t_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.459, g: 0.459, b: 0.459 }
  },
  cobble_road_cross_lowpoly: {
    url: '/assets/models/terrain/cobble_road_cross_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.459, g: 0.459, b: 0.459 }
  },
  cobble_road_end_lowpoly: {
    url: '/assets/models/terrain/cobble_road_end_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.459, g: 0.459, b: 0.459 }
  },
  wooden_floor_lowpoly: {
    url: '/assets/models/terrain/wooden_floor_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.545, g: 0.271, b: 0.075 },
    variants: ['wooden_floor_lowpoly'],
    rotate4: true
  },
  boardwalk_lowpoly: {
    url: '/assets/models/terrain/boardwalk_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.62, g: 0.427, b: 0.259 },
    variants: ['boardwalk_lowpoly'],
    rotate4: true
  },
  dark_wood_lowpoly: {
    url: '/assets/models/terrain/dark_wood_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.329, g: 0.212, b: 0.129 },
    variants: ['dark_wood_lowpoly'],
    rotate4: true
  },
  weathered_stone_lowpoly: {
    url: '/assets/models/terrain/weathered_stone_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.431, g: 0.439, b: 0.431 },
    variants: ['weathered_stone_lowpoly'],
    rotate4: true
  },
  marble_lowpoly: {
    url: '/assets/models/terrain/marble_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.941, g: 0.941, b: 0.941 },
    variants: ['marble_lowpoly'],
    rotate4: true
  },
  dungeon_lowpoly: {
    url: '/assets/models/terrain/dungeon_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.353, g: 0.353, b: 0.353 },
    variants: ['dungeon_lowpoly'],
    rotate4: true
  },
  fungal_lowpoly: {
    url: '/assets/models/terrain/fungal_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.482, g: 0.408, b: 0.933 },
    variants: ['fungal_lowpoly'],
    rotate4: true
  },
  swamp_lowpoly: {
    url: '/assets/models/terrain/swamp_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.333, g: 0.42, b: 0.184 },
    variants: ['swamp_lowpoly'],
    rotate4: true
  },
  rocky_dirt_lowpoly: {
    url: '/assets/models/terrain/rocky_dirt_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.478, g: 0.353, b: 0.133 },
    variants: ['rocky_dirt_lowpoly'],
    rotate4: true
  },
  overgrown_dirt_lowpoly: {
    url: '/assets/models/terrain/overgrown_dirt_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.396, g: 0.42, b: 0.231 },
    variants: ['overgrown_dirt_lowpoly'],
    rotate4: true
  },
  grass_lowpoly_a: {
    url: '/assets/models/terrain/grass_lowpoly_a.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.29, g: 0.486, b: 0.349 },
    variants: ['grass_lowpoly_a', 'grass_lowpoly_b'],
    rotate4: true
  },
  grass_lowpoly_b: {
    url: '/assets/models/terrain/grass_lowpoly_b.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.29, g: 0.486, b: 0.349 }
  },
  dirt_lowpoly_a: {
    url: '/assets/models/terrain/dirt_lowpoly_a.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.545, g: 0.412, b: 0.078 },
    variants: ['dirt_lowpoly_a', 'dirt_lowpoly_b'],
    rotate4: true
  },
  dirt_lowpoly_b: {
    url: '/assets/models/terrain/dirt_lowpoly_b.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.545, g: 0.412, b: 0.078 }
  },
  sand_lowpoly_a: {
    url: '/assets/models/terrain/sand_lowpoly_a.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.761, g: 0.698, b: 0.502 },
    variants: ['sand_lowpoly_a', 'sand_lowpoly_b'],
    rotate4: true
  },
  sand_lowpoly_b: {
    url: '/assets/models/terrain/sand_lowpoly_b.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.761, g: 0.698, b: 0.502 }
  },
  stone_lowpoly_a: {
    url: '/assets/models/terrain/stone_lowpoly_a.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.42, g: 0.42, b: 0.42 },
    variants: ['stone_lowpoly_a', 'stone_lowpoly_b'],
    rotate4: true
  },
  stone_lowpoly_b: {
    url: '/assets/models/terrain/stone_lowpoly_b.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.42, g: 0.42, b: 0.42 }
  },
  snow_lowpoly_a: {
    url: '/assets/models/terrain/snow_lowpoly_a.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 1.0, g: 1.0, b: 1.0 },
    variants: ['snow_lowpoly_a', 'snow_lowpoly_b'],
    rotate4: true
  },
  snow_lowpoly_b: {
    url: '/assets/models/terrain/snow_lowpoly_b.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 1.0, g: 1.0, b: 1.0 }
  },
  mud_lowpoly_a: {
    url: '/assets/models/terrain/mud_lowpoly_a.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.396, g: 0.263, b: 0.129 },
    variants: ['mud_lowpoly_a', 'mud_lowpoly_b'],
    rotate4: true
  },
  mud_lowpoly_b: {
    url: '/assets/models/terrain/mud_lowpoly_b.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.396, g: 0.263, b: 0.129 }
  },
  dirt_rocky: {
    url: '/assets/models/dungeon/floor_dirt_rocky.glb',
    scale: 1.0,
    baseZ: 0
  },
  wood_floor: {
    url: '/assets/models/dungeon/floor_wood.glb',
    scale: 1.0,
    baseZ: 0
  },
  wood_floor_dark: {
    url: '/assets/models/dungeon/floor_wood_dark.glb',
    scale: 1.0,
    baseZ: 0
  },
  grate: {
    url: '/assets/models/dungeon/floor_grate.glb',
    scale: 1.0,
    baseZ: 0
  },
  grate_open: {
    url: '/assets/models/dungeon/floor_grate_open.glb',
    scale: 1.0,
    baseZ: 0
  },
  spikes: {
    url: '/assets/models/dungeon/floor_spikes.glb',
    scale: 1.0,
    baseZ: 0
  },
  grate_floor: {
    url: '/assets/models/dungeon/floor_grate.glb',
    scale: 1.0,
    baseZ: 0
  },
  spike_trap: {
    url: '/assets/models/dungeon/floor_spikes.glb',
    scale: 1.0,
    baseZ: 0
  },
  dark_wood: {
    url: '/assets/models/dungeon/floor_wood_dark.glb',
    scale: 1.0,
    baseZ: 0
  },
  weathered_stone: {
    url: '/assets/models/dungeon/floor_stone_rocks.glb',
    scale: 1.0,
    baseZ: 0
  },
  rocky_dirt: {
    url: '/assets/models/dungeon/floor_dirt_rocky.glb',
    scale: 1.0,
    baseZ: 0
  },
  foundation: {
    url: '/assets/models/dungeon/floor_foundation.glb',
    scale: 1.0,
    baseZ: 0
  },
  stairs: {
    url: '/assets/models/dungeon/stairs_stone.glb',
    scale: 1.0,
    baseZ: 0
  },
  stairs_narrow: {
    url: '/assets/models/dungeon/stairs_narrow.glb',
    scale: 1.0,
    baseZ: 0
  },
  stairs_wide: {
    url: '/assets/models/dungeon/stairs_wide.glb',
    scale: 1.0,
    baseZ: 0
  },
  stairs_wood: {
    url: '/assets/models/dungeon/stairs_wood.glb',
    scale: 1.0,
    baseZ: 0
  },
  stone_wall: {
    url: '/assets/models/dungeon/wall_stone_straight.glb',
    scale: 1.0,
    baseZ: 0
  },
  // Prototype kit plates ship a flat baseColorFactor only. The authored 2D tile
  // art is mapped onto them at kit density (one texture per cell) so roads and
  // boardwalks stop reading as one flat slab of colour.
  road_stone: {
    url: '/assets/models/dungeon/road_stone.glb',
    scale: 1.0,
    baseZ: 0,
    tileMap: '/assets/tiles/CobbleRoad1.png',
    mapTintBase: { r: 0.487, g: 0.471, b: 0.451 }
  },
  road_stone_corner: {
    url: '/assets/models/dungeon/road_stone_corner.glb',
    scale: 1.0,
    baseZ: 0
  },
  road_stone_bend: {
    url: '/assets/models/dungeon/road_stone_bend.glb',
    scale: 1.0,
    baseZ: 0
  },
  wooden_planks: {
    url: '/assets/models/dungeon/wooden_planks.glb',
    scale: 1.0,
    baseZ: 0,
    tileMap: '/assets/tiles/WoodenPlanks1.png',
    mapTintBase: { r: 0.680, g: 0.518, b: 0.354 }
  },
  wooden_planks_half: {
    url: '/assets/models/dungeon/wooden_planks_half.glb',
    scale: 1.0,
    baseZ: 0,
    tileMap: '/assets/tiles/WoodenPlanks1.png',
    mapTintBase: { r: 0.680, g: 0.518, b: 0.354 }
  },
  // Scattered flagstones leave gaps between the pieces, so the model gets a
  // ground slab underneath and a dark toon outline so it reads as stones set
  // into the ground instead of dark blobs floating on the grid.
  road_graveyard: {
    url: '/assets/models/dungeon/road_graveyard.glb',
    scale: 1.0,
    baseZ: 0,
    tileMap: '/assets/tiles/StonePath1.png',
    mapTintBase: { r: 0.527, g: 0.497, b: 0.466 },
    bedModelKey: 'path_bed',
    outline: { scale: 1.06, lift: 0.008 }
  },
  // KayKit-style water tiles are flat slabs whose ground, banks and water are
  // separate primitives, so they need multi-part instancing + per-part tints
  // (see WATER_SHORE_PIECES / buildPartMaterial).
  ground_riverOpen: {
    url: '/assets/models/water/water_open_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    doubleSided: true,
    // Water: optically flat, so it must not drop a hard shadow on whatever sits
    // below it (visible whenever the cell is on a higher elevation level).
    noShadow: true,
    liquidParts: ['water']
  },
  ground_riverSide: {
    url: '/assets/models/water/water_side_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    doubleSided: true,
    liquidParts: ['water'],
    partPalette: WATER_SHORE_BANK_PALETTE
  },
  ground_riverStraight: {
    url: '/assets/models/water/water_straight_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    doubleSided: true,
    liquidParts: ['water'],
    partPalette: WATER_SHORE_BANK_PALETTE
  },
  ground_riverCorner: {
    url: '/assets/models/water/water_corner_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    doubleSided: true,
    liquidParts: ['water'],
    partPalette: WATER_SHORE_BANK_PALETTE
  },
  ground_riverEndClosed: {
    url: '/assets/models/water/water_end_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    doubleSided: true,
    liquidParts: ['water'],
    partPalette: WATER_SHORE_BANK_PALETTE
  },
  ground_riverTile: {
    url: '/assets/models/water/water_pond_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    doubleSided: true,
    liquidParts: ['water'],
    partPalette: WATER_SHORE_BANK_PALETTE
  },
  ground_riverRocks: {
    url: '/assets/models/water/water_rocks_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    doubleSided: true,
    liquidParts: ['water'],
    partPalette: WATER_SHORE_BANK_PALETTE
  },
  // Water decor scattered on open water (see LIQUID_DECOR_TYPES): lily pads
  // drift on the surface, tinted to the terrain palette leaves. The registry
  // fits a model's footprint to one whole cell, so decor carries its *authored*
  // fraction of a cell here (the kit draws a lily pad at ~0.3 units).
  water_lily_large: {
    url: '/assets/models/water/lily_large.glb',
    scale: 0.3,
    baseZ: 0,
    doubleSided: true,
    partPalette: WATER_DECOR_PALETTE
  },
  water_lily_small: {
    url: '/assets/models/water/lily_small.glb',
    scale: 0.22,
    baseZ: 0,
    doubleSided: true,
    partPalette: WATER_DECOR_PALETTE
  },
  // Procedural unit plate (no GLB): the ground slab under gap models. Plates
  // use 0..1 UVs, so one texture covers exactly one cell.
  path_bed: {
    plate: true,
    tileMap: '/assets/tiles/RockyDirt1.png',
    tileRepeat: 1,
    baseZ: -0.06
  },
  // Direct-id aliases so custom defs that carry `modelKey: 'cobblestone_road'`
  // or `modelKey: 'stone_path'` land on the same configured look.
  cobblestone_road: {
    url: '/assets/models/dungeon/road_stone.glb',
    scale: 1.0,
    baseZ: 0,
    tileMap: '/assets/tiles/CobbleRoad1.png',
    mapTintBase: { r: 0.487, g: 0.471, b: 0.451 }
  },
  stone_path: {
    url: '/assets/models/dungeon/road_graveyard.glb',
    scale: 1.0,
    baseZ: 0,
    tileMap: '/assets/tiles/StonePath1.png',
    mapTintBase: { r: 0.527, g: 0.497, b: 0.466 },
    bedModelKey: 'path_bed',
    outline: { scale: 1.06, lift: 0.008 }
  },
  cobblestone: {
    url: '/assets/models/dungeon/floor_stone.glb',
    scale: 1.0,
    baseZ: 0
  },
  overgrown_dirt: {
    url: '/assets/models/dungeon/floor_tile_small_weeds_A.glb',
    scale: 1.0,
    baseZ: 0
  },
  // Generic low-poly tiles shared by terrain types that have no dedicated kit
  // model. They carry the kit's palette swatch colours and are re-tinted with
  // the terrain palette colour (see resolveTerrainLook).
  tile_small: {
    url: '/assets/models/dungeon/floor_tile_small.glb',
    scale: 1.0,
    baseZ: 0
  },
  tile_small_broken: {
    url: '/assets/models/dungeon/floor_tile_small_broken_A.glb',
    scale: 1.0,
    baseZ: 0
  },
  tile_weeds: {
    url: '/assets/models/dungeon/floor_tile_small_weeds_A.glb',
    scale: 1.0,
    baseZ: 0
  },
  big_grate: {
    url: '/assets/models/dungeon/floor_tile_big_grate.glb',
    scale: 1.0,
    baseZ: 0
  },
  big_spikes: {
    url: '/assets/models/dungeon/floor_tile_big_spikes.glb',
    scale: 1.0,
    baseZ: 0
  },
  extralarge_grates: {
    url: '/assets/models/dungeon/floor_tile_extralarge_grates.glb',
    scale: 1.0,
    baseZ: 0
  },
  wood_floor_large: {
    url: '/assets/models/dungeon/floor_wood_large.glb',
    scale: 1.0,
    baseZ: 0
  },
  wood_floor_large_dark: {
    url: '/assets/models/dungeon/floor_wood_large_dark.glb',
    scale: 1.0,
    baseZ: 0
  },
  quaternius_wood: {
    url: '/assets/models/terrain/quaternius_wood_floor.glb',
    scale: 1.0,
    baseZ: 0
  },
  kaykit_cobble: {
    url: '/assets/models/terrain/kaykit_cobble_path.glb',
    scale: 1.0,
    baseZ: 0
  },
  dungeon_brick: {
    url: '/assets/models/terrain/dungeon_brick_floor.glb',
    scale: 1.0,
    baseZ: 0
  },
  dungeon_modular: {
    url: '/assets/models/terrain/dungeon_modular_floor.glb',
    scale: 1.0,
    baseZ: 0
  },
  pit_lowpoly: {
    url: '/assets/models/terrain/pit_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.18, g: 0.18, b: 0.18 },
    variants: ['pit_lowpoly'],
    rotate4: true
  },
  abyss_lowpoly: {
    url: '/assets/models/terrain/abyss_lowpoly.glb',
    scale: 1.0,
    baseZ: 0,
    mapTintBase: { r: 0.08, g: 0.05, b: 0.1 },
    variants: ['abyss_lowpoly'],
    rotate4: true
  }
};

// Shore pieces: `banks` are the local model-space edges that carry a bank
// (measured from the kit renders). Local axes map to map directions through
// SHORE_LOCAL_TO_WORLD because instances are rotated +90 deg about X to turn the
// glTF Y-up axis into world Z-up.
export const WATER_SHORE_PIECES = {
  open: { modelKey: 'ground_riverOpen', banks: [] },
  // One-bank cells all use this piece so a lakeside run shares one bank
  // contour. Its water sits flush with the slab top Ã¢â‚¬â€ `ground_riverSideOpen`
  // (water recessed 0.05 lower) is deliberately NOT used: mixing water levels
  // inside one body shows bright side-wall slivers and stepped banks.
  side: { modelKey: 'ground_riverSide', banks: ['-z'] },
  straight: { modelKey: 'ground_riverStraight', banks: ['+x', '-x'] },
  rocks: { modelKey: 'ground_riverRocks', banks: ['+x', '-x'] },
  corner: { modelKey: 'ground_riverCorner', banks: ['-x', '-z'] },
  end: { modelKey: 'ground_riverEndClosed', banks: ['+x', '-x', '-z'] },
  pond: { modelKey: 'ground_riverTile', banks: ['+x', '-x', '+z', '-z'] }
};

const SHORE_LOCAL_TO_WORLD = {
  0: { '+x': 'east', '-x': 'west', '+z': 'south', '-z': 'north' },
  90: { '+x': 'north', '-x': 'south', '+z': 'east', '-z': 'west' },
  180: { '+x': 'west', '-x': 'east', '+z': 'north', '-z': 'south' },
  270: { '+x': 'south', '-x': 'north', '+z': 'west', '-z': 'east' }
};

const SHORE_ROTATIONS = [0, 90, 180, 270];

/**
 * Shoreline tile + rotation for a water cell, chosen from the map directions
 * that border land. A cell with no land neighbours is open water: its surface
 * comes from the animated liquid sheet, not from a tile. `rocky` swaps every
 * third straight run for the rocky-rapids variant; oceans keep plain straights
 * (no rapids in open sea).
 */
export function resolveWaterShorePiece(landDirections = [], seed = 0, { rocky = true } = {}) {
  const land = [...new Set(landDirections)].sort();
  if (land.length === 0) {
    return { modelKey: WATER_SHORE_PIECES.open.modelKey, rotationDeg: 0, isOpen: true };
  }

  let key;
  if (land.length === 4) {
    key = 'pond';
  } else if (land.length === 3) {
    key = 'end';
  } else if (land.length === 2) {
    const opposite = (land.includes('north') && land.includes('south')) ||
      (land.includes('east') && land.includes('west'));
    // Every third straight run gets the rocky-rapids variant.
    key = opposite ? ((rocky && seed % 3 === 0) ? 'rocks' : 'straight') : 'corner';
  } else {
    key = 'side';
  }

  const piece = WATER_SHORE_PIECES[key];
  for (const rotationDeg of SHORE_ROTATIONS) {
    const rotated = piece.banks.map((bank) => SHORE_LOCAL_TO_WORLD[rotationDeg][bank]).sort();
    if (rotated.length === land.length && rotated.every((dir, i) => dir === land[i])) {
      return { modelKey: piece.modelKey, rotationDeg, isOpen: false };
    }
  }
  return { modelKey: WATER_SHORE_PIECES.open.modelKey, rotationDeg: 0, isOpen: true };
}

// Terrain types rendered as a continuous sunken pit: adjacent cells merge into
// one region with a single rim, so a 2x2 pit paints as one big pit, not four
// single-cell holes with internal walls.
export const PIT_TYPES = {
  pit: { depth: -0.22, floor: [0.03, 0.025, 0.035], wall: [0.16, 0.135, 0.12] },
  abyss: { depth: -0.4, floor: [0.07, 0.02, 0.12], wall: [0.13, 0.1, 0.19] }
};

// Terrain types rendered as a liquid body with kit shorelines. Cells touching
// land get a banked tile; open water cells are covered by the liquid sheet.
// Water and ocean only: the level editor's TileOverlay draws animated DOM tiles
// for lava/acid/ice (it is not gated on the 3D toggle), so a 3D shoreline for
// those types would be hidden underneath it.
export const WATER_SHORE_TYPES = { water: true, ocean: true };

// Liquids that get drifting surface decor (lilies) on their open cells.
// Oceans stay clear of pond plants.
export const LIQUID_DECOR_TYPES = { water: true };
export const WATER_DECOR_MODELS = ['water_lily_large', 'water_lily_small'];
export const WATER_DECOR_CHANCE = 0.14;

// Intelligent auto-tiling for roads and paths based on orthogonal connections.
export const CONNECTING_TERRAIN_TYPES = {
  cobblestone_road: {
    family: 'cobblestone_road',
    straight: 'cobble_road_straight_lowpoly',
    corner: 'cobble_road_corner_lowpoly',
    t: 'cobble_road_t_lowpoly',
    cross: 'cobble_road_cross_lowpoly',
    end: 'cobble_road_end_lowpoly',
    default: 'cobble_road_lowpoly'
  },
  dirt_path: {
    family: 'dirt_path',
    straight: 'dirt_path_straight_lowpoly',
    corner: 'dirt_path_corner_lowpoly',
    t: 'dirt_path_t_lowpoly',
    cross: 'dirt_path_cross_lowpoly',
    end: 'dirt_path_end_lowpoly',
    default: 'dirt_path_lowpoly'
  }
};

export function resolveConnectingPiece(typeId, gx, gy, terrainData = {}) {
  const config = CONNECTING_TERRAIN_TYPES[typeId];
  if (!config) return null;

  const isConnected = (nx, ny) => {
    const raw = terrainData[`${nx},${ny}`];
    const id = typeof raw === 'string' ? raw : raw?.type;
    if (!id) return false;
    return id === typeId || CONNECTING_TERRAIN_TYPES[id]?.family === config.family;
  };

  const n = isConnected(gx, gy - 1);
  const e = isConnected(gx + 1, gy);
  const s = isConnected(gx, gy + 1);
  const w = isConnected(gx - 1, gy);

  const count = (n ? 1 : 0) + (e ? 1 : 0) + (s ? 1 : 0) + (w ? 1 : 0);

  if (count === 4) {
    return { modelKey: config.cross, rotationDeg: 0 };
  }
  if (count === 3) {
    if (!w) return { modelKey: config.t, rotationDeg: 0 };
    if (!n) return { modelKey: config.t, rotationDeg: 90 };
    if (!e) return { modelKey: config.t, rotationDeg: 180 };
    if (!s) return { modelKey: config.t, rotationDeg: 270 };
  }
  if (count === 2) {
    // Straights
    if (n && s) return { modelKey: config.straight, rotationDeg: 0 };
    if (e && w) return { modelKey: config.straight, rotationDeg: 90 };
    // Corners
    if (s && e) return { modelKey: config.corner, rotationDeg: 0 };
    if (w && s) return { modelKey: config.corner, rotationDeg: 90 };
    if (n && w) return { modelKey: config.corner, rotationDeg: 180 };
    if (e && n) return { modelKey: config.corner, rotationDeg: 270 };
  }
  if (count === 1) {
    if (s) return { modelKey: config.end, rotationDeg: 0 };
    if (w) return { modelKey: config.end, rotationDeg: 90 };
    if (n) return { modelKey: config.end, rotationDeg: 180 };
    if (e) return { modelKey: config.end, rotationDeg: 270 };
  }
  return { modelKey: config.default, rotationDeg: 0 };
}

// Deterministic 0..1 hash so decor and variants never flicker between updates.
function cellHash(gx, gy, salt = 0) {
  const n = Math.sin(gx * 127.1 + gy * 311.7 + salt * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

// Every 3D terrain type maps to a low-poly kit model. 3D mode never falls back
// to the 2D PNG art: the PNGs belong to the 2D canvas and the palette previews.
export const TERRAIN_MODEL_BY_TYPE = {
  grass: 'grass_lowpoly_a',
  dirt: 'dirt_lowpoly_a',
  rocky_dirt: 'rocky_dirt_lowpoly',
  overgrown_dirt: 'overgrown_dirt_lowpoly',
  stone: 'stone_lowpoly_a',
  cobblestone: 'cobblestone_lowpoly',
  cobblestone_road: 'cobble_road_lowpoly',
  stone_path: 'road_graveyard',
  sand: 'sand_lowpoly_a',
  water: 'tile_small',
  ocean: 'tile_small',
  snow: 'snow_lowpoly_a',
  ice: 'ice_v2_lowpoly',
  mud: 'mud_lowpoly_a',
  swamp: 'swamp_lowpoly',
  fungal_growth: 'fungal_lowpoly',
  dungeon_floor: 'dungeon_lowpoly',
  marble_floor: 'marble_lowpoly',
  wooden_floor: 'wooden_floor_lowpoly',
  dark_wood: 'dark_wood_lowpoly',
  wooden_planks: 'boardwalk_lowpoly',
  weathered_stone: 'weathered_stone_lowpoly',
  grate_floor: 'grate',
  spike_trap: 'spikes',
  lava: 'lava_v2_lowpoly',
  acid: 'acid_v2_lowpoly',
  crystal_floor: 'crystal_v2_lowpoly',
  gold_floor: 'gold_lowpoly',
  dungeon_modular: 'dungeon_modular',
  dungeon_brick: 'dungeon_brick',
  brick_floor: 'dungeon_brick',
  quaternius_wood: 'quaternius_wood',
  kaykit_cobble: 'kaykit_cobble',
  stone_tile: 'stone_tile_lowpoly',
  dirt_path: 'dirt_path_lowpoly'
};

// Authored swatch colour of each kit model (sampled from the shared
// dungeon_texture atlas, or the GLTF baseColorFactor for untextured models).
// `resolveTerrainLook` divides the terrain palette colour by this base so the
// rendered tile lands on the palette colour instead of multiplying a mid-tone
// texture by a dark colour (which read as "weirdly darkened" tiles).
export const MODEL_TINT_BASE = {
  dirt: { r: 0.55, g: 0.51, b: 0.48 },
  dirt_rocky: { r: 0.55, g: 0.51, b: 0.48 },
  stone_floor: { r: 0.54, g: 0.50, b: 0.47 },
  stone_rocks: { r: 0.54, g: 0.50, b: 0.47 },
  cobblestone: { r: 0.54, g: 0.50, b: 0.47 },
  tile_small: { r: 0.54, g: 0.50, b: 0.47 },
  tile_small_broken: { r: 0.54, g: 0.50, b: 0.47 },
  tile_weeds: { r: 0.22, g: 0.64, b: 0.55 },
  grate: { r: 0.07, g: 0.09, b: 0.09 },
  grate_open: { r: 0.07, g: 0.09, b: 0.09 },
  big_grate: { r: 0.07, g: 0.09, b: 0.09 },
  extralarge_grates: { r: 0.07, g: 0.09, b: 0.09 },
  spikes: { r: 0.74, g: 0.80, b: 0.82 },
  big_spikes: { r: 0.74, g: 0.80, b: 0.82 },
  wood_floor: { r: 0.54, g: 0.29, b: 0.21 },
  wood_floor_dark: { r: 0.40, g: 0.35, b: 0.31 },
  wood_floor_large: { r: 0.54, g: 0.29, b: 0.21 },
  wood_floor_large_dark: { r: 0.40, g: 0.35, b: 0.31 },
  wooden_planks: { r: 0.91, g: 0.55, b: 0.35 },
  road_stone: { r: 0.60, g: 0.73, b: 0.79 },
  road_graveyard: { r: 0.63, g: 0.78, b: 0.82 },
  foundation: { r: 0.27, g: 0.29, b: 0.31 },
  stairs: { r: 0.42, g: 0.45, b: 0.47 },
  stairs_narrow: { r: 0.42, g: 0.45, b: 0.47 },
  stairs_wide: { r: 0.42, g: 0.45, b: 0.47 },
  stairs_wood: { r: 0.54, g: 0.29, b: 0.21 },
  quaternius_wood: { r: 0.62, g: 0.62, b: 0.62 },
  kaykit_cobble: { r: 0.63, g: 0.78, b: 0.82 },
  dungeon_brick: { r: 0.54, g: 0.50, b: 0.47 },
  dungeon_modular: { r: 0.54, g: 0.50, b: 0.47 },
  snow_lowpoly_a: { r: 0.98, g: 0.98, b: 0.99 },
  snow_lowpoly_b: { r: 0.98, g: 0.98, b: 0.99 }
};

const DEFAULT_MODEL_BASE = { r: 0.62, g: 0.62, b: 0.62 };

const WHITE = new THREE.Color(0xffffff);

// Reference map of the authentic 1024x1024 PBR terrain textures in
// public/assets/tiles/. These PNGs are used by the 2D canvas and the editor
// palette ONLY Ã¢â‚¬â€ 3D mode renders low-poly kit meshes for every type.
export const TERRAIN_TEXTURE_MAP = {
  grass: '/assets/tiles/Grass1.png',
  dirt: '/assets/tiles/Dirt1.png',
  stone: '/assets/tiles/Stone1.png',
  sand: '/assets/tiles/Sand1.png',
  water: '/assets/tiles/Water1.png',
  cobblestone: '/assets/tiles/Cobble1.png',
  dungeon_floor: '/assets/tiles/Dungeon1.png',
  marble_floor: '/assets/tiles/Marble1.png',
  wooden_floor: '/assets/tiles/Wood1.png',
  wood_floor: '/assets/tiles/Wood1.png',
  snow: '/assets/tiles/Snow1.png',
  mud: '/assets/tiles/Mud1.png',
  swamp: '/assets/tiles/Swamp1.png',
  ice: '/assets/tiles/Ice1.png',
  fungal_growth: '/assets/tiles/Fungal1.png',
  lava: '/assets/tiles/Lava1.png',
  acid: '/assets/tiles/Acid1.png',
  pit: '/assets/tiles/Pit1.png',
  abyss: '/assets/tiles/Abyss1.png',
  crystal_floor: '/assets/tiles/Crystal1.png',
  gold_floor: '/assets/tiles/Gold1.png',
  grate_floor: '/assets/tiles/Grate1.png',
  spike_trap: '/assets/tiles/Spikes1.png',
  dark_wood: '/assets/tiles/DarkWood1.png',
  weathered_stone: '/assets/tiles/Stone1.png',
  rocky_dirt: '/assets/tiles/RockyDirt1.png',
  overgrown_dirt: '/assets/tiles/OvergrownDirt1.png',
  cobblestone_road: '/assets/tiles/CobbleRoad1.png',
  wooden_planks: '/assets/tiles/WoodenPlanks1.png',
  stone_path: '/assets/tiles/StonePath1.png',
  stone_tile: '/assets/tiles/Stone1.png',
  dirt_path: '/assets/tiles/Dirt1.png'
};

export const TERRAIN_MATERIAL_CONFIGS = {
  grass: { roughness: 0.85, metalness: 0.05 },
  sand: { roughness: 0.95, metalness: 0.0 },
  snow: { roughness: 0.7, metalness: 0.1 },
  ice: { roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.92 },
  water: { roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.85 },
  lava: { emissive: 0xff5500, emissiveIntensity: 0.4, roughness: 0.8 },
  acid: { emissive: 0x33ff00, emissiveIntensity: 0.6, roughness: 0.35 },
  crystal_floor: { emissive: 0x00e5ff, emissiveIntensity: 0.45, roughness: 0.3 },
  gold_floor: { roughness: 0.3, metalness: 0.85 },
  fungal_growth: { emissive: 0x9900ff, emissiveIntensity: 0.4, roughness: 0.7 },
  cobblestone: { roughness: 0.7, metalness: 0.05 },
  marble_floor: { roughness: 0.25, metalness: 0.05 },
  wooden_floor: { roughness: 0.65, metalness: 0.05 },
  wood_floor: { roughness: 0.65, metalness: 0.05 },
  dirt: { roughness: 0.9, metalness: 0.0 },
  dirt_path: { roughness: 0.95, metalness: 0.0 },
  stone: { roughness: 0.75, metalness: 0.05 },
  stone_tile: { roughness: 0.8, metalness: 0.05 },
  mud: { roughness: 0.9, metalness: 0.0 },
  swamp: { roughness: 0.8, metalness: 0.05 },
  dungeon_floor: { roughness: 0.7, metalness: 0.05 },
  abyss: { roughness: 0.95, color: 0x111115 },
  pit: { roughness: 0.95, color: 0x222225 },
  grate_floor: { roughness: 0.5, metalness: 0.7 },
  spike_trap: { roughness: 0.6, metalness: 0.6 },
  dark_wood: { roughness: 0.7, metalness: 0.05 },
  weathered_stone: { roughness: 0.8, metalness: 0.05 },
  rocky_dirt: { roughness: 0.9, metalness: 0.0 },
  overgrown_dirt: { roughness: 0.85, metalness: 0.05 },
  cobblestone_road: { roughness: 0.7, metalness: 0.05 },
  wooden_planks: { roughness: 0.65, metalness: 0.05 },
  stone_path: { roughness: 0.75, metalness: 0.05 },
  quaternius_wood: { roughness: 0.65, metalness: 0.05 },
  kaykit_cobble: { roughness: 0.75, metalness: 0.05 },
  dungeon_brick: { roughness: 0.75, metalness: 0.05 },
  dungeon_modular: { roughness: 0.7, metalness: 0.05 },
  brick_floor: { roughness: 0.75, metalness: 0.05 }
};

// Liquid terrain renders as kit shoreline tiles with an animated sheet over the
// open water between them: the tiles carry the banks and the sheet carries the
// palette colour, ripples and depth. `rippleSize` is the sheet texture's world
// size in cells; `lift` is the sheet height as a fraction of a cell Ã¢â‚¬â€ shore
// slabs put their water at the cell origin (unlike the stone tile's raised rim),
// so the sheet sits just above it. `boost` lifts the palette colour for the 3D
// look (stylized water is diffuse-only here, so the raw palette blue reads much
// darker than the 2D tile art); `color` is the palette colour * boost.
export const LIQUID_SURFACE_CONFIGS = {
  water: {
    color: '#4682b4',
    boost: 1.3,
    // Translucent so the sandy bed baked into the shore pieces shows through
    // near the banks and fades into the deep centre.
    opacity: 0.86,
    roughness: 0.34,
    metalness: 0,
    normalScale: 0.3,
    rippleSize: 0.4,
    profile: 'water',
    bedDim: 0.8,
    scroll: { x: 0.018, y: 0.012 },
    lift: 0.002
  },
  ocean: {
    // Same shore kit as water, but deeper/darker and calmer: a wider ripple
    // field with a slower scroll reads as open sea rather than a pond, and no
    // lily decor is scattered (see LIQUID_DECOR_TYPES).
    color: '#2f6c9e',
    boost: 1.22,
    opacity: 0.9,
    roughness: 0.3,
    metalness: 0,
    normalScale: 0.26,
    rippleSize: 0.7,
    profile: 'water',
    bedDim: 0.72,
    scroll: { x: 0.012, y: 0.008 },
    lift: 0.002
  },
  ice: {
    color: '#cfeef8',
    opacity: 0.62,
    roughness: 0.2,
    metalness: 0.02,
    normalScale: 0.34,
    rippleSize: 0.7,
    profile: 'ice',
    bedDim: 0.88,
    scroll: { x: 0.006, y: 0.004 }
  },
  lava: {
    color: '#ff5a12',
    opacity: 0.94,
    roughness: 0.5,
    metalness: 0,
    normalScale: 0.8,
    rippleSize: 0.5,
    profile: 'lava',
    bedDim: 0.45,
    emissive: '#ff4a08',
    emissiveIntensity: 0.75,
    useEmissiveMap: true,
    scroll: { x: 0.009, y: 0.006 }
  },
  acid: {
    color: '#5dc22a',
    opacity: 0.8,
    roughness: 0.28,
    metalness: 0,
    normalScale: 0.6,
    rippleSize: 0.6,
    profile: 'acid',
    bedDim: 0.6,
    emissive: '#2fe00a',
    emissiveIntensity: 0.4,
    useEmissiveMap: true,
    scroll: { x: 0.016, y: 0.011 }
  }
};

// Fallback sheet height (fraction of a cell) for liquid types without `lift` Ã¢â‚¬â€
// tuned for the stone tile's raised rim.
export const LIQUID_SURFACE_LIFT = 0.0265;

// Bed dimming + greying: the stone under a liquid is a wet bed so the palette
// colour of the sheet reads as liquid instead of a blue tile.
const LIQUID_BED_GREY = new THREE.Color(0.3, 0.33, 0.35);

let plateGeometry = null;
let plateMaterial = null;

function getPlateGeometry() {
  if (!plateGeometry) {
    plateGeometry = new THREE.PlaneGeometry(1, 1);
    // Kit models are authored Y-up (every instance is rotated +90 deg around
    // X). Lay the plate into the model's XZ plane so it ends up facing up.
    plateGeometry.rotateX(-Math.PI / 2);
  }
  return plateGeometry;
}

function getPlateMaterial() {
  if (!plateMaterial) {
    plateMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0 });
  }
  return plateMaterial;
}

let pitGeometry = null;

/** Unit open-top shell (Y-up, floor at y=0) rendered BackSide for pits. */
function getPitGeometry() {
  if (!pitGeometry) {
    pitGeometry = new THREE.BoxGeometry(1, 1, 1);
    pitGeometry.translate(0, 0.5, 0);
  }
  return pitGeometry;
}

/** Fresh materials per instanced mesh (the manager disposes them on rebuild). */
function createPitMaterial() {
  return new THREE.MeshStandardMaterial({
    // Lit stone, not a black void: a pit has to read as a sunken room even
    // when the map lighting is dim. Combined with receiveShadow: false the
    // interior always catches the sun instead of going pitch black.
    color: 0x6d6459,
    roughness: 0.95,
    metalness: 0,
    side: THREE.BackSide
  });
}

function createPlateMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0x5f5a54, roughness: 0.95, metalness: 0 });
}

// Elevation rendering that has no kit model: pit shells and the ground plates
// that cap unpainted plateaus. Ramps/stairs use the authored kit models.
const PROCEDURAL_TERRAIN_MODELS = {
  procedural_pit: {
    geometry: getPitGeometry,
    createMaterial: createPitMaterial,
    castShadow: false,
    receiveShadow: false
  },
  procedural_plate: {
    geometry: getPlateGeometry,
    createMaterial: createPlateMaterial,
    castShadow: false,
    receiveShadow: true
  }
};

const _normalizeMatrix = new THREE.Matrix4();

const CURTAIN_SKIN = 0.02;

/**
 * Vertical water skins for liquid cells that sit above a lower liquid
 * neighbour: without them an elevated lake renders as a stone block (the
 * elevation foundations plus their hard shadow), with them it reads as a water
 * step. Only drawn between cells of the same liquid so a lake never spills down
 * the side of a cliff face it merely borders.
 */
function buildLiquidCurtainGeometry(cells, { gridSize, lift, elevationData, rippleWorld, cellKeys }) {
  const half = gridSize / 2;
  const levelStep = gridSize;
  const skinOffset = gridSize * CURTAIN_SKIN;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Map directions in three space: north (-gy) is +Y, east (+gx) is +X.
  const directions = [
    { dx: 0, dy: -1, axis: 'y', sign: 1 },
    { dx: 1, dy: 0, axis: 'x', sign: 1 },
    { dx: 0, dy: 1, axis: 'y', sign: -1 },
    { dx: -1, dy: 0, axis: 'x', sign: -1 }
  ];

  const pushQuad = (verts, wanted) => {
    const base = positions.length / 3;
    const a = new THREE.Vector3(verts[0][0], verts[0][1], verts[0][2]);
    const b = new THREE.Vector3(verts[1][0], verts[1][1], verts[1][2]);
    const c = new THREE.Vector3(verts[2][0], verts[2][1], verts[2][2]);
    const wound = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    const flip = wound.dot(wanted) < 0;
    verts.forEach((v, i) => {
      positions.push(v[0], v[1], v[2]);
      normals.push(wanted.x, wanted.y, wanted.z);
      uvs.push(i === 1 || i === 2 ? 1 : 0, v[2] / rippleWorld);
    });
    if (flip) {
      indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
    } else {
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
  };

  cells.forEach((cell) => {
    const topZ = cell.z + lift;
    directions.forEach(({ dx, dy, axis, sign }) => {
      const neighbourKey = `${cell.gx + dx},${cell.gy + dy}`;
      if (!cellKeys.has(neighbourKey)) return;
      const neighbourElevation = getTileElevation(elevationData, cell.gx + dx, cell.gy + dy);
      if (neighbourElevation >= cell.elevation) return;
      const lowZ = neighbourElevation * levelStep + lift;
      if (topZ - lowZ < 1e-4) return;

      const wanted = axis === 'x'
        ? new THREE.Vector3(sign, 0, 0)
        : new THREE.Vector3(0, sign, 0);

      if (axis === 'x') {
        const xEdge = cell.x + sign * (half + skinOffset);
        pushQuad([
          [xEdge, cell.y - half, lowZ],
          [xEdge, cell.y - half, topZ],
          [xEdge, cell.y + half, topZ],
          [xEdge, cell.y + half, lowZ]
        ], wanted);
      } else {
        const yEdge = cell.y + sign * (half + skinOffset);
        pushQuad([
          [cell.x - half, yEdge, lowZ],
          [cell.x + half, yEdge, lowZ],
          [cell.x + half, yEdge, topZ],
          [cell.x - half, yEdge, topZ]
        ], wanted);
      }
    });
  });

  if (!positions.length) return null;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

export function resolveTerrainModelKey(typeId, typeDef) {
  const type = String(typeId || '').toLowerCase();
  const name = String(typeDef?.name || '').toLowerCase();
  const haystack = `${type} ${name}`;

  if (TERRAIN_MODEL_BY_TYPE[type]) {
    return TERRAIN_MODEL_BY_TYPE[type];
  }
  if (typeDef?.modelKey && TERRAIN_MODEL_REGISTRY[typeDef.modelKey]) {
    return typeDef.modelKey;
  }
  if (TERRAIN_MODEL_REGISTRY[type]) {
    return type;
  }

  // Fallbacks for custom/unknown terrain ids added by map authors.
  if (type.includes('wall') || haystack.includes('wall')) return 'stone_wall';
  if (haystack.includes('wood') || haystack.includes('plank')) {
    return haystack.includes('dark') ? 'wood_floor_dark' : 'wood_floor';
  }
  if (haystack.includes('grate')) return 'grate';
  if (haystack.includes('spike')) return 'spikes';
  if (haystack.includes('weathered') || haystack.includes('cave') || haystack.includes('rocky_stone') || haystack.includes('rough_stone')) {
    return 'stone_rocks';
  }
  if (haystack.includes('overgrown') || haystack.includes('weeds')) {
    return 'overgrown_dirt';
  }
  if (haystack.includes('gravel') || haystack.includes('rocky_dirt') || haystack.includes('dirt_rocky')) {
    return 'dirt_rocky';
  }
  if (type.includes('cobble') && !haystack.includes('road')) {
    return 'cobblestone';
  }
  if (type.includes('dirt') || haystack.includes('dirt')) {
    return 'dirt';
  }
  if (haystack.includes('road') || haystack.includes('path') || haystack.includes('boardwalk')) {
    return haystack.includes('boardwalk') ? 'wooden_planks' : 'road_stone';
  }

  return 'tile_small';
}

export const EMISSIVE_TERRAIN = {
  lava: 0.85,
  acid: 0.6,
  fungal_growth: 0.4,
  crystal_floor: 0.45,
  gold_floor: 0.3
};

// Compose a multiplier so `model swatch colour * tint` lands on the terrain
// palette colour. Without this, dark palette colours multiplied the mid-tone
// kit swatches into near-black tiles.
export function resolveTerrainLook(typeId, typeDef) {
  const config = TERRAIN_MATERIAL_CONFIGS[typeId] || {};
  const target = config.color
    ? new THREE.Color(config.color)
    : new THREE.Color(typeDef?.color || '#8a8a8a');
  const modelKey = resolveTerrainModelKey(typeId, typeDef);
  const modelDef = TERRAIN_MODEL_REGISTRY[modelKey];
  // Models carrying an authored tile texture are tinted against the texture's
  // own sampled mean (sRGB) instead of the kit's flat prototype swatch.
  const base = modelDef?.mapTintBase || MODEL_TINT_BASE[modelKey] || DEFAULT_MODEL_BASE;

  // MODEL_TINT_BASE holds sRGB samples; THREE.Color works in linear space, so
  // convert before dividing or the tint comes out far too dark.
  const baseLinear = new THREE.Color(base.r, base.g, base.b);
  if (baseLinear.convertSRGBToLinear) baseLinear.convertSRGBToLinear();
  const tint = new THREE.Color(
    Math.min(3.5, target.r / Math.max(baseLinear.r, 0.01)),
    Math.min(3.5, target.g / Math.max(baseLinear.g, 0.01)),
    Math.min(3.5, target.b / Math.max(baseLinear.b, 0.01))
  );
  // Keep a little of the authored swatch so very light targets (snow,
  // marble) still show texture detail instead of clipping to flat white.
  tint.lerp(WHITE, 0.15);

  // Liquids light the sheet, not the bed: the bed is a dimmed wet stone.
  const liquidConfig = LIQUID_SURFACE_CONFIGS[typeId] || null;
  const bedTint = liquidConfig
    ? tint.clone().multiplyScalar(liquidConfig.bedDim).lerp(LIQUID_BED_GREY, 0.22)
    : null;
  // 3D liquid surfaces are diffuse-only, so the palette colour is lifted to keep
  // water reading as water under the map lighting.
  const liquidTarget = liquidConfig?.boost
    ? target.clone().multiplyScalar(liquidConfig.boost)
    : target;

  const emissiveStrength = liquidConfig
    ? 0
    : (config.emissiveIntensity || EMISSIVE_TERRAIN[typeId] || 0);
  const emissive = !liquidConfig && config.emissive
    ? new THREE.Color(config.emissive)
    : (!liquidConfig && emissiveStrength > 0 ? target.clone() : null);

  return {
    typeId,
    tint,
    bedTint,
    target,
    liquidTarget,
    emissive,
    emissiveStrength,
    key: `${typeId}:${tint.getHexString()}:${emissive ? emissive.getHexString() : 'none'}`
  };
}

export function paletteColorOf(typeId) {
  const def = PROFESSIONAL_TERRAIN_TYPES[typeId];
  return new THREE.Color(def?.color || '#8a8a8a');
}

// Flat (untextured) kit parts carry their whole colour in the material, so a
// palette rule simply replaces it Ã¢â‚¬â€ the part renders exactly on the terrain
// palette colour regardless of the kit's own swatch.
function resolvePaletteRuleTarget(rule, bankType) {
  let typeId = typeof rule === 'string' ? rule : rule?.type;
  const dim = (rule && typeof rule === 'object' && rule.dim) || 1;
  if (bankType && typeof rule === 'object' && rule?.type && PROFESSIONAL_TERRAIN_TYPES[bankType]) {
    typeId = bankType;
  }
  const terrainDef = PROFESSIONAL_TERRAIN_TYPES[typeId];
  const color = new THREE.Color(terrainDef?.color || '#8a8a8a');
  color.multiplyScalar(dim);
  return color;
}

export class ThreeDTerrainManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'ThreeDTerrainGroup';
    this.scene.add(this.group);

    // Map: "modelKey|lookKey" -> THREE.InstancedMesh
    this.instancedMeshes = new Map();
    // Extra passes: ground slabs under gap models, toon outlines and the liquid
    // sheets, all keyed by model / terrain type.
    this.outlineMeshes = new Map();
    this.liquidSurfaces = new Map();
    this.liquidCurtains = new Map();
    this.liquidMaterials = [];
    this.liquidTime = 0;
    this.outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x0b0b0d, side: THREE.BackSide });
    this.outlineMaterial.name = 'ThreeDTerrainOutlineMaterial';
    this.dummy = new THREE.Object3D();
    this.lastParams = null;
    this.blendMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0,
      flatShading: true,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false
    });
    this.blendMaterial.name = 'ThreeDTerrainBlendMaterial';
    this.blendMesh = null;
    this.pitMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      metalness: 0,
      flatShading: true,
      side: THREE.DoubleSide
    });
    this.pitMaterial.name = 'ThreeDTerrainPitMaterial';
    this.pitMesh = null;

    // Preload terrain models
    Object.values(TERRAIN_MODEL_REGISTRY).forEach(reg => {
      if (!reg.url) return;
      modelCache.loadModel(reg.url).catch(() => {});
    });

    // Re-render when cached models finish loading asynchronously
    this.unsubscribeCache = modelCache.subscribe(() => {
      if (this.lastParams) {
        this.updateTerrain(this.lastParams);
      }
    });
  }

  updateTerrain({
    terrainData = {},
    elevationData = {},
    rampData = {},
    gridSize = 50,
    gridOffsetX = 0,
    gridOffsetY = 0,
    enabled = true
  }) {
    this.lastParams = {
      terrainData,
      elevationData,
      rampData,
      gridSize,
      gridOffsetX,
      gridOffsetY,
      enabled
    };

    if (!enabled) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;

    // Collect instances per (model, material look)
    const instancesByVariant = new Map();
    // Liquid sheet cells per terrain type (water/ice/lava/acid), plus every
    // liquid cell key so drop skins can tell water from land.
    const liquidCells = new Map();
    const liquidCellKeys = new Map();

    const pushInstance = (variantKey, inst) => {
      if (!instancesByVariant.has(variantKey)) instancesByVariant.set(variantKey, []);
      instancesByVariant.get(variantKey).push(inst);
    };

    const cellTypeId = (gx, gy) => {
      const raw = terrainData[`${gx},${gy}`];
      return typeof raw === 'string' ? raw : raw?.type;
    };
    const isWaterCell = (gx, gy) => {
      const id = cellTypeId(gx, gy);
      return Boolean(id && WATER_SHORE_TYPES[id]);
    };

    // Resolve every ramp/stairs tile up front: the surface spans the tile from
    // its own level at the far edge up/down to the connected neighbour's level
    // at the near edge, so the renderer needs the level difference per tile.
    const rampTiles = new Map();
    Object.keys(rampData || {}).forEach(key => {
      const parts = key.split(',').map(Number);
      if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return;
      const [gx, gy] = parts;
      const ramp = rampData[key];
      if (!ramp) return;
      // Ramps auto-align with the biggest adjacent level change; nothing is
      // stored on the tile itself.
      const dir = resolveRampDirection({ elevationData, rampData, x: gx, y: gy });
      const delta = getRampDirectionDelta(dir);
      const selfLevel = getTileElevation(elevationData, gx, gy);
      const targetLevel = getTileElevation(elevationData, gx + delta.x, gy + delta.y);
      rampTiles.set(key, {
        gx,
        gy,
        ramp,
        dir,
        delta,
        selfLevel,
        targetLevel,
        deltaZ: (targetLevel - selfLevel) * gridSize
      });
    });

    // Foundation deduplication helper so cliffs and elevated stairs don't spawn
    // duplicate blocks. Non-top blocks are stretched into the block above:
    // flush-stacked slabs showed the kit's decorative top rim as a groove per
    // level, which read as a stack of crates instead of a hill.
    const FOUNDATION_OVERLAP = 1.15;
    const placedFoundations = new Set();
    const pushFoundation = (gx, gy, worldX, worldY, lvl, isTop = true) => {
      const fKey = `${gx},${gy},${lvl}`;
      if (placedFoundations.has(fKey)) return;
      placedFoundations.add(fKey);
      pushInstance('foundation|default', {
        x: worldX,
        y: -worldY,
        z: lvl * gridSize,
        rotationZ: 0,
        look: null,
        fitHeight: gridSize * (isTop ? 1 : FOUNDATION_OVERLAP)
      });
    };
    const pushPit = (gx, gy, worldX, worldY, level) => {
      pushInstance('procedural_pit|default', {
        x: worldX,
        y: -worldY,
        z: level * gridSize,
        rotationZ: 0,
        look: null,
        fitHeight: Math.abs(level) * gridSize,
        fitRun: gridSize
      });
    };

    // Solid column height per tile: how far the ground under the tile must be
    // built up. A sloped ramp's wedge is itself solid, so it replaces the
    // tile's own elevation and only needs support up to its low end
    // (min(self, target)) — otherwise the foundation would poke through the
    // thin end of the slope.
    const columnTopByTile = new Map();
    const rampColumnKeys = new Set();
    const noteColumnTop = (key, topLevel) => {
      if (topLevel <= 0) return;
      const previous = columnTopByTile.get(key);
      if (previous === undefined || topLevel > previous) {
        columnTopByTile.set(key, topLevel);
      }
    };
    rampTiles.forEach((rt, key) => {
      if (rt.deltaZ === 0) return;
      rampColumnKeys.add(key);
      noteColumnTop(key, Math.min(rt.selfLevel, rt.targetLevel));
    });
    Object.keys(elevationData || {}).forEach(key => {
      if (rampColumnKeys.has(key)) return;
      const parts = key.split(',').map(Number);
      if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return;
      const level = getTileElevation(elevationData, parts[0], parts[1]);
      if (level > 0) noteColumnTop(key, level);
    });
    columnTopByTile.forEach((topLevel, key) => {
      const [gx, gy] = key.split(',').map(Number);
      const worldX = gx * gridSize + gridSize / 2 + gridOffsetX;
      const worldY = gy * gridSize + gridSize / 2 + gridOffsetY;
      for (let lvl = 0; lvl < topLevel; lvl++) {
        pushFoundation(gx, gy, worldX, worldY, lvl, lvl === topLevel - 1);
      }
    });

    Object.keys(terrainData).forEach(key => {
      const parts = key.split(',').map(Number);
      if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return;
      const [gx, gy] = parts;

      const rawType = terrainData[key];
      const typeId = typeof rawType === 'string' ? rawType : rawType?.type;
      if (!typeId) return;
      if (PIT_TYPES[typeId]) return;

      const elevation = getTileElevation(elevationData, gx, gy);
      const worldX = gx * gridSize + gridSize / 2 + gridOffsetX;
      const worldY = gy * gridSize + gridSize / 2 + gridOffsetY;
      const worldZ = elevation * gridSize;

      // Supporting foundations come from the column pass above; only sunken
      // tiles need per-tile geometry here.
      if (elevation < 0) {
        // Sunken tiles get an open pit shell so the ground reads as solid.
        pushPit(gx, gy, worldX, worldY, elevation);
      }

      // If this cell has a ramp/stair with a height difference, omit the flat
      // floor tile so it does not slice through the ramp surface; flat ramps
      // keep the ordinary floor.
      const rampTile = rampTiles.get(key);
      if (rampTile && rampTile.deltaZ !== 0) {
        return;
      }

      const typeDef = PROFESSIONAL_TERRAIN_TYPES[typeId] || null;
      let look = resolveTerrainLook(typeId, typeDef);

      // Water bodies pick a kit shoreline tile from their land neighbours so
      // lakes and rivers get real banks instead of a grid of water squares.
      let modelKey;
      let rotationDeg = 0;
      let shoreOpen = false;
      if (WATER_SHORE_TYPES[typeId]) {
        const landDirections = [];
        const landTypes = [];
        const noteLand = (dir, nx, ny) => {
          if (isWaterCell(nx, ny)) return;
          landDirections.push(dir);
          const raw = terrainData[`${nx},${ny}`];
          const id = typeof raw === 'string' ? raw : raw?.type;
          if (id && PROFESSIONAL_TERRAIN_TYPES[id]) landTypes.push(id);
        };
        noteLand('north', gx, gy - 1);
        noteLand('east', gx + 1, gy);
        noteLand('south', gx, gy + 1);
        noteLand('west', gx - 1, gy);
        const shore = resolveWaterShorePiece(landDirections, gx + gy, { rocky: typeId !== 'ocean' });
        modelKey = shore.modelKey;
        rotationDeg = shore.rotationDeg;
        shoreOpen = shore.isOpen;
        if (landTypes.length > 0) {
          const counts = {};
          landTypes.forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
          const bankType = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
          look = { ...look, key: `${look.key}|bank:${bankType}`, bankType };
        }
      } else {
        const connecting = resolveConnectingPiece(typeId, gx, gy, terrainData);
        if (connecting) {
          modelKey = connecting.modelKey;
          rotationDeg = connecting.rotationDeg;
        } else {
          modelKey = resolveTerrainModelKey(typeId, typeDef);
          const baseDef = TERRAIN_MODEL_REGISTRY[modelKey];
          if (baseDef && Array.isArray(baseDef.variants) && baseDef.variants.length > 0) {
            modelKey = baseDef.variants[Math.floor(cellHash(gx, gy, 7) * baseDef.variants.length)];
            if (baseDef.rotate4) {
              rotationDeg = 90 * Math.floor(cellHash(gx, gy, 13) * 4);
            }
          }
        }
      }

      const modelDef = TERRAIN_MODEL_REGISTRY[modelKey];

      const tileLift = elevation > 0 ? 0.35 : 0;

      // Gap models (scattered flagstones) get a ground slab underneath so the
      // grid does not show through between the pieces.
      if (modelDef?.bedModelKey && TERRAIN_MODEL_REGISTRY[modelDef.bedModelKey]) {
        pushInstance(`${modelDef.bedModelKey}|default`, {
          x: worldX,
          y: -worldY,
          z: worldZ + tileLift,
          rotationZ: 0,
          look: null
        });
      }

      pushInstance(`${modelKey}|${look.key}`, {
        x: worldX,
        y: -worldY, // Three.js Y inverted
        z: worldZ + tileLift,
        rotationZ: (rotationDeg * Math.PI) / 180,
        look
      });

      // Liquids float a sheet above their bed (see rebuildLiquidSurfaces):
      // only open water cells get the animated sheet so it never overlaps the
      // banks; banked cells carry their own baked water surface (matching
      // colour) so the shoreline stays clean.
      const liquidConfig = LIQUID_SURFACE_CONFIGS[typeId];
      if (liquidConfig) {
        if (!liquidCellKeys.has(typeId)) liquidCellKeys.set(typeId, new Set());
        liquidCellKeys.get(typeId).add(`${gx},${gy}`);
        if (!WATER_SHORE_TYPES[typeId] || shoreOpen) {
          if (!liquidCells.has(typeId)) liquidCells.set(typeId, []);
          liquidCells.get(typeId).push({
            x: worldX,
            y: -worldY,
            z: worldZ,
            gx,
            gy,
            elevation
          });
        }
      }

      // Open water carries drifting decor (lily pads) so large lakes are not a
      // flat colour field.
      if (shoreOpen && LIQUID_DECOR_TYPES[typeId]) {
        const roll = cellHash(gx, gy, 3);
        if (roll < WATER_DECOR_CHANCE) {
          const decorModel = roll < WATER_DECOR_CHANCE / WATER_DECOR_MODELS.length
            ? WATER_DECOR_MODELS[0]
            : WATER_DECOR_MODELS[1];
          pushInstance(`${decorModel}|default`, {
            x: worldX,
            y: -worldY,
            z: worldZ + gridSize * 0.0015,
            rotationZ: cellHash(gx, gy, 7) * Math.PI * 2,
            look: null
          });
        }
      }
    });

    // Blend strips between neighbouring terrain of different types so type
    // borders read as an organic seam instead of two butting blocks. Each
    // shared edge is collected once (east + south per cell) and each grid
    // point once (the point's four surrounding cells); the geometry itself is
    // built procedurally in rebuildBlendGeometry as feathered gradients
    // between the meeting palette colours.
    const blendNeighbourType = (nx, ny) => {
      const raw = terrainData[`${nx},${ny}`];
      const id = typeof raw === 'string' ? raw : raw?.type;
      return id && PROFESSIONAL_TERRAIN_TYPES[id] ? id : null;
    };
    const pitCells = [];
    const blendEdges = [];
    const blendCorners = [];
    Object.keys(terrainData).forEach(key => {
      const parts = key.split(',').map(Number);
      if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return;
      const [gx, gy] = parts;
      const rawType = terrainData[key];
      const typeId = typeof rawType === 'string' ? rawType : rawType?.type;
      if (!typeId || !PROFESSIONAL_TERRAIN_TYPES[typeId]) return;
      const elevation = getTileElevation(elevationData, gx, gy);
      const worldZ = elevation * gridSize;

      if (PIT_TYPES[typeId]) {
        pitCells.push({
          gx,
          gy,
          typeId,
          worldX: gx * gridSize + gridSize / 2 + gridOffsetX,
          worldY: gy * gridSize + gridSize / 2 + gridOffsetY,
          worldZ
        });
        return;
      }

      const eastType = blendNeighbourType(gx + 1, gy);
      if (eastType && eastType !== typeId && !WATER_SHORE_TYPES[typeId] && !PIT_TYPES[eastType]) {
        blendEdges.push({ gx, gy, dir: 'east', typeA: typeId, typeB: eastType, worldZ, half: Boolean(WATER_SHORE_TYPES[eastType]) });
      }
      const southType = blendNeighbourType(gx, gy + 1);
      if (southType && southType !== typeId && !WATER_SHORE_TYPES[typeId] && !PIT_TYPES[southType]) {
        blendEdges.push({ gx, gy, dir: 'south', typeA: typeId, typeB: southType, worldZ, half: Boolean(WATER_SHORE_TYPES[southType]) });
      }
      const westType = blendNeighbourType(gx - 1, gy);
      if (WATER_SHORE_TYPES[westType]) {
        blendEdges.push({ gx, gy, dir: 'west', typeA: typeId, typeB: westType, worldZ, half: true });
      }
      const northTypeForEdge = blendNeighbourType(gx, gy - 1);
      if (WATER_SHORE_TYPES[northTypeForEdge]) {
        blendEdges.push({ gx, gy, dir: 'north', typeA: typeId, typeB: northTypeForEdge, worldZ, half: true });
      }

      const northType = blendNeighbourType(gx, gy - 1);
      const northEastType = blendNeighbourType(gx + 1, gy - 1);
      const cornerTypes = [typeId, eastType, northType, northEastType].filter(Boolean);
      if (
        cornerTypes.length === 4
        && !cornerTypes.every(t => t === typeId)
        && !cornerTypes.some(t => WATER_SHORE_TYPES[t])
        && !cornerTypes.some(t => PIT_TYPES[t])
      ) {
        blendCorners.push({
          gx,
          gy,
          types: { nw: northType, ne: northEastType, sw: typeId, se: eastType },
          worldZ
        });
      }
    });
    this.rebuildBlendGeometry(blendEdges, blendCorners, gridSize, gridOffsetX, gridOffsetY);
    this.rebuildPitGeometry(pitCells, gridSize, gridOffsetX, gridOffsetY);

    // Elevation-only cells: 3D owns elevation in 3D mode, so unpainted
    // plateaus get their foundation column plus a ground plate, and unpainted
    // pits get their sunken shell — otherwise elevation painted without a
    // terrain texture would exist only in the 2D canvas.
    Object.keys(elevationData || {}).forEach(key => {
      const parts = key.split(',').map(Number);
      if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return;
      const [gx, gy] = parts;
      if (terrainData[key]) return; // painted cells are handled above
      const elevation = getTileElevation(elevationData, gx, gy);
      if (elevation === 0) return;

      const worldX = gx * gridSize + gridSize / 2 + gridOffsetX;
      const worldY = gy * gridSize + gridSize / 2 + gridOffsetY;

      if (elevation > 0) {
        // The column pass above already built the support; unpainted plateaus
        // get a ground plate cap. Lifted a hair off the top foundation block so
        // the two coplanar faces cannot z-fight.
        // A sloped ramp/stairs surface already spans this tile; capping it with
        // a flat plate would cover the descending half of the slope.
        const rampTile = rampTiles.get(key);
        if (!rampTile || rampTile.deltaZ === 0) {
          pushInstance('procedural_plate|default', {
            x: worldX,
            y: -worldY,
            z: elevation * gridSize + 0.5,
            rotationZ: 0,
            look: null
          });
        }
      } else {
        pushPit(gx, gy, worldX, worldY, elevation);
      }
    });

    // Ramp / stairs surfaces. Flat ramps keep the ordinary floor tile; sloped
    // ramps render across the whole tile, from the lower end at one edge up to
    // the higher level at the edge shared with the connected neighbour.
    const RAMP_DIR_ROTATIONS = {
      n: 0,
      e: -Math.PI / 2,
      s: Math.PI,
      w: Math.PI / 2
    };

    rampTiles.forEach((rt) => {
      const { gx, gy, ramp, dir, selfLevel, targetLevel, deltaZ } = rt;
      const worldX = gx * gridSize + gridSize / 2 + gridOffsetX;
      const worldY = gy * gridSize + gridSize / 2 + gridOffsetY;
      const baseLevel = Math.min(selfLevel, targetLevel);
      const baseZ = baseLevel * gridSize;

      if (deltaZ === 0) {
        // No slope to render; an unpainted flat ramp still gets a ground plate
        // so the tile is visible in 3D. Unpainted tiles that carry elevation are
        // already capped by the elevation-only pass above, so skip those.
        if (!terrainData[`${gx},${gy}`] && selfLevel === 0) {
          pushInstance('procedural_plate|default', {
            x: worldX,
            y: -worldY,
            z: selfLevel * gridSize,
            rotationZ: 0,
            look: null
          });
        }
        return;
      }

      const rot = RAMP_DIR_ROTATIONS[dir] !== undefined ? RAMP_DIR_ROTATIONS[dir] : 0;
      // Descending ramps flip 180 deg and sit at the lower level, so the model
      // always climbs away from the low side toward the higher edge.
      const descending = deltaZ < 0;
      const rotationZ = descending ? rot + Math.PI : rot;
      const fitHeight = Math.abs(deltaZ);

      const rawType = terrainData[`${gx},${gy}`];
      const terrainTypeId = typeof rawType === 'string' ? rawType : rawType?.type;
      const isWood = ramp.type === 'wood' ||
        terrainTypeId === 'wooden_floor' ||
        terrainTypeId === 'wood_floor' ||
        terrainTypeId === 'wood_floor_dark';

      // Every sloped ramp/stairs tile uses the kit stair assets (the authored
      // stair models read better than a flat wedge). `ramp` maps to the wide
      // stair run so the two tool styles stay visually distinct; narrow/wood
      // remain for legacy data.
      let stairModel = 'stairs';
      if (isWood) {
        stairModel = 'stairs_wood';
      } else if (ramp.type === 'narrow') {
        stairModel = 'stairs_narrow';
      } else if (ramp.type === 'wide' || ramp.type === 'ramp') {
        stairModel = 'stairs_wide';
      }

      pushInstance(`${stairModel}|default`, {
        x: worldX,
        y: -worldY,
        z: baseZ,
        rotationZ,
        look: null,
        fitHeight,
        fitRun: gridSize,
        normalize: true
      });
    });

    // Rebuild InstancedMeshes
    const scaleFactorByModel = new Map();
    const activeVariantKeys = new Set();
    instancesByVariant.forEach((instances, variantKey) => {
      const [modelKey] = variantKey.split('|');
      const procedural = PROCEDURAL_TERRAIN_MODELS[modelKey];
      const def = procedural
        ? { scale: 1.0, baseZ: 0 }
        : TERRAIN_MODEL_REGISTRY[modelKey];
      if (!def) return;

      // Procedural plates have no GLB: they are a shared unit plane whose UVs
      // span the cell 0..1. Kit tiles can carry several primitives (ground,
      // banks, water), so every part becomes its own InstancedMesh sharing the
      // same instance matrices.
      const parts = procedural
        ? [{ geometry: procedural.geometry(), createMaterial: procedural.createMaterial }]
        : (def.plate
          ? [{ geometry: getPlateGeometry(), material: getPlateMaterial(), name: 'plate' }]
          : modelCache.getMeshParts(def.url));
      if (!parts || !parts.length) return; // Model still loading

      const baseZ = def.baseZ || 0;
      const look = instances[0]?.look || null;
      const liquidConfig = look ? (LIQUID_SURFACE_CONFIGS[look.typeId] || null) : null;

      // One scale for every part, from the union footprint of the model, plus
      // the union box (height / run / centres) that the adaptive fits need.
      let maxFootprint = 0;
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;
      parts.forEach(part => {
        part.geometry.computeBoundingBox();
        const box = part.geometry.boundingBox;
        const size = new THREE.Vector3();
        box.getSize(size);
        maxFootprint = Math.max(maxFootprint, size.x, size.z);
        minX = Math.min(minX, box.min.x);
        maxX = Math.max(maxX, box.max.x);
        minY = Math.min(minY, box.min.y);
        maxY = Math.max(maxY, box.max.y);
        minZ = Math.min(minZ, box.min.z);
        maxZ = Math.max(maxZ, box.max.z);
      });
      const modelBox = Number.isFinite(minX)
        ? {
          centerX: (minX + maxX) / 2,
          minY,
          centerZ: (minZ + maxZ) / 2,
          height: maxY - minY,
          run: maxZ - minZ
        }
        : { centerX: 0, minY: 0, centerZ: 0, height: 0, run: 0 };
      const scaleFactor = (gridSize / (maxFootprint || 1)) * (def.scale || 1.0);
      scaleFactorByModel.set(modelKey, scaleFactor);

      const naturalHeight = modelBox.height * scaleFactor;
      const naturalRun = modelBox.run * scaleFactor;

      parts.forEach((part, partIndex) => {
        // Single-part models keep the plain variant key; multi-part kit tiles
        // suffix the primitive index so each material gets its own mesh.
        const partKey = parts.length > 1 ? `${variantKey}#${partIndex}` : variantKey;
        activeVariantKeys.add(partKey);

        let instMesh = this.instancedMeshes.get(partKey);
        const currentCapacity = instMesh?.userData?.capacity || 0;

        if (!instMesh || currentCapacity < instances.length) {
          if (instMesh) {
            this.group.remove(instMesh);
            instMesh.material?.dispose();
            instMesh.dispose?.();
          }

          const capacity = Math.max(instances.length * 2, 256);
          const material = part.createMaterial
            ? part.createMaterial()
            : this.buildPartMaterial({ def, part, look, liquidConfig });
          if (modelKey === 'foundation') {
            material.polygonOffset = true;
            material.polygonOffsetFactor = 1.0;
            material.polygonOffsetUnits = 1.0;
          }
          instMesh = new THREE.InstancedMesh(part.geometry, material, capacity);
          instMesh.name = `ThreeDTerrainTile:${partKey}`;
          // Instance matrices change on every terrain update, but three only
          // computes an InstancedMesh bounding sphere once — a stale sphere
          // culls whole variants ("tiles vanish at some zooms"). The map is
          // unbounded, so skip frustum culling entirely.
          instMesh.frustumCulled = false;
          instMesh.castShadow = procedural ? procedural.castShadow : def.noShadow !== true;
          instMesh.receiveShadow = procedural ? procedural.receiveShadow !== false : true;
          instMesh.userData = { capacity };
          this.instancedMeshes.set(partKey, instMesh);
          this.group.add(instMesh);
        }

        instMesh.userData.scaleFactor = scaleFactor;
        instMesh.userData.baseZ = baseZ;
        instMesh.userData.variantKey = variantKey;

        // Populate instance matrices (rotate by +90 deg around X so floor is
        // flat in X-Y plane). Ramps/stairs/foundations stretch to an exact
        // world height (`fitHeight`) and footprint run (`fitRun`) so they meet
        // the tile edges and the neighbour's level instead of the authored
        // model size. `normalize` recentres top-pivoted kit stairs so their
        // run spans the whole tile.
        instances.forEach((inst, idx) => {
          const heightMul = inst.fitHeight && naturalHeight > 0 ? inst.fitHeight / naturalHeight : 1;
          const runMul = inst.fitRun && naturalRun > 0 ? inst.fitRun / naturalRun : 1;
          this.dummy.position.set(inst.x, inst.y, inst.z + baseZ + (def.baseZFrac || 0) * gridSize);
          this.dummy.rotation.set(Math.PI / 2, 0, inst.rotationZ, 'ZYX');
          this.dummy.scale.set(
            scaleFactor * (inst.scaleX || 1),
            scaleFactor * heightMul * (inst.scaleY || 1),
            scaleFactor * runMul * (inst.scaleZ || 1)
          );
          this.dummy.updateMatrix();
          if (inst.normalize) {
            _normalizeMatrix.makeTranslation(-modelBox.centerX, -modelBox.minY, -modelBox.centerZ);
            this.dummy.matrix.multiply(_normalizeMatrix);
          }
          instMesh.setMatrixAt(idx, this.dummy.matrix);
        });

        instMesh.count = instances.length;
        instMesh.instanceMatrix.needsUpdate = true;
      });
    });

    // Hide any unused terrain variants (part keys included)
    this.instancedMeshes.forEach((mesh, key) => {
      if (!activeVariantKeys.has(key)) {
        mesh.count = 0;
        mesh.instanceMatrix.needsUpdate = true;
      }
    });

    // Toon outlines for models that opt in (scattered pieces)
    this.rebuildOutlineMeshes(instancesByVariant, scaleFactorByModel, gridSize);

    // Liquid sheets (water/ice/lava/acid)
    this.rebuildLiquidSurfaces(liquidCells, gridSize, elevationData, liquidCellKeys);
  }

  /**
   * Material for one primitive of a terrain model. Role of a part decides how
   * it is coloured:
   *  - `liquidParts`  the liquid surface: takes the terrain type's palette
   *                   colour plus that type's roughness/metalness/emissive,
   *  - `partPalette`  kit banks and trim: take a fixed terrain palette colour so
   *                   a shoreline matches the terrain painted next to it,
   *  - anything else  a liquid bed (dimmed wet stone) or a single-material
   *                   model, which keeps the calibrated terrain tint.
   */
  buildPartMaterial({ def, part, look, liquidConfig }) {
    const material = part.material.clone();
    const partName = part.name;

    if (def.tileMap) {
      const tileMap = getTerrainTileTexture(
        def.tileMap,
        def.tileRepeat ?? (1 / TERRAIN_UV_PER_CELL)
      );
      if (tileMap) {
        material.map = tileMap;
        // Prototype plates carry a flat baseColorFactor; with the authored art
        // on the map that colour would darken the texture on top of the
        // calibrated tint, so the art is the only albedo left.
        material.color.setRGB(1, 1, 1);
        material.needsUpdate = true;
      }
    }
    if (def.doubleSided) material.side = THREE.DoubleSide;

    const paletteRule = def.partPalette?.[partName];
    if (paletteRule && !material.map) {
      material.color.copy(resolvePaletteRuleTarget(paletteRule, look?.bankType));
      return material;
    }
    if (!look) return material;

    const config = TERRAIN_MATERIAL_CONFIGS[look.typeId] || {};
    const isBed = Boolean(liquidConfig) && !def.liquidParts?.includes(partName);

    if (isBed) {
      // Liquid bed: dimmed wet stone, no emissive/transparency of its own.
      material.color.multiply(look.bedTint || look.tint);
      if (config.roughness !== undefined) material.roughness = config.roughness;
      material.metalness = 0.02;
      return material;
    }

    // Liquid surface or single-material model.
    const isLiquidPart = Boolean(def.liquidParts?.includes(partName));
    if (isLiquidPart && !material.map) {
      material.color.copy(look.liquidTarget || look.target);
    } else {
      material.color.multiply(look.tint);
    }
    // Liquid surfaces follow the sheet's finish (roughness/metalness from
    // LIQUID_SURFACE_CONFIGS) so banked water and open water read as one body.
    const finish = isLiquidPart && liquidConfig ? liquidConfig : config;
    if (finish.roughness !== undefined) material.roughness = finish.roughness;
    if (finish.metalness !== undefined) material.metalness = finish.metalness;
    // Shore tiles carry their water inside the tile, so they stay opaque: the
    // type's translucency belongs to the open-water sheet above them.
    if (config.transparent && !isLiquidPart) {
      material.transparent = true;
      material.opacity = config.opacity ?? 1.0;
    }
    if (look.emissive) {
      material.emissive.copy(look.emissive);
      material.emissiveIntensity = look.emissiveStrength;
    }
    return material;
  }

  /**
   * Inverted-hull outline: the same footprint re-drawn slightly larger in black
   * with BackSide culling, so only a dark rim shows around each piece. Without
   * it the scattered flagstone pieces read as dark blobs on the grid.
   */
  rebuildOutlineMeshes(instancesByVariant, scaleFactorByModel, gridSize) {
    const activeModels = new Set();

    instancesByVariant.forEach((instances, variantKey) => {
      const [modelKey] = variantKey.split('|');
      const def = TERRAIN_MODEL_REGISTRY[modelKey];
      if (!def?.outline || def.plate) return;

      const geomMat = modelCache.getGeometryAndMaterial(def.url);
      if (!geomMat) return;

      const outline = typeof def.outline === 'object' ? def.outline : {};
      const baseScale = scaleFactorByModel.get(modelKey);
      if (!baseScale) return;
      const scaleFactor = baseScale * (outline.scale || 1.05);
      const lift = gridSize * (outline.lift || 0.008);
      activeModels.add(modelKey);

      let mesh = this.outlineMeshes.get(modelKey);
      const neededCapacity = instances.length;
      if (!mesh || (mesh.userData.capacity || 0) < neededCapacity) {
        if (mesh) {
          this.group.remove(mesh);
          mesh.dispose?.();
        }
        const capacity = Math.max(instances.length * 2, 256);
        mesh = new THREE.InstancedMesh(geomMat.geometry, this.outlineMaterial, capacity);
        mesh.name = `ThreeDTerrainOutline:${modelKey}`;
        mesh.frustumCulled = false;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.userData = { capacity };
        this.outlineMeshes.set(modelKey, mesh);
        this.group.add(mesh);
      }

      instances.forEach((inst, idx) => {
        this.dummy.position.set(inst.x, inst.y, inst.z + lift);
        this.dummy.rotation.set(Math.PI / 2, 0, inst.rotationZ, 'ZYX');
        this.dummy.scale.set(scaleFactor, scaleFactor, scaleFactor);
        this.dummy.updateMatrix();
        mesh.setMatrixAt(idx, this.dummy.matrix);
      });
      mesh.count = instances.length;
      mesh.instanceMatrix.needsUpdate = true;
    });

    this.outlineMeshes.forEach((mesh, modelKey) => {
      if (!activeModels.has(modelKey)) {
        mesh.count = 0;
        mesh.instanceMatrix.needsUpdate = true;
      }
    });
  }

  /**
   * One merged, world-space-UV sheet per liquid type, plus vertical water skins
   * where a liquid cell sits above a lower liquid neighbour. World UVs keep the
   * ripples continuous across adjacent cells (no per-cell texture repetition)
   * and let a single scrolling texture animate a whole lake.
   */
  rebuildLiquidSurfaces(cellsByType, gridSize, elevationData = {}, cellKeysByType = new Map()) {
    this.liquidMaterials = [];

    cellsByType.forEach((cells, typeId) => {
      const config = LIQUID_SURFACE_CONFIGS[typeId];
      if (!config || !cells.length) return;

      const lift = gridSize * (config.lift ?? LIQUID_SURFACE_LIFT);
      const rippleWorld = Math.max(gridSize * config.rippleSize, 1);
      // Each cell is a SEG x SEG patch instead of one quad: the finer mesh lets
      // the sheet feather into banks smoothly and clip its corners where the
      // shore cuts diagonally (a single quad can only fade whole edges).
      const SEG = 3;
      const VERTS = (SEG + 1) * (SEG + 1);
      const EDGE_FADE = 0.05;
      const CORNER_FADE = 0.10;
      const positions = new Float32Array(cells.length * VERTS * 3);
      const uvs = new Float32Array(cells.length * VERTS * 2);
      const colors = new Float32Array(cells.length * VERTS * 4);
      const indices = new Uint32Array(cells.length * SEG * SEG * 6);
      const openKeys = new Set(cells.map((cell) => `${cell.gx},${cell.gy}`));
      const typeKeys = cellKeysByType.get(typeId) || openKeys;
      const shoreLiquid = Boolean(WATER_SHORE_TYPES[typeId]);
      const smooth = (t) => {
        const c = Math.min(1, Math.max(0, t));
        return c * c * (3 - 2 * c);
      };
      const banked = (gx2, gy2) => {
        const key = `${gx2},${gy2}`;
        return typeKeys.has(key) && !openKeys.has(key);
      };
      const blocked = (gx2, gy2) => !typeKeys.has(`${gx2},${gy2}`);

      cells.forEach((cell, i) => {
        const z = cell.z + lift;
        // Orthogonal banked neighbours feather the shared edge smoothly
        const fN = shoreLiquid && banked(cell.gx, cell.gy - 1);
        const fE = shoreLiquid && banked(cell.gx + 1, cell.gy);
        const fS = shoreLiquid && banked(cell.gx, cell.gy + 1);
        const fW = shoreLiquid && banked(cell.gx - 1, cell.gy);
        // Only clip diagonal corners if bordering real non-water land AND a banked neighbour
        const cNE = shoreLiquid && blocked(cell.gx + 1, cell.gy - 1) && (fN || fE);
        const cNW = shoreLiquid && blocked(cell.gx - 1, cell.gy - 1) && (fN || fW);
        const cSE = shoreLiquid && blocked(cell.gx + 1, cell.gy + 1) && (fS || fE);
        const cSW = shoreLiquid && blocked(cell.gx - 1, cell.gy + 1) && (fS || fW);

        for (let ix = 0; ix <= SEG; ix += 1) {
          for (let iy = 0; iy <= SEG; iy += 1) {
            const lx = -0.5 + ix / SEG;
            const ly = -0.5 + iy / SEG;
            const px = cell.x + lx * gridSize;
            const py = cell.y + ly * gridSize;
            let alpha = 1;
            if (fN) alpha *= smooth((ly + 0.5) / EDGE_FADE);
            if (fS) alpha *= smooth((0.5 - ly) / EDGE_FADE);
            if (fW) alpha *= smooth((lx + 0.5) / EDGE_FADE);
            if (fE) alpha *= smooth((0.5 - lx) / EDGE_FADE);
            if (cNE) alpha *= smooth(Math.hypot(0.5 - lx, ly + 0.5) / CORNER_FADE);
            if (cNW) alpha *= smooth(Math.hypot(lx + 0.5, ly + 0.5) / CORNER_FADE);
            if (cSE) alpha *= smooth(Math.hypot(0.5 - lx, 0.5 - ly) / CORNER_FADE);
            if (cSW) alpha *= smooth(Math.hypot(lx + 0.5, 0.5 - ly) / CORNER_FADE);
            const vi = i * VERTS + ix * (SEG + 1) + iy;
            positions.set([px, py, z], vi * 3);
            uvs.set([px / rippleWorld, py / rippleWorld], vi * 2);
            colors.set([1, 1, 1, alpha], vi * 4);
          }
        }

        for (let ix = 0; ix < SEG; ix += 1) {
          for (let iy = 0; iy < SEG; iy += 1) {
            const a = i * VERTS + ix * (SEG + 1) + iy;
            const b = i * VERTS + (ix + 1) * (SEG + 1) + iy;
            const c = i * VERTS + (ix + 1) * (SEG + 1) + iy + 1;
            const d = i * VERTS + ix * (SEG + 1) + iy + 1;
            indices.set([a, b, c, a, c, d], (i * SEG * SEG + ix * SEG + iy) * 6);
          }
        }
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      // Flat sheet: without explicit normals the lit material would sample a
      // zero normal and lose every sun/light contribution.
      const normals = new Float32Array(cells.length * VERTS * 3);
      for (let i = 0; i < cells.length * VERTS; i += 1) normals[i * 3 + 2] = 1;
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      geometry.computeBoundingSphere();

      const textures = getLiquidSurfaceTextures(config.profile);
      const isTransparent = config.opacity < 1;
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.color).multiplyScalar(config.boost || 1),
        transparent: isTransparent,
        opacity: config.opacity,
        roughness: config.roughness,
        metalness: config.metalness,
        depthWrite: !isTransparent,
        side: THREE.FrontSide,
        vertexColors: true,
        map: textures ? textures.albedo : null,
        normalMap: textures ? textures.normal : null,
        emissive: new THREE.Color(config.emissive || '#000000'),
        emissiveIntensity: config.emissive ? config.emissiveIntensity : 0,
        emissiveMap: config.useEmissiveMap && textures ? textures.albedo : null
      });
      material.name = `ThreeDTerrainLiquid:${typeId}`;
      if (textures) {
        material.normalScale = new THREE.Vector2(config.normalScale, config.normalScale);
      }

      const previous = this.liquidSurfaces.get(typeId);
      if (previous) {
        this.group.remove(previous);
        previous.geometry.dispose();
        previous.material.dispose();
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = `ThreeDTerrainLiquid:${typeId}`;
      mesh.receiveShadow = true;
      // Optically flat water would otherwise drop a hard "floating slab" shadow
      // on the surface below whenever its cells sit on a higher elevation level.
      mesh.castShadow = false;
      mesh.renderOrder = 2;
      this.liquidSurfaces.set(typeId, mesh);
      this.group.add(mesh);

      this.liquidMaterials.push({ material, config });

      // Water skins for elevated water.
      const curtainGeometry = buildLiquidCurtainGeometry(cells, {
        gridSize,
        lift,
        elevationData,
        rippleWorld,
        cellKeys: cellKeysByType.get(typeId)
      });
      const previousCurtain = this.liquidCurtains.get(typeId);
      if (previousCurtain) {
        this.group.remove(previousCurtain);
        previousCurtain.geometry.dispose();
      }
      if (curtainGeometry) {
        const curtain = new THREE.Mesh(curtainGeometry, material);
        curtain.name = `ThreeDTerrainLiquidDrop:${typeId}`;
        curtain.receiveShadow = true;
        curtain.castShadow = false;
        curtain.renderOrder = 2;
        this.liquidCurtains.set(typeId, curtain);
        this.group.add(curtain);
      } else {
        this.liquidCurtains.delete(typeId);
      }
    });

    // Hide any liquid type that no longer has cells on the map
    this.liquidSurfaces.forEach((mesh, typeId) => {
      if (!cellsByType.has(typeId)) mesh.visible = false;
    });
    this.liquidCurtains.forEach((mesh, typeId) => {
      mesh.visible = Boolean(cellsByType.get(typeId)?.length);
    });
  }

  /**
   * Scroll the liquid ripple textures and pulse the emissive hazard glow.
   * Returns true when something actually moved.
   */
  /**
   * Continuous pits: flood-fills adjacent pit/abyss cells into regions and
   * builds one floor plus one rim wall per region, so a 2x2 painted pit reads
   * as a single bigger pit instead of four single-cell holes.
   */
  rebuildPitGeometry(pitCells, gridSize, gridOffsetX, gridOffsetY) {
    if (this.pitMesh) {
      this.group.remove(this.pitMesh);
      this.pitMesh.geometry.dispose();
      this.pitMesh = null;
    }
    if (!pitCells.length) return;

    const positions = [];
    const colors = [];
    const pushQuad = (a, b, c, d, color, zJitter = 0) => {
      const quad = [a, b, c, d].map((vtx) => ({
        x: vtx.x,
        y: vtx.y,
        z: vtx.z + (zJitter ? (cellHash(Math.round(vtx.x), Math.round(vtx.y), 7) - 0.5) * zJitter : 0)
      }));
      const tris = [quad[0], quad[1], quad[2], quad[0], quad[2], quad[3]];
      tris.forEach((vtx) => {
        positions.push(vtx.x, vtx.y, vtx.z);
        colors.push(color[0], color[1], color[2]);
      });
    };

    const cellsByKey = new Map();
    pitCells.forEach((cell) => {
      cellsByKey.set(`${cell.gx},${cell.gy}`, cell);
    });
    const visited = new Set();

    cellsByKey.forEach((start) => {
      const startKey = `${start.gx},${start.gy}`;
      if (visited.has(startKey)) return;
      const region = [];
      const queue = [start];
      visited.add(startKey);
      while (queue.length) {
        const cell = queue.shift();
        region.push(cell);
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
          const key = `${cell.gx + dx},${cell.gy + dy}`;
          const next = cellsByKey.get(key);
          if (next && next.typeId === start.typeId && !visited.has(key)) {
            visited.add(key);
            queue.push(next);
          }
        });
      }

      const spec = PIT_TYPES[start.typeId];
      const floorZ = start.worldZ + spec.depth * gridSize;
      const half = gridSize / 2;

      region.forEach((cell) => {
        const cX = cell.worldX;
        const cY = -cell.worldY;
        pushQuad(
          { x: cX - half, y: cY - half, z: floorZ },
          { x: cX + half, y: cY - half, z: floorZ },
          { x: cX + half, y: cY + half, z: floorZ },
          { x: cX - half, y: cY + half, z: floorZ },
          spec.floor,
          1.2
        );
        const isSame = (dx, dy) => {
          const neighbour = cellsByKey.get(`${cell.gx + dx},${cell.gy + dy}`);
          return Boolean(neighbour && neighbour.typeId === start.typeId);
        };
        // 2D dy = -1 is North, which in Three.js (y = -worldY) is +Y (cY + half)
        if (!isSame(0, -1)) {
          pushQuad(
            { x: cX + half, y: cY + half, z: cell.worldZ },
            { x: cX - half, y: cY + half, z: cell.worldZ },
            { x: cX - half, y: cY + half, z: floorZ },
            { x: cX + half, y: cY + half, z: floorZ },
            spec.wall
          );
        }
        // 2D dx = 1 is East (cX + half)
        if (!isSame(1, 0)) {
          pushQuad(
            { x: cX + half, y: cY - half, z: cell.worldZ },
            { x: cX + half, y: cY + half, z: cell.worldZ },
            { x: cX + half, y: cY + half, z: floorZ },
            { x: cX + half, y: cY - half, z: floorZ },
            spec.wall
          );
        }
        // 2D dy = 1 is South, which in Three.js (y = -worldY) is -Y (cY - half)
        if (!isSame(0, 1)) {
          pushQuad(
            { x: cX - half, y: cY - half, z: cell.worldZ },
            { x: cX + half, y: cY - half, z: cell.worldZ },
            { x: cX + half, y: cY - half, z: floorZ },
            { x: cX - half, y: cY - half, z: floorZ },
            spec.wall
          );
        }
        // 2D dx = -1 is West (cX - half)
        if (!isSame(-1, 0)) {
          pushQuad(
            { x: cX - half, y: cY + half, z: cell.worldZ },
            { x: cX - half, y: cY - half, z: cell.worldZ },
            { x: cX - half, y: cY - half, z: floorZ },
            { x: cX - half, y: cY + half, z: floorZ },
            spec.wall
          );
        }
      });
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, this.pitMaterial);
    mesh.name = 'ThreeDTerrainPits';
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    this.pitMesh = mesh;
    this.group.add(mesh);
  }

  /**
   * Procedural feather-strips between neighbouring terrain types: gradient
   * quads from one palette colour to the other with a wavy, speckled boundary,
   * plus fan patches where four types meet at a grid point.
   */
  rebuildBlendGeometry(blendEdges, blendCorners, gridSize, gridOffsetX, gridOffsetY) {
    if (this.blendMesh) {
      this.group.remove(this.blendMesh);
      this.blendMesh.geometry.dispose();
      this.blendMesh = null;
    }
    if (!blendEdges.length && !blendCorners.length) return;

    const colorCache = new Map();
    const colorOf = (typeId) => {
      if (!colorCache.has(typeId)) colorCache.set(typeId, paletteColorOf(typeId));
      return colorCache.get(typeId);
    };

    const positions = [];
    const colors = [];
    const pushVertex = (v) => {
      positions.push(v.x, v.y, v.z);
      colors.push(v.r, v.g, v.b, v.a);
    };
    const pushTriangle = (a, b, c) => {
      pushVertex(a);
      pushVertex(b);
      pushVertex(c);
    };

    const LEN_SEG = 6;
    const W_SEG = 3;
    const W = gridSize * 0.3;
    const LIFT = 0.2;
    const ALPHA_PEAK = 0.8;

    blendEdges.forEach((edge) => {
      const { gx, gy, dir, typeA, typeB, worldZ } = edge;
      const colorA = colorOf(typeA);
      const colorB = colorOf(typeB);
      const vertical = dir === 'east' || dir === 'west';
      const westLike = dir === 'west' || dir === 'north';
      const baseX = vertical
        ? (dir === 'east' ? (gx + 1) : gx) * gridSize + gridOffsetX
        : gx * gridSize + gridOffsetX;
      const baseY = vertical
        ? gy * gridSize + gridOffsetY
        : (dir === 'south' ? (gy + 1) : gy) * gridSize + gridOffsetY;
      const alongX = vertical ? 0 : 1;
      const alongY = vertical ? 1 : 0;
      const wStart = westLike ? 0 : -0.5;
      const wEnd = westLike ? 0.5 : (edge.half ? 0 : 0.5);

      const verts = [];
      for (let i = 0; i <= LEN_SEG; i += 1) {
        for (let j = 0; j <= W_SEG; j += 1) {
          const u = i / LEN_SEG;
          const w = wStart + (j / W_SEG) * (wEnd - wStart);
          const px = baseX + alongX * u * gridSize + (1 - alongX) * w * W;
          const py = baseY + alongY * u * gridSize + (1 - alongY) * w * W;
          const t = westLike ? 1 - w / 0.5 : (w + 0.5) / (edge.half ? 0.5 : 1);
          const saltA = dir === 'east' ? gx : gx + i;
          const saltB = dir === 'east' ? gy + i : gy;
          const n = cellHash(saltA, saltB, 21);
          const n2 = cellHash(i * 31 + j, gx + gy, 33);
          const tt = Math.min(1, Math.max(0, t + (n - 0.5) * 0.5));
          const dim = 0.95 + 0.1 * n2;
          const alpha = (1 - Math.min(1, Math.abs(w) * 2)) * ALPHA_PEAK;
          verts.push({
            x: px,
            y: -py,
            z: worldZ + LIFT,
            r: (colorA.r + (colorB.r - colorA.r) * tt) * dim,
            g: (colorA.g + (colorB.g - colorA.g) * tt) * dim,
            b: (colorA.b + (colorB.b - colorA.b) * tt) * dim,
            a: alpha
          });
        }
      }
      for (let i = 0; i < LEN_SEG; i += 1) {
        for (let j = 0; j < W_SEG; j += 1) {
          const a = verts[i * (W_SEG + 1) + j];
          const b = verts[(i + 1) * (W_SEG + 1) + j];
          const c = verts[(i + 1) * (W_SEG + 1) + j + 1];
          const d = verts[i * (W_SEG + 1) + j + 1];
          pushTriangle(a, c, b);
          pushTriangle(a, d, c);
        }
      }
    });

    blendCorners.forEach((corner) => {
      const { gx, gy, types, worldZ } = corner;
      const px = gx * gridSize + gridOffsetX;
      const py = gy * gridSize + gridOffsetY;
      const H = gridSize * 0.17;
      const quad = {
        nw: colorOf(types.nw),
        ne: colorOf(types.ne),
        se: colorOf(types.se),
        sw: colorOf(types.sw)
      };
      const center = { x: px, y: -py, z: worldZ + LIFT, r: 0, g: 0, b: 0, a: 1 };
      Object.values(quad).forEach((color) => {
        center.r += color.r / 4;
        center.g += color.g / 4;
        center.b += color.b / 4;
      });
      const jitX = 1 + (cellHash(gx, gy, 41) - 0.5) * 0.2;
      const jitY = 1 + (cellHash(gx, gy, 43) - 0.5) * 0.2;
      const mk = (qx, qy, color) => ({
        x: px + qx * H * jitX,
        y: -(py + qy * H * jitY),
        z: worldZ + LIFT,
        r: color.r,
        g: color.g,
        b: color.b,
        a: 0
      });
      const nw = mk(-1, -1, quad.nw);
      const ne = mk(1, -1, quad.ne);
      const se = mk(1, 1, quad.se);
      const sw = mk(-1, 1, quad.sw);
      pushTriangle(center, nw, ne);
      pushTriangle(center, ne, se);
      pushTriangle(center, se, sw);
      pushTriangle(center, sw, nw);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, this.blendMaterial);
    mesh.name = 'ThreeDTerrainBlends';
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    this.blendMesh = mesh;
    this.group.add(mesh);
  }

  updateAnimations(delta) {
    if (!this.liquidMaterials.length || !Number.isFinite(delta)) return false;
    this.liquidTime += delta;

    const time = this.liquidTime;
    this.liquidMaterials.forEach(({ material, config }) => {
      if (material.map) material.map.offset.set(time * config.scroll.x, time * config.scroll.y);
      if (material.normalMap) {
        material.normalMap.offset.set(-time * config.scroll.x * 0.6, time * config.scroll.y * 0.8);
      }
      if (config.emissive) {
        material.emissiveIntensity = config.emissiveIntensity * (0.88 + 0.12 * Math.sin(time * 1.7));
      }
    });
    return true;
  }

  dispose() {
    if (this.unsubscribeCache) {
      this.unsubscribeCache();
      this.unsubscribeCache = null;
    }
    this.scene.remove(this.group);
    this.instancedMeshes.forEach(mesh => {
      // Geometry is shared via ModelCacheService Ã¢â‚¬â€ only the cloned material
      // belongs to this manager.
      mesh.material?.dispose();
      mesh.dispose?.();
    });
    this.instancedMeshes.clear();

    this.outlineMeshes.forEach(mesh => {
      // Outline geometry is shared with the terrain variant mesh.
      mesh.dispose?.();
    });
    this.outlineMeshes.clear();
    this.outlineMaterial.dispose();

    this.liquidSurfaces.forEach(mesh => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.liquidSurfaces.clear();
    this.liquidCurtains.forEach(mesh => {
      // Geometry is owned here; the material is shared with the flat sheet.
      mesh.geometry.dispose();
    });
    this.liquidCurtains.clear();
    this.liquidMaterials = [];
    if (this.blendMesh) {
      this.group.remove(this.blendMesh);
      this.blendMesh.geometry.dispose();
      this.blendMesh = null;
    }
    this.blendMaterial?.dispose();
    if (this.pitMesh) {
      this.group.remove(this.pitMesh);
      this.pitMesh.geometry.dispose();
      this.pitMesh = null;
    }
    this.pitMaterial?.dispose();
  }
}
