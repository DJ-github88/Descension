import useCombatStore from '../../store/combatStore';
import { registerStore } from '../../store/storeRegistry';
import { makeMovementRecord, movementCombination, movementEffectKey } from '../sharedConditionProfile';
import { conditionPlan, recordFor, resultFor, combinationText } from '../authoredEffect';
import { planSpellCommand, gmRefusal } from '../spellConsequence';
import { capabilityOf, buildFeed } from '../acceptedResultFeed';
import { calculateEffectiveMovementSpeed, movementSpeedBreakdown, movementBreakdownText, authoredMovementFeet, movementBaseSpeed } from '../../utils/conditionUtils';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));
jest.mock('../../components/spellcrafting-wizard/core/mechanics/cooldownSystem', () => ({ processTurnBasedCooldowns: jest.fn() }));

const id = n => `20000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const hash = c => c.repeat(64);
const room = 'r', target = { kind: 'creature', roomId: room, mapId: 'm', tokenId: 't', instanceId: 'target' };
const src = (tokenId, instanceId = tokenId) => ({ kind: 'creature', roomId: room, mapId: 'm', tokenId, instanceId });
const def = (uuid, version = 1, h = 'b') => `authored:${uuid}:${version}:${hash(h)}`;
function record(n, { feet = -10, label = 'Mired', source = src('s'), definition = def(id(900)), timing = 'manual' } = {}) {
  return makeMovementRecord(target, id(n), { sourceActor: source, sourceOccurrence: `authored-effect:${id(n)}`, timing, authoredDuration: 'Until the mud dries', feet, label, ...(definition ? { effectDefinition: definition } : {}) });
}
const approval = (n, { feet = -10, label = 'Mired', source = src('s'), definitionId = def(id(900)), direct = null } = {}) => ({
  approvalId: id(n), source, target, roll: direct ? { mode: 'digital', dice: [{ sides: 6, faces: [3] }], constant: 2, total: 5, reading: '1d6+2' } : null, price: { ap: 1, mana: 0 },
  spell: { definitionId, definitionHash: `authored-effect:v1/${hash('c')}`, name: `${label} spell`, kind: 'effect', damageTypes: direct ? ['ember'] : [] },
  effectTerms: { direct, condition: { kind: 'movement', feet, label }, timing: { expiryPolicy: 'gm-manual', durationText: 'Until the mud dries', authoredDuration: null, gmNote: 'n' } },
  resolution: { gmConfirmed: true, timing: { expiryPolicy: 'gm-manual', durationText: 'Until the mud dries', authoredDuration: null, gmNote: 'n' }, timingNote: 'GM ruling', evidence: '' } });

test('consumer: different named effects add after existing multipliers, clamp at 0, and read as one breakdown line', () => {
  const mired = record(1), tailwind = record(2, { feet: 15, label: 'Tailwind', source: src('o'), definition: def(id(901)) });
  expect(calculateEffectiveMovementSpeed(35, [mired, tailwind])).toBe(40);
  expect(authoredMovementFeet([mired, tailwind])).toBe(5);
  expect(movementBreakdownText(movementSpeedBreakdown(35, [mired, tailwind]))).toBe('Base 35 ft · Mired −10 ft · Tailwind +15 ft = 40 ft');
  const slowed = { id: 'slowed', name: 'Slowed' }; // existing multipliers first (unchanged A10 order)
  expect(calculateEffectiveMovementSpeed(30, [slowed, mired, tailwind])).toBe(20);
  expect(movementBreakdownText(movementSpeedBreakdown(30, [slowed, mired, tailwind]))).toBe('Base 30 ft · other conditions → 15 ft · Mired −10 ft · Tailwind +15 ft = 20 ft');
  const bog = record(3, { feet: -40, label: 'Bog-bound', source: src('p'), definition: def(id(902)) });
  expect(calculateEffectiveMovementSpeed(30, [mired, bog])).toBe(0);
  expect(movementSpeedBreakdown(30, [mired, bog]).clamped).toBe(true);
  expect(movementBreakdownText(movementSpeedBreakdown(30, [mired, bog]))).toMatch(/= 0 ft \(never below 0 ft\)$/);
  expect(calculateEffectiveMovementSpeed(30, [bog])).toBe(0);
  expect(calculateEffectiveMovementSpeed(30, [])).toBe(30);
  expect(movementBaseSpeed({ creatureId: 'c1', stats: { speed: 20 } }, [{ id: 'c1', stats: { speed: 35 } }])).toBe(35);
});

test('policy: add, same-source refresh and every undefined branch, from structured identity (never the label alone)', () => {
  const mired = record(1);
  expect(movementEffectKey(mired)).toBe(id(900));
  expect(movementCombination([], record(2))).toEqual({ ok: true, outcome: 'added', replaces: null });
  expect(movementCombination([mired], record(2, { feet: 15, label: 'Tailwind', source: src('o'), definition: def(id(901)) }))).toMatchObject({ ok: true, outcome: 'added' });
  expect(movementCombination([mired], record(2))).toEqual({ ok: true, outcome: 'refreshed', replaces: id(1) });
  expect(movementCombination([mired], record(2, { source: src('o') }))).toMatchObject({ ok: false, code: 'modifier_combination_unresolved', message: expect.stringMatching(/different source/) });
  expect(movementCombination([mired], record(2, { source: src('s', 'other-incarnation') }))).toMatchObject({ ok: false, message: expect.stringMatching(/different source/) });
  expect(movementCombination([mired], record(2, { feet: -20, definition: def(id(900), 2, 'd') }))).toMatchObject({ ok: false, message: expect.stringMatching(/different authored terms/) });
  expect(movementCombination([mired], record(2, { feet: 15, definition: def(id(901)), source: src('o') }))).toMatchObject({ ok: false, message: expect.stringMatching(/different effect named Mired/) });
  expect(movementCombination([mired], record(2, { feet: 15, label: ' mired'.trim().toUpperCase(), definition: def(id(901)) }))).toMatchObject({ ok: false });
  expect(movementCombination([record(1, { definition: null })], record(2, { label: 'Tailwind', feet: 15, definition: def(id(901)) }))).toMatchObject({ ok: false, message: expect.stringMatching(/stable identity/) });
  expect(movementCombination([], record(2, { definition: null }))).toMatchObject({ ok: false, code: 'modifier_identity_required' });
  const many = Array.from({ length: 8 }, (_, i) => record(10 + i, { feet: 5, label: `Gust ${i}`, definition: def(id(910 + i)) }));
  expect(movementCombination(many, record(2, { label: 'Last', definition: def(id(950)) }))).toMatchObject({ ok: false, code: 'movement_modifier_capacity' });
  expect(movementCombination(many, record(2, { feet: 5, label: 'Gust 0', definition: def(id(910)) }))).toMatchObject({ ok: true, outcome: 'refreshed' });
});

test('planner: a refresh is [remove the one instance, add the new one] in one command with the outcome in the result; refusals throw with their code', () => {
  const tokens = [{ id: 's', mapId: 'm', state: { actorContract: { ...src('s'), version: 1, revision: 2 }, currentActionPoints: 4, tempActionPoints: 0, currentMana: 0, tempMana: 0, conditions: [] } },
    { id: 't', mapId: 'm', state: { actorContract: { ...target, version: 1, revision: 5 }, currentHp: 20, tempHealth: 0, maxHp: 30, conditions: [record(1)] } },
    { id: 'o', mapId: 'm', state: { actorContract: { ...src('o'), version: 1, revision: 1 }, currentActionPoints: 4, tempActionPoints: 0, currentMana: 0, tempMana: 0, conditions: [] } }];
  const a = approval(7), plan = planSpellCommand({ approval: a, contentHash: 'h', tokens, roomId: room, mapId: 'm', adjudicated: true });
  expect(plan.entries[1].conditions).toEqual([{ op: 'remove', recordId: id(1) }, { op: 'add', recordId: id(7), record: recordFor(a) }]);
  const chosen = JSON.parse(plan.extra.adjudication.chosenResult);
  expect(chosen).toEqual(resultFor(a, a.resolution, { outcome: 'refreshed', replacesInstanceId: id(1) }));
  expect(combinationText(chosen.combination, chosen.condition)).toBe('refreshed Mired: its duration restarts; the value is not stacked');
  expect(plan.entries[0].finalResources.ap).toEqual({ current: 3, temp: 0 }); // a refresh is still a new paid action
  const other = approval(8, { source: src('o') });
  expect(() => planSpellCommand({ approval: other, contentHash: 'h', tokens, roomId: room, mapId: 'm', adjudicated: true })).toThrow(expect.objectContaining({ code: 'modifier_combination_unresolved' }));
  expect(conditionPlan(approval(9, { label: 'Tailwind', feet: 15, definitionId: def(id(901)), source: src('o') }), [record(1)]).combination).toEqual({ outcome: 'added', replacesInstanceId: null });
});

test('narration: a refreshed movement effect reads as a refresh, not a second application', () => {
  const a = approval(7, { direct: { kind: 'damage', formula: '1d6+2', damageTypes: ['ember'] } });
  const result = resultFor(a, a.resolution, { outcome: 'refreshed', replacesInstanceId: id(1) });
  const receipt = { version: 1, roomId: room, commandId: 'cmd', source: a.source, target, adjudication: { definitionVersionOrHash: a.spell.definitionHash, chosenResult: JSON.stringify(result) },
    actors: [{ ref: a.source, beforeRevision: 1, finalResources: { hp: { current: 30, temp: 0 }, ap: { current: 3, temp: 0 }, mana: { current: 0, temp: 0 } } },
      { ref: target, beforeRevision: 1, finalResources: { hp: { current: 15, temp: 0 }, ap: { current: 4, temp: 0 }, mana: { current: 0, temp: 0 } }, conditions: [recordFor(a)] }] };
  expect(capabilityOf(receipt)).toMatchObject({ kind: 'effect', refreshed: true });
  const before = { [['creature', room, 'm', 's', 's'].join('|')]: { revision: 1, name: 'Ash Hound', pools: { hp: { current: 30, temp: 0 }, ap: { current: 4, temp: 0 }, mana: { current: 0, temp: 0 } } },
    [['creature', room, 'm', 't', 'target'].join('|')]: { revision: 1, name: 'Bog Troll', pools: { hp: { current: 20, temp: 0 }, ap: { current: 4, temp: 0 }, mana: { current: 0, temp: 0 } } } };
  const feed = buildFeed({ result: { receipt }, before, viewer: { reportable: () => true, rendered: () => true }, live: true });
  expect(feed.narration.text).toMatch(/^Ash Hound uses Mired spell on Bog Troll, refreshing Mired \(movement −10 ft\): duration restarts, value not stacked \(GM removes\)\./);
});

test('GM refusal states why an unresolved combination is refused and when a review can help', () => {
  expect(gmRefusal(false, 'modifier_combination_unresolved', 'Mired is already active from a different source.')).toEqual({ phase: 'refused', message: 'Mired is already active from a different source. Nothing was applied or charged; the GM resolves it manually.' });
  expect(gmRefusal(false, 'movement_modifier_capacity', 'movement_modifier_capacity').message).toMatch(/not decided by the recorded policy\. Nothing was applied or charged/);
  expect(gmRefusal(false, 'modifier_combination_changed').phase).toBe('retry');
  expect(gmRefusal(true, 'modifier_combination_changed').phase).toBe('unresolved'); // a re-check never claims nothing happened
});

describe('combat movement validation uses the resulting stacked speed', () => {
  let conditions;
  beforeEach(() => {
    useCombatStore.getState().forceResetCombat(); useCombatStore.getState().resetMovementState(); useCombatStore.getState().initializeStore();
    conditions = [];
    const creature = { id: 'creature-troll', name: 'Bog Troll', stats: { agility: 10, speed: 30, initiativeMod: 0, maxHp: 30, maxActionPoints: 4 } };
    registerStore('creatureStore', { getState: () => ({ creatures: [creature], tokens: [{ id: 't', creatureId: 'creature-troll', state: { conditions } }], updateTokenState: jest.fn() }) });
    registerStore('characterTokenStore', { getState: () => ({ characterTokens: [] }) });
    registerStore('gameStore', { getState: () => ({ isInMultiplayer: false, multiplayerSocket: { connected: false, emit: jest.fn() } }) });
    registerStore('characterStore', { getState: () => ({ derivedStats: { moveSpeed: 30 }, actionPoints: { current: 3, max: 3 } }) });
    registerStore('partyStore', { getState: () => ({ partyMembers: [], updatePartyMember: jest.fn() }) });
    registerStore('conditionStore', { getState: () => ({ decrementRoundBasedConditions: jest.fn() }) });
    useCombatStore.getState().startCombat([{ id: 't', creatureId: 'creature-troll' }], [creature]);
    window.gridSystem = { worldToGrid: ({ x, y }) => ({ x: Math.round(x / 50), y: Math.round(y / 50) }) };
  });
  afterEach(() => { delete window.gridSystem; });
  const validate = () => useCombatStore.getState().validateMovement('t', { x: 0, y: 0 }, { x: 50, y: 0 }, [{ id: 'creature-troll', stats: { speed: 30 } }]);
  test('stacked change sets the movement segment; clamped zero refuses movement', () => {
    expect(validate().creatureSpeed).toBe(30);
    conditions.push(record(1), record(2, { feet: 15, label: 'Tailwind', source: src('o'), definition: def(id(901)) }));
    expect(validate().creatureSpeed).toBe(35);
    conditions.push(record(3, { feet: -40, label: 'Bog-bound', source: src('p'), definition: def(id(902)) }));
    expect(validate()).toMatchObject({ isValid: false, creatureSpeed: 0, reason: 'Effective movement speed is zero' });
    conditions.splice(2, 1); expect(validate().creatureSpeed).toBe(35); // removal restores the remaining stack
  });
});
