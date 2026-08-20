// ============================================
// PYROFIEND — INFERNO (v3: Rebalanced Tier Budgets, Normalized Grid Coordinates)
// Schema: see talentSystem.mjs.
// Grid coordinates: x (0..4), y (0..6 representing Tiers 1..7).
//
// FANTASY: The Concentrated Crucible / Thermal Ascension / Armor Melting Nuke.
// ============================================

export const PYROFIEND_INFERNO = [
  // ──────────────── TIER 1 (Row 0) ────────────────
  {
    id: "inf_t1_burst_mastery",
    name: "Crucible Reach",
    icon: "spell_fire_fireball02",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Crucible Reach",
      description: "Passive: Your single-target ember spells gain +5 feet range.",
      flavorText: "The furnace does not need to be close. It needs to be felt.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "range", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Your single-target ember spells gain +10 feet range." },
      { description: "Your single-target ember spells gain +15 feet range and ignore partial cover." }
    ]
  },
  {
    id: "inf_t1_rapid_ascent",
    name: "Thermal Vent",
    icon: "spell_fire_soulburn",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Thermal Vent",
      description: "Spend 1 Action Point: Vent concentrated heat, reducing your Heat / Inferno Level by 1 and dealing 1d6 ember damage to an adjacent enemy.",
      flavorText: "Climbing down the mountain of fire, one deliberate step.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 1,
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      damageTypes: ["ember"],
      visualTheme: "fire", tags: ["heat-vent", "control", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Reduces Inferno Level by 2 and deals 1d8 ember damage.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "Reduces Inferno Level by 2, deals 2d6 ember damage, and pushes the target 5 feet back.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "inf_t1_inner_fire",
    name: "Tempered Core",
    icon: "spell_fire_flamebolt",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Tempered Core",
      description: "Passive: You gain +2 Fire / Ember Resistance and take 1 less damage from your own heat drawbacks.",
      flavorText: "You stopped flinching at heat years ago. Heat started flinching at you.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "resistance", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Gain +4 Fire Resistance and take 2 less damage from heat drawbacks." }
    ]
  },

  // ──────────────── TIER 2 (Row 1) ────────────────
  {
    id: "inf_t2_critical_blast",
    name: "Searing Retort",
    icon: "spell_fire_incinerate",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "inf_t1_burst_mastery",
    spell: {
      name: "Searing Retort",
      description: "Passive: When you take ember or physical damage, your next ember attack deals +1d4 bonus ember damage.",
      flavorText: "Hit me again. I insist.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "retaliation", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Bonus damage increases to +1d6 ember damage." },
      { description: "Bonus damage increases to +1d8 ember damage and generates 1 Heat." }
    ]
  },
  {
    id: "inf_t2_detonation",
    name: "Flash Ignition",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "inf_t1_inner_fire",
    spell: {
      name: "Flash Ignition",
      description: "Spend 1 AP: Ignite a sudden thermal burst within 40 feet dealing 1d8 ember damage and melting 1 point of enemy Armor for 2 rounds.",
      flavorText: "Metal turns butter-soft under intense pressure.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      damageTypes: ["ember"],
      visualTheme: "fire", tags: ["strike", "armor-shred", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Deals 2d6 ember damage and shreds 2 points of Armor.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Deals 2d8 ember damage, shreds 2 points of Armor, and inflicts Burning (1d4/rd for 2 rounds).", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 3 (Row 2) ────────────────
  {
    id: "inf_t3_fiery_resurgence",
    name: "Molten Ground",
    icon: "spell_fire_fire",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "inf_t2_critical_blast",
    spell: {
      name: "Molten Ground",
      description: "Spend 1 AP: Superheat a 10-foot area within 50 feet for 2 rounds. Enemies entering or ending their turn inside take 1d6 ember damage.",
      flavorText: "Zoning permit granted by Emberspire.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "aoe", rangeType: "ranged", range: 50, aoeShape: "circle", aoeSize: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      damageTypes: ["ember"],
      visualTheme: "fire", tags: ["terrain", "zone", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Area expands to 15 feet and deals 1d8 ember damage.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "Area deals 2d6 ember damage and slows enemy movement by 10 feet.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "inf_t3_immolation",
    name: "Thermal Aura",
    icon: "spell_fire_sealoffire",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "inf_t2_detonation",
    spell: {
      name: "Thermal Aura",
      description: "Passive: Enemies within 5 feet of you suffer 2 ember damage at the start of their turns.",
      flavorText: "Personal space, enforced thermally.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "aura", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Enemies within 5 feet take 4 ember damage." },
      { description: "Enemies within 10 feet take 6 ember damage." }
    ]
  },

  // ──────────────── TIER 4 (Row 3) ────────────────
  {
    id: "inf_t4_overcharge",
    name: "Combustion Spear",
    icon: "spell_fire_moltenblood",
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: ["inf_t3_fiery_resurgence", "inf_t3_immolation"],
    spell: {
      name: "Combustion Spear",
      description: "Spend 1 AP: Hurl a piercing lance of white-hot plasma within 50 feet dealing 2d10 ember damage and ignoring all Armor.",
      flavorText: "A direct conduit from the core to the target.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d10", flat: 0, procChance: 100 },
      damageTypes: ["ember"],
      visualTheme: "fire", tags: ["strike", "pierce", "pyrofiend"]
    }
  },

  // ──────────────── TIER 5 (Row 4) ────────────────
  {
    id: "inf_t5_maximum_power",
    name: "Crucible Intensity",
    icon: "spell_fire_twilightfireward",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "inf_t4_overcharge",
    spell: {
      name: "Crucible Intensity",
      description: "Passive: While your Heat / Inferno level is 4 or higher, your single-target spells deal +1d6 bonus ember damage.",
      flavorText: "At the peak of the furnace, everything turns white.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "scaling", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Bonus damage increases to +1d8 ember damage." },
      { description: "Bonus damage increases to +2d6 ember damage and critical hits melt 2 Armor." }
    ]
  },
  {
    id: "inf_t5_power_surge",
    name: "Infernal Overdrive",
    icon: "spell_fire_burnout",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "inf_t4_overcharge",
    spell: {
      name: "Infernal Overdrive",
      description: "Spend 1 AP: Enter an overdrive state for 2 rounds. Your ember spells score critical hits on 19–20, but you take 2 ember damage at the end of each turn.",
      flavorText: "Burning hot enough to singe your own nerves.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 1,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      visualTheme: "fire", tags: ["buff", "crit", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Critical hits occur on rolls of 18–20; self-damage unchanged." }
    ]
  },

  // ──────────────── TIER 6 (Row 5) ────────────────
  {
    id: "inf_t6_hellish_pillar",
    name: "Crucible Pillar",
    icon: "spell_fire_fireball",
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: ["inf_t5_maximum_power", "inf_t5_power_surge"],
    spell: {
      name: "Crucible Pillar",
      description: "Spend 2 AP: Erupt a concentrated 15-foot geyser of liquid fire dealing 3d8 ember damage to all enemies and inflicting Stagger for 1 round.",
      flavorText: "Geysers of magma erupting straight from the mantle.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 15, rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      damageTypes: ["ember"],
      visualTheme: "fire", tags: ["aoe", "pillar", "stagger", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Deals 3d10 ember damage and melts 3 points of Armor from all hit enemies.", primaryDamage: { dice: "3d10", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 ember damage, melts 3 Armor, and knocks targets Prone.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 7 (Row 6 - Capstones) ────────────────
  {
    id: "inf_t7_living_crucible",
    name: "Living Crucible",
    icon: "spell_fire_incinerate",
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: "inf_t6_hellish_pillar",
    spell: {
      name: "Living Crucible",
      description: "ULTIMATE: Spend 2 AP: For 2 rounds, your body becomes pure white-hot furnace fire. All single-target ember spells deal +1d10 ember damage, melt 3 Armor, and you gain +4 Damage Reduction against physical attacks.",
      flavorText: "The flesh yields. The furnace takes command.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 5, cooldownUnit: "rounds",
      visualTheme: "fire", tags: ["ultimate", "furnace", "pyrofiend"]
    }
  },
  {
    id: "inf_t7_unquenchable_heat",
    name: "Unquenchable Core",
    icon: "spell_fire_soulburn",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "inf_t6_hellish_pillar",
    spell: {
      name: "Unquenchable Core",
      description: "Passive: Your ember damage ignores up to 5 points of enemy Fire Resistance.",
      flavorText: "Nothing in this realm can snuff your flame.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "penetration", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Ignores up to 8 points of Fire Resistance and immune to Freeze/Chill." }
    ]
  },
  {
    id: "inf_t7_thermal_fission",
    name: "Thermal Fission",
    icon: "spell_fire_selfdestruct",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "inf_t6_hellish_pillar",
    spell: {
      name: "Thermal Fission",
      description: "Passive: When you reduce an enemy to 0 HP with an ember spell, they detonate for 2d8 ember damage to all adjacent enemies.",
      flavorText: "One spark lights a chain of ruin.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "detonate", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Detonation deals 3d8 ember damage and applies Burning (1d6/rd for 2 rounds)." }
    ]
  }
];
