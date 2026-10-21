/** P12 integration closure: authorized same-room rejoin refreshes P12A/P12B pending work through the single
 * room_joined listener, without adding socket listeners, accumulating subscribers or crossing rooms/sockets. */
import { onRoomRejoined, notifyRoomRejoined, roomRejoinSubscriberCount, relayRoomRejoin, registerRoomJoinedListener } from '../roomRejoinBus';
import { markSocketRetired } from '../../persistence/handoff/socketPrincipalRetirement';
import { registerWeaponStrikeHandlers } from '../weaponStrikeService';
import { registerBlockingHandlers } from '../blockingService';
import { requestActorEvent } from '../actorConsequenceService';
import { currentActorDelivery } from '../actorProjectionOrder';
import { registerRoomLifecycleHandlers } from '../../components/multiplayer/socketHandlers/roomLifecycleHandlers';
import useGameStore from '../../store/gameStore';
import { registerStore } from '../../store/storeRegistry';
import { ownerSource } from '../spellConsequenceService';
import { captureActorDelivery } from '../actorProjectionOrder';

jest.mock('../actorConsequenceService', () => ({
  findActor: jest.fn(), inSharedRoom: () => true, refreshActorSnapshot: jest.fn(), prepareActorCommand: jest.fn(),
  submitPreparedActorCommand: jest.fn(), requestActorEvent: jest.fn(async () => ({ success: true, pending: [], offers: [], closedOffers: [] }))
}));
jest.mock('../actorProjectionOrder', () => ({ captureActorDelivery: jest.fn(socket => ({ socket })), currentActorDelivery: jest.fn(() => true) }));
jest.mock('../spellConsequenceService', () => ({ ownerSource: jest.fn(() => ({ error: 'no owner attachment' })) }));
jest.mock('../spellConsequenceCustody', () => ({ spellContext: () => ({ uid: 'u1', roomId: 'r1', current: () => true }) }));
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: (_r, line) => line }));

const fakeSocket = () => {
  const listeners = new Map();
  return {
    on(event, fn) { listeners.set(event, [...(listeners.get(event) || []), fn]); },
    off(event, fn) { listeners.set(event, fn ? (listeners.get(event) || []).filter(f => f !== fn) : []); },
    fire(event, data) { (listeners.get(event) || []).forEach(fn => fn(data)); },
    listenerCount(event) { return (listeners.get(event) || []).length; }
  };
};
const calls = event => requestActorEvent.mock.calls.filter(([name]) => name === event).length;
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

// CRA resets mock implementations before each test: install them here.
beforeEach(() => {
  requestActorEvent.mockImplementation(async () => ({ success: true, pending: [], offers: [], closedOffers: [] }));
  currentActorDelivery.mockReturnValue(true);
  captureActorDelivery.mockImplementation(socket => ({ socket }));
  ownerSource.mockReturnValue({ error: 'no owner attachment' });
});

test('the bus isolates a failing subscriber and unsubscribes cleanly', () => {
  const seen = [];
  const offA = onRoomRejoined(() => { throw Error('boom'); });
  const offB = onRoomRejoined(event => seen.push(event.roomId));
  jest.spyOn(console, 'error').mockImplementation(() => {});
  notifyRoomRejoined({ roomId: 'r1' });
  expect(seen).toEqual(['r1']);
  offA(); offB();
  expect(roomRejoinSubscriberCount()).toBe(0);
});

test('strike and blocking refresh on their own socket only, add no room_joined listener, and do not accumulate', async() => {
  const socket = fakeSocket(), other = fakeSocket();
  for (let cycle = 0; cycle < 3; cycle++) { // repeated reconnect registrations
    const cleanups = [registerWeaponStrikeHandlers({ socket }), registerBlockingHandlers({ socket })];
    expect(socket.listenerCount('room_joined')).toBe(0);
    expect(roomRejoinSubscriberCount()).toBe(2);
    requestActorEvent.mockClear();
    notifyRoomRejoined({ socket: other, roomId: 'r1' }); // another socket (prior session) notifies nothing
    await flush();
    expect(calls('actor_strike_list') + calls('actor_block_list')).toBe(0);
    notifyRoomRejoined({ socket, roomId: 'r1' });
    await flush();
    expect(calls('actor_strike_list')).toBe(1);
    expect(calls('actor_block_list')).toBe(1);
    expect(requestActorEvent.mock.calls.every(([name]) => /_list$|_view$/.test(name) || name === 'actor_blocking_view')).toBe(true); // reads only
    cleanups.forEach(fn => fn());
    expect(roomRejoinSubscriberCount()).toBe(0);
  }
});

test('a rejoin outside the registered principal, account generation or room refreshes nothing', async() => {
  const socket = fakeSocket();
  const cleanups = [registerWeaponStrikeHandlers({ socket }), registerBlockingHandlers({ socket })];
  currentActorDelivery.mockReturnValue(false); // fence: uid / generation / room object / room id changed
  notifyRoomRejoined({ socket, roomId: 'r-old' });
  await flush();
  expect(requestActorEvent).not.toHaveBeenCalled();
  cleanups.forEach(fn => fn());
});

describe('the single room_joined listener', () => {
  beforeAll(() => registerStore('gameStore', useGameStore)); // as initStoreRegistry does in the App
  const ctx = socket => {
    const noop = () => {};
    return { socket, setActualPlayerCount: noop, setConnectedPlayers: noop, setIsGM: noop, setPendingRoomData: noop, setIsRoomReady: noop,
      setConnectionStatus: noop, setLoadingStatusMessage: noop, currentRoomRef: { current: { id: 'r1' } }, currentPlayerRef: { current: { id: 'gm' } },
      pendingRoomDataRef: { current: null }, activeJoinIdRef: { current: 'r1' }, isAutoJoinSequenceRef: { current: false }, isGMRef: { current: true },
      useDeltaSyncTokensRef: { current: false }, addPartyMember: noop, updatePartyMember: noop, removePartyMember: noop, addUser: noop, removeUser: noop,
      addNotification: noop, showPlayerJoinNotification: noop, showPlayerLeaveNotification: noop, showGMDisconnectedNotification: noop,
      handleLeaveRoom: noop, navigate: noop };
  };
  test('a first admission starts the transition even without a lobby join attempt', () => {
    const socket = fakeSocket();
    const context = ctx(socket);
    context.currentRoomRef.current = null;
    context.activeJoinIdRef.current = null;
    context.startJoiningRoom = jest.fn();
    context.setIsRoomReady = jest.fn();
    context.setPendingRoomData = jest.fn();
    const cleanup = registerRoomLifecycleHandlers(context);
    socket.fire('room_joined', { room: { id: 'new-room', name: 'New Hall' }, player: { id: 'gm' }, isGM: true });
    expect(context.startJoiningRoom).toHaveBeenCalledTimes(1);
    expect(context.setIsRoomReady).toHaveBeenCalledWith(true);
    expect(context.setPendingRoomData).toHaveBeenCalledWith(expect.objectContaining({ room: expect.objectContaining({ id: 'new-room' }), isGM: true }));
    cleanup();
  });
  test('notifies once for a rejoin of the current room, never for another room, and stays the only listener', () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const socket = fakeSocket(), seen = [];
    useGameStore.setState({ multiplayerRoom: { id: 'r1' }, multiplayerSocket: socket });
    const off = onRoomRejoined(event => seen.push(event));
    const cleanup = registerRoomLifecycleHandlers(ctx(socket));
    expect(socket.listenerCount('room_joined')).toBe(1);
    socket.fire('room_joined', { room: { id: 'r1', players: [] }, playerCount: 1, isGM: true });
    socket.fire('room_joined', { room: { id: 'r-other', players: [] }, playerCount: 1, isGM: true });
    socket.fire('room_joined', { playerCount: 1 }); // no room payload
    expect(seen).toHaveLength(1);
    expect(seen[0]).toEqual({ socket, roomId: 'r1' });
    cleanup(); off();
    expect(socket.listenerCount('room_joined')).toBe(0);
  });
  test('the relay refuses a retired socket, a non-current socket and another room', () => {
    const socket = fakeSocket(), other = fakeSocket(), seen = [];
    const off = onRoomRejoined(event => seen.push(event));
    useGameStore.setState({ multiplayerRoom: { id: 'r1' }, multiplayerSocket: socket });
    expect(relayRoomRejoin(other, { room: { id: 'r1' } })).toBe(false); // a previous session's socket
    expect(relayRoomRejoin(socket, { room: { id: 'r2' } })).toBe(false); // another room
    expect(relayRoomRejoin(socket, { room: { persistentRoomId: 'r1' } })).toBe(true); // persistent id of the current room
    markSocketRetired(socket); // account handoff / principal retirement
    expect(relayRoomRejoin(socket, { room: { id: 'r1' } })).toBe(false);
    expect(seen).toHaveLength(1);
    off();
  });
  test('registerRoomJoinedListener keeps one listener per socket, runs the join handling first, and relays only a rejoin', () => {
    const socket = fakeSocket(), order = [];
    const off = onRoomRejoined(event => order.push(`relay:${event.roomId}`));
    useGameStore.setState({ multiplayerRoom: null, multiplayerSocket: socket });
    const first = registerRoomJoinedListener(socket, data => order.push(`join:${data.room.id}`));
    registerRoomJoinedListener(socket, data => order.push(`join2:${data.room.id}`)); // re-registration replaces
    expect(socket.listenerCount('room_joined')).toBe(1);
    socket.fire('room_joined', { room: { id: 'r1' } }); // first join: not yet in a room → no relay
    useGameStore.setState({ multiplayerRoom: { id: 'r1' } });
    socket.fire('room_joined', { room: { id: 'r1' } }); // rejoin of the current room
    socket.fire('room_joined', { room: { id: 'r9' } }); // another room
    expect(order).toEqual(['join2:r1', 'join2:r1', 'relay:r1', 'join2:r9']);
    first(); // a stale cleanup does not remove the newer listener
    expect(socket.listenerCount('room_joined')).toBe(1);
    markSocketRetired(socket);
    socket.fire('room_joined', { room: { id: 'r1' } });
    expect(order).toHaveLength(4); // retired: neither join handling nor relay
    off();
  });
});
