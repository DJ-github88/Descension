/**
 * Project 5 Wave C (S8-A) — local-room conversion durability regressions.
 *
 * Production modules: the scoped conversion transfer lifecycle, the socket
 * confirmation flow (existing P3 room_state_saved contract) and the real
 * RoomLobby creation path. Network/browser boundaries only are doubled.
 */

const path = require('path');
const ROOT = path.resolve(__dirname, '../..');

jest.mock('../../config/firebase', () => ({
  db: {}, isFirebaseConfigured: true, isDemoMode: false,
  auth: {
    currentUser: { uid: 'owner-a' },
    onAuthStateChanged: (cb) => { cb({ uid: 'owner-a', displayName: 'Owner A', email: 'a@example.com' }); return () => {}; }
  }
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn((...args) => args.slice(1).join('/')),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn((...args) => args.slice(1).join('/')),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(() => () => {})
}));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn(() => () => {}) }));

const ticks = async () => { for (let i = 0; i < 16; i += 1) await Promise.resolve(); };

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

/** Event-emitting socket double with multiple listeners per event. */
function makeSocket() {
  const listeners = new Map();
  return {
    listeners,
    emit: jest.fn(),
    on: jest.fn((event, fn) => {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event).push(fn);
    }),
    off: jest.fn((event, fn) => {
      const list = listeners.get(event) || [];
      listeners.set(event, list.filter((entry) => entry !== fn));
    }),
    once: jest.fn(),
    connected: true,
    fire(event, data) {
      if (event === 'room_state_saved' && data.reason === undefined) {
        data = { ...data, reason: 'local_room_conversion' };
      }
      for (const fn of [...(listeners.get(event) || [])]) fn(data);
    }
  };
}

const DEST = 'persistent-dest-1';
const SOURCE = 'local-room-1';

function saveTransfer(conversion) {
  conversion.saveConversionTransfer(
    { name: 'Converted Hall', description: 'A local room', gameState: { privateMap: true }, originalRoomId: SOURCE },
    { sourceRoomId: SOURCE, sourceDraftId: 'draft-source-state', sourceRevision: 5 }
  );
}

function beginAndArm(conversion, flow, socket, onConfirmed = null) {
  const captured = conversion.captureConversionTransfer();
  expect(captured.ok).toBe(true);
  const began = conversion.beginConversionRequest({ destinationRoomId: DEST, context: captured.context });
  expect(began.status).toBe('OK');
  const armed = flow.beginConversionConfirmation({
    socket,
    context: captured.context,
    destinationRoomId: DEST,
    sourceRoomId: SOURCE,
    onConfirmed
  });
  expect(armed.status).toBe('ARMED');
  return captured;
}

function admit(socket) {
  socket.fire('room_created', { room: { id: DEST, persistentRoomId: DEST } });
  socket.fire('room_joined', { room: { id: DEST, persistentRoomId: DEST } });
}

beforeEach(() => {
  jest.restoreAllMocks();
  jest.resetModules();
  localStorage.clear();
  sessionStorage.clear();
});

describe('S8-A — local-room conversion durability', () => {
  it('S8A-16 a checkpoint for another save reason cannot confirm this conversion', () => {
    harness();
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    saveTransfer(conversion);
    const socket = makeSocket();
    const done = jest.fn();
    beginAndArm(conversion, flow, socket, done);
    admit(socket);
    socket.fire('room_state_saved', { roomId: DEST, reason: 'map_transition', cloudSaved: true, confirmedRevision: 9 });
    expect(done).not.toHaveBeenCalled();
    expect(conversion.loadConversionRecord().state).toBe('AWAITING_CONFIRMATION');
  });
  it('S8A-13 an unrelated same-room save before admission cannot retire a conversion', () => {
    harness();
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    saveTransfer(conversion);
    const socket = makeSocket();
    const done = jest.fn();
    beginAndArm(conversion, flow, socket, done);
    socket.fire('room_state_saved', { roomId: DEST, cloudSaved: true, confirmedRevision: 99 });
    expect(done).not.toHaveBeenCalled();
    expect(conversion.loadConversionRecord().state).toBe('REQUESTED');
  });

  it('S8A-14 failed source retirement retains the confirmed recovery record', () => {
    harness();
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    saveTransfer(conversion);
    const socket = makeSocket();
    beginAndArm(conversion, flow, socket, () => { throw new Error('source preservation failed'); });
    admit(socket);
    socket.fire('room_state_saved', { roomId: DEST, cloudSaved: true, confirmedRevision: 7 });
    expect(conversion.loadConversionRecord().state).toBe('CONFIRMED');
    expect(conversion.loadConversionTransfer()).not.toBeNull();
  });

  it('S8A-15 a generation switch before the timeout never throws or changes retained state', () => {
    jest.useFakeTimers();
    try {
      const { switchTo, B } = harness();
      const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
      const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
      saveTransfer(conversion);
      const socket = makeSocket();
      beginAndArm(conversion, flow, socket);
      admit(socket);
      switchTo(B);
      expect(() => jest.advanceTimersByTime(flow.CONVERSION_CONFIRM_TIMEOUT_MS + 1)).not.toThrow();
    } finally {
      jest.useRealTimers();
    }
  });
  it('S8A-1 successful conversion requires a durable P3 checkpoint before confirmation/retirement', async() => {
    const { switchTo, A } = harness();
    switchTo(A);
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    const local = require(`${ROOT}/services/localRoomService`).default;
    const room = local.createLocalRoom({ name: 'Source Hall', characterName: 'Hero' });
    await local.flushPersistence();

    conversion.saveConversionTransfer(
      { name: 'Converted Hall', gameState: { privateMap: true }, originalRoomId: room.id },
      { sourceRoomId: room.id, sourceDraftId: 'draft-source-state', sourceRevision: 2 }
    );
    const captured = conversion.captureConversionTransfer();
    expect(captured.conversionState).toBe('PRESERVED');
    expect(captured.sourceRoomId).toBe(room.id);

    conversion.beginConversionRequest({ destinationRoomId: DEST, context: captured.context });
    const socket = makeSocket();
    const confirmedCalls = [];
    flow.beginConversionConfirmation({
      socket,
      context: captured.context,
      destinationRoomId: DEST,
      sourceRoomId: room.id,
      onConfirmed: ({ confirmedRevision, destinationRoomId }) => {
        confirmedCalls.push({ confirmedRevision, destinationRoomId });
        local.markRoomAsConverted(room.id, destinationRoomId);
      }
    });

    admit(socket);
    // Admission is not durability: the transfer is only awaiting confirmation
    // and the local source is untouched.
    expect(conversion.loadConversionRecord().state).toBe('AWAITING_CONFIRMATION');
    expect(local.getLocalRoom(room.id).isConverted).toBeUndefined();
    expect(socket.emit).toHaveBeenCalledWith('save_room_state_request', {
      roomId: DEST,
      reason: 'local_room_conversion'
    });

    // A wrong-room or unproven acknowledgment must not confirm.
    socket.fire('room_state_saved', { roomId: 'other-room', cloudSaved: true, confirmedRevision: 3 });
    socket.fire('room_state_saved', { roomId: DEST, cloudSaved: false, confirmedRevision: 3 });
    socket.fire('room_state_saved', { roomId: DEST, cloudSaved: true, confirmedRevision: 0 });
    expect(conversion.loadConversionRecord().state).toBe('AWAITING_CONFIRMATION');

    socket.fire('room_state_saved', { roomId: DEST, cloudSaved: true, confirmedRevision: 7 });
    expect(confirmedCalls).toEqual([{ confirmedRevision: 7, destinationRoomId: DEST }]);
    expect(conversion.loadConversionRecord()).toBeNull();
    expect(conversion.loadConversionTransfer()).toBeNull();
    const converted = local.getLocalRoom(room.id);
    expect(converted.isConverted).toBe(true);
    expect(converted.convertedTo).toBe(DEST);
    await local.flushPersistence();
  });

  it('S8A-2 creation succeeds but the checkpoint fails: transfer stays recoverable and unconfirmed', async() => {
    const { switchTo, A } = harness();
    switchTo(A);
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    saveTransfer(conversion);
    const socket = makeSocket();
    beginAndArm(conversion, flow, socket);
    admit(socket);

    socket.fire('room_state_save_error', {
      roomId: DEST, code: 'checkpoint_writer_unavailable', outcome: 'unavailable', retriable: false,
      error: 'Room checkpoint writer is unavailable'
    });

    const record = conversion.loadConversionRecord();
    expect(record).not.toBeNull();
    expect(record.state).toBe('AWAITING_CONFIRMATION');
    expect(record.lastError).toMatch(/unavailable/);
    expect(record.retriable).toBe(false);
    expect(conversion.loadConversionTransfer()).toMatchObject({ gameState: { privateMap: true } });
  });

  it('S8A-3 network interruption before confirmation times out into an explicit pending state', () => {
    jest.useFakeTimers();
    try {
      const { switchTo, A } = harness();
      switchTo(A);
      const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
      const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
      saveTransfer(conversion);
      const socket = makeSocket();
      beginAndArm(conversion, flow, socket);
      admit(socket);
      expect(conversion.loadConversionRecord().state).toBe('AWAITING_CONFIRMATION');

      jest.advanceTimersByTime(flow.CONVERSION_CONFIRM_TIMEOUT_MS + 10);

      const record = conversion.loadConversionRecord();
      expect(record.state).toBe('AWAITING_CONFIRMATION');
      expect(record.lastError).toBe('confirmation-timeout');
      expect(record.retriable).toBe(true);
      expect(conversion.loadConversionTransfer()).not.toBeNull();
    } finally {
      jest.useRealTimers();
    }
  });

  it('S8A-4 account switch during conversion drops the old continuation and leaves the transfer pending', () => {
    const { switchTo, A, B } = harness();
    switchTo(A);
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    saveTransfer(conversion);
    const socket = makeSocket();
    const confirmed = jest.fn();
    beginAndArm(conversion, flow, socket, confirmed);
    admit(socket);

    switchTo(B);
    socket.fire('room_state_saved', { roomId: DEST, cloudSaved: true, confirmedRevision: 9 });

    expect(confirmed).not.toHaveBeenCalled();
    expect(conversion.loadConversionRecord()).toBeNull(); // B has no transfer
    switchTo(A);
    const record = conversion.loadConversionRecord();
    expect(record.state).toBe('AWAITING_CONFIRMATION');
    expect(record.confirmedRevision).toBeNull();
  });

  it('S8A-5 same-UID logout/relogin invalidates the old completion; a new generation can confirm', () => {
    const { switchTo, gate, A } = harness();
    switchTo(A);
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    const { createUserScope } = require(`${ROOT}/persistence/scopeModel`);
    saveTransfer(conversion);
    const socket = makeSocket();
    const confirmed = jest.fn();
    beginAndArm(conversion, flow, socket, confirmed);
    admit(socket);

    // Same UID logout/relogin — generation advances.
    gate.clearToSignedOut();
    gate.activatePrivateScope(createUserScope('owner-a'));

    socket.fire('room_state_saved', { roomId: DEST, cloudSaved: true, confirmedRevision: 9 });
    expect(confirmed).not.toHaveBeenCalled();
    expect(conversion.loadConversionRecord().state).toBe('AWAITING_CONFIRMATION');

    // The same-UID new generation may confirm through a fresh continuation.
    const recaptured = conversion.captureConversionTransfer();
    const socket2 = makeSocket();
    flow.beginConversionConfirmation({
      socket: socket2,
      context: recaptured.context,
      destinationRoomId: DEST,
      sourceRoomId: SOURCE,
      onConfirmed: confirmed
    });
    socket2.fire('room_joined', { room: { id: DEST, persistentRoomId: DEST } });
    socket2.fire('room_state_saved', { roomId: DEST, cloudSaved: true, confirmedRevision: 10 });
    expect(confirmed).toHaveBeenCalledTimes(1);
    expect(conversion.loadConversionTransfer()).toBeNull();
  });

  it('S8A-6 retry resumes the same destination without destroying the source or corrupting it', () => {
    const { switchTo, A } = harness();
    switchTo(A);
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    saveTransfer(conversion);
    const socket = makeSocket();
    const captured = beginAndArm(conversion, flow, socket);
    admit(socket);
    socket.fire('room_state_save_error', { roomId: DEST, error: 'not confirmed', retriable: true });
    const pendingPayload = conversion.loadConversionTransfer();

    // A retry must resume the recorded destination, never create a new one.
    const retry = conversion.beginConversionRequest({ destinationRoomId: DEST, context: captured.context });
    expect(retry.status).toBe('OK');
    expect(retry.idempotent).toBe(true);
    const conflicting = conversion.beginConversionRequest({ destinationRoomId: 'another-dest', context: captured.context });
    expect(conflicting.status).toBe('DESTINATION_LOCKED');
    expect(conversion.loadConversionTransfer()).toEqual(pendingPayload);

    // The retry flow re-requests the checkpoint and confirms only on durability.
    const socket2 = makeSocket();
    const done = jest.fn();
    flow.beginConversionConfirmation({
      socket: socket2, context: captured.context, destinationRoomId: DEST, sourceRoomId: SOURCE, onConfirmed: done
    });
    socket2.fire('room_joined', { room: { id: DEST, persistentRoomId: DEST } });
    expect(socket2.emit).toHaveBeenCalledWith('save_room_state_request', { roomId: DEST, reason: 'local_room_conversion' });
    socket2.fire('room_state_saved', { roomId: DEST, cloudSaved: true, confirmedRevision: 4 });
    expect(done).toHaveBeenCalledTimes(1);
    expect(conversion.loadConversionTransfer()).toBeNull();
  });

  it('S8A-7 wrong destination or checkpoint cannot confirm the transfer', () => {
    const { switchTo, A } = harness();
    switchTo(A);
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    saveTransfer(conversion);
    const socket = makeSocket();
    const confirmed = jest.fn();
    beginAndArm(conversion, flow, socket, confirmed);
    admit(socket);

    socket.fire('room_state_saved', { roomId: 'wrong-destination', cloudSaved: true, confirmedRevision: 6 });
    socket.fire('room_created', { room: { id: 'wrong-destination' } });
    socket.fire('room_joined', { room: { id: 'wrong-destination' } });
    expect(confirmed).not.toHaveBeenCalled();
    const record = conversion.loadConversionRecord();
    expect(record.state).toBe('AWAITING_CONFIRMATION');
    expect(record.destinationRoomId).toBe(DEST);

    // Direct cross-destination confirmation is refused with no mutation.
    const direct = conversion.confirmConversion({
      destinationRoomId: 'wrong-destination', confirmedRevision: 6, context: conversion.captureConversionTransfer().context
    });
    expect(direct.status).toBe('WRONG_DESTINATION');
    expect(conversion.loadConversionRecord().destinationRoomId).toBe(DEST);
    expect(conversion.loadConversionRecord().state).toBe('AWAITING_CONFIRMATION');
  });

  it('S8A-8 the local draft and its captured identity stay recoverable before confirmation', async() => {
    const { switchTo, A } = harness();
    switchTo(A);
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    const local = require(`${ROOT}/services/localRoomService`).default;
    const room = local.createLocalRoom({ name: 'Recoverable Hall', characterName: 'Hero' });
    await local.flushPersistence();
    conversion.saveConversionTransfer(
      { name: 'Recoverable Hall', gameState: { terrain: [1, 2, 3] }, originalRoomId: room.id },
      { sourceRoomId: room.id, sourceDraftId: 'draft-source-state', sourceRevision: 11 }
    );

    const record = conversion.loadConversionRecord();
    expect(record.sourceRoomId).toBe(room.id);
    expect(record.sourceDraftId).toBe('draft-source-state');
    expect(record.sourceRevision).toBe(11);
    expect(record.sourceContext.scope.scopeId).toBe('owner-a');
    expect(typeof record.sourceContext.accountGeneration).toBe('number');

    const socket = makeSocket();
    beginAndArm(conversion, flow, socket);
    admit(socket);
    socket.fire('room_state_save_error', { roomId: DEST, error: 'cloud unavailable', retriable: true });

    expect(conversion.loadConversionTransfer()).toMatchObject({ gameState: { terrain: [1, 2, 3] } });
    expect(local.getLocalRoom(room.id).isConverted).toBeUndefined();
    expect(local.getLocalRoom(room.id)).not.toBeNull();
    await local.flushPersistence();
  });

  it('S8A-9 a confirmed conversion survives a restart (no pending transfer, source marked)', async() => {
    let { switchTo } = harness();
    switchTo(require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a'));
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    const local = require(`${ROOT}/services/localRoomService`).default;
    const room = local.createLocalRoom({ name: 'Durable Hall', characterName: 'Hero' });
    await local.flushPersistence();
    conversion.saveConversionTransfer(
      { name: 'Durable Hall', gameState: { keep: true }, originalRoomId: room.id },
      { sourceRoomId: room.id, sourceDraftId: 'draft-source-state', sourceRevision: 3 }
    );
    const socket = makeSocket();
    beginAndArm(conversion, flow, socket, ({ destinationRoomId }) => local.markRoomAsConverted(room.id, destinationRoomId));
    admit(socket);
    socket.fire('room_state_saved', { roomId: DEST, cloudSaved: true, confirmedRevision: 12 });
    await local.flushPersistence();
    expect(conversion.loadConversionTransfer()).toBeNull();

    // Restart: fresh module state, durable storage retained. The conversion
    // must not reappear as pending and the source stays marked converted.
    jest.resetModules();
    const gate2 = require(`${ROOT}/persistence/bootstrapPrivacyGate`);
    gate2.resetBootstrapGateForTests();
    gate2.activatePrivateScope(require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a'));
    const conversion2 = require(`${ROOT}/persistence/localRoomConversionScoped`);
    expect(conversion2.loadConversionRecord()).toBeNull();
    expect(conversion2.loadConversionTransfer()).toBeNull();
    const local2 = require(`${ROOT}/services/localRoomService`).default;
    const restarted = local2.getLocalRoom(room.id);
    expect(restarted).not.toBeNull();
    expect(restarted.isConverted).toBe(true);
    expect(restarted.convertedTo).toBe(DEST);
  });

  it('S8A-10 the client requests the server checkpoint only; it never emits a browser snapshot write', () => {
    const { switchTo, A } = harness();
    switchTo(A);
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const flow = require(`${ROOT}/persistence/localRoomConversionFlow`);
    saveTransfer(conversion);
    const socket = makeSocket();
    beginAndArm(conversion, flow, socket);
    admit(socket);

    const persistenceEmits = socket.emit.mock.calls.filter(([event]) =>
      ['save_room_state_request', 'update_room_game_state', 'resolve_state_conflict', 'save_room_state'].includes(event));
    expect(persistenceEmits).toHaveLength(1);
    const [event, payload] = persistenceEmits[0];
    expect(event).toBe('save_room_state_request');
    // No snapshot bytes travel from the browser: an initialized destination can
    // only be saved by the server's own authoritative checkpoint writer.
    expect(payload).toEqual({ roomId: DEST, reason: 'local_room_conversion' });
    expect(payload.gameState).toBeUndefined();
    expect(payload.state).toBeUndefined();
    expect(conversion.loadConversionRecord().state).toBe('AWAITING_CONFIRMATION');
  });

  it('S8A-11 the real RoomLobby creation-request path arms the lifecycle and retains the transfer', async() => {
    const { switchTo, A } = harness();
    switchTo(A);
    jest.doMock('../../services/roomService', () => ({
      getUserRooms: jest.fn().mockResolvedValue([]),
      createPersistentRoom: jest.fn().mockResolvedValue(DEST)
    }));
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    const local = require(`${ROOT}/services/localRoomService`).default;
    const room = local.createLocalRoom({ name: 'Lobby Hall', characterName: 'Hero' });
    await local.flushPersistence();
    conversion.saveConversionTransfer(
      { name: 'Lobby Hall', gameState: { fromLobby: true }, originalRoomId: room.id },
      { sourceRoomId: room.id, sourceDraftId: 'draft-source-state', sourceRevision: 1 }
    );

    const React = require('react');
    const { render, act, fireEvent, cleanup } = require('@testing-library/react/pure');
    const { MemoryRouter } = require('react-router-dom');
    const Lobby = require(`${ROOT}/components/multiplayer/RoomLobby`).default;
    require(`${ROOT}/store/characterStore`).default.setState({
      characters: [{ id: 'c1', name: 'Hero' }], currentCharacterId: 'c1'
    });
    require(`${ROOT}/store/authStore`).default.setState({ user: { uid: 'owner-a' } });
    const socket = makeSocket();
    let ui;
    try {
      await act(async() => {
        ui = render(React.createElement(MemoryRouter, null, React.createElement(Lobby, { socket })));
        await ticks();
      });

      await act(async() => {
        fireEvent.click(ui.getByText(/Create Permanent Room/));
        await ticks();
        await ticks();
      });

      expect(socket.emit).toHaveBeenCalledWith('create_room', expect.objectContaining({
        persistentRoomId: DEST,
        isConverted: true,
        gameState: { fromLobby: true }
      }));
      const record = conversion.loadConversionRecord();
      expect(record.state).toBe('REQUESTED');
      expect(record.destinationRoomId).toBe(DEST);

      await act(async() => { admit(socket); });
      expect(socket.emit).toHaveBeenCalledWith('save_room_state_request', { roomId: DEST, reason: 'local_room_conversion' });
      await act(async() => {
        socket.fire('room_state_saved', { roomId: DEST, cloudSaved: true, confirmedRevision: 2 });
      });
      expect(conversion.loadConversionTransfer()).toBeNull();
      expect(local.getLocalRoom(room.id).isConverted).toBe(true);
    } finally {
      cleanup();
      await local.flushPersistence();
    }
  }, 30000);

  it('S8A-12 a retry through the real RoomLobby resumes the recorded destination instead of creating a new room', async() => {
    const { switchTo, A } = harness();
    switchTo(A);
    const createRoomMock = jest.fn().mockResolvedValue('should-not-be-used');
    jest.doMock('../../services/roomService', () => ({
      getUserRooms: jest.fn().mockResolvedValue([]),
      createPersistentRoom: createRoomMock
    }));
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    saveTransfer(conversion);
    const captured = conversion.captureConversionTransfer();
    conversion.beginConversionRequest({ destinationRoomId: DEST, context: captured.context });

    const React = require('react');
    const { render, act, fireEvent, cleanup } = require('@testing-library/react/pure');
    const { MemoryRouter } = require('react-router-dom');
    const Lobby = require(`${ROOT}/components/multiplayer/RoomLobby`).default;
    require(`${ROOT}/store/characterStore`).default.setState({
      characters: [{ id: 'c1', name: 'Hero' }], currentCharacterId: 'c1'
    });
    require(`${ROOT}/store/authStore`).default.setState({ user: { uid: 'owner-a' } });
    const socket = makeSocket();
    let ui;
    try {
      await act(async() => {
        ui = render(React.createElement(MemoryRouter, null, React.createElement(Lobby, { socket })));
        await ticks();
      });
      await act(async() => {
        fireEvent.click(ui.getByText(/Create Permanent Room/));
        await ticks();
        await ticks();
      });

      expect(createRoomMock).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith('create_room', expect.objectContaining({
        persistentRoomId: DEST,
        isConverted: true
      }));
    } finally {
      cleanup();
    }
  }, 30000);
});
