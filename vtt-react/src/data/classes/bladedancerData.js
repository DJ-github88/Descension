/**
 * Bladedancer Class Data
 * 
 * Complete class information for the Bladedancer - a martial artist who flows
 * between combat stances, building Momentum and earning Flourish through mastery.
 */

export const BLADEDANCER_DATA = {
  id: 'bladedancer',
  name: 'Bladedancer',
  icon: 'fas fa-wind',
  role: 'Damage',

  // Overview section
  overview: {
    title: 'The Bladedancer',
    subtitle: 'Master of Combat Stances',
    
    description: `The Bladedancer is a martial artist who flows seamlessly between combat stances, adapting to any situation with grace and precision. Through the Momentum & Flourish system, they build combat rhythm and earn mastery tokens, unlocking devastating abilities as they dance through battle.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Bladedancers are martial artists who have dedicated their lives to perfecting the art of combat through fluid movement and stance mastery. They view fighting as a dance—a flowing sequence of movements where each stance leads naturally into the next. Their philosophy emphasizes adaptability, grace under pressure, and the pursuit of martial perfection.

Unlike rigid martial traditions that focus on a single style, Bladedancers study multiple fighting forms and learn to transition seamlessly between them. They understand that true mastery comes not from perfecting one stance, but from knowing when and how to flow between many.

In roleplay, Bladedancers often embody:
- **The Wandering Duelist**: Traveling the world to test their skills against worthy opponents
- **The Monastery Exile**: Cast out for refusing to limit themselves to a single fighting style
- **The Dance Warrior**: Trained in both combat and performance arts, blending the two seamlessly
- **The Adaptive Survivor**: Learned to flow between styles out of necessity in brutal conflicts
- **The Style Collector**: Seeks out masters of different fighting forms to add to their repertoire

Bladedancers carry themselves with fluid grace even outside of combat. They move with purpose and economy of motion, and many practice their stance transitions as meditation. Some mark their mastery of each stance with tattoos, scars, or ritual symbols.

**Philosophy**: "Combat is a dance. Every stance is a step. Every strike is a note. Master the rhythm, and victory flows like water."`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Bladedancer is a versatile melee damage dealer who excels at:

**Adaptive Combat**: Switch between offensive, defensive, and utility stances to match the situation
**High Mobility**: Natural speed bonuses and stance-based movement abilities
**Sustained Damage**: Build Momentum through consistent attacks and spend it on powerful abilities
**Tactical Flexibility**: Each stance offers different passive effects and active abilities
**Mastery Rewards**: Earn Flourish tokens through signature moves for ultimate abilities

**Strengths**:
- Exceptional adaptability through 6 different combat stances
- High sustained damage output with Momentum scaling
- Strong mobility and repositioning capabilities
- Versatile toolkit covering offense, defense, and utility
- Rewards skillful play and stance management

**Weaknesses**:
- Requires understanding of stance network and transition paths
- Must build Momentum from 0 at start of each combat
- Stance transitions cost Momentum, limiting ability usage
- Less effective when unable to attack and build Momentum
- Complexity requires planning and tactical awareness

The Bladedancer shines in dynamic combats where they can build Momentum through consistent attacks and adapt their stance to counter enemy tactics.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Bladedancer is about reading the flow of combat and adapting your stance to match the situation. Key strategic considerations:

**Stance Network Navigation**:
- **Flowing Water** (Start): Defensive/evasive, transitions to Striking Serpent, Shadow Step, or Dancing Blade
- **Striking Serpent**: Offensive/precision, transitions to Whirling Wind, Rooted Stone, or Flowing Water
- **Whirling Wind**: AoE/multi-target, transitions to Dancing Blade or Rooted Stone
- **Rooted Stone**: Defensive/counter, transitions to Striking Serpent or Flowing Water
- **Dancing Blade** (Hub): Balanced/versatile, can transition to ANY stance (costs 4 Momentum)
- **Shadow Step**: Stealth/burst, transitions to Striking Serpent or Dancing Blade

**Momentum Management**:
- Build: +1 per hit, +2 per crit, +1 per dodge/parry
- Decay: -1 per miss or taking damage
- Spend: 2-4 for stance changes, 3-6 for abilities
- Strategy: Maintain 6+ Momentum for tactical flexibility

**Flourish Economy**:
- Earn 1 token per stance signature move
- Persist between combats (no decay)
- Spend 2-5 on ultimate abilities
- Strategy: Master all stances to maximize Flourish generation

**Specialization Synergies**:
- **Blade Dancer**: Rapid transitions (-1 Momentum cost), combo chains, flow-focused
- **Duelist**: Precision strikes, counter-attacks, defensive mastery
- **Shadow Dancer**: Stealth, burst damage, Shadow Step specialization

**Combat Flow**:
- **Opening**: Start in Flowing Water, build Momentum with safe attacks
- **Mid-Combat**: Transition to offensive stances (Striking Serpent, Whirling Wind) when Momentum is high
- **Defensive**: Fall back to Rooted Stone or Flowing Water when under pressure
- **Finishing**: Use Dancing Blade as hub to reach any stance, spend Flourish on ultimates

**Team Dynamics**:
- Works well with tanks who can protect while building Momentum
- Synergizes with supports who provide attack speed or damage buffs
- Benefits from crowd control that allows safe Momentum building
- Can adapt stance to fill gaps in team composition (tank, DPS, or utility)`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Momentum & Flourish System',
    subtitle: 'Dual Resource Combat Flow',
    
    description: `The Bladedancer uses a dual resource system: Momentum (primary) and Flourish (secondary). Momentum represents your combat rhythm and is built through successful actions but decays when you falter. Flourish represents mastery and is earned through perfect execution of stance-specific techniques.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Momentum (Primary Resource)**
- **Maximum**: 10 points
- **Generation**: +1 per successful attack, +2 per critical hit, +1 per successful dodge/parry
- **Decay**: Lose 1 Momentum per round if you miss an attack or take damage
- **Usage**: Spend 2-4 Momentum to change stances, 3-6 Momentum for powerful abilities
- **Starting Combat**: Begin each combat at 0 Momentum

**Flourish (Secondary Resource)**
- **Maximum**: 5 tokens
- **Generation**: Earn 1 token by performing a stance's signature move
- **Persistence**: Flourish tokens do NOT decay and persist between combats
- **Usage**: Spend 2-3 tokens on ultimate abilities or cross-stance combos
- **Mastery Reward**: Encourages learning and mastering each stance

**Stance System**
- **Starting Stance**: Begin combat in Flowing Water (defensive stance)
- **Stance Transitions**: Cost 2-4 Momentum depending on the transition
- **Stance Network**: Can only transition to connected stances (see network below)
- **Dancing Blade Exception**: Can transition to any stance from Dancing Blade (costs 4 Momentum)`
    },

    // Stance Network Table
    stanceNetworkTable: {
      title: 'Combat Stance Network',
      description: 'The Bladedancer can transition between stances following this network. Each stance has unique abilities and passives.',
      headers: ['Stance', 'Type', 'Passive Effects', 'Can Transition To', 'Transition Cost'],
      rows: [
        [
          'Flowing Water',
          'Defensive/Evasive',
          '+2 armor, +10 ft movement, advantage on Disengage',
          'Striking Serpent, Shadow Step, Dancing Blade',
          '2 Momentum'
        ],
        [
          'Striking Serpent',
          'Offensive/Precision',
          '+2 to attack rolls, increased crit chance',
          'Whirling Wind, Rooted Stone, Flowing Water',
          '2 Momentum'
        ],
        [
          'Whirling Wind',
          'AoE/Multi-target',
          'Attacks can cleave to adjacent enemies',
          'Dancing Blade, Rooted Stone',
          '3 Momentum'
        ],
        [
          'Rooted Stone',
          'Defensive/Counter',
          'Can use reaction to parry, riposte on successful parry',
          'Striking Serpent, Flowing Water',
          '2 Momentum'
        ],
        [
          'Dancing Blade',
          'Balanced/Versatile',
          '+1 to all rolls, can chain abilities',
          'ANY stance (universal hub)',
          '4 Momentum'
        ],
        [
          'Shadow Step',
          'Stealth/Burst',
          'Advantage on first attack, +2d6 damage on ambush',
          'Striking Serpent, Dancing Blade',
          '3 Momentum'
        ]
      ]
    },

    // Stance Abilities Table
    stanceAbilitiesTable: {
      title: 'Stance-Specific Abilities',
      description: 'Each stance grants access to unique abilities. Signature moves (★) generate 1 Flourish token when used.',
      headers: ['Stance', 'Ability Name', 'Cost', 'Effect', 'Signature'],
      rows: [
        [
          'Flowing Water',
          'Rippling Defense',
          '3 Momentum',
          'Dodge next attack automatically, gain +2 Momentum',
          ''
        ],
        [
          'Flowing Water',
          'Water\'s Embrace ★',
          '5 Momentum',
          'Become untargetable for 1 round, reposition anywhere within 30 ft',
          '★'
        ],
        [
          'Striking Serpent',
          'Viper Strike',
          '4 Momentum',
          'Attack with advantage, +1d8 damage',
          ''
        ],
        [
          'Striking Serpent',
          'Serpent\'s Fang ★',
          '6 Momentum',
          'Guaranteed critical hit, apply poison (1d6 damage/round for 3 rounds)',
          '★'
        ],
        [
          'Whirling Wind',
          'Cyclone Slash',
          '4 Momentum',
          'Attack all enemies within 10 ft',
          ''
        ],
        [
          'Whirling Wind',
          'Tempest Dance ★',
          '6 Momentum',
          'Attack all enemies within 15 ft, knock them back 10 ft',
          '★'
        ],
        [
          'Rooted Stone',
          'Iron Parry',
          '3 Momentum',
          'Parry next attack, riposte for 2d6 damage',
          ''
        ],
        [
          'Rooted Stone',
          'Mountain\'s Rebuke ★',
          '5 Momentum',
          'Parry all attacks this round, riposte each for 1d8 damage',
          '★'
        ],
        [
          'Dancing Blade',
          'Blade Flourish',
          '4 Momentum',
          'Attack twice in one action',
          ''
        ],
        [
          'Dancing Blade',
          'Dance of Blades ★',
          '6 Momentum',
          'Chain 3 different stance abilities in one turn',
          '★'
        ],
        [
          'Shadow Step',
          'Ambush Strike',
          '4 Momentum',
          'Teleport to target, attack with +3d6 damage',
          ''
        ],
        [
          'Shadow Step',
          'Vanishing Blade ★',
          '6 Momentum',
          'Become invisible, next attack is automatic critical hit',
          '★'
        ]
      ]
    },

    // Flourish Abilities Table
    flourishAbilitiesTable: {
      title: 'Flourish Ultimate Abilities',
      description: 'Powerful abilities that consume Flourish tokens. These represent the pinnacle of Bladedancer mastery.',
      headers: ['Ability Name', 'Flourish Cost', 'Effect', 'Requirements'],
      rows: [
        [
          'Perfect Form',
          '2 Flourish',
          'Gain +5 to all rolls for 3 rounds, Momentum cannot decay',
          'None'
        ],
        [
          'Stance Mastery',
          '3 Flourish',
          'All stance transitions cost 0 Momentum for 5 rounds',
          'None'
        ],
        [
          'Blade Storm',
          '3 Flourish',
          'Attack all enemies within 20 ft for 4d8 damage, knock prone',
          'Must be in Whirling Wind'
        ],
        [
          'Thousand Cuts',
          '4 Flourish',
          'Attack single target 10 times, each hit deals 1d6 damage',
          'Must be in Striking Serpent'
        ],
        [
          'Phantom Dance',
          '5 Flourish',
          'Create 3 illusory copies, each can attack independently for 1 minute',
          'Must be in Shadow Step'
        ]
      ]
    }
  },

  // Specializations
  specializations: {
    title: 'Bladedancer Specializations',
    subtitle: 'Three Paths of Martial Mastery',

    description: `Bladedancers can specialize in different aspects of stance-based combat, each offering unique approaches to the Momentum & Flourish system. These specializations focus on rapid transitions (Blade Dancer), precision counters (Duelist), or stealth burst (Shadow Dancer).`,

    passiveAbility: {
      name: 'Stance Mastery',
      description: 'All Bladedancers can flow between 6 combat stances, building Momentum through successful combat actions and earning Flourish tokens through signature moves. Begin combat in Flowing Water stance.'
    },

    specs: [
      {
        name: 'Blade Dancer',
        icon: 'fas fa-wind',
        description: 'Masters of rapid stance transitions and combo chains. Blade Dancers flow between stances with minimal cost, chaining abilities together for devastating combinations.',

        passiveAbility: {
          name: 'Flowing Transitions',
          description: 'All stance transitions cost 1 less Momentum (minimum 1). When you change stances, your next attack gains +1d6 damage.'
        },

        keyAbilities: [
          {
            name: 'Momentum Surge',
            description: 'Passive: Generate +1 additional Momentum from all sources.'
          },
          {
            name: 'Chain Dance',
            description: 'When you use an ability in one stance, you may immediately transition to a connected stance for free and use one of its abilities.'
          },
          {
            name: 'Endless Flow',
            description: 'Ultimate: For 1 minute, all stance transitions are free and you can transition to any stance regardless of network restrictions. Costs 4 Flourish.'
          }
        ]
      },

      {
        name: 'Duelist',
        icon: 'fas fa-sword',
        description: 'Masters of precision strikes and counter-attacks. Duelists excel in single combat, using perfect timing and technique to dominate opponents.',

        passiveAbility: {
          name: 'Perfect Precision',
          description: 'While in Striking Serpent or Rooted Stone stance, gain +2 to attack rolls and increased critical hit chance (crit on max damage die -1 or max).'
        },

        keyAbilities: [
          {
            name: 'Riposte Master',
            description: 'Passive: Successful parries generate 2 Momentum instead of 1. Riposte damage is doubled.'
          },
          {
            name: 'Precision Strike',
            description: 'Spend 5 Momentum to make an attack that automatically hits and deals maximum damage. If this kills the target, refund 3 Momentum.'
          },
          {
            name: 'Duel\'s End',
            description: 'Ultimate: Challenge a single enemy to a duel. For 1 minute, you both can only target each other. You gain +5 to all rolls, advantage on all attacks, and double Momentum generation. Costs 5 Flourish.'
          }
        ]
      },

      {
        name: 'Shadow Dancer',
        icon: 'fas fa-user-ninja',
        description: 'Masters of stealth and burst damage. Shadow Dancers strike from the shadows with devastating ambushes and can vanish mid-combat.',

        passiveAbility: {
          name: 'Shadow Affinity',
          description: 'You can enter Shadow Step stance from any stance (ignoring network restrictions) for 3 Momentum. While in Shadow Step, you are lightly obscured and have advantage on Stealth checks.'
        },

        keyAbilities: [
          {
            name: 'Ambush Expert',
            description: 'Passive: Attacks from Shadow Step deal +3d6 damage instead of +2d6. First attack each combat is always from Shadow Step.'
          },
          {
            name: 'Vanishing Strike',
            description: 'Spend 6 Momentum to teleport to any target within 60 ft, attack with advantage, then return to your original position. This does not provoke opportunity attacks.'
          },
          {
            name: 'Dance of Shadows',
            description: 'Ultimate: Become a shadow for 1 minute. You can teleport up to 30 ft for 1 AP, all attacks deal +4d6 damage, and you cannot be targeted by opportunity attacks. Costs 5 Flourish.'
          }
        ]
      }
    ]
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    // ===== BLADE DANCER SPECIALIZATION =====
    {
      id: 'bd_flowing_strike',
      name: 'Flowing Strike',
      description: 'Attack while transitioning between stances, dealing bonus damage based on your current Momentum.',
      spellType: 'ACTION',
      icon: 'ability_rogue_slicedice',
      school: 'Physical',
      level: 2,
      specialization: 'blade-dancer',

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
        momentum: 3,
        components: ['somatic'],
        somaticText: 'Fluid strike while shifting stance'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '2d6',
        modifier: 'AGILITY',
        damageType: 'slashing',
        bonusDamage: {
          condition: 'per_momentum_point',
          amount: '+1d4',
          description: '+1d4 damage per Momentum point you have'
        }
      },

      effects: {
        damage: {
          base: '2d6 + AGI',
          type: 'slashing',
          scaling: '+1d4 per Momentum point'
        },
        stanceTransition: {
          enabled: true,
          description: 'After this attack, you may transition to a connected stance for free'
        }
      },

      specialMechanics: {
        bladeDancerBonus: {
          enabled: true,
          effect: 'Blade Dancers can transition to any stance (not just connected) after this attack'
        },
        momentumScaling: {
          description: 'Damage increases with current Momentum, rewarding high resource management'
        }
      },

      tags: ['melee', 'damage', 'stance-transition', 'blade-dancer']
    },

    {
      id: 'bd_chain_dance',
      name: 'Chain Dance',
      description: 'Rapidly transition through multiple stances, attacking from each one in a devastating combo.',
      spellType: 'ACTION',
      icon: 'ability_warrior_bladestorm',
      school: 'Physical',
      level: 5,
      specialization: 'blade-dancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'special',
        rangeType: 'melee',
        rangeDistance: 5,
        description: 'Can target different enemies with each attack'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        momentum: 8,
        flourish: 2,
        components: ['somatic'],
        somaticText: 'Flow through multiple combat forms'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '3d8',
        modifier: 'AGILITY',
        damageType: 'slashing',
        attackCount: 3
      },

      effects: {
        multiAttack: {
          count: 3,
          damage: '3d8 + AGI each',
          type: 'slashing',
          description: 'Make 3 attacks, each from a different stance'
        },
        stanceFlow: {
          description: 'Transition through 3 different stances during this ability, ending in your choice of stance'
        }
      },

      specialMechanics: {
        stanceRequirement: {
          description: 'Must transition through 3 different stances. Each attack uses that stance\'s passive bonuses.'
        },
        flourishGeneration: {
          enabled: true,
          amount: 1,
          description: 'This is a signature Blade Dancer move - generates 1 Flourish when used'
        }
      },

      tags: ['melee', 'damage', 'multi-attack', 'stance-transition', 'blade-dancer', 'signature']
    },

    // ===== DUELIST SPECIALIZATION =====
    {
      id: 'bd_riposte',
      name: 'Perfect Riposte',
      description: 'Parry an incoming attack and counter with a devastating strike. Generates extra Momentum on success.',
      spellType: 'REACTION',
      icon: 'ability_parry',
      school: 'Physical',
      level: 3,
      specialization: 'duelist',

      typeConfig: {
        castTime: 0,
        castTimeType: 'REACTION',
        trigger: 'When an enemy attacks you'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        description: 'The attacker'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        momentum: 4,
        components: ['somatic'],
        somaticText: 'Deflect and counter in one motion'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'dexterity',
        dc: 15,
        onSuccess: 'Attack is parried, riposte deals full damage',
        onFailure: 'Attack hits normally, no riposte'
      },

      damageConfig: {
        formula: '3d8',
        modifier: 'AGILITY',
        damageType: 'piercing'
      },

      effects: {
        parry: {
          type: 'negate_attack',
          description: 'If successful, the attack is completely negated'
        },
        riposte: {
          damage: '3d8 + AGI',
          type: 'piercing',
          description: 'Counter-attack immediately after parrying'
        },
        momentumGain: {
          amount: 3,
          description: 'Gain 3 Momentum on successful parry'
        }
      },

      specialMechanics: {
        duelistBonus: {
          enabled: true,
          effect: 'Duelists gain 4 Momentum instead of 3, and riposte damage is doubled (6d8 + AGI)'
        },
        stanceRequirement: {
          stance: 'Rooted Stone',
          description: 'Most effective in Rooted Stone stance (+2 to parry DC)'
        }
      },

      tags: ['reaction', 'parry', 'counter', 'duelist']
    },

    {
      id: 'bd_precision_strike',
      name: 'Precision Strike',
      description: 'A perfectly aimed strike that targets a vital point, dealing massive damage and applying a bleeding wound.',
      spellType: 'ACTION',
      icon: 'ability_backstab',
      school: 'Physical',
      level: 4,
      specialization: 'duelist',

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
        durationType: 'instant',
        dotDuration: '3 rounds'
      },

      resourceCost: {
        momentum: 6,
        components: ['somatic'],
        somaticText: 'Precise thrust to vital point'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '4d10',
        modifier: 'AGILITY',
        damageType: 'piercing'
      },

      debuffConfig: {
        effects: [
          'Target bleeds for 2d6 damage at start of each turn for 3 rounds',
          'Target has disadvantage on Constitution saves while bleeding'
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '4d10 + AGI',
            type: 'piercing'
          },
          overTime: {
            formula: '2d6',
            type: 'slashing',
            duration: 3,
            frequency: 'start_of_turn'
          }
        },
        debuff: {
          type: 'bleeding',
          duration: 3,
          effect: 'Disadvantage on Constitution saves'
        }
      },

      specialMechanics: {
        duelistBonus: {
          enabled: true,
          effect: 'Duelists have enhanced critical hit chance (crit on max damage die -2, -1, or max)'
        },
        stanceBonus: {
          stance: 'Striking Serpent',
          effect: 'In Striking Serpent stance, this attack automatically critically hits'
        },
        flourishGeneration: {
          enabled: true,
          amount: 1,
          description: 'This is a signature Duelist move - generates 1 Flourish when used'
        }
      },

      tags: ['melee', 'damage', 'bleed', 'critical', 'duelist', 'signature']
    },

    // ===== SHADOW DANCER SPECIALIZATION =====
    {
      id: 'bd_shadow_strike',
      name: 'Shadow Strike',
      description: 'Teleport behind your target and strike from the shadows with devastating force.',
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowstrike',
      school: 'Physical',
      level: 3,
      specialization: 'shadow-dancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        description: 'Teleport to target, then attack'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        momentum: 5,
        components: ['somatic'],
        somaticText: 'Step through shadows'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '3d8',
        modifier: 'AGILITY',
        damageType: 'slashing',
        bonusDamage: {
          condition: 'from_stealth',
          amount: '+3d6',
          description: '+3d6 if attacking from Shadow Step stance'
        }
      },

      effects: {
        teleport: {
          range: 30,
          position: 'behind_target',
          description: 'Teleport to a space behind the target'
        },
        damage: {
          base: '3d8 + AGI',
          type: 'slashing',
          bonus: '+3d6 if in Shadow Step stance'
        },
        advantage: {
          condition: 'first_attack',
          description: 'This attack has advantage'
        }
      },

      specialMechanics: {
        shadowDancerBonus: {
          enabled: true,
          effect: 'Shadow Dancers can use this from any stance, automatically entering Shadow Step stance after teleporting'
        },
        stanceTransition: {
          automatic: true,
          stance: 'Shadow Step',
          description: 'Automatically enter Shadow Step stance after using this ability'
        },
        noOpportunityAttack: {
          enabled: true,
          description: 'This teleport does not provoke opportunity attacks'
        }
      },

      tags: ['melee', 'damage', 'teleport', 'shadow-dancer']
    },

    {
      id: 'bd_vanishing_blade',
      name: 'Vanishing Blade',
      description: 'Become invisible and strike with a guaranteed critical hit. The ultimate assassin technique.',
      spellType: 'ACTION',
      icon: 'ability_vanish',
      school: 'Physical',
      level: 6,
      specialization: 'shadow-dancer',

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
        durationType: 'instant',
        invisibilityDuration: '1 round'
      },

      resourceCost: {
        momentum: 8,
        flourish: 2,
        components: ['somatic'],
        somaticText: 'Fade into shadows, strike unseen'
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '6d10',
        modifier: 'AGILITY',
        damageType: 'slashing',
        guaranteedCritical: true
      },

      effects: {
        invisibility: {
          duration: 1,
          description: 'Become invisible for 1 round'
        },
        damage: {
          formula: '6d10 + AGI',
          type: 'slashing',
          critical: 'Automatic critical hit (12d10 + AGI)'
        },
        surprise: {
          effect: 'Target cannot react to this attack'
        }
      },

      specialMechanics: {
        guaranteedCritical: {
          enabled: true,
          description: 'This attack is always a critical hit, dealing double damage dice'
        },
        shadowDancerBonus: {
          enabled: true,
          effect: 'Shadow Dancers deal an additional +4d6 damage and remain invisible for 2 rounds instead of 1'
        },
        stanceRequirement: {
          stance: 'Shadow Step',
          description: 'Must be in Shadow Step stance to use this ability'
        },
        flourishGeneration: {
          enabled: true,
          amount: 1,
          description: 'This is a signature Shadow Dancer move - generates 1 Flourish when used'
        }
      },

      tags: ['melee', 'damage', 'critical', 'invisibility', 'shadow-dancer', 'signature']
    },

    // ===== UNIVERSAL ABILITIES =====
    {
      id: 'bd_stance_shift',
      name: 'Stance Shift',
      description: 'Rapidly change your combat stance to adapt to the situation. Each stance provides unique benefits.',
      spellType: 'ACTION',
      icon: 'ability_warrior_defensivestance',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'until_changed'
      },

      resourceCost: {
        momentum: 'variable',
        description: '2-4 Momentum depending on stance transition (see stance network table)'
      },

      resolution: 'AUTOMATIC',

      effects: {
        stanceChange: {
          description: 'Change to a connected stance in the stance network',
          restrictions: 'Can only transition to connected stances (see network table)'
        },
        passiveGain: {
          description: 'Gain the passive effects of the new stance immediately'
        }
      },

      specialMechanics: {
        stanceNetwork: {
          description: 'Must follow the stance network connections. Dancing Blade can transition to any stance for 4 Momentum.'
        },
        bladeDancerBonus: {
          enabled: true,
          effect: 'Blade Dancers pay 1 less Momentum for all transitions (minimum 1)'
        },
        shadowDancerBonus: {
          enabled: true,
          effect: 'Shadow Dancers can enter Shadow Step from any stance for 3 Momentum'
        }
      },

      tags: ['utility', 'stance', 'universal']
    },

    {
      id: 'bd_momentum_strike',
      name: 'Momentum Strike',
      description: 'A basic attack that generates Momentum, building your combat rhythm.',
      spellType: 'ACTION',
      icon: 'inv_sword_04',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

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
        momentum: 0,
        components: ['somatic'],
        somaticText: 'Swift strike'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '1d8',
        modifier: 'AGILITY',
        damageType: 'slashing'
      },

      effects: {
        damage: {
          formula: '1d8 + AGI',
          type: 'slashing'
        },
        momentumGeneration: {
          onHit: 1,
          onCrit: 2,
          description: 'Generate 1 Momentum on hit, 2 on critical hit'
        }
      },

      specialMechanics: {
        basicAttack: {
          description: 'This is the Bladedancer\'s basic attack for building Momentum'
        },
        bladeDancerBonus: {
          enabled: true,
          effect: 'Blade Dancers generate +1 additional Momentum from this attack'
        },
        stanceModifiers: {
          description: 'This attack benefits from your current stance\'s passive effects'
        }
      },

      tags: ['melee', 'damage', 'momentum-generation', 'universal']
    }
  ]
};

export default BLADEDANCER_DATA;

