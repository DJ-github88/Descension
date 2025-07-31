import React, { useState, useEffect, useCallback } from 'react';
import { 
  PROC_TRIGGERS, 
  PROC_EFFECTS, 
  PROC_CHANCE_TYPES,
  getProcTrigger,
  getProcEffect,
  getProcChanceType
} from '../../core/mechanics/procSystem';
import { FaPlus, FaTrash, FaInfoCircle, FaDice, FaPercentage, FaBolt, FaRandom } from 'react-icons/fa';
import '../../styles/ProcEffectConfig.css';

const ProcEffectConfig = ({ procConfig, onChange }) => {
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [selectedEffect, setSelectedEffect] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  
  // Initialize with default values if needed - use useCallback to prevent infinite loops
  const stableOnChange = useCallback(onChange, []);

  useEffect(() => {
    if (!procConfig) {
      stableOnChange({
        enabled: false,
        triggers: [],
        effects: [],
        chanceType: 'percentage_chance',
        chanceValue: 0
      });
    }
  }, [procConfig, stableOnChange]);
  
  // Handle enabling/disabling proc effects
  const handleEnableChange = (e) => {
    onChange({
      ...procConfig,
      enabled: e.target.checked
    });
  };
  
  // Handle adding a trigger
  const handleAddTrigger = () => {
    if (!selectedTrigger || procConfig.triggers.includes(selectedTrigger)) return;
    
    onChange({
      ...procConfig,
      triggers: [...procConfig.triggers, selectedTrigger]
    });
    
    setSelectedTrigger('');
  };
  
  // Handle removing a trigger
  const handleRemoveTrigger = (trigger) => {
    onChange({
      ...procConfig,
      triggers: procConfig.triggers.filter(t => t !== trigger)
    });
  };
  
  // Handle adding an effect
  const handleAddEffect = () => {
    if (!selectedEffect) return;
    
    const effect = getProcEffect(selectedEffect);
    if (!effect) return;
    
    const newEffect = {
      type: selectedEffect,
      description: `${effect.name} effect`
    };
    
    // Add default configuration based on effect type
    switch (selectedEffect) {
      case 'damage_proc':
        newEffect.damageType = 'fire';
        newEffect.damageAmount = '40% of spell damage';
        newEffect.damageScaling = 'percentage';
        break;
      case 'healing_proc':
        newEffect.healingAmount = '20% of spell power';
        newEffect.healingScaling = 'percentage';
        newEffect.targetSelection = 'self';
        break;
      case 'buff_proc':
        newEffect.buffType = 'stat_increase';
        newEffect.buffAmount = '5%';
        newEffect.buffDuration = '10 sec';
        newEffect.targetSelection = 'self';
        break;
      case 'debuff_proc':
        newEffect.debuffType = 'movement_speed';
        newEffect.debuffAmount = '30%';
        newEffect.debuffDuration = '4 sec';
        newEffect.targetSelection = 'original_target';
        break;
      default:
        break;
    }
    
    onChange({
      ...procConfig,
      effects: [...procConfig.effects, newEffect]
    });
    
    setSelectedEffect('');
  };
  
  // Handle removing an effect
  const handleRemoveEffect = (index) => {
    const newEffects = [...procConfig.effects];
    newEffects.splice(index, 1);
    
    onChange({
      ...procConfig,
      effects: newEffects
    });
  };
  
  // Handle changing chance type
  const handleChanceTypeChange = (e) => {
    onChange({
      ...procConfig,
      chanceType: e.target.value
    });
  };
  
  // Handle changing chance value
  const handleChanceValueChange = (e) => {
    onChange({
      ...procConfig,
      chanceValue: parseFloat(e.target.value)
    });
  };
  
  // Handle updating effect configuration
  const handleEffectConfigChange = (index, field, value) => {
    const newEffects = [...procConfig.effects];
    newEffects[index] = {
      ...newEffects[index],
      [field]: value
    };
    
    onChange({
      ...procConfig,
      effects: newEffects
    });
  };
  
  // Toggle info panel
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  
  if (!procConfig) return null;
  
  return (
    <div className="proc-effect-config">
      <div className="proc-header">
        <div className="proc-enable">
          <input
            type="checkbox"
            id="enable-proc"
            checked={procConfig.enabled}
            onChange={handleEnableChange}
          />
          <label htmlFor="enable-proc">Enable Proc Effects</label>
        </div>
        <button className="info-button" onClick={toggleInfo}>
          <FaInfoCircle /> Info
        </button>
      </div>
      
      {showInfo && (
        <div className="proc-info-panel">
          <h4>About Proc Effects</h4>
          <p>Proc effects are special abilities that have a chance to trigger when certain conditions are met. They can add damage, healing, buffs, debuffs, or other effects to your spells.</p>
          <h5>Common Proc Types:</h5>
          <ul>
            <li><strong>On Hit:</strong> Triggers when your spell hits a target</li>
            <li><strong>Critical Strike:</strong> Triggers when your spell scores a critical hit</li>
            <li><strong>Periodic:</strong> Triggers at regular intervals</li>
            <li><strong>Chance-Based:</strong> Has a random chance to trigger</li>
          </ul>
        </div>
      )}
      
      {procConfig.enabled && (
        <div className="proc-content">
          <div className="proc-section">
            <h4>Proc Triggers</h4>
            <p className="section-description">When should this proc effect activate?</p>
            
            <div className="proc-trigger-selector">
              <select
                value={selectedTrigger}
                onChange={(e) => setSelectedTrigger(e.target.value)}
              >
                <option value="">Select a trigger...</option>
                {Object.keys(PROC_TRIGGERS).map(key => (
                  <option key={key} value={PROC_TRIGGERS[key].id}>
                    {PROC_TRIGGERS[key].name}
                  </option>
                ))}
              </select>
              <button 
                className="add-button"
                onClick={handleAddTrigger}
                disabled={!selectedTrigger}
              >
                <FaPlus /> Add
              </button>
            </div>
            
            <div className="proc-trigger-list">
              {procConfig.triggers.length === 0 ? (
                <div className="empty-list">No triggers added yet</div>
              ) : (
                <ul>
                  {procConfig.triggers.map(trigger => {
                    const triggerConfig = getProcTrigger(trigger);
                    return (
                      <li key={trigger} className="proc-trigger-item">
                        <div className="trigger-info">
                          <span className="trigger-name">{triggerConfig?.name || trigger}</span>
                          <span className="trigger-description">{triggerConfig?.description}</span>
                        </div>
                        <button 
                          className="remove-button"
                          onClick={() => handleRemoveTrigger(trigger)}
                        >
                          <FaTrash />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          
          <div className="proc-section">
            <h4>Proc Effects</h4>
            <p className="section-description">What happens when the proc triggers?</p>
            
            <div className="proc-effect-selector">
              <select
                value={selectedEffect}
                onChange={(e) => setSelectedEffect(e.target.value)}
              >
                <option value="">Select an effect...</option>
                {Object.keys(PROC_EFFECTS).map(key => (
                  <option key={key} value={PROC_EFFECTS[key].id}>
                    {PROC_EFFECTS[key].name}
                  </option>
                ))}
              </select>
              <button 
                className="add-button"
                onClick={handleAddEffect}
                disabled={!selectedEffect}
              >
                <FaPlus /> Add
              </button>
            </div>
            
            <div className="proc-effect-list">
              {procConfig.effects.length === 0 ? (
                <div className="empty-list">No effects added yet</div>
              ) : (
                <ul>
                  {procConfig.effects.map((effect, index) => {
                    const effectConfig = getProcEffect(effect.type);
                    return (
                      <li key={index} className="proc-effect-item">
                        <div className="effect-header">
                          <span className="effect-name">{effectConfig?.name || effect.type}</span>
                          <button 
                            className="remove-button"
                            onClick={() => handleRemoveEffect(index)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        
                        <div className="effect-config">
                          {effect.type === 'damage_proc' && (
                            <>
                              <div className="config-row">
                                <label>Damage Type:</label>
                                <select
                                  value={effect.damageType || 'fire'}
                                  onChange={(e) => handleEffectConfigChange(index, 'damageType', e.target.value)}
                                >
                                  <option value="physical">Physical</option>
                                  <option value="fire">Fire</option>
                                  <option value="frost">Frost</option>
                                  <option value="arcane">Arcane</option>
                                  <option value="nature">Nature</option>
                                  <option value="shadow">Shadow</option>
                                  <option value="holy">Holy</option>
                                </select>
                              </div>
                              <div className="config-row">
                                <label>Damage Amount:</label>
                                <input
                                  type="text"
                                  value={effect.damageAmount || ''}
                                  onChange={(e) => handleEffectConfigChange(index, 'damageAmount', e.target.value)}
                                  placeholder="e.g., 40% of spell damage"
                                />
                              </div>
                              <div className="config-row">
                                <label>Scaling:</label>
                                <select
                                  value={effect.damageScaling || 'percentage'}
                                  onChange={(e) => handleEffectConfigChange(index, 'damageScaling', e.target.value)}
                                >
                                  <option value="flat">Flat Value</option>
                                  <option value="percentage">Percentage</option>
                                  <option value="weapon_damage">Weapon Damage</option>
                                  <option value="spell_power">Spell Power</option>
                                </select>
                              </div>
                            </>
                          )}
                          
                          {effect.type === 'healing_proc' && (
                            <>
                              <div className="config-row">
                                <label>Healing Amount:</label>
                                <input
                                  type="text"
                                  value={effect.healingAmount || ''}
                                  onChange={(e) => handleEffectConfigChange(index, 'healingAmount', e.target.value)}
                                  placeholder="e.g., 20% of spell power"
                                />
                              </div>
                              <div className="config-row">
                                <label>Scaling:</label>
                                <select
                                  value={effect.healingScaling || 'percentage'}
                                  onChange={(e) => handleEffectConfigChange(index, 'healingScaling', e.target.value)}
                                >
                                  <option value="flat">Flat Value</option>
                                  <option value="percentage">Percentage</option>
                                  <option value="spell_power">Spell Power</option>
                                </select>
                              </div>
                              <div className="config-row">
                                <label>Target:</label>
                                <select
                                  value={effect.targetSelection || 'self'}
                                  onChange={(e) => handleEffectConfigChange(index, 'targetSelection', e.target.value)}
                                >
                                  <option value="self">Self</option>
                                  <option value="original_target">Original Target</option>
                                  <option value="lowest_health">Lowest Health Ally</option>
                                  <option value="random_ally">Random Ally</option>
                                </select>
                              </div>
                            </>
                          )}
                          
                          {effect.type === 'buff_proc' && (
                            <>
                              <div className="config-row">
                                <label>Buff Type:</label>
                                <select
                                  value={effect.buffType || 'stat_increase'}
                                  onChange={(e) => handleEffectConfigChange(index, 'buffType', e.target.value)}
                                >
                                  <option value="stat_increase">Stat Increase</option>
                                  <option value="damage_increase">Damage Increase</option>
                                  <option value="critical_chance">Critical Chance</option>
                                  <option value="haste">Haste</option>
                                  <option value="damage_reduction">Damage Reduction</option>
                                </select>
                              </div>
                              <div className="config-row">
                                <label>Amount:</label>
                                <input
                                  type="text"
                                  value={effect.buffAmount || ''}
                                  onChange={(e) => handleEffectConfigChange(index, 'buffAmount', e.target.value)}
                                  placeholder="e.g., 5%"
                                />
                              </div>
                              <div className="config-row">
                                <label>Duration:</label>
                                <input
                                  type="text"
                                  value={effect.buffDuration || ''}
                                  onChange={(e) => handleEffectConfigChange(index, 'buffDuration', e.target.value)}
                                  placeholder="e.g., 10 sec"
                                />
                              </div>
                              <div className="config-row">
                                <label>Target:</label>
                                <select
                                  value={effect.targetSelection || 'self'}
                                  onChange={(e) => handleEffectConfigChange(index, 'targetSelection', e.target.value)}
                                >
                                  <option value="self">Self</option>
                                  <option value="original_target">Original Target</option>
                                  <option value="random_ally">Random Ally</option>
                                </select>
                              </div>
                            </>
                          )}
                          
                          {effect.type === 'debuff_proc' && (
                            <>
                              <div className="config-row">
                                <label>Debuff Type:</label>
                                <select
                                  value={effect.debuffType || 'movement_speed'}
                                  onChange={(e) => handleEffectConfigChange(index, 'debuffType', e.target.value)}
                                >
                                  <option value="stat_reduction">Stat Reduction</option>
                                  <option value="damage_taken_increase">Damage Taken Increase</option>
                                  <option value="movement_speed">Movement Speed</option>
                                  <option value="attack_speed">Attack Speed</option>
                                  <option value="healing_reduction">Healing Reduction</option>
                                </select>
                              </div>
                              <div className="config-row">
                                <label>Amount:</label>
                                <input
                                  type="text"
                                  value={effect.debuffAmount || ''}
                                  onChange={(e) => handleEffectConfigChange(index, 'debuffAmount', e.target.value)}
                                  placeholder="e.g., 30%"
                                />
                              </div>
                              <div className="config-row">
                                <label>Duration:</label>
                                <input
                                  type="text"
                                  value={effect.debuffDuration || ''}
                                  onChange={(e) => handleEffectConfigChange(index, 'debuffDuration', e.target.value)}
                                  placeholder="e.g., 4 sec"
                                />
                              </div>
                              <div className="config-row">
                                <label>Target:</label>
                                <select
                                  value={effect.targetSelection || 'original_target'}
                                  onChange={(e) => handleEffectConfigChange(index, 'targetSelection', e.target.value)}
                                >
                                  <option value="original_target">Original Target</option>
                                  <option value="random_enemy">Random Enemy</option>
                                  <option value="all_enemies">All Enemies</option>
                                </select>
                              </div>
                            </>
                          )}
                          
                          <div className="config-row">
                            <label>Description:</label>
                            <input
                              type="text"
                              value={effect.description || ''}
                              onChange={(e) => handleEffectConfigChange(index, 'description', e.target.value)}
                              placeholder="Describe the effect"
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          
          <div className="proc-section">
            <h4>Proc Chance</h4>
            <p className="section-description">How likely is the proc to trigger?</p>
            
            <div className="proc-chance-config">
              <div className="config-row">
                <label>Chance Type:</label>
                <select
                  value={procConfig.chanceType}
                  onChange={handleChanceTypeChange}
                >
                  {Object.keys(PROC_CHANCE_TYPES).map(key => (
                    <option key={key} value={PROC_CHANCE_TYPES[key].id}>
                      {PROC_CHANCE_TYPES[key].name}
                    </option>
                  ))}
                </select>
              </div>
              
              {procConfig.chanceType === 'percentage_chance' && (
                <div className="config-row">
                  <label>Chance (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={procConfig.chanceValue}
                    onChange={handleChanceValueChange}
                  />
                </div>
              )}
              
              {procConfig.chanceType === 'procs_per_minute' && (
                <div className="config-row">
                  <label>Procs Per Minute:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={procConfig.chanceValue}
                    onChange={handleChanceValueChange}
                  />
                </div>
              )}
              
              {procConfig.chanceType === 'stacking_chance' && (
                <div className="config-row">
                  <label>Initial Chance (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={procConfig.chanceValue}
                    onChange={handleChanceValueChange}
                  />
                </div>
              )}
              
              {procConfig.chanceType === 'guaranteed' && (
                <div className="guaranteed-message">
                  <FaInfoCircle /> This proc will always trigger when the conditions are met.
                </div>
              )}
            </div>
          </div>
          
          <div className="proc-preview">
            <h4>Proc Preview</h4>
            <div className="proc-preview-content">
              {procConfig.triggers.length > 0 && procConfig.effects.length > 0 ? (
                <div className="proc-description">
                  <p>
                    <strong>Trigger:</strong> {procConfig.triggers.map(trigger => {
                      const triggerConfig = getProcTrigger(trigger);
                      return triggerConfig?.name || trigger;
                    }).join(', ')}
                  </p>
                  <p>
                    <strong>Effect:</strong> {procConfig.effects.map(effect => effect.description).join(', ')}
                  </p>
                  <p>
                    <strong>Chance:</strong> {procConfig.chanceType === 'guaranteed' ? 
                      'Always triggers' : 
                      `${procConfig.chanceValue}% chance`}
                  </p>
                </div>
              ) : (
                <div className="empty-preview">
                  Add triggers and effects to see a preview
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcEffectConfig;
