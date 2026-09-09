import enhancedDiceService from '../enhancedDiceService';

describe('enhancedDiceService with rpg-dice-roller', () => {
  test('rolls standard notation and returns full rollData contract', async () => {
    const roll = await enhancedDiceService.rollDice('1d20+5', {
      playerName: 'Hero',
      description: 'Attack Roll'
    });

    expect(roll).toBeDefined();
    expect(roll.id).toMatch(/^roll_/);
    expect(roll.playerName).toBe('Hero');
    expect(roll.originalNotation).toBe('1d20+5');
    expect(typeof roll.finalTotal).toBe('number');
    expect(typeof roll.total).toBe('number');
    expect(roll.finalTotal).toBeGreaterThanOrEqual(6);
    expect(roll.finalTotal).toBeLessThanOrEqual(25);
    expect(Array.isArray(roll.results)).toBe(true);
    expect(typeof roll.breakdown).toBe('string');
    expect(typeof roll.isCritical).toBe('boolean');
    expect(typeof roll.isFumble).toBe('boolean');
  });

  test('rolls advantage by rolling 2d20kh1', async () => {
    const roll = await enhancedDiceService.rollDice('1d20+3', {
      advantage: true
    });

    expect(roll.advantage).toBe(true);
    expect(roll.notation).toContain('kh1');
    expect(roll.results.length).toBe(2);
    // At least one result kept, one dropped
    const kept = roll.results.filter(r => r.kept);
    const dropped = roll.results.filter(r => !r.kept);
    expect(kept.length).toBe(1);
    expect(dropped.length).toBe(1);
  });

  test('rolls complex notation (4d6kh3) with breakdown', async () => {
    const roll = await enhancedDiceService.rollDice('4d6kh3', {
      playerName: 'Player1'
    });

    expect(roll.finalTotal).toBeGreaterThanOrEqual(3);
    expect(roll.finalTotal).toBeLessThanOrEqual(18);
    expect(roll.results.length).toBe(4);
    const kept = roll.results.filter(r => r.kept);
    expect(kept.length).toBe(3);
  });
});
