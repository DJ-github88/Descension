import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useGameStore from './gameStore';
import useAuthStore from './authStore';
import { checkDiceRollRateLimit } from '../utils/validationUtils';

// Dice types with their properties
export const DICE_TYPES = {
  d4: {
    id: 'd4',
    name: 'D4',
    sides: 4,
    icon: '🔺',
    color: '#ff6b6b',
    geometry: 'tetrahedron'
  },
  d6: {
    id: 'd6',
    name: 'D6',
    sides: 6,
    icon: '⚀',
    color: '#4ecdc4',
    geometry: 'box'
  },
  d8: {
    id: 'd8',
    name: 'D8',
    sides: 8,
    icon: '🔸',
    color: '#45b7d1',
    geometry: 'octahedron'
  },
  d10: {
    id: 'd10',
    name: 'D10',
    sides: 10,
    icon: '🔟',
    color: '#96ceb4',
    geometry: 'pentagonal_trapezohedron'
  },
  d12: {
    id: 'd12',
    name: 'D12',
    sides: 12,
    icon: '🔷',
    color: '#feca57',
    geometry: 'dodecahedron'
  },
  d20: {
    id: 'd20',
    name: 'D20',
    sides: 20,
    icon: '⚀',
    color: '#ff9ff3',
    geometry: 'icosahedron'
  },
  d100: {
    id: 'd100',
    name: 'D100',
    sides: 100,
    icon: '💯',
    color: '#54a0ff',
    geometry: 'sphere'
  }
};

// Dice themes/skins
export const DICE_THEMES = {
  classic: {
    id: 'classic',
    name: 'Classic',
    material: 'plastic',
    roughness: 0.3,
    metalness: 0.1
  },
  metal: {
    id: 'metal',
    name: 'Metal',
    material: 'metal',
    roughness: 0.2,
    metalness: 0.8
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    material: 'stone',
    roughness: 0.8,
    metalness: 0.0
  },
  crystal: {
    id: 'crystal',
    name: 'Crystal',
    material: 'crystal',
    roughness: 0.0,
    metalness: 0.0,
    transparent: true,
    opacity: 0.8
  },
  bone: {
    id: 'bone',
    name: 'Bone',
    material: 'bone',
    roughness: 0.6,
    metalness: 0.0
  }
};

// Initial state
const initialState = {
  // Dice selection
  selectedDice: [], // Array of {type, quantity, id}
  
  // Rolling state
  isRolling: false,
  rollResults: [],
  rollHistory: [],
  
  // UI state
  isDiceBarVisible: true,
  selectedTheme: 'classic',
  
  // Physics settings
  physicsSettings: {
    gravity: -9.81,
    restitution: 0.6,
    friction: 0.4,
    rollForce: 15,
    spinForce: 10
  },
  
  // Animation settings
  animationSettings: {
    throwDuration: 2000,
    settleDuration: 1000,
    fadeOutDuration: 3000
  }
};

// Create the dice store
const useDiceStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Dice selection actions
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
        } else {
          return {
            selectedDice: [
              ...state.selectedDice,
              {
                id: `${diceType}_${Date.now()}`,
                type: diceType,
                quantity: Math.min(quantity, 10)
              }
            ]
          };
        }

        // Sync with multiplayer
        get().syncDiceUpdate('dice_added', { diceType, quantity: Math.min(quantity, 10) });
      }),

      removeDice: (diceType, quantity = 1) => {
        set(state => ({
          selectedDice: state.selectedDice
            .map(d =>
              d.type === diceType
                ? { ...d, quantity: Math.max(d.quantity - quantity, 0) }
                : d
            )
            .filter(d => d.quantity > 0)
        }));

        // Sync with multiplayer
        get().syncDiceUpdate('dice_removed', { diceType, quantity });
      },

      clearSelectedDice: () => set({ selectedDice: [] }),

      setDiceQuantity: (diceType, quantity) => set(state => {
        if (quantity <= 0) {
          return {
            selectedDice: state.selectedDice.filter(d => d.type !== diceType)
          };
        }
        
        const existingDice = state.selectedDice.find(d => d.type === diceType);
        if (existingDice) {
          return {
            selectedDice: state.selectedDice.map(d =>
              d.type === diceType
                ? { ...d, quantity: Math.min(quantity, 10) }
                : d
            )
          };
        } else {
          return {
            selectedDice: [
              ...state.selectedDice,
              {
                id: `${diceType}_${Date.now()}`,
                type: diceType,
                quantity: Math.min(quantity, 10)
              }
            ]
          };
        }

        // Sync with multiplayer
        get().syncDiceUpdate('dice_quantity_set', { diceType, quantity: Math.min(quantity, 10) });
      }),

      // Rolling actions
      startRoll: () => {
        const { user } = useAuthStore.getState();

        // Check rate limit for authenticated users
        if (user && !user.isGuest) {
          const rateLimitCheck = checkDiceRollRateLimit(user.uid);
          if (!rateLimitCheck.allowed) {
            console.warn('Dice roll rate limit exceeded. Please wait before rolling again.');
            // Could dispatch a notification here
            return;
          }
        }

        set({ isRolling: true, rollResults: [] });
      },

      finishRoll: (results) => set(state => {
        // Don't add to history if results is empty or invalid
        const validResults = Array.isArray(results) ? results.filter(r => r && r.value !== undefined && r.value !== null && r.value > 0) : [];

        // Only add to history if we have valid results
        const shouldAddToHistory = validResults.length > 0 && state.selectedDice.length > 0;

        let newHistory = state.rollHistory;
        let rollEntry = null;
        if (shouldAddToHistory) {
          rollEntry = {
            id: `roll_${Date.now()}`,
            timestamp: new Date().toISOString(),
            dice: state.selectedDice.map(d => ({ ...d })),
            results: validResults,
            total: validResults.reduce((sum, result) => sum + result.value, 0)
          };
          newHistory = [rollEntry, ...state.rollHistory.slice(0, 49)]; // Keep last 50 rolls
        }

        return {
          isRolling: false,
          rollResults: validResults.length > 0 ? validResults : results,
          rollHistory: newHistory
        };
      }),

      // Sync dice roll with multiplayer
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

      // UI actions
      toggleDiceBar: () => set(state => ({ isDiceBarVisible: !state.isDiceBarVisible })),

      setTheme: (theme) => set({ selectedTheme: theme }),

      // Settings actions
      updatePhysicsSettings: (settings) => set(state => ({
        physicsSettings: { ...state.physicsSettings, ...settings }
      })),

      updateAnimationSettings: (settings) => set(state => ({
        animationSettings: { ...state.animationSettings, ...settings }
      })),

      // Utility functions
      getTotalDiceCount: () => {
        const state = get();
        return state.selectedDice.reduce((total, dice) => total + dice.quantity, 0);
      },

      getDiceByType: (diceType) => {
        const state = get();
        return state.selectedDice.find(d => d.type === diceType);
      },

      getFormattedRollString: () => {
        const state = get();
        if (state.selectedDice.length === 0) return '';
        
        return state.selectedDice
          .map(dice => `${dice.quantity}${dice.type}`)
          .join(' + ');
      },

      // Clear history
      clearRollHistory: () => set({ rollHistory: [] }),

      // Multiplayer Synchronization
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
        rollHistory: state.rollHistory.slice(0, 10) // Only persist last 10 rolls
      })
    }
  )
);

export default useDiceStore;
