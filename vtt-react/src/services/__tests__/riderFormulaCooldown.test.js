import { definitionFromWizard, EFFECT_CAPABILITY, isFormulaBundle, creatureSourceRefusal } from '../authoredAbility';
import { buildApproval, recordRoll } from '../spellConsequence';
import { termsFor } from '../authoredEffect';
import { replaceAuthoredRegistry, authoredSupport } from '../authoredAbilityRegistry';
import { TYPE } from '../authoredCooldown';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

// Formula-rider cooldowns (client mirror): the released formula rider (M4A immediate part + one movement OR Stunned effect) carries the
// released authenticated caster-start cooldown through the same compiler, registry support, approval disclosure and cooldown status.
const uuid = n => `31000000-0000-4000-8000-00000000000${n}`;
const target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 't', instanceId: 'target' };
const pc = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'p', instanceId: 'pc', ownerUid: 'u', characterId: 'c' };
const options = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
function saved({ kind = 'movement', formula = '2d6 + intelligence/3', cooldown = { cooldownType: TYPE, cooldownValue: 2 }, save = null } = {}) {
  const c = { profile: EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: -10, label: 'Mired' } : {}), expiryPolicy: 'target-next-end',
    durationText: 'Until the mire dries', gmNote: 'GM resolves range.', ...(save ? { save } : {}) };
  const d = { name: 'Mind Mire', description: '', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['damage', 'control'], controlConfig: { authoredCondition: c },
    damageConfig: { damageType: 'direct', elementType: 'ember', formula, resolution: 'DICE' }, resourceCost: { actionPoints: 2, mana: 3 },
    targetingConfig: { targetingType: 'single', maxTargets: 1, rangeDistance: 30, rangeType: 'ranged', targetRestrictions: ['any'] }, ...(cooldown ? { cooldownConfig: cooldown } : {}) };
  return { ...JSON.parse(JSON.stringify(d)), authoredDefinitionId: uuid(1), authoredDraft: d };
}
const id = `authored:${uuid(1)}:1:${'e'.repeat(64)}`;
const install = d => replaceAuthoredRegistry('r', [{ definitionRef: { roomId: 'r', definitionId: uuid(1), definitionVersion: 1, definitionHash: 'e'.repeat(64) }, canonicalDefinition: d,
  descriptor: { capabilityId: EFFECT_CAPABILITY, price: { ap: 2, mana: 3 }, effects: d.effects, timing: d.timing, cooldown: d.cooldown } }]);

test.each(['movement', 'stunned'])('%s rider + cooldown: the definition keeps the explicit cooldown; support exposes it beside the owner-attested scores; the approval carries the M4A binding; a changed score revalues the same faces', kind => {
  const d = definitionFromWizard(saved({ kind }), options).definition;
  expect(d.cooldown).toEqual({ cooldownType: TYPE, cooldownValue: 2 });
  expect(d.effects.direct).toEqual({ kind: 'damage', formula: '2d6 + intelligence/3', damageTypes: ['ember'] });
  expect(creatureSourceRefusal(d).code).toBe('unsupported_source_route');
  install(d);
  const support = authoredSupport(id, 'r', 'Arcanoneer', { intelligence: 14, spirit: 9 });
  expect(support).toMatchObject({ supported: true, kind: 'effect', effectTerms: termsFor(d), rollAttributes: { intelligence: 14 }, cooldown: { type: TYPE, value: 2, definitionId: uuid(1) } });
  const character = { id: 'c', stats: { intelligence: 14 }, actionPoints: { current: 4 }, mana: { current: 5 } };
  const tokens = [{ id: 't', mapId: 'm', state: { actorContract: { ...target, version: 1, revision: 3 }, currentHp: 20, tempHealth: 0, maxHp: 30, conditions: [] } },
    { id: 'p', mapId: 'm', ownerUserId: 'u', character, state: { actorContract: { ...pc, version: 1, revision: 7, primary: true }, conditions: [] } }];
  const roll = recordRoll('physical', support.reading, [[5, 2]]); expect(roll.total).toBe(11);
  const approval = buildApproval({ support, tokens, sourceRef: pc, targetRef: target, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, roll, approvalId: uuid(2) });
  expect(isFormulaBundle(approval)).toBe(true); expect(approval.rollAttributes).toEqual({ intelligence: 14 }); expect(approval.formulaSourceRevision).toBe(7);
  expect(recordRoll('physical', authoredSupport(id, 'r', 'Arcanoneer', { intelligence: 17 }).reading, roll.dice.map(g => g.faces)).total).toBe(12);
});

test('still manual with a cooldown: missing-health and deterministic parts, and invalid or legacy cooldown values (the save is its own route)', () => {
  // Fence update (formula-rider save cooldowns): the save is now its own route (formulaRiderSaveCooldown.test.js).
  expect(definitionFromWizard(saved({ save: { ability: 'constitution', dc: 13, outcome: 'negates' } }), options).definition.effects.save).toEqual({ scope: 'condition', ability: 'constitution', dc: 13, outcome: 'negates' });
  for (const f of ['2d6 + caster_missing_health/4', 'intelligence/3']) expect(definitionFromWizard(saved({ formula: f }), options).ok).toBe(false);
  for (const cooldown of [{ cooldownType: TYPE, cooldownValue: 0 }, { cooldownType: TYPE, cooldownValue: 11 }, { cooldownType: 'turn_based', cooldownValue: 1 }]) {
    expect(definitionFromWizard(saved({ cooldown }), options).ok).toBe(false);
  }
});
