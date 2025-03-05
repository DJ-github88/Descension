import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Trigger categories for organization
const TRIGGER_CATEGORIES = {
  ON_HIT: 'On Hit',
  ON_DAMAGE: 'On Damage Taken',
  ON_CAST: 'On Cast',
  ON_KILL: 'On Kill',
  ON_HEAL: 'On Heal',
  ON_BUFF: 'On Buff/Debuff',
  ON_MOVE: 'On Movement'
};

// Sample trigger types data
const TRIGGER_TYPES = {
  // On Hit Triggers
  critical_strike: {
    id: 'critical_strike',
    name: 'Critical Strike Proc',
    description: 'Chance to deal extra damage on hit',
    icon: 'ability_hunter_snipershot',
    category: 'ON_HIT',
    conditions: {
      chance: {
        type: 'number',
        label: 'Proc Chance (%)',
        min: 1,
        max: 100,
        default: 15,
        step: 1
      },
      multiplier: {
        type: 'number',
        label: 'Damage Multiplier',
        min: 1.5,
        max: 5,
        default: 2,
        step: 0.5
      }
    }
  },
  additional_hit: {
    id: 'additional_hit',
    name: 'Additional Hit',
    description: 'Chance to strike an additional time',
    icon: 'ability_warrior_decisivestrike',
    category: 'ON_HIT',
    conditions: {
      chance: {
        type: 'number',
        label: 'Proc Chance (%)',
        min: 1,
        max: 100,
        default: 10,
        step: 1
      },
      damagePercent: {
        type: 'number',
        label: 'Damage Percentage',
        min: 10,
        max: 100,
        default: 50,
        step: 5
      }
    }
  },
  apply_dot: {
    id: 'apply_dot',
    name: 'Apply Damage Over Time',
    description: 'Applies a damage over time effect on hit',
    icon: 'spell_shadow_unstableaffliction_3',
    category: 'ON_HIT',
    conditions: {
      chance: {
        type: 'number',
        label: 'Proc Chance (%)',
        min: 1,
        max: 100,
        default: 25,
        step: 1
      },
      duration: {
        type: 'number',
        label: 'Duration (seconds)',
        min: 1,
        max: 30,
        default: 6,
        step: 1
      },
      damageType: {
        type: 'select',
        label: 'Damage Type',
        options: [
          { value: 'physical', label: 'Physical' },
          { value: 'fire', label: 'Fire' },
          { value: 'frost', label: 'Frost' },
          { value: 'nature', label: 'Nature' },
          { value: 'shadow', label: 'Shadow' }
        ],
        default: 'physical'
      }
    }
  },
  
  // On Damage Taken Triggers
  damage_reflection: {
    id: 'damage_reflection',
    name: 'Damage Reflection',
    description: 'Reflects a portion of damage taken back to the attacker',
    icon: 'spell_fire_selfdestruct',
    category: 'ON_DAMAGE',
    conditions: {
      chance: {
        type: 'number',
        label: 'Proc Chance (%)',
        min: 1,
        max: 100,
        default: 100,
        step: 1
      },
      reflectPercent: {
        type: 'number',
        label: 'Reflect Percentage',
        min: 5,
        max: 100,
        default: 20,
        step: 5
      }
    }
  },
  temporary_shield: {
    id: 'temporary_shield',
    name: 'Temporary Shield',
    description: 'Creates a temporary shield when taking damage',
    icon: 'spell_holy_powerwordshield',
    category: 'ON_DAMAGE',
    conditions: {
      chance: {
        type: 'number',
        label: 'Proc Chance (%)',
        min: 1,
        max: 100,
        default: 15,
        step: 1
      },
      duration: {
        type: 'number',
        label: 'Duration (seconds)',
        min: 1,
        max: 10,
        default: 3,
        step: 1
      },
      shieldAmount: {
        type: 'number',
        label: 'Shield Amount (%)',
        min: 5,
        max: 50,
        default: 15,
        step: 5
      }
    }
  },
  
  // On Cast Triggers
  resource_restore: {
    id: 'resource_restore',
    name: 'Resource Restoration',
    description: 'Restores resources on spell cast',
    icon: 'spell_nature_manaregentotem',
    category: 'ON_CAST',
    conditions: {
      chance: {
        type: 'number',
        label: 'Proc Chance (%)',
        min: 1,
        max: 100,
        default: 15,
        step: 1
      },
      resourceType: {
        type: 'select',
        label: 'Resource Type',
        options: [
          { value: 'mana', label: 'Mana' },
          { value: 'rage', label: 'Rage' },
          { value: 'energy', label: 'Energy' },
          { value: 'focus', label: 'Focus' }
        ],
        default: 'mana'
      },
      amount: {
        type: 'number',
        label: 'Amount (%)',
        min: 1,
        max: 20,
        default: 5,
        step: 1
      }
    }
  },
  cast_speed: {
    id: 'cast_speed',
    name: 'Casting Speed Boost',
    description: 'Temporarily increases casting speed',
    icon: 'spell_nature_lightning',
    category: 'ON_CAST',
    conditions: {
      chance: {
        type: 'number',
        label: 'Proc Chance (%)',
        min: 1,
        max: 100,
        default: 10,
        step: 1
      },
      duration: {
        type: 'number',
        label: 'Duration (seconds)',
        min: 1,
        max: 10,
        default: 4,
        step: 1
      },
      speedIncrease: {
        type: 'number',
        label: 'Speed Increase (%)',
        min: 5,
        max: 50,
        default: 15,
        step: 5
      }
    }
  },
  
  // On Kill Triggers
  health_restore_kill: {
    id: 'health_restore_kill',
    name: 'Health Restore on Kill',
    description: 'Restores health when you kill an enemy',
    icon: 'spell_holy_sealofsacrifice',
    category: 'ON_KILL',
    conditions: {
      chance: {
        type: 'number',
        label: 'Proc Chance (%)',
        min: 1,
        max: 100,
        default: 100,
        step: 1
      },
      amount: {
        type: 'number',
        label: 'Health Amount (%)',
        min: 1,
        max: 20,
        default: 5,
        step: 1
      }
    }
  },
  
  // On Heal Triggers
  healing_boost: {
    id: 'healing_boost',
    name: 'Healing Boost',
    description: 'Chance to boost healing received',
    icon: 'spell_holy_flashheal',
    category: 'ON_HEAL',
    conditions: {
      chance: {
        type: 'number',
        label: 'Proc Chance (%)',
        min: 1,
        max: 100,
        default: 20,
        step: 1
      },
      healingIncrease: {
        type: 'number',
        label: 'Healing Increase (%)',
        min: 10,
        max: 100,
        default: 30,
        step: 5
      }
    }
  }
};

const TriggerBuilder = ({
  value = {},
  onChange = () => {},
  maxTriggers = null,
  filter = null
}) => {
  const [selectedTriggers, setSelectedTriggers] = useState(value.triggers || []);
  const [selectedConditions, setSelectedConditions] = useState(value.conditions || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ON_HIT');

  // Update parent component with changes
  useEffect(() => {
    onChange({
      triggers: selectedTriggers,
      conditions: selectedConditions
    });
  }, [selectedTriggers, selectedConditions, onChange]);

  // Toggle trigger selection
  const handleTriggerToggle = (triggerId) => {
    if (selectedTriggers.includes(triggerId)) {
      // Remove trigger if already selected
      setSelectedTriggers(prev => prev.filter(id => id !== triggerId));
      
      // Also remove its conditions
      setSelectedConditions(prev => {
        const newConditions = { ...prev };
        delete newConditions[triggerId];
        return newConditions;
      });
    } else {
      // Check if we're at the maximum triggers limit
      if (maxTriggers && selectedTriggers.length >= maxTriggers) {
        return;
      }
      
      // Add new trigger with default conditions
      setSelectedTriggers(prev => [...prev, triggerId]);
      
      // Initialize conditions with defaults
      const trigger = TRIGGER_TYPES[triggerId];
      if (trigger && trigger.conditions) {
        const defaultConditions = {};
        
        Object.entries(trigger.conditions).forEach(([condId, condData]) => {
          defaultConditions[condId] = condData.default;
        });
        
        setSelectedConditions(prev => ({
          ...prev,
          [triggerId]: defaultConditions
        }));
      }
    }
  };

  // Update specific condition value
  const handleConditionChange = (triggerId, conditionId, value) => {
    setSelectedConditions(prev => ({
      ...prev,
      [triggerId]: {
        ...prev[triggerId],
        [conditionId]: value
      }
    }));
  };

  // Render condition inputs based on trigger type
  const renderTriggerConditions = (triggerId) => {
    const trigger = TRIGGER_TYPES[triggerId];
    if (!trigger || !trigger.conditions) return null;

    return (
      <div className="trigger-conditions">
        {Object.entries(trigger.conditions).map(([conditionId, condition]) => {
          const currentValue = selectedConditions[triggerId]?.[conditionId] ?? condition.default;
          
          switch (condition.type) {
            case 'number':
              return (
                <div key={conditionId} className="condition-input">
                  <label htmlFor={`${triggerId}-${conditionId}`}>{condition.label}</label>
                  <input
                    id={`${triggerId}-${conditionId}`}
                    type="number"
                    value={currentValue}
                    onChange={(e) => handleConditionChange(
                      triggerId,
                      conditionId,
                      parseFloat(e.target.value)
                    )}
                    min={condition.min}
                    max={condition.max}
                    step={condition.step || 1}
                  />
                </div>
              );
              
            case 'select':
              return (
                <div key={conditionId} className="condition-select">
                  <label htmlFor={`${triggerId}-${conditionId}`}>{condition.label}</label>
                  <select
                    id={`${triggerId}-${conditionId}`}
                    value={currentValue}
                    onChange={(e) => handleConditionChange(
                      triggerId,
                      conditionId,
                      e.target.value
                    )}
                  >
                    {condition.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
              
            case 'boolean':
              return (
                <div key={conditionId} className="condition-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={currentValue}
                      onChange={(e) => handleConditionChange(
                        triggerId,
                        conditionId,
                        e.target.checked
                      )}
                    />
                    {condition.label}
                  </label>
                </div>
              );
              
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Filter triggers based on search and active category
  const filteredTriggers = Object.entries(TRIGGER_TYPES)
    .filter(([id, trigger]) => {
      if (filter && !filter(trigger)) return false;
      if (trigger.category !== activeCategory) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return trigger.name.toLowerCase().includes(term) ||
               trigger.description.toLowerCase().includes(term);
      }
      return true;
    });

  return (
    <div className="trigger-builder">
      <div className="builder-header">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search triggers..."
          className="trigger-search"
        />
        
        <div className="category-tabs">
          {Object.entries(TRIGGER_CATEGORIES).map(([category, label]) => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="triggers-grid">
        {filteredTriggers.length > 0 ? (
          filteredTriggers.map(([id, trigger]) => (
            <div key={id} className="trigger-item">
              <div 
                className={`trigger-header ${selectedTriggers.includes(id) ? 'selected' : ''}`}
                onClick={() => handleTriggerToggle(id)}
              >
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/large/${trigger.icon || 'inv_misc_questionmark'}.jpg`}
                  alt={trigger.name}
                  className="trigger-icon"
                  onError={(e) => {
                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                  }}
                />
                <div className="trigger-info">
                  <span className="trigger-name">{trigger.name}</span>
                  <span className="trigger-description">{trigger.description}</span>
                </div>
              </div>
              
              {selectedTriggers.includes(id) && renderTriggerConditions(id)}
            </div>
          ))
        ) : (
          <div className="no-results">
            No triggers found matching your criteria
          </div>
        )}
      </div>

      {selectedTriggers.length > 0 && (
        <div className="selected-triggers">
          <h4>Selected Triggers</h4>
          <div className="trigger-summary">
            {selectedTriggers.map(id => {
              const trigger = TRIGGER_TYPES[id];
              if (!trigger) return null;
              
              return (
                <div key={id} className="selected-trigger">
                  <img 
                    src={`https://wow.zamimg.com/images/wow/icons/small/${trigger.icon || 'inv_misc_questionmark'}.jpg`}
                    alt={trigger.name}
                    className="trigger-icon-small"
                    onError={(e) => {
                      e.target.src = 'https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg';
                    }}
                  />
                  <span className="trigger-name">{trigger.name}</span>
                  <button 
                    className="remove-trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerToggle(id);
                    }}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {maxTriggers && (
        <div className="trigger-counter">
          Selected: {selectedTriggers.length} / {maxTriggers}
        </div>
      )}
    </div>
  );
};

TriggerBuilder.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  maxTriggers: PropTypes.number,
  filter: PropTypes.func
};

export default TriggerBuilder;