import * as THREE from 'three';
import { ThreeDGhostPreviewManager } from '../ThreeDGhostPreviewManager';

jest.mock('../../../../services/ModelCacheService', () => {
  const three = require('three');
  return {
    __esModule: true,
    default: {
      createInstance: () => {
        const group = new three.Group();
        const mesh = new three.Mesh(new three.BoxGeometry(4, 4, 1), new three.MeshStandardMaterial());
        group.add(mesh);
        return group;
      },
      loadModel: () => Promise.resolve({}),
      subscribe: () => () => {}
    }
  };
});

describe('ThreeDGhostPreviewManager', () => {
  let scene;
  let manager;

  beforeEach(() => {
    scene = new THREE.Scene();
    manager = new ThreeDGhostPreviewManager(scene);
  });

  afterEach(() => {
    manager.dispose();
  });

  const payload = {
    active: true,
    objectType: 'table_long',
    worldX: 100,
    worldY: 100,
    rotation: 0,
    scale: 1,
    gridSize: 50
  };

  it('keeps a stable scale across repeated frames', () => {
    manager.updatePreview(payload);
    const firstScale = manager.currentModelScene.scale.x;
    manager.updatePreview(payload);
    const secondScale = manager.currentModelScene.scale.x;

    expect(firstScale).toBeCloseTo(50 / 4);
    expect(secondScale).toBeCloseTo(firstScale);
  });

  it('hides the ghost when placement is inactive or the type is unknown', () => {
    manager.updatePreview(payload);
    expect(manager.group.visible).toBe(true);

    manager.updatePreview({ ...payload, active: false });
    expect(manager.group.visible).toBe(false);

    manager.updatePreview({ ...payload, objectType: 'not-a-prop' });
    expect(manager.group.visible).toBe(false);
  });

  it('hovers a stacked ghost at the parent rendered top surface', () => {
    const propManager = {
      getWorldBoundsCorners: jest.fn(() => {
        const corners = [];
        for (const x of [0, 1]) {
          for (const y of [0, 1]) {
            for (const z of [0, 12.5]) {
              corners.push({ x, y, z });
            }
          }
        }
        return corners;
      })
    };
    const parent = { id: 'table1', type: 'table_long', worldX: 100, worldY: 100, elevation: 0 };

    manager.updatePreview({
      ...payload,
      objectType: 'stool',
      environmentalObjects: [parent],
      propManager
    });

    expect(propManager.getWorldBoundsCorners).toHaveBeenCalledWith('table1');
    expect(manager.group.position.z).toBeCloseTo(12.5);
  });

  it('applies yaw, pitch and roll to the ghost', () => {
    manager.updatePreview({ ...payload, rotation: 90, rotationX: 30, rotationY: -15 });

    expect(manager.group.rotation.z).toBeCloseTo((-90 * Math.PI) / 180);
    expect(manager.group.rotation.x).toBeCloseTo((30 * Math.PI) / 180);
    expect(manager.group.rotation.y).toBeCloseTo((-15 * Math.PI) / 180);
  });

  it('snaps to a wall mount when one is resolved', () => {
    manager.updatePreview({
      ...payload,
      objectType: 'torch_wall',
      wallMount: {
        worldX: 25,
        worldY: 4.75,
        rotation: 180,
        elevation: 2.2
      }
    });

    expect(manager.group.position.x).toBeCloseTo(25);
    expect(manager.group.position.y).toBeCloseTo(-4.75);
    expect(manager.group.position.z).toBeCloseTo(2.2 * 25);
    expect(manager.group.rotation.z).toBeCloseTo((-180 * Math.PI) / 180);
  });
});
