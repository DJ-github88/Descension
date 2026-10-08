/**
 * P5 Wave A — final blocker corrections (B1–B5): permanent RED→GREEN regressions.
 *
 * Every scenario in this file was first demonstrated failing through the real
 * production path named in each test, then fixed. These tests intentionally
 * exercise the actual modules (coordination, receipts, runtime reset,
 * coordinator binding, auth store, socket setup, room admission, UI boundary)
 * with controlled dependencies only.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import authService from '../../services/authService';
import useAuthStore from '../../store/authStore';
import { registerStore } from '../../store/storeRegistry';
import { createUserScope } from '../scopeModel';
import { bumpLocalRevision } from '../draftEnvelope';
import { readScopedRecord, READ_STATUS } from '../safeRead';
import {
  activatePrivateScope,
  clearToSignedOut,
  resetBootstrapGateForTests,
  getBootstrapGateState
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
  verifyRecoveryReceiptForSource,
  verifyReceiptEvidence,
  fingerprintRawString,
  RECEIPT_VERIFICATION_KINDS
} from '../preservation';
import {
  resetStoreWithoutPersist,
  resetPrivateRuntimeProjections
} from '../handoff/runtimeResetParticipant';
import {
  coordinateAuthPrincipalChange,
  resetHandoffCoordinatorForTests,
  registerDefaultHandoffParticipants,
  whenHandoffIdle,
  getHandoffStatus
} from '../handoff/accountHandoffCoordinator';
import { markSocketRetired } from '../handoff/socketPrincipalRetirement';
import { handleJoinRoom } from '../../components/multiplayer/roomJoinHandler';
import { setupSocketConnection } from '../../components/multiplayer/useSocketConnection';

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

jest.mock('socket.io-client', () => ({ io: jest.fn() }));

jest.mock('../../store/partyStore', () => {
  const state = {
    partyMembers: [],
    currentParty: null,
    isInParty: false,
    leaderId: null,
    replacePartyMembers: jest.fn((members) => { state.partyMembers = members; }),
    addPartyMember: jest.fn((member) => { state.partyMembers.push(member); }),
    removePartyMember: jest.fn(),
    updatePartyMember: jest.fn(),
    clearPartyMembers: jest.fn(() => { state.partyMembers = []; }),
    setLeader: jest.fn()
  };
  const store = {
    getState: () => state,
    setState: (patch) => Object.assign(state, typeof patch === 'function' ? patch(state) : patch)
  };
  return { __esModule: true, default: store, __mockState: state };
});

jest.mock('../../store/presenceStore', () => {
  const state = {
    socket: null,
    currentParty: null,
    isInParty: false,
    partyMembers: [],
    currentUserPresence: null,
    setSocket: jest.fn((socket) => { state.socket = socket; }),
    cleanup: jest.fn()
  };
  const store = {
    getState: () => state,
    setState: (patch) => Object.assign(state, patch)
  };
  return { __esModule: true, default: store, __mockState: state };
});

jest.mock('../../store/gameStore', () => {
  const state = {
    isInMultiplayer: false,
    multiplayerSocket: null,
    multiplayerRoom: null,
    isGMMode: false,
    currentPlayer: null,
    setGMMode: jest.fn(),
    setMultiplayerState: jest.fn()
  };
  const store = {
    getState: () => state,
    setState: (patch) => Object.assign(state, typeof patch === 'function' ? patch(state) : patch)
  };
  return { __esModule: true, default: store, __mockState: state };
});

jest.mock('../../store/characterStore', () => {
  const state = {
    characters: [],
    getActiveCharacter: jest.fn(() => null),
    loadCharacters: jest.fn(async () => {}),
    loadCharacter: jest.fn(() => null),
    syncWithMultiplayer: jest.fn()
  };
  return {
    __esModule: true,
    default: { getState: () => state },
    __mockState: state
  };
});

jest.mock('../../store/levelEditorStore', () => {
  const state = {
    isEditorMode: false,
    dynamicFogEnabled: false,
    viewingFromToken: null,
    currentPlayerId: null,
    setCurrentPlayerId: jest.fn(),
    setEditorMode: jest.fn(),
    applyTierFeatureFlags: jest.fn(async () => {}),
    loadCompleteLevelEditorState: jest.fn(),
    clearAllFogAndMemories: jest.fn(),
    setViewingFromToken: jest.fn()
  };
  return {
    __esModule: true,
    default: { getState: () => state },
    __mockState: state
  };
});

jest.mock('../../store/travelStore', () => {
  const state = { initPlayerTravelListener: jest.fn() };
  return { __esModule: true, default: { getState: () => state }, __mockState: state };
});

jest.mock('../../store/characterTokenStore', () => {
  const state = { clearCharacterTokens: jest.fn(), addCharacterTokenFromServer: jest.fn() };
  return { __esModule: true, default: { getState: () => state }, __mockState: state };
});

jest.mock('../../store/creatureStore', () => {
  const state = { clearCreatureTokens: jest.fn(), loadToken: jest.fn(), creatures: [] };
  return { __esModule: true, default: { getState: () => state }, __mockState: state };
});

jest.mock('../../store/mapStore', () => ({
  __esModule: true,
  default: { getState: () => ({}), setState: jest.fn() }
}));

jest.mock('../../store/gridItemStore', () => {
  const state = { gridItems: [], loadGridItem: jest.fn() };
  return { __esModule: true, default: { getState: () => state }, __mockState: state };
});

jest.mock('../../store/inventoryStore', () => {
  const state = { clearInventory: jest.fn(), addItem: jest.fn(), updateCurrency: jest.fn() };
  return { __esModule: true, default: { getState: () => state }, __mockState: state };
});

jest.mock('../../store/chatStore', () => {
  const state = { setMultiplayerIntegration: jest.fn() };
  return {
    __esModule: true,
    default: { getState: () => state },
    setCombatSyncSocket: jest.fn(),
    __mockState: state
  };
});

jest.mock('../../store/dialogueStore', () => {
  const state = { setMultiplayerSocket: jest.fn() };
  return { __esModule: true, default: { getState: () => state }, __mockState: state };
});

jest.mock('../../services/gameStateManager', () => ({
  __esModule: true,
  default: {
    setMultiplayerActive: jest.fn(),
    initialize: jest.fn(() => Promise.resolve()),
    cleanup: jest.fn(() => Promise.resolve())
  }
}));

jest.mock('../../services/silentRoomHydration', () => ({
  applyRoomSnapshot: jest.fn()
}));

jest.mock('../../data/backgroundData', () => ({ getBackgroundData: jest.fn(() => null) }));
jest.mock('../../data/legacyDisciplineData', () => ({
  getCustomBackgroundData: jest.fn(() => null),
  getEnhancedPathData: jest.fn(() => null)
}));
jest.mock('../../utils/InfiniteGridSystem', () => ({ getGridSystem: jest.fn() }));

const FAMILY = 'campaign.collection';
const SCOPE_A = createUserScope('user-a');

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

const flush = async () => {
  for (let index = 0; index < 12; index += 1) await Promise.resolve();
};

function resetPhase() {
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
  resetBootstrapGateForTests();
  resetHandoffCoordinatorForTests();
  useAuthStore.setState({
    user: null,
    userData: null,
    isAuthenticated: false,
    isDevelopmentBypass: false,
    isAdminBypass: false,
    error: null
  });
  registerStore('gameStore', null);
  registerStore('partyStore', null);
  registerStore('targetingStore', null);
  registerStore('chatStore', null);
  registerStore('mapStore', null);
  registerStore('presenceStore', null);
}

describe('B1 — R2 generation fencing on every mutation path', () => {
  beforeEach(() => {
    resetPhase();
    activatePrivateScope(SCOPE_A);
  });

  it('B1-A no-lock fallback with omitted context refuses after same-UID relogin (no stale fork)', async () => {
    const restoreLocks = installFakeLocks(undefined);
    expect(isWebLocksAvailable()).toBe(false);

    const pending = writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE_A,
      payload: { stale: 'before-logout' }
    });

    // Same UID logs out and back in while the operation is still pending:
    // same scope, new account generation.
    clearToSignedOut();
    activatePrivateScope(SCOPE_A);

    const result = await pending;

    expect(result.status).toBe(COORDINATION_STATUS.CONTEXT_REFUSED);
    const leaked = Object.keys(localStorage).filter((key) => key.includes(FAMILY));
    expect(leaked).toEqual([]);
    restoreLocks();
  });

  it('B1-B account generation change inside a supported successor refuses before any write', async () => {
    const restoreLocks = installFakeLocks(serializingLockManager());

    const created = await writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE_A,
      payload: { v: 1 }
    });
    expect(created.status).toBe(COORDINATION_STATUS.OK);

    const mutated = await writeWithCoordination({
      familyId: FAMILY,
      scope: SCOPE_A,
      expectedRevision: 1,
      expectedDraftId: created.draftId,
      successor: (predecessor) => {
        // Same UID relogin happens inside the supported callback before the
        // final mutation is attempted.
        clearToSignedOut();
        activatePrivateScope(SCOPE_A);
        return bumpLocalRevision(predecessor, { stale: 'old-operation' });
      }
    });

    expect(mutated.status).toBe(COORDINATION_STATUS.CONTEXT_REFUSED);

    const current = readScopedRecord({ familyId: FAMILY, scope: SCOPE_A });
    expect(current.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(current.value.localRevision).toBe(1);
    expect(current.value.payload).toEqual({ v: 1 });
    restoreLocks();
  });
});

describe('B2 — R4 atomically safe fork allocation', () => {
  beforeEach(() => {
    resetPhase();
    activatePrivateScope(SCOPE_A);
  });

  it('B2-A interleaved competing allocations never overwrite a completed alternative', () => {
    const restoreLocks = installFakeLocks(undefined);

    let rival = null;
    let injecting = false;
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function patchedSetItem(key, value) {
      if (!injecting && !rival && key.includes('forcedbase')) {
        injecting = true;
        rival = forkScopedRecord({
          familyId: FAMILY,
          scope: SCOPE_A,
          payload: { n: 'rival' },
          draftIdFactory: () => 'forcedbase'
        });
        injecting = false;
      }
      return originalSetItem.call(this, key, value);
    };

    let first;
    try {
      first = forkScopedRecord({
        familyId: FAMILY,
        scope: SCOPE_A,
        payload: { n: 'first' },
        draftIdFactory: () => 'forcedbase'
      });
    } finally {
      Storage.prototype.setItem = originalSetItem;
    }

    expect(rival).not.toBeNull();
    expect(first.status).toBe(COORDINATION_STATUS.FORKED);
    expect(rival.status).toBe(COORDINATION_STATUS.FORKED);
    // Independent destinations: the interleave must not share a key.
    expect(first.key).not.toBe(rival.key);

    const firstRead = readScopedRecord({ familyId: FAMILY, scope: SCOPE_A, locator: [first.draftId] });
    const rivalRead = readScopedRecord({ familyId: FAMILY, scope: SCOPE_A, locator: [rival.draftId] });
    expect(firstRead.value.payload).toEqual({ n: 'first' });
    expect(rivalRead.value.payload).toEqual({ n: 'rival' });
    restoreLocks();
  });

  it('B2-B identical allocation identity refuses (FORK_COLLISION) and preserves the first alternative', () => {
    const restoreLocks = installFakeLocks(undefined);

    const first = forkScopedRecord({
      familyId: FAMILY,
      scope: SCOPE_A,
      payload: { n: 1 },
      draftIdFactory: () => 'fixedbase',
      allocationIdFactory: () => 'fixed-token'
    });
    expect(first.status).toBe(COORDINATION_STATUS.FORKED);

    const second = forkScopedRecord({
      familyId: FAMILY,
      scope: SCOPE_A,
      payload: { n: 2 },
      draftIdFactory: () => 'fixedbase',
      allocationIdFactory: () => 'fixed-token'
    });
    expect(second.status).toBe(COORDINATION_STATUS.FORK_COLLISION);

    const survivor = readScopedRecord({ familyId: FAMILY, scope: SCOPE_A, locator: [first.draftId] });
    expect(survivor.value.payload).toEqual({ n: 1 });
    restoreLocks();
  });
});

describe('B3 — R6 source-only record cannot forge a recovery receipt', () => {
  beforeEach(() => {
    resetPhase();
    activatePrivateScope(SCOPE_A);
  });

  it('B3-A aliased copyKey is refused; the genuine verified copy still completes', () => {
    localStorage.setItem('legacy-source', '{"v":1}');

    const aliased = {
      ok: true,
      kind: RECEIPT_VERIFICATION_KINDS.RAW_COPY,
      sourceKey: 'legacy-source',
      sourceFamilyId: FAMILY,
      copyKey: 'legacy-source',
      fingerprint: fingerprintRawString('{"v":1}')
    };
    const forgedCompletion = completeRawCopyPreservation({
      preservation: aliased,
      destinationScope: SCOPE_A
    });
    expect(forgedCompletion.ok).toBe(false);
    expect(String(forgedCompletion.reason)).toMatch(/copy-key|alias/);

    const forgedReceipt = {
      kind: 'p5-recovery-receipt',
      schemaVersion: 1,
      receiptId: 'forged',
      verificationKind: RECEIPT_VERIFICATION_KINDS.RAW_COPY,
      status: 'completed',
      sourceKey: 'legacy-source',
      sourceFamilyId: FAMILY,
      sourceFingerprint: fingerprintRawString('{"v":1}').value,
      sourceFingerprintAlgorithm: 'fnv1a-32-hex',
      destinationScopeKind: 'user',
      destinationScopeId: 'user-a',
      copyKey: 'legacy-source',
      operationKind: 'legacy-copy',
      createdAt: new Date().toISOString()
    };
    expect(verifyReceiptEvidence({ receipt: forgedReceipt }).valid).toBe(false);

    // Genuine path: a real quarantine copy completes and verifies.
    const real = preserveSourceCopy({ sourceKey: 'legacy-source', sourceFamilyId: FAMILY, scope: SCOPE_A });
    expect(real.ok).toBe(true);
    expect(real.copyKey).not.toBe('legacy-source');
    const realCompletion = completeRawCopyPreservation({
      preservation: real,
      destinationScope: SCOPE_A,
      sourceFamilyId: FAMILY
    });
    expect(realCompletion.ok).toBe(true);
    expect(verifyRecoveryReceiptForSource({
      receipt: realCompletion.receipt,
      sourceKey: 'legacy-source',
      sourceFamilyId: FAMILY
    }).valid).toBe(true);
    expect(verifyReceiptEvidence({ receipt: realCompletion.receipt }).valid).toBe(true);
    expect(localStorage.getItem('legacy-source')).toBe('{"v":1}');
  });
});

describe('B4 — R7 handoff isolation of private projections and UI', () => {
  beforeEach(() => {
    resetPhase();
  });

  afterEach(() => cleanup());

  it('B4-A a returned reset refusal is a handoff failure and blocks destination activation', () => {
    registerDefaultHandoffParticipants();
    const refusing = create(() => ({
      value: 'A-private',
      resetStore: () => ({ reset: false, reason: 'projection-not-ready' })
    }));
    registerStore('partyStore', refusing);

    const handoff = coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });

    expect(handoff.result.blocked).toBe(true);
    expect(handoff.result.projectionClean).toBe(false);
    expect(handoff.result.failures.some((failure) => failure.participantId === 'runtime-projection-reset')).toBe(true);
    expect(handoff.gate.phase).toBe('loading');
    expect(handoff.gate.scope).toBeNull();
    expect(handoff.gate.holdReason).toBeTruthy();
    expect(refusing.getState().value).toBe('A-private');
  });

  it('B4-B contained async reset stays unsuspended-of-persistence until settlement and never overwrites the durable draft', async () => {
    let releaseReset;
    const resetGate = new Promise((resolve) => { releaseReset = resolve; });
    const memory = {};
    const writes = [];
    const storage = {
      getItem: (key) => (key in memory ? memory[key] : null),
      setItem: (key, value) => { memory[key] = value; writes.push(value); },
      removeItem: (key) => { delete memory[key]; }
    };
    const usePersisted = create(persist((set) => ({
      value: 'A-draft',
      resetStore: async () => {
        await resetGate;
        set({ value: null });
      }
    }), { name: 'A-draft', storage }));
    usePersisted.setState({ value: 'A-draft' });
    writes.length = 0;

    const resultPromise = resetStoreWithoutPersist(usePersisted);
    expect(typeof resultPromise.then).toBe('function');

    releaseReset();
    const result = await resultPromise;
    await flush();

    expect(result.reset).toBe(true);
    expect(result.persistenceSuspended).toBe(true);
    expect(usePersisted.getState().value).toBeNull();
    // The durable draft was never overwritten by the late async continuation.
    expect(memory['A-draft'].state.value).toBe('A-draft');
    expect(writes).toEqual([]);
    expect(usePersisted.persist.getOptions().storage).toBe(storage);
  });

  it('B4-C the private UI boundary hides projections while the handoff is blocked', () => {
    const PrivateProjectionBoundary = require('../PrivateProjectionBoundary').default;
    registerDefaultHandoffParticipants();

    // Destination A activates cleanly first; the failure happens on A→B.
    coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    expect(getBootstrapGateState().phase).toBe('active');

    const failing = create(() => ({
      value: 'A-private',
      resetStore: () => { throw new Error('reset exploded'); }
    }));
    registerStore('partyStore', failing);

    render(React.createElement(
      PrivateProjectionBoundary,
      { fallback: React.createElement('div', { 'data-testid': 'isolation' }, 'isolated') },
      React.createElement('div', { 'data-testid': 'private' }, 'A private')
    ));
    expect(require('@testing-library/react').screen.getByTestId('private')).toBeTruthy();

    act(() => {
      coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    });

    const { screen } = require('@testing-library/react');
    expect(screen.queryByTestId('private')).toBeNull();
    expect(screen.getByTestId('isolation')).toBeTruthy();
    expect(failing.getState().value).toBe('A-private');
  });

  it('B4-A async persisted reset refusal blocks the handoff and preserves the durable draft', async () => {
    registerDefaultHandoffParticipants();
    let releaseReset;
    const resetGate = new Promise((resolve) => { releaseReset = resolve; });
    const memory = {};
    const storage = {
      getItem: (key) => (key in memory ? memory[key] : null),
      setItem: (key, value) => { memory[key] = value; },
      removeItem: (key) => { delete memory[key]; }
    };
    const usePersisted = create(persist((set) => ({
      value: 'A-draft',
      resetStore: async () => {
        await resetGate;
        return { reset: false, reason: 'projection-not-ready' };
      }
    }), { name: 'A-draft', storage }));
    usePersisted.setState({ value: 'A-draft' });
    registerStore('partyStore', usePersisted);

    const outcome = coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    expect(outcome.deferred).toBe(true);

    releaseReset();
    await whenHandoffIdle();

    const status = getHandoffStatus();
    expect(status.lastResult.blocked).toBe(true);
    expect(status.lastResult.projectionClean).toBe(false);
    expect(status.lastResult.failures.some(
      (failure) => failure.participantId === 'runtime-projection-reset'
    )).toBe(true);
    expect(status.phase).toBe('loading');
    expect(status.activeScope).toBeNull();
    expect(status.holdReason).toBeTruthy();

    // A's durable draft is untouched and the real persistence engine is back.
    expect(memory['A-draft'].state.value).toBe('A-draft');
    expect(usePersisted.persist.getOptions().storage).toBe(storage);
  });

  it('B4-B async nonpersisted reset refusal is propagated as a handoff failure', async () => {
    registerDefaultHandoffParticipants();
    let releaseReset;
    const resetGate = new Promise((resolve) => { releaseReset = resolve; });
    const projection = create(() => ({
      value: 'A-private',
      resetStore: async () => {
        await resetGate;
        return { reset: false, reason: 'projection-not-ready' };
      }
    }));
    registerStore('partyStore', projection);

    const outcome = coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    expect(outcome.deferred).toBe(true);

    releaseReset();
    await whenHandoffIdle();

    const status = getHandoffStatus();
    expect(status.lastResult.blocked).toBe(true);
    expect(status.lastResult.projectionClean).toBe(false);
    expect(status.lastResult.failures.some(
      (failure) => failure.participantId === 'runtime-projection-reset'
    )).toBe(true);
    expect(status.phase).toBe('loading');
    expect(status.activeScope).toBeNull();
    expect(status.holdReason).toBeTruthy();
    expect(projection.getState().value).toBe('A-private');
  });
});

describe('B5 — R8 auth/socket/admission lifetime fencing', () => {
  beforeEach(() => {
    resetPhase();
  });

  it('B5-A provider-delivered real user supersedes a pending guest sign-in result', async () => {
    let resolveGuest;
    authService.signInAsAnonymous.mockImplementationOnce(
      () => new Promise((resolve) => { resolveGuest = resolve; })
    );
    sessionStorage.setItem('pendingGMSessionInvitation', '{"invitationId":"i1"}');

    const guestPromise = useAuthStore.getState().signInAsGuest();

    // The real auth provider delivers a different principal mid-flight.
    useAuthStore.getState().setUser({ uid: 'real-B', isAnonymous: false });
    await flush();

    resolveGuest({ success: true, user: { uid: 'anon-late' } });
    const guestResult = await guestPromise;

    expect(guestResult.superseded).toBe(true);
    expect(useAuthStore.getState().user?.uid).toBe('real-B');
    expect(localStorage.getItem('mythrill-guest-user')).toBeNull();
    expect(localStorage.getItem('mythrill-guest-user-data')).toBeNull();
    expect(sessionStorage.getItem('pendingGMSessionInvitation')).toBe('{"invitationId":"i1"}');
  });

  it('B5-B disposed initial socket setup never connects after same-UID logout/relogin', async () => {
    const { io } = require('socket.io-client');
    io.mockReset();
    let resolveToken;
    const userA = {
      uid: 'user-a',
      getIdToken: () => new Promise((resolve) => { resolveToken = resolve; })
    };
    useAuthStore.getState().setUser(userA);
    await flush();

    const cleanupSetup = setupSocketConnection({
      SOCKET_URL: 'https://unused.invalid',
      setSocket: jest.fn(),
      setIsConnecting: jest.fn(),
      setIsJoiningRoom: jest.fn(),
      setConnectionStatus: jest.fn(),
      currentRoomRef: { current: null },
      currentPlayerRef: { current: null },
      roomPasswordRef: { current: null },
      addNotificationRef: { current: jest.fn() }
    });

    // Component disposal while the initial token await is still pending.
    cleanupSetup();

    // Same UID logs out and back in: principal string matches again.
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setUser(userA);
    await flush();

    resolveToken('old-token');
    await flush();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(io).not.toHaveBeenCalled();
  });

  it('B5-C an already-entered admission cannot install A presence/snapshot/room under B', async () => {
    const hydrationMock = require('../../services/silentRoomHydration');
    const partyMock = require('../../store/partyStore');
    const presenceMock = require('../../store/presenceStore');

    registerHandoffParticipantsForPhase();

    useAuthStore.getState().setUser({ uid: 'user-a' });
    await flush();
    expect(getBootstrapGateState().scope?.scopeId).toBe('user-a');

    const socket = {
      id: 'A-socket',
      connected: true,
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      removeAllListeners: jest.fn(),
      disconnect: jest.fn()
    };
    let releaseCharacterLoad;
    const characterLoad = new Promise((resolve) => { releaseCharacterLoad = resolve; });

    const setCurrentRoom = jest.fn();
    const ctx = {
      socket,
      setConnectionStatus: jest.fn(),
      setIsJoiningRoom: jest.fn(),
      setError: jest.fn(),
      setActualPlayerCount: jest.fn(),
      setConnectedPlayers: jest.fn(),
      setIsGM: jest.fn(),
      setPlayerCurrentMapId: jest.fn(),
      setCurrentPlayer: jest.fn(),
      setCurrentRoom,
      setSocket: jest.fn(),
      currentPlayerRef: { current: null },
      addNotificationRef: { current: jest.fn() },
      roomPasswordRef: { current: null },
      startJoiningRoom: jest.fn(),
      getActiveCharacter: jest.fn(() => null),
      clearAllMultiplayerStores: jest.fn(),
      clearCreatureTokens: jest.fn(),
      clearCharacterTokens: jest.fn(),
      addCreature: jest.fn(),
      addToken: jest.fn(),
      addPartyMember: jest.fn(),
      addUser: jest.fn(),
      addNotification: jest.fn(),
      loadActiveCharacter: jest.fn(() => characterLoad),
      startCharacterSession: jest.fn(),
      setRoomName: jest.fn(),
      updateCharacterInfo: jest.fn()
    };

    const roomA = {
      id: 'A-room',
      name: 'A private room',
      gm: { id: 'gm-a', name: 'GM A' },
      players: [],
      gameState: { maps: {} }
    };

    const pendingJoin = handleJoinRoom(
      roomA,
      socket,
      true,
      { id: 'player-a', name: 'Player A' },
      '',
      null,
      null,
      true,
      ctx
    );

    // A is retired and B becomes active while the character load is pending.
    markSocketRetired(socket);
    useAuthStore.getState().setUser({ uid: 'user-b' });
    releaseCharacterLoad(null);

    await pendingJoin;
    await flush();

    expect(hydrationMock.applyRoomSnapshot).not.toHaveBeenCalled();
    expect(setCurrentRoom).not.toHaveBeenCalled();
    expect(presenceMock.__mockState.socket).not.toBe(socket);
    expect(partyMock.__mockState.partyMembers.some((member) => member.id === 'player-a')).toBe(false);
  });

  it('B5-A a delayed character session cannot install A room context after handoff', async () => {
    const hydrationMock = require('../../services/silentRoomHydration');
    const partyMock = require('../../store/partyStore');
    const presenceMock = require('../../store/presenceStore');

    registerHandoffParticipantsForPhase();

    useAuthStore.getState().setUser({ uid: 'user-a' });
    await flush();
    expect(getBootstrapGateState().scope?.scopeId).toBe('user-a');

    const socket = {
      id: 'A-socket',
      connected: true,
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      removeAllListeners: jest.fn(),
      disconnect: jest.fn()
    };
    let releaseSession;
    const sessionWait = new Promise((resolve) => { releaseSession = resolve; });
    const setRoomName = jest.fn();
    const setCurrentRoom = jest.fn();
    const ctx = {
      socket,
      setConnectionStatus: jest.fn(),
      setIsJoiningRoom: jest.fn(),
      setError: jest.fn(),
      setActualPlayerCount: jest.fn(),
      setConnectedPlayers: jest.fn(),
      setIsGM: jest.fn(),
      setPlayerCurrentMapId: jest.fn(),
      setCurrentPlayer: jest.fn(),
      setCurrentRoom,
      setSocket: jest.fn(),
      currentPlayerRef: { current: null },
      addNotificationRef: { current: jest.fn() },
      roomPasswordRef: { current: null },
      startJoiningRoom: jest.fn(),
      getActiveCharacter: jest.fn(() => ({ id: 'character-a', name: 'A Character' })),
      clearAllMultiplayerStores: jest.fn(),
      clearCreatureTokens: jest.fn(),
      clearCharacterTokens: jest.fn(),
      addCreature: jest.fn(),
      addToken: jest.fn(),
      addPartyMember: jest.fn(),
      addUser: jest.fn(),
      addNotification: jest.fn(),
      loadActiveCharacter: jest.fn(),
      startCharacterSession: jest.fn(() => sessionWait),
      setRoomName,
      updateCharacterInfo: jest.fn()
    };

    const roomA = {
      id: 'A-room',
      name: 'A-room',
      gm: { id: 'gm-a', name: 'GM A' },
      players: [],
      gameState: { maps: {} }
    };

    const pendingJoin = handleJoinRoom(
      roomA,
      socket,
      true,
      { id: 'player-a', name: 'Player A' },
      '',
      null,
      null,
      true,
      ctx
    );

    // The actual character-session await is pending: retire A and activate B.
    markSocketRetired(socket);
    useAuthStore.getState().setUser({ uid: 'user-b' });
    releaseSession('session-a');

    await pendingJoin;
    await flush();

    expect(setRoomName).not.toHaveBeenCalled();
    expect(hydrationMock.applyRoomSnapshot).not.toHaveBeenCalled();
    expect(setCurrentRoom).not.toHaveBeenCalled();
    expect(presenceMock.__mockState.socket).not.toBe(socket);
    expect(partyMock.__mockState.partyMembers.some((member) => member.id === 'player-a')).toBe(false);
  });

  function registerHandoffParticipantsForPhase() {
    registerDefaultHandoffParticipants();
  }
});
