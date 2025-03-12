import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cache to prevent repeated identical validation updates
let lastValidationUpdate = {};
let updateTimeout = null;

// Updated workflow structure
const WIZARD_STEPS = [
  'Basic Information',       // Step 1: Name, description, flavor text, tags, icon
  'Targeting and Range',     // Step 2: Target selection, range, AoE shapes, attack rolls, saves
  'Effect System',           // Step 3: Primary effects, damage/healing, dice, damage types
  'Secondary Effects',       // Step 4: Status conditions, movement, buffs/debuffs, procs
  'Advanced Mechanics',      // Step 5: Attribute scaling, special interactions, conditionals
  'Visuals and Audio',       // Step 6: Appearance, sounds, animations, themes, colors
  'Review and Finalize',     // Step 7: Preview, export, validation summary, save
];

// Validation rules for each step
const stepValidationRules = {
  0: (spellData) => {
    return spellData.name && spellData.name.trim() !== '';
  },
  1: (spellData) => {
    return spellData.targetingMode && spellData.rangeType && spellData.range >= 0;
  },
  2: (spellData) => {
    return spellData.effectType && (
      spellData.effectType !== 'damage' || 
      (spellData.primaryDamage && spellData.primaryDamage.diceCount > 0)
    );
  },
  3: (spellData) => {
    // Secondary effects are optional
    return true;
  },
  4: (spellData) => {
    // Advanced mechanics are optional
    return true;
  },
  5: (spellData) => {
    // Visual and audio settings are optional
    return true;
  },
  6: (spellData) => {
    // Review step is always valid
    return true;
  }
};

// Initial empty spell template - reorganized to match new workflow
const initialSpellData = {
  // Step 1: Basic Information
  name: '',                  // Spell name
  description: '',           // Spell description
  flavorText: '',            // Flavor text
  tags: [],                  // Custom tags system
  icon: '',                  // Spell icon
  complexity: 'intermediate',// Spell complexity

  // Step 2: Targeting and Range
  targetingMode: 'single',   // Single, Multiple, AoE, Self
  targetTypes: ['enemy'],    // Enemy, Ally, Object, Location
  rangeType: '',             // Melee, Ranged, Self, Touch
  range: 0,                  // Distance in feet
  aoeShape: '',              // Circle, Cone, Line, Cube
  aoeSize: 0,                // Size in feet
  requiresAttackRoll: false, // Requires attack roll
  saveType: '',              // Saving throw type (DEX, WIS, etc.)
  saveDC: 0,                 // Save DC
  
  // Step 3: Effect System
  effectType: 'damage',      // Damage, Healing, Utility
  damageTypes: [],           // Damage types
  primaryDamage: {           // Primary damage
    dice: '',                // Dice notation
    diceCount: 0,            // Number of dice
    diceType: 'd6',          // Type of dice
    flat: 0,                 // Flat damage
    procChance: 100,         // Proc chance %
  },
  isPersistent: false,       // DoT/HoT flag
  persistentDuration: 0,     // DoT/HoT duration in rounds
  persistentTick: '',        // DoT/HoT tick dice notation
  healing: {                 // Healing mechanics
    dice: '',
    diceCount: 0,
    diceType: 'd8',
    flat: 0,
  },
  
  // Step 4: Secondary Effects
  statusEffects: [],         // Applied status conditions
  movementEffects: [],       // Movement-related effects
  buffs: [],                 // Applied buffs
  debuffs: [],               // Applied debuffs
  auraEffects: [],           // Aura effects
  procEffects: [],           // Proc/trigger effects
  
  // Step 5: Advanced Mechanics
  attributeScaling: [],      // Attribute scaling (STR, DEX, etc.)
  scalingAttribute: '',      // Primary attribute for scaling
  scalingFormula: '',        // Scaling formula
  specialInteractions: [],   // Special interactions with conditions/environment
  comboEffects: [],          // Combo potential with other abilities
  conditionalEffects: [],    // Effects that apply conditionally
  
  // Step 6: Visuals and Audio
  visualTheme: '',           // Visual theme
  visualEffect: '',          // Visual effect type
  soundCategory: '',         // Sound category
  animationTiming: '',       // Animation timing
  useCustomColors: false,    // Custom colors flag
  customColors: {            // Custom color settings
    primary: '',
    secondary: '',
    tertiary: ''
  },
  effectDescription: '',     // Visual description
  soundDescription: '',      // Sound description
  animationDescription: '',  // Animation description
  
  // Step 7: Review and Finalize (metadata)
  exportFormat: 'json',      // Default export format
  customNotes: '',           // User notes
  
  // Legacy/Additional Properties
  source: '',                // 'class' or 'monster' (legacy)
  class: '',                 // Selected player class (legacy)
  monsterType: '',           // Selected monster type (legacy)
  spellType: '',             // Active, Passive, etc. (legacy)
  category: '',              // Damage, Healing, etc. (legacy)
  subtype: '',               // Specific type (legacy)
  durationRounds: 0,         // Duration in combat rounds
  locksCasting: false,       // Locks other casting
  usableWhileMoving: true,   // Can cast while moving
  requiresLoS: true,         // Requires line of sight
  hasTravelTime: false,      // Has projectile travel time
  projectileSpeed: 30,       // Projectile speed
  
  // Class-specific mechanics (can be moved to Advanced Mechanics if needed)
  fortuneGenerate: false,    // Generate Fortune Points
  fortuneGenerateAmount: 0,  // Amount of Fortune generated
  fortuneConsume: false,     // Consumes Fortune Points
  fortuneEnhanceEffect: '',  // Fortune enhancement effect
  rageGenerate: false,       // Generate Rage
  rageGenerateAmount: 0,     // Amount of Rage generated
  rageRequired: false,       // Requires Rage
  rageEnhanced: false,       // Enhanced with high Rage
  rageEnhanceEffect: ''      // Rage enhancement effect
};

const useSpellWizardStore = create(
  persist(
    (set, get) => ({
      spellData: { ...initialSpellData },
      stepValidation: {},
      currentStep: 0,
      furthestStep: 0,

      // Navigation and validation
      setStepValidation: (step, isValid) => {
        // Store validation state but don't block progression
        const currentValidation = get().stepValidation;
        if (currentValidation[step] !== isValid) {
          set(state => ({
            stepValidation: {
              ...state.stepValidation,
              [step]: isValid
            }
          }));
        }
      },

      isStepValid: (step) => {
        // Always return true to allow progression
        return true;
      },

      // Check if a step can be accessed
      canAccessStep: (stepIndex) => {
        // Allow access to any step
        return true;
      },

      // Update spell data with batched updates
      updateSpellData: (updates) => {
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(() => {
          const newSpellData = {
            ...get().spellData,
            ...updates
          };

          // Update the data
          set({ spellData: newSpellData });

          // Revalidate all steps up to the current one
          const { currentStep } = get();
          for (let i = 0; i <= currentStep; i++) {
            const validationRule = stepValidationRules[i];
            if (validationRule) {
              const isValid = validationRule(newSpellData);
              set(state => ({
                stepValidation: {
                  ...state.stepValidation,
                  [i]: isValid
                }
              }));
            }
          }

          updateTimeout = null;
        }, 100);
      },

      // Reset the wizard
      resetWizard: () => {
        set({
          spellData: { ...initialSpellData },
          stepValidation: {},
          currentStep: 0,
          furthestStep: 0
        });
      },

      // Get current step name
      getCurrentStepName: () => {
        const { currentStep } = get();
        return WIZARD_STEPS[currentStep] || 'Unknown Step';
      }
    }),
    {
      name: 'spell-wizard-store',
      version: 1
    }
  )
);

export { useSpellWizardStore };
export default useSpellWizardStore;