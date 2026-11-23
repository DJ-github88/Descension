import {
  AREA_CAPABILITY,
  AREA_ROLL_PROCEDURE,
  definitionFromWizard,
  definitionSummary,
  hasKnownTokenFootprint,
  lineCellOverlap,
  setAreaRollProposalForTest,
  tokenFootprintForArea
} from '../authoredAbility';
import {
  radiantPreviewProfile,
  classifyAreaTokens,
  visibleAreaCandidates
} from '../areaPreview';
import { buildApproval, planSpellCommand, spellReceipt, recordRoll } from '../spellConsequence';
import { explainExecution } from '../../components/spellcrafting-wizard/utils/executionCompatibility';
import { buildSpellBehaviorModel } from '../../components/spellcrafting-wizard/components/common/spellBehaviorPresentation';

describe('Line AoE first slice: compiler, SAT geometry, Wizard Review, saved card, and combat planning', () => {
  const roomId = 'room-line-test';
  const mapId = 'default';

  beforeEach(() => {
    setAreaRollProposalForTest(true);
  });

  afterEach(() => {
    setAreaRollProposalForTest(false);
  });

  const makeWizardLineDraft = (overrides = {}) => ({
    name: 'Arcane Beam',
    description: 'Immediate Line damage AoE.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
    effectTypes: ['damage'],
    targetingConfig: {
      targetingType: 'area',
      aoeShape: 'line',
      aoeType: 'line',
      aoeParameters: { length: 30, width: 5, radius: 20 },
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 8,
      ...(overrides.targetingConfig || {})
    },
    resourceCost: {
      actionPoints: 1,
      resourceTypes: ['mana'],
      resourceValues: { mana: 2 },
      ...(overrides.resourceCost || {})
    },
    damageConfig: {
      damageType: 'direct',
      elementType: 'arcane',
      formula: '2d6 + 8',
      resolution: 'DICE',
      ...(overrides.damageConfig || {})
    },
    ...overrides.root
  });

  test('1. Compiles bounded Line damage spell and accurately describes supported and manual records in Review and Saved Card', () => {
    const draft = makeWizardLineDraft();
    const record = {
      ...draft,
      id: 'spell-line-1',
      authoredDefinitionId: '11111111-2222-4333-8444-555555555555',
      authoredDraft: JSON.parse(JSON.stringify(draft))
    };

    const res = definitionFromWizard(record, { roomId, classId: 'arcanoneer', definitionVersion: 1 });
    expect(res.ok).toBe(true);
    expect(res.definition.capability).toBe(AREA_CAPABILITY);
    expect(res.definition.targeting).toEqual({
      kind: 'area',
      aoeShape: 'line',
      lengthFeet: 30,
      widthFeet: 5,
      rangeFeet: 30,
      maxTargets: 8,
      restriction: 'enemy'
    });
    expect(definitionSummary(res.definition)).toBe('damage · 2d6 + 8 arcane · line 30×5 ft (up to 8 creatures)');

    const reviewVm = explainExecution(record, { roomId, classId: 'arcanoneer', shared: true, gm: true });
    expect(reviewVm.state).toBe('partial');
    expect(reviewVm.automated.join(' ')).toMatch(/line 30×5 ft/);
    expect(reviewVm.automated.join(' ')).toMatch(/Target: line from the caster, 30×5 ft \(you aim the direction\)/);

    const cardVm = buildSpellBehaviorModel(record);
    expect(cardVm.steps.find(s => s.id === 'activation').summary).toBe('1 AP, 2 mana · 30×5 ft line from the caster');

    // Unsupported combination: Line + Healing stays manual (unsupported) and explains why
    const healDraft = {
      name: 'Beam of Mending',
      description: 'Unsupported healing line.',
      spellType: 'ACTION',
      typeConfig: { castTimeType: 'IMMEDIATE', school: 'sacred' },
      effectTypes: ['healing'],
      targetingConfig: {
        targetingType: 'area',
        aoeShape: 'line',
        aoeType: 'line',
        aoeParameters: { length: 30, width: 5 },
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally'],
        maxTargets: 8
      },
      resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 2 } },
      healingConfig: { healingType: 'direct', formula: '2d6', resolution: 'DICE' }
    };
    const healRecord = {
      ...healDraft,
      authoredDefinitionId: '22222222-2222-4333-8444-555555555555',
      authoredDraft: JSON.parse(JSON.stringify(healDraft))
    };
    const healReview = explainExecution(healRecord, { roomId, classId: 'martyr', shared: true, gm: true });
    expect(healReview.state).toBe('unsupported');
    expect(healReview.reasons.map(r => r.text).join(' ')).toMatch(/immediate damage only/i);
    const healCard = buildSpellBehaviorModel(healRecord);
    expect(healCard.steps.find(s => s.id === 'activation').summary).toMatch(/Line 30×5 ft, 30 ft/);
  });

  test('2. Real grid preview and server command planner agree on Line geometry (2 hit, edge excluded, rotated diagonal)', () => {
    const lineAction = {
      id: '11111111-2222-4333-8444-555555555555:1',
      name: 'Arcane Beam',
      capability: AREA_CAPABILITY,
      kind: 'damage',
      definitionHash: `${AREA_CAPABILITY}/${'a'.repeat(64)}`,
      areaTerms: { kind: 'area', aoeShape: 'line', lengthFeet: 30, widthFeet: 5, rangeFeet: 30, maxTargets: 8, restriction: 'enemy' }
    };
    const profile = radiantPreviewProfile(lineAction, 'damage');
    expect(profile.error).toBeUndefined();
    expect(profile.aoeShape).toBe('line');
    expect(profile.lengthFeet).toBe(30);
    expect(profile.widthFeet).toBe(5);
    expect(radiantPreviewProfile(lineAction, 'healing').error).toMatch(/immediate damage only/);

    const sourceRef = { kind: 'character', roomId, mapId, tokenId: 'pc', instanceId: 'i-pc', ownerUid: 'u1', characterId: 'c1' };
    const pcToken = {
      id: 'pc',
      mapId,
      position: { x: 125, y: 125 },
      ownerUserId: 'u1',
      character: { id: 'c1', name: 'Lyra', stats: { intelligence: 10 }, health: { current: 24, max: 30 }, mana: { current: 10, max: 12 }, actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 },
      state: { conditions: [], actorContract: { version: 1, ...sourceRef, revision: 0, primary: true } }
    };
    const mkFoe = (id, x, y, extra = {}) => ({
      token: {
        id,
        mapId,
        position: { x, y },
        state: { currentHp: 30, maxHp: 30, tempHealth: 0, ...extra.state, actorContract: { version: 1, kind: 'creature', roomId, mapId, tokenId: id, instanceId: `i-${id}`, revision: 0 } }
      },
      name: () => id,
      footprint: () => ({ width: 1, height: 1 })
    });
    const foeA = mkFoe('A', 175, 125);       // (3,2) in horizontal line
    const foeC = mkFoe('C', 325, 125);       // (6,2) in horizontal line
    const foeEdge = mkFoe('Edge', 175, 75);  // (3,1) tangent y=100 -> 'edge' (G3a excluded)
    const foeOut = mkFoe('Out', 175, 25);    // (3,0) outside
    const hidden = mkFoe('Hidden', 225, 125, { state: { hiddenFromPlayers: true } });
    const allyPc = {
      token: {
        id: 'pc2',
        mapId,
        position: { x: 275, y: 125 },
        character: { id: 'c2', name: 'Bram' },
        state: { actorContract: { version: 1, kind: 'character', roomId, mapId, tokenId: 'pc2', instanceId: 'i-pc2', ownerUid: 'u2', characterId: 'c2', primary: true } }
      },
      name: () => 'Bram',
      footprint: () => ({ width: 1, height: 1 })
    };

    const entries = [foeA, foeC, foeEdge, foeOut, hidden, allyPc];
    const classified = classifyAreaTokens(entries, {
      visible: () => true,
      aoeShape: 'line',
      origin: { x: 125, y: 125 },
      target: { x: 275, y: 125 },
      length: 300,
      width: 50,
      gridSize: 50,
      mapId,
      sourceRef
    });
    const statusById = Object.fromEntries(classified.map(item => [item.ref.tokenId, item]));
    expect(statusById.A.status).toBe('candidate');
    expect(statusById.C.status).toBe('candidate');
    expect(statusById.Edge.status).toBe('edge');
    expect(statusById.Out.status).toBe('outside');
    expect(statusById.Hidden).toBeUndefined();
    expect(statusById.pc2.status).toBe('candidate');
    expect(statusById.pc2.eligibleCreature).toBe(false);

    // Rotated 45° diagonal line from (175,175) aimed toward (275,275):
    // With 50px width, cell (3,2) is outside, cell (3,3) and off-center diagonal adjacent cell (4,3) are candidates;
    // with width 50*sqrt(2), cell (3,2) touches only corner (200,150) at zero area -> 'edge'.
    expect(lineCellOverlap({ x: 175, y: 175 }, { x: 275, y: 275 }, 300, 50, { x: 3, y: 2 }, 50)).toBe('outside');
    expect(lineCellOverlap({ x: 175, y: 175 }, { x: 275, y: 275 }, 300, 50, { x: 3, y: 3 }, 50)).toBe('candidate');
    expect(lineCellOverlap({ x: 175, y: 175 }, { x: 275, y: 275 }, 300, 50, { x: 4, y: 3 }, 50)).toBe('candidate');
    expect(lineCellOverlap({ x: 175, y: 175 }, { x: 275, y: 275 }, 300, 50 * Math.SQRT2, { x: 3, y: 2 }, 50)).toBe('edge');

    const cands = visibleAreaCandidates([foeA, foeC, foeEdge, foeOut], {
      visible: () => true,
      aoeShape: 'line',
      origin: { x: 125, y: 125 },
      target: { x: 275, y: 125 },
      length: 300,
      width: 50,
      gridSize: 50,
      mapId
    });
    expect(cands.map(c => `${c.ref.tokenId}:${c.status}`)).toEqual(['A:candidate', 'C:candidate', 'Edge:edge']);

    const support = {
      supported: true,
      isArea: true,
      definitionId: lineAction.id,
      definitionHash: lineAction.definitionHash,
      name: 'Arcane Beam',
      kind: 'damage',
      damageTypes: ['arcane'],
      price: { ap: 1, mana: 2 },
      reading: { dice: [{ count: 2, sides: 6 }], constant: 8, reading: '2d6 + 8' },
      payment: { affordable: true, classPayment: null },
      areaTerms: lineAction.areaTerms
    };
    const tokens = [pcToken, foeA.token, foeC.token];
    const targetRefs = [foeA.token.state.actorContract, foeC.token.state.actorContract].map(c => ({
      kind: c.kind, roomId: c.roomId, mapId: c.mapId, tokenId: c.tokenId, instanceId: c.instanceId
    }));
    const roll = recordRoll('physical', support.reading, [[4, 5]]);

    // Missing direction refuses clearly before building approval
    expect(() => buildApproval({
      support, tokens, sourceRef, targetRefs,
      areaOrigin: { x: 125, y: 125 }, areaTarget: { x: 125, y: 125 },
      roomId, mapId, actionEpoch: 'ep-1', baseCommitSequence: 0, roll, approvalId: '33333333-3333-4333-8333-333333333333'
    })).toThrow(/Aim the line direction/);

    const approval = buildApproval({
      support, tokens, sourceRef, targetRefs,
      areaOrigin: { x: 125, y: 125 }, areaTarget: { x: 275, y: 125 },
      roomId, mapId, actionEpoch: 'ep-1', baseCommitSequence: 0, roll, approvalId: '33333333-3333-4333-8333-333333333333'
    });
    expect(approval.areaOrigin).toEqual({ x: 125, y: 125 });
    expect(approval.areaTarget).toEqual({ x: 275, y: 125 });

    const planned = planSpellCommand({
      approval,
      contentHash: 'h'.repeat(64),
      tokens,
      roomId,
      mapId,
      adjudicated: true,
      targetOutcomes: [
        { ref: targetRefs[0], finalAmount: 17, adjustmentReason: '' },
        { ref: targetRefs[1], finalAmount: 8, adjustmentReason: 'Cover' }
      ]
    });
    expect(planned.entries[0].finalResources).toEqual({
      ap: { current: 4, temp: 0 },
      mana: { current: 10, temp: 0 }
    });
    expect(planned.entries[1].finalResources.hp).toEqual({ current: 13, temp: 0 });
    expect(planned.entries[2].finalResources.hp).toEqual({ current: 22, temp: 0 });
    const parsed = spellReceipt({
      success: true,
      receipt: {
        version: 1,
        roomId,
        commandId: 'cmd-line-1',
        authorization: { kind: 'owner-approval-gm', proposalId: approval.approvalId },
        source: sourceRef,
        targets: targetRefs,
        actors: planned.entries,
        adjudication: planned.extra.adjudication,
        checkpointRevision: null
      }
    });
    expect(parsed.targets).toHaveLength(2);
    expect(parsed.recorded.areaTerms.aoeShape).toBe('line');
  });

  test('3. Multi-cell tokenFootprintForArea parity and state.isHidden exclusion', () => {
    const projectedLarge = {
      id: 'ogre',
      mapId,
      creatureId: 'bestiary-ogre',
      size: 'large',
      position: { x: 325, y: 225 },
      state: { actorContract: { version: 1, kind: 'creature', roomId, mapId, tokenId: 'ogre', instanceId: 'i-ogre', revision: 0 } }
    };
    expect(hasKnownTokenFootprint(projectedLarge, [])).toBe(true);
    expect(tokenFootprintForArea(projectedLarge, [])).toEqual({ width: 2, height: 2 });
    expect(hasKnownTokenFootprint({ id: 'plain', creatureId: 'unknown' }, [])).toBe(false);
    expect(tokenFootprintForArea({ id: 'plain', creatureId: 'c1' }, { c1: { size: 'huge' } })).toEqual({ width: 3, height: 3 });

    const stateHidden = {
      token: {
        id: 'shade',
        mapId,
        position: { x: 175, y: 125 },
        state: { isHidden: true, actorContract: { version: 1, kind: 'creature', roomId, mapId, tokenId: 'shade', instanceId: 'i-shade', revision: 0 } }
      },
      name: () => 'Shade',
      footprint: () => ({ width: 1, height: 1 })
    };
    const visibleLarge = {
      token: projectedLarge,
      name: () => 'Cave Ogre',
      footprint: () => tokenFootprintForArea(projectedLarge, [])
    };
    const classified = classifyAreaTokens([visibleLarge, stateHidden], {
      visible: () => true,
      aoeShape: 'line',
      origin: { x: 125, y: 175 },
      target: { x: 225, y: 175 },
      length: 150,
      width: 50,
      gridSize: 50,
      mapId,
      sourceRef: { kind: 'character', roomId, mapId, tokenId: 'pc', instanceId: 'i-pc', ownerUid: 'u1', characterId: 'c1' }
    });
    expect(classified.map(c => `${c.ref.tokenId}:${c.status}`)).toEqual(['ogre:candidate']);
  });
});
