import {
  RAMP_DIRECTION_DELTAS,
  getRampDirectionDelta,
  getSquareRampEdges,
  getRampStepCount,
  getRampBands
} from '../RampGeometry';

describe('RampGeometry', () => {
  describe('getRampDirectionDelta', () => {
    it('maps each direction to a neighbor offset', () => {
      expect(getRampDirectionDelta('n')).toEqual({ x: 0, y: -1 });
      expect(getRampDirectionDelta('s')).toEqual({ x: 0, y: 1 });
      expect(getRampDirectionDelta('e')).toEqual({ x: 1, y: 0 });
      expect(getRampDirectionDelta('w')).toEqual({ x: -1, y: 0 });
    });

    it('falls back to east for unknown directions', () => {
      expect(getRampDirectionDelta('up')).toEqual(RAMP_DIRECTION_DELTAS.e);
      expect(getRampDirectionDelta(undefined)).toEqual(RAMP_DIRECTION_DELTAS.e);
    });
  });

  describe('getSquareRampEdges', () => {
    const base = { worldX: 100, worldY: 200, gridSize: 50 };

    it('puts the near edge on the neighbor side for each direction', () => {
      expect(getSquareRampEdges({ ...base, dir: 'n' })).toEqual({
        nearA: { x: 100, y: 200 }, nearB: { x: 150, y: 200 },
        farA: { x: 100, y: 250 }, farB: { x: 150, y: 250 }
      });
      expect(getSquareRampEdges({ ...base, dir: 's' })).toEqual({
        nearA: { x: 100, y: 250 }, nearB: { x: 150, y: 250 },
        farA: { x: 100, y: 200 }, farB: { x: 150, y: 200 }
      });
      expect(getSquareRampEdges({ ...base, dir: 'e' })).toEqual({
        nearA: { x: 150, y: 200 }, nearB: { x: 150, y: 250 },
        farA: { x: 100, y: 200 }, farB: { x: 100, y: 250 }
      });
      expect(getSquareRampEdges({ ...base, dir: 'w' })).toEqual({
        nearA: { x: 100, y: 200 }, nearB: { x: 100, y: 250 },
        farA: { x: 150, y: 200 }, farB: { x: 150, y: 250 }
      });
    });
  });

  describe('getRampStepCount', () => {
    it('scales with the height difference and clamps to 2-8', () => {
      expect(getRampStepCount(50, 50)).toBe(2);
      expect(getRampStepCount(100, 50)).toBe(4);
      expect(getRampStepCount(300, 50)).toBe(8);
      expect(getRampStepCount(10, 50)).toBe(3);
    });
  });

  describe('getRampBands', () => {
    it('returns one sloped band for ramps', () => {
      expect(getRampBands({ selfZ: 0, targetZ: 100 })).toEqual([
        { t0: 0, t1: 1, farZ: 0, nearZ: 100 }
      ]);
      expect(getRampBands({ selfZ: 100, targetZ: 0, type: 'ramp' })).toEqual([
        { t0: 0, t1: 1, farZ: 100, nearZ: 0 }
      ]);
    });

    it('steps ascending stairs up to the target level on the near edge', () => {
      const bands = getRampBands({ selfZ: 0, targetZ: 100, type: 'stairs', steps: 4 });
      expect(bands.map(b => b.farZ)).toEqual([25, 50, 75, 100]);
      expect(bands.every(b => b.farZ === b.nearZ)).toBe(true);
      expect(bands.map(b => [b.t0, b.t1])).toEqual([[0, 0.25], [0.25, 0.5], [0.5, 0.75], [0.75, 1]]);
    });

    it('starts descending stairs at the tile ground and steps down', () => {
      const bands = getRampBands({ selfZ: 100, targetZ: 0, type: 'stairs', steps: 4 });
      expect(bands.map(b => b.farZ)).toEqual([100, 75, 50, 25]);
    });

    it('clamps the step count', () => {
      expect(getRampBands({ selfZ: 0, targetZ: 50, type: 'stairs', steps: 0 })).toHaveLength(4);
      expect(getRampBands({ selfZ: 0, targetZ: 50, type: 'stairs', steps: 99 })).toHaveLength(8);
    });
  });
});
