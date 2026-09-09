import diceUtils, { parseDiceString, rollDice, calculateDiceAverage, DiceRoll } from '../diceUtils';

describe('diceUtils with @dice-roller/rpg-dice-roller', () => {
  test('parses standard dice notation correctly', () => {
    const parsed = parseDiceString('2d6+3');
    expect(parsed.valid).toBe(true);
    expect(parsed.count).toBe(2);
    expect(parsed.sides).toBe(6);
    expect(parsed.modifier).toBe(3);
    expect(parsed.isFlat).toBe(false);
  });

  test('parses flat number correctly', () => {
    const parsed = parseDiceString('15');
    expect(parsed.valid).toBe(true);
    expect(parsed.isFlat).toBe(true);
    expect(parsed.modifier).toBe(15);
  });

  test('parses advanced notation (keep highest, exploding)', () => {
    const parsed = parseDiceString('4d6kh3');
    expect(parsed.valid).toBe(true);
    expect(parsed.isAdvanced).toBe(true);

    const exploding = parseDiceString('1d10!');
    expect(exploding.valid).toBe(true);
    expect(exploding.isAdvanced).toBe(true);
  });

  test('rolls standard dice and returns backward compatible structure', () => {
    const result = rollDice('2d6+3');
    expect(result.valid).toBe(true);
    expect(typeof result.total).toBe('number');
    expect(result.total).toBeGreaterThanOrEqual(5);
    expect(result.total).toBeLessThanOrEqual(15);
    expect(Array.isArray(result.dice)).toBe(true);
    expect(result.dice.length).toBe(2);
  });

  test('rolls advanced notation (4d6kh3)', () => {
    const result = rollDice('4d6kh3');
    expect(result.valid).toBe(true);
    expect(typeof result.total).toBe('number');
    expect(result.total).toBeGreaterThanOrEqual(3);
    expect(result.total).toBeLessThanOrEqual(18);
    expect(result.dice.length).toBe(4);
    expect(typeof result.breakdown).toBe('string');
  });

  test('calculates dice averages correctly', () => {
    const avg = calculateDiceAverage('1d20');
    expect(avg).toBe(10.5);

    const flatAvg = calculateDiceAverage('10');
    expect(flatAvg).toBe(10);
  });
});
