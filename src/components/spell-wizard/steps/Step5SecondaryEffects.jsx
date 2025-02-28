import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { EffectSelector, AuraBuilder, TriggerBuilder, StepNavigation } from '../common';
import '../styles/spell-wizard.css';
import { getAllStatusEffects, getStatusEffectsByType } from '../../../data/statusEffects';
import { formatProcChance } from '../../../utils/diceUtils';

// Advanced spell behaviors (from original Step9Advanced)
const ADVANCED_BEHAVIORS = [
  { 
    id: 'interact_environment', 
    name: 'Environmental Interaction', 
    description: 'Spell interacts with terrain or environment',
    examples: ['Fire spell spreads in dry areas', 'Ice spell creates slippery surfaces', 'Lightning is enhanced in water'] 
  },
  { 
    id: 'combo_potential', 
    name: 'Combo Potential', 
    description: 'Spell can be combined with other abilities for enhanced effects',
    examples: ['Fireball explodes when hitting a grease spell', 'Lightning does bonus damage to wet targets', 'Physical damage increased against frozen enemies'] 
  },
  { 
    id: 'conditional_effect', 
    name: 'Conditional Effects', 
    description: 'Spell has different effects based on conditions',
    examples: ['Does more damage to low-health targets', 'Changes element based on time of day', 'Different effect based on enemy type'] 
  },
  { 
    id: 'resource_interaction', 
    name: 'Resource Interaction', 
    description: 'Spell interacts uniquely with resource systems',
    examples: ['Costs less when at low health', 'Generates extra resources on critical hits', 'Converts one resource type to another'] 
  },
  { 
    id: 'stance_interaction', 
    name: 'Stance/Form Interaction', 
    description: 'Spell behaves differently based on character stance or form',
    examples: ['Different effect in Bear Form', 'Enhanced while in Defensive Stance', 'Changed properties in Stealth'] 
  },
  { 
    id: 'charge_system', 
    name: 'Charge System', 
    description: 'Spell uses a charge-based system for casting',
    examples: ['Stores up to 3 charges', 'Charge regenerates every 10 seconds', 'All charges can be used in succession'] 
  },
  { 
    id: 'transformation_effect', 
    name: 'Transformation Mechanics', 
    description: 'Spell transforms the caster or target in meaningful ways',
    examples: ['Temporarily become ethereal', 'Transform into a beast with new abilities', 'Shrink in size to access new areas'] 
  },
  { 
    id: 'dynamic_scaling', 
    name: 'Dynamic Scaling', 
    description: 'Spell scales in unusual or dynamic ways',
    examples: ['More powerful at night', 'Scales with enemies in the area', 'Weakens as your health decreases'] 
  },
  { 
    id: 'terrain_modification', 
    name: 'Terrain Modification', 
    description: 'Spell permanently or temporarily changes the environment',
    examples: ['Create walls of ice', 'Burn away obstacles', 'Create traversable platforms'] 
  }
];

const Step5SecondaryEffects = () => {
  const { 
    spellData, 
    updateSpellData, 
    setStepValidation,
    nextStep,
    prevStep
  } = useSpellWizardStore();
  
  // Local state for effect selections
  const [selectedBuffs, setSelectedBuffs] = useState(spellData.buffs || []);
  const [selectedDebuffs, setSelectedDebuffs] = useState(spellData.debuffs || []);
  const [onHitTriggers, setOnHitTriggers] = useState(spellData.onHitTriggers || []);
  const [onDamageTriggers, setOnDamageTriggers] = useState(spellData.onDamageTriggers || []);
  const [auraEffects, setAuraEffects] = useState(spellData.auraEffects || []);
  const [selectedAdvancedBehaviors, setSelectedAdvancedBehaviors] = useState(spellData.advancedBehaviors || []);
  
  // UI State
  const [activeEffectTab, setActiveEffectTab] = useState('buffs');
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showAuraModal, setShowAuraModal] = useState(false);
  const [currentEditingTrigger, setCurrentEditingTrigger] = useState(null);
  const [currentEditingAura, setCurrentEditingAura] = useState(null);
  const [triggerType, setTriggerType] = useState('onHit');
  
  // Form state for trigger/aura editor
  const [triggerEffect, setTriggerEffect] = useState('');
  const [triggerChance, setTriggerChance] = useState(100);
  const [triggerDuration, setTriggerDuration] = useState(1);
  const [auraName, setAuraName] = useState('');
  const [auraEffect, setAuraEffect] = useState('');
  const [auraRange, setAuraRange] = useState(10);
  const [auraTarget, setAuraTarget] = useState('enemies'); // 'enemies', 'allies', 'all'
  
  // Get all status effects
  const allEffects = getAllStatusEffects();
  const buffEffects = getStatusEffectsByType('buff');
  const debuffEffects = getStatusEffectsByType('debuff');
  
  // Validation always valid for this step (optional step)
  const [isValid, setIsValid] = useState(true);
  useEffect(() => {
    setStepValidation(4, true);
    setIsValid(true); // This step is always valid since effects are optional
  }, [setStepValidation]);
  
  // Update spell data with current selections
  useEffect(() => {
    updateSpellData({
      buffs: selectedBuffs,
      debuffs: selectedDebuffs,
      onHitTriggers: onHitTriggers,
      onDamageTriggers: onDamageTriggers,
      auraEffects: auraEffects,
      advancedBehaviors: selectedAdvancedBehaviors
    });
  }, [
    selectedBuffs, 
    selectedDebuffs, 
    onHitTriggers, 
    onDamageTriggers, 
    auraEffects,
    selectedAdvancedBehaviors,
    updateSpellData
  ]);
  
  // Reset trigger modal when opened
  useEffect(() => {
    if (showTriggerModal && !currentEditingTrigger) {
      setTriggerEffect('');
      setTriggerChance(100);
      setTriggerDuration(1);
    }
  }, [showTriggerModal, currentEditingTrigger]);
  
  // Reset aura modal when opened
  useEffect(() => {
    if (showAuraModal && !currentEditingAura) {
      setAuraName('');
      setAuraEffect('');
      setAuraRange(10);
      setAuraTarget('enemies');
    }
  }, [showAuraModal, currentEditingAura]);
  
  // Load current editing trigger data
  useEffect(() => {
    if (currentEditingTrigger) {
      setTriggerEffect(currentEditingTrigger.effect);
      setTriggerChance(currentEditingTrigger.chance);
      setTriggerDuration(currentEditingTrigger.duration);
    }
  }, [currentEditingTrigger]);
  
  // Load current editing aura data
  useEffect(() => {
    if (currentEditingAura) {
      setAuraName(currentEditingAura.name);
      setAuraEffect(currentEditingAura.effect);
      setAuraRange(currentEditingAura.range);
      setAuraTarget(currentEditingAura.target);
    }
  }, [currentEditingAura]);
  
  // Toggle buff selection
  const toggleBuff = (buffId) => {
    setSelectedBuffs(prev => {
      if (prev.includes(buffId)) {
        return prev.filter(id => id !== buffId);
      } else {
        return [...prev, buffId];
      }
    });
  };
  
  // Toggle debuff selection
  const toggleDebuff = (debuffId) => {
    setSelectedDebuffs(prev => {
      if (prev.includes(debuffId)) {
        return prev.filter(id => id !== debuffId);
      } else {
        return [...prev, debuffId];
      }
    });
  };
  
  // Toggle advanced behavior
  const toggleAdvancedBehavior = (behaviorId) => {
    setSelectedAdvancedBehaviors(prev => {
      if (prev.includes(behaviorId)) {
        return prev.filter(id => id !== behaviorId);
      } else {
        return [...prev, behaviorId];
      }
    });
  };
  
  // Open trigger modal to add new trigger
  const openAddTriggerModal = (type) => {
    setTriggerType(type);
    setCurrentEditingTrigger(null);
    setShowTriggerModal(true);
  };
  
  // Open trigger modal to edit existing trigger
  const openEditTriggerModal = (trigger, type) => {
    setTriggerType(type);
    setCurrentEditingTrigger(trigger);
    setShowTriggerModal(true);
  };
  
  // Save trigger
  const saveTrigger = () => {
    if (!triggerEffect) return;
    
    const newTrigger = {
      id: currentEditingTrigger?.id || Date.now().toString(),
      effect: triggerEffect,
      chance: triggerChance,
      duration: triggerDuration
    };
    
    if (triggerType === 'onHit') {
      if (currentEditingTrigger) {
        // Update existing trigger
        setOnHitTriggers(prev => 
          prev.map(trigger => trigger.id === newTrigger.id ? newTrigger : trigger)
        );
      } else {
        // Add new trigger
        setOnHitTriggers(prev => [...prev, newTrigger]);
      }
    } else if (triggerType === 'onDamage') {
      if (currentEditingTrigger) {
        // Update existing trigger
        setOnDamageTriggers(prev => 
          prev.map(trigger => trigger.id === newTrigger.id ? newTrigger : trigger)
        );
      } else {
        // Add new trigger
        setOnDamageTriggers(prev => [...prev, newTrigger]);
      }
    }
    
    // Close modal
    setShowTriggerModal(false);
  };
  
  // Delete trigger
  const deleteTrigger = (triggerId, type) => {
    if (type === 'onHit') {
      setOnHitTriggers(prev => prev.filter(trigger => trigger.id !== triggerId));
    } else if (type === 'onDamage') {
      setOnDamageTriggers(prev => prev.filter(trigger => trigger.id !== triggerId));
    }
  };
  
  // Open aura modal to add new aura
  const openAddAuraModal = () => {
    setCurrentEditingAura(null);
    setShowAuraModal(true);
  };
  
  // Open aura modal to edit existing aura
  const openEditAuraModal = (aura) => {
    setCurrentEditingAura(aura);
    setShowAuraModal(true);
  };
  
  // Save aura
  const saveAura = () => {
    if (!auraName || !auraEffect) return;
    
    const newAura = {
      id: currentEditingAura?.id || Date.now().toString(),
      name: auraName,
      effect: auraEffect,
      range: auraRange,
      target: auraTarget
    };
    
    if (currentEditingAura) {
      // Update existing aura
      setAuraEffects(prev => 
        prev.map(aura => aura.id === newAura.id ? newAura : aura)
      );
    } else {
      // Add new aura
      setAuraEffects(prev => [...prev, newAura]);
    }
    
    // Close modal
    setShowAuraModal(false);
  };
  
  // Delete aura
  const deleteAura = (auraId) => {
    setAuraEffects(prev => prev.filter(aura => aura.id !== auraId));
  };
  
  // Handle trigger chance input
  const handleTriggerChanceChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setTriggerChance(value);
    }
  };
  
  // Handle trigger duration input
  const handleTriggerDurationChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTriggerDuration(value);
    }
  };
  
  // Handle aura range input
  const handleAuraRangeChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAuraRange(value);
    }
  };
  
  // Show suggested effects based on spell category and damage types
  const getSuggestedEffects = (effectType) => {
    const suggestions = [];
    
    // Add category-based suggestions
    if (spellData.category) {
      if (effectType === 'buff') {
        if (spellData.category === 'buff' || spellData.category === 'healing') {
          suggestions.push('regeneration', 'haste', 'protection', 'cleanse');
        }
      } else if (effectType === 'debuff') {
        if (spellData.category === 'debuff' || spellData.category === 'damage') {
          suggestions.push('slow', 'poison', 'weak', 'vulnerable');
        }
      }
    }
    
    // Add damage type-based suggestions
    if (spellData.damageTypes) {
      if (effectType === 'debuff') {
        if (spellData.damageTypes.includes('fire')) {
          suggestions.push('burning');
        }
        if (spellData.damageTypes.includes('frost')) {
          suggestions.push('slow', 'freeze');
        }
        if (spellData.damageTypes.includes('poison')) {
          suggestions.push('poison');
        }
        if (spellData.damageTypes.includes('shadow')) {
          suggestions.push('fear', 'sleep');
        }
      }
    }
    
    return [...new Set(suggestions)]; // Remove duplicates
  };
  
  // Get suggested buffs and debuffs
  const suggestedBuffs = getSuggestedEffects('buff');
  const suggestedDebuffs = getSuggestedEffects('debuff');
  
  return (
    <div className="secondary-effects-step">
      <div className="section">
        <h4 className="section-title">Secondary Effects</h4>
        <p className="section-description">
          Add buffs, debuffs, on-hit triggers, or aura effects to your spell.
        </p>
        
        <div className="effects-tabs">
          <button 
            className={`effect-tab ${activeEffectTab === 'buffs' ? 'active' : ''}`}
            onClick={() => setActiveEffectTab('buffs')}
          >
            Buffs
          </button>
          <button 
            className={`effect-tab ${activeEffectTab === 'debuffs' ? 'active' : ''}`}
            onClick={() => setActiveEffectTab('debuffs')}
          >
            Debuffs
          </button>
          <button 
            className={`effect-tab ${activeEffectTab === 'triggers' ? 'active' : ''}`}
            onClick={() => setActiveEffectTab('triggers')}
          >
            Triggers
          </button>
          <button 
            className={`effect-tab ${activeEffectTab === 'auras' ? 'active' : ''}`}
            onClick={() => setActiveEffectTab('auras')}
          >
            Auras
          </button>
          <button 
            className={`effect-tab ${activeEffectTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveEffectTab('advanced')}
          >
            Advanced
          </button>
        </div>
        
        <div className="effects-content">
          {/* Buffs Tab */}
          {activeEffectTab === 'buffs' && (
            <div className="buffs-tab">
              <p className="tab-description">
                Select beneficial effects that this spell applies to targets.
              </p>
              
              {suggestedBuffs.length > 0 && (
                <div className="suggested-effects">
                  <h5>Suggested Buffs:</h5>
                  <div className="effect-tags">
                    {suggestedBuffs.map(buffId => {
                      const buff = allEffects.find(e => e.id === buffId);
                      if (!buff) return null;
                      
                      return (
                        <div 
                          key={buffId}
                          className={`effect-tag ${selectedBuffs.includes(buffId) ? 'selected' : ''}`}
                          onClick={() => toggleBuff(buffId)}
                          style={{ backgroundColor: buff.color + '40' }}
                        >
                          {buff.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="effects-grid">
                {buffEffects.map(buff => (
                  <div 
                    key={buff.id}
                    className={`effect-option ${selectedBuffs.includes(buff.id) ? 'selected' : ''}`}
                    onClick={() => toggleBuff(buff.id)}
                    style={{ 
                      '--effect-color': buff.color,
                      borderColor: selectedBuffs.includes(buff.id) ? buff.color : 'transparent'
                    }}
                  >
                    <div className="effect-icon">
                      {buff.icon && <img src={buff.icon} alt={buff.name} />}
                    </div>
                    <div className="effect-info">
                      <div className="effect-name" style={{ color: buff.color }}>{buff.name}</div>
                      <div className="effect-description">{buff.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedBuffs.length === 0 && (
                <div className="empty-selection-message">
                  No buffs selected. Click on buffs above to add them to your spell.
                </div>
              )}
              
              {selectedBuffs.length > 0 && (
                <div className="selected-effects">
                  <h5>Selected Buffs:</h5>
                  <div className="selected-list">
                    {selectedBuffs.map(buffId => {
                      const buff = allEffects.find(e => e.id === buffId);
                      if (!buff) return null;
                      
                      return (
                        <div key={buffId} className="selected-item">
                          <span style={{ color: buff.color }}>{buff.name}</span>
                          <button 
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBuff(buffId);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Debuffs Tab */}
          {activeEffectTab === 'debuffs' && (
            <div className="debuffs-tab">
              <p className="tab-description">
                Select negative effects that this spell applies to targets.
              </p>
              
              {suggestedDebuffs.length > 0 && (
                <div className="suggested-effects">
                  <h5>Suggested Debuffs:</h5>
                  <div className="effect-tags">
                    {suggestedDebuffs.map(debuffId => {
                      const debuff = allEffects.find(e => e.id === debuffId);
                      if (!debuff) return null;
                      
                      return (
                        <div 
                          key={debuffId}
                          className={`effect-tag ${selectedDebuffs.includes(debuffId) ? 'selected' : ''}`}
                          onClick={() => toggleDebuff(debuffId)}
                          style={{ backgroundColor: debuff.color + '40' }}
                        >
                          {debuff.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="effects-grid">
                {debuffEffects.map(debuff => (
                  <div 
                    key={debuff.id}
                    className={`effect-option ${selectedDebuffs.includes(debuff.id) ? 'selected' : ''}`}
                    onClick={() => toggleDebuff(debuff.id)}
                    style={{ 
                      '--effect-color': debuff.color,
                      borderColor: selectedDebuffs.includes(debuff.id) ? debuff.color : 'transparent'
                    }}
                  >
                    <div className="effect-icon">
                      {debuff.icon && <img src={debuff.icon} alt={debuff.name} />}
                    </div>
                    <div className="effect-info">
                      <div className="effect-name" style={{ color: debuff.color }}>{debuff.name}</div>
                      <div className="effect-description">{debuff.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedDebuffs.length === 0 && (
                <div className="empty-selection-message">
                  No debuffs selected. Click on debuffs above to add them to your spell.
                </div>
              )}
              
              {selectedDebuffs.length > 0 && (
                <div className="selected-effects">
                  <h5>Selected Debuffs:</h5>
                  <div className="selected-list">
                    {selectedDebuffs.map(debuffId => {
                      const debuff = allEffects.find(e => e.id === debuffId);
                      if (!debuff) return null;
                      
                      return (
                        <div key={debuffId} className="selected-item">
                          <span style={{ color: debuff.color }}>{debuff.name}</span>
                          <button 
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDebuff(debuffId);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Triggers Tab */}
          {activeEffectTab === 'triggers' && (
            <div className="triggers-tab">
              <p className="tab-description">
                Add effects that trigger when specific conditions are met.
              </p>
              
              <div className="triggers-sections">
                <div className="trigger-section">
                  <h5>On-Hit Triggers</h5>
                  <p>These effects have a chance to trigger when the spell hits its target.</p>
                  
                  <button 
                    className="add-trigger-btn"
                    onClick={() => openAddTriggerModal('onHit')}
                  >
                    + Add On-Hit Effect
                  </button>
                  
                  {onHitTriggers.length > 0 ? (
                    <div className="trigger-list">
                      {onHitTriggers.map(trigger => (
                        <div key={trigger.id} className="trigger-item">
                          <div className="trigger-details">
                            <div className="trigger-header">
                              {trigger.chance < 100 ? (
                                <span className="trigger-chance">
                                  {trigger.chance}% chance:
                                </span>
                              ) : (
                                <span className="trigger-always">
                                  Always:
                                </span>
                              )}
                            </div>
                            <div className="trigger-effect">{trigger.effect}</div>
                            {trigger.duration > 0 && (
                              <div className="trigger-duration">
                                Lasts {trigger.duration} {trigger.duration === 1 ? 'round' : 'rounds'}
                              </div>
                            )}
                          </div>
                          <div className="trigger-actions">
                            <button 
                              className="edit-btn"
                              onClick={() => openEditTriggerModal(trigger, 'onHit')}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteTrigger(trigger.id, 'onHit')}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-triggers">
                      No on-hit triggers added.
                    </div>
                  )}
                </div>
                
                <div className="trigger-section">
                  <h5>On-Damage Triggers</h5>
                  <p>These effects have a chance to trigger when the target takes damage.</p>
                  
                  <button 
                    className="add-trigger-btn"
                    onClick={() => openAddTriggerModal('onDamage')}
                  >
                    + Add On-Damage Effect
                  </button>
                  
                  {onDamageTriggers.length > 0 ? (
                    <div className="trigger-list">
                      {onDamageTriggers.map(trigger => (
                        <div key={trigger.id} className="trigger-item">
                          <div className="trigger-details">
                            <div className="trigger-header">
                              {trigger.chance < 100 ? (
                                <span className="trigger-chance">
                                  {trigger.chance}% chance:
                                </span>
                              ) : (
                                <span className="trigger-always">
                                  Always:
                                </span>
                              )}
                            </div>
                            <div className="trigger-effect">{trigger.effect}</div>
                            {trigger.duration > 0 && (
                              <div className="trigger-duration">
                                Lasts {trigger.duration} {trigger.duration === 1 ? 'round' : 'rounds'}
                              </div>
                            )}
                          </div>
                          <div className="trigger-actions">
                            <button 
                              className="edit-btn"
                              onClick={() => openEditTriggerModal(trigger, 'onDamage')}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteTrigger(trigger.id, 'onDamage')}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-triggers">
                      No on-damage triggers added.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Auras Tab */}
          {activeEffectTab === 'auras' && (
            <div className="auras-tab">
              <p className="tab-description">
                Create aura effects that affect an area around the target.
              </p>
              
              <button 
                className="add-aura-btn"
                onClick={openAddAuraModal}
              >
                + Add Aura Effect
              </button>
              
              {auraEffects.length > 0 ? (
                <div className="aura-list">
                  {auraEffects.map(aura => (
                    <div key={aura.id} className="aura-item">
                      <div className="aura-details">
                        <div className="aura-name">{aura.name}</div>
                        <div className="aura-effect">{aura.effect}</div>
                        <div className="aura-properties">
                          <span className="aura-range">Range: {aura.range} ft</span>
                          <span className="aura-target">
                            Affects: {aura.target === 'all' ? 'All creatures' : 
                                      aura.target === 'allies' ? 'Allies only' : 
                                      'Enemies only'}
                          </span>
                        </div>
                      </div>
                      <div className="aura-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => openEditAuraModal(aura)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteAura(aura.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-auras">
                  No aura effects added.
                </div>
              )}
            </div>
          )}
          
          {/* Advanced Behaviors Tab */}
          {activeEffectTab === 'advanced' && (
            <div className="advanced-tab">
              <p className="tab-description">
                Add complex behaviors and special interactions to your spell.
              </p>
              
              <div className="behaviors-container">
                {ADVANCED_BEHAVIORS.map(behavior => (
                  <div 
                    key={behavior.id}
                    className={`behavior-option ${selectedAdvancedBehaviors.includes(behavior.id) ? 'selected' : ''}`}
                    onClick={() => toggleAdvancedBehavior(behavior.id)}
                  >
                    <div className="behavior-name">{behavior.name}</div>
                    <div className="behavior-description">{behavior.description}</div>
                    <div className="behavior-examples">
                      <span>Examples: </span>
                      {behavior.examples.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Trigger Modal */}
      {showTriggerModal && (
        <div className="modal-overlay" onClick={() => setShowTriggerModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
            <h3>{currentEditingTrigger ? 'Edit Trigger' : 'Add Trigger'}</h3>
              <button className="close-modal-btn" onClick={() => setShowTriggerModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Trigger Type:</label>
                <div className="trigger-type-display">
                  {triggerType === 'onHit' ? 'On-Hit Trigger' : 'On-Damage Trigger'}
                </div>
              </div>
              
              <div className="form-group">
                <label>Effect Description:</label>
                <textarea 
                  value={triggerEffect}
                  onChange={(e) => setTriggerEffect(e.target.value)}
                  placeholder="Describe the effect (e.g., 'Target is stunned')"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Trigger Chance:</label>
                <div className="chance-input">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={triggerChance}
                    onChange={handleTriggerChanceChange}
                  />
                  <span className="unit">%</span>
                </div>
                {triggerChance < 100 && (
                  <div className="chance-explanation">
                    {formatProcChance(triggerChance)}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Effect Duration (rounds):</label>
                <input
                  type="number"
                  min="0"
                  value={triggerDuration}
                  onChange={handleTriggerDurationChange}
                />
                <div className="duration-hint">
                  0 = instantaneous effect
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowTriggerModal(false)}>Cancel</button>
              <button 
                className="save-btn"
                onClick={saveTrigger}
                disabled={!triggerEffect}
              >
                {currentEditingTrigger ? 'Update' : 'Add'} Trigger
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Aura Modal */}
      {showAuraModal && (
        <div className="modal-overlay" onClick={() => setShowAuraModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentEditingAura ? 'Edit Aura' : 'Add Aura'}</h3>
              <button className="close-modal-btn" onClick={() => setShowAuraModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Aura Name:</label>
                <input 
                  type="text"
                  value={auraName}
                  onChange={(e) => setAuraName(e.target.value)}
                  placeholder="Name of the aura (e.g., 'Aura of Might')"
                />
              </div>
              
              <div className="form-group">
                <label>Aura Effect:</label>
                <textarea 
                  value={auraEffect}
                  onChange={(e) => setAuraEffect(e.target.value)}
                  placeholder="Describe the effect (e.g., 'Allies gain +2 to attack rolls')"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Aura Range (feet):</label>
                <input
                  type="number"
                  min="1"
                  value={auraRange}
                  onChange={handleAuraRangeChange}
                />
              </div>
              
              <div className="form-group">
                <label>Affects:</label>
                <div className="aura-target-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="auraTarget"
                      value="enemies"
                      checked={auraTarget === 'enemies'}
                      onChange={() => setAuraTarget('enemies')}
                    />
                    Enemies Only
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="auraTarget"
                      value="allies"
                      checked={auraTarget === 'allies'}
                      onChange={() => setAuraTarget('allies')}
                    />
                    Allies Only
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="auraTarget"
                      value="all"
                      checked={auraTarget === 'all'}
                      onChange={() => setAuraTarget('all')}
                    />
                    All Creatures
                  </label>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAuraModal(false)}>Cancel</button>
              <button 
                className="save-btn"
                onClick={saveAura}
                disabled={!auraName || !auraEffect}
              >
                {currentEditingAura ? 'Update' : 'Add'} Aura
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Advanced Behavior Details Panel */}
      {selectedAdvancedBehaviors.length > 0 && (
        <div className="section">
          <h4 className="section-title">Selected Advanced Behaviors</h4>
          <p className="section-description">
            You've selected the following special behaviors for your spell:
          </p>
          
          <div className="selected-behaviors-list">
            {selectedAdvancedBehaviors.map(behaviorId => {
              const behavior = ADVANCED_BEHAVIORS.find(b => b.id === behaviorId);
              if (!behavior) return null;
              
              return (
                <div key={behaviorId} className="selected-behavior">
                  <h5>{behavior.name}</h5>
                  <p>{behavior.description}</p>
                  <div className="behavior-examples">
                    <span>Examples: </span>
                    {behavior.examples.join(', ')}
                  </div>
                  <button 
                    className="remove-behavior-btn"
                    onClick={() => toggleAdvancedBehavior(behaviorId)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Suggestions Based on Spell Type */}
      <div className="section effect-suggestions">
        <h4 className="section-title">Effect Recommendations</h4>
        <p className="section-description">
          Based on your spell's type and properties, here are some recommended combinations:
        </p>
        
        <div className="recommendation-cards">
          {/* Damage Spell Recommendations */}
          {spellData.category === 'damage' && (
            <div className="recommendation-card">
              <h5>For Damage Spells:</h5>
              <ul>
                <li>
                  <strong>Direct Damage:</strong> Add a short debuff like "Weakened" to reduce enemy effectiveness
                </li>
                <li>
                  <strong>AoE Damage:</strong> Consider "Terrain Modification" to leave damaging areas
                </li>
                <li>
                  <strong>DoT Spells:</strong> Pair with "Conditional Effects" to deal extra damage to low health targets
                </li>
              </ul>
            </div>
          )}
          
          {/* Healing Spell Recommendations */}
          {spellData.category === 'healing' && (
            <div className="recommendation-card">
              <h5>For Healing Spells:</h5>
              <ul>
                <li>
                  <strong>Direct Healing:</strong> Add a short protective buff to increase effectiveness
                </li>
                <li>
                  <strong>HoT Spells:</strong> Consider adding "Aura" effects to heal nearby allies
                </li>
                <li>
                  <strong>Reactive Healing:</strong> Use "On-Damage Triggers" to provide automatic responses
                </li>
              </ul>
            </div>
          )}
          
          {/* Utility Spell Recommendations */}
          {spellData.category === 'utility' && (
            <div className="recommendation-card">
              <h5>For Utility Spells:</h5>
              <ul>
                <li>
                  <strong>Movement Spells:</strong> Add "Environmental Interaction" for more tactical options
                </li>
                <li>
                  <strong>Control Spells:</strong> Consider "Dynamic Scaling" based on target stats
                </li>
                <li>
                  <strong>Transformation Spells:</strong> Use "Terrain Modification" to create passage ways
                </li>
              </ul>
            </div>
          )}
          
          {/* General Recommendations */}
          <div className="recommendation-card">
            <h5>General Tips:</h5>
            <ul>
              <li>
                <strong>Class Synergy:</strong> Choose effects that complement your class abilities
              </li>
              <li>
                <strong>Resource Management:</strong> Consider "Resource Interaction" for efficient spell usage
              </li>
              <li>
                <strong>Versatility:</strong> Mix defensive and offensive effects for adaptability
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <StepNavigation 
        currentStep={4} 
        totalSteps={8} 
        onNext={nextStep} 
        onPrev={prevStep} 
        isNextEnabled={isValid}
      />
    </div>
  );
};

export default Step5SecondaryEffects;