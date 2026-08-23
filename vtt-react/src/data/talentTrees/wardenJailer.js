// ============================================
// WARDEN — JAILER (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The containment tree: Cage of Vengeance, prisons, punishment.
// ============================================

export const WARDEN_JAILER = [
  {
    id: "wj_t1_cage_of_vengeance",
    name: "Cage of Vengeance",
    icon: "spell_shadow_shackleundead",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Cage of Vengeance",
      description: "Conjure a spectral prison around an enemy within 60 feet for 2 rounds: the caged enemy is restrained, takes +1d6 damage from all sources, and has disadvantage on escape attempts. Costs 6 VP.",
      flavorText: "The sentence is short. The point is made.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { vengeance: { baseAmount: 6 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      debuffs: ["caged"], visualTheme: "shadow", tags: ["cage", "control", "warden"]
    },
    rankUpgrades: [
      { description: "Conjure a spectral prison around an enemy within 60 feet for 3 rounds: restrained, +2d6 damage from all sources, disadvantage on escapes. Costs 6 VP.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, durationRounds: 3, durationRealTime: 18 },
      { description: "Conjure a spectral prison around an enemy within 90 feet for 3 rounds: restrained, +3d6 damage from all sources, disadvantage on escapes, no teleportation. Costs 5 VP.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, resourceCosts: { vengeance: { baseAmount: 5 } } }
    ]
  },
  {
    id: "wj_t1_spectral_warden",
    name: "Spectral Warden",
    icon: "spell_shadow_shackleundead",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Spectral Warden",
      description: "The prison's architecture improves with use. Cage of Vengeance costs 1 less VP, and your VP decay occurs only every 2 turns instead of every turn.",
      flavorText: "A tidy cell block is a calm mind.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "cost", "decay", "warden"]
    },
    rankUpgrades: [
      { description: "The prison's architecture improves with use. Cage of Vengeance costs 2 less VP, and VP decays every 3 turns." },
      { description: "The prison's architecture improves with use. Cage of Vengeance costs 3 less VP, VP decays every 3 turns, and caged enemies grant you 1 VP per round." }
    ]
  },
  {
    id: "wj_t1_mass_confinement",
    name: "Mass Confinement",
    icon: "spell_shadow_blackplague",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Mass Confinement",
      description: "Spend 8 VP: cage all enemies in a 20-foot radius within 60 feet — each cage lasts 2 rounds at reduced strength (restrained, no damage amplification).",
      flavorText: "Group sentencing. Very efficient.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 40, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { vengeance: { baseAmount: 8 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      debuffs: ["caged"], visualTheme: "shadow", tags: ["cage", "aoe", "control", "warden"]
    },
    rankUpgrades: [
      { description: "Spend 8 VP: cage all enemies in a 30-foot radius within 60 feet for 3 rounds — full-strength cages (restrained, +1d6 damage taken).", durationRounds: 3, durationRealTime: 18 }
    ]
  },

  {
    id: "wj_t2_cage_torment",
    name: "Cage Torment",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 0.5, y: 1 },
    requires: "wj_t1_cage_of_vengeance",
    spell: {
      name: "Cage Torment",
      description: "The Ordan ancestor-mounds teach eternal vigilance. Caged enemies take 1d8 blight damage at the start of each of their turns while caged.",
      flavorText: "The bars grind on a schedule.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      isDot: true, dotDuration: 3, dotTick: "1d8",
      visualTheme: "shadow", tags: ["passive", "dot", "cage", "warden"]
    },
    rankUpgrades: [
      { description: "The Ordan ancestor-mounds teach eternal vigilance. Caged enemies take 2d8 blight damage at the start of each of their turns.", dotTick: "2d8" },
      { description: "The Ordan ancestor-mounds teach eternal vigilance. Caged enemies take 3d8 blight damage per turn, and each tick generates 1 VP.", dotTick: "3d8" }
    ]
  },
  {
    id: "wj_t2_enhanced_caging",
    name: "Enhanced Caging",
    icon: "ability_warrior_shieldwall",
    maxRanks: 3,
    position: { x: 3.5, y: 1 },
    requires: "wj_t1_mass_confinement",
    spell: {
      name: "Enhanced Caging",
      description: "Your cages are built to last. Cage of Vengeance lasts 1 additional round, caged enemies cannot teleport or plane shift, and you may spend 1 VP to extend any cage by 1 round.",
      flavorText: "Escape is a design flaw. We fixed it.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "duration", "cage", "warden"]
    },
    rankUpgrades: [
      { description: "Your cages are built to last. Cages last 2 additional rounds, block teleportation, and may be extended by 1 VP per round indefinitely." },
      { description: "Your cages are built to last. Cages last 3 additional rounds, block teleportation, extend freely by VP, and caged enemies cannot be freed by allies." }
    ]
  },

  {
    id: "wj_t3_isolation_protocol",
    name: "Isolation Protocol",
    icon: "spell_holy_sealofwrath",
    maxRanks: 3,
    position: { x: 0.5, y: 2 },
    requires: "wj_t2_cage_torment",
    spell: {
      name: "Isolation Protocol",
      description: "The cage cuts both ways. Caged enemies cannot be targeted by their allies' spells or abilities; allies who try take 2d6 arcane backlash damage.",
      flavorText: "Visiting hours are heavily contested.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "isolation", "cage", "warden"]
    },
    rankUpgrades: [
      { description: "The cage cuts both ways. Caged enemies cannot be buffed or healed by allies; would-be rescuers take 3d6 arcane backlash.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "The cage cuts both ways. Caged enemies are fully isolated (no targeting, no buffs, no healing); rescuers take 4d6 arcane backlash and are themselves caged on a failed save.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wj_t3_prison_complex",
    name: "Prison Complex",
    icon: "spell_shadow_antimagic",
    maxRanks: 3,
    position: { x: 3.5, y: 2 },
    requires: "wj_t2_enhanced_caging",
    spell: {
      name: "Prison Complex",
      description: "You run a full block. You can maintain up to 3 cages simultaneously, and caged enemies within 20 feet of each other share damage — damage to one is split among all caged enemies.",
      flavorText: "The cells are connected. That is the punishment.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "multi-cage", "synergy", "warden"]
    },
    rankUpgrades: [
      { description: "You run a full block. Maintain up to 4 cages; caged enemies within 30 feet share damage, and shared damage counts as damage to each for amplification purposes." },
      { description: "You run a full block. Maintain up to 5 cages; all caged enemies share damage within 40 feet, and when one cage breaks, its remaining torment detonates for 3d6 blight in that cage's space.", damageTypes: ["blight"], primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "wj_t4_execution_chamber",
    name: "Execution Chamber",
    icon: "spell_shadow_deathcoil",
    maxRanks: 3,
    position: { x: 0.5, y: 3 },
    requires: "wj_t3_isolation_protocol",
    spell: {
      name: "Execution Chamber",
      description: "Spend 6 VP to convert a cage into an execution chamber for 3 rounds: the caged enemy takes double damage from all sources and cannot be healed.",
      flavorText: "The room's purpose is in the name.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 6 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      debuffs: ["execution-chamber"], visualTheme: "shadow", tags: ["execute", "amplify", "warden"]
    },
    rankUpgrades: [
      { description: "Spend 6 VP to convert a cage into an execution chamber for 3 rounds: double damage from all sources, no healing, no saves." },
      { description: "Spend 6 VP: the execution chamber deals TRIPLE damage, blocks healing and teleportation, and caged enemies' allies who witness it have disadvantage on their next roll.", }
    ]
  },
  {
    id: "wj_t4_spectral_overlord",
    name: "Spectral Overlord",
    icon: "spell_shadow_shadetruesight",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "wj_t3_prison_complex",
    spell: {
      name: "Spectral Overlord",
      description: "Your cages become immune to dispel magic, and caged enemies generate VP for you equal to half the damage they take. You may teleport between your cages as 1 Action Point.",
      flavorText: "Warden of a growing estate.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "engine", "mobility", "warden"]
    },
    rankUpgrades: [
      { description: "Your cages are dispel-proof, caged enemies generate VP equal to ALL damage they take, and teleporting between cages is a free action that refunds 1 VP." }
    ]
  },

  {
    id: "wj_t5_iron_bars",
    name: "Iron Bars",
    icon: "ability_warrior_shieldmastery",
    maxRanks: 3,
    position: { x: 0.5, y: 4 },
    requires: "wj_t4_execution_chamber",
    spell: {
      name: "Iron Bars",
      description: "The whole prison tightens. Caged enemies have disadvantage on ALL saves, and caged creatures cannot use legendary actions.",
      flavorText: "Legend status revoked at the door.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "saves", "cage", "warden"]
    },
    rankUpgrades: [
      { description: "The whole prison tightens. Caged enemies save with disadvantage, lose legendary actions, and cannot use reactions." },
      { description: "The whole prison tightens. Caged enemies save with disadvantage, lose legendary actions AND reactions, and deal 20 points less damage while caged." }
    ]
  },
  {
    id: "wj_t5_chain_ward",
    name: "Chain Ward",
    icon: "spell_shadow_darkbind",
    maxRanks: 2,
    position: { x: 3.5, y: 4 },
    requires: "wj_t4_spectral_overlord",
    spell: {
      name: "Chain Ward",
      description: "The chains guard their keeper. While at least one enemy is caged, you gain +2 Durability Steps to equipped durability and 2 Damage Reduction to all damage.",
      flavorText: "Someone is always watching the warden. Usually in chains.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "defense", "cage", "warden"]
    },
    rankUpgrades: [
      { description: "The chains guard their keeper. While any enemy is caged, you gain +3 Durability Steps to equipped durability, 4 Damage Reduction against damage, and immunity to forced movement." }
    ]
  },

  {
    id: "wj_t6_vengeance_unleashed",
    name: "Vengeance Unleashed",
    icon: "spell_shadow_demonicempathy",
    maxRanks: 1,
    position: { x: 1.5, y: 5 },
    requires: "wj_t5_iron_bars",
    spell: {
      name: "Vengeance Unleashed",
      description: "Detonate the prison block: all active cages explode, dealing 4d6 blight damage per caged enemy in a 20-foot radius around each cage, then immediately re-form. Enemies caught in any explosion are caged for 3 rounds. Costs all current VP (minimum 4).",
      flavorText: "The riot ends the way it began: suddenly.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 150, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 6 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "4d6", flat: 0, procChance: 100 },
      debuffs: ["caged"], visualTheme: "shadow", tags: ["detonate", "aoe", "cage", "warden"]
    }
  },
  {
    id: "wj_t6_transfer_sentence",
    name: "Transfer Sentence",
    icon: "spell_shadow_soulleech",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "wj_t5_chain_ward",
    spell: {
      name: "Transfer Sentence",
      description: "Prisoners can be moved. When a cage breaks or expires, spend 2 VP to immediately cage the nearest other enemy within 30 feet with the remaining duration.",
      flavorText: "The system never sleeps. It reassigns.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "chain", "cage", "warden"]
    },
    rankUpgrades: [
      { description: "Prisoners can be moved. When a cage breaks, the nearest enemy within 30 feet is caged free with full duration; this can occur once per round." }
    ]
  },
  {
    id: "wj_t6_wardens_attention",
    name: "Warden's Attention",
    icon: "spell_shadow_psychicscream",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "wj_t5_iron_bars",
    spell: {
      name: "Warden's Attention",
      description: "Caged enemies are easier to read: you have advantage on attacks against caged enemies, and they have disadvantage on attacks against you.",
      flavorText: "Hard to swing from inside a box.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "advantage", "cage", "warden"]
    },
    rankUpgrades: [
      { description: "Caged enemies are easier to read: advantage on your attacks against them, disadvantage for theirs, and your allies also gain advantage against caged enemies." }
    ]
  },

  {
    id: "wj_t7_iron_city",
    name: "The Iron City",
    icon: "spell_shadow_shackleundead",
    maxRanks: 1,
    position: { x: 0, y: 6 },
    requires: "wj_t6_vengeance_unleashed",
    spell: {
      name: "The Iron City",
      description: "ULTIMATE: Raise a prison fortress in a 60-foot radius for 1 minute: every enemy inside is caged (restrained, +2d6 damage taken, no teleportation, no ally targeting). Cages regenerate each round, every tick of Cage Torment generates 1 VP, and once during the duration you may convert any cage into an Execution Chamber for free.",
      flavorText: "Somewhere in the ancestor-mounds, the first Warden nods.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { vengeance: { baseAmount: 8 }, mana: { baseAmount: 20 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      debuffs: ["caged"], visualTheme: "shadow", tags: ["ultimate", "capstone", "fortress", "warden"]
    }
  },
  {
    id: "wj_t7_deep_reserves",
    name: "Deep Reserves",
    icon: "ability_warrior_intensifyrage",
    maxRanks: 5,
    position: { x: 1, y: 6 },
    requires: "wj_t6_wardens_attention",
    spell: {
      name: "Deep Reserves",
      description: "The warden's ledger deepens. Your maximum VP increases by 1.",
      flavorText: "More grudges, more room.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "resource", "warden"]
    },
    rankUpgrades: [
      { description: "The warden's ledger deepens. Your maximum VP increases by 2." },
      { description: "The warden's ledger deepens. Your maximum VP increases by 3." },
      { description: "The warden's ledger deepens. Your maximum VP increases by 4." },
      { description: "The warden's ledger deepens. Your maximum VP increases by 5, and cages generate 1 VP per round by default." }
    ]
  },
  {
    id: "wj_t7_cruel_architecture",
    name: "Cruel Architecture",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: "wj_t6_wardens_attention",
    spell: {
      name: "Cruel Architecture",
      description: "The blueprints have teeth. All damage caged enemies take from your Cage Torment is increased by +1d8 damage.",
      flavorText: "Built to spec. The spec was unkind.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "capstone", "dot", "warden"]
    },
    rankUpgrades: [
      { description: "The blueprints have teeth. Cage Torment damage is increased by +2d8 damage." },
      { description: "The blueprints have teeth. Cage Torment damage is increased by +2d8 damage, and Torment ticks can critically strike." }
    ]
  },
  {
    id: "wj_t7_no_escape",
    name: "No Escape",
    icon: "spell_shadow_shadowward",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "wj_t6_transfer_sentence",
    spell: {
      name: "No Escape",
      description: "There is no door with your name on it. Enemies who escape or break a cage take 4d6 blight damage and are slowed by 15 feet for 2 rounds.",
      flavorText: "Technically they got out. Practically, no.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "4d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "capstone", "punish", "warden"]
    },
    rankUpgrades: [
      { description: "There is no door with your name on it. Escapees take 6d6 blight damage, are slowed 15 feet, and cannot hide or turn invisible for 2 rounds.", primaryDamage: { dice: "6d6", flat: 0, procChance: 100 } },
      { description: "There is no door with your name on it. Escapees take 8d6 blight damage, are slowed, cannot hide, and are re-marked for the Shadowblade's knife.", primaryDamage: { dice: "8d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wj_t7_panopticon",
    name: "Panopticon",
    icon: "spell_shadow_truevision",
    maxRanks: 3,
    position: { x: 4, y: 6 },
    requires: "wj_t6_transfer_sentence",
    spell: {
      name: "Panopticon",
      description: "The warden sees every cell. You have truesight against caged enemies, and caged enemies have disadvantage on all rolls.",
      flavorText: "They cannot see you. They know you see them. That is enough.",
      source: "talent", class: "Warden", treeId: "jailer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "vision", "warden"]
    },
    rankUpgrades: [
      { description: "The warden sees every cell. Truesight against caged enemies, who roll all dice with disadvantage and cannot benefit from luck effects." },
      { description: "The warden sees every cell. Truesight against caged enemies, all their rolls at disadvantage, no luck effects, and their natural 20s are downgraded to 19s." }
    ]
  }
];
