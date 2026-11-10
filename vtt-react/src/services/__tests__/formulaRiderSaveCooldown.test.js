import { TYPE, procedure } from '../authoredCooldown';
import { definitionFromWizard, actionId, creatureSourceRefusal, isFormulaBundle } from '../authoredAbility';
import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { branchLines, conditionApplies } from '../authoredEffect';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import { explainExecution } from '../../components/spellcrafting-wizard/utils/executionCompatibility';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

// Formula-rider save cooldowns (client mirror): the attribute-scaled part + movement/Stunned rider + rider-local negates save may carry the
// authenticated caster-start cooldown. Same compiler, registry support and server-authoritative check; no new copy rule.
const id = '70000000-0000-4000-8000-0000000000e8';
const SAVE = { ability: 'constitution', dc: 12, outcome: 'negates' };
const conditions = {
  movement: { profile: 'authored-effect:v1', effect: 'movement', movementFeet: -10, label: 'Rime Hobble', expiryPolicy: 'target-end-count', occurrences: 2, durationText: 'Until the frost thaws', gmNote: 'The table rolls the save.' },
  stunned: { profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'gm-manual', durationText: 'Until shaken off', gmNote: 'The table rolls the save.' }
};
const wizard = ({ kind = 'movement', direct = 'damage', cooldownConfig = { cooldownType: TYPE, cooldownValue: 3 } } = {}) => ({
  name: `Disposable formula save cooldown ${kind}`, description: 'client mirror', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: [direct, 'control'],
  controlConfig: { authoredCondition: { ...conditions[kind], save: SAVE } },
  ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '2d6 + intelligence/3', resolution: 'DICE' } } : { healingConfig: { healingType: 'direct', formula: '1d4 + spirit/2', resolution: 'DICE' } }),
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 },
  ...(cooldownConfig ? { cooldownConfig } : {}) });
const opts = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
const registry = () => require('../../../../server/services/installedDefinitionRegistry');
const record = draft => ({ ...draft, authoredDraft: draft, authoredDefinitionId: id });

test.each([['movement', 'damage', 'p14-save-branch-timed-formula-cooldown-1', 'intelligence'], ['stunned', 'healing', 'p14-save-branch-formula-cooldown-1', 'spirit']])(
  'Wizard save/reopen/admit keeps the cooldown, the save and the scaled part on a %s rider with immediate %s; the owner sees both outcomes, attested scores and the cooldown', (kind, direct, compiler, attribute) => {
    const draft = wizard({ kind, direct }), reopened = deserializeSpell(serializeSpell(draft));
    expect(reopened.cooldownConfig).toEqual(draft.cooldownConfig); expect(reopened.controlConfig.authoredCondition.save).toEqual(SAVE);
    const mapped = definitionFromWizard(record(reopened), opts); expect(mapped.ok).toBe(true);
    expect(mapped.definition.cooldown).toEqual({ cooldownType: TYPE, cooldownValue: 3 }); expect(mapped.definition.effects.save).toEqual({ scope: 'condition', ...SAVE });
    expect(creatureSourceRefusal(mapped.definition)).toMatchObject({ code: 'unsupported_source_route' });
    const compiled = registry().compileDefinition(mapped.definition); expect(compiled.descriptor.compilerVersion).toBe(compiler);
    replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
    const support = authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', { [attribute]: 12 });
    expect(support).toMatchObject({ supported: true, kind: 'effect', rollAttributes: { [attribute]: 12 }, cooldown: { type: TYPE, value: 3, definitionId: id } });
    expect(support.effectTerms.save).toEqual({ scope: 'condition', ...SAVE }); expect(support.effectTerms).not.toHaveProperty('cooldown');
    expect(isFormulaBundle({ spell: { definitionHash: support.definitionHash }, effectTerms: support.effectTerms })).toBe(true);
    expect(branchLines(support.effectTerms).map(l => l.branch)).toEqual(['saved', 'failed']);
    expect(conditionApplies(support.effectTerms, 'saved')).toBe(false); expect(conditionApplies(support.effectTerms, 'failed')).toBe(true);
    expect(explainExecution(record(draft), { shared: true, gm: true }).automated).toContain(procedure(3));
  });

test('invalid cooldowns on this shape stay manual; without the cooldown the formula-rider save route is unchanged', () => {
  for (const cooldownConfig of [{ cooldownType: TYPE, cooldownValue: 0 }, { cooldownType: TYPE, cooldownValue: 11 }, { cooldownType: 'turn_based', cooldownValue: 1 }]) {
    expect(definitionFromWizard(record(wizard({ cooldownConfig })), opts).ok).toBe(false);
  }
  const bare = definitionFromWizard(record(wizard({ cooldownConfig: null })), opts); expect(bare.ok).toBe(true);
  expect(registry().compileDefinition(bare.definition).descriptor.compilerVersion).toBe('p14-save-branch-timed-formula-1');
});
