import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import useGameStore from './gameStore';
import useAuthStore from './authStore';
import { checkDiceRollRateLimit } from '../utils/validationUtils';

export const DICE_TYPES = {
  d4: { id: 'd4', name: 'D4', sides: 4, icon: 'fas fa-caret-up', color: '#ff6b6b', geometry: 'tetrahedron' },
  d6: { id: 'd6', name: 'D6', sides: 6, icon: 'fas fa-dice-d6', color: '#4ecdc4', geometry: 'box' },
  d8: { id: 'd8', name: 'D8', sides: 8, icon: 'fas fa-gem', color: '#45b7d1', geometry: 'octahedron' },
  d10: { id: 'd10', name: 'D10', sides: 10, icon: 'fas fa-diamond', color: '#96ceb4', geometry: 'pentagonal_trapezohedron' },
  d12: { id: 'd12', name: 'D12', sides: 12, icon: 'fas fa-cube', color: '#feca57', geometry: 'dodecahedron' },
  d20: { id: 'd20', name: 'D20', sides: 20, icon: 'fas fa-dice-d20', color: '#ff9ff3', geometry: 'icosahedron' },
  dpercent: { id: 'dpercent', name: 'D%', sides: 10, icon: 'fas fa-percent', color: '#a29bfe', geometry: 'percentile_trapezohedron' },
  d100: { id: 'd100', name: 'D100', sides: 100, icon: 'fas fa-coins', color: '#54a0ff', geometry: 'percentile_pair' },
};

export const DICE_PRESETS = {
  classic: {
    id: 'classic',
    name: 'Classic Obsidian',
    icon: 'fas fa-dice-d20',
    bodyColor: '#1a0f30',
    edgeColor: '#dbb85c',
    numberColor: '#dbb85c',
    emissive: '#1a0f30',
    emissiveIntensity: 0.15,
    transparent: false,
    opacity: 1.0,
    innerEffect: null,
    outerEffect: null,
    glowColor: '#dbb85c',
    glowIntensity: 0.3,
    groundColor: '#14141c',
    roughness: 0.2,
    metalness: 0.6,
  },
  frozen: {
    id: 'frozen',
    name: 'Glacial Frost',
    icon: 'fas fa-snowflake',
    bodyColor: '#16406e',
    edgeColor: '#a8dcff',
    numberColor: '#e8f7ff',
    emissive: '#2a6ab8',
    emissiveIntensity: 0.7,
    transparent: false,
    opacity: 1.0,
    innerEffect: 'frost',
    innerColor: '#4499ff',
    outerEffect: 'frost',
    outerColor: '#a8dcff',
    glowColor: '#44aaff',
    glowIntensity: 0.8,
    groundColor: '#0a1525',
    roughness: 0.15,
    metalness: 0.7,
  },
  fiery: {
    id: 'fiery',
    name: 'Infernal Flame',
    icon: 'fas fa-fire',
    bodyColor: '#4a1600',
    edgeColor: '#ff9555',
    numberColor: '#ffe08a',
    emissive: '#bb3300',
    emissiveIntensity: 0.8,
    transparent: false,
    opacity: 1.0,
    innerEffect: 'fire',
    innerColor: '#ff7722',
    outerEffect: 'fire',
    outerColor: '#ff7722',
    glowColor: '#ff4400',
    glowIntensity: 1.0,
    groundColor: '#1a0e08',
    roughness: 0.25,
    metalness: 0.5,
  },
  dark: {
    id: 'dark',
    name: 'Abyssal Void',
    icon: 'fas fa-moon',
    bodyColor: '#120024',
    edgeColor: '#aa55cc',
    numberColor: '#cc88ee',
    emissive: '#440088',
    emissiveIntensity: 0.7,
    transparent: false,
    opacity: 1.0,
    innerEffect: 'void',
    innerColor: '#7733bb',
    outerEffect: 'void',
    outerColor: '#9944dd',
    glowColor: '#8833cc',
    glowIntensity: 0.9,
    groundColor: '#06000c',
    roughness: 0.3,
    metalness: 0.4,
  },
  nature: {
    id: 'nature',
    name: 'Verdant Sylvan',
    icon: 'fas fa-leaf',
    bodyColor: '#143a14',
    edgeColor: '#55cc44',
    numberColor: '#99ee66',
    emissive: '#1a551a',
    emissiveIntensity: 0.6,
    transparent: false,
    opacity: 1.0,
    innerEffect: 'nature',
    innerColor: '#33aa44',
    outerEffect: 'nature',
    outerColor: '#55cc33',
    glowColor: '#44cc33',
    glowIntensity: 0.7,
    groundColor: '#0a180a',
    roughness: 0.35,
    metalness: 0.3,
  },
  storm: {
    id: 'storm',
    name: 'Tempest Storm',
    icon: 'fas fa-bolt',
    bodyColor: '#14143a',
    edgeColor: '#7799ff',
    numberColor: '#aaccff',
    emissive: '#2233aa',
    emissiveIntensity: 0.8,
    transparent: false,
    opacity: 1.0,
    innerEffect: 'lightning',
    innerColor: '#5577ff',
    outerEffect: 'lightning',
    outerColor: '#88aaff',
    glowColor: '#6688ff',
    glowIntensity: 1.0,
    groundColor: '#080820',
    roughness: 0.2,
    metalness: 0.6,
  },
};

const initialState = {
  selectedDice: [],
  isRolling: false,
  rollResults: [],
  rollHistory: [],
  isDiceBarVisible: true,
  selectedTheme: 'classic',
  activePreset: 'classic',
  diceColor: '#14092b',
  rollContext: null,
  skillOutcome: null,
  physicsSettings: {
    gravity: -9.81,
    restitution: 0.6,
    friction: 0.4,
    rollForce: 15,
    spinForce: 10,
  },
  animationSettings: {
    throwDuration: 2000,
    settleDuration: 1000,
    fadeOutDuration: 3000,
  },
};

const useDiceStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      addDice: (diceType, quantity = 1) => set(state => {
        const existingDice = state.selectedDice.find(d => d.type === diceType);
        if (existingDice) {
          return {
            selectedDice: state.selectedDice.map(d =>
              d.type === diceType
                ? { ...d, quantity: Math.min(d.quantity + quantity, 10) }
                : d
            )
          };
        }
        return {
          selectedDice: [
            ...state.selectedDice,
            { id: `${diceType}_${Date.now()}`, type: diceType, quantity: Math.min(quantity, 10) }
          ]
        };
      }),

      removeDice: (diceType, quantity = 1) => {
        set(state => ({
          selectedDice: state.selectedDice
            .map(d => d.type === diceType ? { ...d, quantity: Math.max(d.quantity - quantity, 0) } : d)
            .filter(d => d.quantity > 0)
        }));
      },

      clearSelectedDice: () => set({ selectedDice: [] }),

      setDiceQuantity: (diceType, quantity) => set(state => {
        if (quantity <= 0) {
          return { selectedDice: state.selectedDice.filter(d => d.type !== diceType) };
        }
        const existingDice = state.selectedDice.find(d => d.type === diceType);
        if (existingDice) {
          return {
            selectedDice: state.selectedDice.map(d =>
              d.type === diceType ? { ...d, quantity: Math.min(quantity, 10) } : d
            )
          };
        }
        return {
          selectedDice: [
            ...state.selectedDice,
            { id: `${diceType}_${Date.now()}`, type: diceType, quantity: Math.min(quantity, 10) }
          ]
        };
      }),

      startRoll: (context = null) => {
        const { user } = useAuthStore.getState();
        if (user && !user.isGuest) {
          const rateLimitCheck = checkDiceRollRateLimit(user.uid);
          if (!rateLimitCheck.allowed) {
            console.warn('Dice roll rate limit exceeded.');
            return;
          }
        }
        set({ isRolling: true, rollResults: [], rollContext: context });
      },

      finishRoll: (results) => set(state => {
        const validResults = Array.isArray(results) ? results.filter(r => r && r.value !== undefined && r.value !== null && r.value > 0) : [];
        const shouldAddToHistory = validResults.length > 0 && state.selectedDice.length > 0;
        let newHistory = state.rollHistory;
        if (shouldAddToHistory) {
          const rollEntry = {
            id: `roll_${Date.now()}`,
            timestamp: new Date().toISOString(),
            dice: state.selectedDice.map(d => ({ ...d })),
            results: validResults,
            total: validResults.reduce((sum, result) => sum + result.value, 0)
          };
          newHistory = [rollEntry, ...state.rollHistory.slice(0, 49)];
        }
        return {
          isRolling: false,
          rollResults: validResults.length > 0 ? validResults : results,
          rollHistory: newHistory,
          rollContext: null,
          skillOutcome: null
        };
      }),

      syncDiceRoll: (results) => {
        const state = get();
        if (results && Array.isArray(results) && results.length > 0 && state.selectedDice.length > 0) {
          const rollEntry = {
            id: `roll_${Date.now()}`,
            timestamp: new Date().toISOString(),
            dice: state.selectedDice.map(d => ({ ...d })),
            results: results,
            total: results.reduce((sum, result) => sum + result.value, 0)
          };
          get().syncDiceUpdate('dice_rolled', rollEntry);
        }
      },

      toggleDiceBar: () => set(state => ({ isDiceBarVisible: !state.isDiceBarVisible })),
      setTheme: (theme) => set({ selectedTheme: theme }),
      setDiceColor: (color) => set({ diceColor: color }),
      setDicePreset: (presetId) => set({ activePreset: presetId }),

      updatePhysicsSettings: (settings) => set(state => ({
        physicsSettings: { ...state.physicsSettings, ...settings }
      })),

      updateAnimationSettings: (settings) => set(state => ({
        animationSettings: { ...state.animationSettings, ...settings }
      })),

      getTotalDiceCount: () => get().selectedDice.reduce((total, dice) => total + dice.quantity, 0),

      getDiceByType: (diceType) => get().selectedDice.find(d => d.type === diceType),

      getFormattedRollString: () => {
        const state = get();
        if (state.selectedDice.length === 0) return '';
        return state.selectedDice.map(dice => `${dice.quantity}${dice.type}`).join(' + ');
      },

      clearRollHistory: () => set({ rollHistory: [] }),

      syncDiceUpdate: (updateType, data) => {
        const gameStore = useGameStore.getState();
        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
          gameStore.multiplayerSocket.emit('dice_update', {
            type: updateType,
            data: data,
            timestamp: Date.now()
          });
        }
      }
    }),
    createStorageConfig('dice-store', {
      partialize: (state) => ({
        selectedTheme: state.selectedTheme,
        isDiceBarVisible: state.isDiceBarVisible,
        physicsSettings: state.physicsSettings,
        animationSettings: state.animationSettings,
        rollHistory: state.rollHistory.slice(0, 10),
        diceColor: state.diceColor,
        activePreset: state.activePreset,
      })
    })
  )
);

// Expose for debugging/manual testing (matches window.combatStore / window.gameStore conventions)
if (typeof window !== 'undefined') {
  window.diceStore = useDiceStore;
}

export default useDiceStore;
