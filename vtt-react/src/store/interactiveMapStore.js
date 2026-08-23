import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

// Built-in starter interactive maps with hierarchical drilldown (World -> Continent -> Region -> Dungeon)
const DEFAULT_STARTER_MAPS = [];

const DEFAULT_STARTER_PINS = [];

const DEFAULT_LAYERS = [
  { id: 'terrain', name: 'Geography & Landmarks', isVisible: true, isGMOnly: false, icon: 'fa-mountain' },
  { id: 'poi', name: 'Cities, Taverns & Quests', isVisible: true, isGMOnly: false, icon: 'fa-city' },
  { id: 'political', name: 'Political Borders', isVisible: true, isGMOnly: false, icon: 'fa-flag' },
  { id: 'journey', name: 'Party Journey Trail', isVisible: true, isGMOnly: false, icon: 'fa-route' },
  { id: 'fog', name: 'Fog of War (Shroud)', isVisible: true, isGMOnly: false, icon: 'fa-smog' },
  { id: 'secrets', name: 'GM Secrets & Traps', isVisible: true, isGMOnly: true, icon: 'fa-eye-slash' }
];

const DEFAULT_WAYPOINTS = [];

const useInteractiveMapStore = create(
  persist(
    (set, get) => ({
      maps: DEFAULT_STARTER_MAPS,
      pins: DEFAULT_STARTER_PINS,
      layers: DEFAULT_LAYERS,
      activeMapId: null,
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
      partyMarker: null,

      isMapLocked: false,

      // Navigation & Studio State
      openStudio: (mapId = null, targetPinId = null) => {
        const availableMaps = get().maps || [];
        const targetMapId = mapId || (availableMaps.length > 0 ? (get().activeMapId || availableMaps[0]?.id) : null);
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
        const pinSize = pinData.size || 'medium';
        const pinScale = pinData.scale !== undefined 
          ? pinData.scale 
          : (pinSize === 'small' ? 0.75 : pinSize === 'large' ? 1.35 : pinSize === 'epic' ? 1.75 : 1.0);

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
          size: pinSize,
          scale: pinScale,
          layerId: pinData.layerId || 'poi',
          isSecretGM: Boolean(pinData.isSecretGM),
          targetMapId: pinData.targetMapId || null,
          linkedLoreId: pinData.linkedLoreId || null,
          isDiscovered: pinData.isDiscovered !== false,
          isLocked: Boolean(pinData.isLocked),
          // Campaign linkage — all optional, additive
          linkedEntities: pinData.linkedEntities || {
            npcIds: [],
            factionIds: [],
            questIds: [],
            timelineEventIds: [],
            locationId: null,
            journalNotes: ''
          }
        };

        set(state => ({
          pins: [...state.pins, newPin],
          selectedPinId: newPin.id
        }));

        return newPin;
      },

      loadMythrilWorldPreset: () => {
        const existing = get().maps.find(m => m.id === 'map-mythril-world');
        if (existing) {
          set({ activeMapId: existing.id });
          return existing;
        }
        const publicUrl = process.env.PUBLIC_URL || '';
        const mythrilMap = {
          id: 'map-mythril-world',
          name: 'Mythril — Known World',
          type: 'world',
          imageUrl: `${publicUrl}/assets/images/backgrounds/Mythril.jpeg`,
          parentMapId: null,
          description: 'The vast realm of Mythril, forged across sundering epochs.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set(state => ({
          maps: [mythrilMap, ...state.maps],
          activeMapId: mythrilMap.id,
          selectedPinId: null,
          selectedWaypointId: null
        }));
        return mythrilMap;
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
