'use strict';

/**
 * Focused Verification & Regression Tests for the Mythrill Batch Ability Compatibility Checker
 * and First-Campaign Ability Readiness Batch.
 *
 * Run with:
 *   node --test vtt-react/verification/ability-compatibility/abilityCompatibility.test.cjs
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const {
  CLASSIFICATIONS,
  EXCLUSION_CATEGORIES,
  PROFILE_ACCEPTANCE_STATUS,
  buildValidatorIdentity,
  checkRecord,
  checkCollection,
  checkClassByName,
} = require('./checkAbilityCompatibility.cjs');

const {
  makeWizardLibraryRecord,
  buildRepresentativeBatch,
} = require('./representativeBatch.cjs');

const {
  FIRST_CAMPAIGN_BATCH_SPEC,
  buildFirstCampaignReadinessManifest,
} = require('./firstCampaignBatch.cjs');

function deepFreeze(value) {
  if (!value || typeof value !== 'object') return value;
  Object.freeze(value);
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }
  return value;
}

function makeBaseWizardDamageDraft(overrides = {}) {
  return {
    id: 'test_wizard_damage',
    name: 'Test Ember Bolt',
    description: 'Single-target direct ember damage.',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    typeConfig: {
      school: 'ember',
      castTime: 0,
      castTimeType: 'IMMEDIATE',
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
    },
    resourceCost: {
      actionPoints: 1,
      mana: 5,
      resourceTypes: ['mana', 'actionPoints'],
      primaryResourceType: 'mana',
      resourceValues: { actionPoints: 1, mana: 5 },
    },
    damageConfig: {
      formula: '2d6+2',
      elementType: 'ember',
      damageTypes: ['ember'],
      damageType: 'direct',
      resolution: 'DICE',
      globalResolution: 'DICE',
      hasDotEffect: false,
    },
    durationConfig: {
      durationType: 'instant',
    },
    cooldownConfig: {
      cooldownType: 'none',
      cooldownValue: 0,
    },
    ...overrides,
  };
}

test('1. Accepted compatible records are recognized across p9-spell:v1, authored-immediate:v1, and authored-condition:v1, while provisional authored-effect:v1 is distinguished as unaccepted source', () => {
  const batch = buildRepresentativeBatch();
  const report = checkCollection(batch.entries, { batchName: batch.batchName });

  const byId = Object.fromEntries(report.records.map((r) => [r.recordId, r]));

  // Accepted P9 class spells
  for (const p9Id of [
    'arc_spark_bolt',
    'martyr_restorative_prayer',
    'minstrel_opening_chord',
    'minstrel_harmonic_strike',
  ]) {
    assert.equal(byId[p9Id].classification, CLASSIFICATIONS.COMPATIBLE, `${p9Id} should be compatible`);
    assert.equal(byId[p9Id].compatibleProfile, 'p9-spell:v1');
    assert.equal(byId[p9Id].capabilityStatus, 'accepted');
    assert.equal(byId[p9Id].productionReady, true);
    assert.equal(byId[p9Id].acceptedCompatible, true);
    assert.equal(byId[p9Id].sourceObservedCompatible, true);
    assert.equal(byId[p9Id].questions.structuralValidity.valid, true);
    assert.equal(byId[p9Id].questions.executableProfile.fits, true);
    assert.equal(byId[p9Id].questions.routeSupport.supported, true);
    assert.equal(byId[p9Id].questions.manualAdjudication.required, true);
    assert.equal(byId[p9Id].questions.runtimePrerequisites.automaticallyExecutable, false);
    assert.ok(byId[p9Id].questions.runtimePrerequisites.prerequisites.length >= 4);
  }

  // Accepted Wizard immediate damage & creature self-healing (P14-A1..A6)
  assert.equal(byId.wizard_immediate_ember_lance.classification, CLASSIFICATIONS.COMPATIBLE);
  assert.equal(byId.wizard_immediate_ember_lance.compatibleProfile, 'authored-immediate:v1');
  assert.equal(byId.wizard_immediate_ember_lance.capabilityStatus, 'accepted');
  assert.equal(byId.wizard_immediate_ember_lance.productionReady, true);

  assert.equal(byId.wizard_creature_self_mend.classification, CLASSIFICATIONS.COMPATIBLE);
  assert.equal(byId.wizard_creature_self_mend.compatibleProfile, 'authored-immediate:v1');
  assert.equal(byId.wizard_creature_self_mend.capabilityStatus, 'accepted');
  assert.equal(byId.wizard_creature_self_mend.productionReady, true);

  // Accepted Wizard canonical Stunned (authored-condition:v1, P14-A7..A9)
  assert.equal(byId.wizard_canonical_stun_bind.classification, CLASSIFICATIONS.COMPATIBLE);
  assert.equal(byId.wizard_canonical_stun_bind.compatibleProfile, 'authored-condition:v1');
  assert.equal(byId.wizard_canonical_stun_bind.capabilityStatus, 'accepted');
  assert.equal(byId.wizard_canonical_stun_bind.productionReady, true);

  // Provisional Wizard composable effects (authored-effect:v1, Opus A10 unfinished/unaccepted source)
  for (const a10Id of ['wizard_a10_stun_shock', 'wizard_a10_kinetic_shove']) {
    assert.equal(byId[a10Id].classification, CLASSIFICATIONS.UNSUPPORTED_CAPABILITY);
    assert.equal(byId[a10Id].compatibleProfile, null);
    assert.equal(byId[a10Id].acceptedCompatible, false);
    assert.equal(byId[a10Id].productionReady, false);
    assert.equal(byId[a10Id].sourceObservedProfile, 'authored-effect:v1');
    assert.equal(byId[a10Id].sourceObservedCompatible, true);
    assert.equal(byId[a10Id].capabilityStatus, 'provisional_unaccepted_source');
    assert.ok(
      byId[a10Id].incompatibilities.some((i) => i.code === 'PROVISIONAL_UNACCEPTED_PROFILE_A10')
    );
  }
});

test('2. Unsupported secondary effects prevent a misleading compatibility result (whole-record check)', () => {
  const { CLASS_DATA_MAP } = require(path.join(__dirname, '..', '..', 'src', 'data', 'classSpellGenerator.js'));
  const sparkBolt = CLASS_DATA_MAP.Arcanoneer.spells.find((s) => s.id === 'arc_spark_bolt');

  // Case A: Damage + unprofiled debuffConfig
  const withDebuff = {
    ...JSON.parse(JSON.stringify(sparkBolt)),
    effectTypes: ['damage', 'debuff'],
    debuffConfig: {
      debuffType: 'statusEffect',
      effects: [{ id: 'chill', name: 'Chilled', mechanicsText: '-10 ft speed' }],
      durationType: 'rounds',
      durationValue: 2,
    },
  };
  const resDebuff = checkRecord(withDebuff, {
    className: 'Arcanoneer',
    classResource: { type: 'elemental_spheres' },
  });
  assert.equal(resDebuff.classification, CLASSIFICATIONS.UNSUPPORTED_CAPABILITY);
  assert.equal(resDebuff.compatibleProfile, null);
  assert.equal(resDebuff.questions.executableProfile.fits, false);
  assert.ok(resDebuff.incompatibilities.some((i) => i.code === 'DEBUFF_CONFIG_PRESENT'));

  // Case B: Damage + saving throw inside damageConfig
  const withSave = JSON.parse(JSON.stringify(sparkBolt));
  withSave.damageConfig.savingThrow = {
    enabled: true,
    attribute: 'agility',
    difficulty: 14,
    onSuccess: 'half_damage',
  };
  const resSave = checkRecord(withSave, {
    className: 'Arcanoneer',
    classResource: { type: 'elemental_spheres' },
  });
  assert.equal(resSave.classification, CLASSIFICATIONS.UNSUPPORTED_CAPABILITY);
  assert.equal(resSave.compatibleProfile, null);
  assert.ok(resSave.incompatibilities.some((i) => i.code === 'DAMAGE_SAVING_THROW'));

  // Case C: Wizard immediate damage + secondary controlConfig (not using an accepted condition profile)
  const wizWithControl = makeWizardLibraryRecord(
    makeBaseWizardDamageDraft({
      effectTypes: ['damage', 'control'],
      controlConfig: {
        controlType: 'knockback',
        distance: 10,
      },
    }),
    '22222222-2222-4222-8222-222222222201'
  );
  const resWizControl = checkRecord(wizWithControl, { profileMode: 'wizard', classId: 'arcanoneer' });
  assert.equal(resWizControl.classification, CLASSIFICATIONS.UNSUPPORTED_CAPABILITY);
  assert.equal(resWizControl.compatibleProfile, null);
  assert.ok(resWizControl.incompatibilities.some((i) => i.code === 'CONTROL_CONFIG_UNPROFILED'));
});

test('3. Explicit zero values (0 AP, 0 mana, 0 range) survive unchanged without normalization', () => {
  const zeroDraft = {
    id: 'zero_values_ability',
    name: 'Zero Cost Touch',
    description: 'Tests explicit 0 AP, 0 Mana, and 0 Range preservation.',
    spellType: 'ACTION',
    effectTypes: ['healing'],
    typeConfig: {
      castTime: 0,
      castTimeType: 'IMMEDIATE',
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'self',
      rangeDistance: 0,
      targetRestrictions: ['self'],
      maxTargets: 1,
    },
    resourceCost: {
      actionPoints: 0,
      mana: 0,
      resourceTypes: ['mana', 'actionPoints'],
      primaryResourceType: 'mana',
      resourceValues: { actionPoints: 0, mana: 0 },
    },
    healingConfig: {
      formula: '1d4',
      healingType: 'direct',
      resolution: 'DICE',
      globalResolution: 'DICE',
      hasHotEffect: false,
      hasShieldEffect: false,
    },
    durationConfig: {
      durationType: 'instant',
    },
  };

  const record = makeWizardLibraryRecord(zeroDraft, '33333333-3333-4333-8333-333333333301');
  const result = checkRecord(record, {
    profileMode: 'wizard',
    classId: 'martyr',
    requestedRoute: { sourceKind: 'creature', targetKind: 'creature', sameActor: true },
  });

  assert.equal(result.classification, CLASSIFICATIONS.COMPATIBLE);
  assert.equal(result.preservedAuthoringValues.actionPoints, 0);
  assert.equal(result.preservedAuthoringValues.resourceValuesActionPoints, 0);
  assert.equal(result.preservedAuthoringValues.mana, 0);
  assert.equal(result.preservedAuthoringValues.resourceValuesMana, 0);
  assert.equal(result.preservedAuthoringValues.rangeDistance, 0);
  assert.equal(record.resourceCost.actionPoints, 0);
  assert.equal(record.resourceCost.mana, 0);
  assert.equal(record.targetingConfig.rangeDistance, 0);
});

test('4. Ambiguous/conflicting schemas remain unresolved and are reported as ambiguous_or_conflicting', () => {
  // Case A: Conflicting mana values between resourceCost.mana and resourceCost.resourceValues.mana
  const conflictingManaDraft = makeBaseWizardDamageDraft({
    resourceCost: {
      actionPoints: 1,
      mana: 5,
      resourceTypes: ['mana', 'actionPoints'],
      primaryResourceType: 'mana',
      resourceValues: { actionPoints: 1, mana: 10 },
    },
  });
  const resManaConflict = checkRecord(conflictingManaDraft, { className: 'Arcanoneer' });
  assert.equal(resManaConflict.classification, CLASSIFICATIONS.AMBIGUOUS_OR_CONFLICTING);
  assert.ok(resManaConflict.conflicts.some((c) => /Disagreeing Mana encodings/i.test(c)));

  // Case B: Outer record vs authoredDraft mismatch on Wizard record
  const baseWiz = makeWizardLibraryRecord(
    makeBaseWizardDamageDraft(),
    '44444444-4444-4444-8444-444444444401'
  );
  baseWiz.damageConfig = { ...baseWiz.damageConfig, formula: '9d12' };
  const resDraftMismatch = checkRecord(baseWiz, { profileMode: 'wizard', classId: 'arcanoneer' });
  assert.equal(resDraftMismatch.classification, CLASSIFICATIONS.AMBIGUOUS_OR_CONFLICTING);
  assert.ok(resDraftMismatch.conflicts.some((c) => /library\/draft damageConfig/i.test(c)));

  // Case C: Abbreviated attribute token ('int') in class spell formula
  const abbrevFormulaSpell = makeBaseWizardDamageDraft({
    damageConfig: {
      formula: '2d8 + int',
      elementType: 'ember',
      damageTypes: ['ember'],
      resolution: 'DICE',
    },
  });
  const resAbbrev = checkRecord(abbrevFormulaSpell, { className: 'Arcanoneer' });
  assert.equal(resAbbrev.classification, CLASSIFICATIONS.AMBIGUOUS_OR_CONFLICTING);
  assert.ok(resAbbrev.conflicts.some((c) => /full attribute name/i.test(c)));

  // Case D: Real Class HQ Arcanoneer spell with disagreeing sphere recipe encodings (arc_arcane_missile)
  const { CLASS_DATA_MAP } = require(path.join(__dirname, '..', '..', 'src', 'data', 'classSpellGenerator.js'));
  const arcaneMissile = CLASS_DATA_MAP.Arcanoneer.spells.find((s) => s.id === 'arc_arcane_missile');
  const resArcaneMissile = checkRecord(arcaneMissile, {
    className: 'Arcanoneer',
    classResource: { type: 'elemental_spheres' },
  });
  assert.equal(resArcaneMissile.classification, CLASSIFICATIONS.AMBIGUOUS_OR_CONFLICTING);
  assert.ok(resArcaneMissile.conflicts.some((c) => /Sphere recipe encodings disagree/i.test(c)));
});

test('5. Source/target route restrictions are distinguished from definition shape', () => {
  const batch = buildRepresentativeBatch();
  const stunBindEntry = batch.entries.find((e) => e.record.id === 'wizard_canonical_stun_bind');
  const selfMendEntry = batch.entries.find((e) => e.record.id === 'wizard_creature_self_mend');
  const a10StunEntry = batch.entries.find((e) => e.record.id === 'wizard_a10_stun_shock');

  // Accepted authored-condition:v1 record is compatible for distinct target:
  const resDistinctStun = checkRecord(stunBindEntry.record, {
    ...stunBindEntry.context,
    requestedRoute: { sourceKind: 'pc', targetKind: 'creature', sameActor: false },
  });
  assert.equal(resDistinctStun.classification, CLASSIFICATIONS.COMPATIBLE);
  assert.equal(resDistinctStun.questions.executableProfile.fits, true);
  assert.equal(resDistinctStun.questions.routeSupport.supported, true);

  // Same accepted authored-condition:v1 record checked against a self-target route (sameActor: true):
  const resSelfStun = checkRecord(stunBindEntry.record, {
    ...stunBindEntry.context,
    requestedRoute: { sourceKind: 'pc', targetKind: 'pc', sameActor: true },
  });
  assert.equal(resSelfStun.questions.routeSupport.supported, false);
  assert.equal(resSelfStun.classification, CLASSIFICATIONS.INVALID_FOR_PROFILE);
  assert.ok(
    resSelfStun.questions.routeSupport.routeRestrictions.some((r) =>
      /self-target route.*rejected by authored-condition:v1/i.test(r)
    )
  );

  // Zero-range self-healing Wizard record is compatible for creature self-target:
  const resCreatureSelf = checkRecord(selfMendEntry.record, {
    ...selfMendEntry.context,
    requestedRoute: { sourceKind: 'creature', targetKind: 'creature', sameActor: true },
  });
  assert.equal(resCreatureSelf.classification, CLASSIFICATIONS.COMPATIBLE);
  assert.equal(resCreatureSelf.questions.routeSupport.supported, true);

  // Same zero-range self-healing record checked against a distinct target route:
  const resDistinctTarget = checkRecord(selfMendEntry.record, {
    ...selfMendEntry.context,
    requestedRoute: { sourceKind: 'creature', targetKind: 'creature', sameActor: false },
  });
  assert.equal(resDistinctTarget.questions.routeSupport.supported, false);
  assert.equal(resDistinctTarget.classification, CLASSIFICATIONS.INVALID_FOR_PROFILE);

  // Provisional A10 record still distinguishes creature target route (supported) from PC target route (rejected):
  const resA10PcTarget = checkRecord(a10StunEntry.record, {
    ...a10StunEntry.context,
    requestedRoute: { sourceKind: 'pc', targetKind: 'pc', sameActor: false },
  });
  assert.equal(resA10PcTarget.questions.routeSupport.supported, false);
  assert.ok(
    resA10PcTarget.questions.routeSupport.routeRestrictions.some((r) =>
      /A10 authored effects may only target creatures/i.test(r)
    )
  );
});

test('6. Input records are never mutated (deep-frozen records pass without error)', () => {
  const batch = buildRepresentativeBatch();
  const clonedAndFrozen = batch.entries.map((entry) => {
    const copy = JSON.parse(JSON.stringify(entry.record));
    const beforeJson = JSON.stringify(copy);
    deepFreeze(copy);
    return { entry, copy, beforeJson };
  });

  for (const item of clonedAndFrozen) {
    const res = checkRecord(item.copy, item.entry.context);
    assert.ok(res.classification);
    assert.equal(JSON.stringify(item.copy), item.beforeJson);
  }
});

test('7. Repeated runs produce byte-identical output and capture validator/source identity hashes', () => {
  const batch1 = buildRepresentativeBatch();
  const batch2 = buildRepresentativeBatch();

  const report1 = checkCollection(batch1.entries, { batchName: batch1.batchName });
  const report2 = checkCollection(batch2.entries, { batchName: batch2.batchName });

  assert.equal(JSON.stringify(report1), JSON.stringify(report2));
  assert.match(report1.validatorIdentity.validatorBundleHash, /^[0-9a-f]{64}$/);
  assert.equal(report1.validatorIdentity.modules.length, 8);
  for (const mod of report1.validatorIdentity.modules) {
    assert.match(mod.sha256, /^[0-9a-f]{64}$/);
    assert.ok(mod.bytes > 0);
  }

  for (const rec of report1.records) {
    assert.ok(rec.recordId);
    assert.ok(rec.sourceLocation.file);
    assert.ok(rec.sourceLocation.line > 0, `Expected positive line number for ${rec.recordId}`);
    assert.match(rec.sourceLocation.recordSha256, /^p9-spell:v1\/[0-9a-f]{64}$/);
  }
});

test('8. Scales cleanly to full Class HQ modules without labeling valid unsupported content as broken', () => {
  const arcReport = checkClassByName('Arcanoneer');
  assert.ok(arcReport.summary.totalRecordsChecked >= 40);
  assert.equal(arcReport.summary.countsByClassification[CLASSIFICATIONS.COMPATIBLE], 1);
  assert.equal(arcReport.summary.countsByClassification[CLASSIFICATIONS.INVALID_FOR_PROFILE], 0);
  for (const rec of arcReport.records) {
    assert.equal(rec.questions.structuralValidity.valid, true);
  }
});

test('9. Regression: Structured instant-duration envelopes are classified as incompatible_authored_schema, NOT turn-and-duration-lifecycle', () => {
  const { CLASS_DATA_MAP } = require(path.join(__dirname, '..', '..', 'src', 'data', 'classSpellGenerator.js'));
  const sparkBolt = CLASS_DATA_MAP.Arcanoneer.spells.find((s) => s.id === 'arc_spark_bolt');

  const withStructuredInstant = {
    ...JSON.parse(JSON.stringify(sparkBolt)),
    durationConfig: {
      durationType: 'instant',
      durationValue: 0,
      durationUnit: 'instant',
    },
  };

  const res = checkRecord(withStructuredInstant, {
    className: 'Arcanoneer',
    classResource: { type: 'elemental_spheres' },
  });

  assert.equal(res.classification, CLASSIFICATIONS.UNSUPPORTED_CAPABILITY);
  assert.ok(res.incompatibilities.some((i) => i.code === 'STRUCTURED_INSTANT_DURATION_SCHEMA'));
  assert.ok(
    res.incompatibilities.every((i) => i.capabilityGroup !== 'turn-and-duration-lifecycle'),
    'Structured instant duration must never be counted as a turn-and-duration-lifecycle requirement'
  );
  assert.equal(
    res.exclusionAnalysis.primaryExclusionReason,
    EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
  );
  assert.equal(res.exclusionAnalysis.onlyBlockedByAuthoredSchema, true);
});

test('10. Regression: Single-actor self-targeting and single-target LoS metadata are separated from area-chain-and-multi-target-routing', () => {
  const { CLASS_DATA_MAP } = require(path.join(__dirname, '..', '..', 'src', 'data', 'classSpellGenerator.js'));
  const prayer = CLASS_DATA_MAP.Martyr.spells.find((s) => s.id === 'martyr_restorative_prayer');

  // Case A: Single-actor self-target (targetingType: "self", no AoE fields)
  const selfHealSpell = {
    ...JSON.parse(JSON.stringify(prayer)),
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
    },
  };
  const resSelf = checkRecord(selfHealSpell, {
    className: 'Martyr',
    classResource: { type: 'devotion' },
  });
  assert.ok(resSelf.incompatibilities.some((i) => i.code === 'SELF_TARGETING_SINGLE_ACTOR'));
  assert.ok(
    resSelf.incompatibilities.every((i) => i.capabilityGroup !== 'area-chain-and-multi-target-routing'),
    'Single-actor self-targeting must not be grouped under area-chain-and-multi-target-routing'
  );
  assert.equal(
    resSelf.exclusionAnalysis.primaryExclusionReason,
    EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
  );

  // Case B: Single-target spell with requiresLineOfSight: true (like minstrel_harmony_strike)
  const withLoS = {
    ...JSON.parse(JSON.stringify(prayer)),
    targetingConfig: {
      ...JSON.parse(JSON.stringify(prayer.targetingConfig)),
      requiresLineOfSight: true,
    },
  };
  const resLoS = checkRecord(withLoS, {
    className: 'Martyr',
    classResource: { type: 'devotion' },
  });
  assert.ok(resLoS.incompatibilities.some((i) => i.code === 'SINGLE_TARGET_SCHEMA_EXTRA_KEYS'));
  assert.ok(
    resLoS.incompatibilities.every((i) => i.capabilityGroup !== 'area-chain-and-multi-target-routing'),
    'requiresLineOfSight on a single-target spell must not be grouped under area-chain-and-multi-target-routing'
  );
  assert.equal(resLoS.exclusionAnalysis.onlyBlockedByAuthoredSchema, true);
});

test('11. Regression: Resource payment analysis distinguishes supported P9 payment, schema extra keys, encoding conflicts, and client-only un-homed domains', () => {
  const { CLASS_DATA_MAP } = require(path.join(__dirname, '..', '..', 'src', 'data', 'classSpellGenerator.js'));

  // (a) arc_spark_bolt: supported P9 payment (empty bank is an offline runtime prerequisite, funded bank produces classPayment)
  const sparkBolt = CLASS_DATA_MAP.Arcanoneer.spells.find((s) => s.id === 'arc_spark_bolt');
  const resSpark = checkRecord(sparkBolt, {
    className: 'Arcanoneer',
    classResource: { type: 'elemental_spheres' },
  });
  assert.equal(resSpark.resourcePaymentAnalysis.paymentStatus, 'supported_p9_payment');
  assert.equal(resSpark.resourcePaymentAnalysis.domainSupportedInP9, true);
  assert.deepEqual(resSpark.resourcePaymentAnalysis.clientPlannedCosts, ['arcane', 'arcane']);
  assert.ok(resSpark.resourcePaymentAnalysis.p9FundedBankVerdict.classPayment);

  // (b) minstrel_resolving_strike: client planner handles musicalCombo.requires (["I", "V"]), blocked in P9 by resolvesCadence: true + cost: 3 vs 2 notes
  const resolvingStrike = CLASS_DATA_MAP.Minstrel.spells.find((s) => s.id === 'minstrel_resolving_strike');
  const resResolving = checkRecord(resolvingStrike, {
    className: 'Minstrel',
    classResource: { type: 'musical_notes' },
  });
  assert.equal(resResolving.resourcePaymentAnalysis.paymentStatus, 'supported_domain_schema_extra_keys');
  assert.equal(resResolving.resourcePaymentAnalysis.clientResourcePlannerHandled, true);
  assert.deepEqual(resResolving.resourcePaymentAnalysis.clientPlannedCosts, ['I', 'V']);
  assert.ok(resResolving.incompatibilities.some((i) => i.code === 'CLASS_RESOURCE_SCHEMA_EXTRA_KEYS'));

  // (c) animist_earth_bolt: shape and formula pass P9, client resource planner handles ancestralResonance, but P9 has no server room home
  const earthBolt = CLASS_DATA_MAP.Animist.spells.find((s) => s.id === 'animist_earth_bolt');
  const resAnimist = checkRecord(earthBolt, {
    className: 'Animist',
    classResource: { type: 'resonance' },
  });
  assert.equal(resAnimist.resourcePaymentAnalysis.paymentStatus, 'client_contract_only_no_p9_room_home');
  assert.equal(resAnimist.resourcePaymentAnalysis.clientResourcePlannerHandled, true);
  assert.equal(resAnimist.resourcePaymentAnalysis.domainSupportedInP9, false);
  assert.ok(resAnimist.incompatibilities.some((i) => i.code === 'CLASS_RESOURCE_NO_P9_ROOM_HOME'));
});

test('12. Regression: Genuine invalid records are classified as invalid_for_profile based on evidence', () => {
  // Active non-manual spell claiming damage with no damageConfig
  const missingDamageConfig = {
    id: 'broken_damage_spell',
    name: 'Broken Bolt',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    typeConfig: { castTimeType: 'IMMEDIATE' },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30 },
    resourceCost: { actionPoints: 1, mana: 5, resourceValues: { mana: 5 } },
  };
  const resMissing = checkRecord(missingDamageConfig, { className: 'Arcanoneer' });
  assert.equal(resMissing.classification, CLASSIFICATIONS.INVALID_FOR_PROFILE);
  assert.ok(resMissing.invalidProfileIssues.some((msg) => /damageConfig is missing/i.test(msg)));

  // Active spell with negative AP cost
  const negativeAp = makeBaseWizardDamageDraft({
    id: 'negative_ap_spell',
    resourceCost: { actionPoints: -1, mana: 4, resourceValues: { mana: 4 } },
  });
  const resNegAp = checkRecord(negativeAp, { className: 'Arcanoneer' });
  assert.equal(resNegAp.classification, CLASSIFICATIONS.INVALID_FOR_PROFILE);
  assert.ok(resNegAp.invalidProfileIssues.some((msg) => /actionPoints/i.test(msg)));
});

test('13. First-Campaign Ability Readiness Batch manifest covers 12 real abilities across Groups A, B, C, D deterministically without mutating inputs', () => {
  const manifest1 = buildFirstCampaignReadinessManifest();
  const manifest2 = buildFirstCampaignReadinessManifest();

  assert.equal(JSON.stringify(manifest1), JSON.stringify(manifest2));
  assert.equal(manifest1.abilities.length, 12);
  assert.equal(FIRST_CAMPAIGN_BATCH_SPEC.length, 12);

  // Verify Martyr is clearly labelled as provisional reference
  const martyrCohort = manifest1.cohortClasses.find((c) => c.className === 'Martyr');
  assert.equal(martyrCohort.status, 'provisional-reference');

  // Verify all 4 groups (A, B, C, D) are populated
  assert.deepEqual(manifest1.groupedWork.A.abilityIds, [
    'arc_spark_bolt',
    'minstrel_opening_chord',
    'minstrel_harmonic_strike',
    'martyr_restorative_prayer',
  ]);
  assert.deepEqual(manifest1.groupedWork.B.abilityIds, [
    'minstrel_resolving_strike',
    'minstrel_harmony_strike',
  ]);
  assert.deepEqual(manifest1.groupedWork.C.abilityIds, [
    'arc_frost_touch',
    'arc_fire_bolt',
    'martyr_penitent_rebuke',
    'martyr_penance_of_pain',
  ]);
  assert.deepEqual(manifest1.groupedWork.D.abilityIds, [
    'arc_arcane_missile',
    'martyr_redemption_strike',
  ]);

  for (const ab of manifest1.abilities) {
    assert.ok(ab.id);
    assert.ok(ab.source.file);
    assert.ok(ab.source.line > 0);
    assert.match(ab.source.recordSha256, /^p9-spell:v1\/[0-9a-f]{64}$/);
    assert.ok(ab.readinessAssessment.ownerToAct);
    assert.ok(ab.readinessAssessment.exactReason);
  }
});
