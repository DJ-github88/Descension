'use strict';

/**
 * MYTHRILL HQ — FIRST-CAMPAIGN ABILITY READINESS BATCH
 *
 * Produces the machine-readable readiness manifest and human-readable summary
 * for a bounded 12-ability integration batch across:
 *   - Arcanoneer (First-Campaign Cohort)
 *   - Minstrel   (First-Campaign Cohort)
 *   - Martyr     (PROVISIONAL REFERENCE — third first-campaign class is not
 *                 separately locked in current phase docs; Martyr holds the
 *                 third accepted P9 resource domain `devotionGauge`)
 *
 * Never mutates, normalizes, strips effects, or rewrites authored class records.
 */

const path = require('path');
const {
  checkRecord,
  checkClassByName,
  buildValidatorIdentity,
  EXCLUSION_CATEGORIES,
  PROFILE_ACCEPTANCE_STATUS,
} = require('./checkAbilityCompatibility.cjs');

const VTT_REACT_ROOT = path.resolve(__dirname, '..', '..');

const CLASS_FILES = Object.freeze({
  Arcanoneer: 'vtt-react/src/data/classes/arcanoneerData.js',
  Minstrel: 'vtt-react/src/data/classes/minstrelData.js',
  Martyr: 'vtt-react/src/data/classes/martyrData.js',
});

const READINESS_GROUPS = Object.freeze({
  A: 'A. Existing accepted behavior; runtime admission/integration still required',
  B: 'B. Potential schema-only adaptation, pending Class HQ confirmation',
  C: 'C. Genuine shared-engine extension',
  D: 'D. Authored semantic conflict requiring a decision',
});

/**
 * Curated 12-ability First-Campaign Readiness Batch (4 Arcanoneer, 4 Minstrel, 4 Martyr [Provisional Reference]).
 */
const FIRST_CAMPAIGN_BATCH_SPEC = Object.freeze([
  // ── GROUP A: Existing accepted behavior; runtime admission/integration still required ──
  {
    spellId: 'arc_spark_bolt',
    className: 'Arcanoneer',
    classRole: 'confirmed-first-campaign',
    group: 'A',
    ownerToAct: 'Sol (Integration) + Sonnet/Combat (Cross-Track Finding I2)',
    exactReadinessReason:
      'Accepted in p9-spell:v1 (shape, 1d8 + intelligence/4 formula, and 2x Arcane Sphere payment all supported). Still requires runtime PC binding, map token placement, live 2x Arcane sphere balance at cast time, owner roll/payment approval, GM final confirmation ( including manual GM adjudication of prose "ignores 2 points of enemy Durability"), and resolution of Cross-Track Finding I2 (spellConsequence.js reads raw character.stats.intelligence instead of effective attributes).',
    requiredOwnerAction:
      'Sol: keep in playable candidate smoke suite. Sonnet + Combat: align spellConsequence.js combatAttributes(character) with effective attribute totals (Finding I2). Class HQ: confirm prose "ignores 2 points of enemy Durability" remains a GM final-amount ruling in P9.',
  },
  {
    spellId: 'minstrel_opening_chord',
    className: 'Minstrel',
    classRole: 'confirmed-first-campaign',
    group: 'A',
    ownerToAct: 'Sol (Integration)',
    exactReadinessReason:
      'Accepted in p9-spell:v1 (immediate single-target 1d6 storm damage, 1 AP, 4 Mana, and musicalCombo note generation of I×2, V×1 into musicalNotes bank). Executable from an empty note bank; still requires runtime PC binding, placed source/target tokens, owner roll/payment approval, and GM confirmation.',
    requiredOwnerAction:
      'Sol: include as Minstrel builder control in first-campaign playable candidate.',
  },
  {
    spellId: 'minstrel_harmonic_strike',
    className: 'Minstrel',
    classRole: 'confirmed-first-campaign',
    group: 'A',
    ownerToAct: 'Sol (Integration)',
    exactReadinessReason:
      'Accepted in p9-spell:v1 (immediate single-target melee 1d8 physical damage, 1 AP, 4 Mana, and musicalCombo note generation of III×2, I×1 into musicalNotes bank). Executable from an empty note bank; still requires runtime PC binding, placed tokens within 5 ft, owner approval, and GM confirmation.',
    requiredOwnerAction:
      'Sol: include as Minstrel melee builder control in first-campaign playable candidate.',
  },
  {
    spellId: 'martyr_restorative_prayer',
    className: 'Martyr',
    classRole: 'provisional-reference-third-p9-class',
    group: 'A',
    ownerToAct: 'Sol (Integration) + Sonnet/Combat (Cross-Track Finding I2)',
    exactReadinessReason:
      'Accepted in p9-spell:v1 (immediate single-target 1d4 + spirit direct ally healing, 1 AP, 5 Mana, devotionRequired: 0, devotionGain: +1). Executable at 0 Devotion; requires runtime PC binding, placed ally token within 30 ft, owner approval, GM confirmation, and Finding I2 raw-vs-effective spirit alignment.',
    requiredOwnerAction:
      'Sol: retain as Martyr (Provisional Reference) healing control. Sonnet + Combat: align effective Spirit consumption (Finding I2).',
  },

  // ── GROUP B: Potential schema-only adaptation, pending Class HQ confirmation ──
  {
    spellId: 'minstrel_resolving_strike',
    className: 'Minstrel',
    classRole: 'confirmed-first-campaign',
    group: 'B',
    ownerToAct: 'Class HQ (confirm cadence cost) + Combat (optional encodingConflict allowance)',
    exactReadinessReason:
      'Existing engine capability (p9-spell:v1) already supports its shape (supportShape: true), formula (1d8 + spirit: true), and pitch-specific note deduction via classResourceBanks.getBankSpellResourcePlan (musicalCombo.requires -> costs: ["I", "V"]). Excluded ONLY because resourceCost.resourceValues.classResource is authored as { type: "musical_notes", cost: 3, resolvesCadence: true }, where extra key "resolvesCadence" is rejected by spellConsequence.encodingConflict and summary cost: 3 disagrees with the 2 required notes (I + V).',
    requiredOwnerAction:
      'Class HQ: confirm that Resolving Strike has no secondary effect beyond 1d8 + spirit storm damage and that its note price is 1× Pitch I + 1× Pitch V (cost: 2), removing or normalizing { cost: 3, resolvesCadence: true }. Combat: optionally allow resolvesCadence: true in encodingConflict when musicalCombo.requires is present.',
  },
  {
    spellId: 'minstrel_harmony_strike',
    className: 'Minstrel',
    classRole: 'confirmed-first-campaign',
    group: 'B',
    ownerToAct: 'Class HQ (confirm resolver vs generator role & schema) + Combat',
    exactReadinessReason:
      'Authored as immediate single-target storm damage (5d6 + spirit, 1 AP, 16 Mana, 2-turn cooldown) with no buff/debuff/control/save config. Excluded by two schema flags—targetingConfig.requiresLineOfSight: true and resourceValues.classResource.resolvesCadence: true—plus an authored role question: musicalCombo defines type: "resolver" requiring II×1 + IV×1 ( while classResource.cost says 3), whereas description and tags ("note generation") describe shaking loose musical notes.',
    requiredOwnerAction:
      'Class HQ: confirm whether Harmony Strike is a II+IV cadence resolver or a note generator, and confirm removing/normalizing requiresLineOfSight: true (already enforced by GM adjudication) and resolvesCadence: true.',
  },

  // ── GROUP C: Genuine shared-engine extension ──
  {
    spellId: 'arc_frost_touch',
    className: 'Arcanoneer',
    classRole: 'confirmed-first-campaign',
    group: 'C',
    ownerToAct: 'Combat (Opus / Sol) + Class HQ',
    exactReadinessReason:
      'Immediate single-target rime damage (1d8 + intelligence/4) and 2× Rime Sphere payment (["rime", "rime"]) are supported by P9, but the record also requires debuffConfig ("Frozen Limbs": -10 ft movement speed for 1 round, Constitution DC 12 save negates) plus prose next-physical-attack +1d4 vulnerability. Cannot be executed as damage-only without stripping authored debuff.',
    requiredOwnerAction:
      'Combat: requires an accepted compound damage + movement-debuff execution profile on class spells with Elemental Sphere payment and GM save adjudication (Note: Opus A10 authored-effect:v1 is still unaccepted source work and currently only supports Wizard definitions without class-resource payment).',
  },
  {
    spellId: 'arc_fire_bolt',
    className: 'Arcanoneer',
    classRole: 'confirmed-first-campaign',
    group: 'C',
    ownerToAct: 'Combat',
    exactReadinessReason:
      'Primary single-target ember damage (2d8 + intelligence/3, 1 AP, 10 Mana, 90 ft) and 2× Ember Sphere payment (["ember", "ember"]) pass P9 formula and payment checks, but top-level propagation ({ method: "explosion", behavior: "aoe", parameters: { secondaryRadius: 10 } }) requires secondary AoE explosion / multi-target consequence resolution.',
    requiredOwnerAction:
      'Combat: requires shared multi-target / secondary AoE propagation consequence planning and GM per-target confirmation.',
  },
  {
    spellId: 'martyr_penitent_rebuke',
    className: 'Martyr',
    classRole: 'provisional-reference-third-p9-class',
    group: 'C',
    ownerToAct: 'Combat + Class HQ',
    exactReadinessReason:
      'Single-target immediate ember damage (3d8), 1 AP, 8 Mana, and 1 Devotion level spend (devotionGauge cost: 1) all pass P9 formula, targeting, cooldown, and payment validators. Excluded ONLY by damageConfig.savingThrow ({ ability: "agility", difficultyClass: 15, saveOutcome: "half_damage" }) and prose conditional bonus (+2d8 if Martyr absorbed ally damage this round).',
    requiredOwnerAction:
      'Combat: extend immediate damage consequence contract to surface structured savingThrow metadata (DC, ability, half_damage outcome) in the GM adjudication panel. Class HQ: confirm whether the +2d8 absorbed-damage bonus stays a manual GM finalAmount adjustment or requires a tracked round state.',
  },
  {
    spellId: 'martyr_penance_of_pain',
    className: 'Martyr',
    classRole: 'provisional-reference-third-p9-class',
    group: 'C',
    ownerToAct: 'Class HQ + Combat',
    exactReadinessReason:
      'Passes P9 supportShape (immediate single-target direct ally healing, 1 AP, 6 Mana) and planClassPayment (devotionGauge: requires 1, cost 1, gain 1). Excluded ONLY because healingConfig.formula is "(maxHealth - currentHealth) / 4" under resolution: "DICE", which uses parentheses, caster missing-HP state variables (maxHealth, currentHealth), and rolls zero dice.',
    requiredOwnerAction:
      'Class HQ: decide whether Penance of Pain should use a dice+spirit formula or deterministic caster missing-HP scaling. Combat: if missing-HP formulas are retained, add caster-health state terms and deterministic/die-less formula evaluation.',
  },

  // ── GROUP D: Authored semantic conflict requiring a decision ──
  {
    spellId: 'arc_arcane_missile',
    className: 'Arcanoneer',
    classRole: 'confirmed-first-campaign',
    group: 'D',
    ownerToAct: 'Class HQ',
    exactReadinessReason:
      'Immediate single-target storm damage (1d8 + intelligence/4, 1 AP, 4 Mana) is blocked by a direct sphere recipe contradiction: resourceCost.spheres specifies ["Arcane", "ember"], whereas resourceCost.resourceValues specifies { arcane_sphere: 1, holy_sphere: 1 } (matching resourceTypes ["mana", "arcane_sphere", "holy_sphere"], enhancesCombo "arcane_holy", and prose "sacred and arcane aether-shards"). Also carries damageConfig.autoHit: true.',
    requiredOwnerAction:
      'Class HQ: resolve canonical sphere recipe (["arcane", "sacred"] vs ["arcane", "ember"]) so explicit list and resourceValues agree, and confirm whether damageConfig.autoHit: true can be omitted/treated as descriptive under P9 GM-confirmed rolls.',
  },
  {
    spellId: 'martyr_redemption_strike',
    className: 'Martyr',
    classRole: 'provisional-reference-third-p9-class',
    group: 'D',
    ownerToAct: 'Class HQ + Combat',
    exactReadinessReason:
      'Single-target melee ember damage (Level 6, 1 AP, 25 Mana) has two authored semantic conflicts: (1) resourceCost.resourceValues.classResource specifies { type: "devotion", cost: 3 } (matching devotionRequired: 3) while top-level devotionCost specifies 5; (2) damageConfig.formula specifies "5d10 + spirit + missing_hp_percentage" (flat percentage addition) while specialMechanics.scalingDamage specifies "+1d8 per 20% missing health" (maxBonus: "5d8").',
    requiredOwnerAction:
      'Class HQ: resolve whether Devotion cost is 3 or 5 (and whether 5 is an optional amplified cost across the 12 Martyr spells with this pattern), and choose one canonical missing-HP scaling formula. Combat: missing-HP scaling requires engine formula extension once Class HQ decides.',
  },
]);

/**
 * Extracts structured price, formula, route, resource operations, and secondary effects
 * directly from an unmodified authored spell record and its checker result.
 */
function buildAbilityReadinessEntry(spec, spellRecord, context, checkerResult) {
  const tc = spellRecord.targetingConfig || {};
  const rc = spellRecord.resourceCost || {};
  const rv = rc.resourceValues || {};
  const effectTypes = Array.isArray(spellRecord.effectTypes) ? [...spellRecord.effectTypes] : [];
  const primaryConfig = spellRecord.damageConfig || spellRecord.healingConfig || {};

  // Secondary effect blocks present on the record
  const secondaryEffectBlocks = [];
  for (const key of [
    'debuffConfig',
    'buffConfig',
    'controlConfig',
    'defensiveConfig',
    'utilityConfig',
    'summoningConfig',
    'transformationConfig',
    'purificationConfig',
    'restorationConfig',
    'propagation',
    'triggerConfig',
    'specialMechanics',
    'mechanicsConfig',
    'effectTargeting',
  ]) {
    if (spellRecord[key] !== undefined && spellRecord[key] !== null) {
      secondaryEffectBlocks.push({
        field: key,
        summary: JSON.stringify(spellRecord[key]).slice(0, 240),
      });
    }
  }
  if (spellRecord.damageConfig?.savingThrow) {
    secondaryEffectBlocks.push({
      field: 'damageConfig.savingThrow',
      summary: JSON.stringify(spellRecord.damageConfig.savingThrow),
    });
  }
  if (spellRecord.damageConfig?.autoHit !== undefined) {
    secondaryEffectBlocks.push({
      field: 'damageConfig.autoHit',
      summary: `autoHit: ${JSON.stringify(spellRecord.damageConfig.autoHit)}`,
    });
  }
  if (spellRecord.damageConfig?.criticalConfig) {
    secondaryEffectBlocks.push({
      field: 'damageConfig.criticalConfig',
      summary: JSON.stringify(spellRecord.damageConfig.criticalConfig),
    });
  }

  const rpa = checkerResult.resourcePaymentAnalysis || {};

  return {
    id: spellRecord.id,
    name: spellRecord.name,
    level: spellRecord.level,
    className: spec.className,
    classRole: spec.classRole,
    readinessGroup: spec.group,
    readinessGroupLabel: READINESS_GROUPS[spec.group],
    source: {
      file: checkerResult.sourceLocation.file,
      line: checkerResult.sourceLocation.line,
      collectionPath: checkerResult.sourceLocation.collectionPath,
      recordSha256: checkerResult.sourceLocation.recordSha256,
    },
    authoredEffectAndFormula: {
      spellType: spellRecord.spellType,
      castTimeType: spellRecord.typeConfig?.castTimeType || null,
      effectTypes,
      resolution: primaryConfig.resolution || spellRecord.resolution || null,
      formula: primaryConfig.formula || null,
      formulaSupportedByP9: Boolean(
        checkerResult.questions.executableProfile.productionVerdict?.formula?.supported
      ),
      formulaReadingOrReason:
        checkerResult.questions.executableProfile.productionVerdict?.formula?.reading ||
        checkerResult.questions.executableProfile.productionVerdict?.formula?.reason ||
        null,
      damageTypes: spellRecord.damageConfig?.damageTypes || null,
      healingType: spellRecord.healingConfig?.healingType || null,
      durationConfig: spellRecord.durationConfig || null,
    },
    fullPrice: {
      actionPoints: rc.actionPoints !== undefined ? rc.actionPoints : rv.actionPoints,
      mana: rc.mana !== undefined ? rc.mana : rv.mana,
      cooldown: spellRecord.cooldownConfig || null,
      rawResourceTypes: rc.resourceTypes || [],
      rawResourceValues: rv,
      rawClassResource: rc.classResource ?? rv.classResource ?? null,
      spheres: rc.spheres || spellRecord.sphereCost || null,
      musicalCombo: spellRecord.musicalCombo || null,
      devotionRequired: spellRecord.devotionRequired ?? null,
      devotionCost: spellRecord.devotionCost ?? null,
      devotionGain: spellRecord.devotionGain ?? null,
    },
    existingExecutionProfile: {
      matchedAcceptedProfile: checkerResult.compatibleProfile,
      sourceObservedProfile: checkerResult.sourceObservedProfile,
      capabilityStatus: checkerResult.capabilityStatus,
      productionReady: checkerResult.productionReady,
      checkerClassification: checkerResult.classification,
    },
    sourceTargetRoute: {
      sourceActorKind: 'pc (bound primary character)',
      targetingType: tc.targetingType || null,
      rangeType: tc.rangeType || null,
      rangeDistance: tc.rangeDistance !== undefined ? tc.rangeDistance : null,
      targetRestrictions: tc.targetRestrictions || [],
      maxTargets: tc.maxTargets !== undefined ? tc.maxTargets : null,
      extraTargetingKeys: Object.keys(tc).filter(
        (k) => !['targetingType', 'rangeType', 'rangeDistance', 'targetRestrictions', 'maxTargets'].includes(k)
      ),
      routeSupportedInProfile: checkerResult.questions.routeSupport.supported,
      allowedRoutes: checkerResult.questions.routeSupport.allowedRoutes,
    },
    requiredClassResourceOperations: {
      domain: rpa.managedDomainId || 'none',
      domainSupportedInP9: Boolean(rpa.domainSupportedInP9),
      clientPlannerHandled: Boolean(rpa.clientResourcePlannerHandled),
      paymentStatus: rpa.paymentStatus || null,
      plannedCosts: rpa.clientPlannedCosts,
      plannedGains: rpa.clientPlannedGains,
      plannedRequired: rpa.clientPlannedRequired,
      p9FundedClassPayment: rpa.p9FundedBankVerdict?.classPayment || null,
      p9PaymentRejectionReason: rpa.p9FundedBankVerdict?.supported ? null : rpa.p9FundedBankVerdict?.reason,
    },
    secondaryEffectsAndPrerequisites: {
      secondaryEffectBlocks,
      incompatibilities: checkerResult.incompatibilities,
      conflicts: checkerResult.conflicts,
      runtimePrerequisites: checkerResult.questions.runtimePrerequisites.prerequisites,
    },
    readinessAssessment: {
      group: spec.group,
      groupLabel: READINESS_GROUPS[spec.group],
      primaryExclusionReason: checkerResult.exclusionAnalysis.primaryExclusionReason,
      exclusionCategoriesPresent: checkerResult.exclusionAnalysis.categoriesPresent,
      exactReason: spec.exactReadinessReason,
      ownerToAct: spec.ownerToAct,
      requiredOwnerAction: spec.requiredOwnerAction,
    },
  };
}

/**
 * Computes the catalogue-wide boundary audit numbers to document why simple abilities
 * are excluded across the 5 distinct categories.
 */
function buildCatalogueBoundarySummary() {
  const fullReport = checkClassByName('all');
  let structuredInstantCount = 0;
  let singleActorSelfCount = 0;
  let singleTargetExtraKeyCount = 0;
  let intentionalManualCount = 0;
  let conflictingDataCount = 0;
  let onlySchemaBlockedCount = 0;
  let clientPlannedButUnHomedDomainCount = 0;
  let minstrelCadenceSchemaCount = 0;

  for (const rec of fullReport.records) {
    if (rec.incompatibilities.some((i) => i.code === 'STRUCTURED_INSTANT_DURATION_SCHEMA')) {
      structuredInstantCount += 1;
    }
    if (rec.incompatibilities.some((i) => i.code === 'SELF_TARGETING_SINGLE_ACTOR')) {
      singleActorSelfCount += 1;
    }
    if (rec.incompatibilities.some((i) => i.code === 'SINGLE_TARGET_SCHEMA_EXTRA_KEYS')) {
      singleTargetExtraKeyCount += 1;
    }
    if (rec.exclusionAnalysis?.intentionalManualOnly) {
      intentionalManualCount += 1;
    }
    if (rec.conflicts.length > 0) {
      conflictingDataCount += 1;
    }
    if (rec.exclusionAnalysis?.onlyBlockedByAuthoredSchema) {
      onlySchemaBlockedCount += 1;
    }
    if (rec.resourcePaymentAnalysis?.paymentStatus === 'client_contract_only_no_p9_room_home') {
      clientPlannedButUnHomedDomainCount += 1;
    }
    if (rec.incompatibilities.some((i) => i.code === 'CLASS_RESOURCE_SCHEMA_EXTRA_KEYS')) {
      minstrelCadenceSchemaCount += 1;
    }
  }

  return {
    totalCatalogueRecords: fullReport.summary.totalRecordsChecked,
    countsByClassification: fullReport.summary.countsByClassification,
    countsByPrimaryExclusionReason: fullReport.summary.countsByPrimaryExclusionReason,
    specificBoundaryFindings: {
      structuredInstantDurationEnvelopesSeparatedFromLifecycle: {
        count: structuredInstantCount,
        explanation:
          '265 catalogue records use {"durationType":"instant","durationValue":0,"durationUnit":"instant"} (plus 13 zero-round instant records). These have instant semantics and are now classified under incompatible_authored_schema (schema-instant-duration-envelope) rather than turn-and-duration-lifecycle.',
      },
      singleActorSelfTargetingSeparatedFromAreaMultiTarget: {
        count: singleActorSelfCount,
        explanation:
          '799 of 801 targetingType: "self" catalogue records are single-actor self-targets with no AoE geometry. They are now separated into self-target-schema-or-route (incompatible_authored_schema) rather than area-chain-and-multi-target-routing.',
      },
      singleTargetMetadataKeysSeparatedFromAreaMultiTarget: {
        count: singleTargetExtraKeyCount,
        explanation:
          'Single-target records carrying non-AoE metadata keys such as targetingConfig.requiresLineOfSight: true (e.g. minstrel_harmony_strike) are now classified under schema-single-target-metadata-keys (incompatible_authored_schema) rather than area-chain-and-multi-target-routing.',
      },
      resourceNameVsPaymentSupportDistinction: {
        minstrelCadenceSchemaBlockedCount: minstrelCadenceSchemaCount,
        clientPlannedButUnHomedDomainCount,
        explanation:
          'The checker now evaluates classResourceContracts.getManagedSpellResourcePlan alongside spellConsequence.planClassPayment using both empty and funded probe banks. It distinguishes (1) supported P9 payment domains where empty-bank failure is merely an offline runtime prerequisite, (2) Minstrel cadence spells (19 records) where getBankSpellResourcePlan already plans musicalCombo.requires note deduction but resourceValues.classResource carries { cost: 3, resolvesCadence: true }, (3) conflicting sphere/devotion encodings, and (4) the 27 other classes whose resources ARE planned on the client by classResourceContracts.js but lack a server P9 room home.',
      },
      authoredEffectV1ProvisionalStatusEnforced: {
        profile: 'authored-effect:v1',
        capabilityStatus: PROFILE_ACCEPTANCE_STATUS['authored-effect:v1'].capabilityStatus,
        productionReady: false,
        explanation:
          'Per docs/ENGINEERING_STATE.md and docs/MYTHRILL_CROSS_TRACK_COORDINATION.md (Finding I4), Opus P14-A10 (authored-effect:v1) is present in working-tree source but has NO completed increment/App/review acceptance handoff. The checker reports sourceObservedCompatible: true, acceptedCompatible: false, capabilityStatus: "provisional_unaccepted_source", productionReady: false, and refuses to mark it compatible/production-ready.',
      },
      intentionalManualOnlyRecords: {
        count: intentionalManualCount,
        explanation:
          '818 records across the 9 reconstructed CR-1 classes carry explicit manualOnly: true / executionEnabled: false / applicationMode: "manual-tabletop" designations by design.',
      },
      conflictingAuthoredDataRecords: {
        count: conflictingDataCount,
        explanation:
          'Includes 13 Arcanoneer spells with explicit sphere list vs typed sphere count disagreements, 12 Martyr spells with base classResource.cost vs top-level devotionCost disagreements, 19 Minstrel cadence spells where generic classResource.cost: 3 disagrees with musicalCombo.requires note counts, and records whose effectTypes omit a populated damageConfig/healingConfig.',
      },
      recordsBlockedSolelyByAuthoredSchema: {
        count: onlySchemaBlockedCount,
        explanation:
          'Active non-manual records that require zero new engine capabilities or conflict resolutions and are blocked solely by strict P9 schema key whitelists.',
      },
    },
  };
}

/**
 * Builds the complete machine-readable First-Campaign Ability Readiness Manifest.
 */
function buildFirstCampaignReadinessManifest() {
  const { CLASS_DATA_MAP } = require(path.join(VTT_REACT_ROOT, 'src', 'data', 'classSpellGenerator.js'));
  const validatorIdentity = buildValidatorIdentity();
  const boundarySummary = buildCatalogueBoundarySummary();

  const abilities = [];
  for (const spec of FIRST_CAMPAIGN_BATCH_SPEC) {
    const classData = CLASS_DATA_MAP[spec.className];
    if (!classData || !Array.isArray(classData.spells)) {
      throw new Error(`Class "${spec.className}" not found in CLASS_DATA_MAP.`);
    }
    const index = classData.spells.findIndex((s) => s.id === spec.spellId);
    if (index === -1) {
      throw new Error(`Ability "${spec.spellId}" not found in ${spec.className}.spells.`);
    }
    const rawSpell = classData.spells[index];
    const preHash = JSON.stringify(rawSpell);

    const context = {
      className: spec.className,
      classResource: classData.classResource ? { type: classData.classResource.type } : null,
      file: CLASS_FILES[spec.className],
      collectionPath: `${spec.className}.spells[${index}]`,
      index,
    };

    const checkerResult = checkRecord(rawSpell, context);
    const postHash = JSON.stringify(rawSpell);
    if (preHash !== postHash) {
      throw new Error(`Input record "${spec.spellId}" was mutated during readiness check!`);
    }

    abilities.push(buildAbilityReadinessEntry(spec, rawSpell, context, checkerResult));
  }

  const groupedWork = {
    A: {
      group: 'A',
      title: READINESS_GROUPS.A,
      abilityIds: abilities.filter((a) => a.readinessGroup === 'A').map((a) => a.id),
      summary:
        'Already compatible with accepted p9-spell:v1. Require runtime admission/integration prerequisites (bound primary PC, placed map tokens, live resource bank balance, owner approval, GM confirmation) and Cross-Track Finding I2 alignment (effective vs raw character attributes in spellConsequence.js).',
    },
    B: {
      group: 'B',
      title: READINESS_GROUPS.B,
      abilityIds: abilities.filter((a) => a.readinessGroup === 'B').map((a) => a.id),
      summary:
        'Single-target immediate storm damage spells in Minstrel whose mechanics (DICE damage + musicalCombo note payment) already exist in p9-spell:v1 and classResourceBanks.js, but are excluded by resourceValues.classResource: { type: "musical_notes", cost: 3, resolvesCadence: true } and targetingConfig.requiresLineOfSight: true (plus Class HQ confirmation of minstrel_harmony_strike resolver vs generator role).',
    },
    C: {
      group: 'C',
      title: READINESS_GROUPS.C,
      abilityIds: abilities.filter((a) => a.readinessGroup === 'C').map((a) => a.id),
      summary:
        'Require genuine shared-engine extensions: compound damage + debuff rider on class spells (arc_frost_touch), chain propagation (arc_fire_bolt), savingThrow metadata in P9 damage adjudication (martyr_penitent_rebuke), or caster missing-HP deterministic formula scaling (martyr_penance_of_pain).',
    },
    D: {
      group: 'D',
      title: READINESS_GROUPS.D,
      abilityIds: abilities.filter((a) => a.readinessGroup === 'D').map((a) => a.id),
      summary:
        'Blocked by internal authored data contradictions requiring a Class HQ design decision before any schema or engine work: arc_arcane_missile (spheres ["Arcane", "ember"] vs resourceValues { arcane_sphere: 1, holy_sphere: 1 } + autoHit: true) and martyr_redemption_strike (classResource.cost: 3 vs devotionCost: 5, and flat missing_hp_percentage formula vs +1d8 per 20% missing HP in specialMechanics).',
    },
  };

  const recommendedSmallestWorthwhileBatch = {
    batchTitle: 'Minstrel Cadence Note-Spend & Single-Target Schema Alignment + Arcanoneer/Martyr Recipe Reconciliation',
    targetOwners: ['Class HQ', 'Combat'],
    primaryTargetAbilitiesInBatch: ['minstrel_resolving_strike', 'minstrel_harmony_strike', 'arc_arcane_missile'],
    broaderCatalogueImpact: {
      immediatelyExecutableInP9AfterChange: [
        'minstrel_resolving_strike (completes Minstrel builder -> resolver loop in P9)',
        'minstrel_harmony_strike (once Class HQ confirms II+IV resolver role)',
        'arc_arcane_missile (once Class HQ selects canonical ["arcane", "sacred"] or ["arcane", "ember"] recipe)',
      ],
      paymentOrSchemaLayerUnblockedForFutureIncrements: [
        'All 19 Minstrel cadence spells in minstrelData.js currently failing planClassPayment due to resourceValues.classResource: { cost: 3, resolvesCadence: true }',
        '13 Arcanoneer spells with sphere recipe list vs resourceValues mismatches (once reconciled by Class HQ)',
        '12 Martyr spells with base classResource.cost vs amplified devotionCost mismatches (once reconciled by Class HQ)',
        '73 catalogue spells carrying targetingConfig.requiresLineOfSight: true and 265 spells carrying structured instant duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"}',
      ],
    },
    whatTheChangeIs: [
      '1. Class HQ / Combat alignment on Minstrel cadence cost schema: classResourceBanks.getBankSpellResourcePlan ALREADY computes exact pitch deduction from musicalCombo.requires (e.g. ["I", "V"] for minstrel_resolving_strike). Either align resourceCost.resourceValues.classResource in minstrelData.js to omit the non-standard resolvesCadence: true flag and match musicalCombo.requires count, or allow resolvesCadence: true in spellConsequence.encodingConflict when musicalCombo.requires is present.',
      '2. Permit or normalize non-AoE single-target schema metadata in spellConsequence.supportShape: targetingConfig.requiresLineOfSight (boolean), structured instant duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"}, and descriptive damageConfig.autoHit: true (since P9 has no automated attack roll and requires GM confirmation on every execution).',
      '3. Class HQ one-line recipe decision on arc_arcane_missile: align resourceCost.spheres with resourceCost.resourceValues ({ arcane_sphere: 1, holy_sphere: 1 } -> ["arcane", "sacred"]).',
    ],
    whatItCovers: [
      'Unlocks Minstrel cadence note spending in P9 so Minstrel can both build notes (minstrel_opening_chord, minstrel_harmonic_strike) and spend them on single-target immediate damage cadences (minstrel_resolving_strike, minstrel_harmony_strike) using the existing revisioned musicalNotes room home.',
      'Unlocks arc_arcane_missile as a second Level 1 Arcanoneer immediate single-target spell alongside arc_spark_bolt.',
      'Requires zero new server room state fields, zero new socket handlers, and zero changes to P9 owner-approval or GM-confirmation flow.',
    ],
    whatItExplicitlyDoesNotCover: [
      'Does NOT execute multi-round buffs, debuffs, or conditions on class spells (arc_frost_touch, arc_concussive_resonance, minstrel_perfect_cadence stay manual until compound class-spell effects are accepted).',
      'Does NOT execute AoE, cones, lines, or chain propagation (arc_fire_bolt, minstrel_minor_cadence stay manual).',
      'Does NOT execute simultaneous damage + healing (martyr_devoted_strike, minstrel_mending_cadence stay manual).',
      'Does NOT execute reactions or event triggers (martyr_intervene stays manual).',
      'Does NOT execute saving throw half-damage/negation rules or caster missing-HP formulas (martyr_penitent_rebuke, martyr_penance_of_pain, martyr_redemption_strike stay manual).',
      'Does NOT promote unfinished Opus A10 (authored-effect:v1) to accepted production status.',
    ],
  };

  return {
    schemaVersion: 'first-campaign-readiness-batch:v1',
    batchName: 'first-campaign-ability-readiness-batch',
    cohortClasses: [
      {
        className: 'Arcanoneer',
        status: 'confirmed-first-campaign',
        p9ResourceDomain: 'elementalSpheres',
      },
      {
        className: 'Minstrel',
        status: 'confirmed-first-campaign',
        p9ResourceDomain: 'musicalNotes',
      },
      {
        className: 'Martyr',
        status: 'provisional-reference',
        note: 'Clearly labelled provisional reference: third first-campaign class is not separately locked in current phase docs, while Martyr owns the third accepted P9 resource domain (devotionGauge).',
        p9ResourceDomain: 'devotionGauge',
      },
    ],
    validatorIdentity,
    boundaryExaminationSummary: boundarySummary,
    groupedWork,
    recommendedSmallestWorthwhileBatch,
    abilities,
  };
}

/**
 * Formats a concise terminal/markdown summary of the First-Campaign Readiness Batch.
 */
function formatFirstCampaignReadinessSummary(manifest) {
  const lines = [];
  lines.push('================================================================================');
  lines.push('MYTHRILL HQ — FIRST-CAMPAIGN ABILITY READINESS BATCH');
  lines.push(`Validator Bundle SHA-256: ${manifest.validatorIdentity.validatorBundleHash.slice(0, 16)}...`);
  lines.push(
    'Classes: Arcanoneer, Minstrel, Martyr (PROVISIONAL REFERENCE — 3rd P9 resource domain)'
  );
  lines.push('================================================================================');
  lines.push('');
  lines.push('1. BOUNDARY EXAMINATION SUMMARY (1,992 Catalogue Records):');
  const bf = manifest.boundaryExaminationSummary.specificBoundaryFindings;
  lines.push(
    `  - Structured instant durations separated from lifecycle: ${bf.structuredInstantDurationEnvelopesSeparatedFromLifecycle.count} records -> incompatible_authored_schema`
  );
  lines.push(
    `  - Single-actor self-targets separated from AoE/multi:    ${bf.singleActorSelfTargetingSeparatedFromAreaMultiTarget.count} records -> incompatible_authored_schema`
  );
  lines.push(
    `  - Single-target non-AoE metadata keys (e.g. LoS):        ${bf.singleTargetMetadataKeysSeparatedFromAreaMultiTarget.count} records -> incompatible_authored_schema`
  );
  lines.push(
    `  - Minstrel cadence payment schema extra keys:            ${bf.resourceNameVsPaymentSupportDistinction.minstrelCadenceSchemaBlockedCount} records -> incompatible_authored_schema`
  );
  lines.push(
    `  - Client-planned class resources lacking P9 room home:   ${bf.resourceNameVsPaymentSupportDistinction.clientPlannedButUnHomedDomainCount} records -> missing_engine_capability`
  );
  lines.push(
    `  - Intentional manualOnly / CR-1 tabletop records:        ${bf.intentionalManualOnlyRecords.count} records -> intentional_manual_only`
  );
  lines.push(
    `  - Conflicting authored data records:                     ${bf.conflictingAuthoredDataRecords.count} records -> conflicting_data`
  );
  lines.push(
    `  - Opus A10 (authored-effect:v1) governance status:       ${bf.authoredEffectV1ProvisionalStatusEnforced.capabilityStatus} (productionReady: false)`
  );
  lines.push('');
  lines.push('2. 12-ABILITY READINESS BATCH BY GROUP:');
  lines.push('--------------------------------------------------------------------------------');
  for (const grpKey of ['A', 'B', 'C', 'D']) {
    const grp = manifest.groupedWork[grpKey];
    lines.push(`${grp.title}`);
    for (const id of grp.abilityIds) {
      const ab = manifest.abilities.find((a) => a.id === id);
      const classLabel =
        ab.className === 'Martyr' ? 'Martyr [Provisional Ref]' : ab.className;
      lines.push(
        `  • ${ab.id.padEnd(28)} (${classLabel.padEnd(24)}) | ${ab.source.file}:${ab.source.line}`
      );
      lines.push(
        `      Effect/Formula: ${ab.authoredEffectAndFormula.effectTypes.join('+')} | ${
          ab.authoredEffectAndFormula.formula || 'none'
        } | Price: ${ab.fullPrice.actionPoints} AP, ${ab.fullPrice.mana} Mana, ${
          ab.requiredClassResourceOperations.domain
        }`
      );
      lines.push(`      Owner to Act:   ${ab.readinessAssessment.ownerToAct}`);
      lines.push(`      Reason:         ${ab.readinessAssessment.exactReason}`);
    }
    lines.push('');
  }
  lines.push('3. RECOMMENDED SMALLEST WORTHWHILE NEXT BATCH:');
  lines.push('--------------------------------------------------------------------------------');
  lines.push(`  Title:   ${manifest.recommendedSmallestWorthwhileBatch.batchTitle}`);
  lines.push(
    `  Targets: ${manifest.recommendedSmallestWorthwhileBatch.primaryTargetAbilitiesInBatch.join(', ')}`
  );
  lines.push(
    `  Owners:  ${manifest.recommendedSmallestWorthwhileBatch.targetOwners.join(' + ')}`
  );
  lines.push('================================================================================');
  return lines.join('\n');
}

module.exports = {
  CLASS_FILES,
  READINESS_GROUPS,
  FIRST_CAMPAIGN_BATCH_SPEC,
  buildCatalogueBoundarySummary,
  buildFirstCampaignReadinessManifest,
  formatFirstCampaignReadinessSummary,
};
