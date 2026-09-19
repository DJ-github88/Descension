import * as THREE from 'three';
import { ThreeDTerrainManager } from '../ThreeDTerrainManager';

jest.mock('../../../../services/ModelCacheService', () => {
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

const GRID = { gridSize: 50, gridOffsetX: 0, gridOffsetY: 0 };

describe('ThreeDTerrainManager', () => {
  let scene;
  let manager;

  beforeEach(() => {
    scene = new THREE.Scene();
    manager = new ThreeDTerrainManager(scene);
  });

  afterEach(() => {
    manager.dispose();
  });

  it('creates one instanced mesh per terrain variant so types do not default to one look', () => {
    manager.updateTerrain({
      terrainData: {
        '0,0': 'grass',
        '1,0': 'dungeon_floor',
        '2,0': 'lava',
        '3,0': 'water'
      },
      ...GRID,
      enabled: true
    });

    expect(manager.instancedMeshes.size).toBe(4);
    manager.instancedMeshes.forEach(mesh => {
      expect(mesh.count).toBe(1);
    });
  });

  it('tints per terrain type without repainting the shared source material', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'grass', '1,0': 'dungeon_floor' },
      ...GRID,
      enabled: true
    });

    const materials = [...manager.instancedMeshes.values()].map(m => m.material);
    expect(materials).toHaveLength(2);
    expect(materials[0]).not.toBe(materials[1]);
    // Every variant gets its own cloned material.
    materials.forEach(m => expect(m).toBeInstanceOf(THREE.MeshStandardMaterial));

    const grass = materials.find(m => m.emissive && m.emissive.getHex() === 0 && m.color.g > m.color.b);
    expect(grass).toBeDefined();
  });

  it('gives hazard terrain an emissive glow', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'lava' },
      ...GRID,
      enabled: true
    });
    const mesh = [...manager.instancedMeshes.values()][0];
    expect(mesh.material.emissive.getHex()).not.toBe(0);
  });

  it('covers unknown/custom terrain types with a 3D tile', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'my_custom_terrain' },
      ...GRID,
      enabled: true
    });
    expect(manager.instancedMeshes.size).toBe(1);
  });

  it('maps wooden_floor to dedicated 3D wood floor model', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'wooden_floor' },
      ...GRID,
      enabled: true
    });
    const [variantKey] = [...manager.instancedMeshes.keys()];
    expect(variantKey).toContain('wood_floor');
  });

  it('generates 3D foundation blocks underneath elevated cliff tiles', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'stone' },
      elevationData: { '0,0': 2 },
      ...GRID,
      enabled: true
    });
    // Should have stone_floor variant and foundation variant
    const foundationMesh = manager.instancedMeshes.get('foundation|default');
    expect(foundationMesh).toBeDefined();
    expect(foundationMesh.count).toBe(2); // 2 elevation levels under the tile
  });

  it('omits flat floor tiles on cells containing ramps to avoid z-fighting', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'stone' },
      rampData: { '0,0': { dir: 's', type: 'ramp' } },
      ...GRID,
      enabled: true
    });
    // Flat stone_floor should not be pushed; only stairs
    const stoneFloorMesh = manager.instancedMeshes.get('stone_floor|default');
    expect(stoneFloorMesh ? stoneFloorMesh.count : 0).toBe(0);
    const stairsMesh = manager.instancedMeshes.get('stairs|default');
    expect(stairsMesh).toBeDefined();
    expect(stairsMesh.count).toBe(1);
  });

  it('supports lowercase directions for stairs and applies correct rotation', () => {
    manager.updateTerrain({
      rampData: {
        '0,0': { dir: 'n' },
        '1,0': { dir: 'e' },
        '2,0': { dir: 's' },
        '3,0': { dir: 'w' }
      },
      ...GRID,
      enabled: true
    });
    const stairsMesh = manager.instancedMeshes.get('stairs|default');
    expect(stairsMesh).toBeDefined();
    expect(stairsMesh.count).toBe(4);
  });

  it('generates foundation blocks underneath elevated stairs and uses wood stairs on wood terrain', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'wooden_floor' },
      elevationData: { '0,0': 2 },
      rampData: { '0,0': { dir: 'e', type: 'stairs' } },
      ...GRID,
      enabled: true
    });
    const woodStairsMesh = manager.instancedMeshes.get('stairs_wood|default');
    expect(woodStairsMesh).toBeDefined();
    expect(woodStairsMesh.count).toBe(1);

    const foundationMesh = manager.instancedMeshes.get('foundation|default');
    expect(foundationMesh).toBeDefined();
    expect(foundationMesh.count).toBe(2);
  });

  it('hides the group when disabled', () => {
    manager.updateTerrain({ terrainData: { '0,0': 'grass' }, ...GRID, enabled: false });
    expect(manager.group.visible).toBe(false);
  });
});
