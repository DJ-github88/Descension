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

// Dice WEIGHT materials — physics profiles + PBR finish, independent of the
// visual theme. Physics (gravity/contact/damping/spin) is applied at throw
// time; the `visual` params override the die body's surface identity
// (metalness/roughness/tint/clearcoat/transparency) so the material also
// SHOWS. Mass itself is a no-op (all dice share it, so it cancels in every
// equation) — weight FEEL comes from fall speed, dead bounces, spin bleed.
export const DICE_MATERIALS = {
  steel: {
    id: 'steel',
    name: 'Steel',
    icon: 'fas fa-hammer',
    tile: 'linear-gradient(135deg, #d7dce2 0%, #9aa3ad 55%, #6f7883 100%)',
    glow: '#cfd6de',
    gravity: -76,
    restitution: 0.24,
    friction: 0.18,
    linearDamping: 0.012,
    angularDamping: 0.045,
    spinMul: 0.85,
    stiffness: 1e8,
    relaxation: 2.4,
    description: 'Heavy and dead — slams down hard, barely bounces, skids far across the table',
    visual: {
      tint: '#d6dae0',          // gunmetal — tints the theme paint cool/silver
      metalness: 0.92,
      roughness: 0.30,
      clearcoat: 0.55,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.25,
      transparent: false,
      opacity: 1.0,
    },
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    icon: 'fas fa-mountain',
    tile: 'linear-gradient(135deg, #a89f93 0%, #7a7267 55%, #4e483f 100%)',
    glow: '#b8ae9e',
    gravity: -62,
    restitution: 0.38,
    friction: 0.24,
    linearDamping: 0.012,
    angularDamping: 0.035,
    spinMul: 1.0,
    stiffness: 5e7,
    relaxation: 2.8,
    description: 'Balanced weight — a solid thud with a short roll-out',
    visual: {
      tint: '#9a9289',          // granitic gray-warm
      tintPainted: '#eae6df',   // near-neutral over theme paint — ice stays ice
      metalness: 0.0,
      roughness: 0.88,
      clearcoat: 0.04,
      clearcoatRoughness: 0.6,
      envMapIntensity: 0.45,
      transparent: false,
      opacity: 1.0,
    },
  },
  wood: {
    id: 'wood',
    name: 'Wood',
    icon: 'fas fa-tree',
    tile: 'linear-gradient(135deg, #b98a54 0%, #8a5a2e 55%, #54341a 100%)',
    glow: '#d9a86a',
    gravity: -52,
    restitution: 0.52,
    friction: 0.34,
    linearDamping: 0.014,
    angularDamping: 0.05,
    spinMul: 1.15,
    stiffness: 1e7,
    relaxation: 3.2,
    description: 'Light and lively — floats down slower, clatters and tumbles',
    visual: {
      tint: '#b3854d',          // warm polished timber
      tintPainted: '#efe6d2',   // pale over theme paint — frost still reads ice
      metalness: 0.0,
      roughness: 0.62,
      clearcoat: 0.28,          // lacquered sheen
      clearcoatRoughness: 0.35,
      envMapIntensity: 0.55,
      transparent: false,
      opacity: 1.0,
    },
  },
  glass: {
    id: 'glass',
    name: 'Glass',
    icon: 'fas fa-gem',
    tile: 'linear-gradient(135deg, #e6f4ff 0%, #a8c8e8 45%, #f2fafe 70%, #b8d4ea 100%)',
    glow: '#cfe8ff',
    gravity: -45,
    restitution: 0.58,
    friction: 0.22,
    linearDamping: 0.012,
    angularDamping: 0.048,
    spinMul: 1.2,
    stiffness: 1.6e8,           // rigid — glass is HARD, sharp clatter
    relaxation: 2.2,
    description: 'Light and crisp — clatters brightly, translucent body with the numbers suspended inside',
    visual: {
      tint: '#eef6fc',          // near-clear ice
      metalness: 0.0,
      roughness: 0.07,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.7,     // reflections are what sell glass
      transparent: true,
      opacity: 0.62,            // numbers on the face plates read through
    },
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
  diceMaterial: 'stone',
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
      setDiceMaterial: (materialId) => set({
        diceMaterial: DICE_MATERIALS[materialId] ? materialId : 'stone'
      }),

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
        diceMaterial: state.diceMaterial,
      })
    })
  )
);

// Expose for debugging/manual testing (matches window.combatStore / window.gameStore conventions)
if (typeof window !== 'undefined') {
  window.diceStore = useDiceStore;
}

export default useDiceStore;
