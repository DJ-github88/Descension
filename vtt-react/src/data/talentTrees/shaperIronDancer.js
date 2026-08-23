// ============================================
// SHAPER — IRON DANCER (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The duelist tree: Arterial Strike + Deadened Bastion, counters, duels.
// ============================================

export const SHAPER_IRON_DANCER = [
  {
    id: "id_t1_precision_edge",
    name: "Precision Edge",
    icon: "ability_duelist",
    maxRanks: 3,
    position: { x: 0, y: 0 },
    requires: null,
    spell: {
      name: "Precision Edge",
      description: "Your critical hit range increases by 1 (crit on 19-20).",
      flavorText: "The edge knows where the seams are.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["passive", "crit", "shaper"]
    },
    rankUpgrades: [
      { description: "Your critical hit range increases by 1 (19-20), and Arterial Strike form grants +1 initiative." },
      { description: "Crit range 19-20, Arterial Strike grants +2 initiative, and Deadened Bastion ripostes deal +1d4 damage.", primaryDamage: { dice: "1d4", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "id_t1_arterial_strike",
    name: "Arterial Strike",
    icon: "ability_rogue_tilotomastery",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Arterial Strike",
      description: "Enter Arterial Strike form for 1 minute: your weapon attacks deal 1d6 additional slicing damage, and critical hits generate 1 Flux. Costs 2 Flux.",
      flavorText: "Anatomy, applied at speed.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 2 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["slicing"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      buffs: ["arterial"], visualTheme: "primal", tags: ["form", "damage", "shaper"]
    },
    rankUpgrades: [
      { description: "Enter Arterial Strike form: weapon attacks deal 2d6 additional slicing damage, crits generate 1 Flux. Costs 2 Flux.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Enter Arterial Strike form: weapon attacks deal 3d6 additional slicing damage, crits generate 2 Flux. Costs 2 Flux.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "id_t1_deadened_bastion",
    name: "Deadened Bastion",
    icon: "ability_warrior_shieldwall",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Deadened Bastion",
      description: "Enter Deadened Bastion form for 1 minute: +2 Durability Steps to equipped durability, and when an enemy misses you in melee, riposte for 1d6 slicing damage. Costs 2 Flux.",
      flavorText: "Groven ancestor-bridges calcify into something stronger.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 2 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["slicing"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      buffs: ["bastion"], visualTheme: "primal", tags: ["form", "defense", "riposte", "shaper"]
    },
    rankUpgrades: [
      { description: "Enter Deadened Bastion form: +3 Durability Steps to equipped durability, missed melee attackers take 2d6 slicing riposte. Costs 2 Flux.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "id_t2_perfect_timing",
    name: "Perfect Timing",
    icon: "ability_rogue_quickrecovery",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "id_t1_arterial_strike",
    spell: {
      name: "Perfect Timing",
      description: "Once per turn, spend 2 Flux to attack as a reaction when an enemy within 30 feet attacks.",
      flavorText: "Their swing starts. Yours already finished.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["passive", "reaction", "shaper"]
    },
    rankUpgrades: [
      { description: "Once per turn, spend 2 Flux to react-attack when an enemy within 30 feet attacks; your reaction attack has advantage." },
      { description: "Twice per turn, spend 2 Flux to react-attack enemies within 45 feet with advantage." }
    ]
  },
  {
    id: "id_t2_defensive_stance",
    name: "Defensive Stance",
    icon: "ability_warrior_shieldwall",
    maxRanks: 3,
    position: { x: 3.5, y: 1 },
    requires: "id_t1_deadened_bastion",
    spell: {
      name: "Defensive Stance",
      description: "Deadened Bastion grants +2 to all saves, and while in Deadened Bastion you may spend 1 Flux to reduce incoming damage by 1d8.",
      flavorText: "The bridge takes the load. That is what bridges are for.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "bastion", "mitigation", "shaper"]
    },
    rankUpgrades: [
      { description: "Deadened Bastion grants +3 to all saves; spend 1 Flux to reduce incoming damage by 2d8." },
      { description: "Deadened Bastion grants +4 to all saves; spend 1 Flux to reduce damage by 3d8, and the reduction applies to your adjacent allies as well." }
    ]
  },

  {
    id: "id_t2_dueling_mastery",
    name: "Dueling Mastery",
    icon: "ability_warrior_savageblow",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: null,
    spell: {
      name: "Dueling Mastery",
      description: "Challenge a single enemy within 30 feet as 1 Action Point: for 1 minute, you both have advantage on attacks against each other but cannot attack anyone else.",
      flavorText: "The duel is a room with two doors. Both are locked.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 5 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["duel"], visualTheme: "primal", tags: ["duel", "control", "shaper"]
    },
    rankUpgrades: [
      { description: "Challenge an enemy for 1 minute: you have advantage against each other, and YOU may ignore the restriction to attack others." },
      { description: "Challenge an enemy for 1 minute: advantage for you, disadvantage for them within the duel, and duel-marks who break it are stunned for 1 round." }
    ]
  },
  {
    id: "id_t2_counter_mastery",
    name: "Counter Mastery",
    icon: "ability_parry",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: null,
    spell: {
      name: "Counter Mastery",
      description: "Deadened Bastion ripostes trigger as reactions to ANY attack (melee, ranged, or spell), and riposte damage is doubled.",
      flavorText: "Everything is melee if you counter hard enough.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["slicing"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "bastion", "riposte", "shaper"]
    },
    rankUpgrades: [
      { description: "Bastion ripostes trigger on any attack and deal 3d6 slicing damage.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Bastion ripostes trigger on any attack, deal 4d6 slicing damage, and interrupted spells fail.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "id_t3_serpents_precision",
    name: "Serpent's Precision",
    icon: "ability_hunter_snipershot",
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: "id_t2_dueling_mastery",
    spell: {
      name: "Serpent's Precision",
      description: "While in Arterial Strike, your critical hit range increases by 1, and critical hits generate 1 extra Flux.",
      flavorText: "The serpent strikes once. The strike is enough.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["passive", "arterial", "crit", "shaper"]
    },
    rankUpgrades: [
      { description: "While in Arterial Strike, crit range +1 (total 18-20) and crits generate 2 extra Flux." },
      { description: "While in Arterial Strike, crit range +2 (total 17-20), crits generate 2 Flux, and crits ignore durability." }
    ]
  },
  {
    id: "id_t3_trait_harvest",
    name: "Trait Harvest",
    icon: "spell_shadow_possession",
    maxRanks: 2,
    position: { x: 2.5, y: 2 },
    requires: "id_t2_counter_mastery",
    spell: {
      name: "Trait Harvest",
      description: "Groven ancestor-bridges calcify into something stronger. When you reduce an enemy to 0 health, harvest one passive trait it had (a resistance, movement type, or bonus) for the rest of combat. Costs 1 Body Toll per trait.",
      flavorText: "The dead do not need their tricks. You keep them in trust.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self",       visualTheme: "primal", tags: ["passive", "harvest", "kill", "shaper"]
    },
    rankUpgrades: [
      { description: "Harvest a trait from your kills for the rest of combat; you may hold 2 harvested traits at once (1 Body Toll each)." }
    ]
  },

  {
    id: "id_t4_duelists_focus",
    name: "Duelist's Focus",
    icon: "ability_warrior_focusedrage",
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: "id_t3_serpents_precision",
    spell: {
      name: "Duelist's Focus",
      description: "You have advantage on attacks against enemies you damaged this turn, persisting until the start of your next turn.",
      flavorText: "Attention is a blade. You hold the point.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["passive", "advantage", "shaper"]
    },
    rankUpgrades: [
      { description: "Advantage on attacks against enemies you damaged this turn, and they have disadvantage on attacks against you." },
      { description: "Advantage against all enemies you touched this turn, their disadvantage against you, and your first attack each turn against each such enemy deals +1d8 slicing.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "id_t4_unyielding_blade",
    name: "Unyielding Blade",
    icon: "ability_warrior_weaponmastery",
    maxRanks: 2,
    position: { x: 2.5, y: 3 },
    requires: "id_t3_trait_harvest",
    spell: {
      name: "Unyielding Blade",
      description: "Groven ancestor-bridges calcify into something stronger. You cannot be disarmed, and Deadened Bastion prevents you from being moved against your will.",
      flavorText: "The hand and the steel share a skeleton now.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "tenacity", "bastion", "shaper"]
    },
    rankUpgrades: [
      { description: "You cannot be disarmed or moved against your will, and your weapon cannot be damaged or sundered by any means." }
    ]
  },

  {
    id: "id_t5_blade_dance",
    name: "Blade Dance",
    icon: "ability_rogue_slicedice",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "id_t4_duelists_focus",
    spell: {
      name: "Blade Dance",
      description: "While in Arterial Strike or Deadened Bastion, each attack action has a 20 points chance to strike a second time against the same target or a target within 10 feet.",
      flavorText: "One dancer. Two blades. No survivors.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["passive", "multi-attack", "forms", "shaper"]
    },
    rankUpgrades: [
      { description: "While in Arterial Strike or Deadened Bastion, each attack action has a 30 points chance to strike a second time against a target within 15 feet; the second strike deals full damage." }
    ]
  },
  {
    id: "id_t5_iron_skin",
    name: "Iron Skin",
    icon: "spell_nature_skinofearth",
    maxRanks: 2,
    position: { x: 3.5, y: 4 },
    requires: "id_t4_unyielding_blade",
    spell: {
      name: "Iron Skin",
      description: "The calcified bridge-armors your form. While any Shaper form is active, you gain +2 Durability Steps to equipped durability.",
      flavorText: "Iron is a state of mind with excellent structural properties.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "defense", "forms", "shaper"]
    },
    rankUpgrades: [
      { description: "While any form is active, gain +3 Durability Steps to equipped durability and 2 Damage Reduction to smashing, stabbing, and slicing damage.", damageTypes: ["smashing", "stabbing", "slicing"] }
    ]
  },
  {
    id: "id_t6_grand_challenge",
    name: "Grand Challenge",
    icon: "ability_warrior_battleshout",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "id_t4_unyielding_blade",
    spell: {
      name: "Grand Challenge",
      description: "Challenge all enemies within 30 feet for 1 minute: you have advantage on all attacks, and challenged enemies have disadvantage on attacks targeting anyone but you. Costs all current Flux (minimum 4) and 2 Body Toll.",
      flavorText: "Everyone is invited. Attendance is mandatory.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["challenged"], visualTheme: "primal", tags: ["taunt", "aoe", "duel", "shaper"]
    }
  },

  {
    id: "id_t7_perfect_dancer",
    name: "Perfect Dancer",
    icon: "ability_warrior_bladestorm",
    maxRanks: 1,
    position: { x: 4, y: 6 },
    requires: "id_t5_blade_dance",
    spell: {
      name: "Perfect Dancer",
      description: "ULTIMATE: Become the duel incarnate for 1 minute — Arterial Strike and Deadened Bastion are active simultaneously, every attack strikes twice with advantage, ripostes trigger on all attacks without cost, and enemies you challenge cannot attack anyone but you. Costs all current Flux (minimum 6) and 3 Body Toll.",
      flavorText: "The dance has one dancer left. It was always going to end this way.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 12 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["perfect-dancer"], damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["ultimate", "capstone", "transform", "shaper"]
    }
  },
  {
    id: "id_t7_calcified_edge",
    name: "Calcified Edge",
    icon: "ability_duelist",
    maxRanks: 5,
    position: { x: 0, y: 6 },
    requires: "id_t5_blade_dance",
    spell: {
      name: "Calcified Edge",
      description: "The ancestor-bridges sharpen everything. All slicing damage you deal is increased by +1d6 damage.",
      flavorText: "Sharper through mineral deposits.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["passive", "capstone", "damage", "shaper"]
    },
    rankUpgrades: [
      { description: "The ancestor-bridges sharpen everything. All slicing damage you deal is increased by +1d8 damage." },
      { description: "The ancestor-bridges sharpen everything. All slicing damage you deal is increased by +1d8 damage." },
      { description: "The ancestor-bridges sharpen everything. All slicing damage you deal is increased by +2d8 damage." },
      { description: "The ancestor-bridges sharpen everything. All slicing damage you deal is increased by +2d8 damage, and Arterial Strike form costs 1 Flux." }
    ]
  },
  {
    id: "id_t7_riposte_doctrine",
    name: "Riposte Doctrine",
    icon: "ability_parry",
    maxRanks: 3,
    position: { x: 1.5, y: 6 },
    requires: "id_t5_blade_dance",
    spell: {
      name: "Riposte Doctrine",
      description: "Counter Mastery ripostes also generate 1 Flux each.",
      flavorText: "Every parry refills the reservoir.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["passive", "capstone", "engine", "shaper"]
    },
    rankUpgrades: [
      { description: "Counter Mastery ripostes generate 2 Flux each and heal you 2 health." },
      { description: "Ripostes generate 3 Flux, heal 3 health, and every third riposte is an automatic critical." }
    ]
  },
  {
    id: "id_t7_duelists_resolve",
    name: "Duelist's Resolve",
    icon: "ability_warrior_focusedrage",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "id_t6_grand_challenge",
    spell: {
      name: "Duelist's Resolve",
      description: "Duels sharpen conviction. While an enemy is affected by your Dueling Mastery or Grand Challenge, you gain 2 Damage Reduction from all other enemies.",
      flavorText: "The audience cannot touch the dancers.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "duel", "defense", "shaper"]
    },
    rankUpgrades: [
      { description: "While an enemy is dueling you, you gain 4 Damage Reduction from all other enemies." },
      { description: "While dueling, you gain 6 Damage Reduction from others and cannot be critically hit by them." }
    ]
  },
  {
    id: "id_t7_bridges_bounty",
    name: "Bridge's Bounty",
    icon: "spell_shadow_possession",
    maxRanks: 3,
    position: { x: 0.5, y: 6 },
    requires: "id_t6_grand_challenge",
    spell: {
      name: "Bridge's Bounty",
      description: "Harvested traits linger past the fight. One harvested trait per combat persists into the next short rest.",
      flavorText: "Some inheritances outlive the estate.",
      source: "talent", class: "Shaper", treeId: "iron-dancer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "harvest", "shaper"]
    },
    rankUpgrades: [
      { description: "Two harvested traits persist through a short rest, and harvesting no longer costs Body Toll." },
      { description: "Three harvested traits persist through short rests, harvesting is free, and traits persist through long rests at half strength." }
    ]
  }
];
