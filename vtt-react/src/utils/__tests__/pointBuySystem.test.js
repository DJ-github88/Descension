import {
  POINT_BUY_CONFIG,
  getStatPointCost,
  calculateTotalPointsSpent,
  calculateAvailablePoints,
  canIncreaseStat,
  canDecreaseStat,
  increaseStat,
  decreaseStat
} from '../pointBuySystem';

describe('pointBuySystem', () => {
  const allBase = {
    strength: 5, agility: 5, constitution: 5,
    intelligence: 5, spirit: 5, charisma: 5
  };

  describe('getStatPointCost', () => {
    it('returns the cumulative cost for a value (base 5 = 0)', () => {
      expect(getStatPointCost(5)).toBe(0);
      expect(getStatPointCost(6)).toBe(1);
      expect(getStatPointCost(10)).toBe(5);
      expect(getStatPointCost(15)).toBe(19);
    });

    it('returns 0 for unknown values', () => {
      expect(getStatPointCost(999)).toBe(0);
    });
  });

  describe('calculateTotalPointsSpent', () => {
    it('is 0 when every stat is at the base value', () => {
      expect(calculateTotalPointsSpent(allBase)).toBe(0);
    });

    it('sums the per-stat costs', () => {
      expect(calculateTotalPointsSpent({ ...allBase, strength: 6 })).toBe(1);
      expect(calculateTotalPointsSpent({ ...allBase, strength: 10, agility: 7 })).toBe(5 + 2);
    });
  });

  describe('calculateAvailablePoints', () => {
    it('starts at the base pool and subtracts spend', () => {
      expect(calculateAvailablePoints(allBase)).toBe(POINT_BUY_CONFIG.BASE_POINT_POOL);
      expect(calculateAvailablePoints({ ...allBase, strength: 10 }))
        .toBe(POINT_BUY_CONFIG.BASE_POINT_POOL - 5);
    });

    it('adds bonus pools (race/background/path)', () => {
      expect(calculateAvailablePoints(allBase, { race: 2, background: 3 }))
        .toBe(POINT_BUY_CONFIG.BASE_POINT_POOL + 5);
    });
  });

  describe('canIncreaseStat', () => {
    it('allows an increase when points remain', () => {
      expect(canIncreaseStat(allBase, 'strength')).toBe(true);
    });

    it('blocks increases at the max stat value', () => {
      expect(canIncreaseStat({ ...allBase, strength: POINT_BUY_CONFIG.MAX_STAT_VALUE }, 'strength')).toBe(false);
    });

    it('blocks an increase when the budget is exhausted', () => {
      // 14 costs 15 points => 0 remaining, so any further +1 is unaffordable.
      const spent = { ...allBase, strength: 14 };
      expect(calculateAvailablePoints(spent)).toBe(0);
      expect(canIncreaseStat(spent, 'agility')).toBe(false);
    });
  });

  describe('increaseStat / decreaseStat', () => {
    it('increments when allowed and is a no-op otherwise', () => {
      const inc = increaseStat(allBase, 'strength');
      expect(inc.strength).toBe(6);
      // at max, returns the same object reference
      const maxed = { ...allBase, strength: POINT_BUY_CONFIG.MAX_STAT_VALUE };
      expect(increaseStat(maxed, 'strength')).toBe(maxed);
    });

    it('decrements only above the minimum', () => {
      expect(canDecreaseStat(allBase, 'strength')).toBe(false);
      expect(decreaseStat({ ...allBase, strength: 6 }, 'strength').strength).toBe(5);
    });
  });
});
