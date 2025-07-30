import React, { useState, useEffect, useCallback } from 'react';
// Pathfinder styles imported via main.css
import '../../styles/effects/ProgressiveEffects.css';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators, ACTION_TYPES, determineWizardFlow } from '../../context/spellWizardContext';
import IconSelectionCard from '../../components/common/IconSelectionCard';
import CriticalHitConfig from '../../components/mechanics/CriticalHitConfig';
import ChanceOnHitConfig from '../../components/mechanics/ChanceOnHitConfig';
import SpellLibraryButton from '../../components/common/SpellLibraryButton';
import { useUnifiedTooltip } from '../../../common/useUnifiedTooltip';
import UnifiedTooltip from '../../../common/UnifiedTooltip';
import MechanicsPopup from '../../components/common/MechanicsPopup';
import MathHelpModal from '../../components/common/MathHelpModal';
import { FaCog } from 'react-icons/fa';


import { LIBRARY_SPELLS } from '../../../../data/spellLibraryData';
// Pathfinder styles imported via main.css
import '../../styles/effects/unified-effects.css';
import './healing-effects.css';
import './damage-effects.css'; // Reuse damage effects styling
import './progressive-buff.css'; // Progressive effects styling
import VisualCardSelector from '../../components/mechanics/VisualCardSelector';
import { ALL_VARIABLES, VARIABLE_CATEGORIES } from '../../core/data/formulaVariables';

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

// Note: Variable definitions are now imported from formulaVariables.js for consistency



// Custom formula evaluation function
const customEvaluateFormula = (formula, variables = {}) => {
  try {
    // First, try to parse as dice notation and get average
    if (parseDiceNotation(formula)) {
      const diceAverage = getAverageRoll(formula);

      // Replace variable placeholders with their values
      let result = diceAverage;
      Object.keys(ALL_VARIABLES).forEach(variable => {
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
                  <span className="variable-desc">{ALL_VARIABLES[variable]?.description || 'No description available'}</span>
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

  // Initialize unified tooltip system
  const { tooltipState, handleMouseEnter, handleMouseLeave, handleMouseMove } = useUnifiedTooltip();

  // Get current spell config from props
  const { currentEffect, effectConfig } = props;
  const spellId = state.currentSpellId;

  // Popup states (matching damage effects)
  const [showCriticalHitPopup, setShowCriticalHitPopup] = useState(false);
  const [showChanceOnHitPopup, setShowChanceOnHitPopup] = useState(false);
  const [showMathHelp, setShowMathHelp] = useState(false);

  // Card/Coin selection states (matching damage effects)
  const [drawCount, setDrawCount] = useState(3);
  const [coinCount, setCoinCount] = useState(5);
  const [selectedCards, setSelectedCards] = useState([]);
  const [activeSuit, setActiveSuit] = useState('hearts');
  const [selectedCoinPattern, setSelectedCoinPattern] = useState('basic');

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

  // State for card selection (already declared above, removing duplicate)

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
        return `1d4 + healingPower/2`;
      case 'CARDS':
        return `CARD_VALUE/2 + healingPower/2`;
      case 'COINS':
        return `HEADS_COUNT * 3 + healingPower/3`;
      default:
        return `1d4 + healingPower/2`;
    }
  };

  // Get default Shield formula
  const getDefaultShieldFormula = (resolutionType) => {
    switch (resolutionType) {
      case 'DICE':
        return `2d6 + healingPower`;
      case 'CARDS':
        return `CARD_VALUE + healingPower*1.5`;
      case 'COINS':
        return `HEADS_COUNT * 10 + healingPower`;
      default:
        return `2d6 + healingPower`;
    }
  };



  // Handler for healing configuration changes
  const handleHealingConfigChange = (field, value) => {
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
      // When changing healing types, preserve additional effects unless they conflict
      // Only clear hasHotEffect when switching TO 'hot' as primary type (to avoid duplication)
      if (value === 'hot') {
        const updatedConfig = {
          ...newConfig,
          hasHotEffect: false // Clear additional HoT when HoT becomes primary
        };
        setHealingConfig(updatedConfig);
        dispatch(actionCreators.updateHealingConfig(updatedConfig));
      }
      // For 'direct' and 'shield' types, preserve additional effects
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
    // console.log('HealingEffects - Resolution change:', resolutionId);
    setCurrentResolution(resolutionId);

    // Update progressive stage formulas if they exist
    if (healingConfig.progressiveStages?.length > 0) {
      const updatedStages = healingConfig.progressiveStages.map(stage => {
        // Get appropriate base formula based on new resolution method
        let newFormula;
        if (resolutionId === 'CARDS') {
          newFormula = 'cards * 2 + HEA/2';
        } else if (resolutionId === 'COINS') {
          newFormula = 'heads * 3 + HEA/2';
        } else {
          newFormula = '1d4 + HEA/2';
        }

        return {
          ...stage,
          formula: newFormula
        };
      });

      // Update the healing config with new progressive stages
      const newConfig = {
        ...healingConfig,
        progressiveStages: updatedStages
      };
      setHealingConfig(newConfig);
      dispatch(actionCreators.updateHealingConfig(newConfig));
    }

    // Create a comprehensive config update to avoid multiple state updates
    const configUpdate = {
      resolution: resolutionId,
      globalResolution: resolutionId
    };

    // Initialize config objects when switching to card/coin resolution
    if (resolutionId === 'CARDS') {
      // Initialize main card config
      configUpdate.cardConfig = {
        drawCount: healingConfig.cardConfig?.drawCount || 3,
        formula: healingConfig.cardConfig?.formula || 'CARD_VALUE + HEA'
      };

      // Initialize HoT card config if HoT is enabled OR if healing type is 'hot'
      if (healingConfig.hasHealingOverTime || healingConfig.healingType === 'hot') {
        configUpdate.hotCardConfig = {
          drawCount: healingConfig.hotCardConfig?.drawCount || 3,
          formula: healingConfig.hotCardConfig?.formula || 'CARD_VALUE/2 + HEA/2'
        };
      }

      // Initialize shield card config if shield is enabled
      if (healingConfig.hasShieldEffect) {
        configUpdate.shieldCardConfig = {
          drawCount: healingConfig.shieldCardConfig?.drawCount || 3,
          formula: healingConfig.shieldCardConfig?.formula || 'CARD_VALUE + HEA'
        };
      }
    } else if (resolutionId === 'COINS') {
      // Initialize main coin config (fix default flipCount to match damage effects)
      configUpdate.coinConfig = {
        flipCount: healingConfig.coinConfig?.flipCount || 4,
        formula: healingConfig.coinConfig?.formula || 'HEADS_COUNT * 7 + HEA'
      };

      // Initialize HoT coin config if HoT is enabled OR if healing type is 'hot'
      if (healingConfig.hasHealingOverTime || healingConfig.healingType === 'hot') {
        configUpdate.hotCoinConfig = {
          flipCount: healingConfig.hotCoinConfig?.flipCount || 4,
          formula: healingConfig.hotCoinConfig?.formula || 'HEADS_COUNT * 3 + HEA/2'
        };
      }

      // Initialize shield coin config if shield is enabled
      if (healingConfig.hasShieldEffect) {
        configUpdate.shieldCoinConfig = {
          flipCount: healingConfig.shieldCoinConfig?.flipCount || 4,
          formula: healingConfig.shieldCoinConfig?.formula || 'HEADS_COUNT * 7 + HEA'
        };
      }
    }

    // Apply all changes in a single update
    // console.log('HealingEffects - Applying config update:', configUpdate);
    const newConfig = { ...healingConfig, ...configUpdate };
    setHealingConfig(newConfig);
    dispatch(actionCreators.updateHealingConfig(newConfig));

    // Update formula examples for new resolution
    updateFormulaExamples(resolutionId);
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
  }, [state.healingConfig]);

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
    }
  }, []);  // Empty dependency array means this runs once on mount

  // Set up formula examples when resolution changes
  useEffect(() => {
    updateFormulaExamples(currentResolution);
  }, [currentResolution]);

  // Handler for formula change
  const handleFormulaChange = (value) => {
    // For pure HoT healing type, use HoT-specific configs
    if (healingConfig.healingType === 'hot') {
      if (currentResolution === 'CARDS') {
        handleHealingConfigChange('hotCardConfig', {
          ...healingConfig.hotCardConfig,
          formula: value
        });
      } else if (currentResolution === 'COINS') {
        handleHealingConfigChange('hotCoinConfig', {
          ...healingConfig.hotCoinConfig,
          formula: value
        });
      } else {
        // For DICE resolution, update the HoT formula
        handleHealingConfigChange('hotFormula', value);
      }
    } else if (healingConfig.healingType === 'shield') {
      // For shield healing type, use shield-specific configs
      if (currentResolution === 'CARDS') {
        handleHealingConfigChange('shieldCardConfig', {
          ...healingConfig.shieldCardConfig,
          formula: value
        });
      } else if (currentResolution === 'COINS') {
        handleHealingConfigChange('shieldCoinConfig', {
          ...healingConfig.shieldCoinConfig,
          formula: value
        });
      } else {
        // For DICE resolution, update the shield formula
        handleHealingConfigChange('shieldFormula', value);
      }
    } else {
      // For direct healing type, use regular configs
      if (currentResolution === 'CARDS') {
        handleHealingConfigChange('cardConfig', {
          ...healingConfig.cardConfig,
          formula: value
        });
      } else if (currentResolution === 'COINS') {
        handleHealingConfigChange('coinConfig', {
          ...healingConfig.coinConfig,
          formula: value
        });
      } else {
        // For DICE resolution, update the main formula
        handleHealingConfigChange('formula', value);
      }
    }
  };

  // Handler for hot formula change
  const handleHotFormulaChange = (value) => {
    // Update the appropriate config based on current resolution
    if (currentResolution === 'CARDS') {
      handleHealingConfigChange('hotCardConfig', {
        ...healingConfig.hotCardConfig,
        formula: value
      });
    } else if (currentResolution === 'COINS') {
      handleHealingConfigChange('hotCoinConfig', {
        ...healingConfig.hotCoinConfig,
        formula: value
      });
    } else {
      // For DICE resolution, update the main hot formula
      handleHealingConfigChange('hotFormula', value);
    }
  };

  // Handler for shield formula change
  const handleShieldFormulaChange = (value) => {
    // Update the appropriate config based on current resolution
    if (currentResolution === 'CARDS') {
      handleHealingConfigChange('shieldCardConfig', {
        ...healingConfig.shieldCardConfig,
        formula: value
      });
    } else if (currentResolution === 'COINS') {
      handleHealingConfigChange('shieldCoinConfig', {
        ...healingConfig.shieldCoinConfig,
        formula: value
      });
    } else {
      // For DICE resolution, update the main shield formula
      handleHealingConfigChange('shieldFormula', value);
    }
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

    // Config updated successfully
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

    // Config updated successfully
  };

  // Update the dice display to be interactive with the formula and add complex formula examples
  const addDiceToFormula = (diceType) => {
    const newFormula = healingConfig.formula
      ? `${healingConfig.formula} + 1${diceType}`
      : `1${diceType}`;
    handleHealingConfigChange('formula', newFormula);
  };

  // Add variables to formula
  const addToFormula = (variable) => {
    const newFormula = healingConfig.formula
      ? `${healingConfig.formula} + ${variable}`
      : variable;
    handleHealingConfigChange('formula', newFormula);
  };

  const getComplexFormulaExamples = () => {
    switch (currentResolution) {
      case 'DICE':
        return [
          {
            name: 'Empowered Healing',
            formula: `2d8 + healingPower*1.5`,
            description: 'Boosted healing power'
          },
          {
            name: 'Critical Recovery',
            formula: `3d8 + (currentHealth < maxHealth/3 ? healingPower*2 : healingPower)`,
            description: 'Stronger healing when target is below 33% health'
          },
          {
            name: 'Adaptive Restoration',
            formula: `2d6 + MAX(intelligence, spirit)*0.8 + healingPower`,
            description: 'Uses your highest mental stat for bonus healing'
          },
          {
            name: 'Merciful Blessing',
            formula: `4d6 + healingPower*(maxHealth-currentHealth)/maxHealth*2`,
            description: 'Healing scales with how badly wounded the target is'
          },
          {
            name: 'Mana Conversion',
            formula: `2d8 + healingPower*(currentMana/maxMana + 0.5)`,
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
    <div className="damage-effects-container">
      {/* First section: Healing Type Selection */}
      <div className="healing-type-section section">
        <h3>Primary Healing Method</h3>
        <div className="three-column">
          <IconSelectionCard
            icon=""
            title="Immediate Healing"
            description="Heals target immediately upon casting"
            onClick={() => {
              const newConfig = {
                ...healingConfig,
                healingType: 'direct'
              };
              setHealingConfig(newConfig);
              dispatch(actionCreators.updateHealingConfig(newConfig));
            }}
            selected={healingConfig.healingType === 'direct'}
          />
          <IconSelectionCard
            icon=""
            title="Healing Over Time"
            description="Applies healing over multiple rounds or turns"
            onClick={() => {
              const newConfig = {
                ...healingConfig,
                healingType: 'hot',
                hasHotEffect: false // Don't set hasHotEffect when HoT is the primary type
              };
              setHealingConfig(newConfig);
              dispatch(actionCreators.updateHealingConfig(newConfig));
            }}
            selected={healingConfig.healingType === 'hot'}
          />
          <IconSelectionCard
            icon=""
            title="Absorption Shield"
            description="Creates a barrier that absorbs incoming damage"
            onClick={() => {
              const newConfig = {
                ...healingConfig,
                healingType: 'shield'
              };
              setHealingConfig(newConfig);
              dispatch(actionCreators.updateHealingConfig(newConfig));
            }}
            selected={healingConfig.healingType === 'shield'}
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
                onMouseEnter={handleMouseEnter('Adds a healing over time component to your direct healing spell', { title: 'Add Healing Over Time', variant: 'default' })}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
              <IconSelectionCard
                icon={<FaShield className="icon" />}
                title="Add Absorption Shield"
                description="Also creates a protective barrier"
                onClick={toggleShieldEffect}
                selected={healingConfig.hasShieldEffect}
                onMouseEnter={handleMouseEnter('Adds a protective shield component to your direct healing spell', { title: 'Add Absorption Shield', variant: 'default' })}
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Healing Dice button clicked');
              handleResolutionChange('DICE');
            }}
            style={{ pointerEvents: 'auto', zIndex: 20 }}
          >
            <FaDiceD20 className="resolution-icon" />
            <span>Dice</span>
          </button>
          <button
            className={`resolution-option ${currentResolution === 'CARDS' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Healing Cards button clicked');
              handleResolutionChange('CARDS');
            }}
            style={{ pointerEvents: 'auto', zIndex: 20 }}
          >
            <FaClone className="resolution-icon" />
            <span>Cards</span>
          </button>
          <button
            className={`resolution-option ${currentResolution === 'COINS' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Healing Coins button clicked');
              handleResolutionChange('COINS');
            }}
            style={{ pointerEvents: 'auto', zIndex: 20 }}
          >
            <FaCoins className="resolution-icon" />
            <span>Coins</span>
          </button>
        </div>

        {/* Count Configuration for Cards/Coins */}
        {currentResolution === 'CARDS' && (
          <div className="count-config-section">
            <label htmlFor="healing-card-draw-count">Cards Drawn:</label>
            <input
              id="healing-card-draw-count"
              type="number"
              min="1"
              max="10"
              value={healingConfig.cardConfig?.drawCount || drawCount || 3}
              onChange={(e) => {
                const newDrawCount = parseInt(e.target.value) || 3;
                setDrawCount(newDrawCount);
                handleHealingConfigChange('cardConfig', {
                  ...healingConfig.cardConfig,
                  drawCount: newDrawCount,
                  formula: healingConfig.cardConfig?.formula || 'CARD_VALUE + HEA'
                });
              }}
              className="count-input"
            />
          </div>
        )}

        {currentResolution === 'COINS' && (
          <div className="count-config-section">
            <label htmlFor="healing-coin-flip-count">Coins Flipped:</label>
            <input
              id="healing-coin-flip-count"
              type="number"
              min="1"
              max="10"
              value={healingConfig.coinConfig?.flipCount || 5}
              onChange={(e) => {
                const flipCount = parseInt(e.target.value) || 5;
                handleHealingConfigChange('coinConfig', {
                  ...healingConfig.coinConfig,
                  flipCount: flipCount,
                  formula: healingConfig.coinConfig?.formula || 'HEADS_COUNT * 7 + HEA'
                });
              }}
              className="count-input"
            />
          </div>
        )}

        {/* Resolution-specific configuration */}
        <div className="resolution-config-section">
          {/* Formula Input - Show for direct healing, shield types, and healing over time */}
          {(healingConfig.healingType === 'direct' || healingConfig.healingType === 'shield' || healingConfig.healingType === 'hot') && (
            <div className="formula-input-section">
              <h4>Formula</h4>
              <textarea
                value={
                  healingConfig.healingType === 'hot' ? (
                    currentResolution === 'CARDS'
                      ? (healingConfig.hotCardConfig?.formula || 'CARD_VALUE/2 + HEA/2')
                      : currentResolution === 'COINS'
                      ? (healingConfig.hotCoinConfig?.formula || 'HEADS_COUNT * 2 + HEA/2')
                      : (healingConfig.hotFormula || '1d4 + HEA/2')
                  ) : healingConfig.healingType === 'shield' ? (
                    currentResolution === 'CARDS'
                      ? (healingConfig.shieldCardConfig?.formula || 'CARD_VALUE + HEA')
                      : currentResolution === 'COINS'
                      ? (healingConfig.shieldCoinConfig?.formula || 'HEADS_COUNT * 3 + HEA')
                      : (healingConfig.shieldFormula || '2d6 + HEA')
                  ) : (
                    currentResolution === 'CARDS'
                      ? (healingConfig.cardConfig?.formula || 'CARD_VALUE + HEA')
                      : currentResolution === 'COINS'
                      ? (healingConfig.coinConfig?.formula || 'HEADS_COUNT * 3 + HEA')
                      : (healingConfig.formula || '1d8 + HEA')
                  )
                }
                onChange={(e) => handleFormulaChange(e.target.value)}
                placeholder={`Enter ${currentResolution.toLowerCase()} formula`}
                className="main-formula-input"
                rows="2"
              />
            </div>
          )}

          {/* Shield Properties Configuration - Show for shield healing type */}
          {healingConfig.healingType === 'shield' && (
            <div className="shield-properties-section">
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
                    <select className="shield-select">
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
            </div>
          )}

          {/* Duration Configuration - Show for healing over time */}
          {healingConfig.healingType === 'hot' && (
            <div className="formula-input-section">
              <h4>Duration</h4>
              <div className="hot-duration-controls">
                <input
                  type="number"
                  value={healingConfig.hotDuration || 3}
                  onChange={(e) => handleHealingConfigChange('hotDuration', parseInt(e.target.value, 10))}
                  min="1"
                  max="10"
                  className="hot-input"
                />
                <select
                  value={healingConfig.hotTickType || 'round'}
                  onChange={(e) => handleHealingConfigChange('hotTickType', e.target.value)}
                  className="hot-select"
                >
                  <option value="round">Rounds</option>
                  <option value="turn">Turns</option>
                  <option value="minute">Minutes</option>
                </select>
              </div>
            </div>
          )}

          {/* Progressive HoT Configuration - Show for primary HoT */}
          {healingConfig.healingType === 'hot' && (
            <div className="progressive-buff-config">
              <h4>Progressive HoT Configuration</h4>
              <p className="stage-description">Configure custom formulas for each turn of healing over time</p>
              <div className="config-option">
                <div className="toggle-options">
                  <div className="toggle-option">
                    <button
                      className={`pf-button ${healingConfig.isProgressiveHot ? 'active' : ''}`}
                      onClick={() => {
                        const newValue = !healingConfig.isProgressiveHot;

                        // Create a complete new config object
                        const newConfig = {
                          ...healingConfig,
                          isProgressiveHot: newValue,
                          hotScalingType: newValue ? 'progressive' : 'flat'
                        };

                        if (newValue) {
                          // Create stages for each turn of the duration
                          const duration = healingConfig.hotDuration || 3;
                          const baseFormula = currentResolution === 'CARDS'
                            ? (healingConfig.hotCardConfig?.formula || 'CARD_VALUE/2 + HEA/2')
                            : currentResolution === 'COINS'
                            ? (healingConfig.hotCoinConfig?.formula || 'HEADS_COUNT * 2 + HEA/2')
                            : (healingConfig.hotFormula || '1d4 + HEA/2');

                          // Create stages for each turn of the duration
                          const stages = [];
                          for (let i = 1; i <= duration; i++) {
                            stages.push({
                              turn: i,
                              formula: baseFormula,
                              spellEffect: null
                            });
                          }
                          newConfig.hotProgressiveStages = stages;
                        }

                        // Update both local and global state
                        setHealingConfig(newConfig);
                        dispatch(actionCreators.updateHealingConfig(newConfig));
                      }}
                    >
                      <div className="toggle-icon">
                        {healingConfig.isProgressiveHot ? '✓' : ''}
                      </div>
                      <span>Enable Progressive HoT</span>
                    </button>
                  </div>
                </div>
              </div>

              {healingConfig.isProgressiveHot && (
                <div className="progressive-stages">
                  <h4>HoT Stages</h4>
                  <div className="stage-list">
                    {(healingConfig.hotProgressiveStages || []).map((stage, index) => {
                      const tickFrequency = healingConfig.hotTickType || 'round';
                      const unitLabel = tickFrequency === 'round' ? 'Round' :
                                       tickFrequency === 'turn' ? 'Turn' :
                                       tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

                      return (
                        <div key={index} className="progressive-stage">
                          <div className="stage-header">
                            <h5>{unitLabel} {stage.turn}</h5>
                          </div>
                          <div className="stage-content">
                            <div className="stage-formula">
                              <label>Formula:</label>
                              <input
                                type="text"
                                value={stage.formula || ''}
                                onChange={(e) => {
                                  const newStages = [...(healingConfig.hotProgressiveStages || [])];
                                  newStages[index] = { ...newStages[index], formula: e.target.value };
                                  const newConfig = { ...healingConfig, hotProgressiveStages: newStages };
                                  setHealingConfig(newConfig);
                                  dispatch(actionCreators.updateHealingConfig(newConfig));
                                }}
                                placeholder="Enter formula for this turn"
                                className="stage-formula-input"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Formula Examples - Show for direct healing, shield types, and healing over time */}
          {(healingConfig.healingType === 'direct' || healingConfig.healingType === 'shield' || healingConfig.healingType === 'hot') && currentResolution === 'DICE' && (
            <div className="dice-examples-section">
              <h5>Dice Formula Examples</h5>
              <div className="examples-grid">
                {(healingConfig.healingType === 'hot' ? hotFormulaExamples :
                  healingConfig.healingType === 'shield' ? shieldFormulaExamples : formulaExamples).slice(0, 8).map((example, index) => (
                  <button
                    key={index}
                    className={`example-card ${
                      healingConfig.healingType === 'hot'
                        ? healingConfig.hotFormula === example.formula
                        : healingConfig.healingType === 'shield'
                        ? healingConfig.shieldFormula === example.formula
                        : healingConfig.formula === example.formula
                    } ? 'active' : ''`}
                    onClick={() => handleFormulaChange(example.formula)}
                  >
                    <div className="example-title">{example.name}</div>
                    <div className="example-desc">{example.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(healingConfig.healingType === 'direct' || healingConfig.healingType === 'shield' || healingConfig.healingType === 'hot') && currentResolution === 'CARDS' && (
            <div className="card-examples-section">
              <h5>Card Formula Examples</h5>
              <div className="examples-grid">
                {(healingConfig.healingType === 'hot' ? hotFormulaExamples :
                  healingConfig.healingType === 'shield' ? shieldFormulaExamples : formulaExamples).slice(0, 10).map((example, index) => (
                  <button
                    key={index}
                    className={`example-card ${
                      healingConfig.healingType === 'hot'
                        ? healingConfig.hotCardConfig?.formula === example.formula
                        : healingConfig.healingType === 'shield'
                        ? healingConfig.shieldCardConfig?.formula === example.formula
                        : healingConfig.cardConfig?.formula === example.formula
                    } ? 'active' : ''`}
                    onClick={() => handleFormulaChange(example.formula)}
                  >
                    <div className="example-title">{example.name}</div>
                    <div className="example-desc">{example.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(healingConfig.healingType === 'direct' || healingConfig.healingType === 'shield' || healingConfig.healingType === 'hot') && currentResolution === 'COINS' && (
            <div className="coin-examples-section">
              <h5>Coin Formula Examples</h5>
              <div className="examples-grid">
                {(healingConfig.healingType === 'hot' ? hotFormulaExamples :
                  healingConfig.healingType === 'shield' ? shieldFormulaExamples : formulaExamples).slice(0, 10).map((example, index) => (
                  <button
                    key={index}
                    className={`example-card ${
                      healingConfig.healingType === 'hot'
                        ? healingConfig.hotCoinConfig?.formula === example.formula
                        : healingConfig.healingType === 'shield'
                        ? healingConfig.shieldCoinConfig?.formula === example.formula
                        : healingConfig.coinConfig?.formula === example.formula
                    } ? 'active' : ''`}
                    onClick={() => handleFormulaChange(example.formula)}
                  >
                    <div className="example-title">{example.name}</div>
                    <div className="example-desc">{example.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Visual resolution mechanics display based on selected type */}
        <div className="visual-resolution-display">
          {currentResolution === 'DICE' && (
            <div className="dice-info-section">
              <h4>Dice Resolution</h4>
              <p>Healing is calculated using dice rolls with the formula: <code>{
                healingConfig.healingType === 'hot'
                  ? (healingConfig.hotFormula || '1d4 + HEA/2')
                  : healingConfig.formula
              }</code></p>
            </div>
          )}

          {currentResolution === 'DICE' && (
            <div>
              {/* Character Variables for Dice */}
              <div className="character-variables-section">
                <h5>Character Variables</h5>

                <div className="character-variables-compact">
                  {/* Core Attributes */}
                  <div className="variable-category">
                    <h6>Core Attributes</h6>
                    <div className="variables-grid">
                      {['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'].map(attr => (
                        <button
                          key={attr}
                          className="variable-button"
                          onClick={() => addToFormula(attr)}
                        >
                          {attr.charAt(0).toUpperCase() + attr.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Healing Stats */}
                  <div className="variable-category">
                    <h6>Healing Stats</h6>
                    <div className="variables-grid">
                      {['healingPower', 'maxHealth', 'maxMana', 'healthRegen', 'manaRegen'].map(stat => (
                        <button
                          key={stat}
                          className="variable-button"
                          onClick={() => addToFormula(stat)}
                        >
                          {stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Resources */}
                  <div className="variable-category">
                    <h6>Current Resources</h6>
                    <div className="variables-grid">
                      {['currentHealth', 'currentMana', 'currentActionPoints', 'exhaustionLevel'].map(stat => (
                        <button
                          key={stat}
                          className="variable-button"
                          onClick={() => addToFormula(stat)}
                        >
                          {stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resolution-Specific Variables */}
                {currentResolution === 'DICE' && (
                  <div className="variable-category dice-variables-section">
                    <h6>Dice Variables</h6>
                    <div className="variables-grid">
                      {['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '2d6', '3d6'].map(dice => (
                        <button
                          key={dice}
                          className="variable-button resolution-specific"
                          onClick={() => addToFormula(dice)}
                        >
                          {dice}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentResolution === 'DICE' && (
                  <div className="variable-category dice-functions-section">
                    <h6>Dice Functions</h6>
                    <div className="variables-grid">
                      {['DICE_COUNT', 'DICE_SIDES', 'TOTAL_ROLL', 'HIGHEST_DIE', 'LOWEST_DIE', 'CRITICAL_HEALS'].map(variable => (
                        <button
                          key={variable}
                          className="variable-button resolution-specific"
                          onClick={() => addToFormula(variable)}
                        >
                          {variable.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentResolution === 'CARDS' && (
            <div className="card-display">

              {/* Card Variables */}
              <div className="character-variables-section">
                <h5>Card Variables</h5>

                <div className="character-variables-compact">
                  {/* Core Attributes */}
                  <div className="variable-category">
                    <h6>Core Attributes</h6>
                    <div className="variables-grid">
                      {['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'].map(attr => (
                        <button
                          key={attr}
                          className="variable-button"
                          onClick={() => addToFormula(attr)}
                        >
                          {attr.charAt(0).toUpperCase() + attr.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Healing Stats */}
                  <div className="variable-category">
                    <h6>Healing Stats</h6>
                    <div className="variables-grid">
                      {['healingPower', 'maxHealth', 'maxMana', 'healthRegen', 'manaRegen'].map(stat => (
                        <button
                          key={stat}
                          className="variable-button"
                          onClick={() => addToFormula(stat)}
                        >
                          {stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Resources */}
                  <div className="variable-category">
                    <h6>Current Resources</h6>
                    <div className="variables-grid">
                      {['currentHealth', 'currentMana', 'currentActionPoints', 'exhaustionLevel'].map(stat => (
                        <button
                          key={stat}
                          className="variable-button"
                          onClick={() => addToFormula(stat)}
                        >
                          {stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card-Specific Variables */}
                <div className="variable-category">
                  <h6>Card Variables</h6>
                  <div className="variables-grid">
                    {['CARD_VALUE', 'FACE_CARDS', 'ACES', 'HIGHEST_CARD', 'RED_COUNT', 'BLACK_COUNT', 'SUIT_COUNT', 'PAIRS', 'SAME_SUIT', 'FLUSH', 'STRAIGHT', 'ROYAL_FLUSH', 'POKER_HAND_RANK'].map(variable => (
                      <button
                        key={variable}
                        className="variable-button resolution-specific"
                        onClick={() => addToFormula(variable)}
                      >
                        {variable.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
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

              {/* Coin Variables */}
              <div className="character-variables-section">
                <h5>Coin Variables</h5>

                <div className="character-variables-compact">
                  {/* Core Attributes */}
                  <div className="variable-category">
                    <h6>Core Attributes</h6>
                    <div className="variables-grid">
                      {['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'].map(attr => (
                        <button
                          key={attr}
                          className="variable-button"
                          onClick={() => addToFormula(attr)}
                        >
                          {attr.charAt(0).toUpperCase() + attr.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Healing Stats */}
                  <div className="variable-category">
                    <h6>Healing Stats</h6>
                    <div className="variables-grid">
                      {['healingPower', 'maxHealth', 'maxMana', 'healthRegen', 'manaRegen'].map(stat => (
                        <button
                          key={stat}
                          className="variable-button"
                          onClick={() => addToFormula(stat)}
                        >
                          {stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Resources */}
                  <div className="variable-category">
                    <h6>Current Resources</h6>
                    <div className="variables-grid">
                      {['currentHealth', 'currentMana', 'currentActionPoints', 'exhaustionLevel'].map(stat => (
                        <button
                          key={stat}
                          className="variable-button"
                          onClick={() => addToFormula(stat)}
                        >
                          {stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Coin-Specific Variables */}
                <div className="variable-category">
                  <h6>Coin Variables</h6>
                  <div className="variables-grid">
                    {['HEADS_COUNT', 'TAILS_COUNT', 'ALL_HEADS', 'ALL_TAILS', 'LONGEST_STREAK', 'ALTERNATING_PATTERN', 'COIN_COUNT'].map(variable => (
                      <button
                        key={variable}
                        className="variable-button resolution-specific"
                        onClick={() => addToFormula(variable)}
                      >
                        {variable.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>



            </div>
          )}
        </div>
      </div>



      {/* Additional formula sections for combined effects */}
      {healingConfig.healingType === 'direct' && healingConfig.hasHotEffect && (
        <div className="hot-config section">
          <h3>Healing Over Time Configuration</h3>

          {/* HoT Formula */}
          <div className="formula-input-section">
            <h4>Formula</h4>
            <textarea
              value={
                currentResolution === 'CARDS'
                  ? (healingConfig.hotCardConfig?.formula || '')
                  : currentResolution === 'COINS'
                  ? (healingConfig.hotCoinConfig?.formula || '')
                  : (healingConfig.hotFormula || '')
              }
              onChange={(e) => handleHotFormulaChange(e.target.value)}
              placeholder={`Enter ${currentResolution.toLowerCase()} formula`}
              className="main-formula-input"
              rows="2"
            />
          </div>

          {/* HoT Duration Configuration */}
          <div className="formula-input-section">
            <h4>Duration</h4>
            <div className="hot-duration-controls">
              <input
                type="number"
                value={healingConfig.hotDuration || 3}
                onChange={(e) => handleHealingConfigChange('hotDuration', parseInt(e.target.value, 10))}
                min="1"
                max="10"
                className="hot-input"
              />
              <select
                value={healingConfig.hotTickType || 'round'}
                onChange={(e) => handleHealingConfigChange('hotTickType', e.target.value)}
                className="hot-select"
              >
                <option value="round">Rounds</option>
                <option value="turn">Turns</option>
                <option value="minute">Minutes</option>
              </select>
            </div>
          </div>

          {/* Count Configuration for HoT Cards/Coins */}
          {currentResolution === 'CARDS' && (
            <div className="count-config-section">
              <label htmlFor="hot-card-draw-count">Cards Drawn (HoT):</label>
              <input
                id="hot-card-draw-count"
                type="number"
                min="1"
                max="10"
                value={healingConfig.hotCardConfig?.drawCount || 3}
                onChange={(e) => {
                  const drawCount = parseInt(e.target.value) || 3;
                  handleHealingConfigChange('hotCardConfig', {
                    ...healingConfig.hotCardConfig,
                    drawCount: drawCount,
                    formula: healingConfig.hotCardConfig?.formula || 'CARD_VALUE/2 + HEA/2'
                  });
                }}
                className="count-input"
              />
            </div>
          )}

          {currentResolution === 'COINS' && (
            <div className="count-config-section">
              <label htmlFor="hot-coin-flip-count">Coins Flipped (HoT):</label>
              <input
                id="hot-coin-flip-count"
                type="number"
                min="1"
                max="10"
                value={healingConfig.hotCoinConfig?.flipCount || 4}
                onChange={(e) => {
                  const flipCount = parseInt(e.target.value) || 4;
                  handleHealingConfigChange('hotCoinConfig', {
                    ...healingConfig.hotCoinConfig,
                    flipCount: flipCount,
                    formula: healingConfig.hotCoinConfig?.formula || 'HEADS_COUNT * 2 + HEA/2'
                  });
                }}
                className="count-input"
              />
            </div>
          )}

          {/* Progressive HoT Configuration */}
          <div className="progressive-buff-config">
            <h4>Progressive HoT Configuration</h4>
            <p className="stage-description">Configure custom formulas for each turn of healing over time</p>
            <div className="config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`pf-button ${healingConfig.isProgressiveHot ? 'active' : ''}`}
                    onClick={() => {
                      const newValue = !healingConfig.isProgressiveHot;

                      // Create a complete new config object
                      const newConfig = {
                        ...healingConfig,
                        isProgressiveHot: newValue,
                        hotScalingType: newValue ? 'progressive' : 'flat'
                      };

                      if (newValue) {
                        // Create stages for each turn of the duration
                        const duration = healingConfig.hotDuration || 3;
                        const baseFormula = currentResolution === 'CARDS'
                          ? (healingConfig.hotCardConfig?.formula || 'CARD_VALUE/2 + HEA/2')
                          : currentResolution === 'COINS'
                          ? (healingConfig.hotCoinConfig?.formula || 'HEADS_COUNT * 2 + HEA/2')
                          : (healingConfig.hotFormula || '1d4 + HEA/2');

                        // Create stages for each turn of the duration
                        const stages = [];
                        for (let i = 1; i <= duration; i++) {
                          stages.push({
                            turn: i,
                            formula: baseFormula,
                            spellEffect: null
                          });
                        }
                        newConfig.hotProgressiveStages = stages;
                      }

                      // Update both local and global state
                      setHealingConfig(newConfig);
                      dispatch(actionCreators.updateHealingConfig(newConfig));
                    }}
                  >
                    <div className="toggle-icon">
                      {healingConfig.isProgressiveHot ? '✓' : ''}
                    </div>
                    <span>Enable Progressive HoT</span>
                  </button>
                </div>
              </div>
            </div>

            {healingConfig.isProgressiveHot && (
              <div className="progressive-stages">
                <h4>HoT Stages</h4>
                <div className="stage-list">
                  {(healingConfig.hotProgressiveStages || []).map((stage, index) => {
                    const tickFrequency = healingConfig.hotTickType || 'round';
                    const unitLabel = tickFrequency === 'round' ? 'Round' :
                                     tickFrequency === 'turn' ? 'Turn' :
                                     tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

                    return (
                      <div key={index} className="progressive-stage">
                        <div className="stage-header">
                          <h5>{unitLabel} {stage.turn}</h5>
                        </div>
                        <div className="stage-content">
                          <div className="stage-formula">
                            <label>Formula:</label>
                            <input
                              type="text"
                              value={stage.formula || ''}
                              onChange={(e) => {
                                const newStages = [...(healingConfig.hotProgressiveStages || [])];
                                newStages[index] = { ...newStages[index], formula: e.target.value };
                                const newConfig = { ...healingConfig, hotProgressiveStages: newStages };
                                setHealingConfig(newConfig);
                                dispatch(actionCreators.updateHealingConfig(newConfig));
                              }}
                              placeholder="Enter formula for this turn"
                              className="stage-formula-input"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HoT + Shield Configuration */}
      {healingConfig.healingType === 'hot' && healingConfig.hasShieldEffect && (
        <div className="shield-config section">
          <h3>Shield Configuration</h3>

          {/* Shield Formula */}
          <div className="formula-input-section">
            <h4>Formula</h4>
            <textarea
              value={
                currentResolution === 'CARDS'
                  ? (healingConfig.shieldCardConfig?.formula || '')
                  : currentResolution === 'COINS'
                  ? (healingConfig.shieldCoinConfig?.formula || '')
                  : (healingConfig.shieldFormula || '')
              }
              onChange={(e) => handleShieldFormulaChange(e.target.value)}
              placeholder={`Enter ${currentResolution.toLowerCase()} formula`}
              className="main-formula-input"
              rows="2"
            />
          </div>

          {/* Shield Properties Configuration */}
          <div className="shield-properties-section">
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
                  <select className="shield-select">
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
          </div>

          {/* Count Configuration for Shield Cards/Coins */}
          {currentResolution === 'CARDS' && (
            <div className="count-config-section">
              <label htmlFor="shield-card-draw-count-hot">Cards Drawn (Shield):</label>
              <input
                id="shield-card-draw-count-hot"
                type="number"
                min="1"
                max="10"
                value={healingConfig.shieldCardConfig?.drawCount || 3}
                onChange={(e) => {
                  const drawCount = parseInt(e.target.value) || 3;
                  handleHealingConfigChange('shieldCardConfig', {
                    ...healingConfig.shieldCardConfig,
                    drawCount: drawCount,
                    formula: healingConfig.shieldCardConfig?.formula || 'CARD_VALUE + HEA'
                  });
                }}
                className="count-input"
              />
            </div>
          )}

          {currentResolution === 'COINS' && (
            <div className="count-config-section">
              <label htmlFor="shield-coin-flip-count-hot">Coins Flipped (Shield):</label>
              <input
                id="shield-coin-flip-count-hot"
                type="number"
                min="1"
                max="10"
                value={healingConfig.shieldCoinConfig?.flipCount || 4}
                onChange={(e) => {
                  const flipCount = parseInt(e.target.value) || 4;
                  handleHealingConfigChange('shieldCoinConfig', {
                    ...healingConfig.shieldCoinConfig,
                    flipCount: flipCount,
                    formula: healingConfig.shieldCoinConfig?.formula || 'HEADS_COUNT * 7 + HEA'
                  });
                }}
                className="count-input"
              />
            </div>
          )}
        </div>
      )}

      {/* Shield + HoT Configuration */}
      {healingConfig.healingType === 'shield' && healingConfig.hasHotEffect && (
        <div className="hot-config section">
          <h3>Healing Over Time Configuration</h3>

          {/* HoT Formula */}
          <div className="formula-input-section">
            <h4>Formula</h4>
            <textarea
              value={
                currentResolution === 'CARDS'
                  ? (healingConfig.hotCardConfig?.formula || '')
                  : currentResolution === 'COINS'
                  ? (healingConfig.hotCoinConfig?.formula || '')
                  : (healingConfig.hotFormula || '')
              }
              onChange={(e) => handleHotFormulaChange(e.target.value)}
              placeholder={`Enter ${currentResolution.toLowerCase()} formula`}
              className="main-formula-input"
              rows="2"
            />
          </div>

          {/* HoT Duration Configuration */}
          <div className="formula-input-section">
            <h4>Duration</h4>
            <div className="hot-duration-controls">
              <input
                type="number"
                value={healingConfig.hotDuration || 3}
                onChange={(e) => handleHealingConfigChange('hotDuration', parseInt(e.target.value, 10))}
                min="1"
                max="10"
                className="hot-input"
              />
              <select
                value={healingConfig.hotTickType || 'round'}
                onChange={(e) => handleHealingConfigChange('hotTickType', e.target.value)}
                className="hot-select"
              >
                <option value="round">Rounds</option>
                <option value="turn">Turns</option>
                <option value="minute">Minutes</option>
              </select>
            </div>
          </div>

          {/* Count Configuration for HoT Cards/Coins */}
          {currentResolution === 'CARDS' && (
            <div className="count-config-section">
              <label htmlFor="hot-card-draw-count-shield">Cards Drawn (HoT):</label>
              <input
                id="hot-card-draw-count-shield"
                type="number"
                min="1"
                max="10"
                value={healingConfig.hotCardConfig?.drawCount || 3}
                onChange={(e) => {
                  const drawCount = parseInt(e.target.value) || 3;
                  handleHealingConfigChange('hotCardConfig', {
                    ...healingConfig.hotCardConfig,
                    drawCount: drawCount,
                    formula: healingConfig.hotCardConfig?.formula || 'CARD_VALUE/2 + HEA/2'
                  });
                }}
                className="count-input"
              />
            </div>
          )}

          {currentResolution === 'COINS' && (
            <div className="count-config-section">
              <label htmlFor="hot-coin-flip-count-shield">Coins Flipped (HoT):</label>
              <input
                id="hot-coin-flip-count-shield"
                type="number"
                min="1"
                max="10"
                value={healingConfig.hotCoinConfig?.flipCount || 4}
                onChange={(e) => {
                  const flipCount = parseInt(e.target.value) || 4;
                  handleHealingConfigChange('hotCoinConfig', {
                    ...healingConfig.hotCoinConfig,
                    flipCount: flipCount,
                    formula: healingConfig.hotCoinConfig?.formula || 'HEADS_COUNT * 2 + HEA/2'
                  });
                }}
                className="count-input"
              />
            </div>
          )}

          {/* Progressive HoT Configuration */}
          <div className="progressive-buff-config">
            <h4>Progressive HoT Configuration</h4>
            <p className="stage-description">Configure custom formulas for each turn of healing over time</p>
            <div className="config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`pf-button ${healingConfig.isProgressiveHot ? 'active' : ''}`}
                    onClick={() => {
                      const newValue = !healingConfig.isProgressiveHot;

                      // Create a complete new config object
                      const newConfig = {
                        ...healingConfig,
                        isProgressiveHot: newValue,
                        hotScalingType: newValue ? 'progressive' : 'flat'
                      };

                      if (newValue) {
                        // Create stages for each turn of the duration
                        const duration = healingConfig.hotDuration || 3;
                        const baseFormula = currentResolution === 'CARDS'
                          ? (healingConfig.hotCardConfig?.formula || 'CARD_VALUE/2 + HEA/2')
                          : currentResolution === 'COINS'
                          ? (healingConfig.hotCoinConfig?.formula || 'HEADS_COUNT * 2 + HEA/2')
                          : (healingConfig.hotFormula || '1d4 + HEA/2');

                        // Create stages for each turn of the duration
                        const stages = [];
                        for (let i = 1; i <= duration; i++) {
                          stages.push({
                            turn: i,
                            formula: baseFormula,
                            spellEffect: null
                          });
                        }
                        newConfig.hotProgressiveStages = stages;
                      }

                      // Update both local and global state
                      setHealingConfig(newConfig);
                      dispatch(actionCreators.updateHealingConfig(newConfig));
                    }}
                  >
                    <div className="toggle-icon">
                      {healingConfig.isProgressiveHot ? '✓' : ''}
                    </div>
                    <span>Enable Progressive HoT</span>
                  </button>
                </div>
              </div>
            </div>

            {healingConfig.isProgressiveHot && (
              <div className="progressive-stages">
                <h4>HoT Stages</h4>
                <div className="stage-list">
                  {(healingConfig.hotProgressiveStages || []).map((stage, index) => {
                    const tickFrequency = healingConfig.hotTickType || 'round';
                    const unitLabel = tickFrequency === 'round' ? 'Round' :
                                     tickFrequency === 'turn' ? 'Turn' :
                                     tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

                    return (
                      <div key={index} className="progressive-stage">
                        <div className="stage-header">
                          <h5>{unitLabel} {stage.turn}</h5>
                        </div>
                        <div className="stage-content">
                          <div className="stage-formula">
                            <label>Formula:</label>
                            <input
                              type="text"
                              value={stage.formula || ''}
                              onChange={(e) => {
                                const newStages = [...(healingConfig.hotProgressiveStages || [])];
                                newStages[index] = { ...newStages[index], formula: e.target.value };
                                const newConfig = { ...healingConfig, hotProgressiveStages: newStages };
                                setHealingConfig(newConfig);
                                dispatch(actionCreators.updateHealingConfig(newConfig));
                              }}
                              placeholder="Enter formula for this turn"
                              className="stage-formula-input"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Direct + Shield Configuration */}
      {healingConfig.healingType === 'direct' && healingConfig.hasShieldEffect && (
        <div className="shield-config section">
          <h3>Shield Configuration</h3>

          {/* Shield Formula */}
          <div className="formula-input-section">
            <h4>Formula</h4>
            <textarea
              value={
                currentResolution === 'CARDS'
                  ? (healingConfig.shieldCardConfig?.formula || '')
                  : currentResolution === 'COINS'
                  ? (healingConfig.shieldCoinConfig?.formula || '')
                  : (healingConfig.shieldFormula || '')
              }
              onChange={(e) => handleShieldFormulaChange(e.target.value)}
              placeholder={`Enter ${currentResolution.toLowerCase()} formula`}
              className="main-formula-input"
              rows="2"
            />
          </div>

          {/* Shield Properties Configuration */}
          <div className="shield-properties-section">
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
                  <select className="shield-select">
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
          </div>

          {/* Count Configuration for Shield Cards/Coins */}
          {currentResolution === 'CARDS' && (
            <div className="count-config-section">
              <label htmlFor="shield-card-draw-count-direct">Cards Drawn (Shield):</label>
              <input
                id="shield-card-draw-count-direct"
                type="number"
                min="1"
                max="10"
                value={healingConfig.shieldCardConfig?.drawCount || 3}
                onChange={(e) => {
                  const drawCount = parseInt(e.target.value) || 3;
                  handleHealingConfigChange('shieldCardConfig', {
                    ...healingConfig.shieldCardConfig,
                    drawCount: drawCount,
                    formula: healingConfig.shieldCardConfig?.formula || 'CARD_VALUE + HEA'
                  });
                }}
                className="count-input"
              />
            </div>
          )}

          {currentResolution === 'COINS' && (
            <div className="count-config-section">
              <label htmlFor="shield-coin-flip-count-direct">Coins Flipped (Shield):</label>
              <input
                id="shield-coin-flip-count-direct"
                type="number"
                min="1"
                max="10"
                value={healingConfig.shieldCoinConfig?.flipCount || 4}
                onChange={(e) => {
                  const flipCount = parseInt(e.target.value) || 4;
                  handleHealingConfigChange('shieldCoinConfig', {
                    ...healingConfig.shieldCoinConfig,
                    flipCount: flipCount,
                    formula: healingConfig.shieldCoinConfig?.formula || 'HEADS_COUNT * 7 + HEA'
                  });
                }}
                className="count-input"
              />
            </div>
          )}
        </div>
      )}

      {/* Mechanics Configuration Buttons */}
      <div className="mechanics-buttons-section section">
        <h3>Advanced Mechanics</h3>
        <div className="mechanics-buttons-grid">
          <button
            className={`mechanics-config-button ${healingConfig.criticalConfig?.enabled ? 'active' : ''}`}
            onClick={() => setShowCriticalHitPopup(true)}
          >
            <FaCog className="mechanics-button-icon" />
            <div className="mechanics-button-content">
              <h4>Critical Healing</h4>
              <p>{healingConfig.criticalConfig?.enabled ? 'Configured' : 'Configure critical healing mechanics'}</p>
            </div>
          </button>

          <button
            className={`mechanics-config-button ${healingConfig.chanceOnHitConfig?.enabled ? 'active' : ''}`}
            onClick={() => setShowChanceOnHitPopup(true)}
          >
            <FaCog className="mechanics-button-icon" />
            <div className="mechanics-button-content">
              <h4>Chance on Heal</h4>
              <p>{healingConfig.chanceOnHitConfig?.enabled ? 'Configured' : 'Configure chance-based healing effects'}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Math Help Modal */}
      <MathHelpModal
        show={showMathHelp}
        onHide={() => setShowMathHelp(false)}
        currentResolution={currentResolution}
        formulaType="healing"
      />

      {/* Critical Hit Configuration Popup */}
      <MechanicsPopup
        show={showCriticalHitPopup}
        onHide={() => setShowCriticalHitPopup(false)}
        title="Critical Healing Configuration"
        size="large"
      >
        <CriticalHitConfig
          config={healingConfig.criticalConfig || {
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
          }}
          onConfigChange={(critConfig) => {
            const newConfig = { ...healingConfig };
            newConfig.criticalConfig = critConfig;
            setHealingConfig(newConfig);
            dispatch(actionCreators.updateHealingConfig(newConfig));
          }}
          effectType="healing"
        />
      </MechanicsPopup>

      {/* Chance on Hit Configuration Popup */}
      <MechanicsPopup
        show={showChanceOnHitPopup}
        onHide={() => setShowChanceOnHitPopup(false)}
        title="Chance on Heal Configuration"
        size="large"
      >
        <ChanceOnHitConfig
          config={healingConfig.chanceOnHitConfig || {
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
          }}
          onConfigChange={(chanceConfig) => {
            const newConfig = { ...healingConfig };
            newConfig.chanceOnHitConfig = chanceConfig;
            setHealingConfig(newConfig);
            dispatch(actionCreators.updateHealingConfig(newConfig));
          }}
          effectType="healing"
        />
      </MechanicsPopup>



      {/* Unified Tooltip */}
      <UnifiedTooltip
        content={tooltipState.content}
        title={tooltipState.title}
        icon={tooltipState.icon}
        isVisible={tooltipState.isVisible}
        position={tooltipState.position}
        variant={tooltipState.variant}
      />
    </div>
  );
};

export default HealingEffects;