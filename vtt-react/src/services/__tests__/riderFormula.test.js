import { definitionFromWizard, definitionSummary, EFFECT_CAPABILITY, isFormulaBundle, creatureSourceRefusal, readScaledFormula } from '../authoredAbility';
import { buildApproval, recordRoll } from '../spellConsequence';
import { termsFor, recordFor } from '../authoredEffect';
import { replaceAuthoredRegistry, authoredSupport } from '../authoredAbilityRegistry';
import { canonical, sha256Hex } from '../canonicalHash';
import { TYPE } from '../authoredCooldown';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

// Formula riders (client mirror): an M4A attribute immediate part next to one movement OR Stunned effect uses the same shared reader,
// support, approval disclosure and caster binding as the M5 composition formula. No cooldown, save or creature route.
const uuid = n => `30000000-0000-4000-8000-00000000000${n}`;
const target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 't', instanceId: 'target' };
const pc = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'p', instanceId: 'pc', ownerUid: 'u', characterId: 'c' };
const options = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
function saved({ kind = 'movement', formula = '2d6 + intelligence/3', cooldown = null, save = null } = {}) {
  const c = { profile: EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: -10, label: 'Mired' } : {}), expiryPolicy: 'target-next-end',
    durationText: 'Until the mire dries', gmNote: 'GM resolves range.', ...(save ? { save } : {}) };
  const d = { name: 'Mind Mire', description: '', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['damage', 'control'], controlConfig: { authoredCondition: c },
    damageConfig: { damageType: 'direct', elementType: 'ember', formula, resolution: 'DICE' }, resourceCost: { actionPoints: 2, mana: 3 },
    targetingConfig: { targetingType: 'single', maxTargets: 1, rangeDistance: 30, rangeType: 'ranged', targetRestrictions: ['any'] }, ...(cooldown ? { cooldownConfig: cooldown } : {}) };
  return { ...JSON.parse(JSON.stringify(d)), authoredDefinitionId: uuid(1), authoredDraft: d };
}
const id = `authored:${uuid(1)}:1:${'c'.repeat(64)}`;
const install = d => replaceAuthoredRegistry('r', [{ definitionRef: { roomId: 'r', definitionId: uuid(1), definitionVersion: 1, definitionHash: 'c'.repeat(64) }, canonicalDefinition: d,
  descriptor: { capabilityId: EFFECT_CAPABILITY, price: { ap: 2, mana: 3 }, effects: d.effects, timing: d.timing } }]);

test.each(['movement', 'stunned'])('%s rider: support reads the effective score through the shared reader; the approval carries the M4A disclosure and caster binding; the rider record carries no formula', kind => {
  const d = definitionFromWizard(saved({ kind }), options).definition;
  expect(d.effects.direct).toEqual({ kind: 'damage', formula: '2d6 + intelligence/3', damageTypes: ['ember'] });
  expect(definitionSummary(d)).toMatch(/2d6 \+ intelligence\/3/);
  expect(creatureSourceRefusal(d)).toEqual({ code: 'unsupported_source_route', reason: expect.stringMatching(/attribute-scaled immediate part currently requires a primary owner PC source/) });
  install(d);
  const support = authoredSupport(id, 'r', 'Arcanoneer', { intelligence: 14, spirit: 9 });
  expect(support).toMatchObject({ supported: true, kind: 'effect', effectTerms: termsFor(d), rollAttributes: { intelligence: 14 }, cooldown: { type: 'none', value: 0 } });
  expect(support.reading.constant).toBe(4); expect(support.reading.dice).toEqual([{ count: 2, sides: 6 }]);
  const character = { id: 'c', stats: { intelligence: 14 }, actionPoints: { current: 4 }, mana: { current: 5 } }, conditions = [];
  const tokens = [{ id: 't', mapId: 'm', state: { actorContract: { ...target, version: 1, revision: 3 }, currentHp: 20, tempHealth: 0, maxHp: 30, conditions: [] } },
    { id: 'p', mapId: 'm', ownerUserId: 'u', character, state: { actorContract: { ...pc, version: 1, revision: 7, primary: true }, conditions } }];
  const roll = recordRoll('physical', support.reading, [[5, 2]]);
  expect(roll.total).toBe(11);
  const approval = buildApproval({ support, tokens, sourceRef: pc, targetRef: target, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, roll, approvalId: uuid(2) });
  expect(isFormulaBundle(approval)).toBe(true);
  expect(approval.rollAttributes).toEqual({ intelligence: 14 }); expect(approval.formulaSourceRevision).toBe(7);
  expect(approval.formulaSourceHash).toBe(sha256Hex(canonical({ character, conditions })));
  expect(JSON.stringify(recordFor(approval))).not.toContain('intelligence');
  // A changed score changes the reading the owner must approve again with the same faces.
  const fresh = authoredSupport(id, 'r', 'Arcanoneer', { intelligence: 17 }).reading;
  expect(fresh.constant).toBe(5); expect(recordRoll('physical', fresh, roll.dice.map(g => g.faces)).total).toBe(12);
});

test('plain riders carry no formula disclosure; other rider families, missing-health and deterministic parts stay manual (the cooldown and the save are their own routes)', () => {
  const plain = definitionFromWizard(saved({ formula: '1d6+2' }), options).definition;
  expect(isFormulaBundle({ spell: { definitionHash: `${EFFECT_CAPABILITY}/${'d'.repeat(64)}` }, effectTerms: termsFor(plain) })).toBe(false);
  expect(creatureSourceRefusal(plain)).toBeNull();
  // Fence update (formula-rider cooldowns): the explicit caster-start cooldown is now an admitted shape; see riderFormulaCooldown.test.js.
  expect(definitionFromWizard(saved({ cooldown: { cooldownType: TYPE, cooldownValue: 1 } }), options).definition.cooldown).toEqual({ cooldownType: TYPE, cooldownValue: 1 });
  // Fence update (formula-rider saves): the scaled part may now carry the rider-local negates save (own suite: formulaRiderSave).
  expect(definitionFromWizard(saved({ save: { ability: 'constitution', dc: 13, outcome: 'negates' } }), options).definition.effects.save).toEqual({ scope: 'condition', ability: 'constitution', dc: 13, outcome: 'negates' });
  for (const f of ['2d6 + caster_missing_health/4', 'intelligence/3', '2d6 + 3']) expect(definitionFromWizard(saved({ formula: f }), options).ok).toBe(false);
  const attribute = saved(); Object.assign(attribute.authoredDraft.controlConfig.authoredCondition, { effect: 'attribute', attribute: 'agility', attributeAmount: -2 });
  delete attribute.authoredDraft.controlConfig.authoredCondition.movementFeet; attribute.controlConfig = JSON.parse(JSON.stringify(attribute.authoredDraft.controlConfig));
  expect(definitionFromWizard(attribute, options).ok).toBe(false);
  expect(readScaledFormula('2d6 + intelligence/3', { intelligence: 14 }).constant).toBe(4);
});
