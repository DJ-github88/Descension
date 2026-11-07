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

describe('M4D zero-dice: real registered approval/consequence handlers', function() {
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
  function record(formula = 'caster_missing_health/4', kind = 'damage') {
    const d = { name: 'Wizard deterministic measure', description: 'One direct effect.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' }, effectTypes: [kind],
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 3 },
      [`${kind}Config`]: kind === 'damage' ? { damageType: 'direct', elementType: 'arcane', formula, resolution: 'DICE' } : { healingType: 'direct', formula, resolution: 'DICE' } };
    return Object.assign({}, actors.clone(d), { authoredDefinitionId: uuid(), authoredDraft: actors.clone(d) });
  }
  async function admit(formula, kind) {
    const r = record(formula, kind), result = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, record: r, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(result.success, true, JSON.stringify(result));
    return installed.list(room).entries.find(e => e.definitionRef.definitionId === r.authoredDefinitionId);
  }
  function approval(e) {
    const hp = token(pc).character.health, rollHealth = { current: hp.current, max: hp.max };
    const names = pure.formulaAttributes(e.canonicalDefinition.effect.formula), rollAttributes = Object.fromEntries(names.map(n => [n, token(pc).character.stats[n]]));
    const reading = pure.readDeterministicFormula(e.canonicalDefinition.effect.formula, rollAttributes, rollHealth);
    assert.equal(reading.supported, true, JSON.stringify(reading));
    const projected = require('../services/roomAccessService').projectTokenForClient(token(pc));
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target: foe,
      spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.DETERMINISTIC_CAPABILITY}/${e.definitionRef.definitionHash}`, name: e.canonicalDefinition.name, kind: e.canonicalDefinition.effect.kind, damageTypes: e.canonicalDefinition.effect.damageTypes || [] },
      roll: { mode: 'deterministic', dice: [], constant: reading.constant, reading: reading.reading, total: reading.constant },
      rollAttributes, ...(reading.readsHealth ? { rollHealth } : {}), formulaSourceRevision: token(pc).state.actorContract.revision,
      formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }), price: e.descriptor.price, classPayment: null };
  }
  async function approve(a) { const r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return r.contentHash; }
  function command(a, contentHash, amount = a.roll.total, reason = '') {
    const source = actors.resources(token(pc), 'character'), target = actors.resources(token(foe), 'creature');
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target: foe, approval: { approvalId: a.approvalId, contentHash },
      actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { ap: payments.tempFirst(source.ap.current, source.ap.temp, 1), mana: payments.tempFirst(source.mana.current, source.mana.temp, 3) } },
        { ref: foe, expectedRevision: token(foe).state.actorContract.revision, finalResources: { hp: a.spell.kind === 'healing' ? { current: Math.min(target.hp.max, target.hp.current + amount), temp: target.hp.temp } : { current: Math.max(0, target.hp.current - Math.max(0, amount - target.hp.temp)), temp: Math.max(0, target.hp.temp - amount) } } }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, chosenResult: JSON.stringify({ capability: pure.DETERMINISTIC_CAPABILITY, approvalId: a.approvalId, kind: a.spell.kind, roll: a.roll, ...(a.rollHealth ? { rollHealth: a.rollHealth } : {}), gmConfirmed: true }), finalAmount: amount, adjustmentReason: reason } };
  }
  async function unchanged(event, who, value, code) {
    const before = structuredClone(room.gameState), r = await ack(who, event, value);
    assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code, JSON.stringify(r));
    assert.deepEqual(room.gameState, before); return r;
  }
  it('fixed, score, floor-divisor and authoritative missing-health evaluate without dice; approval never spends', async() => {
    for (const [formula, total] of [['7', 7], ['intelligence', 18], ['intelligence/4', 4], ['caster_missing_health/4', 4]]) {
      const e = await admit(formula), a = approval(e), before = actors.clone(room.gameState.maps);
      assert.equal(e.descriptor.compilerVersion, pure.DETERMINISTIC_COMPILER); assert.deepEqual(a.roll.dice, []); assert.equal(a.roll.total, total);
      const hash = await approve(a); assert.deepEqual(room.gameState.maps, before);
      const r = await ack(gm, 'actor_consequence', command(a, hash)); assert.equal(r.success, true, JSON.stringify(r));
      assert.equal(JSON.parse(r.receipt.adjudication.chosenResult).roll.mode, 'deterministic');
    }
  });
  it('capped healing preserves temp HP, source health and full atomic payment', async() => {
    const e = await admit(undefined, 'healing'); token(foe).state.currentHp = 98;
    const a = approval(e), r = await ack(gm, 'actor_consequence', command(a, await approve(a))); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(token(foe).state.currentHp, 100); assert.equal(token(foe).state.tempHealth, 2);
    assert.deepEqual([token(pc).character.health.current, token(pc).character.tempHealth, token(pc).character.mana.current, token(pc).character.tempMana, token(pc).character.tempActionPoints], [23, 9, 19, 0, 0]);
  });
  it('forged totals, inputs, fake physical/digital rolls, added dice, definitions and routes refuse without mutation', async() => {
    const e = await admit();
    for (const change of [a => a.roll.total++, a => a.roll.constant++, a => a.roll.reading = 'forged', a => a.roll.mode = 'physical', a => a.roll.mode = 'digital',
      a => a.roll.dice.push({ sides: 2, faces: [1] }), a => a.rollHealth.current = 0, a => delete a.rollHealth, a => a.rollHealth.temp = 9,
      a => a.rollAttributes.currentHealth = 0, a => a.target = pc, a => a.spell.definitionHash = a.spell.definitionHash.replace('v4', 'v2'), a => a.classPayment = {}]) {
      const a = approval(e); change(a); await unchanged('actor_spell_approve', owner, a);
    }
    for (const patch of [{ schemaVersion: 4 }, { capability: pure.HEALTH_CAPABILITY, schemaVersion: 6 }, { targetRoute: 'primary-pc-healing' }, { catalogueSource: {} }, { effect: { kind: 'damage', formula: '1d8', damageTypes: ['arcane'] } }]) assert.equal(registry.compileDefinition(Object.assign({}, e.canonicalDefinition, patch)).ok, false);
  });
  it('changed attribute, HP, max, temp and revision close stale approval and require explicit fresh consent', async() => {
    const e = await admit('intelligence/4 + caster_missing_health/4');
    for (const mutate of [() => token(pc).character.stats.intelligence++, () => token(pc).character.health.current--, () => token(pc).character.health.max++, () => token(pc).character.tempHealth++, () => token(pc).state.actorContract.revision++]) {
      const a = approval(e), hash = await approve(a); mutate();
      await unchanged('actor_consequence', gm, command(a, hash), 'owner_reapproval_required'); assert.equal(payments.get(room, a.approvalId), null);
      const fresh = approval(e); assert.equal((await ack(gm, 'actor_consequence', command(fresh, await approve(fresh)))).success, true);
    }
  });
  it('post-authority-await input drift refuses without payment or HP writes', async() => {
    const e = await admit(), a = approval(e), c = command(a, await approve(a));
    const original = server.authorityService.assertCurrent; let release, reached, hold = true;
    const gate = new Promise(r => { release = r; }), entered = new Promise(r => { reached = r; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; reached(); await gate; } return original(...args); };
    const pending = ack(gm, 'actor_consequence', c); await entered; token(pc).character.health.current = 18; const before = actors.clone(room.gameState); release();
    assert.equal((await pending).code, 'owner_reapproval_required'); assert.deepEqual(room.gameState, before); server.authorityService.assertCurrent = original;
  });
  it('writer refusal retains original command; exact replay recovers one original receipt despite later input drift', async() => {
    const e = await admit(), a = approval(e), c = command(a, await approve(a)); room.isPermanent = true;
    const original = writer.admitConsequence; writer.admitConsequence = () => ({ queued: false, code: 'm4d_writer_refusal' });
    await unchanged('actor_consequence', gm, c, 'm4d_writer_refusal'); assert.deepEqual(payments.get(room, a.approvalId).approval, a);
    writer.admitConsequence = original; const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    token(pc).character.health.current = 1; const after = actors.clone(room.gameState);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.deepEqual(room.gameState, after); assert.equal(actors.ledger(room).receipts.length, 1);
  });
  it('zero result pays existing exact price; negative proposals require a nonnegative GM ruling with reason', async() => {
    for (const formula of ['0', '-2']) {
      const e = await admit(formula), a = approval(e), hash = await approve(a), before = token(foe).state.currentHp;
      if (a.roll.total < 0) { await unchanged('actor_consequence', gm, command(a, hash)); await unchanged('actor_consequence', gm, command(a, hash, 0)); }
      const r = await ack(gm, 'actor_consequence', command(a, hash, 0, a.roll.total < 0 ? 'GM rules no damage' : '')); assert.equal(r.success, true, JSON.stringify(r));
      assert.equal(token(foe).state.currentHp, before);
    }
  });
});
