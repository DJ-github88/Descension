import {
  getXPForLevel,
  getLevelFromXP,
  getXPProgress,
  checkLevelUp,
  getXPSegments,
  getLevelUpRewards,
  formatXP
} from '../experienceUtils';

describe('experienceUtils', () => {
  describe('getXPForLevel', () => {
    it('returns total XP thresholds from the table', () => {
      expect(getXPForLevel(1)).toBe(0);
      expect(getXPForLevel(2)).toBe(300);
      expect(getXPForLevel(10)).toBe(64000);
    });

    it('clamps below level 1 and above the level cap', () => {
      expect(getXPForLevel(0)).toBe(0);
      expect(getXPForLevel(99)).toBe(64000);
    });
  });

  describe('getLevelFromXP', () => {
    it('maps XP to the correct level at boundaries', () => {
      expect(getLevelFromXP(0)).toBe(1);
      expect(getLevelFromXP(299)).toBe(1);
      expect(getLevelFromXP(300)).toBe(2);
      expect(getLevelFromXP(899)).toBe(2);
      expect(getLevelFromXP(900)).toBe(3);
      expect(getLevelFromXP(64000)).toBe(10);
      expect(getLevelFromXP(999999)).toBe(10);
    });

    it('treats negative XP as level 1', () => {
      expect(getLevelFromXP(-50)).toBe(1);
    });
  });

  describe('getXPProgress', () => {
    it('reports max level at the cap', () => {
      const p = getXPProgress(64000);
      expect(p.isMaxLevel).toBe(true);
      expect(p.percentage).toBe(100);
    });

    it('reports partial progress within a level', () => {
      // Level 1 spans 0..300; 150 XP => 50%
      const p = getXPProgress(150);
      expect(p.currentLevel).toBe(1);
      expect(p.xpIntoLevel).toBe(150);
      expect(p.xpNeededForLevel).toBe(300);
      expect(p.percentage).toBe(50);
      expect(p.isMaxLevel).toBe(false);
    });
  });

  describe('checkLevelUp', () => {
    it('reports multiple levels gained across a big jump', () => {
      const r = checkLevelUp(0, 900); // level 1 -> 3
      expect(r.didLevelUp).toBe(true);
      expect(r.levelsGained).toBe(2);
    });

    it('reports no level up within the same bracket', () => {
      const r = checkLevelUp(0, 100);
      expect(r.didLevelUp).toBe(false);
      expect(r.levelsGained).toBe(0);
    });
  });

  describe('getLevelUpRewards', () => {
    it('grants attribute points at levels divisible by 4 and features at 5/10', () => {
      expect(getLevelUpRewards(3).attributePoints).toBe(0);
      expect(getLevelUpRewards(4).attributePoints).toBe(2);
      expect(getLevelUpRewards(5).specialFeatures).toContain('Extra Attack');
      expect(getLevelUpRewards(10).specialFeatures).toContain('Epic Boon');
      expect(getLevelUpRewards(4).talentPoints).toBe(5);
    });
  });

  describe('getXPSegments / formatXP', () => {
    it('fills the right number of 10% segments', () => {
      expect(getXPSegments(0).filter(Boolean)).toHaveLength(0);
      expect(getXPSegments(55).filter(Boolean)).toHaveLength(5);
      expect(getXPSegments(100).filter(Boolean)).toHaveLength(10);
    });

    it('formats XP with thousands separators', () => {
      expect(formatXP(64000)).toBe('64,000');
    });
  });
});
