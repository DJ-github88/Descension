/** Test-only harness for the first-playable passive readiness packet (2026-11-13).
 *
 * NOT production code. It composes the accepted production stack fixture
 * (`server/tests/helpers/productionStackServer.js`) and real handlers/services.
 * It provides:
 *   - one exact primary PC, one second primary PC (`ally`) and one creature;
 *   - a real combat start with client-supplied initiative, plus the real
 *     authenticated turn-boundary adoption;
 *   - record storage on a character (proves storage is not activation);
 *   - proposed passive events (`actor_passive_activate` / `_revoke` / `_list`)
 *     used only by PENDING acceptance rows. Those events do not exist in the
 *     live tree; the control rows prove that and skip nothing.
 *
 * No fake passive executor, no plan clone, no second engine.
 */
const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./productionStackServer');
const { FirebaseBatchWriter } = require('../../services/syncService');
const actors = require('../../services/actorConsequences');
const installed = require('../../services/installedAuthoredAbilities');
const pure = require('../../../vtt-react/src/services/authoredAbility');

const uuid = () => crypto.randomUUID();
const ack = (socket, event, data) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error(event)), 5000);
  socket.emit(event, data, result => { clearTimeout(timer); resolve(result); });
});
const once = (socket, event) => new Promise(resolve => socket.once(event, resolve));

function damageRecord(name = 'Readiness Control Lance') {
  const definition = {
    name,
    description: 'Disposable action-control fixture. It is not a passive.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
    effectTypes: ['damage'],
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
    resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 2 } },
    damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '1d6+2', resolution: 'DICE' }
  };
  return { ...actors.clone(definition), authoredDefinitionId: uuid(), authoredDraft: actors.clone(definition) };
}

async function createPassiveHarness() {
  const writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
  const server = createProductionStackServer({ firebaseBatchWriter: writer });
  await server.start();
  const authoritativeEvents = ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_propose',
    'actor_authored_admit', 'actor_authored_revoke', 'actor_trigger_list', 'actor_trigger_register', 'actor_trigger_revoke', 'actor_trigger_dismiss',
    'actor_passive_list', 'actor_passive_activate', 'actor_passive_revoke',
    'actor_turn_boundary', 'combat_started', 'combat_ended'];
  for (const event of authoritativeEvents) { server.setEventLimits(event, { maxPerMinute: 4000, maxPerSecond: 4000 }); }

  const gmUid = server.nextUserId(), uid = server.nextUserId(), observerUid = server.nextUserId();
  server.registerAuthToken('gm', gmUid);
  server.registerAuthToken('owner', uid);
  server.registerAuthToken('observer', observerUid);
  const gm = server.connect({ token: 'gm' });
  await once(gm, 'connect');
  const room = await server.seedRoom(gm.id, { gmUserId: gmUid });
  const sockets = {};
  for (const role of ['owner', 'observer']) {
    const socket = server.connect({ token: role });
    await once(socket, 'connect');
    const joined = once(socket, 'room_joined');
    socket.emit('join_room', { roomId: room.id, playerName: role, password: '' });
    await joined;
    sockets[role] = socket;
  }
  const owner = sockets.owner, observer = sockets.observer;
  server.setCharacterOwner('c', uid);
  server.setCharacterOwner('ally', uid);

  const map = room.gameState.maps.default;
  map.tokens.foe = { id: 'foe', name: 'foe', stats: { maxHp: 30, maxMana: 0, maxAP: 4 }, state: { currentHp: 20, currentMana: 0, currentActionPoints: 4, tempHealth: 0, conditions: [] } };
  map.characterTokens.pc = {
    id: 'pc', ownerUserId: uid,
    character: {
      id: 'c', class: 'Arcanoneer', name: 'Readiness PC',
      stats: { agility: 10, initiativeMod: 0 },
      skillRanks: { perception: 'NOVICE' },
      health: { current: 20, max: 30 }, mana: { current: 30, max: 30 }, actionPoints: { current: 20, max: 20 },
      tempMana: 0, tempActionPoints: 0
    },
    state: { conditions: [] }
  };
  map.characterTokens.ally = {
    id: 'ally', ownerUserId: uid,
    character: {
      id: 'ally', class: 'Arcanoneer', name: 'Readiness Ally',
      stats: { agility: 10, initiativeMod: 0 },
      skillRanks: { perception: 'NOVICE' },
      health: { current: 20, max: 30 }, mana: { current: 30, max: 30 }, actionPoints: { current: 20, max: 20 },
      tempMana: 0, tempActionPoints: 0
    },
    state: { conditions: [] }
  };

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const stored = () => live().gameState.triggerLedger;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence });

  async function admit(definition, version = 1) {
    const result = await ack(gm, 'actor_authored_admit', {
      roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision,
      record: definition, definitionVersion: version, classId: 'arcanoneer'
    });
    assert.equal(result.success, true, JSON.stringify(result));
    return { r: definition, ref: result.definitionRef };
  }

  /** Simulate the only thing storage can do: put the real record on the sheet. */
  function storeRecord(record, ref = null) {
    const target = ref || h.pc;
    const character = token(target).character;
    if (!Array.isArray(character.spells)) character.spells = [];
    character.spells.push(actors.clone(record));
    return character.spells;
  }

  const combat = () => live().gameState.combat;
  const entry = ref => (combat()?.turnOrder || []).find(item => actors.hash(item.actorRef) === actors.hash(ref)) || null;

  async function endCombat() {
    const result = await ack(gm, 'combat_ended', { roomId: room.id });
    assert.equal(result.success, true, JSON.stringify(result));
    return result;
  }

  async function startCombat(initiatives = {}) {
    const pcRoll = initiatives.pc === undefined ? 10 : initiatives.pc;
    const foeRoll = initiatives.foe === undefined ? 8 : initiatives.foe;
    const order = [
      { tokenId: h.pc.tokenId, actorRef: h.pc, name: 'Readiness PC', d20Roll: pcRoll, initiative: pcRoll },
      { tokenId: h.foe.tokenId, actorRef: h.foe, name: 'foe', d20Roll: foeRoll, initiative: foeRoll }
    ];
    const result = await ack(gm, 'combat_started', { roomId: room.id, currentTurnIndex: 0, round: 1, turnOrder: order });
    assert.equal(result.success, true, JSON.stringify(result));
    assert.equal((await ack(gm, 'actor_turn_boundary', {
      ...base(), mode: 'adopt', combatHash: actors.hash(combat()), expectedClock: null
    })).success, true);
    return entry(h.pc);
  }

  function rebuild() {
    const codec = require('../../services/roomCheckpoint');
    const built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({
      checkpoint: built.manifest,
      globalDoc: built.global.data,
      mapDocsById: Object.fromEntries(built.maps.map(item => [item.mapId, item.data]))
    });
    assert.equal(decoded.ok, true, JSON.stringify(decoded));
    server.rooms.set(room.id, {
      ...live(),
      gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) },
      checkpointRevision: 1
    });
  }

  async function refused(socket, event, data, code) {
    const before = actors.clone(live().gameState);
    const result = await ack(socket, event, data);
    assert.equal(result.success, false, JSON.stringify(result));
    if (code) { assert.equal(result.code, code, JSON.stringify(result)); }
    assert.deepEqual(live().gameState, before);
    return result;
  }

  // Proposed passive route. These helpers are used only by PENDING rows; the
  // control suite proves the live handlers do not implement them.
  const activationPayload = (ref, overrides = {}) => ({
    version: 1, roomId: room.id, requestId: uuid(), expectedRevision: live().gameState.passiveLedger?.revision || 0,
    target: ref, passiveId: 'heightened-senses', sourceRecordId: 'skill_perception_heightened_senses',
    ...overrides
  });
  const activate = (ref = h.pc, overrides = {}) => ack(gm, 'actor_passive_activate', activationPayload(ref, overrides));
  const revokePayload = (activationId, overrides = {}) => ({
    version: 1, roomId: room.id, requestId: uuid(), expectedRevision: live().gameState.passiveLedger?.revision || 0,
    activationId, ...overrides
  });
  const revoke = (activationId, overrides = {}) => ack(gm, 'actor_passive_revoke', revokePayload(activationId, overrides));
  const list = (socket = gm) => ack(socket, 'actor_passive_list', { roomId: room.id });

  const h = {
    server, writer, room, gm, owner, observer, uid, observerUid, gmUid,
    live, token, stored, base, admit, storeRecord, combat, entry, endCombat, startCombat, rebuild, refused,
    activationPayload, activate, revokePayload, revoke, list,
    actors, installed, pure, ack, once, uuid, damageRecord
  };

  h.pc = (await ack(gm, 'actor_bind', {
    roomId: room.id,
    ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: uid, characterId: 'c' },
    snapshotHash: actors.hash(map.characterTokens.pc)
  })).ref;
  h.foe = (await ack(gm, 'actor_bind', {
    roomId: room.id,
    ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' },
    snapshotHash: actors.hash(map.tokens.foe)
  })).ref;
  const liveAlly = () => live().gameState.maps.default.characterTokens.ally;
  if (!liveAlly()) { live().gameState.maps.default.characterTokens.ally = actors.clone(map.characterTokens.ally); }
  h.ally = (await ack(gm, 'actor_bind', {
    roomId: room.id,
    ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'ally', ownerUid: uid, characterId: 'ally' },
    snapshotHash: actors.hash(liveAlly())
  })).ref;
  assert.ok(h.pc && h.foe && h.ally);
  h.stop = async() => { gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); };
  return h;
}

module.exports = { createPassiveHarness, damageRecord, ack, once, uuid };
