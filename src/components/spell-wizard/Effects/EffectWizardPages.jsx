import React, { useState } from 'react';
import { 
  WizardStepContainer 
} from './EffectWizardComponents';
import { useEffectWizardState, useEffectWizardDispatch } from './EffectWizardContext';
import { getWizardFlow } from './EffectWizardSteps';
import { EFFECT_TYPES, getWowIconPath } from './effectSystemData';

// Import damage pages
import {
  DamageTypeSelectionPage,
  DamageAmountPage,
  DamageEnhancementsPage,
  DamageCriticalEffectsPage,
  DamageChainPage
} from './DamagePages';

// Import healing pages
import {
  HealingAmountPage,
  HealingEnhancementsPage,
  HealingCriticalEffectsPage,
  HealingChainPage,
  HealingOverTimePage
} from './HealingPages';

// Import buff pages
import {
  BuffPrimaryStatsPage,
  BuffSecondaryStatsPage,
  BuffCombatStatsPage,
  BuffStatusEffectsPage,
  SpellPowerBuffPage,
  ResistancesBuffPage
} from './BuffPages';

// Import debuff pages
import {
  DebuffPrimaryStatsPage,
  DebuffSecondaryStatsPage,
  DebuffCombatStatsPage,
  DebuffStatusEffectsPage
} from './DebuffPages';

// Import utility pages
import UtilitySelectionPage from './UtilityPages';

// Import common pages
import {
  DurationSettingsPage,
  PersistentEffectsPage,
  ReviewEffectPage
} from './CommonPages';

/**
 * EffectTypeSelectionPage - Component for selecting effect types
 */
export const EffectTypeSelectionPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  
  const handleToggleEffectType = (effectTypeId) => {
    dispatch({
      type: 'TOGGLE_EFFECT_TYPE',
      payload: effectTypeId
    });
    
    // Update wizard flow when effect types change
    const newFlow = getWizardFlow(
      state.effectTypes.includes(effectTypeId)
        ? state.effectTypes.filter(id => id !== effectTypeId)
        : [...state.effectTypes, effectTypeId]
    );
    
    dispatch({
      type: 'SET_WIZARD_FLOW',
      payload: newFlow
    });
  };
  
  const effectCategories = {
    offensive: { name: 'Offensive', types: [] },
    supportive: { name: 'Supportive', types: [] },
    control: { name: 'Control', types: [] },
    utility: { name: 'Utility', types: [] }
  };
  
  // Group effects by category
  EFFECT_TYPES.forEach(effect => {
    if (effectCategories[effect.category]) {
      effectCategories[effect.category].types.push(effect);
    } else {
      // If category doesn't exist, add to utility
      effectCategories.utility.types.push(effect);
    }
  });
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="effect-type-selection">
        <div className="section-intro">
          <h2>Select Effect Types</h2>
          <p>
            Choose one or more effect types to include in your spell. 
            The combination of effects determines the spell's overall power and versatility.
          </p>
        </div>
        
        <div className="effect-categories">
          {Object.entries(effectCategories).map(([categoryId, category]) => (
            <div key={categoryId} className="effect-category">
              <h3>{category.name} Effects</h3>
              <div className="effect-type-grid">
                {category.types.map(effect => (
                  <div 
                    key={effect.id}
                    className={`effect-type-card ${state.effectTypes.includes(effect.id) ? 'selected' : ''}`}
                    onClick={() => handleToggleEffectType(effect.id)}
                  >
                    <div className="effect-icon">
                      <img src={getWowIconPath(effect.icon)} alt={effect.name} />
                    </div>
                    <div className="effect-info">
                      <h4>{effect.name}</h4>
                      <p>{effect.description}</p>
                      <div className="effect-cost">
                        <span className="ap-cost">{effect.actionPointCost} AP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="selected-effects-summary">
          <h3>Selected Effects ({state.effectTypes.length})</h3>
          {state.effectTypes.length > 0 ? (
            <div className="selected-badges">
              {state.effectTypes.map(effectId => {
                const effect = EFFECT_TYPES.find(e => e.id === effectId);
                return effect ? (
                  <div key={effectId} className="selected-badge">
                    <img src={getWowIconPath(effect.icon)} alt={effect.name} className="badge-icon" />
                    <span>{effect.name}</span>
                    <button 
                      className="remove-badge"
                      onClick={() => handleToggleEffectType(effectId)}
                    >
                      ×
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="no-selection">No effects selected</p>
          )}
          
          <div className="ap-cost-display">
            <span className="cost-label">Total Action Point Cost:</span>
            <span className="cost-value">{state.totalActionPointCost} AP</span>
          </div>
        </div>
      </div>
    </WizardStepContainer>
  );
};

/**
 * TemplateSelectionPage - Component for selecting pre-made templates
 */
export const TemplateSelectionPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Template definition
  const templates = [
    {
      id: 'fireball',
      name: 'Fireball',
      description: 'Classic fire damage spell with area effect',
      category: 'damage',
      icon: 'spell_fire_fireball02',
      config: {
        effectTypes: ['damage'],
        damageConfig: {
          damageTypes: ['fire'],
          diceNotation: '8d6',
          useChainEffect: false,
          useCriticalEffect: true,
          criticalConfig: {
            criticalMultiplier: 2,
            effects: ['burning']
          }
        },
        targetingConfig: {
          targetingType: 'area',
          areaShape: 'sphere',
          areaSize: 20
        },
        durationConfig: {
          durationType: 'instant'
        }
      }
    },
    {
      id: 'healingWord',
      name: 'Healing Word',
      description: 'Quick healing spell that can be cast at range',
      category: 'healing',
      icon: 'spell_holy_flashheal',
      config: {
        effectTypes: ['healing'],
        healingConfig: {
          healingType: 'direct',
          diceNotation: '1d4+4',
          useAbsorptionShield: false
        },
        targetingConfig: {
          targetingType: 'single',
          range: 60
        },
        durationConfig: {
          durationType: 'instant'
        }
      }
    },
    {
      id: 'bless',
      name: 'Bless',
      description: 'Enhances allies with improved combat capabilities',
      category: 'buff',
      icon: 'spell_holy_blessingofstrength',
      config: {
        effectTypes: ['buff'],
        buffConfig: {
          statusEffects: ['blessed'],
          statModifiers: {
            'attack_bonus': 4,
            'save_bonus': 4
          }
        },
        targetingConfig: {
          targetingType: 'multi',
          maxTargets: 3
        },
        durationConfig: {
          durationType: 'minutes',
          durationValue: 10,
          requiresConcentration: true
        }
      }
    },
    {
      id: 'faerieFire',
      name: 'Faerie Fire',
      description: 'Outlines targets, making them easier to hit',
      category: 'debuff',
      icon: 'spell_nature_faeriefire',
      config: {
        effectTypes: ['debuff'],
        debuffConfig: {
          statusEffects: [],
          statModifiers: {
            'ac': -2,
            'stealth': -5
          }
        },
        targetingConfig: {
          targetingType: 'area',
          areaShape: 'sphere',
          areaSize: 20
        },
        durationConfig: {
          durationType: 'minutes',
          durationValue: 10,
          requiresConcentration: true
        }
      }
    },
    {
      id: 'flamingBarrage',
      name: 'Flaming Barrage',
      description: 'Multiple fire bolts that deal damage over time',
      category: 'combo',
      icon: 'spell_fire_flameshock',
      config: {
        effectTypes: ['damage', 'debuff'],
        damageConfig: {
          damageTypes: ['fire'],
          diceNotation: '4d6',
          useChainEffect: true,
          chainConfig: {
            targets: 3,
            falloffRate: 0
          }
        },
        debuffConfig: {
          statusEffects: ['burning'],
          effectParameters: {
            'burning': {
              duration: 3,
              damagePerTick: '1d6'
            }
          }
        },
        durationConfig: {
          durationType: 'rounds',
          durationValue: 3
        },
        persistentConfig: {
          isPersistent: true,
          persistentType: 'dot',
          tickFrequency: 'end_of_turn'
        }
      }
    },
    {
      id: 'holyAura',
      name: 'Holy Aura',
      description: 'Protective aura that heals and buffs allies',
      category: 'combo',
      icon: 'spell_holy_divineillumination',
      config: {
        effectTypes: ['healing', 'buff'],
        healingConfig: {
          healingType: 'regeneration',
          diceNotation: '2d6',
          useAbsorptionShield: true,
          shieldConfig: {
            shieldType: 'standard',
            shieldAmount: '2d8'
          }
        },
        buffConfig: {
          statModifiers: {
            'save_bonus': 2,
            'spell_resistance': 10
          }
        },
        targetingConfig: {
          targetingType: 'area',
          areaShape: 'sphere',
          areaSize: 30,
          affectedTypes: ['allies']
        },
        durationConfig: {
          durationType: 'minutes',
          durationValue: 10,
          requiresConcentration: true
        }
      }
    }
  ];
  
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'damage', name: 'Damage' },
    { id: 'healing', name: 'Healing' },
    { id: 'buff', name: 'Buff' },
    { id: 'debuff', name: 'Debuff' },
    { id: 'combo', name: 'Combination' }
  ];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);
  
  const applyTemplate = (template) => {
    dispatch({
      type: 'APPLY_TEMPLATE',
      payload: template.config
    });
    
    // Update wizard flow
    dispatch({
      type: 'SET_WIZARD_FLOW',
      payload: getWizardFlow(template.config.effectTypes)
    });
  };
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="template-selection">
        <div className="section-intro">
          <h2>Choose a Template (Optional)</h2>
          <p>
            Start with a pre-made template or skip this step to build your effect from scratch.
            Templates provide a quick starting point that you can customize further.
          </p>
        </div>
        
        <div className="category-filter">
          <span className="filter-label">Filter by type:</span>
          <div className="filter-options">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="templates-grid">
          {filteredTemplates.map(template => (
            <div key={template.id} className="template-card">
              <div className="template-header">
                <img src={getWowIconPath(template.icon)} alt={template.name} className="template-icon" />
                <h3>{template.name}</h3>
              </div>
              <p className="template-description">{template.description}</p>
              <div className="template-details">
                <div className="effect-types">
                  {template.config.effectTypes.map(effectId => {
                    const effect = EFFECT_TYPES.find(e => e.id === effectId);
                    return effect ? (
                      <span key={effectId} className="effect-badge">
                        {effect.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <div className="template-ap-cost">
                  AP Cost: {calculateTemplateCost(template.config)}
                </div>
              </div>
              <button 
                className="apply-template-btn"
                onClick={() => applyTemplate(template)}
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
        
        <div className="skip-section">
          <p>Want to build your effect from scratch?</p>
          <button className="skip-btn">Skip Template Selection</button>
        </div>
      </div>
    </WizardStepContainer>
  );
};

// Helper function to calculate template cost
const calculateTemplateCost = (config) => {
  // Simple estimation based on effect types
  let cost = config.effectTypes.reduce((total, effectId) => {
    const effect = EFFECT_TYPES.find(e => e.id === effectId);
    return total + (effect ? effect.actionPointCost : 0);
  }, 0);
  
  // Add duration cost
  if (config.durationConfig?.durationType && config.durationConfig.durationType !== 'instant') {
    cost += 1;
  }
  
  // Add persistent cost
  if (config.persistentConfig?.isPersistent) {
    cost += 1;
  }
  
  return Math.max(1, cost);
};

// Map step IDs to components
export const WIZARD_PAGES = {
  // Main effect selection
  effectTypeSelection: EffectTypeSelectionPage,
  templateSelection: TemplateSelectionPage,
  
  // Damage pages
  damageTypeSelection: DamageTypeSelectionPage,
  damageAmount: DamageAmountPage,
  damageEnhancements: DamageEnhancementsPage,
  damageCriticalEffects: DamageCriticalEffectsPage,
  damageChaining: DamageChainPage,
  
  // Healing pages
  healingAmount: HealingAmountPage,
  healingEnhancements: HealingEnhancementsPage,
  healingCriticalEffects: HealingCriticalEffectsPage,
  healingChaining: HealingChainPage,
  healingOverTime: HealingOverTimePage,
  
  // Buff pages
  buffPrimaryStats: BuffPrimaryStatsPage,
  buffSecondaryStats: BuffSecondaryStatsPage,
  buffCombatStats: BuffCombatStatsPage,
  buffSpellPower: SpellPowerBuffPage,
  buffResistances: ResistancesBuffPage,
  buffStatusEffects: BuffStatusEffectsPage,
  
  // Debuff pages
  debuffPrimaryStats: DebuffPrimaryStatsPage,
  debuffSecondaryStats: DebuffSecondaryStatsPage,
  debuffCombatStats: DebuffCombatStatsPage,
  debuffStatusEffects: DebuffStatusEffectsPage,
  
  // Utility pages
  utilitySelection: UtilitySelectionPage,
  
  // Common pages
  durationSettings: DurationSettingsPage,
  persistentEffects: PersistentEffectsPage,
  reviewEffect: ReviewEffectPage
};