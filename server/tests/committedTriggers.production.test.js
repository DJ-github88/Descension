/** Shared trigger foundation v1 (diagnostic) — registered production handlers, real writer admission and checkpoint codec.
 * Contract: handoff/shared-trigger-foundation/CONTRACT.md. Nothing here is a playable trigger. */
const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const triggers = require('../services/committedTriggers');
const access = require('../services/roomAccessService');
const pure = require('../../vtt-react/src/services/authoredAbility');
const uuid = () => crypto.randomUUID();
const ack = (s, event, data) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(event)), 5000); s.emit(event, data, r => { clearTimeout(t); resolve(r); }); });
const once = (s, event) => new Promise(resolve => s.once(event, resolve));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Disposable Wizard-shaped records; different names prove nothing is keyed to a spell name.
function record(kind = 'damage', name = 'Ink Lance', ap = 1, mana = 3, range = 30) {
  const d = { name, description: 'Disposable trigger-foundation fixture.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' }, effectTypes: [kind],
    targetingMode: 'unified', targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, maxTargets: 1, targetRestrictions: ['any'] },
    resourceCost: { actionPoints: ap, resourceTypes: ['mana'], resourceValues: { mana } },
    [kind === 'damage' ? 'damageConfig' : 'healingConfig']: kind === 'damage' ? { damageType: 'direct', elementType: 'arcane', formula: '1d6+2', resolution: 'DICE' } : { healingType: 'direct', formula: '1d8+1', resolution: 'DICE' } };
  return { ...actors.clone(d), authoredDefinitionId: uuid(), authoredDraft: actors.clone(d) };
}

describe('Shared trigger foundation v1 — diagnostic committed-occurrence obligations (production handlers)', function() {
  this.timeout(20000);
  let server, room, gm, owner, observer, pc, foe, uid, observerUid, writer, damage, heal;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_propose', 'actor_authored_admit', 'actor_authored_revoke',
      'actor_trigger_list', 'actor_trigger_register', 'actor_trigger_revoke', 'actor_trigger_dismiss']) {server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });}
    const gmUid = server.nextUserId(); uid = server.nextUserId(); observerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', uid); server.registerAuthToken('observer', observerUid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) {
      const s = server.connect({ token: role }); await once(s, 'connect'); const joined = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await joined;
      if (role === 'owner') {owner = s;} else {observer = s;}
    }
    server.setCharacterOwner('c', uid);
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', stats: { maxHp: 30, maxMana: 0, maxAP: 4 }, state: { currentHp: 20, currentMana: 0, currentActionPoints: 4, tempHealth: 0, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', ownerUserId: uid, character: { id: 'c', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 30, max: 30 }, actionPoints: { current: 20, max: 20 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: uid, characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
    assert.ok(pc && foe);
    damage = await admit(record()); heal = await admit(record('healing', 'Quiet Mending', 1, 2, 0));
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const stored = () => live().gameState.triggerLedger;
  const open = () => Object.values(stored()?.obligations || {});
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence });
  async function admit(r, version = 1) {
    const result = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record: r, definitionVersion: version, classId: 'arcanoneer' });
    assert.equal(result.success, true, JSON.stringify(result)); return { r, ref: result.definitionRef };
  }
  function approval(def, target = foe, face = 4) {
    const e = installed.list(live()).entries.find(x => pure.actionId(x.definitionRef) === pure.actionId(def.ref));
    const roll = pure.readFormula(e.canonicalDefinition.effect.formula);
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence,
      source: pc, target, spell: { definitionId: pure.actionId(def.ref), definitionHash: `${pure.CAPABILITY}/${def.ref.definitionHash}`, name: e.canonicalDefinition.name, kind: e.descriptor.effect.kind, damageTypes: e.descriptor.effect.damageTypes },
      roll: { mode: 'physical', dice: [{ sides: roll.dice[0].sides, faces: [face] }], constant: roll.constant, total: face + roll.constant, reading: roll.reading }, price: e.descriptor.price, classPayment: null };
  }
  const approve = async a => { const r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return r.contentHash; };
  function command(a, contentHash, amount = a.roll.total) {
    const source = actors.resources(token(pc), 'character'), target = actors.resources(token(a.target), a.target.kind), pay = {};
    for (const p of ['ap', 'mana']) {if (a.price[p]) { const used = Math.min(source[p].temp, a.price[p]); pay[p] = { current: source[p].current - a.price[p] + used, temp: source[p].temp - used }; }}
    const hp = a.spell.kind === 'damage' ? { current: Math.max(0, target.hp.current - Math.max(0, amount - target.hp.temp)), temp: Math.max(0, target.hp.temp - amount) } : { current: Math.min(target.hp.max, target.hp.current + amount), temp: target.hp.temp };
    const self = actors.hash(pc) === actors.hash(a.target);
    return { ...base(), source: pc, target: a.target, approval: { approvalId: a.approvalId, contentHash },
      actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: self ? { ...pay, hp } : pay }, ...self ? [] : [{ ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, finalResources: { hp } }]],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, chosenResult: JSON.stringify({ capability: pure.CAPABILITY, approvalId: a.approvalId, kind: a.spell.kind, roll: a.roll, gmConfirmed: true, ...(self && a.spell.kind === 'healing' ? { actualHealing: hp.current - target.hp.current } : {}) }), finalAmount: amount, adjustmentReason: amount === a.roll.total ? '' : 'GM mitigation' } };
  }
  /** One accepted cast through owner approval and GM confirmation. Returns the command, approval and result. */
  async function cast(def, { target = foe, amount, face } = {}) {
    const a = approval(def, target, face), c = command(a, await approve(a), amount), r = await ack(gm, 'actor_consequence', c);
    assert.equal(r.success, true, JSON.stringify(r)); return { a, c, r };
  }
  const listen = (on, def = heal, source = pc, socket = gm) => ack(socket, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: stored()?.revision || 0, source, definitionRef: def.ref, on });
  async function listener(on, def = heal, source = pc) { const r = await listen(on, def, source); assert.equal(r.success, true, JSON.stringify(r)); return r.listener; }
  const dismissal = (obligationId, reason = 'PRIVATE-GM-REASON resolved at the table') => ({ ...base(), obligationId, reason });
  const list = socket => ack(socket, 'actor_trigger_list', { roomId: room.id });
  async function refused(socket, event, data, code) { const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(live().gameState, before); return r; }
  function rebuild(gameState = live().gameState) {
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true, JSON.stringify(decoded));
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
  }
  const hpLost = { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' };

  it('a room with no listener is unchanged: an accepted cast creates no ledger key at all', async() => {
    await cast(damage);
    assert.equal(Object.prototype.hasOwnProperty.call(live().gameState, 'triggerLedger'), false);
    assert.deepEqual((await list(gm)).obligations, []);
  });

  it('only an accepted consequence is an occurrence: approval, proposal and refusal record nothing; acceptance records exactly one obligation with exact identities', async() => {
    const l = await listener(hpLost);
    const a = approval(damage), contentHash = await approve(a);
    assert.equal(open().length, 0, 'owner approval awaiting the GM is not an occurrence');
    const proposal = { ...base(), actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { hp: { current: 5, temp: 0 } } }] };
    assert.equal((await ack(owner, 'actor_propose', proposal)).code, 'awaiting_authorization'); assert.equal(open().length, 0, 'a proposal is not an occurrence');
    const stale = command(a, contentHash); stale.actors[1].expectedRevision += 5;
    await refused(gm, 'actor_consequence', stale, 'stale_actor_revision'); assert.equal(open().length, 0, 'a refusal is not an occurrence');
    const c = command(a, contentHash), r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(open().length, 1);
    const o = open()[0];
    assert.deepEqual(o.origin, { submitterUid: r.receipt.submitterUid, commandId: c.commandId, commitSequence: r.receipt.commitSequence });
    assert.deepEqual(o.occurrence.source, pc); assert.deepEqual(o.occurrence.target, foe); assert.equal(o.occurrence.kind, 'immediate-damage');
    assert.deepEqual(o.listener, { listenerId: l.listenerId, source: pc, definitionRef: heal.ref, on: hpLost });
    assert.equal(o.obligationId, actors.hash(['trigger-obligation:v1', o.occurrence.occurrenceId, l.listenerId]));
    assert.equal(o.state, 'pending-diagnostic'); assert.equal(o.mode, 'diagnostic');
  });

  it('typed evidence stays distinct: adjudicated 8 at HP 3 / temp 4 is base loss 3 and absorption 4; zero and temp-only damage never read as HP loss', async() => {
    const lost = await listener(hpLost), absorbed = await listener({ occurrence: 'immediate-damage', role: 'source', evidence: 'tempHpAbsorbed' }),
      any = await listener({ occurrence: 'immediate-damage', role: 'source', evidence: 'committed' });
    const by = id => open().filter(o => o.listener.listenerId === id);
    token(foe).state.currentHp = 3; token(foe).state.tempHealth = 4;
    await cast(damage, { amount: 8, face: 6 }); // overkill: 8 applied, only 3 base + 4 temp existed
    assert.deepEqual(by(lost.listenerId)[0].occurrence.evidence, { proposedTotal: 8, adjudicatedAmount: 8, baseHpLost: 3, tempHpAbsorbed: 4 });
    assert.deepEqual(by(lost.listenerId)[0].matched, { role: 'source', evidence: 'baseHpLost', value: 3 });
    assert.deepEqual(by(absorbed.listenerId)[0].matched, { role: 'source', evidence: 'tempHpAbsorbed', value: 4 });
    token(foe).state.currentHp = 20; token(foe).state.tempHealth = 5;
    await cast(damage, { amount: 2 }); // fully absorbed by temporary HP
    assert.equal(by(lost.listenerId).length, 1, 'temp-only absorption is not base HP loss');
    assert.equal(by(absorbed.listenerId).length, 2); assert.equal(by(any.listenerId).length, 2);
    await cast(damage, { amount: 0 }); // GM-adjudicated zero: committed, nothing lost, nothing absorbed
    assert.equal(by(lost.listenerId).length, 1); assert.equal(by(absorbed.listenerId).length, 2); assert.equal(by(any.listenerId).length, 3);
    assert.deepEqual(by(any.listenerId).find(o => o.occurrence.evidence.adjudicatedAmount === 0).occurrence.evidence, { proposedTotal: 6, adjudicatedAmount: 0, baseHpLost: 0, tempHpAbsorbed: 0 });
    assert.equal(open().some(o => 'hit' in o.occurrence.evidence || 'hit' in o.occurrence), false, 'no hit semantics exist');
  });

  it('healing reads the capped amount; a self-heal payment is never evidence; a GM pool correction is not an occurrence', async() => {
    const restored = await listener({ occurrence: 'immediate-healing', role: 'target', evidence: 'hpRestored' }, damage);
    await listener({ occurrence: 'immediate-damage', role: 'target', evidence: 'baseHpLost' }, damage);
    token(pc).character.health.current = 29;
    await cast(heal, { target: pc, amount: 8, face: 7 }); // 29/30: restores 1; pays 1 AP + 2 mana in the same actor entry
    assert.equal(open().length, 1);
    assert.deepEqual(open()[0].occurrence.evidence, { proposedTotal: 8, adjudicatedAmount: 8, hpRestored: 1 });
    assert.equal(open()[0].listener.listenerId, restored.listenerId);
    await cast(heal, { target: pc, amount: 8, face: 7 }); // already full: committed, restores 0
    assert.equal(open().length, 1, 'zero actual healing does not satisfy hpRestored');
    const correction = { ...base(), actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { hp: { current: 4, temp: 0 } } }],
      adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 26, adjustmentReason: 'manual', chosenResult: 'GM correction' } };
    assert.equal((await ack(gm, 'actor_consequence', correction)).success, true);
    assert.equal(token(pc).character.health.current, 4); assert.equal(open().length, 1, 'a decreasing HP number alone is not damage taken');
  });

  it('duplicate command, duplicate approval delivery and racing duplicates record one obligation; a later listener never matches an earlier commit', async() => {
    await listener(hpLost);
    const { a, c, r } = await cast(damage);
    const again = await Promise.all([ack(gm, 'actor_consequence', c), ack(gm, 'actor_consequence', c), ack(owner, 'actor_spell_approve', a)]);
    for (const reply of again) {assert.deepEqual(reply.receipt, r.receipt);}
    assert.equal(open().length, 1);
    await refused(gm, 'actor_consequence', { ...c, baseCommitSequence: c.baseCommitSequence + 1 }, 'command_id_conflict');
    await listener({ occurrence: 'immediate-damage', role: 'source', evidence: 'committed' });
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt);
    assert.equal(open().length, 1, 'replay after a new registration matches nothing');
  });

  it('the obligation is in the very snapshot the writer retains with the receipt; a writer refusal refuses both; a retained commit survives without any later processing step', async() => {
    await listener(hpLost); live().isPermanent = true; // checkpoint-eligible room: admission goes through the real writer
    const real = writer.admitConsequence.bind(writer); let retained = null, refuse = true;
    writer.admitConsequence = (roomId, prepare, install, options) => refuse ? { queued: false, code: 'writer_admission_refused' } : real(roomId, revision => (retained = actors.clone(prepare(revision))), install, options);
    const a = approval(damage), contentHash = await approve(a), c = command(a, contentHash);
    await refused(gm, 'actor_consequence', c, 'writer_admission_refused');
    assert.equal(open().length, 0); assert.equal(actors.ledger(live()).receipts.some(x => x.commandId === c.commandId), false);
    refuse = false;
    const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(retained.actorConsequences.receipts.some(x => x.commandId === c.commandId), true);
    assert.equal(Object.values(retained.triggerLedger.obligations).filter(o => o.origin.commandId === c.commandId).length, 1, 'receipt and obligation share one admission');
    assert.equal((await list(gm)).obligations[0].originDurability, 'accepted-live', 'accepted-live is not reported as checkpoint-confirmed');
    rebuild(retained); // "crash" right after the admission: only that retained snapshot exists, read back through the real codec
    assert.equal(open().length, 1, 'pending work is recoverable from the committed snapshot alone');
    assert.equal((await ack(gm, 'actor_consequence', c)).receipt.commandId, c.commandId); assert.equal(open().length, 1, 'recovery replays the receipt and creates nothing');
    assert.equal((await list(gm)).obligations.length, 1);
  });

  it('dismissal is one receipt that consumes the obligation once; replay, rebuild and conflicting bytes never reopen or re-close it; nothing is executed', async() => {
    await listener(hpLost); await cast(damage);
    const pools = () => actors.clone([actors.resources(token(pc), 'character'), actors.resources(token(foe), 'creature'), token(pc).state.conditions, token(foe).state.conditions]);
    const before = pools(), id = open()[0].obligationId, d = dismissal(id);
    await refused(gm, 'actor_trigger_dismiss', { ...d, reason: '   ' }, 'invalid_trigger_dismissal');
    const r = await ack(gm, 'actor_trigger_dismiss', d); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(open().length, 0); assert.deepEqual(pools(), before, 'dismissal changes no pool or condition');
    assert.deepEqual(stored().closed.map(x => [x.obligationId, x.state, x.commandId]), [[id, 'dismissed', d.commandId]]);
    assert.deepEqual(r.receipt.actors, []); assert.equal(r.receipt.adjudication.finalAmount, 0);
    assert.deepEqual((await ack(gm, 'actor_trigger_dismiss', d)).receipt, r.receipt);
    await refused(gm, 'actor_trigger_dismiss', { ...d, reason: 'different bytes' }, 'command_id_conflict');
    await refused(gm, 'actor_trigger_dismiss', dismissal(id), 'trigger_obligation_not_open');
    rebuild();
    assert.equal(open().length, 0, 'consumed work stays consumed after a rebuild'); assert.equal(stored().closed.length, 1);
    assert.deepEqual((await ack(gm, 'actor_trigger_dismiss', d)).receipt, r.receipt);
    await refused(gm, 'actor_trigger_dismiss', dismissal(id), 'trigger_obligation_not_open');
    await cast(damage); assert.equal(open().length, 1, 'a new commit is a new occurrence');
    assert.notEqual(open()[0].obligationId, id);
  });

  it('pending obligations survive receipt pruning pressure: they are not stored in, or evicted with, the receipt list', async() => {
    await listener(hpLost); const { c } = await cast(damage);
    const state = live().gameState; state.actorConsequences = { ...state.actorConsequences, receipts: [], replayFloor: state.actorConsequences.commitSequence }; // every receipt pruned
    assert.equal(open().length, 1); live().isPermanent = true;
    const view = await list(gm); assert.equal(view.obligations[0].origin.commandId, c.commandId); assert.equal(view.obligations[0].originDurability, 'checkpoint-confirmed');
    assert.equal((await ack(gm, 'actor_trigger_dismiss', dismissal(open()[0].obligationId))).success, true);
  });

  it('a replaced actor incarnation inherits no listener, and a retired registering GM silences it; the reason is visible to the GM', async() => {
    const l = await listener(hpLost);
    live().gameState.maps.default.characterTokens.pc2 = { ...actors.clone(token(pc)), id: 'pc2', state: { conditions: [] } };
    const pc2 = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid: uid, characterId: 'c' },
      snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2), replacePrimaryRef: pc })).ref;
    assert.ok(pc2);
    assert.deepEqual((await list(gm)).listeners.map(x => [x.listenerId, x.eligibility.ok]), [[l.listenerId, false]]);
    const old = pc; pc = pc2; await cast(damage); pc = old;
    assert.equal(open().length, 0, 'the replacement primary does not inherit the old incarnation\'s listener');
    const fresh = await listener(hpLost, heal, pc2);
    assert.deepEqual(triggers.eligibility(live(), fresh), { ok: true });
    assert.deepEqual(triggers.eligibility({ ...live(), gmId: 'another-gm' }, fresh), { ok: false, code: 'trigger_registrar_retired' });
  });

  it('a revoked definition stops matching and a same-name new version is never substituted; registration needs the exact admitted hash', async() => {
    const l = await listener(hpLost);
    await cast(damage); assert.equal(open().length, 1);
    assert.equal((await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, definitionRef: heal.ref })).success, true);
    const v2 = await admit(actors.clone(heal.r), 2);
    await cast(damage);
    assert.equal(open().length, 1, 'revoked binding matches nothing; v2 is a different identity');
    assert.deepEqual((await list(gm)).listeners.map(x => [x.listenerId, x.eligibility]), [[l.listenerId, { ok: false, code: 'definition_revoked' }]]);
    assert.equal(open()[0].listener.definitionRef.definitionVersion, 1, 'the pending obligation keeps the binding it matched under');
    await refused(gm, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: stored().revision, source: pc, definitionRef: heal.ref, on: { ...hpLost, evidence: 'committed' } }, 'definition_revoked');
    await refused(gm, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: stored().revision, source: pc, definitionRef: { ...v2.ref, definitionHash: 'f'.repeat(64) }, on: hpLost }, 'definition_not_admitted');
    await refused(gm, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: stored().revision, source: { ...pc, instanceId: uuid() }, definitionRef: v2.ref, on: hpLost }, 'actor_binding_conflict');
  });

  it('authority: only the room GM registers, revokes or dismisses; forged predicates, legacy writes and imported ledgers are refused or quarantined', async() => {
    for (const socket of [owner, observer]) {
      await refused(socket, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: 0, source: pc, definitionRef: heal.ref, on: hpLost }, 'forbidden');
    }
    const l = await listener(hpLost); await cast(damage);
    for (const socket of [owner, observer]) {
      await refused(socket, 'actor_trigger_revoke', { roomId: room.id, requestId: uuid(), expectedRevision: stored().revision, listenerId: l.listenerId }, 'forbidden');
      await refused(socket, 'actor_trigger_dismiss', dismissal(open()[0].obligationId), 'forbidden');
    }
    for (const on of [{ ...hpLost, evidence: 'hit' }, { ...hpLost, evidence: 'hpRestored' }, { ...hpLost, evidence: 'proposedTotal' }, { ...hpLost, role: 'ally' }, { ...hpLost, occurrence: 'hit' }, { ...hpLost, script: 'process.exit()' }]) {
      const before = actors.clone(live().gameState);
      const r = await ack(gm, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: stored().revision, source: pc, definitionRef: heal.ref, on });
      assert.equal(r.success, false, JSON.stringify(on)); assert.ok(['unsupported_trigger_predicate', 'invalid_consequence'].includes(r.code), r.code); assert.deepEqual(live().gameState, before);
    }
    await refused(gm, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: stored().revision + 7, source: pc, definitionRef: heal.ref, on: { ...hpLost, evidence: 'committed' } }, 'REVISION_CONFLICT');
    await refused(gm, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: stored().revision, source: pc, definitionRef: heal.ref, on: hpLost }, 'trigger_listener_exists');
    assert.equal(actors.protectedPath({ updates: { triggerLedger: stored() } }), 'updates.triggerLedger');
    assert.equal(actors.authorityMetadataPath({ token: { state: { triggerLedger: {} } } }), 'token.state.triggerLedger');
    const imported = actors.preserveImportedActorMetadata({ maps: {}, triggerLedger: actors.clone(stored()) });
    assert.equal(imported.triggerLedger, undefined); assert.equal(imported.actorConsequenceRecovery.reason, 'untrusted-local-import');
    // A dismissal request cannot smuggle actor entries: the envelope is exact.
    const forged = { ...base(), obligationId: open()[0].obligationId, reason: 'x', actors: [{ ref: foe, expectedRevision: 0, finalResources: { hp: { current: 0, temp: 0 } } }] };
    assert.equal((await ack(gm, 'actor_trigger_dismiss', forged)).success, false); assert.equal(token(foe).state.currentHp > 0, true); assert.equal(open().length, 1);
  });

  it('F2: trigger events use the shared authoritative guard and named limits; cross-room requests refuse before handlers', async() => {
    const { RateLimitService } = require('../services/rateLimitService');
    const fresh = new RateLimitService();
    try {
      assert.deepEqual(fresh.rateLimits.actor_trigger_list, { maxPerMinute: 60, maxPerSecond: 5 });
      assert.deepEqual(fresh.rateLimits.actor_trigger_register, { maxPerMinute: 30, maxPerSecond: 3 });
      assert.deepEqual(fresh.rateLimits.actor_trigger_revoke, { maxPerMinute: 30, maxPerSecond: 3 });
      assert.deepEqual(fresh.rateLimits.actor_trigger_dismiss, { maxPerMinute: 30, maxPerSecond: 3 });
    } finally { fresh.destroy(); }
    for (const event of ['actor_trigger_list', 'actor_trigger_register', 'actor_trigger_revoke', 'actor_trigger_dismiss']) {
      const answer = await ack(owner, event, { roomId: 'foreign-room' });
      assert.equal(answer.success, false, event);
      assert.equal(answer.code, 'room_target_mismatch', `${event}: ${JSON.stringify(answer)}`);
    }
    // The shared guard does not weaken the handler's own GM/session fence for a matching room.
    await refused(owner, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: 0, source: pc, definitionRef: heal.ref, on: hpLost }, 'forbidden');
    // The named limit is enforced by the existing rate-limit middleware.
    server.setEventLimits('actor_trigger_list', { maxPerMinute: 1, maxPerSecond: 1 });
    assert.equal((await list(gm)).success, true);
    const limited = await ack(gm, 'actor_trigger_list', { roomId: room.id });
    assert.equal(limited.success, false); assert.equal(limited.event, 'actor_trigger_list');
    assert.match(limited.error, /Rate limit exceeded/);
  });

  it('registration and revocation are idempotent by request id; revocation keeps pending evidence and stops future matches', async() => {
    const request = { roomId: room.id, requestId: uuid(), expectedRevision: 0, source: pc, definitionRef: heal.ref, on: hpLost };
    const first = await ack(gm, 'actor_trigger_register', request), second = await ack(gm, 'actor_trigger_register', request);
    assert.equal(first.success, true, JSON.stringify(first)); assert.deepEqual(second.listener, first.listener); assert.equal(stored().listeners.length, 1);
    assert.equal(first.capability, triggers.CAPABILITY); assert.equal(first.mode, 'diagnostic');
    await refused(gm, 'actor_trigger_register', { ...request, on: { ...hpLost, evidence: 'committed' } }, 'REQUEST_ID_CONFLICT');
    await cast(damage); assert.equal(open().length, 1);
    const revoke = { roomId: room.id, requestId: uuid(), expectedRevision: stored().revision, listenerId: first.listener.listenerId };
    const revoked = await ack(gm, 'actor_trigger_revoke', revoke);
    assert.equal(revoked.success, true); assert.equal(revoked.capability, triggers.CAPABILITY); assert.equal(revoked.mode, 'diagnostic');
    assert.equal((await ack(gm, 'actor_trigger_revoke', revoke)).success, true);
    assert.equal(stored().listeners.length, 0); assert.equal(open().length, 1, 'revocation never erases a recorded obligation');
    assert.equal((await list(gm)).obligations[0].listenerRegistered, false);
    await cast(damage); assert.equal(open().length, 1);
  });

  it('simultaneous qualifying listeners each get one obligation in a stable bookkeeping order; self-generated and dismissal receipts enqueue nothing', async() => {
    const a = await listener(hpLost), b = await listener({ occurrence: 'immediate-damage', role: 'source', evidence: 'adjudicatedAmount' });
    await listener(hpLost, damage); // bound to the causing definition itself
    await cast(damage);
    assert.deepEqual(open().map(o => o.listener.listenerId).sort(), [a.listenerId, b.listenerId].sort(), 'a listener bound to the causing definition never matches its own occurrence');
    assert.deepEqual(Object.keys(stored().obligations), [a.listenerId, b.listenerId].sort().map(id => actors.hash(['trigger-obligation:v1', open()[0].occurrence.occurrenceId, id])));
    const second = await listener({ occurrence: 'immediate-healing', role: 'source', evidence: 'committed' }, damage); // would close an A→B→A loop if anything executed
    for (const o of open()) {assert.equal((await ack(gm, 'actor_trigger_dismiss', dismissal(o.obligationId))).success, true);}
    assert.equal(open().length, 0, 'dismissal receipts are not occurrences');
    await cast(heal, { target: foe, amount: 1, face: 1 });
    assert.deepEqual(open().map(o => o.listener.listenerId), [second.listenerId]);
    assert.equal(actors.ledger(live()).receipts.filter(r => r.authorization?.kind === 'owner-approval-gm').length, 2, 'only the two human-approved casts executed; no listener produced a command');
  });

  it('capacity is an explicit refusal of the originating command with nothing changed, never a silent drop', async() => {
    await listener(hpLost);
    const filler = {};
    for (let i = 0; i < triggers.MAX_OPEN; i++) {
      const id = actors.hash(['filler', i]);
      filler[id] = { obligationId: id, state: 'pending-diagnostic', mode: 'diagnostic', occurrence: { occurrenceId: id, kind: 'immediate-damage', source: pc, target: foe, evidence: { proposedTotal: 1, adjudicatedAmount: 1, baseHpLost: 1, tempHpAbsorbed: 0 }, cause: { definitionId: 'x' } },
        listener: { listenerId: uuid(), source: pc, definitionRef: heal.ref, on: hpLost }, matched: { role: 'source', evidence: 'baseHpLost', value: 1 }, origin: { submitterUid: 'u', commandId: uuid(), commitSequence: 0 } };
    }
    live().gameState.triggerLedger = { ...stored(), obligations: filler };
    const a = approval(damage), contentHash = await approve(a);
    const r = await refused(gm, 'actor_consequence', command(a, contentHash), 'trigger_obligation_capacity'); assert.match(r.error, /limit 64/);
    assert.equal(token(foe).state.currentHp, 20, 'the consequence did not half-commit');
    assert.equal((await ack(gm, 'actor_trigger_dismiss', dismissal(Object.keys(filler)[0]))).success, true);
    assert.equal((await ack(gm, 'actor_consequence', command(a, contentHash))).success, true, 'the same approval commits once room is made'); assert.equal(open().length, triggers.MAX_OPEN);
    live().gameState.triggerLedger = { ...stored(), listeners: Array.from({ length: triggers.MAX_LISTENERS }, () => stored().listeners[0]) };
    await refused(gm, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: stored().revision, source: pc, definitionRef: heal.ref, on: { ...hpLost, evidence: 'committed' } }, 'trigger_listener_capacity');
  });

  it('viewer projections: GM sees all, the bound PC owner sees only what the predicate read, observers see and hear nothing; public traffic carries no private marker', async() => {
    const heard = { owner: [], observer: [], accepted: [] };
    owner.on('actor_trigger_changed', p => heard.owner.push(p)); observer.on('actor_trigger_changed', p => heard.observer.push(p)); observer.on('actor_consequence_accepted', p => heard.accepted.push(p));
    const l = await listener(hpLost); token(foe).state.hiddenFromPlayers = true;
    const { c } = await cast(damage, { amount: 5 }); const id = open()[0].obligationId;
    const gmView = await list(gm), ownerView = await list(owner), observerView = await list(observer);
    assert.equal(gmView.viewerRole, 'gm'); assert.equal(gmView.mode, 'diagnostic'); assert.equal(gmView.obligations[0].occurrence.evidence.adjudicatedAmount, 5); assert.equal(gmView.obligations[0].originDurability, 'live-only', 'a temporary room never claims durability');
    assert.deepEqual(ownerView.obligations, [{ obligationId: id, state: 'pending-diagnostic', mode: 'diagnostic', listenerId: l.listenerId, occurrence: 'immediate-damage', matched: { role: 'source', evidence: 'baseHpLost', value: 5 }, originDurability: 'live-only' }]);
    assert.deepEqual(ownerView.listeners, [{ listenerId: l.listenerId, mode: 'diagnostic', source: pc, on: hpLost }]);
    const ownerWire = JSON.stringify(ownerView);
    for (const secret of [foe.instanceId, '"foe"', heal.ref.definitionHash, damage.ref.definitionHash, c.commandId, 'adjudicatedAmount', 'proposedTotal', 'gmUid']) {assert.equal(ownerWire.includes(secret), false, `owner view leaks ${secret}`);}
    assert.deepEqual([observerView.listeners, observerView.obligations, observerView.closed], [[], [], []]);
    const d = dismissal(id), r = await ack(gm, 'actor_trigger_dismiss', d); assert.equal(r.success, true);
    await sleep(50);
    assert.equal(heard.observer.length, 0, 'observers get no trigger ping'); assert.ok(heard.owner.length >= 2); assert.deepEqual(heard.owner[0], { roomId: room.id });
    const publicWire = JSON.stringify([heard.accepted, r, access.projectGameStateForClient(live().gameState), await ack(observer, 'actor_snapshot', { roomId: room.id })]);
    for (const secret of ['PRIVATE-GM-REASON', 'triggerLedger', l.listenerId, actors.hash(d)]) {assert.equal(publicWire.includes(secret), false, `public traffic leaks ${secret}`);}
    assert.equal(r.receipt.contentHash, undefined); assert.equal(r.receipt.adjudication.adjustmentReason, triggers.DISMISS_REASON);
    assert.deepEqual(JSON.parse(r.receipt.adjudication.chosenResult), { capability: triggers.CAPABILITY, mode: 'dismiss', obligationId: id });
    assert.equal((await list(gm)).closed[0].reason, d.reason, 'the typed reason stays in the GM-only closed record');
    assert.deepEqual((await list(owner)).closed, []);
  });
});
