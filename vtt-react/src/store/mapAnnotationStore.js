import { create } from 'zustand';
import mapAnnotationService from '../services/mapAnnotationService';

let unsubPins = null;
let unsubAreas = null;
let unsubShares = null;

const useMapAnnotationStore = create((set, get) => ({
  pins: [],
  areas: [],
  shares: [],
  isLoading: false,
  error: null,

  /**
   * Sync all annotations and incoming shares
   */
  syncAnnotations: (userId) => {
    if (!userId) {
      set({ pins: [], areas: [], shares: [] });
      return;
    }

    set({ isLoading: true });

    // Clean up any existing listeners first
    get().cleanupSubscriptions();

    // Setup Pins Subscription
    unsubPins = mapAnnotationService.subscribeToPins(userId, (pinsList) => {
      set({ pins: pinsList || [], isLoading: false });
    });

    // Setup Areas Subscription
    unsubAreas = mapAnnotationService.subscribeToAreas(userId, (areasList) => {
      set({ areas: areasList || [], isLoading: false });
    });

    // Setup Incoming Shares Subscription
    unsubShares = mapAnnotationService.subscribeToIncomingShares(userId, (sharesList) => {
      set({ shares: sharesList || [], isLoading: false });
    });
  },

  /**
   * Unsubscribe from all Firestore listeners
   */
  cleanupSubscriptions: () => {
    if (unsubPins) {
      unsubPins();
      unsubPins = null;
    }
    if (unsubAreas) {
      unsubAreas();
      unsubAreas = null;
    }
    if (unsubShares) {
      unsubShares();
      unsubShares = null;
    }
  },

  /**
   * Pins CRUD Actions
   */
  addPin: async (userId, pinData) => {
    const newPin = {
      id: `pin-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: pinData.title || 'New Marker',
      description: pinData.description || '',
      note: pinData.note || '',
      x: pinData.x,
      y: pinData.y,
      pinType: pinData.pinType || 'custom',
      zoneId: pinData.zoneId || null,
      visibility: pinData.visibility || 'private',
      createdAt: new Date().toISOString()
    };

    set({ isLoading: true });
    const result = await mapAnnotationService.savePin(userId, newPin);
    set({ isLoading: false });

    if (result.success && mapAnnotationService.shouldUseLocalStorage(userId)) {
      // Trigger a local state refresh for local storage mode
      set(state => ({ pins: [...state.pins, newPin] }));
    }
    return result;
  },

  updatePin: async (userId, pinId, updates) => {
    const existingPin = get().pins.find(p => p.id === pinId);
    if (!existingPin) return { success: false, error: 'Pin not found' };

    const updatedPin = {
      ...existingPin,
      ...updates
    };

    set({ isLoading: true });
    const result = await mapAnnotationService.savePin(userId, updatedPin);
    set({ isLoading: false });

    if (result.success && mapAnnotationService.shouldUseLocalStorage(userId)) {
      set(state => ({
        pins: state.pins.map(p => p.id === pinId ? updatedPin : p)
      }));
    }
    return result;
  },

  deletePin: async (userId, pinId) => {
    set({ isLoading: true });
    const result = await mapAnnotationService.deletePin(userId, pinId);
    set({ isLoading: false });

    if (result.success && mapAnnotationService.shouldUseLocalStorage(userId)) {
      set(state => ({
        pins: state.pins.filter(p => p.id !== pinId)
      }));
    }
    return result;
  },

  /**
   * Areas CRUD Actions
   */
  addArea: async (userId, areaData) => {
    const newArea = {
      id: `area-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: areaData.title || 'New Territory',
      description: areaData.description || '',
      note: areaData.note || '',
      points: areaData.points || [],
      color: areaData.color || 'rgba(196, 164, 74, 0.25)',
      opacity: areaData.opacity || 0.25,
      visibility: areaData.visibility || 'private',
      status: areaData.status || 'discovered',
      createdAt: new Date().toISOString()
    };

    set({ isLoading: true });
    const result = await mapAnnotationService.saveArea(userId, newArea);
    set({ isLoading: false });

    if (result.success && mapAnnotationService.shouldUseLocalStorage(userId)) {
      set(state => ({ areas: [...state.areas, newArea] }));
    }
    return result;
  },

  updateArea: async (userId, areaId, updates) => {
    const existingArea = get().areas.find(a => a.id === areaId);
    if (!existingArea) return { success: false, error: 'Area not found' };

    const updatedArea = {
      ...existingArea,
      ...updates
    };

    set({ isLoading: true });
    const result = await mapAnnotationService.saveArea(userId, updatedArea);
    set({ isLoading: false });

    if (result.success && mapAnnotationService.shouldUseLocalStorage(userId)) {
      set(state => ({
        areas: state.areas.map(a => a.id === areaId ? updatedArea : a)
      }));
    }
    return result;
  },

  deleteArea: async (userId, areaId) => {
    set({ isLoading: true });
    const result = await mapAnnotationService.deleteArea(userId, areaId);
    set({ isLoading: false });

    if (result.success && mapAnnotationService.shouldUseLocalStorage(userId)) {
      set(state => ({
        areas: state.areas.filter(a => a.id !== areaId)
      }));
    }
    return result;
  },

  /**
   * Map Share Actions
   */
  shareView: async (userId, targetFriend, viewState, message) => {
    const shareData = {
      toUserId: targetFriend.id,
      toUserName: targetFriend.name || targetFriend.displayName,
      fromUserName: targetFriend.fromUserName || 'Someone',
      message: message || '',
      viewState: {
        centerX: viewState.centerX,
        centerY: viewState.centerY,
        zoom: viewState.zoom
      }
    };

    set({ isLoading: true });
    const result = await mapAnnotationService.createShare(userId, shareData);
    set({ isLoading: false });
    return result;
  },

  updateShareStatus: async (userId, shareId, status) => {
    set({ isLoading: true });
    const result = await mapAnnotationService.updateShareStatus(userId, shareId, status);
    if (result.success) {
      set(state => ({
        shares: state.shares.filter(s => s.id !== shareId)
      }));
    }
    set({ isLoading: false });
    return result;
  },

  deleteShare: async (userId, shareId) => {
    set({ isLoading: true });
    const result = await mapAnnotationService.deleteShare(userId, shareId);
    if (result.success) {
      set(state => ({
        shares: state.shares.filter(s => s.id !== shareId)
      }));
    }
    set({ isLoading: false });
    return result;
  }
}));

export default useMapAnnotationStore;
