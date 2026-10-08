/**
 * Project 5 Wave B (S5) — scoped consumer bridge regressions.
 */

import {
  resolveActiveScope,
  loadScopedDraft,
  saveScopedDraft,
  loadScopedNative,
  saveScopedNative,
  clearScopedNative,
  ensureLegacySourceQuarantine,
  findQuarantineReceipt
} from '../scopedConsumer';
import {
  activatePrivateScope,
  clearToSignedOut,
  resetBootstrapGateForTests,
  getBootstrapGateState
} from '../bootstrapPrivacyGate';
import { createUserScope } from '../scopeModel';
import { readScopedRecord, READ_STATUS } from '../safeRead';
import { readDurable } from '../protectedStorage';

const A = createUserScope('user-a');
const B = createUserScope('user-b');
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

describe('Wave B S5 — scoped consumer bridge', () => {
  let restoreLocks;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetBootstrapGateForTests();
    restoreLocks = installFakeLocks(serializingLockManager());
  });

  afterEach(() => {
    restoreLocks();
  });

  it('draft save/load round trip in the active scope with predecessor revision', async () => {
    activatePrivateScope(A);

    const created = await saveScopedDraft({ familyId: FAMILY, payload: { v: 1 } });
    expect(created.status).toBe('OK');
    expect(created.newRevision).toBe(1);

    const loaded = loadScopedDraft({ familyId: FAMILY });
    expect(loaded.status).toBe('OK');
    expect(loaded.payload).toEqual({ v: 1 });
    expect(loaded.localRevision).toBe(1);

    const updated = await saveScopedDraft({
      familyId: FAMILY,
      payload: { v: 2 },
      expectedRevision: loaded.localRevision,
      expectedDraftId: loaded.draftId
    });
    expect(updated.status).toBe('OK');
    expect(updated.newRevision).toBe(2);

    const reloaded = loadScopedDraft({ familyId: FAMILY });
    expect(reloaded.payload).toEqual({ v: 2 });
  });

  it('no active scope: reads report NO_ACTIVE_SCOPE and saves refuse without writing', async () => {
    clearToSignedOut();
    expect(resolveActiveScope()).toBeNull();

    const read = loadScopedDraft({ familyId: FAMILY });
    expect(read.status).toBe('NO_ACTIVE_SCOPE');

    const save = await saveScopedDraft({ familyId: FAMILY, payload: { v: 1 } });
    expect(save.status).toBe('NO_ACTIVE_SCOPE');
    expect(Object.keys(localStorage)).toEqual([]);
  });

  it('a captured context is refused after same-UID relogin (stale async save cannot write)', async () => {
    activatePrivateScope(A);

    // Start the save (captures the operation context), then relogin as the
    // same UID before the queued write resumes.
    const pending = saveScopedDraft({
      familyId: FAMILY,
      payload: { stale: true },
      expectedRevision: null
    });
    clearToSignedOut();
    activatePrivateScope(A);

    const save = await pending;
    expect(save.status).toBe('CONTEXT_REFUSED');
    const leaked = Object.keys(localStorage).filter((key) => key.includes(FAMILY));
    expect(leaked).toEqual([]);
  });

  it('family-native selector write is scoped, readable, clearable and never cross-account', () => {
    activatePrivateScope(A);
    const written = saveScopedNative({ familyId: 'campaign.currentId', value: { value: 'campaign_1' } });
    expect(written.status).toBe('OK');

    const readA = loadScopedNative({ familyId: 'campaign.currentId' });
    expect(readA.status).toBe('OK');
    expect(readA.value.value).toBe('campaign_1');

    // B has an independent namespace and sees nothing.
    clearToSignedOut();
    activatePrivateScope(B);
    const readB = loadScopedNative({ familyId: 'campaign.currentId' });
    expect(readB.status).toBe('MISSING');

    const cleared = clearScopedNative({ familyId: 'campaign.currentId' });
    expect(cleared.status).toBe('OK');
    expect(loadScopedNative({ familyId: 'campaign.currentId' }).status).toBe('MISSING');
  });

  it('legacy quarantine preserves the source without adopting it, and is idempotent', () => {
    const legacyRaw = JSON.stringify([{ id: 'campaign_legacy', name: 'Legacy' }]);
    localStorage.setItem('mythrill-campaigns', legacyRaw);
    activatePrivateScope(A);

    const first = ensureLegacySourceQuarantine({
      legacyKey: 'mythrill-campaigns',
      familyId: FAMILY,
      scope: A
    });
    expect(first.ok).toBe(true);
    expect(first.status).toBe('PRESERVED');
    expect(first.copyKey).not.toBe('mythrill-campaigns');

    // The legacy source is byte-for-byte untouched and no authored record
    // claims it for A.
    expect(localStorage.getItem('mythrill-campaigns')).toBe(legacyRaw);
    expect(loadScopedDraft({ familyId: FAMILY }).status).toBe('MISSING');
    const receipt = findQuarantineReceipt({
      scope: A,
      sourceKey: 'mythrill-campaigns',
      fingerprintValue: first.fingerprint
    });
    expect(receipt).not.toBeNull();
    expect(readDurable(receipt.key).raw).not.toBeNull();

    const second = ensureLegacySourceQuarantine({
      legacyKey: 'mythrill-campaigns',
      familyId: FAMILY,
      scope: A
    });
    expect(second.status).toBe('ALREADY_PRESERVED');
    expect(second.receiptKey).toBe(first.receiptKey);
  });

  it('raw scoped read sees another account only through its own explicit scope', async () => {
    activatePrivateScope(A);
    await saveScopedDraft({ familyId: FAMILY, payload: { owner: 'A' } });

    const rawA = readScopedRecord({ familyId: FAMILY, scope: A });
    expect(rawA.status).toBe(READ_STATUS.PRESENT_VALID);
    const rawB = readScopedRecord({ familyId: FAMILY, scope: B });
    expect(rawB.status).toBe(READ_STATUS.MISSING);

    const scopeState = getBootstrapGateState();
    expect(scopeState.scope.scopeId).toBe('user-a');
  });
});
