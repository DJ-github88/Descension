import { TYPE, key, procedure, status } from '../authoredCooldown';
import { definitionFromWizard, actionId } from '../authoredAbility';
import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import { positionKey } from '../sharedEffectTiming';
const id = '11111111-1111-4111-8111-111111111111';
const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i', ownerUid: 'u', characterId: 'c' };
test.each(['1d6 + intelligence/3', 'caster_missing_health/4', '7'])('Wizard save/reopen/admit retains exact cooldown and existing formula %s', formula => {
  const draft = { name: 'Cooldown test', description: 'One direct healing.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['healing'],
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 3 },
    cooldownConfig: { cooldownType: TYPE, cooldownValue: 2 }, healingConfig: { healingType: 'direct', resolution: 'DICE', formula } };
  const reopened = deserializeSpell(serializeSpell(draft)); expect(reopened.cooldownConfig).toEqual(draft.cooldownConfig);
  const mapped = definitionFromWizard({ ...reopened, authoredDraft: reopened, authoredDefinitionId: id }, { roomId: 'r', classId: 'arcanoneer', definitionVersion: 1 }); expect(mapped.ok).toBe(true);
  const compiled = require('../../../../server/services/installedDefinitionRegistry').compileDefinition(mapped.definition); expect(compiled.ok).toBe(true);
  expect(compiled.descriptor.cooldown).toEqual(draft.cooldownConfig); expect(compiled.descriptor.compilerVersion).toBe('p14-wizard-cooldown-1');
  replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
  const support = authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', { intelligence: 18 }, { current: 23, max: 40 });
  expect(support).toMatchObject({ supported: true, cooldown: { type: TYPE, value: 2, definitionId: id } });
  const forged = { ...mapped.definition, cooldown: { ...mapped.definition.cooldown, round: true } }; expect(require('../../../../server/services/installedDefinitionRegistry').compileDefinition(forged).ok).toBe(false);
});
test('canonical combat projection displays remaining and exact boundary, not a wall-clock countdown', () => {
  const token = { state: { authoredCooldowns: { [key(source, id)]: { combatId: id, dueSequence: 6, occurrences: 2, period: 3 } } } };
  const combat = { isActive: true, round: 1, currentTurnIndex: 0, turnOrder: [source, {}, {}].map(actorRef => ({ actorRef })), effectLifecycle: { version: 1, id, sequence: 0 } };
  combat.effectLifecycle.positionKey = positionKey(combat);
  expect(status(token, combat, source, id)).toMatchObject({ blocked: true, remaining: 2, dueSequence: 6 });
  combat.effectLifecycle.sequence = 3; expect(status(token, combat, source, id).remaining).toBe(1);
  expect(status(token, combat, source, id).label).toMatch(/boundary 6/);
  expect(status(token, { ...combat, isActive: false }, source, id).code).toBe('cooldown_clock_retired');
  expect(status({ state: { authoredCooldowns: {} } }, combat, source, id).blocked).toBe(false);
  expect(key(source, id)).not.toBe(key({ ...source, instanceId: 'replacement' }, id)); expect(procedure(2)).toMatch(/ongoing turn does not count/);
});
