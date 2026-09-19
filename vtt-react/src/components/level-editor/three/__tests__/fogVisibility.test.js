import {
  WALL_EXPLORED_OPACITY,
  PROP_EXPLORED_OPACITY,
  createTileKeyResolver,
  fogProbeOffset,
  fogSamplesAlongSegment,
  fogSamplesAroundPoint,
  resolveSampleFogVisibility
} from '../fogVisibility';

const squareGridSystem = {
  worldToGrid: (x, y) => ({ x: Math.floor(x / 50), y: Math.floor(y / 50) })
};

describe('fogVisibility', () => {
  describe('createTileKeyResolver', () => {
    it('prefers the grid system and falls back to grid arithmetic', () => {
      const withGrid = createTileKeyResolver(squareGridSystem, 50, 0, 0);
      expect(withGrid(499, 251)).toBe('9,5');

      const withoutGrid = createTileKeyResolver(null, 50, 10, 20);
      expect(withoutGrid(499, 251)).toBe('9,4');
    });
  });

  describe('sample point generation', () => {
    it('probes both sides of a segment, including near its ends', () => {
      const samples = fogSamplesAlongSegment({
        centerX: 500, centerY: 250, ux: 0, uy: 1, halfLength: 25, offset: 15
      });
      expect(samples).toHaveLength(6);
      const xs = [...new Set(samples.map(s => s.x))].sort((a, b) => a - b);
      expect(xs).toEqual([485, 515]);
      const ys = [...new Set(samples.map(s => s.y))].sort((a, b) => a - b);
      expect(ys).toEqual([235, 250, 265]);
    });

    it('clamps the along-segment spread on short pieces', () => {
      const samples = fogSamplesAlongSegment({
        centerX: 100, centerY: 100, ux: 1, uy: 0, halfLength: 3, offset: 15
      });
      const xs = [...new Set(samples.map(s => s.x))].sort((a, b) => a - b);
      expect(xs).toEqual([97, 100, 103]);
    });

    it('probes the four cells around a point anchor plus the anchor', () => {
      const samples = fogSamplesAroundPoint(200, 300, 15);
      expect(samples).toHaveLength(5);
      expect(samples).toContainEqual({ x: 185, y: 285 });
      expect(samples).toContainEqual({ x: 215, y: 315 });
      expect(samples).toContainEqual({ x: 200, y: 300 });
    });

    it('keeps the probe offset under half a tile for props and over wall thickness', () => {
      const offset = fogProbeOffset(50);
      expect(offset).toBeGreaterThan(50 * 0.15);
      expect(offset * Math.SQRT2).toBeLessThan(25);
    });
  });

  describe('resolveSampleFogVisibility', () => {
    const tileKeyAt = (x, y) => `${Math.floor(x / 50)},${Math.floor(y / 50)}`;

    it('ignores fog when it is inactive', () => {
      const result = resolveSampleFogVisibility([{ x: 500, y: 250 }], {
        isFogActive: false,
        isPlayerPositionExplored: () => false,
        visibleAreaSet: new Set(),
        tileKeyAt
      });
      expect(result).toEqual({ isVisible: true, targetOpacity: 1, canCastShadow: true });
    });

    it('falls back to full visibility without probe points', () => {
      const result = resolveSampleFogVisibility(undefined, {
        isFogActive: true,
        isPlayerPositionExplored: () => false,
        visibleAreaSet: new Set(),
        tileKeyAt
      });
      expect(result).toEqual({ isVisible: true, targetOpacity: 1, canCastShadow: true });
    });

    it('keeps a frontier wall visible when any probe is explored', () => {
      // Wall on x=500; viewer is west (explored), east is unexplored.
      const result = resolveSampleFogVisibility(
        [{ x: 485, y: 250 }, { x: 515, y: 250 }],
        {
          isFogActive: true,
          isPlayerPositionExplored: (x) => x < 500,
          visibleAreaSet: new Set(),
          tileKeyAt,
          dimmedOpacity: WALL_EXPLORED_OPACITY
        }
      );
      expect(result.isVisible).toBe(true);
      expect(result.targetOpacity).toBeCloseTo(0.7);
    });

    it('lights the surface when any probe is in active vision', () => {
      const result = resolveSampleFogVisibility(
        [{ x: 485, y: 250 }, { x: 515, y: 250 }],
        {
          isFogActive: true,
          isPlayerPositionExplored: (x) => x < 500,
          visibleAreaSet: new Set(['9,5']),
          tileKeyAt
        }
      );
      expect(result.isVisible).toBe(true);
      expect(result.targetOpacity).toBe(1);
      expect(result.canCastShadow).toBe(true);
    });

    it('trusts active vision even when exploration lookups disagree', () => {
      const result = resolveSampleFogVisibility(
        [{ x: 485, y: 250 }],
        {
          isFogActive: true,
          isPlayerPositionExplored: () => false,
          visibleAreaSet: new Set(['9,5']),
          tileKeyAt
        }
      );
      expect(result).toEqual({ isVisible: true, targetOpacity: 1, canCastShadow: true });
    });

    it('hides the surface only when no probe is explored', () => {
      const result = resolveSampleFogVisibility(
        [{ x: 485, y: 250 }, { x: 515, y: 250 }],
        {
          isFogActive: true,
          isPlayerPositionExplored: () => false,
          visibleAreaSet: new Set(),
          tileKeyAt
        }
      );
      expect(result.isVisible).toBe(false);
      expect(result.canCastShadow).toBe(false);
    });

    it('honours activeVisionWhenUnset when no visible-area set exists', () => {
      const dimmed = resolveSampleFogVisibility([{ x: 25, y: 25 }], {
        isFogActive: true,
        isPlayerPositionExplored: () => true,
        visibleAreaSet: null,
        tileKeyAt,
        dimmedOpacity: PROP_EXPLORED_OPACITY,
        activeVisionWhenUnset: false
      });
      expect(dimmed.targetOpacity).toBeCloseTo(0.45);

      const lit = resolveSampleFogVisibility([{ x: 25, y: 25 }], {
        isFogActive: true,
        isPlayerPositionExplored: () => true,
        visibleAreaSet: null,
        tileKeyAt,
        activeVisionWhenUnset: true
      });
      expect(lit.targetOpacity).toBe(1);
    });
  });
});
