/**
 * Pure, dependency-free Spell Wizard canonical contract constants & import hygiene.
 *
 * Shared by canonicalSpellSave.js, SpellLibraryContext.js, libraryManager.js,
 * spellSerializer.js, and SpellwizardApp.jsx without introducing circular imports
 * or pulling React/Firebase into pure utility modules.
 */

/** Transient Wizard editing/UI session flags — excluded from both draft and outer saved record. */
export const TRANSIENT_WIZARD_KEYS = Object.freeze([
  'editMode',
  'editingSpellId',
  'errors',
  'warnings',
  'validation',
  'isValid',
  'currentStep',
  'completedSteps',
  'wizardFlow'
]);

/** Outer approval/revision metadata — preserved on library record, never written into authoredDraft or serializedData. */
export const APPROVAL_REVISION_METADATA_KEYS = Object.freeze([
  'approvalRevision',
  'approvedRevision',
  'approvalStatus',
  'approvalMetadata',
  'approvalHistory',
  'approvedAt',
  'approvedBy',
  'approvedHash',
  'approvedDefinitionVersion',
  'definitionVersion',
  'revision',
  'localRevision',
  'confirmedRevision',
  'registryRevision'
]);

/** Outer library persistence metadata preserved across edit/update cycles. */
export const OUTER_PERSISTENCE_METADATA_KEYS = Object.freeze([
  'folderId',
  'isShared',
  'userId',
  'createdAt',
  'updatedAt',
  'isUserCreated'
]);

/** Outer library persistence/display metadata — excluded from authoredDraft and serializedData. */
export const LIBRARY_METADATA_KEYS = Object.freeze([
  'id',
  'authoredDefinitionId',
  'categoryIds',
  'categories',
  'source',
  'isCustom',
  'isUserCreated',
  'createdAt',
  'updatedAt',
  'userId',
  'lastSaved',
  'dateCreated',
  'lastModified',
  'folderId',
  'isShared',
  'humanReadable',
  'gameCode',
  ...APPROVAL_REVISION_METADATA_KEYS
]);

/** Derived outer card-display keys synthesized from authored config; never stored in authoredDraft. */
export const DERIVED_DISPLAY_KEYS = Object.freeze([
  'specialMechanics',
  'prophecyConfig',
  'infernoRequired',
  'infernoAscend',
  'infernoDescend',
  'timeShardGenerate',
  'timeShardCost',
  'temporalStrainGain',
  'temporalStrainReduce',
  'devotionRequired',
  'devotionCost',
  'devotionGain'
]);

/** Keys stripped from Wizard state when producing the executable authoredDraft subject. */
export const DRAFT_EXCLUDED_KEYS = Object.freeze([
  ...TRANSIENT_WIZARD_KEYS,
  ...LIBRARY_METADATA_KEYS,
  'authoredDraft',
  'serializedData'
]);

/** Compatibility alias matching executionCompatibility.WIZARD_ONLY_KEYS. */
export const WIZARD_ONLY_KEYS = DRAFT_EXCLUDED_KEYS;

export const cloneCanonicalJson = (value) => (
  value === undefined ? undefined : JSON.parse(JSON.stringify(value))
);

/**
 * Sanitizes an imported spell record under the canonical contract:
 *   - Deep-clones the record so imported entries never share references with caller inputs.
 *   - Strips accidental transient Wizard UI session keys from the outer record.
 *   - Preserves outer approval/revision metadata, authoredDefinitionId, per-effect targeting,
 *     authored expiry, rollableTable branches, manual options, and legacy records without
 *     fabricating an authoredDraft when one did not exist.
 */
export function sanitizeImportedSpellRecord(rawSpell) {
  if (!rawSpell || typeof rawSpell !== 'object' || Array.isArray(rawSpell)) {
    return null;
  }
  const copy = cloneCanonicalJson(rawSpell);
  for (const key of TRANSIENT_WIZARD_KEYS) {
    delete copy[key];
  }
  return copy;
}
