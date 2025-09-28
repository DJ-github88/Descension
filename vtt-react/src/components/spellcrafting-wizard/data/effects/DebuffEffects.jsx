import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import CleanStatusEffectConfigPopup from './CleanStatusEffectConfigPopup';
import DiceFormulaExamples from '../../components/tooltips/DiceFormulaExamples';
import './DebuffEffects.css'; // Import dedicated debuff styling

import DebuffTriggerConfig from '../../components/effects/DebuffTriggerConfig';
import SpellSelector from '../../components/common/SpellSelector';
import './progressive-buff.css'; // Reuse the same CSS for progressive debuffs
// Pathfinder styles imported via main.css
import '../../styles/buff-config-options.css'; // Import the shared configuration styles

// Import debuff types and status effects
import {
  DEBUFF_DURATIONS,
  DEBUFF_STACKING_RULE_OPTIONS,
  findDebuffCategoryById,
  findDebuffEffectById,
  getDebuffsByCategory
} from '../../core/data/debuffTypes';

import { NEGATIVE_STATUS_EFFECTS, COMBAT_DISADVANTAGES } from '../../core/data/statusEffects';
import { BUFF_DEBUFF_STAT_MODIFIERS } from '../../core/data/statModifier';

// Debuff types with WoW icons
const DEBUFF_TYPES = {
  VULNERABILITY: {
    id: 'vulnerability',
    name: 'Vulnerability',
    icon: 'spell_shadow_shadowwordpain',
    description: 'Increases damage taken or reduces resistances',
    category: 'vulnerability'
  },
  WEAKENING: {
    id: 'weakening',
    name: 'Weakening',
    icon: 'spell_shadow_curseofweakness',
    description: 'Reduces damage output or combat effectiveness',
    category: 'statReduction'
  },
  IMPAIRMENT: {
    id: 'impairment',
    name: 'Impairment',
    icon: 'spell_frost_chainsofice',
    description: 'Reduces movement speed or mobility',
    category: 'control'
  },
  CONFUSION: {
    id: 'confusion',
    name: 'Confusion',
    icon: 'spell_shadow_mindshear',
    description: 'Reduces accuracy or spell effectiveness',
    category: 'mental'
  },
  EXPOSURE: {
    id: 'exposure',
    name: 'Exposure',
    icon: 'spell_shadow_antishadow',
    description: 'Reduces armor or defensive capabilities',
    category: 'vulnerability'
  },
  DAMAGE: {
    id: 'damage',
    name: 'Damage Over Time',
    icon: 'spell_fire_immolation',
    description: 'Deals damage over time',
    category: 'damage'
  },
  CONTROL: {
    id: 'control',
    name: 'Control Effect',
    icon: 'spell_frost_stun',
    description: 'Restricts ability to move or act',
    category: 'control'
  },
  CURSE: {
    id: 'curse',
    name: 'Curse/Hex',
    icon: 'spell_shadow_antishadow',
    description: 'Powerful debuff with special removal requirements',
    category: 'cursehex'
  }
};

// Duration types
const DURATION_TYPES = [
  { id: 'rounds', name: 'Rounds', description: 'Combat rounds (approx. 6 seconds each)', icon: 'inv_misc_pocketwatch_01' },
  { id: 'minutes', name: 'Minutes', description: 'Real-time minutes', icon: 'inv_misc_pocketwatch_02' },
  { id: 'hours', name: 'Hours', description: 'Real-time hours', icon: 'inv_misc_pocketwatch_03' },
  { id: 'days', name: 'Days', description: 'In-game days', icon: 'inv_misc_pocketwatch_01' }
];

// Saving throw types with WoW icons
const SAVE_TYPES = [
  { id: 'strength', name: 'Strength', icon: 'spell_nature_strength', description: 'Physical power and force' },
  { id: 'agility', name: 'Agility', icon: 'ability_rogue_quickrecovery', description: 'Reflexes, balance, and coordination' },
  { id: 'constitution', name: 'Constitution', icon: 'spell_holy_devotionaura', description: 'Endurance and physical fortitude' },
  { id: 'intelligence', name: 'Intelligence', icon: 'spell_arcane_arcane02', description: 'Mental acuity and knowledge' },
  { id: 'spirit', name: 'Spirit', icon: 'spell_holy_holyguidance', description: 'Mental fortitude and willpower' },
  { id: 'charisma', name: 'Charisma', icon: 'spell_holy_powerinfusion', description: 'Force of personality' }
];

// Status effect levels
const SEVERITY_LEVELS = [
  { id: 'minor', name: 'Minor', icon: 'inv_misc_gem_diamond_05', description: 'Slight impairment' },
  { id: 'moderate', name: 'Moderate', icon: 'inv_misc_gem_diamond_06', description: 'Noticeable impairment' },
  { id: 'major', name: 'Major', icon: 'inv_misc_gem_diamond_07', description: 'Severe impairment' }
];

const STAT_CATEGORIES = {
  primary: 'Primary Stats',
  secondary: 'Secondary Stats',
  combat: 'Combat Stats',
  damage: 'Damage Types',
  resistance: 'Resistances',
  utility: 'Utility'
};

const DebuffEffects = ({ state, dispatch, actionCreators, getDefaultFormula }) => {
  const [selectedStatCategory, setSelectedStatCategory] = useState('primary');
  const [selectedStatusCategory, setSelectedStatusCategory] = useState('all');
  const [statPreview, setStatPreview] = useState(null);
  const [statusEffectPreview, setStatusEffectPreview] = useState(null);
  const [dotFormulaExamples, setDotFormulaExamples] = useState([]);
  const [debuffConfig, setDebuffConfig] = useState(state.debuffConfig || {});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDiceExamples, setShowDiceExamples] = useState(false);

  // State for the status effect configuration popup
  const [configPopupOpen, setConfigPopupOpen] = useState(false);
  const [selectedStatusEffect, setSelectedStatusEffect] = useState(null);

  // Default debuff configuration
  const defaultConfig = {
    duration: 1, // Legacy field
    durationValue: 1,
    durationType: 'rounds',
    durationUnit: 'rounds',
    restType: 'short',
    canBeDispelled: true,
    concentrationRequired: false,
    stackingRule: 'replace',
    maxStacks: 1,
    magnitude: 2,
    magnitudeType: 'flat',
    statPenalties: [],
    statusEffects: [],
    isProgressive: false,
    progressiveStages: [],
    // Saving throw configuration
    difficultyClass: 15,
    savingThrow: 'constitution',
    saveOutcome: 'negates'
  };

  useEffect(() => {
    // Initialize default debuff configuration if not already set
    if (!debuffConfig) {
      setDebuffConfig(defaultConfig);
      return; // Don't sync to global state yet, wait for next render
    }

    // Only sync with global state if debuffConfig is valid
    dispatch(actionCreators.updateDebuffConfig(debuffConfig));
  }, [debuffConfig, dispatch]);

  // Initialize duration fields if not set
  useEffect(() => {
    // Check if we need to migrate from legacy duration format
    if (debuffConfig && debuffConfig.duration && !debuffConfig.durationType) {
      const updatedConfig = { ...debuffConfig };

      // If duration is -1, it means "until dispelled"
      if (debuffConfig.duration === -1) {
        updatedConfig.durationType = 'permanent';
        updatedConfig.canBeDispelled = true;
      } else {
        // Otherwise, default to turns/rounds
        updatedConfig.durationType = 'turns';
        updatedConfig.durationValue = debuffConfig.duration;
      }

      setDebuffConfig(updatedConfig);
    }
  }, []);

  // Update debuff configuration state (global settings)
  const updateDebuffConfig = (key, value) => {
    const newConfig = {
      ...debuffConfig,
      [key]: value
    };
    setDebuffConfig(newConfig);

    // Always dispatch to global state for preview updates
    dispatch(actionCreators.updateDebuffConfig(newConfig));

    // Log save-related field changes for debugging
    if (key === 'savingThrow' || key === 'difficultyClass' || key === 'saveOutcome') {
      console.log('Updated save-related field:', key, value);
    }
    // If updating the global magnitude or magnitudeType, don't apply to existing modifiers
    // Each stat now has its own magnitude and type
  };

  // Add a stat penalty
  const addStatPenalty = (stat) => {
    const existingPenalties = [...(debuffConfig.statPenalties || [])];

    // Add the new penalty with its own magnitude and magnitudeType
    existingPenalties.push({
      ...stat,
      magnitude: debuffConfig.magnitude || 2,
      magnitudeType: debuffConfig.magnitudeType || 'flat'
    });

    setDebuffConfig(prev => ({
      ...prev,
      statPenalties: existingPenalties
    }));
  };

  // Update an existing stat penalty's magnitude
  const updateStatPenaltyValue = (statId, magnitude) => {
    // Handle both numeric values and dice formula strings
    const updatedPenalties = debuffConfig.statPenalties.map(pen => {
      if (pen.id === statId) {
        return {
          ...pen,
          magnitude
        };
      }
      return pen;
    });

    setDebuffConfig(prev => ({
      ...prev,
      statPenalties: updatedPenalties
    }));
  };

  // Update entire stat penalty object
  const updateStatPenalty = (statId, newStat) => {
    setDebuffConfig(prev => ({
      ...prev,
      statPenalties: prev.statPenalties?.map(stat =>
        stat.id === statId ? newStat : stat
      ) || []
    }));
  };

  // Update an existing stat penalty's magnitude type
  const updateStatPenaltyType = (statId, magnitudeType) => {
    const updatedPenalties = debuffConfig.statPenalties.map(pen => {
      if (pen.id === statId) {
        return {
          ...pen,
          magnitudeType
        };
      }
      return pen;
    });

    setDebuffConfig(prev => ({
      ...prev,
      statPenalties: updatedPenalties
    }));
  };

  // Remove stat penalty
  const removeStatPenalty = (statId) => {
    const statPenalties = debuffConfig.statPenalties || [];
    const newStatPenalties = statPenalties.filter(pen => pen.id !== statId);

    setDebuffConfig(prev => ({
      ...prev,
      statPenalties: newStatPenalties
    }));
  };

  // Get resistance scaling options (same as BuffEffects but for debuffs - reducing resistances)
  const getResistanceScalingOptions = (resistanceType) => {
    if (resistanceType === 'absorption') {
      // Absorption reduction uses flat numbers
      return [
        { value: -50, label: '-50 points', description: 'Reduces absorption by 50 points' },
        { value: -25, label: '-25 points', description: 'Reduces absorption by 25 points' },
        { value: -20, label: '-20 points', description: 'Reduces absorption by 20 points' },
        { value: -15, label: '-15 points', description: 'Reduces absorption by 15 points' },
        { value: -10, label: '-10 points', description: 'Reduces absorption by 10 points' },
        { value: -5, label: '-5 points', description: 'Reduces absorption by 5 points' },
        { value: 'formula', label: 'Formula', description: 'Use dice formula (e.g., -2d6-3)' }
      ];
    } else {
      // Standard resistance reduction uses percentage-based options
      return [
        // Resistance reduction (negative percentages make them more vulnerable)
        { value: -200, label: 'Extreme Vulnerability', description: 'Makes target take 300% damage (-200%)', multiplier: 3.0, color: '#f44336' },
        { value: -150, label: 'Major Vulnerability', description: 'Makes target take 250% damage (-150%)', multiplier: 2.5, color: '#ff5722' },
        { value: -125, label: 'High Vulnerability', description: 'Makes target take 225% damage (-125%)', multiplier: 2.25, color: '#ff9800' },
        { value: -100, label: 'Double Vulnerability', description: 'Makes target take 200% damage (-100%)', multiplier: 2.0, color: '#ffc107' },
        { value: -75, label: 'Significant Vulnerability', description: 'Makes target take 175% damage (-75%)', multiplier: 1.75, color: '#ffeb3b' },
        { value: -50, label: 'Moderate Vulnerability', description: 'Makes target take 150% damage (-50%)', multiplier: 1.5, color: '#cddc39' },
        { value: -25, label: 'Minor Vulnerability', description: 'Makes target take 125% damage (-25%)', multiplier: 1.25, color: '#8bc34a' },

        // Neutral (no change)
        { value: 0, label: 'No Change', description: 'No effect on resistance (0%)', multiplier: 1.0, color: '#9e9e9e' },

        // Resistance reduction (positive percentages reduce their existing resistances)
        { value: 25, label: 'Slight Reduction', description: 'Reduces resistance by 25%', multiplier: 0.75, color: '#4caf50' },
        { value: 50, label: 'Moderate Reduction', description: 'Reduces resistance by 50%', multiplier: 0.5, color: '#2196f3' },
        { value: 75, label: 'Major Reduction', description: 'Reduces resistance by 75%', multiplier: 0.25, color: '#3f51b5' },
        { value: 100, label: 'Complete Nullification', description: 'Removes all resistance (100%)', multiplier: 0.0, color: '#9c27b0' }
      ];
    }
  };

  // Get CSS class name for resistance level
  const getResistanceLevelClass = (value) => {
    if (value === null || value === undefined || value === 'none') return 'none';

    // Handle string values (resistance level names)
    if (typeof value === 'string') {
      return value.toLowerCase().replace(/\s+/g, '-');
    }

    // Handle numeric values
    switch (value) {
      case -200: return 'extreme-vulnerability';
      case -150: return 'major-vulnerability';
      case -125: return 'high-vulnerability';
      case -100: return 'double-vulnerability';
      case -75: return 'significant-vulnerability';
      case -50: return 'moderate-vulnerability';
      case -25: return 'minor-vulnerability';
      case 0: return 'no-change';
      case 25: return 'slight-reduction';
      case 50: return 'moderate-reduction';
      case 75: return 'major-reduction';
      case 100: return 'complete-nullification';
      default: return 'none';
    }
  };

  // Function to render the dynamic stat indicator badge
  const renderStatIndicator = (stat) => {
    const selectedStat = debuffConfig.statPenalties?.find(penalty => penalty.id === stat.id);

    if (!selectedStat) return null;

    let valueDisplay;
    if (typeof selectedStat.magnitude === 'string') {
      // It's a dice formula
      valueDisplay = selectedStat.magnitude;
    } else {
      // It's a number
      // Allow both positive and negative values for debuffs
      const sign = selectedStat.magnitude >= 0 ? '+' : '';
      valueDisplay = selectedStat.magnitudeType === 'percentage'
        ? `${sign}${selectedStat.magnitude}%`
        : `${sign}${selectedStat.magnitude}`;
    }

    return (
      <div className={`stat-indicator ${typeof selectedStat.magnitude === 'string' ? 'formula' : (selectedStat.magnitude >= 0 ? 'positive' : 'negative')}`}>
        {valueDisplay}
      </div>
    );
  };

  // Add status effect to debuff
  const addStatusEffect = (effect) => {
    if (!effect) return;

    const statusEffects = debuffConfig.statusEffects || [];
    const exists = statusEffects.some(e => e.id === effect.id);

    if (!exists) {
      // Get default save type for this effect
      const getDefaultSaveType = (effectId) => {
        const defaultSaves = {
          'charmed': 'wisdom',
          'frightened': 'wisdom',
          'fear': 'wisdom',

          'blinded': 'constitution',
          'blind': 'constitution',
          'paralyzed': 'constitution',
          'poisoned': 'constitution',
          'restrained': 'strength',
          'silenced': 'constitution',

          'weakened': 'constitution',
          'confused': 'wisdom',
          'diseased': 'constitution',
          'bleeding': 'constitution',
          'cursed': 'wisdom'
        };
        return defaultSaves[effectId] || 'constitution';
      };

      // Include essential properties with default save values
      const newStatusEffect = {
        id: effect.id,
        name: effect.name,
        category: effect.category,
        icon: effect.icon || null,
        description: effect.description || '',
        hasAdvancedConfig: effect.hasAdvancedConfig || false,
        options: effect.options || [],
        saveDC: 15,
        saveType: getDefaultSaveType(effect.id),
        saveOutcome: 'negates'
      };

      const newConfig = {
        ...debuffConfig,
        statusEffects: [...statusEffects, newStatusEffect]
      };
      setDebuffConfig(newConfig);
      dispatch(actionCreators.updateDebuffConfig(newConfig));
    }
  };

  // Remove status effect
  const removeStatusEffect = (effectId) => {
    const statusEffects = debuffConfig.statusEffects || [];
    const newStatusEffects = statusEffects.filter(effect => effect.id !== effectId);

    const newConfig = {
      ...debuffConfig,
      statusEffects: newStatusEffects
    };
    setDebuffConfig(newConfig);
    dispatch(actionCreators.updateDebuffConfig(newConfig));
  };

  // Update status effect option
  const updateStatusEffectOption = (effectId, option) => {
    const statusEffects = debuffConfig.statusEffects || [];
    const newStatusEffects = statusEffects.map(effect => {
      if (effect.id === effectId) {
        return { ...effect, option };
      }
      return effect;
    });

    const newConfig = {
      ...debuffConfig,
      statusEffects: newStatusEffects
    };
    setDebuffConfig(newConfig);
    dispatch(actionCreators.updateDebuffConfig(newConfig));
  };

  // Update status effect level
  const updateStatusEffectLevel = (effectId, level) => {
    const statusEffects = debuffConfig.statusEffects || [];
    const newStatusEffects = statusEffects.map(effect => {
      if (effect.id === effectId) {
        return { ...effect, level };
      }
      return effect;
    });

    const newConfig = {
      ...debuffConfig,
      statusEffects: newStatusEffects
    };
    setDebuffConfig(newConfig);
    dispatch(actionCreators.updateDebuffConfig(newConfig));
  };

  // Open the configuration popup for a status effect
  const openStatusEffectConfig = (effect) => {
    setSelectedStatusEffect(effect);
    setConfigPopupOpen(true);
  };

  // Show tooltip on hover
  const handleMouseEnter = (effect, e) => {
    // Check if this effect is selected/configured
    const isSelected = debuffConfig.statusEffects?.some(e => e.id === effect.id);
    const selectedEffect = isSelected ? debuffConfig.statusEffects.find(e => e.id === effect.id) : null;

    // Create Pathfinder style tooltip content
    const tooltipContent = (
      <div className="pathfinder-tooltip">
        <div className="pathfinder-tooltip-header">
          <img
            src={getIconUrl(effect.icon)}
            alt={effect.name}
            className="pathfinder-tooltip-icon"
          />
          <span className="pathfinder-tooltip-title">{effect.name}</span>
        </div>

        <div className="pathfinder-tooltip-body">
          <div className="pathfinder-tooltip-description">
            {effect.description}
          </div>

          {effect.category === 'primary' && (
            <div className="pathfinder-tooltip-effect">
              Reduces your target's {effect.name.toLowerCase()} attribute.
            </div>
          )}
          {effect.category === 'secondary' && (
            <div className="pathfinder-tooltip-effect">
              Weakens your target's {effect.name.toLowerCase()} stat.
            </div>
          )}
          {effect.category === 'resistance' && (
            <div className="pathfinder-tooltip-effect">
              Decreases protection against {effect.name.toLowerCase()} damage.
            </div>
          )}
          {effect.category === 'spell_damage' && (
            <div className="pathfinder-tooltip-effect">
              Reduces the damage dealt with {effect.name.toLowerCase()} spells.
            </div>
          )}
          {effect.category === 'utility' && (
            <div className="pathfinder-tooltip-effect">
              Hinders abilities related to {effect.name.toLowerCase()}.
            </div>
          )}

          {/* Show configured options if this effect is selected */}
          {isSelected && (
            <div className="pathfinder-tooltip-section">
              <div className="pathfinder-tooltip-section-header">Current Configuration</div>

              {selectedEffect.option && effect.options && (
                <div className="pathfinder-tooltip-option">
                  <span className="pathfinder-tooltip-label">Option:</span> {
                    effect.options.find(o => o.id === selectedEffect.option)?.name || 'None'
                  }
                </div>
              )}

              {selectedEffect.level && (
                <div className="pathfinder-tooltip-option">
                  <span className="pathfinder-tooltip-label">Level:</span> {selectedEffect.level}
                </div>
              )}

              {/* Show lifelink specific configuration */}
              {effect.id === 'lifelink' && (
                <>
                  {selectedEffect.direction && (
                    <div className="pathfinder-tooltip-option">
                      <span className="pathfinder-tooltip-label">Direction:</span> {
                        selectedEffect.direction === 'caster_to_target' ? 'Caster to Target' :
                        selectedEffect.direction === 'target_to_caster' ? 'Target to Caster' :
                        'Bidirectional'
                      }
                    </div>
                  )}

                  {selectedEffect.sourceResource && selectedEffect.targetResource && (
                    <div className="pathfinder-tooltip-option">
                      <span className="pathfinder-tooltip-label">Resources:</span> {
                        `${selectedEffect.sourceResource} → ${selectedEffect.targetResource}`
                      }
                    </div>
                  )}

                  {selectedEffect.calculationType && (
                    <div className="pathfinder-tooltip-option">
                      <span className="pathfinder-tooltip-label">Calculation:</span> {
                        selectedEffect.calculationType === 'percentage' ? `${selectedEffect.conversionRate || 25}%` :
                        selectedEffect.calculationType === 'fixed' ? `Fixed (${selectedEffect.fixedAmount || 5})` :
                        selectedEffect.calculationType === 'dice' ? `${selectedEffect.diceCount || 1}${selectedEffect.diceType || 'd6'}` :
                        `${selectedEffect.diceCount || 1}${selectedEffect.diceType || 'd6'} per ${selectedEffect.perAmount || 5}`
                      }
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Status effect available options (only show if not selected) */}
          {!isSelected && effect.options && (
            <div className="pathfinder-tooltip-section">
              <div className="pathfinder-tooltip-section-header">Effect Variations</div>
              {effect.options.slice(0, 3).map((option, index) => (
                <div key={index} className="pathfinder-tooltip-option">
                  <span className="pathfinder-tooltip-label">{option.name}:</span> {option.description}
                </div>
              ))}
              {effect.options.length > 3 && (
                <div className="pathfinder-tooltip-more">
                  ...and {effect.options.length - 3} more variations
                </div>
              )}
            </div>
          )}

          {/* Duration and save information for status effects */}
          {effect.category && ['combat', 'mental', 'physical', 'sensory', 'magical'].includes(effect.category) && (
            <div className="pathfinder-tooltip-section">
              <div className="pathfinder-tooltip-meta">
                <span className="pathfinder-tooltip-label">Duration:</span> Varies based on spell power
              </div>
              <div className="pathfinder-tooltip-meta">
                <span className="pathfinder-tooltip-label">Type:</span> {effect.category.charAt(0).toUpperCase() + effect.category.slice(1)} Affliction
              </div>
              <div className="pathfinder-tooltip-meta">
                <span className="pathfinder-tooltip-label">Save:</span> Target may resist with appropriate saving throw
              </div>
            </div>
          )}
        </div>
      </div>
    );

    // Store the tooltip data
    setTooltipContent(tooltipContent);
    setShowTooltip(true);
    // Update position using client coordinates for fixed positioning
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Handle save type tooltip events
  const handleSaveTypeTooltipEnter = (saveType, event) => {
    const tooltipContent = (
      <div className="pathfinder-tooltip compact-tooltip">
        <div className="pathfinder-tooltip-header">
          <img
            src={getIconUrl(saveType.icon)}
            alt={saveType.name}
            className="pathfinder-tooltip-icon"
          />
          <span className="pathfinder-tooltip-title">{saveType.name.toUpperCase()}</span>
        </div>
        <div className="pathfinder-tooltip-section">
          <div className="pathfinder-tooltip-description">
            {saveType.description}
          </div>
          <div className="pathfinder-tooltip-meta">
            <span className="pathfinder-tooltip-label">Type:</span> Saving Throw
          </div>
        </div>
      </div>
    );

    setTooltipContent({
      content: tooltipContent,
      title: saveType.name,
      icon: getIconUrl(saveType.icon)
    });
    setShowTooltip(true);

    // Calculate better positioning to keep tooltip in viewport
    const targetElement = event.target.closest('.pf-stat-button') || event.target.closest('.effect-option-tab') || event.target;
    if (!targetElement) return; // Safety check
    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = 280; // Estimated tooltip width
    const tooltipHeight = 120; // Estimated tooltip height

    let x = rect.left + (rect.width / 2) - (tooltipWidth / 2); // Center horizontally
    let y = rect.top - tooltipHeight - 10; // Position above the button

    // Keep tooltip within viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position if going off screen
    if (x < 10) x = 10;
    if (x + tooltipWidth > viewportWidth - 10) x = viewportWidth - tooltipWidth - 10;

    // If tooltip would go above viewport, show it below instead
    if (y < 10) {
      y = rect.bottom + 10;
    }

    setMousePos({ x, y });
  };

  // Track mouse position during hover
  const handleMouseMove = (e) => {
    if (showTooltip) {
      // Use clientX/Y for fixed positioning relative to the viewport
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  // Helper function to convert buff descriptions to debuff descriptions
  const convertToDebuffDescription = (buffDescription, statName) => {
    // Simple conversion logic - replace "increases" with "reduces", etc.
    return buffDescription
      .replace(/increases?/gi, 'reduces')
      .replace(/improves?/gi, 'impairs')
      .replace(/enhances?/gi, 'diminishes')
      .replace(/boosts?/gi, 'reduces')
      .replace(/grants?/gi, 'removes');
  };

  // Get stat modifiers by category
  const getStatModifiersByCategory = (category) => {
    // Get base stats from the BUFF_DEBUFF_STAT_MODIFIERS and modify descriptions for debuffs
    const baseStats = BUFF_DEBUFF_STAT_MODIFIERS.filter(stat => stat.category === category);

    // Add special "All" options for certain categories
    const specialOptions = [];

    if (category === 'primary') {
      specialOptions.push({
        id: 'all_primary_stats',
        name: 'All Primary Stats',
        icon: 'spell_holy_blessingofstrength',
        description: 'Reduces all primary attributes',
        category: 'primary'
      });
    } else if (category === 'resistance') {
      // Add resistance modifiers with debuff scaling system
      const RESISTANCE_MODIFIERS = [
        { id: 'all_resistances', name: 'All Resistances', icon: 'spell_shadow_shadowwordpain', description: 'Reduces resistance to all damage types', category: 'resistance', resistanceType: 'general' },
        { id: 'physical_resistance', name: 'Physical Resistance', icon: 'inv_shield_05', description: 'Reduces resistance to physical damage', category: 'resistance', resistanceType: 'standard' },
        { id: 'fire_resistance', name: 'Fire Resistance', icon: 'spell_fire_firearmor', description: 'Reduces resistance to fire damage', category: 'resistance', resistanceType: 'standard' },
        { id: 'cold_resistance', name: 'Cold Resistance', icon: 'spell_frost_frostarmor', description: 'Reduces resistance to cold damage', category: 'resistance', resistanceType: 'standard' },
        { id: 'lightning_resistance', name: 'Lightning Resistance', icon: 'spell_nature_lightningshield', description: 'Reduces resistance to lightning damage', category: 'resistance', resistanceType: 'standard' },
        { id: 'necrotic_resistance', name: 'Necrotic Resistance', icon: 'spell_shadow_antishadow', description: 'Reduces resistance to necrotic damage', category: 'resistance', resistanceType: 'standard' },
        { id: 'radiant_resistance', name: 'Radiant Resistance', icon: 'spell_holy_blessingofprotection', description: 'Reduces resistance to radiant damage', category: 'resistance', resistanceType: 'standard' },
        { id: 'poison_resistance', name: 'Poison Resistance', icon: 'ability_creature_poison_02', description: 'Reduces resistance to poison damage', category: 'resistance', resistanceType: 'standard' },
        { id: 'psychic_resistance', name: 'Psychic Resistance', icon: 'spell_shadow_mindsteal', description: 'Reduces resistance to psychic damage', category: 'resistance', resistanceType: 'standard' },
        { id: 'force_resistance', name: 'Force Resistance', icon: 'spell_arcane_blast', description: 'Reduces resistance to force damage', category: 'resistance', resistanceType: 'standard' },
        { id: 'acid_resistance', name: 'Acid Resistance', icon: 'spell_nature_acid_01', description: 'Reduces resistance to acid damage', category: 'resistance', resistanceType: 'standard' },
        { id: 'sonic_resistance', name: 'Sonic Resistance', icon: 'spell_holy_silence', description: 'Reduces resistance to sonic damage', category: 'resistance', resistanceType: 'standard' },

        // Absorption reduction types - use flat numbers for all damage types
        { id: 'damage_absorption', name: 'All Damage Absorption', icon: 'spell_shadow_antimagicshell', description: 'Reduces absorption of all damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'physical_absorption', name: 'Physical Absorption', icon: 'inv_shield_05', description: 'Reduces absorption of physical damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'fire_absorption', name: 'Fire Absorption', icon: 'spell_fire_firearmor', description: 'Reduces absorption of fire damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'cold_absorption', name: 'Cold Absorption', icon: 'spell_frost_frostarmor', description: 'Reduces absorption of cold damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'lightning_absorption', name: 'Lightning Absorption', icon: 'spell_nature_lightningshield', description: 'Reduces absorption of lightning damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'necrotic_absorption', name: 'Necrotic Absorption', icon: 'spell_shadow_antishadow', description: 'Reduces absorption of necrotic damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'radiant_absorption', name: 'Radiant Absorption', icon: 'spell_holy_blessingofprotection', description: 'Reduces absorption of radiant damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'poison_absorption', name: 'Poison Absorption', icon: 'ability_creature_poison_02', description: 'Reduces absorption of poison damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'psychic_absorption', name: 'Psychic Absorption', icon: 'spell_shadow_mindsteal', description: 'Reduces absorption of psychic damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'force_absorption', name: 'Force Absorption', icon: 'spell_arcane_blast', description: 'Reduces absorption of force damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'acid_absorption', name: 'Acid Absorption', icon: 'spell_nature_acid_01', description: 'Reduces absorption of acid damage', category: 'resistance', resistanceType: 'absorption' },
        { id: 'sonic_absorption', name: 'Sonic Absorption', icon: 'spell_holy_silence', description: 'Reduces absorption of sonic damage', category: 'resistance', resistanceType: 'absorption' }
      ];

      return RESISTANCE_MODIFIERS;
    }

    // Convert buff descriptions to debuff descriptions
    const debuffStats = baseStats.map(stat => ({
      ...stat,
      description: convertToDebuffDescription(stat.description, stat.name)
    }));

    // Add some debuff-specific stats that aren't in the base list
    const additionalStats = [];

    if (category === 'secondary') {
      additionalStats.push(
        { id: 'healing_received', name: 'Healing Received', icon: 'spell_holy_healingaura', description: 'Reduces effectiveness of healing received', category: 'secondary' }
      );
    } else if (category === 'combat') {
      additionalStats.push(
        { id: 'attack_bonus', name: 'Attack Bonus', icon: 'inv_sword_04', description: 'Reduces accuracy with attacks', category: 'combat' },
        { id: 'damage_bonus', name: 'Damage Bonus', icon: 'ability_warrior_decisivestrike', description: 'Reduces damage dealt with attacks', category: 'combat' },
        { id: 'spell_penetration', name: 'Spell Penetration', icon: 'spell_arcane_blast', description: 'Reduces ability to penetrate spell resistance', category: 'combat' }
      );
    } else if (category === 'damage') {
      // Add damage type modifiers for debuffs (reducing damage output)
      additionalStats.push(
        { id: 'all_spell_damage', name: 'All Spell Damage', icon: 'spell_shadow_curseofweakness', description: 'Reduces damage dealt with all spells', category: 'damage' },
        { id: 'fire_spell_power', name: 'Fire Spell Power', icon: 'spell_fire_fire', description: 'Reduces damage dealt with fire spells', category: 'damage' },
        { id: 'cold_spell_power', name: 'Cold Spell Power', icon: 'spell_frost_frostbolt02', description: 'Reduces damage dealt with cold spells', category: 'damage' },
        { id: 'lightning_spell_power', name: 'Lightning Spell Power', icon: 'spell_nature_lightning', description: 'Reduces damage dealt with lightning spells', category: 'damage' },
        { id: 'necrotic_spell_power', name: 'Necrotic Spell Power', icon: 'spell_shadow_shadowbolt', description: 'Reduces damage dealt with necrotic spells', category: 'damage' },
        { id: 'radiant_spell_power', name: 'Radiant Spell Power', icon: 'spell_holy_holysmite', description: 'Reduces damage dealt with radiant spells', category: 'damage' },
        { id: 'poison_spell_power', name: 'Poison Spell Power', icon: 'spell_nature_corrosivebreath', description: 'Reduces damage dealt with poison spells', category: 'damage' },
        { id: 'psychic_spell_power', name: 'Psychic Spell Power', icon: 'spell_shadow_mindsteal', description: 'Reduces damage dealt with psychic spells', category: 'damage' },
        { id: 'force_spell_power', name: 'Force Spell Power', icon: 'spell_arcane_blast', description: 'Reduces damage dealt with force spells', category: 'damage' },
        { id: 'acid_spell_power', name: 'Acid Spell Power', icon: 'spell_nature_acid_01', description: 'Reduces damage dealt with acid spells', category: 'damage' },
        { id: 'sonic_spell_power', name: 'Sonic Spell Power', icon: 'spell_holy_silence', description: 'Reduces damage dealt with sonic spells', category: 'damage' },
        { id: 'weapon_damage', name: 'Weapon Damage', icon: 'inv_sword_04', description: 'Reduces damage dealt with weapons', category: 'damage' },
        { id: 'ranged_damage', name: 'Ranged Damage', icon: 'ability_hunter_aimedshot', description: 'Reduces damage dealt with ranged weapons', category: 'damage' }
      );
    }

    return [...specialOptions, ...debuffStats, ...additionalStats];
  };

  // Get status effects by category
  const getStatusEffectsByCategory = (category) => {
    // Use the proper NEGATIVE_STATUS_EFFECTS data
    if (category === 'all') {
      return NEGATIVE_STATUS_EFFECTS;
    }

    return NEGATIVE_STATUS_EFFECTS.filter(effect => effect.category === category);
  };

  // Helper function to get icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  };

  // Add a function to generate detailed effect descriptions based on the selected effect type and intensity level
  const getEffectDescription = (effectId, optionId, level) => {
    const effect = getStatusEffectsByCategory('all').find(e => e.id === effectId);
    if (!effect) return '';

    const option = effect.options.find(o => o.id === optionId);
    if (!option) return effect.description;

    // Base descriptions for each intensity level
    const intensityDescriptions = {
      minor: {
        blinded: {
          partial: "Target has disadvantage on perception checks and attacks",
          total: "Target has disadvantage on all attacks and -5 to Perception",
          flash: "Target is briefly blinded, disadvantage on next attack only"
        },
        charmed: {
          friendly: "Target regards you as a friendly acquaintance for a short time",
          dominated: "Target follows simple, non-harmful suggestions",
          infatuated: "Target is mildly attracted to you and more likely to help"
        },
        frightened: {
          shaken: "Target has disadvantage on ability checks while source is visible",
          terrified: "Target is hesitant to move closer to the fear source",
          panicked: "Target prefers to move away from the source if possible"
        },
        paralyzed: {
          partial: "Target's movement speed is reduced by 10 feet",
          complete: "Target's movement speed is reduced to 0 for 1 round",
          magical: "Target has disadvantage on concentration checks for spells"
        },
        poisoned: {
          weakening: "Target has disadvantage on their next Strength check",
          debilitating: "Target takes 1d4 poison damage",
          paralyzing: "Target feels numbness in extremities, -2 to Dexterity checks"
        },
        stunned: {
          dazed: "Target has disadvantage on their next attack roll",
          unconscious: "Target is disoriented for 1 round",
          electric: "Target experiences a mild shock"
        },
        restrained: {
          ensnared: "Target's movement speed is reduced by half",
          grappled: "Target can be grappled with advantage",
          bound: "Target takes 1 extra round to break restraints"
        },
        silenced: {
          magical: "Target cannot speak loudly for a short time",
          muted: "Target's voice is reduced to a whisper",
          temporal: "Target occasionally stutters when casting verbal spells"
        },
        slowed: {
          hindered: "Target's movement speed is reduced by 5 feet",
          lethargic: "Target loses 1 action point next round",
          temporal: "Target's reaction time slightly increases"
        },
        burning: {
          mild: "Target takes 1d4 fire damage",
          intense: "Target takes 1d6 fire damage",
          magical: "Target takes 1d4 fire damage that ignores resistance"
        },
        frozen: {
          chilled: "Target's movement speed is reduced by 5 feet",
          frostbitten: "Target has disadvantage on Dexterity checks for 1 round",
          frozen: "Parts of target's body are covered in frost, movement reduced by 5 feet"
        },
        weakened: {
          fatigued: "Target deals 2 less damage with strength-based attacks",
          exhausted: "Target has disadvantage on Constitution saving throws",
          drained: "Target's maximum hit points are reduced by 5"
        },
        confused: {
          disoriented: "Target has disadvantage on Intelligence checks",
          befuddled: "5% chance target attacks a random target",
          insane: "Target babbles incoherently on their turn"
        },
        diseased: {
          infected: "Target cannot regain hit points for 1 round",
          contagious: "Target has a 5% chance to spread disease to allies within 5 feet",
          terminal: "Target has disadvantage on Constitution checks"
        },
        bleeding: {
          minor: "Target takes 1 damage at the start of their turn",
          severe: "Target takes 1d4 damage at the start of their turn",
          hemorrhaging: "Target has disadvantage on Constitution saving throws"
        },
        slept: {
          drowsy: "Target has disadvantage on Perception checks",
          asleep: "Target falls asleep but wakes up if they take damage",
          comatose: "Target falls into a light sleep"
        },
        dazed: {
          lightheaded: "Target has -1 to attack rolls",
          disoriented: "Target has disadvantage on Initiative rolls",
          concussed: "Target has disadvantage on concentration checks"
        }
      },
      moderate: {
        blinded: {
          partial: "Target cannot see beyond 10 feet and has disadvantage on attacks",
          total: "Target cannot see at all for the duration",
          flash: "Target is blinded for 1d4 rounds"
        },
        charmed: {
          friendly: "Target regards you as a trusted friend and will assist you",
          dominated: "Target follows your commands if not directly harmful",
          infatuated: "Target is attracted to you and will defend you from harm"
        },
        frightened: {
          shaken: "Target has disadvantage on all ability checks while source is visible",
          terrified: "Target cannot willingly move closer to the source of fear",
          panicked: "Target must use its action to Dash away from the source"
        },
        paralyzed: {
          partial: "Target's movement speed is reduced to 0",
          complete: "Target is incapacitated and cannot take actions or reactions",
          magical: "Target cannot cast spells with somatic components"
        },
        poisoned: {
          weakening: "Target has disadvantage on all Strength checks and saving throws",
          debilitating: "Target takes 2d4 poison damage per round",
          paralyzing: "Target has a 25% chance of being paralyzed for 1 round"
        },
        stunned: {
          dazed: "Target has disadvantage on all attack rolls and ability checks",
          unconscious: "Target falls prone and is incapacitated for 1 round",
          electric: "Target drops held items and is stunned for 1 round"
        },
        restrained: {
          ensnared: "Target's speed becomes 0 and has disadvantage on Dexterity saving throws",
          grappled: "Target is grappled (escape DC equals spell save DC)",
          bound: "Target is restrained and cannot use their hands"
        },
        silenced: {
          magical: "Target cannot cast spells with verbal components",
          muted: "Target cannot speak at all",
          temporal: "Target has a 50% chance to fail when casting verbal spells"
        },
        slowed: {
          hindered: "Target's movement speed is halved",
          lethargic: "Target can take either an action or a bonus action on their turn, not both",
          temporal: "Target acts as if under the Slow spell"
        },
        burning: {
          mild: "Target takes 2d4 fire damage per round",
          intense: "Target takes 2d6 fire damage and may ignite flammable objects",
          magical: "Target takes 2d4 fire damage that ignores resistance"
        },
        frozen: {
          chilled: "Target's movement speed is halved and has disadvantage on Dexterity saves",
          frostbitten: "Target takes 1d6 cold damage and has disadvantage on attack rolls",
          frozen: "Target is partially encased in ice, speed reduced to 0"
        },
        weakened: {
          fatigued: "Target deals 1d4 less damage with all attacks",
          exhausted: "Target has disadvantage on all physical ability checks",
          drained: "Target's maximum hit points are reduced by 15"
        },
        confused: {
          disoriented: "Target has a 25% chance to lose their action",
          befuddled: "25% chance target attacks random creature within range",
          insane: "Target behaves randomly (roll on confusion table)"
        },
        diseased: {
          infected: "Target cannot regain hit points naturally",
          contagious: "25% chance to affect others within 5 feet at end of target's turn",
          terminal: "Target has disadvantage on death saving throws"
        },
        bleeding: {
          minor: "Target takes 1d4 damage at start of their turn",
          severe: "Target takes 2d4 damage at start of their turn",
          hemorrhaging: "Target has disadvantage on Constitution saving throws"
        },
        slept: {
          drowsy: "Target has disadvantage on all ability checks",
          asleep: "Target falls asleep for the duration or until shaken awake",
          comatose: "Target falls into a deep sleep and can only be awakened by magical means"
        },
        dazed: {
          lightheaded: "Target has -2 to all attack rolls and saving throws",
          disoriented: "Target may move in a random direction on their turn",
          concussed: "Target may not take reactions and has disadvantage on Intelligence checks"
        }
      },
      major: {
        blinded: {
          partial: "Target is completely blinded in one eye (-5 to Perception, disadvantage on ranged attacks)",
          total: "Target is completely blind and considered an incapacitated condition",
          flash: "Target is permanently blinded until magical healing is received"
        },
        charmed: {
          friendly: "Target sees you as their closest ally and will follow your suggestions even if dangerous",
          dominated: "Target is under your complete control and will follow any command",
          infatuated: "Target is completely devoted to you and will sacrifice themselves for you"
        },
        frightened: {
          shaken: "Target is frightened and has disadvantage on all rolls while source is visible",
          terrified: "Target is terrified and must use all movement to get away from the source",
          panicked: "Target is panicked and flees at maximum speed, dropping items and unable to take actions"
        },
        paralyzed: {
          partial: "Target is partially paralyzed (incapacitated but aware of surroundings)",
          complete: "Target is completely paralyzed (incapacitated, can't move or speak, auto-fails STR/DEX saves)",
          magical: "Target is magically locked in stasis (cannot be moved, immune to further effects)"
        },
        poisoned: {
          weakening: "Target's Strength and Constitution scores are reduced by 4",
          debilitating: "Target takes 4d4 poison damage per round and is incapacitated",
          paralyzing: "Target is paralyzed and takes 2d4 poison damage per round"
        },
        stunned: {
          dazed: "Target is stunned (can't take actions/reactions, drops everything, can't speak, auto-fails STR/DEX saves)",
          unconscious: "Target falls unconscious for 1d4 hours",
          electric: "Target is stunned and creatures within 5 feet must make a DEX save or be stunned as well"
        },
        restrained: {
          ensnared: "Target is restrained (0 speed, disadvantage on attacks, advantage on attacks against them)",
          grappled: "Target is restrained and being crushed (takes 1d6 damage per round)",
          bound: "Target is completely immobilized and cannot speak or cast spells"
        },
        silenced: {
          magical: "All sound is nullified in a 15-foot radius around the target",
          muted: "Target cannot produce any sound at all, including from objects they interact with",
          temporal: "Target's speech and spellcasting are temporally displaced (always fail verbal components)"
        },
        slowed: {
          hindered: "Target's speed is reduced to 5 feet and they have disadvantage on all DEX saves",
          lethargic: "Target can only take an action OR bonus action once every 2 rounds",
          temporal: "Target is caught in a time distortion (can only take an action every other turn)"
        },
        burning: {
          mild: "Target takes 3d6 fire damage per round and ignites flammable objects",
          intense: "Target takes 4d6 fire damage and spreads to nearby creatures (5-ft radius)",
          magical: "Target takes 3d6 fire damage that ignores resistance and immunity"
        },
        frozen: {
          chilled: "Target's speed is 0 and they have disadvantage on all physical checks",
          frostbitten: "Target takes 2d6 cold damage and parts of their body become brittle",
          frozen: "Target is completely encased in ice (paralyzed condition)"
        },
        weakened: {
          fatigued: "Target deals half damage with all attacks",
          exhausted: "Target gains multiple levels of exhaustion as per PHB",
          drained: "Target's maximum hit points are reduced by half"
        },
        confused: {
          disoriented: "Target acts as if under the Confusion spell",
          befuddled: "Target attacks the nearest creature each turn, regardless of allegiance",
          insane: "Target is permanently insane until cured by Greater Restoration"
        },
        diseased: {
          infected: "Target cannot regain hit points by any means",
          contagious: "Disease spreads to all creatures within 15 feet at end of target's turn",
          terminal: "Target must make a Constitution save each day or gain a level of exhaustion"
        },
        bleeding: {
          minor: "Target takes 2d4 damage at the start of their turn",
          severe: "Target takes 3d6 damage at the start of their turn and leaves a blood trail",
          hemorrhaging: "Target is incapacitated from blood loss and takes 3d8 damage per round"
        },
        slept: {
          drowsy: "Target is incapacitated as they struggle to stay awake",
          asleep: "Target falls into a deep sleep for 8 hours and cannot be awakened normally",
          comatose: "Target falls into a magical coma that lasts until dispelled"
        },
        dazed: {
          lightheaded: "Target has -5 to all rolls and cannot take reactions",
          disoriented: "Target cannot distinguish friend from foe and attacks random targets",
          concussed: "Target is stunned and cannot take any actions for 1d4 rounds"
        }
      }
    };

    // Return the detailed description based on effect, option, and level
    if (intensityDescriptions[level]?.[effectId]?.[optionId]) {
      return intensityDescriptions[level][effectId][optionId];
    }

    // Fallback to basic description
    return option.description || effect.description;
  };

  return (
    <div className="pf-effects-container">
      <div className="pf-section-header">
        <h3 className="pf-section-title">Debuff Configuration</h3>
        <p className="pf-section-subtitle">Apply negative effects to enemies</p>
      </div>

      <div className="pf-config-section">
        <div className="duration-config-section">
          <h4 className="pf-config-title">Duration</h4>

          <div className="pf-config-option">
            <label>Duration Type</label>
            <div className="pf-button-group">
              <button
                className={`pf-button ${debuffConfig.durationType === 'turns' ? 'pf-button-selected' : ''}`}
                onClick={() => updateDebuffConfig('durationType', 'turns')}
              >
                <span>Turns</span>
              </button>
              <button
                className={`pf-button ${debuffConfig.durationType === 'rounds' ? 'pf-button-selected' : ''}`}
                onClick={() => updateDebuffConfig('durationType', 'rounds')}
              >
                <span>Rounds</span>
              </button>
              <button
                className={`pf-button ${debuffConfig.durationType === 'time' ? 'pf-button-selected' : ''}`}
                onClick={() => updateDebuffConfig('durationType', 'time')}
              >
                <span>Time-Based</span>
              </button>
              <button
                className={`pf-button ${debuffConfig.durationType === 'rest' ? 'pf-button-selected' : ''}`}
                onClick={() => updateDebuffConfig('durationType', 'rest')}
              >
                <span>Rest-Based</span>
              </button>
              <button
                className={`pf-button ${debuffConfig.durationType === 'permanent' ? 'pf-button-selected' : ''}`}
                onClick={() => updateDebuffConfig('durationType', 'permanent')}
              >
                <span>Permanent</span>
              </button>
            </div>
          </div>

          {(debuffConfig.durationType === 'turns' || debuffConfig.durationType === 'rounds') && (
            <div className="pf-config-option">
              <label>Number of {debuffConfig.durationType === 'turns' ? 'Turns' : 'Rounds'}</label>
              <input
                type="number"
                min="1"
                max="100"
                value={debuffConfig.durationValue || 1}
                placeholder="1"
                onChange={(e) => {
                  updateDebuffConfig('durationValue', parseInt(e.target.value));
                  // Also update legacy duration field for backward compatibility
                  updateDebuffConfig('duration', parseInt(e.target.value));
                }}
                className="pf-input"
              />
            </div>
          )}

          {debuffConfig.durationType === 'time' && (
            <div className="pf-config-option">
              <label>Duration</label>
              <div className="duration-time-input">
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={debuffConfig.durationValue || 1}
                  onChange={(e) => {
                    updateDebuffConfig('durationValue', parseInt(e.target.value));
                  }}
                />
                <select
                  value={debuffConfig.durationUnit || 'minutes'}
                  onChange={(e) => {
                    updateDebuffConfig('durationUnit', e.target.value);
                  }}
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          )}

          {debuffConfig.durationType === 'rest' && (
            <div className="pf-config-option">
              <label>Rest Type</label>
              <div className="pf-button-group">
                <button
                  className={`pf-button ${debuffConfig.restType === 'short' ? 'pf-button-selected' : ''}`}
                  onClick={() => updateDebuffConfig('restType', 'short')}
                >
                  <span>Until Short Rest</span>
                </button>
                <button
                  className={`pf-button ${debuffConfig.restType === 'long' ? 'pf-button-selected' : ''}`}
                  onClick={() => updateDebuffConfig('restType', 'long')}
                >
                  <span>Until Long Rest</span>
                </button>
              </div>
            </div>
          )}

          {debuffConfig.durationType === 'permanent' && (
            <div className="pf-config-option">
              <div className="pf-toggle-group">
                <button
                  className={`pf-toggle-button ${debuffConfig.canBeDispelled ? 'pf-toggle-active' : ''}`}
                  onClick={() => updateDebuffConfig('canBeDispelled', !debuffConfig.canBeDispelled)}
                >
                  <div className="pf-toggle-icon">
                    {debuffConfig.canBeDispelled ? '✓' : ''}
                  </div>
                  <span>Can Be Dispelled</span>
                </button>
              </div>
            </div>
          )}

          {(debuffConfig.durationType === 'turns' || debuffConfig.durationType === 'time') && (
            <div className="pf-config-option">
              <div className="pf-toggle-group">
                <button
                  className={`pf-toggle-button ${debuffConfig.concentrationRequired ? 'pf-toggle-active' : ''}`}
                  onClick={() => updateDebuffConfig('concentrationRequired', !debuffConfig.concentrationRequired)}
                >
                  <div className="pf-toggle-icon">
                    {debuffConfig.concentrationRequired ? '✓' : ''}
                  </div>
                  <span>Requires Concentration</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="config-option">
          <label>Stacking</label>
          <select
            value={debuffConfig.stackingRule || 'replace'}
            onChange={(e) => {
              const newStackingRule = e.target.value;
              updateDebuffConfig('stackingRule', newStackingRule);

              // Initialize progressiveStages array when selecting progressive stacking rule
              if (newStackingRule === 'progressive' && !debuffConfig.progressiveStages) {
                updateDebuffConfig('progressiveStages', []);
              }
            }}
            className="buff-dropdown"
          >
            {DEBUFF_STACKING_RULE_OPTIONS.map(rule => (
              <option key={rule.value} value={rule.value}>
                {rule.label}
              </option>
            ))}
          </select>
        </div>

        <div className="config-option">
          <label>Max Stacks</label>
          <input
            type="number"
            value={debuffConfig.maxStacks || 1}
            min="1"
            max="10"
            onChange={(e) => updateDebuffConfig('maxStacks', parseInt(e.target.value))}
            disabled={debuffConfig.stackingRule !== 'selfStacking' && debuffConfig.stackingRule !== 'cumulative'}
          />
        </div>

        {/* Saving Throw Configuration */}
        <div className="pf-config-section">
          <h4 className="pf-section-header">Saving Throw</h4>

          <div className="pf-config-option">
            <label>Difficulty Class (DC)</label>
            <input
              type="number"
              value={debuffConfig.difficultyClass || 15}
              min="1"
              max="30"
              onChange={(e) => updateDebuffConfig('difficultyClass', parseInt(e.target.value))}
            />
          </div>

          <div className="pf-config-option">
            <label>Save Type</label>
            <div className="pf-stat-grid">
              {SAVE_TYPES.map(type => (
                <button
                  key={type.id}
                  className={`pf-stat-button ${debuffConfig.savingThrow === type.id ? 'pf-stat-selected' : ''}`}
                  onClick={() => updateDebuffConfig('savingThrow', type.id)}
                  title={type.description}
                  onMouseEnter={(e) => handleSaveTypeTooltipEnter(type, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  <div className="pf-stat-icon">
                    <img
                      src={getIconUrl(type.icon)}
                      alt={type.name}
                    />
                  </div>
                  <span className="pf-stat-name">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pf-config-option">
            <label>Save Outcome</label>
            <div className="pf-button-group">
              <button
                className={`pf-button ${debuffConfig.saveOutcome === 'negates' ? 'pf-button-selected' : ''}`}
                onClick={() => updateDebuffConfig('saveOutcome', 'negates')}
              >
                Negates
              </button>
              <button
                className={`pf-button ${debuffConfig.saveOutcome === 'halves_duration' ? 'pf-button-selected' : ''}`}
                onClick={() => updateDebuffConfig('saveOutcome', 'halves_duration')}
              >
                Halves Duration
              </button>
              <button
                className={`pf-button ${debuffConfig.saveOutcome === 'halves_effects' ? 'pf-button-selected' : ''}`}
                onClick={() => updateDebuffConfig('saveOutcome', 'halves_effects')}
              >
                Halves Effects
              </button>
              <button
                className={`pf-button ${debuffConfig.saveOutcome === 'reduces_level' ? 'pf-button-selected' : ''}`}
                onClick={() => updateDebuffConfig('saveOutcome', 'reduces_level')}
              >
                Reduces Level
              </button>
            </div>
          </div>
        </div>

        {/* Progressive debuff configuration */}
        {debuffConfig.stackingRule === 'progressive' && (
          <div className="progressive-buff-config">
            <div className="config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${debuffConfig.isProgressive ? 'active' : ''}`}
                    onClick={() => updateDebuffConfig('isProgressive', !debuffConfig.isProgressive)}
                  >
                    <div className="toggle-icon">
                      {debuffConfig.isProgressive ? '✓' : ''}
                    </div>
                    <span>Enable Progressive Effect</span>
                  </button>
                </div>
              </div>
            </div>

            {debuffConfig.isProgressive && (
              <div className="progressive-stages">
                <h4>Progressive Stages</h4>
                <p className="stage-description">Configure how the debuff changes over time</p>

                {debuffConfig.progressiveStages && debuffConfig.progressiveStages.length > 0 ? (
                  <div className="stages-list">
                    {debuffConfig.progressiveStages.map((stage, index) => (
                      <div key={index} className="stage-item">
                        <div className="stage-header">
                          <span className="stage-title">Stage {index + 1}</span>
                          <div className="stage-actions">
                            <button
                              className="stage-action delete"
                              onClick={() => {
                                const updatedStages = [...debuffConfig.progressiveStages];
                                updatedStages.splice(index, 1);
                                updateDebuffConfig('progressiveStages', updatedStages);
                              }}
                              title="Remove stage"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <div className="stage-content">
                          <div className="stage-timing">
                            <label>Trigger at:</label>
                            <div className="stage-timing-inputs">
                              <input
                                type="number"
                                min="1"
                                max={debuffConfig.durationValue || 3}
                                value={stage.triggerAt || 1}
                                onChange={(e) => {
                                  const updatedStages = [...debuffConfig.progressiveStages];
                                  updatedStages[index] = {
                                    ...updatedStages[index],
                                    triggerAt: parseInt(e.target.value)
                                  };
                                  updateDebuffConfig('progressiveStages', updatedStages);
                                }}
                              />
                              <span className="unit-label">{debuffConfig.durationUnit || 'rounds'}</span>
                            </div>
                          </div>
                          <div className="stage-spell-effect">
                            <label>Trigger Spell (optional):</label>
                            <SpellSelector
                              selectedSpellId={stage.spellEffect || null}
                              onSpellSelect={(spellId, spellData) => {
                                const updatedStages = [...debuffConfig.progressiveStages];
                                updatedStages[index] = {
                                  ...updatedStages[index],
                                  spellEffect: spellId,
                                  spellData: spellData // Store the full spell data
                                };
                                updateDebuffConfig('progressiveStages', updatedStages);
                              }}
                              label="Select a spell to trigger at this stage"
                            />
                          </div>

                          {/* Saving throw configuration for this stage */}
                          <div className="stage-save-config">
                            <div className="stage-save-row">
                              <div className="stage-save-dc">
                                <label>DC:</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="30"
                                  value={stage.difficultyClass || 15}
                                  onChange={(e) => {
                                    const updatedStages = [...debuffConfig.progressiveStages];
                                    updatedStages[index] = {
                                      ...updatedStages[index],
                                      difficultyClass: parseInt(e.target.value)
                                    };
                                    updateDebuffConfig('progressiveStages', updatedStages);
                                  }}
                                />
                              </div>

                              <div className="stage-save-type">
                                <label>Save:</label>
                                <select
                                  value={stage.savingThrow || 'constitution'}
                                  onChange={(e) => {
                                    const updatedStages = [...debuffConfig.progressiveStages];
                                    updatedStages[index] = {
                                      ...updatedStages[index],
                                      savingThrow: e.target.value
                                    };
                                    updateDebuffConfig('progressiveStages', updatedStages);
                                  }}
                                >
                                  {SAVE_TYPES.map(type => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="stage-stats">
                            <label>Stats Affected:</label>
                            <div className="stage-stats-selector">
                              {debuffConfig.statPenalties && debuffConfig.statPenalties.length > 0 ? (
                                <div className="stage-stats-list">
                                  {debuffConfig.statPenalties.map(stat => {
                                    // Check if this stat is included in this stage
                                    const isIncluded = stage.statPenalties?.some(mod => mod.id === stat.id);

                                    return (
                                      <div key={stat.id} className={`stage-stat-item ${isIncluded ? 'included' : ''}`}>
                                        <div className="stage-stat-checkbox">
                                          <input
                                            type="checkbox"
                                            checked={isIncluded}
                                            onChange={() => {
                                              const updatedStages = [...debuffConfig.progressiveStages];
                                              let updatedStatPenalties = [...(stage.statPenalties || [])];

                                              if (isIncluded) {
                                                // Remove this stat from the stage
                                                updatedStatPenalties = updatedStatPenalties.filter(mod => mod.id !== stat.id);
                                              } else {
                                                // Add this stat to the stage
                                                updatedStatPenalties.push({
                                                  id: stat.id,
                                                  name: stat.name,
                                                  icon: stat.icon,
                                                  magnitude: stat.magnitude || -2,
                                                  magnitudeType: stat.magnitudeType || 'flat'
                                                });
                                              }

                                              updatedStages[index] = {
                                                ...updatedStages[index],
                                                statPenalties: updatedStatPenalties
                                              };
                                              updateDebuffConfig('progressiveStages', updatedStages);
                                            }}
                                          />
                                        </div>
                                        <div className="stage-stat-icon">
                                          <img src={getIconUrl(stat.icon)} alt={stat.name} />
                                        </div>
                                        <div className="stage-stat-name">{stat.name}</div>

                                        {isIncluded && (
                                          <div className="stage-stat-value">
                                            <input
                                              type="text"
                                              value={stage.statPenalties.find(mod => mod.id === stat.id)?.magnitude || ''}
                                              onChange={(e) => {
                                                const updatedStages = [...debuffConfig.progressiveStages];
                                                const updatedStatPenalties = [...(stage.statPenalties || [])];
                                                const statIndex = updatedStatPenalties.findIndex(mod => mod.id === stat.id);

                                                if (statIndex !== -1) {
                                                  updatedStatPenalties[statIndex] = {
                                                    ...updatedStatPenalties[statIndex],
                                                    magnitude: e.target.value
                                                  };

                                                  updatedStages[index] = {
                                                    ...updatedStages[index],
                                                    statPenalties: updatedStatPenalties
                                                  };
                                                  updateDebuffConfig('progressiveStages', updatedStages);
                                                }
                                              }}
                                              placeholder="Value or formula"
                                            />
                                            <select
                                              value={stage.statPenalties.find(mod => mod.id === stat.id)?.magnitudeType || 'flat'}
                                              onChange={(e) => {
                                                const updatedStages = [...debuffConfig.progressiveStages];
                                                const updatedStatPenalties = [...(stage.statPenalties || [])];
                                                const statIndex = updatedStatPenalties.findIndex(mod => mod.id === stat.id);

                                                if (statIndex !== -1) {
                                                  updatedStatPenalties[statIndex] = {
                                                    ...updatedStatPenalties[statIndex],
                                                    magnitudeType: e.target.value
                                                  };

                                                  updatedStages[index] = {
                                                    ...updatedStages[index],
                                                    statPenalties: updatedStatPenalties
                                                  };
                                                  updateDebuffConfig('progressiveStages', updatedStages);
                                                }
                                              }}
                                            >
                                              <option value="flat">Flat</option>
                                              <option value="percentage">Percentage</option>
                                            </select>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="no-stats-message">
                                  <p>No stats selected. Add stats to the debuff first.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-stages">No stages configured yet</div>
                )}

                <button
                  className="add-stage-button"
                  onClick={() => {
                    const progressiveStages = debuffConfig.progressiveStages || [];

                    // Create stat modifiers for the new stage based on selected stats
                    const stageStatPenalties = debuffConfig.statPenalties ?
                      debuffConfig.statPenalties.map(stat => ({
                        id: stat.id,
                        name: stat.name,
                        icon: stat.icon,
                        magnitude: stat.magnitude || -2,
                        magnitudeType: stat.magnitudeType || 'flat'
                      })) : [];

                    const newStage = {
                      triggerAt: progressiveStages.length + 1,
                      statPenalties: stageStatPenalties,
                      spellEffect: null,
                      // Include saving throw information
                      difficultyClass: debuffConfig.difficultyClass || 15,
                      savingThrow: debuffConfig.savingThrow || 'constitution'
                    };
                    updateDebuffConfig('progressiveStages', [...progressiveStages, newStage]);
                  }}
                >
                  + Add Stage
                </button>
              </div>
            )}
          </div>
        )}

        {/* Default Magnitude and Default Type fields removed as they are configured when choosing a debuff */}
      </div>

      {showDiceExamples && <DiceFormulaExamples />}

      <button
        className="dice-formula-help-button"
        onClick={() => setShowDiceExamples(!showDiceExamples)}
      >
        {showDiceExamples ? 'Hide Dice Formula Examples' : 'Show Dice Formula Examples'}
      </button>

      {debuffConfig.statPenalties && debuffConfig.statPenalties.length > 0 && (
        <div className="pf-config-group">
          <h4 className="pf-config-title">Selected Stat Penalties</h4>
          <div className="pf-selected-stats-list">
            {debuffConfig.statPenalties.map(stat => (
              <div className="pf-selected-stat" key={stat.id}>
                <div className="pf-stat-icon">
                  <img src={getIconUrl(stat.icon)} alt={stat.name} />
                </div>
                <div className="pf-stat-info">
                  <div className="pf-stat-name">{stat.name}</div>
                  <div className="pf-stat-description">{stat.description}</div>
                </div>
                <div className="pf-stat-controls">
                  {/* Special handling for resistance stats */}
                  {stat.category === 'resistance' ? (
                    <select
                      className={`pf-resistance-select ${getResistanceLevelClass(stat.resistanceLevel || stat.magnitude)}`}
                      value={stat.resistanceLevel || stat.magnitude || 'none'}
                      onChange={(e) => {
                        const selectedOption = getResistanceScalingOptions(stat.resistanceType).find(opt => opt.value.toString() === e.target.value);
                        if (selectedOption) {
                          updateStatPenaltyValue(stat.id, selectedOption.value);
                          // Store the resistance level for styling
                          updateStatPenalty(stat.id, {
                            ...stat,
                            resistanceLevel: selectedOption.label.toLowerCase().replace(/\s+/g, '-'),
                            magnitude: selectedOption.value,
                            magnitudeType: stat.resistanceType === 'absorption' ? 'flat' : 'percentage'
                          });
                        }
                      }}
                    >
                      <option value="none">Select Resistance Level</option>
                      {getResistanceScalingOptions(stat.resistanceType).map(option => (
                        <option
                          key={option.value}
                          value={option.value}
                          style={{ color: option.color }}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <>
                      <input
                        type="text"
                        className={`pf-stat-input ${typeof stat.magnitude === 'string' ? 'formula' : (stat.magnitude >= 0 ? 'positive' : 'negative')}`}
                        defaultValue={typeof stat.magnitude === 'string' ? stat.magnitude : (stat.magnitudeType === 'percentage' ?
                          `${stat.magnitude >= 0 ? '+' : ''}${stat.magnitude}%` :
                          `${stat.magnitude >= 0 ? '+' : ''}${stat.magnitude}`)}
                        onBlur={(e) => {
                          let value = e.target.value;

                          // Handle empty field
                          if (value === '') {
                            updateStatPenaltyValue(stat.id, 0);
                            return;
                          }

                          // Remove the % sign and + sign for processing
                          if (stat.magnitudeType === 'percentage') {
                            value = value.replace(/%/g, '');
                          }
                          value = value.replace(/^\+/, '');

                          // Check if it's a valid number
                          const isNumber = !isNaN(parseFloat(value)) && isFinite(value);

                          // Check if it's a dice formula
                          const diceRegex = /^-?d\d+|^-?\d+d\d+|^-?\d+d\d+k\d+|^-?\d+d\d+k\d+l/;
                          const isDiceFormula = diceRegex.test(value);

                          if (isNumber) {
                            updateStatPenaltyValue(stat.id, parseFloat(value));
                          } else if (isDiceFormula) {
                            // If it starts with 'd', add '1' prefix
                            if (value.startsWith('d')) {
                              value = '1' + value;
                            } else if (value.startsWith('-d')) {
                              value = '-1' + value.substring(1);
                            }
                            updateStatPenaltyValue(stat.id, value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.target.blur();
                          }
                        }}
                        placeholder="Enter value or formula"
                        title="Examples: -5, 2d6, d20, -d4, -1d8+2"
                      />
                      <div className="pf-stat-type-toggle">
                        <button
                          className={`pf-toggle-btn ${stat.magnitudeType === 'flat' ? 'pf-toggle-active' : ''}`}
                          onClick={() => updateStatPenaltyType(stat.id, 'flat')}
                        >
                          Flat
                        </button>
                        <button
                          className={`pf-toggle-btn ${stat.magnitudeType === 'percentage' ? 'pf-toggle-active' : ''}`}
                          onClick={() => updateStatPenaltyType(stat.id, 'percentage')}
                        >
                          %
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <button
                  className="pf-remove-btn"
                  onClick={() => removeStatPenalty(stat.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pf-config-group">
        <h4 className="pf-config-title">Choose Stats to Penalize</h4>

        <div className="pf-tab-group">
          <button
            className={`pf-tab ${selectedStatCategory === 'primary' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatCategory('primary')}
          >
            Primary Stats
          </button>
          <button
            className={`pf-tab ${selectedStatCategory === 'secondary' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatCategory('secondary')}
          >
            Secondary Stats
          </button>
          <button
            className={`pf-tab ${selectedStatCategory === 'combat' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatCategory('combat')}
          >
            Combat Stats
          </button>
          <button
            className={`pf-tab ${selectedStatCategory === 'damage' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatCategory('damage')}
          >
            Damage Types
          </button>
          <button
            className={`pf-tab ${selectedStatCategory === 'resistance' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatCategory('resistance')}
          >
            Resistances
          </button>
          <button
            className={`pf-tab ${selectedStatCategory === 'utility' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatCategory('utility')}
          >
            Utility
          </button>
        </div>

        <div className="pf-stat-grid">
          {getStatModifiersByCategory(selectedStatCategory).map(stat => {
            const isSelected = debuffConfig.statPenalties?.some(penalty => penalty.id === stat.id);
            const selectedStat = isSelected ? debuffConfig.statPenalties.find(penalty => penalty.id === stat.id) : null;

            return (
              <div
                key={stat.id}
                className={`pf-stat-card ${isSelected ? 'pf-stat-selected' : ''}`}
                onClick={() => {
                  if (isSelected) {
                    removeStatPenalty(stat.id);
                  } else {
                    addStatPenalty(stat);
                  }
                }}
                onMouseEnter={(e) => handleMouseEnter(stat, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={getIconUrl(stat.icon)}
                  alt={stat.name}
                  className="pf-stat-card-icon"
                />
                <div className="pf-stat-card-name">{stat.name}</div>
                {renderStatIndicator(stat)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pf-config-group">
        <h4 className="pf-config-title">Status Effects</h4>

        <div className="pf-tab-group">
          <button
            className={`pf-tab ${selectedStatusCategory === 'all' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatusCategory('all')}
          >
            All Effects
          </button>
          <button
            className={`pf-tab ${selectedStatusCategory === 'combat' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatusCategory('combat')}
          >
            Combat
          </button>
          <button
            className={`pf-tab ${selectedStatusCategory === 'skills' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatusCategory('skills')}
          >
            Skills
          </button>
          <button
            className={`pf-tab ${selectedStatusCategory === 'control' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatusCategory('control')}
          >
            Control
          </button>
          <button
            className={`pf-tab ${selectedStatusCategory === 'damage' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatusCategory('damage')}
          >
            Damage
          </button>
          <button
            className={`pf-tab ${selectedStatusCategory === 'disruption' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatusCategory('disruption')}
          >
            Disruption
          </button>
          <button
            className={`pf-tab ${selectedStatusCategory === 'ailment' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatusCategory('ailment')}
          >
            Ailment
          </button>
          <button
            className={`pf-tab ${selectedStatusCategory === 'curse' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatusCategory('curse')}
          >
            Curse
          </button>
          <button
            className={`pf-tab ${selectedStatusCategory === 'debilitation' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatusCategory('debilitation')}
          >
            Debilitation
          </button>
          <button
            className={`pf-tab ${selectedStatusCategory === 'vampiric' ? 'pf-tab-active' : ''}`}
            onClick={() => setSelectedStatusCategory('vampiric')}
          >
            Lifelink
          </button>
        </div>

        <div className="pf-status-grid">
          {getStatusEffectsByCategory(selectedStatusCategory).map(effect => {
            const isSelected = debuffConfig.statusEffects?.some(e => e.id === effect.id);
            const selectedEffect = isSelected ? debuffConfig.statusEffects.find(e => e.id === effect.id) : null;

            return (
              <div
                key={effect.id}
                className={`pf-status-card ${isSelected ? 'pf-status-selected' : ''}`}
                onClick={() => {
                  if (isSelected) {
                    // If already selected, open the configuration popup
                    const selectedEffect = debuffConfig.statusEffects.find(e => e.id === effect.id);
                    openStatusEffectConfig({
                      ...effect,
                      ...selectedEffect
                    });
                  } else {
                    // If not selected, add it first
                    addStatusEffect(effect);
                    // Then open the configuration popup
                    const newEffect = {
                      ...effect,
                      level: 'medium',
                      option: effect.options && effect.options.length > 0 ? effect.options[0].id : null
                    };
                    openStatusEffectConfig(newEffect);
                  }
                }}
                onMouseEnter={(e) => handleMouseEnter(effect, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <div className="pf-status-icon">
                  <img src={getIconUrl(effect.icon)} alt={effect.name} />
                </div>
                <div className="pf-status-name">{effect.name}</div>
                <div className="pf-status-description">{effect.description}</div>

                {isSelected && (
                  <button
                    className="pf-status-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStatusEffect(effect.id);
                    }}
                    title="Remove effect"
                  >
                    ×
                  </button>
                )}




              </div>
            );
          })}
        </div>
      </div>


      {/* Status Effect Configuration Popup */}
      <CleanStatusEffectConfigPopup
        isOpen={configPopupOpen}
        onClose={() => setConfigPopupOpen(false)}
        effect={selectedStatusEffect}
        selectedEffect={debuffConfig}
        updateConfig={updateDebuffConfig}
        configType="debuff"
      />

      {/* Tooltip Rendering */}
      {showTooltip && tooltipContent && (() => {
        const tooltipRoot = document.getElementById('tooltip-root') || document.body;
        return ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              left: mousePos.x,
              top: mousePos.y,
              zIndex: 15002, /* Standardized to ensure tooltips appear above modals */
              pointerEvents: 'none'
            }}
          >
            {tooltipContent.content}
          </div>,
          tooltipRoot
        );
      })()}
    </div>
  );
};

export default DebuffEffects;