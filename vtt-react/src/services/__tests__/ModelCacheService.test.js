import * as THREE from 'three';
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
  let ensureLitMaterials;

  beforeEach(() => {
    const service = require('../ModelCacheService');
    modelCache = service.default;
    ensureLitMaterials = service.ensureLitMaterials;
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

  it('upgrades unlit glTF materials so the sun and shadows apply to them', () => {
    const map = new THREE.Texture();
    const basic = new THREE.MeshBasicMaterial({
      color: 0xff8844,
      map,
      opacity: 0.6,
      transparent: true,
      side: THREE.DoubleSide
    });
    basic.name = 'wood';

    const lit = ensureLitMaterials(basic);

    expect(lit).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(lit).not.toBe(basic);
    expect(lit.name).toBe('wood');
    expect(lit.color.getHex()).toBe(0xff8844);
    expect(lit.map).toBe(map);
    expect(lit.opacity).toBe(0.6);
    expect(lit.transparent).toBe(true);
    expect(lit.side).toBe(THREE.DoubleSide);
    expect(lit.roughness).toBe(0.8);
    expect(lit.metalness).toBe(0.1);
  });

  it('leaves already lit materials untouched', () => {
    const standard = new THREE.MeshStandardMaterial({ color: 0x123456 });
    expect(ensureLitMaterials(standard)).toBe(standard);
  });

  it('creates lit instances from unlit cached models', () => {
    const { clone } = require('three/examples/jsm/utils/SkeletonUtils');
    clone.mockImplementation((scene) => scene);

    const basic = new THREE.MeshBasicMaterial({ color: 0xff8844 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), basic);
    const scene = new THREE.Group();
    scene.add(mesh);
    modelCache.loadedModels.set('/fake/unlit.glb', { scene, animations: [] });

    const instance = modelCache.createInstance('/fake/unlit.glb');

    const clonedMesh = instance.children[0];
    expect(clonedMesh.material).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(clonedMesh.material.color.getHex()).toBe(0xff8844);
  });

  it('upgrades every entry of a material array', () => {
    const basicA = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const standardB = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    const [litA, litB] = ensureLitMaterials([basicA, standardB]);

    expect(litA).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(litA.color.getHex()).toBe(0xff0000);
    expect(litB).toBe(standardB);
  });
});
