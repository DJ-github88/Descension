/* Named accepted-contract baseline. Run from server:
 * node node_modules/mocha/bin/mocha.js tests/componentCompatibility.production.test.js --reporter spec --exit
 * No App journey, build, catalogue edit or production pin. */
const assert = require('assert/strict');
const { manifest, recordFor, createHarness, approvalFor, commandFor, ack } = require('./helpers/componentCompatibilityFixtures');
const actors = require('../services/actorConsequences');
const registry = require('../services/installedDefinitionRegistry');
const pure = require('../../vtt-react/src/services/authoredAbility');
const serverPure = require('../shared/services/authoredAbility');
const timing = require('../shared/services/sharedEffectTiming');
const { randomUUID: uuid } = require('crypto');
const map = (h, r) => pure.definitionFromWizard(r, { roomId: h.room.id, definitionVersion: 1, classId: 'arcanoneer' });
const success = r => assert.equal(r.success, true, JSON.stringify(r));
async function unchanged(h, socket, event, data, code) {
  const before = actors.clone(h.live().gameState), r = await ack(socket, event, data);
  assert.equal(r.success, false, JSON.stringify(r));
  if (code) { assert.equal(r.code, code, JSON.stringify(r)); }
  assert.deepEqual(h.live().gameState, before, `${event}: refusal changes nothing`);
  return r;
}
async function approve(h, a) {
  const before = actors.clone(h.live().gameState), r = await ack(h.owner, 'actor_spell_approve', a);
  assert.equal(r.code, 'awaiting_gm', JSON.stringify(r));
  assert.deepEqual(h.live().gameState, before, 'approval never spends or installs');
}

describe(manifest.fixtureSet, function() {
  this.timeout(20000);
  let h;
  beforeEach(async() => { h = await createHarness(); });
  afterEach(async() => { await h?.close(); });

  for (const f of manifest.fixtures) { it(`${f.id}: ${f.route || manifest.defaults.route} → ${f.expected.outcome}`, async() => {
    const record = recordFor(f), preserved = JSON.stringify(record), mapped = map(h, record);
    assert.equal(mapped.ok, true, JSON.stringify(mapped));
    assert.deepEqual(serverPure.definitionFromWizard(record, { roomId: h.room.id, definitionVersion: 1, classId: 'arcanoneer' }), mapped, 'server/client Wizard mapping agrees');
    const compiled = registry.compileDefinition(mapped.definition);
    assert.equal(compiled.ok, true, JSON.stringify(compiled));
    assert.deepEqual(compiled.descriptor.price, { ap: 1, mana: 3 });
    const d = compiled.canonicalDefinition, direct = d.effects ? d.effects.direct : d.effect;
    if (direct) {
      assert.equal(direct.formula, f.formula);
      assert.deepEqual(direct.damageTypes || [], f.kind === 'damage' ? ['arcane'] : []);
    }
    if (f.rider === 'movement') { assert.deepEqual(d.effects.condition, { kind: 'movement', feet: -10, label: 'Contract slow' }); }
    if (f.rider === 'stunned') { assert.deepEqual(d.effects.condition, { kind: 'stunned' }); }
    if (f.save) { assert.deepEqual(d.effects.save, { scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' }); }
    if (f.rider === 'periodic') { assert.deepEqual(d.effects.condition, { kind: 'periodic', tick: { kind: 'damage', formula: '1d4', damageTypes: ['arcane'] }, tickRoll: 'each-tick', label: 'Contract tick' }); }
    let e;
    if (f.classPayment) {
      // Arbitrary Wizard records cannot self-authorize a typed bank payment. Explicit
      // SERVER FIXTURE only: same trusted projection seam as the accepted payment tests.
      const unauthorized = actors.clone(record);
      for (const cost of [unauthorized.resourceCost, unauthorized.authoredDraft.resourceCost]) { cost.resourceTypes = ['rime_sphere']; }
      assert.equal(map(h, unauthorized).ok, false, f.wizardExpected);
      const pinned = await h.pin(mapped.definition); e = pinned.entry;
    } else {
      const admitted = await h.admit(record); success(admitted); e = h.entry(admitted.definitionRef);
      assert.deepEqual(e.canonicalDefinition, compiled.canonicalDefinition, 'admission preserves the compiled whole executable projection');
    }
    assert.equal(JSON.stringify(record), preserved, 'mapping/admission does not rewrite authored record');
    if (f.rider || f.cooldown) { await h.combat(); }
    const target = f.route === 'owner-pc-to-self' ? h.pc : h.foe;
    let a = approvalFor(h, e, target);
    assert.equal(a.roll?.total || 0, f.expected.total, 'literal accepted-contract arithmetic, not validator-derived expectation');
    await approve(h, a);
    if (f.changedInputReapproval) {
      h.token(h.pc).character.health.current = 19;
      await unchanged(h, h.gm, 'actor_consequence', commandFor(h, a), 'owner_reapproval_required');
      const old = a; a = approvalFor(h, e, target);
      assert.deepEqual(a.roll.dice, old.roll.dice, 'reapproval retains physical faces');
      assert.equal(a.roll.total, f.expected.freshTotal);
      await approve(h, a);
    }
    const c = commandFor(h, a), r = await ack(h.gm, 'actor_consequence', c); success(r);
    const hp = actors.resources(h.token(target), target.kind).hp;
    assert.deepEqual({ hp: hp.current, tempHp: hp.temp }, { hp: f.expected.hp, tempHp: f.expected.tempHp });
    const paid = actors.clone(actors.resources(h.token(h.pc), 'character'));
    assert.deepEqual(paid.ap, { current: 10, temp: 0, max: 10 });
    assert.deepEqual(paid.mana, { current: 19, temp: 0, max: 20 });
    assert.equal(h.token(target).state.conditions.length, f.expected.conditions || 0);
    if (f.rider === 'movement') { assert.equal(h.token(target).state.conditions[0].effects.movementSpeed, -10); }
    if (f.classPayment) { assert.deepEqual(h.token(h.pc).state.classPayment.value, { type: 'elementalSpheres', spheres: ['ember'] }); }
    assert.equal(r.receipt.actors.length, target === h.pc ? 1 : 2);
    const after = actors.clone(h.live().gameState);
    assert.deepEqual((await ack(h.gm, 'actor_consequence', c)).receipt, r.receipt);
    assert.deepEqual(h.live().gameState, after, 'same command does not pay/apply/install twice');
    assert.equal(actors.ledger(h.live()).receipts.filter(x => x.commandId === c.commandId).length, 1);
    if (f.cooldown) {
      assert.deepEqual(Object.values(h.token(h.pc).state.authoredCooldowns).map(x => [x.dueSequence, x.commandId]), [[f.expected.cooldownDue, c.commandId]]);
      await unchanged(h, h.owner, 'actor_spell_approve', approvalFor(h, e), 'ability_on_cooldown');
    }
    if (f.expected.expirySequence) {
      const schedules = Object.values(h.live().gameState.combat.effectLifecycle.schedules);
      assert.deepEqual(schedules.map(s => s.dueSequence), [f.expected.expirySequence]);
      await h.boundary(); assert.equal(h.token(target).state.conditions.length, 1);
      await h.boundary(); assert.equal(h.token(target).state.conditions.length, 0);
      assert.deepEqual(actors.resources(h.token(h.pc), 'character'), paid, 'expiry never pays again');
      if (f.cooldown) {
        assert.deepEqual(Object.values(h.token(h.pc).state.authoredCooldowns).map(x => x.dueSequence), [f.expected.cooldownDue], 'expiry does not release cooldown');
        await unchanged(h, h.owner, 'actor_spell_approve', approvalFor(h, e), 'ability_on_cooldown');
        while (h.live().gameState.combat.effectLifecycle.sequence < f.expected.cooldownDue) { await h.boundary(); }
      }
    }
    if (f.rider === 'periodic') {
      if (f.cooldown) {
        assert.deepEqual(Object.values(h.token(h.pc).state.authoredCooldowns).map(x => x.dueSequence), [f.expected.cooldownDue]);
        await unchanged(h, h.owner, 'actor_spell_approve', approvalFor(h, e), 'ability_on_cooldown');
      }
      await h.boundary();
      const tick = timing.dueTicks(h.live().gameState.combat)[0]; assert.ok(tick);
      const cooldownBefore = actors.clone(h.token(h.pc).state.authoredCooldowns || {});
      const tr = await ack(h.gm, 'actor_periodic_resolve', { ...h.base(), tickId: tick.tickId, mode: 'apply', expectedRevision: h.token(target).state.actorContract.revision,
        roll: { mode: 'physical', dice: [{ sides: 4, faces: [3] }], constant: 0, reading: '1d4', total: 3 }, finalAmount: 3, adjustmentReason: '' });
      success(tr); assert.equal(actors.resources(h.token(target), target.kind).hp.current, f.expected.tickHp);
      assert.deepEqual(actors.resources(h.token(h.pc), 'character'), paid, 'tick never pays again');
      assert.deepEqual(h.token(h.pc).state.authoredCooldowns || {}, cooldownBefore, 'tick does not change cooldown');
      if (f.cooldown) { await h.boundary(); assert.deepEqual(h.token(h.pc).state.authoredCooldowns, {}); }
    }
    if (f.cooldown) {
      assert.deepEqual(h.token(h.pc).state.authoredCooldowns, {});
      const fresh = approvalFor(h, e); await approve(h, fresh);
      const again = commandFor(h, fresh), accepted = await ack(h.gm, 'actor_consequence', again); success(accepted);
      assert.deepEqual(Object.values(h.token(h.pc).state.authoredCooldowns).map(x => x.commandId), [again.commandId], 'legal reuse starts one new cooldown');
    }
  }); }

  for (const b of manifest.boundaries) { it(`${b.id}: ${b.route} → ${b.expected}`, async() => {
    const f = manifest.fixtures.find(x => x.id === b.fixture);
    const record = recordFor({ ...f, ...(b.save ? { save: b.save } : {}) }), preserved = JSON.stringify(record);
    if (b.stage === 'wizard') {
      const m = map(h, record); assert.equal(m.ok, false); assert.ok(m.reason.includes(b.reason), m.reason);
      const r = await unchanged(h, h.gm, 'actor_authored_admit', { roomId: h.room.id, requestId: uuid(), expectedRegistryRevision: 0, definitionVersion: 1, classId: 'arcanoneer', record }, 'unsupported_wizard_record');
      assert.ok(r); assert.equal(JSON.stringify(record), preserved); return;
    }
    const m = map(h, record); assert.equal(m.ok, true, JSON.stringify(m));
    assert.equal(registry.compileDefinition(m.definition).ok, true, 'record is structurally executable before route/authority gate');
    if (b.stage === 'admission') {
      h.token(h.source).authoredAbility = { schemaVersion: 1, record, librarySpellId: null };
      const before = actors.clone(h.live().gameState), r = await h.admit(record, h.source);
      assert.equal(r.success, false); assert.equal(r.code, b.code, JSON.stringify(r)); assert.deepEqual(h.live().gameState, before);
    } else if (b.stage === 'compilation-and-commit') {
      const pinned = await h.pin(m.definition);
      await h.combat();
      const a = approvalFor(h, pinned.entry); await approve(h, a);
      const c = commandFor(h, a);
      const profiles = require('../shared/data/catalogueAbilityProfiles.json').profiles;
      profiles.splice(profiles.indexOf(pinned.pin), 1);
      assert.equal(registry.compileDefinition(pinned.definition).ok, false, 'same executable record without a current trusted pin is not authority');
      await unchanged(h, h.gm, 'actor_consequence', c, b.code);
    } else {
      const admitted = await h.admit(record); success(admitted);
      const a = approvalFor(h, h.entry(admitted.definitionRef), b.id === 'periodic-pc-target' ? h.ally : h.foe);
      assert.ok(b.code, 'approval-boundary refusals require an independent specific code (awaiting_gm is not a refusal)');
      await unchanged(h, b.id === 'unowned-caster' ? h.observer : h.owner, 'actor_spell_approve', a, b.code);
    }
    assert.equal(JSON.stringify(record), preserved, 'refusal preserves whole authored record');
  }); }

  it('saved branch pays/directs but neither installs nor schedules its negated timed rider', async() => {
    const f = manifest.fixtures.find(x => x.id === 'direct-save-timed-rider');
    const admitted = await h.admit(recordFor(f)); success(admitted); await h.combat();
    const a = approvalFor(h, h.entry(admitted.definitionRef)); await approve(h, a);
    const r = await ack(h.gm, 'actor_consequence', commandFor(h, a, 'saved')); success(r);
    assert.deepEqual(h.token(h.foe).state.conditions, []);
    assert.deepEqual(h.live().gameState.combat.effectLifecycle.schedules, {});
    assert.equal(h.token(h.foe).state.currentHp, 66);
    assert.equal(h.token(h.pc).character.mana.current, 19);
  });
});
