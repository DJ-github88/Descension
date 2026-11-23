/**
 * Canonical Spell Wizard Save Path
 *
 * Single source of truth used by all three Spell Wizard save triggers:
 *   1. Header Finalize / Update (SpellwizardApp.jsx)
 *   2. Step 10 Review Save to Library / Update Spell (Step10Review.jsx)
 *   3. Floating ExternalLivePreview Complete Spell / Update Spell (ExternalLivePreview.jsx)
 *
 * Guarantees:
 *   - Create and update follow one canonical validation, draft, serialization,
 *     icon, targeting, effect-field, and ID/metadata contract.
 *   - authoredDraft and serializedData remain strictly consistent on create and update.
 *   - Explicit zeroes (0 AP, 0 mana, 0 rangeDistance, 0 level, 0 cooldownValue, etc.)
 *     and effect-level configs are preserved without fallback coercion.
 *   - Library metadata and transient UI state stay separated on the outer library record
 *     and are never written into authoredDraft or serializedData.
 */

import { libraryActionCreators } from '../context/SpellLibraryContext';
import { actionCreators } from '../context/spellWizardContext';
import { extractSpellIcon } from '../core/utils/spellSerializer';
import { categorizeSpell } from '../core/utils/libraryManager';
import { saveUserSpell } from '../../../services/firebase/userSpellService';
import {
  TRANSIENT_WIZARD_KEYS,
  APPROVAL_REVISION_METADATA_KEYS,
  OUTER_PERSISTENCE_METADATA_KEYS,
  LIBRARY_METADATA_KEYS,
  DERIVED_DISPLAY_KEYS,
  DRAFT_EXCLUDED_KEYS,
  WIZARD_ONLY_KEYS,
  cloneCanonicalJson,
  sanitizeImportedSpellRecord
} from './canonicalSpellContract';

export {
  TRANSIENT_WIZARD_KEYS,
  APPROVAL_REVISION_METADATA_KEYS,
  OUTER_PERSISTENCE_METADATA_KEYS,
  LIBRARY_METADATA_KEYS,
  DERIVED_DISPLAY_KEYS,
  DRAFT_EXCLUDED_KEYS,
  WIZARD_ONLY_KEYS,
  sanitizeImportedSpellRecord
};

const ALL_DRAFT_STRIP_KEYS = new Set([
  ...DRAFT_EXCLUDED_KEYS,
  ...DERIVED_DISPLAY_KEYS
]);

const EFFECT_CONFIG_KEYS = Object.freeze([
  'damageConfig',
  'healingConfig',
  'buffConfig',
  'debuffConfig',
  'utilityConfig',
  'controlConfig',
  'summoningConfig',
  'transformationConfig',
  'purificationConfig',
  'restorationConfig'
]);

const cloneJson = cloneCanonicalJson;

const safeIconValue = (value) => (
  typeof value === 'string' && value.trim() && !/[<>]/.test(value)
    ? value.trim()
    : null
);

/**
 * Normalizes targetingConfig with the 11-field save-boundary shape while preserving
 * explicit zeroes (e.g., rangeDistance: 0) and explicit undefined values.
 */
export function finalizeTargetingConfig(targetingConfig) {
  const src = targetingConfig && typeof targetingConfig === 'object' ? targetingConfig : {};
  return {
    ...src,
    aoeType: src.aoeType || src.aoeShape || 'sphere',
    targetingType: src.targetingType || 'single',
    rangeType: src.rangeType || 'ranged',
    rangeDistance: src.rangeDistance,
    aoeShape: src.aoeShape || 'circle',
    aoeParameters: src.aoeParameters ? cloneJson(src.aoeParameters) : {},
    targetRestrictions: src.targetRestrictions ||
      (src.targetRestriction ? [src.targetRestriction] : ['any']),
    maxTargets: src.maxTargets,
    selectionMethod: src.selectionMethod || src.targetSelectionMethod || 'manual',
    targetSelectionMethod: src.targetSelectionMethod || src.selectionMethod || 'manual',
    movementBehavior: src.movementBehavior || 'static'
  };
}

/**
 * Resolves the canonical spell icon, giving precedence to the Wizard's typeConfig.icon
 * (written by Step1BasicInfo / IconSelector) before falling back to root icon or inferred effect icon.
 */
export function resolveCanonicalSpellIcon(wizardState) {
  const typeIcon = safeIconValue(wizardState?.typeConfig?.icon);
  const rootIcon = safeIconValue(wizardState?.icon);
  const chosenIcon = typeIcon || (rootIcon && rootIcon !== 'inv_misc_questionmark' ? rootIcon : null) || rootIcon;
  if (chosenIcon) return chosenIcon;
  return extractSpellIcon({ ...wizardState, icon: null });
}

/**
 * Extracts canonical damageTypes array without fabricating ['arcane'] when unset
 * and without clobbering damage-config element alignment (e.g. Hunter Flow primal/stabbing).
 */
export function extractCanonicalDamageTypes(wizardState) {
  const tc = wizardState?.typeConfig || {};
  const dc = wizardState?.damageConfig;
  const hasDamageEffect = Array.isArray(wizardState?.effectTypes) && wizardState.effectTypes.includes('damage');

  if (hasDamageEffect && dc) {
    if (tc.secondaryElement) {
      return [tc.school, tc.secondaryElement].filter(Boolean);
    }
    if (Array.isArray(dc.damageTypes) && dc.damageTypes.length > 0) {
      return [...dc.damageTypes];
    }
    if (dc.elementType) {
      return [dc.elementType];
    }
    if (tc.school) {
      return [tc.school];
    }
  }

  const fromType = [tc.school, tc.secondaryElement].filter(Boolean);
  if (fromType.length > 0) {
    return fromType;
  }
  if (Array.isArray(wizardState?.damageTypes) && wizardState.damageTypes.length > 0) {
    return [...wizardState.damageTypes];
  }
  if (dc?.elementType) {
    return [dc.elementType];
  }
  return [];
}

/**
 * Generates a unique readable slug ID for newly authored library spells.
 */
export function generateCanonicalSpellId(name) {
  const base = String(name || 'spell')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'spell';
  const timestamp = Date.now().toString(36);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${timestamp}-${suffix}`;
}

/**
 * Shared pre-save validation across Header Finalize, Step 10 Review, and Floating Preview.
 */
export function validateCanonicalSpellSave(wizardState) {
  if (!wizardState || typeof wizardState.name !== 'string' || wizardState.name.trim() === '') {
    return {
      ok: false,
      error: 'Please enter a spell name before saving.'
    };
  }
  return { ok: true };
}

/**
 * Builds the pure authoredDraft object from live Wizard state (or loaded draft),
 * excluding all transient UI flags and Library persistence metadata.
 */
export function buildAuthoredDraft(wizardState) {
  const src = wizardState && typeof wizardState === 'object' ? wizardState : {};
  const baseEntries = Object.entries(src).filter(([key]) => !ALL_DRAFT_STRIP_KEYS.has(key));
  const draft = cloneJson(Object.fromEntries(baseEntries));

  draft.name = src.name !== undefined && src.name !== null ? String(src.name) : '';
  draft.description = src.description !== undefined && src.description !== null ? String(src.description) : '';
  if (src.level !== undefined) {
    draft.level = src.level;
  }

  draft.spellType = src.spellType || 'ACTION';
  draft.typeConfig = src.typeConfig ? cloneJson(src.typeConfig) : {};
  draft.icon = resolveCanonicalSpellIcon({ ...src, typeConfig: draft.typeConfig });
  draft.effectTypes = Array.isArray(src.effectTypes) ? cloneJson(src.effectTypes) : [];
  draft.effectsMap = src.effectsMap ? cloneJson(src.effectsMap) : {};
  draft.tags = Array.from(new Set([
    ...(draft.typeConfig?.tags || []),
    ...(draft.effectTypes || []),
    ...(Array.isArray(src.tags) ? src.tags : [])
  ].filter(Boolean)));

  for (const key of EFFECT_CONFIG_KEYS) {
    draft[key] = src[key] ? cloneJson(src[key]) : null;
  }
  if (!draft.summoningConfig && src.summonConfig) {
    draft.summoningConfig = cloneJson(src.summonConfig);
  }
  if (!draft.transformationConfig && src.transformConfig) {
    draft.transformationConfig = cloneJson(src.transformConfig);
  }
  delete draft.summonConfig;
  delete draft.transformConfig;

  draft.rollableTable = src.rollableTable ? cloneJson(src.rollableTable) : null;
  draft.effectResolutions = src.effectResolutions ? cloneJson(src.effectResolutions) : {};
  draft.effectMechanicsConfigs = src.effectMechanicsConfigs ? cloneJson(src.effectMechanicsConfigs) : {};
  draft.mechanicsAvailableEffects = Array.isArray(src.mechanicsAvailableEffects) ? cloneJson(src.mechanicsAvailableEffects) : [];
  draft.combinedEffects = Array.isArray(src.combinedEffects) ? cloneJson(src.combinedEffects) : [];
  draft.mechanicsAvailableCombinedEffects = Array.isArray(src.mechanicsAvailableCombinedEffects)
    ? cloneJson(src.mechanicsAvailableCombinedEffects)
    : [];

  draft.targetingConfig = cloneJson(finalizeTargetingConfig(src.targetingConfig));
  draft.targetingMode = src.targetingMode || 'unified';
  draft.effectTargeting = src.effectTargeting ? cloneJson(src.effectTargeting) : {};
  draft.targetingTags = src.targetingTags ? cloneJson(src.targetingTags) : {};

  draft.durationConfig = src.durationConfig ? cloneJson(src.durationConfig) : {};
  draft.persistentConfig = src.persistentConfig ? cloneJson(src.persistentConfig) : {};
  draft.propagation = src.propagation ? cloneJson(src.propagation) : null;

  draft.resourceCost = src.resourceCost ? cloneJson(src.resourceCost) : null;
  draft.cooldownConfig = src.cooldownConfig ? cloneJson(src.cooldownConfig) : {};
  draft.channelingConfig = src.channelingConfig ? cloneJson(src.channelingConfig) : {};
  draft.trapConfig = src.trapConfig ? cloneJson(src.trapConfig) : {};

  if (src.triggerConfig !== undefined) {
    draft.triggerConfig = src.triggerConfig ? cloneJson(src.triggerConfig) : null;
  }
  draft.mechanicsConfig = src.mechanicsConfig ? cloneJson(src.mechanicsConfig) : null;
  if (src.prophecyOptions !== undefined) {
    draft.prophecyOptions = src.prophecyOptions ? cloneJson(src.prophecyOptions) : null;
  }

  return draft;
}

function buildProphecyConfigProjection(po) {
  const parseRangeDice = (dice) => {
    if (Array.isArray(dice)) return dice;
    if (typeof dice === 'string' && dice.includes('+')) return dice.split('+').map(d => d.trim());
    return [dice];
  };
  const buildEffect = (outcome) => {
    if (!outcome || !outcome.effectName) return undefined;
    const effect = { name: outcome.effectName };
    if (outcome.duration > 0) effect.duration = outcome.duration;
    if (outcome.durationUnit && outcome.durationUnit !== 'rounds') effect.unit = outcome.durationUnit;
    if (outcome.damagePerRound) {
      effect.damagePerRound = outcome.damagePerRound;
      if (outcome.damagePerRoundType) effect.damageType = outcome.damagePerRoundType;
    }
    if (Array.isArray(outcome.statModifiers) && outcome.statModifiers.length > 0) {
      effect.statModifiers = cloneJson(outcome.statModifiers);
    }
    if (outcome.healingBlock) effect.healingBlock = true;
    if (outcome.bonusDamageTaken) {
      effect.bonusDamageTaken = outcome.bonusDamageTaken;
      if (outcome.bonusDamageType) effect.bonusDamageType = outcome.bonusDamageType;
    }
    if (outcome.saveDC > 0) {
      effect.saveDC = outcome.saveDC;
      if (outcome.saveType) effect.saveType = outcome.saveType;
    }
    if (outcome.instantKill) effect.instantKill = true;
    if (outcome.instantKillThreshold > 0) effect.instantKillThreshold = outcome.instantKillThreshold;
    if (outcome.cascadeDamage) {
      effect.cascadeDamage = outcome.cascadeDamage;
      effect.cascadeRange = outcome.cascadeRange ?? 10;
    }
    if (outcome.description) effect.description = outcome.description;
    return effect;
  };
  const buildOutcome = (outcome) => {
    if (!outcome) return undefined;
    const result = {};
    if (outcome.damage) result.damage = outcome.damage;
    const effect = buildEffect(outcome);
    if (effect) result.effect = effect;
    if (outcome.havocGain !== undefined) result.havocGain = outcome.havocGain;
    if (outcome.description) result.description = outcome.description;
    return result;
  };
  const outside = po.outside || {};
  const outsideResult = {};
  if (outside.backlash) outsideResult.backlash = outside.backlash;
  if (outside.havocGain !== undefined) outsideResult.havocGain = outside.havocGain;
  if (outside.description) outsideResult.description = outside.description;

  return {
    rangeDice: parseRangeDice(po.rangeDice),
    resolutionDie: po.resolutionDie,
    prophesied: buildOutcome(po.prophesied) || { havocGain: po.prophesied?.havocGain ?? 3 },
    base: buildOutcome(po.base) || { havocGain: po.base?.havocGain ?? 1 },
    outside: outsideResult
  };
}

function attachClassDisplayFields(record, authoredDraft) {
  const rv = authoredDraft.resourceCost?.resourceValues || {};

  // Pyrofiend Inferno Veil (only when actually configured)
  if (rv.inferno_required !== undefined || rv.inferno_ascend !== undefined || rv.inferno_descend !== undefined) {
    record.specialMechanics = {
      ...record.specialMechanics,
      infernoLevel: {
        required: rv.inferno_required ?? 0,
        ascendBy: rv.inferno_ascend ?? 0,
        descendBy: rv.inferno_descend ?? 0
      }
    };
    record.infernoRequired = rv.inferno_required;
    record.infernoAscend = rv.inferno_ascend;
    record.infernoDescend = rv.inferno_descend;
  }

  // Chronarch Time Shards (supports both Step 5 singular time_shard_* and legacy plural time_shards_*)
  const tsGenerate = rv.time_shard_generate ?? rv.time_shards_generate;
  if (tsGenerate !== undefined && tsGenerate > 0) {
    record.specialMechanics = {
      ...record.specialMechanics,
      timeShards: {
        generated: tsGenerate
      }
    };
    record.timeShardGenerate = tsGenerate;
  }

  const tsCost = rv.time_shard_cost ?? rv.time_shards_cost;
  if (tsCost !== undefined || rv.temporal_strain_gain !== undefined || rv.temporal_strain_reduce !== undefined) {
    record.specialMechanics = {
      ...record.specialMechanics,
      temporalFlux: {
        shardCost: tsCost ?? 0,
        strainGained: rv.temporal_strain_gain ?? 0,
        strainReduced: rv.temporal_strain_reduce ?? 0
      }
    };
    record.timeShardCost = tsCost;
    record.temporalStrainGain = rv.temporal_strain_gain;
    record.temporalStrainReduce = rv.temporal_strain_reduce;
  }

  // Martyr Devotion Level (only when actually configured)
  if (rv.devotion_required !== undefined || rv.devotion_cost !== undefined || rv.devotion_gain !== undefined) {
    record.specialMechanics = {
      ...record.specialMechanics,
      devotionLevel: {
        required: rv.devotion_required ?? 0,
        cost: rv.devotion_cost ?? 0,
        amplifiedCost: rv.devotion_cost ?? 0,
        gain: rv.devotion_gain ?? 0
      }
    };
    record.devotionRequired = rv.devotion_required;
    record.devotionCost = rv.devotion_cost;
    record.devotionGain = rv.devotion_gain;
  }

  // Doomsayer Prophecy Options (only when enabled)
  if (authoredDraft.prophecyOptions && authoredDraft.prophecyOptions.enabled !== false) {
    record.prophecyConfig = buildProphecyConfigProjection(authoredDraft.prophecyOptions);
    record.resolution = 'PROPHECY';
  }
}

/**
 * Builds the complete canonical library record from live Wizard state + edit identity,
 * guaranteeing that every authored field on the outer record matches authoredDraft
 * and serializedData while separating Library metadata cleanly.
 */
export function buildCanonicalSpellRecord({
  wizardState,
  isEditing = false,
  editingSpellId = null,
  existingSpell = null,
  now = null
}) {
  const authoredDraft = buildAuthoredDraft(wizardState);
  const serializedData = JSON.stringify(authoredDraft, null, 2);
  const nowIso = now || new Date().toISOString();

  // Mirror authoredDraft on outer record so authoredAbility's outer/draft parity
  // never observes fallback drift across create or update.
  const record = cloneJson(authoredDraft);

  // Derived outer card-display properties (outside authoredDraft)
  record.icon = authoredDraft.icon;
  record.effectType = authoredDraft.effectTypes.length > 0
    ? authoredDraft.effectTypes[0]
    : (authoredDraft.rollableTable?.enabled ? 'outcome' : 'utility');
  record.damageTypes = extractCanonicalDamageTypes(authoredDraft);
  record.tags = [...authoredDraft.tags];

  attachClassDisplayFields(record, authoredDraft);

  // Library identity & persistence metadata (strictly outside authoredDraft/serializedData)
  const resolvedId = (isEditing && editingSpellId)
    ? editingSpellId
    : generateCanonicalSpellId(authoredDraft.name);

  record.source = wizardState?.source || existingSpell?.source || 'wizard';
  record.isCustom = wizardState?.isCustom ?? existingSpell?.isCustom ?? true;

  const resolvedCategoryIds = (Array.isArray(wizardState?.categoryIds) && wizardState.categoryIds.length > 0)
    ? [...wizardState.categoryIds]
    : (Array.isArray(existingSpell?.categoryIds) && existingSpell.categoryIds.length > 0)
      ? [...existingSpell.categoryIds]
      : categorizeSpell(record);

  const resolvedCategories = Array.isArray(wizardState?.categories)
    ? [...wizardState.categories]
    : (Array.isArray(existingSpell?.categories) ? [...existingSpell.categories] : ['all']);

  record.id = resolvedId;
  record.authoredDefinitionId = wizardState?.authoredDefinitionId || existingSpell?.authoredDefinitionId || crypto.randomUUID();
  record.categoryIds = resolvedCategoryIds;
  record.categories = resolvedCategories;
  record.dateCreated = (isEditing && (wizardState?.dateCreated || existingSpell?.dateCreated))
    ? (wizardState?.dateCreated || existingSpell.dateCreated)
    : nowIso;
  record.lastModified = nowIso;
  record.lastSaved = nowIso;

  // Preserve outer approval/revision metadata across both create and update without
  // writing it into authoredDraft or serializedData.
  for (const key of APPROVAL_REVISION_METADATA_KEYS) {
    if (wizardState?.[key] !== undefined) {
      record[key] = cloneJson(wizardState[key]);
    } else if (isEditing && existingSpell?.[key] !== undefined) {
      record[key] = cloneJson(existingSpell[key]);
    }
  }

  // Preserve outer cloud/library persistence metadata when explicitly present on wizardState
  // or existingSpell (during edit) so returned records and cloud sync payloads keep bindings intact.
  for (const key of OUTER_PERSISTENCE_METADATA_KEYS) {
    if (wizardState?.[key] !== undefined) {
      record[key] = cloneJson(wizardState[key]);
    } else if (isEditing && existingSpell?.[key] !== undefined) {
      record[key] = cloneJson(existingSpell[key]);
    }
  }

  record.authoredDraft = authoredDraft;
  record.serializedData = serializedData;

  return record;
}

/**
 * Single canonical save executor invoked by Header Finalize/Update, Step 10 Review
 * Save/Update, and floating ExternalLivePreview Complete/Update.
 */
export async function executeCanonicalSpellSave({
  wizardState,
  isEditing = false,
  editingSpellId = null,
  library = null,
  libraryDispatch,
  wizardDispatch,
  addCustomSpell = null,
  user = null
}) {
  const validation = validateCanonicalSpellSave(wizardState);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const editing = Boolean(isEditing && editingSpellId);
  const existingSpell = (editing && Array.isArray(library?.spells))
    ? (library.spells.find(s => s.id === editingSpellId) || null)
    : null;

  const spell = buildCanonicalSpellRecord({
    wizardState,
    isEditing: editing,
    editingSpellId,
    existingSpell
  });

  if (editing) {
    libraryDispatch(libraryActionCreators.updateSpell(editingSpellId, spell));
    if (typeof wizardDispatch === 'function') {
      wizardDispatch(actionCreators.setEditMode(false, null));
    }
  } else {
    libraryDispatch(libraryActionCreators.addSpell(spell));
    if (typeof addCustomSpell === 'function') {
      addCustomSpell(spell);
    }
  }

  let cloudResult = null;
  if (user?.uid && !user?.isGuest && typeof saveUserSpell === 'function') {
    try {
      cloudResult = await saveUserSpell(user.uid, spell);
    } catch (cloudError) {
      console.warn('Cloud spell sync failed after local save:', cloudError);
      cloudResult = { success: false, localOnly: true, error: cloudError?.message };
    }
  }

  return {
    ok: true,
    mode: editing ? 'update' : 'create',
    spell,
    cloudResult
  };
}
