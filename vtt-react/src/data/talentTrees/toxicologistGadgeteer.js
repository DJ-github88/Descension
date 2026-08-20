// ============================================
// TOXICOLOGIST — GADGETEER (v3: Rebalanced Tier Budgets, Normalized Grid Coordinates)
// Schema: see talentSystem.mjs.
// Grid coordinates: x (0..4), y (0..6 representing Tiers 1..7).
//
// FANTASY: The Clockwork Engineer / Trapper / Tactical Automata Builder.
// ============================================

export const TOXICOLOGIST_GADGETEER = [
  // ──────────────── TIER 1 (Row 0) ────────────────
  {
    id: "gd_t1_quick_snare",
    name: "Spring Snare",
    icon: "inv_misc_wrench_01",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Spring Snare",
      description: "Spend 1 AP: Deploy a concealed spring snare on a space within 30 feet. When an enemy steps on it, deals 1d6 piercing damage and Immobilizes them for 1 round.",
      flavorText: "Some assembly required. Not much.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      damageTypes: ["piercing"],
      visualTheme: "arcane", tags: ["deploy", "trap", "immobilize", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Snare deals 1d8 piercing damage and reduces target Armor by 1.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "Snare deals 2d6 piercing damage and can be deployed up to 40 feet away.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "gd_t1_armature",
    name: "Spring Armature",
    icon: "inv_misc_enggizmos_03",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Spring Armature",
      description: "Passive: Your throw range for all grenades, vials, and deployables increases by 10 feet.",
      flavorText: "Mechanical leverage makes every throw effortless.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "range", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Throw range increases by 15 feet." },
      { description: "Throw range increases by 20 feet, and retrieving items from inventory costs 0 AP once per turn." }
    ]
  },
  {
    id: "gd_t1_clockwork_plating",
    name: "Reinforced Bracing",
    icon: "inv_battery_02",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Reinforced Bracing",
      description: "Passive: You gain +1 Armor and 2 Damage Reduction against area hazards and environmental damage.",
      flavorText: "Brass and riveted steel between you and catastrophe.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "armor", "dr", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Gain +2 Armor and 3 Damage Reduction against area hazards." }
    ]
  },

  // ──────────────── TIER 2 (Row 1) ────────────────
  {
    id: "gd_t2_smoke_canister",
    name: "Alchemical Smoke",
    icon: "spell_shadow_twilight",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "gd_t1_quick_snare",
    spell: {
      name: "Alchemical Smoke",
      description: "Spend 1 AP: Hurl a smoke canister up to 35 feet creating a 15-foot obscured zone for 2 rounds. Creatures inside have +2 Defense against ranged attacks.",
      flavorText: "Opaque zinc clouds to confuse target acquisition.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 15, rangeType: "ranged", range: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      visualTheme: "arcane", tags: ["smoke", "cover", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Smoke zone expands to 20 feet and allies inside gain +3 Defense against ranged attacks." },
      { description: "Smoke zone also inflicts -2 to hit on enemy attacks originating from inside." }
    ]
  },
  {
    id: "gd_t2_dart_turret",
    name: "Miniature Turret",
    icon: "inv_misc_enggizmos_20",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "gd_t1_clockwork_plating",
    spell: {
      name: "Miniature Turret",
      description: "Spend 1 AP: Deploy a miniature tripod turret within 25 feet for 2 rounds. At the end of each turn, it fires a needle at the nearest enemy for 1d6 piercing damage.",
      flavorText: "Clockwork vigilance never blinks.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      damageTypes: ["piercing"],
      visualTheme: "arcane", tags: ["deploy", "turret", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Turret needles deal 1d8 piercing damage and range increases to 35 feet.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "Turret needles deal 2d6 piercing damage and apply a poison dealing 1d4 blight damage.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 3 (Row 2) ────────────────
  {
    id: "gd_t3_flashbang",
    name: "Flashbang Grenade",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "gd_t2_smoke_canister",
    spell: {
      name: "Flashbang Grenade",
      description: "Spend 1 AP: Hurl a magnesium concussion bomb up to 35 feet. Deals 2d6 sonic damage in a 15-foot radius and Dazes targets for 1 round on a failed Reflex save.",
      flavorText: "A burst of blinding light and eardrum-splitting force.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 15, rangeType: "ranged", range: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      damageTypes: ["sonic"],
      visualTheme: "arcane", tags: ["aoe", "grenade", "daze", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Deals 2d8 sonic damage and forces targets to drop 1 rank of weapon guard on failed save.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Deals 3d6 sonic damage, Blinds targets for 1 round, and interrupts spell channels.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "gd_t3_overclock_gears",
    name: "Pneumatic Thrusters",
    icon: "ability_rogue_sprint",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "gd_t2_dart_turret",
    spell: {
      name: "Pneumatic Thrusters",
      description: "Passive: Your movement speed increases by 10 feet, and you can Disengage as a free reaction once per combat encounter.",
      flavorText: "Steam-assisted footwork.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "speed", "mobility", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Movement speed increases by 15 feet and jump distance is doubled." },
      { description: "Movement speed increases by 15 feet, and you ignore all non-magical difficult terrain." }
    ]
  },

  // ──────────────── TIER 4 (Row 3) ────────────────
  {
    id: "gd_t4_grapnel_wire",
    name: "Grapnel Winch",
    icon: "ability_rogue_shadowstep",
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: ["gd_t3_flashbang", "gd_t3_overclock_gears"],
    spell: {
      name: "Grapnel Winch",
      description: "Spend 1 AP: Fire a high-tension steel cable up to 40 feet. Pull yourself immediately to an unoccupied location or pull an ally out of danger to your side.",
      flavorText: "Physics, expedited.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      visualTheme: "arcane", tags: ["mobility", "hook", "pull", "toxicologist"]
    }
  },

  // ──────────────── TIER 5 (Row 4) ────────────────
  {
    id: "gd_t5_shrapnel_mine",
    name: "Claymore Mine",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "gd_t4_grapnel_wire",
    spell: {
      name: "Claymore Mine",
      description: "Spend 1 AP: Plant a directional claymore trap. When an enemy approaches within 10 feet, it discharges a 15-foot cone dealing 2d8 piercing damage and knocking targets Prone.",
      flavorText: "Front toward enemy.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "cone", aoeSize: 15, rangeType: "ranged", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      damageTypes: ["piercing"],
      visualTheme: "arcane", tags: ["trap", "mine", "knockdown", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Deals 2d10 piercing damage and shreds 2 points of Armor.", primaryDamage: { dice: "2d10", flat: 0, procChance: 100 } },
      { description: "Deals 3d8 piercing damage, shreds 3 Armor, and Pins targets to the ground for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "gd_t5_overclocked_core",
    name: "Clockwork Exoskeleton",
    icon: "inv_battery_01",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "gd_t4_grapnel_wire",
    spell: {
      name: "Clockwork Exoskeleton",
      description: "Passive: You gain +2 to Strength checks and saving throws, and your carrying capacity and weapon strike damage increase by +1d4 bludgeoning.",
      flavorText: "Hydro-pneumatic pistons augment every muscle twitch.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["bludgeoning"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "strength", "exoskeleton", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Gain +3 to Strength checks/saves and weapon strike damage increases by +1d6 bludgeoning." }
    ]
  },

  // ──────────────── TIER 6 (Row 5) ────────────────
  {
    id: "gd_t6_automaton_colossus",
    name: "Deployable Automaton",
    icon: "inv_misc_enggizmos_20",
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: ["gd_t5_shrapnel_mine", "gd_t5_overclocked_core"],
    spell: {
      name: "Deployable Automaton",
      description: "Spend 2 AP: Deploy a brass automaton within 15 feet for 3 rounds (25 HP, +2 Armor). It intercepts attacks meant for nearby allies and attacks adjacent foes for 2d6 bludgeoning damage each round.",
      flavorText: "A walking fortress in miniature.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 2,
      targetingMode: "single", rangeType: "ranged", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      damageTypes: ["bludgeoning"],
      visualTheme: "arcane", tags: ["summon", "automaton", "tank", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Automaton has 35 HP, deals 2d8 damage, and Taunts adjacent enemies.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Automaton has 45 HP, deals 3d6 damage, and explodes for 3d8 fire damage upon destruction.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 7 (Row 6 - Capstones) ────────────────
  {
    id: "gd_t7_grand_mechanic",
    name: "Grand Mechanist Overdrive",
    icon: "inv_misc_wrench_02",
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: "gd_t6_automaton_colossus",
    spell: {
      name: "Grand Mechanist Overdrive",
      description: "ULTIMATE: Spend 2 AP: For 2 rounds, all your traps, turrets, and gadgets cost 0 AP to deploy, trigger immediately upon deployment, and your turrets fire twice per round.",
      flavorText: "Total mechanical synergy. Every gear turns in ruthless precision.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 5, cooldownUnit: "rounds",
      visualTheme: "arcane", tags: ["ultimate", "mechanic", "buff", "toxicologist"]
    }
  },
  {
    id: "gd_t7_salvage_protocol",
    name: "Salvage Protocol",
    icon: "inv_misc_gear_01",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "gd_t6_automaton_colossus",
    spell: {
      name: "Salvage Protocol",
      description: "Passive: When any trap, turret, or automaton expires or is destroyed, restore 6 Hit Points and gain 1 Action Point on your next turn.",
      flavorText: "No spare part goes to waste.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "refund", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Restores 10 Hit Points and grants +2 AP on your next turn." }
    ]
  },
  {
    id: "gd_t7_hypercharged_munitions",
    name: "Tungsten Munitions",
    icon: "inv_ammo_bullet_04",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "gd_t6_automaton_colossus",
    spell: {
      name: "Tungsten Munitions",
      description: "Passive: All your gadget, turret, and weapon physical damage bypasses up to 4 points of Armor and ignores physical damage reduction.",
      flavorText: "Dense tungsten cores punched through plate like paper.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "armor-pierce", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Bypasses up to 7 points of Armor and scores critical hits on rolls of 19–20." }
    ]
  }
];
