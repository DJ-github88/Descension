/**
 * Project 5 Wave B (S6) — campaign cloud CAS regressions (fake Firestore).
 */

import {
  createCampaignCloudService,
  interpretCampaignCloudData,
  stableStringify,
  CLOUD_READ_STATES,
  CLOUD_CAS_RESULT,
  CAMPAIGN_CLOUD_SCHEMA_VERSION
} from '../campaignCloudService';

function clone(value) {
  return value === null || value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function createFakeFirestore(initialData = null) {
  let docData = clone(initialData);
  const ref = { __ref: 'campaigns' };
  const snapshot = () => ({
    exists: () => docData !== null,
    data: () => (docData === null ? undefined : clone(docData))
  });
  const fs = {
    doc: () => ref,
    getDoc: async () => snapshot(),
    setDoc: async (_ref, data) => { docData = clone(data); },
    runTransaction: async (_db, fn) => {
      let staged = null;
      const transaction = {
        get: async () => snapshot(),
        set: (_ref, data) => { staged = clone(data); }
      };
      const result = await fn(transaction);
      if (result && result.ok && staged) docData = staged;
      return result;
    },
    __get: () => clone(docData),
    __set: (data) => { docData = clone(data); }
  };
  return fs;
}

/** Simulates Firestore contention: the document changes after our read. */
function createContentionFirestore(initialData, externalMutation) {
  let docData = clone(initialData);
  const ref = { __ref: 'campaigns' };
  const snapshot = () => ({
    exists: () => docData !== null,
    data: () => (docData === null ? undefined : clone(docData))
  });
  return {
    doc: () => ref,
    getDoc: async () => snapshot(),
    setDoc: async (_ref, data) => { docData = clone(data); },
    runTransaction: async (_db, fn) => {
      let staged = null;
      const transaction = {
        get: async () => snapshot(),
        set: (_ref, data) => { staged = clone(data); }
      };
      const first = await fn(transaction);
      if (!first || !first.ok) return first;
      // Commit conflict: an external write landed after our read.
      docData = clone(externalMutation);
      let staged2 = null;
      const retryTx = {
        get: async () => snapshot(),
        set: (_ref, data) => { staged2 = clone(data); }
      };
      const second = await fn(retryTx);
      if (second && second.ok && staged2) docData = staged2;
      return second;
    },
    __get: () => clone(docData)
  };
}

const validEnvelope = (overrides = {}) => ({
  schemaVersion: CAMPAIGN_CLOUD_SCHEMA_VERSION,
  campaigns: [{ id: 'campaign_1', name: 'Existing' }],
  currentCampaignId: 'campaign_1',
  cloudRevision: 3,
  cloudEpoch: 'epoch_existing',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides
});

describe('Wave B S6 — campaign cloud CAS', () => {
  it('classifies ABSENT, EMPTY_VALID, PRESENT_VALID, MALFORMED and UNSUPPORTED_VERSION', () => {
    expect(interpretCampaignCloudData(null).state).toBe(CLOUD_READ_STATES.ABSENT);
    expect(interpretCampaignCloudData(validEnvelope({ campaigns: [], cloudRevision: 1 })).state)
      .toBe(CLOUD_READ_STATES.EMPTY_VALID);
    expect(interpretCampaignCloudData(validEnvelope()).state).toBe(CLOUD_READ_STATES.PRESENT_VALID);
    expect(interpretCampaignCloudData({ schemaVersion: 1, campaigns: 'nope' }).state)
      .toBe(CLOUD_READ_STATES.MALFORMED);
    expect(interpretCampaignCloudData(validEnvelope({ schemaVersion: 99 })).state)
      .toBe(CLOUD_READ_STATES.UNSUPPORTED_VERSION);
    expect(interpretCampaignCloudData({ campaigns: [{ id: 'x' }] }).state)
      .toBe(CLOUD_READ_STATES.PRESENT_VALID);
  });

  it('a failed network read is FAILED, never ABSENT', async () => {
    const fs = createFakeFirestore(null);
    fs.getDoc = async () => { throw new Error('offline'); };
    const service = createCampaignCloudService({
      db: {}, isFirebaseConfigured: true, firestore: fs
    });
    const state = await service.readCampaignCloudState('user-a');
    expect(state.state).toBe(CLOUD_READ_STATES.FAILED);
  });

  it('explicit creation against ABSENT creates revision 1 with a new epoch', async () => {
    const fs = createFakeFirestore(null);
    const service = createCampaignCloudService({ db: {}, isFirebaseConfigured: true, firestore: fs });

    const result = await service.createCampaignCloudIfAbsent({
      userId: 'user-a',
      campaigns: [{ id: 'campaign_new' }],
      currentCampaignId: 'campaign_new',
      localRevision: 1
    });
    expect(result.ok).toBe(true);
    expect(result.cloudRevision).toBe(1);
    expect(result.cloudEpoch).toEqual(expect.any(String));

    const doc = fs.__get();
    expect(doc.schemaVersion).toBe(1);
    expect(doc.campaigns).toEqual([{ id: 'campaign_new' }]);
    expect(doc.cloudRevision).toBe(1);
    expect(doc.cloudEpoch).toBe(result.cloudEpoch);
  });

  it('stale baseline is refused and never falls back to a blind write', async () => {
    const fs = createFakeFirestore(validEnvelope({ cloudRevision: 3 }));
    const before = fs.__get();
    const service = createCampaignCloudService({ db: {}, isFirebaseConfigured: true, firestore: fs });

    const result = await service.saveCampaignCloudCas({
      userId: 'user-a',
      campaigns: [{ id: 'stale' }],
      currentCampaignId: null,
      localRevision: 2,
      expected: { state: 'PRESENT_VALID', cloudEpoch: 'epoch_existing', cloudRevision: 2 }
    });
    expect(result.ok).toBe(false);
    expect(result.result).toBe(CLOUD_CAS_RESULT.BASELINE_CHANGED);
    expect(fs.__get()).toEqual(before);
  });

  it('a blind write without an explicit baseline is refused', async () => {
    const fs = createFakeFirestore(validEnvelope());
    const before = fs.__get();
    const service = createCampaignCloudService({ db: {}, isFirebaseConfigured: true, firestore: fs });

    const result = await service.saveCampaignCloudCas({
      userId: 'user-a',
      campaigns: [{ id: 'blind' }],
      expected: null
    });
    expect(result.ok).toBe(false);
    expect(result.result).toBe(CLOUD_CAS_RESULT.REFUSED);
    expect(result.reason).toBe('explicit-baseline-required');
    expect(fs.__get()).toEqual(before);
  });

  it('updates preserve the epoch and advance the revision; recreate after delete gets a new epoch', async () => {
    const fs = createFakeFirestore(validEnvelope({ cloudRevision: 3, cloudEpoch: 'epoch_A' }));
    const service = createCampaignCloudService({ db: {}, isFirebaseConfigured: true, firestore: fs });

    const update = await service.saveCampaignCloudCas({
      userId: 'user-a',
      campaigns: [{ id: 'edited' }],
      currentCampaignId: null,
      localRevision: 5,
      expected: { state: 'PRESENT_VALID', cloudEpoch: 'epoch_A', cloudRevision: 3 }
    });
    expect(update.ok).toBe(true);
    expect(update.cloudRevision).toBe(4);
    expect(update.cloudEpoch).toBe('epoch_A');
    expect(fs.__get().cloudEpoch).toBe('epoch_A');

    // Document delete/recreate: new instance, new epoch.
    fs.__set(null);
    const recreate = await service.createCampaignCloudIfAbsent({
      userId: 'user-a',
      campaigns: [{ id: 'fresh' }],
      localRevision: 1
    });
    expect(recreate.ok).toBe(true);
    expect(recreate.cloudRevision).toBe(1);
    expect(recreate.cloudEpoch).not.toBe('epoch_A');
  });

  it('a retried transaction refuses against the fixed captured baseline (no stale publish)', async () => {
    const externalMutation = validEnvelope({ cloudRevision: 4, campaigns: [{ id: 'external' }] });
    const fs = createContentionFirestore(
      validEnvelope({ cloudRevision: 3 }),
      externalMutation
    );
    const service = createCampaignCloudService({ db: {}, isFirebaseConfigured: true, firestore: fs });

    const result = await service.saveCampaignCloudCas({
      userId: 'user-a',
      campaigns: [{ id: 'stale-captured' }],
      localRevision: 2,
      expected: { state: 'PRESENT_VALID', cloudEpoch: 'epoch_existing', cloudRevision: 3 }
    });
    expect(result.ok).toBe(false);
    expect(result.result).toBe(CLOUD_CAS_RESULT.BASELINE_CHANGED);
    // The external writer's content survives; the stale capture was not published.
    expect(fs.__get()).toEqual(externalMutation);
  });

  it('malformed cloud content is never treated as ABSENT empty default', async () => {
    const malformed = { schemaVersion: 1, campaigns: 'not-an-array', cloudRevision: 1, cloudEpoch: 'e' };
    const fs = createFakeFirestore(malformed);
    const service = createCampaignCloudService({ db: {}, isFirebaseConfigured: true, firestore: fs });

    const read = await service.readCampaignCloudState('user-a');
    expect(read.state).toBe(CLOUD_READ_STATES.MALFORMED);

    const create = await service.createCampaignCloudIfAbsent({
      userId: 'user-a',
      campaigns: [{ id: 'should-not-overwrite' }],
      localRevision: 1
    });
    expect(create.ok).toBe(false);
    expect(create.result).toBe(CLOUD_CAS_RESULT.BASELINE_CHANGED);
    expect(fs.__get()).toEqual(malformed);
  });

  it('versionless legacy upgrade: unchanged-source verification and content preservation', async () => {
    const legacy = {
      campaigns: [{ id: 'legacy_1', name: 'Legacy Campaign' }],
      currentCampaignId: 'legacy_1',
      updatedAt: '2025-01-01T00:00:00.000Z'
    };
    const fs = createFakeFirestore(legacy);
    const service = createCampaignCloudService({ db: {}, isFirebaseConfigured: true, firestore: fs });

    const read = await service.readCampaignCloudState('user-a');
    expect(read.state).toBe(CLOUD_READ_STATES.PRESENT_VALID);
    expect(read.legacy).toBe(true);
    const expectedFingerprint = stableStringify(legacy);

    // Concurrent source change → refused, source untouched.
    const changed = await service.upgradeLegacyCampaignCloud({
      userId: 'user-a',
      expectedFingerprint: 'different'
    });
    expect(changed.ok).toBe(false);
    expect(changed.result).toBe(CLOUD_CAS_RESULT.BASELINE_CHANGED);
    expect(fs.__get()).toEqual(legacy);

    // Correct fingerprint → upgraded envelope preserving content exactly.
    const upgraded = await service.upgradeLegacyCampaignCloud({
      userId: 'user-a',
      expectedFingerprint
    });
    expect(upgraded.ok).toBe(true);
    const doc = fs.__get();
    expect(doc.schemaVersion).toBe(1);
    expect(doc.campaigns).toEqual(legacy.campaigns);
    expect(doc.currentCampaignId).toBe('legacy_1');
    expect(doc.cloudRevision).toBe(1);
    expect(read.rawFingerprint).toBe(expectedFingerprint);
  });

  it('guest and dev pseudo-accounts are rejected (no cloud use)', async () => {
    const fs = createFakeFirestore(null);
    const service = createCampaignCloudService({ db: {}, isFirebaseConfigured: true, firestore: fs });
    expect(service.isUsableAccount('guest-abc')).toBe(false);
    expect(service.isUsableAccount('admin-dev-user')).toBe(false);
    expect(service.isUsableAccount('dev-user-123')).toBe(false);
    expect(service.isUsableAccount('user-a')).toBe(true);

    const result = await service.saveCampaignCloudCas({
      userId: 'guest-abc',
      campaigns: [],
      expected: { state: 'ABSENT' }
    });
    expect(result.result).toBe(CLOUD_CAS_RESULT.NO_ACCOUNT);
  });
});
