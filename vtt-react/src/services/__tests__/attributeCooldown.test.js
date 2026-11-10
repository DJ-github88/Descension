import { TYPE, procedure } from '../authoredCooldown';
import { definitionFromWizard, actionId, creatureSourceRefusal } from '../authoredAbility';
import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import { explainExecution, STATES } from '../../components/spellcrafting-wizard/utils/executionCompatibility';
import { cooldownSeparation } from '../../components/hud/SpellConsequencePanel';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));
const id = '70000000-0000-4000-8000-0000000000c1';
const opts = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
const registry = () => require('../../../../server/services/installedDefinitionRegistry');
const record = d => ({ ...d, authoredDraft: d, authoredDefinitionId: id });
const wizard = (attribute = 'intelligence', direct = null) => ({
  name: 'Attribute Charm', description: 'Disposable fixture', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
  effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: { profile: 'authored-effect:v1', effect: 'attribute', attribute,
    attributeAmount: -2, label: 'Attribute Charm', expiryPolicy: 'gm-manual', durationText: 'While the charm holds', gmNote: 'GM confirms range.' } },
  ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '1d6+2', resolution: 'DICE' } } : {}),
  ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula: '1d6+2', resolution: 'DICE' } } : {}),
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 },
  cooldownConfig: { cooldownType: TYPE, cooldownValue: 2 }
});
test.each(['agility', 'intelligence', 'spirit'])('%s standalone: save/reopen/admit/support preserves the complete effect and cooldown without a fake roll', attribute => {
  const draft = wizard(attribute), reopened = deserializeSpell(serializeSpell(draft));
  expect(reopened.cooldownConfig).toEqual(draft.cooldownConfig);
  expect(reopened.controlConfig.authoredCondition).toEqual(draft.controlConfig.authoredCondition);
  const mapped = definitionFromWizard(record(reopened), opts); expect(mapped.ok).toBe(true);
  expect(mapped.definition.effects).toEqual({ direct: null, condition: { kind: 'attribute', attribute, amount: -2, label: 'Attribute Charm' } });
  const compiled = registry().compileDefinition(mapped.definition); expect(compiled.ok).toBe(true);
  expect(compiled.descriptor.compilerVersion).toBe('p14-a10-attribute-cooldown-1');
  replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
  expect(authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', {})).toMatchObject({ supported: true, kind: 'effect',
    cooldown: { type: TYPE, value: 2, definitionId: id }, effectTerms: { direct: null, condition: { kind: 'attribute', attribute, amount: -2 } } });
  expect(explainExecution(record(reopened), { shared: true, gm: true }).automated).toContain(procedure(2));
  expect(creatureSourceRefusal(mapped.definition)).toMatchObject({ code: 'unsupported_source_route' });
  expect(cooldownSeparation(mapped.definition.effects.condition)).toContain('removing or expiring it does not release the cooldown');
  expect(cooldownSeparation(mapped.definition.effects.condition)).toContain("cooldown's release does not remove it");
});
test.each(['damage', 'healing'])('plain %s part uses the same bundle and label', direct => {
  const mapped = definitionFromWizard(record(wizard('agility', direct)), opts); expect(mapped.ok).toBe(true);
  expect(mapped.definition.effects.direct).toMatchObject({ kind: direct, formula: '1d6+2' });
  expect(registry().compileDefinition(mapped.definition).descriptor.compilerVersion).toBe('p14-a10-attribute-cooldown-1');
});
test('save and scaled direct stay refused; structured expiry and 1/10 starts retain their exact values; held attributes/legacy timing stay manual', () => {
  for (const change of [d => { d.controlConfig.authoredCondition.save = { ability: 'agility', dc: 12, outcome: 'negates' }; },
    d => { d.damageConfig.formula = '1d6 + intelligence'; }]) {
    const d = wizard('agility', 'damage'); change(d); expect(definitionFromWizard(record(d), opts).ok).toBe(false);
  }
  for (const attribute of ['strength', 'constitution', 'charisma']) expect(definitionFromWizard(record(wizard(attribute)), opts).ok).toBe(false);
  for (const starts of [1, 10]) {
    const d = wizard(); d.cooldownConfig.cooldownValue = starts; Object.assign(d.controlConfig.authoredCondition, { expiryPolicy: 'target-end-count', occurrences: 2 });
    const mapped = definitionFromWizard(record(d), opts); expect(mapped.ok).toBe(true); expect(mapped.definition.cooldown.cooldownValue).toBe(starts);
    expect(mapped.definition.timing).toMatchObject({ expiryPolicy: 'target-end-count', occurrences: 2 });
  }
  const legacy = wizard(); legacy.cooldownConfig = { cooldownType: 'turn_based', cooldownValue: 2 };
  expect(explainExecution(record(legacy), { shared: true }).state).toBe(STATES.UNSUPPORTED);
});
test('no-cooldown definition and descriptor bytes equal the frozen base compiler output', () => {
  // Generated once from frozen pre-change modules (BASE_NO_COOLDOWN.json); guards stale hashes as well as shape.
  const pinned = require('../__test_support__/attributeCooldownBase.json');
  const d = wizard(); delete d.cooldownConfig;
  const mapped = definitionFromWizard(record(d), opts); const compiled = registry().compileDefinition(mapped.definition);
  expect(mapped.definition).toEqual(pinned.definition); expect(compiled.definitionHash).toBe(pinned.definitionHash); expect(compiled.descriptor).toEqual(pinned.descriptor);
});
