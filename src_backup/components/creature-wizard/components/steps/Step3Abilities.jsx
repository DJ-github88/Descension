import React, { useState, useEffect, Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import '../../styles/WizardSteps.css';
import './Step3Abilities.css';
import AbilitySelectionWindow from '../windows/AbilitySelectionWindow';

// Damage types
const DAMAGE_TYPES = [
  { id: 'physical', name: 'Physical' },
  { id: 'slashing', name: 'Slashing' },
  { id: 'piercing', name: 'Piercing' },
  { id: 'bludgeoning', name: 'Bludgeoning' },
  { id: 'fire', name: 'Fire' },
  { id: 'frost', name: 'Frost' },
  { id: 'arcane', name: 'Arcane' },
  { id: 'holy', name: 'Holy' },
  { id: 'shadow', name: 'Shadow' },
  { id: 'nature', name: 'Nature' },
  { id: 'poison', name: 'Poison' }
];

// Ability types
const ABILITY_TYPES = [
  { id: 'attack', name: 'Attack' },
  { id: 'spell', name: 'Spell' },
  { id: 'trait', name: 'Trait' },
  { id: 'reaction', name: 'Reaction' }
];

// Condition types
const CONDITION_TYPES = [
  { id: 'blinded', name: 'Blinded' },
  { id: 'charmed', name: 'Charmed' },
  { id: 'deafened', name: 'Deafened' },
  { id: 'frightened', name: 'Frightened' },
  { id: 'grappled', name: 'Grappled' },
  { id: 'incapacitated', name: 'Incapacitated' },
  { id: 'invisible', name: 'Invisible' },
  { id: 'paralyzed', name: 'Paralyzed' },
  { id: 'petrified', name: 'Petrified' },
  { id: 'poisoned', name: 'Poisoned' },
  { id: 'prone', name: 'Prone' },
  { id: 'restrained', name: 'Restrained' },
  { id: 'stunned', name: 'Stunned' },
  { id: 'unconscious', name: 'Unconscious' },
  { id: 'burning', name: 'Burning' },
  { id: 'bleeding', name: 'Bleeding' },
  { id: 'frozen', name: 'Frozen' }
];

// Default ability
const DEFAULT_ABILITY = {
  id: '',
  name: '',
  description: '',
  type: 'attack',
  damage: '',
  damageType: 'physical',
  apCost: 2,
  cooldown: 0,
  range: 5,
  areaOfEffect: null,
  effects: []
};

// Default effect
const DEFAULT_EFFECT = {
  type: 'condition',
  condition: 'prone',
  duration: 1,
  saveType: null,
  saveDC: null
};

const Step3Abilities = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();

  const [showAbilitySelector, setShowAbilitySelector] = useState(false);

  // Handle deleting an ability
  const handleDeleteAbility = (abilityId) => {
    if (window.confirm('Are you sure you want to delete this ability?')) {
      dispatch(wizardActionCreators.removeAbility(abilityId));
    }
  };

  // Handle opening the ability selection window
  const handleAddFromLibrary = () => {
    setShowAbilitySelector(true);
  };

  // Handle selecting a spell from the library
  const handleSelectSpell = (spell) => {
    // Convert spell to ability format
    const newAbility = {
      ...DEFAULT_ABILITY,
      id: uuidv4(),
      name: spell.name,
      type: 'spell',
      description: spell.description || '',
      damage: '',
      damageType: 'physical',
      range: spell.range || 0,
      apCost: spell.actionPointCost || 1,
      cooldown: spell.cooldown || 0,
      // Store the original spell ID for reference
      spellId: spell.id
    };

    // Process spell effects
    if (spell.effects && spell.effects.length > 0) {
      // Extract damage information
      const damageEffect = spell.effects.find(e => e.type === 'damage' || e.type === 'DAMAGE');
      if (damageEffect) {
        newAbility.damage = damageEffect.formula || damageEffect.dice || '';
        newAbility.damageType = damageEffect.damageType || 'physical';
      }

      // Extract condition effects
      const conditionEffects = spell.effects
        .filter(e => e.type === 'condition' || e.type === 'CONDITION' || e.type === 'CONTROL')
        .map(e => ({
          type: 'condition',
          condition: e.condition || 'prone',
          duration: e.duration || 1,
          saveType: e.saveType || null,
          saveDC: e.saveDC || null
        }));

      if (conditionEffects.length > 0) {
        newAbility.effects = conditionEffects;
      }
    }

    // Directly add the ability to the creature
    dispatch(wizardActionCreators.addAbility(newAbility));
    setShowAbilitySelector(false);
  };

  return (
    <div className="wizard-step">
      <h2 className="step-title">Abilities & Spells</h2>

      {/* Ability Selection Window */}
      <AbilitySelectionWindow
        isOpen={showAbilitySelector}
        onClose={() => setShowAbilitySelector(false)}
        onSelectAbility={handleSelectSpell}
      />

      <div className="abilities-list-container">
        <div className="step-actions">
          <button
            className="add-from-spell-library-btn"
            onClick={handleAddFromLibrary}
          >
            <i className="fas fa-book"></i> Add From Spell Library
          </button>
        </div>

        {wizardState.abilities.length === 0 ? (
          <div className="no-abilities">
            <div className="no-abilities-icon"><i className="fas fa-book-open"></i></div>
            <p>No abilities added yet. Click "Add From Spell Library" to add spells and abilities.</p>
          </div>
        ) : (
          <div className="abilities-list">
            {wizardState.abilities.map(ability => (
              <div key={ability.id} className="ability-item">
                <div className="ability-header">
                  <h4 className="ability-name">{ability.name}</h4>
                  <div className="ability-actions">
                    <button
                      className="ability-action-button delete"
                      onClick={() => handleDeleteAbility(ability.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="ability-details">
                  <div className="ability-type">
                    {ABILITY_TYPES.find(t => t.id === ability.type)?.name || ability.type}
                  </div>

                  {ability.damage && (
                    <div className="ability-damage">
                      <span className="damage-value">
                        {typeof ability.damage === 'object'
                          ? `${ability.damage.diceCount}d${ability.damage.diceType}${ability.damage.bonus > 0 ? `+${ability.damage.bonus}` : ''}`
                          : ability.damage}
                      </span>
                      <span className="damage-type">
                        {DAMAGE_TYPES.find(t => t.id === (typeof ability.damage === 'object' ? ability.damage.damageType : ability.damageType))?.name ||
                          (typeof ability.damage === 'object' ? ability.damage.damageType : ability.damageType)}
                      </span>
                    </div>
                  )}

                  <div className="ability-cost">
                    <span className="cost-label">AP Cost:</span>
                    <span className="cost-value">{ability.apCost}</span>
                  </div>

                  {ability.cooldown > 0 && (
                    <div className="ability-cooldown">
                      <span className="cooldown-label">Cooldown:</span>
                      <span className="cooldown-value">{ability.cooldown} turns</span>
                    </div>
                  )}
                </div>

                {ability.description && (
                  <div className="ability-description">
                    {ability.description}
                  </div>
                )}

                {ability.effects && ability.effects.length > 0 && (
                  <div className="ability-effects">
                    <h5>Effects:</h5>
                    <ul className="effects-list">
                      {ability.effects.map((effect, index) => (
                        <li key={index} className="effect-item">
                          {effect.type === 'condition' ? (
                            <>
                              Applies <strong>{CONDITION_TYPES.find(c => c.id === effect.condition)?.name || effect.condition}</strong> for {effect.duration} turn(s)
                              {effect.saveType && (
                                <> (DC {effect.saveDC} {effect.saveType} save to avoid)</>
                              )}
                            </>
                          ) : (
                            <>Unknown effect type: {effect.type}</>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3Abilities;
