import { create } from 'zustand';

const useSpellbookStore = create((set, get) => ({
  activeTab: 'wizard',
  windowPosition: null,
  windowSize: { width: 1200, height: 800 },
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setWindowPosition: (position) => set({ windowPosition: position }),
  setWindowSize: (size) => set({ windowSize: size })
}));

export default useSpellbookStore;
