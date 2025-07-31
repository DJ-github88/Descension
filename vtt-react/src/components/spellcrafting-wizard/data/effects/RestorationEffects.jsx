import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaHeart, FaDroplet, FaBolt, FaFire, FaShield, FaHeartPulse, FaGaugeHigh, FaGauge, FaChevronDown } from 'react-icons/fa6';
import IconSelectionCard from '../../components/common/IconSelectionCard';
import FormulaEditor from '../../components/mechanics/FormulaEditor';
import ResolutionSelector from '../../components/mechanics/ResolutionSelector';

import './restoration-effects.css';
<<<<<<< HEAD:src/components/spellcrafting-wizard/data/effects/RestorationEffects.jsx
=======
import { ALL_VARIABLES, VARIABLE_CATEGORIES } from '../../core/data/formulaVariables';
>>>>>>> Spell:vtt-react/src/components/spellcrafting-wizard/data/effects/RestorationEffects.jsx

// Pathfinder styles imported via main.css


// Helper function to get icon URL
const getIconUrl = (iconName) => {
  return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
};

// Variable definitions for stats and attributes
const STAT_VARIABLES = {
  // Primary Attributes
  STR: { name: 'Strength', description: 'Physical power and melee damage' },
  AGI: { name: 'Agility', description: 'Dexterity and reflexes' },
  CON: { name: 'Constitution', description: 'Health and stamina' },
  INT: { name: 'Intelligence', description: 'Magical power and knowledge' },
  WIS: { name: 'Wisdom', description: 'Perception and insight' },
  SPIR: { name: 'Spirit', description: 'Willpower and spiritual energy' },
  CHA: { name: 'Charisma', description: 'Social influence and leadership' },

  // Resources
  CHP: { name: 'Current Health', description: 'Current health points' },
  MHP: { name: 'Maximum Health', description: 'Maximum health points' },
  CMP: { name: 'Current Mana', description: 'Current mana points' },
  MMP: { name: 'Maximum Mana', description: 'Maximum mana points' },
  CINF: { name: 'Current Inferno', description: 'Current inferno points' },
  MINF: { name: 'Maximum Inferno', description: 'Maximum inferno points' },
  CAP: { name: 'Current Action', description: 'Current action points' },
  MAP: { name: 'Maximum Action', description: 'Maximum action points' },

  // Recovery
  HR: { name: 'Health Regen', description: 'Health regeneration per round' },
  MR: { name: 'Mana Regen', description: 'Mana regeneration per round' },
  IR: { name: 'Inferno Regen', description: 'Inferno regeneration per round' },
  APR: { name: 'Action Recovery', description: 'Action point recovery per round' },

  // Combat Variables
  LEVEL: { name: 'Level', description: 'Character level' },
  ROUND: { name: 'Round', description: 'Current combat round' },
  TURN: { name: 'Turn', description: 'Current turn in combat' },
  COMBO: { name: 'Combo Points', description: 'Current combo points' },

  // Math Functions
  'MAX(a, b)': { name: 'Maximum', description: 'Maximum of two values' },
  'MIN(a, b)': { name: 'Minimum', description: 'Minimum of two values' },
  'FLOOR(a)': { name: 'Floor', description: 'Round down to nearest integer' },
  'CEIL(a)': { name: 'Ceiling', description: 'Round up to nearest integer' },
  'ROUND(a)': { name: 'Round', description: 'Round to nearest integer' },
  'ABS(a)': { name: 'Absolute', description: 'Absolute value' },

  // Dice Variables
  '1d4': { name: '1d4', description: 'Roll a 4-sided die' },
  '1d6': { name: '1d6', description: 'Roll a 6-sided die' },
  '1d8': { name: '1d8', description: 'Roll an 8-sided die' },
  '1d10': { name: '1d10', description: 'Roll a 10-sided die' },
  '1d12': { name: '1d12', description: 'Roll a 12-sided die' },
  '1d20': { name: '1d20', description: 'Roll a 20-sided die' },
  '2d6': { name: '2d6', description: 'Roll two 6-sided dice' },
  '3d6': { name: '3d6', description: 'Roll three 6-sided dice' },

  // Card Variables
  CARD_VALUE: { name: 'Card Value', description: 'Sum of all card values' },
  FACE_CARDS: { name: 'Face Cards', description: 'Number of face cards (J, Q, K)' },
  PAIRS: { name: 'Pairs', description: 'Number of pairs in the draw' },
  SAME_SUIT: { name: 'Same Suit', description: 'Boolean if all cards are same suit' },
  FLUSH: { name: 'Flush', description: 'Boolean if all cards are same suit' },
  STRAIGHT: { name: 'Straight', description: 'Boolean if cards form a sequence' },
  THREE_KIND: { name: 'Three of a Kind', description: 'Boolean if three of a kind' },
  FOUR_KIND: { name: 'Four of a Kind', description: 'Boolean if four of a kind' },
  FULL_HOUSE: { name: 'Full House', description: 'Boolean if full house' },
  RED_COUNT: { name: 'Red Cards', description: 'Number of red cards' },
  BLACK_COUNT: { name: 'Black Cards', description: 'Number of black cards' },
  ACE_COUNT: { name: 'Aces', description: 'Number of aces' },

  // Coin Variables
  HEADS_COUNT: { name: 'Heads Count', description: 'Number of heads flipped' },
  TAILS_COUNT: { name: 'Tails Count', description: 'Number of tails flipped' },
  ALL_HEADS: { name: 'All Heads', description: 'Boolean if all coins are heads' },
  ALL_TAILS: { name: 'All Tails', description: 'Boolean if all coins are tails' },
  HEADS_RATIO: { name: 'Heads Ratio', description: 'Ratio of heads (0.0-1.0)' },
  TOTAL_FLIPS: { name: 'Total Flips', description: 'Total number of coins flipped' },
  CONSECUTIVE_HEADS: { name: 'Consecutive Heads', description: 'Longest streak of heads' },
  ALTERNATING_PATTERN: { name: 'Alternating Pattern', description: 'Boolean if coins alternate heads/tails' }
};

<<<<<<< HEAD:src/components/spellcrafting-wizard/data/effects/RestorationEffects.jsx
// Import centralized variable definitions
import { ALL_VARIABLES, VARIABLE_CATEGORIES } from '../../core/data/formulaVariables';
=======

>>>>>>> Spell:vtt-react/src/components/spellcrafting-wizard/data/effects/RestorationEffects.jsx

// Variables Display Component
const VariablesDisplay = ({ onVariableClick, resolution = 'DICE' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

  const handleVariableClick = (variable) => {
    // Special handling for math functions
    if (variable.includes('(')) {
      // For math functions, just add the function name and opening parenthesis
      const functionName = variable.split('(')[0] + '(';
      if (onVariableClick) {
        onVariableClick(functionName);
      }
      // Copy to clipboard
      navigator.clipboard.writeText(functionName);
    } else {
      // Normal variable handling
      if (onVariableClick) {
        onVariableClick(variable);
      }
      // Copy to clipboard
      navigator.clipboard.writeText(variable);
    }

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

  // Filter categories based on resolution
  const filteredCategories = {};
  Object.entries(VARIABLE_CATEGORIES).forEach(([category, variables]) => {
    if (category === 'Card Variables' && resolution !== 'CARDS') return;
    if (category === 'Coin Variables' && resolution !== 'COINS') return;
    if (category === 'Dice Variables' && resolution !== 'DICE') return;
    filteredCategories[category] = variables;
  });

  return (
    <div className="variables-display">
      <div
        className={`variables-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4>
          Available Variables
          <FaChevronDown className={`toggle-icon ${isOpen ? 'open' : ''}`} />
        </h4>
      </div>
      <div className={`variables-content ${isOpen ? 'open' : ''}`}>
        {Object.entries(filteredCategories).map(([category, variables]) => (
          <div key={category} className="variables-category">
            <div className="category-title">{category}</div>
            <div className="variables-grid">
              {variables.map(variable => {
                // Get the proper display name from ALL_VARIABLES
                const variableInfo = ALL_VARIABLES[variable];
                const displayName = variableInfo?.name || variable;
                const description = variableInfo?.description || STAT_VARIABLES[variable]?.description || '';

                return (
                  <div
                    key={variable}
                    id={`var-${variable}`}
                    className="variable-item"
                    onClick={() => handleVariableClick(variable)}
                  >
                    <span className="variable-name">{displayName}</span>
                    <span className="variable-desc">{description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Copy Tooltip */}
      {tooltip.show && (
        <div
          className="copy-tooltip"
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            background: '#4a5568',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

const RestorationEffects = ({ state, dispatch, actionCreators, effectId, effectType, config }) => {
  // Create state for restoration config
  const [restorationConfig, setRestorationConfig] = useState(() => {
    return config || {
      resourceType: config?.resourceType || 'mana', // Use config resourceType if available
      resolution: 'DICE',
      formula: '1d8 + INT',
      duration: 'instant',
      tickFrequency: 'round',
      application: 'start',
      scalingType: 'flat',
      isOverTime: false,
      overTimeFormula: '1d4 + INT/2',
      overTimeDuration: 3,
      overTimeTriggerType: 'periodic', // 'periodic' or 'trigger'
      isProgressiveOverTime: false, // Flag for progressive over time effect
      overTimeProgressiveStages: [] // Array of stages with formulas for each round
    };
  });

  // State for UI toggles
  const [showComplexExamples, setShowComplexExamples] = useState(false);
  const [showOverTimeComplexExamples, setShowOverTimeComplexExamples] = useState(false);

  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copyTooltip, setCopyTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

  // Update parent state when local state changes
  useEffect(() => {
    if (dispatch && actionCreators && actionCreators.updateRestorationConfig) {
      // Use a timeout to prevent rapid state updates that might cause rendering issues
      const timeoutId = setTimeout(() => {
        dispatch(actionCreators.updateRestorationConfig(restorationConfig));

        if (actionCreators.updateEffectData && effectId) {
          dispatch(actionCreators.updateEffectData(effectId, getEffectData()));
        }
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [restorationConfig, dispatch, actionCreators, effectId]);

  // Handle mouse events for tooltips
  const handleMouseEnter = (content, e) => {
    setTooltipContent({
      title: content.name || content.title,
      content: content.description,
      icon: content.icon
    });
    setShowTooltip(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Update a specific config property
  const updateRestorationConfig = (key, value) => {
    setRestorationConfig(prev => {
      const newConfig = {
        ...prev,
        [key]: value
      };

      // For progressive stages updates, ensure we maintain all properties
      if (key === 'overTimeProgressiveStages') {
        newConfig.overTimeProgressiveStages = Array.isArray(value) ? value : [];
      }

      return newConfig;
    });
  };

  // Handle resource type change
  const handleResourceTypeChange = (resourceType) => {
    updateRestorationConfig('resourceType', resourceType);
  };

  // Handle resolution type change
  const handleResolutionChange = (resolutionType) => {
    updateRestorationConfig('resolution', resolutionType);
  };

  // Handle formula change
  const handleFormulaChange = (formula, variable = null) => {
    updateRestorationConfig('formula', formula);

    // Show copy tooltip if a variable was clicked
    if (variable) {
      // Copy to clipboard
      navigator.clipboard.writeText(variable);

      // Get element position
      const element = document.getElementById(`var-${variable}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCopyTooltip({
          show: true,
          text: 'Copied to formula!',
          x: rect.left + rect.width / 2,
          y: rect.top - 20
        });
        setTimeout(() => setCopyTooltip({ show: false, text: '', x: 0, y: 0 }), 1500);
      }
    }
  };

  // Handle over time toggle
  const handleOverTimeToggle = (isOverTime) => {
    updateRestorationConfig('isOverTime', isOverTime);
  };

  // Handle over time formula change
  const handleOverTimeFormulaChange = (formula, variable = null) => {
    updateRestorationConfig('overTimeFormula', formula);

    // Show copy tooltip if a variable was clicked
    if (variable) {
      // Copy to clipboard
      navigator.clipboard.writeText(variable);

      // Get element position
      const element = document.getElementById(`var-ot-${variable}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCopyTooltip({
          show: true,
          text: 'Copied to formula!',
          x: rect.left + rect.width / 2,
          y: rect.top - 20
        });
        setTimeout(() => setCopyTooltip({ show: false, text: '', x: 0, y: 0 }), 1500);
      }
    }
  };

  // Handle duration change
  const handleDurationChange = (duration) => {
    updateRestorationConfig('overTimeDuration', parseInt(duration, 10) || 3);
  };

  // Handle tick frequency change
  const handleTickFrequencyChange = (frequency) => {
    updateRestorationConfig('tickFrequency', frequency);
  };

  // Handle application timing change
  const handleApplicationChange = (timing) => {
    updateRestorationConfig('application', timing);
  };

  // Handle scaling type change
  const handleScalingTypeChange = (type) => {
    updateRestorationConfig('scalingType', type);
  };

  // Handle trigger type change
  const handleTriggerTypeChange = (triggerType) => {
    updateRestorationConfig('overTimeTriggerType', triggerType);

    // If changing to trigger-based, update the spell's trigger configuration
    if (triggerType === 'trigger' && dispatch && actionCreators && actionCreators.updateTriggerConfig) {
      // Create a trigger configuration for the spell's trigger system
      const spellTriggerConfig = {
        triggerId: 'restoration_trigger',
        parameters: {},
        targetEntity: 'target',
        effectType: 'restoration'
      };

      // Update the spell's trigger configuration without causing wizard flow changes
      dispatch(actionCreators.updateTriggerConfig({
        ...state?.triggerConfig,
        restorationTrigger: spellTriggerConfig
      }));
    }
  };

  // Handle progressive over time toggle
  const handleProgressiveOverTimeToggle = (isEnabled) => {
    // Create a new config with all the updated values, preserving all existing properties
    const newConfig = {
      ...restorationConfig,
      isProgressiveOverTime: isEnabled,
      scalingType: isEnabled ? 'progressive' : (restorationConfig.scalingType || 'flat'),
      // Progressive stages require over time to be enabled
      isOverTime: isEnabled ? true : restorationConfig.isOverTime
    };

    // Initialize progressiveStages array when enabling progressive effect
    if (isEnabled && (!restorationConfig.overTimeProgressiveStages || restorationConfig.overTimeProgressiveStages.length === 0)) {
      newConfig.overTimeProgressiveStages = [{
        triggerAt: 1,
        formula: restorationConfig.overTimeFormula || `1d4 + ${getResourceCode(restorationConfig.resourceType)}/2`,
        description: ''
      }];
    } else if (!isEnabled) {
      // When disabling, keep the stages but don't use them
      // This preserves user's work in case they toggle back on
      newConfig.overTimeProgressiveStages = restorationConfig.overTimeProgressiveStages || [];
    }

    // Update the local config first
    setRestorationConfig(newConfig);

    // Then dispatch to global state - use a timeout to ensure local state is updated first
    setTimeout(() => {
      if (dispatch && actionCreators && actionCreators.updateRestorationConfig) {
        dispatch(actionCreators.updateRestorationConfig(newConfig));
      }
    }, 0);
  };

  // Handle adding a new progressive stage
  const handleAddProgressiveStage = () => {
    const progressiveStages = restorationConfig.overTimeProgressiveStages || [];
    const newStage = {
      triggerAt: progressiveStages.length + 1,
      formula: restorationConfig.overTimeFormula || `1d4 + ${getResourceCode(restorationConfig.resourceType)}/2`,
      description: ''
    };
    updateRestorationConfig('overTimeProgressiveStages', [...progressiveStages, newStage]);
  };

  // Handle updating a progressive stage
  const handleUpdateProgressiveStage = (index, field, value) => {
    const progressiveStages = [...(restorationConfig.overTimeProgressiveStages || [])];
    if (progressiveStages[index]) {
      progressiveStages[index] = {
        ...progressiveStages[index],
        [field]: value
      };
      updateRestorationConfig('overTimeProgressiveStages', progressiveStages);
    }
  };

  // Handle removing a progressive stage
  const handleRemoveProgressiveStage = (index) => {
    const progressiveStages = [...(restorationConfig.overTimeProgressiveStages || [])];
    progressiveStages.splice(index, 1);
    // Update trigger numbers to be sequential
    progressiveStages.forEach((stage, idx) => {
      stage.triggerAt = idx + 1;
    });
    updateRestorationConfig('overTimeProgressiveStages', progressiveStages);
  };

  // Get effect data for spell creation
  const getEffectData = () => {
    return {
      type: 'restoration',
      resourceType: restorationConfig.resourceType,
      resolution: restorationConfig.resolution,
      formula: restorationConfig.formula,
      duration: restorationConfig.duration,
      isOverTime: restorationConfig.isOverTime,
      overTimeFormula: restorationConfig.overTimeFormula,
      overTimeDuration: restorationConfig.overTimeDuration,
      tickFrequency: restorationConfig.tickFrequency,
      application: restorationConfig.application,
      scalingType: restorationConfig.scalingType,
      overTimeTriggerType: restorationConfig.overTimeTriggerType || 'periodic',
      isProgressiveOverTime: restorationConfig.isProgressiveOverTime || false,
      overTimeProgressiveStages: restorationConfig.overTimeProgressiveStages || []
    };
  };

  // State for formula examples
  const [formulaExamples, setFormulaExamples] = useState([]);
  const [overTimeFormulaExamples, setOverTimeFormulaExamples] = useState([]);

  // Update formula examples when resolution type changes
  useEffect(() => {
    updateFormulaExamples(restorationConfig.resolution);
  }, [restorationConfig.resolution, restorationConfig.resourceType]);

  // Update formula examples based on resolution type and resource type
  const updateFormulaExamples = (resolutionType) => {
    const resourceCode = getResourceCode(restorationConfig.resourceType);
    const resourceName = getResourceName(restorationConfig.resourceType);

    if (resolutionType === 'DICE') {
      setFormulaExamples([
        {
          name: `Basic ${resourceName} Recovery`,
          formula: `2d6 + ${resourceCode}`,
          description: 'Standard resource recovery'
        },
        {
          name: `Enhanced ${resourceName} Restoration`,
          formula: `3d8 + ${resourceCode} * 1.5`,
          description: 'Higher base recovery with resource scaling'
        },
        {
          name: `Quick ${resourceName} Replenishment`,
          formula: `1d6 + ${resourceCode} + AGI`,
          description: 'Scales with agility for faster recovery'
        },
        {
          name: `Critical ${resourceName} Recovery`,
          formula: `4d6 + ${resourceCode} * 2`,
          description: 'Double resource recovery'
        },
        {
          name: `${resourceName} Surge`,
          formula: `(2d8 + ${resourceCode}) * (CHP < MHP/2 ? 1.5 : 1)`,
          description: 'More recovery when health is low'
        },
        {
          name: `${resourceName} Conversion`,
          formula: `1d10 + ${resourceCode} + (MHP - CHP)/10`,
          description: 'Converts missing health into resource'
        },
        {
          name: `Adaptive ${resourceName}`,
          formula: `MAX(${resourceCode}, WIS) * 1d6`,
          description: 'Uses your highest relevant stat'
        },
        {
          name: `${resourceName} Wellspring`,
          formula: `3d6 + ${resourceCode} + LEVEL * 2`,
          description: 'Scales with character level'
        }
      ]);

      setOverTimeFormulaExamples([
        {
          name: `Steady ${resourceName} Flow`,
          formula: `1d4 + ${resourceCode}/2`,
          description: 'Standard recovery over time'
        },
        {
          name: `Increasing ${resourceName} Flow`,
          formula: `1d6 + ROUND + ${resourceCode}/3`,
          description: 'Increases each round'
        },
        {
          name: `${resourceName} Surge`,
          formula: `(ROUND <= 2 ? 1d4 : 2d4) + ${resourceCode}/2`,
          description: 'Escalating recovery over time'
        },
        {
          name: `${resourceName} Meditation`,
          formula: `1d4 * ROUND + ${resourceCode}/4`,
          description: 'Recovery increases each round'
        },
        {
          name: `${resourceName} Attunement`,
          formula: `(1d6 + ${resourceCode}/3) * (CHP < MHP/2 ? 1.5 : 1)`,
          description: 'More recovery when health is low'
        },
        {
          name: `${resourceName} Harmony`,
          formula: `(1d4 + WIS/2) * (ROUND <= 3 ? ROUND : 3)`,
          description: 'Scales with wisdom and round number (max 3)'
        }
      ]);
    } else if (resolutionType === 'CARDS') {
      setFormulaExamples([
        {
          name: `Card ${resourceName} Recovery`,
          formula: `CARD_VALUE + ${resourceCode}`,
          description: 'Basic card-based recovery'
        },
        {
          name: `Royal ${resourceName} Restoration`,
          formula: `CARD_VALUE + (FACE_CARDS > 0 ? ${resourceCode} * 2 : ${resourceCode})`,
          description: 'Double resource with face cards'
        },
        {
          name: `${resourceName} Suit Synergy`,
          formula: `CARD_VALUE * (SAME_SUIT ? 2 : 1) + ${resourceCode}`,
          description: 'Double recovery if all cards are the same suit'
        },
        {
          name: `${resourceName} Full House`,
          formula: `CARD_VALUE * 1.5 + FACE_CARDS * 3 + ${resourceCode}`,
          description: 'Scales with face cards drawn'
        },
        {
          name: `${resourceName} Flush`,
          formula: `CARD_VALUE + (FLUSH ? 25 : 0) + ${resourceCode}`,
          description: 'Bonus recovery with a flush'
        },
        {
          name: `${resourceName} Straight`,
          formula: `CARD_VALUE + (STRAIGHT ? 30 : 0) + ${resourceCode}`,
          description: 'Bonus recovery with a straight'
        },
        {
          name: `${resourceName} Pairs`,
          formula: `CARD_VALUE + (PAIRS * 10) + ${resourceCode}`,
          description: 'Bonus recovery with pairs'
        },
        {
          name: `${resourceName} Red Black Balance`,
          formula: `CARD_VALUE * (RED_COUNT == BLACK_COUNT ? 2 : 1) + ${resourceCode}`,
          description: 'Double recovery with balanced red and black cards'
        }
      ]);

      setOverTimeFormulaExamples([
        {
          name: `${resourceName} Card Flow`,
          formula: `CARD_VALUE/2 + ${resourceCode}/2`,
          description: 'Standard card recovery over time'
        },
        {
          name: `${resourceName} Suit Restoration`,
          formula: `(SAME_SUIT ? CARD_VALUE : CARD_VALUE/2) + ${resourceCode}/3`,
          description: 'Stronger with matching suit'
        },
        {
          name: `Royal ${resourceName} Regeneration`,
          formula: `FACE_CARDS * 2 + ROUND + ${resourceCode}/3`,
          description: 'Escalating recovery that scales with face cards'
        },
        {
          name: `${resourceName} Poker Regen`,
          formula: `(PAIRS * 3) + (THREE_KIND ? 10 : 0) + ${resourceCode}/4`,
          description: 'Recovery based on poker hand quality'
        },
        {
          name: `${resourceName} Card Cycle`,
          formula: `(CARD_VALUE/3) * ROUND`,
          description: 'Recovery scales with round number'
        },
        {
          name: `${resourceName} Ace Recovery`,
          formula: `(ACE_COUNT * 5) + ${resourceCode}/3`,
          description: 'Strong recovery with aces'
        }
      ]);
    } else if (resolutionType === 'COINS') {
      setFormulaExamples([
        {
          name: `${resourceName} Fortune`,
          formula: `HEADS_COUNT * 4 + ${resourceCode}`,
          description: 'Scales with number of heads'
        },
        {
          name: `${resourceName} Luck`,
          formula: `(HEADS_RATIO > 0.5 ? 15 : 5) + ${resourceCode}`,
          description: 'Higher recovery with more heads than tails'
        },
        {
          name: `${resourceName} Fate`,
          formula: `ALL_HEADS ? 25 + ${resourceCode} * 2 : HEADS_COUNT * 3 + ${resourceCode}`,
          description: 'Massive recovery on all heads'
        },
        {
          name: `${resourceName} Balance`,
          formula: `(HEADS_COUNT == TAILS_COUNT ? 20 : HEADS_COUNT * 3) + ${resourceCode}`,
          description: 'Bonus recovery when heads and tails are balanced'
        },
        {
          name: `${resourceName} Probability`,
          formula: `HEADS_COUNT * 5 * (CHP < MHP/2 ? 1.5 : 1) + ${resourceCode}`,
          description: 'More recovery when health is low'
        },
        {
          name: `${resourceName} Sequence`,
          formula: `HEADS_COUNT * 7 + (CONSECUTIVE_HEADS > 2 ? 20 : 0) + ${resourceCode}`,
          description: 'Bonus recovery for consecutive heads'
        },
        {
          name: `${resourceName} Pattern`,
          formula: `HEADS_COUNT * 5 + ((ALTERNATING_PATTERN && TOTAL_FLIPS > 3) ? 25 : 0) + ${resourceCode}`,
          description: 'Bonus recovery for alternating heads-tails pattern'
        }
      ]);

      setOverTimeFormulaExamples([
        {
          name: `${resourceName} Coin Flow`,
          formula: `HEADS_COUNT + ${resourceCode}/2`,
          description: 'Basic coin recovery over time'
        },
        {
          name: `${resourceName} Fortune's Blessing`,
          formula: `(HEADS_RATIO > 0.5 ? 3 : 1) * ROUND + ${resourceCode}/3`,
          description: 'Scaling recovery based on heads ratio'
        },
        {
          name: `${resourceName} Luck Stream`,
          formula: `HEADS_COUNT * 1.5 + (ALL_HEADS ? ${resourceCode} : ${resourceCode}/2)`,
          description: 'Strong recovery if all heads'
        },
        {
          name: `${resourceName} Coin Cycle`,
          formula: `HEADS_COUNT + (ROUND * 2)`,
          description: 'Recovery increases each round'
        },
        {
          name: `${resourceName} Tails Recovery`,
          formula: `(TOTAL_FLIPS - HEADS_COUNT) * 2 + ${resourceCode}/3`,
          description: 'Recovery based on tails count'
        },
        {
          name: `${resourceName} Balance Flow`,
          formula: `(ABS(HEADS_COUNT - TAILS_COUNT) < 2 ? 10 : 5) + ${resourceCode}/4`,
          description: 'Better recovery when heads and tails are balanced'
        }
      ]);
    }
  };

  // Get resource name based on resource type
  const getResourceName = (resourceType) => {
    switch (resourceType) {
      case 'health':
        return 'Health';
      case 'mana':
        return 'Mana';
      case 'inferno':
        return 'Inferno';
      case 'action_points':
        return 'Action Points';
      case 'rage':
        return 'Rage';
      case 'energy':
        return 'Energy';
      case 'focus':
        return 'Focus';
      case 'runic_power':
        return 'Runic Power';
      case 'astral_power':
        return 'Astral Power';
      default:
        return 'Resource';
    }
  };

  // Get resource code based on resource type
  const getResourceCode = (resourceType) => {
    switch (resourceType) {
      case 'health':
        return 'CON';
      case 'mana':
        return 'INT';
      case 'inferno':
        return 'SPIR';
      case 'action_points':
        return 'AGI';
      case 'rage':
        return 'STR';
      case 'energy':
        return 'AGI';
      case 'focus':
        return 'WIS';
      case 'runic_power':
        return 'INT';
      case 'astral_power':
        return 'SPIR';
      default:
        return 'INT';
    }
  };

  // Resource types with icons and descriptions
  const resourceTypes = [
    {
      id: 'health',
      name: 'Health',
      description: 'Vital life force that sustains all living beings',
      icon: 'spell_holy_sealofsacrifice',
      reactIcon: FaHeart
    },
    {
      id: 'mana',
      name: 'Mana',
      description: 'Magical energy used for spellcasting',
      icon: 'spell_holy_magicalsentry',
      reactIcon: FaDroplet
    },
    {
      id: 'inferno',
      name: 'Inferno',
      description: 'Chaotic energy harnessed from the elemental planes',
      icon: 'spell_fire_incinerate',
      reactIcon: FaFire
    },
    {
      id: 'action_points',
      name: 'Action Points',
      description: 'Combat resources used for special abilities and attacks',
      icon: 'ability_rogue_quickrecovery',
      reactIcon: FaBolt
    },
    {
      id: 'rage',
      name: 'Rage',
      description: 'Fury generated in combat for powerful attacks',
      icon: 'ability_warrior_rampage',
      reactIcon: FaFire
    },
    {
      id: 'energy',
      name: 'Energy',
      description: 'Resource used for quick, agile abilities',
      icon: 'spell_nature_lightning',
      reactIcon: FaBolt
    },
    {
      id: 'focus',
      name: 'Focus',
      description: 'Concentration used for precise attacks',
      icon: 'ability_hunter_mastermarksman',
      reactIcon: FaGaugeHigh
    },
    {
      id: 'runic_power',
      name: 'Runic Power',
      description: 'Ancient energy harnessed by death knights',
      icon: 'spell_deathknight_runicpower',
      reactIcon: FaGauge
    },
    {
      id: 'astral_power',
      name: 'Astral Power',
      description: 'Celestial energy channeled from the cosmos',
      icon: 'ability_druid_eclipseorange',
      reactIcon: FaHeartPulse
    },
    {
      id: 'soul_power',
      name: 'Soul Power',
      description: 'Spiritual essence used for divine magic',
      icon: 'spell_holy_spiritualguidence',
      reactIcon: FaHeartPulse
    },
    {
      id: 'chi',
      name: 'Chi',
      description: 'Inner energy used for martial arts and balance',
      icon: 'ability_monk_healthsphere',
      reactIcon: FaGaugeHigh
    },
    {
      id: 'arcane_power',
      name: 'Arcane Power',
      description: 'Raw magical energy from the arcane realm',
      icon: 'spell_arcane_arcanepotency',
      reactIcon: FaBolt
    }
  ];

  // Render resource type selection
  const renderResourceTypeSelection = () => {
    return (
      <div className="resource-type-selection section">
        <h3>Resource Type</h3>
        <div className="card-selection-grid">
          {resourceTypes.map(resource => (
            <IconSelectionCard
              key={resource.id}
              icon={<img src={getIconUrl(resource.icon)} alt={resource.name} className="icon" />}
              title={resource.name}
              description={resource.description}
              onClick={() => handleResourceTypeChange(resource.id)}
              selected={restorationConfig.resourceType === resource.id}
              onMouseEnter={(e) => handleMouseEnter({
                name: resource.name,
                description: resource.description,
                icon: getIconUrl(resource.icon)
              }, e)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            />
          ))}
        </div>
      </div>
    );
  };

  // Render resolution method section
  const renderResolutionMethod = () => {
    return (
      <div className="resolution-method section">
        <h3>Resolution Method</h3>
        <ResolutionSelector
          selectedResolution={restorationConfig.resolution}
          onResolutionChange={handleResolutionChange}
        />


      </div>
    );
  };

  // Handle instant restoration toggle
  const handleInstantRestorationToggle = (isEnabled) => {
    updateRestorationConfig('duration', isEnabled ? 'instant' : 'over-time-only');
  };

  // Render formula configuration section
  const renderFormulaConfiguration = () => {
    const hasInstantRestoration = restorationConfig.duration === 'instant' || !restorationConfig.duration;

    return (
      <div className="formula-configuration section">
        <h3>Resource Restoration Formula</h3>

        {/* Instant Restoration Toggle */}
        <div className="instant-restoration-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={hasInstantRestoration}
              onChange={(e) => handleInstantRestorationToggle(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable instant restoration</span>
        </div>

        {hasInstantRestoration && (
          <div className="instant-restoration-settings">
            <div className="formula-input-container">
              <input
                type="text"
                className="formula-input"
                value={restorationConfig.formula}
                onChange={(e) => handleFormulaChange(e.target.value)}
                placeholder={`Enter formula (e.g. 2d6 + ${getResourceCode(restorationConfig.resourceType)})`}
              />
              <button
                className="formula-button"
                onClick={() => handleFormulaChange(`2d6 + ${getResourceCode(restorationConfig.resourceType)}`)}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Complex Formula Examples Toggle */}
        <div className="complex-examples-toggle" onClick={() => setShowComplexExamples(!showComplexExamples)}>
          <h4 className="toggle-title">
            <span className="toggle-icon">{showComplexExamples ? '▼' : '►'}</span>
            Complex Formula Examples
          </h4>
        </div>

        {/* Complex Formula Examples Content */}
        {showComplexExamples && (
          <div className="complex-formula-examples">
            <div className="complex-examples-grid">
              <div className="complex-example-card" onClick={() => handleFormulaChange(`2d6 + ${getResourceCode(restorationConfig.resourceType)} + ${getResourceCode(restorationConfig.resourceType)}/2`)}>
                <h5 className="example-title">Empowered Recovery</h5>
                <div className="example-formula">2d6 + {getResourceCode(restorationConfig.resourceType)} + {getResourceCode(restorationConfig.resourceType)}/2</div>
                <div className="example-description">Combine primary stat with bonus scaling</div>
              </div>

              <div className="complex-example-card" onClick={() => handleFormulaChange(`2d8 + 1d6 + ${getResourceCode(restorationConfig.resourceType)}*2 + SPIR`)}>
                <h5 className="example-title">Critical Restoration</h5>
                <div className="example-formula">2d8 + 1d6 + {getResourceCode(restorationConfig.resourceType)}*2 + SPIR</div>
                <div className="example-description">Critical recovery with spirit bonus</div>
              </div>

              <div className="complex-example-card" onClick={() => handleFormulaChange(`MAX(INT, STR)*1d6 + ${getResourceCode(restorationConfig.resourceType)}/2`)}>
                <h5 className="example-title">Adaptive Renewal</h5>
                <div className="example-formula">MAX(INT, STR)*1d6 + {getResourceCode(restorationConfig.resourceType)}/2</div>
                <div className="example-description">Uses your highest stat to determine power</div>
              </div>

              <div className="complex-example-card" onClick={() => handleFormulaChange(`(2d6 + ${getResourceCode(restorationConfig.resourceType)}*2)*(CHP < MHP/2 ? 1.5 : 1)`)}>
                <h5 className="example-title">Desperate Infusion</h5>
                <div className="example-formula">(2d6 + {getResourceCode(restorationConfig.resourceType)}*2)*(CHP &lt; MHP/2 ? 1.5 : 1)</div>
                <div className="example-description">50% more restoration when below half health</div>
              </div>

              <div className="complex-example-card" onClick={() => handleFormulaChange(`(1d4 + 1d6 + 1d8)*(CMP/MMP > 0.7 ? 2 : 1)`)}>
                <h5 className="example-title">Tactical Conversion</h5>
                <div className="example-formula">(1d4 + 1d6 + 1d8)*(CMP/MMP &gt; 0.7 ? 2 : 1)</div>
                <div className="example-description">Double restoration when mana is above 70%</div>
              </div>

              <div className="complex-example-card" onClick={() => handleFormulaChange(`4d6*(1 + (MAXHP-CHP)/MAXHP)`)}>
                <h5 className="example-title">Life Exchange</h5>
                <div className="example-formula">4d6*(1 + (MAXHP-CHP)/MAXHP)</div>
                <div className="example-description">More restoration the lower your health is</div>
              </div>

              <div className="complex-example-card" onClick={() => handleFormulaChange(`ROUND*1d8 + STR + ${getResourceCode(restorationConfig.resourceType)}*(ROUND > 3 ? 2 : 1)`)}>
                <h5 className="example-title">Momentum Surge</h5>
                <div className="example-formula">ROUND*1d8 + STR + {getResourceCode(restorationConfig.resourceType)}*(ROUND &gt; 3 ? 2 : 1)</div>
                <div className="example-description">Gets stronger each round with big bonus after round 3</div>
              </div>
            </div>
          </div>
        )}

        {/* Basic Formula Examples */}
        <div className="formula-examples">
          <h4>Basic Formula Examples (Click to Use)</h4>
          <div className="examples-grid">
            {formulaExamples.map((example, index) => (
              <div
                key={index}
                className="example-card"
                onClick={() => handleFormulaChange(example.formula)}
              >
                <div className="example-name">{example.name}</div>
                <div className="example-formula">{example.formula}</div>
                <div className="example-description">{example.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Variables */}
        <VariablesDisplay
          onVariableClick={(variable) => {
            const newFormula = restorationConfig.formula ? `${restorationConfig.formula} + ${variable}` : variable;
            handleFormulaChange(newFormula, variable);
          }}
          resolution={restorationConfig.resolution}
        />
      </div>
    );
  };

  // Render over-time configuration section
  const renderOverTimeConfiguration = () => {
    return (
      <div className="over-time-configuration section">
        <h3>Restoration Over Time</h3>
        <div className="over-time-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={restorationConfig.isOverTime}
              onChange={(e) => handleOverTimeToggle(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable restoration over time</span>
        </div>

        {restorationConfig.isOverTime && (
          <div className="over-time-settings">
            <div className="over-time-formula">
              <h4>Over Time Formula</h4>
              <div className="formula-input-container">
                <input
                  type="text"
                  className="formula-input"
                  value={restorationConfig.overTimeFormula}
                  onChange={(e) => handleOverTimeFormulaChange(e.target.value)}
                  placeholder={`Enter formula (e.g. 1d4 + ${getResourceCode(restorationConfig.resourceType)}/2)`}
                />
                <button
                  className="formula-button"
                  onClick={() => handleOverTimeFormulaChange(`1d4 + ${getResourceCode(restorationConfig.resourceType)}/2`)}
                >
                  Reset
                </button>
              </div>

              {/* Complex Formula Examples Toggle for Over Time */}
              <div className="complex-examples-toggle" onClick={() => setShowOverTimeComplexExamples(!showOverTimeComplexExamples)}>
                <h4 className="toggle-title">
                  <span className="toggle-icon">{showOverTimeComplexExamples ? '▼' : '►'}</span>
                  Complex Over Time Formulas
                </h4>
              </div>

              {/* Complex Formula Examples Content for Over Time */}
              {showOverTimeComplexExamples && (
                <div className="complex-formula-examples">
                  <div className="complex-examples-grid">
                    <div className="complex-example-card" onClick={() => handleOverTimeFormulaChange(`ROUND*1d4 + ${getResourceCode(restorationConfig.resourceType)}/3`)}>
                      <h5 className="example-title">Escalating Recovery</h5>
                      <div className="example-formula">ROUND*1d4 + {getResourceCode(restorationConfig.resourceType)}/3</div>
                      <div className="example-description">Increases each round</div>
                    </div>

                    <div className="complex-example-card" onClick={() => handleOverTimeFormulaChange(`(1d6 + ${getResourceCode(restorationConfig.resourceType)}/2)*(CHP &lt; MHP/2 ? 1.5 : 1)`)}>
                      <h5 className="example-title">Desperate Renewal</h5>
                      <div className="example-formula">(1d6 + {getResourceCode(restorationConfig.resourceType)}/2)*(CHP &lt; MHP/2 ? 1.5 : 1)</div>
                      <div className="example-description">50% more when below half health</div>
                    </div>

                    <div className="complex-example-card" onClick={() => handleOverTimeFormulaChange(`MAX(1d4*ROUND, 1d4*3) + ${getResourceCode(restorationConfig.resourceType)}/4`)}>
                      <h5 className="example-title">Capped Momentum</h5>
                      <div className="example-formula">MAX(1d4*ROUND, 1d4*3) + {getResourceCode(restorationConfig.resourceType)}/4</div>
                      <div className="example-description">Increases each round up to round 3</div>
                    </div>

                    <div className="complex-example-card" onClick={() => handleOverTimeFormulaChange(`(ROUND == 1 ? 1d4 : ROUND == 2 ? 1d6 : 1d8) + ${getResourceCode(restorationConfig.resourceType)}/3`)}>
                      <h5 className="example-title">Tiered Recovery</h5>
                      <div className="example-formula">(ROUND == 1 ? 1d4 : ROUND == 2 ? 1d6 : 1d8) + {getResourceCode(restorationConfig.resourceType)}/3</div>
                      <div className="example-description">Different dice for each round</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Formula Examples */}
              <div className="formula-examples">
                <h4>Basic Formula Examples (Click to Use)</h4>
                <div className="examples-grid">
                  {overTimeFormulaExamples.map((example, index) => (
                    <div
                      key={index}
                      className="example-card"
                      onClick={() => handleOverTimeFormulaChange(example.formula)}
                    >
                      <div className="example-name">{example.name}</div>
                      <div className="example-formula">{example.formula}</div>
                      <div className="example-description">{example.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variables for Over Time Formula */}
              <VariablesDisplay
                onVariableClick={(variable) => {
                  const newFormula = restorationConfig.overTimeFormula ? `${restorationConfig.overTimeFormula} + ${variable}` : variable;
                  handleOverTimeFormulaChange(newFormula, variable);
                }}
                resolution={restorationConfig.resolution}
              />
            </div>

            <div className="over-time-duration">
              <h4>Duration (in rounds/turns)</h4>
              <input
                type="number"
                min="1"
                max="20"
                value={restorationConfig.overTimeDuration}
                onChange={(e) => handleDurationChange(e.target.value)}
                className="number-input"
              />
            </div>

            <div className="tick-frequency">
              <h4>Tick Frequency</h4>
              <div className="button-group">
                <button
                  className={`option-button ${restorationConfig.tickFrequency === 'round' ? 'selected' : ''}`}
                  onClick={() => handleTickFrequencyChange('round')}
                >
                  Every Round
                </button>
                <button
                  className={`option-button ${restorationConfig.tickFrequency === 'turn' ? 'selected' : ''}`}
                  onClick={() => handleTickFrequencyChange('turn')}
                >
                  Every Turn
                </button>
              </div>
            </div>

            <div className="application-timing">
              <h4>Application Timing</h4>
              <div className="button-group">
                <button
                  className={`option-button ${restorationConfig.application === 'start' ? 'selected' : ''}`}
                  onClick={() => handleApplicationChange('start')}
                >
                  Start of Round/Turn
                </button>
                <button
                  className={`option-button ${restorationConfig.application === 'end' ? 'selected' : ''}`}
                  onClick={() => handleApplicationChange('end')}
                >
                  End of Round/Turn
                </button>
              </div>
            </div>

            <div className="trigger-type">
              <h4>Trigger Type</h4>
              <div className="button-group">
                <button
                  className={`option-button ${restorationConfig.overTimeTriggerType === 'periodic' ? 'selected' : ''}`}
                  onClick={() => handleTriggerTypeChange('periodic')}
                  title="Occurs automatically each round/turn"
                >
                  Periodic
                </button>
                <button
                  className={`option-button ${restorationConfig.overTimeTriggerType === 'trigger' ? 'selected' : ''}`}
                  onClick={() => handleTriggerTypeChange('trigger')}
                  title="Occurs when a specific trigger condition is met"
                >
                  Trigger-Based
                </button>
              </div>
              {restorationConfig.overTimeTriggerType === 'trigger' && (
                <div className="trigger-info">
                  <p className="info-text">Configure trigger conditions in the Triggers step of the spell wizard.</p>
                </div>
              )}
            </div>

            {restorationConfig.overTimeTriggerType === 'periodic' && (
              <div className="scaling-type">
                <h4>Scaling Type</h4>
                <div className="button-group">
                  <button
                    className={`option-button ${restorationConfig.scalingType === 'flat' ? 'selected' : ''}`}
                    onClick={() => handleScalingTypeChange('flat')}
                    title="Same amount each tick"
                    disabled={restorationConfig.isProgressiveOverTime}
                  >
                    Flat
                  </button>
                  <button
                    className={`option-button ${restorationConfig.scalingType === 'increasing' ? 'selected' : ''}`}
                    onClick={() => handleScalingTypeChange('increasing')}
                    title="Increasing amount each tick"
                    disabled={restorationConfig.isProgressiveOverTime}
                  >
                    Increasing
                  </button>
                  <button
                    className={`option-button ${restorationConfig.scalingType === 'decreasing' ? 'selected' : ''}`}
                    onClick={() => handleScalingTypeChange('decreasing')}
                    title="Decreasing amount each tick"
                    disabled={restorationConfig.isProgressiveOverTime}
                  >
                    Decreasing
                  </button>
                </div>
              </div>
            )}

            <div className="progressive-formula">
              <h4>Custom Formula Per Stage</h4>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={restorationConfig.isProgressiveOverTime}
                    onChange={(e) => handleProgressiveOverTimeToggle(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Enable custom formula for each stage</span>
              </div>

              {restorationConfig.isProgressiveOverTime && (
                <div className="progressive-stages">
                  <div className="stages-container">
                    {restorationConfig.overTimeProgressiveStages.map((stage, index) => (
                      <div key={index} className="stage-item">
                        <div className="stage-header">
                          <h5>Stage {index + 1}</h5>
                          <button
                            className="remove-stage-button"
                            onClick={() => handleRemoveProgressiveStage(index)}
                            disabled={restorationConfig.overTimeProgressiveStages.length <= 1}
                          >
                            ×
                          </button>
                        </div>
                        <div className="stage-content">
                          <div className="stage-field">
                            <label>Trigger At (round/turn):</label>
                            <input
                              type="number"
                              min="1"
                              value={stage.triggerAt}
                              onChange={(e) => handleUpdateProgressiveStage(index, 'triggerAt', parseInt(e.target.value) || 1)}
                              className="number-input"
                            />
                          </div>
                          <div className="stage-field">
                            <label>Formula:</label>
                            <input
                              type="text"
                              value={stage.formula}
                              onChange={(e) => handleUpdateProgressiveStage(index, 'formula', e.target.value)}
                              className="formula-input"
                              placeholder={`Enter formula (e.g. 1d4 + ${getResourceCode(restorationConfig.resourceType)}/2)`}
                            />
                          </div>
                          <div className="stage-field">
                            <label>Description (optional):</label>
                            <input
                              type="text"
                              value={stage.description}
                              onChange={(e) => handleUpdateProgressiveStage(index, 'description', e.target.value)}
                              className="text-input"
                              placeholder="E.g., 'Stronger restoration in later rounds'"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="add-stage-button"
                    onClick={handleAddProgressiveStage}
                  >
                    + Add Stage
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main render function
  return (
    <div className="restoration-effects-container">
      {/* Resource Type Selection */}
      {renderResourceTypeSelection()}

      {/* Resolution Method */}
      {renderResolutionMethod()}

      {/* Formula Configuration */}
      {renderFormulaConfiguration()}

      {/* Over Time Configuration */}
      {renderOverTimeConfiguration()}

      {/* Copy Tooltip */}
      {copyTooltip.show && (
        <div
          className="copy-tooltip"
          style={{
            position: 'fixed',
            left: `${copyTooltip.x}px`,
            top: `${copyTooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            background: '#4a5568',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          {copyTooltip.text}
        </div>
      )}

      {/* Tooltip Rendering */}
      {showTooltip && tooltipContent && (() => {
        const tooltipRoot = document.getElementById('tooltip-root') || document.body;
        return ReactDOM.createPortal(
          <div
            className="wc3-tooltip"
            style={{
              position: 'fixed',
              left: mousePos.x,
              top: mousePos.y,
              zIndex: 99999,
              pointerEvents: 'none',
              transform: 'translate(10px, -100%)'
            }}
          >
            <div className="tooltip-top-border"></div>
            <div className="wc3-tooltip-content">
              {tooltipContent.icon && (
                <div className="wc3-tooltip-header">
                  <img
                    src={tooltipContent.icon}
                    alt={tooltipContent.title}
                    className="tooltip-icon"
                    style={{ width: '32px', height: '32px', marginRight: '8px' }}
                  />
                  <span className="wc3-tooltip-title">{tooltipContent.title}</span>
                </div>
              )}
              {!tooltipContent.icon && tooltipContent.title && (
                <div className="wc3-tooltip-header">
                  <span className="wc3-tooltip-title">{tooltipContent.title}</span>
                </div>
              )}
              <div className="wc3-tooltip-body">
                {typeof tooltipContent.content === 'string' ? (
                  <div className="tooltip-description">{tooltipContent.content}</div>
                ) : (
                  tooltipContent.content
                )}
              </div>
            </div>
            <div className="tooltip-bottom-border"></div>
          </div>,
          tooltipRoot
        );
      })()}
    </div>
  );
};

export default RestorationEffects;
