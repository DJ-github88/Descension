import { TYPE, procedure } from '../authoredCooldown';
import { definitionFromWizard, actionId } from '../authoredAbility';
import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import { explainExecution, STATES } from '../../components/spellcrafting-wizard/utils/executionCompatibility';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

// Composed cooldowns (client mirror): the installed authenticated caster-start cooldown on an immediate + periodic bundle.
const id = '70000000-0000-4000-8000-000000000001';
const wizard = ({ cooldownConfig = { cooldownType: TYPE, cooldownValue: 3 }, occurrences = 2, nowFormula = '1d6+2' } = {}) => {
  const c = { profile: 'authored-effect:v1', effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d4', periodicDamageType: 'blight', tickRoll: 'each-tick', label: 'Cinder Brand',
    expiryPolicy: 'target-start-count', occurrences, durationText: 'While the cinders glow', gmNote: 'GM resolves range before confirming.' };
  return { name: 'Disposable Cinder Brand', description: 'client mirror', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['damage', 'control'], controlConfig: { authoredCondition: c },
    damageConfig: { damageType: 'direct', elementType: nowFormula.includes('intelligence') ? 'blight' : 'ember', formula: nowFormula, resolution: 'DICE' },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 },
    ...(cooldownConfig ? { cooldownConfig } : {}) };
};
const opts = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
const registry = () => require('../../../../server/services/installedDefinitionRegistry');

test.each(['1d6+2', '2d8 + intelligence/3'])('Wizard save/reopen/admit keeps the exact cooldown on an immediate (%s) + periodic bundle, separate from the tick count', nowFormula => {
  const draft = wizard({ nowFormula }), reopened = deserializeSpell(serializeSpell(draft));
  expect(reopened.cooldownConfig).toEqual(draft.cooldownConfig);
  expect(reopened.controlConfig.authoredCondition.occurrences).toBe(2);
  const mapped = definitionFromWizard({ ...reopened, authoredDraft: reopened, authoredDefinitionId: id }, opts); expect(mapped.ok).toBe(true);
  expect(mapped.definition.cooldown).toEqual({ cooldownType: TYPE, cooldownValue: 3 }); expect(mapped.definition.timing.occurrences).toBe(2);
  const compiled = registry().compileDefinition(mapped.definition); expect(compiled.ok).toBe(true);
  expect(compiled.descriptor.compilerVersion).toBe(nowFormula.includes('intelligence') ? 'p14-m5-composition-formula-cooldown-1' : 'p14-m5-composition-cooldown-1');
  replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
  const support = authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', { intelligence: 14 });
  expect(support).toMatchObject({ supported: true, kind: 'effect', cooldown: { type: TYPE, value: 3, definitionId: id } });
  expect(support.effectTerms).not.toHaveProperty('cooldown');
});

test('compatibility view: the composed bundle with the explicit cooldown is a supported (partial) route that lists the cooldown procedure; legacy timing stays unsupported', () => {
  const record = { ...wizard(), authoredDraft: wizard(), authoredDefinitionId: id };
  const view = explainExecution(record, { shared: true, gm: true });
  expect(view.state).toBe(STATES.PARTIAL); // the periodic expiry still needs authenticated turn tracking (unchanged)
  expect(view.automated).toContain(procedure(3));
  const legacy = { ...wizard({ cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 } }) };
  expect(explainExecution({ ...legacy, authoredDraft: legacy, authoredDefinitionId: id }, { shared: true }).state).toBe(STATES.UNSUPPORTED);
});

test('a bundle without a cooldown reports none (unchanged)', () => {
  const mapped = definitionFromWizard({ ...wizard({ cooldownConfig: null }), authoredDraft: wizard({ cooldownConfig: null }), authoredDefinitionId: id }, opts);
  const compiled = registry().compileDefinition(mapped.definition); expect(compiled.descriptor.compilerVersion).toBe('p14-m5-composition-1');
  replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
  expect(authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', {}).cooldown).toEqual({ type: 'none', value: 0 });
});
