// ============================================
// TOXICOLOGIST — VENOMANCER (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// Resource: Toxin Vials. Damage type: blight. The poison-master tree.
// ============================================

export const TOXICOLOGIST_VENOMANCER = [
  {
    id: "vn_t1_venomous_core",
    name: "Venomous Core",
    icon: "ability_rogue_deadlybrew",
    maxRanks: 3,
    position: { x: 1.5, y: 0 },
    requires: null,
    spell: {
      name: "Venomous Core",
      description: "Your body becomes a reservoir of deadly toxins. Your weapon attacks deal 1d6 additional blight damage.",
      flavorText: "You stopped needing an apothecary years ago. You are one.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "venom", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your body becomes a reservoir of deadly toxins. Your weapon attacks deal 2d6 additional blight damage.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Your body becomes a reservoir of deadly toxins. Your weapon attacks deal 3d6 additional blight damage, and when you take damage you secrete venom dealing 1d8 blight damage to adjacent enemies.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
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
      description: "Your toxins flow through specialized channels. Blight effects you apply last 2 additional rounds, and enemies poisoned by you take 1d4 blight damage at the start of their turns.",
      flavorText: "Plumbing, but for murder.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["blight"],
      isDot: true, dotDuration: 2, dotTick: "1d4",
      visualTheme: "poison", tags: ["passive", "duration", "dot", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your toxins flow through specialized channels. Blight effects you apply last 3 additional rounds, and enemies poisoned by you take 1d6 blight damage at the start of their turns.", dotTick: "1d6" },
      { description: "Your toxins flow through specialized channels. Blight effects you apply last 4 additional rounds, and enemies poisoned by you take 1d8 blight damage at the start of their turns.", dotTick: "1d8" }
    ]
  },
  {
    id: "vn_t1_neurotoxin",
    name: "Neurotoxin Channels",
    icon: "ability_rogue_deviouspoisons",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Neurotoxin Channels",
      description: "Your venom affects the nervous system. Enemies poisoned by you have disadvantage on attack rolls and skill checks.",
      flavorText: "The mind is just another organ with a tolerance threshold.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "neurotoxin", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your venom affects the nervous system. Enemies poisoned by you have disadvantage on attack rolls and skill checks, and your critical hits with venom-coated weapons stun them for 1 round." }
    ]
  },

  {
    id: "vn_t2_hemotoxin",
    name: "Hemotoxin Network",
    icon: "spell_nature_nullifydisease",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "vn_t1_venomous_core",
    spell: {
      name: "Hemotoxin Network",
      description: "Your toxins attack the bloodstream. Poisoned enemies take maximum damage from your blight effects.",
      flavorText: "Why roll dice when the blood does the work?",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "maximize", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your toxins attack the bloodstream. Poisoned enemies take maximum damage from your blight effects, and when you poison an enemy, enemies adjacent to it take 1d6 blight damage." },
      { description: "Your toxins attack the bloodstream. Poisoned enemies take maximum damage from your blight effects, and when you poison an enemy, enemies adjacent to it take 2d6 blight damage and are also poisoned." }
    ]
  },
  {
    id: "vn_t2_toxin_mastery",
    name: "Toxin Mastery",
    icon: "ability_rogue_deadlybrew",
    maxRanks: 3,
    position: { x: 3.5, y: 1 },
    requires: "vn_t1_venom_channels",
    spell: {
      name: "Toxin Mastery",
      description: "You become a master of all poisons. All blight damage you deal is increased by 25%, and you may apply two different poison effects to the same weapon.",
      flavorText: "One coat, two recipes.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "mastery", "toxicologist"]
    },
    rankUpgrades: [
      { description: "You become a master of all poisons. All blight damage you deal is increased by 50%, and you may apply two different poison effects to the same weapon." },
      { description: "You become a master of all poisons. All blight damage you deal is increased by 75%, you may apply two different poison effects to the same weapon, and your poison immunity grants you advantage on all saves." }
    ]
  },

  {
    id: "vn_t3_lethal_injection",
    name: "Lethal Injection",
    icon: "ability_rogue_dualweild",
    maxRanks: 3,
    position: { x: 1, y: 2.5 },
    requires: "vn_t2_hemotoxin",
    spell: {
      name: "Lethal Injection",
      description: "Your venom becomes instantly lethal. Once per turn when you hit with a poisoned weapon, inject a lethal dose: the target takes 4d10 blight damage immediately and is poisoned for 1 minute.",
      flavorText: "Dosage: yes.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { toxinVial: { baseAmount: 1 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "4d10", flat: 0, procChance: 100 },
      debuffs: ["poisoned"], visualTheme: "poison", tags: ["melee", "burst", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your venom becomes instantly lethal. Once per turn when you hit with a poisoned weapon, inject a lethal dose: the target takes 4d10 blight damage immediately and is poisoned for 2 minutes.", primaryDamage: { dice: "4d10", flat: 0, procChance: 100 } },
      { description: "Your venom becomes instantly lethal. Once per turn when you hit with a poisoned weapon, inject a lethal dose: the target takes 4d10 blight damage immediately, is poisoned for 2 minutes, and cannot regain health while poisoned.", primaryDamage: { dice: "4d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "vn_t3_cytotoxin",
    name: "Cytotoxin Network",
    icon: "spell_shadow_deathcoil",
    maxRanks: 3,
    position: { x: 3.5, y: 2.5 },
    requires: "vn_t2_toxin_mastery",
    spell: {
      name: "Cytotoxin Network",
      description: "Your toxins destroy cells at the molecular level. Poisoned enemies cannot regenerate health, and when a poisoned enemy dies, it bursts in a 10-foot radius dealing 2d8 blight damage.",
      flavorText: "Cellular eviction, no notice given.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "anti-heal", "explode", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your toxins destroy cells at the molecular level. Poisoned enemies cannot regenerate health, and when a poisoned enemy dies, it bursts in a 15-foot radius dealing 3d8 blight damage.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Your toxins destroy cells at the molecular level. Poisoned enemies cannot regenerate health, and when a poisoned enemy dies, it bursts in a 20-foot radius dealing 4d8 blight damage that spreads the poison to enemies hit.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "vn_t4_venom_cloud",
    name: "Venom Cloud",
    icon: "ability_druid_disembowel",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "vn_t3_lethal_injection",
    spell: {
      name: "Venom Cloud",
      description: "Exhale a cloud of deadly venom. Create a 30-foot cloud centered on yourself for 3 rounds: all enemies inside take 3d8 blight damage and are poisoned for the duration.",
      flavorText: "Weather with intent.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 25, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { toxinVial: { baseAmount: 2 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "3d8",
      debuffs: ["poisoned"], visualTheme: "poison", tags: ["aoe", "cloud", "dot", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Exhale a cloud of deadly venom. Create a 30-foot cloud centered on yourself for 4 rounds: all enemies inside take 4d8 blight damage and are poisoned for the duration.", dotTick: "4d8", dotDuration: 4 },
      { description: "Exhale a cloud of deadly venom. Create a 40-foot cloud centered on yourself for 4 rounds: all enemies inside take 5d8 blight damage and are poisoned; the cloud moves 10 feet per round toward the largest cluster of enemies.", dotTick: "5d8", dotDuration: 4 }
    ]
  },
  {
    id: "vn_t4_toxin_synthesis",
    name: "Toxin Synthesis",
    icon: "inv_misc_herb_16",
    maxRanks: 2,
    position: { x: 3, y: 4.5 },
    requires: "vn_t3_cytotoxin",
    spell: {
      name: "Toxin Synthesis",
      description: "You can synthesize any poison instantly. You know all poison recipes and may craft custom poisons; poisons you create have +2 to their save DCs.",
      flavorText: "The recipe book is in your hands. The laboratory is your bloodstream.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "crafting", "toxicologist"]
    },
    rankUpgrades: [
      { description: "You can synthesize any poison instantly. You know all poison recipes and may craft custom poisons; poisons you create have +4 to their save DCs and cost 1 fewer Toxin Vials to deploy (minimum 1)." }
    ]
  },

  {
    id: "vn_t5_apex_predator",
    name: "Apex Predator",
    icon: "ability_hunter_pet_spider",
    maxRanks: 3,
    position: { x: 1.5, y: 6 },
    requires: "vn_t4_venom_cloud",
    spell: {
      name: "Apex Predator",
      description: "You become the ultimate venomous predator. Creatures within 30 feet take 2d6 blight damage at the start of their turns if below half health, and you are immune to all poisons and diseases.",
      flavorText: "The weak are separated from the strong by a membrane you dissolve.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "execute", "immunity", "toxicologist"]
    },
    rankUpgrades: [
      { description: "You become the ultimate venomous predator. Creatures within 30 feet take 3d6 blight damage at the start of their turns if below half health, and you are immune to all poisons and diseases.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "You become the ultimate venomous predator. Creatures within 45 feet take 4d6 blight damage at the start of their turns if below two-thirds health, and you are immune to all poisons and diseases.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "vn_t5_toxin_overload",
    name: "Toxin Overload",
    icon: "spell_nature_acid_01",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "vn_t4_toxin_synthesis",
    spell: {
      name: "Toxin Overload",
      description: "Your venom overwhelms all defenses. Blight effects you apply ignore poison resistance, and poison immunity is treated as resistance instead.",
      flavorText: "Immunity is a rumor your toxins have disproven.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "penetration", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your venom overwhelms all defenses. Blight effects you apply ignore poison resistance AND immunity entirely." }
    ]
  },

  {
    id: "vn_t6_toxic_nova",
    name: "Toxic Nova",
    icon: "spell_nature_acid_01",
    maxRanks: 1,
    position: { x: 1.5, y: 7.5 },
    requires: "vn_t5_apex_predator",
    spell: {
      name: "Toxic Nova",
      description: "Unleash a nova of pure venom. All enemies within 50 feet take 6d12 blight damage; poisoned enemies take double damage and are stunned for 1 round. You are immune to your own nova.",
      flavorText: "Radius: generous. Survivors: theoretical.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { toxinVial: { baseAmount: 4 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "6d12", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "poison", tags: ["nova", "aoe", "toxicologist"]
    }
  },
  {
    id: "vn_t6_virulent_symbiosis",
    name: "Virulent Symbiosis",
    icon: "spell_nature_nullifydisease",
    maxRanks: 2,
    position: { x: 2, y: 7.5 },
    requires: "vn_t5_apex_predator",
    spell: {
      name: "Virulent Symbiosis",
      description: "The venom no longer merely lives in you; it works for you. While at least one enemy is poisoned by you, you regenerate 1d6 health per round.",
      flavorText: "A fair arrangement. They die, you thrive.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d6", flat: 0 },
      visualTheme: "poison", tags: ["passive", "regen", "toxicologist"]
    },
    rankUpgrades: [
      { description: "The venom no longer merely lives in you; it works for you. While at least one enemy is poisoned by you, you regenerate 2d6 health per round and take 10% less damage.", healing: { dice: "2d6", flat: 0 } }
    ]
  },
  {
    id: "vn_t6_miasma",
    name: "Miasma",
    icon: "spell_shadow_plaguecloud",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "vn_t5_toxin_overload",
    spell: {
      name: "Miasma",
      description: "Your presence is a slow-acting catastrophe. Enemies within 15 feet who are poisoned by you have their healing reduced by 50%.",
      flavorText: "Proximity is a preexisting condition.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "anti-heal", "aura", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your presence is a slow-acting catastrophe. Enemies within 30 feet who are poisoned by you have their healing reduced by 75% and cannot remove poisons except by killing you." }
    ]
  },

  {
    id: "vn_t7_toxic_ascension",
    name: "Toxic Ascension",
    icon: "ability_rogue_deadlybrew",
    maxRanks: 1,
    position: { x: 1, y: 8 },
    requires: "vn_t6_toxic_nova",
    spell: {
      name: "Toxic Ascension",
      description: "ULTIMATE: You become living venom incarnate for 1 minute: all damage you deal becomes blight damage, your weapon attacks automatically apply your strongest poison, and poisoned enemies within 100 feet cannot be healed.",
      flavorText: "The final stage of every poisoner's career is becoming the poison.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 240, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { toxinVial: { baseAmount: 5 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["toxic-ascension"], damageTypes: ["blight"],
      visualTheme: "poison", tags: ["ultimate", "capstone", "transform", "toxicologist"]
    }
  },
  {
    id: "vn_t7_grand_brewer",
    name: "Grand Brewer",
    icon: "inv_misc_herb_16",
    maxRanks: 5,
    position: { x: 2, y: 8 },
    requires: "vn_t6_virulent_symbiosis",
    spell: {
      name: "Grand Brewer",
      description: "Your preparations are more potent than the recipes suggest. All blight damage you deal is increased by 10%.",
      flavorText: "Subtle adjustments. Proprietary technique.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "capstone", "damage", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your preparations are more potent than the recipes suggest. All blight damage you deal is increased by 20%." },
      { description: "Your preparations are more potent than the recipes suggest. All blight damage you deal is increased by 30%." },
      { description: "Your preparations are more potent than the recipes suggest. All blight damage you deal is increased by 40%." },
      { description: "Your preparations are more potent than the recipes suggest. All blight damage you deal is increased by 50%, and you regain 1 Toxin Vial at the start of each combat." }
    ]
  },
  {
    id: "vn_t7_cascade_contagion",
    name: "Cascade Contagion",
    icon: "spell_shadow_plaguecloud",
    maxRanks: 3,
    position: { x: 3, y: 8 },
    requires: "vn_t6_virulent_symbiosis",
    spell: {
      name: "Cascade Contagion",
      description: "Your poisons have learned to travel. When an enemy dies while poisoned by you, your poison jumps to the nearest enemy within 20 feet with full duration.",
      flavorText: "Inheritance: infectious.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "capstone", "spread", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your poisons have learned to travel. When an enemy dies while poisoned by you, your poison jumps to the two nearest enemies within 30 feet with full duration." },
      { description: "Your poisons have learned to travel. When an enemy dies while poisoned by you, your poison jumps to all enemies within 30 feet with full duration, and each jump restores 1 Toxin Vial." }
    ]
  },
  {
    id: "vn_t7_pearlescent_antidote",
    name: "Pearlescent Antidote",
    icon: "spell_nature_rejuvenation",
    maxRanks: 3,
    position: { x: 0.5, y: 8 },
    requires: "vn_t6_miasma",
    spell: {
      name: "Pearlescent Antidote",
      description: "The antidote is worth more than the poison. Spend 1 Toxin Vial to cleanse all poisons and diseases from an ally within 30 feet and heal them for 3d8.",
      flavorText: "The best customers are the ones you saved.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { toxinVial: { baseAmount: 1 } },
      healing: { dice: "3d8", flat: 0 },
      visualTheme: "poison", tags: ["cleanse", "healing", "ally", "toxicologist"]
    },
    rankUpgrades: [
      { description: "The antidote is worth more than the poison. Spend 1 Toxin Vial to cleanse all poisons and diseases from an ally within 30 feet and heal them for 5d8.", healing: { dice: "5d8", flat: 0 } },
      { description: "The antidote is worth more than the poison. Spend 1 Toxin Vial to cleanse all poisons, diseases, and curses from ALL allies within 30 feet and heal them for 5d8 each.", healing: { dice: "5d8", flat: 0 } }
    ]
  },
  {
    id: "vn_t7_homeostasis",
    name: "Homeostasis",
    icon: "spell_nature_nullifydisease",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "vn_t6_miasma",
    spell: {
      name: "Homeostasis",
      description: "Your body adjusts its own formula. Your maximum Toxin Vials increase by 1.",
      flavorText: "More pockets. Same coat.",
      source: "talent", class: "Toxicologist", treeId: "venomancer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "capstone", "resource", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your body adjusts its own formula. Your maximum Toxin Vials increase by 2." },
      { description: "Your body adjusts its own formula. Your maximum Toxin Vials increase by 3, and once per short rest you may refill all vials instantly." }
    ]
  }
];
