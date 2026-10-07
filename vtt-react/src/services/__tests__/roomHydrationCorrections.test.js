/**
 * Project 3 frozen-contract correction regressions (senior review B4/B5).
 * Real stores and real socket handlers; no network.
 */

import { applyRoomSnapshot, applyPersonalRoomState } from '../silentRoomHydration';
import { registerAudioGameSessionHandlers } from '../../components/multiplayer/socketHandlers/audioGameSessionHandlers';
import { registerGmHandlers } from '../../components/multiplayer/socketHandlers/gmHandlers';
import { handleJoinRoom } from '../../components/multiplayer/roomJoinHandler';

import C from '../../store/creatureStore';
import CT from '../../store/characterTokenStore';
import I from '../../store/gridItemStore';
import E from '../../store/levelEditorStore';
import G from '../../store/gameStore';
import M from '../../store/mapStore';
import B from '../../store/combatStore';
import CON from '../../store/containerStore';
import T from '../../store/travelStore';
import A from '../../store/audioStore';
import L from '../../store/interactiveMapStore';
import COND from '../../store/conditionStore';
import AUTH from '../../store/authStore';
import CHAR from '../../store/characterStore';

const map = (extra = {}) => ({
  id: 'default',
  name: 'Default',
  tokens: {},
  characterTokens: {},
  gridItems: {},
  terrainData: {},
  wallData: {},
  windowOverlays: {},
  environmentalObjects: [],
  drawingPaths: [],
  drawingLayers: [],
  fogOfWarData: {},
  fogOfWarPaths: [],
  fogErasePaths: [],
  exploredAreas: {},
  lightSources: {},
  dndElements: [],
  ...extra
});

const state = (extra = {}) => ({
  defaultMapId: 'default',
  maps: { default: map() },
  combat: { isActive: false, currentTurnIndex: null, turnOrder: [], round: 0 },
  ...extra
});

const applyRoom = (gameState, activeMapId = 'default') =>
  applyRoomSnapshot({ scope: 'room', gameState, activeMapId });

const flush = async() => {
  for (let index = 0; index < 20; index += 1) {await Promise.resolve();}
};

beforeEach(() => {
  jest.restoreAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  C.setState({ tokens: [], creatureTokens: [] });
  CT.setState({ characterTokens: [] });
  I.setState({ gridItems: [] });
  B.setState({ isInCombat: false, turnOrder: [], round: 1, currentTurnIndex: 0, combatLog: [], combatConfig: { showTimers: true }, combatTimeline: [] });
  E.setState({
    terrainData: {}, drawingPaths: [], wallData: {}, windowOverlays: {}, lightSources: {},
    environmentalObjects: [], dndElements: [], fogOfWarPaths: [], fogErasePaths: [],
    weatherEffects: { enabled: false, type: 'none' },
    sunSettings: { azimuth: 135, elevation: 45, intensity: 1 }
  });
  G.setState({
    backgrounds: [], activeBackgroundId: null, backgroundImage: null, backgroundImageUrl: '',
    activeSceneMode: 'tactical', activeLocationMapId: null, isFreeRoamAllowed: false,
    isInMultiplayer: true, multiplayerRoom: { id: 'review' }
  });
  CON.setState({ containers: [] });
  A.setState({ playingTracks: [] });
  T.setState({ hourLog: [], encounterLog: [], partyExhaustion: 0 });
  L.setState({ pins: [], partyMarker: null });
  COND.setState({ activeBuffs: [], activeDebuffs: [] });
});

test('B4.a: full snapshot clears stale optional domains and replaces sun settings', () => {
  CON.setState({ containers: [{ id: 'deleted' }] });
  T.setState({ hourLog: [{ id: 'stale' }], partyExhaustion: 5 });
  A.setState({ playingTracks: [{ trackId: 'stale' }] });
  L.setState({ pins: [{ mapId: 'deleted-scene', id: 'stale' }], partyMarker: { x: 9, y: 9 } });
  E.setState({ weatherEffects: { enabled: true, type: 'rain' }, sunSettings: { azimuth: 111, intensity: 1, deletedCustom: true } });
  G.setState({ backgrounds: [{ id: 'stale' }], activeBackgroundId: 'stale' });

  applyRoom(state({ maps: { default: map({ sunSettings: { azimuth: 0, intensity: 0 } }) } }));

  expect({
    containers: CON.getState().containers,
    travelLog: T.getState().hourLog,
    audio: A.getState().playingTracks,
    pins: L.getState().pins,
    backgrounds: G.getState().backgrounds,
    weatherEnabled: E.getState().weatherEffects.enabled,
    sun: E.getState().sunSettings
  }).toEqual({
    containers: [],
    travelLog: [],
    audio: [],
    pins: [],
    backgrounds: [],
    weatherEnabled: false,
    sun: { azimuth: 0, intensity: 0 }
  });
});

test('B4.b: partial buffs section preserves unrelated debuffs and scene mode', () => {
  COND.setState({ activeBuffs: [], activeDebuffs: [{ id: 'keep' }] });
  G.setState({ activeSceneMode: 'location', activeLocationMapId: 'scene', isFreeRoamAllowed: true });
  applyRoomSnapshot({ scope: 'section', sections: { global: { buffs: [{ id: 'new' }] } } });
  expect(COND.getState().activeDebuffs).toEqual([{ id: 'keep' }]);
  expect(G.getState().activeSceneMode).toBe('location');
});

test('B4.c: inactive combat restores stored round=0 with exact log and config', () => {
  B.setState({ isInCombat: true, turnOrder: [{ tokenId: 'old' }], round: 9, currentTurnIndex: 0, combatLog: [{ id: 'old' }], combatConfig: { showTimers: false, old: true } });
  applyRoom(state({
    combat: { isActive: false, currentTurnIndex: null, turnOrder: [], round: 0, combatLog: [], combatConfig: { showTimers: true } }
  }));
  expect({
    round: B.getState().round,
    log: B.getState().combatLog,
    config: B.getState().combatConfig,
    order: B.getState().turnOrder
  }).toEqual({ round: 0, log: [], config: { showTimers: true }, order: [] });
});

test('B5.a: complete map recovery clears deleted entities from the cached map record', () => {
  applyRoom(state({ maps: { default: map({ tokens: { X: { id: 'X', mapId: 'default' } } }) } }));
  const handlers = {};
  registerAudioGameSessionHandlers({
    socket: { on: (event, handler) => { handlers[event] = handler; }, off() {} },
    isGMRef: { current: true },
    currentPlayerRef: { current: { id: 'gm' } },
    addCreature: jest.fn(),
    updatePartyMember: jest.fn()
  });
  handlers.full_game_state_sync({ mapId: 'default', tokens: {}, characterTokens: {}, gridItems: {}, mapData: map(), combat: null });
  expect(C.getState().tokens).toEqual([]);
  expect(M.getState().maps.find((entry) => entry.id === 'default').tokens).toEqual({});
});

test('B5.b: map switch immediately after resume replaces destination objects and lights', async() => {
  jest.useFakeTimers();
  try {
    applyRoom(state({
      maps: {
        default: map({ environmentalObjects: [{ id: 'old-object' }], lightSources: { old: { id: 'old' } } }),
        B: { ...map(), id: 'B', name: 'B' }
      }
    }));
    const handlers = {};
    registerGmHandlers({
      socket: { on: (event, handler) => { handlers[event] = handler; }, off() {} },
      currentPlayerRef: { current: { id: 'viewer' } },
      addNotification: jest.fn(),
      addNotificationRef: { current: jest.fn() },
      setMapTransition: jest.fn(),
      isInitialMapLoadRef: { current: true },
      setPlayerCurrentMapId: jest.fn(),
      clearCreatureTokens: () => C.setState({ tokens: [], creatureTokens: [] }),
      clearCharacterTokens: () => CT.setState({ characterTokens: [] }),
      addCreature: jest.fn(),
      addToken: jest.fn(),
      showMapTransitions: false
    });
    handlers.player_map_changed({
      playerId: 'viewer',
      newMapId: 'B',
      newMapName: 'B',
      mapData: { ...map(), id: 'B', name: 'B', environmentalObjects: [], lightSources: {} }
    });
    jest.advanceTimersByTime(1);
    await flush();
    expect({
      objects: E.getState().environmentalObjects,
      lights: E.getState().lightSources,
      cached: M.getState().maps.find((entry) => entry.id === 'B')
    }).toEqual({ objects: [], lights: {}, cached: expect.objectContaining({ environmentalObjects: [], lightSources: {} }) });
  } finally {
    jest.useRealTimers();
  }
});

test('B5.c: real join pipeline leaves canonical map data and round zero intact after pending callbacks', async() => {
  AUTH.setState({ user: { uid: 'review-guest', isGuest: true } });
  jest.spyOn(E.getState(), 'applyTierFeatureFlags').mockResolvedValue(undefined);
  jest.spyOn(CHAR.getState(), 'syncWithMultiplayer').mockImplementation(() => {});
  const player = { id: 'gm', name: 'GM', currentMapId: 'default' };
  const socket = { id: 'socket', connected: false, emit: jest.fn(), on: jest.fn(), off: jest.fn() };
  const gameState = state({
    maps: { default: map({ terrainData: { accepted: 'grass' }, drawingPaths: [{ id: 'stored' }], opaque: { key: 'preserve' } }) },
    combat: { isActive: true, currentTurnIndex: 0, turnOrder: [{ tokenId: 't' }], round: 0 }
  });
  const room = { id: 'review', persistentRoomId: 'review', gm: player, players: [], gameState };
  const callbacks = {
    socket,
    currentPlayerRef: { current: player },
    addNotificationRef: { current: jest.fn() },
    roomPasswordRef: { current: '' },
    getActiveCharacter: () => null,
    loadActiveCharacter: async() => null,
    clearAllMultiplayerStores: () => {},
    setCurrentRoom: jest.fn()
  };
  const ctx = new Proxy(callbacks, { get: (target, key) => (key in target ? target[key] : jest.fn()) });

  await handleJoinRoom(room, socket, true, player, '', undefined, undefined, true, ctx);
  await flush();

  expect(callbacks.setCurrentRoom).toHaveBeenCalled();
  expect({
    terrain: M.getState().maps[0].terrainData,
    opaque: M.getState().maps[0].opaque,
    round: B.getState().round
  }).toEqual({ terrain: { accepted: 'grass' }, opaque: { key: 'preserve' }, round: 0 });
});

test('B4.e: full snapshot omitting sunSettings resets previous-room sun to the documented default', () => {
  E.setState({ sunSettings: { azimuth: 777, previousRoomOnly: true } });
  const snapshot = state();
  applyRoom(snapshot);
  expect(E.getState().sunSettings).toEqual({ azimuth: 135, elevation: 45, color: '#fff4e0', intensity: 1.0, ambient: 0.2 });
  applyRoom(snapshot);
  expect(E.getState().sunSettings).toEqual({ azimuth: 135, elevation: 45, color: '#fff4e0', intensity: 1.0, ambient: 0.2 });
});

test('B4.f: present combat:null through full_game_state_sync clears combat and preserves maps', () => {
  applyRoom(state({ combat: { isActive: true, turnOrder: [{ tokenId: 't' }], currentTurnIndex: 0, round: 0 } }));
  const maps = JSON.stringify(M.getState().maps);
  const handlers = {};
  registerAudioGameSessionHandlers({
    socket: { on: (event, handler) => { handlers[event] = handler; }, off() {} },
    isGMRef: { current: true },
    currentPlayerRef: { current: { id: 'gm' } },
    addCreature: jest.fn(),
    updatePartyMember: jest.fn()
  });
  handlers.full_game_state_sync({ combat: null });
  expect(B.getState().isInCombat).toBe(false);
  expect(B.getState().turnOrder).toEqual([]);
  expect(JSON.stringify(M.getState().maps)).toBe(maps);
});

test('B4.g: partial payload without a combat key preserves combat', () => {
  applyRoom(state({ combat: { isActive: true, turnOrder: [{ tokenId: 't' }], currentTurnIndex: 0, round: 0 } }));
  applyRoomSnapshot({ scope: 'section', sections: { global: { buffs: [] } } });
  expect(B.getState().isInCombat).toBe(true);
  expect(B.getState().turnOrder).toEqual([{ tokenId: 't' }]);
});

test('B5.e: complete destination map change replaces cached entities so loadMapState cannot resurrect', async() => {
  jest.useFakeTimers();
  try {
    applyRoom(state({
      maps: {
        default: map(),
        B: map({ id: 'B', name: 'B', tokens: { Y: { id: 'Y', mapId: 'B', creatureId: 'old', position: { x: 0, y: 0 } } }, environmentalObjects: [{ id: 'old-object' }], lightSources: { old: { id: 'old' } } })
      }
    }));
    const handlers = {};
    registerGmHandlers({
      socket: { on: (event, handler) => { handlers[event] = handler; }, off() {} },
      currentPlayerRef: { current: { id: 'viewer' } },
      addNotification: jest.fn(),
      addNotificationRef: { current: jest.fn() },
      setMapTransition: jest.fn(),
      isInitialMapLoadRef: { current: true },
      setPlayerCurrentMapId: jest.fn(),
      clearCreatureTokens: () => C.setState({ tokens: [], creatureTokens: [] }),
      clearCharacterTokens: () => CT.setState({ characterTokens: [] }),
      addCreature: jest.fn(),
      addToken: jest.fn(),
      showMapTransitions: false
    });
    handlers.player_map_changed({
      playerId: 'viewer',
      newMapId: 'B',
      newMapName: 'B',
      mapData: { ...map(), id: 'B', name: 'B', tokens: {}, characterTokens: {}, gridItems: {}, environmentalObjects: [], lightSources: {} }
    });
    jest.advanceTimersByTime(1);
    await flush();
    jest.advanceTimersByTime(301);
    await flush();

    const cached = M.getState().maps.find((entry) => entry.id === 'B');
    expect(C.getState().tokens).toEqual([]);
    expect(cached.tokens).toEqual({});
    expect(cached.characterTokens).toEqual({});
    expect(cached.gridItems).toEqual({});
    expect(cached.environmentalObjects).toEqual([]);
    expect(cached.lightSources).toEqual({});

    const loaded = await M.getState().loadMapState('B');
    expect(loaded.tokens).toEqual([]);
    expect(loaded.environmentalObjects).toEqual([]);
    // loadMapState does not surface lights; the cached record is the only
    // resurrection path for them and it was replaced above.
    expect(cached.lightSources).toEqual({});
  } finally {
    jest.useRealTimers();
  }
});

test('B5.d: personal room payload cannot clobber shared state without camera opt-in (control)', () => {
  applyRoom(state({ maps: { default: map({ tokens: { X: { id: 'X' } } }) } }));
  const before = JSON.stringify(C.getState().tokens);
  applyPersonalRoomState({
    tokens: [],
    combat: { isActive: true },
    levelEditor: { terrainData: { stale: 'bad' } },
    mapData: { cameraX: 1, cameraY: 2, zoomLevel: 3 }
  });
  expect(JSON.stringify(C.getState().tokens)).toBe(before);
  expect(E.getState().terrainData).toEqual({});
});
