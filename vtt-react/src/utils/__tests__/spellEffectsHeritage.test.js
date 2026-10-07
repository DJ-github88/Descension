import { applySpellEffects } from '../spellEffects';

const fireSpell = { id: 'test_bolt', damage: { base: '2d6' }, effects: [] };

test('a native heritage capability fires only when the caster supplies its condition', () => {
  const caster = { level: 1, attributes: {}, class: 'Berserker', race: 'human', subrace: 'skald_human' };
  const fired = applySpellEffects(fireSpell, { ...caster, heritageContext: { target: 'endangered_ally' } });
  expect(fired.heritage.applies).toBe(true);
  expect(fired.heritage.capabilities).toContain('rapid_response_to_endangered_ally');
  expect(fired.effects.some(effect => effect.type === 'heritage')).toBe(true);

  const idle = applySpellEffects(fireSpell, caster);
  expect(idle.heritage.applies).toBe(false);
  expect(idle.effects.some(effect => effect.type === 'heritage')).toBe(false);
});

test('a character with no authored heritage edge carries a reason, not an effect', () => {
  const caster = { level: 1, attributes: {}, class: 'Berserker', race: 'mimir', subrace: 'veiled_mimir' };
  const result = applySpellEffects(fireSpell, caster);
  expect(result.heritage).toMatchObject({ applies: false, reason: 'no-edge' });
  expect(result.effects.some(effect => effect.type === 'heritage')).toBe(false);
});

test('a plain spell object without character identity is unaffected', () => {
  const result = applySpellEffects(fireSpell, { level: 3, attributes: { intelligence: 14 } });
  expect(result.heritage).toBeUndefined();
  expect(result.damage).toBeGreaterThan(0);
});
