/* Fixture builders and wire requests adapted from p14m4cMissingHealth, p14TimedSaveBranch,
 * p14m5Periodic, p14OwnerPcSelfHeal and p14ComposedClassPayment production tests.
 * This is test plumbing, not an alternate compatibility validator. */
const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./productionStackServer');
const { FirebaseBatchWriter } = require('../../services/syncService');
const actors = require('../../services/actorConsequences');
const installed = require('../../services/installedAuthoredAbilities');
const registry = require('../../services/installedDefinitionRegistry');
const payments = require('../../services/spellPayments');
const pure = require('../../../vtt-react/src/services/authoredAbility');
const effect = require('../../../vtt-react/src/services/authoredEffect');
const catalogue = require('../../shared/services/catalogueAbility.cjs');
const profiles = require('../../shared/data/catalogueAbilityProfiles.json');
const manifest = require('../fixtures/componentCompatibility.json');
const { recordFor } = require('../fixtures/componentCompatibilityRecords.cjs');
const once = (socket, event) => new Promise(resolve => socket.once(event, resolve));
const ack = (socket, event, data) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error(event)), 5000);
  socket.emit(event, data, result => { clearTimeout(timer); resolve(result); });
});
async function createHarness() {
  const writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
  const server = createProductionStackServer({ firebaseBatchWriter: writer });
  const sockets = [], pins = [];
  const h = { server, writer, close: async() => { for (const p of pins) { const i = profiles.profiles.indexOf(p); if (i >= 0) { profiles.profiles.splice(i, 1); } } sockets.forEach(s => s.disconnect()); await server.stop(); } };
  try {
    await server.start();
    for (const e of ['actor_bind', 'actor_authored_admit', 'actor_spell_approve', 'actor_consequence', 'actor_turn_boundary', 'actor_periodic_resolve', 'combat_started']) { server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 }); }
    const gu = server.nextUserId(), uid = server.nextUserId();
    for (const [role, id] of [['gm', gu], ['owner', uid], ['observer', server.nextUserId()]]) {
      server.registerAuthToken(role, id); h[role] = server.connect({ token: role }); sockets.push(h[role]); await once(h[role], 'connect');
      if (role === 'gm') { h.room = await server.seedRoom(h.gm.id, { gmUserId: gu }); }
      else { const joined = once(h[role], 'room_joined'); h[role].emit('join_room', { roomId: h.room.id, playerName: role, password: '' }); await joined; }
    }
    h.live = () => server.rooms.get(h.room.id);
    h.token = ref => actors.locate(h.live(), ref).token;
    h.base = () => ({ version: 1, roomId: h.room.id, commandId: uuid(), actionEpoch: actors.epoch(h.live()), baseCommitSequence: actors.ledger(h.live()).commitSequence });
    const map = () => h.live().gameState.maps.default; // actor_bind replaces gameState
    for (const id of ['pc', 'ally']) {
      server.setCharacterOwner(id, uid);
      map().characterTokens[id] = { id, ownerUserId: uid, character: { id, class: 'Arcanoneer', stats: { intelligence: 18 }, health: { current: 23, max: 40 }, mana: { current: 20, max: 20 }, actionPoints: { current: 10, max: 10 }, tempHealth: 9, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
      const r = await ack(h.gm, 'actor_bind', { roomId: h.room.id, ref: { kind: 'character', roomId: h.room.id, mapId: 'default', tokenId: id, ownerUid: uid, characterId: id }, snapshotHash: actors.hash(map().characterTokens[id]) });
      assert.equal(r.success, true, JSON.stringify(r)); h[id] = r.ref;
    }
    for (const id of ['foe', 'source']) {
      map().tokens[id] = { id, stats: { maxHp: 100, maxMana: 20, maxAP: 10, speed: 30 }, state: { currentHp: 70, currentMana: 20, currentActionPoints: 10, tempHealth: 2, tempMana: 2, tempActionPoints: 1, conditions: [] } };
      const r = await ack(h.gm, 'actor_bind', { roomId: h.room.id, ref: { kind: 'creature', roomId: h.room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(map().tokens[id]) });
      assert.equal(r.success, true, JSON.stringify(r)); h[id] = r.ref;
    }
    h.boundary = async(mode = 'advance') => {
      const combat = h.live().gameState.combat;
      const r = await ack(h.gm, 'actor_turn_boundary', { ...h.base(), mode, combatHash: actors.hash(combat), expectedClock: mode === 'adopt' ? null : { id: combat.effectLifecycle.id, sequence: combat.effectLifecycle.sequence } });
      assert.equal(r.success, true, JSON.stringify(r)); return r;
    };
    h.combat = async() => {
      const r = await ack(h.gm, 'combat_started', { roomId: h.room.id, turnOrder: [h.pc, h.foe].map(ref => ({ tokenId: ref.tokenId, actorRef: ref })), currentTurnIndex: 0, round: 1 });
      assert.equal(r.success, true, JSON.stringify(r)); await h.boundary('adopt');
    };
    h.admit = async(record, source) => ack(h.gm, 'actor_authored_admit', { roomId: h.room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(h.live()).revision, definitionVersion: 1,
      ...(source ? { source, expectedSourceRevision: h.token(source).state.actorContract.revision } : { record, classId: 'arcanoneer' }) });
    h.entry = ref => installed.list(h.live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
    h.pin = async(definition) => {
      // Same explicit registry-planner fixture seam as p14ComposedClassPayment. Never persisted to disk.
      const d = actors.clone(definition);
      d.classPayment = { domain: 'elementalSpheres', price: { costs: ['rime', 'rime'], gains: [] } };
      d.catalogueSource = { classId: 'arcanoneer', spellId: `SERVER-FIXTURE-${uuid()}`, recordHash: actors.hash({ fixture: uuid() }) };
      const p = { capability: d.capability, ...d.catalogueSource, executable: catalogue.definitionProjection(d) };
      pins.push(p); profiles.profiles.push(p);
      h.token(h.pc).state.classPayment = { version: 1, domain: 'elementalSpheres', value: { type: 'elementalSpheres', spheres: ['rime', 'rime', 'ember'] } };
      const c = registry.compileDefinition(d); assert.equal(c.ok, true, JSON.stringify(c));
      const planner = registry.createDefinitionRegistry({ authorize: async() => ({ ok: true, roomId: h.room.id, uid: h.live().gmId, gmUid: h.live().gmId, principalBound: true, authorityCurrent: true, rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1' }) });
      const plan = await planner.planAdmit(installed.registry(h.live()), { roomId: h.room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(h.live()).revision, definition: d, expectedDefinitionHash: c.definitionHash });
      assert.equal(plan.ok, true, JSON.stringify(plan)); h.live().gameState.authoredSpellRegistry = plan.nextRegistry;
      return { entry: h.entry(plan.definitionRef), pin: p, definition: d };
    };
    return h;
  } catch (e) { await h.close(); throw e; }
}
function approvalFor(h, e, target = h.foe) {
  const d = e.canonicalDefinition, cap = d.capability || pure.CAPABILITY, direct = d.effects ? d.effects.direct : d.effect;
  const attrs = Object.fromEntries(pure.formulaAttributes(direct?.formula || '').map(n => [n, h.token(h.pc).character.stats[n]]));
  const hp = h.token(h.pc).character.health, rollHealth = { current: hp.current, max: hp.max };
  let reading, roll = null;
  if (direct) {
    reading = cap === pure.DETERMINISTIC_CAPABILITY ? pure.readDeterministicFormula(direct.formula, attrs, rollHealth)
      : cap === pure.HEALTH_CAPABILITY ? pure.readHealthFormula(direct.formula, attrs, rollHealth)
        : Object.keys(attrs).length ? pure.readScaledFormula(direct.formula, attrs) : pure.readFormula(direct.formula);
    const dice = reading.dice.map(g => ({ sides: g.sides, faces: Array(g.count).fill(4) }));
    roll = { mode: cap === pure.DETERMINISTIC_CAPABILITY ? 'deterministic' : 'physical', dice, constant: reading.constant, reading: reading.reading, total: dice.reduce((s, g) => s + g.faces.reduce((a, b) => a + b, 0), reading.constant) };
  }
  const a = { version: 1, roomId: h.room.id, approvalId: uuid(), actionEpoch: actors.epoch(h.live()), baseCommitSequence: actors.ledger(h.live()).commitSequence, source: h.pc, target,
    spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${cap}/${e.definitionRef.definitionHash}`, name: d.name, kind: d.effects ? 'effect' : direct.kind, damageTypes: direct?.damageTypes || [] },
    roll, price: e.descriptor.price, classPayment: d.classPayment ? { ...actors.clone(d.classPayment), before: actors.clone(h.token(h.pc).state.classPayment.value), after: { type: 'elementalSpheres', spheres: ['ember'] } } : null,
    ...(d.effects ? { effectTerms: effect.termsFor(d) } : {}) };
  if ([pure.FORMULA_CAPABILITY, pure.HEALTH_CAPABILITY, pure.DETERMINISTIC_CAPABILITY].includes(cap) || Object.keys(attrs).length) {
    const projected = require('../../services/roomAccessService').projectTokenForClient(h.token(h.pc));
    Object.assign(a, { rollAttributes: attrs, formulaSourceRevision: h.token(h.pc).state.actorContract.revision, formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }) });
    if (reading?.readsHealth) { a.rollHealth = rollHealth; }
  }
  return a;
}
function commandFor(h, a, branch = a.effectTerms?.save ? 'failed' : undefined) {
  const pools = actors.resources(h.token(a.source), a.source.kind), hp = actors.resources(h.token(a.target), a.target.kind).hp;
  const direct = a.effectTerms ? a.effectTerms.direct : { kind: a.spell.kind }, amount = direct ? a.roll.total : 0;
  const pay = {};
  for (const k of ['ap', 'mana']) { if (a.price[k]) { pay[k] = payments.tempFirst(pools[k].current, pools[k].temp, a.price[k]); } }
  if (!Object.keys(pay).length) { pay.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0); }
  const self = actors.hash(a.source) === actors.hash(a.target);
  const targetEntry = { ref: a.target, expectedRevision: h.token(a.target).state.actorContract.revision };
  if (direct) { targetEntry.finalResources = { hp: direct.kind === 'healing' ? { current: Math.min(hp.max, hp.current + amount), temp: hp.temp } : { current: Math.max(0, hp.current - Math.max(0, amount - hp.temp)), temp: Math.max(0, hp.temp - amount) } }; }
  let chosen = { capability: a.spell.definitionHash.split('/')[0], approvalId: a.approvalId, kind: a.spell.kind, roll: a.roll, ...(a.rollHealth ? { rollHealth: a.rollHealth } : {}), gmConfirmed: true };
  if (self) { chosen.actualHealing = targetEntry.finalResources.hp.current - hp.current; }
  if (a.effectTerms) {
    const plan = effect.conditionApplies(a.effectTerms, branch) ? effect.conditionPlan(a, h.token(a.target).state.conditions) : { ops: null, combination: null };
    if (plan.ops) { targetEntry.conditions = plan.ops; }
    chosen = effect.resultFor(a, { gmConfirmed: true, timing: a.effectTerms.timing, timingNote: 'GM confirms range and eligibility', evidence: '' }, plan.combination, branch);
  }
  const sourceEntry = { ref: a.source, expectedRevision: h.token(a.source).state.actorContract.revision, finalResources: pay,
    ...(a.classPayment ? { classPayment: { mode: 'spell', domain: a.classPayment.domain, approvalHash: actors.hash(a) } } : {}) };
  return { ...h.base(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
    actors: self ? [{ ...sourceEntry, finalResources: { ...pay, ...targetEntry.finalResources } }] : [sourceEntry, targetEntry],
    adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: amount, adjustmentReason: '', chosenResult: JSON.stringify(chosen) } };
}
module.exports = { manifest, recordFor, createHarness, approvalFor, commandFor, ack };
