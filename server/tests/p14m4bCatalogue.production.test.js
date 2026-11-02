const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const payments = require('../services/spellPayments');
const roomAccess = require('../services/roomAccessService');
const pure = require('../shared/services/authoredAbility');
const catalogue = require('../../vtt-react/src/services/catalogueAbility.cjs');

/** The complete catalogue record, copied verbatim from martyrData.js. */
const MARTYR_RECORD = {
  id: 'martyr_restorative_prayer', name: 'Restorative Prayer',
  description: 'Channel sacred energy through prayer to heal an ally. Scales with Spirit and can be amplified with Devotion.',
  level: 1, spellType: 'ACTION', icon: 'Healing/Golden Heart',
  typeConfig: { school: 'ember', icon: 'Healing/Golden Heart', tags: ['healing', 'basic', 'devotion amplifiable', 'level 1'], castTime: 1, castTimeType: 'IMMEDIATE' },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['ally'] },
  resourceCost: { resourceTypes: ['mana'], resourceValues: { mana: 5, classResource: { type: 'devotion', gain: 1 } }, useFormulas: {}, actionPoints: 1,
    components: ['verbal', 'somatic'], verbalText: 'Sanatio Divina', somaticText: 'Hands clasped in prayer' },
  resolution: 'DICE', effectTypes: ['healing'],
  healingConfig: { formula: '1d4 + spirit', healingType: 'direct', hasHotEffect: false, description: 'The restorative prayer mends wounds.' },
  devotionRequired: 0, devotionGain: 1, cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
  tags: ['healing', 'basic', 'devotion amplifiable', 'level 1']
};
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });
const once = (s, e) => new Promise(resolve => s.once(e, resolve));

describe('M4B catalogue formula + typed class payment + primary-PC healing consent', function() {
  this.timeout(20000);
  let server, room, gm, owner, tgtOwner, writer, pc, pc2, ownerUid, tgtUid, entry, approval, proposal;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_spell_approve', 'actor_spell_target_respond', 'actor_spell_list']) server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    ownerUid = server.nextUserId(); tgtUid = server.nextUserId(); const gmUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('tgt', tgtUid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const [role, uid] of [['owner', ownerUid], ['tgt', tgtUid]]) {
      const s = server.connect({ token: role }); await once(s, 'connect'); const joined = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await joined;
      server.setCharacterOwner(role === 'owner' ? 'c' : 'c2', uid); server.players.get(s.id).character = { id: role === 'owner' ? 'c' : 'c2', class: 'Martyr' };
      if (role === 'owner') owner = s; else tgtOwner = s;
    }
    const map = room.gameState.maps.default, before = { type: 'devotionGauge', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 };
    map.characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', name: 'Caster', class: 'Martyr', stats: { spirit: 18 }, classResource: { type: 'devotion', current: 0, max: 6 },
      health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 },
      state: { conditions: [] } };
    map.characterTokens.pc2 = { id: 'pc2', ownerUserId: tgtUid, character: { id: 'c2', name: 'Ally', class: 'Martyr', health: { current: 20, max: 30 }, tempHealth: 3, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 } }, state: { conditions: [] } };
    for (const [kind, id] of [['character', 'pc'], ['character', 'pc2']]) {
      const token = map.characterTokens[id];
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind, roomId: room.id, mapId: 'default', tokenId: id, ownerUid: id === 'pc' ? ownerUid : tgtUid, characterId: id === 'pc' ? 'c' : 'c2' }, snapshotHash: actors.hash(token) });
      assert.equal(r.success, true, JSON.stringify(r)); if (id === 'pc') pc = r.ref; else pc2 = r.ref;
    }
    // Class home is published after binding, like the client's existing syncHome path.
    actors.locate(room, pc).token.state.classPayment = { version: 1, domain: 'devotionGauge', value: before };
    const prepared = catalogue.catalogueDraft(MARTYR_RECORD, 'martyr', { authoredDefinitionId: uuid(), id: 'catalogue-martyr' });
    assert.equal(prepared.ok, true, prepared.reason);
    const admitted = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, record: prepared.draft, definitionVersion: 1, classId: 'martyr' });
    assert.equal(admitted.success, true, JSON.stringify(admitted));
    entry = installed.list(room).entries.find(e => e.canonicalDefinition.catalogueSource?.spellId === MARTYR_RECORD.id);
    assert.ok(entry); assert.equal(entry.descriptor.compilerVersion, 'p14-m4b-class-payment-1');
    assert.deepEqual(entry.descriptor.classPayment, { domain: 'devotionGauge', price: { cost: 0, gain: 1, required: 0 } });
  });
  afterEach(async() => { owner?.disconnect(); tgtOwner?.disconnect(); gm?.disconnect(); await server.stop(); });
  const token = ref => actors.locate(room, ref).token;
  const projected = ref => { const source = actors.locate(room, ref); return roomAccess.projectTokenForClient(source.token); };
  function makeApproval() {
    const source = token(pc), target = token(pc2);
    const reading = pure.readScaledFormula(entry.canonicalDefinition.effect.formula, { spirit: 18 });
    const before = source.state.classPayment.value;
    const after = { type: 'devotionGauge', current: 1, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 1 };
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence,
      source: pc, target: pc2,
      spell: { definitionId: pure.actionId(entry.definitionRef), definitionHash: `${pure.FORMULA_CAPABILITY}/${entry.definitionRef.definitionHash}`,
        name: entry.canonicalDefinition.name, kind: 'healing', damageTypes: [] },
      roll: { mode: 'physical', dice: [{ sides: 4, faces: [4] }], constant: reading.constant, reading: reading.reading, total: 4 + 18 },
      rollAttributes: { spirit: 18 }, formulaSourceRevision: source.state.actorContract.revision,
      formulaSourceHash: actors.hash({ character: projected(pc).character, conditions: projected(pc).state?.conditions || [] }),
      price: entry.descriptor.price, classPayment: { domain: 'devotionGauge', before, after, price: entry.descriptor.classPayment.price } };
  }
  async function approve(a) {
    const before = actors.clone(room.gameState); const r = await ack(owner, 'actor_spell_approve', a);
    assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(room.gameState, before);
    const pending = payments.get(room, a.approvalId); proposal = payments.targetProposal(pending); assert.ok(proposal?.healing);
    return r.contentHash;
  }
  async function accept() {
    const r = await ack(tgtOwner, 'actor_spell_target_respond', { roomId: room.id, approvalId: proposal.approvalId, proposalId: proposal.proposalId, termsHash: proposal.termsHash, target: pc2, accept: true });
    assert.equal(r.success, true, JSON.stringify(r)); proposal = r.proposal;
  }
  function command(a, hash) {
    const source = actors.resources(token(pc), 'character'), target = actors.resources(token(pc2), 'character');
    const amount = a.roll.total, finalHp = { current: Math.min(target.hp.max, target.hp.current + amount), temp: target.hp.temp };
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence,
      source: pc, target: pc2, approval: { approvalId: a.approvalId, contentHash: hash },
      actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { ap: payments.tempFirst(source.ap.current, source.ap.temp, 1), mana: payments.tempFirst(source.mana.current, source.mana.temp, 5) },
        classPayment: { mode: 'spell', domain: 'devotionGauge', approvalHash: hash } },
      { ref: pc2, expectedRevision: token(pc2).state.actorContract.revision, finalResources: { hp: finalHp } }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash,
        chosenResult: JSON.stringify({ capability: pure.FORMULA_CAPABILITY, approvalId: a.approvalId, roll: a.roll, kind: 'healing', damageTypes: [], spellName: a.spell.name,
          sourceName: 'Caster', targetName: 'Ally', gmConfirmed: true, actualHealing: finalHp.current - target.hp.current }),
        finalAmount: amount, adjustmentReason: '' } };
  }
  it('whole catalogue source compiles; source and target consent are separate; one receipt commits payment, Devotion gain and capped HP', async() => {
    const a = makeApproval(), hash = await approve(a);
    assert.deepEqual(token(pc).state.classPayment.value, { type: 'devotionGauge', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 });
    const before = actors.clone(room.gameState);
    assert.equal((await ack(gm, 'actor_consequence', command(a, hash))).code, 'target_acceptance_required'); assert.deepEqual(room.gameState, before);
    await accept(); const commandOnce = command(a, hash); const accepted = await ack(gm, 'actor_consequence', commandOnce); assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.equal(token(pc).character.health.current, 20); assert.equal(token(pc).character.actionPoints.current, 3); assert.equal(token(pc).character.mana.current, 5);
    assert.deepEqual(token(pc).state.classPayment.value, { type: 'devotionGauge', current: 1, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 1 });
    assert.equal(token(pc2).character.health.current, 30); assert.equal(token(pc2).character.tempHealth, 3);
    assert.equal(JSON.parse(accepted.receipt.adjudication.chosenResult).actualHealing, 10);
    const after = actors.clone(room.gameState); assert.deepEqual((await ack(gm, 'actor_consequence', commandOnce)).receipt, accepted.receipt); assert.deepEqual(room.gameState, after);
  });
  it('target refusal, stale source and writer refusal install no partial costs or healing', async() => {
    const a = makeApproval(), hash = await approve(a);
    await ack(tgtOwner, 'actor_spell_target_respond', { roomId: room.id, approvalId: proposal.approvalId, proposalId: proposal.proposalId, termsHash: proposal.termsHash, target: pc2, accept: false });
    const before = actors.clone(room.gameState); assert.equal((await ack(gm, 'actor_consequence', command(a, hash))).code, 'target_acceptance_required'); assert.deepEqual(room.gameState, before);
    assert.equal((await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a })).success, true);
    const b = makeApproval(); const bHash = await approve(b); await accept();
    token(pc).character.stats.spirit = 20; const stale = actors.clone(room.gameState);
    assert.equal((await ack(gm, 'actor_consequence', command(b, bHash))).code, 'owner_reapproval_required'); assert.deepEqual(room.gameState, stale);
    token(pc).character.stats.spirit = 18;
    await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: b.approvalId, approval: b });
    const b2 = makeApproval(), b2Hash = await approve(b2); await accept();
    const beforeWriter = actors.clone(room.gameState);
    room.isPermanent = true; const original = writer.admitConsequence; writer.admitConsequence = () => ({ queued: false, code: 'm4b_writer_refusal' });
    assert.equal((await ack(gm, 'actor_consequence', command(b2, b2Hash))).code, 'm4b_writer_refusal'); assert.deepEqual(room.gameState, beforeWriter);
    writer.admitConsequence = original;
  });
  it('rejects a forged class price, wrong target owner and non-exact final healing before installation', async() => {
    const a = makeApproval(); a.classPayment.price = { cost: 0, gain: 2, required: 0 };
    const before = actors.clone(room.gameState); assert.equal((await ack(owner, 'actor_spell_approve', a)).success, false); assert.deepEqual(room.gameState, before);
    const b = makeApproval(), hash = await approve(b); await accept();
    const c = command(b, hash); c.adjudication.finalAmount = 21; c.adjudication.chosenResult = JSON.stringify({ ...JSON.parse(c.adjudication.chosenResult), roll: b.roll, gmConfirmed: true });
    const stale = actors.clone(room.gameState); assert.equal((await ack(gm, 'actor_consequence', c)).success, false); assert.deepEqual(room.gameState, stale);
  });
});

