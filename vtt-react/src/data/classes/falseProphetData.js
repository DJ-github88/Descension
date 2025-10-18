/**
 * False Prophet Class Data
 * 
 * Complete class information for the False Prophet - a chaotic spellcaster
 * who channels eldritch energies and madness to warp reality and minds.
 */

export const FALSE_PROPHET_DATA = {
  id: 'false_prophet',
  name: 'False Prophet',
  icon: 'fas fa-eye',
  role: 'Caster/Controller',

  // Overview section
  overview: {
    title: 'The False Prophet',
    subtitle: 'Herald of Madness and Eldritch Truth',
    
    description: `The False Prophet channels chaotic energies from the eldritch void, accumulating Madness Points through their reality-bending spells. This madness empowers their shadow damage but threatens to consume them entirely. Walking the razor's edge between power and insanity, False Prophets tempt fate with forbidden knowledge and risk catastrophic consequences.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `False Prophets are conduits for truths too terrible for mortal minds to comprehend. They have glimpsed the void beyond reality and returned changed—their sanity fractured, their perception warped, but their power undeniable. Whether they sought this knowledge willingly or were cursed with unwanted visions, they now walk between worlds.

Their madness manifests physically: eyes that see too much, whispers only they can hear, reality flickering at the edges of their vision. At high Madness levels, the void bleeds through—shadows writhe unnaturally, impossible geometries appear, and the air itself seems to scream.

Common False Prophet archetypes include:
- **The Cursed Oracle**: Burdened with visions they never wanted
- **The Forbidden Scholar**: Sought knowledge mortals were meant to ignore
- **The Void-Touched**: Survived contact with eldritch entities
- **The Mad Preacher**: Spreads dark truths disguised as salvation
- **The Reality Breaker**: Believes sanity is a cage to be shattered

False Prophets understand that madness and power are inseparable. Each spell brings them closer to the abyss, but also closer to godhood. The question is: will they master the madness, or will it master them?`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The False Prophet is a high-risk, high-reward caster/controller that excels at:

**Psychic Damage**: Shattering minds with eldritch horrors and maddening visions
**Mind Control**: Bending wills, causing confusion, and turning enemies against each other
**Shadow Magic**: Dealing escalating shadow damage as Madness Points accumulate
**Reality Manipulation**: Creating chaotic zones and unpredictable effects

**Strengths**:
- Extremely high damage potential with accumulated Madness
- Powerful crowd control and debuff capabilities
- Can turn enemies into temporary allies
- Unpredictable abilities that enemies can't plan for
- Strong against single powerful enemies (mind control)

**Weaknesses**:
- Constant risk of Insanity Convulsion at 20 Madness
- Randomness can backfire in critical moments
- Fragile and vulnerable to burst damage
- Requires careful Madness management
- Less effective against mindless enemies
- Self-inflicting effects from Insanity Convulsions

The False Prophet thrives on chaos and risk, rewarding players who can balance aggression with self-preservation.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a False Prophet is about dancing on the edge of madness. Key considerations:

**Building Madness**:
- Madness-generating spells roll dice (1d4, 1d6, 1d8) to determine points gained
- Each Madness Point increases shadow damage by +1
- Randomness means you can't predict exact Madness levels
- Some spells generate more Madness but have stronger effects

**Madness Level Strategy**:
- **0-5 Points (Safe Zone)**: Low damage bonus, build freely
- **6-11 Points (Temptation Zone)**: Access to Veil of Shadows (6), Eldritch Vision (9)
- **12-19 Points (Danger Zone)**: Apocalyptic Revelation available but high risk
- **20 Points (Insanity)**: Automatic Convulsion, roll on table for chaotic effect

**Temptation Abilities**:
- **6 Madness**: Veil of Shadows (invisibility) - adds 1d4 Madness
- **9 Madness**: Eldritch Vision (see through walls) - adds 1d6 Madness
- **12 Madness**: Apocalyptic Revelation (8d6 AoE) - adds 2d6 Madness
- Using these abilities risks pushing you into Insanity Convulsion

**Spending Madness**:
- Madness-spending spells consume rolled amounts (1d4, 1d6, 1d8)
- Use spending spells to stay below 20 Madness threshold
- Strategic spending can keep you in the 12-19 "sweet spot"
- Some spending spells provide healing, buffs, or powerful attacks

**Insanity Convulsion Management**:
- At 20 Madness, roll 1d6 on Insanity Convulsion Table
- Effects range from AoE damage to stuns to random teleportation
- All effects are self-inflicting or chaotic
- May trigger Short-Term Madness (1d4 rounds of impairment)
- After Convulsion, Madness resets to 0

**Specialization Synergies**:
- **Voidcaller**: Aggressive madness generation, maximum damage output
- **Deceiver**: Mind control focus, uses madness for manipulation
- **Cultist**: Balanced corruption, sustained DoT and curse effects

**Team Dynamics**:
- Warn allies when approaching high Madness (Convulsions can hit friendlies)
- Coordinate mind control with team to maximize controlled enemy damage
- Use chaos zones strategically to control battlefield
- Synergizes with classes that can protect fragile casters`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Madness Points',
    subtitle: 'The Price of Forbidden Power',
    
    description: `Madness Points represent the False Prophet's descent into eldritch insanity. As they channel void energies, their grip on reality weakens, but their power grows. Each point increases shadow damage by +1, tempting them to accumulate more. However, reaching 20 Madness Points triggers an Insanity Convulsion—a catastrophic release of chaotic energy.`,
    
    mechanics: {
      title: 'Core Mechanics',
      content: `**Generating Madness Points**:
- Certain spells generate Madness by rolling dice (1d4, 1d6, or 1d8)
- The result is added to your current Madness Points
- Generation is random—you can't predict exact amounts
- Higher-tier spells typically generate more Madness

**Spending Madness Points**:
- Other spells spend Madness by rolling dice (1d4, 1d6, or 1d8)
- The rolled amount is subtracted from your current Madness Points
- If you don't have enough Madness, the spell fails or has reduced effect
- Spending is also random—strategic risk management required

**Shadow Damage Scaling**:
- Each Madness Point increases shadow damage by +1
- At 10 Madness: +10 shadow damage to all shadow spells
- At 19 Madness: +19 shadow damage (maximum safe level)
- This bonus applies to all shadow damage you deal

**Madness Thresholds**:
- **6 Madness**: Unlock Veil of Shadows (invisibility, adds 1d4 Madness)
- **9 Madness**: Unlock Eldritch Vision (true sight, adds 1d6 Madness)
- **12 Madness**: Unlock Apocalyptic Revelation (8d6 AoE, adds 2d6 Madness)
- **20 Madness**: Automatic Insanity Convulsion

**Insanity Convulsion**:
When you reach 20 Madness Points, you immediately experience an Insanity Convulsion. Roll 1d6 on the Insanity Convulsion Table:

1. **Shadow Burst**: Deal 5d6 necrotic damage to yourself and all creatures within 20 ft
2. **Mind Shatter**: Stunned for 2 rounds
3. **Dark Whispers**: Disadvantage on all attacks and saves for 3 rounds
4. **Chaotic Pulse**: Teleport randomly within 60 ft, take 4d6 psychic damage
5. **Psychic Scream**: All creatures within 30 ft make Wisdom save or frightened for 3 rounds
6. **Nightmare Echoes**: Take 6d6 psychic damage, gain Short-Term Madness for 1d4 rounds

After the Convulsion, your Madness Points reset to 0.

**Short-Term Madness Effects** (if triggered):
Roll 1d6 for the specific effect:
1. **Paranoia**: Attack nearest ally
2. **Delirium**: Disadvantage on all skill checks and saves
3. **Fearful**: Flee from combat for 1 round
4. **Confusion**: Cannot distinguish friend from foe
5. **Despair**: Cannot cast spells for 1 round
6. **Rage**: Advantage on attacks but attack nearest creature (friend or foe)`
    },
    
    visualRepresentation: {
      title: 'Visual Representation',
      content: `The Madness gauge appears as a horizontal bar with 20 segments, filling with swirling purple and black energy as Madness accumulates. At 6, 9, and 12 Madness, special threshold markers glow, indicating available Temptation abilities. As Madness approaches 20, the bar pulses with increasing intensity, warning of imminent Convulsion.

The gauge displays:
- Current Madness Points / 20
- Shadow damage bonus (+X)
- Available Temptation abilities (glowing icons)
- Warning indicator when at 15+ Madness (pulsing red border)`
    },
    
    strategicDepth: {
      title: 'Strategic Depth',
      content: `The Madness system creates constant tension between power and risk:

**Risk vs. Reward**:
- Higher Madness = more damage, but closer to Convulsion
- Temptation abilities offer powerful effects but add more Madness
- Spending spells provide safety but consume your damage bonus

**Optimal Madness Ranges**:
- **Conservative (0-8)**: Safe, low damage, minimal risk
- **Moderate (9-14)**: Good damage, access to Eldritch Vision, manageable risk
- **Aggressive (15-19)**: Maximum damage, all abilities unlocked, high risk
- **Insane (20)**: Convulsion guaranteed, chaos unleashed

**Advanced Techniques**:
- "Madness Surfing": Staying at 15-19 for maximum damage without Convulsion
- "Controlled Detonation": Deliberately triggering Convulsion when beneficial
- "Madness Cycling": Alternating between generation and spending for sustained power
- "Threshold Dancing": Using Temptation abilities at exact thresholds before spending

The best False Prophets learn to embrace chaos while maintaining just enough control to avoid self-destruction.`
    }
  },

  // Specializations
  specializations: {
    title: 'False Prophet Specializations',
    subtitle: 'Three Paths to Madness',

    description: `False Prophets can specialize in different aspects of eldritch power, each offering unique approaches to managing madness and wielding void energies.`,

    specs: [
      {
        id: 'voidcaller',
        name: 'Voidcaller',
        icon: 'spell_shadow_twilight',
        color: '#9400D3',
        theme: 'Aggressive Madness',

        description: `Voidcallers embrace madness fully, generating it rapidly to maximize their shadow damage output. They are the most aggressive False Prophet specialization, willing to risk Insanity Convulsions for devastating power. Their connection to the void is strongest, allowing them to channel pure eldritch energy.`,

        playstyle: 'High-risk aggression, maximum shadow damage, rapid madness generation',

        strengths: [
          'Highest shadow damage potential of all specs',
          'Generates Madness faster for quicker power scaling',
          'Bonus damage when at high Madness levels',
          'Powerful burst damage capabilities'
        ],

        weaknesses: [
          'Most likely to trigger Insanity Convulsions',
          'Requires aggressive playstyle that increases risk',
          'Less control over Madness accumulation',
          'Vulnerable during Convulsion recovery'
        ],

        passiveAbilities: [
          {
            name: 'Eldritch Empowerment',
            tier: 'Path Passive',
            description: 'When you reach 10 or more Madness Points, your next shadow damage spell deals an additional 2d6 shadow damage.',
            sharedBy: 'All False Prophets'
          },
          {
            name: 'Void Surge',
            tier: 'Specialization Passive',
            description: 'Whenever you generate Madness Points, add +1 to the rolled amount. When you have 15 or more Madness Points, your shadow damage spells deal an additional 1d8 damage.',
            uniqueTo: 'Voidcaller'
          }
        ],

        recommendedFor: 'Players who enjoy high-risk/high-reward gameplay, maximum damage output, and aggressive spellcasting'
      },

      {
        id: 'deceiver',
        name: 'Deceiver',
        icon: 'spell_shadow_charm',
        color: '#8B008B',
        theme: 'Mind Control & Manipulation',

        description: `Deceivers use their madness to warp the minds of others, specializing in control, deception, and manipulation. They are masters of turning enemies against each other and creating illusions that blur the line between reality and nightmare. Their madness is a tool for domination.`,

        playstyle: 'Control-focused, mind manipulation, strategic madness spending',

        strengths: [
          'Powerful mind control and charm effects',
          'Can turn enemies into temporary allies',
          'Extended duration on confusion and fear effects',
          'Excellent crowd control capabilities'
        ],

        weaknesses: [
          'Lower direct damage than Voidcaller',
          'Less effective against mindless enemies',
          'Requires strategic target selection',
          'Control effects can be resisted'
        ],

        passiveAbilities: [
          {
            name: 'Eldritch Empowerment',
            tier: 'Path Passive',
            description: 'When you reach 10 or more Madness Points, your next shadow damage spell deals an additional 2d6 shadow damage.',
            sharedBy: 'All False Prophets'
          },
          {
            name: 'Master Manipulator',
            tier: 'Specialization Passive',
            description: 'Your mind control and charm spells have their duration increased by 50%. When you successfully control an enemy, you gain 1d4 Madness Points. Enemies have disadvantage on saves against your confusion effects.',
            uniqueTo: 'Deceiver'
          }
        ],

        recommendedFor: 'Players who enjoy control gameplay, manipulating enemies, and strategic battlefield control'
      },

      {
        id: 'cultist',
        name: 'Cultist',
        icon: 'spell_shadow_deathcoil',
        color: '#4B0082',
        theme: 'Corruption & Curses',

        description: `Cultists spread corruption and curses, specializing in damage-over-time effects and sustained madness management. They perform dark rituals that empower themselves and their allies while slowly destroying their enemies. Their madness is channeled into methodical, inevitable destruction.`,

        playstyle: 'Sustained damage, DoT effects, balanced madness management',

        strengths: [
          'Excellent sustained damage with DoT effects',
          'Better Madness management than other specs',
          'Can empower allies with dark rituals',
          'Strong in prolonged encounters'
        ],

        weaknesses: [
          'Lower burst damage than Voidcaller',
          'DoT effects take time to ramp up',
          'Less impactful in short fights',
          'Requires setup time for rituals'
        ],

        passiveAbilities: [
          {
            name: 'Eldritch Empowerment',
            tier: 'Path Passive',
            description: 'When you reach 10 or more Madness Points, your next shadow damage spell deals an additional 2d6 shadow damage.',
            sharedBy: 'All False Prophets'
          },
          {
            name: 'Corrupting Presence',
            tier: 'Specialization Passive',
            description: 'Your damage-over-time effects last 2 additional rounds. When you spend Madness Points, heal yourself for 5 HP per point spent. Enemies affected by your curses take an additional 1d4 necrotic damage per round.',
            uniqueTo: 'Cultist'
          }
        ],

        recommendedFor: 'Players who enjoy DoT gameplay, sustained damage, and balanced resource management'
      }
    ]
  },

  // Example Spells - showcasing the spell wizard system
  exampleSpells: [
    // MADNESS GENERATORS - Basic Psychic Damage
    {
      id: 'fp_dark_whisper',
      name: 'Dark Whisper',
      description: 'Send haunting whispers from the void to shatter a target\'s mind, dealing psychic damage.',
      spellType: 'ACTION',
      icon: 'spell_shadow_siphonmana',
      school: 'Psychic',
      level: 1,

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
        mana: 8,
        components: ['verbal'],
        verbalText: 'Sussurri Tenebris'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        modifier: 'INTELLIGENCE',
        damageType: 'psychic',
        attackType: 'spell_attack'
      },

      effects: {
        damage: {
          instant: {
            amount: '2d6 + INT',
            type: 'psychic',
            description: 'Whispers from the void assault the target\'s mind'
          }
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d4',
          description: 'Generates 1d4 Madness Points when cast'
        }
      },

      flavorText: 'The void speaks, and minds break.'
    },

    {
      id: 'fp_mind_fracture',
      name: 'Mind Fracture',
      description: 'Fracture a target\'s mind with eldritch energy, causing confusion and glimpses of the void.',
      spellType: 'ACTION',
      icon: 'spell_shadow_mindsteal',
      school: 'Psychic',
      level: 3,

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
        durationType: 'rounds',
        durationAmount: 3
      },

      resourceCost: {
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Mens Fractura',
        somaticText: 'Crushing gesture toward target\'s head'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'half_duration',
        onFailure: 'full_effect'
      },

      effects: {
        condition: {
          type: 'confused',
          duration: '3 rounds',
          description: 'Target cannot distinguish friend from foe, acts erratically'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Generates 1d6 Madness Points when cast'
        }
      },

      flavorText: 'Reality cracks. Sanity shatters. The void seeps through.'
    },

    {
      id: 'fp_tormenting_visions',
      name: 'Tormenting Visions',
      description: 'Fill a target\'s vision with horrifying eldritch horrors, dealing psychic damage over time.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Psychic',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 50
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 4
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Visiones Cruciatus',
        somaticText: 'Hands pressed to temples'
      },

      resolution: 'AUTOMATIC',

      effects: {
        damage: {
          overTime: {
            amount: '2d6',
            type: 'psychic',
            interval: 'round',
            duration: '4 rounds',
            description: 'Visions of eldritch horrors torment the target each round'
          }
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d8',
          description: 'Generates 1d8 Madness Points when cast'
        }
      },

      flavorText: 'They see what lurks beyond. They cannot unsee it.'
    },

    // MADNESS GENERATORS - Control & Debuffs
    {
      id: 'fp_corrupt_mind',
      name: 'Corrupt Mind',
      description: 'Corrupt a target\'s mind with dark whispers, forcing them to attack their own allies.',
      spellType: 'ACTION',
      icon: 'spell_shadow_possession',
      school: 'Mind Control',
      level: 5,

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
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Mens Corruptio',
        somaticText: 'Grasping motion toward target'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'negated',
        onFailure: 'full_effect'
      },

      effects: {
        condition: {
          type: 'charmed',
          duration: '1d4 rounds',
          description: 'Target attacks its allies for the duration'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d8',
          description: 'Generates 1d8 Madness Points when cast'
        },
        mindControl: {
          enabled: true,
          controlType: 'hostile_to_allies',
          description: 'Target becomes hostile to its allies and attacks them'
        }
      },

      flavorText: 'Friend becomes foe. Trust becomes betrayal. The void laughs.'
    },

    {
      id: 'fp_maddening_scripture',
      name: 'Maddening Scripture',
      description: 'Recite eldritch scripture that drives all who hear it toward madness and confusion.',
      spellType: 'ACTION',
      icon: 'spell_shadow_unholyfrenzy',
      school: 'Psychic',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'radius',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 2
      },

      resourceCost: {
        mana: 22,
        components: ['verbal'],
        verbalText: 'Forbidden words in an unknowable tongue'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC_PLUS_PERSUASION',
        onSuccess: 'negated',
        onFailure: 'full_effect'
      },

      effects: {
        condition: {
          type: 'confused',
          duration: '2 rounds',
          description: 'All enemies in radius must save or be confused'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Generates 1d6 Madness Points when cast'
        },
        performanceBonus: {
          enabled: true,
          description: 'GM awards +3, 0, or -5 to Persuasion roll based on RP quality'
        }
      },

      flavorText: 'Words that should not be spoken. Truths that should not be known.'
    },

    {
      id: 'fp_abyssal_command',
      name: 'Abyssal Command',
      description: 'Command creatures from the abyss to rise and fight for you.',
      spellType: 'ACTION',
      icon: 'spell_shadow_demonicempathy',
      school: 'Summoning',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 30,
        components: ['verbal', 'somatic'],
        verbalText: 'Abyssus Imperium',
        somaticText: 'Beckoning gesture toward the ground'
      },

      resolution: 'AUTOMATIC',

      effects: {
        summon: {
          creatureType: 'abyssal_minions',
          count: '1d4',
          duration: '1d4 rounds',
          description: 'Summons 1d4 abyssal creatures to fight for you'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d8',
          description: 'Generates 1d8 Madness Points when cast'
        }
      },

      flavorText: 'The abyss answers. Its servants hunger.'
    },

    // MADNESS SPENDERS - Buffs & Utility
    {
      id: 'fp_dark_bidding',
      name: 'Dark Bidding',
      description: 'Channel Madness Points into raw power, boosting combat abilities temporarily.',
      spellType: 'ACTION',
      icon: 'spell_shadow_unholystrength',
      school: 'Enhancement',
      level: 3,

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
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 12,
        components: ['verbal'],
        verbalText: 'Potentia Tenebris'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          attackBonus: '+2 per Madness Point spent',
          damageBonus: '+2 per Madness Point spent',
          duration: '1d4 rounds',
          description: 'Gain +2 to attack and damage rolls per Madness Point spent'
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d6',
          description: 'Spends 1d6 Madness Points when cast. Effect scales with amount spent.'
        }
      },

      flavorText: 'Power demands sacrifice. Madness is the currency.'
    },

    {
      id: 'fp_feeding_darkness',
      name: 'Feeding Darkness',
      description: 'Feed on the darkness within, converting Madness Points into healing.',
      spellType: 'ACTION',
      icon: 'spell_shadow_lifedrain',
      school: 'Restoration',
      level: 4,

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
        mana: 18,
        components: ['verbal', 'somatic'],
        verbalText: 'Tenebris Vescor',
        somaticText: 'Hands clutching chest'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: 'MADNESS_SPENT',
        modifier: 'NONE',
        healingType: 'self',
        scaling: '2x'
      },

      effects: {
        healing: {
          instant: {
            amount: '2 HP per Madness Point spent',
            type: 'self',
            description: 'Restore HP equal to twice the Madness Points spent'
          }
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d6',
          description: 'Spends 1d6 Madness Points. Heals for 2 HP per point spent.'
        }
      },

      flavorText: 'The void takes. The void gives. Balance is an illusion.'
    },

    {
      id: 'fp_maddening_wrath',
      name: 'Maddening Wrath',
      description: 'Channel accumulated madness into a devastating attack of pure chaos.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowbolt',
      school: 'Evocation',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 50
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Ira Insania',
        somaticText: 'Violent thrusting motion'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d8',
        modifier: 'INTELLIGENCE',
        damageType: 'shadow',
        attackType: 'spell_attack',
        bonusDamage: '2 per Madness Point spent'
      },

      effects: {
        damage: {
          instant: {
            amount: '4d8 + INT + (2 × Madness spent)',
            type: 'shadow',
            description: 'Devastating shadow damage enhanced by spent Madness'
          }
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d6',
          description: 'Spends 1d6 Madness Points. Deals +2 damage per point spent.'
        }
      },

      flavorText: 'Madness becomes wrath. Wrath becomes annihilation.'
    },

    {
      id: 'fp_enslave',
      name: 'Enslave',
      description: 'Spend Madness to completely enslave a target\'s mind, making them your thrall.',
      spellType: 'ACTION',
      icon: 'spell_shadow_mindshear',
      school: 'Mind Control',
      level: 6,

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
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 35,
        components: ['verbal', 'somatic'],
        verbalText: 'Servitus Mentis',
        somaticText: 'Commanding gesture'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC_PLUS_MADNESS',
        onSuccess: 'negated',
        onFailure: 'full_effect'
      },

      effects: {
        condition: {
          type: 'dominated',
          duration: '1d4 rounds',
          description: 'Target becomes your thrall, obeying all commands'
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d8',
          description: 'Spends 1d8 Madness Points. DC increases by +1 per point spent.'
        },
        mindControl: {
          enabled: true,
          controlType: 'full_control',
          description: 'You control the target\'s actions completely'
        }
      },

      flavorText: 'Free will is an illusion. Obedience is truth.'
    },

    {
      id: 'fp_reality_twist',
      name: 'Reality Twist',
      description: 'Twist reality itself, creating a zone of chaotic and unpredictable effects.',
      spellType: 'ACTION',
      icon: 'spell_shadow_twilight',
      school: 'Transmutation',
      level: 7,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeType: 'radius',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 40,
        components: ['verbal', 'somatic'],
        verbalText: 'Realitas Distortio',
        somaticText: 'Twisting, warping gestures'
      },

      resolution: 'AUTOMATIC',

      effects: {
        zone: {
          type: 'chaos',
          radius: 20,
          duration: '1d4 rounds',
          description: 'All creatures in zone experience random effects each round'
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d8',
          description: 'Spends 1d8 Madness Points when cast'
        },
        randomEffects: {
          enabled: true,
          description: 'Roll 1d6 each round for random effect: 1=teleport, 2=damage, 3=heal, 4=slow, 5=haste, 6=confusion'
        }
      },

      flavorText: 'Reality bends. Logic breaks. Chaos reigns.'
    },

    // SPECIAL TEMPTATION ABILITIES
    {
      id: 'fp_veil_of_shadows',
      name: 'Veil of Shadows',
      description: 'Cloak yourself in shadows, becoming invisible. Requires 6 Madness Points. Adds 1d4 Madness.',
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      school: 'Illusion',
      level: 4,

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
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal'],
        verbalText: 'Velum Umbrae'
      },

      resolution: 'AUTOMATIC',

      effects: {
        condition: {
          type: 'invisible',
          duration: '1d4 rounds',
          description: 'You become invisible for 1d4 rounds'
        }
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 6,
          description: 'Requires at least 6 Madness Points to cast'
        },
        madnessGeneration: {
          enabled: true,
          formula: '1d4',
          description: 'Adds 1d4 Madness Points after casting (risk of Convulsion)'
        },
        temptationAbility: true
      },

      flavorText: 'Power at a price. Invisibility at the cost of sanity.'
    },

    {
      id: 'fp_eldritch_vision',
      name: 'Eldritch Vision',
      description: 'See through walls and detect hidden enemies with void-touched sight. Requires 9 Madness. Adds 1d6 Madness.',
      spellType: 'ACTION',
      icon: 'spell_shadow_soulleech_3',
      school: 'Divination',
      level: 5,

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
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Visio Abyssi',
        somaticText: 'Hands over eyes'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'true_sight',
          duration: '1d4 rounds',
          description: 'See through walls, detect invisible creatures, see in darkness'
        }
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 9,
          description: 'Requires at least 9 Madness Points to cast'
        },
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Adds 1d6 Madness Points after casting (higher risk)'
        },
        temptationAbility: true
      },

      flavorText: 'See all. Know all. Lose all.'
    },

    {
      id: 'fp_apocalyptic_revelation',
      name: 'Apocalyptic Revelation',
      description: 'Unleash a massive wave of psychic energy. Requires 12 Madness. Adds 2d6 Madness (high Convulsion risk).',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Evocation',
      level: 8,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'radius',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 50,
        components: ['verbal', 'somatic'],
        verbalText: 'APOCALYPSIS MENTIS!',
        somaticText: 'Arms spread wide, releasing energy'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },

      damageConfig: {
        formula: '8d6',
        modifier: 'INTELLIGENCE',
        damageType: 'psychic',
        attackType: 'spell_save'
      },

      effects: {
        damage: {
          instant: {
            amount: '8d6 + INT',
            type: 'psychic',
            description: 'Massive psychic damage to all enemies in 30 ft radius'
          }
        }
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 12,
          description: 'Requires at least 12 Madness Points to cast'
        },
        madnessGeneration: {
          enabled: true,
          formula: '2d6',
          description: 'Adds 2d6 Madness Points after casting (VERY high Convulsion risk)'
        },
        temptationAbility: true,
        warning: 'Extremely likely to trigger Insanity Convulsion'
      },

      flavorText: 'The void speaks its final truth. All who hear it break.'
    },

    // ADDITIONAL DIVERSE SPELLS
    {
      id: 'fp_curse_of_flesh',
      name: 'Curse of Flesh',
      description: 'Curse a target, causing their flesh to decay and rot over time.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Necromancy',
      level: 4,

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
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Maledictio Carnis',
        somaticText: 'Pointing at target with withering gesture'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'CONSTITUTION',
        dc: 'SPELL_DC',
        onSuccess: 'half_duration',
        onFailure: 'full_effect'
      },

      effects: {
        damage: {
          overTime: {
            amount: '2d6',
            type: 'necrotic',
            interval: 'round',
            duration: '1d4 rounds',
            description: 'Flesh decays, dealing necrotic damage each round'
          }
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Generates 1d6 Madness Points when cast'
        }
      },

      flavorText: 'Flesh is weak. The curse makes it weaker.'
    },

    {
      id: 'fp_twisted_sermon',
      name: 'Twisted Sermon',
      description: 'Deliver a dark sermon that inflicts psychic damage and causes paranoia.',
      spellType: 'ACTION',
      icon: 'spell_shadow_psychicscream',
      school: 'Psychic',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'cone',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 2
      },

      resourceCost: {
        mana: 28,
        components: ['verbal'],
        verbalText: 'Dark sermon in twisted language'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'half_damage',
        onFailure: 'full_damage_and_paranoia'
      },

      damageConfig: {
        formula: '4d6',
        modifier: 'INTELLIGENCE',
        damageType: 'psychic',
        attackType: 'spell_save'
      },

      effects: {
        damage: {
          instant: {
            amount: '4d6 + INT',
            type: 'psychic',
            description: 'Psychic damage to all in cone'
          }
        },
        condition: {
          type: 'paranoid',
          duration: '2 rounds',
          description: 'Failed saves also cause paranoia (see allies as enemies)'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Generates 1d6 Madness Points when cast'
        }
      },

      flavorText: 'False words. True madness. Inevitable betrayal.'
    },

    {
      id: 'fp_befoul',
      name: 'Befoul',
      description: 'Befoul an area with dark energy, creating hazardous terrain.',
      spellType: 'ACTION',
      icon: 'spell_shadow_plaguecloud',
      school: 'Conjuration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeType: 'radius',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 4
      },

      resourceCost: {
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Corruptio Terrae',
        somaticText: 'Sweeping gesture over ground'
      },

      resolution: 'AUTOMATIC',

      effects: {
        zone: {
          type: 'difficult_terrain',
          radius: 20,
          duration: '4 rounds',
          description: 'Area becomes difficult terrain, movement halved'
        },
        damage: {
          overTime: {
            amount: '1d6',
            type: 'necrotic',
            interval: 'round',
            duration: '4 rounds',
            description: 'Creatures starting turn in area take 1d6 necrotic damage'
          }
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Generates 1d6 Madness Points when cast'
        }
      },

      flavorText: 'The ground itself rejects the living.'
    },

    {
      id: 'fp_black_oath',
      name: 'Black Oath',
      description: 'Swear a black oath that curses an enemy, reducing their effectiveness.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofmannoroth',
      school: 'Curse',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 50
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 18,
        components: ['verbal'],
        verbalText: 'Sacramentum Nigrum'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'CHARISMA',
        dc: 'SPELL_DC',
        onSuccess: 'half_duration',
        onFailure: 'full_effect'
      },

      effects: {
        debuff: {
          type: 'disadvantage_all',
          duration: '1d4 rounds',
          description: 'Target has disadvantage on all attack rolls and saving throws'
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d4',
          description: 'Spends 1d4 Madness Points when cast'
        }
      },

      flavorText: 'An oath sworn in darkness. A curse sealed in blood.'
    },

    {
      id: 'fp_isolate',
      name: 'Isolate',
      description: 'Sever a target\'s connections, preventing them from receiving healing or buffs.',
      spellType: 'ACTION',
      icon: 'spell_shadow_antishadow',
      school: 'Curse',
      level: 3,

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
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 16,
        components: ['verbal', 'somatic'],
        verbalText: 'Solitudo Aeterna',
        somaticText: 'Cutting gesture'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'negated',
        onFailure: 'full_effect'
      },

      effects: {
        debuff: {
          type: 'isolation',
          duration: '1d4 rounds',
          description: 'Target cannot receive healing or beneficial effects from allies'
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d4',
          description: 'Spends 1d4 Madness Points when cast'
        }
      },

      flavorText: 'Alone in the void. No help. No hope. No escape.'
    },

    {
      id: 'fp_devouring_omen',
      name: 'Devouring Omen',
      description: 'Summon a terrifying apparition that frightens enemies and marks them for doom.',
      spellType: 'ACTION',
      icon: 'spell_shadow_demonicfortitude',
      school: 'Illusion',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'radius',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 3
      },

      resourceCost: {
        mana: 30,
        components: ['verbal', 'somatic'],
        verbalText: 'Omen Devorans',
        somaticText: 'Summoning gesture'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'negated',
        onFailure: 'frightened_and_disadvantage'
      },

      effects: {
        condition: {
          type: 'frightened',
          duration: '3 rounds',
          description: 'Enemies are frightened and have disadvantage on all rolls'
        },
        summon: {
          creatureType: 'apparition',
          count: 1,
          duration: '3 rounds',
          description: 'Terrifying apparition appears, causing fear'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d8',
          description: 'Generates 1d8 Madness Points when cast'
        }
      },

      flavorText: 'They see their doom. They cannot look away.'
    }
  ]
};


