import {
  WALL_BASE_SINK_WORLD,
  buildWallRenderItem,
  collectWallNodes,
  computeWallFootprint,
  nodeConnectedSolidCount,
  getWallBaseWorldZ,
  getWallHeightWorld,
  getWallThickness,
  getWallWorldEndpoints,
  parseWallKey,
  wallJoinExtension,
  wallPatternDescriptor
} from '../WallGeometry';
import { getProjectionTransform } from '../ProjectionSystem';

const makeGridSystem = (overrides = {}) => {
  const state = {
    gridSize: 50,
    gridType: 'square',
    gridOffsetX: 0,
    gridOffsetY: 0,
    viewMode: '2.5d',
    viewRotation: 0,
    viewTilt: 30,
    effectiveZoom: 1,
    cameraX: 0,
    cameraY: 0,
    ...overrides
  };

  return {
    getGridState: () => state,
    gridToWorldCorner: (x, y) => ({
      x: x * state.gridSize + state.gridOffsetX,
      y: y * state.gridSize + state.gridOffsetY
    }),
    worldToGrid: (x, y) => ({
      x: Math.floor((x - state.gridOffsetX) / state.gridSize),
      y: Math.floor((y - state.gridOffsetY) / state.gridSize)
    }),
    getProjectionTransform: (width = 0, height = 0) =>
      getProjectionTransform({ ...state, viewportWidth: width, viewportHeight: height }),
    depthKey: (x, y) => {
      const t = getProjectionTransform(state);
      return -((x - t.cameraX) * t.sinYaw) + (y - t.cameraY) * t.cosYaw;
    }
  };
};

const buildTransform = (overrides = {}) =>
  getProjectionTransform({
    viewMode: '2.5d',
    viewRotation: 0,
    viewTilt: 30,
    effectiveZoom: 1,
    cameraX: 0,
    cameraY: 0,
    viewportWidth: 0,
    viewportHeight: 0,
    ...overrides
  });

const WALL = { type: 'stone_wall' };
const STONE = { color: '#8B7355', blocksMovement: true, blocksLineOfSight: true };

describe('WallGeometry', () => {
  it('parses wall keys strictly', () => {
    expect(parseWallKey('0,0,1,0')).toEqual({ x1: 0, y1: 0, x2: 1, y2: 0 });
    expect(parseWallKey('junk')).toBeNull();
    expect(parseWallKey('0,0,1')).toBeNull();
  });

  it('derives height from type defaults and per-wall override', () => {
    const gridSize = 50;
    expect(getWallHeightWorld(WALL, STONE, gridSize)).toBe(90);
    expect(getWallHeightWorld({ ...WALL, height: 140 }, STONE, gridSize)).toBe(140);
    expect(getWallHeightWorld({}, { interactive: true }, gridSize)).toBe(62.5);
    expect(getWallHeightWorld({}, { isWindow: true }, gridSize)).toBe(80);
  });

  it('anchors wall bases to the highest adjacent terrain level', () => {
    const gridSystem = makeGridSystem();
    const base = getWallBaseWorldZ({
      parsed: parseWallKey('0,0,2,0'),
      wall: WALL,
      gridType: 'square',
      gridSystem,
      elevationData: { '0,0': 2, '0,-1': 0, '1,0': 2, '2,0': 2 }
    });
    expect(base.start).toBe(100);
    expect(base.end).toBe(100);
    expect(base.z).toBe(100);
    expect(base.lowStart).toBe(0);
    expect(base.lowEnd).toBe(0);

    const stepped = getWallBaseWorldZ({
      parsed: parseWallKey('0,0,2,0'),
      wall: WALL,
      gridType: 'square',
      gridSystem,
      elevationData: { '0,0': 2, '0,-1': 0, '2,0': 0, '2,-1': 0 }
    });
    expect(stepped.start).toBe(100);
    expect(stepped.end).toBe(0);
    expect(stepped.z).toBe(100);
    expect(stepped.lowStart).toBe(0);
    expect(stepped.lowEnd).toBe(0);
  });

  it('honors an explicit baseElevation override', () => {
    const gridSystem = makeGridSystem();
    const base = getWallBaseWorldZ({
      parsed: parseWallKey('0,0,1,0'),
      wall: { ...WALL, baseElevation: 3 },
      gridType: 'square',
      gridSystem,
      elevationData: { '0,0': -2 }
    });
    expect(base.start).toBe(150);
    expect(base.end).toBe(150);
    expect(base.lowStart).toBe(150);
    expect(base.lowEnd).toBe(150);
  });

  it('resolves wall endpoints to world corners', () => {
    const gridSystem = makeGridSystem();
    const ends = getWallWorldEndpoints(parseWallKey('1,2,2,2'), gridSystem, 'square');
    expect(ends.start).toEqual({ x: 50, y: 100 });
    expect(ends.end).toEqual({ x: 100, y: 100 });
  });

  it('picks the camera-facing side and flips it when the camera orbits 180 degrees', () => {
    const gridSystem = makeGridSystem();
    const front = buildWallRenderItem({
      key: '0,0,1,0',
      wall: WALL,
      typeData: STONE,
      gridSystem,
      gridType: 'square',
      transform: buildTransform({ viewRotation: 0 }),
      elevationData: {}
    });
    expect(front.nearSide).toBe(1);

    const back = buildWallRenderItem({
      key: '0,0,1,0',
      wall: WALL,
      typeData: STONE,
      gridSystem,
      gridType: 'square',
      transform: buildTransform({ viewRotation: 180 }),
      elevationData: {}
    });
    expect(back.nearSide).toBe(-1);
  });

  it('sinks wall bases and snaps tops to base + height', () => {
    const gridSystem = makeGridSystem();
    const item = buildWallRenderItem({
      key: '0,0,1,0',
      wall: WALL,
      typeData: STONE,
      gridSystem,
      gridType: 'square',
      transform: buildTransform(),
      elevationData: { '0,0': 1, '0,-1': 1, '1,0': 1, '1,-1': 1 }
    });
    expect(item.baseZStart).toBeCloseTo(50 - WALL_BASE_SINK_WORLD, 8);
    expect(item.topZ).toBeCloseTo(50 + 90, 8);
    expect(item.faces.near).toHaveLength(4);
    expect(item.faces.top).toHaveLength(4);
    expect(item.capPoints).toHaveLength(4);
  });

  it('builds a real window (breast, lintel, jambs, pane, mullions)', () => {
    const gridSystem = makeGridSystem();
    const item = buildWallRenderItem({
      key: '0,0,1,0',
      wall: { type: 'glass_window' },
      typeData: { color: '#87CEEB', isWindow: true, blocksLineOfSight: false },
      gridSystem,
      gridType: 'square',
      transform: buildTransform(),
      elevationData: {}
    });
    expect(item.isWindow).toBe(true);
    expect(item.window.kind).toBe('glass');
    expect(item.window.pane).toHaveLength(4);
    expect(item.window.mullions.length).toBe(2);
    expect(item.window.breastNear).toHaveLength(4);
    expect(item.window.sillZ).toBeUndefined();
    expect(item.window.boundaries.sillZ).toBeLessThan(item.window.boundaries.headZ);
    // Protruding sill with a front lip + shadow, and jamb contact shadows
    expect(item.window.sillTop).toHaveLength(4);
    expect(item.window.sillFront).toHaveLength(4);
    expect(item.window.sillShadow).toHaveLength(4);
    expect(item.window.aoStart).toHaveLength(4);
    expect(item.window.aoEnd).toHaveLength(4);
  });

  it('uses the host wall color for door/window masonry but keeps feature material', () => {
    const gridSystem = makeGridSystem();
    const item = buildWallRenderItem({
      key: '0,0,1,0',
      wall: { type: 'glass_window' },
      typeData: { color: '#87CEEB', isWindow: true, blocksLineOfSight: false },
      gridSystem,
      gridType: 'square',
      transform: buildTransform(),
      elevationData: {},
      patternType: 'brick_wall',
      hostHeightWorld: 90,
      hostColor: '#B22222'
    });
    expect(item.color).toBe('#87CEEB');
    expect(item.masonryColor).toBe('#B22222');
  });

  it('builds barred and slit window variants', () => {
    const gridSystem = makeGridSystem();
    const barred = buildWallRenderItem({
      key: '0,0,1,0',
      wall: { type: 'barred_window' },
      typeData: { color: '#708090', isWindow: true },
      gridSystem,
      gridType: 'square',
      transform: buildTransform(),
      elevationData: {}
    });
    expect(barred.window.kind).toBe('barred');
    expect(barred.window.bars.length).toBeGreaterThanOrEqual(4);
    expect(barred.window.interior).toHaveLength(4);

    const slit = buildWallRenderItem({
      key: '0,0,1,0',
      wall: { type: 'arrow_slit' },
      typeData: { color: '#4A4A4A', isWindow: true },
      gridSystem,
      gridType: 'square',
      transform: buildTransform(),
      elevationData: {}
    });
    expect(slit.window.kind).toBe('slit');
    expect(slit.window.boundaries.t1 - slit.window.boundaries.t0).toBeLessThan(0.3);
  });

  it('builds closed and open door states', () => {
    const gridSystem = makeGridSystem();
    const closed = buildWallRenderItem({
      key: '0,0,1,0',
      wall: { type: 'wooden_door', state: 'closed' },
      typeData: { color: '#8B4513', interactive: true },
      gridSystem,
      gridType: 'square',
      transform: buildTransform(),
      elevationData: {}
    });
    expect(closed.isDoor).toBe(true);
    expect(closed.door.leaf).toBeTruthy();
    expect(closed.door.swing).toBeNull();

    const open = buildWallRenderItem({
      key: '0,0,1,0',
      wall: { type: 'wooden_door', state: 'open' },
      typeData: { color: '#8B4513', interactive: true },
      gridSystem,
      gridType: 'square',
      transform: buildTransform(),
      elevationData: {}
    });
    expect(open.door.leaf).toBeNull();
    expect(open.door.swing).toBeTruthy();
    expect(open.door.swing.arc.length).toBeGreaterThan(4);
    // Open leaf is a 3D slab: near/far/top + both edge faces, floor shadow,
    // iron details, and world anchors used for painter-depth sorting.
    expect(open.door.swing.near).toHaveLength(4);
    expect(open.door.swing.far).toHaveLength(4);
    expect(open.door.swing.top).toHaveLength(4);
    expect(open.door.swing.edgeFree).toHaveLength(4);
    expect(open.door.swing.edgeHinge).toHaveLength(4);
    expect(open.door.swing.shadow).toHaveLength(4);
    expect(open.door.swing.hinges).toHaveLength(2);
    expect(open.door.swing.worldHinge).toBeTruthy();
    expect(open.door.swing.worldEnd).toBeTruthy();
  });

  it('extends wall ends into connected solid walls for seamless corners', () => {
    const gridSystem = makeGridSystem();
    const straight = buildWallRenderItem({
      key: '0,0,0,1',
      wall: WALL,
      typeData: STONE,
      gridSystem,
      gridType: 'square',
      transform: buildTransform(),
      elevationData: {},
      connectedStart: false,
      connectedEnd: false
    });
    expect(straight.end.y).toBeCloseTo(50, 6);
    expect(straight.showEndEnd).toBe(true);

    const joined = buildWallRenderItem({
      key: '0,0,0,1',
      wall: WALL,
      typeData: STONE,
      gridSystem,
      gridType: 'square',
      transform: buildTransform(),
      elevationData: {},
      connectedStart: false,
      connectedEnd: true
    });
    expect(joined.end.y).toBeCloseTo(50 + 7.5 * 0.5, 6);
    expect(joined.worldEnd.y).toBeCloseTo(50, 6);
    expect(joined.showEndEnd).toBe(false);
  });

  it('still reports connected solid neighbours at corner nodes', () => {
    const gridSystem = makeGridSystem();
    const wallData = {
      '0,0,1,0': WALL,
      '1,0,2,0': WALL,
      '0,0,0,1': WALL
    };
    const nodes = collectWallNodes({
      wallData,
      wallTypes: { stone_wall: STONE },
      gridSystem,
      gridType: 'square',
      elevationData: {}
    });

    const endNode = nodes.get('0,0');
    const midNode = nodes.get('50,0');
    expect(nodeConnectedSolidCount(endNode, '0,0,1,0')).toBeGreaterThan(0);
    expect(nodeConnectedSolidCount(midNode, '1,0,2,0')).toBe(1);
  });
});

describe('WallGeometry joins', () => {
  const HALF = getWallThickness(50) / 2;

  const makeNode = (vectors) => ({
    worldX: 0,
    worldY: 0,
    unitVectors: vectors.map(([x, y, key]) => ({ x, y, key, isSolid: true }))
  });

  const hexDir = (degrees) => {
    const rad = (degrees * Math.PI) / 180;
    return { x: Math.cos(rad), y: Math.sin(rad) };
  };

  it('keeps wall thickness independent of zoom level', () => {
    expect(getWallThickness(50, { effectiveZoom: 1 })).toBe(7.5);
    expect(getWallThickness(50, { effectiveZoom: 4 })).toBe(7.5);
    expect(getWallThickness(100)).toBe(15);
  });

  it('extends connected ends by the exact miter projection at 90 degrees', () => {
    const node = makeNode([[0, 1, 'other']]);
    const extension = wallJoinExtension({
      node,
      excludeKey: 'this',
      dirX: 1,
      dirY: 0,
      half: HALF
    });
    expect(extension).toBeCloseTo(HALF, 6);
  });

  it('miters 120-degree hex joins to half / tan(60), not half', () => {
    const node = makeNode([
      [hexDir(120).x, hexDir(120).y, 'other']
    ]);
    const extension = wallJoinExtension({
      node,
      excludeKey: 'this',
      dirX: 1,
      dirY: 0,
      half: HALF
    });
    expect(extension).toBeCloseTo(HALF / Math.tan(Math.PI / 3), 6);
    expect(extension).toBeLessThan(HALF);
  });

  it('miters all three arms evenly at a hex Y junction', () => {
    const dirs = [0, 120, 240].map(hexDir);
    for (let i = 0; i < 3; i++) {
      const node = makeNode(
        dirs.filter((_, index) => index !== i).map((d, index) => [d.x, d.y, `wall${index}`])
      );
      const extension = wallJoinExtension({
        node,
        excludeKey: 'self',
        dirX: dirs[i].x,
        dirY: dirs[i].y,
        half: HALF
      });
      expect(extension).toBeCloseTo(HALF / Math.tan(Math.PI / 3), 6);
    }
  });

  it('builds a non-self-intersecting footprint for a free wall end', () => {
    const item = {
      key: 'free',
      worldStart: { x: 0, y: 0 },
      worldEnd: { x: 50, y: 0 }
    };
    const footprint = computeWallFootprint({ item, startNode: null, endNode: null, half: HALF });
    expect(footprint).toHaveLength(4);
    expect(footprint[0]).toEqual([0, HALF]);
    expect(footprint[1]).toEqual([50, HALF]);
    expect(footprint[2]).toEqual([50, -HALF]);
    expect(footprint[3]).toEqual([0, -HALF]);
  });

  it('places 120-degree hex footprint corners on the true stroke boundary', () => {
    const item = {
      key: 'A',
      worldStart: { x: 0, y: 0 },
      worldEnd: { x: 50, y: 0 }
    };
    const dirB = hexDir(120);
    const node = makeNode([[dirB.x, dirB.y, 'B']]);
    const footprint = computeWallFootprint({ item, startNode: node, endNode: null, half: HALF });

    const distanceToWallB = (x, y) => Math.abs(x * dirB.y - y * dirB.x);
    for (const [x, y] of footprint) {
      const strokeDistance = Math.min(Math.abs(y), distanceToWallB(x, y));
      expect(strokeDistance).toBeLessThanOrEqual(HALF + 1e-9);
    }

    const miterDistance = HALF / Math.sin(Math.PI / 3);
    for (const [x, y] of [footprint[0], footprint[3]]) {
      expect(Math.hypot(x, y)).toBeCloseTo(miterDistance, 6);
    }
  });

  it('uses the mitered extension when nodes are supplied to buildWallRenderItem', () => {
    const gridSystem = makeGridSystem();
    const dirB = hexDir(-60);
    const node = {
      worldX: 50,
      worldY: 0,
      unitVectors: [
        { x: dirB.x, y: dirB.y, key: '1,0,1,1', isSolid: true }
      ]
    };
    const item = buildWallRenderItem({
      key: '0,0,1,0',
      wall: WALL,
      typeData: STONE,
      gridSystem,
      gridType: 'square',
      transform: buildTransform(),
      elevationData: {},
      connectedEnd: true,
      endNode: node
    });
    const expected = getWallThickness(50) / 2 / Math.tan(Math.PI / 3);
    expect(item.end.x).toBeCloseTo(50 + expected, 6);
    expect(item.worldEnd.x).toBeCloseTo(50, 6);
  });

  it('rejects a zero-length direction for wall patterns', () => {
    const descriptor = wallPatternDescriptor({
      typeId: 'stone_wall',
      ux: 0,
      uy: 0,
      gridSize: 50,
      transform: buildTransform(),
      color: '#8B7355'
    });
    expect(descriptor).toBeNull();
  });

  it('builds non-degenerate pattern matrices for axis-aligned directions', () => {
    const transform = buildTransform({ viewRotation: 45 });
    for (const [ux, uy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      const descriptor = wallPatternDescriptor({
        typeId: 'stone_wall',
        ux,
        uy,
        gridSize: 50,
        transform,
        color: '#8B7355'
      });
      expect(descriptor).toBeTruthy();
      const { a, b, c, d } = descriptor.side.matrix;
      expect(Math.hypot(a, b)).toBeGreaterThan(1e-6);
      expect(Math.hypot(c, d)).toBeGreaterThan(1e-6);
    }
  });
});
