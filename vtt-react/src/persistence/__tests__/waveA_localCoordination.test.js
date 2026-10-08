import { createUserScope } from '../scopeModel';
import { buildScopedKey } from '../keyFormat';
import { createDraftEnvelope } from '../draftEnvelope';
import { readScopedRecord, READ_STATUS } from '../safeRead';
import { writeScopedRecord } from '../safeWrite';
import {
  activatePrivateScope,
  resetBootstrapGateForTests,
  getBootstrapGateContext
} from '../bootstrapPrivacyGate';
import {
  writeWithCoordination,
  COORDINATION_STATUS,
  isWebLocksAvailable,
  withPrivateStorageLock,
  buildPrivateLockName
} from '../localCoordination';
import {
  preserveSourceCopy,
  completeRawCopyPreservation,
  verifyRecoveryReceiptForSource,
  verifyReceiptEvidence
} from '../preservation';
import {
  parseScopedStorageKey,
  isRelevantToScope,
  subscribeStorageInvalidation,
  handleStorageEvent,
  resetStorageInvalidationForTests
} from '../storageInvalidation';

const FAMILY = 'campaign.collection';
const SCOPE = createUserScope('user-a');

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

describe('Wave A S3 — local coordination', () => {
  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
    resetStorageInvalidationForTests();
    activatePrivateScope(SCOPE);
  });

  it('WA-05 Web Locks: competing revision writers serialize; the loser gets STALE, no silent overwrite', async () => {
    const restoreLocks = installFakeLocks(serializingLockManager());
    expect(isWebLocksAvailable()).toBe(true);

    const create = await writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE,
      expectedRevision: null,
      allowUncoordinatedCreate: true,
      payload: { campaigns: [] }
    });
    expect(create.status).toBe(COORDINATION_STATUS.OK);
    expect(create.newRevision).toBe(1);

    const [first, second] = await Promise.all([
      writeWithCoordination({ familyId: FAMILY, scope: SCOPE, expectedRevision: 1, expectedDraftId: create.draftId, payload: { campaigns: ['first'] } }),
      writeWithCoordination({ familyId: FAMILY, scope: SCOPE, expectedRevision: 1, expectedDraftId: create.draftId, payload: { campaigns: ['second'] } })
    ]);

    const statuses = [first.status, second.status].sort();
    expect(statuses).toEqual([COORDINATION_STATUS.OK, COORDINATION_STATUS.STALE_REVISION].sort());

    const winner = first.status === COORDINATION_STATUS.OK ? first : second;
    const loser = first.status === COORDINATION_STATUS.OK ? second : first;
    expect(winner.newRevision).toBe(2);
    expect(loser.currentRevision).toBe(2);

    const current = readScopedRecord({ familyId: FAMILY, scope: SCOPE });
    expect(current.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(current.value.localRevision).toBe(2);
    expect(current.value.payload).toEqual(winner === first ? { campaigns: ['first'] } : { campaigns: ['second'] });

    restoreLocks();
  });

  it('WA-06/WA-07 no-lock fallback forks: fresh draftId, same scope, provenance, source unchanged', async () => {
    installFakeLocks(undefined);
    expect(isWebLocksAvailable()).toBe(false);

    const primary = createDraftEnvelope({
      scope: SCOPE,
      draftId: 'draft_primary',
      payload: { campaigns: [{ id: 'original' }] }
    });
    expect(writeScopedRecord({ familyId: FAMILY, scope: SCOPE, value: primary }).status).toBe('OK');

    const forked = await writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE,
      expectedRevision: 1,
      payload: { campaigns: ['pending-edit'] }
    });

    expect(forked.status).toBe(COORDINATION_STATUS.FORKED);
    expect(forked.draftId).not.toBe('draft_primary');
    expect(forked.sourcePreserved).toBe(true);

    const forkedRead = readScopedRecord({ familyId: FAMILY, scope: SCOPE, locator: [forked.draftId] });
    expect(forkedRead.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(forkedRead.value.scopeId).toBe('user-a');
    expect(forkedRead.value.sourceProvenance).toMatchObject({
      kind: 'fork',
      importedFromDraftId: 'draft_primary'
    });

    const primaryRead = readScopedRecord({ familyId: FAMILY, scope: SCOPE });
    expect(primaryRead.value.draftId).toBe('draft_primary');
    expect(primaryRead.value.localRevision).toBe(1);
    expect(primaryRead.value.payload).toEqual({ campaigns: [{ id: 'original' }] });
  });

  it('WA-06b no-lock non-forkable update refuses instead of replacing', async () => {
    installFakeLocks(undefined);
    const result = await writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE,
      expectedRevision: 1,
      payload: { campaigns: [] },
      forkIfUncoordinated: false
    });
    expect(result.status).toBe(COORDINATION_STATUS.COORDINATION_UNAVAILABLE);
    expect(result.reason).toBe('web-locks-unavailable-and-record-not-forkable');
  });

  it('WA-08 lock wait + account generation change: revalidation refuses after acquisition, no write', async () => {
    let release;
    const gatePromise = new Promise((resolve) => { release = resolve; });
    const restoreLocks = installFakeLocks({
      request: (name, optionsOrCallback, maybeCallback) => {
        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback;
        return gatePromise.then(() => callback({ name }));
      }
    });

    const capturedContext = getBootstrapGateContext();
    const pending = writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE,
      context: capturedContext,
      expectedRevision: null,
      allowUncoordinatedCreate: true,
      payload: { campaigns: [] }
    });

    // Principal changes while the operation waits for the lock.
    activatePrivateScope(createUserScope('user-b'));
    release();

    const result = await pending;
    expect(result.status).toBe(COORDINATION_STATUS.CONTEXT_REFUSED);

    resetBootstrapGateForTests();
    activatePrivateScope(SCOPE);
    expect(readScopedRecord({ familyId: FAMILY, scope: SCOPE }).status).toBe(READ_STATUS.MISSING);
    restoreLocks();
  });

  it('WA-09 storage invalidation: A events are irrelevant to B and never hydrate or save', () => {
    const userA = createUserScope('user-a');
    const userB = createUserScope('user-b');
    const keyA = buildScopedKey({ scope: userA, familyId: FAMILY });
    const identity = parseScopedStorageKey(keyA);

    expect(identity).toMatchObject({ scopeKind: 'user', scopeId: 'user-a', familyId: FAMILY });
    expect(isRelevantToScope(identity, userB)).toBe(false);
    expect(isRelevantToScope(identity, userA)).toBe(true);
    expect(isRelevantToScope(identity, { scopeKind: 'guest', scopeId: 'local-guest' })).toBe(false);

    const received = [];
    const unsubscribe = subscribeStorageInvalidation((eventIdentity) => received.push(eventIdentity));
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');

    const handled = handleStorageEvent({ key: keyA, newValue: '{"state":1}' });

    expect(handled).not.toBeNull();
    expect(received).toHaveLength(1);
    // Invalidation is a pure signal: no hydration read, no save write.
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(getItemSpy).not.toHaveBeenCalled();

    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
    unsubscribe();
    resetStorageInvalidationForTests();
  });

  it('WA-10/WA-11 copy-before-switch: interruption at each stage preserves the source; receipt binds fingerprint', () => {
    installFakeLocks(serializingLockManager());
    const sourceKey = 'legacy-campaign-source';
    const sourceRaw = '{"v":1}';
    localStorage.setItem(sourceKey, sourceRaw);

    // Failure during copy write.
    const writeSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('quota');
    });
    const copyFailed = preserveSourceCopy({ sourceKey, scope: SCOPE });
    writeSpy.mockRestore();
    expect(copyFailed.ok).toBe(false);
    expect(copyFailed.reason).toBe('copy-write-failed');
    expect(localStorage.getItem(sourceKey)).toBe(sourceRaw);

    // Failure during copy verification (corrupted copy read-back).
    const originalGetItem = Storage.prototype.getItem;
    let getCalls = 0;
    const getSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(function (key) {
      getCalls += 1;
      if (getCalls === 2 && key.includes('quarantine')) {
        return 'tampered';
      }
      return originalGetItem.call(this, key);
    });
    const copyVerifyFailed = preserveSourceCopy({ sourceKey, scope: SCOPE });
    getSpy.mockRestore();
    expect(copyVerifyFailed.ok).toBe(false);
    expect(copyVerifyFailed.reason).toBe('copy-verify-failed');
    expect(localStorage.getItem(sourceKey)).toBe(sourceRaw);

    // Success path: source preserved, receipt written, then bound to fingerprint.
    const preserved = preserveSourceCopy({ sourceKey, scope: SCOPE });
    expect(preserved.ok).toBe(true);
    expect(preserved.sourceUntouched).toBe(true);
    expect(localStorage.getItem(sourceKey)).toBe(sourceRaw);

    const completed = completeRawCopyPreservation({
      preservation: preserved,
      destinationScope: SCOPE,
      sourceFamilyId: 'campaign.collection'
    });
    expect(completed.ok).toBe(true);
    expect(verifyRecoveryReceiptForSource({ receipt: completed.receipt, sourceKey }).valid).toBe(true);
    expect(verifyReceiptEvidence({ receipt: completed.receipt }).valid).toBe(true);

    // WA-10: a receipt for fingerprint X cannot validate modified source Y.
    localStorage.setItem(sourceKey, '{"v":2}');
    const revalidated = verifyRecoveryReceiptForSource({ receipt: completed.receipt, sourceKey });
    expect(revalidated.valid).toBe(false);
    expect(revalidated.reason).toBe('source-fingerprint-mismatch');
  });

  it('lock identity is scoped per family/resource, never one giant lock', () => {
    const nameA = buildPrivateLockName({ scope: SCOPE, familyId: FAMILY, resource: 'draft_1' });
    const nameB = buildPrivateLockName({ scope: SCOPE, familyId: 'worldbuilding.books', resource: 'book_1' });
    expect(nameA).not.toBe(nameB);
    expect(nameA).toContain('campaign.collection');
    expect(nameA).toContain('user:user-a');
  });

  it('withPrivateStorageLock refuses a captured context that no longer matches', async () => {
    const restoreLocks = installFakeLocks({
      request: (name, optionsOrCallback, maybeCallback) => {
        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback;
        return Promise.resolve(callback({ name }));
      }
    });
    const captured = getBootstrapGateContext();
    activatePrivateScope(createUserScope('user-c'));
    const result = await withPrivateStorageLock(
      { scope: SCOPE, familyId: FAMILY, context: captured },
      () => ({ status: 'SHOULD_NOT_RUN' })
    );
    expect(result.status).toBe(COORDINATION_STATUS.CONTEXT_REFUSED);
    restoreLocks();
  });
});
