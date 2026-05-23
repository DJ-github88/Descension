/**
 * Chronarch Class Data
 *
 * Complete class information for the Chronarch - a time manipulator
 * who builds temporal energy and manages strain to control the battlefield.
 *
 * === ECOSYSTEM AUTOPSY ===
 * Why Bring Me:  The ONLY class capable of total momentum and duration distortion.
 *   They possess the exclusive ability to lock down whole groups of enemies in perfect
 *   stasis frames, manually extend or freeze active debuff counters on targets, and
 *   entirely rewind an ally's positioning and action state to an earlier round.
 * Fatal Flaw:    Temporal Inversion and Fragility. Because they are actively tearing
 *   the fabric of probability, their atomic alignment is dangerously thin. They possess
 *   a permanent, massive vulnerability to raw Void/Necrotic forces, and if caught
 *   in a zone that accelerates time or inflicts mass impact (forced movement), their
 *   internal clock breaks, dropping Dodge to zero and triggering instantaneous backlash.
 * Mechanical Fix: Implemented a permanent max HP erosion tax (-1 to -10 max HP until Long Rest)
 *   on all heavy Flux spending abilities. Converted the static 10-Strain Temporal Backlash
 *   into a terrifying, unpredictable 1d6 anomaly table. Shifted Level 1 kit to aggressively
 *   kick off Shard-building and Strain-cooling on Turn 1.
 */

export const CHRONARCH_DATA = {
  id : "chronarch",
  name: "Chronarch",
  icon: "fas fa-clock",
  role: "Control",
  damageTypes: ["force", "arcane"],

  classIdentity: {
    title: "The Accidental Anchor",
    subtitle: "A Dying Vessel Bound to a Bleeding Timeline",
    utility: "Unmatched, absolute battlefield manipulation and time distortion. The Chronarch is the only class capable of freezing entire areas in perfect stasis frames, manually pausing or extending debuff clocks on enemies, and entirely rewinding an ally's HP and position back to an earlier round. They bend duration itself to their whim.",
    fatalFlaw: "Temporal Inversion and Fragility. Because they actively crack probability, their atomic alignment is dangerously thin. They possess a permanent 50% vulnerability to raw Void and Necrotic forces, which unravels their chronal coherence. Furthermore, if they are caught in a zone that accelerates time or are struck by a heavy physical impact (forced movement/shoves), their internal clock fractures—dropping their Dodge rating to zero and triggering an instantaneous Temporal Backlash roll on their 1d6 table."
  },

  // Overview section
  overview: {
    title: "The Chronarch",
    subtitle: "The Accidental Anchor",
    illustration: "/assets/images/classes/chronarch_illustration.png",
    illustrationCaption: "An Astren Chronarch using starlight sand to stabilize a bleeding timeline.",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: You did not study the arcane to master time; you were broken by it. You are an accidental anchor, a dying mortal whose cells hum with high-velocity temporal friction. With every temporal fracture you sew, your hair turns stark white and your cellular structures undergo intense micro-strain.
      
**The Double Resource Engine**:
1. **Time Shards (0-10)**: Stolen fragments of temporal energy. Basic spells generate them; Flux spells spend them. They persist across combats.
2. **Temporal Strain (0-10)**: Cellular decay tracking immediate temporal instability. Reaching 10 Strain triggers an unpredictable, terrifying **Temporal Backlash** roll on a 1d6 table.

**The Metabolic Burnout Tax**: To prevent time from unspooling, heavy Flux spending abilities enforce a temporary maximum HP erosion penalty that persists until a full Long Rest.

**Best For**: Players who love absolute battlefield control, timeline rewinding, and high-stakes tactical risk-management.`
    },

    description: `The Chronarch did not choose this path — chronomancy chose them. They are Prisoners of Relativity, flesh-bound anchors tethered to a timeline that never wanted them. Every wound they rewind from an ally etches kinetic recoil onto their own body instead. Every frozen moment demands intense cellular focus. They carry hourglasses not as tools of mastery, but as reminders of the extreme metabolic cost that ticks faster with each spell cast. The Chronarch is the only living soul capable of reversing the combat state — undoing tactical errors, resetting cooldowns, trapping enemies in temporal loops of their own creation — while managing the high physical strain of altered reality.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Chronarchs are not born — they are broken into being. Something reached across the timestream and grabbed them, and now they cannot let go. Their connection to the temporal current manifests as heavy physical exertion: silver hair bleaching from chronal friction, skin that cools to near-freezing, and an accelerated heart rate during high-exertion castings.

Common Chronarch archetypes include:
- **The Accidental Anchor**: Caught in an alchemical temporal event, now acting as a living anchor to keep local reality from unspooling.
- **The Decaying Scholar**: Once a brilliant researcher, now a hollowed vessel whose experiments with relativity left them with terminal temporal drift.
- **The Timeline Warden**: A dedicated defender of the primary thread, willing to absorb extreme somatic strain to undo catastrophic historical deviations.

Chronarchs do not enjoy their gift. Foresight is a burden — every possible future is a risk waiting to happen, and choosing not to act carries the same weight as acting. They know that every time they rewind kinetic trauma, their own nervous system absorbs a fraction of it as localized recoil.`
    },

    combatRole: {
      title: "Combat Role",
      content: `The Chronarch is the ONLY class that can rewind the combat state. No one else can unmake a tactical mistake, reset a spent cooldown, or trap an enemy in a loop of their own movement. You bring a Chronarch because without one, errors are final and positioning is permanent.

**Battlefield Control**: Freeze enemies in temporal stasis, forcing them to watch helplessly as your allies reposition.
**Damage Mitigation**: Rewind damage taken by allies — but each wound you erase grafts localized kinetic recoil into your own body.
**Tactical Repositioning**: Displace allies and enemies through coordinates swapping, rewriting positioning that took entire turns to establish.
**Why Your Body Pays**: Every Flux ability accelerates metabolic fatigue. Your cells undergo micro-strain. Your max HP erodes. You take increased Arcane and Void damage because your tether to the present is frayed — those damage types resonate with the temporal fractures already embedded in your biology.

**The Fatal Flaw**: You are incredibly fragile. Not because of armor, but because chronomancy is eating your physical stamina. Arcane and Void damage hit you with severe resonance. Your movement slows as local chronal drag increases. And the more you rewrite reality for others, the less reality wants to hold onto you.`
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Chronarch is managing an alchemical limit. Every round is a calculation of how much more your body can take before it rejects the local timeline entirely.

**Time Shard Generation**:
- Every spell cast generates 1 Time Shard (some powerful basic spells generate 2).
- Maximum capacity: 10 Time Shards — the most stolen moments your focus can hold.
- Spend shards on powerful Flux abilities that violate causality.
- Shards persist between encounters — your accumulated debt to time carries forward.

**Temporal Strain Management — Your Decay Gauge**:
- Each Temporal Flux ability deepens cellular strain (1-8 Strain).
- Strain naturally decreases by 1 per turn if no Flux abilities are used — your body fights to restabilize.
- At 10 Strain, Temporal Backlash: the timeline snaps back, phasing you out and forcing an Anomaly Table roll.

**Strategic Timing — Reading Your Decay**:
- **Low Strain (0-3)**: Safe. Your body can handle it. Use Flux abilities as needed.
- **Mid Strain (4-6)**: Caution. You feel the physical drag. Every spell costs visibly.
- **High Strain (7-9)**: Danger. Your focus vibrates violently. One more Flux may break you.
- **Critical Strain (10)**: Backlash. Your body temporarily desynchronizes from the timeline.`
    },

    immersiveCombatExample: {
      title: "Immersive Combat Example: The Chronal Recall",
      content: `**Round 1 — Establishing the Engine**: The battle begins as a massive ironclad vanguard charges your fragile marksman ally. You cast Chrono Bolt (5 mana) at a nearby archer, dealing 1d8 + INT force damage and slowing it. Because you are at 0 Temporal Strain, the spell kickstarts your focus and generates 2 Time Shards (2/10). Strain: 0.

**Round 2 — Reaction Recovery**: The vanguard's heavy warhammer connects with your marksman. You cast Temporal Rewind as a Reaction (6 mana), rewinding the immediate trauma to heal 2d6 + Spirit. The ally's wounds knit, but you take 2 necrotic damage as you absorb the shock into your own nervous system as localized recoil. You gain 1 Shard (3/10). Strain: 0.

**Round 3 — Heavy Flux Violation**: With 3 Shards banked, you cast Temporal Flux: Speed on your rogue (12 mana, 4 Shards, +2 Strain). The rogue is hyper-accelerated, gaining +2 AP and double movement. Your focus shimmers with silver heat; you permanently lose 1 maximum HP until your next Long Rest as cellular stability fractures. Shards: 0/10. Strain: 2.`
    }
  },

  // Resource System
  resourceSystem: {
    title: "Time Shards & Temporal Strain",
    subtitle: "Dual Resource Management System",
    description: "The Chronarch navigates the tides of time by stealing moments and paying for them in physical stamina. Time Shards represent stolen fragments of chronal energy stored in their focus. Temporal Strain measures immediate cellular fatigue as the caster bends causality. Push too far and the timeline snaps back, temporarily phasing them out of reality.",

    cards: [
      {
        title: "Time Shards (0-10)",
        stats: "Generated by Casting",
        details: "Your fuel for Temporal Flux. Every basic spell cast generates 1 Shard. Shards are persistent between encounters."
      },
      {
        title: "Temporal Strain (0-10)",
        stats: "Decays 1 per Turn",
        details: "The heat generated by Flux. If you reach 10, you suffer Temporal Backlash. Decays naturally if no Flux is used during your turn."
      }
    ],

    generationTable: {
      headers: ["Trigger", "Time Shards", "Temporal Strain", "Notes"],
      rows: [
        ["Basic Spell (Mana Only)", "+1", "—", "Primary fuel source. 2 Shards on Turn 1 if at 0 Strain."],
        ["Flux Ability (Shard Cost)", "-Cost", "+1 to +8", "Violations of causality degrade cellular structure."],
        ["No Flux Cast on Turn", "—", "-1", "Passive cellular restabilization."],
        ["Temporal Backlash", "—", "Reset to 0", "Timeline snaps back, phasing you out and triggering anomaly."],
        ["Long Rest", "Reset to 0", "Reset to 0", "Full atomic alignment restored; erases max HP erosion."]
      ]
    },

    usage: {
      momentum: "Generate Time Shards through basic spells like Chrono Bolt, Temporal Mend, or Temporal Step. Bank them to fuel high-tier Flux violations.",
      flourish: "Spend Time Shards on powerful Flux abilities. Manage your Temporal Strain closely to avoid the catastrophic 10-Strain threshold."
    },

    overheatRules: {
      title: "Temporal Backlash (10 Strain)",
      content: `Reaching 10 Temporal Strain causes the timeline to snap back violently, temporarily desynchronizing you from the present.

**The Desynchronization**:
- You are **Phased Out** of reality for 1 round.
- You lose your next turn completely and cannot take Reactions.
- You are completely untargetable and immune to all damage during this phase.

**The Anomaly Matrix (1d6 Table)**:
When the timeline snaps, roll 1d6 to determine the chaotic chronal fallout:
1. **Accelerated Aging**: Take 3d6 necrotic damage and permanently lose 2 max HP until your next Long Rest.
2. **Entropic Echo**: An entropic, hostile clone of yourself manifests in an adjacent space for 1 round, attacking your closest ally using basic Chrono Bolt profiles.
3. **Causality Loop**: Pinned to the timeline. For 1 round, you cannot move and must repeat the exact action you took last turn.
4. **Timeline Desynchronization**: You desynchronize completely, lengthening your Phased Out status to 2 rounds.
5. **Chronal Singularity**: A localized gravity implosion pulls all creatures within 15ft 10ft toward you, dealing 4d6 Force damage to all caught in the collapse (including yourself).
6. **Paradoxical Cascade**: Suffer 4d8 Force damage and your speed is halved for 2 rounds, but your Time Shards are instantly capped at 10.`
    },

    timeShardTable: {
      title: "Time Shard Persistence",
      headers: ["Stored Shards", "Chronal Residue Effect", "Aesthetic Shift"],
      rows: [
        ["0-3", "Negligible temporal drift. Normal interactions.", "Faint hum in the ears."],
        ["4-7", "Light refracts weirdly around hands. +1 Initiative.", "Veins shimmer with faint silver light."],
        ["8-9", "Objects drop slower around you. +2 Initiative, -2 Dodge.", "Hair strands turn stark white; skin goes cold."],
        ["10", "Stolen time overflows. +3 Initiative, -4 Dodge, -10ft Speed.", "Eyes glow silver; shadow moves out of sync."]
      ]
    },

    strategicConsiderations: {
      title: "The Toll of Causality",
      content: `**Persistent Fuel**: Time Shards do not decay after combat. If you end an encounter with 8 shards, you begin the next fight with 8 shards. This allows you to launch devastating high-level Flux spells on Turn 1—at the cost of immediate cellular decay.

**The Max HP Erosion Tax**: The heaviest Flux spells (spending 4+ Shards) take a permanent toll on your body. Each cast permanently subtracts 1 to 10 points from your maximum HP pool. This erosion cannot be healed by any spell, potion, or rest short of a full, undisturbed Long Rest. Chronomancy is a terminal resource.

**Vulnerability to Void/Necrotic**: Because your atomic anchor is frayed, you take 50% extra damage from all Void and Necrotic sources. Furthermore, if you are subjected to forced movement (shoves, pulls, knockbacks) or time acceleration fields, your internal clock fractures—instantly dropping your Dodge rating to 0 and triggering an immediate roll on the Temporal Backlash Table.`
    },

    playingInPerson: {
      title: "Tabletop Tracking Guide",
      subtitle: "Managing Chronology with Physical Dice",
      content: `Tracking the Chronarch's dual resources is simple with two standard dice.

**Table Setup**:
- **Blue d10 (Time Shards)**: Keep this on the left. Rotate it to track stolen moments (0-10).
- **Red d10 (Temporal Strain)**: Keep this on the right. Rotate it to track cellular decay (0-10).

**The Flow**:
1. When you cast a basic spell, rotate the Blue d10 up by 1.
2. When you cast a Flux spell, rotate the Blue d10 down by the Shard cost, and rotate the Red d10 up by the Strain gain.
3. If the Red d10 hits 10, immediately tip both dice over, announce your desynchronization, and roll a standard d6 for the Backlash Anomaly.`
    }
  },

  // Specializations
  specializations: {
    title: "Chronomantic Specializations",
    subtitle: "Three Paths of causality Distortion",
    description: "Every Chronarch must decide how they will channel the chronal decay consuming their body.",

    specs: [
      {
        id : "stasis",
        name: "Arc of Stasis",
        icon: "fas fa-snowflake",
        color: "#4A90E2",
        theme: "Warden of Still Moments",
        playstyle: "Battlefield freeze, single-target lock down, zone control.",
        description: "Warden of Still Moments. These Chronarchs specialize in trapping enemies inside frozen instants—sealing them in temporal amber while their allies are dismantled around them.",
        strengths: [
          "Powerful crowd control through Stun/Stasis",
          "Excellent defensive zones and barriers",
          "Can freeze debuffs, preventing them from decaying"
        ],
        weaknesses: [
          "Lower mobility options",
          "Highly reliant on constitution saves landing",
          "High Strain cost for heavy freeze spells"
        ],
        specPassive: {
          name: "Temporal Amber",
          description: "Enemies trapped in your stasis effects have their saving throws against your chronal locks reduced by 2."
        }
      },
      {
        id : "displacement",
        name: "Arc of Displacement",
        icon: "fas fa-exchange-alt",
        color: "#F5A623",
        theme: "The Shattered Pace",
        playstyle: "High mobility, turn-order manipulation, tactical coordinates swap.",
        description: "The Shattered Pace. Speed specialists who manipulate movement and position by tearing the temporal fabric between allies and enemies.",
        strengths: [
          "Highest mobility of all specializations",
          "Can swap positions of allies and enemies",
          "Excellent AP generation for party members"
        ],
        weaknesses: [
          "Rapid Strain accumulation",
          "Very fragile positioning",
          "Requires strict turn-order planning"
        ],
        specPassive: {
          name: "Pace Folding",
          description: "Whenever you swap coordinates with a creature, you gain +2 Dodge and +10ft speed for 1 round."
        }
      },
      {
        id : "rewinding",
        name: "Arc of Rewinding",
        icon: "fas fa-history",
        color: "#7ED321",
        theme: "The Harrowing Martyr",
        playstyle: "Aggressive healing, debuff stripping, state reversal.",
        description: "The Harrowing Martyr. These Chronarchs absorb the kinetic trauma of others by rewinding time around injuries and erasing harmful effects.",
        strengths: [
          "Unparalleled healing and recovery",
          "Can completely undo recent damage",
          "Excellent debuff and condition cleanses"
        ],
        weaknesses: [
          "Caster takes self-inflicted necrotic damage on heals",
          "High mana expenditure",
          "Extremely punishing cellular decay on ultimates"
        ],
        specPassive: {
          name: "Wound Grafting",
          description: "Whenever you rewind damage for an ally, you absorb a fraction of the impact, dealing 2 necrotic damage to yourself but increasing the healing output by +1d8."
        }
      }
    ]
  },

  // Character Creation steps
  characterCreation: {
    steps: [
      "Choose your timepiece arcane focus — an ornate hourglass, ancient pocket watch, crystalline sundial, or water clock.",
      "Select your specialization: Arc of Stasis (control), Arc of Displacement (speed), or Arc of Rewinding (undoing).",
      "Pick your 3 starting spells from the Level 1 spell pool (Chrono Bolt, Temporal Mend, Temporal Step).",
      "Record your starting Time Shards (0/10) and Temporal Strain (0/10).",
      "Review your Temporal Backlash threshold — reaching 10 Strain means your body rejects the timeline, Phasing Out and triggering a roll on the 1d6 Temporal Backlash Table."
    ],
    choices: [
      {
        name: "Equipment Path A: Warden of Stillness",
        icon: "fas fa-shield-alt",
        items: [
          "Rune-Etched Quarterstaff (1d6 bludgeoning, hums with localized inertia)",
          "Steel-Bound Arcane Hourglass (Focus, sand shimmers and flows selectively)",
          "Scholar's Robes (Armor 10, weaves of protective silver mesh)"
        ],
        description: "Designed for tactical momentum, zone management, and slower, stasis-based battlefield control."
      },
      {
        name: "Equipment Path B: Shattered Velocity",
        icon: "fas fa-bolt",
        items: [
          "Dual Chrono-Daggers (1d4 piercing each, blades hum with micro-vibrations of accelerated time)",
          "Brass Chronal Astrolabe (Focus, mechanical gears spin dynamically with speed)",
          "Reinforced Leather Tunic (Armor 11, light and highly agile)"
        ],
        description: "Optimized for high-velocity playstyles, rapid Time Shard generation, and reactive coordinates swapping."
      }
    ],
    standardGear: [
      "Chronarch's Journal (contains starting spells and relativity formulas)",
      "Vial of alchemical chronal powder",
      "1d10 x 5 rusted copper coins"
    ],
    notes: "Requires an active timepiece focus to stabilize temporal reality during casting."
  },

  // Resource bars
  resourceBars: [
    {
      id : "time_shards",
      name: "Time Shards",
      icon: "fas fa-gem",
      maxValue: 10,
      color: "#4A90E2",
      description: "Generated by casting spells, spent on Temporal Flux abilities"
    },
    {
      id : "temporal_strain",
      name: "Temporal Strain",
      icon: "fas fa-fire",
      maxValue: 10,
      color: "#E53935",
      description: "Accumulated when using Temporal Flux abilities. At 10, suffer Temporal Backlash."
    }
  ],

  // Spells
  spells: [
    // ========================================
    // LEVEL 1 SPELLS - The Core Engine
    // ========================================
    { id: "chrono_bolt",
      name: "Chrono Bolt",
      description: "Hurl a bolt of calcified chronal energy dealing 1d8 + INT force damage. If at 0 Temporal Strain, generate 2 Time Shards instead of 1, kickstarting your engine on Turn 1.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Missile",
      typeConfig: {
        school: "force",
        icon: "Arcane/Missile",
        tags: ["ranged", "damage", "slow", "stasis"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 5,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Decurrit",
        somaticText: "Flick your wrist forward, throwing a silver bolt of calcified temporal force."
      },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "1d8 + intelligence",
        elementType: "force",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "chrono_bolt_slow",
            name: "Calcified Gait",
            description: "Movement speed is reduced by 10 feet.",
            mechanicsText: "Reduce movement speed by 10 feet.",
            movementPenalty: 10,
            statusEffect: {
              type: "speed_penalty",
              value: -10
            }
          }
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      tags: ["ranged", "damage", "slow", "stasis", "starter", "chronarch"]
    },

    { id: "temporal_mend",
      name: "Temporal Mend",
      description: "Rewind the immediate physical trauma of an ally, restoring 1d8 + Spirit HP. Consume 1 Time Shard to heal an additional 1d6 and cool your own Strain by 1.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Sands of Time",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Sands of Time",
        tags: ["heal", "rewinding", "support"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 6,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Restituere",
        somaticText: "Trace a counter-clockwise circle in the air to reverse localized skin and tissue stress."
      },
      resolution: "DICE",
      effectTypes: ["healing"],
      healingConfig: {
        formula: "1d8 + spirit",
        resolution: "DICE",
        healingType: "direct"
      },
      tags: ["heal", "rewinding", "support", "starter", "chronarch"]
    },

    { id: "temporal_step",
      name: "Temporal Step",
      description: "Step through local temporal cracks to reposition up to 20 feet. Generates 1 Time Shard and adds +1 Temporal Strain, instantly priming your chronal engine.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Quick Step",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Quick Step",
        tags: ["utility", "mobility", "displacement"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 8,
          time_shard_generate: 1,
          temporal_strain_gain: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Step forward as space shimmers, vanishing and reappearing 20 feet away."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "reposition",
        selectedEffects: [
          {
            id : "temporal_dash",
            name: "Chronal Leap",
            description: "Move up to 20 feet without provoking attacks of opportunity."
          }
        ]
      },
      tags: ["utility", "mobility", "displacement", "starter", "chronarch"]
    },

    { id: "chrono_frailty",
      name: "Temporal Inversion & Fragility",
      description: "Frayed coherence gives you 50% Void/Necrotic vulnerability. Forced movement or acceleration drops Dodge to 0 and triggers immediate Temporal Backlash.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Arcane/Rewind Time",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Rewind Time",
        tags: ["passive", "weakness", "fatal-flaw"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 0
      },
      resolution: "AUTOMATIC",
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "frayed_chronal_coherence",
            name: "Frayed Anchor",
            description: "Takes 50% extra damage from Void and Necrotic damage.",
            mechanicsText: "Gain 50% vulnerability to Void and Necrotic damage.",
            statusEffect: {
              type: "vulnerability",
              vulnerabilityTypes: ["void", "necrotic"],
              percentage: 50
            }
          },
          {
            id : "internal_clock_fracture",
            name: "Temporal Inversion",
            description: "If subjected to forced movement, Dodge drops to 0 and triggers immediate Temporal Backlash.",
            mechanicsText: "Forced movement drops Dodge to 0 and triggers Temporal Backlash.",
            statusEffect: {
              type: "condition_trigger",
              trigger: "forced_movement_or_acceleration",
              dodgePenalty: "set_to_zero",
              backlashTrigger: true
            }
          }
        ],
        durationValue: 0,
        durationType: "permanent"
      },
      tags: ["passive", "weakness", "fatal-flaw", "chronarch"]
    },

    { id: "temporal_backlash",
      name: "Temporal Backlash Anomaly",
      description: "Reaching 10 Temporal Strain resets Strain to 0, forces a Phased Out state (lose next turn and reactions), and triggers a roll on the 1d6 Anomaly Table.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Arcane/Spiral Vortex",
      effectTypes: ["passive"],
      typeConfig: {
        school: "force",
        icon: "Arcane/Spiral Vortex",
        tags: ["passive", "backlash", "anomaly"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 0
      },
      resolution: "AUTOMATIC",
      rollableTable: {
        enabled: true,
        tableName: "Temporal Backlash Anomalies",
        description: "Roll 1d6 when you reach 10 Temporal Strain. The timeline fractures, manifesting one of the following tragic anomalies:",
        diceFormula: "1d6",
        resolutionType: "DICE",
        resolutionConfig: {
          diceType: "d6"
        },
        entries: [
          {
            range: { min: 1, max: 1 },
            customName: "Accelerated Aging",
            effect: "Your cellular clock accelerates under friction. Take 3d6 necrotic damage and permanently lose 2 max HP until your next Long Rest."
          },
          {
            range: { min: 2, max: 2 },
            customName: "Entropic Echo",
            effect: "An entropic, hostile clone of yourself manifests in an adjacent space. It acts on its own initiative, casts basic Chrono Bolt at your closest ally, then dissolves."
          },
          {
            range: { min: 3, max: 3 },
            customName: "Causality Loop",
            effect: "You are pinned in space. For 1 round, you cannot move, and you must repeat the exact action you took on your previous turn."
          },
          {
            range: { min: 4, max: 4 },
            customName: "Timeline Desynchronization",
            effect: "You completely desynchronize from the present. You are Phased Out, lose your next turn, and cannot take reactions. You are immune to all damage during this time."
          },
          {
            range: { min: 5, max: 5 },
            customName: "Chronal Singularity",
            effect: "An implosive distortion forms. All creatures within 15 feet (including yourself) must make an Agility save or be pulled 10 feet toward you and take 4d6 Force damage."
          },
          {
            range: { min: 6, max: 6 },
            customName: "Paradoxical Cascade",
            effect: "A cascade of chronal energy erupts. You take 4d8 Force damage and speed is halved for 2 rounds, but Time Shards are instantly capped at 10."
          }
        ]
      },
      tags: ["passive", "backlash", "anomaly", "chronarch"]
    },

    // ========================================
    // LEVEL 2 SPELLS - Stasis, Rewinding, displacement
    // ========================================
    { id: "stasis_field",
      name: "Stasis Field",
      description: "Trap an enemy inside frozen temporal amber, stunning them for 1 round (DC 14 Con save negates). Somatic feedback inflicts 3 direct damage to the caster.",
      level: 2,
      spellType: "ACTION",
      icon: "Force/Force Field",
      typeConfig: {
        school: "arcane",
        icon: "Force/Force Field",
        tags: ["stasis", "control", "stun"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 8,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        hp: 3,
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Tene, Siste",
        somaticText: "Clench your fist tightly toward the target, absorbing 3 points of calcifying feedback."
      },
      resolution: "SAVE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "stasis_stun",
            name: "Frozen Moment",
            description: "Stunned. Cannot take actions or reactions.",
            mechanicsText: "Stun target for 1 round.",
            statusType: "stunned"
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "negates"
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      tags: ["stasis", "control", "stun", "chronarch"]
    },

    { id: "temporal_rewind",
      name: "Temporal Rewind",
      description: "As a reaction, rewind time around a recent injury to heal an ally for 2d6 + Spirit. The caster takes 2 necrotic damage from absorbing local recoil.",
      level: 2,
      spellType: "REACTION",
      icon: "Arcane/Rewind Time",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Rewind Time",
        tags: ["heal", "rewinding", "reaction", "support"],
        castTime: 0,
        castTimeType: "REACTION"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "reaction"],
        resourceValues: {
          mana: 6,
          time_shard_generate: 1,
          reaction: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Snap fingers as a reaction, absorbing the ally's impact momentum as a physical shock."
      },
      resolution: "DICE",
      effectTypes: ["healing"],
      healingConfig: {
        formula: "2d6 + spirit",
        resolution: "DICE",
        healingType: "direct"
      },
      triggerConfig: {
        triggers: [
          {
            id : "temporal_rewind_recoil",
            name: "Chronal Recoil",
            triggerType: "on_cast",
            action: "Caster takes 2 necrotic damage from absorbing local recoil."
          }
        ]
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      tags: ["heal", "rewinding", "reaction", "support", "chronarch"]
    },

    { id: "chrono_echo",
      name: "Chrono Echo",
      description: "Leave a silver chronal duplicate behind and teleport up to 30 feet. At the start of your next turn, you may choose to swap coordinates with your echo.",
      level: 2,
      spellType: "ACTION",
      icon: "Arcane/Zen",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Zen",
        tags: ["utility", "mobility", "displacement"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 7,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Puff chronal dust, sliding away while leaving a silver echo in place."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "reposition",
        selectedEffects: [
          {
            id : "echo_teleport",
            name: "Leave Echo",
            description: "Teleport up to 30 feet, leaving a copy at starting location."
          }
        ]
      },
      tags: ["utility", "mobility", "displacement", "chronarch"]
    },

    // ========================================
    // LEVEL 3 SPELLS - Dilation, Crystals, Foresight
    // ========================================
    { id: "temporal_dilation",
      name: "Temporal Dilation",
      description: "Establish a 15ft zone for 3 rounds. Allies inside gain +1 AP per round, while enemies have their speed halved. causality violation adds +1 Strain.",
      level: 3,
      spellType: "ACTION",
      icon: "Arcane/Swirling Vortex",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Swirling Vortex",
        tags: ["flux", "dilation", "displacement", "support", "slow"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: []
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 8,
          time_shard_cost: 2,
          temporal_strain_gain: 1
        },
        classResource: { type: "time_shards", cost: 2 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Dilato",
        somaticText: "Spread hands wide, establishing an expanding translucent dome of altered physics."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["buff", "debuff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id : "dilation_haste",
            name: "Accelerated Cadence",
            description: "Gains +1 Action Point per round.",
            mechanicsText: "Affected allies gain +1 Action Point per round.",
            statusEffect: {
              type: "energized",
              bonusActionPoints: 1
            }
          }
        ],
        durationValue: 3,
        durationType: "rounds"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "dilation_slow",
            name: "Sluggish Clock",
            description: "Movement speed is halved.",
            mechanicsText: "Affected enemies have movement speed halved.",
            statusEffect: {
              type: "speed_penalty",
              speedMultiplier: 0.5
            }
          }
        ],
        durationValue: 3,
        durationType: "rounds"
      },
      tags: ["flux", "dilation", "displacement", "support", "slow", "chronarch"]
    },

    { id: "time_crystal",
      name: "Time Crystal",
      description: "Condense chronal energy into a barrier on an ally absorbing 2d8 + INT damage. When the shield shatters, it releases a pulse that slows attackers.",
      level: 3,
      spellType: "ACTION",
      icon: "Force/Force Shield",
      typeConfig: {
        school: "force",
        icon: "Force/Force Shield",
        tags: ["stasis", "shield", "support"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 8,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Crystallum Temporis",
        somaticText: "Forge a hexagonal crystalline shell around target with quick finger taps."
      },
      resolution: "DICE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id : "time_crystal_shield",
            name: "Chronal Shield",
            description: "Absorbs incoming damage.",
            mechanicsText: "Absorb 2d8 + INT incoming damage.",
            statusEffect: {
              type: "shield",
              shieldAmount: "2d8 + intelligence"
            }
          }
        ],
        durationValue: 3,
        durationType: "rounds"
      },
      tags: ["stasis", "shield", "support", "chronarch"]
    },

    { id: "temporal_foresight",
      name: "Temporal Foresight",
      description: "Glimpse high-probability timelines to grant an ally advantage on all attack rolls and saving throws for 2 rounds as they anticipate threats.",
      level: 3,
      spellType: "ACTION",
      icon: "Arcane/Sands of Time",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Sands of Time",
        tags: ["buff", "rewinding", "support"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 8,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Providebo",
        somaticText: "Touch the ally's temples, transferring momentary flashes of relative outcomes."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id : "foresight_advantage",
            name: "Glimpsed Timelines",
            description: "Gains advantage on attack rolls and saving throws.",
            mechanicsText: "Grant advantage on all attack rolls and saving throws.",
            statusEffect: {
              type: "combat_advantage",
              advantageType: "super"
            }
          }
        ],
        durationValue: 2,
        durationType: "rounds"
      },
      tags: ["buff", "rewinding", "support", "chronarch"]
    },

    { id: "paradox_accumulation",
      name: "Paradox Accumulation",
      description: "Your magic feeds on chronal drift. While you bank 5+ Time Shards, your force and arcane damage spells deal an additional 1d6 damage.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Arcane/Abstract Rune",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Abstract Rune",
        tags: ["passive", "damage", "buff"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 0
      },
      resolution: "AUTOMATIC",
      tags: ["passive", "damage", "buff", "chronarch"]
    },

    // ========================================
    // LEVEL 4 SPELLS - Vortex, Flux: Rewind, Paradox
    // ========================================
    { id: "temporal_vortex",
      name: "Temporal Vortex",
      description: "Create a swirling vortex dealing 3d6 + INT force damage to enemies in a 20ft radius and pulling them 10ft closer (DC 14 Agility save halves/negates).",
      level: 4,
      spellType: "ACTION",
      icon: "Force/Force Wave",
      typeConfig: {
        school: "force",
        icon: "Force/Force Wave",
        tags: ["stasis", "damage", "aoe", "pull"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 40,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 10,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Vortex Temporis",
        somaticText: "Spike hand down, churning the air to establish a gravitation draft."
      },
      resolution: "SAVE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "3d6 + intelligence",
        elementType: "force",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        savingThrow: {
          ability: "agility",
          difficultyClass: 14,
          saveOutcome: "half_damage"
        },
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "vortex_pull",
            name: "Gravitational Drift",
            description: "Dragged 10 feet closer to vortex center.",
            mechanicsText: "Drag targets 10 feet closer to the center.",
            statusEffect: {
              type: "forced_movement",
              distance: 10
            }
          }
        ],
        durationValue: 0,
        durationType: "permanent",
        savingThrow: {
          ability: "agility",
          difficultyClass: 14,
          saveOutcome: "negates"
        }
      },
      tags: ["stasis", "damage", "aoe", "pull", "chronarch"]
    },

    { id: "temporal_flux_rewind",
      name: "Temporal Flux: Rewind",
      description: "Heavy Flux. Rewind an ally's timeline to heal 4d8 + Spirit and clear physical debuffs. Caster takes 1d6 necrotic recoil and erodes 1 max HP.",
      level: 4,
      spellType: "ACTION",
      icon: "Arcane/Rewind Time",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Rewind Time",
        tags: ["flux", "heal", "cleanse", "rewinding"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 12,
          time_shard_cost: 4,
          temporal_strain_gain: 2
        },
        classResource: { type: "time_shards", cost: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Revertere",
        somaticText: "Yank hands backward violently as if pulling threads, absorbing relative backlash."
      },
      resolution: "DICE",
      effectTypes: ["healing"],
      healingConfig: {
        formula: "4d8 + spirit",
        resolution: "DICE",
        healingType: "direct"
      },
      triggerConfig: {
        triggers: [
          {
            id : "temporal_flux_rewind_recoil",
            name: "Chronal Recoil",
            triggerType: "on_cast",
            action: "Caster takes 1d6 necrotic recoil damage and erodes 1 max HP."
          }
        ]
      },
      permanentCost: {
        type: "max_hp",
        amount: 1,
        duration: "long_rest",
        description: "Lose 1 max HP until next Long Rest as cellular stability fractures."
      },
      tags: ["flux", "heal", "cleanse", "rewinding", "chronarch"]
    },

    { id: "temporal_paradox",
      name: "Temporal Paradox",
      description: "Create a paradox trap on a single tile. When an enemy steps on it, they are returned to their starting coordinate and speed is reduced to 0.",
      level: 4,
      spellType: "ACTION",
      icon: "Arcane/Sands of Time",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Sands of Time",
        tags: ["displacement", "trap", "control"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: []
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 10,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Paradoxum Locis",
        somaticText: "Etch a circular paradox seal in the air, throwing it down to anchor a tile."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "trap",
        selectedEffects: [
          {
            id : "paradox_trigger",
            name: "Paradox Loop",
            description: "Enemy is returned to starting position and movement speed drops to 0."
          }
        ]
      },
      tags: ["displacement", "trap", "control", "chronarch"]
    },

    // ========================================
    // LEVEL 5 SPELLS - Anchor, Thorns, Flux: Shield, Flux: Speed
    // ========================================
    { id: "temporal_anchor",
      name: "Temporal Anchor",
      description: "Establish a molecular anchor on a creature. At the end of 2 rounds, they are instantly teleported back to the coordinate where the anchor was cast.",
      level: 5,
      spellType: "ACTION",
      icon: "Arcane/Angular Rune",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Angular Rune",
        tags: ["displacement", "teleport", "utility"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: []
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 12,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Ancora Temporis",
        somaticText: "Slam hand flat onto the air, pinning a molecular marker at target coordinates."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "reposition",
        selectedEffects: [
          {
            id : "anchor_set",
            name: "Anchored State",
            description: "Positional coordinates are locked and will reset in 2 rounds."
          }
        ]
      },
      tags: ["displacement", "teleport", "utility", "chronarch"]
    },

    { id: "temporal_thorns",
      name: "Temporal Thorns",
      description: "Weave chronal threads on an ally: attackers take 1d6 necrotic damage and gain disadvantage on attacks against the ally for 3 rounds (DC 15 Con save).",
      level: 5,
      spellType: "ACTION",
      icon: "Force/Force Shield",
      typeConfig: {
        school: "force",
        icon: "Force/Force Shield",
        tags: ["stasis", "protection", "support", "debuff"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 10,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Protegere",
        somaticText: "Create a static friction temporal barrier by rubbing hands together."
      },
      resolution: "SAVE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "temporal_barrier_effect",
            name: "Temporal Aging",
            description: "Attackers age rapidly, taking 1d6 necrotic damage and having disadvantage on attacks.",
            mechanicsText: "Attackers take 1d6 necrotic damage and suffer disadvantage on attacks.",
            statusEffect: {
              type: "attackers_disadvantage"
            }
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 15,
          saveOutcome: "negates"
        }
      },
      tags: ["stasis", "protection", "support", "debuff", "chronarch"]
    },

    { id: "temporal_flux_shield",
      name: "Temporal Flux: Shield",
      description: "Heavy Flux protection. Encase an ally in a stasis bubble absorbing 4d8 + INT damage and granting CC immunity for 2 rounds. Caster erodes 1 max HP.",
      level: 5,
      spellType: "ACTION",
      icon: "Force/Force Shield",
      typeConfig: {
        school: "arcane",
        icon: "Force/Force Shield",
        tags: ["flux", "shield", "support", "stasis"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: []
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 12,
          time_shard_cost: 4,
          temporal_strain_gain: 2
        },
        classResource: { type: "time_shards", cost: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Aegis",
        somaticText: "Cross wrists, drawing a shield out of static timelines to wrap target."
      },
      resolution: "DICE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id : "flux_shield_absorb",
            name: "Temporal Aegis",
            description: "Absorbs damage and blocks all CC.",
            mechanicsText: "Absorb 4d8 + INT damage and gain total CC immunity.",
            statusEffect: {
              type: "shielded",
              shieldAmount: "4d8 + intelligence"
            }
          }
        ],
        durationValue: 2,
        durationType: "rounds"
      },
      permanentCost: {
        type: "max_hp",
        amount: 1,
        duration: "long_rest",
        description: "Lose 1 max HP until next Long Rest as cellular stability fractures."
      },
      tags: ["flux", "shield", "support", "stasis", "chronarch"]
    },

    { id: "temporal_flux_speed",
      name: "Temporal Flux: Speed",
      description: "Heavy Flux acceleration. Grant an ally +2 AP and double movement speed for 2 rounds. Caster suffers cold chills and erodes 1 max HP.",
      level: 5,
      spellType: "ACTION",
      icon: "Utility/Speed Boot",
      typeConfig: {
        school: "arcane",
        icon: "Utility/Speed Boot",
        tags: ["flux", "haste", "support", "displacement"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 12,
          time_shard_cost: 4,
          temporal_strain_gain: 2
        },
        classResource: { type: "time_shards", cost: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Celeritas",
        somaticText: "Push target forward, forcing their molecules to vibrate dynamically at high velocities."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id : "flux_speed_haste",
            name: "Hyper-Acceleration",
            description: "Gains +2 Action Points and double speed.",
            mechanicsText: "Grant ally +2 Action Points and double speed.",
            statusEffect: {
              type: "haste",
              speedMultiplier: 2.0,
              extraActions: 2
            }
          }
        ],
        durationValue: 2,
        durationType: "rounds"
      },
      permanentCost: {
        type: "max_hp",
        amount: 1,
        duration: "long_rest",
        description: "Lose 1 max HP until next Long Rest as time accelerates past cells."
      },
      tags: ["flux", "haste", "support", "displacement", "chronarch"]
    },

    // ========================================
    // LEVEL 6 SPELLS - Fracture, Echoes, Flux: Loop
    // ========================================
    { id: "temporal_fracture",
      name: "Temporal Fracture",
      description: "Tear a micro-fracture in the target's timeline, dealing 4d8 + INT force damage and blocking them from taking Reactions for 2 rounds.",
      level: 6,
      spellType: "ACTION",
      icon: "Force/Energy Blast 1",
      typeConfig: {
        school: "force",
        icon: "Force/Energy Blast 1",
        tags: ["stasis", "damage", "debuff"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 12,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fractura Temporis",
        somaticText: "Flick fingers outward, making a fracturing motion that tears localized air molecules."
      },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "4d8 + intelligence",
        elementType: "force",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "fracture_silence",
            name: "Severed Reaction",
            description: "Cannot take reactions for 2 rounds.",
            mechanicsText: "Block reactions for 2 rounds.",
            statusEffect: {
              type: "reaction_locked"
            }
          }
        ],
        durationValue: 2,
        durationType: "rounds"
      },
      tags: ["stasis", "damage", "debuff", "chronarch"]
    },

    { id: "temporal_echoes",
      name: "Temporal Echoes",
      description: "Summon two chronal echoes of an ally: their next attack deals +2d6 arcane damage, and attacks against them have a 50% chance to hit an echo instead.",
      level: 6,
      spellType: "ACTION",
      icon: "Arcane/Wizard Spell Casting",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Wizard Spell Casting",
        tags: ["displacement", "buff", "support"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 14,
          time_shard_generate: 1
        },
        classResource: { type: "time_shards", cost: -1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Echoes Multiplicis",
        somaticText: "Wave hand laterally, trailing two shimmering silver coordinates out from the target."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id : "echo_shielding",
            name: "Echo Shells",
            description: "Deals +2d6 arcane damage on next attack and redirect 50% of attacks.",
            mechanicsText: "Next attack deals +2d6 arcane; 50% chance to redirect incoming attacks.",
            statusEffect: {
              type: "damage_shield",
              shieldType: "reflect",
              reductionPercent: 50
            }
          }
        ],
        durationValue: 2,
        durationType: "rounds"
      },
      tags: ["displacement", "buff", "support", "chronarch"]
    },

    { id: "temporal_loop",
      name: "Temporal Flux: Loop",
      description: "Heavy Flux loop. Trap an enemy in a 2-round causality loop, forcing them to repeat their previous round's action exactly (DC 16 Spirit save negates). erodes 2 max HP.",
      level: 6,
      spellType: "ACTION",
      icon: "Arcane/Sands of Time",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Sands of Time",
        tags: ["flux", "control", "stasis"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 15,
          time_shard_cost: 5,
          temporal_strain_gain: 3
        },
        classResource: { type: "time_shards", cost: 5 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Repetere",
        somaticText: "Form a loop with index and thumb, pinning the target's timeline coordinate with a gray focus."
      },
      resolution: "SAVE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "causality_loop_stun",
            name: "Causality Repeat",
            description: "Trapped in a causality loop, forced to repeat last turn's actions exactly.",
            mechanicsText: "Force target to repeat last turn's actions exactly.",
            statusEffect: {
              type: "staged",
              description: "Must repeat exact action"
            }
          }
        ],
        durationValue: 2,
        durationType: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 16,
          saveOutcome: "negates"
        }
      },
      permanentCost: {
        type: "max_hp",
        amount: 2,
        duration: "long_rest",
        description: "Lose 2 max HP until next Long Rest as causality bits back."
      },
      tags: ["flux", "control", "stasis", "chronarch"]
    },

    // ========================================
    // LEVEL 7 SPELLS - Flux: Disruption, Reversal, Flux: Echo Chamber
    // ========================================
    { id: "chronal_disruption",
      name: "Chronal Disruption",
      description: "Heavy Flux shockwave. Deal 6d6 + INT force damage in a 30ft cone and freeze enemies in stasis for 1 round (DC 16 Agility save). erodes 2 max HP.",
      level: 7,
      spellType: "ACTION",
      icon: "Force/Force Wave",
      typeConfig: {
        school: "force",
        icon: "Force/Force Wave",
        tags: ["flux", "damage", "aoe", "stasis"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "cone",
        aoeParameters: { angle: 90, length: 30 },
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 22,
          time_shard_cost: 6,
          temporal_strain_gain: 4
        },
        classResource: { type: "time_shards", cost: 6 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Disrumpere",
        somaticText: "Throw both arms out, venting localized chronal shocks forward as a grey heat wave."
      },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "6d6 + intelligence",
        elementType: "force",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        savingThrow: {
          ability: "agility",
          difficultyClass: 16,
          saveOutcome: "half_damage"
        },
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "disruption_stasis",
            name: "Chronal Stasis",
            description: "Frozen in time. Stunned for 1 round.",
            mechanicsText: "Freeze targets in stasis for 1 round.",
            statusType: "stunned"
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        savingThrow: {
          ability: "agility",
          difficultyClass: 16,
          saveOutcome: "negates"
        }
      },
      permanentCost: {
        type: "max_hp",
        amount: 2,
        duration: "long_rest",
        description: "Lose 2 max HP until next Long Rest as cellular matrix undergoes high strain."
      },
      tags: ["flux", "damage", "aoe", "stasis", "chronarch"]
    },

    { id: "chronal_reversal",
      name: "Chronal Reversal",
      description: "Rewind the temporal stream for a creature, fully healing all damage taken last round (10d6 + Spirit). Caster takes 3d6 necrotic recoil.",
      level: 7,
      spellType: "ACTION",
      icon: "Arcane/Rewind Time",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Rewind Time",
        tags: ["rewinding", "heal", "cleanse"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 24,
          time_shard_generate: 2
        },
        classResource: { type: "time_shards", cost: -2 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Reverto Totus",
        somaticText: "Grasp target with both hands, absorbing their kinetic injuries into your own nervous system as localized recoil."
      },
      resolution: "DICE",
      effectTypes: ["healing"],
      healingConfig: {
        formula: "10d6 + spirit",
        resolution: "DICE",
        healingType: "direct"
      },
      triggerConfig: {
        triggers: [
          {
            id : "chronal_reversal_recoil",
            name: "Chronal Recoil",
            triggerType: "on_cast",
            action: "Caster takes 3d6 necrotic recoil damage."
          }
        ]
      },
      tags: ["rewinding", "heal", "cleanse", "chronarch"]
    },

    { id: "temporal_echo_chamber",
      name: "Temporal Echo Chamber",
      description: "Heavy Flux. Encase a 20ft area: spells/attacks cast within are mirrored 1 round later. Caster erodes 2 max HP.",
      level: 7,
      spellType: "ACTION",
      icon: "Force/Force Field",
      typeConfig: {
        school: "force",
        icon: "Force/Force Field",
        tags: ["flux", "control", "aoe", "displacement"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 40,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: []
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 24,
          time_shard_cost: 6,
          temporal_strain_gain: 5
        },
        classResource: { type: "time_shards", cost: 6 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Echo Temporis",
        somaticText: "Spin fingers rapidly, weaving a thick grey temporal mesh box over the area."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "trap",
        selectedEffects: [
          {
            id : "echo_reverberation",
            name: "Chronal Echoes",
            description: "Spells and attacks repeat automatically in 1 round."
          }
        ]
      },
      permanentCost: {
        type: "max_hp",
        amount: 2,
        duration: "long_rest",
        description: "Lose 2 max HP until next Long Rest as your timelines loop."
      },
      tags: ["flux", "control", "aoe", "displacement", "chronarch"]
    },

    // ========================================
    // LEVEL 8 SPELLS - Flux: Dominion, Flux: Resurrection, Flux: Fate
    // ========================================
    { id: "temporal_flux_dominion",
      name: "Temporal Flux: Dominion",
      description: "Supreme Flux. Seize complete control of an enemy's timeline, forcing them to take their turn under your control (DC 17 Spirit save). erodes 3 max HP.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Orb Manipulation",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Orb Manipulation",
        tags: ["flux", "control", "charm"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 24,
          time_shard_cost: 8,
          temporal_strain_gain: 6
        },
        classResource: { type: "time_shards", cost: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Imperium",
        somaticText: "Lock gaze, twitching fingers as if they were strings on a chronal puppet."
      },
      resolution: "SAVE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "dominion_control",
            name: "Temporal Puppet",
            description: "Controlled by the Chronarch on their turn.",
            mechanicsText: "Gain absolute control of target's next turn.",
            statusEffect: {
              type: "charmed",
              charmLevel: "dominated"
            }
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 17,
          saveOutcome: "negates"
        }
      },
      permanentCost: {
        type: "max_hp",
        amount: 3,
        duration: "long_rest",
        description: "Lose 3 max HP until next Long Rest as you override another soul's timeline."
      },
      tags: ["flux", "control", "charm", "chronarch"]
    },

    { id: "temporal_flux_resurrection",
      name: "Temporal Flux: Resurrection",
      description: "Extreme Flux. Wrench a deceased ally's timeline back, reviving them at 50% HP. Caster takes 4d6 necrotic and erodes 3 max HP.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Open Portal",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Open Portal",
        tags: ["flux", "heal", "revive", "rewinding"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 15,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 28,
          time_shard_cost: 8,
          temporal_strain_gain: 5
        },
        classResource: { type: "time_shards", cost: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Resurgere",
        somaticText: "Touch the fallen ally's heart, transferring their physical damage vectors into yourself as somatic strain."
      },
      resolution: "DICE",
      effectTypes: ["healing"],
      healingConfig: {
        formula: "50% max_hp",
        resolution: "AUTOMATIC",
        healingType: "direct"
      },
      triggerConfig: {
        triggers: [
          {
            id : "temporal_flux_resurrection_recoil",
            name: "Chronal Recoil",
            triggerType: "on_cast",
            action: "Caster takes 4d6 necrotic recoil damage and erodes 3 max HP."
          }
        ]
      },
      permanentCost: {
        type: "max_hp",
        amount: 3,
        duration: "long_rest",
        description: "Lose 3 max HP until next Long Rest as you drag a soul out of timeline decay."
      },
      tags: ["flux", "heal", "revive", "rewinding", "chronarch"]
    },

    { id: "fate_manipulation",
      name: "Temporal Flux: Fate Manipulation",
      description: "Heavy Flux. Rewrite the probability matrix: force a creature to reroll with disadvantage or grant an ally advantage. Caster erodes 2 max HP.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Zen",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Zen",
        tags: ["flux", "luck", "support", "rewinding"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: []
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 20,
          time_shard_cost: 6,
          temporal_strain_gain: 4
        },
        classResource: { type: "time_shards", cost: 6 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Fati",
        somaticText: "Close eyes, snapping fingers to snap the thread of an unwanted outcome."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id : "fate_reroll",
            name: "Probability Bend",
            description: "Force reroll or grant advantage.",
            mechanicsText: "Force target reroll or grant advantage.",
            statusEffect: {
              type: "luck",
              luckType: "reroll"
            }
          }
        ],
        durationValue: 1,
        durationType: "rounds"
      },
      permanentCost: {
        type: "max_hp",
        amount: 2,
        duration: "long_rest",
        description: "Lose 2 max HP until next Long Rest as probability cracks your focus."
      },
      tags: ["flux", "luck", "support", "rewinding", "chronarch"]
    },

    // ========================================
    // LEVEL 9 SPELLS - Flux: Shockwave, Flux: Fracture, Flux: Paradox
    // ========================================
    { id: "temporal_shockwave",
      name: "Temporal Shockwave",
      description: "Cataclysmic Flux. Deal 8d10 + INT force damage in a 30ft radius and freeze survivors in stasis for 2 rounds (DC 18 Agility save). erodes 5 max HP.",
      level: 9,
      spellType: "ACTION",
      icon: "Force/Force Wave",
      typeConfig: {
        school: "force",
        icon: "Force/Force Wave",
        tags: ["flux", "damage", "aoe", "stasis"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 28,
          time_shard_cost: 8,
          temporal_strain_gain: 6
        },
        classResource: { type: "time_shards", cost: 8 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Terram",
        somaticText: "Raise both arms high, slamming focus into the ground to rupture local timeline coordinates."
      },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "8d10 + intelligence",
        elementType: "force",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        savingThrow: {
          ability: "agility",
          difficultyClass: 18,
          saveOutcome: "half_damage"
        },
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "shockwave_freeze",
            name: "Absolute Freeze",
            description: "Frozen in time. Stunned for 2 rounds.",
            mechanicsText: "Freeze targets in stasis for 2 rounds.",
            statusType: "stunned"
          }
        ],
        durationValue: 2,
        durationType: "rounds",
        savingThrow: {
          ability: "agility",
          difficultyClass: 18,
          saveOutcome: "reduced_duration"
        }
      },
      permanentCost: {
        type: "max_hp",
        amount: 5,
        duration: "long_rest",
        description: "Lose 5 max HP until next Long Rest as cellular structures age terminally."
      },
      tags: ["flux", "damage", "aoe", "stasis", "chronarch"]
    },

    { id: "reality_fracture",
      name: "Reality Fracture",
      description: "Cataclysmic Flux. Rip open a tear in space dealing 6d12 force damage in a 20ft radius. Somatic drag deals 1d6 necrotic to caster. erodes 3 max HP.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Spiral Vortex",
      typeConfig: {
        school: "force",
        icon: "Arcane/Spiral Vortex",
        tags: ["flux", "damage", "aoe", "void"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 40,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 25,
          time_shard_cost: 7,
          temporal_strain_gain: 5
        },
        classResource: { type: "time_shards", cost: 7 },
        healthCost: "1d6 necrotic",
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Spatium Rumpitur",
        somaticText: "Forcefully part your hands against heavy chronal drag, tearing a localized seam in space."
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "6d12",
        elementType: "force",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        resolution: "DICE"
      },
      permanentCost: {
        type: "max_hp",
        amount: 3,
        duration: "long_rest",
        description: "Lose 3 max HP until next Long Rest as the temporal strain impacts your cells."
      },
      tags: ["flux", "damage", "aoe", "void", "chronarch"]
    },

    { id: "chronal_paradox",
      name: "Chronal Paradox",
      description: "Cataclysmic Flux. Split enemy timeline: Spirit save each round or take 8d6 psychic and stunned; success halves damage and slows. erodes 3 max HP.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Sands of Time",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Sands of Time",
        tags: ["flux", "damage", "control", "stasis"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 24,
          time_shard_cost: 7,
          temporal_strain_gain: 5
        },
        classResource: { type: "time_shards", cost: 7 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Duplex Veritas",
        somaticText: "Touch target's head, splitting their chronal alignment into contradictory threads."
      },
      resolution: "SAVE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "8d6",
        elementType: "arcane",
        damageTypes: ["arcane"],
        canCrit: true,
        critMultiplier: 2,
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "half_damage"
        },
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "paradox_mind_stun",
            name: "Paradox Stutter",
            description: "Stunned due to reality fracture.",
            mechanicsText: "Stun target on failed save.",
            statusType: "stunned"
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "negates"
        }
      },
      permanentCost: {
        type: "max_hp",
        amount: 3,
        duration: "long_rest",
        description: "Lose 3 max HP until next Long Rest as timeline loop splits your cells."
      },
      tags: ["flux", "damage", "control", "stasis", "chronarch"]
    },

    // ========================================
    // LEVEL 10 SPELLS - Mastery, Flux: Restoration, Flux: Vortex
    // ========================================
    { id: "temporal_mastery",
      name: "Temporal Mastery",
      description: "Ultimate passive. Grant +1 base Action Point at start of combat, and your basic spells generate 2 Time Shards instead of 1.",
      level: 10,
      spellType: "PASSIVE",
      icon: "Arcane/Zen",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Zen",
        tags: ["passive", "ap", "shards"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 0
      },
      resolution: "AUTOMATIC",
      tags: ["passive", "ap", "shards", "chronarch"]
    },

    { id: "chronal_restoration",
      name: "Chronal Restoration",
      description: "Absolute Flux. Fully restore all allies within 30ft to their start-of-combat HP/AP/status. Caster takes 5d6 necrotic and erodes 10 max HP.",
      level: 10,
      spellType: "ACTION",
      icon: "Arcane/Rewind Time",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Rewind Time",
        tags: ["flux", "heal", "cleanse", "rewinding"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 30,
          time_shard_cost: 10,
          temporal_strain_gain: 7
        },
        classResource: { type: "time_shards", cost: 10 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Restitutio Chronos",
        somaticText: "Force your focus to its resonance limit, channeling intense chronal feedback through your hands."
      },
      resolution: "DICE",
      effectTypes: ["healing"],
      healingConfig: {
        formula: "100% max_hp",
        resolution: "AUTOMATIC",
        healingType: "direct"
      },
      triggerConfig: {
        triggers: [
          {
            id : "chronal_restoration_recoil",
            name: "Chronal Recoil",
            triggerType: "on_cast",
            action: "Caster takes 5d6 necrotic recoil damage and erodes 10 max HP."
          }
        ]
      },
      permanentCost: {
        type: "max_hp",
        amount: 10,
        duration: "long_rest",
        description: "Permanently lose 10 max HP until next Long Rest as the universe extracts a violent cellular tax."
      },
      tags: ["flux", "heal", "cleanse", "rewinding", "chronarch"]
    },

    { id: "chronal_vortex",
      name: "Chronal Vortex",
      description: "Absolute Flux. Deal 10d10 + INT force damage in a 50ft radius, drag all caught to the center, and freeze them in stasis for 2 rounds. erodes 5 max HP.",
      level: 10,
      spellType: "ACTION",
      icon: "Force/Force Wave",
      typeConfig: {
        school: "force",
        icon: "Force/Force Wave",
        tags: ["flux", "damage", "control", "aoe", "stasis"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 50 },
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        resourceTypes: ["mana", "time_shards", "temporal_strain"],
        resourceValues: {
          mana: 35,
          time_shard_cost: 10,
          temporal_strain_gain: 8
        },
        classResource: { type: "time_shards", cost: 10 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Singularitas Chronos",
        somaticText: "Throw focus up, pulling your hands down as it implodes into a silver spatial rift."
      },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "10d10 + intelligence",
        elementType: "force",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "vortex_absolute_stasis",
            name: "Singularity Lock",
            description: "Frozen in stasis. Stunned for 2 rounds.",
            mechanicsText: "Lock targets in absolute stasis for 2 rounds.",
            statusType: "stunned"
          }
        ],
        durationValue: 2,
        durationType: "rounds"
      },
      permanentCost: {
        type: "max_hp",
        amount: 5,
        duration: "long_rest",
        description: "Lose 5 max HP until next Long Rest as your molecular layout unravels."
      },
      tags: ["flux", "damage", "control", "aoe", "stasis", "chronarch"]
    },

      {
        "id": "chrono_temporal_rewind",
        "name": "Temporal Rewind",
        "description": "Focus your temporal anchor to reverse the immediate past for a tiny, unattended object. A spilled goblet of wine flows back upward to fill its cup, a shattered porcelain vase fuses back into pristine form, or a burned letter stitches itself back into unread ink.",
        "level": 1,
        "spellType": "ACTION",
        "icon": "Arcane/Time Warp",
        "typeConfig": {
          "school": "arcane",
          "icon": "Arcane/Time Warp",
          "tags": [
            "utility",
            "roleplay",
            "chronarch"
          ],
          "castTime": 1,
          "castTimeType": "IMMEDIATE"
        },
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "touch",
          "targetRestrictions": []
        },
        "resourceCost": {
          "actionPoints": 1,
          "resourceTypes": [
            "mana"
          ],
          "resourceValues": {
            "mana": 4
          },
          "components": [
            "verbal",
            "somatic"
          ],
          "verbalText": "Reductio ad originem!",
          "somaticText": "Slightly twist your wrist backward, tracing a reverse-spiral in the air"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "restoration",
          "selectedEffects": [
            {
              "id": "temporal_rewind_effect",
              "name": "Object Restored",
              "description": "Rewinds the physical state of a tiny object (up to 5 lbs) by up to 6 seconds, completely repairing any recent damage, spills, or breaks."
            }
          ],
          "duration": 0,
          "durationUnit": "rounds",
          "concentration": false,
          "power": "minor"
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        },
        "tags": [
          "utility",
          "roleplay",
          "chronarch"
        ]
      }
  ],

  // Spell Pools
  spellPools: {
    1: ["chrono_bolt", "temporal_mend", "temporal_step",
      "chrono_temporal_rewind"],
    2: ["stasis_field", "temporal_rewind", "chrono_echo"],
    3: ["temporal_dilation", "time_crystal", "temporal_foresight"],
    4: ["temporal_vortex", "temporal_flux_rewind", "temporal_paradox"],
    5: [
      "temporal_anchor",
      "temporal_thorns",
      "temporal_flux_shield",
      "temporal_flux_speed"
    ],
    6: ["temporal_fracture", "temporal_echoes", "temporal_loop"],
    7: ["chronal_disruption", "chronal_reversal", "temporal_echo_chamber"],
    8: [
      "temporal_flux_dominion",
      "temporal_flux_resurrection",
      "fate_manipulation"
    ],
    9: ["temporal_shockwave", "reality_fracture", "chronal_paradox"],
    10: ["temporal_mastery", "chronal_restoration", "chronal_vortex"]
  }
};

export default CHRONARCH_DATA;
