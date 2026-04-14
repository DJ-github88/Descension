import { create } from 'zustand';
import { getBiome, getBiomeWeather, getBiomeEncounter, getAtmosphere } from '../data/biomeData';

const EXH_MULT = [1, 1, 0.5, 0.5, 0.5, 0];

const HOURS = [
  { n: 1, enc: false, prov: false, rest: false, od: false },
  { n: 2, enc: true, prov: false, rest: false, od: false },
  { n: 3, enc: false, prov: false, rest: false, od: false },
  { n: 4, enc: true, prov: true, rest: true, od: false },
  { n: 5, enc: false, prov: false, rest: false, od: false },
  { n: 6, enc: true, prov: false, rest: false, od: false },
  { n: 7, enc: false, prov: false, rest: false, od: false },
  { n: 8, enc: true, prov: true, rest: false, od: false },
  { n: 9, enc: true, prov: false, rest: false, od: true },
  { n: 10, enc: false, prov: false, rest: false, od: true },
  { n: 11, enc: true, prov: false, rest: false, od: true },
  { n: 12, enc: false, prov: true, rest: false, od: true },
  { n: 13, enc: true, prov: false, rest: false, od: true },
  { n: 14, enc: false, prov: false, rest: false, od: true }
];

const useTravelStore = create((set, get) => ({
  currentBiome: 'arctic',
  activeTab: 'setup',
  weather: null,
  weatherRoll: null,
  weatherDuration: null,
  weatherRemaining: null,
  transportMode: 'foot',
  terrainType: 0,
  partyExhaustion: 0,
  clock: { tenday: 1, day: 1, hour: 6 },
  activeHour: -1,
  navStatus: null,
  journeyGoal: 10,
  hourLog: [],
  encounterLog: [],
  lastEncounter: null,
  selectedEncounterRow: null,
  editingEncounterRow: null,
  encounterEditDraft: null,
  broadcastToggles: {
    atmosphere: true,
    weather: true,
    encounter: true,
    progress: true,
    exhaustion: true
  },
  broadcastHistory: [],
  travelSocket: null,
  playerTravelState: null,
  weatherPrediction: null,
  playerGearStates: {},

  setPlayerGear: (memberId, gearState) => set(s => ({
    playerGearStates: { ...s.playerGearStates, [memberId]: gearState }
  })),

  setAllPlayerGear: (gearState) => set(s => {
    const members = require('./partyStore').default.getState().partyMembers;
    const players = members.filter(m => !m.isGM && m.isConnected);
    const next = { ...s.playerGearStates };
    players.forEach(m => { next[m.id || m.userId] = gearState; });
    return { playerGearStates: next };
  }),

  PREDICTION_DICE: { 0: 'd4', 1: 'd6', 2: 'd8', 3: 'd10', 4: 'd12' },

  getPredictionDie: () => {
    const state = get();
    if (!state.weather) return null;
    return state.PREDICTION_DICE[state.weather.severity] || 'd12';
  },

  predictWeatherDuration: (outcome) => {
    const state = get();
    if (!state.weather || !state.weatherRemaining) return;
    const remaining = state.weatherRemaining;
    let result;
    if (outcome === 'success') {
      result = { outcome: 'success', text: `The ${state.weather.name.toLowerCase()} will last ${remaining} more hour${remaining !== 1 ? 's' : ''}.`, hours: remaining };
    } else if (outcome === 'partial') {
      const vague = remaining <= 2 ? 'about to clear soon' : remaining <= 4 ? 'a few more hours' : remaining <= 6 ? 'most of the day' : 'will persist for a long while';
      result = { outcome: 'partial', text: `The ${state.weather.name.toLowerCase()} seems like it will continue for ${vague}.`, hours: null };
    } else {
      result = { outcome: 'fail', text: 'The signs are unclear. The weather could shift at any moment.', hours: null };
    }
    set({ weatherPrediction: result });
  },

  clearPrediction: () => set({ weatherPrediction: null }),

  getHours: () => HOURS,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setBiome: (biomeId) => set({ currentBiome: biomeId, lastEncounter: null, selectedEncounterRow: null, editingEncounterRow: null }),

  getSpeed: () => {
    const state = get();
    const biome = getBiome(state.currentBiome);
    if (!biome || state.partyExhaustion >= 5) return 0;
    const mode = biome.transportModes.find(m => m.id === state.transportMode);
    if (!mode) return 0;
    const terrain = biome.terrainTypes[state.terrainType];
    const terrainMod = terrain ? terrain.speedMod : 1;
    const exhMod = EXH_MULT[state.partyExhaustion] || 0;
    return Math.max(0, mode.speed * exhMod * terrainMod);
  },

  getSchedule: () => {
    const state = get();
    const biome = getBiome(state.currentBiome);
    if (!biome) return [];
    const mode = biome.transportModes.find(m => m.id === state.transportMode);
    if (!mode) return [];
    const speed = state.getSpeed();
    const schedule = [];
    let cumMiles = 0;
    let travelCount = 0;
    for (let i = 0; i < 14; i++) {
      const isRest = mode.restEvery && travelCount > 0 && (travelCount % mode.restEvery === 0);
      if (isRest) {
        schedule.push({ miles: cumMiles, isRest: true });
        travelCount = 0;
      } else {
        cumMiles += speed;
        travelCount++;
        schedule.push({ miles: Math.round(cumMiles * 10) / 10, isRest: false });
      }
    }
    return schedule;
  },

  setTransportMode: (mode) => set({ transportMode: mode }),
  setTerrainType: (t) => set({ terrainType: t }),
  setExhaustion: (e) => set({ partyExhaustion: e }),

  clockTick: (n = 1) => set(s => {
    let { tenday, day, hour } = s.clock;
    hour += n;
    while (hour >= 24) { hour -= 24; day++; }
    while (day > 10) { day -= 10; tenday++; }
    return { clock: { tenday, day, hour } };
  }),

  clockBack: (n = 1) => set(s => {
    let { tenday, day, hour } = s.clock;
    hour -= n;
    while (hour < 0) { hour += 24; day--; }
    while (day < 1) { day += 10; tenday = Math.max(1, tenday - 1); }
    return { clock: { tenday, day, hour } };
  }),

  resetClock: () => set({ clock: { tenday: 1, day: 1, hour: 6 } }),

  rollWeather: () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const d8 = Math.floor(Math.random() * 8) + 1;
    const state = get();
    const weather = getBiomeWeather(state.currentBiome, d20);
    set({
      weather,
      weatherRoll: d20,
      weatherDuration: d8,
      weatherRemaining: d8,
      weatherPrediction: null
    });
    return { weather, d20, d8 };
  },

  tickWeatherDuration: () => set(s => {
    if (s.weatherRemaining === null || s.weatherRemaining <= 0) return s;
    return { weatherRemaining: s.weatherRemaining - 1 };
  }),

  selectHour: (i) => set(s => ({ activeHour: i, navStatus: s.navStatus || 'on-track' })),

  setNavStatus: (status) => set({ navStatus: status }),

  advanceHour: () => {
    const state = get();
    const log = [...state.hourLog];
    const encLog = [...state.encounterLog];
    const schedule = state.getSchedule();
    if (state.activeHour >= 0 && schedule[state.activeHour]) {
      const sch = schedule[state.activeHour];
      const isLost = state.navStatus === 'lost';
      const prev = state.activeHour > 0 && schedule[state.activeHour - 1]
        ? schedule[state.activeHour - 1].miles : 0;
      const miles = isLost || sch.isRest ? 0 : Math.max(0, sch.miles - prev);
      const key = `${state.clock.tenday}-${state.clock.day}-${state.activeHour}`;
      log.push({ key, hi: state.activeHour, miles, lost: isLost, rest: sch.isRest });
      if (state.lastEncounter) {
        encLog.push({
          hour: state.activeHour,
          encounter: { ...state.lastEncounter },
          biome: state.currentBiome
        });
      }
    }
    state.tickWeatherDuration();
    const nextHour = Math.min(state.activeHour + 1, 13);
    state.clockTick(1);
    set({ hourLog: log, encounterLog: encLog, activeHour: nextHour, lastEncounter: null });
    get()._broadcastToPlayers('travel_update', {
      activeHour: nextHour,
      hourLog: log,
      clock: get().clock,
      progress: get().getJourneyProgress()
    });
  },

  setJourneyGoal: (goal) => set({ journeyGoal: goal }),

  getJourneyProgress: () => {
    const state = get();
    const covered = state.hourLog.reduce((s, e) => s + e.miles, 0);
    const lostHours = state.hourLog.filter(e => e.lost).length;
    return { covered, lostHours, remaining: Math.max(0, state.journeyGoal - covered) };
  },

  rollEncounter: () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const state = get();
    const encounter = getBiomeEncounter(state.currentBiome, d20);
    set({ lastEncounter: { ...encounter, roll: d20 } });
    return { encounter, d20 };
  },

  rollEncounterFromTable: (rowIndex) => {
    const state = get();
    const biome = getBiome(state.currentBiome);
    if (!biome || !biome.encounterTable[rowIndex]) return null;
    const row = biome.encounterTable[rowIndex];
    const d20 = row.range[0];
    const encounter = { ...row };
    set({ lastEncounter: { ...encounter, roll: d20 } });
    return { encounter, d20 };
  },

  selectEncounterRow: (index) => set({ selectedEncounterRow: index }),

  startEditingEncounter: (index) => {
    const state = get();
    const biome = getBiome(state.currentBiome);
    if (!biome || !biome.encounterTable[index]) return;
    set({
      editingEncounterRow: index,
      encounterEditDraft: { ...biome.encounterTable[index] }
    });
  },

  updateEncounterDraft: (field, value) => set(s => ({
    encounterEditDraft: s.encounterEditDraft ? { ...s.encounterEditDraft, [field]: value } : null
  })),

  saveEncounterEdit: () => {
    const state = get();
    if (state.editingEncounterRow === null || !state.encounterEditDraft) return;
    const biome = getBiome(state.currentBiome);
    if (!biome) return;
    biome.encounterTable[state.editingEncounterRow] = { ...state.encounterEditDraft };
    set({ editingEncounterRow: null, encounterEditDraft: null, selectedEncounterRow: state.editingEncounterRow });
  },

  cancelEncounterEdit: () => set({ editingEncounterRow: null, encounterEditDraft: null }),

  addNewEncounterRow: () => {
    const state = get();
    const biome = getBiome(state.currentBiome);
    if (!biome) return;
    const newRow = { range: [20, 20], type: 'none', label: 'New Encounter', note: '' };
    biome.encounterTable.push(newRow);
    const newIndex = biome.encounterTable.length - 1;
    set({
      selectedEncounterRow: newIndex,
      editingEncounterRow: newIndex,
      encounterEditDraft: { ...newRow }
    });
  },

  removeEncounterRow: (index) => {
    const state = get();
    const biome = getBiome(state.currentBiome);
    if (!biome || index < 0 || index >= biome.encounterTable.length) return;
    biome.encounterTable.splice(index, 1);
    set({
      selectedEncounterRow: null,
      editingEncounterRow: null,
      encounterEditDraft: null
    });
  },

  getAtmosphereText: () => {
    const state = get();
    if (!state.weather) return null;
    const h = state.clock.hour;
    const band = (h < 6 || h >= 20) ? 'night' : (h < 9 || h >= 17) ? 'dawn' : 'day';
    return getAtmosphere(state.currentBiome, state.weather.severity, band);
  },

  toggleBroadcast: (type) => set(s => ({
    broadcastToggles: { ...s.broadcastToggles, [type]: !s.broadcastToggles[type] }
  })),

  addBroadcast: (text, category) => set(s => ({
    broadcastHistory: [...s.broadcastHistory.slice(-49), { text, category, time: new Date().toISOString() }]
  })),

  setTravelSocket: (socket) => set({ travelSocket: socket }),

  initPlayerTravelListener: (socket) => {
    if (!socket) return;
    socket.on('travel_sync', (data) => {
      set({ playerTravelState: data });
    });
    socket.on('travel_update', (data) => {
      set(s => ({
        playerTravelState: { ...s.playerTravelState, ...data }
      }));
    });
    socket.on('travel_broadcast', (data) => {
      set(s => ({
        playerTravelState: {
          ...s.playerTravelState,
          lastBroadcast: data,
          broadcastHistory: [
            ...(s.playerTravelState?.broadcastHistory || []),
            data
          ].slice(-50)
        }
      }));
    });
    set({ travelSocket: socket });
  },

  _broadcastToPlayers: (event, data) => {
    const socket = get().travelSocket;
    if (!socket) return;
    const { multiplayerRoom, multiplayerSocket } = require('./gameStore').default.getState();
    const activeSocket = multiplayerSocket || socket;
    const roomId = multiplayerRoom?.id;
    if (!roomId) return;
    activeSocket.emit(event, { ...data, roomId });
  },

  broadcastTravelState: () => {
    const state = get();
    const data = {
      currentBiome: state.currentBiome,
      weather: state.weather,
      weatherRemaining: state.weatherRemaining,
      transportMode: state.transportMode,
      terrainType: state.terrainType,
      partyExhaustion: state.partyExhaustion,
      clock: state.clock,
      activeHour: state.activeHour,
      navStatus: state.navStatus,
      journeyGoal: state.journeyGoal,
      progress: state.getJourneyProgress(),
      atmosphereText: state.getAtmosphereText(),
      lastEncounter: state.lastEncounter,
      hourLog: state.hourLog,
      broadcastHistory: state.broadcastHistory
    };
    get()._broadcastToPlayers('travel_sync', data);
  },

  broadcastNarrative: (text, category) => {
    get()._broadcastToPlayers('travel_broadcast', { text, category, time: new Date().toISOString() });
    get().addBroadcast(text, category);
  },

  resetDay: () => set({
    weather: null,
    weatherRoll: null,
    weatherDuration: null,
    weatherRemaining: null,
    weatherPrediction: null,
    playerGearStates: {},
    activeHour: -1,
    navStatus: null,
    hourLog: [],
    encounterLog: [],
    lastEncounter: null
  }),

  resetJourney: () => set({ hourLog: [], encounterLog: [], lastEncounter: null }),

  getExportState: () => {
    const s = get();
    return {
      currentBiome: s.currentBiome,
      weather: s.weather,
      weatherRoll: s.weatherRoll,
      weatherDuration: s.weatherDuration,
      weatherRemaining: s.weatherRemaining,
      transportMode: s.transportMode,
      terrainType: s.terrainType,
      partyExhaustion: s.partyExhaustion,
      playerGearStates: s.playerGearStates,
      clock: s.clock,
      activeHour: s.activeHour,
      navStatus: s.navStatus,
      journeyGoal: s.journeyGoal,
      hourLog: s.hourLog,
      encounterLog: s.encounterLog,
      lastEncounter: s.lastEncounter
    };
  },

  importState: (data) => {
    if (!data) return;
    set({
      currentBiome: data.currentBiome || 'arctic',
      weather: data.weather || null,
      weatherRoll: data.weatherRoll || null,
      weatherDuration: data.weatherDuration || null,
      weatherRemaining: data.weatherRemaining || null,
      transportMode: data.transportMode || 'foot',
      terrainType: data.terrainType || 0,
      partyExhaustion: data.partyExhaustion || 0,
      playerGearStates: data.playerGearStates || {},
      clock: data.clock || { tenday: 1, day: 1, hour: 6 },
      activeHour: data.activeHour ?? -1,
      navStatus: data.navStatus || null,
      journeyGoal: data.journeyGoal || 10,
      hourLog: data.hourLog || [],
      encounterLog: data.encounterLog || [],
      lastEncounter: data.lastEncounter || null
    });
  }
}));

export default useTravelStore;
