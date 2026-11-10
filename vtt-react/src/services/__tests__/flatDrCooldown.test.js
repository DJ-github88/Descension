import { TYPE, procedure } from '../authoredCooldown';
import { definitionFromWizard, actionId, creatureSourceRefusal } from '../authoredAbility';
import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import { explainExecution, STATES } from '../../components/spellcrafting-wizard/utils/executionCompatibility';
import { cooldownSeparation } from '../../components/hud/SpellConsequencePanel';
jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));
const id = '70000000-0000-4000-8000-0000000000d1';
const opts = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
const registry = () => require('../../../../server/services/installedDefinitionRegistry');
const record = d => ({ ...d, authoredDraft: d, authoredDefinitionId: id });
const wizard = (direct = null) => ({
  name: 'DR Ward', description: 'Disposable fixture', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
  effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: { profile: 'authored-effect:v1', effect: 'damageReduction',
    drAmount: 3, label: 'DR Ward', expiryPolicy: 'gm-manual', durationText: 'While the ward holds', gmNote: 'GM confirms range.' } },
  ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '1d6+2', resolution: 'DICE' } } : {}),
  ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula: '1d6+2', resolution: 'DICE' } } : {}),
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 },
  cooldownConfig: { cooldownType: TYPE, cooldownValue: 2 }
});
test.each([null, 'damage', 'healing'])('flat DR + %s: save/reopen/admit/support preserves the whole effect and cooldown', direct => {
  const draft = wizard(direct), reopened = deserializeSpell(serializeSpell(draft));
  expect(reopened.cooldownConfig).toEqual(draft.cooldownConfig); expect(reopened.controlConfig.authoredCondition).toEqual(draft.controlConfig.authoredCondition);
  const mapped = definitionFromWizard(record(reopened), opts); expect(mapped.ok).toBe(true);
  expect(mapped.definition.effects.condition).toEqual({ kind: 'damageReduction', amount: 3, label: 'DR Ward' });
  if (!direct) expect(mapped.definition.effects.direct).toBeNull();
  const compiled = registry().compileDefinition(mapped.definition); expect(compiled.ok).toBe(true);
  expect(compiled.descriptor.compilerVersion).toBe('p14-a10-flat-dr-cooldown-1');
  replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
  expect(authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', {})).toMatchObject({ supported: true, kind: 'effect',
    cooldown: { type: TYPE, value: 2, definitionId: id }, effectTerms: { condition: { kind: 'damageReduction', amount: 3 } } });
  expect(explainExecution(record(reopened), { shared: true, gm: true }).automated).toContain(procedure(2));
  expect(creatureSourceRefusal(mapped.definition)).toMatchObject({ code: 'unsupported_source_route' });
  expect(cooldownSeparation(mapped.definition.effects.condition)).toContain('removing or expiring it does not release the cooldown');
  expect(cooldownSeparation(mapped.definition.effects.condition)).toContain("cooldown's release does not remove it");
});
test('bounds, save, nonplain direct and legacy timing stay refused; structured expiry and 1/10 starts retain exact values', () => {
  for (const amount of [0, -1, 21, 1.5]) { const d = wizard(); d.controlConfig.authoredCondition.drAmount = amount; expect(definitionFromWizard(record(d), opts).ok).toBe(false); }
  for (const change of [d => { d.controlConfig.authoredCondition.save = { ability: 'agility', dc: 12, outcome: 'negates' }; },
    d => { d.damageConfig.formula = '1d6 + intelligence'; }, d => { d.damageConfig.formula = 'intelligence'; }, d => { d.damageConfig.formula = '1d6 + missingHealth'; }]) {
    const d = wizard('damage'); change(d); expect(definitionFromWizard(record(d), opts).ok).toBe(false);
  }
  for (const starts of [1, 10]) {
    const d = wizard(); d.cooldownConfig.cooldownValue = starts; Object.assign(d.controlConfig.authoredCondition, { expiryPolicy: 'target-end-count', occurrences: 2 });
    const mapped = definitionFromWizard(record(d), opts); expect(mapped.ok).toBe(true); expect(mapped.definition.cooldown.cooldownValue).toBe(starts);
    expect(mapped.definition.timing).toMatchObject({ expiryPolicy: 'target-end-count', occurrences: 2 });
  }
  const legacy = wizard(); legacy.cooldownConfig = { cooldownType: 'turn_based', cooldownValue: 2 };
  expect(explainExecution(record(legacy), { shared: true }).state).toBe(STATES.UNSUPPORTED);
});
test('no-cooldown standalone/damage/healing definition and descriptor equal actual frozen-base compiler outputs', () => {
  const pinned = require('../__test_support__/flatDrCooldownBase.json');
  for (const direct of [null, 'damage', 'healing']) {
    const d = wizard(direct); delete d.cooldownConfig;
    const mapped = definitionFromWizard(record(d), opts), compiled = registry().compileDefinition(mapped.definition), base = pinned[String(direct)];
    expect(mapped.definition).toEqual(base.definition); expect(compiled.definitionHash).toBe(base.definitionHash); expect(compiled.descriptor).toEqual(base.descriptor);
  }
});
