// ============================================
// SPELLGUARD — ARCANE WARDEN (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// ============================================

export const SPELLGUARD_ARCANE_WARDEN = [
  {
    id: "aw_t1_oath_steel",
    name: "Oath-Steel Bond",
    icon: "spell_holy_devotionaura",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Oath-Steel Bond",
      description: "Thalren oath-steel fused to your body hardens with every vow witnessed. You gain +1 Durability Steps to equipped durability and +3 maximum health.",
      flavorText: "The armor does not remember the wars. It remembers the promises.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "defense", "spellguard"]
    },
    rankUpgrades: [
      { description: "Thalren oath-steel fused to your body hardens with every vow witnessed. You gain +2 Durability Steps to equipped durability and +6 maximum health." },
      { description: "Thalren oath-steel fused to your body hardens with every vow witnessed. You gain +3 Durability Steps to equipped durability and +10 maximum health." }
    ]
  },
  {
    id: "aw_t1_arcane_absorption",
    name: "Arcane Absorption",
    icon: "spell_arcane_prismaticcloak",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Arcane Absorption",
      description: "Your warding soul drinks hostile magic. When you take magical damage (ember, rime, storm, arcane, blight, wyrd, or sacred), you gain 1 AEP for every 2 damage taken.",
      flavorText: "Every counter-spell feeds the reservoir. The Spellguard is a siege engine that eats bombardment.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "resource", "aep", "spellguard"]
    },
    rankUpgrades: [
      { description: "Your warding soul drinks hostile magic. When you take magical damage (ember, rime, storm, arcane, blight, wyrd, or sacred), you gain 1 AEP for every 2 damage taken. When you take physical damage (smashing, stabbing, slicing), you gain 1 AEP for every 4 damage taken." },
      { description: "Your warding soul drinks hostile magic. When you take magical damage (ember, rime, storm, arcane, blight, wyrd, or sacred), you gain 1 AEP for every 1 damage taken. When you take physical damage (smashing, stabbing, slicing), you gain 1 AEP for every 3 damage taken." }
    ]
  },
  {
    id: "aw_t1_arcane_shield",
    name: "Arcane Shield",
    icon: "spell_holy_powerwordshield",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Arcane Shield",
      description: "Instantly wrap yourself in a shearing arcane barrier that absorbs 15 damage for 30 seconds.",
      flavorText: "First lesson of the Spellguard: the best rebuttal to a fireball is a wall.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 10 } },
      durationRounds: 3, durationRealTime: 30, durationUnit: "seconds",
      buffs: ["shield"], visualTheme: "arcane", tags: ["shield", "defense", "spellguard"]
    },
    rankUpgrades: [
      { description: "Instantly wrap yourself in a shearing arcane barrier that absorbs 25 damage for 30 seconds." }
    ]
  },

  {
    id: "aw_t2_reinforced_wards",
    name: "Reinforced Wards",
    icon: "spell_holy_greaterblessingofkings",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "aw_t1_oath_steel",
    spell: {
      name: "Reinforced Wards",
      description: "Your warding lattice is strung tighter. All shield spells you cast absorb an additional 5 damage.",
      flavorText: "A ward scribbled in haste fails. A ward drafted like a Thalren contract does not.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "shield", "spellguard"]
    },
    rankUpgrades: [
      { description: "Your warding lattice is strung tighter. All shield spells you cast absorb an additional 10 damage." },
      { description: "Your warding lattice is strung tighter. All shield spells you cast absorb an additional 15 damage." }
    ]
  },
  {
    id: "aw_t2_wardens_fortitude",
    name: "Warden's Fortitude",
    icon: "spell_holy_righteousfury",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "aw_t1_arcane_shield",
    spell: {
      name: "Warden's Fortitude",
      description: "While any shield is active on you, you gain +1 Durability Steps to equipped durability.",
      flavorText: "Behind the wall, the body remembers it is a wall.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "defense", "shield", "spellguard"]
    },
    rankUpgrades: [
      { description: "While any shield is active on you, you gain +2 Durability Steps to equipped durability and gain 2 Damage Reduction from all sources." },
      { description: "While any shield is active on you, you gain +3 Durability Steps to equipped durability and gain 2 Damage Reduction from all sources." }
    ]
  },

  {
    id: "aw_t3_barrier_of_protection",
    name: "Barrier of Protection",
    icon: "spell_holy_prayerofhealing",
    maxRanks: 2,
    position: { x: 1.5, y: 2 },
    requires: "aw_t2_reinforced_wards",
    spell: {
      name: "Barrier of Protection",
      description: "Project a ward onto an ally within 30 feet, absorbing 20 damage for 30 seconds.",
      flavorText: "The oath does not say 'protect myself'. Read it again.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { aep: { baseAmount: 15 } },
      durationRounds: 3, durationRealTime: 30, durationUnit: "seconds",
      buffs: ["shield"], visualTheme: "arcane", tags: ["shield", "ally", "defense", "spellguard"]
    },
    rankUpgrades: [
      { description: "Project a ward onto an ally within 30 feet, absorbing 30 damage for 30 seconds." }
    ]
  },
  {
    id: "aw_t3_absorption_mastery",
    name: "Absorption Mastery",
    icon: "spell_arcane_blast",
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: "aw_t2_reinforced_wards",
    spell: {
      name: "Absorption Mastery",
      description: "You squeeze every drop from captured magic. Whenever one of your shields absorbs spell damage, you gain 1 additional AEP.",
      flavorText: "Waste not a syllable of the enemy's argument.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "resource", "aep", "spellguard"]
    },
    rankUpgrades: [
      { description: "You squeeze every drop from captured magic. Whenever one of your shields absorbs spell damage, you gain 2 additional AEP." }
    ]
  },
  {
    id: "aw_t3_elemental_ward",
    name: "Elemental Ward",
    icon: "spell_nature_resistnature",
    maxRanks: 2,
    position: { x: 2.5, y: 2 },
    requires: "aw_t2_wardens_fortitude",
    spell: {
      name: "Elemental Ward",
      description: "Etch a resistance rune on an ally within 30 feet: they gain +4 Damage Reduction to one chosen damage type for 1 minute.",
      flavorText: "Name the poison, and the contract already exists to refuse it.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { aep: { baseAmount: 10 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["resistance"], visualTheme: "arcane", tags: ["resistance", "ally", "spellguard"]
    },
    rankUpgrades: [
      { description: "Etch a resistance rune on an ally within 30 feet: they gain +4 Damage Reduction to one chosen damage type for 1 minute." }
    ]
  },

  {
    id: "aw_t4_mass_shielding",
    name: "Mass Shielding",
    icon: "spell_holy_divineshield",
    maxRanks: 3,
    position: { x: 1.5, y: 3 },
    requires: "aw_t3_barrier_of_protection",
    spell: {
      name: "Mass Shielding",
      description: "Unfold a lattice of wards over all allies within 15 feet, absorbing 10 damage each for 30 seconds.",
      flavorText: "One shield is a tactic. A wall of them is a doctrine.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "ranged", range: 15, aoeShape: "circle", aoeSize: 15,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 25, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { aep: { baseAmount: 20 } },
      durationRounds: 3, durationRealTime: 30, durationUnit: "seconds",
      buffs: ["shield"], visualTheme: "arcane", tags: ["shield", "aoe", "ally", "spellguard"]
    },
    rankUpgrades: [
      { description: "Unfold a lattice of wards over all allies within 15 feet, absorbing 15 damage each for 30 seconds." },
      { description: "Unfold a lattice of wards over all allies within 15 feet, absorbing 20 damage each for 30 seconds." }
    ]
  },
  {
    id: "aw_t4_anti_magic_zone",
    name: "Anti-Magic Zone",
    icon: "spell_shadow_antimagicshell",
    maxRanks: 2,
    position: { x: 2.5, y: 3 },
    requires: "aw_t3_absorption_mastery",
    spell: {
      name: "Anti-Magic Zone",
      description: "Anchor a null-contract over a 15-foot zone for 1 minute: enemy spells cast inside cost 3 additional mana, and allies inside gain +2 Damage Reduction to magical damage.",
      flavorText: "Within the chalk line, all spells are breaching a treaty older than they are.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 15,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { aep: { baseAmount: 15 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["zone"], visualTheme: "arcane", tags: ["zone", "control", "antimagic", "spellguard"]
    },
    rankUpgrades: [
      { description: "Anchor a null-contract over a 15-foot zone for 1 minute: enemy spells cast inside cost 5 additional mana, and allies inside gain +4 Damage Reduction to magical damage." }
    ]
  },

  {
    id: "aw_t5_overflow",
    name: "Overflowing Reservoir",
    icon: "spell_arcane_starfire",
    maxRanks: 2,
    position: { x: 1.5, y: 4 },
    requires: "aw_t4_mass_shielding",
    spell: {
      name: "Overflowing Reservoir",
      description: "When one of your shields is fully consumed, you retain the surplus: gain AEP equal to half the damage that shield absorbed, up to 10 AEP.",
      flavorText: "The barrier does not shatter. It settles its accounts.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "resource", "aep", "spellguard"]
    },
    rankUpgrades: [
      { description: "When one of your shields is fully consumed, you retain the surplus: gain AEP equal to half the damage that shield absorbed, up to 20 AEP." }
    ]
  },
  {
    id: "aw_t5_wardens_sacrifice",
    name: "Warden's Sacrifice",
    icon: "spell_holy_sealofsacrifice",
    maxRanks: 3,
    position: { x: 2.5, y: 4 },
    requires: "aw_t4_anti_magic_zone",
    spell: {
      name: "Warden's Sacrifice",
      description: "For 1 round, all damage that a chosen ally within 30 feet would take is redirected to you instead.",
      flavorText: "The final clause, signed in the first person.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { aep: { baseAmount: 20 } },
      durationRounds: 1, durationRealTime: 6, durationUnit: "seconds",
      buffs: ["sacrifice"], visualTheme: "sacred", tags: ["redirect", "ally", "defense", "spellguard"]
    },
    rankUpgrades: [
      { description: "For 2 rounds, all damage that a chosen ally within 30 feet would take is redirected to you instead." },
      { description: "For 2 rounds, all damage that a chosen ally within 30 feet would take is redirected to you instead, and you gain 6 Damage Reduction from redirected hits." }
    ]
  },

  {
    id: "aw_t6_fortress_mode",
    name: "Fortress Mode",
    icon: "spell_holy_divineprotection",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "aw_t5_overflow",
    spell: {
      name: "Fortress Mode",
      description: "Seal every ward at once: until your next turn, all active shields you maintain absorb double damage and you are immune to magical damage.",
      flavorText: "For six seconds, the battlefield has a load-bearing Spellguard.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 25 } },
      durationRounds: 1, durationRealTime: 6, durationUnit: "seconds",
      buffs: ["fortress"], visualTheme: "sacred", tags: ["ultimate-defense", "immunity", "spellguard"]
    }
  },
  {
    id: "aw_t6_bulwark_doctrine",
    name: "Bulwark Doctrine",
    icon: "ability_warrior_defensivestance",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "aw_t5_wardens_sacrifice",
    spell: {
      name: "Bulwark Doctrine",
      description: "Allies you shield with Barrier of Protection or Mass Shielding gain +2 Durability Steps to equipped durability for the shield's duration.",
      flavorText: "Doctrine is what survives the death of its author.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "shield", "ally", "spellguard"]
    },
    rankUpgrades: [
      { description: "Allies you shield with Barrier of Protection or Mass Shielding gain +4 Durability Steps to equipped durability and immunity to knockdown for the shield's duration." }
    ]
  },
  {
    id: "aw_t6_reflective_ward",
    name: "Reflective Ward",
    icon: "spell_arcane_reflect",
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: "aw_t5_overflow",
    spell: {
      name: "Reflective Ward",
      description: "Wreathe your shields in mirror-force for 30 seconds: 10 points of all damage absorbed by your shields is reflected at the attacker as arcane damage.",
      flavorText: "A defense that answers back.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 5 } },
      durationRounds: 3, durationRealTime: 30, durationUnit: "seconds",
      buffs: ["reflection"], damageTypes: ["arcane"], visualTheme: "arcane", tags: ["reflection", "shield", "spellguard"]
    },
    rankUpgrades: [
      { description: "Wreathe your shields in mirror-force for 30 seconds: 25 points of all damage absorbed by your shields is reflected at the attacker as arcane damage." }
    ]
  },

  {
    id: "aw_t7_ultimate_ward",
    name: "Ultimate Ward",
    icon: "spell_holy_holyprotection",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "aw_t6_fortress_mode",
    spell: {
      name: "Ultimate Ward",
      description: "ULTIMATE: Weave an absolute ward over yourself and all allies within 30 feet, absorbing 60 damage each and granting immunity to all magical effects for 1 minute.",
      flavorText: "This is the clause cities are named after.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { aep: { baseAmount: 30 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["ultimate-ward"], visualTheme: "sacred", tags: ["ultimate", "capstone", "shield", "aoe", "spellguard"]
    }
  },
  {
    id: "aw_t7_aegis_eternal",
    name: "Aegis Eternal",
    icon: "inv_shield_61",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "aw_t6_bulwark_doctrine",
    spell: {
      name: "Aegis Eternal",
      description: "Your wards approach permanence. All shield spells you cast absorb an additional 5 damage.",
      flavorText: "Etched once, renewed without being asked.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "shield", "spellguard"]
    },
    rankUpgrades: [
      { description: "Your wards approach permanence. All shield spells you cast absorb an additional 10 damage." },
      { description: "Your wards approach permanence. All shield spells you cast absorb an additional 15 damage." },
      { description: "Your wards approach permanence. All shield spells you cast absorb an additional 20 damage." },
      { description: "Your wards approach permanence. All shield spells you cast absorb an additional 25 damage and last 50 points longer." }
    ]
  },
  {
    id: "aw_t7_prismatic_bulwark",
    name: "Prismatic Bulwark",
    icon: "spell_arcane_portal_dalaran",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "aw_t6_bulwark_doctrine",
    spell: {
      name: "Prismatic Bulwark",
      description: "Raise a refracting wall over all allies within 20 feet, absorbing 25 damage each for 30 seconds.",
      flavorText: "Light enters, decides against violence, leaves.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "ranged", range: 20, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "long", cooldownValue: 40, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { aep: { baseAmount: 25 } },
      durationRounds: 3, durationRealTime: 30, durationUnit: "seconds",
      buffs: ["shield"], visualTheme: "arcane", tags: ["capstone", "shield", "aoe", "ally", "spellguard"]
    },
    rankUpgrades: [
      { description: "Raise a refracting wall over all allies within 20 feet, absorbing 35 damage each for 30 seconds." },
      { description: "Raise a refracting wall over all allies within 20 feet, absorbing 50 damage each for 30 seconds, and reflecting 25 points of absorbed damage back at attackers as arcane damage." }
    ]
  },
  {
    id: "aw_t7_oathbound",
    name: "Oathbound",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "aw_t6_reflective_ward",
    spell: {
      name: "Oathbound",
      description: "Your reservoir deepens beyond the standard issue: your maximum AEP increases by 5.",
      flavorText: "There is no discharge from this oath.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "resource", "aep", "spellguard"]
    },
    rankUpgrades: [
      { description: "Your reservoir deepens beyond the standard issue: your maximum AEP increases by 10." },
      { description: "Your reservoir deepens beyond the standard issue: your maximum AEP increases by 15, and your AEP no longer decays outside combat." }
    ]
  },
  {
    id: "aw_t7_unchanging_vow",
    name: "Unchanging Vow",
    icon: "spell_holy_blessingofsacrifice",
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: "aw_t6_reflective_ward",
    spell: {
      name: "Unchanging Vow",
      description: "Your ward-work flows without pause: the cooldowns of your shield spells are reduced by 20 points.",
      flavorText: "A promise kept quickly is still a promise kept.",
      source: "talent", class: "Spellguard", treeId: "arcane_warden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "cooldown", "spellguard"]
    },
    rankUpgrades: [
      { description: "Your ward-work flows without pause: the cooldowns of your shield spells are reduced by 35 points." },
      { description: "Your ward-work flows without pause: the cooldowns of your shield spells are reduced by 50 points." }
    ]
  }
];
