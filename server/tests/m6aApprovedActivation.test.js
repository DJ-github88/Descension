const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const pure = require('../shared/services/authoredAbility');
const clientPure = require('../../vtt-react/src/services/authoredAbility');
const registry = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const { sync } = require('../scripts/sync-shared');

const CREATOR_REF = 'creator-approval-20261110-m6a-shared-roll';
const CREATOR_SCOPE = 'first-ranged-circle-creature-targets';

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function makeWizardAreaRecord(overrides = {}) {
  const d = {
    name: 'Cinder Nova',
    description: 'Bounded circle AoE primitive.',
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
  };
  return {
    ...d,
    targetingConfig: JSON.parse(JSON.stringify(d.targetingConfig)),
    authoredDefinitionId: '33333333-4444-4333-8444-555555555555',
    authoredDraft: JSON.parse(JSON.stringify(d))
  };
}

describe('M6A isolated activation delta verification', function() {
  this.timeout(10000);

  afterEach(() => {
    pure.setAreaRollApprovalForTest(undefined);
    pure.setAreaRollProposalForTest(false);
    clientPure.setAreaRollApprovalForTest(undefined);
    clientPure.setAreaRollProposalForTest(false);
  });

  describe('1. Creator approval active & absent approval still refuses before payment', () => {
    it('verifies live policy schema records creatorApproval in both client and server mirrors', () => {
      assert.equal(pure.AREA_ROLL_POLICY.creatorApproval.reference, CREATOR_REF);
      assert.equal(pure.AREA_ROLL_POLICY.creatorApproval.scope, CREATOR_SCOPE);
      assert.equal(clientPure.AREA_ROLL_POLICY.creatorApproval.reference, CREATOR_REF);
      assert.equal(clientPure.AREA_ROLL_POLICY.creatorApproval.scope, CREATOR_SCOPE);
      assert.equal(pure.AREA_ROLL_POLICY.procedure, 'shared-area-roll-proposed');
      assert.equal(clientPure.AREA_ROLL_POLICY.procedure, 'shared-area-roll-proposed');
      assert.equal(pure.isAreaRollProcedureApproved(), true);
      assert.equal(clientPure.isAreaRollProcedureApproved(), true);
    });

    it('when approval is absent, definitionFromWizard strictly refuses before admission', () => {
      pure.setAreaRollApprovalForTest(null);
      assert.equal(pure.isAreaRollProcedureApproved(), false);
      const record = makeWizardAreaRecord();
      const mapped = pure.definitionFromWizard(record, {
        roomId: 'room-test',
        classId: 'arcanoneer',
        definitionVersion: 1
      });
      assert.equal(mapped.ok, false);
      assert.match(mapped.reason, /awaits creator confirmation/);
      assert.equal(mapped.reason, pure.AREA_ROLL_UNAPPROVED_REASON);
      pure.setAreaRollApprovalForTest(undefined);
    });

    it('when approval is absent, installedDefinitionRegistry compiler strictly refuses area definitions', () => {
      pure.setAreaRollApprovalForTest(null);
      const canonicalDef = {
        name: 'Cinder Nova',
        description: 'Bounded circle AoE primitive.',
        spellType: 'ACTION',
        castTimeType: 'IMMEDIATE',
        binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' },
        targeting: { kind: 'area', aoeShape: 'circle', radiusFeet: 15, rangeFeet: 30, maxTargets: 8, restriction: 'enemy' },
        resourceCost: { actionPoints: 1, mana: 4 },
        effect: { kind: 'damage', formula: '2d6 + intelligence / 2', damageTypes: ['arcane'] }
      };
      const compiled = registry.compileDefinition({
        capability: pure.AREA_CAPABILITY,
        schemaVersion: 5,
        scope: { roomId: 'room-test' },
        definitionId: '33333333-4444-4333-8444-555555555555',
        definitionVersion: 1,
        ...canonicalDef
      });
      assert.equal(compiled.ok, false);
      assert.equal(compiled.code, 'AREA_ROLL_PROCEDURE_UNAPPROVED');
      pure.setAreaRollApprovalForTest(undefined);
    });

    it('when approval is absent, approval validation refuses before payment or mutation', () => {
      pure.setAreaRollApprovalForTest(null);
      const dummyApproval = {
        version: 1,
        roomId: 'room-test',
        approvalId: '11111111-1111-4111-8111-111111111111',
        actionEpoch: 'epoch-1',
        baseCommitSequence: 1,
        source: { kind: 'character', roomId: 'room-test', mapId: 'default', tokenId: 'pc' },
        targets: [{ kind: 'creature', roomId: 'room-test', mapId: 'default', tokenId: 'foe1' }],
        areaTerms: { kind: 'area', aoeShape: 'circle', radiusFeet: 15, rangeFeet: 30, maxTargets: 8, restriction: 'enemy' },
        areaRollProcedure: pure.AREA_ROLL_PROCEDURE,
        spell: { definitionId: 'spell-1', definitionHash: `${pure.AREA_CAPABILITY}/abc`, name: 'AoE', kind: 'damage' },
        roll: { dice: [{ sides: 6, faces: [4, 5] }], constant: 0, reading: '2d6', total: 9 },
        price: { ap: 1, mana: 4 }
      };
      assert.throws(
        () => payments.validateApproval(dummyApproval),
        /awaits creator confirmation/
      );
      pure.setAreaRollApprovalForTest(undefined);
    });
  });

  describe('2. Proposed approved policy admits only its existing bounded profile', () => {
    it('admits valid bounded profile: circle 5..60 ft (5-ft increments), range 1..300 ft, max 8 creatures', () => {
      const validCases = [
        { radiusFeet: 5, rangeFeet: 1, maxTargets: 8, kind: 'damage', formula: '2d6' },
        { radiusFeet: 15, rangeFeet: 30, maxTargets: 8, kind: 'damage', formula: '2d6 + intelligence / 2' },
        { radiusFeet: 30, rangeFeet: 120, maxTargets: 4, kind: 'healing', formula: '1d8 + spirit' },
        { radiusFeet: 60, rangeFeet: 300, maxTargets: 8, kind: 'damage', formula: '3d6' }
      ];

      for (const tc of validCases) {
        const record = makeWizardAreaRecord({
          targetingConfig: {
            targetingType: 'area',
            aoeShape: 'circle',
            aoeParameters: { radius: tc.radiusFeet },
            rangeType: 'ranged',
            rangeDistance: tc.rangeFeet,
            targetRestrictions: ['enemy'],
            maxTargets: tc.maxTargets
          },
          damageConfig: tc.kind === 'damage'
            ? { damageType: 'direct', elementType: 'arcane', formula: tc.formula, resolution: 'DICE' }
            : undefined,
          healingConfig: tc.kind === 'healing'
            ? { healingType: 'direct', formula: tc.formula, resolution: 'DICE' }
            : undefined,
          effectTypes: [tc.kind]
        });
        const mapped = pure.definitionFromWizard(record, {
          roomId: 'room-test',
          classId: 'arcanoneer',
          definitionVersion: 1
        });
        assert.equal(mapped.ok, true, `Failed for radius ${tc.radiusFeet}, range ${tc.rangeFeet}: ${mapped.reason}`);
        assert.equal(mapped.definition.capability, pure.AREA_CAPABILITY);
        assert.equal(mapped.definition.targeting.radiusFeet, tc.radiusFeet);
        assert.equal(mapped.definition.targeting.rangeFeet, tc.rangeFeet);
        assert.equal(mapped.definition.targeting.maxTargets, tc.maxTargets);
      }
    });

    it('strictly refuses target capacity exceeding 8 creatures', () => {
      const record = makeWizardAreaRecord({
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
      const mapped = pure.definitionFromWizard(record, {
        roomId: 'room-test',
        classId: 'arcanoneer',
        definitionVersion: 1
      });
      assert.equal(mapped.ok, false);
      assert.match(mapped.reason, /area_target_capacity_exceeded/);
    });

    it('strictly refuses invalid radii (non-multiples of 5, < 5 ft, or > 60 ft)', () => {
      for (const badRadius of [0, 4, 12, 17, 65, 100]) {
        const record = makeWizardAreaRecord({
          targetingConfig: {
            targetingType: 'area',
            aoeShape: 'circle',
            aoeParameters: { radius: badRadius },
            rangeType: 'ranged',
            rangeDistance: 30,
            targetRestrictions: ['enemy'],
            maxTargets: 8
          }
        });
        const mapped = pure.definitionFromWizard(record, {
          roomId: 'room-test',
          classId: 'arcanoneer',
          definitionVersion: 1
        });
        assert.equal(mapped.ok, false, `Expected failure for radius ${badRadius}`);
        assert.match(mapped.reason, /aoeParameters\.radius/);
      }
    });

    it('strictly refuses non-circle AoE shapes (cone, line, cube, sphere)', () => {
      for (const badShape of ['cone', 'line', 'cube', 'sphere']) {
        const record = makeWizardAreaRecord({
          targetingConfig: {
            targetingType: 'area',
            aoeShape: badShape,
            aoeParameters: { radius: 15 },
            rangeType: 'ranged',
            rangeDistance: 30,
            targetRestrictions: ['enemy'],
            maxTargets: 8
          }
        });
        const mapped = pure.definitionFromWizard(record, {
          roomId: 'room-test',
          classId: 'arcanoneer',
          definitionVersion: 1
        });
        assert.equal(mapped.ok, false, `Expected failure for shape ${badShape}`);
        assert.match(mapped.reason, /area shape/);
      }
    });

    it('strictly refuses non-ranged range types or out-of-bound range distances', () => {
      for (const badRangeType of ['melee', 'self', 'touch']) {
        const record = makeWizardAreaRecord({
          targetingConfig: {
            targetingType: 'area',
            aoeShape: 'circle',
            aoeParameters: { radius: 15 },
            rangeType: badRangeType,
            rangeDistance: 30,
            targetRestrictions: ['enemy'],
            maxTargets: 8
          }
        });
        const mapped = pure.definitionFromWizard(record, {
          roomId: 'room-test',
          classId: 'arcanoneer',
          definitionVersion: 1
        });
        assert.equal(mapped.ok, false, `Expected failure for rangeType ${badRangeType}`);
        assert.match(mapped.reason, /area range/);
      }

      for (const badDist of [0, -5, 301, 500]) {
        const record = makeWizardAreaRecord({
          targetingConfig: {
            targetingType: 'area',
            aoeShape: 'circle',
            aoeParameters: { radius: 15 },
            rangeType: 'ranged',
            rangeDistance: badDist,
            targetRestrictions: ['enemy'],
            maxTargets: 8
          }
        });
        const mapped = pure.definitionFromWizard(record, {
          roomId: 'room-test',
          classId: 'arcanoneer',
          definitionVersion: 1
        });
        assert.equal(mapped.ok, false, `Expected failure for distance ${badDist}`);
        assert.match(mapped.reason, /area range/);
      }
    });

    it('strictly refuses non-dice resolutions (deterministic or flat amounts)', () => {
      const record = makeWizardAreaRecord({
        damageConfig: {
          damageType: 'direct',
          elementType: 'arcane',
          formula: '10 + intelligence',
          resolution: 'FLAT'
        }
      });
      const mapped = pure.definitionFromWizard(record, {
        roomId: 'room-test',
        classId: 'arcanoneer',
        definitionVersion: 1
      });
      assert.equal(mapped.ok, false);
      assert.match(mapped.reason, /resolution/);
    });

    it('strictly refuses arbitrary unhomed class payments on authored area definitions', () => {
      const record = makeWizardAreaRecord({
        resourceCost: {
          actionPoints: 1,
          resourceTypes: ['mana'],
          resourceValues: { mana: 4 },
          spheres: ['arcane']
        }
      });
      const mapped = pure.definitionFromWizard(record, {
        roomId: 'room-test',
        classId: 'arcanoneer',
        definitionVersion: 1
      });
      assert.equal(mapped.ok, false);
      assert.match(mapped.reason, /resource types|unsupported or conflicting/);
    });
  });

  describe('3. Unrelated definitions/descriptors remain unchanged', () => {
    it('compiles authored-immediate:v1 (simple single-target) without interference', () => {
      const d = {
        name: 'Arcane Dart',
        description: 'Single target bolt.',
        spellType: 'ACTION',
        typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
        effectTypes: ['damage'],
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 60,
          targetRestrictions: ['enemy'],
          maxTargets: 1
        },
        resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 2 } },
        damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '1d6', resolution: 'DICE' }
      };
      const record = {
        ...d,
        authoredDefinitionId: '11111111-1111-4111-8111-111111111111',
        authoredDraft: JSON.parse(JSON.stringify(d))
      };
      const mapped = pure.definitionFromWizard(record, {
        roomId: 'room-test',
        classId: 'arcanoneer',
        definitionVersion: 1
      });
      assert.equal(mapped.ok, true, mapped.reason);
      assert.equal(mapped.definition.schemaVersion, 1);
    });

    it('compiles authored-immediate:v2 (formula scaling) without interference', () => {
      const d = {
        name: 'Scaled Blast',
        description: 'Formula scaled blast.',
        spellType: 'ACTION',
        typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
        effectTypes: ['damage'],
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 60,
          targetRestrictions: ['enemy'],
          maxTargets: 1
        },
        resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 2 } },
        damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '2d6 + intelligence', resolution: 'DICE' }
      };
      const record = {
        ...d,
        authoredDefinitionId: '22222222-2222-4222-8222-222222222222',
        authoredDraft: JSON.parse(JSON.stringify(d))
      };
      const mapped = pure.definitionFromWizard(record, {
        roomId: 'room-test',
        classId: 'arcanoneer',
        definitionVersion: 1
      });
      assert.equal(mapped.ok, true, mapped.reason);
      assert.equal(mapped.definition.capability, pure.FORMULA_CAPABILITY);
      assert.equal(mapped.definition.schemaVersion, 4);
    });
  });

  describe('4. Client/server mirrors remain synchronized', () => {
    it('verifies server/shared and vtt-react/src files are byte-identical', () => {
      const drifted = sync({ check: true });
      assert.deepEqual(drifted, [], `Drift detected: ${drifted.join(', ')}`);

      const clientAuthored = fs.readFileSync(path.resolve(__dirname, '../../vtt-react/src/services/authoredAbility.js'));
      const serverAuthored = fs.readFileSync(path.resolve(__dirname, '../shared/services/authoredAbility.js'));
      assert.equal(sha256(clientAuthored), sha256(serverAuthored));
    });
  });

  describe('5. Incarnation-aware selection repair is preserved', () => {
    it('verifies SpellConsequencePanel.jsx and its selection test match accepted identities', () => {
      const panelPath = path.resolve(__dirname, '../../vtt-react/src/components/hud/SpellConsequencePanel.jsx');
      const testPath = path.resolve(__dirname, '../../vtt-react/src/components/hud/__tests__/SpellConsequenceAreaSelection.test.jsx');

      const panelContent = fs.readFileSync(panelPath, 'utf8');
      const testContent = fs.readFileSync(testPath, 'utf8');

      const EXPECTED_PANEL_SHA = 'd1d95f66876b854f596a1331d2e3f89090e884feb0df65e521183139135e16a2';
      const EXPECTED_TEST_SHA = 'ae8869e7fa3c31f4fca62714edc88240146621be238949521749d82c75d6537e';

      assert.equal(sha256(panelContent), EXPECTED_PANEL_SHA, 'SpellConsequencePanel.jsx identity drifted');
      assert.equal(sha256(testContent), EXPECTED_TEST_SHA, 'SpellConsequenceAreaSelection.test.jsx identity drifted');

      // Verify key incarnation-aware repair elements in the panel source:
      assert.ok(panelContent.includes('pickKey(item.ref)'), 'Missing pickKey selection mapping');
      assert.ok(panelContent.includes('const unavailableAreaTargets = area && selectedAreaRefs.length !== targetKeys.length;'), 'Missing unavailable target detection');
      assert.ok(panelContent.includes('Remove unavailable selections'), 'Missing explicit removal control');
    });
  });
});
