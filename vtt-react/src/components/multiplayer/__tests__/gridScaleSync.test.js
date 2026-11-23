// GM grid scale (feet per square): every client measures area previews with the scale the server resolves with.
import useGameStore from '../../../store/gameStore';
import useSettingsStore from '../../../store/settingsStore';
import { applyRoomFeetPerTile, DEFAULT_FEET_PER_TILE, resetScaleBroadcastsForTests, noteRoomScaleSnapshot } from '../roomJoinHandler';
import { registerConditionHandlers } from '../socketHandlers/conditionHandlers';
import { registerRoomLifecycleHandlers } from '../socketHandlers/roomLifecycleHandlers';

const fakeSocket = () => {
  const handlers = {}; const emit = jest.fn();
  return { id: 's1', emit, on: (event, fn) => { (handlers[event] ||= []).push(fn); }, off: (event, fn) => { handlers[event] = fn ? (handlers[event] || []).filter(f => f !== fn) : []; },
    fire: (event, data) => (handlers[event] || []).forEach(fn => fn(data)), handlers };
};
const lifecycleCtx = (socket, roomId) => {
  const noop = () => {};
  return { socket, setActualPlayerCount: noop, setConnectedPlayers: noop, setIsGM: noop, setPendingRoomData: noop, setIsRoomReady: noop,
    setConnectionStatus: noop, setLoadingStatusMessage: noop, currentRoomRef: { current: { id: roomId } }, currentPlayerRef: { current: { id: 'p' } },
    pendingRoomDataRef: { current: null }, activeJoinIdRef: { current: roomId }, isAutoJoinSequenceRef: { current: false }, isGMRef: { current: false },
    useDeltaSyncTokensRef: { current: false }, addPartyMember: noop, updatePartyMember: noop, removePartyMember: noop, addUser: noop, removeUser: noop,
    addNotification: noop, showPlayerJoinNotification: noop, showPlayerLeaveNotification: noop, showGMDisconnectedNotification: noop,
    handleLeaveRoom: noop, navigate: noop };
};
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

beforeEach(() => {
  resetScaleBroadcastsForTests();
  useGameStore.getState().setFeetPerTile(5);
  useSettingsStore.getState().setFeetPerTile(5);
});

test('a configured room scale is adopted by players and by the GM (Settings slider included)', () => {
  const socket = fakeSocket();
  useGameStore.getState().setFeetPerTile(15); // left over from another room
  expect(applyRoomFeetPerTile({ id: 'r', gameState: { feetPerTile: 10 } }, { isGameMaster: false, socket })).toBe(10);
  expect(useGameStore.getState().feetPerTile).toBe(10);
  expect(useSettingsStore.getState().feetPerTile).toBe(10);
  expect(applyRoomFeetPerTile({ id: 'r', gameState: { feetPerTile: 10 } }, { isGameMaster: true, socket })).toBe(10);
  expect(socket.emit).not.toHaveBeenCalled();
});

test('no configured scale: a player uses the server default; the GM makes their own Settings value the room scale', () => {
  const socket = fakeSocket();
  useGameStore.getState().setFeetPerTile(15);
  expect(applyRoomFeetPerTile({ id: 'r', gameState: {} }, { isGameMaster: false, socket })).toBe(DEFAULT_FEET_PER_TILE);
  expect(useGameStore.getState().feetPerTile).toBe(5);
  expect(socket.emit).not.toHaveBeenCalled();

  useSettingsStore.getState().setFeetPerTile(10);
  expect(applyRoomFeetPerTile({ id: 'r', gameState: {} }, { isGameMaster: true, socket })).toBe(10);
  expect(useGameStore.getState().feetPerTile).toBe(10);
  expect(socket.emit).toHaveBeenCalledWith('sync_gameplay_settings', { feetPerTile: 10, roomId: 'r' });
});

test('an out-of-range stored room scale is not adopted', () => {
  for (const bad of [0, 25, '10', NaN, null]) {
    useGameStore.getState().setFeetPerTile(5);
    expect(applyRoomFeetPerTile({ id: 'r', gameState: { feetPerTile: bad } }, { isGameMaster: false })).toBe(5);
    expect(useGameStore.getState().feetPerTile).toBe(5);
  }
});

test('the gameplay_settings_updated broadcast (server shape: settings plus top-level feetPerTile) updates the measuring store', async () => {
  const socket = fakeSocket();
  expect(useGameStore.getState().isGMMode).toBe(true); // store default while a player is still joining
  registerConditionHandlers({ socket, addNotification: jest.fn(), currentPlayerRef: { current: null }, currentPlayer: null });
  socket.fire('gameplay_settings_updated', { settings: { feetPerTile: 10 }, feetPerTile: 10 });
  for (let i = 0; i < 5 && useGameStore.getState().feetPerTile !== 10; i++) await flush();
  expect(useGameStore.getState().feetPerTile).toBe(10);
  expect(useSettingsStore.getState().feetPerTile).toBe(10);
});

test('the sending socket ignores the echo of its own scale; other sockets adopt it whatever their GM flag says', async () => {
  const gmSocket = fakeSocket(); gmSocket.id = 'gm-socket';
  registerConditionHandlers({ socket: gmSocket, addNotification: jest.fn(), currentPlayerRef: { current: null }, currentPlayer: null });
  useGameStore.getState().setFeetPerTile(12);
  gmSocket.fire('gameplay_settings_updated', { settings: { feetPerTile: 9 }, feetPerTile: 9, feetPerTileRevision: 4, roomId: 'r1', sourceSocketId: 'gm-socket' });
  for (let i = 0; i < 5; i++) await flush();
  expect(useGameStore.getState().feetPerTile).toBe(12);

  // A joining player still carries the store default isGMMode: true; the broadcast must still reach it.
  expect(useGameStore.getState().isGMMode).toBe(true);
  const playerSocket = fakeSocket(); playerSocket.id = 'player-socket';
  registerConditionHandlers({ socket: playerSocket, addNotification: jest.fn(), currentPlayerRef: { current: null }, currentPlayer: null });
  playerSocket.fire('gameplay_settings_updated', { settings: { feetPerTile: 9 }, feetPerTile: 9, feetPerTileRevision: 5, roomId: 'r1', sourceSocketId: 'gm-socket' });
  for (let i = 0; i < 5 && useGameStore.getState().feetPerTile !== 9; i++) await flush();
  expect(useGameStore.getState().feetPerTile).toBe(9);
});

test('a room snapshot older than a broadcast already seen cannot roll the scale back, and an older broadcast cannot either', async () => {
  const socket = fakeSocket(); socket.id = 'player-socket';
  registerConditionHandlers({ socket, addNotification: jest.fn(), currentPlayerRef: { current: null }, currentPlayer: null });
  // Joining: the GM changes 10 -> 15 (revision 3) while the room_joined snapshot (revision 2, 10 ft) is still being applied.
  socket.fire('gameplay_settings_updated', { settings: {}, feetPerTile: 15, feetPerTileRevision: 3, roomId: 'r1', sourceSocketId: 'gm' });
  for (let i = 0; i < 5 && useGameStore.getState().feetPerTile !== 15; i++) await flush();
  expect(applyRoomFeetPerTile({ id: 'r1', gameState: { feetPerTile: 10, feetPerTileRevision: 2 } })).toBe(15);
  expect(useGameStore.getState().feetPerTile).toBe(15);
  // A newer snapshot wins and is remembered; a late older broadcast is ignored.
  expect(applyRoomFeetPerTile({ id: 'r1', gameState: { feetPerTile: 20, feetPerTileRevision: 6 } })).toBe(20);
  socket.fire('gameplay_settings_updated', { settings: {}, feetPerTile: 8, feetPerTileRevision: 5, roomId: 'r1', sourceSocketId: 'gm' });
  for (let i = 0; i < 5; i++) await flush();
  expect(useGameStore.getState().feetPerTile).toBe(20);
});

test('a reconnect into the same room adopts a scale the GM changed while this client was away; another room is ignored', () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  const socket = fakeSocket();
  const cleanup = registerRoomLifecycleHandlers(lifecycleCtx(socket, 'r1'));
  useGameStore.getState().setFeetPerTile(5);
  socket.fire('room_joined', { room: { id: 'r-other', players: [], gameState: { feetPerTile: 15 } }, playerCount: 1, isGM: false });
  expect(useGameStore.getState().feetPerTile).toBe(5);
  socket.fire('room_joined', { room: { id: 'r1', players: [], gameState: { feetPerTile: 10 } }, playerCount: 1, isGM: false });
  expect(useGameStore.getState().feetPerTile).toBe(10);
  expect(useSettingsStore.getState().feetPerTile).toBe(10);
  cleanup?.();
});

test('a reconnect snapshot resets the remembered revision, so a server revision that went down cannot pin an old scale', async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  const socket = fakeSocket(); socket.id = 'player-socket';
  registerConditionHandlers({ socket, addNotification: jest.fn(), currentPlayerRef: { current: null }, currentPlayer: null });
  const cleanup = registerRoomLifecycleHandlers(lifecycleCtx(socket, 'r1'));
  socket.fire('gameplay_settings_updated', { settings: {}, feetPerTile: 15, feetPerTileRevision: 5, roomId: 'r1', sourceSocketId: 'gm' });
  for (let i = 0; i < 5 && useGameStore.getState().feetPerTile !== 15; i++) await flush();
  expect(useGameStore.getState().feetPerTile).toBe(15);
  // The room was restored from an older checkpoint: revision 3 at 10 ft.
  socket.fire('room_joined', { room: { id: 'r1', players: [], gameState: { feetPerTile: 10, feetPerTileRevision: 3 } }, playerCount: 1, isGM: false });
  expect(useGameStore.getState().feetPerTile).toBe(10);
  socket.fire('gameplay_settings_updated', { settings: {}, feetPerTile: 20, feetPerTileRevision: 4, roomId: 'r1', sourceSocketId: 'gm' });
  for (let i = 0; i < 5 && useGameStore.getState().feetPerTile !== 20; i++) await flush();
  expect(useGameStore.getState().feetPerTile).toBe(20);
  cleanup?.();
});

test('the first scale set while a player is still joining a room without one is not rolled back to the default', async () => {
  const socket = fakeSocket(); socket.id = 'player-socket';
  registerConditionHandlers({ socket, addNotification: jest.fn(), currentPlayerRef: { current: null }, currentPlayer: null });
  noteRoomScaleSnapshot({ id: 'r1', gameState: {} }); // room_joined: no scale yet
  socket.fire('gameplay_settings_updated', { settings: {}, feetPerTile: 10, feetPerTileRevision: 1, roomId: 'r1', sourceSocketId: 'gm' });
  for (let i = 0; i < 5 && useGameStore.getState().feetPerTile !== 10; i++) await flush();
  expect(applyRoomFeetPerTile({ id: 'r1', gameState: {} }, { isGameMaster: false, socket })).toBe(10);
  expect(useGameStore.getState().feetPerTile).toBe(10);
  expect(socket.emit).not.toHaveBeenCalled();
});
