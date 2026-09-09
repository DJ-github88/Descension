import {
  formatDamageType,
  getResistancesSummary,
  getVulabilitiesSummary,
  getBaseAttackDie
} from '../creatureTooltipUtils';
import { mapCreatureAbility } from '../../components/grid/CreatureAbilityFanOut';
import creatureData from '../../data/creatureData.json';

const CANONICAL = new Set([
  'smashing', 'stabbing', 'slicing',
  'ember', 'rime', 'storm', 'primal',
  'arcane', 'blight', 'wyrd',
  'sacred', 'healing'
]);

describe('creature damage-type normalization', () => {
  test('formatDamageType maps legacy ids to canonical labels', () => {
    expect(formatDamageType('cold')).toMatchObject({ label: 'Rime' });
    expect(formatDamageType('fire')).toMatchObject({ label: 'Ember' });
    expect(formatDamageType('psychic')).toMatchObject({ label: 'Wyrd' });
    expect(formatDamageType('necrotic')).toMatchObject({ label: 'Blight' });
    expect(formatDamageType('lightning')).toMatchObject({ label: 'Storm' });
    expect(formatDamageType('radiant')).toMatchObject({ label: 'Sacred' });
    expect(formatDamageType('physical')).toMatchObject({ label: 'Smashing' });
    expect(formatDamageType('rime')).toMatchObject({ label: 'Rime' });
  });

  test('resistance/vulnerability summaries normalize keys', () => {
    const res = getResistancesSummary({ resistances: { cold: 50, poison: 100 } });
    expect(res).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'rime', label: 'Rime Resistant' }),
        expect.objectContaining({ type: 'blight', label: 'Blight Immune' })
      ])
    );
    const vul = getVulabilitiesSummary({ vulnerabilities: { fire: 60 } });
    expect(vul).toEqual([expect.objectContaining({ type: 'ember' })]);
  });

  test('getBaseAttackDie normalizes legacy ability damage types', () => {
    const creature = {
      abilities: [{ type: 'melee', damage: { diceCount: 1, diceType: 8, bonus: 2, damageType: 'piercing' } }]
    };
    expect(getBaseAttackDie(creature).damageType).toBe('stabbing');
  });

  test('mapCreatureAbility normalizes legacy damageType (combat log path)', () => {
    const mapped = mapCreatureAbility({
      name: 'Bite',
      type: 'melee',
      damage: { diceCount: 1, diceType: 8, bonus: 2, damageType: 'piercing' }
    }, 0);
    expect(mapped.damageType).toBe('stabbing');
  });

  test('creatureData.json resistance keys are all canonical (or "all")', () => {
    const offenders = [];
    for (const region of creatureData.regions) {
      for (const creature of region.creatures || []) {
        const resistances = creature.stats?.resistances || {};
        for (const key of Object.keys(resistances)) {
          if (!CANONICAL.has(key) && key !== 'all') {
            offenders.push(`${creature.id}:${key}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
