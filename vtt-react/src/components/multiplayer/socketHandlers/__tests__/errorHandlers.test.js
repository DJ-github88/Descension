/**
 * Project 2 blocker B4: room persistence status must be scoped to the
 * client's CURRENT multiplayer room. A stale packet for a room the client has
 * left must not change state or raise a toast, and per-room deduplication must
 * survive room switches without one room contaminating another.
 */
import { registerErrorHandlers } from '../errorHandlers';

const makeSocket = () => {
  const handlers = {};
  return {
    handlers,
    on: (event, handler) => { handlers[event] = handler; },
    off: (event) => { delete handlers[event]; }
  };
};

const makeStore = () => ({
  showWarning: jest.fn(),
  showSuccess: jest.fn()
});

describe('room save status room scoping', () => {
  it('ignores status for a room the client has left', () => {
    const socket = makeSocket();
    const notificationStore = makeStore();
    const currentRoomRef = { current: { id: 'room-b' } };
    const cleanup = registerErrorHandlers({ socket, notificationStore, currentRoomRef });

    socket.handlers.room_save_status({ roomId: 'room-a', status: 'saved' });
    socket.handlers.room_save_status({ roomId: 'room-a', status: 'unsaved' });
    socket.handlers.room_save_status({ roomId: 'room-a', status: 'retrying' });

    expect(notificationStore.showWarning).not.toHaveBeenCalled();
    expect(notificationStore.showSuccess).not.toHaveBeenCalled();

    cleanup();
  });

  it('preserves per-room dedupe and notifies for the current room only', () => {
    const socket = makeSocket();
    const notificationStore = makeStore();
    const currentRoomRef = { current: { id: 'room-a' } };
    const cleanup = registerErrorHandlers({ socket, notificationStore, currentRoomRef });

    for (let i = 0; i < 12; i++) {
      socket.handlers.room_save_status({ roomId: 'room-a', status: 'retrying' });
    }
    for (let i = 0; i < 6; i++) {
      socket.handlers.room_save_status({ roomId: 'room-a', status: 'unsaved' });
    }
    for (let i = 0; i < 4; i++) {
      socket.handlers.room_save_status({ roomId: 'room-a', status: 'saved' });
    }

    expect(notificationStore.showWarning).toHaveBeenCalledTimes(2); // retrying + unsaved
    expect(notificationStore.showSuccess).toHaveBeenCalledTimes(1);

    // Switch to room B: a late A "saved" packet must be ignored, and B's own
    // outage must notify independently of A's dedupe state.
    currentRoomRef.current = { id: 'room-b' };
    socket.handlers.room_save_status({ roomId: 'room-a', status: 'saved' });
    expect(notificationStore.showSuccess).toHaveBeenCalledTimes(1);

    socket.handlers.room_save_status({ roomId: 'room-b', status: 'retrying' });
    expect(notificationStore.showWarning).toHaveBeenCalledTimes(3);

    cleanup();
  });

  it('ignores save errors and saved acknowledgements for another room', () => {
    const socket = makeSocket();
    const notificationStore = makeStore();
    const currentRoomRef = { current: { id: 'room-b' } };
    const cleanup = registerErrorHandlers({ socket, notificationStore, currentRoomRef });

    socket.handlers.room_state_save_error({
      roomId: 'room-a',
      retriable: true,
      error: 'other room failure'
    });
    socket.handlers.room_state_saved({ roomId: 'room-a', cloudSaved: true });

    expect(notificationStore.showWarning).not.toHaveBeenCalled();
    expect(notificationStore.showSuccess).not.toHaveBeenCalled();

    cleanup();
  });

  it('still notifies the current room after a switch', () => {
    const socket = makeSocket();
    const notificationStore = makeStore();
    const currentRoomRef = { current: { id: 'room-a' } };
    const cleanup = registerErrorHandlers({ socket, notificationStore, currentRoomRef });

    socket.handlers.room_save_status({ roomId: 'room-a', status: 'unsaved' });
    expect(notificationStore.showWarning).toHaveBeenCalledTimes(1);

    currentRoomRef.current = { id: 'room-b' };
    socket.handlers.room_save_status({ roomId: 'room-b', status: 'unsaved' });
    expect(notificationStore.showWarning).toHaveBeenCalledTimes(2);

    socket.handlers.room_save_status({ roomId: 'room-b', status: 'saved' });
    expect(notificationStore.showSuccess).toHaveBeenCalledTimes(1);

    cleanup();
  });
});
