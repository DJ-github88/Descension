import { isValidDiceNotation } from './DiceRules';

export const WIZARD_STEPS = {
  // Core steps
  effectTypeSelection: {
    id: 'effectTypeSelection',
    title: 'Select Effect Types',
    description: 'Choose the core effects for your spell',
    icon: 'spell_arcane_arcane02'
  },
  templateSelection: {
    id: 'templateSelection',
    title: 'Choose a Template',
    description: 'Optionally start with a pre-made template',
    icon: 'spell_holy_divineillumination'
  },
  
  // Damage steps
  damageTypeSelection: {
    id: 'damageTypeSelection',
    title: 'Select Damage Types',
    description: 'Choose the types of damage this effect deals',
    icon: 'spell_fire_flamebolt',
    category: 'damage'
  },
  damageAmount: {
    id: 'damageAmount',
    title: 'Set Damage Amount',
    description: 'Configure how much damage is dealt',
    icon: 'spell_fire_flamestrike',
    category: 'damage'
  },
  damageEnhancements: {
    id: 'damageEnhancements',
    title: 'Damage Enhancements',
    description: 'Add special properties to your damage',
    icon: 'spell_fire_immolation',
    category: 'damage'
  },
  damageCriticalEffects: {
    id: 'damageCriticalEffects',
    title: 'Critical Effects',
    description: 'Configure critical hit bonuses',
    icon: 'ability_rogue_findweakness',
    category: 'damage'
  },
  damageChaining: {
    id: 'damageChaining',
    title: 'Chain Effects',
    description: 'Configure how damage chains between targets',
    icon: 'spell_frost_chainofdamnation',
    category: 'damage'
  },
  
  // Healing steps
  healingAmount: {
    id: 'healingAmount',
    title: 'Set Healing Amount',
    description: 'Configure how much healing is provided',
    icon: 'spell_holy_flashheal',
    category: 'healing'
  },
  healingEnhancements: {
    id: 'healingEnhancements',
    title: 'Healing Enhancements',
    description: 'Add special properties to your healing',
    icon: 'spell_holy_divineillumination',
    category: 'healing'
  },
  healingChaining: {
    id: 'healingChaining',
    title: 'Chain Healing',
    description: 'Configure how healing chains between targets',
    icon: 'spell_frost_chainheal',
    category: 'healing'
  },
  
  // Buff steps
  buffPrimaryStats: {
    id: 'buffPrimaryStats',
    title: 'Primary Stat Buffs',
    description: 'Enhance primary attributes',
    icon: 'spell_holy_greaterblessingofkings',
    category: 'buff'
  },
  buffSecondaryStats: {
    id: 'buffSecondaryStats',
    title: 'Secondary Stat Buffs',
    description: 'Enhance secondary attributes',
    icon: 'spell_holy_blessingofprotection',
    category: 'buff'
  },
  buffCombatStats: {
    id: 'buffCombatStats',
    title: 'Combat Stat Buffs',
    description: 'Enhance combat capabilities',
    icon: 'spell_holy_avenginewrath',
    category: 'buff'
  },
  buffSpellPower: {
    id: 'buffSpellPower',
    title: 'Spell Power Buffs',
    description: 'Enhance spellcasting power',
    icon: 'spell_holy_divineillumination',
    category: 'buff'
  },
  buffResistances: {
    id: 'buffResistances',
    title: 'Resistance Buffs',
    description: 'Enhance damage resistances',
    icon: 'spell_holy_devotionaura',
    category: 'buff'
  },
  buffStatusEffects: {
    id: 'buffStatusEffects',
    title: 'Status Effects',
    description: 'Apply positive status effects',
    icon: 'spell_holy_innerfire',
    category: 'buff'
  },
  
  // Debuff steps
  debuffPrimaryStats: {
    id: 'debuffPrimaryStats',
    title: 'Primary Stat Debuffs',
    description: 'Reduce primary attributes',
    icon: 'spell_shadow_curseofachimonde',
    category: 'debuff'
  },
  debuffSecondaryStats: {
    id: 'debuffSecondaryStats',
    title: 'Secondary Stat Debuffs',
    description: 'Reduce secondary attributes',
    icon: 'spell_shadow_antishadow',
    category: 'debuff'
  },
  debuffCombatStats: {
    id: 'debuffCombatStats',
    title: 'Combat Stat Debuffs',
    description: 'Reduce combat capabilities',
    icon: 'spell_shadow_deathscream',
    category: 'debuff'
  },
  debuffStatusEffects: {
    id: 'debuffStatusEffects',
    title: 'Status Effects',
    description: 'Apply negative status effects',
    icon: 'spell_shadow_curseofsargeras',
    category: 'debuff'
  },
  
  // Utility steps
  utilitySelection: {
    id: 'utilitySelection',
    title: 'Utility Effects',
    description: 'Configure non-combat utility effects',
    icon: 'spell_nature_polymorph',
    category: 'utility'
  },
  
  // Final steps
  durationSettings: {
    id: 'durationSettings',
    title: 'Duration Settings',
    description: 'Configure how long the effect lasts',
    icon: 'spell_holy_innerfire'
  },
  persistentEffects: {
    id: 'persistentEffects',
    title: 'Persistent Effects',
    description: 'Configure effects that occur over time',
    icon: 'spell_holy_renew'
  },
  targetingConfig: {
    id: 'targetingConfig',
    title: 'Targeting Configuration',
    description: 'Configure how targets are selected',
    icon: 'ability_hunter_snipershot'
  },
  reviewEffect: {
    id: 'reviewEffect',
    title: 'Review Effect',
    description: 'Review the complete effect configuration',
    icon: 'spell_arcane_arcane02'
  }
};

export function getWizardFlow(selectedEffectTypes = []) {
  const flow = ['effectTypeSelection'];
  
  // Add template selection if any effects are selected
  if (selectedEffectTypes.length > 0) {
    flow.push('templateSelection');
  }
  
  // Add damage-related steps if damage is selected
  if (selectedEffectTypes.includes('damage')) {
    flow.push('damageTypeSelection', 'damageAmount');
    flow.push('damageEnhancements');
    flow.push('damageCriticalEffects');
    flow.push('damageChaining');
  }
  
  // Add healing-related steps if healing is selected
  if (selectedEffectTypes.includes('healing')) {
    flow.push('healingAmount');
    flow.push('healingEnhancements');
    flow.push('healingChaining');
  }
  
  // Add buff-related steps if buff is selected
  if (selectedEffectTypes.includes('buff')) {
    flow.push('buffPrimaryStats');
    flow.push('buffSecondaryStats');
    flow.push('buffCombatStats');
    flow.push('buffSpellPower');
    flow.push('buffResistances');
    flow.push('buffStatusEffects');
  }
  
  // Add debuff-related steps if debuff is selected
  if (selectedEffectTypes.includes('debuff')) {
    flow.push('debuffPrimaryStats');
    flow.push('debuffSecondaryStats');
    flow.push('debuffCombatStats');
    flow.push('debuffStatusEffects');
  }
  
  // Add utility-related steps if utility is selected
  if (selectedEffectTypes.includes('utility')) {
    flow.push('utilitySelection');
  }
  
  // Add final configuration steps if any effects are selected
  if (selectedEffectTypes.length > 0) {
    flow.push('durationSettings');
    flow.push('persistentEffects');
    flow.push('targetingConfig');
    flow.push('reviewEffect');
  }
  
  return flow;
}

export function validateStep(stepId, state) {
  switch (stepId) {
    case 'effectTypeSelection':
      return state.effectTypes.length > 0;
      
    case 'templateSelection':
      // Always valid, it's optional
      return true;
      
    case 'damageTypeSelection':
      return state.damageConfig.damageTypes.length > 0;
      
    case 'damageAmount':
      return state.damageConfig.diceNotation && isValidDiceNotation(state.damageConfig.diceNotation);
      
    case 'damageEnhancements':
      // Always valid, enhancements are optional
      return true;
      
    case 'damageCriticalEffects':
      // If critical effects are enabled, validate them
      if (state.damageConfig.useCriticalEffect) {
        return state.damageConfig.criticalConfig.criticalMultiplier > 0;
      }
      return true;
      
    case 'damageChaining':
      // If chaining is enabled, validate chain settings
      if (state.damageConfig.useChainEffect) {
        return state.damageConfig.chainConfig.targets > 1 && 
               state.damageConfig.chainConfig.falloffRate >= 0;
      }
      return true;
      
    case 'healingAmount':
      return state.healingConfig.diceNotation && isValidDiceNotation(state.healingConfig.diceNotation);
      
    case 'healingEnhancements':
      // If absorption shield is enabled, validate shield settings
      if (state.healingConfig.useAbsorptionShield) {
        return state.healingConfig.shieldConfig.shieldType && 
               isValidDiceNotation(state.healingConfig.shieldConfig.shieldAmount);
      }
      return true;
      
    case 'healingChaining':
      // No specific validation for healing chains
      return true;
      
    case 'buffPrimaryStats':
    case 'buffSecondaryStats':
    case 'buffCombatStats':
    case 'buffSpellPower':
    case 'buffResistances':
      // These steps are valid if any relevant stat mods are set or if no mods chosen (it's optional)
      return true;
      
    case 'buffStatusEffects':
      // Valid if any effects are selected or none (it's optional)
      return true;
      
    case 'debuffPrimaryStats':
    case 'debuffSecondaryStats':
    case 'debuffCombatStats':
      // These steps are valid if any relevant stat mods are set or if no mods chosen (it's optional)
      return true;
      
    case 'debuffStatusEffects':
      // Valid if any effects are selected or none (it's optional)
      return true;
      
    case 'utilitySelection':
      // If utility is selected, a utility type must be chosen
      return state.utilityConfig.utilityType !== null;
      
    case 'durationSettings':
      // Duration settings must include a valid duration type
      return state.durationConfig.durationType !== null;
      
    case 'persistentEffects':
      // If persistent, check tick configuration
      if (state.persistentConfig.isPersistent) {
        return state.persistentConfig.tickFrequency !== null;
      }
      return true;
      
    case 'targetingConfig':
      // Must have a targeting type selected
      return state.targetingConfig.targetingType !== null;
      
    case 'reviewEffect':
      // Final review is always valid if we got this far
      return true;
      
    default:
      return false;
  }
}

export function getStepStatus(stepId, currentStepId, flow, state) {
  const stepIndex = flow.indexOf(stepId);
  const currentIndex = flow.indexOf(currentStepId);
  
  if (stepIndex === -1) {
    return 'disabled'; // Step not in flow
  }
  
  if (stepIndex < currentIndex) {
    // Step has been visited, check if it's valid
    return validateStep(stepId, state) ? 'completed' : 'invalid';
  }
  
  if (stepIndex === currentIndex) {
    return 'current';
  }
  
  // Steps ahead of current
  const prevStepValid = stepIndex === 0 || validateStep(flow[stepIndex - 1], state);
  return prevStepValid ? 'upcoming' : 'disabled';
}

export function getStepInfo(stepId) {
  const step = WIZARD_STEPS[stepId];
  if (!step) {
    return {
      title: 'Unknown Step',
      description: 'This step is not recognized',
      icon: 'inv_misc_questionmark'
    };
  }
  
  return {
    title: step.title,
    description: step.description,
    icon: step.icon,
    category: step.category
  };
}

export function getPreviousStep(currentStepId, flow) {
  const currentIndex = flow.indexOf(currentStepId);
  if (currentIndex <= 0) {
    return null;
  }
  return flow[currentIndex - 1];
}

export function getNextStep(currentStepId, flow) {
  const currentIndex = flow.indexOf(currentStepId);
  if (currentIndex === -1 || currentIndex === flow.length - 1) {
    return null;
  }
  return flow[currentIndex + 1];
}

export function canNavigateToStep(targetStepId, currentStepId, flow, state) {
  const targetIndex = flow.indexOf(targetStepId);
  const currentIndex = flow.indexOf(currentStepId);
  
  if (targetIndex === -1) {
    return false; // Step not in flow
  }
  
  // Can always navigate backward
  if (targetIndex < currentIndex) {
    return true;
  }
  
  // Can navigate to next step if current step is valid
  if (targetIndex === currentIndex + 1) {
    return validateStep(currentStepId, state);
  }
  
  // For steps further ahead, check if all previous steps are valid
  for (let i = 0; i < targetIndex; i++) {
    if (!validateStep(flow[i], state)) {
      return false;
    }
  }
  
  return true;
}