/**
 * Berserker Class Data
 * 
 * Complete class information for the Berserker - a fury-driven warrior
 * with escalating rage states and devastating combat abilities.
 */

export const BERSERKER_DATA = {
  id: 'berserker',
  name: 'Berserker',
  icon: 'fas fa-axe-battle',
  role: 'Damage',

  // Overview section
  overview: {
    title: 'The Berserker',
    subtitle: 'Fury-Driven Warrior',
    
    description: `The Berserker harnesses their inner fury to unleash devastating attacks and gain incredible resilience. This class revolves around building and utilizing Rage, a resource that grows as they engage in combat. The Berserker's abilities scale with their Rage, becoming more powerful as their fury intensifies. By managing their Rage effectively, Berserkers can transition between different states of rage, each offering unique and potent effects.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Berserkers are warriors who have learned to channel their primal fury into devastating combat prowess. Unlike controlled fighters, they embrace the chaos of battle, allowing their rage to fuel superhuman feats of strength and endurance. In roleplay, Berserkers often struggle with the line between controlled fury and mindless violence.

Their rage manifests physically: veins bulge, muscles swell, eyes blaze with fury, and their very presence becomes intimidating. At higher Rage States, they may lose the ability to speak coherently, communicating only through roars and battle cries.

Common Berserker archetypes include:
- **The Tribal Warrior**: Raised in a culture that venerates battle fury
- **The Scarred Veteran**: Years of combat have awakened an unstoppable rage
- **The Cursed Bloodline**: Born with an ancestral fury they cannot fully control
- **The Righteous Avenger**: Rage fueled by a burning need for justice or revenge`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Berserker is a frontline damage dealer who thrives in the thick of combat. They excel at:

**Sustained Damage**: Building Rage through combat actions creates escalating damage output
**Resilience**: Higher Rage States grant defensive bonuses and damage resistance
**Momentum**: The longer the fight, the more dangerous the Berserker becomes
**Battlefield Control**: AOE abilities and intimidating presence affect multiple enemies

However, Berserkers must carefully manage their Rage. Letting it decay wastes their potential, while letting it exceed 100 triggers Overheat, dealing massive self-damage and resetting their Rage to 0. The key is maintaining high Rage States while spending it strategically on powerful abilities.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Berserker is about building and maintaining momentum. Key strategic considerations:

**Rage State Management**: 
- Smoldering (0-20): Building phase, basic abilities
- Frenzied (21-40): Combat effectiveness increases
- Primal (41-60): Significant power spike, self-sustain unlocked
- Carnage (61-80): Elite damage and defense
- Cataclysm (81-100): Peak performance, devastating abilities
- Obliteration (101+): Ultimate power but must spend immediately or Overheat

**Building Rage**: 
- Attack consistently to generate 1d6 Rage per attack
- Critical hits generate 2d6 Rage
- Taking damage generates 1d4 Rage (turn defense into offense)
- Defeating enemies generates 1d8 Rage

**Spending Rage**: 
- Use abilities at appropriate Rage States for maximum efficiency
- Don't hoard Rage—spending it prevents Overheat and unleashes power
- Time your big spenders (Carnage Strike, Cataclysmic Blow) for critical moments

**Rage Decay**: 
- Rage decreases by 5 points per round if no Rage-generating actions are taken
- Stay aggressive to maintain your Rage States

**Overheat Management**: 
- If Rage exceeds 101 and isn't spent within one round, you take 2d6 damage and reset to 0
- Always have a plan to spend Rage when approaching 100`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Rage States',
    subtitle: 'Escalating Fury Mechanic',
    
    description: `The Berserker's Rage is measured on a scale from 0 to 100, represented by two 10-sided dice (2d10). As they fight, the Berserker generates Rage through various actions, allowing them to access increasingly powerful states of rage. Each Rage State unlocks new abilities and enhances the Berserker's combat effectiveness.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Rage Scale**: Rage ranges from 0 to 100 (and can exceed 100 temporarily)
**Representation**: Visualized as 2d10 (each die represents 0-10, combined for 0-100 scale)

**Generating Rage**:
- **Attacking**: Generates 1d6 Rage points
- **Critical Hits**: Generates 2d6 Rage points
- **Taking Damage**: Generates 1d4 Rage points
- **Defeating an Enemy**: Generates 1d8 Rage points

**Spending Rage**:
Most Berserker abilities require Rage to activate and are more powerful at higher Rage States. Using abilities consumes Rage based on their power level.

**Rage Decay**:
At the end of each combat round, Rage decreases by 5 points if no Rage-generating actions are taken. Stay aggressive to maintain your fury.

**Overheat**:
If Rage exceeds 101 and is not spent within the next round, you suffer Overheat: take 2d6 damage and Rage resets to 0. This represents your fury becoming uncontrollable and turning inward.`
    },
    
    rageStatesTable: {
      title: 'Rage States & Abilities',
      headers: ['Rage State', 'Rage Range', 'Unlocked Abilities', 'State Benefits'],
      rows: [
        ['Smoldering', '0-20', 'Basic Strike, Defensive Stance', 'Building fury, basic combat effectiveness'],
        ['Frenzied', '21-40', 'Frenzied Slash, War Cry', '+1 to attack rolls, allies gain morale'],
        ['Primal', '41-60', 'Primal Roar, Bloodlust', '+2 to attack rolls, self-healing unlocked'],
        ['Carnage', '61-80', 'Carnage Strike, Raging Defense', '+3 to attack rolls, damage resistance'],
        ['Cataclysm', '81-100', 'Cataclysmic Blow, Unstoppable Force', '+4 to attack rolls, condition immunity'],
        ['Obliteration', '101+', 'Obliterating Strike, Wrath of the Berserker', '+5 to attack rolls, must spend or Overheat']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Early Combat (0-40 Rage)**: Focus on building Rage through attacks. Use basic abilities sparingly to conserve Rage for higher states.

**Mid Combat (41-80 Rage)**: Your sweet spot. Primal and Carnage states offer excellent damage and survivability. Alternate between spending and building.

**Peak Fury (81-100 Rage)**: Unleash devastating abilities. Plan your spending carefully—you're at maximum effectiveness but approaching Overheat threshold.

**Overheat Zone (101+ Rage)**: Emergency state. You have one round to spend excess Rage or suffer 2d6 damage and reset. Use your most expensive abilities immediately.

**Rage Decay Management**: Never let Rage decay passively. If combat is winding down, spend remaining Rage on utility abilities or defensive buffs rather than losing it.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Berserker Specializations',
    subtitle: 'Three Paths of Fury',
    
    description: `Every Berserker chooses one of three specializations that define their approach to rage-fueled combat. Each specialization offers unique passive abilities and influences your Rage management strategy.`,
    
    specs: [
      {
        id: 'savage',
        name: 'Savage',
        icon: 'ability_warrior_intensifyrage',
        color: '#8B0000',
        theme: 'Relentless Aggression',
        
        description: `The Savage specialization embodies pure, unrelenting aggression. Savage Berserkers build Rage faster and hit harder, ascending through Rage States rapidly to overwhelm enemies with brutal force.`,
        
        playstyle: 'Fast Rage generation, aggressive offense, rapid state transitions',
        
        strengths: [
          'Generate +2 Rage from all sources',
          'Critical hit chance increased by 10%',
          'Abilities cost 5 less Rage',
          'Faster ascension through Rage States'
        ],
        
        weaknesses: [
          'More prone to Overheat',
          'Limited defensive options',
          'Requires constant aggression',
          'Vulnerable when Rage is low'
        ],
        
        keyAbilities: [
          'Savage Strikes: Critical hits generate additional Rage',
          'Bloodthirst: Heal for a portion of damage dealt',
          'Reckless Abandon: Trade defense for offense at high Rage'
        ],
        
        specPassive: {
          name: 'Unrelenting Fury',
          description: 'Generate +2 Rage from all sources. Critical hits have a 25% chance to not consume Rage when using abilities.'
        }
      },
      {
        id: 'juggernaut',
        name: 'Juggernaut',
        icon: 'ability_warrior_shieldmastery',
        color: '#4169E1',
        theme: 'Immovable Force',

        description: `The Juggernaut specialization focuses on resilience and endurance. Juggernaut Berserkers use their Rage to become nearly unkillable, standing firm against overwhelming odds while their fury makes them stronger.`,

        playstyle: 'Defensive Rage usage, damage mitigation, sustained combat',

        strengths: [
          'Gain temporary HP equal to Rage spent',
          'Damage resistance scales with Rage State',
          'Rage Decay reduced by 50%',
          'Can maintain high Rage States longer'
        ],

        weaknesses: [
          'Lower damage output',
          'Slower Rage generation',
          'Abilities cost more Rage',
          'Less burst potential'
        ],

        keyAbilities: [
          'Juggernaut\'s Endurance: Convert Rage into temporary HP',
          'Immovable Object: Become immune to forced movement',
          'Rage Armor: AC increases with Rage State'
        ],

        specPassive: {
          name: 'Juggernaut Resilience',
          description: 'Rage Decay reduced by 50%. Gain damage resistance equal to 5% per Rage State (max 30% at Obliteration).'
        }
      },
      {
        id: 'warlord',
        name: 'Warlord',
        icon: 'ability_warrior_battleshout',
        color: '#DAA520',
        theme: 'Tactical Fury',
        
        description: `The Warlord specialization combines rage with tactical awareness. Warlord Berserkers inspire allies, control the battlefield, and use their fury strategically rather than recklessly.`,
        
        playstyle: 'Team support, battlefield control, balanced Rage management',
        
        strengths: [
          'Abilities affect multiple allies',
          'War Cry grants team-wide buffs',
          'Can share Rage benefits with party',
          'Excellent in group combat'
        ],
        
        weaknesses: [
          'Less effective solo',
          'Moderate damage output',
          'Requires coordination',
          'Abilities have longer cooldowns'
        ],
        
        keyAbilities: [
          'Inspiring Presence: Allies within 30 feet gain bonus damage',
          'Commanding Shout: Grant allies temporary Rage benefits',
          'Tactical Fury: Spend Rage to grant allies advantage on attacks'
        ],
        
        specPassive: {
          name: 'Warlord\'s Command',
          description: 'War Cry and similar abilities grant allies +1 to attack and damage rolls per your Rage State (max +6). Allies within 30 feet gain +5 Rage when you defeat an enemy.'
        }
      }
    ]
  },
  
  // Example Spells - organized by specialization, showcasing Rage States mechanic
  exampleSpells: [
    // SMOLDERING STATE (0-20 Rage) - Basic Abilities
    {
      id: 'berserk_basic_strike',
      name: 'Basic Strike',
      description: 'A standard melee attack. Available at all Rage levels.',
      spellType: 'ACTION',
      icon: 'ability_warrior_savageblow',
      school: 'Martial',
      level: 1,
      specialization: 'savage',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 5
        },
        components: ['somatic'],
        somaticText: 'Swing weapon with controlled fury'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d8',
            type: 'slashing'
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Smoldering (0-20)',
          rageGeneration: '1d6 on hit'
        }
      },

      tags: ['melee', 'damage', 'basic', 'smoldering', 'berserker']
    },

    {
      id: 'berserk_defensive_stance',
      name: 'Defensive Stance',
      description: 'Channel your rage into a defensive posture, gaining +2 AC for one round.',
      spellType: 'ACTION',
      icon: 'ability_warrior_defensivestance',
      school: 'Martial',
      level: 1,
      specialization: 'juggernaut',

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
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 10
        },
        components: ['somatic'],
        somaticText: 'Adopt defensive posture'
      },

      resolution: 'NONE',

      buffConfig: {
        stats: {
          armorClass: '+2'
        },
        effects: [
          '+2 AC for 1 round',
          'Can be used reactively'
        ]
      },

      effects: {
        buff: {
          duration: 1,
          stats: {
            ac: 2
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Smoldering (0-20)',
          rageGeneration: '1d4 if hit while in stance'
        }
      },

      tags: ['defense', 'buff', 'ac', 'smoldering', 'berserker']
    },

    // FRENZIED STATE (21-40 Rage) - Escalating Power
    {
      id: 'berserk_frenzied_slash',
      name: 'Frenzied Slash',
      description: 'A powerful attack fueled by rising fury, dealing an additional 1d6 damage.',
      spellType: 'ACTION',
      icon: 'ability_warrior_cleave',
      school: 'Martial',
      level: 2,
      specialization: 'savage',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 15
        },
        components: ['somatic'],
        somaticText: 'Unleash a frenzied strike'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8+1d6',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d8+1d6',
            type: 'slashing'
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Frenzied (21-40)',
          rageGeneration: '1d6 on hit',
          bonus: '+1 to attack roll while Frenzied'
        }
      },

      tags: ['melee', 'damage', 'frenzied', 'berserker']
    },

    {
      id: 'berserk_war_cry',
      name: 'War Cry',
      description: 'Release a thunderous battle cry that increases allies\' attack rolls by +1 for one round.',
      spellType: 'ACTION',
      icon: 'ability_warrior_warcry',
      school: 'Martial',
      level: 2,
      specialization: 'warlord',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 30,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 20
        },
        components: ['verbal'],
        verbalText: 'FOR GLORY!'
      },

      resolution: 'NONE',

      buffConfig: {
        effects: [
          'All allies within 30 feet gain +1 to attack rolls for 1 round',
          'Allies gain +5 temporary Rage if they are Berserkers'
        ]
      },

      effects: {
        buff: {
          duration: 1,
          aoe: true,
          radius: 30,
          stats: {
            attackBonus: 1
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Frenzied (21-40)',
          rageGeneration: '1d4 per ally affected'
        }
      },

      tags: ['buff', 'aoe', 'support', 'frenzied', 'berserker']
    },

    // PRIMAL STATE (41-60 Rage) - Self-Sustain Unlocked
    {
      id: 'berserk_primal_roar',
      name: 'Primal Roar',
      description: 'Unleash a primal roar that deals 2d6 damage to all enemies within 10 feet.',
      spellType: 'ACTION',
      icon: 'ability_warrior_warcry',
      school: 'Martial',
      level: 3,
      specialization: 'savage',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 25
        },
        components: ['verbal'],
        verbalText: 'RAAAAGH!'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage'
      },

      damageConfig: {
        formula: '2d6',
        damageType: 'thunder',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'thunder',
            aoe: true
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Primal (41-60)',
          rageGeneration: '1d4 per enemy hit',
          bonus: '+2 to attack rolls while Primal'
        }
      },

      tags: ['aoe', 'damage', 'thunder', 'primal', 'berserker']
    },

    {
      id: 'berserk_bloodlust',
      name: 'Bloodlust',
      description: 'Channel your rage into regenerative fury, healing for 1d8 hit points.',
      spellType: 'ACTION',
      icon: 'spell_shadow_lifedrain',
      school: 'Martial',
      level: 3,
      specialization: 'savage',

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
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 30
        },
        components: ['somatic'],
        somaticText: 'Embrace the fury within'
      },

      resolution: 'NONE',

      healingConfig: {
        formula: '1d8',
        healingType: 'self'
      },

      effects: {
        healing: {
          instant: {
            formula: '1d8',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Primal (41-60)',
          bonus: 'Healing increased by +1d6 if above 50 Rage'
        }
      },

      tags: ['healing', 'self-sustain', 'primal', 'berserker']
    },

    // CARNAGE STATE (61-80 Rage) - Elite Power
    {
      id: 'berserk_carnage_strike',
      name: 'Carnage Strike',
      description: 'A devastating attack dealing an additional 3d6 damage, leaving enemies reeling.',
      spellType: 'ACTION',
      icon: 'ability_warrior_decisivestrike',
      school: 'Martial',
      level: 4,
      specialization: 'savage',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 35
        },
        components: ['somatic'],
        somaticText: 'Strike with overwhelming force'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8+3d6',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d8+3d6',
            type: 'slashing'
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Carnage (61-80)',
          rageGeneration: '2d6 on hit',
          bonus: '+3 to attack rolls while in Carnage state'
        }
      },

      tags: ['melee', 'damage', 'carnage', 'berserker']
    },

    {
      id: 'berserk_raging_defense',
      name: 'Raging Defense',
      description: 'Your fury becomes a shield. Gain resistance to all damage types for one round.',
      spellType: 'ACTION',
      icon: 'ability_warrior_shieldwall',
      school: 'Martial',
      level: 4,
      specialization: 'juggernaut',

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
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 40
        },
        components: ['somatic'],
        somaticText: 'Brace against all harm'
      },

      resolution: 'NONE',

      buffConfig: {
        effects: [
          'Gain resistance to all damage types for 1 round',
          'Take half damage from all sources'
        ]
      },

      effects: {
        buff: {
          duration: 1,
          resistances: ['all']
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Carnage (61-80)',
          rageGeneration: '1d6 per attack received while active'
        }
      },

      tags: ['defense', 'resistance', 'buff', 'carnage', 'berserker']
    },

    // CATACLYSM STATE (81-100 Rage) - Peak Performance
    {
      id: 'berserk_cataclysmic_blow',
      name: 'Cataclysmic Blow',
      description: 'A massive strike dealing 4d6 damage to a single target, potentially stunning them.',
      spellType: 'ACTION',
      icon: 'ability_warrior_titansgrip',
      school: 'Martial',
      level: 5,
      specialization: 'savage',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 45
        },
        components: ['somatic'],
        somaticText: 'Channel all fury into one devastating blow'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d6',
        damageType: 'bludgeoning',
        scalingType: 'none'
      },

      debuffConfig: {
        effects: [
          'Target must make DC 16 Constitution save or be stunned for 1 round'
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '4d6',
            type: 'bludgeoning'
          }
        },
        debuff: {
          type: 'stun',
          duration: 1,
          saveType: 'constitution',
          saveDC: 16
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Cataclysm (81-100)',
          rageGeneration: '2d6 on hit',
          bonus: '+4 to attack rolls while in Cataclysm state'
        }
      },

      tags: ['melee', 'damage', 'stun', 'cataclysm', 'berserker']
    },

    {
      id: 'berserk_unstoppable_force',
      name: 'Unstoppable Force',
      description: 'Your rage makes you immune to all conditions for one round. Nothing can stop you.',
      spellType: 'ACTION',
      icon: 'spell_nature_shamanrage',
      school: 'Martial',
      level: 5,
      specialization: 'juggernaut',

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
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 50
        },
        components: ['verbal', 'somatic'],
        verbalText: 'NOTHING STOPS ME!',
        somaticText: 'Surge forward with unstoppable momentum'
      },

      resolution: 'NONE',

      buffConfig: {
        effects: [
          'Gain immunity to all conditions for 1 round',
          'Cannot be stunned, paralyzed, frightened, charmed, or restrained',
          'Automatically succeed on saves against forced movement'
        ]
      },

      effects: {
        buff: {
          duration: 1,
          immunities: ['all_conditions']
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Cataclysm (81-100)',
          warning: 'Approaching Overheat threshold - spend Rage wisely'
        }
      },

      tags: ['buff', 'immunity', 'conditions', 'cataclysm', 'berserker']
    },

    // OBLITERATION STATE (101+ Rage) - Ultimate Power
    {
      id: 'berserk_obliterating_strike',
      name: 'Obliterating Strike',
      description: 'An ultimate attack dealing 6d6 damage to all enemies within 20 feet. Must be used immediately or risk Overheat.',
      spellType: 'ACTION',
      icon: 'ability_warrior_rampage',
      school: 'Martial',
      level: 6,
      specialization: 'savage',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 20,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 60
        },
        components: ['somatic'],
        somaticText: 'Unleash all accumulated fury in one devastating strike'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 17,
        onSaveEffect: 'half_damage'
      },

      damageConfig: {
        formula: '6d6',
        damageType: 'force',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d6',
            type: 'force',
            aoe: true
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Obliteration (101+)',
          warning: 'OVERHEAT IMMINENT - If not spent this round, take 2d6 damage and reset to 0 Rage',
          bonus: '+5 to attack rolls while in Obliteration state'
        }
      },

      tags: ['aoe', 'damage', 'ultimate', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_wrath_berserker',
      name: 'Wrath of the Berserker',
      description: 'For the next three rounds, gain advantage on all attack rolls and +5 to damage. The ultimate expression of fury.',
      spellType: 'ACTION',
      icon: 'ability_warrior_innerrage',
      school: 'Martial',
      level: 6,
      specialization: 'warlord',

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
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 50
        },
        components: ['verbal', 'somatic'],
        verbalText: 'WITNESS TRUE FURY!',
        somaticText: 'Embrace the full power of rage'
      },

      resolution: 'NONE',

      buffConfig: {
        stats: {
          damageBonus: '+5'
        },
        effects: [
          'Advantage on all attack rolls for 3 rounds',
          '+5 to all damage rolls',
          'Rage Decay suspended during duration',
          'Allies within 30 feet gain +2 to attack rolls'
        ]
      },

      effects: {
        buff: {
          duration: 3,
          stats: {
            damageBonus: 5
          },
          advantages: ['attack'],
          aura: {
            radius: 30,
            allyBonus: 2
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Obliteration (101+)',
          warning: 'OVERHEAT IMMINENT - Using this ability prevents Overheat',
          bonus: 'Rage Decay suspended for duration'
        }
      },

      tags: ['buff', 'advantage', 'damage', 'ultimate', 'obliteration', 'berserker']
    }
  ]
};

