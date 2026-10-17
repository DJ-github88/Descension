/** P12A owner-approved basic weapon strike through the real registered stack
 * (frozen contract revision 3a §2.6; acceptance A1–A8 server side). */
const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const strikes = require('../services/strikeApprovals');
const payments = require('../services/spellPayments');

const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 5000);
  client.emit(event, payload, result => {clearTimeout(timer); resolve(result);});
});
const once = (client, event) => new Promise(resolve => client.once(event, resolve));
const FUMBLE = strikes.FIXED_TEXT['weapon-fumble'];
const CRITICAL = strikes.FIXED_TEXT['weapon-critical'];

describe('P12A owner-approved weapon strike (registered production stack)', function() {
  this.timeout(20000);
  let server, writer, gm, owner, other, gmUid, ownerUid, otherUid, room, pcRef, foeRef, clients, epoch;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start(); clients = [];
    for (const event of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_propose', 'actor_strike_approve', 'actor_strike_withdraw', 'actor_strike_decline', 'actor_strike_list', 'actor_spell_approve']) {
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
    server.players.get(owner.id).character = { id: 'ilse', class: 'Warrior' };
    server.setCharacterOwner('ilse', ownerUid);
    const pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'ilse', name: 'Ilse', class: 'Warrior', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 },
      actionPoints: { current: 2, max: 4 }, tempHealth: 0, tempMana: 0, tempActionPoints: 1 }, state: { conditions: [] } };
    const foe = { id: 'foe', creatureId: 'grimmstalk', stats: { maxHp: 250, maxMana: 30, maxAP: 5 },
      state: { currentHp: 30, tempHealth: 4, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0,
        conditions: [{ name: 'Bark Skin', type: 'buff', effects: { damageReduction: 3 } }] } };
    room.gameState.maps.default.characterTokens.pc = pc; room.gameState.maps.default.tokens.foe = foe;
    pcRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'ilse' }, snapshotHash: actors.hash(pc) })).ref;
    foeRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(foe) })).ref;
    assert.ok(pcRef && foeRef);
    epoch = (await ack(owner, 'actor_snapshot', { roomId: room.id })).actionEpoch;
  });
  afterEach(async() => {for (const client of clients) {client.disconnect();} await server.stop();});
  const live = () => server.rooms.get(room.id);
  const revision = ref => actors.locate(live(), ref).contract.revision;
  const drRecordId = () => actors.locate(live(), foeRef).token.state.conditions[0].recordId;
  const approval = (extra = {}) => ({ version: 1, roomId: room.id, approvalId: crypto.randomUUID(), actionEpoch: epoch, baseCommitSequence: actors.ledger(live()).commitSequence,
    source: pcRef, target: foeRef,
    weapon: { slot: 'mainHand', itemId: 'iron-sword', name: 'Iron Sword', weaponType: 'sword', typeSource: 'item', die: 8, damageType: 'slicing', attribute: 'strength', score: 14, modifier: 2 },
    roll: { mode: 'physical', faces: [6] },
    proficiency: { weaponType: 'sword', rank: 'TRAINED', rankSource: 'stored', die: 8, table: 'sword', roll: { mode: 'physical', faces: [5] } },
    price: { ap: 2 }, ...extra });
  const chosen = (approved, overrides = {}) => {
    const derived = strikes.derive(approved.weapon, approved.roll);
    const proficiency = overrides.proficiency || { kind: 'face', face: 7, text: 'Riposte Stance: Deal +2 bonus damage …', tier: 'Tactical Edge (+2 dmg)' };
    const automated = overrides.automated === undefined ? null : overrides.automated;
    let after = derived.proposed;
    if (automated?.kind === 'resistance' || automated?.kind === 'vulnerability') {after = strikes.afterTier(after, automated.kind, automated.percent);}
    if (automated?.kind === 'flatDr') {after = Math.max(0, after - automated.amount);}
    const notApplied = [];
    if (proficiency.kind === 'face') {notApplied.push({ source: 'proficiency-face', text: `Face ${proficiency.face} (${approved.proficiency.table})` });}
    if (proficiency.kind === 'deferred') {notApplied.push({ source: 'proficiency-deferred', text: strikes.FIXED_TEXT['proficiency-deferred'] });}
    if (derived.rollOutcome === 'critical') {notApplied.push({ source: 'weapon-critical', text: CRITICAL });}
    if (derived.rollOutcome === 'miss') {notApplied.push({ source: 'weapon-fumble', text: FUMBLE });}
    if (approved.weapon.slot === 'ranged') {notApplied.push({ source: 'ammunition', text: strikes.FIXED_TEXT.ammunition });}
    const manual = overrides.manual || [];
    return { capability: 'p12a-strike:v1', approvalId: approved.approvalId, gmConfirmed: true, names: { source: 'Ilse', target: 'Grimmstalk' },
      weapon: approved.weapon, roll: approved.roll, proficiencyRecord: approved.proficiency, rollOutcome: derived.rollOutcome, proposed: derived.proposed,
      proficiency, defense: { damageType: approved.weapon.damageType, automated, afterDefense: overrides.afterDefense ?? after, manual,
        ruling: overrides.ruling !== undefined ? overrides.ruling : (manual.length ? { verdict: 'not-applicable', note: '' } : null) },
      notApplied: overrides.notApplied || notApplied, ...(overrides.extra || {}) };
  };
  const gmCommand = async(approved, contentHash, overrides = {}) => {
    const record = chosen(approved, overrides);
    const final = overrides.finalAmount ?? record.defense.afterDefense;
    const pc = actors.locate(live(), pcRef).token, foe = actors.locate(live(), foeRef).token;
    const fromTemp = Math.min(foe.state.tempHealth, final);
    const snapshot = await ack(gm, 'actor_snapshot', { roomId: room.id });
    return { version: 1, roomId: room.id, commandId: crypto.randomUUID(), actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence,
      actors: overrides.entries || [
        { ref: pcRef, expectedRevision: revision(pcRef), finalResources: { ap: { current: pc.character.actionPoints.current - Math.max(0, 2 - pc.character.tempActionPoints), temp: Math.max(0, pc.character.tempActionPoints - 2) } } },
        { ref: foeRef, expectedRevision: revision(foeRef), finalResources: { hp: overrides.hp || { current: Math.max(0, foe.state.currentHp - (final - fromTemp)), temp: foe.state.tempHealth - fromTemp } } }],
      source: pcRef, target: foeRef, approval: { approvalId: approved.approvalId, contentHash },
      adjudication: { definitionId: overrides.definitionId || 'basic-weapon-strike', definitionVersionOrHash: overrides.definitionHash || 'p12a-strike:v1/basic-weapon-strike',
        chosenResult: overrides.raw ?? JSON.stringify(record), finalAmount: final, adjustmentReason: overrides.reason ?? '' } };
  };
  const register = async(approved = approval()) => {
    const result = await ack(owner, 'actor_strike_approve', approved);
    assert.equal(result.code, 'awaiting_gm', JSON.stringify(result));
    return { approved, contentHash: result.contentHash };
  };

  it('A2/A7/A8 hit: approval never spends; one GM command applies AP −2 temp-first and HP; retries return the receipt; a second command is refused', async() => {
    const pending = once(gm, 'actor_strike_pending');
    const { approved, contentHash } = await register();
    assert.equal((await pending).contentHash, contentHash);
    assert.deepEqual([live().gameState.maps.default.characterTokens.pc.character.actionPoints.current, live().gameState.maps.default.characterTokens.pc.character.tempActionPoints], [2, 1], 'approval reserves nothing');
    // Lone instance flat DR (3) automated: 6 + 2 = 8 → 5; GM adds the chosen face's +2 with a reason.
    const cmd = await gmCommand(approved, contentHash, { automated: { kind: 'flatDr', amount: 3, recordId: drRecordId() }, finalAmount: 7, reason: 'Face 7 +2 included' });
    const observer = once(other, 'actor_consequence_accepted');
    const accepted = await ack(gm, 'actor_consequence', cmd);
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    const pc = actors.locate(live(), pcRef).token, foe = actors.locate(live(), foeRef).token;
    assert.deepEqual([pc.character.actionPoints.current, pc.character.tempActionPoints], [1, 0]);
    assert.deepEqual([foe.state.currentHp, foe.state.tempHealth], [27, 0]);
    assert.equal(foe.state.conditions.length, 1, 'no condition changed');
    assert.deepEqual(accepted.receipt.authorization, { kind: 'owner-approval-gm', authorizerUid: gmUid, proposalId: approved.approvalId, approvalHash: contentHash });
    const record = JSON.parse((await observer).receipt.adjudication.chosenResult);
    assert.equal(record.proficiency.text.startsWith('Riposte Stance'), true);
    assert.deepEqual(record.notApplied, [{ source: 'proficiency-face', text: 'Face 7 (sword)' }]);
    assert.equal(JSON.stringify(accepted.receipt).includes('skillRanks'), false);
    assert.deepEqual((await ack(owner, 'actor_strike_approve', approved)).receipt, accepted.receipt, 'owner re-check recovers the receipt');
    assert.deepEqual((await ack(gm, 'actor_consequence', cmd)).receipt, accepted.receipt, 'GM re-check recovers the receipt');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { entries: cmd.actors }))).code, 'approval_consumed');
    assert.equal(strikes.get(live(), approved.approvalId), null);
  });
  it('A1 natural 1: AP −2, HP unchanged, fumble listed; any damage or missing fumble line is refused', async() => {
    const { approved, contentHash } = await register(approval({ roll: { mode: 'digital', faces: [1] } }));
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { finalAmount: 3, reason: 'GM wants damage' }))).code, 'miss_requires_zero');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { notApplied: [{ source: 'proficiency-face', text: 'Face 7 (sword)' }] }))).code, 'not_applied_mismatch');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { manual: ['ability'] }))).code, 'approval_mismatch');
    const accepted = await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { proficiency: { kind: 'none', reason: 'Fumble ruled' } }));
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    const foe = actors.locate(live(), foeRef).token;
    assert.deepEqual([foe.state.currentHp, foe.state.tempHealth], [30, 4]);
    assert.equal(accepted.receipt.actors[1].afterRevision, accepted.receipt.actors[1].beforeRevision + 1);
    assert.deepEqual(JSON.parse(accepted.receipt.adjudication.chosenResult).notApplied, [{ source: 'weapon-fumble', text: FUMBLE }]);
  });
  it('A3/A6 critical chain, tier arithmetic and flat DR verification', async() => {
    for (const faces of [[8], [3, 8], [8, 8], [1, 2]]) {
      assert.equal((await ack(owner, 'actor_strike_approve', approval({ roll: { mode: 'physical', faces } }))).code, 'invalid_strike_approval', JSON.stringify(faces));
    }
    const { approved, contentHash } = await register(approval({ roll: { mode: 'physical', faces: [8, 8, 3] } }));
    assert.equal(strikes.derive(approved.weapon, approved.roll).proposed, 19, 'critical: sum of faces; modifier [Open]');
    // Flat DR never automated against a critical (D-D open).
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { automated: { kind: 'flatDr', amount: 3, recordId: drRecordId() } }))).code, 'approval_mismatch');
    // Inconsistent arithmetic is refused; resistance 25 rounds down (19 → 14).
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { automated: { kind: 'resistance', percent: 25 }, afterDefense: 15 }))).code, 'approval_mismatch');
    assert.equal(strikes.afterTier(19, 'resistance', 25), 14);
    assert.equal(strikes.afterTier(19, 'vulnerability', 50), 29, 'increases round up');
    // GM-ruled items need exactly one verdict.
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { manual: ['library', 'ability'], ruling: null }))).code, 'defense_ruling_required');
    const missing = chosen(approved); missing.notApplied = [missing.notApplied[0]];
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { raw: JSON.stringify(missing) }))).code, 'not_applied_mismatch', 'the critical condition line is required');
    const accepted = await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { automated: { kind: 'resistance', percent: 25 }, manual: ['ability'],
      ruling: { verdict: 'not-applicable', note: '' }, proficiency: { kind: 'deferred' } }));
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.equal(accepted.receipt.adjudication.finalAmount, 14);
    const record = JSON.parse(accepted.receipt.adjudication.chosenResult);
    assert.deepEqual(record.notApplied.map(entry => entry.source), ['proficiency-deferred', 'weapon-critical']);
    assert.deepEqual(record.defense.manual, ['ability'], 'categories only, no creature prose');
  });
  it('A6 flat DR must be the lone non-zero DR condition the target actually holds', async() => {
    const { approved, contentHash } = await register();
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { automated: { kind: 'flatDr', amount: 5, recordId: drRecordId() } }))).code, 'approval_mismatch');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { automated: { kind: 'flatDr', amount: 3, recordId: 'nope' } }))).code, 'approval_mismatch');
    // A second DR condition makes flat DR GM-ruled.
    const foe = actors.locate(live(), foeRef).token;
    const record = { ...foe.state.conditions[0], id: 'second-dr', recordId: 'second-dr', name: 'Shell', originalName: 'Shell', kind: 'effect', effects: { damageReduction: 1 } };
    delete record.legacyRaw;
    const added = await ack(gm, 'actor_consequence', { version: 1, roomId: room.id, commandId: crypto.randomUUID(), actionEpoch: epoch, baseCommitSequence: actors.ledger(live()).commitSequence,
      actors: [{ ref: foeRef, expectedRevision: revision(foeRef), conditions: [{ op: 'add', recordId: 'second-dr', record }] }] });
    assert.equal(added.success, true, JSON.stringify(added));
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { automated: { kind: 'flatDr', amount: 3, recordId: drRecordId() } }))).code, 'approval_mismatch');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { finalAmount: 5 }))).code, 'adjustment_reason_required');
    const accepted = await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { manual: ['condition', 'condition'], ruling: { verdict: 'applied-in-final', note: 'DR 3 + 1' }, finalAmount: 4, reason: 'Both DR conditions applied' }));
    assert.equal(accepted.success, true, JSON.stringify(accepted));
  });
  it('A8 authority: only the owner registers, only the GM direct command consumes; strict schema and price', async() => {
    assert.equal((await ack(other, 'actor_strike_approve', approval())).code, 'forbidden');
    assert.equal((await ack(owner, 'actor_strike_approve', approval({ price: { ap: 1 } }))).code, 'invalid_strike_approval');
    assert.equal((await ack(owner, 'actor_strike_approve', approval({ target: pcRef }))).code, 'invalid_strike_approval');
    assert.equal((await ack(owner, 'actor_strike_approve', { ...approval(), extra: 1 })).code, 'invalid_strike_approval');
    const legacyRank = approval(); legacyRank.proficiency = { ...legacyRank.proficiency, rank: 'ADEPT' };
    assert.equal((await ack(owner, 'actor_strike_approve', legacyRank)).code, 'invalid_strike_approval', 'die must match the rank ladder');
    const pc = live().gameState.maps.default.characterTokens.pc;
    pc.character.actionPoints.current = 0; pc.character.tempActionPoints = 1;
    assert.equal((await ack(owner, 'actor_strike_approve', approval())).code, 'insufficient_resources');
    pc.character.actionPoints.current = 2;
    const { approved, contentHash } = await register();
    const cmd = await gmCommand(approved, contentHash);
    const before = JSON.stringify(live().gameState);
    assert.equal((await ack(owner, 'actor_consequence', cmd)).code, 'authorization_required');
    assert.equal((await ack(owner, 'actor_propose', cmd)).code, 'approval_requires_gm');
    assert.throws(() => actors.stage(live(), { isGM: true }, gmUid, cmd, { kind: 'controller-proposal-gm', authorizerUid: gmUid }, 0), /approval_requires_gm/);
    // Prefix dispatch cannot cross registries.
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { definitionHash: `p9-spell:v1/${'a'.repeat(64)}` }))).code, 'command_id_conflict', 'shared dispatch refuses cross-capability identity reuse');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { extra: { injected: true } }))).code, 'invalid_strike_adjudication');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approved, contentHash, { hp: { current: 0, temp: 0 } }))).code, 'approval_mismatch');
    assert.equal(JSON.stringify(live().gameState), before, 'refusals change nothing');
    // Stale revision → nothing spent.
    const stale = await gmCommand(approved, contentHash); stale.actors[1] = { ...stale.actors[1], expectedRevision: stale.actors[1].expectedRevision + 1 };
    assert.equal((await ack(gm, 'actor_consequence', stale)).code, 'stale_actor_revision');
    assert.equal((await ack(gm, 'actor_consequence', cmd)).success, true);
  });
  it('withdraw/decline are final; one pending strike per owner; runtime change: unknown unless a receipt exists', async() => {
    const first = await register();
    assert.equal((await ack(owner, 'actor_strike_approve', approval())).code, 'approval_pending');
    const closed = once(gm, 'actor_strike_closed');
    assert.equal((await ack(other, 'actor_strike_withdraw', { roomId: room.id, approvalId: first.approved.approvalId })).code, 'forbidden');
    assert.equal((await ack(owner, 'actor_strike_withdraw', { roomId: room.id, approvalId: first.approved.approvalId })).code, 'withdrawn');
    assert.equal((await closed).code, 'withdrawn');
    assert.equal((await ack(owner, 'actor_strike_approve', first.approved)).code, 'approval_withdrawn');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(first.approved, first.contentHash))).code, 'approval_withdrawn');
    const second = await register();
    assert.equal((await ack(owner, 'actor_strike_decline', { roomId: room.id, approvalId: second.approved.approvalId })).code, 'forbidden');
    const ownerClosed = once(owner, 'actor_strike_closed');
    assert.equal((await ack(gm, 'actor_strike_decline', { roomId: room.id, approvalId: second.approved.approvalId })).code, 'declined');
    assert.equal((await ownerClosed).code, 'declined');
    const third = await register();
    assert.equal((await ack(gm, 'actor_strike_list', { roomId: room.id })).pending.length, 1);
    assert.equal((await ack(owner, 'actor_strike_list', { roomId: room.id })).pending[0].own, true);
    assert.equal((await ack(other, 'actor_strike_list', { roomId: room.id })).pending.length, 0);
    const accepted = await ack(gm, 'actor_consequence', await gmCommand(third.approved, third.contentHash));
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    live().gameState.maps.default.characterTokens.pc.character.actionPoints.current = 4;
    const fourth = await register();
    // Runtime change: a new room object is a new epoch and empty registries.
    server.rooms.set(room.id, { ...live(), gameState: actors.clone(live().gameState) });
    assert.deepEqual((await ack(owner, 'actor_strike_approve', third.approved)).receipt, accepted.receipt, 'explicit check recovers the existing receipt after the runtime change');
    const before = JSON.stringify(live().gameState);
    assert.equal((await ack(owner, 'actor_strike_approve', fourth.approved)).code, 'outcome_unknown', 'never re-registered');
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(fourth.approved, fourth.contentHash))).code, 'outcome_unknown');
    assert.equal(JSON.stringify(live().gameState), before);
    assert.equal(payments.get(live(), fourth.approved.approvalId), null);
  });
  it('server constants match the frozen contract', () => {
    assert.equal(strikes.STRIKE_AP, 2);
    assert.deepEqual(strikes.RANK_DIE, { UNTRAINED: 4, NOVICE: 6, TRAINED: 8, APPRENTICE: 10, ADEPT: 12, EXPERT: 20, MASTER: 20 });
    assert.equal(strikes.DAMAGE_TYPES.length, 11);
    assert.equal(strikes.validChain(8, [8, 8, 3]), true); assert.equal(strikes.validChain(8, [8]), false); assert.equal(strikes.validChain(8, [1]), true);
    assert.equal(strikes.validChain(2, Array(20).fill(2)), true); assert.equal(strikes.validChain(8, [1, 3]), false);
  });
  it('interruption diagnostics: malformed retries fail P7 first; valid consumed retries never pay again', async() => {
    const { approved, contentHash } = await register(), cmd = await gmCommand(approved, contentHash);
    const accepted = await ack(gm, 'actor_consequence', cmd); assert.equal(accepted.success, true);
    const before = JSON.stringify(live().gameState), count = actors.ledger(live()).receipts.length;
    const malformed = await gmCommand(approved, contentHash); // fixture has only 1 AP after acceptance
    assert.equal(malformed.actors[0].finalResources.ap.current, -1);
    assert.equal((await ack(gm, 'actor_consequence', malformed)).code, 'invalid_resources', 'P7 rejects a negative pool before binder dispatch');
    assert.equal((await ack(gm, 'actor_consequence', { ...cmd, commandId: crypto.randomUUID() })).code, 'approval_consumed');
    const badDefinition = { ...cmd, commandId: crypto.randomUUID(), adjudication: { ...cmd.adjudication, definitionVersionOrHash: { forged: true } } };
    assert.equal((await ack(gm, 'actor_consequence', badDefinition)).code, 'invalid_consequence', 'P7 adjudication primitive schema is earlier than capability binding');
    assert.equal((await ack(owner, 'actor_strike_approve', approval())).code, 'insufficient_resources', 'a different strike cannot afford a spent fixture');
    assert.deepEqual((await ack(owner, 'actor_strike_approve', approved)).receipt, accepted.receipt, 'known receipt recovered before affordability');
    assert.deepEqual((await ack(gm, 'actor_consequence', cmd)).receipt, accepted.receipt);
    assert.equal(actors.ledger(live()).receipts.length, count); assert.equal(JSON.stringify(live().gameState), before);
  });
  it('strict UUID/rank types and reserved closed-ID capacity', async() => {
    const arrayId = approval(); arrayId.approvalId = [arrayId.approvalId];
    assert.equal((await ack(owner, 'actor_strike_approve', arrayId)).code, 'invalid_strike_approval');
    const arrayRank = approval(); arrayRank.proficiency.rank = ['TRAINED'];
    assert.equal((await ack(owner, 'actor_strike_approve', arrayRank)).code, 'invalid_strike_approval');
    for (let i = 0; i < 4095; i++) {strikes.close(live(), `closed-${i}`, 'withdrawn');}
    const last = await register();
    const different = approval(); different.source = { ...different.source, characterId: 'different-character' };
    assert.throws(() => strikes.add(live(), { approval: different, contentHash: actors.hash(different), ownerUid }), /approval_capacity/);
    assert.equal((await ack(owner, 'actor_strike_withdraw', { roomId: room.id, approvalId: last.approved.approvalId })).success, true);
    assert.equal((await ack(owner, 'actor_strike_approve', approval())).code, 'approval_capacity');
  });
  it('duplicate/conflicting registration across the authority await preserves one exact approval', async() => {
    const original = server.authorityService.assertCurrent.bind(server.authorityService);
    let release, entered, held = false;
    const waiting = new Promise(resolve => {entered = resolve;});
    server.authorityService.assertCurrent = async(...args) => { if (!held && new Error().stack.includes('actorConsequenceHandlers.js')) {held = true; entered(); await new Promise(resolve => {release = resolve;});} return original(...args); };
    const approved = approval(), conflict = { ...approved, roll: { mode: 'physical', faces: [5] } };
    const a = ack(owner, 'actor_strike_approve', approved); await waiting;
    const b = await ack(owner, 'actor_strike_approve', conflict); assert.equal(b.code, 'awaiting_gm');
    release(); assert.equal((await a).code, 'command_id_conflict');
    server.authorityService.assertCurrent = original;
    assert.equal((await ack(owner, 'actor_strike_approve', conflict)).code, 'awaiting_gm');
    assert.equal(strikes.listAll(live()).length, 1);
  });
  it('revoked GM authority after the async boundary cannot publish AP/HP', async() => {
    const { approved, contentHash } = await register(), cmd = await gmCommand(approved, contentHash);
    const original = server.authorityService.assertCurrent.bind(server.authorityService);
    let release, entered; const waiting = new Promise(resolve => {entered = resolve;});
    server.authorityService.assertCurrent = async(...args) => { if (new Error().stack.includes('actorConsequenceHandlers.js')) {entered(); await new Promise(resolve => {release = resolve;});} return original(...args); };
    const request = ack(gm, 'actor_consequence', cmd); await waiting;
    const before = JSON.stringify(live().gameState); server.players.get(gm.id).isGM = false; release();
    assert.equal((await request).success, false); assert.equal(JSON.stringify(live().gameState), before);
    server.players.get(gm.id).isGM = true; server.authorityService.assertCurrent = original;
    assert.equal((await ack(gm, 'actor_consequence', cmd)).success, true);
  });
  it('deleted, moved and retired targets cannot spend; owner departure prevents acceptance', async() => {
    const { approved, contentHash } = await register(), cmd = await gmCommand(approved, contentHash), map = live().gameState.maps.default;
    const foe = map.tokens.foe, beforeAP = actors.clone(map.characterTokens.pc.character);
    delete map.tokens.foe; assert.equal((await ack(gm, 'actor_consequence', cmd)).success, false); map.tokens.foe = foe;
    foe.state.actorContract.instanceId = 'new-incarnation'; assert.equal((await ack(gm, 'actor_consequence', cmd)).code, 'actor_binding_conflict'); foe.state.actorContract.instanceId = foeRef.instanceId;
    const member = server.players.get(owner.id); live().players.delete(member.id);
    assert.equal((await ack(gm, 'actor_consequence', cmd)).code, 'owner_unavailable'); live().players.set(member.id, member);
    assert.deepEqual(map.characterTokens.pc.character, beforeAP); assert.equal(actors.ledger(live()).receipts.length, 0);
  });
  it('P9 and strike registries cannot consume a shared approval ID, in either registration order', async() => {
    const first = await register(), id = first.approved.approvalId;
    const p9 = { version: 1, roomId: room.id, approvalId: id, actionEpoch: epoch, baseCommitSequence: actors.ledger(live()).commitSequence, source: pcRef, target: foeRef,
      spell: { definitionId: 'test-spell', definitionHash: `p9-spell:v1/${'a'.repeat(64)}`, name: 'Test', kind: 'damage', damageTypes: ['arcane'] },
      roll: { mode: 'physical', dice: [{ sides: 8, faces: [6] }], constant: 0, total: 6, reading: '1d8' }, price: { ap: 1, mana: 0 }, classPayment: null };
    const p9Result = await ack(owner, 'actor_spell_approve', p9); assert.equal(p9Result.code, 'awaiting_gm', JSON.stringify(p9Result));
    const strikeCmd = await gmCommand(first.approved, first.contentHash);
    assert.equal((await ack(gm, 'actor_consequence', strikeCmd)).code, 'command_id_conflict');
    const p9Cmd = { ...strikeCmd, commandId: crypto.randomUUID(), approval: { approvalId: id, contentHash: p9Result.contentHash }, adjudication: { ...strikeCmd.adjudication, definitionVersionOrHash: p9.spell.definitionHash } };
    assert.equal((await ack(gm, 'actor_consequence', p9Cmd)).code, 'command_id_conflict');
    const second = approval({ approvalId: crypto.randomUUID() });
    const p9Other = { ...p9, approvalId: second.approvalId };
    // Clear P9 pending through its own registry only; strike entry must survive.
    payments.close(live(), id, 'withdrawn');
    assert.ok(strikes.get(live(), id));
    assert.equal((await ack(owner, 'actor_spell_approve', p9Other)).code, 'awaiting_gm');
    assert.equal((await ack(owner, 'actor_strike_approve', second)).code, 'command_id_conflict');
    assert.equal(actors.ledger(live()).receipts.length, 0);
  });
});
