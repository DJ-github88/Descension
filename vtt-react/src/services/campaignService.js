// Campaign Service - Manages multiple campaigns with room and player state persistence
//
// Project 5 Wave B (S5.1/S6): the working collection lives in verified-owner
// scoped draft storage (`campaign.collection`), the active selection is a
// tab-local + scoped selector (`campaign.currentId`), and cloud saves use the
// fixed-baseline campaign CAS (`campaignCloudService`). The legacy global
// `mythrill-campaigns` array is preserved as a recovery source via
// copy-before-switch quarantine and is NEVER auto-adopted or auto-uploaded.
import { v4 as uuidv4 } from 'uuid';
import { validateCampaignName } from '../utils/validationUtils';
import {
  loadScopedDraft,
  saveScopedDraft,
  loadScopedNative,
  saveScopedNative,
  clearScopedNative,
  captureConsumerContext,
  captureOwnerGuard,
  isConsumerContextCurrent,
  resolveActiveScope,
  ensureLegacySourceQuarantine
} from '../persistence/scopedConsumer';
import { forkScopedRecord } from '../persistence/localCoordination';
import { bumpLocalRevision, confirmRevision } from '../persistence/draftEnvelope';
import { getBootstrapGateState } from '../persistence/bootstrapPrivacyGate';
import { createScopedNativeFamily } from '../persistence/scopedNativeFamily';
import { readScopedRecord, READ_STATUS } from '../persistence/safeRead';
import campaignCloudService from './campaignCloudService';

const LEGACY_CAMPAIGNS_KEY = 'mythrill-campaigns';
const LEGACY_CURRENT_CAMPAIGN_KEY = 'mythrill-current-campaign-id';
const COLLECTION_FAMILY = 'campaign.collection';
const CURRENT_FAMILY = 'campaign.currentId';
const CONFLICT_FAMILY = 'campaign.pendingConflict';
const CONFLICT_KIND = 'p5-campaign-conflict';

const conflictFamily = createScopedNativeFamily({ familyId: CONFLICT_FAMILY });

const cloneCollection = (campaigns) => {
  try {
    return JSON.parse(JSON.stringify(campaigns));
  } catch (_error) {
    return Array.isArray(campaigns) ? [...campaigns] : [];
  }
};

/**
 * Campaign Service for managing multiple campaigns.
 * Fast scoped-local working set + revision-aware cloud CAS.
 */
class CampaignService {
  constructor() {
    this.campaigns = [];
    this.collectionRevision = null;
    this.collectionDraftId = null;
    this.collectionDirty = false;
    this.scopeKey = null;
    this.quarantinedScopes = new Set();
    this.pendingPersist = Promise.resolve({ status: 'IDLE' });
    this.lastPersistStatus = 'IDLE';
    this.pendingConflict = null;
    this.cloudBaseline = null;
    this.cloudState = null;
    this.creationIntent = false;
    this.lastCloudSyncAt = null;
    this.syncTimeout = null;
    this.conflictListeners = new Set();
  }

  _currentScopeKey() {
    const scope = resolveActiveScope();
    if (!scope) return null;
    const generation = getBootstrapGateState().accountGeneration;
    return `${scope.scopeKind}:${scope.scopeId}:${generation}`;
  }

  /**
   * Reload the scoped working set whenever the verified owner or the account
   * generation changes (login, logout, same-UID relogin). This keeps lazy
   * consumers correct without re-reading storage on every call.
   */
  _ensureLoaded() {
    const scopeKey = this._currentScopeKey();
    if (scopeKey !== this.scopeKey) {
      this.loadCampaigns();
    }
  }

  _resetWorkingSet(scopeKey) {
    this.scopeKey = scopeKey;
    this.campaigns = [];
    this.collectionRevision = null;
    this.collectionDraftId = null;
    this.collectionDirty = false;
    this.pendingConflict = null;
    this.cloudBaseline = null;
    this.cloudState = null;
    this.creationIntent = false;
  }

  // --- S8-B explicit local/cloud reconciliation ---

  subscribeConflict(listener) {
    if (typeof listener !== 'function') return () => {};
    this.conflictListeners.add(listener);
    return () => this.conflictListeners.delete(listener);
  }

  _notifyConflict(event) {
    for (const listener of [...this.conflictListeners]) {
      try {
        listener(event);
      } catch (_error) {
        // A UI listener must never break persistence bookkeeping.
      }
    }
  }

  /**
   * Record the pending reconciliation durably (scoped, verified owner only).
   * The conflict identity survives reloads until an explicit resolution.
   */
  _recordConflict(conflict) {
    this.pendingConflict = conflict;
    try {
      conflictFamily.save({
        kind: CONFLICT_KIND,
        schemaVersion: 1,
        reason: conflict.reason || 'unknown',
        preservedAt: conflict.preservedAt || new Date().toISOString(),
        losingRevision: conflict.losingRevision ?? null,
        forkDraftId: conflict.forkDraftId || null,
        forkKey: conflict.forkKey || null,
        cloudRevision: conflict.cloudRevision ?? this.cloudBaseline?.cloudRevision ?? null,
        cloudEpoch: conflict.cloudEpoch ?? this.cloudBaseline?.cloudEpoch ?? null,
        preservationFailed: conflict.preservationFailed === true,
        cloudCandidateAdopted: conflict.cloudCandidateAdopted !== false,
        cloudForkDraftId: conflict.cloudForkDraftId || null,
        deferredAt: conflict.deferredAt || null
      });
    } catch (_error) {
      // In-memory identity is retained even if the durable copy fails.
    }
    this._notifyConflict({ event: 'pending', conflict: this.getPendingConflict() });
  }

  _clearConflict(resolution = null) {
    this.pendingConflict = null;
    try {
      conflictFamily.clear();
    } catch (_error) {
      // best-effort; the in-memory record is already resolved
    }
    this._notifyConflict({ event: 'resolved', resolution });
  }

  _restorePersistedConflict() {
    if (this.pendingConflict) return;
    let stored = null;
    try {
      stored = conflictFamily.load();
    } catch (_error) {
      stored = null;
    }
    if (!stored || typeof stored !== 'object' || stored.kind !== CONFLICT_KIND) return;
    this.pendingConflict = {
      reason: stored.reason || 'unknown',
      preservedAt: stored.preservedAt || null,
      losingRevision: stored.losingRevision ?? null,
      forkDraftId: stored.forkDraftId || null,
      forkKey: stored.forkKey || null,
      cloudRevision: stored.cloudRevision ?? null,
      cloudEpoch: stored.cloudEpoch ?? null,
      preservationFailed: stored.preservationFailed === true,
      cloudCandidateAdopted: stored.cloudCandidateAdopted !== false,
      cloudForkDraftId: stored.cloudForkDraftId || null,
      deferredAt: stored.deferredAt || null
    };
    if (stored.cloudEpoch && Number.isSafeInteger(stored.cloudRevision)) {
      this.cloudBaseline = { state: 'PRESENT_VALID', cloudEpoch: stored.cloudEpoch, cloudRevision: stored.cloudRevision };
    }
  }

  /** True when the preserved local alternative exists in this scope. */
  _forkAvailable(forkDraftId) {
    if (!forkDraftId) return false;
    const scope = resolveActiveScope();
    if (!scope) return false;
    const read = readScopedRecord({ familyId: COLLECTION_FAMILY, scope, locator: [forkDraftId] });
    return read.status === READ_STATUS.PRESENT_VALID;
  }

  /**
   * A UI/status snapshot of the pending local/cloud divergence. Never mutates
   * either candidate.
   */
  getPendingConflict() {
    this._ensureLoaded();
    if (!this.pendingConflict) return null;
    if (!resolveActiveScope()) return null;
    const conflict = this.pendingConflict;
    const forkAvailable = this._forkAvailable(conflict.forkDraftId);
    const cloudKnown = !!this.cloudBaseline || !!this.cloudState;
    // "Local" describes the preserved local candidate (the fork) when one
    // exists; otherwise the local working copy that could not yet be forked.
    const localCandidate = this._localCandidatePayload();
    const localCampaigns = localCandidate || this.campaigns;
    return {
      active: true,
      reason: conflict.reason,
      preservedAt: conflict.preservedAt || null,
      deferredAt: conflict.deferredAt || null,
      preservationFailed: conflict.preservationFailed === true,
      local: {
        dirty: forkAvailable || conflict.preservationFailed === true ? true : this.collectionDirty,
        revision: this.collectionRevision,
        campaignCount: localCampaigns.length,
        campaignNames: localCampaigns.map((campaign) => campaign?.name).filter(Boolean).slice(0, 6),
        workingSetSource: conflict.reason === 'stale-collection-revision' ? 'local-scoped'
          : conflict.cloudCandidateAdopted === false ? 'local' : 'cloud'
      },
      cloud: {
        known: cloudKnown,
        state: this.cloudState?.state || this.cloudBaseline?.state || null,
        revision: this.cloudBaseline?.cloudRevision ?? conflict.cloudRevision ?? null,
        epoch: this.cloudBaseline?.cloudEpoch ?? conflict.cloudEpoch ?? null,
        candidateAdopted: conflict.cloudCandidateAdopted !== false
      },
      localAlternative: {
        available: forkAvailable,
        draftId: conflict.forkDraftId || null
      },
      cloudAlternative: {
        draftId: conflict.cloudForkDraftId || null
      },
      actions: {
        continueWithCloud: forkAvailable || conflict.preservationFailed,
        keepLocalAsDraft: forkAvailable || conflict.preservationFailed,
        publishLocal: forkAvailable || conflict.preservationFailed
      }
    };
  }

  /**
   * Ensure the local candidate is preserved as a scoped fork before any
   * resolution can adopt/overwrite anything. Never deletes the only copy.
   */
  _ensureLocalAlternativePreserved(context, conflict) {
    if (conflict.forkDraftId && this._forkAvailable(conflict.forkDraftId)) {
      return { ok: true, forkDraftId: conflict.forkDraftId };
    }
    if (!conflict.preservationFailed) {
      return { ok: false, reason: 'local-alternative-missing' };
    }
    const scope = resolveActiveScope();
    if (!scope) return { ok: false, reason: 'no-active-scope' };
    try {
      const forked = forkScopedRecord({
        familyId: COLLECTION_FAMILY,
        scope,
        context,
        payload: cloneCollection(this.campaigns)
      });
      if (!forked || forked.status !== 'FORKED') {
        return { ok: false, reason: 'preservation-failed' };
      }
      conflict.forkDraftId = forked.draftId;
      conflict.forkKey = forked.key;
      conflict.preservationFailed = false;
      this._recordConflict(conflict);
      return { ok: true, forkDraftId: forked.draftId };
    } catch (_error) {
      return { ok: false, reason: 'preservation-failed' };
    }
  }

  /** The preserved local candidate payload (fork, or the working copy). */
  _localCandidatePayload() {
    const conflict = this.pendingConflict;
    if (!conflict) return null;
    // After a refused explicit publication, later edits belong to the local
    // working candidate. Never restore an older fork over those edits.
    if (conflict.cloudCandidateAdopted === false) return cloneCollection(this.campaigns);
    if (conflict.forkDraftId) {
      const scope = resolveActiveScope();
      if (scope) {
        const read = readScopedRecord({ familyId: COLLECTION_FAMILY, scope, locator: [conflict.forkDraftId] });
        if (read.status === READ_STATUS.PRESENT_VALID && Array.isArray(read.value.payload)) {
          return cloneCollection(read.value.payload);
        }
      }
    }
    if (conflict.preservationFailed === true && this.campaigns.length > 0) {
      return cloneCollection(this.campaigns);
    }
    return null;
  }

  /**
   * Continue working from the cloud-backed candidate. The preserved local
   * alternative is retained as a scoped draft unless the caller later deletes
   * it explicitly (never done here).
   */
  async resolveConflictWithCloud({ expectedRevision = null } = {}) {
    const guard = captureOwnerGuard();
    if (!guard.ok) return { status: 'NO_ACTIVE_SCOPE', reason: guard.reason };
    this._ensureLoaded();
    const conflict = this.pendingConflict;
    if (!conflict) return { status: 'NO_CONFLICT' };
    const entryRevision = this.collectionRevision;
    const entryFingerprint = JSON.stringify(this.campaigns);
    await (this.pendingPersist || Promise.resolve()).catch(() => {});
    if (!guard.isCurrent()) return { status: 'SUPERSEDED' };
    if (this.collectionRevision !== entryRevision || JSON.stringify(this.campaigns) !== entryFingerprint) {
      return { status: 'STALE_CONFIRMATION', currentRevision: this.collectionRevision };
    }
    if (expectedRevision !== null && this.collectionRevision !== expectedRevision) {
      return { status: 'STALE_CONFIRMATION', currentRevision: this.collectionRevision };
    }
    const preserved = this._ensureLocalAlternativePreserved(guard.context, conflict);
    if (!preserved.ok) return { status: 'LOCAL_PRESERVATION_REQUIRED', reason: preserved.reason };

    let state = this.cloudState;
    if (conflict.reason !== 'stale-collection-revision') {
      state = await campaignCloudService.readCampaignCloudState(this._currentUid());
      if (!guard.isCurrent()) return { status: 'SUPERSEDED' };
      if (this.collectionRevision !== entryRevision || JSON.stringify(this.campaigns) !== entryFingerprint) {
        return { status: 'STALE_CONFIRMATION', currentRevision: this.collectionRevision };
      }
      if (!state || !['PRESENT_VALID', 'EMPTY_VALID'].includes(state.state)) {
        return { status: 'CLOUD_CANDIDATE_UNAVAILABLE' };
      }
    }
    const canAdoptCloud = state &&
      (state.state === 'PRESENT_VALID' || state.state === 'EMPTY_VALID') &&
      Array.isArray(state.campaigns);
    if (canAdoptCloud && conflict.reason !== 'stale-collection-revision') {
      if (this.collectionDirty) {
        const preservedWorking = forkScopedRecord({ familyId: COLLECTION_FAMILY,
          scope: resolveActiveScope(), context: guard.context, payload: cloneCollection(this.campaigns) });
        if (preservedWorking.status !== 'FORKED') return { status: 'LOCAL_PRESERVATION_REQUIRED' };
      }
      const adopted = await this._writeAdoptedCollection(state.campaigns, state.currentCampaignId, guard.context);
      if (!guard.isCurrent()) return { status: 'SUPERSEDED' };
      if (!adopted) {
        // The decision was valid only for the exact working revision captured
        // at entry. A newer local edit made while the adoption waited for the
        // collection lock invalidates the decision: never report success and
        // never clear the newer edit's conflict state.
        if (this.collectionRevision !== entryRevision ||
          JSON.stringify(this.campaigns) !== entryFingerprint) {
          return { status: 'STALE_CONFIRMATION', currentRevision: this.collectionRevision };
        }
        return { status: 'CLOUD_ADOPTION_FAILED' };
      }
      conflict.cloudCandidateAdopted = true;
      this._recordConflict(conflict);
    }
    this._clearConflict('continue-cloud');
    return { status: 'OK', resolution: 'continue-cloud', forkDraftId: conflict.forkDraftId || null };
  }

  /**
   * Keep the preserved local alternative as a separate scoped draft and accept
   * the current working set (usually the cloud copy).
   */
  keepLocalAsSeparateDraft() {
    const guard = captureOwnerGuard();
    if (!guard.ok) return { status: 'NO_ACTIVE_SCOPE', reason: guard.reason };
    this._ensureLoaded();
    const conflict = this.pendingConflict;
    if (!conflict) return { status: 'NO_CONFLICT' };
    const preserved = this._ensureLocalAlternativePreserved(guard.context, conflict);
    if (!preserved.ok) return { status: 'LOCAL_PRESERVATION_REQUIRED', reason: preserved.reason };
    this._clearConflict('keep-local-draft');
    return { status: 'OK', resolution: 'keep-local-draft', forkDraftId: preserved.forkDraftId };
  }

  /**
   * Explicitly attempt to publish the preserved local version through the
   * existing fixed-baseline cloud CAS. Never rebases onto a changed head: a
   * refusal keeps both candidates and the conflict intact.
   */
  async publishLocalCandidate({ expectedRevision = null } = {}) {
    const guard = captureOwnerGuard(this._currentUid());
    if (!guard.ok) return { status: 'NO_ACTIVE_SCOPE', reason: guard.reason };
    this._ensureLoaded();
    const conflict = this.pendingConflict;
    if (!conflict) return { status: 'NO_CONFLICT' };
    const entryRevision = this.collectionRevision;
    const entryFingerprint = JSON.stringify(this.campaigns);
    await (this.pendingPersist || Promise.resolve()).catch(() => {});
    if (!guard.isCurrent()) return { status: 'SUPERSEDED' };
    // Any edit that landed while the confirmation was starting invalidates it:
    // neither candidate may be silently replaced.
    if (this.collectionRevision !== entryRevision || JSON.stringify(this.campaigns) !== entryFingerprint) {
      return { status: 'STALE_CONFIRMATION', currentRevision: this.collectionRevision };
    }
    if (expectedRevision !== null && this.collectionRevision !== expectedRevision) {
      return { status: 'STALE_CONFIRMATION', currentRevision: this.collectionRevision };
    }
    const preserved = this._ensureLocalAlternativePreserved(guard.context, conflict);
    if (!preserved.ok) return { status: 'LOCAL_PRESERVATION_REQUIRED', reason: preserved.reason };
    const localPayload = this._localCandidatePayload();
    if (!localPayload) return { status: 'NO_LOCAL_CANDIDATE' };

    // Preserve the cloud-backed working copy before the explicit overwrite so
    // neither candidate is silently deleted.
    if (conflict.cloudCandidateAdopted !== false && !conflict.cloudForkDraftId && this.campaigns.length > 0) {
      const scope = resolveActiveScope();
      const forked = scope
        ? forkScopedRecord({
          familyId: COLLECTION_FAMILY,
          scope,
          context: guard.context,
          payload: cloneCollection(this.campaigns)
        })
        : null;
      if (!forked || forked.status !== 'FORKED') {
        return { status: 'CLOUD_ALTERNATIVE_PRESERVATION_FAILED' };
      }
      conflict.cloudForkDraftId = forked.draftId;
      this._recordConflict(conflict);
    }

    this.campaigns = cloneCollection(localPayload);
    this.collectionDirty = true;
    await this._persistCollection();
    if (!guard.isCurrent()) return { status: 'SUPERSEDED' };

    // Explicit user publication; only an actually ABSENT document may be
    // created from this intent.
    this.creationIntent = true;
    const synced = await this.syncToCloud(this._currentUid(), { explicitResolution: true });
    if (!guard.isCurrent()) return { status: 'SUPERSEDED' };
    if (synced) {
      this._clearConflict('publish-local');
      return { status: 'OK', resolution: 'publish-local' };
    }
    return {
      status: 'CAS_REFUSED',
      reason: this.pendingConflict?.reason || 'cloud-not-confirmed',
      localRetained: true
    };
  }

  /** Resolve later: keep both alternatives and the conflict identity. */
  deferConflict() {
    this._ensureLoaded();
    if (!this.pendingConflict) return { status: 'NO_CONFLICT' };
    this.pendingConflict.deferredAt = new Date().toISOString();
    this._recordConflict(this.pendingConflict);
    return { status: 'DEFERRED', forkDraftId: this.pendingConflict.forkDraftId || null };
  }

  /**
   * Load the scoped campaign collection for the active verified owner.
   * Legacy global campaigns are quarantined (preserved), never adopted.
   */
  loadCampaigns() {
    const scopeKey = this._currentScopeKey();
    if (scopeKey !== this.scopeKey) {
      this._resetWorkingSet(scopeKey);
    }
    const scope = resolveActiveScope();
    if (!scope) {
      this.campaigns = [];
      return [];
    }

    this._quarantineLegacyOnce(scope);

    const read = loadScopedDraft({ familyId: COLLECTION_FAMILY });
    if (read.status === 'OK') {
      this.campaigns = Array.isArray(read.payload) ? read.payload : [];
      this.collectionRevision = read.localRevision;
      this.collectionDraftId = read.draftId;
      this.collectionDirty = read.envelope?.dirty === true;
    } else {
      this.campaigns = [];
      this.collectionRevision = null;
      this.collectionDraftId = null;
      this.collectionDirty = false;
    }
    this._restorePersistedConflict();
    return this.campaigns;
  }

  _quarantineLegacyOnce(scope) {
    const scopeKey = `${scope.scopeKind}:${scope.scopeId}`;
    if (this.quarantinedScopes.has(scopeKey)) return;
    this.quarantinedScopes.add(scopeKey);
    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem(LEGACY_CAMPAIGNS_KEY) !== null) {
        ensureLegacySourceQuarantine({
          legacyKey: LEGACY_CAMPAIGNS_KEY,
          familyId: COLLECTION_FAMILY,
          scope
        });
      }
    } catch (_error) {
      // Preservation is best-effort; the legacy source is never modified here.
    }
  }

  /**
   * Persist the collection through scoped coordination. The operation context
   * is captured at enqueue (so a delayed save can never be re-attributed to a
   * later account), and the authored payload snapshot is captured at enqueue
   * too (so a queued save can never persist a later reading of working memory
   * that an earlier save already replaced). The expected revision/draft
   * identity are read when the write actually executes — same-owner queued
   * saves therefore serialize instead of spuriously forking on their own
   * predecessor.
   */
  async _persistCollection(captured = null, payloadSnapshot = null) {
    const context = captured || captureConsumerContext();
    if (!context.ok) {
      this.lastPersistStatus = 'NO_ACTIVE_SCOPE';
      return { status: 'NO_ACTIVE_SCOPE', reason: context.reason };
    }
    if (!isConsumerContextCurrent(context.context)) {
      this.lastPersistStatus = 'CONTEXT_REFUSED';
      return { status: 'CONTEXT_REFUSED', reason: 'account-context-changed' };
    }
    const payload = payloadSnapshot !== null && payloadSnapshot !== undefined
      ? payloadSnapshot
      : cloneCollection(this.campaigns);
    const result = await saveScopedDraft({
      familyId: COLLECTION_FAMILY,
      payload,
      context: context.context,
      expectedRevision: this.collectionRevision,
      expectedDraftId: this.collectionDraftId
    });

    if (!isConsumerContextCurrent(context.context)) return { status: 'CONTEXT_REFUSED' };

    if (result.status === 'OK') {
      this.collectionRevision = result.newRevision;
      this.collectionDraftId = result.draftId;
      this.collectionDirty = true;
      this.lastPersistStatus = 'OK';
      return result;
    }
    if (result.status === 'FORKED') {
      this.collectionRevision = result.newRevision ?? 1;
      this.collectionDraftId = result.draftId;
      this.collectionDirty = true;
      this.lastPersistStatus = 'FORKED';
      return result;
    }
    if (result.status === 'STALE_REVISION') {
      // Never overwrite a newer collection: preserve the losing candidate as
      // a conflict alternative and adopt the authoritative winner.
      const conflict = {
        reason: 'stale-collection-revision',
        preservedAt: new Date().toISOString(),
        losingRevision: this.collectionRevision,
        cloudCandidateAdopted: true
      };
      try {
        const forked = forkScopedRecord({
          familyId: COLLECTION_FAMILY,
          scope: resolveActiveScope(),
          payload
        });
        if (forked && forked.status === 'FORKED') {
          conflict.forkDraftId = forked.draftId;
          conflict.forkKey = forked.key;
        }
      } catch (_error) {
        // The fork is best-effort; the winner is never overwritten either way.
      }
      if (!conflict.forkDraftId) conflict.preservationFailed = true;
      this._recordConflict(conflict);
      if (conflict.forkDraftId) {
        if (JSON.stringify(this.campaigns) !== JSON.stringify(payload)) {
          // A newer authored edit exists in working memory and its own queued
          // save follows this one. Never replace it with a reload of the
          // winner; adopt only the winner's lineage bookkeeping so the newer
          // save can supersede the winner instead of being silently replaced.
          if (Number.isSafeInteger(result.currentRevision) &&
            typeof result.currentDraftId === 'string') {
            this.collectionRevision = result.currentRevision;
            this.collectionDraftId = result.currentDraftId;
            this.collectionDirty = true;
          }
        } else {
          this.loadCampaigns();
        }
      }
      this.lastPersistStatus = 'STALE_REVISION';
      return result;
    }
    this.lastPersistStatus = result.status;
    return result;
  }

  _queuePersist() {
    const captured = captureConsumerContext();
    const payloadSnapshot = cloneCollection(this.campaigns);
    const predecessor = this.pendingPersist && typeof this.pendingPersist.catch === 'function'
      ? this.pendingPersist.catch(() => {})
      : Promise.resolve();
    this.pendingPersist = predecessor.then(() => this._persistCollection(captured, payloadSnapshot));
    this.pendingPersist.catch(() => {});
    return this.pendingPersist;
  }

  /** Await the latest queued local persistence (tests / flush points). */
  flushPersistence() {
    return this.pendingPersist;
  }

  /**
   * Legacy API name retained for existing callers: persist the current
   * collection to scoped storage.
   */
  saveCampaigns() {
    return this._queuePersist();
  }

  /**
   * Get default campaign data structure
   */
  getDefaultCampaignData(name = 'New Campaign', description = '') {
    return {
      name,
      description,
      worldId: null,
      currentSession: 1,
      players: [],
      sessions: [],
      npcs: [],
      locations: [],
      plotThreads: [],
      quests: [],
      homebrew: {
        items: [],
        monsters: [],
        spells: [],
        lore: []
      },
      selectedCreatures: [],
      selectedItems: [],
      selectedSpells: []
    };
  }

  /**
   * Create a new campaign
   */
  createCampaign(campaignData) {
    this._ensureLoaded();
    // Validate campaign name
    const nameValidation = validateCampaignName(campaignData.name || 'New Campaign');
    if (!nameValidation.isValid) {
      throw new Error(`Invalid campaign name: ${nameValidation.errors.join(', ')}`);
    }

    const campaignId = `campaign_${uuidv4()}`;
    const name = nameValidation.sanitized;
    const description = campaignData.description || '';

    const campaign = {
      id: campaignId,
      name,
      description,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      rooms: [], // Array of room IDs associated with this campaign
      settings: {
        fogOfWarEnabled: true,
        dynamicFog: true,
        respectLineOfSight: true
      },
      // Campaign-specific data (synced with CampaignManager)
      campaignData: this.getDefaultCampaignData(name, description)
    };

    this.campaigns.push(campaign);
    this.collectionDirty = true;
    this.creationIntent = true; // explicit user creation intent
    this._queuePersist();
    this.triggerAutoSync();
    return campaign;
  }

  /**
   * Get all campaigns for the active verified owner.
   */
  getCampaigns() {
    this._ensureLoaded();
    return this.campaigns;
  }

  /**
   * Get a specific campaign (ownership-validated against the scoped collection)
   */
  getCampaign(campaignId) {
    this._ensureLoaded();
    if (!campaignId) return null;
    // Convert to string for comparison to handle type mismatches
    const idStr = String(campaignId);
    return this.campaigns.find(c => String(c.id) === idStr);
  }

  /**
   * Update campaign data
   */
  updateCampaign(campaignId, updates) {
    this._ensureLoaded();
    if (!campaignId) {
      console.warn('Attempted to update campaign with no ID');
      return null;
    }

    // Convert to string for comparison to handle type mismatches
    const idStr = String(campaignId);
    const campaignIndex = this.campaigns.findIndex(c => String(c.id) === idStr);
    if (campaignIndex !== -1) {
      this.campaigns[campaignIndex] = {
        ...this.campaigns[campaignIndex],
        ...updates,
        lastModified: new Date().toISOString()
      };
      this.collectionDirty = true;
      this._queuePersist();
      this.triggerAutoSync();
      return this.campaigns[campaignIndex];
    }

    console.warn(`Campaign not found: ${campaignId}. Available campaigns:`, this.campaigns.map(c => c.id));
    return null;
  }

  /**
   * Delete a campaign
   */
  deleteCampaign(campaignId) {
    this._ensureLoaded();
    if (!campaignId) {
      console.warn('Attempted to delete campaign with no ID');
      return;
    }
    const idStr = String(campaignId);
    this.campaigns = this.campaigns.filter(c => String(c.id) !== idStr);
    this.collectionDirty = true;
    this._queuePersist();
    this.triggerAutoSync();
  }

  /**
   * Set the active campaign selection. Tab-local (sessionStorage) plus the
   * scoped selector. Ownership-validated: an unknown campaign id is refused.
   */
  setCurrentCampaign(campaignId) {
    this._ensureLoaded();
    const id = campaignId === null || campaignId === undefined ? null : String(campaignId);
    if (id && !this.getCampaign(id)) {
      return { status: 'UNKNOWN_CAMPAIGN' };
    }
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(LEGACY_CURRENT_CAMPAIGN_KEY, id || '');
      }
    } catch (_error) {
      // tab-local override is best-effort
    }
    if (id) {
      saveScopedNative({ familyId: CURRENT_FAMILY, value: { value: id } });
    } else {
      clearScopedNative({ familyId: CURRENT_FAMILY });
    }
    return { status: 'OK', value: id };
  }

  /**
   * Get the active campaign id: tab-local override first, then the scoped
   * selector. The id is only returned when it resolves inside the scoped
   * collection (ownership-validated by getCurrentCampaign).
   */
  getCurrentCampaignId() {
    this._ensureLoaded();
    let tabLocal = null;
    try {
      if (typeof sessionStorage !== 'undefined') {
        tabLocal = sessionStorage.getItem(LEGACY_CURRENT_CAMPAIGN_KEY);
      }
    } catch (_error) {
      tabLocal = null;
    }
    if (tabLocal !== null) {
      if (!tabLocal) return null;
      // Ownership validation: a tab-local (or restored) selection is only
      // honored when it resolves inside the current scoped collection.
      return this.getCampaign(tabLocal) ? String(tabLocal) : null;
    }
    const read = loadScopedNative({ familyId: CURRENT_FAMILY });
    if (read.status === 'OK' && read.value && typeof read.value.value === 'string' && read.value.value) {
      const candidate = read.value.value;
      return this.getCampaign(candidate) ? candidate : null;
    }
    return null;
  }

  /**
   * Get current campaign
   */
  getCurrentCampaign() {
    const campaignId = this.getCurrentCampaignId();
    return campaignId ? this.getCampaign(campaignId) : null;
  }

  /**
   * Associate a room with a campaign
   */
  addRoomToCampaign(campaignId, roomId) {
    this._ensureLoaded();
    const campaign = this.getCampaign(campaignId);
    if (campaign) {
      if (!campaign.rooms || !Array.isArray(campaign.rooms)) {
        campaign.rooms = [];
      }
      if (!campaign.rooms.includes(roomId)) {
        campaign.rooms.push(roomId);
        campaign.lastModified = new Date().toISOString();
        this.collectionDirty = true;
        this._queuePersist();
        this.triggerAutoSync();
      }
    }
  }

  /**
   * Remove a room from a campaign
   */
  removeRoomFromCampaign(campaignId, roomId) {
    this._ensureLoaded();
    const campaign = this.getCampaign(campaignId);
    if (campaign) {
      if (!campaign.rooms || !Array.isArray(campaign.rooms)) {
        campaign.rooms = [];
      } else {
        campaign.rooms = campaign.rooms.filter(id => id !== roomId);
        campaign.lastModified = new Date().toISOString();
        this.collectionDirty = true;
        this._queuePersist();
        this.triggerAutoSync();
      }
    }
  }

  // --- Cloud Synchronization & Hydration (S6 fixed-baseline CAS) ---

  triggerAutoSync() {
    if (this.pendingConflict) return;
    const currentUid = campaignCloudService.isUsableAccount(this._currentUid())
      ? this._currentUid()
      : null;
    if (currentUid) {
      if (this.syncTimeout) clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
        this.syncToCloud(currentUid);
      }, 1200);
    }
  }

  _currentUid() {
    let firebaseAuth = null;
    try {
      // eslint-disable-next-line global-require
      firebaseAuth = require('../config/firebase').auth || null;
    } catch (_error) {
      firebaseAuth = null;
    }
    if (firebaseAuth) {
      return firebaseAuth.currentUser?.uid || null;
    }
    // Only when no Firebase auth surface exists at all (offline/demo builds)
    // fall back to the local auth store.
    try {
      // eslint-disable-next-line global-require
      const useAuthStore = require('../store/authStore').default;
      const user = useAuthStore?.getState?.().user;
      return user && !user.isGuest ? user.uid : null;
    } catch (_error) {
      return null;
    }
  }

  /**
   * CAS-save the captured collection. Never blind-writes: without an
   * authoritative baseline (or explicit creation intent against ABSENT) the
   * save is refused.
   */
  async syncToCloud(userId, { explicitResolution = false } = {}) {
    this._ensureLoaded();
    if (this.pendingConflict && !explicitResolution) return false;
    if (!campaignCloudService.canUseCloud(userId)) return false;

    // Capture the verified owner/generation: a delayed response must never be
    // applied or confirmed under a different account or a later generation.
    const ownerGuard = captureOwnerGuard(userId);
    if (!ownerGuard.ok) return false;

    if (!this.cloudBaseline) {
      const state = await campaignCloudService.readCampaignCloudState(userId);
      if (!ownerGuard.isCurrent()) return false;
      this.cloudState = state;
      if (state.state === 'PRESENT_VALID' || state.state === 'EMPTY_VALID') {
        this.cloudBaseline = {
          state: state.state,
          cloudEpoch: state.cloudEpoch,
          cloudRevision: state.cloudRevision
        };
      } else if (state.state === 'ABSENT' && this.creationIntent) {
        this.cloudBaseline = { state: 'ABSENT' };
      } else {
        // FAILED / MALFORMED / UNSUPPORTED_VERSION / ABSENT-without-intent:
        // never write and never treat as an empty document.
        return false;
      }
    }

    // An ABSENT document may only be created by explicit user creation intent;
    // login hydration and ordinary autosaves never create it.
    if (this.cloudBaseline.state === 'ABSENT' && !this.creationIntent) {
      return false;
    }

    const payloadSnapshot = cloneCollection(this.campaigns);
    const result = await campaignCloudService.saveCampaignCloudCas({
      userId,
      campaigns: payloadSnapshot,
      currentCampaignId: this.getCurrentCampaignId(),
      localRevision: this.collectionRevision,
      operationGeneration: this.scopeKey,
      expected: this.cloudBaseline
    });

    if (!ownerGuard.isCurrent()) return false;

    if (result.ok) {
      this.cloudBaseline = {
        state: 'PRESENT_VALID',
        cloudEpoch: result.cloudEpoch,
        cloudRevision: result.cloudRevision
      };
      this.lastCloudSyncAt = new Date().toISOString();
      this.creationIntent = false;
      // The cloud acknowledgment confirms only the captured local revision;
      // an older save may not clear a newer dirty edit.
      if (result.confirmedLocalRevision === this.collectionRevision) {
        await this._confirmCollectionSynced(ownerGuard.context);
      }
      return true;
    }
    if (result.result === 'BASELINE_CHANGED') {
      const conflict = {
        ...(this.pendingConflict || {}),
        reason: 'cloud-baseline-changed',
        preservedAt: new Date().toISOString(),
        cloudRevision: this.cloudBaseline?.cloudRevision,
        cloudEpoch: this.cloudBaseline?.cloudEpoch,
        cloudCandidateAdopted: false
      };
      if (!conflict.forkDraftId) {
        const forked = forkScopedRecord({ familyId: COLLECTION_FAMILY, scope: resolveActiveScope(),
          context: ownerGuard.context, payload: cloneCollection(this.campaigns) });
        if (forked.status === 'FORKED') { conflict.forkDraftId = forked.draftId; conflict.forkKey = forked.key; }
        else conflict.preservationFailed = true;
      }
      this._recordConflict(conflict);
    }
    return false;
  }

  async _confirmCollectionSynced(context = null) {
    if (this.collectionRevision === null || !this.collectionDraftId) return false;
    if (context && !isConsumerContextCurrent(context)) return false;
    const result = await saveScopedDraft({
      familyId: COLLECTION_FAMILY,
      payload: cloneCollection(this.campaigns),
      context,
      expectedRevision: this.collectionRevision,
      expectedDraftId: this.collectionDraftId,
      successor: (prior) => confirmRevision(
        bumpLocalRevision(prior, prior.payload),
        prior.localRevision + 1
      )
    });
    if (result.status === 'OK') {
      this.collectionRevision = result.newRevision;
      this.collectionDraftId = result.draftId;
      this.collectionDirty = false;
      return true;
    }
    return false;
  }

  /**
   * Hydrate from the authoritative cloud read.
   *
   *  - FAILED / MALFORMED / UNSUPPORTED_VERSION are never treated as empty and
   *    never trigger uploads.
   *  - ABSENT records the baseline but never auto-uploads a local collection.
   *  - Versionless legacy documents are upgraded non-destructively.
   *  - Dirty/divergent local work is never discarded: both alternatives are
   *    preserved and a pending-reconciliation state is recorded.
   */
  async hydrateFromCloud(userId) {
    if (!campaignCloudService.canUseCloud(userId)) return false;

    // Fence the whole hydration to the owner/generation that started it.
    const ownerGuard = captureOwnerGuard(userId);
    if (!ownerGuard.ok) return false;

    const state = await campaignCloudService.readCampaignCloudState(userId);
    if (!ownerGuard.isCurrent()) return false;
    this.cloudState = state;

    if (state.state === 'FAILED' ||
      state.state === 'MALFORMED' ||
      state.state === 'UNSUPPORTED_VERSION') {
      return false;
    }

    if (state.state === 'ABSENT') {
      this.cloudBaseline = { state: 'ABSENT' };
      return false;
    }

    if (state.legacy) {
      const upgraded = await campaignCloudService.upgradeLegacyCampaignCloud({
        userId,
        expectedFingerprint: state.rawFingerprint
      });
      if (!ownerGuard.isCurrent()) return false;
      if (!upgraded.ok) return false;
      this.cloudBaseline = {
        state: 'PRESENT_VALID',
        cloudEpoch: upgraded.cloudEpoch,
        cloudRevision: upgraded.cloudRevision
      };
      const reread = await campaignCloudService.readCampaignCloudState(userId);
      if (!ownerGuard.isCurrent()) return false;
      if (reread.state !== 'PRESENT_VALID' && reread.state !== 'EMPTY_VALID') return false;
      return this._adoptCloudCollection(reread, ownerGuard.context);
    }

    this.cloudBaseline = {
      state: state.state,
      cloudEpoch: state.cloudEpoch,
      cloudRevision: state.cloudRevision
    };
    return this._adoptCloudCollection(state, ownerGuard.context);
  }

  async _adoptCloudCollection(state, context = null) {
    if (context && !isConsumerContextCurrent(context)) return false;
    const cloudCampaigns = Array.isArray(state.campaigns) ? state.campaigns : [];
    const localNonEmpty = this.campaigns.length > 0;
    const sameContent = localNonEmpty &&
      JSON.stringify(this.campaigns) === JSON.stringify(cloudCampaigns);

    if (!localNonEmpty || !this.collectionDirty || sameContent) {
      return this._writeAdoptedCollection(cloudCampaigns, state.currentCampaignId, context);
    }

    // Dirty local work plus a different cloud candidate: verified preservation
    // of the local alternative is a PREREQUISITE for adopting the cloud copy.
    const conflict = {
      reason: 'local-dirty-cloud-divergent',
      preservedAt: new Date().toISOString(),
      cloudRevision: state.cloudRevision,
      cloudEpoch: state.cloudEpoch ?? null,
      cloudCandidateAdopted: false
    };
    this._recordConflict(conflict);
    let preserved = false;
    try {
      const scope = resolveActiveScope();
      const forked = scope
        ? forkScopedRecord({
          familyId: COLLECTION_FAMILY,
          scope,
          context,
          payload: cloneCollection(this.campaigns)
        })
        : null;
      if (forked && forked.status === 'FORKED') {
        conflict.forkDraftId = forked.draftId;
        conflict.forkKey = forked.key;
        preserved = true;
      }
    } catch (_error) {
      preserved = false;
    }
    if (!preserved) {
      // Never destroy the only local copy: keep the working candidate and
      // report the blocked reconciliation.
      conflict.reason = 'local-dirty-cloud-divergent-preservation-failed';
      conflict.preservationFailed = true;
      this._recordConflict(conflict);
      return false;
    }
    const adopted = await this._writeAdoptedCollection(cloudCampaigns, state.currentCampaignId, context);
    if (adopted) {
      conflict.cloudCandidateAdopted = true;
      this._recordConflict(conflict);
    }
    return adopted;
  }

  async _writeAdoptedCollection(campaigns, currentCampaignId, context = null) {
    if (context && !isConsumerContextCurrent(context)) return false;
    const entryRevision = this.collectionRevision;
    const entryDraftId = this.collectionDraftId;
    const entryFingerprint = JSON.stringify(this.campaigns);
    const result = await saveScopedDraft({
      familyId: COLLECTION_FAMILY,
      payload: cloneCollection(campaigns),
      context,
      expectedRevision: entryRevision,
      expectedDraftId: entryDraftId
    });
    // The adoption decision is valid only for the exact captured owner,
    // generation, working revision and cloud baseline. Revalidate across the
    // asynchronous local-write boundary (which waited for the collection
    // lock): a newer local edit invalidates the decision, so the stale cloud
    // state is neither applied nor confirmed and the newer dirty state is
    // never cleared.
    if (context && !isConsumerContextCurrent(context)) return false;
    if (result.status !== 'OK' && result.status !== 'FORKED') return false;
    if (this.collectionRevision !== entryRevision ||
      this.collectionDraftId !== entryDraftId ||
      JSON.stringify(this.campaigns) !== entryFingerprint) {
      return false;
    }
    this.collectionRevision = result.newRevision ?? 1;
    this.collectionDraftId = result.draftId;
    this.campaigns = cloneCollection(campaigns);
    this.collectionDirty = true;
    const appliedFingerprint = JSON.stringify(this.campaigns);
    // Adopted cloud content is the confirmed baseline; clear dirty only while
    // the adopted collection is still the exact captured working set.
    await this._confirmCollectionSynced(context);
    if (context && !isConsumerContextCurrent(context)) return false;
    if (JSON.stringify(this.campaigns) !== appliedFingerprint) {
      // A newer edit landed while the confirmation was in flight: the
      // adoption is no longer a clean resolution, so keep the newer edit and
      // its dirty state instead of reporting a cloud-cleared result.
      this.collectionDirty = true;
      return false;
    }
    if (currentCampaignId) {
      this.setCurrentCampaign(currentCampaignId);
    }
    return true;
  }
}

// Create singleton instance
const campaignService = new CampaignService();

/** Test-only reset of the singleton working state. */
export function resetCampaignServiceForTests() {
  if (campaignService.syncTimeout) clearTimeout(campaignService.syncTimeout);
  campaignService.campaigns = [];
  campaignService.collectionRevision = null;
  campaignService.collectionDraftId = null;
  campaignService.collectionDirty = false;
  campaignService.scopeKey = null;
  campaignService.quarantinedScopes = new Set();
  campaignService.pendingPersist = Promise.resolve({ status: 'IDLE' });
  campaignService.lastPersistStatus = 'IDLE';
  campaignService.pendingConflict = null;
  campaignService.cloudBaseline = null;
  campaignService.cloudState = null;
  campaignService.creationIntent = false;
  campaignService.lastCloudSyncAt = null;
  campaignService.syncTimeout = null;
  campaignService.conflictListeners = new Set();
  conflictFamily.resetForTests();
  campaignService.pendingConflict = null;
  try {
    conflictFamily.clear();
  } catch (_error) {
    // test-only reset; best-effort
  }
}

export default campaignService;
