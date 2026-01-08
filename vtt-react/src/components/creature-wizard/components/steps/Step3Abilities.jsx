import React, { useState, Suspense, lazy } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import '../../styles/WizardSteps.css';
import './Step3Abilities.css';
import { SpellLibraryProvider } from '../../../../components/spellcrafting-wizard/context/SpellLibraryContext';
import AbilitySelectionWindow from '../windows/AbilitySelectionWindow';
import BasicAbilityCreator from '../windows/BasicAbilityCreator';
import UnifiedSpellCard from '../../../spellcrafting-wizard/components/common/UnifiedSpellCard';
// Import Pathfinder styles for spell cards
import '../../../spellcrafting-wizard/styles/pathfinder/main.css';
import '../windows/BasicAbilityCreator.css';

// Ability types
const ABILITY_TYPES = {
  MELEE: 'melee',
  RANGED: 'ranged',
  SPELL: 'spell',
  SPECIAL: 'special'
};

// Default ability
const DEFAULT_ABILITY = {
  name: '',
  type: ABILITY_TYPES.MELEE,
  description: '',
  damage: {
    diceCount: 1,
    diceType: 6,
    bonus: 0,
    damageType: 'physical'
  },
  range: 5,
  actionPointCost: 1,
  cooldown: 0,
  effects: [],
  priorityRange: { 
    min: 1, 
    max: 20,
    resolution: 'DICE', // 'DICE', 'CARDS', 'COINS'
    cardCount: 1, // Number of cards to draw (for CARDS resolution)
    cardPattern: 'any', // Card pattern: 'any', 'hearts', 'diamonds', 'clubs', 'spades', 'red', 'black', 'face', 'ace', 'ace_of_hearts', etc.
    coinCount: 1, // Number of coins to flip (for COINS resolution)
    coinPattern: 'any' // Coin pattern: 'any', 'heads', 'tails', 'all_heads', 'all_tails', 'majority_heads', 'majority_tails'
  }, // Default to full range
  triggerCondition: null // { type: 'hp_percentage' | 'enemy_count' | null, operator: 'below' | 'above' | 'equal' | 'at_least' | 'at_most', value: number }
};

const Step3Abilities = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();

  const [editingAbilityIndex, setEditingAbilityIndex] = useState(null);
  const [currentAbility, setCurrentAbility] = useState({ ...DEFAULT_ABILITY });
  const [showAbilityForm, setShowAbilityForm] = useState(false);
  const [showAbilitySelector, setShowAbilitySelector] = useState(false);
  const [showBasicAbilityCreator, setShowBasicAbilityCreator] = useState(false);
  const [recentlyAddedSpells, setRecentlyAddedSpells] = useState(new Set());

  // This function has been removed as we no longer support custom abilities

  // Handle editing an existing ability
  const handleEditAbility = (index) => {
    setEditingAbilityIndex(index);
    setCurrentAbility({ ...wizardState.abilities[index] });
    setShowAbilityForm(true);
  };

  // Handle removing an ability
  const handleRemoveAbility = (index) => {
    if (window.confirm('Are you sure you want to remove this ability?')) {
      dispatch(wizardActionCreators.removeAbility(index));
    }
  };

  // Handle saving the current ability
  const handleSaveAbility = () => {
    if (editingAbilityIndex !== null) {
      // Update existing ability
      dispatch(wizardActionCreators.updateAbility(editingAbilityIndex, currentAbility));
    } else {
      // Add new ability
      dispatch(wizardActionCreators.addAbility(currentAbility));
    }

    // Reset form
    setShowAbilityForm(false);
    setEditingAbilityIndex(null);
    setCurrentAbility({ ...DEFAULT_ABILITY });
  };

  // Handle canceling the ability form
  const handleCancelAbilityForm = () => {
    setShowAbilityForm(false);
    setEditingAbilityIndex(null);
    setCurrentAbility({ ...DEFAULT_ABILITY });
  };

  // Handle ability form field changes
  const handleAbilityChange = (field, value) => {
    setCurrentAbility({
      ...currentAbility,
      [field]: value
    });
  };

  // Handle damage field changes
  const handleDamageChange = (field, value) => {
    // Convert numeric values
    let processedValue = value;
    if (['diceCount', 'diceType', 'bonus'].includes(field)) {
      processedValue = parseInt(value, 10) || 0;
    }

    setCurrentAbility({
      ...currentAbility,
      damage: {
        ...currentAbility.damage,
        [field]: processedValue
      }
    });
  };

  // Format ability type for display
  const formatAbilityType = (type) => {
    if (!type) return 'Unknown'; // Handle undefined or null values
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format damage type for display
  const formatDamageType = (type) => {
    if (!type) return 'Physical'; // Handle undefined or null values

    const typeMap = {
      'physical': 'Physical',
      'fire': 'Fire',
      'frost': 'Frost',
      'arcane': 'Arcane',
      'nature': 'Nature',
      'shadow': 'Shadow',
      'holy': 'Holy',
      'poison': 'Poison'
    };
    return typeMap[type] || type;
  };

  // Handle updating ability priority range
  const handleUpdateAbilityPriority = (index, priorityRange) => {
    const updatedAbility = {
      ...wizardState.abilities[index],
      priorityRange: priorityRange
    };
    dispatch(wizardActionCreators.updateAbility(index, updatedAbility));
  };

  // Handle updating ability trigger condition
  const handleUpdateAbilityTriggerCondition = (index, triggerCondition) => {
    const updatedAbility = {
      ...wizardState.abilities[index],
      triggerCondition: triggerCondition
    };
    dispatch(wizardActionCreators.updateAbility(index, updatedAbility));
  };

  // Render the ability list
  const renderAbilityList = () => {
    if (wizardState.abilities.length === 0) {
      return (
        <div className="no-abilities-message">
          <div className="no-abilities-icon"><i className="fas fa-book-open"></i></div>
          <p className="no-abilities-text">No abilities added yet. Click "Add From Spell Library" to add spells and abilities.</p>
        </div>
      );
    }

    return (
      <div className="ability-list">
        {wizardState.abilities.map((ability, index) => {
          // Convert ability to spell format for UnifiedSpellCard
          // UnifiedSpellCard normalizes the data, so we just need to pass it as a spell
          const spellData = {
            ...ability,
            // Ensure id exists for UnifiedSpellCard
            id: ability.id || ability.spellId || `ability-${index}`,
            // Ensure name exists
            name: ability.name || 'Unnamed Ability',
            // Ensure triggerCondition is passed through
            triggerCondition: ability.triggerCondition || null
          };

          // Get priority range or default to full range
          const priorityRange = ability.priorityRange || { min: 1, max: 20, resolution: 'DICE', cardCount: 1, cardPattern: 'any', coinCount: 1, coinPattern: 'any' };

          return (
            <div key={index} className="ability-card-wrapper">
              <UnifiedSpellCard
                spell={spellData}
                variant="library"
                showActions={true}
                showDescription={true}
                showStats={true}
                showTags={true}
                onDelete={() => handleRemoveAbility(index)}
                className="creature-ability-card"
              />
              {/* Priority Range Editor */}
              <div className="ability-priority-editor">
                <div className="priority-header">
                  <label className="priority-label">
                    <i className="fas fa-dice-d20"></i> Priority Range:
                  </label>
                  <label className="priority-toggle">
                    <input
                      type="checkbox"
                      checked={ability.priorityRange !== null && ability.priorityRange !== undefined}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleUpdateAbilityPriority(index, { min: 1, max: 20, resolution: 'DICE', cardCount: 1, cardPattern: 'any', coinCount: 1, coinPattern: 'any' });
                        } else {
                          handleUpdateAbilityPriority(index, null);
                        }
                      }}
                    />
                    <span>Enable</span>
                  </label>
                </div>
                {ability.priorityRange !== null && ability.priorityRange !== undefined && (
                <div className="priority-resolution-selector">
                  <label>Resolution:</label>
                  <select
                    value={priorityRange.resolution || 'DICE'}
                    onChange={(e) => {
                      handleUpdateAbilityPriority(index, {
                        ...priorityRange,
                        resolution: e.target.value,
                        // Set defaults for new resolution types
                        ...(e.target.value === 'CARDS' && !priorityRange.cardCount && { cardCount: 1 }),
                        ...(e.target.value === 'COINS' && !priorityRange.coinCount && { coinCount: 1 })
                      });
                    }}
                    className="priority-resolution-select"
                  >
                    <option value="DICE">Dice (1-20)</option>
                    <option value="CARDS">Cards</option>
                    <option value="COINS">Coins</option>
                  </select>
                </div>
                )}
                {ability.priorityRange !== null && ability.priorityRange !== undefined && priorityRange.resolution === 'DICE' && (
                  <>
                    <div className="priority-range-inputs">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={priorityRange.min}
                        onChange={(e) => {
                          const newMin = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                          handleUpdateAbilityPriority(index, {
                            ...priorityRange,
                            min: newMin,
                            max: Math.max(newMin, priorityRange.max)
                          });
                        }}
                        className="priority-input"
                      />
                      <span className="priority-separator">-</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={priorityRange.max}
                        onChange={(e) => {
                          const newMax = Math.max(1, Math.min(20, parseInt(e.target.value) || 20));
                          handleUpdateAbilityPriority(index, {
                            ...priorityRange,
                            max: newMax,
                            min: Math.min(newMax, priorityRange.min)
                          });
                        }}
                        className="priority-input"
                      />
                    </div>
                    <div className="priority-range-display">
                      <span className="priority-hint">Roll {priorityRange.min}-{priorityRange.max} to use this ability</span>
                    </div>
                  </>
                )}
                {ability.priorityRange !== null && ability.priorityRange !== undefined && priorityRange.resolution === 'CARDS' && (
                  <>
                    <div className="priority-range-inputs">
                      <label className="priority-count-label">Number of Cards:</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={priorityRange.cardCount || 1}
                        onChange={(e) => {
                          const cardCount = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                          handleUpdateAbilityPriority(index, {
                            ...priorityRange,
                            cardCount
                          });
                        }}
                        className="priority-input"
                      />
                    </div>
                    <div className="priority-pattern-selector">
                      <label className="priority-count-label">Card Pattern:</label>
                      <select
                        value={priorityRange.cardPattern || 'any'}
                        onChange={(e) => {
                          handleUpdateAbilityPriority(index, {
                            ...priorityRange,
                            cardPattern: e.target.value
                          });
                        }}
                        className="priority-resolution-select"
                      >
                        <option value="any">Any Card</option>
                        <optgroup label="Suits">
                          <option value="hearts">Hearts (♥)</option>
                          <option value="diamonds">Diamonds (♦)</option>
                          <option value="clubs">Clubs (♣)</option>
                          <option value="spades">Spades (♠)</option>
                        </optgroup>
                        <optgroup label="Colors">
                          <option value="red">Red Cards (♥♦)</option>
                          <option value="black">Black Cards (♣♠)</option>
                        </optgroup>
                        <optgroup label="Types">
                          <option value="face">Face Cards (J, Q, K)</option>
                          <option value="ace">Aces</option>
                        </optgroup>
                        <optgroup label="Specific Cards">
                          <option value="ace_of_hearts">Ace of Hearts</option>
                          <option value="ace_of_diamonds">Ace of Diamonds</option>
                          <option value="ace_of_clubs">Ace of Clubs</option>
                          <option value="ace_of_spades">Ace of Spades</option>
                        </optgroup>
                      </select>
                    </div>
                    <div className="priority-range-display">
                      <span className="priority-hint">
                        {priorityRange.cardPattern === 'any' 
                          ? `Draw ${priorityRange.cardCount || 1} card${priorityRange.cardCount !== 1 ? 's' : ''} to determine if this ability is used`
                          : `Draw ${priorityRange.cardCount || 1} card${priorityRange.cardCount !== 1 ? 's' : ''} - ${priorityRange.cardPattern === 'hearts' ? 'Hearts (♥)' :
                              priorityRange.cardPattern === 'diamonds' ? 'Diamonds (♦)' :
                              priorityRange.cardPattern === 'clubs' ? 'Clubs (♣)' :
                              priorityRange.cardPattern === 'spades' ? 'Spades (♠)' :
                              priorityRange.cardPattern === 'red' ? 'Red Cards' :
                              priorityRange.cardPattern === 'black' ? 'Black Cards' :
                              priorityRange.cardPattern === 'face' ? 'Face Cards' :
                              priorityRange.cardPattern === 'ace' ? 'Aces' :
                              priorityRange.cardPattern === 'ace_of_hearts' ? 'Ace of Hearts' :
                              priorityRange.cardPattern === 'ace_of_diamonds' ? 'Ace of Diamonds' :
                              priorityRange.cardPattern === 'ace_of_clubs' ? 'Ace of Clubs' :
                              priorityRange.cardPattern === 'ace_of_spades' ? 'Ace of Spades' :
                              priorityRange.cardPattern} to determine if this ability is used`}
                      </span>
                    </div>
                  </>
                )}
                {ability.priorityRange !== null && ability.priorityRange !== undefined && priorityRange.resolution === 'COINS' && (
                  <>
                    <div className="priority-range-inputs">
                      <label className="priority-count-label">Number of Coins:</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={priorityRange.coinCount || 1}
                        onChange={(e) => {
                          const coinCount = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                          handleUpdateAbilityPriority(index, {
                            ...priorityRange,
                            coinCount
                          });
                        }}
                        className="priority-input"
                      />
                    </div>
                    <div className="priority-pattern-selector">
                      <label className="priority-count-label">Coin Pattern:</label>
                      <select
                        value={priorityRange.coinPattern || 'any'}
                        onChange={(e) => {
                          handleUpdateAbilityPriority(index, {
                            ...priorityRange,
                            coinPattern: e.target.value
                          });
                        }}
                        className="priority-resolution-select"
                      >
                        <option value="any">Any Result</option>
                        <option value="heads">Heads</option>
                        <option value="tails">Tails</option>
                        <option value="all_heads">All Heads</option>
                        <option value="all_tails">All Tails</option>
                        <option value="majority_heads">Majority Heads</option>
                        <option value="majority_tails">Majority Tails</option>
                      </select>
                    </div>
                    <div className="priority-range-display">
                      <span className="priority-hint">
                        {priorityRange.coinPattern === 'any'
                          ? `Flip ${priorityRange.coinCount || 1} coin${priorityRange.coinCount !== 1 ? 's' : ''} to determine if this ability is used`
                          : `Flip ${priorityRange.coinCount || 1} coin${priorityRange.coinCount !== 1 ? 's' : ''} - ${priorityRange.coinPattern === 'heads' ? 'Heads' :
                              priorityRange.coinPattern === 'tails' ? 'Tails' :
                              priorityRange.coinPattern === 'all_heads' ? 'All Heads' :
                              priorityRange.coinPattern === 'all_tails' ? 'All Tails' :
                              priorityRange.coinPattern === 'majority_heads' ? 'Majority Heads' :
                              priorityRange.coinPattern === 'majority_tails' ? 'Majority Tails' :
                              priorityRange.coinPattern} to determine if this ability is used`}
                      </span>
                    </div>
                  </>
                )}
              </div>
              {/* Trigger Condition Editor */}
              <div className="ability-trigger-editor">
                <div className="trigger-header">
                  <label className="trigger-label">
                    <i className="fas fa-bolt"></i> Trigger Condition:
                  </label>
                  <label className="trigger-toggle">
                    <input
                      type="checkbox"
                      checked={ability.triggerCondition !== null && ability.triggerCondition !== undefined}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleUpdateAbilityTriggerCondition(index, {
                            type: 'hp_percentage',
                            operator: 'below',
                            value: 50
                          });
                        } else {
                          handleUpdateAbilityTriggerCondition(index, null);
                        }
                      }}
                    />
                    <span>Enable</span>
                  </label>
                </div>
                {ability.triggerCondition !== null && ability.triggerCondition !== undefined && (
                  <>
                <div className="trigger-type-selector">
                  <label>Condition Type:</label>
                  <select
                    value={ability.triggerCondition.type || 'hp_percentage'}
                    onChange={(e) => {
                      const newType = e.target.value;
                      // Set appropriate defaults based on type
                      let defaultOperator = 'below';
                      let defaultValue = 50;
                      
                      if (newType === 'enemy_count' || newType === 'ally_count') {
                        defaultOperator = 'at_least';
                        defaultValue = 1;
                      } else if (newType === 'round_number' || newType === 'turn_number') {
                        defaultOperator = 'at_least';
                        defaultValue = 1;
                      } else if (newType === 'hp_percentage_target') {
                        defaultOperator = 'below';
                        defaultValue = 50;
                      } else if (newType === 'distance') {
                        defaultOperator = 'at_most';
                        defaultValue = 30;
                      } else if (newType === 'enemies_low_hp') {
                        defaultOperator = 'at_least';
                        defaultValue = 1;
                      }
                      
                      handleUpdateAbilityTriggerCondition(index, {
                        type: newType,
                        operator: defaultOperator,
                        value: defaultValue,
                        // Clear type-specific fields when changing types
                        statusEffect: undefined,
                        resourceType: undefined
                      });
                    }}
                    className="trigger-type-select"
                  >
                    <optgroup label="Health & Status">
                      <option value="hp_percentage">Self HP Percentage</option>
                      <option value="hp_percentage_target">Target HP Percentage</option>
                      <option value="status_effect_self">Has Status Effect (Self)</option>
                      <option value="status_effect_enemy">Enemy Has Status Effect</option>
                      <option value="enemies_low_hp">Enemies with Low HP</option>
                    </optgroup>
                    <optgroup label="Combat Position">
                      <option value="enemy_count">Enemy Count Nearby</option>
                      <option value="ally_count">Ally Count Nearby</option>
                      <option value="distance">Distance from Target</option>
                      <option value="surrounded">Surrounded by Enemies</option>
                    </optgroup>
                    <optgroup label="Combat Timing">
                      <option value="round_number">Round Number</option>
                      <option value="turn_number">Turn Number</option>
                      <option value="phase">Combat Phase</option>
                      <option value="first_turn">First Turn of Combat</option>
                    </optgroup>
                    <optgroup label="Resources">
                      <option value="resource_level">Resource Level (Mana/Stamina)</option>
                      <option value="action_points">Action Points Available</option>
                    </optgroup>
                    <optgroup label="Strategic">
                      <option value="cooldown_ready">Cooldown Ready</option>
                      <option value="ability_used">Specific Ability Used</option>
                      <option value="damage_taken">Damage Taken This Turn</option>
                    </optgroup>
                  </select>
                </div>
                {/* HP Percentage Conditions */}
                {(ability.triggerCondition?.type === 'hp_percentage' || ability.triggerCondition?.type === 'hp_percentage_target') && (
                  <>
                    <div className="trigger-operator-selector">
                      <label>Condition:</label>
                      <select
                        value={ability.triggerCondition.operator || 'below'}
                        onChange={(e) => {
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            operator: e.target.value
                          });
                        }}
                        className="trigger-operator-select"
                      >
                        <option value="below">Below</option>
                        <option value="above">Above</option>
                        <option value="equal">Equal To</option>
                      </select>
                    </div>
                    <div className="trigger-value-input">
                      <label>HP %:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ability.triggerCondition.value || 50}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            value
                          });
                        }}
                        className="trigger-input"
                      />
                    </div>
                    <div className="trigger-display">
                      <div className="trigger-hint">
                        Use when {ability.triggerCondition.type === 'hp_percentage_target' ? 'target' : 'self'} HP is {ability.triggerCondition.operator === 'below' ? 'below' : 
                                        ability.triggerCondition.operator === 'above' ? 'above' : 
                                        'equal to'} {ability.triggerCondition.value}%
                      </div>
                    </div>
                  </>
                )}
                {/* Count-based Conditions */}
                {(ability.triggerCondition?.type === 'enemy_count' || ability.triggerCondition?.type === 'ally_count' || ability.triggerCondition?.type === 'enemies_low_hp') && (
                  <>
                    <div className="trigger-operator-selector">
                      <label>Condition:</label>
                      <select
                        value={ability.triggerCondition.operator || 'at_least'}
                        onChange={(e) => {
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            operator: e.target.value
                          });
                        }}
                        className="trigger-operator-select"
                      >
                        <option value="at_least">At Least</option>
                        <option value="at_most">At Most</option>
                        <option value="equal">Exactly</option>
                      </select>
                    </div>
                    <div className="trigger-value-input">
                      <label>{ability.triggerCondition.type === 'enemies_low_hp' ? 'Enemies with Low HP:' : ability.triggerCondition.type === 'ally_count' ? 'Ally Count:' : 'Enemy Count:'}</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={ability.triggerCondition.value || 1}
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            value
                          });
                        }}
                        className="trigger-input"
                      />
                    </div>
                    {ability.triggerCondition.type === 'enemies_low_hp' && (
                      <div className="trigger-value-input">
                        <label>Low HP Threshold %:</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={ability.triggerCondition.threshold || 25}
                          onChange={(e) => {
                            const threshold = Math.max(0, Math.min(100, parseInt(e.target.value) || 25));
                            handleUpdateAbilityTriggerCondition(index, {
                              ...ability.triggerCondition,
                              threshold
                            });
                          }}
                          className="trigger-input"
                        />
                      </div>
                    )}
                    <div className="trigger-display">
                      <div className="trigger-hint">
                        {ability.triggerCondition.type === 'enemies_low_hp' 
                          ? `Use when ${ability.triggerCondition.operator === 'at_least' ? 'at least' : ability.triggerCondition.operator === 'at_most' ? 'at most' : 'exactly'} ${ability.triggerCondition.value} enemy${ability.triggerCondition.value !== 1 ? 'ies' : ''} below ${ability.triggerCondition.threshold || 25}% HP`
                          : ability.triggerCondition.type === 'ally_count'
                          ? `Use when ${ability.triggerCondition.operator === 'at_least' ? 'at least' : ability.triggerCondition.operator === 'at_most' ? 'at most' : 'exactly'} ${ability.triggerCondition.value} ally${ability.triggerCondition.value !== 1 ? 'ies' : ''} nearby`
                          : `Use when ${ability.triggerCondition.operator === 'at_least' ? 'at least' : ability.triggerCondition.operator === 'at_most' ? 'at most' : 'exactly'} ${ability.triggerCondition.value} enemy${ability.triggerCondition.value !== 1 ? 'ies' : ''} nearby`}
                      </div>
                    </div>
                  </>
                )}
                {/* Round/Turn Number Conditions */}
                {(ability.triggerCondition?.type === 'round_number' || ability.triggerCondition?.type === 'turn_number') && (
                  <>
                    <div className="trigger-operator-selector">
                      <label>Condition:</label>
                      <select
                        value={ability.triggerCondition.operator || 'at_least'}
                        onChange={(e) => {
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            operator: e.target.value
                          });
                        }}
                        className="trigger-operator-select"
                      >
                        <option value="at_least">At Least</option>
                        <option value="at_most">At Most</option>
                        <option value="equal">Exactly</option>
                      </select>
                    </div>
                    <div className="trigger-value-input">
                      <label>{ability.triggerCondition.type === 'round_number' ? 'Round Number:' : 'Turn Number:'}</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={ability.triggerCondition.value || 1}
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(50, parseInt(e.target.value) || 1));
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            value
                          });
                        }}
                        className="trigger-input"
                      />
                    </div>
                    <div className="trigger-display">
                      <div className="trigger-hint">
                        Use on {ability.triggerCondition.type === 'round_number' ? 'round' : 'turn'} {ability.triggerCondition.operator === 'at_least' ? `${ability.triggerCondition.value} or later` : 
                                        ability.triggerCondition.operator === 'at_most' ? `${ability.triggerCondition.value} or earlier` : 
                                        ability.triggerCondition.value}
                      </div>
                    </div>
                  </>
                )}
                {/* Distance Condition */}
                {ability.triggerCondition?.type === 'distance' && (
                  <>
                    <div className="trigger-operator-selector">
                      <label>Condition:</label>
                      <select
                        value={ability.triggerCondition.operator || 'at_most'}
                        onChange={(e) => {
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            operator: e.target.value
                          });
                        }}
                        className="trigger-operator-select"
                      >
                        <option value="at_most">Within</option>
                        <option value="at_least">Beyond</option>
                        <option value="equal">Exactly</option>
                      </select>
                    </div>
                    <div className="trigger-value-input">
                      <label>Distance (ft):</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={ability.triggerCondition.value || 30}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(200, parseInt(e.target.value) || 30));
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            value
                          });
                        }}
                        className="trigger-input"
                      />
                    </div>
                    <div className="trigger-display">
                      <div className="trigger-hint">
                        Use when target is {ability.triggerCondition.operator === 'at_most' ? 'within' : 
                                          ability.triggerCondition.operator === 'at_least' ? 'beyond' : 
                                          'exactly'} {ability.triggerCondition.value} feet
                      </div>
                    </div>
                  </>
                )}
                {/* Status Effect Conditions */}
                {(ability.triggerCondition?.type === 'status_effect_self' || ability.triggerCondition?.type === 'status_effect_enemy') && (
                  <>
                    <div className="trigger-value-input">
                      <label>Status Effect Name:</label>
                      <input
                        type="text"
                        value={ability.triggerCondition.statusEffect || ''}
                        onChange={(e) => {
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            statusEffect: e.target.value
                          });
                        }}
                        className="trigger-input trigger-text-input"
                        placeholder="e.g., Stunned, Poisoned, Burning"
                      />
                    </div>
                    <div className="trigger-display">
                      <div className="trigger-hint">
                        Use when {ability.triggerCondition.type === 'status_effect_self' ? 'self' : 'enemy'} has status effect: {ability.triggerCondition.statusEffect || '(not set)'}
                      </div>
                    </div>
                  </>
                )}
                {/* Resource Level Condition */}
                {ability.triggerCondition?.type === 'resource_level' && (
                  <>
                    <div className="trigger-value-input">
                      <label>Resource Type:</label>
                      <select
                        value={ability.triggerCondition.resourceType || 'mana'}
                        onChange={(e) => {
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            resourceType: e.target.value
                          });
                        }}
                        className="trigger-type-select"
                      >
                        <option value="mana">Mana</option>
                        <option value="stamina">Stamina</option>
                        <option value="energy">Energy</option>
                        <option value="rage">Rage</option>
                        <option value="focus">Focus</option>
                      </select>
                    </div>
                    <div className="trigger-operator-selector">
                      <label>Condition:</label>
                      <select
                        value={ability.triggerCondition.operator || 'below'}
                        onChange={(e) => {
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            operator: e.target.value
                          });
                        }}
                        className="trigger-operator-select"
                      >
                        <option value="below">Below</option>
                        <option value="above">Above</option>
                        <option value="equal">Equal To</option>
                      </select>
                    </div>
                    <div className="trigger-value-input">
                      <label>Resource %:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ability.triggerCondition.value || 50}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            value
                          });
                        }}
                        className="trigger-input"
                      />
                    </div>
                    <div className="trigger-display">
                      <div className="trigger-hint">
                        Use when {ability.triggerCondition.resourceType || 'mana'} is {ability.triggerCondition.operator === 'below' ? 'below' : 
                                        ability.triggerCondition.operator === 'above' ? 'above' : 
                                        'equal to'} {ability.triggerCondition.value}%
                      </div>
                    </div>
                  </>
                )}
                {/* Action Points Condition */}
                {ability.triggerCondition?.type === 'action_points' && (
                  <>
                    <div className="trigger-operator-selector">
                      <label>Condition:</label>
                      <select
                        value={ability.triggerCondition.operator || 'at_least'}
                        onChange={(e) => {
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            operator: e.target.value
                          });
                        }}
                        className="trigger-operator-select"
                      >
                        <option value="at_least">At Least</option>
                        <option value="at_most">At Most</option>
                        <option value="equal">Exactly</option>
                      </select>
                    </div>
                    <div className="trigger-value-input">
                      <label>Action Points:</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={ability.triggerCondition.value || 1}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(10, parseInt(e.target.value) || 0));
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            value
                          });
                        }}
                        className="trigger-input"
                      />
                    </div>
                    <div className="trigger-display">
                      <div className="trigger-hint">
                        Use when {ability.triggerCondition.operator === 'at_least' ? 'at least' : 
                                  ability.triggerCondition.operator === 'at_most' ? 'at most' : 
                                  'exactly'} {ability.triggerCondition.value} action point{ability.triggerCondition.value !== 1 ? 's' : ''} available
                      </div>
                    </div>
                  </>
                )}
                {/* Simple Boolean Conditions */}
                {(ability.triggerCondition?.type === 'surrounded' || 
                  ability.triggerCondition?.type === 'first_turn' || 
                  ability.triggerCondition?.type === 'cooldown_ready' ||
                  ability.triggerCondition?.type === 'phase') && (
                  <>
                    {ability.triggerCondition.type === 'phase' && (
                      <div className="trigger-value-input">
                        <label>Combat Phase:</label>
                        <select
                          value={ability.triggerCondition.value || 'phase1'}
                          onChange={(e) => {
                            handleUpdateAbilityTriggerCondition(index, {
                              ...ability.triggerCondition,
                              value: e.target.value
                            });
                          }}
                          className="trigger-type-select"
                        >
                          <option value="phase1">Phase 1</option>
                          <option value="phase2">Phase 2</option>
                          <option value="phase3">Phase 3</option>
                          <option value="phase4">Phase 4</option>
                          <option value="final">Final Phase</option>
                        </select>
                      </div>
                    )}
                    <div className="trigger-display">
                      <div className="trigger-hint">
                        {ability.triggerCondition.type === 'surrounded' 
                          ? 'Use when surrounded by enemies'
                          : ability.triggerCondition.type === 'first_turn'
                          ? 'Use on the first turn of combat'
                          : ability.triggerCondition.type === 'cooldown_ready'
                          ? 'Use when cooldown is ready'
                          : `Use during ${ability.triggerCondition.value || 'Phase 1'}`}
                      </div>
                    </div>
                  </>
                )}
                {/* Damage Taken Condition */}
                {ability.triggerCondition?.type === 'damage_taken' && (
                  <>
                    <div className="trigger-operator-selector">
                      <label>Condition:</label>
                      <select
                        value={ability.triggerCondition.operator || 'at_least'}
                        onChange={(e) => {
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            operator: e.target.value
                          });
                        }}
                        className="trigger-operator-select"
                      >
                        <option value="at_least">At Least</option>
                        <option value="at_most">At Most</option>
                        <option value="equal">Exactly</option>
                      </select>
                    </div>
                    <div className="trigger-value-input">
                      <label>Damage Amount:</label>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={ability.triggerCondition.value || 10}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(1000, parseInt(e.target.value) || 0));
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            value
                          });
                        }}
                        className="trigger-input"
                      />
                    </div>
                    <div className="trigger-display">
                      <div className="trigger-hint">
                        Use when {ability.triggerCondition.operator === 'at_least' ? 'at least' : 
                                  ability.triggerCondition.operator === 'at_most' ? 'at most' : 
                                  'exactly'} {ability.triggerCondition.value} damage taken this turn
                      </div>
                    </div>
                  </>
                )}
                {/* Ability Used Condition */}
                {ability.triggerCondition?.type === 'ability_used' && (
                  <>
                    <div className="trigger-value-input">
                      <label>Ability Name:</label>
                      <input
                        type="text"
                        value={ability.triggerCondition.abilityName || ''}
                        onChange={(e) => {
                          handleUpdateAbilityTriggerCondition(index, {
                            ...ability.triggerCondition,
                            abilityName: e.target.value
                          });
                        }}
                        className="trigger-input trigger-text-input"
                        placeholder="e.g., Fireball, Charge"
                      />
                    </div>
                    <div className="trigger-display">
                      <div className="trigger-hint">
                        Use after ability "{ability.triggerCondition.abilityName || '(not set)'}" is used
                      </div>
                    </div>
                  </>
                )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render the ability form
  const renderAbilityForm = () => {
    return (
      <div className="ability-form">
        <h3>{editingAbilityIndex !== null ? 'Edit Ability' : 'Add New Ability'}</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ability-name">Name</label>
            <input
              id="ability-name"
              type="text"
              value={currentAbility.name}
              onChange={(e) => handleAbilityChange('name', e.target.value)}
              placeholder="Enter ability name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ability-type">Type</label>
            <select
              id="ability-type"
              value={currentAbility.type}
              onChange={(e) => handleAbilityChange('type', e.target.value)}
            >
              {Object.values(ABILITY_TYPES).map(type => (
                <option key={type} value={type}>
                  {formatAbilityType(type)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ability-description">Description</label>
            <textarea
              id="ability-description"
              value={currentAbility.description}
              onChange={(e) => handleAbilityChange('description', e.target.value)}
              placeholder="Enter ability description"
              rows={3}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Damage</label>
            <div className="damage-input-group">
              <input
                type="number"
                min="0"
                max="20"
                value={currentAbility.damage.diceCount}
                onChange={(e) => handleDamageChange('diceCount', e.target.value)}
                className="dice-count-input"
              />
              <span>d</span>
              <select
                value={currentAbility.damage.diceType}
                onChange={(e) => handleDamageChange('diceType', e.target.value)}
                className="dice-type-input"
              >
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="12">12</option>
                <option value="20">20</option>
              </select>
              <span>+</span>
              <input
                type="number"
                value={currentAbility.damage.bonus}
                onChange={(e) => handleDamageChange('bonus', e.target.value)}
                className="damage-bonus-input"
              />
              <select
                value={currentAbility.damage.damageType}
                onChange={(e) => handleDamageChange('damageType', e.target.value)}
                className="damage-type-input"
              >
                <option value="physical">Physical</option>
                <option value="fire">Fire</option>
                <option value="frost">Frost</option>
                <option value="arcane">Arcane</option>
                <option value="nature">Nature</option>
                <option value="shadow">Shadow</option>
                <option value="holy">Holy</option>
                <option value="poison">Poison</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ability-range">Range (ft)</label>
            <input
              id="ability-range"
              type="number"
              min="0"
              value={currentAbility.range}
              onChange={(e) => handleAbilityChange('range', parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ability-ap-cost">Action Point Cost</label>
            <input
              id="ability-ap-cost"
              type="number"
              min="0"
              max="10"
              value={currentAbility.actionPointCost}
              onChange={(e) => handleAbilityChange('actionPointCost', parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ability-cooldown">Cooldown (rounds)</label>
            <input
              id="ability-cooldown"
              type="number"
              min="0"
              value={currentAbility.cooldown}
              onChange={(e) => handleAbilityChange('cooldown', parseInt(e.target.value, 10) || 0)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancelAbilityForm}
          >
            Cancel
          </button>
          <button
            type="button"
            className="save-button"
            onClick={handleSaveAbility}
            disabled={!currentAbility.name}
          >
            {editingAbilityIndex !== null ? 'Update Ability' : 'Add Ability'}
          </button>
        </div>
      </div>
    );
  };

  // We're now using our custom AbilitySelectionWindow instead of the SpellLibrary component

  // Handle adding from spell library
  const handleAddFromLibrary = () => {
    setShowAbilitySelector(true);
  };

  // Handle creating a basic ability
  const handleCreateBasicAbility = (ability) => {
    console.log("Step3Abilities: handleCreateBasicAbility called with ability:", ability);
    // Ensure priorityRange and triggerCondition are set (defaults if not provided)
    const abilityWithPriority = {
      ...ability,
      priorityRange: ability.priorityRange || { min: 1, max: 20, resolution: 'DICE', cardCount: 1, cardPattern: 'any', coinCount: 1, coinPattern: 'any' },
      triggerCondition: ability.triggerCondition || null
    };
    dispatch(wizardActionCreators.addAbility(abilityWithPriority));
    setShowBasicAbilityCreator(false);
  };

  // Handle selecting a spell from the library
  const handleSelectSpell = (spell) => {
    console.log("Step3Abilities: handleSelectSpell called with spell:", spell);

    // Check if this spell is already added to avoid duplicates
    const existingAbility = wizardState.abilities.find(ability => ability.spellId === spell.id);
    if (existingAbility) {
      // Show feedback that spell is already added
      console.log("Spell already added:", spell.name);
      // You could add a toast notification here
      return;
    }

    // Convert spell to ability format
    const newAbility = {
      ...DEFAULT_ABILITY,
      name: spell.name,
      type: ABILITY_TYPES.SPELL,
      description: spell.description || '',
      damage: {
        diceCount: 0,
        diceType: 6,
        bonus: 0,
        damageType: 'physical'
      },
      range: spell.targetingConfig?.rangeDistance || spell.range || 0,
      actionPointCost: spell.castingConfig?.actionPointCost || spell.actionPointCost || 1,
      cooldown: spell.cooldown || 0,
      // Store the original spell ID for reference
      spellId: spell.id,
      // Store the original spell icon
      icon: spell.icon || spell.typeConfig?.icon || null,
      // Store the original spell data for reference
      originalSpell: spell,
      // Default priority range (1-20 means always available)
      priorityRange: { min: 1, max: 20, resolution: 'DICE', cardCount: 1, cardPattern: 'any', coinCount: 1, coinPattern: 'any' },
      // Default trigger condition (none)
      triggerCondition: null
    };

    // Process spell effects based on the spell format
    if (spell.effects && spell.effects.length > 0) {
      // Extract damage information from effects array
      const damageEffect = spell.effects.find(e => e.type === 'damage' || e.type === 'DAMAGE');
      if (damageEffect) {
        const diceMatch = damageEffect.formula?.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
        if (diceMatch) {
          newAbility.damage = {
            diceCount: parseInt(diceMatch[1], 10) || 1,
            diceType: parseInt(diceMatch[2], 10) || 6,
            bonus: parseInt(diceMatch[3], 10) || 0,
            damageType: damageEffect.damageType || 'physical'
          };
        }
      }

      // Store all effects
      newAbility.effects = spell.effects;
    } else if (spell.damageConfig) {
      // Extract damage information from damageConfig
      const formula = spell.damageConfig.formula || spell.damageConfig.damageFormula;
      if (formula) {
        const diceMatch = formula.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
        if (diceMatch) {
          newAbility.damage = {
            diceCount: parseInt(diceMatch[1], 10) || 1,
            diceType: parseInt(diceMatch[2], 10) || 6,
            bonus: parseInt(diceMatch[3], 10) || 0,
            damageType: spell.damageConfig.damageType ||
                       (spell.damageConfig.damageTypes && spell.damageConfig.damageTypes.length > 0 ?
                        spell.damageConfig.damageTypes[0] : 'physical')
          };
        }
      }

      // Create effects array from damageConfig
      newAbility.effects = [{
        type: 'DAMAGE',
        damageType: newAbility.damage.damageType,
        formula: `${newAbility.damage.diceCount}d${newAbility.damage.diceType}${newAbility.damage.bonus > 0 ? ` + ${newAbility.damage.bonus}` : ''}`
      }];
    } else if (spell.primaryDamage) {
      // Extract damage information from primaryDamage
      newAbility.damage = {
        diceCount: spell.primaryDamage.diceCount || 1,
        diceType: spell.primaryDamage.diceType || 6,
        bonus: spell.primaryDamage.flat || 0,
        damageType: spell.primaryDamage.damageType || 'physical'
      };

      // Create effects array from primaryDamage
      newAbility.effects = [{
        type: 'DAMAGE',
        damageType: newAbility.damage.damageType,
        formula: `${newAbility.damage.diceCount}d${newAbility.damage.diceType}${newAbility.damage.bonus > 0 ? ` + ${newAbility.damage.bonus}` : ''}`
      }];
    }

    // Add additional spell properties
    if (spell.spellType) {
      newAbility.spellType = spell.spellType;
    }

    if (spell.level) {
      newAbility.level = spell.level;
    }

    if (spell.castingConfig) {
      newAbility.castingConfig = spell.castingConfig;
    }

    if (spell.targetingConfig) {
      newAbility.targetingConfig = spell.targetingConfig;
    }

    if (spell.durationConfig) {
      newAbility.durationConfig = spell.durationConfig;
    }

    if (spell.rollableTable) {
      newAbility.rollableTable = spell.rollableTable;
    }

    // Directly add the ability to the creature
    dispatch(wizardActionCreators.addAbility(newAbility));

    // Track as recently added for visual feedback
    setRecentlyAddedSpells(prev => new Set([...prev, spell.id]));

    // Remove from recently added after 3 seconds
    setTimeout(() => {
      setRecentlyAddedSpells(prev => {
        const newSet = new Set(prev);
        newSet.delete(spell.id);
        return newSet;
      });
    }, 3000);

    // Show feedback that the spell was added (keep window open)
    console.log("Added spell to creature:", spell.name);
  };

  // Render tactics and behavior section
  const renderTacticsSection = () => {
    const tactics = wizardState.tactics || {
      combatStyle: 'balanced',
      targetPriority: 'balanced',
      abilityUsage: 'strategic',
      retreatThreshold: 30,
      notes: ''
    };

    return (
      <div className="tactics-behavior-section">
        <h3 className="tactics-section-title">
          <i className="fas fa-chess"></i> Tactics & Behavior
        </h3>
        <div className="tactics-grid">
          <div className="tactics-group">
            <label className="tactics-label">Combat Style</label>
            <select
              value={tactics.combatStyle}
              onChange={(e) => dispatch(wizardActionCreators.setTactics({ combatStyle: e.target.value }))}
              className="tactics-select"
            >
              <option value="passive">Passive - Avoids combat when possible</option>
              <option value="defensive">Defensive - Focuses on protection</option>
              <option value="balanced">Balanced - Adapts to situation</option>
              <option value="aggressive">Aggressive - Seeks combat</option>
              <option value="frontline">Front Line - Charges into battle</option>
            </select>
          </div>

          <div className="tactics-group">
            <label className="tactics-label">Target Priority</label>
            <select
              value={tactics.targetPriority}
              onChange={(e) => dispatch(wizardActionCreators.setTactics({ targetPriority: e.target.value }))}
              className="tactics-select"
            >
              <option value="weakest">Weakest - Attacks most frail characters</option>
              <option value="strongest">Strongest - Focuses on biggest threats</option>
              <option value="nearest">Nearest - Attacks closest enemies</option>
              <option value="balanced">Balanced - Considers multiple factors</option>
              <option value="random">Random - Unpredictable targeting</option>
            </select>
          </div>

          <div className="tactics-group">
            <label className="tactics-label">Ability Usage</label>
            <select
              value={tactics.abilityUsage}
              onChange={(e) => dispatch(wizardActionCreators.setTactics({ abilityUsage: e.target.value }))}
              className="tactics-select"
            >
              <option value="conservative">Conservative - Saves abilities for key moments</option>
              <option value="strategic">Strategic - Uses abilities tactically</option>
              <option value="aggressive">Aggressive - Uses abilities frequently</option>
              <option value="desperate">Desperate - Uses abilities when in danger</option>
            </select>
          </div>

          <div className="tactics-group">
            <label className="tactics-label">Retreat Threshold (% HP)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={tactics.retreatThreshold}
              onChange={(e) => dispatch(wizardActionCreators.setTactics({ retreatThreshold: parseInt(e.target.value) || 30 }))}
              className="tactics-input"
            />
            <span className="tactics-hint">Creature considers retreating below this HP percentage</span>
          </div>

          <div className="tactics-group full-width">
            <label className="tactics-label">Additional Tactical Notes</label>
            <textarea
              value={tactics.notes}
              onChange={(e) => dispatch(wizardActionCreators.setTactics({ notes: e.target.value }))}
              className="tactics-textarea"
              placeholder="Add any additional notes about the creature's combat behavior, special tactics, or personality..."
              rows={3}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <SpellLibraryProvider>
      <div className="wizard-step">
        <div className="creature-window-content">
          <div className="abilities-header-section">
            <h2>Abilities & Spells</h2>
            <div className="abilities-header-buttons">
              <button
                type="button"
                className="add-from-spell-library-btn"
                onClick={handleAddFromLibrary}
              >
                <i className="fas fa-book"></i> Add From Spell Library
              </button>
              <button
                type="button"
                className="create-basic-ability-btn"
                onClick={() => setShowBasicAbilityCreator(true)}
              >
                <i className="fas fa-plus"></i> Create Basic Spell/Ability
              </button>
            </div>
          </div>

          {renderTacticsSection()}

          {renderAbilityList()}
        </div>

        {/* Ability Selection Window */}
        <AbilitySelectionWindow
          isOpen={showAbilitySelector}
          onClose={() => setShowAbilitySelector(false)}
          onSelectAbility={handleSelectSpell}
          recentlyAddedSpells={recentlyAddedSpells}
          existingAbilities={wizardState.abilities}
        />

        {/* Basic Ability Creator */}
        <BasicAbilityCreator
          isOpen={showBasicAbilityCreator}
          onClose={() => setShowBasicAbilityCreator(false)}
          onCreateAbility={handleCreateBasicAbility}
        />
      </div>
    </SpellLibraryProvider>
  );
};

export default Step3Abilities;
