/**
 * Project 5 — local private draft envelope (Slice 1).
 *
 * Frozen envelope contract for every P5-authored private draft / collection:
 *
 *   {
 *     schemaVersion, scopeKind, scopeId,
 *     draftId, localRevision, updatedAt,
 *     sourceProvenance, cloudBinding, cloudBaselineRevision,
 *     dirty, confirmedRevision,
 *     payload
 *   }
 *
 * Rules frozen by the architecture review:
 *  - draftId is a LOCAL working identity; campaignId/roomId/characterId or an
 *    imported ID never substitutes for draftId and never proves ownership
 *  - localRevision is a positive safe integer, monotonic within a lineage
 *  - confirmedRevision is metadata only: it can never exceed localRevision and
 *    never mutates payload revision
 *  - updatedAt is informational and never precedence proof
 *  - a cloud binding is a local baseline record, NOT permission to overwrite;
 *    the later cloud writer must validate the baseline transactionally
 */

import { validateScope, scopesEqual } from './scopeModel';

export const DRAFT_ENVELOPE_SCHEMA_VERSION = 1;
export const SUPPORTED_DRAFT_SCHEMA_VERSIONS = Object.freeze([1]);

export const SOURCE_PROVENANCE_KINDS = Object.freeze([
  'legacy-local',
  'import',
  'fork',
  'migration',
  'manual',
  'cloud',
  'unknown'
]);

export const ENVELOPE_CODES = Object.freeze({
  NOT_OBJECT: 'ENVELOPE_INVALID',
  SCHEMA_UNSUPPORTED: 'SCHEMA_UNSUPPORTED',
  SCOPE_INVALID: 'SCOPE_INVALID',
  DRAFT_ID_INVALID: 'DRAFT_ID_INVALID',
  REVISION_INVALID: 'REVISION_INVALID',
  CONFIRMED_INVALID: 'CONFIRMED_INVALID',
  DIRTY_INVALID: 'DIRTY_INVALID',
  UPDATED_AT_INVALID: 'UPDATED_AT_INVALID',
  PAYLOAD_INVALID: 'PAYLOAD_INVALID',
  PROVENANCE_INVALID: 'PROVENANCE_INVALID',
  CLOUD_BINDING_INVALID: 'CLOUD_BINDING_INVALID',
  WRONG_SCOPE: 'WRONG_SCOPE'
});

const isSafeRevision = (value) => Number.isSafeInteger(value) && value > 0;
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

/** Loose shape validation for migration/fork/import provenance. */
export function validateSourceProvenance(provenance) {
  if (provenance === null || provenance === undefined) return { ok: true };
  if (typeof provenance !== 'object' || Array.isArray(provenance)) {
    return { ok: false, reason: 'provenance-not-object' };
  }
  if (provenance.kind !== undefined && !SOURCE_PROVENANCE_KINDS.includes(provenance.kind)) {
    return { ok: false, reason: `provenance-kind-invalid:${String(provenance.kind)}` };
  }
  for (const field of ['sourceKey', 'sourceId', 'sourceFingerprint', 'importedFromDraftId', 'importedCloudId']) {
    const value = provenance[field];
    if (value !== undefined && value !== null && typeof value !== 'string') {
      return { ok: false, reason: `provenance-field-invalid:${field}` };
    }
  }
  if (provenance.sourceSchemaVersion !== undefined &&
    provenance.sourceSchemaVersion !== null &&
    !Number.isSafeInteger(provenance.sourceSchemaVersion)) {
    return { ok: false, reason: 'provenance-source-version-invalid' };
  }
  return { ok: true };
}

/**
 * Local-only cloud binding representation. A binding is a candidate baseline,
 * not overwrite authority.
 */
export function validateCloudBinding(binding) {
  if (binding === null || binding === undefined) return { ok: true };
  if (typeof binding !== 'object' || Array.isArray(binding)) {
    return { ok: false, reason: 'cloud-binding-not-object' };
  }
  if (binding.targetKind !== undefined && !isNonEmptyString(binding.targetKind)) {
    return { ok: false, reason: 'cloud-binding-target-kind-invalid' };
  }
  if (binding.path !== undefined && binding.path !== null && !isNonEmptyString(binding.path)) {
    return { ok: false, reason: 'cloud-binding-path-invalid' };
  }
  if (binding.documentInstanceId !== undefined &&
    binding.documentInstanceId !== null &&
    !isNonEmptyString(binding.documentInstanceId)) {
    return { ok: false, reason: 'cloud-binding-document-instance-invalid' };
  }
  if (binding.baselineRevision !== undefined &&
    binding.baselineRevision !== null &&
    !isSafeRevision(binding.baselineRevision)) {
    return { ok: false, reason: 'cloud-binding-baseline-invalid' };
  }
  return { ok: true };
}

/**
 * Validate a serialized draft envelope.
 *
 * @param {unknown} value
 * @param {{ expectedScope?: object|null }} [options]
 * @returns {{ ok: true, envelope: object } | { ok: false, code: string, reason: string }}
 */
export function validateDraftEnvelope(value, options = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, code: ENVELOPE_CODES.NOT_OBJECT, reason: 'envelope-not-object' };
  }
  if (!SUPPORTED_DRAFT_SCHEMA_VERSIONS.includes(value.schemaVersion)) {
    return { ok: false, code: ENVELOPE_CODES.SCHEMA_UNSUPPORTED, reason: `schema-version:${String(value.schemaVersion)}` };
  }
  const scopeValidation = validateScope({ scopeKind: value.scopeKind, scopeId: value.scopeId });
  if (!scopeValidation.ok) {
    return { ok: false, code: ENVELOPE_CODES.SCOPE_INVALID, reason: scopeValidation.reason };
  }
  if (!isNonEmptyString(value.draftId)) {
    return { ok: false, code: ENVELOPE_CODES.DRAFT_ID_INVALID, reason: 'draft-id-missing' };
  }
  if (!isSafeRevision(value.localRevision)) {
    return { ok: false, code: ENVELOPE_CODES.REVISION_INVALID, reason: 'local-revision-invalid' };
  }
  if (value.confirmedRevision !== null &&
    value.confirmedRevision !== undefined &&
    (!Number.isSafeInteger(value.confirmedRevision) ||
      value.confirmedRevision < 0 ||
      value.confirmedRevision > value.localRevision)) {
    return { ok: false, code: ENVELOPE_CODES.CONFIRMED_INVALID, reason: 'confirmed-revision-invalid' };
  }
  if (typeof value.dirty !== 'boolean') {
    return { ok: false, code: ENVELOPE_CODES.DIRTY_INVALID, reason: 'dirty-flag-invalid' };
  }
  if (value.updatedAt !== undefined && value.updatedAt !== null && typeof value.updatedAt !== 'string') {
    return { ok: false, code: ENVELOPE_CODES.UPDATED_AT_INVALID, reason: 'updated-at-invalid' };
  }
  if (value.payload === undefined) {
    return { ok: false, code: ENVELOPE_CODES.PAYLOAD_INVALID, reason: 'payload-missing' };
  }
  const provenanceValidation = validateSourceProvenance(value.sourceProvenance ?? null);
  if (!provenanceValidation.ok) {
    return { ok: false, code: ENVELOPE_CODES.PROVENANCE_INVALID, reason: provenanceValidation.reason };
  }
  const bindingValidation = validateCloudBinding(value.cloudBinding ?? null);
  if (!bindingValidation.ok) {
    return { ok: false, code: ENVELOPE_CODES.CLOUD_BINDING_INVALID, reason: bindingValidation.reason };
  }

  if (options.expectedScope) {
    const expectedValidation = validateScope(options.expectedScope);
    if (!expectedValidation.ok) {
      return { ok: false, code: ENVELOPE_CODES.SCOPE_INVALID, reason: `expected-${expectedValidation.reason}` };
    }
    const storedScope = { scopeKind: value.scopeKind, scopeId: value.scopeId };
    if (!scopesEqual(storedScope, options.expectedScope)) {
      return { ok: false, code: ENVELOPE_CODES.WRONG_SCOPE, reason: 'envelope-scope-mismatch' };
    }
  }

  return { ok: true, envelope: value };
}

/**
 * Create a validated, frozen envelope.
 *
 * Business IDs belong inside `payload`; they are never consulted for scope.
 */
export function createDraftEnvelope({
  scope,
  draftId,
  payload,
  localRevision = 1,
  updatedAt = null,
  sourceProvenance = null,
  cloudBinding = null,
  dirty = true,
  confirmedRevision = null
} = {}) {
  const envelope = {
    schemaVersion: DRAFT_ENVELOPE_SCHEMA_VERSION,
    scopeKind: scope?.scopeKind,
    scopeId: scope?.scopeId,
    draftId,
    localRevision,
    updatedAt: updatedAt || new Date().toISOString(),
    sourceProvenance,
    cloudBinding,
    cloudBaselineRevision: cloudBinding?.baselineRevision ?? null,
    dirty,
    confirmedRevision,
    payload
  };
  const validation = validateDraftEnvelope(envelope, { expectedScope: scope });
  if (!validation.ok) {
    throw new Error(`P5 draft envelope: ${validation.code}: ${validation.reason}`);
  }
  return Object.freeze({
    ...envelope,
    sourceProvenance: envelope.sourceProvenance
      ? Object.freeze({ ...envelope.sourceProvenance })
      : null,
    cloudBinding: envelope.cloudBinding
      ? Object.freeze({ ...envelope.cloudBinding })
      : null
  });
}

/** Structural predicate used by writers to distinguish envelopes from raw payloads. */
export function isDraftEnvelopeLike(value) {
  return !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.schemaVersion === 'number' &&
    typeof value.scopeKind === 'string' &&
    typeof value.draftId === 'string' &&
    typeof value.localRevision === 'number';
}

/** Produce the next revision for a content edit. Payload is supplied by caller. */
export function bumpLocalRevision(envelope, nextPayload) {
  const validation = validateDraftEnvelope(envelope);
  if (!validation.ok) {
    throw new Error(`P5 draft envelope: ${validation.code}: ${validation.reason}`);
  }
  return createDraftEnvelope({
    scope: { scopeKind: envelope.scopeKind, scopeId: envelope.scopeId },
    draftId: envelope.draftId,
    payload: nextPayload === undefined ? envelope.payload : nextPayload,
    localRevision: envelope.localRevision + 1,
    sourceProvenance: envelope.sourceProvenance,
    cloudBinding: envelope.cloudBinding,
    dirty: true,
    confirmedRevision: envelope.confirmedRevision
  });
}

/**
 * Metadata-only confirmation of an exact saved revision. Cannot exceed the
 * current local revision and cannot mutate payload content.
 */
export function confirmRevision(envelope, confirmedRevision) {
  const validation = validateDraftEnvelope(envelope);
  if (!validation.ok) {
    throw new Error(`P5 draft envelope: ${validation.code}: ${validation.reason}`);
  }
  if (!Number.isSafeInteger(confirmedRevision) ||
    confirmedRevision <= 0 ||
    confirmedRevision > envelope.localRevision) {
    throw new Error('P5 draft envelope: confirmed revision must not exceed localRevision');
  }
  return Object.freeze({
    ...envelope,
    confirmedRevision,
    // Clears dirty only for the exact newest revision; an in-flight older save
    // confirmation leaves a newer dirty edit untouched.
    dirty: confirmedRevision === envelope.localRevision ? false : envelope.dirty
  });
}
