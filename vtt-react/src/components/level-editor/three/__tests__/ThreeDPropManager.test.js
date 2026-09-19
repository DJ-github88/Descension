import * as THREE from 'three';
import { ThreeDPropManager } from '../ThreeDPropManager';

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

const GRID = { gridSize: 50, gridOffsetX: 0, gridOffsetY: 0 };

const light = (overrides = {}) => ({
  id: 'light1',
  type: 'torch',
  x: 0,
  y: 0,
  radius: 4,
  color: '#ff6b35',
  intensity: 1,
  enabled: true,
  ...overrides
});

describe('ThreeDPropManager light fixtures', () => {
  let scene;
  let manager;

  beforeEach(() => {
    scene = new THREE.Scene();
    manager = new ThreeDPropManager(scene);
  });

  afterEach(() => {
    manager.dispose();
  });

  it('places a 3D fixture per enabled light source at its tile centre', () => {
    manager.updateLightProps({ light1: light({ x: 2, y: 3 }) }, GRID, {});

    const entry = manager.lightPropInstances.get('light1');
    expect(entry).toBeDefined();
    expect(entry.mesh.position.x).toBeCloseTo(125);
    expect(entry.mesh.position.y).toBeCloseTo(-175);
  });

  it('uses the mapped fixture models and skips unknown/disabled lights', () => {
    manager.updateLightProps({
      a: light({ id: 'a', type: 'torch' }),
      b: light({ id: 'b', type: 'lantern' }),
      c: light({ id: 'c', type: 'sunlight' }),
      d: light({ id: 'd', type: 'torch', enabled: false }),
      e: light({ id: 'e', type: 'not-a-light' })
    }, GRID, {});

    expect([...manager.lightPropInstances.keys()].sort()).toEqual(['a', 'b']);
    expect(manager.lightPropInstances.get('a').modelUrl).toContain('torch_standing.glb');
    expect(manager.lightPropInstances.get('b').modelUrl).toContain('candelabra.glb');
  });

  it('raises fixtures to the tile elevation', () => {
    manager.updateLightProps({ light1: light({ x: 1, y: 1 }) }, GRID, {}, { '1,1': 2 });

    // Elevation levels are half a grid cell tall in the 3D world.
    expect(manager.lightPropInstances.get('light1').mesh.position.z).toBeCloseTo(50);
  });

  it('removes fixtures when their light is deleted', () => {
    manager.updateLightProps({ light1: light() }, GRID, {});
    expect(manager.lightPropInstances.size).toBe(1);

    manager.updateLightProps({}, GRID, {});
    expect(manager.lightPropInstances.size).toBe(0);
  });

  it('dims fixtures outside active vision under fog of war', () => {
    manager.updateLightProps({ light1: light() }, GRID, {
      fogOfWarEnabled: true,
      isEditorMode: false,
      isGMMode: false,
      viewingFromToken: true,
      isPlayerPositionExplored: () => true,
      visibleAreaSet: new Set()
    });

    const entry = manager.lightPropInstances.get('light1');
    let opacity = 1;
    entry.innerModel.traverse(child => {
      if (child.isMesh) opacity = child.material.opacity;
    });
    expect(opacity).toBeCloseTo(0.45, 1);
  });
});

describe('ThreeDPropManager fog visibility', () => {
  let scene;
  let manager;

  const fogState = (overrides = {}) => ({
    fogOfWarEnabled: true,
    isEditorMode: false,
    isGMMode: false,
    viewingFromToken: true,
    isPlayerPositionExplored: (x) => x < 500,
    visibleAreaSet: new Set(),
    ...overrides
  });

  const propOpacity = (entry) => {
    let opacity = 1;
    entry.innerModel.traverse(child => {
      if (child.isMesh) opacity = child.material.opacity;
    });
    return opacity;
  };

  beforeEach(() => {
    scene = new THREE.Scene();
    manager = new ThreeDPropManager(scene);
  });

  afterEach(() => {
    manager.dispose();
  });

  it('keeps a corner-anchored object visible when the explored side faces the viewer', () => {
    // Free-positioned anchor sits exactly on the x=500 tile boundary; the
    // western tile is explored, the eastern one is not.
    manager.updateObjects(
      [{ id: 'table1', type: 'table_medium', freePosition: true, worldX: 500, worldY: 250 }],
      GRID,
      fogState()
    );

    const entry = manager.propInstances.get('table1');
    expect(entry).toBeDefined();
    expect(entry.mesh.visible).toBe(true);
    expect(propOpacity(entry)).toBeCloseTo(0.45);
  });

  it('hides an object when none of its probes are explored', () => {
    manager.updateObjects(
      [{ id: 'table1', type: 'table_medium', freePosition: true, worldX: 500, worldY: 250 }],
      GRID,
      fogState({ isPlayerPositionExplored: () => false })
    );

    expect(manager.propInstances.get('table1').mesh.visible).toBe(false);
  });

  it('lights an object fully when any probe is in active vision', () => {
    manager.updateObjects(
      [{ id: 'table1', type: 'table_medium', freePosition: true, worldX: 500, worldY: 250 }],
      GRID,
      fogState({ visibleAreaSet: new Set(['9,4', '9,5']) })
    );

    const entry = manager.propInstances.get('table1');
    expect(entry.mesh.visible).toBe(true);
    expect(propOpacity(entry)).toBeCloseTo(1);
  });

  it('keeps a boundary-sitting wall door visible from its explored side', () => {
    manager.updateWallDoors(
      { '10,3,10,4': { type: 'wooden_door', state: 'closed' } },
      GRID,
      fogState()
    );

    const entry = manager.wallDoorInstances.get('10,3,10,4');
    expect(entry).toBeDefined();
    expect(entry.mesh.visible).toBe(true);
  });
});

describe('ThreeDPropManager world bounds', () => {
  let scene;
  let manager;

  beforeEach(() => {
    scene = new THREE.Scene();
    manager = new ThreeDPropManager(scene);
  });

  afterEach(() => {
    manager.dispose();
  });

  it('returns 8 VTT-space corners that track position, scale and yaw', () => {
    manager.updateObjects([{ id: 'table1', type: 'table_long', worldX: 100, worldY: 200 }], GRID, {});

    const entry = manager.propInstances.get('table1');
    expect(entry).toBeDefined();

    // Mock model is a 4x4x1 box rotated +90deg around X => 4 x 1 x 4 in
    // wrapper space, scaled down so its largest footprint fills one tile
    // (unitScale = 50 / 4, table_long has registry scale 1.0).
    const corners = manager.getWorldBoundsCorners('table1');
    expect(corners).toHaveLength(8);

    const xs = corners.map(c => c.x);
    const ys = corners.map(c => c.y);
    const zs = corners.map(c => c.z);

    // y is flipped into VTT space: worldY 200 -> -200 in Three.js.
    expect(Math.min(...xs)).toBeCloseTo(100 - 25);
    expect(Math.max(...xs)).toBeCloseTo(100 + 25);
    expect(Math.min(...ys)).toBeCloseTo(200 - 6.25);
    expect(Math.max(...ys)).toBeCloseTo(200 + 6.25);
    expect(Math.min(...zs)).toBeCloseTo(-25);
    expect(Math.max(...zs)).toBeCloseTo(25);

    // Resizing scales the derived bounds.
    manager.updateObjects([{ id: 'table1', type: 'table_long', worldX: 100, worldY: 200, scale: 2 }], GRID, {});
    const scaled = manager.getWorldBoundsCorners('table1');
    const scaledXs = scaled.map(c => c.x);
    expect(Math.max(...scaledXs)).toBeCloseTo(100 + 50);

    // Yaw rotates the footprint around the anchor.
    manager.updateObjects([{ id: 'table1', type: 'table_long', worldX: 100, worldY: 200, rotation: 90 }], GRID, {});
    const rotated = manager.getWorldBoundsCorners('table1');
    const rotXs = rotated.map(c => c.x);
    const rotYs = rotated.map(c => c.y);
    expect(Math.max(...rotXs)).toBeCloseTo(100 + 6.25);
    expect(Math.max(...rotYs)).toBeCloseTo(200 + 25);
  });

  it('returns null for objects without an instantiated model', () => {
    expect(manager.getWorldBoundsCorners('missing')).toBeNull();
  });

  it('applies pitch and roll to the placed prop', () => {
    manager.updateObjects([
      { id: 'table1', type: 'table_long', worldX: 100, worldY: 200, rotation: 90, rotationX: 30, rotationY: -15 }
    ], GRID, {});

    const entry = manager.propInstances.get('table1');
    expect(entry.mesh.rotation.x).toBeCloseTo((30 * Math.PI) / 180);
    expect(entry.mesh.rotation.y).toBeCloseTo((-15 * Math.PI) / 180);
    expect(entry.mesh.rotation.z).toBeCloseTo((-90 * Math.PI) / 180);
    // Euler order 'XYZ' keeps yaw applied first so tilts lean on fixed axes.
    expect(entry.mesh.rotation.order).toBe('XYZ');
  });

  it('rests a stacked child on the parent rendered top surface, not the elevation level', () => {
    manager.updateObjects([
      { id: 'table1', type: 'table_long', worldX: 100, worldY: 200 },
      { id: 'stool1', type: 'stool', worldX: 100, worldY: 200, parentObjectId: 'table1', elevation: 2 }
    ], GRID, {});

    const table = manager.propInstances.get('table1');
    const stool = manager.propInstances.get('stool1');
    const parentTop = table.mesh.position.z + table.baseBox.max.z * table.innerModel.scale.x;

    expect(stool.mesh.position.z).toBeCloseTo(parentTop);
    // elevation 2 would have been 2 * gridSize * 0.5 = 50 - stacking overrides it
    expect(stool.mesh.position.z).not.toBeCloseTo(50);
  });

  it('falls back to the elevation level when the parent has no model yet', () => {
    manager.updateObjects(
      [{ id: 'stool1', type: 'stool', worldX: 100, worldY: 200, parentObjectId: 'missing', elevation: 2 }],
      GRID,
      {}
    );

    expect(manager.propInstances.get('stool1').mesh.position.z).toBeCloseTo(50);
  });

  it('raises a wall-attached fixture when its host wall elevation changes', () => {
    const torch = {
      id: 'torch1',
      type: 'torch_wall',
      worldX: 25,
      worldY: 4.75,
      wallAttached: true,
      wallKey: '0,0,1,0',
      wallElevation: 0,
      elevation: 1.2
    };

    manager.updateObjects([torch], GRID, {}, { '0,0,1,0': { type: 'stone_wall', elevation: 0 } });
    // Mount offset 1.2 levels above the wall base (0) -> 1.2 * 25.
    expect(manager.propInstances.get('torch1').mesh.position.z).toBeCloseTo(30);

    manager.updateObjects([torch], GRID, {}, { '0,0,1,0': { type: 'stone_wall', elevation: 2 } });
    // Wall moved up two levels, fixture keeps its 1.2-level mount offset.
    expect(manager.propInstances.get('torch1').mesh.position.z).toBeCloseTo(80);
  });

  it('automatically places objects atop elevated terrain when obj.elevation is not set', () => {
    // Tile (2, 4) corresponds to worldX: 100, worldY: 200 for gridSize: 50
    const elevationData = { '2,4': 3 };
    manager.updateObjects(
      [{ id: 'chest1', type: 'chest', worldX: 125, worldY: 225 }],
      GRID,
      {},
      {},
      elevationData
    );

    const chest = manager.propInstances.get('chest1');
    // Elevation 3 * (50 * 0.5) = 75
    expect(chest.mesh.position.z).toBeCloseTo(75);
  });
});
