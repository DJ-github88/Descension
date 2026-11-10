import { TYPE, procedure } from '../authoredCooldown';
import { definitionFromWizard, actionId, creatureSourceRefusal } from '../authoredAbility';
import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import { explainExecution, STATES } from '../../components/spellcrafting-wizard/utils/executionCompatibility';
import { cooldownSeparation } from '../../components/hud/SpellConsequencePanel';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

// Effect cooldowns (client mirror): the installed authenticated caster-start cooldown on a standalone periodic effect and on a
// movement OR Stunned rider (with or without its plain immediate part). Same procedure, same server-authoritative check.
const id = '70000000-0000-4000-8000-000000000002';
const condition = {
  periodic: { profile: 'authored-effect:v1', effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d4', periodicDamageType: 'blight', tickRoll: 'each-tick', label: 'Cinder Brand',
    expiryPolicy: 'target-start-count', occurrences: 3, durationText: 'While the cinders glow', gmNote: 'GM resolves range before confirming.' },
  movement: { profile: 'authored-effect:v1', effect: 'movement', movementFeet: -10, label: 'Hobbled', expiryPolicy: 'target-next-end', durationText: 'Until the embers cool', gmNote: 'GM resolves range.' },
  stunned: { profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'gm-manual', durationText: 'Until shaken off', gmNote: 'GM resolves range.' },
};
const wizard = ({ kind = 'periodic', direct = false, cooldownConfig = { cooldownType: TYPE, cooldownValue: 2 } } = {}) => ({
  name: `Disposable ${kind}`, description: 'client mirror', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: direct ? ['damage', 'control'] : ['control'],
  controlConfig: { authoredCondition: { ...condition[kind] } },
  ...(direct ? { damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+2', resolution: 'DICE' } } : {}),
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 },
  ...(cooldownConfig ? { cooldownConfig } : {}) });
const opts = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
const registry = () => require('../../../../server/services/installedDefinitionRegistry');
const record = draft => ({ ...draft, authoredDraft: draft, authoredDefinitionId: id });

test.each([['periodic', false, 'p14-m5-periodic-cooldown-1'], ['movement', false, 'p14-a10-effect-cooldown-1'], ['movement', true, 'p14-a10-effect-cooldown-1'],
  ['stunned', false, 'p14-a10-effect-cooldown-1'], ['stunned', true, 'p14-a10-effect-cooldown-1']])('Wizard save/reopen/admit keeps the exact cooldown on a %s effect (immediate part: %s)', (kind, direct, compiler) => {
  const draft = wizard({ kind, direct }), reopened = deserializeSpell(serializeSpell(draft));
  expect(reopened.cooldownConfig).toEqual(draft.cooldownConfig);
  const mapped = definitionFromWizard(record(reopened), opts); expect(mapped.ok).toBe(true);
  expect(mapped.definition.cooldown).toEqual({ cooldownType: TYPE, cooldownValue: 2 });
  expect(creatureSourceRefusal(mapped.definition)).toMatchObject({ code: 'unsupported_source_route' });
  const compiled = registry().compileDefinition(mapped.definition); expect(compiled.ok).toBe(true);
  expect(compiled.descriptor.compilerVersion).toBe(compiler);
  replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
  const support = authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', {});
  expect(support).toMatchObject({ supported: true, kind: 'effect', cooldown: { type: TYPE, value: 2, definitionId: id } });
  expect(support.effectTerms).not.toHaveProperty('cooldown');
  expect(explainExecution(record(draft), { shared: true, gm: true }).automated).toContain(procedure(2));
});

test('attribute cooldown scope fence extended (attributeCooldown.test.js); without a cooldown the same bundles report none', () => {
  const attribute = wizard({ kind: 'movement' }); attribute.controlConfig.authoredCondition = { profile: 'authored-effect:v1', effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden', expiryPolicy: 'gm-manual', durationText: 'x', gmNote: 'y' };
  const saved = wizard({ kind: 'stunned', direct: true }); saved.controlConfig.authoredCondition.save = { ability: 'constitution', dc: 13, outcome: 'negates' };
  { const r = definitionFromWizard(record(attribute), opts); expect(r.ok).toBe(true); expect(registry().compileDefinition(r.definition).descriptor.compilerVersion).toBe('p14-a10-attribute-cooldown-1'); }
  // Fence update (rider-save cooldowns): the Stunned save bundle with its plain immediate part now maps with the cooldown.
  expect(registry().compileDefinition(definitionFromWizard(record(saved), opts).definition).descriptor.compilerVersion).toBe('p14-save-branch-cooldown-1');
  for (const d of [attribute, saved]) expect(definitionFromWizard(record({ ...d, cooldownConfig: undefined }), opts).ok).toBe(true);
  const legacy = wizard({ kind: 'movement', cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 } });
  expect(explainExecution(record(legacy), { shared: true }).state).toBe(STATES.UNSUPPORTED);
  const plain = definitionFromWizard(record(wizard({ kind: 'stunned', cooldownConfig: null })), opts);
  const compiled = registry().compileDefinition(plain.definition); expect(compiled.descriptor.compilerVersion).toBe('p14-a10-effect-1');
  replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
  expect(authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', {}).cooldown).toEqual({ type: 'none', value: 0 });
});

test('owner panel copy names the applied effect and keeps the periodic wording byte-equal', () => {
  expect(cooldownSeparation({ kind: 'periodic', label: 'Cinder Brand' })).toBe(' Separate from the periodic effect: its ticks keep their own count, and removing the effect or resolving its last tick does not release the cooldown.');
  expect(cooldownSeparation({ kind: 'movement', feet: -10, label: 'Hobbled' })).toBe(' Separate from the Hobbled effect: it keeps its own duration; removing or expiring it does not release the cooldown, and the cooldown\'s release does not remove it.');
  expect(cooldownSeparation({ kind: 'stunned' })).toContain('Separate from the Stunned effect');
  expect(cooldownSeparation({ kind: 'damageReduction', amount: 3, label: 'Ward' })).toContain('Separate from the Ward effect');
  expect(cooldownSeparation(undefined)).toBe('');
});
