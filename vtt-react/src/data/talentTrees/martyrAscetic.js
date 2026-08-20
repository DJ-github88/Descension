// ============================================
// MARTYR — ASCETIC (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The fortress tree: shields, barriers, sanctuary, redirection.
// ============================================

export const MARTYR_ASCETIC = [
  {
    id: "asc_t1_sol_aegis",
    name: "Sol Aegis",
    icon: "spell_holy_divineshield",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Sol Aegis",
      description: "Sol's light forms an unbreakable bastion around you. Gain a shield absorbing 2d6 damage for 1 minute. Costs 1 Devotion.",
      flavorText: "The wall has a saint's name on it.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 1 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["shield"], visualTheme: "sacred", tags: ["shield", "self", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's light forms an unbreakable bastion around you. Gain a shield absorbing 4d6 damage for 1 minute. Costs 1 Devotion." },
      { description: "Sol's light forms an unbreakable bastion around you. Gain a shield absorbing 6d6 damage for 1 minute; when it breaks, it flares for 1d6 sacred damage to adjacent enemies.", damageTypes: ["sacred"], primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "asc_t1_protective_aura",
    name: "Protective Aura",
    icon: "spell_holy_auraoflight",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Protective Aura",
      description: "Sol's protective radiance wraps around your allies. Allies within 10 feet gain +1 Durability Steps to equipped durability.",
      flavorText: "Shade from a stricter sun.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "aura", "ally", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's protective radiance wraps around your allies. Allies within 15 feet gain +2 Durability Steps to equipped durability." },
      { description: "Sol's protective radiance wraps around your allies. Allies within 20 feet gain +2 Durability Steps to equipped durability and 10% resistance to sacred and blight damage.", damageTypes: ["sacred", "blight"] }
    ]
  },
  {
    id: "asc_t1_shield_wall",
    name: "Shield Wall",
    icon: "ability_warrior_shieldwall",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Shield Wall",
      description: "Your martyrdom inspires all who stand beside you. Adjacent allies gain +2 Durability Steps to equipped durability and may use your shield bonus.",
      flavorText: "Stand together or fall separately. Your choice of textbook.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "formation", "ally", "martyr"]
    },
    rankUpgrades: [
      { description: "Your martyrdom inspires all who stand beside you. Adjacent allies gain +3 Durability Steps to equipped durability, your shield bonus, and advantage on saves against being moved." }
    ]
  },

  {
    id: "asc_t2_sacred_barrier",
    name: "Sacred Barrier",
    icon: "spell_holy_devotionaura",
    maxRanks: 3,
    position: { x: 0.5, y: 1.5 },
    requires: "asc_t1_sol_aegis",
    spell: {
      name: "Sacred Barrier",
      description: "Your devotion raises walls of hallowed light. Conjure a 10-foot wall of sacred force within 30 feet (durability 18, 20 health). Enemies cannot pass; allies can. Lasts 1 minute.",
      flavorText: "Zoning, canonized.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "wall", aoeSize: 10,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { devotion: { baseAmount: 2 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["barrier"], visualTheme: "sacred", tags: ["wall", "terrain", "martyr"]
    },
    rankUpgrades: [
      { description: "Your devotion raises walls of hallowed light. Conjure a 15-foot wall (durability 18, 30 health); enemies cannot pass or attack through, allies can. Lasts 1 minute." },
      { description: "Your devotion raises walls of hallowed light. Conjure a 20-foot wall (durability 20, 40 health); enemies cannot pass or attack through, and enemies touching it take 1d6 sacred damage.", damageTypes: ["sacred"], primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "asc_t2_divine_protection",
    name: "Sol Protection",
    icon: "spell_holy_sealofprotection",
    maxRanks: 3,
    position: { x: 3.5, y: 1.5 },
    requires: "asc_t1_protective_aura",
    spell: {
      name: "Sol Protection",
      description: "Sol shelters you from the deadliest of blows. The first time you would take damage each round, you take half instead.",
      flavorText: "The first cut is on the house. The house declines.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "mitigation", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol shelters you from the deadliest of blows. The first TWO times you would take damage each round, you take half instead." },
      { description: "Sol shelters you from the deadliest of blows. All damage you take is reduced by 15%, and the first hit each round is halved." }
    ]
  },

  {
    id: "asc_t3_warding_circle",
    name: "Warding Circle",
    icon: "spell_holy_circleofrenewal",
    maxRanks: 3,
    position: { x: 0.5, y: 3 },
    requires: "asc_t2_sacred_barrier",
    spell: {
      name: "Warding Circle",
      description: "Sol's light seals the realm against otherworldly intrusion. Inscribe a 20-foot circle within 30 feet for 10 minutes: teleportation and planar travel fail inside it. Costs 2 Devotion.",
      flavorText: "Chalk lines with theological backing.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { devotion: { baseAmount: 2 }, mana: { baseAmount: 10 } },
      durationRounds: 60, durationRealTime: 600, durationUnit: "seconds",
      debuffs: ["warded"], visualTheme: "sacred", tags: ["circle", "anti-teleport", "ritual", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's light seals the realm against otherworldly intrusion. Inscribe a 30-foot circle within 30 feet for 10 minutes: teleportation and planar travel fail inside, and summoned creatures inside are banished on a failed save." },
      { description: "Sol's light seals the realm against otherworldly intrusion. Inscribe a 30-foot circle for 10 minutes: teleportation fails, summons are banished on failed save, and enemies inside have disadvantage on magical saves." }
    ]
  },
  {
    id: "asc_t3_impenetrable_barrier",
    name: "Impenetrable Barrier",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 3.5, y: 3 },
    requires: "asc_t2_divine_protection",
    spell: {
      name: "Impenetrable Barrier",
      description: "Your faith makes Sol's barriers utterly impassable. Your Sacred Barrier walls cannot be passed through or attacked through by enemies.",
      flavorText: "The wall does not negotiate. Neither does the faith.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "walls", "martyr"]
    },
    rankUpgrades: [
      { description: "Your faith makes Sol's barriers utterly impassable. Sacred Barriers block enemies and their attacks, and your walls have 20% more health." },
      { description: "Your faith makes Sol's barriers utterly impassable. Sacred Barriers block enemies and attacks, have 20% more health, and reflect 25% of ranged attack damage back at their shooters." }
    ]
  },

  {
    id: "asc_t4_sanctuary",
    name: "Sanctuary",
    icon: "spell_holy_sanctuary",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "asc_t3_warding_circle",
    spell: {
      name: "Sanctuary",
      description: "Sol's presence creates sacred ground where violence falters. Consecrate a 15-foot zone around yourself for 3 rounds: enemies must pass a Spirit save to make an attack inside it. Costs 3 Devotion.",
      flavorText: "Weapons check their hats at the door.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 3 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      debuffs: ["sanctuary"], visualTheme: "sacred", tags: ["zone", "peace", "control", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's presence creates sacred ground where violence falters. Consecrate a 20-foot zone for 4 rounds: enemies must pass a Spirit save to attack inside it, and they save with disadvantage. Costs 3 Devotion." },
      { description: "Sol's presence creates sacred ground where violence falters. Consecrate a 20-foot zone for 5 rounds: enemies who fail the save are also slowed, and allies inside gain +2 Durability Steps to equipped durability. Costs 3 Devotion.", buffs: ["ward"] }
    ]
  },
  {
    id: "asc_t4_sol_bulwark",
    name: "Sol Bulwark",
    icon: "spell_holy_devotionaura",
    maxRanks: 2,
    position: { x: 3, y: 4.5 },
    requires: "asc_t3_impenetrable_barrier",
    spell: {
      name: "Sol Bulwark",
      description: "Your selfless sacrifice shields your allies from harm. For 2 rounds, redirect 25% of all damage that one ally within 30 feet would take to yourself. You take 25% less of the redirected damage.",
      flavorText: "Standing in front is a full-time position.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 45, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 3 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      buffs: ["bulwark"], visualTheme: "sacred", tags: ["redirect", "sacrifice", "ally", "martyr"]
    },
    rankUpgrades: [
      { description: "Your selfless sacrifice shields your allies from harm. For 3 rounds, redirect 25% of all damage one ally would take to yourself; you take 25% less of the redirected damage, and gain 4 temporary health each round it is active." }
    ]
  },

  {
    id: "asc_t5_fortress_of_faith",
    name: "Fortress of Faith",
    icon: "spell_holy_prayerofmendingtga",
    maxRanks: 3,
    position: { x: 1.5, y: 6 },
    requires: "asc_t4_sanctuary",
    spell: {
      name: "Fortress of Faith",
      description: "Your unwavering belief builds a fortress of Sol's grace. Project a 30-foot field for 1 minute: allies inside cannot be critically hit. Costs 3 Devotion.",
      flavorText: "Within these walls, luck is on retainer.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { devotion: { baseAmount: 3 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["fortress"], visualTheme: "sacred", tags: ["field", "crit-immunity", "ally", "martyr"]
    },
    rankUpgrades: [
      { description: "Your unwavering belief builds a fortress of Sol's grace. Project a 30-foot field for 1 minute: allies inside cannot be critically hit and gain +2 Durability Steps to equipped durability. Costs 3 Devotion." },
      { description: "Your unwavering belief builds a fortress of Sol's grace. Project a 40-foot field for 1 minute: allies cannot be crit, gain +2 Durability Steps to equipped durability and +15% resistance to all damage. Costs 3 Devotion." }
    ]
  },
  {
    id: "asc_t5_eternal_guardian",
    name: "Eternal Guardian",
    icon: "spell_holy_heroism",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "asc_t4_sol_bulwark",
    spell: {
      name: "Eternal Guardian",
      description: "Sol grants you eternal vigilance to protect the faithful. While any ally is below half health, you cannot be stunned, paralyzed, or put to sleep.",
      flavorText: "Sleep is for the unguarded.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "tenacity", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol grants you eternal vigilance to protect the faithful. While any ally is below half health, you cannot be stunned, paralyzed, slept, frightened, or knocked prone — and you gain +2 Durability Steps to equipped durability." }
    ]
  },

  {
    id: "asc_t6_invincible_fortress",
    name: "Invincible Fortress",
    icon: "spell_holy_divineintervention",
    maxRanks: 1,
    position: { x: 1, y: 7 },
    requires: "asc_t5_fortress_of_faith",
    spell: {
      name: "Invincible Fortress",
      description: "Your ultimate sacrifice creates Sol's impenetrable sanctuary on earth. For 3 rounds, a 50-foot zone centers on you: all external ranged effects, spells, and projectiles fail at its border; allies inside gain +4 Durability Steps to equipped durability. Enemies already inside may still strike in melee. Costs all Devotion (minimum 4).",
      flavorText: "The siege ends here. The gate stays shut.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: true,
      resourceCosts: { devotion: { baseAmount: 5 }, mana: { baseAmount: 25 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      buffs: ["invincible-fortress"], visualTheme: "sacred", tags: ["ultimate-defense", "zone", "martyr"]
    }
  },
  {
    id: "asc_t6_martyrs_endurance",
    name: "Martyr's Endurance",
    icon: "spell_holy_wordfortitude",
    maxRanks: 2,
    position: { x: 2, y: 7 },
    requires: "asc_t5_fortress_of_faith",
    spell: {
      name: "Martyr's Endurance",
      description: "The body endures what the spirit assigns it. Your maximum health increases by 15.",
      flavorText: "Pain tolerance is also a devotional practice.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "health", "martyr"]
    },
    rankUpgrades: [
      { description: "The body endures what the spirit assigns it. Your maximum health increases by 25, and while below half health you gain +2 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "asc_t6_shared_burden",
    name: "Shared Burden",
    icon: "spell_holy_blessingofsacrifice",
    maxRanks: 2,
    position: { x: 3, y: 7 },
    requires: "asc_t5_eternal_guardian",
    spell: {
      name: "Shared Burden",
      description: "The weight is halved when carried in faith. Damage you redirect through Sol Bulwark is also reduced by your Sol Protection mitigation, and Sol Bulwark's cooldown is reduced by 10 seconds.",
      flavorText: "Carrying is cheaper than dropping.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "synergy", "redirect", "martyr"]
    },
    rankUpgrades: [
      { description: "The weight is halved when carried in faith. Sol Bulwark's redirected damage is reduced by all your mitigation, its cooldown drops 15 seconds, and each redirect restores 2 health to its target." }
    ]
  },

  {
    id: "asc_t7_citadel_of_sol",
    name: "Citadel of Sol",
    icon: "spell_holy_holyprotection",
    maxRanks: 1,
    position: { x: 0, y: 8 },
    requires: "asc_t6_invincible_fortress",
    spell: {
      name: "Citadel of Sol",
      description: "ULTIMATE: You become the last wall that never falls. For 1 minute: your shields absorb double, you are immune to forced movement and control effects, every ally within 30 feet shares your Sol Protection (first hit each round halved), and you regenerate 2d6 health per round. Costs all Devotion (minimum 5).",
      flavorText: "Cities have been built on weaker promises.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 6 }, mana: { baseAmount: 30 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      healing: { dice: "2d6", flat: 0, isHoT: true, hotDuration: 6, hotTick: "2d6" },
      buffs: ["citadel"], visualTheme: "sacred", tags: ["ultimate", "capstone", "defense", "martyr"]
    }
  },
  {
    id: "asc_t7_deep_faith",
    name: "Deep Faith",
    icon: "spell_holy_innerfire",
    maxRanks: 5,
    position: { x: 1, y: 8 },
    requires: "asc_t6_martyrs_endurance",
    spell: {
      name: "Deep Faith",
      description: "The well of devotion has no bottom. Your maximum Devotion increases by 1.",
      flavorText: "Knees, callused. Faith, load-bearing.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "resource", "martyr"]
    },
    rankUpgrades: [
      { description: "The well of devotion has no bottom. Your maximum Devotion increases by 2." },
      { description: "The well of devotion has no bottom. Your maximum Devotion increases by 3." },
      { description: "The well of devotion has no bottom. Your maximum Devotion increases by 4." },
      { description: "The well of devotion has no bottom. Your maximum Devotion increases by 5, and Sol Aegis costs no Devotion." }
    ]
  },
  {
    id: "asc_t7_hallowed_ground",
    name: "Hallowed Ground",
    icon: "spell_holy_circleofrenewal",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: "asc_t6_martyrs_endurance",
    spell: {
      name: "Hallowed Ground",
      description: "Your consecrated spaces remember you. Allies who start their turn inside your Sanctuary or Fortress gain 5 temporary health.",
      flavorText: "The floor takes attendance.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "zone", "ally", "martyr"]
    },
    rankUpgrades: [
      { description: "Your consecrated spaces remember you. Allies who start their turn inside your Sanctuary or Fortress gain 10 temporary health." },
      { description: "Your consecrated spaces remember you. Allies inside your zones gain 10 temporary health and +1 to all saves." }
    ]
  },
  {
    id: "asc_t7_reflective_faith",
    name: "Reflective Faith",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 3, y: 8 },
    requires: "asc_t6_shared_burden",
    spell: {
      name: "Reflective Faith",
      description: "Harm aimed at the faithful returns to sender. 10% of all damage absorbed by your shields is reflected at the attacker as sacred damage.",
      flavorText: "Returned to sender, with blessings.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["passive", "capstone", "reflect", "martyr"]
    },
    rankUpgrades: [
      { description: "Harm aimed at the faithful returns to sender. 20% of all damage absorbed by your shields is reflected as sacred damage." },
      { description: "Harm aimed at the faithful returns to sender. 35% of absorbed damage is reflected as sacred damage, and reflected hits can critically strike." }
    ]
  },
  {
    id: "asc_t7_unyielding",
    name: "Unyielding",
    icon: "spell_holy_unyieldingfaith",
    maxRanks: 3,
    position: { x: 4, y: 8 },
    requires: "asc_t6_shared_burden",
    spell: {
      name: "Unyielding",
      description: "You have made peace with standing. You cannot be moved against your will, and you gain +1 Durability Steps to equipped durability.",
      flavorText: "The Martyr is a load-bearing structure.",
      source: "talent", class: "Martyr", treeId: "ascetic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "tenacity", "martyr"]
    },
    rankUpgrades: [
      { description: "You have made peace with standing. You cannot be moved against your will, gain +2 Durability Steps to equipped durability, and advantage on saves against grapples and restrains." },
      { description: "You have made peace with standing. You cannot be moved, gain +3 Durability Steps to equipped durability, advantage vs grapples, and once per combat you may auto-stabilize at 1 health when reduced below it." }
    ]
  }
];
