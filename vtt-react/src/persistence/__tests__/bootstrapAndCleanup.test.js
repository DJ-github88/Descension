import { createUserScope, guestScope } from '../scopeModel';
import { createDraftEnvelope } from '../draftEnvelope';
import { writeScopedRecord, WRITE_STATUS } from '../safeWrite';
import { readScopedRecordForHydration, READ_STATUS, HYDRATION_STATUS } from '../safeRead';
import {
  getBootstrapGateState,
  canHydratePrivateScopedData,
  activatePrivateScope,
  resetBootstrapGateForTests
} from '../bootstrapPrivacyGate';
import { installAuthBootstrapGate, syncBootstrapGateWithAuthState } from '../authBootstrapGateBinding';
import { isGlobalAllowlistedKey } from '../globalAllowlist';
import {
  getCleanupEligibilityForFamily,
  evaluateCleanupEligibilityForKey,
  canGenericCleanupDeleteKey,
  listGenericCleanupEligibleFamilies,
  listProtectedFamilies
} from '../cleanupPolicy';

function createFakeStore(initialState) {
  let state = { ...initialState };
  const subscribers = new Set();
  return {
    getState: () => state,
    setState: (patch) => {
      state = { ...state, ...patch };
      subscribers.forEach((listener) => listener(state));
    },
    subscribe: (listener) => {
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    }
  };
}

describe('P5 Slice 1 — cleanup classification', () => {
  it('S1-10 authored/recovery/quarantine data is never generic-cleanup eligible', () => {
    expect(getCleanupEligibilityForFamily('campaign.collection')).toMatchObject({
      recognized: true,
      eligible: false
    });
    expect(getCleanupEligibilityForFamily('character.backups').eligible).toBe(false);
    expect(getCleanupEligibilityForFamily('legacy.compatKeys').eligible).toBe(false);
    expect(getCleanupEligibilityForFamily('core.inventory').eligible).toBe(false);

    expect(evaluateCleanupEligibilityForKey('mythrill-campaigns').eligible).toBe(false);
    expect(evaluateCleanupEligibilityForKey('mythrill-backup-char-1-123').eligible).toBe(false);
    expect(evaluateCleanupEligibilityForKey('mythrill_local_room_state_room_1').eligible).toBe(false);

    // Public allowlisted caches and session-only state are eligible.
    expect(evaluateCleanupEligibilityForKey('creature-library-version')).toMatchObject({
      recognized: true,
      eligible: true
    });
    expect(canGenericCleanupDeleteKey('selectedRoomPassword')).toBe(true);

    // Unregistered keys fail closed.
    expect(evaluateCleanupEligibilityForKey('some-unknown-key')).toMatchObject({
      recognized: false,
      eligible: false
    });
    expect(canGenericCleanupDeleteKey('some-unknown-key')).toBe(false);

    const eligibleFamilies = listGenericCleanupEligibleFamilies().map((entry) => entry.familyId);
    expect(eligibleFamilies).toContain('session.selectedRoomPassword');
    expect(eligibleFamilies).not.toContain('campaign.collection');

    const protectedFamilies = listProtectedFamilies().map((entry) => entry.familyId);
    expect(protectedFamilies).toContain('campaign.collection');
    expect(protectedFamilies).toContain('map.subregionCache');
  });
});

describe('P5 Slice 1 — bootstrap privacy gate', () => {
  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
  });

  it('S1-12 before private scope activation, scoped data cannot hydrate; public defaults still initialize', () => {
    const userA = createUserScope('user-a');

    // Gate starts in boot with no active private scope.
    expect(getBootstrapGateState().phase).toBe('boot');
    expect(canHydratePrivateScopedData(userA)).toBe(false);

    const blocked = readScopedRecordForHydration({ familyId: 'campaign.collection', scope: userA });
    expect(blocked.status).toBe(HYDRATION_STATUS.HYDRATION_BLOCKED);

    // A scoped write is refused while the gate is closed.
    const refusedWrite = writeScopedRecord({
      familyId: 'campaign.collection',
      scope: userA,
      value: createDraftEnvelope({ scope: userA, draftId: 'draft_1', payload: { campaigns: [] } })
    });
    expect(refusedWrite.status).toBe(WRITE_STATUS.CONTEXT_REFUSED);

    // Public/bundled defaults are untouched by the gate.
    localStorage.setItem('creature-library-version', '7');
    expect(localStorage.getItem('creature-library-version')).toBe('7');
    expect(isGlobalAllowlistedKey('creature-library-version')).toBe(true);

    // After activation the same scoped data path is allowed.
    activatePrivateScope(userA);
    expect(canHydratePrivateScopedData(userA)).toBe(true);
    expect(canHydratePrivateScopedData(createUserScope('user-b'))).toBe(false);

    const acceptedWrite = writeScopedRecord({
      familyId: 'campaign.collection',
      scope: userA,
      value: createDraftEnvelope({
        scope: userA,
        draftId: 'draft_1',
        payload: { campaigns: [{ id: 'c1' }] }
      })
    });
    expect(acceptedWrite.status).toBe(WRITE_STATUS.OK);

    const hydrated = readScopedRecordForHydration({ familyId: 'campaign.collection', scope: userA });
    expect(hydrated.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(hydrated.value.payload).toEqual({ campaigns: [{ id: 'c1' }] });
  });

  it('S1-12b auth binding drives gate scope and generation across handoff', () => {
    const store = createFakeStore({
      user: { uid: 'user-a' },
      isDevelopmentBypass: false,
      isAdminBypass: false
    });
    const uninstall = installAuthBootstrapGate(store);

    const first = getBootstrapGateState();
    expect(first.phase).toBe('active');
    expect(first.scope).toEqual({ scopeKind: 'user', scopeId: 'user-a' });
    const generationA = first.accountGeneration;

    // Same principal noise (loading flags etc.) keeps the generation stable.
    store.setState({ isLoading: true });
    expect(getBootstrapGateState().accountGeneration).toBe(generationA);

    // Different principal advances the generation.
    store.setState({ user: { uid: 'user-b' } });
    const second = getBootstrapGateState();
    expect(second.scope).toEqual({ scopeKind: 'user', scopeId: 'user-b' });
    expect(second.accountGeneration).toBe(generationA + 1);

    // Sign-out clears scope and advances generation.
    store.setState({ user: null });
    const signedOut = getBootstrapGateState();
    expect(signedOut.phase).toBe('signed-out');
    expect(signedOut.scope).toBeNull();
    expect(signedOut.accountGeneration).toBe(second.accountGeneration + 1);

    // Re-login as the same UID is a NEW operation context generation.
    store.setState({ user: { uid: 'user-b' } });
    expect(getBootstrapGateState().accountGeneration).toBe(second.accountGeneration + 2);

    // Anonymous/guest principals map to the stable guest scope.
    store.setState({ user: { uid: 'anon-42', isAnonymous: true } });
    expect(getBootstrapGateState().scope).toEqual(guestScope());

    // Direct sync helper behaves the same.
    syncBootstrapGateWithAuthState({ user: null });
    expect(getBootstrapGateState().phase).toBe('signed-out');

    uninstall();
  });
});
