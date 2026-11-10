const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const registry = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const pure = require('../shared/services/authoredAbility');
const ack = (s, event, data) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(event)), 5000); s.emit(event, data, r => { clearTimeout(t); resolve(r); }); });
const once = (s, event) => new Promise(resolve => s.once(event, resolve));

describe('M4C missing-health: production registered handlers / server dynamic authority', function() {
  this.timeout(15000);
  let server, room, gm, owner, pc, foe, writer;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_consequence', 'actor_spell_approve', 'actor_authored_admit']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    const gu = server.nextUserId(), uid = server.nextUserId(); server.registerAuthToken('gm', gu); server.registerAuthToken('owner', uid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gu });
    owner = server.connect({ token: 'owner' }); await once(owner, 'connect'); const joined = once(owner, 'room_joined'); owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' }); await joined;
    server.setCharacterOwner('c', uid);
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', stats: { maxHp: 100, maxMana: 0, maxAP: 4 }, state: { currentHp: 70, currentMana: 0, currentActionPoints: 4, tempHealth: 2, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', ownerUserId: uid, character: { id: 'c', class: 'Arcanoneer', stats: { intelligence: 18 }, health: { current: 23, max: 40 }, mana: { current: 20, max: 20 }, actionPoints: { current: 10, max: 10 }, tempHealth: 9, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: uid, characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
  });
  afterEach(async() => { gm?.disconnect(); owner?.disconnect(); await server?.stop(); });
  const token = ref => actors.locate(room, ref).token;
  function record(formula = '1d8 + caster_missing_health/4', kind = 'damage') {
    const d = { name: 'Wizard wound measure', description: 'One direct effect.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' }, effectTypes: [kind],
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
      resourceCost: { actionPoints: 1, mana: 3 },
      [`${kind}Config`]: kind === 'damage' ? { damageType: 'direct', elementType: 'arcane', formula, resolution: 'DICE' } : { healingType: 'direct', formula, resolution: 'DICE' } };
    return Object.assign({}, actors.clone(d), { authoredDefinitionId: uuid(), authoredDraft: actors.clone(d) });
  }
  async function admit(formula, kind) {
    const r = record(formula, kind), result = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, record: r, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(result.success, true, JSON.stringify(result));
    return installed.list(room).entries.find(e => e.definitionRef.definitionId === r.authoredDefinitionId);
  }
  function approval(e) {
    const hp = token(pc).character.health, rollHealth = { current: hp.current, max: hp.max }, rollAttributes = {};
    const reading = pure.readHealthFormula(e.canonicalDefinition.effect.formula, rollAttributes, rollHealth);
    assert.equal(reading.supported, true, JSON.stringify(reading));
    const projected = require('../services/roomAccessService').projectTokenForClient(token(pc));
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target: foe,
      spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.HEALTH_CAPABILITY}/${e.definitionRef.definitionHash}`, name: e.canonicalDefinition.name, kind: e.canonicalDefinition.effect.kind, damageTypes: e.canonicalDefinition.effect.damageTypes || [] },
      roll: { mode: 'physical', dice: [{ sides: 8, faces: [4] }], constant: reading.constant, reading: reading.reading, total: reading.constant + 4 },
      rollAttributes, rollHealth, formulaSourceRevision: token(pc).state.actorContract.revision, formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }), price: e.descriptor.price, classPayment: null };
  }
  async function approve(a) { const r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return r.contentHash; }
  function command(a, contentHash) {
    const source = actors.resources(token(pc), 'character'), target = actors.resources(token(foe), 'creature'), amount = a.roll.total;
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target: foe, approval: { approvalId: a.approvalId, contentHash },
      actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { ap: payments.tempFirst(source.ap.current, source.ap.temp, 1), mana: payments.tempFirst(source.mana.current, source.mana.temp, 3) } },
        { ref: foe, expectedRevision: token(foe).state.actorContract.revision, finalResources: { hp: a.spell.kind === 'healing' ? { current: Math.min(target.hp.max, target.hp.current + amount), temp: target.hp.temp } : { current: Math.max(0, target.hp.current - Math.max(0, amount - target.hp.temp)), temp: Math.max(0, target.hp.temp - amount) } } }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, chosenResult: JSON.stringify({ capability: pure.HEALTH_CAPABILITY, approvalId: a.approvalId, kind: a.spell.kind, roll: a.roll, rollHealth: a.rollHealth, gmConfirmed: true }), finalAmount: amount, adjustmentReason: '' } };
  }
  async function unchanged(event, who, value, code) {
    const before = structuredClone(room.gameState), r = await ack(who, event, value);
    assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code, JSON.stringify(r));
    assert.deepEqual(room.gameState, before); return r;
  }
  it('exact server base HP inputs, ignored temp HP, atomic temp-first price and immutable receipt reading', async() => {
    const e = await admit(), a = approval(e);
    assert.equal(e.descriptor.compilerVersion, pure.HEALTH_COMPILER); assert.equal(a.roll.total, 8);
    assert.match(a.roll.reading, /base HP 23\/40; missing 17 ÷ 4/);
    const before = actors.clone(room.gameState.maps), contentHash = await approve(a); assert.deepEqual(room.gameState.maps, before);
    const c = command(a, contentHash), r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(token(foe).state.currentHp, 64); assert.equal(token(foe).state.tempHealth, 0);
    assert.equal(token(pc).character.mana.current, 19); assert.equal(token(pc).character.tempMana, 0);
    assert.equal(token(pc).character.actionPoints.current, 10); assert.equal(token(pc).character.tempActionPoints, 0);
    assert.equal(token(pc).character.health.current, 23); assert.equal(token(pc).character.tempHealth, 9);
    assert.deepEqual(JSON.parse(r.receipt.adjudication.chosenResult).rollHealth, { current: 23, max: 40 });
    const after = actors.clone(room.gameState); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.deepEqual(room.gameState, after);
  });
  it('full health, zero health, zero max and explicit nonnegative clamp are calculated from room HP', async() => {
    const e = await admit();
    for (const [current, max, constant] of [[40, 40, 0], [0, 40, 10], [0, 0, 0], [41, 40, 0]]) {
      token(pc).character.health = { current, max }; const a = approval(e); assert.equal(a.roll.constant, constant);
      const r = await ack(gm, 'actor_consequence', command(a, await approve(a))); assert.equal(r.success, true, JSON.stringify(r));
    }
  });
  it('healing caps base HP, discards excess, preserves temporary HP and pays full price', async() => {
    const e = await admit(undefined, 'healing'); token(foe).state.currentHp = 98;
    const a = approval(e), r = await ack(gm, 'actor_consequence', command(a, await approve(a))); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(token(foe).state.currentHp, 100); assert.equal(token(foe).state.tempHealth, 2); assert.equal(token(pc).character.mana.current, 19);
  });
  it('forged HP, injected input shapes, constants, reading, namespace and PC target refuse without spending', async() => {
    const e = await admit();
    for (const change of [a => { a.rollHealth.current = 3; const r = pure.readHealthFormula(e.canonicalDefinition.effect.formula, {}, a.rollHealth); a.roll.constant = r.constant; a.roll.total = r.constant + 4; a.roll.reading = r.reading; },
      a => a.rollHealth = [], a => a.rollHealth = null, a => a.rollHealth.current = 1.5, a => a.rollHealth.max = 100001, a => a.rollHealth.temp = 9,
      a => delete a.rollHealth.max, a => a.rollAttributes.currentHealth = 3, a => a.roll.constant++, a => a.roll.reading = 'forged',
      a => a.spell.definitionId = 'not-authored', a => a.target = pc]) {
      const a = approval(e); change(a); await unchanged('actor_spell_approve', owner, a);
    }
  });
  it('strict grammar and old-version/area/composed boundaries refuse admission or compilation', async() => {
    // Zero-dice Wizard admission is now v4; the v3 reader/compiler remain dice-only.
    assert.equal(pure.readHealthFormula('caster_missing_health/4', {}, { current: 23, max: 40 }).supported, false);
    for (const formula of ['1d8 + caster_missing_health/0', '1d8 + target_missing_health/4', '1d8 + caster_missing_health/1.5', '1d8 + (maxHealth-currentHealth)/4', '1d8 + caster_missing_health.constructor', '1d8 + alert(1)']) {
      const r = record(formula), before = actors.clone(room.gameState);
      const result = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, record: r, definitionVersion: 1, classId: 'arcanoneer' });
      assert.equal(result.code, 'unsupported_wizard_record', JSON.stringify(result)); assert.deepEqual(room.gameState, before);
    }
    const e = await admit(), d = actors.clone(e.canonicalDefinition);
    d.capability = pure.FORMULA_CAPABILITY; d.schemaVersion = 4; assert.equal(registry.compileDefinition(d).ok, false);
    assert.equal(pure.readScaledFormula(d.effect.formula, {}).supported, false);
    for (const extra of [{ targetRoute: 'primary-pc-healing' }, { classPayment: { domain: 'devotionGauge', price: { cost: 0, gain: 1, required: 0 } } }]) {
      assert.equal(registry.compileDefinition(Object.assign({}, e.canonicalDefinition, extra)).ok, false);
    }
    assert.equal(pure.isAreaRollProcedureApproved(), true);
  });
  it('source HP drift before approval and current/max/temp/revision drift after consent require explicit reapproval', async() => {
    const e = await admit(), original = approval(e); token(pc).character.health.current = 19;
    await unchanged('actor_spell_approve', owner, original, 'owner_reapproval_required');
    for (const mutate of [() => token(pc).character.health.current--, () => token(pc).character.health.max++, () => token(pc).character.tempHealth++, () => token(pc).state.actorContract.revision++]) {
      const a = approval(e), hash = await approve(a); mutate();
      await unchanged('actor_consequence', gm, command(a, hash), 'owner_reapproval_required');
      assert.equal(payments.get(room, a.approvalId), null);
      const b = approval(e); assert.deepEqual(b.roll.dice, a.roll.dice);
      assert.equal((await ack(gm, 'actor_consequence', command(b, await approve(b)))).success, true);
    }
  });
  it('HP changes across authority await are rejected at final stage, with all costs and HP untouched', async() => {
    const e = await admit(), a = approval(e), c = command(a, await approve(a));
    const original = server.authorityService.assertCurrent; let release, reached, hold = true;
    const gate = new Promise(r => { release = r; }), entered = new Promise(r => { reached = r; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; reached(); await gate; } return original(...args); };
    const pending = ack(gm, 'actor_consequence', c); await entered; token(pc).character.health.current = 18; const before = actors.clone(room.gameState); release();
    assert.equal((await pending).code, 'owner_reapproval_required'); assert.deepEqual(room.gameState, before);
    server.authorityService.assertCurrent = original;
  });
  it('target CAS, writer failure and identical-command recovery retain one receipt and original faces', async() => {
    const e = await admit(), a = approval(e), hash = await approve(a), stale = command(a, hash);
    token(foe).state.actorContract.revision++; await unchanged('actor_consequence', gm, stale, 'stale_actor_revision');
    const c = command(a, hash); room.isPermanent = true;
    const original = writer.admitConsequence; writer.admitConsequence = () => ({ queued: false, code: 'm4c_writer_refusal' });
    await unchanged('actor_consequence', gm, c, 'm4c_writer_refusal'); assert.deepEqual(payments.get(room, a.approvalId).approval.roll, a.roll);
    writer.admitConsequence = original; const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    const after = actors.clone(room.gameState); token(pc).character.health.current = 1;
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); token(pc).character.health.current = 23;
    assert.deepEqual(room.gameState, after); assert.equal(actors.ledger(room).receipts.length, 1);
  });
  it('result bounds, malformed authoritative HP and forged command inputs refuse with no partial install', async() => {
    const e = await admit(), a = approval(e), hash = await approve(a);
    for (const change of [c => delete c.approval, c => c.adjudication.finalAmount = -1, c => c.adjudication.finalAmount = 1.5,
      c => { const chosen = JSON.parse(c.adjudication.chosenResult); chosen.rollHealth.current = 0; c.adjudication.chosenResult = JSON.stringify(chosen); }]) {
      const c = command(a, hash); change(c); await unchanged('actor_consequence', gm, c);
    }
    for (const hp of [{ current: 0, max: 40004 }, { current: 1.5, max: 40 }, { current: 0, max: Infinity }]) {
      token(pc).character.health = hp;
      const forged = actors.clone(a); const p = require('../services/roomAccessService').projectTokenForClient(token(pc));
      forged.approvalId = uuid(); forged.formulaSourceHash = actors.hash({ character: p.character, conditions: p.state?.conditions || [] });
      forged.rollHealth = hp;
      await unchanged('actor_spell_approve', owner, forged);
    }
  });
});
