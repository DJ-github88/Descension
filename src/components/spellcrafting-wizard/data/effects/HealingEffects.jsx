import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/MechanicsConfig.css';
import '../../styles/effects/ProgressiveEffects.css';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators, ACTION_TYPES, determineWizardFlow } from '../../context/spellWizardContext';
import IconSelectionCard from '../../components/common/IconSelectionCard';
import CriticalHitConfig from '../../components/mechanics/CriticalHitConfig';
import ChanceOnHitConfig from '../../components/mechanics/ChanceOnHitConfig';
import SpellLibraryButton from '../../components/common/SpellLibraryButton';
import Wc3Tooltip from '../../../tooltips/Wc3Tooltip';
import { LIBRARY_SPELLS } from '../../../../data/spellLibraryData';
import '../../styles/CriticalHitConfig.css';
import '../../styles/ChanceOnHitConfig.css';
import VisualCardSelector from '../../components/mechanics/VisualCardSelector';

// Import icons
import {
  FaHeart,
  FaHeartPulse,
  FaShield,
  FaLeaf,
  FaSun,
  FaWater,
  FaChevronDown,
  FaHandHoldingMedical,
  FaCirclePlus,
  FaMoon,
  FaEye,
  FaBurst,
  FaHandFist,
  FaFireFlameSimple
} from 'react-icons/fa6';

// Import older FontAwesome icons for those not in FA6
import {
  FaDice,
  FaGem,
  FaCoins,
  FaDiceD20,
  FaClone
} from 'react-icons/fa';

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

  // Healing Related
  HEA: { name: 'Healing', description: 'Base healing power' },
  HEAL_MOD: { name: 'Healing Modifier', description: 'Percentage boost to healing' },
  CRIT_HEAL: { name: 'Critical Healing', description: 'Critical healing chance' },

  // Resource Stats
  MHP: { name: 'Max HP', description: 'Maximum health points' },
  CHP: { name: 'Current HP', description: 'Current health points' },
  MMP: { name: 'Max MP', description: 'Maximum mana points' },
  CMP: { name: 'Current MP', description: 'Current mana points' },

  // Recovery Stats
  HR: { name: 'Health Regen', description: 'Health regeneration rate' },
  HEALR: { name: 'Healing Received', description: 'Healing received multiplier' },
  HEALP: { name: 'Healing Power', description: 'Healing power multiplier' },

  // Special Variables
  DIVINE: { name: 'Divine Power', description: 'Divine energy for holy spells' },
  NATURE: { name: 'Nature Power', description: 'Nature energy for druidic spells' },
  ARCANE: { name: 'Arcane Power', description: 'Arcane energy for mystic healing' },

  // Round-based Variables
  ROUND: { name: 'Round', description: 'Current round of effect' },
  DURATION: { name: 'Duration', description: 'Total duration of effect' }
};

const VARIABLE_CATEGORIES = {
  'Primary Attributes': ['STR', 'AGI', 'CON', 'INT', 'SPIR', 'CHA'],
  'Healing Stats': ['HEA', 'HEAL_MOD', 'CRIT_HEAL'],
  'Resources': ['MHP', 'CHP', 'MMP', 'CMP'],
  'Recovery': ['HR', 'HEALR', 'HEALP'],
  'Power Sources': ['DIVINE', 'NATURE', 'ARCANE'],
  'Time Variables': ['ROUND', 'DURATION']
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

const HealingEffects = (props) => {
  // Get state and dispatch from context
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  // Get current spell config from props
  const { currentEffect, effectConfig } = props;
  const spellId = state.currentSpellId;

  // Create state for healing config
  const [healingConfig, setHealingConfig] = useState(() => {
    console.log("Initializing healing config with:", state.healingConfig || effectConfig);
    // Get the current healing config from the global state
    const currentHealingConfig = state.healingConfig || {};

    // If we have a complete healingConfig in the global state, use it directly
    if (state.healingConfig && state.healingConfig.healingType) {
      console.log("Using healing config from global state");

      // Make sure hasHotEffect and hasShieldEffect are explicitly set
      // This ensures they're not undefined when we check them later
      return {
        ...state.healingConfig,
        hasHotEffect: state.healingConfig.hasHotEffect === true,
        hasShieldEffect: state.healingConfig.hasShieldEffect === true
      };
    }

    // Otherwise, use the global state values where available, with defaults for missing values
    return {
      healingType: currentHealingConfig.healingType || 'direct',
      resolution: currentHealingConfig.resolution || 'DICE',
      formula: currentHealingConfig.formula || '1d8 + HEA',
      hasHotEffect: currentHealingConfig.hasHotEffect === true,
      hasShieldEffect: currentHealingConfig.hasShieldEffect === true,
      hotFormula: currentHealingConfig.hotFormula || '1d4 + HEA/2',
      hotDuration: currentHealingConfig.hotDuration || 3,
      hotTickType: currentHealingConfig.hotTickType || 'round',
      hotApplication: currentHealingConfig.hotApplication || 'start',
      hotScalingType: currentHealingConfig.hotScalingType || 'flat', // flat, increasing, decreasing, frontloaded, backloaded
      hotTriggerType: currentHealingConfig.hotTriggerType || 'periodic', // periodic, trigger, or channeled
      isProgressiveHot: currentHealingConfig.isProgressiveHot === true, // Flag for progressive HoT
      hotProgressiveStages: currentHealingConfig.hotProgressiveStages || [],
      shieldFormula: currentHealingConfig.shieldFormula || '2d6 + HEA', // Separate formula for shield absorption
      shieldDuration: currentHealingConfig.shieldDuration || 3,
      shieldDamageTypes: currentHealingConfig.shieldDamageTypes || 'all', // all, physical, magical, or specific types
      shieldOverflow: currentHealingConfig.shieldOverflow || 'dissipate', // dissipate, convert_to_healing
      shieldBreakBehavior: currentHealingConfig.shieldBreakBehavior || 'fade',  // fade, shatter
      shieldBreakEffect: currentHealingConfig.shieldBreakEffect || null, // spell effect triggered on shield break
      shieldExpireEffect: currentHealingConfig.shieldExpireEffect || null, // spell effect triggered on shield expiration
      criticalConfig: currentHealingConfig.criticalConfig || {
        enabled: false,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '',
        explodingDice: false,
        critEffects: [],
        cardCritRule: 'face_cards',
        coinCritRule: 'all_heads',
        coinCount: 3,
        spellEffect: null
      },
      chanceOnHitConfig: currentHealingConfig.chanceOnHitConfig || {
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

  // Set selected resolution from healing config
  const [currentResolution, setCurrentResolution] = useState(() => {
    // Use the resolution from healingConfig if available
    return healingConfig.resolution || 'DICE';
  });

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

        {/* Healing type information */}
        {data.healingType && (
          <div className="tooltip-effect">
            <span className="tooltip-gold">Healing Type:</span> {formatHealingType(data.healingType)}
          </div>
        )}

        {/* Formula information if applicable */}
        {data.formula && (
          <div className="tooltip-effect">
            <span className="tooltip-gold">Formula:</span> {data.formula}
          </div>
        )}

        {/* Duration information if applicable */}
        {data.duration && (
          <div className="tooltip-casttime">
            <span className="tooltip-gold">Duration:</span> {data.duration} {data.durationUnit || 'rounds'}
          </div>
        )}

        {/* Healing mechanics information */}
        {data.healingType && (
          <>
            <div className="tooltip-divider"></div>
            <div className="tooltip-section-header">Healing Properties:</div>
            <div className="tooltip-option">
              <span className="tooltip-bullet"></span>
              <span className="tooltip-gold">Affected by:</span> {getHealingAffectedBy(data.healingType)}
            </div>
            {data.healingType === 'hot' && (
              <div className="tooltip-option">
                <span className="tooltip-bullet"></span>
                <span className="tooltip-gold">Ticks:</span> Every round for duration
              </div>
            )}
            {data.healingType === 'shield' && (
              <div className="tooltip-option">
                <span className="tooltip-bullet"></span>
                <span className="tooltip-gold">Absorbs:</span> Damage up to shield value
              </div>
            )}
          </>
        )}

        {/* Resolution method information */}
        {data.resolutionMethod && (
          <>
            <div className="tooltip-divider"></div>
            <div className="tooltip-casttime">
              <span className="tooltip-gold">Resolution:</span> {formatResolutionMethod(data.resolutionMethod)}
            </div>
          </>
        )}

        {/* Flavor text based on healing type */}
        <div className="tooltip-divider"></div>
        <div className="tooltip-flavor-text">
          {getHealingFlavorText(data.healingType || healingConfig.healingType)}
        </div>
      </div>
    );

    // Store the tooltip data including title and icon
    setTooltipContent({
      content: tooltipContent,
      title: data.title || data.name,
      icon: data.icon || getHealingTypeIcon(data.healingType)
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

  // Format healing type for display
  const formatHealingType = (type) => {
    if (!type) return '';

    switch (type) {
      case 'direct': return 'Direct Healing';
      case 'hot': return 'Healing Over Time';
      case 'shield': return 'Absorption Shield';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Format resolution method for display
  const formatResolutionMethod = (method) => {
    if (!method) return 'Standard';

    switch (method) {
      case 'DICE': return 'Dice Rolls';
      case 'CARDS': return 'Card Draw';
      case 'FIXED': return 'Fixed Value';
      default: return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
    }
  };

  // Get what affects the healing type
  const getHealingAffectedBy = (type) => {
    if (!type) return 'Healing Power';

    switch (type) {
      case 'direct': return 'Healing Power, Wisdom';
      case 'hot': return 'Healing Power, Spirit';
      case 'shield': return 'Healing Power, Intelligence';
      default: return 'Healing Power';
    }
  };

  // Get icon for healing type
  const getHealingTypeIcon = (type) => {
    if (!type) return 'spell_holy_heal';

    switch (type) {
      case 'direct': return 'spell_holy_heal';
      case 'hot': return 'spell_holy_renew';
      case 'shield': return 'spell_holy_powerwordshield';
      default: return 'spell_holy_heal';
    }
  };

  // Get flavor text based on healing type
  const getHealingFlavorText = (type) => {
    if (!type) return '"Restorative energies flow through your allies."';

    switch (type) {
      case 'direct': return '"Your magic mends wounds and restores vitality in an instant."';
      case 'hot': return '"A continuous stream of healing energy flows through the target over time."';
      case 'shield': return '"A protective barrier absorbs incoming damage before it can harm the target."';
      default: return '"Restorative energies flow through your allies."';
    }
  };

  // Initialize state for formula examples
  const [formulaExamples, setFormulaExamples] = useState([]);
  const [hotFormulaExamples, setHotFormulaExamples] = useState([]);
  const [shieldFormulaExamples, setShieldFormulaExamples] = useState([]);

  // State for card selection
  const [activeSuit, setActiveSuit] = useState('hearts');
  const [selectedCards, setSelectedCards] = useState([]);
  const [drawCount, setDrawCount] = useState(healingConfig.drawCount || 3);

  // Helper function to get default formula
  const getDefaultFormula = (resolutionType) => {
    switch (resolutionType) {
      case 'DICE':
        return `2d8 + HEA`;
      case 'CARDS':
        return `CARD_VALUE + HEA`;
      case 'COINS':
        return `HEADS_COUNT * 8 + HEA`;
      default:
        return `2d8 + HEA`;
    }
  };

  // Get default HoT formula
  const getDefaultHotFormula = (resolutionType) => {
    switch (resolutionType) {
      case 'DICE':
        return `1d4 + HEA/2`;
      case 'CARDS':
        return `CARD_VALUE/2 + HEA/2`;
      case 'COINS':
        return `HEADS_COUNT * 3 + HEA/3`;
      default:
        return `1d4 + HEA/2`;
    }
  };

  // Get default Shield formula
  const getDefaultShieldFormula = (resolutionType) => {
    switch (resolutionType) {
      case 'DICE':
        return `2d6 + HEA`;
      case 'CARDS':
        return `CARD_VALUE + HEA*1.5`;
      case 'COINS':
        return `HEADS_COUNT * 10 + HEA`;
      default:
        return `2d6 + HEA`;
    }
  };

  // Handler for healing configuration changes
  const handleHealingConfigChange = (field, value) => {
    console.log(`Updating healing config: ${field} = ${value}`);

    // Create a new config object with the updated field
    const newConfig = {
      ...healingConfig,
      [field]: value
    };

    // Update the local state
    setHealingConfig(newConfig);

    // Always update effect config in spell wizard context, regardless of spellId or currentEffect
    console.log("Dispatching healing config update with:", newConfig);
    dispatch(actionCreators.updateHealingConfig(newConfig));

    // If we're updating the trigger type for HoT, update the spell's trigger configuration
    if (field === 'hotTriggerType' && value === 'trigger') {
      // Create a trigger configuration for the spell's trigger system
      const spellTriggerConfig = {
        triggerId: 'hot_trigger',
        parameters: {},
        targetEntity: 'target',
        effectType: 'hot'
      };

      // Update the spell's trigger configuration
      dispatch(actionCreators.updateTriggerConfig({
        ...state.triggerConfig,
        hotTrigger: spellTriggerConfig
      }));
    }

    // Special handling for healing type changes to ensure proper state updates
    if (field === 'healingType') {
      // If changing to direct healing, make sure we reset the HoT and Shield flags
      if (value === 'direct') {
        // We already updated the healingType in the newConfig above
        // Now we need to make sure the additional effects are properly reset
        if (newConfig.hasHotEffect || newConfig.hasShieldEffect) {
          const updatedConfig = {
            ...newConfig,
            hasHotEffect: false,
            hasShieldEffect: false
          };
          setHealingConfig(updatedConfig);
          dispatch(actionCreators.updateHealingConfig(updatedConfig));
        }
      }
      // If changing to HoT, make sure we reset the Shield flag
      else if (value === 'hot') {
        if (newConfig.hasShieldEffect) {
          const updatedConfig = {
            ...newConfig,
            hasShieldEffect: false
          };
          setHealingConfig(updatedConfig);
          dispatch(actionCreators.updateHealingConfig(updatedConfig));
        }
      }
      // If changing to Shield, make sure we reset the HoT flag
      else if (value === 'shield') {
        if (newConfig.hasHotEffect) {
          const updatedConfig = {
            ...newConfig,
            hasHotEffect: false
          };
          setHealingConfig(updatedConfig);
          dispatch(actionCreators.updateHealingConfig(updatedConfig));
        }
      }
    }
  };

  // Update formula examples based on resolution
  const updateFormulaExamples = (resolutionType) => {
    if (resolutionType === 'DICE') {
      setFormulaExamples([
        {
          name: 'Minor Healing',
          formula: `1d8 + HEA`,
          description: 'Light healing for minor wounds'
        },
        {
          name: 'Moderate Healing',
          formula: `2d8 + HEA*1.2`,
          description: 'Standard healing spell'
        },
        {
          name: 'Major Healing',
          formula: `3d8 + HEA*1.5`,
          description: 'Powerful healing'
        },
        {
          name: 'Critical Care',
          formula: `4d8 + HEA*2`,
          description: 'Emergency healing for dire situations'
        }
      ]);

      // Update HoT formula examples
      setHotFormulaExamples([
        {
          name: 'Steady Regeneration',
          formula: `1d4 + HEA/2`,
          description: 'Consistent healing each round'
        },
        {
          name: 'Growing Renewal',
          formula: `1d4 + (HEA/2) * (ROUND/DURATION + 0.5)`,
          description: 'Healing increases each round'
        },
        {
          name: 'Diminishing Flow',
          formula: `2d4 + (HEA/2) * ((DURATION-ROUND+1)/DURATION + 0.5)`,
          description: 'Stronger initial heal that diminishes'
        },
        {
          name: 'Pulsing Restoration',
          formula: `(ROUND % 2 == 1 ? 2d4 : 1d4) + HEA/2`,
          description: 'Alternates between stronger and weaker healing'
        }
      ]);

      // Update Shield formula examples
      setShieldFormulaExamples([
        {
          name: 'Basic Ward',
          formula: `2d6 + HEA`,
          description: 'Standard protection shield'
        },
        {
          name: 'Reinforced Barrier',
          formula: `3d6 + HEA*1.3`,
          description: 'Stronger shield'
        },
        {
          name: 'Adaptive Protection',
          formula: `2d8 + HEA + CON/2`,
          description: 'Shield that scales with constitution'
        },
        {
          name: 'Reflective Shield',
          formula: `3d6 + HEA + (CHP < MHP/2 ? HEA : 0)`,
          description: "Shield that's stronger when health is low"
        }
      ]);
    } else if (resolutionType === 'CARDS') {
      setFormulaExamples([
        {
          name: 'Card Healing',
          formula: `CARD_VALUE + HEA`,
          description: 'Basic card-based healing'
        },
        {
          name: 'Royal Recovery',
          formula: `CARD_VALUE + (FACE_CARDS * 8) + HEA`,
          description: 'Bonus healing on face cards'
        },
        {
          name: 'Suit Synergy',
          formula: `CARD_VALUE * (SAME_SUIT ? 1.5 : 1) + HEA`,
          description: '50% more healing if all cards are same suit'
        },
        {
          name: 'Hearts Harmony',
          formula: `CARD_VALUE + (HEARTS_COUNT * 3) + HEA`,
          description: 'Bonus healing for each heart card drawn'
        }
      ]);

      // Update HoT formula examples
      setHotFormulaExamples([
        {
          name: 'Card Restoration',
          formula: `CARD_VALUE/2 + HEA/2`,
          description: 'Card-based healing over time'
        },
        {
          name: 'Suit Blessing',
          formula: `(SAME_SUIT ? CARD_VALUE/1.5 : CARD_VALUE/2) + HEA/2`,
          description: 'Better healing with matching suit'
        },
        {
          name: 'Royal Rejuvenation',
          formula: `FACE_CARDS * 3 + HEA/2`,
          description: 'Healing based on face cards drawn'
        },
        {
          name: 'Hearts Renewal',
          formula: `(HEARTS_COUNT * 2) + HEA/2 + ROUND`,
          description: 'Healing that scales with heart cards and increases each round'
        }
      ]);

      // Update Shield formula examples
      setShieldFormulaExamples([
        {
          name: 'Card Barrier',
          formula: `CARD_VALUE + HEA*1.5`,
          description: 'Card-based protection shield'
        },
        {
          name: 'Royal Guard',
          formula: `CARD_VALUE + (FACE_CARDS * 5) + HEA`,
          description: 'Shield that scales with face cards drawn'
        },
        {
          name: 'Suit Ward',
          formula: `CARD_VALUE * (SAME_SUIT ? 1.5 : 1) + HEA*1.2`,
          description: 'Stronger shield if all cards are same suit'
        },
        {
          name: 'Spades Defense',
          formula: `CARD_VALUE + (SPADES_COUNT * 5) + HEA`,
          description: 'Shield that scales with spade cards drawn'
        }
      ]);
    } else if (resolutionType === 'COINS') {
      setFormulaExamples([
        {
          name: 'Fortune Heal',
          formula: `HEADS_COUNT * 8 + HEA`,
          description: 'Healing based on coin flips'
        },
        {
          name: 'Luck Recovery',
          formula: `(HEADS_RATIO > 0.5 ? 15 : 5) + HEA*1.2`,
          description: 'Better healing with more heads than tails'
        },
        {
          name: 'Blessed Healing',
          formula: `ALL_HEADS ? 25 + HEA*2 : HEADS_COUNT*5 + HEA`,
          description: 'Massive healing on all heads'
        },
        {
          name: 'Misfortune Turning',
          formula: `ALL_TAILS ? HEA*0.5 : HEADS_COUNT*7 + HEA`,
          description: 'Reduced healing on all tails'
        }
      ]);

      // Update HoT formula examples
      setHotFormulaExamples([
        {
          name: 'Fortune Flow',
          formula: `HEADS_COUNT*2 + HEA/3`,
          description: 'Coin-based healing over time'
        },
        {
          name: 'Fate\'s Blessing',
          formula: `(HEADS_RATIO > 0.5 ? 3 : 1) * ROUND + HEA/3`,
          description: 'Healing that scales with heads ratio and rounds'
        },
        {
          name: 'Lucky Renewal',
          formula: `HEADS_COUNT * 1.5 + (ALL_HEADS ? HEA : HEA/2)`,
          description: 'More healing power with all heads'
        },
        {
          name: 'Balance Restoration',
          formula: `(HEADS_COUNT == TAILS_COUNT ? 10 : HEADS_COUNT * 2) + HEA/3`,
          description: 'Maximum healing when coins are perfectly balanced'
        }
      ]);

      // Update Shield formula examples
      setShieldFormulaExamples([
        {
          name: 'Fortune Shield',
          formula: `HEADS_COUNT * 10 + HEA`,
          description: 'Coin-based protection shield'
        },
        {
          name: 'Lucky Ward',
          formula: `(HEADS_RATIO > 0.7 ? 30 : HEADS_COUNT * 5) + HEA`,
          description: 'Stronger shield with high heads ratio'
        },
        {
          name: 'Blessed Barrier',
          formula: `ALL_HEADS ? 50 + HEA*2 : HEADS_COUNT*8 + HEA`,
          description: 'Massive shield on all heads'
        },
        {
          name: 'Fate Shield',
          formula: `(LONGEST_STREAK > 2 ? LONGEST_STREAK * 10 : HEADS_COUNT * 5) + HEA`,
          description: 'Shield that rewards streaks of same result'
        }
      ]);
    }
  };

  // Handler for resolution change
  const handleResolutionChange = (resolutionId) => {
    setCurrentResolution(resolutionId);
    handleHealingConfigChange('resolution', resolutionId);

    // Update formula examples for new resolution
    updateFormulaExamples(resolutionId);

    // Set new default formulas based on resolution
    let newFormula = getDefaultFormula(resolutionId);
    let newHotFormula = getDefaultHotFormula(resolutionId);
    let newShieldFormula = getDefaultShieldFormula(resolutionId);

    // Always update formulas when resolution changes
    handleHealingConfigChange('formula', newFormula);
    handleHealingConfigChange('hotFormula', newHotFormula);
    handleHealingConfigChange('shieldFormula', newShieldFormula);

    // Also update the spell's main resolution in the wizard state
    // There's no direct updateSpellState action, so we need to use a different approach
    // We'll add a resolution property to the healingConfig instead
    handleHealingConfigChange('globalResolution', resolutionId);
  };

  // Synchronize local state with global state when component mounts or global state changes
  useEffect(() => {
    // Only update if there's a valid healingConfig in the global state
    if (state.healingConfig) {
      console.log("Syncing local state with global state:", state.healingConfig);

      // Make sure we have boolean values for hasHotEffect and hasShieldEffect
      const globalHotEffect = state.healingConfig.hasHotEffect === true;
      const globalShieldEffect = state.healingConfig.hasShieldEffect === true;

      // Check if the healing config has changed
      const hasHealingTypeChanged = state.healingConfig.healingType !== healingConfig.healingType;
      const hasHotEffectChanged = globalHotEffect !== healingConfig.hasHotEffect;
      const hasShieldEffectChanged = globalShieldEffect !== healingConfig.hasShieldEffect;
      const hasResolutionChanged = state.healingConfig.resolution !== currentResolution;

      // Log the changes for debugging
      if (hasHealingTypeChanged) {
        console.log("Healing type changed from", healingConfig.healingType, "to", state.healingConfig.healingType);
      }
      if (hasHotEffectChanged) {
        console.log("HoT effect changed from", healingConfig.hasHotEffect, "to", globalHotEffect);
      }
      if (hasShieldEffectChanged) {
        console.log("Shield effect changed from", healingConfig.hasShieldEffect, "to", globalShieldEffect);
      }
      if (hasResolutionChanged) {
        console.log("Resolution changed from", currentResolution, "to", state.healingConfig.resolution);
      }

      // If any important properties have changed, update the local state
      if (hasHealingTypeChanged || hasHotEffectChanged || hasShieldEffectChanged) {
        console.log("Healing config has changed, updating local state");
        setHealingConfig(prevConfig => ({
          ...prevConfig,
          healingType: state.healingConfig.healingType,
          hasHotEffect: globalHotEffect,
          hasShieldEffect: globalShieldEffect
        }));
      }

      // Also update the resolution state if it's different
      if (hasResolutionChanged) {
        setCurrentResolution(state.healingConfig.resolution || 'DICE');
      }
    }
  }, [state.healingConfig, healingConfig.healingType, healingConfig.hasHotEffect, healingConfig.hasShieldEffect, currentResolution]);

  // Initialize component when it mounts
  useEffect(() => {
    // If we have a global healing config, make sure our local state is in sync
    if (state.healingConfig) {
      console.log("Component mounted, initializing from global state:", state.healingConfig);
      console.log("Current healing type:", state.healingConfig.healingType);
      console.log("Has HoT effect:", state.healingConfig.hasHotEffect === true);
      console.log("Has Shield effect:", state.healingConfig.hasShieldEffect === true);

      // Make sure we have boolean values for hasHotEffect and hasShieldEffect
      // and preserve all other properties from the global state
      const updatedConfig = {
        ...state.healingConfig,
        hasHotEffect: state.healingConfig.hasHotEffect === true,
        hasShieldEffect: state.healingConfig.hasShieldEffect === true
      };

      // Update local state with the global state
      setHealingConfig(updatedConfig);
      setCurrentResolution(state.healingConfig.resolution || 'DICE');

      // Also update the global state to ensure the boolean values are properly set
      dispatch(actionCreators.updateHealingConfig(updatedConfig));

      // Set up trigger configurations for HoT and Shield if they're enabled
      if (updatedConfig.hasHotEffect) {
        // Create a trigger configuration for HoT
        const hotTriggerConfig = {
          triggerId: 'hot_trigger',
          parameters: {},
          targetEntity: 'target',
          effectType: 'hot'
        };

        // Update the spell's trigger configuration
        dispatch(actionCreators.updateTriggerConfig({
          ...state.triggerConfig,
          hotTrigger: hotTriggerConfig
        }));
      }

      if (updatedConfig.hasShieldEffect) {
        // Create a trigger configuration for Shield
        const shieldTriggerConfig = {
          triggerId: 'shield_trigger',
          parameters: {},
          targetEntity: 'target',
          effectType: 'shield'
        };

        // Update the spell's trigger configuration
        dispatch(actionCreators.updateTriggerConfig({
          ...state.triggerConfig,
          shieldTrigger: shieldTriggerConfig
        }));
      }
    } else {
      console.log("Component mounted, but no global healing config found");
    }
  }, []);  // Empty dependency array means this runs once on mount

  // Set up formula examples when resolution changes
  useEffect(() => {
    updateFormulaExamples(currentResolution);
  }, [currentResolution]);

  // Handler for formula change
  const handleFormulaChange = (value) => {
    handleHealingConfigChange('formula', value);
  };

  // Handler for hot formula change
  const handleHotFormulaChange = (value) => {
    handleHealingConfigChange('hotFormula', value);
  };

  // Handler for shield formula change
  const handleShieldFormulaChange = (value) => {
    handleHealingConfigChange('shieldFormula', value);
  };

  // Apply formula example
  const applyFormulaExample = (formula) => {
    handleFormulaChange(formula);
  };

  // Apply a HoT formula example
  const applyHotFormulaExample = (formula) => {
    handleHotFormulaChange(formula);
  };

  // Apply a Shield formula example
  const applyShieldFormulaExample = (formula) => {
    handleShieldFormulaChange(formula);
  };

  // Handler for healing type change
  const handleHealingTypeChange = (healingType) => {
    console.log(`Changing healing type from ${healingConfig.healingType} to ${healingType}`);

    // Create a new config object with the updated healingType
    // but preserve all other properties, especially hasHotEffect and hasShieldEffect
    const newConfig = {
      ...healingConfig,
      healingType: healingType
    };

    // Update local state
    setHealingConfig(newConfig);

    // Update global state with the complete config
    // This ensures all properties are preserved
    dispatch(actionCreators.updateHealingConfig(newConfig));

    // Log the update for debugging
    console.log("Updated healing config:", newConfig);
  };

  // Handler for toggling HoT effect
  const toggleHotEffect = () => {
    const newValue = !healingConfig.hasHotEffect;
    console.log("Toggling HoT effect from", healingConfig.hasHotEffect, "to", newValue);

    // Create a new config object with the updated hasHotEffect property
    const newConfig = {
      ...healingConfig,
      hasHotEffect: newValue
    };

    // Update local state
    setHealingConfig(newConfig);

    // Update global state with the complete config
    // This ensures all properties are preserved
    dispatch(actionCreators.updateHealingConfig(newConfig));

    // If enabling HoT, update the spell's trigger configuration to include HoT
    if (newValue) {
      // Create a trigger configuration for the spell's trigger system
      const spellTriggerConfig = {
        triggerId: 'hot_trigger',
        parameters: {},
        targetEntity: 'target',
        effectType: 'hot'
      };

      // Update the spell's trigger configuration
      dispatch(actionCreators.updateTriggerConfig({
        ...state.triggerConfig,
        hotTrigger: spellTriggerConfig
      }));
    }

    // Log the update for debugging
    console.log("Updated healing config:", newConfig);
  };

  // Handler for toggling Shield effect
  const toggleShieldEffect = () => {
    const newValue = !healingConfig.hasShieldEffect;
    console.log("Toggling Shield effect from", healingConfig.hasShieldEffect, "to", newValue);

    // Create a new config object with the updated hasShieldEffect property
    const newConfig = {
      ...healingConfig,
      hasShieldEffect: newValue
    };

    // Update local state
    setHealingConfig(newConfig);

    // Update global state with the complete config
    // This ensures all properties are preserved
    dispatch(actionCreators.updateHealingConfig(newConfig));

    // If enabling Shield, update the spell's trigger configuration to include Shield
    if (newValue) {
      // Create a trigger configuration for the spell's trigger system
      const spellTriggerConfig = {
        triggerId: 'shield_trigger',
        parameters: {},
        targetEntity: 'target',
        effectType: 'shield'
      };

      // Update the spell's trigger configuration
      dispatch(actionCreators.updateTriggerConfig({
        ...state.triggerConfig,
        shieldTrigger: spellTriggerConfig
      }));
    }

    // Log the update for debugging
    console.log("Updated healing config:", newConfig);
  };

  // Update the dice display to be interactive with the formula and add complex formula examples
  const addDiceToFormula = (diceType) => {
    const newFormula = healingConfig.formula
      ? `${healingConfig.formula} + 1${diceType}`
      : `1${diceType}`;
    handleHealingConfigChange('formula', newFormula);
  };

  const getComplexFormulaExamples = () => {
    switch (currentResolution) {
      case 'DICE':
        return [
          {
            name: 'Empowered Healing',
            formula: `2d8 + HEA*1.5`,
            description: 'Boosted healing power'
          },
          {
            name: 'Critical Recovery',
            formula: `3d8 + (CHP < MHP/3 ? HEA*2 : HEA)`,
            description: 'Stronger healing when target is below 33% health'
          },
          {
            name: 'Adaptive Restoration',
            formula: `2d6 + MAX(INT, SPIR)*0.8 + HEA`,
            description: 'Uses your highest mental stat for bonus healing'
          },
          {
            name: 'Merciful Blessing',
            formula: `4d6 + HEA*(MHP-CHP)/MHP*2`,
            description: 'Healing scales with how badly wounded the target is'
          },
          {
            name: 'Mana Conversion',
            formula: `2d8 + HEA*(CMP/MMP + 0.5)`,
            description: 'Healing is stronger with higher mana'
          },
          {
            name: 'Life Bond',
            formula: `3d8 + HEA + (CHP > MHP/2 ? CHP/10 : 0)`,
            description: 'Sacrifice your own health for bonus healing'
          },
          {
            name: 'Resonant Restoration',
            formula: `2d8 + HEA + (CRIT_HEAL > 15 ? 2d6 : 0)`,
            description: 'Chance for critical healing based on crit rating'
          }
        ];
      case 'CARDS':
        return [
          {
            name: 'Hearts Blessing',
            formula: `CARD_VALUE + (HEARTS_COUNT * 5) + HEA`,
            description: 'Bonus healing for each heart card drawn'
          },
          {
            name: 'Royal Restoration',
            formula: `CARD_VALUE + (FACE_CARDS * 8) + HEA + (ROYAL_FLUSH ? 50 : 0)`,
            description: 'Major boost with royal flush'
          },
          {
            name: 'Pairs Recovery',
            formula: `CARD_VALUE + (PAIRS * 10) + HEA`,
            description: 'Bonus healing for each pair drawn'
          },
          {
            name: 'Flush Mending',
            formula: `CARD_VALUE * (FLUSH ? 2 : 1) + HEA`,
            description: 'Double healing with a flush'
          },
          {
            name: 'Sequential Healing',
            formula: `CARD_VALUE + (STRAIGHT ? 25 : 0) + HEA`,
            description: 'Bonus healing with sequential cards'
          },
          {
            name: 'Balanced Harmony',
            formula: `CARD_VALUE + (RED_COUNT == BLACK_COUNT ? 20 : 0) + HEA`,
            description: 'Bonus when red and black cards are balanced'
          }
        ];
      case 'COINS':
        return [
          {
            name: 'Divine Fortune',
            formula: `HEADS_COUNT * 10 + HEA*(HEADS_RATIO)`,
            description: 'Healing scales with heads ratio'
          },
          {
            name: 'Balanced Blessing',
            formula: `(HEADS_COUNT == TAILS_COUNT ? 30 : HEADS_COUNT * 5) + HEA`,
            description: 'Major boost when heads and tails are balanced'
          },
          {
            name: 'Fate\'s Embrace',
            formula: `HEADS_COUNT * 8 * (ALL_SAME ? 3 : 1) + HEA`,
            description: 'Triple healing when all coins show the same face'
          },
          {
            name: 'Pattern Recognition',
            formula: `HEADS_COUNT * 5 + HEA + ((ALTERNATING_PATTERN && TOTAL_FLIPS > 3) ? 20 : 0)`,
            description: 'Bonus for alternating heads-tails pattern'
          },
          {
            name: 'Streak Blessing',
            formula: `HEADS_COUNT * 7 + (LONGEST_STREAK > 2 ? LONGEST_STREAK * 5 : 0) + HEA`,
            description: 'Bonus healing for streaks of the same result'
          },
          {
            name: 'Golden Ratio',
            formula: `HEADS_COUNT * 8 + HEA + (HEADS_RATIO > 0.618 && HEADS_RATIO < 0.619 ? 50 : 0)`,
            description: 'Max power when heads ratio is golden ratio'
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
      let updatedFormula = healingConfig.formula || '';

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
  const createDefaultFormula = (resolutionType) => {
    return getDefaultFormula(resolutionType);
  };

  // Add state for formula help visibility
  const [showFormulaHelp, setShowFormulaHelp] = useState(false);

  // Render complex formula examples
  const renderComplexFormulaExamples = () => {
    return (
      <div className="complex-examples">
        <h4>Complex Formula Examples</h4>
        <div className="example-cards">
          {getComplexFormulaExamples().map((example, index) => (
            <div key={index} className="example-card" onClick={() => {
              if (healingConfig.healingType === 'direct') {
                handleFormulaChange(example.formula);
              } else if (healingConfig.healingType === 'hot') {
                handleHotFormulaChange(example.formula);
              } else {
                // Both direct healing and shield use the same formula
                handleFormulaChange(example.formula);
              }
            }}>
              <h5>{example.name}</h5>
              <div className="example-formula">{example.formula}</div>
              <p>{example.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main render function
  return (
    <div className="healing-effects-container">
      {/* First section: Healing Type Selection */}
      <div className="healing-type-selection section">
        <h3>Primary Healing Method</h3>
        <div className="card-selection-grid">
          <IconSelectionCard
            icon={<FaHeart className="icon" />}
            title="Direct Healing"
            description="Heals target immediately in a single burst"
            onClick={() => handleHealingTypeChange('direct')}
            selected={healingConfig.healingType === 'direct'}
            onMouseEnter={(e) => handleMouseEnter({name: 'Direct Healing', description: 'Heals target immediately in a single burst', healingType: 'direct', icon: 'spell_holy_heal'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <IconSelectionCard
            icon={<FaHeartPulse className="icon" />}
            title="Healing Over Time"
            description="Applies healing over multiple rounds or turns"
            onClick={() => handleHealingTypeChange('hot')}
            selected={healingConfig.healingType === 'hot'}
            onMouseEnter={(e) => handleMouseEnter({name: 'Healing Over Time', description: 'Applies healing over multiple rounds or turns', healingType: 'hot', icon: 'spell_holy_renew'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <IconSelectionCard
            icon={<FaShield className="icon" />}
            title="Absorption Shield"
            description="Creates a barrier that absorbs incoming damage"
            onClick={() => handleHealingTypeChange('shield')}
            selected={healingConfig.healingType === 'shield'}
            onMouseEnter={(e) => handleMouseEnter({name: 'Absorption Shield', description: 'Creates a barrier that absorbs incoming damage', healingType: 'shield', icon: 'spell_holy_powerwordshield'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
        </div>

        {/* Secondary Healing Effects */}
        {healingConfig.healingType === 'direct' && (
          <div className="secondary-healing-effects">
            <h3>Additional Effects</h3>
            <div className="card-selection-grid">
              <IconSelectionCard
                icon={<FaHeartPulse className="icon" />}
                title="Add Healing Over Time"
                description="Also applies healing over multiple rounds"
                onClick={toggleHotEffect}
                selected={healingConfig.hasHotEffect}
                onMouseEnter={(e) => handleMouseEnter({name: 'Add Healing Over Time', description: 'Adds a healing over time component to your direct healing spell', healingType: 'combined', icon: 'spell_holy_divineprovidence'}, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
              <IconSelectionCard
                icon={<FaShield className="icon" />}
                title="Add Absorption Shield"
                description="Also creates a protective barrier"
                onClick={toggleShieldEffect}
                selected={healingConfig.hasShieldEffect}
                onMouseEnter={(e) => handleMouseEnter({name: 'Add Absorption Shield', description: 'Adds a protective shield component to your direct healing spell', healingType: 'combined', icon: 'spell_holy_divineaegis'}, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
            </div>
          </div>
        )}

        {healingConfig.healingType === 'hot' && (
          <div className="secondary-healing-effects">
            <h3>Additional Effects</h3>
            <div className="card-selection-grid">
              <IconSelectionCard
                icon={<FaShield className="icon" />}
                title="Add Absorption Shield"
                description="Also creates a protective barrier"
                onClick={toggleShieldEffect}
                selected={healingConfig.hasShieldEffect}
                onMouseEnter={(e) => handleMouseEnter({name: 'Add Absorption Shield', description: 'Adds a protective shield component to your healing over time spell', healingType: 'combined', icon: 'spell_holy_divineaegis'}, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
            </div>
          </div>
        )}

        {healingConfig.healingType === 'shield' && (
          <div className="secondary-healing-effects">
            <h3>Additional Effects</h3>
            <div className="card-selection-grid">
              <IconSelectionCard
                icon={<FaHeartPulse className="icon" />}
                title="Add Healing Over Time"
                description="Also applies healing over multiple rounds"
                onClick={toggleHotEffect}
                selected={healingConfig.hasHotEffect}
                onMouseEnter={(e) => handleMouseEnter({name: 'Add Healing Over Time', description: 'Adds a healing over time component to your shield spell', healingType: 'combined', icon: 'spell_holy_divineprovidence'}, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
            </div>
          </div>
        )}
      </div>

      {/* Second section: Resolution Method Selection */}
      <div className="resolution-selector section">
        <h3>Resolution Method</h3>
        <div className="resolution-options">
          <button
            className={`resolution-option ${currentResolution === 'DICE' ? 'active' : ''}`}
            onClick={() => handleResolutionChange('DICE')}
            onMouseEnter={(e) => handleMouseEnter({name: 'Dice Resolution', description: 'Use dice rolls to determine healing amounts', icon: 'inv_misc_dice_01', resolutionMethod: 'DICE'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <FaDiceD20 className="resolution-icon" />
            <span>Dice</span>
          </button>
          <button
            className={`resolution-option ${currentResolution === 'CARDS' ? 'active' : ''}`}
            onClick={() => handleResolutionChange('CARDS')}
            onMouseEnter={(e) => handleMouseEnter({name: 'Card Resolution', description: 'Use cards to determine healing amounts', icon: 'inv_misc_ticket_tarot_deck_01', resolutionMethod: 'CARDS'}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <FaClone className="resolution-icon" />
            <span>Cards</span>
          </button>
          <button
            className={`resolution-option ${currentResolution === 'COINS' ? 'active' : ''}`}
            onClick={() => handleResolutionChange('COINS')}
            onMouseEnter={(e) => handleMouseEnter({name: 'Coin Resolution', description: 'Use coin flips to determine healing amounts', icon: 'inv_misc_coin_01', resolutionMethod: 'COINS'}, e)}
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
                <p>Healing is calculated using dice rolls with the formula: <code>{healingConfig.formula}</code></p>
                <p className="interaction-hint">Click on a die to add it to your formula</p>
              </div>
              <div className="dice-stats">
                <div className="stat-item">
                  <div className="stat-label">Minimum</div>
                  <div className="stat-value">{parseDiceNotation(healingConfig.formula) ? getMinRoll(healingConfig.formula) : 'N/A'}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Average</div>
                  <div className="stat-value">{parseDiceNotation(healingConfig.formula) ? getAverageRoll(healingConfig.formula) : 'N/A'}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Maximum</div>
                  <div className="stat-value">{parseDiceNotation(healingConfig.formula) ? getMaxRoll(healingConfig.formula) : 'N/A'}</div>
                </div>
              </div>
              <div className="dice-visuals">
                <div
                  className="die d4"
                  onClick={() => addDiceToFormula('d4')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Four-sided Die', description: 'Add a d4 to your healing formula', icon: 'inv_misc_dice_01'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d4</div>
                <div
                  className="die d6"
                  onClick={() => addDiceToFormula('d6')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Six-sided Die', description: 'Add a d6 to your healing formula', icon: 'inv_misc_dice_02'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d6</div>
                <div
                  className="die d8"
                  onClick={() => addDiceToFormula('d8')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Eight-sided Die', description: 'Add a d8 to your healing formula', icon: 'inv_misc_dice_03'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d8</div>
                <div
                  className="die d10"
                  onClick={() => addDiceToFormula('d10')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Ten-sided Die', description: 'Add a d10 to your healing formula', icon: 'inv_misc_dice_04'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d10</div>
                <div
                  className="die d12"
                  onClick={() => addDiceToFormula('d12')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Twelve-sided Die', description: 'Add a d12 to your healing formula', icon: 'inv_misc_dice_05'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d12</div>
                <div
                  className="die d20"
                  onClick={() => addDiceToFormula('d20')}
                  onMouseEnter={(e) => handleMouseEnter({name: 'Twenty-sided Die', description: 'Add a d20 to your healing formula', icon: 'inv_misc_dice_06'}, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >d20</div>
              </div>
            </div>
          )}

          {currentResolution === 'CARDS' && (
            <div className="card-display">
              <div className="card-info">
                <h4>Card Healing Formula</h4>
                <p>
                  Build a formula using playing cards. Select specific cards to add bonuses to your formula.
                  <code>{healingConfig.formula || 'CARD_VALUE + HEA'}</code>
                </p>
              </div>

              {/* Draw Count Selector */}
              <div className="draw-count-selector">
                <label htmlFor="draw-count">Cards Drawn Per Healing:</label>
                <div className="draw-count-controls">
                  <button
                    className="draw-count-button"
                    onClick={() => setDrawCount(Math.max(1, drawCount - 1))}
                    disabled={drawCount <= 1}
                    onMouseEnter={(e) => handleMouseEnter({name: 'Decrease Draw Count', description: 'Draw fewer cards per healing', icon: 'inv_misc_ticket_tarot_card'}, e)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
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
                    onMouseEnter={(e) => handleMouseEnter({name: 'Increase Draw Count', description: 'Draw more cards per healing', icon: 'inv_misc_ticket_tarot_cards'}, e)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                  >+</button>
                </div>
                <div className="draw-count-info">
                  <p>Each healing draws {drawCount} card{drawCount !== 1 ? 's' : ''} from the deck</p>
                </div>
              </div>

              <div className="card-variables">
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;
                  const newFormula = formula ? `${formula} + CARD_VALUE` : 'CARD_VALUE';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <div className="variable-name">CARD_VALUE</div>
                  <div className="variable-desc">Sum of all card values (Ace=1/14, J=11, Q=12, K=13)</div>
                </div>
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;
                  const newFormula = formula ? `${formula} + FACE_CARDS` : 'FACE_CARDS';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <div className="variable-name">FACE_CARDS</div>
                  <div className="variable-desc">Number of face cards (J, Q, K)</div>
                </div>
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;
                  const newFormula = formula ? `${formula} + HEARTS_COUNT` : 'HEARTS_COUNT';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <div className="variable-name">HEARTS_COUNT</div>
                  <div className="variable-desc">Number of heart cards drawn</div>
                </div>
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;
                  const newFormula = formula ? `${formula} + PAIRS` : 'PAIRS';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <div className="variable-name">PAIRS</div>
                  <div className="variable-desc">Number of matching ranks</div>
                </div>
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;
                  const newFormula = formula ? `${formula} + SAME_SUIT` : 'SAME_SUIT';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <div className="variable-name">SAME_SUIT</div>
                  <div className="variable-desc">True if all cards are same suit</div>
                </div>
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;
                  const newFormula = formula ? `${formula} + (ROYAL_FLUSH ? 100 : 0)` : '(ROYAL_FLUSH ? 100 : 0)';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <div className="variable-name">ROYAL_FLUSH</div>
                  <div className="variable-desc">Boolean: 10, J, Q, K, A of same suit</div>
                </div>
              </div>

              <div className="formula-builder">
                <h4>Formula Builder</h4>
                <div className="formula-input-row">
                  <input
                    type="text"
                    className="formula-input"
                    value={
                      healingConfig.healingType === 'hot' ? healingConfig.hotFormula : healingConfig.formula
                    }
                    onChange={(e) => {
                      if (healingConfig.healingType === 'hot') {
                        handleHotFormulaChange(e.target.value);
                      } else {
                        // Both direct healing and shield use the same formula
                        handleFormulaChange(e.target.value);
                      }
                    }}
                    placeholder={`Enter formula (e.g. CARD_VALUE + HEA)`}
                  />
                  <button className="formula-button" onClick={() => {
                    if (healingConfig.healingType === 'hot') {
                      handleHotFormulaChange(getDefaultHotFormula(currentResolution));
                    } else {
                      // Both direct healing and shield use the same formula
                      handleFormulaChange(createDefaultFormula(currentResolution));
                    }
                  }}>
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

                {renderComplexFormulaExamples()}
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
                <p>Healing is determined by the coin flip result with formula: <code>{
                  healingConfig.healingType === 'direct' ? healingConfig.formula :
                  healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                  healingConfig.shieldFormula
                }</code></p>
              </div>
              <div className="coin-variables">
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;

                  const newFormula = formula ? `${formula} + HEADS_COUNT` : 'HEADS_COUNT';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <span className="variable-name">HEADS_COUNT</span>
                  <span className="variable-desc">Number of heads flipped</span>
                </div>
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;

                  const newFormula = formula ? `${formula} + TAILS_COUNT` : 'TAILS_COUNT';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <span className="variable-name">TAILS_COUNT</span>
                  <span className="variable-desc">Number of tails flipped</span>
                </div>
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;

                  const newFormula = formula ? `${formula} + ALL_HEADS` : 'ALL_HEADS';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <span className="variable-name">ALL_HEADS</span>
                  <span className="variable-desc">Boolean if all coins are heads</span>
                </div>
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;

                  const newFormula = formula ? `${formula} + ALL_TAILS` : 'ALL_TAILS';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <span className="variable-name">ALL_TAILS</span>
                  <span className="variable-desc">Boolean if all coins are tails</span>
                </div>
                <div className="variable-item" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;

                  const newFormula = formula ? `${formula} + HEADS_RATIO` : 'HEADS_RATIO';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <span className="variable-name">HEADS_RATIO</span>
                  <span className="variable-desc">Ratio of heads (0.0-1.0)</span>
                </div>
              </div>
              <div className="coin-visuals">
                <div className="coin heads" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;

                  const newFormula = formula ? `${formula} + HEADS_COUNT * 8` : 'HEADS_COUNT * 8';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
                  <div className="coin-face">H</div>
                </div>
                <div className="coin tails" onClick={() => {
                  const formula =
                    healingConfig.healingType === 'direct' ? healingConfig.formula :
                    healingConfig.healingType === 'hot' ? healingConfig.hotFormula :
                    healingConfig.shieldFormula;

                  const newFormula = formula ? `${formula} + TAILS_COUNT * 5` : 'TAILS_COUNT * 5';

                  if (healingConfig.healingType === 'direct') {
                    handleFormulaChange(newFormula);
                  } else if (healingConfig.healingType === 'hot') {
                    handleHotFormulaChange(newFormula);
                  } else {
                    handleShieldFormulaChange(newFormula);
                  }
                }}>
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

      {/* Third section: Formula Input */}
      <div className="formula-section section">
        <h3>
          {healingConfig.healingType === 'direct' && !healingConfig.hasHotEffect && !healingConfig.hasShieldEffect && 'Healing Formula'}
          {healingConfig.healingType === 'direct' && (healingConfig.hasHotEffect || healingConfig.hasShieldEffect) && 'Direct Healing Formula'}
          {healingConfig.healingType === 'hot' && !healingConfig.hasShieldEffect && 'Healing Over Time Formula'}
          {healingConfig.healingType === 'hot' && healingConfig.hasShieldEffect && 'Primary HoT Formula'}
          {healingConfig.healingType === 'shield' && !healingConfig.hasHotEffect && 'Shield Absorption Formula'}
          {healingConfig.healingType === 'shield' && healingConfig.hasHotEffect && 'Primary Shield Formula'}
        </h3>
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
                      <code>(CHP &lt; MHP/2 ? 1.5 : 1)</code> <span>If current HP is less than half of max HP, use 1.5, otherwise use 1</span>
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
                  <div className="syntax-title">Healing Variables</div>
                  <div className="syntax-examples">
                    <div className="syntax-example">
                      <code>HEA</code> <span>Base healing power stat</span>
                    </div>
                    <div className="syntax-example">
                      <code>CRIT_HEAL</code> <span>Critical healing chance</span>
                    </div>
                    <div className="syntax-example">
                      <code>CHP/MHP</code> <span>Current and maximum health points</span>
                    </div>
                  </div>
                </div>

                <div className="syntax-item">
                  <div className="syntax-title">Example Formula</div>
                  <div className="syntax-full-example">
                    <code>2d8 + HEA * (CHP &lt; MHP/3 ? 1.5 : 1)</code>
                    <div className="syntax-explanation">
                      <ul>
                        <li>Roll 2d8 for base healing</li>
                        <li>Add healing power (multiplied by 1.5 if target is below 33% health)</li>
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
              id="healingFormula"
              value={
                healingConfig.healingType === 'direct' ? healingConfig.formula || '' :
                healingConfig.healingType === 'hot' ? healingConfig.hotFormula || '' :
                healingConfig.shieldFormula || ''
              }
              onChange={(e) => {
                if (healingConfig.healingType === 'direct') {
                  handleFormulaChange(e.target.value);
                } else if (healingConfig.healingType === 'hot') {
                  handleHotFormulaChange(e.target.value);
                } else {
                  handleShieldFormulaChange(e.target.value);
                }
              }}
              placeholder={`Enter formula (e.g. ${
                healingConfig.healingType === 'direct' ? getDefaultFormula(currentResolution) :
                healingConfig.healingType === 'hot' ? getDefaultHotFormula(currentResolution) :
                getDefaultShieldFormula(currentResolution)
              })`}
            />
            <button
              className="formula-button"
              onClick={() => {
                if (healingConfig.healingType === 'direct') {
                  handleFormulaChange(getDefaultFormula(currentResolution));
                } else if (healingConfig.healingType === 'hot') {
                  handleHotFormulaChange(getDefaultHotFormula(currentResolution));
                } else {
                  handleShieldFormulaChange(getDefaultShieldFormula(currentResolution));
                }
              }}
            >
              Reset
            </button>
          </div>

          <VariablesDisplay onVariableClick={(variable) => {
            const input = document.getElementById('healingFormula');
            if (input) {
              const start = input.selectionStart;
              const end = input.selectionEnd;
              const currentValue = input.value;
              const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);

              if (healingConfig.healingType === 'hot') {
                handleHotFormulaChange(newValue);
              } else {
                // Both direct healing and shield use the same formula
                handleFormulaChange(newValue);
              }

              // Set cursor position after the inserted variable
              setTimeout(() => {
                input.setSelectionRange(start + variable.length, start + variable.length);
                input.focus();
              }, 0);
            }
          }} />

          {renderComplexFormulaExamples()}
        </div>
      </div>

      {/* Additional formula sections for combined effects */}
      {healingConfig.healingType === 'direct' && healingConfig.hasHotEffect && (
        <div className="formula-section section">
          <h3>Healing Over Time Formula</h3>
          <div className="formula-builder">
            <div className="formula-input-group">
              <input
                type="text"
                className="formula-input"
                id="hotFormula"
                value={healingConfig.hotFormula || ''}
                onChange={(e) => handleHotFormulaChange(e.target.value)}
                placeholder={`Enter formula (e.g. ${getDefaultHotFormula(currentResolution)})`}
              />
              <button
                className="formula-button"
                onClick={() => handleHotFormulaChange(getDefaultHotFormula(currentResolution))}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {healingConfig.healingType === 'direct' && healingConfig.hasShieldEffect && (
        <div className="formula-section section">
          <h3>Shield Absorption Formula</h3>
          <div className="formula-builder">
            <div className="formula-input-group">
              <input
                type="text"
                className="formula-input"
                id="shieldFormula"
                value={healingConfig.shieldFormula || ''}
                onChange={(e) => handleShieldFormulaChange(e.target.value)}
                placeholder={`Enter formula (e.g. ${getDefaultShieldFormula(currentResolution)})`}
              />
              <button
                className="formula-button"
                onClick={() => handleShieldFormulaChange(getDefaultShieldFormula(currentResolution))}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {healingConfig.healingType === 'hot' && healingConfig.hasShieldEffect && (
        <div className="formula-section section">
          <h3>Shield Absorption Formula</h3>
          <div className="formula-builder">
            <div className="formula-input-group">
              <input
                type="text"
                className="formula-input"
                id="shieldFormula"
                value={healingConfig.shieldFormula || ''}
                onChange={(e) => handleShieldFormulaChange(e.target.value)}
                placeholder={`Enter formula (e.g. ${getDefaultShieldFormula(currentResolution)})`}
              />
              <button
                className="formula-button"
                onClick={() => handleShieldFormulaChange(getDefaultShieldFormula(currentResolution))}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {healingConfig.healingType === 'shield' && healingConfig.hasHotEffect && (
        <div className="formula-section section">
          <h3>Healing Over Time Formula</h3>
          <div className="formula-builder">
            <div className="formula-input-group">
              <input
                type="text"
                className="formula-input"
                id="hotFormula"
                value={healingConfig.hotFormula || ''}
                onChange={(e) => handleHotFormulaChange(e.target.value)}
                placeholder={`Enter formula (e.g. ${getDefaultHotFormula(currentResolution)})`}
              />
              <button
                className="formula-button"
                onClick={() => handleHotFormulaChange(getDefaultHotFormula(currentResolution))}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional configurations based on healing type */}
      {(healingConfig.healingType === 'hot' || healingConfig.hasHotEffect) && (
        <div className="hot-config section">
          <h3>Healing Over Time Configuration</h3>

          <div className="hot-form-row">
            <div className="hot-input-group">
              <label>Trigger Type:</label>
              <select
                value={healingConfig.hotTriggerType}
                onChange={(e) => {
                  // First, update the local state to maintain the view
                  setHealingConfig(prev => ({
                    ...prev,
                    hotTriggerType: e.target.value
                  }));

                  // Then update the global state
                  handleHealingConfigChange('hotTriggerType', e.target.value);

                  // If changing to trigger-based, update the spell's trigger configuration
                  if (e.target.value === 'trigger') {
                    // Create a trigger configuration for the spell's trigger system
                    const spellTriggerConfig = {
                      triggerId: 'hot_trigger',
                      parameters: {},
                      targetEntity: 'target',
                      effectType: 'hot'
                    };

                    // Update the spell's trigger configuration
                    dispatch(actionCreators.updateTriggerConfig({
                      ...state.triggerConfig,
                      hotTrigger: spellTriggerConfig
                    }));

                    // Update the spell's wizard flow to include the trigger step
                    // We'll use setTimeout to ensure the state updates first
                    setTimeout(() => {
                      dispatch(actionCreators.updateWizardFlow());
                    }, 100);
                  }

                  // If changing to channeled, update the spell's channeling configuration
                  if (e.target.value === 'channeled') {
                    // Make sure the spell type is set to CHANNELED
                    if (state.spellType !== 'CHANNELED') {
                      dispatch(actionCreators.setSpellType('CHANNELED'));
                    }

                    // Initialize a channeling configuration if it doesn't exist
                    if (!state.channelingConfig) {
                      dispatch(actionCreators.updateChannelingConfig({
                        type: 'power_up',
                        maxDuration: 3,
                        durationUnit: 'turns',
                        interruptible: true,
                        movementAllowed: false,
                        costValue: 1,
                        costType: 'mana',
                        costTrigger: 'per_turn',
                        perRoundFormulas: {
                          hot_healing: [
                            { round: 1, formula: healingConfig.hotFormula || '1d4', description: 'Round 1 healing' },
                            { round: 2, formula: healingConfig.hotFormula || '1d4', description: 'Round 2 healing' },
                            { round: 3, formula: healingConfig.hotFormula || '1d4', description: 'Round 3 healing' }
                          ]
                        }
                      }));
                    } else if (!state.channelingConfig.perRoundFormulas || !state.channelingConfig.perRoundFormulas.hot_healing) {
                      // If channeling config exists but doesn't have HoT formulas, add them
                      dispatch(actionCreators.updateChannelingConfig({
                        ...state.channelingConfig,
                        perRoundFormulas: {
                          ...state.channelingConfig.perRoundFormulas,
                          hot_healing: [
                            { round: 1, formula: healingConfig.hotFormula || '1d4', description: 'Round 1 healing' },
                            { round: 2, formula: healingConfig.hotFormula || '1d4', description: 'Round 2 healing' },
                            { round: 3, formula: healingConfig.hotFormula || '1d4', description: 'Round 3 healing' }
                          ]
                        }
                      }));
                    }

                    // Update the spell's wizard flow to include the channeling step
                    setTimeout(() => {
                      // Get the current flow and let the context determine the new flow
                      dispatch({
                        type: ACTION_TYPES.UPDATE_WIZARD_FLOW,
                        payload: determineWizardFlow(state)
                      });
                    }, 100);
                  }
                }}
                className="hot-select"
              >
                <option value="periodic">Periodic (Every Round/Turn)</option>
                <option value="trigger">Trigger-Based</option>
                <option value="channeled">Channeled (Configured in Channeling Step)</option>
              </select>
            </div>
          </div>

          {healingConfig.hotTriggerType === 'periodic' ? (
            <div className="hot-form-row">
              <div className="hot-input-group">
                <label>Duration:</label>
                <div className="hot-input-with-select">
                  <input
                    type="number"
                    value={healingConfig.hotDuration}
                    onChange={(e) => handleHealingConfigChange('hotDuration', parseInt(e.target.value, 10))}
                    min="1"
                    max="10"
                    className="hot-input"
                  />
                  <select
                    value={healingConfig.hotTickType}
                    onChange={(e) => handleHealingConfigChange('hotTickType', e.target.value)}
                    className="hot-select"
                  >
                    <option value="round">Rounds</option>
                    <option value="turn">Turns</option>
                    <option value="minute">Minutes</option>
                    <option value="hour">Hours</option>
                  </select>
                </div>
              </div>

              <div className="hot-input-group">
                <label>Healing occurs at:</label>
                <select
                  value={healingConfig.hotApplication}
                  onChange={(e) => handleHealingConfigChange('hotApplication', e.target.value)}
                  className="hot-select"
                >
                  <option value="start">Start of turn</option>
                  <option value="end">End of turn</option>
                </select>
              </div>

              <div className="hot-input-group">
                <label>Custom Formula Per Stage:</label>
                <button
                  className={`toggle-button ${healingConfig.isProgressiveHot ? 'active' : ''}`}
                  onClick={() => {
                    // Direct approach - create a completely new config object
                    const newValue = !healingConfig.isProgressiveHot;

                    // Create a new config with all the updated values
                    const newConfig = {
                      ...healingConfig,
                      isProgressiveHot: newValue,
                      hotScalingType: newValue ? 'progressive' : 'flat'
                    };

                    // Initialize progressiveStages array when enabling progressive effect
                    if (newValue && (!healingConfig.hotProgressiveStages || healingConfig.hotProgressiveStages.length === 0)) {
                      newConfig.hotProgressiveStages = [{
                        triggerAt: 1,
                        formula: healingConfig.hotFormula || '1d4 + HEA/2',
                        description: '',
                        spellEffect: null
                      }];
                    }

                    // Update the local state directly
                    setHealingConfig(newConfig);

                    // Update the global state
                    dispatch(actionCreators.updateHealingConfig(newConfig));
                  }}
                >
                  {healingConfig.isProgressiveHot ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Progressive HoT Configuration */}
              {healingConfig.isProgressiveHot && (
                <div className="hot-input-group full-width">
                    <div className="progressive-stages">
                      <div className="stage-description">
                        Configure different formulas for each stage of the HoT effect.
                      </div>

                      {(!healingConfig.hotProgressiveStages || healingConfig.hotProgressiveStages.length === 0) ? (
                        <div className="no-stages">No stages configured yet. Add a stage to get started.</div>
                      ) : (
                        <div className="stages-list">
                          {healingConfig.hotProgressiveStages.map((stage, index) => (
                            <div key={index} className="stage-item">
                              <div className="stage-header">
                                <div className="stage-title">Stage {index + 1}</div>
                                <div className="stage-actions">
                                  <button
                                    className="stage-action delete"
                                    onClick={() => {
                                      const updatedStages = [...healingConfig.hotProgressiveStages];
                                      updatedStages.splice(index, 1);
                                      handleHealingConfigChange('hotProgressiveStages', updatedStages);
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
                                        const updatedStages = [...healingConfig.hotProgressiveStages];
                                        updatedStages[index] = {
                                          ...updatedStages[index],
                                          triggerAt: parseInt(e.target.value) || 0
                                        };
                                        handleHealingConfigChange('hotProgressiveStages', updatedStages);
                                      }}
                                      min="1"
                                    />
                                    <span className="unit-label">{healingConfig.hotTickType || 'rounds'}</span>
                                  </div>
                                </div>

                                <div className="stage-formula">
                                  <label>Formula:</label>
                                  <input
                                    type="text"
                                    value={stage.formula || ''}
                                    onChange={(e) => {
                                      const updatedStages = [...healingConfig.hotProgressiveStages];
                                      updatedStages[index] = {
                                        ...updatedStages[index],
                                        formula: e.target.value
                                      };
                                      handleHealingConfigChange('hotProgressiveStages', updatedStages);
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
                                      const updatedStages = [...healingConfig.hotProgressiveStages];
                                      updatedStages[index] = {
                                        ...updatedStages[index],
                                        description: e.target.value
                                      };
                                      handleHealingConfigChange('hotProgressiveStages', updatedStages);
                                    }}
                                    placeholder="Describe this stage's effect"
                                  />
                                </div>

                                <div className="stage-spell-effect">
                                  <label>Trigger Spell (optional):</label>
                                  <SpellLibraryButton
                                    selectedSpellId={stage.spellEffect || null}
                                    onSpellSelect={(spellId) => {
                                      const updatedStages = [...healingConfig.hotProgressiveStages];
                                      updatedStages[index] = {
                                        ...updatedStages[index],
                                        spellEffect: spellId
                                      };
                                      handleHealingConfigChange('hotProgressiveStages', updatedStages);
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
                          const progressiveStages = healingConfig.hotProgressiveStages || [];
                          const newStage = {
                            triggerAt: progressiveStages.length + 1,
                            formula: healingConfig.hotFormula || '1d4 + HEA/2',
                            description: '',
                            spellEffect: null
                          };
                          handleHealingConfigChange('hotProgressiveStages', [...progressiveStages, newStage]);
                        }}
                      >
                        + Add Stage
                      </button>
                    </div>
                </div>
              )}
            </div>
          ) : healingConfig.hotTriggerType === 'trigger' ? (
            <div className="hot-form-row">
              <div className="hot-input-group">
                <label>Effect Duration:</label>
                <div className="hot-input-with-select">
                  <input
                    type="number"
                    value={healingConfig.hotDuration}
                    onChange={(e) => handleHealingConfigChange('hotDuration', parseInt(e.target.value, 10))}
                    min="1"
                    max="10"
                    className="hot-input"
                  />
                  <select
                    value={healingConfig.hotTickType}
                    onChange={(e) => handleHealingConfigChange('hotTickType', e.target.value)}
                    className="hot-select"
                  >
                    <option value="round">Rounds</option>
                    <option value="turn">Turns</option>
                    <option value="minute">Minutes</option>
                    <option value="hour">Hours</option>
                  </select>
                </div>
                <div className="trigger-note">
                  <p>This HoT will be applied when the trigger condition is met. Configure the trigger in the Triggers step.</p>
                  <p>The duration above determines how long the HoT effect lasts after being triggered.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="hot-form-row">
              <div className="hot-input-group">
                <div className="channeled-note">
                  <p>This HoT will be configured in the Channeling step. The formula you've defined here will be available in the channeling configuration.</p>
                  <p>You can define different formulas for each round of channeling in the Channeling step.</p>
                </div>
                <div className="channeled-info">
                  <p>Base HoT Formula: <code>{healingConfig.hotFormula}</code></p>
                </div>
              </div>
            </div>
          )}

          <div className="hot-formula-group">
            <div className="hot-tick-preview">
              <h4>Healing Preview</h4>
              <div className="hot-tick-container">
                {Array.from({ length: healingConfig.hotDuration || 3 }).map((_, index) => {
                  const roundNum = index + 1;
                  let scalingFactor = 1;

                  // Apply scaling factor based on scaling type
                  switch (healingConfig.hotScalingType) {
                    case 'increasing':
                      scalingFactor = 1 + (index * 0.25); // Increases by 25% each tick
                      break;
                    case 'decreasing':
                      scalingFactor = 1 - (index * 0.15); // Decreases by 15% each tick (not below 0.55)
                      scalingFactor = Math.max(0.55, scalingFactor);
                      break;
                    case 'frontloaded':
                      // Start at 1.5, end at 0.75
                      scalingFactor = 1.5 - (index * (0.75 / (healingConfig.hotDuration - 1 || 1)));
                      break;
                    case 'backloaded':
                      // Start at 0.75, end at 1.5
                      scalingFactor = 0.75 + (index * (0.75 / (healingConfig.hotDuration - 1 || 1)));
                      break;
                    default: // flat
                      scalingFactor = 1;
                  }

                  const diceAvg = parseDiceNotation(healingConfig.hotFormula)
                    ? Math.round(getAverageRoll(healingConfig.hotFormula, { ROUND: roundNum, DURATION: healingConfig.hotDuration || 3 }) * scalingFactor)
                    : 'N/A';

                  return (
                    <div key={index} className="hot-tick-item">
                      <div className="hot-tick-round">Round {roundNum}</div>
                      <div className="hot-tick-value">{diceAvg} healing</div>
                    </div>
                  );
                })}
              </div>
              <div className="hot-total">
                <div className="hot-total-label">Total Healing:</div>
                <div className="hot-total-value">
                  {parseDiceNotation(healingConfig.hotFormula)
                    ? Array.from({ length: healingConfig.hotDuration || 3 })
                        .map((_, i) => {
                          let scalingFactor = 1;

                          // Apply scaling factor based on scaling type
                          switch (healingConfig.hotScalingType) {
                            case 'increasing':
                              scalingFactor = 1 + (i * 0.25); // Increases by 25% each tick
                              break;
                            case 'decreasing':
                              scalingFactor = 1 - (i * 0.15); // Decreases by 15% each tick (not below 0.55)
                              scalingFactor = Math.max(0.55, scalingFactor);
                              break;
                            case 'frontloaded':
                              // Start at 1.5, end at 0.75
                              scalingFactor = 1.5 - (i * (0.75 / (healingConfig.hotDuration - 1 || 1)));
                              break;
                            case 'backloaded':
                              // Start at 0.75, end at 1.5
                              scalingFactor = 0.75 + (i * (0.75 / (healingConfig.hotDuration - 1 || 1)));
                              break;
                            default: // flat
                              scalingFactor = 1;
                          }

                          return getAverageRoll(healingConfig.hotFormula, { ROUND: i + 1, DURATION: healingConfig.hotDuration || 3 }) * scalingFactor;
                        })
                        .reduce((sum, val) => sum + val, 0).toFixed(0)
                    : 'N/A'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(healingConfig.healingType === 'shield' || healingConfig.hasShieldEffect) && (
        <div className="shield-config section">
          <h3>Shield Configuration</h3>

          <div className="shield-form-row">
            <div className="shield-input-group">
              <label>Duration:</label>
              <div className="shield-input-with-select">
                <input
                  type="number"
                  value={healingConfig.shieldDuration}
                  onChange={(e) => handleHealingConfigChange('shieldDuration', parseInt(e.target.value, 10))}
                  min="1"
                  max="10"
                  className="shield-input"
                />
                <select
                  className="shield-select"
                >
                  <option value="round">Rounds</option>
                  <option value="minute">Minutes</option>
                  <option value="hour">Hours</option>
                </select>
              </div>
            </div>

            <div className="shield-input-group">
              <label>Damage Type Absorption:</label>
              <select
                value={healingConfig.shieldDamageTypes}
                onChange={(e) => handleHealingConfigChange('shieldDamageTypes', e.target.value)}
                className="shield-select"
              >
                <option value="all">All Damage Types</option>
                <option value="physical">Physical Damage Only</option>
                <option value="magical">Magical Damage Only</option>
                <option value="fire">Fire Damage Only</option>
                <option value="cold">Cold Damage Only</option>
                <option value="lightning">Lightning Damage Only</option>
                <option value="acid">Acid Damage Only</option>
                <option value="poison">Poison Damage Only</option>
                <option value="necrotic">Necrotic Damage Only</option>
                <option value="radiant">Radiant Damage Only</option>
                <option value="force">Force Damage Only</option>
              </select>
            </div>

            <div className="shield-input-group">
              <label>Overflow Behavior:</label>
              <select
                value={healingConfig.shieldOverflow}
                onChange={(e) => handleHealingConfigChange('shieldOverflow', e.target.value)}
                className="shield-select"
              >
                <option value="dissipate">Excess damage dissipates</option>
                <option value="convert_to_healing">Convert excess to healing</option>
              </select>
            </div>

            <div className="shield-input-group">
              <label>Break Behavior:</label>
              <select
                value={healingConfig.shieldBreakBehavior}
                onChange={(e) => handleHealingConfigChange('shieldBreakBehavior', e.target.value)}
                className="shield-select"
              >
                <option value="fade">Fade gradually when damaged</option>
                <option value="shatter">Shatter completely when exceeded</option>
              </select>
            </div>
          </div>

          <div className="shield-formula-group">
            <div className="shield-preview">
              <h4>Shield Preview</h4>
              <div className="shield-stats">
                <div className="shield-stat-item">
                  <div className="shield-stat-label">Average Absorption</div>
                  <div className="shield-stat-value">
                    {parseDiceNotation(healingConfig.shieldFormula)
                      ? getAverageRoll(healingConfig.shieldFormula).toFixed(1)
                      : 'N/A'
                    }
                  </div>
                </div>
                <div className="shield-stat-item">
                  <div className="shield-stat-label">Range</div>
                  <div className="shield-stat-value">
                    {parseDiceNotation(healingConfig.shieldFormula)
                      ? `${getMinRoll(healingConfig.shieldFormula)} - ${getMaxRoll(healingConfig.shieldFormula)}`
                      : 'N/A'
                    }
                  </div>
                </div>
                <div className="shield-stat-item">
                  <div className="shield-stat-label">Duration</div>
                  <div className="shield-stat-value">{healingConfig.shieldDuration || 3} rounds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Shield Break/Expiration Effects */}
          <div className="shield-effects-section wow-setting-section">
            <h4 className="wow-section-header">Shield Effect Triggers</h4>

            {/* Shield Break Effect */}
            <div className="shield-effect-group">
              <label>On Shield Break Effect:</label>
              <select
                value={healingConfig.shieldBreakEffect || ''}
                onChange={(e) => handleHealingConfigChange('shieldBreakEffect', e.target.value || null)}
                className="shield-select"
              >
                <option value="">-- No Effect --</option>
                {LIBRARY_SPELLS.map(spell => (
                  <option key={spell.id} value={spell.id}>
                    {spell.name} ({spell.damageTypes?.[0] || 'effect'})
                  </option>
                ))}
              </select>

              {healingConfig.shieldBreakEffect && (
                <div className="selected-spell-preview">
                  <h5>Selected Break Effect</h5>
                  <div className="spell-preview wow-card">
                    {(() => {
                      const spell = LIBRARY_SPELLS.find(s => s.id === healingConfig.shieldBreakEffect);
                      return spell ? (
                        <div className="spell-card-mini">
                          <div className="spell-name">{spell.name}</div>
                          <div className="spell-type">{spell.damageTypes?.[0] || 'effect'}</div>
                          <div className="spell-description">{spell.description || 'No description available'}</div>
                        </div>
                      ) : 'No spell selected';
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Shield Expiration Effect */}
            <div className="shield-effect-group">
              <label>On Shield Expiration Effect:</label>
              <select
                value={healingConfig.shieldExpireEffect || ''}
                onChange={(e) => handleHealingConfigChange('shieldExpireEffect', e.target.value || null)}
                className="shield-select"
              >
                <option value="">-- No Effect --</option>
                {LIBRARY_SPELLS.map(spell => (
                  <option key={spell.id} value={spell.id}>
                    {spell.name} ({spell.damageTypes?.[0] || 'effect'})
                  </option>
                ))}
              </select>

              {healingConfig.shieldExpireEffect && (
                <div className="selected-spell-preview">
                  <h5>Selected Expiration Effect</h5>
                  <div className="spell-preview wow-card">
                    {(() => {
                      const spell = LIBRARY_SPELLS.find(s => s.id === healingConfig.shieldExpireEffect);
                      return spell ? (
                        <div className="spell-card-mini">
                          <div className="spell-name">{spell.name}</div>
                          <div className="spell-type">{spell.damageTypes?.[0] || 'effect'}</div>
                          <div className="spell-description">{spell.description || 'No description available'}</div>
                        </div>
                      ) : 'No spell selected';
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Critical Hit Configuration */}
      <div className="critical-hit-section section">
        <h3>Critical Healing Configuration</h3>
        <CriticalHitConfig
          config={healingConfig.criticalConfig}
          onConfigChange={(critConfig) => handleHealingConfigChange('criticalConfig', critConfig)}
        />
      </div>

      {/* Chance-on-Hit Effects */}
      <div className="chance-on-hit-section section">
        <h3>Chance-on-Heal Effects</h3>
        <ChanceOnHitConfig
          config={healingConfig.chanceOnHitConfig}
          onConfigChange={(procConfig) => handleHealingConfigChange('chanceOnHitConfig', procConfig)}
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

export default HealingEffects;