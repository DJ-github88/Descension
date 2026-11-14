const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const relationships = require('../services/actorRelationships');
const pure = require('../../vtt-react/src/services/authoredAbility');

const uuid = () => crypto.randomUUID();
const ack = (s, event, data) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(event)), 5000);
  s.emit(event, data, r => { clearTimeout(t); resolve(r); });
});
const once = eventEmitter => new Promise(resolve => eventEmitter.once('connect', resolve));

function authoredRecord(restriction = 'enemy', kind = 'damage') {
  const d = {
    name: `Bounded ${restriction}`,
    description: 'Bounded test spell.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
    effectTypes: [kind],
    targetingMode: 'unified',
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: [restriction] },
    resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 2 } },
    [kind === 'damage' ? 'damageConfig' : 'healingConfig']: kind === 'damage'
      ? { damageType: 'direct', elementType: 'arcane', formula: '1d6+2', resolution: 'DICE' }
      : { healingType: 'direct', formula: '1d8+1', resolution: 'DICE' }
  };
  return { ...actors.clone(d), authoredDefinitionId: uuid(), authoredDraft: actors.clone(d) };
}

describe('Relationship-aware target picker server security & forged request guard', function() {
  this.timeout(15000);
  let server, room, gm, owner, observer, pc, ally, neutral, hidden, ownerUid, writer;

  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of ['actor_bind', 'actor_relationship_list', 'actor_relationship_set', 'actor_spell_approve', 'actor_authored_admit']) {
      server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    }
    const gmUid = server.nextUserId();
    ownerUid = server.nextUserId();
    const observerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    server.registerAuthToken('observer', observerUid);

    gm = server.connect({ token: 'gm' });
    await once(gm);
    room = await server.seedRoom(gm.id, { gmUserId: gmUid });

    for (const role of ['owner', 'observer']) {
      const s = server.connect({ token: role });
      await once(s);
      const joined = new Promise(resolve => s.once('room_joined', resolve));
      s.emit('join_room', { roomId: room.id, playerName: role, password: '' });
      await joined;
      if (role === 'owner') owner = s;
      else observer = s;
    }

    server.setCharacterOwner('c-caster', ownerUid);
    const map = room.gameState.maps.default;
    map.characterTokens.pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      character: { id: 'c-caster', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 },
      state: { conditions: [] }
    };
    map.tokens.ally = { id: 'ally', stats: { maxHp: 30, maxMana: 0, maxAP: 4 }, state: { currentHp: 20, currentMana: 0, currentActionPoints: 4, conditions: [] } };
    map.tokens.neutral = { id: 'neutral', stats: { maxHp: 30, maxMana: 0, maxAP: 4 }, state: { currentHp: 20, currentMana: 0, currentActionPoints: 4, conditions: [] } };
    map.tokens.hidden = { id: 'hidden', stats: { maxHp: 30, maxMana: 0, maxAP: 4 }, state: { currentHp: 20, currentMana: 0, currentActionPoints: 4, isHidden: true, hiddenFromPlayers: true, conditions: [] } };

    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c-caster' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    ally = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'ally' }, snapshotHash: actors.hash(map.tokens.ally) })).ref;
    neutral = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'neutral' }, snapshotHash: actors.hash(map.tokens.neutral) })).ref;
    hidden = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'hidden' }, snapshotHash: actors.hash(map.tokens.hidden) })).ref;
    assert.ok(pc && ally && neutral && hidden, 'expected all actors to bind');

    const setRes = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      expectedRelationshipRevision: relationships.revision(room),
      pairs: [{ a: pc, b: ally }],
      value: 'ally'
    });
    assert.equal(setRes.success, true, JSON.stringify(setRes));
  });

  afterEach(async() => {
    gm.disconnect();
    owner.disconnect();
    observer.disconnect();
    await server.stop();
  });

  it('scopes actor_relationship_list to authorized source and visible target without hidden-token discovery or private fields', async() => {
    const beforeRev = relationships.revision(room);
    const res = await ack(owner, 'actor_relationship_list', { roomId: room.id, a: pc, b: ally });
    assert.equal(res.success, true);
    assert.deepEqual(Object.keys(res).sort(), ['revision', 'roomId', 'success', 'value']);
    assert.equal(res.value, 'ally');
    assert.equal(relationships.revision(room), beforeRev);

    // Unauthorized player cannot query someone else's source
    const unauth = await ack(observer, 'actor_relationship_list', { roomId: room.id, a: pc, b: ally });
    assert.equal(unauth.success, false);
    assert.equal(unauth.code, 'forbidden');

    // Non-GM cannot probe hidden target (returns actor_not_found just like an absent ref)
    const hiddenProbe = await ack(owner, 'actor_relationship_list', { roomId: room.id, a: pc, b: hidden });
    assert.equal(hiddenProbe.success, false);
    assert.equal(hiddenProbe.code, 'actor_not_found');

    // Non-GM cannot probe isHidden-only target either
    room.gameState.maps.default.tokens.neutral.state.isHidden = true;
    const isHiddenProbe = await ack(owner, 'actor_relationship_list', { roomId: room.id, a: pc, b: neutral });
    assert.equal(isHiddenProbe.success, false);
    assert.equal(isHiddenProbe.code, 'actor_not_found');
    delete room.gameState.maps.default.tokens.neutral.state.isHidden;

    const absentProbe = await ack(owner, 'actor_relationship_list', {
      roomId: room.id,
      a: pc,
      b: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'does-not-exist', instanceId: 'nope' }
    });
    assert.equal(absentProbe.success, false);
    assert.equal(absentProbe.code, 'actor_not_found');

    // GM can still query hidden target
    const gmRes = await ack(gm, 'actor_relationship_list', { roomId: room.id, a: pc, b: hidden });
    assert.equal(gmRes.success, true);
    assert.equal(gmRes.value, 'neutral');
  });

  it('forged client actor_spell_approve still fails at the server binder on relationship mismatch', async() => {
    const rec = authoredRecord('enemy', 'damage');
    const admitRes = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(room).revision,
      record: rec,
      definitionVersion: 1,
      classId: 'arcanoneer'
    });
    assert.equal(admitRes.success, true);

    const defRef = admitRes.definitionRef;
    const actionId = pure.actionId(defRef);
    const approvalRes = await ack(owner, 'actor_spell_approve', {
      version: 1,
      roomId: room.id,
      approvalId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: pc,
      target: ally,
      spell: {
        definitionId: actionId,
        definitionHash: `${pure.CAPABILITY}/${defRef.definitionHash}`,
        name: rec.name,
        kind: 'damage',
        damageTypes: ['arcane']
      },
      price: { ap: 1, mana: 2 },
      classPayment: null,
      roll: { mode: 'physical', dice: [{ sides: 6, faces: [4] }], constant: 2, total: 6, reading: pure.readFormula('1d6+2').reading }
    });
    assert.equal(approvalRes.success, false);
    assert.equal(approvalRes.code, 'target_relationship_mismatch');
  });
});
