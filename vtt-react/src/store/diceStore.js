import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useGameStore from './gameStore';
import useAuthStore from './authStore';
import { checkDiceRollRateLimit } from '../utils/validationUtils';

export const DICE_TYPES = {
  d4: { id: 'd4', name: 'D4', sides: 4, icon: '🔺', color: '#ff6b6b', geometry: 'tetrahedron' },
  d6: { id: 'd6', name: 'D6', sides: 6, icon: '⚀', color: '#4ecdc4', geometry: 'box' },
  d8: { id: 'd8', name: 'D8', sides: 8, icon: '🔸', color: '#45b7d1', geometry: 'octahedron' },
  d10: { id: 'd10', name: 'D10', sides: 10, icon: '🔟', color: '#96ceb4', geometry: 'pentagonal_trapezohedron' },
  d12: { id: 'd12', name: 'D12', sides: 12, icon: '🔷', color: '#feca57', geometry: 'dodecahedron' },
  d20: { id: 'd20', name: 'D20', sides: 20, icon: '⚀', color: '#ff9ff3', geometry: 'icosahedron' },
  dpercent: { id: 'dpercent', name: 'D%', sides: 10, icon: '0️⃣', color: '#a29bfe', geometry: 'percentile_trapezohedron' },
  d100: { id: 'd100', name: 'D100', sides: 100, icon: '💯', color: '#54a0ff', geometry: 'percentile_pair' },
};

export const DICE_PRESETS = {
  classic: {
    id: 'classic',
    name: 'Classic',
    icon: '◆',
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
    name: 'Frozen',
    icon: '❄',
    bodyColor: '#0d2847',
    edgeColor: '#6ec6ff',
    numberColor: '#b0e0ff',
    emissive: '#1a4a8a',
    emissiveIntensity: 0.7,
    transparent: false,
    opacity: 1.0,
    innerEffect: 'frost',
    innerColor: '#4499ff',
    outerEffect: 'frost',
    outerColor: '#88ccff',
    glowColor: '#44aaff',
    glowIntensity: 0.8,
    groundColor: '#0a1525',
    roughness: 0.15,
    metalness: 0.7,
  },
  fiery: {
    id: 'fiery',
    name: 'Fiery',
    icon: '🔥',
    bodyColor: '#3d1200',
    edgeColor: '#ff7733',
    numberColor: '#ffcc55',
    emissive: '#882200',
    emissiveIntensity: 0.8,
    transparent: false,
    opacity: 1.0,
    innerEffect: 'fire',
    innerColor: '#ff5500',
    outerEffect: 'fire',
    outerColor: '#ff6622',
    glowColor: '#ff4400',
    glowIntensity: 1.0,
    groundColor: '#1a0e08',
    roughness: 0.25,
    metalness: 0.5,
  },
  dark: {
    id: 'dark',
    name: 'Dark Void',
    icon: '🌑',
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
    name: 'Nature',
    icon: '🌿',
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
    name: 'Storm',
    icon: '⚡',
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

      startRoll: () => {
        const { user } = useAuthStore.getState();
        if (user && !user.isGuest) {
          const rateLimitCheck = checkDiceRollRateLimit(user.uid);
          if (!rateLimitCheck.allowed) {
            console.warn('Dice roll rate limit exceeded.');
            return;
          }
        }
        set({ isRolling: true, rollResults: [] });
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
          rollHistory: newHistory
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
    {
      name: 'dice-store',
      partialize: (state) => ({
        selectedTheme: state.selectedTheme,
        isDiceBarVisible: state.isDiceBarVisible,
        physicsSettings: state.physicsSettings,
        animationSettings: state.animationSettings,
        rollHistory: state.rollHistory.slice(0, 10),
        diceColor: state.diceColor,
        activePreset: state.activePreset,
      })
    }
  )
);

export default useDiceStore;
