/**
 * Proc System
 * 
 * Provides support for proc-based effects:
 * - Critical strike procs
 * - On-hit procs
 * - Periodic procs
 * - Chance-based procs
 */

// Proc trigger types
export const PROC_TRIGGERS = {
  CRITICAL_STRIKE: {
    id: 'critical_strike',
    name: 'Critical Strike',
    description: 'Triggers when you land a critical strike with a spell or attack.',
    icon: 'ability_criticalstrike',
    examples: ['Ignite', 'Deep Wounds', 'Flurry', 'Brutal Critical']
  },
  
  ON_HIT: {
    id: 'on_hit',
    name: 'On Hit',
    description: 'Triggers when you successfully hit a target with a spell or attack.',
    icon: 'ability_warrior_savageblow',
    examples: ['Windfury', 'Sword Specialization', 'Divine Smite', 'Sneak Attack']
  },
  
  ON_DAMAGE: {
    id: 'on_damage',
    name: 'On Damage',
    description: 'Triggers when you deal damage to a target.',
    icon: 'ability_warrior_bloodbath',
    examples: ['Vampiric Touch', 'Judgement of Light', 'Life Transference', 'Hex']
  },
  
  ON_HEAL: {
    id: 'on_heal',
    name: 'On Heal',
    description: 'Triggers when you heal a target.',
    icon: 'spell_holy_flashheal',
    examples: ['Inspiration', 'Blessing of Light', 'Disciple of Life', 'Blessed Healer']
  },
  
  PERIODIC: {
    id: 'periodic',
    name: 'Periodic',
    description: 'Triggers at regular intervals while an effect is active.',
    icon: 'spell_nature_rejuvenation',
    examples: ['Rejuvenation', 'Corruption', 'Heat Metal', 'Spirit Guardians']
  },
  
  ON_CAST: {
    id: 'on_cast',
    name: 'On Cast',
    description: 'Triggers when you cast a spell.',
    icon: 'spell_holy_holybolt',
    examples: ['Clearcasting', 'Surge of Light', 'War Caster', 'Spell Sniper']
  },
  
  ON_DODGE: {
    id: 'on_dodge',
    name: 'On Dodge',
    description: 'Triggers when you dodge an attack.',
    icon: 'ability_rogue_feint',
    examples: ['Riposte', 'Overpower', 'Uncanny Dodge', 'Deflect Missiles']
  },
  
  ON_BLOCK: {
    id: 'on_block',
    name: 'On Block',
    description: 'Triggers when you block an attack with a shield.',
    icon: 'ability_defend',
    examples: ['Shield Slam', 'Holy Shield', 'Shield Master', 'Protection Fighting Style']
  },
  
  ON_KILL: {
    id: 'on_kill',
    name: 'On Kill',
    description: 'Triggers when you kill a target.',
    icon: 'ability_rogue_murderspree',
    examples: ['Soul Harvest', 'Improved Soul Leech', 'Grim Harvest', 'Dark One\'s Blessing']
  },
  
  CHANCE_BASED: {
    id: 'chance_based',
    name: 'Chance Based',
    description: 'Has a chance to trigger on a specific action.',
    icon: 'spell_nature_wispsplode',
    examples: ['Fiery Weapon', 'Nightfall', 'Wild Magic Surge', 'Portent']
  }
};

// Proc effect types
export const PROC_EFFECTS = {
  DAMAGE: {
    id: 'damage_proc',
    name: 'Damage',
    description: 'Deals additional damage to the target.',
    icon: 'spell_fire_fireball',
    examples: ['Ignite', 'Deep Wounds', 'Divine Smite', 'Sneak Attack'],
    configOptions: {
      damageType: ['physical', 'fire', 'frost', 'arcane', 'nature', 'shadow', 'holy'],
      damageAmount: 'formula',
      damageScaling: ['flat', 'percentage', 'weapon_damage', 'spell_power']
    }
  },
  
  HEALING: {
    id: 'healing_proc',
    name: 'Healing',
    description: 'Heals you or an ally.',
    icon: 'spell_holy_flashheal',
    examples: ['Judgement of Light', 'Vampiric Embrace', 'Healing Spirit', 'Life Transference'],
    configOptions: {
      healingAmount: 'formula',
      healingScaling: ['flat', 'percentage', 'spell_power'],
      targetSelection: ['self', 'original_target', 'lowest_health', 'random_ally']
    }
  },
  
  RESOURCE_GAIN: {
    id: 'resource_gain_proc',
    name: 'Resource Gain',
    description: 'Restores a resource such as mana, rage, or energy.',
    icon: 'spell_magic_managain',
    examples: ['Clearcasting', 'Rage Generation', 'Arcane Recovery', 'Font of Magic'],
    configOptions: {
      resourceType: ['mana', 'rage', 'energy', 'focus', 'runic_power', 'spell_slots', 'ki', 'superiority_dice'],
      resourceAmount: 'formula',
      resourceScaling: ['flat', 'percentage', 'level_based']
    }
  },
  
  BUFF: {
    id: 'buff_proc',
    name: 'Buff',
    description: 'Applies a positive effect to you or an ally.',
    icon: 'spell_holy_powerwordshield',
    examples: ['Inspiration', 'Flurry', 'Bardic Inspiration', 'Bless'],
    configOptions: {
      buffType: ['stat_increase', 'damage_increase', 'critical_chance', 'haste', 'damage_reduction'],
      buffAmount: 'formula',
      buffDuration: 'formula',
      targetSelection: ['self', 'original_target', 'random_ally']
    }
  },
  
  DEBUFF: {
    id: 'debuff_proc',
    name: 'Debuff',
    description: 'Applies a negative effect to an enemy.',
    icon: 'spell_shadow_curseofsargeras',
    examples: ['Demoralizing Shout', 'Thunder Clap', 'Hex', 'Slow'],
    configOptions: {
      debuffType: ['stat_reduction', 'damage_taken_increase', 'movement_speed', 'attack_speed', 'healing_reduction'],
      debuffAmount: 'formula',
      debuffDuration: 'formula',
      targetSelection: ['original_target', 'random_enemy', 'all_enemies']
    }
  },
  
  CONTROL: {
    id: 'control_proc',
    name: 'Control',
    description: 'Applies a crowd control effect to an enemy.',
    icon: 'spell_frost_chainsofice',
    examples: ['Impact', 'Concussion Blow', 'Hold Person', 'Stunning Strike'],
    configOptions: {
      controlType: ['stun', 'root', 'slow', 'fear', 'silence', 'disarm'],
      controlDuration: 'formula',
      targetSelection: ['original_target', 'random_enemy']
    }
  },
  
  SUMMON: {
    id: 'summon_proc',
    name: 'Summon',
    description: 'Summons a creature or object to assist you.',
    icon: 'spell_shadow_demonform',
    examples: ['Mirror Image', 'Dancing Rune Weapon', 'Conjure Animals', 'Animate Objects'],
    configOptions: {
      summonType: ['elemental', 'undead', 'beast', 'demon', 'copy', 'object'],
      summonDuration: 'formula',
      summonCount: 'formula'
    }
  },
  
  AREA_EFFECT: {
    id: 'area_effect_proc',
    name: 'Area Effect',
    description: 'Creates an area effect that damages or affects multiple targets.',
    icon: 'spell_fire_flameshock',
    examples: ['Living Bomb', 'Consecration', 'Fireball', 'Spirit Guardians'],
    configOptions: {
      areaType: ['explosion', 'persistent', 'pulsing'],
      areaShape: ['circle', 'cone', 'line'],
      areaSize: 'formula',
      effectType: ['damage', 'healing', 'control', 'buff', 'debuff'],
      effectAmount: 'formula',
      effectDuration: 'formula'
    }
  },
  
  CHAIN_EFFECT: {
    id: 'chain_effect_proc',
    name: 'Chain Effect',
    description: 'Jumps to additional targets after affecting the primary target.',
    icon: 'spell_frost_chainofdamnation',
    examples: ['Chain Lightning', 'Chain Heal', 'Magic Missile', 'Eldritch Blast'],
    configOptions: {
      chainType: ['damage', 'healing', 'control', 'buff', 'debuff'],
      chainAmount: 'formula',
      chainCount: 'formula',
      chainFalloff: 'percentage'
    }
  }
};

// Proc chance types
export const PROC_CHANCE_TYPES = {
  PERCENTAGE: {
    id: 'percentage_chance',
    name: 'Percentage Chance',
    description: 'Has a flat percentage chance to trigger.',
    examples: ['5% chance to trigger on hit', '15% chance to trigger on critical strike']
  },
  
  PPM: {
    id: 'procs_per_minute',
    name: 'Procs Per Minute',
    description: 'Has a chance to trigger based on a rate of procs per minute, adjusted by weapon speed.',
    examples: ['1 proc per minute', '4 procs per minute']
  },
  
  GUARANTEED: {
    id: 'guaranteed',
    name: 'Guaranteed',
    description: 'Always triggers when the condition is met.',
    examples: ['Always triggers on critical strike', 'Always triggers when you kill an enemy']
  },
  
  STACKING: {
    id: 'stacking_chance',
    name: 'Stacking Chance',
    description: 'Has an increasing chance to trigger with each attempt until it succeeds.',
    examples: ['5% chance, stacking up to 100%', '20% chance, stacking by 20% each time']
  },
  
  CONDITIONAL: {
    id: 'conditional',
    name: 'Conditional',
    description: 'Triggers when specific conditions are met.',
    examples: ['Triggers when target is below 20% health', 'Triggers when you have 3 or more combo points']
  }
};

/**
 * Get a proc trigger by ID
 * @param {string} triggerId - The ID of the trigger to retrieve
 * @returns {Object} The proc trigger configuration
 */
export function getProcTrigger(triggerId) {
  return PROC_TRIGGERS[triggerId.toUpperCase()] || null;
}

/**
 * Get a proc effect by ID
 * @param {string} effectId - The ID of the effect to retrieve
 * @returns {Object} The proc effect configuration
 */
export function getProcEffect(effectId) {
  return PROC_EFFECTS[effectId.toUpperCase()] || null;
}

/**
 * Get a proc chance type by ID
 * @param {string} chanceTypeId - The ID of the chance type to retrieve
 * @returns {Object} The proc chance type configuration
 */
export function getProcChanceType(chanceTypeId) {
  return PROC_CHANCE_TYPES[chanceTypeId.toUpperCase()] || null;
}

/**
 * Generate a proc configuration for a spell
 * @param {Object} spellConfig - The spell configuration
 * @returns {Object} Proc configuration for the spell
 */
export function generateProcConfig(spellConfig) {
  const procConfig = {
    enabled: false,
    triggers: [],
    effects: [],
    chanceType: 'percentage_chance',
    chanceValue: 0
  };
  
  // Determine if the spell should have procs based on its characteristics
  const { effectTypes, damageConfig, healingConfig } = spellConfig;
  
  // Damage spells often have damage procs
  if (effectTypes.includes('damage') && damageConfig) {
    // Elemental damage often has elemental procs
    if (damageConfig.elementType === 'fire') {
      procConfig.enabled = true;
      procConfig.triggers.push('critical_strike');
      procConfig.effects.push({
        type: 'damage_proc',
        damageType: 'fire',
        damageAmount: '40% of spell damage',
        damageScaling: 'percentage',
        description: 'Your critical strikes with Fire spells cause the target to burn for additional Fire damage over 4 sec.'
      });
      procConfig.chanceType = 'guaranteed';
      procConfig.chanceValue = 100;
    } else if (damageConfig.elementType === 'frost') {
      procConfig.enabled = true;
      procConfig.triggers.push('on_hit');
      procConfig.effects.push({
        type: 'debuff_proc',
        debuffType: 'movement_speed',
        debuffAmount: '30%',
        debuffDuration: '4 sec',
        targetSelection: 'original_target',
        description: 'Your Frost spells have a chance to reduce the target\'s movement speed by 30% for 4 sec.'
      });
      procConfig.chanceType = 'percentage_chance';
      procConfig.chanceValue = 15;
    }
  }
  
  // Healing spells often have healing procs
  if (effectTypes.includes('healing') && healingConfig) {
    procConfig.enabled = true;
    procConfig.triggers.push('on_heal');
    procConfig.effects.push({
      type: 'buff_proc',
      buffType: 'stat_increase',
      buffAmount: '5% Spell Power',
      buffDuration: '15 sec',
      targetSelection: 'self',
      description: 'Your healing spells have a chance to increase your Spell Power by 5% for 15 sec.'
    });
    procConfig.chanceType = 'percentage_chance';
    procConfig.chanceValue = 10;
  }
  
  return procConfig;
}

/**
 * Calculate proc effect based on trigger and base effect
 * @param {Object} procConfig - The proc configuration
 * @param {Object} triggerEvent - The event that triggered the proc
 * @param {Object} baseEffect - The base effect to modify
 * @returns {Object} The calculated proc effect
 */
export function calculateProcEffect(procConfig, triggerEvent, baseEffect) {
  if (!procConfig || !procConfig.enabled || !triggerEvent || !baseEffect) {
    return baseEffect;
  }
  
  // Check if the trigger matches any of the proc's triggers
  if (!procConfig.triggers.includes(triggerEvent.type)) {
    return baseEffect;
  }
  
  // Check if the proc should trigger based on chance
  if (procConfig.chanceType === 'percentage_chance') {
    const roll = Math.random() * 100;
    if (roll > procConfig.chanceValue) {
      return baseEffect; // Proc didn't trigger
    }
  } else if (procConfig.chanceType === 'procs_per_minute') {
    // PPM formula: chance = (PPM * weapon_speed) / 60
    const ppm = procConfig.chanceValue;
    const weaponSpeed = triggerEvent.weaponSpeed || 2.0; // Default to 2.0 if not provided
    const chance = (ppm * weaponSpeed) / 60 * 100;
    
    const roll = Math.random() * 100;
    if (roll > chance) {
      return baseEffect; // Proc didn't trigger
    }
  } else if (procConfig.chanceType === 'conditional') {
    // Check if the condition is met
    if (!triggerEvent.conditions || !triggerEvent.conditions[procConfig.condition]) {
      return baseEffect; // Condition not met
    }
  }
  
  // Proc triggered, apply effects
  const modifiedEffect = { ...baseEffect };
  
  // Apply each proc effect
  for (const effect of procConfig.effects) {
    switch (effect.type) {
      case 'damage_proc':
        // Add damage proc
        if (!modifiedEffect.additionalDamage) {
          modifiedEffect.additionalDamage = [];
        }
        
        modifiedEffect.additionalDamage.push({
          type: effect.damageType,
          amount: calculateProcAmount(effect.damageAmount, effect.damageScaling, baseEffect, triggerEvent),
          description: effect.description
        });
        break;
        
      case 'healing_proc':
        // Add healing proc
        if (!modifiedEffect.additionalHealing) {
          modifiedEffect.additionalHealing = [];
        }
        
        modifiedEffect.additionalHealing.push({
          amount: calculateProcAmount(effect.healingAmount, effect.healingScaling, baseEffect, triggerEvent),
          target: effect.targetSelection,
          description: effect.description
        });
        break;
        
      case 'buff_proc':
        // Add buff proc
        if (!modifiedEffect.additionalBuffs) {
          modifiedEffect.additionalBuffs = [];
        }
        
        modifiedEffect.additionalBuffs.push({
          type: effect.buffType,
          amount: effect.buffAmount,
          duration: effect.buffDuration,
          target: effect.targetSelection,
          description: effect.description
        });
        break;
        
      case 'debuff_proc':
        // Add debuff proc
        if (!modifiedEffect.additionalDebuffs) {
          modifiedEffect.additionalDebuffs = [];
        }
        
        modifiedEffect.additionalDebuffs.push({
          type: effect.debuffType,
          amount: effect.debuffAmount,
          duration: effect.debuffDuration,
          target: effect.targetSelection,
          description: effect.description
        });
        break;
        
      // Add other effect types as needed
    }
  }
  
  return modifiedEffect;
}

/**
 * Calculate the amount of a proc effect
 * @param {string} amountFormula - The formula for calculating the amount
 * @param {string} scaling - The scaling method
 * @param {Object} baseEffect - The base effect
 * @param {Object} triggerEvent - The event that triggered the proc
 * @returns {number} The calculated amount
 */
function calculateProcAmount(amountFormula, scaling, baseEffect, triggerEvent) {
  // Handle percentage-based scaling
  if (scaling === 'percentage' && amountFormula.includes('%')) {
    const percentageMatch = amountFormula.match(/(\d+)%/);
    if (percentageMatch) {
      const percentage = parseInt(percentageMatch[1]) / 100;
      
      // Scale based on the base effect's damage or healing
      if (baseEffect.damage) {
        return baseEffect.damage * percentage;
      } else if (baseEffect.healing) {
        return baseEffect.healing * percentage;
      }
    }
  }
  
  // Handle weapon damage scaling
  if (scaling === 'weapon_damage' && triggerEvent.weaponDamage) {
    const multiplierMatch = amountFormula.match(/(\d+(\.\d+)?)x/);
    if (multiplierMatch) {
      const multiplier = parseFloat(multiplierMatch[1]);
      return triggerEvent.weaponDamage * multiplier;
    }
  }
  
  // Handle spell power scaling
  if (scaling === 'spell_power' && triggerEvent.spellPower) {
    const multiplierMatch = amountFormula.match(/(\d+(\.\d+)?)x/);
    if (multiplierMatch) {
      const multiplier = parseFloat(multiplierMatch[1]);
      return triggerEvent.spellPower * multiplier;
    }
  }
  
  // Handle flat values
  const flatValueMatch = amountFormula.match(/^(\d+)$/);
  if (flatValueMatch) {
    return parseInt(flatValueMatch[1]);
  }
  
  // Default fallback
  return 0;
}
