const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences'), installed = require('../services/installedAuthoredAbilities');
const payments = require('../services/spellPayments'), pure = require('../shared/services/authoredAbility');
const cooldown = require('../shared/services/authoredCooldown');
const ack = (s, event, data) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(event)), 5000); s.emit(event, data, r => { clearTimeout(t); resolve(r); }); });
const once = (s, event) => new Promise(resolve => s.once(event, resolve));
describe('Wizard cooldown: registered authenticated production handlers', function() {
  this.timeout(20000);
  let server, room, gm, owner, pc, foe, writer;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_consequence', 'actor_spell_approve', 'actor_authored_admit', 'actor_turn_boundary', 'actor_snapshot']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    const gu = server.nextUserId(), uid = server.nextUserId(); server.registerAuthToken('gm', gu); server.registerAuthToken('owner', uid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gu });
    owner = server.connect({ token: 'owner' }); await once(owner, 'connect'); const joined = once(owner, 'room_joined'); owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' }); await joined;
    server.setCharacterOwner('c', uid);
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', stats: { maxHp: 100, maxMana: 0, maxAP: 4 }, state: { currentHp: 70, currentMana: 0, currentActionPoints: 4, tempHealth: 2, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', ownerUserId: uid, character: { id: 'c', class: 'Arcanoneer', stats: { intelligence: 18 }, health: { current: 23, max: 40 }, mana: { current: 40, max: 40 }, actionPoints: { current: 20, max: 20 }, tempHealth: 9, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: uid, characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
    assert.equal((await ack(gm, 'combat_started', { roomId: room.id, currentTurnIndex: 0, round: 1, turnOrder: [pc, foe].map(ref => ({ tokenId: ref.tokenId, actorRef: ref })) })).success, true);
    assert.equal((await boundary('adopt')).success, true);
  });
  afterEach(async() => { gm?.disconnect(); owner?.disconnect(); await server?.stop(); });
  const token = ref => actors.locate(room, ref).token;
  const records = () => token(pc).state.authoredCooldowns || {};
  function record(n = 2, id = uuid(), kind = 'damage', formula = '1d6 + intelligence/3') {
    const d = { name: 'Wizard cooldown measure', description: 'One direct effect.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' }, effectTypes: [kind],
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 3 },
      cooldownConfig: { cooldownType: cooldown.TYPE, cooldownValue: n },
      [`${kind}Config`]: kind === 'damage' ? { damageType: 'direct', elementType: 'arcane', formula, resolution: 'DICE' } : { healingType: 'direct', formula, resolution: 'DICE' } };
    return Object.assign({}, actors.clone(d), { authoredDefinitionId: id, authoredDraft: actors.clone(d) });
  }
  async function admit(r = record(), version = 1) {
    const result = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, record: r, definitionVersion: version, classId: 'arcanoneer' });
    assert.equal(result.success, true, JSON.stringify(result));
    return installed.list(room).entries.find(e => e.definitionRef.definitionId === r.authoredDefinitionId && e.definitionRef.definitionVersion === version);
  }
  function approval(e) {
    const d = e.canonicalDefinition, rollAttributes = { intelligence: 18 }, reading = pure.readScaledFormula(d.effect.formula, rollAttributes);
    const projected = require('../services/roomAccessService').projectTokenForClient(token(pc));
    const dice = reading.dice.map(g => ({ sides: g.sides, faces: Array(g.count).fill(3) }));
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target: foe,
      spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.FORMULA_CAPABILITY}/${e.definitionRef.definitionHash}`, name: d.name, kind: d.effect.kind, damageTypes: d.effect.damageTypes || [] },
      roll: { mode: 'physical', dice, constant: reading.constant, reading: reading.reading, total: reading.constant + dice.reduce((s, g) => s + g.faces.reduce((a, b) => a + b, 0), 0) },
      rollAttributes, formulaSourceRevision: token(pc).state.actorContract.revision, formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }), price: e.descriptor.price, classPayment: null };
  }
  async function approve(a) { const r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return r.contentHash; }
  function command(a, contentHash) {
    const source = actors.resources(token(pc), 'character'), target = actors.resources(token(foe), 'creature'), amount = a.roll.total;
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target: foe, approval: { approvalId: a.approvalId, contentHash },
      actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { ap: payments.tempFirst(source.ap.current, source.ap.temp, 1), mana: payments.tempFirst(source.mana.current, source.mana.temp, 3) } },
        { ref: foe, expectedRevision: token(foe).state.actorContract.revision, finalResources: { hp: a.spell.kind === 'healing' ? { current: Math.min(target.hp.max, target.hp.current + amount), temp: target.hp.temp } : { current: Math.max(0, target.hp.current - Math.max(0, amount - target.hp.temp)), temp: Math.max(0, target.hp.temp - amount) } } }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, chosenResult: JSON.stringify({ capability: pure.FORMULA_CAPABILITY, approvalId: a.approvalId, kind: a.spell.kind, roll: a.roll, gmConfirmed: true }), finalAmount: amount, adjustmentReason: '' } };
  }
  function boundary(mode = 'advance', socket = gm) {
    const combat = room.gameState.combat;
    return ack(socket, 'actor_turn_boundary', { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, mode,
      combatHash: actors.hash(combat), expectedClock: mode === 'adopt' ? null : { id: combat.effectLifecycle.id, sequence: combat.effectLifecycle.sequence } });
  }
  async function unchanged(event, who, value, code) {
    const before = structuredClone(room.gameState), r = await ack(who, event, value);
    assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(room.gameState, before); return r;
  }
  async function cast(e) { const a = approval(e), c = command(a, await approve(a)), result = await ack(gm, 'actor_consequence', c); assert.equal(result.success, true, JSON.stringify(result)); return { a, c, result }; }
  it('exact N=2 start/release; intermediate turns and blocked reuse spend nothing; second cast succeeds', async() => {
    const e = await admit(), before = actors.clone(room.gameState.maps), a = approval(e), h = await approve(a); assert.deepEqual(room.gameState.maps, before);
    const c = command(a, h); assert.equal((await ack(gm, 'actor_consequence', c)).success, true);
    assert.deepEqual(Object.values(records()).map(r => [r.startSequence, r.dueSequence, r.occurrences, r.period]), [[0, 4, 2, 2]]);
    assert.deepEqual([token(pc).character.mana.current, token(pc).character.tempMana, token(foe).state.currentHp, token(foe).state.tempHealth], [39, 0, 63, 0]);
    for (let seq = 0; seq < 4; seq++) {
      const state = cooldown.status(token(pc), room.gameState.combat, pc, e.definitionRef.definitionId);
      assert.equal(state.remaining, seq < 2 ? 2 : 1); assert.match(state.label, /boundary 4/);
      await unchanged('actor_spell_approve', owner, approval(e), 'ability_on_cooldown');
      assert.equal((await boundary()).success, true);
    }
    assert.deepEqual(records(), {}); await cast(e); assert.equal(Object.values(records())[0].dueSequence, 8);
  });
  it('off-turn cast N=1 counts strictly next source start; healing uses the same atomic path', async() => {
    const e = await admit(record(1, uuid(), 'healing')); assert.equal((await boundary()).success, true); await cast(e);
    assert.equal(Object.values(records())[0].dueSequence, 2); assert.equal(token(foe).state.currentHp, 79);
    assert.equal((await boundary()).success, true); assert.deepEqual(records(), {});
  });
  it('simultaneous pending approvals preserve existing one-pending gate; concurrent confirmations and lost ACK replay execute once', async() => {
    const e = await admit(), a = approval(e), b = approval(e), before = actors.clone(room.gameState.maps);
    const results = await Promise.all([ack(owner, 'actor_spell_approve', a), ack(owner, 'actor_spell_approve', b)]);
    assert.deepEqual(results.map(r => r.code).sort(), ['approval_pending', 'awaiting_gm']); assert.deepEqual(room.gameState.maps, before);
    const winner = results[0].code === 'awaiting_gm' ? a : b, h = results.find(r => r.code === 'awaiting_gm').contentHash, c = command(winner, h), other = { ...c, commandId: uuid() };
    const confirmations = await Promise.all([ack(gm, 'actor_consequence', c), ack(gm, 'actor_consequence', other)]);
    assert.equal(confirmations.filter(r => r.success).length, 1); assert.equal(confirmations.find(r => !r.success).code, 'approval_consumed');
    const accepted = confirmations[0].success ? c : other, receipt = confirmations.find(r => r.success).receipt, after = actors.clone(room.gameState);
    assert.deepEqual((await ack(gm, 'actor_consequence', accepted)).receipt, receipt); assert.deepEqual(room.gameState, after); assert.equal(Object.keys(records()).length, 1);
    await unchanged('actor_consequence', gm, { ...accepted, adjudication: { ...accepted.adjudication, finalAmount: 1 } }, 'command_id_conflict');
  });
  it('writer failure starts nothing; same command retries; release writer failure leaves clock and cooldown untouched', async() => {
    const e = await admit(), a = approval(e), c = command(a, await approve(a)); room.isPermanent = true;
    const original = writer.admitConsequence; writer.admitConsequence = () => ({ queued: false, code: 'cooldown_writer_refusal' });
    await unchanged('actor_consequence', gm, c, 'cooldown_writer_refusal'); assert.deepEqual(records(), {});
    writer.admitConsequence = original; assert.equal((await ack(gm, 'actor_consequence', c)).success, true);
    for (let i = 0; i < 3; i++) assert.equal((await boundary()).success, true);
    writer.admitConsequence = () => ({ queued: false, code: 'cooldown_writer_refusal' }); const before = actors.clone(room.gameState);
    assert.equal((await boundary()).code, 'cooldown_writer_refusal'); assert.deepEqual(room.gameState, before);
    writer.admitConsequence = original; assert.equal((await boundary()).success, true); assert.deepEqual(records(), {});
  });
  it('checkpoint/reconnect preserves availability and original command recovery without replaying time', async() => {
    const e = await admit(), { c, result } = await cast(e), checkpoint = require('../services/roomCheckpoint');
    const built = checkpoint.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const decoded = checkpoint.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    room = { ...room, gameState: { ...decoded.global, maps: decoded.maps, ...checkpoint.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, room);
    owner.disconnect(); owner = server.connect({ token: 'owner' }); await once(owner, 'connect');
    const joined = once(owner, 'room_joined'); owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' }); await joined;
    const snapshot = await ack(owner, 'actor_snapshot', { roomId: room.id }); assert.deepEqual(snapshot.maps.default.characterTokens.pc.state.authoredCooldowns, records());
    await unchanged('actor_spell_approve', owner, approval(e), 'ability_on_cooldown');
    const before = actors.clone(room.gameState); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, result.receipt); assert.deepEqual(room.gameState, before);
  });
  it('copies and updated versions share identity, including a later version without cooldown; distinct definitions are distinct', async() => {
    const r = record(), e = await admit(r), v2 = await admit(r, 2), other = await admit(record());
    const removed = actors.clone(r); delete removed.cooldownConfig; delete removed.authoredDraft.cooldownConfig; const v3 = await admit(removed, 3);
    await cast(e);
    for (const version of [e, v2, v3]) await unchanged('actor_spell_approve', owner, approval(version), 'ability_on_cooldown');
    await cast(other); assert.equal(Object.keys(records()).length, 2);
  });
  it('stale/replaced source, revoked definition, missing clock and unbound roster fail without cooldown/payment', async() => {
    const e = await admit(), a = approval(e), c = command(a, await approve(a)); token(pc).character.stats.intelligence++;
    await unchanged('actor_consequence', gm, c, 'owner_reapproval_required'); assert.deepEqual(records(), {});
    const fresh = approval(e), h = await approve(fresh), replaced = command(fresh, h); token(pc).state.actorContract.instanceId = uuid();
    await unchanged('actor_consequence', gm, replaced, 'actor_binding_conflict');
  });
  it('combat end/restart/re-adoption never resets an active cooldown; released cooldown remains ready after retirement', async() => {
    const e = await admit(); await cast(e); const retained = actors.clone(records());
    assert.equal((await ack(gm, 'combat_ended', { roomId: room.id })).success, true); await unchanged('actor_spell_approve', owner, approval(e), 'cooldown_clock_retired'); assert.deepEqual(records(), retained);
    assert.equal((await ack(gm, 'combat_started', { roomId: room.id, currentTurnIndex: 0, round: 1, turnOrder: [pc, foe].map(ref => ({ tokenId: ref.tokenId, actorRef: ref })) })).success, true);
    assert.equal((await boundary('adopt')).success, true); for (let i = 0; i < 6; i++) assert.equal((await boundary()).success, true);
    await unchanged('actor_spell_approve', owner, approval(e), 'cooldown_clock_retired'); assert.deepEqual(records(), retained);
  });
  it('metadata cannot be forged through legacy updates or imported as authority; legacy timing is not translated', async() => {
    assert.equal(actors.protectedPath({ state: { authoredCooldowns: {} } }), 'state.authoredCooldowns');
    assert.equal(actors.authorityMetadataPath({ state: { authoredCooldowns: {} } }), 'state.authoredCooldowns');
    const imported = { maps: { x: { characterTokens: { p: { state: { authoredCooldowns: { forged: {} } } } } } } }; actors.preserveImportedActorMetadata(imported);
    assert.equal(imported.maps.x.characterTokens.p.state.authoredCooldowns, undefined); assert.deepEqual(imported.maps.x.characterTokens.p.state.actorRecovery.importedAuthoredCooldowns, { forged: {} });
    for (const type of ['turn_based', 'rounds', 'short_rest', 'charge_based']) { const r = record(); r.cooldownConfig.cooldownType = r.authoredDraft.cooldownConfig.cooldownType = type; assert.equal(pure.definitionFromWizard(r, { roomId: room.id, classId: 'arcanoneer', definitionVersion: 1 }).ok, false); }
  });
  it('fresh-runtime checkpoint cooldown blocks even when the old owner approval registry is gone', async() => {
    const e = await admit(), { a, c, result } = await cast(e), checkpoint = require('../services/roomCheckpoint');
    const built = checkpoint.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const decoded = checkpoint.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    room = { ...room, gameState: { ...decoded.global, maps: decoded.maps, ...checkpoint.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, room);
    assert.equal(payments.get(room, a.approvalId), null);
    await unchanged('actor_spell_approve', owner, approval(e), 'ability_on_cooldown'); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, result.receipt);
    for (let i = 0; i < 4; i++) assert.equal((await boundary()).success, true); assert.deepEqual(records(), {}); await cast(e);
  });
  it('missing clock, changed roster and revoked source definition refuse; no new availability anchor', async() => {
    const e = await admit(), combat = actors.clone(room.gameState.combat); delete room.gameState.combat.effectLifecycle;
    await unchanged('actor_spell_approve', owner, approval(e), 'cooldown_clock_required'); room.gameState.combat = combat;
    room.gameState.combat.turnOrder.reverse(); await unchanged('actor_spell_approve', owner, approval(e), 'cooldown_clock_required'); room.gameState.combat = actors.clone(combat); room.gameState.combat.turnOrder.reverse();
    const a = approval(e), h = await approve(a);
    const revoked = await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definitionRef: e.definitionRef }); assert.equal(revoked.success, true);
    await unchanged('actor_consequence', gm, command(a, h), 'definition_revoked'); assert.deepEqual(records(), {});
  });
  it('authority-await drift and racing identical release commands cannot charge or count twice', async() => {
    const e = await admit(), a = approval(e), c = command(a, await approve(a));
    const original = server.authorityService.assertCurrent; let release, entered, hold = true;
    const gate = new Promise(r => { release = r; }), reached = new Promise(r => { entered = r; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; entered(); await gate; } return original(...args); };
    const pending = ack(gm, 'actor_consequence', c); await reached; room.gameState.combat.round++; const before = actors.clone(room.gameState); release();
    assert.equal((await pending).code, 'cooldown_clock_required'); assert.deepEqual(room.gameState, before); assert.deepEqual(records(), {});
    server.authorityService.assertCurrent = original; room.gameState.combat.round--; await ack(gm, 'actor_consequence', c);
    for (let i = 0; i < 3; i++) await boundary();
    const combat = room.gameState.combat, request = { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, mode: 'advance', combatHash: actors.hash(combat), expectedClock: { id: combat.effectLifecycle.id, sequence: combat.effectLifecycle.sequence } };
    let both, releaseBoth, count = 0; const bothEntered = new Promise(r => { both = r; }), bothGate = new Promise(r => { releaseBoth = r; });
    server.authorityService.assertCurrent = async(...args) => { if (++count === 2) both(); await bothGate; return original(...args); };
    const first = ack(gm, 'actor_turn_boundary', request), second = ack(gm, 'actor_turn_boundary', request); await bothEntered; releaseBoth();
    const results = await Promise.all([first, second]); assert.equal(results[0].success, true); assert.deepEqual(results[0].receipt, results[1].receipt);
    assert.equal(room.gameState.combat.effectLifecycle.sequence, 4); assert.deepEqual(records(), {}); server.authorityService.assertCurrent = original;
  });
});
