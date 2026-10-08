import authService from '../../services/authService';
import useAuthStore from '../../store/authStore';
import useMapStore from '../../store/mapStore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { registerStore } from '../../store/storeRegistry';
import { createUserScope, guestScope, devScope } from '../scopeModel';
import { createDraftEnvelope } from '../draftEnvelope';
import { buildScopedKey, parseP5ScopedKey } from '../keyFormat';
import { readScopedRecord, READ_STATUS } from '../safeRead';
import { writeScopedRecord } from '../safeWrite';
import {
  activatePrivateScope,
  clearToSignedOut,
  resetBootstrapGateForTests,
  getBootstrapGateState,
  canHydratePrivateScopedData
} from '../bootstrapPrivacyGate';
import {
  writeWithCoordination,
  forkScopedRecord,
  COORDINATION_STATUS,
  isWebLocksAvailable
} from '../localCoordination';
import {
  preserveSourceCopy,
  completeRawCopyPreservation,
  completeTransformedPreservation,
  verifyRecoveryReceiptForSource,
  verifyReceiptEvidence
} from '../preservation';
import { parseScopedStorageKey } from '../storageInvalidation';
import {
  coordinateAuthPrincipalChange,
  registerHandoffParticipant,
  resetHandoffCoordinatorForTests,
  registerDefaultHandoffParticipants,
  whenHandoffIdle
} from '../handoff/accountHandoffCoordinator';
import {
  resetStoreWithoutPersist,
  resetPrivateRuntimeProjections
} from '../handoff/runtimeResetParticipant';
import {
  markSocketRetired,
  isSocketRetired,
  createSocketLifetimeGuard,
  principalKeyOfAuthState
} from '../handoff/socketPrincipalRetirement';
import { registerRoomLifecycleHandlers } from '../../components/multiplayer/socketHandlers/roomLifecycleHandlers';
import { registerConnectionHandlers } from '../../components/multiplayer/socketHandlers/connectionHandlers';
import { clearSpellLibraryStorage, clearSpellLibraryNow } from '../../utils/clearSpellCache';

jest.mock('../../services/authService', () => ({
  __esModule: true,
  default: {
    isConfigured: false,
    signInAsAnonymous: jest.fn(),
    signIn: jest.fn(),
    signUp: jest.fn(),
    signInWithPopup: jest.fn(),
    generateFriendId: jest.fn(() => 'FRIEND-TEST'),
    onAuthStateChange: jest.fn(() => () => {}),
    signOut: jest.fn(async () => ({ success: true })),
    getCurrentUser: jest.fn(() => null),
    getUserData: jest.fn(async () => null)
  }
}));

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

describe('R1 — generic cleanup bypass closed', () => {
  beforeEach(() => localStorage.clear());

  it('mapStore.cleanupStorage protects backups/quarantine/unknown keys and still removes public caches', () => {
    localStorage.setItem('mythrill-backup-char-1-100', '{"c":1}');
    localStorage.setItem('mythrill-temp-scratch', 'semi-authored');
    localStorage.setItem('unknown-named-temp-cache-backup', 'x');
    localStorage.setItem('mythrill-campaigns', '[]');
    localStorage.setItem('creature-library-version', 'old');

    const cleaned = useMapStore.getState().cleanupStorage();

    expect(localStorage.getItem('mythrill-backup-char-1-100')).toBe('{"c":1}');
    expect(localStorage.getItem('mythrill-temp-scratch')).toBe('semi-authored');
    expect(localStorage.getItem('unknown-named-temp-cache-backup')).toBe('x');
    expect(localStorage.getItem('mythrill-campaigns')).toBe('[]');
    expect(localStorage.getItem('creature-library-version')).toBeNull();
    expect(cleaned).toBe(1);
  });

  it('spell cache utilities do not discard authored spell families', () => {
    localStorage.setItem('spell-store', '{"authored":true}');
    localStorage.setItem('spell_library_data', '{"data":{"spells":[1]}}');
    localStorage.setItem('mythrill-custom-spells', '[{"id":"s1"}]');
    localStorage.setItem('spell-cache-version', 'old');

    clearSpellLibraryStorage();
    clearSpellLibraryNow();

    expect(localStorage.getItem('spell-store')).toBe('{"authored":true}');
    expect(localStorage.getItem('spell_library_data')).toEqual('{"data":{"spells":[1]}}');
    expect(localStorage.getItem('mythrill-custom-spells')).toBe('[{"id":"s1"}]');
    expect(localStorage.getItem('spell-cache-version')).toBeNull();
  });
});

describe('R2 — immutable context and predecessor identity', () => {
  const SCOPE = createUserScope('user-a');

  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
    activatePrivateScope(SCOPE);
  });

  it('Proof A: queued operation without an explicit context is refused after same-UID relogin', async () => {
    let release;
    const gatePromise = new Promise((resolve) => { release = resolve; });
    const restoreLocks = installFakeLocks({
      request: (name, optionsOrCallback, maybeCallback) => {
        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback;
        return gatePromise.then(() => callback({ name }));
      }
    });

    const pending = writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE,
      expectedRevision: null,
      payload: { v: 1 }
    });

    // A logout -> A login while the operation waits: same scope, new generation.
    clearToSignedOut();
    activatePrivateScope(SCOPE);
    release();

    const result = await pending;
    expect(result.status).toBe(COORDINATION_STATUS.CONTEXT_REFUSED);
    resetBootstrapGateForTests();
    activatePrivateScope(SCOPE);
    expect(readScopedRecord({ familyId: FAMILY, scope: SCOPE }).status).toBe(READ_STATUS.MISSING);
    restoreLocks();
  });

  it('Proof B: an equal-revision replacement draft with different identity cannot be mutated', async () => {
    const restoreLocks = installFakeLocks(serializingLockManager());

    const create = await writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE,
      expectedRevision: null,
      payload: { owner: 'X' }
    });
    expect(create.status).toBe(COORDINATION_STATUS.OK);

    // Another writer replaces the shared key with draft Y at the same revision.
    const yEnvelope = createDraftEnvelope({ scope: SCOPE, draftId: 'draft_y', payload: { owner: 'Y' } });
    expect(writeScopedRecord({ familyId: FAMILY, scope: SCOPE, value: yEnvelope }).status).toBe('OK');

    const stale = await writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE,
      expectedRevision: 1,
      expectedDraftId: create.draftId,
      payload: { owner: 'STALE' }
    });
    expect(stale.status).toBe(COORDINATION_STATUS.STALE_REVISION);
    expect(stale.currentDraftId).toBe('draft_y');

    const current = readScopedRecord({ familyId: FAMILY, scope: SCOPE });
    expect(current.value.draftId).toBe('draft_y');
    expect(current.value.payload).toEqual({ owner: 'Y' });

    const noIdentity = await writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE,
      expectedRevision: 1,
      payload: { owner: 'NO-ID' }
    });
    expect(noIdentity.status).toBe(COORDINATION_STATUS.INVALID_REQUEST);
    restoreLocks();
  });
});

describe('R3 — no uncoordinated shared-key creation', () => {
  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
    activatePrivateScope(createUserScope('user-a'));
  });

  it('interleaved creators that observe absence cannot overwrite each other', async () => {
    installFakeLocks(undefined);
    expect(isWebLocksAvailable()).toBe(false);

    const [first, second] = await Promise.all([
      writeWithCoordination({ familyId: FAMILY, scope: createUserScope('user-a'), expectedRevision: null, payload: { n: 1 } }),
      writeWithCoordination({ familyId: FAMILY, scope: createUserScope('user-a'), expectedRevision: null, payload: { n: 2 } })
    ]);

    expect(first.status).toBe(COORDINATION_STATUS.FORKED);
    expect(second.status).toBe(COORDINATION_STATUS.FORKED);
    expect(first.key).not.toBe(second.key);

    const firstRead = readScopedRecord({
      familyId: FAMILY,
      scope: createUserScope('user-a'),
      locator: [first.draftId]
    });
    const secondRead = readScopedRecord({
      familyId: FAMILY,
      scope: createUserScope('user-a'),
      locator: [second.draftId]
    });
    expect(firstRead.value.payload).toEqual({ n: 1 });
    expect(secondRead.value.payload).toEqual({ n: 2 });
  });
});

describe('R4 — fork allocation and ownership', () => {
  const SCOPE = createUserScope('user-a');

  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
    activatePrivateScope(SCOPE);
  });

  it('forced ID collisions never replace an existing fork; cross-owner source is refused', () => {
    installFakeLocks(undefined);

    const first = forkScopedRecord({
      familyId: FAMILY,
      scope: SCOPE,
      payload: { v: 1 },
      draftIdFactory: () => 'draft_collide',
      allocationIdFactory: () => 'fixed-token'
    });
    expect(first.status).toBe(COORDINATION_STATUS.FORKED);
    const before = readScopedRecord({ familyId: FAMILY, scope: SCOPE, locator: [first.draftId] });
    expect(before.value.payload).toEqual({ v: 1 });

    // Identical allocation identity (same base + same token) can never
    // overwrite the completed alternative; it refuses instead.
    const second = forkScopedRecord({
      familyId: FAMILY,
      scope: SCOPE,
      payload: { v: 2 },
      draftIdFactory: () => 'draft_collide',
      allocationIdFactory: () => 'fixed-token'
    });
    expect(second.status).toBe(COORDINATION_STATUS.FORK_COLLISION);
    const after = readScopedRecord({ familyId: FAMILY, scope: SCOPE, locator: [first.draftId] });
    expect(after.value.payload).toEqual({ v: 1 });

    // Competing writers use independently unique destinations by default:
    // the same forced base id no longer shares a key.
    const independent = forkScopedRecord({
      familyId: FAMILY,
      scope: SCOPE,
      payload: { v: 3 },
      draftIdFactory: () => 'draft_collide'
    });
    expect(independent.status).toBe(COORDINATION_STATUS.FORKED);
    expect(independent.key).not.toBe(first.key);

    const third = forkScopedRecord({
      familyId: FAMILY,
      scope: SCOPE,
      payload: { v: 4 },
      draftIdFactory: (attempt) => (attempt === 0 ? 'draft_collide' : 'draft_unique'),
      allocationIdFactory: () => 'fixed-token'
    });
    expect(third.status).toBe(COORDINATION_STATUS.FORKED);
    expect(third.draftId.startsWith('draft_unique')).toBe(true);

    const scopeB = createUserScope('user-b');
    activatePrivateScope(scopeB);
    const foreignSource = createDraftEnvelope({ scope: SCOPE, draftId: 'draft_a_source', payload: { a: 1 } });
    const cross = forkScopedRecord({
      familyId: FAMILY,
      scope: scopeB,
      payload: { stolen: true },
      sourceEnvelope: foreignSource,
      sourceKey: 'legacy-key'
    });
    expect(cross.status).toBe(COORDINATION_STATUS.SOURCE_SCOPE_MISMATCH);
  });
});

describe('R5 — guest/dev key round trips', () => {
  it('builder/parser/invalidation round trip for user, guest and dev keys', () => {
    const scopes = [createUserScope('user-a'), guestScope(), devScope()];
    for (const scope of scopes) {
      for (const locator of [[], ['draft_1'], ['draft_1', 'two 2']]) {
        const key = buildScopedKey({ scope, familyId: FAMILY, locator });
        const parsed = parseP5ScopedKey(key);
        expect(parsed).not.toBeNull();
        expect(parsed.scopeKind).toBe(scope.scopeKind);
        expect(parsed.familyId).toBe(FAMILY);
        expect(parsed.segments).toEqual(locator);
        if (scope.scopeKind === 'user') {
          expect(parsed.scopeId).toBe(scope.scopeId);
        } else {
          expect(parsed.scopeId).toBeNull();
        }

        const identity = parseScopedStorageKey(key);
        expect(identity.familyId).toBe(FAMILY);
        expect(identity.locator).toEqual(locator);
      }
    }

    expect(parseP5ScopedKey('mythrill:p5:guest')).toBeNull();
    expect(parseP5ScopedKey('mythrill:p5:guest:')).toBeNull();
    expect(parseP5ScopedKey('mythrill:p5:user:user-a')).toBeNull();
    expect(parseP5ScopedKey('mythrill:p5:user::campaign.collection')).toBeNull();
    expect(parseP5ScopedKey('mythrill:p5:guest::draft_1')).toBeNull();
  });
});

describe('R6 — verified preservation receipts', () => {
  const SCOPE = createUserScope('user-a');

  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
    activatePrivateScope(SCOPE);
  });

  it('receipts bind exact source key/family/fingerprint and verified destinations', () => {
    const sourceKey = 'legacy-source';
    localStorage.setItem(sourceKey, '{"v":1}');
    const preserved = preserveSourceCopy({ sourceKey, sourceFamilyId: FAMILY, scope: SCOPE });
    expect(preserved.ok).toBe(true);

    // 4. A caller-supplied pseudo-receipt is not a verified receipt.
    const forged = {
      kind: 'p5-recovery-receipt',
      schemaVersion: 1,
      receiptId: 'forged',
      verificationKind: 'raw-recovery-copy',
      status: 'completed',
      sourceKey,
      sourceFamilyId: FAMILY,
      sourceFingerprint: preserved.fingerprint.value,
      sourceFingerprintAlgorithm: 'fnv1a-32-hex',
      destinationScopeKind: 'user',
      destinationScopeId: 'user-a',
      copyKey: 'mythrill:p5:user:user-a:preservation.quarantine:nope',
      operationKind: 'legacy-copy',
      createdAt: new Date().toISOString()
    };
    expect(verifyReceiptEvidence({ receipt: forged }).valid).toBe(false);
    expect(verifyReceiptEvidence({ receipt: forged }).reason).toBe('copy-key-binding-incomplete');

    // 1. Raw copy completion + source binding.
    const raw = completeRawCopyPreservation({ preservation: preserved, destinationScope: SCOPE, sourceFamilyId: FAMILY });
    expect(raw.ok).toBe(true);
    expect(verifyRecoveryReceiptForSource({ receipt: raw.receipt, sourceKey, sourceFamilyId: FAMILY }).valid).toBe(true);
    expect(verifyReceiptEvidence({ receipt: raw.receipt }).valid).toBe(true);

    // Wrong source key with identical bytes is refused.
    localStorage.setItem('other-key', '{"v":1}');
    const wrongKey = verifyRecoveryReceiptForSource({ receipt: raw.receipt, sourceKey: 'other-key' });
    expect(wrongKey.valid).toBe(false);
    expect(wrongKey.reason).toBe('source-key-mismatch');

    // 2. Missing destination produces no verified transformed completion.
    const missing = completeTransformedPreservation({
      preservation: preserved,
      destinationScope: SCOPE,
      destinationFamilyId: FAMILY,
      destinationDraftId: 'draft_missing',
      destinationRevision: 1
    });
    expect(missing.ok).toBe(false);

    // 3. A real transformed destination must reference the exact source.
    const goodDest = createDraftEnvelope({
      scope: SCOPE,
      draftId: 'draft_dest',
      payload: { v: 1 },
      sourceProvenance: {
        kind: 'migration',
        sourceKey,
        sourceFingerprint: preserved.fingerprint.value
      }
    });
    expect(writeScopedRecord({ familyId: FAMILY, scope: SCOPE, locator: ['draft_dest'], value: goodDest }).status).toBe('OK');
    const transformed = completeTransformedPreservation({
      preservation: preserved,
      destinationScope: SCOPE,
      destinationFamilyId: FAMILY,
      destinationDraftId: 'draft_dest',
      destinationRevision: 1
    });
    expect(transformed.ok).toBe(true);
    expect(transformed.receipt.verificationKind).toBe('transformed-draft');
    expect(verifyReceiptEvidence({ receipt: transformed.receipt }).valid).toBe(true);

    const badDest = createDraftEnvelope({
      scope: SCOPE,
      draftId: 'draft_bad',
      payload: { v: 1 },
      sourceProvenance: {
        kind: 'migration',
        sourceKey: 'other-key',
        sourceFingerprint: preserved.fingerprint.value
      }
    });
    expect(writeScopedRecord({ familyId: FAMILY, scope: SCOPE, locator: ['draft_bad'], value: badDest }).status).toBe('OK');
    const mismatched = completeTransformedPreservation({
      preservation: preserved,
      destinationScope: SCOPE,
      destinationFamilyId: FAMILY,
      destinationDraftId: 'draft_bad',
      destinationRevision: 1
    });
    expect(mismatched.ok).toBe(false);
    expect(mismatched.reason).toBe('destination-provenance-mismatch');

    // Source remains untouched through all of the above.
    expect(localStorage.getItem(sourceKey)).toBe('{"v":1}');
  });
});

describe('R7 — fail-closed account handoff', () => {
  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
    resetHandoffCoordinatorForTests();
  });

  it('A: real private projection reset failure blocks B private work', () => {
    registerDefaultHandoffParticipants();
    const failStore = create((set) => ({
      value: 'A-private-data',
      resetStore: () => { throw new Error('projection reset exploded'); }
    }));
    registerStore('partyStore', failStore);

    const handoff = coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });

    expect(handoff.result.blocked).toBe(true);
    expect(handoff.result.projectionClean).toBe(false);
    expect(handoff.result.failures.some((failure) => failure.participantId === 'runtime-projection-reset')).toBe(true);
    expect(handoff.gate.phase).toBe('loading');
    expect(handoff.gate.scope).toBeNull();
    expect(canHydratePrivateScopedData(createUserScope('user-b'))).toBe(false);
    expect(failStore.getState().value).toBe('A-private-data');
  });

  it('B: a returned { clean:false } without throwing is recognized as failure', () => {
    registerHandoffParticipant({
      id: 'returned-failure',
      resetProjection: () => ({ clean: false, failures: [{ reason: 'reset-left-dirty' }] })
    });
    const handoff = coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    expect(handoff.result.blocked).toBe(true);
    expect(handoff.result.failures).toEqual([
      { participantId: 'returned-failure', hook: 'resetProjection', error: 'reset-left-dirty' }
    ]);
    expect(handoff.gate.scope).toBeNull();
  });

  it('C: delayed/rejecting Promise hooks cannot be overtaken by activation', async () => {
    let resolveRetire;
    registerHandoffParticipant({
      id: 'delayed-participant',
      retire: (envelope) => {
        if (envelope.nextScope && envelope.nextScope.scopeId === 'user-b') {
          return new Promise((resolve) => { resolveRetire = () => resolve({ ok: true }); });
        }
        return { ok: true };
      }
    });

    coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    const pending = coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    expect(pending.deferred).toBe(true);
    // While required retirement is in flight, B is not active.
    expect(canHydratePrivateScopedData(createUserScope('user-b'))).toBe(false);
    expect(getBootstrapGateState().phase).toBe('retiring');

    resolveRetire();
    await whenHandoffIdle();
    expect(getBootstrapGateState().scope).toEqual({ scopeKind: 'user', scopeId: 'user-b' });
    expect(canHydratePrivateScopedData(createUserScope('user-b'))).toBe(true);

    resetHandoffCoordinatorForTests();
    registerHandoffParticipant({
      id: 'rejecting-participant',
      retire: (envelope) => {
        if (envelope.nextScope && envelope.nextScope.scopeId === 'user-b') {
          return Promise.reject(new Error('retire rejected'));
        }
        return { ok: true };
      }
    });
    coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    const rejected = coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    expect(rejected.deferred).toBe(true);
    await whenHandoffIdle();
    const status = getBootstrapGateState();
    expect(status.phase).toBe('loading');
    expect(status.scope).toBeNull();
  });

  it('F: rapid A→B→C never activates an obsolete principal', async () => {
    let resolveB;
    registerHandoffParticipant({
      id: 'slow-b',
      retire: (envelope) => {
        if (envelope.nextScope && envelope.nextScope.scopeId === 'user-b') {
          return new Promise((resolve) => { resolveB = () => resolve({ ok: true }); });
        }
        return { ok: true };
      }
    });

    coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    const bOutcome = coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    expect(bOutcome.deferred).toBe(true);
    coordinateAuthPrincipalChange({ user: { uid: 'user-c' } });

    resolveB();
    await whenHandoffIdle();

    expect(getBootstrapGateState().scope).toEqual({ scopeKind: 'user', scopeId: 'user-c' });
    expect(canHydratePrivateScopedData(createUserScope('user-b'))).toBe(false);
    expect(canHydratePrivateScopedData(createUserScope('user-c'))).toBe(true);
  });

  it('D/E: persisted reset suspends persistence and restores it; nonpersisted reset runs', () => {
    let storageWrites = 0;
    const memory = {};
    const zustandStorage = {
      getItem: (name) => (name in memory ? memory[name] : null),
      setItem: (name, value) => { storageWrites += 1; memory[name] = value; },
      removeItem: (name) => { delete memory[name]; }
    };
    const usePersisted = create(persist((set) => ({
      value: 'A-data',
      resetStore: () => set({ value: null })
    }), { name: 'r7-persisted', storage: zustandStorage }));

    const persistedResult = resetStoreWithoutPersist(usePersisted);
    expect(persistedResult).toEqual({ reset: true, persistenceSuspended: true });
    expect(usePersisted.getState().value).toBeNull();
    expect(storageWrites).toBe(0);
    expect(usePersisted.persist.getOptions().storage).toBe(zustandStorage);

    const usePlain = create((set) => ({
      value: 'A-data',
      resetStore: () => { set({ value: null }); }
    }));
    const plainResult = resetStoreWithoutPersist(usePlain);
    expect(plainResult).toEqual({ reset: true, persistenceSuspended: false });
    expect(usePlain.getState().value).toBeNull();

    // A restored persistence engine is verified; a throwing restoration is a
    // surfaced failure, never a silent success with persistence disabled.
    const brokenRestore = create(persist((set) => ({
      value: 'A',
      resetStore: () => set({ value: null })
    }), { name: 'r7-broken', storage: zustandStorage }));
    const originalSetOptions = brokenRestore.persist.setOptions;
    let calls = 0;
    brokenRestore.persist.setOptions = (options) => {
      calls += 1;
      if (calls === 2) throw new Error('restore failed');
      return originalSetOptions(options);
    };
    const brokenResult = resetStoreWithoutPersist(brokenRestore);
    expect(brokenResult.reset).toBe(false);
    expect(brokenResult.reason).toBe('persistence-restore-failed');
  });
});

describe('R8 — auth/socket/join lifetime fencing', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
    resetBootstrapGateForTests();
    resetHandoffCoordinatorForTests();
  });

  it('socket lifetime guard is invalidated by retirement and principal change', () => {
    const socket = {};
    let authState = { user: { uid: 'user-a' } };
    const guard = createSocketLifetimeGuard({
      socket,
      principalKey: principalKeyOfAuthState(authState),
      getAuthState: () => authState
    });
    expect(guard.isValid()).toBe(true);

    authState = { user: { uid: 'user-b' } };
    expect(guard.isValid()).toBe(false);

    const socket2 = {};
    const guard2 = createSocketLifetimeGuard({
      socket: socket2,
      principalKey: 'user:user-a',
      getAuthState: () => ({ user: { uid: 'user-a' } })
    });
    expect(guard2.isValid()).toBe(true);
    markSocketRetired(socket2);
    expect(isSocketRetired(socket2)).toBe(true);
    expect(guard2.isValid()).toBe(false);
  });

  it('late packets on a retired socket do not reach handler bodies', () => {
    const handlers = {};
    const socket = { on: (event, fn) => { handlers[event] = fn; }, off: jest.fn() };
    const setActualPlayerCount = jest.fn();
    const addNotification = jest.fn();
    const navigate = jest.fn();

    registerRoomLifecycleHandlers({
      socket,
      setActualPlayerCount,
      setConnectedPlayers: jest.fn(),
      setIsGM: jest.fn(),
      setPendingRoomData: jest.fn(),
      setIsRoomReady: jest.fn(),
      setConnectionStatus: jest.fn(),
      setLoadingStatusMessage: jest.fn(),
      navigate,
      addNotification
    });
    registerConnectionHandlers({
      socket,
      setIsConnecting: jest.fn(),
      setConnectionQuality: jest.fn(),
      setConnectionStatus: jest.fn(),
      setIsJoiningRoom: jest.fn(),
      setPendingRoomData: jest.fn(),
      setIsRoomReady: jest.fn(),
      setError: jest.fn(),
      addNotification
    });

    markSocketRetired(socket);

    expect(() => handlers.room_joined({ room: { id: 'r1' } })).not.toThrow();
    expect(() => handlers.room_created({ room: { id: 'r1' } })).not.toThrow();
    expect(() => handlers.player_joined({ player: { id: 'p1' } })).not.toThrow();
    expect(() => handlers.player_left({ player: { id: 'p1' } })).not.toThrow();
    expect(() => handlers.room_closed({})).not.toThrow();
    expect(() => handlers.reconnect(1)).not.toThrow();

    expect(setActualPlayerCount).not.toHaveBeenCalled();
    expect(addNotification).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('late guest sign-in completion cannot overwrite a newer auth intent', async () => {
    let resolveGuest;
    authService.signInAsAnonymous.mockImplementationOnce(
      () => new Promise((resolve) => { resolveGuest = resolve; })
    );
    authService.signIn.mockResolvedValueOnce({ success: true });
    sessionStorage.setItem('pendingGMSessionInvitation', '{"invitationId":"i1"}');

    const guestPromise = useAuthStore.getState().signInAsGuest();
    await useAuthStore.getState().signIn('real@user.test', 'pw');

    resolveGuest({ success: true, user: { uid: 'anon-late' } });
    const guestResult = await guestPromise;

    expect(guestResult.superseded).toBe(true);
    expect(localStorage.getItem('mythrill-guest-user')).toBeNull();
    expect(localStorage.getItem('mythrill-guest-user-data')).toBeNull();
    expect(useAuthStore.getState().user?.uid).not.toBe('anon-late');
    // Superseded completion also must not clear newer transient state.
    expect(sessionStorage.getItem('pendingGMSessionInvitation')).toBe(JSON.stringify({ invitationId: 'i1' }));
  });
});
