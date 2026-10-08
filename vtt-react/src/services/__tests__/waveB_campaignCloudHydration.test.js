/**
 * Project 5 Wave B (S6.4/S6.6) — campaign hydration and divergence retention.
 * The cloud service module is mocked to drive exact read states.
 */

import campaignService, { resetCampaignServiceForTests } from '../campaignService';
import campaignCloudService from '../campaignCloudService';
import {
  activatePrivateScope,
  clearToSignedOut,
  resetBootstrapGateForTests
} from '../../persistence/bootstrapPrivacyGate';
import { createUserScope } from '../../persistence/scopeModel';
import { readScopedRecord, READ_STATUS } from '../../persistence/safeRead';
import { saveScopedDraft } from '../../persistence/scopedConsumer';

jest.mock('../../config/firebase', () => ({
  db: null,
  isFirebaseConfigured: false,
  auth: { currentUser: null }
}));

jest.mock('../campaignCloudService', () => ({
  __esModule: true,
  default: {
    isUsableAccount: jest.fn(() => true),
    canUseCloud: jest.fn(() => true),
    readCampaignCloudState: jest.fn(),
    saveCampaignCloudCas: jest.fn(),
    upgradeLegacyCampaignCloud: jest.fn(),
    createCampaignCloudIfAbsent: jest.fn()
  }
}));

const A = createUserScope('user-a');
const CLOUD_UID = 'user-a';
const FAMILY = 'campaign.collection';

function installFakeLocks(manager) {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, 'locks');
  Object.defineProperty(navigator, 'locks', { configurable: true, value: manager });
  return () => {
    if (descriptor) {
      Object.defineProperty(navigator, 'locks', descriptor);
    } else {
      delete navigator.locks;
    }
  };
}

function serializingLockManager() {
  const tails = new Map();
  return {
    request(name, optionsOrCallback, maybeCallback) {
      const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback;
      const prior = tails.get(name) || Promise.resolve();
      const run = prior.then(() => callback({ name }));
      tails.set(name, run.catch(() => {}));
      return run;
    }
  };
}

const cloudPresent = (campaigns, revision = 2, epoch = 'epoch_cloud') => ({
  state: 'PRESENT_VALID',
  campaigns,
  currentCampaignId: null,
  cloudRevision: revision,
  cloudEpoch: epoch
});

describe('Wave B S6 — hydration and divergence', () => {
  let restoreLocks;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetBootstrapGateForTests();
    resetCampaignServiceForTests();
    jest.clearAllMocks();
    campaignCloudService.isUsableAccount.mockReturnValue(true);
    campaignCloudService.canUseCloud.mockReturnValue(true);
    restoreLocks = installFakeLocks(serializingLockManager());
    activatePrivateScope(A);
  });

  afterEach(() => {
    restoreLocks();
    resetCampaignServiceForTests();
  });

  it('FAILED cloud read never hydrates, never uploads and never clears local work', async () => {
    const created = campaignService.createCampaign({ name: 'Local Work' });
    await campaignService.flushPersistence();

    campaignCloudService.readCampaignCloudState.mockResolvedValue({ state: 'FAILED', reason: 'offline' });
    const hydrated = await campaignService.hydrateFromCloud(CLOUD_UID);

    expect(hydrated).toBe(false);
    expect(campaignService.getCampaign(created.id)).toBeTruthy();
    expect(campaignCloudService.saveCampaignCloudCas).not.toHaveBeenCalled();
    expect(campaignCloudService.createCampaignCloudIfAbsent).not.toHaveBeenCalled();
  });

  it('MALFORMED / UNSUPPORTED cloud state is preserved and never treated as empty', async () => {
    const created = campaignService.createCampaign({ name: 'Local Work' });
    await campaignService.flushPersistence();

    campaignCloudService.readCampaignCloudState.mockResolvedValue({ state: 'MALFORMED' });
    expect(await campaignService.hydrateFromCloud(CLOUD_UID)).toBe(false);
    expect(campaignService.getCampaign(created.id)).toBeTruthy();
    expect(campaignCloudService.saveCampaignCloudCas).not.toHaveBeenCalled();
  });

  it('ABSENT records the baseline but does not auto-upload the browser collection on login', async () => {
    // Seed a scoped collection directly: no explicit creation intent.
    await saveScopedDraft({
      familyId: FAMILY,
      payload: [{ id: 'campaign_local', name: 'Local Work' }]
    });
    campaignService.loadCampaigns();
    expect(campaignService.getCampaigns()).toHaveLength(1);
    expect(campaignService.creationIntent).toBe(false);

    campaignCloudService.readCampaignCloudState.mockResolvedValue({ state: 'ABSENT' });
    await campaignService.hydrateFromCloud(CLOUD_UID);

    // Login hydration must not sync; without creation intent the ABSENT
    // baseline never authorizes a create.
    const saved = await campaignService.syncToCloud(CLOUD_UID);
    expect(saved).toBe(false);
    expect(campaignCloudService.saveCampaignCloudCas).not.toHaveBeenCalled();
    expect(campaignService.cloudBaseline).toEqual({ state: 'ABSENT' });
  });

  it('explicit campaign creation against ABSENT uploads with revision 1 and confirms the local revision', async () => {
    campaignCloudService.readCampaignCloudState.mockResolvedValue({ state: 'ABSENT' });
    campaignCloudService.saveCampaignCloudCas.mockResolvedValue({
      ok: true,
      result: 'OK',
      cloudRevision: 1,
      cloudEpoch: 'epoch_new',
      confirmedLocalRevision: null
    });

    const created = campaignService.createCampaign({ name: 'New Cloud Campaign' });
    await campaignService.flushPersistence();

    const saved = await campaignService.syncToCloud(CLOUD_UID);
    expect(saved).toBe(true);
    expect(campaignCloudService.saveCampaignCloudCas).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: CLOUD_UID,
        expected: { state: 'ABSENT' },
        campaigns: [expect.objectContaining({ id: created.id })]
      })
    );
    expect(campaignService.cloudBaseline).toEqual({
      state: 'PRESENT_VALID',
      cloudEpoch: 'epoch_new',
      cloudRevision: 1
    });
  });

  it('empty local collection adopts a present cloud collection into scoped storage', async () => {
    const cloudCampaigns = [{ id: 'campaign_cloud', name: 'From Cloud' }];
    campaignCloudService.readCampaignCloudState.mockResolvedValue(cloudPresent(cloudCampaigns));

    const hydrated = await campaignService.hydrateFromCloud(CLOUD_UID);
    expect(hydrated).toBe(true);
    expect(campaignService.getCampaigns()).toEqual(cloudCampaigns);

    const stored = readScopedRecord({ familyId: FAMILY, scope: A });
    expect(stored.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(stored.value.payload).toEqual(cloudCampaigns);
  });

  it('dirty divergent local work is preserved as a fork before cloud adoption', async () => {
    const created = campaignService.createCampaign({ name: 'Unsaved Local' });
    await campaignService.flushPersistence();
    expect(campaignService.collectionDirty).toBe(true);

    const cloudCampaigns = [{ id: 'campaign_cloud', name: 'From Cloud' }];
    campaignCloudService.readCampaignCloudState.mockResolvedValue(cloudPresent(cloudCampaigns));

    const hydrated = await campaignService.hydrateFromCloud(CLOUD_UID);
    expect(hydrated).toBe(true);

    // Cloud wins the working set; the local alternative is preserved.
    expect(campaignService.getCampaigns()).toEqual(cloudCampaigns);
    expect(campaignService.pendingConflict).not.toBeNull();
    expect(campaignService.pendingConflict.reason).toBe('local-dirty-cloud-divergent');
    const forkId = campaignService.pendingConflict.forkDraftId;
    expect(forkId).toEqual(expect.any(String));

    const fork = readScopedRecord({ familyId: FAMILY, scope: A, locator: [forkId] });
    expect(fork.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(fork.value.payload.some((campaign) => campaign.id === created.id)).toBe(true);
  });

  it('an older cloud acknowledgment may not clear a newer dirty edit (N-1 confirm)', async () => {
    // Establish a present baseline first.
    campaignCloudService.readCampaignCloudState.mockResolvedValue(cloudPresent([], 5));
    await campaignService.hydrateFromCloud(CLOUD_UID);

    const created = campaignService.createCampaign({ name: 'Edit N-1' });
    await campaignService.flushPersistence();
    const revisionAtSync = campaignService.collectionRevision;

    campaignCloudService.saveCampaignCloudCas.mockResolvedValue({
      ok: true,
      result: 'OK',
      cloudRevision: 6,
      cloudEpoch: 'epoch_cloud',
      confirmedLocalRevision: revisionAtSync // acknowledges only the captured revision
    });

    const syncPromise = campaignService.syncToCloud(CLOUD_UID);
    // A newer edit lands while the acknowledgment is in flight.
    campaignService.updateCampaign(created.id, { description: 'Edit N' });
    const saved = await syncPromise;
    expect(saved).toBe(true);

    // The stale acknowledgment must not clear the newer dirty edit.
    expect(campaignService.collectionDirty).toBe(true);
    await campaignService.flushPersistence();
    const latest = readScopedRecord({ familyId: FAMILY, scope: A });
    expect(latest.value.localRevision).toBeGreaterThan(revisionAtSync);
    expect(latest.value.payload[0].description).toBe('Edit N');
    expect(latest.value.dirty).toBe(true);
  });
});
