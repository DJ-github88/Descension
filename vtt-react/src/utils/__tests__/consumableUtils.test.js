import { calculateResourceAdjustment, extractConsumableDuration } from '../consumableUtils';

describe('consumableUtils.calculateResourceAdjustment', () => {
  it('returns not-applied for invalid input', () => {
    expect(calculateResourceAdjustment({
      resourceType: 'health', amount: 0, currentResource: { current: 10, max: 20 }, item: {}
    })).toEqual({ applied: false, pendingOverheal: null });

    expect(calculateResourceAdjustment({
      resourceType: 'health', amount: 5, currentResource: null, item: {}
    })).toEqual({ applied: false, pendingOverheal: null });
  });

  it('applies a restore that stays within max', () => {
    expect(calculateResourceAdjustment({
      resourceType: 'health', amount: 5, currentResource: { current: 10, max: 20 }, item: {}
    })).toEqual({ applied: true, pendingOverheal: null });
  });

  it('flags overheal and reports the excess amount', () => {
    const item = { name: 'Potion' };
    const result = calculateResourceAdjustment({
      resourceType: 'health', amount: 15, currentResource: { current: 10, max: 20 }, item
    });

    expect(result.applied).toBe(false);
    expect(result.pendingOverheal).toMatchObject({
      resourceType: 'health',
      amount: 15,
      overhealAmount: 5,
      currentValue: 10,
      maxValue: 20
    });
    expect(result.pendingOverheal.item).toBe(item);
  });
});

describe('consumableUtils.extractConsumableDuration', () => {
  it('reads a duration from baseStats', () => {
    expect(extractConsumableDuration({ baseStats: { maxHealth: { duration: 30 } } })).toBe(30);
  });

  it('falls back to combatStats.maxHealth duration', () => {
    expect(extractConsumableDuration({ combatStats: { maxHealth: { duration: 45 } } })).toBe(45);
  });

  it('converts utilityStats durations (ROUNDS vs MINUTES)', () => {
    expect(extractConsumableDuration({ utilityStats: { duration: { value: 2, type: 'MINUTES' } } })).toBe(120);
    expect(extractConsumableDuration({ utilityStats: { duration: { value: 2, type: 'ROUNDS' } } })).toBe(12);
  });

  it('defaults to 60 seconds when no duration is present', () => {
    expect(extractConsumableDuration({})).toBe(60);
  });
});
