/**
 * Deathcaller Class Data
 *
 * Complete class information for the Deathcaller - a dark necromancer
 * who harnesses forbidden blood magic and Necrotic Ascension paths.
 */

export const DEATHCALLER_DATA = {
  id: "deathcaller",
  name: "Deathcaller",
  icon: "Necrotic/Necrotic Skull",
  role: "Damage/Support",
  damageTypes: ["necrotic", "psychic"],

  // Overview section
  overview: {
    title: "The Deathcaller",
    subtitle: "Master of Forbidden Blood Magic",

    quickOverview: {
      title: "Quick Overview",
      content: `*You cut your palm and the blood ignites. Your vision darkens, your veins turn black, and the air fills with the scent of copper and rot. This is what you signed up for.*

**The Deathcaller** pays for power in flesh. Every spell costs mana AND health — roll the dice, watch the HP drain, and feel the dark power surge through you. That sacrifice generates **Blood Tokens** (crimson orbs orbiting you) that supercharge your next spell... but if you don't spend them fast enough, they explode in your face.

**Core Loop**: Sacrifice HP → Cast Spell → Generate Blood Tokens → Spend tokens for massive damage (or let them burst and hurt you)

**Ascension Paths** (optional, permanent): Seven dark bargains you can activate as you level, each granting immense power at a permanent cost. The first — Shrouded Veil — adds +2d6 to every spell but cuts your max HP by 10%. Activate none, some, or all. Each one is forever.

**Resources**: Health (primary fuel), Mana (secondary), Blood Tokens (0-20, temporary, ticking time bombs), Ascension Paths (7 sequential, permanent)

**Best For**: Players who enjoy risk-reward mechanics, managing health as a resource, and making permanent character-altering decisions`,
    },

    description: `The Deathcaller harnesses the dark and forbidden power of Necrotic Ascension. Through blood sacrifice and spectral manipulation, they wield devastating necrotic magic at a terrible cost. Each Ascension Path unlocks immense power but inflicts severe consequences, representing the ultimate price of necromantic mastery. These paths are a last resort, reflecting the dire and desperate measures taken by those who dare to command death itself.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Deathcallers are individuals who have crossed the threshold between life and death, embracing forbidden knowledge that most would flee from. They are not merely necromancers—they are blood mages who understand that true power requires sacrifice. Every spell they cast is a transaction with death itself.

**Philosophy**: Power demands sacrifice. The Deathcaller believes that strength comes from willingness to pay the ultimate price—their own vitality. They see death not as an end, but as a resource to be harvested and wielded.

**Personality Archetypes**:
- **The Desperate Survivor**: Turned to dark magic out of necessity, haunted by what they've become
- **The Ambitious Scholar**: Seeks forbidden knowledge regardless of cost, driven by curiosity
- **The Vengeful Wraith**: Uses blood magic to exact revenge, consumed by hatred
- **The Pragmatic Realist**: Views necromancy as a tool, no different from any other magic

**Social Dynamics**: Deathcallers are often feared and shunned. Their very presence reminds others of mortality. They must decide whether to hide their nature or embrace the terror they inspire.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: Damage dealer with support capabilities through spectral summons

**Damage Profile**:
- Sustained necrotic damage through health sacrifice
- Burst damage via Blood Token consumption
- Area denial through auras and spectral allies

**Support Capabilities**:
- Spectral summons that tank damage
- Life Link to protect allies
- Debuffs that cripple enemy effectiveness

**Survivability**: Paradoxically fragile yet resilient—Deathcallers sacrifice their own health but can drain it back from enemies. They walk a razor's edge between power and death.`,
    },

    playstyle: {
      title: "Playstyle",
      content: `**Core Mechanic**: Health as a resource. Every powerful spell requires blood sacrifice, creating a high-risk, high-reward playstyle.

**Decision Points**:
- When to activate Ascension Paths (permanent consequences)
- How much health to sacrifice for power
- When to drain life back vs. dealing maximum damage
- Which spectral allies to summon and when

**Skill Expression**:
- Managing health pool as a resource
- Timing Blood Token usage before they burst
- Positioning to maximize aura effects
- Balancing aggression with self-preservation

**Team Dynamics**:
- Requires healers to offset self-damage
- Benefits from tanks who can protect while vulnerable
- Synergizes with crowd control to safely drain life
- Can protect allies through Life Link and spectral summons`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Price of Power",
      content: `**The Setup**: Your party faces a powerful undead knight and three skeletal archers. You're a Deathcaller with 3 Ascension Paths active (Shrouded Veil, Crimson Pact, Spectral Command). You have 60/72 HP, 40/50 mana, and 0 Blood Tokens.

**Active Ascension Paths**:
- **Shrouded Veil**: +2d6 necrotic damage to all spells, advantage on Stealth, -10% max HP (max HP is 72, not 80)
- **Crimson Pact**: Blood Tokens last 15 min (not 10), each token adds +1d6 damage (instead of +1d4)
- **Spectral Command**: Spectral allies deal +1d6 necrotic damage, specters drain 1d4 HP/turn from you each

**Starting State**: HP: 60/72 | Mana: 40/50 | Blood Tokens: 0 | Specters: 0

**Turn 1 - Blood Sacrifice (HP: 60 → 52, Tokens: 0 → 8)**

*The undead knight charges. You raise your hand, and dark energy crackles around your fingers. This will hurt.*

**Action**: Cast "Necrotic Bolt" (4 mana, costs 1d6 HP)
**Health Cost Roll**: 1d6 → [4] = 4 HP sacrificed
**Blood Tokens**: +4 (now at 4 tokens)
**HP**: 60 - 4 = 56 HP

*You feel your life force drain into the spell. Four Blood Tokens materialize around you, pulsing with crimson energy.*

**Spell Damage**: 3d8 (base) + 2d6 (Shrouded Veil) → [7, 6, 5] + [5, 4] = 27 necrotic damage

*The bolt strikes the undead knight, necrotic energy searing its armor.*

**Action (1 AP)**: Summon Spectral Allies (10 mana, costs 1d4 HP)
**Health Cost Roll**: 1d4 → [3] = 3 HP sacrificed
**Blood Tokens**: +3 (now at 7 tokens)
**HP**: 56 - 3 = 53 HP
**Mana**: 40 - 4 - 10 = 26 mana

*Two ghostly specters rise from the ground (Spectral Command boon). They hover beside you, cold and hungry.*

**Specters Summoned**: 2 (they will drain 1d4 HP from you each turn)

**End of Turn Drain**: Specters drain life
**Drain Roll**: 1d4 + 1d4 → [2] + [3] = 5 HP drained
**HP**: 53 - 5 = 48 HP

*The specters feed on your life force. You feel weaker, but they grow stronger.*

**Current State**: HP: 48/72 | Mana: 26/50 | Blood Tokens: 7 | Specters: 2

**Turn 2 - Blood Token Burst Damage (HP: 48 → 42, Tokens: 7 → 0)**

*The undead knight is wounded but still dangerous. The skeletal archers are firing at your tank. You have 7 Blood Tokens—time to unleash them.*

**Action**: Cast "Death's Embrace" (10 mana, costs 2d8 HP, AoE necrotic damage)
**Health Cost Roll**: 2d8 → [6, 5] = 11 HP sacrificed
**Blood Tokens**: +11 (now at 18 tokens)
**HP**: 48 - 11 = 37 HP
**Mana**: 26 - 10 = 16 mana

*You scream, and blood pours from your hands. Eighteen Blood Tokens swirl around you, a crimson storm.*

**Decision**: Spend ALL 18 Blood Tokens to enhance the spell (+18d6 necrotic damage!)

**Spell Damage**: 4d6 (base) + 2d6 (Shrouded Veil) + **18d6 (Blood Tokens)** → [8, 9, 7, 6] + [5, 4] + [6, 5, 4, 6, 5, 3, 4, 5, 6, 4, 3, 5, 6, 4, 5, 3, 4, 5] = 30 + 9 + 81 = **120 necrotic damage to ALL enemies!**

*The explosion of necrotic energy obliterates the skeletal archers instantly. The undead knight staggers, its armor cracking.*

**Results**:
- Skeletal Archers: DEAD (overkilled)
- Undead Knight: 150 HP - 120 = 30 HP remaining

**Blood Tokens**: 18 - 18 = 0 (all spent)

**End of Turn Drain**: Specters drain life
**Drain Roll**: 1d4 + 1d4 → [3] + [2] = 5 HP drained
**HP**: 37 - 5 = 32 HP

*You're at 32/72 HP. You've sacrificed nearly half your health, but the battlefield is yours.*

**Current State**: HP: 32/72 | Mana: 16/50 | Blood Tokens: 0 | Specters: 2

**Turn 3 - Life Drain Recovery (HP: 32 → 45)**

*You're dangerously low on health. The undead knight is nearly dead. Time to drain life back.*

**Action**: Cast "Life Leech" (14 mana, costs 2d6 HP, drains HP from enemy)
**Health Cost Roll**: 2d6 → [2] = 2 HP sacrificed
**Blood Tokens**: +2 (now at 2 tokens)
**HP**: 32 - 2 = 30 HP
**Mana**: 16 - 14 = 2 mana

**Spell Effect**: Drain 5d6 HP from undead knight
**Drain Roll**: 5d6 → [7, 6, 8, 5, 4] = 30 HP drained
**Undead Knight**: 30 - 30 = DEAD
**Your HP**: 30 + 30 = 60 HP (healed!)

*The undead knight's life force flows into you. You feel strength returning.*

**End of Turn Drain**: Specters drain life
**Drain Roll**: 1d4 + 1d4 → [4] + [1] = 5 HP drained
**HP**: 60 - 5 = 55 HP

**Current State**: HP: 55/72 | Mana: 2/50 | Blood Tokens: 2 | Specters: 2

**Turn 4 - Mopping Up (HP: 55 → 50)**

*The undead knight is dead. The specters finish off the remaining skeletal archers.*

**Specters' Turn**: Both attack skeletal archers

**Blood Token Burst**: You have 2 Blood Tokens unused. They've been active for 3 turns (not 10 minutes yet), so they don't burst.

**End of Combat Drain**: Specters dissipate (no more drain)

**Final State**: HP: 55/72 | Mana: 2/50 | Blood Tokens: 2 (will burst in 7 minutes if not used)

**Post-Combat**:
*You stand among the corpses, blood dripping from your hands. The battle is over. Your specters fade, their hunger sated.*

**The 2 Blood Tokens pulse around you. In 7 minutes, they'll burst for 2d10 damage if you don't use them. You'll need to cast another spell soon, or suffer the consequences.**

**The Lesson**: Deathcaller gameplay is about:
1. **Health as Resource**: You sacrificed 20 HP across 4 spells—health is your primary resource
2. **Blood Token Management**: Generated 18 tokens, spent all 18 for MASSIVE damage (120 total)
3. **Burst Timing**: Blood Tokens burst after 10 minutes (15 with Crimson Pact)—use them or lose HP
4. **Life Drain Recovery**: Life Leech healed 21 HP, offsetting self-damage
5. **Ascension Costs**: Specters drained 15 HP total (Spectral Command curse)
6. **Risk-Reward**: You dealt 147 damage total (27 + 120) but sacrificed significant health

You're not a mage who casts spells with mana—you're a BLOOD MAGE who pays in life itself. Every spell is a gamble. Every Blood Token is a ticking time bomb. Master the balance, or die trying.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Necrotic Ascension",
    subtitle: "Seven Paths of Dark Power",

    description: `The Deathcaller is a blood sacrifice engine. You pay for forbidden power in flesh, using your own Health as the primary fuel for every spell. This sacrifice generates Blood Tokens—crimson orbs of stored agony that you can unleash for massive damage, or risk them exploding in a lethal burst if the hunt goes on too long.`,

    cards: [
      {
        title: "Health Fuel",
        stats: "HP as Mana",
        details:
          "Every spell costs both Mana and a dice roll of HP. Your life bar is your battery; spend it to gain power, drain it back to survive.",
      },
      {
        title: "Blood Tokens (0-20+)",
        stats: "1 Token per 1 HP Lost",
        details:
          "Sacrificing HP generates tokens. Spend them for +1d6 damage per token. If not spent within 10-15 mins, they burst for 1d10 self-damage each.",
      },
      {
        title: "Necrotic Ascension",
        stats: "7 Permanent Paths",
        details:
          "Sequential upgrades that grant massive boons but permanent, stacking curses. Once a path is activated, it can never be reversed.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Change", "Notes"],
      rows: [
        [
          "Sacrifice HP (Spell Cost)",
          "+1 Token per 1 HP",
          "Generated automatically on every cast",
        ],
        [
          "Spend for Power",
          "-Variable Tokens",
          "Adds +1d6 Necrotic damage per token spent",
        ],
        [
          "Burst (Timer Expires)",
          "Reset to 0",
          "⚠️ Take 1d10 damage per token!",
        ],
        [
          "Life Leech / Drain",
          "Restore HP",
          "Essential for offsetting the cost of power",
        ],
      ],
    },

    usage: {
      momentum:
        'Spend tokens to add +1d6 damage each to any spell. You must pay the "Blood Price" (HP) first to generate them, creating a building momentum of lethality.',
      flourish:
        "⚠️ The Ticking Bomb: Tokens burst after 10 minutes (15 with Crimson Pact). If you hoard 20 tokens and the timer hits zero, you take 20d10 damage instantly.",
    },

    overheatRules: {
      title: "Permanent Ascension",
      content: `Unlike other classes, the Deathcaller has no "Overheat" to recover from. Instead, you face the **Sequential Descent**.

**The Price of Power**:
- **Bargains**: You can activate any of your 7 unlocked Ascension Paths at any time.
- **The Catch**: These are permanent character changes. You cannot "deactivate" a curse once the boon is accepted.
- **Cumulative Curses**: Penalties like -10% Max HP, fire vulnerability, and perception loss stack.

**Strategy**: High-level Deathcallers often stop at Path 3 or 4 to maintain survivability, only descending into the Deep Void (Path 7) when they are ready to become a glass cannon of pure necrotic devastation.`,
    },

    ascensionPathsTable: {
      title: "Necrotic Ascension Paths",
      headers: ["Path", "Boon", "Curse", "Unlock Level"],
      rows: [
        [
          "Shrouded Veil",
          "+2d6 necrotic damage to all spells + advantage on Stealth",
          "-10% max HP (perpetual shadow drain)",
          "1",
        ],
        [
          "Crimson Pact",
          "Blood Tokens last 15 min (not 10), each token adds +1d6 damage (instead of +1d4)",
          "Unused tokens burst after 10 min (1d10 per token)",
          "3",
        ],
        [
          "Spectral Command",
          "Spectral allies deal +1d6 necrotic damage",
          "Specters drain 1d4 HP from you per turn each",
          "5",
        ],
        [
          "Frostwalker",
          "Aura: 15ft radius, -10ft enemy speed, 1d4 frost/turn",
          "+50% fire damage taken (vulnerability)",
          "7",
        ],
        [
          "Silent Shroud",
          "Advantage on Stealth and silent movement",
          "-2 Perception (muffled senses)",
          "9",
        ],
        [
          "Life Leech",
          "Melee attacks restore 1d6 HP",
          "-5% max HP (unquenchable thirst)",
          "11",
        ],
        [
          "Deep Void",
          "1/long rest: Negate any spell targeting you",
          "2d6 psychic damage when used (void consumption)",
          "13",
        ],
      ],
    },

    bloodTokenTable: {
      title: "Blood Token Mechanics",
      headers: ["Mechanic", "Effect", "Notes"],
      rows: [
        [
          "Generation",
          "1 HP sacrificed = 1 Blood Token",
          "Blood Tokens are a core mechanic from level 1",
        ],
        [
          "Enhancement",
          "Spend tokens to add 1d6 necrotic damage per token",
          "Can spend multiple tokens on one spell",
        ],
        [
          "Burst Timer",
          "Tokens expire after 10 minutes",
          "Timer resets when new tokens are generated",
        ],
        [
          "Burst Damage",
          "1d10 necrotic damage per unused token",
          "Cannot be prevented or reduced",
        ],
        [
          "Maximum Tokens",
          "No hard limit, but risk increases",
          "Strategic decision: power vs. safety",
        ],
      ],
    },

    strategicConsiderations: {
      title: "The Razor's Edge: Risk & Recovery",
      content: `**Phase 1: The Sacrifice (0–10 Tokens)**: Early combat is about building your bank. Don't be afraid of the HP cost—every point lost is a point of potential burst damage later.

**Phase 2: The Crimson Storm (11–20 Tokens)**: You are at peak lethality. One well-placed 'Death's Embrace' can wipe a room, but a burst now would deal ~110 self-damage. Check your timer!

**Phase 3: Drain & Reset**: When your HP hits 30%, prioritize recovery. Use 'Life Leech' or 'Soul Rend' to steal back the vitality you spent. A smart Deathcaller ends the fight with more health than they started with.

**Advanced Tactic: The Intentional Burst**: If you have 1-2 tokens left and plenty of HP, you can let them burst to clear the timer before a long rest, though it is always better to spend them on a cantrip.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "Tracking the Forbidden",
      content: `Playing a Deathcaller at the table is all about managing the physical tension of the "Blood Bank" and the "Ticking Clock."

**Required Materials**:
- **A Bowl of Red Beads**: 20–30 red glass beads or tokens to represent Blood Tokens.
- **A Physical Timer**: An egg timer or a phone countdown set to 10:00.
- **Permanent Marker**: For your laminated Ascension Card.

**The Physical Hack (Friction Points)**:
- **The Ticking Clock**: The moment you generate your first Blood Token, start your 10-minute timer. If it dings, you must roll 1d10 for every bead in your bowl and take that damage. Reset it only when you generate *new* tokens.
- **The Ascension Card**: Keep a separate reference card with the 7 Paths. Once you activate one, check the box with a marker. It serves as a visual reminder of your permanent curses (like "Take +50% Fire Damage").
- **The Blood Price**: Use a purple or black d6 to track your HP sacrifice separately from enemy damage. It makes it easier to tell if you're dying to the boss or to your own hubris.

**Pro Tips**:
- Keep your "Life Leech" dice (white/green) ready. You'll be using them often to refill the "tank."
- **Slam the Beads**: When you spend 10 tokens for a massive strike, physically dump the 10 beads back into the supply bowl. The sound of the beads hitting the glass should emphasize the power of the strike.`,
    },
  },

  specializations: {
    title: "Specializations",
    subtitle: "Three Paths of Necromantic Mastery",

    specs: [
      {
        id: "blood-reaver",
        name: "Blood Reaver",
        icon: "Necrotic/Drain Soul",
        color: "#8B0000",
        theme: "Aggressive Life Drain",

        description: `Blood Reavers are aggressive necromancers who wade into battle, draining life from their enemies to fuel their dark magic. They embrace the Crimson Pact and Life Leech paths, becoming vampiric warriors who grow stronger as they consume their foes.`,

        playstyle:
          "Melee-range life drain, aggressive health sacrifice, high sustain through draining",

        strengths: [
          "Excellent sustain through life drain",
          "Can function as off-tank with proper support",
          "High burst damage through Blood Token consumption",
          "Strong in prolonged fights",
        ],

        weaknesses: [
          "Vulnerable to burst damage",
          "Requires melee range for optimal play",
          "Dependent on having enemies to drain",
          "Struggles against undead/constructs",
        ],

        passiveAbility: {
          name: "Sanguine Hunger",
          icon: "Necrotic/Drain Soul",
          description:
            "Your life drain effects are 25% more effective. Additionally, when you drop below 25% health, your next life drain spell is cast instantly and costs no mana.",
        },

        keyAbilities: [
          "Blood Leech - Drain health from a target, restoring 25% per HP sacrificed (8 mana, 1d4 HP cost)",
          "Crimson Shield - Absorb 10x damage sacrificed, converting damage taken into healing (5 mana, 1d10 HP cost)",
          "Eternal Agony - Inflict escalating psychic pain based on Health Sacrificed (15 mana, 1d10 HP cost)",
        ],
      },

      {
        id: "spectral-master",
        name: "Spectral Master",
        icon: "Necrotic/Arise",
        color: "#4B0082",
        theme: "Summoning and Control",

        description: `Spectral Masters command legions of undead servants, using corpses as resources to create powerful spectral allies. They excel at area control and sustained damage through their minions, though the energy required to maintain multiple summons severely limits their mobility.`,

        playstyle:
          "Summoner playstyle, area control, sustained damage through minions",

        strengths: [
          "Excellent area control with multiple summons",
          "Can tank damage through spectral allies",
          "Strong sustained damage output",
          "Effective in battles with corpses available",
        ],

        weaknesses: [
          "Severely reduced mobility with multiple summons",
          "Vulnerable without corpses to raise",
          "Summons require health sacrifice",
          "Weak in clean environments (no corpses)",
        ],

        passiveAbility: {
          name: "Spectral Dominion",
          icon: "Necrotic/Arise",
          description:
            "Your spectral allies have +25% health and deal additional necrotic damage equal to your proficiency modifier. Specter HP drain from Spectral Command is reduced by 1 per turn (minimum 0).",
          damageFormula: "1d4",
        },

        keyAbilities: [
          "Soul Chain - Summon spectral ally with HP equal to Health Sacrificed (0 mana, 2d8 HP cost)",
          "Dance of the Damned - Summon two skeletal archers dealing 2d6 each (0 mana, 3d6 HP cost)",
          "Spectral Vanguard - Summon a powerful spectral knight to protect allies (10 mana, 4d8 HP cost)",
        ],
      },

      {
        id: "void-caller",
        name: "Void Caller",
        icon: "Psychic/Mind Strike",
        color: "#1C1C1C",
        theme: "Psychic Devastation",

        description: `Void Callers peer into the abyss and channel its maddening power. They specialize in psychic damage and debuffs, breaking the minds of their enemies while embracing the Deep Void path. Their magic is the most destructive but also the most dangerous to wield.`,

        playstyle:
          "Ranged psychic damage, debuffs, high-risk ultimate abilities",

        strengths: [
          "Highest burst damage potential",
          "Powerful crowd control through fear/despair",
          "Can negate incoming spells with Deep Void",
          "Excellent against high-armor targets (psychic damage)",
        ],

        weaknesses: [
          "Extremely fragile",
          "Ultimate abilities have permanent HP costs",
          "Limited sustain options",
          "Psychic damage can be resisted by some enemies",
        ],

        passiveAbility: {
          name: "Void Touched",
          icon: "Psychic/Mind Strike",
          description:
            "Your psychic damage spells ignore resistance. When you negate a spell using Deep Void, you gain 1 Void Power stack (max 3). Each stack adds +1d6 psychic damage to your next psychic spell. Stacks are consumed when you cast a psychic spell.",
          damageFormula: "2d6",
        },

        keyAbilities: [
          "Mind Shatter - Psychic damage scaling with Health Sacrificed, rounded up (25 mana, 2d6 HP cost)",
          "Despair's Grasp - Mass debuff causing disadvantage and halved movement (15 mana, DC 15 Wisdom)",
          "Void Rift - Ultimate ability pulling enemies and dealing massive damage (45 mana, 4d10 HP + 1d6 permanent HP)",
        ],
      },
    ],
  },

  // Deathcaller Spells by Level - Complete spell list for the class
  exampleSpells: [
    // ===== LEVEL 1 SPELLS =====
    {
      id: "dc_necrotic_bolt",
      name: "Necrotic Bolt",
      description:
        "Fire a bolt of necrotic energy dealing 3d8 damage. Reduces target's damage dealt by 3 for 1 round. Costs 1d6 HP to cast. Generates Blood Tokens equal to HP sacrificed.",
      level: 1,
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        tags: ["damage", "ranged", "blood magic"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
        propagationMethod: "seeking",
        propagationBehavior: "opportunistic",
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "1d6",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "3d8",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        criticalConfig: { enabled: true, critMultiplier: 2 },
        critDiceOnly: false,
        savingThrow: {
          ability: "constitution",
          difficultyClass: 13,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statReduction",
        effects: [
          {
            id: "necrotic_bolt_weakness",
            name: "Necrotic Weakness",
            description: "Reduces damage dealt by 3 for 1 round.",
            statModifier: {
              stat: "damage",
              magnitude: -3,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      tags: ["damage", "ranged", "blood magic"],
    },

    {
      id: "dc_shadow_step",
      name: "Shadow Step",
      description:
        "Step through the shadows up to 30 feet. You gain +2 Dodge Rating for 1 round upon arrival. Costs 1d6 HP.",
      level: 1,
      effectTypes: ["utility"],
      typeConfig: {
        school: "shadow",
        icon: "Utility/Phantom Dash",
        tags: ["teleport", "mobility", "necrotic", "blood magic"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["location"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: false,
        propagationMethod: "none",
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "1d6",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          {
            id: "teleport",
            name: "Teleport",
            description: "Gain +2 Dodge Rating after teleporting.",
            statModifier: {
              stat: "dodge",
              magnitude: 2,
              magnitudeType: "flat",
            },
            distance: 30,
            duration: 1,
            durationUnit: "rounds",
          },
        ],
        power: "minor",
      },
      tags: ["teleport", "mobility", "necrotic", "blood magic"],
    },

    {
      id: "dc_blood_ward",
      name: "Blood Ward",
      description:
        "Sacrifice 1d8 health to create a protective ward that absorbs damage equal to twice the health sacrificed. Lasts 1 minute.",
      level: 1,
      effectTypes: ["utility"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Protective Aura",
        tags: ["protection", "ward", "blood magic"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "1d8",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      utilityConfig: {
        utilityType: "enhancement",
        selectedEffects: [
          {
            id: "damage_absorption",
            name: "Damage Absorption",
            description:
              "Absorbs damage equal to 2× HP sacrificed (1d8). Lasts 1 minute.",
            duration: 1,
            durationUnit: "minutes",
          },
        ],
        power: "minor",
      },
      tags: ["protection", "ward", "blood magic"],
    },

    // ===== LEVEL 2 SPELLS =====
    {
      id: "dc_blood_leech",
      name: "Blood Leech",
      description:
        "Drain health from a target, dealing damage and healing yourself. Generates Blood Tokens if Crimson Pact is active.",
      level: 2,
      effectTypes: ["damage", "healing"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Drain Soul",
        tags: ["damage", "healing", "life drain", "blood magic"],
      },
      targetingMode: "effect",
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
        propagationMethod: "chain",
        propagationBehavior: "lowest_health",
      },
      effectTargeting: {
        damage: {
          targetingType: "single",
          rangeType: "ranged",
          rangeDistance: 30,
          targetRestrictions: ["enemy"],
          maxTargets: 1,
          propagationMethod: "chain",
          propagationBehavior: "lowest_health",
        },
        healing: {
          targetingType: "self",
        },
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "1d4",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "2d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        criticalConfig: { enabled: true, critMultiplier: 2 },
        critDiceOnly: false,
        resolution: "DICE",
      },
      healingConfig: {
        formula: "2d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        frequency: "start_of_turn",
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "decay_debuff",
            name: "Decay",
            description: "Reduces Damage Reduction by 3.",
            statModifier: {
              stat: "damage_reduction",
              magnitude: -3,
              magnitudeType: "flat",
            },
            statusType: "weakened",
            level: "moderate",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: true,
      },
      tags: ["aura", "necrotic", "debuff", "area"],
    },

    {
      id: "dc_life_link",
      name: "Life Link",
      description:
        "Link your life force with an ally for 1 minute. 50% of damage they take is redirected to you and generates Blood Tokens equal to damage absorbed. While linked, you both gain +2 Armor.",
      level: 5,
      effectTypes: ["utility"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Protective Aura",
        tags: ["support", "protection", "link", "damage sharing"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetType: "ally",
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      utilityConfig: {
        utilityType: "enhancement",
        selectedEffects: [
          {
            id: "life_link",
            name: "Life Link",
            description:
              "All damage split evenly between linked targets. Redirected damage generates Blood Tokens",
            duration: 1,
            durationUnit: "minutes",
          },
        ],
        power: "major",
      },
      tags: ["support", "protection", "link", "damage sharing"],
    },

    {
      id: "dc_deaths_sentence",
      name: "Death's Sentence",
      description:
        "Attempt to instantly execute a wounded enemy with necrotic power.",
      level: 5,
      effectTypes: ["control"],
      typeConfig: {
        school: "necrotic",
        icon: "Slashing/Execution",
        tags: ["execute", "control", "melee"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "3d6",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      controlConfig: {
        controlType: "incapacitation",
        strength: "severe",
        duration: 0,
        durationUnit: "instant",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "instant_death",
            name: "Instant Death",
            description: "Attempt to instantly kill wounded targets",
            savingThrow: {
              ability: "constitution",
              difficultyClass: 16,
              saveOutcome: "negates",
            },
            condition: "death",
            duration: 1,
            durationUnit: "instant",
          },
        ],
      },
      tags: ["execute", "control", "melee"],
    },

    // ===== LEVEL 6 SPELLS =====
    {
      id: "dc_blood_cataclysm",
      name: "Blood Cataclysm",
      description:
        "Unleash all accumulated Blood Tokens in a cataclysmic burst of necrotic energy.",
      level: 6,
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "necrotic",
        icon: "Poison/Poison Plague",
        tags: ["aoe", "damage", "stun", "ultimate"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 25 },
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 22, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "4d6",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "8d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        criticalConfig: {
          critType: "effect",
          critEffects: ["anti_magic_stun"],
        },
        resolution: "DICE",
      },
      controlConfig: {
        controlType: "incapacitation",
        strength: "severe",
        duration: 1,
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "anti_magic_burst",
            name: "Anti-Magic Burst",
            description: "Stuns enemies with cataclysmic necrotic energy",
            savingThrow: {
              ability: "constitution",
              difficultyClass: 17,
              saveOutcome: "negates",
            },
            condition: "stunned",
            duration: 1,
            durationUnit: "rounds",
          },
        ],
      },
      tags: ["aoe", "damage", "stun", "ultimate"],
    },

    {
      id: "dc_binding_pain",
      name: "Binding Pain",
      description:
        "Paralyze enemies with excruciating pain, dealing damage and immobilizing them.",
      level: 6,
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "necrotic",
        icon: "Psychic/Twist Pain",
        tags: ["crowd control", "paralysis", "necrotic", "area"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
        targetSelectionMethod: "manual",
        requiresLineOfSight: false,
        propagationMethod: "spreading",
        propagationBehavior: "contagion",
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "3d6",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "8d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      controlConfig: {
        controlType: "incapacitation",
        strength: "strong",
        duration: 1,
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "pain_paralysis",
            name: "Pain Paralysis",
            description: "Paralyzed by overwhelming pain",
            savingThrow: {
              ability: "constitution",
              difficultyClass: 15,
              saveOutcome: "negates",
            },
            condition: "paralyzed",
            duration: 1,
            durationUnit: "rounds",
          },
        ],
      },
      tags: ["crowd control", "paralysis", "necrotic", "area"],
    },

    {
      id: "dc_eternal_agony",
      name: "Eternal Agony",
      description:
        "Inflict escalating psychic pain that grows more severe each turn for 3 turns. Target may attempt a Constitution save each turn to end the effect early.",
      level: 6,
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["damage", "psychic", "dot", "escalating", "blood magic"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        targetSelectionMethod: "lowest_health",
        requiresLineOfSight: true,
        propagationMethod: "seeking",
        propagationBehavior: "aggressive",
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "1d10",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "1d6 + turn_number \u00d7 1d6",
        elementType: "psychic",
        damageTypes: ["psychic"],
        hasDotEffect: true,
        dotConfig: {
          damagePerTick: "turn_number * 1d6",
          duration: 3,
          tickFrequency: "round",
          isProgressiveDot: true,
          allowSaveEachTurn: true,
          saveType: "constitution",
          progressiveStages: [
            {
              round: 1,
              formula: "1d6",
              description:
                "Initial agony wracks the target's mind as the psychic torment begins.",
            },
            {
              round: 2,
              formula: "2d6",
              description:
                "Growing pain intensifies the torment, the psychic damage escalating as the curse deepens.",
            },
            {
              round: 3,
              formula: "3d6",
              description:
                "Severe torment overwhelms the target, the psychic assault reaching devastating levels.",
            },
          ],
        },
        resolution: "DICE",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: true,
            baseFormula: "1d6",
            conditionalFormulas: {
              round_1: "1d6",
              round_2: "2d6",
              round_3: "3d6",
            },
            stages: [
              {
                round: 1,
                formula: "1d6",
                description:
                  "Initial agony wracks the target's mind as the psychic torment begins.",
              },
              {
                round: 2,
                formula: "2d6",
                description:
                  "Growing pain intensifies the torment, the psychic damage escalating as the curse deepens.",
              },
              {
                round: 3,
                formula: "3d6",
                description:
                  "Severe torment overwhelms the target, the psychic assault reaching devastating levels.",
              },
            ],
          },
        },
      },
      tags: ["damage", "psychic", "dot", "escalating", "blood magic"],
    },

    // ===== LEVEL 7 SPELLS =====
    {
      id: "dc_necrotic_storm",
      name: "Necrotic Storm",
      description:
        "Summon a raging storm of necrotic energy that damages enemies over time.",
      level: 7,
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        tags: ["aoe", "damage over time", "anti magic", "concentration"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 30 },
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 25, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "5d6",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "10d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        hasDotEffect: true,
        dotConfig: {
          damagePerTick: "4d6",
          duration: 1,
          tickFrequency: "round",
          isProgressiveDot: false,
        },
        criticalConfig: {
          critType: "effect",
          critEffects: ["necrotic_storm_crit"],
        },
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "anti_magic_weakening",
            name: "Anti-Magic Weakening",
            description:
              "Target takes 50% reduced spell damage and cannot regenerate mana for 1 minute. Requires concentration.",
            statusType: "weakened",
            level: "major",
            statPenalty: [
              { stat: "spell_damage", value: -50, magnitudeType: "percentage" },
              { stat: "mana_regen", value: -100, magnitudeType: "percentage" },
            ],
            mechanicsText:
              "50% reduced spell damage, cannot regenerate mana for 1 minute",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: true,
      },
      tags: ["aoe", "damage over time", "anti magic", "concentration"],
    },

    {
      id: "dc_apex_predator",
      name: "Apex Predator",
      description:
        "Transform into a perfect hunter for 10 minutes. Gain Invisibility, +10 Movement Speed, and +3 to Stealth checks.",
      level: 7,
      effectTypes: ["transformation"],
      typeConfig: {
        school: "shadow",
        icon: "Necrotic/Ghostly Menace",
        tags: ["transformation", "stealth", "buff"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: false,
        propagationMethod: "none",
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 25 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "4d8",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 10,
        durationUnit: "minutes",
        power: "major",
        specialEffects: [
          "invisibility_to_enemies",
          "supernatural_senses",
          "enhanced_speed",
        ],
        statModifier: {
          stat: "movement_speed",
          magnitude: 10,
          magnitudeType: "flat",
        },
      },
      tags: ["transformation", "stealth", "buff"],
    },

    {
      id: "dc_final_hour",
      name: "Final Hour",
      description:
        "Enter a state of ultimate focus for 1 minute. Gain +3 Attack and Damage, and your critical hit range is increased by 2.",
      level: 7,
      effectTypes: ["buff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Drain Soul",
        tags: ["transformation", "damage", "mobility"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 25, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "5d6",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "ultimate_focus_attack",
            name: "Perfect Precision",
            description: "Gain +4 to attack rolls for 1 minute.",
            statModifier: {
              stat: "attack",
              magnitude: 4,
              magnitudeType: "flat",
            },
          },
          {
            id: "ultimate_focus_damage",
            name: "Devastating Strikes",
            description: "Deal +2d6 damage on all attacks.",
            statModifier: {
              stat: "damage",
              magnitude: "2d6",
              magnitudeType: "flat",
            },
          },
          {
            id: "ultimate_focus_speed",
            name: "Flowing Movement",
            description:
              "Gain +15 feet movement speed for 1 minute. Your movements become fluid and effortless.",
            statModifier: {
              stat: "speed",
              magnitude: 15,
              magnitudeType: "flat",
            },
          },
          {
            id: "ultimate_focus_crit",
            name: "Critical Mastery",
            description: "Critical hit range expanded by 1.",
            statModifier: {
              stat: "crit_range",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: false,
        canBeDispelled: false,
      },
      tags: ["transformation", "damage", "mobility"],
    },

    // ===== LEVEL 8 SPELLS =====
    {
      id: "dc_judgment_day",
      name: "Judgment Day",
      description:
        "Call down necrotic judgment on all enemies within range, dealing massive damage.",
      level: 8,
      effectTypes: ["damage", "healing"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ebon Death",
        tags: ["aoe", "damage", "healing", "necrotic"],
      },
      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 40 },
      },
      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "sphere",
          aoeParameters: { radius: 40 },
          targetRestrictions: ["enemy"],
        },
        healing: {
          targetingType: "self",
        },
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 28, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "6d6",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "12d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        criticalConfig: {
          critType: "effect",
          critEffects: ["life_drain_crit"],
        },
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },
      healingConfig: {
        formula: "12d6",
        healingType: "direct",
        hasHotEffect: false,
        hasShieldEffect: false,
      },
      tags: ["aoe", "damage", "healing", "necrotic"],
    },

    {
      id: "dc_shadow_ascendant",
      name: "Shadow Ascendant",
      description:
        "Ascend into shadow form, becoming an entity of pure necrotic power. Your physical form becomes partially incorporeal, granting damage reduction and enhanced mobility.",
      level: 8,
      effectTypes: ["transformation", "buff", "utility"],
      typeConfig: {
        school: "shadow",
        icon: "Void/Consumed by Void",
        tags: ["transformation", "mobility", "damage", "defensive"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 28, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "6d8",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      transformationConfig: {
        transformationType: "elemental",
        targetType: "self",
        duration: 1,
        durationUnit: "minutes",
        power: "major",
        newForm: "Shadow Ascendant",
        description:
          "Become an entity of pure shadow and necrotic power, gaining enhanced defensive and mobility capabilities.",
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "shadow_entity",
            name: "Shadow Entity",
            description: "Reduce physical damage taken by 50%.",
            statModifier: {
              stat: "damage_reduction",
              magnitude: 50,
              magnitudeType: "percentage",
            },
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      utilityConfig: {
        utilityType: "Teleport",
        selectedEffects: [
          {
            id: "teleport",
            name: "Shadow Step",
            distance: 30,
            needsLineOfSight: false,
            description: "Teleport up to 30 feet through shadows.",
          },
          {
            id: "phasing",
            name: "Wall Phasing",
            phasingDuration: 1,
            canAttack: true,
            canInteract: true,
            maxThickness: "unlimited",
            description: "Pass through non-magical barriers of any thickness.",
          },
        ],
        duration: 1,
        durationUnit: "minutes",
        concentration: false,
        power: "major",
      },
      tags: ["transformation", "mobility", "damage", "defensive"],
    },

    {
      id: "dc_anti_magic_storm",
      name: "Anti-Magic Storm",
      description:
        "Create a massive storm that completely nullifies magic in a wide area.",
      level: 8,
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Corruption",
        tags: ["aoe", "anti magic", "suppression", "concentration"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 40 },
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 28, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "7d6",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "12d6",
        elementType: "force",
        damageTypes: ["force"],
        criticalConfig: {
          critType: "effect",
          critEffects: ["magic_nullification_crit"],
        },
        resolution: "DICE",
      },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          {
            id: "total_magic_nullification",
            name: "Total Magic Nullification",
            description:
              "All magic fails, effects are dispelled, mana cannot be used",
            duration: 1,
            durationUnit: "minutes",
            concentration: true,
          },
        ],
        power: "major",
      },
      tags: ["aoe", "anti magic", "suppression", "concentration"],
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: "dc_necrotic_apocalypse",
      name: "Necrotic Apocalypse",
      description:
        "Unleash 15d6 necrotic damage in a 50ft radius. Enemies take 6d6 ongoing damage and have -5 All Resistances for 1 minute.",
      level: 9,
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        tags: ["aoe", "damage", "damage over time", "anti magic"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 50 },
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 32, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "8d6",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "15d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        hasDotEffect: true,
        dotConfig: {
          damagePerTick: "6d6",
          duration: 1,
          tickFrequency: "round",
          isProgressiveDot: false,
        },
        criticalConfig: { enabled: true, critMultiplier: 2 },
        critDiceOnly: false,
        savingThrow: {
          ability: "constitution",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "apocalyptic_weakening",
            name: "Apocalyptic Weakening",
            description: "Reduces All Resistances by 5.",
            statModifier: {
              stat: "all_resistances",
              magnitude: -5,
              magnitudeType: "flat",
            },
            statusType: "weakened",
            level: "extreme",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 19,
          saveOutcome: "negates",
        },
      },
      tags: ["aoe", "damage", "damage over time", "anti magic"],
    },

    {
      id: "dc_void_hunter",
      name: "Void Hunter",
      description:
        "Transform into a Void Hunter for 10 minutes. Gain +20 Movement Speed, Phase Shift (ignore walls), and +5 to all attack rolls.",
      level: 9,
      effectTypes: ["transformation"],
      typeConfig: {
        school: "shadow",
        icon: "Void/Consumed by Void",
        tags: ["transformation", "mobility", "damage"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 32, bloodTokens: 6 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "8d8",
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "phaseshift",
        targetType: "self",
        duration: 10,
        durationUnit: "minutes",
        power: "major",
        specialEffects: [
          "void_existence",
          "teleport_anywhere",
          "ignore_defenses",
          "complete_immunity",
        ],
        statModifier: {
          stat: "movement_speed",
          magnitude: 20,
          magnitudeType: "flat",
        },
      },
      tags: ["transformation", "mobility", "damage"],
    },

    {
      id: "dc_divine_executioner",
      name: "Divine Executioner",
      description:
        "Become a Divine Executioner for 10 minutes. Enemies within 30ft take 4d6 damage per turn. Gain Immunity to all debuffs and +4 Armor.",
      level: 9,
      effectTypes: ["transformation"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Lich With Green Orb",
        tags: ["transformation", "damage", "mobility"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 32, bloodTokens: 6 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "8d10",
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 10,
        durationUnit: "minutes",
        power: "major",
        specialEffects: [
          "instant_death_zone",
          "complete_evil_immunity",
          "necrotic_judgment",
          "truth_compulsion",
          "zone_of_decay",
        ],
        statModifier: {
          stat: "armor",
          magnitude: 4,
          magnitudeType: "flat",
        },
      },
      tags: ["transformation", "damage", "mobility"],
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: "dc_necrotic_armageddon",
      name: "Necrotic Armageddon",
      description:
        "End the age of magic itself, unleashing total necrotic annihilation.",
      level: 10,
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        tags: ["aoe", "damage", "permanent", "anti magic"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 100 },
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "permanentHealth", "bloodTokens"],
        resourceValues: { mana: 36, bloodTokens: 6 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
        },
        resourceFormulas: {
          health: "10d6",
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "18d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        criticalConfig: { enabled: true, critMultiplier: 2 },
        critDiceOnly: false,
        savingThrow: {
          ability: "charisma",
          difficultyClass: 20,
          saveOutcome: "negates",
        },
        resolution: "DICE",
      },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          {
            id: "permanent_magic_ending",
            name: "Permanent Magic Ending",
            description:
              "All magic permanently ends in the area, reality rejects magic forever",
            duration: 1,
            durationUnit: "hours",
          },
        ],
        power: "major",
      },
      tags: ["aoe", "damage", "permanent", "anti magic"],
    },

    {
      id: "dc_shadow_god",
      name: "Shadow God",
      description:
        "Become a god of shadows, wielding ultimate power over darkness and necrotic energy.",
      level: 10,
      effectTypes: ["transformation"],
      typeConfig: {
        school: "shadow",
        icon: "Void/Consumed by Void",
        tags: ["transformation", "permanent", "godlike"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "permanentHealth", "bloodTokens"],
        resourceValues: { mana: 36, bloodTokens: 6 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
          permanentHealth: true,
        },
        resourceFormulas: {
          health: "10d8",
          permanentHealth: "2d10",
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 0,
        durationUnit: "permanent",
        power: "major",
        specialEffects: [
          "complete_immunity",
          "instant_teleport",
          "auto_crit",
          "shadow_manipulation",
          "evil_banishment",
        ],
      },
      tags: ["transformation", "permanent", "godlike"],
    },

    {
      id: "dc_necrotic_incarnation",
      name: "Necrotic Incarnation",
      description:
        "Become the physical incarnation of necrotic wrath and blood magic.",
      level: 10,
      effectTypes: ["transformation"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Consumed by Void",
        tags: ["transformation", "permanent", "godlike"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "permanentHealth", "bloodTokens"],
        resourceValues: { mana: 36, bloodTokens: 6 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        useFormulas: {
          health: true,
          permanentHealth: true,
        },
        resourceFormulas: {
          health: "10d10",
          permanentHealth: "3d8",
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 0,
        durationUnit: "permanent",
        power: "major",
        specialEffects: [
          "instant_death_zone",
          "complete_evil_immunity",
          "necrotic_judgment",
          "truth_compulsion",
          "zone_of_decay",
        ],
      },
      tags: ["transformation", "permanent", "godlike"],
    },
  ],
};

export default DEATHCALLER_DATA;
