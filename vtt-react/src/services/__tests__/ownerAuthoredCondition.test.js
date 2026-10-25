import { buildApproval, planSpellCommand } from '../spellConsequence';
import { replaceAuthoredRegistry, authoredSupport } from '../authoredAbilityRegistry';
import { actionId } from '../authoredAbility';
import { definitionFromWizard } from '../authoredAbility';
import { recordFor } from '../authoredCondition';
import { isStunned } from '../sharedConditionProfile';

const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'pc-inc', ownerUid: 'u', characterId: 'c' };
const target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'foe', instanceId: 'foe-inc' };
const timing = { expiryPolicy: 'gm-manual', durationText: 'Until the bell falls silent', authoredDuration: {}, gmNote: 'Resolve manually' };
const definitionRef = { roomId: 'r', definitionId: 'd', definitionVersion: 1, definitionHash: 'a'.repeat(64) };
const entry = { definitionRef, canonicalDefinition: { name: 'Bell', binding: { classId: 'arcanoneer' }, effect: { kind: 'condition', conditionKey: 'stunned' }, targeting: { rangeFeet: 30, restriction: 'any' }, timing }, descriptor: { price: { ap: 2, mana: 3 }, effect: { kind: 'condition' } } };
const tokens = [{ id: 'pc', mapId: 'm', ownerUserId: 'u', character: { id: 'c', actionPoints: { current: 4 }, tempActionPoints: 1, mana: { current: 10 }, tempMana: 2 }, state: { actorContract: { version: 1, ...source, primary: true, revision: 0 } } },
  { id: 'foe', mapId: 'm', state: { actorContract: { version: 1, ...target, revision: 0 } } }];
const support = () => { replaceAuthoredRegistry('r', [entry]); return authoredSupport(actionId(definitionRef), 'r', 'Arcanoneer'); };
const approve = s => buildApproval({ support: s, tokens, sourceRef: source, targetRef: target, roomId: 'r', mapId: 'm', actionEpoch: 'epoch', baseCommitSequence: 0, approvalId: '33333333-3333-4333-8333-333333333333', roll: null });
test('condition PC support is explicit normal admission; creature-only and wrong binding refuse', () => {
  expect(support()).toMatchObject({ supported: true, kind: 'condition', definitionHash: `authored-condition:v1/${'a'.repeat(64)}` });
  replaceAuthoredRegistry('r', [{ ...entry, creatureOnly: true }]); expect(authoredSupport(actionId(definitionRef), 'r', 'Arcanoneer').supported).toBe(false);
  support(); expect(authoredSupport(actionId(definitionRef), 'r', 'Chronarch').supported).toBe(false);
});
test('live library optional undefined metadata compares like JSON transport; missing prices still refuse', () => {
  const draft = { name: 'Bell', description: '', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', icon: undefined, secondaryElement: undefined, tags: undefined }, effectTypes: ['control'], controlConfig: { authoredCondition: { profile: 'authored-condition:v1', conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: 'Bell boundary', gmNote: 'GM rules' } }, targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 0 } };
  const record = { ...draft, authoredDraft: JSON.parse(JSON.stringify(draft)), authoredDefinitionId: '33333333-3333-4333-8333-333333333333' }, ctx = { roomId: 'r', classId: 'arcanoneer', definitionVersion: 1 };
  expect(definitionFromWizard(record, ctx).ok).toBe(true); delete record.resourceCost.actionPoints; delete record.authoredDraft.resourceCost.actionPoints; expect(definitionFromWizard(record, ctx).ok).toBe(false);
});
test('no-roll consent binds duration/price and command adds temp-first payment plus canonical condition without HP', () => {
  const a = approve(support()); expect(a.roll).toBeNull(); expect(a.conditionTerms).toEqual({ conditionKey: 'stunned', timing }); expect(a.resolution).toBeUndefined();
  const resolution = { gmConfirmed: true, timing, timingNote: 'PRIVATE clarification', evidence: 'PRIVATE outcome' };
  const plan = planSpellCommand({ approval: a, contentHash: 'hash', tokens, roomId: 'r', mapId: 'm', adjudicated: true, resolution });
  expect(plan.entries[0].finalResources).toEqual({ ap: { current: 3, temp: 0 }, mana: { current: 9, temp: 0 } });
  expect(isStunned(plan.entries[1].conditions[0].record)).toBe(true); expect(JSON.stringify(plan.entries[1])).not.toContain('PRIVATE'); expect(plan.entries[1].finalResources).toBeUndefined();
  expect(a.resolution).toBeUndefined(); expect(recordFor({ ...a, resolution }).effectSummary).toContain('Until the bell falls silent');
});
test('changed duration cannot be silently supplied by GM and required success/note cannot be omitted', () => {
  const a = approve(support()), input = { approval: a, contentHash: 'h', tokens, roomId: 'r', mapId: 'm', adjudicated: true };
  for (const resolution of [{ gmConfirmed: true, timing: { ...timing, durationText: 'Forever' }, timingNote: 'Changed', evidence: '' }, { gmConfirmed: true, timing, timingNote: '', evidence: '' }, { gmConfirmed: false, timing, timingNote: 'Ruling', evidence: '' }]) expect(() => planSpellCommand({ ...input, resolution })).toThrow();
  expect(() => buildApproval({ support: support(), tokens, sourceRef: source, targetRef: source, roomId: 'r', mapId: 'm', baseCommitSequence: 0 })).toThrow(/creature/);
});
