/**
 * Project 5 Wave A (S3) — source preservation and recovery receipts.
 *
 * Copy-before-switch primitive for later legacy migration:
 *
 *   raw source -> fingerprint -> copy candidate -> verify candidate
 *   -> verify destination (transformed case) -> write receipt
 *
 * Wave A never migrates or deletes legacy families. The source is never
 * deleted by anything in this module; a receipt for source fingerprint X can
 * never validate a modified source Y, another source key, or an unverified
 * destination. A receipt is only produced by completing an actual verified
 * copy/destination. Fingerprints and receipts are integrity/provenance
 * evidence, never account ownership proof.
 */

import { buildScopedKey, parseP5ScopedKey } from './keyFormat';
import { readDurable, writeDurable } from './protectedStorage';
import { validateScope } from './scopeModel';
import { readScopedRecord, READ_STATUS } from './safeRead';
import { validateDraftEnvelope, SUPPORTED_DRAFT_SCHEMA_VERSIONS } from './draftEnvelope';

export const RECOVERY_RECEIPT_KIND = 'p5-recovery-receipt';
export const RECOVERY_RECEIPT_SCHEMA_VERSION = 1;
export const RECEIPT_VERIFICATION_KINDS = Object.freeze({
  RAW_COPY: 'raw-recovery-copy',
  TRANSFORMED: 'transformed-draft'
});
export const QUARANTINE_FAMILY_TOKEN = 'preservation.quarantine';
export const RECEIPT_FAMILY_TOKEN = 'preservation.receipts';
export const FINGERPRINT_ALGORITHM = 'fnv1a-32-hex';

/** Deterministic FNV-1a 32-bit hex fingerprint (integrity/provenance only). */
export function fingerprintRawString(raw) {
  const input = typeof raw === 'string' ? raw : String(raw ?? '');
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return {
    algorithm: FINGERPRINT_ALGORITHM,
    value: hash.toString(16).padStart(8, '0'),
    length: input.length
  };
}

/** Fingerprint the raw value currently stored at a key. */
export function fingerprintStorageKey(key, storage = null) {
  const read = readDurable(key, storage);
  if (!read.ok) return { ok: false, reason: read.reason };
  if (read.raw === null) return { ok: false, reason: 'source-missing' };
  return { ok: true, raw: read.raw, fingerprint: fingerprintRawString(read.raw) };
}

function canonicalPayloadFingerprint(payload) {
  try {
    return fingerprintRawString(JSON.stringify(payload));
  } catch (_error) {
    return null;
  }
}

export function buildQuarantineKey({ scope, sourceKey, fingerprintValue, destinationRef = 'legacy' }) {
  return buildScopedKey({
    scope,
    familyId: QUARANTINE_FAMILY_TOKEN,
    locator: [destinationRef, sourceKey, fingerprintValue]
  });
}

export function buildReceiptKey({ scope, receiptId }) {
  return buildScopedKey({ scope, familyId: RECEIPT_FAMILY_TOKEN, locator: [receiptId] });
}

/**
 * preserveSourceCopy — copy-before-switch. The source is read once and never
 * modified. Failure at any step leaves the source recoverable.
 */
export function preserveSourceCopy({ sourceKey, sourceFamilyId = null, scope, storage = null, destinationRef = 'legacy' }) {
  const scopeValidation = validateScope(scope);
  if (!scopeValidation.ok) {
    return { ok: false, reason: `invalid-scope:${scopeValidation.reason}`, sourcePreserved: true };
  }
  const read = readDurable(sourceKey, storage);
  if (!read.ok) return { ok: false, reason: 'source-read-failed', sourcePreserved: true };
  if (read.raw === null) return { ok: false, reason: 'source-missing', sourcePreserved: true };

  const fingerprint = fingerprintRawString(read.raw);
  const copyKey = buildQuarantineKey({
    scope,
    sourceKey,
    fingerprintValue: fingerprint.value,
    destinationRef
  });

  const copyWrite = writeDurable(copyKey, read.raw, storage);
  if (copyWrite.status !== 'OK') {
    return { ok: false, reason: 'copy-write-failed', fingerprint, copyKey, sourcePreserved: true };
  }

  const copyRead = readDurable(copyKey, storage);
  if (!copyRead.ok || copyRead.raw === null) {
    return { ok: false, reason: 'copy-verify-read-failed', fingerprint, copyKey, sourcePreserved: true };
  }
  if (fingerprintRawString(copyRead.raw).value !== fingerprint.value) {
    return { ok: false, reason: 'copy-verify-failed', fingerprint, copyKey, sourcePreserved: true };
  }

  return {
    ok: true,
    kind: RECEIPT_VERIFICATION_KINDS.RAW_COPY,
    sourceKey,
    sourceFamilyId,
    copyKey,
    fingerprint,
    sourcePreserved: true,
    sourceUntouched: true
  };
}

/**
 * Internal receipt creation. Not exported: a receipt cannot be manufactured
 * by a direct caller supplying `status:'completed'`. Only the completion
 * helpers below produce receipts, and only after actual verification.
 */
function createVerifiedReceipt(fields) {
  const receipt = {
    kind: RECOVERY_RECEIPT_KIND,
    schemaVersion: RECOVERY_RECEIPT_SCHEMA_VERSION,
    receiptId: `receipt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`,
    verificationKind: fields.verificationKind,
    sourceKey: fields.sourceKey,
    sourceFamilyId: fields.sourceFamilyId ?? null,
    sourceFingerprint: fields.fingerprint.value,
    sourceFingerprintAlgorithm: fields.fingerprint.algorithm,
    destinationScopeKind: fields.destinationScope.scopeKind,
    destinationScopeId: fields.destinationScope.scopeId,
    copyKey: fields.copyKey,
    destinationFamilyId: fields.destinationFamilyId ?? null,
    destinationDraftId: fields.destinationDraftId ?? null,
    destinationRevision: fields.destinationRevision ?? null,
    destinationFingerprint: fields.destinationFingerprint ?? null,
    operationKind: fields.operationKind || 'legacy-copy',
    status: 'completed',
    sourcePreserved: true,
    createdAt: new Date().toISOString()
  };
  return Object.freeze(receipt);
}

function writeReceiptInternal(receipt, storage) {
  const receiptKey = buildReceiptKey({
    scope: { scopeKind: receipt.destinationScopeKind, scopeId: receipt.destinationScopeId },
    receiptId: receipt.receiptId
  });
  const write = writeDurable(receiptKey, receipt, storage);
  if (write.status !== 'OK') {
    return { ok: false, reason: 'receipt-write-failed', sourcePreserved: true, receiptKey };
  }
  return { ok: true, receiptKey };
}

function verifyRawCopyEvidence({ preservation, storage }) {
  const copyRead = readDurable(preservation.copyKey, storage);
  if (!copyRead.ok || copyRead.raw === null) return { ok: false, reason: 'copy-missing' };
  if (fingerprintRawString(copyRead.raw).value !== preservation.fingerprint.value) {
    return { ok: false, reason: 'copy-fingerprint-mismatch' };
  }
  return { ok: true };
}

/**
 * The claimed recovery copy must be a distinct quarantine-family key that is
 * structurally bound to this exact source key, fingerprint and destination
 * scope. This is what stops a source record from masquerading as its own
 * backup (copyKey === sourceKey) or a fabricated preservation object from
 * producing a completed receipt.
 */
function validateCopyDestinationBinding({ sourceKey, fingerprintValue, copyKey, destinationScope }) {
  if (typeof sourceKey !== 'string' || sourceKey.length === 0) {
    return { ok: false, reason: 'source-key-missing' };
  }
  if (typeof fingerprintValue !== 'string' || fingerprintValue.length === 0) {
    return { ok: false, reason: 'source-fingerprint-missing' };
  }
  if (typeof copyKey !== 'string' || copyKey.length === 0) {
    return { ok: false, reason: 'copy-key-missing' };
  }
  if (copyKey === sourceKey) {
    return { ok: false, reason: 'source-copy-alias-rejected' };
  }
  const parsed = parseP5ScopedKey(copyKey);
  if (!parsed) {
    return { ok: false, reason: 'copy-key-not-scoped' };
  }
  if (parsed.familyId !== QUARANTINE_FAMILY_TOKEN) {
    return { ok: false, reason: 'copy-key-family-mismatch' };
  }
  const scopeMatches =
    parsed.scopeKind === destinationScope?.scopeKind &&
    (parsed.scopeId === null || parsed.scopeId === destinationScope?.scopeId);
  if (!scopeMatches) {
    return { ok: false, reason: 'copy-key-scope-mismatch' };
  }
  const segments = parsed.segments || [];
  if (segments.length < 3) {
    return { ok: false, reason: 'copy-key-binding-incomplete' };
  }
  if (segments[1] !== sourceKey) {
    return { ok: false, reason: 'copy-key-source-mismatch' };
  }
  if (segments[2] !== fingerprintValue) {
    return { ok: false, reason: 'copy-key-fingerprint-mismatch' };
  }
  return { ok: true };
}

/**
 * Complete a verified RAW recovery copy. The receipt binds the exact source
 * key/family/fingerprint and the exact copy that was independently verified.
 */
export function completeRawCopyPreservation({
  preservation,
  destinationScope,
  sourceFamilyId = null,
  operationKind = 'legacy-copy',
  storage = null
} = {}) {
  if (!preservation || preservation.ok !== true || preservation.kind !== RECEIPT_VERIFICATION_KINDS.RAW_COPY) {
    return { ok: false, reason: 'preservation-incomplete', sourcePreserved: true };
  }
  const scopeValidation = validateScope(destinationScope);
  if (!scopeValidation.ok) {
    return { ok: false, reason: `invalid-destination-scope:${scopeValidation.reason}`, sourcePreserved: true };
  }
  const binding = validateCopyDestinationBinding({
    sourceKey: preservation.sourceKey,
    fingerprintValue: preservation.fingerprint?.value,
    copyKey: preservation.copyKey,
    destinationScope
  });
  if (!binding.ok) {
    return { ok: false, reason: binding.reason, sourcePreserved: true };
  }
  const evidence = verifyRawCopyEvidence({ preservation, storage });
  if (!evidence.ok) {
    return { ok: false, reason: evidence.reason, sourcePreserved: true };
  }
  const receipt = createVerifiedReceipt({
    verificationKind: RECEIPT_VERIFICATION_KINDS.RAW_COPY,
    sourceKey: preservation.sourceKey,
    sourceFamilyId: sourceFamilyId ?? preservation.sourceFamilyId ?? null,
    fingerprint: preservation.fingerprint,
    destinationScope,
    copyKey: preservation.copyKey,
    operationKind
  });
  const write = writeReceiptInternal(receipt, storage);
  if (!write.ok) {
    return { ok: false, reason: write.reason, receipt, sourcePreserved: true };
  }
  return { ok: true, receipt, receiptKey: write.receiptKey, sourcePreserved: true };
}

/**
 * Complete a verified TRANSFORMED-draft preservation. The destination must
 * actually exist, belong to the receipt scope, carry the exact draft identity
 * and revision, and reference this exact source fingerprint in provenance.
 */
export function completeTransformedPreservation({
  preservation,
  destinationScope,
  destinationFamilyId,
  destinationDraftId,
  destinationRevision,
  operationKind = 'legacy-transform',
  storage = null
} = {}) {
  if (!preservation || preservation.ok !== true || preservation.kind !== RECEIPT_VERIFICATION_KINDS.RAW_COPY) {
    return { ok: false, reason: 'preservation-incomplete', sourcePreserved: true };
  }
  const scopeValidation = validateScope(destinationScope);
  if (!scopeValidation.ok) {
    return { ok: false, reason: `invalid-destination-scope:${scopeValidation.reason}`, sourcePreserved: true };
  }
  if (typeof destinationFamilyId !== 'string' || destinationFamilyId.length === 0 ||
    typeof destinationDraftId !== 'string' || destinationDraftId.length === 0 ||
    !Number.isSafeInteger(destinationRevision) || destinationRevision <= 0) {
    return { ok: false, reason: 'destination-reference-required', sourcePreserved: true };
  }

  const binding = validateCopyDestinationBinding({
    sourceKey: preservation.sourceKey,
    fingerprintValue: preservation.fingerprint?.value,
    copyKey: preservation.copyKey,
    destinationScope
  });
  if (!binding.ok) {
    return { ok: false, reason: binding.reason, sourcePreserved: true };
  }

  const copyEvidence = verifyRawCopyEvidence({ preservation, storage });
  if (!copyEvidence.ok) {
    return { ok: false, reason: copyEvidence.reason, sourcePreserved: true };
  }

  const destination = readScopedRecord({
    familyId: destinationFamilyId,
    scope: destinationScope,
    locator: [destinationDraftId]
  });
  if (destination.status !== READ_STATUS.PRESENT_VALID) {
    return { ok: false, reason: `destination-${String(destination.status).toLowerCase()}`, sourcePreserved: true };
  }
  const envelope = destination.value;
  if (envelope.draftId !== destinationDraftId ||
    envelope.scopeKind !== destinationScope.scopeKind ||
    envelope.scopeId !== destinationScope.scopeId ||
    envelope.localRevision !== destinationRevision) {
    return { ok: false, reason: 'destination-identity-mismatch', sourcePreserved: true };
  }
  const envelopeValidation = validateDraftEnvelope(envelope, { expectedScope: destinationScope });
  if (!envelopeValidation.ok || !SUPPORTED_DRAFT_SCHEMA_VERSIONS.includes(envelope.schemaVersion)) {
    return { ok: false, reason: 'destination-schema-unsupported', sourcePreserved: true };
  }
  const provenance = envelope.sourceProvenance;
  if (!provenance ||
    provenance.sourceKey !== preservation.sourceKey ||
    provenance.sourceFingerprint !== preservation.fingerprint.value) {
    return { ok: false, reason: 'destination-provenance-mismatch', sourcePreserved: true };
  }
  const destinationFingerprint = canonicalPayloadFingerprint(envelope.payload);
  if (!destinationFingerprint) {
    return { ok: false, reason: 'destination-payload-unfingerprintable', sourcePreserved: true };
  }

  const receipt = createVerifiedReceipt({
    verificationKind: RECEIPT_VERIFICATION_KINDS.TRANSFORMED,
    sourceKey: preservation.sourceKey,
    sourceFamilyId: preservation.sourceFamilyId ?? null,
    fingerprint: preservation.fingerprint,
    destinationScope,
    copyKey: preservation.copyKey,
    destinationFamilyId,
    destinationDraftId,
    destinationRevision,
    destinationFingerprint: destinationFingerprint.value,
    operationKind
  });
  const write = writeReceiptInternal(receipt, storage);
  if (!write.ok) {
    return { ok: false, reason: write.reason, receipt, sourcePreserved: true };
  }
  return { ok: true, receipt, receiptKey: write.receiptKey, sourcePreserved: true };
}

function validateReceiptShape(receipt) {
  if (!receipt || typeof receipt !== 'object') return { ok: false, reason: 'receipt-not-object' };
  if (receipt.kind !== RECOVERY_RECEIPT_KIND) return { ok: false, reason: 'receipt-kind-invalid' };
  if (receipt.schemaVersion !== RECOVERY_RECEIPT_SCHEMA_VERSION) return { ok: false, reason: 'receipt-schema-unsupported' };
  if (typeof receipt.receiptId !== 'string' || receipt.receiptId.length === 0) return { ok: false, reason: 'receipt-id-missing' };
  if (receipt.status !== 'completed') return { ok: false, reason: 'receipt-incomplete' };
  if (receipt.sourceFingerprintAlgorithm !== FINGERPRINT_ALGORITHM) return { ok: false, reason: 'receipt-algorithm-invalid' };
  if (![RECEIPT_VERIFICATION_KINDS.RAW_COPY, RECEIPT_VERIFICATION_KINDS.TRANSFORMED].includes(receipt.verificationKind)) {
    return { ok: false, reason: 'receipt-verification-missing' };
  }
  if (typeof receipt.sourceKey !== 'string' || receipt.sourceKey.length === 0) return { ok: false, reason: 'receipt-source-key-missing' };
  if (typeof receipt.sourceFingerprint !== 'string' || receipt.sourceFingerprint.length === 0) {
    return { ok: false, reason: 'receipt-source-fingerprint-missing' };
  }
  if (typeof receipt.copyKey !== 'string' || receipt.copyKey.length === 0) return { ok: false, reason: 'receipt-copy-missing' };
  if (receipt.verificationKind === RECEIPT_VERIFICATION_KINDS.TRANSFORMED) {
    if (typeof receipt.destinationFamilyId !== 'string' || receipt.destinationFamilyId.length === 0 ||
      typeof receipt.destinationDraftId !== 'string' || receipt.destinationDraftId.length === 0 ||
      !Number.isSafeInteger(receipt.destinationRevision) || receipt.destinationRevision <= 0 ||
      typeof receipt.destinationFingerprint !== 'string' || receipt.destinationFingerprint.length === 0) {
      return { ok: false, reason: 'receipt-destination-evidence-missing' };
    }
  }
  const scopeValidation = validateScope({ scopeKind: receipt.destinationScopeKind, scopeId: receipt.destinationScopeId });
  if (!scopeValidation.ok) return { ok: false, reason: 'receipt-destination-scope-invalid' };
  return { ok: true };
}

/**
 * Re-verify a receipt's evidence against actual storage. A forged receipt
 * carrying fabricated evidence fails unless the real copy/destination state
 * actually matches it.
 */
export function verifyReceiptEvidence({ receipt, storage = null } = {}) {
  const shape = validateReceiptShape(receipt);
  if (!shape.ok) return { valid: false, reason: shape.reason };

  const destinationScope = { scopeKind: receipt.destinationScopeKind, scopeId: receipt.destinationScopeId };
  const binding = validateCopyDestinationBinding({
    sourceKey: receipt.sourceKey,
    fingerprintValue: receipt.sourceFingerprint,
    copyKey: receipt.copyKey,
    destinationScope
  });
  if (!binding.ok) return { valid: false, reason: binding.reason };

  const preservation = {
    ok: true,
    kind: RECEIPT_VERIFICATION_KINDS.RAW_COPY,
    copyKey: receipt.copyKey,
    fingerprint: { algorithm: receipt.sourceFingerprintAlgorithm, value: receipt.sourceFingerprint }
  };
  const copyEvidence = verifyRawCopyEvidence({ preservation, storage });
  if (!copyEvidence.ok) return { valid: false, reason: copyEvidence.reason };

  if (receipt.verificationKind === RECEIPT_VERIFICATION_KINDS.TRANSFORMED) {
    const destination = readScopedRecord({
      familyId: receipt.destinationFamilyId,
      scope: destinationScope,
      locator: [receipt.destinationDraftId]
    });
    if (destination.status !== READ_STATUS.PRESENT_VALID) {
      return { valid: false, reason: `destination-${String(destination.status).toLowerCase()}` };
    }
    const envelope = destination.value;
    if (envelope.draftId !== receipt.destinationDraftId || envelope.localRevision !== receipt.destinationRevision) {
      return { valid: false, reason: 'destination-identity-mismatch' };
    }
    const provenance = envelope.sourceProvenance;
    if (!provenance ||
      provenance.sourceKey !== receipt.sourceKey ||
      provenance.sourceFingerprint !== receipt.sourceFingerprint) {
      return { valid: false, reason: 'destination-provenance-mismatch' };
    }
    const destinationFingerprint = canonicalPayloadFingerprint(envelope.payload);
    if (!destinationFingerprint || destinationFingerprint.value !== receipt.destinationFingerprint) {
      return { valid: false, reason: 'destination-fingerprint-mismatch' };
    }
  }

  return { valid: true };
}

/**
 * A receipt only validates the exact source key and fingerprint it was
 * created for. A modified source or a different key with identical bytes is
 * rejected. This checks the source binding only; use verifyReceiptEvidence
 * for the copy/destination side.
 */
export function verifyRecoveryReceiptForSource({ receipt, sourceKey, sourceFamilyId = null, storage = null } = {}) {
  const shape = validateReceiptShape(receipt);
  if (!shape.ok) return { valid: false, reason: shape.reason };

  if (typeof sourceKey !== 'string' || sourceKey.length === 0) {
    return { valid: false, reason: 'source-key-required' };
  }
  if (receipt.sourceKey !== sourceKey) {
    return { valid: false, reason: 'source-key-mismatch' };
  }
  if (sourceFamilyId !== null && sourceFamilyId !== undefined && receipt.sourceFamilyId !== sourceFamilyId) {
    return { valid: false, reason: 'source-family-mismatch' };
  }

  const current = fingerprintStorageKey(sourceKey, storage);
  if (!current.ok) {
    return { valid: false, reason: `source-${current.reason}` };
  }
  if (current.fingerprint.value !== receipt.sourceFingerprint) {
    return { valid: false, reason: 'source-fingerprint-mismatch' };
  }
  return { valid: true, fingerprint: current.fingerprint };
}
