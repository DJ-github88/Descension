import {
  formatItemValueText,
  getItemDamageText,
  getItemArmorText,
  getPageNumbers
} from '../LibraryBrowserModal';

describe('LibraryBrowserModal Helper Functions', () => {
  describe('formatItemValueText', () => {
    it('handles null, undefined, and zero values gracefully', () => {
      expect(formatItemValueText(null)).toBeNull();
      expect(formatItemValueText(undefined)).toBeNull();
      expect(formatItemValueText(0)).toBeNull();
      expect(formatItemValueText('0')).toBeNull();
      expect(formatItemValueText('0g')).toBeNull();
      expect(formatItemValueText('0 Gold')).toBeNull();
      expect(formatItemValueText({ platinum: 0, gold: 0, silver: 0, copper: 0 })).toBeNull();
      expect(formatItemValueText({ amount: 0, currency: 'Gold' })).toBeNull();
    });

    it('formats multi-currency objects accurately', () => {
      expect(formatItemValueText({ platinum: 0, gold: 11, silver: 75, copper: 50 })).toBe('11g 75s 50c');
      expect(formatItemValueText({ platinum: 0, gold: 5, silver: 0, copper: 0 })).toBe('5 Gold');
      expect(formatItemValueText({ platinum: 0, gold: 0, silver: 50, copper: 0 })).toBe('50 Silver');
      expect(formatItemValueText({ platinum: 0, gold: 0, silver: 0, copper: 25 })).toBe('25 Copper');
      expect(formatItemValueText({ platinum: 2, gold: 0, silver: 0, copper: 0 })).toBe('2 Plat');
      expect(formatItemValueText({ platinum: 1, gold: 5, silver: 0, copper: 0 })).toBe('1p 5g');
    });

    it('formats numbers and strings', () => {
      expect(formatItemValueText(100)).toBe('100 Gold');
      expect(formatItemValueText('50 Gold')).toBe('50 Gold');
      expect(formatItemValueText({ amount: 75, currency: 'Gold' })).toBe('75 Gold');
    });
  });

  describe('getItemDamageText', () => {
    it('returns damage from damageText, damage object, or weaponStats', () => {
      expect(getItemDamageText({ damageText: '1d8 Slashing' })).toBe('1d8 Slashing');
      expect(getItemDamageText({ damage: '2d6 fire' })).toBe('2d6 fire');
      expect(getItemDamageText({ damage: { dice: '1d6', type: 'piercing' } })).toBe('1d6 piercing');
      expect(getItemDamageText({
        weaponStats: {
          baseDamage: {
            diceCount: 1,
            diceType: 6,
            damageType: 'ember'
          }
        }
      })).toBe('1d6 ember');
      expect(getItemDamageText({
        weaponStats: {
          baseDamage: {
            diceCount: 2,
            diceType: 'd4',
            bonusDamage: 1,
            damageType: 'slashing'
          }
        }
      })).toBe('2d4 +1 slashing');
    });
  });

  describe('getItemArmorText', () => {
    it('returns formatted AC from various armor stats', () => {
      expect(getItemArmorText({ armorText: '+3 AC' })).toBe('+3 AC');
      expect(getItemArmorText({ armorClass: 2 })).toBe('+2 AC');
      expect(getItemArmorText({ ac: 4 })).toBe('+4 AC');
      expect(getItemArmorText({ baseStats: { armorClass: { value: 3 } } })).toBe('+3 AC');
    });
  });

  describe('getPageNumbers', () => {
    it('generates page number arrays with ellipsis for pagination', () => {
      expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, 5, '...', 10]);
      expect(getPageNumbers(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
      expect(getPageNumbers(9, 10)).toEqual([1, '...', 6, 7, 8, 9, 10]);
    });
  });
});
