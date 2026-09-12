import {
  WALL_BASE_SINK_WORLD,
  buildWallRenderItem,
  collectWallNodes,
  nodeConnectedSolidCount,
  getWallBaseWorldZ,
  getWallHeightWorld,
  getWallWorldEndpoints,
  parseWallKey
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
