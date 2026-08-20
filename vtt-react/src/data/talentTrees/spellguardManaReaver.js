// ============================================
// SPELLGUARD — MANA REAVER (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// ============================================

export const SPELLGUARD_MANA_REAVER = [
  {
    id: "mr_t1_arcane_strike",
    name: "Arcane Strike",
    icon: "spell_holy_blessingofstrength",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Arcane Strike",
      description: "Channel stored AEP into your weapon: your next melee strike this turn deals an additional 1d6 arcane damage.",
      flavorText: "The reservoir also empties through the fist.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { aep: { baseAmount: 5 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["melee", "damage", "spellguard"]
    },
    rankUpgrades: [
      { description: "Channel stored AEP into your weapon: your next melee strike this turn deals an additional 2d6 arcane damage.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Channel stored AEP into your weapon: your next melee strike this turn deals an additional 2d6 arcane damage, refunding 2 AEP if it hits.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "mr_t1_mana_vampirism",
    name: "Mana Vampirism",
    icon: "spell_shadow_manafeed",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Mana Vampirism",
      description: "Your weapon drinks as it cuts: each melee hit drains 1 mana from the target and heals you for 1 health.",
      flavorText: "Every caster is a wineskin with opinions.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "drain", "mana", "spellguard"]
    },
    rankUpgrades: [
      { description: "Your weapon drinks as it cuts: each melee hit drains 2 mana from the target and heals you for 2 health." },
      { description: "Your weapon drinks as it cuts: each melee hit drains 3 mana from the target and heals you for 2 health." }
    ]
  },
  {
    id: "mr_t1_reavers_edge",
    name: "Reaver's Edge",
    icon: "ability_rogue_findweakness",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Reaver's Edge",
      description: "You know exactly where the magic keeps its purse: you gain +1 to hit on attacks against enemies with a mana pool.",
      flavorText: "Aim for where the spell was going to be.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "accuracy", "spellguard"]
    },
    rankUpgrades: [
      { description: "You know exactly where the magic keeps its purse: you gain +2 to hit on attacks against enemies with a mana pool." }
    ]
  },

  {
    id: "mr_t2_empowered_strike",
    name: "Empowered Strike",
    icon: "ability_warrior_innerrage",
    maxRanks: 3,
    position: { x: 1.5, y: 1.5 },
    requires: "mr_t1_arcane_strike",
    spell: {
      name: "Empowered Strike",
      description: "Dump the reservoir through the blade: spend 10 AEP to empower your next melee strike with an additional 3d6 arcane damage.",
      flavorText: "Overdraft approved.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { aep: { baseAmount: 10 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["melee", "damage", "burst", "spellguard"]
    },
    rankUpgrades: [
      { description: "Dump the reservoir through the blade: spend 15 AEP to empower your next melee strike with an additional 4d6 arcane damage.", resourceCosts: { aep: { baseAmount: 15 } }, primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } },
      { description: "Dump the reservoir through the blade: spend 20 AEP to empower your next melee strike with an additional 4d6 arcane damage.", resourceCosts: { aep: { baseAmount: 20 } }, primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "mr_t2_burst_damage",
    name: "Siphoned Fury",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "mr_t1_mana_vampirism",
    spell: {
      name: "Siphoned Fury",
      description: "Stolen mana makes the blade eager: after you drain 5 or more mana in a turn, your next attack deals an additional 1d4 arcane damage.",
      flavorText: "It is not anger. It is inventory.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "drain", "damage", "spellguard"]
    },
    rankUpgrades: [
      { description: "Stolen mana makes the blade eager: after you drain 5 or more mana in a turn, your next attack deals an additional 1d6 arcane damage.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Stolen mana makes the blade eager: after you drain 5 or more mana in a turn, your next attack deals an additional 1d8 arcane damage.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "mr_t3_overcharge",
    name: "Overcharge",
    icon: "spell_lightning_lightningbolt01",
    maxRanks: 3,
    position: { x: 1.5, y: 3 },
    requires: "mr_t2_empowered_strike",
    spell: {
      name: "Overcharge",
      description: "Tear the siphon open: your mana drains pull 1 additional mana, but you take 1 arcane damage each time you drain.",
      flavorText: "The engine does not care about the hose.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "drain", "risk", "spellguard"]
    },
    rankUpgrades: [
      { description: "Tear the siphon open: your mana drains pull 2 additional mana, but you take 1 arcane damage each time you drain." },
      { description: "Tear the siphon open: your mana drains pull 3 additional mana with no cost to you." }
    ]
  },
  {
    id: "mr_t3_mana_burn",
    name: "Wicked Draft",
    icon: "spell_fire_soulburn",
    maxRanks: 3,
    position: { x: 2.5, y: 3 },
    requires: "mr_t2_burst_damage",
    spell: {
      name: "Wicked Draft",
      description: "What you take, you spoil: enemies you drain mana from take 1 arcane damage for every 2 mana drained.",
      flavorText: "Drink rudely.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"], visualTheme: "arcane", tags: ["passive", "drain", "damage", "spellguard"]
    },
    rankUpgrades: [
      { description: "What you take, you spoil: enemies you drain mana from take 1 arcane damage for every 1 mana drained." },
      { description: "What you take, you spoil: enemies you drain mana from take 2 arcane damage for every 1 mana drained." }
    ]
  },

  {
    id: "mr_t4_energy_surge",
    name: "Energy Surge",
    icon: "spell_arcane_manatap",
    maxRanks: 2,
    position: { x: 2, y: 4.5 },
    requires: "mr_t3_overcharge",
    spell: {
      name: "Energy Surge",
      description: "Crack the reservoir open in reverse: spend 15 AEP to instantly restore 20 mana.",
      flavorText: "Conservation is for people with fewer options.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 15 } },
      visualTheme: "arcane", tags: ["resource", "mana", "spellguard"]
    },
    rankUpgrades: [
      { description: "Crack the reservoir open in reverse: spend 15 AEP to instantly restore 30 mana." }
    ]
  },
  {
    id: "mr_t4_arcane_combustion",
    name: "Arcane Combustion",
    icon: "spell_fire_fire",
    maxRanks: 3,
    position: { x: 2.5, y: 4.5 },
    requires: "mr_t3_mana_burn",
    spell: {
      name: "Arcane Combustion",
      description: "Overloaded targets detonate: when you kill an enemy with a melee attack, it erupts for 2d6 arcane damage to all enemies within 10 feet.",
      flavorText: "The last thing it exports is force.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "execution", "aoe", "spellguard"]
    },
    rankUpgrades: [
      { description: "Overloaded targets detonate: when you kill an enemy with a melee attack, it erupts for 3d6 arcane damage to all enemies within 10 feet.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Overloaded targets detonate: when you kill an enemy with a melee attack, it erupts for 4d6 arcane damage to all enemies within 15 feet.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "mr_t5_spell_theft",
    name: "Spell Theft",
    icon: "spell_arcane_portalironforge",
    maxRanks: 2,
    position: { x: 2, y: 6 },
    requires: "mr_t3_mana_burn",
    spell: {
      name: "Spell Theft",
      description: "Why learn when you can take: steal 1 prepared spell from a target you have drained this combat. You may cast it once within 1 minute before it dissolves.",
      flavorText: "Signed, unwitnessed, yours.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { aep: { baseAmount: 20 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      visualTheme: "arcane", tags: ["theft", "utility", "spellguard"]
    },
    rankUpgrades: [
      { description: "Why learn when you can take: steal 2 prepared spells from a target you have drained this combat. You may cast each once within 1 minute before they dissolve." }
    ]
  },
  {
    id: "mr_t5_vampiric_empowerment",
    name: "Vampiric Empowerment",
    icon: "spell_shadow_improvedvampiricembrace",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "mr_t4_energy_surge",
    spell: {
      name: "Vampiric Empowerment",
      description: "The drinking sharpens you: after you have drained 10 or more mana this combat, you gain +1 to hit on melee attacks.",
      flavorText: "Fluid in, fangs out.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "drain", "accuracy", "spellguard"]
    },
    rankUpgrades: [
      { description: "The drinking sharpens you: after you have drained 10 or more mana this combat, you gain +1 to hit and +2 damage on melee attacks." },
      { description: "The drinking sharpens you: after you have drained 10 or more mana this combat, you gain +2 to hit and +4 damage on melee attacks." }
    ]
  },

  {
    id: "mr_t6_mana_rend",
    name: "Mana Rend",
    icon: "spell_shadow_siphonmana",
    maxRanks: 1,
    position: { x: 1.5, y: 7 },
    requires: "mr_t5_vampiric_empowerment",
    spell: {
      name: "Mana Rend",
      description: "Tear the well out entirely: drain all mana from a target within 30 feet (up to 30), gain 5 AEP for every 10 mana drained, and leave the target unable to cast for 1 minute.",
      flavorText: "Not a wound. A repossession.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { aep: { baseAmount: 25 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["silence"], visualTheme: "arcane", tags: ["drain", "silence", "spellguard"]
    }
  },
  {
    id: "mr_t6_leech_ward",
    name: "Leech Ward",
    icon: "spell_shadow_darkritual",
    maxRanks: 2,
    position: { x: 2.5, y: 7 },
    requires: "mr_t5_spell_theft",
    spell: {
      name: "Leech Ward",
      description: "Sheathe yourself in stolen current for 30 seconds: 25 points of the mana you drain is also converted into an arcane shield absorbing up to 10 damage.",
      flavorText: "The levy flows both ways.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 10 } },
      durationRounds: 3, durationRealTime: 30, durationUnit: "seconds",
      buffs: ["shield", "leech"], visualTheme: "arcane", tags: ["drain", "shield", "spellguard"]
    },
    rankUpgrades: [
      { description: "Sheathe yourself in stolen current for 30 seconds: 40 points of the mana you drain is also converted into an arcane shield absorbing up to 25 damage." }
    ]
  },
  {
    id: "mr_t6_hungering_blade",
    name: "Hungering Blade",
    icon: "inv_weapon_shortblade_02",
    maxRanks: 2,
    position: { x: 3.5, y: 7 },
    requires: "mr_t5_vampiric_empowerment",
    spell: {
      name: "Hungering Blade",
      description: "The steel has learned to sip on its own: Arcane Strike and Empowered Strike also drain 2 mana from the target on hit.",
      flavorText: "Feed the weapon and the weapon feeds you.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "drain", "mana", "spellguard"]
    },
    rankUpgrades: [
      { description: "The steel has learned to sip on its own: Arcane Strike and Empowered Strike also drain 4 mana from the target on hit." }
    ]
  },

  {
    id: "mr_t7_aether_reaper",
    name: "Aether Reaper",
    icon: "spell_shadow_soulleech_1",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "mr_t6_mana_rend",
    spell: {
      name: "Aether Reaper",
      description: "ULTIMATE: Harvest the field entire: drain 20 mana from every enemy within 30 feet, deal 3d6 arcane damage to each, gain 2 AEP for every 10 mana drained, and gain +2 to hit for 1 minute.",
      flavorText: "The scythe does not distinguish between wells.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { aep: { baseAmount: 30 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["arcane"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      buffs: ["harvest"], visualTheme: "arcane", tags: ["ultimate", "capstone", "drain", "aoe", "spellguard"]
    }
  },
  {
    id: "mr_t7_deep_siphon",
    name: "Deep Siphon",
    icon: "spell_shadow_lifedrain",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "mr_t6_hungering_blade",
    spell: {
      name: "Deep Siphon",
      description: "The siphon finds deeper veins: all mana you drain is increased by 1.",
      flavorText: "Pump harder. The well is lying about being empty.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "drain", "mana", "spellguard"]
    },
    rankUpgrades: [
      { description: "The siphon finds deeper veins: all mana you drain is increased by 2." },
      { description: "The siphon finds deeper veins: all mana you drain is increased by 3." },
      { description: "The siphon finds deeper veins: all mana you drain is increased by 4." },
      { description: "The siphon finds deeper veins: all mana you drain is increased by 5, and each drain also restores 1 health." }
    ]
  },
  {
    id: "mr_t7_arcane_hunger",
    name: "Arcane Hunger",
    icon: "spell_shadow_shadowward",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "mr_t6_leech_ward",
    spell: {
      name: "Arcane Hunger",
      description: "What flows in does not leave: each time you drain mana, you gain 1 AEP.",
      flavorText: "The hunger is a ledger, and it always balances.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "resource", "aep", "spellguard"]
    },
    rankUpgrades: [
      { description: "What flows in does not leave: each time you drain mana, you gain 2 AEP." },
      { description: "What flows in does not leave: each time you drain mana, you gain 3 AEP." }
    ]
  },
  {
    id: "mr_t7_reavers_momentum",
    name: "Reaver's Momentum",
    icon: "ability_rogue_sprint",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "mr_t6_hungering_blade",
    spell: {
      name: "Reaver's Momentum",
      description: "Drinking puts speed in the blood: after you drain mana, you gain +15 points movement speed for 5 seconds.",
      flavorText: "Somewhere to be, someone to empty.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "mobility", "spellguard"]
    },
    rankUpgrades: [
      { description: "Drinking puts speed in the blood: after you drain mana, you gain +25 points movement speed for 5 seconds." },
      { description: "Drinking puts speed in the blood: after you drain mana, you gain +25 points movement speed and +2 Durability Steps to equipped durability for 5 seconds." }
    ]
  },
  {
    id: "mr_t7_reservoir_bloom",
    name: "Reservoir Bloom",
    icon: "spell_arcane_manaregen",
    maxRanks: 3,
    position: { x: 4, y: 8 },
    requires: "mr_t6_leech_ward",
    spell: {
      name: "Reservoir Bloom",
      description: "The well widens to match the thirst: your maximum AEP increases by 5.",
      flavorText: "Capacity is a kind of appetite.",
      source: "talent", class: "Spellguard", treeId: "mana_reaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "resource", "aep", "spellguard"]
    },
    rankUpgrades: [
      { description: "The well widens to match the thirst: your maximum AEP increases by 10." },
      { description: "The well widens to match the thirst: your maximum AEP increases by 15, and drained mana restores 1 health per 5 mana taken." }
    ]
  }
];
