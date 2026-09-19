import { MODEL_REGISTRY } from '../../components/level-editor/three/ThreeDPropManager';
import { TERRAIN_MODEL_REGISTRY } from '../../components/level-editor/three/ThreeDTerrainManager';

jest.mock('three/examples/jsm/loaders/GLTFLoader', () => ({
  GLTFLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn()
  }))
}));

jest.mock('three/examples/jsm/utils/SkeletonUtils', () => ({
  clone: jest.fn((scene) => ({ ...scene, isClone: true }))
}));

describe('3D Models & Cache Service', () => {
  let modelCache;

  beforeEach(() => {
    modelCache = require('../ModelCacheService').default;
  });

  it('has valid model registries for props and terrain', () => {
    expect(MODEL_REGISTRY.chest).toBeDefined();
    expect(MODEL_REGISTRY.chest.url).toContain('chest.glb');
    expect(MODEL_REGISTRY.chest.interactive).toBe(true);

    expect(MODEL_REGISTRY.wall_doorway).toBeDefined();
    expect(MODEL_REGISTRY.wall_doorway.interactive).toBe(true);

    // Modular walls
    expect(MODEL_REGISTRY.wall_stone_straight).toBeDefined();
    expect(MODEL_REGISTRY.wall_corner).toBeDefined();
    expect(MODEL_REGISTRY.wall_tsplit).toBeDefined();
    expect(MODEL_REGISTRY.wall_crossing).toBeDefined();
    expect(MODEL_REGISTRY.wall_window_open).toBeDefined();
    expect(MODEL_REGISTRY.wall_window_gated).toBeDefined();
    expect(MODEL_REGISTRY.barrier_wood).toBeDefined();

    // Furniture & Props
    expect(MODEL_REGISTRY.table_long).toBeDefined();
    expect(MODEL_REGISTRY.table_feast).toBeDefined();
    expect(MODEL_REGISTRY.chair).toBeDefined();
    expect(MODEL_REGISTRY.bed_decorated).toBeDefined();
    expect(MODEL_REGISTRY.bookshelf_large).toBeDefined();
    expect(MODEL_REGISTRY.chest_gold).toBeDefined();
    expect(MODEL_REGISTRY.chest_gold.interactive).toBe(true);
    expect(MODEL_REGISTRY.trunk_large).toBeDefined();
    expect(MODEL_REGISTRY.trunk_large.interactive).toBe(true);
    expect(MODEL_REGISTRY.treasure_coins).toBeDefined();
    expect(MODEL_REGISTRY.torch_wall).toBeDefined();
    expect(MODEL_REGISTRY.candelabra).toBeDefined();

    expect(MODEL_REGISTRY.tree_pine).toBeDefined();
    expect(MODEL_REGISTRY.tree_pine.url).toContain('tree_pine.glb');

    expect(TERRAIN_MODEL_REGISTRY.stone_floor).toBeDefined();
    expect(TERRAIN_MODEL_REGISTRY.stone_floor.url).toContain('floor_stone.glb');

    expect(TERRAIN_MODEL_REGISTRY.stairs).toBeDefined();
    expect(TERRAIN_MODEL_REGISTRY.stairs.url).toContain('stairs_stone.glb');
  });

  it('provides subscriber notifications on model load', () => {
    let notified = false;
    const unsub = modelCache.subscribe(() => {
      notified = true;
    });

    modelCache.notify();
    expect(notified).toBe(true);
    unsub();
  });

  it('safely handles missing model instances', () => {
    const instance = modelCache.createInstance('/non/existent/path.glb');
    expect(instance).toBeNull();
  });
});
