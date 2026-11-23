/** Bounded Minstrel gameplay loop through real registered production handlers:
 * Opening Chord (builds I×2, V×1) -> Resolving Strike (requires & consumes I×1, V×1 once) -> Reconnect preserves bank.
 * Refused casts and insufficient banks consume nothing. */
const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const p9Definitions = require('../services/p9AbilityDefinitions');

const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 5000);
  client.emit(event, payload, result => { clearTimeout(timer); resolve(result); });
});
const once = (client, event) => new Promise(resolve => client.once(event, resolve));
const sha = value => crypto.createHash('sha256').update(value).digest('hex');

const OPENING_SPEC = p9Definitions.specsForClass('minstrel').minstrel_opening_chord;
const RESOLVING_SPEC = p9Definitions.specsForClass('minstrel').minstrel_resolving_strike;

describe('Minstrel bounded gameplay loop: Opening Chord -> Resolving Strike -> Reconnect', function() {
  this.timeout(20000);
  let server, writer, gm, owner, gmUid, ownerUid, room, pcRef, foeRef, clients, epoch;

  beforeEach(async () => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async () => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    clients = [];
    for (const event of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_decline', 'actor_spell_list', 'actor_recovery']) {
      server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
    }
    gmUid = server.nextUserId();
    ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    gm = server.connect({ token: 'gm' });
    clients.push(gm);
    await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid, persistentRoomId: crypto.randomUUID() });

    owner = server.connect({ token: 'owner' });
    clients.push(owner);
    await once(owner, 'connect');
    const joined = once(owner, 'room_joined');
    owner.emit('join_room', { roomId: room.id, playerName: 'Wren', password: '' });
    await joined;

    const ownerPlayer = server.players.get(owner.id);
    ownerPlayer.character = {
      id: 'wren',
      class: 'Minstrel',
      classResource: { type: 'musicalNotes', notes: [0, 0, 0, 0, 0, 0, 0], current: 0, max: 35 }
    };
    server.setCharacterOwner('wren', ownerUid);

    const pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      character: {
        id: 'wren',
        name: 'Wren',
        class: 'Minstrel',
        health: { current: 24, max: 24 },
        mana: { current: 20, max: 20 },
        actionPoints: { current: 4, max: 4 },
        tempHealth: 0,
        tempMana: 0,
        tempActionPoints: 0,
        classResource: { type: 'musicalNotes', notes: [0, 0, 0, 0, 0, 0, 0] }
      },
      state: { conditions: [] }
    };
    const foe = {
      id: 'foe',
      creatureId: 'grimmstalk',
      stats: { maxHp: 60, maxMana: 10, maxAP: 4 },
      state: { currentHp: 60, tempHealth: 0, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0, conditions: [] }
    };
    room.gameState.maps.default.characterTokens.pc = pc;
    room.gameState.maps.default.tokens.foe = foe;

    pcRef = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'wren' },
      snapshotHash: actors.hash(pc)
    })).ref;
    foeRef = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' },
      snapshotHash: actors.hash(foe)
    })).ref;
    epoch = (await ack(owner, 'actor_snapshot', { roomId: room.id })).actionEpoch;
  });

  afterEach(async () => {
    for (const client of clients) { client.disconnect(); }
    await server.stop();
  });

  const snap = async client => ack(client, 'actor_snapshot', { roomId: room.id });
  const revision = ref => actors.locate(room, ref).contract.revision;
  const command = async (client, entries, extra = {}) => ({
    version: 1,
    roomId: room.id,
    commandId: crypto.randomUUID(),
    actionEpoch: epoch,
    baseCommitSequence: (await snap(client)).commitSequence,
    actors: entries,
    ...extra
  });
  const bank = notes => ({ type: 'musicalNotes', notes });
  const syncBank = async (before, after) => ack(owner, 'actor_consequence', await command(owner, [{
    ref: pcRef,
    expectedRevision: revision(pcRef),
    classPayment: { mode: 'sync', before, after }
  }]));

  const makeOpeningApproval = (beforeNotes, afterNotes) => ({
    version: 1,
    roomId: room.id,
    approvalId: crypto.randomUUID(),
    actionEpoch: epoch,
    baseCommitSequence: actors.ledger(room).commitSequence,
    source: pcRef,
    target: foeRef,
    spell: {
      definitionId: OPENING_SPEC.definitionId,
      definitionHash: OPENING_SPEC.definitionHash,
      name: OPENING_SPEC.name,
      kind: OPENING_SPEC.kind,
      damageTypes: OPENING_SPEC.damageTypes
    },
    roll: { mode: 'physical', dice: [{ sides: 6, faces: [4] }], constant: 0, total: 4, reading: '1d6 → 4' },
    price: { ap: OPENING_SPEC.price.ap, mana: OPENING_SPEC.price.mana },
    classPayment: {
      domain: 'musicalNotes',
      before: bank(beforeNotes),
      after: bank(afterNotes),
      price: OPENING_SPEC.classPrice
    }
  });

  const makeResolvingApproval = (beforeNotes, afterNotes) => ({
    version: 1,
    roomId: room.id,
    approvalId: crypto.randomUUID(),
    actionEpoch: epoch,
    baseCommitSequence: actors.ledger(room).commitSequence,
    source: pcRef,
    target: foeRef,
    spell: {
      definitionId: RESOLVING_SPEC.definitionId,
      definitionHash: RESOLVING_SPEC.definitionHash,
      name: RESOLVING_SPEC.name,
      kind: RESOLVING_SPEC.kind,
      damageTypes: RESOLVING_SPEC.damageTypes
    },
    roll: { mode: 'physical', dice: [{ sides: 8, faces: [5] }], constant: 13, total: 18, reading: '1d8 + spirit → 1d8 + 13 (SPI score)' },
    price: { ap: RESOLVING_SPEC.price.ap, mana: RESOLVING_SPEC.price.mana },
    classPayment: {
      domain: 'musicalNotes',
      before: bank(beforeNotes),
      after: bank(afterNotes),
      price: RESOLVING_SPEC.classPrice
    }
  });

  const acceptApproval = async (approved, contentHash, finalAmount, apAfter, manaAfter) => {
    const chosen = JSON.stringify({
      capability: 'p9-spell:v1',
      approvalId: approved.approvalId,
      roll: approved.roll,
      kind: approved.spell.kind,
      damageTypes: approved.spell.damageTypes,
      gmConfirmed: true
    });
    const cmd = await command(gm, [
      {
        ref: pcRef,
        expectedRevision: revision(pcRef),
        finalResources: { ap: { current: apAfter, temp: 0 }, mana: { current: manaAfter, temp: 0 } },
        classPayment: { mode: 'spell', domain: 'musicalNotes', approvalHash: contentHash }
      },
      {
        ref: foeRef,
        expectedRevision: revision(foeRef),
        finalResources: { hp: { current: actors.locate(room, foeRef).token.state.currentHp - finalAmount, temp: 0 } }
      }
    ], {
      source: pcRef,
      target: foeRef,
      approval: {
        approvalId: approved.approvalId,
        contentHash
      },
      adjudication: {
        definitionId: approved.spell.definitionId,
        definitionVersionOrHash: approved.spell.definitionHash,
        chosenResult: chosen,
        finalAmount,
        adjustmentReason: ''
      }
    });
    return { cmd, result: await ack(gm, 'actor_consequence', cmd) };
  };

  it('Opening Chord adds I×2/V×1 once, Resolving Strike refuses missing recipe, consumes I×1/V×1 once, and reconnect preserves bank', async () => {
    // 1. Sync empty bank [0,0,0,0,0,0,0]
    assert.equal((await syncBank(null, { domain: 'musicalNotes', value: bank([0, 0, 0, 0, 0, 0, 0]) })).success, true);

    // 2. Refused cast before Opening Chord: Resolving Strike with empty bank cannot be approved or executed
    const emptyResolve = makeResolvingApproval([0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]);
    const refusedEmpty = await ack(owner, 'actor_spell_approve', emptyResolve);
    assert.equal(refusedEmpty.success, false);
    assert.equal(refusedEmpty.code, 'insufficient_class_resource');
    assert.deepEqual(actors.locate(room, pcRef).token.state.classPayment.value.notes, [0, 0, 0, 0, 0, 0, 0]);

    // 3. Refused cast with wrong pitches [2,1,0,0,0,0,0] (2x I, 1x II, no V) cannot pass
    const wrongPitchResolve = makeResolvingApproval([2, 1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0]);
    const refusedWrong = await ack(owner, 'actor_spell_approve', wrongPitchResolve);
    assert.equal(refusedWrong.success, false);
    assert.equal(refusedWrong.code, 'insufficient_class_resource');

    // 4. Cast Opening Chord: empty -> [2, 0, 0, 0, 1, 0, 0] (adds I×2, V×1 once)
    const opening = makeOpeningApproval([0, 0, 0, 0, 0, 0, 0], [2, 0, 0, 0, 1, 0, 0]);
    const openReg = await ack(owner, 'actor_spell_approve', opening);
    assert.equal(openReg.code, 'awaiting_gm', `openReg failed: ${JSON.stringify(openReg)}`);

    const openAccepted = await acceptApproval(opening, openReg.contentHash, 4, 3, 16);
    assert.equal(openAccepted.result.success, true, `openAccepted failed: ${JSON.stringify(openAccepted.result)}`);
    assert.deepEqual(actors.locate(room, pcRef).token.state.classPayment, {
      version: 1,
      domain: 'musicalNotes',
      value: { type: 'musicalNotes', notes: [2, 0, 0, 0, 1, 0, 0] }
    });

    // Replay of Opening Chord command is idempotent and never adds notes twice
    const openReplay = await ack(gm, 'actor_consequence', openAccepted.cmd);
    assert.equal(openReplay.success, true);
    assert.deepEqual(actors.locate(room, pcRef).token.state.classPayment.value.notes, [2, 0, 0, 0, 1, 0, 0]);

    // 5. Refused cast (GM decline) consumes nothing
    const declinedResolve = makeResolvingApproval([2, 0, 0, 0, 1, 0, 0], [1, 0, 0, 0, 0, 0, 0]);
    const decReg = await ack(owner, 'actor_spell_approve', declinedResolve);
    assert.equal(decReg.code, 'awaiting_gm');
    const declined = await ack(gm, 'actor_spell_decline', { roomId: room.id, approvalId: declinedResolve.approvalId });
    assert.equal(declined.success, true);
    assert.deepEqual(actors.locate(room, pcRef).token.state.classPayment.value.notes, [2, 0, 0, 0, 1, 0, 0]);
    assert.equal(actors.locate(room, pcRef).token.character.actionPoints.current, 3);
    assert.equal(actors.locate(room, pcRef).token.character.mana.current, 16);

    // 6. Successful Resolving Strike: [2,0,0,0,1,0,0] -> [1,0,0,0,0,0,0] (consumes I×1, V×1 once)
    const resolving = makeResolvingApproval([2, 0, 0, 0, 1, 0, 0], [1, 0, 0, 0, 0, 0, 0]);
    const resReg = await ack(owner, 'actor_spell_approve', resolving);
    assert.equal(resReg.code, 'awaiting_gm');

    const resAccepted = await acceptApproval(resolving, resReg.contentHash, 18, 2, 12);
    assert.equal(resAccepted.result.success, true, `resAccepted failed: ${JSON.stringify(resAccepted.result)}`);
    assert.deepEqual(actors.locate(room, pcRef).token.state.classPayment, {
      version: 1,
      domain: 'musicalNotes',
      value: { type: 'musicalNotes', notes: [1, 0, 0, 0, 0, 0, 0] }
    });
    assert.equal(actors.locate(room, pcRef).token.character.actionPoints.current, 2);
    assert.equal(actors.locate(room, pcRef).token.character.mana.current, 12);
    assert.equal(actors.locate(room, foeRef).token.state.currentHp, 38);

    // Replay of Resolving Strike command consumes nothing extra
    const resReplay = await ack(gm, 'actor_consequence', resAccepted.cmd);
    assert.equal(resReplay.success, true);
    assert.deepEqual(actors.locate(room, pcRef).token.state.classPayment.value.notes, [1, 0, 0, 0, 0, 0, 0]);

    // 7. Reconnect preserves the exact bank [1, 0, 0, 0, 0, 0, 0]
    owner.disconnect();
    const reconnected = server.connect({ token: 'owner' });
    clients.push(reconnected);
    await once(reconnected, 'connect');
    const rejoined = once(reconnected, 'room_joined');
    reconnected.emit('join_room', { roomId: room.id, playerName: 'Wren', password: '' });
    const joinPayload = await rejoined;
    assert.ok(joinPayload?.room?.id === room.id);

    const recovered = await ack(reconnected, 'actor_recovery', { roomId: room.id, ref: pcRef });
    assert.equal(recovered.success, true);
    assert.deepEqual(recovered.recovery.rawToken.state.classPayment, {
      version: 1,
      domain: 'musicalNotes',
      value: { type: 'musicalNotes', notes: [1, 0, 0, 0, 0, 0, 0] }
    });
  });
});
