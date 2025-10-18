export const PRIMALIST_DATA = {
  id: 'primalist',
  name: 'Primalist',
  icon: 'fas fa-mountain',
  role: 'Support/Control',
  
  // Overview section
  overview: {
    title: 'Primalist Overview',
    subtitle: 'Master of Totemic Magic and Primal Forces',

    description: `The Primalist harnesses the raw, untamed power of nature through the use of totems and earth magic. They can place and maintain powerful totems that channel primal forces, allowing them to support allies, control the battlefield, and unleash devastating effects on enemies. The Primalist's abilities are deeply rooted in their connection to the natural world, making them a versatile and strategic class that excels in both support and offense.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `The Primalist is a conduit of raw, untamed nature, channeling primal forces through sacred totems. They are shamans, earth-speakers, and keepers of ancient traditions who commune with the spirits of earth, wind, fire, and water. Primalists view the natural world as a living entity with which they maintain a sacred bond, placing totems as anchors to channel these elemental forces.

In roleplay, Primalists are often tribal leaders, spiritual guides, or wandering shamans who seek to maintain balance between civilization and the wild. They speak with reverence for the elements, perform rituals to honor nature spirits, and view their totems as sacred conduits rather than mere tools. Their connection to the earth runs deep, and they can sense disturbances in the natural order.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Support/Control

**Combat Style**: Strategic totem placement and battlefield control

**Strengths**:
- Versatile support through multiple totem combinations
- Area control and zone denial
- Sustained healing and buffing capabilities
- Powerful synergy effects when totems are combined
- Adaptable to different combat scenarios

**Weaknesses**:
- Totems can be destroyed by enemies
- Requires setup time to achieve maximum effectiveness
- Vulnerable while placing totems
- Limited direct damage without totem synergies
- Positioning-dependent playstyle`
    },

    playstyle: {
      title: 'Playstyle',
      content: `The Primalist excels at creating powerful zones of control through strategic totem placement. Their playstyle revolves around:

**Totem Management**: Carefully placing and maintaining up to 8 different totems, each providing unique benefits to allies or hindrances to enemies.

**Synergy Activation**: Achieving powerful combined effects by maintaining 4 active totems simultaneously, triggering devastating synergies like Healing Sanctuary or Elemental Fury.

**Battlefield Control**: Using totems to create zones that enhance allies, debuff enemies, and control the flow of combat.

**Adaptive Strategy**: Switching between offensive and defensive totem combinations based on the situation, from healing sanctuaries to elemental storms.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Totemic Synergy System',
    subtitle: 'Harmonizing Primal Forces Through Sacred Totems',
    
    description: `Totemic Synergy measures the Primalist's ability to harmonize the effects of their totems. When totems are placed and maintained in strategic positions, they create powerful combined effects. The Primalist must carefully plan and manage their totems to maximize these synergistic outcomes.`,
    
    mechanics: {
      title: 'Core Mechanics',
      content: `**Totem Placement**: The Primalist can place up to 8 different types of totems on the battlefield. Each totem has a 10-foot radius of effect unless otherwise specified.

**Totemic Synergy Generation**: Each totem placed generates 1 point of Totemic Synergy. Each turn a totem remains active generates 1 additional point of Totemic Synergy.

**Synergy Activation**: When the Primalist maintains 4 active totems simultaneously, they can trigger powerful synergistic effects based on the combination of totems in play.

**Totem Vulnerability**: Enemies can target and destroy totems (each totem has 10 HP and 12 AC). Destroyed totems disrupt synergy and must be replaced.

**Totem Duration**: Totems remain active until destroyed or dismissed by the Primalist. The Primalist can reposition totems as a bonus action.`
    },
    
    totemTypesTable: {
      title: 'Eight Sacred Totems',
      headers: ['Totem', 'Effect', 'Radius', 'Mana Cost'],
      rows: [
        ['Healing Totem', 'Heals allies for 1d6 HP each turn', '10 ft', '3'],
        ['Guardian Totem', 'Grants allies shield absorbing 5 damage per attack', '10 ft', '3'],
        ['Flamecaller Totem', 'Adds 1d6 fire damage to allies\' weapon attacks', '10 ft', '3'],
        ['Storm Totem', 'Grants +1 to spell attack rolls and spell save DCs', '10 ft', '3'],
        ['Rejuvenation Totem', 'Heals allies for 1d4 HP at start of their turn', '10 ft', '3'],
        ['Earth Totem', 'Grants +2 AC and resistance to non-magical damage', '10 ft', '3'],
        ['Frost Totem', 'Reduces enemy movement speed by 10 ft', '10 ft', '3'],
        ['Wind Totem', 'Increases ally movement speed by 10 ft, advantage on Dex saves', '10 ft', '3']
      ]
    },
    
    synergyEffectsTable: {
      title: 'Totemic Synergy Combinations (4 Totems Required)',
      headers: ['Synergy Name', 'Required Totems', 'Effect', 'Duration'],
      rows: [
        ['Healing Sanctuary', 'Healing, Rejuvenation, Guardian, Earth', 'Heals allies for +1d6 HP, reduces damage taken by 50%', '2 turns'],
        ['Elemental Fury', 'Flamecaller, Storm, Frost, Wind', 'Enhances attacks with fire/lightning/frost damage, increases attack/movement speed', '3 turns'],
        ['Protective Bastion', 'Guardian, Earth, Frost, Wind', 'Grants resistance to all damage types, +10 ft movement speed', '3 turns'],
        ['Storm of Wrath', 'Flamecaller, Storm, Frost, Healing', 'Enhances attacks with elemental damage, heals for portion of damage dealt', '3 turns'],
        ['Vital Grove', 'Healing, Rejuvenation, Guardian, Wind', 'Rapid health regeneration, increased movement speed and defense', '3 turns']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Totem Positioning**: Place totems in protected locations where they can affect the maximum number of allies while being difficult for enemies to reach.

**Synergy Planning**: Plan your totem combinations in advance based on the encounter. Healing Sanctuary for tough fights, Elemental Fury for offense.

**Totem Defense**: Use Guardian and Earth totems to create defensive zones that protect your other totems from being destroyed.

**Adaptive Placement**: Be ready to reposition totems as the battlefield shifts. Use your bonus action to move totems to maintain optimal coverage.

**Resource Management**: Each totem costs 3 mana. Plan your placements carefully to avoid running out of mana before achieving synergy.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Primalist Specializations',
    subtitle: 'Three Paths of Totemic Mastery',
    
    description: `Primalists can specialize in different aspects of totemic magic, each offering unique approaches to totem synergy and battlefield control. These specializations focus on healing (Earthwarden), elemental damage (Stormbringer), or tactical control (Spiritcaller).`,
    
    passiveAbility: {
      name: 'Totemic Mastery',
      description: 'All Primalists can place and maintain up to 8 different totems and trigger synergy effects when 4 totems are active. Totems have 10 HP, 12 AC, and a 10-foot radius.'
    },
    
    specs: [
      {
        id: 'earthwarden',
        name: 'Earthwarden',
        icon: 'spell_nature_stoneclawtotem',
        color: '#8B4513',
        theme: 'Healing & Protection',
        
        description: `Earthwardens focus on defensive totems and healing synergies, creating sanctuaries of protection for their allies. They excel at sustaining parties through prolonged encounters and providing powerful defensive buffs.`,
        
        playstyle: 'Defensive support, sustained healing, damage mitigation',
        
        strengths: [
          'Enhanced healing totem effects (+50% healing)',
          'Totems have +5 HP and +2 AC',
          'Can place 5th totem for enhanced synergies',
          'Healing Sanctuary synergy heals for 2d6 instead of 1d6'
        ],
        
        weaknesses: [
          'Lower offensive capabilities',
          'Requires allies to stay within totem range',
          'Vulnerable to area damage that destroys multiple totems'
        ],
        
        specPassive: {
          name: 'Earth\'s Embrace',
          description: 'Your healing totems (Healing, Rejuvenation) heal for 50% more. Your defensive totems (Guardian, Earth) grant +1 additional AC. You can place a 5th totem to create enhanced synergies.'
        },
        
        keyAbilities: [
          'Sanctuary Aura - Healing Sanctuary lasts 1 additional turn',
          'Earthen Resilience - Totems regenerate 5 HP per turn',
          'Sacred Ground - Allies standing near totems gain +1 AC'
        ]
      },
      {
        id: 'stormbringer',
        name: 'Stormbringer',
        icon: 'spell_nature_callstorm',
        color: '#4169E1',
        theme: 'Elemental Damage & Offense',
        
        description: `Stormbringers channel the fury of the elements through their totems, creating devastating storms of fire, frost, and lightning. They excel at dealing area damage and enhancing allies' offensive capabilities.`,
        
        playstyle: 'Offensive support, elemental damage, attack enhancement',
        
        strengths: [
          'Elemental totems deal +1d6 additional damage',
          'Elemental Fury synergy deals 3d6 damage per element',
          'Can trigger synergies with only 3 totems',
          'Storm of Wrath heals for 100% of damage dealt'
        ],
        
        weaknesses: [
          'Lower defensive capabilities',
          'Totems are more vulnerable (normal HP/AC)',
          'Requires aggressive positioning'
        ],
        
        specPassive: {
          name: 'Elemental Wrath',
          description: 'Your elemental totems (Flamecaller, Storm, Frost, Wind) deal +1d6 damage. You can trigger synergy effects with only 3 active totems instead of 4. Elemental Fury deals 3d6 per element instead of 2d6.'
        },
        
        keyAbilities: [
          'Lightning Strike - Storm Totem can strike enemies for 2d6 lightning damage',
          'Inferno - Flamecaller Totem creates burning ground (1d6 fire/turn)',
          'Blizzard - Frost Totem creates freezing zone (DC 15 Con save or frozen)'
        ]
      },
      {
        id: 'spiritcaller',
        name: 'Spiritcaller',
        icon: 'spell_nature_invisibilitytotem',
        color: '#9370DB',
        theme: 'Crowd Control & Utility',
        
        description: `Spiritcallers commune with nature spirits to enhance their totems with crowd control and utility effects. They excel at battlefield manipulation, enemy debuffs, and providing unique tactical advantages.`,
        
        playstyle: 'Tactical control, crowd control, utility support',
        
        strengths: [
          'Totems apply additional debuffs to enemies',
          'Can move totems as a free action (not bonus action)',
          'Totems have 15-foot radius instead of 10-foot',
          'Unique spirit-based synergy combinations'
        ],
        
        weaknesses: [
          'Lower direct healing and damage',
          'Requires careful positioning and timing',
          'Synergies focus on control rather than raw power'
        ],
        
        specPassive: {
          name: 'Spirit Bond',
          description: 'Your totems have a 15-foot radius instead of 10-foot. You can reposition totems as a free action. Enemies within totem range have disadvantage on saving throws against your spells.'
        },
        
        keyAbilities: [
          'Spirit Walk - Teleport to any active totem location',
          'Ancestral Guidance - Totems reveal invisible enemies',
          'Totemic Projection - Project totem effects to distant location'
        ]
      }
    ]
  },
  
  // Example Spells
  exampleSpells: [
    // HEALING TOTEMS
    {
      id: 'prim_healing_totem',
      name: 'Healing Totem',
      description: 'Place a sacred totem that channels healing energy to all allies within range, restoring health each turn.',
      spellType: 'ACTION',
      icon: 'spell_nature_healingwavegreater',
      school: 'Nature',
      level: 2,
      specialization: 'healing-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'HEALING',
            amount: '1d6',
            timing: 'START_OF_TURN',
            description: 'Heals all allies within range for 1d6 HP at the start of each turn'
          },
          {
            type: 'SUMMON',
            creature: 'Healing Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        earthwardenBonus: {
          description: 'Earthwarden specialization: Heals for 1d6 + 3 (50% bonus)',
          bonus: '+3 healing'
        }
      },

      tags: ['healing-totems', 'totem', 'healing', 'support', 'earthwarden', 'all-specs']
    },

    {
      id: 'prim_rejuvenation_totem',
      name: 'Rejuvenation Totem',
      description: 'Place a totem that grants regeneration to all allies within range, healing them at the start of their turns.',
      spellType: 'ACTION',
      icon: 'spell_nature_rejuvenation',
      school: 'Nature',
      level: 2,
      specialization: 'healing-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'HEALING',
            amount: '1d4',
            timing: 'START_OF_TURN',
            description: 'Heals all allies for 1d4 HP at the start of their turn'
          },
          {
            type: 'SUMMON',
            creature: 'Rejuvenation Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        regeneration: {
          description: 'Grants regeneration buff to allies',
          duration: 'While within totem range'
        }
      },

      tags: ['healing-totems', 'totem', 'healing', 'regeneration', 'earthwarden', 'all-specs']
    },

    // DEFENSIVE TOTEMS
    {
      id: 'prim_guardian_totem',
      name: 'Guardian Totem',
      description: 'Place a protective totem that shields all allies within range, absorbing incoming damage.',
      spellType: 'ACTION',
      icon: 'spell_nature_stoneskintotem',
      school: 'Nature',
      level: 3,
      specialization: 'defensive-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'DAMAGE_ABSORPTION',
            amount: 5,
            description: 'Absorbs 5 damage per attack'
          },
          {
            type: 'SUMMON',
            creature: 'Guardian Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        earthwardenBonus: {
          description: 'Earthwarden specialization: Grants +1 additional AC',
          bonus: '+1 AC'
        }
      },

      tags: ['defensive-totems', 'totem', 'defense', 'shield', 'earthwarden', 'all-specs']
    },

    {
      id: 'prim_earth_totem',
      name: 'Earth Totem',
      description: 'Place a totem of solid earth that increases allies\' armor and grants resistance to physical damage.',
      spellType: 'ACTION',
      icon: 'spell_nature_strengthofearthtotem02',
      school: 'Earth',
      level: 3,
      specialization: 'defensive-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'AC',
            amount: 2,
            description: 'Increases AC by 2'
          },
          {
            type: 'BUFF',
            stat: 'RESISTANCE',
            damageType: 'NON_MAGICAL',
            description: 'Grants resistance to non-magical damage'
          },
          {
            type: 'SUMMON',
            creature: 'Earth Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        earthwardenBonus: {
          description: 'Earthwarden specialization: Grants +1 additional AC (total +3)',
          bonus: '+1 AC'
        }
      },

      tags: ['defensive-totems', 'totem', 'defense', 'resistance', 'earthwarden', 'all-specs']
    },

    // ELEMENTAL TOTEMS
    {
      id: 'prim_flamecaller_totem',
      name: 'Flamecaller Totem',
      description: 'Place a totem wreathed in flames that enhances allies\' weapons with fire damage.',
      spellType: 'ACTION',
      icon: 'spell_fire_sealoffire',
      school: 'Fire',
      level: 3,
      specialization: 'elemental-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'WEAPON_DAMAGE',
            damageType: 'FIRE',
            amount: '1d6',
            description: 'Adds 1d6 fire damage to weapon attacks'
          },
          {
            type: 'SUMMON',
            creature: 'Flamecaller Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        stormbringerBonus: {
          description: 'Stormbringer specialization: Adds 2d6 fire damage instead of 1d6',
          bonus: '+1d6 fire damage'
        },
        burningGround: {
          description: 'Stormbringer specialization: Creates burning ground dealing 1d6 fire damage per turn',
          requirement: 'Stormbringer only'
        }
      },

      tags: ['elemental-totems', 'totem', 'fire', 'damage', 'stormbringer', 'all-specs']
    },

    {
      id: 'prim_storm_totem',
      name: 'Storm Totem',
      description: 'Place a crackling totem that enhances allies\' spellcasting with storm energy.',
      spellType: 'ACTION',
      icon: 'spell_nature_stormreach',
      school: 'Lightning',
      level: 3,
      specialization: 'elemental-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'SPELL_ATTACK',
            amount: 1,
            description: 'Grants +1 to spell attack rolls'
          },
          {
            type: 'BUFF',
            stat: 'SPELL_DC',
            amount: 1,
            description: 'Grants +1 to spell save DCs'
          },
          {
            type: 'SUMMON',
            creature: 'Storm Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        stormbringerBonus: {
          description: 'Stormbringer specialization: Can strike enemies for 2d6 lightning damage as bonus action',
          bonus: 'Lightning Strike ability'
        }
      },

      tags: ['elemental-totems', 'totem', 'lightning', 'buff', 'stormbringer', 'all-specs']
    },

    {
      id: 'prim_frost_totem',
      name: 'Frost Totem',
      description: 'Place a freezing totem that slows enemies and reduces their attack speed.',
      spellType: 'ACTION',
      icon: 'spell_frost_frostshock',
      school: 'Frost',
      level: 3,
      specialization: 'elemental-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All enemies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'DEBUFF',
            stat: 'MOVEMENT_SPEED',
            amount: -10,
            description: 'Reduces enemy movement speed by 10 feet'
          },
          {
            type: 'DEBUFF',
            stat: 'ATTACK_SPEED',
            description: 'Reduces enemy attack speed'
          },
          {
            type: 'SUMMON',
            creature: 'Frost Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        stormbringerBonus: {
          description: 'Stormbringer specialization: Creates freezing zone (DC 15 Con save or frozen)',
          bonus: 'Blizzard effect'
        }
      },

      tags: ['elemental-totems', 'totem', 'frost', 'debuff', 'slow', 'stormbringer', 'all-specs']
    },

    {
      id: 'prim_wind_totem',
      name: 'Wind Totem',
      description: 'Place a totem that channels swift winds, increasing allies\' movement and reflexes.',
      spellType: 'ACTION',
      icon: 'spell_nature_windfury',
      school: 'Air',
      level: 2,
      specialization: 'elemental-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'MOVEMENT_SPEED',
            amount: 10,
            description: 'Increases movement speed by 10 feet'
          },
          {
            type: 'BUFF',
            stat: 'SAVING_THROW',
            saveType: 'DEXTERITY',
            description: 'Grants advantage on Dexterity saving throws'
          },
          {
            type: 'SUMMON',
            creature: 'Wind Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        spiritcallerBonus: {
          description: 'Spiritcaller specialization: 15-foot radius instead of 10-foot',
          bonus: '+5 feet radius'
        }
      },

      tags: ['elemental-totems', 'totem', 'air', 'buff', 'mobility', 'all-specs']
    },

    // SYNERGY EFFECTS
    {
      id: 'prim_healing_sanctuary',
      name: 'Healing Sanctuary',
      description: 'Activate a powerful synergy when Healing, Rejuvenation, Guardian, and Earth totems are active, creating a sanctuary of protection and healing.',
      spellType: 'REACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Nature',
      level: 5,
      specialization: 'synergy-effects',

      typeConfig: {
        actionType: 'SPELL',
        castTime: 'Reaction (when 4 totems active)',
        duration: '2 turns',
        concentration: false
      },

      targetingConfig: {
        range: 'Self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 20,
          unit: 'feet',
          description: 'All allies within 20 feet'
        },
        validTargets: ['ALLIES']
      },

      resourceCost: {
        totemicSynergy: 4,
        description: 'Requires 4 active totems: Healing, Rejuvenation, Guardian, Earth'
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'HEALING',
            amount: '2d8',
            description: 'Heals all allies for 2d8 HP'
          },
          {
            type: 'BUFF',
            stat: 'DAMAGE_REDUCTION',
            amount: 50,
            unit: 'PERCENT',
            duration: '2 turns',
            description: 'Reduces damage taken by 50%'
          }
        ]
      },

      specialMechanics: {
        synergyRequirement: {
          totems: ['Healing Totem', 'Rejuvenation Totem', 'Guardian Totem', 'Earth Totem'],
          description: 'All 4 totems must be active to trigger this synergy'
        },
        earthwardenBonus: {
          description: 'Earthwarden specialization: Heals for 2d6 additional HP, lasts 3 turns instead of 2',
          bonus: '+2d6 healing, +1 turn duration'
        }
      },

      tags: ['synergy-effects', 'healing', 'defense', 'ultimate', 'earthwarden']
    },

    {
      id: 'prim_elemental_fury',
      name: 'Elemental Fury',
      description: 'Unleash a devastating elemental storm when Flamecaller, Storm, Frost, and Wind totems are active, enhancing allies with fire, lightning, and frost.',
      spellType: 'REACTION',
      icon: 'spell_nature_wispheal',
      school: 'Elemental',
      level: 6,
      specialization: 'synergy-effects',

      typeConfig: {
        actionType: 'SPELL',
        castTime: 'Reaction (when 4 totems active)',
        duration: '3 turns',
        concentration: false
      },

      targetingConfig: {
        range: 'Self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 30,
          unit: 'feet',
          description: 'All allies within 30 feet'
        },
        validTargets: ['ALLIES']
      },

      resourceCost: {
        totemicSynergy: 4,
        description: 'Requires 4 active totems: Flamecaller, Storm, Frost, Wind'
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'WEAPON_DAMAGE',
            damageType: 'FIRE',
            amount: '2d6',
            description: 'Adds 2d6 fire damage to attacks'
          },
          {
            type: 'BUFF',
            stat: 'WEAPON_DAMAGE',
            damageType: 'LIGHTNING',
            amount: '2d6',
            description: 'Adds 2d6 lightning damage to attacks'
          },
          {
            type: 'BUFF',
            stat: 'WEAPON_DAMAGE',
            damageType: 'FROST',
            amount: '2d6',
            description: 'Adds 2d6 frost damage to attacks'
          },
          {
            type: 'BUFF',
            stat: 'ATTACK_SPEED',
            description: 'Increases attack speed'
          },
          {
            type: 'BUFF',
            stat: 'MOVEMENT_SPEED',
            amount: 10,
            description: 'Increases movement speed by 10 feet'
          }
        ]
      },

      specialMechanics: {
        synergyRequirement: {
          totems: ['Flamecaller Totem', 'Storm Totem', 'Frost Totem', 'Wind Totem'],
          description: 'All 4 totems must be active to trigger this synergy'
        },
        stormbringerBonus: {
          description: 'Stormbringer specialization: Deals 3d6 per element instead of 2d6, can trigger with only 3 totems',
          bonus: '+1d6 per element, reduced totem requirement'
        }
      },

      tags: ['synergy-effects', 'elemental', 'damage', 'ultimate', 'stormbringer']
    },

    // UTILITY SPELLS
    {
      id: 'prim_totemic_call',
      name: 'Totemic Call',
      description: 'Summon all eight sacred totems at once in a powerful ritual, creating a complete totemic circle.',
      spellType: 'ACTION',
      icon: 'spell_nature_nullward',
      school: 'Nature',
      level: 7,
      specialization: 'utility',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: '1 minute',
        concentration: true
      },

      targetingConfig: {
        range: 'Self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 30,
          unit: 'feet',
          description: 'Totems placed in circle around caster'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 10
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'SUMMON',
            creature: 'All 8 Totems',
            description: 'Summons Healing, Guardian, Flamecaller, Storm, Rejuvenation, Earth, Frost, and Wind totems',
            duration: '1 minute'
          }
        ]
      },

      specialMechanics: {
        ultimateAbility: {
          description: 'Places all 8 totems simultaneously in optimal positions',
          synergyGeneration: '8 points immediately, then 8 per turn'
        },
        multiSynergy: {
          description: 'Can trigger multiple synergy effects simultaneously',
          note: 'With 8 totems, can activate 2 different synergies at once'
        }
      },

      tags: ['utility', 'ultimate', 'totem', 'all-specs']
    },

    {
      id: 'prim_totemic_recall',
      name: 'Totemic Recall',
      description: 'Instantly reposition all active totems to your current location, maintaining their effects.',
      spellType: 'ACTION',
      icon: 'spell_shaman_dropall',
      school: 'Nature',
      level: 3,
      specialization: 'utility',

      typeConfig: {
        actionType: 'SPELL',
        castTime: 'Bonus action',
        duration: 'Instant',
        concentration: false
      },

      targetingConfig: {
        range: 'Self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 20,
          unit: 'feet',
          description: 'Totems repositioned around caster'
        },
        validTargets: ['TOTEMS']
      },

      resourceCost: {
        mana: 4
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'SPECIAL',
            description: 'Repositions all active totems to caster\'s location without destroying them'
          }
        ]
      },

      specialMechanics: {
        repositioning: {
          description: 'Moves all totems without breaking synergies or resetting durations',
          note: 'Useful for maintaining synergies while repositioning'
        },
        spiritcallerBonus: {
          description: 'Spiritcaller specialization: Free action instead of bonus action',
          bonus: 'No action cost'
        }
      },

      tags: ['utility', 'totem', 'mobility', 'spiritcaller', 'all-specs']
    },

    {
      id: 'prim_earthquake',
      name: 'Earthquake',
      description: 'Channel the fury of the earth to create a massive tremor that shakes the ground and devastates enemies.',
      spellType: 'ACTION',
      icon: 'spell_nature_earthquake',
      school: 'Earth',
      level: 8,
      specialization: 'utility',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Instant',
        concentration: false
      },

      targetingConfig: {
        range: '120 feet',
        areaOfEffect: {
          type: 'RADIUS',
          size: 50,
          unit: 'feet',
          description: 'All creatures in 50-foot radius'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 8
      },

      resolution: {
        type: 'SAVING_THROW',
        savingThrow: {
          ability: 'DEXTERITY',
          dc: 16,
          onSave: 'HALF_DAMAGE',
          onFail: 'FULL_DAMAGE_AND_PRONE'
        },
        damage: {
          amount: '4d6',
          type: 'BLUDGEONING'
        },
        effects: [
          {
            type: 'CONDITION',
            condition: 'PRONE',
            description: 'Knocks all creatures prone on failed save'
          }
        ]
      },

      specialMechanics: {
        terrainEffect: {
          description: 'Creates difficult terrain in the area for 1 minute',
          note: 'Enemies have disadvantage on Dexterity saves while in area'
        }
      },

      tags: ['utility', 'damage', 'earth', 'aoe', 'ultimate', 'all-specs']
    }
  ]
};

