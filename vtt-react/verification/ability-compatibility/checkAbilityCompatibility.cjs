#!/usr/bin/env node
'use strict';

/**
 * MYTHRILL HQ — BATCH ABILITY COMPATIBILITY CHECKER
 *
 * Standalone developer tool that checks class ability records and Wizard-authored
 * ability records against the execution capabilities Mythrill actually supports.
 *
 * Reuses production validators directly:
 * - vtt-react/src/services/spellConsequence.js (supportShape, planClassPayment, readFormula, supportSpell, definitionHash)
 * - vtt-react/src/data/classResourceContracts.js (getManagedResourceId, getManagedSpellResourcePlan, normalizeManagedClassResource)
 * - vtt-react/src/data/classResourceBanks.js (extractSphereRequirementsAndGains, MINSTREL_PITCHES)
 * - server/shared/services/authoredAbility.js (definitionFromWizard, readFormula, creatureSelfHealing, CAPABILITY, CONDITION_CAPABILITY, EFFECT_CAPABILITY)
 * - server/shared/services/authoredEffect.js (readEffectSpec, compileEffectPart, POLICY_TEXT)
 * - server/services/installedDefinitionRegistry.js (compileDefinition)
 * - server/services/authoredSpellDefinitions.js (compileDefinition)
 * - server/shared/services/sharedConditionProfile.js (validMovementFeet, SHARED_CONDITION_KEY, SHARED_MOVEMENT_ID)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const VTT_REACT_ROOT = path.resolve(__dirname, '..', '..');

// Register a narrow, deterministic Babel CommonJS hook for ESM files under vtt-react/src
let babelHookRegistered = false;
function registerVttEsmHook() {
  if (babelHookRegistered) return;
  const babel = require(path.join(VTT_REACT_ROOT, 'node_modules', '@babel', 'core'));
  const cjsPlugin = require.resolve(
    path.join(VTT_REACT_ROOT, 'node_modules', '@babel', 'plugin-transform-modules-commonjs')
  );

  const compileEsm = (mod, filename) => {
    const src = fs.readFileSync(filename, 'utf8');
    if (filename.includes('node_modules') || !/^\s*(import|export)\b/m.test(src)) {
      return mod._compile(src, filename);
    }
    const transformed = babel.transformSync(src, {
      filename,
      plugins: [cjsPlugin],
      compact: false,
      sourceMaps: false,
    });
    return mod._compile(transformed.code, filename);
  };

  require.extensions['.js'] = compileEsm;
  require.extensions['.mjs'] = compileEsm;
  babelHookRegistered = true;
}

registerVttEsmHook();

// Load production validators
const authoredAbility = require(path.join(REPO_ROOT, 'server', 'shared', 'services', 'authoredAbility.js'));
const authoredEffect = require(path.join(REPO_ROOT, 'server', 'shared', 'services', 'authoredEffect.js'));
const installedDefinitionRegistry = require(path.join(REPO_ROOT, 'server', 'services', 'installedDefinitionRegistry.js'));
const authoredSpellDefinitions = require(path.join(REPO_ROOT, 'server', 'services', 'authoredSpellDefinitions.js'));
const sharedConditionProfile = require(path.join(REPO_ROOT, 'server', 'shared', 'services', 'sharedConditionProfile.js'));
const spellConsequence = require(path.join(VTT_REACT_ROOT, 'src', 'services', 'spellConsequence.js'));
const classResourceContracts = require(path.join(VTT_REACT_ROOT, 'src', 'data', 'classResourceContracts.js'));
const classResourceBanks = require(path.join(VTT_REACT_ROOT, 'src', 'data', 'classResourceBanks.js'));

const CLASSIFICATIONS = Object.freeze({
  COMPATIBLE: 'compatible',
  UNSUPPORTED_CAPABILITY: 'unsupported_capability',
  AMBIGUOUS_OR_CONFLICTING: 'ambiguous_or_conflicting',
  INVALID_FOR_PROFILE: 'invalid_for_profile',
  DESCRIPTIVE_OR_PASSIVE: 'descriptive_or_passive_outside_profiles',
});

/**
 * Five distinct exclusion / boundary reasons per First-Campaign Readiness instructions.
 * Never equate "not accepted by this adapter" with "requires new architecture."
 */
const EXCLUSION_CATEGORIES = Object.freeze({
  MISSING_ENGINE_CAPABILITY: 'missing_engine_capability',
  INCOMPATIBLE_AUTHORED_SCHEMA: 'incompatible_authored_schema',
  INTENTIONAL_MANUAL_ONLY: 'intentional_manual_only',
  CONFLICTING_DATA: 'conflicting_data',
  RUNTIME_PREREQUISITES_OFFLINE_UNKNOWN: 'runtime_prerequisites_offline_unknown',
});

/**
 * Explicit governance status of each execution profile per docs/ENGINEERING_STATE.md
 * and docs/MYTHRILL_CROSS_TRACK_COORDINATION.md (Finding I4).
 *
 * Importantly, authored-effect:v1 (Opus A10) is present in working-tree source
 * but has NO completed increment/App/review acceptance handoff and must NOT be
 * marked as an accepted production-ready capability.
 */
const PROFILE_ACCEPTANCE_STATUS = Object.freeze({
  [spellConsequence.P9_CAPABILITY]: Object.freeze({
    profile: spellConsequence.P9_CAPABILITY,
    capabilityStatus: 'accepted',
    productionReady: true,
    owner: 'Combat / Sol',
    governanceNote:
      'Accepted in P9 cycle2 baseline for immediate single-target DICE damage/healing with Elemental Spheres, Musical Notes, and Devotion Gauge.',
  }),
  [authoredAbility.CAPABILITY]: Object.freeze({
    profile: authoredAbility.CAPABILITY,
    capabilityStatus: 'accepted',
    productionReady: true,
    owner: 'Opus / Sol',
    governanceNote:
      'Accepted in P14-A1..A6 baselines for room-admitted Wizard single-target immediate damage/healing (plus creature self-healing in A6).',
  }),
  [authoredAbility.CONDITION_CAPABILITY]: Object.freeze({
    profile: authoredAbility.CONDITION_CAPABILITY,
    capabilityStatus: 'accepted',
    productionReady: true,
    owner: 'Opus / Sol',
    governanceNote:
      'Accepted in P14-A7..A9 baselines for room-admitted Wizard single-target canonical Stunned with gm-manual expiry.',
  }),
  [authoredAbility.EFFECT_CAPABILITY]: Object.freeze({
    profile: authoredAbility.EFFECT_CAPABILITY,
    capabilityStatus: 'provisional_unaccepted_source',
    productionReady: false,
    owner: 'Opus',
    governanceNote:
      'Unaccepted active source work (Opus P14-A10). Present in working-tree source files, but has NO completed increment/App/review acceptance handoff (Cross-Track Finding I4). Must not be marked production-ready.',
  }),
});

const PROBE_STATS = Object.freeze({
  strength: 12,
  agility: 12,
  constitution: 12,
  intelligence: 12,
  spirit: 12,
  charisma: 12,
});

const VALIDATOR_FILES = Object.freeze([
  'vtt-react/src/services/spellConsequence.js',
  'vtt-react/src/data/classResourceContracts.js',
  'vtt-react/src/data/classResourceBanks.js',
  'server/shared/services/authoredAbility.js',
  'server/shared/services/authoredEffect.js',
  'server/services/installedDefinitionRegistry.js',
  'server/services/authoredSpellDefinitions.js',
  'server/shared/services/sharedConditionProfile.js',
]);

// Exact top-level keys accepted by P9 spellConsequence.supportShape (lines 136-138)
const P9_ALLOWED_TOP_KEYS = new Set([
  'id',
  'name',
  'description',
  'level',
  'spellType',
  'icon',
  'typeConfig',
  'targetingConfig',
  'resourceCost',
  'effectTypes',
  'damageConfig',
  'healingConfig',
  'cooldownConfig',
  'tags',
  'specialization',
  'categoryIds',
  'resolution',
  'enhancesCombo',
  'flavorText',
  'devotionRequired',
  'devotionGain',
  'devotionCost',
  'musicalCombo',
  'sphereCost',
  'durationConfig',
  'verbalText',
  'somaticText',
  'materialText',
]);

const P9_ALLOWED_TYPE_CONFIG_KEYS = new Set([
  'school',
  'icon',
  'tags',
  'castTime',
  'castTimeType',
  'element',
]);

// Catalogue / tabletop metadata keys that mark authored records as manual-only or carry non-executable metadata
const CATALOG_METADATA_KEYS = new Set([
  'classId',
  'class',
  'rulesetVersion',
  'authoredOnly',
  'manualOnly',
  'executionEnabled',
  'applicationMode',
  'automatedCapabilities',
  'manualNotice',
  'manualRequirements',
  'sourceRecordSource',
  'treeId',
  'sourceRefs',
  'tier',
  'levelRequirement',
  'unlockMethod',
]);

const P9_ALLOWED_DAMAGE_KEYS = new Set([
  'formula',
  'elementType',
  'damageTypes',
  'resolution',
  'description',
]);

const P9_ALLOWED_HEALING_KEYS = new Set([
  'formula',
  'healingType',
  'resolution',
  'description',
  'hasHotEffect',
]);

const P9_ALLOWED_TARGETING_KEYS = new Set([
  'targetingType',
  'rangeType',
  'rangeDistance',
  'targetRestrictions',
  'maxTargets',
]);

// Targeting keys that represent single-target metadata / UI hints rather than AoE/chain/multi-target capabilities
const SINGLE_TARGET_SCHEMA_METADATA_KEYS = new Set([
  'requiresLineOfSight',
  'targetSelectionMethod',
  'origin',
  'restriction',
]);

// Targeting keys that genuinely represent AoE / chain / multi-target geometry
const AOE_OR_CHAIN_TARGETING_KEYS = new Set([
  'aoeParameters',
  'aoeShape',
  'areaSize',
  'areaShape',
  'aoeType',
  'aoeSize',
  'areaType',
  'areaConfig',
  'areaRadius',
  'chainDistance',
  'maxChains',
  'lineLength',
  'lineWidth',
]);

// Validator interfaces that cannot be safely invoked in offline batch mode without live runtime/room state
const NON_REUSABLE_VALIDATOR_INTERFACES = Object.freeze([
  {
    module: 'server/services/installedAuthoredAbilities.js',
    interfaces: ['checkApproval', 'checkInstalledState', 'planInstalledExecution', 'applyInstalledExecution'],
    boundaryReason:
      'Requires a live seeded multiplayer server room (room.combatState, room.tokens, room.characterStates, room.players, room.authoredAbilityApprovals, room.installedDefinitionRegistry) and active socket/turn-clock context. Its pure definition, formula, effect, and self-healing helpers ARE reused directly from server/shared/services/authoredAbility.js, server/shared/services/authoredEffect.js, and server/services/installedDefinitionRegistry.js.',
  },
  {
    module: 'vtt-react/src/services/spellConsequence.js',
    interfaces: ['planSpellCommand', 'buildApproval', 'affordable', 'resolveOriginalSpell (for authored: runtime IDs)'],
    boundaryReason:
      'Requires live browser Zustand stores (gameStore, characterStore, combatStore, partyStore), active map token placement, roomRevision, and live player dice roll state. Its pure shape, payment, formula, hash, and catalogue-lookup helpers (supportShape, planClassPayment, readFormula, supportSpell, definitionHash) ARE reused directly.',
  },
  {
    module: 'vtt-react/src/services/itemAuthoredAbility.js',
    interfaces: ['resolveGrantedSpell', 'collectGrantedSpells'],
    boundaryReason:
      'Requires live character inventory state and room-admitted definition maps in gameStore.admittedDefinitionsById. The underlying Wizard definition validator (definitionFromWizard + compileDefinition) IS reused directly.',
  },
  {
    module: 'Non-existent execution validators (AoE, saves, buffs/debuffs, DoT/HoT/shields, summons/transforms, reactions/triggers, passives)',
    interfaces: ['none (explicitly manual-tabletop in current engine)'],
    boundaryReason:
      'No production execution validator exists for these mechanics because Mythrill intentionally gates them as manual tabletop adjudication outside p9-spell:v1 and P14 authored-immediate/condition:v1 (with authored-effect:v1 still in unaccepted source). Per instructions, no competing validator or execution engine was built.',
  },
]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasValue(value) {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (isPlainObject(value)) return Object.keys(value).length > 0 && value.enabled !== false;
  return Boolean(value);
}

function sha256File(absPath) {
  const bytes = fs.readFileSync(absPath);
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function toPosixRelative(absPath) {
  return path.relative(REPO_ROOT, absPath).split(path.sep).join('/');
}

/**
 * Builds a funded class resource probe state for offline payment inspection so that
 * spellConsequence.planClassPayment can evaluate whether a spell's payment definition
 * is supported without falsely failing only because an empty default bank has 0 spheres/notes/devotion.
 */
function buildFundedProbeClassResource(record, className, fallbackResource = null) {
  const draft = isPlainObject(record?.authoredDraft) ? record.authoredDraft : record || {};
  const managedId = classResourceContracts.getManagedResourceId(fallbackResource, className);
  if (managedId === 'elementalSpheres') {
    const extracted = classResourceBanks.extractSphereRequirementsAndGains(draft);
    const spheres =
      Array.isArray(extracted.costs) && extracted.costs.length > 0 && !extracted.costs.includes(null)
        ? [...extracted.costs]
        : ['arcane', 'arcane', 'ember', 'rime', 'primal', 'storm', 'sacred', 'blight', 'wyrd', 'wyrd'];
    return {
      type: 'elementalSpheres',
      spheres: spheres.slice(0, classResourceBanks.ARCANONEER_BANK_MAX),
    };
  }
  if (managedId === 'musicalNotes') {
    return {
      type: 'musicalNotes',
      notes: [5, 5, 5, 5, 5, 5, 5],
    };
  }
  if (managedId === 'devotionGauge') {
    return {
      type: 'devotionGauge',
      current: 6,
      max: 6,
      damage: 100,
      earnedLevels: 6,
      spentLevels: 0,
      bonusLevels: 0,
    };
  }
  return fallbackResource;
}

/**
 * Evaluates class-resource payment support in detail so a resource name alone is NEVER
 * treated as sufficient evidence of missing payment support.
 */
function evaluateResourcePaymentSupport(record, context = {}) {
  const draft = isPlainObject(record?.authoredDraft) ? record.authoredDraft : record || {};
  const className = context.className || draft.class || draft.classId || null;
  const rawResource = context.classResource || null;
  const normalizedEmpty = classResourceContracts.normalizeManagedClassResource(rawResource, className);
  const managedDomainId = classResourceContracts.getManagedResourceId(normalizedEmpty, className);
  const fundedResource = buildFundedProbeClassResource(draft, className, rawResource);
  const normalizedFunded = classResourceContracts.normalizeManagedClassResource(fundedResource, className);

  let clientPlan = { handled: false };
  try {
    clientPlan = classResourceContracts.getManagedSpellResourcePlan(draft, normalizedFunded, className);
  } catch (err) {
    clientPlan = { handled: false, error: err.message };
  }

  const p9EmptyVerdict = spellConsequence.planClassPayment(draft, rawResource, className);
  const p9FundedVerdict = spellConsequence.planClassPayment(draft, fundedResource, className);

  const rc = isPlainObject(draft.resourceCost) ? draft.resourceCost : {};
  const rv = isPlainObject(rc.resourceValues) ? rc.resourceValues : {};
  const generic = rc.classResource ?? rv.classResource;

  const allowedValueKey = (key) =>
    ['mana', 'classResource', 'devotion_cost', 'devotion_required', 'devotion_gain'].includes(key) ||
    /_sphere$/i.test(key) ||
    /^note_/i.test(key);
  const nonP9ResourceValueKeys = Object.keys(rv).filter((key) => !allowedValueKey(key));

  const domainInP9 = spellConsequence.SUPPORTED_DOMAINS.includes(managedDomainId || 'none');

  let paymentStatus = 'no_class_resource';
  let exclusionCategory = null;

  if (p9FundedVerdict.supported) {
    if (p9FundedVerdict.domain === 'none' && nonP9ResourceValueKeys.length === 0) {
      paymentStatus = 'no_class_resource';
    } else if (nonP9ResourceValueKeys.length > 0) {
      paymentStatus = 'supported_domain_with_extra_resource_value_keys';
      exclusionCategory = EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY;
    } else {
      paymentStatus = 'supported_p9_payment';
      if (!p9EmptyVerdict.affordable) {
        exclusionCategory = EXCLUSION_CATEGORIES.RUNTIME_PREREQUISITES_OFFLINE_UNKNOWN;
      }
    }
  } else {
    const reason = p9FundedVerdict.reason || '';
    if (/disagree|creator resolution required/i.test(reason)) {
      paymentStatus = 'conflicting_resource_encoding';
      exclusionCategory = EXCLUSION_CATEGORIES.CONFLICTING_DATA;
    } else if (
      clientPlan.handled &&
      domainInP9 &&
      isPlainObject(generic) &&
      Object.keys(generic).some((k) => !['type', 'cost', 'gain'].includes(k))
    ) {
      // E.g. Minstrel cadence spells where getManagedSpellResourcePlan handles musicalCombo.requires,
      // but resourceValues.classResource includes { resolvesCadence: true }
      paymentStatus = 'supported_domain_schema_extra_keys';
      exclusionCategory = EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA;
    } else if (clientPlan.handled && !domainInP9) {
      paymentStatus = 'client_contract_only_no_p9_room_home';
      exclusionCategory = EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY;
    } else {
      paymentStatus = 'unsupported_class_resource_mechanic';
      exclusionCategory = EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY;
    }
  }

  return {
    managedDomainId: managedDomainId || 'none',
    domainSupportedInP9: domainInP9,
    clientResourcePlannerHandled: Boolean(clientPlan.handled),
    clientPlannedCosts: clientPlan.costs || (clientPlan.cost !== undefined ? clientPlan.cost : null),
    clientPlannedGains: clientPlan.gains || (clientPlan.gain !== undefined ? clientPlan.gain : null),
    clientPlannedRequired: clientPlan.required !== undefined ? clientPlan.required : null,
    p9EmptyBankVerdict: {
      supported: p9EmptyVerdict.supported,
      affordableOfflineDefault: Boolean(p9EmptyVerdict.affordable),
      domain: p9EmptyVerdict.domain || null,
      reason: p9EmptyVerdict.reason || null,
    },
    p9FundedBankVerdict: {
      supported: p9FundedVerdict.supported,
      affordableWhenFunded: Boolean(p9FundedVerdict.affordable),
      domain: p9FundedVerdict.domain || null,
      reason: p9FundedVerdict.reason || null,
      classPayment: p9FundedVerdict.classPayment || null,
    },
    nonP9ResourceValueKeys,
    paymentStatus,
    exclusionCategory,
  };
}

/**
 * Builds a cryptographic identity snapshot of all production validator modules
 * so later engine changes can invalidate stale compatibility reports.
 */
function buildValidatorIdentity() {
  const modules = VALIDATOR_FILES.map((relPath) => {
    const absPath = path.join(REPO_ROOT, relPath);
    const stat = fs.statSync(absPath);
    return {
      file: relPath,
      sha256: sha256File(absPath),
      bytes: stat.size,
    };
  });

  const acceptedProfiles = [
    spellConsequence.P9_CAPABILITY,
    authoredAbility.CAPABILITY,
    authoredAbility.CONDITION_CAPABILITY,
  ];
  const provisionalSourceProfiles = [authoredAbility.EFFECT_CAPABILITY];
  const supportedProfiles = [...acceptedProfiles, ...provisionalSourceProfiles];

  const bundleHash = crypto
    .createHash('sha256')
    .update(JSON.stringify({ modules, acceptedProfiles, provisionalSourceProfiles }))
    .digest('hex');

  return {
    validatorBundleHash: bundleHash,
    supportedProfiles,
    acceptedProfiles,
    provisionalSourceProfiles,
    profileAcceptanceStatus: PROFILE_ACCEPTANCE_STATUS,
    p9SupportedResourceDomains: [...spellConsequence.SUPPORTED_DOMAINS],
    a10ExpiryPolicies: Object.keys(authoredEffect.POLICY_TEXT || {}),
    modules,
  };
}

/**
 * Locates the 1-based line number of a record's id (or CR1 suffix / name) inside a source file.
 */
function findRecordLineInFile(absFilePath, recordId, recordName) {
  if (!absFilePath || !recordId || !fs.existsSync(absFilePath)) return null;
  const content = fs.readFileSync(absFilePath, 'utf8');
  const lines = content.split(/\r?\n/);

  const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const exactIdRegex = new RegExp(`(?:["']?id["']?\\s*:\\s*["']${escapeRegex(recordId)}["'])`);
  for (let i = 0; i < lines.length; i += 1) {
    if (exactIdRegex.test(lines[i])) return i + 1;
  }

  // Fallback for builder-generated IDs (e.g. cr1_doomsayer_doom_bolt -> suffix 'doom_bolt')
  const cr1Match = String(recordId).match(/^cr1_[a-z0-9_]+?_([a-z0-9_]+)$/i);
  if (cr1Match) {
    const suffixRegex = new RegExp(`["']${escapeRegex(cr1Match[1])}["']`);
    for (let i = 0; i < lines.length; i += 1) {
      if (suffixRegex.test(lines[i])) return i + 1;
    }
  }

  if (recordName) {
    const nameRegex = new RegExp(`["']${escapeRegex(recordName)}["']`);
    for (let i = 0; i < lines.length; i += 1) {
      if (nameRegex.test(lines[i])) return i + 1;
    }
  }

  return null;
}

/**
 * Extracts exact preserved zero/explicit authoring values without normalizing.
 */
function extractPreservedValues(record) {
  if (!isPlainObject(record)) return {};
  const draft = isPlainObject(record.authoredDraft) ? record.authoredDraft : record;
  const rc = isPlainObject(draft.resourceCost) ? draft.resourceCost : {};
  const rv = isPlainObject(rc.resourceValues) ? rc.resourceValues : {};
  const tc = isPlainObject(draft.targetingConfig) ? draft.targetingConfig : {};

  return {
    actionPoints: rc.actionPoints,
    resourceValuesActionPoints: rv.actionPoints,
    mana: rc.mana,
    resourceValuesMana: rv.mana,
    rangeDistance: tc.rangeDistance !== undefined ? tc.rangeDistance : tc.range,
    rangeType: tc.rangeType,
    targetingType: tc.targetingType,
    targetRestrictions: Array.isArray(tc.targetRestrictions)
      ? [...tc.targetRestrictions]
      : Array.isArray(tc.validTargets)
      ? [...tc.validTargets]
      : undefined,
    maxTargets: tc.maxTargets,
  };
}

function isWizardAuthoredRecord(record, options = {}) {
  if (options.profileMode === 'wizard') return true;
  if (options.profileMode === 'class') return false;
  if (!isPlainObject(record)) return false;
  return Boolean(
    isPlainObject(record.authoredDraft) ||
      typeof record.authoredDefinitionId === 'string' ||
      isPlainObject(record.serializedData) ||
      isPlainObject(record.controlConfig?.authoredCondition)
  );
}

function isPassiveOrDescriptiveRecord(record) {
  if (!isPlainObject(record)) return false;
  const draft = isPlainObject(record.authoredDraft) ? record.authoredDraft : record;
  const spellType = typeof draft.spellType === 'string' ? draft.spellType.trim().toUpperCase() : '';
  if (spellType === 'PASSIVE' || draft.isPassive === true || draft.nodeType === 'passive') {
    return true;
  }
  const effectTypes = Array.isArray(draft.effectTypes) ? draft.effectTypes : [];
  if (effectTypes.length > 0 && effectTypes.every((t) => String(t).toLowerCase() === 'passive')) {
    return true;
  }
  return false;
}

/**
 * Performs whole-record inspection to identify ALL concrete incompatibilities,
 * keeping the five exclusion categories strictly distinct:
 * - missing_engine_capability
 * - incompatible_authored_schema
 * - intentional_manual_only
 * - conflicting_data
 * - runtime_prerequisites_offline_unknown
 */
function inspectWholeRecordMechanics(record, context = {}) {
  const incompatibilities = [];
  const capabilityDependencies = new Map();
  const schemaAdaptationDependencies = new Map();
  const structuralIssues = [];
  const conflicts = [];
  const invalidProfileIssues = [];

  const addDependencyToMap = (map, group, detail, field, exclusionCategory) => {
    if (!map.has(group)) {
      map.set(group, []);
    }
    const list = map.get(group);
    const entry = {
      detail,
      field: field || null,
      exclusionCategory: exclusionCategory || EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY,
    };
    if (!list.some((item) => item.detail === entry.detail && item.field === entry.field)) {
      list.push(entry);
    }
  };

  const addIncompatibility = (
    code,
    message,
    field,
    capabilityGroup,
    exclusionCategory = EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
  ) => {
    incompatibilities.push({
      code,
      message,
      field: field || null,
      capabilityGroup: capabilityGroup || null,
      exclusionCategory,
    });
    if (capabilityGroup) {
      if (
        exclusionCategory === EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA ||
        exclusionCategory === EXCLUSION_CATEGORIES.INTENTIONAL_MANUAL_ONLY
      ) {
        addDependencyToMap(schemaAdaptationDependencies, capabilityGroup, message, field, exclusionCategory);
      }
      addDependencyToMap(capabilityDependencies, capabilityGroup, message, field, exclusionCategory);
    }
  };

  if (!isPlainObject(record)) {
    structuralIssues.push('Record must be a plain object.');
    return {
      structuralIssues,
      conflicts,
      invalidProfileIssues,
      incompatibilities,
      capabilityDependencies: Object.fromEntries(capabilityDependencies),
      schemaAdaptationDependencies: Object.fromEntries(schemaAdaptationDependencies),
      resourcePaymentAnalysis: null,
    };
  }

  const wizardMode = isWizardAuthoredRecord(record, context);
  const draft = wizardMode && isPlainObject(record.authoredDraft) ? record.authoredDraft : record;

  // 1. Basic structural checks
  if (typeof record.id !== 'string' || !record.id.trim()) {
    structuralIssues.push('Missing or non-string record id.');
  }
  if (typeof (record.name || draft.name) !== 'string' || !String(record.name || draft.name).trim()) {
    structuralIssues.push('Missing or non-string ability name.');
  }
  const spellType = typeof draft.spellType === 'string' ? draft.spellType.trim().toUpperCase() : '';
  if (!spellType) {
    structuralIssues.push('Missing spellType on record.');
  }

  if (draft.typeConfig !== undefined && !isPlainObject(draft.typeConfig)) {
    structuralIssues.push('typeConfig must be an object when present.');
  }
  if (draft.targetingConfig !== undefined && !isPlainObject(draft.targetingConfig)) {
    structuralIssues.push('targetingConfig must be an object when present.');
  }
  if (draft.resourceCost !== undefined && !isPlainObject(draft.resourceCost)) {
    structuralIssues.push('resourceCost must be an object when present.');
  }

  // If passive/descriptive, skip active execution capability checks
  if (isPassiveOrDescriptiveRecord(record)) {
    return {
      structuralIssues,
      conflicts,
      invalidProfileIssues,
      incompatibilities,
      capabilityDependencies: Object.fromEntries(capabilityDependencies),
      schemaAdaptationDependencies: Object.fromEntries(schemaAdaptationDependencies),
      resourcePaymentAnalysis: null,
    };
  }

  // 2. Check explicit manual-only / CR1 / legacy-roster catalogue metadata envelope
  const presentCatalogFlags = Object.keys(draft).filter((k) => CATALOG_METADATA_KEYS.has(k));
  const explicitManualDesignation =
    draft.manualOnly === true ||
    draft.authoredOnly === true ||
    draft.executionEnabled === false ||
    draft.applicationMode === 'manual-tabletop';

  if (explicitManualDesignation) {
    addIncompatibility(
      'MANUAL_TABLETOP_ENVELOPE',
      `Intentionally designated manual-tabletop (${presentCatalogFlags.join(', ')}); gated outside P9 automated execution by design.`,
      presentCatalogFlags[0] || 'manualOnly',
      'manual-tabletop-envelope-and-catalog-metadata',
      EXCLUSION_CATEGORIES.INTENTIONAL_MANUAL_ONLY
    );
  } else if (presentCatalogFlags.length > 0 && !wizardMode) {
    addIncompatibility(
      'CATALOG_METADATA_EXTRA_KEYS',
      `Record carries catalogue metadata keys (${presentCatalogFlags.join(', ')}) rejected by P9 supportShape.`,
      presentCatalogFlags[0],
      'schema-inert-or-metadata-envelope-keys',
      EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
    );
  }

  // 3. Check spellType and castTimeType
  if (spellType && spellType !== 'ACTION') {
    if (spellType === 'REACTION' || spellType === 'TRAP') {
      addIncompatibility(
        'NON_ACTION_SPELL_TYPE',
        `spellType "${spellType}" requires reaction/trigger window execution outside immediate ACTION profiles.`,
        'spellType',
        'reaction-and-event-trigger-windows',
        EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
      );
    } else if (spellType === 'CHANNELED' || spellType === 'STATE' || spellType === 'ZONE') {
      addIncompatibility(
        'SUSTAINED_SPELL_TYPE',
        `spellType "${spellType}" requires sustained state/zone/channel lifecycle management.`,
        'spellType',
        'turn-and-duration-lifecycle',
        EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
      );
    } else {
      addIncompatibility(
        'UNSUPPORTED_SPELL_TYPE',
        `spellType "${spellType}" is outside immediate ACTION execution.`,
        'spellType',
        'turn-and-duration-lifecycle',
        EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
      );
    }
  }

  const castTimeType = draft.typeConfig?.castTimeType;
  if (castTimeType !== undefined && castTimeType !== 'IMMEDIATE') {
    addIncompatibility(
      'NON_IMMEDIATE_CAST_TIME',
      `typeConfig.castTimeType "${castTimeType}" requires non-immediate or multi-turn cast timing.`,
      'typeConfig.castTimeType',
      castTimeType === 'REACTION' ? 'reaction-and-event-trigger-windows' : 'turn-and-duration-lifecycle',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }

  if (!wizardMode && isPlainObject(draft.typeConfig)) {
    const extraTypeConfigKeys = Object.keys(draft.typeConfig).filter(
      (k) => !P9_ALLOWED_TYPE_CONFIG_KEYS.has(k)
    );
    if (extraTypeConfigKeys.length > 0) {
      addIncompatibility(
        'TYPE_CONFIG_EXTRA_SCHEMA_KEYS',
        `typeConfig contains extra metadata keys (${extraTypeConfigKeys.join(', ')}) rejected by P9 supportShape.`,
        'typeConfig',
        'schema-inert-or-metadata-envelope-keys',
        EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
      );
    }
  }

  // 4. Check durationConfig — strictly separate structured instant-duration envelopes from lifecycle requirements!
  if (draft.durationConfig !== undefined && draft.durationConfig !== null) {
    if (!isPlainObject(draft.durationConfig)) {
      invalidProfileIssues.push('durationConfig must be an object when present.');
    } else {
      const durType = draft.durationConfig.durationType || draft.durationConfig.type;
      const durVal =
        draft.durationConfig.durationValue !== undefined
          ? draft.durationConfig.durationValue
          : draft.durationConfig.duration;
      const durUnit = draft.durationConfig.durationUnit || draft.durationConfig.unit;
      const durKeys = Object.keys(draft.durationConfig);

      const isInstantSemantics =
        durType === 'instant' ||
        (durUnit === 'instant' && (durVal === 0 || durVal === undefined)) ||
        (durType === 'rounds' && durVal === 0 && !draft.durationConfig.concentrationRequired);

      if (!isInstantSemantics && durType) {
        addIncompatibility(
          'NON_INSTANT_DURATION',
          `durationConfig (${durType}${durVal !== undefined ? `: ${durVal}` : ''}${
            durUnit && durUnit !== durType ? ` ${durUnit}` : ''
          }) requires persistent turn/round duration tracking.`,
          'durationConfig',
          'turn-and-duration-lifecycle',
          EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
        );
      } else if (
        !wizardMode &&
        (durKeys.length > 1 || (durKeys.length === 1 && durKeys[0] !== 'durationType') || durType !== 'instant')
      ) {
        // Structured instant envelope such as { durationType: 'instant', durationValue: 0, durationUnit: 'instant' }
        // This is an EXISTING instant capability with an incompatible authored schema envelope, NOT a lifecycle requirement!
        addIncompatibility(
          'STRUCTURED_INSTANT_DURATION_SCHEMA',
          `durationConfig (${JSON.stringify(
            draft.durationConfig
          )}) has instant semantics but includes extra schema keys beyond canonical {"durationType":"instant"}.`,
          'durationConfig',
          'schema-instant-duration-envelope',
          EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
        );
      }
    }
  }

  // 5. Check targetingConfig & propagation — strictly separate single-actor self-targeting & single-target metadata keys from AoE/chain/multi-target!
  const tc = isPlainObject(draft.targetingConfig) ? draft.targetingConfig : {};
  const targetingType = tc.targetingType;
  const extraTargetingKeys = Object.keys(tc).filter((k) => !P9_ALLOWED_TARGETING_KEYS.has(k));
  const aoeTargetingKeys = extraTargetingKeys.filter((k) => AOE_OR_CHAIN_TARGETING_KEYS.has(k));
  const metadataTargetingKeys = extraTargetingKeys.filter((k) => !AOE_OR_CHAIN_TARGETING_KEYS.has(k));

  const hasActivePropagation =
    hasValue(draft.propagation) &&
    (!isPlainObject(draft.propagation) || (draft.propagation.method && draft.propagation.method !== 'none'));
  const hasActiveArea = hasValue(draft.area);

  if (targetingType === 'self') {
    const isSingleActorSelf =
      aoeTargetingKeys.length === 0 &&
      !hasActiveArea &&
      !hasActivePropagation &&
      (tc.maxTargets === undefined || tc.maxTargets === 1);

    if (isSingleActorSelf) {
      addIncompatibility(
        'SELF_TARGETING_SINGLE_ACTOR',
        'targetingConfig.targetingType is "self" (single-actor self target; P9 supportShape requires targetingType: "single" with targetRestrictions: ["self"], and P14-A6 supports creatureSelfHealing only on single-target healing).',
        'targetingConfig.targetingType',
        'self-target-schema-or-route',
        EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
      );
    } else {
      addIncompatibility(
        'SELF_ORIGIN_AREA_TARGETING',
        `targetingConfig.targetingType "self" is combined with AoE/multi-target parameters (${aoeTargetingKeys.join(', ') || 'maxTargets/area'}).`,
        'targetingConfig.targetingType',
        'area-chain-and-multi-target-routing',
        EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
      );
    }
  } else if (targetingType !== 'single') {
    addIncompatibility(
      'NON_SINGLE_TARGETING',
      `targetingConfig.targetingType "${targetingType || 'missing'}" requires area/multi/point/chain target resolution.`,
      'targetingConfig.targetingType',
      'area-chain-and-multi-target-routing',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }

  if (tc.maxTargets !== undefined && tc.maxTargets !== 1) {
    addIncompatibility(
      'MULTI_TARGET_COUNT',
      `targetingConfig.maxTargets (${tc.maxTargets}) exceeds single-target limit (1).`,
      'targetingConfig.maxTargets',
      'area-chain-and-multi-target-routing',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }

  if (aoeTargetingKeys.length > 0) {
    addIncompatibility(
      'EXTENDED_AOE_TARGETING_FIELDS',
      `targetingConfig uses AoE/chain geometry fields (${aoeTargetingKeys.join(', ')}).`,
      'targetingConfig',
      'area-chain-and-multi-target-routing',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }

  if (!wizardMode && metadataTargetingKeys.length > 0) {
    addIncompatibility(
      'SINGLE_TARGET_SCHEMA_EXTRA_KEYS',
      `targetingConfig includes non-AoE metadata keys (${metadataTargetingKeys.join(
        ', '
      )}) rejected by P9 supportShape's key whitelist.`,
      'targetingConfig',
      'schema-single-target-metadata-keys',
      EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
    );
  }

  if (hasActivePropagation || hasActiveArea) {
    addIncompatibility(
      'PROPAGATION_OR_AREA_SPEC',
      `Record defines ${hasActivePropagation ? 'propagation' : 'area'} routing outside single-target execution.`,
      hasActivePropagation ? 'propagation' : 'area',
      'area-chain-and-multi-target-routing',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }

  if (tc.rangeDistance !== undefined && (!Number.isInteger(tc.rangeDistance) || tc.rangeDistance < 0)) {
    invalidProfileIssues.push(`targetingConfig.rangeDistance (${tc.rangeDistance}) must be a non-negative integer.`);
  }

  // Check inert/null top-level schema keys on non-manual class records (e.g. conditions: [], savingThrow: null, area: null)
  if (!wizardMode && !explicitManualDesignation) {
    const inertTopKeys = [];
    if ('conditions' in draft && Array.isArray(draft.conditions) && draft.conditions.length === 0) {
      inertTopKeys.push('conditions: []');
    }
    if ('savingThrow' in draft && !hasValue(draft.savingThrow)) {
      inertTopKeys.push('savingThrow: null');
    }
    if ('reactionTiming' in draft && !hasValue(draft.reactionTiming)) {
      inertTopKeys.push('reactionTiming: null');
    }
    if ('area' in draft && !hasValue(draft.area)) {
      inertTopKeys.push('area: null');
    }
    if (inertTopKeys.length > 0) {
      addIncompatibility(
        'INERT_TOP_LEVEL_SCHEMA_KEYS',
        `Record carries empty/null top-level schema keys (${inertTopKeys.join(', ')}) rejected by P9 supportShape.`,
        'topLevel',
        'schema-inert-or-metadata-envelope-keys',
        EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
      );
    }
  }

  // 6. Check effectTypes and secondary/mixed effect configs across the WHOLE record
  const effectTypes = Array.isArray(draft.effectTypes) ? draft.effectTypes : [];
  if (effectTypes.length === 0) {
    invalidProfileIssues.push('effectTypes must be a non-empty array.');
  }

  const hasWizardConditionProfile =
    draft.controlConfig?.authoredCondition?.profile === authoredAbility.CONDITION_CAPABILITY;
  const hasWizardEffectProfile =
    draft.controlConfig?.authoredCondition?.profile === authoredAbility.EFFECT_CAPABILITY;

  for (const eff of effectTypes) {
    if (eff === 'damage' || eff === 'healing') continue;
    if (eff === 'control' && (hasWizardConditionProfile || hasWizardEffectProfile)) continue;
    if (eff === 'buff' || eff === 'debuff' || eff === 'defense' || eff === 'defensive') {
      addIncompatibility(
        `EFFECT_TYPE_${String(eff).toUpperCase()}`,
        `effectTypes includes "${eff}", requiring stat/status buff or debuff execution.`,
        'effectTypes',
        'stat-buff-debuff-and-status-effects',
        EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
      );
    } else if (eff === 'control') {
      addIncompatibility(
        'EFFECT_TYPE_CONTROL_UNPROFILED',
        'effectTypes includes "control" without a canonical Wizard authored-condition:v1 profile.',
        'effectTypes',
        'control-and-forced-movement-primitives',
        EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
      );
    } else {
      addIncompatibility(
        `EFFECT_TYPE_${String(eff).toUpperCase()}`,
        `effectTypes includes "${eff}", which is outside immediate damage/healing/condition execution.`,
        'effectTypes',
        'summon-transformation-zone-and-utility-primitives',
        EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
      );
    }
  }

  if (effectTypes.includes('damage') && effectTypes.includes('healing')) {
    addIncompatibility(
      'MIXED_DAMAGE_AND_HEALING',
      'Simultaneous damage + healing on the same record is outside single-consequence execution profiles.',
      'effectTypes',
      'summon-transformation-zone-and-utility-primitives',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }

  // Check secondary config blocks even if effectTypes omitted them
  if (hasValue(draft.buffConfig)) {
    addIncompatibility(
      'BUFF_CONFIG_PRESENT',
      'Record includes buffConfig (stat modifiers / status buffs / temporary immunities).',
      'buffConfig',
      'stat-buff-debuff-and-status-effects',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.debuffConfig)) {
    addIncompatibility(
      'DEBUFF_CONFIG_PRESENT',
      'Record includes debuffConfig (status debuffs / stat penalties / self-recoil).',
      'debuffConfig',
      'stat-buff-debuff-and-status-effects',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.controlConfig) && !hasWizardConditionProfile && !hasWizardEffectProfile) {
    addIncompatibility(
      'CONTROL_CONFIG_UNPROFILED',
      'Record includes controlConfig without an explicit accepted authored-condition:v1 profile.',
      'controlConfig',
      'control-and-forced-movement-primitives',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (Array.isArray(draft.conditions) && draft.conditions.length > 0) {
    addIncompatibility(
      'CONDITIONS_ARRAY_PRESENT',
      `Record includes conditions array (${draft.conditions.length} condition entry/entries) outside Wizard condition profiles.`,
      'conditions',
      'control-and-forced-movement-primitives',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.summoningConfig) || hasValue(draft.summonConfig)) {
    addIncompatibility(
      'SUMMONING_CONFIG_PRESENT',
      'Record includes summoningConfig (entity summoning and companion lifecycle).',
      'summoningConfig',
      'summon-transformation-zone-and-utility-primitives',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.transformationConfig)) {
    addIncompatibility(
      'TRANSFORMATION_CONFIG_PRESENT',
      'Record includes transformationConfig (form state, stat overrides, or granted form abilities).',
      'transformationConfig',
      'summon-transformation-zone-and-utility-primitives',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.utilityConfig)) {
    addIncompatibility(
      'UTILITY_CONFIG_PRESENT',
      'Record includes utilityConfig (teleportation, terrain, sensing, interception, or utility actions).',
      'utilityConfig',
      'summon-transformation-zone-and-utility-primitives',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.purificationConfig) || hasValue(draft.restorationConfig)) {
    addIncompatibility(
      'CLEANSE_OR_RESTORATION_CONFIG',
      'Record includes purificationConfig or restorationConfig (condition cleanse / resource restoration).',
      hasValue(draft.purificationConfig) ? 'purificationConfig' : 'restorationConfig',
      'summon-transformation-zone-and-utility-primitives',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.trapConfig)) {
    addIncompatibility(
      'TRAP_CONFIG_PRESENT',
      'Record includes trapConfig (placed battlefield hazards/triggers).',
      'trapConfig',
      'reaction-and-event-trigger-windows',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.channelingConfig)) {
    addIncompatibility(
      'CHANNELING_CONFIG_PRESENT',
      'Record includes channelingConfig (multi-round concentration/channel ticks).',
      'channelingConfig',
      'turn-and-duration-lifecycle',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.triggerConfig) || hasValue(draft.triggers) || hasValue(draft.reactionTiming)) {
    addIncompatibility(
      'TRIGGER_OR_REACTION_HOOKS',
      'Record includes triggerConfig/triggers/reactionTiming event hooks.',
      hasValue(draft.triggerConfig) ? 'triggerConfig' : hasValue(draft.triggers) ? 'triggers' : 'reactionTiming',
      'reaction-and-event-trigger-windows',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.rollableTable)) {
    addIncompatibility(
      'ROLLABLE_TABLE_PRESENT',
      'Record includes rollableTable random outcome resolution.',
      'rollableTable',
      'critical-auto-hit-and-alt-resolution',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (
    hasValue(draft.specialMechanics) ||
    hasValue(draft.mechanicsConfig) ||
    hasValue(draft.classResourceProgram)
  ) {
    const fieldName = hasValue(draft.classResourceProgram)
      ? 'classResourceProgram'
      : hasValue(draft.specialMechanics)
      ? 'specialMechanics'
      : 'mechanicsConfig';
    addIncompatibility(
      'CUSTOM_CLASS_MECHANICS_BLOCK',
      `Record includes ${fieldName} bespoke class state-machine/threshold mechanics.`,
      fieldName,
      'class-resource-room-payment-home',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.permanentCost)) {
    addIncompatibility(
      'PERMANENT_COST_EROSION',
      'Record includes permanentCost (max HP erosion or long-rest stat tax).',
      'permanentCost',
      'class-resource-room-payment-home',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }
  if (hasValue(draft.savingThrow)) {
    addIncompatibility(
      'TOP_LEVEL_SAVING_THROW',
      'Record includes top-level savingThrow specification.',
      'savingThrow',
      'saving-throw-and-partial-mitigation',
      EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
    );
  }

  // 7. Inspect damageConfig & healingConfig details and formula validity
  const hasDamageType = effectTypes.includes('damage');
  const hasHealingType = effectTypes.includes('healing');

  if (!hasDamageType && hasValue(draft.damageConfig)) {
    conflicts.push('damageConfig is present on a record whose effectTypes does not include "damage".');
  }
  if (!hasHealingType && hasValue(draft.healingConfig)) {
    conflicts.push('healingConfig is present on a record whose effectTypes does not include "healing".');
  }

  const hasManualEffectCarrier = Boolean(
    draft.manualOnly === true ||
      hasValue(draft.manualMechanics) ||
      hasValue(draft.classResourceProgram) ||
      hasValue(draft.rollableTable) ||
      hasValue(draft.effects)
  );

  if (hasDamageType) {
    if (!isPlainObject(draft.damageConfig)) {
      if (hasManualEffectCarrier) {
        addIncompatibility(
          'DELEGATED_MANUAL_DAMAGE_SPEC',
          'effectTypes includes "damage" resolved via manualMechanics/classResourceProgram rather than damageConfig.',
          'damageConfig',
          'manual-tabletop-envelope-and-catalog-metadata',
          EXCLUSION_CATEGORIES.INTENTIONAL_MANUAL_ONLY
        );
      } else {
        invalidProfileIssues.push('effectTypes includes "damage" but damageConfig is missing or not an object.');
      }
    } else {
      const dc = draft.damageConfig;
      if (typeof dc.formula !== 'string' || !dc.formula.trim()) {
        invalidProfileIssues.push('damageConfig.formula is missing or empty.');
      }
      if (dc.resolution !== undefined && dc.resolution !== 'DICE') {
        addIncompatibility(
          'NON_DICE_DAMAGE_RESOLUTION',
          `damageConfig.resolution "${dc.resolution}" is not DICE.`,
          'damageConfig.resolution',
          'critical-auto-hit-and-alt-resolution',
          EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
        );
      }
      if (draft.resolution !== undefined && dc.resolution !== undefined && draft.resolution !== dc.resolution) {
        conflicts.push(`Top-level resolution (${draft.resolution}) disagrees with damageConfig.resolution (${dc.resolution}).`);
      }
      if (dc.hasDotEffect === true || dc.dotConfig !== undefined || dc.damageType === 'dot') {
        addIncompatibility(
          'DAMAGE_OVER_TIME',
          'damageConfig includes damage-over-time (DoT) mechanics.',
          'damageConfig.hasDotEffect',
          'periodic-dot-hot-and-absorption-shields',
          EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
        );
      }
      if (dc.savingThrow !== undefined || dc.savingThrowConfig !== undefined) {
        addIncompatibility(
          'DAMAGE_SAVING_THROW',
          'damageConfig includes savingThrow / savingThrowConfig mitigation.',
          'damageConfig.savingThrow',
          'saving-throw-and-partial-mitigation',
          EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
        );
      }
      if (dc.criticalConfig !== undefined || dc.canCrit !== undefined || dc.critMultiplier !== undefined) {
        addIncompatibility(
          'DAMAGE_CRITICAL_CONFIG',
          'damageConfig includes custom critical hit rules (criticalConfig / canCrit / critMultiplier).',
          'damageConfig.criticalConfig',
          'critical-auto-hit-and-alt-resolution',
          EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
        );
      }
      if (dc.chanceOnHitConfig !== undefined) {
        addIncompatibility(
          'DAMAGE_CHANCE_ON_HIT',
          'damageConfig includes chanceOnHitConfig secondary proc.',
          'damageConfig.chanceOnHitConfig',
          'critical-auto-hit-and-alt-resolution',
          EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
        );
      }
      if (dc.autoHit !== undefined) {
        // Note: P9 does not roll attack/defense and relies on GM confirmation, so autoHit: true is
        // either a schema flag rejected by supportShape or an accuracy bypass if attack rolls are added.
        addIncompatibility(
          'DAMAGE_AUTOHIT_FLAG',
          'damageConfig includes autoHit flag (rejected by P9 supportShape damageConfig key whitelist).',
          'damageConfig.autoHit',
          'schema-damage-or-healing-extra-keys',
          EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
        );
      }
      if (!wizardMode && dc.scalingType === 'none') {
        addIncompatibility(
          'INERT_DAMAGE_SCALING_TYPE_NONE',
          'damageConfig includes inert scalingType: "none" rejected by P9 supportShape.',
          'damageConfig.scalingType',
          'schema-damage-or-healing-extra-keys',
          EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
        );
      }
      const extraDamageKeys = Object.keys(dc).filter(
        (k) => !P9_ALLOWED_DAMAGE_KEYS.has(k) && !(wizardMode && (k === 'globalResolution' || k === 'damageType'))
      );
      for (const k of extraDamageKeys) {
        if (
          ![
            'hasDotEffect',
            'dotConfig',
            'savingThrow',
            'savingThrowConfig',
            'criticalConfig',
            'canCrit',
            'critMultiplier',
            'autoHit',
            'chanceOnHitConfig',
          ].includes(k) &&
          !(k === 'scalingType' && dc.scalingType === 'none')
        ) {
          addIncompatibility(
            'EXTENDED_DAMAGE_FIELD',
            `damageConfig field "${k}" is not executed by immediate damage profiles.`,
            `damageConfig.${k}`,
            'critical-auto-hit-and-alt-resolution',
            EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
          );
        }
      }
    }
  }

  if (hasHealingType) {
    if (!isPlainObject(draft.healingConfig)) {
      if (hasManualEffectCarrier) {
        addIncompatibility(
          'DELEGATED_MANUAL_HEALING_SPEC',
          'effectTypes includes "healing" resolved via manualMechanics/classResourceProgram rather than healingConfig.',
          'healingConfig',
          'manual-tabletop-envelope-and-catalog-metadata',
          EXCLUSION_CATEGORIES.INTENTIONAL_MANUAL_ONLY
        );
      } else {
        invalidProfileIssues.push('effectTypes includes "healing" but healingConfig is missing or not an object.');
      }
    } else {
      const hc = draft.healingConfig;
      if (typeof hc.formula !== 'string' || !hc.formula.trim()) {
        invalidProfileIssues.push('healingConfig.formula is missing or empty.');
      }
      if (hc.resolution !== undefined && hc.resolution !== 'DICE') {
        addIncompatibility(
          'NON_DICE_HEALING_RESOLUTION',
          `healingConfig.resolution "${hc.resolution}" is not DICE.`,
          'healingConfig.resolution',
          'critical-auto-hit-and-alt-resolution',
          EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
        );
      }
      if (draft.resolution !== undefined && hc.resolution !== undefined && draft.resolution !== hc.resolution) {
        conflicts.push(`Top-level resolution (${draft.resolution}) disagrees with healingConfig.resolution (${hc.resolution}).`);
      }
      if (hc.hasHotEffect === true || hc.hotConfig !== undefined || hc.healingType === 'hot') {
        addIncompatibility(
          'HEALING_OVER_TIME',
          'healingConfig includes healing-over-time (HoT) mechanics.',
          'healingConfig.hasHotEffect',
          'periodic-dot-hot-and-absorption-shields',
          EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
        );
      }
      if (
        hc.hasShieldEffect === true ||
        hc.shieldConfig !== undefined ||
        hc.healingType === 'shield' ||
        hc.overhealBecomesShield === true
      ) {
        addIncompatibility(
          'ABSORPTION_SHIELD_HEALING',
          'healingConfig includes temporary HP / absorption shield mechanics.',
          'healingConfig.hasShieldEffect',
          'periodic-dot-hot-and-absorption-shields',
          EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
        );
      }
      if (hc.criticalConfig !== undefined || hc.savingThrow !== undefined || hc.savingThrowConfig !== undefined) {
        addIncompatibility(
          'HEALING_CRIT_OR_SAVE',
          'healingConfig includes criticalConfig or savingThrowConfig.',
          'healingConfig',
          'critical-auto-hit-and-alt-resolution',
          EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
        );
      }
      const extraHealingKeys = Object.keys(hc).filter(
        (k) => !P9_ALLOWED_HEALING_KEYS.has(k) && !(wizardMode && k === 'globalResolution')
      );
      for (const k of extraHealingKeys) {
        if (
          ![
            'hasShieldEffect',
            'hotConfig',
            'shieldConfig',
            'overhealBecomesShield',
            'criticalConfig',
            'savingThrow',
            'savingThrowConfig',
          ].includes(k)
        ) {
          addIncompatibility(
            'EXTENDED_HEALING_FIELD',
            `healingConfig field "${k}" is not executed by immediate healing profiles.`,
            `healingConfig.${k}`,
            'periodic-dot-hot-and-absorption-shields',
            EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
          );
        }
      }
    }
  }

  // 8. Formula check via production validators
  const formulaStr = hasDamageType
    ? draft.damageConfig?.formula
    : hasHealingType
    ? draft.healingConfig?.formula
    : null;

  if (typeof formulaStr === 'string' && formulaStr.trim()) {
    if (wizardMode) {
      let wizFormulaOk = false;
      let wizFormulaErr = null;
      try {
        authoredAbility.readFormula(formulaStr);
        wizFormulaOk = true;
      } catch (err) {
        wizFormulaErr = err.message;
      }
      if (!wizFormulaOk) {
        const p9Check = spellConsequence.readFormula(formulaStr, PROBE_STATS);
        if (p9Check.supported) {
          addIncompatibility(
            'WIZARD_FORMULA_ATTRIBUTE_TERM',
            `Formula "${formulaStr}" uses attribute terms not supported by Wizard authoredAbility.readFormula (only NdM [+- K] dice + flat constants allowed).`,
            hasDamageType ? 'damageConfig.formula' : 'healingConfig.formula',
            'formula-and-scaling-vocabulary',
            EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
          );
        } else {
          invalidProfileIssues.push(`Wizard formula "${formulaStr}" is invalid: ${p9Check.reason || wizFormulaErr}`);
        }
      }
    } else {
      const p9Formula = spellConsequence.readFormula(formulaStr, PROBE_STATS);
      if (!p9Formula.supported) {
        if (/not an approved attribute token|use the full attribute name/i.test(p9Formula.reason || '')) {
          conflicts.push(`Formula "${formulaStr}" uses ambiguous abbreviated token: ${p9Formula.reason}`);
        } else {
          addIncompatibility(
            'UNSUPPORTED_FORMULA_SYNTAX',
            `Formula "${formulaStr}" rejected by spellConsequence.readFormula: ${p9Formula.reason}`,
            hasDamageType ? 'damageConfig.formula' : 'healingConfig.formula',
            'formula-and-scaling-vocabulary',
            EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
          );
        }
      }
    }
  }

  // Check semantic conflict between damageConfig.formula and specialMechanics.scalingDamage (e.g. martyr_redemption_strike)
  if (
    typeof draft.damageConfig?.formula === 'string' &&
    typeof draft.specialMechanics?.scalingDamage?.formula === 'string' &&
    /missing_hp_percentage/i.test(draft.damageConfig.formula)
  ) {
    conflicts.push(
      `Scaling formula conflict: damageConfig.formula ("${draft.damageConfig.formula}") encodes flat missing_hp_percentage while specialMechanics.scalingDamage.formula specifies "${draft.specialMechanics.scalingDamage.formula}" (maxBonus: ${draft.specialMechanics.scalingDamage.maxBonus || 'unspecified'}).`
    );
  }

  // 9. Resource cost & Class payment check via production validators
  const rc = isPlainObject(draft.resourceCost) ? draft.resourceCost : {};
  const rv = isPlainObject(rc.resourceValues) ? rc.resourceValues : {};

  if (rc.actionPoints !== undefined && rv.actionPoints !== undefined && rc.actionPoints !== rv.actionPoints) {
    conflicts.push(
      `Disagreeing Action Points encodings: resourceCost.actionPoints (${rc.actionPoints}) vs resourceValues.actionPoints (${rv.actionPoints}).`
    );
  }
  if (rc.mana !== undefined && rv.mana !== undefined && rc.mana !== rv.mana) {
    conflicts.push(
      `Disagreeing Mana encodings: resourceCost.mana (${rc.mana}) vs resourceValues.mana (${rv.mana}).`
    );
  }

  const apVal = rc.actionPoints !== undefined ? rc.actionPoints : rv.actionPoints;
  if (apVal !== undefined && (!Number.isInteger(apVal) || apVal < 0 || apVal > 20)) {
    invalidProfileIssues.push(`resourceCost.actionPoints (${apVal}) must be an integer between 0 and 20.`);
  }
  const manaVal = rc.mana !== undefined ? rc.mana : rv.mana;
  if (manaVal !== undefined && (!Number.isInteger(manaVal) || manaVal < 0 || manaVal > 10000)) {
    invalidProfileIssues.push(`resourceCost.mana (${manaVal}) must be an integer between 0 and 10000.`);
  }

  let resourcePaymentAnalysis = null;
  if (!wizardMode) {
    resourcePaymentAnalysis = evaluateResourcePaymentSupport(draft, context);

    if (resourcePaymentAnalysis.nonP9ResourceValueKeys.length > 0) {
      addIncompatibility(
        'UNSUPPORTED_RESOURCE_VALUE_KEYS',
        `resourceCost.resourceValues contains keys (${resourcePaymentAnalysis.nonP9ResourceValueKeys.join(
          ', '
        )}) with no supported P9 payer (e.g. HP sacrifice or bespoke resource counters).`,
        'resourceCost.resourceValues',
        'class-resource-room-payment-home',
        EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
      );
    }

    if (resourcePaymentAnalysis.paymentStatus === 'conflicting_resource_encoding') {
      conflicts.push(resourcePaymentAnalysis.p9FundedBankVerdict.reason);
    } else if (resourcePaymentAnalysis.paymentStatus === 'supported_domain_schema_extra_keys') {
      const generic = rc.classResource ?? rv.classResource ?? {};
      const extraClassResKeys = Object.keys(generic).filter((k) => !['type', 'cost', 'gain'].includes(k));
      addIncompatibility(
        'CLASS_RESOURCE_SCHEMA_EXTRA_KEYS',
        `Class resource domain "${resourcePaymentAnalysis.managedDomainId}" is supported and planned (${JSON.stringify(
          resourcePaymentAnalysis.clientPlannedCosts
        )}), but resourceCost.classResource contains extra schema keys (${extraClassResKeys.join(
          ', '
        )}) rejected by spellConsequence.encodingConflict.`,
        'resourceCost.resourceValues.classResource',
        'schema-class-resource-cadence-or-metadata-keys',
        EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
      );
      if (
        Array.isArray(resourcePaymentAnalysis.clientPlannedCosts) &&
        Number.isInteger(generic.cost) &&
        generic.cost !== resourcePaymentAnalysis.clientPlannedCosts.length
      ) {
        conflicts.push(
          `Generic classResource.cost (${generic.cost}) disagrees with explicit musicalCombo.requires note count (${
            resourcePaymentAnalysis.clientPlannedCosts.length
          }: ${resourcePaymentAnalysis.clientPlannedCosts.join(', ')}); Class HQ confirmation required.`
        );
      }
    } else if (resourcePaymentAnalysis.paymentStatus === 'client_contract_only_no_p9_room_home') {
      addIncompatibility(
        'CLASS_RESOURCE_NO_P9_ROOM_HOME',
        `Client resource contract (${resourcePaymentAnalysis.managedDomainId}) plans this cost, but P9 has no revisioned server room payment home for "${resourcePaymentAnalysis.managedDomainId}" (${resourcePaymentAnalysis.p9FundedBankVerdict.reason}).`,
        'resourceCost.classResource',
        'class-resource-room-payment-home',
        EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
      );
    } else if (resourcePaymentAnalysis.paymentStatus === 'unsupported_class_resource_mechanic') {
      addIncompatibility(
        'UNSUPPORTED_CLASS_PAYMENT',
        resourcePaymentAnalysis.p9FundedBankVerdict.reason,
        'resourceCost.classResource',
        'class-resource-room-payment-home',
        EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
      );
    }

    // Check Minstrel resolver vs note-generator tag/description conflict (e.g. minstrel_harmony_strike)
    const tags = Array.isArray(draft.tags) ? draft.tags : [];
    if (
      draft.musicalCombo?.type === 'resolver' &&
      Array.isArray(draft.musicalCombo?.requires) &&
      !draft.musicalCombo?.generates &&
      tags.some((t) => /note generation/i.test(String(t)))
    ) {
      conflicts.push(
        `Authored role conflict: tags/description declare "note generation", but musicalCombo is authored as type "resolver" spending ${JSON.stringify(
          draft.musicalCombo.requires
        )} with no note generation spec.`
      );
    }
  }

  return {
    structuralIssues,
    conflicts,
    invalidProfileIssues,
    incompatibilities,
    capabilityDependencies: Object.fromEntries(capabilityDependencies),
    schemaAdaptationDependencies: Object.fromEntries(schemaAdaptationDependencies),
    resourcePaymentAnalysis,
  };
}

/**
 * Evaluates source/target route support separately from definition shape.
 */
function evaluateRouteSupport(record, profileEvaluation, context = {}) {
  const draft = isPlainObject(record?.authoredDraft) ? record.authoredDraft : record || {};
  const tc = isPlainObject(draft.targetingConfig) ? draft.targetingConfig : {};
  const targetingType = tc.targetingType || null;
  const rangeType = tc.rangeType || null;
  const rangeDistance = tc.rangeDistance !== undefined ? tc.rangeDistance : tc.range;
  const restrictions = Array.isArray(tc.targetRestrictions)
    ? [...tc.targetRestrictions]
    : Array.isArray(tc.validTargets)
    ? [...tc.validTargets]
    : [];
  const maxTargets = tc.maxTargets;

  const authoredTargeting = {
    targetingType,
    rangeType,
    rangeDistance,
    targetRestrictions: restrictions,
    maxTargets,
  };

  const requestedRoute = context.requestedRoute || null;
  const allowedRoutes = [];
  const routeRestrictions = [];

  if (isPassiveOrDescriptiveRecord(record)) {
    return {
      supported: false,
      authoredTargeting,
      requestedRoute,
      allowedRoutes: [],
      routeRestrictions: ['Passive/descriptive records do not execute targeted combat routes.'],
    };
  }

  const candidateProfile =
    profileEvaluation.sourceObservedProfile ||
    profileEvaluation.matchedProfile ||
    (isWizardAuthoredRecord(record, context)
      ? draft.controlConfig?.authoredCondition?.profile || authoredAbility.CAPABILITY
      : spellConsequence.P9_CAPABILITY);

  if (targetingType === 'self' && (maxTargets === undefined || maxTargets === 1)) {
    routeRestrictions.push(
      'Authored as single-actor self-target (targetingType: "self"). P9 requires targetingType: "single" with targetRestrictions: ["self"]; P14-A6 supports creatureSelfHealing only on single-target healing.'
    );
    return {
      supported: false,
      routeKind: 'single-actor-self',
      authoredTargeting,
      requestedRoute,
      allowedRoutes,
      routeRestrictions,
    };
  }

  if (targetingType !== 'single' || (maxTargets !== undefined && maxTargets !== 1)) {
    routeRestrictions.push(
      `Authored targetingType "${targetingType || 'missing'}"${
        maxTargets !== undefined ? ` (maxTargets: ${maxTargets})` : ''
      } is not a single-target route; area/chain/multi/point routes are not supported.`
    );
    return {
      supported: false,
      routeKind: 'area-or-multi-target',
      authoredTargeting,
      requestedRoute,
      allowedRoutes,
      routeRestrictions,
    };
  }

  const primaryRestriction = restrictions[0] || 'any';

  if (candidateProfile === authoredAbility.EFFECT_CAPABILITY) {
    // A10 authored-effect:v1 route rules (provisional unaccepted source):
    // Distinct creature target required; PC targets are refused.
    if (primaryRestriction === 'self' || rangeDistance === 0) {
      routeRestrictions.push('authored-effect:v1 requires distinct target routing (restriction !== "self" and rangeDistance > 0).');
    } else {
      allowedRoutes.push('pc -> distinct creature', 'creature -> distinct creature');
      routeRestrictions.push('Target must be a distinct placed creature token (cannot target PC actors or self).');
    }

    if (requestedRoute) {
      if (requestedRoute.sameActor === true) {
        routeRestrictions.push('Requested self-target route (sameActor: true) is rejected by authored-effect:v1.');
        return { supported: false, routeKind: 'single-target', authoredTargeting, requestedRoute, allowedRoutes, routeRestrictions };
      }
      if (requestedRoute.targetKind && requestedRoute.targetKind !== 'creature') {
        routeRestrictions.push(
          `Requested targetKind "${requestedRoute.targetKind}" is rejected: A10 authored effects may only target creatures.`
        );
        return { supported: false, routeKind: 'single-target', authoredTargeting, requestedRoute, allowedRoutes, routeRestrictions };
      }
    }

    return {
      supported: allowedRoutes.length > 0,
      routeKind: 'single-target',
      authoredTargeting,
      requestedRoute,
      allowedRoutes,
      routeRestrictions,
    };
  }

  if (candidateProfile === authoredAbility.CONDITION_CAPABILITY) {
    if (primaryRestriction === 'self' || rangeDistance === 0) {
      routeRestrictions.push('authored-condition:v1 requires distinct target routing (restriction !== "self" and rangeDistance > 0).');
    } else {
      allowedRoutes.push('pc (arcanoneer) -> distinct creature', 'pc (arcanoneer) -> distinct pc', 'creature -> distinct token');
      routeRestrictions.push('Requires distinct placed target token (sameActor === false) and rangeFeet > 0.');
    }

    if (requestedRoute && requestedRoute.sameActor === true) {
      routeRestrictions.push('Requested self-target route (sameActor: true) is rejected by authored-condition:v1.');
      return { supported: false, routeKind: 'single-target', authoredTargeting, requestedRoute, allowedRoutes, routeRestrictions };
    }

    return {
      supported: allowedRoutes.length > 0,
      routeKind: 'single-target',
      authoredTargeting,
      requestedRoute,
      allowedRoutes,
      routeRestrictions,
    };
  }

  if (candidateProfile === authoredAbility.CAPABILITY) {
    // authored-immediate:v1 route rules:
    // Check creatureSelfHealing helper when self/zero-range or when requestedRoute is creature self-target
    const defRes = profileEvaluation.wizardDefinitionResult;
    const selfHealAllowed = Boolean(
      defRes?.ok && authoredAbility.creatureSelfHealing(defRes.definition, record)
    );
    const selfHealDeniedReason = !defRes?.ok
      ? 'Definition did not compile for creatureSelfHealing check.'
      : defRes.definition?.effect?.kind !== 'healing'
      ? 'Only direct healing definitions can use creature self-healing (damage stays distinct-target only).'
      : 'Creature self-healing requires explicit self or any targeting restriction (ally/enemy excluded).';

    if (primaryRestriction === 'self' || rangeDistance === 0) {
      if (selfHealAllowed) {
        allowedRoutes.push('creature -> self (creatureSelfHealing P14-A6)');
        routeRestrictions.push(
          'Zero-range / self-restricted authored-immediate:v1 is only executable via creature self-healing (source === target creature).'
        );
      } else {
        routeRestrictions.push(selfHealDeniedReason);
      }
    } else {
      allowedRoutes.push('pc -> distinct creature', 'pc -> distinct pc', 'creature -> distinct creature', 'creature -> distinct pc');
      if (selfHealAllowed) {
        allowedRoutes.push('creature -> self (creatureSelfHealing P14-A6)');
      } else {
        routeRestrictions.push(`Creature self-target route excluded: ${selfHealDeniedReason}`);
      }
    }

    if (requestedRoute) {
      if (requestedRoute.sameActor === true) {
        if (requestedRoute.sourceKind === 'creature' && requestedRoute.targetKind === 'creature' && selfHealAllowed) {
          return { supported: true, routeKind: 'single-target', authoredTargeting, requestedRoute, allowedRoutes, routeRestrictions };
        }
        routeRestrictions.push(
          `Requested self-target route (${requestedRoute.sourceKind || 'actor'} -> self) is rejected: ${selfHealDeniedReason}`
        );
        return { supported: false, routeKind: 'single-target', authoredTargeting, requestedRoute, allowedRoutes, routeRestrictions };
      }
      if (primaryRestriction === 'self' || rangeDistance === 0) {
        routeRestrictions.push('Self-range or zero-range definitions cannot execute against a distinct target.');
        return { supported: false, routeKind: 'single-target', authoredTargeting, requestedRoute, allowedRoutes, routeRestrictions };
      }
    }

    return {
      supported: allowedRoutes.length > 0,
      routeKind: 'single-target',
      authoredTargeting,
      requestedRoute,
      allowedRoutes,
      routeRestrictions,
    };
  }

  // Default: p9-spell:v1 route rules
  allowedRoutes.push('pc -> placed token (matching targetRestrictions)');
  routeRestrictions.push(
    'Requires bound primary PC source actor and a placed target token on the active map within rangeDistance.'
  );
  if (requestedRoute && requestedRoute.sourceKind && requestedRoute.sourceKind !== 'pc') {
    routeRestrictions.push(
      `Requested sourceKind "${requestedRoute.sourceKind}" is not supported by p9-spell:v1 (requires primary PC caster).`
    );
    return { supported: false, routeKind: 'single-target', authoredTargeting, requestedRoute, allowedRoutes, routeRestrictions };
  }

  return {
    supported: true,
    routeKind: 'single-target',
    authoredTargeting,
    requestedRoute,
    allowedRoutes,
    routeRestrictions,
  };
}

/**
 * Evaluates a single record against production validators and whole-record rules.
 * Never mutates the input record.
 * Strictly distinguishes source-observed compatibility (including provisional Opus A10)
 * from accepted production-ready capability status.
 */
function checkRecord(record, context = {}) {
  const preCheckHash = isPlainObject(record) ? spellConsequence.definitionHash(record) : null;
  const preservedAuthoringValues = extractPreservedValues(record);

  const sourceLocation = {
    file: context.file ? toPosixRelative(path.resolve(REPO_ROOT, context.file)) : null,
    collectionPath: context.collectionPath || null,
    index: Number.isInteger(context.index) ? context.index : null,
    line:
      context.line ||
      (context.file && isPlainObject(record) && record.id
        ? findRecordLineInFile(path.resolve(REPO_ROOT, context.file), record.id, record.name)
        : null),
    recordSha256: preCheckHash,
  };

  const wholeInspection = inspectWholeRecordMechanics(record, context);
  const wizardMode = isWizardAuthoredRecord(record, context);
  const passiveMode = isPassiveOrDescriptiveRecord(record);

  let sourceObservedProfile = null;
  let acceptedMatchedProfile = null;
  let profilesEvaluated = [];
  let productionVerdict = {};
  let wizardDefinitionResult = null;

  if (passiveMode) {
    profilesEvaluated = [];
    productionVerdict = {
      supported: false,
      reason: 'Passive or descriptive content is outside active combat execution profiles.',
    };
  } else if (wizardMode) {
    profilesEvaluated = [
      authoredAbility.CAPABILITY,
      authoredAbility.CONDITION_CAPABILITY,
      authoredAbility.EFFECT_CAPABILITY,
    ];
    const defOptions = {
      roomId: context.roomId || 'room-compatibility-check',
      definitionVersion: Number.isInteger(record?.definitionVersion) ? record.definitionVersion : 1,
      classId: context.classId || record?.classId || record?.binding?.classId || 'arcanoneer',
    };
    const defRes = authoredAbility.definitionFromWizard(record, defOptions);
    wizardDefinitionResult = defRes;

    if (!defRes.ok) {
      productionVerdict = {
        validator: 'authoredAbility.definitionFromWizard',
        ok: false,
        code: defRes.code,
        reason: defRes.reason || `definitionFromWizard rejected record with code "${defRes.code}".`,
      };
      if (
        /library\/draft|serializedData\/draft|conflicting AP|Explicit mana price|conflicting cast time|school \/ damage type conflict/i.test(
          defRes.reason || ''
        )
      ) {
        wholeInspection.conflicts.push(defRes.reason);
      } else if (wholeInspection.incompatibilities.length === 0) {
        wholeInspection.invalidProfileIssues.push(productionVerdict.reason);
      }
    } else {
      const resolvedCapability = defRes.definition.capability || authoredAbility.CAPABILITY;
      const regCompile = installedDefinitionRegistry.compileDefinition(defRes.definition);
      const immCompile =
        resolvedCapability === authoredAbility.CAPABILITY
          ? authoredSpellDefinitions.compileDefinition(defRes.definition)
          : { ok: true };

      if (!regCompile.ok || !immCompile.ok) {
        const failed = !regCompile.ok ? regCompile : immCompile;
        productionVerdict = {
          validator: !regCompile.ok
            ? 'installedDefinitionRegistry.compileDefinition'
            : 'authoredSpellDefinitions.compileDefinition',
          ok: false,
          code: failed.code,
          field: failed.field || null,
          reason: `compileDefinition rejected definition with code "${failed.code}"${
            failed.field ? ` at field "${failed.field}"` : ''
          }.`,
        };
        wholeInspection.invalidProfileIssues.push(productionVerdict.reason);
      } else {
        sourceObservedProfile = resolvedCapability;
        const gov = PROFILE_ACCEPTANCE_STATUS[resolvedCapability];
        if (gov?.capabilityStatus === 'accepted') {
          acceptedMatchedProfile = resolvedCapability;
        } else {
          // Record matches provisional unaccepted source (Opus A10 authored-effect:v1).
          // Do NOT mark unfinished engine work as production-ready!
          const msg = `Matches working-tree profile "${resolvedCapability}", which is provisional unaccepted source work (Opus P14-A10; no completed increment/App/review acceptance handoff per Cross-Track Finding I4). Not production-ready.`;
          wholeInspection.incompatibilities.push({
            code: 'PROVISIONAL_UNACCEPTED_PROFILE_A10',
            message: msg,
            field: 'authoredDraft.controlConfig.authoredCondition.profile',
            capabilityGroup: 'provisional-unaccepted-engine-increment-a10',
            exclusionCategory: EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY,
          });
          wholeInspection.capabilityDependencies['provisional-unaccepted-engine-increment-a10'] = [
            {
              detail: msg,
              field: 'authoredDraft.controlConfig.authoredCondition.profile',
              exclusionCategory: EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY,
            },
          ];
        }

        productionVerdict = {
          validator: 'authoredAbility.definitionFromWizard + installedDefinitionRegistry.compileDefinition',
          ok: true,
          capability: resolvedCapability,
          capabilityStatus: gov?.capabilityStatus || 'unknown',
          productionReady: Boolean(gov?.productionReady),
          governanceNote: gov?.governanceNote || null,
          definitionHash: regCompile.definitionHash || immCompile.definitionHash,
          effect: defRes.definition.effect || defRes.definition.effects,
        };
      }
    }
  } else {
    profilesEvaluated = [spellConsequence.P9_CAPABILITY];
    const shapeRes = spellConsequence.supportShape(record);
    const paymentRes = spellConsequence.planClassPayment(
      record,
      context.classResource || null,
      context.className || record?.class || record?.classId || null
    );
    const fundedResource = buildFundedProbeClassResource(
      record,
      context.className || record?.class || record?.classId || null,
      context.classResource || null
    );
    const fundedPaymentRes = spellConsequence.planClassPayment(
      record,
      fundedResource,
      context.className || record?.class || record?.classId || null
    );

    const rawFormula =
      record?.damageConfig?.formula || record?.healingConfig?.formula || shapeRes.formula || null;
    const formulaRes =
      typeof rawFormula === 'string'
        ? spellConsequence.readFormula(rawFormula, PROBE_STATS)
        : { supported: false, reason: 'No damage/healing formula present.' };

    let catalogueVerdict = null;
    if (context.className) {
      catalogueVerdict = spellConsequence.supportSpell(record, {
        class: context.className,
        classResource: fundedResource,
        stats: PROBE_STATS,
      });
    }

    const p9Ok = Boolean(
      shapeRes.supported &&
        paymentRes.supported &&
        formulaRes.supported &&
        (catalogueVerdict === null || catalogueVerdict.supported)
    );

    if (p9Ok) {
      sourceObservedProfile = spellConsequence.P9_CAPABILITY;
      acceptedMatchedProfile = spellConsequence.P9_CAPABILITY;
    }

    productionVerdict = {
      validator: 'spellConsequence (supportShape + planClassPayment + readFormula)',
      ok: p9Ok,
      capabilityStatus: p9Ok ? 'accepted' : 'none',
      productionReady: p9Ok,
      shape: shapeRes,
      payment: {
        supported: paymentRes.supported,
        domain: paymentRes.domain || null,
        affordableWithEmptyDefaultBank: Boolean(paymentRes.affordable),
        reason: paymentRes.reason || null,
        classPayment: fundedPaymentRes.classPayment || paymentRes.classPayment || null,
      },
      formula: {
        supported: formulaRes.supported,
        normalized: formulaRes.normalized || null,
        reading: formulaRes.reading || null,
        reason: formulaRes.reason || null,
      },
      ...(catalogueVerdict
        ? {
            catalogueSupportSpell: {
              supported: catalogueVerdict.supported,
              reason: catalogueVerdict.reason || null,
              definitionHash: catalogueVerdict.definitionHash || null,
            },
          }
        : {}),
    };
  }

  const profileEvaluation = {
    fits: Boolean(acceptedMatchedProfile),
    matchedProfile: acceptedMatchedProfile,
    sourceObservedProfile,
    profilesEvaluated,
    productionVerdict,
    wizardDefinitionResult,
  };

  const routeSupport = evaluateRouteSupport(record, profileEvaluation, context);

  // Determine manual adjudication
  let manualAdjudication;
  if (passiveMode) {
    manualAdjudication = {
      required: false,
      mode: 'passive-or-reference-only',
      reasons: ['Passive or descriptive record; does not trigger an active execution command.'],
    };
  } else if (acceptedMatchedProfile && routeSupport.supported) {
    const reasons = [
      'GM must explicitly confirm legality, range, line-of-sight/obstruction, and final mitigation before state mutation.',
    ];
    if (acceptedMatchedProfile === authoredAbility.CONDITION_CAPABILITY) {
      reasons.push('Canonical Stunned (authored-condition:v1) uses gm-manual expiry and gmNote adjudication.');
    }
    manualAdjudication = {
      required: true,
      mode: 'gm-confirmation-and-table-rulings',
      reasons,
    };
  } else {
    manualAdjudication = {
      required: true,
      mode: 'full-manual-tabletop',
      reasons:
        wholeInspection.incompatibilities.length > 0
          ? wholeInspection.incompatibilities.map((i) => i.message)
          : [
              productionVerdict.reason ||
                'Record does not fit an accepted automated execution profile; resolve manually at the table.',
            ],
    };
  }

  // Runtime prerequisites (always explicit: a compatible definition is NOT automatically admitted/affordable/executable)
  const runtimePrerequisites = [];
  if (!passiveMode) {
    if (acceptedMatchedProfile === spellConsequence.P9_CAPABILITY || (!wizardMode && !acceptedMatchedProfile)) {
      runtimePrerequisites.push(
        'Primary PC actor bound to the player in an active multiplayer room (binding.actorId).',
        'Ability known/equipped by the PC and matching canonical CLASS_DATA_MAP definitionHash.',
        'Placed source and target tokens on the active map with matching boardId and roomRevision.',
        'Owner roll and resource payment approval (spell_execute_approve) with affordable runtime AP, Mana, and class resource state.',
        'GM final confirmation (spell_execute_confirm) before any room HP/resource mutation occurs.',
        'Cross-Track Finding I2 note: spellConsequence.js currently reads combatAttributes(character) from raw character.stats rather than effective attributes (baseStats + equipment/buffs).'
      );
    } else {
      runtimePrerequisites.push(
        'Explicit GM registry admission (actor_authored_admit) into room.installedDefinitionRegistry with non-revoked definitionVersion and matching classId (or placed creature source with admitted ability).',
        'Placed source and target tokens on the active map satisfying the profile route restrictions.',
        'Owner approval (authored_ability_approve) with dice roll and affordable AP/Mana on the source actor.',
        'GM final execution confirmation (authored_ability_execute).'
      );
      if (
        sourceObservedProfile === authoredAbility.EFFECT_CAPABILITY ||
        record?.authoredDraft?.controlConfig?.authoredCondition?.profile === authoredAbility.EFFECT_CAPABILITY
      ) {
        const expiryPolicy = record?.authoredDraft?.controlConfig?.authoredCondition?.expiryPolicy;
        if (expiryPolicy === 'target-next-start' || expiryPolicy === 'target-next-end') {
          runtimePrerequisites.push(
            `Active combat with adopted shared-turn-boundary:v1 clock and target creature in combat.turnOrder for "${expiryPolicy}" expiry.`
          );
        }
      }
    }
  }

  // Determine final classification across the 5 required categories.
  // Note: Only ACCEPTED profiles (p9-spell:v1, authored-immediate:v1, authored-condition:v1) can classify as COMPATIBLE.
  // Provisional unaccepted source profiles (authored-effect:v1) have PROVISIONAL_UNACCEPTED_PROFILE_A10 in wholeInspection.incompatibilities
  // and therefore classify as UNSUPPORTED_CAPABILITY with sourceObservedCompatible: true, acceptedCompatible: false.
  let classification;
  if (wholeInspection.structuralIssues.length > 0) {
    classification = CLASSIFICATIONS.INVALID_FOR_PROFILE;
  } else if (passiveMode) {
    classification = CLASSIFICATIONS.DESCRIPTIVE_OR_PASSIVE;
  } else if (wholeInspection.conflicts.length > 0) {
    classification = CLASSIFICATIONS.AMBIGUOUS_OR_CONFLICTING;
  } else if (wholeInspection.invalidProfileIssues.length > 0) {
    classification = CLASSIFICATIONS.INVALID_FOR_PROFILE;
  } else if (
    sourceObservedProfile &&
    wholeInspection.incompatibilities.length === 0 &&
    !routeSupport.supported
  ) {
    // Definition shape fits the profile, but the requested or authored source/target route is restricted/invalid for that profile
    classification = CLASSIFICATIONS.INVALID_FOR_PROFILE;
  } else if (
    acceptedMatchedProfile &&
    wholeInspection.incompatibilities.length === 0 &&
    routeSupport.supported
  ) {
    classification = CLASSIFICATIONS.COMPATIBLE;
  } else if (
    wizardMode &&
    !sourceObservedProfile &&
    wholeInspection.incompatibilities.length === 0
  ) {
    classification = CLASSIFICATIONS.INVALID_FOR_PROFILE;
  } else {
    classification = CLASSIFICATIONS.UNSUPPORTED_CAPABILITY;
  }

  // Build explicit 5-way exclusion breakdown for transparency
  const missingEngineCapabilities = wholeInspection.incompatibilities.filter(
    (i) => i.exclusionCategory === EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY
  );
  const incompatibleSchemaIssues = wholeInspection.incompatibilities.filter(
    (i) => i.exclusionCategory === EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA
  );
  const intentionalManualOnlyIssues = wholeInspection.incompatibilities.filter(
    (i) => i.exclusionCategory === EXCLUSION_CATEGORIES.INTENTIONAL_MANUAL_ONLY
  );

  const categoriesPresent = [];
  if (intentionalManualOnlyIssues.length > 0) {
    categoriesPresent.push(EXCLUSION_CATEGORIES.INTENTIONAL_MANUAL_ONLY);
  }
  if (wholeInspection.conflicts.length > 0) {
    categoriesPresent.push(EXCLUSION_CATEGORIES.CONFLICTING_DATA);
  }
  if (missingEngineCapabilities.length > 0) {
    categoriesPresent.push(EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY);
  }
  if (incompatibleSchemaIssues.length > 0) {
    categoriesPresent.push(EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA);
  }
  if (!passiveMode && runtimePrerequisites.length > 0) {
    categoriesPresent.push(EXCLUSION_CATEGORIES.RUNTIME_PREREQUISITES_OFFLINE_UNKNOWN);
  }

  let primaryExclusionReason = null;
  if (classification === CLASSIFICATIONS.COMPATIBLE) {
    primaryExclusionReason = EXCLUSION_CATEGORIES.RUNTIME_PREREQUISITES_OFFLINE_UNKNOWN;
  } else if (classification === CLASSIFICATIONS.DESCRIPTIVE_OR_PASSIVE) {
    primaryExclusionReason = 'passive_or_descriptive';
  } else if (classification === CLASSIFICATIONS.INVALID_FOR_PROFILE) {
    primaryExclusionReason = 'invalid_for_profile';
  } else if (intentionalManualOnlyIssues.length > 0) {
    primaryExclusionReason = EXCLUSION_CATEGORIES.INTENTIONAL_MANUAL_ONLY;
  } else if (wholeInspection.conflicts.length > 0) {
    primaryExclusionReason = EXCLUSION_CATEGORIES.CONFLICTING_DATA;
  } else if (missingEngineCapabilities.length > 0) {
    primaryExclusionReason = EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY;
  } else if (incompatibleSchemaIssues.length > 0) {
    primaryExclusionReason = EXCLUSION_CATEGORIES.INCOMPATIBLE_AUTHORED_SCHEMA;
  }

  const profileGov = sourceObservedProfile ? PROFILE_ACCEPTANCE_STATUS[sourceObservedProfile] : null;
  const sourceObservedCompatible = Boolean(
    sourceObservedProfile &&
      routeSupport.supported &&
      wholeInspection.incompatibilities.every((i) => i.code === 'PROVISIONAL_UNACCEPTED_PROFILE_A10')
  );
  const acceptedCompatible = classification === CLASSIFICATIONS.COMPATIBLE;

  // Verify input record was never mutated
  const postCheckHash = isPlainObject(record) ? spellConsequence.definitionHash(record) : null;
  if (preCheckHash !== postCheckHash) {
    throw new Error(`Input mutation detected while checking record "${record?.id || 'unknown'}".`);
  }

  return {
    recordId: isPlainObject(record) && typeof record.id === 'string' ? record.id : null,
    name:
      isPlainObject(record) && typeof (record.name || record.authoredDraft?.name) === 'string'
        ? record.name || record.authoredDraft.name
        : null,
    className: context.className || record?.class || record?.classId || record?.binding?.classId || null,
    sourceLocation,
    classification,
    compatibleProfile: acceptedCompatible ? acceptedMatchedProfile : null,
    capabilityStatus: acceptedCompatible
      ? 'accepted'
      : sourceObservedCompatible && profileGov
      ? profileGov.capabilityStatus
      : 'none',
    productionReady: acceptedCompatible,
    sourceObservedProfile: sourceObservedCompatible ? sourceObservedProfile : null,
    sourceObservedCompatible,
    acceptedCompatible,
    exclusionAnalysis: {
      primaryExclusionReason,
      categoriesPresent,
      onlyBlockedByAuthoredSchema:
        !passiveMode &&
        wholeInspection.structuralIssues.length === 0 &&
        wholeInspection.invalidProfileIssues.length === 0 &&
        wholeInspection.conflicts.length === 0 &&
        intentionalManualOnlyIssues.length === 0 &&
        missingEngineCapabilities.length === 0 &&
        incompatibleSchemaIssues.length > 0,
      missingEngineCapabilityCount: missingEngineCapabilities.length,
      incompatibleSchemaIssueCount: incompatibleSchemaIssues.length,
      intentionalManualOnly: intentionalManualOnlyIssues.length > 0,
      conflictingDataCount: wholeInspection.conflicts.length,
      offlineUnknownRuntimePrerequisites: runtimePrerequisites,
    },
    resourcePaymentAnalysis: wholeInspection.resourcePaymentAnalysis,
    preservedAuthoringValues,
    questions: {
      structuralValidity: {
        valid: wholeInspection.structuralIssues.length === 0,
        recordKind:
          wholeInspection.structuralIssues.length > 0
            ? 'malformed'
            : passiveMode
            ? 'talent-or-passive'
            : wizardMode
            ? 'wizard-authored'
            : 'class-ability',
        issues: wholeInspection.structuralIssues,
      },
      executableProfile: {
        fits: acceptedCompatible,
        matchedProfile: acceptedCompatible ? acceptedMatchedProfile : null,
        sourceObservedProfile: sourceObservedCompatible ? sourceObservedProfile : null,
        sourceObservedFits: sourceObservedCompatible,
        capabilityStatus: acceptedCompatible
          ? 'accepted'
          : sourceObservedCompatible && profileGov
          ? profileGov.capabilityStatus
          : 'none',
        productionReady: acceptedCompatible,
        profilesEvaluated,
        productionVerdict,
      },
      routeSupport,
      manualAdjudication,
      runtimePrerequisites: {
        requiresRuntimeAdmissionOrApproval: !passiveMode,
        automaticallyExecutable: false,
        prerequisites: runtimePrerequisites,
      },
    },
    conflicts: wholeInspection.conflicts,
    invalidProfileIssues: wholeInspection.invalidProfileIssues,
    incompatibilities: wholeInspection.incompatibilities,
    requiredCapabilityDependencies: wholeInspection.capabilityDependencies,
    schemaAdaptationDependencies: wholeInspection.schemaAdaptationDependencies,
  };
}

/**
 * Checks a collection of records and aggregates summary statistics and missing capability groups.
 */
function checkCollection(records, options = {}) {
  if (!Array.isArray(records)) {
    throw new Error('checkCollection expects an array of records or { record, context } items.');
  }

  const validatorIdentity = buildValidatorIdentity();
  const results = records.map((entry, idx) => {
    if (isPlainObject(entry) && isPlainObject(entry.record) && entry.__isWrappedEntry === true) {
      return checkRecord(entry.record, {
        ...options,
        ...entry.context,
        index: entry.context?.index !== undefined ? entry.context.index : idx,
      });
    }
    return checkRecord(entry, { ...options, index: idx });
  });

  const countsByClassification = {
    [CLASSIFICATIONS.COMPATIBLE]: 0,
    [CLASSIFICATIONS.UNSUPPORTED_CAPABILITY]: 0,
    [CLASSIFICATIONS.AMBIGUOUS_OR_CONFLICTING]: 0,
    [CLASSIFICATIONS.INVALID_FOR_PROFILE]: 0,
    [CLASSIFICATIONS.DESCRIPTIVE_OR_PASSIVE]: 0,
  };

  const countsByProfile = {};
  const countsBySourceObservedProvisionalProfile = {};
  const countsByPrimaryExclusionReason = {};
  const capabilityGroupAggregation = new Map();

  for (const res of results) {
    countsByClassification[res.classification] =
      (countsByClassification[res.classification] || 0) + 1;

    if (res.compatibleProfile) {
      countsByProfile[res.compatibleProfile] = (countsByProfile[res.compatibleProfile] || 0) + 1;
    }
    if (res.sourceObservedCompatible && !res.acceptedCompatible && res.sourceObservedProfile) {
      countsBySourceObservedProvisionalProfile[res.sourceObservedProfile] =
        (countsBySourceObservedProvisionalProfile[res.sourceObservedProfile] || 0) + 1;
    }
    if (res.exclusionAnalysis?.primaryExclusionReason) {
      const reasonKey = res.exclusionAnalysis.primaryExclusionReason;
      countsByPrimaryExclusionReason[reasonKey] = (countsByPrimaryExclusionReason[reasonKey] || 0) + 1;
    }

    for (const [group, items] of Object.entries(res.requiredCapabilityDependencies)) {
      const groupCategory = items[0]?.exclusionCategory || EXCLUSION_CATEGORIES.MISSING_ENGINE_CAPABILITY;
      if (!capabilityGroupAggregation.has(group)) {
        capabilityGroupAggregation.set(group, {
          capabilityGroup: group,
          exclusionCategory: groupCategory,
          affectedRecordCount: 0,
          affectedRecordIds: [],
          sampleDetails: [],
        });
      }
      const agg = capabilityGroupAggregation.get(group);
      agg.affectedRecordCount += 1;
      if (res.recordId && !agg.affectedRecordIds.includes(res.recordId)) {
        agg.affectedRecordIds.push(res.recordId);
      }
      for (const item of items) {
        if (agg.sampleDetails.length < 5 && !agg.sampleDetails.includes(item.detail)) {
          agg.sampleDetails.push(item.detail);
        }
      }
    }
  }

  const missingCapabilitiesByEngineRequirement = [...capabilityGroupAggregation.values()].sort(
    (a, b) =>
      b.affectedRecordCount - a.affectedRecordCount ||
      a.capabilityGroup.localeCompare(b.capabilityGroup)
  );

  return {
    schemaVersion: 'ability-compatibility-report:v2',
    batchName: options.batchName || 'custom-batch',
    validatorIdentity,
    nonReusableValidatorInterfaces: NON_REUSABLE_VALIDATOR_INTERFACES,
    summary: {
      totalRecordsChecked: results.length,
      countsByClassification,
      countsByCompatibleProfile: countsByProfile,
      countsBySourceObservedProvisionalProfile,
      countsByPrimaryExclusionReason,
      missingCapabilityGroupCount: missingCapabilitiesByEngineRequirement.length,
    },
    missingCapabilitiesByEngineRequirement,
    records: results,
  };
}

/**
 * Loads and checks a class module by class name (from CLASS_DATA_MAP) or file path.
 */
function checkClassByName(className) {
  const { CLASS_DATA_MAP } = require(path.join(VTT_REACT_ROOT, 'src', 'data', 'classSpellGenerator.js'));
  const classFilesMap = {
    Arcanoneer: 'vtt-react/src/data/classes/arcanoneerData.js',
    Berserker: 'vtt-react/src/data/classes/berserkerData.js',
    Shaper: 'vtt-react/src/data/classes/shaperData.js',
    Harbinger: 'vtt-react/src/data/classes/harbingerData.js',
    Chronarch: 'vtt-react/src/data/classes/chronarchData.js',
    Inquisitor: 'vtt-react/src/data/classes/inquisitorData.js',
    Deathcaller: 'vtt-react/src/data/classes/deathcallerData.js',
    Lichborne: 'vtt-react/src/data/classes/lichborneData.js',
    Revenant: 'vtt-react/src/data/classes/revenantData.js',
    'False Prophet': 'vtt-react/src/data/classes/falseProphetData.js',
    Gambit: 'vtt-react/src/data/classes/gambitData.js',
    Apex: 'vtt-react/src/data/classes/apexData.js',
    Animist: 'vtt-react/src/data/classes/animistData.js',
    Lunarch: 'vtt-react/src/data/classes/lunarchData.js',
    Martyr: 'vtt-react/src/data/classes/martyrData.js',
    Minstrel: 'vtt-react/src/data/classes/minstrelData.js',
    Plaguebringer: 'vtt-react/src/data/classes/plaguebringerData.js',
    Pyrofiend: 'vtt-react/src/data/classes/pyrofiendData.js',
    Spellguard: 'vtt-react/src/data/classes/spellguardData.js',
    Toxicologist: 'vtt-react/src/data/classes/toxicologistData.js',
    Warden: 'vtt-react/src/data/classes/wardenData.js',
    Augur: 'vtt-react/src/data/classes/augurData.js',
    Crusader: 'vtt-react/src/data/classes/crusaderData.js',
    'Chaos Weaver': 'vtt-react/src/data/classes/chaosWeaverIntegration.js',
    Gambler: 'vtt-react/src/data/classes/gamblerData.js',
    'Fate Weaver': 'vtt-react/src/data/classes/fateWeaverData.js',
    Doomsayer: 'vtt-react/src/data/classes/doomsayerData.js',
    Oracle: 'vtt-react/src/data/classes/oracleData.js',
    Druid: 'vtt-react/src/data/classes/druidData.js',
    Hunter: 'vtt-react/src/data/classes/hunterData.js',
  };

  const targetNames =
    className.toLowerCase() === 'all' ? Object.keys(CLASS_DATA_MAP) : [className];

  const wrappedEntries = [];
  for (const name of targetNames) {
    const classData = CLASS_DATA_MAP[name];
    if (!classData) {
      throw new Error(`Unknown class "${name}". Available classes: ${Object.keys(CLASS_DATA_MAP).join(', ')}`);
    }
    const collectionField = Array.isArray(classData.spells)
      ? 'spells'
      : Array.isArray(classData.exampleSpells)
      ? 'exampleSpells'
      : null;
    const spells = collectionField ? classData[collectionField] : [];
    const relFile = classFilesMap[name] || 'vtt-react/src/data/classSpellGenerator.js';

    spells.forEach((spell, idx) => {
      wrappedEntries.push({
        __isWrappedEntry: true,
        record: spell,
        context: {
          className: name,
          classResource: classData.classResource ? { type: classData.classResource.type } : null,
          file: relFile,
          collectionPath: `${name}.${collectionField}[${idx}]`,
          index: idx,
        },
      });
    });
  }

  return checkCollection(wrappedEntries, {
    batchName: className.toLowerCase() === 'all' ? 'all-classes-catalogue' : `class:${className}`,
  });
}

/**
 * Formats a concise human-readable terminal summary from a report object.
 */
function formatTerminalSummary(report) {
  const lines = [];
  lines.push('================================================================================');
  lines.push(`MYTHRILL ABILITY COMPATIBILITY REPORT — ${report.batchName}`);
  lines.push(`Validator Bundle SHA-256: ${report.validatorIdentity.validatorBundleHash.slice(0, 16)}...`);
  lines.push(`Accepted Profiles:        ${report.validatorIdentity.acceptedProfiles.join(', ')}`);
  lines.push(
    `Provisional Source Only:  ${report.validatorIdentity.provisionalSourceProfiles.join(', ')} (not production-ready)`
  );
  lines.push('================================================================================');
  lines.push('');
  lines.push(`Total Records Checked: ${report.summary.totalRecordsChecked}`);
  for (const [cls, count] of Object.entries(report.summary.countsByClassification)) {
    lines.push(`  - ${cls.padEnd(40)} ${count}`);
  }
  if (Object.keys(report.summary.countsByCompatibleProfile).length > 0) {
    lines.push('');
    lines.push('Accepted Compatible Profiles Matched:');
    for (const [prof, count] of Object.entries(report.summary.countsByCompatibleProfile)) {
      lines.push(`  - ${prof.padEnd(40)} ${count}`);
    }
  }
  if (
    report.summary.countsBySourceObservedProvisionalProfile &&
    Object.keys(report.summary.countsBySourceObservedProvisionalProfile).length > 0
  ) {
    lines.push('');
    lines.push('Provisional Unaccepted Source Profiles Observed (Not Production-Ready):');
    for (const [prof, count] of Object.entries(report.summary.countsBySourceObservedProvisionalProfile)) {
      lines.push(`  - ${prof.padEnd(40)} ${count}`);
    }
  }

  lines.push('');
  lines.push('Per-Record Summary:');
  lines.push('--------------------------------------------------------------------------------');
  for (const rec of report.records) {
    const loc = rec.sourceLocation.file
      ? `${rec.sourceLocation.file}${rec.sourceLocation.line ? `:${rec.sourceLocation.line}` : ''}`
      : rec.sourceLocation.collectionPath || 'inline';
    const profileTag = rec.compatibleProfile
      ? ` [${rec.compatibleProfile} | ACCEPTED]`
      : rec.sourceObservedProfile
      ? ` [${rec.sourceObservedProfile} | PROVISIONAL_UNACCEPTED]`
      : '';
    const detail =
      rec.classification === CLASSIFICATIONS.COMPATIBLE
        ? `Route: ${rec.questions.routeSupport.allowedRoutes[0] || 'supported'} (Runtime prereqs: ${
            rec.questions.runtimePrerequisites.prerequisites.length
          })`
        : rec.classification === CLASSIFICATIONS.DESCRIPTIVE_OR_PASSIVE
        ? 'Intentionally passive/descriptive outside active execution profiles'
        : rec.conflicts.length > 0
        ? rec.conflicts[0]
        : rec.invalidProfileIssues.length > 0
        ? rec.invalidProfileIssues[0]
        : rec.incompatibilities.length > 0
        ? rec.incompatibilities.map((i) => `${i.code}(${i.exclusionCategory})`).join(', ')
        : !rec.questions.routeSupport.supported && rec.questions.routeSupport.routeRestrictions.length > 0
        ? rec.questions.routeSupport.routeRestrictions[0]
        : rec.questions.executableProfile.productionVerdict?.reason || 'Unsupported';

    lines.push(
      `• ${(rec.recordId || 'missing-id').padEnd(34)} | ${rec.classification.padEnd(24)}${profileTag}`
    );
    lines.push(`    Source: ${loc}`);
    lines.push(`    Note:   ${detail}`);
  }

  if (report.missingCapabilitiesByEngineRequirement.length > 0) {
    lines.push('');
    lines.push('Blockers Grouped by Requirement & Exclusion Category:');
    lines.push('--------------------------------------------------------------------------------');
    for (const grp of report.missingCapabilitiesByEngineRequirement) {
      lines.push(
        `  * ${grp.capabilityGroup.padEnd(46)} [${grp.exclusionCategory}] (${
          grp.affectedRecordCount
        } record(s): ${grp.affectedRecordIds.slice(0, 5).join(', ')}${
          grp.affectedRecordIds.length > 5 ? ', ...' : ''
        })`
      );
    }
  }
  lines.push('================================================================================');
  return lines.join('\n');
}

function parseCliArgs(argv) {
  const args = {
    batch: 'representative',
    className: null,
    file: null,
    jsonOut: null,
    quiet: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--class' && argv[i + 1]) {
      args.className = argv[++i];
      args.batch = null;
    } else if (arg === '--file' && argv[i + 1]) {
      args.file = argv[++i];
      args.batch = null;
    } else if ((arg === '--json' || arg === '--out') && argv[i + 1]) {
      args.jsonOut = path.resolve(process.cwd(), argv[++i]);
    } else if (arg === '--no-json') {
      args.jsonOut = false;
    } else if (arg === '--quiet') {
      args.quiet = true;
    } else if (arg === '--batch' && argv[i + 1]) {
      args.batch = argv[++i];
    } else if (arg === '--first-campaign') {
      args.batch = 'first-campaign';
    }
  }
  return args;
}

function runCli(argv = process.argv) {
  const args = parseCliArgs(argv);
  let report;
  let defaultJsonOut = path.join(__dirname, 'representative-report.json');

  if (args.className) {
    report = checkClassByName(args.className);
    defaultJsonOut = null;
  } else if (args.file) {
    const absFile = path.resolve(process.cwd(), args.file);
    const loaded = require(absFile);
    const records = Array.isArray(loaded)
      ? loaded
      : Array.isArray(loaded.spells)
      ? loaded.spells
      : Array.isArray(loaded.exampleSpells)
      ? loaded.exampleSpells
      : Array.isArray(loaded.records)
      ? loaded.records
      : [loaded];
    report = checkCollection(
      records.map((r, idx) => ({
        __isWrappedEntry: true,
        record: r,
        context: {
          file: absFile,
          collectionPath: `${path.basename(absFile)}[${idx}]`,
          index: idx,
        },
      })),
      { batchName: `file:${toPosixRelative(absFile)}` }
    );
    defaultJsonOut = null;
  } else if (args.batch === 'first-campaign') {
    const { buildFirstCampaignReadinessManifest, formatFirstCampaignReadinessSummary } = require('./firstCampaignBatch.cjs');
    const manifest = buildFirstCampaignReadinessManifest();
    const outPath =
      args.jsonOut === false
        ? null
        : args.jsonOut || path.join(__dirname, 'first-campaign-readiness-batch.json');
    if (outPath) {
      fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    }
    if (!args.quiet) {
      console.log(formatFirstCampaignReadinessSummary(manifest));
      if (outPath) {
        console.log(`\nMachine-readable batch manifest written to: ${toPosixRelative(outPath)}`);
      }
    }
    return manifest;
  } else {
    const { buildRepresentativeBatch } = require('./representativeBatch.cjs');
    const batch = buildRepresentativeBatch();
    report = checkCollection(batch.entries, { batchName: batch.batchName });
  }

  const finalJsonOut = args.jsonOut === false ? null : args.jsonOut || defaultJsonOut;
  if (finalJsonOut) {
    fs.writeFileSync(finalJsonOut, JSON.stringify(report, null, 2) + '\n', 'utf8');
  }

  if (!args.quiet) {
    console.log(formatTerminalSummary(report));
    if (finalJsonOut) {
      console.log(`\nMachine-readable JSON report written to: ${toPosixRelative(finalJsonOut)}`);
    }
  }

  return report;
}

module.exports = {
  CLASSIFICATIONS,
  EXCLUSION_CATEGORIES,
  PROFILE_ACCEPTANCE_STATUS,
  PROBE_STATS,
  NON_REUSABLE_VALIDATOR_INTERFACES,
  buildValidatorIdentity,
  buildFundedProbeClassResource,
  evaluateResourcePaymentSupport,
  extractPreservedValues,
  inspectWholeRecordMechanics,
  evaluateRouteSupport,
  checkRecord,
  checkCollection,
  checkClassByName,
  formatTerminalSummary,
  runCli,
};

if (require.main === module) {
  runCli(process.argv);
}
