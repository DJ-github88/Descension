/** Minstrel Opening Chord → Resolving Strike through the registered production stack.
 * Client side: the production P9 support/approval/command planners (loaded unchanged).
 * Server side: real actor_spell_approve / actor_consequence handlers, P7 stage and writer admission.
 * Fixture inputs: fixtures/minstrelPair.cjs (pair terms, character, cases). */
const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Module = require('module');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const payments = require('../services/spellPayments');

const FIXTURES = process.env.MINSTREL_FIXTURES || path.join(__dirname, 'fixtures/minstrelPair.cjs');
const fixtures = require(FIXTURES);
const SRC = path.resolve(__dirname, '../../vtt-react/src') + path.sep;
const babel = require(path.resolve(__dirname, '../../vtt-react/node_modules/@babel/core'));
const transform = require.resolve(path.resolve(__dirname, '../../vtt-react/node_modules/@babel/plugin-transform-modules-commonjs'));
const jsx = require.resolve(path.resolve(__dirname, '../../vtt-react/node_modules/@babel/preset-react'));
/** Loads unchanged ES-module client sources for this file only, then restores the loaders. */
function loadClient(relative) {
  const original = Module._extensions['.js'], originalMjs = Module._extensions['.mjs'], originalJsx = Module._extensions['.jsx'], originalCss = Module._extensions['.css'];
  Module._extensions['.js'] = function(mod, filename) {
    if (!filename.startsWith(SRC)) {return original(mod, filename);}
    mod._compile(babel.transformSync(fs.readFileSync(filename, 'utf8'), { filename, babelrc: false, configFile: false, presets: [[jsx, { runtime: 'automatic' }]], plugins: [transform] }).code, filename);
  };
  Module._extensions['.mjs'] = Module._extensions['.jsx'] = Module._extensions['.js'];
  Module._extensions['.css'] = mod => {mod.exports = {};};
  try {return require(SRC + relative);} finally {
    Module._extensions['.js'] = original;
    for (const [ext, saved] of [['.mjs', originalMjs], ['.jsx', originalJsx], ['.css', originalCss]]) {if (saved) {Module._extensions[ext] = saved;} else {delete Module._extensions[ext];}}
  }
}
const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 5000);
  client.emit(event, payload, result => {clearTimeout(timer); resolve(result);});
});
const once = (client, event) => new Promise(resolve => client.once(event, resolve));
const SENTINEL = 'PRIVATE-MINSTREL-SENTINEL';
const [OPENING, RESOLVING] = fixtures.pair;
const notesOf = notes => ({ type: 'musicalNotes', notes: [...notes] });

describe('P9 Minstrel Opening Chord → Resolving Strike (registered production stack)', function() {
  this.timeout(30000);
  let sc, feed, attributes, server, writer, gm, owner, other, gmUid, ownerUid, room, pcRef, foeRef, clients, epoch;
  before(() => {
    sc = loadClient('services/spellConsequence.js');
    feed = loadClient('services/acceptedResultFeed.js');
    attributes = loadClient('services/combatAttributes.js');
  });
  /** Binds Sol's pre-bind Minstrel fixture BEFORE actor_bind, then installs its private bank by owner sync. */
  async function setup({ ap = 2, mana = 8, notes = [0, 0, 0, 0, 0, 0, 0] } = {}) {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start(); clients = [];
    for (const event of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_decline', 'actor_spell_list', 'actor_recovery', 'character_resource_updated']) {
      server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
    }
    gmUid = server.nextUserId(); ownerUid = server.nextUserId(); const otherUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('other', otherUid);
    gm = server.connect({ token: 'gm' }); clients.push(gm); await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid, persistentRoomId: crypto.randomUUID() });
    for (const [token, name] of [['owner', 'Owner'], ['other', 'Other']]) {
      const client = server.connect({ token }); clients.push(client); await once(client, 'connect');
      const joined = once(client, 'room_joined'); client.emit('join_room', { roomId: room.id, playerName: name, password: '' }); await joined;
      if (token === 'owner') {owner = client;} else {other = client;}
    }
    const character = { ...fixtures.character({ ap, mana, notes }), privateNote: SENTINEL };
    server.players.get(owner.id).character = actors.clone(character);
    server.setCharacterOwner(character.id, ownerUid);
    const pc = { id: 'pc', ownerUserId: ownerUid, character, state: { conditions: [] } };
    const foe = { id: 'foe', creatureId: 'grimmstalk', stats: { maxHp: 250, maxMana: 30, maxAP: 5 }, state: { currentHp: 30, tempHealth: 4, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0, conditions: [] } };
    room.gameState.maps.default.characterTokens.pc = pc; room.gameState.maps.default.tokens.foe = foe;
    pcRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: character.id }, snapshotHash: actors.hash(pc) })).ref;
    foeRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(foe) })).ref;
    assert.ok(pcRef && foeRef);
    epoch = (await ack(owner, 'actor_snapshot', { roomId: room.id })).actionEpoch;
    const synced = await ack(owner, 'actor_consequence', await command(owner, [{ ref: pcRef, expectedRevision: revision(pcRef), classPayment: { mode: 'sync', before: null, after: { domain: 'musicalNotes', value: notesOf(notes) } } }]));
    assert.equal(synced.success, true, JSON.stringify(synced));
  }
  afterEach(async() => {for (const client of clients || []) {client.disconnect();} if (server) {await server.stop();} server = null;});
  const snap = async client => ack(client, 'actor_snapshot', { roomId: room.id });
  const revision = ref => actors.locate(room, ref).contract.revision;
  const command = async(client, entries, extra = {}) => ({ version: 1, roomId: room.id, commandId: crypto.randomUUID(), actionEpoch: epoch,
    baseCommitSequence: (await snap(client)).commitSequence, actors: entries, ...extra });
  const pcToken = () => actors.locate(room, pcRef).token;
  const foeToken = () => actors.locate(room, foeRef).token;
  const tokens = () => [{ ...actors.clone(pcToken()), mapId: 'default' }, { ...actors.clone(foeToken()), mapId: 'default' }];
  const bank = () => pcToken().state.classPayment?.value?.notes;
  const pools = () => [pcToken().character.actionPoints.current, pcToken().character.mana.current];
  /** The owner's normal client view: bound character + its private class home. */
  const casterView = () => ({ ...actors.clone(pcToken().character), classResource: { ...pcToken().character.classResource, ...notesOf(bank()) } });
  const protectedState = () => actors.clone({ gameState: room.gameState, owner: server.players.get(owner.id).character });
  /** Production client planners: support → physical roll → owner approval terms. */
  function prepare(spec, face) {
    const support = sc.supportSpell({ id: spec.id }, casterView());
    assert.equal(support.supported, true, support.reason);
    const roll = support.payment.affordable ? sc.recordRoll('physical', support.reading, [[face]]) : null;
    return { support, roll, build: (approvalId = crypto.randomUUID(), usedRoll = roll) => sc.buildApproval({ support, tokens: tokens(), sourceRef: pcRef, targetRef: foeRef,
      roomId: room.id, mapId: 'default', actionEpoch: epoch, baseCommitSequence: actors.ledger(room).commitSequence, roll: usedRoll, approvalId }) };
  }
  async function gmCommand(approval, contentHash) {
    const plan = sc.planSpellCommand({ approval, contentHash, tokens: tokens(), roomId: room.id, mapId: 'default', finalAmount: approval.roll.total, adjudicated: true });
    return command(gm, plan.entries, plan.extra);
  }
  async function castAccepted(spec, face) {
    const prepared = prepare(spec, face), approval = prepared.build();
    const before = protectedState();
    const registered = await ack(owner, 'actor_spell_approve', approval);
    assert.equal(registered.code, 'awaiting_gm', JSON.stringify(registered));
    assert.deepEqual(protectedState(), before, 'owner approval installs nothing');
    const cmd = await gmCommand(approval, registered.contentHash);
    assert.deepEqual(protectedState(), before, 'GM preparation installs nothing');
    const accepted = await ack(gm, 'actor_consequence', cmd);
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    return { prepared, approval, registered, cmd, accepted };
  }
  const assertPublicClean = value => {
    const text = JSON.stringify(value);
    assert.equal(text.includes('"notes"'), false, 'private bank leaked');
    assert.equal(text.includes(SENTINEL), false, 'private sentinel leaked');
    assert.equal(text.includes('custody'), false, 'custody evidence leaked');
  };
  const viewerAll = { reportable: () => true, rendered: () => false };

  it('1/2/7/8 empty bank → Opening I2/V1 → Resolving I1; 2 AP/8 mana once each; effective Spirit score; public output private-free', async() => {
    await setup();
    const receipts0 = actors.ledger(room).receipts.length;
    const first = await castAccepted(OPENING, OPENING.face);
    assert.deepEqual(bank(), OPENING.afterNotes); assert.deepEqual(pools(), [1, 4]);
    assert.deepEqual(first.approval.classPayment.price, { costs: [], gains: ['I', 'I', 'V'] });
    assert.deepEqual([foeToken().state.currentHp, foeToken().state.tempHealth], [30, 1]);
    const second = await castAccepted(RESOLVING, RESOLVING.face);
    assert.deepEqual(bank(), RESOLVING.afterNotes); assert.deepEqual(pools(), [0, 0]);
    assert.deepEqual(second.approval.classPayment.price, { costs: ['I', 'V'], gains: [] });
    assert.equal(actors.ledger(room).receipts.length, receipts0 + 2, 'exactly one receipt per accept');
    // 7: production combatAttributes effective Spirit SCORE (not raw/base/modifier, not twice-earned).
    const fixture = fixtures.character(), effective = attributes.combatAttributes(fixture).spirit;
    assert.equal(effective, 18);
    assert.notEqual(effective, fixture.stats.spirit); assert.notEqual(effective, fixture.baseStats.spirit); assert.notEqual(effective, Math.floor((effective - 10) / 2));
    assert.equal(second.approval.roll.constant, effective);
    assert.equal(second.approval.roll.total, RESOLVING.face + effective);
    assert.equal(second.approval.roll.reading, `1d8 + spirit → 1d8 + ${effective} (SPI score)`);
    assert.deepEqual([foeToken().state.currentHp, foeToken().state.tempHealth], [30 - (RESOLVING.face + effective - 1), 0]);
    // 8: receipts, GM-visible projection and narration carry no private bank/custody/sentinel.
    for (const { accepted } of [first, second]) {
      assertPublicClean(accepted.receipt); assertPublicClean(actors.publicReceipt(accepted.receipt));
      const narration = feed.buildFeed({ result: accepted, before: {}, viewer: viewerAll, live: false }).narration;
      assert.ok(narration && narration.text.length);
      assertPublicClean(narration); assertPublicClean(feed.chatLineFor(accepted, narration.text, viewerAll));
      assert.ok(sc.spellReceipt(accepted));
    }
    assertPublicClean(await snap(other));
  });

  for (const testCase of fixtures.cases.filter(c => ['wrong-pitch', 'insufficient-ap', 'insufficient-mana', 'empty-resolver'].includes(c.id))) {
    it(`3 ${testCase.id}: normal planner and crafted handler acceptance refuse with no partial spend or result`, async() => {
      await setup(testCase);
      const before = protectedState(), receipts = actors.ledger(room).receipts.length;
      const support = sc.supportSpell({ id: RESOLVING.id }, casterView());
      assert.equal(support.supported, true);
      // Normal planner path: never produces an approval.
      assert.throws(() => prepare(RESOLVING, RESOLVING.face).build());
      // Crafted owner approval using the honest approved terms against the real room state.
      const roll = sc.recordRoll('physical', support.reading, [[RESOLVING.face]]);
      const forged = { version: 1, roomId: room.id, approvalId: crypto.randomUUID(), actionEpoch: epoch, baseCommitSequence: actors.ledger(room).commitSequence, source: pcRef, target: foeRef,
        spell: { definitionId: support.definitionId, definitionHash: support.definitionHash, name: support.name, kind: 'damage', damageTypes: support.damageTypes }, roll, price: { ap: 1, mana: 4 },
        classPayment: { domain: 'musicalNotes', before: notesOf(testCase.notes), after: notesOf(testCase.id === 'wrong-pitch' ? [1, 1, 0, 0, 0, 0, 0] : testCase.id === 'empty-resolver' ? [0, 0, 0, 0, 0, 0, 0] : RESOLVING.afterNotes),
          price: { costs: ['I', 'V'], gains: [] } } };
      const refused = await ack(owner, 'actor_spell_approve', forged);
      assert.notEqual(refused.success, true); assert.notEqual(refused.code, 'awaiting_gm', JSON.stringify(refused));
      // Crafted GM acceptance of the unregistered approval.
      const crafted = await gmCommand(forged, actors.hash(forged)).catch(() => null)
        || await command(gm, [{ ref: pcRef, expectedRevision: revision(pcRef), finalResources: { ap: { current: 0, temp: 0 } }, classPayment: { mode: 'spell', domain: 'musicalNotes', approvalHash: actors.hash(forged) } }],
          { source: pcRef, target: foeRef, approval: { approvalId: forged.approvalId, contentHash: actors.hash(forged) }, adjudication: { definitionId: support.definitionId, definitionVersionOrHash: support.definitionHash, chosenResult: '{}', finalAmount: 1, adjustmentReason: 'x' } });
      const gmRefused = await ack(gm, 'actor_consequence', crafted);
      assert.notEqual(gmRefused.success, true, JSON.stringify(gmRefused));
      assert.deepEqual(protectedState(), before); assert.equal(actors.ledger(room).receipts.length, receipts);
      console.log(`      [${testCase.id}] owner=${refused.code} gm=${gmRefused.code}`);
    });
  }

  it('4 stale bank: changed home refuses old approval without mutation; retained roll needs fresh explicit approval; accepts once at new terms', async() => {
    await setup({ notes: RESOLVING.beforeNotes });
    const prepared = prepare(RESOLVING, RESOLVING.face), approval = prepared.build();
    const registered = await ack(owner, 'actor_spell_approve', approval);
    assert.equal(registered.code, 'awaiting_gm');
    const oldCommand = await gmCommand(approval, registered.contentHash);
    // While an approval is pending the P9 fence refuses every legitimate owner/GM bank write.
    assert.equal((await ack(owner, 'actor_consequence', await command(owner, [{ ref: pcRef, expectedRevision: revision(pcRef),
      classPayment: { mode: 'sync', before: { domain: 'musicalNotes', value: notesOf(RESOLVING.beforeNotes) }, after: { domain: 'musicalNotes', value: notesOf(fixtures.cases.find(c => c.id === 'stale-bank').concurrentNotes) } } }]))).code, 'class_payment_pending');
    // Authoritative restore changes the private home (same simulation as accepted P9 S5).
    pcToken().state.classPayment.value = notesOf(fixtures.cases.find(c => c.id === 'stale-bank').concurrentNotes);
    const before = protectedState(), receipts = actors.ledger(room).receipts.length, closed = once(owner, 'actor_spell_closed');
    assert.equal((await ack(gm, 'actor_consequence', oldCommand)).code, 'owner_reapproval_required');
    assert.deepEqual(protectedState(), before); assert.equal(actors.ledger(room).receipts.length, receipts);
    assert.deepEqual(await closed, { roomId: room.id, approvalId: approval.approvalId, contentHash: registered.contentHash, code: 'owner_reapproval_required' });
    assert.equal(sc.gmRefusal(false, 'owner_reapproval_required').phase, 'reapproval');
    assert.equal((await ack(owner, 'actor_spell_approve', approval)).code, 'approval_owner_reapproval_required');
    // Fresh explicit approval at the new terms retains the original roll (reapproveSpell semantics).
    const fresh = prepare(RESOLVING, RESOLVING.face).build(crypto.randomUUID(), prepared.roll);
    assert.deepEqual(fresh.roll, approval.roll);
    assert.deepEqual(fresh.classPayment.before.notes, [1, 0, 0, 0, 1, 0, 0]);
    const reg2 = await ack(owner, 'actor_spell_approve', fresh);
    assert.equal(reg2.code, 'awaiting_gm', JSON.stringify(reg2));
    const accepted = await ack(gm, 'actor_consequence', await gmCommand(fresh, reg2.contentHash));
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.deepEqual(bank(), [0, 0, 0, 0, 0, 0, 0]); assert.deepEqual(pools(), [1, 4]);
    assert.equal(actors.ledger(room).receipts.length, receipts + 1);
  });

  it('5 lost ACK: first command installs, only its ACK is dropped; same-command check twice returns one receipt/payment/outcome/narration', async() => {
    await setup({ notes: RESOLVING.beforeNotes });
    const prepared = prepare(RESOLVING, RESOLVING.face), approval = prepared.build();
    const registered = await ack(owner, 'actor_spell_approve', approval);
    const cmd = await gmCommand(approval, registered.contentHash), bytes = JSON.stringify(cmd);
    const receipts = actors.ledger(room).receipts.length, ownerSaw = once(owner, 'actor_consequence_accepted');
    gm.emit('actor_consequence', cmd); // no ack callback: the acceptance ACK is lost to the GM
    const broadcast = await ownerSaw;
    assert.equal(broadcast.receipt.commandId, cmd.commandId);
    assert.deepEqual(bank(), RESOLVING.afterNotes); assert.deepEqual(pools(), [1, 4]);
    const checks = [await ack(gm, 'actor_consequence', JSON.parse(bytes)), await ack(gm, 'actor_consequence', JSON.parse(bytes))];
    for (const check of checks) {
      assert.equal(check.success, true, JSON.stringify(check));
      assert.deepEqual(check.receipt, broadcast.receipt);
      assert.equal(feed.buildFeed({ result: check, before: {}, viewer: viewerAll, live: false }).narration.id, `p13a:${room.id}:${cmd.commandId}`);
    }
    assert.equal(actors.ledger(room).receipts.length, receipts + 1, 'one receipt');
    assert.deepEqual(bank(), RESOLVING.afterNotes); assert.deepEqual(pools(), [1, 4]);
    assert.equal(foeToken().state.currentHp, 30 - (approval.roll.total - 4));
    assert.ok(payments.consumedReceipt(room, approval.approvalId));
    assert.equal((await ack(gm, 'actor_consequence', await gmCommand(approval, registered.contentHash))).code, 'approval_consumed', 'a fabricated second command cannot pay again');
  });

  it('6 registered writer/installer refusal before commit: nothing installs; approval and roll retained; same command later accepts once', async() => {
    await setup({ notes: RESOLVING.beforeNotes });
    const prepared = prepare(RESOLVING, RESOLVING.face), approval = prepared.build();
    const registered = await ack(owner, 'actor_spell_approve', approval);
    const cmd = await gmCommand(approval, registered.contentHash);
    const before = protectedState(), receipts = actors.ledger(room).receipts.length, retained = actors.clone(payments.get(room, approval.approvalId));
    const admit = writer.admitConsequence;
    writer.admitConsequence = () => ({ queued: false, code: 'writer_admission_refused' });
    let refused;
    try {refused = await ack(gm, 'actor_consequence', cmd);} finally {writer.admitConsequence = admit;}
    assert.equal(refused.code, 'writer_admission_refused');
    assert.deepEqual(protectedState(), before); assert.equal(actors.ledger(room).receipts.length, receipts);
    assert.deepEqual(payments.get(room, approval.approvalId), retained, 'approval/roll custody retained');
    assert.equal(payments.consumedReceipt(room, approval.approvalId), null);
    const accepted = await ack(gm, 'actor_consequence', cmd);
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.deepEqual(bank(), RESOLVING.afterNotes); assert.equal(actors.ledger(room).receipts.length, receipts + 1);
  });

  it('scope: only the approved pair is newly admitted; other resolvers stay manual', () => {
    const caster = { ...fixtures.character({ notes: [2, 2, 2, 2, 2, 2, 2] }) };
    for (const id of ['minstrel_harmony_strike', 'minstrel_mending_cadence', 'minstrel_perfect_cadence', 'minstrel_resonant_strike', 'minstrel_dissonant_strike']) {
      assert.equal(sc.supportSpell({ id }, caster).supported, false, id);
    }
    assert.equal(sc.supportSpell({ id: 'arc_arcane_missile' }, { ...caster, class: 'Arcanoneer' }).supported, false);
  });

  it('existing Harmonic Strike still registers and commits once; held Harmony Strike refuses', async() => {
    await setup();
    const harmonic = { id: 'minstrel_harmonic_strike', face: 3 };
    const before = actors.ledger(room).receipts.length;
    const result = await castAccepted(harmonic, harmonic.face);
    assert.deepEqual(bank(), [1, 0, 2, 0, 0, 0, 0]);
    assert.deepEqual(pools(), [1, 4]);
    assert.equal(actors.ledger(room).receipts.length, before + 1);
    const held = actors.clone(result.approval);
    held.approvalId = crypto.randomUUID(); held.spell.definitionId = 'minstrel_harmony_strike';
    const state = protectedState();
    const refused = await ack(owner, 'actor_spell_approve', held);
    assert.equal(refused.code, 'unsupported_spell_definition');
    assert.deepEqual(protectedState(), state);
  });

  it('registered pair approval rejects altered price, recipe, definition and metadata without mutation', async() => {
    await setup({ notes: RESOLVING.beforeNotes });
    const approval = prepare(RESOLVING, RESOLVING.face).build();
    for (const alter of [
      a => { a.price.mana = 3; },
      a => { a.classPayment.price.costs = ['I']; a.classPayment.after.notes = [1, 0, 0, 0, 1, 0, 0]; },
      a => { a.spell.definitionHash = 'p9-spell:v1/' + '0'.repeat(64); },
      a => { a.spell.secondaryEffect = 'stunned'; },
    ]) {
      const changed = actors.clone(approval); changed.approvalId = crypto.randomUUID(); alter(changed);
      const state = protectedState(), receipts = actors.ledger(room).receipts.length;
      const refused = await ack(owner, 'actor_spell_approve', changed);
      assert.notEqual(refused.code, 'awaiting_gm', JSON.stringify(refused));
      assert.deepEqual(protectedState(), state);
      assert.equal(actors.ledger(room).receipts.length, receipts);
    }
  });
});
