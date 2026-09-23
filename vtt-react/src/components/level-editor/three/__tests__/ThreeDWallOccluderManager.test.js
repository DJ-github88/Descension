import * as THREE from 'three';
import { ThreeDWallOccluderManager } from '../ThreeDWallOccluderManager';

describe('ThreeDWallOccluderManager', () => {
  let scene;
  let manager;

  beforeEach(() => {
    scene = new THREE.Scene();
    manager = new ThreeDWallOccluderManager(scene);
  });

  afterEach(() => {
    manager.dispose();
  });

  it('initializes with invisible depth occluder material and renderOrder -1', () => {
    expect(manager.instancedMesh).toBeDefined();
    expect(manager.instancedMesh.renderOrder).toBe(-1);
    expect(manager.instancedMesh.material.colorWrite).toBe(false);
    expect(manager.instancedMesh.material.depthWrite).toBe(true);
  });

  it('updates wall instances and generates occluders for solid walls, windows, and closed doors while skipping open doors', () => {
    const wallData = {
      '0,0,1,0': { type: 'stone_wall', state: 'default' },
      '1,0,2,0': { type: 'wooden_door', state: 'open' },
      '2,0,3,0': { type: 'glass_window', state: 'default' },
      '0,1,1,1': { type: 'brick_wall', state: 'default' }
    };

    manager.updateWalls(wallData, {}, { gridSize: 50, gridOffsetX: 0, gridOffsetY: 0 });

    // Open door is skipped; 2 solid walls + 1 window wall should be occluders
    expect(manager.instancedMesh.count).toBe(3);
  });

  it('handles empty wallData gracefully', () => {
    manager.updateWalls({}, {}, { gridSize: 50, gridOffsetX: 0, gridOffsetY: 0 });
    expect(manager.instancedMesh.count).toBe(0);
  });

  it('includes closed doors and windows as occluders and sets proper scale/thickness/extension', () => {
    const wallData = {
      '0,0,1,0': { type: 'wooden_door', state: 'closed' },
      '2,0,3,0': { type: 'glass_window', state: 'default' }
    };

    manager.updateWalls(wallData, {}, { gridSize: 50, gridOffsetX: 0, gridOffsetY: 0 });
    expect(manager.instancedMesh.count).toBe(2);

    const matrix = new THREE.Matrix4();
    manager.instancedMesh.getMatrixAt(0, matrix);
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    matrix.decompose(position, quaternion, scale);

    // Wall length is 50, thickness is max(6, 50*0.15) = 7.5.
    // Length is extended by thickness for seamless corner joins: 50 + 7.5 = 57.5.
    expect(scale.x).toBeCloseTo(57.5);
    expect(scale.y).toBeCloseTo(7.5);
    // Closed door and window masonry wraps to full wall height (1.8 * 50 = 90)
    expect(scale.z).toBeCloseTo(90);
  });

  it('samples multi-elevation terrain data for retaining walls', () => {
    const wallData = {
      '0,0,1,0': { type: 'stone_wall', state: 'default' }
    };
    const elevationData = {
      '0,-1': 2 // Adjacent higher tile
    };

    manager.updateWalls(wallData, elevationData, { gridSize: 50, gridOffsetX: 0, gridOffsetY: 0 });
    expect(manager.instancedMesh.count).toBe(1);

    const matrix = new THREE.Matrix4();
    manager.instancedMesh.getMatrixAt(0, matrix);
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    matrix.decompose(position, quaternion, scale);

    // Base elevation is 2 * 50 = 100. Height is 1.8 * 50 = 90.
    // Box center Z is baseZ + height / 2 = 100 + 45 = 145.
    expect(position.z).toBeCloseTo(145);
  });
});
