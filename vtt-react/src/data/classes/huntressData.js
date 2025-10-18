/**
 * Huntress Class Data
 * 
 * Complete class information for the Huntress - an agile melee combatant
 * who wields the Shadow Glaive and commands a loyal companion.
 */

export const HUNTRESS_DATA = {
  id: 'huntress',
  name: 'Huntress',
  icon: 'fas fa-moon',
  role: 'Damage',

  // Overview section
  overview: {
    title: 'The Huntress',
    subtitle: 'Shadow Glaive Wielder and Beastmaster',
    
    description: `The Huntress is a master of close-range combat who wields the legendary Shadow Glaive, a weapon capable of chaining deadly strikes between multiple enemies. Accompanied by a loyal beast companion, the Huntress excels at hit-and-run tactics, weaving through enemy lines with deadly grace. Through the Quarry Marks system, she tracks her prey and unleashes devastating coordinated attacks with her companion. This dynamic class rewards tactical positioning, resource management, and the synergy between hunter and beast.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Huntresses are elite warriors who have bonded with a beast companion through ancient rituals. They often serve as scouts, trackers, or guardians of wild places, using their agility and their companion's instincts to protect their territory.

**Common Huntress Archetypes**:
- **The Sentinel**: A guardian of sacred groves who patrols with her companion, defending nature from intruders
- **The Tracker**: A relentless pursuer who marks her quarry and never stops until the hunt is complete
- **The Shadowblade**: An assassin who strikes from darkness, her glaive a blur of deadly precision
- **The Beastmaster**: A warrior whose bond with her companion transcends normal understanding, fighting as one entity
- **The Moonlight Warrior**: A nocturnal hunter who channels lunar energy through her glaive and companion

**Personality Traits**:
Huntresses are typically independent, patient, and fiercely loyal to their companions. They value freedom, respect nature's balance, and trust their instincts. Many prefer the company of beasts to people, finding honesty in the wild that civilization lacks.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Agile melee damage dealer with companion support

**Combat Strengths**:
- Exceptional multi-target damage through glaive chaining
- High mobility with Shadowstep and evasion abilities
- Companion provides additional damage, defense, or utility
- Strong burst damage when spending Quarry Marks
- Excellent at controlling enemy positioning

**Combat Weaknesses**:
- Requires enemies to be grouped for maximum glaive effectiveness
- Moderate armor (leather wearer)
- Companion can be targeted and killed
- Less effective at long range
- Dependent on Quarry Mark generation for peak performance

**Optimal Positioning**:
Huntresses excel at close range (5-15 feet), positioning themselves to maximize glaive chains between grouped enemies. They should maintain mobility, using Shadowstep to reposition and avoid being surrounded while keeping their companion in effective range.`
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `**Quarry Mark Management**:
The key to mastering the Huntress is generating and spending Quarry Marks efficiently. Generate marks through successful attacks, then spend them strategically:

- **1 Mark**: Enhance companion's next attack (+1d6 damage)
- **2 Marks**: Extend glaive chain by +1 target
- **3 Marks**: Companion special ability
- **5 Marks**: Specialization ultimate ability

**Companion Commands**:
Your companion is a crucial part of your combat effectiveness. Use commands wisely:
- **Attack**: When you need additional damage on priority targets
- **Defend**: When you or an ally needs protection (+2 AC)
- **Support**: For tactical advantages (buffs/debuffs)

**Glaive Positioning**:
Position yourself to maximize chain attacks. The Shadow Glaive chains to enemies within 5 feet of each other, so:
- Target enemies in tight groups
- Use mobility to position for optimal chains
- Coordinate with allies to group enemies (tanks, crowd control)

**Hit-and-Run Tactics**:
Don't stand still. Use Shadowstep and Evasion to:
- Strike quickly and reposition
- Avoid being surrounded
- Escape when focused
- Set up advantageous attack angles

**Team Dynamics**:
- Work with tanks to group enemies for glaive chains
- Coordinate companion attacks with team burst windows
- Use mobility to assist allies in trouble
- Mark priority targets for focused fire`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Quarry Marks',
    subtitle: 'Hunter\'s Tracking System',
    
    description: `The Huntress marks her prey through successful attacks, building up Quarry Marks that can be spent to enhance her abilities and empower her companion. This resource system rewards aggressive play and tactical decision-making, allowing the Huntress to choose between sustained damage or powerful burst abilities.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Generating Quarry Marks**:
- **Successful Hit**: Gain 1 mark when you hit an enemy with Shadow Glaive
- **Companion Hit**: Gain 1 mark when your companion hits an enemy
- **Critical Hit**: Gain 2 marks when you score a critical hit
- **Maximum Capacity**: You can hold up to 5 Quarry Marks at once
- **Persistence**: Marks persist between combats until spent

**Spending Quarry Marks**:
- **1 Mark - Empowered Strike**: Your companion's next attack deals +1d6 damage
- **2 Marks - Extended Chain**: Your next Shadow Glaive attack chains to +1 additional target
- **3 Marks - Companion Special**: Your companion performs a powerful special ability
- **5 Marks - Ultimate Ability**: Unleash your specialization's ultimate ability

**Mark Tracking**:
Your current Quarry Marks are displayed on your character sheet as glowing marks (0-5). Marks are consumed when you activate abilities that require them.

**Strategic Considerations**:
- Save marks for burst damage windows
- Spend marks to extend chains when enemies are grouped
- Use companion specials for crowd control or emergency defense
- Build to 5 marks for ultimate abilities in critical moments`
    },

    resourceTables: [
      {
        title: 'Quarry Mark Generation',
        headers: ['Action', 'Marks Gained', 'Notes'],
        rows: [
          ['Shadow Glaive Hit', '1 mark', 'Each successful hit generates 1 mark'],
          ['Companion Attack Hit', '1 mark', 'Companion attacks also generate marks'],
          ['Critical Hit (Glaive)', '2 marks', 'Critical hits generate double marks'],
          ['Critical Hit (Companion)', '2 marks', 'Companion crits also generate double'],
          ['Mark Quarry Ability', '1 mark', 'Special ability to generate mark without attacking']
        ]
      },
      {
        title: 'Quarry Mark Expenditure',
        headers: ['Cost', 'Effect', 'Use Case'],
        rows: [
          ['1 Mark', 'Companion +1d6 damage', 'Boost companion damage on priority target'],
          ['2 Marks', 'Glaive chains +1 target', 'Maximize multi-target damage'],
          ['3 Marks', 'Companion special ability', 'Crowd control, defense, or utility'],
          ['5 Marks', 'Specialization ultimate', 'Massive burst damage or game-changing effect']
        ]
      },
      {
        title: 'Companion Types & Base Stats',
        headers: ['Companion', 'HP', 'AC', 'Attack', 'Special Trait'],
        rows: [
          ['Shadow Wolf', '30 + (5 × level)', '14 + Dex mod', '1d8 + Str mod', 'Pack Tactics: Advantage when ally adjacent'],
          ['Moonlight Owl', '25 + (4 × level)', '15 + Dex mod', '1d6 + Dex mod', 'Flyby: No opportunity attacks when flying away'],
          ['Thornback Panther', '35 + (6 × level)', '13 + Dex mod', '1d8 + Str mod', 'Guardian: Can intercept attacks on Huntress']
        ]
      }
    ],

    keyAbilities: {
      title: 'Key Companion Commands',
      abilities: [
        {
          name: 'Attack Command',
          cost: '1 AP',
          type: 'Command',
          description: 'Command your companion to attack a target within 30 feet. Companion deals 1d8 + your proficiency bonus damage. Generates 1 Quarry Mark on hit.'
        },
        {
          name: 'Defend Command',
          cost: '1 AP',
          type: 'Command',
          description: 'Command your companion to defend you or an ally within 10 feet. Target gains +2 AC until the start of your next turn.'
        },
        {
          name: 'Support Command',
          cost: '1 AP',
          type: 'Command',
          description: 'Command your companion to provide tactical support. Choose one: Grant ally +1 to attack rolls, impose -1 to enemy attack rolls, or grant ally +10 feet movement speed. Lasts 1 round.'
        },
        {
          name: 'Recall Companion',
          cost: '1 AP',
          type: 'Utility',
          description: 'If your companion is more than 30 feet away or incapacitated, you can recall them to your side. Companion appears adjacent to you and is no longer incapacitated.'
        }
      ]
    },

    strategicTips: {
      title: 'Strategic Tips',
      content: `**Early Combat (Rounds 1-3)**:
Focus on generating Quarry Marks through aggressive attacks. Use companion Attack commands to build marks quickly. Position for glaive chains.

**Mid Combat (Rounds 4-6)**:
Start spending marks strategically. Use 2-mark Extended Chain when enemies are grouped. Save 3-mark Companion Specials for crowd control or emergency defense.

**Late Combat (Rounds 7+)**:
Build to 5 marks for ultimate abilities to finish off tough enemies or turn the tide of battle. Use companion Defend commands to protect low-health allies.

**Companion Management**:
- Keep companion within 30 feet for commands
- Use Defend when companion is low on HP
- Recall companion if they're in danger
- Position companion for Pack Tactics (Shadow Wolf) or intercepts (Thornback Panther)

**Mark Economy**:
- Don't hoard marks - spend them regularly
- 2-mark Extended Chains are very efficient for AoE damage
- Save 5-mark ultimates for boss fights or critical moments
- Use 1-mark Empowered Strikes to finish off low-health enemies`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Huntress Specializations',
    subtitle: 'Three Paths of the Hunt',
    
    description: `Every Huntress chooses one of three specializations that define their combat style. Each specialization emphasizes different aspects of glaive combat, companion synergy, or mobility, offering unique passive abilities and playstyles.`,
    
    sharedPassive: {
      name: 'Hunter\'s Instinct',
      icon: 'ability_hunter_mastermarksman',
      description: 'You have advantage on Perception and Survival checks. Additionally, you and your companion can communicate telepathically within 100 feet.'
    },

    specs: [
      {
        id: 'bladestorm',
        name: 'Bladestorm',
        icon: 'ability_rogue_fanofknives',
        color: '#DC143C',
        theme: 'Multi-Target Devastation',
        
        description: `The Bladestorm specialization focuses on maximizing the Shadow Glaive's chain attack potential. These Huntresses are masters of positioning and timing, able to strike multiple enemies in a single fluid motion. They excel in situations where enemies are grouped together, turning their glaive into a whirlwind of death.`,
        
        playstyle: 'Aggressive multi-target damage dealer, positioning for maximum chain attacks and area control',
        
        strengths: [
          'Highest multi-target damage among Huntress specs',
          'Can chain to 5 targets instead of 4 (with passive)',
          'Momentum-based damage scaling',
          'Excellent against grouped enemies'
        ],
        
        weaknesses: [
          'Less effective against spread-out enemies',
          'Lower single-target damage than Shadowdancer',
          'Requires careful positioning',
          'Companion plays secondary role'
        ],
        
        passiveAbilities: [
          {
            name: 'Whirling Blades',
            icon: 'ability_rogue_slicedice',
            description: 'Your Shadow Glaive can chain to +1 additional target (total of 5 targets: 1d8 → 1d6 → 1d4 → 1d2 → 1d2). This does not cost Quarry Marks.'
          },
          {
            name: 'Momentum',
            icon: 'ability_warrior_intensifyrage',
            description: 'Each successful chain attack grants you +1 to your next attack roll. This bonus stacks up to +3 and resets if you miss an attack.'
          }
        ],
        
        recommendedSpells: [
          'Glaive Toss - Your bread-and-butter chain attack',
          'Whirling Death - Spin attack for maximum AoE',
          'Blade Fury - Ultimate ability for massive multi-target burst',
          'Swift Assault - Rapid strikes to build Momentum'
        ]
      },
      {
        id: 'beastmaster',
        name: 'Beastmaster',
        icon: 'ability_hunter_beastcall',
        color: '#228B22',
        theme: 'Companion Synergy',
        
        description: `The Beastmaster specialization deepens the bond between Huntress and companion, creating a fighting duo that operates as a single deadly unit. These Huntresses coordinate their attacks perfectly with their beasts, overwhelming enemies through synchronized strikes and tactical positioning.`,
        
        playstyle: 'Coordinated attacks with companion, tactical positioning for Pack Tactics, balanced damage distribution',
        
        strengths: [
          'Strongest companion damage and utility',
          'Pack Tactics provides consistent advantage',
          'Companion has enhanced survivability',
          'Excellent single-target focus fire'
        ],
        
        weaknesses: [
          'Heavily reliant on companion staying alive',
          'Lower personal damage than other specs',
          'Requires positioning both Huntress and companion',
          'Vulnerable if companion is killed'
        ],
        
        passiveAbilities: [
          {
            name: 'Primal Bond',
            icon: 'ability_druid_primalprecision',
            description: 'Your companion deals +1d4 damage on all attacks. Additionally, your companion\'s maximum HP is increased by 50%.'
          },
          {
            name: 'Pack Tactics',
            icon: 'ability_hunter_aspectoftheviper',
            description: 'When you and your companion attack the same target, both of you gain advantage on attack rolls against that target until the end of your turn.'
          }
        ],
        
        recommendedSpells: [
          'Companion Strike - Enhanced companion attack',
          'Coordinated Assault - Simultaneous attacks with advantage',
          'Primal Rage - Companion ultimate ability',
          'Mark Quarry - Build marks for companion empowerment'
        ]
      },
      {
        id: 'shadowdancer',
        name: 'Shadowdancer',
        icon: 'ability_rogue_shadowdance',
        color: '#4B0082',
        theme: 'Stealth & Mobility',
        
        description: `The Shadowdancer specialization embraces the shadows, using stealth and mobility to strike from unexpected angles. These Huntresses are assassins who blend hit-and-run tactics with devastating burst damage, appearing from nowhere to eliminate priority targets before vanishing back into darkness.`,
        
        playstyle: 'High mobility assassin, stealth attacks, burst damage, hit-and-run tactics',
        
        strengths: [
          'Highest single-target burst damage',
          'Exceptional mobility with enhanced Shadowstep',
          'Stealth attacks deal massive damage',
          'Superior survivability through evasion'
        ],
        
        weaknesses: [
          'Lower sustained damage than Bladestorm',
          'Requires stealth setup for maximum damage',
          'Less effective in prolonged fights',
          'Companion plays support role'
        ],
        
        passiveAbilities: [
          {
            name: 'Shadow Veil',
            icon: 'ability_stealth',
            description: 'After using Shadowstep, you gain +2 AC and advantage on Stealth checks for 1 round. You can hide for 1 AP during this time.'
          },
          {
            name: 'Lethal Precision',
            icon: 'ability_rogue_deadlybrew',
            description: 'Attacks made from stealth or immediately after using Shadowstep deal an additional 2d6 damage. This bonus applies to both glaive and companion attacks.'
          }
        ],
        
        recommendedSpells: [
          'Shadowstep - Core mobility and damage amplifier',
          'Shadow Strike - Massive stealth attack',
          'Phantom Blades - Ultimate multi-attack ability',
          'Evasion - Defensive survival tool'
        ]
      }
    ]
  },
  
  // Example Abilities - showcasing Shadow Glaive and Companion mechanics
  exampleSpells: [
    // BLADESTORM - Multi-Target Glaive Attacks
    {
      id: 'huntress_glaive_toss',
      name: 'Glaive Toss',
      description: 'Throw your Shadow Glaive at a target, chaining to additional enemies within 5 feet of each other.',
      spellType: 'ACTION',
      icon: 'ability_rogue_fanofknives',
      school: 'Physical',
      level: 1,
      specialization: 'bladestorm',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'chain',
        rangeType: 'melee',
        rangeDistance: 15,
        chainDistance: 5,
        maxChains: 4
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Throw glaive in spinning arc'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        damageType: 'slashing',
        scalingType: 'chain_reduction'
      },

      effects: {
        damage: {
          chain: {
            primary: '1d8',
            second: '1d6',
            third: '1d4',
            fourth: '1d2',
            type: 'slashing',
            chainDistance: 5
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          perHit: true,
          description: 'Generate 1 Quarry Mark for each enemy hit'
        },
        chainMechanic: {
          description: 'Chains to enemies within 5 feet of previous target',
          maxTargets: 4,
          damageReduction: 'Each chain deals less damage (1d8 → 1d6 → 1d4 → 1d2)'
        },
        bladestormPassive: {
          description: 'Bladestorm spec can chain to 5 targets (adds 1d2 fifth target)'
        }
      },

      tags: ['physical', 'damage', 'chain', 'multi-target', 'bladestorm']
    },

    {
      id: 'huntress_whirling_death',
      name: 'Whirling Death',
      description: 'Spin your Shadow Glaive in a deadly circle, striking all enemies within 10 feet.',
      spellType: 'ACTION',
      icon: 'ability_rogue_slicedice',
      school: 'Physical',
      level: 3,
      specialization: 'bladestorm',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        areaType: 'circle',
        areaSize: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 2,
        components: ['somatic'],
        somaticText: 'Spin in place with glaive extended'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d8',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          aoe: {
            formula: '2d8',
            type: 'slashing',
            shape: 'circle',
            radius: 10
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 1,
          perHit: true,
          description: 'Costs 2 marks to use, but generates 1 mark per enemy hit'
        },
        momentum: {
          description: 'Each enemy hit grants +1 Momentum (Bladestorm passive), stacking up to +3'
        }
      },

      tags: ['physical', 'damage', 'aoe', 'spin', 'bladestorm']
    },

    {
      id: 'huntress_blade_fury',
      name: 'Blade Fury',
      description: 'Unleash a devastating flurry of glaive strikes, hitting multiple targets in rapid succession.',
      spellType: 'ACTION',
      icon: 'ability_warrior_bladestorm',
      school: 'Physical',
      level: 5,
      specialization: 'bladestorm',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'melee',
        rangeDistance: 15,
        maxTargets: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 5,
        components: ['somatic'],
        somaticText: 'Rapid spinning strikes with glaive'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d8',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          multiTarget: {
            formula: '3d8',
            type: 'slashing',
            targets: 5,
            description: 'Each target takes full damage'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Ultimate ability - costs all 5 Quarry Marks'
        },
        momentum: {
          description: 'Grants maximum Momentum (+3) after use'
        },
        bladestormUltimate: {
          description: 'Bladestorm specialization ultimate ability',
          additionalEffect: 'Gain +2 AC until end of next turn'
        }
      },

      tags: ['physical', 'damage', 'multi-target', 'ultimate', 'bladestorm']
    },

    // BEASTMASTER - Companion Synergy
    {
      id: 'huntress_companion_strike',
      name: 'Companion Strike',
      description: 'Command your companion to attack a target with enhanced ferocity.',
      spellType: 'ACTION',
      icon: 'ability_hunter_beastcall',
      school: 'Physical',
      level: 1,
      specialization: 'beastmaster',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'companion',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Attack command to companion'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        damageType: 'physical',
        scalingType: 'proficiency'
      },

      effects: {
        damage: {
          companion: {
            formula: '1d8 + proficiency bonus',
            type: 'physical',
            source: 'companion'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: 'Generate 1 Quarry Mark on hit'
        },
        companionCommand: {
          type: 'attack',
          description: 'Basic companion attack command'
        },
        beastmasterPassive: {
          description: 'Beastmaster spec adds +1d4 damage (Primal Bond passive)'
        }
      },

      tags: ['physical', 'damage', 'companion', 'command', 'beastmaster']
    },

    {
      id: 'huntress_coordinated_assault',
      name: 'Coordinated Assault',
      description: 'You and your companion attack the same target simultaneously, overwhelming them with coordinated strikes.',
      spellType: 'ACTION',
      icon: 'ability_druid_primalprecision',
      school: 'Physical',
      level: 3,
      specialization: 'beastmaster',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Attack command',
        somaticText: 'Point at target'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d8',
        damageType: 'physical',
        scalingType: 'none'
      },

      effects: {
        damage: {
          huntress: {
            formula: '2d8',
            type: 'slashing',
            advantage: true
          },
          companion: {
            formula: '1d8 + proficiency',
            type: 'physical',
            advantage: true
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 2,
          description: 'Costs 2 marks, generates 2 marks (1 per hit)'
        },
        packTactics: {
          description: 'Both attacks have advantage (Pack Tactics passive)',
          requirement: 'Beastmaster specialization'
        }
      },

      tags: ['physical', 'damage', 'companion', 'coordinated', 'beastmaster']
    },

    {
      id: 'huntress_primal_rage',
      name: 'Primal Rage',
      description: 'Your companion enters a primal rage, gaining enhanced stats and attacking with savage fury.',
      spellType: 'ACTION',
      icon: 'ability_hunter_aspectoftheviper',
      school: 'Physical',
      level: 5,
      specialization: 'beastmaster',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'companion'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 5,
        components: ['verbal'],
        verbalText: 'Primal command to companion'
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Companion gains +2 to attack rolls',
          'Companion deals +2d6 damage on all attacks',
          'Companion gains +4 AC',
          'Companion has advantage on all attacks',
          'Duration: 3 rounds'
        ]
      },

      effects: {
        buff: {
          target: 'companion',
          duration: 3,
          attackBonus: 2,
          damageBonus: '2d6',
          acBonus: 4,
          advantage: true
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Ultimate ability - costs all 5 Quarry Marks'
        },
        beastmasterUltimate: {
          description: 'Beastmaster specialization ultimate ability',
          companionRage: 'Companion becomes a devastating force for 3 rounds'
        }
      },

      tags: ['buff', 'companion', 'ultimate', 'beastmaster']
    },

    // SHADOWDANCER - Stealth & Mobility
    {
      id: 'huntress_shadowstep',
      name: 'Shadowstep',
      description: 'Teleport through shadows to a nearby location, gaining advantage on your next attack.',
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowdance',
      school: 'Shadow',
      level: 1,
      specialization: 'shadowdancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'location',
        rangeType: 'teleport',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Step into shadows'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          teleport: {
            distance: 30,
            unit: 'feet'
          },
          buff: {
            nextAttack: 'advantage',
            duration: '1 attack'
          }
        }
      },

      specialMechanics: {
        shadowdancerPassive: {
          description: 'Shadowdancer spec gains +2 AC and advantage on Stealth for 1 round (Shadow Veil passive)',
          additionalEffect: 'Can hide as bonus action after Shadowstep'
        },
        lethalPrecision: {
          description: 'Next attack after Shadowstep deals +2d6 damage (Lethal Precision passive)'
        }
      },

      tags: ['utility', 'teleport', 'mobility', 'shadowdancer']
    },

    {
      id: 'huntress_shadow_strike',
      name: 'Shadow Strike',
      description: 'Strike from the shadows with devastating force, dealing massive damage to an unsuspecting target.',
      spellType: 'ACTION',
      icon: 'ability_rogue_deadlybrew',
      school: 'Shadow',
      level: 3,
      specialization: 'shadowdancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 3,
        components: ['somatic'],
        somaticText: 'Strike from stealth'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d8',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          base: {
            formula: '4d8',
            type: 'slashing',
            advantage: 'if_stealthed'
          },
          bonus: {
            formula: '2d6',
            type: 'shadow',
            condition: 'From stealth or after Shadowstep'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 3,
          generated: 2,
          description: 'Costs 3 marks, generates 2 on hit (1 base + 1 for crit potential)'
        },
        stealthRequirement: {
          description: 'Deals maximum damage when used from stealth or after Shadowstep',
          bonusDamage: '+2d6 from Lethal Precision passive'
        }
      },

      tags: ['physical', 'shadow', 'damage', 'stealth', 'burst', 'shadowdancer']
    },

    {
      id: 'huntress_phantom_blades',
      name: 'Phantom Blades',
      description: 'Create shadow copies of your glaive that strike multiple targets simultaneously.',
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowstrike',
      school: 'Shadow',
      level: 5,
      specialization: 'shadowdancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 30,
        maxTargets: 4
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra multiplicare!',
        somaticText: 'Throw glaive while creating shadow copies'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d8',
        damageType: 'shadow',
        scalingType: 'none'
      },

      effects: {
        damage: {
          multiTarget: {
            formula: '3d8',
            type: 'shadow',
            targets: 4,
            description: 'Each phantom blade strikes a different target'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Ultimate ability - costs all 5 Quarry Marks'
        },
        shadowdancerUltimate: {
          description: 'Shadowdancer specialization ultimate ability',
          phantomBlades: 'Creates 4 shadow copies that strike independently'
        },
        afterEffect: {
          description: 'After using Phantom Blades, you can Shadowstep for 1 AP for free'
        }
      },

      tags: ['shadow', 'damage', 'multi-target', 'ultimate', 'shadowdancer']
    },

    // UNIVERSAL ABILITIES - All Huntresses
    {
      id: 'huntress_moonlit_strike',
      name: 'Moonlit Strike',
      description: 'Empower your Shadow Glaive with lunar energy, dealing enhanced damage and potentially blinding your target.',
      spellType: 'ACTION',
      icon: 'spell_nature_starfall',
      school: 'Arcane',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Luna fortis!',
        somaticText: 'Glaive glows with moonlight'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      savingThrow: {
        ability: 'constitution',
        dc: 14,
        onSave: 'not_blinded'
      },

      debuffConfig: {
        effects: [
          'Target must make DC 14 Constitution save',
          'On failure: Blinded for 1 round',
          'Blinded creatures have disadvantage on attack rolls'
        ]
      },

      effects: {
        damage: {
          base: {
            formula: '2d6',
            type: 'radiant'
          }
        },
        debuff: {
          type: 'blinded',
          duration: 1,
          saveToNegate: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes full damage but not blinded',
        onFailure: 'Takes full damage and is blinded for 1 round'
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: 'Generate 1 Quarry Mark on hit'
        }
      },

      tags: ['radiant', 'damage', 'debuff', 'blind', 'universal']
    },

    {
      id: 'huntress_evasion',
      name: 'Evasion',
      description: 'Use your agility to avoid incoming attacks, increasing your defenses.',
      spellType: 'REACTION',
      icon: 'ability_rogue_feint',
      school: 'Physical',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        trigger: 'When you are targeted by an attack'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1
      },

      resourceCost: {
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Dodge and weave'
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Gain advantage on Dexterity saving throws',
          'Gain +2 AC',
          'Duration: Until start of your next turn'
        ]
      },

      effects: {
        buff: {
          acBonus: 2,
          savingThrowAdvantage: 'dexterity',
          duration: 1
        }
      },

      specialMechanics: {
        reaction: {
          trigger: 'When targeted by attack or required to make Dex save',
          timing: 'Before attack roll or saving throw'
        }
      },

      tags: ['buff', 'defense', 'reaction', 'universal']
    },

    {
      id: 'huntress_mark_quarry',
      name: 'Mark Quarry',
      description: 'Focus your hunter\'s instinct on a target, marking them as your quarry.',
      spellType: 'ACTION',
      icon: 'ability_hunter_markedfordeath',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 10
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Mark target as quarry'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          mark: {
            description: 'Generate 1 Quarry Mark immediately',
            tracking: 'You know the direction to marked target within 1 mile',
            duration: '10 minutes or until target dies'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: 'Immediately gain 1 Quarry Mark'
        },
        tracking: {
          description: 'You can sense the marked target\'s direction',
          range: '1 mile',
          duration: '10 minutes'
        }
      },

      tags: ['utility', 'mark', 'tracking', 'universal']
    },

    {
      id: 'huntress_swift_assault',
      name: 'Swift Assault',
      description: 'Perform a rapid series of glaive strikes against multiple nearby enemies.',
      spellType: 'ACTION',
      icon: 'ability_warrior_decisivestrike',
      school: 'Physical',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'melee',
        rangeDistance: 10,
        maxTargets: 3
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 1,
        components: ['somatic'],
        somaticText: 'Rapid spinning strikes'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          multiTarget: {
            formula: '1d6',
            type: 'slashing',
            targets: 3
          }
        },
        conditionalBuff: {
          condition: 'If all 3 attacks hit',
          effect: '+1 AC until start of next turn'
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 1,
          generated: 3,
          description: 'Costs 1 mark, generates up to 3 marks (1 per hit)'
        },
        conditionalBonus: {
          description: 'If all attacks hit, gain +1 AC until start of next turn'
        }
      },

      tags: ['physical', 'damage', 'multi-target', 'universal']
    }
  ]
};

