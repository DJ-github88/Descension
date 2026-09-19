import { getObjectScreenBounds, getObjectSelectionHandles } from '../ObjectSelectionBounds';
import { setPropWorldBoundsResolver, clearPropWorldBoundsResolver } from '../../components/level-editor/three/propWorldBounds';

jest.mock('../InfiniteGridSystem', () => ({
  getGridSystem: () => ({
    getViewportDimensions: () => ({ width: 1000, height: 800 }),
    // Linear stand-in projection: screen = world + viewport centre - height.
    worldToScreen3D: (x, y, z) => ({ x: x + 500, y: y + 400 - z })
  })
}));

const prop = (overrides = {}) => ({
  id: 'prop-1',
  type: 'table_long',
  worldX: 100,
  worldY: 50,
  scale: 1,
  rotation: 0,
  ...overrides
});

const PROP_DEF = { size: { width: 2, height: 1 }, is3D: true };
const SPRITE_DEF = { size: { width: 2, height: 2 } };

describe('getObjectScreenBounds', () => {
  afterEach(() => clearPropWorldBoundsResolver({}));

  it('falls back to the rotated tile footprint when no 3D resolver is registered', () => {
    const bounds = getObjectScreenBounds(prop(), PROP_DEF, { x: 500, y: 400 }, {
      gridSize: 50,
      effectiveZoom: 1,
      rotationRad: Math.PI / 2
    });

    expect(bounds.tight3D).toBe(false);
    expect(bounds.width).toBe(100);
    expect(bounds.height).toBe(50);
    expect(bounds.rotation).toBeCloseTo(Math.PI / 2);
  });

  it('projects the 3D model corners into a tight axis-aligned box', () => {
    const owner = {};
    setPropWorldBoundsResolver(owner, () => ([
      { x: 80, y: 20, z: 0 },
      { x: 120, y: 20, z: 0 },
      { x: 80, y: 80, z: 0 },
      { x: 120, y: 80, z: 0 },
      { x: 80, y: 20, z: 30 },
      { x: 120, y: 20, z: 30 },
      { x: 80, y: 80, z: 30 },
      { x: 120, y: 80, z: 30 }
    ]));

    const bounds = getObjectScreenBounds(prop(), PROP_DEF, { x: 500, y: 400 }, {
      gridSize: 50,
      effectiveZoom: 1
    });

    expect(bounds.tight3D).toBe(true);
    expect(bounds.centerX).toBe(600);
    expect(bounds.centerY).toBe(435);
    expect(bounds.width).toBe(40);
    expect(bounds.height).toBe(90);
    expect(bounds.rotation).toBe(0);
    clearPropWorldBoundsResolver(owner);
  });

  it('ignores 3D bounds for sprite objects', () => {
    const owner = {};
    setPropWorldBoundsResolver(owner, () => [{ x: 0, y: 0, z: 0 }]);

    const bounds = getObjectScreenBounds(prop(), SPRITE_DEF, { x: 500, y: 400 }, {
      gridSize: 50,
      effectiveZoom: 2
    });

    expect(bounds.tight3D).toBe(false);
    expect(bounds.width).toBe(200);
    clearPropWorldBoundsResolver(owner);
  });
});

describe('getObjectSelectionHandles', () => {
  it('places delete above and rotate right of an unrotated box', () => {
    const handles = getObjectSelectionHandles({
      centerX: 100,
      centerY: 200,
      width: 40,
      height: 20,
      rotation: 0
    });

    expect(handles.deletePosition).toEqual({ x: 100, y: 200 - 38 });
    expect(handles.rotatePosition).toEqual({ x: 100 + 48, y: 200 });
  });

  it('rotates handle positions with the box', () => {
    const handles = getObjectSelectionHandles({
      centerX: 100,
      centerY: 200,
      width: 40,
      height: 40,
      rotation: Math.PI / 2
    });

    expect(handles.deletePosition.x).toBeCloseTo(100 + 48);
    expect(handles.deletePosition.y).toBeCloseTo(200);
    expect(handles.rotatePosition.x).toBeCloseTo(100);
    expect(handles.rotatePosition.y).toBeCloseTo(200 + 48);
  });

  it('keeps the delete/rotate buttons a minimum distance from small props', () => {
    const handles = getObjectSelectionHandles({
      centerX: 0,
      centerY: 0,
      width: 8,
      height: 8,
      rotation: 0
    });

    expect(handles.delOffset).toBe(36);
    expect(handles.rotOffset).toBe(36);
  });
});
