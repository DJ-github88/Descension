import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

// Built-in starter interactive maps with hierarchical drilldown (World -> Continent -> Region -> Dungeon)
const DEFAULT_STARTER_MAPS = [
  {
    id: 'map-mythril-world',
    name: 'Mythrill — Planetary Master Map',
    type: 'world',
    imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
    parentMapId: null,
    description: 'The master celestial map of the known realm of Mythrill.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'map-nordhalla',
    name: 'Nordhalla Continental Realm',
    type: 'continent',
    imageUrl: '/assets/images/backgrounds/nordhalla.jpeg',
    parentMapId: 'map-mythril-world',
    description: 'The frozen northern continent ruled by the high clans, Skald strongholds, and Frostwood compact.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'map-rime-spire',
    name: 'Rime-Spire Peaks & Glacial Reach',
    type: 'region',
    imageUrl: '/assets/images/backgrounds/rime-spire-peaks.jpg',
    parentMapId: 'map-nordhalla',
    description: 'The high peaks where ancient ice drakes nest and the obsidian spires rise.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_STARTER_PINS = [
  // World Map Pins
  {
    id: 'pin-nordhalla-entry',
    mapId: 'map-mythril-world',
    x: 48,
    y: 28,
    title: 'Nordhalla High Realm',
    description: 'The great northern ice kingdom. Click to dive into the continental map.',
    icon: 'fa-mountain-sun',
    color: '#3498db',
    type: 'city',
    layerId: 'poi',
    isSecretGM: false,
    targetMapId: 'map-nordhalla',
    isDiscovered: true
  },
  {
    id: 'pin-frostwood-reach',
    mapId: 'map-mythril-world',
    x: 62,
    y: 42,
    title: 'Frostwood Reach',
    description: 'Dense primeval taiga shrouded in arcane mist.',
    icon: 'fa-tree',
    color: '#27ae60',
    type: 'poi',
    layerId: 'poi',
    isSecretGM: false,
    targetMapId: null,
    isDiscovered: true
  },
  // Continental Pins
  {
    id: 'pin-rime-spire-entry',
    mapId: 'map-nordhalla',
    x: 58,
    y: 48,
    title: "Skald's Peaks & Rime-Spire",
    description: 'The soaring ice spires and dragon-roost peaks. Click to dive into the high-res regional sub-map.',
    icon: 'fa-monument',
    color: '#9b59b6',
    type: 'city',
    layerId: 'poi',
    isSecretGM: false,
    targetMapId: 'map-rime-spire',
    isDiscovered: true
  },
  {
    id: 'pin-snowcall-castle',
    mapId: 'map-nordhalla',
    x: 53,
    y: 28,
    title: 'Snowcall Castle',
    description: 'The ancestral fortress of the Northern High Kings, carved directly into the living granite peaks.',
    icon: 'fa-chess-rook',
    color: '#3498db',
    type: 'city',
    layerId: 'poi',
    isSecretGM: false,
    targetMapId: null,
    isDiscovered: true
  },
  {
    id: 'pin-midhofn-port',
    mapId: 'map-nordhalla',
    x: 36,
    y: 52,
    title: 'Midhöfn Fjord Harbor',
    description: 'The central maritime trading hub where longships unload silver, salted sturgeon, and enchanted runestones.',
    icon: 'fa-anchor',
    color: '#1abc9c',
    type: 'city',
    layerId: 'poi',
    isSecretGM: false,
    targetMapId: null,
    isDiscovered: true
  },
  {
    id: 'pin-saltgrinn-fort',
    mapId: 'map-nordhalla',
    x: 21,
    y: 64,
    title: 'Saltgrinn Citadel',
    description: 'Heavy stone fortress guarding the southern fjords against raiding sea serpents and ice drakes.',
    icon: 'fa-shield-halved',
    color: '#e67e22',
    type: 'poi',
    layerId: 'poi',
    isSecretGM: false,
    targetMapId: null,
    isDiscovered: true
  },
  {
    id: 'pin-dragon-maw-secret',
    mapId: 'map-nordhalla',
    x: 48,
    y: 20,
    title: "Lair of Draugur's Deep (GM Secret)",
    description: 'Ancient slumbering frost wyrm hoard. Contains 5,000 GP and the Frostbite Relic.',
    icon: 'fa-dragon',
    color: '#e74c3c',
    type: 'hazard',
    layerId: 'secrets',
    isSecretGM: true,
    targetMapId: null,
    isDiscovered: false
  },
  {
    id: 'pin-tavern-wayfarer',
    mapId: 'map-nordhalla',
    x: 30,
    y: 68,
    title: "The Wayfarer's Hearth Tavern",
    description: 'Cozy coastal inn serving spiced dwarven mead, smoked seal-fish, and roaring hearthfires.',
    icon: 'fa-beer-mug-empty',
    color: '#f39c12',
    type: 'tavern',
    layerId: 'poi',
    isSecretGM: false,
    targetMapId: null,
    isDiscovered: true
  }
];

const DEFAULT_LAYERS = [
  { id: 'terrain', name: 'Geography & Landmarks', isVisible: true, isGMOnly: false, icon: 'fa-mountain' },
  { id: 'poi', name: 'Cities, Taverns & Quests', isVisible: true, isGMOnly: false, icon: 'fa-city' },
  { id: 'political', name: 'Political Borders', isVisible: true, isGMOnly: false, icon: 'fa-flag' },
  { id: 'journey', name: 'Party Journey Trail', isVisible: true, isGMOnly: false, icon: 'fa-route' },
  { id: 'fog', name: 'Fog of War (Shroud)', isVisible: true, isGMOnly: false, icon: 'fa-smog' },
  { id: 'secrets', name: 'GM Secrets & Traps', isVisible: true, isGMOnly: true, icon: 'fa-eye-slash' }
];

const DEFAULT_WAYPOINTS = [
  { id: 'wp-1', mapId: 'map-nordhalla', x: 21, y: 64, title: 'Saltgrinn Departure', dayType: 'day', day: 1, notes: 'Purchased provisions and iron crampons for the frozen pass.', isSecretGM: false, isDiscovered: true },
  { id: 'wp-2', mapId: 'map-nordhalla', x: 36, y: 52, title: 'Midhöfn Ferry Encampment', dayType: 'range', day: 3, endDay: 5, stayDuration: 3, notes: 'Crossed the fjord on a dwarven longship; parleyed with harbor master and camped for 3 days to resupply.', isSecretGM: false, isDiscovered: true },
  { id: 'wp-3', mapId: 'map-nordhalla', x: 58, y: 48, title: "Skald's Peaks Ascent", dayType: 'day', day: 6, notes: 'Reached the high pass. Camped beneath the obsidian overhang.', isSecretGM: false, isDiscovered: true }
];

const useInteractiveMapStore = create(
  persist(
    (set, get) => ({
      maps: DEFAULT_STARTER_MAPS,
      pins: DEFAULT_STARTER_PINS,
      layers: DEFAULT_LAYERS,
      activeMapId: 'map-nordhalla',
      selectedPinId: null,
      selectedWaypointId: null,
      isStudioOpen: false,
      isGMMode: true,
      zoomLevel: 1,
      panOffset: { x: 0, y: 0 },
      isDrawingRoute: false,
      routeMode: 'days', // 'days' | 'stops'
      isFogToolActive: false,
      fogBrushMode: 'shroud', // 'shroud' | 'reveal'
      fogBrushSize: 90, // px radius
      mapFogData: {}, // { [mapId]: Array<{ id, x, y, radius, isReveal }> }
      journeyWaypoints: DEFAULT_WAYPOINTS,
      partyMarker: {
        mapId: 'map-nordhalla',
        x: 58,
        y: 48,
        name: 'The Party',
        notes: 'Camped by the edge of the Glimmering Forest. Current marching order: Dorus (Front), Lyra (Scout), Roland (Rear). Ration supplies: 14 days.',
        reminders: [
          { id: 'rem-1', text: 'Watch for Frostwood wolf patrols at dusk', done: false },
          { id: 'rem-2', text: 'Lyra requires herbalist kit restock at next outpost', done: false },
          { id: 'rem-3', text: 'Check ancient sigil stone near Twin Gates', done: true }
        ]
      },

      isMapLocked: false,

      // Navigation & Studio State
      openStudio: (mapId = null, targetPinId = null) => {
        const targetMapId = mapId || get().activeMapId || 'map-nordhalla';
        set({
          isStudioOpen: true,
          activeMapId: targetMapId,
          selectedPinId: targetPinId || null,
          selectedWaypointId: null,
          isDrawingRoute: false,
          isFogToolActive: false,
          zoomLevel: 1,
          panOffset: { x: 0, y: 0 }
        });
      },

      closeStudio: () => {
        set({ isStudioOpen: false, selectedPinId: null, selectedWaypointId: null, isDrawingRoute: false, isFogToolActive: false });
      },

      setActiveMap: (mapId) => {
        set({ activeMapId: mapId, selectedPinId: null, selectedWaypointId: null, zoomLevel: 1, panOffset: { x: 0, y: 0 } });
      },

      setSelectedPin: (pinId) => {
        set({ selectedPinId: pinId, selectedWaypointId: null });
      },

      setSelectedWaypoint: (waypointId) => {
        set({ selectedWaypointId: waypointId, selectedPinId: null });
      },

      setZoomLevel: (zoom) => {
        set({ zoomLevel: typeof zoom === 'function' ? zoom(get().zoomLevel) : zoom });
      },

      setPanOffset: (offset) => {
        set({ panOffset: typeof offset === 'function' ? offset(get().panOffset) : offset });
      },

      resetView: () => {
        set({ zoomLevel: 1, panOffset: { x: 0, y: 0 } });
      },

      toggleGMMode: () => {
        set(state => ({ isGMMode: !state.isGMMode }));
      },

      toggleMapLock: () => {
        set(state => ({ isMapLocked: !state.isMapLocked }));
      },

      // Tools Toggle
      setRouteMode: (mode) => {
        set({ routeMode: mode });
      },

      setIsDrawingRoute: (active) => {
        const next = typeof active === 'boolean' ? active : !get().isDrawingRoute;
        set({
          isDrawingRoute: next,
          ...(next ? { isFogToolActive: false, selectedPinId: null, selectedWaypointId: null } : {})
        });
      },

      setIsFogToolActive: (active) => {
        const next = typeof active === 'boolean' ? active : !get().isFogToolActive;
        set({
          isFogToolActive: next,
          ...(next ? { isDrawingRoute: false, selectedPinId: null, selectedWaypointId: null } : {})
        });
      },

      setFogBrushMode: (mode) => {
        set({ fogBrushMode: mode });
      },

      setFogBrushSize: (size) => {
        set({ fogBrushSize: size });
      },

      // Fog of War Management
      setMapFogData: (mapId, strokes) => {
        set(state => ({
          mapFogData: {
            ...state.mapFogData,
            [mapId]: strokes
          }
        }));
      },

      addFogStroke: (mapId, stroke) => {
        set(state => {
          const currentStrokes = state.mapFogData[mapId] || [];
          return {
            mapFogData: {
              ...state.mapFogData,
              [mapId]: [...currentStrokes, { id: `fog-${Date.now()}-${Math.random()}`, ...stroke }]
            }
          };
        });
      },

      clearMapFog: (mapId) => {
        set(state => ({
          mapFogData: {
            ...state.mapFogData,
            [mapId]: []
          }
        }));
      },

      shroudAllMap: (mapId) => {
        set(state => ({
          mapFogData: {
            ...state.mapFogData,
            [mapId]: [{ id: `fog-full-${Date.now()}`, x: 50, y: 50, radius: 2400, isReveal: false, isFullCover: true }]
          }
        }));
      },

      // Map Management
      createMap: (mapData) => {
        const newMap = {
          id: `map-${Date.now()}`,
          name: mapData.name || 'New Regional Map',
          type: mapData.type || 'region',
          imageUrl: mapData.imageUrl,
          parentMapId: mapData.parentMapId || null,
          description: mapData.description || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          maps: [...state.maps, newMap],
          activeMapId: newMap.id,
          selectedPinId: null
        }));

        return newMap;
      },

      updateMap: (mapId, updates) => {
        set(state => ({
          maps: state.maps.map(m =>
            m.id === mapId
              ? { ...m, ...updates, updatedAt: new Date().toISOString() }
              : m
          )
        }));
      },

      deleteMap: (mapId) => {
        set(state => {
          const remainingMaps = state.maps.filter(m => m.id !== mapId);
          const remainingPins = state.pins.filter(p => p.mapId !== mapId);
          const remainingWaypoints = state.journeyWaypoints.filter(w => w.mapId !== mapId);
          return {
            maps: remainingMaps,
            pins: remainingPins,
            journeyWaypoints: remainingWaypoints,
            activeMapId: remainingMaps[0]?.id || null,
            selectedPinId: null,
            selectedWaypointId: null
          };
        });
      },

      // Pin Management
      addPin: (pinData) => {
        const newPin = {
          id: `pin-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          mapId: pinData.mapId || get().activeMapId,
          x: pinData.x ?? 50,
          y: pinData.y ?? 50,
          title: pinData.title || 'New Landmark',
          description: pinData.description || '',
          icon: pinData.icon || 'fa-location-dot',
          color: pinData.color || '#d4af37',
          type: pinData.type || 'poi',
          layerId: pinData.layerId || 'poi',
          isSecretGM: Boolean(pinData.isSecretGM),
          targetMapId: pinData.targetMapId || null,
          linkedLoreId: pinData.linkedLoreId || null,
          isDiscovered: pinData.isDiscovered !== false,
          isLocked: Boolean(pinData.isLocked)
        };

        set(state => ({
          pins: [...state.pins, newPin],
          selectedPinId: newPin.id
        }));

        return newPin;
      },

      updatePin: (pinId, updates) => {
        set(state => ({
          pins: state.pins.map(p =>
            p.id === pinId ? { ...p, ...updates } : p
          )
        }));
      },

      updatePinPosition: (pinId, x, y) => {
        if (get().isMapLocked) return;
        set(state => ({
          pins: state.pins.map(p =>
            p.id === pinId && !p.isLocked ? { ...p, x, y } : p
          )
        }));
      },

      removePin: (pinId) => {
        set(state => ({
          pins: state.pins.filter(p => p.id !== pinId),
          selectedPinId: state.selectedPinId === pinId ? null : state.selectedPinId
        }));
      },

      togglePinPlayerVisibility: (pinId) => {
        set(state => ({
          pins: state.pins.map(p =>
            p.id === pinId
              ? { ...p, isSecretGM: !p.isSecretGM, isDiscovered: p.isSecretGM ? true : p.isDiscovered }
              : p
          )
        }));
      },

      // Layer Management
      toggleLayerVisibility: (layerId) => {
        set(state => ({
          layers: state.layers.map(l =>
            l.id === layerId ? { ...l, isVisible: !l.isVisible } : l
          )
        }));
      },

      // Journey Trails & Waypoint Traversal
      addJourneyWaypoint: (waypointData) => {
        const targetMapId = waypointData.mapId || get().activeMapId || 'map-mythril-world';
        const currentMapWaypoints = get().journeyWaypoints.filter(w => (w.mapId || 'map-mythril-world') === targetMapId);
        const lastWp = currentMapWaypoints[currentMapWaypoints.length - 1];
        const activeRouteMode = waypointData.routeMode || get().routeMode || 'days';

        let nextDay = 1;
        let nextStop = currentMapWaypoints.length + 1;
        const dayType = waypointData.dayType || (activeRouteMode === 'stops' ? 'stop' : 'day');

        if (lastWp) {
          const lastEndDay = Number(lastWp.endDay) || Number(lastWp.day) || 1;
          nextDay = lastEndDay + 1;
          if (lastWp.stopNumber) {
            nextStop = Number(lastWp.stopNumber) + 1;
          }
        }

        const calculatedDay = waypointData.day !== undefined ? Number(waypointData.day) : nextDay;
        const calculatedEndDay = waypointData.endDay ? Number(waypointData.endDay) : null;
        const calculatedStop = waypointData.stopNumber !== undefined ? (waypointData.stopNumber ? Number(waypointData.stopNumber) : null) : (dayType === 'stop' ? nextStop : null);

        let defaultTitle = `Day ${calculatedDay} Encampment`;
        if (dayType === 'stop') {
          defaultTitle = `Stop ${calculatedStop || nextStop}`;
        } else if (calculatedEndDay && calculatedEndDay > calculatedDay) {
          defaultTitle = `Days ${calculatedDay}–${calculatedEndDay} Encampment`;
        }

        const newWaypoint = {
          id: `wp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          mapId: targetMapId,
          x: waypointData.x,
          y: waypointData.y,
          title: waypointData.title || defaultTitle,
          dayType: dayType,
          day: calculatedDay,
          endDay: calculatedEndDay,
          stayDuration: waypointData.stayDuration || (calculatedEndDay ? (calculatedEndDay - calculatedDay + 1) : 1),
          stopNumber: calculatedStop,
          customLabel: waypointData.customLabel || null,
          notes: waypointData.notes || '',
          isSecretGM: Boolean(waypointData.isSecretGM),
          isDiscovered: waypointData.isDiscovered !== false,
          isLocked: Boolean(waypointData.isLocked)
        };

        set(state => ({
          journeyWaypoints: [...state.journeyWaypoints, newWaypoint],
          selectedWaypointId: waypointData.selectImmediately ? newWaypoint.id : null
        }));

        return newWaypoint;
      },

      updateJourneyWaypoint: (waypointId, updates) => {
        set(state => ({
          journeyWaypoints: state.journeyWaypoints.map(w =>
            w.id === waypointId ? { ...w, ...updates } : w
          )
        }));
      },

      updateWaypointPosition: (waypointId, x, y) => {
        if (get().isMapLocked) return;
        set(state => ({
          journeyWaypoints: state.journeyWaypoints.map(w =>
            w.id === waypointId && !w.isLocked ? { ...w, x, y } : w
          )
        }));
      },

      removeJourneyWaypoint: (waypointId) => {
        set(state => ({
          journeyWaypoints: state.journeyWaypoints.filter(w => w.id !== waypointId),
          selectedWaypointId: state.selectedWaypointId === waypointId ? null : state.selectedWaypointId
        }));
      },

      clearJourneyTrail: (mapId = null) => {
        const targetMapId = mapId || get().activeMapId || 'map-mythril-world';
        set(state => ({
          journeyWaypoints: state.journeyWaypoints.filter(w => (w.mapId || 'map-mythril-world') !== targetMapId),
          selectedWaypointId: null
        }));
      },

      setPartyMarkerPosition: (x, y, mapId = null) => {
        const targetMapId = mapId || get().activeMapId;
        set(state => ({
          partyMarker: {
            ...(state.partyMarker || {}),
            x,
            y,
            mapId: targetMapId,
            name: state.partyMarker?.name || 'The Party'
          }
        }));
      },

      updatePartyMarker: (updates) => {
        set(state => ({
          partyMarker: {
            ...(state.partyMarker || {}),
            ...updates
          }
        }));
      },

      // Breadcrumb ancestry resolver
      getMapBreadcrumbs: (mapId) => {
        const maps = get().maps;
        const crumbs = [];
        let curr = maps.find(m => m.id === (mapId || get().activeMapId));
        while (curr) {
          crumbs.unshift(curr);
          curr = curr.parentMapId ? maps.find(m => m.id === curr.parentMapId) : null;
        }
        return crumbs;
      },

      // Cloud Synchronization
      syncToCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'interactiveMaps');
          await setDoc(docRef, {
            maps: get().maps,
            pins: get().pins,
            journeyWaypoints: get().journeyWaypoints,
            partyMarker: get().partyMarker,
            mapFogData: get().mapFogData,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.debug('Interactive maps cloud sync skipped:', err?.message || err);
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'interactiveMaps');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.maps) set({ maps: data.maps });
            if (data.pins) set({ pins: data.pins });
            if (data.journeyWaypoints) set({ journeyWaypoints: data.journeyWaypoints });
            if (data.partyMarker) set({ partyMarker: data.partyMarker });
            if (data.mapFogData) set({ mapFogData: data.mapFogData });
          }
        } catch (err) {
          console.debug('Interactive maps cloud hydration skipped:', err?.message || err);
        }
      }
    }),
    createStorageConfig('mythrill_interactive_maps_storage', {
      partialize: (state) => ({
        maps: state.maps,
        pins: state.pins,
        activeMapId: state.activeMapId,
        journeyWaypoints: state.journeyWaypoints,
        partyMarker: state.partyMarker,
        mapFogData: state.mapFogData
      })
    })
  )
);

export default useInteractiveMapStore;
