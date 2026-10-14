import { getItemThematicExcerpt } from '../lootItemUtils';

describe('getItemThematicExcerpt', () => {
  test('returns empty string for null or undefined item', () => {
    expect(getItemThematicExcerpt(null)).toBe('');
    expect(getItemThematicExcerpt(undefined)).toBe('');
    expect(getItemThematicExcerpt({})).toBe('');
  });

  test('extracts first sentence from multi-sentence description (Crude Idol case)', () => {
    const crudeIdol = {
      name: 'Crude Idol',
      description: 'A roughly carved stone idol, barely recognizable. Channels sacred power weakly, like a prayer half-remembered.'
    };
    expect(getItemThematicExcerpt(crudeIdol)).toBe('A roughly carved stone idol, barely recognizable.');
  });

  test('extracts single-sentence description cleanly', () => {
    const item = {
      name: 'Glowing Amber',
      description: 'A warm fossilized resin that pulsates with faint firelight.'
    };
    expect(getItemThematicExcerpt(item)).toBe('A warm fossilized resin that pulsates with faint firelight.');
  });

  test('prefers flavorText when available', () => {
    const item = {
      name: 'Shadow Dagger',
      description: 'A dagger forged from obsidian. Deals extra damage from behind.',
      flavorText: 'Whispers follow in its silent wake.'
    };
    expect(getItemThematicExcerpt(item)).toBe('Whispers follow in its silent wake.');
  });

  test('falls back to weapon damage and subtype when no description is present', () => {
    const item = {
      name: 'Iron Longsword',
      type: 'weapon',
      subtype: 'SWORD',
      weaponStats: {
        baseDamage: {
          diceCount: 1,
          diceType: 'd8',
          bonusDamage: 2,
          damageType: 'slashing'
        }
      }
    };
    expect(getItemThematicExcerpt(item)).toBe('Sword · 1d8+2 slashing damage');
  });

  test('falls back to armor bonus when no description is present', () => {
    const item = {
      name: 'Studded Leather',
      type: 'armor',
      subtype: 'LEATHER',
      armorStats: {
        armorBonus: 3
      }
    };
    expect(getItemThematicExcerpt(item)).toBe('Leather · +3 AC');
  });

  test('strips HTML tags from descriptions', () => {
    const item = {
      name: 'Alchemical Draught',
      description: '<p>A <strong>pungent</strong> green draft with bubbling foam.</p>'
    };
    expect(getItemThematicExcerpt(item)).toBe('A pungent green draft with bubbling foam.');
  });
});
