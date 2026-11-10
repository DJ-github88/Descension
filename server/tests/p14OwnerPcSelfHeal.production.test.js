const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const payments = require('../services/spellPayments');
const pure = require('../shared/services/authoredAbility');
const roomAccess = require('../services/roomAccessService');
const codec = require('../services/roomCheckpoint');

const ack = (s, event, data) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(event)), 5000);
  s.emit(event, data, r => { clearTimeout(t); resolve(r); });
});
const once = (s, event) => new Promise(resolve => s.once(event, resolve));

function wizardDraft({
  name = 'Stillwater Self Mend',
  kind = 'healing',
  formula = '1d8 + intelligence * 2',
  resolution = 'DICE',
  restriction = 'self',
  rangeDistance = 0,
  ap = 1,
  mana = 3,
  cooldownConfig = { cooldownType: 'none', cooldownValue: 0 },
} = {}) {
  const resourceTypes = [];
  const resourceValues = {};
  if (mana > 0) { resourceTypes.push('mana'); resourceValues.mana = mana; }
  return {
    name,
    description: 'Explicit owner-PC self-healing test draft.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
    effectTypes: [kind],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance,
      maxTargets: 1,
      targetRestrictions: [restriction],
    },
    resourceCost: {
      actionPoints: ap,
      resourceTypes: resourceTypes.length ? resourceTypes : ['mana'],
      resourceValues: resourceTypes.length ? resourceValues : { mana: 0 },
    },
    cooldownConfig,
    [`${kind}Config`]: kind === 'damage'
      ? { damageType: 'direct', elementType: 'arcane', formula, resolution, globalResolution: resolution }
      : { healingType: 'direct', formula, resolution, globalResolution: resolution },
  };
}

function makeRecord(opts = {}) {
  const d = wizardDraft(opts);
  return Object.assign({}, actors.clone(d), {
    authoredDefinitionId: uuid(),
    authoredDraft: actors.clone(d),
    serializedData: JSON.stringify(d),
  });
}

describe('P14 owner-PC self-healing through the unified engine — registered production handlers', function() {
  this.timeout(20000);
  let server, room, gm, owner, allySocket, uid, allyUid, gmUid, pc, allyPc, foe, writer;

  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_target_accept', 'actor_authored_admit', 'actor_authored_revoke']) {
      server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    }
    gmUid = server.nextUserId();
    uid = server.nextUserId();
    allyUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', uid);
    server.registerAuthToken('ally', allyUid);

    gm = server.connect({ token: 'gm' });
    await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid });

    owner = server.connect({ token: 'owner' });
    await once(owner, 'connect');
    const joinedOwner = once(owner, 'room_joined');
    owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' });
    await joinedOwner;

    allySocket = server.connect({ token: 'ally' });
    await once(allySocket, 'connect');
    const joinedAlly = once(allySocket, 'room_joined');
    allySocket.emit('join_room', { roomId: room.id, playerName: 'ally', password: '' });
    await joinedAlly;

    server.setCharacterOwner('c', uid);
    server.setCharacterOwner('c-ally', allyUid);

    const map = room.gameState.maps.default;
    map.tokens.foe = {
      id: 'foe',
      stats: { maxHp: 100, maxMana: 0, maxAP: 4 },
      state: { currentHp: 70, currentMana: 0, currentActionPoints: 4, tempHealth: 2, conditions: [] },
    };
    map.characterTokens.pc = {
      id: 'pc',
      ownerUserId: uid,
      character: {
        id: 'c',
        class: 'Arcanoneer',
        stats: { intelligence: 18, spirit: 14 },
        health: { current: 18, max: 30 },
        mana: { current: 10, max: 10 },
        actionPoints: { current: 4, max: 4 },
        tempHealth: 3,
        tempMana: 2,
        tempActionPoints: 1,
      },
      state: { conditions: [] },
    };
    map.characterTokens.ally = {
      id: 'ally',
      ownerUserId: allyUid,
      character: {
        id: 'c-ally',
        class: 'Arcanoneer',
        stats: { intelligence: 14, spirit: 12 },
        health: { current: 15, max: 28 },
        mana: { current: 8, max: 8 },
        actionPoints: { current: 3, max: 3 },
        tempHealth: 1,
        tempMana: 0,
        tempActionPoints: 0,
      },
      state: { conditions: [] },
    };

    pc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: uid, characterId: 'c' },
      snapshotHash: actors.hash(map.characterTokens.pc),
    })).ref;
    allyPc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'ally', ownerUid: allyUid, characterId: 'c-ally' },
      snapshotHash: actors.hash(map.characterTokens.ally),
    })).ref;
    foe = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' },
      snapshotHash: actors.hash(map.tokens.foe),
    })).ref;
  });

  afterEach(async() => {
    gm?.disconnect();
    owner?.disconnect();
    allySocket?.disconnect();
    await server?.stop();
  });

  const token = ref => actors.locate(room, ref).token;

  async function admit(opts = {}, extra = {}) {
    const record = makeRecord(opts);
    const result = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(room).revision,
      record,
      definitionVersion: 1,
      classId: 'arcanoneer',
      ...extra,
    });
    assert.equal(result.success, true, JSON.stringify(result));
    return installed.list(room).entries.find(e => e.definitionRef.definitionId === record.authoredDefinitionId);
  }

  function makeApproval(entry, {
    sourceRef = pc,
    targetRef = pc,
    faces = [5],
    mode = 'physical',
    rollAttributes,
  } = {}) {
    const d = entry.canonicalDefinition;
    const cap = d.capability || pure.CAPABILITY;
    const srcToken = token(sourceRef);
    const projected = roomAccess.projectTokenForClient(srcToken);
    const names = pure.formulaAttributes(d.effect.formula);
    const resolvedAttrs = rollAttributes ?? Object.fromEntries(names.map(n => [n, srcToken.character?.stats?.[n]]));
    let reading, roll;
    if (cap === pure.CAPABILITY) {
      reading = pure.readFormula(d.effect.formula);
      const total = faces.reduce((a, b) => a + b, reading.constant);
      roll = { mode, dice: [{ sides: reading.dice[0].sides, faces }], constant: reading.constant, reading: d.effect.formula.replace(/\s+/g, ''), total };
    } else if (cap === pure.DETERMINISTIC_CAPABILITY) {
      reading = pure.readDeterministicFormula(d.effect.formula, resolvedAttrs);
      roll = { mode: 'deterministic', dice: [], constant: reading.constant, reading: reading.reading, total: reading.constant };
    } else {
      reading = pure.readScaledFormula(d.effect.formula, resolvedAttrs);
      const dice = reading.dice.length ? [{ sides: reading.dice[0].sides, faces }] : [];
      const total = (reading.dice.length ? faces.reduce((a, b) => a + b, 0) : 0) + reading.constant;
      roll = { mode, dice, constant: reading.constant, reading: reading.reading, total };
    }
    const base = {
      version: 1,
      roomId: room.id,
      approvalId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: sourceRef,
      target: targetRef,
      spell: {
        definitionId: pure.actionId(entry.definitionRef),
        definitionHash: `${cap}/${entry.definitionRef.definitionHash}`,
        name: d.name,
        kind: d.effect.kind,
        damageTypes: d.effect.damageTypes || [],
      },
      roll,
      price: entry.descriptor.price,
      classPayment: null,
    };
    if (cap !== pure.CAPABILITY) {
      base.rollAttributes = resolvedAttrs;
      base.formulaSourceRevision = srcToken.state.actorContract.revision;
      base.formulaSourceHash = actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] });
    }
    return base;
  }

  function makeSelfCommand(approval, contentHash, amount = approval.roll.total, reason = '') {
    const srcToken = token(approval.source);
    const pools = actors.resources(srcToken, 'character');
    const hp = { current: Math.min(pools.hp.max, pools.hp.current + amount), temp: pools.hp.temp };
    const finalResources = { hp };
    if (approval.price.ap > 0) finalResources.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, approval.price.ap);
    if (approval.price.mana > 0) finalResources.mana = payments.tempFirst(pools.mana.current, pools.mana.temp, approval.price.mana);
    const cap = approval.spell.definitionHash.split('/')[0];
    return {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: approval.source,
      target: approval.target,
      approval: { approvalId: approval.approvalId, contentHash },
      actors: [{
        ref: approval.source,
        expectedRevision: srcToken.state.actorContract.revision,
        finalResources,
      }],
      adjudication: {
        definitionId: approval.spell.definitionId,
        definitionVersionOrHash: approval.spell.definitionHash,
        chosenResult: JSON.stringify({
          capability: cap,
          approvalId: approval.approvalId,
          kind: 'healing',
          roll: approval.roll,
          actualHealing: hp.current - pools.hp.current,
          gmConfirmed: true,
        }),
        finalAmount: amount,
        adjustmentReason: reason,
      },
    };
  }

  it('admits explicit self-healing across plain-dice (v1), attribute-scaled (v2), and deterministic (v4) formulas, while refusing missing-health scaling, non-zero range on self, damage on self, or cooldowns on self', async() => {
    const v1Entry = await admit({ formula: '1d8+2' });
    assert.equal(v1Entry.canonicalDefinition.capability, undefined);
    assert.equal(pure.ownerSelfHealing(v1Entry.canonicalDefinition), true);

    const v2Entry = await admit({ formula: '1d8 + intelligence * 2' });
    assert.equal(v2Entry.canonicalDefinition.capability, pure.FORMULA_CAPABILITY);
    assert.equal(pure.ownerSelfHealing(v2Entry.canonicalDefinition), true);

    const v4Entry = await admit({ formula: 'intelligence/4' });
    assert.equal(v4Entry.canonicalDefinition.capability, pure.DETERMINISTIC_CAPABILITY);
    assert.equal(pure.ownerSelfHealing(v4Entry.canonicalDefinition), true);

    for (const bad of [
      { formula: '1d8 + caster_missing_health/4', restriction: 'self', rangeDistance: 0 },
      { formula: 'caster_missing_health/4', restriction: 'self', rangeDistance: 0 },
      { formula: '1d8 + intelligence * 2', restriction: 'self', rangeDistance: 30 },
      { formula: '1d8+2', restriction: 'self', rangeDistance: 30 },
      { formula: '1d8 + intelligence * 2', kind: 'damage', restriction: 'self', rangeDistance: 0 },
      { formula: '1d8 + intelligence * 2', restriction: 'self', rangeDistance: 0, cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 } },
      { formula: '1d8 + intelligence * 2', restriction: 'any', rangeDistance: 0 },
      { formula: '7', restriction: 'any', rangeDistance: 0 },
    ]) {
      const r = await ack(gm, 'actor_authored_admit', {
        roomId: room.id,
        requestId: uuid(),
        expectedRegistryRevision: installed.registry(room).revision,
        record: makeRecord(bad),
        definitionVersion: 1,
        classId: 'arcanoneer',
      });
      assert.equal(r.success, false, `Expected refusal for ${JSON.stringify(bad)}`);
    }

    const wizardDefaultTargetType = makeRecord({ formula: '1d8 + intelligence * 2', restriction: 'self', rangeDistance: 0 });
    wizardDefaultTargetType.healingConfig.targetType = 'single';
    wizardDefaultTargetType.authoredDraft.healingConfig.targetType = 'single';
    wizardDefaultTargetType.serializedData = JSON.stringify(wizardDefaultTargetType.authoredDraft);
    assert.equal((await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(room).revision,
      record: wizardDefaultTargetType,
      definitionVersion: 1,
      classId: 'arcanoneer',
    })).success, true);

    const conflictingTargetType = makeRecord({ formula: '1d8+2', restriction: 'self', rangeDistance: 0 });
    conflictingTargetType.healingConfig.targetType = 'ally';
    conflictingTargetType.authoredDraft.healingConfig.targetType = 'ally';
    conflictingTargetType.serializedData = JSON.stringify(conflictingTargetType.authoredDraft);
    const conflictingRes = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(room).revision,
      record: conflictingTargetType,
      definitionVersion: 1,
      classId: 'arcanoneer',
    });
    assert.equal(conflictingRes.success, false);
    assert.match(conflictingRes.error, /Self targeting currently supports immediate healing at range 0/);
  });

  it('combines source temp-first AP/mana payment and self healing in one actor update and one receipt without a duplicate consent stage', async() => {
    const entry = await admit({ formula: '1d8 + intelligence/4', ap: 2, mana: 3 });
    const a = makeApproval(entry, { faces: [5], rollAttributes: { intelligence: 18 } });
    assert.equal(a.roll.total, 9);
    assert.equal(payments.targetConsent(a), 'none');

    let unexpectedTargetPrompt = false;
    owner.once('actor_spell_target_pending', () => { unexpectedTargetPrompt = true; });

    const beforeRevision = token(pc).state.actorContract.revision;
    const beforeMaps = actors.clone(room.gameState.maps);
    const approved = await ack(owner, 'actor_spell_approve', a);
    assert.equal(approved.code, 'awaiting_gm', JSON.stringify(approved));
    assert.equal(payments.targetConsent(payments.get(room, a.approvalId).approval), 'none');
    assert.equal(payments.get(room, a.approvalId).targetAcceptance, undefined);
    assert.equal(unexpectedTargetPrompt, false);
    assert.deepEqual(room.gameState.maps, beforeMaps);

    const c = makeSelfCommand(a, approved.contentHash);
    assert.equal(c.actors.length, 1);
    const confirmed = await ack(gm, 'actor_consequence', c);
    assert.equal(confirmed.success, true, JSON.stringify(confirmed));
    assert.equal(confirmed.receipt.actors.length, 1);
    assert.equal(confirmed.receipt.actors[0].afterRevision, beforeRevision + 1);
    assert.deepEqual(confirmed.receipt.actors[0].ref, pc);

    const afterPools = actors.resources(token(pc), 'character');
    // Started at HP 18/30 (temp 3), Mana 10/10 (temp 2), AP 4/4 (temp 1).
    // Paid AP 2 (temp 1 -> 0, current 4 -> 3) and Mana 3 (temp 2 -> 0, current 10 -> 9); healed +9 HP (18 -> 27, temp 3 unchanged).
    assert.deepEqual(afterPools, {
      hp: { current: 27, temp: 3, max: 30 },
      mana: { current: 9, temp: 0, max: 10 },
      ap: { current: 3, temp: 0, max: 4 },
    });
    assert.equal(JSON.parse(confirmed.receipt.adjudication.chosenResult).actualHealing, 9);
  });

  it('caps self-healing at maximum HP, keeps temporary HP unchanged, and still pays full AP/mana price (including at full health or zero-cost)', async() => {
    const entry = await admit({ formula: '1d8 + intelligence * 2', ap: 1, mana: 3 });
    const a = makeApproval(entry, { faces: [6], rollAttributes: { intelligence: 18 } }); // 6 + 36 = 42
    const approved = await ack(owner, 'actor_spell_approve', a);
    assert.equal(approved.code, 'awaiting_gm');

    const c = makeSelfCommand(a, approved.contentHash);
    const confirmed = await ack(gm, 'actor_consequence', c);
    assert.equal(confirmed.success, true, JSON.stringify(confirmed));
    assert.equal(confirmed.receipt.actors.length, 1);
    assert.deepEqual(actors.resources(token(pc), 'character'), {
      hp: { current: 30, temp: 3, max: 30 },
      mana: { current: 9, temp: 0, max: 10 },
      ap: { current: 4, temp: 0, max: 4 },
    });
    assert.equal(JSON.parse(confirmed.receipt.adjudication.chosenResult).actualHealing, 12);

    // Cast again at full health (30/30): actualHealing === 0, AP/mana still debited, tempHealth still 3.
    const aFull = makeApproval(entry, { faces: [4], rollAttributes: { intelligence: 18 } });
    const approvedFull = await ack(owner, 'actor_spell_approve', aFull);
    assert.equal(approvedFull.code, 'awaiting_gm');
    const confirmedFull = await ack(gm, 'actor_consequence', makeSelfCommand(aFull, approvedFull.contentHash));
    assert.equal(confirmedFull.success, true, JSON.stringify(confirmedFull));
    assert.deepEqual(actors.resources(token(pc), 'character'), {
      hp: { current: 30, temp: 3, max: 30 },
      mana: { current: 6, temp: 0, max: 10 },
      ap: { current: 3, temp: 0, max: 4 },
    });
    assert.equal(JSON.parse(confirmedFull.receipt.adjudication.chosenResult).actualHealing, 0);

    // Zero AP / zero mana deterministic v4 self-heal: finalResources contains only { hp }.
    token(pc).character.health.current = 20;
    const freeEntry = await admit({ formula: '7', ap: 0, mana: 0 });
    const aFree = makeApproval(freeEntry, { faces: [], rollAttributes: {} });
    const approvedFree = await ack(owner, 'actor_spell_approve', aFree);
    assert.equal(approvedFree.code, 'awaiting_gm');
    const cmdFree = makeSelfCommand(aFree, approvedFree.contentHash);
    assert.deepEqual(Object.keys(cmdFree.actors[0].finalResources), ['hp']);
    const confirmedFree = await ack(gm, 'actor_consequence', cmdFree);
    assert.equal(confirmedFree.success, true, JSON.stringify(confirmedFree));
    assert.equal(token(pc).character.health.current, 27);
    assert.equal(token(pc).character.tempHealth, 3);
  });

  it('refuses insufficient AP/mana and writer refusal without mutating pools, HP, or pending approval roll', async() => {
    const entry = await admit({ formula: '1d8+2', ap: 2, mana: 4 });
    token(pc).character.mana.current = 1;
    token(pc).character.tempMana = 1; // total 2 < 4
    const beforeInsufficient = actors.clone(room.gameState);
    const aLow = makeApproval(entry, { faces: [4] });
    const lowRes = await ack(owner, 'actor_spell_approve', aLow);
    assert.equal(lowRes.success, false);
    assert.equal(lowRes.code, 'insufficient_resources');
    assert.deepEqual(room.gameState, beforeInsufficient);

    // Restore mana and approve, then test writer refusal
    token(pc).character.mana.current = 10;
    token(pc).character.tempMana = 2;
    const a = makeApproval(entry, { faces: [6] });
    const approved = await ack(owner, 'actor_spell_approve', a);
    assert.equal(approved.code, 'awaiting_gm');

    room.isPermanent = true;
    const originalAdmit = writer.admitConsequence;
    writer.admitConsequence = () => ({ queued: false, code: 'self_heal_writer_refusal' });
    const beforeWriter = actors.clone(room.gameState.maps);
    const c = makeSelfCommand(a, approved.contentHash);
    const refused = await ack(gm, 'actor_consequence', c);
    assert.equal(refused.success, false);
    assert.equal(refused.code, 'self_heal_writer_refusal');
    assert.deepEqual(room.gameState.maps, beforeWriter);
    assert.deepEqual(payments.get(room, a.approvalId).approval.roll, a.roll);

    writer.admitConsequence = originalAdmit;
    const recovered = await ack(gm, 'actor_consequence', c);
    assert.equal(recovered.success, true, JSON.stringify(recovered));
    assert.equal(token(pc).character.health.current, 26);
  });

  it('refuses stale actor revision, deleted/recreated source actor, non-primary attachment, and mutated caster attributes/HP across approval and authority awaits', async() => {
    const entry = await admit({ formula: '1d8 + intelligence * 2', ap: 1, mana: 3 });
    const a = makeApproval(entry, { faces: [3], rollAttributes: { intelligence: 18 } });
    const approved = await ack(owner, 'actor_spell_approve', a);
    assert.equal(approved.code, 'awaiting_gm');
    const c = makeSelfCommand(a, approved.contentHash);

    // Stale actor revision in command
    const staleCmd = actors.clone(c);
    staleCmd.actors[0].expectedRevision++;
    const beforeStale = actors.clone(room.gameState);
    assert.equal((await ack(gm, 'actor_consequence', staleCmd)).code, 'stale_actor_revision');
    assert.deepEqual(room.gameState, beforeStale);

    // Deleted source actor
    const savedPc = actors.clone(room.gameState.maps.default.characterTokens.pc);
    delete room.gameState.maps.default.characterTokens.pc;
    assert.equal((await ack(gm, 'actor_consequence', c)).code, 'actor_not_found');
    room.gameState.maps.default.characterTokens.pc = savedPc;

    // Recreated source actor (instanceId mismatch)
    room.gameState.maps.default.characterTokens.pc.state.actorContract.instanceId = uuid();
    assert.equal((await ack(gm, 'actor_consequence', c)).code, 'actor_binding_conflict');
    room.gameState.maps.default.characterTokens.pc.state.actorContract.instanceId = pc.instanceId;

    // Non-primary attachment
    room.gameState.maps.default.characterTokens.pc.state.actorContract.primary = false;
    assert.equal((await ack(gm, 'actor_consequence', c)).code, 'secondary_attachment');
    room.gameState.maps.default.characterTokens.pc.state.actorContract.primary = true;

    // Mutated intelligence across authority await requires owner reapproval
    const originalAssert = server.authorityService.assertCurrent;
    let release, reached, hold = true;
    const gate = new Promise(r => { release = r; });
    const entered = new Promise(r => { reached = r; });
    server.authorityService.assertCurrent = async(...args) => {
      if (hold) { hold = false; reached(); await gate; }
      return originalAssert(...args);
    };
    const pending = ack(gm, 'actor_consequence', c);
    await entered;
    token(pc).character.stats.intelligence = 20;
    const beforeMutated = actors.clone(room.gameState);
    release();
    assert.equal((await pending).code, 'owner_reapproval_required');
    assert.deepEqual(room.gameState, beforeMutated);
    server.authorityService.assertCurrent = originalAssert;
  });

  it('preserves target authority: rejects another character or creature presented as self, foreign ownership, post-approval target swap, and self on non-self definitions while preserving creature and primary-PC routes', async() => {
    const selfEntry = await admit({ formula: '1d8 + intelligence * 2', restriction: 'self', rangeDistance: 0 });

    // Another PC or creature presented as target of a self-only ability
    for (const wrongTarget of [allyPc, foe]) {
      const badApproval = makeApproval(selfEntry, { targetRef: wrongTarget });
      const before = actors.clone(room.gameState);
      const res = await ack(owner, 'actor_spell_approve', badApproval);
      assert.equal(res.success, false);
      assert.equal(res.code, 'authored_target_mismatch');
      assert.deepEqual(room.gameState, before);
    }

    // Foreign socket attempting to approve self-heal for pc
    const foreignAttempt = makeApproval(selfEntry);
    assert.equal((await ack(allySocket, 'actor_spell_approve', foreignAttempt)).code, 'forbidden');

    // Canonical character ownership changed before approval or before GM confirmation
    server.setCharacterOwner('c', allyUid);
    assert.equal((await ack(owner, 'actor_spell_approve', makeApproval(selfEntry))).code, 'actor_binding_conflict');
    server.setCharacterOwner('c', uid);

    const validApproval = makeApproval(selfEntry, { faces: [2] });
    const approved = await ack(owner, 'actor_spell_approve', validApproval);
    assert.equal(approved.code, 'awaiting_gm');

    server.setCharacterOwner('c', allyUid);
    assert.equal((await ack(gm, 'actor_consequence', makeSelfCommand(validApproval, approved.contentHash))).code, 'actor_binding_conflict');
    server.setCharacterOwner('c', uid);

    // Changing target or adding second actor after approval refuses
    const swappedTarget = makeSelfCommand(validApproval, approved.contentHash);
    swappedTarget.target = allyPc;
    assert.equal((await ack(gm, 'actor_consequence', swappedTarget)).code, 'invalid_consequence');
    swappedTarget.actors = [
      { ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { ap: { current: 4, temp: 0 }, mana: { current: 9, temp: 0 } } },
      { ref: allyPc, expectedRevision: token(allyPc).state.actorContract.revision, finalResources: { hp: { current: 25, temp: 1 } } },
    ];
    assert.equal((await ack(gm, 'actor_consequence', swappedTarget)).code, 'approval_mismatch');

    const duplicatedActor = makeSelfCommand(validApproval, approved.contentHash);
    duplicatedActor.actors.push(actors.clone(duplicatedActor.actors[0]));
    assert.equal((await ack(gm, 'actor_consequence', duplicatedActor)).success, false);

    const badActualHealing = makeSelfCommand(validApproval, approved.contentHash);
    const badChosen = JSON.parse(badActualHealing.adjudication.chosenResult);
    badChosen.actualHealing = 999;
    badActualHealing.adjudication.chosenResult = JSON.stringify(badChosen);
    assert.equal((await ack(gm, 'actor_consequence', badActualHealing)).code, 'approval_mismatch');

    // Withdraw validApproval so we can test non-self definitions
    assert.equal((await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: validApproval.approvalId, approval: validApproval })).success, true);

    // Non-self definitions (ally, enemy, range 30 any, damage) reject source === target
    for (const nonSelf of [
      { formula: '1d8 + intelligence * 2', restriction: 'ally', rangeDistance: 30, kind: 'healing' },
      { formula: '1d8 + intelligence * 2', restriction: 'enemy', rangeDistance: 30, kind: 'healing' },
      { formula: '1d8 + intelligence * 2', restriction: 'any', rangeDistance: 30, kind: 'healing' },
      { formula: '1d8 + intelligence * 2', restriction: 'any', rangeDistance: 30, kind: 'damage' },
      { formula: '1d8+2', restriction: 'ally', rangeDistance: 30, kind: 'healing' },
    ]) {
      const e = await admit(nonSelf);
      const selfAttempt = makeApproval(e, { sourceRef: pc, targetRef: pc });
      const res = await ack(owner, 'actor_spell_approve', selfAttempt);
      assert.equal(res.success, false, `Expected self-target refusal for ${JSON.stringify(nonSelf)}`);
    }

    // Existing creature-target route still works on range 30 any
    const anyHeal = await admit({ formula: '1d8 + intelligence/4', restriction: 'any', rangeDistance: 30, kind: 'healing' });
    const creatureApproval = makeApproval(anyHeal, { sourceRef: pc, targetRef: foe, faces: [4] });
    const creatureApproved = await ack(owner, 'actor_spell_approve', creatureApproval);
    assert.equal(creatureApproved.code, 'awaiting_gm');
    assert.equal(payments.targetConsent(payments.get(room, creatureApproval.approvalId).approval), 'none');
  });

  it('handles concurrent approvals, lost ACKs, identical-command replay, and checkpoint recovery with one single-actor receipt and no double healing', async() => {
    const entry = await admit({ formula: '1d8+2', ap: 1, mana: 2 });
    const a1 = makeApproval(entry, { faces: [4] }); // total 6
    const a2 = makeApproval(entry, { faces: [5] });

    const approved1 = await ack(owner, 'actor_spell_approve', a1);
    assert.equal(approved1.code, 'awaiting_gm');

    // Second concurrent approval from same actor while first is pending refuses with approval_pending
    const concurrentApprove = await ack(owner, 'actor_spell_approve', a2);
    assert.equal(concurrentApprove.success, false);
    assert.equal(concurrentApprove.code, 'approval_pending');

    // Simultaneous/lost-ACK GM confirmations of the same command return the exact same single receipt and apply healing once
    const c = makeSelfCommand(a1, approved1.contentHash);
    const [r1, r2] = await Promise.all([ack(gm, 'actor_consequence', c), ack(gm, 'actor_consequence', c)]);
    assert.equal(r1.success, true, JSON.stringify(r1));
    assert.equal(r2.success, true, JSON.stringify(r2));
    assert.deepEqual(r1.receipt, r2.receipt);
    assert.equal(r1.receipt.actors.length, 1);
    assert.equal(actors.ledger(room).receipts.length, 1);
    assert.equal(token(pc).character.health.current, 24); // 18 + 6, applied once
    assert.equal(token(pc).character.tempHealth, 3);

    // Replay of both actor_consequence and actor_spell_approve after commit returns the same receipt
    const beforeReplay = actors.clone(room.gameState);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r1.receipt);
    assert.deepEqual((await ack(owner, 'actor_spell_approve', a1)).receipt, r1.receipt);
    assert.deepEqual(room.gameState, beforeReplay);

    // Checkpoint round-trip preserves single-actor state and receipt replay
    const built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({
      checkpoint: built.manifest,
      globalDoc: built.global.data,
      mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])),
    });
    assert.equal(decoded.ok, true);
    room = { ...room, gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 };
    server.rooms.set(room.id, room);
    assert.equal(token(pc).character.health.current, 24);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r1.receipt);
  });
});
