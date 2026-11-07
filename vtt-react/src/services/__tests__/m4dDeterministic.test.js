import { readDeterministicFormula, readScaledFormula, readHealthFormula, DETERMINISTIC_CAPABILITY, definitionFromWizard, actionId } from '../authoredAbility';
import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { recordRoll, digitalRoll, buildApproval, planSpellCommand, spellReceipt } from '../spellConsequence';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';

test('zero-dice shared vocabulary, floor, clamp, signed and aggregate bounds; old readers remain dice-only', () => {
  for (const [formula, constant] of [['7', 7], ['intelligence', 19], ['intelligence/4', 4], ['caster_missing_health/4', 4], ['0', 0], ['-2', -2], ['intelligence_modifier', 4], ['intelligence * 2 - 1', 37]]) {
    const reading = readDeterministicFormula(formula, { intelligence: 19 }, { current: 23, max: 40 });
    expect(reading).toMatchObject({ supported: true, dice: [], constant });
    expect(recordRoll('deterministic', reading, [])).toMatchObject({ mode: 'deterministic', dice: [], total: constant });
    const random = jest.fn(); expect(() => digitalRoll(reading, random)).toThrow(); expect(random).not.toHaveBeenCalled();
    expect(() => recordRoll('physical', reading, [])).toThrow();
    expect(readScaledFormula(formula, { intelligence: 19 }).supported).toBe(false);
    expect(readHealthFormula(formula, { intelligence: 19 }, { current: 23, max: 40 }).supported).toBe(false);
  }
  for (const formula of ['', '1d8', '1d8+intelligence', 'intelligence/0', 'intelligence/1.5', 'intelligence*1.5', 'intelligence++2', '10001', '-10001', '(maxHealth-currentHealth)/4', 'target_missing_health', 'caster_missing_health()', 'intelligence.constructor', 'eval(7)']) expect(readDeterministicFormula(formula, { intelligence: 19 }, { current: 23, max: 40 }).supported).toBe(false);
  for (const health of [undefined, null, [], { current: 1.5, max: 40 }, { current: 23, max: 40, temp: 9 }]) expect(readDeterministicFormula('caster_missing_health/4', {}, health).supported).toBe(false);
  expect(readDeterministicFormula('caster_missing_health/4', {}, { current: 41, max: 40 }).constant).toBe(0);
  expect(readDeterministicFormula('caster_missing_health/4', {}, { current: 0, max: 40001 }).constant).toBe(10000);
  expect(readDeterministicFormula('caster_missing_health/4', {}, { current: 0, max: 40004 }).supported).toBe(false);
});

test.each(['7', 'intelligence', 'intelligence/4', 'caster_missing_health/4'])('real Wizard save/reopen %s maps v4 and client/server agree through command and receipt', formula => {
  const d = { name: 'Deterministic measure', description: 'Direct healing.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['healing'],
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 3 }, healingConfig: { healingType: 'direct', resolution: 'DICE', formula } };
  const reopened = deserializeSpell(serializeSpell(d));
  const mapped = definitionFromWizard({ ...reopened, authoredDraft: reopened, authoredDefinitionId: '11111111-1111-4111-8111-111111111111' }, { roomId: 'r', classId: 'arcanoneer', definitionVersion: 1 });
  expect(mapped).toMatchObject({ ok: true, definition: { schemaVersion: 7, capability: DETERMINISTIC_CAPABILITY } });
  const compiled = require('../../../../server/services/installedDefinitionRegistry').compileDefinition(mapped.definition); expect(compiled.ok).toBe(true);
  replaceAuthoredRegistry('r', [{ canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor, definitionRef: compiled.descriptor.definitionRef }]);
  const support = authoredSupport(actionId(compiled.descriptor.definitionRef), 'r', 'Arcanoneer', { intelligence: 19 }, { current: 23, max: 40 });
  expect(support.reading).toEqual(require('../../../../server/shared/services/authoredAbility').readDeterministicFormula(formula, { intelligence: 19 }, { current: 23, max: 40 }));
  const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'p1', ownerUid: 'u', characterId: 'c' }, target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'foe', instanceId: 'f1' };
  const pc = { id: 'pc', mapId: 'm', ownerUserId: 'u', character: { id: 'c', health: { current: 23, max: 40 }, actionPoints: { current: 4 }, mana: { current: 10 } }, state: { actorContract: { version: 1, ...source, revision: 3, primary: true } } };
  const foe = { id: 'foe', mapId: 'm', stats: { maxHp: 100 }, state: { currentHp: 98, tempHealth: 2, actorContract: { version: 1, ...target, revision: 0 } } };
  const roll = recordRoll('deterministic', support.reading, []), approval = buildApproval({ support, tokens: [pc, foe], sourceRef: source, targetRef: target, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, roll, approvalId: 'a' });
  expect(approval).toMatchObject({ formulaSourceRevision: 3, roll: { mode: 'deterministic', dice: [] } });
  const command = planSpellCommand({ approval, contentHash: 'h', tokens: [pc, foe], roomId: 'r', mapId: 'm', finalAmount: roll.total, adjudicated: true });
  expect(command.entries.find(a => a.ref.kind === 'creature').finalResources.hp).toEqual({ current: 100, temp: 2 });
  const result = spellReceipt({ success: true, receipt: { version: 1, roomId: 'r', source, target, actors: [{ ref: source }, { ref: target }], authorization: { kind: 'owner-approval-gm', proposalId: 'a' }, adjudication: command.extra.adjudication } });
  expect(result).not.toBeNull();
});
