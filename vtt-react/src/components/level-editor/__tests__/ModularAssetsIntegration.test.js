import * as THREE from 'three';
import fs from 'fs';
import path from 'path';
import { PROFESSIONAL_TERRAIN_TYPES, WALL_TYPES, WALL_CATEGORIES } from '../../../store/levelEditorStore';
import { TERRAIN_MODEL_REGISTRY, resolveTerrainModelKey, TERRAIN_TEXTURE_MAP } from '../three/ThreeDTerrainManager';
import { ThreeDWallManager, WALL_MODELS, WALL_MODEL_METRICS } from '../three/ThreeDWallManager';
import { ThreeDPropManager } from '../three/ThreeDPropManager';

jest.mock('../../../services/ModelCacheService', () => {
  const three = require('three');
  const sharedGeometry = new three.BoxGeometry(4, 4, 1);
  const sharedMaterial = new three.MeshStandardMaterial();
  return {
    __esModule: true,
    default: {
      createInstance: () => new three.Group(),
      loadModel: () => Promise.resolve({}),
      subscribe: () => () => {},
      getGeometryAndMaterial: () => ({ geometry: sharedGeometry, material: sharedMaterial })
    }
  };
});

describe('Modular Tiles and Wall Assets Integration', () => {
  describe('PROFESSIONAL_TERRAIN_TYPES', () => {
    const allAddedTerrains = [
      'grate_floor',
      'spike_trap',
      'dark_wood',
      'weathered_stone',
      'rocky_dirt',
      'overgrown_dirt',
      'cobblestone_road',
      'wooden_planks',
      'stone_path'
    ];

    it.each(allAddedTerrains)('defines valid terrain type %s', (id) => {
      const def = PROFESSIONAL_TERRAIN_TYPES[id];
      expect(def).toBeDefined();
      expect(def.id).toBe(id);
      expect(def.name).toBeTruthy();
      expect(def.category).toMatch(/^(natural|dungeon|hazard)$/);
      expect(def.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(def.tileVariations.length).toBeGreaterThan(0);
      expect(def.tileVariations[0]).toMatch(/^\/assets\/tiles\/.+\.png$/);
      expect(typeof def.movementCost).toBe('number');
      expect(def.description).toBeTruthy();
    });

    it('maps hazard damage for spike_trap', () => {
      expect(PROFESSIONAL_TERRAIN_TYPES.spike_trap.damage).toBe('2d6 piercing');
    });

    it('all terrain textures exist in public/ directory', () => {
      allAddedTerrains.forEach(id => {
        const def = PROFESSIONAL_TERRAIN_TYPES[id];
        def.tileVariations.forEach(texUrl => {
          const localRel = texUrl.replace(/^\//, '');
          const fullPath = path.resolve('public', localRel);
          expect(fs.existsSync(fullPath)).toBe(true);
        });
      });
    });

    it('each modular terrain has a unique dedicated texture and distinct shortName', () => {
      expect(PROFESSIONAL_TERRAIN_TYPES.grate_floor.tileVariations[0]).toBe('/assets/tiles/Grate1.png');
      expect(PROFESSIONAL_TERRAIN_TYPES.spike_trap.tileVariations[0]).toBe('/assets/tiles/Spikes1.png');
      expect(PROFESSIONAL_TERRAIN_TYPES.dark_wood.tileVariations[0]).toBe('/assets/tiles/DarkWood1.png');
      expect(PROFESSIONAL_TERRAIN_TYPES.rocky_dirt.tileVariations[0]).toBe('/assets/tiles/RockyDirt1.png');
      expect(PROFESSIONAL_TERRAIN_TYPES.overgrown_dirt.tileVariations[0]).toBe('/assets/tiles/OvergrownDirt1.png');
      expect(PROFESSIONAL_TERRAIN_TYPES.cobblestone_road.tileVariations[0]).toBe('/assets/tiles/CobbleRoad1.png');
      expect(PROFESSIONAL_TERRAIN_TYPES.wooden_planks.tileVariations[0]).toBe('/assets/tiles/WoodenPlanks1.png');
      expect(PROFESSIONAL_TERRAIN_TYPES.stone_path.tileVariations[0]).toBe('/assets/tiles/StonePath1.png');

      // Verify no duplicate textures between different functional terrain types
      expect(PROFESSIONAL_TERRAIN_TYPES.grate_floor.tileVariations[0])
        .not.toEqual(PROFESSIONAL_TERRAIN_TYPES.dungeon_floor.tileVariations[0]);
      expect(PROFESSIONAL_TERRAIN_TYPES.cobblestone_road.tileVariations[0])
        .not.toEqual(PROFESSIONAL_TERRAIN_TYPES.cobblestone.tileVariations[0]);
      expect(PROFESSIONAL_TERRAIN_TYPES.wooden_planks.tileVariations[0])
        .not.toEqual(PROFESSIONAL_TERRAIN_TYPES.wooden_floor.tileVariations[0]);

      // Verify shortName is present and concise for all modular terrain types
      allAddedTerrains.forEach(id => {
        const def = PROFESSIONAL_TERRAIN_TYPES[id];
        expect(def.shortName).toBeTruthy();
        expect(def.shortName.length).toBeLessThanOrEqual(12);
      });
    });

    it('TERRAIN_TEXTURE_MAP accurately maps all modular terrain types to dedicated textures', () => {
      expect(TERRAIN_TEXTURE_MAP.grate_floor).toBe('/assets/tiles/Grate1.png');
      expect(TERRAIN_TEXTURE_MAP.spike_trap).toBe('/assets/tiles/Spikes1.png');
      expect(TERRAIN_TEXTURE_MAP.dark_wood).toBe('/assets/tiles/DarkWood1.png');
      expect(TERRAIN_TEXTURE_MAP.rocky_dirt).toBe('/assets/tiles/RockyDirt1.png');
      expect(TERRAIN_TEXTURE_MAP.overgrown_dirt).toBe('/assets/tiles/OvergrownDirt1.png');
      expect(TERRAIN_TEXTURE_MAP.cobblestone_road).toBe('/assets/tiles/CobbleRoad1.png');
      expect(TERRAIN_TEXTURE_MAP.wooden_planks).toBe('/assets/tiles/WoodenPlanks1.png');
      expect(TERRAIN_TEXTURE_MAP.stone_path).toBe('/assets/tiles/StonePath1.png');
    });

    it('unifies sand and water to single seamless textures without jarring random swaps', () => {
      expect(PROFESSIONAL_TERRAIN_TYPES.sand.tileVariations).toHaveLength(1);
      expect(PROFESSIONAL_TERRAIN_TYPES.sand.tileVariations[0]).toBe('/assets/tiles/Sand1.png');
      expect(PROFESSIONAL_TERRAIN_TYPES.water.tileVariations).toHaveLength(1);
      expect(PROFESSIONAL_TERRAIN_TYPES.water.tileVariations[0]).toBe('/assets/tiles/Water1.png');
    });
  });

  describe('WALL_TYPES and WALL_CATEGORIES', () => {
    const allAddedWalls = [
      'hedge',
      'iron_fence',
      'wooden_fence',
      'town_wall',
      'gothic_stone',
      'wall_cracked',
      'wall_gated',
      'town_door',
      'iron_gate',
      'wooden_gate',
      'hedge_gate',
      'town_window',
      'stone_column',
      'wooden_column',
      'wall_diagonal',
      'wall_curved'
    ];

    it.each(allAddedWalls)('defines valid wall type %s', (id) => {
      const def = WALL_TYPES[id];
      expect(def).toBeDefined();
      expect(def.id).toBe(id);
      expect(def.name).toBeTruthy();
      expect(def.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(def.imageUrl).toMatch(/^\/assets\/walls\/.+\.png$/);
      expect(typeof def.blocksMovement).toBe('boolean');
      expect(typeof def.blocksLineOfSight).toBe('boolean');
      expect(def.description).toBeTruthy();
    });

    it('all wall preview textures exist in public/ directory', () => {
      allAddedWalls.forEach(id => {
        const def = WALL_TYPES[id];
        const localRel = def.imageUrl.replace(/^\//, '');
        const fullPath = path.resolve('public', localRel);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });

    it('correctly sets visibility and movement for fences and barriers', () => {
      expect(WALL_TYPES.iron_fence.blocksMovement).toBe(true);
      expect(WALL_TYPES.iron_fence.blocksLineOfSight).toBe(false);

      expect(WALL_TYPES.wooden_fence.blocksMovement).toBe(true);
      expect(WALL_TYPES.wooden_fence.blocksLineOfSight).toBe(false);

      expect(WALL_TYPES.wall_gated.blocksMovement).toBe(true);
      expect(WALL_TYPES.wall_gated.blocksLineOfSight).toBe(false);

      expect(WALL_TYPES.hedge.blocksMovement).toBe(true);
      expect(WALL_TYPES.hedge.blocksLineOfSight).toBe(true);
    });

    it('correctly configures interactive doors and gates', () => {
      const doorsAndGates = ['town_door', 'iron_gate', 'wooden_gate', 'hedge_gate'];
      doorsAndGates.forEach(id => {
        const def = WALL_TYPES[id];
        expect(def.interactive).toBe(true);
        expect(Array.isArray(def.states)).toBe(true);
        expect(def.states).toContain('open');
        expect(def.states).toContain('closed');
      });
    });

    it('correctly configures structural columns and windows', () => {
      expect(WALL_TYPES.town_window.isWindow).toBe(true);
      expect(WALL_TYPES.town_window.blocksMovement).toBe(true);
      expect(WALL_TYPES.town_window.blocksLineOfSight).toBe(false);

      expect(WALL_TYPES.stone_column.blocksMovement).toBe(true);
      expect(WALL_TYPES.stone_column.blocksLineOfSight).toBe(false);

      expect(WALL_TYPES.wooden_column.blocksMovement).toBe(true);
      expect(WALL_TYPES.wooden_column.blocksLineOfSight).toBe(false);
    });

    it('contains all required wall categories', () => {
      expect(WALL_CATEGORIES.BASIC).toBe('Basic Walls');
      expect(WALL_CATEGORIES.TOWN).toBe('Town Architecture');
      expect(WALL_CATEGORIES.FENCES).toBe('Fences & Barriers');
      expect(WALL_CATEGORIES.VARIATIONS).toBe('Variations & Parapets');
      expect(WALL_CATEGORIES.INTERACTIVE).toBe('Interactive Elements');
      expect(WALL_CATEGORIES.WINDOW).toBe('Windows & Slits');
    });
  });

  describe('ThreeDTerrainManager Model Resolution', () => {
    it('resolves correct 3D floor models for newly added terrain types', () => {
      const keyGrate = resolveTerrainModelKey('grate_floor', PROFESSIONAL_TERRAIN_TYPES.grate_floor);
      expect(TERRAIN_MODEL_REGISTRY[keyGrate].url).toContain('floor_grate.glb');

      const keySpike = resolveTerrainModelKey('spike_trap', PROFESSIONAL_TERRAIN_TYPES.spike_trap);
      expect(TERRAIN_MODEL_REGISTRY[keySpike].url).toContain('floor_spikes.glb');

      const keyDarkWood = resolveTerrainModelKey('dark_wood', PROFESSIONAL_TERRAIN_TYPES.dark_wood);
      expect(TERRAIN_MODEL_REGISTRY[keyDarkWood].url).toContain('floor_wood_dark.glb');

      const keyWeathered = resolveTerrainModelKey('weathered_stone', PROFESSIONAL_TERRAIN_TYPES.weathered_stone);
      expect(TERRAIN_MODEL_REGISTRY[keyWeathered].url).toContain('floor_stone_rocks.glb');

      const keyRockyDirt = resolveTerrainModelKey('rocky_dirt', PROFESSIONAL_TERRAIN_TYPES.rocky_dirt);
      expect(TERRAIN_MODEL_REGISTRY[keyRockyDirt].url).toContain('floor_dirt_rocky.glb');

      const keyOvergrown = resolveTerrainModelKey('overgrown_dirt', PROFESSIONAL_TERRAIN_TYPES.overgrown_dirt);
      expect(TERRAIN_MODEL_REGISTRY[keyOvergrown].url).toContain('floor_tile_small_weeds_A.glb');

      const keyCobble = resolveTerrainModelKey('cobblestone', PROFESSIONAL_TERRAIN_TYPES.cobblestone);
      expect(TERRAIN_MODEL_REGISTRY[keyCobble].url).toContain('floor_stone.glb');

      const keyDirt = resolveTerrainModelKey('dirt', PROFESSIONAL_TERRAIN_TYPES.dirt);
      expect(TERRAIN_MODEL_REGISTRY[keyDirt].url).toContain('floor_dirt.glb');

      const keyCobbleRoad = resolveTerrainModelKey('cobblestone_road', PROFESSIONAL_TERRAIN_TYPES.cobblestone_road);
      expect(TERRAIN_MODEL_REGISTRY[keyCobbleRoad].url).toContain('road_stone.glb');

      const keyBoardwalk = resolveTerrainModelKey('wooden_planks', PROFESSIONAL_TERRAIN_TYPES.wooden_planks);
      expect(TERRAIN_MODEL_REGISTRY[keyBoardwalk].url).toContain('wooden_planks.glb');

      const keyStonePath = resolveTerrainModelKey('stone_path', PROFESSIONAL_TERRAIN_TYPES.stone_path);
      expect(TERRAIN_MODEL_REGISTRY[keyStonePath].url).toContain('road_graveyard.glb');

      const keyBrickFloor = resolveTerrainModelKey('brick_floor', PROFESSIONAL_TERRAIN_TYPES.brick_floor);
      expect(TERRAIN_MODEL_REGISTRY[keyBrickFloor].url).toContain('dungeon_brick_floor.glb');

      const keyQuatWood = resolveTerrainModelKey('quaternius_wood', PROFESSIONAL_TERRAIN_TYPES.quaternius_wood);
      expect(TERRAIN_MODEL_REGISTRY[keyQuatWood].url).toContain('quaternius_wood_floor.glb');

      const keyKayCobble = resolveTerrainModelKey('kaykit_cobble', PROFESSIONAL_TERRAIN_TYPES.kaykit_cobble);
      expect(TERRAIN_MODEL_REGISTRY[keyKayCobble].url).toContain('kaykit_cobble_path.glb');
    });

    it('contains valid GLB models in TERRAIN_MODEL_REGISTRY', () => {
      expect(TERRAIN_MODEL_REGISTRY.grate.url).toMatch(/\.glb$/);
      expect(TERRAIN_MODEL_REGISTRY.spikes.url).toMatch(/\.glb$/);
      expect(TERRAIN_MODEL_REGISTRY.wood_floor_dark.url).toMatch(/\.glb$/);
      expect(TERRAIN_MODEL_REGISTRY.stone_rocks.url).toMatch(/\.glb$/);
      expect(TERRAIN_MODEL_REGISTRY.dirt_rocky.url).toMatch(/\.glb$/);
      expect(TERRAIN_MODEL_REGISTRY.road_stone.url).toMatch(/\.glb$/);
      expect(TERRAIN_MODEL_REGISTRY.wooden_planks.url).toMatch(/\.glb$/);
      expect(TERRAIN_MODEL_REGISTRY.road_graveyard.url).toMatch(/\.glb$/);
    });

    it('all registered terrain GLB models exist in public/ directory', () => {
      Object.values(TERRAIN_MODEL_REGISTRY).forEach(reg => {
        // Procedural plates (ground slabs) have no GLB of their own.
        if (reg.plate || !reg.url) return;
        const localRel = reg.url.replace(/^\//, '');
        const fullPath = path.resolve('public', localRel);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });
  });

  describe('ThreeDWallManager Model Resolution and Metrics', () => {
    const manager = new ThreeDWallManager({ add: () => {} });

    it('resolves dedicated models for newly added walls', () => {
      expect(manager.resolveWallModelUrl({ type: 'hedge' })).toBe(WALL_MODELS.hedge);
      expect(manager.resolveWallModelUrl({ type: 'iron_fence' })).toBe(WALL_MODELS.metal);
      expect(manager.resolveWallModelUrl({ type: 'wooden_fence' })).toBe(WALL_MODELS.wooden_fence);
      expect(manager.resolveWallModelUrl({ type: 'town_wall' })).toBe(WALL_MODELS.town_wall);
      expect(manager.resolveWallModelUrl({ type: 'gothic_stone' })).toBe(WALL_MODELS.gothic_stone);
      expect(manager.resolveWallModelUrl({ type: 'wall_cracked' })).toBe(WALL_MODELS.cracked);
      expect(manager.resolveWallModelUrl({ type: 'wall_gated' })).toBe(WALL_MODELS.gated);
      expect(manager.resolveWallModelUrl({ type: 'stone_column' })).toBe(WALL_MODELS.pillar_stone);
      expect(manager.resolveWallModelUrl({ type: 'wooden_column' })).toBe(WALL_MODELS.pillar_wood);
      expect(manager.resolveWallModelUrl({ type: 'wall_diagonal' })).toBe(WALL_MODELS.town_wall_diagonal);
      expect(manager.resolveWallModelUrl({ type: 'wall_curved' })).toBe(WALL_MODELS.town_wall_curved);
      // Window features must fit any host run, so the town window uses the
      // host-agnostic kit window instead of the dedicated town stucco piece.
      expect(manager.resolveWallModelUrl({ type: 'town_window' })).toBe(WALL_MODELS.window_closed);
      expect(manager.resolveWallModelUrl({ type: 'quaternius_wood' })).toBe(WALL_MODELS.quaternius_wood);
    });

    it('has authored metrics for all registered wall models', () => {
      Object.values(WALL_MODELS).forEach(url => {
        const metrics = WALL_MODEL_METRICS[url];
        if (metrics) {
          expect(metrics.length).toBeGreaterThan(0);
          expect(metrics.height).toBeGreaterThan(0);
        }
      });
    });

    it('preserves authentic authored materials without unwanted color tints', () => {
      const authoredTypes = [
        'hedge',
        'wooden_fence',
        'town_wall',
        'gothic_stone',
        'stone_column',
        'wooden_column',
        'wall_diagonal',
        'wall_curved',
        'town_window',
        'town_door',
        'iron_gate',
        'wooden_gate',
        'hedge_gate',
        'quaternius_wood'
      ];

      authoredTypes.forEach(type => {
        const appearance = manager.resolveWallAppearance({ type });
        expect(appearance?.tint || null).toBeNull();
      });
    });

    it('all registered wall GLB models exist in public/ directory', () => {
      Object.values(WALL_MODELS).forEach(url => {
        const localRel = url.replace(/^\//, '');
        const fullPath = path.resolve('public', localRel);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });
  });

  describe('ThreeDPropManager Doors and Gates Resolution', () => {
    let scene;
    let propManager;
    const gridState = { gridSize: 50, gridOffsetX: 0, gridOffsetY: 0 };

    beforeEach(() => {
      scene = new THREE.Scene();
      propManager = new ThreeDPropManager(scene);
    });

    afterEach(() => {
      propManager.dispose();
    });

    it('resolves dedicated models for modular doors and interactive gates', () => {
      const wallData = {
        '0,0,1,0': { type: 'town_door', state: 'closed' },
        '1,0,2,0': { type: 'wooden_door', state: 'open' },
        '2,0,3,0': { type: 'iron_gate', state: 'closed' },
        '3,0,4,0': { type: 'wooden_gate', state: 'closed' },
        '4,0,5,0': { type: 'hedge_gate', state: 'closed' }
      };

      propManager.updateWallDoors(wallData, gridState, {});

      expect(propManager.wallDoorInstances.size).toBe(5);

      const townDoorEntry = propManager.wallDoorInstances.get('0,0,1,0');
      expect(townDoorEntry.doorwayUrl).toBe('/assets/models/walls/town_wall_door.glb');
      expect(townDoorEntry.modelLength).toBe(1);

      const woodenDoorEntry = propManager.wallDoorInstances.get('1,0,2,0');
      expect(woodenDoorEntry.doorwayUrl).toBe('/assets/models/walls/wooden_wall_door.glb');
      expect(woodenDoorEntry.modelLength).toBe(1);

      const ironGateEntry = propManager.wallDoorInstances.get('2,0,3,0');
      expect(ironGateEntry.doorwayUrl).toBe('/assets/models/walls/metal_wall_gate.glb');
      expect(ironGateEntry.modelLength).toBe(1);

      const woodenGateEntry = propManager.wallDoorInstances.get('3,0,4,0');
      expect(woodenGateEntry.doorwayUrl).toBe('/assets/models/walls/wooden_fence_gate.glb');
      expect(woodenGateEntry.modelLength).toBe(1);

      const hedgeGateEntry = propManager.wallDoorInstances.get('4,0,5,0');
      expect(hedgeGateEntry.doorwayUrl).toBe('/assets/models/walls/hedge_gate.glb');
      expect(hedgeGateEntry.modelLength).toBe(1);
    });

    it('all door and gate models exist in public/ directory', () => {
      const doorModelUrls = [
        '/assets/models/walls/town_wall_door.glb',
        '/assets/models/walls/wooden_wall_door.glb',
        '/assets/models/walls/metal_wall_gate.glb',
        '/assets/models/walls/wooden_fence_gate.glb',
        '/assets/models/walls/hedge_gate.glb',
        '/assets/models/dungeon/wall_doorway.glb'
      ];

      doorModelUrls.forEach(url => {
        const localRel = url.replace(/^\//, '');
        const fullPath = path.resolve('public', localRel);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });
  });
});
