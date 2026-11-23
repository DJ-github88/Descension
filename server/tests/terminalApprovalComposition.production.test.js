/** Composition regression (2026-11-15): the real actor-consequence registration must serve passive commands,
 * relationship queries and terminal spell-approval reconciliation together on ONE production-stack server.
 * Catches the passive-install regression that dropped `approvalId` from `actor_spell_list` (live 5bbe3493...).
 * No mocked or replacement handlers: everything goes through createProductionStackServer's registered handlers. */
const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const relationships = require('../services/actorRelationships');
const combatRoster = require('../services/combatRoster');
const combatClockApprovals = require('../services/combatClockApprovals');

const uuid = () => crypto.randomUUID();
const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 5000);
  client.emit(event, payload, result => { clearTimeout(timer); resolve(result); });
});
const once = (client, event) => new Promise(resolve => client.once(event, resolve));
const DEF_HASH = 'p9-spell:v1/599898d64f316c34af68f1e94fa0aa4aa5c8c6f30ad1483eaf16eda444f243ca';
const SPHERES = () => ({ type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'] });

describe('Composition: passive + relationship + terminal approval reconciliation on the real registration', function() {
  this.timeout(30000);
  let server, gm, owner, other, room, epoch, refs, clients;
  const live = () => server.rooms.get(room.id);

  function pcToken(id, characterId, uid, name) {
    return {
      id, ownerUserId: uid,
      character: { id: characterId, name, class: 'Arcanoneer', stats: { agility: 10, initiativeMod: 0 }, skillRanks: { perception: 'NOVICE' },
        health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0,
        classResource: SPHERES() },
      state: { conditions: [], classPayment: { version: 1, domain: 'elementalSpheres', value: SPHERES() } }
    };
  }
  const foeToken = (id, extra = {}) => ({ id, creatureId: 'grimmstalk', stats: { maxHp: 250, maxMana: 30, maxAP: 5 },
    state: { currentHp: 30, tempHealth: 4, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0, conditions: [], ...extra } });

  async function syncSpheres(client, ref) {
    const synced = await ack(client, 'actor_consequence', { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: epoch,
      baseCommitSequence: actors.ledger(live()).commitSequence,
      actors: [{ ref, expectedRevision: 0, classPayment: { mode: 'sync', before: null, after: { domain: 'elementalSpheres', value: SPHERES() } } }] });
    assert.equal(synced.success, true, JSON.stringify(synced));
  }
  const approval = (source, target) => ({ version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: epoch, baseCommitSequence: actors.ledger(live()).commitSequence,
    source, target, spell: { definitionId: 'arc_spark_bolt', definitionHash: DEF_HASH, name: 'Marrow-Piercing Slug', kind: 'damage', damageTypes: ['arcane'] },
    price: { ap: 1, mana: 4 },
    classPayment: { domain: 'elementalSpheres', before: SPHERES(), after: { type: 'elementalSpheres', spheres: ['ember'] }, price: { costs: ['arcane', 'arcane'], gains: [] } },
    roll: { mode: 'physical', dice: [{ sides: 8, faces: [6] }], constant: 4, total: 10, reading: '1d8 + intelligence/4 → 1d8 + 4 (INT 16 ÷ 4, rounded down)' } });

  beforeEach(async() => {
    const writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    clients = [];
    for (const event of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_list', 'actor_relationship_list', 'actor_relationship_set',
      'actor_passive_list', 'actor_passive_activate', 'actor_passive_revoke']) {
      server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
    }
    const gmUid = server.nextUserId(), ownerUid = server.nextUserId(), otherUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('other', otherUid);
    gm = server.connect({ token: 'gm' }); clients.push(gm); await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid, persistentRoomId: uuid() });
    for (const token of ['owner', 'other']) {
      const client = server.connect({ token }); clients.push(client); await once(client, 'connect');
      const joined = once(client, 'room_joined');
      client.emit('join_room', { roomId: room.id, playerName: token, password: '' });
      await joined;
      if (token === 'owner') {owner = client;} else {other = client;}
    }
    server.setCharacterOwner('ilse', ownerUid);
    server.setCharacterOwner('oskar', otherUid);
    const map = room.gameState.maps.default;
    map.characterTokens.pc = pcToken('pc', 'ilse', ownerUid, 'Ilse');
    map.characterTokens.pc2 = pcToken('pc2', 'oskar', otherUid, 'Oskar');
    map.tokens.foe = foeToken('foe');
    map.tokens.foe2 = foeToken('foe2');
    map.tokens.hidden = foeToken('hidden', { isHidden: true, hiddenFromPlayers: true });
    const bind = async(ref, snap) => (await ack(gm, 'actor_bind', { roomId: room.id, ref: { roomId: room.id, mapId: 'default', ...ref }, snapshotHash: actors.hash(snap) })).ref;
    refs = {
      pc: await bind({ kind: 'character', tokenId: 'pc', ownerUid, characterId: 'ilse' }, map.characterTokens.pc),
      pc2: await bind({ kind: 'character', tokenId: 'pc2', ownerUid: otherUid, characterId: 'oskar' }, map.characterTokens.pc2),
      foe: await bind({ kind: 'creature', tokenId: 'foe' }, map.tokens.foe),
      foe2: await bind({ kind: 'creature', tokenId: 'foe2' }, map.tokens.foe2),
      hidden: await bind({ kind: 'creature', tokenId: 'hidden' }, map.tokens.hidden)
    };
    assert.ok(Object.values(refs).every(Boolean), 'all actors bind');
    epoch = (await ack(owner, 'actor_snapshot', { roomId: room.id })).actionEpoch;
    await syncSpheres(owner, refs.pc);
    await syncSpheres(other, refs.pc2);
  });

  afterEach(async() => {
    for (const c of clients) {c.disconnect();}
    await server.stop();
  });

  async function passivesAndRelationshipsStillServe(label) {
    const listed = await ack(owner, 'actor_passive_list', { roomId: room.id });
    assert.equal(listed.success, true, `${label}: actor_passive_list ${JSON.stringify(listed)}`);
    const rel = await ack(owner, 'actor_relationship_list', { roomId: room.id, a: refs.pc, b: refs.foe2 });
    assert.equal(rel.success, true, `${label}: actor_relationship_list ${JSON.stringify(rel)}`);
    assert.deepEqual(Object.keys(rel).sort(), ['revision', 'roomId', 'success', 'value']);
    const hidden = await ack(owner, 'actor_relationship_list', { roomId: room.id, a: refs.pc, b: refs.hidden });
    assert.equal(hidden.code, 'actor_not_found', `${label}: hidden target stays undiscoverable`);
    const forbidden = await ack(other, 'actor_relationship_list', { roomId: room.id, a: refs.pc, b: refs.foe2 });
    assert.equal(forbidden.code, 'forbidden', `${label}: foreign source stays forbidden`);
  }

  it('serves passive activation, relationship queries and retained-approval refresh / exact closures together', async() => {
    // Passive: real GM activation on the same registration.
    const activated = await ack(gm, 'actor_passive_activate', { version: 1, roomId: room.id, requestId: uuid(), expectedRevision: live().gameState.passiveLedger?.revision || 0,
      target: refs.pc, passiveId: 'heightened-senses', sourceRecordId: 'skill_perception_heightened_senses' });
    assert.equal(activated.success, true, JSON.stringify(activated));
    assert.equal(activated.status, 'active');
    // Relationship: GM set + scoped owner query.
    const set = await ack(gm, 'actor_relationship_set', { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence, expectedRelationshipRevision: relationships.revision(live()), pairs: [{ a: refs.pc, b: refs.foe2 }], value: 'enemy' });
    assert.equal(set.success, true, JSON.stringify(set));
    await passivesAndRelationshipsStillServe('before approvals');

    // Two pending approvals: owner -> foe, other -> foe2 (unrelated).
    const mine = approval(refs.pc, refs.foe), theirs = approval(refs.pc2, refs.foe2);
    const regMine = await ack(owner, 'actor_spell_approve', mine);
    assert.equal(regMine.code, 'awaiting_gm', JSON.stringify(regMine));
    const regTheirs = await ack(other, 'actor_spell_approve', theirs);
    assert.equal(regTheirs.code, 'awaiting_gm', JSON.stringify(regTheirs));

    // THE REGRESSION: retained non-terminal approval refresh sends { roomId, approvalId }.
    const refresh = await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: mine.approvalId });
    assert.equal(refresh.success, true, `retained-approval refresh must not be refused: ${JSON.stringify(refresh)}`);
    assert.equal(refresh.pending.length, 1);
    assert.equal(refresh.pending[0].approval.approvalId, mine.approvalId);
    assert.equal(refresh.closedApproval, undefined);
    const malformed = await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: 'x'.repeat(129) });
    assert.equal(malformed.code, 'invalid_spell_approval');

    // actor_removed closes the exact approval that references the removed actor; unrelated survives.
    const closed = combatRoster.closeApprovalsForRef(live(), refs.foe, 'actor_removed');
    assert.deepEqual(closed.map(c => c.approvalId), [mine.approvalId]);
    const ownerAfter = await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: mine.approvalId });
    assert.deepEqual(ownerAfter.pending, []);
    assert.deepEqual(ownerAfter.closedApproval, { roomId: room.id, approvalId: mine.approvalId, contentHash: regMine.contentHash, code: 'actor_removed' });
    const gmAfter = await ack(gm, 'actor_spell_list', { roomId: room.id, approvalId: mine.approvalId });
    assert.deepEqual(gmAfter.closedApproval, ownerAfter.closedApproval);
    assert.ok(gmAfter.pending.some(e => e.approval.approvalId === theirs.approvalId), 'unrelated pending approval survives for the GM');
    const theirsAfter = await ack(other, 'actor_spell_list', { roomId: room.id, approvalId: theirs.approvalId });
    assert.equal(theirsAfter.pending.length, 1);
    assert.equal(theirsAfter.pending[0].approval.approvalId, theirs.approvalId);
    assert.equal(theirsAfter.closedApproval, undefined);
    // Privacy: the other player cannot probe the owner's closure; unknown ids are not fabricated.
    const probe = await ack(other, 'actor_spell_list', { roomId: room.id, approvalId: mine.approvalId });
    assert.equal(probe.closedApproval, undefined); assert.equal(probe.consumedReceipt, undefined);
    const unknown = await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: uuid() });
    assert.equal(unknown.closedApproval, undefined); assert.equal(unknown.consumedReceipt, undefined);

    // combat_clock_changed closes the remaining one with its exact code.
    combatClockApprovals.closePending(live(), 'combat_clock_changed');
    const theirsClosed = await ack(other, 'actor_spell_list', { roomId: room.id, approvalId: theirs.approvalId });
    assert.deepEqual(theirsClosed.closedApproval, { roomId: room.id, approvalId: theirs.approvalId, contentHash: regTheirs.contentHash, code: 'combat_clock_changed' });
    // The earlier closure keeps its own code (not overwritten).
    assert.equal((await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: mine.approvalId })).closedApproval.code, 'actor_removed');

    await passivesAndRelationshipsStillServe('after closures');
    const revoked = await ack(gm, 'actor_passive_revoke', { version: 1, roomId: room.id, requestId: uuid(), expectedRevision: live().gameState.passiveLedger?.revision || 0,
      activationId: activated.activation.activationId });
    assert.equal(revoked.success, true, JSON.stringify(revoked));
  });
});
