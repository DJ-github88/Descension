import { create } from 'zustand';

const STORAGE_KEY = 'mythrill-window-positions';

const loadSavedPositions = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const savePositions = (positions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {}
};

const useWindowStore = create((set, get) => ({
  positions: loadSavedPositions(),

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
}));

export default useWindowStore;
