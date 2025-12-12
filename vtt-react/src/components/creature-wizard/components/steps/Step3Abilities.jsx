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
  effects: []
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
          };

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
    dispatch(wizardActionCreators.addAbility(ability));
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
