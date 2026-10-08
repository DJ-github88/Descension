import {
  coordinateAuthPrincipalChange,
  registerHandoffParticipant,
  resetHandoffCoordinatorForTests,
  registerDefaultHandoffParticipants,
  listHandoffParticipants
} from '../handoff/accountHandoffCoordinator';
import {
  resetBootstrapGateForTests,
  getBootstrapGateContext,
  getBootstrapGateState,
  canHydratePrivateScopedData
} from '../bootstrapPrivacyGate';
import { captureAccountContext, assertSameOperationContext, isSameOperationContext } from '../accountContext';
import { createUserScope } from '../scopeModel';
import { resetStoreWithoutPersist } from '../handoff/runtimeResetParticipant';
import { resetStorageInvalidationForTests } from '../storageInvalidation';

describe('Wave A S4 — account handoff coordinator', () => {
  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
    resetHandoffCoordinatorForTests();
    resetStorageInvalidationForTests();
  });

  afterEach(() => {
    resetHandoffCoordinatorForTests();
  });

  it('WA-12 same UID logout→login advances generation; old callback is refused', () => {
    const first = coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    expect(first.changed).toBe(true);
    expect(first.gate.scope).toEqual({ scopeKind: 'user', scopeId: 'user-a' });
    const capturedA = captureAccountContext(getBootstrapGateContext());
    const generationA = first.gate.accountGeneration;

    const signedOut = coordinateAuthPrincipalChange({ user: null });
    expect(signedOut.gate.phase).toBe('signed-out');
    expect(signedOut.gate.accountGeneration).toBe(generationA + 1);

    const second = coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    expect(second.gate.accountGeneration).toBe(generationA + 2);

    const live = getBootstrapGateContext();
    expect(isSameOperationContext(capturedA, live)).toBe(false);
    expect(assertSameOperationContext(capturedA, live)).toEqual({
      ok: false,
      reason: 'context-generation-or-scope-changed'
    });
  });

  it('WA-13 A→B handoff: default participants run; old A context cannot match B state', () => {
    registerDefaultHandoffParticipants();
    expect(listHandoffParticipants()).toEqual(
      expect.arrayContaining(['runtime-projection-reset', 'socket-principal-retirement'])
    );

    coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    const capturedA = captureAccountContext(getBootstrapGateContext());

    const handoff = coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    expect(handoff.changed).toBe(true);
    expect(handoff.gate.scope).toEqual({ scopeKind: 'user', scopeId: 'user-b' });
    expect(handoff.gate.accountGeneration).toBe(capturedA.accountGeneration + 1);
    expect(handoff.result.failures).toEqual([]);
    expect(handoff.result.projectionClean).toBe(true);

    const liveB = handoff.result.nextContext;
    expect(isSameOperationContext(capturedA, liveB)).toBe(false);

    // Same principal again is a no-op: no generation churn, no participant hook.
    const repeat = coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    expect(repeat.changed).toBe(false);
    expect(repeat.gate.accountGeneration).toBe(handoff.gate.accountGeneration);
  });

  it('WA-14 failing participant is surfaced and the handoff FAILS CLOSED (no B activation)', () => {
    let retireCalls = 0;
    registerHandoffParticipant({
      id: 'failing-participant',
      retire: () => {
        retireCalls += 1;
        throw new Error('retire exploded');
      },
      resetProjection: () => ({ ok: true })
    });

    const first = coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    expect(retireCalls).toBe(1);
    expect(first.result.blocked).toBe(true);
    expect(first.gate.phase).toBe('loading');
    expect(first.gate.scope).toBeNull();

    const handoff = coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    expect(retireCalls).toBe(2);
    expect(handoff.result.failures).toEqual([
      { participantId: 'failing-participant', hook: 'retire', error: 'retire exploded' }
    ]);
    expect(handoff.result.projectionClean).toBe(false);
    expect(handoff.result.blocked).toBe(true);
    // Fail closed: no private scope is active while the required retirement
    // fails; B private work cannot hydrate and A is not exposed as B.
    expect(handoff.gate.phase).toBe('loading');
    expect(handoff.gate.scope).toBeNull();
    expect(canHydratePrivateScopedData(createUserScope('user-b'))).toBe(false);
    expect(canHydratePrivateScopedData(createUserScope('user-a'))).toBe(false);
  });

  it('WA-15 already-dispatched A work: A context cannot mutate B after handoff', () => {
    coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    const capturedA = captureAccountContext(getBootstrapGateContext());

    coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    const liveB = getBootstrapGateContext();

    // A completion callback must revalidate and drop.
    expect(assertSameOperationContext(capturedA, liveB).ok).toBe(false);

    // No B-scope storage is touched by the refusal itself.
    const bKeys = Object.keys(localStorage).filter((key) => key.includes('user-b'));
    expect(bKeys).toEqual([]);
  });

  it('WA-23 runtime reset suspends persistence; no empty/default write to the durable draft', () => {
    const writes = [];
    const durableStorage = {
      getItem: () => null,
      setItem: (key, value) => writes.push({ key, value }),
      removeItem: () => {}
    };
    let currentStorage = durableStorage;

    const store = {
      dirty: true,
      resetStore: () => {
        store.dirty = false;
      },
      getState: () => store,
      persist: {
        getOptions: () => ({ storage: currentStorage }),
        setOptions: (options) => {
          currentStorage = options.storage;
        }
      }
    };

    const result = resetStoreWithoutPersist(store);

    expect(result.reset).toBe(true);
    expect(result.persistenceSuspended).toBe(true);
    expect(store.dirty).toBe(false);
    expect(writes).toEqual([]);
    expect(currentStorage).toBe(durableStorage);

    // Corrected R7: a nonpersisted store with a synchronous reset IS reset
    // directly; it cannot corrupt a durable draft.
    const plainStore = {
      value: 'A',
      getState: () => plainStore,
      resetStore: () => { plainStore.value = null; }
    };
    const plain = resetStoreWithoutPersist(plainStore);
    expect(plain).toEqual({ reset: true, persistenceSuspended: false });
    expect(plainStore.value).toBeNull();

    // A store with no reset contract at all remains a surfaced failure.
    const noApiStore = { getState: () => ({}) };
    const noApi = resetStoreWithoutPersist(noApiStore);
    expect(noApi.reset).toBe(false);
    expect(noApi.reason).toBe('no-reset-api');
  });

  it('WA-12b unauthenticated→guest handoff uses the stable guest scope', () => {
    const guestOne = coordinateAuthPrincipalChange({ user: { uid: 'anon-X', isAnonymous: true } });
    expect(guestOne.gate.scope).toEqual({ scopeKind: 'guest', scopeId: 'local-guest' });

    const stillGuest = coordinateAuthPrincipalChange({ user: { uid: 'anon-Y', isAnonymous: true } });
    expect(stillGuest.changed).toBe(false);
    expect(stillGuest.gate.scope).toEqual({ scopeKind: 'guest', scopeId: 'local-guest' });
    expect(stillGuest.gate.accountGeneration).toBe(guestOne.gate.accountGeneration);
  });

  it('gate phase transitions during handoff never expose the old scope as active', () => {
    coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    const gateBefore = getBootstrapGateState();
    expect(gateBefore.phase).toBe('active');

    // Simulate the interior of a handoff: retiring phase blocks hydration.
    const retiring = require('../bootstrapPrivacyGate').retirePrivateScope();
    expect(retiring.phase).toBe('retiring');
    expect(retiring.scope).toEqual({ scopeKind: 'user', scopeId: 'user-a' });
    const { canHydratePrivateScopedData } = require('../bootstrapPrivacyGate');
    expect(canHydratePrivateScopedData(createUserScope('user-a'))).toBe(false);
    expect(canHydratePrivateScopedData(createUserScope('user-b'))).toBe(false);
  });

  it('async stopNewWork hook defers completion until settled and then activates destination', async () => {
    let resolved = false;
    registerHandoffParticipant({
      id: 'async-stop-participant',
      stopNewWork: () => new Promise((resolve) => {
        setTimeout(() => {
          resolved = true;
          resolve({ ok: true });
        }, 10);
      }),
      retire: () => ({ ok: true }),
      resetProjection: () => ({ ok: true })
    });

    const handoff = coordinateAuthPrincipalChange({ user: { uid: 'user-async' } });
    expect(handoff.deferred).toBe(true);
    expect(handoff.completion).toBeInstanceOf(Promise);

    await handoff.completion;
    expect(resolved).toBe(true);
    expect(getBootstrapGateState().phase).toBe('active');
    expect(getBootstrapGateState().scope).toEqual({ scopeKind: 'user', scopeId: 'user-async' });
  });

  it('async retire hook defers completion until settled and then activates destination', async () => {
    let retired = false;
    registerHandoffParticipant({
      id: 'async-retire-participant',
      stopNewWork: () => ({ ok: true }),
      retire: () => new Promise((resolve) => {
        setTimeout(() => {
          retired = true;
          resolve({ ok: true });
        }, 10);
      }),
      resetProjection: () => ({ ok: true })
    });

    const handoff = coordinateAuthPrincipalChange({ user: { uid: 'user-async-retire' } });
    expect(handoff.deferred).toBe(true);
    expect(handoff.completion).toBeInstanceOf(Promise);

    await handoff.completion;
    expect(retired).toBe(true);
    expect(getBootstrapGateState().phase).toBe('active');
    expect(getBootstrapGateState().scope).toEqual({ scopeKind: 'user', scopeId: 'user-async-retire' });
  });
});

