/**
 * Lunarch Class Data
 * 
 * Complete class information for the Lunarch - a celestial archer and lunar mage
 * who channels the power of moon phases to adapt their combat style.
 */

export const LUNARCH_DATA = {
  id: 'lunarch',
  name: 'Lunarch',
  icon: 'fas fa-moon',
  role: 'Support/Control',

  // Overview section
  overview: {
    title: 'The Lunarch',
    subtitle: 'Celestial Archer and Lunar Mage',
    
    description: `The Lunarch is a master of celestial magic who draws power from the phases of the moon. Inspired by ancient lunar priestesses and celestial guardians, Lunarchs channel the ever-changing energy of the moon to adapt their combat style. Through the Phase Shift system, they flow between four distinct lunar phases, each granting unique bonuses and altering their spell effects. This dynamic resource system rewards tactical thinking and phase management, allowing Lunarchs to excel as versatile ranged combatants who can shift between offense, defense, and support as the battle demands.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Lunarchs are devoted followers of lunar deities, celestial scholars, or individuals touched by moonlight magic. They often serve as guardians of sacred groves, protectors of the night, or wandering mystics who follow the moon's guidance.

**Common Lunarch Archetypes**:
- **The Moonlight Sentinel**: A vigilant guardian who patrols under the moon's watchful gaze, protecting sacred sites and innocent travelers
- **The Celestial Scholar**: An academic who studies the movements of celestial bodies and harnesses their power through careful observation
- **The Lunar Priestess**: A devoted servant of a moon deity, channeling divine lunar power to heal allies and smite enemies
- **The Night Hunter**: A ranger who thrives in darkness, using moonlight to track prey and strike from the shadows
- **The Tide Caller**: A coastal mystic who understands the moon's influence on tides and uses this connection to manipulate water and fate

**Personality Traits**:
Lunarchs tend to be contemplative, patient, and attuned to natural cycles. They understand that power waxes and wanes, and they embrace change rather than resist it. Many are nocturnal by preference, finding peace and clarity under starlit skies.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Ranged Support/Control with adaptive damage potential

**Combat Strengths**:
- Exceptional versatility through phase shifting
- Strong ranged damage during Full Moon phase
- Excellent healing and support during Waxing Moon phase
- Superior mana efficiency and control during Waning Moon phase
- Enhanced survivability during New Moon phase

**Combat Weaknesses**:
- Requires careful phase management and timing
- Less effective when caught in wrong phase for situation
- Moderate armor and hit points (cloth/leather wearer)
- Mana-dependent for both spells and phase shifting
- Vulnerable in melee range

**Optimal Positioning**:
Lunarchs excel at medium to long range (30-60 feet), where they can safely cast spells and loose arrows while maintaining awareness of the battlefield. They should position to maximize phase benefits—staying near allies during support phases, maintaining distance during offensive phases.`
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `**Phase Management**:
The key to mastering the Lunarch is understanding when to shift phases and when to let them cycle naturally. Each phase offers distinct advantages:

- **New Moon**: Use for recovery, mana regeneration, and defensive positioning. Ideal when you need to reset or prepare for the next engagement.
- **Waxing Moon**: Perfect for supporting allies with enhanced healing and buffs. Shift here when your team needs sustain.
- **Full Moon**: Your damage phase. Unleash devastating attacks and maximize offensive spell power.
- **Waning Moon**: Control and efficiency phase. Extend debuffs, reduce mana costs, and maintain battlefield control.

**Resource Economy**:
Manual phase shifting costs 8 mana, so balance between natural cycling (every 3 rounds) and tactical shifts. Don't waste mana shifting unnecessarily—plan ahead and anticipate combat flow.

**Spell Selection**:
Choose spells that synergize with your preferred phases. Moonlight Sentinels focus on damage spells enhanced by Full Moon, Starfall Invokers leverage AoE during all phases, and Moonwell Guardians maximize Waxing Moon healing.

**Team Dynamics**:
- Coordinate with tanks to know when you'll need defensive phases
- Communicate with healers about when you'll shift to Waxing Moon for support
- Time Full Moon phases with your team's burst damage windows
- Use Waning Moon to extend crowd control effects from allies`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Lunar Phases',
    subtitle: 'Phase Shift Mechanic',
    
    description: `The Lunarch's power flows with the phases of the moon. Unlike static resource systems, the Lunar Phase mechanic is cyclical and ever-changing, reflecting the natural ebb and flow of lunar energy. Lunarchs begin each combat in the New Moon phase and can either allow phases to cycle naturally every 3 rounds or manually shift to any phase by spending mana.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Phase Cycling**:
- **Starting Phase**: All Lunarchs begin combat in New Moon phase
- **Natural Cycling**: Phases automatically advance every 3 rounds (New Moon → Waxing Moon → Full Moon → Waning Moon → New Moon)
- **Manual Shifting**: Spend 8 mana to immediately shift to any phase of your choice
- **Phase Tracking**: Your current phase is displayed on your character sheet and affects all applicable spells and abilities

**Phase Duration**:
Each phase lasts for 3 rounds when cycling naturally. Manual shifts reset the 3-round timer, meaning if you manually shift on round 2, the new phase will last for 3 full rounds from that point.

**Mana Management**:
Manual phase shifting is a significant mana investment (8 mana). Consider whether the tactical advantage of shifting immediately is worth the cost, or if you can wait for the natural cycle. In longer combats, natural cycling is more efficient. In burst situations, manual shifting can be game-changing.

**Phase Stacking**:
You can only be in one phase at a time. However, certain ultimate abilities (like Lunar Eclipse) can temporarily grant benefits from multiple phases simultaneously.`
    },

    resourceTables: [
      {
        title: 'Lunar Phase Effects',
        headers: ['Phase', 'Duration', 'Primary Benefit', 'Secondary Benefit', 'Tertiary Benefit'],
        rows: [
          ['New Moon', '3 rounds', 'Mana Regen: +1d4 per turn', 'Damage Reduction: -1d4 incoming', 'Stealth: +2 to checks'],
          ['Waxing Moon', '3 rounds', 'Spell Damage: +1d4', 'Healing Boost: +1d6', 'Movement: +10 feet'],
          ['Full Moon', '3 rounds', 'All Damage: +1d6', 'Crit Range: +2', 'Radiant Aura: 1d4 damage'],
          ['Waning Moon', '3 rounds', 'Debuff Duration: +1d4 rounds', 'Mana Cost: -1d4 (min 1)', 'Wisdom Saves: Advantage']
        ]
      },
      {
        title: 'Phase Shift Costs & Timing',
        headers: ['Action', 'Mana Cost', 'Action Type', 'Notes'],
        rows: [
          ['Natural Phase Cycle', '0 mana', 'Automatic', 'Occurs every 3 rounds'],
          ['Manual Phase Shift', '8 mana', 'Bonus Action', 'Shift to any phase immediately'],
          ['Lunar Eclipse (Ultimate)', '15 mana', 'Action', 'Gain New Moon + Full Moon benefits for 2 rounds'],
          ['Phase Lock (Passive)', '0 mana', 'Passive', 'Some abilities lock you in current phase for 1 round']
        ]
      },
      {
        title: 'Strategic Phase Usage',
        headers: ['Combat Situation', 'Recommended Phase', 'Reasoning'],
        rows: [
          ['Combat Start', 'New Moon (default)', 'Regenerate mana, reduce initial damage'],
          ['Burst Damage Window', 'Full Moon', 'Maximize damage output with +1d6 and crit bonus'],
          ['Ally Needs Healing', 'Waxing Moon', 'Enhanced healing +1d6 per spell'],
          ['Extended Control', 'Waning Moon', 'Extend debuffs, reduce mana costs'],
          ['Low Mana', 'New Moon or Waning Moon', 'Regenerate mana or reduce spell costs'],
          ['Boss Execute Phase', 'Full Moon', 'Maximum damage for finishing blow']
        ]
      }
    ],

    keyAbilities: {
      title: 'Key Phase Abilities',
      abilities: [
        {
          name: 'Phase Shift',
          cost: '8 mana',
          type: 'Bonus Action',
          description: 'Immediately shift to any lunar phase of your choice. The new phase lasts for 3 rounds before naturally cycling to the next phase.'
        },
        {
          name: 'Lunar Attunement',
          cost: 'Passive',
          type: 'Passive',
          description: 'You are always attuned to one of the four lunar phases. Your current phase affects all spells and abilities that have phase-specific effects.'
        },
        {
          name: 'Moonlight Infusion',
          cost: '4 mana',
          type: 'Reaction',
          description: 'When you cast a spell, you can spend 4 additional mana to double the phase bonus for that spell only. (Example: Full Moon +1d6 becomes +2d6 for one spell)'
        }
      ]
    },

    strategicTips: {
      title: 'Strategic Tips',
      content: `**Early Combat (Rounds 1-3)**:
Start in New Moon to build mana reserves and reduce incoming damage. Use this time to assess the battlefield and plan your phase transitions.

**Mid Combat (Rounds 4-6)**:
Shift to Full Moon for burst damage or Waxing Moon for healing, depending on team needs. This is when phase management becomes critical.

**Late Combat (Rounds 7+)**:
Use Waning Moon to extend control effects and conserve mana, or cycle back to Full Moon for execute damage on low-health enemies.

**Emergency Situations**:
- Ally at critical health: Manual shift to Waxing Moon immediately
- Boss enrage phase: Manual shift to Full Moon for maximum damage
- Surrounded by enemies: Manual shift to New Moon for damage reduction
- Running low on mana: Stay in New Moon or shift to Waning Moon

**Mana Conservation**:
Avoid manual shifting unless absolutely necessary. Three rounds is enough time for most tactical situations. Save your mana for spells rather than constant phase shifting.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Lunarch Specializations',
    subtitle: 'Three Paths of Lunar Mastery',
    
    description: `Every Lunarch chooses one of three specializations that define their approach to lunar magic. Each specialization emphasizes different aspects of the moon's power and offers unique passive abilities that enhance specific playstyles.`,
    
    sharedPassive: {
      name: 'Lunar Empowerment',
      icon: 'spell_nature_starfall',
      description: 'Your connection to the moon grants you darkvision up to 60 feet. Additionally, you have advantage on saving throws against being charmed or frightened while in Full Moon phase.'
    },

    specs: [
      {
        id: 'moonlight-sentinel',
        name: 'Moonlight Sentinel',
        icon: 'ability_hunter_sentinelowl',
        color: '#C0C0C0',
        theme: 'Precision Archer',
        
        description: `The Moonlight Sentinel specialization focuses on ranged precision and lunar-infused archery. These Lunarchs are deadly marksmen who channel moonlight through their arrows, dealing devastating damage from afar. They excel at single-target elimination and marking priority targets for their team.`,
        
        playstyle: 'Ranged damage dealer alternating between bow attacks and lunar spells, with emphasis on critical strikes during Full Moon',
        
        strengths: [
          'Highest single-target ranged damage among Lunarch specs',
          'Excellent critical strike potential during Full Moon phase',
          'Can mark targets to amplify team damage',
          'Strong at long range (60+ feet)'
        ],
        
        weaknesses: [
          'Less effective in melee range',
          'Limited AoE damage compared to Starfall Invoker',
          'Requires clear line of sight for bow attacks',
          'Dependent on Full Moon phase for peak damage'
        ],
        
        passiveAbilities: [
          {
            name: 'Lunar Precision',
            icon: 'ability_hunter_mastermarksman',
            description: 'Your critical hits during Full Moon phase deal an additional 2d6 radiant damage. This bonus applies to both weapon attacks and spell attacks.'
          },
          {
            name: "Sentinel's Mark",
            icon: 'ability_hunter_markedfordeath',
            description: 'When you hit a creature with a ranged weapon attack, you can mark them until the end of your next turn. Marked creatures take +1d4 damage from your next spell that targets them.'
          }
        ],
        
        recommendedSpells: [
          'Lunar Arrow - Your bread-and-butter ranged attack',
          "Sentinel's Shot - Mark and eliminate priority targets",
          'Moonfire Barrage - Multi-target damage when needed',
          'Phase Shift - Ensure you\'re in Full Moon for burst windows'
        ]
      },
      {
        id: 'starfall-invoker',
        name: 'Starfall Invoker',
        icon: 'spell_arcane_starfire',
        color: '#4B0082',
        theme: 'Celestial Bombardment',
        
        description: `The Starfall Invoker calls down the wrath of the heavens, raining celestial energy upon their enemies. This specialization excels at area-of-effect damage and battlefield control, making them ideal for handling multiple enemies or controlling choke points. They channel the destructive power of falling stars and cosmic beams.`,
        
        playstyle: 'AoE damage and control specialist, focusing on positioning and timing to maximize celestial bombardment effects',
        
        strengths: [
          'Exceptional AoE damage potential',
          'Strong battlefield control with blinding and stunning effects',
          'Enhanced spell range and area during Full Moon',
          'Excellent at handling multiple enemies simultaneously'
        ],
        
        weaknesses: [
          'Lower single-target damage than Moonlight Sentinel',
          'High mana consumption for AoE spells',
          'Requires good positioning to avoid friendly fire',
          'Less effective against spread-out enemies'
        ],
        
        passiveAbilities: [
          {
            name: 'Celestial Cascade',
            icon: 'spell_nature_starfall',
            description: 'Your AoE spells during Full Moon phase affect an additional 5-foot radius beyond their normal area. This does not increase mana cost.'
          },
          {
            name: 'Stellar Guidance',
            icon: 'spell_arcane_arcane04',
            description: 'During Waxing Moon phase, you gain +2 to spell attack rolls. This bonus helps ensure your celestial bombardments hit their targets.'
          }
        ],
        
        recommendedSpells: [
          'Starfall - Your signature AoE damage ability',
          'Celestial Beam - Line AoE with blinding effect',
          'Lunar Eclipse - Ultimate ability for massive burst',
          'Moonbeam - Sustained damage that changes with phases'
        ]
      },
      {
        id: 'moonwell-guardian',
        name: 'Moonwell Guardian',
        icon: 'spell_holy_elunesgrace',
        color: '#20B2AA',
        theme: 'Lunar Healer',
        
        description: `The Moonwell Guardian is a devoted protector who channels the moon's restorative power to heal and shield allies. They create sacred moonwells, bestow lunar blessings, and ensure their companions survive even the most dire battles. This specialization is essential for any party lacking dedicated healing.`,
        
        playstyle: 'Support healer and protector, focusing on sustained healing, shields, and protective buffs for the party',
        
        strengths: [
          'Strongest healing output among Lunarch specs',
          'Can grant temporary hit points and shields',
          'Provides defensive buffs to nearby allies',
          'Excellent sustained healing during Waxing Moon'
        ],
        
        weaknesses: [
          'Lowest damage output of all Lunarch specs',
          'Requires proximity to allies to maximize passive benefits',
          'Mana-intensive healing rotation',
          'Vulnerable when focused by enemies'
        ],
        
        passiveAbilities: [
          {
            name: "Elune's Grace",
            icon: 'spell_holy_holyprotection',
            description: 'Your healing spells during Waxing Moon phase grant the target 1d6 temporary hit points in addition to the healing. These temporary HP last for 1 minute.'
          },
          {
            name: 'Lunar Sanctuary',
            icon: 'spell_holy_prayerofhealing02',
            description: 'While you are in New Moon phase, all allies within 15 feet of you gain +1 AC. This bonus is lost if you move more than 15 feet away from them.'
          }
        ],
        
        recommendedSpells: [
          'Moonwell - Create persistent healing zones',
          'Lunar Blessing - Shield allies with lunar energy',
          "Elune's Grace - Powerful healing and cleansing",
          'Phase Shift - Ensure you\'re in Waxing Moon when healing is needed'
        ]
      }
    ]
  },
  
  // Example Spells - showcasing Phase Shift mechanics
  exampleSpells: [
    // MOONLIGHT SENTINEL - Precision Archery
    {
      id: 'lunarch_lunar_arrow',
      name: 'Lunar Arrow',
      description: 'Fire an arrow infused with moonlight that deals damage based on your current lunar phase.',
      spellType: 'ACTION',
      icon: 'ability_hunter_sentinelowl',
      school: 'Evocation',
      level: 1,
      specialization: 'moonlight-sentinel',

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
        durationType: 'instant'
      },

      resourceCost: {
        mana: 4,
        components: ['somatic', 'material'],
        somaticText: 'Draw and loose arrow',
        materialText: 'Arrow infused with moonlight'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        damageType: 'radiant',
        scalingType: 'none'
      },

      effects: {
        damage: {
          base: {
            formula: '1d8',
            type: 'radiant'
          },
          phaseBonus: {
            newMoon: '+1d4 (stealth damage)',
            waxingMoon: '+1d4 (spell power)',
            fullMoon: '+1d6 (maximum power)',
            waningMoon: '+0 (no bonus)'
          }
        }
      },

      specialMechanics: {
        phaseInteraction: {
          newMoon: 'If you are hidden, add +1d4 damage',
          waxingMoon: 'Add +1d4 radiant damage',
          fullMoon: 'Add +1d6 radiant damage and increase crit range by 2',
          waningMoon: 'Costs 1d4 less mana (minimum 1)'
        }
      },

      tags: ['radiant', 'damage', 'ranged', 'phase-dependent', 'moonlight-sentinel']
    },

    {
      id: 'lunarch_sentinels_shot',
      name: "Sentinel's Shot",
      description: 'Fire a powerful arrow that marks your target, causing them to take additional damage from your next spell.',
      spellType: 'ACTION',
      icon: 'ability_hunter_markedfordeath',
      school: 'Evocation',
      level: 3,
      specialization: 'moonlight-sentinel',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 80
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 2
      },

      resourceCost: {
        mana: 7,
        components: ['somatic', 'material'],
        somaticText: 'Draw arrow with focused aim',
        materialText: 'Silver-tipped arrow'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d8',
        damageType: 'radiant',
        scalingType: 'none'
      },

      debuffConfig: {
        effects: [
          "Target is Marked for 2 rounds",
          "Marked targets take +1d4 damage from your next spell"
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '2d8',
            type: 'radiant'
          }
        },
        debuff: {
          type: 'marked',
          duration: 2,
          bonusDamage: '1d4'
        }
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: 'Mark lasts 3 rounds instead of 2, and bonus damage increases to 1d6'
        },
        sentinelMark: {
          description: 'Marked targets take bonus damage from your next spell',
          stackable: false
        }
      },

      tags: ['radiant', 'damage', 'ranged', 'debuff', 'mark', 'moonlight-sentinel']
    },

    {
      id: 'lunarch_moonfire_barrage',
      name: 'Moonfire Barrage',
      description: 'Unleash a volley of moonfire-infused arrows that rain down on multiple targets.',
      spellType: 'ACTION',
      icon: 'ability_hunter_rapidkilling',
      school: 'Evocation',
      level: 5,
      specialization: 'moonlight-sentinel',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 60,
        maxTargets: 3
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['somatic', 'material'],
        somaticText: 'Rapid-fire arrow volley',
        materialText: '3 arrows'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      effects: {
        damage: {
          perTarget: {
            formula: '2d6',
            type: 'radiant',
            targets: 3
          }
        }
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: 'Can target up to 5 enemies instead of 3, and each arrow deals +1d6 damage'
        },
        multiTarget: {
          description: 'Each arrow targets a different enemy within range',
          requiresLineOfSight: true
        }
      },

      tags: ['radiant', 'damage', 'ranged', 'multi-target', 'moonlight-sentinel']
    },

    // STARFALL INVOKER - Celestial AoE
    {
      id: 'lunarch_starfall',
      name: 'Starfall',
      description: 'Call down a shower of falling stars that crash into a target area, dealing radiant damage to all enemies within.',
      spellType: 'ACTION',
      icon: 'spell_nature_starfall',
      school: 'Evocation',
      level: 2,
      specialization: 'starfall-invoker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        areaType: 'circle',
        areaSize: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 8,
        components: ['verbal', 'somatic'],
        verbalText: 'Stellae cadunt!',
        somaticText: 'Point skyward and bring hand down'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      savingThrow: {
        ability: 'dexterity',
        dc: 14,
        onSave: 'half'
      },

      effects: {
        damage: {
          aoe: {
            formula: '3d6',
            type: 'radiant',
            shape: 'circle',
            radius: 15
          }
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes half damage (1d6+3)',
        onFailure: 'Takes full damage (3d6)'
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: 'Radius increases to 20 feet (Celestial Cascade passive adds +5 feet to base 15)',
          waxingMoon: '+2 to spell attack rolls (from Stellar Guidance passive)'
        }
      },

      tags: ['radiant', 'damage', 'aoe', 'starfall-invoker']
    },

    {
      id: 'lunarch_celestial_beam',
      name: 'Celestial Beam',
      description: 'Channel a concentrated beam of celestial energy in a line, dealing radiant damage and potentially blinding targets.',
      spellType: 'ACTION',
      icon: 'spell_arcane_starfire',
      school: 'Evocation',
      level: 4,
      specialization: 'starfall-invoker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'line',
        rangeType: 'ranged',
        rangeDistance: 60,
        lineLength: 30,
        lineWidth: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 9,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux caelestis!',
        somaticText: 'Extend both hands forward'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      savingThrow: {
        ability: 'constitution',
        dc: 15,
        onSave: 'not_blinded'
      },

      debuffConfig: {
        effects: [
          'Targets who fail save are Blinded for 1 round',
          'Blinded creatures have disadvantage on attack rolls'
        ]
      },

      effects: {
        damage: {
          line: {
            formula: '4d6',
            type: 'radiant',
            length: 30,
            width: 5
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
        phaseInteraction: {
          fullMoon: 'Blinded duration increases to 2 rounds, and damage increases by +1d6'
        }
      },

      tags: ['radiant', 'damage', 'line', 'aoe', 'blind', 'debuff', 'starfall-invoker']
    },

    {
      id: 'lunarch_lunar_eclipse',
      name: 'Lunar Eclipse',
      description: 'Channel the power of both the New Moon and Full Moon simultaneously, gaining defensive and offensive benefits for a brief period.',
      spellType: 'ACTION',
      icon: 'spell_nature_nullifydisease',
      school: 'Transmutation',
      level: 6,
      specialization: 'starfall-invoker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 2
      },

      resourceCost: {
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Eclipse lunaris!',
        somaticText: 'Cross arms then spread wide'
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Gain New Moon benefits: +1d4 mana per turn, -1d4 incoming damage',
          'Gain Full Moon benefits: +1d6 to all damage, +2 crit range',
          'Radiant aura deals 1d4 damage to enemies within 10 feet',
          'Duration: 2 rounds'
        ]
      },

      effects: {
        buff: {
          duration: 2,
          benefits: [
            'New Moon: Mana regen +1d4/turn, damage reduction -1d4',
            'Full Moon: Damage +1d6, crit range +2',
            'Aura: 1d4 radiant damage to nearby enemies'
          ]
        }
      },

      specialMechanics: {
        dualPhase: {
          description: 'Grants benefits from both New Moon and Full Moon simultaneously',
          phaseLock: 'Your phase does not cycle during Eclipse duration',
          afterEffect: 'After Eclipse ends, you return to the phase you were in before casting'
        }
      },

      tags: ['buff', 'self', 'dual-phase', 'ultimate', 'starfall-invoker']
    },

    // MOONWELL GUARDIAN - Healing & Support
    {
      id: 'lunarch_moonwell',
      name: 'Moonwell',
      description: 'Create a sacred pool of lunar energy that heals all allies who stand within it.',
      spellType: 'ACTION',
      icon: 'spell_holy_elunesgrace',
      school: 'Conjuration',
      level: 2,
      specialization: 'moonwell-guardian',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        areaType: 'circle',
        areaSize: 10
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 8,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Fons lunae!',
        somaticText: 'Touch ground to create moonwell',
        materialText: 'Vial of blessed water'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '1d6',
        healingType: 'area',
        trigger: 'start_of_turn'
      },

      effects: {
        healing: {
          aoe: {
            formula: '1d6',
            trigger: 'At start of ally turn in area',
            shape: 'circle',
            radius: 10,
            duration: '1 minute'
          }
        }
      },

      specialMechanics: {
        phaseInteraction: {
          waxingMoon: 'Healing increases to 1d6+1d6 (total 2d6) and grants 1d6 temporary HP (Elune\'s Grace passive)',
          fullMoon: 'Radius increases to 15 feet',
          waningMoon: 'Duration increases to 2 minutes'
        },
        persistent: {
          description: 'Moonwell remains until duration expires or you create a new one',
          limit: 'Only one Moonwell can exist at a time'
        }
      },

      tags: ['healing', 'aoe', 'persistent', 'support', 'moonwell-guardian']
    },

    {
      id: 'lunarch_lunar_blessing',
      name: 'Lunar Blessing',
      description: 'Bestow a protective shield of lunar energy upon an ally, absorbing incoming damage.',
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordshield',
      school: 'Abjuration',
      level: 3,
      specialization: 'moonwell-guardian',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 5
      },

      resourceCost: {
        mana: 7,
        components: ['verbal', 'somatic'],
        verbalText: 'Benedictio lunae!',
        somaticText: 'Gesture toward ally'
      },

      resolution: 'AUTOMATIC',

      shieldConfig: {
        formula: '2d8',
        shieldType: 'temporary_hp',
        duration: '5 minutes'
      },

      effects: {
        shield: {
          amount: '2d8',
          type: 'temporary_hp',
          duration: '5 minutes or until depleted'
        }
      },

      specialMechanics: {
        phaseInteraction: {
          waxingMoon: 'Shield amount increases to 2d8+1d6',
          fullMoon: 'Shield also grants +1 AC while active',
          newMoon: 'If cast on ally within 15 feet, they also gain Lunar Sanctuary +1 AC bonus'
        }
      },

      tags: ['shield', 'protection', 'support', 'moonwell-guardian']
    },

    {
      id: 'lunarch_elunes_grace',
      name: "Elune's Grace",
      description: 'Channel the moon goddess\'s blessing to heal an ally and cleanse them of harmful effects.',
      spellType: 'ACTION',
      icon: 'spell_holy_holyprotection',
      school: 'Evocation',
      level: 5,
      specialization: 'moonwell-guardian',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 12,
        components: ['verbal', 'somatic'],
        verbalText: 'Gratia Elunae!',
        somaticText: 'Raise hand toward ally with palm open'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '4d8',
        healingType: 'single',
        cleanse: true
      },

      effects: {
        healing: {
          instant: {
            formula: '4d8',
            type: 'radiant'
          }
        },
        cleanse: {
          removes: ['poison', 'disease', 'curse'],
          limit: 'One condition removed'
        }
      },

      specialMechanics: {
        phaseInteraction: {
          waxingMoon: 'Healing increases to 4d8+2d6, and target gains 2d6 temporary HP (Elune\'s Grace passive doubled)',
          fullMoon: 'Can cleanse two conditions instead of one',
          waningMoon: 'Costs 1d4 less mana'
        }
      },

      tags: ['healing', 'cleanse', 'support', 'powerful', 'moonwell-guardian']
    },

    // UNIVERSAL SPELLS - Phase Manipulation
    {
      id: 'lunarch_phase_shift',
      name: 'Phase Shift',
      description: 'Manually shift to any lunar phase of your choice, resetting the natural cycle.',
      spellType: 'ACTION',
      icon: 'spell_nature_timestop',
      school: 'Transmutation',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 8,
        components: ['verbal'],
        verbalText: 'Choose phase name: "Luna Nova!" (New), "Luna Crescens!" (Waxing), "Luna Plena!" (Full), "Luna Decrescens!" (Waning)'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          phaseChange: {
            description: 'Immediately shift to chosen phase',
            duration: '3 rounds before natural cycling resumes',
            choices: ['New Moon', 'Waxing Moon', 'Full Moon', 'Waning Moon']
          }
        }
      },

      specialMechanics: {
        phaseMechanic: {
          description: 'Core ability for all Lunarchs',
          tacticalUse: 'Use to adapt to changing combat situations',
          manaCost: 'Significant investment - use wisely'
        }
      },

      tags: ['utility', 'phase-shift', 'universal', 'core-mechanic']
    },

    {
      id: 'lunarch_moonbeam',
      name: 'Moonbeam',
      description: 'Create a beam of moonlight that follows a target, dealing damage that changes based on your current phase.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing02',
      school: 'Evocation',
      level: 3,
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
        durationType: 'rounds',
        duration: 3,
        concentration: true
      },

      resourceCost: {
        mana: 9,
        components: ['verbal', 'somatic'],
        verbalText: 'Radius lunae!',
        somaticText: 'Point at target with glowing finger'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        scalingType: 'none',
        recurring: true
      },

      effects: {
        damage: {
          recurring: {
            formula: '2d6',
            type: 'radiant',
            trigger: 'Start of target turn',
            duration: 3
          }
        }
      },

      specialMechanics: {
        phaseInteraction: {
          newMoon: 'Damage type becomes necrotic, and you heal for half damage dealt',
          waxingMoon: 'Damage increases to 2d6+1d4',
          fullMoon: 'Damage increases to 2d6+1d6 and beam cannot be broken by movement',
          waningMoon: 'Duration increases to 5 rounds'
        },
        concentration: {
          description: 'Requires concentration - ends if you lose concentration',
          movement: 'Beam follows target if they move (unless in Full Moon)'
        }
      },

      tags: ['radiant', 'damage', 'concentration', 'phase-dependent', 'universal']
    },

    {
      id: 'lunarch_lunar_cycle',
      name: 'Lunar Cycle',
      description: 'Rapidly cycle through all four lunar phases in sequence, gaining brief benefits from each.',
      spellType: 'ACTION',
      icon: 'spell_arcane_arcane04',
      school: 'Transmutation',
      level: 4,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 14,
        components: ['verbal', 'somatic'],
        verbalText: 'Cyclus lunaris!',
        somaticText: 'Spin in place with arms extended'
      },

      resolution: 'AUTOMATIC',

      effects: {
        multiPhase: {
          sequence: [
            'New Moon: Restore 1d4 mana, reduce next attack by 1d4',
            'Waxing Moon: Next spell deals +1d4 damage or heals +1d6',
            'Full Moon: Next attack deals +1d6 damage with +2 crit range',
            'Waning Moon: Next spell costs 1d4 less mana'
          ],
          duration: 'Benefits last until used or 1 minute'
        }
      },

      specialMechanics: {
        rapidCycle: {
          description: 'Gain one benefit from each phase in rapid succession',
          usage: 'All benefits are active simultaneously until consumed',
          afterEffect: 'After all benefits are consumed, return to New Moon phase'
        }
      },

      tags: ['utility', 'buff', 'multi-phase', 'universal']
    }
  ]
};

