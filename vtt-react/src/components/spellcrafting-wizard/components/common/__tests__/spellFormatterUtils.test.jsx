import {
  formatSpellTitleCase,
  extractSpellResourceCosts,
  extractSpellSchool,
  extractSpellRange,
  extractSpellActionBadge,
  extractSpellSpecialMechanics,
  extractSpellStatline,
  formatSpellRomanCategory
} from '../spellFormatterUtils';
import { resolveOriginalSpell } from '../../../../../services/spellConsequence';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import useResourceFormatters from '../useResourceFormatters';

describe('spellFormatterUtils - Authentic Grimoire Formatting', () => {
  describe('formatSpellTitleCase', () => {
    it('properly title-cases words, hyphens, and underscores', () => {
      expect(formatSpellTitleCase('primal')).toBe('Primal');
      expect(formatSpellTitleCase('arcane_energy')).toBe('Arcane Energy');
      expect(formatSpellTitleCase('fire-damage')).toBe('Fire Damage');
      expect(formatSpellTitleCase('')).toBe('');
      expect(formatSpellTitleCase(null)).toBe('');
    });
  });

  describe('formatSpellRomanCategory', () => {
    it('converts level numbers to Roman numerals', () => {
      expect(formatSpellRomanCategory('Level 1')).toBe('Level I');
      expect(formatSpellRomanCategory('Level 2')).toBe('Level II');
      expect(formatSpellRomanCategory('Level 4')).toBe('Level IV');
      expect(formatSpellRomanCategory('Level 10')).toBe('Level X');
      expect(formatSpellRomanCategory('Cantrips')).toBe('Cantrips');
    });
  });

  describe('extractSpellResourceCosts (All resources used)', () => {
    it('Resolving Strike displays the two-pitch recipe without changing the locked redundant cost', () => {
      const spell = resolveOriginalSpell('Minstrel', 'minstrel_resolving_strike');
      expect(extractSpellResourceCosts(spell)).toEqual(['4 Mana', '2 Musical Notes (I×1, V×1)']);
      expect(spell.resourceCost.resourceValues.classResource.cost).toBe(3);
      const badges = renderToStaticMarkup(useResourceFormatters({ spell }).formatResourceCosts());
      expect(badges).toContain('-Tonic (I)');
      expect(badges).toContain('-Dominant (V)');
      expect(badges).not.toContain('Costs 3');
    });
    it('extracts single mana cost', () => {
      const spell = { resourceCost: { resourceValues: { mana: 4 } } };
      expect(extractSpellResourceCosts(spell)).toEqual(['4 Mana']);
    });

    it('extracts single health cost', () => {
      const spell = { resourceCost: { resourceValues: { health: 2 } } };
      expect(extractSpellResourceCosts(spell)).toEqual(['2 HP']);
    });

    it('extracts multiple resources used simultaneously (Mana + HP + Class Resource)', () => {
      const spell = {
        resourceCost: {
          resourceValues: { mana: 4, health: 2 },
          classResource: { name: 'Rage', gain: 10 }
        }
      };
      expect(extractSpellResourceCosts(spell)).toEqual(['4 Mana', '2 HP', '+10 Rage']);
    });

    it('extracts stamina and custom resources like blood tokens or soul shards', () => {
      const spell = {
        resourceCost: {
          resourceValues: {
            stamina: 3,
            bloodTokens: 2,
            soulShards: 1
          }
        }
      };
      expect(extractSpellResourceCosts(spell)).toEqual(['3 Stamina', '2 Blood Tokens', '1 Soul Shards']);
    });

    it('extracts combo points from resourceOptions', () => {
      const spell = {
        resourceOptions: {
          comboPoints: { generates: 2 }
        }
      };
      expect(extractSpellResourceCosts(spell)).toEqual(['+2 Combo Points']);
    });
  });

  describe('extractSpellSchool', () => {
    it('extracts and capitalizes school from typeConfig or damageConfig', () => {
      expect(extractSpellSchool({ typeConfig: { school: 'arcane' } })).toBe('Arcane');
      expect(extractSpellSchool({ damageConfig: { damageTypes: ['ember'] } })).toBe('Ember');
      expect(extractSpellSchool({ damageType: 'smashing' })).toBe('Smashing');
      expect(extractSpellSchool({})).toBeNull();
    });
  });

  describe('extractSpellRange', () => {
    it('extracts range with proper formatting', () => {
      expect(extractSpellRange({ targetingConfig: { rangeType: 'self' } })).toBe('Self');
      expect(extractSpellRange({ targetingConfig: { rangeType: 'touch' } })).toBe('Touch');
      expect(extractSpellRange({ targetingConfig: { rangeDistance: 30 } })).toBe('30 ft');
      expect(extractSpellRange({ targetingConfig: { rangeType: 'melee', rangeDistance: 5 } })).toBe('5 ft Melee');
    });
  });

  describe('extractSpellActionBadge', () => {
    it('extracts action type badges correctly', () => {
      expect(extractSpellActionBadge({ spellType: 'ACTION' })).toEqual({ label: 'Action', key: 'action' });
      expect(extractSpellActionBadge({ spellType: 'REACTION' })).toEqual({ label: 'Reaction', key: 'reaction' });
      expect(extractSpellActionBadge({ spellType: 'FREE_ACTION' })).toEqual({ label: 'Free Action', key: 'free-action' });
      expect(extractSpellActionBadge({ spellType: 'PASSIVE' })).toEqual({ label: 'Passive', key: 'passive' });
    });
  });

  describe('extractSpellSpecialMechanics', () => {
    it('formats Inferno and Musical Combo mechanics', () => {
      const spell = {
        specialMechanics: {
          infernoLevel: { required: 2 },
          musicalCombo: { type: 'builder' }
        }
      };
      expect(extractSpellSpecialMechanics(spell)).toEqual([
        { type: 'inferno', text: 'Inferno II' },
        { type: 'combo', text: 'Builder' }
      ]);
    });
  });

  describe('extractSpellStatline', () => {
    it('composes a full statline including all resources used and special mechanics', () => {
      const spell = {
        typeConfig: { school: 'arcane' },
        targetingConfig: { rangeDistance: 60 },
        resourceCost: {
          resourceValues: { mana: 4 },
          classResource: { name: 'AEP', gain: 2 }
        },
        specialMechanics: {
          infernoLevel: { required: 1 }
        }
      };

      const statline = extractSpellStatline(spell);
      expect(statline).toEqual([
        { type: 'school', text: 'Arcane' },
        { type: 'range', text: '60 ft' },
        { type: 'cost', text: '4 Mana' },
        { type: 'cost', text: '+2 AEP' },
        { type: 'inferno', text: 'Inferno I' }
      ]);
    });

    it('formats Pyrofiend Flicker without [object Object], without duplicate ascend and without Inferno 0', () => {
      const flickerSpell = {
        name: 'Flicker',
        typeConfig: { school: 'ember' },
        targetingConfig: { rangeDistance: 60 },
        resourceCost: {
          actionPoints: 2,
          resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
          resourceValues: {
            mana: 3,
            inferno_ascend: 1,
            inferno_required: 0,
            classResource: { type: 'inferno_veil', gain: 1 }
          }
        }
      };

      const statline = extractSpellStatline(flickerSpell);
      expect(statline).toEqual([
        { type: 'school', text: 'Ember' },
        { type: 'range', text: '60 ft' },
        { type: 'cost', text: '3 Mana' },
        { type: 'cost', text: '+1 Inferno Veil' }
      ]);

      const texts = statline.map(item => item.text);
      expect(texts).not.toContain('[object Object] Class Resource');
      expect(texts).not.toContain('Inferno 0');
    });
  });
});
