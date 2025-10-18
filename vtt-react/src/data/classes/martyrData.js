/**
 * Martyr Class Data
 * 
 * Complete class information for the Martyr - a selfless protector
 * who gains power through sacrifice and devotion to their allies.
 */

export const MARTYR_DATA = {
  id: 'martyr',
  name: 'Martyr',
  icon: 'fas fa-cross',
  role: 'Support/Tank',

  // Overview section
  overview: {
    title: 'The Martyr',
    subtitle: 'Selfless Protector and Sacred Sacrifice',
    
    description: `The Martyr is a devoted protector who draws strength from unwavering faith and willingness to endure suffering for their allies. Through the Devotion Gauge mechanic, Martyrs transform pain into power, unlocking increasingly potent abilities as they take damage and perform sacrificial acts. Each wound they bear becomes a blessing for their companions.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Martyrs are driven by unshakeable conviction—whether religious faith, loyalty to a cause, or devotion to their companions. They have sworn oaths to protect others, even at the cost of their own lives. This dedication manifests as divine power that grows stronger the more they sacrifice.

Their devotion often shows physically: scars that glow with holy light, stigmata that bleed radiant energy, or an aura of serenity even in the midst of agony. At high Devotion Levels, they may appear transfigured—wreathed in golden light, bearing phantom wings, or surrounded by spectral guardians.

Common Martyr archetypes include:
- **The Penitent Knight**: Atoning for past sins through selfless service
- **The Faithful Shepherd**: Protecting their flock from all harm
- **The Oath-Bound Guardian**: Sworn to defend a person, place, or ideal
- **The Suffering Saint**: Believes pain brings them closer to the divine
- **The Living Shield**: Finds purpose in being the wall between danger and innocents

Martyrs understand that true strength comes not from avoiding pain, but from enduring it for others. They see each wound as a badge of honor, each sacrifice as a prayer made manifest.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Martyr is a hybrid support/tank class that excels at:

**Damage Mitigation**: Intercepting attacks meant for allies and redirecting harm to themselves
**Sustained Healing**: Converting their own suffering into healing power for the party
**Protective Buffs**: Granting resistance, temporary HP, and defensive bonuses
**Radiant Damage**: Channeling devotion into holy attacks against enemies

**Strengths**:
- Excellent at protecting vulnerable allies
- Scales in power as combat becomes more dangerous
- Strong sustained healing capabilities
- Can turn near-death situations into victory through high Devotion abilities
- Provides both defensive and offensive support

**Weaknesses**:
- Requires taking damage to reach full potential
- Can become overwhelmed if focused by too many enemies
- Less effective when allies are spread out
- Devotion spending requires careful resource management
- Vulnerable to burst damage before building Devotion

The Martyr shines in prolonged encounters where they can build Devotion Levels and unleash devastating amplified abilities at critical moments.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Martyr is about strategic sacrifice and resource management. Key considerations:

**Building Devotion**:
- Take damage naturally through combat (10/20/40/60/80/100 damage thresholds)
- Use Martyr's Intervene to protect allies and advance Devotion faster
- Some spells inflict self-damage to build Devotion while providing benefits
- Balance building Devotion with staying alive

**Devotion Level Strategy**:
- **Level 1-2 (Building Phase)**: Basic defensive benefits, focus on accumulating damage
- **Level 3-4 (Power Phase)**: Strong passive effects, moderate amplification power
- **Level 5-6 (Peak Phase)**: Powerful auras and devastating amplified abilities

**Spending Devotion**:
- Amplified spells cost 1-5 Devotion Levels for enhanced effects
- Save high Devotion for critical moments (boss fights, emergencies)
- Consider whether passive benefits outweigh active spending
- Some situations require immediate amplified healing over passive bonuses

**Specialization Synergies**:
- **Redemption**: Maximum healing and protection, defensive playstyle
- **Zealot**: Aggressive damage-dealing through suffering, offensive support
- **Ascetic**: Balanced endurance, maintains high Devotion efficiently

**Team Dynamics**:
- Position near vulnerable allies to use Intervene effectively
- Coordinate with tanks to share damage absorption duties
- Communicate Devotion Levels so team knows when big abilities are ready
- Synergizes with classes that benefit from resistance and temp HP buffs`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Devotion Gauge',
    subtitle: 'Power Through Sacrifice',
    
    description: `The Devotion Gauge represents the Martyr's accumulated suffering and unwavering faith. As they endure pain and protect their allies, their devotion deepens, unlocking powerful passive effects and enabling them to amplify their spells with divine energy.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Starting State**: All Martyrs begin combat at Devotion Level 0

**Building Devotion**:
- **Taking Damage**: Accumulate damage to reach thresholds (10/20/40/60/80/100)
- **Martyr's Intervene**: Rush in front of an ally to take damage meant for them (advances 1 level per use)
- **Self-Sacrifice Spells**: Some spells inflict self-damage to build Devotion while providing benefits
- **Damage Tracking**: Total damage taken persists through combat to track Devotion Level

**Devotion Levels**: Six levels (1-6), each with unique passive effects
**Level Persistence**: Devotion Levels persist between combats until you rest or are fully healed
**Maximum Level**: Devotion Level 6 is the maximum

**Passive Effects**: Each Devotion Level grants a permanent passive benefit while at that level
**Amplified Spells**: Spend Devotion Levels to cast enhanced versions of spells
**Spending Devotion**: Using amplified abilities reduces your Devotion Level by the cost (1-5 levels)

**Martyr's Intervene**: 
As a reaction, rush in front of an ally within 10 feet who is about to take damage, taking the damage instead. This action increases the Devotion Gauge by 1 level each time it is used, regardless of damage amount.`
    },
    
    devotionLevelsTable: {
      title: 'Devotion Gauge: Level Effects',
      headers: ['Level', 'Accumulation Requirement', 'Passive Effect', 'Thematic Identity'],
      rows: [
        ['0', 'Starting state', 'None', 'Mortal Resolve'],
        ['1', '10 damage taken OR 1 Intervene', 'Gain 5 temporary HP when an ally within 5 feet takes damage', 'Flickering Faith'],
        ['2', '20 damage taken OR 2 Intervenes', 'All healing effects you perform are increased by 5 HP', 'Steadfast Conviction'],
        ['3', '40 damage taken OR 3 Intervenes', 'All allies within 10 feet gain +1 to their AC', 'Radiant Sacrifice'],
        ['4', '60 damage taken OR 4 Intervenes', 'You gain advantage on all saving throws', 'Divine Ascendance'],
        ['5', '80 damage taken OR 5 Intervenes', 'Deal 10 additional radiant damage on all attacks', 'Holy Martyrdom'],
        ['6', '100 damage taken OR 6 Intervenes', 'All allies within 15 feet gain resistance to all damage types', 'Celestial Protector']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Devotion 0-2 (Building Phase)**: Focus on taking damage and using Intervene to build Devotion quickly. Passive benefits are minimal, prioritize accumulation.
**Devotion 3-4 (Power Phase)**: Strong passive benefits active (damage reduction, radiant damage). Good time for amplified healing and moderate power spells.
**Devotion 5-6 (Peak Phase)**: Maximum power with aura effects. Decide whether to maintain passives or spend on ultimate amplified abilities.

**Intervene Strategy**: 
- Use proactively to protect squishy allies (mages, healers)
- Fastest way to build Devotion (1 level per use regardless of damage)
- Requires positioning within 10 feet of allies
- Can advance from Level 1 to Level 2 even if you've only taken 11 damage total

**Amplified Spell Timing**:
- Save 3-5 Devotion spending for boss fights and emergencies
- Use 1-2 Devotion spends more liberally for tactical advantages
- Consider passive loss when spending (losing Level 6 resistance aura is significant)
- Some amplified effects are worth more than passive benefits in critical moments

**Self-Damage Spells**:
- Penance of Pain, Purifying Pain, and similar spells build Devotion while helping allies
- Calculate whether self-damage is worth the Devotion gain and healing output
- Synergizes with Redemption spec's healing bonuses
- Risk vs reward: don't kill yourself building Devotion`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Martyr Specializations',
    subtitle: 'Three Paths of Sacred Sacrifice',
    
    description: `Every Martyr chooses one of three specializations that define their approach to devotion and sacrifice. Each specialization offers unique passive abilities and influences your spell selection and playstyle.`,
    
    specs: [
      {
        id: 'redemption',
        name: 'Redemption',
        icon: 'spell_holy_holybolt',
        color: '#FFD700',
        theme: 'Healing Through Sacrifice',
        
        description: `Redemption Martyrs are the ultimate healers and protectors, converting their own suffering into powerful restorative magic. They excel at keeping allies alive through sustained healing and protective buffs, willingly bearing wounds so others may live.`,
        
        playstyle: 'Defensive support, maximum healing output, protective buffs',
        
        strengths: [
          'Highest healing output of all Martyr specs',
          'Enhanced protective abilities',
          'Excellent at keeping allies alive in prolonged fights',
          'Amplified healing spells are extremely potent'
        ],
        
        weaknesses: [
          'Lowest damage output',
          'Requires allies to protect to be effective',
          'Less useful when fighting alone',
          'Heavily reliant on positioning near allies'
        ],
        
        passiveAbilities: [
          {
            name: 'Sacred Devotion',
            tier: 'Path Passive',
            description: 'When you reach Devotion Level 3 or higher, your next healing spell heals for an additional 1d6 HP.',
            sharedBy: 'All Martyrs'
          },
          {
            name: 'Redemptive Grace',
            tier: 'Specialization Passive',
            description: 'Whenever you use Martyr\'s Intervene, you heal the protected ally for 2d6 HP. Additionally, all healing spells you cast have their range increased by 10 feet.',
            uniqueTo: 'Redemption'
          }
        ],
        
        recommendedFor: 'Players who enjoy pure support roles, keeping allies alive, and selfless protection'
      },
      
      {
        id: 'zealot',
        name: 'Zealot',
        icon: 'spell_holy_crusaderstrike',
        color: '#DC143C',
        theme: 'Righteous Fury',
        
        description: `Zealot Martyrs channel their suffering into devastating radiant attacks. They believe that pain purifies and empowers, using their wounds as fuel for holy vengeance. The more they suffer, the more destructive their righteous fury becomes.`,
        
        playstyle: 'Aggressive support, radiant damage, offensive buffs',
        
        strengths: [
          'Highest damage output of all Martyr specs',
          'Converts self-damage into offensive power',
          'Strong radiant damage scaling with Devotion',
          'Excellent at eliminating priority targets'
        ],
        
        weaknesses: [
          'Lower healing output than Redemption',
          'More vulnerable due to aggressive playstyle',
          'Requires balancing offense with survival',
          'Less effective at pure protection'
        ],
        
        passiveAbilities: [
          {
            name: 'Sacred Devotion',
            tier: 'Path Passive',
            description: 'When you reach Devotion Level 3 or higher, your next healing spell heals for an additional 1d6 HP.',
            sharedBy: 'All Martyrs'
          },
          {
            name: 'Zealous Wrath',
            tier: 'Specialization Passive',
            description: 'Your radiant damage spells deal additional damage equal to your current Devotion Level × 2. When you damage an enemy with a radiant spell, you heal for 15% of the damage dealt.',
            uniqueTo: 'Zealot'
          }
        ],
        
        recommendedFor: 'Players who want aggressive support, dealing damage while healing, and offensive playstyles'
      },
      
      {
        id: 'ascetic',
        name: 'Ascetic',
        icon: 'spell_holy_prayerofhealing',
        color: '#4169E1',
        theme: 'Enduring Faith',
        
        description: `Ascetic Martyrs are masters of endurance, maintaining high Devotion Levels through careful resource management and resilience. They embrace suffering as a path to enlightenment, gaining powerful defensive abilities that allow them to weather any storm.`,
        
        playstyle: 'Balanced support, sustained Devotion, defensive resilience',
        
        strengths: [
          'Best at maintaining high Devotion Levels',
          'Excellent survivability and damage resistance',
          'Reduced Devotion costs for amplified abilities',
          'Strong sustained performance in long fights'
        ],
        
        weaknesses: [
          'Moderate healing and damage (jack of all trades)',
          'Requires careful resource management',
          'Less impactful burst abilities',
          'Slower to reach peak power'
        ],
        
        passiveAbilities: [
          {
            name: 'Sacred Devotion',
            tier: 'Path Passive',
            description: 'When you reach Devotion Level 3 or higher, your next healing spell heals for an additional 1d6 HP.',
            sharedBy: 'All Martyrs'
          },
          {
            name: 'Ascetic Endurance',
            tier: 'Specialization Passive',
            description: 'All amplified spell costs are reduced by 1 Devotion Level (minimum 1). While at Devotion Level 4 or higher, you gain resistance to physical damage.',
            uniqueTo: 'Ascetic'
          }
        ],
        
        recommendedFor: 'Players who enjoy resource management, balanced gameplay, and sustained power'
      }
    ]
  },

  // Example Spells - showcasing the spell wizard system
  exampleSpells: [
    // Basic Healing Spells
    {
      id: 'martyr_restorative_prayer',
      name: 'Restorative Prayer',
      description: 'A gentle prayer that mends wounds and restores vitality to an ally.',
      spellType: 'ACTION',
      icon: 'spell_holy_heal',
      school: 'Restoration',
      level: 1,

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
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanatio Divina',
        somaticText: 'Hands clasped in prayer'
      },

      resolution: 'DICE',

      healingConfig: {
        formula: '1d4',
        modifier: 'SPIRIT',
        healingType: 'single_target'
      },

      effects: {
        healing: {
          instant: {
            formula: '1d4',
            modifier: 'SPIRIT',
            target: 'single'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 1,
          amplifiedEffect: 'Heal for 4d4 + Spirit modifier HP instead'
        }
      },

      tags: ['healing', 'basic', 'devotion-amplifiable']
    },

    {
      id: 'martyr_divine_shield',
      name: 'Divine Shield',
      description: 'Grants protective divine energy to allies, manifesting as temporary hit points.',
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordshield',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 10
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Aegis Sanctus',
        somaticText: 'Raise hands skyward'
      },

      resolution: 'DICE',

      effects: {
        buff: {
          temporaryHP: {
            formula: '1d6',
            targets: 'all_allies_in_area'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 1,
          amplifiedEffect: 'Grants 2d6 temporary HP instead'
        }
      },

      tags: ['buff', 'temporary-hp', 'aoe', 'devotion-amplifiable']
    },

    // Self-Sacrifice Spells
    {
      id: 'martyr_penance_of_pain',
      name: 'Penance of Pain',
      description: 'Inflict grievous wounds upon yourself, channeling that suffering into healing energy for all allies.',
      spellType: 'ACTION',
      icon: 'spell_holy_penance',
      school: 'Restoration',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 30
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Dolor Pro Salus',
        somaticText: 'Strike yourself with divine energy'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'radiant',
        target: 'self',
        description: 'Inflict damage to yourself'
      },

      healingConfig: {
        formula: 'DAMAGE_DEALT_TO_SELF',
        healingType: 'area',
        description: 'Heal all allies for the damage you inflicted on yourself'
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'radiant',
            target: 'self'
          }
        },
        healing: {
          instant: {
            formula: 'DAMAGE_DEALT_TO_SELF',
            targets: 'all_allies_in_area'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Inflict 4d8 damage to yourself and heal allies for that amount'
        },
        selfDamage: {
          buildsDevotion: true,
          description: 'Self-damage counts toward Devotion Level accumulation'
        }
      },

      tags: ['healing', 'self-damage', 'aoe', 'sacrifice', 'devotion-amplifiable']
    },

    {
      id: 'martyr_purifying_pain',
      name: 'Purifying Pain',
      description: 'Purify yourself through suffering, converting your pain into potent healing for an ally.',
      spellType: 'ACTION',
      icon: 'spell_holy_restoration',
      school: 'Restoration',
      level: 2,

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
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Purificatio Doloris',
        somaticText: 'Touch your heart then extend hand to ally'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        target: 'self'
      },

      healingConfig: {
        formula: '4d4',
        modifier: 'SPIRIT',
        healingType: 'single_target'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'radiant',
            target: 'self'
          }
        },
        healing: {
          instant: {
            formula: '4d4',
            modifier: 'SPIRIT',
            target: 'single'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Heal for 6d4 + Spirit modifier HP instead'
        },
        selfDamage: {
          buildsDevotion: true
        }
      },

      tags: ['healing', 'self-damage', 'sacrifice', 'devotion-amplifiable']
    },

    // Radiant Damage Spells
    {
      id: 'martyr_radiant_burst',
      name: 'Radiant Burst',
      description: 'Unleash a burst of holy light that sears your enemy and blinds them with divine radiance.',
      spellType: 'ACTION',
      icon: 'spell_holy_holysmite',
      school: 'Evocation',
      level: 3,

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
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Divina!',
        somaticText: 'Thrust palm forward'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'radiant'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Deal 4d6 radiant damage and blind the enemy for 1 minute'
        }
      },

      tags: ['damage', 'radiant', 'blind', 'devotion-amplifiable']
    },

    {
      id: 'martyr_devoted_strike',
      name: 'Devoted Strike',
      description: 'Channel your devotion into a powerful melee attack, dealing radiant damage and healing yourself.',
      spellType: 'ACTION',
      icon: 'spell_holy_crusaderstrike',
      school: 'Evocation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Devotio Ferrum!',
        somaticText: 'Strike with weapon wreathed in holy light'
      },

      resolution: 'FIXED',

      damageConfig: {
        formula: '25',
        damageType: 'radiant',
        scalingType: 'none'
      },

      healingConfig: {
        formula: '10',
        healingType: 'self'
      },

      effects: {
        damage: {
          instant: {
            formula: '25',
            type: 'radiant'
          }
        },
        healing: {
          instant: {
            formula: '10',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 3,
          amplifiedEffect: 'Deal 35 radiant damage and heal for 20 HP instead'
        }
      },

      tags: ['damage', 'radiant', 'healing', 'melee', 'devotion-amplifiable']
    },

    // Buff and Protection Spells
    {
      id: 'martyr_sanctuary_aura',
      name: 'Sanctuary Aura',
      description: 'Surround an ally with a protective aura that reduces incoming damage.',
      spellType: 'ACTION',
      icon: 'spell_holy_divineshield',
      school: 'Abjuration',
      level: 2,

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
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanctuarium',
        somaticText: 'Draw protective circle in the air'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          resistance: {
            type: 'all_damage',
            duration: 1,
            durationUnit: 'minutes',
            target: 'single'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 1,
          amplifiedEffect: 'Grants resistance to all allies within 10 feet for 1 minute'
        }
      },

      tags: ['buff', 'resistance', 'protection', 'devotion-amplifiable']
    },

    {
      id: 'martyr_blessed_resilience',
      name: 'Blessed Resilience',
      description: 'Divine power fortifies your body, granting resistance to physical harm.',
      spellType: 'ACTION',
      icon: 'spell_holy_blessedresilience',
      school: 'Abjuration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'turns'
      },

      resourceCost: {
        mana: 15,
        components: ['verbal'],
        verbalText: 'Fortitudo Divina'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          resistance: {
            type: 'physical_damage',
            duration: 1,
            durationUnit: 'turns',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 5,
          amplifiedEffect: 'Grants resistance to both magical and physical damage for 1 minute'
        }
      },

      tags: ['buff', 'resistance', 'self', 'devotion-amplifiable']
    },

    // Combo Spells (Healing + Damage)
    {
      id: 'martyr_redeemers_flame',
      name: "Redeemer's Flame",
      description: 'Holy fire that heals an ally while burning a nearby enemy with righteous fury.',
      spellType: 'ACTION',
      icon: 'spell_holy_searinglightpriest',
      school: 'Evocation',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'dual',
        rangeType: 'ranged',
        rangeDistance: 40,
        description: 'Target one ally and one enemy within range'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Flamma Redemptoris!',
        somaticText: 'Gesture toward ally and enemy'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d6',
        damageType: 'radiant'
      },

      healingConfig: {
        formula: '5d6',
        healingType: 'single_target'
      },

      effects: {
        healing: {
          instant: {
            formula: '5d6',
            target: 'ally'
          }
        },
        damage: {
          instant: {
            formula: '4d6',
            type: 'radiant',
            target: 'enemy'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 3,
          amplifiedEffect: 'Heal for 6d6 HP and deal 5d6 radiant damage'
        }
      },

      tags: ['healing', 'damage', 'radiant', 'combo', 'devotion-amplifiable']
    },

    {
      id: 'martyr_martyrs_fire',
      name: "Martyr's Fire",
      description: 'The ultimate expression of sacrifice—inflict grievous wounds upon yourself to heal an ally and smite an enemy.',
      spellType: 'ACTION',
      icon: 'spell_holy_summonlightwell',
      school: 'Evocation',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'dual',
        rangeType: 'ranged',
        rangeDistance: 40,
        description: 'Target one ally and one enemy within range'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Martyris!',
        somaticText: 'Strike yourself then gesture outward'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '5d6',
        damageType: 'radiant',
        targets: ['self', 'enemy']
      },

      healingConfig: {
        formula: '7d6',
        healingType: 'single_target'
      },

      effects: {
        damage: {
          instant: {
            formula: '5d6',
            type: 'radiant',
            targets: ['self', 'enemy']
          }
        },
        healing: {
          instant: {
            formula: '7d6',
            target: 'ally'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 3,
          amplifiedEffect: 'Heal for 8d6 HP and deal 6d6 radiant damage to enemy'
        },
        selfDamage: {
          buildsDevotion: true
        }
      },

      tags: ['healing', 'damage', 'radiant', 'self-damage', 'combo', 'devotion-amplifiable']
    },

    // Ultimate Abilities
    {
      id: 'martyr_ultimate_sacrifice',
      name: 'Ultimate Sacrifice',
      description: 'Become an invulnerable beacon of protection, redirecting all damage from nearby allies to yourself.',
      spellType: 'ACTION',
      icon: 'spell_holy_guardianspirit',
      school: 'Abjuration',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 20
        }
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Sacrificium Ultimum!',
        somaticText: 'Arms spread wide, accepting all harm'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          immunity: {
            type: 'all_damage',
            duration: 1,
            durationUnit: 'minutes',
            target: 'self'
          },
          damageRedirection: {
            from: 'all_allies_in_area',
            to: 'self',
            duration: 1,
            durationUnit: 'minutes'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 4,
          amplifiedEffect: 'Become immune to all damage for 2 minutes'
        }
      },

      tags: ['buff', 'immunity', 'protection', 'ultimate', 'devotion-amplifiable']
    },

    {
      id: 'martyr_searing_devotion',
      name: 'Searing Devotion',
      description: 'The pinnacle of martyrdom—burn yourself with holy fire to unleash devastating radiant damage and massive healing.',
      spellType: 'ACTION',
      icon: 'spell_holy_divineprovidence',
      school: 'Evocation',
      level: 7,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'dual_area',
        rangeType: 'ranged',
        rangeDistance: 60,
        description: 'Target one enemy; all allies within 20 feet of you are healed'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Devotio Ardens!',
        somaticText: 'Immolate yourself with holy fire'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '6d6',
        damageType: 'radiant',
        targets: ['self', 'enemy']
      },

      healingConfig: {
        formula: '8d6',
        healingType: 'area'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d6',
            type: 'radiant',
            targets: ['self', 'enemy']
          }
        },
        healing: {
          instant: {
            formula: '8d6',
            targets: 'all_allies_within_20ft'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 5,
          amplifiedEffect: 'Deal 10d6 radiant damage to enemy and heal allies for 10d6 HP'
        },
        selfDamage: {
          buildsDevotion: true
        }
      },

      tags: ['healing', 'damage', 'radiant', 'self-damage', 'aoe', 'ultimate', 'devotion-amplifiable']
    },

    {
      id: 'martyr_martyrs_embrace',
      name: "Martyr's Embrace",
      description: 'Revive a fallen ally with the power of your devotion, restoring them to full health.',
      spellType: 'ACTION',
      icon: 'spell_holy_resurrection',
      school: 'Restoration',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        description: 'Target a dead ally'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Vita Redde!',
        somaticText: 'Embrace the fallen'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: 'FULL_HEALTH',
        healingType: 'resurrection'
      },

      effects: {
        resurrection: {
          instant: {
            healthRestored: 'FULL',
            temporaryHP: 'SPIRIT_MODIFIER'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 4,
          amplifiedEffect: 'Grant the revived ally an additional 2d6 temporary HP'
        }
      },

      tags: ['resurrection', 'healing', 'ultimate', 'devotion-amplifiable']
    },

    // Utility and Reaction Spells
    {
      id: 'martyr_rapturous_devotion',
      name: 'Rapturous Devotion',
      description: 'Channel your devotion into supernatural speed and energy, gaining additional action points.',
      spellType: 'ACTION',
      icon: 'spell_holy_surgeoflight',
      school: 'Enhancement',
      level: 5,

      typeConfig: {
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 30,
        components: ['verbal'],
        verbalText: 'Celeritas Divina!'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          actionPoints: {
            bonus: 1,
            duration: 1,
            durationUnit: 'minutes',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 3,
          amplifiedEffect: 'Gain 2 additional AP for 1 minute instead'
        }
      },

      tags: ['buff', 'utility', 'action-points', 'devotion-amplifiable']
    },

    {
      id: 'martyr_intervene',
      name: "Martyr's Intervene",
      description: 'Rush in front of an ally to take damage meant for them, increasing your Devotion Gauge.',
      spellType: 'REACTION',
      icon: 'spell_holy_layonhands',
      school: 'Abjuration',
      level: 1,

      typeConfig: {
        castTime: 0,
        castTimeType: 'REACTION',
        trigger: 'Ally within 10 feet is about to take damage'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 10,
        description: 'Target an ally about to take damage'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        components: ['somatic'],
        somaticText: 'Rush in front of ally'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          damageRedirection: {
            from: 'target_ally',
            to: 'self',
            description: 'Take all damage meant for the ally'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          advanceBy: 1,
          description: 'Increases Devotion Gauge by 1 level each time used'
        },
        canAmplify: true,
        amplifiedCost: 1,
        amplifiedEffect: 'Gain advantage on all attacks for 1 minute after intervening'
      },

      tags: ['reaction', 'protection', 'devotion-builder', 'core-mechanic']
    },

    {
      id: 'martyr_mass_restoration',
      name: 'Mass Restoration',
      description: 'A wave of healing energy washes over all nearby allies, mending their wounds.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing02',
      school: 'Restoration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 10
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanatio Omnibus',
        somaticText: 'Raise hands and release healing wave'
      },

      resolution: 'DICE',

      healingConfig: {
        formula: '1d4',
        modifier: 'SPIRIT',
        healingType: 'area'
      },

      effects: {
        healing: {
          instant: {
            formula: '1d4',
            modifier: 'SPIRIT',
            targets: 'all_allies_in_area'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Heal for 4d4 + Spirit modifier HP instead'
        }
      },

      tags: ['healing', 'aoe', 'devotion-amplifiable']
    },

    {
      id: 'martyr_sacrificial_strike',
      name: 'Sacrificial Strike',
      description: 'Inflict pain upon yourself to empower your attacks with holy fury.',
      spellType: 'ACTION',
      icon: 'spell_holy_retributionaura',
      school: 'Enhancement',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Dolor Potentia!',
        somaticText: 'Strike yourself to empower weapon'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        target: 'self'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'radiant',
            target: 'self'
          }
        },
        buff: {
          attackBonus: {
            formula: '2d6',
            duration: 1,
            durationUnit: 'minutes',
            description: 'Add 2d6 to all melee attacks'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Empower your next attack with 4d6 radiant damage and heal for half the damage dealt'
        },
        selfDamage: {
          buildsDevotion: true
        }
      },

      tags: ['buff', 'self-damage', 'melee', 'devotion-amplifiable']
    }
  ]
};


