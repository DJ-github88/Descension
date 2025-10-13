/**
 * Class Spell Generator
 * 
 * Programmatically generates all 81 class spells (3 per class for 27 classes)
 * Based on class specializations and spell archetypes
 */

import { CLASS_SPECIALIZATIONS } from './classSpellCategories';

// Spell archetype templates for different specialization types
const SPELL_ARCHETYPES = {
  // Damage archetypes
  damage_direct: {
    effectTypes: ['damage'],
    spellType: 'ACTION',
    damageConfig: {
      damageType: 'direct',
      formula: '2d8 + 4',
      hasDotEffect: false,
      savingThrow: {
        enabled: false
      },
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '1d6',
        explodingDice: false
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 50,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 25, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 3, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  },

  damage_aoe: {
    effectTypes: ['damage'],
    spellType: 'ACTION',
    damageConfig: {
      damageType: 'direct',
      formula: '3d6 + 3',
      hasDotEffect: false,
      savingThrow: {
        enabled: true,
        attribute: 'agility',
        difficulty: 14,
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '1d4',
        explodingDice: false
      }
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 15,
      range: 60,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 35, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 4, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  },

  damage_dot: {
    effectTypes: ['damage'],
    spellType: 'ACTION',
    damageConfig: {
      damageType: 'direct',
      formula: '1d6 + 2',
      hasDotEffect: true,
      dotFormula: '1d4 + 2',
      dotDuration: 12,
      dotTickType: 'round',
      dotApplication: 'start',
      savingThrow: {
        enabled: false
      },
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 45,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 20, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 3, charges: 1 },
    durationConfig: {
      type: 'duration',
      value: 12,
      unit: 'rounds'
    }
  },

  // Channeled damage spell
  damage_channeled: {
    effectTypes: ['damage'],
    spellType: 'CHANNELED',
    damageConfig: {
      damageType: 'channeled',
      formula: '2d6 + 3',
      channelDuration: 4,
      ticksPerRound: 2,
      tickFormula: '1d6 + 2',
      interruptible: true,
      savingThrow: {
        enabled: false
      },
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },
    targetingConfig: {
      targetingType: 'cone',
      aoeType: 'cone',
      aoeSize: 30,
      range: 30,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 30, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 5, charges: 1 },
    durationConfig: {
      type: 'channeled',
      value: 4,
      unit: 'rounds'
    }
  },

  // Healing archetypes
  healing_direct: {
    effectTypes: ['healing'],
    spellType: 'ACTION',
    healingConfig: {
      healingType: 'direct',
      formula: '3d8 + 4',
      hasHotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '1d6'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 40,
      validTargets: ['ally', 'self']
    },
    resourceCost: { mana: 28, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 4, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  },

  healing_aoe: {
    effectTypes: ['healing'],
    spellType: 'ACTION',
    healingConfig: {
      healingType: 'area',
      formula: '2d8 + spirit / 2',
      maxTargets: 4
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 25,
      range: 35,
      validTargets: ['ally', 'self']
    },
    resourceCost: { mana: 40, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 5, charges: 1 }
  },

  healing_hot: {
    effectTypes: ['healing'],
    spellType: 'ACTION',
    healingConfig: {
      healingType: 'direct',
      formula: '2d6 + 3',
      hasHotEffect: true,
      hotConfig: {
        duration: 15,
        tickFormula: '1d6 + 2',
        tickFrequency: 'start'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally', 'self']
    },
    resourceCost: { mana: 30, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 4, charges: 1 }
  },

  // Buff archetypes
  buff_self: {
    effectTypes: ['buff'],
    spellType: 'ACTION',
    buffConfig: {
      buffType: 'enhancement',
      duration: 5,
      durationValue: 5,
      durationType: 'rounds',
      durationUnit: 'rounds',
      buffs: [
        {
          name: 'Empowerment',
          description: 'Increases Intelligence and Spirit',
          duration: 5,
          effects: {
            statBonuses: [
              { stat: 'intelligence', amount: 4, type: 'flat' },
              { stat: 'spirit', amount: 2, type: 'flat' }
            ]
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    resourceCost: { mana: 25, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 6, charges: 1 },
    durationConfig: {
      type: 'duration',
      value: 5,
      unit: 'rounds'
    }
  },

  buff_ally: {
    effectTypes: ['buff'],
    spellType: 'ACTION',
    buffConfig: {
      buffType: 'protection',
      duration: 4,
      durationValue: 4,
      durationType: 'rounds',
      durationUnit: 'rounds',
      buffs: [
        {
          name: 'Protective Ward',
          description: 'Increases Constitution and Agility, grants damage resistance',
          duration: 4,
          effects: {
            statBonuses: [
              { stat: 'constitution', amount: 3, type: 'flat' },
              { stat: 'agility', amount: 2, type: 'flat' }
            ],
            damageReduction: 2
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 40,
      validTargets: ['ally', 'self']
    },
    resourceCost: { mana: 22, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 5, charges: 1 },
    durationConfig: {
      type: 'duration',
      value: 4,
      unit: 'rounds'
    }
  },

  buff_aoe: {
    effectTypes: ['buff'],
    spellType: 'ACTION',
    buffConfig: {
      buffType: 'enhancement',
      duration: 20,
      durationType: 'seconds',
      effects: ['group_enhancement'],
      areaEffect: true
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 20,
      range: 30,
      validTargets: ['ally', 'self']
    },
    resourceCost: { mana: 30, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 7, charges: 1 }
  },

  // Debuff archetypes
  debuff_single: {
    effectTypes: ['debuff'],
    spellType: 'ACTION',
    debuffConfig: {
      debuffType: 'weakness',
      duration: 15,
      durationType: 'seconds',
      effects: ['reduced_damage', 'slowed']
    },
    targetingConfig: {
      targetingType: 'single',
      range: 45,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 18, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 4, charges: 1 }
  },

  debuff_aoe: {
    effectTypes: ['debuff'],
    spellType: 'ACTION',
    debuffConfig: {
      debuffType: 'weakness',
      duration: 12,
      durationType: 'seconds',
      effects: ['area_weakness'],
      areaEffect: true
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 18,
      range: 40,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 25, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 5, charges: 1 }
  },

  // Utility archetypes
  utility_movement: {
    effectTypes: ['utility', 'movement'],
    movementConfig: {
      movementType: 'teleport',
      distance: 30,
      requiresLoS: true,
      effects: ['instant_movement', 'no_opportunity_attacks']
    },
    targetingConfig: {
      targetingType: 'ground',
      range: 30,
      validTargets: ['self']
    },
    resourceCost: { mana: 15, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 3, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  },

  utility_control: {
    effectTypes: ['control', 'debuff'],
    controlConfig: {
      controlType: 'root',
      duration: 3,
      durationType: 'rounds',
      effects: ['immobilized', 'cannot_move'],
      savingThrow: {
        enabled: true,
        attribute: 'strength',
        difficulty: 14,
        onSuccess: 'half_duration',
        onFailure: 'full_duration'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 40,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 20, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 6, charges: 1 },
    durationConfig: {
      type: 'duration',
      value: 3,
      unit: 'rounds'
    }
  },

  utility_special: {
    effectTypes: ['utility'],
    spellType: 'ACTION',
    utilityConfig: {
      utilityType: 'special',
      effects: ['unique_class_ability']
    },
    targetingConfig: {
      targetingType: 'special',
      range: 50,
      validTargets: ['any']
    },
    resourceCost: { mana: 25, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 8, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  },

  // ===== NEW DIVERSE ARCHETYPES =====

  // AOE Cone damage
  damage_aoe_cone: {
    effectTypes: ['damage'],
    spellType: 'ACTION',
    damageConfig: {
      damageType: 'direct',
      formula: '4d6 + 3',
      hasDotEffect: false,
      savingThrow: {
        enabled: true,
        attribute: 'agility',
        difficulty: 14,
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '2d6',
        explodingDice: true
      }
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'cone',
      aoeSize: 30,
      range: 30,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 30, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 4, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  },

  // Reaction spell with trigger
  damage_reaction: {
    effectTypes: ['damage'],
    spellType: 'REACTION',
    damageConfig: {
      damageType: 'direct',
      formula: '3d8 + 4',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['enemy']
    },
    triggerConfig: {
      global: {
        logicType: 'OR',
        compoundTriggers: [
          {
            id: 'on_damage_taken',
            name: 'When you take damage',
            parameters: {
              damageThreshold: 10,
              damageTypes: ['any']
            }
          }
        ]
      },
      effectTriggers: {},
      conditionalEffects: {},
      triggerRole: {
        mode: 'REACTIVE',
        activationDelay: 0,
        requiresLOS: true
      }
    },
    resourceCost: { mana: 20, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 2, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  },

  // Control spell with stun
  control_stun: {
    effectTypes: ['control', 'debuff'],
    spellType: 'ACTION',
    controlConfig: {
      controlType: 'stun',
      duration: 2,
      durationType: 'rounds',
      effects: ['stunned', 'cannot_act', 'cannot_move'],
      savingThrow: {
        enabled: true,
        attribute: 'constitution',
        difficulty: 15,
        onSuccess: 'negates',
        onFailure: 'full_duration'
      },
      breakOnDamage: false,
      diminishingReturns: true
    },
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 35, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 8, charges: 1 },
    durationConfig: {
      type: 'duration',
      value: 2,
      unit: 'rounds'
    }
  },

  // Trap spell
  trap_explosive: {
    effectTypes: ['damage', 'control'],
    spellType: 'TRAP',
    damageConfig: {
      damageType: 'direct',
      formula: '5d6 + 4',
      hasDotEffect: false,
      savingThrow: {
        enabled: true,
        attribute: 'agility',
        difficulty: 14,
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      }
    },
    controlConfig: {
      controlType: 'slow',
      duration: 2,
      durationType: 'rounds',
      effects: ['slowed', 'movement_reduced_50']
    },
    targetingConfig: {
      targetingType: 'ground',
      aoeType: 'sphere',
      aoeSize: 10,
      range: 40,
      validTargets: ['enemy']
    },
    triggerConfig: {
      global: {
        logicType: 'OR',
        compoundTriggers: [
          {
            id: 'enemy_enters_area',
            name: 'When enemy enters area',
            parameters: {
              radius: 5,
              triggerOnce: false
            }
          }
        ]
      }
    },
    resourceCost: { mana: 25, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 6, charges: 2 },
    durationConfig: {
      type: 'duration',
      value: 60,
      unit: 'seconds'
    }
  },

  // Summoning spell
  summoning_creature: {
    effectTypes: ['summoning'],
    spellType: 'ACTION',
    summonConfig: {
      creatures: ['elemental_guardian', 'spirit_wolf'],
      duration: 10,
      durationUnit: 'minutes',
      hasDuration: true,
      concentration: true,
      quantity: 1,
      maxQuantity: 2,
      controlRange: 60,
      controlType: 'verbal',
      difficultyLevel: 'moderate',
      summonStats: {
        health: 50,
        ac: 14,
        strength: 14,
        agility: 12,
        constitution: 14
      },
      summonAttacks: [
        {
          name: 'Claw',
          damage: '1d8 + 3',
          damageType: 'slashing',
          range: 5
        }
      ],
      summonAbilities: [
        {
          name: 'Pack Tactics',
          description: 'Advantage on attacks if ally is within 5ft of target'
        }
      ]
    },
    targetingConfig: {
      targetingType: 'ground',
      range: 30,
      validTargets: ['empty_space']
    },
    resourceCost: { mana: 45, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 10, charges: 1 },
    durationConfig: {
      type: 'duration',
      value: 10,
      unit: 'minutes'
    }
  },

  // Transformation spell
  transformation_beast: {
    effectTypes: ['transformation'],
    spellType: 'ACTION',
    transformConfig: {
      transformType: 'beast_form',
      formId: 'dire_wolf',
      targetType: 'self',
      duration: 10,
      durationUnit: 'minutes',
      concentration: true,
      maintainEquipment: false,
      difficultyClass: 15,
      difficultyCr: 'moderate',
      saveType: 'spirit',
      grantedAbilities: ['bite_attack', 'pack_tactics', 'keen_hearing'],
      statChanges: {
        strength: 17,
        agility: 15,
        constitution: 15
      }
    },
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    resourceCost: { mana: 40, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 12, charges: 1 },
    durationConfig: {
      type: 'duration',
      value: 10,
      unit: 'minutes'
    }
  },

  // Wild Magic with rollable table
  wild_magic_table: {
    effectTypes: ['damage', 'healing', 'buff', 'debuff'],
    spellType: 'ACTION',
    rollableTable: {
      enabled: true,
      name: 'Wild Magic Surge',
      description: 'Unpredictable magical effects',
      resolutionType: 'DICE',
      resolutionConfig: {
        diceType: 'd100'
      },
      entries: [
        {
          range: { min: 1, max: 20 },
          name: 'Chaotic Blast',
          description: 'Deal 4d6 chaos damage to target',
          effectType: 'damage',
          effectDetails: { formula: '4d6', damageType: 'chaos' }
        },
        {
          range: { min: 21, max: 40 },
          name: 'Wild Healing',
          description: 'Heal random ally for 3d8',
          effectType: 'healing',
          effectDetails: { formula: '3d8' }
        },
        {
          range: { min: 41, max: 60 },
          name: 'Chaos Shield',
          description: 'Gain +4 AC for 3 rounds',
          effectType: 'buff',
          effectDetails: { acBonus: 4, duration: 3 }
        },
        {
          range: { min: 61, max: 80 },
          name: 'Reality Warp',
          description: 'Teleport 30ft in random direction',
          effectType: 'utility',
          effectDetails: { distance: 30, direction: 'random' }
        },
        {
          range: { min: 81, max: 100 },
          name: 'Entropic Burst',
          description: 'Deal 6d6 to all creatures within 20ft',
          effectType: 'damage',
          effectDetails: { formula: '6d6', aoe: 20, damageType: 'chaos' }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['enemy', 'ally', 'self']
    },
    resourceCost: { mana: 35, health: 10, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 5, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  }
};

// Spell name templates for different themes
const SPELL_NAME_TEMPLATES = {
  fire: ['Infernal Blast', 'Flame Strike', 'Burning Surge'],
  ice: ['Frost Bolt', 'Ice Shard', 'Frozen Touch'],
  lightning: ['Lightning Bolt', 'Thunder Strike', 'Electric Surge'],
  holy: ['Divine Light', 'Sacred Strike', 'Holy Radiance'],
  shadow: ['Shadow Bolt', 'Dark Strike', 'Void Touch'],
  nature: ['Nature\'s Wrath', 'Thorn Strike', 'Wild Growth'],
  arcane: ['Arcane Missile', 'Magic Strike', 'Mystic Bolt'],
  chaos: ['Chaos Bolt', 'Random Strike', 'Entropy Wave'],
  time: ['Temporal Strike', 'Time Warp', 'Chronos Blast'],
  music: ['Sonic Blast', 'Harmonic Strike', 'Melody Wave'],
  luck: ['Lucky Strike', 'Fortune Bolt', 'Fate Touch'],
  protection: ['Divine Shield', 'Sacred Ward', 'Holy Barrier'],
  healing: ['Healing Light', 'Restoration', 'Sacred Mend'],
  enhancement: ['Power Boost', 'Enhancement', 'Empowerment'],
  movement: ['Swift Step', 'Phase Walk', 'Quick Dash'],
  control: ['Hold Person', 'Binding Strike', 'Control Wave']
};

// Generate spell ID
const generateSpellId = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
};

// Create a base spell template
const createBaseSpell = (name, description, className, specialization, icon, spellType = 'ACTION') => ({
  id: generateSpellId(name),
  name,
  description,
  className,
  specialization,
  source: 'class',
  icon,
  spellType,
  level: 1,
  tags: [className.toLowerCase(), specialization.replace(/_/g, ' ')], // Remove underscores from tags
  effectTypes: [],
  damageTypes: [],
  dateCreated: new Date().toISOString(),
  lastModified: new Date().toISOString()
});

// Generate all class spells
export const generateAllClassSpells = () => {
  const allSpells = {};

  Object.entries(CLASS_SPECIALIZATIONS).forEach(([className, classData]) => {
    allSpells[className] = [];

    classData.specializations.forEach((specialization, index) => {
      // Generate 3 spells per specialization with MAXIMUM variety
      let spellArchetypes = [];

      if (index === 0) {
        // First specialization: Damage-focused with variety
        spellArchetypes = ['damage_aoe_cone', 'damage_channeled', 'damage_reaction'];
      } else if (index === 1) {
        // Second specialization: Support/Utility with variety
        spellArchetypes = ['healing_hot', 'summoning_creature', 'transformation_beast'];
      } else {
        // Third specialization: Control/Special with variety
        spellArchetypes = ['control_stun', 'trap_explosive', 'wild_magic_table'];
      }

      spellArchetypes.forEach((archetypeKey, spellIndex) => {
        const archetype = SPELL_ARCHETYPES[archetypeKey];

        // Generate better spell names based on archetype and specialization
        const spellName = generateSpellName(specialization.name, archetypeKey, className);

        // Create more detailed descriptions based on archetype and specialization
        let description = '';
        const elementType = getElementTypeForSpecialization(specialization.id);

        if (archetypeKey === 'damage_direct') {
          description = `Unleash a focused blast of ${elementType} energy at a single target, dealing devastating damage.`;
        } else if (archetypeKey === 'damage_aoe') {
          const aoeSize = archetype.targetingConfig?.aoeSize || 15;
          description = `Channel ${elementType} power into a ${aoeSize}ft area, damaging all enemies caught in the blast.`;
        } else if (archetypeKey === 'damage_aoe_cone') {
          const aoeSize = archetype.targetingConfig?.aoeSize || 30;
          description = `Unleash a ${aoeSize}ft cone of ${elementType} energy, engulfing all enemies in front of you.`;
        } else if (archetypeKey === 'damage_dot') {
          const duration = archetype.damageConfig?.dotDuration || 12;
          description = `Afflict a target with ${elementType} energy, dealing damage over ${duration} rounds.`;
        } else if (archetypeKey === 'damage_channeled') {
          const channelDuration = archetype.damageConfig?.channelDuration || 4;
          description = `Channel a continuous stream of ${elementType} energy in a cone for ${channelDuration} rounds, damaging all enemies in the area.`;
        } else if (archetypeKey === 'damage_reaction') {
          description = `Instantly retaliate with ${elementType} energy when you take damage, striking back at your attacker.`;
        } else if (archetypeKey === 'healing_direct') {
          description = `Restore health to an ally with a surge of healing energy.`;
        } else if (archetypeKey === 'healing_aoe') {
          description = `Radiate healing energy in an area, mending wounds of all nearby allies.`;
        } else if (archetypeKey === 'healing_hot') {
          const duration = archetype.healingConfig?.hotDuration || 15;
          description = `Restore health over time, healing the target for ${duration} rounds.`;
        } else if (archetypeKey === 'buff_self') {
          description = `Enhance your own abilities with empowering magic, increasing Intelligence and Spirit.`;
        } else if (archetypeKey === 'buff_ally') {
          description = `Bolster an ally's capabilities with protective enchantments, increasing Constitution and Agility.`;
        } else if (archetypeKey === 'utility_control') {
          description = `Root an enemy in place, preventing movement for several rounds.`;
        } else if (archetypeKey === 'utility_movement') {
          const distance = archetype.movementConfig?.distance || 30;
          description = `Instantly teleport up to ${distance}ft to a target location.`;
        } else if (archetypeKey === 'control_stun') {
          const duration = archetype.controlConfig?.duration || 2;
          description = `Stun an enemy with ${elementType} power, rendering them unable to act for ${duration} rounds.`;
        } else if (archetypeKey === 'trap_explosive') {
          const aoeSize = archetype.targetingConfig?.aoeSize || 10;
          description = `Place an explosive ${elementType} trap that detonates in a ${aoeSize}ft radius when enemies approach.`;
        } else if (archetypeKey === 'summoning_creature') {
          const duration = archetype.summonConfig?.duration || 10;
          description = `Summon a ${elementType} creature to fight alongside you for ${duration} minutes.`;
        } else if (archetypeKey === 'transformation_beast') {
          const duration = archetype.transformConfig?.duration || 10;
          description = `Transform into a powerful ${elementType}-infused beast form for ${duration} minutes, gaining enhanced physical abilities.`;
        } else if (archetypeKey === 'wild_magic_table') {
          description = `Unleash chaotic ${elementType} magic with unpredictable effects - roll on the wild magic table to determine the outcome!`;
        } else {
          description = `Utilize specialized techniques unique to ${specialization.name.toLowerCase()}.`;
        }

        // Create base spell first
        const baseSpell = createBaseSpell(spellName, description, className, specialization.id, specialization.icon, 'ACTION');

        // Merge archetype config, ensuring archetype values override base values
        const spell = {
          ...baseSpell,
          ...archetype,
          // Ensure spellType from archetype overrides base
          spellType: archetype.spellType || baseSpell.spellType,
          // Preserve base spell metadata
          id: baseSpell.id,
          name: spellName,
          description,
          className,
          specialization: specialization.id,
          source: 'class',
          icon: specialization.icon,
          level: 1,
          tags: baseSpell.tags,
          dateCreated: baseSpell.dateCreated,
          lastModified: baseSpell.lastModified
        };

        // Customize based on specialization theme
        if (spell.damageConfig) {
          spell.damageConfig = {
            ...spell.damageConfig,
            elementType,
          };
          spell.damageTypes = [elementType];
        }

        // Remove duplicate tags (e.g., if targeting is 'self' and className is 'self')
        if (spell.tags) {
          spell.tags = [...new Set(spell.tags.map(tag => tag.toLowerCase()))];
        }

        // Adjust resource costs based on class theme
        if (className.includes('Mage') || className.includes('Wizard') || className.includes('Sorcerer')) {
          spell.resourceCost.mana = Math.floor(spell.resourceCost.mana * 1.2); // Mages use more mana
        } else if (className.includes('Warrior') || className.includes('Fighter')) {
          spell.resourceCost.stamina = Math.floor(spell.resourceCost.mana * 0.8); // Warriors use stamina
          spell.resourceCost.mana = Math.floor(spell.resourceCost.mana * 0.5);
        }

        allSpells[className].push(spell);
      });
    });
  });

  return allSpells;
};

// Helper function to generate spell names based on archetype and specialization
const generateSpellName = (specializationName, archetypeKey, className) => {
  const nameTemplates = {
    damage_direct: ['Bolt', 'Strike', 'Blast', 'Shot', 'Lance'],
    damage_aoe: ['Storm', 'Nova', 'Eruption', 'Wave', 'Barrage'],
    damage_aoe_cone: ['Breath', 'Cone', 'Spray', 'Gust', 'Sweep'],
    damage_dot: ['Curse', 'Blight', 'Plague', 'Corruption', 'Affliction'],
    damage_channeled: ['Beam', 'Stream', 'Torrent', 'Breath', 'Channel'],
    damage_reaction: ['Retaliation', 'Counterstrike', 'Vengeance', 'Retort', 'Riposte'],
    healing_direct: ['Mend', 'Restore', 'Heal', 'Cure', 'Renewal'],
    healing_aoe: ['Radiance', 'Aura', 'Circle', 'Blessing', 'Sanctuary'],
    healing_hot: ['Regeneration', 'Rejuvenation', 'Recovery', 'Vitality', 'Renewal'],
    buff_self: ['Empowerment', 'Fortitude', 'Vigor', 'Enhancement', 'Ascension'],
    buff_ally: ['Ward', 'Aegis', 'Shield', 'Protection', 'Blessing'],
    utility_control: ['Bind', 'Snare', 'Slow', 'Root', 'Entangle'],
    utility_movement: ['Dash', 'Leap', 'Blink', 'Shift', 'Phase'],
    utility_special: ['Manipulation', 'Mastery', 'Control', 'Command', 'Dominion'],
    control_stun: ['Shock', 'Stun', 'Daze', 'Paralyze', 'Freeze'],
    trap_explosive: ['Trap', 'Mine', 'Snare', 'Ambush', 'Explosive'],
    summoning_creature: ['Summon', 'Call', 'Conjure', 'Invoke', 'Manifest'],
    transformation_beast: ['Form', 'Shape', 'Aspect', 'Transformation', 'Metamorphosis'],
    wild_magic_table: ['Chaos', 'Entropy', 'Flux', 'Surge', 'Anomaly']
  };

  const template = nameTemplates[archetypeKey] || ['Spell'];
  const suffix = template[Math.floor(Math.random() * template.length)];

  // Use first word of specialization name for cleaner spell names
  const specPrefix = specializationName.split(' ')[0];

  return `${specPrefix} ${suffix}`;
};

// Helper function to determine element type based on specialization
const getElementTypeForSpecialization = (specializationId) => {
  const elementMap = {
    fire_mastery: 'fire',
    corruption_stages: 'shadow', // Fixed: was necrotic, should be shadow
    demonic_power: 'shadow',
    harmonic_weaving: 'sonic',
    chord_combinations: 'sonic',
    musical_magic: 'sonic',
    temporal_control: 'temporal',
    time_manipulation: 'temporal',
    chronos_energy: 'temporal',
    reality_bending: 'chaos',
    entropy_control: 'chaos',
    chaos_dice: 'chaos',
    luck_manipulation: 'fortune',
    risk_management: 'fortune',
    fate_control: 'fortune',
    divine_protection: 'holy',
    holy_wrath: 'holy',
    sacred_healing: 'holy',
    divine_magic: 'holy',
    healing_arts: 'holy',
    sacred_rituals: 'holy'
  };

  return elementMap[specializationId] || 'force';
};

// Export the generated spells
export const ALL_CLASS_SPELLS = generateAllClassSpells();
