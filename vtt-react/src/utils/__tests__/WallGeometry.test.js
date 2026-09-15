import {
  WALL_BASE_SINK_WORLD,
  WALL_MITER_LIMIT,
  buildWallRenderItem,
  collectWallNodes,
  computeWallFootprint,
  nodeConnectedSolidCount,
  getWallBaseWorldZ,
  getWallHeightWorld,
  getWallThickness,
  getWallWorldEndpoints,
  parseWallKey,
  wallJoinCorners,
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

const makeHexGridSystem = (options = {}) => {
  const state = {
    gridSize: 50,
    gridType: 'hex',
    gridOffsetX: 0,
    gridOffsetY: 0,
    viewMode: '2.5d',
    viewRotation: 0,
    viewTilt: 30,
    effectiveZoom: 1,
    cameraX: 0,
    cameraY: 0
  };
  const cellsAt = options.cellsAt || [{ q: 0, r: 0 }];
  return {
    ...makeGridSystem(state),
    getHexEdge: options.getHexEdge || (() => null),
    hexCellsAtVertex: () => cellsAt.slice()
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

  it('resolves free-form hex walls straight to their stored corner endpoints', () => {
    const gridSystem = makeHexGridSystem();
    const wall = {
      type: 'stone_wall',
      hexEndpoints: [
        { x: 25, y: -14.433756729740644 },
        { x: -25, y: 14.433756729740644 }
      ]
    };
    const ends = getWallWorldEndpoints(
      parseWallKey('-2500,-1443,2500,1443'),
      gridSystem,
      'hex',
      wall
    );
    expect(ends.start).toEqual(wall.hexEndpoints[0]);
    expect(ends.end).toEqual(wall.hexEndpoints[1]);
  });

  it('keeps resolving legacy hex cell-edge walls through getHexEdge', () => {
    const edge = { start: { x: 1, y: 2 }, end: { x: 3, y: 4 } };
    const gridSystem = makeHexGridSystem({ getHexEdge: () => edge });
    const ends = getWallWorldEndpoints(
      parseWallKey('0,0,1,0'),
      gridSystem,
      'hex',
      { type: 'stone_wall' }
    );
    expect(ends).toEqual({ start: edge.start, end: edge.end });
  });

  it('searches every cell touching a free-form hex wall endpoint for elevation', () => {
    const gridSystem = makeHexGridSystem({
      cellsAt: [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 0, r: 1 }]
    });
    const wall = {
      type: 'stone_wall',
      hexEndpoints: [{ x: 0, y: 0 }, { x: 40, y: 10 }]
    };
    const base = getWallBaseWorldZ({
      parsed: parseWallKey('0,0,4000,1000'),
      wall,
      gridType: 'hex',
      gridSystem,
      elevationData: { '0,0': 2, '1,0': 0, '0,1': 1 }
    });
    expect(base.start).toBe(100);
    expect(base.end).toBe(100);
    expect(base.lowStart).toBe(0);
    expect(base.lowEnd).toBe(0);
  });

  it('builds prism geometry for a straight hex wall between two corners', () => {
    const gridSystem = makeHexGridSystem();
    const wall = {
      type: 'stone_wall',
      hexEndpoints: [
        { x: 25, y: -14.433756729740644 },
        { x: -25, y: 14.433756729740644 }
      ]
    };
    const item = buildWallRenderItem({
      key: '-2500,-1443,2500,1443',
      wall,
      typeData: STONE,
      gridSystem,
      gridType: 'hex',
      transform: buildTransform(),
      elevationData: {}
    });
    expect(item.worldStart).toEqual(wall.hexEndpoints[0]);
    expect(item.worldEnd).toEqual(wall.hexEndpoints[1]);
    expect(item.runLength).toBeCloseTo(57.735, 2);
    expect(item.thickness).toBe(7.5);
    expect(item.faces.near).toHaveLength(4);
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

  it('clamps shallow joins to a shared bevel corner instead of giant spikes', () => {
    const rad = (14 * Math.PI) / 180;
    const dirB = { x: Math.cos(rad), y: Math.sin(rad) };
    const node = makeNode([[1, 0, 'A'], [dirB.x, dirB.y, 'B']]);

    const extension = wallJoinExtension({
      node,
      excludeKey: 'A',
      dirX: 1,
      dirY: 0,
      half: HALF
    });
    expect(extension).toBeGreaterThan(0);
    expect(extension).toBeLessThanOrEqual(WALL_MITER_LIMIT * HALF + 1e-9);

    // Both arms of the join must land on the exact same bevelled corner, which
    // is what lets their footprints union into one seamless run.
    const cornersA = wallJoinCorners({ node, excludeKey: 'A', dirX: 1, dirY: 0, half: HALF });
    const cornersB = wallJoinCorners({ node, excludeKey: 'B', dirX: dirB.x, dirY: dirB.y, half: HALF });
    expect(cornersA.plus.x).toBeCloseTo(cornersB.minus.x, 9);
    expect(cornersA.plus.y).toBeCloseTo(cornersB.minus.y, 9);
    expect(Math.hypot(cornersA.plus.x, cornersA.plus.y)).toBeLessThanOrEqual(WALL_MITER_LIMIT * HALF + 1e-9);
  });

  it('keeps near edge-on side patterns non-degenerate', () => {
    const transform = buildTransform({ viewRotation: 4 });
    const descriptor = wallPatternDescriptor({
      typeId: 'stone_wall',
      ux: 0,
      uy: 1,
      gridSize: 50,
      transform,
      color: '#8B7355'
    });
    const { a, b, c, d } = descriptor.side.matrix;
    const det = Math.abs(a * d - b * c) / (Math.hypot(a, b) * Math.hypot(c, d));
    expect(det).toBeGreaterThan(Math.sin((10 * Math.PI) / 180));
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
