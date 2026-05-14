/**
 * False Prophet Class Data
 *
 * Complete class information for the False Prophet - a chaotic spellcaster
 * who channels eldritch energies and madness to warp reality and minds.
 */

export const FALSE_PROPHET_DATA = {
  id: "false_prophet",
  name: "False Prophet",
  icon: "fas fa-eye",
  role: "Caster/Controller",
  damageTypes: ["psychic", "void", "necrotic"],

  // Overview section
  overview: {
    title: "The False Prophet",
    subtitle: "Herald of Madness and Eldritch Truth",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The False Prophet accumulates Madness Points (0-20) by preaching the void as divine truth, with each point granting +1 damage to all psychic, void, and necrotic spells. The temptation is relentless—push toward 20 for godlike power, but cross the threshold and an Insanity Convulsion erupts: catastrophic self-harm, teleportation, stunned turns, or worse. Your Madness resets to zero. You start again.

**Core Mechanic**: Preach void sermons → Roll dice for random Madness gains → Damage scales with Madness (+1 per point to all spell damage types) → Unlock Temptation thresholds at 6, 9, 12 Madness → Reach 20 and trigger Insanity Convulsion → Reset to 0

**Resource**: Madness Points (0-20 scale, random generation and spending)

**Playstyle**: Chaotic caster dancing on the razor's edge of insanity

**Best For**: Players who relish randomness, embrace chaos, and love the thrill of pushing their luck one spell too far`,
    },

    description: `The False Prophet preaches the void as divine truth, accumulating Madness Points through sermons and rituals that warp reality. This madness empowers their spell damage but threatens to consume them entirely. Walking the razor's edge between prophetic power and insanity, False Prophets tempt fate with forbidden revelations and risk catastrophic consequences.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `False Prophets are conduits for truths too terrible for mortal minds to comprehend. They have glimpsed the void beyond reality and returned changed—their sanity fractured, their perception warped, but their power undeniable. Whether they sought this knowledge willingly or were cursed with unwanted visions, they now walk between worlds.

Their madness manifests physically: eyes that see too much, whispers only they can hear, reality flickering at the edges of their vision. At high Madness levels, the void bleeds through—shadows writhe unnaturally, impossible geometries appear, and the air itself seems to scream.

Common False Prophet archetypes include:
- **The Cursed Oracle**: Burdened with visions they never wanted
- **The Forbidden Scholar**: Sought knowledge mortals were meant to ignore
- **The Void-Touched**: Survived contact with eldritch entities
- **The Mad Preacher**: Spreads dark truths disguised as salvation
- **The Reality Breaker**: Believes sanity is a cage to be shattered

False Prophets understand that madness and power are inseparable. Each spell brings them closer to the abyss, but also closer to godhood. The question is: will they master the madness, or will it master them?`,
    },

    combatRole: {
      title: "Combat Role",
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

The False Prophet thrives on chaos and risk, rewarding players who can balance aggression with self-preservation.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
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
- Synergizes with classes that can protect fragile casters`,
    },

    immersiveCombatExample: {
      title: "Combat Example: Dancing on the Edge of Madness",
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

You're not a safe, predictable caster. You're a chaos mage who gambles with sanity for power. Every spell is a dice roll. Every turn is a risk. And when you hit 19 Madness and unleash 40 damage AoE, it's all worth it. Until it isn't.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Madness Points",
    subtitle: "The Herald of the Void",

    description: `The False Prophet preaches truths too terrible for mortal minds. As you channel the void, your **Madness** accumulates—fracturing your sanity but exponentially increasing your damage. This is a resource of extreme risk and explosive reward; you dance on the edge of godhood, one bad roll away from a total mental collapse.`,

    cards: [
      {
        title: "Madness (0-20)",
        stats: "Escalating Damage",
        details:
          "Each point adds +1 to ALL psychic, void, and necrotic damage. At 19 Madness, you deal +19 damage per spell.",
      },
      {
        title: "Thresholds",
        stats: "6, 9, 12 Madness",
        details:
          'Higher madness levels unlock forbidden abilities like "Veil of Shadows" or "Apocalyptic Revelation."',
      },
      {
        title: "Insanity Convulsion",
        stats: "Triggered at 20",
        details:
          "Hitting 20 Madness triggers a chaotic explosion. You lose all Madness but suffer a random, often catastrophic, effect.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Madness Change", "Notes"],
      rows: [
        ["Void Scripture", "+1d4 Madness", "Basic psychic strike"],
        ["Profane Bolt", "+1d6 Madness", "Higher power, higher risk"],
        ["Preacher's Grasp", "+1d8 Madness", "Maximum generation"],
        ["Veil of Shadows", "+1d4 Madness", "Temptation: Invisibility (Req 6)"],
        ["Eldritch Vision", "+1d6 Madness", "Temptation: True Sight (Req 9)"],
        ["Siphon Sanity", "-1d6 Madness", "Release the pressure (Spending)"],
        [
          "Dark Meditation",
          "-2d6 Madness",
          "Full reset of the mind (Spending)",
        ],
      ],
    },

    usage: {
      momentum:
        'Build Madness early to "ramp" your damage. The False Prophet is weakest at the start of a fight and becomes a god at the end.',
      flourish:
        "⚠️ Madness Surfing: Try to hover between 15-19 Madness to keep your massive damage bonus active. Only trigger a Convulsion if the battlefield is so chaotic that a random explosion might actually help.",
    },

    overheatRules: {
      title: "Insanity Convulsion (20)",
      content: `At 20 Madness, your mind shatters. Roll 1d6 on the Convulsion Table:

1. **Shadow Burst**: 5d6 necrotic damage to yourself and everyone within 20ft.
2. **Mind Shatter**: You are Stunned for 2 rounds.
3. **Dark Whispers**: Disadvantage on all rolls for 3 rounds.
4. **Chaotic Pulse**: Teleport randomly (60ft), take 4d6 psychic damage.
5. **Psychic Scream**: Everyone in 30ft makes a Save or is Frightened.
6. **Nightmare Echoes**: Take 6d6 psychic damage + gain Long-Term Madness.`,
    },

    strategicConsiderations: {
      title: "The Preacher's Path",
      content: `**Voidcaller Spec**: You generate Madness faster (+1 to all rolls). You reach the "Danger Zone" twice as fast as others, but your damage scaling is unrivaled.

**The Threshold Trap**: Using your most powerful abilities (like Apocalyptic Revelation) often *generates* the most Madness. If you cast your ultimate while at 15 Madness, you are almost guaranteed to Convulse immediately after.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Madness Gauge",
      content: `Tracking random increments of 1-8 points is hard to do with mental math. Use these physical hacks:

**Required Materials**:
- **20 Purple/Black Tokens**: (Glass beads or coins).
- **A Slider or Track**: (Numbered 0-20).
- **The "Convulsion" Die**: A distinct d6.

**The Physical Hack (Friction Points)**:
- **The Madness Pile**: Place 20 tokens in a bowl. When you gain Madness, move them to your character sheet. This creates a "rising pile" of darkness that everyone can see.
- **Threshold Markers**: Place small red flags on your track at numbers 6, 9, and 12. As your token passes them, flip your ability cards to the "Active" side.
- **The Spend Roll**: When spending Madness, roll your d6 and physically put that many tokens back in the bowl. The sound of tokens hitting the bowl is your "relief."

**Pro Tip**: When you hit 19 Madness, place your hand over the bowl of tokens. It signals to the DM and other players that the next roll could break reality.`,
    },
  },

  // Specializations
  specializations: {
    title: "False Prophet Specializations",
    subtitle: "Three Sermons of the Void",

    description: `Every False Prophet preaches the void as divine truth—but the style of their sermon defines their power. Some thunder hellfire from makeshift pulpits. Others whisper poison into willing ears. And some simply perform the old rites, patient and inevitable. Choose your sermon.`,

    specs: [
      {
        id: "voidcaller",
        name: "Voidcaller",
        icon: "Void/Consumed by Void",
        color: "#9400D3",
        theme: "Fire-and-Brimstone Preaching",

        description: `Voidcallers are the loudest voice in the room—literally. They channel the void god's wrath through fiery, destructive sermons that shake the battlefield. Their preaching generates Madness faster than any other specialization, pushing them toward godlike power and catastrophic Convulsion in equal measure. When a Voidcaller opens their mouth, something dies.`,

        playstyle:
          "High-risk aggression, maximum damage output, rapid Madness generation through destructive sermons",

        strengths: [
          "Highest damage potential of all specs",
          "Generates Madness faster for quicker power scaling",
          "Bonus damage when at high Madness levels",
          "Powerful burst damage through sermon AoE",
        ],

        weaknesses: [
          "Most likely to trigger Insanity Convulsions",
          "Aggressive playstyle increases risk every turn",
          "Less control over Madness accumulation",
          "Vulnerable during Convulsion recovery",
        ],

        passiveAbilities: [
          {
            name: "Eldritch Empowerment",
            tier: "Path Passive",
            description:
              "When you reach 10 or more Madness Points, your next damage spell deals an additional 2d6 damage.",
            sharedBy: "All False Prophets",
          },
          {
            name: "Void Surge",
            tier: "Specialization Passive",
            description:
              "Whenever you generate Madness Points, add +1 to the rolled amount. When you have 15 or more Madness Points, your spells deal an additional 1d8 damage.",
            uniqueTo: "Voidcaller",
          },
        ],

        recommendedFor:
          "Players who enjoy high-risk/high-reward gameplay, maximum damage output, and aggressive spellcasting",
      },

      {
        id: "deceiver",
        name: "Deceiver",
        icon: "Psychic/Mind Control",
        color: "#8B008B",
        theme: "Whispered Corruption",

        description: `Deceivers don't preach to crowds—they whisper. They specialize in corrupting the faithful, planting doubt in devoted minds, and turning allies against each other with lies dressed as divine revelation. Their Madness fuels manipulation rather than destruction, bending wills and fracturing loyalties until the enemy does the work for them.`,

        playstyle:
          "Control-focused, mind manipulation, strategic Madness spending to corrupt and convert",

        strengths: [
          "Powerful mind control and charm effects",
          "Can turn enemies into temporary allies",
          "Extended duration on confusion and fear effects",
          "Excellent crowd control through corrupted faith",
        ],

        weaknesses: [
          "Lower direct damage than Voidcaller",
          "Less effective against mindless enemies",
          "Requires strategic target selection",
          "Control effects can be resisted",
        ],

        passiveAbilities: [
          {
            name: "Eldritch Empowerment",
            tier: "Path Passive",
            description:
              "When you reach 10 or more Madness Points, your next damage spell deals an additional 2d6 damage.",
            sharedBy: "All False Prophets",
          },
          {
            name: "Master Manipulator",
            tier: "Specialization Passive",
            description:
              "Your mind control and charm spells have their duration increased by 50%. When you successfully control an enemy, you gain 1d4 Madness Points. Enemies have disadvantage on saves against your confusion effects.",
            uniqueTo: "Deceiver",
          },
        ],

        recommendedFor:
          "Players who enjoy control gameplay, manipulating enemies, and strategic battlefield control",
      },

      {
        id: "cultist",
        name: "Cultist",
        icon: "Necrotic/Death Mark",
        color: "#4B0082",
        theme: "Dark Ritual & Ceremony",

        description: `Cultists are the patient shepherds of the void god's flock. They perform methodical dark rituals—curses, sacrifices, and ceremonies—that spread corruption slowly but inevitably. Their Madness is channeled into sustained destruction rather than burst, and their rites can empower allies as easily as they wither enemies. A Cultist's sermon is not loud; it is patient. And it always finishes.`,

        playstyle:
          "Sustained damage through curses and DoT, balanced Madness management, ritual empowerment",

        strengths: [
          "Excellent sustained damage with DoT effects",
          "Better Madness management than other specs",
          "Can empower allies with dark rituals",
          "Strong in prolonged encounters",
        ],

        weaknesses: [
          "Lower burst damage than Voidcaller",
          "DoT effects take time to ramp up",
          "Less impactful in short fights",
          "Requires setup time for rituals",
        ],

        passiveAbilities: [
          {
            name: "Eldritch Empowerment",
            tier: "Path Passive",
            description:
              "When you reach 10 or more Madness Points, your next damage spell deals an additional 2d6 damage.",
            sharedBy: "All False Prophets",
          },
          {
            name: "Corrupting Presence",
            tier: "Specialization Passive",
            description:
              "Your damage-over-time effects last 2 additional rounds. When you spend Madness Points, heal yourself for 2 HP per point spent plus your proficiency bonus. Enemies affected by your curses take an additional 1d4 necrotic damage per round.",
            uniqueTo: "Cultist",
          },
        ],

        recommendedFor:
          "Players who enjoy DoT gameplay, sustained damage, and balanced resource management",
      },
    ],
  },

  // Example Spells - showcasing the spell wizard system
  exampleSpells: [
    {
      id: "fp_void_scripture",
      name: "Void Scripture",
      description:
        "Read from the void god's forbidden text, sending words that shatter a target's mind for 1d8 psychic damage. Generates 1d4 Madness Points.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Orb Manipulation",
      effectTypes: ["damage"],

      typeConfig: {
        school: "psychic",
        icon: "Arcane/Orb Manipulation",
        tags: ["damage", "psychic", "madness", "voidcaller"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      damageConfig: {
        formula: "1d8 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "madness", "voidcaller"],
    },
    {
      id: "fp_false_promise",
      name: "False Promise",
      description:
        "Make a false promise to an enemy, charming them for 2 rounds. Generates 1 Madness Point. DC 13 Spirit save.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["control"],

      typeConfig: {
        school: "psychic",
        icon: "Healing/Prayer",
        tags: ["control", "charm", "deception", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 2,
        durationUnit: "rounds",
        effects: [
          {
            id: "charmed",
            name: "Charmed",
            description:
              "Charmed by false promises - cannot attack caster for 2 rounds. DC 13 Spirit save.",
            config: {
              charmType: "friendly",
              saveType: "spirit",
              saveDC: 13,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1",
            description: "Generate 1 Madness Point",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1",
          description: "Generates 1 Madness Point when cast",
        },
      },

      tags: ["control", "charm", "deception", "madness"],
    },
    {
      id: "fp_whisper_lies",
      name: "Whisper Lies",
      description:
        "Whisper lies to an enemy, reducing their Spirit by 2 for 3 rounds. Generates 1 Madness Point. DC 12 Spirit save negates.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["debuff"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["debuff", "lies", "spirit reduction", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id: "lies_whispered",
            name: "Lies Whispered",
            description:
              "Spirit reduced by 2 from whispered lies for 3 rounds. DC 12 Spirit save negates.",
            mechanicsText: "",
            statPenalty: {
              stat: "spirit",
              magnitude: -2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 12,
          saveOutcome: "negates",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1",
            description: "Generate 1 Madness Point",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1",
          description: "Generates 1 Madness Point when cast",
        },
      },

      tags: ["debuff", "lies", "spirit reduction", "madness"],
    },
    {
      id: "fp_illusion_bolt",
      name: "Illusion Bolt",
      description:
        "Fire a bolt of illusory energy that deals 1d8 psychic damage. Generates 1 Madness Point.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["damage"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["damage", "psychic", "illusion", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      damageConfig: {
        formula: "1d8 + intelligence/2",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1",
            description: "Generate 1 Madness Point",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1",
          description: "Generates 1 Madness Point when cast",
        },
      },

      tags: ["damage", "psychic", "illusion", "madness"],
    },
    {
      id: "fp_false_miracle",
      name: "False Miracle",
      description:
        "Perform a false miracle that appears to heal but secretly deals 1d4 psychic damage and 1d4 psychic damage per turn for 3 turns. The target sees golden light but feels the void consuming them. Generates 1d4 Madness Points.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["damage"],

      typeConfig: {
        school: "psychic",
        icon: "Healing/Golden Heart",
        tags: ["damage", "psychic", "dot", "deception", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      damageConfig: {
        formula: "1d4 + intelligence/2",
        damageTypes: ["psychic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d4",
          damageType: "psychic",
          tickFrequency: "turn",
          duration: 3,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "dot", "deception", "madness"],
    },
    {
      id: "fp_deceptive_strike",
      name: "Deceptive Strike",
      description:
        "Strike with deception, dealing 2d6 psychic damage and confusing the target for 1 round. DC 13 Intelligence save. Generates 1d4 Madness Points.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Strike",
        tags: ["damage", "psychic", "control", "confusion", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      damageConfig: {
        formula: "2d6 + intelligence/2",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 1,
        durationUnit: "rounds",
        effects: [
          {
            id: "confused",
            name: "Confused",
            description:
              "Confused by deception - may attack random target for 1 round. DC 13 Intelligence save.",
            config: {
              confusionType: "random_target",
              saveType: "intelligence",
              saveDC: 13,
              duration: 1,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "intelligence",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "control", "confusion", "madness"],
    },
    {
      id: "fp_shattered_faith",
      name: "Shattered Faith",
      description:
        "Shatter a target's beliefs with eldritch revelation, causing confusion for 3 rounds. DC 14 Spirit save. At 10+ Madness, duration increases to 4 rounds. Generates 1d4 Madness Points.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["control"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["control", "confusion", "psychic", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "confused",
            name: "Confused",
            description:
              "Cannot distinguish friend from foe, acts erratically for 3 rounds. DC 14 Intelligence save.",
            config: {
              confusionType: "complete",
              saveType: "intelligence",
              saveDC: 14,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      triggerConfig: {
        conditionalEffects: {
          control: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              madness_10_plus: "Duration increases to 4 rounds",
              default: "3 rounds confusion",
            },
          },
        },
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["control", "confusion", "psychic", "madness"],
    },
    {
      id: "fp_dark_benediction",
      name: "Dark Benediction",
      description:
        "Bestow the void god's blessing upon yourself, spending 1d6 Madness Points to gain +2 to attack and damage rolls per Madness Point spent for 1d4 rounds.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["buff"],

      typeConfig: {
        school: "psychic",
        icon: "General/Increase Strength",
        tags: ["buff", "madness", "self", "voidcaller"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          {
            id: "dark_benediction",
            name: "Dark Benediction",
            description:
              "+2 to attack and damage rolls per Madness Point spent for 1d4 rounds",
            mechanicsText: "",
            statModifier: {
              stat: "attack_and_damage",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
        stackingRule: "replace",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d6",
          description:
            "Spends 1d6 Madness Points when cast. Effect scales with amount spent.",
        },
      },

      tags: ["buff", "madness", "self", "voidcaller"],
    },
    {
      id: "fp_befoul",
      name: "Befoul",
      description:
        "Befoul a 20-foot area with dark energy for 4 rounds. The area becomes difficult terrain and creatures starting their turn there take 1d6 necrotic damage. Generates 1d4 Madness Points.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],

      typeConfig: {
        school: "necrotic",
        icon: "Poison/Poison Plague",
        tags: ["damage", "necrotic", "zone", "terrain", "madness", "cultist"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 40,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "1d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d6",
          damageType: "necrotic",
          tickFrequency: "round",
          duration: 4,
          canStack: false,
          maxStacks: 1,
        },
      },

      controlConfig: {
        controlType: "zone",
        duration: 4,
        durationUnit: "rounds",
        effects: [
          {
            id: "difficult_terrain",
            name: "Befouled Ground",
            description: "Area becomes difficult terrain, movement halved",
            config: {
              zoneType: "difficult_terrain",
              duration: 4,
              durationUnit: "rounds",
            },
          },
        ],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["damage", "necrotic", "zone", "terrain", "madness", "cultist"],
    },
    {
      id: "fp_isolate",
      name: "Isolate",
      description:
        "Sever a target's connections for 1d4 rounds, preventing them from receiving healing or buffs from allies. DC 14 Spirit save. Spends 1d4 Madness Points.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["debuff"],

      typeConfig: {
        school: "necrotic",
        icon: "Radiant/Radiant Divinity",
        tags: ["debuff", "isolation", "curse", "madness", "deceiver"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      debuffConfig: {
        debuffType: "curse",
        effects: [
          {
            id: "isolation",
            name: "Isolated",
            description:
              "Cannot receive healing or beneficial effects from allies for 1d4 rounds. DC 14 Spirit save.",
            mechanicsText: "",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d4",
          description: "Spends 1d4 Madness Points when cast",
        },
      },

      tags: ["debuff", "isolation", "curse", "madness", "deceiver"],
    },
    {
      id: "fp_visions_of_heresy",
      name: "Visions of Heresy",
      description:
        "Condemn a target with visions of their own heresy, dealing 2d6 psychic damage and 2d6 psychic damage per turn for 4 turns. Generates 1d4 Madness Points. At 10+ Madness, DoT increases to 3d6 per turn.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["damage"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Strike",
        tags: ["damage", "psychic", "dot", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "2d6 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "2d6",
          damageType: "psychic",
          tickFrequency: "turn",
          duration: 4,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              madness_10_plus:
                "2d6 + intelligence psychic, 3d6 psychic per turn",
              default: "2d6 + intelligence psychic, 2d6 psychic per turn",
            },
          },
        },
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "dot", "madness"],
    },
    {
      id: "fp_maddening_sermon",
      name: "Maddening Sermon",
      description:
        "Deliver an eldritch sermon that drives all enemies within 20 feet toward confusion for 2 rounds. DC 14 Spirit save. Generates 1d6 Madness Points.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["control"],

      typeConfig: {
        school: "psychic",
        icon: "General/Fiery Rage",
        tags: ["control", "confusion", "aoe", "psychic", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 2,
        durationUnit: "rounds",
        effects: [
          {
            id: "confused",
            name: "Confused",
            description:
              "Confused by maddening sermon - acts erratically for 2 rounds. DC 14 Spirit save.",
            config: {
              confusionType: "complete",
              saveType: "spirit",
              saveDC: 14,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d6",
            description: "Generate 1d6 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d6",
          description: "Generates 1d6 Madness Points when cast",
        },
        performanceBonus: {
          enabled: true,
          description:
            "GM awards +3, 0, or -5 to Persuasion roll based on RP quality",
        },
      },

      tags: ["control", "confusion", "aoe", "psychic", "madness"],
    },
    {
      id: "fp_communion_of_void",
      name: "Communion of the Void",
      description:
        "Partake in communion with the void god, spending 1d6 Madness Points to heal yourself for 2 HP per Madness Point spent.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["healing"],

      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Drain Soul",
        tags: ["healing", "self", "madness", "voidcaller"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      healingConfig: {
        formula: "2 × madness_spent",
        healingType: "vampiric",
        resolution: "AUTOMATIC",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d6",
          description:
            "Spends accumulated Madness Points. The void takes your madness and converts it into healing energy, restoring your vitality in proportion to the madness consumed.",
        },
      },

      tags: ["healing", "self", "madness", "voidcaller"],
    },
    {
      id: "fp_veil_of_shadows",
      name: "Veil of Shadows",
      description:
        "Cloak yourself in shadows, becoming invisible for 1d4 rounds. Requires 6 Madness Points. Adds 1d4 Madness. Temptation ability.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["buff"],

      typeConfig: {
        school: "shadow",
        icon: "Psychic/Mind Control",
        tags: ["buff", "invisibility", "temptation", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "invisible",
            name: "Invisible",
            description:
              "Invisible for 1d4 rounds. Attacks break invisibility.",
            mechanicsText: "",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points (risk of Convulsion)",
          },
        ],
      },

      triggerConfig: {
        requiredConditions: {
          enabled: true,
          logicType: "AND",
          conditions: [
            {
              id: "resource_threshold",
              category: "health",
              name: "Madness Threshold",
              parameters: {
                resource_type: "madness",
                threshold_value: 6,
                threshold_type: "above",
                comparison: "greater_than",
              },
            },
          ],
        },
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 6,
          description: "Requires at least 6 Madness Points to cast",
        },
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description:
            "Adds 1d4 Madness Points after casting (risk of Convulsion)",
        },
        temptationAbility: true,
      },

      tags: ["buff", "invisibility", "temptation", "madness"],
    },
    {
      id: "fp_heresy_of_flesh",
      name: "Heresy of the Flesh",
      description:
        "Condemn a target's flesh as heretical, causing 2d6 necrotic damage per round for 1d4 rounds as their body decays. DC 14 Constitution save for half duration. Generates 1d6 Madness Points.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["damage"],

      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["damage", "necrotic", "dot", "madness", "cultist"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "2d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "2d6",
          damageType: "necrotic",
          tickFrequency: "round",
          duration: 4,
          canStack: false,
          maxStacks: 1,
        },
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "reduced_duration",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d6",
            description: "Generate 1d6 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d6",
          description: "Generates 1d6 Madness Points when cast",
        },
      },

      tags: ["damage", "necrotic", "dot", "madness", "cultist"],
    },
    {
      id: "fp_black_oath",
      name: "Black Oath",
      description:
        "Swear a black oath that curses an enemy for 1d4 rounds, giving them disadvantage on all attack rolls and saving throws. DC 14 Charisma save. Spends 1d4 Madness Points.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["debuff"],

      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Decay 1",
        tags: ["debuff", "curse", "madness", "cultist"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
      },

      debuffConfig: {
        debuffType: "curse",
        effects: [
          {
            id: "black_oath",
            name: "Black Oath",
            description:
              "Disadvantage on all attack rolls and saving throws for 1d4 rounds. DC 14 Charisma save.",
            mechanicsText: "",
            statPenalty: {
              stat: "all_attacks_and_saves",
              magnitude: -1,
              magnitudeType: "disadvantage",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "charisma",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d4",
          description: "Spends 1d4 Madness Points when cast",
        },
      },

      tags: ["debuff", "curse", "madness", "cultist"],
    },
    {
      id: "fp_corrupt_the_faithful",
      name: "Corrupt the Faithful",
      description:
        "Preach corruption into a target's soul for 1d4 rounds, turning their devotion against their allies. DC 15 Spirit save. Generates 1d8 Madness Points. At 10+ Madness, target also deals 1d6 psychic damage to allies it attacks.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["control"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["control", "charm", "corruption", "madness", "deceiver"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "corrupted",
            name: "Corrupted",
            description:
              "Target attacks its allies for the duration. DC 15 Spirit save.",
            config: {
              controlType: "hostile_to_allies",
              saveType: "spirit",
              saveDC: 15,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d8",
            description: "Generate 1d8 Madness Points",
          },
        ],
      },

      triggerConfig: {
        conditionalEffects: {
          control: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              madness_10_plus:
                "Target also deals 1d6 psychic damage to allies it attacks",
              default: "Target attacks allies",
            },
          },
        },
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d8",
          description: "Generates 1d8 Madness Points when cast",
        },
        mindControl: {
          enabled: true,
          controlType: "hostile_to_allies",
          description: "Target becomes hostile to its allies and attacks them",
        },
      },

      tags: ["control", "charm", "corruption", "madness", "deceiver"],
    },
    {
      id: "fp_twisted_sermon",
      name: "Twisted Sermon",
      description:
        "Deliver a dark sermon in a 30-foot cone, dealing 4d6 psychic damage and causing paranoia for 2 rounds on failed save. DC 15 Spirit save for half damage. Generates 1d6 Madness Points.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Agonizing Scream",
        tags: [
          "damage",
          "psychic",
          "control",
          "paranoia",
          "madness",
          "deceiver",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "cone",
        rangeType: "self",
        aoeShape: "cone",
        aoeParameters: { length: 30 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "4d6 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "half_damage",
        },
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 2,
        durationUnit: "rounds",
        effects: [
          {
            id: "paranoid",
            name: "Paranoid",
            description: "Sees allies as enemies for 2 rounds on failed save.",
            config: {
              confusionType: "paranoia",
              saveType: "spirit",
              saveDC: 15,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d6",
            description: "Generate 1d6 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d6",
          description: "Generates 1d6 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "control", "paranoia", "madness", "deceiver"],
    },
    {
      id: "fp_wrath_of_void_god",
      name: "Wrath of the Void God",
      description:
        "Channel the void god's wrath, dealing 4d8 + Intelligence necrotic damage plus 2 damage per Madness Point spent. Spends 1d6 Madness Points.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["damage"],

      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        tags: ["damage", "necrotic", "madness", "voidcaller"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "4d8 + intelligence + (2 × madness_spent)",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d6",
          description:
            "Spends accumulated Madness Points. Your madness becomes raw destructive power, amplifying your attack with chaotic energy. The more madness you channel, the more devastating the strike becomes.",
        },
      },

      tags: ["damage", "necrotic", "madness", "voidcaller"],
    },
    {
      id: "fp_eldritch_vision",
      name: "Eldritch Vision",
      description:
        "See through walls and detect hidden enemies with void-touched sight for 1d4 rounds. Requires 9 Madness. Adds 1d6 Madness. Temptation ability.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["buff"],

      typeConfig: {
        school: "void",
        icon: "Necrotic/Drain Soul",
        tags: ["buff", "truesight", "temptation", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "truesight",
            name: "Eldritch Vision",
            description:
              "See through walls, detect invisible creatures, see in darkness for 1d4 rounds.",
            mechanicsText: "",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d6",
            description: "Generate 1d6 Madness Points (risk of Convulsion)",
          },
        ],
      },

      triggerConfig: {
        requiredConditions: {
          enabled: true,
          logicType: "AND",
          conditions: [
            {
              id: "resource_threshold",
              category: "health",
              name: "Madness Threshold",
              parameters: {
                resource_type: "madness",
                threshold_value: 9,
                threshold_type: "above",
                comparison: "greater_than",
              },
            },
          ],
        },
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 9,
          description: "Requires at least 9 Madness Points to cast",
        },
        madnessGeneration: {
          enabled: true,
          formula: "1d6",
          description: "Adds 1d6 Madness Points after casting (higher risk)",
        },
        temptationAbility: true,
      },

      tags: ["buff", "truesight", "temptation", "madness"],
    },
    {
      id: "fp_summon_congregation",
      name: "Summon the Congregation",
      description:
        "Call forth 1d4 abyssal servants to fight for you for 1d4 rounds. Generates 1d8 Madness Points.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["summoning"],

      typeConfig: {
        school: "void",
        icon: "Necrotic/Demonic Empowerment",
        tags: ["summoning", "void", "madness", "cultist"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
      },

      summoningConfig: {
        creatures: [
          {
            quantity: 1,
            duration: 4,
            durationUnit: "rounds",
            hasDuration: true,
            concentration: false,
            controlType: "verbal",
            controlRange: 30,
            attachedEffects: {},
          },
        ],
        duration: 4,
        durationUnit: "rounds",
        hasDuration: true,
        concentration: false,
        quantity: 1,
        maxQuantity: 4,
        controlRange: 30,
        controlType: "verbal",
        difficultyLevel: "moderate",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d8",
            description: "Generate 1d8 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d8",
          description: "Generates 1d8 Madness Points when cast",
        },
      },

      tags: ["summoning", "void", "madness", "cultist"],
    },
    {
      id: "fp_enslave",
      name: "Enslave",
      description:
        "Spend 1d8 Madness to completely enslave a target's mind for 1d4 rounds, making them your thrall. DC increases by +1 per Madness Point spent. DC 16 Spirit save negates.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["control"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Psionic Strike",
        tags: ["control", "domination", "madness", "deceiver"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "dominated",
            name: "Enslaved",
            description:
              "Target becomes your thrall, obeying all commands for 1d4 rounds. DC 16 Spirit save.",
            config: {
              controlType: "full_control",
              saveType: "spirit",
              saveDC: 16,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d8",
          description:
            "Spends 1d8 Madness Points. DC increases by +1 per point spent.",
        },
        mindControl: {
          enabled: true,
          controlType: "full_control",
          description: "You control the target's actions completely",
        },
      },

      tags: ["control", "domination", "madness", "deceiver"],
    },
    {
      id: "fp_devouring_omen",
      name: "Devouring Omen",
      description:
        "Summon a terrifying apparition in a 15-foot radius that frightens enemies for 3 rounds. DC 15 Spirit save. Generates 1d8 Madness Points.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["control", "summoning"],

      typeConfig: {
        school: "void",
        icon: "Utility/Resistance",
        tags: ["control", "fear", "summoning", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "incapacitation",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "frightened",
            name: "Frightened",
            description:
              "Frightened by devouring omen - disadvantage on all rolls for 3 rounds. DC 15 Spirit save.",
            config: {
              fearType: "supernatural",
              saveType: "spirit",
              saveDC: 15,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
      },

      summoningConfig: {
        creatures: [
          {
            quantity: 1,
            duration: 3,
            durationUnit: "rounds",
            hasDuration: true,
            concentration: false,
            controlType: "verbal",
            controlRange: 15,
            attachedEffects: {},
          },
        ],
        duration: 3,
        durationUnit: "rounds",
        hasDuration: true,
        concentration: false,
        quantity: 1,
        maxQuantity: 1,
        controlRange: 15,
        controlType: "verbal",
        difficultyLevel: "moderate",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d8",
            description: "Generate 1d8 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d8",
          description: "Generates 1d8 Madness Points when cast",
        },
      },

      tags: ["control", "fear", "summoning", "madness"],
    },
    {
      id: "fp_grand_deception",
      name: "Grand Deception",
      description:
        "Create a grand deception in a 30-foot radius that confuses all enemies for 3 rounds. DC 16 Intelligence save. Generates 1d6 Madness Points. At 10+ Madness, confused enemies also attack allies.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["control"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: [
          "control",
          "confusion",
          "aoe",
          "deception",
          "madness",
          "deceiver",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 50,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "grand_confusion",
            name: "Grand Confusion",
            description:
              "All enemies confused - may attack allies or do nothing for 3 rounds. DC 16 Intelligence save.",
            config: {
              confusionType: "complete",
              saveType: "intelligence",
              saveDC: 16,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "intelligence",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 26 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d6",
            description: "Generate 1d6 Madness Points",
          },
        ],
      },

      triggerConfig: {
        conditionalEffects: {
          control: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              madness_10_plus: "Confused enemies also attack allies each round",
              default: "Confused enemies act erratically",
            },
          },
        },
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d6",
          description: "Generates 1d6 Madness Points when cast",
        },
      },

      tags: ["control", "confusion", "aoe", "deception", "madness", "deceiver"],
    },
    {
      id: "fp_reality_distortion",
      name: "Reality Distortion",
      description:
        "Distort reality in a 25-foot radius, dealing 8d8 + Intelligence psychic damage and disorienting enemies for 2 rounds. DC 18 Spirit save for half damage. Spends 1d8 Madness Points.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "psychic",
        icon: "Void/Consumed by Void",
        tags: ["damage", "psychic", "debuff", "distortion", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 50,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "8d8 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critMultiplier: 2,
          critRange: [20],
          critBonusDamage: "4d8",
        },
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "disoriented",
            name: "Disoriented",
            description:
              "Disadvantage on all rolls for 2 rounds. DC 18 Spirit save negates.",
            mechanicsText: "",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d8",
          description: "Spends 1d8 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "debuff", "distortion", "madness"],
    },
    {
      id: "fp_reality_twist",
      name: "Reality Twist",
      description:
        "Twist reality in a 20-foot radius for 1d4 rounds, creating a zone of chaotic effects. Each round roll 1d6: 1=teleport, 2=3d6 damage, 3=2d8 heal, 4=slow, 5=haste, 6=confusion. Spends 1d8 Madness Points.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["control"],

      typeConfig: {
        school: "void",
        icon: "Void/Consumed by Void",
        tags: ["control", "zone", "chaos", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 40,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["any"],
      },

      controlConfig: {
        controlType: "zone",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "chaos_zone",
            name: "Reality Twist",
            description:
              "All creatures in zone experience random effects each round (1d6 roll).",
            config: {
              zoneType: "chaos",
              radius: 20,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      rollableTable: {
        enabled: true,
        tableName: "Reality Twist Effects",
        description:
          "Roll 1d6 each round for random effect on all creatures in zone",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d6" },
        entries: [
          {
            range: { min: 1, max: 1 },
            customName: "Chaotic Teleport",
            effect: "All creatures teleport to random positions within 30ft",
          },
          {
            range: { min: 2, max: 2 },
            customName: "Void Damage",
            effect: "3d6 void damage to all creatures in zone",
          },
          {
            range: { min: 3, max: 3 },
            customName: "Twisted Healing",
            effect: "2d8 healing to all creatures in zone",
          },
          {
            range: { min: 4, max: 4 },
            customName: "Time Slow",
            effect: "All creatures in zone are slowed for 1 round",
          },
          {
            range: { min: 5, max: 5 },
            customName: "Chaotic Haste",
            effect: "All creatures in zone gain haste for 1 round",
          },
          {
            range: { min: 6, max: 6 },
            customName: "Mass Confusion",
            effect:
              "All creatures in zone become confused for 1 round (DC 14 Spirit save)",
          },
        ],
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d8",
          description: "Spends 1d8 Madness Points when cast",
        },
        randomEffects: {
          enabled: true,
          description:
            "Roll 1d6 each round for random effect: 1=teleport, 2=damage, 3=heal, 4=slow, 5=haste, 6=confusion",
        },
      },

      tags: ["control", "zone", "chaos", "madness"],
    },
    {
      id: "fp_apocalyptic_revelation",
      name: "Apocalyptic Revelation",
      description:
        "Unleash a massive wave of 12d6 + Intelligence psychic energy in a 30-foot radius. DC 18 Spirit save for half damage. Requires 12 Madness. Adds 2d6 Madness (high Convulsion risk). Temptation ability.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["damage"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Strike",
        tags: [
          "damage",
          "psychic",
          "aoe",
          "temptation",
          "madness",
          "voidcaller",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "12d6 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critMultiplier: 2,
          critRange: [20],
          critBonusDamage: "4d6",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "2d6",
            description:
              "Generate 2d6 Madness Points (VERY high Convulsion risk)",
          },
        ],
      },

      triggerConfig: {
        requiredConditions: {
          enabled: true,
          logicType: "AND",
          conditions: [
            {
              id: "resource_threshold",
              category: "health",
              name: "Madness Threshold",
              parameters: {
                resource_type: "madness",
                threshold_value: 12,
                threshold_type: "above",
                comparison: "greater_than",
              },
            },
          ],
        },
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 12,
          description: "Requires at least 12 Madness Points to cast",
        },
        madnessGeneration: {
          enabled: true,
          formula: "2d6",
          description:
            "Adds 2d6 Madness Points after casting (VERY high Convulsion risk)",
        },
        temptationAbility: true,
        warning: "Extremely likely to trigger Insanity Convulsion",
      },

      tags: ["damage", "psychic", "aoe", "temptation", "madness", "voidcaller"],
    },
    {
      id: "fp_mass_manipulation",
      name: "Mass Manipulation",
      description:
        "Manipulate the minds of all enemies within 40 feet, dominating them for 2 rounds. DC 18 Spirit save negates. Spends 1d8 Madness Points. At 15+ Madness, dominated targets also attack each other.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["control"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: [
          "control",
          "manipulation",
          "mind control",
          "mass",
          "madness",
          "deceiver",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 2,
        durationUnit: "rounds",
        effects: [
          {
            id: "mass_control",
            name: "Mass Manipulation",
            description:
              "All enemies dominated - must follow your commands for 2 rounds. DC 18 Spirit save.",
            config: {
              controlType: "full",
              saveType: "spirit",
              saveDC: 18,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d8",
          description: "Spends 1d8 Madness Points when cast",
        },
      },

      triggerConfig: {
        conditionalEffects: {
          control: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              madness_15_plus:
                "Dominated targets also attack each other each round",
              default: "Dominated targets follow your commands",
            },
          },
        },
      },

      tags: [
        "control",
        "manipulation",
        "mind control",
        "mass",
        "madness",
        "deceiver",
      ],
    },
    {
      id: "fp_ultimate_deception",
      name: "Ultimate Deception",
      description:
        "Create the ultimate deception that makes enemies believe they won, then devastates them with 12d10 + Intelligence psychic damage. DC 19 Spirit save for half damage. Spends 2d6 Madness Points.",
      level: 9,
      spellType: "ACTION",
      effectTypes: ["damage"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["damage", "psychic", "ultimate", "deception", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "12d10 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critMultiplier: 2,
          critRange: [20],
          critBonusDamage: "6d10",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 38 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "2d6",
          description: "Spends 2d6 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "ultimate", "deception", "madness"],
    },
    {
      id: "fp_prophet_of_lies",
      name: "Prophet of Lies",
      description:
        "Ascend to become the ultimate Prophet of Lies for 5 rounds. Gain +6 Intelligence, Spirit, and Charisma. Charm or frighten all enemies within 30ft once per transformation. All illusion spells are automatically believed. Immune to charm, fear, and confusion. Gain 3d10 Madness when transformation ends. Spends all current Madness Points.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["transformation"],

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["transformation", "ultimate", "god form", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      transformationConfig: {
        transformType: "divine",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        concentration: true,
        maintainEquipment: true,
        grantedAbilities: [
          {
            id: "prophet_stats",
            name: "Eldritch Insight",
            description: "+6 Intelligence, +6 Spirit, +6 Charisma",
          },
          {
            id: "mass_manipulation",
            name: "Mass Manipulation",
            description:
              "Charm or frighten all enemies within 30ft (once per transformation)",
          },
          {
            id: "illusion_mastery",
            name: "Illusion Mastery",
            description: "All illusion spells are automatically believed",
          },
          {
            id: "mind_shield",
            name: "Mind Shield",
            description: "Immune to charm, fear, and confusion effects",
          },
          {
            id: "prophet_madness",
            name: "Madness (On End)",
            description: "Gain 3d10 Madness Points when transformation ends",
          },
        ],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 42 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "all",
          description: "Spends all current Madness Points when cast",
        },
      },

      tags: ["transformation", "ultimate", "god form", "madness"],
    },
  ],
};
