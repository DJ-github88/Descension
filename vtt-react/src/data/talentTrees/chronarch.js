// ============================================
// CHRONARCH TALENT TREES (v3: full v2/v3 active/passive spec identity overhaul)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50 pts per tree.
//
// SPECS:
//   1. STASIS:       The Temporal Lockdown / Time Freeze Archon.
//   2. DISPLACEMENT: The Blink Skirmisher / Dimensional Spatial Warper.
//   3. REWINDING:    The Temporal Undoing / Fate Rewind Chronomancer.
// ============================================

// ============================================
// 1. CHRONARCH — STASIS TREE
// ============================================
export const CHRONARCH_STASIS_TREE = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "st_t1_stasis_field",
    name: "Stasis Field",
    icon: "spell_frost_stun",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Stasis Field",
      description: "Spend 1 AP and 3 mana: target enemy within 30 feet must make a Will save (DC 13) or be trapped in suspended animation for 1 round (cannot act, immune to outside damage). You gain 1 Time Shard.",
      flavorText: "A single tick of the Sundrift clock can rewrite destinies.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "ACTIVE", category: "debuff",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      damageTypes: ["arcane"],
      debuffs: ["stasis"], visualTheme: "arcane", tags: ["freeze", "cc", "time-shards", "chronarch"]
    },
    rankUpgrades: [
      { description: "Deals 1d8 arcane damage upon release and grants 2 Time Shards.", damageTypes: ["arcane"], primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "Deals 2d6 arcane damage upon release, grants 2 Time Shards, and target cannot take reactions for 1 round after release.", damageTypes: ["arcane"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "st_t1_frozen_momentum",
    name: "Frozen Momentum",
    icon: "spell_holy_borrowedtime",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Frozen Momentum",
      description: "Whenever you freeze, stun, or slow an enemy with your temporal spells, you generate 1 Time Shard and your next spell deals +1d6 force damage.",
      flavorText: "Time Shards crystallize when the fabric of reality is torn.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "shard-gain", "bonus-damage", "chronarch"]
    },
    rankUpgrades: [
      { description: "Generate 2 Time Shards on CC and your next spell deals +2d6 force damage." },
      { description: "Generate 2 Time Shards, deal +3d6 force damage, and your spell save DC increases by +2 for 1 round." }
    ]
  },
  {
    id: "st_t1_strain_efficiency",
    name: "Temporal Insulation",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Temporal Insulation",
      description: "All your temporal abilities generate 1 less Strain, and you gain 4 Damage Reduction while holding 3 or more Time Shards.",
      flavorText: "Mastery lessens the burden of woven time.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "strain-reduce", "dr", "chronarch"]
    },
    rankUpgrades: [
      { description: "Abilities generate 2 less Strain; gain 6 Damage Reduction at 3+ Time Shards and gain +2 Durability Steps to equipped durability." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "st_t2_temporal_shockwave",
    name: "Temporal Shockwave",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "st_t1_stasis_field",
    spell: {
      name: "Temporal Shockwave",
      description: "Spend 2 Time Shards: release a concussive shockwave of shattered time in a 25-foot cone. Deals 3d8 force damage, knocks enemies back 15 feet, and slows them by 20ft for 2 rounds.",
      flavorText: "The temporal tide crashes against fate's shore.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 25, aoeShape: "cone", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 2 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["slow", "knockback"], visualTheme: "arcane", tags: ["cone", "knockback", "slow", "chronarch"]
    },
    rankUpgrades: [
      { description: "30-foot cone deals 5d8 force damage, knocks back 20ft, and freezes enemies for 1 round.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, range: 30, aoeSize: 30 },
      { description: "35-foot cone deals 7d8 force damage, freezes for 2 rounds, and destroys enemy projectile attacks.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 }, range: 35, aoeSize: 35 }
    ]
  },
  {
    id: "st_t2_chronal_lockdown",
    name: "Chronal Lockdown",
    icon: "spell_nature_slow",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "st_t1_frozen_momentum",
    spell: {
      name: "Chronal Lockdown",
      description: "Enemies affected by your stasis or slow effects suffer +1d6 bonus damage from all sources and have -2 to saving throws.",
      flavorText: "Escape becomes a distant memory.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "vulnerability", "dc-boost", "chronarch"]
    },
    rankUpgrades: [
      { description: "Enemies suffer +2d6 bonus damage and have -3 to all saving throws." },
      { description: "Enemies suffer +2d6 bonus damage, have -4 to saves, and cannot use reactions while slowed." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "st_t3_chronal_cage",
    name: "Chronal Prison Sphere",
    icon: "spell_nature_timestop",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "st_t2_temporal_shockwave",
    spell: {
      name: "Chronal Prison Sphere",
      description: "Spend 3 Time Shards: deploy a 20-foot sphere of frozen time within 60 feet for 2 rounds. All enemies inside are completely frozen in stasis. Attacks against frozen enemies deal double damage.",
      flavorText: "A bubble where time simply ceases to flow.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 3 } },
      debuffs: ["mass-stasis"], visualTheme: "arcane", tags: ["aoe", "time-stop", "nuke-setup", "chronarch"]
    },
    rankUpgrades: [
      { description: "25-foot sphere lasts 3 rounds, double damage on frozen foes, and shatters for 4d8 force when ending.", aoeSize: 25 },
      { description: "30-foot sphere lasts 3 rounds, triple damage on frozen foes, shatters for 6d8 force and refunds 2 Time Shards.", aoeSize: 30 }
    ]
  },
  {
    id: "st_t3_fracture_mastery",
    name: "Temporal Fracture",
    icon: "spell_arcane_blast",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "st_t2_chronal_lockdown",
    spell: {
      name: "Temporal Fracture",
      description: "Whenever a target breaks free from stasis or slow, reality fractures around them: deals 3d8 force damage and bleeds them for 2d6 blight per round for 2 rounds.",
      flavorText: "Reality bleeds in the spaces between seconds.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane", "blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 2, dotTick: "2d6",
      visualTheme: "arcane", tags: ["passive", "fracture", "dot", "chronarch"]
    },
    rankUpgrades: [
      { description: "Fracture deals 4d8 force and 3d6 blight per round.", dotTick: "3d6" },
      { description: "Fracture deals 6d8 force and 4d6 blight per round, and stuns the target for 1 round.", dotTick: "4d6" }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "st_t4_absolute_stasis_beam",
    name: "Absolute Stasis Beam",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "st_t3_chronal_cage",
    spell: {
      name: "Absolute Stasis Beam",
      description: "Spend 4 Time Shards: fire a focused chronal beam in a 50-foot line. Deals 6d10 force damage to all enemies in the line and freezes them in place for 2 rounds.",
      flavorText: "A beam that freezes the photons themselves.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 50, aoeShape: "line", aoeSize: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 4 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      debuffs: ["stasis"], visualTheme: "arcane", tags: ["line", "nuke", "mass-freeze", "chronarch"]
    },
    rankUpgrades: [
      { description: "60-foot line deals 8d10 force damage, freezes for 2 rounds, and cooldown drops to 16s.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 }, cooldownValue: 16 },
      { description: "70-foot line deals 10d10 force damage, pierces all durability/shields, and refunds 2 Time Shards.", primaryDamage: { dice: "10d10", flat: 0, procChance: 100 }, cooldownValue: 12 }
    ]
  },
  {
    id: "st_t4_dominion_authority",
    name: "Dominion of Stillness",
    icon: "spell_holy_borrowedtime",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "st_t3_fracture_mastery",
    spell: {
      name: "Dominion of Stillness",
      description: "You emit a 20-foot aura of dilated time: all enemy projectiles moving toward you slow by 50 points and enemies inside the aura have their movement speed halved.",
      flavorText: "The crown bestows authority over all that is and was.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "slow-aura", "defense", "chronarch"]
    },
    rankUpgrades: [
      { description: "Aura radius 30 feet: projectiles stop in mid-air and enemies inside cannot take dash actions or reactions." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "st_t5_temporal_shatter",
    name: "Temporal Shatterstorm",
    icon: "spell_fire_selfdestruct",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "st_t4_absolute_stasis_beam",
    spell: {
      name: "Temporal Shatterstorm",
      description: "Spend 4 Time Shards: shatter all active stasis fields across the battlefield. Deals 8d10 force damage to all affected enemies and stuns them for 1 round.",
      flavorText: "Resonance builds until time itself fractures.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 4 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "arcane", tags: ["detonate", "mass-nuke", "stun", "chronarch"]
    },
    rankUpgrades: [
      { description: "Deals 11d10 force damage, stuns for 2 rounds, and completely resets all Stasis ability cooldowns.", primaryDamage: { dice: "11d10", flat: 0, procChance: 100 }, cooldownValue: 18 }
    ]
  },
  {
    id: "st_t5_endless_stasis",
    name: "Chrono-Stasis Reservoir",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "st_t4_dominion_authority",
    spell: {
      name: "Chrono-Stasis Reservoir",
      description: "Your maximum Time Shard capacity increases by 4. Whenever an enemy is frozen in stasis, you gain 1 Time Shard per round they remain frozen.",
      flavorText: "Harvesting the unspent seconds of trapped foes.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "shard-engine", "chronarch"]
    },
    rankUpgrades: [
      { description: "Capacity +6; gain 2 Time Shards per round from frozen enemies and your movement speed increases by +15ft." },
      { description: "Capacity +8; gain 3 Time Shards per round from frozen foes and abilities cost 1 fewer Time Shard." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "st_t6_avatar_of_stasis",
    name: "Avatar of Stasis",
    icon: "spell_nature_timestop",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "st_t5_temporal_shatter",
    spell: {
      name: "Avatar of Stasis",
      description: "Spend 6 Time Shards: freeze ALL enemies within 50 feet in absolute stasis for 2 rounds (no saving throw allowed). All party members gain +100 points movement speed and automatic critical hits against frozen targets.",
      flavorText: "In that frozen breath between heartbeats, the archon imposes absolute will.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 6 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      debuffs: ["absolute-timestop"], visualTheme: "arcane", tags: ["mass-timestop", "no-save", "climax", "chronarch"]
    },
    rankUpgrades: []
  },
  {
    id: "st_t6_force_criticality",
    name: "Gravitational Rupture",
    icon: "spell_arcane_blast",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "st_t5_endless_stasis",
    spell: {
      name: "Gravitational Rupture",
      description: "All force and stasis damage you deal scores critical hits on 18+ and critical hits reduce your Strain by 2.",
      flavorText: "Frozen seconds shattered into hyper-dense impacts.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "arcane", tags: ["passive", "crit", "strain-reduce", "chronarch"]
    },
    rankUpgrades: [
      { description: "Critical hits on 17+; crits deal triple damage and reduce Strain by 4." }
    ]
  },
  {
    id: "st_t6_unmovable_presence",
    name: "Anchored in Eternity",
    icon: "ability_warrior_defensivestance",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "st_t5_endless_stasis",
    spell: {
      name: "Anchored in Eternity",
      description: "You cannot be moved, banished, displaced, stunned, or silenced. You gain +4 Durability Steps to equipped durability and +1 Damage Reduction.",
      flavorText: "A pillar around which time flows, unchanging.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "immunity", "durability", "chronarch"]
    },
    rankUpgrades: [
      { description: "Gain +6 Durability Steps to equipped durability, +2 Damage Reduction, and reflect 1d6 arcane damage back at attackers." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "st_t7_grand_chronal_cataclysm",
    name: "Grand Time-Lock Cataclysm",
    icon: "spell_nature_timestop",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "st_t6_avatar_of_stasis",
    spell: {
      name: "Grand Time-Lock Cataclysm",
      description: "ULTIMATE: Spend 8 Time Shards: freeze time across the entire battlefield for 1 minute for all enemies. You and your party take 3 full rounds of actions with infinite movement and guaranteed critical hits while the world stands completely still.",
      flavorText: "The master of time walks through a frozen world, deciding every fate.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 100,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 8 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      buffs: ["infinite-timestop"], visualTheme: "arcane", tags: ["ultimate", "capstone", "timestop", "chronarch"]
    },
    rankUpgrades: []
  },
  {
    id: "st_t7_stasis_doctrine",
    name: "Stasis Archon Doctrine",
    icon: "spell_holy_borrowedtime",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "st_t6_avatar_of_stasis",
    spell: {
      name: "Stasis Archon Doctrine",
      description: "All force, stasis, and temporal control damage you deal is increased by +1d6 damage.",
      flavorText: "The immutable clock ticks with absolute authority.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "arcane", tags: ["passive", "capstone", "damage", "chronarch"]
    },
    rankUpgrades: [
      { description: "All force/stasis damage increased by +1d8 damage." },
      { description: "All force/stasis damage increased by +1d8 damage." },
      { description: "All force/stasis damage increased by +2d8 damage." },
      { description: "All force/stasis damage increased by +2d8 damage, and Stasis Field costs 0 mana." }
    ]
  },
  {
    id: "st_t7_infinite_time_shards",
    name: "Infinite Shard Stream",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "st_t6_force_criticality",
    spell: {
      name: "Infinite Shard Stream",
      description: "At the start of every combat turn, you generate 3 Time Shards and your Strain decreases by 2.",
      flavorText: "An endless stream of crystallized potential.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "shard-engine", "chronarch"]
    },
    rankUpgrades: [
      { description: "Generate 5 Time Shards per turn and reduce Strain by 4." },
      { description: "Generate 7 Time Shards per turn, Strain never increases, and abilities cast instantly." }
    ]
  },
  {
    id: "st_t7_eternal_freeze",
    name: "Absolute Zero Stasis",
    icon: "spell_frost_stun",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "st_t6_force_criticality",
    spell: {
      name: "Absolute Zero Stasis",
      description: "Enemies frozen in stasis cannot take saving throws to break free, and their durability and resistances become 0 while frozen.",
      flavorText: "Matter itself ceases molecular motion.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "zero-resist", "chronarch"]
    },
    rankUpgrades: [
      { description: "Frozen enemies take +1d8 bonus arcane damage from all sources." },
      { description: "Frozen enemies take double damage, and if killed in stasis, freeze all adjacent foes for 2 rounds." }
    ]
  },
  {
    id: "st_t7_chronal_immortality",
    name: "Rewound Mortality",
    icon: "spell_holy_resurrection",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "st_t6_unmovable_presence",
    spell: {
      name: "Rewound Mortality",
      description: "While you maintain at least 4 Time Shards, lethal damage freezes your timeline instead: restores 2d6 Hit Points, 0 Strain, and freezes all enemies within 30 feet for 1 round (cooldown: 120s).",
      flavorText: "Death was scheduled. You canceled the appointment.",
      source: "talent", class: "Chronarch", treeId: "stasis",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "cheat-death", "chronarch"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 3d6 Hit Points, gain max Shards, freeze foes for 2 rounds (cooldown: 90s)." },
      { description: "Survive lethal damage, restores 4d6 Hit Points, and immediately activate Avatar of Stasis for free (cooldown: 60s)." }
    ]
  }
];

// ============================================
// 2. CHRONARCH — DISPLACEMENT TREE
// ============================================
export const CHRONARCH_DISPLACEMENT_TREE = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "dp_t1_temporal_blink",
    name: "Temporal Blink",
    icon: "spell_arcane_blink",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Temporal Blink",
      description: "Displace yourself through local space-time: teleport up to 35 feet to an unoccupied space. Gain 2 Time Shards and your next attack within 1 round deals +2d8 force damage.",
      flavorText: "You are not traveling through space; you are simply arriving earlier.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      buffs: ["blink-empower"], visualTheme: "arcane", tags: ["teleport", "mobility", "shards", "chronarch"]
    },
    rankUpgrades: [
      { description: "Teleport up to 45 feet, gain 3 Time Shards, next attack deals +3d8 force damage.", cooldownValue: 5 },
      { description: "Teleport up to 60 feet, gain 4 Time Shards, next attack deals +4d8 force damage and blinks you back if desired.", cooldownValue: 4 }
    ]
  },
  {
    id: "dp_t1_displacement_speed",
    name: "Spatial Acceleration",
    icon: "spell_nature_swiftness",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Spatial Acceleration",
      description: "Your movement speed is increased by +15 feet. Whenever you teleport, your movement speed increases by an additional +20 feet for 2 rounds.",
      flavorText: "Frictionless momentum through torn dimensional seams.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "speed", "mobility", "chronarch"]
    },
    rankUpgrades: [
      { description: "Speed +25 feet; teleporting grants +30ft speed and +2 Durability Steps to equipped durability." },
      { description: "Speed +35 feet; teleporting grants +40ft speed, +4 Durability Steps to equipped durability, and ignores difficult terrain." }
    ]
  },
  {
    id: "dp_t1_flicker_dodge",
    name: "Quantum Flicker",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Quantum Flicker",
      description: "While at 3 or more Time Shards, all attacks against you have a 25 points chance to phase through you harmlessly.",
      flavorText: "Existing across multiple spatial possibilities.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "evasion", "defense", "chronarch"]
    },
    rankUpgrades: [
      { description: "At 3+ Time Shards: attacks miss on 1-3 on a d6 (50 points evasion) and missed attacks grant you 1 Time Shard." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "dp_t2_rift_strike",
    name: "Spatial Rift Strike",
    icon: "spell_arcane_portalshattrath",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "dp_t1_temporal_blink",
    spell: {
      name: "Spatial Rift Strike",
      description: "Spend 2 Time Shards: tear open a spatial rift on an enemy within 45 feet. Deals 4d8 force damage, teleports the target 20 feet in any direction of your choice, and roots them for 1 round.",
      flavorText: "Displacing an enemy's anatomy across coordinates.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 2 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["displaced"], visualTheme: "arcane", tags: ["teleport-enemy", "damage", "reposition", "chronarch"]
    },
    rankUpgrades: [
      { description: "Deals 6d8 force damage, teleports target up to 35 feet, and knocks them prone.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } },
      { description: "Deals 8d8 force damage, teleports up to 50 feet, knocks prone, and collides with other enemies for 4d8 AoE damage.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "dp_t2_echo_trail",
    name: "Displacement Slipstream",
    icon: "spell_arcane_teleportshattrath",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "dp_t1_displacement_speed",
    spell: {
      name: "Displacement Slipstream",
      description: "Whenever you teleport, you leave behind a 20-foot spatial slipstream for 2 rounds: allies passing through it gain +20ft speed, while enemies take 2d8 force damage per round.",
      flavorText: "The wake left by tearing space.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "slipstream", "hazard", "chronarch"]
    },
    rankUpgrades: [
      { description: "Slipstream deals 3d8 force damage and slows enemies by 20ft." },
      { description: "Slipstream deals 5d8 force damage, blinds enemies, and grants allies 20 temporary health." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "dp_t3_wormhole_vortex",
    name: "Wormhole Singularity",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "dp_t2_rift_strike",
    spell: {
      name: "Wormhole Singularity",
      description: "Spend 3 Time Shards: link two locations within 60 feet with twin spatial wormholes for 1 minute. Allies and spells can pass instantly between them. Enemies entering take 5d10 force damage and are displaced randomly.",
      flavorText: "Distance folded into zero.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 3 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["portal", "wormhole", "mobility", "chronarch"]
    },
    rankUpgrades: [
      { description: "Enemies entering take 7d10 force damage and are stunned for 1 round.", primaryDamage: { dice: "7d10", flat: 0, procChance: 100 } },
      { description: "Enemies entering take 9d10 force damage, are stunned for 2 rounds, and allies gain +30 points damage after using wormhole.", primaryDamage: { dice: "9d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "dp_t3_spatial_shearing",
    name: "Dimensional Shearing",
    icon: "spell_arcane_blast",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "dp_t2_echo_trail",
    spell: {
      name: "Dimensional Shearing",
      description: "All your displacement and teleport attacks ignores 40 points of enemy durability and shields, dealing pure spatial shearing damage.",
      flavorText: "Armor cannot defend what is cut across dimensions.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "penetration", "true-damage", "chronarch"]
    },
    rankUpgrades: [
      { description: "ignores 70 points of enemy durability and shields, and critical strikes cause the target to hemorrhage 3d8 force damage." },
      { description: "Completely ignores 100 points of enemy durability/shields; critical strikes cause 5d8 force hemorrhage and silence for 1 round." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "dp_t4_chrono_barrage",
    name: "Omnipresent Barrage",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "dp_t3_wormhole_vortex",
    spell: {
      name: "Omnipresent Barrage",
      description: "Spend 4 Time Shards: exist at 5 locations simultaneously for 1 instant. Strike all enemies within a 35-foot area for 7d10 force damage, teleporting to any of the 5 positions upon completion.",
      flavorText: "To be everywhere at once is the simplest form of speed.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 4 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "7d10", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["omni-strike", "aoe", "nuke", "chronarch"]
    },
    rankUpgrades: [
      { description: "40-foot area deals 9d10 force damage, stuns all hit enemies for 1 round, cooldown drops to 16s.", primaryDamage: { dice: "9d10", flat: 0, procChance: 100 }, cooldownValue: 16 },
      { description: "45-foot area deals 12d10 force damage, stuns for 2 rounds, and refunds 2 Time Shards.", primaryDamage: { dice: "12d10", flat: 0, procChance: 100 }, cooldownValue: 12 }
    ]
  },
  {
    id: "dp_t4_displacement_siphon",
    name: "Kinetic Extraction",
    icon: "spell_shadow_lifedrain",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "dp_t3_spatial_shearing",
    spell: {
      name: "Kinetic Extraction",
      description: "Whenever you teleport or displace an enemy, you and all allies within 30 feet heal for 2d8 health and gain 10 points movement speed.",
      flavorText: "Harvesting the kinetic surplus of displaced mass.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "2d8", flat: 0 },
      visualTheme: "arcane", tags: ["passive", "heal-teleport", "sustain", "chronarch"]
    },
    rankUpgrades: [
      { description: "Heal for 4d8 health, speed +20 points, and overheal grants 30 temporary health.", healing: { dice: "4d8", flat: 0 } }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "dp_t5_spatial_collapse",
    name: "Dimensional Implosion",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "dp_t4_chrono_barrage",
    spell: {
      name: "Dimensional Implosion",
      description: "Spend 4 Time Shards: collapse all displaced rifts into a catastrophic singularity within 60 feet. Deals 9d10 force damage, pulls all enemies within 40 feet to the center, and crushes them for 4d10 additional damage.",
      flavorText: "Space snaps back like an overstretched rubber band.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 4 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "9d10", flat: 0, procChance: 100 },
      debuffs: ["crush"], visualTheme: "arcane", tags: ["vortex", "crush", "nuke", "chronarch"]
    },
    rankUpgrades: [
      { description: "Deals 12d10 initial damage + 6d10 crush damage, and roots all victims for 2 rounds.", primaryDamage: { dice: "12d10", flat: 0, procChance: 100 }, cooldownValue: 18 }
    ]
  },
  {
    id: "dp_t5_flicker_mastery",
    name: "Phase Shift Mastery",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "dp_t4_displacement_siphon",
    spell: {
      name: "Phase Shift Mastery",
      description: "Temporal Blink can be used twice per round and costs 0 mana. Teleporting removes all movement-impairing debuffs.",
      flavorText: "No chain can bind what does not stay in one dimension.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "free-teleport", "cleanse", "chronarch"]
    },
    rankUpgrades: [
      { description: "Temporal Blink can be used 3 times per round, grants +3 Durability Steps to equipped durability, and grants 1 round of invisibility on arrival." },
      { description: "Temporal Blink can be used UNLIMITED times per round (limited only by AP/Shards), grants 2 rounds invisibility and +5 Durability Steps to equipped durability." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "dp_t6_omnipresent_avatar",
    name: "Avatar of Omnipresence",
    icon: "spell_nature_astralrecal",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "dp_t5_spatial_collapse",
    spell: {
      name: "Avatar of Omnipresence",
      description: "Spend 6 Time Shards: ascend into the Omnipresent Entity for 1 minute: all physical attacks pass through you (100 points dodge), you can teleport anywhere on the battlefield as a free action without cooldown, and all your attacks strike from 4 directions simultaneously for quadruple damage.",
      flavorText: "You are not anywhere in particular. You are everywhere.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["omnipresent-avatar"], visualTheme: "arcane", tags: ["god-mode", "infinite-teleport", "avatar", "chronarch"]
    },
    rankUpgrades: []
  },
  {
    id: "dp_t6_warp_criticality",
    name: "Warp Acceleration",
    icon: "spell_arcane_blast",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "dp_t5_flicker_mastery",
    spell: {
      name: "Warp Acceleration",
      description: "All attacks made immediately after teleporting score critical hits on 17+ and deal triple critical damage.",
      flavorText: "Striking from the blind spot of space.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "crit", "teleport-amp", "chronarch"]
    },
    rankUpgrades: [
      { description: "Post-teleport attacks crit on 16+, deal quadruple critical damage, and refund 2 Time Shards." }
    ]
  },
  {
    id: "dp_t6_spatial_refraction",
    name: "Spatial Refraction Ward",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "dp_t5_flicker_mastery",
    spell: {
      name: "Spatial Refraction Ward",
      description: "When an enemy targets you with a ranged attack or single-target spell, you have a 50 points chance to redirect the attack to another enemy within 30 feet.",
      flavorText: "The bullet arrives at the wrong coordinate entirely.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "redirect", "defense", "chronarch"]
    },
    rankUpgrades: [
      { description: "75 points chance to redirect ranged attacks/spells to an enemy, and redirected attacks deal +1d8 bonus arcane damage." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "dp_t7_fracture_dimension",
    name: "Dimensional Shatter Cataclysm",
    icon: "spell_arcane_teleportshattrath",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "dp_t6_omnipresent_avatar",
    spell: {
      name: "Dimensional Shatter Cataclysm",
      description: "ULTIMATE: Spend 8 Time Shards: shatter the spatial geometry of the entire battlefield for 1 minute: all enemies are displaced into separate pocket dimensions, taking 6d10 force damage per round, while you and your allies can attack any target across dimensions freely.",
      flavorText: "The battlefield is divided into a hundred rooms. You hold the master key.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["arcane"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      buffs: ["pocket-dimension"], visualTheme: "arcane", tags: ["ultimate", "capstone", "dimensional-shatter", "chronarch"]
    },
    rankUpgrades: []
  },
  {
    id: "dp_t7_displacement_doctrine",
    name: "Displacement Doctrine",
    icon: "spell_arcane_blink",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "dp_t6_omnipresent_avatar",
    spell: {
      name: "Displacement Doctrine",
      description: "All force, spatial, and displacement damage you deal is increased by +1d6 damage.",
      flavorText: "Space folds willingly around the master.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "arcane", tags: ["passive", "capstone", "damage", "chronarch"]
    },
    rankUpgrades: [
      { description: "All force and spatial damage increased by +1d8 damage." },
      { description: "All force and spatial damage increased by +1d8 damage." },
      { description: "All force and spatial damage increased by +2d8 damage." },
      { description: "All force and spatial damage increased by +2d8 damage, and Temporal Blink grants 4 Time Shards." }
    ]
  },
  {
    id: "dp_t7_infinite_speed_matrix",
    name: "Spatial Singularity Matrix",
    icon: "spell_nature_swiftness",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "dp_t6_warp_criticality",
    spell: {
      name: "Spatial Singularity Matrix",
      description: "Your movement speed cannot be reduced below 40 feet, you can move through walls and objects freely, and you gain 2 Action Points per turn.",
      flavorText: "Physical obstacles are merely suggestions.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "noclip", "action-economy", "chronarch"]
    },
    rankUpgrades: [
      { description: "Speed floor 50 feet; pass through walls, gain 3 AP per turn, and attacks from inside walls ignore all durability." },
      { description: "Speed floor 60 feet; pass through walls, gain 4 AP per turn, and teleporting deals 4d8 AoE force damage." }
    ]
  },
  {
    id: "dp_t7_warp_echo_barrage",
    name: "Warp Echo Clones",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "dp_t6_warp_criticality",
    spell: {
      name: "Warp Echo Clones",
      description: "Whenever you teleport, leave behind an illusory temporal clone that mimics all your attacks for 1 round at 50 points damage.",
      flavorText: "The past self keeps fighting where you used to stand.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "clone", "echo-damage", "chronarch"]
    },
    rankUpgrades: [
      { description: "Clones deal 75 points damage and last 2 rounds." },
      { description: "Clones deal 100 points full damage, last 3 rounds, and explode for 5d8 force damage on expiration." }
    ]
  },
  {
    id: "dp_t7_phase_rebirth",
    name: "Phase Rebirth",
    icon: "spell_arcane_portalshattrath",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "dp_t6_spatial_refraction",
    spell: {
      name: "Phase Rebirth",
      description: "While at 3+ Time Shards, lethal damage displaces you to a safe coordinate: prevents death, restores 2d6 Hit Points, grants 50 temporary health, and makes you invisible for 2 rounds (cooldown: 120s).",
      flavorText: "The killing blow struck an empty coordinate.",
      source: "talent", class: "Chronarch", treeId: "displacement",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "cheat-death", "chronarch"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 3d6 Hit Points, 75 temp HP, gain max Shards (cooldown: 90s)." },
      { description: "Survive lethal damage, restores 4d6 Hit Points, and immediately trigger Omnipresent Barrage automatically for free (cooldown: 60s)." }
    ]
  }
];

// ============================================
// 3. CHRONARCH — REWINDING TREE
// ============================================
export const CHRONARCH_REWINDING_TREE = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "rw_t1_temporal_rewind",
    name: "Temporal Rewind",
    icon: "spell_holy_borrowedtime",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Temporal Rewind",
      description: "Rewind the timeline of an ally within 40 feet: restores all health lost during the previous round (minimum 2d8 healing) and cleanses 1 debuff. Grants 2 Time Shards.",
      flavorText: "Unwriting the injury before the flesh had time to accept it.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      healing: { dice: "2d8", flat: 0 },
      visualTheme: "arcane", tags: ["rewind", "healing", "cleanse", "chronarch"]
    },
    rankUpgrades: [
      { description: "Restores all health lost in previous round (minimum 4d8), cleanses 2 debuffs, and grants 3 Time Shards.", healing: { dice: "4d8", flat: 0 } },
      { description: "Restores all health lost in previous 2 rounds (minimum 6d8), cleanses ALL debuffs, grants 4 Time Shards, and refunds 1 AP to ally.", healing: { dice: "6d8", flat: 0 } }
    ]
  },
  {
    id: "rw_t1_paradox_prevention",
    name: "Paradox Insulation",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Paradox Insulation",
      description: "Whenever you heal an ally with rewind spells, you reduce your Temporal Strain by 2 and all allies within 20 feet gain +1 Durability Steps to equipped durability for 2 rounds.",
      flavorText: "Fixing paradoxes calms the temporal current.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "strain-reduction", "durability", "chronarch"]
    },
    rankUpgrades: [
      { description: "Reduces Strain by 3; allies gain +2 Durability Steps to equipped durability and 2 Damage Reduction to all damage." },
      { description: "Reduces Strain by 4; allies gain +3 Durability Steps to equipped durability, 4 Damage Reduction, and +15ft movement speed." }
    ]
  },
  {
    id: "rw_t1_echo_healing",
    name: "Chronal Echo Heal",
    icon: "spell_holy_renew",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Chronal Echo Heal",
      description: "All healing you perform repeats automatically 1 round later for 30 points of the original amount.",
      flavorText: "The restorative wave echoes back from the future.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "echo-heal", "hot", "chronarch"]
    },
    rankUpgrades: [
      { description: "Healing repeats 1 and 2 rounds later for 50 points of the original amount." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "rw_t2_undo_action",
    name: "Undo Fate",
    icon: "spell_nature_timestop",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "rw_t1_temporal_rewind",
    spell: {
      name: "Undo Fate",
      description: "Reaction (spend 2 Time Shards): when an enemy lands a critical hit or spell on you or an ally within 40 feet, undo the attack completely. The attack misses and the attacker takes 3d8 force damage in paradox feedback.",
      flavorText: "That strike never happened. The timeline disagrees.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 2 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["negate-attack", "reaction", "counter", "chronarch"]
    },
    rankUpgrades: [
      { description: "Feedback deals 5d8 force damage and silences attacker for 1 round.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, cooldownValue: 8 },
      { description: "Feedback deals 7d8 force damage, stuns attacker for 1 round, and refunds the 2 Time Shards.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 }, cooldownValue: 6 }
    ]
  },
  {
    id: "rw_t2_rewind_sunder",
    name: "Destiny Reversal",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "rw_t1_paradox_prevention",
    spell: {
      name: "Destiny Reversal",
      description: "Whenever an ally is healed by your rewind abilities, their next attack deals bonus force damage equal to 50 points of the health restored.",
      flavorText: "Suffering inverted into immediate violent retribution.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "heal-to-damage", "ally-empower", "chronarch"]
    },
    rankUpgrades: [
      { description: "Next attack deals bonus damage equal to 75 points of health restored." },
      { description: "Next attack deals bonus damage equal to 100 points of health restored and is a guaranteed critical hit." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "rw_t3_mass_rewind",
    name: "Rewind Battlefield",
    icon: "spell_holy_divinehymn",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "rw_t2_undo_action",
    spell: {
      name: "Rewind Battlefield",
      description: "Spend 3 Time Shards: rewind the state of all allies within 40 feet by 1 round: restores 4d8 health to each ally, cleanses all debuffs, and restores 1 Action Point to each ally.",
      flavorText: "Resetting the board to before the mistake was made.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 3 } },
      healing: { dice: "4d8", flat: 0 },
      visualTheme: "arcane", tags: ["mass-heal", "mass-cleanse", "action-restore", "chronarch"]
    },
    rankUpgrades: [
      { description: "Restores 6d8 health, cleanses debuffs, grants 2 AP to each ally, and gives 20 temporary health.", healing: { dice: "6d8", flat: 0 } },
      { description: "Restores 8d8 health, cleanses, grants 2 AP, 40 temp HP, and resets all ally reaction cooldowns.", healing: { dice: "8d8", flat: 0 } }
    ]
  },
  {
    id: "rw_t3_time_loop_protection",
    name: "Causal Anchor",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "rw_t2_rewind_sunder",
    spell: {
      name: "Causal Anchor",
      description: "You and all allies cannot have your maximum health reduced, cannot be aged or cursed, and gain 4 Damage Reduction from all magical sources.",
      flavorText: "An anchor pinning the party's fundamental reality.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "immunity", "dr", "chronarch"]
    },
    rankUpgrades: [
      { description: "Party takes 25 points less magical damage and gains +3 to all saving throws." },
      { description: "Party takes 40 points less magical damage, +5 to saving throws, and immune to instant-kill effects." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "rw_t4_entropy_reversal",
    name: "Entropy Inversion",
    icon: "spell_arcane_blast",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "rw_t3_mass_rewind",
    spell: {
      name: "Entropy Inversion",
      description: "Spend 4 Time Shards: invert the entropy of an enemy within 50 feet. Deals 6d10 force damage and rewinds all beneficial buffs and shields currently on the target, stripping them completely.",
      flavorText: "Stripping decades of enchantments in half a second.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 4 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      debuffs: ["dispel-all"], visualTheme: "arcane", tags: ["mass-dispel", "nuke", "strip-buffs", "chronarch"]
    },
    rankUpgrades: [
      { description: "Deals 8d10 force damage, strips all buffs, and converts stripped shields into damage dealt to the target.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 }, cooldownValue: 16 },
      { description: "Deals 10d10 force damage, strips buffs, converts shields to damage, and silences target for 2 rounds.", primaryDamage: { dice: "10d10", flat: 0, procChance: 100 }, cooldownValue: 12 }
    ]
  },
  {
    id: "rw_t4_undo_cooldowns",
    name: "Chrono-Recharge",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "rw_t3_time_loop_protection",
    spell: {
      name: "Chrono-Recharge",
      description: "Whenever you cast a rewind spell on an ally, all their ability cooldowns are reduced by 4 seconds.",
      flavorText: "Returning the spent breath to their lungs.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "cdr", "party-utility", "chronarch"]
    },
    rankUpgrades: [
      { description: "Ally cooldowns reduced by 8 seconds, and restores 10 mana to the ally." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "rw_t5_rewind_death",
    name: "Revoking the Reaper",
    icon: "spell_holy_resurrection",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "rw_t4_entropy_reversal",
    spell: {
      name: "Revoking the Reaper",
      description: "Spend 5 Time Shards: target a fallen ally within 60 feet who died in the past 2 rounds. Instantly resurrect them at 100 points full health and mana, unwriting their death entirely.",
      flavorText: "The grave had not yet set the lock.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 5 } },
      healing: { dice: "10d10", flat: 0 },
      visualTheme: "arcane", tags: ["resurrect", "instant", "climax", "chronarch"]
    },
    rankUpgrades: [
      { description: "Resurrects at 100 points HP/mana, grants 50 temporary health, and can be used on 2 fallen allies simultaneously.", cooldownValue: 45 }
    ]
  },
  {
    id: "rw_t5_eternal_undo",
    name: "Paradox Reversal Engine",
    icon: "spell_holy_borrowedtime",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "rw_t4_undo_cooldowns",
    spell: {
      name: "Paradox Reversal Engine",
      description: "Undo Fate can be used twice per round. Whenever you negate an attack with Undo Fate, gain 2 Time Shards and heal the target ally for 3d8.",
      flavorText: "Turning enemy successes into immediate team recovery.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "reaction-cap", "counter-heal", "chronarch"]
    },
    rankUpgrades: [
      { description: "Undo Fate usable 3 times per round; grants 3 Time Shards and heals for 5d8." },
      { description: "Undo Fate usable UNLIMITED times per round (costing 1 Shard each), grants 4 Shards, and heals for 7d8." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "rw_t6_the_grand_rewind",
    name: "The Grand Rewind",
    icon: "spell_nature_timestop",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "rw_t5_rewind_death",
    spell: {
      name: "The Grand Rewind",
      description: "Spend 6 Time Shards: rewind the ENTIRE ENCOUNTER state by 2 full rounds: all allies heal to the highest HP they had in that window, all dead allies revive, all spent party spell slots and cooldowns are restored, while enemy damage taken is KEPT.",
      flavorText: "Only the master remembers how badly the last two minutes almost went.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 100,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 6 } },
      healing: { dice: "10d10", flat: 0 },
      visualTheme: "arcane", tags: ["encounter-rewind", "mass-reset", "ultimate-save", "chronarch"]
    },
    rankUpgrades: []
  },
  {
    id: "rw_t6_causal_loop_heal",
    name: "Infinite Loop Healing",
    icon: "spell_holy_renew",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "rw_t5_eternal_undo",
    spell: {
      name: "Infinite Loop Healing",
      description: "All healing you perform grants affected allies a perpetual temporal regeneration: healing 2d8 health every round for the remainder of combat.",
      flavorText: "A healing rhythm locked into the future.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "2d8", flat: 0, isHoT: true, hotDuration: 99, hotTick: "2d8" },
      visualTheme: "arcane", tags: ["passive", "infinite-hot", "regen", "chronarch"]
    },
    rankUpgrades: [
      { description: "Regeneration heals 4d8 health per round permanently in combat, and grants +2 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "rw_t6_temporal_immunity",
    name: "Sanctuary of Untouchable Time",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "rw_t5_eternal_undo",
    spell: {
      name: "Sanctuary of Untouchable Time",
      description: "You and all allies within 30 feet gain 6 Damage Reduction from all sources, and any single attack dealing more than 50 points max HP is capped at 50 points.",
      flavorText: "No single blow can destroy what time continuously mends.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "damage-cap", "protection", "chronarch"]
    },
    rankUpgrades: [
      { description: "gain +2 Damage Reduction; single attack damage capped at 30 points max HP." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "rw_t7_avatar_of_chronos",
    name: "Avatar of the Eternal Return",
    icon: "spell_holy_borrowedtime",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "rw_t6_the_grand_rewind",
    spell: {
      name: "Avatar of the Eternal Return",
      description: "ULTIMATE: Spend 8 Time Shards: summon the Weaver of All Timelines for 1 minute: all allies are completely invulnerable to death (HP cannot drop below 1), all party cooldowns refresh every round, and any damage allies take is dealt back to enemies at 200 points.",
      flavorText: "The future and past collapse into an unassailable golden present.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { timeShards: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["eternal-return"], visualTheme: "arcane", tags: ["ultimate", "capstone", "invulnerable", "chronarch"]
    },
    rankUpgrades: []
  },
  {
    id: "rw_t7_rewind_doctrine",
    name: "Rewinding Chronomancer Doctrine",
    icon: "spell_holy_prayerofhealing",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "rw_t6_the_grand_rewind",
    spell: {
      name: "Rewinding Chronomancer Doctrine",
      description: "All healing, rewind, and paradox reversal spells you cast are increased in potency by 10 points.",
      flavorText: "The past yields to the master's touch.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "healing-boost", "chronarch"]
    },
    rankUpgrades: [
      { description: "All healing and rewind potency increased by +1d8 damage." },
      { description: "All healing and rewind potency increased by +1d8 damage." },
      { description: "All healing and rewind potency increased by +2d8 damage." },
      { description: "All healing and rewind potency increased by +2d8 damage, and Temporal Rewind costs 0 mana." }
    ]
  },
  {
    id: "rw_t7_infinite_rewind_engine",
    name: "Perpetual Time Shard Core",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "rw_t6_causal_loop_heal",
    spell: {
      name: "Perpetual Time Shard Core",
      description: "Your maximum Time Shards increase by 6. Whenever you or an ally casts a spell, you generate 1 Time Shard.",
      flavorText: "Every motion generates its own temporal battery.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "shard-engine", "chronarch"]
    },
    rankUpgrades: [
      { description: "Max Shards +10; generate 2 Time Shards on ally spell casts and party speed +15ft." },
      { description: "Max Shards +15; generate 3 Time Shards on all casts and Strain is completely eliminated." }
    ]
  },
  {
    id: "rw_t7_fate_shield",
    name: "Temporal Aegis",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "rw_t6_causal_loop_heal",
    spell: {
      name: "Temporal Aegis",
      description: "Whenever an ally receives healing above maximum health, they gain 100 points of the overheal as a permanent temporal damage shield (up to 50 temp HP).",
      flavorText: "Excess time wraps around the body like armor.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "overheal-shield", "chronarch"]
    },
    rankUpgrades: [
      { description: "Shield caps at 80 temp HP and reflects 25 points of absorbed damage as force." },
      { description: "Shield caps at 120 temp HP, reflects 50 points damage, and grants +3 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "rw_t7_immortal_chronomancer",
    name: "The Infinite Loop",
    icon: "spell_holy_resurrection",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "rw_t6_temporal_immunity",
    spell: {
      name: "The Infinite Loop",
      description: "While at 3+ Time Shards, lethal damage automatically triggers The Grand Rewind for free, resetting the entire encounter 2 rounds back and preventing death (cooldown: 120s).",
      flavorText: "You cannot die; you merely return to before you made the error.",
      source: "talent", class: "Chronarch", treeId: "rewinding",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "cheat-death", "chronarch"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, triggers Grand Rewind, restores 3d6 Hit Points to all party members (cooldown: 90s)." },
      { description: "Survive lethal damage, triggers Grand Rewind, restores 4d6 Hit Points, and activates Avatar of the Eternal Return for free (cooldown: 60s)." }
    ]
  }
];
