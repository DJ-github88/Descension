import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoomLobby from '../RoomLobby';
import useAuthStore from '../../../store/authStore';

const mockGetUserRooms = jest.fn().mockResolvedValue([]);

jest.mock('../../../config/firebase', () => ({ auth: { currentUser: null } }));
jest.mock('../../../services/roomService', () => ({
  getUserRooms: (...args) => mockGetUserRooms(...args),
  createPersistentRoom: jest.fn()
}));
jest.mock('../../../services/localRoomService', () => ({ subscribeRooms: jest.fn(() => () => {}) }));
jest.mock('../../../persistence/localRoomConversionScoped', () => ({
  loadConversionTransfer: jest.fn(() => ({ ok: true, payload: null })),
  captureConversionTransfer: jest.fn(() => ({ ok: true, payload: null })),
  beginConversionRequest: jest.fn()
}));
jest.mock('../../../persistence/localRoomConversionFlow', () => ({
  beginConversionConfirmation: jest.fn(),
  subscribeConversionFlow: jest.fn(() => () => {})
}));

const accountUser = {
  uid: 'acct-friend-1',
  isGuest: false,
  displayName: 'Ilse',
  email: 'ilse@example.test',
  getIdToken: async () => 'tok-friend-1'
};

function createFakeSocket() {
  const listeners = new Map();
  const onceListeners = new Map();
  return {
    id: 'sock-1',
    connected: true,
    emit: jest.fn(),
    on: jest.fn((event, handler) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(handler);
    }),
    once: jest.fn((event, handler) => {
      if (!onceListeners.has(event)) onceListeners.set(event, new Set());
      onceListeners.get(event).add(handler);
    }),
    off: jest.fn((event, handler) => {
      if (handler) {
        listeners.get(event)?.delete(handler);
        onceListeners.get(event)?.delete(handler);
      } else {
        listeners.delete(event);
        onceListeners.delete(event);
      }
    }),
    trigger(event, payload) {
      for (const fn of Array.from(listeners.get(event) || [])) {
        fn(payload);
      }
      const onceSet = onceListeners.get(event);
      if (onceSet) {
        onceListeners.delete(event);
        for (const fn of Array.from(onceSet)) {
          fn(payload);
        }
      }
    }
  };
}

function assertNoPasswordsStored() {
  const lsEntries = Object.entries(localStorage);
  const ssEntries = Object.entries(sessionStorage);
  for (const [k, v] of [...lsEntries, ...ssEntries]) {
    expect(k).not.toBe('selectedRoomPassword');
    expect(String(v)).not.toContain('wrong-pass');
    expect(String(v)).not.toContain('ember-playtest');
    expect(String(v)).not.toContain('secret-pass');
  }
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  mockGetUserRooms.mockReset().mockResolvedValue([]);
  useAuthStore.setState({ user: accountUser, isAuthenticated: true });
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout !== 'function') {
    AbortSignal.timeout = () => undefined;
  }
  global.fetch = jest.fn(async (url) => {
    if (String(url).includes('/health')) {
      return { ok: true, json: async () => ({ status: 'ok' }) };
    }
    if (String(url).includes('/api/rooms')) {
      return { ok: true, json: async () => [] };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  });
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  global.cancelAnimationFrame = (id) => clearTimeout(id);
});

describe('RoomLobby private room join and refresh-rejoin behavior', () => {
  it('keeps form open, retains roomId, shows error beside password field on wrong password, and lets player retry', async () => {
    const socket = createFakeSocket();
    const onJoinAttempt = jest.fn();

    render(
      <MemoryRouter>
        <RoomLobby
          socket={socket}
          onJoinRoom={jest.fn()}
          onReturnToLanding={jest.fn()}
          onJoinAttempt={onJoinAttempt}
        />
      </MemoryRouter>
    );

    const playerInput = screen.getByLabelText(/Display Name/i);
    const roomIdInput = screen.getByLabelText(/Room ID/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(playerInput, { target: { value: 'Ilse' } });
    fireEvent.change(roomIdInput, { target: { value: 'room-secret-1' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong-pass' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Enter Portal/i }));
    });

    expect(onJoinAttempt).toHaveBeenCalledWith('room-secret-1', 'wrong-pass');
    expect(socket.emit).toHaveBeenCalledWith(
      'join_room',
      expect.objectContaining({
        roomId: 'room-secret-1',
        password: 'wrong-pass'
      })
    );
    assertNoPasswordsStored();

    act(() => {
      socket.trigger('room_error', { error: 'Invalid password', code: 'invalid_password' });
    });

    // Form remains open, roomId is retained, error appears beside password field
    expect(roomIdInput).toHaveValue('room-secret-1');
    const inlineErr = screen.getByRole('alert');
    expect(inlineErr).toHaveAttribute('id', 'joinPasswordError');
    expect(inlineErr).toHaveTextContent(/incorrect password/i);
    expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    expect(passwordInput).toHaveAttribute('aria-describedby', 'joinPasswordError');
    await waitFor(() => {
      expect(document.activeElement).toBe(passwordInput);
    });
    expect(document.querySelector('.error-message')).toBeNull();

    // Editing the password clears the inline error
    fireEvent.change(passwordInput, { target: { value: 'ember-playtest' } });
    expect(screen.queryByRole('alert')).toBeNull();

    // Retry succeeds with the retained roomId and corrected password
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Enter Portal/i }));
    });

    const joinCalls = socket.emit.mock.calls.filter(([ev]) => ev === 'join_room');
    expect(joinCalls).toHaveLength(2);
    expect(joinCalls[1][1]).toEqual(
      expect.objectContaining({
        roomId: 'room-secret-1',
        password: 'ember-playtest'
      })
    );

    act(() => {
      socket.trigger('room_joined', {
        room: {
          id: 'room-secret-1',
          persistentRoomId: 'room-secret-1',
          name: 'Private Table'
        }
      });
    });

    assertNoPasswordsStored();
  });

  it('keeps the Quick Join password modal open with inline error on wrong password until corrected', async () => {
    const socket = createFakeSocket();
    const { auth } = require('../../../config/firebase');
    auth.currentUser = { uid: accountUser.uid };
    mockGetUserRooms.mockResolvedValue([{ id: 'perm-room-1', name: 'Vault Room' }]);

    global.fetch = jest.fn(async (url) => {
      if (String(url).includes('/health')) {
        return { ok: true, json: async () => ({ status: 'ok' }) };
      }
      if (String(url).includes('/api/rooms')) {
        return {
          ok: true,
          json: async () => [
            {
              id: 'perm-room-1',
              name: 'Vault Room',
              gm: 'GM',
              gmOnline: true,
              hasPassword: true,
              playerCount: 1,
              maxPlayers: 6,
              createdAt: '2026-11-23T10:00:00.000Z'
            }
          ]
        };
      }
      return { ok: false, status: 404, json: async () => ({}) };
    });

    render(
      <MemoryRouter>
        <RoomLobby
          socket={socket}
          onJoinRoom={jest.fn()}
          onReturnToLanding={jest.fn()}
          onJoinAttempt={jest.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: 'Ilse' } });
    fireEvent.click(screen.getByRole('button', { name: /Refresh/i }));

    await screen.findByText('Vault Room');
    const joinCardBtn = document.querySelector('.room-card-modern-button');
    expect(joinCardBtn).not.toBeNull();
    fireEvent.click(joinCardBtn);

    const modalInput = screen.getByPlaceholderText(/Enter room password/i);
    fireEvent.change(modalInput, { target: { value: 'wrong-pass' } });

    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /^Join Room$/i }).pop());
    });

    act(() => {
      socket.trigger('room_error', { error: 'Invalid password', code: 'invalid_password' });
    });

    // Modal stays open and displays inline error
    expect(screen.getByText('Enter Room Password')).toBeInTheDocument();
    const modalAlert = screen.getByRole('alert');
    expect(modalAlert).toHaveAttribute('id', 'modalPasswordError');
    expect(modalAlert).toHaveTextContent(/incorrect password/i);

    fireEvent.change(modalInput, { target: { value: 'ember-playtest' } });
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /^Join Room$/i }).pop());
    });

    const joinCalls = socket.emit.mock.calls.filter(([ev]) => ev === 'join_room');
    expect(joinCalls[joinCalls.length - 1][1]).toEqual(
      expect.objectContaining({
        roomId: 'perm-room-1',
        password: 'ember-playtest'
      })
    );

    act(() => {
      socket.trigger('room_joined', {
        room: { id: 'perm-room-1', persistentRoomId: 'perm-room-1', name: 'Vault Room' }
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('Enter Room Password')).toBeNull();
    });
    assertNoPasswordsStored();
    auth.currentUser = null;
  });

  it('pre-fills roomId after refresh (initialRoomId), requires password when server demands it, and stores no passwords', async () => {
    const socket = createFakeSocket();

    render(
      <MemoryRouter>
        <RoomLobby
          socket={socket}
          initialRoomId="room-refresh-42"
          onJoinRoom={jest.fn()}
          onReturnToLanding={jest.fn()}
          onJoinAttempt={jest.fn()}
        />
      </MemoryRouter>
    );

    const roomIdInput = screen.getByLabelText(/Room ID/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const playerInput = screen.getByLabelText(/Display Name/i);

    expect(roomIdInput).toHaveValue('room-refresh-42');
    expect(screen.getByText(/Room ID restored from your current link/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(document.activeElement).toBe(passwordInput);
    });

    fireEvent.change(playerInput, { target: { value: 'Ilse' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Enter Portal/i }));
    });

    expect(socket.emit).toHaveBeenCalledWith(
      'join_room',
      expect.objectContaining({
        roomId: 'room-refresh-42',
        password: ''
      })
    );

    act(() => {
      socket.trigger('room_error', { error: 'Invalid password', code: 'invalid_password' });
    });

    expect(roomIdInput).toHaveValue('room-refresh-42');
    expect(screen.getByRole('alert')).toHaveTextContent(/requires a password/i);

    fireEvent.change(passwordInput, { target: { value: 'secret-pass' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Enter Portal/i }));
    });

    const joinCalls = socket.emit.mock.calls.filter(([ev]) => ev === 'join_room');
    expect(joinCalls[1][1]).toEqual(
      expect.objectContaining({
        roomId: 'room-refresh-42',
        password: 'secret-pass'
      })
    );

    act(() => {
      socket.trigger('room_joined', {
        room: { id: 'room-refresh-42', name: 'Refreshed Private Room' }
      });
    });

    assertNoPasswordsStored();
  });

  it('preserves non-password permission denial errors in the top lobby banner', async () => {
    const socket = createFakeSocket();

    render(
      <MemoryRouter>
        <RoomLobby
          socket={socket}
          initialRoomId="room-denied-9"
          onJoinRoom={jest.fn()}
          onReturnToLanding={jest.fn()}
          onJoinAttempt={jest.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: 'Ilse' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Enter Portal/i }));
    });

    act(() => {
      socket.trigger('room_error', {
        error: 'You are not permitted to join this room',
        code: 'not_room_member'
      });
    });

    expect(screen.queryByRole('alert')).toBeNull();
    expect(document.querySelector('.error-message')).toHaveTextContent(
      'You are not permitted to join this room'
    );
  });
});
