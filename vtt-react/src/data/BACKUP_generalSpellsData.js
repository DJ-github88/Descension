/**
 * General Spells Data
 *
 * Contains baseline spells/actions that are accessible regardless of class.
 * These represent fundamental combat and utility actions available to all characters.
 */

import { SKILL_BASED_ACTIONS, SKILL_ACTIONS_CATEGORY } from './skillBasedActionsData';

// Helper function to generate spell IDs
const generateSpellId = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-general';
};

// Helper function to create base general spell template
const createGeneralSpell = (name, description, spellType, actionPoints, icon) => ({
  id: generateSpellId(name),
  name,
  description,
  icon,
  spellType,
  source: 'general',
  tags: ['general', 'baseline'],
  effectTypes: [],
  damageTypes: [],
  resourceCost: {
    mana: 0,
    health: 0,
    stamina: 0,
    focus: 0,
    actionPoints: actionPoints
  },
  targetingConfig: {
    targetingType: 'single',
    range: 5,
    validTargets: ['enemy'],
    requiresLineOfSight: true
  },
  durationConfig: {
    type: 'instant',
    value: 0,
    unit: 'seconds',
    concentration: false
  },
  resolution: 'DICE',
  categoryIds: ['general_actions']
});

// General spells/actions available to all characters
export const GENERAL_SPELLS = [
  // === BASIC ACTIONS ===
  
  // Attack - Dynamic weapon-based attack
  {
    ...createGeneralSpell(
      'Attack',
      'Attack with precision and ferocity using your equipped weapon. Damage and properties depend on your currently equipped weapon.',
      'ACTION',
      2,
      'ability_warrior_savageblow'
    ),
    effectTypes: ['damage'],
    damageTypes: ['weapon_dependent'], // Special type that gets replaced with weapon damage type
    damageConfig: {
      damageType: 'weapon',
      elementType: 'physical',
      formula: 'WEAPON_DAMAGE', // Special formula that gets replaced with weapon damage
      weaponDependent: true,
      usesWeaponDice: true,
      addStrengthModifier: true
    },
    targetingConfig: {
      targetingType: 'single',
      range: 'WEAPON_RANGE', // Gets replaced with weapon range
      validTargets: ['enemy'],
      requiresLineOfSight: true
    },
    mechanicsConfig: {
      attackRoll: {
        enabled: true,
        attribute: 'strength', // Default, can be agility for finesse weapons
        proficiencyBonus: true,
        weaponProficiency: true
      },
      criticalHit: {
        enabled: true,
        critRange: 20,
        critMultiplier: 2
      }
    },
    enhancementConfig: {
      scalingType: 'attribute',
      scalingAttribute: 'strength',
      additionalEffects: {
        powerAttack: 'Spend 1-5 position points for +1 attack per point (max 5)',
        sweepAttack: 'Target additional foe within 1 space (costs player level x 2 position)',
        hamstring: 'Halve enemy movement for 1d4 rounds (costs player level x 1 position)'
      }
    }
  },

  // Object - Versatile interaction action
  {
    ...createGeneralSpell(
      'Object',
      'Your agility and quick thinking shine in a variety of actions: drinking a potion, picking a lock, disarming traps, passing items, or tossing objects with precision. Skill checks might be required.',
      'ACTION',
      1,
      'inv_misc_bag_08'
    ),
    effectTypes: ['utility'],
    targetingConfig: {
      targetingType: 'object',
      range: 10,
      validTargets: ['object', 'ally'],
      requiresLineOfSight: true
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skills: ['sleight_of_hand', 'athletics', 'acrobatics'],
        difficulty: 'variable',
        description: 'DC varies based on action complexity'
      }
    }
  },

  // Move - Battlefield movement
  {
    ...createGeneralSpell(
      'Move',
      'Swiftly navigate the battlefield, moving up to your speed in spaces.',
      'ACTION',
      1,
      'ability_rogue_sprint'
    ),
    effectTypes: ['movement'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      movement: {
        baseDistance: 'MOVEMENT_SPEED', // Gets replaced with character movement speed
        additionalDistance: 15, // Additional 15 ft for 1 more AP
        additionalCost: 1
      }
    },
    enhancementConfig: {
      additionalMovement: {
        cost: 1,
        distance: 15,
        description: '1 AP for additional 15 ft'
      }
    }
  },

  // Disengage - Tactical retreat
  {
    ...createGeneralSpell(
      'Disengage',
      'Carefully retreat from foes, preventing free strikes. Enemies gain disadvantage on attacks of opportunity. You may move up to 10 ft.',
      'ACTION',
      1,
      'ability_rogue_feint'
    ),
    effectTypes: ['movement', 'defensive'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      movement: {
        baseDistance: 10,
        preventOpportunityAttacks: true,
        disadvantageOnOpportunityAttacks: true
      },
      multipleEnemies: {
        cost: 2,
        description: '2 AP for multiple enemies'
      }
    }
  },

  // Hide - Stealth action
  {
    ...createGeneralSpell(
      'Hide',
      'Vanish from sight by blending into shadows or taking cover. Requires cover - you cannot hide from any enemy that can plainly see you.',
      'ACTION',
      2,
      'ability_stealth'
    ),
    effectTypes: ['stealth'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skills: ['stealth'],
        difficulty: 'passive_perception',
        description: 'Stealth roll vs opponents\' Passive Awareness',
        requirements: ['cover', 'not_plainly_visible']
      }
    }
  },

  // Shove - Physical contest
  {
    ...createGeneralSpell(
      'Shove',
      'Attempt to force an opponent back or off-balance with a strong push.',
      'ACTION',
      2,
      'ability_warrior_charge'
    ),
    effectTypes: ['control'],
    damageTypes: [],
    targetingConfig: {
      targetingType: 'single',
      range: 5,
      validTargets: ['enemy'],
      requiresLineOfSight: true
    },
    mechanicsConfig: {
      contestedCheck: {
        enabled: true,
        playerAttribute: 'strength',
        skill: 'athletics',
        opponentSave: 'strength',
        effects: {
          success: 'push_back_5ft',
          failure: 'no_effect'
        }
      }
    }
  },

  // Tackle - Charging attack
  {
    ...createGeneralSpell(
      'Tackle',
      'Charge with your shoulder to bring down an opponent, showcasing physical prowess and tactical acumen. Requires at least 10 ft of space to gain momentum.',
      'ACTION',
      2,
      'ability_warrior_charge'
    ),
    effectTypes: ['control'],
    targetingConfig: {
      targetingType: 'single',
      range: 10,
      validTargets: ['enemy'],
      requiresLineOfSight: true
    },
    mechanicsConfig: {
      contestedCheck: {
        enabled: true,
        playerAttribute: 'strength',
        skill: 'athletics',
        opponentSave: 'strength',
        requirements: ['10ft_movement_space'],
        effects: {
          success: 'prone',
          failure: 'no_effect'
        }
      }
    }
  },

  // Cast a Cantrip
  {
    ...createGeneralSpell(
      'Cast a Cantrip',
      'You cast a minor spell of your choosing.',
      'ACTION',
      1,
      'spell_arcane_arcane01'
    ),
    effectTypes: ['utility'],
    targetingConfig: {
      targetingType: 'variable',
      range: 'variable',
      validTargets: ['variable']
    },
    mechanicsConfig: {
      spellcasting: {
        spellLevel: 0,
        additionalCost: 2,
        additionalEffect: 'Additional cantrips cost 2 AP'
      }
    }
  },

  // Cast a Spell
  {
    ...createGeneralSpell(
      'Cast a Spell',
      'You cast a spell that is leveled.',
      'ACTION',
      2,
      'spell_arcane_arcane02'
    ),
    effectTypes: ['utility'],
    targetingConfig: {
      targetingType: 'variable',
      range: 'variable',
      validTargets: ['variable']
    },
    mechanicsConfig: {
      spellcasting: {
        spellLevel: '1+',
        additionalEffect: 'Additional spells gain disadvantage',
        disadvantageOnAdditional: true
      }
    }
  },

  // === ENHANCEMENT ACTIONS ===

  // Elemental Shift
  {
    ...createGeneralSpell(
      'Elemental Shift',
      'Alter the elemental nature of your spell to exploit vulnerabilities. Must be applied every time a spell is cast.',
      'ACTION',
      0,
      'spell_nature_elementalshields'
    ),
    effectTypes: ['enhancement'],
    resourceCost: {
      mana: 0,
      health: 0,
      stamina: 0,
      focus: 0,
      actionPoints: 0,
      energy: 'PLAYER_LEVEL * 2' // Special resource cost
    },
    targetingConfig: {
      targetingType: 'spell_enhancement',
      range: 0,
      validTargets: ['spell']
    },
    mechanicsConfig: {
      spellEnhancement: {
        requiresSpellCast: true,
        elementalTypes: ['fire', 'frost', 'arcane', 'nature', 'shadow', 'holy'],
        effect: 'change_damage_type'
      }
    }
  },

  // Channel Spell
  {
    ...createGeneralSpell(
      'Channel Spell',
      'Enhance a spell\'s effectiveness. Increase damage dice by one step (d6→d8→d10→d12 max) OR increase save DC by 2.',
      'ACTION',
      0,
      'spell_holy_innerfire'
    ),
    effectTypes: ['enhancement'],
    resourceCost: {
      mana: 0,
      health: 0,
      stamina: 0,
      focus: 0,
      actionPoints: 0,
      energy: 'PLAYER_LEVEL * 2'
    },
    targetingConfig: {
      targetingType: 'spell_enhancement',
      range: 0,
      validTargets: ['spell']
    },
    mechanicsConfig: {
      spellEnhancement: {
        requiresSpellCast: true,
        options: [
          {
            type: 'damage_dice_increase',
            description: 'Increase one damage die by one step (d6→d8→d10→d12 max)'
          },
          {
            type: 'save_dc_increase',
            description: 'Increase spell save DC by 2',
            value: 2
          }
        ]
      }
    }
  },

  // Minor Action
  {
    ...createGeneralSpell(
      'Minor Action',
      'Small actions matter: pick up an item, open a door quietly, or stow/draw your weapon.',
      'ACTION',
      0,
      'inv_misc_bag_10'
    ),
    effectTypes: ['utility'],
    targetingConfig: {
      targetingType: 'object',
      range: 5,
      validTargets: ['object', 'self']
    },
    mechanicsConfig: {
      firstFree: true,
      additionalCost: 1,
      description: '0 AP for first, 1 AP for additional'
    }
  },

  // Gain Advantage
  {
    ...createGeneralSpell(
      'Gain Advantage',
      'Focus your senses to seize opportunity.',
      'ACTION',
      1,
      'spell_holy_blessingofstrength'
    ),
    effectTypes: ['buff'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      advantage: {
        duration: 'next_action',
        type: 'general_advantage'
      }
    }
  },

  // Power Attack
  {
    ...createGeneralSpell(
      'Power Attack',
      'Focus your might for a devastating blow. Gain +1 to attack roll for each position point spent (up to 5 per swing). Requires an attack roll.',
      'ACTION',
      0,
      'ability_warrior_innerrage'
    ),
    effectTypes: ['enhancement'],
    resourceCost: {
      mana: 0,
      health: 0,
      stamina: 0,
      focus: 0,
      actionPoints: 0,
      energy: '1-5' // Variable cost
    },
    targetingConfig: {
      targetingType: 'attack_enhancement',
      range: 0,
      validTargets: ['attack']
    },
    mechanicsConfig: {
      attackEnhancement: {
        requiresAttackRoll: true,
        costRange: [1, 5],
        effect: '+1 attack roll per point spent',
        maxPoints: 5
      }
    }
  },

  // Sweep Attack
  {
    ...createGeneralSpell(
      'Sweep Attack',
      'Swiftly target an additional foe within 1 space of another. Requires an attack roll.',
      'ACTION',
      0,
      'ability_warrior_cleave'
    ),
    effectTypes: ['enhancement'],
    resourceCost: {
      mana: 0,
      health: 0,
      stamina: 0,
      focus: 0,
      actionPoints: 0,
      energy: 'PLAYER_LEVEL * 2'
    },
    targetingConfig: {
      targetingType: 'attack_enhancement',
      range: 5,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      attackEnhancement: {
        requiresAttackRoll: true,
        additionalTarget: true,
        targetRequirement: 'within_1_space_of_primary_target'
      }
    }
  },

  // Hamstring
  {
    ...createGeneralSpell(
      'Hamstring',
      'Slow your enemy\'s movement, halving their movement speed for 1d4 rounds. Requires an attack roll.',
      'ACTION',
      0,
      'ability_shaman_unleashedelements_frostbrand'
    ),
    effectTypes: ['debuff'],
    resourceCost: {
      mana: 0,
      health: 0,
      stamina: 0,
      focus: 0,
      actionPoints: 0,
      energy: 'PLAYER_LEVEL * 1'
    },
    targetingConfig: {
      targetingType: 'single',
      range: 5,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      attackEnhancement: {
        requiresAttackRoll: true,
        debuff: {
          type: 'movement_reduction',
          value: 0.5,
          duration: '1d4',
          durationUnit: 'rounds'
        }
      }
    }
  },

  // === REACTION ACTIONS ===

  // Help
  {
    ...createGeneralSpell(
      'Help',
      'Offer advice, gesture, or hint to grant ally 1d8 bonus to their next action. Applies if reasoning is accepted by the GM.',
      'REACTION',
      1,
      'spell_holy_heal'
    ),
    effectTypes: ['buff'],
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally']
    },
    mechanicsConfig: {
      buff: {
        type: 'dice_bonus',
        value: '1d8',
        duration: 'next_action',
        requiresGMApproval: true
      }
    }
  },

  // Evade
  {
    ...createGeneralSpell(
      'Evade',
      'Evade an attack by rolling 5 ft into a dodge. Must be used when prompted by GM. Gain position points equal to current level.',
      'REACTION',
      2,
      'ability_rogue_evasion'
    ),
    effectTypes: ['defensive', 'movement'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      trigger: 'when_attacked',
      movement: {
        type: 'dodge_roll',
        distance: 5,
        direction: 'any'
      },
      reward: {
        type: 'energy',
        value: 'PLAYER_LEVEL * 1'
      }
    }
  },

  // Opportunity Attack
  {
    ...createGeneralSpell(
      'Opportunity Attack',
      'React to enemy movement out of melee range, attacking them with disadvantage.',
      'REACTION',
      1,
      'ability_warrior_punishingblow'
    ),
    effectTypes: ['damage'],
    damageTypes: ['weapon_dependent'],
    targetingConfig: {
      targetingType: 'single',
      range: 5,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      trigger: 'enemy_leaves_melee_range',
      attackRoll: {
        enabled: true,
        disadvantage: true,
        attribute: 'strength'
      }
    }
  },

  // Interpose
  {
    ...createGeneralSpell(
      'Interpose',
      'When an ally within 10 ft is attacked, push them 5 ft to safety and take the hit yourself. STR Roll DC 10 - if failed, they fall prone.',
      'REACTION',
      1,
      'spell_holy_guardianspirit'
    ),
    effectTypes: ['defensive', 'movement'],
    targetingConfig: {
      targetingType: 'single',
      range: 10,
      validTargets: ['ally']
    },
    mechanicsConfig: {
      trigger: 'ally_attacked_within_range',
      skillCheck: {
        enabled: true,
        attribute: 'strength',
        difficulty: 10,
        onFailure: 'target_falls_prone'
      },
      movement: {
        targetMovement: 5,
        selfMovement: 'to_target_position'
      },
      additionalRange: {
        cost: 1,
        distance: 10,
        description: '+1 AP for each additional 10 ft'
      }
    }
  },

  // Parry
  {
    ...createGeneralSpell(
      'Parry',
      'Turn aside melee and ranged attacks. Make an opposed attack roll - if higher, negate the attack. Critical hits apply but deal no damage.',
      'REACTION',
      1,
      'ability_parry'
    ),
    effectTypes: ['defensive'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      trigger: 'when_attacked',
      opposedRoll: {
        enabled: true,
        playerAttribute: 'strength',
        vsAttackRoll: true,
        onSuccess: 'negate_attack',
        criticalHitsStillApply: true
      }
    }
  },

  // Riposte (follows Parry)
  {
    ...createGeneralSpell(
      'Riposte',
      'Seize the opening for a swift, retaliatory strike after a successful parry. Roll hit die with relevant modifiers vs opponent.',
      'REACTION',
      1,
      'ability_warrior_revenge'
    ),
    effectTypes: ['damage'],
    damageTypes: ['weapon_dependent'],
    targetingConfig: {
      targetingType: 'single',
      range: 5,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      trigger: 'successful_parry',
      attackRoll: {
        enabled: true,
        attribute: 'strength',
        weaponProficiency: true
      },
      chainedAction: {
        followsAction: 'Parry',
        automatic: false
      }
    }
  },

  // Raise Shield
  {
    ...createGeneralSpell(
      'Raise Shield',
      'Your shield absorbs the impact. Roll a d8 to determine how much damage was absorbed.',
      'REACTION',
      1,
      'ability_defend'
    ),
    effectTypes: ['defensive'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      trigger: 'when_attacked',
      requirements: ['equipped_shield'],
      damageReduction: {
        type: 'dice',
        value: '1d8',
        description: 'Roll d8 for damage absorbed'
      }
    }
  },

  // Shield Bash (follows Raise Shield)
  {
    ...createGeneralSpell(
      'Shield Bash',
      'Turn defense into offense with a shield bash, potentially stunning them. STR vs CON Save - if opponent fails, stunned until end of next turn.',
      'REACTION',
      1,
      'ability_warrior_shieldbash'
    ),
    effectTypes: ['control'],
    targetingConfig: {
      targetingType: 'single',
      range: 5,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      trigger: 'successful_raise_shield',
      requirements: ['equipped_shield'],
      savingThrow: {
        enabled: true,
        playerAttribute: 'strength',
        opponentSave: 'constitution',
        onFailure: {
          condition: 'stunned',
          duration: 'end_of_next_turn'
        }
      },
      chainedAction: {
        followsAction: 'Raise Shield',
        automatic: false
      }
    }
  },

  // Spell Reaction
  {
    ...createGeneralSpell(
      'Spell Reaction',
      'Cast a reactive spell (for instance, Hellish Rebuke). Roll appropriate dice.',
      'REACTION',
      2,
      'spell_fire_immolation'
    ),
    effectTypes: ['utility'],
    targetingConfig: {
      targetingType: 'variable',
      range: 'variable',
      validTargets: ['variable']
    },
    mechanicsConfig: {
      spellcasting: {
        reactionSpellsOnly: true,
        rollDice: true
      }
    }
  }
];

// Combine all general actions
export const ALL_GENERAL_SPELLS = [
  ...GENERAL_SPELLS,
  ...SKILL_BASED_ACTIONS
];

// Export the general spells category
export const GENERAL_SPELLS_CATEGORY = {
  id: 'general_actions',
  name: 'General Actions',
  description: 'Baseline actions available to all characters regardless of class',
  icon: 'ability_warrior_battleshout',
  color: '#8B7355',
  spells: ALL_GENERAL_SPELLS.map(spell => spell.id)
};

// Export categories for organization
export const GENERAL_CATEGORIES = [
  GENERAL_SPELLS_CATEGORY,
  SKILL_ACTIONS_CATEGORY
];
