import {
  AREA_CAPABILITY,
  AREA_ROLL_PROCEDURE,
  AREA_ROLL_POLICY,
  isAreaRollProcedureApproved,
  setAreaRollProposalForTest,
  setAreaRollApprovalForTest,
  definitionFromWizard,
  definitionSummary,
  isArea
} from '../authoredAbility';
import {
  RADIANT_BURST_ID,
  radiantPreviewProfile,
  circleCellOverlap,
  classifyAreaTokens
} from '../areaPreview';
import { buildApproval, planSpellCommand, spellReceipt, recordRoll } from '../spellConsequence';
import { buildFeed, actorKey, projectionOf } from '../acceptedResultFeed';
import { MARTYR_DATA } from '../../data/classes/martyrData';

describe('M6A client authoring, geometry, multi-target command planning & observer privacy', () => {
  const roomId = 'room-m6a';
  const mapId = 'default';

  beforeEach(() => {
    setAreaRollProposalForTest(true);
  });

  afterEach(() => {
    setAreaRollApprovalForTest(undefined);
    setAreaRollProposalForTest(false);
  });

  const makeWizardDraft = (overrides = {}) => ({
    name: 'Arcane Pulse',
    description: 'Bounded circle AoE test ability.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
    effectTypes: ['damage'],
    targetingConfig: {
      targetingType: 'area',
      aoeShape: 'circle',
      aoeParameters: { radius: 15 },
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 8
    },
    resourceCost: {
      actionPoints: 1,
      resourceTypes: ['mana'],
      resourceValues: { mana: 4 }
    },
    damageConfig: {
      damageType: 'direct',
      elementType: 'arcane',
      formula: '2d6 + intelligence / 2',
      resolution: 'DICE'
    },
    ...overrides
  });

  test('1. proposed-roll gate refuses by default; when enabled for test, Wizard save/reopen compiles authored-area:v1 while refusing arbitrary Wizard class payments', () => {
    const draft = makeWizardDraft();
    const saved = { ...draft, authoredDefinitionId: '11111111-2222-4333-8444-555555555555', authoredDraft: JSON.parse(JSON.stringify(draft)) };

    // Approved gate: creatorApproval is active, admitting the bounded profile
    expect(AREA_ROLL_POLICY.creatorApproval.reference).toBe('creator-approval-20261110-m6a-shared-roll');
    expect(AREA_ROLL_POLICY.creatorApproval.scope).toBe('first-ranged-circle-creature-targets');
    expect(isAreaRollProcedureApproved()).toBe(true);

    // Absent approval still strictly refuses before payment:
    setAreaRollProposalForTest(false);
    setAreaRollApprovalForTest(null);
    expect(isAreaRollProcedureApproved()).toBe(false);
    const defaultRefused = definitionFromWizard(saved, { roomId, classId: 'arcanoneer', definitionVersion: 1 });
    expect(defaultRefused.ok).toBe(false);
    expect(defaultRefused.reason).toMatch(/awaits creator confirmation/);
    setAreaRollApprovalForTest(undefined);

    // Disclosed test-only enablement:
    setAreaRollProposalForTest(true);
    const res = definitionFromWizard(saved, { roomId, classId: 'arcanoneer', definitionVersion: 1 });
    expect(res.ok).toBe(true);
    expect(res.definition.capability).toBe(AREA_CAPABILITY);
    expect(res.definition.schemaVersion).toBe(5);
    expect(res.definition.targeting).toEqual({
      kind: 'area',
      aoeShape: 'circle',
      radiusFeet: 15,
      rangeFeet: 30,
      maxTargets: 8,
      restriction: 'enemy'
    });
    expect(res.definition.classPayment).toBeUndefined();
    expect(definitionSummary(res.definition)).toMatch(/circle 15 ft \(up to 8 creatures\)/);

    // Arbitrary Wizard-authored area definition cannot grant itself a class payment
    const selfClassDraft = makeWizardDraft({
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ['mana'],
        resourceValues: { mana: 4 },
        spheres: ['arcane']
      }
    });
    const selfClassSaved = { ...selfClassDraft, authoredDefinitionId: '11111111-2222-4333-8444-555555555555', authoredDraft: JSON.parse(JSON.stringify(selfClassDraft)) };
    const selfClassRefused = definitionFromWizard(selfClassSaved, { roomId, classId: 'arcanoneer', definitionVersion: 1 });
    expect(selfClassRefused.ok).toBe(false);

    // Exceeding technical limit (>8 targets) refuses clearly before payment
    const overCapDraft = makeWizardDraft({
      targetingConfig: {
        targetingType: 'area',
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy'],
        maxTargets: 9
      }
    });
    const overCap = { ...overCapDraft, authoredDefinitionId: '11111111-2222-4333-8444-555555555555', authoredDraft: JSON.parse(JSON.stringify(overCapDraft)) };
    const refused = definitionFromWizard(overCap, { roomId, classId: 'arcanoneer', definitionVersion: 1 });
    expect(refused.ok).toBe(false);
    expect(refused.reason).toMatch(/area_target_capacity_exceeded/);
  });

  test('2. B2 Radiant Burst profile remains unchanged while authored-area:v1 preview and newly tested radii/grid cases classify accurately with strict pre-geometry visibility', () => {
    const radiant = MARTYR_DATA.spells.find(s => s.id === RADIANT_BURST_ID);
    const b2Profile = radiantPreviewProfile(radiant, 'damage');
    expect(b2Profile.error).toBeUndefined();
    expect(b2Profile.radiusFeet).toBe(10);
    expect(b2Profile.rangeFeet).toBe(20);
    expect(b2Profile.isAreaCast).toBeUndefined();

    const areaAction = {
      id: '11111111-2222-4333-8444-555555555555:1',
      name: 'Arcane Pulse',
      capability: AREA_CAPABILITY,
      kind: 'damage',
      definitionHash: `${AREA_CAPABILITY}/${'a'.repeat(64)}`,
      areaTerms: { kind: 'area', aoeShape: 'circle', radiusFeet: 15, rangeFeet: 30, maxTargets: 8, restriction: 'enemy' }
    };
    const m6aProfile = radiantPreviewProfile(areaAction, 'damage');
    expect(m6aProfile.error).toBeUndefined();
    expect(m6aProfile.isAreaCast).toBe(true);
    expect(m6aProfile.radiusFeet).toBe(15);
    expect(m6aProfile.rangeFeet).toBe(30);

    // 15-ft radius on 50px / 5ft square grid => 150px radius around origin (125, 125) (center of cell 2,2)
    // Cell (4,2) spans x=[200,250], y=[100,150] -> closest point (200,125) is 75px < 150px => candidate
    expect(circleCellOverlap({ x: 125, y: 125 }, 150, { x: 4, y: 2 }, 50)).toBe('candidate');
    // Origin at (100, 125) with radius 150px: cell (5,2) closest x=250 => distance = 150px => edge (tangency is not overlap)
    expect(circleCellOverlap({ x: 100, y: 125 }, 150, { x: 5, y: 2 }, 50)).toBe('edge');

    const sourceRef = { kind: 'character', roomId, mapId, tokenId: 'pc', instanceId: 'i-pc', ownerUid: 'u1', characterId: 'c1' };
    let hiddenNameRead = false;
    const entries = [
      {
        token: { id: 'foe1', position: { x: 125, y: 125 }, state: { actorContract: { version: 1, kind: 'creature', roomId, mapId, tokenId: 'foe1', instanceId: 'i-1', revision: 1 } } },
        name: () => 'Visible Construct',
        footprint: () => ({ width: 1, height: 1 })
      },
      {
        token: { id: 'hiddenFoe', position: { x: 125, y: 125 }, state: { hiddenFromPlayers: true, actorContract: { version: 1, kind: 'creature', roomId, mapId, tokenId: 'hiddenFoe', instanceId: 'i-h', revision: 1 } } },
        name: () => { hiddenNameRead = true; return 'Secret Assassin'; },
        footprint: () => ({ width: 1, height: 1 })
      },
      {
        token: { id: 'allyPc', position: { x: 125, y: 125 }, state: { actorContract: { version: 1, kind: 'character', roomId, mapId, tokenId: 'allyPc', instanceId: 'i-ally', ownerUid: 'u2', characterId: 'c2', revision: 1, primary: true } } },
        name: () => 'Ally PC',
        footprint: () => ({ width: 1, height: 1 })
      }
    ];

    // Even if caller supplies visible: () => true (e.g. GM mode active), hiddenFromPlayers tokens never leak to owner candidate classification
    const classified = classifyAreaTokens(entries, {
      visible: () => true,
      origin: { x: 125, y: 125 },
      radius: 150,
      gridSize: 50,
      mapId,
      sourceRef
    });
    expect(hiddenNameRead).toBe(false);
    expect(classified.map(c => c.name)).toEqual(['Visible Construct', 'Ally PC']);
    expect(classified[0].status).toBe('candidate');
    expect(classified[0].eligibleCreature).toBe(true);
    expect(classified[1].eligibleCreature).toBe(false);
    expect(classified[1].excludedReason).toMatch(/PC target excluded/);
  });

  test('3. buildApproval, planSpellCommand, spellReceipt and buildFeed enforce proposed-roll gate, single payment, per-target outcomes, observer privacy and historical recovery', () => {
    const sourceRef = { kind: 'character', roomId, mapId, tokenId: 'pc', instanceId: 'i-pc', ownerUid: 'u1', characterId: 'c1' };
    const foe1Ref = { kind: 'creature', roomId, mapId, tokenId: 'foe1', instanceId: 'i-1' };
    const foe2Ref = { kind: 'creature', roomId, mapId, tokenId: 'foe2', instanceId: 'i-2' };
    const hiddenRef = { kind: 'creature', roomId, mapId, tokenId: 'foeHidden', instanceId: 'i-h' };

    const tokens = [
      {
        id: 'pc',
        mapId,
        ownerUserId: 'u1',
        character: {
          id: 'c1',
          name: 'Lyra',
          class: 'Arcanoneer',
          stats: { intelligence: 18 },
          health: { current: 24, max: 30 },
          mana: { current: 10, max: 12 },
          actionPoints: { current: 4, max: 4 },
          tempMana: 1,
          tempActionPoints: 1
        },
        state: { actorContract: { version: 1, ...sourceRef, revision: 2, primary: true }, conditions: [] }
      },
      {
        id: 'foe1',
        mapId,
        name: 'Construct Alpha',
        stats: { maxHp: 40 },
        state: { currentHp: 30, tempHealth: 4, actorContract: { version: 1, ...foe1Ref, revision: 3 }, conditions: [] }
      },
      {
        id: 'foe2',
        mapId,
        name: 'Construct Beta',
        stats: { maxHp: 40 },
        state: { currentHp: 25, tempHealth: 0, actorContract: { version: 1, ...foe2Ref, revision: 5 }, conditions: [] }
      },
      {
        id: 'foeHidden',
        mapId,
        name: 'Shadow Stalker',
        stats: { maxHp: 40 },
        state: { hiddenFromPlayers: true, currentHp: 25, tempHealth: 0, actorContract: { version: 1, ...hiddenRef, revision: 1 }, conditions: [] }
      }
    ];

    const support = {
      supported: true,
      isArea: true,
      definitionId: 'def-1:1',
      definitionHash: `${AREA_CAPABILITY}/${'b'.repeat(64)}`,
      name: 'Arcane Pulse',
      kind: 'damage',
      damageTypes: ['arcane'],
      areaTerms: { kind: 'area', aoeShape: 'circle', radiusFeet: 15, rangeFeet: 30, maxTargets: 8, restriction: 'enemy' },
      price: { ap: 1, mana: 4 },
      payment: { affordable: true, classPayment: null },
      reading: { supported: true, dice: [{ count: 2, sides: 6 }], constant: 9, reading: '2d6 + intelligence / 2 → 2d6 + 9 (INT 18 ÷ 2, rounded down)' },
      rollAttributes: { intelligence: 18 }
    };
    const roll = recordRoll('physical', support.reading, [[4, 5]]);
    expect(roll.total).toBe(18);

    // When proposed-roll gate is off, buildApproval refuses before creating any approval
    setAreaRollProposalForTest(false);
    setAreaRollApprovalForTest(null);
    try {
      expect(() => buildApproval({
        support,
        tokens,
        sourceRef,
        targetRefs: [foe1Ref, foe2Ref],
        roomId,
        mapId,
        actionEpoch: 'ep-1',
        baseCommitSequence: 1,
        roll,
        approvalId: '11111111-2222-4333-8444-555555555555'
      })).toThrow(/awaits creator confirmation/);
    } finally {
      setAreaRollApprovalForTest(undefined);
      setAreaRollProposalForTest(true);
    }

    // Hidden target in targetRefs refuses with generic actor-not-found message
    expect(() => buildApproval({
      support,
      tokens,
      sourceRef,
      targetRefs: [foe1Ref, hiddenRef],
      roomId,
      mapId,
      actionEpoch: 'ep-1',
      baseCommitSequence: 1,
      roll,
      approvalId: '11111111-2222-4333-8444-555555555555'
    })).toThrow(/Choose an exact bound room actor on the current map/);

    const approval = buildApproval({
      support,
      tokens,
      sourceRef,
      targetRefs: [foe1Ref, foe2Ref],
      areaOrigin: { x: 125, y: 125 },
      roomId,
      mapId,
      actionEpoch: 'ep-1',
      baseCommitSequence: 1,
      roll,
      approvalId: '11111111-2222-4333-8444-555555555555'
    });
    expect(isArea(approval)).toBe(true);
    expect(approval.areaRollProcedure).toBe(AREA_ROLL_PROCEDURE);
    expect(approval.targets).toHaveLength(2);

    const planned = planSpellCommand({
      approval,
      contentHash: 'c'.repeat(64),
      tokens,
      roomId,
      mapId,
      adjudicated: true,
      targetOutcomes: [
        { ref: foe1Ref, finalAmount: 18, adjustmentReason: '' },
        { ref: foe2Ref, finalAmount: 9, adjustmentReason: 'half damage save' }
      ]
    });

    // 1 source entry + 2 target entries = 3 entries; source pays ONCE
    expect(planned.entries).toHaveLength(3);
    expect(planned.entries[0].finalResources).toEqual({
      ap: { current: 4, temp: 0 },
      mana: { current: 7, temp: 0 }
    });
    expect(planned.entries[1].finalResources).toEqual({
      hp: { current: 16, temp: 0 } // 30 - (18 - 4 temp)
    });
    expect(planned.entries[2].finalResources).toEqual({
      hp: { current: 16, temp: 0 } // 25 - 9
    });

    const fakeResult = {
      success: true,
      status: 'checkpoint-confirmed',
      receipt: {
        version: 1,
        roomId,
        commandId: '22222222-3333-4444-8555-666666666666',
        submitterUid: 'gm-1',
        commitSequence: 2,
        checkpointRevision: 2,
        acceptedAt: Date.now(),
        source: sourceRef,
        targets: [foe1Ref, foe2Ref],
        authorization: { kind: 'owner-approval-gm', proposalId: approval.approvalId },
        adjudication: planned.extra.adjudication,
        actors: [
          {
            ref: sourceRef,
            beforeRevision: 2,
            afterRevision: 3,
            finalResources: { hp: { current: 24, temp: 0 }, ap: { current: 4, temp: 0 }, mana: { current: 7, temp: 0 } }
          },
          {
            ref: foe1Ref,
            beforeRevision: 3,
            afterRevision: 4,
            finalResources: { hp: { current: 16, temp: 0 } }
          },
          {
            ref: foe2Ref,
            beforeRevision: 5,
            afterRevision: 6,
            finalResources: { hp: { current: 16, temp: 0 } }
          }
        ]
      }
    };

    const parsed = spellReceipt(fakeResult);
    expect(parsed).not.toBeNull();
    expect(parsed.targets).toHaveLength(2);

    const before = {
      [actorKey(sourceRef)]: projectionOf(tokens[0], 'character'),
      [actorKey(foe1Ref)]: projectionOf(tokens[1], 'creature'),
      [actorKey(foe2Ref)]: projectionOf(tokens[2], 'creature')
    };

    // Entitled viewer seeing all actors gets full narration and floats on live=true
    const fullFeed = buildFeed({
      result: fakeResult,
      before,
      viewer: { reportable: () => true, rendered: () => true },
      live: true
    });
    expect(fullFeed.floats).toHaveLength(2);
    expect(fullFeed.narration.text).toMatch(/Lyra casts Arcane Pulse on Construct Alpha, Construct Beta/);

    // Observer who cannot see foe2 (concealed/outside FOV) never gets foe2's name or float
    const partialFeed = buildFeed({
      result: fakeResult,
      before,
      viewer: {
        reportable: r => r.tokenId !== 'foe2',
        rendered: r => r.tokenId !== 'foe2'
      },
      live: true
    });
    expect(partialFeed.floats).toHaveLength(1);
    expect(partialFeed.narration.text).not.toMatch(/Construct Beta/);

    // Historical recovery (live=false) never replays floating HP
    const recoveryFeed = buildFeed({
      result: fakeResult,
      before,
      viewer: { reportable: () => true, rendered: () => true },
      live: false
    });
    expect(recoveryFeed.floats).toEqual([]);
  });
});
