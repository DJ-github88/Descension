import React, { useState, useEffect } from 'react';
import ResourceThresholdSlider from '../common/ResourceThresholdSlider';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faFire,
  faBolt,
  faSkull,
  faDragon,
  faPaw,
  faMoon,
  faLeaf,
  faClock,
  faVirus,
  faFlask,
  faSkullCrossbones,
  faBiohazard,
  faRadiation,
  faSpider,
  faGhost,
  faBug
} from '@fortawesome/free-solid-svg-icons';
import { FaDiceD20, FaClone, FaCoins } from 'react-icons/fa';

// Import components
import SpellSelector from '../common/SpellSelector';
import IconSelectionCard from '../common/IconSelectionCard';
import EnhancedGraduatedRecipeEffects from './EnhancedGraduatedRecipeEffects';
import ToxicSystemEffects from './ToxicSystemEffects';
import Wc3Tooltip from '../../../tooltips/Wc3Tooltip';

// Import styles
import '../../styles/MechanicThresholds.css';
import '../../styles/ChordSystem.css';
import '../../styles/GraduatedRecipeEffects.css';
import '../../styles/StepMechanicsConfig.css';
import '../../styles/ToxicSystem.css';

// Step mechanics systems - Simplified to only include the most relevant ones
const STEP_MECHANICS_SYSTEMS = {
  COMBO_POINTS: {
    name: "Combo Points",
    description: "Traditional combo point system that builds up to powerful finishers",
    maxPoints: 5,
    icon: faArrowUp,
    thresholds: [1, 3, 5],
    color: "#FF5555",
    types: [
      { id: 'builder', name: 'Builder', description: 'Generates combo points', icon: faArrowUp },
      { id: 'spender', name: 'Spender', description: 'Consumes combo points for increased effect', icon: faFire }
    ]
  },
  CHORD_SYSTEM: {
    name: "Chord System",
    description: "Music theory-based system with chord functions and recipes",
    maxPoints: 8,
    icon: faClock,
    thresholds: [3, 5, 8],
    color: "#9370DB", // Medium purple color
    types: [
      { id: 'note', name: 'Note', description: 'Plays a note with a specific chord function', icon: faArrowUp },
      { id: 'chord', name: 'Chord', description: 'Requires a specific recipe of notes to play', icon: faFire },
      { id: 'wildcard', name: 'Wildcard Note', description: 'Acts as any chord function in a recipe', icon: faBolt },
      { id: 'extender', name: 'Extender', description: 'Extends the duration of the improvisation window', icon: faClock }
    ],
    chordFunctions: [
      { id: 'tonic', name: 'Tonic', description: 'The home chord or note (I)', color: '#FF5555', wowIcon: 'spell_holy_holybolt', theory: 'The tonic is the first note of a scale and represents the key center or home base of a piece of music.' },
      { id: 'supertonic', name: 'Supertonic', description: 'The second scale degree (ii)', color: '#FF9955', wowIcon: 'spell_holy_sealofwisdom', theory: 'The supertonic is the second degree of the scale, sitting just above the tonic, often creating tension that resolves to the tonic.' },
      { id: 'mediant', name: 'Mediant', description: 'The third scale degree (iii)', color: '#FFFF55', wowIcon: 'spell_holy_sealofmight', theory: 'The mediant is the third degree of the scale, positioned midway between the tonic and dominant, adding emotional color to progressions.' },
      { id: 'subdominant', name: 'Subdominant', description: 'The fourth scale degree (IV)', color: '#55FF55', wowIcon: 'spell_holy_divineillumination', theory: 'The subdominant is the fourth degree of the scale, creating a sense of movement away from the tonic and toward the dominant.' },
      { id: 'dominant', name: 'Dominant', description: 'The fifth scale degree (V)', color: '#55FFFF', wowIcon: 'spell_holy_auraoflight', theory: 'The dominant is the fifth degree of the scale, creating strong tension that typically resolves to the tonic, driving harmonic progression.' },
      { id: 'submediant', name: 'Submediant', description: 'The sixth scale degree (vi)', color: '#5555FF', wowIcon: 'spell_holy_blessedrecovery', theory: 'The submediant is the sixth degree of the scale, often used in deceptive cadences and as a substitute for the tonic in minor keys.' },
      { id: 'leadingtone', name: 'Leading Tone', description: 'The seventh scale degree (vii°)', color: '#FF55FF', wowIcon: 'spell_holy_searinglightpriest', theory: 'The leading tone is the seventh degree of the scale, creating strong tension that pulls toward the tonic, especially in cadences.' }
    ]
  },
  STATE_REQUIREMENTS: {
    name: "State Requirements",
    description: "Add variability to spells based on character state",
    icon: faBolt,
    color: "#3366FF",
    types: [
      { id: 'resource_threshold', name: 'Resource Threshold', description: 'Add effects based on resource thresholds', icon: faClock }
    ],
    thresholdTypes: [
      { id: 'below', name: 'Below', description: 'Trigger when resource is below threshold' },
      { id: 'above', name: 'Above', description: 'Trigger when resource is above threshold' },
      { id: 'equal', name: 'Equal', description: 'Trigger when resource is exactly at threshold' }
    ],
    stateEffectTypes: [
      { id: 'add_dice', name: 'Add Dice', description: 'Add extra dice to the spell effect' },
      { id: 'add_flat', name: 'Add Flat Value', description: 'Add a flat value to the spell effect' },
      { id: 'multiply', name: 'Multiply Effect', description: 'Multiply the spell effect by a value' },
      { id: 'extra_effect', name: 'Extra Effect', description: 'Add an additional effect to the spell' },
      { id: 'coin_flip', name: 'Coin Flip', description: 'Flip a coin for an additional effect' },
      { id: 'card_draw', name: 'Card Draw', description: 'Draw a card for an additional effect' }
    ],
    effectTypes: [
      { id: 'bonus_damage', name: 'Bonus Damage', description: 'Add extra damage when threshold is met' },
      { id: 'bonus_healing', name: 'Bonus Healing', description: 'Add extra healing when threshold is met' },
      { id: 'damage_reduction', name: 'Damage Reduction', description: 'Reduce damage when threshold is not met' },
      { id: 'healing_reduction', name: 'Healing Reduction', description: 'Reduce healing when threshold is not met' },
      { id: 'cooldown_reduction', name: 'Cooldown Reduction', description: 'Reduce cooldown when threshold is met' },
      { id: 'resource_cost', name: 'Resource Cost', description: 'Modify resource cost based on threshold' },
      { id: 'cast_time', name: 'Cast Time', description: 'Modify cast time based on threshold' },
      { id: 'additional_effect', name: 'Additional Effect', description: 'Add an additional effect when threshold is met' }
    ]
  },
  FORM_SYSTEM: {
    name: "Form Requirements",
    description: "Effects that require or are enhanced by specific forms or stances",
    maxPoints: 4,
    icon: faDragon,
    thresholds: [1, 2, 3, 4],
    color: "#FF7F50",
    types: [
      { id: 'bear_form', name: 'Bear Form', description: 'Requires or enhances in Bear Form', icon: faPaw },
      { id: 'cat_form', name: 'Cat Form', description: 'Requires or enhances in Cat Form', icon: faPaw },
      { id: 'moonkin_form', name: 'Moonkin Form', description: 'Requires or enhances in Moonkin Form', icon: faMoon },
      { id: 'tree_form', name: 'Tree Form', description: 'Requires or enhances in Tree Form', icon: faLeaf }
    ]
  },
  TOXIC_SYSTEM: {
    name: "Toxic/Disease System",
    description: "Apply and consume different toxins and diseases for enhanced effects",
    maxPoints: 8,
    icon: faVirus,
    thresholds: [2, 4, 6, 8],
    color: "#8B008B", // Dark magenta color
    types: [
      { id: 'toxic_applier', name: 'Toxic Applier', description: 'Applies toxins, diseases, or other afflictions', icon: faFlask },
      { id: 'toxic_consumer', name: 'Toxic Consumer', description: 'Consumes toxins for enhanced effects', icon: faSkullCrossbones }
    ],
    toxicTypes: [
      { id: 'disease', name: 'Disease', description: 'Biological afflictions that weaken the target', icon: faVirus, color: '#8B008B', wowIcon: 'ability_creature_disease_01' },
      { id: 'poison', name: 'Poison', description: 'Toxic substances that damage over time', icon: faFlask, color: '#006400', wowIcon: 'ability_creature_poison_06' },
      { id: 'curse', name: 'Curse', description: 'Magical afflictions that debilitate', icon: faGhost, color: '#4B0082', wowIcon: 'spell_shadow_curseofsargeras' },
      { id: 'venom', name: 'Venom', description: 'Injected toxins with potent effects', icon: faSpider, color: '#006400', wowIcon: 'ability_creature_poison_03' },
      { id: 'blight', name: 'Blight', description: 'Corrupting influence that spreads', icon: faBiohazard, color: '#8B4513', wowIcon: 'spell_shadow_creepingplague' },
      { id: 'plague', name: 'Plague', description: 'Highly contagious diseases', icon: faSkullCrossbones, color: '#2F4F4F', wowIcon: 'spell_shadow_plaguecloud' },
      { id: 'necrotic', name: 'Necrotic', description: 'Rotting affliction that prevents healing', icon: faVirus, color: '#8B008B', wowIcon: 'spell_deathknight_necroticplague' },
      { id: 'toxic', name: 'Toxic', description: 'Caustic substances that burn and corrode', icon: faFlask, color: '#006400', wowIcon: 'ability_creature_poison_02' },
      { id: 'corruption', name: 'Corruption', description: 'Dark energy that corrupts from within', icon: faGhost, color: '#4B0082', wowIcon: 'spell_shadow_abominationexplosion' },
      { id: 'contagion', name: 'Contagion', description: 'Rapidly spreading infection', icon: faBiohazard, color: '#8B4513', wowIcon: 'spell_shadow_contagion' },
      { id: 'decay', name: 'Decay', description: 'Gradual deterioration of physical form', icon: faVirus, color: '#8B4513', wowIcon: 'ability_creature_disease_02' },
      { id: 'pestilence', name: 'Pestilence', description: 'Devastating disease that affects multiple systems', icon: faVirus, color: '#2F4F4F', wowIcon: 'spell_nature_nullifydisease' },
      { id: 'toxin', name: 'Toxin', description: 'Concentrated poison with immediate effects', icon: faFlask, color: '#006400', wowIcon: 'ability_creature_poison_05' },
      { id: 'miasma', name: 'Miasma', description: 'Noxious vapors that cause illness', icon: faFlask, color: '#4B0082', wowIcon: 'spell_shadow_rainoffire' },
      { id: 'rot', name: 'Rot', description: 'Accelerated decomposition of living tissue', icon: faVirus, color: '#8B4513', wowIcon: 'ability_creature_disease_03' },
      { id: 'infection', name: 'Infection', description: 'Invasive pathogens that multiply rapidly', icon: faVirus, color: '#8B008B', wowIcon: 'inv_misc_herb_plaguebloom' },
      { id: 'vile', name: 'Vile', description: 'Repulsive substance that causes nausea and weakness', icon: faFlask, color: '#006400', wowIcon: 'spell_shadow_lifedrain02' },
      { id: 'putrid', name: 'Putrid', description: 'Foul-smelling decay that weakens resolve', icon: faBiohazard, color: '#8B4513', wowIcon: 'ability_creature_cursed_04' }
    ]
  }
};

const StepMechanicsConfig = ({ effectId, effectType, currentConfig, onConfigUpdate }) => {
  // Get the spell wizard state to access original formulas
  const spellWizardState = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const library = useSpellLibrary();

  // Tooltip state
  const [tooltipContent, setTooltipContent] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Get recommended system based on effect type
  const getRecommendedSystem = (type) => {
    switch(type) {
      case 'damage':
        return 'COMBO_POINTS'; // Damage often uses combo points
      case 'healing':
        return 'STATE_REQUIREMENTS'; // Healing often uses state requirements
      case 'buff':
      case 'debuff':
        return 'STATE_REQUIREMENTS'; // Buffs/debuffs often use state requirements
      case 'utility':
        return 'FORM_SYSTEM'; // Utility often uses forms
      case 'control':
        return 'COMBO_POINTS'; // Control often uses combo points
      case 'summoning':
        return 'FORM_SYSTEM'; // Summoning often uses forms
      case 'transformation':
        return 'FORM_SYSTEM'; // Transformation naturally uses forms
      default:
        return 'COMBO_POINTS';
    }
  };

  // Get recommended mechanic type based on effect type and system
  const getRecommendedMechanicType = (type, system) => {
    if (system === 'COMBO_POINTS') {
      return type === 'damage' ? 'builder' : 'spender';
    } else if (system === 'CHORD_SYSTEM') {
      return type === 'damage' ? 'note' : 'chord';
    } else if (system === 'STATE_REQUIREMENTS') {
      if (type === 'healing') {
        return 'health_threshold';
      } else if (type === 'buff' || type === 'debuff') {
        return 'mana_threshold';
      } else {
        return 'resource_threshold';
      }
    } else if (system === 'FORM_SYSTEM') {
      return type === 'healing' ? 'tree_form' : 'bear_form';
    }

    // Make sure the system exists and has types
    const systemObj = STEP_MECHANICS_SYSTEMS[system];
    if (!systemObj || !systemObj.types || systemObj.types.length === 0) {
      return 'builder'; // Default fallback
    }

    // Default to first type in the system
    return systemObj.types[0].id;
  };

  // Get recommended system based on effect type
  const recommendedSystem = getRecommendedSystem(effectType);
  const recommendedType = getRecommendedMechanicType(effectType, recommendedSystem);

  // Default configuration
  const defaultConfig = {
    enabled: false,
    system: recommendedSystem,
    type: recommendedType, // 'trigger', 'builder', 'spender'
    thresholdValue: STEP_MECHANICS_SYSTEMS[recommendedSystem]?.thresholds?.[0] || 1,
    resolutionMethod: 'dice', // Default to dice resolution
    cardSuccessRule: 'face_cards', // Default card success rule
    coinCount: 3, // Default number of coins
    coinSuccessRule: 'all_heads', // Default coin success rule
    // Support for multiple mechanic systems
    mechanicSystems: [],
    // Effect scaling removed as requested
    // Combo system specific options
    comboOptions: {
      generationMethod: effectType === 'damage' ? 'sinister_strike' :
                       effectType === 'control' ? 'backstab' : 'mutilate',
      consumptionRule: 'all',
      visualStyle: 'points'
    },
    // Chord system specific options
    chordOptions: {
      chordFunction: 'tonic', // Default chord function for notes
      isWildcard: false, // Whether this note acts as a wildcard
      extendDuration: 0, // How many rounds this note extends the improvisation window
      recipe: '', // Required recipe for chord spells (e.g., "tonic-mediant-dominant")
      recipeDisplay: [], // Visual representation of the recipe
      improvisationWindow: 2, // Default improvisation window in rounds
      graduatedEffects: {}, // Effects for partial recipe matches
    },
    // Toxic system specific options
    toxicOptions: {
      selectedToxicTypes: {}, // Map of selected toxic types with counts
      duration: 3, // Duration in rounds
      durationType: 'rounds', // Duration type (rounds, minutes, hours)
      consumptionRule: 'all', // How toxics are consumed (all, specific)
      updateFormula: false, // Whether to update the formula when consumed
      toxicEffects: {}, // Effects for different toxic types
    },
    // Proc system specific options
    procOptions: {
      procType: effectType === 'damage' ? 'critical_strike' :
               effectType === 'healing' ? 'periodic' : 'on_hit',
      procChance: effectType === 'damage' ? 15 : 10,
      effectType: effectType || 'damage',
      triggerLimit: 1,
      spellId: null // Reference to a spell from the library
    },
    // Form system specific options
    formOptions: {
      formSpellId: null, // Reference to a form spell from the library
      bonusType: effectType === 'damage' ? 'damage' :
                effectType === 'healing' ? 'healing' : 'defense',
      bonusAmount: 20,
      restrictCasting: effectType === 'transformation'
    },
    // State requirements specific options
    stateOptions: {
      // Basic configuration
      resourceType: effectType === 'damage' ? 'health' :
                   effectType === 'healing' ? 'mana' : 'energy',
      thresholdValue: 20, // Default threshold value
      thresholdType: 'below', // 'below', 'above', 'equal'
      valueType: 'percentage', // 'percentage' or 'flat'

      // Formula configuration
      originalFormula: '', // Will be populated with the original formula
      modifiedFormula: '', // Will be populated with a copy of the original formula for editing

      // Extra effect configuration
      extraEffectSpellId: '',

      // Combat state configuration (for combat_state type)
      combatStateType: 'in_combat', // 'in_combat', 'out_of_combat', 'first_round', 'below_half_health'

      // Multiple state requirements
      additionalRequirements: [],

      // Multiple thresholds
      thresholds: []
    }
  };

  // Initialize configuration or use existing one
  // Make sure we have a valid effect object with scaling property
  const safeCurrentConfig = currentConfig || {};
  if (!safeCurrentConfig.effect || typeof safeCurrentConfig.effect !== 'object') {
    safeCurrentConfig.effect = { scaling: 'linear', multiplier: 1.0 };
  }

  const [config, setConfig] = useState({
    ...defaultConfig,
    ...safeCurrentConfig,
    // Effect scaling removed as requested
    comboOptions: {
      ...defaultConfig.comboOptions,
      ...(safeCurrentConfig.comboOptions || {})
    },
    chordOptions: {
      ...defaultConfig.chordOptions,
      ...(safeCurrentConfig.chordOptions || {})
    },
    mechanicSystems: safeCurrentConfig.mechanicSystems || [],
    procOptions: {
      ...defaultConfig.procOptions,
      ...(safeCurrentConfig.procOptions || {})
    },
    formOptions: {
      ...defaultConfig.formOptions,
      ...(safeCurrentConfig.formOptions || {})
    },
    stateOptions: {
      ...defaultConfig.stateOptions,
      ...(safeCurrentConfig.stateOptions || {})
    }
  });

  // Update configuration when it changes
  useEffect(() => {
    // Create a function to update both parent and context
    const updateConfiguration = () => {
      // If parent component provided an update callback, use it
      if (onConfigUpdate) {
        onConfigUpdate(config);
      }

      // Always update the context if we have an effectId
      if (effectId) {
        dispatch(actionCreators.updateEffectMechanicsConfig(effectId, {
          ...config
        }));
      }
    };

    // Use a small timeout to ensure this runs after the current event cycle
    // This helps prevent potential race conditions with rapid state updates
    const timeoutId = setTimeout(updateConfiguration, 0);

    // Clean up the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [config, onConfigUpdate, dispatch, effectId]);

  // Get the selected system - will be enhanced later

  // Handle system change
  const handleSystemChange = (systemId, event) => {
    // Prevent event propagation to avoid triggering parent click handlers
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }

    // Use setTimeout to ensure this runs after the current event cycle
    setTimeout(() => {
      const system = STEP_MECHANICS_SYSTEMS[systemId];
      setConfig(prevConfig => ({
        ...prevConfig,
        system: systemId,
        thresholdValue: system.thresholds && system.thresholds.length > 0 ? system.thresholds[0] : 1,
      }));
    }, 0);
  };

  // Handle type change
  const handleTypeChange = (type, event) => {
    // Prevent event propagation to avoid triggering parent click handlers
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }

    // Use setTimeout to ensure this runs after the current event cycle
    setTimeout(() => {
      setConfig(prevConfig => ({
        ...prevConfig,
        type
      }));
    }, 0);
  };

  // Handle threshold change
  const handleThresholdChange = (value) => {
    setConfig({
      ...config,
      thresholdValue: parseInt(value, 10)
    });
  };

  // Generic handle change function for any config property
  const handleChange = (field, value) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  // Effect scaling function removed as requested

  // Multiplier change function removed as requested

  // Toggle enabled state
  const toggleEnabled = (event) => {
    // Prevent event propagation to avoid triggering parent click handlers
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }

    // Use setTimeout to ensure this runs after the current event cycle
    setTimeout(() => {
      setConfig(prevConfig => ({
        ...prevConfig,
        enabled: !prevConfig.enabled
      }));
    }, 0);
  };

  // Generic handle option changes for any nested config object
  const handleNestedOptionChange = (optionGroup, option, value, event) => {
    // Prevent event propagation to avoid triggering parent click handlers
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }

    // Use setTimeout to ensure this runs after the current event cycle
    setTimeout(() => {
      setConfig(prevConfig => ({
        ...prevConfig,
        [optionGroup]: {
          ...prevConfig[optionGroup],
          [option]: value
        }
      }));
    }, 0);
  };

  // Handle combo option changes - Used in the UI
  // eslint-disable-next-line no-unused-vars
  const handleComboOptionChange = (option, value) => {
    handleNestedOptionChange('comboOptions', option, value);
  };

  // Handle chord option changes
  const handleChordOptionChange = (option, value, event) => {
    handleNestedOptionChange('chordOptions', option, value, event);
  };

  // Handle toxic option changes
  const handleToxicOptionChange = (option, value, event) => {
    handleNestedOptionChange('toxicOptions', option, value, event);
  };

  // Handle toxic type selection
  const handleToxicTypeSelect = (toxicType, event) => {
    // Prevent event propagation
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }

    // Update the selected toxic types
    setConfig(prevConfig => {
      const selectedToxicTypes = { ...prevConfig.toxicOptions.selectedToxicTypes };

      // If already selected, increment count, otherwise add with count 1
      if (selectedToxicTypes[toxicType.id]) {
        selectedToxicTypes[toxicType.id] = selectedToxicTypes[toxicType.id] + 1;
      } else {
        selectedToxicTypes[toxicType.id] = 1;
      }

      return {
        ...prevConfig,
        toxicOptions: {
          ...prevConfig.toxicOptions,
          selectedToxicTypes
        }
      };
    });
  };

  // Clear all selected toxic types
  const clearSelectedToxicTypes = (event) => {
    // Prevent event propagation
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }

    // Clear the selected toxic types
    setConfig(prevConfig => ({
      ...prevConfig,
      toxicOptions: {
        ...prevConfig.toxicOptions,
        selectedToxicTypes: {}
      }
    }));
  };

  // Handle graduated recipe effects changes
  const handleGraduatedEffectsChange = (graduatedEffects) => {
    handleNestedOptionChange('chordOptions', 'graduatedEffects', graduatedEffects);
  };

  // Handle toxic effects changes
  const handleToxicEffectsChange = (toxicEffects) => {
    handleNestedOptionChange('toxicOptions', 'toxicEffects', toxicEffects);
  };

  // Tooltip handlers for toxic types
  const handleToxicTooltipEnter = (toxicType, e) => {
    // Create WoW Classic style tooltip content
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {toxicType.description}
        </div>
        <div className="tooltip-effect">
          <span className="tooltip-gold">Type:</span> {toxicType.name}
        </div>
        <div className="tooltip-flavor">
          {toxicType.id === 'disease' && "\"A biological affliction that weakens its victims from within.\""}
          {toxicType.id === 'poison' && "\"A toxic substance that causes damage over time.\""}
          {toxicType.id === 'curse' && "\"A magical affliction that brings misfortune and suffering.\""}
          {toxicType.id === 'venom' && "\"A potent toxin delivered directly into the bloodstream.\""}
          {toxicType.id === 'blight' && "\"A corrupting influence that spreads to nearby targets.\""}
          {toxicType.id === 'plague' && "\"A highly contagious disease that affects multiple targets.\""}
          {toxicType.id === 'necrotic' && "\"A rotting affliction that prevents healing and recovery.\""}
          {toxicType.id === 'toxic' && "\"A caustic substance that burns and corrodes its victims.\""}
          {toxicType.id === 'corruption' && "\"Dark energy that corrupts from within, causing gradual decay.\""}
          {toxicType.id === 'contagion' && "\"A rapidly spreading infection that jumps between targets.\""}
          {toxicType.id === 'decay' && "\"A gradual deterioration that breaks down physical form over time.\""}
          {toxicType.id === 'pestilence' && "\"A devastating disease that affects multiple bodily systems at once.\""}
          {toxicType.id === 'toxin' && "\"A concentrated poison that causes immediate and severe effects.\""}
          {toxicType.id === 'miasma' && "\"Noxious vapors that cause illness and disorientation.\""}
          {toxicType.id === 'rot' && "\"Accelerated decomposition that breaks down living tissue.\""}
          {toxicType.id === 'infection' && "\"Invasive pathogens that multiply rapidly within the host.\""}
          {toxicType.id === 'vile' && "\"A repulsive substance that causes nausea and weakness.\""}
          {toxicType.id === 'putrid' && "\"A foul-smelling decay that weakens resolve and constitution.\""}
        </div>
      </div>
    );

    // Store the tooltip data including title and icon
    setTooltipContent({
      content: tooltipContent,
      title: toxicType.name,
      icon: toxicType.wowIcon ? `https://wow.zamimg.com/images/wow/icons/large/${toxicType.wowIcon}.jpg` : null
    });
    setShowTooltip(true);
    // Update position using client coordinates for fixed positioning
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleToxicTooltipLeave = () => {
    setShowTooltip(false);
  };

  const handleToxicTooltipMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Tooltip handlers for chord functions
  const handleChordTooltipEnter = (chordFunction, e) => {
    // Create WoW Classic style tooltip content
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {chordFunction.description}
        </div>
        <div className="tooltip-effect">
          <span className="tooltip-gold">Function:</span> {chordFunction.name}
        </div>
        <div className="tooltip-flavor">
          "{chordFunction.theory}"
        </div>
      </div>
    );

    // Store the tooltip data including title and icon
    setTooltipContent({
      content: tooltipContent,
      title: chordFunction.name,
      icon: chordFunction.wowIcon ? `https://wow.zamimg.com/images/wow/icons/large/${chordFunction.wowIcon}.jpg` : null
    });
    setShowTooltip(true);
    // Update position using client coordinates for fixed positioning
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleChordTooltipLeave = () => {
    setShowTooltip(false);
  };

  const handleChordTooltipMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };


  // These functions are no longer used with the new multi-select approach

  // Get default formula for an effect type
  const getDefaultFormula = (effectType) => {
    switch (effectType) {
      case 'damage':
        return '2d6 + INT';
      case 'healing':
        return '1d8 + WIS';
      case 'buff':
        return '+2 to all stats';
      case 'debuff':
        return '-2 to all stats';
      case 'control':
        return 'DC 15 save';
      case 'summoning':
        return 'Summon 1 creature';
      default:
        return '1d6';
    }
  };

  // Add a chord function to the recipe
  const addChordToRecipe = (chordFunction, event) => {
    // Prevent event propagation to avoid triggering parent click handlers
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }

    // Use a timeout to ensure this executes after the current event cycle
    setTimeout(() => {
      console.log('Adding chord function:', chordFunction);
      const currentRecipe = config.chordOptions.recipeDisplay || [];
      const updatedRecipe = [...currentRecipe, chordFunction];
      const updatedRecipeString = updatedRecipe.map(c => c.id).join('-');

      // Update state directly using the function form of setState to avoid stale closures
      setConfig(prevConfig => ({
        ...prevConfig,
        chordOptions: {
          ...prevConfig.chordOptions,
          recipeDisplay: updatedRecipe,
          recipe: updatedRecipeString
        }
      }));
    }, 0);
  };

  // Remove a chord function from the recipe at a specific index
  const removeChordFromRecipe = (index, event) => {
    // Prevent event propagation to avoid triggering parent click handlers
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Use a timeout to ensure this executes after the current event cycle
    setTimeout(() => {
      const currentRecipe = config.chordOptions.recipeDisplay || [];
      const updatedRecipe = [...currentRecipe];
      updatedRecipe.splice(index, 1);
      const updatedRecipeString = updatedRecipe.map(c => c.id).join('-');

      // Update state directly
      setConfig(prevConfig => ({
        ...prevConfig,
        chordOptions: {
          ...prevConfig.chordOptions,
          recipeDisplay: updatedRecipe,
          recipe: updatedRecipeString
        }
      }));
    }, 0);
  };

  // Clear the entire recipe
  const clearRecipe = (event) => {
    // Prevent event propagation to avoid triggering parent click handlers
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }

    // Use a timeout to ensure this executes after the current event cycle
    setTimeout(() => {
      // Update state directly using the function form of setState to avoid stale closures
      setConfig(prevConfig => ({
        ...prevConfig,
        chordOptions: {
          ...prevConfig.chordOptions,
          recipeDisplay: [],
          recipe: ''
        }
      }));
    }, 0);
  };

  // Add a mechanic system to the spell
  const addMechanicSystem = (systemId) => {
    if (!config.mechanicSystems.includes(systemId)) {
      const updatedSystems = [...config.mechanicSystems, systemId];
      handleChange('mechanicSystems', updatedSystems);
    }
  };

  // Remove a mechanic system from the spell
  const removeMechanicSystem = (systemId) => {
    const updatedSystems = config.mechanicSystems.filter(id => id !== systemId);
    handleChange('mechanicSystems', updatedSystems);
  };

  // Handle proc option changes
  const handleProcOptionChange = (option, value) => {
    handleNestedOptionChange('procOptions', option, option === 'procChance' ? parseInt(value, 10) : value);
  };

  // Handle form option changes
  const handleFormOptionChange = (option, value) => {
    const processedValue = option === 'bonusAmount' ? parseInt(value, 10) :
                          option === 'restrictCasting' ? Boolean(value) : value;
    handleNestedOptionChange('formOptions', option, processedValue);
  };

  // Handle form spell selection
  const handleFormSpellSelect = (spellId) => {
    handleNestedOptionChange('formOptions', 'formSpellId', spellId);
  };

  // Handle state option changes
  const handleStateOptionChange = (option, value, event) => {
    handleNestedOptionChange('stateOptions', option, value, event);
  };

  // Get the original formula based on effect type
  const getOriginalFormula = () => {
    // Extract the effect ID to determine which formula to get
    const effectType = effectId.replace('effect_', '');

    switch(effectType) {
      case 'damage':
        return spellWizardState.damageConfig?.formula || '1d6';
      case 'healing':
        return spellWizardState.healingConfig?.formula || '1d8 + HEA';
      case 'buff':
        return spellWizardState.buffConfig?.formula || 'N/A';
      case 'debuff':
        return spellWizardState.debuffConfig?.formula || 'N/A';
      case 'restoration':
        return spellWizardState.restorationConfig?.formula || '1d6';
      default:
        return 'N/A';
    }
  };

  // Get resource color based on type
  const getResourceColor = (resourceType) => {
    switch (resourceType) {
      case 'health': return '#e74c3c';
      case 'mana': return '#3498db';
      case 'energy': return '#f1c40f';
      case 'rage': return '#c0392b';
      case 'inferno': return '#e67e22';
      case 'focus': return '#27ae60';
      case 'runic': return '#8e44ad';
      case 'astral': return '#2980b9';
      case 'holy': return '#f39c12';
      default: return '#4a8ef9';
    }
  };

  // Determine the resolution method from a formula
  const getResolutionMethod = (formula) => {
    if (!formula || formula === 'N/A') return 'dice'; // Default to dice

    // Check for dice notation (e.g., 1d6, 2d8+3)
    if (/\d+d\d+/.test(formula)) {
      return 'dice';
    }

    // Check for card-based formula
    if (/CARD_VALUE|FACE_CARD|FACE_CARDS/.test(formula)) {
      return 'cards';
    }

    // Check for coin-based formula
    if (/HEADS_COUNT|TAILS_COUNT|ALL_HEADS|ALL_TAILS/.test(formula)) {
      return 'coins';
    }

    // Default to dice if we can't determine
    return 'dice';
  };

  // Handle threshold value change
  const handleThresholdValueChange = (index, value) => {
    const newThresholds = [...config.stateOptions.thresholds];
    newThresholds[index] = {
      ...newThresholds[index],
      value: value
    };

    setConfig({
      ...config,
      stateOptions: {
        ...config.stateOptions,
        thresholds: newThresholds
      }
    });
  };

  // Handle threshold effect type change
  const handleThresholdEffectTypeChange = (index, value) => {
    const newThresholds = [...config.stateOptions.thresholds];
    newThresholds[index] = {
      ...newThresholds[index],
      effectType: value
    };

    setConfig({
      ...config,
      stateOptions: {
        ...config.stateOptions,
        thresholds: newThresholds
      }
    });
  };

  // Handle threshold effect value change
  const handleThresholdEffectValueChange = (index, value) => {
    const newThresholds = [...config.stateOptions.thresholds];
    newThresholds[index] = {
      ...newThresholds[index],
      effectValue: value
    };

    setConfig({
      ...config,
      stateOptions: {
        ...config.stateOptions,
        thresholds: newThresholds
      }
    });
  };

  // Handle threshold description change
  const handleThresholdDescriptionChange = (index, value) => {
    const newThresholds = [...config.stateOptions.thresholds];
    newThresholds[index] = {
      ...newThresholds[index],
      effectDescription: value
    };

    setConfig({
      ...config,
      stateOptions: {
        ...config.stateOptions,
        thresholds: newThresholds
      }
    });
  };

  // Handle threshold formula change
  const handleThresholdFormulaChange = (index, value) => {
    const newThresholds = [...config.stateOptions.thresholds];
    newThresholds[index] = {
      ...newThresholds[index],
      formulaModifier: value
    };

    setConfig({
      ...config,
      stateOptions: {
        ...config.stateOptions,
        thresholds: newThresholds
      }
    });
  };

  // Handle adding a new threshold
  const handleAddThreshold = () => {
    const newThresholds = [...config.stateOptions.thresholds];

    // Find a good default value that's not already used
    const usedValues = newThresholds.map(t => t.value);
    let newValue = 50;
    if (usedValues.includes(newValue)) {
      for (let i = 10; i <= 90; i += 10) {
        if (!usedValues.includes(i)) {
          newValue = i;
          break;
        }
      }
    }

    newThresholds.push({
      resourceType: config.stateOptions.resourceType || 'health',
      thresholdType: 'below',
      value: newValue,
      valueType: 'percentage',
      formula: '',
      effectDescription: 'Effect at ' + newValue + '% threshold'
    });

    // Sort thresholds by value
    newThresholds.sort((a, b) => a.value - b.value);

    setConfig({
      ...config,
      stateOptions: {
        ...config.stateOptions,
        thresholds: newThresholds
      }
    });
  };

  // Handle removing a threshold
  const handleRemoveThreshold = (index) => {
    const newThresholds = [...config.stateOptions.thresholds];
    newThresholds.splice(index, 1);

    setConfig({
      ...config,
      stateOptions: {
        ...config.stateOptions,
        thresholds: newThresholds
      }
    });
  };

  // Handle proc spell selection
  const handleProcSpellSelect = (spellId) => {
    handleNestedOptionChange('procOptions', 'spellId', spellId);
  };

  // Get the selected system with safety checks
  const systemObj = STEP_MECHANICS_SYSTEMS[config.system] || STEP_MECHANICS_SYSTEMS['COMBO_POINTS'];
  const selectedSystem = {
    id: config.system || 'COMBO_POINTS',
    ...systemObj,
    // Ensure these properties exist
    icon: systemObj?.icon || faArrowUp,
    color: systemObj?.color || '#FF5555',
    types: systemObj?.types || []
  };

  // Make sure we have the types property
  if (!selectedSystem.types && selectedSystem.id === 'PROC_SYSTEM' && selectedSystem.procTypes) {
    selectedSystem.types = selectedSystem.procTypes;
  } else if (!selectedSystem.types && selectedSystem.id === 'FORM_SYSTEM' && selectedSystem.formTypes) {
    selectedSystem.types = selectedSystem.formTypes;
  }

  // Ensure types is always an array
  if (!Array.isArray(selectedSystem.types)) {
    selectedSystem.types = [];
  }

  // Render the component
  return (
    <div className="spell-effects-container">
      <div className="effect-config-group">
        <h3 className="effect-config-label">
          <FontAwesomeIcon icon={selectedSystem.icon} style={{ color: selectedSystem.color, marginRight: '10px' }} />
          Mechanic Configuration
        </h3>
        <div className="effect-toggle">
          <div className="effect-toggle-label">
            Enable Mechanics
            <button
              className={`effect-toggle-switch ${config.enabled ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (e.nativeEvent) {
                  e.nativeEvent.stopImmediatePropagation();
                }
                toggleEnabled(e);
                return false;
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <span className="effect-toggle-slider"></span>
            </button>
            <span>{config.enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="effect-toggle-description">
            Configure how this spell interacts with mechanic systems like combo points, forms, and procs.
          </div>
        </div>
      </div>

      {config.enabled && (
        <>
          <div className="effect-config-group">
            <h4 className="section-header">Select Mechanic Systems</h4>
            <div className="effect-options mechanics-options">
              {Object.entries(STEP_MECHANICS_SYSTEMS).map(([systemId, system]) => (
                <div
                  key={systemId}
                  className={`effect-option ${config.system === systemId ? 'selected' : ''} ${config.mechanicSystems.includes(systemId) ? 'added' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (e.nativeEvent) {
                      e.nativeEvent.stopImmediatePropagation();
                    }
                    handleSystemChange(systemId, e);
                    return false;
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <div className="effect-option-header">
                    <div className="effect-option-icon" style={{ backgroundColor: system.color, opacity: 0.2 }}>
                      <FontAwesomeIcon icon={system.icon} style={{ color: system.color }} />
                    </div>
                    <div>
                      <div className="effect-option-title">{system.name}</div>
                      <span className="effect-option-subtitle">{system.description}</span>
                    </div>
                    {config.system !== systemId && config.mechanicSystems.includes(systemId) && (
                      <div className="effect-option-badge">Added</div>
                    )}
                  </div>
                  {config.system === systemId && <div className="effect-option-selected">✓</div>}
                  {config.system !== systemId && (
                    <div className="effect-option-actions">
                      {!config.mechanicSystems.includes(systemId) ? (
                        <button
                          className="effect-option-action-btn add"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedSystems = [...config.mechanicSystems, systemId];
                            handleChange('mechanicSystems', updatedSystems);
                          }}
                        >
                          Add System
                        </button>
                      ) : (
                        <button
                          className="effect-option-action-btn remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedSystems = config.mechanicSystems.filter(id => id !== systemId);
                            handleChange('mechanicSystems', updatedSystems);
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="effect-config-group">
            <h4 className="section-header">Mechanic Type</h4>
            <div className="effect-options">
              {selectedSystem.types && selectedSystem.types.map(type => (
                <div
                  key={type.id}
                  className={`effect-option ${config.type === type.id ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (e.nativeEvent) {
                      e.nativeEvent.stopImmediatePropagation();
                    }
                    handleTypeChange(type.id, e);
                    return false;
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <div className="effect-option-header">
                    <div className="effect-option-icon" style={{ backgroundColor: selectedSystem.color, opacity: 0.2 }}>
                      <FontAwesomeIcon icon={type.icon} style={{ color: selectedSystem.color }} />
                    </div>
                    <div>
                      <div className="effect-option-title">{type.name}</div>
                      <span className="effect-option-subtitle">{type.description}</span>
                    </div>
                  </div>
                  {config.type === type.id && <div className="effect-option-selected">✓</div>}
                </div>
              ))}
            </div>
            <div className="effect-description">
              {selectedSystem.types && selectedSystem.types.find(t => t.id === config.type)?.description}
            </div>
          </div>

          {config.type === 'trigger' && selectedSystem.id !== 'PROC_SYSTEM' && selectedSystem.id !== 'FORM_SYSTEM' && (
            <div className="effect-config-group">
              {selectedSystem.isDiceRoll ? (
                <>
                  <h4 className="section-header">Threshold Value (Dice Roll)</h4>
                  <div className="effect-numeric-input">
                    <label>Set dice roll threshold for {selectedSystem.name}</label>
                    <div className="effect-numeric-controls">
                      <button
                        className="effect-numeric-button"
                        onClick={() => handleThresholdChange(Math.max(1, config.thresholdValue - 1))}
                      >-</button>
                      <div className="dice-threshold-display">
                        <FaDiceD20 className="dice-icon" />
                        <span>{config.thresholdValue}+</span>
                      </div>
                      <button
                        className="effect-numeric-button"
                        onClick={() => handleThresholdChange(Math.min(selectedSystem.maxPoints, config.thresholdValue + 1))}
                      >+</button>
                      <div className="threshold-value" style={{ color: selectedSystem.color, fontWeight: 'bold' }}>
                        {Math.round(((21 - config.thresholdValue) / 20) * 100)}% chance
                      </div>
                    </div>
                  </div>
                  <div className="resolution-options">
                    <IconSelectionCard
                      icon={<FaDiceD20 className="icon" />}
                      title="Dice Based"
                      description="Roll d20 against threshold"
                      onClick={() => handleChange('resolutionMethod', 'dice')}
                      selected={!config.resolutionMethod || config.resolutionMethod === 'dice'}
                    />
                    <IconSelectionCard
                      icon={<FaClone className="icon" />}
                      title="Card Based"
                      description="Draw cards to determine outcome"
                      onClick={() => handleChange('resolutionMethod', 'cards')}
                      selected={config.resolutionMethod === 'cards'}
                    />
                    <IconSelectionCard
                      icon={<FaCoins className="icon" />}
                      title="Coin Based"
                      description="Flip coins to determine outcome"
                      onClick={() => handleChange('resolutionMethod', 'coins')}
                      selected={config.resolutionMethod === 'coins'}
                    />
                  </div>
                  {config.resolutionMethod === 'cards' && (
                    <div className="card-resolution-config">
                      <div className="form-group">
                        <label>Card Success Rule</label>
                        <select
                          value={config.cardSuccessRule || 'face_cards'}
                          onChange={(e) => handleChange('cardSuccessRule', e.target.value)}
                        >
                          <option value="face_cards">Face Cards (J, Q, K)</option>
                          <option value="aces">Aces</option>
                          <option value="specific_suit">Specific Suit</option>
                          <option value="red_cards">Red Cards</option>
                          <option value="black_cards">Black Cards</option>
                        </select>
                      </div>
                    </div>
                  )}
                  {config.resolutionMethod === 'coins' && (
                    <div className="coin-resolution-config">
                      <div className="form-group">
                        <label>Number of Coins</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={config.coinCount || 3}
                          onChange={(e) => handleChange('coinCount', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Success Rule</label>
                        <select
                          value={config.coinSuccessRule || 'all_heads'}
                          onChange={(e) => handleChange('coinSuccessRule', e.target.value)}
                        >
                          <option value="all_heads">All Heads</option>
                          <option value="all_tails">All Tails</option>
                          <option value="majority">Majority (more than half)</option>
                          <option value="at_least_one">At Least One Head</option>
                        </select>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h4 className="section-header">Threshold Value {selectedSystem.isPercentage ? '(%)' : ''}</h4>
                  <div className="effect-numeric-input">
                    <label>Set threshold for {selectedSystem.name}</label>
                    <div className="effect-numeric-controls">
                      <button
                        className="effect-numeric-button"
                        onClick={() => handleThresholdChange(Math.max(1, config.thresholdValue - 1))}
                      >-</button>
                      <input
                        type="range"
                        min="1"
                        max={selectedSystem.maxPoints}
                        value={config.thresholdValue}
                        onChange={(e) => handleThresholdChange(e.target.value)}
                        className="threshold-slider"
                        style={{
                          '--track-color': selectedSystem.color,
                          '--thumb-color': selectedSystem.color
                        }}
                      />
                      <button
                        className="effect-numeric-button"
                        onClick={() => handleThresholdChange(Math.min(selectedSystem.maxPoints, config.thresholdValue + 1))}
                      >+</button>
                      <div className="threshold-value" style={{ color: selectedSystem.color, fontWeight: 'bold' }}>
                        {config.thresholdValue}{selectedSystem.isPercentage ? '%' : ''}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="effect-description">
                {selectedSystem.thresholds && selectedSystem.thresholds.length > 0 && (
                  <>
                    Recommended thresholds: {selectedSystem.thresholds.map(threshold => (
                      <span
                        key={threshold}
                        className="highlight"
                        style={{ cursor: 'pointer', color: selectedSystem.color }}
                        onClick={() => handleThresholdChange(threshold)}
                      >
                        {threshold}{selectedSystem.isPercentage ? '%' : (selectedSystem.isDiceRoll ? '+' : '')}{' '}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {config.type === 'trigger' && selectedSystem.id === 'PROC_SYSTEM' && (
            <div className="effect-config-group">
              <h4 className="section-header">Proc Configuration</h4>
              <div className="effect-options mechanics-options">
                {selectedSystem.procTypes.map(procType => (
                  <div
                    key={procType.id}
                    className={`effect-option ${config.procType === procType.id ? 'selected' : ''}`}
                    onClick={() => onConfigUpdate({
                      ...config,
                      procType: procType.id
                    })}
                  >
                    <div className="effect-option-header">
                      <div className="effect-option-icon" style={{ backgroundColor: selectedSystem.color, opacity: 0.2 }}>
                        <FontAwesomeIcon icon={procType.icon} style={{ color: selectedSystem.color }} />
                      </div>
                      <div>
                        <div className="effect-option-title">{procType.name}</div>
                        <span className="effect-option-subtitle">{procType.description || 'Trigger on specific conditions'}</span>
                      </div>
                    </div>
                    {config.procType === procType.id && <div className="effect-option-selected">✓</div>}
                  </div>
                ))}
              </div>

              <div className="effect-numeric-input">
                <label>Proc Chance (%)</label>
                <div className="effect-numeric-controls">
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleThresholdChange(Math.max(1, config.thresholdValue - 5))}
                  >-</button>
                  <input
                    type="range"
                    min="1"
                    max={selectedSystem.maxPoints}
                    value={config.thresholdValue}
                    onChange={(e) => handleThresholdChange(e.target.value)}
                    className="threshold-slider"
                    style={{
                      '--track-color': selectedSystem.color,
                      '--thumb-color': selectedSystem.color
                    }}
                  />
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleThresholdChange(Math.min(selectedSystem.maxPoints, config.thresholdValue + 5))}
                  >+</button>
                  <div className="threshold-value" style={{ color: selectedSystem.color, fontWeight: 'bold' }}>
                    {config.thresholdValue}%
                  </div>
                </div>
              </div>
              <div className="effect-description">
                This effect has a {config.thresholdValue}% chance to trigger when conditions are met.
              </div>
              <div className="threshold-markers">
                {selectedSystem.thresholds.map(threshold => (
                  <div
                    key={threshold}
                    className={`threshold-marker ${config.thresholdValue >= threshold ? 'active' : ''}`}
                    style={{
                      left: `${(threshold / selectedSystem.maxPoints) * 100}%`,
                      backgroundColor: config.thresholdValue >= threshold ? selectedSystem.color : '#666'
                    }}
                    onClick={() => handleThresholdChange(threshold)}
                  >
                    {threshold}%
                  </div>
                ))}
              </div>
            </div>
          )}

          {config.type === 'trigger' && selectedSystem.id === 'FORM_SYSTEM' && (
            <div className="effect-config-group">
              <h4 className="section-header">Form Configuration</h4>

              <div className="effect-select-group">
                <label>Select Form Spell</label>
                <SpellSelector
                  selectedSpellId={config.formOptions.formSpellId}
                  onSpellSelect={handleFormSpellSelect}
                  filterType="form"
                  label="Search for form spells..."
                />
                <div className="effect-description">
                  Select a transformation spell from your library to use as the required form.
                </div>
              </div>

              {!config.formOptions.formSpellId && (
                <div className="effect-warning">
                  <FontAwesomeIcon icon={faSkull} style={{ marginRight: '0.5rem' }} />
                  No form spell selected. Create transformation spells in your library first.
                </div>
              )}

              <div className="effect-select-group">
                <label>Bonus Type</label>
                <select
                  value={config.formOptions.bonusType}
                  onChange={(e) => handleFormOptionChange('bonusType', e.target.value)}
                  className="effect-select"
                >
                  <option value="damage">Increased Damage</option>
                  <option value="healing">Increased Healing</option>
                  <option value="defense">Increased Defense</option>
                  <option value="resource">Resource Cost Reduction</option>
                  <option value="cooldown">Cooldown Reduction</option>
                </select>
                <div className="effect-description">
                  The type of bonus granted when in the required form.
                </div>
              </div>

              <div className="effect-numeric-input">
                <label>Bonus Amount (%)</label>
                <div className="effect-numeric-controls">
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleFormOptionChange('bonusAmount', Math.max(5, config.formOptions.bonusAmount - 5))}
                  >-</button>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={config.formOptions.bonusAmount}
                    onChange={(e) => handleFormOptionChange('bonusAmount', e.target.value)}
                    className="threshold-slider"
                  />
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleFormOptionChange('bonusAmount', Math.min(100, config.formOptions.bonusAmount + 5))}
                  >+</button>
                  <div className="threshold-value" style={{ color: selectedSystem.color, fontWeight: 'bold' }}>
                    {config.formOptions.bonusAmount}%
                  </div>
                </div>
                <div className="effect-description">
                  The percentage bonus applied when in the required form.
                </div>
              </div>

              <div className="effect-toggle-group">
                <label>Restrict Casting</label>
                <button
                  className={`effect-toggle-switch ${config.formOptions.restrictCasting ? 'active' : ''}`}
                  onClick={() => handleFormOptionChange('restrictCasting', !config.formOptions.restrictCasting)}
                >
                  <span className="effect-toggle-slider"></span>
                </button>
                <span>{config.formOptions.restrictCasting ? 'Yes' : 'No'}</span>
                <div className="effect-description">
                  If enabled, this effect can only be cast while in the required form.
                  If disabled, the effect can be cast in any form but receives bonuses in the specified form.
                </div>
              </div>
            </div>
          )}

          {(config.type === 'builder' || config.type === 'spender') && (
            <div className="effect-config-group">
              <h4 className="section-header">{config.type === 'builder' ? 'Generation' : 'Consumption'} Value</h4>
              <div className="effect-numeric-input">
                <label>{config.type === 'builder' ? 'Points to generate' : 'Points to consume'} {selectedSystem.isPercentage ? '(%)' : ''}</label>
                <div className="effect-numeric-controls">
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleThresholdChange(Math.max(1, config.thresholdValue - 1))}
                  >-</button>
                  <input
                    type="number"
                    min="1"
                    max={selectedSystem.maxPoints}
                    value={config.thresholdValue}
                    onChange={(e) => handleThresholdChange(e.target.value)}
                    className="effect-numeric-value"
                  />
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleThresholdChange(Math.min(selectedSystem.maxPoints, config.thresholdValue + 1))}
                  >+</button>
                </div>
              </div>
              <div className="effect-description">
                {config.type === 'builder' ?
                  `This effect will generate ${config.thresholdValue} ${selectedSystem.name.toLowerCase()} when cast.` :
                  `This effect will consume ${config.thresholdValue} ${selectedSystem.name.toLowerCase()} to power its effect.`}
              </div>
            </div>
          )}

          {/* System-specific configuration sections */}
          {config.system === 'STATE_REQUIREMENTS' && (
            <div className="effect-config-group">
              <h4 className="section-header">State Requirements Configuration</h4>

              <div className="effect-select-group">
                <label>Resource Type</label>
                <select
                  value={config.stateOptions?.resourceType || 'health'}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (e.nativeEvent) {
                      e.nativeEvent.stopImmediatePropagation();
                    }
                    handleStateOptionChange('resourceType', e.target.value, e);
                  }}
                  className="effect-select"
                  style={{ borderColor: getResourceColor(config.stateOptions?.resourceType || 'health') }}
                >
                  <option value="health">Health</option>
                  <option value="mana">Mana</option>
                  <option value="energy">Energy</option>
                  <option value="rage">Rage</option>
                  <option value="inferno">Inferno</option>
                  <option value="focus">Focus</option>
                  <option value="runic">Runic Power</option>
                  <option value="astral">Astral Power</option>
                  <option value="holy">Holy Power</option>
                </select>
                <div className="effect-description">
                  Select which resource this spell interacts with.
                </div>
              </div>

              <div className="effect-select-group">
                <label>Threshold Type</label>
                <select
                  value={config.stateOptions?.thresholdType || 'below'}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (e.nativeEvent) {
                      e.nativeEvent.stopImmediatePropagation();
                    }
                    handleStateOptionChange('thresholdType', e.target.value, e);
                  }}
                  className="effect-select"
                >
                  <option value="below">Below Threshold</option>
                  <option value="above">Above Threshold</option>
                  <option value="equal">Equal to Threshold</option>
                </select>
                <div className="effect-description">
                  When should the additional effect trigger?
                </div>
              </div>

              {/* Original Formula Display */}
              <div className="effect-config-group">
                <label>Original Formula</label>
                <div className="original-formula-display">
                  {getOriginalFormula()}
                </div>
                <div className="effect-description">
                  This is the base formula from your effect configuration.
                  <div className="formula-type-indicator">
                    Formula Type: <span className="highlight">{getResolutionMethod(getOriginalFormula())}</span>
                  </div>
                </div>
              </div>

              {/* Modified Formula Input */}
              <div className="effect-config-group">
                <label>Modified Formula</label>
                <input
                  type="text"
                  value={config.stateOptions?.modifiedFormula || ''}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (e.nativeEvent) {
                      e.nativeEvent.stopImmediatePropagation();
                    }
                    // Use setTimeout to ensure this runs after the current event cycle
                    setTimeout(() => {
                      setConfig(prevConfig => ({
                        ...prevConfig,
                        stateOptions: {
                          ...prevConfig.stateOptions,
                          modifiedFormula: e.target.value
                        }
                      }));
                    }, 0);
                  }}
                  className="effect-input"
                  placeholder={getOriginalFormula()}
                />
                <div className="effect-description">
                  Enter the formula that will be used when the resource threshold condition is met.
                  Leave empty to use the original formula.
                </div>
              </div>

              <ResourceThresholdSlider
                value={config.stateOptions.thresholdValue}
                onChange={(value, e) => {
                  if (e) {
                    e.stopPropagation();
                    if (e.nativeEvent) {
                      e.nativeEvent.stopImmediatePropagation();
                    }
                  }
                  handleStateOptionChange('thresholdValue', value, e);
                }}
                resourceType={config.stateOptions.resourceType || 'energy'}
                comparison={config.stateOptions.thresholdType || 'below'}
                thresholdType={config.stateOptions.valueType || 'percentage'}
                onThresholdTypeChange={(type, e) => {
                  if (e) {
                    e.stopPropagation();
                    if (e.nativeEvent) {
                      e.nativeEvent.stopImmediatePropagation();
                    }
                  }
                  handleStateOptionChange('valueType', type, e);
                }}
              />

              {/* Multiple Thresholds Section */}
              <div className="effect-config-group">
                <h4 className="section-header">Multiple Resource Thresholds</h4>
                <div className="effect-description">
                  Configure different formulas for different resource thresholds. If a resource level doesn't match any threshold,
                  the default formula from the effects section will be used.
                </div>

                {/* List of existing thresholds */}
                {config.stateOptions.thresholds && config.stateOptions.thresholds.length > 0 ? (
                  <div className="thresholds-list">
                    {config.stateOptions.thresholds.map((threshold, index) => (
                      <div key={index} className="threshold-item" style={{ marginBottom: '20px', padding: '15px', borderRadius: '5px', backgroundColor: 'rgba(30, 58, 138, 0.1)' }}>
                        <div className="threshold-item-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <h5 style={{ margin: '0' }}>Threshold #{index + 1}</h5>
                          <button
                            className="remove-threshold-btn"
                            onClick={() => handleRemoveThreshold(index)}
                            style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="threshold-config">
                          <div className="effect-select-group">
                            <label>Resource Type</label>
                            <select
                              value={threshold.resourceType || 'health'}
                              onChange={(e) => {
                                const newThresholds = [...config.stateOptions.thresholds];
                                newThresholds[index] = {
                                  ...newThresholds[index],
                                  resourceType: e.target.value
                                };
                                setConfig({
                                  ...config,
                                  stateOptions: {
                                    ...config.stateOptions,
                                    thresholds: newThresholds
                                  }
                                });
                              }}
                              className="effect-select"
                              style={{ borderColor: getResourceColor(threshold.resourceType || 'health') }}
                            >
                              <option value="health">Health</option>
                              <option value="mana">Mana</option>
                              <option value="energy">Energy</option>
                              <option value="rage">Rage</option>
                              <option value="inferno">Inferno</option>
                              <option value="focus">Focus</option>
                              <option value="runic">Runic Power</option>
                              <option value="astral">Astral Power</option>
                              <option value="holy">Holy Power</option>
                            </select>
                          </div>

                          <div className="effect-select-group">
                            <label>Comparison</label>
                            <select
                              value={threshold.thresholdType || 'below'}
                              onChange={(e) => {
                                const newThresholds = [...config.stateOptions.thresholds];
                                newThresholds[index] = {
                                  ...newThresholds[index],
                                  thresholdType: e.target.value
                                };
                                setConfig({
                                  ...config,
                                  stateOptions: {
                                    ...config.stateOptions,
                                    thresholds: newThresholds
                                  }
                                });
                              }}
                              className="effect-select"
                            >
                              <option value="below">Below Threshold</option>
                              <option value="above">Above Threshold</option>
                              <option value="equal">Equal to Threshold</option>
                            </select>
                          </div>

                          <div className="effect-numeric-input">
                            <label>Threshold Value</label>
                            <div className="effect-numeric-controls">
                              <button
                                className="effect-numeric-button"
                                onClick={() => {
                                  const newThresholds = [...config.stateOptions.thresholds];
                                  newThresholds[index] = {
                                    ...newThresholds[index],
                                    value: Math.max(1, (newThresholds[index].value || 50) - 5)
                                  };
                                  setConfig({
                                    ...config,
                                    stateOptions: {
                                      ...config.stateOptions,
                                      thresholds: newThresholds
                                    }
                                  });
                                }}
                              >-</button>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={threshold.value || 50}
                                onChange={(e) => {
                                  const newThresholds = [...config.stateOptions.thresholds];
                                  newThresholds[index] = {
                                    ...newThresholds[index],
                                    value: parseInt(e.target.value, 10)
                                  };
                                  setConfig({
                                    ...config,
                                    stateOptions: {
                                      ...config.stateOptions,
                                      thresholds: newThresholds
                                    }
                                  });
                                }}
                                className="effect-numeric-value"
                              />
                              <button
                                className="effect-numeric-button"
                                onClick={() => {
                                  const newThresholds = [...config.stateOptions.thresholds];
                                  newThresholds[index] = {
                                    ...newThresholds[index],
                                    value: Math.min(100, (newThresholds[index].value || 50) + 5)
                                  };
                                  setConfig({
                                    ...config,
                                    stateOptions: {
                                      ...config.stateOptions,
                                      thresholds: newThresholds
                                    }
                                  });
                                }}
                              >+</button>
                              <div className="threshold-value-display" style={{ color: getResourceColor(threshold.resourceType || 'health') }}>
                                {threshold.value || 50}{threshold.valueType === 'flat' ? '' : '%'}
                              </div>
                            </div>
                          </div>

                          <div className="effect-select-group">
                            <label>Value Type</label>
                            <div className="threshold-type-toggle">
                              <button
                                className={`threshold-type-option ${(threshold.valueType || 'percentage') === 'percentage' ? 'active' : ''}`}
                                onClick={() => {
                                  const newThresholds = [...config.stateOptions.thresholds];
                                  newThresholds[index] = {
                                    ...newThresholds[index],
                                    valueType: 'percentage'
                                  };
                                  setConfig({
                                    ...config,
                                    stateOptions: {
                                      ...config.stateOptions,
                                      thresholds: newThresholds
                                    }
                                  });
                                }}
                              >
                                Percentage
                              </button>
                              <button
                                className={`threshold-type-option ${(threshold.valueType || 'percentage') === 'flat' ? 'active' : ''}`}
                                onClick={() => {
                                  const newThresholds = [...config.stateOptions.thresholds];
                                  newThresholds[index] = {
                                    ...newThresholds[index],
                                    valueType: 'flat'
                                  };
                                  setConfig({
                                    ...config,
                                    stateOptions: {
                                      ...config.stateOptions,
                                      thresholds: newThresholds
                                    }
                                  });
                                }}
                              >
                                Flat Value
                              </button>
                            </div>
                          </div>

                          <div className="effect-config-group">
                            <label>Formula for this Threshold</label>
                            <input
                              type="text"
                              value={threshold.formula || ''}
                              onChange={(e) => {
                                const newThresholds = [...config.stateOptions.thresholds];
                                newThresholds[index] = {
                                  ...newThresholds[index],
                                  formula: e.target.value
                                };
                                setConfig({
                                  ...config,
                                  stateOptions: {
                                    ...config.stateOptions,
                                    thresholds: newThresholds
                                  }
                                });
                              }}
                              className="effect-input"
                              placeholder={getOriginalFormula()}
                            />
                            <div className="effect-description">
                              Enter the formula that will be used when this threshold condition is met.
                              Leave empty to use the original formula.
                            </div>
                          </div>

                          <div className="threshold-description" style={{ marginTop: '10px', padding: '10px', backgroundColor: 'rgba(30, 58, 138, 0.05)', borderRadius: '4px' }}>
                            Effect triggers when {threshold.resourceType?.charAt(0).toUpperCase() + threshold.resourceType?.slice(1) || 'Health'} is
                            {threshold.thresholdType === 'below' ? ' below ' :
                             threshold.thresholdType === 'above' ? ' above ' :
                             ' exactly at '}
                            {threshold.value || 50}{threshold.valueType === 'flat' ? '' : '%'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-thresholds-message" style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                    No additional thresholds configured. Add a threshold to create different effects based on resource levels.
                  </div>
                )}

                <button
                  className="add-threshold-btn"
                  onClick={handleAddThreshold}
                  style={{ marginTop: '15px', padding: '8px 15px', backgroundColor: '#3366FF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add Threshold
                </button>
              </div>

              {/* State Requirements Preview */}
              <div className="state-requirements-preview">
                <h4 className="section-header">Preview</h4>

                {/* Main threshold preview */}
                <div className="main-threshold-preview" style={{ marginBottom: '20px' }}>
                  <h5>Primary Threshold</h5>
                  <p>
                    When <span className="resource-name" style={{ color: getResourceColor(config.stateOptions.resourceType) }}>
                      {config.stateOptions.resourceType}
                    </span> is
                    <span className="highlight" style={{ color: selectedSystem.color }}>
                      {config.stateOptions.thresholdType === 'below' || config.stateOptions.thresholdType === 'less_than' ? ' below ' :
                       config.stateOptions.thresholdType === 'above' || config.stateOptions.thresholdType === 'greater_than' ? ' above ' :
                       config.stateOptions.thresholdType === 'equal' || config.stateOptions.thresholdType === 'exactly_at' ? ' exactly at ' :
                       ' exactly at '} {config.stateOptions.thresholdValue}{config.stateOptions.valueType === 'percentage' ? '%' : ''}
                    </span>,
                    this spell will use this formula:
                  </p>
                  <div className="formula-preview modified" style={{ backgroundColor: 'rgba(30, 58, 138, 0.2)', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    <strong>Modified Formula:</strong> {config.stateOptions.modifiedFormula || getOriginalFormula()}
                  </div>
                </div>

                {/* Additional thresholds preview */}
                {config.stateOptions.thresholds && config.stateOptions.thresholds.length > 0 && (
                  <div className="additional-thresholds-preview">
                    <h5>Additional Thresholds</h5>
                    {config.stateOptions.thresholds.map((threshold, index) => (
                      <div key={index} className="threshold-preview" style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(30, 58, 138, 0.1)', borderRadius: '4px' }}>
                        <p>
                          When <span className="resource-name" style={{ color: getResourceColor(threshold.resourceType || 'health') }}>
                            {threshold.resourceType?.charAt(0).toUpperCase() + threshold.resourceType?.slice(1) || 'Health'}
                          </span> is
                          <span className="highlight" style={{ color: selectedSystem.color }}>
                            {threshold.thresholdType === 'below' ? ' below ' :
                             threshold.thresholdType === 'above' ? ' above ' :
                             ' exactly at '} {threshold.value || 50}{threshold.valueType === 'flat' ? '' : '%'}
                          </span>,
                          this spell will use this formula:
                        </p>
                        <div className="formula-preview modified" style={{ backgroundColor: 'rgba(30, 58, 138, 0.2)', padding: '10px', borderRadius: '4px' }}>
                          <strong>Formula:</strong> {threshold.formula || getOriginalFormula()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="default-formula-preview" style={{ marginTop: '20px' }}>
                  <p>If no threshold conditions are met, the spell will use the original formula:</p>
                  <div className="formula-preview original" style={{ backgroundColor: 'rgba(30, 30, 30, 0.2)', padding: '10px', borderRadius: '4px' }}>
                    <strong>Original Formula:</strong> {getOriginalFormula()}
                  </div>
                </div>
              </div>



              {/* Effect scaling section removed as requested */}
            </div>
          )}

          {config.system === 'CHORD_SYSTEM' && (
            <div className="effect-config-group">
              <h4 className="section-header">Chord System Configuration</h4>

              {/* WoW Classic Tooltip */}
              <Wc3Tooltip
                content={tooltipContent?.content}
                title={tooltipContent?.title}
                icon={tooltipContent?.icon}
                position={mousePos}
                isVisible={showTooltip}
              />

              {/* Note/Builder Configuration */}
              {config.type === 'note' && (
                <>
                  <div className="effect-select-group">
                    <label>Chord Function</label>
                    <div className="chord-function-selector">
                      {STEP_MECHANICS_SYSTEMS.CHORD_SYSTEM.chordFunctions.map(chordFunction => (
                        <button
                          key={chordFunction.id}
                          className={`chord-function-button ${config.chordOptions.chordFunction === chordFunction.id ? 'active' : ''}`}
                          style={{ borderColor: chordFunction.color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (e.nativeEvent) {
                              e.nativeEvent.stopImmediatePropagation();
                            }
                            handleChordOptionChange('chordFunction', chordFunction.id, e);
                            return false;
                          }}
                          onMouseEnter={(e) => handleChordTooltipEnter(chordFunction, e)}
                          onMouseLeave={handleChordTooltipLeave}
                          onMouseMove={handleChordTooltipMove}
                        >
                          {chordFunction.wowIcon ? (
                            <div className="chord-icon-wrapper">
                              <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${chordFunction.wowIcon}.jpg`}
                                alt={chordFunction.name}
                                style={{ width: '42px', height: '42px', borderRadius: '4px' }}
                              />
                            </div>
                          ) : (
                            <div className="chord-icon-wrapper">
                              {chordFunction.name}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="effect-description">
                      Select the chord function this note represents in music theory.
                    </div>
                  </div>

                  <div className="effect-toggle-group">
                    <label>Wildcard Note</label>
                    <button
                      className={`effect-toggle-switch ${config.chordOptions.isWildcard ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (e.nativeEvent) {
                          e.nativeEvent.stopImmediatePropagation();
                        }
                        handleChordOptionChange('isWildcard', !config.chordOptions.isWildcard, e);
                        return false;
                      }}
                    >
                      <span className="effect-toggle-slider"></span>
                    </button>
                    <span>{config.chordOptions.isWildcard ? 'Yes' : 'No'}</span>
                    <div className="effect-description">
                      If enabled, this note can substitute for any chord function in a recipe.
                    </div>
                  </div>

                  <div className="effect-numeric-input">
                    <label>Extend Improvisation Window (rounds)</label>
                    <div className="effect-numeric-controls">
                      <button
                        className="effect-numeric-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleChordOptionChange('extendDuration', Math.max(0, config.chordOptions.extendDuration - 1), e);
                          return false;
                        }}
                      >-</button>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={config.chordOptions.extendDuration}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleChordOptionChange('extendDuration', parseInt(e.target.value), e);
                        }}
                        className="effect-numeric-value"
                      />
                      <button
                        className="effect-numeric-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleChordOptionChange('extendDuration', Math.min(5, config.chordOptions.extendDuration + 1), e);
                          return false;
                        }}
                      >+</button>
                    </div>
                    <div className="effect-description">
                      Number of additional rounds the improvisation window remains open.
                      {config.chordOptions.extendDuration > 0 ? ` Notes will remain active for ${config.chordOptions.extendDuration} additional rounds.` : ''}
                    </div>
                  </div>
                </>
              )}

              {/* Chord/Spender Configuration */}
              {config.type === 'chord' && (
                <>
                  <div className="effect-config-group">
                    <label>Recipe Requirements</label>
                    <div className="recipe-display">
                      {config.chordOptions.recipeDisplay && config.chordOptions.recipeDisplay.length > 0 ? (
                        <div className="recipe-sequence">
                          {config.chordOptions.recipeDisplay.map((chordFunction, index) => (
                            <div key={index} className="recipe-item" style={{ borderColor: chordFunction.color }}>
                              {chordFunction.wowIcon ? (
                                <div className="chord-icon-wrapper">
                                  <img
                                    src={`https://wow.zamimg.com/images/wow/icons/large/${chordFunction.wowIcon}.jpg`}
                                    alt={chordFunction.name}
                                    style={{ width: '36px', height: '36px', borderRadius: '4px' }}
                                    onMouseEnter={(e) => handleChordTooltipEnter(chordFunction, e)}
                                    onMouseLeave={handleChordTooltipLeave}
                                    onMouseMove={handleChordTooltipMove}
                                  />
                                </div>
                              ) : (
                                <span>{chordFunction.name}</span>
                              )}
                              <button
                                className="recipe-remove-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  e.nativeEvent.stopImmediatePropagation();
                                  removeChordFromRecipe(index, e);
                                  return false;
                                }}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="recipe-empty">No chord functions added to recipe</div>
                      )}
                    </div>
                    <div className="effect-description">
                      The sequence of chord functions required to play this chord.
                      This spell can only be cast when the exact sequence is available.
                    </div>
                  </div>

                  <div className="effect-config-group">
                    <label>Add to Recipe</label>
                    <div className="chord-function-selector">
                      {STEP_MECHANICS_SYSTEMS.CHORD_SYSTEM.chordFunctions.map(chordFunction => (
                        <button
                          key={chordFunction.id}
                          className="chord-function-button"
                          style={{ borderColor: chordFunction.color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (e.nativeEvent) {
                              e.nativeEvent.stopImmediatePropagation();
                            }
                            addChordToRecipe(chordFunction, e);
                            return false;
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          onMouseEnter={(e) => handleChordTooltipEnter(chordFunction, e)}
                          onMouseLeave={handleChordTooltipLeave}
                          onMouseMove={handleChordTooltipMove}
                        >
                          {chordFunction.wowIcon ? (
                            <div className="chord-icon-wrapper">
                              <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${chordFunction.wowIcon}.jpg`}
                                alt={chordFunction.name}
                                style={{ width: '42px', height: '42px', borderRadius: '4px' }}
                              />
                            </div>
                          ) : (
                            <div className="chord-icon-wrapper">
                              {chordFunction.name}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <button
                      className="clear-recipe-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (e.nativeEvent) {
                          e.nativeEvent.stopImmediatePropagation();
                        }
                        clearRecipe(e);
                        return false;
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      disabled={!config.chordOptions.recipeDisplay || config.chordOptions.recipeDisplay.length === 0}
                    >
                      Clear Recipe
                    </button>
                  </div>

                  <div className="effect-numeric-input">
                    <label>Improvisation Window (rounds)</label>
                    <div className="effect-numeric-controls">
                      <button
                        className="effect-numeric-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleChordOptionChange('improvisationWindow', Math.max(1, config.chordOptions.improvisationWindow - 1), e);
                          return false;
                        }}
                      >-</button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={config.chordOptions.improvisationWindow}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleChordOptionChange('improvisationWindow', parseInt(e.target.value), e);
                        }}
                        className="effect-numeric-value"
                      />
                      <button
                        className="effect-numeric-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleChordOptionChange('improvisationWindow', Math.min(10, config.chordOptions.improvisationWindow + 1), e);
                          return false;
                        }}
                      >+</button>
                    </div>
                    <div className="effect-description">
                      Base number of rounds that notes remain active in the improvisation window.
                      Notes will decay after {config.chordOptions.improvisationWindow} rounds unless extended.
                    </div>
                  </div>

                  {/* Graduated Recipe Effects */}
                  {config.chordOptions.recipeDisplay && config.chordOptions.recipeDisplay.length > 0 && (
                    <EnhancedGraduatedRecipeEffects
                      recipeLength={config.chordOptions.recipeDisplay.length}
                      graduatedEffects={config.chordOptions.graduatedEffects}
                      onGraduatedEffectsChange={handleGraduatedEffectsChange}
                      effectType={effectType || 'control'}
                      isChordSystem={true}
                      selectedToxicTypes={Object.fromEntries(config.chordOptions.recipeDisplay.map(chord => [chord.id, 1]))}
                      onToxicTooltipEnter={handleChordTooltipEnter}
                      onToxicTooltipLeave={handleChordTooltipLeave}
                      onToxicTooltipMove={handleChordTooltipMove}
                    />
                  )}
                </>
              )}

              {/* Wildcard Note Configuration */}
              {config.type === 'wildcard' && (
                <div className="effect-description">
                  Wildcard notes can substitute for any chord function in a recipe.
                  They count as any single chord function the player needs.
                </div>
              )}

              {/* Extender Configuration */}
              {config.type === 'extender' && (
                <div className="effect-numeric-input">
                  <label>Extend Improvisation Window (rounds)</label>
                  <div className="effect-numeric-controls">
                    <button
                      className="effect-numeric-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleChordOptionChange('extendDuration', Math.max(1, config.chordOptions.extendDuration - 1));
                      }}
                    >-</button>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={config.chordOptions.extendDuration}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleChordOptionChange('extendDuration', parseInt(e.target.value));
                      }}
                      className="effect-numeric-value"
                    />
                    <button
                      className="effect-numeric-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleChordOptionChange('extendDuration', Math.min(5, config.chordOptions.extendDuration + 1));
                      }}
                    >+</button>
                  </div>
                  <div className="effect-description">
                    Number of additional rounds the improvisation window remains open.
                    Extends the duration of all active notes by {config.chordOptions.extendDuration} rounds.
                  </div>
                </div>
              )}
            </div>
          )}

          {config.system === 'PROC_SYSTEM' && (
            <div className="effect-config-group">
              <h4 className="section-header">Proc System Configuration</h4>

              <div className="effect-select-group">
                <label>Select Proc Effect Spell</label>
                <SpellSelector
                  selectedSpellId={config.procOptions.spellId}
                  onSelectSpell={handleProcSpellSelect}
                  filterType="proc"
                  placeholder="Search for proc effect spells..."
                />
                <div className="effect-description">
                  Select a spell from your library to trigger as a proc effect.
                </div>
              </div>

              {!config.procOptions.spellId && (
                <div className="effect-warning">
                  <FontAwesomeIcon icon={faSkull} style={{ marginRight: '0.5rem' }} />
                  No proc spell selected. Create damage, healing, or buff spells in your library first.
                </div>
              )}

              <div className="effect-select-group">
                <label>Proc Type</label>
                <select
                  value={config.procOptions.procType}
                  onChange={(e) => handleProcOptionChange('procType', e.target.value)}
                  className="effect-select"
                >
                  <option value="critical_strike">Critical Strike</option>
                  <option value="on_hit">On Hit</option>
                  <option value="periodic">Periodic</option>
                  <option value="chance_based">Random Chance</option>
                </select>
                <div className="effect-description">
                  The condition that triggers this proc effect.
                </div>
              </div>

              <div className="effect-numeric-input">
                <label>Proc Chance (%)</label>
                <div className="effect-numeric-controls">
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleProcOptionChange('procChance', Math.max(1, config.procOptions.procChance - 5))}
                  >-</button>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={config.procOptions.procChance}
                    onChange={(e) => handleProcOptionChange('procChance', e.target.value)}
                    className="threshold-slider"
                  />
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleProcOptionChange('procChance', Math.min(100, config.procOptions.procChance + 5))}
                  >+</button>
                  <div className="threshold-value" style={{ color: selectedSystem.color, fontWeight: 'bold' }}>
                    {config.procOptions.procChance}%
                  </div>
                </div>
                <div className="effect-description">
                  Chance for the proc to trigger when conditions are met.
                </div>
              </div>

              <div className="effect-select-group">
                <label>Effect Type</label>
                <select
                  value={config.procOptions.effectType}
                  onChange={(e) => handleProcOptionChange('effectType', e.target.value)}
                  className="effect-select"
                >
                  <option value="damage">Additional Damage</option>
                  <option value="healing">Healing Surge</option>
                  <option value="buff">Buff Effect</option>
                  <option value="debuff">Debuff Effect</option>
                  <option value="resource">Resource Generation</option>
                </select>
                <div className="effect-description">
                  What happens when the proc triggers.
                </div>
              </div>

              <div className="effect-select-group">
                <label>Trigger Limit</label>
                <select
                  value={config.procOptions.triggerLimit}
                  onChange={(e) => handleProcOptionChange('triggerLimit', e.target.value)}
                  className="effect-select"
                >
                  <option value="1">Once per cast</option>
                  <option value="2">Twice per cast</option>
                  <option value="3">Three times per cast</option>
                  <option value="0">Unlimited</option>
                </select>
                <div className="effect-description">
                  How many times this proc can trigger per spell cast.
                </div>
              </div>
            </div>
          )}

          {config.system === 'TOXIC_SYSTEM' && (
            <div className="effect-config-group">
              <h4 className="section-header">Toxic/Disease System Configuration</h4>

              {/* Toxic Applier Configuration */}
              {config.type === 'toxic_applier' && (
                <>
                  <div className="effect-select-group">
                    <label>Toxic Types</label>
                    <div className="toxic-type-selector">
                      {STEP_MECHANICS_SYSTEMS.TOXIC_SYSTEM.toxicTypes.map(toxicType => (
                        <button
                          key={toxicType.id}
                          className={`toxic-icon-button ${config.toxicOptions.selectedToxicTypes[toxicType.id] ? 'active' : ''}`}
                          style={{ borderColor: toxicType.color }}
                          onClick={(e) => handleToxicTypeSelect(toxicType, e)}
                          onMouseEnter={(e) => handleToxicTooltipEnter(toxicType, e)}
                          onMouseLeave={handleToxicTooltipLeave}
                          onMouseMove={handleToxicTooltipMove}
                        >
                          {toxicType.wowIcon ? (
                            <div className="toxic-icon-wrapper">
                              <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${toxicType.wowIcon}.jpg`}
                                alt={toxicType.name}
                                style={{ width: '42px', height: '42px', borderRadius: '4px' }}
                              />
                              {config.toxicOptions.selectedToxicTypes[toxicType.id] && (
                                <div className="toxic-count">{config.toxicOptions.selectedToxicTypes[toxicType.id]}</div>
                              )}
                            </div>
                          ) : (
                            <div className="toxic-icon-wrapper">
                              <FontAwesomeIcon icon={toxicType.icon} style={{ fontSize: '24px', color: toxicType.color }} />
                              {config.toxicOptions.selectedToxicTypes[toxicType.id] && (
                                <div className="toxic-count">{config.toxicOptions.selectedToxicTypes[toxicType.id]}</div>
                              )}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="effect-description">
                      Select the types of toxic effects this spell applies to targets. Click multiple times to increase count.
                    </div>
                    <button
                      className="clear-toxic-btn"
                      onClick={clearSelectedToxicTypes}
                      disabled={Object.keys(config.toxicOptions.selectedToxicTypes).length === 0}
                    >
                      Clear All Selections
                    </button>
                  </div>

                  <div className="effect-numeric-input">
                    <label>Duration</label>
                    <div className="effect-numeric-controls">
                      <button
                        className="effect-numeric-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleToxicOptionChange('duration', Math.max(1, config.toxicOptions.duration - 1), e);
                          return false;
                        }}
                      >-</button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={config.toxicOptions.duration}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleToxicOptionChange('duration', parseInt(e.target.value), e);
                        }}
                        className="effect-numeric-value"
                        style={{ width: '120px', minWidth: '120px', textAlign: 'center' }}
                      />
                      <button
                        className="effect-numeric-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleToxicOptionChange('duration', Math.min(10, config.toxicOptions.duration + 1), e);
                          return false;
                        }}
                      >+</button>
                      <select
                        value={config.toxicOptions.durationType}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleToxicOptionChange('durationType', e.target.value, e);
                        }}
                        className="effect-select"
                      >
                        <option value="rounds">Rounds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="permanent">Until Dispelled</option>
                      </select>
                    </div>
                    <div className="effect-description">
                      How long the toxic effect lasts before expiring if not consumed.
                    </div>
                  </div>
                </>
              )}

              {/* Toxic Consumer Configuration */}
              {config.type === 'toxic_consumer' && (
                <>
                  <div className="effect-config-group">
                    <label>Consumption Rule</label>
                    <div className="consumption-rule-buttons">
                      <button
                        className={`consumption-rule-button ${config.toxicOptions.consumptionRule === 'all' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleToxicOptionChange('consumptionRule', 'all', e);
                          return false;
                        }}
                      >
                        <FontAwesomeIcon icon={faSkullCrossbones} style={{ marginRight: '8px' }} />
                        Consume All Toxics
                      </button>
                      <button
                        className={`consumption-rule-button ${config.toxicOptions.consumptionRule === 'specific' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (e.nativeEvent) {
                            e.nativeEvent.stopImmediatePropagation();
                          }
                          handleToxicOptionChange('consumptionRule', 'specific', e);
                          return false;
                        }}
                      >
                        <FontAwesomeIcon icon={faFlask} style={{ marginRight: '8px' }} />
                        Consume Specific Types
                      </button>
                    </div>
                    <div className="effect-description">
                      How this spell consumes toxic effects from the target.
                    </div>
                  </div>

                  {/* First Update Formula button - kept this one */}
                  <div className="effect-toggle-group">
                    <label>Update Formula</label>
                    <button
                      className={`effect-toggle-switch ${config.toxicOptions.updateFormula ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (e.nativeEvent) {
                          e.nativeEvent.stopImmediatePropagation();
                        }
                        handleToxicOptionChange('updateFormula', !config.toxicOptions.updateFormula, e);
                        return false;
                      }}
                    >
                      <span className="effect-toggle-slider"></span>
                    </button>
                    <span>{config.toxicOptions.updateFormula ? 'Yes' : 'No'}</span>
                    <div className="effect-description">
                      If enabled, the spell's formula will be updated based on consumed toxic effects.
                    </div>
                  </div>

                  <div className="effect-config-group">
                    <label>Toxic Types to Consume</label>
                    <div className="toxic-type-selector">
                      {STEP_MECHANICS_SYSTEMS.TOXIC_SYSTEM.toxicTypes.map(toxicType => (
                        <button
                          key={toxicType.id}
                          className={`toxic-icon-button ${config.toxicOptions.selectedToxicTypes[toxicType.id] ? 'active' : ''}`}
                          style={{ borderColor: toxicType.color }}
                          onClick={(e) => handleToxicTypeSelect(toxicType, e)}
                          onMouseEnter={(e) => handleToxicTooltipEnter(toxicType, e)}
                          onMouseLeave={handleToxicTooltipLeave}
                          onMouseMove={handleToxicTooltipMove}
                        >
                          {toxicType.wowIcon ? (
                            <div className="toxic-icon-wrapper">
                              <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${toxicType.wowIcon}.jpg`}
                                alt={toxicType.name}
                                style={{ width: '42px', height: '42px', borderRadius: '4px' }}
                              />
                              {config.toxicOptions.selectedToxicTypes[toxicType.id] && (
                                <div className="toxic-count">{config.toxicOptions.selectedToxicTypes[toxicType.id]}</div>
                              )}
                            </div>
                          ) : (
                            <div className="toxic-icon-wrapper">
                              <FontAwesomeIcon icon={toxicType.icon} style={{ fontSize: '24px', color: toxicType.color }} />
                              {config.toxicOptions.selectedToxicTypes[toxicType.id] && (
                                <div className="toxic-count">{config.toxicOptions.selectedToxicTypes[toxicType.id]}</div>
                              )}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="effect-description">
                      Select the types of toxic effects to consume from the target. Click multiple times to increase count.
                    </div>
                    <button
                      className="clear-toxic-btn"
                      onClick={clearSelectedToxicTypes}
                      disabled={Object.keys(config.toxicOptions.selectedToxicTypes).length === 0}
                    >
                      Clear All Selections
                    </button>
                  </div>

                  {/* Removed duplicate Update Formula button */}

                  {config.toxicOptions.updateFormula && (
                    <div className="effect-config-group">
                      <label>Toxic Consumption Effects</label>
                      <EnhancedGraduatedRecipeEffects
                        recipeLength={Object.keys(config.toxicOptions.selectedToxicTypes).length || 1}
                        graduatedEffects={config.toxicOptions.toxicEffects}
                        onGraduatedEffectsChange={handleToxicEffectsChange}
                        effectType={effectType}
                        selectedToxicTypes={config.toxicOptions.selectedToxicTypes}
                        onToxicTooltipEnter={handleToxicTooltipEnter}
                        onToxicTooltipLeave={handleToxicTooltipLeave}
                        onToxicTooltipMove={handleToxicTooltipMove}
                        isChordSystem={false}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {config.system === 'FORM_SYSTEM' && (
            <div className="effect-config-group">
              <h4 className="section-header">Form/Stance Configuration</h4>

              <div className="effect-select-group">
                <label>Required Form</label>
                <select
                  value={config.formOptions.requiredForm}
                  onChange={(e) => handleFormOptionChange('requiredForm', e.target.value)}
                  className="effect-select"
                >
                  <option value="bear_form">Bear Form</option>
                  <option value="cat_form">Cat Form</option>
                  <option value="moonkin_form">Moonkin Form</option>
                  <option value="tree_form">Tree Form</option>
                  <option value="battle_stance">Battle Stance</option>
                  <option value="defensive_stance">Defensive Stance</option>
                  <option value="berserker_stance">Berserker Stance</option>
                </select>
                <div className="effect-description">
                  The form or stance required to use this effect.
                </div>
              </div>

              <div className="effect-select-group">
                <label>Bonus Type</label>
                <select
                  value={config.formOptions.bonusType}
                  onChange={(e) => handleFormOptionChange('bonusType', e.target.value)}
                  className="effect-select"
                >
                  <option value="damage">Increased Damage</option>
                  <option value="healing">Increased Healing</option>
                  <option value="defense">Increased Defense</option>
                  <option value="resource">Resource Cost Reduction</option>
                  <option value="cooldown">Cooldown Reduction</option>
                </select>
                <div className="effect-description">
                  The type of bonus granted when in the required form.
                </div>
              </div>

              <div className="effect-numeric-input">
                <label>Bonus Amount (%)</label>
                <div className="effect-numeric-controls">
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleFormOptionChange('bonusAmount', Math.max(5, config.formOptions.bonusAmount - 5))}
                  >-</button>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={config.formOptions.bonusAmount}
                    onChange={(e) => handleFormOptionChange('bonusAmount', e.target.value)}
                    className="threshold-slider"
                  />
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleFormOptionChange('bonusAmount', Math.min(100, config.formOptions.bonusAmount + 5))}
                  >+</button>
                  <div className="threshold-value" style={{ color: selectedSystem.color, fontWeight: 'bold' }}>
                    {config.formOptions.bonusAmount}%
                  </div>
                </div>
                <div className="effect-description">
                  The percentage bonus applied when in the required form.
                </div>
              </div>

              <div className="effect-toggle-group">
                <label>Restrict Casting</label>
                <button
                  className={`effect-toggle-switch ${config.formOptions.restrictCasting ? 'active' : ''}`}
                  onClick={() => handleFormOptionChange('restrictCasting', !config.formOptions.restrictCasting)}
                >
                  <span className="effect-toggle-slider"></span>
                </button>
                <span>{config.formOptions.restrictCasting ? 'Yes' : 'No'}</span>
                <div className="effect-description">
                  If enabled, this effect can only be cast while in the required form.
                  If disabled, the effect can be cast in any form but receives bonuses in the specified form.
                </div>
              </div>
            </div>
          )}

          {/* Effect scaling options section removed as requested */}

          <div className="effect-preview">
            <h4 className="section-header">Preview</h4>
            <div className="effect-preview-content">
              {/* Combo Points System Preview */}
              {config.system === 'COMBO_POINTS' && config.type === 'trigger' && (
                <p>
                  When combo points reach
                  <span className="highlight" style={{ color: selectedSystem.color }}>
                    {' '}{config.thresholdValue}{' '}
                  </span>
                  or higher, this effect will trigger. Points are generated through
                  <span className="highlight">
                    {' '}{config.comboOptions.generationMethod.replace('_', ' ')}
                  </span>
                  and are
                  <span className="highlight">
                    {' '}{config.comboOptions.consumptionRule === 'all' ? 'all consumed' :
                      config.comboOptions.consumptionRule === 'partial' ? 'partially consumed' :
                      'consumed at threshold'}
                  </span>
                  when the effect triggers. The effect's power
                  <span className="highlight">
                    {' '}{config.effect.scaling === 'linear' ? 'increases steadily' :
                      config.effect.scaling === 'exponential' ? 'grows dramatically' :
                      'changes at specific thresholds'}
                  </span>
                  with more combo points.
                </p>
              )}

              {config.system === 'COMBO_POINTS' && config.type === 'builder' && (
                <p>
                  This effect generates
                  <span className="highlight" style={{ color: selectedSystem.color }}>
                    {' '}{config.thresholdValue}{' '}
                  </span>
                  combo points using the
                  <span className="highlight">
                    {' '}{config.comboOptions.generationMethod.replace('_', ' ')}
                  </span>
                  method, displayed as
                  <span className="highlight">
                    {' '}{config.comboOptions.visualStyle}
                  </span>.
                </p>
              )}

              {config.system === 'COMBO_POINTS' && config.type === 'spender' && (
                <p>
                  This effect consumes
                  <span className="highlight" style={{ color: selectedSystem.color }}>
                    {' '}{config.thresholdValue}{' '}
                  </span>
                  combo points and its power
                  <span className="highlight">
                    {' '}{config.effect.scaling === 'linear' ? 'increases steadily' :
                      config.effect.scaling === 'exponential' ? 'grows dramatically' :
                      'changes at specific thresholds'}
                  </span>
                  based on points spent.
                </p>
              )}

              {/* Proc System Preview */}
              {config.system === 'PROC_SYSTEM' && (
                <p>
                  This effect has a
                  <span className="highlight" style={{ color: selectedSystem.color }}>
                    {' '}{config.procOptions.procChance}%{' '}
                  </span>
                  chance to trigger on
                  <span className="highlight">
                    {' '}{config.procOptions.procType.replace('_', ' ')}{' '}
                  </span>
                  and will cast
                  {config.procOptions.spellId ? (
                    <span className="highlight">
                      {' '}{library.spells.find(spell => spell.id === config.procOptions.spellId)?.name || 'selected spell'}{' '}
                    </span>
                  ) : (
                    <span className="highlight">
                      {' '}a proc spell (none selected){' '}
                    </span>
                  )}
                  as a proc effect. It can trigger
                  <span className="highlight">
                    {' '}{config.procOptions.triggerLimit === 0 ? 'unlimited times' :
                      config.procOptions.triggerLimit === 1 ? 'once' :
                      config.procOptions.triggerLimit === 2 ? 'twice' :
                      'three times'}{' '}
                  </span>
                  per cast.
                </p>
              )}

              {/* State Requirements Preview */}
              {config.system === 'STATE_REQUIREMENTS' && (
                <div>
                  <p>
                    When {config.type === 'health_threshold' ? 'health' :
                          config.type === 'mana_threshold' ? 'mana' :
                          config.stateOptions.resourceType} is
                    <span className="highlight" style={{ color: selectedSystem.color }}>
                      {config.stateOptions.thresholdType === 'below' || config.stateOptions.thresholdType === 'less_than' ? 'below' :
                       config.stateOptions.thresholdType === 'above' || config.stateOptions.thresholdType === 'greater_than' ? 'above' :
                       config.stateOptions.thresholdType === 'equal' || config.stateOptions.thresholdType === 'exactly_at' ? 'exactly at' :
                       'exactly at'} {config.stateOptions.thresholdValue}{config.stateOptions.valueType === 'percentage' ? '%' : ''}
                    </span>,
                    this spell will
                    {config.stateOptions.effectType === 'add_dice' && (
                      <> add <span className="highlight">{config.stateOptions.diceToAdd || '1d6'}</span> to its effect</>
                    )}
                    {config.stateOptions.effectType === 'add_flat' && (
                      <> add <span className="highlight">{config.stateOptions.flatValueToAdd || '5'}</span> to its effect</>
                    )}
                    {config.stateOptions.effectType === 'multiply' && (
                      <> multiply its effect by <span className="highlight">{config.stateOptions.multiplier || '1.5'}</span></>
                    )}
                    {config.stateOptions.effectType === 'extra_effect' && (
                      <> gain an additional effect: <span className="highlight">
                        {config.stateOptions.extraEffectSpellId ?
                          (library.spells.find(s => s.id === config.stateOptions.extraEffectSpellId)?.name || 'Selected spell') :
                          'No spell selected'}
                      </span></>
                    )}
                    {config.stateOptions.effectType === 'coin_flip' && (
                      <> flip {config.stateOptions.coinCount || '1'} coin{config.stateOptions.coinCount > 1 ? 's' : ''} and add an effect if the result is
                        <span className="highlight">
                          {config.stateOptions.coinSuccessRule === 'heads' ? 'heads' :
                           config.stateOptions.coinSuccessRule === 'tails' ? 'tails' :
                           config.stateOptions.coinSuccessRule === 'all_heads' ? 'all heads' :
                           config.stateOptions.coinSuccessRule === 'all_tails' ? 'all tails' :
                           'a majority of heads'}
                        </span>
                      </>
                    )}
                    {config.stateOptions.effectType === 'card_draw' && (
                      <> draw a card and add an effect if the result is
                        <span className="highlight">
                          {config.stateOptions.cardSuccessRule === 'face_cards' ? 'a face card (J, Q, K)' :
                           config.stateOptions.cardSuccessRule === 'aces' ? 'an ace' :
                           config.stateOptions.cardSuccessRule === 'specific_suit' ? 'from a specific suit' :
                           config.stateOptions.cardSuccessRule === 'red_cards' ? 'a red card' :
                           'a black card'}
                        </span>
                      </>
                    )}.
                  </p>
                  <p className="effect-description">
                    This adds variability to the spell based on the caster's state, making it more dynamic in different situations.
                  </p>
                </div>
              )}

              {/* Form System Preview */}
              {config.system === 'FORM_SYSTEM' && (
                <p>
                  This effect
                  <span className="highlight" style={{ color: selectedSystem.color }}>
                    {' '}{config.formOptions.restrictCasting ? 'requires' : 'is enhanced by'}{' '}
                  </span>
                  {config.formOptions.formSpellId ? (
                    <span className="highlight">
                      {' '}{library.spells.find(spell => spell.id === config.formOptions.formSpellId)?.name || 'selected form'}{' '}
                    </span>
                  ) : (
                    <span className="highlight">
                      {' '}a form spell (none selected){' '}
                    </span>
                  )}
                  and provides
                  <span className="highlight">
                    {' '}{config.formOptions.bonusAmount}% {config.formOptions.bonusType}{' '}
                  </span>
                  when in the correct form.
                </p>
              )}

              {/* Toxic System Preview */}
              {config.system === 'TOXIC_SYSTEM' && config.type === 'toxic_applier' && (
                <div>
                  <p>
                    This spell applies the following toxic effects to the target:
                    {Object.entries(config.toxicOptions.selectedToxicTypes).length > 0 ? (
                      <ul className="toxic-preview-list">
                        {Object.entries(config.toxicOptions.selectedToxicTypes).map(([toxicId, count]) => {
                          const toxicType = STEP_MECHANICS_SYSTEMS.TOXIC_SYSTEM.toxicTypes.find(t => t.id === toxicId);
                          return (
                            <li key={toxicId} className="toxic-preview-item">
                              <span className="highlight" style={{ color: toxicType?.color || '#ffffff' }}>
                                {count}x {toxicType?.name || toxicId}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <span className="highlight" style={{ color: '#ff6666' }}>
                        {' '}No toxic types selected{' '}
                      </span>
                    )}
                  </p>
                  <p>
                    These effects last for
                    <span className="highlight" style={{ color: selectedSystem.color }}>
                      {' '}{config.toxicOptions.duration} {config.toxicOptions.durationType}{' '}
                    </span>
                    and can be consumed by toxic consumer spells for enhanced effects.
                  </p>
                </div>
              )}

              {config.system === 'TOXIC_SYSTEM' && config.type === 'toxic_consumer' && (
                <div>
                  <p>
                    This spell consumes toxic effects from the target using the
                    <span className="highlight" style={{ color: selectedSystem.color }}>
                      {' '}{config.toxicOptions.consumptionRule === 'all' ? 'all toxics' :
                        config.toxicOptions.consumptionRule === 'specific' ? 'specific types' :
                        'threshold'}{' '}
                    </span>
                    rule.
                    {config.toxicOptions.updateFormula && (
                      <>
                        <span> The spell's formula will be updated based on the consumed toxic effects.</span>
                        {Object.keys(config.toxicOptions.toxicEffects || {}).length > 0 ? (
                          <>
                            It has
                            <span className="highlight">
                              {' '}{Object.keys(config.toxicOptions.toxicEffects).length}{' '}
                            </span>
                            graduated effect levels based on toxic consumption:
                          </>
                        ) : (
                          <>
                            It will only activate when the exact toxic types are consumed.
                          </>
                        )}

                        {Object.keys(config.toxicOptions.toxicEffects || {}).length > 0 && (
                          <ul className="graduated-effects-preview">
                            {Object.entries(config.toxicOptions.toxicEffects)
                              .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB))
                              .map(([level, effect]) => (
                                <li key={level}>
                                  <span className="highlight">
                                    {effect.requiredToxicTypes && Object.keys(effect.requiredToxicTypes).length > 0 ? (
                                      <>
                                        {Object.entries(effect.requiredToxicTypes).map(([toxicId, count], index, array) => {
                                          const toxicType = STEP_MECHANICS_SYSTEMS.TOXIC_SYSTEM.toxicTypes.find(t => t.id === toxicId);
                                          return (
                                            <span key={toxicId}>
                                              {count}x {toxicType?.name || toxicId.charAt(0).toUpperCase() + toxicId.slice(1)}
                                              {index < array.length - 1 ? ' and ' : ''}
                                            </span>
                                          );
                                        })}
                                      </>
                                    ) : (
                                      <>{level} toxic effects consumed</>
                                    )}
                                  </span>:
                                  {effect.description || `Formula: ${effect.formula}`}

                                  {effect.effectReferences && (
                                    <div className="effect-references-preview">
                                      <span>Includes effects: </span>
                                      {Object.entries(effect.effectReferences)
                                        .filter(([_, isIncluded]) => isIncluded)
                                        .map(([effectType, _], index, array) => (
                                          <span key={effectType} className="effect-reference-tag">
                                            {effectType.charAt(0).toUpperCase() + effectType.slice(1)}
                                            {index < array.length - 1 ? ', ' : ''}
                                          </span>
                                        ))
                                      }
                                    </div>
                                  )}

                                  {/* Show buff stat modifiers if present */}
                                  {effect.effectType === 'buff' && effect.statModifiers && effect.statModifiers.length > 0 && (
                                    <div className="effect-stats-preview">
                                      <span>Stat Modifiers: </span>
                                      {effect.statModifiers.map((stat, index) => (
                                        <span key={stat.id} className="effect-stat-tag">
                                          {stat.name}:
                                          <span className={`effect-stat-value ${typeof stat.magnitude === 'string' ? 'formula' : (stat.magnitude < 0 ? 'negative' : 'positive')}`}>
                                            {typeof stat.magnitude === 'string'
                                              ? stat.magnitude
                                              : (stat.magnitudeType === 'percentage'
                                                ? `${stat.magnitude}%`
                                                : stat.magnitude)}
                                          </span>
                                          {index < effect.statModifiers.length - 1 ? ', ' : ''}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Show debuff stat penalties if present */}
                                  {effect.effectType === 'debuff' && effect.statPenalties && effect.statPenalties.length > 0 && (
                                    <div className="effect-stats-preview">
                                      <span>Stat Penalties: </span>
                                      {effect.statPenalties.map((stat, index) => (
                                        <span key={stat.id} className="effect-stat-tag">
                                          {stat.name}:
                                          <span className="effect-stat-value negative">
                                            {typeof stat.magnitude === 'string'
                                              ? stat.magnitude
                                              : (stat.magnitudeType === 'percentage'
                                                ? `${stat.magnitude}%`
                                                : stat.magnitude)}
                                          </span>
                                          {index < effect.statPenalties.length - 1 ? ', ' : ''}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Show status effects if present */}
                                  {(effect.effectType === 'buff' || effect.effectType === 'debuff') &&
                                   effect.statusEffects && effect.statusEffects.length > 0 && (
                                    <div className="effect-status-preview">
                                      <span>Status Effects: </span>
                                      {effect.statusEffects.map((status, index) => (
                                        <span key={status.id} className="effect-status-tag">
                                          {status.name}
                                          {index < effect.statusEffects.length - 1 ? ', ' : ''}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Show critical hit config if present */}
                                  {(effect.effectType === 'damage' || effect.effectType === 'healing') &&
                                   effect.criticalConfig && effect.criticalConfig.enabled && (
                                    <div className="effect-crit-preview">
                                      <span>Critical Hit: </span>
                                      {effect.criticalConfig.useRollableTable
                                        ? effect.criticalConfig.critOnlyEffect
                                          ? `Effect-Only: ${effect.criticalConfig.critType === 'dice'
                                              ? 'Roll on'
                                              : effect.criticalConfig.critType === 'cards'
                                                ? 'Draw on'
                                                : effect.criticalConfig.critType === 'coins'
                                                  ? 'Flip on'
                                                  : 'Roll on'} table`
                                          : `On Critical: ${effect.criticalConfig.critType === 'dice'
                                              ? 'Roll on'
                                              : effect.criticalConfig.critType === 'cards'
                                                ? 'Draw on'
                                                : effect.criticalConfig.critType === 'coins'
                                                  ? 'Flip on'
                                                  : 'Roll on'} table`
                                        : effect.criticalConfig.critOnlyEffect
                                          ? `Effect-Only Critical`
                                          : effect.criticalConfig.critType === 'dice'
                                            ? `On natural ${effect.criticalConfig.diceThreshold || 20}`
                                            : effect.criticalConfig.critType === 'cards'
                                              ? `On ${effect.criticalConfig.cardCritRule}`
                                              : `On ${effect.criticalConfig.coinCritRule}`}
                                    </div>
                                  )}

                                  {/* Show chance-on-hit config if present */}
                                  {(effect.effectType === 'damage' || effect.effectType === 'healing') &&
                                   effect.chanceOnHitConfig && effect.chanceOnHitConfig.enabled && (
                                    <div className="effect-proc-preview">
                                      <span>Chance on Hit: </span>
                                      {effect.chanceOnHitConfig.procType === 'dice'
                                        ? `${effect.chanceOnHitConfig.procChance}% chance`
                                        : effect.chanceOnHitConfig.procType === 'cards'
                                          ? `On ${effect.chanceOnHitConfig.cardProcRule}`
                                          : `On ${effect.chanceOnHitConfig.coinProcRule}`}
                                    </div>
                                  )}
                                </li>
                              ))
                            }
                          </ul>
                        )}
                      </>
                    )}
                  </p>
                  {config.toxicOptions.consumptionRule === 'specific' && Object.keys(config.toxicOptions.selectedToxicTypes).length > 0 && (
                    <p>
                      Required toxic types:
                      <ul className="toxic-preview-list">
                        {Object.entries(config.toxicOptions.selectedToxicTypes).map(([toxicId, count]) => {
                          const toxicType = STEP_MECHANICS_SYSTEMS.TOXIC_SYSTEM.toxicTypes.find(t => t.id === toxicId);
                          return (
                            <li key={toxicId} className="toxic-preview-item">
                              <span className="highlight" style={{ color: toxicType?.color || '#ffffff' }}>
                                {count}x {toxicType?.name || toxicId}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </p>
                  )}
                </div>
              )}

              {/* Chord System Preview */}
              {config.system === 'CHORD_SYSTEM' && config.type === 'chord' && (
                <div>
                  <p>
                    This spell requires a specific sequence of
                    <span className="highlight" style={{ color: selectedSystem.color }}>
                      {' '}{config.chordOptions.recipeDisplay.length}{' '}
                    </span>
                    chord functions to be played in order.
                    {Object.keys(config.chordOptions.graduatedEffects || {}).length > 0 ? (
                      <>
                        It has
                        <span className="highlight">
                          {' '}{Object.keys(config.chordOptions.graduatedEffects).length}{' '}
                        </span>
                        graduated effect levels based on partial recipe matches:
                      </>
                    ) : (
                      <>
                        It will only activate when the exact recipe is matched.
                      </>
                    )}
                  </p>

                  {Object.keys(config.chordOptions.graduatedEffects || {}).length > 0 && (
                    <ul className="graduated-effects-preview">
                      {Object.entries(config.chordOptions.graduatedEffects)
                        .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB))
                        .map(([level, effect]) => (
                          <li key={level}>
                            <span className="highlight">{level}/{config.chordOptions.recipeDisplay.length} matches</span>:
                            {effect.description || `Formula: ${effect.formula}`}

                            {effect.effectReferences && (
                              <div className="effect-references-preview">
                                <span>Includes effects: </span>
                                {Object.entries(effect.effectReferences)
                                  .filter(([_, isIncluded]) => isIncluded)
                                  .map(([effectType, _], index, array) => (
                                    <span key={effectType} className="effect-reference-tag">
                                      {effectType.charAt(0).toUpperCase() + effectType.slice(1)}
                                      {index < array.length - 1 ? ', ' : ''}
                                    </span>
                                  ))
                                }
                              </div>
                            )}

                            {/* Show buff stat modifiers if present */}
                            {effect.effectType === 'buff' && effect.statModifiers && effect.statModifiers.length > 0 && (
                              <div className="effect-stats-preview">
                                <span>Stat Modifiers: </span>
                                {effect.statModifiers.map((stat, index) => (
                                  <span key={stat.id} className="effect-stat-tag">
                                    {stat.name}:
                                    <span className={`effect-stat-value ${typeof stat.magnitude === 'string' ? 'formula' : (stat.magnitude < 0 ? 'negative' : 'positive')}`}>
                                      {typeof stat.magnitude === 'string'
                                        ? stat.magnitude
                                        : (stat.magnitudeType === 'percentage'
                                          ? `${stat.magnitude}%`
                                          : stat.magnitude)}
                                    </span>
                                    {index < effect.statModifiers.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Show debuff stat penalties if present */}
                            {effect.effectType === 'debuff' && effect.statPenalties && effect.statPenalties.length > 0 && (
                              <div className="effect-stats-preview">
                                <span>Stat Penalties: </span>
                                {effect.statPenalties.map((stat, index) => (
                                  <span key={stat.id} className="effect-stat-tag">
                                    {stat.name}:
                                    <span className="effect-stat-value negative">
                                      {typeof stat.magnitude === 'string'
                                        ? stat.magnitude
                                        : (stat.magnitudeType === 'percentage'
                                          ? `${stat.magnitude}%`
                                          : stat.magnitude)}
                                    </span>
                                    {index < effect.statPenalties.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Show status effects if present */}
                            {(effect.effectType === 'buff' || effect.effectType === 'debuff') &&
                             effect.statusEffects && effect.statusEffects.length > 0 && (
                              <div className="effect-status-preview">
                                <span>Status Effects: </span>
                                {effect.statusEffects.map((status, index) => (
                                  <span key={status.id} className="effect-status-tag">
                                    {status.name}
                                    {index < effect.statusEffects.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Show critical hit config if present */}
                            {(effect.effectType === 'damage' || effect.effectType === 'healing') &&
                             effect.criticalConfig && effect.criticalConfig.enabled && (
                              <div className="effect-crit-preview">
                                <span>Critical Hit: </span>
                                {effect.criticalConfig.useRollableTable
                                  ? effect.criticalConfig.critOnlyEffect
                                    ? `Effect-Only: ${effect.criticalConfig.critType === 'dice'
                                        ? 'Roll on'
                                        : effect.criticalConfig.critType === 'cards'
                                          ? 'Draw on'
                                          : effect.criticalConfig.critType === 'coins'
                                            ? 'Flip on'
                                            : 'Roll on'} table`
                                    : `On Critical: ${effect.criticalConfig.critType === 'dice'
                                        ? 'Roll on'
                                        : effect.criticalConfig.critType === 'cards'
                                          ? 'Draw on'
                                          : effect.criticalConfig.critType === 'coins'
                                            ? 'Flip on'
                                            : 'Roll on'} table`
                                  : effect.criticalConfig.critOnlyEffect
                                    ? `Effect-Only Critical`
                                    : effect.criticalConfig.critType === 'dice'
                                      ? `On natural ${effect.criticalConfig.diceThreshold || 20}`
                                      : effect.criticalConfig.critType === 'cards'
                                        ? `On ${effect.criticalConfig.cardCritRule}`
                                        : `On ${effect.criticalConfig.coinCritRule}`}
                              </div>
                            )}

                            {/* Show chance-on-hit config if present */}
                            {(effect.effectType === 'damage' || effect.effectType === 'healing') &&
                             effect.chanceOnHitConfig && effect.chanceOnHitConfig.enabled && (
                              <div className="effect-proc-preview">
                                <span>Chance on Hit: </span>
                                {effect.chanceOnHitConfig.procType === 'dice'
                                  ? `${effect.chanceOnHitConfig.procChance}% chance`
                                  : effect.chanceOnHitConfig.procType === 'cards'
                                    ? `On ${effect.chanceOnHitConfig.cardProcRule}`
                                    : `On ${effect.chanceOnHitConfig.coinProcRule}`}
                              </div>
                            )}
                          </li>
                        ))
                      }
                    </ul>
                  )}
                </div>
              )}

              {config.system === 'CHORD_SYSTEM' && (config.type === 'note' || config.type === 'wildcard' || config.type === 'extender') && (
                <p>
                  This spell plays a
                  <span className="highlight" style={{ color: selectedSystem.color }}>
                    {' '}{config.type === 'note' ? config.chordOptions.chordFunction :
                          config.type === 'wildcard' ? 'wildcard' : 'extender'}{' '}
                  </span>
                  note that can be used in chord recipes.
                  {config.type === 'wildcard' && ' It can substitute for any chord function in a recipe.'}
                  {config.type === 'extender' && ` It extends the improvisation window by ${config.chordOptions.extendDuration} rounds.`}
                </p>
              )}

              {/* Generic System Previews */}
              {config.system !== 'COMBO_POINTS' && config.system !== 'PROC_SYSTEM' &&
               config.system !== 'FORM_SYSTEM' && config.system !== 'CHORD_SYSTEM' &&
               config.type === 'trigger' && (
                <p>
                  When {selectedSystem.name.toLowerCase()} reaches
                  <span className="highlight" style={{ color: selectedSystem.color }}>
                    {' '}{config.thresholdValue}{selectedSystem.isPercentage ? '%' : (selectedSystem.isDiceRoll ? '+ on d20' : '')}{' '}
                  </span>
                  {selectedSystem.isDiceRoll && (
                    <> using {config.resolutionMethod === 'cards' ? 'card draws' :
                              config.resolutionMethod === 'coins' ? 'coin flips' :
                              'dice rolls'} for resolution</>
                  )}
                  or higher, the effect's power will be
                  <span className="highlight">
                    {' '}{config.effect.scaling === 'linear' ? 'increased' :
                      config.effect.scaling === 'exponential' ? 'greatly increased' :
                      config.effect.scaling === 'threshold' ? 'changed' :
                      'scaled'} by {config.effect.multiplier}x
                  </span>.
                </p>
              )}

              {config.system !== 'COMBO_POINTS' && config.system !== 'PROC_SYSTEM' && config.system !== 'FORM_SYSTEM' && config.type === 'builder' && (
                <p>
                  This effect generates
                  <span className="highlight" style={{ color: selectedSystem.color }}>
                    {' '}{config.thresholdValue}{' '}
                  </span>
                  {selectedSystem.name.toLowerCase()}.
                </p>
              )}

              {config.system !== 'COMBO_POINTS' && config.system !== 'PROC_SYSTEM' && config.system !== 'FORM_SYSTEM' && config.type === 'spender' && (
                <p>
                  This effect consumes
                  <span className="highlight" style={{ color: selectedSystem.color }}>
                    {' '}{config.thresholdValue}{' '}
                  </span>
                  {selectedSystem.name.toLowerCase()}.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="effect-config-actions">
        <button
          className="effect-config-button primary"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.nativeEvent) {
              e.nativeEvent.stopImmediatePropagation();
            }
            onConfigUpdate(config);
            return false;
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          Apply Changes
        </button>
      </div>

      {/* Tooltip for toxic types */}
      <Wc3Tooltip
        title={tooltipContent?.title}
        icon={tooltipContent?.icon || null}
        position={mousePos}
        content={tooltipContent?.content}
        isVisible={showTooltip}
      />
    </div>
  );
};

export default StepMechanicsConfig;
