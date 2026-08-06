import { create } from 'zustand';
import customMapService, { compressImageToDataUrl } from '../services/customMapService';

let unsubMaps = null;

const useCustomMapStore = create((set, get) => ({
  maps: [],
  currentMapId: null,
  // Draft zones for the map being edited (not yet persisted)
  draftZones: [],
  isLoading: false,
  error: null,

  currentMap: () => {
    const { maps, currentMapId } = get();
    return maps.find((m) => m.id === currentMapId) || null;
  },

  syncMaps: (userId) => {
    if (!userId) {
      if (unsubMaps) { unsubMaps(); unsubMaps = null; }
      set({ maps: [], currentMapId: null, draftZones: [] });
      return;
    }
    if (unsubMaps) unsubMaps();
    set({ isLoading: true });
    unsubMaps = customMapService.subscribeToMaps(userId, (maps) => {
      set({ maps, isLoading: false });
    });
  },

  cleanup: () => {
    if (unsubMaps) { unsubMaps(); unsubMaps = null; }
  },

  createNewMap: (name) => {
    const id = `cmap-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const map = {
      id,
      name: name || 'Untitled Map',
      image: null,
      width: 4096,
      height: 3072,
      zones: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set((s) => ({ maps: [map, ...s.maps], currentMapId: id, draftZones: [] }));
    return id;
  },

  selectMap: (mapId) => {
    const map = get().maps.find((m) => m.id === mapId);
    set({
      currentMapId: mapId,
      draftZones: map ? [...(map.zones || [])] : []
    });
  },

  setMapImage: (dataUrl, width, height) => {
    set((s) => ({
      maps: s.maps.map((m) =>
        m.id === s.currentMapId ? { ...m, image: dataUrl, width, height } : m
      )
    }));
  },

  addDraftZone: (zone) => {
    set((s) => ({ draftZones: [...s.draftZones, zone] }));
  },

  updateDraftZone: (zoneId, updates) => {
    set((s) => ({
      draftZones: s.draftZones.map((z) => (z.id === zoneId ? { ...z, ...updates } : z))
    }));
  },

  removeDraftZone: (zoneId) => {
    set((s) => ({ draftZones: s.draftZones.filter((z) => z.id !== zoneId) }));
  },

  renameMap: (mapId, name) => {
    set((s) => ({
      maps: s.maps.map((m) => (m.id === mapId ? { ...m, name } : m))
    }));
  },

  saveCurrentMap: async (userId) => {
    const { currentMapId, maps, draftZones } = get();
    if (!currentMapId || !userId) return { success: false };
    const map = maps.find((m) => m.id === currentMapId);
    if (!map) return { success: false };
    const record = { ...map, zones: draftZones, updatedAt: new Date().toISOString() };
    set({ isLoading: true });
    const result = await customMapService.saveMap(userId, record);
    set({ isLoading: false });
    if (result.success) {
      set((s) => ({
        maps: s.maps.map((m) => (m.id === currentMapId ? { ...m, zones: draftZones } : m))
      }));
    }
    return result;
  },

  deleteMap: async (userId, mapId) => {
    set({ isLoading: true });
    const result = await customMapService.deleteMap(userId, mapId);
    set({ isLoading: false });
    if (result.success) {
      set((s) => ({
        maps: s.maps.filter((m) => m.id !== mapId),
        currentMapId: s.currentMapId === mapId ? null : s.currentMapId,
        draftZones: s.currentMapId === mapId ? [] : s.draftZones
      }));
    }
    return result;
  },

  compressImageFile: (file) => compressImageToDataUrl(file)
}));

export default useCustomMapStore;
