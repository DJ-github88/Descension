const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const registry = require('../services/installedDefinitionRegistry');
const pure = require('../shared/services/authoredAbility');
const catalogueAbility = require('../shared/services/catalogueAbility.cjs');
const catalogueProfiles = require('../shared/data/catalogueAbilityProfiles.json');
const { canonical, sha256Hex } = require('../shared/services/canonicalHash');
const payments = require('../services/spellPayments');

const ack = (s, event, data) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(event)), 5000);
  s.emit(event, data, r => { clearTimeout(t); resolve(r); });
});
const once = (s, event) => new Promise(resolve => s.once(event, resolve));

describe('M6A bounded area / multi-target execution production authority tests', function () {
  this.timeout(20000);
  let server, room, gm, owner, observer, gu, uid, obsUid, pc, allyPc, foes, writer, originalProfiles;

  beforeEach(async () => {
    originalProfiles = JSON.parse(JSON.stringify(catalogueProfiles.profiles));
    // Disclosed test-only configuration: enable the proposed shared-area-roll procedure for supported-path tests;
    // shipped default (false) is tested explicitly in dedicated gate tests below and restored in afterEach.
    pure.setAreaRollProposalForTest(true);
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async () => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_revoke']) {
      server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    }
    gu = server.nextUserId();
    uid = server.nextUserId();
    obsUid = server.nextUserId();
    server.registerAuthToken('gm', gu);
    server.registerAuthToken('owner', uid);
    server.registerAuthToken('observer', obsUid);

    gm = server.connect({ token: 'gm' });
    await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gu });

    owner = server.connect({ token: 'owner' });
    await once(owner, 'connect');
    const ownerJoined = once(owner, 'room_joined');
    owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' });
    await ownerJoined;

    observer = server.connect({ token: 'observer' });
    await once(observer, 'connect');
    const obsJoined = once(observer, 'room_joined');
    observer.emit('join_room', { roomId: room.id, playerName: 'observer', password: '' });
    await obsJoined;

    server.setCharacterOwner('c', uid);
    server.setCharacterOwner('ally-c', obsUid);

    const map = room.gameState.maps.default;
    room.gameState.maps.dungeon = { tokens: {}, characterTokens: {} };

    map.characterTokens.pc = {
      id: 'pc',
      ownerUserId: uid,
      character: {
        id: 'c',
        name: 'Lyra',
        class: 'Arcanoneer',
        stats: { intelligence: 18, spirit: 15 },
        health: { current: 24, max: 30 },
        mana: { current: 10, max: 12 },
        actionPoints: { current: 4, max: 4 },
        tempMana: 2,
        tempActionPoints: 1
      },
      state: { conditions: [] }
    };
    map.characterTokens.ally = {
      id: 'ally',
      ownerUserId: obsUid,
      character: {
        id: 'ally-c',
        name: 'Bram',
        class: 'Martyr',
        stats: { spirit: 14 },
        health: { current: 18, max: 28 },
        mana: { current: 8, max: 8 },
        actionPoints: { current: 4, max: 4 }
      },
      state: { conditions: [] }
    };

    for (let i = 1; i <= 9; i++) {
      const id = `foe${i}`;
      map.tokens[id] = {
        id,
        name: `Construct ${i}`,
        stats: { maxHp: 50, maxMana: 0, maxAP: 4 },
        state: { currentHp: 30, currentMana: 0, currentActionPoints: 4, tempHealth: i === 1 ? 3 : 0, conditions: [] }
      };
    }

    pc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: uid, characterId: 'c' },
      snapshotHash: actors.hash(room.gameState.maps.default.characterTokens.pc)
    })).ref;

    allyPc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'ally', ownerUid: obsUid, characterId: 'ally-c' },
      snapshotHash: actors.hash(room.gameState.maps.default.characterTokens.ally)
    })).ref;

    foes = [];
    for (let i = 1; i <= 9; i++) {
      const id = `foe${i}`;
      const bound = await ack(gm, 'actor_bind', {
        roomId: room.id,
        ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id },
        snapshotHash: actors.hash(room.gameState.maps.default.tokens[id])
      });
      assert.equal(bound.success, true, `bind ${id}: ${JSON.stringify(bound)}`);
      foes.push(bound.ref);
    }
  });

  afterEach(async () => {
    pure.setAreaRollProposalForTest(false);
    catalogueProfiles.profiles.splice(0, catalogueProfiles.profiles.length, ...originalProfiles);
    gm?.disconnect();
    owner?.disconnect();
    observer?.disconnect();
    await server?.stop();
  });

  const token = ref => actors.locate(room, ref).token;

  function makeWizardAreaRecord({
    formula = '2d6 + intelligence / 2',
    kind = 'damage',
    radiusFeet = 15,
    rangeFeet = 30,
    maxTargets = 8,
    restriction = 'enemy',
    ap = 1,
    mana = 4,
    extraCost = {},
    extraDraft = {}
  } = {}) {
    const resourceCost = Object.assign({
      actionPoints: ap,
      resourceTypes: mana > 0 ? ['mana'] : [],
      resourceValues: { mana }
    }, extraCost);
    const d = Object.assign({
      name: kind === 'healing' ? 'Sanctuary Pulse' : 'Cinder Nova',
      description: 'Bounded circle AoE primitive.',
      spellType: 'ACTION',
      typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
      effectTypes: [kind],
      targetingConfig: {
        targetingType: 'area',
        aoeShape: 'circle',
        aoeParameters: { radius: radiusFeet },
        rangeType: 'ranged',
        rangeDistance: rangeFeet,
        targetRestrictions: [restriction],
        maxTargets
      },
      resourceCost,
      [`${kind}Config`]: kind === 'damage'
        ? { damageType: 'direct', elementType: 'arcane', formula, resolution: 'DICE' }
        : { healingType: 'direct', formula, resolution: 'DICE' }
    }, extraDraft);
    return Object.assign({}, actors.clone(d), { authoredDefinitionId: uuid(), authoredDraft: actors.clone(d) });
  }

  async function admitArea(opts = {}) {
    const record = makeWizardAreaRecord(opts);
    const result = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(room).revision,
      record,
      definitionVersion: 1,
      classId: 'arcanoneer'
    });
    assert.equal(result.success, true, JSON.stringify(result));
    return installed.list(room).entries.find(e => e.definitionRef.definitionId === record.authoredDefinitionId);
  }

  function buildAreaApproval(e, targetRefs, { faces = [4, 5], classPayment = null, areaOrigin = { x: 150, y: 150 } } = {}) {
    const names = pure.formulaAttributes(e.canonicalDefinition.effect.formula);
    const projected = require('../services/roomAccessService').projectTokenForClient(token(pc));
    const rollAttributes = {};
    for (const n of names) rollAttributes[n] = projected.character.stats[n];
    const reading = pure.readScaledFormula(e.canonicalDefinition.effect.formula, rollAttributes);
    return {
      version: 1,
      roomId: room.id,
      approvalId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: pc,
      targets: targetRefs,
      spell: {
        definitionId: pure.actionId(e.definitionRef),
        definitionHash: `${pure.AREA_CAPABILITY}/${e.definitionRef.definitionHash}`,
        name: e.canonicalDefinition.name,
        kind: e.canonicalDefinition.effect.kind,
        damageTypes: e.canonicalDefinition.effect.damageTypes || []
      },
      areaTerms: e.canonicalDefinition.targeting,
      areaRollProcedure: pure.AREA_ROLL_PROCEDURE,
      areaOrigin,
      roll: {
        mode: 'physical',
        dice: [{ sides: 6, faces }],
        constant: reading.constant,
        reading: reading.reading,
        total: faces.reduce((a, b) => a + b, reading.constant)
      },
      ...(names.length ? { rollAttributes } : {}),
      formulaSourceRevision: token(pc).state.actorContract.revision,
      formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }),
      price: e.descriptor.price,
      classPayment
    };
  }

  function buildAreaCommand(a, contentHash, outcomes) {
    const sourceRes = actors.resources(token(pc), 'character');
    const payment = {};
    if (a.price.ap > 0) payment.ap = payments.tempFirst(sourceRes.ap.current, sourceRes.ap.temp, a.price.ap);
    if (a.price.mana > 0) payment.mana = payments.tempFirst(sourceRes.mana.current, sourceRes.mana.temp, a.price.mana);
    if (!Object.keys(payment).length) payment.ap = payments.tempFirst(sourceRes.ap.current, sourceRes.ap.temp, 0);
    const sourceEntry = {
      ref: pc,
      expectedRevision: token(pc).state.actorContract.revision,
      finalResources: payment,
      ...(a.classPayment ? { classPayment: { mode: 'spell', domain: a.classPayment.domain, approvalHash: contentHash } } : {})
    };
    const targetEntries = [];
    const recordedTargets = [];
    const reasons = [];
    let totalFinalAmount = 0;
    a.targets.forEach((tRef, idx) => {
      const o = outcomes ? outcomes[idx] : { finalAmount: a.roll.total, adjustmentReason: '' };
      const tRes = actors.resources(token(tRef), 'creature').hp;
      const hp = a.spell.kind === 'healing'
        ? { current: Math.min(tRes.max, tRes.current + o.finalAmount), temp: tRes.temp }
        : { current: Math.max(0, tRes.current - Math.max(0, o.finalAmount - tRes.temp)), temp: Math.max(0, tRes.temp - o.finalAmount) };
      targetEntries.push({ ref: tRef, expectedRevision: token(tRef).state.actorContract.revision, finalResources: { hp } });
      recordedTargets.push({ ref: tRef, finalAmount: o.finalAmount, adjustmentReason: (o.adjustmentReason || '').trim() });
      totalFinalAmount += o.finalAmount;
      if (o.adjustmentReason && o.adjustmentReason.trim()) reasons.push(o.adjustmentReason.trim());
    });
    return {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: pc,
      targets: a.targets,
      approval: { approvalId: a.approvalId, contentHash },
      actors: [sourceEntry, ...targetEntries],
      adjudication: {
        definitionId: a.spell.definitionId,
        definitionVersionOrHash: a.spell.definitionHash,
        chosenResult: JSON.stringify({
          capability: pure.AREA_CAPABILITY,
          approvalId: a.approvalId,
          kind: a.spell.kind,
          areaRollProcedure: pure.AREA_ROLL_PROCEDURE,
          roll: a.roll,
          damageTypes: a.spell.damageTypes,
          spellName: a.spell.name,
          sourceName: 'Lyra',
          areaTerms: a.areaTerms,
          targets: recordedTargets,
          gmConfirmed: true
        }),
        finalAmount: totalFinalAmount,
        adjustmentReason: reasons.join('; ')
      }
    };
  }

  it('0. proposed-roll gate: shipped default refuses area admission, approval and execution before payment while preserving stored registry decode', async () => {
    // 1) Admit an area spell while proposal is enabled, and prepare a pending approval
    const admitted = await admitArea({ formula: '2d6 + intelligence / 2', kind: 'damage' });
    const pendingApproval = buildAreaApproval(admitted, [foes[0], foes[1]], { faces: [4, 5] });
    const approvedWhileEnabled = await ack(owner, 'actor_spell_approve', pendingApproval);
    assert.equal(approvedWhileEnabled.code, 'awaiting_gm');
    const pendingCmd = buildAreaCommand(pendingApproval, approvedWhileEnabled.contentHash);

    // 2) Restore shipped default (proposal unapproved)
    pure.setAreaRollProposalForTest(false);
    assert.equal(pure.isAreaRollProcedureApproved(), false);
    assert.equal(pure.AREA_ROLL_POLICY.creatorApproval, null);

    const beforeState = actors.clone(room.gameState);

    // 3) Ordinary Wizard mapping and server admission refuse clearly before installation
    const newRecord = makeWizardAreaRecord({ formula: '2d6 + intelligence / 2', kind: 'damage' });
    const mappedDefault = pure.definitionFromWizard(newRecord, { roomId: room.id, classId: 'arcanoneer', definitionVersion: 1 });
    assert.equal(mappedDefault.ok, false);
    assert.match(mappedDefault.reason, /awaits creator confirmation/);

    const admitRefused = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(room).revision,
      record: newRecord,
      definitionVersion: 1,
      classId: 'arcanoneer'
    });
    assert.equal(admitRefused.success, false);
    assert.equal(admitRefused.code, 'unsupported_wizard_record');
    assert.match(admitRefused.error || '', /awaits creator confirmation/);

    // Direct compiler call on a crafted definition also refuses with AREA_ROLL_PROCEDURE_UNAPPROVED
    const compiledDefault = registry.compileDefinition(admitted.canonicalDefinition);
    assert.equal(compiledDefault.ok, false);
    assert.equal(compiledDefault.code, 'AREA_ROLL_PROCEDURE_UNAPPROVED');

    // 4) Stored registry still loads and lists without bricking the room, reporting areaRollEligibility.eligible === false
    const listed = installed.list(room);
    const listedEntry = listed.entries.find(e => e.definitionRef.definitionId === admitted.definitionRef.definitionId);
    assert.equal(listedEntry.areaRollEligibility.eligible, false);
    assert.match(listedEntry.areaRollEligibility.reason, /awaits creator confirmation/);

    // 5) New owner approval and pending GM consequence both refuse before any payment or HP change
    const newApprovalAttempt = buildAreaApproval(admitted, [foes[0], foes[1]], { faces: [3, 4] });
    const approveRefused = await ack(owner, 'actor_spell_approve', newApprovalAttempt);
    assert.equal(approveRefused.success, false);
    assert.equal(approveRefused.code, 'area_roll_procedure_unapproved');

    const commitRefused = await ack(gm, 'actor_consequence', pendingCmd);
    assert.equal(commitRefused.success, false);
    assert.equal(commitRefused.code, 'area_roll_procedure_unapproved');
    assert.deepEqual(room.gameState, beforeState);
  });

  it('1. several targets, one source payment (including integer divisor formula) and per-target GM outcomes', async () => {
    const e = await admitArea({ formula: '2d6 + intelligence / 2', kind: 'damage' });
    assert.equal(e.descriptor.capabilityId, pure.AREA_CAPABILITY);
    assert.equal(registry.decodeRegistry(registry.encodeRegistry(installed.registry(room)).json).ok, true);

    const targets = [foes[0], foes[1], foes[2]];
    const a = buildAreaApproval(e, targets, { faces: [4, 5] });
    // 2d6 (4+5=9) + floor(18/2)=9 => 18 proposed per target
    assert.equal(a.roll.total, 18);

    const approved = await ack(owner, 'actor_spell_approve', a);
    assert.equal(approved.code, 'awaiting_gm', JSON.stringify(approved));

    // GM adjudicates per-target outcomes: full 18 on foe1 (absorbs 3 temp + 15 HP), half 9 on foe2 (save), 0 on foe3 (cover)
    const outcomes = [
      { finalAmount: 18, adjustmentReason: '' },
      { finalAmount: 9, adjustmentReason: 'half damage on agility save' },
      { finalAmount: 0, adjustmentReason: 'total cover behind pillar' }
    ];
    const cmd = buildAreaCommand(a, approved.contentHash, outcomes);
    const seqBefore = actors.ledger(room).commitSequence;
    const accepted = await ack(gm, 'actor_consequence', cmd);
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.equal(actors.ledger(room).commitSequence, seqBefore + 1);

    // Source paid ONCE: 1 AP (from tempActionPoints 1->0, current 4), 4 mana (from tempMana 2->0, current 10->8)
    assert.equal(token(pc).character.tempActionPoints, 0);
    assert.equal(token(pc).character.actionPoints.current, 4);
    assert.equal(token(pc).character.tempMana, 0);
    assert.equal(token(pc).character.mana.current, 8);

    // Targets updated atomically with individual outcomes
    assert.equal(token(foes[0]).state.tempHealth, 0);
    assert.equal(token(foes[0]).state.currentHp, 15);
    assert.equal(token(foes[1]).state.currentHp, 21);
    assert.equal(token(foes[2]).state.currentHp, 30);
  });

  it('1b. adversarial area class-payment authority: arbitrary Wizard records, self-hashed catalogue records, and reused pins cannot authorize class payments; only a reviewed pin succeeds and retirement refuses atomically', async () => {
    const beforeState = actors.clone(room.gameState);

    // (A) Arbitrary Wizard-authored area definition cannot grant itself a class payment or resource gain
    for (const extra of [
      { extraCost: { spheres: ['ember'] } },
      { extraDraft: { sphereGenerate: ['arcane'] } },
      { extraDraft: { devotionGain: 1 } },
      { extraDraft: { musicalCombo: { generates: ['I'] } } }
    ]) {
      const wizardRecord = makeWizardAreaRecord(extra);
      const mapped = pure.definitionFromWizard(wizardRecord, { roomId: room.id, classId: 'arcanoneer', definitionVersion: 1, allowProposedAreaRoll: true });
      assert.equal(mapped.ok, false, `Wizard self-granted class payment should refuse: ${JSON.stringify(extra)}`);
      const admitRes = await ack(gm, 'actor_authored_admit', {
        roomId: room.id,
        requestId: uuid(),
        expectedRegistryRevision: installed.registry(room).revision,
        record: wizardRecord,
        definitionVersion: 1,
        classId: 'arcanoneer'
      });
      assert.equal(admitRes.success, false);
      assert.equal(admitRes.code, 'unsupported_wizard_record');
    }

    // Direct compileDefinition of an unpinned area definition carrying classPayment refuses UNSUPPORTED_SHAPE
    const validEntry = await admitArea({ formula: '2d6 + spirit / 3', kind: 'healing', restriction: 'ally', ap: 1, mana: 2 });
    const unpinnedWithClassPayment = Object.assign({}, actors.clone(validEntry.canonicalDefinition), {
      classPayment: { domain: 'elementalSpheres', price: { costs: ['ember'], gains: [] } }
    });
    assert.equal(registry.compileDefinition(unpinnedWithClassPayment).code, 'UNSUPPORTED_SHAPE');

    // (B) A doctored catalogue area record with a matching self-generated hash cannot authorize a class payment
    const catalogueAreaRecord = {
      id: 'arc_test_sanctuary_pulse',
      name: 'Sanctuary Pulse',
      description: 'Test catalogue area spell.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Arcane/Ebon Blaze',
      effectTypes: ['healing'],
      typeConfig: { school: 'arcane', castTime: 0, castTimeType: 'IMMEDIATE', tags: ['aoe'] },
      targetingConfig: {
        targetingType: 'area',
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally'],
        maxTargets: 8,
        selectionMethod: 'manual',
        movementBehavior: 'static'
      },
      resourceCost: {
        actionPoints: 1,
        mana: 2,
        resourceTypes: ['mana'],
        resourceValues: { mana: 2 },
        useFormulas: {},
        components: ['verbal'],
        spheres: ['ember']
      },
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      healingConfig: { formula: '2d6 + spirit / 3', healingType: 'direct', hasHotEffect: false, resolution: 'DICE', description: 'Heal allies' },
      resolution: 'DICE',
      tags: ['healing']
    };
    const selfHash = sha256Hex(canonical(catalogueAreaRecord));
    const execUnpinned = catalogueAbility.catalogueExecutable(catalogueAreaRecord, 'arcanoneer', {
      roomId: room.id,
      definitionId: uuid(),
      definitionVersion: 1
    });
    assert.equal(execUnpinned.ok, false);
    assert.match(execUnpinned.reason, /No reviewed catalogue profile pins this exact class\/spell record/);

    const doctoredWizardRecord = {
      id: 'catalogue-arc_test_sanctuary_pulse',
      name: catalogueAreaRecord.name,
      description: catalogueAreaRecord.description,
      level: 1,
      icon: catalogueAreaRecord.icon,
      school: 'arcane',
      spellType: 'ACTION',
      typeConfig: actors.clone(catalogueAreaRecord.typeConfig),
      effectTypes: ['healing'],
      effectsMap: { healing: true },
      damageConfig: null,
      healingConfig: { ...catalogueAreaRecord.healingConfig },
      targetingConfig: actors.clone(catalogueAreaRecord.targetingConfig),
      resourceCost: { actionPoints: 1, mana: 2, resourceTypes: ['mana'], resourceValues: { mana: 2 }, useFormulas: {}, components: [] },
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      resolution: 'DICE',
      effectResolutions: { healing: 'DICE' },
      tags: ['healing'],
      catalogueSource: { spellId: catalogueAreaRecord.id, classId: 'arcanoneer', recordHash: selfHash, record: actors.clone(catalogueAreaRecord) },
      authoredDefinitionId: uuid(),
      isCustom: true,
      source: 'wizard'
    };
    doctoredWizardRecord.authoredDraft = actors.clone(Object.fromEntries(Object.entries(doctoredWizardRecord).filter(([k]) => !['authoredDraft', 'isCustom', 'source'].includes(k))));

    const doctoredAdmit = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(room).revision,
      record: doctoredWizardRecord,
      definitionVersion: 1,
      classId: 'arcanoneer'
    });
    assert.equal(doctoredAdmit.success, false);
    assert.equal(doctoredAdmit.code, 'unsupported_wizard_record');
    assert.match(doctoredAdmit.error || '', /No reviewed catalogue profile pins this exact class\/spell record/);

    // (C) Existing reviewed catalogue pin (martyr_restorative_prayer) cannot be reused to authorize an area definition or different terms
    const existingPin = originalProfiles[0];
    assert.equal(existingPin.spellId, 'martyr_restorative_prayer');
    const hijackedAreaDef = {
      schemaVersion: 5,
      capability: pure.AREA_CAPABILITY,
      scope: { roomId: room.id },
      definitionId: uuid(),
      definitionVersion: 1,
      name: existingPin.executable.name,
      description: existingPin.executable.description,
      binding: existingPin.executable.binding,
      spellType: 'ACTION',
      castTimeType: 'IMMEDIATE',
      targeting: { kind: 'area', aoeShape: 'circle', radiusFeet: 15, rangeFeet: 30, maxTargets: 8, restriction: 'ally' },
      resourceCost: existingPin.executable.resourceCost,
      effect: existingPin.executable.effect,
      classPayment: existingPin.executable.classPayment,
      catalogueSource: { spellId: existingPin.spellId, classId: existingPin.classId, recordHash: existingPin.recordHash }
    };
    const hijackedCompile = registry.compileDefinition(hijackedAreaDef);
    assert.equal(hijackedCompile.ok, false);
    assert.equal(hijackedCompile.code, 'CATALOGUE_PROVENANCE_UNTRUSTED');

    // (D) Injected test-only profile pin proves plumbing; retiring or mismatching the pin refuses atomically
    const pinnedExecutable = {
      schemaVersion: 5,
      capability: pure.AREA_CAPABILITY,
      name: catalogueAreaRecord.name,
      description: catalogueAreaRecord.description,
      binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' },
      spellType: 'ACTION',
      castTimeType: 'IMMEDIATE',
      targeting: { kind: 'area', aoeShape: 'circle', radiusFeet: 15, rangeFeet: 30, maxTargets: 8, restriction: 'ally' },
      resourceCost: { actionPoints: 1, mana: 2 },
      effect: { kind: 'healing', formula: '2d6 + spirit / 3' },
      classPayment: { domain: 'elementalSpheres', price: { costs: ['ember'], gains: [] } }
    };
    catalogueProfiles.profiles.push({
      capability: pure.AREA_CAPABILITY,
      compiler: pure.AREA_COMPILER,
      classId: 'arcanoneer',
      spellId: catalogueAreaRecord.id,
      name: catalogueAreaRecord.name,
      recordHash: selfHash,
      executable: pinnedExecutable
    });

    // Any mismatch against the pinned executable projection (different radius, formula, or payment) still refuses
    const mismatchedRadiusDef = Object.assign({}, actors.clone(pinnedExecutable), {
      scope: { roomId: room.id },
      definitionId: uuid(),
      definitionVersion: 1,
      targeting: Object.assign({}, pinnedExecutable.targeting, { radiusFeet: 20 }),
      catalogueSource: { spellId: catalogueAreaRecord.id, classId: 'arcanoneer', recordHash: selfHash }
    });
    assert.equal(registry.compileDefinition(mismatchedRadiusDef).code, 'CATALOGUE_PROVENANCE_UNTRUSTED');

    // Exact pinned catalogue area record admits and executes with typed elementalSpheres conservation
    const pinnedAdmit = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(room).revision,
      record: doctoredWizardRecord,
      definitionVersion: 1,
      classId: 'arcanoneer'
    });
    assert.equal(pinnedAdmit.success, true, JSON.stringify(pinnedAdmit));
    const healEntry = installed.list(room).entries.find(e => e.definitionRef.definitionId === doctoredWizardRecord.authoredDefinitionId);
    assert.deepEqual(healEntry.descriptor.classPayment, {
      domain: 'elementalSpheres',
      price: { costs: ['ember'], gains: [] }
    });

    token(pc).state.classPayment = {
      version: 1,
      domain: 'elementalSpheres',
      value: { type: 'elementalSpheres', spheres: ['ember', 'arcane'] }
    };
    token(foes[0]).state.currentHp = 15;
    token(foes[1]).state.currentHp = 21;

    const healApproval = buildAreaApproval(healEntry, [foes[0], foes[1]], {
      faces: [6, 6],
      classPayment: {
        domain: 'elementalSpheres',
        before: { type: 'elementalSpheres', spheres: ['ember', 'arcane'] },
        after: { type: 'elementalSpheres', spheres: ['arcane'] },
        price: { costs: ['ember'], gains: [] }
      }
    });
    const healApproved = await ack(owner, 'actor_spell_approve', healApproval);
    assert.equal(healApproved.code, 'awaiting_gm', JSON.stringify(healApproved));

    // Retire the pin before commit: pending command and new approval both refuse atomically while registry stays loadable
    catalogueProfiles.profiles.splice(0, catalogueProfiles.profiles.length, ...originalProfiles);
    const stateBeforeRetired = actors.clone(room.gameState);
    const retiredList = installed.list(room);
    const retiredEntry = retiredList.entries.find(e => e.definitionRef.definitionId === doctoredWizardRecord.authoredDefinitionId);
    assert.equal(retiredEntry.catalogueEligibility.eligible, false);

    const retiredCmd = buildAreaCommand(healApproval, healApproved.contentHash, [
      { finalAmount: 17, adjustmentReason: '' },
      { finalAmount: 17, adjustmentReason: '' }
    ]);
    const retiredCommit = await ack(gm, 'actor_consequence', retiredCmd);
    assert.equal(retiredCommit.success, false);
    assert.equal(retiredCommit.code, 'catalogue_provenance_untrusted');
    assert.deepEqual(room.gameState, stateBeforeRetired);

    // Restore the test pin and verify the pending command now commits and conserves spheres
    catalogueProfiles.profiles.push({
      capability: pure.AREA_CAPABILITY,
      compiler: pure.AREA_COMPILER,
      classId: 'arcanoneer',
      spellId: catalogueAreaRecord.id,
      name: catalogueAreaRecord.name,
      recordHash: selfHash,
      executable: pinnedExecutable
    });
    const healAccepted = await ack(gm, 'actor_consequence', retiredCmd);
    assert.equal(healAccepted.success, true, JSON.stringify(healAccepted));
    assert.equal(token(foes[0]).state.currentHp, 32);
    assert.equal(token(foes[1]).state.currentHp, 38);
    assert.deepEqual(token(pc).state.classPayment.value.spheres, ['arcane']);
    assert.equal(beforeState !== null, true);
  });

  it('2. target duplication refuses cleanly before payment and at execution', async () => {
    const e = await admitArea();
    const before = actors.clone(room.gameState);
    const dupApproval = buildAreaApproval(e, [foes[0], foes[0]]);
    const r1 = await ack(owner, 'actor_spell_approve', dupApproval);
    assert.equal(r1.success, false);
    assert.equal(r1.code, 'duplicate_target_actor');
    assert.deepEqual(room.gameState, before);

    // Even if a raw command duplicates targets in command.targets, validateCommand refuses
    const validA = buildAreaApproval(e, [foes[0], foes[1]]);
    const approved = await ack(owner, 'actor_spell_approve', validA);
    const badCmd = buildAreaCommand(validA, approved.contentHash);
    badCmd.targets = [foes[0], foes[0]];
    const r2 = await ack(gm, 'actor_consequence', badCmd);
    assert.equal(r2.success, false);
    assert.equal(r2.code, 'duplicate_target_actor');
    assert.deepEqual(room.gameState.maps, before.maps);
  });

  it('3. stale, deleted or recreated actor refuses atomically with zero partial payment or HP changes', async () => {
    const e = await admitArea();
    const a = buildAreaApproval(e, [foes[0], foes[1], foes[2]]);
    const approved = await ack(owner, 'actor_spell_approve', a);
    const staleCmd = buildAreaCommand(a, approved.contentHash);

    // Stale revision on 2nd target
    token(foes[1]).state.actorContract.revision += 1;
    const beforeStale = actors.clone(room.gameState.maps);
    const rStale = await ack(gm, 'actor_consequence', staleCmd);
    assert.equal(rStale.success, false);
    assert.equal(rStale.code, 'stale_actor_revision');
    assert.deepEqual(room.gameState.maps, beforeStale);

    // Recreated actor (new instanceId) on 3rd target
    const freshCmdWithOldRef = buildAreaCommand(a, approved.contentHash);
    const oldInstanceId = token(foes[2]).state.actorContract.instanceId;
    token(foes[2]).state.actorContract.instanceId = uuid();
    const beforeRecreated = actors.clone(room.gameState.maps);
    const rRecreated = await ack(gm, 'actor_consequence', freshCmdWithOldRef);
    assert.equal(rRecreated.success, false);
    assert.equal(rRecreated.code, 'actor_binding_conflict');
    assert.deepEqual(room.gameState.maps, beforeRecreated);
    room.gameState.maps.default.tokens.foe3.state.actorContract.instanceId = oldInstanceId;

    // Deleted actor on 3rd target
    const savedFoe3 = room.gameState.maps.default.tokens.foe3;
    delete room.gameState.maps.default.tokens.foe3;
    const beforeDeleted = actors.clone(room.gameState.maps);
    const rDeleted = await ack(gm, 'actor_consequence', freshCmdWithOldRef);
    assert.equal(rDeleted.success, false);
    assert.equal(rDeleted.code, 'actor_not_found');
    assert.deepEqual(room.gameState.maps, beforeDeleted);
    room.gameState.maps.default.tokens.foe3 = savedFoe3;

    // Rebuilding command with live revisions now succeeds cleanly
    const goodCmd = buildAreaCommand(a, approved.contentHash);
    const rOk = await ack(gm, 'actor_consequence', goodCmd);
    assert.equal(rOk.success, true, JSON.stringify(rOk));
  });

  it('4. source included accidentally in targets is refused at approval and command validation', async () => {
    const e = await admitArea();
    const before = actors.clone(room.gameState.maps);
    const badApproval = buildAreaApproval(e, [pc, foes[0]]);
    const r = await ack(owner, 'actor_spell_approve', badApproval);
    assert.equal(r.success, false);
    assert.equal(r.code, 'source_in_targets');
    assert.deepEqual(room.gameState.maps, before);
  });

  it('5. unauthorized submitter, foreign-map actor, and PC target in area targets are refused', async () => {
    const e = await admitArea();
    const before = actors.clone(room.gameState.maps);

    // Non-owner cannot approve for pc
    const a1 = buildAreaApproval(e, [foes[0]]);
    const rUnauth = await ack(observer, 'actor_spell_approve', a1);
    assert.equal(rUnauth.success, false);
    assert.equal(rUnauth.code, 'forbidden');

    // PC target in area targets is refused
    const aPc = buildAreaApproval(e, [foes[0], allyPc]);
    const rPc = await ack(owner, 'actor_spell_approve', aPc);
    assert.equal(rPc.success, false);
    assert.equal(rPc.code, 'unsupported_area_target_kind');

    // Foreign-map creature target is refused
    room.gameState.maps.dungeon.tokens.dfoe = {
      id: 'dfoe',
      stats: { maxHp: 40, maxMana: 0, maxAP: 4 },
      state: { currentHp: 40, currentMana: 0, currentActionPoints: 4, conditions: [] }
    };
    const dungeonFoe = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'dungeon', tokenId: 'dfoe' },
      snapshotHash: actors.hash(room.gameState.maps.dungeon.tokens.dfoe)
    })).ref;
    const aForeign = buildAreaApproval(e, [foes[0], dungeonFoe]);
    const rForeign = await ack(owner, 'actor_spell_approve', aForeign);
    assert.equal(rForeign.success, false);
    assert.equal(rForeign.code, 'cross_map_area_target');
    assert.deepEqual(room.gameState.maps.default, before.default);
  });

  it('6. insufficient resources refuse without partial payment or target changes', async () => {
    const e = await admitArea({ ap: 1, mana: 4 });
    token(pc).character.mana.current = 1;
    token(pc).character.tempMana = 1; // total 2 < 4
    const before = actors.clone(room.gameState.maps);
    const a = buildAreaApproval(e, [foes[0], foes[1]]);
    const r = await ack(owner, 'actor_spell_approve', a);
    assert.equal(r.success, false);
    assert.equal(r.code, 'insufficient_resources');
    assert.deepEqual(room.gameState.maps, before);
  });

  it('7. writer failure leaves approval, retained roll and all actor states unchanged until retry succeeds', async () => {
    const e = await admitArea();
    const a = buildAreaApproval(e, [foes[0], foes[1]]);
    const approved = await ack(owner, 'actor_spell_approve', a);
    const cmd = buildAreaCommand(a, approved.contentHash);
    const before = actors.clone(room.gameState.maps);

    room.isPermanent = true;
    const originalAdmit = writer.admitConsequence;
    writer.admitConsequence = () => ({ queued: false, code: 'm6a_writer_refusal' });

    const refused = await ack(gm, 'actor_consequence', cmd);
    assert.equal(refused.success, false);
    assert.equal(refused.code, 'm6a_writer_refusal');
    assert.deepEqual(room.gameState.maps, before);
    assert.deepEqual(payments.get(room, a.approvalId).approval.roll, a.roll);

    writer.admitConsequence = originalAdmit;
    const retryAccepted = await ack(gm, 'actor_consequence', cmd);
    assert.equal(retryAccepted.success, true, JSON.stringify(retryAccepted));
    assert.equal(token(foes[0]).state.currentHp, 15);
    assert.equal(token(foes[1]).state.currentHp, 12);
  });

  it('8. bounded capacity / receipt limits: >8 targets refused as area_target_capacity_exceeded; 8 targets succeed', async () => {
    // 9 targets refused at approval before any payment
    const e = await admitArea({ maxTargets: 8 });
    const before = actors.clone(room.gameState.maps);
    const a9 = buildAreaApproval(e, foes.slice(0, 9));
    const r9 = await ack(owner, 'actor_spell_approve', a9);
    assert.equal(r9.success, false);
    assert.equal(r9.code, 'area_target_capacity_exceeded');
    assert.deepEqual(room.gameState.maps, before);

    // 8 targets (9 actors including caster) succeed atomically
    const a8 = buildAreaApproval(e, foes.slice(0, 8));
    const approved8 = await ack(owner, 'actor_spell_approve', a8);
    assert.equal(approved8.code, 'awaiting_gm', JSON.stringify(approved8));

    // Oversized chosenResult (>8192 bytes) is refused by validateCommand
    const oversizedCmd = buildAreaCommand(a8, approved8.contentHash);
    oversizedCmd.adjudication = Object.assign({}, oversizedCmd.adjudication, { chosenResult: 'x'.repeat(8200) });
    const rOversized = await ack(gm, 'actor_consequence', oversizedCmd);
    assert.equal(rOversized.success, false);
    assert.equal(rOversized.code, 'invalid_adjudication');
    assert.deepEqual(room.gameState.maps, before);

    const validCmd8 = buildAreaCommand(a8, approved8.contentHash);
    const accepted8 = await ack(gm, 'actor_consequence', validCmd8);
    assert.equal(accepted8.success, true, JSON.stringify(accepted8));
    assert.equal(accepted8.receipt.actors.length, 9);
    assert.equal(accepted8.receipt.targets.length, 8);
  });

  it('9. duplicate / lost-ACK recovery returns the exact receipt once without repeating payment or damage', async () => {
    const e = await admitArea();
    const a = buildAreaApproval(e, [foes[0], foes[1]]);
    const approved = await ack(owner, 'actor_spell_approve', a);
    const cmd = buildAreaCommand(a, approved.contentHash);

    const first = await ack(gm, 'actor_consequence', cmd);
    assert.equal(first.success, true);
    assert.equal(typeof first.delivery, 'string');
    const stateAfterFirst = actors.clone(room.gameState);

    const replay1 = await ack(gm, 'actor_consequence', cmd);
    const replay2 = await ack(gm, 'actor_consequence', cmd);
    const ownerReplay = await ack(owner, 'actor_spell_approve', a);

    assert.equal(replay1.delivery, undefined);
    assert.deepEqual(replay1.receipt, first.receipt);
    assert.deepEqual(replay2.receipt, first.receipt);
    assert.deepEqual(ownerReplay.receipt, first.receipt);
    assert.deepEqual(room.gameState, stateAfterFirst);
  });

  it('10. private target and proposal information: observer receives no pending leak and hidden actors refuse as actor_not_found', async () => {
    const e = await admitArea();
    // Mark foe3 as hiddenFromPlayers
    token(foes[2]).state.hiddenFromPlayers = true;
    const hiddenApproval = buildAreaApproval(e, [foes[0], foes[2]]);
    const rHidden = await ack(owner, 'actor_spell_approve', hiddenApproval);
    assert.equal(rHidden.success, false);
    assert.equal(rHidden.code, 'actor_not_found');

    // Valid approval with visible foes[0], foes[1]: observer listing pending approvals sees nothing
    const validApproval = buildAreaApproval(e, [foes[0], foes[1]]);
    const approved = await ack(owner, 'actor_spell_approve', validApproval);
    assert.equal(approved.code, 'awaiting_gm');

    const obsList = await ack(observer, 'actor_spell_list', { roomId: room.id });
    assert.equal(obsList.success, true);
    assert.deepEqual(obsList.pending, []);

    const gmList = await ack(gm, 'actor_spell_list', { roomId: room.id });
    assert.equal(gmList.success, true);
    assert.equal(gmList.pending.length, 1);
    assert.equal(gmList.pending[0].approval.approvalId, validApproval.approvalId);
  });
});
