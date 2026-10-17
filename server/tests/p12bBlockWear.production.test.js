/** P12B thin slice through the real registered stack (frozen contract revision 4 §3):
 * owner declaration in the selection window, GM attack offer, owner block approval bound to that
 * attack, and one atomic HP + equipment-wear consequence with minimal public text. */
const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const blocks = require('../services/blockApprovals');
const strikes = require('../services/strikeApprovals');

const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 5000);
  client.emit(event, payload, result => {clearTimeout(timer); resolve(result);});
});
const once = (client, event) => new Promise(resolve => client.once(event, resolve));
const EVENTS = ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_propose', 'actor_recovery', 'actor_blocking_view', 'actor_block_offer', 'actor_block_approve',
  'actor_block_withdraw', 'actor_block_decline', 'actor_block_list', 'actor_strike_approve'];
const ARMOR = { slot: 'chest', itemId: 'weathered-hide', name: 'Weathered Hide', kind: 'armor', currentDie: 'd8' };
const SHIELD = { slot: 'offHand', itemId: 'b6f1c0de-0000-4000-8000-000000000001', name: 'Oak Buckler', kind: 'shield', currentDie: 'd8' };
const LEGS = { slot: 'legs', itemId: 'item_1792170000000_a', name: 'Tattered Greaves', kind: 'armor', currentDie: 'd6' };

describe('P12B creature hit → owner block → atomic HP and wear (registered production stack)', function() {
  this.timeout(20000);
  let server, writer, gm, owner, other, gmUid, ownerUid, room, pcRef, foeRef, clients, epoch;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start(); clients = [];
    for (const event of EVENTS) {server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });}
    gmUid = server.nextUserId(); ownerUid = server.nextUserId(); const otherUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('other', otherUid);
    gm = server.connect({ token: 'gm' }); clients.push(gm); await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid, persistentRoomId: crypto.randomUUID() });
    for (const [token, name] of [['owner', 'Owner'], ['other', 'Other']]) {
      const client = server.connect({ token }); clients.push(client); await once(client, 'connect');
      const joined = once(client, 'room_joined'); client.emit('join_room', { roomId: room.id, playerName: name, password: '' }); await joined;
      if (token === 'owner') {owner = client;} else {other = client;}
    }
    server.players.get(owner.id).character = { id: 'ilsa', class: 'Warrior' };
    server.setCharacterOwner('ilsa', ownerUid);
    const pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'ilsa', name: 'Ilsa', class: 'Warrior', health: { current: 30, max: 40 }, mana: { current: 10, max: 30 },
      actionPoints: { current: 4, max: 4 }, tempHealth: 2, tempMana: 0, tempActionPoints: 0,
      equipment: { chest: { id: ARMOR.itemId, name: ARMOR.name, type: 'armor', subtype: 'LEATHER' }, offHand: { id: SHIELD.itemId, name: SHIELD.name, type: 'armor', subtype: 'SHIELD' },
        legs: { id: LEGS.itemId, name: LEGS.name, type: 'armor', subtype: 'CLOTH' }, mainHand: { id: 'iron-sword', name: 'Iron Sword', type: 'weapon', subtype: 'SWORD' } } },
    state: { conditions: [] } };
    const foe = { id: 'foe', creatureId: 'grimmstalk', stats: { maxHp: 250, maxMana: 30, maxAP: 30 },
      state: { currentHp: 30, tempHealth: 0, currentMana: 0, tempMana: 0, currentActionPoints: 20, tempActionPoints: 1, conditions: [] } };
    room.gameState.maps.default.characterTokens.pc = pc; room.gameState.maps.default.tokens.foe = foe;
    pcRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'ilsa' }, snapshotHash: actors.hash(pc) })).ref;
    foeRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(foe) })).ref;
    assert.ok(pcRef && foeRef);
    epoch = (await ack(owner, 'actor_snapshot', { roomId: room.id })).actionEpoch;
  });
  afterEach(async() => {for (const client of clients) {client.disconnect();} await server.stop();});
  const live = () => server.rooms.get(room.id);
  const pcToken = () => actors.locate(live(), pcRef).token;
  const revision = ref => actors.locate(live(), ref).contract.revision;
  const declaration = () => pcToken().state.equipmentBlocking || null;
  const base = () => ({ version: 1, roomId: room.id, commandId: crypto.randomUUID(), actionEpoch: epoch, baseCommitSequence: actors.ledger(live()).commitSequence });
  const declare = (pieces, { mode = 'block', client = owner, beforeRevision } = {}) => ack(client, 'actor_consequence', { ...base(),
    actors: [{ ref: pcRef, expectedRevision: revision(pcRef), blockingDeclaration: { beforeRevision: beforeRevision ?? (declaration()?.revision || 0), mode, pieces } }] });
  const offer = async(overrides = {}, commandId = crypto.randomUUID()) => {
    const attack = { capability: 'p12b-attack:v1', source: foeRef, target: pcRef, sourceRevision: revision(foeRef), ability: { id: 'claw', name: 'Raking Claw' },
      roll: { mode: 'physical', dice: '1d10', faces: [7] }, outcome: 'hit', damageType: 'slicing', proposedDamage: 7, apCost: 2, ...overrides };
    const result = await ack(gm, 'actor_block_offer', { roomId: room.id, commandId, attack });
    assert.equal(result.success, true, JSON.stringify(result));
    return { commandId, attack, attackHash: result.attackHash };
  };
  const approval = (offered, face, overrides = {}) => {
    const { declaration: current, piece } = blocks.firstAvailable(pcToken());
    return { version: 1, roomId: room.id, approvalId: crypto.randomUUID(), actionEpoch: epoch, baseCommitSequence: actors.ledger(live()).commitSequence,
      source: foeRef, target: pcRef, attack: { commandId: offered.commandId, attackHash: offered.attackHash },
      blocking: { revision: current.revision, slot: piece.slot, itemId: piece.itemId, die: piece.currentDie }, roll: { mode: 'physical', faces: [face] }, ...overrides };
  };
  const register = async(offered, face, overrides) => {
    const approved = approval(offered, face, overrides);
    const result = await ack(owner, 'actor_block_approve', approved);
    assert.equal(result.code, 'awaiting_gm', JSON.stringify(result));
    return { approved, contentHash: result.contentHash };
  };
  const gmCommand = (offered, { approved, contentHash }, overrides = {}) => {
    const token = pcToken(), { piece } = blocks.firstAvailable(token);
    const face = approved.roll.faces[0], defending = blocks.holdsDefending(token), reduction = face * (defending ? 2 : 1);
    const attack = overrides.attack || offered.attack;
    const afterBlock = Math.max(0, attack.proposedDamage - reduction);
    const final = overrides.finalAmount ?? afterBlock;
    const chosen = { capability: 'p12b-block:v1', approvalId: approved.approvalId, gmConfirmed: true, names: { source: 'Grimmstalk', target: 'Ilsa' }, attack,
      block: { slot: piece.slot, name: piece.name, kind: piece.kind, die: piece.currentDie, face, defending, reduction, ...(overrides.block || {}) },
      afterBlock, manual: overrides.manual || [] };
    const foe = actors.locate(live(), foeRef).token;
    const fromTempAp = Math.min(foe.state.tempActionPoints, attack.apCost);
    const fromTemp = Math.min(token.character.tempHealth, final);
    const wear = overrides.wear || blocks.expectedWear(token, approved).entry;
    return { version: 1, roomId: room.id, commandId: overrides.commandId || offered.commandId, actionEpoch: epoch, baseCommitSequence: actors.ledger(live()).commitSequence,
      actors: [
        { ref: foeRef, expectedRevision: revision(foeRef), finalResources: { ap: { current: foe.state.currentActionPoints - (attack.apCost - fromTempAp), temp: foe.state.tempActionPoints - fromTempAp } } },
        { ref: pcRef, expectedRevision: revision(pcRef), finalResources: { hp: { current: Math.max(0, token.character.health.current - (final - fromTemp)), temp: token.character.tempHealth - fromTemp } },
          equipmentWear: wear }],
      source: foeRef, target: pcRef, approval: { approvalId: approved.approvalId, contentHash },
      adjudication: { definitionId: 'creature-attack-block', definitionVersionOrHash: 'p12b-block:v1/creature-attack-block', chosenResult: overrides.raw ?? JSON.stringify(chosen),
        finalAmount: final, adjustmentReason: overrides.reason ?? '' } };
  };
  const block = async(face, offerOverrides, commandOverrides) => {
    const offered = await offer(offerOverrides);
    const registered = await register(offered, face);
    return { offered, registered, result: await ack(gm, 'actor_consequence', gmCommand(offered, registered, commandOverrides)) };
  };
  const addDefending = async() => {
    const id = crypto.randomUUID();
    const record = { version: 1, id, recordId: id, conditionKey: 'defending', name: 'Defending', originalName: 'Defending', type: 'buff', kind: 'marker',
      target: pcRef, targetId: 'pc', targetType: 'character', source: 'manual', sharedTiming: 'manual', durationType: 'manual' };
    const result = await ack(owner, 'actor_consequence', { ...base(), actors: [{ ref: pcRef, expectedRevision: revision(pcRef), conditions: [{ op: 'add', recordId: id, record }] }] });
    assert.equal(result.success, true, JSON.stringify(result));
  };

  it('B1 owner declares out of combat; only owner and GM can read it; public receipts carry the revision only', async() => {
    const observer = once(other, 'actor_consequence_accepted');
    let otherSawDeclaration = false; other.on('actor_blocking_changed', () => {otherSawDeclaration = true;});
    const changed = once(owner, 'actor_blocking_changed');
    const result = await declare([ARMOR, SHIELD]);
    assert.equal(result.success, true, JSON.stringify(result));
    assert.deepEqual(result.receipt.actors[0].blocking, { revision: 1 });
    assert.equal('contentHash' in result.receipt, false, 'review R1: the declaration command hash is never public');
    assert.deepEqual(declaration().declaredDuring, { outOfCombat: true });
    assert.equal(declaration().pieces.every(piece => piece.broken === false), true);
    assert.equal((await changed).declaration.revision, 1);
    const seenReceipt = (await observer).receipt;
    assert.equal('contentHash' in seenReceipt, false);
    const seen = JSON.stringify(seenReceipt);
    assert.equal(['equipmentBlocking', 'currentDie', 'declaredDuring', 'pieces'].some(key => seen.includes(key)), false, 'other members get no declaration');
    const snapshot = JSON.stringify(await ack(other, 'actor_snapshot', { roomId: room.id }));
    assert.equal(snapshot.includes('equipmentBlocking'), false, 'never in the general projection');
    assert.equal((await ack(other, 'actor_blocking_view', { roomId: room.id, ref: pcRef })).code, 'forbidden');
    assert.equal((await ack(gm, 'actor_blocking_view', { roomId: room.id, ref: pcRef })).declaration.pieces.length, 2);
    assert.equal((await ack(owner, 'actor_blocking_view', { roomId: room.id, ref: pcRef })).declaration.revision, 1);
    assert.equal(otherSawDeclaration, false);
    const none = await declare([], { mode: 'none' });
    assert.equal(none.success, true, JSON.stringify(none));
    assert.deepEqual(declaration().pieces, []);
  });
  it('B2 selection window: own turn only in active combat; unbound own entry refused; turn authority unchanged', async() => {
    // Each accepted command installs a new gameState: always edit the live combat record.
    const combat = patch => Object.assign(live().gameState.combat, patch);
    live().gameState.combat = { isActive: true, round: 2, currentTurnIndex: 1, currentTurnStartTime: 1000, turnOrder: [{ tokenId: 'pc', actorRef: pcRef }, { tokenId: 'foe', actorRef: foeRef }] };
    assert.equal((await declare([ARMOR])).code, 'not_your_turn');
    combat({ currentTurnIndex: 0 });
    const ok = await declare([ARMOR]);
    assert.equal(ok.success, true, JSON.stringify(ok));
    assert.deepEqual(declaration().declaredDuring, { round: 2, turnIndex: 0, turnStartTime: 1000 });
    combat({ turnOrder: [{ tokenId: 'pc' }, { tokenId: 'foe', actorRef: foeRef }] });
    assert.equal((await declare([SHIELD])).code, 'combat_binding_required');
    combat({ turnOrder: [{ tokenId: 'pc', actorRef: pcRef }, { tokenId: 'pc', actorRef: pcRef }] });
    assert.equal((await declare([SHIELD])).code, 'combat_turn_ambiguous');
    combat({ turnOrder: [{ tokenId: 'foe', actorRef: foeRef }] });
    assert.equal((await declare([SHIELD])).success, true, 'not a combatant: out-of-combat selection');
    combat({ isActive: false });
    assert.equal((await declare([LEGS])).success, true);
    assert.equal(require('../services/combatAuthority').isCombatAuthorityEnabled(), false, 'cooperative turn policy untouched');
  });
  it('B3 declaration boundaries: shared equipment, CAS, owner only, no propose, protected from legacy writes', async() => {
    assert.equal((await declare([{ ...ARMOR, itemId: 'not-equipped' }])).code, 'equipment_projection_mismatch');
    assert.equal((await declare([{ ...ARMOR, kind: 'shield' }])).code, 'equipment_projection_mismatch');
    assert.equal((await declare([{ ...ARMOR, name: 'Renamed' }])).code, 'equipment_projection_mismatch');
    assert.equal((await declare([{ ...ARMOR, currentDie: 'd7' }])).code, 'invalid_blocking_declaration', 'only ladder dice');
    assert.equal((await declare([ARMOR], { client: gm })).code, 'blocking_owner_required', 'no GM edits');
    assert.equal((await declare([ARMOR])).success, true);
    assert.equal((await declare([SHIELD], { beforeRevision: 0 })).code, 'stale_blocking_state');
    assert.equal((await ack(owner, 'actor_propose', { ...base(), actors: [{ ref: pcRef, expectedRevision: revision(pcRef), blockingDeclaration: { beforeRevision: 1, mode: 'none', pieces: [] } }] })).code, 'blocking_owner_required');
    assert.ok(actors.protectedPath({ updates: { state: { equipmentBlocking: { revision: 9 } } } }), 'legacy envelopes cannot write the declaration');
    // A rising owner-declared die is flagged for the GM.
    assert.equal((await declare([{ ...ARMOR, currentDie: 'd10' }])).success, true);
    assert.deepEqual(declaration().raised, ['chest']);
  });
  it('B4 armor d8 face 2 → d6 with HP and creature AP in one receipt; offer removed; minimal public line', async() => {
    await declare([ARMOR, SHIELD]);
    const observer = once(other, 'actor_consequence_accepted'), ownerChanged = once(owner, 'actor_blocking_changed');
    const { offered, registered, result } = await block(2);
    assert.equal(result.success, true, JSON.stringify(result));
    const pc = pcToken(), foe = actors.locate(live(), foeRef).token;
    // 7 − 2 = 5: temp HP 2 first, then 3 → 27; creature AP 2 temp-first (1 temp, then 20 → 19).
    assert.deepEqual([pc.character.health.current, pc.character.tempHealth], [27, 0]);
    assert.deepEqual([foe.state.currentActionPoints, foe.state.tempActionPoints], [19, 0]);
    assert.deepEqual(declaration().pieces.map(piece => [piece.slot, piece.currentDie, piece.broken]), [['chest', 'd6', false], ['offHand', 'd8', false]]);
    assert.equal(declaration().revision, 2);
    assert.deepEqual(result.receipt.actors[1].equipmentWear, { slot: 'chest', name: 'Weathered Hide', kind: 'armor', beforeDie: 'd8', afterDie: 'd6', blockingRevision: 1, naturalFace: 2, broken: false, defending: false });
    // Equipped item ids are already shared equipment (F3); the receipt adds no id, backup or undeclared die.
    const publicReceipt = JSON.stringify((await observer).receipt);
    assert.equal(publicReceipt.includes(ARMOR.itemId) || publicReceipt.includes(SHIELD.itemId) || publicReceipt.includes('Oak Buckler'), false, 'no item id or backups in the receipt');
    assert.equal((await ownerChanged).declaration.pieces[0].currentDie, 'd6');
    assert.equal(blocks.getOffer(live(), offered.commandId), null);
    assert.equal(blocks.get(live(), registered.approved.approvalId), null);
    assert.deepEqual(result.receipt.authorization, { kind: 'owner-approval-gm', authorizerUid: gmUid, proposalId: registered.approved.approvalId, approvalHash: registered.contentHash });
  });
  it('B5 shield wears only on 1; Defending doubles and prevents wear; a claimed wear is refused', async() => {
    await declare([SHIELD, ARMOR]);
    assert.equal((await block(2)).result.success, true);
    assert.equal(declaration().pieces[0].currentDie, 'd8', 'shield face 2 → no wear');
    assert.equal((await block(1)).result.success, true);
    assert.equal(declaration().pieces[0].currentDie, 'd6', 'shield face 1 → one step');
    await addDefending();
    const offered = await offer();
    const registered = await register(offered, 1);
    const forged = { ...blocks.expectedWear(pcToken(), registered.approved).entry, afterDie: 'd4' };
    assert.equal((await ack(gm, 'actor_consequence', gmCommand(offered, registered, { wear: forged }))).code, 'invalid_equipment_wear');
    const before = pcToken().character.health.current + pcToken().character.tempHealth;
    const accepted = await ack(gm, 'actor_consequence', gmCommand(offered, registered));
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.equal(declaration().pieces[0].currentDie, 'd6', 'never wears while Defending');
    assert.equal(before - (pcToken().character.health.current + pcToken().character.tempHealth), 5, '7 − 1×2');
    assert.equal(accepted.receipt.actors[1].equipmentWear.defending, true);
  });
  it('B6 worn below d4 breaks; the next block uses the first available backup; the broken piece cannot be named', async() => {
    await declare([{ ...LEGS, currentDie: 'd4' }, ARMOR]);
    const first = await block(1);
    assert.equal(first.result.success, true, JSON.stringify(first.result));
    assert.deepEqual(declaration().pieces[0], { ...LEGS, currentDie: 'broken', broken: true });
    assert.equal(first.result.receipt.actors[1].equipmentWear.broken, true);
    const offered = await offer();
    const stale = approval(offered, 3, { blocking: { revision: declaration().revision, slot: 'legs', itemId: LEGS.itemId, die: 'd4' } });
    assert.equal((await ack(owner, 'actor_block_approve', stale)).code, 'stale_blocking_state');
    const registered = await register(offered, 3);
    assert.equal(registered.approved.blocking.slot, 'chest');
    // A piece no longer in its shared slot is unavailable too (the owner unequipped it meanwhile).
    const prepared = gmCommand(offered, registered);
    const chest = pcToken().character.equipment.chest;
    pcToken().character.equipment.chest = null;
    assert.equal((await ack(gm, 'actor_consequence', prepared)).code, 'no_blocking_piece');
    // The rolled piece is gone: the approval is closed (owner rolls again), never left pending.
    pcToken().character.equipment.chest = chest;
    assert.equal((await ack(gm, 'actor_consequence', prepared)).code, 'approval_invalidated');
    const again = await register(await offer(), 3);
    assert.equal(again.approved.blocking.slot, 'chest');
  });
  it('B7 the approval binds one attack: other commands, changed attacks, re-offers and adjustments', async() => {
    await declare([ARMOR]);
    const offered = await offer(), other = await offer({ proposedDamage: 9 });
    const registered = await register(offered, 5);
    assert.equal((await ack(gm, 'actor_consequence', gmCommand(offered, registered, { commandId: other.commandId }))).code, 'approval_mismatch', 'different attack');
    assert.equal((await ack(gm, 'actor_consequence', gmCommand(offered, registered, { attack: { ...offered.attack, proposedDamage: 12 } }))).code, 'approval_mismatch', 'changed damage');
    assert.equal((await ack(gm, 'actor_block_offer', { roomId: room.id, commandId: offered.commandId, attack: { ...offered.attack, proposedDamage: 12 } })).code, 'command_id_conflict');
    assert.equal((await ack(gm, 'actor_consequence', gmCommand(offered, registered, { finalAmount: 4 }))).code, 'adjustment_reason_required');
    const accepted = await ack(gm, 'actor_consequence', gmCommand(offered, registered, { finalAmount: 4, reason: 'Flat DR 1 ruled at the table' }));
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.equal(accepted.receipt.adjudication.finalAmount, 4);
    assert.equal(declaration().pieces[0].currentDie, 'd8', 'face 5: no wear; adjustment never changes wear');
    // Approvals need a live offer for exactly that attack.
    const orphan = approval({ commandId: crypto.randomUUID(), attackHash: other.attackHash }, 3);
    assert.equal((await ack(owner, 'actor_block_approve', orphan)).code, 'offer_not_found');
  });
  it('B8 GM-adjudicated branches: critical vs armor refused, critical vs shield and non-physical need a ruling', async() => {
    await declare([ARMOR, SHIELD]);
    const critAttack = { outcome: 'critical', roll: { mode: 'physical', dice: '1d10', faces: [10, 4] }, proposedDamage: 14 };
    // Approved: no block roll against favored armor on a critical — refused at offer and at approval.
    assert.equal((await ack(gm, 'actor_block_offer', { roomId: room.id, commandId: crypto.randomUUID(),
      attack: { capability: 'p12b-attack:v1', source: foeRef, target: pcRef, sourceRevision: revision(foeRef), ability: { id: null, name: 'Crit' }, roll: critAttack.roll,
        outcome: 'critical', damageType: 'slicing', proposedDamage: 14, apCost: 0 } })).code, 'critical_bypasses_armor');
    await declare([SHIELD, ARMOR]);
    const late = await offer(critAttack);
    await declare([ARMOR, SHIELD]);
    assert.equal((await ack(owner, 'actor_block_approve', approval(late, 3))).code, 'critical_bypasses_armor');
    await declare([SHIELD, ARMOR]);
    const shieldCrit = await offer({ outcome: 'critical', roll: { mode: 'physical', dice: '1d10', faces: [10, 4] }, proposedDamage: 14 });
    const shield = await register(shieldCrit, 1);
    assert.equal((await ack(gm, 'actor_consequence', gmCommand(shieldCrit, shield))).code, 'block_ruling_required');
    const ruled = await ack(gm, 'actor_consequence', gmCommand(shieldCrit, shield, { manual: [{ category: 'critical-shield', note: 'GM: the shield rolls' }] }));
    assert.equal(ruled.success, true, JSON.stringify(ruled));
    assert.equal(declaration().pieces[0].currentDie, 'd6');
    const ember = await offer({ damageType: 'ember' });
    const fire = await register(ember, 4);
    assert.equal((await ack(gm, 'actor_consequence', gmCommand(ember, fire))).code, 'block_ruling_required');
    assert.equal((await ack(gm, 'actor_consequence', gmCommand(ember, fire, { manual: [{ category: 'non-physical', note: '' }] }))).success, true);
  });
  it('B9 retries: same command → same receipt; consumed approval refused; owner re-check recovers; pending blocks re-declaration', async() => {
    await declare([ARMOR]);
    const offered = await offer();
    const registered = await register(offered, 2);
    assert.equal((await declare([SHIELD])).code, 'blocking_pending', 'no declaration change under a pending block');
    const command = gmCommand(offered, registered);
    const accepted = await ack(gm, 'actor_consequence', command);
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.deepEqual((await ack(gm, 'actor_consequence', command)).receipt, accepted.receipt);
    assert.equal(declaration().pieces[0].currentDie, 'd6', 'exactly one step');
    const replay = { ...command, commandId: crypto.randomUUID() };
    assert.equal((await ack(gm, 'actor_consequence', replay)).code, 'approval_consumed');
    assert.deepEqual((await ack(owner, 'actor_block_approve', registered.approved)).receipt, accepted.receipt);
  });
  it('B10 retired attachment: rebinding moves the declaration to owner recovery; the old approval cannot apply', async() => {
    await declare([ARMOR]);
    const offered = await offer();
    const registered = await register(offered, 2);
    const command = gmCommand(offered, registered);
    const fresh = { id: 'pc2', ownerUserId: ownerUid, character: { ...actors.clone(pcToken().character) }, state: { conditions: [], equipmentBlocking: { forged: true } } };
    live().gameState.maps.default.characterTokens.pc2 = fresh;
    const rebound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'ilsa' },
      snapshotHash: actors.hash(fresh), replacePrimaryRef: pcRef });
    assert.equal(rebound.success, true, JSON.stringify(rebound));
    const newToken = live().gameState.maps.default.characterTokens.pc2;
    assert.equal(newToken.state.equipmentBlocking, undefined);
    assert.deepEqual(newToken.state.actorRecovery.priorBlocking, { forged: true });
    const result = await ack(gm, 'actor_consequence', command);
    assert.equal(result.success, false);
    assert.ok(['stale_actor_revision', 'secondary_attachment', 'actor_binding_conflict'].includes(result.code), result.code);
    const recovery = await ack(owner, 'actor_recovery', { roomId: room.id, locator: { kind: 'character', mapId: 'default', tokenId: 'pc' } });
    assert.equal(recovery.recovery.rawToken.state.equipmentBlocking.pieces[0].currentDie, 'd8', 'retired declaration stays readable to its owner');
    // Imported metadata is never trusted.
    const imported = actors.preserveImportedActorMetadata({ maps: { m: { characterTokens: { t: { state: { equipmentBlocking: { revision: 4 } } } } } } });
    assert.deepEqual(imported.maps.m.characterTokens.t.state, { actorRecovery: { importedEquipmentBlocking: { revision: 4 } } });
  });
  it('B11 approval IDs are one space with P9/P12A; offers are GM-only and never reach other members', async() => {
    await declare([ARMOR]);
    let leaked = false; other.on('actor_block_offered', () => {leaked = true;});
    assert.equal((await ack(owner, 'actor_block_offer', { roomId: room.id, commandId: crypto.randomUUID(), attack: (await offer()).attack })).code, 'forbidden');
    const offered = await offer();
    const registered = await register(offered, 4);
    assert.equal(blocks.foreignId(live(), registered.approved.approvalId), false);
    strikes.close(live(), registered.approved.approvalId, 'withdrawn');
    assert.equal(blocks.foreignId(live(), registered.approved.approvalId), true);
    assert.equal((await ack(gm, 'actor_consequence', gmCommand(offered, registered))).code, 'command_id_conflict', 'shared collision guard');
    const list = await ack(other, 'actor_block_list', { roomId: room.id });
    assert.deepEqual([list.pending, list.offered], [[], []]);
    assert.equal(leaked, false);
  });
  it('B12 approvals that can never be consumed are closed: a changed creature (stale attack) frees re-declaration', async() => {
    await declare([ARMOR]);
    const offered = await offer();
    const registered = await register(offered, 4);
    const foe = actors.locate(live(), foeRef).token;
    const bump = await ack(gm, 'actor_consequence', { ...base(), actors: [{ ref: foeRef, expectedRevision: revision(foeRef), finalResources: { hp: { current: foe.state.currentHp - 1, temp: 0 } } }] });
    assert.equal(bump.success, true, JSON.stringify(bump));
    const closed = once(owner, 'actor_block_closed');
    const planned = gmCommand(offered, registered);
    planned.actors[0] = { ...planned.actors[0], expectedRevision: offered.attack.sourceRevision }; // as the GM client plans it
    assert.equal((await ack(gm, 'actor_consequence', planned)).code, 'stale_attack');
    assert.equal((await closed).code, 'invalidated');
    assert.equal(blocks.get(live(), registered.approved.approvalId), null);
    assert.equal((await declare([SHIELD])).success, true, 'no lingering blocking_pending');
    assert.equal(declaration().pieces[0].currentDie, 'd8', 'nothing applied');
  });
});
