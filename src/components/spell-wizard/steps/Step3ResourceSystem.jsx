import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { ResourceSelector, SpellPreview, StepNavigation } from '../common';
import '../styles/spell-wizard.css';
import '../styles/spell-wizard-layout.css';
import { getClassResources, getMonsterResources } from '../../../data/classResources';

// Enhanced cooldown categories with improved descriptions and visuals
const COOLDOWN_CATEGORIES = [
  { 
    id: 'instant', 
    name: 'No Cooldown', 
    description: 'Can be used repeatedly with no recovery time', 
    examples: ['Basic attacks', 'Minor cantrips', 'Passive abilities'],
    icon: 'spell_mage_presenceofmind',
    color: '#1eff00' // green
  },
  { 
    id: 'short', 
    name: 'Short Recovery', 
    description: 'Recovers quickly after a brief cooldown (1-2 rounds)', 
    examples: ['Basic spells', 'Combat maneuvers', 'Mobility skills'],
    icon: 'ability_warrior_challange',
    color: '#5fe6ff' // light blue
  },
  { 
    id: 'medium', 
    name: 'Moderate Recovery', 
    description: 'Requires moderate cooldown between uses (3-5 rounds)', 
    examples: ['Powerful spells', 'Defensive abilities', 'Crowd control'],
    icon: 'spell_holy_borrowedtime',
    color: '#0081ff' // blue
  },
  { 
    id: 'long', 
    name: 'Long Recovery', 
    description: 'Significant cooldown required (6-10 rounds)', 
    examples: ['Major spells', 'Class features', 'Emergency defenses'],
    icon: 'spell_holy_reverence',
    color: '#c359ff' // purple
  },
  { 
    id: 'encounter', 
    name: 'Once Per Encounter', 
    description: 'Can only be used once per combat encounter', 
    examples: ['Ultimate abilities', 'Specialized powers', 'Tide-turning spells'],
    icon: 'spell_arcane_arcanepotency',
    color: '#ff7800' // orange
  },
  { 
    id: 'daily', 
    name: 'Long Rest Required', 
    description: 'Can only be used once per long rest (daily powers)', 
    examples: ['High-level spells', 'Powerful artifacts', 'Ancient rituals'],
    icon: 'inv_misc_pocketwatch_01',
    color: '#ff0050' // red
  }
];

// Enhanced cost scaling modifiers with visual distinctions
const COST_SCALING_OPTIONS = [
  { 
    id: 'flat', 
    name: 'Flat Cost', 
    description: 'Resource cost remains the same regardless of other factors',
    icon: 'ability_fixated_state_blue',
    color: '#5fe6ff' // light blue
  },
  { 
    id: 'scaling', 
    name: 'Level Scaling', 
    description: 'Resource cost increases with character level or spell power',
    icon: 'spell_arcane_studentofthemind',
    color: '#c359ff' // purple
  },
  { 
    id: 'variable', 
    name: 'Variable/Optional', 
    description: 'Player can choose to spend more resources for greater effect',
    icon: 'spell_priest_voidshift',
    color: '#ff7800' // orange
  },
  { 
    id: 'decreasing', 
    name: 'Decreasing Over Time', 
    description: 'Costs less when used repeatedly (e.g., combo builders)',
    icon: 'spell_mage_overpowered',
    color: '#1eff00' // green
  },
  { 
    id: 'conditional', 
    name: 'Conditional Modifier', 
    description: 'Cost changes based on conditions or status effects',
    icon: 'ability_priest_reflection',
    color: '#ff0050' // red
  }
];

// Enhanced cast time options with better descriptions and visuals
const CAST_TIME_OPTIONS = [
  { 
    id: 'instant', 
    name: 'Instant', 
    description: 'Activates immediately with no action cost',
    examples: ['Quick strikes', 'Reactions', 'Interrupts'],
    icon: 'spell_holy_borrowedtime',
    color: '#1eff00' // green
  },
  { 
    id: 'reaction', 
    name: 'Reaction', 
    description: 'Used as a response to specific triggers or events',
    examples: ['Counterattacks', 'Deflections', 'Opportunity attacks'],
    icon: 'ability_warrior_revenge',
    color: '#5fe6ff' // light blue
  },
  { 
    id: 'short', 
    name: 'Minor Action', 
    description: 'Takes a minor action to cast',
    examples: ['Quick spells', 'Fast abilities', 'Efficient skills'],
    icon: 'spell_mage_altertime',
    color: '#0081ff' // blue
  },
  { 
    id: 'medium', 
    name: 'Standard Action', 
    description: 'Takes a standard action to cast',
    examples: ['Standard spells', 'Common abilities', 'Average attacks'],
    icon: 'spell_holy_greaterheal',
    color: '#c359ff' // purple
  },
  { 
    id: 'long', 
    name: 'Full-Round Action', 
    description: 'Takes a full round to cast',
    examples: ['Powerful spells', 'Major abilities', 'Devastating attacks'],
    icon: 'spell_frost_frostblast',
    color: '#ff7800' // orange
  },
  { 
    id: 'channeled', 
    name: 'Channeled', 
    description: 'Continuous effect that requires concentration each round',
    examples: ['Beam attacks', 'Healing waves', 'Sustained damage'],
    icon: 'spell_arcane_mindmastery',
    color: '#ff0050' // red
  },
  { 
    id: 'charged', 
    name: 'Ritual/Extended', 
    description: 'Takes multiple rounds to cast for increased effect',
    examples: ['Charged shots', 'Power attacks', 'Empowered spells'],
    icon: 'inv_mace_2h_sulfuronhammer_d_01',
    color: '#ffce00' // gold
  }
];

// Resource visualization colors
const RESOURCE_COLORS = {
  mana: '#0070dd',
  rage: '#ff0000',
  energy: '#ffff00',
  focus: '#d3a100',
  health: '#00ff00',
  inferno: '#ff6600',
  fortune: '#ffd700',
  destiny: '#9b59b6',
  shadow: '#8800ff',
  elemental: '#00ffcc',
  generic: '#40c4ff',
};

const Step3ResourceSystem = () => {
  const { spellData, updateSpellData, setStepValidation, nextStep, prevStep } = useSpellWizardStore();
  
  // Load resources based on class/monster type
  const getAvailableResources = () => {
    if (spellData.source === 'class' && spellData.class) {
      return getClassResources(spellData.class);
    } else if (spellData.source === 'monster') {
      return getMonsterResources();
    }
    return [];
  };
  
  const availableResources = getAvailableResources();
  
  // Local state with enhanced default values
  const [selectedResources, setSelectedResources] = useState(
    spellData.resourceSystem?.split(',').filter(Boolean) || 
    (availableResources.length > 0 ? [availableResources[0].id] : [])
  );
  const [useHealthResource, setUseHealthResource] = useState(spellData.useHealthAsResource || false);
  const [cooldownCategory, setCooldownCategory] = useState(spellData.cooldownCategory || 'short');
  const [cooldownValue, setCooldownValue] = useState(spellData.cooldownValue || 6);
  const [cooldownUnit, setCooldownUnit] = useState(spellData.cooldownUnit || 'seconds');
  const [costScalingType, setCostScalingType] = useState(spellData.costScalingType || 'flat');
  const [castTimeType, setCastTimeType] = useState(spellData.castTimeType || 'instant');
  const [castTimeValue, setCastTimeValue] = useState(spellData.castTimeValue || 1.5);
  const [channelMaxTime, setChannelMaxTime] = useState(spellData.channelMaxTime || 3);
  const [globalCooldown, setGlobalCooldown] = useState(spellData.triggersGlobalCooldown !== false);
  
  // Resource costs - with improved default calculation
  const [resourceCosts, setResourceCosts] = useState(() => {
    const costs = {};
    
    // Generate smart defaults based on spell type
    const getDefaultCost = (resourceId) => {
      const resource = availableResources.find(r => r.id === resourceId);
      let defaultCost = 20; // Base default
      
      // Adjust based on spell type
      if (spellData.spellType === 'passive') defaultCost = 0;
      else if (spellData.spellType === 'ultimate') defaultCost = 50;
      else if (spellData.spellType === 'ritual') defaultCost = 40;
      else if (spellData.spellType === 'reaction') defaultCost = 15;
      
      // Further adjust based on category
      if (spellData.category === 'damage') {
        if (spellData.subtype === 'burst') defaultCost = 35;
        else if (spellData.subtype === 'dot') defaultCost = 25;
        else if (spellData.subtype === 'aoe') defaultCost = 30;
      } else if (spellData.category === 'healing') {
        if (spellData.subtype === 'hot') defaultCost = 20;
        else if (spellData.subtype === 'aoe') defaultCost = 35;
      } else if (spellData.category === 'utility') {
        defaultCost = 15;
      }
      
      return {
        baseAmount: defaultCost,
        scalingAmount: 0,
        scalingFormula: '',
        variableMin: Math.floor(defaultCost * 0.5),
        variableMax: Math.floor(defaultCost * 2),
        costType: 'flat'
      };
    };
    
    // Apply saved costs or generate defaults
    selectedResources.forEach(resourceId => {
      costs[resourceId] = spellData.resourceCosts?.[resourceId] || getDefaultCost(resourceId);
    });
    
    // Handle health cost if enabled
    if (useHealthResource) {
      costs['health'] = spellData.resourceCosts?.health || {
        baseAmount: 5,
        scalingAmount: 0,
        scalingFormula: '',
        variableMin: 2,
        variableMax: 10,
        costType: 'flat'
      };
    }
    
    return costs;
  });
  
  // Class-specific mechanics - with better defaults
  const [fortuneGenerate, setFortuneGenerate] = useState(
    spellData.fortuneGenerate !== undefined ? spellData.fortuneGenerate : 
    (spellData.class === 'gambler' && spellData.category === 'damage')
  );
  const [fortuneGenerateAmount, setFortuneGenerateAmount] = useState(spellData.fortuneGenerateAmount || 1);
  const [fortuneConsume, setFortuneConsume] = useState(
    spellData.fortuneConsume !== undefined ? spellData.fortuneConsume : 
    (spellData.class === 'gambler' && spellData.spellType === 'ultimate')
  );
  const [fortuneEnhanceEffect, setFortuneEnhanceEffect] = useState(
    spellData.fortuneEnhanceEffect || 
    'When Fortune Points are consumed, this spell deals 50% additional damage and has a chance to apply a critical effect.'
  );
  
  const [rageGenerate, setRageGenerate] = useState(
    spellData.rageGenerate !== undefined ? spellData.rageGenerate : 
    (spellData.class === 'berserker' && spellData.category === 'damage')
  );
  const [rageGenerateAmount, setRageGenerateAmount] = useState(spellData.rageGenerateAmount || 5);
  const [rageRequired, setRageRequired] = useState(
    spellData.rageRequired !== undefined ? spellData.rageRequired : 
    (spellData.class === 'berserker' && spellData.spellType === 'ultimate')
  );
  const [rageThreshold, setRageThreshold] = useState(spellData.rageThreshold || 30);
  const [rageEnhanced, setRageEnhanced] = useState(
    spellData.rageEnhanced !== undefined ? spellData.rageEnhanced : 
    (spellData.class === 'berserker' && spellData.category === 'damage')
  );
  const [rageEnhanceEffect, setRageEnhanceEffect] = useState(
    spellData.rageEnhanceEffect || 
    'While above 30 Rage, this spell deals 25% additional damage and has a chance to apply Bleeding.'
  );
  
  // Enhanced element states
  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [activeResourceTab, setActiveResourceTab] = useState('primary');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeSection, setActiveSection] = useState('resource');

  // Generate tooltip text for cooldown
  const getCooldownTooltip = () => {
    const category = COOLDOWN_CATEGORIES.find(c => c.id === cooldownCategory);
    if (!category) return '';
    
    let tooltipText = `${category.name}: ${category.description}`;
    if (cooldownCategory !== 'instant' && cooldownValue) {
      tooltipText += `\n\nSpecific value: ${cooldownValue} ${cooldownUnit}`;
    }
    
    return tooltipText;
  };

  // Generate tooltip text for cast time
  const getCastTimeTooltip = () => {
    const castType = CAST_TIME_OPTIONS.find(c => c.id === castTimeType);
    if (!castType) return '';
    
    let tooltipText = `${castType.name}: ${castType.description}`;
    if (['short', 'medium', 'long'].includes(castTimeType) && castTimeValue) {
      tooltipText += `\n\nCast time: ${castTimeValue} seconds`;
    } else if (castTimeType === 'channeled' && channelMaxTime) {
      tooltipText += `\n\nMax channel: ${channelMaxTime} seconds`;
    } else if (castTimeType === 'charged' && channelMaxTime) {
      tooltipText += `\n\nMax charge: ${channelMaxTime} seconds`;
    }
    
    return tooltipText;
  };

  // Update validation status
  useEffect(() => {
    // Validation rules with better messaging
    let validationIssue = '';
    
    if (selectedResources.length === 0 && !useHealthResource) {
      validationIssue = 'Please select at least one resource for your spell';
    } else if (Object.values(resourceCosts).every(cost => Number(cost.baseAmount) === 0)) {
      validationIssue = 'Please specify at least one resource cost for your spell';
    } else if (castTimeType !== 'instant' && 
              castTimeType !== 'reaction' && 
              !(castTimeType === 'channeled' && channelMaxTime > 0) &&
              !((['short', 'medium', 'long'].includes(castTimeType)) && castTimeValue > 0)) {
      validationIssue = 'Please specify a valid cast time for your spell';
    } else if (cooldownCategory !== 'instant' && 
              cooldownCategory !== 'encounter' && 
              cooldownCategory !== 'daily' &&
              !(cooldownValue > 0)) {
      validationIssue = 'Please specify a valid cooldown for your spell';
    }
    
    setValidationMessage(validationIssue);
    const valid = !validationIssue;
    
    setIsValid(valid);
    setStepValidation(2, valid);
    
    // Update spell data with current values
    updateSpellData({
      resourceSystem: selectedResources.join(','),
      useHealthAsResource: useHealthResource,
      cooldownCategory,
      cooldownValue: Number(cooldownValue),
      cooldownUnit,
      costScalingType,
      castTimeType,
      castTimeValue: Number(castTimeValue),
      channelMaxTime: Number(channelMaxTime),
      triggersGlobalCooldown: globalCooldown,
      resourceCosts,
      
      // Class-specific mechanics
      fortuneGenerate,
      fortuneGenerateAmount: Number(fortuneGenerateAmount),
      fortuneConsume,
      fortuneEnhanceEffect,
      rageGenerate,
      rageGenerateAmount: Number(rageGenerateAmount),
      rageRequired,
      rageThreshold: Number(rageThreshold),
      rageEnhanced,
      rageEnhanceEffect
    });
  }, [
    selectedResources, useHealthResource, cooldownCategory, cooldownValue, cooldownUnit,
    costScalingType, castTimeType, castTimeValue, channelMaxTime, globalCooldown,
    resourceCosts, fortuneGenerate, fortuneGenerateAmount, fortuneConsume, fortuneEnhanceEffect,
    rageGenerate, rageGenerateAmount, rageRequired, rageThreshold, rageEnhanced, rageEnhanceEffect,
    updateSpellData, setStepValidation
  ]);
  
  // Handle health resource toggle
  const handleHealthResourceToggle = () => {
    setUseHealthResource(prev => {
      const newValue = !prev;
      
      // Add or remove health cost
      if (newValue) {
        setResourceCosts(prev => ({
          ...prev,
          health: {
            baseAmount: 5,
            scalingAmount: 0,
            scalingFormula: '',
            variableMin: 2,
            variableMax: 10,
            costType: 'flat'
          }
        }));
      } else {
        setResourceCosts(prev => {
          const newCosts = { ...prev };
          delete newCosts.health;
          return newCosts;
        });
      }
      
      return newValue;
    });
  };
  
  // Handle resource cost change
  const handleResourceCostChange = (resourceId, field, value) => {
    setResourceCosts(prev => ({
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        [field]: typeof value === 'number' ? Number(value) : value
      }
    }));
  };
  
  // Get resource name by ID
  const getResourceName = (resourceId) => {
    if (resourceId === 'health') return 'Health';
    
    const resource = availableResources.find(r => r.id === resourceId);
    return resource ? resource.name : resourceId;
  };
  
  // Get resource color by ID
  const getResourceColor = (resourceId) => {
    if (resourceId === 'health') return RESOURCE_COLORS.health;
    
    const resource = availableResources.find(r => r.id === resourceId);
    return resource?.color || RESOURCE_COLORS[resourceId] || RESOURCE_COLORS.generic;
  };
  
  // Get resource icon by ID
  const getResourceIcon = (resourceId) => {
    if (resourceId === 'health') return 'inv_alchemy_elixir_05';
    
    const resource = availableResources.find(r => r.id === resourceId);
    return resource?.icon || 'inv_misc_questionmark';
  };

  // Get cooldown color
  const getCooldownColor = () => {
    const cooldown = COOLDOWN_CATEGORIES.find(c => c.id === cooldownCategory);
    return cooldown?.color || '#40c4ff';
  };

  // Get cast time color
  const getCastTimeColor = () => {
    const castTime = CAST_TIME_OPTIONS.find(c => c.id === castTimeType);
    return castTime?.color || '#40c4ff';
  };

  // Format resource cost for display
  const formatResourceCost = (resourceId, cost) => {
    const resourceName = getResourceName(resourceId);
    const baseAmount = Number(cost.baseAmount);
    
    if (resourceId === 'health' && cost.costType !== 'flat') {
      const costType = cost.costType === 'percentage' ? 'Maximum' : 'Current';
      return `${baseAmount}% of ${costType} ${resourceName}`;
    }
    
    let costText = `${baseAmount} ${resourceName}`;
    
    if (costScalingType === 'scaling' && cost.scalingFormula) {
      costText += ` (${cost.scalingFormula})`;
    } else if (costScalingType === 'variable' && cost.variableMin && cost.variableMax) {
      costText = `${cost.variableMin}-${cost.variableMax} ${resourceName}`;
    } else if (costScalingType === 'conditional' && cost.condition) {
      costText += ` (${cost.condition})`;
    }
    
    return costText;
  };
  
  // Format cast time for display
  const formatCastTime = () => {
    const castTime = CAST_TIME_OPTIONS.find(c => c.id === castTimeType);
    
    if (castTimeType === 'instant' || castTimeType === 'reaction') {
      return castTime.name;
    } else if (castTimeType === 'channeled') {
      return `Channel up to ${channelMaxTime} rounds`;
    } else if (castTimeType === 'charged') {
      return `Ritual (${channelMaxTime} rounds)`;
    } else if (castTimeType === 'short') {
      return 'Minor Action';
    } else if (castTimeType === 'medium') {
      return 'Standard Action';
    } else if (castTimeType === 'long') {
      return 'Full-Round Action';
    } else {
      return castTime.name;
    }
  };
  
  // Format cooldown for display
  const formatCooldown = () => {
    const cooldown = COOLDOWN_CATEGORIES.find(c => c.id === cooldownCategory);
    
    if (cooldownCategory === 'instant') {
      return 'No cooldown';
    } else if (cooldownCategory === 'encounter') {
      return 'Once per encounter';
    } else if (cooldownCategory === 'daily') {
      return 'Once per long rest';
    } else {
      if (cooldownUnit === 'rounds') {
        return `${cooldownValue} round cooldown`;
      } else if (cooldownUnit === 'seconds') {
        return `${cooldownValue} round cooldown`;
      } else {
        return `${cooldownValue} ${cooldownUnit} cooldown`;
      }
    }
  };
  
  // Calculate total resource cost
  const calculateTotalResourceCost = () => {
    let costSummary = [];
    
    Object.entries(resourceCosts).forEach(([resourceId, cost]) => {
      if (cost.baseAmount > 0) {
        costSummary.push(formatResourceCost(resourceId, cost));
      }
    });
    
    return costSummary.join(', ') || 'No resource cost';
  };

  // Get class name from id
  const getClassName = (classId) => {
    if (!classId) return '';
    
    const classMap = {
      'pyrofiend': 'Pyrofiend',
      'gambler': 'Gambler',
      'fateweaver': 'Fate Weaver',
      'berserker': 'Berserker',
      'shadowdancer': 'Shadowdancer',
      'elementalist': 'Elementalist'
    };
    
    return classMap[classId] || classId;
  };
  
  // Get spell type name
  const getSpellTypeName = (typeId) => {
    if (!typeId) return '';
    
    const typeMap = {
      'active': 'Active Ability',
      'passive': 'Passive Ability',
      'aura': 'Aura',
      'ultimate': 'Ultimate Ability',
      'reaction': 'Reaction',
      'ritual': 'Ritual'
    };
    
    return typeMap[typeId] || typeId;
  };

  return (
    <div className="wizard-layout">
      <div className="wizard-main-content">
        <div className="resource-system-step">
          {/* Navigation tabs for different sections */}
          <div className="section-tabs">
            <button 
              className={`section-tab ${activeSection === 'resource' ? 'active' : ''}`}
              onClick={() => setActiveSection('resource')}
            >
              <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_datacube_01.jpg`} alt="" />
              Resources & Cost
            </button>
            <button 
              className={`section-tab ${activeSection === 'time' ? 'active' : ''}`}
              onClick={() => setActiveSection('time')}
            >
              <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_misc_pocketwatch_01.jpg`} alt="" />
              Cast Time & Cooldown
            </button>
            {(spellData.class === 'gambler' || spellData.class === 'fateweaver' || spellData.class === 'berserker') && (
              <button 
                className={`section-tab ${activeSection === 'special' ? 'active' : ''}`}
                onClick={() => setActiveSection('special')}
              >
                <img src={`https://wow.zamimg.com/images/wow/icons/medium/${spellData.class === 'berserker' ? 'spell_nature_shamanrage' : 'inv_misc_dice_01'}.jpg`} alt="" />
                Special Mechanics
              </button>
            )}
          </div>

          {/* Resource System Section */}
          {activeSection === 'resource' && (
            <>
              {/* Resource Selection Section */}
              <div className="resource-section">
                <div className="section">
                  <h4 className="section-title">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_elemental_primal_mana.jpg`} alt="" className="section-icon" />
                    Resource Systems
                  </h4>
                  <p className="section-description">
                    Choose which resources this spell will use. Each class has unique resource mechanics that affect how spells function.
                  </p>
                  
                  {/* Resource tabs */}
                  <div className="resource-tabs">
                    <button 
                      className={`resource-tab ${activeResourceTab === 'primary' ? 'active' : ''}`}
                      onClick={() => setActiveResourceTab('primary')}
                    >
                      Primary Resources
                    </button>
                    <button 
                      className={`resource-tab ${activeResourceTab === 'health' ? 'active' : ''}`}
                      onClick={() => setActiveResourceTab('health')}
                    >
                      Health Costs
                    </button>
                    <button 
                      className={`resource-tab ${activeResourceTab === 'advanced' ? 'active' : ''}`}
                      onClick={() => setActiveResourceTab('advanced')}
                    >
                      Advanced Options
                    </button>
                  </div>
                  
                  {/* Primary Resources Tab */}
                  {activeResourceTab === 'primary' && (
                    <div className="resource-tab-content">
                      <ResourceSelector 
                        selectedResources={resourceCosts}
                        onChange={(newResourceCosts) => {
                          setSelectedResources(Object.keys(newResourceCosts).filter(key => key !== 'health'));
                          setResourceCosts(newResourceCosts);
                        }}
                      />
                      
                      {/* Resources Preview */}
                      <div className="resources-preview">
                        <h5>Selected Resources</h5>
                        <div className="resource-preview-list">
                          {selectedResources.length > 0 ? (
                            selectedResources.map(resourceId => {
                              const cost = resourceCosts[resourceId] || { baseAmount: 0 };
                              return (
                                <div 
                                  key={resourceId}
                                  className="resource-preview-item"
                                  style={{
                                    '--resource-color': getResourceColor(resourceId)
                                  }}
                                >
                                  <div className="resource-preview-icon">
                                    <img 
                                      src={`https://wow.zamimg.com/images/wow/icons/medium/${getResourceIcon(resourceId)}.jpg`} 
                                      alt={getResourceName(resourceId)} 
                                    />
                                  </div>
                                  <div className="resource-preview-info">
                                    <div className="resource-preview-name">
                                      {getResourceName(resourceId)}
                                    </div>
                                    <div className="resource-preview-cost">
                                      {cost.baseAmount > 0 
                                        ? formatResourceCost(resourceId, cost)
                                        : 'No cost specified'}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="no-resources-message">
                              No primary resources selected. Choose at least one resource or enable health cost.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Health Resource Tab */}
                  {activeResourceTab === 'health' && (
                    <div className="resource-tab-content">
                      <div className="health-resource-section">
                        <div className="health-resource-option">
                          <label className="checkbox-container">
                            <input 
                              type="checkbox" 
                              checked={useHealthResource} 
                              onChange={handleHealthResourceToggle}
                            />
                            <span className="checkbox-text">Use Health as a Resource</span>
                          </label>
                          <p className="option-description">
                            When enabled, this spell will cost health instead of or in addition to other resources.
                            Useful for blood magic, sacrifice abilities, or desperation moves.
                          </p>
                        </div>
                        
                        {/* Health Cost Settings */}
                        {useHealthResource && (
                          <div className="health-cost-settings">
                            <div 
                              className="resource-cost-item health-cost"
                              style={{ '--resource-color': '#e74c3c' }}
                            >
                              <div className="resource-cost-header">
                                <div className="resource-cost-icon">
                                  <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_alchemy_elixir_05.jpg" alt="Health" />
                                </div>
                                <h5>Health Cost</h5>
                              </div>
                              
                              <div className="resource-cost-inputs">
                                <div className="cost-input-row">
                                  <div className="cost-input-group">
                                    <label>Cost Amount:</label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={resourceCosts.health?.baseAmount || 0}
                                      onChange={(e) => handleResourceCostChange(
                                        'health', 
                                        'baseAmount', 
                                        Math.max(0, Number(e.target.value))
                                      )}
                                      className="cost-input"
                                    />
                                  </div>
                                  
                                  <div className="cost-input-group">
                                    <label>Cost Type:</label>
                                    <select
                                      value={resourceCosts.health?.costType || 'flat'}
                                      onChange={(e) => handleResourceCostChange('health', 'costType', e.target.value)}
                                      className="cost-type-select"
                                    >
                                      <option value="flat">Flat Amount</option>
                                      <option value="percentage">Percentage of Max Health</option>
                                      <option value="current">Percentage of Current Health</option>
                                    </select>
                                  </div>
                                </div>
                                
                                {(resourceCosts.health?.costType === 'percentage' || resourceCosts.health?.costType === 'current') && (
                                  <div className="health-percentage-note">
                                    <div className="info-tip">
                                      <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_masterscall.jpg" alt="info" />
                                      <p>For percentage costs, the value represents a percentage (e.g., 5 = 5% of health).</p>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="health-cost-preview">
                                  <div className="cost-preview-label">Preview:</div>
                                  <div className="cost-preview-value">
                                    {formatResourceCost('health', resourceCosts.health || { baseAmount: 0, costType: 'flat' })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="health-cost-tips">
                              <div className="tip-card">
                                <div className="tip-icon">
                                  <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_lifedrain.jpg" alt="Life Drain" />
                                </div>
                                <div className="tip-content">
                                  <h6>Design Tips for Health Costs</h6>
                                  <ul>
                                    <li>For health sacrifice mechanics, percentage-based costs are often more balanced than flat values.</li>
                                    <li>Consider adding self-healing or vampiric effects to spells with health costs.</li>
                                    <li>Health costs work well with high-risk, high-reward spells that deal significant damage.</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {!useHealthResource && (
                          <div className="enable-health-prompt">
                            <div className="prompt-icon">
                              <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_bloodboil.jpg" alt="Blood Magic" />
                            </div>
                            <div className="prompt-content">
                              <h5>Blood Magic Potential</h5>
                              <p>Health costs add a strategic risk-vs-reward element to your spell. Enable this option to explore blood magic mechanics.</p>
                              <button 
                                className="enable-health-button"
                                onClick={handleHealthResourceToggle}
                              >
                                Enable Health Cost
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Advanced Options Tab */}
                  {activeResourceTab === 'advanced' && (
                    <div className="resource-tab-content">
                      <div className="cost-scaling-section">
                        <h5 className="subsection-title">
                          <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_arcane_arcane01.jpg" alt="" />
                          Cost Scaling Type
                        </h5>
                        <p className="subsection-description">
                          Define how resource costs scale or vary during gameplay.
                        </p>
                        
                        <div className="cost-scaling-options">
                          {COST_SCALING_OPTIONS.map(option => (
                            <div 
                              key={option.id}
                              className={`cost-scaling-option ${costScalingType === option.id ? 'selected' : ''}`}
                              onClick={() => setCostScalingType(option.id)}
                              style={{
                                '--option-color': option.color
                              }}
                            >
                              <div className="option-icon">
                                <img src={`https://wow.zamimg.com/images/wow/icons/medium/${option.icon}.jpg`} alt={option.name} />
                              </div>
                              <div className="option-info">
                                <div className="option-name">{option.name}</div>
                                <div className="option-description">{option.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Dynamic scaling fields */}
                        {costScalingType !== 'flat' && (
                          <div className="scaling-details">
                            {costScalingType === 'scaling' && (
                              <div className="scaling-fields">
                                <h6>Level Scaling Parameters</h6>
                                <p>Define how the resource cost scales with character level or power.</p>
                                
                                {selectedResources.map(resourceId => (
                                  <div key={resourceId} className="scaling-formula-input">
                                    <label>{getResourceName(resourceId)} Scaling Formula:</label>
                                    <input
                                      type="text"
                                      value={resourceCosts[resourceId]?.scalingFormula || ''}
                                      onChange={(e) => handleResourceCostChange(
                                        resourceId, 
                                        'scalingFormula', 
                                        e.target.value
                                      )}
                                      placeholder="e.g., +2 per level"
                                      className="formula-input"
                                    />
                                  </div>
                                ))}
                                
                                <div className="scaling-examples">
                                  <div className="example-title">Example Formulas:</div>
                                  <ul>
                                    <li>+2 per level (increases by 2 for each level)</li>
                                    <li>+5% per tier (increases by 5% per power tier)</li>
                                    <li>Base + (level * 0.5) (more complex scaling)</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                            
                            {costScalingType === 'variable' && (
                              <div className="variable-fields">
                                <h6>Variable Cost Parameters</h6>
                                <p>Define the minimum and maximum resource costs when the player can choose to empower the spell.</p>
                                
                                {selectedResources.map(resourceId => (
                                  <div key={resourceId} className="variable-cost-inputs">
                                    <div className="resource-name">{getResourceName(resourceId)}:</div>
                                    <div className="variable-range">
                                      <div className="input-group">
                                        <label>Min:</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={resourceCosts[resourceId]?.variableMin || 0}
                                          onChange={(e) => handleResourceCostChange(
                                            resourceId, 
                                            'variableMin', 
                                            Math.max(0, Number(e.target.value))
                                          )}
                                          className="min-input"
                                        />
                                      </div>
                                      <div className="range-separator">to</div>
                                      <div className="input-group">
                                        <label>Max:</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={resourceCosts[resourceId]?.variableMax || 0}
                                          onChange={(e) => handleResourceCostChange(
                                            resourceId, 
                                            'variableMax', 
                                            Math.max(0, Number(e.target.value))
                                          )}
                                          className="max-input"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {costScalingType === 'conditional' && (
                              <div className="conditional-fields">
                                <h6>Conditional Modifiers</h6>
                                <p>Define conditions that affect the resource cost of this spell.</p>
                                
                                {selectedResources.map(resourceId => (
                                  <div key={resourceId} className="conditional-input">
                                    <label>{getResourceName(resourceId)} Condition:</label>
                                    <input
                                      type="text"
                                      value={resourceCosts[resourceId]?.condition || ''}
                                      onChange={(e) => handleResourceCostChange(
                                        resourceId, 
                                        'condition', 
                                        e.target.value
                                      )}
                                      placeholder="e.g., Costs 50% less while under 30% health"
                                      className="condition-input"
                                    />
                                  </div>
                                ))}
                                
                                <div className="condition-examples">
                                  <div className="example-title">Example Conditions:</div>
                                  <ul>
                                    <li>Costs 50% less while under 30% health</li>
                                    <li>Costs an additional 10 mana while in combat</li>
                                    <li>Free to cast when the target is below 20% health</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                            
                            {costScalingType === 'decreasing' && (
                              <div className="decreasing-fields">
                                <h6>Decreasing Cost Parameters</h6>
                                <p>Define how costs decrease when the spell is used repeatedly.</p>
                                
                                <div className="decrease-input">
                                  <label>Decrease Amount Per Use:</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={spellData.decreaseAmount || 5}
                                    onChange={(e) => updateSpellData({
                                      ...spellData,
                                      decreaseAmount: Math.max(0, Math.min(100, Number(e.target.value)))
                                    })}
                                    className="decrease-input"
                                  /> %
                                </div>
                                
                                <div className="decrease-input">
                                  <label>Minimum Cost Percentage:</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={spellData.minimumCostPercentage || 20}
                                    onChange={(e) => updateSpellData({
                                      ...spellData,
                                      minimumCostPercentage: Math.max(0, Math.min(100, Number(e.target.value)))
                                    })}
                                    className="decrease-input"
                                  /> %
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {/* Cast Time & Cooldown Section */}
          {activeSection === 'time' && (
            <>
              <div className="time-section">
              <div className="section cast-time-section">
  <h4 className="section-title">
    <img
      src="https://wow.zamimg.com/images/wow/icons/medium/spell_holy_borrowedtime.jpg"
      alt=""
      className="section-icon"
    />
    Cast Time
  </h4>
  <p className="section-description">
    Define how long it takes to cast this spell. Cast times affect spell balance and gameplay pacing.
  </p>

  <div className="cast-time-options">
    {CAST_TIME_OPTIONS.map(option => (
      <div
        key={option.id}
        className={`cast-time-option ${castTimeType === option.id ? 'selected' : ''}`}
        onClick={() => setCastTimeType(option.id)}
        style={{ '--option-color': option.color }}
      >
        <div className="option-icon">
          <img
            src={`https://wow.zamimg.com/images/wow/icons/medium/${option.icon}.jpg`}
            alt={option.name}
          />
        </div>
        <div className="option-info">
          <div className="option-name">{option.name}</div>
          <div className="option-description">{option.description}</div>
          {option.examples && (
            <div className="option-examples">
              Examples: {option.examples.join(', ')}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>

  {/* Cast Time Input Controls */}
  {!['instant', 'reaction'].includes(castTimeType) && (
    <div className="cast-time-controls">
      {(castTimeType === 'short' ||
        castTimeType === 'medium' ||
        castTimeType === 'long') && (
        <div className="cast-time-input-container">
          <label>Cast Time (seconds):</label>
          <div className="cast-time-input-group">
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.1"
              value={castTimeValue}
              onChange={(e) => setCastTimeValue(Number(e.target.value))}
              className="cast-time-slider"
              style={{
                '--progress': `${((castTimeValue - 0.5) / 5.5) * 100}%`,
                '--slider-color': getCastTimeColor()
              }}
            />
            <div className="cast-time-value-display">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={castTimeValue}
                onChange={(e) =>
                  setCastTimeValue(Math.max(0.1, Number(e.target.value)))
                }
                className="cast-time-value-input"
              />
              <span className="units">sec</span>
            </div>
          </div>
          <div className="cast-time-ranges">
            <span className="range-marker fast">Fast</span>
            <span className="range-marker medium">Medium</span>
            <span className="range-marker slow">Slow</span>
          </div>
        </div>
      )}

      {(castTimeType === 'channeled' || castTimeType === 'charged') && (
        <div className="channel-time-container">
          <label>
            {castTimeType === 'channeled'
              ? 'Maximum Channel Duration'
              : 'Maximum Ritual Time'}{' '}
            (rounds):
          </label>
          <div className="channel-time-input-group">
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={channelMaxTime}
              onChange={(e) => setChannelMaxTime(Number(e.target.value))}
              className="channel-time-slider"
              style={{
                '--progress': `${((channelMaxTime - 1) / 9) * 100}%`,
                '--slider-color': getCastTimeColor()
              }}
            />
            <div className="channel-time-value-display">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={channelMaxTime}
                onChange={(e) =>
                  setChannelMaxTime(Math.max(0.5, Number(e.target.value)))
                }
                className="channel-time-value-input"
              />
              <span className="units">sec</span>
            </div>
          </div>
          <div className="channel-time-ranges">
            <span className="range-marker short">Short</span>
            <span className="range-marker medium">Medium</span>
            <span className="range-marker long">Extended</span>
          </div>
        </div>
      )}

      {/* Cast Time Preview */}
      <div className="cast-time-preview">
        <div className="preview-heading">Preview</div>
        <div
          className="cast-preview-container"
          style={{ '--cast-color': getCastTimeColor() }}
        >
          <div className="caster-icon">
            <img
              src="https://wow.zamimg.com/images/wow/icons/medium/ability_mage_firestarter.jpg"
              alt="Caster"
            />
          </div>
          <div className="channel-bar">
            <div className="channel-progress" style={{ width: '100%' }}></div>
          </div>
          <div className="channel-ticks">
            {Array.from({ length: Math.floor(channelMaxTime) }).map((_, i) => (
              <div
                key={i}
                className="channel-tick"
                style={{
                  left: `${((i + 1) / (Math.floor(channelMaxTime) + 1)) * 100}%`
                }}
              ></div>
            ))}
          </div>
        </div>

        {(castTimeType === 'short' ||
          castTimeType === 'medium' ||
          castTimeType === 'long') && (
          <div className="cast-bar-container">
            <div className="cast-label">
              {castTimeType === 'short'
                ? 'Minor Action'
                : castTimeType === 'medium'
                ? 'Standard Action'
                : 'Full-Round Action'}
            </div>
            <div className="cast-bar">
              <div className="cast-progress"></div>
            </div>
          </div>
        )}

        {castTimeType === 'charged' && (
          <div className="charge-bar-container">
            <div className="charge-label">
              Ritual casting: {channelMaxTime} rounds
            </div>
            <div className="charge-bar">
              <div className="charge-progress" style={{ width: '30%' }}></div>
              <div className="charge-progress" style={{ width: '60%', opacity: 0.6 }}></div>
              <div className="charge-progress" style={{ width: '100%', opacity: 0.3 }}></div>
            </div>
            <div className="charge-stages">
              <span>Low</span>
              <span>Medium</span>
              <span>Full</span>
            </div>
          </div>
        )}

        <div className="spell-icon">
          <img
            src={
              spellData.icon
                ? `https://wow.zamimg.com/images/wow/icons/medium/${spellData.icon}.jpg`
                : 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg'
            }
            alt="Spell"
          />
        </div>
      </div>
    </div>
  )}
</div>

           
                  
                </div>
                  
                <div className="section cooldown-section">
                  <h4 className="section-title">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_misc_pocketwatch_01.jpg`} alt="" className="section-icon" />
                    Cooldown
                  </h4>
                  <p className="section-description">
                    Define how frequently your spell can be cast. Cooldowns balance powerful abilities and establish a rhythm to gameplay.
                  </p>
                  
                  <div className="cooldown-categories">
                    {COOLDOWN_CATEGORIES.map(category => (
                      <div 
                        key={category.id}
                        className={`cooldown-category ${cooldownCategory === category.id ? 'selected' : ''}`}
                        onClick={() => setCooldownCategory(category.id)}
                        style={{
                          '--option-color': category.color
                        }}
                      >
                        <div className="category-icon">
                          <img src={`https://wow.zamimg.com/images/wow/icons/medium/${category.icon}.jpg`} alt={category.name} />
                        </div>
                        <div className="category-info">
                          <div className="category-name">{category.name}</div>
                          <div className="category-description">{category.description}</div>
                          <div className="category-examples">
                            Examples: {category.examples.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Cooldown Input Controls */}
                  {!['instant', 'encounter', 'daily'].includes(cooldownCategory) && (
                    <div className="cooldown-controls">
                      <div className="cooldown-value-container">
                        <label>Specific Cooldown Value:</label>
                        <div className="cooldown-input-group">
                          <input
                            type="range"
                            min="1"
                            max={cooldownCategory === 'short' ? 15 : cooldownCategory === 'medium' ? 60 : 300}
                            value={cooldownValue}
                            onChange={(e) => setCooldownValue(Number(e.target.value))}
                            className="cooldown-slider"
                            style={{
                              '--progress': `${(cooldownValue / (cooldownCategory === 'short' ? 15 : cooldownCategory === 'medium' ? 60 : 300)) * 100}%`,
                              '--slider-color': getCooldownColor()
                            }}
                          />
                          <div className="cooldown-value-display">
                            <input
                              type="number"
                              min="1"
                              value={cooldownValue}
                              onChange={(e) => setCooldownValue(Math.max(1, Number(e.target.value)))}
                              className="cooldown-value-input"
                            />
                            <select
                              value={cooldownUnit}
                              onChange={(e) => setCooldownUnit(e.target.value)}
                              className="cooldown-unit"
                            >
                              <option value="seconds">Seconds</option>
                              <option value="rounds">Combat Rounds</option>
                              <option value="minutes">Minutes</option>
                              <option value="hours">Hours</option>
                            </select>
                          </div>
                        </div>
                        <div className="cooldown-ranges">
                          <span className="range-marker short">Short</span>
                          <span className="range-marker medium">Medium</span>
                          <span className="range-marker long">Long</span>
                        </div>
                      </div>
                      
                      {/* Cooldown Preview */}
                      <div className="cooldown-preview">
                        <div className="preview-heading">Preview</div>
                        <div className="cooldown-preview-container"
                          style={{
                            '--cooldown-color': getCooldownColor()
                          }}
                        >
                          <div className="cooldown-icon">
                            <img 
                              src={spellData.icon 
                                ? `https://wow.zamimg.com/images/wow/icons/medium/${spellData.icon}.jpg`
                                : "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg"
                              } 
                              alt="Spell" 
                            />
                            <div className="cooldown-overlay"></div>
                          </div>
                          <div className="cooldown-timer">
                            {cooldownValue} {cooldownUnit}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Global Cooldown Checkbox */}
                  <div className="global-cooldown-option">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        id="global-cooldown"
                        checked={globalCooldown}
                        onChange={() => setGlobalCooldown(prev => !prev)}
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-label">Triggers Global Cooldown</span>
                    </label>
                    <div className="gcd-description">
                      If enabled, this spell will trigger the global cooldown (typically 1-1.5 seconds)
                      preventing other spells from being cast immediately after.
                    </div>
                  </div>
                  </div>
            </>
          )}
            
          
        
          
          {/* Special Class Mechanics Section */}
          {activeSection === 'special' && (
            <>
              <div className="special-mechanics-section">
                {/* Fortune Point Mechanics (Gambler/Fateweaver) */}
                {(spellData.class === 'gambler' || spellData.class === 'fateweaver') && (
                  <div className="section">
                    <h4 className="section-title">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_misc_dice_01.jpg`} alt="" className="section-icon" />
                      Fortune Point Mechanics
                    </h4>
                    <p className="section-description">
                      As a {spellData.class === 'gambler' ? 'Gambler' : 'Fate Weaver'}, this spell can interact with Fortune Points in special ways.
                      Fortune Points represent luck manipulation and can enhance spell effects or create unpredictable outcomes.
                    </p>
                    
                    <div className="fortune-mechanics">
                      <div className="fortune-generation">
                        <h5 className="mechanic-subheading">
                          <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_magic_lesserinvisibilty.jpg" alt="" />
                          Fortune Generation
                        </h5>
                        
                        <div className="mechanic-option">
                          <div className="checkbox-container">
                            <input
                              type="checkbox"
                              id="fortune-generate"
                              checked={fortuneGenerate}
                              onChange={() => setFortuneGenerate(prev => !prev)}
                            />
                            <span className="checkmark"></span>
                            <span className="checkbox-label">Generates Fortune Points When Cast</span>
                          </div>
                          <div className="mechanic-description">
                            When enabled, casting this spell will generate Fortune Points that can be spent on other abilities.
                          </div>
                        </div>
                        
                        {fortuneGenerate && (
                          <div className="fortune-input-group">
                            <label>Fortune Points Generated:</label>
                            <div className="fortune-amount-selector">
                              <button 
                                className={`amount-btn ${fortuneGenerateAmount === 1 ? 'selected' : ''}`}
                                onClick={() => setFortuneGenerateAmount(1)}
                              >
                                1 Point
                              </button>
                              <button 
                                className={`amount-btn ${fortuneGenerateAmount === 2 ? 'selected' : ''}`}
                                onClick={() => setFortuneGenerateAmount(2)}
                              >
                                2 Points
                              </button>
                              <button 
                                className={`amount-btn ${fortuneGenerateAmount === 3 ? 'selected' : ''}`}
                                onClick={() => setFortuneGenerateAmount(3)}
                              >
                                3 Points
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="fortune-consumption">
                        <h5 className="mechanic-subheading">
                          <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_holy_sealofsacrifice.jpg" alt="" />
                          Fortune Consumption
                        </h5>
                        
                        <div className="mechanic-option">
                          <div className="checkbox-container">
                            <input
                              type="checkbox"
                              id="fortune-consume"
                              checked={fortuneConsume}
                              onChange={() => setFortuneConsume(prev => !prev)}
                            />
                            <span className="checkmark"></span>
                            <span className="checkbox-label">Can Consume Fortune Points for Enhanced Effect</span>
                          </div>
                          <div className="mechanic-description">
                            When enabled, Fortune Points can be spent to enhance this spell's effects.
                          </div>
                        </div>
                        
                        {fortuneConsume && (
                          <div className="fortune-enhance-description">
                            <label>Enhanced Effect Description:</label>
                            <textarea
                              value={fortuneEnhanceEffect}
                              onChange={(e) => setFortuneEnhanceEffect(e.target.value)}
                              placeholder="Describe how the spell is enhanced when Fortune Points are consumed..."
                              className="fortune-enhance-input"
                              rows={3}
                            />
                            <div className="enhancement-examples">
                              <div className="example-title">Suggested Enhancements:</div>
                              <ul>
                                <li>Increases spell damage by 50% per Fortune Point spent</li>
                                <li>Has a 25% chance per Fortune Point to apply a critical effect</li>
                                <li>Expands area of effect by 10 feet per Fortune Point</li>
                                <li>Reduces cooldown by 1 round per Fortune Point</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="fortune-preview">
                        <div className="fortune-preview-container">
                          <div className="fortune-icon">
                            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_dice_02.jpg" alt="Fortune Points" />
                          </div>
                          <div className="fortune-summary">
                            <h6>Fortune Point Summary</h6>
                            <ul>
                              {fortuneGenerate && (
                                <li className="generate">Generates {fortuneGenerateAmount} Fortune Point{fortuneGenerateAmount > 1 ? 's' : ''} when cast</li>
                              )}
                              {fortuneConsume && (
                                <li className="consume">Can consume Fortune Points for enhanced effects</li>
                              )}
                              {!fortuneGenerate && !fortuneConsume && (
                                <li className="neutral">No Fortune Point mechanics active</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Rage Mechanics (Berserker) */}
                {spellData.class === 'berserker' && (
                  <div className="section">
                    <h4 className="section-title">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/spell_nature_shamanrage.jpg`} alt="" className="section-icon" />
                      Rage Mechanics
                    </h4>
                    <p className="section-description">
                      As a Berserker, this spell can interact with the Rage system in special ways.
                      Rage is built through combat and can enhance offensive abilities or enable powerful techniques.
                    </p>
                    
                    <div className="rage-mechanics">
                      <div className="rage-generation">
                        <h5 className="mechanic-subheading">
                          <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_battleshout.jpg" alt="" />
                          Rage Generation
                        </h5>
                        
                        <div className="mechanic-option">
                          <div className="checkbox-container">
                            <input
                              type="checkbox"
                              id="rage-generate"
                              checked={rageGenerate}
                              onChange={() => setRageGenerate(prev => !prev)}
                            />
                            <span className="checkmark"></span>
                            <span className="checkbox-label">Generates Rage When Cast</span>
                          </div>
                          <div className="mechanic-description">
                            When enabled, casting this spell will generate Rage that can be used for other abilities.
                          </div>
                        </div>
                        
                        {rageGenerate && (
                          <div className="rage-input-group">
                            <label>Rage Generated:</label>
                            <input
                              type="range"
                              min="1"
                              max="20"
                              value={rageGenerateAmount}
                              onChange={(e) => setRageGenerateAmount(Number(e.target.value))}
                              className="rage-slider"
                            />
                            <div className="rage-value">
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={rageGenerateAmount}
                                onChange={(e) => setRageGenerateAmount(Math.min(20, Math.max(1, Number(e.target.value))))}
                                className="rage-input"
                              />
                              <span className="rage-label">Rage</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="rage-requirement">
                        <h5 className="mechanic-subheading">
                          <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_focusedrage.jpg" alt="" />
                          Rage Requirements
                        </h5>
                        
                        <div className="mechanic-option">
                          <div className="checkbox-container">
                            <input
                              type="checkbox"
                              id="rage-required"
                              checked={rageRequired}
                              onChange={() => setRageRequired(prev => !prev)}
                            />
                            <span className="checkmark"></span>
                            <span className="checkbox-label">Requires Minimum Rage to Cast</span>
                          </div>
                          <div className="mechanic-description">
                            When enabled, a minimum amount of Rage is required to cast this spell.
                          </div>
                        </div>
                        
                        {rageRequired && (
                          <div className="rage-threshold-input">
                            <label>Minimum Rage Required:</label>
                            <input
                              type="range"
                              min="5"
                              max="100"
                              step="5"
                              value={rageThreshold}
                              onChange={(e) => setRageThreshold(Number(e.target.value))}
                              className="rage-threshold-slider"
                            />
                            <div className="rage-threshold-value">
                              <input
                                type="number"
                                min="5"
                                max="100"
                                step="5"
                                value={rageThreshold}
                                onChange={(e) => setRageThreshold(Math.min(100, Math.max(5, Number(e.target.value))))}
                                className="rage-threshold-input"
                              />
                              <span className="rage-label">Rage</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="rage-enhancement">
                        <h5 className="mechanic-subheading">
                          <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_unholyfrenzy.jpg" alt="" />
                          Rage Enhancement
                        </h5>
                        
                        <div className="mechanic-option">
                          <div className="checkbox-container">
                            <input
                              type="checkbox"
                              id="rage-enhanced"
                              checked={rageEnhanced}
                              onChange={() => setRageEnhanced(prev => !prev)}
                            />
                            <span className="checkmark"></span>
                            <span className="checkbox-label">Enhanced by Rage</span>
                          </div>
                          <div className="mechanic-description">
                            When enabled, this spell will have enhanced effects while raging.
                          </div>
                        </div>
                        
                        {rageEnhanced && (
                          <div className="rage-enhance-description">
                            <label>Enhanced Effect Description:</label>
                            <textarea
                              value={rageEnhanceEffect}
                              onChange={(e) => setRageEnhanceEffect(e.target.value)}
                              placeholder="Describe how the spell is enhanced while raging..."
                              className="rage-enhance-input"
                              rows={3}
                            />
                            <div className="enhancement-examples">
                              <div className="example-title">Suggested Enhancements:</div>
                              <ul>
                                <li>Deals 25% additional damage while raging</li>
                                <li>Has a chance to apply Bleeding while raging</li>
                                <li>Costs no Health while raging</li>
                                <li>Cooldown reduced by 1 round while raging</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="rage-preview">
                        <div className="rage-preview-container">
                          <div className="rage-icon">
                            <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_nature_shamanrage.jpg" alt="Rage" />
                          </div>
                          <div className="rage-summary">
                            <h6>Rage System Summary</h6>
                            <ul>
                              {rageGenerate && (
                                <li className="generate">Generates {rageGenerateAmount} Rage when cast</li>
                              )}
                              {rageRequired && (
                                <li className="require">Requires at least {rageThreshold} Rage to cast</li>
                              )}
                              {rageEnhanced && (
                                <li className="enhance">Enhanced effects while raging</li>
                              )}
                              {!rageGenerate && !rageRequired && !rageEnhanced && (
                                <li className="neutral">No Rage mechanics active</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Validation message */}
          {!isValid && (
            <div className="validation-message">
              <div className="validation-icon">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_warcry.jpg" alt="Warning" />
              </div>
              <div className="validation-content">
                <h5>Cannot Proceed</h5>
                <p>{validationMessage}</p>
              </div>
            </div>
          )}
          
          {/* Resource and Cost Summary */}
          <div className="resource-summary">
            <div className="summary-header">
              <h4>Resource & Cast Summary</h4>
            </div>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-icon">
                  <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_elemental_primal_mana.jpg" alt="Resources" />
                </div>
                <div className="summary-label">Resource Cost:</div>
                <div className="summary-value">{calculateTotalResourceCost()}</div>
              </div>
              
              <div className="summary-item">
                <div className="summary-icon">
                  <img src={`https://wow.zamimg.com/images/wow/icons/medium/${CAST_TIME_OPTIONS.find(c => c.id === castTimeType)?.icon || 'spell_holy_borrowedtime'}.jpg`} alt="Cast Time" />
                </div>
                <div className="summary-label">Cast Time:</div>
                <div className="summary-value">{formatCastTime()}</div>
              </div>
              
              <div className="summary-item">
                <div className="summary-icon">
                  <img src={`https://wow.zamimg.com/images/wow/icons/medium/${COOLDOWN_CATEGORIES.find(c => c.id === cooldownCategory)?.icon || 'inv_misc_pocketwatch_01'}.jpg`} alt="Cooldown" />
                </div>
                <div className="summary-label">Cooldown:</div>
                <div className="summary-value">{formatCooldown()}</div>
              </div>
              
              {(spellData.class === 'gambler' || spellData.class === 'fateweaver') && (
                <div className="summary-item">
                  <div className="summary-icon">
                    <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_dice_01.jpg" alt="Fortune" />
                  </div>
                  <div className="summary-label">Fortune Points:</div>
                  <div className="summary-value">
                    {fortuneGenerate && !fortuneConsume && `Generates ${fortuneGenerateAmount}`}
                    {!fortuneGenerate && fortuneConsume && 'Consumes points'}
                    {fortuneGenerate && fortuneConsume && `Generates & consumes`}
                    {!fortuneGenerate && !fortuneConsume && 'No interaction'}
                  </div>
                </div>
              )}
              
              {spellData.class === 'berserker' && (
                <div className="summary-item">
                  <div className="summary-icon">
                    <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_nature_shamanrage.jpg" alt="Rage" />
                  </div>
                  <div className="summary-label">Rage:</div>
                  <div className="summary-value">
                    {rageGenerate && `Generates ${rageGenerateAmount}`}
                    {rageRequired && ` (Requires ${rageThreshold})`}
                    {rageEnhanced && ` (Enhanced while raging)`}
                    {!rageGenerate && !rageRequired && !rageEnhanced && 'No interaction'}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Step Navigation */}
          <StepNavigation 
            currentStep={3} 
            totalSteps={8} 
            onNext={() => isValid && nextStep()} 
            onPrev={prevStep} 
            isNextEnabled={isValid}
          />
        </div>
      </div>
      
      {/* Side Panel */}
      <div className="wizard-side-panel">
        <div className="spell-preview-container">
          <div className="spell-header">
            {spellData.icon ? (
              <img 
                src={`https://wow.zamimg.com/images/wow/icons/medium/${spellData.icon}.jpg`} 
                alt=""
                className="spell-icon"
                onError={(e) => {
                  e.target.src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                }}
              />
            ) : (
              <img 
                src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg" 
                alt=""
                className="spell-icon"
              />
            )}
            <div className="spell-header-info">
              <h3 className="spell-name">{spellData.name || 'Unnamed Spell'}</h3>
              <div className="spell-subtitle">
                {spellData.source === 'class' && spellData.class && getClassName(spellData.class)}
                {spellData.source === 'monster' && spellData.monsterType}
                {spellData.spellType && ` · ${getSpellTypeName(spellData.spellType)}`}
              </div>
            </div>
          </div>
          <SpellPreview spellData={spellData} />
        </div>
        
        <div className="wizard-help-panel">
          <h4>
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_note_05.jpg" alt="" />
            Step 3: Resource System
          </h4>
          <p>In this step, you'll define how your spell interacts with the game's resource systems:</p>
          <ul>
            <li>Choose which resources your spell requires to cast</li>
            <li>Set cast time, which affects balance and gameplay pacing</li>
            <li>Define cooldown to determine how frequently it can be used</li>
            <li>Configure any special class-specific resource interactions</li>
          </ul>
          <div className="help-tip">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_frost_windwalkon.jpg" alt="Tip" />
            <p>Balance your cooldowns carefully. Powerful effects should have longer cooldowns, while basic abilities can have shorter or no cooldowns.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3ResourceSystem;