import { cleanFormula } from '../spellFormatterUtils';

describe('cleanFormula damage formula formatting', () => {
  it('renders attribute modifier placeholders as "<Attribute> Mod"', () => {
    expect(cleanFormula('1d4 + agility_modifier')).toBe('1d4 + Agility Mod');
    expect(cleanFormula('1d6 + strength_modifier')).toBe('1d6 + Strength Mod');
    expect(cleanFormula('2d6 + intelligence_modifier')).toBe('2d6 + Intelligence Mod');
    expect(cleanFormula('1d8 + spirit_modifier')).toBe('1d8 + Spirit Mod');
  });

  it('renders the generic weapon attack modifier placeholder as "Attribute Mod"', () => {
    expect(cleanFormula('1d8 + attribute_modifier')).toBe('1d8 + Attribute Mod');
  });

  it('renders bare attribute tokens as "<Attribute> Mod" (never the raw score)', () => {
    expect(cleanFormula('1d4 + agility')).toBe('1d4 + Agility Mod');
    expect(cleanFormula('1d8 + spirit')).toBe('1d8 + Spirit Mod');
    expect(cleanFormula('8d6+INT')).toBe('8d6 + Intelligence Mod');
    expect(cleanFormula('2d6 + strength + spirit')).toBe('2d6 + Strength Mod + Spirit Mod');
  });
});
