/**
 * Project 5 Wave C (S8-B) — explicit local/cloud campaign reconciliation.
 *
 * Production modules: campaignService conflict recording/persistence and its
 * resolution actions, plus the CampaignConflictResolver affordance. The cloud
 * service and browser/network boundaries are doubled.
 */

const path = require('path');
const ROOT = path.resolve(__dirname, '../..');

jest.mock('../../config/firebase', () => ({
  db: null,
  isFirebaseConfigured: false,
  auth: { currentUser: { uid: 'owner-a' } }
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

const FAMILY = 'campaign.collection';
const CLOUD_UID = 'owner-a';

function harness() {
  const gate = require(`${ROOT}/persistence/bootstrapPrivacyGate`);
  const { createUserScope } = require(`${ROOT}/persistence/scopeModel`);
  const A = createUserScope('owner-a');
  const B = createUserScope('owner-b');
  gate.resetBootstrapGateForTests();
  gate.activatePrivateScope(A);
  const tails = new Map();
  Object.defineProperty(navigator, 'locks', {
    configurable: true,
    value: {
      request(name, opt, cb) {
        const callback = typeof opt === 'function' ? opt : cb;
        const run = (tails.get(name) || Promise.resolve()).then(() => callback({ name }));
        tails.set(name, run.catch(() => {}));
        return run;
      }
    }
  });
  const switchTo = (scope) => { gate.clearToSignedOut(); gate.activatePrivateScope(scope); };
  return { gate, A, B, switchTo };
}

const cloudPresent = (campaigns, revision = 2, epoch = 'epoch_cloud') => ({
  state: 'PRESENT_VALID',
  campaigns,
  currentCampaignId: null,
  cloudRevision: revision,
  cloudEpoch: epoch
});

function deferred() {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  return { promise, resolve };
}

async function seedDivergentConflict(campaignService, cloudRevision = 2) {
  const campaignCloudService = require(`${ROOT}/services/campaignCloudService`).default;
  campaignCloudService.readCampaignCloudState.mockResolvedValue(
    cloudPresent([{ id: 'campaign_cloud', name: 'From Cloud' }], cloudRevision)
  );
  campaignService.createCampaign({ name: 'Unsaved Local' });
  await campaignService.flushPersistence();
  const hydrated = await campaignService.hydrateFromCloud(CLOUD_UID);
  expect(hydrated).toBe(true);
  return campaignService.pendingConflict;
}

beforeEach(() => {
  jest.restoreAllMocks();
  jest.unmock('../../persistence/localCoordination');
  jest.resetModules();
  localStorage.clear();
  sessionStorage.clear();
});

describe('S8-B — explicit local/cloud campaign reconciliation', () => {
  it('S8B-12 a failed cloud read during explicit resolution never clears the conflict', async() => {
    harness();
    const service = require(`${ROOT}/services/campaignService`).default;
    const cloud = require(`${ROOT}/services/campaignCloudService`).default;
    await seedDivergentConflict(service);
    cloud.readCampaignCloudState.mockResolvedValue({ state: 'FAILED', reason: 'permission-denied' });
    const before = JSON.stringify(service.getCampaigns());
    const resolved = await service.resolveConflictWithCloud({ expectedRevision: service.collectionRevision });
    expect(resolved.status).toBe('CLOUD_CANDIDATE_UNAVAILABLE');
    expect(service.getPendingConflict().localAlternative.available).toBe(true);
    expect(JSON.stringify(service.getCampaigns())).toBe(before);
  });
  it('S8B-11 ordinary autosave cannot publish while reconciliation is pending', async() => {
    harness();
    const service = require(`${ROOT}/services/campaignService`).default;
    const cloud = require(`${ROOT}/services/campaignCloudService`).default;
    await seedDivergentConflict(service);
    cloud.saveCampaignCloudCas.mockResolvedValue({ ok: true, cloudRevision: 3, cloudEpoch: 'epoch_cloud' });
    expect(await service.syncToCloud(CLOUD_UID)).toBe(false);
    expect(cloud.saveCampaignCloudCas).not.toHaveBeenCalled();
    expect(service.getPendingConflict()).not.toBeNull();
  });
  it('S8B-1 dirty local versus newer cloud: both candidates are described, neither deleted', async() => {
    harness();
    const campaignService = require(`${ROOT}/services/campaignService`).default;
    const { readScopedRecord, READ_STATUS } = require(`${ROOT}/persistence/safeRead`);
    const { createUserScope } = require(`${ROOT}/persistence/scopeModel`);
    const conflict = await seedDivergentConflict(campaignService, 2);

    expect(conflict.reason).toBe('local-dirty-cloud-divergent');
    const status = campaignService.getPendingConflict();
    expect(status.active).toBe(true);
    expect(status.local.dirty).toBe(true);
    expect(status.local.campaignCount).toBe(1);
    expect(status.cloud.known).toBe(true);
    expect(status.cloud.revision).toBe(2);
    expect(status.cloud.epoch).toBe('epoch_cloud');
    expect(status.localAlternative.available).toBe(true);
    expect(status.actions.continueWithCloud).toBe(true);
    expect(status.actions.publishLocal).toBe(true);

    // Both candidates exist in storage: the fork holds the local work, the
    // working set holds the adopted cloud copy.
    const fork = readScopedRecord({
      familyId: FAMILY,
      scope: createUserScope('owner-a'),
      locator: [status.localAlternative.draftId]
    });
    expect(fork.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(fork.value.payload[0].name).toBe('Unsaved Local');
    expect(campaignService.getCampaigns()[0].name).toBe('From Cloud');
  });

  it('S8B-2 two-tab conflicting collection saves: the losing local draft stays recoverable', async() => {
    harness();
    const campaignService = require(`${ROOT}/services/campaignService`).default;
    const { saveScopedDraft } = require(`${ROOT}/persistence/scopedConsumer`);

    const created = campaignService.createCampaign({ name: 'Tab A campaign' });
    await campaignService.flushPersistence();
    const revisionA = campaignService.collectionRevision;
    const draftIdA = campaignService.collectionDraftId;

    // Another tab writes the next successor from the same predecessor.
    const winner = await saveScopedDraft({
      familyId: FAMILY,
      payload: [{ id: 'campaign_tab_b', name: 'Tab B campaign' }],
      expectedRevision: revisionA,
      expectedDraftId: draftIdA
    });
    expect(winner.status).toBe('OK');

    // Tab A's save is now stale: it must fork, never overwrite the winner.
    campaignService.updateCampaign(created.id, { description: 'Tab A edit' });
    await campaignService.flushPersistence();

    const status = campaignService.getPendingConflict();
    expect(status.active).toBe(true);
    expect(status.reason).toBe('stale-collection-revision');
    expect(status.localAlternative.available).toBe(true);
    expect(campaignService.getCampaigns()[0].id).toBe('campaign_tab_b');

    // Cancel retains both alternatives.
    const deferredResult = campaignService.deferConflict();
    expect(deferredResult.status).toBe('DEFERRED');
    expect(campaignService.getPendingConflict().active).toBe(true);
    expect(campaignService.getPendingConflict().localAlternative.available).toBe(true);
    expect(campaignService.getCampaigns()[0].id).toBe('campaign_tab_b');
  });

  it('S8B-3 local preservation failure blocks resolution and keeps the working local copy', async() => {
    jest.doMock('../../persistence/localCoordination', () => {
      const actual = jest.requireActual('../../persistence/localCoordination');
      return { ...actual, forkScopedRecord: jest.fn(() => ({ status: 'FORK_COLLISION' })) };
    });
    harness();
    const campaignService = require(`${ROOT}/services/campaignService`).default;
    const campaignCloudService = require(`${ROOT}/services/campaignCloudService`).default;
    campaignCloudService.readCampaignCloudState.mockResolvedValue(cloudPresent([{ id: 'campaign_cloud', name: 'Cloud' }]));
    campaignService.createCampaign({ name: 'Only Local Copy' });
    await campaignService.flushPersistence();

    const hydrated = await campaignService.hydrateFromCloud(CLOUD_UID);
    expect(hydrated).toBe(false); // cloud was not adopted: preservation failed
    const status = campaignService.getPendingConflict();
    expect(status.reason).toBe('local-dirty-cloud-divergent-preservation-failed');
    expect(status.preservationFailed).toBe(true);
    expect(status.localAlternative.available).toBe(false);
    expect(campaignService.getCampaigns()[0].name).toBe('Only Local Copy');

    const continued = await campaignService.resolveConflictWithCloud({ expectedRevision: status.local.revision });
    expect(continued.status).toBe('LOCAL_PRESERVATION_REQUIRED');
    expect(campaignService.getCampaigns()[0].name).toBe('Only Local Copy');
    expect(campaignService.getPendingConflict().active).toBe(true);
  });

  it('S8B-4 cloud CAS refusal after choosing local keeps both versions and the conflict', async() => {
    harness();
    const campaignService = require(`${ROOT}/services/campaignService`).default;
    const campaignCloudService = require(`${ROOT}/services/campaignCloudService`).default;
    await seedDivergentConflict(campaignService, 4);
    const before = campaignService.getPendingConflict();

    campaignCloudService.saveCampaignCloudCas.mockResolvedValue({ ok: false, result: 'BASELINE_CHANGED' });
    const result = await campaignService.publishLocalCandidate({ expectedRevision: before.local.revision });

    expect(result.status).toBe('CAS_REFUSED');
    expect(result.localRetained).toBe(true);
    const after = campaignService.getPendingConflict();
    expect(after.active).toBe(true);
    expect(after.localAlternative.available).toBe(true);
    expect(after.cloudAlternative.draftId).toEqual(expect.any(String));
    // The explicit publish used the captured expected baseline, never a rebase.
    expect(campaignCloudService.saveCampaignCloudCas).toHaveBeenCalledWith(
      expect.objectContaining({
        expected: { state: 'PRESENT_VALID', cloudEpoch: 'epoch_cloud', cloudRevision: 4 }
      })
    );
    // The local candidate remains the working copy after the refusal.
    expect(campaignService.getCampaigns()[0].name).toBe('Unsaved Local');
  });

  it('S8B-5 the conflict identity survives a restart', async() => {
    harness();
    let campaignService = require(`${ROOT}/services/campaignService`).default;
    await seedDivergentConflict(campaignService);
    const forkDraftId = campaignService.pendingConflict.forkDraftId;

    jest.resetModules();
    const gate = require(`${ROOT}/persistence/bootstrapPrivacyGate`);
    gate.resetBootstrapGateForTests();
    gate.activatePrivateScope(require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a'));
    campaignService = require(`${ROOT}/services/campaignService`).default;
    campaignService.loadCampaigns();

    const status = campaignService.getPendingConflict();
    expect(status.active).toBe(true);
    expect(status.reason).toBe('local-dirty-cloud-divergent');
    expect(status.localAlternative.draftId).toBe(forkDraftId);
    expect(status.localAlternative.available).toBe(true);
  });

  it('S8B-6 an account switch invalidates the old reconciliation continuation', async() => {
    const { switchTo, B } = harness();
    const campaignService = require(`${ROOT}/services/campaignService`).default;
    const campaignCloudService = require(`${ROOT}/services/campaignCloudService`).default;
    await seedDivergentConflict(campaignService);
    const held = deferred();
    campaignCloudService.saveCampaignCloudCas.mockImplementation(() => held.promise);

    const status = campaignService.getPendingConflict();
    const publishing = campaignService.publishLocalCandidate({ expectedRevision: status.local.revision });
    switchTo(B);
    held.resolve({ ok: true, cloudRevision: 5, cloudEpoch: 'epoch_cloud', confirmedLocalRevision: status.local.revision });
    const result = await publishing;

    expect(result.status).toBe('SUPERSEDED');
    // B sees no conflict and none of A's candidates.
    expect(campaignService.getPendingConflict()).toBeNull();
    expect(campaignService.getCampaigns()).toEqual([]);

    switchTo(require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a'));
    const restored = campaignService.getPendingConflict();
    expect(restored.active).toBe(true);
    expect(restored.localAlternative.available).toBe(true);
  });

  it('S8B-7 a new edit before resolution invalidates the stale confirmation', async() => {
    harness();
    const campaignService = require(`${ROOT}/services/campaignService`).default;
    await seedDivergentConflict(campaignService);
    const capturedRevision = campaignService.getPendingConflict().local.revision;

    campaignService.updateCampaign(campaignService.getCampaigns()[0].id, { description: 'A newer edit' });
    await campaignService.flushPersistence();

    const refused = await campaignService.resolveConflictWithCloud({ expectedRevision: capturedRevision });
    expect(refused.status).toBe('STALE_CONFIRMATION');
    expect(refused.currentRevision).toBeGreaterThan(capturedRevision);
    expect(campaignService.getPendingConflict().active).toBe(true);
    expect(campaignService.getPendingConflict().localAlternative.available).toBe(true);
  });

  it('S8B-8 cancel leaves both alternatives intact and the conflict recorded', async() => {
    harness();
    const campaignService = require(`${ROOT}/services/campaignService`).default;
    const { readScopedRecord, READ_STATUS } = require(`${ROOT}/persistence/safeRead`);
    const { createUserScope } = require(`${ROOT}/persistence/scopeModel`);
    await seedDivergentConflict(campaignService);
    const workingBefore = JSON.stringify(campaignService.getCampaigns());

    const result = campaignService.deferConflict();
    expect(result.status).toBe('DEFERRED');

    const after = campaignService.getPendingConflict();
    expect(after.active).toBe(true);
    expect(after.deferredAt).toEqual(expect.any(String));
    expect(JSON.stringify(campaignService.getCampaigns())).toBe(workingBefore);
    const fork = readScopedRecord({
      familyId: FAMILY,
      scope: createUserScope('owner-a'),
      locator: [after.localAlternative.draftId]
    });
    expect(fork.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(fork.value.payload[0].name).toBe('Unsaved Local');
  });

  it('S8B-9 a successful explicit resolution confirms only the captured revision', async() => {
    harness();
    const campaignService = require(`${ROOT}/services/campaignService`).default;
    const campaignCloudService = require(`${ROOT}/services/campaignCloudService`).default;
    await seedDivergentConflict(campaignService, 7);
    const status = campaignService.getPendingConflict();
    const held = deferred();
    const casCalled = deferred();
    let confirmedRevisionAtCas = null;
    campaignCloudService.saveCampaignCloudCas.mockImplementation(() => {
      confirmedRevisionAtCas = campaignService.collectionRevision;
      casCalled.resolve();
      return held.promise;
    });

    const publishing = campaignService.publishLocalCandidate({ expectedRevision: status.local.revision });
    await casCalled.promise;
    // A newer edit lands after the explicit publish request was made.
    campaignService.updateCampaign(campaignService.getCampaigns()[0].id, { description: 'Edit after publish' });
    await campaignService.flushPersistence();
    held.resolve({
      ok: true,
      cloudRevision: 8,
      cloudEpoch: 'epoch_cloud',
      confirmedLocalRevision: confirmedRevisionAtCas
    });
    const result = await publishing;

    expect(result.status).toBe('OK');
    expect(campaignService.getPendingConflict()).toBeNull();
    // The cloud write used the exact captured expected baseline.
    expect(campaignCloudService.saveCampaignCloudCas).toHaveBeenCalledWith(
      expect.objectContaining({
        expected: { state: 'PRESENT_VALID', cloudEpoch: 'epoch_cloud', cloudRevision: 7 }
      })
    );
    // The newer edit is not covered by the older acknowledgment and stays dirty.
    expect(campaignService.collectionDirty).toBe(true);
    const stored = require(`${ROOT}/persistence/safeRead`).readScopedRecord({
      familyId: FAMILY,
      scope: require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a')
    });
    expect(stored.value.payload[0].description).toBe('Edit after publish');
  });

  it('S8B-9b an edit that lands while the confirmation is starting invalidates it', async() => {
    harness();
    const campaignService = require(`${ROOT}/services/campaignService`).default;
    await seedDivergentConflict(campaignService);
    const status = campaignService.getPendingConflict();

    campaignService.updateCampaign(campaignService.getCampaigns()[0].id, { description: 'Edit during start' });
    const result = await campaignService.publishLocalCandidate({ expectedRevision: status.local.revision });

    expect(result.status).toBe('STALE_CONFIRMATION');
    expect(campaignService.getPendingConflict().active).toBe(true);
    expect(campaignService.getPendingConflict().localAlternative.available).toBe(true);
  });

  it('S8B-10 the reconciliation affordance explains both copies and offers explicit actions', async() => {
    harness();
    const campaignService = require(`${ROOT}/services/campaignService`).default;
    await seedDivergentConflict(campaignService);

    const React = require('react');
    const { render, act, fireEvent, cleanup } = require('@testing-library/react/pure');
    const Resolver = require(`${ROOT}/components/campaign/CampaignConflictResolver`).default;

    let ui;
    try {
      await act(async() => {
        ui = render(React.createElement(Resolver));
      });
      expect(ui.getByText(/Campaign Conflict Detected/)).toBeTruthy();
      expect(ui.getByText(/Local copy \(this browser\)/)).toBeTruthy();
      expect(ui.getByText(/Cloud-backed copy/)).toBeTruthy();
      expect(ui.getByText(/pending changes/)).toBeTruthy();
      expect(ui.getByText(/Continue with cloud/)).toBeTruthy();
      expect(ui.getByText(/Keep local draft/)).toBeTruthy();
      expect(ui.getByText(/Publish local version/)).toBeTruthy();
      expect(ui.getByText(/Resolve later/)).toBeTruthy();

      await act(async() => {
        fireEvent.click(ui.getByText(/Keep local draft/));
        for (let i = 0; i < 16; i += 1) await Promise.resolve();
      });
      expect(campaignService.getPendingConflict()).toBeNull();
      expect(ui.getByText(/preserved as a separate draft/)).toBeTruthy();
    } finally {
      cleanup();
    }
  });
});
