/**
 * Project 3 silent room snapshot adapter.
 *
 * One bounded boundary for applying a server-selected complete or section
 * snapshot to client stores: replacement semantics, no gameplay calls, no RNG,
 * no resource changes, no outbound sync. Hydrating the same snapshot once or
 * ten times yields the same snapshot-owned data.
 */

import useCreatureStore from '../store/creatureStore';
import useCharacterTokenStore from '../store/characterTokenStore';
import useGridItemStore from '../store/gridItemStore';
import useCombatStore from '../store/combatStore';
import useLevelEditorStore from '../store/levelEditorStore';
import useGameStore from '../store/gameStore';
import useConditionStore from '../store/conditionStore';
import useContainerStore from '../store/containerStore';
import useTravelStore from '../store/travelStore';
import useMapStore from '../store/mapStore';

export const ROOT_ENTITY_MIRRORS = ['tokens', 'characterTokens', 'gridItems'];

const isPlainRecord = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value instanceof Date) { return false; }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const asArray = (value) => {
  if (Array.isArray(value)) { return value; }
  if (isPlainRecord(value)) { return Object.values(value); }
  return [];
};

const editorFieldsForMap = (map) => {
  const fields = {};
  const direct = [
    'terrainData', 'environmentalObjects', 'wallData', 'windowOverlays',
    'dndElements', 'fogOfWarData', 'fogOfWarPaths', 'fogErasePaths',
    'exploredAreas', 'exploredCircles', 'exploredPolygons', 'memorySnapshots',
    'tokenAfterimages', 'playerMemories', 'lightSources', 'elevationData',
    'rampData', 'sunSettings', 'drawingPaths', 'drawingLayers',
    'dynamicFogEnabled', 'respectLineOfSight', 'fogRevealMode'
  ];
  for (const field of direct) {
    if (map[field] !== undefined) { fields[field] = map[field]; }
  }
  return fields;
};

export const deriveRootMirrors = (maps) => {
  const mirrors = { tokens: {}, characterTokens: {}, gridItems: {} };
  for (const mapId of Object.keys(maps).sort()) {
    const map = maps[mapId];
    for (const field of ROOT_ENTITY_MIRRORS) {
      const collection = isPlainRecord(map[field]) ? map[field] : {};
      for (const entityId of Object.keys(collection)) {
        mirrors[field][entityId] = collection[entityId];
      }
    }
  }
  return mirrors;
};

const adaptRootOnlyGameState = (gameState) => {
  const levelEditor = isPlainRecord(gameState.levelEditor) ? gameState.levelEditor : {};
  const mapData = isPlainRecord(gameState.mapData) ? gameState.mapData : {};
  const droppedItems = isPlainRecord(gameState.inventory?.droppedItems) ? gameState.inventory.droppedItems : null;

  const map = {
    id: 'default',
    name: 'Default Map',
    tokens: isPlainRecord(gameState.tokens) ? gameState.tokens : {},
    characterTokens: isPlainRecord(gameState.characterTokens) ? gameState.characterTokens : {},
    gridItems: isPlainRecord(gameState.gridItems) ? gameState.gridItems : (droppedItems || {})
  };

  const levelEditorFields = [
    'terrainData', 'environmentalObjects', 'wallData', 'windowOverlays',
    'dndElements', 'fogOfWarData', 'fogOfWarPaths', 'fogErasePaths',
    'exploredAreas', 'drawingPaths', 'drawingLayers', 'lightSources',
    'elevationData', 'rampData', 'sunSettings', 'containers', 'creatures',
    'gridSettings'
  ];
  for (const field of levelEditorFields) {
    if (levelEditor[field] !== undefined) { map[field] = levelEditor[field]; }
  }
  if (map.fogOfWarData === undefined && gameState.fogOfWar !== undefined) { map.fogOfWarData = gameState.fogOfWar; }
  const mapDataFields = ['backgrounds', 'activeBackgroundId', 'backgroundImage', 'backgroundImageUrl', 'cameraX', 'cameraY', 'zoomLevel', 'gridSettings'];
  for (const field of mapDataFields) {
    if (map[field] === undefined && mapData[field] !== undefined) { map[field] = mapData[field]; }
  }
  if (map.gridSettings === undefined && isPlainRecord(gameState.gridSettings)) { map.gridSettings = gameState.gridSettings; }

  const global = { ...gameState };
  delete global.tokens;
  delete global.characterTokens;
  delete global.gridItems;
  delete global.inventory;
  delete global.levelEditor;
  delete global.fogOfWar;
  delete global.maps;
  global.defaultMapId = 'default';

  return { global, maps: { default: map }, mapIds: ['default'] };
};

export const normalizeRoomSnapshot = (gameState) => {
  if (!isPlainRecord(gameState)) {
    return { global: {}, maps: {}, mapIds: [] };
  }
  if (!isPlainRecord(gameState.maps)) {
    return adaptRootOnlyGameState(gameState);
  }

  const maps = {};
  const mapIds = Object.keys(gameState.maps).sort();
  for (const mapId of mapIds) {
    const record = gameState.maps[mapId];
    maps[mapId] = isPlainRecord(record) ? { ...record, id: mapId } : { id: mapId };
  }

  const global = { ...gameState };
  delete global.maps;
  delete global.tokens;
  delete global.characterTokens;
  delete global.gridItems;

  if (mapIds.length === 0) {
    global.defaultMapId = null;
  } else if (global.defaultMapId === undefined || global.defaultMapId === null) {
    global.defaultMapId = mapIds[0];
  }

  return { global, maps, mapIds };
};

export const normalizeMapSnapshot = (mapId, mapData) => {
  const record = isPlainRecord(mapData) ? { ...mapData } : {};
  record.id = mapId;
  return record;
};

const DEFAULT_SUN_SETTINGS = {
  azimuth: 135,
  elevation: 45,
  color: '#fff4e0',
  intensity: 1.0,
  ambient: 0.2
};

const applyEditorProjection = (map, scope) => {
  const store = useLevelEditorStore;
  const current = store.getState();
  const patch = {};
  const fields = editorFieldsForMap(map);

  const defaults = {
    terrainData: {},
    environmentalObjects: [],
    wallData: {},
    windowOverlays: {},
    dndElements: [],
    fogOfWarData: {},
    fogOfWarPaths: [],
    fogErasePaths: [],
    exploredAreas: {},
    exploredCircles: [],
    exploredPolygons: [],
    memorySnapshots: {},
    tokenAfterimages: {},
    playerMemories: {},
    lightSources: {},
    elevationData: {},
    rampData: {},
    drawingPaths: [],
    drawingLayers: []
  };

  for (const [field, fallback] of Object.entries(defaults)) {
    const next = fields[field] !== undefined ? fields[field] : (scope === 'map' || scope === 'room' ? fallback : undefined);
    if (next === undefined) { continue; }
    if (!sameJson(current[field], next)) { patch[field] = next; }
  }
  if (fields.sunSettings !== undefined) {
    if (!sameJson(current.sunSettings, fields.sunSettings)) { patch.sunSettings = fields.sunSettings; }
  } else if (scope === 'map' || scope === 'room') {
    // Complete map/room hydration owns sun settings: an omitted sun in a full
    // snapshot resets to the documented default instead of retaining the
    // previous room's values.
    if (!sameJson(current.sunSettings, DEFAULT_SUN_SETTINGS)) {
      patch.sunSettings = { ...DEFAULT_SUN_SETTINGS };
    }
  }
  if (fields.dynamicFogEnabled !== undefined && current.dynamicFogEnabled !== fields.dynamicFogEnabled) {
    patch.dynamicFogEnabled = !!fields.dynamicFogEnabled;
  }
  if (fields.respectLineOfSight !== undefined && current.respectLineOfSight !== fields.respectLineOfSight) {
    patch.respectLineOfSight = !!fields.respectLineOfSight;
  }
  if (patch.terrainData) {
    patch.terrainDataVersion = (current.terrainDataVersion || 0) + 1;
  }
  if (patch.elevationData) {
    patch.elevationDataVersion = (current.elevationDataVersion || 0) + 1;
  }
  if (Object.keys(patch).length > 0) {
    store.setState(patch);
  }

  const mirror = {
    terrainData: patch.terrainData || current.terrainData,
    wallData: patch.wallData || current.wallData,
    windowOverlays: patch.windowOverlays || current.windowOverlays,
    dndElements: patch.dndElements || current.dndElements,
    drawingPaths: current.drawingPaths,
    fogOfWarData: patch.fogOfWarData || current.fogOfWarData,
    fogOfWarPaths: patch.fogOfWarPaths || current.fogOfWarPaths
  };
  return mirror;
};

const applyGridAndBackgrounds = (map, global, options = {}) => {
  const full = options.full === true;
  const gameStore = useGameStore;
  const current = gameStore.getState();
  const patch = {};

  const mapData = isPlainRecord(global.mapData) ? global.mapData : {};
  const backgrounds = map.backgrounds !== undefined
    ? map.backgrounds
    : (mapData.backgrounds !== undefined ? mapData.backgrounds : (full ? [] : undefined));
  const activeBackgroundId = map.activeBackgroundId !== undefined
    ? map.activeBackgroundId
    : (mapData.activeBackgroundId !== undefined ? mapData.activeBackgroundId : (full ? null : undefined));
  const backgroundImage = map.backgroundImage !== undefined
    ? map.backgroundImage
    : (mapData.backgroundImage !== undefined ? mapData.backgroundImage : (full ? null : undefined));
  const backgroundImageUrl = map.backgroundImageUrl !== undefined
    ? map.backgroundImageUrl
    : (mapData.backgroundImageUrl !== undefined ? mapData.backgroundImageUrl : (full ? '' : undefined));

  if (backgrounds !== undefined && !sameJson(current.backgrounds, backgrounds)) { patch.backgrounds = backgrounds; }
  if (activeBackgroundId !== undefined && current.activeBackgroundId !== activeBackgroundId) { patch.activeBackgroundId = activeBackgroundId; }
  if (backgroundImage !== undefined && current.backgroundImage !== backgroundImage) { patch.backgroundImage = backgroundImage; }
  if (backgroundImageUrl !== undefined && current.backgroundImageUrl !== backgroundImageUrl) { patch.backgroundImageUrl = backgroundImageUrl; }

  const gridSettings = (isPlainRecord(map.gridSettings) ? map.gridSettings : null) ||
    (isPlainRecord(global.gridSettings) ? global.gridSettings : null) ||
    (isPlainRecord(mapData.gridSettings) ? mapData.gridSettings : null);
  if (gridSettings) {
    const gridMap = [
      ['gridType', gridSettings.gridType ?? gridSettings.type],
      ['gridSize', gridSettings.gridSize ?? gridSettings.size],
      ['gridOffsetX', gridSettings.gridOffsetX ?? gridSettings.offsetX],
      ['gridOffsetY', gridSettings.gridOffsetY ?? gridSettings.offsetY],
      ['gridLineColor', gridSettings.gridLineColor ?? gridSettings.color],
      ['gridLineThickness', gridSettings.gridLineThickness ?? gridSettings.thickness],
      ['gridLineOpacity', gridSettings.gridLineOpacity],
      ['gridBackgroundColor', gridSettings.gridBackgroundColor]
    ];
    for (const [field, value] of gridMap) {
      if (value !== undefined && current[field] !== value) { patch[field] = value; }
    }
  }
  if (map.viewMode !== undefined && current.viewMode !== map.viewMode) { patch.viewMode = map.viewMode; }

  if (Object.keys(patch).length > 0) { gameStore.setState(patch); }
};

const DEFAULT_COMBAT_CONFIG = {
  showTimers: true,
  apRestorationMode: 'initiative',
  apRestorationAmount: 3,
  healthRegenEnabled: false,
  manaRegenEnabled: false
};

const RESET_COMBAT_TRANSIENT = {
  isSelectionMode: false,
  selectedTokens: new Set(),
  combatTimeline: [],
  turnTimers: new Map(),
  movementThisTurn: new Map(),
  movementPath: [],
  movementUnlocked: new Set(),
  turnMovementUsed: new Map(),
  turnStartPositions: new Map(),
  tempMovementDistance: new Map(),
  activeMovement: null,
  pendingMovementConfirmation: null
};

const applyCombat = (combat, options = {}) => {
  const full = options.full === true;
  // A present combat section owns the combat domain even in partial scope:
  // an explicit null replaces/clears combat instead of being ignored.
  const ownsDomain = options.ownsDomain === true;
  const store = useCombatStore;
  const current = store.getState();
  const record = isPlainRecord(combat) ? combat : null;

  if (!record) {
    if (full || ownsDomain) {
      store.setState({
        isInCombat: false,
        turnOrder: [],
        currentTurnIndex: 0,
        round: 0,
        combatLog: [],
        combatConfig: { ...DEFAULT_COMBAT_CONFIG },
        currentTurnStartTime: null,
        ...RESET_COMBAT_TRANSIENT
      });
    }
    return;
  }

  const active = record.isActive === true;
  const turnOrder = Array.isArray(record.turnOrder) ? record.turnOrder : [];
  const storedIndex = Number.isInteger(record.currentTurnIndex)
    ? record.currentTurnIndex
    : (Number.isInteger(record.currentTurn) ? record.currentTurn : null);
  const indexValid = Number.isInteger(storedIndex) && storedIndex >= 0 && storedIndex < turnOrder.length;
  const safeIndex = indexValid ? storedIndex : 0;
  const round = Number.isFinite(record.round) ? record.round : 0;

  const patch = {};
  if (current.isInCombat !== active) { patch.isInCombat = active; }
  if (!sameJson(current.turnOrder, turnOrder)) { patch.turnOrder = turnOrder; }
  if (current.currentTurnIndex !== safeIndex) { patch.currentTurnIndex = safeIndex; }
  if (current.round !== round) { patch.round = round; }
  const combatLog = Array.isArray(record.combatLog) ? record.combatLog : [];
  if (!sameJson(current.combatLog, combatLog)) { patch.combatLog = combatLog; }
  const config = isPlainRecord(record.combatConfig)
    ? record.combatConfig
    : (full ? { ...DEFAULT_COMBAT_CONFIG } : undefined);
  if (config !== undefined && !sameJson(current.combatConfig, config)) { patch.combatConfig = config; }
  patch.currentTurnStartTime = Number.isFinite(record.currentTurnStartTime) ? record.currentTurnStartTime : null;

  store.setState({ ...patch, ...RESET_COMBAT_TRANSIENT });
};

const normalizeGridItems = (items) => asArray(items).map((item) => {
  if (!isPlainRecord(item)) { return item; }
  const rawId = item.id !== undefined && item.id !== null ? String(item.id) : null;
  const id = rawId ? (rawId.startsWith('grid-item-') ? rawId : `grid-item-${rawId}`) : null;
  if (!id) { return { ...item }; }
  return {
    ...item,
    id,
    itemId: item.itemId || (rawId && !rawId.startsWith('grid-item-') ? rawId : null),
    originalItemId: item.originalItemId || (rawId && !rawId.startsWith('grid-item-') ? rawId : null)
  };
});

const applyGlobalOptionalDomains = (global, options = {}) => {
  const full = options.full === true;

  const conditions = useConditionStore.getState();
  const buffsRaw = global.buffs !== undefined
    ? global.buffs
    : (isPlainRecord(global.buffsAndDebuffs) ? global.buffsAndDebuffs.buffs : undefined);
  const debuffsRaw = global.debuffs !== undefined
    ? global.debuffs
    : (isPlainRecord(global.buffsAndDebuffs) ? global.buffsAndDebuffs.debuffs : undefined);
  if (buffsRaw !== undefined || debuffsRaw !== undefined || full) {
    const nextBuffs = buffsRaw !== undefined ? asArray(buffsRaw) : (full ? [] : conditions.activeBuffs);
    const nextDebuffs = debuffsRaw !== undefined ? asArray(debuffsRaw) : (full ? [] : conditions.activeDebuffs);
    if (!sameJson(conditions.activeBuffs, nextBuffs) || !sameJson(conditions.activeDebuffs, nextDebuffs)) {
      useConditionStore.setState({ activeBuffs: nextBuffs, activeDebuffs: nextDebuffs });
    }
  }

  if (global.containers !== undefined || full) {
    const containers = global.containers !== undefined ? asArray(global.containers) : [];
    if (!sameJson(useContainerStore.getState().containers, containers)) {
      useContainerStore.setState({ containers });
    }
  }

  if (global.weather !== undefined || full) {
    const weather = isPlainRecord(global.weather)
      ? {
        type: global.weather.type || 'none',
        intensity: Number.isFinite(global.weather.intensity) ? global.weather.intensity : 0.5,
        enabled: global.weather.enabled === true
      }
      : { type: 'none', intensity: 0.5, enabled: false };
    if (!sameJson(useLevelEditorStore.getState().weatherEffects, weather)) {
      useLevelEditorStore.setState({ weatherEffects: weather });
    }
  }

  if (global.travel !== undefined || full) {
    const travel = isPlainRecord(global.travel) ? global.travel : {};
    useTravelStore.setState({
      currentBiome: travel.currentBiome ?? 'arctic',
      weather: travel.weather ?? null,
      weatherRoll: travel.weatherRoll ?? null,
      weatherDuration: travel.weatherDuration ?? null,
      weatherRemaining: travel.weatherRemaining ?? null,
      transportMode: travel.transportMode ?? 'foot',
      terrainType: travel.terrainType ?? 0,
      partyExhaustion: travel.partyExhaustion ?? 0,
      playerGearStates: isPlainRecord(travel.playerGearStates) ? travel.playerGearStates : {},
      clock: isPlainRecord(travel.clock) ? travel.clock : { tenday: 1, day: 1, hour: 6 },
      activeHour: Number.isFinite(travel.activeHour) ? travel.activeHour : -1,
      navStatus: travel.navStatus ?? null,
      journeyGoal: travel.journeyGoal ?? 10,
      hourLog: asArray(travel.hourLog),
      encounterLog: asArray(travel.encounterLog),
      lastEncounter: travel.lastEncounter ?? null
    });
  }

  if (global.audioState !== undefined || full) {
    const tracks = (isPlainRecord(global.audioState) && Array.isArray(global.audioState.playingTracks))
      ? global.audioState.playingTracks.map((track) => ({
        ...track,
        isPlaying: true,
        thumbnail: track.thumbnail || null
      }))
      : [];
    require('../store/audioStore').default.setState({ playingTracks: tracks });
  }

  const hasSceneField = global.activeSceneMode !== undefined ||
    global.activeLocationMapId !== undefined ||
    global.isFreeRoamAllowed !== undefined ||
    global.locationScenes !== undefined;
  if (hasSceneField || full) {
    const sceneMode = global.activeSceneMode !== undefined ? global.activeSceneMode : 'tactical';
    const locationMapId = global.activeLocationMapId !== undefined ? (global.activeLocationMapId ?? null) : null;
    const freeRoam = global.isFreeRoamAllowed === true;
    const gameStateNow = useGameStore.getState();
    if (gameStateNow.activeSceneMode !== sceneMode ||
      gameStateNow.activeLocationMapId !== locationMapId ||
      gameStateNow.isFreeRoamAllowed !== freeRoam) {
      useGameStore.setState({
        activeSceneMode: sceneMode,
        activeLocationMapId: locationMapId,
        isFreeRoamAllowed: freeRoam
      });
    }

    if (isPlainRecord(global.locationScenes) && locationMapId && isPlainRecord(global.locationScenes[locationMapId])) {
      const scene = global.locationScenes[locationMapId];
      const interactiveStore = require('../store/interactiveMapStore').default;
      interactiveStore.getState().syncLocationSceneState({
        mapId: locationMapId,
        pins: asArray(scene.pins),
        partyMarker: scene.partyMarker ?? null
      });
    } else if (full) {
      const interactiveStore = require('../store/interactiveMapStore').default;
      interactiveStore.setState({ pins: [], partyMarker: null });
    }
  }
};

/**
 * Apply one selected room/map/section snapshot by replacement.
 *
 * @param {Object} options
 * @param {Object} options.gameState - complete server gameState (maps + global)
 * @param {string} [options.mapId] - single map record to apply (map/section scope)
 * @param {Object} [options.mapData] - single map record payload
 * @param {string} [options.activeMapId]
 * @param {'room'|'map'|'section'} [options.scope]
 * @param {Object} [options.sections] - partial collections for section scope
 * @returns {{applied: boolean, scope: string, mapIds: string[]}}
 */
export function applyRoomSnapshot(options = {}) {
  const scope = options.scope || 'room';
  const previousReceiving = typeof window !== 'undefined' ? window._isReceivingMapUpdate : undefined;
  if (typeof window !== 'undefined') { window._isReceivingMapUpdate = true; }

  try {
    if (scope === 'room') {
      const snapshot = normalizeRoomSnapshot(options.gameState);
      return applyNormalizedSnapshot(snapshot, options, 'room');
    }

    if (scope === 'map') {
      const mapId = options.mapId || options.activeMapId;
      const mapData = options.mapData !== undefined ? options.mapData : (options.gameState?.maps?.[mapId]);
      return applyMapRecords({ [mapId]: normalizeMapSnapshot(mapId, mapData) }, options, 'map');
    }

    return applySections(options.sections || {}, options);
  } finally {
    if (typeof window !== 'undefined') { window._isReceivingMapUpdate = previousReceiving; }
  }
}

function applyNormalizedSnapshot(snapshot, options, scope) {
  const mapIds = snapshot.mapIds || Object.keys(snapshot.maps || {});
  let activeMapId = options.activeMapId || options.mapId || null;
  if (!activeMapId || !snapshot.maps[activeMapId]) {
    activeMapId = snapshot.global.defaultMapId && snapshot.maps[snapshot.global.defaultMapId]
      ? snapshot.global.defaultMapId
      : (mapIds[0] || null);
  }

  useMapStore.setState({
    maps: mapIds.map((mapId) => ({ ...snapshot.maps[mapId], id: mapId })),
    currentMapId: activeMapId
  });

  const mirrors = deriveRootMirrors(snapshot.maps);
  const tokenList = Object.values(mirrors.tokens);
  const characterTokenList = Object.values(mirrors.characterTokens);
  useCreatureStore.setState({ creatureTokens: tokenList, tokens: tokenList });
  useCharacterTokenStore.setState({ characterTokens: characterTokenList });
  useGridItemStore.setState({ gridItems: normalizeGridItems(Object.values(mirrors.gridItems)) });

  const activeMap = activeMapId ? snapshot.maps[activeMapId] : {};
  applyEditorProjection(activeMap, scope);
  applyGridAndBackgrounds(activeMap, snapshot.global, { full: true });
  applyCombat(snapshot.global.combat || null, { full: true });
  applyGlobalOptionalDomains(snapshot.global, { full: true });

  return { applied: true, scope, mapIds, activeMapId };
}

function applyMapRecords(mapRecords, options, scope) {
  const mapIds = Object.keys(mapRecords);
  const activeId = options.activeMapId || options.mapId || mapIds[0];
  const activeMap = mapRecords[activeId];

  const currentMaps = useMapStore.getState().maps || [];
  const byId = new Map(currentMaps.map((map) => [map.id, map]));
  for (const mapId of mapIds) { byId.set(mapId, { ...mapRecords[mapId], id: mapId }); }
  useMapStore.setState({
    maps: Array.from(byId.values()),
    currentMapId: activeId
  });

  if (activeMap && scope === 'map') {
    const mirrors = deriveRootMirrors({ [activeId]: activeMap });
    useCreatureStore.setState({ creatureTokens: Object.values(mirrors.tokens), tokens: Object.values(mirrors.tokens) });
    useCharacterTokenStore.setState({ characterTokens: Object.values(mirrors.characterTokens) });
    const currentItems = useGridItemStore.getState().gridItems || [];
    const otherItems = currentItems.filter((item) => (item?.mapId || 'default') !== activeId);
    useGridItemStore.setState({
      gridItems: [...otherItems, ...normalizeGridItems(Object.values(mirrors.gridItems).map((item) => ({ ...item, mapId: item.mapId || activeId })))]
    });
    applyEditorProjection(activeMap, 'map');
    applyGridAndBackgrounds(activeMap, {}, { full: true });
  }

  return { applied: true, scope: scope === 'map' ? 'map' : 'map', mapIds, activeMapId: activeId };
}

function applySections(sections, options) {
  const activeMapId = options.activeMapId || useMapStore.getState().currentMapId;
  let touched = false;

  if (sections.mapData && activeMapId) {
    applyEditorProjection(normalizeMapSnapshot(activeMapId, sections.mapData), 'map');
    applyGridAndBackgrounds(normalizeMapSnapshot(activeMapId, sections.mapData), {}, { full: false });
    touched = true;
  }
  if (sections.tokens !== undefined || sections.characterTokens !== undefined) {
    const currentTokens = useCreatureStore.getState().tokens || [];
    const otherTokens = currentTokens.filter((token) => (token?.mapId || 'default') !== activeMapId);
    const nextTokens = sections.tokens !== undefined
      ? [...otherTokens, ...Object.values(sections.tokens || {}).map((token) => ({ ...token, mapId: token.mapId || activeMapId }))]
      : currentTokens;
    if (sections.tokens !== undefined) { useCreatureStore.setState({ creatureTokens: nextTokens, tokens: nextTokens }); }

    const currentCharTokens = useCharacterTokenStore.getState().characterTokens || [];
    const otherCharTokens = currentCharTokens.filter((token) => (token?.mapId || 'default') !== activeMapId);
    const nextCharTokens = sections.characterTokens !== undefined
      ? [...otherCharTokens, ...Object.values(sections.characterTokens || {}).map((token) => ({ ...token, mapId: token.mapId || activeMapId }))]
      : currentCharTokens;
    if (sections.characterTokens !== undefined) { useCharacterTokenStore.setState({ characterTokens: nextCharTokens }); }
    touched = true;
  }
  if (sections.gridItems !== undefined) {
    const currentItems = useGridItemStore.getState().gridItems || [];
    const otherItems = currentItems.filter((item) => (item?.mapId || 'default') !== activeMapId);
    const nextItems = [...otherItems, ...normalizeGridItems(Object.values(sections.gridItems || {}).map((item) => ({ ...item, mapId: item.mapId || activeMapId })))];
    useGridItemStore.setState({ gridItems: nextItems });
    touched = true;
  }
  if (sections.fogOfWar !== undefined) {
    useLevelEditorStore.setState({ fogOfWarData: sections.fogOfWar || {} });
    touched = true;
  }
  if (sections.combat !== undefined) {
    applyCombat(sections.combat || null, { ownsDomain: true });
    touched = true;
  }
  if (sections.global) {
    applyGlobalOptionalDomains(sections.global, { full: false });
    touched = true;
  }
  return { applied: touched, scope: 'section', mapIds: activeMapId ? [activeMapId] : [] };
}

/**
 * Personal-room-state allowlist: only camera presentation preferences may be
 * restored. Shared authoritative domains are never applied from personal
 * storage in an active multiplayer room.
 */
export function applyPersonalRoomState(personalState, options = {}) {
  if (options.allowCamera !== true) {
    return { applied: false, reason: 'camera_projection_disabled' };
  }
  const mapData = personalState && personalState.mapData;
  if (!isPlainRecord(mapData)) { return { applied: false, reason: 'no_personal_camera' }; }

  const patch = {};
  if (Number.isFinite(mapData.cameraX)) { patch.cameraX = mapData.cameraX; }
  if (Number.isFinite(mapData.cameraY)) { patch.cameraY = mapData.cameraY; }
  if (Number.isFinite(mapData.zoomLevel) && mapData.zoomLevel > 0) { patch.zoomLevel = mapData.zoomLevel; }
  if (Object.keys(patch).length === 0) { return { applied: false, reason: 'no_valid_camera_fields' }; }

  useGameStore.setState(patch);
  return { applied: true, fields: Object.keys(patch) };
}

export const PERSONAL_DENIED_SHARED_FIELDS = Object.freeze([
  'characterTokens', 'creatureTokens', 'tokens', 'gridItems', 'environmentalObjects',
  'combat', 'buffsAndDebuffs', 'chatHistory', 'levelEditor', 'backgrounds',
  'activeBackgroundId', 'fogOfWarData', 'exploredAreas', 'playerMemories'
]);

export default { applyRoomSnapshot, applyPersonalRoomState, normalizeRoomSnapshot };
