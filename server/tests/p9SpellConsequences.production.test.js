/** Original P9 server layer through the real registered stack (S3/S5/S6/S7/S9).
 * Fixtures: provider ID verification, owner documents, lease backend, cloud transport. */
const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const codec = require('../services/roomCheckpoint');
const actors = require('../services/actorConsequences');
const payments = require('../services/spellPayments');

const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 5000);
  client.emit(event, payload, result => {clearTimeout(timer); resolve(result);});
});
const once = (client, event) => new Promise(resolve => client.once(event, resolve));
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const DEF_HASH = `p9-spell:v1/${sha('arc_spark_bolt')}`;

describe('P9 owner-approved spell consequences (registered production stack)', function() {
  this.timeout(20000);
  let server, writer, gm, owner, other, gmUid, ownerUid, otherUid, room, pcRef, foeRef, clients, epoch;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start(); clients = [];
    for (const event of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_decline', 'actor_spell_list', 'actor_recovery', 'character_resource_updated']) {
      server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
    }
    gmUid = server.nextUserId(); ownerUid = server.nextUserId(); otherUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('other', otherUid);
    gm = server.connect({ token: 'gm' }); clients.push(gm); await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid, persistentRoomId: crypto.randomUUID() });
    for (const [token, name] of [['owner', 'Owner'], ['other', 'Other']]) {
      const client = server.connect({ token }); clients.push(client); await once(client, 'connect');
      const joined = once(client, 'room_joined'); client.emit('join_room', { roomId: room.id, playerName: name, password: '' }); await joined;
      if (token === 'owner') {owner = client;} else {other = client;}
    }
    const ownerPlayer = server.players.get(owner.id);
    ownerPlayer.character = { id: 'ilse', class: 'Arcanoneer', classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'], current: 3, max: 12 } };
    server.setCharacterOwner('ilse', ownerUid);
    const pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'ilse', name: 'Ilse', class: 'Arcanoneer', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 },
      actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 3, tempActionPoints: 1, classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'] } }, state: { conditions: [] } };
    const foe = { id: 'foe', creatureId: 'grimmstalk', stats: { maxHp: 250, maxMana: 30, maxAP: 5 }, state: { currentHp: 30, tempHealth: 4, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0, conditions: [] } };
    room.gameState.maps.default.characterTokens.pc = pc; room.gameState.maps.default.tokens.foe = foe;
    pcRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'ilse' }, snapshotHash: actors.hash(pc) })).ref;
    foeRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(foe) })).ref;
    assert.ok(pcRef && foeRef);
    epoch = (await ack(owner, 'actor_snapshot', { roomId: room.id })).actionEpoch;
  });
  afterEach(async() => {for (const client of clients) {client.disconnect();} await server.stop();});
  const snap = async client => ack(client, 'actor_snapshot', { roomId: room.id });
  const revision = ref => actors.locate(room, ref).contract.revision;
  const command = async(client, entries, extra = {}) => ({ version: 1, roomId: room.id, commandId: crypto.randomUUID(), actionEpoch: epoch,
    baseCommitSequence: (await snap(client)).commitSequence, actors: entries, ...extra });
  const spheres = list => ({ type: 'elementalSpheres', spheres: list });
  const sync = async(before, after, client = owner) => ack(client, 'actor_consequence', await command(client, [{ ref: pcRef, expectedRevision: revision(pcRef),
    classPayment: { mode: 'sync', before, after } }]));
  const approval = (extra = {}) => ({ version: 1, roomId: room.id, approvalId: crypto.randomUUID(), actionEpoch: epoch, baseCommitSequence: actors.ledger(room).commitSequence, source: pcRef, target: foeRef,
    spell: { definitionId: 'arc_spark_bolt', definitionHash: DEF_HASH, name: 'Marrow-Piercing Slug', kind: 'damage', damageTypes: ['arcane'] },
    roll: { mode: 'physical', dice: [{ sides: 8, faces: [6] }], constant: 4, total: 10, reading: '1d8 + intelligence/4 → 1d8 + 4 (INT 16 ÷ 4, rounded down)' },
    price: { ap: 1, mana: 4 },
    classPayment: { domain: 'elementalSpheres', before: spheres(['arcane', 'arcane', 'ember']), after: spheres(['ember']), price: { costs: ['arcane', 'arcane'], gains: [] } }, ...extra });
  const gmCommand = async(approved, contentHash, overrides = {}) => {
    const final = overrides.finalAmount ?? 7;
    const chosen = JSON.stringify({ capability: 'p9-spell:v1', approvalId: approved.approvalId, roll: overrides.roll || approved.roll, kind: approved.spell.kind, damageTypes: approved.spell.damageTypes, gmConfirmed: true });
    const source = actors.locate(room, pcRef).token, foe = actors.locate(room, foeRef).token;
    const temp = (current, tempValue, cost) => ({ current: current - Math.max(0, cost - tempValue), temp: Math.max(0, tempValue - cost) });
    return command(gm, overrides.entries || [
      { ref: pcRef, expectedRevision: revision(pcRef), finalResources: { ap: temp(source.character.actionPoints.current, source.character.tempActionPoints, approved.price.ap),
        mana: temp(source.character.mana.current, source.character.tempMana, approved.price.mana) }, classPayment: { mode: 'spell', domain: 'elementalSpheres', approvalHash: contentHash } },
      { ref: foeRef, expectedRevision: revision(foeRef), finalResources: { hp: overrides.hp || { current: Math.max(0, foe.state.currentHp - Math.max(0, final - foe.state.tempHealth)), temp: Math.max(0, foe.state.tempHealth - final) } } }],
    { source: pcRef, target: foeRef, approval: { approvalId: approved.approvalId, contentHash },
      adjudication: { definitionId: 'arc_spark_bolt', definitionVersionOrHash: DEF_HASH, chosenResult: chosen, finalAmount: final, adjustmentReason: final === 10 ? '' : 'Durability bypass ruled' } });
  };

  it('C2 Stunned refuses P9 consent and installation of an earlier consent; typed bank, AP/mana, HP and original roll remain unchanged', async() => {
    assert.equal((await sync(null, { domain: 'elementalSpheres', value: spheres(['arcane', 'arcane', 'ember']) })).success, true);
    const approved = approval(), registered = await ack(owner, 'actor_spell_approve', approved);
    assert.equal(registered.code, 'awaiting_gm'); const prepared = await gmCommand(approved, registered.contentHash);
    const p = require('../../vtt-react/src/services/sharedConditionProfile'), id = crypto.randomUUID();
    const record = p.makeStunnedRecord(pcRef, id, { sourceOccurrence: 'C2 critical' });
    const correction = op => command(gm, [{ ref: pcRef, expectedRevision: revision(pcRef), conditions: [{ op, recordId: id, ...(op === 'add' ? { record } : {}) }] }], {
      target: pcRef, adjudication: { definitionId: p.STUNNED.definitionId, definitionVersionOrHash: p.STUNNED.origin, chosenResult: 'Manual state correction' }
    });
    assert.equal((await ack(gm, 'actor_consequence', await correction('add'))).success, true);
    const before = actors.clone(room.gameState), retained = actors.clone(payments.get(room, approved.approvalId));
    assert.equal((await ack(owner, 'actor_spell_approve', approval())).code, 'actor_stunned');
    assert.equal((await ack(gm, 'actor_consequence', prepared)).code, 'actor_stunned');
    assert.deepEqual(room.gameState, before); assert.deepEqual(payments.get(room, approved.approvalId), retained);
    assert.equal((await ack(gm, 'actor_consequence', await correction('remove'))).success, true);
    const accepted = await ack(gm, 'actor_consequence', await gmCommand(approved, registered.contentHash));
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.deepEqual(payments.consumedReceipt(room, approved.approvalId).source, pcRef);
  });
  it('S3/S9 owner sync, approval, GM adjudication and one atomic receipt; public receipt carries no private class fields', async() => {
    const synced = await sync(null, { domain: 'elementalSpheres', value: spheres(['arcane', 'arcane', 'ember']) });
    assert.equal(synced.success, true, JSON.stringify(synced));
    assert.deepEqual(synced.receipt.actors[0].classPayment, { mode: 'sync', domain: 'elementalSpheres', public: { type: 'elementalSpheres', current: 3, max: 12, spheres: ['arcane', 'arcane', 'ember'] } });
    const approved = approval();
    const pending = once(gm, 'actor_spell_pending');
    const registered = await ack(owner, 'actor_spell_approve', approved);
    assert.equal(registered.code, 'awaiting_gm', JSON.stringify(registered));
    const gmView = await pending;
    assert.equal(gmView.contentHash, registered.contentHash); assert.equal(gmView.approval.classPayment.afterPublic.current, 1);
    assert.equal('after' in gmView.approval.classPayment, false);
    assert.equal(JSON.stringify(room.gameState.maps.default.characterTokens.pc.character.mana), JSON.stringify({ current: 10, max: 30 }), 'approval reserves; it never pre-spends');
    const cmd = await gmCommand(approved, registered.contentHash);
    const ownerSees = once(owner, 'actor_consequence_accepted');
    const accepted = await ack(gm, 'actor_consequence', cmd);
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    const pc = actors.locate(room, pcRef).token, foe = actors.locate(room, foeRef).token;
    assert.deepEqual([pc.character.actionPoints.current, pc.character.tempActionPoints, pc.character.mana.current, pc.character.tempMana], [2, 0, 9, 0]);
    assert.deepEqual(pc.state.classPayment, { version: 1, domain: 'elementalSpheres', value: spheres(['ember']) });
    assert.deepEqual([foe.state.currentHp, foe.state.tempHealth], [27, 0]);
    assert.deepEqual(accepted.receipt.authorization, { kind: 'owner-approval-gm', authorizerUid: gmUid, proposalId: approved.approvalId, approvalHash: registered.contentHash });
    assert.deepEqual(accepted.receipt.actors[0].classPayment.public, { type: 'elementalSpheres', current: 1, max: 12, spheres: ['ember'] });
    assert.equal((await ownerSees).receipt.commandId, cmd.commandId);
    assert.equal(server.players.get(owner.id).character.classResource.spheres.join(), 'ember');
    // Retries: same approval and same command return the original receipt; a second command cannot reuse it.
    assert.deepEqual((await ack(owner, 'actor_spell_approve', approved)).receipt, accepted.receipt);
    assert.deepEqual((await ack(gm, 'actor_consequence', cmd)).receipt, accepted.receipt);
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, registered.contentHash))).code, 'approval_consumed');
    assert.equal(actors.ledger(room).receipts.length, 2);
    // Private home survives the real writer/P3 codec; public projection never carries it.
    const retained = writer.getRetainedSnapshot(room.id);
    assert.deepEqual(retained.maps.default.characterTokens.pc.state.classPayment, pc.state.classPayment);
    const prepared = codec.buildCheckpointDocuments({ roomId: room.id, gameState: retained, revision: accepted.receipt.checkpointRevision });
    assert.equal(prepared.ok, true);
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: prepared.manifest, globalDoc: prepared.global.data, mapDocsById: Object.fromEntries(prepared.maps.map(doc => [doc.mapId, doc.data])) });
    assert.equal(decoded.ok, true); assert.deepEqual(decoded.maps.default.characterTokens.pc.state.classPayment, pc.state.classPayment);
    const publicSnapshot = await snap(other);
    assert.equal(JSON.stringify(publicSnapshot).includes('classPayment'), false);
    assert.equal((await ack(owner, 'actor_recovery', { roomId: room.id, ref: pcRef })).recovery.rawToken.state.classPayment.value.spheres[0], 'ember');
    assert.equal((await ack(other, 'actor_recovery', { roomId: room.id, ref: pcRef })).code, 'forbidden');
  });
  it('S4 Martyr self-heal is one actor; ledger result is private and public receipt shows only current/max', async() => {
    const ledger = { type: 'devotionGauge', current: 2, max: 6, damage: 62, earnedLevels: 4, spentLevels: 2, bonusLevels: 0 };
    assert.equal((await sync(null, { domain: 'devotionGauge', value: ledger })).success, true);
    const after = { ...ledger, current: 3, spentLevels: 1 };
    const approved = approval({ target: pcRef, spell: { definitionId: 'martyr_restorative_prayer', definitionHash: `p9-spell:v1/${sha('prayer')}`, name: 'Restorative Prayer', kind: 'healing', damageTypes: [] },
      roll: { mode: 'digital', dice: [{ sides: 4, faces: [3] }], constant: 14, total: 17, reading: '1d4 + spirit → 1d4 + 14 (SPI score)' }, price: { ap: 1, mana: 5 },
      classPayment: { domain: 'devotionGauge', before: ledger, after, price: { cost: 0, gain: 1, required: 0 } } });
    const registered = await ack(owner, 'actor_spell_approve', approved); assert.equal(registered.code, 'awaiting_gm', JSON.stringify(registered));
    const chosen = JSON.stringify({ capability: 'p9-spell:v1', approvalId: approved.approvalId, roll: approved.roll, kind: 'healing', damageTypes: [], gmConfirmed: true });
    const accepted = await ack(gm, 'actor_consequence', await command(gm, [{ ref: pcRef, expectedRevision: revision(pcRef),
      finalResources: { ap: { current: 2, temp: 0 }, mana: { current: 8, temp: 0 }, hp: { current: 37, temp: 0 } }, classPayment: { mode: 'spell', domain: 'devotionGauge', approvalHash: registered.contentHash } }],
    { source: pcRef, target: pcRef, approval: { approvalId: approved.approvalId, contentHash: registered.contentHash },
      adjudication: { definitionId: 'martyr_restorative_prayer', definitionVersionOrHash: approved.spell.definitionHash, chosenResult: chosen, finalAmount: 17, adjustmentReason: '' } }));
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.equal(accepted.receipt.actors.length, 1); assert.equal(accepted.receipt.actors[0].afterRevision, accepted.receipt.actors[0].beforeRevision + 1);
    assert.deepEqual(actors.locate(room, pcRef).token.state.classPayment.value, after);
    assert.deepEqual(accepted.receipt.actors[0].classPayment.public, { type: 'devotionGauge', current: 3, max: 6 });
    assert.equal(JSON.stringify(accepted.receipt).includes('spentLevels'), false);
    // Conservation: a ledger that does not restore spent first is refused before registration.
    const bad = approval({ ...approved, approvalId: crypto.randomUUID(), classPayment: { ...approved.classPayment, before: after, after: { ...after, current: 4, spentLevels: 1, bonusLevels: 1 } } });
    assert.equal((await ack(owner, 'actor_spell_approve', bad)).code, 'class_payment_mismatch');
  });
  it('S5 revision bump or temp split change needs no owner re-approval; a changed class home requires it', async() => {
    await sync(null, { domain: 'elementalSpheres', value: spheres(['arcane', 'arcane', 'ember']) });
    const approved = approval();
    const { contentHash } = await ack(owner, 'actor_spell_approve', approved);
    const stale = await gmCommand(approved, contentHash);
    // An unrelated GM manual change spends the temporary mana (revision bump + split change).
    assert.equal((await ack(gm, 'actor_consequence', await command(gm, [{ ref: pcRef, expectedRevision: revision(pcRef), finalResources: { mana: { current: 10, temp: 0 } } }]))).success, true);
    const before = JSON.stringify(room.gameState);
    assert.equal((await ack(gm, 'actor_consequence', stale)).code, 'stale_actor_revision');
    assert.equal(JSON.stringify(room.gameState), before);
    const replanned = await gmCommand(approved, contentHash);
    assert.deepEqual(replanned.actors[0].finalResources.mana, { current: 6, temp: 0 });
    const accepted = await ack(gm, 'actor_consequence', replanned);
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    // Class home changed after approval (authoritative restore simulated) → owner must re-approve.
    await sync({ domain: 'elementalSpheres', value: spheres(['ember']) }, { domain: 'elementalSpheres', value: spheres(['arcane', 'arcane', 'storm']) });
    const second = approval({ classPayment: { domain: 'elementalSpheres', before: spheres(['arcane', 'arcane', 'storm']), after: spheres(['storm']), price: { costs: ['arcane', 'arcane'], gains: [] } } });
    const registered = await ack(owner, 'actor_spell_approve', second);
    assert.equal(registered.code, 'awaiting_gm');
    actors.locate(room, pcRef).token.state.classPayment.value = spheres(['arcane', 'arcane', 'rime']);
    const closed = once(owner, 'actor_spell_closed');
    const snapshotBefore = JSON.stringify(room.gameState);
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(second, registered.contentHash))).code, 'owner_reapproval_required');
    assert.equal(JSON.stringify(room.gameState), snapshotBefore);
    assert.deepEqual(await closed, { roomId: room.id, approvalId: second.approvalId, contentHash: registered.contentHash, code: 'owner_reapproval_required' });
    assert.equal((await ack(owner, 'actor_spell_approve', second)).code, 'approval_owner_reapproval_required');
  });
  it('S6 legacy class writes and owner sync are fenced while pending; non-owners and malformed approvals refuse', async() => {
    await sync(null, { domain: 'elementalSpheres', value: spheres(['arcane', 'arcane', 'ember']) });
    const approved = approval();
    const { contentHash } = await ack(owner, 'actor_spell_approve', approved);
    const mirror = JSON.stringify(server.players.get(owner.id).character.classResource);
    const fenced = await ack(owner, 'character_resource_updated', { roomId: room.id, resource: 'classResource', classResource: spheres([]), playerId: server.players.get(owner.id).id });
    assert.equal(fenced.code, 'class_payment_pending');
    assert.equal(JSON.stringify(server.players.get(owner.id).character.classResource), mirror);
    assert.equal((await sync({ domain: 'elementalSpheres', value: spheres(['arcane', 'arcane', 'ember']) }, { domain: 'elementalSpheres', value: spheres([]) })).code, 'class_payment_pending');
    assert.equal((await ack(owner, 'actor_spell_approve', approval())).code, 'approval_pending');
    assert.equal((await sync({ domain: 'elementalSpheres', value: spheres(['arcane', 'arcane', 'ember']) }, { domain: 'elementalSpheres', value: spheres([]) }, gm)).code, 'class_payment_owner_required');
    assert.equal((await ack(other, 'actor_spell_approve', approval())).code, 'forbidden');
    const before = JSON.stringify(room.gameState);
    for (const [label, value, code] of [
      ['NaN mana', approval({ price: { ap: 1, mana: NaN } }), 'invalid_spell_approval'],
      ['roll total', approval({ roll: { ...approved.roll, total: 99 } }), 'invalid_spell_approval'],
      ['foreign map', approval({ target: { ...foeRef, mapId: 'elsewhere' } }), 'invalid_spell_approval'],
      ['retired target', approval({ target: { ...foeRef, instanceId: crypto.randomUUID() } }), 'actor_binding_conflict'],
      ['tampered after', approval({ classPayment: { ...approved.classPayment, after: spheres(['ember', 'wyrd']) } }), 'class_payment_mismatch'],
      ['unknown field', { ...approval(), extra: true }, 'invalid_consequence']]) {
      const result = await ack(owner, 'actor_spell_approve', value);
      assert.equal(result.code, code, `${label}: ${JSON.stringify(result)}`);
    }
    // GM command bound to the approval must match roll and arithmetic exactly; non-GM cannot submit it.
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { roll: { ...approved.roll, dice: [{ sides: 8, faces: [8] }], total: 12 } }))).code, 'approval_mismatch');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { hp: { current: 1, temp: 0 } }))).code, 'approval_mismatch');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { finalAmount: 3 }).then(cmd => ({ ...cmd, adjudication: { ...cmd.adjudication, adjustmentReason: '' } })))).code, 'adjustment_reason_required');
    assert.equal((await ack(owner, 'actor_consequence', await gmCommand(approved, contentHash))).code, 'authorization_required');
    assert.equal(JSON.stringify(room.gameState), before);
    // A class payment without an approval is not executable; creatures cannot carry one.
    assert.equal((await ack(gm, 'actor_consequence', await command(gm, [{ ref: pcRef, expectedRevision: revision(pcRef), classPayment: { mode: 'spell', domain: 'elementalSpheres', approvalHash: contentHash } }]))).code, 'approval_required');
    assert.equal((await ack(gm, 'actor_consequence', await command(gm, [{ ref: foeRef, expectedRevision: revision(foeRef), classPayment: { mode: 'sync', before: null, after: { domain: 'elementalSpheres', value: spheres([]) } } }]))).code, 'invalid_class_payment');
    // Legacy envelopes cannot write the server-owned home.
    assert.equal((await ack(owner, 'token_updated', { roomId: room.id, mapId: 'default', tokenId: 'pc', updates: { state: { classPayment: { version: 1 } } } })).code, 'actor_consequence_required');
  });
  it('S7 withdraw and decline are truthful and final; runtime change makes an old approval unknown', async() => {
    await sync(null, { domain: 'elementalSpheres', value: spheres(['arcane', 'arcane', 'ember']) });
    const first = approval();
    const registered = await ack(owner, 'actor_spell_approve', first);
    assert.equal((await ack(other, 'actor_spell_withdraw', { roomId: room.id, approvalId: first.approvalId })).code, 'forbidden');
    const closed = once(gm, 'actor_spell_closed');
    assert.deepEqual(await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: first.approvalId }), { success: true, code: 'withdrawn', approvalId: first.approvalId, contentHash: registered.contentHash });
    assert.equal((await closed).code, 'withdrawn');
    assert.equal((await ack(owner, 'actor_spell_approve', first)).code, 'approval_withdrawn');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(first, registered.contentHash))).code, 'approval_withdrawn');
    const second = approval();
    await ack(owner, 'actor_spell_approve', second);
    assert.equal((await ack(owner, 'actor_spell_decline', { roomId: room.id, approvalId: second.approvalId })).code, 'forbidden');
    const ownerClosed = once(owner, 'actor_spell_closed');
    assert.equal((await ack(gm, 'actor_spell_decline', { roomId: room.id, approvalId: second.approvalId })).code, 'declined');
    assert.equal((await ownerClosed).code, 'declined');
    const third = approval();
    await ack(owner, 'actor_spell_approve', third);
    assert.equal((await ack(gm, 'actor_spell_list', { roomId: room.id })).pending.length, 1);
    assert.equal((await ack(owner, 'actor_spell_list', { roomId: room.id })).pending[0].own, true);
    const before = JSON.stringify(room.gameState);
    server.rooms.set(room.id, { ...room, gameState: actors.clone(room.gameState) });
    assert.equal((await ack(owner, 'actor_spell_approve', third)).code, 'outcome_unknown');
    assert.equal(JSON.stringify(room.gameState), before);
    assert.equal(payments.publicValue('musicalNotes', { type: 'musicalNotes', notes: [2, 0, 0, 0, 5, 0, 0] }).notes, undefined);
  });
  it('R-B1 approvals cannot travel the propose/adjudicate route; only the GM direct consequence consumes them', async() => {
    await sync(null, { domain: 'elementalSpheres', value: spheres(['arcane', 'arcane', 'ember']) });
    const approved = approval();
    const { contentHash } = await ack(owner, 'actor_spell_approve', approved);
    const cmd = await gmCommand(approved, contentHash);
    const before = JSON.stringify(room.gameState);
    assert.equal((await ack(owner, 'actor_propose', cmd)).code, 'approval_requires_gm');
    const { approval: _omitted, ...withoutApproval } = cmd;
    assert.equal((await ack(owner, 'actor_propose', { ...withoutApproval, actors: [cmd.actors[0]], target: undefined, source: undefined })).code, 'approval_required', 'a class payment entry cannot be proposed either');
    assert.equal(JSON.stringify(room.gameState), before);
    // Even if a proposal carried an approval, adjudication-route staging refuses binding.
    assert.throws(() => actors.stage(room, { isGM: true }, gmUid, cmd, { kind: 'controller-proposal-gm', authorizerUid: gmUid }, 0), /approval_requires_gm/);
    const accepted = await ack(gm, 'actor_consequence', cmd);
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.equal(payments.get(room, approved.approvalId), null);
    assert.equal(accepted.receipt.authorization.authorizerUid, gmUid);
    assert.equal((await ack(owner, 'actor_spell_approve', approval({ classPayment: null }))).code, 'awaiting_gm', 'consumed approval no longer blocks new approvals');
  });
  it('R-B2 a consumed approval stays consumed after its receipt is pruned; re-checks are unknown, never re-registered', async() => {
    server.setEventLimits('actor_consequence', { maxPerMinute: 50000, maxPerSecond: 50000 });
    await sync(null, { domain: 'elementalSpheres', value: spheres(['arcane', 'arcane', 'ember']) });
    const approved = approval({ classPayment: null });
    const { contentHash } = await ack(owner, 'actor_spell_approve', approved);
    const cmd = await gmCommand(approved, contentHash, { entries: undefined });
    cmd.actors[0] = { ...cmd.actors[0] }; delete cmd.actors[0].classPayment;
    const accepted = await ack(gm, 'actor_consequence', cmd);
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    for (let index = 0; index < 260; index++) {
      if (index % 50 === 0) {await writer._flushRooms({ force: true, only: room.id });}
      const result = await ack(gm, 'actor_consequence', await command(gm, [{ ref: foeRef, expectedRevision: revision(foeRef), finalResources: { hp: { current: 100 + (index % 2), temp: 0 } } }]));
      assert.equal(result.success, true, JSON.stringify(result));
    }
    assert.ok(actors.ledger(room).replayFloor >= accepted.receipt.commitSequence, 'the consumed receipt was pruned');
    assert.equal(payments.consumedReceipt(room, approved.approvalId), null);
    const before = JSON.stringify(room.gameState);
    assert.equal((await ack(owner, 'actor_spell_approve', approved)).code, 'retry_window_expired');
    assert.equal((await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: approved.approvalId })).code, 'approval_consumed');
    assert.equal((await ack(gm, 'actor_consequence', cmd)).code, 'retry_window_expired', 'a pruned GM command re-check is unknown, not refused-as-unapplied');
    // A different approval prepared before the floor cannot register either.
    assert.equal((await ack(owner, 'actor_spell_approve', approval({ classPayment: null, baseCommitSequence: 0 }))).code, 'retry_window_expired');
    assert.equal(JSON.stringify(room.gameState), before);
  });
  it('R-N1/N2 closed approvals are never forgotten within a runtime; the legacy mirror is not reverted by unrelated commands', async() => {
    const fake = { gameState: {} };
    for (let index = 0; index < 300; index++) {payments.close(fake, `id-${index}`, 'withdrawn');}
    assert.equal(payments.closedCode(fake, 'id-0'), 'withdrawn');
    await sync(null, { domain: 'elementalSpheres', value: spheres(['arcane']) });
    const playerId = server.players.get(owner.id).id;
    const relayed = once(owner, 'character_resource_updated');
    owner.emit('character_resource_updated', { roomId: room.id, resource: 'classResource', classResource: spheres(['storm', 'storm']), playerId });
    await relayed;
    assert.deepEqual(server.players.get(owner.id).character.classResource.spheres, ['storm', 'storm']);
    assert.equal((await ack(gm, 'actor_consequence', await command(gm, [{ ref: pcRef, expectedRevision: revision(pcRef), finalResources: { hp: { current: 19, temp: 0 } } }]))).success, true);
    assert.deepEqual(server.players.get(owner.id).character.classResource.spheres, ['storm', 'storm']);
  });
  it('S6 untrusted import and rebinding never adopt a class home', () => {
    const imported = { maps: { default: { characterTokens: { pc: { state: { classPayment: { version: 1, domain: 'elementalSpheres', value: spheres(['arcane']) } } } } } } };
    actors.preserveImportedActorMetadata(imported);
    assert.equal(imported.maps.default.characterTokens.pc.state.classPayment, undefined);
    assert.deepEqual(imported.maps.default.characterTokens.pc.state.actorRecovery.importedClassPayment.value, spheres(['arcane']));
    assert.throws(() => payments.validateValue('elementalSpheres', spheres(['fire'])), /invalid_class_payment/);
    assert.throws(() => payments.validateValue('devotionGauge', { type: 'devotionGauge', current: 5, max: 6, damage: 62, earnedLevels: 4, spentLevels: 0, bonusLevels: 0 }), /invalid_class_payment/);
    assert.throws(() => payments.conserve('musicalNotes', { type: 'musicalNotes', notes: [0, 0, 0, 0, 0, 0, 0] }, { type: 'musicalNotes', notes: [3, 0, 0, 0, 0, 0, 0] }, { costs: [], gains: ['I', 'I', 'V'] }), /class_payment_mismatch/);
    assert.equal(payments.conserve('musicalNotes', { type: 'musicalNotes', notes: [0, 0, 0, 0, 5, 0, 0] }, { type: 'musicalNotes', notes: [2, 0, 0, 0, 5, 0, 0] }, { costs: [], gains: ['I', 'I', 'V'] }), true);
  });
});
