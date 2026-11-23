/**
 * Independent Acceptance Suite — Direct-Damage Save (BASE Controls + Candidate Matrix)
 *
 * Does NOT implement a second compiler, binder, or save policy.
 * Consumes genuine Wizard-authored fixtures from:
 *   vtt-react/src/components/spellcrafting-wizard/__tests__/fixtures/directDamageSaveFixtures.json
 *
 * Status on 2026-11-17 (updated by the direct-damage-save release owner at the creator's direction; no assertion weakened):
 *   - Creator approval 2026-11-16 19:39 (handoff/direct-damage-save/CREATOR_APPROVAL.md): D-SV1 = rec. 1 (GM final is the pre-save
 *     damage; a recorded save halves it once, rounded down, never below 0; then temporary HP, then base HP) and D-SV3 = rec. 3 (normal
 *     price paid on negation), single-part Direct Damage only. D-SV2 and D-SV4 remain UNAPPROVED: their rows stay refusal rows.
 *   - The former "BASE refusal" row is superseded for the two single-part records: they now compile and admit with the exact
 *     approved terms; the combination record still refuses whole. Expected numbers below are written out, not derived from the engine.
 *   - Contract shapes: handoff/direct-damage-save/CONTRACT.md section 3.
 */
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const payments = require('../services/spellPayments');
const relationships = require('../services/actorRelationships');
const pure = require('../../vtt-react/src/services/authoredAbility');
const effect = require('../../vtt-react/src/services/authoredEffect');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');

const FIXTURES_PATH = path.resolve(
  __dirname,
  '../../vtt-react/src/components/spellcrafting-wizard/__tests__/fixtures/directDamageSaveFixtures.json'
);

const once = (s, e) => new Promise((r) => s.once(e, r));
const ack = (s, e, d) =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(Error(`ACK timeout: ${e}`)), 5000);
    s.emit(e, d, (r) => {
      clearTimeout(t);
      resolve(r);
    });
  });

function loadGenuineFixtures() {
  assert.ok(fs.existsSync(FIXTURES_PATH), `Missing genuine Wizard fixtures at ${FIXTURES_PATH}`);
  return JSON.parse(fs.readFileSync(FIXTURES_PATH, 'utf8'));
}

function rollFor(formula, faces) {
  const r = pure.readFormula(formula);
  return {
    mode: 'physical',
    dice: [{ sides: r.dice[0].sides, faces }],
    constant: r.constant,
    reading: r.reading,
    total: faces.reduce((a, b) => a + b, r.constant)
  };
}

describe('Direct-Damage Save — Independent Acceptance Suite (approved single-part saves + unchanged rider-save control)', function () {
  this.timeout(25000);

  let server, room, gm, owner, observer, writer, target, pc, ownerUid;

  beforeEach(async () => {
    writer = new FirebaseBatchWriter(60000, 50, {
      shouldPersist: () => true,
      persist: async () => ({ outcome: 'confirmed' })
    });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of [
      'actor_bind',
      'actor_snapshot',
      'actor_consequence',
      'actor_authored_admit',
      'actor_spell_approve',
      'actor_spell_withdraw',
      'actor_spell_list',
      'actor_recovery',
      'actor_relationship_set'
    ]) {
      server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    }
    const gmUid = server.nextUserId();
    ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    server.registerAuthToken('observer', server.nextUserId());

    gm = server.connect({ token: 'gm' });
    await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid });

    for (const role of ['owner', 'observer']) {
      const s = server.connect({ token: role });
      await once(s, 'connect');
      const j = once(s, 'room_joined');
      s.emit('join_room', { roomId: room.id, playerName: role, password: '' });
      await j;
      if (role === 'owner') owner = s;
      else observer = s;
    }

    server.setCharacterOwner('c', ownerUid);
    const m = () => room.gameState.maps.default;
    const t = {
      id: 'target',
      name: 'Target Creature',
      creatureId: 'disposable',
      stats: { maxHp: 40, maxMana: 20, maxAP: 10, speed: 30 },
      state: { currentHp: 30, currentMana: 20, currentActionPoints: 10, tempHealth: 4, tempMana: 0, tempActionPoints: 0, conditions: [] }
    };
    m().tokens.target = t;
    const tr = await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'target' },
      snapshotHash: actors.hash(t)
    });
    assert.equal(tr.success, true, JSON.stringify(tr));
    target = tr.ref;

    m().characterTokens.pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      character: {
        id: 'c',
        class: 'Arcanoneer',
        health: { current: 20, max: 30 },
        mana: { current: 10, max: 10 },
        actionPoints: { current: 4, max: 4 },
        tempMana: 2,
        tempActionPoints: 1
      },
      state: { conditions: [] }
    };
    const pr = await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' },
      snapshotHash: actors.hash(m().characterTokens.pc)
    });
    assert.equal(pr.success, true, JSON.stringify(pr));
    pc = pr.ref;

    const rel = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      pairs: [{ a: pc, b: target }],
      value: 'enemy',
      expectedRelationshipRevision: relationships.revision(live())
    });
    assert.equal(rel.success, true, JSON.stringify(rel));
  });

  afterEach(async () => {
    gm.disconnect();
    owner.disconnect();
    observer.disconnect();
    await server.stop();
  });

  const live = () => server.rooms.get(room.id);
  const token = (ref) => actors.locate(live(), ref).token;
  const baseCmd = () => ({
    version: 1,
    roomId: room.id,
    commandId: uuid(),
    actionEpoch: actors.epoch(live()),
    baseCommitSequence: actors.ledger(live()).commitSequence
  });
  const hp = (ref) => ({ current: token(ref).state.currentHp, temp: token(ref).state.tempHealth });
  const pools = () => {
    const c = token(pc).character;
    return { ap: c.actionPoints.current, tempAp: c.tempActionPoints, mana: c.mana.current, tempMana: c.tempMana };
  };
  const entryFor = (ref) => installed.list(live()).entries.find((e) => pure.actionId(e.definitionRef) === pure.actionId(ref));
  const res = (a) => ({
    gmConfirmed: true,
    timing: a.effectTerms.timing,
    timingNote: 'GM: range and target confirmed',
    evidence: 'GM table save record'
  });

  function buildEffectCommand(a, { branch, amount, reason = '' }) {
    const pay = {};
    const p = actors.resources(token(a.source), 'character');
    for (const k of ['ap', 'mana']) if (a.price[k]) pay[k] = payments.tempFirst(p[k].current, p[k].temp, a.price[k]);
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(p.ap.current, p.ap.temp, 0);
    const applies = effect.conditionApplies(a.effectTerms, branch);
    const plan = applies ? effect.conditionPlan(a, token(a.target).state.conditions || []) : { ops: null, combination: null };
    const finalAmount = amount ?? a.roll.total;
    const h = actors.resources(token(a.target), 'creature').hp;
    const fromTemp = Math.min(h.temp, finalAmount);
    const targetEntry = {
      ref: a.target,
      expectedRevision: token(a.target).state.actorContract.revision,
      ...(applies ? { conditions: plan.ops } : {}),
      finalResources: {
        hp: { current: Math.max(0, h.current - (finalAmount - fromTemp)), temp: h.temp - fromTemp }
      }
    };
    return {
      ...baseCmd(),
      source: a.source,
      target: a.target,
      approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay }, targetEntry],
      adjudication: {
        definitionId: a.spell.definitionId,
        definitionVersionOrHash: a.spell.definitionHash,
        finalAmount,
        adjustmentReason: reason,
        chosenResult: JSON.stringify(effect.resultFor(a, res(a), plan.combination, branch))
      }
    };
  }

  const admitKey = async key => ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision,
    record: loadGenuineFixtures()[key].savedOuterRecord, definitionVersion: 1, classId: 'arcanoneer' });
  const directApproval = (e, faces) => ({ version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence,
    source: pc, target, spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.CAPABILITY}/${e.definitionRef.definitionHash}`, name: e.canonicalDefinition.name, kind: 'damage',
      damageTypes: e.canonicalDefinition.effect.damageTypes }, roll: rollFor(e.canonicalDefinition.effect.formula, faces), price: e.descriptor.price, classPayment: null,
    saveTerms: JSON.parse(JSON.stringify(e.canonicalDefinition.save)) });
  /** What the ordinary client planner submits: the GM's pre-save final, the recorded branch and the applied amount it shows. */
  function buildDirectCommand(a, { branch, finalAmount = a.roll.total, applied, reason = '', revision } = {}) {
    const pay = {}, p = actors.resources(token(a.source), 'character');
    for (const k of ['ap', 'mana']) if (a.price[k]) pay[k] = payments.tempFirst(p[k].current, p[k].temp, a.price[k]);
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(p.ap.current, p.ap.temp, 0);
    const h = actors.resources(token(a.target), 'creature').hp, fromTemp = Math.min(h.temp, applied);
    return { ...baseCmd(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay },
        { ref: a.target, expectedRevision: revision ?? token(a.target).state.actorContract.revision, finalResources: { hp: { current: Math.max(0, h.current - (applied - fromTemp)), temp: h.temp - fromTemp } } }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount, adjustmentReason: reason,
        chosenResult: JSON.stringify({ capability: pure.CAPABILITY, approvalId: a.approvalId, roll: a.roll, kind: 'damage', damageTypes: a.spell.damageTypes, spellName: a.spell.name,
          sourceName: 'pc', targetName: 'Target Creature', gmConfirmed: true, save: a.saveTerms, branch, appliedAmount: applied }) } };
  }

  describe('Approved single-part direct-damage saves (genuine Wizard-authored fixtures on the production stack)', () => {
    it('superseded BASE refusal: both single-part records now compile and admit with the exact approved terms; the two-save combination still refuses whole', async () => {
      const fixtures = loadGenuineFixtures();
      const read = key => pure.definitionFromWizard(fixtures[key].savedOuterRecord, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
      assert.deepEqual(read('direct-damage-local-save').definition.save, { scope: 'direct', ability: 'agility', dc: 14, outcome: 'negates' });
      assert.deepEqual(read('direct-damage-save-for-half').definition.save, { scope: 'direct', ability: 'agility', dc: 15, outcome: 'halves' });
      assert.equal(read('unsupported-combination-both-saves').ok, false, 'D-SV2/D-SV4 unapproved: a damage save next to a rider save refuses whole');
      for (const key of ['direct-damage-local-save', 'direct-damage-save-for-half']) assert.equal((await admitKey(key)).success, true, key);
      const combo = await admitKey('unsupported-combination-both-saves');
      assert.equal(combo.success, false, 'combination admission still refuses');
    });

    it('outcome arithmetic, temp/base HP and payment once: failed 9 -> 9; saved halves odd 9 -> 4; GM ruling 7 -> 3; negates 8 -> 0 with the price paid', async () => {
      const half = entryFor((await admitKey('direct-damage-save-for-half')).definitionRef); // 2d6+3, 1 AP + 3 mana
      const neg = entryFor((await admitKey('direct-damage-local-save')).definitionRef);     // 1d8+3, 1 AP + 2 mana
      const a = directApproval(half, [4, 2]);
      assert.equal((await ack(owner, 'actor_spell_approve', a)).code, 'awaiting_gm');
      assert.equal((await ack(gm, 'actor_consequence', buildDirectCommand(a, { branch: 'failed', applied: 9 }))).success, true);
      assert.deepEqual(hp(target), { current: 25, temp: 0 }); // 9 = 4 temp + 5 base
      assert.deepEqual(pools(), { ap: 4, tempAp: 0, mana: 9, tempMana: 0 });
      token(target).state.tempHealth = 4; token(target).state.currentHp = 30; // disclosed fixture reset between rows (same seed as beforeEach)
      const b = directApproval(half, [4, 2]);
      assert.equal((await ack(owner, 'actor_spell_approve', b)).code, 'awaiting_gm');
      assert.equal((await ack(gm, 'actor_consequence', buildDirectCommand(b, { branch: 'saved', applied: 4 }))).success, true);
      assert.deepEqual(hp(target), { current: 30, temp: 0 }); // floor(9/2) = 4, absorbed wholly by temp HP
      assert.deepEqual(pools(), { ap: 3, tempAp: 0, mana: 6, tempMana: 0 });
      token(target).state.tempHealth = 4;
      const c = directApproval(half, [4, 2]);
      assert.equal((await ack(owner, 'actor_spell_approve', c)).code, 'awaiting_gm');
      assert.equal((await ack(gm, 'actor_consequence', buildDirectCommand(c, { branch: 'saved', finalAmount: 7, applied: 3, reason: 'Half cover: -2' }))).success, true);
      assert.deepEqual(hp(target), { current: 30, temp: 1 }); // GM final 7 (pre-save) -> 3, then temp HP first
      const d = directApproval(neg, [5]);
      assert.equal((await ack(owner, 'actor_spell_approve', d)).code, 'awaiting_gm');
      const beforeNeg = pools();
      assert.equal((await ack(gm, 'actor_consequence', buildDirectCommand(d, { branch: 'saved', applied: 0 }))).success, true);
      assert.deepEqual(hp(target), { current: 30, temp: 1 }, 'negated: no HP change');
      assert.deepEqual(pools(), { ap: beforeNeg.ap - 1, tempAp: 0, mana: beforeNeg.mana - 2, tempMana: 0 }, 'negated: the normal price is paid once');
    });

    it('server-derived amount and bound terms: a forged applied amount, a wrong branch, changed terms, a stale revision or a withdrawn approval apply nothing', async () => {
      const half = entryFor((await admitKey('direct-damage-save-for-half')).definitionRef);
      const a = directApproval(half, [4, 2]);
      assert.equal((await ack(owner, 'actor_spell_approve', a)).code, 'awaiting_gm');
      const before = { hp: hp(target), pools: pools() };
      for (const [cmd, code] of [[buildDirectCommand(a, { branch: 'saved', applied: 5 }), 'approval_mismatch'], [buildDirectCommand(a, { branch: 'failed', applied: 4 }), 'approval_mismatch'],
        [buildDirectCommand(a, { branch: 'partial', applied: 4 }), 'save_branch_unbound'], [buildDirectCommand(a, { branch: 'saved', applied: 4, revision: token(target).state.actorContract.revision + 1 }), 'stale_actor_revision']]) {
        const r = await ack(gm, 'actor_consequence', cmd);
        assert.equal(r.success, false); assert.equal(r.code, code, JSON.stringify(r));
      }
      assert.deepEqual({ hp: hp(target), pools: pools() }, before);
      const changed = directApproval(half, [4, 2]); changed.saveTerms = { ...changed.saveTerms, outcome: 'negates' };
      const changedRes = await ack(owner, 'actor_spell_approve', changed);
      assert.equal(changedRes.success, false, 'changed terms refuse at approval'); assert.equal(changedRes.code, 'authored_approval_mismatch');
      const bare = directApproval(half, [4, 2]); delete bare.saveTerms;
      const bareRes = await ack(owner, 'actor_spell_approve', bare);
      assert.equal(bareRes.success, false, 'an approval without the admitted save term refuses'); assert.equal(bareRes.code, 'authored_approval_mismatch');
      const w = await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId });
      assert.equal(w.success, true, JSON.stringify(w));
      const withdrawn = await ack(gm, 'actor_consequence', buildDirectCommand(a, { branch: 'saved', applied: 4 }));
      assert.equal(withdrawn.success, false, 'withdrawn approval'); assert.equal(withdrawn.code, 'approval_withdrawn');
      assert.deepEqual({ hp: hp(target), pools: pools() }, before);
    });

    it('writer refusal changes nothing (persistent room, writer admission refused); the retry commits once; exact replay returns the receipt; a conflicting branch on the same commandId refuses', async () => {
      const half = entryFor((await admitKey('direct-damage-save-for-half')).definitionRef);
      const a = directApproval(half, [4, 2]);
      assert.equal((await ack(owner, 'actor_spell_approve', a)).code, 'awaiting_gm');
      const before = { hp: hp(target), pools: pools(), receipts: actors.ledger(live()).receipts.length };
      const cmd = buildDirectCommand(a, { branch: 'saved', applied: 4 });
      const origAdmit = writer.admitConsequence;
      live().isPermanent = true;
      writer.admitConsequence = () => ({ queued: false, code: 'writer_admission_refused' });
      const refused = await ack(gm, 'actor_consequence', cmd);
      assert.equal(refused.success, false); assert.equal(refused.code, 'writer_admission_refused');
      assert.deepEqual({ hp: hp(target), pools: pools(), receipts: actors.ledger(live()).receipts.length }, before);
      writer.admitConsequence = origAdmit;
      const ok = await ack(gm, 'actor_consequence', cmd);
      assert.equal(ok.success, true, JSON.stringify(ok));
      assert.deepEqual(hp(target), { current: 30, temp: 0 });
      assert.equal(actors.ledger(live()).receipts.length, before.receipts + 1);
      const replay = await ack(gm, 'actor_consequence', cmd);
      assert.equal(replay.success, true); assert.equal(replay.receipt.commandId, ok.receipt.commandId);
      const conflicting = { ...buildDirectCommand(a, { branch: 'failed', applied: 9 }), commandId: cmd.commandId };
      const conflict = await ack(gm, 'actor_consequence', conflicting);
      assert.equal(conflict.success, false, 'same commandId, different branch'); assert.equal(conflict.code, 'command_id_conflict');
      assert.deepEqual(hp(target), { current: 30, temp: 0 });
      assert.equal(actors.ledger(live()).receipts.length, before.receipts + 1, 'committed exactly once');
      live().isPermanent = false;
    });

    it('refused whole and preserved in this slice: a caster-start cooldown with a direct-damage save; D-SV2/D-SV4 combinations', () => {
      const fixtures = loadGenuineFixtures();
      const withCooldown = JSON.parse(JSON.stringify(fixtures['direct-damage-save-for-half'].savedOuterRecord));
      for (const r of [withCooldown, withCooldown.authoredDraft]) r.cooldownConfig = { cooldownType: 'authenticated_caster_start', cooldownValue: 2 };
      withCooldown.serializedData = JSON.stringify(withCooldown.authoredDraft);
      const before = JSON.stringify(withCooldown);
      const out = pure.definitionFromWizard(withCooldown, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
      assert.equal(out.ok, false); assert.match(out.reason, /cooldown/);
      assert.equal(JSON.stringify(withCooldown), before, 'record preserved');
      assert.equal(pure.definitionFromWizard(fixtures['unsupported-combination-both-saves'].savedOuterRecord, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).ok, false);
    });
  });

  describe('BASE Controls (genuine Wizard-authored fixtures on live stack)', () => {

    it('BASE unchanged control: rider-local-save-control compiles, admits, executes saved & failed, handles writer refusal and exact-command replay', async () => {
      const fixtures = loadGenuineFixtures();
      const record = fixtures['rider-local-save-control'].savedOuterRecord;
      const admitRes = await ack(gm, 'actor_authored_admit', {
        roomId: room.id,
        requestId: uuid(),
        expectedRegistryRevision: installed.registry(live()).revision,
        record,
        definitionVersion: 1,
        classId: 'arcanoneer'
      });
      assert.equal(admitRes.success, true, JSON.stringify(admitRes));
      const e = entryFor(admitRes.definitionRef);
      const d = e.canonicalDefinition;

      const makeApproval = (faces) => ({
        version: 1,
        roomId: room.id,
        approvalId: uuid(),
        actionEpoch: actors.epoch(live()),
        baseCommitSequence: actors.ledger(live()).commitSequence,
        source: pc,
        target,
        spell: {
          definitionId: pure.actionId(e.definitionRef),
          definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`,
          name: d.name,
          kind: 'effect',
          damageTypes: d.effects.direct?.damageTypes || []
        },
        roll: rollFor(d.effects.direct.formula, faces),
        price: e.descriptor.price,
        classPayment: null,
        effectTerms: effect.termsFor(d)
      });

      // 1. Saved branch: damage (temp HP first) + payment once, no rider
      const aSaved = makeApproval([5]); // 1d8+3 = 8
      assert.equal((await ack(owner, 'actor_spell_approve', aSaved)).code, 'awaiting_gm');
      const cmdSaved = buildEffectCommand(aSaved, { branch: 'saved' });
      const resSaved = await ack(gm, 'actor_consequence', cmdSaved);
      assert.equal(resSaved.success, true, JSON.stringify(resSaved));
      assert.deepEqual(hp(target), { current: 26, temp: 0 });
      assert.equal(token(target).state.conditions.filter(profile.isMovementModifier).length, 0);

      // Exact-command replay returns original receipt without double-charging
      const replaySaved = await ack(gm, 'actor_consequence', cmdSaved);
      assert.equal(replaySaved.success, true);
      assert.equal(replaySaved.receipt.commandId, resSaved.receipt.commandId);
      assert.deepEqual(hp(target), { current: 26, temp: 0 });

      // 2. Writer refusal changes nothing; retry succeeds once with rider applied on failed branch
      const aFailed = makeApproval([4]); // 1d8+3 = 7
      assert.equal((await ack(owner, 'actor_spell_approve', aFailed)).code, 'awaiting_gm');
      const beforePools = pools();
      const beforeHp = hp(target);
      const cmdFailed = buildEffectCommand(aFailed, { branch: 'failed' });
      const origAdmit = writer.admitConsequence;
      live().isPermanent = true;
      writer.admitConsequence = () => ({ queued: false, code: 'save_branch_writer_refusal' });
      const refusedWrite = await ack(gm, 'actor_consequence', cmdFailed);
      assert.equal(refusedWrite.success, false);
      assert.equal(refusedWrite.code, 'save_branch_writer_refusal');
      assert.deepEqual(pools(), beforePools);
      assert.deepEqual(hp(target), beforeHp);

      writer.admitConsequence = origAdmit;
      live().isPermanent = false;
      const resFailed = await ack(gm, 'actor_consequence', cmdFailed);
      assert.equal(resFailed.success, true, JSON.stringify(resFailed));
      assert.deepEqual(hp(target), { current: 19, temp: 0 });
      assert.equal(token(target).state.conditions.filter(profile.isMovementModifier).length, 1);
    });
  });


});
