import {
  createConePolygon,
  createCirclePolygon,
  createLinePolygon,
  createCubePolygon,
  clipAoEAgainstWalls,
  getTokensInAoE,
  buildAoEPolygon
} from '../AoETemplates';

describe('AoETemplates Geometric Generation & Wall Clipping', () => {
  describe('Spell Area of Effect Shapes', () => {
    test('createConePolygon generates a cone starting at origin', () => {
      const cone = createConePolygon(100, 100, 50, 0); // pointing east
      expect(cone.length).toBeGreaterThan(10);
      // First point is origin
      expect(cone[0]).toEqual({ x: 100, y: 100 });
      // All points should have x and y
      cone.forEach(pt => {
        expect(typeof pt.x).toBe('number');
        expect(typeof pt.y).toBe('number');
        expect(pt.x).toBeGreaterThanOrEqual(99.9); // pointing east from 100
      });
    });

    test('createCirclePolygon generates regular polygon circle approximation', () => {
      const circle = createCirclePolygon(200, 200, 50, 16);
      expect(circle.length).toBe(16);
      circle.forEach(pt => {
        const dist = Math.hypot(pt.x - 200, pt.y - 200);
        expect(dist).toBeCloseTo(50, 5);
      });
    });

    test('createLinePolygon generates a 4-point rectangle oriented along direction', () => {
      const line = createLinePolygon(0, 0, 100, 10, 0); // 100 long, 10 wide, pointing east
      expect(line.length).toBe(4);
      // Width is 10 (half-width = 5 above and below y=0)
      expect(line[0].y).toBeCloseTo(-5);
      expect(line[1].y).toBeCloseTo(5);
      // Length is 100 forward along x
      expect(line[2].x).toBeCloseTo(100);
      expect(line[3].x).toBeCloseTo(100);
    });

    test('createCubePolygon creates a 4-point cube', () => {
      const cube = createCubePolygon(100, 100, 40, 0, true);
      expect(cube.length).toBe(4);
      // Centered at 100, 100 with size 40 -> bounds 80 to 120
      const xs = cube.map(p => p.x);
      const ys = cube.map(p => p.y);
      expect(Math.min(...xs)).toBe(80);
      expect(Math.max(...xs)).toBe(120);
      expect(Math.min(...ys)).toBe(80);
      expect(Math.max(...ys)).toBe(120);
    });
  });

  describe('clipAoEAgainstWalls using polygon-clipping', () => {
    test('clips spell polygon against visibility polygon', () => {
      // Spell covers (0, 0) to (200, 200)
      const spellPoly = [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
        { x: 200, y: 200 },
        { x: 0, y: 200 }
      ];

      // Room visibility polygon only extends up to x=100
      const roomVisPoly = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 200 },
        { x: 0, y: 200 }
      ];

      const clippedRings = clipAoEAgainstWalls(spellPoly, roomVisPoly);
      expect(Array.isArray(clippedRings)).toBe(true);
      expect(clippedRings.length).toBeGreaterThan(0);

      // Verify no point in clipped rings has x > 100
      for (const ring of clippedRings) {
        for (const pt of ring) {
          expect(pt.x).toBeLessThanOrEqual(100.01);
        }
      }
    });

    test('returns original polygon if no visibility polygon provided', () => {
      const spellPoly = [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 50, y: 50 },
        { x: 0, y: 50 }
      ];
      const result = clipAoEAgainstWalls(spellPoly, null);
      expect(result).toEqual([spellPoly]);
    });
  });

  describe('getTokensInAoE', () => {
    test('accurately detects tokens inside AoE blast area', () => {
      const tokens = [
        { id: 'token-inside', position: { x: 50, y: 50 } },
        { id: 'token-outside', position: { x: 250, y: 250 } }
      ];

      const aoePoly = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ];

      const hitTokens = getTokensInAoE(tokens, aoePoly);
      expect(hitTokens.length).toBe(1);
      expect(hitTokens[0].id).toBe('token-inside');
    });
  });

  describe('buildAoEPolygon (placement tool entry point)', () => {
    const base = { feetPerTile: 5, gridSize: 50 }; // 10 px per foot

    test('builds a cone aimed from anchor toward target with correct length', () => {
      // 30-ft cone = 300 px, aimed east
      const cone = buildAoEPolygon('cone', {
        anchor: { x: 0, y: 0 },
        target: { x: 500, y: 0 },
        sizeFeet: 30,
        ...base
      });
      expect(cone).not.toBeNull();
      expect(cone[0]).toEqual({ x: 0, y: 0 });
      // Farthest arc point should be ~300 px from origin
      const maxDist = Math.max(...cone.map((p) => Math.hypot(p.x, p.y)));
      expect(maxDist).toBeCloseTo(300, 0);
    });

    test('builds a circle centered on the target point with radius in px', () => {
      // 10-ft radius = 100 px
      const circle = buildAoEPolygon('circle', {
        anchor: { x: 0, y: 0 },
        target: { x: 200, y: 200 },
        sizeFeet: 10,
        ...base
      });
      expect(circle).not.toBeNull();
      circle.forEach((pt) => {
        expect(Math.hypot(pt.x - 200, pt.y - 200)).toBeCloseTo(100, 5);
      });
    });

    test('builds a line along the anchor-to-target direction with 5-ft width', () => {
      const line = buildAoEPolygon('line', {
        anchor: { x: 0, y: 0 },
        target: { x: 300, y: 0 },
        sizeFeet: 60, // 600 px long
        ...base
      });
      expect(line).not.toBeNull();
      expect(line.length).toBe(4);
      // 5-ft width = 50 px -> half-width 25
      expect(line[0].y).toBeCloseTo(-25);
      expect(line[1].y).toBeCloseTo(25);
      expect(line[2].x).toBeCloseTo(600);
    });

    test('builds a cube centered on the target point', () => {
      // 30-ft cube = 300 px side
      const cube = buildAoEPolygon('cube', {
        anchor: { x: 0, y: 0 },
        target: { x: 400, y: 400 },
        sizeFeet: 30,
        ...base
      });
      expect(cube).not.toBeNull();
      const xs = cube.map((p) => p.x);
      const ys = cube.map((p) => p.y);
      expect(Math.min(...xs)).toBeCloseTo(250);
      expect(Math.max(...xs)).toBeCloseTo(550);
      expect(Math.min(...ys)).toBeCloseTo(250);
      expect(Math.max(...ys)).toBeCloseTo(550);
    });

    test('returns null for unknown shape or invalid params', () => {
      expect(
        buildAoEPolygon('pentagram', { anchor: { x: 0, y: 0 }, target: { x: 1, y: 1 }, sizeFeet: 30, ...base })
      ).toBeNull();
      expect(
        buildAoEPolygon('cone', { anchor: null, target: { x: 1, y: 1 }, sizeFeet: 30, ...base })
      ).toBeNull();
      expect(
        buildAoEPolygon('cone', { anchor: { x: 0, y: 0 }, target: { x: 1, y: 1 }, sizeFeet: 0, ...base })
      ).toBeNull();
    });
  });
});
