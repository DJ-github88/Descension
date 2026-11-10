import { TYPE } from '../authoredCooldown';
import { definitionFromWizard, actionId, creatureSourceRefusal, isFormulaBundle, readScaledFormula, EFFECT_CAPABILITY } from '../authoredAbility';
import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { branchLines, branchesFor, conditionApplies, termsFor } from '../authoredEffect';
import { planSpellCommand, recordRoll } from '../spellConsequence';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import { explainExecution } from '../../components/spellcrafting-wizard/utils/executionCompatibility';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

// Formula-rider saves (client mirror): an attribute-scaled immediate part next to a movement OR Stunned rider may carry the rider-local
// "negates" save. Same compiler, registry support, owner disclosure and GM planner as the two installed routes; no new copy rule.
const id = '70000000-0000-4000-8000-0000000000e7';
const SAVE = { ability: 'constitution', dc: 12, outcome: 'negates' };
const conditions = {
  movement: { profile: 'authored-effect:v1', effect: 'movement', movementFeet: -10, label: 'Rime Hobble', expiryPolicy: 'target-next-end', durationText: 'Until the frost thaws', gmNote: 'The table rolls the save.' },
  stunned: { profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'gm-manual', durationText: 'Until shaken off', gmNote: 'The table rolls the save.' }
};
const wizard = ({ kind = 'movement', direct = 'damage', save = SAVE, formula, cooldownConfig = null } = {}) => ({
  name: `Disposable formula save ${kind}`, description: 'client mirror', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: [direct, 'control'],
  controlConfig: { authoredCondition: { ...conditions[kind], ...(save ? { save } : {}) } },
  ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'arcane', formula: formula || '2d6 + intelligence/3', resolution: 'DICE' } } : { healingConfig: { healingType: 'direct', formula: formula || '1d4 + spirit/2', resolution: 'DICE' } }),
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 },
  ...(cooldownConfig ? { cooldownConfig } : {}) });
const opts = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
const registry = () => require('../../../../server/services/installedDefinitionRegistry');
const record = draft => ({ ...draft, authoredDraft: draft, authoredDefinitionId: id });

test.each([['movement', 'damage', 'p14-save-branch-timed-formula-1', 'intelligence', 14], ['stunned', 'healing', 'p14-save-branch-formula-1', 'spirit', 9]])(
  'Wizard save/reopen/admit keeps the scaled part and the save on a %s rider with immediate %s; the owner sees both outcomes and attested scores', (kind, direct, compiler, attribute, score) => {
    const draft = wizard({ kind, direct }), reopened = deserializeSpell(serializeSpell(draft));
    expect(reopened.controlConfig.authoredCondition.save).toEqual(SAVE);
    const mapped = definitionFromWizard(record(reopened), opts); expect(mapped.ok).toBe(true);
    expect(mapped.definition.effects.save).toEqual({ scope: 'condition', ...SAVE }); expect(mapped.definition).not.toHaveProperty('cooldown');
    expect(creatureSourceRefusal(mapped.definition)).toMatchObject({ code: 'unsupported_source_route' });
    const compiled = registry().compileDefinition(mapped.definition); expect(compiled.ok).toBe(true); expect(compiled.descriptor.compilerVersion).toBe(compiler);
    replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
    const support = authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', { [attribute]: score });
    expect(support).toMatchObject({ supported: true, kind: 'effect', rollAttributes: { [attribute]: score }, cooldown: { type: 'none', value: 0 } });
    expect(support.effectTerms.save).toEqual({ scope: 'condition', ...SAVE });
    expect(support.reading.constant).toBe(Math.floor(score / (attribute === 'intelligence' ? 3 : 2)));
    expect(isFormulaBundle({ spell: { definitionHash: support.definitionHash }, effectTerms: support.effectTerms })).toBe(true);
    expect(branchLines(support.effectTerms).map(l => l.branch)).toEqual(['saved', 'failed']);
    expect(conditionApplies(support.effectTerms, 'saved')).toBe(false); expect(conditionApplies(support.effectTerms, 'failed')).toBe(true);
    const explained = explainExecution(record(draft), { shared: true, gm: true });
    expect(JSON.stringify(explained)).toMatch(/owner approves both outcomes/); expect(JSON.stringify(explained)).toMatch(/Rolling the save/);
    expect(explained.automated.join(' ')).toContain(`${direct === 'damage' ? 'arcane damage' : 'direct healing'} ${draft[`${direct}Config`].formula}`);
  });

test('the caster-start cooldown on this shape is its own route; other save shapes keep their own refusals; without the save the released formula rider is unchanged', () => {
  // Fence update (formula-rider save cooldowns): the cooldown on this shape is its own route (formulaRiderSaveCooldown.test.js).
  const cd = definitionFromWizard(record(wizard({ cooldownConfig: { cooldownType: TYPE, cooldownValue: 2 } })), opts);
  expect(cd.ok).toBe(true); expect(registry().compileDefinition(cd.definition).descriptor.compilerVersion).toBe('p14-save-branch-timed-formula-cooldown-1');
  const halves = definitionFromWizard(record(wizard({ save: { ...SAVE, outcome: 'halves' } })), opts); expect(halves.ok).toBe(false); expect(halves.reason).toMatch(/only "negates this effect"/);
  for (const f of ['2d6 + caster_missing_health/4', 'intelligence/3']) expect(definitionFromWizard(record(wizard({ formula: f })), opts).ok).toBe(false);
  const bare = definitionFromWizard(record(wizard({ save: null })), opts); expect(bare.ok).toBe(true);
  expect(registry().compileDefinition(bare.definition).descriptor.compilerVersion).toBe('p14-a10-effect-formula-1');
});

test('GM planner: the same scaled approval plans payment + HP on both outcomes; the rider only on "failed"; no branch refuses', () => {
  const mapped = definitionFromWizard(record(wizard()), opts).definition, terms = termsFor(mapped);
  const roll = recordRoll('physical', readScaledFormula(terms.direct.formula, { intelligence: 14 }), [[5, 2]]);
  const contract = (kind, tokenId, extra = {}) => ({ version: 1, kind, roomId: 'r', mapId: 'm', tokenId, instanceId: tokenId, revision: 3, ...extra });
  const sourceRef = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'pc', ownerUid: 'u', characterId: 'c' };
  const targetRef = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'B', instanceId: 'B' };
  const tokens = [
    { id: 'pc', mapId: 'm', ownerUserId: 'u', character: { id: 'c', stats: { intelligence: 14 }, actionPoints: { current: 4, max: 4 }, mana: { current: 10, max: 10 }, tempActionPoints: 0, tempMana: 0 }, state: { conditions: [], actorContract: contract('character', 'pc', { ownerUid: 'u', characterId: 'c', primary: true }) } },
    { id: 'B', mapId: 'm', name: 'B', stats: { maxHp: 30 }, state: { currentHp: 30, tempHealth: 4, maxHp: 30, conditions: [], actorContract: contract('creature', 'B') } }
  ];
  const approval = { version: 1, roomId: 'r', approvalId: '7a000000-0000-4000-8000-0000000000a1', source: sourceRef, target: targetRef, price: { ap: 1, mana: 2 }, classPayment: null, roll, rollAttributes: { intelligence: 14 },
    spell: { definitionId: `authored:${id}:1:${'a'.repeat(64)}`, definitionHash: `${EFFECT_CAPABILITY}/${'a'.repeat(64)}`, kind: 'effect' }, effectTerms: terms };
  expect(branchesFor(terms)).toEqual(['saved', 'failed']);
  const resolution = { gmConfirmed: true, timing: terms.timing, timingNote: 'GM ruling', evidence: '' };
  const plan = branch => planSpellCommand({ approval, contentHash: 'h', tokens, roomId: 'r', mapId: 'm', finalAmount: 11, reason: '', adjudicated: true, resolution, branch });
  const saved = plan('saved'), failed = plan('failed');
  for (const p of [saved, failed]) {
    expect(p.entries[0].finalResources).toEqual({ ap: { current: 3, temp: 0 }, mana: { current: 8, temp: 0 } });
    expect(p.entries[1].finalResources).toEqual({ hp: { current: 23, temp: 0 } });
  }
  expect(saved.entries[1]).not.toHaveProperty('conditions'); expect(failed.entries[1].conditions).toHaveLength(1);
  expect(JSON.parse(saved.extra.adjudication.chosenResult)).toMatchObject({ branch: 'saved', conditionApplied: false });
  expect(JSON.parse(failed.extra.adjudication.chosenResult)).toMatchObject({ branch: 'failed', conditionApplied: true });
  expect(() => plan(undefined)).toThrow(/saved or failed/);
});
