import React, { useState, useEffect, useCallback } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import IconSelectionCard from '../../components/common/IconSelectionCard';
import VisualCardSelector from '../../components/mechanics/VisualCardSelector';
import CriticalHitConfig from '../../components/mechanics/CriticalHitConfig';
import ChanceOnHitConfig from '../../components/mechanics/ChanceOnHitConfig';
import SpellLibraryButton from '../../components/common/SpellLibraryButton';
import Wc3Tooltip from '../../../tooltips/Wc3Tooltip';
import '../../styles/CriticalHitConfig.css';
import '../../styles/ChanceOnHitConfig.css';
import '../../styles/MechanicsConfig.css';
import '../../styles/effects/ProgressiveEffects.css';

// Import icons from FontAwesome (FA6)
import {
  FaHandFist,
  FaFireFlameSimple,
  FaFireFlameCurved,
  FaBurst,
  FaMoon,
  FaSkull,
  FaBolt,
  FaWind,
  FaWater,
  FaChevronDown
} from 'react-icons/fa6';

// Import older FontAwesome icons for those not in FA6
import {
  FaDice,
  FaGem,
  FaCoins,
  FaDiceD20,
  FaClone
} from 'react-icons/fa';

// Import damage type data
import {
  DAMAGE_TYPES,
  getDamageTypeById,
  getDamageTypesByCategory
} from '../../core/data/damageTypes';

// Import dice system utilities
import {
  parseDiceNotation,
  getAverageRoll,
  getMinRoll,
  getMaxRoll
} from '../../core/mechanics/diceSystem';

// Variable definitions for stats and attributes
const STAT_VARIABLES = {
  // Primary Attributes
  STR: { name: 'Strength', description: 'Physical power and melee damage' },
  AGI: { name: 'Agility', description: 'Dexterity and reflexes' },
  CON: { name: 'Constitution', description: 'Health and stamina' },
  INT: { name: 'Intelligence', description: 'Magical power and knowledge' },
  SPIR: { name: 'Spirit', description: 'Willpower and spiritual energy' },
  CHA: { name: 'Charisma', description: 'Social influence and leadership' },

  // Damage Types
  PIERC: { name: 'Piercing', description: 'Piercing damage' },
  BLUDG: { name: 'Bludgeoning', description: 'Bludgeoning damage' },
  SLASH: { name: 'Slashing', description: 'Slashing damage' },

  // Combat Stats
  HIT: { name: 'Hit Chance', description: 'Accuracy rating' },
  CRIT: { name: 'Critical', description: 'Critical hit chance' },

  // Spell Damage Types
  SFIRE: { name: 'Fire', description: 'Spell fire damage' },
  SCOLD: { name: 'Cold', description: 'Spell cold damage' },

  // Defense Stats
  AC: { name: 'Armor Class', description: 'Defense rating' },
  MR: { name: 'Magic Resistance', description: 'Spell defense' },

  // Resource Stats
  MHP: { name: 'Max HP', description: 'Maximum health points' },
  CHP: { name: 'Current HP', description: 'Current health points' },
  MMP: { name: 'Max MP', description: 'Maximum mana points' },
  CMP: { name: 'Current MP', description: 'Current mana points' },
  MAP: { name: 'Max AP', description: 'Maximum action points' },
  CAP: { name: 'Current AP', description: 'Current action points' },

  // Recovery Stats
  HR: { name: 'Health Regen', description: 'Health regeneration rate' },
  HEALR: { name: 'Healing Received', description: 'Healing received multiplier' },
  HEALP: { name: 'Healing Power', description: 'Healing power multiplier' },

  // Movement and Vision
  MS: { name: 'Movement Speed', description: 'Base movement speed' },
  VR: { name: 'Vision Range', description: 'Sight distance' },
  SWIM: { name: 'Swim Speed', description: 'Swimming movement speed' },

  // Other Stats
  CC: { name: 'Carrying Capacity', description: 'Maximum weight capacity' },
  INI: { name: 'Initiative', description: 'Combat turn order bonus' }
};

const VARIABLE_CATEGORIES = {
  'Primary Attributes': ['STR', 'AGI', 'CON', 'INT', 'SPIR', 'CHA'],
  'Damage Types': ['PIERC', 'BLUDG', 'SLASH'],
  'Combat Stats': ['HIT', 'CRIT'],
  'Spell Damage': ['SFIRE', 'SCOLD'],
  'Defense': ['AC', 'MR'],
  'Resources': ['MHP', 'CHP', 'MMP', 'CMP', 'MAP', 'CAP'],
  'Recovery': ['HR', 'HEALR', 'HEALP'],
  'Movement': ['MS', 'VR', 'SWIM'],
  'Other': ['CC', 'INI']
};

// Custom formula evaluation function
const customEvaluateFormula = (formula, variables = {}) => {
  try {
    // First, try to parse as dice notation and get average
    if (parseDiceNotation(formula)) {
      const diceAverage = getAverageRoll(formula);

      // Replace variable placeholders with their values
      let result = diceAverage;
      Object.keys(STAT_VARIABLES).forEach(variable => {
        if (formula.includes(variable)) {
          const varValue = variables[variable] || 0;
          result += varValue;
        }
      });

      return result;
    }

    // Otherwise, evaluate as a mathematical expression with variables
    const replacedFormula = formula.replace(/\b([A-Z_][A-Z0-9_]*)\b/g, (match) => {
      return variables[match] !== undefined ? variables[match] : 0;
    });

    // Simple and safe evaluation for basic mathematical expressions
    return Function(...Object.keys(variables), `"use strict"; return (${replacedFormula})`)(...Object.values(variables));
  } catch (error) {
    console.error("Error evaluating formula:", error);
    return 0;
  }
};

const VariablesDisplay = ({ onVariableClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

  const handleVariableClick = (variable) => {
    if (onVariableClick) {
      onVariableClick(variable);
    }
    // Copy to clipboard
    navigator.clipboard.writeText(variable);

    // Show tooltip
    const element = document.getElementById(`var-${variable}`);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTooltip({
        show: true,
        text: 'Copied!',
        x: rect.left + rect.width / 2,
        y: rect.top - 20
      });
      setTimeout(() => setTooltip({ show: false, text: '', x: 0, y: 0 }), 1500);
    }
  };

  return (
    <div className="variables-display">
      <div
        className={`variables-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4>
          Available Variables
          <FaChevronDown className="toggle-icon" />
        </h4>
      </div>
      <div className={`variables-content ${isOpen ? 'open' : ''}`}>
        {Object.entries(VARIABLE_CATEGORIES).map(([category, variables]) => (
          <div key={category} className="variables-category">
            <div className="category-title">{category}</div>
            <div className="variables-grid">
              {variables.map(variable => (
                <div
                  key={variable}
                  id={`var-${variable}`}
                  className="variable-item"
                  onClick={() => handleVariableClick(variable)}
                >
                  <span className="variable-name">{variable}</span>
                  <span className="variable-desc">{STAT_VARIABLES[variable].description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {tooltip.show && (
        <div
          className="copy-tooltip"
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

const DamageEffects = (props) => {
  // Get state and dispatch from context
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  // Get current spell config from props
  const { currentEffect, effectConfig } = props;
  const spellId = state.currentSpellId;

  // Create state for damage config
  const [damageConfig, setDamageConfig] = useState(() => {
    // Get the current damage config from the global state
    const currentDamageConfig = state.damageConfig || {};

    // Use the global state if available, otherwise use defaults
    return {
      damageType: currentDamageConfig.damageType || 'direct',
      elementType: currentDamageConfig.elementType || 'fire',  // Default to fire for better visual display
      secondaryElementType: currentDamageConfig.secondaryElementType || null,
      resolution: currentDamageConfig.resolution || 'DICE',
      formula: currentDamageConfig.formula || '1d6 + INT',
      dotFormula: currentDamageConfig.dotFormula || '1d4 + INT/2',  // Default DoT formula
      dotDuration: currentDamageConfig.dotDuration || 3,
      dotTickType: currentDamageConfig.dotTickType || 'round',
      dotApplication: currentDamageConfig.dotApplication || 'start',
      dotScalingType: currentDamageConfig.dotScalingType || 'flat', // flat, increasing, decreasing, frontloaded, backloaded
      dotTriggerType: currentDamageConfig.dotTriggerType || 'periodic', // periodic, trigger, or channeled
      isProgressiveDot: currentDamageConfig.isProgressiveDot === true, // Flag for progressive DoT
      dotProgressiveStages: currentDamageConfig.dotProgressiveStages || [],
      drawCount: currentDamageConfig.drawCount || 3,  // Default number of cards to draw
      coinCount: currentDamageConfig.coinCount || 5,   // Default number of coins to flip
      hasDotEffect: currentDamageConfig.hasDotEffect || false,  // Flag for combined damage type
      criticalConfig: currentDamageConfig.criticalConfig || {
        enabled: false,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '',
        explodingDice: false,
        explodingDiceType: 'reroll_add', // 'reroll_add', 'double_value', 'add_max'
        critEffects: [],
        cardCritRule: 'face_cards',
        cardCritResolution: 'draw_add', // 'draw_add', 'multiply_value', 'double_damage'
        extraCardDraw: 2,
        coinCritRule: 'all_heads',
        coinCritResolution: 'flip_add', // 'flip_add', 'multiply_value', 'double_damage'
        extraCoinFlips: 3,
        coinCount: 3,
        spellEffect: null
      },
      chanceOnHitConfig: currentDamageConfig.chanceOnHitConfig || {
        enabled: false,
        procType: 'dice',
        procChance: 15,
        diceThreshold: 18,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: []
      }
    };
  });

  // Initialize state for selected element category
  const [selectedElementCategory, setSelectedElementCategory] = useState(() => {
    // Determine initial category based on damageConfig element type
    const elementType = damageConfig.elementType;
    if (['bludgeoning', 'piercing', 'slashing'].includes(elementType)) {
      return 'physical';
    } else if (['fire', 'cold', 'lightning', 'acid', 'thunder'].includes(elementType)) {
      return 'elemental';
    } else if (['force', 'psychic', 'radiant'].includes(elementType)) {
      return 'arcane';
    } else if (['necrotic', 'poison', 'void'].includes(elementType)) {
      return 'otherworldly';
    }
    return 'elemental'; // Default to elemental category
  });

  // Set selected resolution - no dependencies on other functions
  const [currentResolution, setCurrentResolution] = useState(damageConfig.resolution || 'DICE');

  // Initialize state for formula examples
  const [formulaExamples, setFormulaExamples] = useState([]);
  const [dotFormulaExamples, setDotFormulaExamples] = useState([]);

  // State for card selection
  const [activeSuit, setActiveSuit] = useState('hearts');
  const [selectedCards, setSelectedCards] = useState([]);
  const [drawCount, setDrawCount] = useState(damageConfig.drawCount || 3);
  const [coinCount, setCoinCount] = useState(damageConfig.coinCount || 5);

  // Update drawCount in damageConfig when it changes
  useEffect(() => {
    handleDamageConfigChange('drawCount', drawCount);
  }, [drawCount]);

  // Update coinCount in damageConfig when it changes
  useEffect(() => {
    handleDamageConfigChange('coinCount', coinCount);
  }, [coinCount]);

  // Helper function to get current element
  const getCurrentElement = () => {
    return damageConfig.elementType || 'fire';
  };

  // Get element code helper
  const getElementCode = (elementType) => {
    const elementCodes = {
      fire: 'FIRE',
      cold: 'COLD',
      lightning: 'LIGHTNING',
      acid: 'ACID',
      thunder: 'THUNDER',
      force: 'FORCE',
      psychic: 'PSYCHIC',
      radiant: 'RADIANT',
      necrotic: 'NECROTIC',
      poison: 'POISON',
      void: 'VOID',
      bludgeoning: 'BLUDGEONING',
      piercing: 'PIERCING',
      slashing: 'SLASHING'
    };

    return elementCodes[elementType] || 'FIRE';
  };

  // Get default formula - no dependencies on other functions
  const getDefaultFormula = (resolutionType, element) => {
    const elementCode = getElementCode(element || getCurrentElement());

    switch (resolutionType) {
      case 'DICE':
        return `2d6 + ${elementCode}`;
      case 'CARDS':
        return `CARD_VALUE + ${elementCode}`;
      case 'COINS':
        return `HEADS_COUNT * 8 + ${elementCode}`;
      default:
        return `2d6 + ${elementCode}`;
    }
  };

  // Get default DoT formula - no dependencies on other functions
  const getDefaultDotFormula = (resolutionType, element) => {
    const elementCode = getElementCode(element || getCurrentElement());

    switch (resolutionType) {
      case 'DICE':
        return `1d4 + ${elementCode}/2`;
      case 'CARDS':
        return `CARD_VALUE/2 + ${elementCode}/2`;
      case 'COINS':
        return `HEADS_COUNT * 3 + ${elementCode}/2`;
      default:
        return `1d4 + ${elementCode}/2`;
    }
  };

  // Handler for damage configuration changes - basic version without dependencies
  const handleDamageConfigChange = (field, value) => {
    const newConfig = {
      ...damageConfig,
      [field]: value
    };

    setDamageConfig(newConfig);

    // Always update effect config in spell wizard context, regardless of spellId or currentEffect
    dispatch(actionCreators.updateDamageConfig(newConfig));

    // If we're updating the trigger type for DoT, update the spell's trigger configuration
    if (field === 'dotTriggerType' && value === 'trigger') {
      // Create a trigger configuration for the spell's trigger system
      const spellTriggerConfig = {
        triggerId: 'dot_trigger',
        parameters: {},
        targetEntity: 'target',
        effectType: 'dot'
      };

      // Update the spell's trigger configuration
      dispatch(actionCreators.updateTriggerConfig({
        ...state.triggerConfig,
        dotTrigger: spellTriggerConfig
      }));
    }
  };

  // Update formula examples based on resolution and element
  const updateFormulaExamples = (resolutionType) => {
    const primaryCode = getElementCode(getCurrentElement());

    if (resolutionType === 'DICE') {
      setFormulaExamples([
        {
          name: 'Basic Attack',
          formula: `2d6 + ${primaryCode}`,
          description: 'Standard damage'
        },
        {
          name: 'Heavy Strike',
          formula: `3d8 + ${primaryCode} * 1.5`,
          description: 'Higher base damage with elemental scaling'
        },
        {
          name: 'Quick Attack',
          formula: `1d6 + ${primaryCode} + DEXTERITY`,
          description: 'Scales with dexterity'
        },
        {
          name: 'Critical Hit',
          formula: `4d6 + ${primaryCode} * 2`,
          description: 'Double elemental damage'
        }
      ]);

      // Update DOT formula examples
      setDotFormulaExamples([
        {
          name: 'Burning',
          formula: `1d4 + ${primaryCode}/2`,
          description: 'Standard DoT'
        },
        {
          name: 'Lingering Damage',
          formula: `1d6 + ROUND + ${primaryCode}/3`,
          description: 'Increases each round'
        },
        {
          name: 'Elemental Burn',
          formula: `(ROUND <= 2 ? 1d4 : 2d4) + ${primaryCode}/2`,
          description: 'Escalating damage over time'
        }
      ]);
    } else if (resolutionType === 'CARDS') {
      setFormulaExamples([
        {
          name: 'Card Strike',
          formula: `CARD_VALUE + ${primaryCode}`,
          description: 'Basic card attack'
        },
        {
          name: 'Royal Assault',
          formula: `CARD_VALUE + (FACE_CARD ? ${primaryCode} * 2 : ${primaryCode})`,
          description: 'Double elemental on face cards'
        },
        {
          name: 'Suit Synergy',
          formula: `CARD_VALUE * (SAME_SUIT ? 2 : 1) + ${primaryCode}`,
          description: 'Double damage if all cards are the same suit'
        },
        {
          name: 'Full House',
          formula: `CARD_VALUE * 1.5 + FACE_CARD_COUNT * 3 + ${primaryCode}`,
          description: 'Scales with face cards drawn'
        }
      ]);

      // Update DOT formula examples
      setDotFormulaExamples([
        {
          name: 'Card Burn',
          formula: `CARD_VALUE/2 + ${primaryCode}/2`,
          description: 'Standard card DoT'
        },
        {
          name: 'Suit Affliction',
          formula: `(CARD_SUIT_MATCH ? CARD_VALUE : CARD_VALUE/2) + ${primaryCode}/3`,
          description: 'Stronger with matching suit'
        },
        {
          name: 'Royal Corruption',
          formula: `FACE_CARD_COUNT * 2 + ROUND + ${primaryCode}/3`,
          description: 'Escalating DoT that scales with matching suits'
        }
      ]);
    } else if (resolutionType === 'COINS') {
      setFormulaExamples([
        {
          name: 'Fortune Strike',
          formula: `HEADS_COUNT * 4 + ${primaryCode}`,
          description: 'Scales with number of heads'
        },
        {
          name: 'Luck Gambit',
          formula: `(HEADS_RATIO > 0.5 ? 15 : 5) + ${primaryCode}`,
          description: 'Higher damage with more heads than tails'
        },
        {
          name: 'Fate Seal',
          formula: `ALL_HEADS ? 25 + ${primaryCode} * 2 : HEADS_COUNT * 3 + ${primaryCode}`,
          description: 'Massive damage on all heads'
        },
        {
          name: 'Misfortune',
          formula: `ALL_TAILS ? 0 : HEADS_COUNT * 5 + ${primaryCode}`,
          description: 'No damage on all tails'
        }
      ]);

      // Update DOT formula examples
      setDotFormulaExamples([
        {
          name: 'Coin Burn',
          formula: `HEADS_COUNT + ${primaryCode}/2`,
          description: 'Basic coin DoT'
        },
        {
          name: 'Fortune\'s Curse',
          formula: `(HEADS_RATIO > 0.5 ? 3 : 1) * ROUND + ${primaryCode}/3`,
          description: 'Scaling DoT based on heads ratio'
        },
        {
          name: 'Plague of Luck',
          formula: `HEADS_COUNT * 1.5 + (ALL_HEADS ? ${primaryCode} : ${primaryCode}/2)`,
          description: 'Strong DoT if more heads than tails'
        }
      ]);
    }
  };

  // Handler for resolution change
  const handleResolutionChange = (resolutionId) => {
    setCurrentResolution(resolutionId);
    handleDamageConfigChange('resolution', resolutionId);

    // Update formula examples for new resolution
    updateFormulaExamples(resolutionId);

    // Set new default formulas based on resolution
    let newFormula;
    let newDotFormula;

    switch(resolutionId) {
      case 'DICE':
        newFormula = '1d6 + INT';
        newDotFormula = '1d4 + INT/2';
        break;
      case 'CARDS':
        newFormula = 'CARD_VALUE + INT';
        newDotFormula = 'CARD_VALUE/2 + INT/2';
        break;
      case 'COINS':
        newFormula = 'HEADS_COUNT * 5 + INT';
        newDotFormula = 'HEADS_COUNT * 2 + INT/2';
        break;
      default:
        newFormula = '1d6 + INT';
        newDotFormula = '1d4 + INT/2';
        break;
    }

    // Always update the formula when resolution changes
    handleDamageConfigChange('formula', newFormula);

    // Update dot formula if damage type is dot or has DoT effect
    if (damageConfig.damageType === 'dot' || damageConfig.hasDotEffect) {
      handleDamageConfigChange('dotFormula', newDotFormula);
    }

    // Also update the spell's main resolution in the wizard state
    // There's no direct updateSpellState action, so we need to use a different approach
    // We'll add a resolution property to the damageConfig instead
    handleDamageConfigChange('globalResolution', resolutionId);
  };

  // Set up formula examples when element type changes
  useEffect(() => {
    updateFormulaExamples(currentResolution);
  }, [damageConfig.elementType, currentResolution]);

  // Handler for formula change
  const handleFormulaChange = (value) => {
    handleDamageConfigChange('formula', value);
  };

  // Handler for dot formula change
  const handleDotFormulaChange = (value) => {
    handleDamageConfigChange('dotFormula', value);
  };

  // Apply formula example
  const applyFormulaExample = (formula) => {
    handleFormulaChange(formula);
  };

  // Apply a DoT formula example
  const applyDotFormulaExample = (formula) => {
    handleDotFormulaChange(formula);
  };

  // Handler for damage type change
  const handleDamageTypeChange = (damageType) => {
    // Create a new config object with the updated damageType
    const newConfig = {
      ...damageConfig,
      damageType: damageType
    };

    // Update the state with the new config
    setDamageConfig(newConfig);

    // Dispatch the action to update the global state
    dispatch(actionCreators.updateDamageConfig(newConfig));
  };

  // Handler for element selection (primary/secondary)
  const applyElementSelection = (elementId) => {
    // If the elementId is already the primary element, remove it
    if (damageConfig.elementType === elementId) {
      handleDamageConfigChange('elementType', null);
      return;
    }

    // If the elementId is already the secondary element, remove it
    if (damageConfig.secondaryElementType === elementId) {
      handleDamageConfigChange('secondaryElementType', null);
      return;
    }

    // If no primary element is set, set this as primary
    if (!damageConfig.elementType) {
      handleDamageConfigChange('elementType', elementId);
      return;
    }

    // If primary is set but secondary is not, set this as secondary
    if (!damageConfig.secondaryElementType) {
      handleDamageConfigChange('secondaryElementType', elementId);
      return;
    }

    // If both are set, replace secondary
    handleDamageConfigChange('secondaryElementType', elementId);
  };

  // Define element categories and icons
  const elementCategories = {
    physical: [
      { id: 'bludgeoning', name: 'Bludgeoning', icon: <FaHandFist size={22} /> },
      { id: 'piercing', name: 'Piercing', icon: <FaBolt size={22} /> },
      { id: 'slashing', name: 'Slashing', icon: <FaWind size={22} /> }
    ],
    elemental: [
      { id: 'fire', name: 'Fire', icon: <FaFireFlameSimple size={22} /> },
      { id: 'cold', name: 'Cold', icon: <FaWater size={22} /> },
      { id: 'lightning', name: 'Lightning', icon: <FaBolt size={22} /> },
      { id: 'acid', name: 'Acid', icon: <FaSkull size={22} /> },
      { id: 'thunder', name: 'Thunder', icon: <FaWind size={22} /> }
    ],
    arcane: [
      { id: 'force', name: 'Force', icon: <FaBurst size={22} /> },
      { id: 'psychic', name: 'Psychic', icon: <FaBurst size={22} /> },
      { id: 'radiant', name: 'Radiant', icon: <FaBurst size={22} /> }
    ],
    otherworldly: [
      { id: 'necrotic', name: 'Necrotic', icon: <FaSkull size={22} /> },
      { id: 'poison', name: 'Poison', icon: <FaSkull size={22} /> },
      { id: 'void', name: 'Void', icon: <FaMoon size={22} /> }
    ]
  };

  // Update the dice display to be interactive with the formula and add complex formula examples
  const addDiceToFormula = (diceType) => {
    const newFormula = damageConfig.formula
      ? `${damageConfig.formula} + 1${diceType}`
      : `1${diceType}`;
    handleDamageConfigChange('formula', newFormula);
  };

  const getComplexFormulaExamples = () => {
    switch (currentResolution) {
      case 'DICE':
        return [
          {
            name: 'Empowered Strike',
            formula: '2d6 + STR + INT/2',
            description: 'Combine strength with intelligence for a powerful strike'
          },
          {
            name: 'Critical Smite',
            formula: '2d8 + 1d6 + INT*2 + ' + getElementCode(damageConfig.elementType),
            description: 'Critical hit with elemental power bonus'
          },
          {
            name: 'Adaptive Cascade',
            formula: 'MAX(INT, STR)*1d4 + ' + getElementCode(damageConfig.elementType) + '/2',
            description: 'Uses your highest stat to determine power'
          },
          {
            name: 'Elemental Hurricane',
            formula: '(3d6 + ' + getElementCode(damageConfig.elementType) + '*2)*(HP < MAXHP/2 ? 1.5 : 1)',
            description: 'Does 50% more damage when below half health'
          },
          {
            name: 'Tactical Precision',
            formula: '(1d4 + 1d6 + 1d8)*(MP/MAXMP > 0.7 ? 2 : 1) + INT/2',
            description: 'Double damage when mana is above 70%'
          },
          {
            name: 'Blood Magic',
            formula: '4d6*(1 + (MAXHP-HP)/MAXHP) + ' + getElementCode(damageConfig.elementType),
            description: 'Does more damage the lower your health is'
          },
          {
            name: 'Combo Shatter',
            formula: 'ROUND*1d8 + STR + ' + getElementCode(damageConfig.elementType) + '*(ROUND > 3 ? 2 : 1)',
            description: 'Gets stronger each round with big bonus after round 3'
          }
        ];
      case 'CARDS':
        return [
          {
            name: 'Royal Suffering',
            formula: 'CARD_VALUE + (FACE_CARDS * 15) + (ROYAL_FLUSH ? 100 : 0)',
            description: 'Massive damage with royal flush, extra damage per face card'
          },
          {
            name: 'Suit Specialization',
            formula: 'CARD_VALUE * (SAME_SUIT ? 3 : 1) + (CARD_VALUE > 30 ? 15 : 0)',
            description: 'Triple damage on same suit, bonus for high total value'
          },
          {
            name: 'Poker Master',
            formula: 'CARD_VALUE + (PAIRS * 10) + (THREE_OF_A_KIND ? 30 : 0) + (FOUR_OF_A_KIND ? 60 : 0)',
            description: 'Scales with poker hand quality'
          },
          {
            name: 'Red Black Balance',
            formula: 'CARD_VALUE * (RED_COUNT == BLACK_COUNT ? 2.5 : 1) + INT',
            description: 'Massive bonus when perfect balance of red and black cards'
          },
          {
            name: 'Stacked Deck',
            formula: 'CARD_VALUE + (SEQUENTIAL_CARDS ? 40 : 0) + (FACE_CARDS * RED_COUNT * 2)',
            description: 'Bonus for sequential cards and face cards of red suit'
          },
          {
            name: 'Mana Surge',
            formula: 'CARD_VALUE * (MP/MAXMP) + (ALL_SPADES ? MP : 0)',
            description: 'Scales with mana percentage, massive bonus with all spades'
          }
        ];
      case 'COINS':
        return [
          {
            name: 'Probability Manipulation',
            formula: 'HEADS_COUNT * 8 * (ROUND > 4 ? 1.5 : 1) + ' + getElementCode(damageConfig.elementType),
            description: 'Scales with round number for long fights'
          },
          {
            name: 'Chaos Theory',
            formula: 'ALL_HEADS ? (TOTAL_FLIPS * 20) : (ALL_TAILS ? (TOTAL_FLIPS * 15) : (ALTERNATING_PATTERN ? (TOTAL_FLIPS * 25) : (HEADS_COUNT * 5)))',
            description: 'Complex pattern recognition with highest bonus for alternating'
          },
          {
            name: 'Statistical Anomaly',
            formula: 'TOTAL_FLIPS * 5 * (ABS(HEADS_RATIO - 0.5) * 10 + 1) + STR',
            description: 'More damage the further from 50% heads probability'
          },
          {
            name: 'Golden Ratio',
            formula: 'HEADS_COUNT * 10 * (HEADS_RATIO > 0.618 ? (HEADS_RATIO < 0.619 ? 3 : 1) : 1) + INT',
            description: 'Triple damage if heads ratio is almost exactly the golden ratio'
          },
          {
            name: 'Streak Amplifier',
            formula: 'HEADS_COUNT * (LONGEST_STREAK * 3) + (SEQUENCE_LENGTH > 3 ? 30 : 0)',
            description: 'Rewards long streaks of the same result'
          },
          {
            name: 'Entropy Cascade',
            formula: '(LONGEST_STREAK > TOTAL_FLIPS/2 ? (LONGEST_STREAK * 20) : (TOTAL_FLIPS * 5)) + CHA',
            description: 'Either rewards long streaks or consistent changes'
          }
        ];
      default:
        return [];
    }
  };

  // Get suit symbol for cards
  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  // Toggle card selection
  const toggleCardSelection = (card) => {
    let newSelectedCards;

    if (selectedCards.includes(card)) {
      // Remove card if already selected
      newSelectedCards = selectedCards.filter(c => c !== card);
      setSelectedCards(newSelectedCards);
    } else {
      // Add card if not already selected
      newSelectedCards = [...selectedCards, card];
      setSelectedCards(newSelectedCards);
    }

    // Update the formula with selected card information
    updateFormulaWithCardSelection(newSelectedCards);
  };

  // Update formula based on card selection
  const updateFormulaWithCardSelection = (cards = selectedCards) => {
    if (cards.length > 0) {
      // Create a condition that checks if these specific cards are drawn
      const cardCondition = `HAS_CARDS('${cards.join("','")}')`;

      // Add a bonus to the formula based on selected cards
      let updatedFormula = damageConfig.formula || '';

      // If formula already has a card condition, replace it
      if (updatedFormula.includes('HAS_CARDS(')) {
        updatedFormula = updatedFormula.replace(/\+ \(HAS_CARDS\([^)]+\) \? [^:]+: 0\)/g, '');
      }

      // Add the new condition
      const bonus = cards.length * 10; // Simple bonus calculation
      updatedFormula = updatedFormula.trim();

      if (updatedFormula) {
        updatedFormula += ` + (${cardCondition} ? ${bonus} : 0)`;
      } else {
        updatedFormula = `CARD_VALUE + (${cardCondition} ? ${bonus} : 0)`;
      }

      handleFormulaChange(updatedFormula);
    }
  };

  // Get default formula for a resolution type
  const createDefaultFormula = (resolutionType, element) => {
    const elementCode = getElementCode(element || getCurrentElement());

    switch (resolutionType) {
      case 'DICE':
        return `2d6 + INT + ${elementCode}`;
      case 'CARDS':
        return `CARD_VALUE + FACE_CARDS * 3 + ${elementCode}`;
      case 'COINS':
        return `HEADS_COUNT * 8 + ${elementCode}`;
      default:
        return `2d6 + INT + ${elementCode}`;
    }
  };

  // Add state for formula help visibility
  const [showFormulaHelp, setShowFormulaHelp] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  // State for enhanced tooltips
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Tooltip handlers
  const handleMouseEnter = (data, e) => {
    // Create WoW Classic style tooltip content
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {data.description || data.name}
        </div>

        {/* Damage type information */}
        {data.id && (
          <div className="tooltip-effect">
            <span className="tooltip-gold">Damage Type:</span> {data.name}
          </div>
        )}

        {/* Damage properties */}
        {data.id && getDamageProperties(data.id)}

        {/* Formula information if applicable */}
        {data.formula && (
          <div className="tooltip-effect">
            <span className="tooltip-gold">Formula:</span> {data.formula}
          </div>
        )}

        {/* Damage mechanics information */}
        {data.id && (
          <>
            <div className="tooltip-divider"></div>
            <div className="tooltip-section-header">Damage Properties:</div>
            <div className="tooltip-option">
              <span className="tooltip-bullet"></span>
              <span className="tooltip-gold">Resistable:</span> {getDamageResistInfo(data.id)}
            </div>
            <div className="tooltip-option">
              <span className="tooltip-bullet"></span>
              <span className="tooltip-gold">Affected by:</span> {getDamageAffectedBy(data.id)}
            </div>
          </>
        )}

        {/* Flavor text based on damage type */}
        <div className="tooltip-divider"></div>
        <div className="tooltip-flavor-text">
          {getDamageFlavorText(data.id)}
        </div>
      </div>
    );

    // Store the tooltip data including title and icon
    setTooltipContent({
      content: tooltipContent,
      title: data.name,
      icon: data.id || data.icon || null
    });
    setShowTooltip(true);
    // Update position using client coordinates for fixed positioning
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (showTooltip) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Get damage properties based on damage type
  const getDamageProperties = (type) => {
    if (!type) return null;

    // Return specific properties based on damage type
    return null; // Placeholder for now
  };

  // Get damage resistance information
  const getDamageResistInfo = (type) => {
    if (!type) return 'None';

    switch (type) {
      // Physical damage types
      case 'bludgeoning':
      case 'piercing':
      case 'slashing':
        return 'Physical Armor';

      // Elemental damage types
      case 'fire': return 'Fire Resistance';
      case 'cold': return 'Cold Resistance';
      case 'lightning': return 'Lightning Resistance';
      case 'acid': return 'Acid Resistance';
      case 'thunder': return 'Thunder Resistance';

      // Arcane damage types
      case 'force': return 'Force Resistance';
      case 'psychic': return 'Mental Resistance';
      case 'radiant': return 'Radiant Resistance';

      // Otherworldly damage types
      case 'necrotic': return 'Necrotic Resistance';
      case 'poison': return 'Poison Resistance';
      case 'void': return 'Void Resistance';

      default: return 'None';
    }
  };

  // Get what affects the damage type
  const getDamageAffectedBy = (type) => {
    if (!type) return 'Spell Power';

    switch (type) {
      // Physical damage types
      case 'bludgeoning':
      case 'piercing':
      case 'slashing':
        return 'Strength, Attack Power';

      // Elemental damage types
      case 'fire':
      case 'cold':
      case 'lightning':
      case 'acid':
      case 'thunder':
        return 'Spell Power, Elemental Mastery';

      // Arcane damage types
      case 'force':
      case 'psychic':
        return 'Spell Power, Intelligence';
      case 'radiant':
        return 'Spell Power, Divine Power';

      // Otherworldly damage types
      case 'necrotic':
      case 'void':
        return 'Spell Power, Shadow Mastery';
      case 'poison':
        return 'Spell Power, Nature Mastery';

      default: return 'Spell Power';
    }
  };

  // Get flavor text based on damage type
  const getDamageFlavorText = (type) => {
    if (!type) return '"Destructive energies manifest at your command."';

    switch (type) {
      // Physical damage types
      case 'bludgeoning': return '"Your magic crushes enemies with overwhelming force."';
      case 'piercing': return '"Your spell creates projectiles that puncture armor with ease."';
      case 'slashing': return '"Magical blades slice through your foes like paper."';

      // Elemental damage types
      case 'fire': return '"Flames erupt at your command, consuming all in their path."';
      case 'cold': return '"Frigid energies freeze your enemies to the core."';
      case 'lightning': return '"Electric currents arc between foes with devastating effect."';
      case 'acid': return '"Corrosive energies melt through armor and flesh alike."';
      case 'thunder': return '"Sonic booms shatter the resolve of your enemies."';

      // Arcane damage types
      case 'force': return '"Pure arcane energy tears through the fabric of reality."';
      case 'psychic': return '"Your magic assaults the minds of your foes directly."';
      case 'radiant': return '"Divine light burns away darkness and corruption."';

      // Otherworldly damage types
      case 'necrotic': return '"Death energy withers life force and decays matter."';
      case 'poison': return '"Toxic energies corrupt and destroy from within."';
      case 'void': return '"The emptiness between stars consumes all it touches."';

      default: return '"Destructive energies manifest at your command."';
    }
  };

  // Main render function
  return (
    <div className="damage-effects-container">
      {/* First section: Damage Type Selection */}
      <div className="damage-type-selection section">
        <h3>Damage Application</h3>
        <div className="card-selection-grid">
          <IconSelectionCard
            icon={<FaBolt className="icon" />}
            title="Instant Damage"
            description="Deals damage immediately in a single burst"
            onClick={() => {
              console.log('Instant Damage button clicked');
              // Direct state update approach
              const newConfig = {
                ...damageConfig,
                damageType: 'direct',
                hasDotEffect: false
              };
              console.log('Setting new config:', newConfig);
              setDamageConfig(newConfig);
              dispatch(actionCreators.updateDamageConfig(newConfig));
            }}
            selected={damageConfig.damageType === 'direct' && !damageConfig.hasDotEffect}
            onMouseEnter={(e) => handleMouseEnter({name: 'Instant Damage', description: 'Deals damage immediately in a single burst', icon: 'spell_fire_fireball', damageType: 'direct'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <IconSelectionCard
            icon={<FaSkull className="icon" />}
            title="Damage Over Time"
            description="Deals recurring damage over multiple turns"
            onClick={() => {
              console.log('Damage Over Time button clicked');
              // Direct state update approach
              const newConfig = {
                ...damageConfig,
                damageType: 'dot',
                hasDotEffect: false
              };
              console.log('Setting new config:', newConfig);
              setDamageConfig(newConfig);
              dispatch(actionCreators.updateDamageConfig(newConfig));
            }}
            selected={damageConfig.damageType === 'dot' && !damageConfig.hasDotEffect}
            onMouseEnter={(e) => handleMouseEnter({name: 'Damage Over Time', description: 'Deals recurring damage over multiple turns', icon: 'spell_shadow_curseofsargeras', damageType: 'DoT'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <IconSelectionCard
            icon={<FaFireFlameCurved className="icon" />}
            title="Combined Damage"
            description="Deals instant damage plus a damage-over-time effect"
            onClick={() => {
              console.log('Combined Damage button clicked');
              // Direct state update approach
              const newConfig = {
                ...damageConfig,
                damageType: 'direct',
                hasDotEffect: true
              };
              console.log('Setting new config:', newConfig);
              setDamageConfig(newConfig);
              dispatch(actionCreators.updateDamageConfig(newConfig));
            }}
            selected={damageConfig.hasDotEffect}
            onMouseEnter={(e) => handleMouseEnter({name: 'Combined Damage', description: 'Deals instant damage plus a damage-over-time effect', icon: 'spell_fire_fireball02', damageType: 'combined'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
        </div>
      </div>

      {/* Element selection has been moved to Step1BasicInfo */}

      {/* Third section: Resolution Method Selection */}
      <div className="resolution-selector section">
        <h3>Resolution Method</h3>
        <div className="resolution-options">
          <button
            className={`resolution-option ${currentResolution === 'DICE' ? 'active' : ''}`}
            onClick={() => handleResolutionChange('DICE')}
            onMouseEnter={(e) => handleMouseEnter({name: 'Dice Resolution', description: 'Calculate damage using dice rolls', icon: 'inv_misc_dice_01', resolutionMethod: 'DICE'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <FaDiceD20 className="resolution-icon" />
            <span>Dice</span>
          </button>
          <button
            className={`resolution-option ${currentResolution === 'CARDS' ? 'active' : ''}`}
            onClick={() => handleResolutionChange('CARDS')}
            onMouseEnter={(e) => handleMouseEnter({name: 'Card Resolution', description: 'Calculate damage using card draws', icon: 'inv_misc_ticket_tarot_deck_01', resolutionMethod: 'CARDS'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <FaClone className="resolution-icon" />
            <span>Cards</span>
          </button>
          <button
            className={`resolution-option ${currentResolution === 'COINS' ? 'active' : ''}`}
            onClick={() => handleResolutionChange('COINS')}
            onMouseEnter={(e) => handleMouseEnter({name: 'Coin Resolution', description: 'Calculate damage using coin flips', icon: 'inv_misc_coin_01', resolutionMethod: 'COINS'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <FaCoins className="resolution-icon" />
            <span>Coins</span>
          </button>
        </div>

        {/* Visual resolution mechanics display based on selected type */}
        <div className="visual-resolution-display">
          {currentResolution === 'DICE' && (
            <div className="dice-display">
              <div className="dice-info">
                <h4>Dice Resolution</h4>
                <p>Damage is calculated using dice rolls with the formula: <code>{damageConfig.formula}</code></p>
                <p className="interaction-hint">Click on a die to add it to your formula</p>
              </div>
              <div className="dice-stats">
                <div className="stat-item">
                  <div className="stat-label">Minimum</div>
                  <div className="stat-value">{parseDiceNotation(damageConfig.formula) ? getMinRoll(damageConfig.formula) : 'N/A'}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Average</div>
                  <div className="stat-value">{parseDiceNotation(damageConfig.formula) ? getAverageRoll(damageConfig.formula) : 'N/A'}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Maximum</div>
                  <div className="stat-value">{parseDiceNotation(damageConfig.formula) ? getMaxRoll(damageConfig.formula) : 'N/A'}</div>
                </div>
              </div>
              <div className="dice-visuals">
                <div
                  className="die d4"
                  onClick={() => addDiceToFormula('d4')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Four-sided Die', description: 'Add a d4 to your damage formula', icon: 'inv_misc_dice_01'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d4</div>
                <div
                  className="die d6"
                  onClick={() => addDiceToFormula('d6')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Six-sided Die', description: 'Add a d6 to your damage formula', icon: 'inv_misc_dice_02'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d6</div>
                <div
                  className="die d8"
                  onClick={() => addDiceToFormula('d8')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Eight-sided Die', description: 'Add a d8 to your damage formula', icon: 'inv_misc_dice_03'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d8</div>
                <div
                  className="die d10"
                  onClick={() => addDiceToFormula('d10')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Ten-sided Die', description: 'Add a d10 to your damage formula', icon: 'inv_misc_dice_04'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d10</div>
                <div
                  className="die d12"
                  onClick={() => addDiceToFormula('d12')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Twelve-sided Die', description: 'Add a d12 to your damage formula', icon: 'inv_misc_dice_05'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d12</div>
                <div
                  className="die d20"
                  onClick={() => addDiceToFormula('d20')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Twenty-sided Die', description: 'Add a d20 to your damage formula', icon: 'inv_misc_dice_06'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d20</div>
              </div>
            </div>
          )}

          {currentResolution === 'CARDS' && (
            <div className="card-display">
              <div className="card-info">
                <h4>Card Damage Formula</h4>
                <p>
                  Build a formula using playing cards. Select specific cards to add bonuses to your formula.
                  <code>{damageConfig.formula || 'CARD_VALUE + ' + getElementCode(getCurrentElement())}</code>
                </p>
              </div>

              {/* Draw Count Selector */}
              <div className="draw-count-selector">
                <label htmlFor="draw-count">Cards Drawn Per Attack:</label>
                <div className="draw-count-controls">
                  <button
                    className="draw-count-button"
                    onClick={() => setDrawCount(Math.max(1, drawCount - 1))}
                    disabled={drawCount <= 1}
                  >-</button>
                  <input
                    id="draw-count"
                    type="number"
                    min="1"
                    max="10"
                    value={drawCount}
                    onChange={(e) => setDrawCount(parseInt(e.target.value) || 1)}
                    className="draw-count-input"
                  />
                  <button
                    className="draw-count-button"
                    onClick={() => setDrawCount(Math.min(10, drawCount + 1))}
                    disabled={drawCount >= 10}
                  >+</button>
                </div>
                <div className="draw-count-info">
                  <p>Each attack draws {drawCount} card{drawCount !== 1 ? 's' : ''} from the deck</p>
                </div>
              </div>

              <div className="card-variables">
                <div className="variable-item" onClick={() => handleFormulaChange(damageConfig.formula ? `${damageConfig.formula} + CARD_VALUE` : 'CARD_VALUE')}>
                  <div className="variable-name">CARD_VALUE</div>
                  <div className="variable-desc">Sum of all card values (Ace=1/14, J=11, Q=12, K=13)</div>
                </div>
                <div className="variable-item" onClick={() => handleFormulaChange(damageConfig.formula ? `${damageConfig.formula} + FACE_CARDS` : 'FACE_CARDS')}>
                  <div className="variable-name">FACE_CARDS</div>
                  <div className="variable-desc">Number of face cards (J, Q, K)</div>
                </div>
                <div className="variable-item" onClick={() => handleFormulaChange(damageConfig.formula ? `${damageConfig.formula} + PAIRS` : 'PAIRS')}>
                  <div className="variable-name">PAIRS</div>
                  <div className="variable-desc">Number of matching ranks</div>
                </div>
                <div className="variable-item" onClick={() => handleFormulaChange(damageConfig.formula ? `${damageConfig.formula} + SAME_SUIT` : 'SAME_SUIT')}>
                  <div className="variable-name">SAME_SUIT</div>
                  <div className="variable-desc">Number of cards with the same suit</div>
                </div>
                <div className="variable-item" onClick={() => handleFormulaChange(damageConfig.formula ? `${damageConfig.formula} + (ROYAL_FLUSH ? 100 : 0)` : '(ROYAL_FLUSH ? 100 : 0)')}>
                  <div className="variable-name">ROYAL_FLUSH</div>
                  <div className="variable-desc">Boolean: 10, J, Q, K, A of same suit</div>
                </div>
                <div className="variable-item" onClick={() => handleFormulaChange(damageConfig.formula ? `${damageConfig.formula} + HAS_CARDS('...')` : "HAS_CARDS('...')")}>
                  <div className="variable-name">HAS_CARDS</div>
                  <div className="variable-desc">Check if specific cards are drawn (select cards below)</div>
                </div>
              </div>

              <div className="formula-builder">
                <h4>Formula Builder</h4>
                <div className="formula-input-row">
                  <input
                    type="text"
                    className="formula-input"
                    value={damageConfig.formula || ''}
                    onChange={(e) => handleFormulaChange(e.target.value)}
                    placeholder={`Enter formula (e.g. CARD_VALUE + ${getElementCode(getCurrentElement())})`}
                  />
                  <button className="formula-button" onClick={() => handleFormulaChange(createDefaultFormula(currentResolution))}>
                    Reset
                  </button>
                </div>

                <div className="selected-cards-display">
                  <h4>Selected Cards: {selectedCards.length > 0 ? `${selectedCards.length} card(s) selected` : 'None'}</h4>
                  <div className="selected-cards-list">
                    {selectedCards.length > 0 ? (
                      selectedCards.map((card, index) => {
                        const [rank, suit] = card.split('-');
                        return (
                          <div key={index} className="selected-card-item" onClick={() => toggleCardSelection(card)}>
                            {rank}<span className={`suit-symbol ${suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black'}`}>{getSuitSymbol(suit)}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-cards-selected">Click cards below to select them</div>
                    )}
                  </div>
                  {selectedCards.length > 0 && (
                    <button
                      className="apply-cards-button"
                      onClick={() => updateFormulaWithCardSelection()}
                    >
                      Apply Selected Cards to Formula
                    </button>
                  )}
                </div>

                <div className="complex-examples">
                  <h4>Complex Formula Examples</h4>
                  <div className="example-cards">
                    {getComplexFormulaExamples().map((example, index) => (
                      <div key={index} className="example-card" onClick={() => handleFormulaChange(example.formula)}>
                        <h5>{example.name}</h5>
                        <div className="example-formula">{example.formula}</div>
                        <p>{example.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Selection Area */}
              <div className="card-selector-container">
                <h4>Select Specific Cards for Bonuses</h4>
                <p className="card-selection-help">
                  Click cards below to select them. Selected cards will add a bonus to your formula if those exact cards are drawn.
                </p>
                <div className="card-suit-tabs">
                  <div
                    className={`card-suit-tab red ${activeSuit === 'hearts' ? 'active' : ''}`}
                    onClick={() => setActiveSuit('hearts')}
                  >
                    <span className="suit-symbol">♥</span> Hearts
                  </div>
                  <div
                    className={`card-suit-tab red ${activeSuit === 'diamonds' ? 'active' : ''}`}
                    onClick={() => setActiveSuit('diamonds')}
                  >
                    <span className="suit-symbol">♦</span> Diamonds
                  </div>
                  <div
                    className={`card-suit-tab black ${activeSuit === 'clubs' ? 'active' : ''}`}
                    onClick={() => setActiveSuit('clubs')}
                  >
                    <span className="suit-symbol">♣</span> Clubs
                  </div>
                  <div
                    className={`card-suit-tab black ${activeSuit === 'spades' ? 'active' : ''}`}
                    onClick={() => setActiveSuit('spades')}
                  >
                    <span className="suit-symbol">♠</span> Spades
                  </div>
                </div>

                <div className="card-grid">
                  {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].map((rank) => (
                    <div
                      key={`${activeSuit}-${rank}`}
                      className={`playing-card ${activeSuit} ${selectedCards.includes(`${rank}-${activeSuit}`) ? 'selected' : ''}`}
                      onClick={() => toggleCardSelection(`${rank}-${activeSuit}`)}
                    >
                      <div className="card-corner card-top-left">
                        <div className="card-rank">{rank}</div>
                        <div className="card-suit">{getSuitSymbol(activeSuit)}</div>
                      </div>
                      <div className="card-center">
                        {getSuitSymbol(activeSuit)}
                      </div>
                      <div className="card-corner card-bottom-right">
                        <div className="card-rank">{rank}</div>
                        <div className="card-suit">{getSuitSymbol(activeSuit)}</div>
                      </div>
                      {selectedCards.includes(`${rank}-${activeSuit}`) && (
                        <div className="card-selected-indicator">
                          {selectedCards.indexOf(`${rank}-${activeSuit}`) + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentResolution === 'COINS' && (
            <div className="coin-display">
              <div className="coin-info">
                <h4>Coin Flip Resolution</h4>
                <p>Damage is determined by the coin flip result with formula: <code>{damageConfig.formula}</code></p>

                {/* Coin Count Selector */}
                <div className="coin-count-selector">
                  <label htmlFor="coin-count">Coins Flipped Per Attack:</label>
                  <div className="coin-count-controls">
                    <button
                      className="coin-count-button"
                      onClick={() => setCoinCount(Math.max(1, coinCount - 1))}
                      disabled={coinCount <= 1}
                    >-</button>
                    <input
                      id="coin-count"
                      type="number"
                      min="1"
                      max="10"
                      value={coinCount}
                      onChange={(e) => setCoinCount(parseInt(e.target.value) || 1)}
                      className="coin-count-input"
                    />
                    <button
                      className="coin-count-button"
                      onClick={() => setCoinCount(Math.min(10, coinCount + 1))}
                      disabled={coinCount >= 10}
                    >+</button>
                  </div>
                  <div className="coin-count-info">
                    <p>Each attack flips {coinCount} coin{coinCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
              <div className="coin-variables">
                <div className="variable-item" onClick={() => handleDamageConfigChange('formula', damageConfig.formula + ' HEADS_COUNT')}>
                  <span className="variable-name">HEADS_COUNT</span>
                  <span className="variable-desc">Number of heads flipped</span>
                </div>
                <div className="variable-item" onClick={() => handleDamageConfigChange('formula', damageConfig.formula + ' TAILS_COUNT')}>
                  <span className="variable-name">TAILS_COUNT</span>
                  <span className="variable-desc">Number of tails flipped</span>
                </div>
                <div className="variable-item" onClick={() => handleDamageConfigChange('formula', damageConfig.formula + ' ALL_HEADS')}>
                  <span className="variable-name">ALL_HEADS</span>
                  <span className="variable-desc">Boolean if all coins are heads</span>
                </div>
                <div className="variable-item" onClick={() => handleDamageConfigChange('formula', damageConfig.formula + ' ALL_TAILS')}>
                  <span className="variable-name">ALL_TAILS</span>
                  <span className="variable-desc">Boolean if all coins are tails</span>
                </div>
                <div className="variable-item" onClick={() => handleDamageConfigChange('formula', damageConfig.formula + ' HEADS_RATIO')}>
                  <span className="variable-name">HEADS_RATIO</span>
                  <span className="variable-desc">Ratio of heads (0.0-1.0)</span>
                </div>
              </div>
              <div className="coin-visuals">
                <div className="coin heads" onClick={() => handleDamageConfigChange('formula', damageConfig.formula + ' + HEADS_COUNT * 8')}>
                  <div className="coin-face">H</div>
                </div>
                <div className="coin tails" onClick={() => handleDamageConfigChange('formula', damageConfig.formula + ' + TAILS_COUNT * 5')}>
                  <div className="coin-face">T</div>
                </div>
              </div>
              <div className="flip-simulation">
                <button className="simulate-button" onClick={() => alert('Coin flip simulation would go here')}>
                  Simulate Flip
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fourth section: Formula Input */}
      {damageConfig.damageType === 'direct' && (
        <div className="formula-section section">
          <h3>Damage Formula</h3>
          <div className="formula-builder">
          <div className="formula-header">
            <button
              className="help-button"
              onClick={() => setShowFormulaHelp(prev => !prev)}
            >
              {showFormulaHelp ? 'Hide Syntax Help' : 'Show Syntax Help'}
            </button>
          </div>

          {showFormulaHelp && (
            <div className="formula-explanation">
              <h4>Formula Syntax Guide</h4>
              <div className="formula-explanation-content">
                <div className="syntax-item">
                  <div className="syntax-title">Basic Operators</div>
                  <div className="syntax-examples">
                    <div className="syntax-example">
                      <code>+</code> <span>Addition (2 + 3 = 5)</span>
                    </div>
                    <div className="syntax-example">
                      <code>-</code> <span>Subtraction (5 - 2 = 3)</span>
                    </div>
                    <div className="syntax-example">
                      <code>*</code> <span>Multiplication (2 * 3 = 6)</span>
                    </div>
                    <div className="syntax-example">
                      <code>/</code> <span>Division (6 / 2 = 3)</span>
                    </div>
                  </div>
                </div>

                <div className="syntax-item">
                  <div className="syntax-title">Dice Notation</div>
                  <div className="syntax-examples">
                    <div className="syntax-example">
                      <code>1d6</code> <span>Roll one 6-sided die (result: 1-6)</span>
                    </div>
                    <div className="syntax-example">
                      <code>2d8</code> <span>Roll two 8-sided dice (result: 2-16)</span>
                    </div>
                    <div className="syntax-example">
                      <code>3d4 + 2</code> <span>Roll three 4-sided dice and add 2 (result: 5-14)</span>
                    </div>
                  </div>
                </div>

                <div className="syntax-item">
                  <div className="syntax-title">Conditional Expressions</div>
                  <div className="syntax-examples">
                    <div className="syntax-example">
                      <code>(condition ? trueValue : falseValue)</code> <span>If condition is true, use trueValue, otherwise use falseValue</span>
                    </div>
                    <div className="syntax-example">
                      <code>(HP &lt; MAXHP/2 ? 1.5 : 1)</code> <span>If HP is less than half of MAXHP, use 1.5, otherwise use 1</span>
                    </div>
                    <div className="syntax-example">
                      <code>(ROYAL_FLUSH ? 100 : 0)</code> <span>If ROYAL_FLUSH is true, add 100, otherwise add 0</span>
                    </div>
                  </div>
                </div>

                <div className="syntax-item">
                  <div className="syntax-title">Comparison Operators</div>
                  <div className="syntax-examples">
                    <div className="syntax-example">
                      <code>&lt;</code> <span>Less than (5 &lt; 10 is true)</span>
                    </div>
                    <div className="syntax-example">
                      <code>&gt;</code> <span>Greater than (10 &gt; 5 is true)</span>
                    </div>
                    <div className="syntax-example">
                      <code>=</code> <span>Equal to (5 = 5 is true)</span>
                    </div>
                    <div className="syntax-example">
                      <code>!=</code> <span>Not equal to (5 != 10 is true)</span>
                    </div>
                  </div>
                </div>

                <div className="syntax-item">
                  <div className="syntax-title">Functions</div>
                  <div className="syntax-examples">
                    <div className="syntax-example">
                      <code>MIN(a, b)</code> <span>The minimum of a and b (MIN(5, 10) = 5)</span>
                    </div>
                    <div className="syntax-example">
                      <code>MAX(a, b)</code> <span>The maximum of a and b (MAX(5, 10) = 10)</span>
                    </div>
                    <div className="syntax-example">
                      <code>ROUND(x)</code> <span>Round x to the nearest integer</span>
                    </div>
                    <div className="syntax-example">
                      <code>HAS_CARDS('...')</code> <span>True if specific cards are drawn (select cards below)</span>
                    </div>
                  </div>
                </div>

                <div className="syntax-item">
                  <div className="syntax-title">Card Variables</div>
                  <div className="syntax-examples">
                    <div className="syntax-example">
                      <code>CARD_VALUE</code> <span>Sum of all card values (A=1/14, J=11, Q=12, K=13)</span>
                    </div>
                    <div className="syntax-example">
                      <code>FACE_CARDS</code> <span>Number of face cards (J, Q, K) drawn</span>
                    </div>
                    <div className="syntax-example">
                      <code>ROYAL_FLUSH</code> <span>Boolean (true/false) if 10, J, Q, K, A of same suit are drawn</span>
                    </div>
                  </div>
                </div>

                <div className="syntax-item">
                  <div className="syntax-title">Example Formula</div>
                  <div className="syntax-full-example">
                    <code>CARD_VALUE + (FACE_CARDS * 5) + (SAME_SUIT ? 20 : 0) + (ROYAL_FLUSH ? 100 : 0)</code>
                    <div className="syntax-explanation">
                      <ul>
                        <li>Add the total value of all cards drawn</li>
                        <li>Add 5 points for each face card (J, Q, K) drawn</li>
                        <li>Add 20 points if all cards are the same suit</li>
                        <li>Add 100 points if you have a royal flush</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="formula-input-row">
            <input
              type="text"
              className="formula-input"
              value={damageConfig.formula || ''}
              onChange={(e) => handleFormulaChange(e.target.value)}
              placeholder={`Enter formula (e.g. ${createDefaultFormula(currentResolution)})`}
            />
            <button className="formula-button" onClick={() => handleFormulaChange(createDefaultFormula(currentResolution))}>
              Reset
            </button>
          </div>

          <VariablesDisplay onVariableClick={(variable) => {
            const input = document.getElementById('damageFormula');
            if (input) {
              const start = input.selectionStart;
              const end = input.selectionEnd;
              const currentValue = input.value;
              const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);
              handleFormulaChange(newValue);
              // Set cursor position after the inserted variable
              setTimeout(() => {
                input.setSelectionRange(start + variable.length, start + variable.length);
                input.focus();
              }, 0);
            }
          }} />

          <div className="complex-examples">
            <h4>Complex Formula Examples</h4>
            <div className="example-cards">
              {getComplexFormulaExamples().map((example, index) => (
                <div key={index} className="example-card" onClick={() => handleFormulaChange(example.formula)}>
                  <h5>{example.name}</h5>
                  <div className="example-formula">{example.formula}</div>
                  <p>{example.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* DoT Formula Section */}
      {(damageConfig.damageType === 'dot' || damageConfig.hasDotEffect) && (
        <div className="formula-section section">
          <h3>{damageConfig.hasDotEffect ? "DoT Effect Formula" : "DoT Formula"}</h3>
          <div className="formula-builder">
            <div className="formula-header">
              <button
                className="help-button"
                onClick={() => setShowFormulaHelp(prev => !prev)}
              >
                {showFormulaHelp ? 'Hide Syntax Help' : 'Show Syntax Help'}
              </button>
            </div>
            <div className="formula-input-group">
              <label htmlFor="dotFormula">DoT Formula:</label>
              <div className="formula-input-row">
                <input
                  id="dotFormula"
                  type="text"
                  className="formula-input"
                  value={damageConfig.dotFormula || ''}
                  onChange={(e) => handleDotFormulaChange(e.target.value)}
                  placeholder="Enter DoT formula..."
                />
                <button
                  className="formula-button"
                  onClick={() => handleDotFormulaChange(getDefaultDotFormula(currentResolution))}
                >
                  Reset
                </button>
              </div>
            </div>

            {showFormulaHelp && (
              <div className="formula-syntax-help">
                <h4>Formula Syntax Help</h4>
                <div className="syntax-item">
                  <div className="syntax-title">Basic Operators</div>
                  <div className="syntax-examples">
                    <div className="syntax-example">
                      <code>+</code> <span>Addition (2 + 3 = 5)</span>
                    </div>
                    <div className="syntax-example">
                      <code>-</code> <span>Subtraction (5 - 2 = 3)</span>
                    </div>
                    <div className="syntax-example">
                      <code>*</code> <span>Multiplication (2 * 3 = 6)</span>
                    </div>
                    <div className="syntax-example">
                      <code>/</code> <span>Division (6 / 2 = 3)</span>
                    </div>
                  </div>
                </div>

                <div className="syntax-item">
                  <div className="syntax-title">DoT Specific Variables</div>
                  <div className="syntax-examples">
                    <div className="syntax-example">
                      <code>ROUND</code> <span>Current round number (starts at 1)</span>
                    </div>
                    <div className="syntax-example">
                      <code>TOTAL_ROUNDS</code> <span>Total duration in rounds</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="formula-examples">
              <h4>DoT Formula Examples</h4>
              <div className="example-cards">
                {dotFormulaExamples.map((example, index) => (
                  <div key={index} className="example-card" onClick={() => applyDotFormulaExample(example.formula)}>
                    <h5>{example.name}</h5>
                    <div className="example-formula">{example.formula}</div>
                    <p>{example.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <VariablesDisplay onVariableClick={(variable) => {
              const input = document.getElementById('dotFormula');
              if (input) {
                const start = input.selectionStart;
                const end = input.selectionEnd;
                const currentValue = input.value;
                const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);
                handleDotFormulaChange(newValue);
                // Set cursor position after the inserted variable
                setTimeout(() => {
                  input.setSelectionRange(start + variable.length, start + variable.length);
                  input.focus();
                }, 0);
              }
            }} />
          </div>
        </div>
      )}

      {/* DoT specific configuration */}
      {(damageConfig.damageType === 'dot' || damageConfig.hasDotEffect) && (
        <div className="dot-config section">
          <h3>{damageConfig.hasDotEffect ? "Damage Over Time Effect" : "DoT Configuration"}</h3>

          <div className="dot-form-row">
            <div className="dot-input-group">
              <label>Trigger Type:</label>
              <select
                value={damageConfig.dotTriggerType}
                onChange={(e) => {
                  // First, update the local state to maintain the view
                  setDamageConfig(prev => ({
                    ...prev,
                    dotTriggerType: e.target.value
                  }));

                  // Then update the global state
                  handleDamageConfigChange('dotTriggerType', e.target.value);

                  // If changing to trigger-based, update the spell's trigger configuration
                  if (e.target.value === 'trigger') {
                    // Create a trigger configuration for the spell's trigger system
                    const spellTriggerConfig = {
                      triggerId: 'dot_trigger',
                      parameters: {},
                      targetEntity: 'target',
                      effectType: 'dot'
                    };

                    // Update the spell's trigger configuration
                    dispatch(actionCreators.updateTriggerConfig({
                      ...state.triggerConfig,
                      dotTrigger: spellTriggerConfig
                    }));

                    // Update the spell's wizard flow to include the trigger step
                    // We'll use setTimeout to ensure the state updates first
                    setTimeout(() => {
                      dispatch(actionCreators.updateWizardFlow());
                    }, 100);
                  }
                }}
                className="dot-select"
              >
                <option value="periodic">Periodic (Every Round/Turn)</option>
                <option value="trigger">Trigger-Based</option>
                <option value="channeled">Channeled (Configured in Channeling Step)</option>
              </select>
            </div>
          </div>

          {damageConfig.dotTriggerType === 'periodic' ? (
            <div className="dot-form-row">
              <div className="dot-input-group">
                <label>Duration:</label>
                <div className="dot-input-with-select">
                  <input
                    type="number"
                    value={damageConfig.dotDuration}
                    onChange={(e) => handleDamageConfigChange('dotDuration', parseInt(e.target.value, 10))}
                    min="1"
                    max="10"
                    className="dot-input"
                  />
                  <select
                    value={damageConfig.dotTickType}
                    onChange={(e) => handleDamageConfigChange('dotTickType', e.target.value)}
                    className="dot-select"
                  >
                    <option value="round">Rounds</option>
                    <option value="turn">Turns</option>
                    <option value="minute">Minutes</option>
                    <option value="hour">Hours</option>
                  </select>
                </div>
              </div>

              <div className="dot-input-group">
                <label>Ticks at:</label>
                <select
                  value={damageConfig.dotApplication}
                  onChange={(e) => handleDamageConfigChange('dotApplication', e.target.value)}
                  className="dot-select"
                >
                  <option value="start">Start of turn</option>
                  <option value="end">End of turn</option>
                </select>
              </div>

              <div className="dot-input-group">
                <label>Custom Formula Per Stage:</label>
                <button
                  className={`toggle-button ${damageConfig.isProgressiveDot ? 'active' : ''}`}
                  onClick={() => {
                    // Direct approach - create a completely new config object
                    const newValue = !damageConfig.isProgressiveDot;

                    // Create a new config with all the updated values
                    const newConfig = {
                      ...damageConfig,
                      isProgressiveDot: newValue,
                      dotScalingType: newValue ? 'progressive' : 'flat'
                    };

                    // Initialize progressiveStages array when enabling progressive effect
                    if (newValue && (!damageConfig.dotProgressiveStages || damageConfig.dotProgressiveStages.length === 0)) {
                      newConfig.dotProgressiveStages = [{
                        triggerAt: 1,
                        formula: damageConfig.dotFormula || '1d4 + INT/2',
                        description: '',
                        spellEffect: null
                      }];
                    }

                    // Update the local state directly
                    setDamageConfig(newConfig);

                    // Update the global state
                    dispatch(actionCreators.updateDamageConfig(newConfig));
                  }}
                >
                  {damageConfig.isProgressiveDot ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Progressive DoT Configuration */}
              {damageConfig.isProgressiveDot && (
                <div className="dot-input-group full-width">
                    <div className="progressive-stages">
                      <div className="stage-description">
                        Configure different formulas for each stage of the DoT effect.
                      </div>

                      {(!damageConfig.dotProgressiveStages || damageConfig.dotProgressiveStages.length === 0) ? (
                        <div className="no-stages">No stages configured yet. Add a stage to get started.</div>
                      ) : (
                        <div className="stages-list">
                          {damageConfig.dotProgressiveStages.map((stage, index) => (
                            <div key={index} className="stage-item">
                              <div className="stage-header">
                                <div className="stage-title">Stage {index + 1}</div>
                                <div className="stage-actions">
                                  <button
                                    className="stage-action delete"
                                    onClick={() => {
                                      const updatedStages = [...damageConfig.dotProgressiveStages];
                                      updatedStages.splice(index, 1);
                                      handleDamageConfigChange('dotProgressiveStages', updatedStages);
                                    }}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>

                              <div className="stage-content">
                                <div className="stage-timing">
                                  <label>Trigger At:</label>
                                  <div className="stage-timing-inputs">
                                    <input
                                      type="number"
                                      value={stage.triggerAt || ''}
                                      onChange={(e) => {
                                        const updatedStages = [...damageConfig.dotProgressiveStages];
                                        updatedStages[index] = {
                                          ...updatedStages[index],
                                          triggerAt: parseInt(e.target.value) || 0
                                        };
                                        handleDamageConfigChange('dotProgressiveStages', updatedStages);
                                      }}
                                      min="1"
                                    />
                                    <span className="unit-label">{damageConfig.dotTickType || 'rounds'}</span>
                                  </div>
                                </div>

                                <div className="stage-formula">
                                  <label>Formula:</label>
                                  <input
                                    type="text"
                                    value={stage.formula || ''}
                                    onChange={(e) => {
                                      const updatedStages = [...damageConfig.dotProgressiveStages];
                                      updatedStages[index] = {
                                        ...updatedStages[index],
                                        formula: e.target.value
                                      };
                                      handleDamageConfigChange('dotProgressiveStages', updatedStages);
                                    }}
                                    placeholder="Enter formula for this stage"
                                  />
                                </div>

                                <div className="stage-description-input">
                                  <label>Description (optional):</label>
                                  <input
                                    type="text"
                                    value={stage.description || ''}
                                    onChange={(e) => {
                                      const updatedStages = [...damageConfig.dotProgressiveStages];
                                      updatedStages[index] = {
                                        ...updatedStages[index],
                                        description: e.target.value
                                      };
                                      handleDamageConfigChange('dotProgressiveStages', updatedStages);
                                    }}
                                    placeholder="Describe this stage's effect"
                                  />
                                </div>

                                <div className="stage-spell-effect">
                                  <label>Trigger Spell (optional):</label>
                                  <SpellLibraryButton
                                    selectedSpellId={stage.spellEffect || null}
                                    onSpellSelect={(spellId) => {
                                      const updatedStages = [...damageConfig.dotProgressiveStages];
                                      updatedStages[index] = {
                                        ...updatedStages[index],
                                        spellEffect: spellId
                                      };
                                      handleDamageConfigChange('dotProgressiveStages', updatedStages);
                                    }}
                                    buttonText="Select Spell"
                                    popupTitle="Select Spell to Trigger at Stage"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        className="add-stage-button"
                        onClick={() => {
                          const progressiveStages = damageConfig.dotProgressiveStages || [];
                          const newStage = {
                            triggerAt: progressiveStages.length + 1,
                            formula: damageConfig.dotFormula || '1d4 + INT/2',
                            description: '',
                            spellEffect: null
                          };
                          handleDamageConfigChange('dotProgressiveStages', [...progressiveStages, newStage]);
                        }}
                      >
                        + Add Stage
                      </button>
                    </div>
                </div>
              )}
            </div>
          ) : damageConfig.dotTriggerType === 'trigger' ? (
            <div className="dot-form-row">
              <div className="dot-input-group">
                <label>Effect Duration:</label>
                <div className="dot-input-with-select">
                  <input
                    type="number"
                    value={damageConfig.dotDuration}
                    onChange={(e) => handleDamageConfigChange('dotDuration', parseInt(e.target.value, 10))}
                    min="1"
                    max="10"
                    className="dot-input"
                  />
                  <select
                    value={damageConfig.dotTickType}
                    onChange={(e) => handleDamageConfigChange('dotTickType', e.target.value)}
                    className="dot-select"
                  >
                    <option value="round">Rounds</option>
                    <option value="turn">Turns</option>
                    <option value="minute">Minutes</option>
                    <option value="hour">Hours</option>
                  </select>
                </div>
                <div className="trigger-note">
                  <p>This DoT will be applied when the trigger condition is met. Configure the trigger in the Triggers step.</p>
                  <p>The duration above determines how long the DoT effect lasts after being triggered.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="dot-form-row">
              <div className="dot-input-group">
                <div className="channeled-note">
                  <p>This DoT will be configured in the Channeling step. The formula you've defined here will be available in the channeling configuration.</p>
                  <p>You can define different formulas for each round of channeling in the Channeling step.</p>
                </div>
                <div className="channeled-info">
                  <p>Base DoT Formula: <code>{damageConfig.dotFormula}</code></p>
                </div>
              </div>
            </div>
          )}


        </div>
      )}

      {/* Critical Hit Configuration */}
      <div className="critical-hit-section section">
        <h3>Critical Hit Configuration</h3>
        <CriticalHitConfig
          config={damageConfig.criticalConfig}
          onConfigChange={(critConfig) => handleDamageConfigChange('criticalConfig', critConfig)}
        />
      </div>

      {/* Chance-on-Hit Effects */}
      <div className="chance-on-hit-section section">
        <h3>Chance-on-Hit Effects</h3>
        <ChanceOnHitConfig
          config={damageConfig.chanceOnHitConfig}
          onConfigChange={(procConfig) => handleDamageConfigChange('chanceOnHitConfig', procConfig)}
        />
      </div>

      {/* WoW Classic Tooltip */}
      <Wc3Tooltip
        content={tooltipContent?.content}
        title={tooltipContent?.title}
        icon={tooltipContent?.icon}
        position={mousePos}
        isVisible={showTooltip}
      />
    </div>
  );
};

export default DamageEffects;