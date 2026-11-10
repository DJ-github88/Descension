import { TYPE, procedure } from '../authoredCooldown';
import { definitionFromWizard, actionId, creatureSourceRefusal } from '../authoredAbility';
import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { branchLines, conditionApplies } from '../authoredEffect';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import { explainExecution } from '../../components/spellcrafting-wizard/utils/executionCompatibility';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

// Rider-save cooldowns (client mirror): a movement OR Stunned rider with its plain immediate part and one rider-local "negates" save
// may carry the authenticated caster-start cooldown. Same compiler, registry support and server-authoritative check; no new copy rule.
const id = '70000000-0000-4000-8000-0000000000d6';
const SAVE = { ability: 'constitution', dc: 12, outcome: 'negates' };
const conditions = {
  movement: { profile: 'authored-effect:v1', effect: 'movement', movementFeet: -10, label: 'Rime Hobble', expiryPolicy: 'target-next-end', durationText: 'Until the frost thaws', gmNote: 'The table rolls the save.' },
  stunned: { profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'gm-manual', durationText: 'Until shaken off', gmNote: 'The table rolls the save.' }
};
const wizard = ({ kind = 'movement', direct = 'damage', save = SAVE, formula, cooldownConfig = { cooldownType: TYPE, cooldownValue: 3 } } = {}) => ({
  name: `Disposable save ${kind}`, description: 'client mirror', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: [direct, 'control'],
  controlConfig: { authoredCondition: { ...conditions[kind], ...(save ? { save } : {}) } },
  ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'rime', formula: formula || '1d6+2', resolution: 'DICE' } } : { healingConfig: { healingType: 'direct', formula: formula || '2d4', resolution: 'DICE' } }),
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 },
  ...(cooldownConfig ? { cooldownConfig } : {}) });
const opts = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
const registry = () => require('../../../../server/services/installedDefinitionRegistry');
const record = draft => ({ ...draft, authoredDraft: draft, authoredDefinitionId: id });

test.each([['movement', 'damage', 'p14-save-branch-timed-cooldown-1'], ['stunned', 'healing', 'p14-save-branch-cooldown-1']])(
  'Wizard save/reopen/admit keeps the exact cooldown and the save on a %s rider with immediate %s; the owner sees both outcomes and the cooldown', (kind, direct, compiler) => {
    const draft = wizard({ kind, direct }), reopened = deserializeSpell(serializeSpell(draft));
    expect(reopened.cooldownConfig).toEqual(draft.cooldownConfig); expect(reopened.controlConfig.authoredCondition.save).toEqual(SAVE);
    const mapped = definitionFromWizard(record(reopened), opts); expect(mapped.ok).toBe(true);
    expect(mapped.definition.cooldown).toEqual({ cooldownType: TYPE, cooldownValue: 3 });
    expect(mapped.definition.effects.save).toEqual({ scope: 'condition', ...SAVE });
    expect(creatureSourceRefusal(mapped.definition)).toMatchObject({ code: 'unsupported_source_route' });
    const compiled = registry().compileDefinition(mapped.definition); expect(compiled.ok).toBe(true); expect(compiled.descriptor.compilerVersion).toBe(compiler);
    replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
    const support = authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', {});
    expect(support).toMatchObject({ supported: true, kind: 'effect', cooldown: { type: TYPE, value: 3, definitionId: id } });
    expect(support.effectTerms.save).toEqual({ scope: 'condition', ...SAVE }); expect(support.effectTerms).not.toHaveProperty('cooldown');
    expect(branchLines(support.effectTerms).map(l => l.branch)).toEqual(['saved', 'failed']);
    expect(conditionApplies(support.effectTerms, 'saved')).toBe(false); expect(conditionApplies(support.effectTerms, 'failed')).toBe(true);
    expect(explainExecution(record(draft), { shared: true, gm: true }).automated).toContain(procedure(3));
  });

test('other save shapes with the cooldown stay manual for their own reasons; without the cooldown the released save bundles are unchanged', () => {
  const scaled = definitionFromWizard(record(wizard({ formula: '2d6 + intelligence/3' })), opts);
  // Fence update (formula-rider save cooldowns): the scaled shape is now its own route (formulaRiderSaveCooldown.test.js).
  expect(scaled.ok).toBe(true); expect(registry().compileDefinition(scaled.definition).descriptor.compilerVersion).toBe('p14-save-branch-timed-formula-cooldown-1');
  const halves = definitionFromWizard(record(wizard({ save: { ...SAVE, outcome: 'halves' } })), opts); expect(halves.ok).toBe(false); expect(halves.reason).toMatch(/only "negates this effect"/);
  const attribute = wizard(); attribute.controlConfig.authoredCondition = { profile: 'authored-effect:v1', effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden', expiryPolicy: 'gm-manual', durationText: 'x', gmNote: 'y', save: SAVE };
  const a = definitionFromWizard(record(attribute), opts); expect(a.ok).toBe(false); expect(a.reason).toMatch(/Cooldowns currently require/);
  expect(definitionFromWizard(record({ ...attribute, cooldownConfig: undefined }), opts).ok).toBe(true);
  for (const [kind, direct, label] of [['movement', 'damage', 'p14-save-branch-timed-1'], ['stunned', 'healing', 'p14-save-branch-1']]) {
    const plain = definitionFromWizard(record(wizard({ kind, direct, cooldownConfig: null })), opts); expect(plain.ok).toBe(true); expect(plain.definition).not.toHaveProperty('cooldown');
    expect(registry().compileDefinition(plain.definition).descriptor.compilerVersion).toBe(label);
  }
});
