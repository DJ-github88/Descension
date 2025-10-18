/**
 * Dreadnaught Class Data
 * 
 * Complete class information for the Dreadnaught - a dark resilient tank
 * that converts damage taken into Dark Resilience Points (DRP) for powerful abilities.
 */

export const DREADNAUGHT_DATA = {
  id: 'dreadnaught',
  name: 'Dreadnaught',
  icon: 'fas fa-shield',
  role: 'Tank',

  // Overview section
  overview: {
    title: 'The Dreadnaught',
    subtitle: 'Dark Resilient Tank',
    
    description: `The Dreadnaught taps into their dark connection to fuel their resilience and power. As they take damage, they build up Dark Resilience Points (DRP), which can be used to enhance their defensive and offensive capabilities. This system emphasizes the Dreadnaught's ability to absorb and utilize damage taken, turning it into a powerful resource for both offense and defense.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Dreadnaughts are warriors who have embraced the darkness to become nearly indestructible. They have made pacts with shadow entities or undergone dark rituals that allow them to convert pain and suffering into power. In roleplay, Dreadnaughts often carry the weight of their dark bargains, appearing as grim, unyielding figures on the battlefield.

Their connection to darkness manifests physically: shadowy auras surround them, wounds close with dark energy, and their presence exudes an ominous chill. The more damage they take, the more their dark power grows, creating an intimidating feedback loop.

Common Dreadnaught archetypes include:
- **The Cursed Knight**: Once noble, now bound to darkness for power
- **The Undying Sentinel**: Refuses to fall, sustained by dark forces
- **The Pain Harvester**: Feeds on suffering to fuel their abilities
- **The Shadow Pact Warrior**: Made a deal with dark entities for immortality`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Dreadnaught is a frontline tank who thrives on taking damage. They excel at:

**Damage Absorption**: Converting incoming damage into DRP creates a unique tanking dynamic
**Adaptive Defense**: Can spend DRP on shields, AC boosts, or damage resistance
**Sustained Presence**: Passive regeneration and resistance keep them in the fight
**Offensive Pressure**: Wraith Strike and Necrotic Aura provide damage output
**Last Stand Capability**: Dark Rebirth allows recovery from lethal damage

The Dreadnaught's power scales with the danger they face. The more damage they take, the more resources they have to work with. This creates exciting gameplay where taking hits is actually beneficial, as long as they manage their DRP wisely.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Dreadnaught is about converting pain into power. Key strategic considerations:

**DRP Generation**: 
- Gain 1 DRP for every 5 damage taken
- Maximum capacity: 50 DRP
- Position yourself to take hits and build resources

**DRP Spending Priorities**: 
- **Shadow Shield** (2:1 ratio): Spend DRP to absorb twice the damage
- **Wraith Strike** (1d6 per 5 DRP): Add necrotic damage to attacks
- **Unholy Fortitude** (+1 AC per 5 DRP): Boost defense for sustained combat
- **Necrotic Aura** (15 DRP): Debuff enemies with disadvantage on attacks

**Passive Benefits**: 
- At 10+ DRP: Gain resistance to one damage type
- At 10+ DRP: Regenerate 1 HP per 10 DRP at turn start
- At 20+ DRP: Regenerate 2 HP per turn
- At 30+ DRP: Regenerate 3 HP per turn

**Dark Rebirth**: 
- Automatically triggers when reaching 0 HP
- Spend all remaining DRP to regain HP equal to twice the DRP
- Your ultimate survival tool—always keep some DRP in reserve

**Resource Management**: 
- Don't spend all DRP immediately—save some for emergencies
- Balance between offensive (Wraith Strike) and defensive (Shadow Shield) spending
- Time Necrotic Aura for maximum impact when surrounded
- Always keep 10+ DRP for passive benefits`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Dark Resilience Points (DRP)',
    subtitle: 'Convert Pain into Power',
    
    description: `Dark Resilience Points represent the Dreadnaught's ability to absorb damage and convert it into dark energy. Every hit they take fuels their power, allowing them to unleash devastating abilities or create impenetrable defenses. The more they suffer, the stronger they become.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**DRP Generation**: Gain 1 DRP for every 5 points of damage taken
**Maximum Capacity**: Can store up to 50 DRP
**Persistence**: DRP persists between combats until spent or until you rest

**Spending DRP**:
Dreadnaught abilities consume DRP to create powerful effects. The more DRP you spend, the stronger the effect.

**Passive Benefits**:
Simply having DRP provides ongoing benefits:
- **Dark Resistance** (10+ DRP): Gain resistance to one damage type of your choice
- **Health Regeneration** (10+ DRP): Regenerate 1 HP per 10 DRP at the start of each turn

**Dark Rebirth**:
When you reach 0 hit points, automatically spend all remaining DRP to regain hit points equal to twice the DRP spent. This can save you from death, but leaves you at 0 DRP afterward.`
    },
    
    drpAbilitiesTable: {
      title: 'DRP Abilities & Costs',
      headers: ['Ability', 'DRP Cost', 'Effect', 'Usage'],
      rows: [
        ['Shadow Shield', 'Variable', 'Absorb damage equal to 2× DRP spent', 'Any time'],
        ['Wraith Strike', '5/10/15/20', 'Deal +1d6/2d6/3d6/4d6 necrotic damage on next attack', 'On next attack'],
        ['Unholy Fortitude', '5/10/15/20', 'Increase AC by +1/+2/+3/+4 for 1 minute', 'Any time'],
        ['Necrotic Aura', '15', 'Enemies within 10 feet have disadvantage on attacks for 1 minute', 'Any time'],
        ['Dark Rebirth', 'All remaining', 'Regain HP equal to 2× DRP when reaching 0 HP', 'Automatic']
      ]
    },

    passiveEffectsTable: {
      title: 'Passive DRP Benefits',
      headers: ['DRP Threshold', 'Passive Effect', 'Notes'],
      rows: [
        ['10+', 'Dark Resistance: Resistance to one damage type', 'Choose type when reaching 10 DRP'],
        ['10+', 'Regenerate 1 HP at start of turn', 'Scales with DRP amount'],
        ['20+', 'Regenerate 2 HP at start of turn', 'Increased regeneration'],
        ['30+', 'Regenerate 3 HP at start of turn', 'Maximum regeneration'],
        ['40+', 'Regenerate 4 HP at start of turn', 'Elite survivability'],
        ['50', 'Regenerate 5 HP at start of turn', 'Maximum DRP capacity']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Early Combat (0-15 DRP)**: Focus on building DRP by positioning yourself to take hits. Use basic attacks and save DRP for critical moments.

**Mid Combat (16-30 DRP)**: Your sweet spot. You have enough DRP for meaningful abilities while maintaining passive benefits. Use Shadow Shield to mitigate burst damage and Wraith Strike for offensive pressure.

**High DRP (31-50 DRP)**: Maximum power. You're regenerating significant HP each turn and have resources for multiple abilities. Consider using Necrotic Aura to control the battlefield.

**Emergency Reserve**: Always keep at least 10-15 DRP in reserve for Dark Rebirth. This ensures you can survive a lethal blow and continue fighting.

**Damage Type Selection**: When choosing your Dark Resistance damage type at 10 DRP, consider the enemies you're facing. Change it strategically as combat evolves.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Dreadnaught Specializations',
    subtitle: 'Three Paths of Dark Power',
    
    description: `Every Dreadnaught chooses one of three specializations that define their approach to dark resilience. Each specialization offers unique passive abilities and influences your DRP management strategy.`,
    
    specs: [
      {
        id: 'voidwarden',
        name: 'Voidwarden',
        icon: 'spell_shadow_twilight',
        color: '#4B0082',
        theme: 'Shadow Defense',
        
        description: `The Voidwarden specialization focuses on pure defensive power. Voidwarden Dreadnaughts maximize their damage absorption and regeneration, becoming nearly unkillable walls of shadow.`,
        
        playstyle: 'Maximum defense, high regeneration, damage absorption',
        
        strengths: [
          'Shadow Shield absorbs 2.5× DRP instead of 2×',
          'Regeneration increased by 50%',
          'Dark Resistance applies to two damage types instead of one',
          'Can use Shadow Shield as a reaction'
        ],
        
        weaknesses: [
          'Lower offensive capabilities',
          'DRP generation unchanged',
          'Requires consistent damage intake',
          'Less burst potential'
        ],
        
        keyAbilities: [
          'Void Barrier: Enhanced Shadow Shield with reaction timing',
          'Shadow Regeneration: Increased healing from passive effects',
          'Dual Resistance: Resist two damage types simultaneously'
        ],
        
        specPassive: {
          name: 'Void Embrace',
          description: 'Shadow Shield absorbs 2.5× DRP spent instead of 2×. Regeneration from DRP increased by 50%. Dark Resistance applies to two damage types.'
        }
      },
      {
        id: 'soulreaver',
        name: 'Soulreaver',
        icon: 'spell_shadow_soulleech_3',
        color: '#8B0000',
        theme: 'Life Drain',
        
        description: `The Soulreaver specialization combines defense with life-stealing offense. Soulreaver Dreadnaughts drain life from enemies to fuel their dark power, creating a self-sustaining cycle of damage and healing.`,
        
        playstyle: 'Balanced offense/defense, life drain, self-sustain',
        
        strengths: [
          'Wraith Strike heals for 50% of necrotic damage dealt',
          'Generate 1 DRP when dealing necrotic damage',
          'Attacks against you generate +1 DRP (total 1 per 4 damage)',
          'Can convert HP into DRP (5 HP = 1 DRP)'
        ],
        
        weaknesses: [
          'Requires offensive actions to maximize benefits',
          'Less pure defense than Voidwarden',
          'HP conversion can be risky',
          'Dependent on hitting enemies'
        ],
        
        keyAbilities: [
          'Soul Siphon: Wraith Strike heals for damage dealt',
          'Blood to Shadow: Convert HP into DRP',
          'Reaping Strike: Generate DRP from necrotic damage'
        ],
        
        specPassive: {
          name: 'Soul Harvest',
          description: 'Wraith Strike heals for 50% of necrotic damage dealt. Generate 1 DRP when dealing necrotic damage. Gain 1 DRP per 4 damage taken instead of per 5.'
        }
      },
      {
        id: 'doomguard',
        name: 'Doomguard',
        icon: 'spell_shadow_demonicempathy',
        color: '#2F4F4F',
        theme: 'Retribution',
        
        description: `The Doomguard specialization focuses on turning damage taken into devastating counterattacks. Doomguard Dreadnaughts punish enemies for attacking them, creating a dangerous aura of retribution.`,
        
        playstyle: 'Counterattack focus, area damage, punishment mechanics',
        
        strengths: [
          'Automatically deal 1d6 shadow damage to attackers',
          'Necrotic Aura costs 10 DRP instead of 15',
          'Necrotic Aura also deals 1d6 shadow damage per turn',
          'Dark Rebirth grants temporary rage on revival'
        ],
        
        weaknesses: [
          'Lower direct defense than Voidwarden',
          'Requires being attacked to maximize damage',
          'Less self-healing than Soulreaver',
          'Counterattack damage is modest'
        ],
        
        keyAbilities: [
          'Retribution Aura: Damage attackers automatically',
          'Enhanced Necrotic Aura: Reduced cost and added damage',
          'Vengeful Rebirth: Dark Rebirth grants combat bonuses'
        ],
        
        specPassive: {
          name: 'Aura of Doom',
          description: 'Attackers take 1d6 shadow damage when they hit you. Necrotic Aura costs 10 DRP and deals 1d6 shadow damage per turn. Dark Rebirth grants +2 to attack and damage for 1 minute.'
        }
      }
    ]
  },
  
  // Example Spells - organized by specialization, showcasing DRP system
  exampleSpells: [
    // DEFENSIVE ABILITIES - Shadow Shield & Protection
    {
      id: 'dread_shadow_shield',
      name: 'Shadow Shield',
      description: 'Create a shield of dark energy that absorbs damage equal to twice the DRP spent.',
      spellType: 'REACTION',
      icon: 'spell_shadow_antishadow',
      school: 'Abjuration',
      level: 1,
      specialization: 'voidwarden',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION'
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
          type: 'drp',
          cost: 'variable',
          description: 'Spend any amount of DRP'
        },
        components: ['somatic'],
        somaticText: 'Raise hand to summon shadow barrier'
      },

      resolution: 'NONE',

      buffConfig: {
        effects: [
          'Absorb damage equal to 2× DRP spent',
          'Voidwarden: Absorbs 2.5× DRP spent',
          'Can be used as a reaction to incoming damage'
        ]
      },

      effects: {
        shield: {
          instant: {
            formula: '2 × DRP_SPENT',
            type: 'absorption',
            voidwardenBonus: '2.5 × DRP_SPENT'
          }
        }
      },

      specialMechanics: {
        drp: {
          cost: 'variable',
          effect: 'Absorb 2× DRP spent (2.5× for Voidwarden)',
          timing: 'Reaction to taking damage'
        }
      },

      tags: ['defense', 'shield', 'absorption', 'drp', 'dreadnaught']
    },

    {
      id: 'dread_unholy_fortitude',
      name: 'Unholy Fortitude',
      description: 'Enhance your resilience with dark power, increasing AC by 1 for every 5 DRP spent for one minute.',
      spellType: 'ACTION',
      icon: 'spell_shadow_unholyfrenzy',
      school: 'Abjuration',
      level: 2,
      specialization: 'voidwarden',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'drp',
          cost: 'variable',
          description: 'Spend 5/10/15/20 DRP'
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra Fortis!',
        somaticText: 'Dark energy swirls around you'
      },

      resolution: 'NONE',

      buffConfig: {
        stats: {
          armorClass: '+1 per 5 DRP spent'
        },
        effects: [
          '5 DRP: +1 AC for 1 minute',
          '10 DRP: +2 AC for 1 minute',
          '15 DRP: +3 AC for 1 minute',
          '20 DRP: +4 AC for 1 minute'
        ]
      },

      effects: {
        buff: {
          duration: 60,
          stats: {
            ac: 'DRP_SPENT / 5'
          }
        }
      },

      specialMechanics: {
        drp: {
          cost: '5/10/15/20',
          effect: '+1 AC per 5 DRP spent',
          duration: '1 minute'
        }
      },

      tags: ['buff', 'ac', 'defense', 'drp', 'dreadnaught']
    },

    // OFFENSIVE ABILITIES - Wraith Strike & Damage
    {
      id: 'dread_wraith_strike',
      name: 'Wraith Strike',
      description: 'Empower your weapon with necrotic energy for a devastating strike, dealing additional necrotic damage.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Necromancy',
      level: 2,
      specialization: 'soulreaver',

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
          type: 'drp',
          cost: 'variable',
          description: 'Spend 5/10/15/20 DRP'
        },
        components: ['somatic'],
        somaticText: 'Channel dark energy into weapon'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6 per 5 DRP',
        damageType: 'necrotic',
        scalingType: 'drp_based'
      },

      healingConfig: {
        formula: '50% of necrotic damage dealt',
        healingType: 'self',
        condition: 'Soulreaver specialization only'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d6 per 5 DRP spent',
            type: 'necrotic'
          }
        },
        healing: {
          conditional: {
            spec: 'soulreaver',
            formula: '50% of necrotic damage dealt',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        drp: {
          cost: '5/10/15/20',
          effect: '+1d6/2d6/3d6/4d6 necrotic damage',
          soulreaverBonus: 'Heal for 50% of necrotic damage dealt'
        }
      },

      tags: ['damage', 'necrotic', 'melee', 'drp', 'life-drain', 'dreadnaught']
    },

    {
      id: 'dread_necrotic_aura',
      name: 'Necrotic Aura',
      description: 'Emit an aura of dark energy that weakens enemies within 10 feet, giving them disadvantage on attack rolls.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadesofdarkness',
      school: 'Necromancy',
      level: 3,
      specialization: 'doomguard',

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
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'drp',
          cost: 15,
          description: '15 DRP (10 DRP for Doomguard)'
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Aura Mortis!',
        somaticText: 'Spread arms to release dark aura'
      },

      resolution: 'NONE',

      debuffConfig: {
        effects: [
          'All enemies within 10 feet have disadvantage on attack rolls',
          'Doomguard: Also deals 1d6 shadow damage per turn',
          'Duration: 1 minute',
          'Aura moves with you'
        ]
      },

      damageConfig: {
        formula: '1d6',
        damageType: 'shadow',
        frequency: 'per turn',
        condition: 'Doomguard specialization only'
      },

      effects: {
        debuff: {
          duration: 60,
          aoe: true,
          radius: 10,
          effect: 'disadvantage on attack rolls'
        },
        damage: {
          conditional: {
            spec: 'doomguard',
            formula: '1d6',
            type: 'shadow',
            frequency: 'per_turn'
          }
        }
      },

      specialMechanics: {
        drp: {
          cost: '15 (10 for Doomguard)',
          effect: 'Enemies have disadvantage on attacks',
          doomguardBonus: 'Also deals 1d6 shadow damage per turn'
        }
      },

      tags: ['debuff', 'aoe', 'disadvantage', 'drp', 'dreadnaught']
    },

    // ULTIMATE ABILITY - Dark Rebirth
    {
      id: 'dread_dark_rebirth',
      name: 'Dark Rebirth',
      description: 'Upon reaching 0 hit points, automatically spend all remaining DRP to revive with health equal to twice the DRP.',
      spellType: 'PASSIVE',
      icon: 'spell_shadow_demonicempathy',
      school: 'Necromancy',
      level: 5,
      specialization: 'all',

      typeConfig: {
        castTime: 0,
        castTimeType: 'AUTOMATIC'
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
          type: 'drp',
          cost: 'all_remaining',
          description: 'Automatically spend all DRP'
        },
        components: [],
        trigger: 'Reaching 0 hit points'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '2 × all remaining DRP',
        healingType: 'self',
        trigger: 'Reaching 0 HP'
      },

      buffConfig: {
        effects: [
          'Automatically triggers when reaching 0 HP',
          'Regain HP equal to 2× all remaining DRP',
          'DRP resets to 0 after revival',
          'Doomguard: Gain +2 to attack and damage for 1 minute after revival'
        ]
      },

      effects: {
        healing: {
          instant: {
            formula: '2 × ALL_DRP',
            target: 'self',
            trigger: 'death'
          }
        },
        buff: {
          conditional: {
            spec: 'doomguard',
            duration: 60,
            stats: {
              attackBonus: 2,
              damageBonus: 2
            }
          }
        }
      },

      specialMechanics: {
        drp: {
          cost: 'All remaining DRP',
          effect: 'Revive with 2× DRP as HP',
          trigger: 'Automatic when reaching 0 HP',
          doomguardBonus: '+2 attack and damage for 1 minute after revival'
        }
      },

      tags: ['healing', 'revival', 'ultimate', 'drp', 'dreadnaught']
    },

    // UTILITY ABILITIES
    {
      id: 'dread_dark_resistance',
      name: 'Dark Resistance',
      description: 'While you have at least 10 DRP, gain resistance to one damage type of your choice.',
      spellType: 'PASSIVE',
      icon: 'spell_shadow_antishadow',
      school: 'Abjuration',
      level: 1,
      specialization: 'all',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'drp',
          cost: 0,
          description: 'Requires 10+ DRP'
        },
        components: []
      },

      resolution: 'PASSIVE',

      buffConfig: {
        effects: [
          'Requires 10+ DRP to activate',
          'Choose one damage type to resist',
          'Can change damage type when DRP drops below 10 and rises again',
          'Voidwarden: Resist two damage types instead of one'
        ]
      },

      effects: {
        buff: {
          condition: 'DRP >= 10',
          resistances: ['chosen_type'],
          voidwardenBonus: 'Two damage types'
        }
      },

      specialMechanics: {
        drp: {
          threshold: 10,
          effect: 'Resistance to one damage type',
          voidwardenBonus: 'Resistance to two damage types'
        }
      },

      tags: ['passive', 'resistance', 'defense', 'drp', 'dreadnaught']
    },

    {
      id: 'dread_health_regen',
      name: 'Dark Regeneration',
      description: 'For each 10 DRP you have, regenerate 1 hit point at the start of each turn.',
      spellType: 'PASSIVE',
      icon: 'spell_shadow_lifedrain02',
      school: 'Necromancy',
      level: 1,
      specialization: 'all',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'drp',
          cost: 0,
          description: 'Requires 10+ DRP'
        },
        components: []
      },

      resolution: 'PASSIVE',

      healingConfig: {
        formula: '1 HP per 10 DRP',
        healingType: 'self',
        frequency: 'start_of_turn'
      },

      buffConfig: {
        effects: [
          '10 DRP: Regenerate 1 HP per turn',
          '20 DRP: Regenerate 2 HP per turn',
          '30 DRP: Regenerate 3 HP per turn',
          '40 DRP: Regenerate 4 HP per turn',
          '50 DRP: Regenerate 5 HP per turn',
          'Voidwarden: Regeneration increased by 50%'
        ]
      },

      effects: {
        healing: {
          ongoing: {
            formula: 'DRP / 10',
            target: 'self',
            frequency: 'start_of_turn',
            voidwardenBonus: '× 1.5'
          }
        }
      },

      specialMechanics: {
        drp: {
          scaling: '1 HP per 10 DRP',
          frequency: 'Start of each turn',
          voidwardenBonus: '+50% regeneration'
        }
      },

      tags: ['passive', 'healing', 'regeneration', 'drp', 'dreadnaught']
    },

    // SOULREAVER SPECIFIC
    {
      id: 'dread_blood_to_shadow',
      name: 'Blood to Shadow',
      description: 'Convert your own hit points into Dark Resilience Points. Sacrifice 5 HP to gain 1 DRP.',
      spellType: 'ACTION',
      icon: 'spell_shadow_bloodboil',
      school: 'Necromancy',
      level: 2,
      specialization: 'soulreaver',

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
        health: 'variable',
        components: ['somatic'],
        somaticText: 'Cut yourself to release dark energy',
        description: 'Sacrifice 5/10/15/20 HP'
      },

      resolution: 'NONE',

      effects: {
        cost: {
          health: 'variable (5/10/15/20)'
        },
        gain: {
          drp: 'HP_SPENT / 5'
        }
      },

      specialMechanics: {
        conversion: {
          ratio: '5 HP = 1 DRP',
          maxConversion: '20 HP = 4 DRP per use',
          restriction: 'Soulreaver specialization only'
        }
      },

      tags: ['utility', 'conversion', 'self-damage', 'drp', 'soulreaver', 'dreadnaught']
    },

    // DOOMGUARD SPECIFIC
    {
      id: 'dread_retribution_aura',
      name: 'Aura of Retribution',
      description: 'Attackers automatically take 1d6 shadow damage when they hit you. Always active for Doomguard.',
      spellType: 'PASSIVE',
      icon: 'spell_shadow_shadowfiend',
      school: 'Necromancy',
      level: 1,
      specialization: 'doomguard',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        mana: 0,
        components: []
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '1d6',
        damageType: 'shadow',
        trigger: 'When hit by an attack'
      },

      effects: {
        counterattack: {
          automatic: {
            formula: '1d6',
            type: 'shadow',
            trigger: 'being_hit'
          }
        }
      },

      specialMechanics: {
        counterattack: {
          damage: '1d6 shadow',
          trigger: 'Whenever an enemy hits you',
          restriction: 'Doomguard specialization only'
        }
      },

      tags: ['passive', 'counterattack', 'damage', 'doomguard', 'dreadnaught']
    }
  ]
};

