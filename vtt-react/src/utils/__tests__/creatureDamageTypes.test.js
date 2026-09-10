import {
  formatDamageType,
  getResistancesSummary,
  getVulabilitiesSummary,
  getBaseAttackDie
} from '../creatureTooltipUtils';
import { mapCreatureAbility } from '../../components/grid/CreatureAbilityFanOut';
import creatureData from '../../data/creatureData.json';
import fs from 'fs';
import path from 'path';

const LEGACY_TYPES = [
  'physical', 'bludgeoning', 'piercing', 'slashing',
  'cold', 'ice', 'frost', 'fire', 'radiant', 'holy', 'divine',
  'electric', 'lightning', 'force', 'thunder', 'shadow', 'necrotic',
  'void', 'poison', 'acid', 'viscera', 'nature', 'chaos', 'psychic'
];
const LEGACY_PATTERN = LEGACY_TYPES.join('|');

// Non-damage-type keys that may appear in creature vulnerability/resistance maps
// (material weaknesses and whole-creature categories).
const NON_DAMAGE_KEYS = new Set(['all', 'iron', 'copper']);

const loadJson = (relPath) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, relPath), 'utf8'));

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

describe('creature damage-type data is canonical', () => {
  test('ability library damageTypes/dotConfig/school are canonical', () => {
    const abilities = loadJson('../../../public/data/abilities.json');
    const offenders = [];
    for (const [creatureId, list] of Object.entries(abilities)) {
      for (const ability of list || []) {
        const dc = ability.damageConfig || {};
        const label = `${creatureId}:${ability.name}`;
        const school = ability.typeConfig?.school;
        if (school && !CANONICAL.has(school)) offenders.push(`${label}:school:${school}`);
        for (const type of dc.damageTypes || []) {
          if (!CANONICAL.has(type)) offenders.push(`${label}:damageTypes:${type}`);
        }
        if (dc.damageType && !CANONICAL.has(dc.damageType)) offenders.push(`${label}:damageType:${dc.damageType}`);
        if (dc.dotConfig?.damageType && !CANONICAL.has(dc.dotConfig.damageType)) {
          offenders.push(`${label}:dotConfig:${dc.dotConfig.damageType}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  test('creature library res/vuln keys and base attack damageTypes are canonical', () => {
    const creatures = loadJson('../../../public/data/creatures.json');
    const offenders = [];
    for (const creature of creatures) {
      for (const field of ['resistances', 'vulnerabilities']) {
        for (const key of Object.keys(creature[field] || {})) {
          if (!CANONICAL.has(key) && !NON_DAMAGE_KEYS.has(key)) offenders.push(`${creature.id}.${field}:${key}`);
        }
      }
      for (const ability of creature.abilities || []) {
        const type = ability.damage?.damageType;
        if (type && !CANONICAL.has(type)) offenders.push(`${creature.id}:${ability.name}:${type}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('bestiary combat prose has no legacy typed-damage strings', () => {
    const offenders = [];
    const diceType = new RegExp(`(\\d+d\\d+(?:\\s*[+-]\\s*\\d+)?)\\s+(?:${LEGACY_PATTERN})\\b`, 'i');
    const typeNoun = new RegExp(`\\b(?:${LEGACY_PATTERN})\\b\\s+(?:damage|resistance|immunity|attacks?|defense|reduction|hit|per round|/round)`, 'i');
    const typeLead = new RegExp(`\\b(?:Vulnerable to|vulnerable to|Immune to|immune to|Resistant to|resistant to|takes double|deals double|damage from)\\s+(?:${LEGACY_PATTERN})\\b`, 'i');
    for (const region of creatureData.regions) {
      for (const creature of region.creatures || []) {
        const combat = creature.combat || '';
        const match = combat.match(diceType) || combat.match(typeNoun) || combat.match(typeLead);
        if (match) offenders.push(`${creature.id}:${match[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
