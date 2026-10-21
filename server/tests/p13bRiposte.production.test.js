const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const actors = require('../services/actorConsequences');
const rp = require('../services/riposteExecution');
const uuid = () => crypto.randomUUID();
const ack = (socket, event, data) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(`ACK ${event}`)), 12000); socket.emit(event, data, r => { clearTimeout(t); resolve(r); }); });
const once = (socket, event) => new Promise(resolve => socket.once(event, resolve));

describe('E1a real registered approval/P7 installation', function() {
  this.timeout(30000);
  let server, room, gm, owner, observer, source, target;
  beforeEach(async() => {
    server = createProductionStackServer({ characterOwners: { c: 'owner' } }); await server.start();
    for (const event of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_status', 'actor_strike_approve', 'actor_strike_list', 'actor_strike_withdraw',
      'reaction_window_open', 'reaction_window_list', 'reaction_window_change', 'actor_riposte_parent', 'actor_riposte_offer', 'actor_riposte_list', 'actor_riposte_cancel', 'actor_riposte_revalidate']) server.setEventLimits(event, { maxPerMinute: 2000, maxPerSecond: 2000 });
    for (const uid of ['gm', 'owner', 'observer']) server.registerAuthToken(uid, uid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: 'gm' });
    for (const uid of ['owner', 'observer']) { const s = server.connect({ token: uid }); await once(s, 'connect'); const joined = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: uid, password: '' }); await joined; if (uid === 'owner') owner = s; else observer = s; }
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', position: { x: 75, y: 25 }, stats: { maxHp: 30, maxMana: 0, maxAP: 2 }, state: { currentHp: 20, tempHealth: 3, currentMana: 0, currentActionPoints: 2, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', position: { x: 25, y: 25 }, ownerUserId: 'owner', character: { id: 'c', name: 'PC',
      health: { current: 30, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 2, max: 4 }, tempActionPoints: 1 }, state: { conditions: [] } };
    source = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: 'owner', characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    target = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
    assert.ok(source && target);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); });
  const config = async() => {
    const actionEpoch = actors.epoch(room), windowEpoch = (await ack(gm, 'reaction_window_list', { roomId: room.id })).epoch;
    const result = await ack(gm, 'actor_riposte_parent', { roomId: room.id, requestId: uuid(), actionEpoch, windowEpoch, existingWindowId: null,
      source, target, attackReference: uuid(), parryReference: uuid() });
    assert.equal(result.success, true, JSON.stringify(result)); const parent = result.parent;
    return { roomId: room.id, requestId: uuid(), actionEpoch, windowEpoch, parentId: parent.id, parentEpoch: parent.originEpoch, parentProof: parent.proof,
      windowId: null, attack: { id: parent.attackId, attacker: target, defender: source }, parry: { id: parent.parryId, success: true, paid: true, timingConfirmed: true, note: 'PARENT_PRIVATE_NOTE' }, source, target, receiptRef: null };
  };
  async function declaration(p) {
    const changed = await ack(owner, 'reaction_window_change', { roomId: room.id, requestId: uuid(), epoch: (await ack(owner, 'reaction_window_list', { roomId: room.id })).epoch,
      windowId: p.windowId, reactor: source, cardKey: 'universal_riposte', label: 'Riposte', note: '', expectedRevision: 0, withdrawn: false });
    assert.equal(changed.success, true, JSON.stringify(changed));
  }
  async function offer(existing = false) {
    const data = await config();
    if (existing) {
      const w = await ack(gm, 'reaction_window_open', { roomId: room.id, requestId: uuid(), epoch: data.windowEpoch,
        trigger: { causeId: data.parry.id, moment: 'follow_up', occurrence: '1', basis: 'gm-manual' }, source, invited: [source], gmCommit: { refs: [], note: '' } });
      assert.equal(w.success, true); data.windowId = w.windows.at(-1).windowId;
      await declaration({ windowId: data.windowId }); await new Promise(r => setTimeout(r, 8050));
    }
    const response = await ack(gm, 'actor_riposte_offer', data); assert.equal(response.success, true, JSON.stringify(response));
    const p = response.opportunity;
    if (!existing) { await declaration(p); await new Promise(r => setTimeout(r, 8050)); }
    return { data, p: (await ack(gm, 'actor_riposte_list', { roomId: room.id })).opportunities.find(x => x.id === p.id) };
  }
  function approval(p) { return { version: 1, capability: rp.CAPABILITY, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence,
    source, target, opportunityId: p.id, proof: p.proof, weapon: { slot: 'mainHand', itemId: null, name: 'Unarmed', weaponType: 'unarmed', typeSource: 'item', die: 4,
      damageType: 'smashing', attribute: 'strength', score: 10, modifier: 0 }, roll: { mode: 'physical', faces: [3] }, price: { ap: 1 } }; }
  function command(a, p, amount = 7, outcome = 'hit') {
    const pc = actors.locate(room, source), foe = actors.locate(room, target), pools = actors.resources(pc.token, 'character'), hp = actors.resources(foe.token, 'creature').hp;
    const ap = require('../services/spellPayments').tempFirst(pools.ap.current, pools.ap.temp, 1), temp = Math.min(hp.temp, amount);
    const chosen = { capability: rp.CAPABILITY, approvalId: a.approvalId, opportunityId: p.id, gmConfirmed: true, names: { source: 'PC', target: 'foe' },
      weapon: a.weapon, roll: a.roll, rollOutcome: outcome, positions: [pc.token.position, foe.token.position], parentKeys: p.parentKeys, offerHash: p.offerHash, notApplied: rp.UNAPPLIED };
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source, target,
      approval: { approvalId: a.approvalId, contentHash: actors.hash(a) }, actors: [{ ref: source, expectedRevision: pc.contract.revision, finalResources: { ap } },
        { ref: target, expectedRevision: foe.contract.revision, finalResources: { hp: { current: Math.max(0, hp.current - (amount - temp)), temp: hp.temp - temp } } }],
      adjudication: { definitionId: rp.DEFINITION_ID, definitionVersionOrHash: rp.DEFINITION_HASH, chosenResult: JSON.stringify(chosen), finalAmount: amount, adjustmentReason: rp.RULING } };
  }
  async function register(a) { const r = await ack(owner, 'actor_strike_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return r; }
  async function setAP(current, temp = 0) {
    const pc = actors.locate(room, source);
    const c = { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence,
      actors: [{ ref: source, expectedRevision: pc.contract.revision, finalResources: { ap: { current, temp } } }] };
    const result = await ack(gm, 'actor_consequence', c); assert.equal(result.success, true, JSON.stringify(result));
  }
  it('C2 Stunned refuses consent and pre-existing E1a installation without AP/HP/consumption; removal/revalidation retains original roll', async() => {
    const { p } = await offer(), a = approval(p); await register(a); const c = command(a, p);
    const profile = require('../../vtt-react/src/services/sharedConditionProfile');
    const id = uuid(), record = profile.makeStunnedRecord(source, id, { sourceOccurrence: 'bash-1', timing: 'shield-bash-target-end', sourceActor: target });
    const correct = op => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence,
      target: source, actors: [{ ref: source, expectedRevision: actors.locate(room, source).contract.revision, conditions: [{ op, recordId: id, ...(op === 'add' ? { record } : {}) }] }],
      adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, chosenResult: 'Manual correction' } });
    // Hold the real authority await of an already-consented command; apply Stunned while it yields.
    const originalAssert = server.authorityService.assertCurrent;
    let release, entered;
    const gate = new Promise(resolve => { release = resolve; }), reached = new Promise(resolve => { entered = resolve; });
    let hold = true;
    server.authorityService.assertCurrent = async(...args) => {
      if (hold) { hold = false; entered(); await gate; }
      return originalAssert(...args);
    };
    const installing = ack(gm, 'actor_consequence', c); await reached;
    assert.equal((await ack(owner, 'actor_consequence', correct('add'))).success, true);
    const before = actors.clone(room.gameState), retained = actors.clone(require('../services/strikeApprovals').get(room, a.approvalId));
    release(); assert.equal((await installing).code, 'actor_stunned'); server.authorityService.assertCurrent = originalAssert;
    assert.equal((await ack(owner, 'actor_strike_approve', { ...a, approvalId: uuid() })).code, 'actor_stunned');
    assert.equal((await ack(gm, 'actor_consequence', c)).code, 'actor_stunned');
    assert.deepEqual(room.gameState, before);
    assert.deepEqual(require('../services/strikeApprovals').get(room, a.approvalId), retained);
    assert.notEqual(rp.get(room, p.id).status, 'consumed');
    assert.equal((await ack(gm, 'actor_consequence', correct('remove'))).success, true);
    assert.equal((await ack(gm, 'actor_riposte_revalidate', { roomId: room.id, opportunityId: p.id })).success, true);
    const next = approval(p); assert.deepEqual(next.roll, a.roll); await register(next);
    const accepted = await ack(gm, 'actor_consequence', command(next, p)); assert.equal(accepted.success, true, JSON.stringify(accepted));
  });
  it('fresh-choice entry, duplicate parent guards, exact consent, atomic payment/HP and original retries', async() => {
    const { data, p } = await offer(); const a = approval(p); await register(a);
    assert.equal((await ack(observer, 'actor_strike_approve', { ...a, approvalId: uuid() })).success, false);
    const before = actors.clone(room.gameState.maps.default), c = command(a, p);
    const accepted = await ack(gm, 'actor_consequence', c); assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.equal(room.gameState.maps.default.characterTokens.pc.character.actionPoints.current, 2); assert.equal(room.gameState.maps.default.characterTokens.pc.character.tempActionPoints, 0);
    assert.equal(room.gameState.maps.default.tokens.foe.state.currentHp, 16); assert.equal(room.gameState.maps.default.tokens.foe.state.tempHealth, 0);
    assert.deepEqual(room.gameState.maps.default.tokens.foe.state.conditions, before.tokens.foe.state.conditions);
    const publicText = JSON.stringify(accepted); for (const secret of [data.attack.id, data.parry.id, data.parry.note, 'parentKeys', 'offerHash', p.proof]) assert.equal(publicText.includes(secret), false, secret);
    const duplicate = await ack(gm, 'actor_consequence', c); assert.equal(duplicate.receipt.commandId, accepted.receipt.commandId); assert.equal(actors.ledger(room).commitSequence, 1);
    const parentRetry = await ack(gm, 'actor_riposte_offer', { ...data, requestId: uuid(), windowId: p.windowId });
    assert.equal(parentRetry.receipt.commandId, c.commandId); assert.equal((await ack(gm, 'reaction_window_list', { roomId: room.id })).windows.length, 1);
    const another = await ack(gm, 'actor_consequence', { ...c, commandId: uuid(), baseCommitSequence: 1 }); assert.equal(another.success, false); assert.equal(actors.ledger(room).commitSequence, 1);
  });
  it('closed collector entry, insufficient AP, stale reapproval retains faces, paid miss and reference validation', async() => {
    const { data, p } = await offer(true), a = approval(p); await register(a);
    const c = command(a, p); await setAP(0);
    const refused = await ack(gm, 'actor_consequence', c); assert.equal(refused.success, false); assert.ok(['insufficient_resources', 'stale_actor_revision'].includes(refused.code));
    assert.equal(room.gameState.maps.default.tokens.foe.state.currentHp, 20);
    await setAP(2);
    const revalidated = await ack(gm, 'actor_riposte_revalidate', { roomId: room.id, opportunityId: p.id }); assert.equal(revalidated.success, true, JSON.stringify(revalidated));
    const changed = { ...approval(p), roll: { mode: 'digital', faces: [2] } }; assert.equal((await ack(owner, 'actor_strike_approve', changed)).code, 'riposte_recorded_roll_changed');
    const next = approval(p); await register(next); const miss = await ack(gm, 'actor_consequence', command(next, p, 0, 'miss'));
    assert.equal(miss.success, true, JSON.stringify(miss)); assert.equal(room.gameState.maps.default.characterTokens.pc.character.actionPoints.current, 1);
    assert.equal(room.gameState.maps.default.tokens.foe.state.currentHp, 20); assert.equal(room.gameState.maps.default.tokens.foe.state.tempHealth, 3);
    const badReference = { ...data, requestId: uuid(), receiptRef: uuid() }; assert.equal((await ack(gm, 'actor_riposte_offer', badReference)).code, 'invalid_parry_receipt');
  });
  it('wrong parent and cancellation are fail-closed; named E1a cannot omit owner approval', async() => {
    const { data, p } = await offer(), a = approval(p); await register(a);
    const wrong = await ack(gm, 'actor_riposte_offer', { ...data, requestId: uuid(), attack: { ...data.attack, defender: target } }); assert.equal(wrong.success, false);
    const c = command(a, p), noConsent = { ...c, commandId: uuid() }; delete noConsent.approval;
    assert.equal((await ack(gm, 'actor_consequence', noConsent)).code, 'approval_required');
    const disguised = { ...noConsent, commandId: uuid(), adjudication: { ...c.adjudication, definitionId: 'manual', definitionVersionOrHash: 'manual:v1' } };
    assert.equal((await ack(gm, 'actor_consequence', disguised)).code, 'riposte_definition_mismatch');
    const cancelled = await ack(gm, 'actor_riposte_cancel', { roomId: room.id, opportunityId: p.id }); assert.equal(cancelled.success, true);
    assert.equal((await ack(gm, 'actor_consequence', c)).success, false); assert.equal(actors.ledger(room).receipts.length, 0);
    assert.equal(room.gameState.maps.default.characterTokens.pc.character.tempActionPoints, 1);
  });
  it('restored room context keeps accepted retry/parent dedupe but does not recreate unknown opportunities', async() => {
    const { data, p } = await offer(), a = approval(p); await register(a); const c = command(a, p);
    const accepted = await ack(gm, 'actor_consequence', c); assert.equal(accepted.success, true);
    const oldEpoch = actors.epoch(room); room = { ...room, gameState: actors.clone(room.gameState) }; server.rooms.set(room.id, room);
    assert.notEqual(actors.epoch(room), oldEpoch);
    const retry = await ack(gm, 'actor_consequence', c); assert.equal(retry.receipt.commandId, c.commandId);
    assert.deepEqual((await ack(gm, 'actor_riposte_list', { roomId: room.id })).opportunities, []);
    const duplicate = await ack(gm, 'actor_riposte_offer', data); assert.equal(duplicate.receipt.commandId, c.commandId);
    const unknown = { ...data, requestId: uuid(), attack: { ...data.attack, id: uuid() }, parry: { ...data.parry, id: uuid() } };
    assert.equal((await ack(gm, 'actor_riposte_offer', unknown)).success, false); assert.equal(actors.ledger(room).commitSequence, 1);
    room.gameState.actorConsequences.receipts = []; room.gameState.actorConsequences.replayFloor = 1;
    const refreshed = { ...data, actionEpoch: actors.epoch(room), windowEpoch: (await ack(gm, 'reaction_window_list', { roomId: room.id })).epoch };
    assert.equal((await ack(gm, 'actor_riposte_offer', refreshed)).code, 'riposte_parent_unavailable');
    assert.equal((await ack(gm, 'reaction_window_list', { roomId: room.id })).windows.length, 0);
  });
});
