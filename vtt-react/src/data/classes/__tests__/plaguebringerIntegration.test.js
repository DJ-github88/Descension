import {
  PLAGUEBRINGER_DATA,
  PLAGUEBRINGER_CORE_SPELL_IDS,
  PLAGUEBRINGER_OPTIONAL_RECORDS,
  PLAGUEBRINGER_TREES
} from '../plaguebringerData';
import { ALL_CLASSES_DATA } from '../index';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { talentTier } from '../../talentTrees/talentSystem.mjs';
import { convertTalentSpellToLibrarySpell } from '../../talentTrees/talentSystem.mjs';
import { getPlaguebringerSpellResourcePlan } from '../../plaguebringerResourceContract';

describe('Plaguebringer integration', () => {
  test('registers the authored class and every authored spell', () => {
    expect(ALL_CLASSES_DATA.Plaguebringer.spells).toHaveLength(50);
    expect(PLAGUEBRINGER_DATA.spells).toHaveLength(50);

    const classSpellIds = new Set(ALL_CLASS_SPELLS.Plaguebringer.map(spell => spell.id));
    expect(classSpellIds.size).toBeGreaterThanOrEqual(50);
    PLAGUEBRINGER_DATA.spells.forEach(spell => {
      expect(classSpellIds.has(spell.id)).toBe(true);
    });
  });

  test('keeps the complete optional curve and core grants', () => {
    const counts = PLAGUEBRINGER_OPTIONAL_RECORDS.reduce((result, spell) => {
      result[spell.level] = (result[spell.level] || 0) + 1;
      return result;
    }, {});

    expect(counts).toEqual({ 1: 5, 2: 6, 3: 5, 4: 4, 5: 4, 6: 4, 7: 6, 8: 4, 9: 4, 10: 4 });
    expect(PLAGUEBRINGER_CORE_SPELL_IDS).toEqual(['pb_curse_of_agony', 'pb_whisper_of_decay']);
    PLAGUEBRINGER_CORE_SPELL_IDS.forEach(id => {
      expect(PLAGUEBRINGER_DATA.spells.some(spell => spell.id === id)).toBe(true);
    });
  });

  test('preserves three complete 50-rank trees with one tier-seven capstone each', () => {
    const trees = Object.entries(TALENT_TREES.Plaguebringer);
    expect(trees).toHaveLength(3);

    trees.forEach(([, nodes]) => {
      expect(nodes).toHaveLength(19);
      expect(nodes.reduce((total, node) => total + node.maxRanks, 0)).toBe(50);
      expect(nodes.every(node => node.grantId === `talent-spell-${node.id}`)).toBe(true);

      const capstones = nodes.filter(node => talentTier(node) === 7 && node.maxRanks === 1);
      expect(capstones).toHaveLength(1);
      expect(capstones[0]).toMatchObject({ capstone: true, minLevel: 10, requiresPoints: 45 });
    });

    const allNodes = Object.values(PLAGUEBRINGER_TREES).flat();
    expect(allNodes).toHaveLength(57);
    expect(new Set(allNodes.map(node => node.id)).size).toBe(57);
  });

  test('plans every projected talent virulence cost', () => {
    const nodes = Object.values(PLAGUEBRINGER_TREES).flat()
      .filter(node => node.spell?.resourceCosts?.virulence);

    expect(nodes).toHaveLength(18);
    nodes.forEach(node => {
      const spell = convertTalentSpellToLibrarySpell(node, 1);
      const plan = getPlaguebringerSpellResourcePlan(spell, { virulence: 0 }, 'virulenceCultivation');
      expect(plan).toMatchObject({
        handled: true,
        cost: node.spell.resourceCosts.virulence.baseAmount,
        affordable: false
      });
    });
  });
});
