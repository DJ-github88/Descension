/**
 * Project 3 — silent hydration adapter tests (frozen domains 11–17, 20, 37).
 */

import { applyRoomSnapshot, applyPersonalRoomState, normalizeRoomSnapshot } from '../silentRoomHydration';

import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useGridItemStore from '../../store/gridItemStore';
import useCombatStore from '../../store/combatStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import useConditionStore from '../../store/conditionStore';
import useMapStore from '../../store/mapStore';

const EMPTY_EDITOR = {
  terrainData: {},
  environmentalObjects: [],
  wallData: {},
  dndElements: [],
  fogOfWarData: {},
  fogOfWarPaths: [],
  fogErasePaths: [],
  exploredAreas: {},
  drawingPaths: [],
  lightSources: {},
  elevationData: {},
  rampData: {}
};

const resetStores = () => {
  useCreatureStore.setState({ creatureTokens: [], tokens: [] });
  useCharacterTokenStore.setState({ characterTokens: [] });
  useGridItemStore.setState({ gridItems: [] });
  useLevelEditorStore.setState({ ...EMPTY_EDITOR });
  useCombatStore.setState({
    isInCombat: false,
    turnOrder: [],
    currentTurnIndex: 0,
    round: 1,
    combatLog: [],
    combatTimeline: [],
    turnTimers: new Map()
  });
  useGameStore.setState({ backgrounds: [], activeBackgroundId: null, backgroundColor: undefined });
  useConditionStore.setState({ activeBuffs: [], activeDebuffs: [] });
};

const map = (id, extra = {}) => ({
  id,
  name: id,
  tokens: {},
  characterTokens: {},
  gridItems: {},
  terrainData: {},
  wallData: {},
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

const snapshot = ({ maps, global = {} }) => ({
  global: { defaultMapId: 'default', combat: null, ...global },
  maps,
  mapIds: Object.keys(maps).sort()
});

const gameStateFrom = (snap) => ({
  ...snap.global,
  maps: snap.maps,
  tokens: {},
  characterTokens: {},
  gridItems: {}
});

const captureOwned = () => ({
  creatureTokens: useCreatureStore.getState().creatureTokens,
  tokensAlias: useCreatureStore.getState().tokens,
  characterTokens: useCharacterTokenStore.getState().characterTokens,
  gridItems: useGridItemStore.getState().gridItems,
  terrainData: useLevelEditorStore.getState().terrainData,
  drawingPaths: useLevelEditorStore.getState().drawingPaths,
  fogOfWarData: useLevelEditorStore.getState().fogOfWarData,
  fogOfWarPaths: useLevelEditorStore.getState().fogOfWarPaths,
  fogErasePaths: useLevelEditorStore.getState().fogErasePaths,
  dndElements: useLevelEditorStore.getState().dndElements,
  environmentalObjects: useLevelEditorStore.getState().environmentalObjects,
  combat: {
    isInCombat: useCombatStore.getState().isInCombat,
    turnOrder: useCombatStore.getState().turnOrder,
    currentTurnIndex: useCombatStore.getState().currentTurnIndex,
    round: useCombatStore.getState().round
  },
  mapIds: (useMapStore.getState().maps || []).map((entry) => entry.id)
});

describe('silentRoomHydration', () => {
  beforeEach(() => {
    resetStores();
    jest.restoreAllMocks();
  });

  test('11: hydrating the same checkpoint 1/2/10 times is structurally identical', () => {
    const snap = snapshot({
      maps: {
        default: map('default', {
          tokens: { t1: { id: 't1', mapId: 'default', state: { hp: 5 } } },
          characterTokens: { c1: { id: 'c1', playerId: 'p1', mapId: 'default' } },
          gridItems: { g1: { id: 'g1', mapId: 'default', shape: { cells: [[true]] } } },
          terrainData: { '1,1': 'grass' },
          drawingPaths: [{ id: 'stroke', points: [[0, 0], [1, 1]] }],
          fogOfWarData: { '1,1': true },
          fogOfWarPaths: [{ id: 'fog' }],
          environmentalObjects: [{ id: 'obj' }],
          customUnknown: { nested: [1, 2, 3] }
        })
      },
      global: { combat: { isActive: true, turnOrder: [{ tokenId: 't1' }], currentTurnIndex: 0, round: 2 } }
    });

    applyRoomSnapshot({ gameState: gameStateFrom(snap), scope: 'room' });
    const first = captureOwned();
    for (let index = 0; index < 9; index += 1) {
      applyRoomSnapshot({ gameState: gameStateFrom(snap), scope: 'room' });
    }
    const tenth = captureOwned();
    expect(JSON.parse(JSON.stringify(tenth))).toEqual(JSON.parse(JSON.stringify(first)));
    expect(useCreatureStore.getState().tokens).toBe(useCreatureStore.getState().creatureTokens);
    expect(useMapStore.getState().maps.find((entry) => entry.id === 'default').customUnknown)
      .toEqual({ nested: [1, 2, 3] });
  });

  test('12/13: drawings and fog paths replace (no append/dedupe) and empty clears', () => {
    const twoStrokes = JSON.parse(JSON.stringify([{ id: 'dup', points: [[0, 0]] }, { id: 'dup', points: [[0, 0]] }]));
    const first = snapshot({
      maps: { default: map('default', { drawingPaths: twoStrokes, fogOfWarPaths: [{ id: 'f1' }], fogErasePaths: [{ id: 'e1' }] }) }
    });
    applyRoomSnapshot({ gameState: gameStateFrom(first), scope: 'room' });
    applyRoomSnapshot({ gameState: gameStateFrom(first), scope: 'room' });
    expect(useLevelEditorStore.getState().drawingPaths).toHaveLength(2);
    expect(useLevelEditorStore.getState().fogOfWarPaths).toHaveLength(1);
    expect(useLevelEditorStore.getState().fogErasePaths).toHaveLength(1);

    const more = snapshot({
      maps: { default: map('default', { drawingPaths: twoStrokes, fogOfWarPaths: [{ id: 'f1' }, { id: 'f2' }], fogErasePaths: [{ id: 'e1' }] }) }
    });
    applyRoomSnapshot({ gameState: gameStateFrom(more), scope: 'room' });
    expect(useLevelEditorStore.getState().fogOfWarPaths).toHaveLength(2);
    expect(useLevelEditorStore.getState().drawingPaths).toHaveLength(2);

    const cleared = snapshot({ maps: { default: map('default', { drawingPaths: [], fogOfWarPaths: [], fogErasePaths: [] }) } });
    applyRoomSnapshot({ gameState: gameStateFrom(cleared), scope: 'room' });
    expect(useLevelEditorStore.getState().drawingPaths).toHaveLength(0);
    expect(useLevelEditorStore.getState().fogOfWarPaths).toHaveLength(0);
    expect(useLevelEditorStore.getState().fogErasePaths).toHaveLength(0);
  });

  test('14/15: deleted tokens and maps stay deleted across hydrations and section applies', () => {
    const withEverything = snapshot({
      maps: {
        default: map('default', {
          tokens: { t1: { id: 't1', mapId: 'default' } },
          gridItems: { g1: { id: 'g1', mapId: 'default' } },
          environmentalObjects: [{ id: 'obj' }]
        }),
        'map-b': map('map-b', { tokens: { t2: { id: 't2', mapId: 'map-b' } } })
      }
    });
    applyRoomSnapshot({ gameState: gameStateFrom(withEverything), scope: 'room' });
    expect(useCreatureStore.getState().tokens.map((token) => token.id).sort()).toEqual(['t1', 't2']);

    const afterDeletions = snapshot({
      maps: { default: map('default', { tokens: {}, gridItems: {}, environmentalObjects: [] }) }
    });
    applyRoomSnapshot({ gameState: gameStateFrom(afterDeletions), scope: 'room' });
    applyRoomSnapshot({ gameState: gameStateFrom(afterDeletions), scope: 'room' });
    expect(useCreatureStore.getState().tokens).toEqual([]);
    expect(useGridItemStore.getState().gridItems).toEqual([]);
    expect(useLevelEditorStore.getState().environmentalObjects).toEqual([]);
    expect(useMapStore.getState().maps.map((entry) => entry.id)).toEqual(['default']);
  });

  test('16: optional fields and nested arrays survive adapter normalization', () => {
    const normalized = normalizeRoomSnapshot({
      customGlobal: { nested: [1, [2, 3]] },
      maps: {
        default: map('default', { unknownMapField: { list: [{ a: [true] }] }, gridItems: { g1: { id: 'g1', shape: { cells: [[true, false]] } } } })
      },
      tokens: {},
      characterTokens: {},
      gridItems: {}
    });
    expect(normalized.global.customGlobal).toEqual({ nested: [1, [2, 3]] });
    expect(normalized.maps.default.unknownMapField).toEqual({ list: [{ a: [true] }] });
  });

  test('17: combat hydration is silent: no startCombat/nextTurn/RNG and stored zero values survive', () => {
    const startSpy = jest.spyOn(useCombatStore.getState(), 'startCombat');
    const nextSpy = jest.spyOn(useCombatStore.getState(), 'nextTurn');
    const randomSpy = jest.spyOn(Math, 'random');

    const active = snapshot({
      maps: { default: map('default') },
      global: { combat: { isActive: true, turnOrder: [{ tokenId: 'a' }, { tokenId: 'b' }, { tokenId: 'c' }], currentTurnIndex: 2, round: 0 } }
    });
    applyRoomSnapshot({ gameState: gameStateFrom(active), scope: 'room' });
    expect(useCombatStore.getState().isInCombat).toBe(true);
    expect(useCombatStore.getState().turnOrder).toHaveLength(3);
    expect(useCombatStore.getState().currentTurnIndex).toBe(2);
    expect(useCombatStore.getState().round).toBe(0);
    expect(startSpy).not.toHaveBeenCalled();
    expect(nextSpy).not.toHaveBeenCalled();
    expect(randomSpy).not.toHaveBeenCalled();

    const inactive = snapshot({ maps: { default: map('default') }, global: { combat: null } });
    applyRoomSnapshot({ gameState: gameStateFrom(inactive), scope: 'room' });
    applyRoomSnapshot({ gameState: gameStateFrom(inactive), scope: 'room' });
    expect(useCombatStore.getState().isInCombat).toBe(false);
    expect(useCombatStore.getState().turnOrder).toEqual([]);
    expect(startSpy).not.toHaveBeenCalled();
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('20: personal room state cannot restore shared domains; camera allowlist is explicit', () => {
    const personal = {
      characterTokens: [{ id: 'stale-character-token' }],
      creatureTokens: [{ id: 'stale-creature-token' }],
      gridItems: [{ id: 'stale-item' }],
      combat: { isActive: true, turnOrder: [{ tokenId: 'stale' }], round: 9 },
      levelEditor: { terrainData: { '9,9': 'stale' }, drawingPaths: [{ id: 'stale' }] },
      buffsAndDebuffs: { buffs: [{ id: 'stale-buff' }], debuffs: [] },
      chatHistory: { party: [{ id: 'stale-chat' }] },
      environmentalObjects: [{ id: 'stale-object' }],
      mapData: { cameraX: 120, cameraY: 80, zoomLevel: 2 }
    };

    const denied = applyPersonalRoomState(personal);
    expect(denied.applied).toBe(false);
    expect(useCreatureStore.getState().tokens).toEqual([]);
    expect(useCharacterTokenStore.getState().characterTokens).toEqual([]);
    expect(useCombatStore.getState().isInCombat).toBe(false);
    expect(useLevelEditorStore.getState().terrainData).toEqual({});

    const allowed = applyPersonalRoomState(personal, { allowCamera: true });
    expect(allowed.applied).toBe(true);
    expect(allowed.fields.sort()).toEqual(['cameraX', 'cameraY', 'zoomLevel']);
    expect(useGameStore.getState().cameraX).toBe(120);
    expect(useGameStore.getState().cameraY).toBe(80);
    expect(useGameStore.getState().zoomLevel).toBe(2);
    expect(useCombatStore.getState().isInCombat).toBe(false);
    expect(useLevelEditorStore.getState().terrainData).toEqual({});
  });

  test('37: hydration sets and restores the receiving barrier around store writes', () => {
    const observed = [];
    const unsubscribe = useLevelEditorStore.subscribe((state, prev) => {
      if (state.terrainData !== prev.terrainData) {
        observed.push({
          during: window._isReceivingMapUpdate,
          terrain: state.terrainData
        });
      }
    });

    const previous = window._isReceivingMapUpdate;
    const snap = snapshot({ maps: { default: map('default', { terrainData: { '3,3': 'stone' } }) } });
    applyRoomSnapshot({ gameState: gameStateFrom(snap), scope: 'room' });
    unsubscribe();

    expect(observed.length).toBeGreaterThan(0);
    expect(observed.every((entry) => entry.during === true)).toBe(true);
    expect(window._isReceivingMapUpdate).toBe(previous);

    // A repeat with identical data produces no terrain write at all.
    const writes = observed.length;
    applyRoomSnapshot({ gameState: gameStateFrom(snap), scope: 'room' });
    expect(observed.length).toBe(writes);
  });

  test('partial sections replace only their named collection and preserve unrelated domains', () => {
    const full = snapshot({
      maps: { default: map('default', { tokens: { keep: { id: 'keep', mapId: 'default' } }, dndElements: [{ id: 'obj' }] }) }
    });
    applyRoomSnapshot({ gameState: gameStateFrom(full), scope: 'room' });

    applyRoomSnapshot({
      scope: 'section',
      activeMapId: 'default',
      sections: { combat: { isActive: true, turnOrder: [{ tokenId: 'x' }], currentTurnIndex: 0, round: 1 } }
    });
    expect(useCreatureStore.getState().tokens).toHaveLength(1);
    expect(useLevelEditorStore.getState().dndElements).toHaveLength(1);
    expect(useCombatStore.getState().isInCombat).toBe(true);

    applyRoomSnapshot({
      scope: 'section',
      activeMapId: 'default',
      sections: { tokens: {} }
    });
    expect(useCreatureStore.getState().tokens).toEqual([]);
    expect(useLevelEditorStore.getState().dndElements).toHaveLength(1);
  });
});
