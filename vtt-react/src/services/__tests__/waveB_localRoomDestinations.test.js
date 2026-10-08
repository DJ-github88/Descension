/**
 * Project 5 Wave B (S5.2) — local-room scoped storage and captured destinations.
 */

import localRoomService, {
  resetLocalRoomServiceForTests,
  forceSaveCurrentRoom
} from '../localRoomService';
import roomStateService from '../roomStateService';
import {
  activatePrivateScope,
  clearToSignedOut,
  resetBootstrapGateForTests
} from '../../persistence/bootstrapPrivacyGate';
import { createUserScope } from '../../persistence/scopeModel';
import { readScopedRecord, READ_STATUS } from '../../persistence/safeRead';
import { findQuarantineReceipt } from '../../persistence/scopedConsumer';
import { fingerprintRawString } from '../../persistence/preservation';

jest.mock('../../config/firebase', () => ({
  db: null,
  isFirebaseConfigured: false,
  auth: { currentUser: null }
}));

jest.mock('../roomStateService', () => ({
  __esModule: true,
  default: {
    generateRoomId: jest.fn(() => `room_test_${Math.random().toString(36).slice(2, 8)}`),
    collectRoomState: jest.fn(async () => ({ marker: 'collected' })),
    collectPlayerState: jest.fn(async () => ({})),
    applyPlayerState: jest.fn()
  }
}));

jest.mock('../../store/gameStore', () => ({ __esModule: true, default: { getState: () => ({}) } }));
jest.mock('../../store/creatureStore', () => ({ __esModule: true, default: { getState: () => ({ tokens: [] }) } }));
jest.mock('../../store/gridItemStore', () => ({ __esModule: true, default: { getState: () => ({ gridItems: [] }) } }));
jest.mock('../../store/levelEditorStore', () => ({ __esModule: true, default: { getState: () => ({}) } }));
jest.mock('../../store/characterStore', () => ({
  __esModule: true,
  default: { getState: () => ({ activeCharacter: null }) }
}));

const A = createUserScope('user-a');
const STATE_FAMILY = 'localRoom.statePrimary';

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

describe('Wave B S5.2 — local room destinations', () => {
  let restoreLocks;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetBootstrapGateForTests();
    resetLocalRoomServiceForTests();
    jest.clearAllMocks();
    // CRA's jest config resets mock implementations between tests.
    roomStateService.generateRoomId.mockImplementation(
      () => `room_test_${Math.random().toString(36).slice(2, 8)}`
    );
    roomStateService.collectRoomState.mockResolvedValue({ marker: 'collected' });
    roomStateService.collectPlayerState.mockResolvedValue({});
    restoreLocks = installFakeLocks(serializingLockManager());
    activatePrivateScope(A);
  });

  afterEach(() => {
    restoreLocks();
    resetLocalRoomServiceForTests();
  });

  it('legacy global rooms are quarantined, never adopted', () => {
    const legacyRaw = JSON.stringify([{ id: 'room_legacy', name: 'Legacy Room' }]);
    localStorage.setItem('mythrill_local_rooms', legacyRaw);

    localRoomService.loadRooms();

    expect(localRoomService.getLocalRooms()).toEqual([]);
    expect(localStorage.getItem('mythrill_local_rooms')).toBe(legacyRaw);

    const fingerprint = fingerprintRawString(legacyRaw).value;
    const receipt = findQuarantineReceipt({
      scope: A,
      sourceKey: 'mythrill_local_rooms',
      fingerprintValue: fingerprint
    });
    expect(receipt).not.toBeNull();
  });

  it('a room switch during collection supersedes the save: Room Y state never lands in Room X', async () => {
    const roomX = localRoomService.createLocalRoom({ name: 'Room X' });
    await localRoomService.flushPersistence();

    localStorage.setItem('selectedLocalRoomId', roomX.id);
    localStorage.setItem('isLocalRoom', 'true');

    const before = readScopedRecord({ familyId: STATE_FAMILY, scope: A, locator: [roomX.id] });
    expect(before.status).toBe(READ_STATUS.PRESENT_VALID);
    const beforeRaw = before.raw;

    let release;
    roomStateService.collectRoomState.mockImplementationOnce(
      () => new Promise((resolve) => { release = resolve; })
    );

    const pendingSave = localRoomService.autoSaveCurrentRoom();

    // The user switches to Room Y while collection is in flight.
    localStorage.setItem('selectedLocalRoomId', 'room_y');
    release({ marker: 'from-room-y' });

    const result = await pendingSave;
    expect(result.status).toBe('SUPERSEDED');
    expect(result.reason).toBe('destination-changed-during-collection');

    const after = readScopedRecord({ familyId: STATE_FAMILY, scope: A, locator: [roomX.id] });
    expect(after.raw).toBe(beforeRaw);
    expect(after.value.payload.marker).toBeUndefined();
  });

  it('an unchanged destination saves normally', async () => {
    const roomX = localRoomService.createLocalRoom({ name: 'Room X' });
    await localRoomService.flushPersistence();

    localStorage.setItem('selectedLocalRoomId', roomX.id);
    localStorage.setItem('isLocalRoom', 'true');

    roomStateService.collectRoomState.mockResolvedValueOnce({ marker: 'room-x-data' });
    const result = await localRoomService.autoSaveCurrentRoom();
    expect(result.status).toBe('OK');

    await localRoomService.flushPersistence();
    const stored = readScopedRecord({ familyId: STATE_FAMILY, scope: A, locator: [roomX.id] });
    expect(stored.status).toBe(READ_STATUS.PRESENT_VALID);
  });

  it('forceSaveCurrentRoom captures its destination too', async () => {
    const roomX = localRoomService.createLocalRoom({ name: 'Room X' });
    await localRoomService.flushPersistence();
    localStorage.setItem('selectedLocalRoomId', roomX.id);
    localStorage.setItem('isLocalRoom', 'true');

    const saved = await forceSaveCurrentRoom();
    expect(saved.status).toBe('OK');

    // A destination change during collection supersedes the force save.
    const before = readScopedRecord({ familyId: STATE_FAMILY, scope: A, locator: [roomX.id] });
    let release;
    const collectSpy = jest.spyOn(localRoomService, 'collectCurrentGameState').mockImplementationOnce(
      () => new Promise((resolve) => { release = resolve; })
    );
    const pending = forceSaveCurrentRoom();
    localStorage.setItem('selectedLocalRoomId', 'room_y');
    release({ marker: 'from-room-y' });
    const superseded = await pending;
    expect(superseded.status).toBe('SUPERSEDED');
    collectSpy.mockRestore();
    const after = readScopedRecord({ familyId: STATE_FAMILY, scope: A, locator: [roomX.id] });
    expect(after.raw).toBe(before.raw);
  });

  it('scoped rooms are account-local: B sees no rooms until they author their own', async () => {
    const roomX = localRoomService.createLocalRoom({ name: 'Room X' });
    await localRoomService.flushPersistence();
    expect(localRoomService.getLocalRoom(roomX.id)).toBeTruthy();

    clearToSignedOut();
    activatePrivateScope(createUserScope('user-b'));
    localRoomService.loadRooms();
    expect(localRoomService.getLocalRooms()).toEqual([]);
  });
});
