import { create } from 'zustand';
import useGameStore from './gameStore';

/**
 * Z-Index Management Store
 * 
 * Centralized z-index management for all windows, modals, and overlays.
 * Ensures proper stacking order and prevents z-index conflicts.
 * 
 * Z-Index Ranges:
 * - Regular windows (MythrillWindow, ContainerWindow): 1000-1999
 * - Modals (ItemWizard, ContainerWizard, etc.): 2000-2999
 * - Tooltips/Context menus: 3000-3999
 * - TooltipPortal (reserved): 2147483647 (max z-index)
 */

const Z_INDEX_RANGES = {
  BASE_WINDOW: 1000,
  MODAL: 2000,
  TOOLTIP: 3000,
};

const CASCADE_STEP = 30;
const CASCADE_MAX = 300;

const POSITION_STORAGE_KEY = 'mythrill-window-positions';

const loadSavedPositions = () => {
  try {
    const saved = localStorage.getItem(POSITION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const savePositions = (positions) => {
  try {
    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(positions));
  } catch {}
};

const useWindowManagerStore = create((set, get) => ({
  // State
  windows: new Map(), // windowId -> { zIndex, type }
  nextWindowZ: Z_INDEX_RANGES.BASE_WINDOW,
  nextModalZ: Z_INDEX_RANGES.MODAL,
  
  // Tracking dragging/resizing state
  draggingWindowId: null,
  resizingWindowId: null,

  // Layout management
  layoutVersion: 0,

  // Persisted per-window position/size (localStorage-backed)
  positions: loadSavedPositions(),
  
  /**
   * Register a new window or modal
   * @param {string} id - Unique identifier for the window
   * @param {string} type - 'window' or 'modal'
   * @returns {number} The assigned z-index
   */
  registerWindow: (id, type = 'window', onClose = null) => {
    const { windows, nextWindowZ, nextModalZ } = get();
    
    // If already registered, update onClose and bring to front instead
    if (windows.has(id)) {
      const existing = windows.get(id);
      const newWindows = new Map(windows);
      newWindows.set(id, { ...existing, onClose });
      set({ windows: newWindows });
      return get().bringToFront(id);
    }
    
    const zIndex = type === 'modal' ? nextModalZ : nextWindowZ;
    const newWindows = new Map(windows);
    newWindows.set(id, { zIndex, type, onClose });
    
    set({
      windows: newWindows,
      nextWindowZ: type === 'window' ? nextWindowZ + 1 : nextWindowZ,
      nextModalZ: type === 'modal' ? nextModalZ + 1 : nextModalZ,
    });

    // Sync with multiplayer
    get().syncWindowUpdate('window_registered', { id, type, zIndex });

    return zIndex;
  },
  
  /**
   * Bring a window or modal to the front
   * @param {string} id - Window identifier
   * @returns {number} The new z-index
   */
  bringToFront: (id) => {
    const { windows, nextWindowZ, nextModalZ } = get();
    const window = windows.get(id);
    
    if (!window) {
      console.warn(`Window ${id} not found in window manager`);
      return null;
    }
    
    // Assign new z-index from the appropriate range
    const newZIndex = window.type === 'modal' ? nextModalZ : nextWindowZ;
    const newWindows = new Map(windows);
    newWindows.set(id, { ...window, zIndex: newZIndex });
    
    set({
      windows: newWindows,
      nextWindowZ: window.type === 'window' ? nextWindowZ + 1 : nextWindowZ,
      nextModalZ: window.type === 'modal' ? nextModalZ + 1 : nextModalZ,
    });

    // Sync with multiplayer
    get().syncWindowUpdate('window_focused', { id, newZIndex });

    return newZIndex;
  },
  
  /**
   * Unregister a window or modal (cleanup on unmount)
   * @param {string} id - Window identifier
   */
  unregisterWindow: (id) => {
    const { windows } = get();
    const newWindows = new Map(windows);
    newWindows.delete(id);
    set({ windows: newWindows });

    // Sync with multiplayer
    get().syncWindowUpdate('window_unregistered', { id });
  },
  
  /**
   * Get the current z-index for a window
   * @param {string} id - Window identifier
   * @returns {number|undefined} The z-index or undefined if not found
   */
  getZIndex: (id) => {
    return get().windows.get(id)?.zIndex;
  },
  
  /**
   * Get z-index for tooltip/context menu
   * Tooltips always appear above windows and modals
   * @returns {number} Z-index for tooltips
   */
  getTooltipZIndex: () => {
    return Z_INDEX_RANGES.TOOLTIP;
  },

  // Multiplayer Synchronization
  syncWindowUpdate: (updateType, data) => {
    const gameStore = useGameStore.getState();
    if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
      gameStore.multiplayerSocket.emit('window_update', {
        type: updateType,
        data: data,
        timestamp: Date.now()
      });
    }
  },

  /**
   * Get all registered window IDs
   * @returns {Array<string>} Array of window IDs
   */
  getAllWindowIds: () => {
    return Array.from(get().windows.keys());
  },

  /**
   * Set the ID of the window being dragged
   */
  setDraggingWindowId: (id) => set({ draggingWindowId: id }),

  /**
   * Set the ID of the window being resized
   */
  setResizingWindowId: (id) => set({ resizingWindowId: id }),

  getWindowPosition: (windowId, defaultPos = { x: 100, y: 100 }) => {
    const saved = get().positions[windowId];
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
      return { x: saved.x, y: saved.y };
    }
    return defaultPos;
  },

  getWindowSize: (windowId, defaultSize = { width: 800, height: 600 }) => {
    const saved = get().positions[windowId];
    if (saved && typeof saved.width === 'number' && typeof saved.height === 'number') {
      return { width: saved.width, height: saved.height };
    }
    return defaultSize;
  },

  setWindowPosition: (windowId, position) => {
    set(state => {
      const existing = state.positions[windowId] || {};
      const updated = {
        ...state.positions,
        [windowId]: { ...existing, x: position.x, y: position.y }
      };
      savePositions(updated);
      return { positions: updated };
    });
  },

  setWindowSize: (windowId, size) => {
    set(state => {
      const existing = state.positions[windowId] || {};
      const updated = {
        ...state.positions,
        [windowId]: { ...existing, width: size.width, height: size.height }
      };
      savePositions(updated);
      return { positions: updated };
    });
  },

  clearWindowPosition: (windowId) => {
    set(state => {
      const { [windowId]: _, ...rest } = state.positions;
      savePositions(rest);
      return { positions: rest };
    });
  },

  /**
   * Get a cascade offset based on the number of currently-open windows.
   * Used to prevent new windows from piling at the same (x, y).
   * @returns {{ x: number, y: number }}
   */
  getCascadeOffset: () => {
    const count = get().windows.size;
    const offset = Math.min(count * CASCADE_STEP, CASCADE_MAX);
    return { x: offset, y: offset };
  },

  /**
   * Reset all open windows to their default positions.
   * Bumps layoutVersion; windows watching it re-initialise.
   */
  updateWindowOnClose: (id, onClose) => {
    const { windows } = get();
    if (windows.has(id)) {
      const win = windows.get(id);
      // Skip the update entirely when the reference is unchanged. This avoids
      // creating a new Map and notifying subscribers for a no-op, which can
      // otherwise cause infinite render loops when callers pass inline
      // functions.
      if (win.onClose === onClose) return;
      const newWindows = new Map(windows);
      newWindows.set(id, { ...win, onClose });
      set({ windows: newWindows });
    }
  },

  closeTopmostWindow: () => {
    const { windows } = get();
    if (windows.size === 0) return false;
    
    let topmostId = null;
    let highestZ = -Infinity;
    for (const [id, win] of windows.entries()) {
      if (win.zIndex > highestZ && typeof win.onClose === 'function') {
        highestZ = win.zIndex;
        topmostId = id;
      }
    }
    
    if (topmostId) {
      const win = windows.get(topmostId);
      if (typeof win.onClose === 'function') {
        win.onClose();
        return true;
      }
    }
    return false;
  },

  resetLayout: () => {
    set((state) => ({ layoutVersion: state.layoutVersion + 1 }));
    get().syncWindowUpdate('layout_reset', {});
  },
}));

export default useWindowManagerStore;

