/**
 * Covenbane Class Data
 * 
 * Complete class information for the Covenbane - a stealthy witch hunter who builds
 * Hexbreaker charges to unleash devastating anti-magic attacks and abilities.
 */

export const COVENBANE_DATA = {
  id: 'covenbane',
  name: 'Covenbane',
  icon: 'fas fa-ban',
  role: 'Damage/Anti-Magic',

  // Overview Section
  overview: {
    title: 'The Covenbane',
    subtitle: 'Relentless Witch Hunter',

    description: `The Covenbane is a stealthy, agile warrior specializing in hunting down witches, warlocks, and other malevolent magic users. Inspired by Vayne from League of Legends, they combine exceptional close-quarters combat skills with a keen understanding of dark magic. Through the Hexbreaker charge system, they build power with each attack against evil spellcasters, gaining exponential increases in damage, speed, and critical hit chance.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Covenbanes are relentless hunters who have dedicated their lives to eradicating evil magic from the world. They walk a dangerous path, using dark energy and forbidden techniques to fight fire with fire. Unlike paladins who rely on divine righteousness, Covenbanes embrace the darkness to hunt those who wield it.

They understand that to hunt monsters, one must become monstrous. Each Hexbreaker charge they accumulate represents dark energy absorbed from their enemies—power they turn back against the wicked. This constant exposure to malevolent magic takes its toll, and many Covenbanes struggle with the line between hunter and hunted.

In roleplay, Covenbanes often embody:
- **The Vengeful Hunter**: Lost loved ones to dark magic and swore eternal vengeance
- **The Inquisitor**: Sanctioned by an order to hunt and eliminate magical threats
- **The Fallen Mage**: Once practiced magic, now hunts those who abuse it
- **The Monster Slayer**: Inspired by Witchers, uses alchemy and tactics to hunt supernatural threats
- **The Shadow Operative**: Works in secret to eliminate magical corruption before it spreads

Covenbanes are often solitary figures, marked by their profession. They carry silver weapons, wear protective charms, and bear scars from battles with supernatural foes. Many develop the ability to sense evil magic, their skin prickling in the presence of curses and dark spells. Some mark each kill with a tally, while others collect trophies from defeated witches and warlocks.

**Philosophy**: "To hunt the darkness, I must embrace it. To kill monsters, I must become one. But I will never become what they are—for I hunt with purpose, not malice."`
    },

    combatRole: {
      title: 'Combat Role',
      content: `The Covenbane is an anti-magic damage dealer who excels at:

**Charge Scaling**: Build Hexbreaker charges (max 6) for exponential power increases
**Anti-Magic Combat**: Specialize in hunting and neutralizing spellcasters
**True Damage**: Every third attack deals bonus true damage (Witch Hunter's Precision)
**High Mobility**: Speed bonuses from charges plus Shadow Step teleport
**Dispel Mastery**: Remove curses and magical effects from allies
**Burst Damage**: Devastating attacks when at high charge counts

**Strengths**:
- Exceptional scaling power through Hexbreaker charges
- True damage bypasses all armor and resistances
- High mobility with speed bonuses and teleport
- Strong anti-magic toolkit (counterspell, dispel, mana drain)
- Versatile specializations (stealth, anti-magic, pursuit)
- Devastating ultimate ability at 6 charges

**Weaknesses**:
- Requires building charges to reach full potential
- Gains charges primarily from evil magic users
- Must carefully manage charge spending vs passive bonuses
- Most abilities require melee or short range
- Significantly weaker at 0-2 charges
- Vulnerable to being kited before building charges

The Covenbane shines in fights against spellcasters and magical enemies, where they can rapidly build charges and unleash devastating attacks enhanced by true damage and critical hits.`
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Covenbane is about building power through relentless pursuit and knowing when to spend charges versus saving them for passive bonuses. Key strategic considerations:

**Hexbreaker Charge Management**:
- **0 Charges**: Weak, focus on building charges quickly
- **1-2 Charges**: Basic bonuses, continue building
- **3-4 Charges**: Strong power spike, consider spending on abilities
- **5-6 Charges**: Maximum power, devastating passive bonuses or ultimate ability

**Charge Generation**:
- +1 per successful attack vs evil magic users
- +1 when targeted by enemy spells
- Shadowbane passive: +1 extra charge from stealth attacks
- Strategy: Prioritize spellcaster targets to build charges rapidly

**Passive Scaling** (Always Active):
| Charges | Damage | Speed | True Damage (3rd Attack) |
|---------|--------|-------|--------------------------|
| 0 | +0 | +0 ft | +0 |
| 1 | +1d4 | +5 ft | +1d6 |
| 2 | +1d6 | +10 ft | +1d8 |
| 3 | +2d6 | +15 ft | +2d6 |
| 4 | +3d6 | +20 ft | +2d8 |
| 5 | +4d6 | +25 ft | +3d8 |
| 6 | +5d6 | +30 ft | +4d8 |

**Witch Hunter's Precision**:
- Every **third attack** vs evil magic users deals bonus true damage
- Scales with Hexbreaker charges (see table above)
- True damage ignores all armor and resistances
- At 6 charges: +4d8 true damage on every third attack

**Ability Costs**:
- Shadow Step (1): Teleport 30ft, advantage on next attack
- Curse Eater (2): Dispel curse/magic from ally
- Dark Pursuit (3): Double movement speed
- Spirit Shackle (4): Root enemy for 1 minute
- Execution (5): Instant kill if below half HP
- Hexbreaker Fury (6): AoE damage + stun all enemies in 30ft

**Specialization Synergies**:
- **Shadowbane**: Stealth attacks auto-crit at 3+ charges, +1 charge from stealth
- **Spellbreaker**: Reflect damage on successful saves, melee counterspell
- **Demonhunter**: +10ft movement per charge, cannot be slowed at 3+ charges

**Combat Flow**:
- **Opening**: Use Shadow Step to engage, start building charges
- **Early Combat**: Focus attacks on spellcasters to build charges (0→3)
- **Mid Combat**: At 3+ charges, decide between spending or continuing to build
- **High Charges**: At 5-6 charges, either maintain for passive bonuses or spend on ultimate
- **Finishing**: Use Execution on wounded targets or Hexbreaker Fury for AoE

**Target Priority**:
1. Evil magic users (build charges)
2. Enemy spellcasters (anti-magic abilities)
3. Cursed/buffed enemies (Curse Eater value)
4. Low HP targets (Execution opportunity)

**Team Dynamics**:
- Works well with crowd control that groups enemies for Hexbreaker Fury
- Synergizes with tanks who can protect while building charges
- Benefits from scouts who identify spellcaster targets
- Provides utility through Curse Eater and dispel abilities
- Can assassinate priority targets with Shadowbane specialization`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Hexbreaker System',
    subtitle: 'Accumulating Dark Energy Against Spellcasters',

    description: `The Covenbane's unique mechanic revolves around **Hexbreaker charges** - dark energy accumulated by attacking evil magic users or being targeted by spells. These charges increase the Covenbane's power exponentially, granting damage boosts, speed increases, and access to powerful abilities. A d6 tracks charges (maximum 6).`,

    mechanics: {
      title: 'How It Works',
      content: `**Accumulating Hexbreaker Charges**
- **Attack Evil Magic User**: +1 charge per successful attack against cursed/evil spellcasters
- **Targeted by Spell**: +1 charge when you are targeted by an enemy spell
- **Maximum**: 6 charges (tracked with a d6)
- **Persistence**: Charges persist between combats but decay at 1 per hour out of combat

**Using Hexbreaker Charges**
- **Passive Scaling**: Higher charges grant automatic bonuses (damage, speed, crit chance)
- **Active Abilities**: Spend charges to activate powerful abilities (1-6 charges)
- **Strategic Choice**: Balance between passive bonuses and active ability usage

**Witch Hunter's Precision (Passive)**
- **Every Third Attack**: Against cursed/evil magic users deals bonus true damage
- **Base Damage**: +1d6 true damage
- **Scaling**: Increases with Hexbreaker charges (see table below)
- **Example**: At 6 charges, third attack deals +4d8 true damage (ignores all defenses)`
    },

    // Hexbreaker Charge Scaling Table
    hexbreakerChargesTable: {
      title: 'Hexbreaker Charge Scaling',
      description: 'Passive bonuses granted by accumulated Hexbreaker charges. These bonuses are always active.',
      headers: ['Charges', 'Damage Bonus', 'Speed Bonus', 'True Damage (3rd Attack)', 'Special'],
      rows: [
        [
          '0',
          '+0',
          '+0 ft',
          '+0',
          'No bonuses'
        ],
        [
          '1',
          '+1d4',
          '+5 ft',
          '+1d6',
          'Slight power increase'
        ],
        [
          '2',
          '+1d6',
          '+10 ft',
          '+1d8',
          'Moderate power increase'
        ],
        [
          '3',
          '+2d6',
          '+15 ft',
          '+2d6',
          'Significant power increase'
        ],
        [
          '4',
          '+3d6',
          '+20 ft',
          '+2d8',
          'Major power increase'
        ],
        [
          '5',
          '+4d6',
          '+25 ft',
          '+3d8',
          'Massive power increase'
        ],
        [
          '6',
          '+5d6',
          '+30 ft',
          '+4d8',
          'Ultimate power, can use Hexbreaker Fury'
        ]
      ]
    },

    // Hexbreaker Abilities Table
    hexbreakerAbilitiesTable: {
      title: 'Hexbreaker Abilities',
      description: 'Active abilities that consume Hexbreaker charges. Choose when to spend charges strategically.',
      headers: ['Ability', 'Charge Cost', 'Effect', 'Range', 'Duration'],
      rows: [
        [
          'Vengeful Strike',
          '1-6 charges',
          'Deal weapon damage + (charges × proficiency) necrotic damage',
          'Melee',
          'Instant'
        ],
        [
          'Shadow Step',
          '1 charge',
          'Teleport to target, gain advantage on next attack',
          '30 ft',
          'Instant'
        ],
        [
          'Curse Eater',
          '2 charges',
          'Dispel curse or magical effect on self or ally',
          '15 ft',
          'Instant'
        ],
        [
          'Dark Pursuit',
          '3 charges',
          'Double movement speed, move through enemies without opportunity attacks',
          'Self',
          '1 minute'
        ],
        [
          'Spirit Shackle',
          '4 charges',
          'Root target in place (WIS save DC 8 + prof + DEX)',
          '30 ft',
          '1 minute'
        ],
        [
          'Hexbreaker Fury',
          '6 charges',
          'Deal (2 × level + weapon damage) necrotic to all in 30ft, stun 1 round',
          '30 ft radius',
          'Instant'
        ]
      ]
    },

    // Detection and Tracking Table
    detectionTrackingTable: {
      title: 'Witch Hunter Detection',
      description: 'The Covenbane has innate abilities to detect and track evil magic users.',
      headers: ['Ability', 'Range', 'Effect', 'Duration', 'Notes'],
      rows: [
        [
          'Sense Evil Magic',
          '60 ft',
          'Detect presence of cursed/evil magic users',
          'Concentration',
          'Can identify general direction'
        ],
        [
          'Mark of the Hunted',
          '120 ft',
          'Mark a spellcaster, see them through walls',
          '10 minutes',
          'Can only mark one target at a time'
        ],
        [
          'Curse Sight',
          '30 ft',
          'See all active curses and magical effects on targets',
          'Passive',
          'Always active'
        ],
        [
          'Anti-Magic Aura',
          '10 ft',
          'Spells cast within aura have disadvantage on attack rolls',
          'Passive',
          'Always active at 3+ charges'
        ]
      ]
    },

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Charge Building**: Prioritize attacking evil magic users to build charges quickly. Being targeted by spells also generates charges - sometimes it's worth taking a hit to gain power.

**Charge Spending**: Low-cost abilities (Shadow Step, Curse Eater) provide tactical flexibility. High-cost abilities (Spirit Shackle, Hexbreaker Fury) are game-changers but reset your power.

**Target Priority**: Focus on evil spellcasters to maximize charge generation and true damage procs. Every third attack deals massive bonus true damage.

**Mobility Management**: Use Shadow Step for repositioning and Dark Pursuit for extended chases. High charges grant natural speed bonuses.

**Ultimate Timing**: Hexbreaker Fury at 6 charges is devastating but consumes all charges. Use when you can hit multiple high-value targets or need emergency CC.

**Specialization Synergy**: Shadowbane excels at stealth and burst, Spellbreaker at dispelling and anti-magic, Demonhunter at sustained damage against evil entities.`
    }
  },

  // Specializations
  specializations: {
    title: 'Covenbane Specializations',
    subtitle: 'Three Paths of Witch Hunting',

    description: `Covenbanes can specialize in three distinct approaches to hunting evil magic users, each focusing on different aspects of the Hexbreaker system and anti-magic combat.`,

    passiveAbility: {
      name: 'Witch Hunter\'s Precision',
      description: 'Every third attack against cursed or evil magic users deals bonus true damage that scales with Hexbreaker charges (base +1d6, up to +4d8 at 6 charges). This damage ignores all resistances and armor.'
    },

    specs: [
      {
        name: 'Shadowbane',
        icon: 'fas fa-user-ninja',
        description: 'Masters of stealth and assassination. Shadowbanes excel at infiltrating enemy lines and delivering devastating burst damage from the shadows.',

        passiveAbility: {
          name: 'Shadow Mastery',
          description: 'Gain expertise in Stealth. When attacking from stealth with 3+ Hexbreaker charges, your first attack automatically crits and generates +1 additional charge.'
        },

        keyAbilities: [
          {
            name: 'Umbral Assault',
            cost: '2 Hexbreaker Charges',
            effect: 'Enter stealth for 6 seconds even in combat. Your next attack from stealth deals +3d8 necrotic damage and silences the target for 2 rounds (cannot cast spells).'
          },
          {
            name: 'Night\'s Edge',
            cost: '3 Hexbreaker Charges',
            effect: 'Your attacks ignore armor and magical shields for 1 minute. Additionally, gain +2d6 damage against targets with active magical buffs.'
          },
          {
            name: 'Execution',
            cost: '5 Hexbreaker Charges',
            effect: 'If target is below half HP, instantly kill them (CON save DC 18 to survive with 1 HP). If target survives or is above half HP, deal 6d10 necrotic damage instead.'
          }
        ]
      },
      {
        name: 'Spellbreaker',
        icon: 'fas fa-shield-alt',
        description: 'Masters of anti-magic and dispelling. Spellbreakers excel at neutralizing magical threats and protecting allies from harmful spells.',

        passiveAbility: {
          name: 'Arcane Resistance',
          description: 'Gain advantage on all saves against spells. When you successfully save against a spell, gain +1 Hexbreaker charge and reflect 2d8 force damage back to the caster.'
        },

        keyAbilities: [
          {
            name: 'Counterspell Strike',
            cost: '2 Hexbreaker Charges',
            effect: 'As a reaction when an enemy casts a spell within 60ft, make a melee attack. If it hits, the spell is countered and you gain +2 Hexbreaker charges.'
          },
          {
            name: 'Dispel Field',
            cost: '3 Hexbreaker Charges',
            effect: 'Create a 20ft radius anti-magic field centered on you for 1 minute. All magical effects in the field are suppressed, and spells cast into it automatically fail.'
          },
          {
            name: 'Mana Drain',
            cost: '4 Hexbreaker Charges',
            effect: 'Target spellcaster loses 4d6 mana and cannot cast spells for 2 rounds. You gain temporary HP equal to mana drained. If target has no mana, they take 4d6 psychic damage instead.'
          }
        ]
      },
      {
        name: 'Demonhunter',
        icon: 'fas fa-skull',
        description: 'Masters of hunting evil entities and demons. Demonhunters excel at sustained damage against cursed targets and tracking dark magic users.',

        passiveAbility: {
          name: 'Relentless Pursuit',
          description: 'Your movement speed is increased by +10ft for each Hexbreaker charge you have. Additionally, you cannot be slowed or rooted while you have 3+ charges.'
        },

        keyAbilities: [
          {
            name: 'Hunter\'s Mark',
            cost: '1 Hexbreaker Charge',
            effect: 'Mark an evil magic user for 10 minutes. You can see them through walls, they cannot become invisible to you, and your attacks against them deal +2d6 radiant damage.'
          },
          {
            name: 'Condemn',
            cost: '3 Hexbreaker Charges',
            effect: 'Knock target back 20ft and pin them to a wall/surface. They are stunned for 1 round and take 4d8 radiant damage. If they hit a wall, damage is doubled.'
          },
          {
            name: 'Final Hour',
            cost: '5 Hexbreaker Charges',
            effect: 'Enter a state of ultimate focus for 1 minute. Gain +5 armor, +30ft movement, advantage on all attacks, and your Witch Hunter\'s Precision triggers on every attack (not just third).'
          }
        ]
      }
    ]
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    // ===== SHADOWBANE SPECIALIZATION =====
    {
      id: 'cov_umbral_assault',
      name: 'Umbral Assault',
      description: 'Enter stealth even in combat and deliver a devastating silencing strike from the shadows.',
      spellType: 'ACTION',
      icon: 'ability_stealth',
      school: 'Shadow',
      level: 3,
      specialization: 'shadowbane',

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
        durationType: 'duration',
        duration: 2,
        durationUnit: 'rounds'
      },

      resourceCost: {
        hexbreakerCharges: 2,
        components: ['somatic'],
        somaticText: 'Meld into shadows and strike'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '3d8',
        modifier: 'DEXTERITY',
        damageType: 'necrotic',
        bonusDamage: {
          condition: 'from_stealth',
          amount: '+3d8',
          description: 'Bonus damage when attacking from stealth'
        }
      },

      effects: {
        stealth: {
          duration: '6 seconds',
          description: 'Enter stealth even in combat'
        },
        damage: {
          instant: {
            amount: '3d8 + DEX',
            type: 'necrotic',
            description: 'Necrotic damage from shadow strike'
          }
        },
        silence: {
          duration: '2 rounds',
          description: 'Target cannot cast spells for 2 rounds'
        }
      },

      specialMechanics: {
        shadowbaneBonus: {
          enabled: true,
          effect: 'Shadowbanes with 3+ charges automatically crit on the attack from stealth'
        },
        combatStealth: {
          description: 'Unique ability to enter stealth during active combat'
        }
      },

      tags: ['melee', 'stealth', 'damage', 'silence', 'shadowbane']
    },

    {
      id: 'cov_execution',
      name: 'Execution',
      description: 'Attempt to execute a wounded target, instantly killing them or dealing massive damage.',
      spellType: 'ACTION',
      icon: 'ability_rogue_deadliness',
      school: 'Shadow',
      level: 7,
      specialization: 'shadowbane',

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
        mana: 10,
        hexbreakerCharges: 5,
        components: ['somatic', 'verbal'],
        verbalText: 'Your time ends now!',
        somaticText: 'Deliver killing blow'
      },

      savingThrow: {
        enabled: true,
        attribute: 'constitution',
        difficulty: 18,
        onSuccess: 'survive_with_1hp',
        onFailure: 'instant_death'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '6d10',
        modifier: 'DEXTERITY',
        damageType: 'necrotic',
        attackType: 'weapon_attack'
      },

      effects: {
        execution: {
          threshold: 'Half HP',
          effect: 'Instant death',
          save: 'CON DC 18 to survive with 1 HP',
          description: 'If target is below half HP, attempt instant kill'
        },
        damage: {
          instant: {
            amount: '6d10 + DEX',
            type: 'necrotic',
            description: 'Damage if execution fails or target above threshold'
          }
        }
      },

      specialMechanics: {
        shadowbaneBonus: {
          enabled: true,
          effect: 'Shadowbanes can execute targets at 3/4 HP (instead of half HP)'
        },
        highRisk: {
          description: 'Consumes 5 charges - use strategically on high-value targets'
        }
      },

      tags: ['melee', 'damage', 'execute', 'ultimate', 'shadowbane']
    },

    // ===== SPELLBREAKER SPECIALIZATION =====
    {
      id: 'cov_counterspell_strike',
      name: 'Counterspell Strike',
      description: 'React to an enemy spell by striking them, countering the spell and gaining charges.',
      spellType: 'REACTION',
      icon: 'spell_holy_dispelmagic',
      school: 'Anti-Magic',
      level: 4,
      specialization: 'spellbreaker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        trigger: 'Enemy casts spell within 60ft'
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
        hexbreakerCharges: 2,
        components: ['somatic'],
        somaticText: 'Strike to disrupt spell'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '2d8',
        modifier: 'DEXTERITY',
        damageType: 'force',
        attackType: 'weapon_attack'
      },

      effects: {
        counterspell: {
          description: 'If attack hits, the spell being cast is countered'
        },
        damage: {
          instant: {
            amount: '2d8 + DEX',
            type: 'force',
            description: 'Force damage from disrupting strike'
          }
        },
        chargeGain: {
          amount: 2,
          description: 'Gain +2 Hexbreaker charges on successful counter'
        }
      },

      specialMechanics: {
        spellbreakerBonus: {
          enabled: true,
          effect: 'Spellbreakers gain +3 charges (instead of +2) and reflect 1d8 damage to caster even if attack misses'
        },
        reactiveCounter: {
          description: 'Unique melee-range counterspell that rewards aggressive positioning'
        }
      },

      tags: ['reaction', 'counterspell', 'anti-magic', 'spellbreaker']
    },

    {
      id: 'cov_dispel_field',
      name: 'Dispel Field',
      description: 'Create an anti-magic field that suppresses all magical effects and prevents spellcasting.',
      spellType: 'ACTION',
      icon: 'spell_holy_dispelmagic',
      school: 'Anti-Magic',
      level: 5,
      specialization: 'spellbreaker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        rangeDistance: 0,
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'concentration',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 8,
        hexbreakerCharges: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Magic shall not pass!',
        somaticText: 'Create anti-magic barrier'
      },

      resolution: 'AUTOMATIC',

      effects: {
        antiMagicField: {
          radius: 20,
          duration: '1 minute (concentration)',
          effects: [
            'All magical effects suppressed',
            'Spells cast into field automatically fail',
            'Magical items become mundane',
            'Supernatural abilities disabled'
          ],
          description: 'Complete anti-magic zone centered on you'
        },
        mobility: {
          description: 'Field moves with you as you move'
        }
      },

      specialMechanics: {
        spellbreakerBonus: {
          enabled: true,
          effect: 'Spellbreakers increase radius to 30ft and can exclude allies from suppression'
        },
        selfSuppression: {
          description: 'Your own magical abilities are also suppressed while field is active'
        }
      },

      tags: ['aoe', 'anti-magic', 'suppression', 'concentration', 'spellbreaker']
    },

    {
      id: 'cov_mana_drain',
      name: 'Mana Drain',
      description: 'Drain mana from a spellcaster, preventing them from casting and gaining temporary HP.',
      spellType: 'ACTION',
      icon: 'spell_shadow_manafeed',
      school: 'Anti-Magic',
      level: 6,
      specialization: 'spellbreaker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'duration',
        duration: 2,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 9,
        hexbreakerCharges: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Your power is mine!',
        somaticText: 'Drain magical energy'
      },

      savingThrow: {
        enabled: true,
        attribute: 'intelligence',
        difficulty: 16,
        onSuccess: 'half_drain',
        onFailure: 'full_drain'
      },

      resolution: 'SAVING_THROW',

      damageConfig: {
        formula: '4d6',
        modifier: 'INTELLIGENCE',
        damageType: 'psychic',
        attackType: 'spell_save'
      },

      effects: {
        manaDrain: {
          amount: '4d6',
          description: 'Target loses 4d6 mana'
        },
        silence: {
          duration: '2 rounds',
          description: 'Target cannot cast spells for 2 rounds'
        },
        tempHP: {
          amount: 'mana_drained',
          description: 'Gain temporary HP equal to mana drained'
        },
        fallback: {
          condition: 'target_has_no_mana',
          damage: '4d6 psychic',
          description: 'If target has no mana, deal psychic damage instead'
        }
      },

      specialMechanics: {
        spellbreakerBonus: {
          enabled: true,
          effect: 'Spellbreakers drain 6d6 mana (instead of 4d6) and extend silence duration to 3 rounds'
        },
        antiCaster: {
          description: 'Devastating against spellcasters, neutralizing their primary resource'
        }
      },

      tags: ['single-target', 'mana-drain', 'silence', 'anti-magic', 'spellbreaker']
    },

    // ===== DEMONHUNTER SPECIALIZATION =====
    {
      id: 'cov_hunters_mark',
      name: 'Hunter\'s Mark',
      description: 'Mark an evil magic user for tracking and bonus damage.',
      spellType: 'ACTION',
      icon: 'ability_hunter_markedfordeath',
      school: 'Tracking',
      level: 2,
      specialization: 'demonhunter',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 120
      },

      durationConfig: {
        durationType: 'duration',
        duration: 10,
        durationUnit: 'minutes'
      },

      resourceCost: {
        hexbreakerCharges: 1,
        components: ['verbal'],
        verbalText: 'You are marked for death'
      },

      resolution: 'AUTOMATIC',

      effects: {
        mark: {
          duration: '10 minutes',
          effects: [
            'See target through walls',
            'Target cannot become invisible to you',
            '+2d6 radiant damage on attacks',
            'Know exact distance and direction'
          ],
          description: 'Mark reveals and enhances damage against target'
        },
        tracking: {
          description: 'Can track marked target across any distance within same plane'
        }
      },

      specialMechanics: {
        demonhunterBonus: {
          enabled: true,
          effect: 'Demonhunters increase bonus damage to +3d6 and can mark up to 2 targets simultaneously'
        },
        singleTarget: {
          description: 'Can only have one mark active at a time (two for Demonhunters)'
        }
      },

      tags: ['utility', 'tracking', 'damage-buff', 'demonhunter']
    },

    {
      id: 'cov_condemn',
      name: 'Condemn',
      description: 'Knock target back and pin them to a wall, stunning them and dealing massive damage.',
      spellType: 'ACTION',
      icon: 'ability_paladin_judgementsofthejust',
      school: 'Radiant',
      level: 5,
      specialization: 'demonhunter',

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
        durationType: 'duration',
        duration: 1,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 7,
        hexbreakerCharges: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Be condemned!',
        somaticText: 'Knock target back with force'
      },

      savingThrow: {
        enabled: true,
        attribute: 'strength',
        difficulty: 16,
        onSuccess: 'half_knockback',
        onFailure: 'full_effect'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '4d8',
        modifier: 'DEXTERITY',
        damageType: 'radiant',
        bonusDamage: {
          condition: 'hits_wall',
          amount: '×2',
          description: 'Damage doubled if target hits a wall'
        }
      },

      effects: {
        knockback: {
          distance: '20 ft',
          description: 'Knock target back 20ft'
        },
        pin: {
          condition: 'hits_wall',
          duration: '1 round',
          description: 'If target hits wall, they are pinned and stunned'
        },
        damage: {
          instant: {
            amount: '4d8 + DEX',
            type: 'radiant',
            description: 'Radiant damage (doubled if hits wall)'
          }
        }
      },

      specialMechanics: {
        demonhunterBonus: {
          enabled: true,
          effect: 'Demonhunters increase knockback to 30ft and stun duration to 2 rounds'
        },
        environmentalDamage: {
          description: 'Damage doubles if target is knocked into a wall or obstacle'
        }
      },

      tags: ['melee', 'damage', 'knockback', 'stun', 'demonhunter']
    },

    {
      id: 'cov_final_hour',
      name: 'Final Hour',
      description: 'Enter a state of ultimate focus, becoming an unstoppable hunter for 1 minute.',
      spellType: 'ACTION',
      icon: 'spell_holy_avenginewrath',
      school: 'Enhancement',
      level: 7,
      specialization: 'demonhunter',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self',
        rangeDistance: 0
      },

      durationConfig: {
        durationType: 'duration',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 12,
        hexbreakerCharges: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'This is my final hour!',
        somaticText: 'Channel ultimate hunter focus'
      },

      resolution: 'AUTOMATIC',

      effects: {
        enhancement: {
          duration: '1 minute',
          effects: [
            '+5 armor',
            '+30ft movement speed',
            'Advantage on all attacks',
            'Witch Hunter\'s Precision on every attack (not just third)',
            'Cannot be slowed, stunned, or rooted',
            'Immune to fear and charm'
          ],
          description: 'Become an unstoppable hunter'
        },
        trueDamage: {
          description: 'Every attack triggers Witch Hunter\'s Precision (bonus true damage)'
        }
      },

      specialMechanics: {
        demonhunterBonus: {
          enabled: true,
          effect: 'Demonhunters extend duration to 2 minutes and gain +10 armor (instead of +5)'
        },
        ultimatePower: {
          description: 'Devastating ultimate ability that makes you nearly invincible for its duration'
        }
      },

      tags: ['self-buff', 'enhancement', 'ultimate', 'demonhunter']
    },

    // ===== UNIVERSAL ABILITIES =====
    {
      id: 'cov_shadow_step',
      name: 'Shadow Step',
      description: 'Teleport to a target and gain advantage on your next attack.',
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowstep',
      school: 'Shadow',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        hexbreakerCharges: 1,
        components: ['somatic'],
        somaticText: 'Vanish and reappear'
      },

      resolution: 'AUTOMATIC',

      effects: {
        teleport: {
          range: '30 ft',
          description: 'Instantly teleport to target location'
        },
        advantage: {
          duration: 'next_attack',
          description: 'Gain advantage on your next attack'
        }
      },

      specialMechanics: {
        mobility: {
          description: 'Excellent for repositioning, gap closing, or escaping'
        },
        lowCost: {
          description: 'Only costs 1 charge, making it highly spammable'
        }
      },

      tags: ['utility', 'teleport', 'mobility', 'universal']
    },

    {
      id: 'cov_vengeful_strike',
      name: 'Vengeful Strike',
      description: 'Channel Hexbreaker charges into a devastating strike.',
      spellType: 'ACTION',
      icon: 'ability_warrior_revenge',
      school: 'Physical',
      level: 2,
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
        hexbreakerCharges: '1-6',
        components: ['somatic'],
        somaticText: 'Strike with dark energy'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: 'weapon',
        modifier: 'DEXTERITY',
        damageType: 'necrotic',
        bonusDamage: {
          condition: 'per_charge',
          amount: 'charges × proficiency',
          description: 'Bonus necrotic damage scales with charges spent'
        }
      },

      effects: {
        damage: {
          instant: {
            amount: 'Weapon + (charges × proficiency bonus) necrotic',
            type: 'mixed',
            description: 'Physical weapon damage plus scaling necrotic damage'
          }
        },
        scaling: {
          description: 'Can spend 1-6 charges for variable damage output'
        }
      },

      specialMechanics: {
        flexibleCost: {
          description: 'Choose how many charges to spend (1-6) for variable damage'
        },
        darkEnergy: {
          description: 'Weapon glows with dark energy proportional to charges spent'
        }
      },

      tags: ['melee', 'damage', 'scaling', 'universal']
    },

    {
      id: 'cov_curse_eater',
      name: 'Curse Eater',
      description: 'Absorb and neutralize a curse or magical effect.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Anti-Magic',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        hexbreakerCharges: 2,
        components: ['somatic', 'verbal'],
        verbalText: 'I consume your curse!',
        somaticText: 'Draw curse into yourself'
      },

      resolution: 'AUTOMATIC',

      effects: {
        dispel: {
          targets: ['curse', 'magical_effect', 'debuff'],
          description: 'Remove one curse or magical effect from target'
        },
        absorption: {
          description: 'Convert absorbed curse into raw power (flavor)'
        }
      },

      specialMechanics: {
        versatileDispel: {
          description: 'Can target self or ally within 15ft'
        },
        powerConversion: {
          description: 'Neutralizes curse and converts it into Hexbreaker energy (flavor)'
        }
      },

      tags: ['utility', 'dispel', 'anti-magic', 'universal']
    },

    {
      id: 'cov_spirit_shackle',
      name: 'Spirit Shackle',
      description: 'Bind an enemy\'s spirit to the ground, immobilizing them.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shackleundead',
      school: 'Shadow',
      level: 6,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'duration',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 8,
        hexbreakerCharges: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Be bound!',
        somaticText: 'Summon dark tendrils'
      },

      savingThrow: {
        enabled: true,
        attribute: 'wisdom',
        difficulty: '8 + prof + DEX',
        onSuccess: 'no_effect',
        onFailure: 'rooted'
      },

      resolution: 'SAVING_THROW',

      effects: {
        root: {
          duration: '1 minute',
          description: 'Target cannot move from their current location'
        },
        visualEffect: {
          description: 'Dark tendrils of energy wrap around target, anchoring them'
        }
      },

      specialMechanics: {
        longDuration: {
          description: 'Lasts up to 1 minute - extremely long CC duration'
        },
        malevolentForce: {
          description: 'Dark energy physically binds target to the spot'
        }
      },

      tags: ['single-target', 'crowd-control', 'root', 'universal']
    },

    {
      id: 'cov_hexbreaker_fury',
      name: 'Hexbreaker Fury',
      description: 'Unleash all accumulated Hexbreaker charges in a cataclysmic burst of dark energy.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowworddominate',
      school: 'Shadow',
      level: 8,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        rangeDistance: 0,
        aoeType: 'sphere',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'duration',
        duration: 1,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 15,
        hexbreakerCharges: 6,
        components: ['verbal', 'somatic'],
        verbalText: 'HEXBREAKER FURY!',
        somaticText: 'Release all accumulated dark energy'
      },

      savingThrow: {
        enabled: true,
        attribute: 'constitution',
        difficulty: 18,
        onSuccess: 'half_damage_no_stun',
        onFailure: 'full_effect'
      },

      resolution: 'SAVING_THROW',

      damageConfig: {
        formula: '2d6',
        modifier: 'LEVEL',
        damageType: 'necrotic',
        bonusDamage: {
          condition: 'weapon_damage',
          amount: 'weapon_damage',
          description: 'Add weapon damage to the burst'
        }
      },

      effects: {
        damage: {
          instant: {
            amount: '(2 × level) + weapon damage',
            type: 'necrotic',
            description: 'Massive necrotic damage to all enemies in 30ft'
          }
        },
        stun: {
          duration: '1 round',
          description: 'All enemies hit are stunned for 1 round'
        },
        aoe: {
          radius: 30,
          description: 'Affects all enemies within 30ft radius'
        }
      },

      specialMechanics: {
        ultimateAbility: {
          description: 'Requires maximum 6 Hexbreaker charges - ultimate ability'
        },
        chargeReset: {
          description: 'Consumes all 6 charges, resetting you to 0'
        },
        devastatingBurst: {
          description: 'Can turn the tide of battle by stunning and damaging all nearby enemies'
        }
      },

      tags: ['aoe', 'damage', 'stun', 'ultimate', 'universal']
    }
  ]
};

export default COVENBANE_DATA;




