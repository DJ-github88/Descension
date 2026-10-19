/**
 * Authorized same-room rejoin fan-out (P12 integration closure, 2026-10-18).
 *
 * The app keeps exactly one `room_joined` socket listener (roomLifecycleHandlers). When that listener
 * accepts a rejoin of the room this client is already in, it notifies here. Services that must refresh
 * pending work after a rejoin (P12A strikes, P12B blocking) subscribe in-process instead of adding
 * socket listeners. Each subscriber fences the event itself (its own registration socket, account
 * principal/generation and current room) and only re-reads server-scoped lists; nothing is replayed,
 * rerolled or paid.
 */
import { getStore } from '../store/storeRegistry';
import { isSocketRetired } from '../persistence/handoff/socketPrincipalRetirement';

const subscribers = new Set();

/** Subscribe; returns the unsubscribe function (call it from the registering handler's cleanup). */
export function onRoomRejoined(fn) {
  if (typeof fn !== 'function') return () => {};
  subscribers.add(fn);
  return () => { subscribers.delete(fn); };
}

/** Called only by the single room_joined listener, for a rejoin of the current room. */
export function notifyRoomRejoined(event) {
  [...subscribers].forEach(fn => {
    try { fn(event); } catch (error) { console.error('[roomRejoin] subscriber failed', error); }
  });
}

export const roomRejoinSubscriberCount = () => subscribers.size;

/**
 * The rejoin step of the App's single `room_joined` listener (roomLifecycleHandlers, reconnect branch).
 * Relays only when the event arrives on the current, non-retired room socket for the room this client is
 * already in; a retired socket, another socket or another/missing room relays nothing. Returns whether it
 * relayed. Kept in this shared module so the production wiring is the same code wherever it is registered.
 */
function currentRoomRejoin(socket, data) {
  if (!socket || isSocketRetired(socket) || !data?.room) return null;
  const game = getStore('gameStore')?.getState() || {};
  const currentRoomId = game.multiplayerRoom?.id;
  const joinedIds = [data.room.id, data.room.persistentRoomId].filter(Boolean);
  if (!currentRoomId || game.multiplayerSocket !== socket || !joinedIds.includes(currentRoomId)) return null;
  return currentRoomId;
}

export function relayRoomRejoin(socket, data) {
  const roomId = currentRoomRejoin(socket, data);
  if (!roomId) return false;
  notifyRoomRejoined({ socket, roomId });
  return true;
}

const installed = new WeakMap();

/**
 * Registers THE `room_joined` listener of a socket (P12 integration closure, 2026-10-18). The App's room
 * lifecycle (roomLifecycleHandlers) passes its join handling as `onJoined`; any other caller (for example
 * a verification harness that does not mount MultiplayerApp) passes none. Registering again on the same
 * socket replaces the previous listener, so a socket never carries two. A rejoin is decided before
 * `onJoined` runs (the client was already in exactly this room on this socket) and relayed after it.
 * Returns the cleanup that removes this listener.
 */
export function registerRoomJoinedListener(socket, onJoined) {
  if (!socket || typeof socket.on !== 'function') return () => {};
  const previous = installed.get(socket);
  if (previous) socket.off('room_joined', previous);
  const listener = data => {
    if (isSocketRetired(socket)) return;
    const rejoin = currentRoomRejoin(socket, data);
    if (typeof onJoined === 'function') onJoined(data);
    if (rejoin) relayRoomRejoin(socket, data);
  };
  installed.set(socket, listener);
  socket.on('room_joined', listener);
  return () => {
    if (installed.get(socket) !== listener) return;
    socket.off('room_joined', listener);
    installed.delete(socket);
  };
}
