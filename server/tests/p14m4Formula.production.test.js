const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const registry = require('../services/installedDefinitionRegistry');
const pure = require('../shared/services/authoredAbility');
const ack = (s, event, data) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(event)), 5000); s.emit(event, data, r => { clearTimeout(t); resolve(r); }); });
const once = (s, event) => new Promise(resolve => s.once(event, resolve));

describe('M4A versioned formula / existing production authority seams', function() {
  this.timeout(15000);
  let server, room, gm, owner, pc, foe, writer;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_authored_admit']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    const gu = server.nextUserId(), uid = server.nextUserId(); server.registerAuthToken('gm', gu); server.registerAuthToken('owner', uid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gu });
    owner = server.connect({ token: 'owner' }); await once(owner, 'connect'); const joined = once(owner, 'room_joined'); owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' }); await joined;
    server.setCharacterOwner('c', uid);
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', stats: { maxHp: 100, maxMana: 0, maxAP: 4 }, state: { currentHp: 70, currentMana: 0, currentActionPoints: 4, tempHealth: 2, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', ownerUserId: uid, character: { id: 'c', class: 'Arcanoneer', stats: { intelligence: 18 }, health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: uid, characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
  });
  afterEach(async() => { gm?.disconnect(); owner?.disconnect(); await server?.stop(); });
  const token = ref => actors.locate(room, ref).token;
  async function admit(formula = '1d8 + intelligence * 2', kind = 'damage') {
    const d = { name: 'Owner-authored scaling', description: 'Single direct effect.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' }, effectTypes: [kind],
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
      resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 3 } },
      [`${kind}Config`]: kind === 'damage' ? { damageType: 'direct', elementType: 'arcane', formula, resolution: 'DICE' } : { healingType: 'direct', formula, resolution: 'DICE' } };
    const record = Object.assign({}, actors.clone(d), { authoredDefinitionId: uuid(), authoredDraft: actors.clone(d) });
    const result = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, record, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(result.success, true, JSON.stringify(result));
    return installed.list(room).entries.find(e => e.definitionRef.definitionId === record.authoredDefinitionId);
  }
  function approval(e, score = 18, faces = [4]) {
    const rollAttributes = { intelligence: score }, reading = pure.readScaledFormula(e.canonicalDefinition.effect.formula, rollAttributes);
    const projected = require('../services/roomAccessService').projectTokenForClient(token(pc));
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target: foe,
      spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.FORMULA_CAPABILITY}/${e.definitionRef.definitionHash}`, name: e.canonicalDefinition.name, kind: e.canonicalDefinition.effect.kind, damageTypes: e.canonicalDefinition.effect.damageTypes || [] },
      roll: { mode: 'physical', dice: [{ sides: 8, faces }], constant: reading.constant, reading: reading.reading, total: faces.reduce((a, b) => a + b, reading.constant) },
      rollAttributes, formulaSourceRevision: token(pc).state.actorContract.revision, formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }), price: e.descriptor.price, classPayment: null };
  }
  async function approve(a) { const r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return r.contentHash; }
  function command(a, hash) {
    const source = actors.resources(token(pc), 'character'), target = actors.resources(token(foe), 'creature'), amount = a.roll.total;
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target: foe, approval: { approvalId: a.approvalId, contentHash: hash },
      actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { ap: require('../services/spellPayments').tempFirst(source.ap.current, source.ap.temp, 1), mana: require('../services/spellPayments').tempFirst(source.mana.current, source.mana.temp, 3) } },
        { ref: foe, expectedRevision: token(foe).state.actorContract.revision, finalResources: { hp: a.spell.kind === 'healing' ? { current: Math.min(target.hp.max, target.hp.current + amount), temp: target.hp.temp } : { current: Math.max(0, target.hp.current - Math.max(0, amount - target.hp.temp)), temp: Math.max(0, target.hp.temp - amount) } } }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, chosenResult: JSON.stringify({ capability: pure.FORMULA_CAPABILITY, approvalId: a.approvalId, kind: a.spell.kind, roll: a.roll, gmConfirmed: true }), finalAmount: amount, adjustmentReason: '' } };
  }
  it('shared whole-Wizard admission, exact calculation, temp-first atomic payment, checkpoint identity and once-only original-command replay', async() => {
    token(pc).character.privateFormulaSentinel = 'not in the owner-visible token projection';
    const e = await admit(), a = approval(e), before = actors.clone(room.gameState.maps), hash = await approve(a);
    assert.deepEqual(room.gameState.maps, before); assert.equal(a.roll.total, 40);
    assert.equal(registry.decodeRegistry(registry.encodeRegistry(installed.registry(room)).json).ok, true);
    const c = command(a, hash), accepted = await ack(gm, 'actor_consequence', c); assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.equal(token(foe).state.currentHp, 32); assert.equal(token(foe).state.tempHealth, 0); assert.equal(token(pc).character.tempActionPoints, 0); assert.equal(token(pc).character.mana.current, 9);
    const after = actors.clone(room.gameState); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, accepted.receipt); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, accepted.receipt);
    assert.deepEqual((await ack(owner, 'actor_spell_approve', a)).receipt, accepted.receipt); assert.deepEqual(room.gameState, after);
    assert.deepEqual(JSON.parse(accepted.receipt.adjudication.chosenResult).roll.dice[0].faces, [4]);
  });
  it('forged inputs/constant/reading and PC target refuse with no partial cost, outcome or receipt', async() => {
    const e = await admit();
    for (const change of [a => { a.spell.definitionId = 'unregistered-formula'; a.formulaSourceHash = '0'.repeat(64); }, a => a.roll.constant++, a => a.rollAttributes.intelligence = null, a => a.rollAttributes.intelligence = 1001, a => a.rollAttributes.strength = 10, a => a.roll.reading = 'forged', a => a.target = pc]) {
      const a = approval(e); change(a); const before = actors.clone(room.gameState); assert.equal((await ack(owner, 'actor_spell_approve', a)).success, false); assert.deepEqual(room.gameState, before);
    }
    const a = approval(e), c = command(a, '0'.repeat(64)); delete c.approval; c.adjudication.definitionId = 'unregistered-formula';
    const before = actors.clone(room.gameState); assert.equal((await ack(gm, 'actor_consequence', c)).code, 'approval_required'); assert.deepEqual(room.gameState, before);
  });
  it('caster mutation even without revision closes old consent; explicit reapproval revalues the same faces', async() => {
    const e = await admit(), a = approval(e), hash = await approve(a);
    token(pc).character.stats.intelligence = 20;
    const before = actors.clone(room.gameState); assert.equal((await ack(gm, 'actor_consequence', command(a, hash))).code, 'owner_reapproval_required'); assert.deepEqual(room.gameState, before);
    const b = approval(e, 20, a.roll.dice[0].faces); assert.equal(b.roll.total, 44); assert.deepEqual(b.roll.dice, a.roll.dice);
    assert.equal((await ack(gm, 'actor_consequence', command(b, await approve(b)))).success, true);
  });
  it('target change needs exact GM revalidation, writer refusal keeps faces and all state unchanged', async() => {
    const e = await admit(), a = approval(e), hash = await approve(a), stale = command(a, hash);
    token(foe).state.actorContract.revision++; const before = actors.clone(room.gameState);
    assert.equal((await ack(gm, 'actor_consequence', stale)).code, 'stale_actor_revision'); assert.deepEqual(room.gameState, before);
    room.isPermanent = true; const original = writer.admitConsequence; writer.admitConsequence = () => ({ queued: false, code: 'm4_writer_refusal' });
    assert.equal((await ack(gm, 'actor_consequence', command(a, hash))).code, 'm4_writer_refusal'); assert.deepEqual(room.gameState.maps, before.maps);
    assert.deepEqual(require('../services/spellPayments').get(room, a.approvalId).approval.roll, a.roll); writer.admitConsequence = original;
    assert.equal((await ack(gm, 'actor_consequence', command(a, hash))).success, true);
  });
  it('direct healing uses the existing cap with no new executor', async() => {
    const e = await admit('1d8 + intelligence * 2', 'healing'), a = approval(e);
    assert.equal((await ack(gm, 'actor_consequence', command(a, await approve(a)))).success, true); assert.equal(token(foe).state.currentHp, 100); assert.equal(token(foe).state.tempHealth, 2);
  });
  it('caster input changes across the authority await cannot install a partial consequence', async() => {
    const e = await admit(), a = approval(e), c = command(a, await approve(a));
    const original = server.authorityService.assertCurrent; let release, reached, hold = true;
    const gate = new Promise(r => { release = r; }), entered = new Promise(r => { reached = r; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; reached(); await gate; } return original(...args); };
    const pending = ack(gm, 'actor_consequence', c); await entered;
    token(pc).character.stats.intelligence = 20; const before = actors.clone(room.gameState); release();
    assert.equal((await pending).code, 'owner_reapproval_required'); assert.deepEqual(room.gameState, before);
    server.authorityService.assertCurrent = original;
  });
});
