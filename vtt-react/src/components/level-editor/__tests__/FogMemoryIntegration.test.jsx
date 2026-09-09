import { calculateVisibilityPolygon, isPointInPolygon } from '../../../utils/VisibilityCalculations';

describe('Fog and Memory Integration Contract', () => {
  test('Visibility polygon outputs correct shape for MemorySnapshotManager consumption', () => {
    const wallData = {
      '5,0,5,10': { type: 'stone_wall', state: 'closed' }
    };
    const poly = calculateVisibilityPolygon(100, 100, 6, wallData, 50, 0, 0);

    // Verify format expected by MemorySnapshotManager.jsx line 101:
    // "if (isPointInPolygon(worldX, worldY, visibilityPolygon)) return true;"
    expect(poly).toBeDefined();
    expect(Array.isArray(poly)).toBe(true);
    expect(poly.length).toBeGreaterThan(2);

    // Test a token point on the player's side of the wall
    const visibleTokenPos = { x: 150, y: 100 };
    expect(isPointInPolygon(visibleTokenPos.x, visibleTokenPos.y, poly)).toBe(true);

    // Test a token point behind the wall (x=250 is where the wall is, so x=300 is occluded)
    const occludedTokenPos = { x: 300, y: 100 };
    expect(isPointInPolygon(occludedTokenPos.x, occludedTokenPos.y, poly)).toBe(false);
  });
});
