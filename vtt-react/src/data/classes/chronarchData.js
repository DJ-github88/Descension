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
  id: "chronarch",
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

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: You did not study the arcane to master time; you were broken by it. You are an accidental anchor, a dying mortal whose veins shimmer with volatile, calcifying chronal residue. With every temporal fracture you sew, your hair turns stark white and your lifespan shrivels.
      
**The Double Resource Engine**:
1. **Time Shards (0-10)**: Stolen fragments of temporal energy. Basic spells generate them; Flux spells spend them. They persist across combats.
2. **Temporal Strain (0-10)**: Cellular decay tracking immediate temporal instability. Reaching 10 Strain triggers an unpredictable, terrifying **Temporal Backlash** roll on a 1d6 table.

**The Cellular Decay Tax**: To prevent time from unspooling, heavy Flux spending abilities enforce a permanent maximum HP erosion penalty that persists until a full Long Rest.

**Best For**: Players who love absolute battlefield control, timeline rewinding, and high-stakes tactical martyrdom.`,
    },

    description: `The Chronarch did not choose this path — chronomancy chose them. They are Prisoners of Relativity, flesh-bound anchors tethered to a timeline that never wanted them. Every wound they rewind from an ally etches itself onto their own body instead. Every frozen moment steals a year from their life. They carry hourglasses not as tools of mastery, but as grim reminders that their own sand runs faster with each spell cast. The Chronarch is the only living soul capable of reversing the combat state — undoing fatal blows, resetting cooldowns, trapping enemies in temporal loops of their own suffering — and the toll is written in white hair, bleeding eyes, and max HP that never quite recovers.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Chronarchs are not born — they are broken into being. Something reached across the timestream and grabbed them, and now they cannot let go. Their connection to the temporal current manifests as bodily mutilation: veins that shimmer with chronal residue, eyes that see moments that haven't happened yet, hair that turns white after every significant temporal fracture. At high Temporal Strain, their skin becomes translucent, revealing bones that age and de-age in writhing patterns beneath.

Common Chronarch archetypes include:
- **The Prisoner**: Trapped in a bargain with time itself, paying installments of their own lifespan to keep others alive.
- **The Decaying Scholar**: Once a brilliant mage, now a hollowed vessel whose research into chronomancy became a terminal disease.
- **The Reluctant Anchor**: The only person who can hold the present moment together — and every moment they hold it costs them dearly.
- **The Bereaved**: Someone they loved died on a timeline they failed to rewrite; now they carry the guilt and the power to ensure it never happens again.
- **The Walking Timeline**: A living record of every moment they've stolen, their body a palimpsest of accumulated temporal damage.

Chronarchs do not enjoy their gift. Foresight is a curse — every possible future is a wound waiting to happen, and choosing not to act carries the same weight as acting. They know that every time they rewind suffering, they absorb a fraction of it permanently.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `The Chronarch is the ONLY class that can rewind the combat state. No one else can unmake a fatal blow, reset a spent cooldown, or trap an enemy in a loop of their own suffering. You bring a Chronarch because without one, death is permanent and mistakes are final.

**Battlefield Control**: Freeze enemies in temporal stasis, forcing them to watch helplessly as your allies reposition.
**Damage Mitigation**: Rewind damage taken by allies — but each wound you erase carves a toll into your own flesh.
**Tactical Repositioning**: Displace allies and enemies through time, rewriting positioning that took entire turns to establish.
**Emergency Support**: Undo catastrophic damage through time reversal, sacrificing your own vitality to keep allies standing.

**Why Your Body Pays**: Every Flux ability accelerates cellular decay. Your veins calcify with chronal residue. Your max HP erodes. You take increased Arcane and Void damage because your tether to the present is frayed — those damage types resonate with the temporal fractures already embedded in your body.

**The Fatal Flaw**: You are incredibly fragile. Not because of armor, but because chronomancy is eating you alive. Arcane and Void damage hit you like a hammer hits glass. Your movement slows as your joints calcify. And the more you rewrite reality for others, the less reality wants to hold onto you.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Chronarch is managing a terminal illness. Every round is a calculation of how much more your body can take before it rejects you entirely.

**Time Shard Generation**:
- Every spell cast steals 1 Time Shard from the timestream (some powerful basic spells steal 2).
- Maximum capacity: 10 Time Shards — the most stolen moments your body can hold.
- Spend shards on Flux abilities that violate causality.
- Shards persist between encounters — your accumulated debt to time carries forward.

**Temporal Strain Management — Your Decay Gauge**:
- Each Temporal Flux ability deepens cellular degradation (1-8 Strain).
- Strain naturally decreases by 1 per turn if no Flux abilities are used — your body fights to heal.
- At 10 Strain, Temporal Backlash: your body rejects the present, you phase out, lose your next turn, and roll on the Anomaly Table.
- Balance the needs of your allies against the deterioration of your own flesh.

**Strategic Timing — Reading Your Decay**:
- **Low Strain (0-3)**: Safe. Your body can handle it. Use Flux abilities as needed.
- **Mid Strain (4-6)**: Caution. You feel it in your bones. Every spell costs visibly.
- **High Strain (7-9)**: Danger. Your veins shimmer. One more Flux may break you.
- **Critical Strain (10)**: Backlash. Your body ejects itself from the timeline.

**Specialization Synergies**:
- **Arc of Stasis**: Freeze the battlefield — your enemies trapped in moments they cannot escape while your allies dismantle them.
- **Arc of Displacement**: Twist speed and position — you accelerate allies past danger and slow enemies into helplessness.
- **Arc of Rewinding**: Undo what has been done — reverse wounds, strip buffs, revert the battlefield to a state that favors you.

**Team Dynamics**:
- Your allies rely on you to unmake their mistakes — carry that weight.
- Coordinate so they know when you can rewind and when your body cannot take it.
- Communicate Strain levels — if you're at 8, they need to know you're one spell from collapse.
- You are the safety net, and every catch costs you permanently.`,
    },

    immersiveCombatExample: {
      title: "Immersive Combat Example",
      content: `**Round 1 — Fueling Up**: The ironclad knight charges your squishy wizard ally. You cast Chrono Bolt (5 mana) at a nearby archer, dealing 1d8 + INT force damage and slowing it. You have 0 Temporal Strain, so the bolt kickstarts your engine and generates 2 Time Shards (2/10). Strain: 0.

**Round 2 — Reaction Save**: The knight's heavy mace connects with your wizard. You cast Temporal Rewind as a Reaction (6 mana), rewinding the trauma to heal 2d6 + Spirit. The wizard's flesh knits, but you take 2 necrotic damage as you absorb the shock. You gain 1 Shard (3/10). Strain: 0.

**Round 3 — Stasis Amber**: You cast Stasis Field (8 mana), trapping the knight in temporal amber. He is Stunned for 1 round (Con save negates). Your skin calcifies slightly, costing you 3 direct damage. You gain 1 Shard (4/10). Strain: 0.

**Round 4 — Heavy Flux violation**: With 4 Shards banked, you cast Temporal Flux: Speed on your rogue (12 mana, 4 Shards, +2 Strain). The rogue gains +2 AP and double movement. Your veins burn with white-hot residue; you permanently lose 1 maximum HP until your next Long Rest. Shards: 0/10. Strain: 2.

**Round 5 — Cool Down**: At Strain 2, you let your cells settle. You cast Chrono Bolt (5 mana), gaining 1 Shard (1/10). Because you didn't use a Flux ability this turn, your Strain decays by 1 at the start of your next turn, dropping to 1.`,
    },

    specializations: {
      title: "Chronarch Specializations",
      content: `**Arc of Stasis**: The Warden of Still Moments. These Chronarchs specialize in trapping enemies inside frozen instants — sealing them in temporal amber while their allies are dismantled around them. They gain enhanced stasis spells and talents that extend freeze durations, crush resistance to control effects, and reduce the Strain cost of immobilizing enemies. Every enemy they freeze is a small mercy stolen from the timestream.

**Arc of Displacement**: The Shattered Pace. Speed specialists whose bodies deteriorate fastest — they accelerate allies and decelerate enemies by ripping the temporal fabric between them. They gain enhanced haste and slow spells, extended buff durations, and enlarged AoE effects. Their talent tree reduces Strain on movement-based Flux abilities. Their joints calcify visibly faster than other Chronarchs.

**Arc of Rewinding**: The Wound Eaters. These Chronarchs absorb the suffering of others by rewinding time around injuries and erasing harmful effects. They reverse damage, strip enemy buffs, and revert battlefield conditions. Their talent tree increases rewind power, adds debuff removal, and reduces Strain on healing-tagged Flux abilities. Every wound they unmake from an ally etches itself faintly on their own flesh.`,
    },

    advancedTips: {
      title: "Advanced Tactics",
      content: `**Strain Banking**: Save Shards during low-threat rounds to unleash devastating combinations when enemies overextend.

**Turn Order Manipulation**: Use Temporal Dilation strategically to ensure your team's damage dealers act before key enemy abilities trigger.

**Predictive Defense**: Freeze enemies you know will take powerful actions next turn, preventing them from using abilities that could threaten your team.

**Emergency Rewind**: Keep 4-6 Shards banked for emergency Chronal Reversal or massive area healing when the fight turns against you.

**Strain Decay Timing**: Let Strain decay naturally during enemy turns or when repositioning, maximizing your safe windows for Flux usage.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Time Shards & Temporal Strain",
    subtitle: "Dual Resource Management System",

    description: `The Chronarch navigates the tides of time by stealing moments and paying for them in flesh. Time Shards are not generated — they are torn from the timestream, each one a stolen second that the universe wants back. Temporal Strain is not heat — it is cellular decay, your body breaking down as chronal energy calcifies your veins and erodes your grip on the present moment. Push too hard and the timeline snaps back, ejecting you from reality in a spasm of temporal rejection.`,

    cards: [
      {
        title: "Time Shards (0-10)",
        stats: "Generated by Casting",
        details:
          "Your fuel for Temporal Flux. Every basic spell cast generates 1 Shard. Shards are persistent between encounters.",
      },
      {
        title: "Temporal Strain (0-10)",
        stats: "Decays 1 per Turn",
        details:
          "The heat generated by Flux. If you reach 10, you suffer Temporal Backlash. Decays naturally if no Flux is used during your turn.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Time Shards", "Temporal Strain", "Notes"],
      rows: [
        ["Basic Spell (Mana Only)", "+1", "—", "Primary fuel source. 2 Shards on Turn 1 if at 0 Strain."],
        ["Flux Ability (Shard Cost)", "-Cost", "+1 to +8", "Violations of causality degrade cellular structure."],
        ["No Flux Cast on Turn", "—", "-1", "Passive cellular restabilization."],
        ["Temporal Backlash", "—", "Reset to 0", "Timeline snaps back, phasing you out and triggering anomaly."],
        ["Long Rest", "Reset to 0", "Reset to 0", "Full atomic alignment restored; erases max HP erosion."],
      ],
    },

    usage: {
      momentum:
        "Generate Time Shards through basic spells like Chrono Bolt, Temporal Mend, or Temporal Step. Bank them to fuel high-tier Flux violations.",
      flourish:
        "Spend Time Shards on powerful Flux abilities. Manage your Temporal Strain closely to avoid the catastrophic 10-Strain threshold.",
    },

    overheatRules: {
      title: "Temporal Backlash (10 Strain)",
      content: `Reaching 10 Temporal Strain causes the timeline to snap back violently, ejecting you from the present moment.

**The Desynchronization**:
- You are **Phased Out** of reality for 1 round.
- You lose your next turn completely and cannot take Reactions.
- You are completely untargetable and immune to all damage during this phase.

**The Anomaly Matrix (1d6 Table)**:
When the timeline snaps, roll 1d6 to determine the chaotic chronal fallout:
1. **Accelerated Aging**: Cellular clocks accelerate. Take 3d6 necrotic damage and permanently lose 2 max HP until your next Long Rest.
2. **Entropic Echo**: A white-haired, hostile clone of yourself manifests in an adjacent space for 1 round, attacking your closest ally using basic Chrono Bolt profiles.
3. **Causality Loop**: Pinned to the timeline. For 1 round, you cannot move and must repeat the exact action you took last turn.
4. **Timeline Desynchronization**: You desynchronize completely, lengthening your Phased Out status to 2 rounds.
5. **Chronal Singularity**: A localized gravity implosion pulls all creatures within 15ft 10ft toward you, dealing 4d6 Force damage to all caught in the collapse (including yourself).
6. **Paradoxical Cascade**: Suffer 4d8 Force damage and your speed is halved for 2 rounds, but your Time Shards are instantly capped at 10.`,
    },

    timeShardTable: {
      title: "Time Shard Persistence",
      headers: ["Stored Shards", "Chronal Residue Effect", "Aesthetic Shift"],
      rows: [
        ["0-3", "Negligible temporal drift. Normal interactions.", "Faint hum in the ears."],
        ["4-7", "Light refracts weirdly around hands. +1 Initiative.", "Veins shimmer with faint silver light."],
        ["8-9", "Objects drop slower around you. +2 Initiative, -2 Dodge.", "Hair strands turn stark white; skin goes cold."],
        ["10", "Stolen time overflows. +3 Initiative, -4 Dodge, -10ft Speed.", "Eyes glow silver; shadow moves out of sync."],
      ],
    },

    strategicConsiderations: {
      title: "The Toll of Causality",
      content: `**Persistent Fuel**: Time Shards do not decay after combat. If you end an encounter with 8 shards, you begin the next fight with 8 shards. This allows you to launch devastating high-level Flux spells on Turn 1—at the cost of immediate cellular decay.

**The Max HP Erosion Tax**: The heaviest Flux spells (spending 4+ Shards) take an permanent toll on your body. Each cast permanently subtracts 1 to 10 points from your maximum HP pool. This erosion cannot be healed by any spell, potion, or rest short of a full, undisturbed Long Rest. Chronomancy is a terminal resource.

**Vulnerability to Void/Necrotic**: Because your atomic anchor is frayed, you take 50% extra damage from all Void and Necrotic sources. Furthermore, if you are subjected to forced movement (shoves, pulls, knockbacks) or time acceleration fields, your internal clock fractures—instantly dropping your Dodge rating to 0 and triggering an immediate roll on the Temporal Backlash Table.`,
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
3. If the Red d10 hits 10, immediately tip both dice over, announce your desynchronization, and roll a standard d6 for the Backlash Anomaly.`,
    },
  },

  // Specializations
  specializations: {
    title: "Chronomantic Specializations",
    subtitle: "Three Paths of causality Distortion",
    description: "Every Chronarch must decide how they will channel the chronal decay consuming their body.",

    specs: [
      {
        id: "stasis",
        name: "Arc of Stasis",
        icon: "fas fa-snowflake",
        color: "#4A90E2",
        theme: "Warden of Still Moments",
        playstyle: "Battlefield freeze, single-target lock down, zone control.",
        description: "Warden of Still Moments. These Chronarchs specialize in trapping enemies inside frozen instants—sealing them in temporal amber while their allies are dismantled around them. Every enemy they freeze is a small mercy stolen from the timestream.",
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
        keyAbilities: [
          { name: "Temporal Amber", type: "Passive", cost: "None", description: "Enemies you freeze have their saving throws against your stasis effects reduced by 2." },
          { name: "Stasis Field", type: "Action", cost: "1 AP, 8 Mana", description: "Freeze a target in place, stunning them for 1 round (DC 14 Con save negates)." }
        ]
      },
      {
        id: "displacement",
        name: "Arc of Displacement",
        icon: "fas fa-exchange-alt",
        color: "#F5A623",
        theme: "The Shattered Pace",
        playstyle: "High mobility, turn-order manipulation, tactical coordinates swap.",
        description: "The Shattered Pace. Speed specialists whose bodies deteriorate fastest—they accelerate allies and decelerate enemies by ripping the temporal fabric between them. Their joints calcify visibly faster than other Chronarchs.",
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
        keyAbilities: [
          { name: "Pace Folding", type: "Passive", cost: "None", description: "Whenever you swap positions with a creature, you gain +2 Dodge and +10ft speed for 1 round." },
          { name: "Chrono Echo", type: "Action", cost: "1 AP, 7 Mana", description: "Leave a duplicate behind and teleport 30ft, allowing a free swap next turn." }
        ]
      },
      {
        id: "rewinding",
        name: "Arc of Rewinding",
        icon: "fas fa-history",
        color: "#7ED321",
        theme: "The Harrowing Martyr",
        playstyle: "Aggressive healing, debuff stripping, state reversal.",
        description: "The Harrowing Martyr. These Chronarchs absorb the suffering of others by rewinding time around injuries and erasing harmful effects. Every wound they unmake from an ally etches itself faintly on their own flesh, physically grafting the lacerations onto their shimmer-veined skin.",
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
        keyAbilities: [
          { name: "Wound Grafting", type: "Passive", cost: "None", description: "Whenever you rewind damage for an ally, you absorb a fraction of it, taking 2 necrotic damage but increasing the healing output by 1d8." },
          { name: "Temporal Rewind", type: "Reaction", cost: "0 AP, 6 Mana", description: "Rewind time as a reaction to heal an ally for 2d6 + Spirit, taking 2 necrotic damage yourself." }
        ]
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
      "Review your Temporal Backlash threshold — reaching 10 Strain means your body rejects the timeline, Phasing Out and triggering a roll on the 1d6 Temporal Backlash Table.",
    ],
    startingEquipment: {
      weapons: [
        {
          name: "Quarterstaff",
          damage: "1d6 bludgeoning",
          description: "A gnarled staff with temporal runes etched along its length",
        },
      ],
      armor: [
        {
          name: "Scholar's Robes",
          armor: 10,
          description: "Flowing robes that shimmer with faint temporal echoes",
        },
      ],
      focus: [
        {
          name: "Ornate Hourglass",
          description: "Your arcane focus — the sand within flows upward at times",
          required: true,
        },
      ],
      supplies: [
        {
          name: "Spellbook",
          description: "Contains your 3 starting spells and blank pages for future transcriptions",
          quantity: 1,
        },
        {
          name: "Temporal Chalk",
          description: "Used to draw temporal circles for ritual casting",
          quantity: 5,
        },
      ],
    },
  },

  // Resource bars
  resourceBars: [
    {
      id: "time_shards",
      name: "Time Shards",
      icon: "fas fa-gem",
      maxValue: 10,
      color: "#4A90E2",
      description: "Generated by casting spells, spent on Temporal Flux abilities",
    },
    {
      id: "temporal_strain",
      name: "Temporal Strain",
      icon: "fas fa-fire",
      maxValue: 10,
      color: "#E53935",
      description: "Accumulated when using Temporal Flux abilities. At 10, suffer Temporal Backlash.",
    },
  ],

  // Spells
  spells: [
    // ========================================
    // LEVEL 1 SPELLS - The Core Engine
    // ========================================
    {
      id: "chrono_bolt",
      name: "Chrono Bolt",
      description: "Hurl a crackling bolt of calcified chronal energy. Deals 1d8 + INT force damage. If you have 0 Temporal Strain, this spell generates 2 Time Shards instead of 1, kickstarting your chronal theft on Turn 1.",
      level: 1,
      spellType: "ACTION",
      icon: "Force/Force Bolt",
      typeConfig: {
        school: "force",
        icon: "Force/Force Bolt",
        tags: ["melee", "ranged", "damage", "slow", "stasis"],
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
          time_shards_generate: 1
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Decurrit",
        somaticText: "Flick wrist forward, throwing a silver bolt of calcified time."
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
            id: "chrono_bolt_slow",
            name: "Calcified Gait",
            description: "Movement speed is reduced by 10 feet.",
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

    {
      id: "temporal_mend",
      name: "Temporal Mend",
      description: "Rewind the immediate physical trauma of an ally, restoring 1d8 + Spirit health. If you have at least 1 Time Shard, you can consume it to heal an additional 1d6 and cool your own Strain by 1.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Light Heal",
      typeConfig: {
        school: "arcane",
        icon: "Healing/Light Heal",
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
          time_shards_generate: 1
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Restituere",
        somaticText: "Trace a counter-clockwise circle in the air to reverse localized skin tissue damage."
      },
      resolution: "DICE",
      effectTypes: ["healing"],
      healingConfig: {
        formula: "1d8 + spirit",
        resolution: "DICE",
        healingType: "hit_points"
      },
      tags: ["heal", "rewinding", "support", "starter", "chronarch"]
    },

    {
      id: "temporal_step",
      name: "Temporal Step",
      description: "Step through the cracks of reality. Reposition yourself up to 20 feet. Generates 1 Time Shard and adds +1 Temporal Strain, instantly priming your chronal engine for Turn 1 Flux spells.",
      level: 1,
      spellType: "ACTION",
      icon: "Utility/Teleport",
      typeConfig: {
        school: "arcane",
        icon: "Utility/Teleport",
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
          time_shards_generate: 1,
          temporal_strain_gain: 1
        },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Step forward into a fold in space, vanishing and reappearing 20 feet away."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "reposition",
        selectedEffects: [
          {
            id: "temporal_dash",
            name: "Chronal Leap",
            description: "Move up to 20 feet without provoking attacks of opportunity."
          }
        ]
      },
      tags: ["utility", "mobility", "displacement", "starter", "chronarch"]
    },

    {
      id: "chrono_frailty",
      name: "Temporal Inversion & Fragility",
      description: "Your physical form is dangerously frayed across timelines. You possess a permanent 50% vulnerability to all Void and Necrotic damage. Additionally, if you are subjected to forced movement (shoves, knockbacks) or time acceleration fields, your internal clock fractures—dropping your Dodge rating to 0 for 1 round and triggering an immediate roll on the Temporal Backlash Table.",
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
            id: "frayed_chronal_coherence",
            name: "Frayed Anchor",
            description: "Takes 50% extra damage from Void and Necrotic damage.",
            statusEffect: {
              type: "vulnerability",
              vulnerabilityTypes: ["void", "necrotic"],
              percentage: 50
            }
          },
          {
            id: "internal_clock_fracture",
            name: "Temporal Inversion",
            description: "If subjected to forced movement or time acceleration, Dodge drops to 0 and you trigger immediate Temporal Backlash.",
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

    {
      id: "temporal_backlash",
      name: "Temporal Backlash Anomaly",
      description: "When your Temporal Strain reaches 10, the timeline violently snaps back, resetting your Strain to 0, forcing you to Phase Out of reality (lose your next turn and reactions), and triggering a roll on the 1d6 Temporal Backlash Table.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Arcane/Chaos Bolt",
      effectTypes: ["passive"],
      typeConfig: {
        school: "force",
        icon: "Arcane/Chaos Bolt",
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
            effect: "Your cellular clock violently accelerates. Take 3d6 necrotic damage and permanently lose 2 maximum HP until your next Long Rest."
          },
          {
            range: { min: 2, max: 2 },
            customName: "Entropic Echo",
            effect: "An entropic, white-haired, hostile duplicate of yourself manifests in an adjacent space. It acts on its own initiative, casts a basic Chrono Bolt at your closest ally, and then dissolves."
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
            effect: "An implosive distortion forms around you. All creatures within 15 feet (including yourself) must succeed on an Agility save or be pulled 10 feet toward you and take 4d6 Force damage."
          },
          {
            range: { min: 6, max: 6 },
            customName: "Paradoxical Cascade",
            effect: "A blinding cascade of chronal energy erupts. You take 4d8 Force damage and your speed is halved for 2 rounds, but your Time Shards are instantly capped at 10."
          }
        ]
      },
      tags: ["passive", "backlash", "anomaly", "chronarch"]
    },

    // ========================================
    // LEVEL 2 SPELLS - Stasis, Rewinding, displacement
    // ========================================
    {
      id: "stasis_field",
      name: "Stasis Field",
      description: "Trap an enemy inside frozen temporal amber, locking them in place. The target is Stunned for 1 round (DC 14 Constitution save negates). The somatic component demands a price: you suffer 3 direct damage as your skin calcifies.",
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
          time_shards_generate: 1
        },
        hp: 3,
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Tene, Siste",
        somaticText: "Clench fist tightly toward target, suffering 3 points of calcifying feedback."
      },
      resolution: "SAVE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "stasis_stun",
            name: "Frozen Moment",
            description: "Stunned. Cannot take actions or reactions.",
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

    {
      id: "temporal_rewind",
      name: "Temporal Rewind",
      description: "As a reaction, rewind time around a recent injury. Restore 2d6 + Spirit health to a recently damaged ally. The caster takes 2 necrotic damage, physically absorbing the wound vector they strip from their companion.",
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
        resourceTypes: ["mana", "time_shards"],
        resourceValues: {
          mana: 6,
          time_shards_generate: 1
        },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Snap fingers as reaction when ally takes damage, absorbing the pain."
      },
      resolution: "DICE",
      effectTypes: ["healing", "damage"],
      healingConfig: {
        formula: "2d6 + spirit",
        resolution: "DICE",
        healingType: "hit_points"
      },
      damageConfig: {
        formula: "2",
        damageTypes: ["necrotic"],
        resolution: "AUTOMATIC"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      tags: ["heal", "rewinding", "reaction", "support", "chronarch"]
    },

    {
      id: "chrono_echo",
      name: "Chrono Echo",
      description: "Leave a shimmering chronal duplicate at your current coordinate, then teleport up to 30 feet. At the start of your next turn, you may choose to swap coordinates with your echo.",
      level: 2,
      spellType: "ACTION",
      icon: "Arcane/Clone Echo",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Clone Echo",
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
          time_shards_generate: 1
        },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Pout chronal dust, sliding away while leaving a silver echo in place."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "reposition",
        selectedEffects: [
          {
            id: "echo_teleport",
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
    {
      id: "temporal_dilation",
      name: "Temporal Dilation",
      description: "Manipulate the local flow of time. Create a 15ft zone that accelerates allies (giving them +1 Action Point) and slows enemies (halving their speed) for 3 rounds. Violation of causality adds +1 Strain.",
      level: 3,
      spellType: "ACTION",
      icon: "Arcane/Time Bubble",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Time Bubble",
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
          time_shards_cost: 2,
          temporal_strain_gain: 1
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Dilato",
        somaticText: "Spread hands wide, establishing an expanding translucent grey dome of altered physics."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["buff", "debuff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "dilation_haste",
            name: "Accelerated Cadence",
            description: "Gains +1 Action Point per round.",
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
            id: "dilation_slow",
            name: "Sluggish Clock",
            description: "Movement speed is halved.",
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

    {
      id: "time_crystal",
      name: "Time Crystal",
      description: "Condense chronological energy into a crystalline barrier on an ally. Absorbs 2d8 + INT damage. When the shield shatters, it releases a pulse that slows nearby attackers.",
      level: 3,
      spellType: "ACTION",
      icon: "Force/Crystal Shield",
      typeConfig: {
        school: "force",
        icon: "Force/Crystal Shield",
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
          time_shards_generate: 1
        },
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
            id: "time_crystal_shield",
            name: "Chronal Shield",
            description: "Absorbs incoming damage.",
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

    {
      id: "temporal_foresight",
      name: "Temporal Foresight",
      description: "Glimpse the immediate future. Grant an ally advantage on all attack rolls and saving throws for 2 rounds as they anticipate every incoming threat.",
      level: 3,
      spellType: "ACTION",
      icon: "Arcane/Foresight Eye",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Foresight Eye",
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
          time_shards_generate: 1
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Providebo",
        somaticText: "Touch the ally's temples, transferring momentary flashes of high-probability outcomes."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "foresight_advantage",
            name: "Glimpsed Timelines",
            description: "Gains advantage on attack rolls and saving throws.",
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

    {
      id: "paradox_accumulation",
      name: "Paradox Accumulation",
      description: "Your chronal residues feed your magic. While you have 5 or more Time Shards banked, your force and arcane damage spells deal an additional 1d6 damage.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Force/Force Shard",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Force/Force Shard",
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
    {
      id: "temporal_vortex",
      name: "Temporal Vortex",
      description: "Create a localized vortex of swirling force that pulls enemies toward its center. Deals 3d6 + INT force damage and drags targets within 20ft 10 feet closer (DC 14 Agility save halves damage and negates pull).",
      level: 4,
      spellType: "ACTION",
      icon: "Force/Vortex Pull",
      typeConfig: {
        school: "force",
        icon: "Force/Vortex Pull",
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
          time_shards_generate: 1
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Vortex Temporis",
        somaticText: "Spike hand down, churning the air to create a violent gravitational sinkhole."
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
            id: "vortex_pull",
            name: "Gravitational Drift",
            description: "Dragged 10 feet closer to vortex center.",
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

    {
      id: "temporal_flux_rewind",
      name: "Temporal Flux: Rewind",
      description: "A heavy Flux spell. Wrench time backward for an ally, restoring 4d8 + Spirit health and clearing all physical debuffs. The caster takes 1d6 necrotic damage as they physically absorb the laceration from their target. Your cellular integrity pays the price: permanently lose 1 maximum HP until your next Long Rest.",
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
          time_shards_cost: 4,
          temporal_strain_gain: 2
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Revertere",
        somaticText: "Yank hands backward violently as if pulling threads, tearing 1d6 necrotic scars onto your skin."
      },
      resolution: "DICE",
      effectTypes: ["healing", "damage"],
      healingConfig: {
        formula: "4d8 + spirit",
        resolution: "DICE",
        healingType: "hit_points"
      },
      damageConfig: {
        formula: "1d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      permanentCost: {
        type: "max_hp",
        amount: 1,
        duration: "long_rest",
        description: "Lose 1 max HP until next Long Rest as cellular structures age terminally."
      },
      tags: ["flux", "heal", "cleanse", "rewinding", "chronarch"]
    },

    {
      id: "temporal_paradox",
      name: "Temporal Paradox",
      description: "Create a paradox trap on a single tile. When an enemy steps on it, the glyph detonates, forcing them to repeat their previous movement and wasting their movement speed.",
      level: 4,
      spellType: "ACTION",
      icon: "Arcane/Paradox Hourglass",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Paradox Hourglass",
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
          time_shards_generate: 1
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Paradoxum Locis",
        somaticText: "Etch a circular paradox seal in the air, throwing it down to anchor to a tile."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "trap",
        selectedEffects: [
          {
            id: "paradox_trigger",
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
    {
      id: "temporal_anchor",
      name: "Temporal Anchor",
      description: "Establish a molecular anchor on an ally or enemy. At the end of 2 rounds, the target is instantly teleported back to the coordinate where the anchor was cast, resetting their position.",
      level: 5,
      spellType: "ACTION",
      icon: "Arcane/Anchor Rune",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Anchor Rune",
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
          time_shards_generate: 1
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Ancora Temporis",
        somaticText: "Slam hand flat onto the air, nailing a glowing blue peg down at the target's feet."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "reposition",
        selectedEffects: [
          {
            id: "anchor_set",
            name: "Anchored State",
            description: "Positional coordinates are locked and will reset in 2 rounds."
          }
        ]
      },
      tags: ["displacement", "teleport", "utility", "chronarch"]
    },

    {
      id: "temporal_thorns",
      name: "Temporal Thorns",
      description: "Weave temporal threads around an ally that age any attacker, dealing 1d6 necrotic damage and imposing disadvantage on attacks against the protected target for 3 rounds (DC 15 Constitution save negates).",
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
          time_shards_generate: 1
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Protegere",
        somaticText: "Create a prickly temporal barrier by rubbing hands together."
      },
      resolution: "SAVE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "temporal_barrier_effect",
            name: "Temporal Aging",
            description: "Attackers age rapidly, taking 1d6 necrotic damage and having disadvantage on attacks against the protected target.",
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

    {
      id: "temporal_flux_shield",
      name: "Temporal Flux: Shield",
      description: "Heavy Flux protection. Encase yourself or an ally in a shimmering bubble of frozen time. Absorbs 4d8 + INT damage and immune to all crowd control. Your cellular clock detains: permanently lose 1 maximum HP until your next Long Rest.",
      level: 5,
      spellType: "ACTION",
      icon: "Force/Shield Crystal",
      typeConfig: {
        school: "arcane",
        icon: "Force/Shield Crystal",
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
          time_shards_cost: 4,
          temporal_strain_gain: 2
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Aegis",
        somaticText: "Cross wrists, drawing a shield out of static timelines. White hair strands sprout."
      },
      resolution: "DICE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "flux_shield_absorb",
            name: "Temporal Aegis",
            description: "Absorbs damage and blocks all CC.",
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

    {
      id: "temporal_flux_speed",
      name: "Temporal Flux: Speed",
      description: "Heavy Flux acceleration. Accelerate an ally's rate of motion to impossible speeds. They gain +2 Action Points and double their movement speed for 2 rounds. Your cellular clock decays: permanently lose 1 maximum HP until your next Long Rest.",
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
          time_shards_cost: 4,
          temporal_strain_gain: 2
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Celeritas",
        somaticText: "Push target forward, forcing their molecules to vibrate forward. Caster suffers cold chills."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "flux_speed_haste",
            name: "Hyper-Acceleration",
            description: "Gains +2 Action Points and double speed.",
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
        description: "Lose 1 max HP until next Long Rest as time speeds past your cells."
      },
      tags: ["flux", "haste", "support", "displacement", "chronarch"]
    },

    // ========================================
    // LEVEL 6 SPELLS - Fracture, Echoes, Flux: Loop
    // ========================================
    {
      id: "temporal_fracture",
      name: "Temporal Fracture",
      description: "Tear a microscopic fracture in the target's timeline. Deals 4d8 + INT force damage and shatters their temporal alignment, preventing them from taking Reactions for 2 rounds.",
      level: 6,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      typeConfig: {
        school: "force",
        icon: "Force/Explosion Burst",
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
          time_shards_generate: 1
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fractura Temporis",
        somaticText: "Flick fingers outward, making a shattering motion that tears localized air."
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
            id: "fracture_silence",
            name: "Severed Reaction",
            description: "Cannot take reactions for 2 rounds.",
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

    {
      id: "temporal_echoes",
      name: "Temporal Echoes",
      description: "Summon two shimmering chronal echoes of an ally that mimic their actions. The ally's next attack deals an additional 2d6 arcane damage, and attacks against them have a 50% chance to strike an echo instead.",
      level: 6,
      spellType: "ACTION",
      icon: "Arcane/Triple Echo",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Triple Echo",
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
          time_shards_generate: 1
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Echoes Multiplicis",
        somaticText: "Wave hand laterally, trailing two silver silhouettes out from the target."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "echo_shielding",
            name: "Echo Shells",
            description: "Deals +2d6 arcane damage on next attack and redirect 50% of attacks.",
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

    {
      id: "temporal_loop",
      name: "Temporal Flux: Loop",
      description: "Heavy Flux loop. Trap an enemy in a 2-round causality loop, forcing them to repeat their previous round's action exactly (DC 16 Spirit save negates). Your body shrivels: permanently lose 2 maximum HP until your next Long Rest.",
      level: 6,
      spellType: "ACTION",
      icon: "Arcane/Time Loop",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Time Loop",
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
          time_shards_cost: 5,
          temporal_strain_gain: 3
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Repetere",
        somaticText: "Form a loop with index and thumb, pinning the target's immediate timeline. Red-grey smoke curls."
      },
      resolution: "SAVE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "causality_loop_stun",
            name: "Causality Repeat",
            description: "Trapped in a causality loop, forced to repeat last turn's actions exactly.",
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
        description: "Lose 2 max HP until next Long Rest as causality bites back."
      },
      tags: ["flux", "control", "stasis", "chronarch"]
    },

    // ========================================
    // LEVEL 7 SPELLS - Flux: Disruption, Reversal, Flux: Echo Chamber
    // ========================================
    {
      id: "chronal_disruption",
      name: "Chronal Disruption",
      description: "Heavy Flux devastation. Release a shockwave of fragmented time. Deals 6d6 + INT force damage to all enemies in a 30ft cone and freezes them in stasis for 1 round (DC 16 Agility save halves damage and negates stasis). Your core collapses: permanently lose 2 maximum HP until your next Long Rest.",
      level: 7,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      typeConfig: {
        school: "force",
        icon: "Force/Explosion Burst",
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
          time_shards_cost: 6,
          temporal_strain_gain: 4
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Disrumpere",
        somaticText: "Throw both arms out, venting localized chronal shocks forward. Senses dull."
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
            id: "disruption_stasis",
            name: "Chronal Stasis",
            description: "Frozen in time. Stunned for 1 round.",
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
        description: "Lose 2 max HP until next Long Rest as cellular matrix dissolves."
      },
      tags: ["flux", "damage", "aoe", "stasis", "chronarch"]
    },

    {
      id: "chronal_reversal",
      name: "Chronal Reversal",
      description: "Completely reverse the temporal stream for a creature, undoing all damage taken in the last round and restoring them to health. The caster takes 3d6 necrotic damage, physically absorbing the accumulated damage vectors stripped from the companion.",
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
          time_shards_generate: 2
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Reverto Totus",
        somaticText: "Grasp target with both hands, grafting their open cuts onto your own skin."
      },
      resolution: "DICE",
      effectTypes: ["healing", "damage"],
      healingConfig: {
        formula: "10d6 + spirit",
        resolution: "DICE",
        healingType: "hit_points"
      },
      damageConfig: {
        formula: "3d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      tags: ["rewinding", "heal", "cleanse", "chronarch"]
    },

    {
      id: "temporal_echo_chamber",
      name: "Temporal Echo Chamber",
      description: "Heavy Flux imprisonment. Encase a 20ft area in a resonant chamber. Any spell cast or attack made within the chamber is mirrored 1 round later, hitting the same targets. Your cells rot: permanently lose 2 maximum HP until your next Long Rest.",
      level: 7,
      spellType: "ACTION",
      icon: "Force/Force Shield",
      typeConfig: {
        school: "force",
        icon: "Force/Force Shield",
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
          time_shards_cost: 6,
          temporal_strain_gain: 5
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Echo Temporis",
        somaticText: "Spin fingers fast, weaving a thick grey temporal mesh box over the area."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "trap",
        selectedEffects: [
          {
            id: "echo_reverberation",
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
    {
      id: "temporal_flux_dominion",
      name: "Temporal Flux: Dominion",
      description: "Supreme Flux command. Seize complete control of an enemy's timeline, forcing them to take their turn under your direct control (DC 17 Spirit save negates). Your lifeforce drains: permanently lose 3 maximum HP until your next Long Rest.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Foresight Eye",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Foresight Eye",
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
          time_shards_cost: 8,
          temporal_strain_gain: 6
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Imperium",
        somaticText: "Lock gaze, twitching your fingers as if they were strings on a chronal puppet. White hair cascades."
      },
      resolution: "SAVE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "dominion_control",
            name: "Temporal Puppet",
            description: "Controlled by the Chronarch on their turn.",
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

    {
      id: "temporal_flux_resurrection",
      name: "Temporal Flux: Resurrection",
      description: "Extreme Flux. Wrench a deceased ally's timeline backward to a point before their death, restoring them to life with 50% health. The caster takes 4d6 necrotic damage as they physically graft the fatal wound onto their own flesh. Your cellular foundation shatters: permanently lose 3 maximum HP until your next Long Rest.",
      level: 8,
      spellType: "ACTION",
      icon: "Healing/True Resurrection",
      typeConfig: {
        school: "arcane",
        icon: "Healing/True Resurrection",
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
          time_shards_cost: 8,
          temporal_strain_gain: 5
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Resurgere",
        somaticText: "Kneel, placing bloody hands over the corpse, grafting the fatal gash to your own chest."
      },
      resolution: "DICE",
      effectTypes: ["healing", "damage"],
      healingConfig: {
        formula: "50% max_hp",
        resolution: "AUTOMATIC",
        healingType: "hit_points"
      },
      damageConfig: {
        formula: "4d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      permanentCost: {
        type: "max_hp",
        amount: 3,
        duration: "long_rest",
        description: "Lose 3 max HP until next Long Rest as you drag a soul out of death's maw."
      },
      tags: ["flux", "heal", "revive", "rewinding", "chronarch"]
    },

    {
      id: "fate_manipulation",
      name: "Temporal Flux: Fate Manipulation",
      description: "Heavy Flux alteration. Rewrite the probability matrix. Force any creature to reroll any attack roll, saving throw, or check with disadvantage, or grant an ally advantage on theirs. Your timeline frays: permanently lose 2 maximum HP until your next Long Rest.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Chaos Bolt",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Chaos Bolt",
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
          time_shards_cost: 6,
          temporal_strain_gain: 4
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Fati",
        somaticText: "Close eyes, snapping fingers to snap the thread of a disadvantageous outcome."
      },
      resolution: "AUTOMATIC",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "fate_reroll",
            name: "Probability Bend",
            description: "Force reroll or grant advantage.",
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
        description: "Lose 2 max HP until next Long Rest as probability fractures your body."
      },
      tags: ["flux", "luck", "support", "rewinding", "chronarch"]
    },

    // ========================================
    // LEVEL 9 SPELLS - Flux: Shockwave, Flux: Fracture, Flux: Paradox
    // ========================================
    {
      id: "temporal_shockwave",
      name: "Temporal Shockwave",
      description: "Cataclysmic Flux. Release a massive wave of chronal pressure. Deals 8d10 + INT force damage to all creatures in a 30ft radius and freezes all survivors in stasis for 2 rounds (DC 18 Agility save halves damage and reduces stasis to 1 round). Your blood calcifies: permanently lose 5 maximum HP until your next Long Rest.",
      level: 9,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      typeConfig: {
        school: "force",
        icon: "Force/Explosion Burst",
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
          time_shards_cost: 8,
          temporal_strain_gain: 6
        },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Fluxus Terram",
        somaticText: "Raise both arms high, slamming them into the ground to rupture local space. Silver shards fly."
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
            id: "shockwave_freeze",
            name: "Absolute Freeze",
            description: "Frozen in time. Stunned for 2 rounds.",
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
        description: "Lose 5 max HP until next Long Rest as blood turns to glass."
      },
      tags: ["flux", "damage", "aoe", "stasis", "chronarch"]
    },

    {
      id: "reality_fracture",
      name: "Reality Fracture",
      description: "Cataclysmic Flux. Rip open a massive tear in the present timeline, exposing the howling void. Deals 6d12 force damage to all creatures in a 20ft radius. The somatic component causes 1d6 necrotic damage to the caster. Your cells collapse: permanently lose 3 maximum HP until your next Long Rest.",
      level: 9,
      spellType: "ACTION",
      icon: "Force/Force Shard",
      typeConfig: {
        school: "force",
        icon: "Force/Force Shard",
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
          time_shards_cost: 7,
          temporal_strain_gain: 5
        },
        healthCost: "1d6 necrotic",
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Spatium Rumpitur",
        somaticText: "Clasp hands, tearing them apart with force, ripping open your own veins (1d6 damage)."
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
        description: "Lose 3 max HP until next Long Rest as the void eats your cells."
      },
      tags: ["flux", "damage", "aoe", "void", "chronarch"]
    },

    {
      id: "chronal_paradox",
      name: "Chronal Paradox",
      description: "Cataclysmic Flux. Split a target's timeline into two contradictory realities. At the start of their turn, they must roll a Spirit save. On failure, they suffer 8d6 psychic damage and are Stunned; on success, they take half damage and are Slowed. Your mind fractures: permanently lose 3 maximum HP until your next Long Rest.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Paradox Hourglass",
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Paradox Hourglass",
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
          time_shards_cost: 7,
          temporal_strain_gain: 5
        },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Duplex Veritas",
        somaticText: "Touch target's head, parting your fingers to split their eyes into two directions."
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
            id: "paradox_mind_stun",
            name: "Paradox Stutter",
            description: "Stunned due to reality fracture.",
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
        description: "Lose 3 max HP until next Long Rest as reality cracks your skull."
      },
      tags: ["flux", "damage", "control", "stasis", "chronarch"]
    },

    // ========================================
    // LEVEL 10 SPELLS - Mastery, Flux: Restoration, Flux: Vortex
    // ========================================
    {
      id: "temporal_mastery",
      name: "Temporal Mastery",
      description: "Ultimate passive. Your mastery over the flow of time allows you to act with supreme efficiency. You gain +1 base Action Point at the start of combat, and your basic spells generate 2 Time Shards instead of 1.",
      level: 10,
      spellType: "PASSIVE",
      icon: "Arcane/Rewind Time",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Rewind Time",
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

    {
      id: "chronal_restoration",
      name: "Chronal Restoration",
      description: "Absolute Flux. Completely restore all allies within 30 feet to the exact health, positioning, and status they possessed at the start of combat. The caster takes 5d6 necrotic damage, physically absorbing the combined suffering of their companions. Your body decays terminally: permanently lose 10 maximum HP until your next Long Rest.",
      level: 10,
      spellType: "ACTION",
      icon: "Healing/True Resurrection",
      typeConfig: {
        school: "arcane",
        icon: "Healing/True Resurrection",
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
          time_shards_cost: 10,
          temporal_strain_gain: 7
        },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Restitutio Chronos",
        somaticText: "Smash your focus hourglass on the ground, shattering glass into your palms (5d6 damage)."
      },
      resolution: "DICE",
      effectTypes: ["healing", "damage"],
      healingConfig: {
        formula: "100% max_hp",
        resolution: "AUTOMATIC",
        healingType: "hit_points"
      },
      damageConfig: {
        formula: "5d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      permanentCost: {
        type: "max_hp",
        amount: 10,
        duration: "long_rest",
        description: "Permanently lose 10 max HP until next Long Rest as the universe extracts a violent cellular tax."
      },
      tags: ["flux", "heal", "cleanse", "rewinding", "chronarch"]
    },

    {
      id: "chronal_vortex",
      name: "Chronal Vortex",
      description: "Absolute Flux. Tear a black hole in the timeline. Deals 10d10 + INT force damage to all enemies in a 50ft radius, dragging them to the center and freezing them in stasis for 2 rounds. Your atoms begin to unspool: permanently lose 5 maximum HP until your next Long Rest.",
      level: 10,
      spellType: "ACTION",
      icon: "Force/Vortex Pull",
      typeConfig: {
        school: "force",
        icon: "Force/Vortex Pull",
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
          time_shards_cost: 10,
          temporal_strain_gain: 8
        },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Singularitas Chronos",
        somaticText: "Throw focus up, pulling your hands down as it implodes into a silver void."
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
            id: "vortex_absolute_stasis",
            name: "Singularity Lock",
            description: "Frozen in stasis. Stunned for 2 rounds.",
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
    }
  ],

  // Spell Pools
  spellPools: {
    1: ["chrono_bolt", "temporal_mend", "temporal_step"],
    2: ["stasis_field", "temporal_rewind", "chrono_echo"],
    3: ["temporal_dilation", "time_crystal", "temporal_foresight"],
    4: ["temporal_vortex", "temporal_flux_rewind", "temporal_paradox"],
    5: [
      "temporal_anchor",
      "temporal_thorns",
      "temporal_flux_shield",
      "temporal_flux_speed",
    ],
    6: ["temporal_fracture", "temporal_echoes", "temporal_loop"],
    7: ["chronal_disruption", "chronal_reversal", "temporal_echo_chamber"],
    8: [
      "temporal_flux_dominion",
      "temporal_flux_resurrection",
      "fate_manipulation",
    ],
    9: ["temporal_shockwave", "reality_fracture", "chronal_paradox"],
    10: ["temporal_mastery", "chronal_restoration", "chronal_vortex"],
  },
};

export default CHRONARCH_DATA;
