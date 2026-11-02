/**
 * Account-required boundary in the lobby — ordinary controls, real authStore.
 *
 * Current enforced policy: online campaign creation/joining needs a signed-in
 * account (server requireAuth; tokenless guests are refused). Future guest
 * joining is an unresolved product decision and is NOT rejected here.
 * Only the lobby is rendered; the socket is an observed fake. Local guest
 * characters and drafts must be untouched by the notice and by the sign-in click.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoomLobby, { ACCOUNT_REQUIRED_TITLE } from '../RoomLobby';
import useAuthStore from '../../../store/authStore';

jest.mock('../../../config/firebase', () => ({ auth: { currentUser: null } }));
jest.mock('../../../services/roomService', () => ({
  getUserRooms: jest.fn().mockResolvedValue([]),
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

const ROOMS = '[{"id":"room_local_1","name":"Guest Keep"}]';
const CHARS = '[{"id":"char_1","name":"Guest Hero"}]';

const guestUser = { uid: 'anon-1', isGuest: true, displayName: 'Guest1', email: 'guest-anon-1@mythrill.local' };
const accountUser = { uid: 'acct-1', isGuest: false, displayName: 'Ada', email: 'ada@test.local', getIdToken: async () => 'tok' };

const renderLobby = (props = {}) => {
  const socket = { connected: true, emit: jest.fn(), on: jest.fn(), off: jest.fn() };
  const onShowLogin = jest.fn();
  render(
    <MemoryRouter>
      <RoomLobby socket={socket} onJoinRoom={jest.fn()} onReturnToLanding={jest.fn()} onJoinAttempt={jest.fn()} onShowLogin={onShowLogin} {...props} />
    </MemoryRouter>
  );
  return { socket, onShowLogin };
};

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('mythrill_local_rooms', ROOMS);
  localStorage.setItem('mythrill-guest-characters', CHARS);
});

describe('RoomLobby account-required boundary', () => {
  it('local guest: explains the requirement and offers the existing sign-in route', () => {
    useAuthStore.setState({ user: guestUser, isAuthenticated: true });
    const { onShowLogin } = renderLobby();
    const region = screen.getByRole('region', { name: /account required for online campaigns/i });
    expect(region).toHaveTextContent(ACCOUNT_REQUIRED_TITLE);
    expect(region).toHaveTextContent(/sign in or register/i);
    expect(region).toHaveTextContent(/local guest characters and drafts stay on this device/i);
    fireEvent.click(screen.getByRole('button', { name: /sign in or register/i }));
    expect(onShowLogin).toHaveBeenCalledTimes(1);
  });

  it('local guest: Create Temporary Room does not reach the server and says why; drafts untouched', () => {
    useAuthStore.setState({ user: guestUser, isAuthenticated: true });
    const { socket } = renderLobby();
    fireEvent.click(screen.getByRole('button', { name: /^create room$/i }));
    fireEvent.change(screen.getByPlaceholderText(/Enter room or campaign name/i), { target: { value: 'My Table' } });
    fireEvent.click(screen.getByRole('button', { name: /create temporary room/i }));
    expect(socket.emit).not.toHaveBeenCalledWith('create_room', expect.anything());
    expect(socket.emit.mock.calls.filter(([e]) => e === 'create_room' || e === 'join_room')).toEqual([]);
    expect(document.querySelector('.error-message')).toHaveTextContent(/need a signed-in account/i);
    expect(localStorage.getItem('mythrill_local_rooms')).toBe(ROOMS);
    expect(localStorage.getItem('mythrill-guest-characters')).toBe(CHARS);
  });

  it('local guest: Enter Portal (join) is refused client-side with no join_room emit', () => {
    useAuthStore.setState({ user: guestUser, isAuthenticated: true });
    const { socket } = renderLobby();
    fireEvent.change(screen.getByPlaceholderText(/Enter display name/i), { target: { value: 'Pip' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter room ID or code/i), { target: { value: 'room-123' } });
    const enter = screen.getByRole('button', { name: /enter portal/i });
    fireEvent.click(enter);
    fireEvent.submit(enter.closest('form'));
    expect(socket.emit.mock.calls.filter(([e]) => e === 'join_room')).toEqual([]);
  });

  it('registered account: no notice, same lobby, access path unchanged', () => {
    useAuthStore.setState({ user: accountUser, isAuthenticated: true });
    renderLobby();
    expect(screen.queryByRole('region', { name: /account required/i })).toBeNull();
    expect(screen.queryByText(ACCOUNT_REQUIRED_TITLE)).toBeNull();
  });

  it('signed out: no guest notice either (the guest boundary is for local guests only)', () => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
    renderLobby();
    expect(screen.queryByRole('region', { name: /account required/i })).toBeNull();
  });
});
