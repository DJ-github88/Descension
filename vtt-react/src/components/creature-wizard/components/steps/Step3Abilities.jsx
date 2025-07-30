import React, { useState, Suspense, lazy } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import '../../styles/WizardSteps.css';
import './Step3Abilities.css';
import { SpellLibraryProvider } from '../../../../components/spellcrafting-wizard/context/SpellLibraryContext';
import AbilitySelectionWindow from '../windows/AbilitySelectionWindow';
// Import Pathfinder styles for spell cards
import '../../../spellcrafting-wizard/styles/pathfinder/main.css';

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
  effects: []
};

const Step3Abilities = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();

  const [editingAbilityIndex, setEditingAbilityIndex] = useState(null);
  const [currentAbility, setCurrentAbility] = useState({ ...DEFAULT_ABILITY });
  const [showAbilityForm, setShowAbilityForm] = useState(false);
  const [showAbilitySelector, setShowAbilitySelector] = useState(false);
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

  // Render the ability list
  const renderAbilityList = () => {
    if (wizardState.abilities.length === 0) {
      return (
        <div className="no-abilities-message">
          <div className="no-abilities-icon"><i className="fas fa-book-open"></i></div>
          <p>No abilities added yet. Click "Add From Spell Library" to add spells and abilities.</p>
        </div>
      );
    }

    return (
      <div className="ability-list">
        {wizardState.abilities.map((ability, index) => {
          // Determine the rarity class based on level
          const getRarityClass = () => {
            const level = ability.level || 1;
            if (level >= 9) return 'epic';
            if (level >= 6) return 'rare';
            if (level >= 3) return 'uncommon';
            return 'common';
          };

          // Determine the spell school color
          const getSpellSchoolColor = () => {
            const damageType = ability.damage?.damageType || 'physical';
            const typeMap = {
              'physical': 'physical',
              'fire': 'fire',
              'frost': 'frost',
              'arcane': 'arcane',
              'nature': 'nature',
              'shadow': 'shadow',
              'holy': 'holy',
              'poison': 'poison'
            };
            return `school-${typeMap[damageType] || 'physical'}`;
          };

          // Format casting time
          const formatCastingTime = () => {
            if (ability.castingConfig?.castTime) {
              return ability.castingConfig.castTime;
            }
            return 'Instant';
          };

          // Format range
          const formatRange = () => {
            const range = ability.range || ability.targetingConfig?.rangeDistance || 0;
            if (range <= 0) return 'Self';
            return `${range} ft`;
          };

          return (
            <div key={index} className={`wow-spell-card pf-library-spell-card ${getRarityClass()} ${getSpellSchoolColor()}`}>
              {/* Card gloss effect */}
              <div className="spell-card-gloss"></div>

              <div className="spell-card-content">
                {/* Card header with icon, name, and resources */}
                <div className="pf-spell-card-header">
                  {/* Top row with icon and name */}
                  <div className="pf-spell-header-top">
                    {/* Spell icon */}
                    <div className="pf-spell-icon-container">
                      {ability.icon ? (
                        <img
                          src={`https://wow.zamimg.com/images/wow/icons/large/${ability.icon}.jpg`}
                          alt={ability.name}
                          className="pf-spell-icon"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                          }}
                        />
                      ) : (
                        <div className="pf-spell-icon ability-icon-placeholder">
                          <i className="fas fa-magic"></i>
                        </div>
                      )}
                    </div>

                    {/* Spell name and meta */}
                    <div className="pf-spell-info">
                      <h3 className="pf-spell-name">
                        {ability.name.toUpperCase()}
                      </h3>
                      <div className="pf-spell-meta">
                        <span className="pf-spell-type">{ability.spellType || formatAbilityType(ability.type) || 'Ability'}</span>
                        <span className="pf-spell-cast-time">{formatCastingTime()}</span>
                        <span className="pf-spell-range">{formatRange()}</span>
                        {ability.level && <span className="pf-spell-level">Level {ability.level}</span>}
                      </div>
                    </div>

                    {/* Remove button */}
                    <div className="pf-spell-actions">
                      <button
                        type="button"
                        className="pf-remove-ability-button"
                        onClick={() => handleRemoveAbility(index)}
                        title="Remove ability"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card body with description and effects */}
                <div className="pf-spell-card-body">
                  {ability.description && (
                    <div className="pf-spell-description">
                      {ability.description}
                    </div>
                  )}

                  {/* Display effects */}
                  {ability.effects && ability.effects.length > 0 && (
                    <div className="pf-spell-effects">
                      <div className="pf-effects-title">Effects:</div>
                      {ability.effects.map((effect, effectIndex) => (
                        <div key={effectIndex} className={`pf-spell-effect pf-effect-${effect.type?.toLowerCase()}`}>
                          {effect.type === 'damage' || effect.type === 'DAMAGE' ? (
                            <div className="pf-effect-damage">
                              <span className="pf-effect-label">Damage:</span>
                              <span className="pf-effect-value">
                                <span className="pf-damage-formula">
                                  {effect.formula || (ability.damage ?
                                    `${ability.damage.diceCount || 0}d${ability.damage.diceType || 6}${(ability.damage.bonus && ability.damage.bonus > 0) ? ` + ${ability.damage.bonus}` : ''}`
                                    : '1d6')}
                                </span>
                                <span className="pf-damage-type">
                                  {formatDamageType(effect.damageType || (ability.damage ? ability.damage.damageType : 'physical'))}
                                </span>
                              </span>
                            </div>
                          ) : effect.type === 'healing' || effect.type === 'HEALING' ? (
                            <div className="pf-effect-healing">
                              <span className="pf-effect-label">Healing:</span>
                              <span className="pf-effect-value">{effect.formula || effect.dice || '1d6'}</span>
                            </div>
                          ) : effect.type === 'condition' || effect.type === 'CONDITION' ? (
                            <div className="pf-effect-condition">
                              <span className="pf-effect-label">Condition:</span>
                              <span className="pf-effect-value">{effect.condition} for {effect.duration} turns</span>
                            </div>
                          ) : (
                            <div className="pf-effect-other">
                              <span className="pf-effect-label">{effect.type}:</span>
                              <span className="pf-effect-value">{effect.description || 'No details'}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Card footer with stats */}
                  <div className="pf-spell-footer">
                    <div className="pf-spell-stats">
                      <div className="pf-spell-stat">
                        <span className="pf-stat-label">AP Cost:</span>
                        <span className="pf-stat-value">{ability.actionPointCost || 1}</span>
                      </div>

                      {ability.cooldown > 0 && (
                        <div className="pf-spell-stat">
                          <span className="pf-stat-label">Cooldown:</span>
                          <span className="pf-stat-value">{ability.cooldown} turns</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
      originalSpell: spell
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

  return (
    <div className="wizard-step">
      <h2>Abilities & Spells</h2>

      {/* Ability Selection Window */}
      <AbilitySelectionWindow
        isOpen={showAbilitySelector}
        onClose={() => setShowAbilitySelector(false)}
        onSelectAbility={handleSelectSpell}
        recentlyAddedSpells={recentlyAddedSpells}
        existingAbilities={wizardState.abilities}
      />

      <div className="step-actions">
        <button
          type="button"
          className="add-from-spell-library-btn"
          onClick={handleAddFromLibrary}
        >
          <i className="fas fa-book"></i> Add From Spell Library
        </button>
      </div>

      {renderAbilityList()}
    </div>
  );
};

export default Step3Abilities;
