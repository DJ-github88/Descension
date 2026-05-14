/**
 * Huntress Class Data
 *
 * Complete class information for the Huntress - an agile melee combatant
 * who wields the Shadow Glaive and commands a loyal companion.
 */

export const HUNTRESS_DATA = {
  id: "huntress",
  name: "Huntress",
  icon: "fas fa-moon",
  role: "Damage",
  damageTypes: ["piercing", "slashing"],

  // Overview section
  overview: {
    title: "The Huntress",
    subtitle: "Shadow Glaive Wielder & Beast Companion",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Huntress is an agile melee damage dealer who builds Quarry Marks through attacks to empower both her Shadow Glaive chains and her beast companion.

**Core Mechanic**: Attack enemies → Generate Quarry Marks → Spend marks on companion buffs, glaive chain extensions, or ultimate abilities

**Resource**: Quarry Marks (0–5 scale, max +3 generated per turn, +4 for Beastmaster)

**Playstyle**: Hit-and-run tactical melee with companion synergy

**Best For**: Players who enjoy pet management, multi-target melee, and aggressive resource-building gameplay

---

**Your First Turn (Quickstart)**:
1. **Command** your companion to Attack a priority target (Bonus Action)
2. **Glaive Toss** at the largest cluster of enemies (Action) — chains to nearby foes
3. **Watch your Quarry Marks fill** — you gain +1 per enemy hit (max +3/turn)
4. **Spend marks** to extend chains, buff companion, or save for a devastating ultimate`,
    },

    description: `The Huntress is a master of close-range combat who wields the legendary Shadow Glaive, a weapon capable of chaining deadly strikes between multiple enemies. Accompanied by a loyal beast companion, the Huntress excels at hit-and-run tactics, weaving through enemy lines with deadly grace. Through the Quarry Marks system, she tracks her prey and unleashes devastating coordinated attacks with her companion. This dynamic class rewards tactical positioning, resource management, and the synergy between hunter and beast.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Huntresses are elite warriors who have bonded with a beast companion through ancient rituals. They often serve as scouts, trackers, or guardians of wild places, using their agility and their companion's instincts to protect their territory.

**Common Huntress Archetypes**:
- **The Sentinel**: A guardian of sacred groves who patrols with her companion, defending nature from intruders
- **The Tracker**: A relentless pursuer who marks her quarry and never stops until the hunt is complete
- **The Shadowblade**: An assassin who strikes from darkness, her glaive a blur of deadly precision
- **The Beastmaster**: A warrior whose bond with her companion transcends normal understanding, fighting as one entity
- **The Moonlight Warrior**: A nocturnal hunter who channels lunar energy through her glaive and companion

**Personality Traits**:
Huntresses are typically independent, patient, and fiercely loyal to their companions. They value freedom, respect nature's balance, and trust their instincts. Many prefer the company of beasts to people, finding honesty in the wild that civilization lacks.`,
    },

    combatRole: {
      title: "Combat Role",
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
Huntresses excel at close range (5-15 feet), positioning themselves to maximize glaive chains between grouped enemies. They should maintain mobility, using Shadowstep to reposition and avoid being surrounded while keeping their companion in effective range.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `**Quarry Mark Management**:
The key to mastering the Huntress is generating and spending Quarry Marks efficiently. Generate marks through successful attacks, then spend them strategically:

- **1 Mark**: Enhance companion's next attack (+1d6 damage)
- **2 Marks**: Extend glaive chain by +1 target
- **3 Marks**: Companion special ability
- **5 Marks**: Specialization ultimate ability

**Companion Commands**:
Your companion is a crucial part of your combat effectiveness. Use commands wisely:
- **Attack**: When you need additional damage on priority targets
- **Defend**: When you or an ally needs protection (+2 Armor)
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
- Mark priority targets for focused fire`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Shadow Glaive Dance",
      content: `**The Setup**: You're a Huntress (Bladestorm specialization) with your wolf companion "Fang" facing a group of bandits (5 bandits in a tight formation). Your party is with you. Starting Quarry Marks: 2 (from previous encounter). Your goal: Use glaive chaining to hit multiple enemies, generate Quarry Marks through successful attacks, and coordinate with your companion for devastating combos.

**Starting State**: Quarry Marks: 2/5 | HP: 70/70 | Companion (Fang): 50/50 HP | Armor: 14

**Initiative**: Bandits 16, You 12, Fang acts on your turn (companion acts when commanded)

---

**Turn 1 — The Opening Chain (QM: 2 → 5)**

*Five bandits stand in a tight group, weapons drawn. You grip your Shadow Glaive—a crescent-bladed polearm that hums with dark energy. Fang growls beside you, ready to strike.*

**Bandit #5's Turn** (initiative 16): Charges toward you but is still 20ft away — no attack this turn.

**Your Turn** (initiative 12):
- **Action**: Shadow Glaive Attack on Bandit #1 (melee attack, chains to nearby enemies)
  - **Attack Roll**: d20+7 → [16] vs AC 13 → Hit!
  - **Primary Target Damage**: 2d8+4 → [7, 6] + 4 = **17 damage** to Bandit #1

*Your glaive strikes Bandit #1, and the blade GLOWS. Shadow energy arcs from the impact point, seeking nearby targets.*

- **Chain Mechanic**: Glaive chains to all enemies within 5 feet of primary target
  - **Enemies in Range**: Bandits #2, #3, #4 (all within 5 feet of Bandit #1)
  - **Chain Damage**: 1d8+4 to each chained target (Bladestorm spec: 1d6 minimum on chains)

  - **Chain Attack #1 (Bandit #2)**: 1d8+4 → [6] + 4 = **10 damage**
  - **Chain Attack #2 (Bandit #3)**: 1d8+4 → [7] + 4 = **11 damage**
  - **Chain Attack #3 (Bandit #4)**: 1d8+4 → [5] + 4 = **9 damage**

*The shadow energy EXPLODES outward, striking four bandits in one swing. They stagger, wounded.*

- **Total Damage**: 17 + 10 + 11 + 9 = **47 damage across 4 targets!**
- **Quarry Marks Generated**: +1 QM per enemy hit = +4 potential, but turn cap is +3
- **QM Calculation**: 2 + 3 = **5 QM** (cap reached, 1 mark lost to overflow)

- **Bonus Action**: Command Fang to Attack Bandit #1
  - **Fang's Attack Roll**: d20+5 → [14] vs AC 13 → Hit!
  - **Damage**: 1d8+3 → [6] + 3 = **9 damage**
  - **Result**: Bandit #1 takes 17 + 9 = 26 total damage — **DEAD**

*Fang leaps forward, jaws clamping down on Bandit #1's throat. The bandit falls.*

**End of Turn 1 — QM: 5/5 | 4 bandits remaining (all wounded)**

---

**Turn 2 — Extending the Chain (QM: 5 → 3 → 5)**

*The bandits regroup. Bandit #5 closes the distance and swings at you.*

**Bandit #5's Turn** (initiative 16):
- **Attack**: +5 vs your AC 14 → [17] → Hit! → 2d6+3 → [5, 4] + 3 = 12 damage
- **Your HP**: 70 - 12 = **58/70**

**Your Turn** (initiative 12):
- **Free Action**: Spend 2 Quarry Marks to extend glaive chain by +1 target (can grab an enemy outside normal chain range)
  - **QM: 5 - 2 = 3**

*You focus your will. The Shadow Glaive pulses with darker energy. This next strike will chain further.*

- **Action**: Shadow Glaive Attack on Bandit #2
  - **Attack Roll**: d20+7 → [18] vs AC 13 → Hit!
  - **Primary Target Damage**: 2d8+4 → [8, 7] + 4 = **19 damage** to Bandit #2

- **Chain Mechanic**: Extended chain reaches Bandits #3, #4, and #5 (3 enemies within extended range)
  - **Chain Attack #1 (Bandit #3)**: 1d8+4 → [6] + 4 = **10 damage** → Bandit #3 **DEAD** (was already wounded)
  - **Chain Attack #2 (Bandit #4)**: 1d8+4 → [8] + 4 = **12 damage** → Bandit #4 **DEAD** (was already wounded)
  - **Chain Attack #3 (Bandit #5)**: 1d8+4 → [5] + 4 = **9 damage**

*The glaive chains to THREE enemies this time, killing two of them. Only Bandits #2 and #5 remain.*

- **QM Generated**: +3 from 3 enemies hit (turn cap). 3 + 3 = **5 QM** (cap reached)

- **Bonus Action**: Command Fang to Defend you (+2 Armor for 1 round)
  - **Your Armor**: 14 + 2 = **16** until start of your next turn

*Fang positions himself protectively in front of you, snarling at the remaining bandits.*

**End of Turn 2 — QM: 5/5 | 2 bandits remaining | Your armor: 16**

---

**Turn 3 — Companion Empowerment (QM: 5 → 4 → 5)**

*Two bandits left. Bandit #2 is wounded (19 damage taken), Bandit #5 is wounded (9 damage taken). Time to finish this.*

**Bandit #2's Turn** (initiative 16): Attacks Fang → [11] vs Fang's AC 12 → **Miss!**

**Your Turn** (initiative 12):
- **Free Action**: Spend 1 Quarry Mark to enhance Fang's next attack (+1d6 damage)
  - **QM: 5 - 1 = 4**

- **Bonus Action**: Command Fang to Attack Bandit #2
  - **Fang's Attack Roll**: d20+5 → [16] vs AC 13 → Hit!
  - **Damage**: 1d8+3 + 1d6 (QM bonus) → [7] + 3 + [5] = **15 damage**
  - **Result**: Bandit #2 **DEAD**

*Fang's jaws glow with shadow energy as he tears into Bandit #2. The bandit falls.*

- **Action**: Shadow Glaive Attack on Bandit #5 (last enemy)
  - **Attack Roll**: d20+7 → [19] vs AC 13 → Hit!
  - **Damage**: 2d8+4 → [8, 6] + 4 = **18 damage**
  - **Result**: Bandit #5 **DEAD**

*Your glaive sweeps through the last bandit. He falls. Combat over.*

- **QM Generated**: +1 (Fang hit, within turn cap). 4 + 1 = **5 QM** (banked for next fight — decay begins in 1 minute)

---

**Combat Over**

*You stand among five corpses, your Shadow Glaive still humming with dark energy. Fang sits beside you, blood on his muzzle. Your party stares.*

**Your Party's Mage**: "You... you killed four of them in one swing."
**You**: "Shadow Glaive chains to nearby enemies. The closer they stand, the more they die together."
**Your Party's Tank**: "And your wolf just... knew when to defend you?"
**You**: "Fang and I share an empathic bond. I command, he obeys. But we fight as one."
**Fang**: *Growls in agreement*

**Final State**: QM: 5/5 (banked, decay in 1 min) | HP: 58/70 | Fang: 50/50 HP

**The Lesson**: Huntress gameplay is about:
1. **Glaive Chaining**: Hit 1 primary target, chain to 3 nearby enemies = 4 hits in one attack (47 damage total in Turn 1)
2. **Quarry Mark Management**: +1 QM per enemy hit (including chains), capped at +3 per turn (+4 for Beastmaster). Overflow marks are lost.
3. **Quarry Mark Spending**: Spent 2 QM to extend chain by +1 target (Turn 2), spent 1 QM to enhance Fang's attack (Turn 3)
4. **Companion Commands**: Commanded Fang to Attack (Turn 1, 3) and Defend (Turn 2). Companion acts on a Bonus Action when commanded.
5. **Positioning**: Enemies grouped together = maximum chain effectiveness
6. **Burst Damage**: Turn 1 dealt 47 damage across 4 targets, Turn 2 dealt 50 damage across 4 targets (killed 2)
7. **Resource Banking**: Ended with 5 QM banked. Marks decay by 1/minute after a 1-minute grace period — rush to the next fight!
8. **Action Economy**: Each turn you have 1 Action (glaive attack) + 1 Bonus Action (companion command). Free Actions can spend QM for passive effects.

You're not a single-target damage dealer. You're a CHAIN ATTACKER. When enemies group up, your Shadow Glaive becomes a weapon of mass destruction. One swing, four hits. And with Quarry Marks, you can extend chains even further, empower your companion, or unleash ultimate abilities. The key is positioning—get enemies close together, then watch the shadow energy arc between them. And Fang isn't just a pet—he's a tactical asset. Attack when you need damage, Defend when you need protection. Together, you're unstoppable.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Quarry Marks (QM)",
    subtitle: "The Rhythm of the Hunt",

    description: `The Huntress is a master of focus and coordination. Your core resource is **Quarry Marks** (0-5), silver-blue moonlight energy built through successful strikes. While your Shadow Glaive clears the field, your Quarry Marks are what turn your loyal companion from a pet into a lethal extension of your own will.`,

    cards: [
      {
        title: "Quarry Marks (0-5)",
        stats: "Cap: 5 Marks",
        details:
          "Build marks through hits. Spend to extend glaive chains or empower your beast companion.",
      },
      {
        title: "The Shadow Bond",
        stats: "Telepathic Link",
        details:
          "You and your companion share a resource pool. Marks generated by one can be spent by the other.",
      },
      {
        title: "Tactical Chain",
        stats: "2 QM Cost",
        details:
          "Spend 2 QM to force your glaive to chain to ONE additional target, even if they are out of range.",
      },
    ],

    generationTable: {
      headers: ["Event", "QM Gained", "Notes"],
      rows: [
        ["Glaive Hit", "+1 QM", "Per target hit (includes chains)"],
        ["Companion Hit", "+1 QM", "Generated when your beast lands an attack"],
        [
          "Critical Hit",
          "+2 QM",
          "Landing a crit on your primary target (counts toward turn cap)",
        ],
        ["Mark Quarry", "+1 QM", "Special ability to mark without attacking"],
        ["Turn Cap", "MAX +3", "You cannot generate more than 3 QM per turn"],
        [
          "Beastmaster Cap",
          "MAX +4",
          "Beastmaster specialization increases turn cap to +4",
        ],
        [
          "Overflow",
          "Lost",
          "Any marks generated beyond the turn cap are lost (they do not bank)",
        ],
        [
          "Mark Decay",
          "-1/min",
          "Outside combat, marks decay by 1 per minute after a 1-minute grace period",
        ],
      ],
    },

    usage: {
      momentum:
        'Start by commanding your companion to "Attack" while you use "Glaive Toss." This reliably builds your 3-mark "Companion Special" by turn two.',
      flourish:
        "⚠️ The Over-Hunt: If you hit 5 QM, don't sit on them. You generate marks so fast that any unspent marks are effectively wasted power.",
    },

    overheatRules: {
      title: "Primal Outrage",
      content: `If you begin your turn with 5 Quarry Marks and generate additional marks (through overflow), or if your companion drops below 25% HP while you have 3+ Quarry Marks, your beast enters a **Primal Outrage**.

**The Effect**: For the next 2 turns, your companion deals **Double Damage** but becomes **Frenzied**. A frenzied beast will move toward and attack the NEAREST creature at the start of its turn, regardless of affiliation. You must spend an Action (Command) to snap it out of the frenzy early.`,
    },

    strategicConsiderations: {
      title: "The Hunting Party",
      content: `**Beastmaster Spec**: Your turn cap for QM generation is increased from +3 to +4, allowing you to cycle through Companion Specials every single turn.

**Banking**: Since marks persist between fights, always try to "finish" an encounter by building back up to 5 QM so you can open the next fight with an Ultimate.

**Mark Decay**: Quarry Marks decay by 1 per minute outside of combat. You retain your marks for 1 full minute after combat ends before they begin fading. This rewards aggressive, back-to-back encounters without guaranteeing every fight opens at maximum power.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Hunting Trophy",
      content: `The Huntress thrives when the player feels the "Build and Release" rhythm of the marks.

**Required Materials**:
- **5 Silver/Blue Tokens**: (Representing Quarry Marks).
- **Companion Miniature**: (Essential for tracking chain distances).
- **A Trophy Bowl**: (For the physical hack).

**The Physical Hack (Friction Points)**:
- **The Hunting Trophy**: When you kill an enemy that was "Marked" (had at least 1 QM spent on them), move 1 token from your spend pile into a separate **Trophy Bowl**. During a Short Rest, each token in the bowl can be "consumed" to grant 1d4 temporary HP to your companion.
- **The Chain Thread**: Use a piece of silver string or a pipe cleaner to physically connect your mini to the enemies hit by your Glaive Chain. It helps everyone see who is currently being "hunted."
- **Empathic Distress**: If your companion drops below 25% HP, flip your character sheet over or place it at an angle. It signals your character's emotional distraction to the table.

**Pro Tip**: Use a d6 to track QM on your companion's mini directly. It keeps the information where the action is happening.`,
    },
  },

  // Specializations
  specializations: {
    title: "Huntress Specializations",
    subtitle: "Three Paths of the Hunt",

    description: `Every Huntress chooses one of three specializations that define their combat style. Each specialization emphasizes different aspects of glaive combat, companion synergy, or stealth and mobility, offering unique passive abilities and playstyles.`,

    sharedPassive: null,

    specs: [
      {
        id: "bladestorm",
        name: "Bladestorm",
        icon: "Piercing/Dagger Rain",
        color: "#DC143C",
        theme: "Multi-Target Devastation",

        description: `The Bladestorm specialization focuses on maximizing the Shadow Glaive's chain attack potential. These Huntresses are masters of positioning and timing, able to strike multiple enemies in a single fluid motion. They excel in situations where enemies are grouped together, turning their glaive into a whirlwind of death.`,

        playstyle:
          "Aggressive multi-target damage dealer, positioning for maximum chain attacks and area control",

        strengths: [
          "Highest multi-target damage among Huntress specs",
          "Can chain to 5 targets instead of 4 (with passive)",
          "Momentum-based damage scaling",
          "Excellent against grouped enemies",
        ],

        weaknesses: [
          "Less effective against spread-out enemies",
          "Lower single-target damage than Shadowblade",
          "Requires careful positioning",
          "Companion plays secondary role",
        ],

        passiveAbilities: [
          {
            name: "Whirling Blades",
            icon: "Slashing/Quick Slash",
            description:
              "Your Shadow Glaive can chain to +1 additional target (total of 5 targets: 1d8 → 1d6 → 1d6 → 1d6 → 1d6). This does not cost Quarry Marks. Chain damage floor is raised to 1d6 at all levels.",
          },
          {
            name: "Momentum",
            icon: "Utility/Empowered Warrior",
            description:
              "Each successful chain attack grants you +1 to your next attack roll. This bonus stacks up to +3 and resets if you miss an attack.",
          },
        ],

        recommendedSpells: [
          "Glaive Toss - Your bread-and-butter chain attack",
          "Whirling Death - Spin attack for maximum AoE",
          "Blade Fury - Ultimate ability for massive multi-target burst",
          "Swift Assault - Rapid strikes to build Momentum",
        ],
      },
      {
        id: "beastmaster",
        name: "Beastmaster",
        icon: "Nature/Spawn",
        color: "#228B22",
        theme: "Companion Synergy",

        description: `The Beastmaster specialization deepens the bond between Huntress and companion, creating a fighting duo that operates as a single deadly unit. These Huntresses coordinate their attacks perfectly with their beasts, overwhelming enemies through synchronized strikes and tactical positioning.`,

        playstyle:
          "Coordinated attacks with companion, tactical positioning for Pack Tactics, balanced damage distribution",

        strengths: [
          "Strongest companion damage and utility",
          "Pack Tactics provides consistent advantage",
          "Companion has enhanced survivability",
          "Excellent single-target focus fire",
        ],

        weaknesses: [
          "Heavily reliant on companion staying alive",
          "Lower personal damage than other specs",
          "Requires positioning both Huntress and companion",
          "Vulnerable if companion is killed",
        ],

        passiveAbilities: [
          {
            name: "Alpha Bond",
            icon: "Nature/Claw Marks",
            description:
              "Your companion deals +1d6 damage on all attacks. Your companion's maximum HP is increased by +10, and your companion gains its own initiative (acts independently at the start of its turn).",
          },
          {
            name: "Pack Tactics",
            icon: "Nature/Sense",
            description:
              "When you and your companion attack the same target, both of you gain advantage on attack rolls against that target until the end of your turn. Additionally, your companion's attacks generate Quarry Marks as if they were your glaive attacks.",
          },
        ],

        recommendedSpells: [
          "Companion Strike - Enhanced companion attack",
          "Coordinated Assault - Simultaneous attacks with advantage",
          "Primal Rage - Companion ultimate ability",
          "Mark Quarry - Build marks for companion empowerment",
        ],
      },
      {
        id: "shadowblade",
        name: "Shadowblade",
        icon: "Utility/Phantom Dash",
        color: "#4B0082",
        theme: "Stealth & Lethality",

        description: `The Shadowblade specialization embraces the shadows, using stealth and mobility to strike from unexpected angles. These Huntresses are assassins who blend hit-and-run tactics with devastating burst damage, appearing from nowhere to eliminate priority targets before vanishing back into darkness.`,

        playstyle:
          "High mobility assassin, stealth attacks, burst damage, hit-and-run tactics",

        strengths: [
          "Highest single-target burst damage",
          "Exceptional mobility with enhanced Shadowstep",
          "Stealth attacks deal massive damage",
          "Superior survivability through evasion",
        ],

        weaknesses: [
          "Lower sustained damage than Bladestorm",
          "Requires stealth setup for maximum damage",
          "Less effective in prolonged fights",
          "Companion plays support role",
        ],

        passiveAbilities: [
          {
            name: "Shadow Veil",
            icon: "Utility/Hide",
            description:
              "After using Shadowstep, you gain +2 Armor and advantage on Stealth checks for 1 round. You can hide for 1 AP during this time.",
          },
          {
            name: "Lethal Precision",
            icon: "Poison/Poison Concoction",
            description:
              "Attacks made from stealth or immediately after using Shadowstep deal an additional 2d6 damage. Additionally, your glaive chain damage becomes necrotic instead of slashing, and chained enemies cannot see you until the start of their next turn (Shadow Chain).",
          },
        ],

        recommendedSpells: [
          "Shadowstep - Core mobility and damage amplifier",
          "Shadow Strike - Massive stealth attack",
          "Phantom Blades - Ultimate multi-attack ability",
          "Evasion - Defensive survival tool",
        ],
      },
    ],
  },

  // Example Abilities - showcasing Shadow Glaive and Companion mechanics
  exampleSpells: [
    // BLADESTORM - Multi-Target Glaive Attacks
    {
      effectTypes: ["damage"],
      id: "huntress_glaive_toss",
      name: "Glaive Toss",
      description:
        "Throw your Shadow Glaive at a target, chaining to additional enemies within 5 feet of each other.",
      spellType: "ACTION",
      icon: "Piercing/Dagger Rain",
      level: 1,
      specialization: "bladestorm",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Piercing/Dagger Rain",
      },

      targetingConfig: {
        targetingType: "chain",
        rangeType: "ranged",
        rangeDistance: 30,
        chainDistance: 5,
        maxChains: 4,
      },

      propagation: {
        type: "chain",
        maxTargets: 4,
        chainDistance: 5,
        damageDecay: 0.5,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Throw glaive in spinning arc",
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d8",
        elementType: "slashing",
        damageTypes: ["direct"],
        scalingType: "chain_reduction",
      },

      effects: {
        damage: {
          chain: {
            primary: "1d8",
            second: "1d6",
            third: "1d6",
            fourth: "1d4",
            type: "slashing",
            chainDistance: 5,
            scalingNote:
              "Chain minimum damage increases with level: L1-4 as listed, L5-7 minimum 1d6 on all chains, L8-10 minimum 1d8 on all chains",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          perHit: true,
          description: "Generate 1 Quarry Mark for each enemy hit",
        },
        chainMechanic: {
          description: "Chains to enemies within 5 feet of previous target",
          maxTargets: 4,
          damageReduction:
            "Chain damage: 1d8 (primary) → 1d6 → 1d6 → 1d4. At L5+, all chains deal at least 1d6. At L8+, all chains deal at least 1d8.",
        },
        bladestormPassive: {
          description:
            "Bladestorm spec can chain to 5 targets (adds 1d6 fifth target)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["physical", "damage", "chain", "multi target", "bladestorm"],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_whirling_death",
      name: "Whirling Death",
      description:
        "Spin your Shadow Glaive in a deadly circle, striking all enemies within 10 feet.",
      spellType: "ACTION",
      icon: "Slashing/Quick Slash",
      level: 3,
      specialization: "bladestorm",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Slashing/Quick Slash",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self",
        areaType: "circle",
        areaSize: 10,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Spin in place with glaive extended",
        classResource: { type: "quarry_marks", cost: 2 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "2d8",
        elementType: "slashing",
        damageTypes: ["area"],
        scalingType: "none",
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 1,
          perHit: true,
          description:
            "Costs 2 marks to use, but generates 1 mark per enemy hit",
        },
        momentum: {
          description:
            "Each enemy hit grants +1 Momentum (Bladestorm passive), stacking up to +3",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["physical", "damage", "aoe", "spin", "bladestorm"],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_blade_fury",
      name: "Blade Fury",
      description:
        "Unleash a devastating flurry of glaive strikes, hitting multiple targets in rapid succession.",
      spellType: "ACTION",
      icon: "Slashing/Whirl",
      level: 5,
      specialization: "bladestorm",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Slashing/Whirl",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "melee",
        rangeDistance: 15,
        maxTargets: 5,
      },

      propagation: { type: "multi", maxTargets: 5 },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Rapid spinning strikes with glaive",
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "3d8",
        elementType: "slashing",
        damageTypes: ["direct"],
        scalingType: "none",
      },

      effects: {
        damage: {
          multiTarget: {
            formula: "3d8",
            type: "slashing",
            targets: 5,
            description: "Each target takes full damage",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Ultimate ability - costs all 5 Quarry Marks",
        },
        momentum: {
          description: "Grants maximum Momentum (+3) after use",
        },
        bladestormUltimate: {
          description: "Bladestorm specialization ultimate ability",
          additionalEffect: "Gain +2 Armor until end of next turn",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["physical", "damage", "multi target", "ultimate", "bladestorm"],
    },

    // BEASTMASTER - Companion Synergy
    {
      effectTypes: ["damage"],
      id: "huntress_companion_strike",
      name: "Companion Strike",
      description:
        "Command your companion to attack a target with enhanced ferocity.",
      spellType: "ACTION",
      icon: "Nature/Spawn",
      level: 1,
      specialization: "beastmaster",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "piercing",
        icon: "Nature/Spawn",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "companion",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Attack command to companion",
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "piercing",
        formula: "1d8",
        damageTypes: ["direct"],
        scalingType: "proficiency",
      },

      effects: {
        damage: {
          companion: {
            formula: "1d8 + proficiency bonus",
            type: "physical",
            source: "companion",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: "Generate 1 Quarry Mark on hit",
        },
        companionCommand: {
          type: "attack",
          description: "Basic companion attack command",
        },
        beastmasterPassive: {
          description:
            "Beastmaster spec adds +1d4 damage (Primal Bond passive)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["physical", "damage", "companion", "command", "beastmaster"],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_coordinated_assault",
      name: "Coordinated Assault",
      description:
        "You and your companion attack the same target simultaneously, overwhelming them with coordinated strikes.",
      spellType: "ACTION",
      icon: "Nature/Claw Marks",
      level: 3,
      specialization: "beastmaster",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Nature/Claw Marks",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Attack command",
        somaticText: "Point at target",
        classResource: { type: "quarry_marks", cost: 2 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "slashing",
        formula: "2d8",
        damageTypes: ["direct"],
        scalingType: "none",
      },

      effects: {
        damage: {
          huntress: {
            formula: "2d8",
            type: "slashing",
            advantage: true,
          },
          companion: {
            formula: "1d8 + proficiency",
            type: "physical",
            advantage: true,
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 2,
          description: "Costs 2 marks, generates 2 marks (1 per hit)",
        },
        packTactics: {
          description: "Both attacks have advantage (Pack Tactics passive)",
          requirement: "Beastmaster specialization",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["physical", "damage", "companion", "coordinated", "beastmaster"],
    },

    {
      effectTypes: ["buff"],
      id: "huntress_primal_rage",
      name: "Primal Rage",
      description:
        "Your companion enters a primal rage, gaining enhanced stats and attacking with savage fury.",
      spellType: "ACTION",
      icon: "Nature/Sense",
      level: 5,
      specialization: "beastmaster",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "piercing",
        icon: "Nature/Sense",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "companion",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Primal command to companion",
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "AUTOMATIC",

      buffConfig: {
        effects: [
          {
            id: "companion_gains_2_to_attack_rolls",
            name: "Companion gains +2 to attack rolls",
            description: "Companion gains +2 to attack rolls",
            mechanicsText: "Companion gains +2 to attack rolls",
          },
          {
            id: "companion_deals_2d6_damage_on_all_a",
            name: "Companion deals +2d6 damage on all attacks",
            description: "Companion deals +2d6 damage on all attacks",
            mechanicsText: "Companion deals +2d6 damage on all attacks",
          },
          {
            id: "companion_gains_4_armor",
            name: "Companion gains +4 Armor",
            description: "Companion gains +4 Armor",
            mechanicsText: "Companion gains +4 Armor",
          },
          {
            id: "companion_has_advantage_on_all_atta",
            name: "Companion has advantage on all attacks",
            description: "Companion has advantage on all attacks",
            mechanicsText: "Companion has advantage on all attacks",
          },
          {
            id: "duration_3_rounds",
            name: "Duration: 3 rounds",
            description: "Duration: 3 rounds",
            mechanicsText: "Duration: 3 rounds",
          },
        ],
      },

      effects: {
        buff: {
          target: "companion",
          duration: 3,
          attackBonus: 2,
          damageBonus: "2d6",
          acBonus: 4,
          advantage: true,
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Ultimate ability - costs all 5 Quarry Marks",
        },
        beastmasterUltimate: {
          description: "Beastmaster specialization ultimate ability",
          companionRage: "Companion becomes a devastating force for 3 rounds",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["buff", "companion", "ultimate", "beastmaster"],
    },

    // SHADOWDANCER - Stealth & Mobility
    {
      effectTypes: ["utility", "buff"],
      id: "huntress_shadowstep",
      name: "Shadowstep",
      description:
        "Teleport through shadows to a nearby location, gaining advantage on your next attack.",
      spellType: "ACTION",
      icon: "Utility/Phantom Dash",
      level: 1,
      specialization: "shadowblade",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "necrotic",
        icon: "Utility/Phantom Dash",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "teleport",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Step into shadows",
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "AUTOMATIC",

      effects: {
        utility: {
          teleport: {
            distance: 30,
            unit: "feet",
          },
          buff: {
            nextAttack: "advantage",
            duration: "1 attack",
          },
        },
      },

      specialMechanics: {
        shadowbladePassive: {
          description:
            "Shadowblade spec gains +2 Armor and advantage on Stealth for 1 round (Shadow Veil passive)",
          additionalEffect: "Can hide for 1 AP after Shadowstep",
        },
        lethalPrecision: {
          description:
            "Next attack after Shadowstep deals +2d6 damage (Lethal Precision passive)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["utility", "teleport", "mobility", "shadowblade"],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_shadow_strike",
      name: "Shadow Strike",
      description:
        "Strike from the shadows with devastating force, dealing massive damage to an unsuspecting target.",
      spellType: "ACTION",
      icon: "Poison/Poison Concoction",
      level: 3,
      specialization: "shadowblade",

      typeConfig: {
        secondaryElement: "slashing",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "necrotic",
        icon: "Poison/Poison Concoction",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 10,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Strike from stealth",
        classResource: { type: "quarry_marks", cost: 3 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "3d8",
        elementType: "slashing",
        damageTypes: ["direct"],
        scalingType: "none",
      },

      effects: {
        damage: {
          base: {
            formula: "3d8",
            type: "slashing",
            advantage: "if_stealthed",
          },
          bonus: {
            formula: "1d6",
            type: "necrotic",
            condition: "From stealth or after Shadowstep",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 3,
          generated: 2,
          description:
            "Costs 3 marks, generates 2 on hit (1 base + 1 for crit potential)",
        },
        stealthRequirement: {
          description:
            "Deals maximum damage when used from stealth or after Shadowstep",
          bonusDamage: "+1d6 from Lethal Precision passive",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["physical", "shadow", "damage", "stealth", "burst", "shadowblade"],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_phantom_blades",
      name: "Phantom Blades",
      description:
        "Create shadow copies of your glaive that strike multiple targets simultaneously.",
      spellType: "ACTION",
      icon: "Piercing/Night Dagger",
      level: 5,
      specialization: "shadowblade",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "necrotic",
        icon: "Piercing/Night Dagger",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "ranged",
        rangeDistance: 30,
        maxTargets: 4,
      },

      propagation: { type: "multi", maxTargets: 4 },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Umbra multiplicare!",
        somaticText: "Throw glaive while creating shadow copies",
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "necrotic",
        formula: "3d8",
        damageTypes: ["direct"],
        scalingType: "none",
      },

      effects: {
        damage: {
          multiTarget: {
            formula: "3d8",
            type: "necrotic",
            targets: 4,
            description: "Each phantom blade strikes a different target",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Ultimate ability - costs all 5 Quarry Marks",
        },
        shadowbladeUltimate: {
          description: "Shadowblade specialization ultimate ability",
          phantomBlades: "Creates 4 shadow copies that strike independently",
        },
        afterEffect: {
          description:
            "After using Phantom Blades, you can Shadowstep for 1 AP for free",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["shadow", "damage", "multi target", "ultimate", "shadowblade"],
    },

    // UNIVERSAL ABILITIES - All Huntresses
    {
      effectTypes: ["damage", "debuff"],
      id: "huntress_moonlit_strike",
      name: "Moonlit Strike",
      description:
        "Empower your Shadow Glaive with lunar energy, dealing enhanced damage and potentially blinding your target.",
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      level: 2,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "radiant",
        icon: "Arcane/Star Trail Path",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 10,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Luna fortis!",
        somaticText: "Glaive glows with moonlight",
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "radiant",
        formula: "2d6",
        damageTypes: ["direct"],
        scalingType: "none",
      },

      savingThrow: {
        ability: "constitution",
        dc: 14,
        onSave: "not_blinded",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 14,
        saveType: "constitution",
        saveOutcome: "negates",
        effects: [
          {
            id: "blinded",
            name: "Blinded",
            description:
              "Blinded creatures have disadvantage on attack rolls - cannot see, automatically fails sight-based checks",
            statusType: "blinded",
            level: "moderate",
            statPenalty: [
              { stat: "attack", value: -99, magnitudeType: "disadvantage" },
              { stat: "perception", value: -99, magnitudeType: "auto_fail" },
            ],
            mechanicsText:
              "Disadvantage on attack rolls, auto-fail sight-based checks",
          },
        ],
      },

      effects: {
        damage: {
          base: {
            formula: "2d6",
            type: "radiant",
          },
        },
        debuff: {
          type: "blinded",
          duration: 1,
          saveToNegate: true,
        },
      },

      savingThrowEffect: {
        onSuccess: "Takes full damage but not blinded",
        onFailure: "Takes full damage and is blinded for 1 round",
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: "Generate 1 Quarry Mark on hit",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["radiant", "damage", "debuff", "blind", "universal"],
    },

    {
      effectTypes: ["buff"],
      id: "huntress_evasion",
      name: "Evasion",
      description:
        "Use your agility to avoid incoming attacks, increasing your defenses.",
      spellType: "REACTION",
      icon: "Utility/Parry",
      level: 2,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "REACTION",
        trigger: "When you are targeted by an attack",
        school: "slashing",
        icon: "Utility/Parry",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 1,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Dodge and weave",
      },

      resolution: "AUTOMATIC",

      buffConfig: {
        effects: [
          {
            id: "gain_advantage_on_dexterity_saving_",
            name: "Gain advantage on Dexterity saving throws",
            description: "Gain advantage on Dexterity saving throws",
            mechanicsText: "Gain advantage on Dexterity saving throws",
          },
          {
            id: "gain_2_armor",
            name: "Gain +2 Armor",
            description: "Gain +2 Armor",
            mechanicsText: "Gain +2 Armor",
          },
          {
            id: "duration_until_start_of_your_next_t",
            name: "Duration: Until start of your next turn",
            description: "Duration: Until start of your next turn",
            mechanicsText: "Duration: Until start of your next turn",
          },
        ],
      },

      effects: {
        buff: {
          acBonus: 2,
          savingThrowAdvantage: "agility",
          duration: 1,
        },
      },

      specialMechanics: {
        reaction: {
          trigger: "When targeted by attack or required to make Dex save",
          timing: "Before attack roll or saving throw",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["buff", "defense", "reaction", "universal"],
    },

    {
      effectTypes: ["utility"],
      id: "huntress_mark_quarry",
      name: "Mark Quarry",
      description:
        "Focus your hunter's instinct on a target, marking them as your quarry.",
      spellType: "ACTION",
      icon: "Piercing/Targeted Strike",
      level: 1,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "piercing",
        icon: "Piercing/Targeted Strike",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
      },

      durationConfig: {
        durationType: "minutes",
        duration: 10,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Mark target as quarry",
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "AUTOMATIC",

      effects: {
        utility: {
          mark: {
            description: "Generate 1 Quarry Mark immediately",
            tracking: "You know the direction to marked target within 1 mile",
            duration: "10 minutes or until target dies",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: "Immediately gain 1 Quarry Mark",
        },
        tracking: {
          description: "You can sense the marked target's direction",
          range: "1 mile",
          duration: "10 minutes",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["utility", "mark", "tracking", "universal"],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_swift_assault",
      name: "Swift Assault",
      description:
        "Perform a rapid series of glaive strikes against multiple nearby enemies.",
      spellType: "ACTION",
      icon: "Slashing/Sword Strike",
      level: 3,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Slashing/Sword Strike",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "melee",
        rangeDistance: 10,
        maxTargets: 3,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Rapid spinning strikes",
        classResource: { type: "quarry_marks", cost: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d8",
        elementType: "slashing",
        damageTypes: ["direct"],
        scalingType: "none",
      },

      effects: {
        damage: {
          multiTarget: {
            formula: "1d8",
            type: "slashing",
            targets: 3,
          },
        },
        conditionalBuff: {
          condition: "If all 3 attacks hit",
          effect: "+1 Armor until start of next turn",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 1,
          generated: 3,
          description: "Costs 1 mark, generates up to 3 marks (1 per hit)",
        },
        conditionalBonus: {
          description:
            "If all attacks hit, gain +1 Armor until start of next turn",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["physical", "damage", "multi target", "universal"],
    },

    // ===== ADDITIONAL SPELLS TO REACH 3 PER LEVEL =====

    // LEVEL 2 (needs 1 more)
    {
      effectTypes: ["buff"],
      id: "huntress_hunters_mark",
      name: "Hunter's Mark",
      description:
        "Mark a target, making it easier for you and your companion to hunt.",
      spellType: "ACTION",
      icon: "Piercing/Focused Arrow Shot",
      level: 2,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "piercing",
        icon: "Piercing/Focused Arrow Shot",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 1 },
      },

      resolution: "DICE",

      effects: {
        buff: {
          description: "Bonus damage on attacks against marked target",
          damageFormula: "+1d6",
          duration: 3,
          durationUnit: "rounds",
        },
      },

      specialMechanics: {
        concentration: {
          required: true,
          description:
            "Requires concentration. Maintaining the mark on a new target ends the effect on the previous target.",
        },
        quarryMarks: {
          cost: 1,
          generated: 1,
          perHit: true,
          description:
            "Costs 1 QM to cast. Attacks against marked target generate +1 additional Quarry Mark (capped by per-turn limit)",
        },
        companionSynergy: {
          description: "Companion deals bonus damage to marked target",
          damageFormula: "+1d6",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["buff", "mark", "companion synergy", "universal"],
    },

    // LEVEL 4 (needs 3)
    {
      effectTypes: ["damage"],
      id: "huntress_shadow_assault",
      name: "Shadow Assault",
      description: "Dash to a target and strike with overwhelming force.",
      spellType: "ACTION",
      icon: "Utility/Phantom Dash",
      level: 4,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Utility/Phantom Dash",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["somatic"],
        classResource: { type: "quarry_marks", cost: 2 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "slashing",
        formula: "3d8 + agility",
        damageTypes: ["direct"],
      },

      effects: {
        movement: {
          description: "Teleport to target before attacking",
          distance: 40,
        },
        damage: {
          formula: "3d8 + agility",
          type: "slashing",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 2,
          description:
            "Costs 2 Quarry Marks. Generates 2 Quarry Marks on hit (subject to per-turn cap)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["physical", "damage", "mobility", "universal"],
    },

    {
      effectTypes: ["buff"],
      id: "huntress_feral_bond",
      name: "Feral Bond",
      description:
        "Strengthen your bond with your companion, enhancing both of your combat abilities.",
      spellType: "ACTION",
      icon: "Nature/Spawn",
      level: 4,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Nature/Spawn",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 4,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["verbal"],
        classResource: { type: "quarry_marks", cost: 2 },
      },

      resolution: "DICE",

      effects: {
        buff: {
          self: {
            description: "+2 to attack rolls and damage",
            duration: 4,
            durationUnit: "rounds",
          },
          companion: {
            description: "+2 to attack rolls and +1d6 damage",
            duration: 4,
            durationUnit: "rounds",
          },
        },
      },

      specialMechanics: {
        companionSynergy: {
          description:
            "Companion gains an additional reaction attack per round when you are attacked (does not stack with Beast Fury)",
        },
        quarryMarks: {
          costReduction: true,
          description:
            "Quarry Mark abilities cost -1 QM while bonded (minimum 0)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["buff", "companion synergy", "enhancement", "universal"],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_glaive_dance",
      name: "Glaive Dance",
      description:
        "Spin through enemies in a deadly dance, striking all in your path.",
      spellType: "ACTION",
      icon: "Slashing/Dual Blades",
      level: 4,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Slashing/Dual Blades",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self",
        areaType: "circle",
        areaSize: 15,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 15 },
        actionPoints: 2,
        components: ["somatic"],
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "slashing",
        formula: "3d10 + agility",
        damageTypes: ["direct"],
      },

      effects: {
        damage: {
          formula: "3d10 + agility",
          type: "slashing",
          aoe: "All enemies within 15 feet",
        },
        movement: {
          description:
            "Can move up to 15 feet during the dance without provoking opportunity attacks",
        },
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          perHit: true,
          description: "Generate 1 Quarry Mark per enemy hit",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["physical", "damage", "aoe", "mobility", "universal"],
    },

    // LEVEL 6 (needs 3)
    {
      effectTypes: ["buff"],
      id: "huntress_apex_predator",
      name: "Apex Predator",
      description:
        "Transform into the ultimate hunter, enhancing all your abilities.",
      spellType: "ACTION",
      icon: "Nature/Cat Face",
      level: 6,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Nature/Cat Face",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 3 },
      },

      resolution: "DICE",

      effects: {
        buff: {
          description:
            "+3 to all attack rolls, +10 movement speed, advantage on Agility saves, and bonus damage on all attacks for 5 rounds",
          damageFormula: "+3d6",
        },
      },

      specialMechanics: {
        quarryMarks: {
          generation: "double",
          description: "Generate double Quarry Marks from all sources",
        },
        companionSynergy: {
          description: "Companion gains same bonuses",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["buff", "transformation", "companion synergy", "universal"],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_death_from_above",
      name: "Death From Above",
      description:
        "Leap high into the air and crash down on enemies with devastating force.",
      spellType: "ACTION",
      icon: "Nature/Cat Face",
      level: 6,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "bludgeoning",
        icon: "Nature/Cat Face",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 50,
        areaType: "circle",
        areaSize: 20,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["somatic"],
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "6d10 + agility * 1.5",
        elementType: "bludgeoning",
        damageTypes: ["area"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 16,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
        criticalConfig: {
          critType: "effect",
          critEffects: ["knockdown"],
        },
      },

      specialMechanics: {
        quarryMarks: {
          generated: 3,
          description: "Generate 3 Quarry Marks on successful hit",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["physical", "damage", "control", "aoe", "mobility", "universal"],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_pack_assault",
      name: "Pack Assault",
      description: "Coordinate a devastating assault with your companion.",
      spellType: "ACTION",
      icon: "Nature/Wolf Dash",
      level: 6,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Nature/Wolf Dash",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 3 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "slashing",
        formula: "5d6 + agility",
        damageTypes: ["direct"],
      },

      effects: {
        damage: {
          huntress: {
            formula: "5d6 + agility",
            type: "slashing",
          },
          companion: {
            formula: "3d6 + companion_attack",
            type: "piercing",
            description: "Companion attacks immediately with advantage",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 3,
          description: "Costs 3 Quarry Marks to use",
        },
        companionSynergy: {
          description: "Companion attacks with advantage and deals +3d6 damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: [
        "physical",
        "damage",
        "companion synergy",
        "coordinated",
        "universal",
      ],
    },

    // LEVEL 7 (needs 3)
    {
      effectTypes: ["buff"],
      id: "huntress_shadow_glaive_mastery",
      name: "Shadow Glaive Mastery",
      description:
        "Master the Shadow Glaive, unlocking its full devastating potential.",
      spellType: "ACTION",
      icon: "Poison/Poison Concoction",
      level: 7,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Poison/Poison Concoction",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 25 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 3 },
      },

      resolution: "DICE",

      effects: {
        buff: {
          description:
            "All glaive attacks chain to +2 additional targets, chain damage does not reduce, and all glaive attacks deal +50% damage for 5 rounds",
        },
      },

      specialMechanics: {
        quarryMarks: {
          generation: "enhanced",
          description: "Generate +1 additional Quarry Mark per target hit",
        },
        glassiveSynergy: {
          description:
            "Glaive chains ignore distance restrictions (chains to all enemies within 30 feet)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["buff", "enhancement", "glaive", "chain", "universal"],
    },

    {
      effectTypes: ["control", "damage"],
      id: "huntress_savage_roar",
      name: "Savage Roar",
      description:
        "Your companion unleashes a terrifying roar that frightens all enemies.",
      spellType: "ACTION",
      icon: "Nature/Roar",
      level: 7,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "piercing",
        icon: "Nature/Roar",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        areaType: "circle",
        areaSize: 30,
        origin: "companion",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 1,
        components: ["verbal"],
        classResource: { type: "quarry_marks", cost: 2 },
      },

      resolution: "DICE",

      effects: {
        control: {
          description:
            "All enemies within 30 feet of companion must make DC 17 Spirit save or be frightened for 3 rounds",
          save: "DC 17 Spirit",
          saveEffect: "negates",
          duration: 3,
          durationUnit: "rounds",
        },
        damage: {
          description:
            "Frightened enemies take psychic damage at the start of their turns",
          damageFormula: "3d8",
        },
      },

      specialMechanics: {
        companionSynergy: {
          description: "Companion must be alive and within 100 feet",
        },
        quarryMarks: {
          cost: 2,
          description: "Costs 2 Quarry Marks to use",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["control", "fear", "companion synergy", "aoe", "universal"],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_hunters_fury",
      name: "Hunter's Fury",
      description:
        "Channel all your fury into a devastating flurry of glaive strikes.",
      spellType: "ACTION",
      icon: "Slashing/Whirl",
      level: 7,
      specialization: "universal",

      typeConfig: {
        castTime: 2,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Slashing/Whirl",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 3,
        components: ["somatic"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "12d8 + agility * 2",
        elementType: "slashing",
        damageTypes: ["direct"],
        criticalConfig: {
          critType: "effect",
          critEffects: ["rapid_strikes_crit"],
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Costs 5 Quarry Marks (maximum) to use",
        },
        criticalHit: {
          description:
            "Each strike that rolls max damage counts as a critical hit",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["physical", "damage", "single target", "burst", "universal"],
    },

    // LEVEL 8 (needs 3)
    {
      effectTypes: ["damage"],
      id: "huntress_shadow_storm",
      name: "Shadow Storm",
      description:
        "Create a storm of shadow energy that devastates all enemies.",
      spellType: "ACTION",
      icon: "Psychic/Mind Strike",
      level: 8,
      specialization: "universal",

      typeConfig: {
        castTime: 3,
        castTimeType: "IMMEDIATE",
        school: "necrotic",
        icon: "Psychic/Mind Strike",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        areaType: "circle",
        areaSize: 50,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 4,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 4 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "necrotic",
        formula: "10d10 + agility",
        damageTypes: ["direct"],
        dot: {
          formula: "3d10",
          duration: 4,
          tickFrequency: "round",
        },
      },

      effects: {
        damage: {
          initial: {
            formula: "10d10 + agility",
            type: "necrotic",
          },
          dot: {
            formula: "3d10 shadow per round",
            duration: 4,
            durationUnit: "rounds",
          },
        },
        zone: {
          description:
            "Storm persists for 4 rounds, dealing 3d10 shadow damage per round to enemies in the area",
          damageFormula: "3d10",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 4,
          description: "Costs 4 Quarry Marks to use",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["shadow", "damage", "aoe", "dot", "zone", "universal"],
    },

    {
      effectTypes: ["buff", "transformation"],
      id: "huntress_primal_fusion",
      name: "Primal Fusion",
      description:
        "Merge your essence with your companion, becoming one unstoppable force.",
      spellType: "ACTION",
      icon: "Nature/Claw Marks",
      level: 8,
      specialization: "universal",

      typeConfig: {
        castTime: 2,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Nature/Claw Marks",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 4 },
      },

      resolution: "DICE",

      effects: {
        transformation: {
          description:
            "Merge with companion, gaining +5 to all stats, +30 HP, and both your attacks combined",
        },
        buff: {
          description:
            "+5 to all stats, +30 maximum HP, regenerate HP per round, and can attack twice per turn for 5 rounds",
          healingFormula: "5d10",
        },
      },

      specialMechanics: {
        companionSynergy: {
          description:
            "Companion merges with you - cannot be targeted separately",
        },
        quarryMarks: {
          generation: "triple",
          description: "Generate triple Quarry Marks from all sources",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: [
        "transformation",
        "buff",
        "companion synergy",
        "merge",
        "universal",
      ],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_glaive_storm",
      name: "Glaive Storm",
      description:
        "Summon a storm of shadow glaives that strike all enemies repeatedly.",
      spellType: "CHANNELED",
      icon: "Piercing/Dagger Rain",
      level: 8,
      specialization: "universal",

      typeConfig: {
        maxChannelDuration: 5,
        durationUnit: "ROUNDS",
        interruptible: true,
        movementAllowed: false,
        concentrationDC: 15,
        dcType: "CONSTITUTION",
        tickFrequency: "END_OF_TURN",
        school: "slashing",
        icon: "Piercing/Dagger Rain",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        areaType: "circle",
        areaSize: 40,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", gain: 2 },
        channelingFrequency: "per_round",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "8d8 + agility",
        elementType: "slashing",
        damageTypes: ["area"],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "8d8 + agility",
          duration: 5,
          tickFrequency: "round",
          isProgressiveDot: false,
        },
        criticalConfig: {
          critType: "effect",
          critEffects: ["glaive_storm_crit"],
        },
      },

      specialMechanics: {
        channeling: {
          description:
            "Must maintain concentration. Deals damage at end of each of your turns.",
        },
        quarryMarks: {
          generated: 2,
          perRound: true,
          description: "Generate 2 Quarry Marks per round channeled",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["physical", "damage", "aoe", "channeled", "dot", "universal"],
    },

    // LEVEL 9 (needs 3)
    {
      effectTypes: ["buff", "transformation"],
      id: "huntress_ultimate_hunter",
      name: "Ultimate Hunter",
      description:
        "Become the ultimate hunter, transcending mortal limitations.",
      spellType: "ACTION",
      icon: "Nature/Roaring Bear",
      level: 9,
      specialization: "universal",

      typeConfig: {
        castTime: 3,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Nature/Roaring Bear",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 10,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      effects: {
        transformation: {
          description:
            "+3 to attack and damage rolls, double QM generation, companion shares all bonuses. Duration: 5 rounds.",
        },
      },

      specialMechanics: {
        quarryMarks: {
          generation: "double",
          description: "Generate double Quarry Marks from all sources",
        },
        companionSynergy: {
          description:
            "Companion gains same bonuses and cannot be killed while active",
        },
        glaiveMastery: {
          description: "Glaive chains to +2 additional targets",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: [
        "transformation",
        "buff",
        "legendary",
        "companion synergy",
        "universal",
      ],
    },

    {
      effectTypes: ["damage"],
      id: "huntress_deaths_embrace",
      name: "Death's Embrace",
      description:
        "Channel the essence of death through your glaive, instantly killing weak enemies.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Death",
      level: 9,
      specialization: "universal",

      typeConfig: {
        castTime: 2,
        castTimeType: "IMMEDIATE",
        school: "necrotic",
        icon: "Necrotic/Necrotic Death",
      },

      targetingConfig: {
        targetingType: "chain",
        rangeType: "ranged",
        rangeDistance: 60,
        chainDistance: 10,
        maxChains: 5,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "necrotic",
        formula: "10d6 + agility",
        damageTypes: ["direct"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 18,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
      },

      effects: {
        damage: {
          formula: "10d6 + agility",
          type: "necrotic",
          save: "DC 18 Constitution for half damage",
          chain: "Chains to up to 5 enemies",
        },
        execute: {
          description:
            "Enemies below 20% HP that fail the save are instantly killed",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Costs 5 Quarry Marks to use",
        },
        execute: {
          description:
            "Enemies below 20% health are instantly killed on failed save",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["shadow", "damage", "execute", "chain", "legendary", "universal"],
    },

    {
      effectTypes: ["buff", "passive"],
      id: "huntress_eternal_hunt",
      name: "Eternal Hunt",
      description:
        "Begin an eternal hunt that never ends until your quarry falls.",
      spellType: "PASSIVE",
      icon: "Piercing/Targeted Strike",
      level: 9,
      specialization: "universal",

      typeConfig: {
        toggleable: true,
        school: "piercing",
        icon: "Piercing/Targeted Strike",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "permanent",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 },
        actionPoints: 0,
        components: ["ritual"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      effects: {
        passive: {
          description:
            "Generate 1 Quarry Mark per round automatically (subject to per-turn cap). Companion auto-revives after 1 round if killed. Glaive chains to +2 additional targets. Requires 1 QM per round to maintain or the effect ends.",
        },
      },

      specialMechanics: {
        quarryMarks: {
          maintenanceCost: 1,
          automaticGeneration: 1,
          description:
            "Automatically generate 1 Quarry Mark per round. Costs 1 QM per round to sustain the passive — if you cannot pay, the effect ends and must be reactivated with 5 QM.",
        },
        companionSynergy: {
          description:
            "Companion automatically revives after 1 round if killed",
        },
        glaiveMastery: {
          description: "Glaive chains to +2 additional targets",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: [
        "passive",
        "legendary",
        "companion synergy",
        "enhancement",
        "universal",
        "toggleable",
      ],
    },

    // LEVEL 10 (needs 3)
    {
      effectTypes: ["damage"],
      id: "huntress_godslayer",
      name: "Godslayer",
      description: "Strike with enough force to slay even gods.",
      spellType: "ACTION",
      icon: "Slashing/Sword Strike",
      level: 10,
      specialization: "universal",

      typeConfig: {
        castTime: 5,
        castTimeType: "IMMEDIATE",
        school: "force",
        icon: "Slashing/Sword Strike",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "force",
        formula: "12d6 + agility * 1.5",
        damageTypes: ["direct"],
      },

      effects: {
        damage: {
          formula: "12d6 + agility * 1.5",
          type: "force",
          description:
            "Deals 12d6 + agility × 1.5 force damage that ignores resistances",
        },
        execute: {
          description:
            "If target HP drops below 25% after this attack, target is instantly killed",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Costs 5 Quarry Marks to use",
        },
        ignoresDefenses: {
          description:
            "Ignores resistances (not immunities). Cannot be partially reduced.",
        },
        execute: {
          threshold: 0.25,
          description:
            "Instantly kills target if their remaining HP is below 25% of maximum",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: [
        "physical",
        "damage",
        "execute",
        "legendary",
        "single target",
        "universal",
      ],
    },

    {
      effectTypes: ["damage", "summon"],
      id: "huntress_primal_apocalypse",
      name: "Primal Apocalypse",
      description:
        "Summon the primal fury of nature itself to devastate the battlefield.",
      spellType: "ACTION",
      icon: "Nature/Earth Shatter",
      level: 10,
      specialization: "universal",

      typeConfig: {
        castTime: 5,
        castTimeType: "IMMEDIATE",
        school: "slashing",
        icon: "Nature/Earth Shatter",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        areaType: "circle",
        areaSize: 100,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 38 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "slashing",
        formula: "12d6 + agility",
        damageTypes: ["area"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 18,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
        dot: {
          formula: "3d6",
          duration: 3,
          tickFrequency: "round",
        },
      },

      effects: {
        damage: {
          initial: {
            formula: "12d6 + agility",
            type: "nature",
            save: "DC 18 Constitution for half",
          },
          dot: {
            formula: "3d6 nature per round",
            duration: 3,
            durationUnit: "rounds",
          },
        },
        summon: {
          description:
            "Summons 3 primal beasts that attack enemies for 3 rounds",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Costs 5 Quarry Marks to use",
        },
        summons: {
          description:
            "Summons 3 primal beast spirits (50 HP, 15 armor each) that attack autonomously",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: [
        "nature",
        "damage",
        "aoe",
        "summoning",
        "legendary",
        "dot",
        "universal",
      ],
    },

    {
      effectTypes: ["buff", "passive"],
      id: "huntress_perfect_hunt",
      name: "Perfect Hunt",
      description: "Achieve the perfect hunt — mastery beyond mortal limits.",
      spellType: "PASSIVE",
      icon: "Piercing/On the Mark",
      level: 10,
      specialization: "universal",

      typeConfig: {
        toggleable: true,
        school: "piercing",
        icon: "Piercing/On the Mark",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "permanent",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 38 },
        actionPoints: 0,
        components: ["ritual"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      effects: {
        passive: {
          description:
            "All Quarry Mark abilities cost 1 less QM (minimum 0). Attacks deal +1d8 damage. Companion auto-revives after 1 round. Glaive chains to +3 additional targets. Requires 1 QM per round to maintain or the effect ends.",
        },
      },

      specialMechanics: {
        quarryMarks: {
          maintenanceCost: 1,
          costReduction: 1,
          description:
            "All QM abilities cost 1 less (min 0). Costs 1 QM per round to sustain — if you cannot pay, the effect ends and must be reactivated with 5 QM.",
        },
        companionSynergy: {
          description: "Companion auto-revives after 1 round if killed",
        },
        glaiveMastery: {
          description: "Glaive chains to +3 additional targets",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: [
        "passive",
        "legendary",
        "ascension",
        "companion synergy",
        "universal",
        "toggleable",
      ],
    },
  ],
};
