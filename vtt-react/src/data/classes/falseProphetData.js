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
  damageTypes: ['psychic', 'void', 'necrotic'],

  // Overview section
  overview: {
    title: 'The False Prophet',
    subtitle: 'Herald of Madness and Eldritch Truth',
    
    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The False Prophet accumulates Madness Points (0-20) by preaching the void as divine truth, with each point granting +1 damage to all psychic, void, and necrotic spells. The temptation is relentless—push toward 20 for godlike power, but cross the threshold and an Insanity Convulsion erupts: catastrophic self-harm, teleportation, stunned turns, or worse. Your Madness resets to zero. You start again.

**Core Mechanic**: Preach void sermons → Roll dice for random Madness gains → Damage scales with Madness (+1 per point to all spell damage types) → Unlock Temptation thresholds at 6, 9, 12 Madness → Reach 20 and trigger Insanity Convulsion → Reset to 0

**Resource**: Madness Points (0-20 scale, random generation and spending)

**Playstyle**: Chaotic caster dancing on the razor's edge of insanity

**Best For**: Players who relish randomness, embrace chaos, and love the thrill of pushing their luck one spell too far`
    },
    
    description: `The False Prophet preaches the void as divine truth, accumulating Madness Points through sermons and rituals that warp reality. This madness empowers their spell damage but threatens to consume them entirely. Walking the razor's edge between prophetic power and insanity, False Prophets tempt fate with forbidden revelations and risk catastrophic consequences.`,
    
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
**Shadow Magic**: Dealing escalating damage as Madness Points accumulate
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
- Each Madness Point increases your spell damage by +1
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
    },

    immersiveCombatExample: {
      title: 'Combat Example: Dancing on the Edge of Madness',
      content: `**The Setup**: You're a False Prophet (Voidcaller specialization) facing a group of bandits (4 bandits + 1 bandit captain). Your party is with you, but you're the primary damage dealer. Starting Madness: 0. Starting Mana: 40/50. Your goal: Build Madness for maximum damage, use Temptation abilities strategically, and DON'T hit 20 Madness unless you're ready for chaos.

**Starting State**: Madness: 0/20 | Shadow Damage Bonus: +0 | Mana: 40/50 | HP: 60/60

**Turn 1 - Building Madness (Madness: 0 → 5)**

*The bandits charge. You raise your hands, void energy crackling between your fingers. Time to embrace the darkness.*

**Your Action**: Cast "Void Scripture" on Bandit #1 (6 mana, generates 1d6 Madness)
**Madness Roll**: 1d6 → [5] → +5 Madness Points
**Madness**: 0 + 5 = **5 Madness**
**Damage Bonus**: +5 to all spell damage
**Spell Damage**: 3d6 psychic + 5 (Madness bonus) → [4, 5, 6] + 5 = 20 damage
**Result**: Bandit #1 takes 20 damage, frightened for 2 rounds

*Dark whispers fill the bandit's mind. He screams, clutching his head. You feel the madness building—a sweet, intoxicating power.*

**Mana**: 40 - 6 = 34/50
**Current State**: Madness: 5/20 | Shadow Damage Bonus: +5

**Turn 2 - Approaching the Threshold (Madness: 5 → 11)**

*The bandits are wary now. The captain barks orders. You smile. They have no idea what's coming.*

**Your Action**: Cast "Profane Bolt" on Bandit #2 (5 mana, generates 1d6 Madness)
**Madness Roll**: 1d6 → [6] → +6 Madness Points
**Madness**: 5 + 6 = **11 Madness**
**Damage Bonus**: +11 to all spell damage
**Spell Damage**: 2d8 psychic + 11 (Madness bonus) → [7, 6] + 11 = 24 damage!
**Result**: Bandit #2 takes 24 damage, DEAD (overkill)

*The bolt of void energy obliterates the bandit. Your vision swims. The world tilts. You're at 11 Madness—past the 9 threshold. Eldritch Vision is now available.*

**Mana**: 34 - 5 = 29/50
**Temptation Unlocked**: Eldritch Vision (9+ Madness) - See through walls, detect invisible, +1d6 Madness

**Current State**: Madness: 11/20 | Shadow Damage Bonus: +11 | Eldritch Vision Available

**Turn 3 - The Temptation (Madness: 11 → 16)**

*The bandit captain ducks behind cover. You can't see him. But you COULD see him... if you used Eldritch Vision. It would cost 1d6 Madness. You're at 11. If you roll high, you could hit 17-18. Close to the edge. But the power...*

**Your Decision**: Use Eldritch Vision (adds 1d6 Madness)
**Madness Roll**: 1d6 → [5] → +5 Madness Points
**Madness**: 11 + 5 = **16 Madness**
**Damage Bonus**: +16 to all spell damage

*Your eyes turn black. The walls become transparent. You see EVERYTHING. The captain hiding behind the crate. The bandit sneaking up behind your ally. The rats in the walls. The worms in the earth. TOO MUCH. But you can use this.*

**Your Action**: Cast "Shadow Bolt" at bandit captain (behind cover, but you can see him!) (5 mana, no Madness generation)
**Spell Damage**: 3d6 psychic + 16 (Madness bonus) → [5, 6, 4] + 16 = 31 damage!
**Result**: Bandit captain takes 31 damage, severely wounded (down to 15 HP)

*The captain screams as the bolt phases through the crate and strikes him. "How did you—?!" You don't answer. You're too busy fighting the voices in your head.*

**Mana**: 29 - 5 = 24/50
**Current State**: Madness: 16/20 | Shadow Damage Bonus: +16 | **DANGER ZONE**

**Turn 4 - The Decision Point (Madness: 16 → 19)**

*You're at 16 Madness. Four points from Insanity Convulsion. You have two choices:*
*1. Spend Madness with a spending spell to drop back to safety*
*2. Keep building for maximum damage and risk hitting 20*

*You're a Voidcaller. You chose this path. MAXIMUM DAMAGE.*

**Your Action**: Cast "Preacher's Grasp" on remaining bandits (7 mana, generates 1d4 Madness)
**Madness Roll**: 1d4 → [3] → +3 Madness Points
**Madness**: 16 + 3 = **19 Madness**
**Damage Bonus**: +19 to all spell damage
**Spell Damage**: 4d6 necrotic + 19 (Madness bonus) → [6, 5, 4, 6] + 19 = 40 damage to all bandits in 20ft radius!

*Tendrils of pure void energy erupt from the ground, wrapping around the bandits. They scream as the darkness consumes them.*

**Results**:
- Bandit #3: 40 damage → DEAD
- Bandit #4: 40 damage → DEAD
- Bandit Captain: 15 HP - 40 damage → DEAD (overkill)

*All enemies dead. You're at 19 Madness. ONE POINT from Insanity Convulsion. Your hands shake. The voices are SCREAMING. Reality is fracturing at the edges.*

**Mana**: 24 - 7 = 17/50
**Current State**: Madness: 19/20 | Shadow Damage Bonus: +19 | **ONE POINT FROM CONVULSION**

**Turn 5 - The Comedown (Madness: 19 → 13)**

*Combat is over. You need to spend Madness before you lose control. You have spending spells.*

**Your Action**: Cast "Siphon Sanity" (self-heal, spends 1d6 Madness)
**Madness Spent**: 1d6 → [6] → -6 Madness Points
**Madness**: 19 - 6 = **13 Madness**
**Healing**: 6 × 2 = 12 HP healed (you weren't damaged, but now you're at full)

*You breathe deeply. The voices quiet. The world solidifies. You're back to 13 Madness—still high, but safe. For now.*

**Your Party's Healer**: "Are you... okay? Your eyes were completely black."
**You**: "I'm fine. Better than fine. Did you see that damage?"
**Your Party's Tank**: "We saw. We also saw you almost lose your mind."
**You**: "Almost doesn't count."

*But you know the truth. You were one bad roll away from Insanity Convulsion. One 1d4 roll of [4] instead of [3] and you would have hit 20. The table would have rolled. Maybe Shadow Burst (5d6 damage to yourself and allies). Maybe Mind Shatter (stunned for 2 rounds). Maybe worse.*

*But you didn't. You danced on the edge and came back. That's what False Prophets do.*

**The Lesson**: False Prophet gameplay is about:
1. **Madness Generation**: Random dice rolls (1d4, 1d6, 1d8) mean you can't predict exact Madness levels
2. **Damage Scaling**: At 19 Madness, +19 damage turned 21 base damage into 40 damage (90% increase!)
3. **Temptation Abilities**: Eldritch Vision cost 1d6 Madness but provided crucial tactical advantage
4. **Risk Management**: Stayed at 19 Madness (one point from Convulsion) for maximum damage
5. **Spending Strategy**: Used Siphon Sanity after combat to drop from 19 → 13, avoiding Convulsion
6. **Randomness**: If Void Tendrils had rolled 1d4 → [4] instead of [3], would have hit 20 and triggered Convulsion
7. **Reward**: Dealt 115 total damage in 4 turns (20 + 24 + 31 + 40) with massive Madness scaling

You're not a safe, predictable caster. You're a chaos mage who gambles with sanity for power. Every spell is a dice roll. Every turn is a risk. And when you hit 19 Madness and unleash 40 damage AoE, it's all worth it. Until it isn't.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Madness Points',
    subtitle: 'The Herald of the Void',

    description: `The False Prophet preaches truths too terrible for mortal minds. As you channel the void, your **Madness** accumulates—fracturing your sanity but exponentially increasing your damage. This is a resource of extreme risk and explosive reward; you dance on the edge of godhood, one bad roll away from a total mental collapse.`,

    cards: [
      {
        title: 'Madness (0-20)',
        stats: 'Escalating Damage',
        details: 'Each point adds +1 to ALL psychic, void, and necrotic damage. At 19 Madness, you deal +19 damage per spell.'
      },
      {
        title: 'Thresholds',
        stats: '6, 9, 12 Madness',
        details: 'Higher madness levels unlock forbidden abilities like "Veil of Shadows" or "Apocalyptic Revelation."'
      },
      {
        title: 'Insanity Convulsion',
        stats: 'Triggered at 20',
        details: 'Hitting 20 Madness triggers a chaotic explosion. You lose all Madness but suffer a random, often catastrophic, effect.'
      }
    ],

    generationTable: {
      headers: ['Trigger', 'Madness Change', 'Notes'],
      rows: [
        ['Void Scripture', '+1d4 Madness', 'Basic psychic strike'],
        ['Profane Bolt', '+1d6 Madness', 'Higher power, higher risk'],
        ['Preacher\'s Grasp', '+1d8 Madness', 'Maximum generation'],
        ['Veil of Shadows', '+1d4 Madness', 'Temptation: Invisibility (Req 6)'],
        ['Eldritch Vision', '+1d6 Madness', 'Temptation: True Sight (Req 9)'],
        ['Siphon Sanity', '-1d6 Madness', 'Release the pressure (Spending)'],
        ['Dark Meditation', '-2d6 Madness', 'Full reset of the mind (Spending)']
      ]
    },

    usage: {
      momentum: 'Build Madness early to "ramp" your damage. The False Prophet is weakest at the start of a fight and becomes a god at the end.',
      flourish: '⚠️ Madness Surfing: Try to hover between 15-19 Madness to keep your massive damage bonus active. Only trigger a Convulsion if the battlefield is so chaotic that a random explosion might actually help.'
    },

    overheatRules: {
      title: 'Insanity Convulsion (20)',
      content: `At 20 Madness, your mind shatters. Roll 1d6 on the Convulsion Table:

1. **Shadow Burst**: 5d6 necrotic damage to yourself and everyone within 20ft.
2. **Mind Shatter**: You are Stunned for 2 rounds.
3. **Dark Whispers**: Disadvantage on all rolls for 3 rounds.
4. **Chaotic Pulse**: Teleport randomly (60ft), take 4d6 psychic damage.
5. **Psychic Scream**: Everyone in 30ft makes a Save or is Frightened.
6. **Nightmare Echoes**: Take 6d6 psychic damage + gain Long-Term Madness.`
    },

    strategicConsiderations: {
      title: 'The Preacher\'s Path',
      content: `**Voidcaller Spec**: You generate Madness faster (+1 to all rolls). You reach the "Danger Zone" twice as fast as others, but your damage scaling is unrivaled.

**The Threshold Trap**: Using your most powerful abilities (like Apocalyptic Revelation) often *generates* the most Madness. If you cast your ultimate while at 15 Madness, you are almost guaranteed to Convulse immediately after.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'The Madness Gauge',
      content: `Tracking random increments of 1-8 points is hard to do with mental math. Use these physical hacks:

**Required Materials**:
- **20 Purple/Black Tokens**: (Glass beads or coins).
- **A Slider or Track**: (Numbered 0-20).
- **The "Convulsion" Die**: A distinct d6.

**The Physical Hack (Friction Points)**:
- **The Madness Pile**: Place 20 tokens in a bowl. When you gain Madness, move them to your character sheet. This creates a "rising pile" of darkness that everyone can see.
- **Threshold Markers**: Place small red flags on your track at numbers 6, 9, and 12. As your token passes them, flip your ability cards to the "Active" side.
- **The Spend Roll**: When spending Madness, roll your d6 and physically put that many tokens back in the bowl. The sound of tokens hitting the bowl is your "relief."

**Pro Tip**: When you hit 19 Madness, place your hand over the bowl of tokens. It signals to the DM and other players that the next roll could break reality.`
    }
  },

  // Specializations
  specializations: {
    title: 'False Prophet Specializations',
    subtitle: 'Three Sermons of the Void',

    description: `Every False Prophet preaches the void as divine truth—but the style of their sermon defines their power. Some thunder hellfire from makeshift pulpits. Others whisper poison into willing ears. And some simply perform the old rites, patient and inevitable. Choose your sermon.`,

    specs: [
      {
        id: 'voidcaller',
        name: 'Voidcaller',
        icon: 'Void/Consumed by Void',
        color: '#9400D3',
        theme: 'Fire-and-Brimstone Preaching',

        description: `Voidcallers are the loudest voice in the room—literally. They channel the void god's wrath through fiery, destructive sermons that shake the battlefield. Their preaching generates Madness faster than any other specialization, pushing them toward godlike power and catastrophic Convulsion in equal measure. When a Voidcaller opens their mouth, something dies.`,

        playstyle: 'High-risk aggression, maximum damage output, rapid Madness generation through destructive sermons',

        strengths: [
          'Highest damage potential of all specs',
          'Generates Madness faster for quicker power scaling',
          'Bonus damage when at high Madness levels',
          'Powerful burst damage through sermon AoE'
        ],

        weaknesses: [
          'Most likely to trigger Insanity Convulsions',
          'Aggressive playstyle increases risk every turn',
          'Less control over Madness accumulation',
          'Vulnerable during Convulsion recovery'
        ],

        passiveAbilities: [
          {
            name: 'Eldritch Empowerment',
            tier: 'Path Passive',
            description: 'When you reach 10 or more Madness Points, your next damage spell deals an additional 2d6 damage.',
            sharedBy: 'All False Prophets'
          },
          {
            name: 'Void Surge',
            tier: 'Specialization Passive',
            description: 'Whenever you generate Madness Points, add +1 to the rolled amount. When you have 15 or more Madness Points, your spells deal an additional 1d8 damage.',
            uniqueTo: 'Voidcaller'
          }
        ],

        recommendedFor: 'Players who enjoy high-risk/high-reward gameplay, maximum damage output, and aggressive spellcasting'
      },

      {
        id: 'deceiver',
        name: 'Deceiver',
        icon: 'Psychic/Mind Control',
        color: '#8B008B',
        theme: 'Whispered Corruption',

        description: `Deceivers don't preach to crowds—they whisper. They specialize in corrupting the faithful, planting doubt in devoted minds, and turning allies against each other with lies dressed as divine revelation. Their Madness fuels manipulation rather than destruction, bending wills and fracturing loyalties until the enemy does the work for them.`,

        playstyle: 'Control-focused, mind manipulation, strategic Madness spending to corrupt and convert',

        strengths: [
          'Powerful mind control and charm effects',
          'Can turn enemies into temporary allies',
          'Extended duration on confusion and fear effects',
          'Excellent crowd control through corrupted faith'
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
            description: 'When you reach 10 or more Madness Points, your next damage spell deals an additional 2d6 damage.',
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
        icon: 'Necrotic/Death Mark',
        color: '#4B0082',
        theme: 'Dark Ritual & Ceremony',

        description: `Cultists are the patient shepherds of the void god's flock. They perform methodical dark rituals—curses, sacrifices, and ceremonies—that spread corruption slowly but inevitably. Their Madness is channeled into sustained destruction rather than burst, and their rites can empower allies as easily as they wither enemies. A Cultist's sermon is not loud; it is patient. And it always finishes.`,

        playstyle: 'Sustained damage through curses and DoT, balanced Madness management, ritual empowerment',

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
            description: 'When you reach 10 or more Madness Points, your next damage spell deals an additional 2d6 damage.',
            sharedBy: 'All False Prophets'
          },
          {
            name: 'Corrupting Presence',
            tier: 'Specialization Passive',
            description: 'Your damage-over-time effects last 2 additional rounds. When you spend Madness Points, heal yourself for 2 HP per point spent plus your proficiency bonus. Enemies affected by your curses take an additional 1d4 necrotic damage per round.',
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
      id: 'fp_void_scripture',
      name: 'Void Scripture',
      description: 'Read from the void god\'s forbidden text, sending words that shatter a target\'s mind with psychic damage.',
      spellType: 'ACTION',
      icon: 'Arcane/Orb Manipulation',
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
        formula: '1d8 + intelligence',
        elementType: 'psychic',
        damageTypes: ['direct'],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
          resolution: 'DICE',
      },

      effectTypes: ['damage'],

      resourceGainConfig: {
        resources: [{
          type: 'madness',
          formula: '1d4',
          description: 'Generate 1d4 Madness Points'
        }]
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
      id: 'fp_shattered_faith',
      name: 'Shattered Faith',
      description: 'Shatter a target\'s beliefs with eldritch revelation, causing confusion and glimpses of the void\'s terrible truth.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['control'],

      typeConfig: {
        school: 'psychic',
        icon: 'Psychic/Mind Control',
        tags: ['control', 'confusion', 'psychic', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy']
      },

      controlConfig: {
        controlType: 'mind_control',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'confused',
          name: 'Confused',
          description: 'Cannot distinguish friend from foe, acts erratically for 3 rounds',
          config: {
            confusionType: 'complete',
            saveType: 'intelligence',
            saveDC: 14,
            duration: 3,
            durationUnit: 'rounds'
          }
        }]
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 15
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'DICE',
      tags: ['control', 'confusion', 'psychic', 'universal']
    },

    {
      id: 'fp_visions_of_heresy',
      name: 'Visions of Heresy',
      description: 'Condemn a target with visions of their own heresy, dealing psychic damage over time as the void god\'s judgment unfolds.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'psychic',
        icon: 'Psychic/Mind Strike',
        tags: ['damage', 'psychic', 'dot', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 50,
        targetRestrictions: ['enemy']
      },

      damageConfig: {
        formula: '2d6',
        elementType: 'psychic',
        damageTypes: ['direct'],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '2d6',
          duration: 4,
          tickFrequency: 'turn',
          isProgressiveDot: false
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 20
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'DICE',
      tags: ['damage', 'psychic', 'dot', 'universal']
    },

    // MADNESS GENERATORS - Control & Debuffs
    {
      id: 'fp_corrupt_the_faithful',
      name: 'Corrupt the Faithful',
      description: 'Preach corruption into a target\'s soul, turning their devotion against their allies as the void god\'s truth takes hold.',
      spellType: 'ACTION',
      icon: 'Psychic/Mind Control',
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
        attribute: 'SPIRIT',
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
      id: 'fp_maddening_sermon',
      name: 'Maddening Sermon',
      description: 'Deliver an eldritch sermon that drives all who hear it toward madness and confusion. The void god speaks through you.',
      spellType: 'ACTION',
      icon: 'General/Fiery Rage',
      school: 'Psychic',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
        attribute: 'SPIRIT',
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
      id: 'fp_summon_congregation',
      name: 'Summon the Congregation',
      description: 'Call forth the void god\'s faithful—abyssal servants rise to enforce the dark sermon.',
      spellType: 'ACTION',
      icon: 'Necrotic/Demonic Empowerment',
      school: 'Summoning',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
      id: 'fp_dark_benediction',
      name: 'Dark Benediction',
      description: 'Bestow the void god\'s blessing upon yourself, channeling Madness Points into raw combat power.',
      spellType: 'ACTION',
      icon: 'General/Increase Strength',
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
      id: 'fp_communion_of_void',
      name: 'Communion of the Void',
      description: 'Partake in communion with the void god, converting your madness into healing vitality.',
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',
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
          description: 'Spends accumulated Madness Points. The void takes your madness and converts it into healing energy, restoring your vitality in proportion to the madness consumed.'
        }
      },

      flavorText: 'The void takes. The void gives. Balance is an illusion.'
    },

    {
      id: 'fp_wrath_of_void_god',
      name: 'Wrath of the Void God',
      description: 'Channel the void god\'s wrath through your body, unleashing accumulated madness as a devastating strike of pure chaotic fury.',
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
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
        damageTypes: ['necrotic'],
        attackType: 'spell_attack',
        bonusDamage: '2 per Madness Point spent',
          resolution: 'DICE',
      },

      effects: {
        damage: {
          instant: {
            amount: '4d8 + INT + (2 × Madness spent)',
            type: 'necrotic',
            description: 'Devastating necrotic damage enhanced by spent Madness'
          }
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d6',
          description: 'Spends accumulated Madness Points. Your madness becomes raw destructive power, amplifying your attack with chaotic energy. The more madness you channel, the more devastating the strike becomes.'
        }
      },

      flavorText: 'Madness becomes wrath. Wrath becomes annihilation.'
    },

    {
      id: 'fp_enslave',
      name: 'Enslave',
      description: 'Spend Madness to completely enslave a target\'s mind, making them your thrall.',
      spellType: 'ACTION',
      icon: 'Psychic/Psionic Strike',
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
        attribute: 'SPIRIT',
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
      icon: 'Void/Consumed by Void',
      school: 'Transmutation',
      level: 7,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
      icon: 'Psychic/Mind Control',
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
      icon: 'Necrotic/Drain Soul',
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
      icon: 'Psychic/Mind Strike',
      school: 'Evocation',
      level: 8,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
        attribute: 'SPIRIT',
        dc: 'SPELL_DC',
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },

      damageConfig: {
        formula: '12d6 + intelligence',
        elementType: 'psychic',
        damageTypes: ['area'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'spirit',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          extraDice: '4d6',
          critEffects: ['psychic_shatter']
        },
          resolution: 'DICE',
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
      id: 'fp_heresy_of_flesh',
      name: 'Heresy of the Flesh',
      description: 'Condemn a target\'s flesh as heretical, causing it to decay and rot as the void god rejects their mortal form.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Skull',
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
      icon: 'Psychic/Agonizing Scream',
      school: 'Psychic',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
        attribute: 'SPIRIT',
        dc: 'SPELL_DC',
        onSuccess: 'half_damage',
        onFailure: 'full_damage_and_paranoia'
      },

      damageConfig: {
        formula: '4d6',
        modifier: 'INTELLIGENCE',
        damageTypes: ['psychic'],
        attackType: 'spell_save',
          resolution: 'DICE',
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
      icon: 'Poison/Poison Plague',
      school: 'Conjuration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
      icon: 'Necrotic/Necrotic Decay 1',
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
      icon: 'Radiant/Radiant Divinity',
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
        attribute: 'SPIRIT',
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
      icon: 'Utility/Resistance',
      school: 'Illusion',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
        attribute: 'SPIRIT',
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
    },

    // ADDITIONAL LEVEL 1 SPELLS
    {
      id: 'fp_false_promise',
      name: 'False Promise',
      description: 'Make a false promise to an enemy, charming them for 2 rounds.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['control'],

      typeConfig: {
        school: 'enchantment',
        icon: 'Healing/Prayer',
        tags: ['control', 'charm', 'deception', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      controlConfig: {
        controlType: 'mind_control',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 13,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'charmed',
          name: 'Charmed',
          description: 'Charmed by false promises - cannot attack caster for 2 rounds',
          config: {
            charmType: 'friendly',
            saveType: 'spirit',
            saveDC: 13,
            duration: 2,
            durationUnit: 'rounds'
          }
        }]
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 10
        },
        actionPoints: 1,
        components: ['verbal']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'DICE',
      tags: ['control', 'charm', 'deception', 'universal']
    },

    {
      id: 'fp_whisper_lies',
      name: 'Whisper Lies',
      description: 'Whisper lies to an enemy, reducing their Spirit by 2 for 3 rounds.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['debuff'],

      typeConfig: {
        school: 'enchantment',
        icon: 'Psychic/Mind Control',
        tags: ['debuff', 'lies', 'spirit reduction', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'lies_whispered',
          name: 'Lies Whispered',
          description: 'Spirit reduced by 2 from whispered lies for 3 rounds',
          statusType: 'weakened',
          statModifier: {
            stat: 'spirit',
            magnitude: -2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 12,
        saveType: 'spirit',
        saveOutcome: 'negates'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 10
        },
        actionPoints: 1,
        components: ['verbal']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'DICE',
      tags: ['debuff', 'lies', 'spirit reduction', 'universal']
    },

    {
      id: 'fp_illusion_bolt',
      name: 'Illusion Bolt',
      description: 'Fire a bolt of illusory energy that deals psychic damage.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'illusion',
        icon: 'Psychic/Mind Control',
        tags: ['damage', 'psychic', 'illusion', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '1d8',
        elementType: 'psychic',
        damageTypes: ['direct'],
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 10
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'DICE',
      tags: ['damage', 'psychic', 'illusion', 'universal']
    },

    // ADDITIONAL LEVEL 2 SPELLS
    {
      id: 'fp_false_miracle',
      name: 'False Miracle',
      description: 'Perform a false miracle that appears to heal but secretly deals psychic damage over time. The target sees green light but feels the void consuming them.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'illusion',
        icon: 'Healing/Golden Heart',
        tags: ['damage', 'psychic', 'dot', 'deception', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '1d4',
        elementType: 'psychic',
        damageTypes: ['direct'],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d4',
          duration: 3,
          tickFrequency: 'turn',
          isProgressiveDot: false
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 15
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2
       },

      resolution: 'DICE',
      tags: ['damage', 'psychic', 'dot', 'deception', 'universal']
    },

    {
      id: 'fp_deceptive_strike',
      name: 'Deceptive Strike',
      description: 'Strike with deception, dealing psychic damage and confusing the target.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],

      typeConfig: {
        school: 'illusion',
        icon: 'Psychic/Mind Strike',
        tags: ['damage', 'psychic', 'control', 'confusion', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '2d6',
        elementType: 'psychic',
        damageTypes: ['direct'],
          resolution: 'DICE',
      },

      controlConfig: {
        controlType: 'mind_control',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 13,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'confused',
          name: 'Confused',
          description: 'Confused by deception - may attack random target for 1 round',
          config: {
            confusionType: 'random_target',
            saveType: 'intelligence',
            saveDC: 14,
            duration: 1,
            durationUnit: 'rounds'
          }
        }]
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 15
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2
       },

      resolution: 'DICE',
      tags: ['damage', 'psychic', 'control', 'confusion', 'universal']
    },

    // ADDITIONAL LEVEL 7 SPELLS
    {
      id: 'fp_grand_deception',
      name: 'Grand Deception',
      description: 'Create a grand deception that confuses all enemies in a 30 foot radius for 3 rounds.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['control'],

      typeConfig: {
        school: 'illusion',
        icon: 'Psychic/Mind Control',
        tags: ['control', 'confusion', 'aoe', 'deception', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 50,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['enemy']
      },

      controlConfig: {
        controlType: 'mind_control',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'grand_confusion',
          name: 'Grand Confusion',
          description: 'All enemies confused - may attack allies or do nothing for 3 rounds',
          config: {
            confusionType: 'complete',
            saveType: 'intelligence',
            saveDC: 16,
            duration: 3,
            durationUnit: 'rounds'
          }
        }]
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 45
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 6
       },

      resolution: 'DICE',
      tags: ['control', 'confusion', 'aoe', 'deception', 'universal']
    },

    {
      id: 'fp_reality_distortion',
      name: 'Reality Distortion',
      description: 'Distort reality around enemies, dealing massive psychic damage and disorienting them.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],

      typeConfig: {
        school: 'illusion',
        icon: 'Void/Consumed by Void',
        tags: ['damage', 'psychic', 'debuff', 'distortion', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 50,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy']
      },

      damageConfig: {
        formula: '8d8 + intelligence',
        elementType: 'psychic',
        damageTypes: ['area'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'spirit',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          extraDice: '4d8',
          critEffects: ['disoriented']
        },
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'disoriented',
          name: 'Disoriented',
          description: 'Disoriented by reality distortion - disadvantage on all rolls for 2 rounds',
          statusType: 'disoriented',
          statPenalty: [{ stat: 'attack', value: -99, magnitudeType: 'disadvantage' }, { stat: 'saving_throws', value: -99, magnitudeType: 'disadvantage' }],
          mechanicsText: 'Disadvantage on all rolls for 2 rounds'
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'spirit',
        saveOutcome: 'negates'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 45
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 5
       },

      resolution: 'DICE',
      tags: ['damage', 'psychic', 'debuff', 'distortion', 'universal']
    },

    // ADDITIONAL LEVEL 8 SPELL
    {
      id: 'fp_mass_manipulation',
      name: 'Mass Manipulation',
      description: 'Manipulate the minds of all enemies in sight, controlling their actions for 2 rounds.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['control'],

      typeConfig: {
        school: 'enchantment',
        icon: 'Psychic/Mind Control',
        tags: ['control', 'manipulation', 'mind control', 'mass', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy']
      },

      controlConfig: {
        controlType: 'mind_control',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'mass_control',
          name: 'Mass Manipulation',
          description: 'All enemies controlled - must follow your commands for 2 rounds',
          config: {
            controlType: 'full',
            saveType: 'charisma',
            saveDC: 18,
            duration: 2,
            durationUnit: 'rounds'
          }
        }]
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 50
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 10
       },

      resolution: 'DICE',
      tags: ['control', 'manipulation', 'mind control', 'mass', 'universal']
    },

    // ADDITIONAL LEVEL 9 SPELL
    {
      id: 'fp_ultimate_deception',
      name: 'Ultimate Deception',
      description: 'Create the ultimate deception that makes enemies believe they won, then devastates them with overwhelming psychic damage.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'illusion',
        icon: 'Psychic/Mind Control',
        tags: ['damage', 'psychic', 'ultimate', 'deception', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy']
      },

      damageConfig: {
        formula: '12d10 + intelligence',
        elementType: 'psychic',
        damageTypes: ['area'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'spirit',
          difficultyClass: 19,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3.0,
          extraDice: '6d10',
          critEffects: ['psychic_shatter', 'stun']
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 60
        },
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 15
       },

      resolution: 'DICE',
      tags: ['damage', 'psychic', 'ultimate', 'deception', 'universal']
    },

    // ADDITIONAL LEVEL 10 SPELL
    {
      id: 'fp_prophet_of_lies',
      name: 'Prophet of Lies',
      description: 'Ascend to become the ultimate Prophet of Lies, gaining complete control over reality and perception.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['transformation'],

      typeConfig: {
        school: 'enchantment',
        icon: 'Psychic/Mind Control',
        tags: ['transformation', 'ultimate', 'god form', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      transformationConfig: {
        transformationType: 'ascended',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Prophet of Lies',
        description: 'Become a vessel for eldritch truths, your mind fracturing as power floods through you.',
        grantedAbilities: [
          { id: 'prophet_stats', name: 'Eldritch Insight', description: '+6 Intelligence, +6 Spirit, +6 Charisma' },
          { id: 'mass_manipulation', name: 'Mass Manipulation', description: 'Charm or frighten all enemies within 30ft (once per transformation)' },
          { id: 'illusion_mastery', name: 'Illusion Mastery', description: 'All illusion spells are automatically believed' },
          { id: 'mind_shield', name: 'Mind Shield', description: 'Immune to charm, fear, and confusion effects' },
          { id: 'prophet_madness', name: 'Madness (On End)', description: 'Gain 3d10 Madness Points when transformation ends' }
        ]
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 100
        },
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },

      resolution: 'DICE',
      tags: ['transformation', 'ultimate', 'god form', 'universal']
    }
  ]
};


