const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const blocks = require('../services/blockApprovals');
const payments = require('../services/spellPayments');
const pure = require('../../vtt-react/src/services/authoredAbility');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const ack = (s, e, d) => new Promise((resolve, reject) => { const timer = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(timer); resolve(r); }); });
const once = (s, e) => new Promise(r => s.once(e, r));
describe('P14-A5 admitted creature → primary PC, registered production stack', function() {
  this.timeout(15000);
  let server, room, gm, owner, other, source, target, gmUid, ownerUid;
  const token = ref => actors.locate(room, ref).token;
  const revision = ref => token(ref).state.actorContract.revision;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence });
  beforeEach(async() => {
    server = createProductionStackServer(); await server.start();
    gmUid = server.nextUserId(); ownerUid = server.nextUserId();
    for (const [name, uid] of [['gm', gmUid], ['owner', ownerUid], ['other', server.nextUserId()]]) server.registerAuthToken(name, uid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const name of ['owner', 'other']) { const s = server.connect({ token: name }); await once(s, 'connect'); const joined = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: name, password: '' }); await joined; if (name === 'owner') owner = s; else other = s; }
    for (const e of ['actor_bind', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke', 'actor_spell_prepare_creature', 'actor_block_offer', 'actor_block_approve', 'actor_block_list', 'actor_block_decline', 'actor_block_withdraw']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    server.setCharacterOwner('pc-character', ownerUid); server.players.get(owner.id).character = { id: 'pc-character', class: 'Warrior' };
    const pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'pc-character', name: 'Disposable PC', class: 'Warrior', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempHealth: 3,
      equipment: { chest: { id: 'hide', name: 'Hide', type: 'armor' }, offHand: { id: 'shield', name: 'Shield', type: 'shield' } } }, state: { conditions: [] } };
    const creature = { id: 'source', creatureId: 'same-template', stats: { maxHp: 30, maxMana: 10, maxAP: 10 }, state: { currentHp: 30, currentMana: 8, tempMana: 1, currentActionPoints: 8, tempActionPoints: 1, conditions: [] } };
    room.gameState.maps.default.tokens.source = creature; room.gameState.maps.default.characterTokens.pc = pc;
    source = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'source' }, snapshotHash: actors.hash(creature) })).ref;
    target = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'pc-character' }, snapshotHash: actors.hash(pc) })).ref;
    assert.ok(source && target);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); other.disconnect(); await server.stop(); });
  async function admitted(kind = 'damage', ap = 2, mana = 3, range = 30, formula = '1d6+2') {
    const draft = { name: `Disposable A5 ${kind}`, description: 'Disposable verification', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' }, effectTypes: [kind],
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana },
      [kind === 'damage' ? 'damageConfig' : 'healingConfig']: kind === 'damage' ? { damageType: 'direct', elementType: 'arcane', formula, resolution: 'DICE' } : { healingType: 'direct', formula, resolution: 'DICE' } };
    token(source).authoredAbility = { schemaVersion: 1, record: { ...actors.clone(draft), authoredDraft: draft, authoredDefinitionId: uuid() }, librarySpellId: null };
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, source, expectedSourceRevision: revision(source), definitionVersion: 1 }); assert.equal(r.success, true, JSON.stringify(r));
    const grant = token(source).state.actorContract.authoredAdmission, entry = installed.lookup(room, { definitionId: pure.actionId(grant.definitionRef) });
    const attempt = { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source, target,
      sourceAuthority: { admissionId: grant.requestId, associationHash: grant.associationHash, gmUid: grant.gmUid }, spell: { definitionId: pure.actionId(entry.definitionRef), definitionHash: `${pure.CAPABILITY}/${entry.definitionRef.definitionHash}`, name: draft.name, kind, damageTypes: entry.descriptor.effect.damageTypes }, price: entry.descriptor.price, classPayment: null,
      roll: { mode: 'physical', dice: [{ sides: 6, faces: Array(pure.readFormula(formula).dice[0].count).fill(4) }], constant: 2, total: 4 * pure.readFormula(formula).dice[0].count + 2, reading: formula } };
    return { capability: blocks.ATTACK_CAPABILITY, source, target, sourceRevision: revision(source), ability: { id: attempt.spell.definitionId, name: draft.name }, roll: { mode: 'physical', dice: formula, faces: attempt.roll.dice[0].faces }, outcome: 'hit', damageType: kind === 'damage' ? 'arcane' : 'healing', proposedDamage: attempt.roll.total, apCost: ap,
      authored: { attempt, targetRevision: revision(target), blockApplicable: kind === 'damage', ruling: 'GM adjudicated targeting and applicability', targeting: entry.canonicalDefinition.targeting } };
  }
  async function declare(kind = 'armor', die = 'd8') {
    const piece = { slot: kind === 'armor' ? 'chest' : 'offHand', itemId: kind === 'armor' ? 'hide' : 'shield', name: kind === 'armor' ? 'Hide' : 'Shield', kind, currentDie: die };
    const r = await ack(owner, 'actor_consequence', { ...base(), actors: [{ ref: target, expectedRevision: revision(target), blockingDeclaration: { beforeRevision: token(target).state.equipmentBlocking?.revision || 0, mode: 'block', pieces: [piece] } }] }); assert.equal(r.success, true, JSON.stringify(r));
  }
  async function offer(attack) { const commandId = attack.authored.attempt.approvalId, r = await ack(gm, 'actor_block_offer', { roomId: room.id, commandId, attack }); assert.equal(r.success, true, JSON.stringify(r)); return { commandId, attack, attackHash: r.attackHash }; }
  async function approve(o, face = null) {
    const piece = face === null ? null : blocks.firstAvailable(token(target));
    const a = { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source, target, attack: { commandId: o.commandId, attackHash: o.attackHash }, blocking: piece ? { revision: piece.declaration.revision, slot: piece.piece.slot, itemId: piece.piece.itemId, die: piece.piece.currentDie } : null, roll: piece ? { mode: 'physical', faces: [face] } : null };
    const r = await ack(owner, 'actor_block_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return { approval: a, contentHash: r.contentHash };
  }
  function command(o, e, amount, revalidate = false) {
    const a = e.approval, attack = o.attack, healing = attack.authored.attempt.spell.kind === 'healing', wear = a.blocking ? blocks.expectedWear(token(target), a) : null;
    const reduction = wear ? profile.blockingReduction(wear.face, wear.defending) : 0, afterBlock = Math.max(0, attack.proposedDamage - reduction), final = amount ?? afterBlock;
    const pools = actors.resources(token(source), 'creature'), hp = actors.resources(token(target), 'character').hp, payment = {};
    for (const p of ['ap', 'mana']) if (attack.authored.attempt.price[p] > 0) payment[p] = payments.tempFirst(pools[p].current, pools[p].temp, attack.authored.attempt.price[p]);
    if (!Object.keys(payment).length) payment.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);
    const chosen = { capability: blocks.CAPABILITY, approvalId: a.approvalId, gmConfirmed: true, names: { source: 'Creature', target: 'PC' }, attack,
      block: wear ? { slot: wear.piece.slot, name: wear.piece.name, kind: wear.piece.kind, die: wear.piece.currentDie, face: wear.face, defending: wear.defending, reduction } : null, afterBlock,
      manual: wear ? [{ category: 'non-physical', note: 'Explicit GM ruling applies' }] : [] };
    if (revalidate && revision(target) !== attack.authored.targetRevision) chosen.targetRevalidation = { fromRevision: attack.authored.targetRevision, toRevision: revision(target), reason: 'Reviewed changed target; original faces stand' };
    if (revalidate && revision(source) !== attack.sourceRevision) chosen.revalidation = { fromRevision: attack.sourceRevision, toRevision: revision(source), reason: 'Reviewed changed source; original faces stand' };
    return { ...base(), commandId: o.commandId, source, target, approval: { approvalId: a.approvalId, contentHash: e.contentHash }, actors: [{ ref: source, expectedRevision: revision(source), finalResources: payment },
      { ref: target, expectedRevision: revision(target), finalResources: { hp: healing ? { current: Math.min(hp.max, hp.current + final), temp: hp.temp } : { current: Math.max(0, hp.current - Math.max(0, final - hp.temp)), temp: Math.max(0, hp.temp - final) } }, ...(wear ? { equipmentWear: wear.entry } : {}) }],
      adjudication: { definitionId: blocks.DEFINITION_ID, definitionVersionOrHash: blocks.DEFINITION_HASH, chosenResult: JSON.stringify(chosen), finalAmount: final, adjustmentReason: final === afterBlock ? '' : 'GM final mitigation' } };
  }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(room.gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code); assert.deepEqual(room.gameState, before); return r; }
  it('block: temp-first AP/mana/HP and armor wear install once, original approvals and receipt recover', async() => {
    await declare(); const o = await offer(await admitted()), before = actors.clone(room.gameState), e = await approve(o, 2); assert.deepEqual(room.gameState, before);
    assert.equal((await ack(owner, 'actor_block_approve', e.approval)).code, 'awaiting_gm');
    const c = command(o, e), r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    assert.deepEqual([token(source).state.currentActionPoints, token(source).state.tempActionPoints, token(source).state.currentMana, token(source).state.tempMana], [7, 0, 6, 0]);
    assert.deepEqual([token(target).character.health.current, token(target).character.tempHealth, token(target).state.equipmentBlocking.pieces[0].currentDie], [19, 0, 'd6']);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt);
    assert.deepEqual((await ack(owner, 'actor_block_approve', e.approval)).receipt, r.receipt);
    assert.equal(JSON.parse(r.receipt.adjudication.chosenResult).attack.authored.attempt, undefined, 'public proof redacted');
    await refused('actor_consequence', { ...c, adjudication: { ...c.adjudication, finalAmount: 0 } }, 'command_id_conflict');
  });
  it('Don’t block: exact owner, no wear and no silent substitute roll', async() => {
    await declare(); const o = await offer(await admitted()), e = await approve(o);
    await refused('actor_block_approve', e.approval, 'forbidden', other);
    const r = await ack(gm, 'actor_consequence', command(o, e)); assert.equal(r.success, true, JSON.stringify(r));
    assert.deepEqual([token(target).character.health.current, token(target).character.tempHealth], [17, 0]); assert.equal(token(target).state.equipmentBlocking.revision, 1);
  });
  it('healing explicitly accepted, zero costs, capped HP and no equipment roll or wear; amount changes refuse', async() => {
    const o = await offer(await admitted('healing', 0, 0)); o.attack.proposedDamage = 100; // Immutable offer changes cannot borrow its approval hash.
    const e = await approve(o); await refused('actor_consequence', command(o, e), 'approval_mismatch'); o.attack.proposedDamage = 6;
    await refused('actor_consequence', command(o, e, 100), 'owner_reapproval_required');
    const c = command(o, e), r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); assert.equal(token(target).character.health.current, 26); assert.equal(token(source).state.currentActionPoints, 8); assert.equal(token(target).state.equipmentBlocking, undefined);
  });
  it('healing no response/rejection spends nothing, closed offers cannot accept', async() => {
    const before = actors.clone(room.gameState), o = await offer(await admitted('healing')); const admittedState = actors.clone(room.gameState);
    assert.equal(blocks.listAll(room).length, 0); assert.deepEqual(room.gameState, admittedState);
    assert.equal((await ack(owner, 'actor_block_withdraw', { roomId: room.id, commandId: o.commandId })).success, true);
    assert.equal(blocks.closedOffer(room, o.commandId).code, 'withdrawn'); assert.deepEqual(room.gameState, admittedState); assert.notDeepEqual(before, admittedState);
  });
  it('current GM and exact source/version/range/primary target required; A4 direct handler cannot bypass consent', async() => {
    const a = await admitted(); await refused('actor_spell_prepare_creature', a.authored.attempt, 'unsupported_creature_target');
    const downgraded = actors.clone(a); delete downgraded.authored; await refused('actor_block_offer', { roomId: room.id, commandId: a.authored.attempt.approvalId, attack: downgraded }, 'authored_reference_required');
    await refused('actor_block_offer', { roomId: room.id, commandId: a.authored.attempt.approvalId, attack: a }, 'forbidden', other);
    token(target).state.actorContract.primary = false; await refused('actor_block_offer', { roomId: room.id, commandId: a.authored.attempt.approvalId, attack: a }, 'secondary_attachment'); room.gameState.maps.default.characterTokens.pc.state.actorContract.primary = true;
    const changed = actors.clone(a); changed.authored.attempt.spell.definitionHash = `authored-immediate:v1/${'0'.repeat(64)}`; await refused('actor_block_offer', { roomId: room.id, commandId: a.authored.attempt.approvalId, attack: changed }, 'authored_approval_mismatch');
    const zero = await admitted('damage', 0, 0, 0); await refused('actor_block_offer', { roomId: room.id, commandId: zero.authored.attempt.approvalId, attack: zero }, 'distinct_target_range_required');
  });
  it('Defending changed pending requires retained-face target revalidation; doubles and prevents wear', async() => {
    await declare(); const o = await offer(await admitted()), e = await approve(o, 2), id = uuid();
    token(target).state.conditions.push(profile.makeDefendingRecord(target, id, 'manual')); token(target).state.actorContract.revision++;
    await refused('actor_consequence', command(o, e), 'target_revalidation_required');
    const r = await ack(gm, 'actor_consequence', command(o, e, undefined, true)); assert.equal(r.success, true, JSON.stringify(r)); assert.equal(token(target).state.equipmentBlocking.pieces[0].currentDie, 'd8'); assert.equal(JSON.parse(r.receipt.adjudication.chosenResult).block.face, 2);
  });
  it('shield natural face2 never wears; broken/changed piece pending refuses without payment', async() => {
    await declare('shield'); const o = await offer(await admitted()), e = await approve(o, 2);
    token(target).character.equipment.offHand.id = 'replacement'; await refused('actor_consequence', commandWithoutWear(o, e), 'block_piece_unavailable'); token(target).character.equipment.offHand.id = 'shield';
    const r = await ack(gm, 'actor_consequence', command(o, e)); assert.equal(r.success, true, JSON.stringify(r)); assert.equal(token(target).state.equipmentBlocking.pieces[0].currentDie, 'd8');
  });
  function commandWithoutWear(o, e) { const original = token(target).character.equipment.offHand.id; token(target).character.equipment.offHand.id = 'shield'; const c = command(o, e); token(target).character.equipment.offHand.id = original; return c; }
  it('insufficient resources, revoked admission and recreated source/target install nothing', async() => {
    const o = await offer(await admitted()), e = await approve(o), c = command(o, e);
    token(source).state.currentMana = 0; token(source).state.tempMana = 0; await refused('actor_consequence', c, 'insufficient_resources'); token(source).state.currentMana = 8;
    const old = token(target).state.actorContract.instanceId; token(target).state.actorContract.instanceId = uuid(); await refused('actor_consequence', c, 'actor_binding_conflict'); room.gameState.maps.default.characterTokens.pc.state.actorContract.instanceId = old;
    const ref = token(source).state.actorContract.authoredAdmission.definitionRef; assert.equal((await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definitionRef: ref })).success, true); await refused('actor_consequence', c, 'approval_invalidated');
  });
  it('Stunned added during authority await refuses atomically and retains original faces', async() => {
    const o = await offer(await admitted()), e = await approve(o), c = command(o, e), original = server.authorityService.assertCurrent; let enter, release;
    const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { enter(); await gate; return original(...args); };
    const pending = ack(gm, 'actor_consequence', c); await entered; token(source).state.conditions.push(profile.makeStunnedRecord(source, uuid(), { sourceOccurrence: 'a5-await', timing: 'manual' })); const before = actors.clone(room.gameState); release(); assert.equal((await pending).code, 'actor_stunned'); assert.deepEqual(room.gameState, before); server.authorityService.assertCurrent = original;
    assert.deepEqual(blocks.get(room, e.approval.approvalId).approval, e.approval);
  });
  it('writer refusal leaves source, target, wear and pending approval unchanged', async() => {
    await declare(); const o = await offer(await admitted()), e = await approve(o, 1), c = command(o, e);
    room.isPermanent = true; room.persistentRoomId = uuid();
    await refused('actor_consequence', c, 'checkpoint_writer_unavailable');
    assert.deepEqual(blocks.get(room, e.approval.approvalId).approval, e.approval);
  });
  it('revocation and replaced GM cannot use a previously owner-approved offer', async() => {
    const o = await offer(await admitted()), e = await approve(o), c = command(o, e), old = room.gmId; room.gmId = 'replacement'; await refused('actor_consequence', c); room.gmId = old;
    const ref = token(source).state.actorContract.authoredAdmission.definitionRef;
    assert.equal((await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definitionRef: ref })).success, true);
    await refused('actor_consequence', c, 'definition_revoked');
  });
  it('same template source substitution and wrong owner/character refs cannot consume offers', async() => {
    const attack = await admitted(), o = await offer(attack), e = await approve(o), c = command(o, e);
    const original = actors.clone(token(source)); room.gameState.maps.default.tokens.sibling = { ...original, id: 'sibling', state: { ...original.state, actorContract: { ...original.state.actorContract, tokenId: 'sibling', instanceId: uuid() } } };
    const a = actors.clone(attack), sibling = actors.refFor(room.gameState.maps.default.tokens.sibling.state.actorContract); a.source = sibling; a.authored.attempt.source = sibling; a.authored.attempt.approvalId = uuid();
    await refused('actor_block_offer', { roomId: room.id, commandId: a.authored.attempt.approvalId, attack: a }, 'creature_admission_changed');
    const wrong = actors.clone(e.approval); wrong.approvalId = uuid(); wrong.target.characterId = 'wrong-character'; await refused('actor_block_approve', wrong, 'actor_binding_conflict', owner);
    const src = token(source).state.actorContract.instanceId; token(source).state.actorContract.instanceId = uuid(); await refused('actor_consequence', c, 'actor_binding_conflict'); room.gameState.maps.default.tokens.source.state.actorContract.instanceId = src;
  });
  it('healing caps exactly; new epoch refuses old unconsumed offer without renewing faces', async() => {
    const attack = await admitted('healing', 0, 0); attack.proposedDamage = 100; const o = await offer(attack), e = await approve(o);
    assert.equal((await ack(gm, 'actor_consequence', command(o, e))).success, true); assert.equal(token(target).character.health.current, 30);
    const next = await admitted('healing', 0, 0); next.authored.attempt.actionEpoch = 'retired-epoch';
    await refused('actor_block_offer', { roomId: room.id, commandId: next.authored.attempt.approvalId, attack: next }, 'outcome_unknown');
  });
  it('review R3: sibling AP payment and changed target accept explicit source+target retained revalidation together', async() => {
    const attack = await admitted('damage', 1, 0), first = await offer(attack), secondAttack = actors.clone(attack); secondAttack.authored.attempt.approvalId = uuid(); const second = await offer(secondAttack);
    const e1 = await approve(first); assert.equal((await ack(gm, 'actor_consequence', command(first, e1))).success, true);
    const e2 = await approve(second); await refused('actor_consequence', command(second, e2), 'target_revalidation_required');
    assert.equal(blocks.explainSourceChange(room, blocks.getOffer(room, second.commandId), second.attack, actors.locate(room, source)).ok, true);
    const r = await ack(gm, 'actor_consequence', command(second, e2, undefined, true)); assert.equal(r.success, true, JSON.stringify(r));
    assert.deepEqual(JSON.parse(r.receipt.adjudication.chosenResult).attack.roll.faces, [4]);
  });
  it('review R4: post-await offer refusal can positively close original bytes without renewal or reroll', async() => {
    const attack = await admitted(), commandId = attack.authored.attempt.approvalId, original = server.authorityService.assertCurrent; let enter, release;
    const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { enter(); await gate; return original(...args); };
    const pending = ack(gm, 'actor_block_offer', { roomId: room.id, commandId, attack }); await entered; token(target).state.actorContract.revision++; release(); assert.equal((await pending).code, 'stale_actor_revision'); server.authorityService.assertCurrent = original;
    assert.equal(blocks.getOffer(room, commandId), null);
    const before = actors.clone(room.gameState), data = { roomId: room.id, commandId, attack };
    assert.equal((await ack(gm, 'actor_block_decline', data)).success, true); assert.deepEqual(room.gameState, before);
    assert.equal((await ack(gm, 'actor_block_decline', data)).success, true, 'lost close ACK recovers same tombstone');
    await refused('actor_block_offer', { roomId: room.id, commandId, attack });
    const old = actors.clone(attack); old.authored.attempt.approvalId = uuid(); old.authored.attempt.actionEpoch = 'retired'; await refused('actor_block_decline', { roomId: room.id, commandId: old.authored.attempt.approvalId, attack: old }, 'outcome_unknown');
  });
  it('retains the existing authored50-face formula bound without widening manual P12B rolls', async() => {
    const o = await offer(await admitted('damage', 0, 0, 30, '50d6+2')), e = await approve(o), r = await ack(gm, 'actor_consequence', command(o, e)); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(JSON.parse(r.receipt.adjudication.chosenResult).attack.roll.faces.length, 50); assert.equal(token(target).character.health.current, 0);
    const manual = actors.clone(o.attack); delete manual.authored; manual.ability.id = 'manual'; assert.throws(() => blocks.validateAttack(manual), /invalid_block_offer/);
  });
});
