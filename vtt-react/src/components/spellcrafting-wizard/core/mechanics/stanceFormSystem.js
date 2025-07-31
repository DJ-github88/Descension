/**
 * Stance/Form System
 * 
 * Provides support for stance and form mechanics:
 * - Druid forms (Bear, Cat, Moonkin, Tree)
 * - Warrior stances (Battle, Defensive, Berserker)
 * - Rogue stealth
 * - Custom stance/form systems
 */

// World of Warcraft forms and stances
export const WOW_FORMS = {
  // Druid forms
  DRUID: {
    BEAR_FORM: {
      id: 'bear_form',
      name: 'Bear Form',
      description: 'Shapeshift into a bear, increasing armor and health, and generating threat.',
      icon: 'ability_racial_bearform',
      color: '#8B4513', // Saddle brown
      statModifiers: {
        armor: 4.0,
        stamina: 1.25,
        threat: 2.0
      },
      resourceType: 'rage',
      allowedSpellTypes: ['bear', 'feral', 'utility'],
      restrictedSpellTypes: ['humanoid', 'caster', 'cat', 'moonkin', 'tree'],
      specialAbilities: [
        'maul', 'swipe', 'growl', 'bash', 'feral_charge'
      ]
    },
    CAT_FORM: {
      id: 'cat_form',
      name: 'Cat Form',
      description: 'Shapeshift into a cat, increasing attack speed and critical strike chance.',
      icon: 'ability_druid_catform',
      color: '#FF7F50', // Coral
      statModifiers: {
        agility: 1.5,
        attackSpeed: 1.3,
        criticalStrike: 1.2
      },
      resourceType: 'energy',
      comboPointSystem: 'wow_rogue_combo',
      allowedSpellTypes: ['cat', 'feral', 'utility'],
      restrictedSpellTypes: ['humanoid', 'caster', 'bear', 'moonkin', 'tree'],
      specialAbilities: [
        'claw', 'rake', 'rip', 'ferocious_bite', 'pounce'
      ]
    },
    MOONKIN_FORM: {
      id: 'moonkin_form',
      name: 'Moonkin Form',
      description: 'Shapeshift into a moonkin, increasing spell damage and providing an aura that increases spell critical strike chance.',
      icon: 'spell_nature_forceofnature',
      color: '#4169E1', // Royal blue
      statModifiers: {
        spellDamage: 1.15,
        armor: 3.0
      },
      resourceType: 'mana',
      allowedSpellTypes: ['moonkin', 'balance', 'arcane', 'nature', 'utility'],
      restrictedSpellTypes: ['humanoid', 'feral', 'bear', 'cat', 'tree'],
      specialAbilities: [
        'wrath', 'starfire', 'hurricane', 'moonfire', 'insect_swarm'
      ],
      aura: {
        name: 'Moonkin Aura',
        effect: 'Increases spell critical strike chance by 5% for all party members within 30 yards.'
      }
    },
    TREE_FORM: {
      id: 'tree_form',
      name: 'Tree of Life',
      description: 'Shapeshift into a tree, increasing healing power and providing an aura that increases healing received.',
      icon: 'ability_druid_treeoflife',
      color: '#32CD32', // Lime green
      statModifiers: {
        healing: 1.15,
        armor: 2.0
      },
      resourceType: 'mana',
      allowedSpellTypes: ['tree', 'restoration', 'healing', 'nature', 'utility'],
      restrictedSpellTypes: ['humanoid', 'feral', 'bear', 'cat', 'moonkin'],
      specialAbilities: [
        'rejuvenation', 'regrowth', 'healing_touch', 'tranquility', 'lifebloom'
      ],
      aura: {
        name: 'Tree of Life Aura',
        effect: 'Increases healing received by 6% for all party members within 30 yards.'
      }
    }
  },
  
  // Warrior stances
  WARRIOR: {
    BATTLE_STANCE: {
      id: 'battle_stance',
      name: 'Battle Stance',
      description: 'A balanced combat stance that allows the use of various offensive abilities.',
      icon: 'ability_warrior_offensivestate',
      color: '#CD5C5C', // Indian red
      statModifiers: {
        damage: 1.0,
        criticalStrike: 1.03
      },
      resourceType: 'rage',
      allowedSpellTypes: ['battle', 'offensive', 'utility'],
      restrictedSpellTypes: ['defensive', 'berserker'],
      specialAbilities: [
        'overpower', 'mocking_blow', 'retaliation', 'charge'
      ]
    },
    DEFENSIVE_STANCE: {
      id: 'defensive_stance',
      name: 'Defensive Stance',
      description: 'A protective combat stance that reduces damage taken but also reduces damage dealt.',
      icon: 'ability_warrior_defensivestance',
      color: '#4682B4', // Steel blue
      statModifiers: {
        damage: 0.9,
        damageTaken: 0.9,
        threat: 1.3
      },
      resourceType: 'rage',
      allowedSpellTypes: ['defensive', 'protection', 'utility'],
      restrictedSpellTypes: ['battle', 'berserker'],
      specialAbilities: [
        'shield_slam', 'shield_block', 'disarm', 'taunt'
      ]
    },
    BERSERKER_STANCE: {
      id: 'berserker_stance',
      name: 'Berserker Stance',
      description: 'A frenzied combat stance that increases damage and critical strike chance but also increases damage taken.',
      icon: 'ability_racial_avatar',
      color: '#B22222', // Firebrick
      statModifiers: {
        damage: 1.1,
        criticalStrike: 1.03,
        damageTaken: 1.1
      },
      resourceType: 'rage',
      allowedSpellTypes: ['berserker', 'fury', 'utility'],
      restrictedSpellTypes: ['battle', 'defensive'],
      specialAbilities: [
        'intercept', 'berserker_rage', 'recklessness', 'whirlwind'
      ]
    }
  },
  
  // Rogue stealth
  ROGUE: {
    STEALTH: {
      id: 'stealth',
      name: 'Stealth',
      description: 'Conceals you from sight, allowing you to sneak up on enemies and use special opening moves.',
      icon: 'ability_stealth',
      color: '#800080', // Purple
      statModifiers: {
        movementSpeed: 0.7
      },
      resourceType: 'energy',
      allowedSpellTypes: ['stealth', 'opener', 'utility'],
      restrictedSpellTypes: ['normal', 'finisher'],
      specialAbilities: [
        'ambush', 'garrote', 'cheap_shot', 'sap', 'pickpocket'
      ],
      breakOnAction: true,
      breakOnDamage: true
    }
  },
  
  // Priest shadow form
  PRIEST: {
    SHADOWFORM: {
      id: 'shadowform',
      name: 'Shadowform',
      description: 'Assume a shadowy form, increasing your Shadow damage but preventing you from casting Holy spells.',
      icon: 'spell_shadow_shadowform',
      color: '#9370DB', // Medium purple
      statModifiers: {
        shadowDamage: 1.15,
        physicalDamageTaken: 0.85
      },
      resourceType: 'mana',
      allowedSpellTypes: ['shadow', 'discipline', 'utility'],
      restrictedSpellTypes: ['holy', 'healing'],
      specialAbilities: [
        'mind_blast', 'mind_flay', 'vampiric_touch', 'shadow_word_pain'
      ]
    }
  }
};

// Custom forms and stances
export const CUSTOM_FORMS = {
  ELEMENTAL_ATTUNEMENT: {
    FIRE_ATTUNEMENT: {
      id: 'fire_attunement',
      name: 'Fire Attunement',
      description: 'Attune yourself to the element of fire, gaining fire damage bonuses but becoming vulnerable to water.',
      icon: 'spell_fire_fire',
      color: '#FF4500', // Orange red
      statModifiers: {
        fireDamage: 1.3,
        waterResistance: 0.7
      },
      resourceType: 'mana',
      allowedSpellTypes: ['fire', 'elemental', 'utility'],
      restrictedSpellTypes: ['water', 'ice'],
      specialAbilities: [
        'fireball', 'flame_strike', 'fire_shield', 'heat_metal'
      ]
    },
    WATER_ATTUNEMENT: {
      id: 'water_attunement',
      name: 'Water Attunement',
      description: 'Attune yourself to the element of water, gaining water damage bonuses but becoming vulnerable to earth.',
      icon: 'spell_frost_frostbolt02',
      color: '#1E90FF', // Dodger blue
      statModifiers: {
        waterDamage: 1.3,
        earthResistance: 0.7
      },
      resourceType: 'mana',
      allowedSpellTypes: ['water', 'ice', 'elemental', 'utility'],
      restrictedSpellTypes: ['fire', 'earth'],
      specialAbilities: [
        'ice_lance', 'tidal_wave', 'frost_armor', 'water_breathing'
      ]
    },
    EARTH_ATTUNEMENT: {
      id: 'earth_attunement',
      name: 'Earth Attunement',
      description: 'Attune yourself to the element of earth, gaining earth damage bonuses but becoming vulnerable to air.',
      icon: 'spell_nature_earthquake',
      color: '#8B4513', // Saddle brown
      statModifiers: {
        earthDamage: 1.3,
        airResistance: 0.7
      },
      resourceType: 'mana',
      allowedSpellTypes: ['earth', 'elemental', 'utility'],
      restrictedSpellTypes: ['air', 'lightning'],
      specialAbilities: [
        'stone_spike', 'earthquake', 'stoneskin', 'entangling_roots'
      ]
    },
    AIR_ATTUNEMENT: {
      id: 'air_attunement',
      name: 'Air Attunement',
      description: 'Attune yourself to the element of air, gaining air damage bonuses but becoming vulnerable to fire.',
      icon: 'spell_nature_cyclone',
      color: '#87CEEB', // Sky blue
      statModifiers: {
        airDamage: 1.3,
        fireResistance: 0.7
      },
      resourceType: 'mana',
      allowedSpellTypes: ['air', 'lightning', 'elemental', 'utility'],
      restrictedSpellTypes: ['earth', 'water'],
      specialAbilities: [
        'lightning_bolt', 'gust_of_wind', 'chain_lightning', 'levitate'
      ]
    }
  },
  COMBAT_STANCES: {
    AGGRESSIVE_STANCE: {
      id: 'aggressive_stance',
      name: 'Aggressive Stance',
      description: 'An offensive combat stance that increases damage but reduces defense.',
      icon: 'ability_warrior_offensivestate',
      color: '#FF4500', // Orange red
      statModifiers: {
        damage: 1.2,
        defense: 0.8
      },
      resourceType: 'stamina',
      allowedSpellTypes: ['offensive', 'attack', 'utility'],
      restrictedSpellTypes: ['defensive', 'healing'],
      specialAbilities: [
        'power_attack', 'reckless_strike', 'intimidate', 'battle_cry'
      ]
    },
    DEFENSIVE_STANCE: {
      id: 'defensive_stance',
      name: 'Defensive Stance',
      description: 'A defensive combat stance that increases defense but reduces damage.',
      icon: 'ability_warrior_defensivestance',
      color: '#4682B4', // Steel blue
      statModifiers: {
        damage: 0.8,
        defense: 1.2
      },
      resourceType: 'stamina',
      allowedSpellTypes: ['defensive', 'block', 'utility'],
      restrictedSpellTypes: ['offensive', 'attack'],
      specialAbilities: [
        'shield_block', 'parry', 'defensive_stance', 'taunt'
      ]
    },
    BALANCED_STANCE: {
      id: 'balanced_stance',
      name: 'Balanced Stance',
      description: 'A balanced combat stance that provides moderate bonuses to both offense and defense.',
      icon: 'ability_warrior_battleshout',
      color: '#9370DB', // Medium purple
      statModifiers: {
        damage: 1.1,
        defense: 1.1
      },
      resourceType: 'stamina',
      allowedSpellTypes: ['balanced', 'utility', 'attack', 'defensive'],
      restrictedSpellTypes: [],
      specialAbilities: [
        'balanced_strike', 'counter_attack', 'feint', 'battle_awareness'
      ]
    }
  },
  MAGICAL_STANCES: {
    ARCANE_FOCUS: {
      id: 'arcane_focus',
      name: 'Arcane Focus',
      description: 'A magical stance that enhances arcane spells but weakens elemental magic.',
      icon: 'spell_arcane_arcane01',
      color: '#9966CC', // Amethyst
      statModifiers: {
        arcaneDamage: 1.3,
        elementalDamage: 0.8
      },
      resourceType: 'mana',
      allowedSpellTypes: ['arcane', 'utility', 'control'],
      restrictedSpellTypes: ['elemental', 'divine'],
      specialAbilities: [
        'arcane_missiles', 'arcane_explosion', 'arcane_intellect', 'polymorph'
      ]
    },
    ELEMENTAL_FOCUS: {
      id: 'elemental_focus',
      name: 'Elemental Focus',
      description: 'A magical stance that enhances elemental spells but weakens arcane magic.',
      icon: 'spell_fire_flamebolt',
      color: '#FF7F50', // Coral
      statModifiers: {
        elementalDamage: 1.3,
        arcaneDamage: 0.8
      },
      resourceType: 'mana',
      allowedSpellTypes: ['elemental', 'utility', 'damage'],
      restrictedSpellTypes: ['arcane', 'divine'],
      specialAbilities: [
        'fireball', 'frostbolt', 'lightning_bolt', 'elemental_shield'
      ]
    },
    DIVINE_FOCUS: {
      id: 'divine_focus',
      name: 'Divine Focus',
      description: 'A magical stance that enhances divine spells but weakens arcane and elemental magic.',
      icon: 'spell_holy_holybolt',
      color: '#FFD700', // Gold
      statModifiers: {
        divineDamage: 1.3,
        healing: 1.3,
        arcaneDamage: 0.8,
        elementalDamage: 0.8
      },
      resourceType: 'mana',
      allowedSpellTypes: ['divine', 'healing', 'utility'],
      restrictedSpellTypes: ['arcane', 'elemental'],
      specialAbilities: [
        'holy_light', 'divine_shield', 'blessing', 'smite'
      ]
    }
  }
};

// Combined forms and stances
export const ALL_FORMS = {
  WOW: WOW_FORMS,
  CUSTOM: CUSTOM_FORMS
};

/**
 * Get a form or stance by ID
 * @param {string} formId - The ID of the form to retrieve
 * @returns {Object} The form configuration
 */
export function getForm(formId) {
  // Search through all game systems and classes
  for (const gameSystem in ALL_FORMS) {
    for (const className in ALL_FORMS[gameSystem]) {
      for (const formKey in ALL_FORMS[gameSystem][className]) {
        const form = ALL_FORMS[gameSystem][className][formKey];
        if (form.id === formId) {
          return form;
        }
      }
    }
  }
  
  return null;
}

/**
 * Get all forms for a specific class and game system
 * @param {string} className - The class to retrieve forms for
 * @param {string} gameSystem - The game system to retrieve forms for
 * @returns {Array} Array of forms for the specified class and game system
 */
export function getFormsForClass(className, gameSystem = 'WOW') {
  if (ALL_FORMS[gameSystem] && ALL_FORMS[gameSystem][className]) {
    return Object.values(ALL_FORMS[gameSystem][className]);
  }
  return [];
}

/**
 * Check if a spell can be cast in a specific form
 * @param {Object} spellConfig - The spell configuration
 * @param {Object} formConfig - The form configuration
 * @returns {boolean} Whether the spell can be cast in the form
 */
export function canCastSpellInForm(spellConfig, formConfig) {
  if (!formConfig) return true;
  
  // Check if the spell type is allowed in this form
  const spellTypes = spellConfig.spellTypes || [];
  const allowedTypes = formConfig.allowedSpellTypes || [];
  const restrictedTypes = formConfig.restrictedSpellTypes || [];
  
  // If the spell has any restricted type, it cannot be cast
  if (spellTypes.some(type => restrictedTypes.includes(type))) {
    return false;
  }
  
  // If the form has allowed types and the spell has none of them, it cannot be cast
  if (allowedTypes.length > 0 && !spellTypes.some(type => allowedTypes.includes(type))) {
    return false;
  }
  
  return true;
}

/**
 * Apply form modifiers to a spell
 * @param {Object} spellConfig - The spell configuration
 * @param {Object} formConfig - The form configuration
 * @returns {Object} The modified spell configuration
 */
export function applyFormModifiersToSpell(spellConfig, formConfig) {
  if (!formConfig) return spellConfig;
  
  const modifiedSpell = { ...spellConfig };
  
  // Apply damage modifiers
  if (modifiedSpell.damageConfig && formConfig.statModifiers) {
    // Apply general damage modifier
    if (formConfig.statModifiers.damage) {
      modifiedSpell.damageConfig.damageMultiplier = 
        (modifiedSpell.damageConfig.damageMultiplier || 1) * formConfig.statModifiers.damage;
    }
    
    // Apply element-specific damage modifier
    const elementType = modifiedSpell.damageConfig.elementType;
    if (elementType && formConfig.statModifiers[`${elementType}Damage`]) {
      modifiedSpell.damageConfig.damageMultiplier = 
        (modifiedSpell.damageConfig.damageMultiplier || 1) * formConfig.statModifiers[`${elementType}Damage`];
    }
  }
  
  // Apply healing modifiers
  if (modifiedSpell.healingConfig && formConfig.statModifiers && formConfig.statModifiers.healing) {
    modifiedSpell.healingConfig.healingMultiplier = 
      (modifiedSpell.healingConfig.healingMultiplier || 1) * formConfig.statModifiers.healing;
  }
  
  // Apply resource cost modifiers
  if (modifiedSpell.resourceConfig && formConfig.resourceType) {
    // If the form uses a different resource type, update the spell's resource type
    if (modifiedSpell.resourceConfig.primaryResource !== formConfig.resourceType) {
      modifiedSpell.resourceConfig.primaryResource = formConfig.resourceType;
      
      // Adjust cost based on resource type
      switch (formConfig.resourceType) {
        case 'rage':
          modifiedSpell.resourceConfig.cost = Math.round(modifiedSpell.resourceConfig.cost * 0.1);
          break;
        case 'energy':
          modifiedSpell.resourceConfig.cost = Math.round(modifiedSpell.resourceConfig.cost * 0.5);
          break;
        case 'mana':
          // No adjustment needed for mana
          break;
      }
    }
  }
  
  return modifiedSpell;
}

/**
 * Generate form requirements for a spell
 * @param {Object} spellConfig - The spell configuration
 * @returns {Object} Form requirements for the spell
 */
export function generateFormRequirements(spellConfig) {
  const formRequirements = {
    requiredForms: [],
    restrictedForms: [],
    modifiedByForms: false
  };
  
  // Determine class based on spell types
  let className = null;
  const spellTypes = spellConfig.spellTypes || [];
  
  if (spellTypes.includes('druid') || 
      spellTypes.some(type => ['bear', 'cat', 'moonkin', 'tree', 'feral', 'balance', 'restoration'].includes(type))) {
    className = 'DRUID';
  } else if (spellTypes.includes('warrior') || 
             spellTypes.some(type => ['battle', 'defensive', 'berserker', 'protection', 'fury', 'arms'].includes(type))) {
    className = 'WARRIOR';
  } else if (spellTypes.includes('rogue') || 
             spellTypes.some(type => ['stealth', 'opener', 'finisher', 'poison'].includes(type))) {
    className = 'ROGUE';
  } else if (spellTypes.includes('priest') || 
             spellTypes.some(type => ['shadow', 'holy', 'discipline'].includes(type))) {
    className = 'PRIEST';
  }
  
  if (className) {
    const classForms = WOW_FORMS[className];
    if (classForms) {
      // Check each form for this class
      for (const formKey in classForms) {
        const form = classForms[formKey];
        
        // Check if this spell requires this form
        if (form.specialAbilities && form.specialAbilities.includes(spellConfig.id)) {
          formRequirements.requiredForms.push(form.id);
          formRequirements.modifiedByForms = true;
        }
        
        // Check if this spell is restricted in this form
        if (form.restrictedSpellTypes && 
            spellTypes.some(type => form.restrictedSpellTypes.includes(type))) {
          formRequirements.restrictedForms.push(form.id);
        }
      }
    }
  }
  
  // Check custom forms
  for (const categoryKey in CUSTOM_FORMS) {
    const category = CUSTOM_FORMS[categoryKey];
    for (const formKey in category) {
      const form = category[formKey];
      
      // Check if this spell requires this form
      if (form.specialAbilities && form.specialAbilities.includes(spellConfig.id)) {
        formRequirements.requiredForms.push(form.id);
        formRequirements.modifiedByForms = true;
      }
      
      // Check if this spell is restricted in this form
      if (form.restrictedSpellTypes && 
          spellTypes.some(type => form.restrictedSpellTypes.includes(type))) {
        formRequirements.restrictedForms.push(form.id);
      }
    }
  }
  
  return formRequirements;
}
