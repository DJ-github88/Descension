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
import campaignCloudService from './campaignCloudService';

const LEGACY_CAMPAIGNS_KEY = 'mythrill-campaigns';
const LEGACY_CURRENT_CAMPAIGN_KEY = 'mythrill-current-campaign-id';
const COLLECTION_FAMILY = 'campaign.collection';
const CURRENT_FAMILY = 'campaign.currentId';

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
   * Persist the captured whole-collection snapshot through scoped
   * coordination. The payload and operation context are captured NOW, so a
   * delayed save can never capture a later account's working state.
   */
  async _persistCollection() {
    const captured = captureConsumerContext();
    if (!captured.ok) {
      this.lastPersistStatus = 'NO_ACTIVE_SCOPE';
      return { status: 'NO_ACTIVE_SCOPE', reason: captured.reason };
    }
    const payloadSnapshot = cloneCollection(this.campaigns);
    const result = await saveScopedDraft({
      familyId: COLLECTION_FAMILY,
      payload: payloadSnapshot,
      expectedRevision: this.collectionRevision,
      expectedDraftId: this.collectionDraftId
    });

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
      this.pendingConflict = {
        reason: 'stale-collection-revision',
        preservedAt: new Date().toISOString(),
        losingRevision: this.collectionRevision
      };
      try {
        const forked = forkScopedRecord({
          familyId: COLLECTION_FAMILY,
          scope: resolveActiveScope(),
          payload: payloadSnapshot
        });
        if (forked && forked.status === 'FORKED') {
          this.pendingConflict.forkDraftId = forked.draftId;
          this.pendingConflict.forkKey = forked.key;
        }
      } catch (_error) {
        // The fork is best-effort; the winner is never overwritten either way.
      }
      this.loadCampaigns();
      this.lastPersistStatus = 'STALE_REVISION';
      return result;
    }
    this.lastPersistStatus = result.status;
    return result;
  }

  _queuePersist() {
    this.pendingPersist = this._persistCollection();
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
  async syncToCloud(userId) {
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
      this.pendingConflict = {
        ...(this.pendingConflict || {}),
        reason: 'cloud-baseline-changed',
        preservedAt: new Date().toISOString()
      };
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
    this.pendingConflict = {
      reason: 'local-dirty-cloud-divergent',
      preservedAt: new Date().toISOString(),
      cloudRevision: state.cloudRevision
    };
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
        this.pendingConflict.forkDraftId = forked.draftId;
        this.pendingConflict.forkKey = forked.key;
        preserved = true;
      }
    } catch (_error) {
      preserved = false;
    }
    if (!preserved) {
      // Never destroy the only local copy: keep the working candidate and
      // report the blocked reconciliation.
      this.pendingConflict.reason = 'local-dirty-cloud-divergent-preservation-failed';
      this.pendingConflict.preservationFailed = true;
      return false;
    }
    return this._writeAdoptedCollection(cloudCampaigns, state.currentCampaignId, context);
  }

  async _writeAdoptedCollection(campaigns, currentCampaignId, context = null) {
    if (context && !isConsumerContextCurrent(context)) return false;
    const result = await saveScopedDraft({
      familyId: COLLECTION_FAMILY,
      payload: cloneCollection(campaigns),
      context,
      expectedRevision: this.collectionRevision,
      expectedDraftId: this.collectionDraftId
    });
    if (result.status === 'OK' || result.status === 'FORKED') {
      this.collectionRevision = result.newRevision ?? 1;
      this.collectionDraftId = result.draftId;
      this.campaigns = cloneCollection(campaigns);
      this.collectionDirty = true;
      // Adopted cloud content is the confirmed baseline; clear dirty.
      await this._confirmCollectionSynced(context);
      if (currentCampaignId) {
        this.setCurrentCampaign(currentCampaignId);
      }
      return true;
    }
    return false;
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
}

export default campaignService;
