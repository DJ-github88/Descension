import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cache to prevent repeated identical validation updates
let lastValidationUpdate = {};
let updateTimeout = null;

const WIZARD_STEPS = [
  'Origin & Identity',        // Step 1: Spell Origin & Type
  'Primary Function',         // Step 2: Category, Role & Temporal
  'Resource System',          // Step 3: Core Mechanic & Theme
  'Damage & Healing',         // Step 4: Damage, Healing & Dice
  'Secondary Effects',        // Step 5: Secondary Effects & Triggers
  'Visual & Audio',           // Step 6: Range, Area & Scaling
  'Resources & Cooldowns',    // Step 7: Resources & Cooldowns
  'Visuals & Flavor',         // Step 8: Visuals & Flavor
];

// Initial empty spell template
const initialSpellData = {
  // Step 1: Origin & Identity
  source: '',                // 'class' or 'monster'
  class: '',                 // Selected player class
  monsterType: '',           // Selected monster type
  spellType: '',             // Active, Passive, etc.
  name: '',                  // Spell name
  description: '',           // Spell description
  flavorText: '',            // Flavor text
  thematicElements: [],      // Thematic adjectives
  icon: '',                  // Spell icon
  
  // Step 2: Primary Function
  category: '',              // Damage, Healing, etc.
  subtype: '',               // Specific type
  targetingMode: 'single',   // 'single' or 'aoe'
  aoeShape: '',              // Circle, Cone, etc.
  aoeSize: 0,                // Size in feet
  rangeType: '',             // Melee, Ranged, etc.
  range: 0,                  // Distance in feet
  durationRounds: 0,         // Duration in combat rounds
  durationRealTime: 0,       // Real-time duration
  durationUnit: 'seconds',   // Time unit
  
  // Step 3: Resource System
  resourceSystem: '',        // Comma-separated resources
  useHealthAsResource: false,// Health as resource flag
  resourceCosts: {},         // Resource costs by ID
  cooldownCategory: '',      // Cooldown category
  cooldownValue: 0,          // Cooldown value
  cooldownUnit: 'seconds',   // Cooldown unit
  costScalingType: 'flat',   // Cost scaling type
  castTimeType: '',          // Cast time type
  castTimeValue: 0,          // Cast time value
  channelMaxTime: 0,         // Channel/charge max time
  triggersGlobalCooldown: true, // GCD flag
  
  // Step 4: Damage & Healing
  damageTypes: [],           // Damage types
  primaryDamage: {           // Primary damage
    dice: '',                // Dice notation
    flat: 0,                 // Flat damage
    procChance: 100,         // Proc chance %
  },
  isDot: false,              // DoT flag
  dotDuration: 0,            // DoT duration
  dotTick: '',               // DoT tick damage
  healing: null,             // Healing mechanics
  scalingFactors: [],        // How the spell scales
  scalingAttribute: '',      // Attribute for scaling
  scalingFormula: '',        // Scaling formula
  
  // Step 5: Secondary Effects
  buffs: [],                 // Applied buffs
  debuffs: [],               // Applied debuffs
  onHitTriggers: [],         // On-hit effects
  onDamageTriggers: [],      // On-damage effects
  auraEffects: [],           // Aura effects
  advancedBehaviors: [],     // Advanced behaviors
  
  // Step 6: Visual & Audio
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
  
  // Step 7: Final Details
  tags: [],                  // Spell tags
  complexity: 'intermediate',// Spell complexity
  tooltipType: 'standard',   // Tooltip type
  customTooltip: '',         // Custom tooltip
  interruptible: true,       // Can be interrupted
  locksCasting: false,       // Locks other casting
  usableWhileMoving: true,   // Can cast while moving
  requiresLoS: true,         // Requires line of sight
  hasTravelTime: false,      // Has projectile travel time
  projectileSpeed: 30,       // Projectile speed
  customNotes: '',           // Custom notes
  
  // Class-specific mechanics
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

/**
 * Main spell wizard store using Zustand
 * Optimized to prevent maximum update depth errors
 */
const useSpellWizardStore = create((set, get) => ({
  // Current wizard state
  currentStep: 0,
  spellData: { ...initialSpellData },
  stepValidation: Array(WIZARD_STEPS.length).fill(true), // Initialize all steps as valid
  isStepValid: {},                                       // Object mapping step indexes to validation state
  
  // Navigation
  nextStep: () => set(state => ({
    currentStep: Math.min(state.currentStep + 1, WIZARD_STEPS.length - 1)
  })),
  
  prevStep: () => set(state => ({
    currentStep: Math.max(state.currentStep - 1, 0)
  })),
  
  goToStep: (stepIndex) => set(() => ({
    currentStep: Math.max(0, Math.min(stepIndex, WIZARD_STEPS.length - 1))
  })),
  
  // Update spell data - batched to prevent circular updates
  updateSpellData: (updates) => {
    // Clear any pending updates
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    
    // Schedule the update
    updateTimeout = setTimeout(() => {
      set(state => ({
        spellData: { ...state.spellData, ...updates }
      }));
      updateTimeout = null;
    }, 0);
  },
  
  // Set validation state for a step - optimized to prevent infinite loops
  setStepValidation: (step, isValid) => {
    // Support both numeric index and string step name
    let stepIndex;
    if (typeof step === 'number') {
      stepIndex = step;
    } else {
      // Find the index of the step by name if a string is provided
      stepIndex = WIZARD_STEPS.findIndex(s => 
        s.toLowerCase().includes(step.toLowerCase())
      );
    }
    
    // Only update if we found a valid step index
    if (stepIndex >= 0 && stepIndex < WIZARD_STEPS.length) {
      // Check if this is a duplicate update to prevent loops
      const cacheKey = `${stepIndex}:${isValid}`;
      if (lastValidationUpdate[cacheKey]) {
        return; // Skip duplicate updates
      }
      
      // Cache this update to prevent duplicates
      lastValidationUpdate[cacheKey] = true;
      setTimeout(() => { 
        delete lastValidationUpdate[cacheKey]; 
      }, 100);
      
      set(state => {
        // If value is not changing, don't update
        if (state.stepValidation[stepIndex] === isValid) {
          return {}; // Return empty object to avoid state update
        }
        
        // Create new array with updated validation state
        const newValidation = [...state.stepValidation];
        newValidation[stepIndex] = isValid;
        
        // Also update the isStepValid object for easier access
        return { 
          stepValidation: newValidation,
          isStepValid: { ...state.isStepValid, [stepIndex]: isValid }
        };
      });
    }
  },
  
  // Determine if current step is valid
  isCurrentStepValid: () => {
    const { currentStep, stepValidation } = get();
    return stepValidation[currentStep] ?? true;  // Default to true if undefined
  },
  
  // Reset the wizard
  resetWizard: () => set(() => ({
    currentStep: 0,
    spellData: { ...initialSpellData },
    stepValidation: Array(WIZARD_STEPS.length).fill(true),
    isStepValid: {}
  })),
  
  // Helper to get current step name
  getCurrentStepName: () => {
    const { currentStep } = get();
    return WIZARD_STEPS[currentStep];
  },
  
  // Spell preview generation
  generatePreview: () => {
    const { spellData } = get();
    return {
      ...spellData,
      // Add any calculated or derived fields for preview
    };
  },
  
  // Export spell to different formats
  exportSpell: (format = 'json') => {
    const { spellData } = get();
    switch (format) {
      case 'json':
        return JSON.stringify(spellData, null, 2);
      case 'text':
        // Generate a text summary of the spell
        const { name, category, damageTypes, range } = spellData;
        return `${name} (${category}${damageTypes.length ? '; ' + damageTypes.join(', ') : ''}; Range: ${range}ft)`;
      default:
        return JSON.stringify(spellData, null, 2);
    }
  }
}));

export { useSpellWizardStore };
export default useSpellWizardStore;