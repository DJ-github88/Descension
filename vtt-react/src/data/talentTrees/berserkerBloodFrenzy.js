// ============================================
// BERSERKER — BLOOD FRENZY (v4: Rebalanced Tier Budgets, Normalized Grid Coordinates)
// Schema: see talentSystem.mjs.
// Grid coordinates: x (0..4), y (0..6 representing Tiers 1..7).
//
// FANTASY: The Wound Engine / Blood Sacrifice & Lifesteal / High-Stakes Duelist.
// ============================================

export const BERSERKER_BLOOD_FRENZY = [
  // ──────────────── TIER 1 (Row 0) ────────────────
  {
    id: "bf_t1_blood_magic",
    name: "Vein Tap",
    icon: "spell_shadow_soulleech",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Vein Tap",
      description: "Spend 3 Hit Points: Instantly generate 15 Blood-Heat and your next attack deals +1d4 bleed damage.",
      flavorText: "The earth drinks. The veins provide.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 0,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      damageTypes: ["blight"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "blight", tags: ["resource", "self-damage", "berserker"]
    },
    rankUpgrades: [
      { description: "Spend 3 HP: Generates 20 Blood-Heat and next attack deals +1d6 bleed damage.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Spend 3 HP: Generates 25 Blood-Heat, next attack deals +1d8 bleed damage, and restores 3 HP on hit.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bf_t1_blood_rage",
    name: "Blood Scent",
    icon: "spell_shadow_bloodboil",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Blood Scent",
      description: "Passive: You gain +1 to hit and +5 feet movement speed when moving toward an enemy with less than half maximum health.",
      flavorText: "The metallic tang in the air guides every step.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blight", tags: ["passive", "accuracy", "speed", "berserker"]
    },
    rankUpgrades: [
      { description: "Gain +2 to hit and +10 feet movement speed toward injured enemies." },
      { description: "Gain +2 to hit, +15 feet movement speed, and weapon attacks deal +1d4 bonus damage against them." }
    ]
  },
  {
    id: "bf_t1_sanguine_resilience",
    name: "Sanguine Resilience",
    icon: "ability_warrior_bloodrage",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Sanguine Resilience",
      description: "Passive: While below half maximum health, you gain +1 Damage Reduction and restore 1 Hit Point on every successful melee hit.",
      flavorText: "Clinging to life with predatory tenacity.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blight", tags: ["passive", "lifesteal", "low-hp", "berserker"]
    },
    rankUpgrades: [
      { description: "Gain +2 Damage Reduction and restore 2 Hit Points on every melee hit while below half health." }
    ]
  },

  // ──────────────── TIER 2 (Row 1) ────────────────
  {
    id: "bf_t2_crimson_slash",
    name: "Crimson Strike",
    icon: "ability_rogue_eviscerate",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "bf_t1_blood_magic",
    spell: {
      name: "Crimson Strike",
      description: "Spend 1 AP and 10 Blood-Heat: Deliver a vicious lacerating strike for 1d8 slicing damage and inflict Bleeding (1d4 damage per round for 2 rounds).",
      flavorText: "Open the artery, let the heat flow.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 2, dotTick: "1d4",
      damageTypes: ["slicing"],
      visualTheme: "blight", tags: ["strike", "bleed", "dot", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 2d6 initial slicing damage; Bleeding deals 1d6 per round.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, dotTick: "1d6" },
      { description: "Deals 2d8 initial slicing damage; Bleeding deals 1d8 per round and restores 2 HP to you each tick.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, dotTick: "1d8" }
    ]
  },
  {
    id: "bf_t2_hemorrhagic_ward",
    name: "Hemorrhagic Ward",
    icon: "spell_shadow_curseofachimonde",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "bf_t1_sanguine_resilience",
    spell: {
      name: "Hemorrhagic Ward",
      description: "Reaction: When you take damage, spend 10 Blood-Heat to immediately gain 6 temporary Hit Points.",
      flavorText: "Hardened coagulation turns bloodshed into armor.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 0,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      visualTheme: "blight", tags: ["reaction", "shield", "berserker"]
    },
    rankUpgrades: [
      { description: "Grants 10 temporary Hit Points." },
      { description: "Grants 14 temporary Hit Points and deals 1d6 bleed damage to the attacker." }
    ]
  },

  // ──────────────── TIER 3 (Row 2) ────────────────
  {
    id: "bf_t3_crimson_wave",
    name: "Crimson Wave",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "bf_t2_crimson_slash",
    spell: {
      name: "Crimson Wave",
      description: "Spend 1 AP and 20 Blood-Heat: Unleash a spray of pressurized blood in a 15-foot cone. Deals 2d6 slicing damage and heals you for 2 Hit Points per enemy hit.",
      flavorText: "A red arc cutting across the ranks.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "cone", aoeSize: 15, rangeType: "melee", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      damageTypes: ["slicing"],
      visualTheme: "blight", tags: ["cone", "lifesteal", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 2d8 slicing damage and heals for 3 Hit Points per enemy hit.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Deals 3d6 slicing damage, heals for 4 HP per hit, and applies Bleeding to all targets.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bf_t3_arterial_rupture",
    name: "Arterial Rupture",
    icon: "ability_warrior_bloodstorm",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "bf_t2_hemorrhagic_ward",
    spell: {
      name: "Arterial Rupture",
      description: "Passive: Whenever you score a critical hit on a bleeding enemy, they burst with arterial blood, dealing 1d6 bleed damage to all other enemies within 10 feet.",
      flavorText: "Pressure release with devastating consequences.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "blight", tags: ["passive", "crit-burst", "berserker"]
    },
    rankUpgrades: [
      { description: "Burst deals 1d8 bleed damage and generates 10 Blood-Heat." },
      { description: "Burst deals 2d6 bleed damage, generates 10 Blood-Heat, and heals you for 4 Hit Points." }
    ]
  },

  // ──────────────── TIER 4 (Row 3) ────────────────
  {
    id: "bf_t4_sanguine_eruption",
    name: "Sanguine Detonation",
    icon: "spell_shadow_antimagicshell",
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: ["bf_t3_crimson_wave", "bf_t3_arterial_rupture"],
    spell: {
      name: "Sanguine Detonation",
      description: "Spend 1 AP, 25 Blood-Heat, and 4 HP: Detonate a violent circle of boiling blood in a 15-foot radius. Deals 2d10 slicing damage to all enemies and grants you 8 temporary Hit Points.",
      flavorText: "Your own blood becomes a shockwave of boiling iron.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 15, rangeType: "ranged", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d10", flat: 0, procChance: 100 },
      damageTypes: ["slicing"],
      visualTheme: "blight", tags: ["aoe", "detonation", "shield", "berserker"]
    }
  },

  // ──────────────── TIER 5 (Row 4) ────────────────
  {
    id: "bf_t5_boiling_blood",
    name: "Boiling Blood",
    icon: "spell_fire_sealoffire",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "bf_t4_sanguine_eruption",
    spell: {
      name: "Boiling Blood",
      description: "Passive: When you take 10 or more damage in a single hit, your blood boils with fury. Immediately gain 10 Blood-Heat and your next attack deals +1d8 bleed damage.",
      flavorText: "Every wound superheats your resolve.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "blight", tags: ["passive", "retaliation", "berserker"]
    },
    rankUpgrades: [
      { description: "Gain 15 Blood-Heat and next attack deals +2d6 bleed damage." },
      { description: "Gain 20 Blood-Heat, next attack deals +2d8 bleed damage and has Advantage." }
    ]
  },
  {
    id: "bf_t5_siphon_vitality",
    name: "Vampiric Draught",
    icon: "spell_shadow_lifedrain",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "bf_t4_sanguine_eruption",
    spell: {
      name: "Vampiric Draught",
      description: "Passive: Whenever an enemy takes damage from your Bleed effects, you restore 1 Hit Point.",
      flavorText: "Sustenance drawn through open wounds.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blight", tags: ["passive", "lifesteal", "berserker"]
    },
    rankUpgrades: [
      { description: "Restore 2 Hit Points on every Bleed tick, and your melee attacks heal you for 2 Hit Points." }
    ]
  },

  // ──────────────── TIER 6 (Row 5) ────────────────
  {
    id: "bf_t6_blood_harvest",
    name: "Blood Harvest Rite",
    icon: "spell_shadow_demonicempathy",
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: ["bf_t5_boiling_blood", "bf_t5_siphon_vitality"],
    spell: {
      name: "Blood Harvest Rite",
      description: "Spend 2 AP and 40 Blood-Heat: Create a swirling 20-foot vortex of razor blood. Deals 3d8 slicing damage to all enemies and restores 2d6 Hit Points to you.",
      flavorText: "Reaping life force directly from the battlefield.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 20, rangeType: "ranged", range: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      damageTypes: ["slicing"],
      visualTheme: "blight", tags: ["nuke", "lifesteal", "aoe", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 3d10 slicing damage and heals you for 2d8 Hit Points.", primaryDamage: { dice: "3d10", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 slicing damage, heals for 3d6 HP, and resets the cooldown of Vein Tap.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 7 (Row 6 - Capstones) ────────────────
  {
    id: "bf_t7_avatar_of_blood",
    name: "Avatar of the Blood Font",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: "bf_t6_blood_harvest",
    spell: {
      name: "Avatar of the Blood Font",
      description: "ULTIMATE: Spend 2 AP: For 2 rounds, all your attacks restore 50% of damage dealt as Hit Points, weapon strikes deal +1d10 bleed damage, and lethal damage cannot reduce you below 1 HP during this state.",
      flavorText: "Bathed in the crimson essence, death itself refuses you.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 5, cooldownUnit: "rounds",
      visualTheme: "blight", tags: ["ultimate", "undying", "lifesteal", "berserker"]
    }
  },
  {
    id: "bf_t7_exsanguinating_fury",
    name: "Exsanguinating Edge",
    icon: "ability_rogue_shadowstrikes",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "bf_t6_blood_harvest",
    spell: {
      name: "Exsanguinating Edge",
      description: "Passive: Your Bleed effects stack up to 3 times on the same target, and your attacks critical hit on rolls of 19–20 against bleeding foes.",
      flavorText: "Three open wounds where there was only one.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blight", tags: ["passive", "bleed-stack", "crit", "berserker"]
    },
    rankUpgrades: [
      { description: "Bleed stacks up to 5 times, and critical hits occur on rolls of 18–20." }
    ]
  },
  {
    id: "bf_t7_blood_pact",
    name: "Sanguine Rebirth",
    icon: "spell_shadow_twilight",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "bf_t6_blood_harvest",
    spell: {
      name: "Sanguine Rebirth",
      description: "Passive: When you receive lethal damage, consume all current Blood-Heat to survive with 15 Hit Points and deal 2d8 bleed damage to all adjacent enemies (cooldown: 4 rounds).",
      flavorText: "The blood remembers the beat even when the heart stops.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "blight", tags: ["passive", "cheat-death", "berserker"]
    },
    rankUpgrades: [
      { description: "Survive with 25 Hit Points, and retaliation deals 3d8 bleed damage." }
    ]
  }
];
