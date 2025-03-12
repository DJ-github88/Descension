import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { SpellPreview } from '../common';
import SpellTypeSpecificSettings from '../common/SpellTypeSpecificSettings';
import '../styles/Pages/wizard-steps.css';
import '../styles/Layout/wizard-layout.css';
import '../styles/Components/preview-card.css';

// Arcane resources
const ARCANE_RESOURCES = [
  { id: 'mana', name: 'Mana', icon: 'inv_elemental_mote_mana', color: '#0070dd', description: 'Magical energy that powers spells', regenRate: '5 per round' },
  { id: 'spirit', name: 'Spirit', icon: 'spell_holy_divinespirit', color: '#8a2be2', description: 'Divine or natural magical essence', regenRate: '4 per round' },
  { id: 'health', name: 'Health', icon: 'inv_alchemy_elixir_05', color: '#ff5555', description: 'Life force that can power desperate spells', regenRate: '0 per round' }
];

// Physical resources
const MARTIAL_RESOURCES = [
  { id: 'action_points', name: 'Action Points', icon: 'ability_warrior_battleshout', color: '#c69b00', description: 'Physical energy used for combat abilities', regenRate: '3 per round' },
  { id: 'energy', name: 'Energy', icon: 'spell_nature_earthbindtotem', color: '#ffff00', description: 'Swift movement and agile abilities', regenRate: '5 per round' },
  { id: 'stamina', name: 'Stamina', icon: 'ability_warrior_endlessrage', color: '#ff8c00', description: 'Endurance used for sustained physical abilities', regenRate: '2 per round' }
];

// Class-specific resources
const CLASS_RESOURCES = [
  { id: 'rage', name: 'Rage', icon: 'ability_warrior_innerrage', color: '#ff0000', description: 'Fury generated in combat, powers devastating attacks', regenRate: '3 when damaged' },
  { id: 'focus', name: 'Focus', icon: 'ability_hunter_mastermarksman', color: '#d2ae6d', description: 'Concentration that enables precise attacks', regenRate: '2 per round' },
  { id: 'soul_fragments', name: 'Soul Fragments', icon: 'spell_shadow_soulgem', color: '#8a2be2', description: 'Pieces of enemy souls that power dark magic', regenRate: '1 on kill' },
  { id: 'arcane_charges', name: 'Arcane Charges', icon: 'spell_arcane_arcane03', color: '#69ccf0', description: 'Accumulated magical energy that enhances spells', regenRate: '1 per arcane spell' }
];

// Cooldown categories
const COOLDOWN_CATEGORIES = [
  { id: 'none', name: 'No Cooldown', icon: 'spell_mage_presenceofmind', description: 'Can be used every round without restriction', examples: 'Basic attacks, cantrips' },
  { id: 'rounds', name: 'Combat Rounds', icon: 'ability_warrior_challange', description: 'Must wait a specific number of rounds before using again', examples: 'Most combat abilities' },
  { id: 'encounter', name: 'Once Per Encounter', icon: 'spell_arcane_arcanepotency', description: 'Can only be used once per combat encounter', examples: 'Powerful abilities, limited spells' },
  { id: 'short_rest', name: 'Short Rest', icon: 'spell_holy_borrowedtime', description: 'Refreshes after a short rest (1 hour)', examples: 'Significant abilities, class features' },
  { id: 'long_rest', name: 'Long Rest', icon: 'inv_misc_pocketwatch_01', description: 'Can only be used once per day (long rest)', examples: 'Most powerful abilities, high-level spells' }
];

// Casting components
const CASTING_COMPONENTS = [
  { id: 'verbal', name: 'Verbal', icon: 'spell_holy_silence', description: 'Requires speaking incantations aloud', counters: 'Silenced, underwater, etc.' },
  { id: 'somatic', name: 'Somatic', icon: 'ability_monk_paralysis', description: 'Requires precise hand gestures', counters: 'Bound, restrained, etc.' },
  { id: 'material', name: 'Material', icon: 'inv_misc_gem_variety_01', description: 'Requires physical components or a focus', counters: 'Disarmed, no components' }
];

const Step2CastingMechanics = () => {
  const { spellData, updateSpellData, setStepValidation } = useSpellWizardStore();
  
  // Get the spell type from Step 1
  const spellType = spellData.spellType || 'active';
  
  // Step progress tracking
  const [currentSubstep, setCurrentSubstep] = useState(1);
  const totalSubsteps = 4;
  
  // Resource selection and costs
  const [resourceCosts, setResourceCosts] = useState(spellData.resourceCosts || {});
  const [editingResource, setEditingResource] = useState(null);
  
  // Cooldown settings
  const [cooldownCategory, setCooldownCategory] = useState(spellData.cooldownCategory || 'rounds');
  const [cooldownValue, setCooldownValue] = useState(spellData.cooldownValue || 2);
  
  // Casting requirements
  const [castingComponents, setCastingComponents] = useState(spellData.castingComponents || []);
  const [materialComponents, setMaterialComponents] = useState(spellData.materialComponents || '');
  const [materialCost, setMaterialCost] = useState(spellData.materialCost || '');
  const [materialConsumed, setMaterialConsumed] = useState(spellData.materialConsumed || false);
  
  // Spell type specific settings
  const [spellTypeSettings, setSpellTypeSettings] = useState({});
  
  // Validate the current step
  useEffect(() => {
    const isValid = validateStep();
    setStepValidation(1, isValid);
  }, [
    resourceCosts,
    spellType,
    cooldownCategory,
    cooldownValue,
    spellTypeSettings
  ]);

  const validateStep = () => {
    // Basic validation rules
    if (Object.keys(resourceCosts).length === 0) return false;
    
    // Additional validation based on spell type
    if (spellType === 'reaction' && (!spellTypeSettings.reactiveTrigger || (spellTypeSettings.reactiveTrigger === 'custom' && !spellTypeSettings.customTriggerDescription))) return false;
    if (spellType === 'channeled' && (!spellTypeSettings.channelMaxRounds || spellTypeSettings.channelMaxRounds < 1)) return false;
    
    return true;
  };

  // Handle substep navigation
  const handleNext = () => {
    if (currentSubstep < totalSubsteps) {
      setCurrentSubstep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSubstep > 1) {
      setCurrentSubstep(prev => prev - 1);
    }
  };

  // Update spell data when form values change
  useEffect(() => {
    const updatedSpellData = {
      resourceCosts,
      cooldownCategory,
      cooldownValue,
      castingComponents,
      materialComponents,
      materialCost,
      materialConsumed,
      ...spellTypeSettings
    };
    
    updateSpellData(updatedSpellData);
  }, [
    resourceCosts,
    cooldownCategory,
    cooldownValue,
    castingComponents,
    materialComponents,
    materialCost,
    materialConsumed,
    spellTypeSettings,
    updateSpellData
  ]);
  
  // Initialize from existing data if available
  useEffect(() => {
    // Initialize common properties
    if (spellData.resourceCosts) {
      setResourceCosts(spellData.resourceCosts);
    }
    
    if (spellData.cooldownCategory) {
      setCooldownCategory(spellData.cooldownCategory);
    }
    
    if (spellData.cooldownValue) {
      setCooldownValue(spellData.cooldownValue);
    }
    
    if (spellData.castingComponents) {
      setCastingComponents(spellData.castingComponents);
    }
    
    if (spellData.materialComponents) {
      setMaterialComponents(spellData.materialComponents);
    }
    
    if (spellData.materialCost) {
      setMaterialCost(spellData.materialCost);
    }
    
    if (spellData.materialConsumed !== undefined) {
      setMaterialConsumed(spellData.materialConsumed);
    }
  }, [spellData]);

  // Resource selection handlers
  const toggleResource = (resourceId, resourceType) => {
    if (editingResource === resourceId) {
      return; // Don't toggle when editing the input field
    }
    
    setResourceCosts(prev => {
      const updated = { ...prev };
      
      if (updated[resourceId]) {
        delete updated[resourceId];
      } else {
        // Set default amounts based on resource type
        let defaultAmount = 20;
        
        if (resourceId === 'action_points') {
          // Default action point cost based on spell type
          switch(spellType) {
            case 'active': defaultAmount = 2; break;
            case 'passive': defaultAmount = 0; break;
            case 'channeled': defaultAmount = 3; break;
            case 'reaction': defaultAmount = 1; break;
            case 'ultimate': defaultAmount = 4; break;
            case 'ritual': defaultAmount = 5; break;
            default: defaultAmount = 2;
          }
        } else if (resourceId === 'health') {
          defaultAmount = 10; // Health costs should be lower by default
        } else if (['rage', 'focus', 'soul_fragments', 'arcane_charges'].includes(resourceId)) {
          defaultAmount = 15; // Class resources often have different scaling
        }
        
        updated[resourceId] = { baseAmount: defaultAmount };
      }
      
      return updated;
    });
  };
  
  const updateResourceCost = (resourceId, value) => {
    setResourceCosts(prev => ({
      ...prev,
      [resourceId]: { ...prev[resourceId], baseAmount: parseInt(value) || 0 }
    }));
  };
  
  // Toggle casting component requirement
  const toggleComponent = (componentId) => {
    setCastingComponents(prev => {
      if (prev.includes(componentId)) {
        return prev.filter(id => id !== componentId);
      } else {
        return [...prev, componentId];
      }
    });
  };
  
  // Handle spell type specific settings update
  const handleSpellTypeSettingsUpdate = (updatedSettings) => {
    setSpellTypeSettings(prev => ({
      ...prev,
      ...updatedSettings
    }));
  };
  
  // Navigation between substeps
  const goToNextSubstep = () => {
    setCurrentSubstep(prev => Math.min(prev + 1, totalSubsteps));
  };
  
  const goToPrevSubstep = () => {
    setCurrentSubstep(prev => Math.max(prev - 1, 1));
  };
  
  // Get spell type name
  const getSpellTypeName = (typeId) => {
    const typeMap = {
      'active': 'Active Ability',
      'passive': 'Passive Ability',
      'channeled': 'Channeled Ability',
      'reaction': 'Reaction',
      'ultimate': 'Ultimate Ability',
      'ritual': 'Ritual'
    };
    
    return typeMap[typeId] || typeId;
  };
  
  // Format cooldown display
  const formatCooldownDisplay = () => {
    switch (cooldownCategory) {
      case 'none':
        return 'None (can be used every round)';
      case 'rounds':
        return `${cooldownValue} ${cooldownValue === 1 ? 'round' : 'rounds'}`;
      case 'encounter':
        return 'Once per encounter';
      case 'short_rest':
        return 'Once per short rest (1 hour)';
      case 'long_rest':
        return 'Once per long rest (8 hours)';
      default:
        return cooldownCategory;
    }
  };

  // Render the current substep content
  const renderSubstepContent = () => {
    switch (currentSubstep) {
      case 1:
        return (
          <div className="substep">
            <SpellTypeSpecificSettings 
              spellType={spellType}
              spellData={spellData}
              onUpdate={handleSpellTypeSettingsUpdate}
            />
          </div>
        );
        
      case 2:
        return (
          <div className="substep resource-selection">
            <p className="section-description">
              Choose which resources this spell will consume when cast. Resource costs affect how frequently a spell can be used and its overall power.
            </p>
            
            <div className="section">
              <h5 className="subsection-title">Arcane Resources</h5>
              <div className="resource-grid">
                {ARCANE_RESOURCES.map(resource => (
                  <div 
                    key={resource.id}
                    className={`resource-option ${resourceCosts[resource.id] ? 'selected' : ''}`}
                    onClick={() => toggleResource(resource.id, 'arcane')}
                    style={{ borderColor: resourceCosts[resource.id] ? resource.color : 'transparent' }}
                  >
                    <div className="resource-option-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${resource.icon}.jpg`} alt={resource.name} />
                    </div>
                    <div className="resource-option-info">
                      <div className="resource-option-name" style={{ color: resource.color }}>{resource.name}</div>
                      <div className="resource-option-description">{resource.description}</div>
                      <div className="resource-option-description">Regen: {resource.regenRate}</div>
                    </div>
                    
                    {resourceCosts[resource.id] && (
                      <div className="resource-cost-input" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="number" 
                          min="0" 
                          value={resourceCosts[resource.id].baseAmount || 0}
                          onChange={(e) => updateResourceCost(resource.id, e.target.value)}
                          onFocus={() => setEditingResource(resource.id)}
                          onBlur={() => setEditingResource(null)}
                        />
                        <span>Cost</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="section">
              <h5 className="subsection-title">Martial Resources</h5>
              <div className="resource-grid">
                {MARTIAL_RESOURCES.map(resource => (
                  <div 
                    key={resource.id}
                    className={`resource-option ${resourceCosts[resource.id] ? 'selected' : ''}`}
                    onClick={() => toggleResource(resource.id, 'martial')}
                    style={{ borderColor: resourceCosts[resource.id] ? resource.color : 'transparent' }}
                  >
                    <div className="resource-option-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${resource.icon}.jpg`} alt={resource.name} />
                    </div>
                    <div className="resource-option-info">
                      <div className="resource-option-name" style={{ color: resource.color }}>{resource.name}</div>
                      <div className="resource-option-description">{resource.description}</div>
                      <div className="resource-option-description">Regen: {resource.regenRate}</div>
                    </div>
                    
                    {resourceCosts[resource.id] && (
                      <div className="resource-cost-input" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="number" 
                          min="0" 
                          value={resourceCosts[resource.id].baseAmount || 0}
                          onChange={(e) => updateResourceCost(resource.id, e.target.value)}
                          onFocus={() => setEditingResource(resource.id)}
                          onBlur={() => setEditingResource(null)}
                        />
                        <span>Cost</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="section">
              <h5 className="subsection-title">Class-Specific Resources</h5>
              <div className="resource-grid">
                {CLASS_RESOURCES.map(resource => (
                  <div 
                    key={resource.id}
                    className={`resource-option ${resourceCosts[resource.id] ? 'selected' : ''}`}
                    onClick={() => toggleResource(resource.id, 'class')}
                    style={{ borderColor: resourceCosts[resource.id] ? resource.color : 'transparent' }}
                  >
                    <div className="resource-option-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${resource.icon}.jpg`} alt={resource.name} />
                    </div>
                    <div className="resource-option-info">
                      <div className="resource-option-name" style={{ color: resource.color }}>{resource.name}</div>
                      <div className="resource-option-description">{resource.description}</div>
                      <div className="resource-option-description">Regen: {resource.regenRate}</div>
                    </div>
                    
                    {resourceCosts[resource.id] && (
                      <div className="resource-cost-input" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="number" 
                          min="0" 
                          value={resourceCosts[resource.id].baseAmount || 0}
                          onChange={(e) => updateResourceCost(resource.id, e.target.value)}
                          onFocus={() => setEditingResource(resource.id)}
                          onBlur={() => setEditingResource(null)}
                        />
                        <span>Cost</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="substep cooldown">
            <p className="section-description">
              Define how frequently your spell can be cast. Cooldowns balance powerful abilities and establish a rhythm to gameplay.
            </p>
            
            <div className="section">
              <h5 className="subsection-title">Cooldown Type</h5>
              <div className="cooldown-options-grid">
                {COOLDOWN_CATEGORIES.map(category => (
                  <div 
                    key={category.id}
                    className={`cooldown-option ${cooldownCategory === category.id ? 'selected' : ''}`}
                    onClick={() => setCooldownCategory(category.id)}
                  >
                    <div className="cooldown-option-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${category.icon}.jpg`} alt={category.name} />
                    </div>
                    <div className="cooldown-option-info">
                      <div className="cooldown-option-name">{category.name}</div>
                      <div className="cooldown-option-description">{category.description}</div>
                      <div className="cooldown-option-description">Examples: {category.examples}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cooldown Value (only shown for round-based cooldowns) */}
            {cooldownCategory === 'rounds' && (
              <div className="section">
                <h5 className="subsection-title">Cooldown Duration (in rounds)</h5>
                <div className="cooldown-duration">
                  <div className="cooldown-input-container">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={cooldownValue}
                      onChange={(e) => setCooldownValue(parseInt(e.target.value) || 1)}
                      className="cooldown-input"
                    />
                    <span className="rounds-label">rounds</span>
                  </div>
                  <p className="input-description">
                    How many combat rounds must pass before this ability can be used again. Each round represents approximately 6 seconds of in-game time.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="substep components">
            <p className="section-description">
              Define what components are required to cast this spell. Components add flavor and tactical considerations to spell casting.
            </p>
            
            <div className="section">
              <h5 className="subsection-title">Required Components</h5>
              <div className="resource-grid">
                {CASTING_COMPONENTS.map(component => (
                  <div 
                    key={component.id}
                    className={`resource-option ${castingComponents.includes(component.id) ? 'selected' : ''}`}
                    onClick={() => toggleComponent(component.id)}
                  >
                    <div className="resource-option-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${component.icon}.jpg`} alt={component.name} />
                    </div>
                    <div className="resource-option-info">
                      <div className="resource-option-name">{component.name}</div>
                      <div className="resource-option-description">{component.description}</div>
                      <div className="resource-option-description">Countered when: {component.counters}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Material components details (only when material is selected) */}
            {castingComponents.includes('material') && (
              <div className="section">
                <h5 className="subsection-title">Material Component Details</h5>
                <div className="material-components">
                  <div className="name-input">
                    <label>Material Description</label>
                    <input
                      type="text"
                      placeholder="e.g., A pinch of iron powder, a piece of amber, etc."
                      value={materialComponents}
                      onChange={(e) => setMaterialComponents(e.target.value)}
                      className="spell-name-input"
                    />
                  </div>
                  
                  <div className="name-input">
                    <label>Cost (if any)</label>
                    <input
                      type="text"
                      placeholder="e.g., 50 gold, None, etc."
                      value={materialCost}
                      onChange={(e) => setMaterialCost(e.target.value)}
                      className="spell-name-input"
                    />
                  </div>
                  
                  <div className="checkbox-container">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={materialConsumed}
                        onChange={() => setMaterialConsumed(!materialConsumed)}
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-label">Material components are consumed when cast</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Casting Mechanics Summary */}
            <div className="resource-summary">
              <h5 className="subsection-title">Casting Mechanics Summary</h5>
              <div className="summary-grid">
                <div className="summary-row">
                  <div className="summary-label">Resources:</div>
                  <div className="summary-value">
                    {Object.entries(resourceCosts)
                      .map(([id, data]) => {
                        const allResources = [...ARCANE_RESOURCES, ...MARTIAL_RESOURCES, ...CLASS_RESOURCES];
                        const resource = allResources.find(r => r.id === id);
                        return resource ? `${data.baseAmount} ${resource.name}` : null;
                      })
                      .filter(Boolean)
                      .join(', ')}
                    {Object.keys(resourceCosts).length === 0 && 'None'}
                  </div>
                </div>
                
                <div className="summary-row">
                  <div className="summary-label">Ability Type:</div>
                  <div className="summary-value">
                    {getSpellTypeName(spellType)}
                    {spellType === 'channeled' && spellTypeSettings.channelMaxRounds && ` (${spellTypeSettings.channelMaxRounds} rounds)`}
                    {spellType === 'reaction' && spellTypeSettings.reactiveTrigger && ` - ${spellTypeSettings.reactiveTrigger}`}
                  </div>
                </div>
                
                <div className="summary-row">
                  <div className="summary-label">Cooldown:</div>
                  <div className="summary-value">{formatCooldownDisplay()}</div>
                </div>
                
                <div className="summary-row">
                  <div className="summary-label">Components:</div>
                  <div className="summary-value">
                    {castingComponents.length > 0 
                      ? castingComponents.map(id => 
                          CASTING_COMPONENTS.find(c => c.id === id)?.name
                        ).join(', ')
                      : 'None'}
                    {castingComponents.includes('material') && materialComponents && ` (${materialComponents}${materialCost ? `, ${materialCost}` : ''}${materialConsumed ? ', consumed' : ''})`}
                  </div>
                </div>
                
                <div className="summary-row">
                  <div className="summary-label">Concentration:</div>
                  <div className="summary-value">{spellTypeSettings.requiresConcentration ? 'Required' : 'Not required'}</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="wizard-layout">
      <div className="wizard-main-content">
        <div className="resource-system-step">
          <h4 className="section-title">
            <img 
              src="https://wow.zamimg.com/images/wow/icons/medium/spell_holy_greaterheal.jpg" 
              alt="" 
              className="section-icon" 
            />
            Casting Mechanics
          </h4>
          
          {/* Current Spell Type Indicator */}
          <div className="spell-type-indicator">
            <h5>
              <img 
                src={`https://wow.zamimg.com/images/wow/icons/medium/${
                  {
                    'active': 'spell_holy_greaterheal',
                    'passive': 'spell_holy_devotionaura',
                    'channeled': 'spell_arcane_mindmastery',
                    'reaction': 'ability_warrior_revenge',
                    'ultimate': 'spell_arcane_arcane03',
                    'ritual': 'spell_shadow_demonicempathy'
                  }[spellType] || 'inv_misc_questionmark'
                }.jpg`} 
                alt="" 
                className="section-icon-small" 
              />
              {getSpellTypeName(spellType)} Configuration
            </h5>
            <p className="section-description">
              Configuring casting mechanics for your {getSpellTypeName(spellType).toLowerCase()}.
            </p>
          </div>
          
          {/* Substep Progress Indicator */}
          <div className="substep-progress">
            <div className="substep-indicators">
              {Array.from({ length: totalSubsteps }, (_, i) => (
                <div 
                  key={i} 
                  className={`substep-indicator ${currentSubstep > i ? 'completed' : ''} ${currentSubstep === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentSubstep(i + 1)}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="substep-labels">
              <div className={`substep-label ${currentSubstep === 1 ? 'active' : ''}`}>Spell Settings</div>
              <div className={`substep-label ${currentSubstep === 2 ? 'active' : ''}`}>Resources</div>
              <div className={`substep-label ${currentSubstep === 3 ? 'active' : ''}`}>Cooldown</div>
              <div className={`substep-label ${currentSubstep === 4 ? 'active' : ''}`}>Components</div>
            </div>
          </div>
          
          {/* Current Substep Content */}
          {renderSubstepContent()}
          
          {/* Navigation buttons */}
          <div className="substep-navigation">
            <button 
              className="nav-button prev-button"
              onClick={currentSubstep === 1 ? null : goToPrevSubstep}
              disabled={currentSubstep === 1}
            >
              <img 
                src="https://wow.zamimg.com/images/wow/icons/small/spell_holy_borrowedtime.jpg" 
                alt="Previous"
                className="nav-icon"
              />
              Back
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={currentSubstep === totalSubsteps ? null : goToNextSubstep}
              disabled={currentSubstep === totalSubsteps}
            >
              Continue
              <img 
                src="https://wow.zamimg.com/images/wow/icons/small/ability_hunter_pathfinding.jpg" 
                alt="Next"
                className="nav-icon"
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className="wizard-side-panel">
        <h4 className="preview-title"></h4>
        <SpellPreview spellData={spellData} />
      </div>
    </div>
  );
};

export default Step2CastingMechanics;