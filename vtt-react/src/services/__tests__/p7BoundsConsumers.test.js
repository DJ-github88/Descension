import { registerTokenHandlers } from '../../components/multiplayer/socketHandlers/tokenHandlers';
import { registerCharacterHandlers } from '../../components/multiplayer/socketHandlers/characterHandlers';
import { applyRoomSnapshot } from '../silentRoomHydration';
import { registerStore } from '../../store/storeRegistry';
import { whenHandoffIdle } from '../../persistence/handoff/accountHandoffCoordinator';
import G from '../../store/gameStore';
import AUTH from '../../store/authStore';
import CHAR from '../../store/characterStore';
import C from '../../store/creatureStore';
import CT from '../../store/characterTokenStore';
import M from '../../store/mapStore';
import COND from '../../store/conditionStore';
import PARTY from '../../store/partyStore';
import COMBAT from '../../store/combatStore';
let ordinal = 0;
let socket, handlers, roomId;
const snapshot = (cut, max, revision) => {
  const actorProjection = { version: 1, roomId, epoch: 'bounds-runtime', cut };
  const contract = { version: 1, roomId, mapId: 'default', tokenId: 'creature', instanceId: 'same', kind: 'creature', revision };
  return { roomId, actorProjection, maps: { default: { id: 'default', actorProjection, tokens: {
    creature: { id: 'creature', ownerUserId: 'bounds-owner', state: { actorContract: contract, maxHp: max, maxMana: 30, maxAP: 5, currentHp: 40, currentMana: 20, currentActionPoints: 3, tempHealth: 6, tempMana: 2, tempActionPoints: 1, conditions: [] } }
  }, creatures: {}, characterTokens: {} } } };
};
beforeEach(async() => {
  for (const [name, store] of [['gameStore', G], ['authStore', AUTH], ['characterStore', CHAR], ['creatureStore', C], ['characterTokenStore', CT], ['mapStore', M], ['conditionStore', COND], ['partyStore', PARTY], ['combatStore', COMBAT]]) registerStore(name, store);
  AUTH.setState({ user: { uid: 'bounds-owner' } }); await whenHandoffIdle();
  handlers = {}; socket = { id: 'bounds-sender', connected: true, on: (name, handler) => { handlers[name] = handler; }, off() {}, emit: jest.fn() };
  roomId = `bounds-consumer-${ordinal++}`;
  G.setState({ isInMultiplayer: true, multiplayerRoom: { id: roomId }, multiplayerSocket: socket, actorProjectionRecoveryCandidates: [] });
  C.setState({ tokens: [], creatureTokens: [] }); CT.setState({ characterTokens: [] }); M.setState({ maps: [], currentMapId: 'default' });
  COND.setState({ activeBuffs: [], activeDebuffs: [] }); PARTY.setState({ partyMembers: [] }); COMBAT.setState({ turnOrder: [] });
  const initial = snapshot(1, 50, 0);
  expect(applyRoomSnapshot({ scope: 'room', roomId, gameState: initial, actorProjection: initial.actorProjection, correlated: true }).applied).toBe(true);
  registerTokenHandlers({ socket, useDeltaSyncTokensRef: { current: true } });
  registerCharacterHandlers({ socket });
});
test.each(['token_updated', 'creature_updated', 'character_token_updated', 'character_updated'])('%s admits bounds snapshot even for sender/delta mode, refuses older cuts and retired socket callbacks', event => {
  const update = { roomId, updatedBy: socket.id, actorSnapshot: snapshot(2, 60, 1) };
  handlers[event](update);
  expect(C.getState().creatureTokens[0].state).toMatchObject({ maxHp: 60, currentHp: 40, tempHealth: 6, actorContract: { revision: 1 } });
  // Disable outbound refresh for the negative controls; hydration itself stays silent.
  socket.emit.mockClear();
  handlers[event]({ roomId, actorSnapshot: snapshot(1, 50, 0) });
  expect(C.getState().creatureTokens[0].state.maxHp).toBe(60);
  expect(G.getState().actorProjectionRecoveryCandidates[0].reason).toBe('actor_projection_stale');
  G.setState({ multiplayerSocket: { id: 'replacement', connected: true, emit: jest.fn() } });
  handlers[event]({ roomId, actorSnapshot: snapshot(3, 90, 2) });
  expect(C.getState().creatureTokens[0].state.maxHp).toBe(60);
});
