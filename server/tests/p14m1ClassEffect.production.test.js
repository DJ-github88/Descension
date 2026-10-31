/* M1 class-effect:v1 — one class-paid composed effect through the registered production handlers.
 * Rime-Iron Clasp (locked Arcanoneer record) is the pilot; the record bytes are read, never edited.
 * The shipped profile entry carries no Class HQ confirmation; these tests mark it with an explicit
 * TEST FIXTURE reference in memory only, and one test proves the shipped (unconfirmed) entry is refused. */
const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const payments = require('../services/spellPayments');
const classEffect = require('../shared/services/classEffect');
const profileData = require('../shared/data/classEffectProfiles.json');
const profile = require('../shared/services/sharedConditionProfile');
const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });
const uuid = () => crypto.randomUUID();

const RECORD_HASH = 'ff1b91e10d21655d5dcbf16660b66a81330c8d1fc3f8570d9b62856b1d7e1649';
const ENTRY = profileData.profiles.find(e => e.recordHash === RECORD_HASH);
const FIXTURE_CONFIRMATION = { reference: 'TEST FIXTURE ONLY — not a Class HQ confirmation', by: 'p14m1 production test' };
const spheres = list => ({ type: 'elementalSpheres', spheres: list });

describe('P14-M1 class-effect:v1 — registered production handlers (Rime-Iron Clasp pilot)', function() {
  this.timeout(20000);
  let server, room, gm, owner, observer, writer, pcRef, foeRef, otherRef, ownerUid, epoch, clients;
  beforeEach(async() => {
    ENTRY.review.classHq = FIXTURE_CONFIRMATION;
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start(); clients = [];
    for (const e of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_decline', 'actor_spell_list', 'actor_recovery']) {
      server.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
    }
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); clients.push(gm); await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid, persistentRoomId: uuid() });
    for (const role of ['owner', 'observer']) {
      const c = server.connect({ token: role }); clients.push(c); await once(c, 'connect');
      const j = once(c, 'room_joined'); c.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j;
      if (role === 'owner') owner = c; else observer = c;
    }
    server.players.get(owner.id).character = { id: 'ilse', class: 'Arcanoneer', classResource: { type: 'elementalSpheres', spheres: ['rime', 'rime', 'ember'], current: 3, max: 12 } };
    server.setCharacterOwner('ilse', ownerUid);
    const pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'ilse', name: 'Ilse', class: 'Arcanoneer', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 },
      actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 3, tempActionPoints: 1, classResource: { type: 'elementalSpheres', spheres: ['rime', 'rime', 'ember'] } }, state: { conditions: [] } };
    const foe = id => ({ id, creatureId: 'grimmstalk', stats: { maxHp: 250, maxMana: 30, maxAP: 5, speed: 30 },
      state: { currentHp: 30, tempHealth: 4, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0, conditions: [] } });
    room.gameState.maps.default.characterTokens.pc = pc; room.gameState.maps.default.tokens.foe = foe('foe'); room.gameState.maps.default.tokens.other = foe('other');
    pcRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'ilse' }, snapshotHash: actors.hash(pc) })).ref;
    foeRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(live().gameState.maps.default.tokens.foe) })).ref;
    otherRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'other' }, snapshotHash: actors.hash(live().gameState.maps.default.tokens.other) })).ref;
    assert.ok(pcRef && foeRef && otherRef);
    epoch = (await ack(owner, 'actor_snapshot', { roomId: room.id })).actionEpoch;
    assert.equal((await sync(spheres(['rime', 'rime', 'ember']))).success, true);
  });
  afterEach(async() => { ENTRY.review.classHq = null; for (const c of clients) c.disconnect(); await server.stop(); });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const revision = ref => actors.locate(live(), ref).contract.revision;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: epoch, baseCommitSequence: actors.ledger(live()).commitSequence });
  const speed = ref => profile.movementBreakdown(30, token(ref).state.conditions).result;
  const moves = ref => token(ref).state.conditions.filter(profile.isMovementModifier);
  const chosen = r => JSON.parse(r.receipt.adjudication.chosenResult);
  async function sync(value) {
    return ack(owner, 'actor_consequence', { ...base(), actors: [{ ref: pcRef, expectedRevision: revision(pcRef), classPayment: { mode: 'sync', before: payments.home(token(pcRef)), after: { domain: 'elementalSpheres', value } } }] });
  }
  // Owner approval exactly as the client planner builds it (terms, price, payment price and disclosure from the pinned profile).
  function approval({ faces = [5], target = foeRef, before = spheres(['rime', 'rime', 'ember']), extra = {} } = {}) {
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: epoch, baseCommitSequence: actors.ledger(live()).commitSequence, source: pcRef, target,
      spell: { definitionId: ENTRY.spellId, definitionHash: classEffect.definitionHash(RECORD_HASH), name: ENTRY.name, kind: 'class-effect', damageTypes: ['rime'] },
      roll: { mode: 'physical', dice: [{ sides: 8, faces }], constant: 3, total: faces[0] + 3, reading: '1d8 + intelligence/4 → 1d8 + 3 (INT 12 ÷ 4, rounded down)' },
      price: { ap: 1, mana: 4 },
      classPayment: { domain: 'elementalSpheres', before, after: spheres(before.spheres.filter((s, i) => !(s === 'rime' && before.spheres.slice(0, i).filter(x => x === 'rime').length < 2))), price: { costs: ['rime', 'rime'], gains: [] } },
      effectTerms: JSON.parse(JSON.stringify(ENTRY.terms)), disclosure: classEffect.disclosure(ENTRY), rollAttributes: { intelligence: 12 }, ...extra };
  }
  async function approve(a) {
    const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a);
    assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before, 'approval spends nothing'); return r.contentHash;
  }
  function command(a, contentHash, branch, { amount, reason = '' } = {}) {
    const src = token(pcRef), tgt = token(a.target), temp = (current, t, cost) => ({ current: current - Math.max(0, cost - t), temp: Math.max(0, t - cost) });
    const final = amount ?? a.roll.total, fromTemp = Math.min(tgt.state.tempHealth, final);
    let ops = null, combination = null;
    if (classEffect.riderApplies(a.effectTerms, branch)) {
      const record = classEffect.recordFor(a, ENTRY), plan = profile.movementCombination(tgt.state.conditions, record);
      const add = { op: 'add', recordId: a.approvalId, record };
      ops = plan.ok && plan.replaces ? [{ op: 'remove', recordId: plan.replaces }, add] : [add];
      combination = plan.ok ? { outcome: plan.outcome, replacesInstanceId: plan.replaces } : null;
    }
    return { ...base(), source: pcRef, target: a.target, approval: { approvalId: a.approvalId, contentHash },
      actors: [{ ref: pcRef, expectedRevision: revision(pcRef), finalResources: { ap: temp(src.character.actionPoints.current, src.character.tempActionPoints, 1), mana: temp(src.character.mana.current, src.character.tempMana, 4) },
        classPayment: { mode: 'spell', domain: 'elementalSpheres', approvalHash: contentHash } },
      { ref: a.target, expectedRevision: revision(a.target), finalResources: { hp: { current: Math.max(0, tgt.state.currentHp - (final - fromTemp)), temp: tgt.state.tempHealth - fromTemp } }, ...(ops ? { conditions: ops } : {}) }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: final, adjustmentReason: reason,
        chosenResult: JSON.stringify(classEffect.resultFor(a, branch, combination)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function refused(event, data, code, socket = gm) {
    const before = actors.clone(live().gameState), r = await ack(socket, event, data);
    assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code, JSON.stringify(r));
    assert.deepEqual(live().gameState, before, 'refusal leaves state byte-identical'); return r;
  }
  async function castAndConfirm(branch, opts = {}) {
    const a = approval(opts), h = await approve(a); return { a, h, r: await accept(command(a, h, branch, opts)) };
  }
  const refill = () => { const c = token(pcRef).character; c.actionPoints.current = 2; c.tempActionPoints = 1; c.mana.current = 10; c.tempMana = 3; };
  const remove = (ref, id) => ({ ...base(), actors: [{ ref, expectedRevision: revision(ref), conditions: [{ op: 'remove', recordId: id }] }],
    adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact removal' } });

  it('failed save: AP, mana, two rime spheres, rime damage and Frozen Limbs −10 ft in one receipt; partial automation is recorded', async() => {
    const { r } = await castAndConfirm('failed');
    const pc = token(pcRef);
    assert.deepEqual([pc.character.actionPoints.current, pc.character.tempActionPoints, pc.character.mana.current, pc.character.tempMana], [2, 0, 9, 0]);
    assert.deepEqual(pc.state.classPayment.value, spheres(['ember']));
    assert.deepEqual([token(foeRef).state.currentHp, token(foeRef).state.tempHealth], [26, 0], '5 + 3 = 8 rime; temp HP first');
    assert.equal(moves(foeRef).length, 1); assert.equal(moves(foeRef)[0].name, 'Frozen Limbs'); assert.equal(speed(foeRef), 20);
    assert.equal(moves(foeRef)[0].effectDefinition, `class:arcanoneer:arc_frost_touch:${RECORD_HASH}`);
    assert.equal(moves(foeRef)[0].authoredDuration, 'Movement speed reduced by 10 feet for 1 round');
    assert.equal(moves(foeRef)[0].clockBoundary, 'manual'); assert.equal(profile.structuredBoundary(moves(foeRef)[0]), null, 'GM-managed, never a turn boundary');
    const c = chosen(r); assert.equal(c.branch, 'failed'); assert.equal(c.riderApplied, true); assert.equal(c.automation, 'partial');
    assert.equal(actors.ledger(live()).receipts.filter(x => x.commandId === r.receipt.commandId).length, 1);
  });

  it('successful save: payment and damage apply, no rider; an earlier Frozen Limbs is neither removed nor refreshed', async() => {
    const first = await castAndConfirm('failed'); const original = actors.clone(moves(foeRef)[0]);
    refill(); assert.equal((await sync(spheres(['rime', 'rime']))).success, true);
    const a = approval({ faces: [2], before: spheres(['rime', 'rime']) }), h = await approve(a), r = await accept(command(a, h, 'saved'));
    assert.equal(chosen(r).branch, 'saved'); assert.equal(chosen(r).riderApplied, false); assert.equal(chosen(r).conditionInstanceId, null);
    assert.deepEqual(moves(foeRef), [original]); assert.equal(speed(foeRef), 20);
    assert.deepEqual(token(pcRef).state.classPayment.value, spheres([]));
    assert.equal(token(foeRef).state.currentHp, 26 - 5);
    assert.ok(first.r.receipt.commandId !== r.receipt.commandId);
  });

  it('failed-save reapplication follows A11: same source refreshes (one instance, value not stacked); undefined combinations refuse with nothing applied', async() => {
    const first = await castAndConfirm('failed');
    refill(); assert.equal((await sync(spheres(['rime', 'rime']))).success, true);
    const a = approval({ before: spheres(['rime', 'rime']) }), h = await approve(a), r = await accept(command(a, h, 'failed'));
    assert.deepEqual(chosen(r).combination, { outcome: 'refreshed', replacesInstanceId: first.a.approvalId });
    assert.equal(moves(foeRef).length, 1); assert.equal(moves(foeRef)[0].recordId, a.approvalId); assert.equal(speed(foeRef), 20);
    // Same name, different definition (an authored A10/A11 "Frozen Limbs"): refused, the GM resolves.
    const authoredId = uuid(), authored = profile.makeMovementRecord(otherRef, authoredId, { sourceOccurrence: `authored-effect:${authoredId}`, timing: 'manual',
      sourceActor: foeRef, authoredDuration: 'Until thawed', feet: -5, label: 'Frozen Limbs', effectDefinition: `authored:${uuid()}:1:${'a'.repeat(64)}` });
    token(otherRef).state.conditions.push(authored);
    refill(); assert.equal((await sync(spheres(['rime', 'rime']))).success, true);
    const b = approval({ target: otherRef, before: spheres(['rime', 'rime']) }), hb = await approve(b);
    let refusal = await refused('actor_consequence', command(b, hb, 'failed'), 'modifier_combination_unresolved'); assert.match(refusal.error, /different effect named/);
    // The saved branch has no rider, so the same pending approval can still be recorded as saved.
    await accept(command(b, hb, 'saved')); assert.deepEqual(moves(otherRef), [authored]);
    // Same class effect from a different exact source: refused.
    const foreignId = uuid(), foreign = classEffect.recordFor({ approvalId: foreignId, target: otherRef, source: { ...pcRef, tokenId: 'pc2', characterId: 'kael' }, effectTerms: ENTRY.terms }, ENTRY);
    token(otherRef).state.conditions = [foreign];
    refill(); assert.equal((await sync(spheres(['rime', 'rime']))).success, true);
    const c = approval({ target: otherRef, before: spheres(['rime', 'rime']) }), hc = await approve(c);
    refusal = await refused('actor_consequence', command(c, hc, 'failed'), 'modifier_combination_unresolved'); assert.match(refusal.error, /different source/);
  });

  it('refusals install nothing: insufficient resources, Stunned source, non-GM authority, writer refusal, unbound branch', async() => {
    const a = approval(), h = await approve(a), c = command(a, h, 'failed');
    const ap = token(pcRef).character.actionPoints.current; token(pcRef).character.actionPoints.current = 0; token(pcRef).character.tempActionPoints = 0;
    await refused('actor_consequence', c, 'insufficient_resources');
    token(pcRef).character.actionPoints.current = ap; token(pcRef).character.tempActionPoints = 1;
    const stunId = uuid(), stun = profile.makeStunnedRecord(pcRef, stunId, { sourceOccurrence: 'manual-gm-test', timing: 'manual' });
    token(pcRef).state.conditions.push(stun);
    await refused('actor_consequence', c, 'actor_stunned');
    token(pcRef).state.conditions = [];
    await refused('actor_consequence', c, null, owner);
    live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'm1_writer_refusal' });
    await refused('actor_consequence', c, 'm1_writer_refusal'); live().isPermanent = false; delete writer.admitConsequence;
    const unbound = actors.clone(c); unbound.adjudication.chosenResult = JSON.stringify(classEffect.resultFor(a, 'applied'));
    await refused('actor_consequence', unbound, 'class_effect_branch_unbound');
    const sneaky = actors.clone(c); sneaky.actors[1].conditions = undefined; delete sneaky.actors[1].conditions;
    await refused('actor_consequence', sneaky, 'approval_mismatch');
    const r = await accept(c); assert.equal(chosen(r).branch, 'failed'); assert.equal(moves(foeRef).length, 1);
  });

  it('changed material terms require explicit reapproval; the retained faces then accept exactly once', async() => {
    const a = approval({ faces: [6] }), h = await approve(a);
    token(pcRef).state.classPayment = { version: 1, domain: 'elementalSpheres', value: spheres(['rime', 'rime', 'storm']) };
    await refused('actor_consequence', command(a, h, 'failed'), 'owner_reapproval_required');
    // The stale approval is closed for re-approval (existing P9 behaviour); it can never be consumed later.
    assert.equal(payments.get(live(), a.approvalId), null); assert.ok(payments.closedCode(live(), a.approvalId), 'closed');
    const again = approval({ faces: a.roll.dice[0].faces, before: spheres(['rime', 'rime', 'storm']) }), h2 = await approve(again);
    assert.deepEqual(again.roll, a.roll, 'same physical faces retained');
    const r = await accept(command(again, h2, 'failed'));
    assert.deepEqual(token(pcRef).state.classPayment.value, spheres(['storm'])); assert.equal(chosen(r).roll.total, 9);
    await refused('actor_consequence', command(a, h, 'failed'));
  });

  it('approval refuses anything that differs from the pinned profile, an unconfirmed profile, a PC target and a creature source', async() => {
    const tampered = approval(); tampered.effectTerms.rider.feet = -20;
    await refused('actor_spell_approve', tampered, 'class_effect_terms_mismatch', owner);
    const priced = approval({ extra: { price: { ap: 0, mana: 4 } } });
    await refused('actor_spell_approve', priced, 'class_effect_terms_mismatch', owner);
    const hidden = approval(); hidden.disclosure.notAutomated = [];
    await refused('actor_spell_approve', hidden, 'class_effect_terms_mismatch', owner);
    await refused('actor_spell_approve', approval({ target: pcRef }), null, owner);
    // Review M-1: the roll is bound to the pinned formula and the attested effective score.
    const inflated = approval(); inflated.roll = { mode: 'physical', dice: [{ sides: 100, faces: [100, 100, 100] }], constant: 999, total: 1299, reading: 'anything' };
    await refused('actor_spell_approve', inflated, 'class_effect_roll_mismatch', owner);
    const wrongConstant = approval(); wrongConstant.roll = { ...wrongConstant.roll, constant: 9, total: 14 };
    await refused('actor_spell_approve', wrongConstant, 'class_effect_roll_mismatch', owner);
    await refused('actor_spell_approve', approval({ extra: { rollAttributes: { intelligence: 12, spirit: 10 } } }), 'class_effect_roll_mismatch', owner);
    const twoDice = approval(); twoDice.roll = { ...twoDice.roll, dice: [{ sides: 8, faces: [5, 5] }], total: 13 };
    await refused('actor_spell_approve', twoDice, 'class_effect_roll_mismatch', owner);
    // Review m-3: only a character of the entry's class may cast it.
    token(pcRef).character.class = 'Warrior';
    await refused('actor_spell_approve', approval(), 'class_effect_class_mismatch', owner);
    token(pcRef).character.class = 'Arcanoneer';
    ENTRY.review.classHq = null;
    await refused('actor_spell_approve', approval(), 'class_effect_profile_unavailable', owner);
    ENTRY.review.classHq = FIXTURE_CONFIRMATION;
    const creature = { ...approval(), source: foeRef, sourceAuthority: { admissionId: uuid(), associationHash: 'a'.repeat(64), gmUid: 'gm' } };
    await refused('actor_spell_prepare_creature', creature, null);
  });

  it('unknown outcome: the same command returns the original receipt; duplicates never charge or apply twice', async() => {
    const a = approval(), h = await approve(a), c = command(a, h, 'failed');
    gm.emit('actor_consequence', c); await new Promise(res => setTimeout(res, 80)); // ACK lost
    const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    const again = await ack(gm, 'actor_consequence', c); assert.deepEqual(again.receipt, r.receipt);
    assert.equal(actors.ledger(live()).receipts.filter(x => x.commandId === c.commandId).length, 1);
    assert.equal(moves(foeRef).length, 1); assert.deepEqual(token(pcRef).state.classPayment.value, spheres(['ember']));
    assert.equal(token(pcRef).character.mana.current, 9);
    await refused('actor_consequence', { ...c, commandId: uuid() });
  });

  it('privacy: bank internals and fingerprinting hashes stay private; the public receipt carries branch, rider and partial status', async() => {
    const a = approval(), h = await approve(a);
    const list = await ack(gm, 'actor_spell_list', { roomId: room.id }); const view = list.pending.find(p => p.approval.approvalId === a.approvalId);
    assert.ok(view); assert.equal('after' in view.approval.classPayment, false); assert.equal('before' in view.approval.classPayment, false);
    assert.ok(view.approval.disclosure.notAutomated.some(line => line.includes('+1d4')));
    const r = await accept(command(a, h, 'failed'));
    const pub = actors.publicReceipt(r.receipt), c = JSON.parse(pub.adjudication.chosenResult);
    assert.equal(c.branch, 'failed'); assert.equal(c.automation, 'partial'); assert.equal(c.rider.label, 'Frozen Limbs');
    assert.equal(pub.contentHash, undefined); assert.equal(pub.authorization.approvalHash, undefined);
    assert.deepEqual(pub.actors[0].classPayment.public, { type: 'elementalSpheres', current: 1, max: 12, spheres: ['ember'] });
    const snap = await ack(observer, 'actor_snapshot', { roomId: room.id });
    assert.equal(JSON.stringify(snap).includes('classPayment'), false);
  });

  it('the GM removes the exact rider instance and speed is restored; generic writes cannot create or rewrite class-effect provenance', async() => {
    const { a } = await castAndConfirm('failed'); assert.equal(speed(foeRef), 20);
    const forged = actors.clone(moves(foeRef)[0]); forged.recordId = forged.id = uuid(); forged.sourceEntityId = `class-effect:${forged.recordId}`;
    await refused('actor_consequence', { ...base(), actors: [{ ref: otherRef, expectedRevision: revision(otherRef), conditions: [{ op: 'add', recordId: forged.recordId, record: { ...forged, target: otherRef, targetId: 'other' } }] }],
      adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'forge' } });
    await refused('actor_consequence', remove(foeRef, a.approvalId), null, owner);
    await accept(remove(foeRef, a.approvalId)); assert.equal(moves(foeRef).length, 0); assert.equal(speed(foeRef), 30);
  });

  it('review m-2/N-2: class-effect approvals never enter the Minstrel allowlist; class-effect occurrences are movement riders only', () => {
    const probe = { ...JSON.parse(JSON.stringify(ENTRY)), spellId: 'minstrel_probe', name: 'Probe', recordHash: 'b'.repeat(64), review: { classHq: FIXTURE_CONFIRMATION } };
    profileData.profiles.push(probe);
    try {
      const a = approval(); a.spell = { ...a.spell, definitionId: 'minstrel_probe', name: 'Probe', definitionHash: classEffect.definitionHash('b'.repeat(64)) };
      assert.doesNotThrow(() => payments.validateApproval(a));
    } finally { profileData.profiles.pop(); }
    assert.throws(() => profile.makeStunnedRecord(foeRef, uuid(), { sourceOccurrence: `class-effect:${uuid()}`, timing: 'manual', authoredDuration: 'x' }), /movement riders only/);
  });

  it('the shipped profile entry is unconfirmed and is refused at runtime', () => {
    ENTRY.review.classHq = null;
    const shipped = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '../shared/data/classEffectProfiles.json'), 'utf8')).profiles.find(e => e.recordHash === RECORD_HASH);
    assert.equal(shipped.review.classHq, null);
    assert.equal(classEffect.profileFor(RECORD_HASH).ok, false);
  });
});
