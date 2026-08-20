// ============================================
// TOXICOLOGIST — VENOMANCER (v3: Rebalanced Tier Budgets, Normalized Grid Coordinates)
// Schema: see talentSystem.mjs.
// Grid coordinates: x (0..4), y (0..6 representing Tiers 1..7).
//
// FANTASY: The Biological Toxin Master / Stacking Blights / Neurotoxins.
// ============================================

export const TOXICOLOGIST_VENOMANCER = [
  // ──────────────── TIER 1 (Row 0) ────────────────
  {
    id: "vn_t1_venomous_core",
    name: "Envenomed Edge",
    icon: "ability_rogue_deadlybrew",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Envenomed Edge",
      description: "Passive: Your weapon attacks deal +1d4 additional blight damage and apply a mild toxin for 2 rounds.",
      flavorText: "You stopped needing an apothecary years ago. You are one.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "venom", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Weapon attacks deal +1d6 additional blight damage.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Weapon attacks deal +1d8 additional blight damage, and when you take melee damage, your attacker suffers 1d4 blight backlash.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "vn_t1_venom_channels",
    name: "Venom Channels",
    icon: "spell_nature_corrosivebreath",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Venom Channels",
      description: "Passive: Blight and poison damage-over-time effects you apply deal +1 additional blight damage per tick.",
      flavorText: "Plumbing, but for murder.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "duration", "dot", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Blight damage-over-time effects deal +2 additional blight damage per tick." },
      { description: "Blight damage-over-time effects deal +3 additional blight damage per tick and last 1 extra round." }
    ]
  },
  {
    id: "vn_t1_neurotoxin",
    name: "Paralytic Tincture",
    icon: "ability_rogue_deviouspoisons",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Paralytic Tincture",
      description: "Passive: Enemies affected by your toxins suffer -1 to their attack rolls and dexterity saving throws.",
      flavorText: "The mind is just another organ with a tolerance threshold.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "neurotoxin", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Enemies affected by your toxins suffer -2 to attack rolls and dexterity saves." }
    ]
  },

  // ──────────────── TIER 2 (Row 1) ────────────────
  {
    id: "vn_t2_hemotoxin",
    name: "Hemotoxin Needle",
    icon: "spell_nature_nullifydisease",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "vn_t1_venomous_core",
    spell: {
      name: "Hemotoxin Needle",
      description: "Spend 1 AP: Hurl a venom-coated needle at a target within 40 feet dealing 1d8 blight damage and inflicting Poisoned (1d4 blight/rd for 2 rounds).",
      flavorText: "Why roll dice when the blood does the work?",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 2, dotTick: "1d4",
      damageTypes: ["blight"],
      visualTheme: "poison", tags: ["strike", "needle", "dot", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Deals 2d6 initial blight damage; Poisoned deals 1d6 per round.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, dotTick: "1d6" },
      { description: "Deals 2d8 initial blight damage; Poisoned deals 1d8 per round and reduces target healing received by 3.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, dotTick: "1d8" }
    ]
  },
  {
    id: "vn_t2_toxin_mastery",
    name: "Metabolic Drain",
    icon: "ability_rogue_dualweild",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "vn_t1_neurotoxin",
    spell: {
      name: "Metabolic Drain",
      description: "Passive: When you hit a poisoned enemy, restore 2 Hit Points and reduce the target's movement speed by 5 feet.",
      flavorText: "Their vital fluids replenish your own stamina.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "lifesteal", "slow", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Restores 4 Hit Points and reduces target speed by 10 feet." },
      { description: "Restores 6 Hit Points, reduces target speed by 10 feet, and grants you +5 feet movement speed for 1 round." }
    ]
  },

  // ──────────────── TIER 3 (Row 2) ────────────────
  {
    id: "vn_t3_toxic_cloud",
    name: "Noxious Cloud",
    icon: "spell_nature_abolishcurse",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "vn_t2_hemotoxin",
    spell: {
      name: "Noxious Cloud",
      description: "Spend 1 AP: Shatter a vial creating a 15-foot cloud of toxic vapor within 45 feet for 2 rounds. Enemies inside take 2d6 blight damage upon entering or ending their turn inside.",
      flavorText: "Hold your breath. Not that it will help.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 15, rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      damageTypes: ["blight"],
      visualTheme: "poison", tags: ["aoe", "cloud", "hazard", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Cloud deals 2d8 blight damage and obscures vision.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Cloud deals 3d6 blight damage, obscures vision, and enemies inside must succeed on a Fortitude save or become Dazed for 1 round.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "vn_t3_virulent_outbreak",
    name: "Virulent Spores",
    icon: "spell_nature_curseofspider",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "vn_t2_toxin_mastery",
    spell: {
      name: "Virulent Spores",
      description: "Passive: When an enemy dies while affected by your toxins, they release a spore cloud dealing 1d6 blight damage to all enemies within 10 feet.",
      flavorText: "The body expires, but the venom lives on.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "corpse-burst", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Spore cloud deals 1d8 blight damage and applies Poisoned." },
      { description: "Spore cloud deals 2d6 blight damage, applies Poisoned, and refunds 1 AP if 2 or more enemies are struck." }
    ]
  },

  // ──────────────── TIER 4 (Row 3) ────────────────
  {
    id: "vn_t4_terminal_dosage",
    name: "Terminal Dosage",
    icon: "ability_rogue_feigndeath",
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: ["vn_t3_toxic_cloud", "vn_t3_virulent_outbreak"],
    spell: {
      name: "Terminal Dosage",
      description: "Spend 1 AP: Strike a poisoned enemy in melee, detonating all toxin stacks within their body for 2d10 blight damage and Staggering them for 1 round.",
      flavorText: "The final drop that tips the vial.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d10", flat: 0, procChance: 100 },
      damageTypes: ["blight"],
      visualTheme: "poison", tags: ["strike", "execute", "stagger", "toxicologist"]
    }
  },

  // ──────────────── TIER 5 (Row 4) ────────────────
  {
    id: "vn_t5_viper_strike",
    name: "Viper Reflexes",
    icon: "ability_rogue_quickrecovery",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "vn_t4_terminal_dosage",
    spell: {
      name: "Viper Reflexes",
      description: "Passive: Your weapon attacks gain +1 to hit against poisoned enemies, and your Opportunity Attacks inflict Poisoned.",
      flavorText: "Faster than the eye, deadlier than the bite.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "accuracy", "reaction", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Gain +2 to hit against poisoned targets and +10 feet movement speed." },
      { description: "Gain +2 to hit, +10 feet speed, and critical hits with melee weapons inflict Paralysis for 1 round." }
    ]
  },
  {
    id: "vn_t5_immunological_breakdown",
    name: "Immunological Ruin",
    icon: "spell_nature_earthbindtotem",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "vn_t4_terminal_dosage",
    spell: {
      name: "Immunological Ruin",
      description: "Passive: Enemies affected by your toxins have their Damage Reduction reduced by 2 and cannot benefit from regeneration.",
      flavorText: "Stripping the body's natural defenses cell by cell.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "dr-shred", "heal-block", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Enemy Damage Reduction is reduced by 4, and their saving throws against spells are reduced by 1." }
    ]
  },

  // ──────────────── TIER 6 (Row 5) ────────────────
  {
    id: "vn_t6_plague_mist",
    name: "Plague Mist Eruption",
    icon: "spell_nature_bloodlust",
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: ["vn_t5_viper_strike", "vn_t5_immunological_breakdown"],
    spell: {
      name: "Plague Mist Eruption",
      description: "Spend 2 AP: Release a 25-foot cone of virulent neurotoxin dealing 3d8 blight damage and forcing all enemies hit to roll a Fortitude save or be Blinded for 1 round.",
      flavorText: "A green shroud that rots the senses.",
      source: "talent", class: "Pyrofiend", treeId: "venomancer",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2,
      targetingMode: "aoe", aoeShape: "cone", aoeSize: 25, rangeType: "ranged", range: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      damageTypes: ["blight"],
      visualTheme: "poison", tags: ["aoe", "cone", "blind", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Deals 3d10 blight damage, Blinds for 1 round, and leaves lingering mist for 2 rounds.", primaryDamage: { dice: "3d10", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 blight damage, Blinds, and poisoned enemies in the cone take an extra 1d8 blight damage.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 7 (Row 6 - Capstones) ────────────────
  {
    id: "vn_t7_avatar_of_venom",
    name: "Avatar of the Viper",
    icon: "ability_rogue_shadowstep",
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: "vn_t6_plague_mist",
    spell: {
      name: "Avatar of the Viper",
      description: "ULTIMATE: Spend 2 AP: For 2 rounds, all your attacks apply maximum toxin stacks, your blight damage ignores all enemy Poison/Blight resistance, and whenever an enemy takes poison damage, you heal for 3 Hit Points.",
      flavorText: "You are the serpent at the root of the world.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 5, cooldownUnit: "rounds",
      visualTheme: "poison", tags: ["ultimate", "venom", "toxicologist"]
    }
  },
  {
    id: "vn_t7_miasma_heart",
    name: "Miasma Heart",
    icon: "spell_nature_nullifypoison",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "vn_t6_plague_mist",
    spell: {
      name: "Miasma Heart",
      description: "Passive: You are completely immune to Poison, Blight, and Disease, and whenever you are targeted by a healing spell, you gain +3 bonus Hit Points.",
      flavorText: "Your blood is acid. Disease cannot survive inside you.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "immunity", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Immunity preserved, and healing received bonus increases to +6 Hit Points." }
    ]
  },
  {
    id: "vn_t7_catalytic_detonation",
    name: "Catalytic Shock",
    icon: "spell_shadow_abominationexplosion",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "vn_t6_plague_mist",
    spell: {
      name: "Catalytic Shock",
      description: "Passive: When you score a critical hit on a poisoned target, shockwaves of toxin deal 2d8 blight damage to all other enemies within 15 feet.",
      flavorText: "The reaction accelerates until the surrounding air rots.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "crit-burst", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Shockwave deals 3d8 blight damage and applies Poisoned to all hit targets." }
    ]
  }
];
