import { calculateVisibilityPolygon, isPointInPolygon, calculateVisibleTiles, feetToTiles, isWallBlocking, isWallBlockingMovement, hasLineOfSight, collectVisibleWallRuns } from '../VisibilityCalculations';
import { InfiniteGridSystem } from '../InfiniteGridSystem';

describe('VisibilityCalculations with visibility-polygon', () => {
  const gridSize = 50;
  const gridOffsetX = 0;
  const gridOffsetY = 0;

  test('calculates a 360-degree perimeter polygon when no walls exist', () => {
    const poly = calculateVisibilityPolygon(500, 500, 6, {}, gridSize, gridOffsetX, gridOffsetY);
    expect(Array.isArray(poly)).toBe(true);
    expect(poly.length).toBeGreaterThanOrEqual(30);
    // All points should have x and y numbers
    poly.forEach(pt => {
      expect(typeof pt.x).toBe('number');
      expect(typeof pt.y).toBe('number');
      // Distance from origin should be close to 6 * 50 = 300
      const dist = Math.hypot(pt.x - 500, pt.y - 500);
      expect(dist).toBeCloseTo(300, -1);
    });
  });

  test('casts shadows behind walls', () => {
    // A vertical wall at grid x=11 (world x=550), between y=9 and y=11 (world y=450 to 550)
    const wallData = {
      '11,9,11,11': { type: 'stone_wall', state: 'closed' }
    };

    const poly = calculateVisibilityPolygon(500, 500, 6, wallData, gridSize, gridOffsetX, gridOffsetY);
    expect(Array.isArray(poly)).toBe(true);
    expect(poly.length).toBeGreaterThanOrEqual(3);

    // Origin (500, 500) should be inside the visibility polygon
    expect(isPointInPolygon(500, 500, poly)).toBe(true);

    // Point directly in front of the wall (525, 500) should be visible
    expect(isPointInPolygon(525, 500, poly)).toBe(true);

    // Point directly behind the stone wall (575, 500) should NOT be visible
    expect(isPointInPolygon(575, 500, poly)).toBe(false);
  });

  test('open doors do not block visibility polygon', () => {
    const wallDataClosed = {
      '11,9,11,11': { type: 'wooden_door', state: 'closed' }
    };
    const wallDataOpen = {
      '11,9,11,11': { type: 'wooden_door', state: 'open' }
    };

    const closedPoly = calculateVisibilityPolygon(500, 500, 6, wallDataClosed, gridSize, gridOffsetX, gridOffsetY);
    const openPoly = calculateVisibilityPolygon(500, 500, 6, wallDataOpen, gridSize, gridOffsetX, gridOffsetY);

    // Point behind door (575, 500) should be blocked when closed, visible when open
    expect(isPointInPolygon(575, 500, closedPoly)).toBe(false);
    expect(isPointInPolygon(575, 500, openPoly)).toBe(true);
  });

  test('movement blocking differs from sight blocking', () => {
    const windowWall = { '1,0,1,1': { type: 'glass_window' } };
    expect(isWallBlocking(0, 0, 1, 0, windowWall)).toBe(false);
    expect(isWallBlockingMovement(0, 0, 1, 0, windowWall)).toBe(true);

    const barrier = { '1,0,1,1': { type: 'magical_barrier' } };
    expect(isWallBlocking(0, 0, 1, 0, barrier)).toBe(false);
    expect(isWallBlockingMovement(0, 0, 1, 0, barrier)).toBe(true);

    const openDoor = { '1,0,1,1': { type: 'wooden_door', state: 'open' } };
    expect(isWallBlockingMovement(0, 0, 1, 0, openDoor)).toBe(false);

    const closedDoor = { '1,0,1,1': { type: 'wooden_door', state: 'closed' } };
    expect(isWallBlockingMovement(0, 0, 1, 0, closedDoor)).toBe(true);

    const openWindow = { '1,0,1,1': { type: 'open_window' } };
    expect(isWallBlockingMovement(0, 0, 1, 0, openWindow)).toBe(false);

    const legacyWall = { '1,0,1,1': 'stone_wall' };
    expect(isWallBlockingMovement(0, 0, 1, 0, legacyWall)).toBe(true);
  });

  test('MemorySnapshotManager isPointInPolygon contract test', () => {    // MemorySnapshotManager relies on isPointInPolygon(tokenPos, poly)
    const poly = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    expect(isPointInPolygon(50, 50, poly)).toBe(true);
    expect(isPointInPolygon(150, 50, poly)).toBe(false);
  });
});

describe('VisibilityCalculations hex grids', () => {
  const gridSize = 50;

  const makeHexGrid = () => new InfiniteGridSystem({
    getState: () => ({
      gridSize,
      gridType: 'hex',
      gridOffsetX: 0,
      gridOffsetY: 0,
      cameraX: 0,
      cameraY: 0,
      zoomLevel: 1,
      playerZoom: 1,
      viewMode: '2d',
      viewRotation: 0,
      viewTilt: 90
    })
  });

  // Builds a hex wall record between two adjacent cells the way the editor
  // commits free-form walls: corner key + hexEndpoints.
  const hexWall = (gridSystem, q1, r1, q2, r2, wall = { type: 'stone_wall', state: 'closed' }) => {
    const edge = gridSystem.getHexEdge(q1, r1, q2, r2);
    const parts1 = gridSystem.hexVertexKeyParts(edge.start);
    const parts2 = gridSystem.hexVertexKeyParts(edge.end);
    return {
      [ `${parts1.x},${parts1.y},${parts2.x},${parts2.y}` ]: {
        ...wall,
        hexEndpoints: [
          { x: edge.start.x, y: edge.start.y },
          { x: edge.end.x, y: edge.end.y }
        ]
      }
    };
  };

  test('hex edge walls block line of sight between adjacent hexes', () => {
    const gs = makeHexGrid();
    const wallData = hexWall(gs, 0, 0, 1, 0);

    expect(hasLineOfSight(0, 0, 1, 0, wallData, 'hex', {}, gs)).toBe(false);
    expect(hasLineOfSight(0, 0, 2, 0, wallData, 'hex', {}, gs)).toBe(false);
    expect(hasLineOfSight(0, 0, -1, 0, wallData, 'hex', {}, gs)).toBe(true);
    expect(hasLineOfSight(0, 0, 0, 1, wallData, 'hex', {}, gs)).toBe(true);
  });

  test('open hex doors do not block sight and windows let vision through', () => {
    const gs = makeHexGrid();
    const openDoor = hexWall(gs, 0, 0, 1, 0, { type: 'wooden_door', state: 'open' });
    const window = hexWall(gs, 0, 0, 1, 0, { type: 'glass_window' });

    expect(hasLineOfSight(0, 0, 2, 0, openDoor, 'hex', {}, gs)).toBe(true);
    expect(hasLineOfSight(0, 0, 2, 0, window, 'hex', {}, gs)).toBe(true);
  });

  test('legacy cell-pair hex walls block sight through getHexEdge', () => {
    const gs = makeHexGrid();
    const wallData = { '0,0,1,0': { type: 'stone_wall', state: 'closed' } };

    expect(hasLineOfSight(0, 0, 2, 0, wallData, 'hex', {}, gs)).toBe(false);
    expect(hasLineOfSight(0, 0, 0, 1, wallData, 'hex', {}, gs)).toBe(true);
  });

  test('multi-cell hex chords block sight across cells they cross', () => {
    const gs = makeHexGrid();
    const edge = gs.getHexEdge(0, 0, 1, 0);
    const wallData = {
      '2500,-10000,2500,10000': {
        type: 'stone_wall',
        state: 'closed',
        hexEndpoints: [
          { x: edge.start.x, y: -100 },
          { x: edge.end.x, y: 100 }
        ]
      }
    };

    expect(hasLineOfSight(0, 0, 2, 0, wallData, 'hex', {}, gs)).toBe(false);
    expect(hasLineOfSight(0, 0, 0, 2, wallData, 'hex', {}, gs)).toBe(false);
    expect(hasLineOfSight(0, 0, -1, 0, wallData, 'hex', {}, gs)).toBe(true);
  });

  test('hex walls cut the visibility polygon', () => {
    const gs = makeHexGrid();
    const wallData = hexWall(gs, 0, 0, 1, 0);

    const poly = calculateVisibilityPolygon(0, 0, 3, wallData, gridSize, 0, 0, 360, null, {}, 'hex', gs);
    expect(Array.isArray(poly)).toBe(true);
    expect(poly.length).toBeGreaterThanOrEqual(3);
    expect(isPointInPolygon(0, 0, poly)).toBe(true);

    // Behind the wall (center of hex 1,0 and beyond) is shadowed
    expect(isPointInPolygon(50, 0, poly)).toBe(false);
    expect(isPointInPolygon(100, 0, poly)).toBe(false);
    // The open side stays visible
    expect(isPointInPolygon(-40, 0, poly)).toBe(true);
  });

  test('calculateVisibleTiles respects hex walls', () => {
    const gs = makeHexGrid();
    const wallData = hexWall(gs, 0, 0, 1, 0);

    const tiles = calculateVisibleTiles(0, 0, 2, 'normal', wallData, {}, 360, null, 'hex', gs);
    expect(tiles.has('0,0')).toBe(true);
    expect(tiles.has('1,0')).toBe(false);
    expect(tiles.has('2,0')).toBe(false);
    expect(tiles.has('0,1')).toBe(true);
    expect(tiles.has('-1,0')).toBe(true);
  });

  test('collectVisibleWallRuns returns only the in-view slice of a hex chord', () => {
    const gs = makeHexGrid();
    const edge = gs.getHexEdge(0, 0, 1, 0);
    const wallData = {
      '2500,-30000,2500,30000': {
        type: 'stone_wall',
        state: 'closed',
        hexEndpoints: [{ x: edge.start.x, y: -300 }, { x: edge.end.x, y: 300 }]
      }
    };

    const poly = calculateVisibilityPolygon(0, 0, 3, wallData, gridSize, 0, 0, 360, null, {}, 'hex', gs);
    const runs = collectVisibleWallRuns({
      wallData,
      visibilityPolygon: poly,
      origin: { x: 0, y: 0 },
      gridSystem: gs,
      gridType: 'hex',
      gridSize
    });

    expect(runs.length).toBe(1);
    expect(runs[0].start.x).toBeCloseTo(25, 0);
    expect(runs[0].end.x).toBeCloseTo(25, 0);
    // Vision range 3 (150 world units) limits the visible slice; the wall
    // extends well past it on both ends.
    expect(Math.abs(runs[0].start.y)).toBeGreaterThan(100);
    expect(Math.abs(runs[0].start.y)).toBeLessThan(160);
    expect(runs[0].heightWorld).toBeGreaterThan(0);
  });

  test('collectVisibleWallRuns returns nothing for walls outside the vision polygon', () => {
    const gs = makeHexGrid();
    const edge = gs.getHexEdge(0, 0, 1, 0);
    const wallData = {
      '2500,-30000,2500,30000': {
        type: 'stone_wall',
        state: 'closed',
        hexEndpoints: [{ x: edge.start.x, y: -300 }, { x: edge.end.x, y: 300 }]
      },
      '10000,-30000,10000,30000': {
        type: 'stone_wall',
        state: 'closed',
        hexEndpoints: [{ x: 1000, y: -300 }, { x: 1000, y: 300 }]
      }
    };

    const poly = calculateVisibilityPolygon(0, 0, 3, wallData, gridSize, 0, 0, 360, null, {}, 'hex', gs);
    const runs = collectVisibleWallRuns({
      wallData,
      visibilityPolygon: poly,
      origin: { x: 0, y: 0 },
      gridSystem: gs,
      gridType: 'hex',
      gridSize
    });

    expect(runs.every((run) => run.wallKey === '2500,-30000,2500,30000')).toBe(true);
  });

  test('collectVisibleWallRuns skips open doors and windows', () => {
    const gs = makeHexGrid();
    const edge = gs.getHexEdge(0, 0, 1, 0);
    const makeWall = (wall) => ({
      '2500,-30000,2500,30000': {
        ...wall,
        hexEndpoints: [{ x: edge.start.x, y: -300 }, { x: edge.end.x, y: 300 }]
      }
    });
    const origin = { x: 0, y: 0 };
    const closed = collectVisibleWallRuns({
      wallData: makeWall({ type: 'stone_wall', state: 'closed' }),
      visibilityPolygon: calculateVisibilityPolygon(0, 0, 3, makeWall({ type: 'stone_wall', state: 'closed' }), gridSize, 0, 0, 360, null, {}, 'hex', gs),
      origin,
      gridSystem: gs,
      gridType: 'hex',
      gridSize
    });
    expect(closed.length).toBe(1);

    const openDoor = makeWall({ type: 'wooden_door', state: 'open' });
    const openRuns = collectVisibleWallRuns({
      wallData: openDoor,
      visibilityPolygon: calculateVisibilityPolygon(0, 0, 3, openDoor, gridSize, 0, 0, 360, null, {}, 'hex', gs),
      origin,
      gridSystem: gs,
      gridType: 'hex',
      gridSize
    });
    expect(openRuns.length).toBe(0);
  });
});

describe('collectVisibleWallRuns square grids', () => {
  const gridSize = 50;

  const makeSquareGrid = () => new InfiniteGridSystem({
    getState: () => ({
      gridSize,
      gridType: 'square',
      gridOffsetX: 0,
      gridOffsetY: 0,
      cameraX: 0,
      cameraY: 0,
      zoomLevel: 1,
      playerZoom: 1,
      viewMode: '2d',
      viewRotation: 0,
      viewTilt: 90
    })
  });

  test('collects the visible portion of a square wall as 2.5D fog silhouettes', () => {
    const gs = makeSquareGrid();
    const wallData = {
      '11,9,11,11': { type: 'stone_wall', state: 'closed' }
    };
    const poly = calculateVisibilityPolygon(500, 500, 6, wallData, gridSize, 0, 0);
    const runs = collectVisibleWallRuns({
      wallData,
      visibilityPolygon: poly,
      origin: { x: 500, y: 500 },
      gridSystem: gs,
      gridType: 'square',
      gridSize
    });

    expect(runs.length).toBe(1);
    expect(runs[0].start.x).toBeCloseTo(550, 0);
    expect(runs[0].end.x).toBeCloseTo(550, 0);
    expect(runs[0].heightWorld).toBeGreaterThan(0);
    expect(runs[0].thickness).toBeGreaterThan(0);
  });
});
