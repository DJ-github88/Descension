/**
 * Project 5 Wave C (S8-B correction) — queued-edit loss during cloud adoption.
 *
 * Exact reproduced race: while `resolveConflictWithCloud` waits for the
 * `campaign.collection` Web Lock, two user edits (EDIT1, EDIT2) are authored and
 * their persistence queues behind the in-flight adoption write. The stale
 * cloud-adoption must not erase EDIT2, must not claim a successful
 * `continue-cloud`, and the newer edits must remain recoverable.
 *
 * Production modules only; the cloud service and browser/network boundaries are
 * doubled. The lock manager is an instrumented FIFO queue with native-like
 * exclusivity so the exact lock ordering can be staged.
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

function deferred() {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  return { promise, resolve };
}

/** FIFO exclusive lock manager mirroring navigator.locks semantics, with a request log. */
function installInstrumentedLocks() {
  const tails = new Map();
  const requests = [];
  Object.defineProperty(navigator, 'locks', {
    configurable: true,
    value: {
      request(name, opt, cb) {
        const callback = typeof opt === 'function' ? opt : cb;
        requests.push({ name });
        const run = (tails.get(name) || Promise.resolve()).then(() => callback({ name }));
        tails.set(name, run.catch(() => {}));
        return run;
      }
    }
  });
  return requests;
}

async function waitForRequestCount(requests, count) {
  for (let i = 0; i < 1000; i += 1) {
    if (requests.length >= count) return;
    await Promise.resolve();
  }
  throw new Error(`lock request #${count} was never queued (saw ${requests.length})`);
}

function harness() {
  const gate = require(`${ROOT}/persistence/bootstrapPrivacyGate`);
  const { createUserScope } = require(`${ROOT}/persistence/scopeModel`);
  const A = createUserScope('owner-a');
  const B = createUserScope('owner-b');
  gate.resetBootstrapGateForTests();
  gate.activatePrivateScope(A);
  const requests = installInstrumentedLocks();
  const switchTo = (scope) => { gate.clearToSignedOut(); gate.activatePrivateScope(scope); };
  return { gate, A, B, requests, switchTo };
}

const cloudPresent = (campaigns, revision = 2, epoch = 'epoch_cloud') => ({
  state: 'PRESENT_VALID',
  campaigns,
  currentCampaignId: null,
  cloudRevision: revision,
  cloudEpoch: epoch
});

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

const readCollection = (scope) => require(`${ROOT}/persistence/safeRead`).readScopedRecord({
  familyId: FAMILY,
  scope
});

const readRecord = (scope, locator) => require(`${ROOT}/persistence/safeRead`).readScopedRecord({
  familyId: FAMILY,
  scope,
  locator
});

beforeEach(() => {
  jest.restoreAllMocks();
  jest.unmock('../../persistence/localCoordination');
  jest.resetModules();
  localStorage.clear();
  sessionStorage.clear();
});

describe('S8-B correction — queued edit snapshots during cloud adoption', () => {
  it('QU1 EDIT2 queued behind EDIT1 survives a stale cloud-adoption decision', async () => {
    const { A, B, requests, switchTo } = harness();
    const service = require(`${ROOT}/services/campaignService`).default;
    const cloud = require(`${ROOT}/services/campaignCloudService`).default;
    await seedDivergentConflict(service);
    const { buildPrivateLockName } = require(`${ROOT}/persistence/localCoordination`);
    const lockName = buildPrivateLockName({ scope: A, familyId: FAMILY });
    const release = deferred();
    const grabbed = deferred();
    const holding = navigator.locks.request(lockName, async() => {
      grabbed.resolve();
      await release.promise;
    });
    await grabbed.promise;
    const baseline = requests.length;

    const expectedRevision = service.collectionRevision;
    expect(expectedRevision).toBeGreaterThan(0);

    // 3. Begin reconciliation; 4. its cloud-adoption write queues for the lock.
    const resolving = service.resolveConflictWithCloud({ expectedRevision });
    await waitForRequestCount(requests, baseline + 1);

    // 5. EDIT1 is authored; its persistence queues behind the adoption write.
    const campaignId = service.getCampaigns()[0].id;
    service.updateCampaign(campaignId, { description: 'EDIT1_WHILE_ADOPTION_WAITING' });
    await waitForRequestCount(requests, baseline + 2);

    // 6. EDIT2 queues behind EDIT1's persistence.
    service.updateCampaign(campaignId, { name: 'EDIT2_QUEUED_MUST_SURVIVE' });

    // 7. Release the lock; 8. await reconciliation and the persistence queue.
    release.resolve();
    await holding;
    const resolved = await resolving;
    await service.flushPersistence();

    // The resolution result is honest: a stale adoption never reports success.
    expect(resolved.status).not.toBe('OK');
    expect(resolved.status).toBe('STALE_CONFIRMATION');

    // EDIT2 is preserved and recoverable in the owner-scoped stored collection.
    const stored = readCollection(A);
    expect(stored.status).toBe('PRESENT_VALID');
    expect(stored.value.payload[0].name).toBe('EDIT2_QUEUED_MUST_SURVIVE');
    expect(stored.value.payload[0].description).toBe('EDIT1_WHILE_ADOPTION_WAITING');

    // The older cloud-adoption decision cannot erase EDIT2; the conflict state
    // and the preserved local alternative remain accurate and actionable.
    const pending = service.getPendingConflict();
    expect(pending).not.toBeNull();
    expect(pending.active).toBe(true);
    expect(pending.localAlternative.available).toBe(true);
    const fork = readRecord(A, [pending.localAlternative.draftId]);
    expect(fork.status).toBe('PRESENT_VALID');
    expect(fork.value.payload[0].description).toBe('EDIT1_WHILE_ADOPTION_WAITING');

    // Dirty state stays accurate: the newest edit was never cloud-confirmed.
    expect(service.collectionDirty).toBe(true);

    // No cloud write, and the working set reflects the newest authored edit.
    expect(cloud.saveCampaignCloudCas).not.toHaveBeenCalled();
    expect(service.getCampaigns()[0].name).toBe('EDIT2_QUEUED_MUST_SURVIVE');

    // No cross-account leakage / no stale-generation completion.
    switchTo(B);
    expect(service.getPendingConflict()).toBeNull();
    expect(service.getCampaigns()).toEqual([]);
    expect(readCollection(B).value).toBeUndefined();
    switchTo(A);
    const restored = service.getPendingConflict();
    expect(restored.active).toBe(true);
    expect(restored.localAlternative.available).toBe(true);
  });

  it('QU1b a single newer edit also invalidates the adoption and stays recoverable', async () => {
    const { A, requests } = harness();
    const service = require(`${ROOT}/services/campaignService`).default;
    const cloud = require(`${ROOT}/services/campaignCloudService`).default;
    await seedDivergentConflict(service);

    const { buildPrivateLockName } = require(`${ROOT}/persistence/localCoordination`);
    const lockName = buildPrivateLockName({ scope: A, familyId: FAMILY });
    const release = deferred();
    const grabbed = deferred();
    const holding = navigator.locks.request(lockName, async() => {
      grabbed.resolve();
      await release.promise;
    });
    await grabbed.promise;
    const baseline = requests.length;

    const resolving = service.resolveConflictWithCloud({ expectedRevision: service.collectionRevision });
    await waitForRequestCount(requests, baseline + 1);

    const campaignId = service.getCampaigns()[0].id;
    service.updateCampaign(campaignId, { description: 'EDIT1_WHILE_ADOPTION_WAITING' });
    await waitForRequestCount(requests, baseline + 2);

    release.resolve();
    await holding;
    const resolved = await resolving;
    await service.flushPersistence();

    expect(resolved.status).toBe('STALE_CONFIRMATION');
    const pending = service.getPendingConflict();
    expect(pending).not.toBeNull();
    expect(pending.active).toBe(true);
    expect(pending.localAlternative.available).toBe(true);
    const fork = readRecord(A, [pending.localAlternative.draftId]);
    expect(fork.status).toBe('PRESENT_VALID');
    expect(fork.value.payload[0].description).toBe('EDIT1_WHILE_ADOPTION_WAITING');
    expect(service.collectionDirty).toBe(true);
    expect(cloud.saveCampaignCloudCas).not.toHaveBeenCalled();
  });

  it('QU2 a normal cloud adoption with no intervening edits still succeeds', async () => {
    const { A } = harness();
    const service = require(`${ROOT}/services/campaignService`).default;
    const cloud = require(`${ROOT}/services/campaignCloudService`).default;
    await seedDivergentConflict(service);

    const resolved = await service.resolveConflictWithCloud({ expectedRevision: service.collectionRevision });

    expect(resolved.status).toBe('OK');
    expect(resolved.resolution).toBe('continue-cloud');
    expect(service.getPendingConflict()).toBeNull();
    expect(service.collectionDirty).toBe(false);
    expect(service.getCampaigns()[0].name).toBe('From Cloud');
    const stored = readCollection(A);
    expect(stored.status).toBe('PRESENT_VALID');
    expect(stored.value.payload[0].name).toBe('From Cloud');
    expect(cloud.saveCampaignCloudCas).not.toHaveBeenCalled();
  });

  it('QU3 no-Web-Locks fallback preserves every existing record (fork or refuse, never overwrite)', async () => {
    harness();
    Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });
    const service = require(`${ROOT}/services/campaignService`).default;
    await seedDivergentConflict(service);

    const before = {};
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key && key.startsWith('mythrill:p5:user:owner-a:campaign.collection')) {
        before[key] = localStorage.getItem(key);
      }
    }
    expect(Object.keys(before).length).toBeGreaterThan(0);

    const resolved = await service.resolveConflictWithCloud({ expectedRevision: service.collectionRevision });
    expect(resolved.status).toBe('OK');

    // The no-lock fallback forks; it can never silently replace an existing
    // shared record, so every pre-existing record keeps its exact content.
    for (const [key, raw] of Object.entries(before)) {
      expect(localStorage.getItem(key)).toBe(raw);
    }
    expect(service.getCampaigns()[0].name).toBe('From Cloud');
  });
});
