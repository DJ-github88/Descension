// ============================================
// BERSERKER — PRIMAL RAGE (v4: Rebalanced Tier Budgets, Normalized Grid Coordinates)
// Schema: see talentSystem.mjs.
// Grid coordinates: x (0..4), y (0..6 representing Tiers 1..7).
//
// FANTASY: The Unstoppable Juggernaut / Escalating Fury / Colossal Slams & Shouts.
// ============================================

export const BERSERKER_PRIMAL_RAGE = [
  // ──────────────── TIER 1 (Row 0) ────────────────
  {
    id: "prg_t1_savage_leap",
    name: "Savage Leap",
    icon: "ability_warrior_savageblow",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Savage Leap",
      description: "Spend 1 AP: Leap up to 30 feet to an enemy, crashing down for 1d8 smashing damage and generating 10 Blood-Heat.",
      flavorText: "The fastest route between two points is an angry warrior.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      damageTypes: ["smashing"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["gap-closer", "mobility", "rage-state", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 2d6 smashing damage and slows target movement by 10 feet for 1 round.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Deals 2d8 smashing damage and knocks target Prone on a failed Strength save.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "prg_t1_inner_fire",
    name: "Inner Furnace",
    icon: "spell_fire_innerfire",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Inner Furnace",
      description: "Passive: Your melee weapon attacks deal +1d4 bonus physical damage while in Frenzied or higher Rage State.",
      flavorText: "The fire in the belly stokes every swing.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["smashing"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "bloodheat", "damage", "berserker"]
    },
    rankUpgrades: [
      { description: "Bonus damage increases to +1d6 physical damage." },
      { description: "Bonus damage increases to +1d8 physical damage and attacks generate +5 additional Blood-Heat." }
    ]
  },
  {
    id: "prg_t1_iron_hide",
    name: "Thickened Sinew",
    icon: "ability_warrior_defensivestance",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Thickened Sinew",
      description: "Passive: You gain +1 Damage Reduction against physical attacks and +1 to Fortitude saves.",
      flavorText: "Hardened by countless bludgeonings.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "dr", "defense", "berserker"]
    },
    rankUpgrades: [
      { description: "Gain +2 Damage Reduction against physical attacks and +2 to Fortitude saves." }
    ]
  },

  // ──────────────── TIER 2 (Row 1) ────────────────
  {
    id: "prg_t2_battle_cry",
    name: "Challenging Roar",
    icon: "ability_warrior_warcry",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "prg_t1_savage_leap",
    spell: {
      name: "Challenging Roar",
      description: "Spend 1 AP: Let loose a terrifying roar. Enemies within 20 feet must succeed on a Will save or suffer -1 to attack rolls against targets other than you for 2 rounds.",
      flavorText: "Focus all their hatred upon the true threat.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "debuff",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 20, rangeType: "ranged", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      visualTheme: "primal", tags: ["shout", "taunt", "debuff", "berserker"]
    },
    rankUpgrades: [
      { description: "Enemies suffer -2 to attack rolls and generate 10 Blood-Heat for you upon roar." },
      { description: "Enemies suffer -2 to attack rolls, and you gain 10 temporary Hit Points." }
    ]
  },
  {
    id: "prg_t2_crushing_momentum",
    name: "Crushing Momentum",
    icon: "ability_warrior_decisivestrike",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "prg_t1_iron_hide",
    spell: {
      name: "Crushing Momentum",
      description: "Passive: Moving at least 15 feet in a straight line before an attack adds +1d6 smashing damage to the strike.",
      flavorText: "Mass times acceleration equals broken bones.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["smashing"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "momentum", "charge", "berserker"]
    },
    rankUpgrades: [
      { description: "Momentum bonus increases to +1d8 smashing damage." },
      { description: "Momentum bonus increases to +2d6 smashing damage and pushes target 5 feet back." }
    ]
  },

  // ──────────────── TIER 3 (Row 2) ────────────────
  {
    id: "prg_t3_carnage_cleave",
    name: "Carnage Cleave",
    icon: "ability_warrior_cleave",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "prg_t2_battle_cry",
    spell: {
      name: "Carnage Cleave",
      description: "Spend 1 AP and 20 Blood-Heat: Swing your weapon in a 10-foot wide arc dealing 2d8 slicing damage to up to 3 adjacent enemies and sundering 1 point of Armor.",
      flavorText: "One wide sweep to clear the circle.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "cone", aoeSize: 10, rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["aoe", "cleave", "armor-shred", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 2d10 slicing damage and sunders 2 Armor.", primaryDamage: { dice: "2d10", flat: 0, procChance: 100 } },
      { description: "Deals 3d8 slicing damage, sunders 2 Armor, and grants you +1 DR for 1 round per enemy hit.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "prg_t3_unyielding_fury",
    name: "Unyielding Fury",
    icon: "ability_warrior_endurance",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "prg_t2_crushing_momentum",
    spell: {
      name: "Unyielding Fury",
      description: "Passive: When you take damage, gain 5 Blood-Heat. While at Carnage or higher Rage State, you are immune to Fear and Slow effects.",
      flavorText: "Wrath burns away doubt and hesitation.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "immunity", "rage", "berserker"]
    },
    rankUpgrades: [
      { description: "Taking damage generates 8 Blood-Heat; gain +1 to hit while below half health." },
      { description: "Taking damage generates 10 Blood-Heat; gain +2 to hit and +1 DR while below half health." }
    ]
  },

  // ──────────────── TIER 4 (Row 3) ────────────────
  {
    id: "prg_t4_cataclysmic_blow",
    name: "Cataclysmic Blow",
    icon: "ability_warrior_groundslam",
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: ["prg_t3_carnage_cleave", "prg_t3_unyielding_fury"],
    spell: {
      name: "Cataclysmic Blow",
      description: "Spend 1 AP and 30 Blood-Heat: Slam your weapon into the ground, dealing 2d10 smashing damage to all enemies within 15 feet and knocking them Prone on a failed Fortitude save.",
      flavorText: "When the titan falls, the earth shakes.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 15, rangeType: "ranged", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d10", flat: 0, procChance: 100 },
      damageTypes: ["smashing"],
      visualTheme: "primal", tags: ["aoe", "slam", "knockdown", "berserker"]
    }
  },

  // ──────────────── TIER 5 (Row 4) ────────────────
  {
    id: "prg_t5_seismic_roar",
    name: "Seismic Roar",
    icon: "spell_nature_thunderclap",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "prg_t4_cataclysmic_blow",
    spell: {
      name: "Seismic Roar",
      description: "Spend 1 AP and 25 Blood-Heat: Bellow with sonic fury. Deals 2d6 sonic damage to enemies within 20 feet and Dazes them for 1 round.",
      flavorText: "Shattering stones with vocal thunder.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 20, rangeType: "ranged", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      damageTypes: ["sonic"],
      visualTheme: "primal", tags: ["shout", "daze", "aoe", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 2d8 sonic damage and forces spellcasters to lose concentration.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Deals 3d6 sonic damage, Stuns enemies for 1 round on a failed Fortitude save.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "prg_t5_unbreakable_stance",
    name: "Unstoppable Bulk",
    icon: "ability_warrior_shieldwall",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "prg_t4_cataclysmic_blow",
    spell: {
      name: "Unstoppable Bulk",
      description: "Passive: You cannot be pushed, pulled, or knocked Prone against your will, and you gain +3 Armor.",
      flavorText: "Rooted like a mountain.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "armor", "stability", "berserker"]
    },
    rankUpgrades: [
      { description: "Gain +4 Armor and 2 Damage Reduction against all attacks." }
    ]
  },

  // ──────────────── TIER 6 (Row 5) ────────────────
  {
    id: "prg_t6_obliterating_strike",
    name: "Obliterating Strike",
    icon: "ability_warrior_bloodstorm",
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: ["prg_t5_seismic_roar", "prg_t5_unbreakable_stance"],
    spell: {
      name: "Obliterating Strike",
      description: "Spend 2 AP and 50 Blood-Heat: Deliver a world-shattering melee strike dealing 4d8 smashing damage, bypassing all enemy Armor, and knocking the target 20 feet back.",
      flavorText: "The culmination of unstoppable physical power.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2,
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      damageTypes: ["smashing"],
      visualTheme: "primal", tags: ["strike", "nuke", "armor-pierce", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 4d10 smashing damage and stuns the target for 1 round if slammed into a wall.", primaryDamage: { dice: "4d10", flat: 0, procChance: 100 } },
      { description: "Deals 5d8 smashing damage and creates a 15-foot shockwave dealing 2d6 damage to all nearby foes.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 7 (Row 6 - Capstones) ────────────────
  {
    id: "prg_t7_berserker_god",
    name: "Avatar of Primal Wrath",
    icon: "spell_fire_soulburn",
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: "prg_t6_obliterating_strike",
    spell: {
      name: "Avatar of Primal Wrath",
      description: "ULTIMATE: Spend 2 AP: For 2 rounds, enter the permanent Obliteration State. Your melee strikes deal +1d10 physical damage, your attacks hit all adjacent foes, and you gain +4 Damage Reduction.",
      flavorText: "You are no longer a mortal warrior. You are a natural disaster with a blade.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 5, cooldownUnit: "rounds",
      visualTheme: "primal", tags: ["ultimate", "juggernaut", "buff", "berserker"]
    }
  },
  {
    id: "prg_t7_titan_heart",
    name: "Titan Heart",
    icon: "spell_holy_blessingofstrength",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "prg_t6_obliterating_strike",
    spell: {
      name: "Titan Heart",
      description: "Passive: Maximum health increases by 15 Hit Points, and your minimum Rage State cannot drop below Frenzied in combat.",
      flavorText: "A heart forged in glacial fires.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "hp", "rage-floor", "berserker"]
    },
    rankUpgrades: [
      { description: "Maximum health increases by 25 Hit Points, and minimum Rage State cannot drop below Carnage." }
    ]
  },
  {
    id: "prg_t7_earthshaker_impact",
    name: "Earthshaker Impact",
    icon: "spell_nature_earthquake",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "prg_t6_obliterating_strike",
    spell: {
      name: "Earthshaker Impact",
      description: "Passive: All your critical hits shatter the earth in a 10-foot radius, dealing 2d8 smashing damage to adjacent enemies and knocking them Prone.",
      flavorText: "The ground splits beneath your fury.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["smashing"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "crit-quake", "berserker"]
    },
    rankUpgrades: [
      { description: "Quake deals 3d8 smashing damage and generates 15 Blood-Heat." }
    ]
  }
];
