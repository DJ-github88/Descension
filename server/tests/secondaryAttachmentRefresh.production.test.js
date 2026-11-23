'use strict';

const assert = require('node:assert/strict');
const { createPassiveHarness } = require('./helpers/passiveReadinessHarness');
const passives = require('../services/passiveActivation');

describe('Secondary attachment refresh & actor authority (production stack)', function() {
  let h;

  beforeEach(async() => {
    h = await createPassiveHarness();
    h.server.setEventLimits('character_token_updated', { maxPerMinute: 20000, maxPerSecond: 20000 });
    h.server.setEventLimits('token_updated', { maxPerMinute: 20000, maxPerSecond: 20000 });
  });

  const charToken = (tokenId = h.pc.tokenId) => h.live().gameState.maps.default.characterTokens[tokenId];

  afterEach(async() => {
    if (h) { await h.stop(); }
  });

  function placeSecondToken(id = 'pc2') {
    const map = h.live().gameState.maps.default;
    const base = h.token(h.pc);
    map.characterTokens[id] = {
      id,
      mapId: 'default',
      ownerUserId: h.uid,
      position: { x: 250, y: 100 },
      character: JSON.parse(JSON.stringify(base.character)),
      state: { conditions: [] }
    };
    return map.characterTokens[id];
  }

  async function replacePrimaryWith(id = 'pc2') {
    const tok = placeSecondToken(id);
    const rebind = await h.ack(h.gm, 'actor_bind', {
      roomId: h.room.id,
      ref: { kind: 'character', roomId: h.room.id, mapId: 'default', tokenId: id, ownerUid: h.uid, characterId: h.pc.characterId },
      snapshotHash: h.actors.hash(tok),
      replacePrimaryRef: h.pc
    });
    assert.equal(rebind.success, true, JSON.stringify(rebind));
    return rebind.ref;
  }

  it('allows cosmetic name/portrait refresh on demoted token after replacement and skill change without reactivating passive or rewriting initiative', async() => {
    const activated = await h.activate(h.pc);
    assert.equal(activated.success, true);
    const entry1 = await h.startCombat({ pc: 13 });
    assert.equal(entry1.initiative, 15);
    assert.equal(entry1.passiveApplied, true);

    const pc2Ref = await replacePrimaryWith('pc2');
    assert.equal(charToken(h.pc.tokenId).state.actorContract.primary, false);
    assert.equal(charToken(pc2Ref.tokenId).state.actorContract.primary, true);
    assert.equal(passives.activeInitiativeBonus(h.live(), h.pc), 0);

    // Owner changes skillRanks on primary pc2 via character_updated
    h.owner.emit('character_updated', {
      roomId: h.room.id,
      characterId: h.pc.characterId,
      character: { id: h.pc.characterId, skillRanks: { perception: 'UNTRAINED' } }
    });
    await new Promise(resolve => setTimeout(resolve, 60));
    assert.equal(charToken(pc2Ref.tokenId).character.skillRanks.perception, 'UNTRAINED');
    assert.equal(charToken(h.pc.tokenId).character.skillRanks.perception, 'NOVICE');

    const demotedRevBefore = charToken(h.pc.tokenId).state.actorContract.revision;

    // Cosmetic-only refresh on demoted token (character_token_updated) succeeds
    const demotedRefresh = await h.ack(h.owner, 'character_token_updated', {
      roomId: h.room.id,
      mapId: 'default',
      tokenId: h.pc.tokenId,
      name: 'Lyra Renamed',
      character: {
        id: h.pc.characterId,
        name: 'Lyra Renamed',
        tokenSettings: { customIcon: '/assets/lyra-new.png', borderColor: '#112233' }
      }
    });
    assert.equal(demotedRefresh.success, true, JSON.stringify(demotedRefresh));
    assert.equal(charToken(h.pc.tokenId).name, 'Lyra Renamed');
    assert.equal(charToken(h.pc.tokenId).character.name, 'Lyra Renamed');
    assert.equal(charToken(h.pc.tokenId).character.tokenSettings.customIcon, '/assets/lyra-new.png');
    assert.equal(charToken(h.pc.tokenId).character.tokenSettings.borderColor, '#112233');
    assert.equal(charToken(h.pc.tokenId).character.skillRanks.perception, 'NOVICE');
    assert.equal(charToken(h.pc.tokenId).state.actorContract.revision, demotedRevBefore);

    // Cosmetic-only refresh on demoted token via token_updated also succeeds
    const demotedTokenUpdate = await h.ack(h.owner, 'token_updated', {
      roomId: h.room.id,
      mapId: 'default',
      tokenId: h.pc.tokenId,
      updates: {
        character: {
          tokenSettings: { borderColor: '#445566' }
        }
      }
    });
    assert.equal(demotedTokenUpdate.success, true, JSON.stringify(demotedTokenUpdate));
    assert.equal(charToken(h.pc.tokenId).character.tokenSettings.borderColor, '#445566');

    // Primary pc2 also refreshes name/portrait cleanly
    const primaryRefresh = await h.ack(h.owner, 'character_token_updated', {
      roomId: h.room.id,
      mapId: 'default',
      tokenId: 'pc2',
      name: 'Lyra Renamed',
      character: {
        id: h.pc.characterId,
        name: 'Lyra Renamed',
        skillRanks: { perception: 'UNTRAINED' },
        health: { max: 40 },
        mana: { max: 60 },
        actionPoints: { max: 40 },
        tokenSettings: { customIcon: '/assets/lyra-new.png' }
      }
    });
    assert.equal(primaryRefresh.success, true, JSON.stringify(primaryRefresh));
    assert.equal(charToken(pc2Ref.tokenId).character.name, 'Lyra Renamed');

    // Passive remains stale and completed initiative is never rewritten
    const listAfter = await h.ack(h.gm, 'actor_passive_list', { roomId: h.room.id });
    assert.equal(listAfter.activations[0].state, 'stale');
    assert.equal(h.entry(h.pc).initiative, 15);
    assert.equal(h.entry(h.pc).initiativeMod, 2);
  });

  it('treats raw and projected equivalent skillRanks identically without bumping revision or refusing demoted cosmetic refresh', async() => {
    const activated = await h.activate(h.pc);
    assert.equal(activated.success, true);
    const revBefore = h.token(h.pc).state.actorContract.revision;

    // Prepare a pending command at revBefore
    const snap = await h.ack(h.gm, 'actor_snapshot', { roomId: h.room.id });
    assert.equal(snap.success, true);
    const pendingCmd = {
      version: 1,
      roomId: h.room.id,
      commandId: '11111111-1111-4111-8111-111111111111',
      actionEpoch: snap.actionEpoch,
      baseCommitSequence: snap.commitSequence,
      actors: [{ ref: h.pc, expectedRevision: revBefore, finalResources: { hp: { current: 25, temp: 0 } } }]
    };

    // Equivalent spellings on primary: lowercase & object { rank }
    const eq1 = await h.ack(h.owner, 'character_token_updated', {
      roomId: h.room.id,
      mapId: 'default',
      tokenId: h.pc.tokenId,
      name: 'Lyra Eq1',
      character: { id: h.pc.characterId, name: 'Lyra Eq1', skillRanks: { perception: 'novice' } }
    });
    assert.equal(eq1.success, true, JSON.stringify(eq1));
    assert.equal(h.token(h.pc).state.actorContract.revision, revBefore);

    const eq2 = await h.ack(h.owner, 'character_token_updated', {
      roomId: h.room.id,
      mapId: 'default',
      tokenId: h.pc.tokenId,
      character: { id: h.pc.characterId, skillRanks: { perception: { rank: 'NOVICE' } } }
    });
    assert.equal(eq2.success, true, JSON.stringify(eq2));
    assert.equal(h.token(h.pc).state.actorContract.revision, revBefore);

    // Active passive is still active and pending command at revBefore still succeeds
    assert.equal(passives.activeInitiativeBonus(h.live(), h.pc), 2);
    const cmdResult = await h.ack(h.gm, 'actor_consequence', pendingCmd);
    assert.equal(cmdResult.success, true, JSON.stringify(cmdResult));

    // Demoted token with equivalent skillRanks alongside cosmetic refresh is also allowed
    await replacePrimaryWith('pc2');
    const demotedEq = await h.ack(h.owner, 'character_token_updated', {
      roomId: h.room.id,
      mapId: 'default',
      tokenId: h.pc.tokenId,
      name: 'Lyra Demoted Eq',
      character: { id: h.pc.characterId, name: 'Lyra Demoted Eq', skillRanks: { perception: { rank: 'novice' } } }
    });
    assert.equal(demotedEq.success, true, JSON.stringify(demotedEq));
    assert.equal(charToken(h.pc.tokenId).name, 'Lyra Demoted Eq');
    assert.equal(charToken(h.pc.tokenId).character.skillRanks.perception, 'NOVICE');
  });

  it('rejects real rank changes, forged bounds, forged resources, and forged mechanical fields on demoted tokens', async() => {
    await replacePrimaryWith('pc2');
    const snapshotBefore = JSON.stringify(h.live().gameState);

    const forgedCases = [
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, skillRanks: { perception: 'MASTER' } } }, 'secondary_attachment'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, health: { max: 999 } } }, 'secondary_attachment'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, mana: { max: 999 } } }, 'secondary_attachment'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, stats: { strength: 30 } } }, 'secondary_attachment'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, level: 20 } }, 'secondary_attachment'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, damageReduction: 50 } }, 'secondary_attachment'],
      ['token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, updates: { character: { skillRanks: { perception: 'UNTRAINED' } } } }, 'secondary_attachment'],
      ['token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, updates: { stats: { strength: 99 } } }, 'secondary_attachment'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, stateUpdates: { currentHp: 999 } }, 'actor_consequence_required'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, tempHealth: 25 } }, 'actor_consequence_required'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: 'other-character', name: 'Spoof' } }, 'actor_binding_conflict']
    ];

    for (const [event, payload, expectedCode] of forgedCases) {
      const res = await h.ack(h.owner, event, payload);
      assert.equal(res.success, false, `${event} should fail for ${expectedCode}`);
      assert.equal(res.code, expectedCode, `${event} expected ${expectedCode}, got ${JSON.stringify(res)}`);
    }
    assert.equal(JSON.stringify(h.live().gameState), snapshotBefore);
  });

  it('rejects stale pending commands after a real rank change on primary and preserves state across reconnect', async function() {
    this.timeout(10000);
    const activated = await h.activate(h.pc);
    assert.equal(activated.success, true);
    const snap = await h.ack(h.gm, 'actor_snapshot', { roomId: h.room.id });
    const oldCommand = {
      version: 1,
      roomId: h.room.id,
      commandId: '22222222-2222-4222-8222-222222222222',
      actionEpoch: snap.actionEpoch,
      baseCommitSequence: snap.commitSequence,
      actors: [{ ref: h.pc, expectedRevision: h.token(h.pc).state.actorContract.revision, finalResources: { hp: { current: 20, temp: 0 } } }]
    };

    // Real rank change on primary bumps revision
    const rankEdit = await h.ack(h.owner, 'character_token_updated', {
      roomId: h.room.id,
      mapId: 'default',
      tokenId: h.pc.tokenId,
      character: { id: h.pc.characterId, skillRanks: { perception: 'UNTRAINED' } }
    });
    assert.equal(rankEdit.success, true);
    assert.equal((await h.ack(h.gm, 'actor_consequence', oldCommand)).code, 'stale_actor_revision');

    // Replace primary, refresh demoted cosmetic, then reconnect owner
    const pc2Ref = await replacePrimaryWith('pc2');
    const cosmetic = await h.ack(h.owner, 'character_token_updated', {
      roomId: h.room.id,
      mapId: 'default',
      tokenId: h.pc.tokenId,
      name: 'Post-Replace Name',
      character: { id: h.pc.characterId, name: 'Post-Replace Name', tokenSettings: { customIcon: '/assets/post.png' } }
    });
    assert.equal(cosmetic.success, true);

    h.owner.disconnect();
    const reconnected = h.server.connect({ token: 'owner' });
    await new Promise(resolve => reconnected.once('connect', resolve));
    try {
      const joined = new Promise(resolve => reconnected.once('room_joined', resolve));
      reconnected.emit('join_room', { roomId: h.room.id, playerName: 'owner', password: '' });
      await joined;
      const postSnap = await h.ack(reconnected, 'actor_snapshot', { roomId: h.room.id });
      assert.equal(postSnap.success, true);
      const demotedToken = postSnap.maps.default.characterTokens[h.pc.tokenId];
      const primaryToken = postSnap.maps.default.characterTokens[pc2Ref.tokenId];
      assert.equal(demotedToken.name, 'Post-Replace Name');
      assert.equal(demotedToken.character.tokenSettings.customIcon, '/assets/post.png');
      assert.equal(demotedToken.state.actorContract.primary, false);
      assert.equal(primaryToken.state.actorContract.primary, true);
    } finally {
      reconnected.disconnect();
    }
  });

  it('allows primary refresh with serialized racialTraits and legitimate build changes while rejecting forged racialTraits.actionPoints and current-resource writes', async function() {
    this.timeout(10000);
    const initialSnap = await h.ack(h.gm, 'actor_snapshot', { roomId: h.room.id });
    assert.equal(initialSnap.success, true);
    const initialHp = charToken(h.pc.tokenId).character.health.current;

    // Legitimate primary-token refresh with serialized scalar racialTraits, cosmetic update, and max-pool build change
    const legit = await h.ack(h.owner, 'character_token_updated', {
      roomId: h.room.id,
      mapId: 'default',
      tokenId: h.pc.tokenId,
      name: 'Lyra Vashir',
      character: {
        id: h.pc.characterId,
        name: 'Lyra Vashir',
        level: 4,
        racialTraits: ['starlight_resonance_vashir', 'star_burst_vashir'],
        health: { max: 55 },
        mana: { max: 70 },
        actionPoints: { max: 5 },
        tokenSettings: { customIcon: '/assets/vashir.png', borderColor: '#556677' }
      }
    });
    assert.equal(legit.success, true, JSON.stringify(legit));
    const primaryAfterLegit = charToken(h.pc.tokenId);
    assert.equal(primaryAfterLegit.name, 'Lyra Vashir');
    assert.deepEqual(primaryAfterLegit.character.racialTraits, ['starlight_resonance_vashir', 'star_burst_vashir']);
    assert.equal(primaryAfterLegit.character.level, 4);
    assert.equal(primaryAfterLegit.character.health.max, 55);
    assert.equal(primaryAfterLegit.character.health.current, initialHp);
    assert.equal(primaryAfterLegit.character.actionPoints.max, 5);

    const snapshotBeforeForged = JSON.stringify(h.live().gameState);

    // Forged payloads on primary token must still fail without mutation
    const forgedPrimaryCases = [
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, racialTraits: [{ id: 'star_burst_vashir', actionPoints: 1 }] } }, 'actor_consequence_required'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, racialTraits: [{ id: 'star_burst_vashir', resourceCost: { actionPoints: 1, mana: 0 } }] } }, 'actor_consequence_required'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, actionPoints: { current: 99, max: 5 } } }, 'invalid_consequence'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, health: { current: 99, max: 55 } } }, 'invalid_consequence'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, character: { id: h.pc.characterId, tempActionPoints: 4 } }, 'actor_consequence_required'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, stateUpdates: { currentHp: 999 } }, 'actor_consequence_required'],
      ['character_token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, stateUpdates: { currentActionPoints: 99 } }, 'actor_consequence_required'],
      ['token_updated', { roomId: h.room.id, mapId: 'default', tokenId: h.pc.tokenId, updates: { character: { racialTraits: [{ id: 'star_burst_vashir', actionPoints: 1 }] } } }, 'actor_consequence_required']
    ];

    for (const [event, payload, expectedCode] of forgedPrimaryCases) {
      const res = await h.ack(h.owner, event, payload);
      assert.equal(res.success, false, `${event} should fail for ${expectedCode}`);
      assert.equal(res.code, expectedCode, `${event} expected ${expectedCode}, got ${JSON.stringify(res)}`);
    }
    assert.equal(JSON.stringify(h.live().gameState), snapshotBeforeForged);

    // Verify serialized racialTraits survive reconnect
    h.owner.disconnect();
    const reconnected = h.server.connect({ token: 'owner' });
    await new Promise(resolve => reconnected.once('connect', resolve));
    try {
      const joined = new Promise(resolve => reconnected.once('room_joined', resolve));
      reconnected.emit('join_room', { roomId: h.room.id, playerName: 'owner', password: '' });
      await joined;
      const postSnap = await h.ack(reconnected, 'actor_snapshot', { roomId: h.room.id });
      assert.equal(postSnap.success, true);
      const primaryToken = postSnap.maps.default.characterTokens[h.pc.tokenId];
      assert.deepEqual(primaryToken.character.racialTraits, ['starlight_resonance_vashir', 'star_burst_vashir']);
      assert.equal(primaryToken.character.level, 4);
    } finally {
      reconnected.disconnect();
    }
  });
});
