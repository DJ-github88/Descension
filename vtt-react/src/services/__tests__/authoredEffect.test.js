import { definitionFromWizard, definitionSummary, EFFECT_CAPABILITY } from '../authoredAbility';
import { itemAbilitySupport, snapshotAbility, editItemAbility } from '../itemAuthoredAbility';
import { planSpellCommand, spellReceipt, buildApproval } from '../spellConsequence';
import { recordFor, resultFor, termsFor, describe as describeEffect, CAPABILITY } from '../authoredEffect';
import { isStunned, isMovementModifier, expiryLabel, makeMovementRecord, structuredBoundary } from '../sharedConditionProfile';
import { capabilityOf, buildFeed } from '../acceptedResultFeed';
import { calculateEffectiveMovementSpeed, authoredMovementFeet } from '../../utils/conditionUtils';
import { replaceAuthoredRegistry, authoredSupport } from '../authoredAbilityRegistry';

const uuid = n => `10000000-0000-4000-8000-00000000000${n}`;
const source = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 's', instanceId: 'source' }, target = { ...source, tokenId: 't', instanceId: 'target' };
const pc = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'p', instanceId: 'pc', ownerUid: 'u', characterId: 'c' };
function saved({ name = 'Ember Hobble', effect = 'movement', feet = -10, label = 'Hobbled', policy = 'target-next-start', direct = 'damage' } = {}) {
  const d = { name, description: '', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: direct ? ['control', direct] : ['control'],
    controlConfig: { authoredCondition: { profile: EFFECT_CAPABILITY, effect, ...(effect === 'movement' ? { movementFeet: feet, label } : {}), expiryPolicy: policy, durationText: 'Until the embers cool', gmNote: 'GM resolves saves.' } },
    ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+2', resolution: 'DICE' } } : {}),
    resourceCost: { actionPoints: 2, mana: 1 }, targetingConfig: { targetingType: 'single', maxTargets: 1, rangeDistance: 30, rangeType: 'ranged', targetRestrictions: ['any'] } };
  return { ...JSON.parse(JSON.stringify(d)), authoredDefinitionId: uuid(1), authoredDraft: d };
}
const tokens = () => [source, target].map(ref => ({ id: ref.tokenId, mapId: 'm', state: { actorContract: { ...ref, version: 1, revision: 3 }, currentActionPoints: 4, tempActionPoints: 1, currentMana: 10, tempMana: 0, currentHp: 20, tempHealth: 2, maxHp: 30, conditions: [] } }));

test('Wizard bundle maps whole; two names share one primitive; compact editors keep it unchanged', () => {
  for (const name of ['Ember Hobble', 'Frost Tether']) {
    const r = saved({ name }), before = JSON.stringify(r), d = definitionFromWizard(r, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    expect(d.ok).toBe(true); expect(d.definition.capability).toBe(CAPABILITY); expect(d.definition.effects.condition).toEqual({ kind: 'movement', feet: -10, label: 'Hobbled' });
    expect(JSON.stringify(r)).toBe(before); expect(definitionSummary(d.definition)).toMatch(/ember damage 1d6\+2 \+ Hobbled \(movement −10 ft\).*start of the target's next turn/);
  }
  const association = snapshotAbility(saved());
  expect(itemAbilitySupport(association).ok).toBe(true);
  expect(() => editItemAbility(association, { name: 'x', kind: 'damage' })).toThrow(/Spell Wizard/);
});

test('owner approval binds exact bundle terms and refuses PC targets; planner installs payment, HP and the effect in one command', () => {
  const d = definitionFromWizard(saved(), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).definition;
  replaceAuthoredRegistry('r', [{ definitionRef: { roomId: 'r', definitionId: uuid(1), definitionVersion: 1, definitionHash: 'b'.repeat(64) }, canonicalDefinition: d,
    descriptor: { capabilityId: CAPABILITY, price: { ap: 2, mana: 1 }, effects: d.effects, timing: d.timing } }]);
  const support = authoredSupport(`authored:${uuid(1)}:1:${'b'.repeat(64)}`, 'r', 'Arcanoneer');
  expect(support).toMatchObject({ supported: true, kind: 'effect', effectTerms: termsFor(d) });
  const actorTokens = [...tokens(), { id: 'p', mapId: 'm', ownerUserId: 'u', character: { id: 'c', actionPoints: { current: 4 }, mana: { current: 5 } }, state: { actorContract: { ...pc, version: 1, revision: 1, primary: true } } }];
  const roll = { mode: 'physical', dice: [{ sides: 6, faces: [4] }], constant: 2, total: 6, reading: '1d6+2' };
  const base = { support, tokens: actorTokens, sourceRef: pc, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, approvalId: uuid(2) };
  expect(() => buildApproval({ ...base, targetRef: pc, roll })).toThrow(/distinct exact bound creature/);
  expect(() => buildApproval({ ...base, targetRef: target, roll: null })).toThrow(/roll/);
  const approval = buildApproval({ ...base, targetRef: target, roll });
  expect(approval.effectTerms).toEqual(termsFor(d)); expect(approval.spell.kind).toBe('effect');
  const resolution = { gmConfirmed: true, timing: d.timing, timingNote: 'GM range ruling', evidence: 'private' };
  const plan = planSpellCommand({ approval, contentHash: 'h', tokens: actorTokens, roomId: 'r', mapId: 'm', finalAmount: 9, reason: 'cover', adjudicated: true, resolution });
  expect(plan.entries).toHaveLength(2);
  expect(plan.entries[1].finalResources).toEqual({ hp: { current: 13, temp: 0 } });
  const record = plan.entries[1].conditions[0].record; expect(isMovementModifier(record)).toBe(true); expect(record).toEqual(recordFor(approval)); expect(structuredBoundary(record)).toBe('start');
  expect(JSON.parse(plan.extra.adjudication.chosenResult)).toEqual(resultFor(approval, resolution, { outcome: 'added', replacesInstanceId: null })); // A11: movement records add/refresh
  expect(() => planSpellCommand({ approval, tokens: actorTokens, roomId: 'r', mapId: 'm', finalAmount: 9, adjudicated: true, resolution: { ...resolution, timing: { ...d.timing, expiryPolicy: 'gm-manual' } } })).toThrow(/owner-approved/);
  expect(() => planSpellCommand({ approval, tokens: actorTokens, roomId: 'r', mapId: 'm', finalAmount: 9, reason: '', adjudicated: true, resolution })).toThrow(/Explain/);
  const receipt = { version: 1, authorization: { kind: 'owner-approval-gm', proposalId: uuid(2) }, ...plan.extra, actors: plan.entries };
  expect(spellReceipt({ success: true, receipt }).recorded.kind).toBe('effect');
  const capability = capabilityOf(receipt); expect(capability).toMatchObject({ kind: 'effect', damage: true }); expect(capability.effect).toMatch(/Hobbled/);
});

test('movement consumer: authored feet apply after existing multipliers, clamp at 0, and forged/legacy effects are ignored', () => {
  const record = makeMovementRecord(target, uuid(3), { sourceActor: source, sourceOccurrence: `authored-effect:${uuid(3)}`, timing: 'manual', authoredDuration: 'x', feet: -10, label: 'Mired' });
  expect(calculateEffectiveMovementSpeed(30, [record])).toBe(20);
  expect(calculateEffectiveMovementSpeed(30, [record, { id: 'slowed', name: 'Slowed' }])).toBe(5); // (30 × ½) − 10
  expect(calculateEffectiveMovementSpeed(5, [record])).toBe(0);
  expect(calculateEffectiveMovementSpeed(30, [])).toBe(30); // removal restores the base calculation
  const forged = { ...record, effects: { movementSpeed: -30 } }, legacy = { id: 'l', name: 'Sandbox buff', effects: { movementSpeed: 50 } };
  expect(authoredMovementFeet([forged, legacy])).toBe(0); expect(calculateEffectiveMovementSpeed(30, [forged, legacy])).toBe(30);
  expect(expiryLabel(record)).toMatch(/GM removes/);
});

test('narration explains the bundle once; floats are HP-only from exact deltas', () => {
  const approval = { approvalId: uuid(4), source, target, roll: { mode: 'digital', dice: [{ sides: 6, faces: [3] }], constant: 2, total: 5, reading: '1d6+2' },
    spell: { definitionId: 'authored:x', definitionHash: `${CAPABILITY}/${'c'.repeat(64)}`, name: 'Ember Hobble', kind: 'effect', damageTypes: ['ember'] },
    effectTerms: { direct: { kind: 'damage', formula: '1d6+2', damageTypes: ['ember'] }, condition: { kind: 'stunned' }, timing: { expiryPolicy: 'target-next-end', durationText: 'x', authoredDuration: null, gmNote: 'n' } },
    resolution: { gmConfirmed: true, timing: { expiryPolicy: 'target-next-end', durationText: 'x', authoredDuration: null, gmNote: 'n' }, timingNote: 't', evidence: '' } };
  const receipt = { version: 1, roomId: 'r', commandId: 'cmd', source, target, adjudication: { definitionVersionOrHash: approval.spell.definitionHash, chosenResult: JSON.stringify(resultFor(approval, approval.resolution)) },
    actors: [{ ref: source, beforeRevision: 1, finalResources: { hp: { current: 30, temp: 0 }, ap: { current: 2, temp: 0 }, mana: { current: 9, temp: 0 } } },
      { ref: target, beforeRevision: 1, finalResources: { hp: { current: 15, temp: 0 }, ap: { current: 4, temp: 0 }, mana: { current: 0, temp: 0 } }, conditions: [recordFor(approval)] }] };
  const before = { [['creature', 'r', 'm', 's', 'source'].join('|')]: { revision: 1, name: 'Ash Hound', pools: { hp: { current: 30, temp: 0 }, ap: { current: 4, temp: 0 }, mana: { current: 10, temp: 0 } } },
    [['creature', 'r', 'm', 't', 'target'].join('|')]: { revision: 1, name: 'Bog Troll', pools: { hp: { current: 20, temp: 0 }, ap: { current: 4, temp: 0 }, mana: { current: 0, temp: 0 } } } };
  const feed = buildFeed({ result: { receipt }, before, viewer: { reportable: () => true, rendered: () => true }, live: true });
  expect(feed.narration.text).toMatch(/^Ash Hound uses Ember Hobble on Bog Troll, applying canonical Stunned \(expires at the end of the target's next turn\)\./);
  expect(feed.floats).toEqual([{ key: ['creature', 'r', 'm', 't', 'target'].join('|'), parts: [{ kind: 'damage', amount: 5, text: '−5 HP' }] }]);
  expect(describeEffect(approval.effectTerms)).toMatch(/ember damage 1d6\+2 \+ canonical Stunned/);
  expect(isStunned(recordFor(approval))).toBe(true);
});
