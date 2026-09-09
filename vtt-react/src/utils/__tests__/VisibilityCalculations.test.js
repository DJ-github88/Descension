import { calculateVisibilityPolygon, isPointInPolygon, calculateVisibleTiles, feetToTiles } from '../VisibilityCalculations';

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

  test('MemorySnapshotManager isPointInPolygon contract test', () => {
    // MemorySnapshotManager relies on isPointInPolygon(tokenPos, poly)
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
