/**
 * First-playable passive readiness - CONTROL rows.
 *
 * These rows run against the live tree through the real production stack
 * fixture. They prove the current state, not the proposed implementation:
 *   - storage of the real Heightened Senses record grants nothing;
 *   - the live compiler refuses PASSIVE whole;
 *   - the live registration handler has no passive mode;
 *   - combat start does not compose an initiative modifier;
 *   - the successor plan reports stored-only (when its module is overlaid);
 *   - the fidelity P0/P1/P2 action records never define passive semantics;
 *   - PF-6 is a validator/save-control policy mismatch, not lost data;
 *   - checkpoint recovery preserves storage and fabricates no activation.
 *
 * A control row is never a substitute for the PENDING acceptance rows.
 */
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { createPassiveHarness } = require('./passiveReadinessHarness');
const profile = require('./profiles');
const testPolicy = require('./passiveActivationTestPolicy');
const { definitionFromWizard } = require('../../shared/services/authoredAbility');

const ROOT = path.resolve(__dirname, '../../..');
const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const HEIGHTENED_SENSES = profile.readFixture('heightened-senses.record.json');
const COMPILE_OPTIONS = { roomId: 'passive-readiness-control', classId: 'arcanoneer', definitionVersion: 1 };
const P0 = profile.readFixture('p0-no-trigger.record.json');
const P1 = profile.readFixture('p1-whole-trigger.record.json');
const P2 = profile.readFixture('p2-component-trigger.record.json');
const planModule = () => (process.env.PASSIVE_PLAN_MODULE ? require(process.env.PASSIVE_PLAN_MODULE) : null);

describe('First playable passive - CONTROLS (live production stack)', function() {
  this.timeout(30000);
  let h;
  beforeEach(async() => {
    testPolicy.setApprovedForTest(false);
    h = await createPassiveHarness();
  });
  afterEach(async() => {
    testPolicy.resetPolicyForTest();
    await h.stop();
  });

  it('CONTROL: the real Heightened Senses record can be stored on the sheet, yet storage alone changes no initiative', async() => {
    const spells = h.storeRecord(HEIGHTENED_SENSES);
    assert.equal(spells[0].id, 'skill_perception_heightened_senses');

    const entry = await h.startCombat({ pc: 10, foe: 8 });
    assert.equal(entry.initiative, 10, 'the client-supplied total is unchanged');
    assert.equal(entry.initiativeMod, undefined, 'the live combat-start path composed no server modifier');
  });

  it('CONTROL: the real Heightened Senses record is not a Wizard-saved record; the compiler cannot read it at all', function() {
    const result = definitionFromWizard(HEIGHTENED_SENSES, COMPILE_OPTIONS);
    assert.equal(result.ok, false, JSON.stringify(result));
    assert.equal(result.code, 'unsupported_wizard_record');
    assert.match(result.reason, /^Whole Wizard draft unavailable/);
    assert.equal(result.definition, undefined);
  });

  it('CONTROL: a real Wizard-authored PASSIVE record (P0) is refused whole at Immediate ACTION required', function() {
    const result = definitionFromWizard(P0, COMPILE_OPTIONS);
    assert.equal(result.ok, false, JSON.stringify(result));
    assert.equal(result.code, 'unsupported_wizard_record');
    assert.match(result.reason, /^Immediate ACTION required:/);
    assert.equal(result.definition, undefined);
    assert.equal(result.definitionHash, undefined);
  });

  it('CONTROL: the authored-admission route refuses the passive record; admitting it grants no activation', async() => {
    const before = h.installed.registry(h.live()).revision;
    const result = await h.ack(h.gm, 'actor_authored_admit', {
      roomId: h.room.id, requestId: h.uuid(), expectedRegistryRevision: before,
      record: HEIGHTENED_SENSES, definitionVersion: 1, classId: 'arcanoneer'
    });
    assert.equal(result.success, false, JSON.stringify(result));
    assert.equal(h.installed.registry(h.live()).revision, before, 'no registry entry was added');
    assert.equal(h.live().gameState.passiveLedger, undefined, 'no activation was created');
  });

  it('CONTROL: the live registration handler has no passive mode; a passive registration is refused and creates no ledger', async() => {
    const action = await h.admit(h.damageRecord());
    const result = await h.refused(h.gm, 'actor_trigger_register', {
      roomId: h.room.id, requestId: h.uuid(), expectedRevision: 0,
      source: h.pc, definitionRef: action.ref,
      on: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
      mode: 'passive'
    }, 'unsupported_trigger_mode');
    assert.equal(result.success, false);
    assert.equal(h.stored(), undefined, 'no trigger ledger was created');
  });

  it('CONTROL: combat start does not read an active passive because no activation exists; the server has no passive reader', async() => {
    h.storeRecord(HEIGHTENED_SENSES);
    const baseModifier = h.token(h.pc).character.stats.initiativeMod;
    const entry = await h.startCombat({ pc: 10, foe: 8 });
    assert.equal(baseModifier, 0);
    assert.equal(entry.initiative, 10);
    assert.equal(entry.initiativeMod, undefined);
    assert.equal(h.live().gameState.passiveLedger, undefined);
  });

  it('CONTROL: the successor plan explains the real passive as stored-only, never executable', function() {
    const plans = planModule();
    if (!plans) { this.skip(); }
    const compiled = definitionFromWizard(HEIGHTENED_SENSES, COMPILE_OPTIONS);
    const scopes = plans.authoredScopes(HEIGHTENED_SENSES);
    assert.ok(scopes.refusals.some(item => item.code === 'passive_activation_unapproved'), JSON.stringify(scopes));
    assert.equal(scopes.entries.length, 0);

    const explained = plans.explain(HEIGHTENED_SENSES, compiled);
    assert.equal(explained.authority, 'stored');
    assert.equal(explained.wholeExecutable, false);
    assert.equal(explained.planHash, null);
    assert.deepEqual(explained.order, []);
    assert.deepEqual(explained.flow, []);
    assert.equal(explained.executableClaim, false);
  });

  it('CONTROL: the fidelity P0 no-trigger passive is stored-only; P1/P2 stored action triggers never define passive semantics', function() {
    const plans = planModule();
    if (!plans) { this.skip(); }

    for (const record of [P0, P1, P2]) {
      const compiled = definitionFromWizard(record, COMPILE_OPTIONS);
      assert.equal(compiled.ok, false, 'PASSIVE is refused whole');
      const scopes = plans.authoredScopes(record);
      assert.ok(scopes.refusals.some(item => item.code === 'passive_activation_unapproved'), JSON.stringify(scopes.refusals));
      const explained = plans.explain(record, compiled);
      assert.equal(explained.authority, 'stored');
      assert.equal(explained.wholeExecutable, false);
      assert.equal(explained.planHash, null);
      assert.equal(explained.executableClaim, false);
    }

    const p1Scopes = plans.authoredScopes(P1);
    assert.ok(p1Scopes.entries.some(item => item.status === 'supported-shape'), 'P1 carries the approved follow-up trigger shape');
    const p1Explained = plans.explain(P1, definitionFromWizard(P1, COMPILE_OPTIONS));
    assert.ok(p1Explained.triggers.some(item => item.executable === false && item.code === 'whole_definition_refused'));

    const p2Scopes = plans.authoredScopes(P2);
    assert.ok(p2Scopes.entries.some(item => item.code === 'component_scope_unapproved'), 'P2 keeps the component trigger at component scope');
    const p2Explained = plans.explain(P2, definitionFromWizard(P2, COMPILE_OPTIONS));
    assert.equal(p2Explained.executableClaim, false);
  });

  it('CONTROL: PF-6 - the PASSIVE trigger validator is not enforced by any rendered save control', function() {
    const context = read('vtt-react/src/components/spellcrafting-wizard/context/spellWizardContext.js');
    assert.match(context, /Trigger configuration is required for Reaction\/Passive\/Trap\/State spells/);

    const step = read('vtt-react/src/components/spellcrafting-wizard/components/common/WizardStep.jsx');
    assert.match(step, /disableNext = false/);
    assert.doesNotMatch(step, /disabled=\{disableNext\}/);

    const review = read('vtt-react/src/components/spellcrafting-wizard/components/steps/Step10Review.jsx');
    const validate = review.slice(review.indexOf('const validateSpell = () => {'), review.indexOf('setValidationResults'));
    assert.doesNotMatch(validate, /triggerConfig/, 'Review save validation does not read the trigger error');

    const app = read('vtt-react/src/components/spellcrafting-wizard/SpellwizardApp.jsx');
    const save = app.slice(app.indexOf('const handleSaveSpell = () => {'), app.indexOf('const handleLoadSpell'));
    assert.doesNotMatch(save, /triggerConfig|state\.errors/, 'header Finalize has no validation gate');
  });

  it('CONTROL: checkpoint recovery preserves the stored record and fabricates no passive activation', async() => {
    h.storeRecord(HEIGHTENED_SENSES);
    h.rebuild();
    assert.equal(h.live().gameState.passiveLedger, undefined);
    const spells = h.token(h.pc).character.spells;
    assert.ok(Array.isArray(spells), JSON.stringify(h.token(h.pc).character));
    assert.ok(spells.some(item => item.id === 'skill_perception_heightened_senses'));
  });
});
