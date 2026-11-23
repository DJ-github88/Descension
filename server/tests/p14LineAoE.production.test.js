const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const registry = require('../services/installedDefinitionRegistry');
const pure = require('../shared/services/authoredAbility');
const payments = require('../services/spellPayments');
const relationships = require('../services/actorRelationships');

const ack = (s, event, data) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(event)), 5000);
  s.emit(event, data, r => { clearTimeout(t); resolve(r); });
});
const once = (s, event) => new Promise(resolve => s.once(event, resolve));

describe('Line AoE first slice production authority & geometry tests', function () {
  this.timeout(20000);
  let server, room, gm, owner, observer, gu, uid, obsUid, pc, allyPc, foes, writer;

  beforeEach(async () => {
    pure.setAreaRollProposalForTest(true);
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async () => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of ['token_created', 'actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_revoke', 'actor_relationship_set']) {
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
    map.gridSettings = { gridType: 'square', gridSize: 50, feetPerTile: 5, gridOffsetX: 0, gridOffsetY: 0 };

    // Caster PC at cell (2,2) -> center (125, 125)
    map.characterTokens.pc = {
      id: 'pc',
      ownerUserId: uid,
      position: { x: 125, y: 125 },
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
    // PC Ally inside horizontal line at cell (4,2) -> (225, 125)
    map.characterTokens.ally = {
      id: 'ally',
      ownerUserId: obsUid,
      position: { x: 225, y: 125 },
      character: {
        id: 'ally-c',
        name: 'Bram',
        class: 'Martyr',
        stats: { spirit: 14 },
        health: { current: 28, max: 28 },
        mana: { current: 8, max: 8 },
        actionPoints: { current: 4, max: 4 }
      },
      state: { conditions: [] }
    };

    // Grid actors around (125, 125):
    // foeA (enemy) at (3,2) = (175,125) -> IN 30x5 horizontal line
    // foeC (enemy) at (6,2) = (325,125) -> IN 30x5 horizontal line
    // foeOutside (enemy) at (3,0) = (175,25) -> OUTSIDE horizontal line
    // foeEdge (enemy) at (3,1) = (175,75) -> TANGENT EDGE y=100 (G3a excluded)
    // neutralInside (neutral) at (4,2) = (225,125) -> INSIDE line, excluded by enemy relationship
    // hiddenInside (enemy, hiddenFromPlayers: true) at (5,2) = (275,125) -> INSIDE line, excluded by visibility
    // foeDiag1 (enemy) at (3,3) = (175,175) -> IN 45-deg diagonal line
    // foeDiag2 (enemy) at (4,4) = (225,225) -> IN 45-deg diagonal line
    // foeLarge (enemy, size: 'large' 2x2) at (6,4) = (325,225) -> cells (5,3),(6,3),(5,4),(6,4)
    const specs = [
      ['foeA', 'Goblin A', { x: 175, y: 125 }, { tempHealth: 3 }],
      ['foeC', 'Goblin C', { x: 325, y: 125 }, {}],
      ['foeOutside', 'Goblin Outside', { x: 175, y: 25 }, {}],
      ['foeEdge', 'Goblin Edge', { x: 175, y: 75 }, {}],
      ['neutralInside', 'Bystander', { x: 225, y: 125 }, {}],
      ['hiddenInside', 'Stalker', { x: 275, y: 125 }, { hiddenFromPlayers: true }],
      ['stateHiddenInside', 'Shade', { x: 275, y: 125 }, { isHidden: true }],
      ['foeDiag1', 'Scout SE 1', { x: 175, y: 175 }, {}],
      ['foeDiag2', 'Scout SE 2', { x: 225, y: 225 }, {}],
      ['foeLarge', 'Ogre Large', { x: 325, y: 225 }, { size: 'large' }]
    ];
    foes = {};
    for (const [id, name, position, extra] of specs) {
      map.tokens[id] = {
        id,
        name,
        position,
        ...(extra.size ? { size: extra.size } : {}),
        stats: { maxHp: 50, maxMana: 0, maxAP: 4 },
        state: {
          currentHp: 30,
          currentMana: 0,
          currentActionPoints: 4,
          tempHealth: extra.tempHealth || 0,
          ...(extra.hiddenFromPlayers ? { hiddenFromPlayers: true } : {}),
          ...(extra.isHidden ? { isHidden: true } : {}),
          conditions: []
        }
      };
    }
    for (const [id] of specs) {
      const bound = await ack(gm, 'actor_bind', {
        roomId: room.id,
        ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id },
        snapshotHash: actors.hash(room.gameState.maps.default.tokens[id])
      });
      assert.equal(bound.success, true, `bind ${id}: ${JSON.stringify(bound)}`);
      foes[id] = bound.ref;
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
  });

  afterEach(async () => {
    pure.setAreaRollApprovalForTest(undefined);
    pure.setAreaRollProposalForTest(false);
    gm?.disconnect();
    owner?.disconnect();
    observer?.disconnect();
    await server?.stop();
  });

  const token = ref => actors.locate(room, ref).token;
  async function setRelation(a, b, value) {
    const result = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      pairs: [{ a, b }],
      value,
      expectedRelationshipRevision: relationships.revision(room)
    });
    assert.equal(result.success, true, JSON.stringify(result));
  }

  function makeWizardLineRecord({
    formula = '2d6 + intelligence / 2',
    kind = 'damage',
    lengthFeet = 30,
    widthFeet = 5,
    rangeFeet = 30,
    rangeType = 'ranged',
    aoeType = 'line',
    maxTargets = 8,
    restriction = 'enemy',
    ap = 1,
    mana = 4,
    extraDraft = {},
    aoeParameters = null
  } = {}) {
    const d = Object.assign({
      name: 'Arcane Beam',
      description: 'Bounded immediate damage Line AoE.',
      spellType: 'ACTION',
      typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
      effectTypes: [kind],
      targetingConfig: {
        targetingType: 'area',
        aoeShape: 'line',
        aoeType,
        aoeParameters: aoeParameters || { length: lengthFeet, width: widthFeet },
        rangeType,
        rangeDistance: rangeFeet,
        targetRestrictions: [restriction],
        maxTargets
      },
      resourceCost: {
        actionPoints: ap,
        resourceTypes: mana > 0 ? ['mana'] : [],
        resourceValues: { mana }
      },
      [`${kind}Config`]: kind === 'damage'
        ? { damageType: 'direct', elementType: 'arcane', formula, resolution: 'DICE' }
        : { healingType: 'direct', formula, resolution: 'DICE' }
    }, extraDraft);
    return Object.assign({}, actors.clone(d), { authoredDefinitionId: uuid(), authoredDraft: actors.clone(d) });
  }

  async function admitLine(opts = {}) {
    const record = makeWizardLineRecord(opts);
    const result = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(room).revision,
      record,
      definitionVersion: 1,
      classId: 'arcanoneer'
    });
    assert.equal(result.success, true, JSON.stringify(result));
    const entry = installed.list(room).entries.find(e => e.definitionRef.definitionId === record.authoredDefinitionId);
    for (const id of ['foeA', 'foeC', 'foeOutside', 'foeEdge', 'hiddenInside', 'stateHiddenInside', 'foeDiag1', 'foeDiag2', 'foeLarge']) {
      await setRelation(pc, foes[id], 'enemy');
    }
    return entry;
  }

  function buildLineApproval(e, targetRefs, {
    faces = [4, 5],
    areaOrigin = { x: 125, y: 125 },
    areaTarget = { x: 275, y: 125 }
  } = {}) {
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
      areaTarget,
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
      classPayment: null
    };
  }

  function buildAreaCommand(a, contentHash, outcomes) {
    const sourceRes = actors.resources(token(pc), 'character');
    const payment = {};
    if (a.price.ap > 0) payment.ap = payments.tempFirst(sourceRes.ap.current, sourceRes.ap.temp, a.price.ap);
    if (a.price.mana > 0) payment.mana = payments.tempFirst(sourceRes.mana.current, sourceRes.mana.temp, a.price.mana);
    if (!Object.keys(payment).length) payment.ap = payments.tempFirst(sourceRes.ap.current, sourceRes.ap.temp, 0);
    const actorsList = [
      { ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: payment }
    ];
    let totalFinalAmount = 0;
    const reasons = [];
    for (let i = 0; i < a.targets.length; i++) {
      const ref = a.targets[i];
      const o = outcomes[i];
      const tRes = actors.resources(token(ref), 'creature');
      const fromTemp = Math.min(tRes.hp.temp, o.finalAmount);
      const hp = { current: Math.max(0, tRes.hp.current - (o.finalAmount - fromTemp)), temp: tRes.hp.temp - fromTemp };
      actorsList.push({ ref, expectedRevision: token(ref).state.actorContract.revision, finalResources: { hp } });
      totalFinalAmount += o.finalAmount;
      if (o.adjustmentReason) reasons.push(o.adjustmentReason);
    }
    return {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: pc,
      targets: a.targets,
      approval: { approvalId: a.approvalId, contentHash },
      actors: actorsList,
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
          targets: outcomes.map((o, idx) => ({ ref: a.targets[idx], finalAmount: o.finalAmount, adjustmentReason: o.adjustmentReason || '' })),
          gmConfirmed: true
        }),
        finalAmount: totalFinalAmount,
        adjustmentReason: reasons.join('; ')
      }
    };
  }

  it('1. Compiles bounded Wizard Line damage record and preserves/refuses unsupported Line variants', () => {
    const valid = makeWizardLineRecord();
    const compiled = pure.definitionFromWizard(valid, { roomId: room.id, classId: 'arcanoneer', definitionVersion: 1 });
    assert.equal(compiled.ok, true, JSON.stringify(compiled));
    assert.equal(compiled.definition.capability, pure.AREA_CAPABILITY);
    assert.deepEqual(compiled.definition.targeting, {
      kind: 'area',
      aoeShape: 'line',
      lengthFeet: 30,
      widthFeet: 5,
      rangeFeet: 30,
      maxTargets: 8,
      restriction: 'enemy'
    });
    assert.match(pure.definitionSummary(compiled.definition), /line 30×5 ft/);
    const regChecked = registry.compileDefinition(compiled.definition);
    assert.equal(regChecked.ok, true, JSON.stringify(regChecked));

    // Unsupported combinations must refuse clearly:
    const unsupportedCases = [
      ['healing', makeWizardLineRecord({ kind: 'healing', formula: '2d6' }), /line currently supports immediate damage/],
      ['save', (() => { const r = makeWizardLineRecord(); r.damageConfig.savingThrow = true; r.authoredDraft = actors.clone(r); return r; })(), /save/],
      ['cooldown-legacy', makeWizardLineRecord({ extraDraft: { cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 } } }), /cooldownConfig/],
      ['cooldown-caster-start', makeWizardLineRecord({ extraDraft: { cooldownConfig: { cooldownType: require('../shared/services/authoredCooldown').TYPE, cooldownValue: 2 } } }), /Cooldowns/],
      ['missing-width', makeWizardLineRecord({ aoeParameters: { radius: 15 } }), /area shape/],
      ['self-centered', makeWizardLineRecord({ rangeType: 'self_centered', rangeFeet: 0 }), /area range/],
      ['width-over-20', makeWizardLineRecord({ widthFeet: 25 }), /aoeParameters\.width/],
      ['length-over-120', makeWizardLineRecord({ lengthFeet: 125 }), /aoeParameters\.length/]
    ];
    for (const [label, rec, pat] of unsupportedCases) {
      const res = pure.definitionFromWizard(rec, { roomId: room.id, classId: 'arcanoneer', definitionVersion: 1 });
      assert.equal(res.ok, false, `Expected ${label} to stay manual`);
      assert.match(res.reason, pat, `Unexpected reason for ${label}: ${res.reason}`);
    }
  });

  it('2. Real grid horizontal line: 2 eligible in line hit once, edge (G3a), outside, neutral, hidden and PC excluded', async () => {
    const entry = await admitLine();
    // Forged client target lists must all be rejected by authoritative server:
    // (a) Including outside target
    const withOutside = buildLineApproval(entry, [foes.foeA, foes.foeC, foes.foeOutside]);
    const rOut = await ack(owner, 'actor_spell_approve', withOutside);
    assert.equal(rOut.success, false);
    assert.equal(rOut.code, 'stale_area_placement');

    // (b) Including G3a boundary-tangent edge target (foeEdge at y=75 touches line edge y=100)
    const withEdge = buildLineApproval(entry, [foes.foeA, foes.foeC, foes.foeEdge]);
    const rEdge = await ack(owner, 'actor_spell_approve', withEdge);
    assert.equal(rEdge.success, false);
    assert.equal(rEdge.code, 'stale_area_placement');

    // (c) Omitting eligible in-line target foeC
    const omitted = buildLineApproval(entry, [foes.foeA]);
    const rOmit = await ack(owner, 'actor_spell_approve', omitted);
    assert.equal(rOmit.success, false);
    assert.equal(rOmit.code, 'stale_area_placement');

    // (d) Including neutralInside (relationship restriction)
    const withNeutral = buildLineApproval(entry, [foes.foeA, foes.foeC, foes.neutralInside]);
    const rNeutral = await ack(owner, 'actor_spell_approve', withNeutral);
    assert.equal(rNeutral.success, false);
    assert.equal(rNeutral.code, 'target_relationship_mismatch');

    // (e) Including hiddenInside (hiddenFromPlayers) or stateHiddenInside (state.isHidden)
    const withHidden = buildLineApproval(entry, [foes.foeA, foes.foeC, foes.hiddenInside]);
    const rHidden = await ack(owner, 'actor_spell_approve', withHidden);
    assert.equal(rHidden.success, false);
    assert.equal(rHidden.code, 'actor_not_found');

    const withStateHidden = buildLineApproval(entry, [foes.foeA, foes.foeC, foes.stateHiddenInside]);
    const rStateHidden = await ack(owner, 'actor_spell_approve', withStateHidden);
    assert.equal(rStateHidden.success, false);
    assert.equal(rStateHidden.code, 'actor_not_found');

    // (f) Including PC inside the line
    const withPc = buildLineApproval(entry, [foes.foeA, foes.foeC, allyPc]);
    const rPc = await ack(owner, 'actor_spell_approve', withPc);
    assert.equal(rPc.success, false);
    assert.equal(rPc.code, 'unsupported_area_target_kind');

    // (g) Origin out of range & coincident direction
    const outRange = buildLineApproval(entry, [foes.foeA], { areaOrigin: { x: 450, y: 125 }, areaTarget: { x: 600, y: 125 } });
    const rRange = await ack(owner, 'actor_spell_approve', outRange);
    assert.equal(rRange.success, false);
    assert.equal(rRange.code, 'area_origin_out_of_range');

    const zeroDir = buildLineApproval(entry, [foes.foeA], { areaOrigin: { x: 125, y: 125 }, areaTarget: { x: 125, y: 125 } });
    const rZero = await ack(owner, 'actor_spell_approve', zeroDir);
    assert.equal(rZero.success, false);
    assert.equal(rZero.code, 'area_direction_required');

    // Valid approval with the exact 2 eligible targets in the horizontal line: foeA + foeC
    const validApp = buildLineApproval(entry, [foes.foeA, foes.foeC], { faces: [4, 5] });
    const rValid = await ack(owner, 'actor_spell_approve', validApp);
    assert.equal(rValid.success, false);
    assert.equal(rValid.code, 'awaiting_gm');

    // GM adjudicates 18 on foeA and 9 on foeC with reason
    const cmd = buildAreaCommand(validApp, rValid.contentHash, [
      { ref: foes.foeA, finalAmount: 18, adjustmentReason: '' },
      { ref: foes.foeC, finalAmount: 9, adjustmentReason: 'Partial beam cover' }
    ]);
    const committed = await ack(gm, 'actor_consequence', cmd);
    assert.equal(committed.success, true, JSON.stringify(committed));

    // Single source payment (temp-first: AP 1 from tempActionPoints 1->0, current 4; mana 4 -> 2 temp + 2 current -> 0 temp, 8 current)
    const pcRes = actors.resources(token(pc), 'character');
    assert.equal(pcRes.ap.current, 4);
    assert.equal(pcRes.ap.temp, 0);
    assert.equal(pcRes.mana.current, 8);
    assert.equal(pcRes.mana.temp, 0);

    // foeA (30 + 3 temp - 18 = 15) and foeC (30 - 9 = 21); excluded actors untouched
    assert.deepEqual(actors.resources(token(foes.foeA), 'creature').hp, { current: 15, temp: 0, max: 50 });
    assert.deepEqual(actors.resources(token(foes.foeC), 'creature').hp, { current: 21, temp: 0, max: 50 });
    assert.equal(actors.resources(token(foes.foeOutside), 'creature').hp.current, 30);
    assert.equal(actors.resources(token(foes.foeEdge), 'creature').hp.current, 30);
    assert.equal(actors.resources(token(foes.neutralInside), 'creature').hp.current, 30);
    assert.equal(actors.resources(token(foes.hiddenInside), 'creature').hp.current, 30);
    assert.equal(actors.resources(token(allyPc), 'character').hp.current, 28);

    // Lost ACK / duplicate command replay returns exact same receipt without second payment or damage
    const stateAfterFirst = actors.clone(room.gameState);
    const replayed = await ack(gm, 'actor_consequence', cmd);
    assert.equal(replayed.success, true);
    assert.equal(replayed.receipt.commandId, committed.receipt.commandId);
    assert.deepEqual(room.gameState, stateAfterFirst);
    assert.equal(actors.resources(token(pc), 'character').mana.current, 8);
    assert.equal(actors.resources(token(foes.foeA), 'creature').hp.current, 15);
  });

  it('3. Rotated 45° diagonal line + Large 2x2 creature single inclusion + stale spatial placement refusal', async () => {
    const entry = await admitLine();
    // Placed diagonal line from (175,175) (~7.1 ft SE of caster) aimed toward (275,275):
    // foeA (175,125) cell (3,2) only touches back-cap corner (200,150) at x+y=350 -> G3a 'edge', excluded!
    // foeDiag1 (175,175), foeDiag2 (225,225), and Large 2x2 foeLarge at (325,225) spanning tile (5,4) x=[250,300],y=[200,250] are hit once!
    // Creator rule (2026-11-19): a Line starts at the caster. An origin away from the caster is refused...
    const offCaster = buildLineApproval(entry, [foes.foeDiag1, foes.foeDiag2, foes.foeLarge], { areaOrigin: { x: 175, y: 175 }, areaTarget: { x: 275, y: 275 } });
    const rOff = await ack(owner, 'actor_spell_approve', offCaster);
    assert.equal(rOff.success, false); assert.equal(rOff.code, 'area_origin_out_of_range');
    // ...so the same diagonal geometry is exercised with the caster standing at the origin.
    token(pc).position = { x: 175, y: 175 };
    const diagApp = buildLineApproval(entry, [foes.foeDiag1, foes.foeDiag2, foes.foeLarge], {
      areaOrigin: { x: 175, y: 175 },
      areaTarget: { x: 275, y: 275 }
    });
    const rDiag = await ack(owner, 'actor_spell_approve', diagApp);
    assert.equal(rDiag.success, false, JSON.stringify(rDiag));
    assert.equal(rDiag.code, 'awaiting_gm');

    // Simulate foeDiag2 moving out of the rotated line BEFORE GM confirms -> owner_reapproval_required, zero spend/damage
    token(foes.foeDiag2).position = { x: 25, y: 375 };
    const staleCmd = buildAreaCommand(diagApp, rDiag.contentHash, [
      { ref: foes.foeDiag1, finalAmount: 18, adjustmentReason: '' },
      { ref: foes.foeDiag2, finalAmount: 18, adjustmentReason: '' },
      { ref: foes.foeLarge, finalAmount: 18, adjustmentReason: '' }
    ]);
    const rStale = await ack(gm, 'actor_consequence', staleCmd);
    assert.equal(rStale.success, false);
    assert.equal(rStale.code, 'owner_reapproval_required');
    assert.equal(actors.resources(token(pc), 'character').ap.temp, 1);
    assert.equal(actors.resources(token(foes.foeDiag1), 'creature').hp.current, 30);

    // Owner re-aims on updated room state hitting remaining [foeDiag1, foeLarge]
    const diag2 = buildLineApproval(entry, [foes.foeDiag1, foes.foeLarge], {
      faces: [4, 5],
      areaOrigin: { x: 175, y: 175 },
      areaTarget: { x: 275, y: 275 }
    });
    const rDiag2 = await ack(owner, 'actor_spell_approve', diag2);
    assert.equal(rDiag2.code, 'awaiting_gm');

    // Non-spatial revision bump -> stale_actor_revision CAS check preserved
    token(foes.foeDiag1).state.actorContract.revision += 1;
    const revCmd = buildAreaCommand(diag2, rDiag2.contentHash, [
      { ref: foes.foeDiag1, finalAmount: 18, adjustmentReason: '' },
      { ref: foes.foeLarge, finalAmount: 18, adjustmentReason: '' }
    ]);
    // Override expectedRevision back to 0 to prove stale_actor_revision fires cleanly
    revCmd.actors[1].expectedRevision = 0;
    const rRev = await ack(gm, 'actor_consequence', revCmd);
    assert.equal(rRev.success, false);
    assert.equal(rRev.code, 'stale_actor_revision');

    // Fresh command on updated revision commits once, Large creature damaged once
    const finalCmd = buildAreaCommand(diag2, rDiag2.contentHash, [
      { ref: foes.foeDiag1, finalAmount: 18, adjustmentReason: '' },
      { ref: foes.foeLarge, finalAmount: 18, adjustmentReason: '' }
    ]);
    const ok = await ack(gm, 'actor_consequence', finalCmd);
    assert.equal(ok.success, true, JSON.stringify(ok));
    assert.equal(actors.resources(token(foes.foeDiag1), 'creature').hp.current, 12);
    assert.equal(actors.resources(token(foes.foeLarge), 'creature').hp.current, 12);
    assert.equal(actors.resources(token(foes.foeDiag2), 'creature').hp.current, 30);
    assert.equal(actors.resources(token(pc), 'character').mana.current, 8);
  });

  it('4. Live-room token_created + outbound projection preserves large (2x2) size and clips non-anchor tile once', async () => {
    const entry = await admitLine({ lengthFeet: 15, widthFeet: 5, rangeFeet: 30 });
    const createdEvent = once(owner, 'token_created');
    gm.emit('token_created', {
      roomId: room.id,
      mapId: 'default',
      position: { x: 325, y: 325 },
      creature: {
        id: 'bestiary-cave-ogre',
        name: 'Cave Ogre',
        size: 'Large',
        stats: { maxHp: 50, maxMana: 0, maxAP: 4 }
      },
      token: {
        id: 'caveOgre',
        creatureId: 'bestiary-cave-ogre',
        state: { currentHp: 30, currentMana: 0, currentActionPoints: 4, tempHealth: 0, conditions: [] }
      }
    });
    const broadcast = await createdEvent;
    assert.equal(broadcast.tokenId, 'caveOgre');
    assert.equal(broadcast.token.size, 'large');

    // Outbound projection strips unallowlisted/arbitrary size strings
    const { projectTokenForClient } = require('../services/roomAccessService');
    assert.equal(projectTokenForClient({ id: 'x', size: 'MARKER_SECRET' }).size, undefined);
    assert.deepEqual(pure.tokenFootprintForArea(broadcast.token, []), { width: 2, height: 2 });

    const boundOgre = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'caveOgre' },
      snapshotHash: actors.hash(room.gameState.maps.default.tokens.caveOgre)
    })).ref;
    await setRelation(pc, boundOgre, 'enemy');

    // 15x5 ft East line from (125, 275) (15 ft S of pc) -> ends at x=275, clipping ONLY non-anchor top-left cell (5,5) [250..300,250..300]
    // of caveOgre (anchor (6,6) [300..350,300..350] is completely outside).
    // Creator rule (2026-11-19): a Line starts at the caster; the off-caster origin is refused, then the caster stands at it.
    const offCaster = buildLineApproval(entry, [boundOgre], { areaOrigin: { x: 125, y: 275 }, areaTarget: { x: 225, y: 275 }, faces: [4, 5] });
    const rOff = await ack(owner, 'actor_spell_approve', offCaster);
    assert.equal(rOff.success, false); assert.equal(rOff.code, 'area_origin_out_of_range');
    token(pc).position = { x: 125, y: 275 };
    const app = buildLineApproval(entry, [boundOgre], {
      areaOrigin: { x: 125, y: 275 },
      areaTarget: { x: 225, y: 275 },
      faces: [4, 5]
    });
    const approved = await ack(owner, 'actor_spell_approve', app);
    assert.equal(approved.success, false, JSON.stringify(approved));
    assert.equal(approved.code, 'awaiting_gm');

    const cmd = buildAreaCommand(app, approved.contentHash, [
      { ref: boundOgre, finalAmount: 18, adjustmentReason: 'Non-anchor tile clip' }
    ]);
    const committed = await ack(gm, 'actor_consequence', cmd);
    assert.equal(committed.success, true, JSON.stringify(committed));
    assert.equal(actors.resources(token(boundOgre), 'creature').hp.current, 12);
    assert.equal(actors.resources(token(pc), 'character').mana.current, 8);
  });

  // ---- GM grid scale (feet per square). Same grid (50 px squares); only the scale changes. ----
  async function setScale(feetPerTile, sender = gm) {
    const heard = once(observer, 'gameplay_settings_updated');
    sender.emit('sync_gameplay_settings', { feetPerTile, roomId: room.id });
    return Promise.race([heard, new Promise(resolve => setTimeout(() => resolve(null), 400))]);
  }

  it('5. GM grid scale: sync_gameplay_settings stores a valid top-level feetPerTile, broadcasts it, and ignores invalid or non-GM values', async () => {
    assert.equal(room.gameState.feetPerTile, undefined);
    server.setEventLimits('sync_gameplay_settings', { maxPerMinute: 4000, maxPerSecond: 4000 }); // many rapid probes below
    const heard = await setScale(10);
    assert.equal(room.gameState.feetPerTile, 10);
    assert.equal(room.settings.feetPerTile, 10);
    assert.equal(heard.feetPerTile, 10, 'clients read a top-level feetPerTile');
    assert.equal(heard.feetPerTileRevision, 1);
    assert.equal(heard.roomId, room.id);
    assert.equal(heard.sourceSocketId, gm.id, 'the sending socket can recognise its own echo');
    assert.equal(room.gameState.feetPerTileRevision, 1);
    assert.equal(heard.settings.feetPerTile, 10);

    // Older senders that nest it under settings still work.
    const nested = once(observer, 'gameplay_settings_updated');
    gm.emit('sync_gameplay_settings', { settings: { feetPerTile: 15 }, roomId: room.id });
    const nestedHeard = await nested;
    assert.equal(nestedHeard.feetPerTile, 15);
    assert.equal(nestedHeard.feetPerTileRevision, 2);
    assert.equal(room.gameState.feetPerTile, 15);

    for (const bad of [0, -5, 21, 1e9, '10', null, NaN]) {
      await setScale(bad);
      assert.equal(room.gameState.feetPerTile, 15, `invalid ${String(bad)} must be ignored`);
      const nestedBad = once(observer, 'gameplay_settings_updated');
      gm.emit('sync_gameplay_settings', { settings: { feetPerTile: bad, maxPlayers: 6 }, roomId: room.id });
      const heardBad = await nestedBad;
      assert.equal(room.gameState.feetPerTile, 15);
      assert.equal(room.settings.feetPerTile, 15, `nested invalid ${String(bad)} must not reach room.settings`);
      assert.equal(heardBad.settings.feetPerTile, 15);
      assert.equal(heardBad.feetPerTile, undefined);
    }
    // A player cannot change the scale.
    const fromPlayer = await setScale(5, owner);
    assert.equal(fromPlayer, null);
    assert.equal(room.gameState.feetPerTile, 15);

    // The configured scale outranks a map-level value and reaches joining clients in the room projection.
    const projection = require('../services/roomAccessService').buildRoomProjection(room);
    assert.equal(projection.gameState.feetPerTile, 15);
    assert.equal(projection.gameState.feetPerTileRevision, 2, 'invalid values never advance the revision');
    assert.equal(room.gameState.maps.default.gridSettings.feetPerTile, 5);
  });

  it('6. GM grid scale: 30 ft Line footprint and committed targets at 5 ft and at 10 ft per square, caster anchored', async () => {
    const entry = await admitLine();
    const lineTargets = (a) => a.targets.map(t => t.tokenId).sort();

    // 5 ft per square (configured explicitly): 30 ft = 6 squares = 300 px from (125,125) -> foeA (175) and foeC (325).
    await setScale(5);
    assert.equal(room.gameState.feetPerTile, 5);
    const at5 = buildLineApproval(entry, [foes.foeA, foes.foeC]);
    const r5 = await ack(owner, 'actor_spell_approve', at5);
    assert.equal(r5.code, 'awaiting_gm', JSON.stringify(r5));
    const c5 = await ack(gm, 'actor_consequence', buildAreaCommand(at5, r5.contentHash, [
      { ref: foes.foeA, finalAmount: 18 }, { ref: foes.foeC, finalAmount: 18 }
    ]));
    assert.equal(c5.success, true, JSON.stringify(c5));
    assert.deepEqual(lineTargets(at5), ['foeA', 'foeC']);
    assert.equal(actors.resources(token(foes.foeA), 'creature').hp.current, 15); // 30 + 3 temp - 18
    assert.equal(actors.resources(token(foes.foeC), 'creature').hp.current, 12);

    // 10 ft per square: the same 30 ft Line is 3 squares = 150 px, ending at x=275 -> foeA only; foeC (cell 300..350) is outside.
    await setScale(10);
    assert.equal(room.gameState.feetPerTile, 10);
    const staleAt10 = buildLineApproval(entry, [foes.foeA, foes.foeC]);
    const rStale = await ack(owner, 'actor_spell_approve', staleAt10);
    assert.equal(rStale.success, false);
    assert.equal(rStale.code, 'stale_area_placement', 'the 5 ft footprint is not legal at 10 ft per square');

    // Caster anchoring still holds at 10 ft: a shifted origin is refused before approval.
    const shifted = buildLineApproval(entry, [foes.foeC], { areaOrigin: { x: 225, y: 125 }, areaTarget: { x: 375, y: 125 } });
    const rShift = await ack(owner, 'actor_spell_approve', shifted);
    assert.equal(rShift.success, false);
    assert.equal(rShift.code, 'area_origin_out_of_range');

    const before = actors.clone(actors.resources(token(pc), 'character'));
    const at10 = buildLineApproval(entry, [foes.foeA]);
    const r10 = await ack(owner, 'actor_spell_approve', at10);
    assert.equal(r10.code, 'awaiting_gm', JSON.stringify(r10));
    const c10 = await ack(gm, 'actor_consequence', buildAreaCommand(at10, r10.contentHash, [{ ref: foes.foeA, finalAmount: 9, adjustmentReason: 'Half damage (test)' }]));
    assert.equal(c10.success, true, JSON.stringify(c10));
    assert.deepEqual(lineTargets(at10), ['foeA']);
    assert.equal(actors.resources(token(foes.foeA), 'creature').hp.current, 6); // 15 - 9
    assert.equal(actors.resources(token(foes.foeC), 'creature').hp.current, 12, 'foeC untouched at 10 ft per square');
    assert.equal(before.mana.temp, 0);
    assert.equal(actors.resources(token(pc), 'character').mana.current, before.mana.current - 4, 'one payment for the 10 ft cast');
  });

  it('7. GM grid scale: changing the scale between approval and commit forces re-approval without spending or damage', async () => {
    const entry = await admitLine();
    await setScale(10);
    const app = buildLineApproval(entry, [foes.foeA]);
    const approved = await ack(owner, 'actor_spell_approve', app);
    assert.equal(approved.code, 'awaiting_gm', JSON.stringify(approved));
    await setScale(5); // the 30 ft Line now reaches foeC as well; the approved target list is incomplete
    const stateBefore = actors.clone(room.gameState.maps.default);
    const ledgerBefore = actors.ledger(room).commitSequence;
    const committed = await ack(gm, 'actor_consequence', buildAreaCommand(app, approved.contentHash, [{ ref: foes.foeA, finalAmount: 18 }]));
    assert.equal(committed.success, false, JSON.stringify(committed));
    assert.equal(committed.code, 'owner_reapproval_required');
    assert.equal(actors.ledger(room).commitSequence, ledgerBefore);
    assert.deepEqual(actors.resources(token(pc), 'character'), actors.resources({ ...stateBefore.characterTokens.pc }, 'character'));
    assert.equal(actors.resources(token(foes.foeA), 'creature').hp.current, 30);
    assert.equal(actors.resources(token(foes.foeC), 'creature').hp.current, 30);
  });
});
