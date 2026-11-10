const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const registry = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const pure = require('../shared/services/authoredAbility');
const effect = require('../shared/services/authoredEffect');
const timing = require('../shared/services/sharedEffectTiming');
const catalogue = require('../shared/services/catalogueAbility.cjs');
const profiles = require('../shared/data/catalogueAbilityProfiles.json');
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });
const once = (s, e) => new Promise(r => s.once(e, r));

describe('existing class payments in composed effects — explicit SERVER FIXTURES ONLY', function() {
  this.timeout(20000);
  let server, room, gm, owner, pc, foe, writer, originalProfiles;
  const token = ref => actors.locate(room, ref).token;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence });
  beforeEach(async() => {
    originalProfiles = profiles.profiles.slice();
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_spell_approve', 'actor_consequence', 'actor_periodic_resolve', 'actor_turn_boundary']) server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    const gmUid = server.nextUserId(), ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    owner = server.connect({ token: 'owner' }); await once(owner, 'connect'); const joined = once(owner, 'room_joined'); owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' }); await joined;
    server.setCharacterOwner('c', ownerUid);
    const map = room.gameState.maps.default;
    map.characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', class: 'Arcanoneer', stats: { intelligence: 14 }, health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    map.tokens.foe = { id: 'foe', stats: { maxHp: 40, maxMana: 0, maxAP: 4 }, state: { currentHp: 30, currentMana: 0, currentActionPoints: 4, tempHealth: 3, conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
    assert.ok(pc); assert.ok(foe);
  });
  afterEach(async() => { profiles.profiles.splice(0, profiles.profiles.length, ...originalProfiles); gm?.disconnect(); owner?.disconnect(); await server.stop(); });
  async function refuses(socket, event, data, code) {
    const before = actors.clone(room.gameState), r = await ack(socket, event, data);
    assert.equal(r.success, false, JSON.stringify(r)); assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(room.gameState, before); return r;
  }
  const sphereBefore = () => ({ type: 'elementalSpheres', spheres: ['rime', 'rime', 'ember'] });
  const sphereSpec = () => ({ domain: 'elementalSpheres', price: { costs: ['rime', 'rime'], gains: [] } });
  async function fixture({ spec = sphereSpec(), before = sphereBefore(), after = { type: 'elementalSpheres', spheres: ['ember'] }, periodic = true, formula = '2d8 + intelligence/3', classId = 'arcanoneer', kind = 'damage' } = {}) {
    token(pc).character.class = { arcanoneer: 'Arcanoneer', minstrel: 'Minstrel', martyr: 'Martyr' }[classId];
    token(pc).state.classPayment = { version: 1, domain: spec.domain, value: actors.clone(before) };
    const d = { schemaVersion: 3, capability: pure.EFFECT_CAPABILITY, scope: { roomId: room.id }, definitionId: uuid(), definitionVersion: 1,
      name: 'SERVER FIXTURE — not a real ability', description: 'Explicit isolated plumbing fixture; never a production pin.', binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId }, spellType: 'ACTION', castTimeType: 'IMMEDIATE',
      targeting: { kind: 'single', maxTargets: 1, rangeFeet: 30, restriction: 'any' }, resourceCost: { actionPoints: 2, mana: 3 },
      effects: { direct: { kind, formula, ...(kind === 'damage' ? { damageTypes: ['rime'] } : {}) }, condition: periodic ? { kind: 'periodic', tick: { kind, formula: '1d4', ...(kind === 'damage' ? { damageTypes: ['rime'] } : {}) }, tickRoll: 'each-tick', label: 'Fixture tick' } : { kind: 'movement', feet: -10, label: 'Fixture slow' } },
      timing: { expiryPolicy: periodic ? 'target-start-count' : 'target-next-end', ...(periodic ? { occurrences: 2 } : {}), durationText: 'Two explicit target starts', authoredDuration: null, gmNote: 'GM confirms exact target and range' },
      classPayment: spec, catalogueSource: { classId, spellId: 'SERVER-FIXTURE-' + uuid(), recordHash: actors.hash({ fixture: uuid() }) } };
    const pin = { capability: d.capability, ...d.catalogueSource, executable: catalogue.definitionProjection(d) };
    profiles.profiles.push(pin);
    const compiled = registry.compileDefinition(d); assert.equal(compiled.ok, true, JSON.stringify(compiled));
    // Explicit server setup uses the production registry planner; ordinary Wizard/catalogue admission remains closed.
    const plan = await registry.createDefinitionRegistry({ authorize: async() => ({ ok: true, roomId: room.id, uid: room.gmId, gmUid: room.gmId, principalBound: true, authorityCurrent: true, rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1' }) }).planAdmit(installed.registry(room),
      { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definition: d, expectedDefinitionHash: compiled.definitionHash });
    assert.equal(plan.ok, true, JSON.stringify(plan)); room.gameState.authoredSpellRegistry = plan.nextRegistry;
    return { d, pin, ref: plan.definitionRef, before, after };
  }
  function approval(f) {
    const names = pure.formulaAttributes(f.d.effects.direct.formula), attrs = Object.fromEntries(names.map(n => [n, 14]));
    const reading = names.length ? pure.readScaledFormula(f.d.effects.direct.formula, attrs) : pure.readFormula(f.d.effects.direct.formula);
    const dice = reading.dice.map(g => ({ sides: g.sides, faces: Array(g.count).fill(4) }));
    const projected = require('../services/roomAccessService').projectTokenForClient(token(pc));
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target: foe,
      spell: { definitionId: pure.actionId(f.ref), definitionHash: `${pure.EFFECT_CAPABILITY}/${f.ref.definitionHash}`, name: f.d.name, kind: 'effect', damageTypes: f.d.effects.direct.damageTypes || [] },
      price: { ap: 2, mana: 3 }, classPayment: { domain: f.d.classPayment.domain, price: f.d.classPayment.price, before: f.before, after: f.after }, effectTerms: effect.termsFor(f.d),
      roll: { mode: 'physical', dice, constant: reading.constant, reading: reading.reading, total: dice.reduce((a, g) => a + g.faces.reduce((s, n) => s + n, 0), reading.constant) },
      ...(names.length ? { rollAttributes: attrs, formulaSourceRevision: token(pc).state.actorContract.revision, formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }) } : {}) };
  }
  async function approve(a) { const before = actors.clone(room.gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(room.gameState, before); return r; }
  function command(a) {
    const pools = actors.resources(token(pc), 'character'), hp = actors.resources(token(foe), 'creature').hp, amount = a.roll.total;
    const plan = effect.conditionPlan(a, token(foe).state.conditions);
    return { ...base(), source: pc, target: foe, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { ap: payments.tempFirst(pools.ap.current, pools.ap.temp, 2), mana: payments.tempFirst(pools.mana.current, pools.mana.temp, 3) }, classPayment: { mode: 'spell', domain: a.classPayment.domain, approvalHash: actors.hash(a) } },
        { ref: foe, expectedRevision: token(foe).state.actorContract.revision, conditions: plan.ops, finalResources: { hp: a.effectTerms.direct.kind === 'damage' ? { current: Math.max(0, hp.current - Math.max(0, amount - hp.temp)), temp: Math.max(0, hp.temp - amount) } : { current: Math.min(hp.max, hp.current + amount), temp: hp.temp } } }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: amount, adjustmentReason: '', chosenResult: JSON.stringify(effect.resultFor(a, { gmConfirmed: true, timing: a.effectTerms.timing, timingNote: 'GM confirms', evidence: '' }, plan.combination)) } };
  }
  async function combat() {
    assert.equal((await ack(gm, 'combat_started', { roomId: room.id, turnOrder: [pc, foe].map(ref => ({ tokenId: ref.tokenId, actorRef: ref })), currentTurnIndex: 0, round: 1 })).success, true);
    await boundary('adopt');
  }
  async function boundary(mode = 'advance') {
    const c = room.gameState.combat, r = await ack(gm, 'actor_turn_boundary', { ...base(), mode, combatHash: actors.hash(c), expectedClock: mode === 'adopt' ? null : { id: c.effectLifecycle.id, sequence: c.effectLifecycle.sequence } });
    assert.equal(r.success, true, JSON.stringify(r));
  }
  it('one atomic initial cast pays temporary pools and bank once; immediate HP, periodic install, exact replay and independently rolled ticks', async() => {
    await combat(); const f = await fixture(), a = approval(f); await approve(a); const c = command(a), r = await ack(gm, 'actor_consequence', c);
    assert.equal(r.success, true, JSON.stringify(r));
    assert.deepEqual(token(pc).state.classPayment.value, { type: 'elementalSpheres', spheres: ['ember'] });
    const paid = actors.clone(actors.resources(token(pc), 'character'));
    assert.deepEqual(paid.ap, { current: 3, temp: 0, max: 4 }); assert.deepEqual(paid.mana, { current: 9, temp: 0, max: 10 });
    assert.equal(token(foe).state.currentHp, 21); assert.equal(token(foe).state.tempHealth, 0); assert.equal(token(foe).state.conditions.length, 1);
    const state = actors.clone(room.gameState), replay = await ack(gm, 'actor_consequence', c); assert.equal(replay.success, true); assert.deepEqual(replay.receipt, r.receipt); assert.deepEqual(room.gameState, state);
    await refuses(gm, 'actor_consequence', { ...c, commandId: uuid() }, 'approval_consumed');
    await boundary(); const t = timing.dueTicks(room.gameState.combat)[0]; assert.ok(t);
    const tick = { ...base(), tickId: t.tickId, mode: 'apply', expectedRevision: token(foe).state.actorContract.revision, roll: { mode: 'physical', dice: [{ sides: 4, faces: [3] }], constant: 0, total: 3, reading: '1d4' }, finalAmount: 3, adjustmentReason: '' };
    await refuses(gm, 'actor_periodic_resolve', { ...tick, classPayment: a.classPayment }, 'invalid_consequence');
    const tr = await ack(gm, 'actor_periodic_resolve', tick); assert.equal(tr.success, true, JSON.stringify(tr));
    assert.equal(token(foe).state.currentHp, 18); assert.deepEqual(actors.resources(token(pc), 'character'), paid);
    assert.deepEqual(token(pc).state.classPayment.value, f.after); assert.deepEqual((await ack(gm, 'actor_periodic_resolve', tick)).receipt, tr.receipt);
  });
  it('supports the existing plain immediate + movement composition without changing M1 save branches', async() => {
    await combat();
    const f = await fixture({ periodic: false, formula: '1d6+2' }), a = approval(f); await approve(a);
    const r = await ack(gm, 'actor_consequence', command(a)); assert.equal(r.success, true, JSON.stringify(r)); assert.equal(token(foe).state.conditions.length, 1); assert.match(token(foe).state.conditions[0].description, /10/);
  });
  for (const [classId, domain, before, after, price] of [
    ['minstrel', 'musicalNotes', { type: 'musicalNotes', notes: [0, 0, 0, 0, 0, 0, 0] }, { type: 'musicalNotes', notes: [1, 0, 0, 0, 0, 0, 0] }, { costs: [], gains: ['I'] }],
    ['martyr', 'devotionGauge', { type: 'devotionGauge', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 }, { type: 'devotionGauge', current: 1, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 1 }, { cost: 0, gain: 1, required: 0 }]
  ]) it(`${domain}: existing gain occurs exactly once, including replay`, async() => {
    await combat(); const f = await fixture({ spec: { domain, price }, before, after, classId }), a = approval(f); await approve(a); const c = command(a);
    const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); assert.deepEqual(token(pc).state.classPayment.value, after);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.deepEqual(token(pc).state.classPayment.value, after);
    const paid = actors.clone(actors.resources(token(pc), 'character')); await boundary(); const t = timing.dueTicks(room.gameState.combat)[0];
    const tick = { ...base(), tickId: t.tickId, mode: 'apply', expectedRevision: token(foe).state.actorContract.revision, roll: { mode: 'physical', dice: [{ sides: 4, faces: [2] }], constant: 0, total: 2, reading: '1d4' }, finalAmount: 2, adjustmentReason: '' };
    const tr = await ack(gm, 'actor_periodic_resolve', tick); assert.equal(tr.success, true, JSON.stringify(tr)); assert.deepEqual((await ack(gm, 'actor_periodic_resolve', tick)).receipt, tr.receipt);
    assert.deepEqual(token(pc).state.classPayment.value, after); assert.deepEqual(actors.resources(token(pc), 'character'), paid);
  });
  it('insufficient resources, lossy sphere/note overflow, changed payment and wrong caster/target refuse without mutation', async() => {
    const f = await fixture({ periodic: false, formula: '1d6+2' }), a = approval(f);
    const poor = actors.clone(a); poor.classPayment.before.spheres = []; poor.classPayment.after.spheres = []; await refuses(owner, 'actor_spell_approve', poor, 'insufficient_class_resource');
    const altered = actors.clone(a); altered.classPayment.price.costs = []; altered.classPayment.after = altered.classPayment.before; await refuses(owner, 'actor_spell_approve', altered, 'authored_approval_mismatch');
    token(pc).character.mana.current = 0; token(pc).character.tempMana = 0; await refuses(owner, 'actor_spell_approve', a, 'insufficient_resources'); token(pc).character.mana.current = 10; token(pc).character.tempMana = 2;
    token(pc).character.class = 'Martyr'; await refuses(owner, 'actor_spell_approve', a, 'unsupported_source_route'); token(pc).character.class = 'Arcanoneer';
    await refuses(owner, 'actor_spell_approve', { ...a, target: pc }, 'invalid_spell_approval');
    for (const domain of ['elementalSpheres', 'musicalNotes']) {
      const before = domain === 'elementalSpheres' ? { type: domain, spheres: Array(12).fill('rime') } : { type: domain, notes: [5, 0, 0, 0, 0, 0, 0] };
      const gain = domain === 'elementalSpheres' ? 'rime' : 'I';
      const f2 = await fixture({ spec: { domain, price: { costs: [], gains: [gain] } }, before, after: before, classId: domain === 'elementalSpheres' ? 'arcanoneer' : 'minstrel', periodic: false, formula: '1d6' });
      await refuses(owner, 'actor_spell_approve', approval(f2), 'class_payment_capacity');
    }
    const full = { type: 'devotionGauge', current: 6, max: 6, damage: 100, earnedLevels: 6, spentLevels: 0, bonusLevels: 0 };
    const f3 = await fixture({ spec: { domain: 'devotionGauge', price: { cost: 0, gain: 1, required: 0 } }, before: full, after: full, classId: 'martyr', periodic: false, formula: '1d6' });
    await refuses(owner, 'actor_spell_approve', approval(f3), 'class_payment_capacity');
  });
  it('stale bank and formula snapshot require explicit existing reapproval with retained faces', async() => {
    await combat(); const f = await fixture(), a = approval(f); await approve(a); const c = command(a);
    token(pc).state.classPayment.value.spheres.push('ember'); await refuses(gm, 'actor_consequence', c, 'owner_reapproval_required');
    const fresh = { ...f, before: actors.clone(token(pc).state.classPayment.value), after: { type: 'elementalSpheres', spheres: ['ember', 'ember'] } };
    const a2 = approval(fresh); assert.deepEqual(a2.roll.dice, a.roll.dice); await approve(a2);
    token(pc).character.stats.intelligence = 15; await refuses(gm, 'actor_consequence', command(a2), 'owner_reapproval_required');
    const a3 = approval(fresh); await approve(a3); assert.equal((await ack(gm, 'actor_consequence', command(a3))).success, true);
  });
  it('writer failure changes nothing; identical original command can recover once', async() => {
    await combat(); const f = await fixture(), a = approval(f); await approve(a); const c = command(a), write = writer.admitConsequence;
    room.isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'fixture_failure' }); await refuses(gm, 'actor_consequence', c, 'fixture_failure'); writer.admitConsequence = write;
    const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    const snapshot = writer.pendingWrites.get(room.id).snapshot;
    assert.deepEqual(snapshot.maps.default.characterTokens.pc.state.classPayment.value, f.after);
    assert.equal(snapshot.maps.default.characterTokens.pc.character.mana.current, 9);
    assert.equal(snapshot.maps.default.characterTokens.pc.character.actionPoints.current, 3);
    assert.equal(snapshot.maps.default.tokens.foe.state.currentHp, 21); assert.equal(snapshot.maps.default.tokens.foe.state.conditions.length, 1);
    assert.equal(Object.keys(snapshot.combat.effectLifecycle.schedules).length, 1);
    assert.equal(snapshot.actorConsequences.receipts.filter(x => x.commandId === c.commandId).length, 1);
    const state = actors.clone(room.gameState); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.deepEqual(room.gameState, state);
  });
  for (const change of ['bank', 'pin', 'source']) it(`rechecks ${change} across the final authority await; no cast mutation`, async() => {
    await combat(); const f = await fixture(), a = approval(f); await approve(a); const c = command(a);
    const original = server.authorityService.assertCurrent; let release, reached, hold = true;
    const gate = new Promise(r => { release = r; }), entered = new Promise(r => { reached = r; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; reached(); await gate; } return original(...args); };
    const pending = ack(gm, 'actor_consequence', c); await entered;
    if (change === 'bank') token(pc).state.classPayment.value.spheres.push('ember');
    if (change === 'source') token(pc).character.stats.intelligence++;
    if (change === 'pin') profiles.profiles.splice(profiles.profiles.indexOf(f.pin), 1);
    const state = actors.clone(room.gameState); release(); const r = await pending; server.authorityService.assertCurrent = original;
    assert.equal(r.success, false, JSON.stringify(r)); assert.equal(r.code, change === 'pin' ? 'catalogue_provenance_untrusted' : 'owner_reapproval_required'); assert.deepEqual(room.gameState, state);
  });
  it('self-declared or forged pin, route/composition/payment grafts and changed executable fields refuse', async() => {
    const f = await fixture({ periodic: false, formula: '1d6+2' });
    const changes = [d => delete d.catalogueSource, d => d.catalogueSource.recordHash = actors.hash({ forged: true }), d => d.capability = pure.FORMULA_CAPABILITY,
      d => d.effects.condition.feet = -5, d => d.classPayment.price.costs.pop(), d => d.resourceCost.mana++, d => d.timing.durationText = 'changed', d => d.effects.direct.formula = '2d6'];
    for (const change of changes) { const d = actors.clone(f.d); change(d); assert.equal(registry.compileDefinition(d).ok, false, JSON.stringify(d)); }
    const forged = actors.clone(f.d); forged.catalogueSource = { ...forged.catalogueSource, recordHash: actors.hash({ id: 'forged', classPayment: forged.classPayment }) }; assert.equal(catalogue.verifyDefinition(forged).ok, false);
    // Genuine M4B pin cannot authorize this route/composition/payment.
    const graft = actors.clone(f.d); graft.catalogueSource = actors.clone(originalProfiles[0]); delete graft.catalogueSource.executable; delete graft.catalogueSource.source; delete graft.catalogueSource.name; delete graft.catalogueSource.capability;
    assert.equal(registry.compileDefinition(graft).ok, false);
    const a = approval(f); await approve(a); f.pin.executable.resourceCost.mana++;
    await refuses(gm, 'actor_consequence', command(a), 'catalogue_provenance_untrusted');
  });
  it('reconciliation gates: class payment never combines with the installed save or cooldown routes', async() => {
    const f = await fixture({ periodic: false, formula: '1d6+2' });
    // Save + class payment: refused at admission and, if forged into an approval, at the approval/bind shape.
    const saved = actors.clone(f.d);
    saved.effects.save = { scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' };
    saved.timing = { expiryPolicy: 'gm-manual', durationText: 'Manual', authoredDuration: null, gmNote: 'GM removes' };
    assert.equal(registry.compileDefinition(saved).ok, false);
    const c = await ack(gm, 'actor_spell_approve', { ...approval(f), effectTerms: { ...effect.termsFor(f.d), save: { scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' } } });
    assert.equal(c.success, false); assert.equal(c.code, 'unsupported_class_payment_route', JSON.stringify(c));
    // Cooldown + class payment: refused at admission; the unchanged cooldown route also refuses a class-paid approval.
    const cooled = actors.clone(f.d);
    cooled.effects.condition = { kind: 'periodic', tick: { kind: 'damage', formula: '1d4', damageTypes: ['rime'] }, tickRoll: 'each-tick', label: 'Fixture tick' };
    cooled.timing = { expiryPolicy: 'target-start-count', occurrences: 2, durationText: 'Two starts', authoredDuration: null, gmNote: 'GM confirms' };
    cooled.cooldown = { cooldownType: 'authenticated_caster_start', cooldownValue: 1 };
    assert.equal(registry.compileDefinition(cooled).ok, false);
    assert.throws(() => require('../services/authoredCooldowns').check(room, approval(f), { cooldown: cooled.cooldown, definitionId: f.d.definitionId }), error => error.code === 'unsupported_cooldown_route');
    // Unchanged routes: save-only and cooldown-only definitions still compile under their own reviewed contracts.
    const plain = actors.clone(f.d); delete plain.classPayment; delete plain.catalogueSource;
    const saveOnly = actors.clone(plain); saveOnly.effects.save = saved.effects.save; saveOnly.timing = saved.timing;
    assert.equal(registry.compileDefinition(saveOnly).ok, true);
    const cooldownOnly = actors.clone(plain); cooldownOnly.effects.condition = cooled.effects.condition; cooldownOnly.timing = cooled.timing; cooldownOnly.cooldown = cooled.cooldown;
    assert.equal(registry.compileDefinition(cooldownOnly).ok, true);
  });
  it('catalogueSource without a typed payment, or a payment without its pin, refuses at admission', async() => {
    const f = await fixture({ periodic: false, formula: '1d6+2' });
    const sourceOnly = actors.clone(f.d); delete sourceOnly.classPayment;
    assert.equal(registry.compileDefinition(sourceOnly).ok, false);
    const paymentOnly = actors.clone(f.d); delete paymentOnly.catalogueSource;
    assert.equal(registry.compileDefinition(paymentOnly).ok, false);
  });
  it('retired authorization stays listable/revocable, never substitutes a newer pin', async() => {
    const f = await fixture({ periodic: false, formula: '1d6+2' }), a = approval(f); await approve(a);
    profiles.profiles.splice(profiles.profiles.indexOf(f.pin), 1); profiles.profiles.push({ ...f.pin, recordHash: actors.hash('newer') });
    assert.equal(installed.list(room).entries[0].catalogueEligibility.eligible, false); assert.equal(registry.decodeRegistry(JSON.stringify(room.gameState.authoredSpellRegistry)).ok, true);
    await refuses(gm, 'actor_consequence', command(a), 'catalogue_provenance_untrusted');
    const r = await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definitionRef: f.ref }); assert.equal(r.success, true, JSON.stringify(r));
  });
  it('contradictory resource encodings refuse and disk has no production composed pin', () => {
    assert.equal(catalogue.classPaymentFor({ resourceCost: { spheres: ['blight', 'blight'], resourceValues: { shadow_sphere: 2 } } }, 'arcanoneer').ok, false);
    const disk = JSON.parse(require('fs').readFileSync(require.resolve('../shared/data/catalogueAbilityProfiles.json')));
    assert.equal(disk.profiles.some(p => p.capability === pure.EFFECT_CAPABILITY), false);
  });
});
