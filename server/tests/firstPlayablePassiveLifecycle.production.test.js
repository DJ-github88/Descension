'use strict';

const assert = require('node:assert/strict');
const { createPassiveHarness } = require('./helpers/passiveReadinessHarness');
const passives = require('../services/passiveActivation');

describe('Heightened Senses approved P1-P5 lifecycle (isolated production-stack tests)', function() {
  let h;

  beforeEach(async() => {
    h = await createPassiveHarness();
  });

  afterEach(async() => {
    if (h) { await h.stop(); }
  });

  it('stored but not activated gives +0 initiative bonus on combat_started', async() => {
    const listBefore = await h.ack(h.gm, 'actor_passive_list', { roomId: h.room.id });
    assert.equal(listBefore.success, true);
    assert.equal(listBefore.status, 'stored');
    assert.equal(listBefore.activations.length, 0);
    assert.equal(passives.activeInitiativeBonus(h.live(), h.pc), 0);

    const pcEntry = await h.startCombat({ pc: 11 });
    assert.equal(pcEntry.d20Roll, 11);
    assert.equal(pcEntry.initiativeMod, 0);
    assert.equal(pcEntry.initiative, 11);
    assert.equal(pcEntry.passiveApplied, undefined);
  });

  it('losing Perception NOVICE via character_updated invalidates activation, preserves completed initiative, and prevents bonus on future rolls', async() => {
    const activated = await h.activate(h.pc);
    assert.equal(activated.success, true);
    assert.equal(passives.activeInitiativeBonus(h.live(), h.pc), 2);

    const entry1 = await h.startCombat({ pc: 15 });
    assert.equal(entry1.initiativeMod, 2);
    assert.equal(entry1.initiative, 17);
    assert.equal(entry1.passiveApplied, true);

    // Owner lowers Perception to UNTRAINED via ordinary character_updated envelope
    h.owner.emit('character_updated', {
      roomId: h.room.id,
      characterId: h.pc.characterId,
      character: { id: h.pc.characterId, skillRanks: { perception: 'UNTRAINED' } }
    });
    await new Promise(resolve => setTimeout(resolve, 60));

    assert.equal(passives.activeInitiativeBonus(h.live(), h.pc), 0);
    const listAfterLoss = await h.ack(h.gm, 'actor_passive_list', { roomId: h.room.id });
    assert.equal(listAfterLoss.activations[0].state, 'stale');

    // Completed combat1 initiative is never rewritten
    const entry1AfterLoss = h.entry(h.pc);
    assert.equal(entry1AfterLoss.initiative, 17);
    assert.equal(entry1AfterLoss.initiativeMod, 2);

    await h.endCombat();
    // Future roll receives +0
    const entry2 = await h.startCombat({ pc: 15 });
    assert.equal(entry2.initiativeMod, 0);
    assert.equal(entry2.initiative, 15);
    assert.equal(entry2.passiveApplied, undefined);
  });

  it('restoring Perception NOVICE does not silently reactivate; explicit revoke + GM reactivation restores +2', async() => {
    const activated = await h.activate(h.pc);
    assert.equal(activated.success, true);

    h.owner.emit('character_updated', {
      roomId: h.room.id,
      characterId: h.pc.characterId,
      character: { id: h.pc.characterId, skillRanks: { perception: 'UNTRAINED' } }
    });
    await new Promise(resolve => setTimeout(resolve, 60));
    assert.equal(passives.activeInitiativeBonus(h.live(), h.pc), 0);

    // Restore Perception NOVICE via character_updated
    h.owner.emit('character_updated', {
      roomId: h.room.id,
      characterId: h.pc.characterId,
      character: { id: h.pc.characterId, skillRanks: { perception: 'NOVICE' } }
    });
    await new Promise(resolve => setTimeout(resolve, 60));

    const listAfterRestore = await h.ack(h.gm, 'actor_passive_list', { roomId: h.room.id });
    assert.equal(listAfterRestore.activations[0].state, 'stale');
    assert.equal(passives.activeInitiativeBonus(h.live(), h.pc), 0);

    // Direct activation while stale is refused
    const directReactivate = await h.activate(h.pc);
    assert.equal(directReactivate.success, false);
    assert.equal(directReactivate.code, 'passive_activation_stale');

    // Roll while stale gives +0
    const staleEntry = await h.startCombat({ pc: 9 });
    assert.equal(staleEntry.initiativeMod, 0);
    assert.equal(staleEntry.initiative, 9);
    assert.equal(staleEntry.passiveApplied, undefined);
    await h.endCombat();

    // Explicit GM revoke + reactivation restores +2
    const revoked = await h.revoke(activated.activation.activationId);
    assert.equal(revoked.success, true);
    const reactivated = await h.activate(h.pc);
    assert.equal(reactivated.success, true);
    assert.equal(passives.activeInitiativeBonus(h.live(), h.pc), 2);

    const reactivatedEntry = await h.startCombat({ pc: 9 });
    assert.equal(reactivatedEntry.initiativeMod, 2);
    assert.equal(reactivatedEntry.initiative, 11);
    assert.equal(reactivatedEntry.passiveApplied, true);
  });

  it('ownership change (handler-level) and actor-incarnation change (actor_bind replacePrimaryRef) invalidate activation without rewriting completed initiative', async() => {
    const activated = await h.activate(h.pc);
    assert.equal(activated.success, true);
    const entry1 = await h.startCombat({ pc: 12 });
    assert.equal(entry1.initiative, 14);

    // Handler-level ownership change (no rendered UI control for PC ownership transfer)
    const token = h.token(h.pc);
    token.ownerUserId = 'other-owner';
    assert.equal(passives.activeInitiativeBonus(h.live(), h.pc), 0);
    const listAfterOwnerChange = await h.ack(h.gm, 'actor_passive_list', { roomId: h.room.id });
    assert.equal(listAfterOwnerChange.activations[0].state, 'stale');
    assert.equal(h.entry(h.pc).initiative, 14);

    await h.endCombat();
    // Restore ownership and reactivate to test actor-incarnation change via actor_bind replacePrimaryRef
    token.ownerUserId = h.uid;
    await h.revoke(activated.activation.activationId);
    const reactivated = await h.activate(h.pc);
    assert.equal(reactivated.success, true);
    const entry2 = await h.startCombat({ pc: 10 });
    assert.equal(entry2.initiative, 12);

    // Place a second token pc2 and replace primary attachment
    const map = h.live().gameState.maps.default;
    map.characterTokens.pc2 = {
      id: 'pc2',
      mapId: 'default',
      ownerUserId: h.uid,
      position: { x: 250, y: 100 },
      character: JSON.parse(JSON.stringify(token.character)),
      state: { conditions: [] }
    };
    const rebind = await h.ack(h.gm, 'actor_bind', {
      roomId: h.room.id,
      ref: { kind: 'character', roomId: h.room.id, mapId: 'default', tokenId: 'pc2', ownerUid: h.uid, characterId: h.pc.characterId },
      snapshotHash: h.actors.hash(map.characterTokens.pc2),
      replacePrimaryRef: h.pc
    });
    assert.equal(rebind.success, true);

    assert.equal(passives.activeInitiativeBonus(h.live(), h.pc), 0);
    assert.equal(passives.activeInitiativeBonus(h.live(), rebind.ref), 0);
    const listAfterRebind = await h.ack(h.gm, 'actor_passive_list', { roomId: h.room.id });
    assert.equal(listAfterRebind.activations[0].state, 'stale');
    assert.equal(h.entry(h.pc).initiative, 12);
  });

  it('owners and observers cannot activate/revoke or see private activation metadata', async() => {
    const activated = await h.activate(h.pc);
    assert.equal(activated.success, true);
    const activationId = activated.activation.activationId;

    // Owner cannot activate or revoke
    const ownerAct = await h.ack(h.owner, 'actor_passive_activate', h.activationPayload(h.pc));
    assert.equal(ownerAct.success, false);
    assert.equal(ownerAct.code, 'forbidden');
    const ownerRev = await h.ack(h.owner, 'actor_passive_revoke', h.revokePayload(activationId));
    assert.equal(ownerRev.success, false);
    assert.equal(ownerRev.code, 'forbidden');

    // Observer cannot activate or revoke
    const obsAct = await h.ack(h.observer, 'actor_passive_activate', h.activationPayload(h.pc));
    assert.equal(obsAct.success, false);
    assert.equal(obsAct.code, 'forbidden');
    const obsRev = await h.ack(h.observer, 'actor_passive_revoke', h.revokePayload(activationId));
    assert.equal(obsRev.success, false);
    assert.equal(obsRev.code, 'forbidden');

    // Owner sees own activation without private GM metadata
    const ownerList = await h.ack(h.owner, 'actor_passive_list', { roomId: h.room.id });
    assert.equal(ownerList.success, true);
    assert.equal(ownerList.activations.length, 1);
    for (const secretKey of ['gmUid', 'activatedAtCommit', 'targetRevision', 'sourceRecordSha256', 'sourceShape']) {
      assert.equal(ownerList.activations[0][secretKey], undefined, `owner list must strip ${secretKey}`);
    }

    // Observer sees empty activations
    const obsList = await h.ack(h.observer, 'actor_passive_list', { roomId: h.room.id });
    assert.equal(obsList.success, true);
    assert.deepEqual(obsList.activations, []);
  });
});
