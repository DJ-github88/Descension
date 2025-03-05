import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Mock data for status effects (replace with your actual data)
const EFFECT_TYPES = {
  BUFF: 'Buff',
  DEBUFF: 'Debuff',
  CONTROL: 'Control',
  PROC: 'Proc Effect'
};

// Sample status effects data
const STATUS_EFFECTS = {
  BUFF: {
    strength: {
      id: 'strength',
      name: 'Strength',
      description: 'Increases physical damage and carrying capacity',
      icon: 'spell_nature_strength',
      color: '#ff4500',
      severity: 'moderate'
    },
    haste: {
      id: 'haste',
      name: 'Haste',
      description: 'Increases attack and casting speed',
      icon: 'spell_nature_bloodlust',
      color: '#ffd700',
      severity: 'major'
    },
    shield: {
      id: 'shield',
      name: 'Arcane Shield',
      description: 'Absorbs incoming damage',
      icon: 'spell_holy_powerwordshield',
      color: '#4169e1',
      severity: 'major'
    },
    regeneration: {
      id: 'regeneration',
      name: 'Regeneration',
      description: 'Restores health over time',
      icon: 'spell_nature_rejuvenation',
      color: '#32cd32',
      severity: 'moderate'
    }
  },
  DEBUFF: {
    poison: {
      id: 'poison',
      name: 'Poison',
      description: 'Deals nature damage over time',
      icon: 'ability_rogue_deadlypoison',
      color: '#adff2f',
      severity: 'moderate'
    },
    weakness: {
      id: 'weakness',
      name: 'Weakness',
      description: 'Reduces physical damage dealt',
      icon: 'spell_shadow_curseofweakness',
      color: '#8b4513',
      severity: 'minor'
    },
    burn: {
      id: 'burn',
      name: 'Burn',
      description: 'Deals fire damage over time',
      icon: 'spell_fire_immolation',
      color: '#ff8c00',
      severity: 'moderate'
    }
  },
  CONTROL: {
    stun: {
      id: 'stun',
      name: 'Stun',
      description: 'Prevents all action',
      icon: 'spell_frost_stun',
      color: '#1e90ff',
      severity: 'extreme'
    },
    root: {
      id: 'root',
      name: 'Root',
      description: 'Prevents movement',
      icon: 'spell_nature_stranglevines',
      color: '#006400',
      severity: 'major'
    },
    silence: {
      id: 'silence',
      name: 'Silence',
      description: 'Prevents spell casting',
      icon: 'spell_shadow_impphaseshift',
      color: '#800080',
      severity: 'major'
    }
  },
  PROC: {
    critBoost: {
      id: 'critBoost',
      name: 'Critical Strike',
      description: 'Next attack will critically hit',
      icon: 'ability_hunter_snipershot',
      color: '#b22222',
      severity: 'moderate'
    },
    cleave: {
      id: 'cleave',
      name: 'Cleave',
      description: 'Next attack hits additional targets',
      icon: 'ability_warrior_cleave',
      color: '#cd5c5c',
      severity: 'minor'
    }
  }
};

// Utility function to get all effects
const getAllStatusEffects = () => {
  return Object.entries(STATUS_EFFECTS).reduce((all, [category, effects]) => {
    return {...all, ...effects};
  }, {});
};

const EffectSelector = ({
  selectedEffects = [],
  onChange = () => {},
  maxEffects = null,
  filter = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allEffects = getAllStatusEffects();

  const handleEffectToggle = (effectId) => {
    const isSelected = selectedEffects.includes(effectId);
    let newEffects;

    if (isSelected) {
      // Remove effect if already selected
      newEffects = selectedEffects.filter(id => id !== effectId);
    } else {
      // Add effect if not at maximum
      if (maxEffects && selectedEffects.length >= maxEffects) {
        return; // Don't add if we're at the maximum
      }
      newEffects = [...selectedEffects, effectId];
    }

    onChange(newEffects);
  };

  // Filter effects based on search term and category
  const filteredEffects = Object.entries(STATUS_EFFECTS)
    .flatMap(([category, effects]) => {
      if (selectedCategory !== 'all' && category !== selectedCategory) {
        return [];
      }

      return Object.values(effects)
        .filter(effect => {
          if (filter && !filter(effect)) return false;
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return effect.name.toLowerCase().includes(term) ||
                   effect.description.toLowerCase().includes(term);
          }
          return true;
        });
    });

  return (
    <div className="effect-selector">
      <div className="selector-header">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search effects..."
          className="effect-search"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">All Effects</option>
          {Object.entries(EFFECT_TYPES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="effects-grid">
        {filteredEffects.length > 0 ? (
          filteredEffects.map(effect => (
            <button
              key={effect.id}
              className={`effect-button ${selectedEffects.includes(effect.id) ? 'selected' : ''}`}
              onClick={() => handleEffectToggle(effect.id)}
              disabled={maxEffects && selectedEffects.length >= maxEffects && !selectedEffects.includes(effect.id)}
              style={{
                borderLeft: `4px solid ${effect.color || '#6366f1'}`
              }}
            >
              <img 
                src={`https://wow.zamimg.com/images/wow/icons/large/${effect.icon || 'inv_misc_questionmark'}.jpg`}
                alt={effect.name}
                className="effect-icon"
                onError={(e) => {
                  e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                }}
              />
              <div className="effect-info">
                <span className="effect-name">{effect.name}</span>
                <span className="effect-description">{effect.description}</span>
              </div>
              <div className="effect-severity" data-severity={effect.severity || 'minor'}>
                {effect.severity || 'minor'}
              </div>
            </button>
          ))
        ) : (
          <div className="no-results">
            No effects found matching your criteria
          </div>
        )}
      </div>

      {selectedEffects.length > 0 && (
        <div className="selected-effects">
          {selectedEffects.map(effectId => {
            const effect = allEffects[effectId];
            if (!effect) return null;

            return (
              <div key={effectId} className="effect-tag">
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/small/${effect.icon || 'inv_misc_questionmark'}.jpg`}
                  alt=""
                  className="effect-tag-icon"
                />
                <span style={{ color: effect.color }}>{effect.name}</span>
                <button 
                  className="effect-tag-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEffectToggle(effectId);
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {maxEffects && (
        <div className="effect-counter">
          Selected: {selectedEffects.length} / {maxEffects}
        </div>
      )}
    </div>
  );
};

EffectSelector.propTypes = {
  selectedEffects: PropTypes.array,
  onChange: PropTypes.func,
  maxEffects: PropTypes.number,
  filter: PropTypes.func
};

export default EffectSelector;