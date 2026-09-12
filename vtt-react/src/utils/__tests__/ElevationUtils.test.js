import {
  FEET_PER_ELEVATION_LEVEL,
  getTileElevation,
  getElevationAtWorld,
  levelToWorldHeight,
  feetToWorldHeight,
  getEyeHeightFeet,
  getRampAt,
  rampAllowsStep,
  canStepElevation,
  isSegmentOccludedByTerrain,
  clampElevationLevel
} from '../ElevationUtils';

const fakeSquareGridSystem = {
  worldToGrid: (x, y) => ({ x: Math.floor(x / 50), y: Math.floor(y / 50) })
};

describe('ElevationUtils', () => {
  describe('tile elevation helpers', () => {
    it('reads plain numbers, object levels, and unset tiles', () => {
      const data = { '0,0': 2, '1,0': { level: -3 }, '2,0': '4', '3,0': null };
      expect(getTileElevation(data, 0, 0)).toBe(2);
      expect(getTileElevation(data, 1, 0)).toBe(-3);
      expect(getTileElevation(data, 2, 0)).toBe(4);
      expect(getTileElevation(data, 3, 0)).toBe(0);
      expect(getTileElevation(data, 9, 9)).toBe(0);
      expect(getTileElevation(null, 0, 0)).toBe(0);
    });

    it('resolves elevation from world coordinates', () => {
      const data = { '2,1': 3 };
      expect(getElevationAtWorld(data, fakeSquareGridSystem, 125, 75)).toBe(3);
      expect(getElevationAtWorld(data, fakeSquareGridSystem, 25, 25)).toBe(0);
    });

    it('converts levels and feet to world heights', () => {
      expect(levelToWorldHeight(2, 50)).toBe(100);
      expect(feetToWorldHeight(10, 50, 5)).toBe(100);
      expect(getEyeHeightFeet(2, 5)).toBe(2 * FEET_PER_ELEVATION_LEVEL + 5);
    });

    it('clamps elevation levels to the allowed range', () => {
      expect(clampElevationLevel(999)).toBe(20);
      expect(clampElevationLevel(-999)).toBe(-10);
      expect(clampElevationLevel(3.6)).toBe(4);
      expect(clampElevationLevel('bogus')).toBe(0);
    });
  });

  describe('ramp handling', () => {
    it('normalizes string and object ramp entries', () => {
      const rampData = { '0,0': 'e', '1,0': { dir: 'w', type: 'stairs' } };
      expect(getRampAt(rampData, 0, 0)).toEqual({ dir: 'e', type: 'ramp' });
      expect(getRampAt(rampData, 1, 0)).toEqual({ dir: 'w', type: 'stairs' });
      expect(getRampAt(rampData, 5, 5)).toBeNull();
    });

    it('allows a step when a ramp connects the tiles in either direction', () => {
      const toward = { '0,0': { dir: 'e' } };
      expect(rampAllowsStep(toward, { x: 0, y: 0 }, { x: 1, y: 0 })).toBe(true);
      expect(rampAllowsStep(toward, { x: 1, y: 0 }, { x: 0, y: 0 })).toBe(true);

      const away = { '0,0': { dir: 'w' } };
      expect(rampAllowsStep(away, { x: 0, y: 0 }, { x: 1, y: 0 })).toBe(false);
      expect(rampAllowsStep(away, { x: 1, y: 0 }, { x: 0, y: 0 })).toBe(false);

      const fromHighSide = { '1,0': { dir: 'w' } };
      expect(rampAllowsStep(fromHighSide, { x: 0, y: 0 }, { x: 1, y: 0 })).toBe(true);
      expect(rampAllowsStep(fromHighSide, { x: 1, y: 0 }, { x: 0, y: 0 })).toBe(true);
    });
  });

  describe('canStepElevation', () => {
    it('allows flat moves and 1-level steps for free', () => {
      const elevationData = { '1,0': 1 };
      expect(canStepElevation({ elevationData, from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }))
        .toMatchObject({ allowed: true, cost: 1, blockedReason: null, delta: 1 });
      expect(canStepElevation({ elevationData, from: { x: 1, y: 0 }, to: { x: 0, y: 0 } }))
        .toMatchObject({ allowed: true, cost: 1, delta: -1 });
    });

    it('blocks steps larger than one level without a ramp', () => {
      const elevationData = { '1,0': 3 };
      const result = canStepElevation({ elevationData, from: { x: 0, y: 0 }, to: { x: 1, y: 0 } });
      expect(result.allowed).toBe(false);
      expect(result.blockedReason).toBe('elevation');
      expect(result.cost).toBe(Infinity);
    });

    it('allows large steps when a ramp connects the tiles', () => {
      const elevationData = { '1,0': 3 };
      const rampData = { '1,0': { dir: 'w' } };
      const result = canStepElevation({ elevationData, rampData, from: { x: 0, y: 0 }, to: { x: 1, y: 0 } });
      expect(result.allowed).toBe(true);
      expect(result.delta).toBe(3);
    });
  });

  describe('isSegmentOccludedByTerrain', () => {
    it('does not occlude across flat terrain', () => {
      const result = isSegmentOccludedByTerrain({
        fromWorld: { x: 25, y: 25 },
        toWorld: { x: 225, y: 25 },
        fromEyeFeet: 5,
        toEyeFeet: 5,
        elevationData: {},
        gridSystem: fakeSquareGridSystem
      });
      expect(result.occluded).toBe(false);
    });

    it('occludes when a raised tile rises above the sight line', () => {
      // Tile (2,0) is a 3-level pillar (15ft) between two ground-level eyes (5ft).
      const elevationData = { '2,0': 3 };
      const result = isSegmentOccludedByTerrain({
        fromWorld: { x: 25, y: 25 },
        toWorld: { x: 225, y: 25 },
        fromEyeFeet: 5,
        toEyeFeet: 5,
        elevationData,
        gridSystem: fakeSquareGridSystem
      });
      expect(result.occluded).toBe(true);
      expect(result.tile).toEqual({ x: 2, y: 0 });
      expect(result.topFeet).toBe(15);
    });

    it('lets a high vantage see over a low wall', () => {
      // Viewer on a 3-level hill (eye 20ft), target at ground (eye 5ft), a 1-level
      // (5ft) ridge halfway should not block the descending sight line.
      const elevationData = { '2,0': 1 };
      const result = isSegmentOccludedByTerrain({
        fromWorld: { x: 25, y: 25 },
        toWorld: { x: 425, y: 25 },
        fromEyeFeet: 20,
        toEyeFeet: 5,
        elevationData,
        gridSystem: fakeSquareGridSystem
      });
      expect(result.occluded).toBe(false);
    });

    it('accounts for structure heights on top of terrain', () => {
      const result = isSegmentOccludedByTerrain({
        fromWorld: { x: 25, y: 25 },
        toWorld: { x: 225, y: 25 },
        fromEyeFeet: 5,
        toEyeFeet: 5,
        elevationData: {},
        structureHeights: { '1,0': 10 },
        gridSystem: fakeSquareGridSystem
      });
      expect(result.occluded).toBe(true);
      expect(result.tile).toEqual({ x: 1, y: 0 });
    });

    it('lets viewers in a pit be occluded by the pit rim', () => {
      // Viewer in a pit: ground level -2 (eye -10 + 5 = -5ft). The rim tile
      // between the viewer and a distant target is at ground 0 (top 0ft),
      // which is above the rising sight line at that point.
      const elevationData = { '1,0': 0, '3,0': 0 };
      // Pit tile at (2,0) does not matter; test viewer at (1,0) ground and target at (3,0).
      // Instead simulate: viewer tile -2, rim tile 0 between them.
      const data = { '-1,0': -2, '0,0': 0 };
      const result = isSegmentOccludedByTerrain({
        fromWorld: { x: -25, y: 25 }, // tile -1,0
        toWorld: { x: 225, y: 25 }, // tile 4,0
        fromEyeFeet: getEyeHeightFeet(-2, 5),
        toEyeFeet: 5,
        elevationData: data,
        gridSystem: fakeSquareGridSystem
      });
      expect(elevationData).toBeDefined();
      expect(result.occluded).toBe(true);
      expect(result.tile).toEqual({ x: 0, y: 0 });
    });
  });
});
