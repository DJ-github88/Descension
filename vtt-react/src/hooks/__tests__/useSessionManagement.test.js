/** Closure for the later live session-warning delta, outside the prior frozen build. */
import { renderHook, act, fireEvent } from '@testing-library/react';
import { useSessionManagement } from '../useSessionManagement';

const mockSignOut = jest.fn(async () => {});
const mockUpdateStatus = jest.fn();
const mockCleanup = jest.fn();
const mockAuth = { user: { uid: 'session-owner' }, isAuthenticated: true, signOut: mockSignOut, refreshAuthState: jest.fn() };
let mockPath = '/';
let mockInRoom = false;
jest.mock('react-router-dom', () => ({ useLocation: () => ({ pathname: mockPath }) }));
jest.mock('../../contexts/RoomContext', () => ({ useRoomContext: () => ({ isInRoom: mockInRoom }) }));
jest.mock('../../store/authStore', () => ({ __esModule: true, default: Object.assign(() => mockAuth, { getState: () => mockAuth }) }));
jest.mock('../../store/presenceStore', () => ({ __esModule: true, default: Object.assign(() => ({ updateStatus: mockUpdateStatus }), { getState: () => ({}) }) }));
jest.mock('../../store/socialStore', () => ({ __esModule: true, default: { getState: () => ({ cleanup: mockCleanup }) } }));

const advance = ms => act(() => { jest.advanceTimersByTime(ms); });
beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  localStorage.clear();
  mockPath = '/';
  mockInRoom = false;
});
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test('Stay Logged In survives countdown ticks and cancels the old warning deadline', () => {
  const hook = renderHook(() => useSessionManagement());
  advance(15 * 60 * 1000);
  const button = document.getElementById('extend-session');
  expect(button).toBeTruthy();
  advance(2000);
  expect(document.getElementById('session-time-display').textContent).toBe('4:58');
  expect(document.getElementById('extend-session')).toBe(button);
  act(() => fireEvent.click(button));
  expect(document.getElementById('session-warning-modal')).toBeNull();
  advance(5 * 60 * 1000);
  expect(mockSignOut).not.toHaveBeenCalled();
  // The click also reaches the incumbent one-second activity throttle.
  advance(10 * 60 * 1000 + 1000);
  expect(document.getElementById('session-warning-modal')).toBeTruthy();
  hook.unmount();
});

test('Log Out Now survives countdown ticks and invokes cleanup and signout once', async () => {
  const hook = renderHook(() => useSessionManagement());
  advance(15 * 60 * 1000 + 2000);
  await act(async () => { fireEvent.click(document.getElementById('logout-now')); });
  expect(mockCleanup).toHaveBeenCalledTimes(1);
  expect(mockSignOut).toHaveBeenCalledTimes(1);
  expect(document.getElementById('session-warning-modal')).toBeNull();
  advance(5 * 60 * 1000);
  expect(mockSignOut).toHaveBeenCalledTimes(1);
  hook.unmount();
});

test.each([['/game', false], ['/', true]])('room/game bypass remains intact (%s, room=%s)', (pathname, inRoom) => {
  mockPath = pathname;
  mockInRoom = inRoom;
  const hook = renderHook(() => useSessionManagement());
  advance(20 * 60 * 1000);
  expect(document.getElementById('session-warning-modal')).toBeNull();
  expect(mockSignOut).not.toHaveBeenCalled();
  hook.unmount();
});
