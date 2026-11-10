import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { buildApproval, planSpellCommand, supportSpell } from '../spellConsequence';
import { actionId, EFFECT_CAPABILITY } from '../authoredAbility';
import { canonical, sha256Hex } from '../canonicalHash';
import { definitionProjection } from '../catalogueAbility.cjs';
import profiles from '../../data/catalogueAbilityProfiles.json';
import useGameStore from '../../store/gameStore';
import { registerStore } from '../../store/storeRegistry';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));
registerStore('gameStore', useGameStore);
const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'p', instanceId: 'pc', ownerUid: 'u', characterId: 'c' };
const target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 't', instanceId: 'foe' };
const original = profiles.profiles.slice();
afterEach(() => { profiles.profiles.splice(0, profiles.profiles.length, ...original); });

test.each([
  ['Arcanoneer', 'arcanoneer', { type: 'elementalSpheres', spheres: ['rime', 'rime', 'ember'] }, { domain: 'elementalSpheres', price: { costs: ['rime', 'rime'], gains: [] } }, { type: 'elementalSpheres', spheres: ['ember'] }],
  ['Minstrel', 'minstrel', { type: 'musicalNotes', notes: [0, 0, 0, 0, 0, 0, 0] }, { domain: 'musicalNotes', price: { costs: [], gains: ['I'] } }, { type: 'musicalNotes', notes: [1, 0, 0, 0, 0, 0, 0] }],
  ['Martyr', 'martyr', { type: 'devotion', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 }, { domain: 'devotionGauge', price: { cost: 0, gain: 1, required: 0 } }, { type: 'devotionGauge', current: 1, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 1 }]
])('%s uses the existing planner and carries its exact typed price into the one initial command', (className, classId, resource, spec, after) => {
  const d = { schemaVersion: 3, capability: EFFECT_CAPABILITY, scope: { roomId: 'r' }, definitionId: '11111111-1111-4111-8111-111111111111', definitionVersion: 1,
    name: 'SERVER FIXTURE ONLY', description: '', binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId }, spellType: 'ACTION', castTimeType: 'IMMEDIATE',
    targeting: { kind: 'single', maxTargets: 1, rangeFeet: 30, restriction: 'any' }, resourceCost: { actionPoints: 2, mana: 3 },
    effects: { direct: { kind: 'damage', formula: '2d8 + intelligence/3', damageTypes: ['rime'] }, condition: { kind: 'periodic', tick: { kind: 'damage', formula: '1d4', damageTypes: ['rime'] }, tickRoll: 'each-tick', label: 'Fixture' } },
    timing: { expiryPolicy: 'target-start-count', occurrences: 2, durationText: 'Two explicit target starts', authoredDuration: null, gmNote: 'GM confirms' },
    classPayment: spec, catalogueSource: { classId, spellId: 'SERVER-FIXTURE', recordHash: 'a'.repeat(64) } };
  profiles.profiles.push({ capability: EFFECT_CAPABILITY, ...d.catalogueSource, executable: definitionProjection(d) });
  const ref = { roomId: 'r', definitionId: d.definitionId, definitionVersion: 1, definitionHash: 'b'.repeat(64) }, id = actionId(ref);
  replaceAuthoredRegistry('r', [{ definitionRef: ref, canonicalDefinition: d, descriptor: { capabilityId: EFFECT_CAPABILITY, price: { ap: 2, mana: 3 }, binding: d.binding } }]);
  useGameStore.setState({ multiplayerRoom: { id: 'r' }, multiplayerSocket: null });
  const character = { id: 'c', class: className, stats: { intelligence: 14 }, classResource: resource, health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 };
  expect(authoredSupport(id, 'r', className, { intelligence: 14 }).classPaymentSpec).toEqual(spec);
  const support = supportSpell({ id }, character);
  expect(support.supported).toBe(true); expect(support.payment.classPayment).toEqual({ domain: spec.domain, price: spec.price, before: { ...resource, type: spec.domain }, after });
  const tokens = [{ id: 'p', mapId: 'm', ownerUserId: 'u', character, state: { actorContract: { ...source, version: 1, primary: true, revision: 0 }, conditions: [] } },
    { id: 't', mapId: 'm', stats: { maxHp: 40 }, state: { actorContract: { ...target, version: 1, revision: 0 }, currentHp: 30, tempHealth: 3, conditions: [] } }];
  const a = buildApproval({ support, tokens, sourceRef: source, targetRef: target, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, approvalId: '22222222-2222-4222-8222-222222222222',
    roll: { mode: 'physical', dice: [{ sides: 8, faces: [4, 4] }], constant: support.reading.constant, total: 8 + support.reading.constant, reading: support.reading.reading } });
  expect(a.classPayment).toEqual(support.payment.classPayment);
  const contentHash = sha256Hex(canonical(a));
  const plan = planSpellCommand({ approval: a, contentHash, tokens, roomId: 'r', mapId: 'm', finalAmount: a.roll.total, reason: '', adjudicated: true,
    resolution: { gmConfirmed: true, timing: a.effectTerms.timing, timingNote: 'GM confirms', evidence: '' } });
  expect(plan.entries[0]).toMatchObject({ ref: source, finalResources: { ap: { current: 3, temp: 0 }, mana: { current: 9, temp: 0 } }, classPayment: { mode: 'spell', domain: spec.domain, approvalHash: contentHash } });
  expect(plan.entries[1].conditions).toHaveLength(1); expect(plan.entries[1].finalResources.hp).toEqual({ current: 21, temp: 0 });
});

test('the client support gate refuses class payments combined with a save branch or a caster-start cooldown', () => {
  const base = { schemaVersion: 3, capability: EFFECT_CAPABILITY, scope: { roomId: 'r' }, definitionId: '33333333-3333-4333-8333-333333333333', definitionVersion: 1,
    name: 'SERVER FIXTURE ONLY', description: '', binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }, spellType: 'ACTION', castTimeType: 'IMMEDIATE',
    targeting: { kind: 'single', maxTargets: 1, rangeFeet: 30, restriction: 'any' }, resourceCost: { actionPoints: 2, mana: 3 },
    effects: { direct: { kind: 'damage', formula: '1d6+2', damageTypes: ['rime'] }, condition: { kind: 'movement', feet: -10, label: 'Slow' } },
    timing: { expiryPolicy: 'gm-manual', durationText: 'GM removes', authoredDuration: null, gmNote: 'GM confirms' },
    classPayment: { domain: 'elementalSpheres', price: { costs: [], gains: [] } }, catalogueSource: { classId: 'arcanoneer', spellId: 'SERVER-FIXTURE', recordHash: 'a'.repeat(64) } };
  const ref = { roomId: 'r', definitionId: base.definitionId, definitionVersion: 1, definitionHash: 'c'.repeat(64) }, id = actionId(ref);
  const install = d => replaceAuthoredRegistry('r', [{ definitionRef: ref, canonicalDefinition: d, descriptor: { capabilityId: EFFECT_CAPABILITY, price: { ap: 2, mana: 3 }, binding: d.binding } }]);
  useGameStore.setState({ multiplayerRoom: { id: 'r' }, multiplayerSocket: null });
  install({ ...base, cooldown: { cooldownType: 'authenticated_caster_start', cooldownValue: 1 } });
  expect(authoredSupport(id, 'r', 'Arcanoneer', {}).supported).toBe(false);
  install({ ...base, effects: { ...base.effects, save: { scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' } } });
  expect(authoredSupport(id, 'r', 'Arcanoneer', {})).toMatchObject({ supported: false, reason: expect.stringMatching(/not a reviewed combination/) });
  install({ ...base, catalogueSource: undefined });
  expect(authoredSupport(id, 'r', 'Arcanoneer', {})).toMatchObject({ supported: false, reason: expect.stringMatching(/pinned catalogue source/) });
});
