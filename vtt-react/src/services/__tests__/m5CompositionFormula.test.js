import { definitionFromWizard, definitionSummary, EFFECT_CAPABILITY, isFormulaBundle } from '../authoredAbility';
import { buildApproval } from '../spellConsequence';
import { termsFor, recordFor } from '../authoredEffect';
import { replaceAuthoredRegistry, authoredSupport } from '../authoredAbilityRegistry';
import { canonical, sha256Hex } from '../canonicalHash';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

// M5 composition + M4A (client mirror): the immediate part reads owner-attested scores through the shared scaled reader.
const uuid = n => `20000000-0000-4000-8000-00000000000${n}`;
const target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 't', instanceId: 'target' };
const pc = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'p', instanceId: 'pc', ownerUid: 'u', characterId: 'c' };
function saved(nowFormula = '2d8 + intelligence/3') {
  const c = { profile: EFFECT_CAPABILITY, effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d6', periodicDamageType: 'blight', tickRoll: 'each-tick', label: 'Mind Rot',
    expiryPolicy: 'target-start-count', occurrences: 2, durationText: 'While the rot spreads', gmNote: 'GM resolves range.' };
  const d = { name: 'Mind Brand', description: '', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['damage', 'control'], controlConfig: { authoredCondition: c },
    damageConfig: { damageType: 'direct', elementType: 'blight', formula: nowFormula, resolution: 'DICE' },
    resourceCost: { actionPoints: 1, mana: 2 }, targetingConfig: { targetingType: 'single', maxTargets: 1, rangeDistance: 30, rangeType: 'ranged', targetRestrictions: ['any'] } };
  return { ...JSON.parse(JSON.stringify(d)), authoredDefinitionId: uuid(1), authoredDraft: d };
}

test('support reads the effective score through the shared reader; the approval carries the M4A disclosure and caster binding; ticks keep their own terms', () => {
  const d = definitionFromWizard(saved(), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).definition;
  expect(d.effects.direct.formula).toBe('2d8 + intelligence/3');
  expect(definitionSummary(d)).toMatch(/^immediate blight damage 2d8 \+ intelligence\/3 \(rolled at cast\) \+ Mind Rot/);
  replaceAuthoredRegistry('r', [{ definitionRef: { roomId: 'r', definitionId: uuid(1), definitionVersion: 1, definitionHash: 'c'.repeat(64) }, canonicalDefinition: d,
    descriptor: { capabilityId: EFFECT_CAPABILITY, price: { ap: 1, mana: 2 }, effects: d.effects, timing: d.timing } }]);
  const support = authoredSupport(`authored:${uuid(1)}:1:${'c'.repeat(64)}`, 'r', 'Arcanoneer', { intelligence: 14, spirit: 9 });
  expect(support).toMatchObject({ supported: true, kind: 'effect', effectTerms: termsFor(d), rollAttributes: { intelligence: 14 } });
  expect(support.reading.constant).toBe(4); expect(support.reading.dice).toEqual([{ count: 2, sides: 8 }]);
  const character = { id: 'c', stats: { intelligence: 14 }, actionPoints: { current: 4 }, mana: { current: 5 } }, conditions = [];
  const tokens = [{ id: 't', mapId: 'm', state: { actorContract: { ...target, version: 1, revision: 3 }, currentHp: 20, tempHealth: 0, maxHp: 30, conditions: [] } },
    { id: 'p', mapId: 'm', ownerUserId: 'u', character, state: { actorContract: { ...pc, version: 1, revision: 7, primary: true }, conditions } }];
  const roll = { mode: 'physical', dice: [{ sides: 8, faces: [5, 6] }], constant: 4, total: 15, reading: support.reading.reading };
  const approval = buildApproval({ support, tokens, sourceRef: pc, targetRef: target, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, roll, approvalId: uuid(2) });
  expect(isFormulaBundle(approval)).toBe(true);
  expect(approval.rollAttributes).toEqual({ intelligence: 14 }); expect(approval.formulaSourceRevision).toBe(7);
  expect(approval.formulaSourceHash).toBe(sha256Hex(canonical({ character, conditions })));
  const rec = recordFor(approval); expect(rec.overTimeFormula).toBe('1d6'); expect(JSON.stringify(rec)).not.toContain('intelligence');
  // A changed score changes the reading the owner must approve again with the same faces.
  expect(authoredSupport(`authored:${uuid(1)}:1:${'c'.repeat(64)}`, 'r', 'Arcanoneer', { intelligence: 17 }).reading.constant).toBe(5);
});

test('plain-dice composition carries no formula disclosure; missing-health and deterministic immediate parts stay manual', () => {
  const plain = definitionFromWizard(saved('1d6+2'), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).definition;
  expect(isFormulaBundle({ spell: { definitionHash: `${EFFECT_CAPABILITY}/${'d'.repeat(64)}` }, effectTerms: termsFor(plain) })).toBe(false);
  for (const f of ['2d8 + caster_missing_health/4', 'intelligence/3', '2d8 + 3']) expect(definitionFromWizard(saved(f), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).ok).toBe(false);
});
