/**
 * Project 5 Wave B (S6) — campaign singleton cloud CAS.
 *
 * Frozen target: `users/{uid}/worldbuilding/campaigns` (singleton; never
 * sharded). The CAS unit is the entire campaign collection.
 *
 * Frozen envelope:
 *   { schemaVersion, campaigns, currentCampaignId, cloudRevision, cloudEpoch, updatedAt }
 *
 *  - `cloudEpoch` identifies the immutable document instance; it is preserved
 *    on ordinary updates and replaced only on create/legacy upgrade.
 *  - `cloudRevision` advances monotonically within the document instance.
 *  - the writer captures its baseline BEFORE the transaction; a retried
 *    transaction compares against that fixed baseline and refuses on change
 *    (it never adopts the latest revision and then publishes stale data).
 *  - no blind setDoc fallback after a CAS refusal.
 */

import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';
import { db as firebaseDb, isFirebaseConfigured as firebaseConfigured, auth } from '../config/firebase';

export const CAMPAIGN_CLOUD_SCHEMA_VERSION = 1;
export const CAMPAIGN_CLOUD_DOC_PATH = Object.freeze(['users', '{uid}', 'worldbuilding', 'campaigns']);

export const CLOUD_READ_STATES = Object.freeze({
  ABSENT: 'ABSENT',
  EMPTY_VALID: 'EMPTY_VALID',
  PRESENT_VALID: 'PRESENT_VALID',
  FAILED: 'FAILED',
  MALFORMED: 'MALFORMED',
  UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION'
});

export const CLOUD_CAS_RESULT = Object.freeze({
  OK: 'OK',
  BASELINE_CHANGED: 'BASELINE_CHANGED',
  REFUSED: 'REFUSED',
  FAILED: 'FAILED',
  NO_ACCOUNT: 'NO_ACCOUNT'
});

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

/** Deterministic stringify (sorted keys) used for source fingerprints. */
export function stableStringify(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(',')}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

export function fingerprintCloudData(data) {
  return stableStringify(data);
}

/**
 * Interpret a raw Firestore document payload (or null for a missing doc).
 * Returns one of the frozen read states plus structured evidence.
 */
export function interpretCampaignCloudData(data) {
  if (data === null || data === undefined) {
    return { state: CLOUD_READ_STATES.ABSENT };
  }
  if (typeof data !== 'object' || Array.isArray(data)) {
    return { state: CLOUD_READ_STATES.MALFORMED, reason: 'cloud-not-object' };
  }

  const hasSchema = 'schemaVersion' in data;
  if (!hasSchema) {
    // Versionless legacy document: upgradable only if it carries a valid
    // campaigns array. Its raw content must be preserved exactly.
    if (!Array.isArray(data.campaigns)) {
      return { state: CLOUD_READ_STATES.MALFORMED, reason: 'legacy-missing-campaigns-array' };
    }
    // Only the known versionless shape can be upgraded by replacement. Extra
    // fields may be authored work; leave that source intact rather than drop it.
    if (Object.keys(data).some((key) => !['campaigns', 'currentCampaignId', 'updatedAt'].includes(key))) {
      return { state: CLOUD_READ_STATES.MALFORMED, reason: 'legacy-unrecognized-fields' };
    }
    if (data.currentCampaignId != null && typeof data.currentCampaignId !== 'string') {
      return { state: CLOUD_READ_STATES.MALFORMED, reason: 'legacy-current-campaign-id-invalid' };
    }
    if (data.updatedAt != null && typeof data.updatedAt !== 'string' && typeof data.updatedAt.toDate !== 'function') {
      return { state: CLOUD_READ_STATES.MALFORMED, reason: 'legacy-updated-at-invalid' };
    }
    return {
      state: CLOUD_READ_STATES.PRESENT_VALID,
      legacy: true,
      campaigns: data.campaigns,
      currentCampaignId: typeof data.currentCampaignId === 'string' ? data.currentCampaignId : null,
      rawFingerprint: fingerprintCloudData(data)
    };
  }

  if (data.schemaVersion !== CAMPAIGN_CLOUD_SCHEMA_VERSION) {
    return {
      state: CLOUD_READ_STATES.UNSUPPORTED_VERSION,
      reason: `schema-version:${String(data.schemaVersion)}`
    };
  }
  if (!Array.isArray(data.campaigns)) {
    return { state: CLOUD_READ_STATES.MALFORMED, reason: 'campaigns-not-array' };
  }
  if (data.currentCampaignId !== null &&
    data.currentCampaignId !== undefined &&
    typeof data.currentCampaignId !== 'string') {
    return { state: CLOUD_READ_STATES.MALFORMED, reason: 'current-campaign-id-invalid' };
  }
  if (!Number.isSafeInteger(data.cloudRevision) || data.cloudRevision < 1) {
    return { state: CLOUD_READ_STATES.MALFORMED, reason: 'cloud-revision-invalid' };
  }
  if (!isNonEmptyString(data.cloudEpoch)) {
    return { state: CLOUD_READ_STATES.MALFORMED, reason: 'cloud-epoch-invalid' };
  }

  const envelope = {
    schemaVersion: data.schemaVersion,
    campaigns: data.campaigns,
    currentCampaignId: data.currentCampaignId ?? null,
    cloudRevision: data.cloudRevision,
    cloudEpoch: data.cloudEpoch,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : null
  };
  return {
    state: envelope.campaigns.length === 0
      ? CLOUD_READ_STATES.EMPTY_VALID
      : CLOUD_READ_STATES.PRESENT_VALID,
    envelope,
    campaigns: envelope.campaigns,
    currentCampaignId: envelope.currentCampaignId,
    cloudRevision: envelope.cloudRevision,
    cloudEpoch: envelope.cloudEpoch
  };
}

export function buildCampaignCloudEnvelope({
  campaigns,
  currentCampaignId = null,
  cloudRevision,
  cloudEpoch,
  updatedAt = null
}) {
  return {
    schemaVersion: CAMPAIGN_CLOUD_SCHEMA_VERSION,
    campaigns: Array.isArray(campaigns) ? campaigns : [],
    currentCampaignId: currentCampaignId ?? null,
    cloudRevision,
    cloudEpoch,
    updatedAt: updatedAt || new Date().toISOString()
  };
}

function newCloudEpoch() {
  return `epoch_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Create the campaign cloud service with injectable Firestore primitives.
 * The default export uses the real Firebase modules.
 */
export function createCampaignCloudService(deps = {}) {
  const {
    db = null,
    isFirebaseConfigured = false,
    auth: authRef = null,
    firestore = null
  } = deps;

  const fs = firestore || { doc, getDoc, setDoc, runTransaction };

  const isUsableAccount = (userId) =>
    !!userId &&
    userId !== 'admin-dev-user' &&
    userId !== 'dev-user-123' &&
    !String(userId).startsWith('guest-');

  const canUseCloud = (userId) =>
    isUsableAccount(userId) && isFirebaseConfigured && !!db;

  const docRefFor = (userId) => fs.doc(db, 'users', userId, 'worldbuilding', 'campaigns');

  /** Authoritative read. A failed network read is never evidence of ABSENT. */
  async function readCampaignCloudState(userId) {
    if (!canUseCloud(userId)) {
      return { state: CLOUD_READ_STATES.FAILED, reason: 'cloud-unavailable' };
    }
    try {
      const snapshot = await fs.getDoc(docRefFor(userId));
      const data = snapshot && typeof snapshot.exists === 'function'
        ? (snapshot.exists() ? snapshot.data() : null)
        : null;
      return interpretCampaignCloudData(data);
    } catch (error) {
      return { state: CLOUD_READ_STATES.FAILED, reason: error?.message || 'cloud-read-failed' };
    }
  }

  /**
   * Fixed-baseline CAS write of the whole campaign collection.
   *
   * @param {{
   *   userId: string,
   *   campaigns: Array,
   *   currentCampaignId: string|null,
   *   localRevision: number|null,
   *   operationGeneration: number|string|null,
   *   expected:
   *     { state:'ABSENT' } |
   *     { state:'PRESENT_VALID', cloudEpoch: string, cloudRevision: number } |
   *     { state:'EMPTY_VALID', cloudEpoch: string, cloudRevision: number }
   * }} input
   */
  async function saveCampaignCloudCas({
    userId,
    campaigns,
    currentCampaignId = null,
    localRevision = null,
    operationGeneration = null,
    expected
  }) {
    if (!isUsableAccount(userId)) {
      return { ok: false, result: CLOUD_CAS_RESULT.NO_ACCOUNT };
    }
    if (!isFirebaseConfigured || !db) {
      return { ok: false, result: CLOUD_CAS_RESULT.FAILED, reason: 'cloud-unavailable' };
    }
    if (!expected || !expected.state) {
      return { ok: false, result: CLOUD_CAS_RESULT.REFUSED, reason: 'explicit-baseline-required' };
    }

    // The immutable captured payload: nothing below may consult live state.
    const capturedPayload = Array.isArray(campaigns) ? campaigns : [];
    const capturedCurrentId = currentCampaignId ?? null;

    try {
      const outcome = await fs.runTransaction(db, async (transaction) => {
        const ref = docRefFor(userId);
        const snapshot = await transaction.get(ref);
        const data = snapshot && typeof snapshot.exists === 'function'
          ? (snapshot.exists() ? snapshot.data() : null)
          : null;
        const current = interpretCampaignCloudData(data);

        if (expected.state === 'ABSENT') {
          if (current.state !== CLOUD_READ_STATES.ABSENT) {
            return { ok: false, result: CLOUD_CAS_RESULT.BASELINE_CHANGED, currentState: current.state };
          }
          const epoch = newCloudEpoch();
          transaction.set(ref, buildCampaignCloudEnvelope({
            campaigns: capturedPayload,
            currentCampaignId: capturedCurrentId,
            cloudRevision: 1,
            cloudEpoch: epoch
          }));
          return {
            ok: true,
            result: CLOUD_CAS_RESULT.OK,
            cloudRevision: 1,
            cloudEpoch: epoch,
            confirmedLocalRevision: localRevision,
            operationGeneration
          };
        }

        if (expected.state === 'PRESENT_VALID' || expected.state === 'EMPTY_VALID') {
          if (current.state !== CLOUD_READ_STATES.PRESENT_VALID &&
            current.state !== CLOUD_READ_STATES.EMPTY_VALID) {
            return { ok: false, result: CLOUD_CAS_RESULT.BASELINE_CHANGED, currentState: current.state };
          }
          if (current.envelope.cloudEpoch !== expected.cloudEpoch ||
            current.envelope.cloudRevision !== expected.cloudRevision) {
            return {
              ok: false,
              result: CLOUD_CAS_RESULT.BASELINE_CHANGED,
              currentRevision: current.envelope.cloudRevision,
              currentEpoch: current.envelope.cloudEpoch
            };
          }
          const nextRevision = expected.cloudRevision + 1;
          transaction.set(ref, buildCampaignCloudEnvelope({
            campaigns: capturedPayload,
            currentCampaignId: capturedCurrentId,
            cloudRevision: nextRevision,
            cloudEpoch: expected.cloudEpoch
          }));
          return {
            ok: true,
            result: CLOUD_CAS_RESULT.OK,
            cloudRevision: nextRevision,
            cloudEpoch: expected.cloudEpoch,
            confirmedLocalRevision: localRevision,
            operationGeneration
          };
        }

        return { ok: false, result: CLOUD_CAS_RESULT.REFUSED, reason: `unsupported-expected:${expected.state}` };
      });

      return outcome;
    } catch (error) {
      // A retried transaction re-runs the same fixed-baseline comparison, so a
      // changed document produces BASELINE_CHANGED rather than a stale write.
      return { ok: false, result: CLOUD_CAS_RESULT.FAILED, reason: error?.message || 'transaction-failed' };
    }
  }

  /**
   * Non-destructive upgrade of a versionless legacy document. The caller
   * captures the raw fingerprint before the transaction; the transaction
   * re-verifies the source is unchanged and then adds the supported envelope
   * while preserving the existing campaign content exactly.
   */
  async function upgradeLegacyCampaignCloud({ userId, expectedFingerprint = null }) {
    if (!canUseCloud(userId)) {
      return { ok: false, result: CLOUD_CAS_RESULT.FAILED, reason: 'cloud-unavailable' };
    }
    try {
      const outcome = await fs.runTransaction(db, async (transaction) => {
        const ref = docRefFor(userId);
        const snapshot = await transaction.get(ref);
        const data = snapshot && typeof snapshot.exists === 'function'
          ? (snapshot.exists() ? snapshot.data() : null)
          : null;
        const current = interpretCampaignCloudData(data);
        if (current.state !== CLOUD_READ_STATES.PRESENT_VALID || !current.legacy) {
          return { ok: false, result: CLOUD_CAS_RESULT.REFUSED, reason: 'not-versionless-legacy' };
        }
        if (expectedFingerprint && current.rawFingerprint !== expectedFingerprint) {
          return { ok: false, result: CLOUD_CAS_RESULT.BASELINE_CHANGED, reason: 'legacy-source-changed' };
        }
        const epoch = newCloudEpoch();
        transaction.set(ref, buildCampaignCloudEnvelope({
          campaigns: current.campaigns,
          currentCampaignId: current.currentCampaignId,
          cloudRevision: 1,
          cloudEpoch: epoch
        }));
        return {
          ok: true,
          result: CLOUD_CAS_RESULT.OK,
          cloudRevision: 1,
          cloudEpoch: epoch,
          upgraded: true
        };
      });
      return outcome;
    } catch (error) {
      return { ok: false, result: CLOUD_CAS_RESULT.FAILED, reason: error?.message || 'upgrade-failed' };
    }
  }

  /** Explicit user creation intent: create the document only when ABSENT. */
  async function createCampaignCloudIfAbsent({
    userId,
    campaigns,
    currentCampaignId = null,
    localRevision = null,
    operationGeneration = null
  }) {
    return saveCampaignCloudCas({
      userId,
      campaigns,
      currentCampaignId,
      localRevision,
      operationGeneration,
      expected: { state: 'ABSENT' }
    });
  }

  return {
    readCampaignCloudState,
    saveCampaignCloudCas,
    upgradeLegacyCampaignCloud,
    createCampaignCloudIfAbsent,
    isUsableAccount,
    canUseCloud
  };
}

const campaignCloudService = createCampaignCloudService({
  db: firebaseDb,
  isFirebaseConfigured: firebaseConfigured,
  auth,
  firestore: { doc, getDoc, setDoc, runTransaction }
});

export default campaignCloudService;
