import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { buildApproval, planSpellCommand, supportSpell } from '../spellConsequence';
import { actionId, definitionFromWizard } from '../authoredAbility';
import { canonical, sha256Hex } from '../canonicalHash';
import useGameStore from '../../store/gameStore';
import { registerStore } from '../../store/storeRegistry';
import * as actorService from '../actorConsequenceService';
import { explainExecution } from '../../components/spellcrafting-wizard/utils/executionCompatibility';
import { creatureSourceRefusal } from '../authoredAbility';
const manifest = require('../../../../server/tests/fixtures/componentCompatibility.json');
const { recordFor } = require('../../../../server/tests/fixtures/componentCompatibilityRecords.cjs');
const registry = require('../../../../server/services/installedDefinitionRegistry');
const catalogue = require('../catalogueAbility.cjs');
const profiles = require('../../data/catalogueAbilityProfiles.json');
const serverProfiles = require('../../../../server/shared/data/catalogueAbilityProfiles.json');

// Existing production planner test seam (composedClassPayment.test.js): isolate the
// unrelated legacy effect-processing/store cycle; none of the tested planners mocked.
jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));
registerStore('gameStore', useGameStore);
const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'pc', ownerUid: 'u', characterId: 'pc' };
const foe = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'foe', instanceId: 'foe' };
let pins;
beforeEach(() => { pins = []; useGameStore.setState({ multiplayerRoom: { id: 'r' }, multiplayerSocket: null }); });
afterEach(() => {
  for (const [list, pin] of pins) { const i = list.indexOf(pin); if (i >= 0) list.splice(i, 1); }
  jest.restoreAllMocks();
  replaceAuthoredRegistry(null, []);
});

test.each(manifest.fixtures.map(f => [f.id, f]))('%s — production client support → approval → command retains accepted contract', (_, f) => {
  const record = recordFor(f), before = JSON.stringify(record);
  const mapped = definitionFromWizard(record, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
  expect(mapped.ok).toBe(true);
  const d = mapped.definition;
  if (f.classPayment) {
    d.classPayment = { domain: 'elementalSpheres', price: { costs: ['rime', 'rime'], gains: [] } };
    d.catalogueSource = { classId: 'arcanoneer', spellId: 'SERVER-FIXTURE-contract', recordHash: 'a'.repeat(64) };
    const pin = { capability: d.capability, ...d.catalogueSource, executable: catalogue.definitionProjection(d) };
    // Jest loads the byte-equal client/server JSON mirrors as distinct objects.
    for (const list of new Set([profiles.profiles, serverProfiles.profiles])) { pins.push([list, pin]); list.push(pin); }
  }
  const compiled = registry.compileDefinition(d); expect(compiled.ok).toBe(true);
  const direct = d.effects ? d.effects.direct : d.effect;
  if (direct) {
    expect(direct.formula).toBe(f.formula);
    expect(direct.damageTypes || []).toEqual(f.kind === 'damage' ? ['arcane'] : []);
  }
  if (f.rider === 'movement') expect(d.effects.condition).toEqual({ kind: 'movement', feet: -10, label: 'Contract slow' });
  if (f.rider === 'stunned') expect(d.effects.condition).toEqual({ kind: 'stunned' });
  if (f.save) expect(d.effects.save).toEqual({ scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' });
  if (f.rider === 'periodic') expect(d.effects.condition).toEqual({ kind: 'periodic', tick: { kind: 'damage', formula: '1d4', damageTypes: ['arcane'] }, tickRoll: 'each-tick', label: 'Contract tick' });
  const ref = compiled.descriptor.definitionRef, id = actionId(ref);
  replaceAuthoredRegistry('r', [{ definitionRef: ref, canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor }]);
  const character = { id: 'pc', class: 'Arcanoneer', stats: { intelligence: 18 }, health: { current: f.changedInputReapproval ? 19 : 23, max: 40 },
    mana: { current: 20, max: 20 }, actionPoints: { current: 10, max: 10 }, tempHealth: 9, tempMana: 2, tempActionPoints: 1,
    ...(f.classPayment ? { classResource: { type: 'elementalSpheres', spheres: ['rime', 'rime', 'ember'] } } : {}) };
  // Explicit room-authority projection fixture; sheet HP alone is intentionally insufficient.
  // Registered-handler suite verifies the real authoritative HP/reapproval boundary.
  jest.spyOn(actorService, 'roomResourceProjection').mockReturnValue({ health: { ...character.health } });
  expect(authoredSupport(id, 'r', 'Arcanoneer', character.stats, character.health).supported).toBe(true);
  const support = supportSpell({ id }, character); expect(support.supported).toBe(true);
  const dice = support.reading?.dice.map(g => ({ sides: g.sides, faces: Array(g.count).fill(4) })) || [];
  const roll = support.reading ? { mode: dice.length ? 'physical' : 'deterministic', dice, constant: support.reading.constant, reading: support.reading.reading,
    total: dice.reduce((sum, g) => sum + g.faces.reduce((a, b) => a + b, 0), support.reading.constant) } : null;
  expect(roll?.total || 0).toBe(f.expected.freshTotal ?? f.expected.total);
  const tokens = [{ id: 'pc', mapId: 'm', ownerUserId: 'u', character, state: { actorContract: { ...source, version: 1, primary: true, revision: 0 }, conditions: [] } },
    { id: 'foe', mapId: 'm', stats: { maxHp: 100 }, state: { actorContract: { ...foe, version: 1, revision: 0 }, currentHp: 70, tempHealth: 2, conditions: [] } }];
  const target = f.route === 'owner-pc-to-self' ? source : foe;
  const a = buildApproval({ support, tokens, sourceRef: source, targetRef: target, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0,
    approvalId: '22222222-2222-4222-8222-222222222222', roll });
  expect(a.price).toEqual({ ap: 1, mana: 3 });
  if (f.rider) expect(a.effectTerms).toEqual({ ...support.effectTerms });
  const plan = planSpellCommand({ approval: a, contentHash: sha256Hex(canonical(a)), tokens, roomId: 'r', mapId: 'm', finalAmount: roll?.total || 0, reason: '', adjudicated: true,
    resolution: { gmConfirmed: true, timing: a.effectTerms?.timing, timingNote: 'GM confirms range and eligibility', evidence: '' }, ...(f.save ? { branch: 'failed' } : {}) });
  expect(plan.entries).toHaveLength(target === source ? 1 : 2);
  expect(plan.entries[0].finalResources).toMatchObject({ ap: { current: 10, temp: 0 }, mana: { current: 19, temp: 0 } });
  if (f.formula) expect(plan.entries[target === source ? 0 : 1].finalResources.hp).toEqual({ current: f.expected.hp, temp: f.expected.tempHp });
  if (f.rider) expect(plan.entries[1].conditions).toHaveLength(1);
  if (f.rider === 'movement') expect(plan.entries[1].conditions[0].record.effects.movementSpeed).toBe(-10);
  if (f.classPayment) expect(a.classPayment.after).toEqual({ type: 'elementalSpheres', spheres: ['ember'] });
  if (f.cooldown) expect(support.cooldown).toMatchObject({ type: 'authenticated_caster_start', value: f.cooldown });
  expect(JSON.stringify(record)).toBe(before);
});

test.each(['immediate-periodic', 'standalone-periodic-cooldown', 'movement-rider-cooldown', 'immediate-damage'])('%s — Flash explanation delegates to resulting shared creature eligibility', id => {
  const f = manifest.fixtures.find(x => x.id === id), record = recordFor(f), before = JSON.stringify(record);
  const ctx = { roomId: 'r', classId: 'arcanoneer', shared: true, gm: true };
  const mapped = definitionFromWizard(record, { ...ctx, definitionVersion: 1 }); expect(mapped.ok).toBe(true);
  const refusal = creatureSourceRefusal(mapped.definition);
  const view = explainExecution(record, { ...ctx, sourceRef: foe });
  if (id === 'immediate-damage') {
    expect(refusal).toBeNull(); expect(view.state).toBe('executable');
    expect(view.confirm).toEqual(['The GM confirms success and any final amount.']);
  } else {
    expect(refusal.code).toBe('unsupported_source_route'); expect(view.state).toBe('unsupported');
    expect(view.reasons).toEqual([{ label: 'Route restriction', text: refusal.reason }]);
    expect(view.automated).toEqual([]);
  }
  const pc = explainExecution(record, { ...ctx, sourceRef: source });
  expect(['partial', 'executable']).toContain(pc.state);
  expect(pc.confirm).toContain('The owner approves the exact price, target and roll before anything is applied.');
  expect(JSON.stringify(record)).toBe(before);
});
