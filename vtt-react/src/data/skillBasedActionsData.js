/**
 * Skill-Based Actions Data
 *
 * CLEARED FOR TESTING
 * All skill-based actions have been removed and replaced with comprehensive test spells.
 * See testSpells.js for the test spell library.
 *
 * Original actions backed up to: BACKUP_skillBasedActionsData.js
 */

// CLEARED - Using test spells instead
export const SKILL_BASED_ACTIONS = [];

// Export for use in general spells
export const SKILL_ACTIONS_CATEGORY = {
  id: 'skill_actions',
  name: 'Skill Actions',
  description: 'Actions that utilize character skills and abilities',
  icon: 'spell_holy_blessingofstrength',
  color: '#6B8E23',
  spells: SKILL_BASED_ACTIONS.map(action => action.id)
};
      'Jump up to 10 ft horizontally or 10 ft vertically. On failure, land prone. Add 5 ft by increasing DC by 3.',
      'acrobatics',
      1,
      'ability_rogue_sprint',
      12
    ),
    effectTypes: ['movement'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'acrobatics',
        difficulty: 12,
        onFailure: 'fall_prone'
      },
      movement: {
        horizontal: 10,
        vertical: 10,
        enhancement: {
          additionalDistance: 5,
          difficultyIncrease: 3
        }
      }
    }
  },

  // Animal Handling - Beast Command
  {
    ...createSkillAction(
      'Beast Command',
      'A quick call to action catches your pet\'s attention. DC = 10 - Pet Intelligence - Pet Wisdom + Your Intelligence + Your Wisdom.',
      'animal_handling',
      1,
      'ability_hunter_beastcall',
      10
    ),
    effectTypes: ['control'],
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['pet', 'beast']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'animal_handling',
        difficulty: 'dynamic',
        formula: '10 - PET_INT - PET_WIS + PLAYER_INT + PLAYER_WIS',
        description: 'DC varies based on pet and player intelligence/wisdom'
      },
      petCommand: {
        enabled: true,
        commandTypes: ['attack', 'defend', 'fetch', 'stay', 'come']
      }
    }
  },

  // Arcana - Arcane Counter
  {
    ...createSkillAction(
      'Arcane Counter',
      'Channel the Arcane to prepare to counteract the next hostile spell cast within 30 ft on the following turn.',
      'arcana',
      1,
      'spell_arcane_arcane03',
      12
    ),
    effectTypes: ['defensive'],
    targetingConfig: {
      targetingType: 'area',
      range: 30,
      validTargets: ['spell']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'arcana',
        difficulty: '12 + SPELL_LEVEL',
        description: 'Arcana Roll DC 12 + Spell Level Cast'
      },
      counterspell: {
        enabled: true,
        duration: 'next_turn',
        range: 30,
        triggerCondition: 'hostile_spell_cast'
      }
    }
  },

  // Athletics - Grapple
  {
    ...createSkillAction(
      'Grapple',
      'Use brute force to restrain an opponent until your next turn. Target gains restrained condition.',
      'athletics',
      1,
      'ability_warrior_charge',
      'contested'
    ),
    effectTypes: ['control'],
    targetingConfig: {
      targetingType: 'single',
      range: 5,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      contestedCheck: {
        enabled: true,
        playerAttribute: 'strength',
        skill: 'athletics',
        opponentChoice: ['strength', 'dexterity'],
        onSuccess: {
          condition: 'restrained',
          duration: 'until_next_turn',
          effects: ['zero_speed', 'disadvantage_on_attacks', 'advantage_against_target']
        }
      }
    }
  },

  // Deception - Misdirect
  {
    ...createSkillAction(
      'Misdirect',
      'With a clever ruse, a creature within 10 ft gains the surprised condition.',
      'deception',
      1,
      'spell_shadow_charm',
      'dynamic'
    ),
    effectTypes: ['control'],
    targetingConfig: {
      targetingType: 'single',
      range: 10,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'deception',
        difficulty: '10 + OPPONENT_INT',
        description: 'Deception Roll DC 10 + Opponent Intelligence Modifier'
      },
      debuff: {
        condition: 'surprised',
        effects: ['unable_to_react', 'disadvantage_on_attacks'],
        duration: 'until_end_of_turn'
      }
    }
  },

  // History - Lore Recall
  {
    ...createSkillAction(
      'Lore Recall',
      'Tap into your knowledge to recall special attacks or abilities of a creature within 30 ft.',
      'history',
      1,
      'spell_arcane_mindvision',
      'dynamic'
    ),
    effectTypes: ['utility'],
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['creature']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'history',
        difficulty: '12 + CREATURE_CR',
        description: 'History Roll DC 12 + Creature CR (rounded up)'
      },
      information: {
        type: 'creature_abilities',
        reveals: ['special_attacks', 'resistances', 'vulnerabilities', 'legendary_actions']
      }
    }
  },

  // Insight - Flow State
  {
    ...createSkillAction(
      'Flow State',
      'Enter a calm but clear state of mind, reducing damage taken by 2 until the start of your next turn.',
      'insight',
      1,
      'spell_holy_innerfire',
      12
    ),
    effectTypes: ['defensive'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'insight',
        difficulty: 12
      },
      buff: {
        type: 'damage_reduction',
        value: 2,
        duration: 'until_start_of_next_turn'
      }
    }
  },

  // Intimidation - Taunt
  {
    ...createSkillAction(
      'Taunt',
      'Provoke nearby opponents within 15 ft, forcing them to attack you. Effect lasts until opponent succeeds wisdom check.',
      'intimidation',
      1,
      'spell_shadow_unholyfrenzy',
      'contested'
    ),
    spellType: 'REACTION',
    effectTypes: ['control'],
    targetingConfig: {
      targetingType: 'area',
      range: 15,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      contestedCheck: {
        enabled: true,
        playerAttribute: 'charisma',
        skill: 'intimidation',
        opponentSave: 'wisdom',
        onSuccess: {
          condition: 'taunted',
          effect: 'must_attack_caster',
          duration: 'until_wisdom_save_success'
        }
      }
    }
  },

  // Investigation - Deduct
  {
    ...createSkillAction(
      'Deduct',
      'Use deductive skills to analyze and discern an opponent\'s weaknesses within 15 ft.',
      'investigation',
      1,
      'spell_arcane_mindvision',
      'dynamic'
    ),
    effectTypes: ['utility'],
    targetingConfig: {
      targetingType: 'single',
      range: 15,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'investigation',
        difficulty: '12 + CREATURE_CR',
        description: 'Investigation Roll DC 12 + Creature CR (rounded up)'
      },
      information: {
        type: 'weaknesses',
        reveals: ['armor_class', 'saving_throw_weaknesses', 'damage_vulnerabilities']
      }
    }
  },

  // Medicine - First Aid
  {
    ...createSkillAction(
      'First Aid',
      'Treat a nearby ally (within 5 ft) suffering from system shock, restore ally at death\'s door to 1 HP, or apply bandages healing 1d4 + Medicine modifier.',
      'medicine',
      1,
      'spell_holy_heal',
      10
    ),
    effectTypes: ['healing'],
    targetingConfig: {
      targetingType: 'single',
      range: 5,
      validTargets: ['ally']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'medicine',
        difficulty: 'variable',
        options: [
          {
            type: 'system_shock',
            difficulty: 10,
            description: 'Treat system shock (after taking >50% max health damage)'
          },
          {
            type: 'death_saves',
            difficulty: '10 + EXHAUSTION_LEVEL',
            description: 'Restore ally at death\'s door to 1 HP'
          },
          {
            type: 'bandages',
            difficulty: 10,
            description: 'Apply bandages (once per character)',
            healing: '1d4 + MEDICINE_MODIFIER'
          }
        ]
      }
    }
  },

  // Nature - Terrain Insight
  {
    ...createSkillAction(
      'Terrain Insight',
      'Spot an advantage in the terrain around you (10 ft). Find loose rubble for traps, tree branches, pits, or helpful plants.',
      'nature',
      1,
      'spell_nature_natureguardian',
      12
    ),
    effectTypes: ['utility'],
    targetingConfig: {
      targetingType: 'area',
      range: 10,
      validTargets: ['terrain']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'nature',
        difficulty: 12
      },
      terrainAdvantages: {
        types: ['loose_rubble', 'tree_branches', 'hidden_pits', 'useful_plants'],
        effect: 'environmental_advantage'
      }
    }
  },

  // Perception - Heightened Senses
  {
    ...createSkillAction(
      'Heightened Senses',
      'Your senses are on high alert. Add 2 to your initiative rolls.',
      'perception',
      0,
      'spell_nature_faeriefire'
    ),
    spellType: 'PASSIVE',
    effectTypes: ['buff'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      passiveBonus: {
        type: 'initiative',
        value: 2,
        permanent: true
      }
    }
  },

  // Performance - Mesmer
  {
    ...createSkillAction(
      'Mesmer',
      'Captivating tunes cause anyone within 15 ft to lose their next turn. Limited to one use per combat. Immune: creatures without eyes, multi-headed, undead, celestials, fiends, fey, dragons, constructs.',
      'performance',
      3,
      'spell_shadow_charm',
      'contested'
    ),
    effectTypes: ['control'],
    targetingConfig: {
      targetingType: 'area',
      range: 15,
      validTargets: ['creature']
    },
    mechanicsConfig: {
      contestedCheck: {
        enabled: true,
        playerAttribute: 'charisma',
        skill: 'performance',
        opponentSave: 'wisdom',
        onFailure: {
          condition: 'mesmerized',
          effect: 'lose_next_turn'
        }
      },
      immunities: ['eyeless', 'multi_headed', 'undead', 'celestial', 'fiend', 'fey', 'dragon', 'construct'],
      limitations: {
        usesPerCombat: 1
      }
    }
  },

  // Persuasion - Persuade
  {
    ...createSkillAction(
      'Persuade',
      'Convince an opponent to reconsider their action, confusing them. Effect lasts until creature rolls above your Persuasion roll (limited to one roll per turn).',
      'persuasion',
      2,
      'spell_holy_prayerofhealing',
      'contested'
    ),
    effectTypes: ['control'],
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      contestedCheck: {
        enabled: true,
        playerAttribute: 'charisma',
        skill: 'persuasion',
        opponentSave: 'wisdom',
        onFailure: {
          condition: 'confused',
          duration: 'until_save_success',
          saveAttempts: 'one_per_turn'
        }
      },
      confusionTable: {
        '1': 'runs_random_direction',
        '2-4': 'does_nothing',
        '5-6': 'cast_random_spell_random_target',
        '7-8': 'attack_random_nearby_creature',
        '9-10': 'acts_normally'
      }
    }
  },

  // Religion - Divine Favor
  {
    ...createSkillAction(
      'Divine Favor',
      'Preach teachings of your deity to inspire nearby allies and intelligent creatures within 15 ft. Roll d4 for boon type.',
      'religion',
      2,
      'spell_holy_divinefavor',
      'contested'
    ),
    effectTypes: ['buff'],
    targetingConfig: {
      targetingType: 'area',
      range: 15,
      validTargets: ['ally', 'intelligent_creature']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'religion',
        difficulty: 'contested',
        opponentSave: ['wisdom', 'intelligence']
      },
      boons: {
        1: {
          name: 'Shield of Conviction',
          effect: 'temporary_hp',
          value: 'RELIGION_MODIFIER',
          duration: 'combat'
        },
        2: {
          name: 'Guardian\'s Favor',
          effect: 'damage_reduction',
          value: 'RELIGION_MODIFIER',
          duration: 'next_turn'
        },
        3: {
          name: 'Zealot\'s Blessing',
          effect: 'attack_bonus',
          value: 'RELIGION_MODIFIER',
          duration: 'next_attack'
        },
        4: {
          name: 'Wisdom of the Ancients',
          effect: 'advantage_on_next_save',
          duration: 'next_save'
        }
      },
      selfBoon: {
        automatic: true,
        description: 'Caster always gains the boon regardless of roll'
      }
    }
  },

  // Sleight of Hand - Disarm
  {
    ...createSkillAction(
      'Disarm',
      'When attacked by an opponent within 5 ft, nimbly disarm them and equip their weapon if able. Cannot be used while wielding 2 weapons.',
      'sleight_of_hand',
      1,
      'ability_rogue_disarmtrap'
    ),
    spellType: 'REACTION',
    effectTypes: ['control'],
    targetingConfig: {
      targetingType: 'single',
      range: 5,
      validTargets: ['enemy']
    },
    mechanicsConfig: {
      trigger: 'attacked_by_opponent_within_5ft',
      requirements: ['free_hand_available'],
      contestedCheck: {
        enabled: true,
        playerAttribute: 'dexterity',
        skill: 'sleight_of_hand',
        opponentSave: 'strength',
        onSuccess: {
          effect: 'disarm_and_equip',
          description: 'Disarm opponent and equip their weapon'
        }
      }
    }
  },

  // Stealth - Stealthy Passage
  {
    ...createSkillAction(
      'Stealthy Passage',
      'Pass through an opponent\'s space without provoking opportunity attacks. Success allows 15 ft movement.',
      'stealth',
      1,
      'ability_stealth',
      10
    ),
    effectTypes: ['movement'],
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'stealth',
        difficulty: 10
      },
      movement: {
        type: 'through_enemy_space',
        distance: 15,
        noOpportunityAttacks: true
      }
    }
  },

  // Survival - Trapping
  {
    ...createSkillAction(
      'Trapping',
      'Set up a trap on a 5ft square within 5 ft. Choose from Pitfall (4 AP), Snare (3 AP), or Tripwire (2 AP) traps.',
      'survival',
      2,
      'spell_nature_entanglingroots',
      'dynamic'
    ),
    effectTypes: ['utility'],
    targetingConfig: {
      targetingType: 'area',
      range: 5,
      validTargets: ['ground']
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'survival',
        difficulty: '15 - INTELLIGENCE_MODIFIER'
      },
      trapTypes: {
        pitfall: {
          cost: 4,
          effect: 'falling_damage_and_restrain',
          damage: '1d6_per_10ft_depth',
          description: 'Hidden pit, 4 AP per 10 ft depth'
        },
        snare: {
          cost: 3,
          effect: 'suspend_upside_down',
          condition: 'advantage_on_attacks_against',
          description: 'Catches and suspends creature'
        },
        tripwire: {
          cost: 2,
          effect: 'fall_prone_drop_items',
          description: 'Causes prone and item dropping'
        }
      }
    }
  }
];

// Export for use in general spells
export const SKILL_ACTIONS_CATEGORY = {
  id: 'skill_actions',
  name: 'Skill Actions',
  description: 'Actions that utilize character skills and abilities',
  icon: 'spell_holy_blessingofstrength',
  color: '#6B8E23',
  spells: SKILL_BASED_ACTIONS.map(action => action.id)
};
