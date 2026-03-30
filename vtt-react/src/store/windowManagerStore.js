import { create } from 'zustand';
import useGameStore from './gameStore';

/**
 * Z-Index Management Store
 * 
 * Centralized z-index management for all windows, modals, and overlays.
 * Ensures proper stacking order and prevents z-index conflicts.
 * 
 * Z-Index Ranges:
 * - Regular windows (WowWindow, ContainerWindow): 1000-1999
 * - Modals (ItemWizard, ContainerWizard, etc.): 2000-2999
 * - Tooltips/Context menus: 3000-3999
 * - TooltipPortal (reserved): 2147483647 (max z-index)
 */

const Z_INDEX_RANGES = {
  BASE_WINDOW: 1000,
  MODAL: 2000,
  TOOLTIP: 3000,
};

const useWindowManagerStore = create((set, get) => ({
  // State
  windows: new Map(), // windowId -> { zIndex, type }
  nextWindowZ: Z_INDEX_RANGES.BASE_WINDOW,
  nextModalZ: Z_INDEX_RANGES.MODAL,
  
  /**
   * Register a new window or modal
   * @param {string} id - Unique identifier for the window
   * @param {string} type - 'window' or 'modal'
   * @returns {number} The assigned z-index
   */
  registerWindow: (id, type = 'window') => {
    const { windows, nextWindowZ, nextModalZ } = get();
    
    // If already registered, bring to front instead
    if (windows.has(id)) {
      return get().bringToFront(id);
    }
    
    const zIndex = type === 'modal' ? nextModalZ : nextWindowZ;
    const newWindows = new Map(windows);
    newWindows.set(id, { zIndex, type });
    
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
  }
}));

export default useWindowManagerStore;

